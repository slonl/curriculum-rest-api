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
                        return encodeURIComponent(param)+'='+encodeURIComponent(params[param]);
                    }).join('&');
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
            let lastIndent = 0
            walk(data, 0, (n,indent) => {
                if (n.uuid) {
                    let row = {}
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

                    if (Object.keys(row).length) {
                        allRows.push(row)
                    }
                    return indent+1
                }
                return indent;
            })
            let datamodel = simply.viewmodel.create(name, allRows, {
              offset: 0,
              rows: 15,
              rowHeight: 27,
              closed: {}
            });
            datamodel.addPlugin('render', function(params) {
              start = this.options.offset
              end = start + this.options.rows
              if (end>this.view.data.length) {
                end = this.view.data.length;
                start = end - this.options.rows;
              }
              this.view.data = this.view.data.slice(start, end)
            });
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
            });
            const sortNames = {
                Titel: 'title',
                Prefix: 'prefix',
                Type: '@type'
            }
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
            datamodel.update()
            return datamodel;
        },
        getDataModel(name) {
            return dataModels[name]
        }
    }

