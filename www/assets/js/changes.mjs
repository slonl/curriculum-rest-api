/*
this module handles how changes in the data are stored locally, applied to remote data,
how the patch command is filled and how the preview of merged changes is made

TODO: if Examenprogramma X[ExamenprogrammaDomein][n] is removed (replaced with a DeletedLink)
then ExamenprogrammaDomein n[Examenprogramma][X] should also be a DeletedLink
 */

const walk = (node, indent, f) => {
    if (!node) return node;
    if (node['@type']==='Niveau') {
        return node
    }
    let result = null
    if (Array.isArray(node)) {
        return node.map(n => walk(n,indent,f) ?? n)
    } else if (typeof node === 'object' ) {
        indent = f(node, indent)
        Object.entries(node)
        .filter(([k,v]) => {
            if (!Array.isArray(v) || !v.length || k== 'Niveau'|| k[0]=='$' || k[0]=='@') {
                return false
            }
            return true
        })
        .forEach(([k,v]) => { 
            node.$hasChildren=true;
            node[k] = walk(v,indent,f) ?? v;
        })
    }
    return node
}

const changes = (()=> {

	function getDiff(a,b) {
	    let result = {}
	    let toBeRemoved = a.filter(x => !b.find(e => e.id == x.id))
	    let toBeAdded = b.filter(x => !a.find(e => e.id == x.id))
	    if (toBeRemoved.length) {
	        result.toBeRemoved = toBeRemoved
	    }
	    if (toBeAdded.length) {
	        result.toBeAdded = toBeAdded
	    }
	    if (!result.toBeRemoved && !result.toBeAdded) {
	        result = null
	    }
	    return result
	}

	const _ = (o, key) => typeof o[key] !== 'undefined'

	const assert = (data, pattern, key='', parent=null) => {
		if (pattern instanceof Function) {
			if (!parent || !pattern(parent, key)) {
				throw new Error('data does not match', { details: {	data, key }})
			}
		} else if (pattern && typeof pattern == 'object') {
			if (Array.isArray(data)) {
				data.map((element,index) => assert(element, pattern, index, data))
			} else if (!data || typeof data !== 'object') {
				throw new Error('data does not match', { details: { data, key }})
			} else {
				for (const [pKey,pVal] of Object.entries(pattern)) {
					assert(data[pKey], pVal, pKey, data)
				}
			}
		} else if (pattern != data) {
			throw new Error('data does not match', { details: { data, key }})
		}
	}

	const oneOf = (...patterns) => {
		return function(data, key) {
			for(let pattern of patterns) {
				try {
					assert(data[key], pattern)
					return true
				} catch(e) {
				}
			}
			throw new Error('data does not match oneOf', { details: { data, key, patterns }})
		}
	}

	class Change {
		constructor(ch) {
			assert(ch, {
				id: _,
				meta: {
					context: _, //oneOf(...Object.keys(slo.contexts)),
					type: _,
					title: _,
					timestamp: _
				},
				type: oneOf('patch','insert','delete','undelete','new','update'),
				newValue: _,
			})
			if (ch.type!='new' && ch.type!='update') {
				assert(ch, {
					property: _,
					prevValue: _,
					dirty: oneOf(true, false)					
				})
			}
			function hydrate(e) {
				if (e.$mark=='inserted') {
					delete e.$mark
					return new InsertedLink(e)
				}
				if (e.$mark=='deleted') {
					delete e.$mark
					return new DeletedLink(e)
				}
				if (e.$mark=='changed') {
					delete e.$mark
					return new ChangedLink(e)
				}
				return e
			}
			if (Array.isArray(ch.prevValue)) {
				ch.prevValue = ch.prevValue.map( hydrate )
			}
			if (Array.isArray(ch.newValue)) {
				ch.newValue = ch.newValue.map( hydrate )
			}
			Object.assign(this, ch)
		}
	}

	function arrayEquals(property) {
		const getId = v => v.id ?? v['@id'] ?? v['@references']
		let equal = true
		if (property.newValue.length != property.prevValue.length) {
			return false
		}
		property.newValue.forEach((val, i) => {
			if (JSONTag.getType(val)=='object') {
				if (getId(property.prevValue[i]) != getId(val)) {
					equal = false
				}
				if (property.prevValue[i].$mark != val.$mark) {
					equal = false
				}
			} else if (JSONTag.getType(val)=='link') {
				if (property.prevValue[i].value != val.value) {
					equal = false
				}
			} else if (val != property.prevValue[i]) {
				equal = false
			}
		})
		return equal
	}

	class Changes extends Array {
		constructor(arr) {
			if (!arr && globalThis.localStorage && globalThis.localStorage.getItem('changeHistory')) {
				//FIXME: should use jsontag with a reviver to store/retrieve changes
				//that way you can use metadata instead of $mark and @id, @type
				arr = JSON.parse(globalThis.localStorage.getItem('changeHistory'))
			}
			if (!arr) {
				arr = []
			}
			super(...arr.map(ch => new Change(ch)))
		}


		save() {
			if (!globalThis.localStorage) {
				return
			}
			//FIXME: again: use jsontag
			globalThis.localStorage.setItem('changeHistory', JSON.stringify(this))
		}

		merge() {
			let merged = new MergedChanges()
			this.reduce((m, ch) => {
				let foo = this
				if (!m[ch.id]) {
					m[ch.id] = {
						'@id': ch.id,
						'@type': ch.meta.type,
						'@context': ch.meta.context,
						'@title': ch.meta.title,
						'@properties': {}
					}
				}
				if (ch.dirty) {
					m[ch.id]['@dirty']=true
				}
				let me = m[ch.id]
				if (ch.type=='new' || ch.type=='update') {
					me['@newValue'] = ch.newValue
				} else {
					if (!me['@properties'][ch.property]) {
						me['@properties'][ch.property] = {
							prevValue: ch.prevValue
						}
					}
					me['@properties'][ch.property].newValue = ch.newValue
				}
				return m
			}, merged)
			for (let id in merged) {
				let m = merged[id]
				if (!m['@newValue']) {
					// remove properties where newValue == prevValue
					for (let prop of Object.keys(m['@properties'])) {
						if ((Array.isArray(m['@properties'][prop].newValue) && arrayEquals(m['@properties'][prop]))
							|| (m['@properties'][prop].newValue == m['@properties'][prop].prevValue)
						) {
							delete m['@properties'][prop]
						}
					}
					// remove node where @properties is empty
					if (Object.keys(m['@properties']).length===0) {
						delete merged[id]
					}
				}
			}
			return merged
		}
	}

	function getPreviewDiff(m) {
		function showArrayDiff(delta) {
			let s = '<ul>'
			for (let d of delta) {
				if (d.$mark && d.$mark=='deleted') {
					let title = changes.local[d.id]?.title ?? d.title
					s+='<li><del>'+title+'</del></li>'
				} else if (d.$mark && d.$mark=='inserted') {
					let title = changes.local[d.id]?.title ?? d.title
					s+='<li><ins>'+title+'</ins></li>'
				// } else {
				// 	d.value.forEach(v => {
				// 		s+='<li>'+v.id+'</li>'
				// 	})
				}
				s+='</li>'
			}
			s+='</ul>'
			return s
		}
		function showTextDiff(delta) {
			let s = ''
			for (let d of delta) {
				if (d.removed) {
					s+='<del>'+d.value+'</del>'
				} else if (d.added) {
					s+='<ins>'+d.value+'</ins>'
				} else {
					s+=d.value
				}
			}
			return s
		}
		function compareArrayValue(left,right) {
			if (JSONTag.getType(left)=='object') {
				return left.id==right?.id
			} else if (JSONTag.getType(left)=='link') {
				return left.value == right?.value
			} else {
				return left==right
			}
		} 

		let d = ''
		if (m['@newValue']) {
			d += '<label class="changes-diff">Import '+m['@type']+'</label>'
			//TODO: show all properties? or just the title (if available)?
		} else {
			for (let propName in m['@properties']) {
				let prop = m['@properties'][propName]
				if (Array.isArray(prop.newValue)) {
					// let delta = Diff.diffArrays(prop.prevValue, prop.newValue, {
					// 	comparator: compareArrayValue
					// })
					d += '<label class="changes-diff"><div>'+propName+'</div>'+showArrayDiff(prop.newValue)+'</label>'
				} else if (typeof prop.newValue == 'string' || prop.newValue instanceof String) {
					let delta = Diff.diffWords(prop.prevValue, prop.newValue)
					d += '<label class="changes-diff"><div>'+propName+'</div>'+showTextDiff(delta)+'</label>'
				} else {
					throw new Error('Not Yet Implemented (diff only works on arrays and strings)')
				}
			}
		}
		return d
	}

	class MergedChanges {
		normalize() {
			let result = new LocalView()
			Object.keys(this).map(id => {
				let m = this[id]
				let node
				if (m['@newValue']) {
					node = new ChangedNode(m['@newValue'])
					node['@references'] = window.release.apiPath+'uuid/'+id
					//FIXME: check if @type is also set in @newValue
				} else {
					node = new ChangedNode({
						id,
						'@type': m['@type']
					})
				}
				for (let prop in m['@properties']) {
					node.applyChanges(prop, m['@properties'][prop])
				}
				result[id] = node
			})
			return result
		}

		preview() {
			let contexts = {}
			for (let id in this) {
				let context = this[id]['@context']
				if (!contexts[context]) {
					contexts[context] = {}
				}
				let type = this[id]['@type']
				if (!contexts[context][type]) {
					contexts[context][type] = []
				}
				contexts[context][type].push({
					title: this[id]['@title'],
					patch: this[id],
					id: globalThis.release.apiPath+'uuid/'+id,
					diff: getPreviewDiff(this[id])
				})
			}
			let result = []
			for (let context in contexts) {
				let types = []
				for (let type in contexts[context]) {
					types.push({
						type,
						entities: contexts[context][type],
						count: contexts[context][type].length
					})
				}
				result.push({
					context,
					types,
					count: types.reduce((a,t) => a+t.count, 0)
				})
			}
			return result
		}

		// @TODO: if you add a child, then alter it, then remove it
		// only the update is committed, but then the child doesn't exist
		// so filter out those updates
		commit() {
			let commits = []
			for (let id in this) {
				let e = this[id]
				assert(e, {
					'@type': _,
					'@id': id
				})
				if (e['@newValue']) {
					let commit = {
						name: 'newEntity',
						'@type': e['@type'],
						entity: e['@newValue']
					}
					commits.push(commit)
				}
				let dirty = e.dirty ? true : false
				if (e['@properties']) {
					for (let prop in e['@properties']) {
						let commit = {
							id,
							name: 'updateEntity',
							'@type': e['@type'],
							dirty, 
							property: prop,
							prevValue: e['@properties'][prop].prevValue,
							newValue: e['@properties'][prop].newValue
						}
						if (Array.isArray(commit.newValue)) {
							commit.newValue = commit.newValue.filter(v => v.$mark!=='deleted')
						}
						commits.push(commit)
					}
				}
			}

			const getLinks = function() {
				let links = {}
				commits.forEach(commit => {
					if (Array.isArray(commit.newValue)) {
						Object.values(commit.newValue).forEach(v => {
							if (v.id && v?.$mark!='deleted') {
								links[v.id] = v
							}
						})
					}
				})
				return links
			}

			let removed = [0]
			let inserted = Object.keys(changes.insertedNodes)
				.filter(id => changes.merged[id] && !(changes.merged[id]?.['@newValue']))
			while (removed.length) {
				removed = []
				let links = getLinks()
				inserted.forEach(id => {
					if (!links[id]) {
						// remove commits with this id
						commits = commits.filter(c => c.id!=id)
						removed.push(id)
					}
				})
				inserted = inserted.filter(id => removed.indexOf(id)==-1)
			}

			return commits
		}
	}

	class LocalView {
		constructor(nodes) {

		}
		preview() {
			let contexts = {}
			for (let e of this) {
				let context = e['@context']
				if (!contexts[context]) {
					contexts[context] = {}
				}
				let type = e['@type']
				if (!contexts[context][type]) {
					contexts[context][type] = []
				}
				contexts[context][type].push(e)
			}
			return contexts
		}
	}

	class ChangedNode {
		constructor(node) {
			Object.assign(this, node)
		}

		applyChanges(prop, change) {
			this[prop] = change.newValue
		}
	}

	class ChangedLink {
		#actualNode 

		constructor(node) {
			Object.assign(this, node)
			let id = this.id ?? this.uuid
			this.#actualNode = node
			this.$mark = 'changed'
		}

		unwrap() {
			return this.#actualNode
		}
	}

	class DeletedLink {
		#actualNode 

		constructor(node) {
			// only copy literal values, so starting with a lowercase letter
			// don't copy list of children, so they won't show up in te view
			// links (DeletedLink/InsertedLink) only show up as children of
			// parent nodes, never on their own
			for (let key of Object.keys(node)) {
				if ((key[0]>='a' && key[0]<='z') || key[0]=='@') {
					this[key] = node[key]
				}
			}
			this.#actualNode = node
			this.$mark = 'deleted'
		}

		undelete(parentArray) {	
			let index = parentArray.indexOf(this)
			if (index!=-1) {
				parentArray[index] = this.unwrap()
			}
		}

		unwrap() {
			return this.#actualNode
		}

	}

	let insertedNodes = {}

	class InsertedLink {
		#actualNode
		constructor(node) {
			Object.assign(this, node)
			this.#actualNode = node
			let id = this.id ?? this.uuid
			insertedNodes[id] = true
			this.$mark = 'inserted'
		}

		unwrap() {
			return this.#actualNode
		}
	}


	let changeHistory = new Changes()
	let merged = changeHistory.merge()
	let local = merged.normalize()
	let undoHistory = changeHistory.toReversed().slice(0,5)
	let undoSize = changeHistory.length

	const changes = {
		changes: changeHistory,
		merged,
		local,
		undoHistory,
		undoSize,
		getLocalView,
		update,
		clear,
		isInsertedNode: function(id) {
			return insertedNodes[id] ?? false
		},
		Change,
		Changes,
		MergedChanges,
		ChangedNode,
		DeletedLink,
		InsertedLink,
		insertedNodes
	}


	function update() {
		if (changes.changes) {
			changes.changes.save()
		}
		changes.changes = new Changes()
		changes.merged = changes.changes.merge()
		changes.local = changes.merged.normalize()
		changes.undoHistory = changes.changes.toReversed().slice(0, 5)
		changes.undoSize = changes.changes.length
	}

	function clear() {
		if (globalThis.localStorage) {
			globalThis.localStorage.removeItem('changeHistory')
		}
		changes.changes = new Changes()
		insertedNodes = changes.insertedNodes = {}
		changes.update()
	}

	function getLocalView(data) {
		changes.merged = changes.changes.merge()
		changes.local = changes.merged.normalize()
		let local = changes.local
		if (!Array.isArray(data)) {
			data = [data]
		}
		for(let node of data) {
			walk(node, 0, (n) => {
				let id = n.id ?? n.uuid
				if (local[id] && local[id] instanceof ChangedNode) {
					if (!n.$mark) { // don't overwrite deleted or inserted marks, even if changes have been applied later
						n.$mark = 'changed' 
					}
					let localNode = local[id]
					for (let lprop of Object.keys(localNode)) {
						//FIXME: prevValue does not contain all information, so newValue also doesn't
						//need to apply the diff
						n[lprop] = localNode[lprop]
					}
				}
				if (local[id] && local[id] instanceof InsertedLink) {
					debugger
				}
				if (local[id] && local[id] instanceof DeletedLink) {
					debugger
				}
			})
		}
	}

	return changes
})()

export default changes