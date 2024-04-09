/*
this module handles how changes in the data are stored locally, applied to remote data,
how the patch command is filled and how the preview of merged changes is made

TODO: if Examenprogramma X[ExamenprogrammaDomein][n] is removed (replaced with a DeletedLink)
then ExamenprogrammaDomein n[Examenprogramma][X] should also be a DeletedLink
 */

const walk = (node, indent, f) => {
    if (!node) return;
    if (node['@type']==='Niveau') {
        return
    }
    if (Array.isArray(node)) {
        node.forEach(n => walk(n,indent,f))
    } else if (typeof node === 'object' ) {
        indent = f(node, indent)
        Object.entries(node)
        .filter(([k,v]) => {
            if (!Array.isArray(v) || !v.length || k== 'Niveau') {
                return false
            }
            return true
        })
        .forEach(([k,v]) => { 
            walk(v,indent,f); 
            node.hasChildren=true; 
        })
    }
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
					context: oneOf(...Object.keys(slo.contexts)),
					type: _,
					title: _,
					timestamp: _
				},
				type: oneOf('patch','insert','delete','undelete'),
				property: _,
				prevValue: _,
				newValue: _,
				dirty: oneOf(true, false)
			})
			if (Array.isArray(ch.prevValue)) {
				ch.prevValue = ch.prevValue.filter(e => !(e instanceof DeletedLink))
			}
			if (Array.isArray(ch.newValue)) {
				ch.newValue = ch.newValue.filter(e => !(e instanceof DeletedLink))
			}
			Object.assign(this, ch)
		}
	}

	function arrayEquals(property) {
		if (property.newValue.length != property.prevValue.length) {
			return false
		}
		let changed = false
		property.newValue.forEach((val, i) => {
			if (JSONTag.getType(val)=='object') {
				if (property.prevValue[i].id != val.id) {
					changed = true
				}
			} else if (JSONTag.getType(val)=='link') {
				if (property.prevValue[i].value != val.value) {
					changed = true
				}
			} else if (val != property.prevValue[i]) {
				changed = true
			}
		})
		return changed
	}

	class Changes extends Array {
		constructor(arr) {
			if (!arr && localStorage.getItem('changeHistory')) {
				arr = JSON.parse(localStorage.getItem('changeHistory'))
			}
			if (!arr) {
				arr = []
			}
			super(...arr.map(ch => new Change(ch)))
		}


		save() {
			localStorage.setItem('changeHistory', JSON.stringify(this))
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
				if (!me['@properties'][ch.property]) {
					me['@properties'][ch.property] = {
						prevValue: ch.prevValue
					}
				}
				me['@properties'][ch.property].newValue = ch.newValue
				return m
			}, merged)
			for (let id in merged) {
				let m = merged[id]
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
			return merged
		}
	}

	class MergedChanges {
		normalize() {
			let result = new LocalView()
			Object.keys(this).map(id => {
				let m = this[id]
				let node = new ChangedNode({
					id,
					'@type': m['@type'],
					title: m['@title']
				})
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
					patch: this[id]
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

		commit() {
			let commit = []
			for (let id in this) {
				let e = this[id]
				assert(e, {
					'@type': _,
					'@id': id
				})
				let dirty = e.dirty ? true : false
				for (let prop in e['@properties']) {
					commit.push({
						id,
						'@type': e['@type'],
						dirty, 
						property: prop,
						prevValue: e['@properties'][prop].prevValue,
						newValue: e['@properties'][prop].newValue
					})
				}
			}
			return commit
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
		applyChanges(prop, change) {
			if (Array.isArray(change.newValue) || Array.isArray(change.prevValue)) {
				const diff = getDiff(change.prevValue, change.newValue)
				if (diff && diff.toBeRemoved) {
					this[prop] = change.prevValue.map(n => {
						let i = diff.toBeRemoved.indexOf(n)
						if (i!=-1) {
							return new DeletedLink(n)
						}
						return n
					})
				} else {
					this[prop] = change.prevValue
				}
				if (diff && diff.toBeAdded) {
					// FIXME: try to add elements at the correct spot
					this[prop] = diff.toBeAdded.map(n => new InsertedLink(n)).concat(this[prop])
				}
			} else {
				this[prop] = change.newValue
			}
			console.log(this)
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
		}

		undelete(parentArray) {
			let index = parentArray.indexOf(this)
			if (index!=-1) {
				parentArray[index] = this.#actualNode
			}
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
		InsertedLink
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
		localStorage.removeItem('changeHistory')
		changes.changes = new Changes()
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
					n['@mark'] = 'changed'
					let localNode = local[id]
					for (let lprop of Object.keys(localNode)) {
						n[lprop] = localNode[lprop]
					}
				}
			})
		}
	}

	return changes
})()