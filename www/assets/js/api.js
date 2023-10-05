    let dataModels = {}
    window.slo = {
        api: {
            get: function(path, params) {
                var url = window.apiURL + path;
                if (!params && window.location.search) {
                    url = url + window.location.search;
                }
                if (params) {
                    var args = Object.keys(params).map(function(param) {
                        if (Array.isArray(params[param])) {
                            return params[param].map(value => encodeURIComponent(param)+'='+encodeURIComponent(value)).join('&')
                        } else {
                            return encodeURIComponent(param)+'='+encodeURIComponent(params[param]);
                        }
                    }).filter(Boolean).join('&');
                    url = url + '?' + args;
                }
                return fetch(url, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Basic b3BlbmRhdGFAc2xvLm5sOjM1ODUwMGQzLWNmNzktNDQwYi04MTdkLTlmMGVmOWRhYTM5OQ=='
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
        spreadsheet: function(name, data) {
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
            let allRows = []
            let allColumns = {}
            let lastIndent = 0
            let count = 0
            walk(data, 0, (n,indent) => {
                if (n.id || n.uuid) {
                    count++
                    let row = {}
                    row.index = count
                    row.indent = 'slo-indent-'+indent;
                    let prevIndent = allRows[allRows.length-1]?.indent || 0
                    Object.keys(n).filter(k => /[a-z@]/.test(k[0])).forEach(k => {
                        row[k] = n[k]
                    })
                    if (n.NiveauIndex) {
                        row.Niveaus = n.NiveauIndex.map(ni => ni.Niveau)
                    } else if (n.Niveau) {
                        row.Niveaus = n.Niveau
                    }
                    if (row.Niveaus) {
                        row.Niveaus = row.Niveaus.map(n => n.title)
                    }
                    if (Object.keys(row).length) {
                        allRows.push(row)
                        Object.keys(row).forEach(c => {
                            if (!allColumns[c]) {
                                allColumns[c] = new Set()
                            }
                            if (allColumns[c].size<16) {
                                if (Array.isArray(row[c])) {
                                    row[c].forEach(v => allColumns[c].add(v))
                                } else {
                                    allColumns[c].add(row[c])
                                }
                            }
                        })
                    }
                    return indent+1
                }
                return indent;
            })
            Object.keys(allColumns).forEach(c => {
                allColumns[c] = Array.from(allColumns[c])
            })
            let datamodel = simply.viewmodel.create(name, allRows, {
              offset: 0,
              rows: 15,
              rowHeight: 27,
              columns: allColumns,
              closed: {}
            });
            datamodel.addPlugin('render', function(params) {
              if (params.offset) {
                this.options.offset = params.offset
              }
              if (params.rows) {
                this.options.rows = params.rows
              }
              start = this.options.offset
              end = start + this.options.rows
              if (end>this.view.data.length) {
                end = this.view.data.length;
                start = end - this.options.rows;
              }
              if (start>0 || end<this.data.length) {
                  this.view.data = this.view.data.slice(start, end)
              }
            });
            //@FIXME: this doesn't work on a sorted table
            //only if the sort is 'prefix'
            datamodel.addPlugin('select', function(params) {
              // open/close objects as a tree
              if (params.toggle) {
                if (this.options.closed[params.toggle]) {
                  delete this.options.closed[params.toggle]
                } else {
                  this.options.closed[params.toggle]=true
                }
              }
              let closedSubtree = []
              this.view.data = this.view.data.filter(r => {
                let closed = closedSubtree.length?closedSubtree[closedSubtree.length-1]:0
                if (closed && closed<r.indent) {
                    return false
                }
                if (closed && closed>=r.indent) {
                    closedSubtree.pop()
                }
                if (this.options.closed[r.uuid]) {
                    r.closed = 'closed'
                    closedSubtree.push(r.indent)
                } else {
                    r.closed = ''
                }
                return true
              })
              this.options.visibleRows = this.view.data.length;
            });
            const sortNames = {
                Titel: 'title',
                Prefix: 'prefix',
                Type: '@type'
            }
            //@FIXME: sort and toggle tree don't work together
            //toggle should come first, sort the remainder
            //@FIXME: this is wastefull, memoize sorted data so 
            //we dont have to sort for each update
            datamodel.addPlugin('start', simply.viewmodel.createSort({
                name: 'propSort',
                sortBy: 'prefix',
                sortDirection: 'ascending',
                getSort: function(params) {
                    if (!params.sortBy || params.sortBy=='Prefix') {
                        return (a,b) => 0
                    }
                    if (params.sortDirection=='ascending') {
                        return (a,b) => {
                            return (a[sortNames[params.sortBy]]<b[sortNames[params.sortBy]])
                        }
                    } else {
                        return (a,b) => {
                            return (a[sortNames[params.sortBy]]>b[sortNames[params.sortBy]])
                        }
                    }
                }
            }));
            dataModels[name] = datamodel
            datamodel.update();
            return datamodel;
        },
        getDataModel(name) {
            return dataModels[name]
        },
        getContextByType(type) {
            return Object.keys(contexts)
            .filter(c => typeof contexts[c].data[type]!=='undefined')
            .pop()
        }
    }

