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
	    let toBeRemoved = a.filter(x => !b.find(e => e.uuid == x.uuid))
	    let toBeAdded = b.filter(x => !a.find(e => e.uuid == x.uuid))
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
			if (ch.type=='insert') {
				assert(ch, {
					child: {
						meta: {
							context: oneOf(...Object.keys(slo.contexts)),
							type: _
						}
					}
				})
			}
			Object.assign(this, ch)
		}
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
				let me = m[ch.id]
				if (!me['@properties'][ch.property]) {
					me['@properties'][ch.property] = {
						prevValue: ch.prevValue
					}
				}
				me['@properties'][ch.property].newValue = ch.newValue
				if (ch.type=='insert') {
					// add the new child to merged as well
					m[ch.child.id] = {
						'@id': ch.child.id,
						'@type': ch.child.type,
						'@context': ch.child.context,
						'@title': ch.child.title ?? '',
						'@properties': {}
					}
				}
				return m
			}, merged)
			for (let id in merged) {
				let m = merged[id]
				// remove properties where newValue == prevValue
				for (let prop of Object.keys(m['@properties'])) {
					if (m['@properties'][prop].newValue === m['@properties'][prop].oldValue) {
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
				}
				if (diff && diff.toBeAdded) {
					// FIXME: try to add elements at the correct spot
					if (!this[prop]) {
						this[prop] = []
					}
					this[prop] = this[prop].concat(diff.toBeAdded.map(n => new InsertedLink(n)))
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

	class InsertedLink {
		#actualNode
		constructor(node) {
			Object.assign(this, node)
			this.#actualNode = node
		}	
	}


	let changeHistory = new Changes()
	let merged = changeHistory.merge()
	let local = merged.normalize()
	let undoHistory = changeHistory.toReversed().slice(0,5)

	const changes = {
		changes: changeHistory,
		merged,
		local,
		undoHistory,
		getLocalView,
		update,
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
				let id = '/uuid/'+n.uuid
				if (local[id] && local[id] instanceof ChangedNode) {
					n['@mark'] = 'changed'
					let localNode = local[id]
					for (let nprop of Object.keys(n)) {
						if (typeof localNode[nprop] != 'undefined') {
							n[nprop] = localNode[nprop]
						}
					}
				}
			})
		}
	}

	return changes
})()