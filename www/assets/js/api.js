    let dataModels = {}
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
                    row['data-simply-template'] = 'entity'
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
       async document(json){
            console.log(JSON.stringify(json, null, 4))
            let documentData = []
            
        
            function formatDocumentData(json){
                let dataObj = { documentSublist : [], documentNiveaus : [] };

                 Object.entries(json).forEach(([key, value]) => {
                            
                    if( Array.isArray(value)){
                        if (key === 'Niveau') {
                            for(let child of value){
                                dataObj['documentNiveaus'].push(formatDocumentData(child));
                            }
                        }
                        else {
                            for(let child of value){
                                dataObj['documentSublist'].push(formatDocumentData(child));
                            }
                        }
                    }
                
                    else {
                        dataObj[key] = value ;
                    }   

                    
                });
                
                return dataObj;
            }

            documentData = formatDocumentData(json);

            console.log(JSON.stringify(documentData, null, 4));
            documentData = JSON.parse(JSON.stringify(documentData));

            //return [documentData];
            //format json so as to fill the view

            // for each object in array make nuw object as follows:


            //for each in json if array add array to array, else if object move to -somewhere-

            
            return [
     
                { prefix : "prefix1",  title: "title1", description : "Calm down, Marty, I didn’t disintegrate anything. The molecular structure of Einstein and the car are completely intact. Marty you gotta come back with me. Of course, from a group of Libyan Nationalists. They wanted me to build them a bomb, so I took their plutonium and in turn gave them a shiny bomb case full of used pinball machine parts. Yoo. Yoo.",
                    documentSublist : [{ prefix : "prefix2", title: "title2", description : "Calm down, Marty, I didn’t disintegrate anything. The molecular structure of Einstein and the car are completely intact. Marty you gotta come back with me. Of course, from a group of Libyan Nationalists. They wanted me to build them a bomb, so I took their plutonium and in turn gave them a shiny bomb case full of used pinball machine parts. Yoo. Yoo.",
                        documentNiveaus:[{ prefix: "niveauPrefix1", title : "niveauTitle1", description : "Calm down, Marty, I didn’t disintegrate anything. The molecular structure of Einstein and the car are completely intact. Marty you gotta come back with me. Of course, from a group of Libyan Nationalists. They wanted me to build them a bomb, so I took their plutonium and in turn gave them a shiny bomb case full of used pinball machine parts. Yoo. Yoo."}],
                        documentSublist: [{ prefix : "prefix3", title: "title3", description : "Calm down, Marty, I didn’t disintegrate anything. The molecular structure of Einstein and the car are completely intact. Marty you gotta come back with me. Of course, from a group of Libyan Nationalists. They wanted me to build them a bomb, so I took their plutonium and in turn gave them a shiny bomb case full of used pinball machine parts. Yoo. Yoo."
                        }]
                    }]
                },
                  
                
            ]
            

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