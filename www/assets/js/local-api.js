
window.localAPI = (function() {

    const walk = (e, callback) => {
        callback(e)
        Object.entries(e).forEach(([prop, values]) => {
            if (Array.isArray(values)) {
                values.forEach(v => walk(v, callback))
            }
        })
    }

    const updateMeta = (data) => {
        walk(data, v => {
            if (v.id) {
                let id = v.id
                if (id.substr(0,6)!=='/uuid/') {
                    id = '/uuid/'+id
                }
                jsontagMeta.index.id.set(id, new WeakRef(v))
            }
        })
    }

	return {
        reflect: {
            list: function(type) {
                let token
                if (browser.view.requestToken && browser.view.requestEmail) {
                    token = btoa(browser.view.requestEmail+':'+browser.view.requestToken)
                } else {
                    token = '${token}'
                }
                const pageSize = browser.view.pageSize
                const page = parseInt(browser.view.page) - 1
                return `var result = await fetch(
    "${apiURL}/${type}?page=${page}&pageSize=${pageSize}",
    {
        headers: {
            Authorization: \`Basic ${token}\`,
            Accept: 'application/json'
        }
    }
).then(response => response.json())`
            },
            item: function(id) {
                let token
                if (browser.view.requestToken && browser.view.requestEmail) {
                    token = btoa(browser.view.requestEmail+':'+browser.view.requestToken)
                } else {
                    token = '${token}'
                }
                return `var result = await fetch(
    "${apiURL}/uuid/${id}/",
    {
        headers: {
            Authorization: \`Basic ${token}\`,
            Accept: 'application/json'
        }
    }
).then(response => response.json())`
            }
        },
        list: async function(type) {
            return window.slo.api.get(type)
            .then(function(json) {
                updateMeta(json)
                json.data = changes.getLocalView(json.data)
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
            return window.slo.api.get('tree/'+root, {
                niveau, context
            }, true) //jsontag FIXME: detect jsontag from Content-Type headers
            .then(function(json) {
                updateMeta(json)
                walk(json, e => {
                    let id = getId(e);
                    let type = getType(e);
                    e['@id'] = id;
                    e['@type'] = type
                })
                return changes.getLocalView(json)
            })
            .catch(err => {
                if (changes.local[root] && changes.merged[root]['@newValue']) {
                  return changes.getLocalView(changes.local[root])
                }
                throw err
            })
        },
        document: async function(root, context, niveau) {
            if (changes.local[root] && changes.merged[root]['@newValue']) {
                return changes.local[root]
            }
	        return window.slo.api.get('tree/'+root, {
                niveau, context
            }, true) //jsontag FIXME: detect jsontag from Content-Type headers
            .then(function(json) {
                updateMeta(json)
                return changes.getLocalView(json)
            })
        },
        doelniveauList: async function(type) {
	        return window.slo.api.get(type)
            .then(function(json) {
                updateMeta(json)
                return changes.getLocalView(json)
            })
        },
        item: async function(id) {
            try {
                let json = await window.slo.api.get('uuid/'+id+'/')
                updateMeta(json)
                return changes.getLocalView(json)
            } catch(err) {
                if (changes.local[id]) {
                    return changes.getLocalView(changes.local[id])
                }
                throw err
            }
        },
        listOpNiveau: async function(niveau, type) {
            return window.slo.api.get('niveau/'+niveau+'/'+type)
            .then(function(json) {
                updateMeta(json)
                return changes.getLocalView(json)
            })
        },
        itemOpNiveau: async function(niveau, type, id) {
        	return window.slo.api.get('niveau/'+niveau+'/'+type+id)
            .then(function(json) {
                updateMeta(json)
                return changes.getLocalView(json)
            })
        },
        roots: async function(id) {
        	return window.slo.api.get('roots/'+id)
        },
        schemas: async function() {
        	return window.slo.api.get('schemas/', null, true) //jsontag
        }
	}
})()