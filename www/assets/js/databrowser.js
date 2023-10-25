    simply.route.init({
        root: window.release.apiPath
    });

/*    (function() {       
        var match = simply.route.match;
        simply.route.match = function(path, options) {
            if (path.indexOf(release.apiPath)===0) {
                path = path.substring(release.apiPath.length); // handle /curriculum/2019/api/v1/*
            } else if (path.indexOf(release.basePath+'uuid/')===0) {
                path = path.substring(release.basePath.length); // handle /curriculum/2019/uuid/
            }
            return match(path, options);
        };
    })();
*/    

    var browser = simply.app({
        container: document.body,
        view: {
            spreadsheet: {
                focus: {
                    row: 0,
                    column: 0
                }
            }
        },
        routes: {
            '/niveau/:niveau/vakleergebied/:vakid': function(params) {
                browser.actions.itemOpNiveau(params.niveau, 'vakleergebied/', params.vakid);
            },
            '/niveau/:niveau/vakleergeboed/': function(params) {
                browser.actions.listOpNiveau(params.niveau, 'vakleergebied/');
            },

            '/niveau/:niveau/ldk_vakleergebied/:vakid': function(params) {
                browser.actions.itemOpNiveau(params.niveau, 'ldk_vakleergebied/', params.vakid);
            },
            '/niveau/:niveau/ldk_vakkern/:ldk_vakkernid': function(params) {
                browser.actions.itemOpNiveau(params.niveau, 'ldk_vakkern/', params.ldk_vakkernid);
            },
            '/niveau/:niveau/ldk_vaksubkern/:ldk_vaksubkernid': function(params) {
                browser.actions.itemOpNiveau(params.niveau, 'ldk_vaksubkern/', params.ldk_vaksubkernid);
            },
            '/niveau/:niveau/ldk_vakinhoud/:ldk_vakinhoudid': function(params) {
                browser.actions.itemOpNiveau(params.niveau, 'ldk_vakinhoud/', params.ldk_vakinhoudid);
            },
            '/niveau/:niveau/ldk_vak/': function(params) {
                browser.actions.listOpNiveau(params.niveau, 'ldk_vakleergebied/');
            },
            '/niveau/:niveau/ldk_vakleergebied/': function(params) {
                browser.actions.listOpNiveau(params.niveau, 'ldk_vakleergebied/');
            },
            '/niveau/:niveau/ldk_vakkern/': function(params) {
                browser.actions.listOpNiveau(params.niveau, 'ldk_vakkern/');
            },
            '/niveau/:niveau/ldk_vaksubkern/': function(params) {
                browser.actions.listOpNiveau(params.niveau, 'ldk_vaksubkern/');
            },
            '/niveau/:niveau/ldk_vakinhoud/': function(params) {
                browser.actions.listOpNiveau(params.niveau, 'ldk_vakinhoud/');
            },

            '/niveau/:niveau': function(params) {
                browser.actions.item(params.niveau);
            },
            '/niveau/': function(params) {
                browser.actions.list('niveau/')
            },
            '/doelniveau/': function(params) {
                browser.actions.doelniveauList('doelniveau/')
            },
            '/doel/': function(params) {
                browser.actions.list('doel/')
            },
            '/vakleergebied/': function(params) {
                browser.actions.list('vakleergebied/')
            },

            '/ldk_vak/': function(params) {
                browser.actions.list('ldk_vakleergebied/')
            },
            '/ldk_vakleergebied/': function(params) {
                browser.actions.list('ldk_vakleergebied/')
            },
            '/ldk_vakkern/': function(params) {
                browser.actions.list('ldk_vakkern/')
            },
            '/ldk_vaksubkern/': function(params) {
                browser.actions.list('ldk_vaksubkern/')
            },
            '/ldk_vakinhoud/': function(params) {
                browser.actions.list('ldk_vakinhoud/')
            },
            '/ldk_vakbegrip/': function(params) {
                browser.actions.list('ldk_vakbegrip/')
            },

            '/niveau/:niveau/kerndoel_vakleergebied/:vakid': function(params) {
                browser.actions.itemOpNiveau(params.niveau, 'kerndoelvakleergebied/', params.vakid);
            },
            '/kerndoel/': function(params) {
                browser.actions.list('kerndoel/')
            },
            '/kerndoel_domein/': function(params) {
                browser.actions.list('kerndoel_domein/')
            },
            '/kerndoel_uitstroomprofiel/': function(params) {
                browser.actions.list('kerndoel_uitstroomprofiel/')
            },
            '/kerndoel_vakleergebied/': function(params) {
                browser.actions.list('kerndoel_vakleergebied/')
            },

            '/examenprogramma_vakleergebied/': function(params) {
                browser.actions.list('examenprogramma_vakleergebied/')
            },
            '/examenprogramma/': function(params) {
                browser.actions.list('examenprogramma/')
            },
            '/examenprogramma_domein/': function(params) {
                browser.actions.list('examenprogramma_domein/')
            },
            '/examenprogramma_subdomein/': function(params) {
                browser.actions.list('examenprogramma_subdomein/')
            },
            '/examenprogramma_eindterm/': function(params) {
                browser.actions.list('examenprogramma_eindterm/')
            },
            '/examenprogramma_kop1/': function(params) {
                browser.actions.list('examenprogramma_kop1/')
            },
            '/examenprogramma_kop2/': function(params) {
                browser.actions.list('examenprogramma_kop2/')
            },
            '/examenprogramma_kop3/': function(params) {
                browser.actions.list('examenprogramma_kop3/')
            },
            '/examenprogramma_kop4/': function(params) {
                browser.actions.list('examenprogramma_kop4/')
            },
            '/examenprogramma_body/': function(params) {
                browser.actions.list('examenprogramma_body/')
            },

            '/examenprogramma_bg_profiel/': function(params) {
                browser.actions.list('examenprogramma_bg_profiel/')
            },
            '/examenprogramma_bg_kern/': function(params) {
                browser.actions.list('examenprogramma_bg_kern/')
            },
            '/examenprogramma_bg_kerndeel/': function(params) {
                browser.actions.list('examenprogramma_bg_kerndeel/')
            },
            '/examenprogramma_bg_globale_eindterm/': function(params) {
                browser.actions.list('examenprogramma_bg_globale_eindterm/')
            },
            '/examenprogramma_bg_module/': function(params) {
                browser.actions.list('examenprogramma_bg_module/')
            },
            '/examenprogramma_bg_keuzevak/': function(params) {
                browser.actions.list('examenprogramma_bg_keuzevak/')
            },
            '/examenprogramma_bg_deeltaak/': function(params) {
                browser.actions.list('examenprogramma_bg_deeltaak/')
            },
            '/examenprogramma_bg_moduletaak/': function(params) {
                browser.actions.list('examenprogramma_bg_moduletaak/')
            },
            '/examenprogramma_bg_keuzevaktaak/': function(params) {
                browser.actions.list('examenprogramma_bg_keuzevaktaak/')
            },

            '/syllabus/': function(params) {
                browser.actions.list('syllabus/')
            },
            '/syllabus_vakleergebied/': function(params) {
                browser.actions.list('syllabus_vakleergebied/')
            },
            '/syllabus_specifieke_eindterm/': function(params) {
                browser.actions.list('syllabus_specifieke_eindterm/')
            },
            '/syllabus_toelichting/': function(params) {
                browser.actions.list('syllabus_toelichting/')
            },
            '/syllabus_vakbegrip/': function(params) {
                browser.actions.list('syllabus_vakbegrip/')
            },

            '/inh_vakleergebied/': function(params) {
                browser.actions.list('inh_vakleergebied/')
            },
            '/inh_inhoudslijn/': function(params) {
                browser.actions.list('inh_inhoudslijn/')
            },
            '/inh_cluster/': function(params) {
                browser.actions.list('inh_cluster/')
            },            
            '/inh_subcluster/': function(params) {
                browser.actions.list('inh_subcluster/')
            },

            '/ref_vakleergebied/': function(params) {
                browser.actions.list('ref_vakleergebied/')
            },
            '/ref_domein/': function(params) {
                browser.actions.list('ref_domein/')
            },
            '/ref_subdomein/': function(params) {
                browser.actions.list('ref_subdomein/')
            },
            '/ref_onderwerp/': function(params) {
                browser.actions.list('ref_onderwerp/')
            },
            '/ref_deelonderwerp/': function(params) {
                browser.actions.list('ref_deelonderwerp/')
            },
            '/ref_tekstkenmerk/': function(params) {
                browser.actions.list('ref_tekstkenmerk/')
            },

            '/erk_vakleergebied/': function(params) {
                browser.actions.list('erk_vakleergebied/')
            },
            '/erk_gebied/': function(params) {
                browser.actions.list('erk_gebied/')
            },
            '/erk_categorie/': function(params) {
                browser.actions.list('erk_categorie/')
            },
            '/erk_taalactiviteit/': function(params) {
                browser.actions.list('erk_taalactiviteit/')
            },
            '/erk_schaal/': function(params) {
                browser.actions.list('erk_schaal/')
            },
            '/erk_candobeschrijving/': function(params) {
                browser.actions.list('erk_candobeschrijving/')
            },
            '/erk_voorbeeld/': function(params) {
                browser.actions.list('erk_voorbeeld/')
            },
            '/erk_lesidee/': function(params) {
                browser.actions.list('erk_lesidee/')
            },

            '/nh_categorie/': function(params) {
                browser.actions.list('nh_categorie/')
            },
            '/nh_sector/': function(params) {
                browser.actions.list('nh_sector/')
            },
            '/nh_schoolsoort/': function(params) {
                browser.actions.list('nh_schoolsoort/')
            },
            '/nh_leerweg/': function(params) {
                browser.actions.list('nh_leerweg/')
            },
            '/nh_bouw/': function(params) {
                browser.actions.list('nh_bouw/')
            },
            '/nh_niveau/': function(params) {
                browser.actions.list('nh_niveau/')
            },
            
            '/fo_domein/': function(params) {
                browser.actions.list('fo_domein/')
            },
            '/fo_subdomein/': function(params) {
                browser.actions.list('fo_subdomein/')
            },
            '/fo_doelzin/': function(params) {
                browser.actions.list('fo_doelzin/')
            },
            '/fo_toelichting/': function(params) {
                browser.actions.list('fo_toelichting/')
            },
            '/fo_uitwerking/': function(params) {
                browser.actions.list('fo_uitwerking/')
            },
            
            '/tag/': function(params) {
                browser.actions.list('tag/')
            },
            '/relatie/': function(params) {
                browser.actions.list('relatie/')
            },

            '/curriculum/uuid/:id': function(params) {
                browser.actions.item(params.id);
            },
            '/uuid/:id': function(params) {
                browser.actions.item(params.id);
            },

            '/register/': function(params) { 
                browser.view.view = 'register';
            },
            '/curriculum-:context/': function(params) {
                browser.view.context = params.context;
                browser.view.contextLink = {
                    href: '/curriculum-'+params.context+'/',
                    innerHTML: contexts['curriculum-'+params.context].title
                }
                browser.view.view = 'context';
                editor.addDataSource('contextdata', {
                    load: Object.entries(contexts['curriculum-'+params.context].data).map(([key,value]) => {
                        return {
                            link: {
                                href: key+'/',
                                innerHTML: value
                            }
                        }
                    })
                })
                updateDataSource('contextdata')
            },
            '/': function(params) {
                browser.view.view = 'home';
            },
            '/([^#]+):*': function(params) {
                if (params.remainder) {
                    browser.actions.notfound(params.remainder);
                }
            }
        },
        keyboard: {
            spreadsheet: {
                //TODO: calculate prev/next row while skipping over
                //closed trees. So find the prev/next visible row.
                "ArrowDown": (e) => {
                    let d = window.slo.getDataModel('items')
                    let focus = browser.view.spreadsheet.focus
                    console.log('up',focus)
                    if (focus.row<(d.data.length-1)) {
                        focus.row++
                        browser.actions.focusCell(focus.row, focus.column)
                    }
                    e.preventDefault()
                },
                "ArrowUp": (e) => {
                    let d = window.slo.getDataModel('items')
                    let focus = browser.view.spreadsheet.focus
                    console.log('down',focus)
                    if (focus.row>0) {
                        focus.row--
                        browser.actions.focusCell(focus.row, focus.column)
                    }
                    e.preventDefault()
                },
                "ArrowLeft": (e) => {
                    let d = window.slo.getDataModel('items')
                    let focus = browser.view.spreadsheet.focus
                    if (focus.column>0) {
                        focus.column--
                        browser.actions.focusCell(focus.row, focus.column)
                    }
                    e.preventDefault()
                },
                "ArrowRight": (e) => {
                    let d = window.slo.getDataModel('items')
                    let focus = browser.view.spreadsheet.focus
                    if (focus.column<Object.keys(d.options.columns).length) {
                        focus.column++
                        browser.actions.focusCell(focus.row, focus.column)
                    }
                    e.preventDefault()
                }
                // Space -> open/close subtree
            }
        },
        commands: {
            switchView: function(el, value) {
                this.app.view.preferedView = value;
                let current = el.closest('.slo-weergave-switch').querySelector('.ds-button-primary')
                if (current!=el) {
                    current.classList.remove('ds-button-primary')
                    current.classList.add('ds-button-naked')
                    el.classList.remove('ds-button-naked')
                    el.classList.add('ds-button-primary')
                }
                this.app.actions.switchView(value)
            },
            toggleTree: function(el,value) {
                let id = el.closest('tr').querySelector('[data-simply-field="@references"]').pathname
                id = id.split('/').pop()
                let datamodel = window.slo.getDataModel('items')
                datamodel.update({
                    toggle: id
                })
                el.closest('tr').classList.toggle('closed')
            },
            openTree: function(el, value) {
                let datamodel = window.slo.getDataModel('items')
                datamodel.options.closed = {}
                datamodel.update()
            },
            sortTree: function(el, value) {
                let column = el.closest('th').querySelector('label.slo-column-name').innerText.trim()
                let datamodel = window.slo.getDataModel('items')
                datamodel.update({
                    propSort: {
                        sortBy: column,
                        sortDirection: value
                    }
                })
                el.closest('tr')
                .querySelectorAll('.ds-datatable-sorted-descending,.ds-datatable-sorted-ascending')
                .forEach(e => {
                    e.classList.remove('ds-datatable-sorted-descending')
                    e.classList.remove('ds-datatable-sorted-ascending')
                })
                if (column=='Prefix') {
                    el.closest('table').classList.remove('sorted')
                    el.closest('th').classList.add('ds-datatable-sorted-descending')
                } else {
                    el.closest('table').classList.add('sorted')
                    el.closest('th').classList.add('ds-datatable-sorted-'+value)
                }
            },
            nextPage: function(el,value) {
                page = Math.min(browser.view.max-1, parseInt(browser.view.page));
                browser.actions.updatePage(page);
            },
            previousPage: function(el,value) {
                page = Math.max(0, browser.view.page-2);
                browser.actions.updatePage(page);
            },
            register : function(el, value) {
                var email = encodeURIComponent(el.querySelector("input").value);
                browser.actions.register(email);
                browser.view.view = "registered";
            },
            'search-text': function(form, values) {
                const text = values.text;
                if (text) {
                    browser.actions.search(text)
                    .then(data => {
                        browser.view.view = 'list';
                        browser.view.list = data;
                        browser.view.listTitle = 'Zoekresultaten voor &quot;'+text+'&quot;';
                    })
                }
            }
        },
        actions: {
            switchView: async function(view){
                let currentView = this.app.view.view;
                switch(view) {
                    case 'item':
                        document.body.setAttribute('data-simply-keyboard','item')
                        // get focused item
                        return this.app.actions.item(this.app.view.item.uuid)
                        // switch to that
                    break;
                    case 'spreadsheet':
                        document.body.setAttribute('data-simply-keyboard','spreadsheet')
                        let currentItem = this.app.view.item.uuid
                        let currentId = this.app.view.item['@id']
                        // get roots of current item
                        let roots = await window.slo.api.get('/roots/'+currentItem)
                        // pick one
                        // FIXME: remember which one was picked last
                        // switch to spreadsheet of that root
                        let currentType = this.app.view.item['@type']
                        let currentContext = window.slo.getContextByType(currentType)
                        if (!this.app.view.contexts) {
                            this.app.view.contexts = ['curriculum-basis'];
                        }
                        if (currentContext && !this.app.view.contexts.includes(currentContext)) {
                            this.app.view.contexts.push(currentContext)
                        }
                        if (!this.app.view.niveaus) {
                            this.app.view.niveaus = [];
                        }
                        await this.app.actions.spreadsheet(roots[0].id,this.app.view.contexts,this.app.view.niveaus)
                        // focus current item
                        let model = window.slo.getDataModel('items')
                        let row = model.data.findIndex(r => r['@id']==currentId)
                        this.app.view.spreadsheet.focus.row = row;
                        this.app.view.spreadsheet.focus.column = 2;
                        this.app.actions.focusCell(row,2)
                    break;
                }
            },
            search: function(text) {
                document.body.classList.remove('ds-paging');
                return window.slo.api.get(window.release.apiPath+'search', {text: text}).then(data => {
                    if (typeof data === 'string') {
                        return JSON.parse(data)
                    }
                    return data
                });
            },
            updatePage: function(page) {
                window.location.search =
                '?'+Object.keys(browser.view.params).map(function(key) {
                    if (key=='page') {
                        return 'page='+page;
                    }
                    return encodeURIComponent(key)+'='+encodeURIComponent(browser.view.params[key]);
                }).join('&');
            },
            list: function(type) {
                browser.view['listTitle'] = titles[type];
                browser.view.list = [];
                return window.slo.api.get(window.release.apiPath+type)
                .then(function(json) {
                    browser.view.view = 'list';
                    browser.view.list = json.data;
                    browser.view['listTitle'] = titles[type];
                    console.log(titles[type],browser.view['listTitle']);
                    browser.actions.updatePaging(json.count);
//                    editor.addDataSource('list', {
//                        load: json
//                    });
                })
                .catch(function(error) {
                });
            },
            spreadsheet: function(root, context, niveau) {
                browser.view.items = []
                return window.slo.api.get(window.release.apiPath+'tree/'+root, {
                    niveau, context
                })
                .then(function(json) {
                    browser.view.view = 'spreadsheet';
                    window.slo.spreadsheet('items',json)
                })
            },
            doelniveauList: function(type) {
                browser.view['listTitle'] = titles[type];
                browser.view.list = [];
                return window.slo.api.get(window.release.apiPath+type)
                .then(function(json) {
                    browser.view.view = 'doelniveauList';
                    browser.view.list = json.data;
                    browser.view['listTitle'] = titles[type];
                    console.log(titles[type],browser.view['listTitle']);
                    browser.actions.updatePaging(json.count);
                });
            },
            item: function(id) {
                return window.slo.api.get(window.release.apiPath+'uuid/'+id+'/')
                .then(function(json) {
                    browser.view.view = 'item';
                    browser.view.item = json;
                    browser.actions.updatePaging();
                });
            },
            listOpNiveau: function(niveau, type) {
                browser.view['listTitle'] = titles[type];
                browser.view.list = [];
                return window.slo.api.get(window.release.apiPath+'niveau/'+niveau+'/'+type)
                .then(function(json) {
                    browser.view.view = 'list';
                    browser.view.list = json;
                    browser.view['listTitle'] = titles[type];
                    console.log(titles[type],browser.view['listTitle']);
                    browser.actions.updatePaging();
                });
            },
            itemOpNiveau: function(niveau, type, id) {
                return window.slo.api.get(window.release.apiPath+'niveau/'+niveau+'/'+type+id)
                .then(function(json) {
                    browser.view.view = 'item';
                    browser.view.item = json;
                    browser.actions.updatePaging();
                });
            },
            notfound: function(remainder) {
                browser.view.view = 'notfound';
                browser.actions.updatePaging();
            },
            updatePaging: function(count) {
                if (!count || count<browser.view.pageSize) {
                    document.body.classList.remove('ds-paging');
                } else {
                    document.body.classList.add('ds-paging');
                    var total = parseInt(count);
                    var pages = total / browser.view.pageSize;
                    browser.view.max = Math.ceil(pages);
                }
                MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            },
            register : function(email) {
                var url = window.release.apiPath+'register/';
                window.slo.api.get(url + "?email=" + email);
            },
            focusCell: function(row, column) {
                let d = window.slo.getDataModel('items')
                browser.view.spreadsheet.focus.row = row;
                browser.view.spreadsheet.focus.column = column;
                // check if the cell is visible
                // FIXME: check that row is not collapsed 
                // TODO: move scrollbar down appropriately
                // instead of setting offset directly - move scrollbar and let it update
                // the offset
                if (d.options.offset>row || (d.options.offset+d.options.rows)<=row) { 
                    let offset = Math.min(Math.max(row - Math.floor(d.options.rows/2), 0), d.data.length-d.options.rows)
                    if (offset!=d.options.offset) {
                        d.update({
                            offset: offset
                        })
                    }
                }
                row = row - d.options.offset
                // FIXME: keep column within limits of the visible data
                // then highlight the cell (hide previous highlight)
                // throttle this to prevent trailing renders
                window.setTimeout(() => {
                    Array.from(document.querySelectorAll('.slo-spreadsheet .focus'))
                    .forEach(r => {
                        r.classList.remove('focus')
                    })
                    document.querySelector('.slo-spreadsheet tbody tr:nth-child('+(row+1)+')').classList.add('focus')
                    document.querySelector('.slo-spreadsheet tbody tr:nth-child('+(row+1)+') td:nth-child('+(column+1)+')').classList.add('focus')
                },10)
            }
        }
    });

    browser.view.pageSize = 100;
