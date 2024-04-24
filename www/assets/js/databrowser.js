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

function uuid() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function isString(s) {
    return typeof s === 'string' || s instanceof String
}

function arrayEquals(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

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
        '/login/': function() {
            document.getElementById('login').setAttribute('open','open')
        },
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
                innerHTML: slo.contexts['curriculum-'+params.context].title
            }
            browser.view.view = 'context';
            editor.addDataSource('contextdata', {
                load: Object.entries(slo.contexts['curriculum-'+params.context].data).map(([key,value]) => {
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
        //@TODO: keyboard definition should be in spreadsheet.js, and referenced here
        spreadsheet: {
            //TODO: calculate prev/next row while skipping over
            //closed trees. So find the prev/next visible row.
            "ArrowDown": (e) => {
                browser.view.sloSpreadsheet.moveDown()
                e.preventDefault()
            },
            "ArrowUp": (e) => {
                browser.view.sloSpreadsheet.moveUp()
                e.preventDefault()
            },
            "ArrowLeft": (e) => {
                browser.view.sloSpreadsheet.moveLeft()
                e.preventDefault()
            },
            "ArrowRight": (e) => {
                browser.view.sloSpreadsheet.moveRight()
                e.preventDefault()
            },
            "Enter": (e) => {
                e.preventDefault()
                if (browser.view.user) {
                    let el = document.querySelector('td.focus')
                    browser.view.sloSpreadsheet.editor(el)
                }
            },
            "Escape": (e) => {
                e.preventDefault()
                let dropdowns = document.querySelectorAll('.ds-dropdown-state:checked')
                dropdowns.forEach(d => d.checked = false)
            },
            "Home": (e) => {
                e.preventDefault()
                browser.view.sloSpreadsheet.goto(0,0)
            },
            "End": (e) => {
                e.preventDefault()
                let row = browser.view.sloSpreadsheet.data.length-1
                let column = browser.view.sloSpreadsheet.options.columns.length
                browser.view.sloSpreadsheet.goto(row, column)
            },
            "PageUp": (e) => {
                e.preventDefault()
                let rowsPerPage = browser.view.sloSpreadsheet.options.rows
                let row = browser.view.sloSpreadsheet.options.focus.row - (rowsPerPage - 1) -1
                let column = browser.view.sloSpreadsheet.options.focus.column
                browser.view.sloSpreadsheet.goto(row, column)                    
            },
            "PageDown": (e) => {
                e.preventDefault()
                let rowsPerPage = browser.view.sloSpreadsheet.options.rows
                let row = browser.view.sloSpreadsheet.options.focus.row + (rowsPerPage - 1) -1
                let column = browser.view.sloSpreadsheet.options.focus.column
                browser.view.sloSpreadsheet.goto(row, column)                    
            },
            "Insert": async (e) => {
                e.preventDefault()
                let el = document.querySelector('td.focus')
                let selectedType = await browser.actions.showTypeSelector(el)
            },
            "Delete": (e) => {
                e.preventDefault()
                let el = document.querySelector('td.focus')
                browser.actions.deleteRow(el.closest('tr'))
            }
            // @TODO: Space -> open/close subtree in prefix/tree column, open links in id column
        },
        "spreadsheet-types": {
            "Escape": (e) => {
                e.preventDefault()
                browser.actions.hideTypeSelector()
            },
            "ArrowDown": (e) => {
                let target = document.activeElement
                if (target && (target.type=='checkbox' || target.type=='radio')) {
                    e.preventDefault()
                    let targets = Array.from(target.closest('.slo-type-selector').querySelectorAll('input[type="checkbox"],input[type="radio"]'))
                    let current = targets.findIndex(input => input==e.target)
                    if (current>=0) {
                        current++
                        targets[current]?.focus()
                    }
                }
            },
            "ArrowUp": (e) => {
                let target = document.activeElement
                if (target && (target.type=='checkbox' || target.type=='radio')) {
                    e.preventDefault()
                    let targets = Array.from(target.closest('.slo-type-selector').querySelectorAll('input[type="checkbox"],input[type="radio"]'))
                    let current = targets.findIndex(input => input==e.target)
                    if (current>0) {
                        current--
                        targets[current]?.focus()
                    }
                }
            },
            "Enter": (e) => {
                e.preventDefault()
                if (browser.view.user) {
                    let el = document.querySelector('td.focus')
                    let selector = document.querySelector('.slo-type-selector')
                    let type = selector.querySelector('input:checked')
                    browser.actions.hideTypeSelector()
                    return browser.actions.insertRow(el.closest('tr'), type.value)
                }
            }
        },
        "spreadsheet-edit": {
            "Escape": (e) => {
                e.preventDefault()
                let el = document.querySelector('td.focus')
                browser.view.sloSpreadsheet.selector(el)
            },
            "Tab": async (e) => {
                e.preventDefault()
                await browser.view.sloSpreadsheet.saveChanges()
                let el
                do {
                    el = browser.view.sloSpreadsheet.moveNext()
                    browser.view.sloSpreadsheet.editor(el)
                } while(el && !browser.view.sloSpreadsheet.isEditable(el))
            },
            "Shift+Tab": async (e) => {
                e.preventDefault()
                await browser.view.sloSpreadsheet.saveChanges()
                let el
                do {
                    el = browser.view.sloSpreadsheet.movePrev()
                    browser.view.sloSpreadsheet.editor(el)
                } while (el && !browser.view.sloSpreadsheet.isEditable(el))
            },
            "ArrowDown": (e) => {
                let target = document.activeElement
                if (target && (target.type=='checkbox' || target.type=='radio')) {
                    e.preventDefault()
                    let targets = Array.from(target.closest('.slo-cell-selector').querySelectorAll('input[type="checkbox"],input[type="radio"]'))
                    let current = targets.findIndex(input => input==e.target)
                    if (current>=0) {
                        current++
                        targets[current]?.focus()
                    }
                }
            },
            "ArrowUp": (e) => {
                let target = document.activeElement
                if (target && (target.type=='checkbox' || target.type=='radio')) {
                    e.preventDefault()
                    let targets = Array.from(target.closest('.slo-cell-selector').querySelectorAll('input[type="checkbox"],input[type="radio"]'))
                    let current = targets.findIndex(input => input==e.target)
                    if (current>0) {
                        current--
                        targets[current]?.focus()
                    }
                }
            },
            "Control+Enter": async (e) => {
                // save changes, close editor
                e.preventDefault()
                await browser.view.sloSpreadsheet.saveChanges()
                let el = document.querySelector('td.focus')
                browser.view.sloSpreadsheet.selector(el)
            }
        },
        document: {
            // @TODO : page up and down should move to next h1 element
            "ArrowDown": (e) => {
                e.preventDefault();
                browser.view.sloDocument.move(1)
            },
            
            "ArrowUp": (e) => {
                e.preventDefault()
                browser.view.sloDocument.move(-1)

            },
            "ArrowLeft": (e) => {
                e.preventDefault()
                browser.view.sloDocument.moveTo("left")
            },
            "ArrowRight": (e) => {
                e.preventDefault()
                browser.view.sloDocument.moveTo("right")
            },
            "Home": (e) => {
                e.preventDefault()
                browser.view.sloDocument.moveTo("top")
            },
            "End": (e) => {
                e.preventDefault()
                browser.view.sloDocument.moveTo("bottom")
            },
            "PageUp": (e) => {
                e.preventDefault()
                browser.view.sloDocument.move(-5)
            },
            "PageDown": (e) => {
                e.preventDefault()
                browser.view.sloDocument.move(5)
            },
            "Enter": (e) => {
                e.preventDefault();
                browser.actions.documentShowEditor();
            },           
        },
        "document-edit": {
            "Control+Enter": async (e) => {
                e.preventDefault();
                browser.actions.documentSaveChanges()
            },
            "Escape": (e) => {
                e.preventDefault();
                browser.actions.documentHideEditor()
            }
        },
    },

    commands: {
        // @TODO : spreadsheet commands should be in spreadsheet.js and referenced here
        closeFilter: (el, value) => {
            el.closest('.ds-dropdown').querySelector('.ds-dropdown-state').checked = false
        },
        closeDialog: (el, value) => {
            el.closest('dialog').close(false)
        },
        closeEditor: (el, value) => {
            el = document.querySelector('td.focus')
            browser.view.sloSpreadsheet.selector(el)
        },
        toggleColumn: (el, value) => {
          let column = browser.view.sloSpreadsheet.options.columns.find(c => c.name==el.name)
          column.checked = el.checked
          browser.view.sloSpreadsheet.render()
        },
        toggleDirty: (el, value) => {
          browser.view.dirtyChecked = el.checked ? 1 : 0
        },
        review: (el, value) => {
            window.open(el.href, el.target)
        },
        filterValue: (el, value) => {
            let column = browser.view.sloSpreadsheet.options.columns
                .find(c => c.value==el.name)
            let state = !column.filteredValues[value]
            column.filteredValues[value] = state
            let columnFilter = Object.entries(column.filteredValues)
                .filter(([name,value]) => value)
                .map(([name,value]) => name)
            let filter = {}
            filter[el.name] = columnFilter
            browser.view.sloSpreadsheet.update({
                filter
            })
        },
        filterText: (el, value) => {
            let filter = {}
            if (value.length>2) {
                filter[el.name] = value
                browser.view.sloSpreadsheet.update({
                    filter
                })
            } else {
                filter[el.name] = ''
                browser.view.sloSpreadsheet.update({filter})
            }
        },
        close: function(el,value) {
            let dialog = el.closest('dialog')
            if (dialog) {
                dialog.removeAttribute('open')
                simply.route.goto('/')
            }
        },
        login: async function(form,values) {
            if (!values.username || !values.password) {
                browser.view.error = 'Vul a.u.b. uw email en API-key in'
                return
            }
            let result = await this.app.actions.login(values.username, values.password)
            if (result===true) {
                this.app.commands.close(form)
            } else {
                browser.view.error = result
            }
        },
        logoff: async function(el, value) {
            slo.api.logout()
            localStorage.setItem('username','')
            localStorage.setItem('key','')
            window.location.reload()
        },
        hideError: function(el, value) {
            browser.view.error = ''
        },
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
            return // disabled for now because of some navigation bugs
            let id = el.closest('tr').id
            browser.view.sloSpreadsheet.update({
                toggle: id
            })
            el.closest('tr').classList.toggle('closed')
        },
        openTree: function(el, value) {
            browser.view.sloSpreadsheet.options.closed = {}
            browser.view.sloSpreadsheet.update()
        },
        sort: (el,value) => {
          browser.view.sloSpreadsheet.update({
            sort: {
              sortBy: el.dataset.name,
              sortDirection: value
            }
          })
          el.closest('tr')
          .querySelectorAll('.ds-datatable-sorted-descending,.ds-datatable-sorted-ascending')
          .forEach(e => {
              e.classList.remove('ds-datatable-sorted-descending')
              e.classList.remove('ds-datatable-sorted-ascending')
          })
          if (el.dataset.name=='prefix') {
              el.closest('table').classList.remove('sorted')
              el.closest('th').classList.add('ds-datatable-sorted-descending')
          } else {
              el.closest('table').classList.add('sorted')
              el.closest('th').classList.add('ds-datatable-sorted-'+value)
          }
        },
        cellEditor: (el, value) => {
            if (browser.view.user) {
                let el = document.querySelector('td.focus')
                browser.view.sloSpreadsheet.editor(el)
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
        },
        showAllChanges: async function(el, value) {
            browser.view.mergedChanges = changes.merged.preview()
            document.getElementById('previewChanges').showModal()
        },
        showCommitChanges: async function(el, value) {
            if (Object.keys(changes.merged).length==0) {
                alert('Wijzigingen heffen elkaar op')
            }
            browser.view.commitError = ''
            browser.view.mergedChanges = changes.merged.preview()
            document.getElementById('commitChanges').showModal()
        },
        commitChanges: async function(form, values) {
            if (!values['message']) {
                browser.view.commitError = 'Vul a.u.b. een omschrijving voor deze wijzigingen in.'
            } else {
                document.body.classList.add('loading')
                try {
                    await this.app.actions.commitChanges(values['message'])
                    document.getElementById('commitChanges').close()
                } catch(e) {
                    browser.view.commitError = e.message
                } finally {
                    document.body.classList.remove('loading')
                }
            }
        },
        showChange: async function(el, value) {
            alert('nog niet geimplementeerd')
        },
        insertRow: async function(el, value) {
            //find possible types for sibling and child of node
            //show popup with list of types
            browser.view.insertParentRow = el
            browser.actions.showTypeSelector(el)                
        },
        addChild: async function(el, value) {
            browser.actions.hideTypeSelector()
            //el = document.querySelector('td.focus') //FIXME: use el set when starting dialog
            el = browser.view.insertParentRow
            let row = await browser.actions.insertRow(el.closest('tr'),value)
            let line = browser.view.sloSpreadsheet.getLineByRow(row)
            el = browser.view.sloSpreadsheet.goto(line-1, 1)
            while (!browser.view.sloSpreadsheet.isEditable(el)) {
                el = browser.view.sloSpreadsheet.moveNext()
            }
            browser.view.sloSpreadsheet.editor(el)
        },
        addSibling: async function(el, value) {
            browser.actions.hideTypeSelector()
            // find parent node
            el = browser.view.insertParentRow
            let row = browser.view.sloSpreadsheet.getRow(el)
            let type = row.node.type
            // add new sibling after current node
            // update spreadsheet
            let newrow = await browser.actions.appendRow(el.closest('tr'), type)
            let line = browser.view.sloSpreadsheet.getLineByRow(newrow)
            // show editor for first editable field in new node
            el = browser.view.sloSpreadsheet.goto(line-1, 1)
            while (!browser.view.sloSpreadsheet.isEditable(el)) {
                el = browser.view.sloSpreadsheet.moveNext()
            }
            browser.view.sloSpreadsheet.editor(el)
        },
        deleteRow: async function(el, value) {
            browser.actions.deleteRow(el.closest('tr'))
        },
        undeleteRow: async function(el, value) {
            browser.actions.undeleteRow(el.closest('tr'))
        },
        editDocument: function(el, value){
            browser.actions.editDocument(el, value)
        },
        cancel: function(el, value){
            browser.actions.hideEditorDialog(el);
        },
        documentCloseEditor: function(){
            browser.actions.documentHideEditor()
        }
    },
    actions: {
        login: async function(email, key) {
            // check if email/key are valid
            if (!await slo.api.login(email, key)) {
                browser.view.loggedIn = false
                return 'Ongeldig email en/of API-key'
            }
            browser.view.user = email
            browser.view.loggedIn = true
            localStorage.setItem('username',email)
            localStorage.setItem('key',key)
            return true
        },
        loadSchemas: async function() {
            let schemas = []
            let baseURL = 'https://opendata.slo.nl/curriculum/schemas/'
            window.curriculum = new Curriculum()
            Object.entries(slo.contexts).forEach(([context,temp]) => {
                schemas.push(
                    fetch(baseURL+context+'/context.json')
                    .then(response => {
                        if (response.ok) {
                            return response.json()
                        }
                        console.error(baseURL+context+'/context.json: '+response.status+': '+response.statusText)
                    })
                    .then(json => curriculum.parseSchema(json))
                )
            })
            return Promise.allSettled(schemas)
            .then(values => values
                .filter(schema => schema.status=='fulfilled')
                .map(schema => schema.value)
            )
        },
        updateView: async function(root) {
            this.app.actions.switchView(this.app.view.view, root)
        },
        switchView: async function(view,root){
            let currentView = this.app.view.view;
            let item = this.app.view.item
            let id = item?.id ?? item?.uuid
            if (!id) {
                return
            }

            let currentItem, currentId, roots, currentType, currrentContext;
            
            switch(view) {
                case 'item':
                    document.body.setAttribute('data-simply-keyboard','item')
                    // get focused item
                    return this.app.actions.item(id)
                    // switch to that
                break;
                case 'spreadsheet':
                    document.body.setAttribute('data-simply-keyboard','spreadsheet')
                    currentItem = id
                    currentId = 'https://opendata.slo.nl/curriculum/uuid/'+currentItem
                    //FIXME: uuid may not exist remote, but just been added
                    if (!root) {
                        roots = await window.slo.api.get('/roots/'+currentItem)
                        if (roots) {
                            this.app.view.roots = roots
                        }
                    }
                    if (root && !this.app.view.roots.includes(root)) {
                        this.app.view.item.id = root.id
                        this.app.view.item.uuid = root.id // TODO: remove this when no longer needed
                        currentItem = root.id
                        currentId = 'https://opendata.slo.nl/curriculum/uuid/'+currentItem
                        this.app.view.roots = [root]
                    }
                    // get roots of current item
                    // pick one
                    this.app.view.root = this.app.view.roots[0]
                    // switch to spreadsheet of that root
                    currentType = this.app.view.item['@type']
                    currentContext = window.slo.getContextByType(currentType)
                    if (!this.app.view.contexts) {
                        this.app.view.contexts = ['curriculum-basis'];
                    }
                    if (currentContext && !this.app.view.contexts.includes(currentContext)) {
                        this.app.view.contexts.push(currentContext)
                    }
                    if (!this.app.view.niveaus) {
                        this.app.view.niveaus = [];
                    }
                    await this.app.actions.spreadsheet(this.app.view.root.id,this.app.view.contexts,this.app.view.niveaus)
                    // focus current item
                    this.app.view.sloSpreadsheet.gotoId(currentId)
                    this.app.view.sloSpreadsheet.onChange((id) => {
                        let url = new URL(id)
                        let uuid = id.pathname.split('/').pop()
                        this.app.view.item.id = uuid
                        this.app.view.item.uuid = uuid //TODO: remove this when no longer needed
                        history.replaceState({}, '', new URL(uuid, window.location))
                    })
                    this.app.view.sloSpreadsheet.onEdit((update) => {
                        let index = this.app.view.sloSpreadsheet.data.findIndex(r => r.columns.id===update.id)
                        let columnDef = this.app.view.sloSpreadsheet.options.columns.filter(c => c.value===update.property).pop()
                        let row = this.app.view.sloSpreadsheet.data[index]
                        let node = row.node
                        let prop, prevValue, newValue
                        let dirty = browser.view.dirtyChecked==1
                        if (update.property=='niveaus') {
                            prop = row.columns.niveaus
                        } else {
                            prop = node[update.property] ?? ''
                        }
                        prevValue = prop
                        if (columnDef.type=='list') {
                            newValue = update.values.getAll(update.property)
                            dirty = true
                        } else {
                            newValue = update.values.get(update.property)
                        }
                        if (Array.isArray(newValue)) {
                            if (arrayEquals(newValue, prevValue)) {
                                return // no change
                            }
                        } else if (newValue == prevValue) {
                            return // no change failsave
                        } else if (!newValue && !prevValue) {
                            return // check if both are empty
                        }

                        let timestamp = new Date().toISOString()
                        let change = new changes.Change({
                            id: node.id ?? node.uuid,
                            meta: {
                                context: window.slo.getContextByType(node['@type']),
                                title: node.title ?? '[Geen titel]',
                                type: node['@type'],
                                timestamp: timestamp.substring(0, timestamp.indexOf('.'))
                            },
                            type: 'patch',
                            property: update.property,
                            prevValue,
                            newValue,
                            dirty
                        })
                        changes.changes.push(change)
                        changes.update()
                        browser.actions.spreadsheetUpdate()
                    })
                break;
                case 'document':
                    document.body.setAttribute('data-simply-keyboard','document')
                    currentItem = id
                    currentId = this.app.view.item['@id']
                    // get roots of current item
                    try {
                        let roots = await window.slo.api.get('/roots/'+currentItem)
                        if (roots) {
                            this.app.view.roots = roots
                        }
                    } catch(e) {
                        // ignore
                    }
                    if (root && !this.app.view.roots.includes(root)) {
                        this.app.view.item.id = root.id
                        this.app.view.item.uuid = root.id //TODO: remove this when no longer needed
                        currentItem = root.id
                        currentId = 'https://opendata.slo.nl/curriculum/uuid/'+currentItem
                        this.app.view.roots = [root]
                    }

                    // pick one
                    this.app.view.root = this.app.view.roots[0]
                    // switch to spreadsheet of that root
                    currentType = this.app.view.item['@type']
                    currentContext = window.slo.getContextByType(currentType)
                    if (!this.app.view.contexts) {
                        this.app.view.contexts = ['curriculum-basis'];
                    }
                    if (currentContext && !this.app.view.contexts.includes(currentContext)) {
                        this.app.view.contexts.push(currentContext)
                    }
                    if (!this.app.view.niveaus) {
                        this.app.view.niveaus = [];
                    }
                    await this.app.actions.renderDocumentPage(this.app.view.root.id,this.app.view.contexts,this.app.view.niveaus)
                    
                    let documentModel = window.slo.getDataModel('items');

                    //focus on item
                    document.getElementById(("https://opendata.slo.nl/curriculum/uuid/" + currentItem))?.scrollIntoView({ block: "center" });
                    document.getElementById(("https://opendata.slo.nl/curriculum/uuid/" + currentItem))?.classList.add("focus");
                    
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
            return window.slo.api.get(window.release.apiPath+type, {
                pageSize: browser.view.pageSize,
                page: parseInt(browser.view.page)-1
            })
            .then(function(json) {
                browser.view.view = 'list';
                changes.getLocalView(json.data)
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
        spreadsheetUpdate: function() {
            changes.getLocalView(browser.view.root)
            let defs = slo.treeToRows(browser.view.root)
            browser.view.sloSpreadsheet.update({data:defs.rows})
            browser.view.sloSpreadsheet.render()
        },
        // functions for editing documentView
        editText : function(){
        },
        spreadsheet: function(root, context, niveau) {
            return window.slo.api.get(window.release.apiPath+'tree/'+root, {
                niveau, context
            })
            .then(function(json) {
                browser.view.root = json
                changes.getLocalView(browser.view.root)
                let defs = slo.treeToRows(browser.view.root)
                browser.view.view = 'spreadsheet';
                // @TODO : als browser.view.user, dan editmode enablen
                // @TODO : on window resize, recalculate
                let panel = document.querySelector('.slo-content-panel')
                let rect = panel.getBoundingClientRect()
                let rowHeight = 27
                let rows = Math.floor(rect.height / rowHeight) - 3
                browser.view.sloSpreadsheet = spreadsheet({
                    container: document.getElementById('slo-spreadsheet'),
                    columns: defs.columns,
                    rows: rows,
                    icons: '/assets/icons/feather-sprite.svg',
                    editMode: (browser.view.user ? true : false)
                }, defs.rows)
                browser.view.sloSpreadsheet.render()
            })
        },
        renderDocumentPage: async function(root, context, niveau) {
            browser.view.documentList = []
            return window.slo.api.get(window.release.apiPath+'tree/'+root, {
                niveau, context
            })
            .then(async function(json) {
                browser.view.root = json
                changes.getLocalView(json)
                browser.view.view = 'document';
                let pageData = await window.slo.documentPage(json)
                // @TODO : render the root instead of the array ( remove the "[]" )
                browser.view.documentList =  [pageData.root]

                // @TODO : might be replaced or removed if not needed anymore in the future.
                browser.view.sloDocument = sloDocument(
                    {container : document.getElementById('slo-document')},
                    pageData
                );
            })
        },
        doelniveauList: function(type) {
            browser.view['listTitle'] = titles[type];
            browser.view.list = [];
            return window.slo.api.get(window.release.apiPath+type)
            .then(function(json) {
                changes.getLocalView(json.data)
                browser.view.view = 'doelniveauList';
                changes.getLocalView(json.data)
                browser.view.list = json.data;
                browser.view['listTitle'] = titles[type];
                console.log(titles[type],browser.view['listTitle']);
                browser.actions.updatePaging(json.count);
            });
        },
        item: function(id) {
            return window.slo.api.get(window.release.apiPath+'uuid/'+id+'/')
            .then(function(json) {
                changes.getLocalView(json)
                let clone = JSON.parse(JSON.stringify(json))
                browser.view.item = clone
//                window.setTimeout(() => {
                    //FIXME: browser.view.item can keep previous arrays if you don't
                    //clear them first, then wait a short while and fill item again
                    //that is either simplyview's view code, or simplyedits list code
                    // setting a clone also fixes the issue it appears
//                    browser.view.item = json;
                    if (browser.view.preferedView && browser.view.preferedView!='item') {
                        browser.actions.switchView(browser.view.preferedView)
                        return
                    }
                    browser.view.view = 'item';
                    browser.actions.updatePaging();
//                }, 100) // don't decrease this, or you will get simplyedit errors dataParent undefined
            });
        },
        listOpNiveau: function(niveau, type) {
            browser.view['listTitle'] = titles[type];
            browser.view.list = [];
            return window.slo.api.get(window.release.apiPath+'niveau/'+niveau+'/'+type)
            .then(function(json) {
                browser.view.view = 'list';
                changes.getLocalView(json)
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
                changes.getLocalView(json)
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
        insertRow: async function(rowEl, type) {
            if (!browser.view.user) return
            let visibleRows = browser.view.sloSpreadsheet.visibleData
            let row = browser.view.sloSpreadsheet.getRow(rowEl)
            let parentNode = row.node
            let node = {
                id: curriculum.uuid(),
                '@type': type,
                'prefix': parentNode.prefix,
                'unreleased': true
            }
            node['@id'] = 'https://opendata.slo.nl/curriculum/uuid/'+node.id
            if (!parentNode[type]) {
                parentNode[type] = []
            }
            let prevValue = parentNode[type].slice()
            let newValue = parentNode[type].slice()
            newValue.unshift(new changes.InsertedLink(node))
            // now add this to the change history
            let timestamp =  new Date().toISOString()
            let change = new changes.Change({
                id: parentNode.id ?? parentNode.uuid,
                meta: {
                    context: window.slo.getContextByType(parentNode['@type']),
                    title: parentNode.title,
                    type: parentNode['@type'],                    
                    timestamp: timestamp.substring(0, timestamp.indexOf('.'))
                },
                type: 'insert',
                property: type,
                prevValue: prevValue,
                newValue: newValue,
                dirty: true,
            })
            changes.changes.push(change)
            changes.update()
            await browser.actions.spreadsheetUpdate()
            let line = browser.view.sloSpreadsheet.findId(node['@id'])
            return browser.view.sloSpreadsheet.getRowByLine(line+1)
        },
        appendRow: async function(rowEl) {
            if (!browser.view.user) return
            let visibleRows = browser.view.sloSpreadsheet.visibleData
            let row = browser.view.sloSpreadsheet.getRow(rowEl)
            let siblingNode = row.node
            let type = siblingNode['@type']
            let node = {
                id: curriculum.uuid(),
                '@type': type,
                'prefix': siblingNode.prefix,
                'unreleased': true
            }
            node['@id'] = 'https://opendata.slo.nl/curriculum/uuid/'+node.id
            let parentRow = browser.view.sloSpreadsheet.findParentRow(row)
            let parentNode = parentRow.node
            if (!parentNode[type]) {
                parentNode[type] = []
            }
            let prevValue = parentNode[type].slice()
            let newValue = parentNode[type].slice()
            let index = parentNode[type].findIndex(n => n.id == siblingNode.id)
            newValue.splice(index+1, 0, new changes.InsertedLink(node))

            // now add this to the change history
            let timestamp =  new Date().toISOString()
            let change = new changes.Change({
                id: parentNode.id ?? parentNode.uuid,
                meta: {
                    context: window.slo.getContextByType(parentNode['@type']),
                    title: parentNode.title,
                    type: parentNode['@type'],                    
                    timestamp: timestamp.substring(0, timestamp.indexOf('.'))
                },
                type: 'insert',
                property: type,
                prevValue: prevValue,
                newValue: newValue,
                dirty: true,
            })
            changes.changes.push(change)
            changes.update()
            await browser.actions.spreadsheetUpdate()
            let line = browser.view.sloSpreadsheet.findId(node['@id'])
            return browser.view.sloSpreadsheet.getRowByLine(line+1)
        },
        undeleteRow: function(rowEl) {
            row = browser.view.sloSpreadsheet.getRow(rowEl)
            if (row.deleted) {
                let parent = browser.view.sloSpreadsheet.findParentRow(row)
                let parentNode = parent.node
                let type = row.node['@type']
                let newValue = parentNode[type].slice()
                row.node.undelete(newValue)
                let prevValue = parentNode[type].slice()
                let timestamp = new Date().toISOString()
                let change = new changes.Change({
                    id: parentNode.id ?? parentNode.uuid,
                    meta: {
                        context: window.slo.getContextByType(parentNode['@type']),
                        title: parentNode.title,
                        type: parentNode['@type'],   
                        timestamp: timestamp.substring(0, timestamp.indexOf('.'))
                    },
                    type: 'undelete',
                    property: type,
                    prevValue,
                    newValue,
                    dirty: true
                })
                changes.changes.push(change)
                changes.update()
                //this.app.actions.switchView('spreadsheet')
                browser.actions.spreadsheetUpdate()
            }
        },
        deleteRow: function(row) {
            if (!browser.view.user) return
            let visibleRows = browser.view.sloSpreadsheet.visibleData
            // rowNumber = browser.view.sloSpreadsheet.options.focus.row
            // row = browser.view.sloSpreadsheet.getRowByLine(rowNumber)
            row = browser.view.sloSpreadsheet.getRow(row)
            let parent = browser.view.sloSpreadsheet.findParentRow(row)
            let parentNode = parent.node
            let type = row.node['@type']

            let prevValue = parentNode[type].slice()
            let newValue = prevValue.map(e => { 
                if (e.id==row.node.id) {
                    return Object.assign({}, e, {$mark:'deleted'}) // clone e, otherwise prevValue is changed as well
                } else {
                    return e
                }
            }) //filter(e => (e.id !== row.node.id))
            let timestamp = new Date().toISOString()
            let change = new changes.Change({
                id: parentNode.id ?? parentNode.uuid,
                meta: {
                    context: window.slo.getContextByType(parentNode['@type']),
                    title: parentNode.title,
                    type: parentNode['@type'],
                    timestamp: timestamp.substring(0, timestamp.indexOf('.'))
                },
                type: 'delete',
                property: type,
                prevValue,
                newValue,
                dirty: true,
            })
            changes.changes.push(change)
            changes.update()
//            this.app.actions.switchView('spreadsheet')
            browser.actions.spreadsheetUpdate()
        },
        showTypeSelector: async function(el) {
            let row = browser.view.sloSpreadsheet.getRow(el)
            let thisType = row.node['@type']
            let childTypes = slo.getAvailableChildTypes(thisType)
            let parentRow = browser.view.sloSpreadsheet.findParentRow(row)
            let siblingTypes = []
            if (parentRow) {
                let parentType = parentRow.node['@type']
                siblingTypes = slo.getAvailableChildTypes(parentType)
            }

            browser.view.availableTypes = childTypes
            browser.view.siblingTypes = siblingTypes
            document.body.dataset.simplyKeyboard = 'spreadsheet-types'
            let rect = el.getBoundingClientRect()
            let selector = document.querySelector('.slo-type-selector')
            let bodySize = document.body.getBoundingClientRect()
            selector.showModal()
            if (rect.bottom > (bodySize.height/2)) {
                let b = selector.getBoundingClientRect()
                selector.style.top = (rect.top - b.height ) +'px'
            } else {
                selector.style.top = (rect.top + 27)+'px' //TODO: get this from spreadsheet options (rowHeight)
            }
            selector.style.left = rect.left + 'px'
            // selector.setAttribute('open','open')
            if (!selector.hasClickListener) {
                selector.addEventListener('click', (evt) => {
                    selector.hasClickListener = true
                    let rect = selector.getBoundingClientRect()
                    let isInDialog = (rect.top<=evt.clientY 
                        && rect.bottom >= evt.clientY
                        && rect.left <= evt.clientX
                        && rect.right >= evt.clientX)
                    if (!isInDialog) {
                        browser.actions.hideTypeSelector()
                    }
                })
            }
            let checked = selector.querySelector('input:checked')
            if (checked) {
                checked.checked=false
            }
            selector.querySelector('input').focus()
        },
        hideTypeSelector: async function() {
            document.body.dataset.simplyKeyboard = 'spreadsheet'
            let selector = document.querySelector('.slo-type-selector')
            selector.close(); //removeAttribute('open')
        },
        'commitChanges': async function(message) {
            const linkArray = (list) => {
                let links = []
                for (let v of list) {
                    let id = v.id ?? v.uuid
                    if (JSONTag.getType(v)==='object' && id && !changes.isInsertedNode(id)) {
                        v = new JSONTag.Link('/uuid/'+id)
                    }
                    links.push(v)
                }
                return links
            }

            const createLinks = (changes) => {
                // create new changeHistory but with links, new copy so that if 
                // command fails, the changeHistory itself isn't changed
                let linkedChanges = []
                for (let change of changes) {
                    let linkedChange = Object.assign({}, change)
                    if (Array.isArray(change.newValue)) {
                        linkedChange.newValue = linkArray(linkedChange.newValue)
                    }
                    if (Array.isArray(change.prevValue)) {
                        linkedChange.prevValue = linkArray(linkedChange.prevValue)
                    }
                    linkedChanges.push(linkedChange)
                }
                return linkedChanges
            }
            
            const replaceNiveaus = (niveaus) => {
                return from(data.Niveau)
                .where({
                    title: anyOf(...newValue)
                })
            }

            // create and send command
            let commit = changes.merged.commit()

            let command = {
                id: uuid(),
                name: 'patch',
                author: browser.view.user,
                message,
                value: createLinks(commit)
            }
            let result = await slo.api.runCommand(command)
            if (result.status!=='accepted') {
                throw new Error('Invalid command: '+result.status+': '+result.message)
            }
            result = await slo.api.pollCommand(command.id)
            if (result.status!=='done') {
                throw new Error('Invalid command: '+result.status+': '+result.message)
            }                    
            changes.clear()
            browser.actions.switchView(browser.view.preferedView)

            return true
        },
        editDocument(el, value){
            browser.view.sloDocument.setFocus(el, value);
        },
        documentShowEditor(){
            // @TODO: move code that agregates the data to be shown here and pass it as parameter(s) into showEditor()
            // @NOTE : depending on context differen data will have to be displayed in the editor

            browser.view.sloDocument.showEditor()
        },
        documentSaveChanges(){
            
            // @TODO: documentSaveChanges should return the elements to be saved
            browser.view.sloDocument.documentSaveChanges();
        },
        documentHideEditor(){
            browser.view.sloDocument.hideEditor();
        }
        
    }
});

browser.view.pageSize = 100;
let user = localStorage.getItem('username')
let key = localStorage.getItem('key')
if (user && key) {
    browser.view.user = user
    browser.view.loggedIn = true
    slo.api.token = btoa(user+':'+key)
    browser.actions.loadSchemas().then(schemas => {
        browser.view.schemas = schemas
        document.body.classList.remove('loading')
    })
} else {
    browser.view.loggedIn = false
    document.body.classList.remove('loading')
}

browser.view.changes = changes
browser.view.dirtyChecked = true

