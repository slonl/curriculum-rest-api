(function() {
    let dataModels = {}
    let editor = null
    window.slo = {
        api: {
            token: 'b3BlbmRhdGFAc2xvLm5sOjM1ODUwMGQzLWNmNzktNDQwYi04MTdkLTlmMGVmOWRhYTM5OQ==',
            login: async function(email,key) {
                let token = btoa(email+':'+key)
                let result = await fetch(window.apiURL + '/login/', {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Basic '+token
                    }
                })
                return result.ok
            },
            logout: function() {
                slo.api.token = 'b3BlbmRhdGFAc2xvLm5sOjM1ODUwMGQzLWNmNzktNDQwYi04MTdkLTlmMGVmOWRhYTM5OQ=='
                return true
            },
            get: function(path, params) {
                var url = new URL(window.apiURL + path);
                if (!params && window.location.search) {
                    url.search = window.location.search;
                }
                if (params) {
                    var args = Object.keys(params).map(function(param) {
                        if (Array.isArray(params[param])) {
                            return params[param].map(value => encodeURIComponent(param)+'='+encodeURIComponent(value)).join('&')
                        } else {
                            return encodeURIComponent(param)+'='+encodeURIComponent(params[param]);
                        }
                    }).filter(Boolean).join('&');
                    url.search = '?' + args;
                }
                return fetch(url, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Basic '+slo.api.token
                    }
                })
                .then(function(response) {
                    var json = response.json();
                    if (response.ok) {
                        return json;
                    }
                    return json.then(Promise.reject.bind(Promise));
                })
                .then(function(json) {
                    if (json.error) {
                        browser.view.error = json.error;
                    } else {
                        browser.view.error = '';
                    }
                    return json;
                })
                .catch(error => {
                    browser.view.error = error.error;
                    browser.view.errorMessage = error.message;
                });
            }
        },
        treeToRows: function(data) {
            let allRows = []
            let allColumns = {}
            let lastIndent = 0
            let count = 0
            let selectedColumns = localStorage.getItem('selectedColumns')
            if (!selectedColumns) {
                selectedColumns = ['id','prefix','title','type','niveaus']
            } else {
                selectedColumns = JSON.parse(selectedColumns)
            }

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
                    .filter((v,k) => (v && typeof v === 'object'))
                    .forEach(n => walk(n,indent,f))
                }
            }

            const countColumnValues = (columns) => {
                Object.keys(columns).forEach(name => {
                    if (!allColumns[name]) {
                        allColumns[name] = {}
                    }
                    if (Array.isArray(columns[name])) {
                        columns[name].forEach(v => {
                            if (!allColumns[name][v]) {
                                allColumns[name][v] = 0;
                            }
                            allColumns[name][v]++
                        })
                    } else {
                        if (!allColumns[name][columns[name]]) {
                            allColumns[name][columns[name]] = 0
                        }
                        allColumns[name][columns[name]]++
                    }
                })
            }

            function getColumns(n) {
                let validColumns = Object.keys(n).filter(c => c[0].match(/[a-z]/))
                let columns = {
                    id: n['@id'],
                    type: n['@type'],
                    niveaus: n.Niveau ? n.Niveau.map(n => n.title) : n.NiveauIndex ? n.NiveauIndex.map(n => n.title) : ''
                }
                validColumns.forEach(column => { columns[column] = n[column]})
                //TODO: add niveaus
                return columns
            }

            walk(data, 0, (n,indent) => {
                if (n.id || n.uuid) {
                    count++
                    let row = {}
                    row.index = count
                    row['data-simply-template'] = 'entity'
                    row.indent = indent;
                    row.columns = getColumns(n)
                    row.node = n
                    let prevIndent = allRows[allRows.length-1]?.indent || 0
                    allRows.push(row)
                    countColumnValues(row.columns)
                    return indent+1
                }
                return indent;
            })
            function capitalize(str) {
              return str[0].toUpperCase()+str.slice(1)
            }
            let columnDefinitions = {
                id: {
                    name: 'ID',
                    value: 'id',
                    checked: true,
                    disabled: true,
                    sortable: false,
                    filterable: false,
                    className: 'slo-minwidth',
                    type: 'id',
                    editor: false
                },
                prefix: {
                    name: 'Prefix',
                    value: 'prefix',
                    checked: true,
                    disabled: false,
                    sortable: true,
                    filterable: true,
                    className: 'slo-small',
                    type: 'tree',
                    viewer: function(rect, offset, el) {
                        let span = el.querySelector('span.slo-indent')
                        let spanRect = span.getBoundingClientRect()
                        this.style.left = (spanRect.left - offset.left)+'px'
                        this.style.width = rect.width - (spanRect.left - rect.left)+'px'
                        this.innerHTML = span.innerHTML
                    }
                },
                title: {
                    name: 'Title',
                    value: 'title',
                    checked: true,
                    disabled: false,
                    sortable: true,
                    filterable: true,
                    type: 'text'
                },
                type: {
                    name: 'Type',
                    value: 'type',
                    checked: true,
                    disabled: false,
                    sortable: true,
                    filterable: true,
                    type: 'list',
                    editor: false
                },
                niveaus: {
                    name: 'Niveaus',
                    value: 'niveaus',
                    checked: true,
                    disabled: false,
                    sortable: true,
                    filterable: true,
                    type: 'list',
                    editor: function(rect, offset, el) {
                        let row = browser.view.sloSpreadsheet.getRow(el)
                        let column = browser.view.sloSpreadsheet.getColumnDefinition(el)
                        let value = row.columns[column.value] || []
                        let allNiveaus = column.values
                        let html = '<form><ul>'
                        allNiveaus.forEach(n => {
                            if (!n.name) {
                                return
                            }
                            let checked = value.includes(n.name) ? ' checked': ''
                            html+=`<li><input type="checkbox"${checked} name="niveaus" value="${n.name}">${n.name}</li>`
                        } )
                        html+='</ul></form>'
                        this.innerHTML = html
                        this.querySelector('input[type="checkbox"]')?.focus()
                    }
                }
            }
            Object.keys(allColumns).forEach(c => {
                let columnValues = Object.keys(allColumns[c])
                let columnDefinition = {
                    name: capitalize(c),
                    value: c,
                    type: 'text',
                    checked: false,
                    disabled: false,
                    sortable: true,
                    filterable: true
                }
                if (columnValues.length<=15) {
                    columnDefinition.type = 'list'
                    columnDefinition.values = Object.keys(allColumns[c]).map(name => {
                        return {
                            name,
                            count: allColumns[c][name]
                        }
                    })
                }
                if (columnDefinitions[c]) {
                    columnDefinitions[c].values = columnDefinition.values
                } else {
                    columnDefinitions[c] = columnDefinition
                }
            })
            for( column of selectedColumns) {
                if (columnDefinitions[column]) {
                    columnDefinitions[column].checked = true
                }
            }
            return {
                rows: allRows,
                columns: Object.values(columnDefinitions)
            }
        },
        getDataModel(name) {
            return dataModels[name]
        },
        getContextByType(type) {
            return Object.keys(contexts)
            .filter(c => {
                let types = Object.values(contexts[c].data)
                return types.includes(type)
            })
            .pop()
        }
    }
})()