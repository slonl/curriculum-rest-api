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
        spreadsheet: function(name, data) {
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
                columns.forEach(c => {
                    let name = c.name
                    if (!allColumns[name]) {
                        allColumns[name] = {}
                    }
                    if (Array.isArray(c.data)) {
                        c.data.forEach(v => {
                            if (!allColumns[name][v]) {
                                allColumns[name][v] = 0;
                            }
                            allColumns[name][v]++
                        })
                    } else {
                        if (!allColumns[name][c.data]) {
                            allColumns[name][c.data] = 0
                        }
                        allColumns[name][c.data]++
                    }
                })
            }

            walk(data, 0, (n,indent) => {
                if (n.id || n.uuid) {
                    count++
                    let row = {}
                    row.index = count
                    row['data-simply-template'] = 'entity'
                    row.indent = 'slo-indent-'+indent;
                    row.columns = []
                    let prevIndent = allRows[allRows.length-1]?.indent || 0
                    selectedColumns.forEach(column => {
                        if (typeof n[column] !== 'undefined') {
                            row.columns.push({
                                name: column,
                                data: ''+n[column],
                                type: column=='prefix' ? 'tree' : 'text'
                                //@FIXME: type tree calculated after walking all rows
                                //so editor type should be defined by the column definitions
                                //not in each row seperately
                            })
                        } else if (column == 'niveaus') {
                            let Niveaus = []
                            if (n.Niveau) {
                                Niveaus = n.Niveau
                            } else if (n.NiveauIndex) {
                                Niveaus = n.NiveauIndex.map(ni => ni.Niveau)
                            }
                            row.columns.push({
                                name: 'Niveaus',
                                data: Niveaus.map(n => ''+n.title),
                                type: 'list'
                            })
                        } else if (column == 'id') {
                            row.columns.push({
                                name: 'ID',
                                data: ''+n['@references'],
                                type: 'id'
                            })                            
                        } else {
                            row.columns.push({
                                name: column,
                                type: 'text',
                                data: ''
                            })
                        }
                    })
                    if (row.columns.length) {
                        allRows.push(row)
                        countColumnValues(row.columns)
                    }
                    return indent+1
                }
                return indent;
            })

            let columnDefinitions = []
            columnDefinitions.push({
                'data-simply-template': 'index'
            })
            columnDefinitions.push({
                'data-simply-template': 'id'
            })
            Object.keys(allColumns).forEach(c => {
                let columnValues = Object.keys(allColumns[c])
                let columnDefinition = {
                    'data-simply-template': 'text',
                    name: c
                }
                if (c == 'prefix') {
                    columnDefinition['data-simply-template'] = 'tree'
                }
                if (columnValues.length>15) {
                    columnDefinition['data-simply-template'] = 'list'
                    columnDefinition.data = Object.keys(allColumns[c]).map(name => {
                        return {
                            name,
                            count: allColumns[c][name]
                        }
                    })
                }
                columnDefinitions.push(columnDefinition)
            })
            columnDefinitions.push({
                'data-simply-template': 'last',
                data: Object.keys(allColumns).map(name => {
                    return {
                        name,
                        checked: selectedColumns.includes(name) ? 1 : 0
                    }
                })
            })
            window.setTimeout(() => {
                window.editor.addDataSource('columns', {
                    load: columnDefinitions
                })
                console.log('columns',columnDefinitions)
            },500)

            let datamodel = simply.viewmodel.create(name, allRows, {
              offset: 0,
              rows: 15,
              rowHeight: 27,
              columns: allColumns,
              closed: {}
            });

            document.querySelector('.slo-spreadsheet table').style.height
            =(datamodel.options.rows+1)*datamodel.options.rowHeight+'px'

            datamodel.addPlugin('render', function(params) {
              if (typeof params.offset != 'undefined') {
                this.options.offset = params.offset
              }
              if (typeof params.rows!='undefined') {
                this.options.rows = params.rows
              }
              start = this.options.offset
              end = start + this.options.rows
              if (end>this.view.data.length) {
                end = this.view.data.length;
                start = end - this.options.rows;
              }
              if (start>0 || end<this.view.data.length) {
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

            let view,scrollListener=false;
            datamodel.addPlugin('finish', function() {
                if (this.view.data.length<this.options.rows) {
                    let size = this.options.rows - this.view.data.length;
                    this.view.data = this.view.data.concat(new Array(size).fill({
                        'data-simply-template':'empty'
                    }))
                }
                view = document.querySelector('[data-simply-data="'+name+'"]')
                let scrollbar = view.closest('.slo-spreadsheet').querySelector('.slo-scrollbar')
                let scrollbox = view.closest('.slo-spreadsheet').querySelector('.ds-scrollbox')
                let height = (datamodel.options.rowHeight * (datamodel.options.visibleRows+1))+'px'
                if (height != scrollbar.style.height) {
                    scrollbar.style.height = height;
                }
                if (!scrollListener) {
                    scrollListener = true;
                    let timer = null
                    scrollbox.addEventListener('scroll', (e) => {
                        if (timer) {
                            return
                        }
                        if (!e.target.closest('.slo-spreadsheet')) {
                            return
                        }
                        timer = window.setTimeout(() => {
                            view = document.querySelector('[data-simply-data="'+name+'"]')
                            scrollbar = view.closest('.slo-spreadsheet').querySelector('.slo-scrollbar')
                            let scrollbox = view.closest('.slo-spreadsheet').querySelector('.ds-scrollbox')
                            let datamodel = window.slo.getDataModel(name); // important, another datamodel can be loaded, so make sure we use the latest one
                            let offset = Math.ceil(scrollbox.scrollTop/datamodel.options.rowHeight)
                            if (offset!=datamodel.options.offset) {
                                datamodel.update({
                                    offset: offset
                                })
                                simply.viewmodel.updateDataSource(name)
                            }
                            timer = null
                        },50)
                    })
                }
            })
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
        },
        editor: {
            textarea: function(field) {
                if (editor) {
                    editor.textarea.remove()
                }
                let cell = field.closest('td')
                let textarea = document.createElement('textarea')
                textarea.className = 'slo-editor slo-textarea'
//              let fieldName = field.dataset.simplyField
//              let value = field.dataBinding.config.data[fieldName]
                textarea.innerText = field.innerText
                cell.appendChild(textarea)
                cell.classList.add('slo-edit')
                textarea.style.height = field.offsetHeight+'px'
                textarea.focus()
                editor = {
                    cell,
                    field,
                    type: 'textarea',
                    textarea
                }
            },
            close: function() {
                if (editor) {
                    editor.cell.classList.remove('slo-edit')
                    editor.cell.removeChild(editor.textarea)
                    editor = null
                }
            },
            next: function() {

            }
        }
    }
})()