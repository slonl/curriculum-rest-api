/*
this module handles how changes in the data are stored locally, applied to remote data,
how the patch command is filled and how the preview of merged changes is made
*/

if (!globalThis.jsontagMeta) {
    globalThis.jsontagMeta = {}
}

const walk = (node, f) => {
    if (!node) return node;
    if (node['@type']==='Niveau') {
        return node
    }
    let result = null
    if (Array.isArray(node)) {
        return node.map(n => walk(n,f) ?? n)
    } else if (typeof node === 'object' ) {
        f(node)
        Object.entries(node)
        .filter(([k,v]) => {
            if (!Array.isArray(v) || !v.length || k== 'Niveau'|| k[0]=='$' || k[0]=='@') {
                return false
            }
            return true
        })
        .forEach(([k,v]) => { 
            node.$hasChildren=true;
            node[k] = walk(v,f) ?? v;
        })
    }
    return node
}

/**
 * This class is a placeholder (tombstone) for an entity that was linked
 * in a parent entity array, but is now deleted.
 */
class DeletedLink {
    #actualNode;
    constructor(node) {
        Object.assign(this, node)
        this.#actualNode = node
    }

    get $mark() {
        return 'deleted'
    }

    set $mark($foo) {
        return true
    }

    unwrap() {
        return this.#actualNode
    }

    undelete(parentArray) {
        let index = parentArray.indexOf(this)
        if (index!=-1) {
            parentArray[index] = this.unwrap()
        }
    }

    toJSON() {
        let result = Object.assign({}, this)
        result.$mark = 'deleted'
        return result
    }

    toJSONTag() {
        return this.toJSON()
    }
}

/**
 * This class is a wrapper for an entity that has been inserted
 * into a parent entity array
 * The actualNode may be a new entity, or an existing one.
 */
class InsertedLink {
    #actualNode;
    constructor(node) {
        Object.assign(this, node)
        this.#actualNode = node
    }

    get $mark() {
        return 'inserted'
    }

    set $mark($foo) {
        return true
    }

    unwrap() {
        return this.#actualNode
    }

    toJSON() {
        let result = Object.assign({}, this)
        result.$mark = 'inserted'
        return result
    }

    toJSONTag() {
        return this.toJSON()
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
                throw new Error('data does not match', { details: {    data, key }})
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

    function hydrate(e) {
        if (e.$mark=='inserted') {
            return new InsertedLink(e)
        }
        if (e.$mark=='deleted') {
            return new DeletedLink(e)
        }
        return e
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
                type: oneOf('patch','insert','delete','deleteRoot','undelete','undeleteRoot','new','update'),
            })
            if (ch.type!='deleteRoot' && ch.type!='undeleteRoot') {
                assert(ch, {
                    newValue: _,
                })
            }
            if (ch.type!='new' && ch.type!='update' && ch.type!='deleteRoot' && ch.type!='undeleteRoot') {
                assert(ch, {
                    property: _,
                    prevValue: _,
                    dirty: oneOf(true, false)                    
                })
            }
            if (Array.isArray(ch.newValue)) {
                ch.newValue = ch.newValue.map(hydrate)
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

    function linkifyObject(ob) {
        if (isUnchangedNode(ob)) {
            return new JSONTag.Link('/uuid/'+ob.id)
        }
        for (let prop in ob) {
            if (isUnchangedNode(ob[prop])) {
                ob[prop] = linkifyObject(ob[prop])
            } else if (Array.isArray(ob[prop])) {
                linkify(ob[prop])
            }
        }
        return ob
    }

    function isUnchangedNode(node) {
        return (node && node.id && !node.$mark)
    }

    function isDeletedNode(node) {
        return (node && node.id && node.$mark=='deleted')
    }

    function isInsertedNode(node) {
        return (node && node.id && node.$mark=='inserted')
    }

    function linkify(arr) {
        if (!Array.isArray(arr)) {
            if (isUnchangedNode(arr)) {
                arr = linkifyObject(arr)
            }
            return arr
        }
        arr.forEach((node, key) => {
            if (isUnchangedNode(node)) {
                arr[key] = new JSONTag.Link('/uuid/'+node.id)
            } else if (node.id) {
                Object.keys(node).forEach(prop => {
                    if (Array.isArray(node[prop])) {
                        linkify(node[prop])
                    } else if (isUnchangedNode(node[prop])) {
                        node[prop] = linkifyObject(node[prop])
                    }
                })
            }
        })
        return arr
    }

    class Changes extends Array {
        #log = [];
        constructor(arr) {
            super()
            if (!arr && globalThis.localStorage && globalThis.localStorage.getItem('changeHistory')) {
                this.#log = globalThis.localStorage.getItem('changeHistory').split("\n")
                for (let line of this.#log) {
                    if (!line.length) {
                        continue
                    }
                    let change = new Change(JSONTag.parse(line, null, globalThis.jsontagMeta))
                    this.push(change)
                }
            }
        }

        save() {
            if (!globalThis.localStorage) {
                throw new Error('Cannot store changes, localStorage is unavailable')
            }
            // only save new additions to the log
            let start = Math.max(this.#log?.length-1,0)
            for (let i=start; i<this.length; i++) {
                let change = this[i]
                if (change.prevValue && Array.isArray(change.prevValue)) {
                    change.prevValue = linkify(change.prevValue)
                }
                if (change.newValue && Array.isArray(change.newValue)) {
                    change.newValue = linkify(change.newValue)
                }
                this.#log.push(JSONTag.stringify(change))
            }
            globalThis.localStorage.setItem('changeHistory', this.#log.join("\n"))
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
                } else if (ch.type=='deleteRoot') {
                    me['@deleted'] = true
                } else if (ch.type=='undeleteRoot') {
                    me['@deleted'] = false
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
                if (!m['@newValue'] && (typeof m['@deleted']=='undefined')) {
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
                //     d.value.forEach(v => {
                //         s+='<li>'+v.id+'</li>'
                //     })
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
                    //     comparator: compareArrayValue
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
                    node = Object.assign({},m['@newValue'])
                    node['@references'] = window.release.apiPath+'uuid/'+id
                    //FIXME: check if @type is also set in @newValue
                } else {
                    node = {
                        id,
                        '@type': m['@type']
                    }
                }
                for (let prop in m['@properties']) {
                    node[prop] = m['@properties'][prop]?.newValue
                }
                if (typeof m['@deleted']!='undefined' && m['@deleted']) {
                    node.deleted = m['@deleted']
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
            function clean(entries) {
                if (Array.isArray(entries)) {
                    entries = entries.map(clean).filter(Boolean)
                } else if (entries && typeof entries=='object') {
                    if (entries.$mark=='deleted') {
                        return null
                    }
                    Object.keys(entries).forEach(prop => {
                        if (prop[0]=='$' && prop!=='$mark') {
                            delete entries[prop]
                        } else if (Array.isArray(entries[prop])) {
                            entries[prop] = entries[prop].map(clean).filter(Boolean)
                        } else if (entries[prop] && typeof entries[prop]=='object') {
                            entries[prop] = clean(entries[prop])
                        }
                    })
                }
                return entries
            }

            let commits = []
            for (let id in this) {
                let e = this[id]
                assert(e, {
                    '@type': _,
                    '@id': id
                })
                if (e['@newValue']) {
                    let commit = {
                        name: 'importEntity',
                        '@type': e['@type'],
                        entity: clean(e['@newValue'])
                    }
                    commits.push(commit)
                }
                let dirty = e.dirty ? true : false
                if (e['@deleted']) {
                    let commit = {
                        id,
                        name: 'deleteEntity',
                        '@type': e['@type']
                    }
                    commits.push(commit)
                } else if (e['@deleted']==false) {
                    let commit = {
                        id,
                        name: 'undeleteEntity',
                        '@type': e['@type']
                    }
                    commits.push(commit)                    
                }
                if (e['@properties']) {
                    for (let prop in e['@properties']) {
                        let commit = {
                            id,
                            name: 'updateEntity',
                            '@type': e['@type'],
                            dirty, 
                            property: prop,
                            prevValue: clean(e['@properties'][prop].prevValue),
                            newValue: clean(e['@properties'][prop].newValue)
                        }
                        // if (Array.isArray(commit.newValue)) {
                        //     commit.newValue = commit.newValue.filter(v => v.$mark!=='deleted')
                        // }
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

    let insertedNodes = {}
    let localEntities = {}

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
        insertedNodes,
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
        if (globalThis.localStorage) {
            globalThis.localStorage.removeItem('changeHistory')
        }
        changes.changes = new Changes()
        insertedNodes = changes.insertedNodes = {}
        changes.update()
    }

    function resolveLink(node, prop) {
        if (JSONTag.getType(node[prop])=='link') {
            let id = ''+node[prop]
            if (globalThis.jsontagMeta.index.id.has(id)) {
                node[prop] = globalThis.jsontagMeta.index.id.get(id).deref()
            }
        }
    }

    function isLiteral(prop) {
        let literalRe = /^a-z_@\$/i
        return literalRe.exec(prop[0])
    }

    function getLocalEntity(node) {
        node = JSONTag.clone(node)
        let localNode = localEntities[node.id]
        if (localNode) {
            for (let prop in localNode) {
                if (isLiteral(prop)) {
                    node[prop] = localNode[prop]
                } else if (Array.isArray(localNode[prop])) {
                    node[prop] = localNode[prop].map(e => {
                        if (e.$mark) {
                            return e
                        }
                        if (JSONTag.getType(e)=='link') {
                            let o = jsontagMeta.index.id.get(''+e)?.deref()
                            if (o) {
                                return o
                            }
                        }
                        if (!e?.id) {
                            return e
                        }
                        let id = e.id
                        if (id.substr(0,6)!=='/uuid/') {
                            id = '/uuid/'+id
                        }
                        return jsontagMeta.index.id.get(id).deref()
                    })
                }
            }
        }
        walk(node, node => {
            for (let prop of Object.keys(node)) {
                if (Array.isArray(node[prop])) {
                    node[prop].forEach((v,i) => {
                        if (v.id && localEntities[v.id]) {
                            v = localEntities[v.id]
                            Object.assign(node[prop][i], v)
                        }
                        resolveLink(node[prop],i)
                    })
                } else if (node[prop]?.id && localEntities[node[prop].id]) {
                    Object.assign(node[prop], localEntities[node[prop].id])
                }
                resolveLink(node, prop)
            }
        })
        return node
    }

    function getLocalView(nodes) {
        // let dataOut = structuredClone(dataIn)
        changes.merged = changes.changes.merge()
        changes.local = changes.merged.normalize()
        walk(Object.values(changes.local), node => {
            if (!node?.id) {
                return
            }
            if (!localEntities[node.id]) {
                localEntities[node.id] = Object.assign({}, node)
            } else {
            	localEntities[node.id] = Object.assign({}, localEntities[node.id], node)
            }
        })
        if (!Array.isArray(nodes)) {
            nodes = JSONTag.clone(nodes)
            nodes = getLocalEntity(nodes)
        } else {
            nodes = nodes.slice()
        	nodes.forEach((node, index) => {
        		nodes[index] = getLocalEntity(node)
        	})
        }
        return nodes
    }

    return changes
})()

export default changes