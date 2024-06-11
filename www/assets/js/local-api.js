
window.localAPI = (function() {

    const walk = (e, callback) => {
        callback(e)
        Object.entries(e).forEach(([prop, values]) => {
            if (Array.isArray(values)) {
                values.forEach(v => walk(v, callback))
            }
        })
    }

	return {
        list: async function(type) {
            return window.slo.api.get(window.release.apiPath+type, {
                pageSize: browser.view.pageSize,
                page: parseInt(browser.view.page)-1
            })
            .then(function(json) {
                changes.getLocalView(json.data)
                let typeName = window.titles[type]
                //add inserted entities matching type -> get typeName from type
                Object.values(changes.merged)
                .filter(e => e['@type']==typeName && e['@newValue'])
                .forEach(e => {
                    json.data.unshift(new changes.InsertedLink(changes.local[e['@id']]))
                })
                return json
            })
        },
        spreadsheet: async function(root, context, niveau) {
            if (changes.local[root] && changes.merged[root]['@newValue']) {
                return changes.local[root]
            }
            return window.slo.api.get(window.release.apiPath+'tree/'+root, {
                niveau, context
            }, true) //jsontag FIXME: detect jsontag from Content-Type headers
            .then(function(json) {
                walk(json, e => {
                    let id = getId(e);
                    let type = getType(e);
                    e['@id'] = id;
                    e['@type'] = type
                })
                changes.getLocalView(json)
                //add inserted entities matching root, context, niveau
                return json
            })
        },
        document: async function(root, context, niveau) {
            if (changes.local[root] && changes.merged[root]['@newValue']) {
                return changes.local[root]
            }
	        return window.slo.api.get(window.release.apiPath+'tree/'+root, {
                niveau, context
            }, true) //jsontag FIXME: detect jsontag from Content-Type headers
            .then(function(json) {
                changes.getLocalView(json)
                //add inserted entities matching root, context, niveau
                return json 
            })
        },
        doelniveauList: async function(type) {
	        return window.slo.api.get(window.release.apiPath+type)
            .then(function(json) {
                changes.getLocalView(json.data)
                //add inserted entities matching type
                return json
            })
        },
        item: async function(id) {
            if (changes.local[id] && changes.merged[id]['@newValue']) {
                return changes.local[id]
            }
	        return window.slo.api.get(window.release.apiPath+'uuid/'+id+'/')
            .then(function(json) {
                changes.getLocalView(json)
                return json
            })
        },
        listOpNiveau: async function(niveau, type) {
            return window.slo.api.get(window.release.apiPath+'niveau/'+niveau+'/'+type)
            .then(function(json) {
                changes.getLocalView(json)
                //add inserted entities matching type, niveau
                return json
            })
        },
        itemOpNiveau: async function(niveau, type, id) {
        	return window.slo.api.get(window.release.apiPath+'niveau/'+niveau+'/'+type+id)
            .then(function(json) {
                changes.getLocalView(json)
                return json
            })
        },
        roots: async function(id) {
        	return window.slo.api.get(window.release.apiPath+'roots/'+id)
        },
        schemas: async function() {
        	return window.slo.api.get(window.release.apiPath+'schemas/', null, true) //jsontag
        }
	}
})()