simply.route.init({
    root: window.release.apiPath
});

var routeMatch = simply.route.match
simply.route.match = function() {
    // do nothing, slo.contexts is not yet loaded, so all routes are on hold, wait for loadSchemas to finish
}

function uuid() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function mkTimestamp() {
    let timestamp =  new Date().toISOString()
    timestamp = timestamp.substring(0, timestamp.indexOf('.'))
    return timestamp
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
                            href: value+'/',
                            innerHTML: key
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
            "F2": (e) => {
                e.preventDefault()
                if (browser.view.user) {
                    let el = document.querySelector('td.focus')
                    browser.view.sloSpreadsheet.editor(el)
                }
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
            " ": (e) => { //Spacebar
                if (['INPUT','TEXTAREA'].includes(e.target.tagName)) {
                    // do nothing
                } else {
                    e.preventDefault()
                    browser.commands.toggleTree(document.querySelector('td.focus'))
                }
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
            },
            "Enter": async (e) => {
                let textarea = document.querySelector('.spreadsheet-editor')
                if (textarea.classList.contains('spreadsheet-editor-type-text') ||
                    textarea.classList.contains('.spreadsheet-editor-type-tree')
                ) {
                    e.preventDefault() // use shift-enter to add a linebreak
                }
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
          localStorage.setItem('spreadsheet-columns', JSON.stringify(browser.view.sloSpreadsheet.options.columns))
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
            browser.actions.updateFilterStatus()
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
            browser.actions.updateFilterStatus()
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
            return this.app.actions.switchView(value)
        },
        selectRoot: function(el, value) {
            // either in spreadsheet of document view, check which one
            // FIXME: support document view
            let root = this.app.view.roots.find(r => r.id==value)
            return this.app.actions.switchView(this.app.view.view, root)
        },
        selectNiveaus: function(el, value) {
            this.app.view.niveaus = Array.from(el.options).filter(o => o.selected).map(o => o.value)
            this.app.actions.switchView(this.app.view.view)
        },
        selectContexts: function(el, value) {
            this.app.view.contexts = Array.from(el.options).filter(o => o.selected).map(o => o.value)
            this.app.actions.switchView(this.app.view.view)
        },
        toggleTree: function(el,value) {
            let id = el.closest('tr').id
            browser.view.sloSpreadsheet.update({
                toggle: id
            })
            el.closest('tr').classList.toggle('closed')
        },
        toggleAllOpen: function(el, value) {
            browser.view.sloSpreadsheet.update({
                toggleAllOpen: true
            })
        },
        toggleFullscreen: function(el, value) {
            let state = "open";
            if (el.dataset.simplyState == "open") {
                state = "close"
            }
            el.dataset.simplyState = state;
            browser.actions.toggleFullScreen(state);
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
        selectTreeCell: (el, value) => {
            browser.view.sloSpreadsheet.focus(el.closest('td'))
        },
        cellEditor: (el, value) => {
            if (browser.view.user) {
                let el = document.querySelector('td.focus')
                browser.view.sloSpreadsheet.editor(el)
            }
        },
        nextPage: function(el,value) {
            page = Math.min(browser.view.max, parseInt(browser.view.page)+1);
            browser.actions.updatePage(page);
        },
        previousPage: function(el,value) {
            page = Math.max(0, parseInt(browser.view.page)-1);
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
        removeAllChanges: async function(el, value) {
            if (confirm('Weet u zeker dat u al uw lokale wijzigingen wil verwijderen?')) {
                browser.actions.removeAllChanges()
                browser.commands.closeDialog(el, value)
            }
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
        addNewRoot: async function(el, value) {
            browser.actions.addNewRoot(browser.view.listType)
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
            slo.contexts = {}
            let schemas = await window.localAPI.schemas()
            for (let schemaName in schemas.contexts) {
                let schema = schemas.contexts[schemaName]
                if (!schema.label) {
                    continue
                }
                let schemaLabel = 'curriculum-'+schema.label
                delete schema.label
                schema.name = schemaName
                let contextData = {}
                for (let typeName in schema) {
                    let typeLabel = schema[typeName].label
                    if (typeLabel) {
                        contextData[typeName] = typeLabel
                    }
                }
                slo.contexts[schemaLabel] = {
                    title: schemaName,
                    data: contextData,
                    schema
                }
            }
            initContexts()
            return schemas
        },
        updateView: async function(root) {
            this.app.actions.switchView(this.app.view.view, root)
        },
        updateFilterStatus: async function() {
            // if any filters are non-empty, add the 'filtered' class
            // otherwise remove it from the slo-tree-table
            let filters = browser.view.sloSpreadsheet.options?.filter
            if (filters && Object.values(filters).find(v => v)) {
                document.querySelector('table.slo-tree-table').classList.add('filtered')
            } else {
                document.querySelector('table.slo-tree-table').classList.remove('filtered')
            }
        },
        switchView: async function(view,root){
            let currentView = this.app.view.view;
            let item = this.app.view.item
            let id = item?.id ?? item?.uuid
            if (!id) {
                return
            }

            let currentItem, currentId, currentType, currrentContext;
            
            switch(view) {
                case 'item':
                    document.body.setAttribute('data-simply-keyboard','item')
                    this.app.actions.updatePaging()
                    // get focused item
                    return this.app.actions.item(id)
                    // switch to that
                break;
                case 'spreadsheet':
                    document.body.setAttribute('data-simply-keyboard','spreadsheet')
                    this.app.actions.updatePaging()
                    currentItem = id
                    currentId = 'https://opendata.slo.nl/curriculum/uuid/'+currentItem
                    if (!root) {
                        try {
                            let roots = await window.localAPI.roots(currentItem)
                            if (roots) {
                                this.app.view.roots = roots
                            }
                        } catch(e) {
                            //FIXME: should never happen... but...
                            root = { id: currentItem }
                        }
                    }
                    if (root && !this.app.view.roots?.find(r => r.id==root.id)) { //includes(root)) {
                        this.app.view.item.id = root.id
                        this.app.view.item.uuid = root.id // TODO: remove this when no longer needed
                        currentItem = root.id
                        currentId = 'https://opendata.slo.nl/curriculum/uuid/'+currentItem
                        this.app.view.roots = [root]
                    }
                    if (!this.app.view.roots) {
                        this.app.view.roots = []
                    }
                    editor.addDataSource('roots', {
                        load: this.app.view.roots.map(root => {
                            return {
                                value: root.id,
                                innerHTML: root.prefix ? root.prefix+' '+root.title : root.title
                            }
                        })
                    })
                    // get roots of current item
                    // pick one
                    this.app.view.root = root ?? this.app.view.roots?.[0] ?? {id: currentItem}
                    // switch to spreadsheet of that root
                    currentType = this.app.view.item['@type']
                    currentContext = window.slo.getContextByTypeName(currentType)
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
                                context: window.slo.getContextByTypeName(node['@type']),
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
                    this.app.actions.updatePaging()
                    currentItem = id
                    currentId = this.app.view.item['@id']
                    // get roots of current item
                    try {
                        let roots = await window.localAPI.roots(currentItem)
                        if (roots) {
                            this.app.view.roots = roots
                        }
                    } catch(e) {
                        // ignore
                    }
                    if (root && !this.app.view.roots?.find(r => r.id==root.id)) { //.includes(root)) {
                        this.app.view.item.id = root.id
                        this.app.view.item.uuid = root.id //TODO: remove this when no longer needed
                        currentItem = root.id
                        currentId = 'https://opendata.slo.nl/curriculum/uuid/'+currentItem
                        this.app.view.roots = [root]
                    }
                    if (!this.app.view.roots) {
                        this.app.view.roots = []
                    }
                    editor.addDataSource('roots', {
                        load: this.app.view.roots.map(root => {
                            return {
                                value: root.id,
                                innerHTML: root.prefix ? root.prefix+' '+root.title : root.title
                            }
                        })
                    })

                    // pick one
                    this.app.view.root = root ?? this.app.view.roots[0] ?? {id:currentItem}
                    // switch to spreadsheet of that root
                    currentType = this.app.view.item['@type']
                    currentContext = window.slo.getContextByTypeName(currentType)
                    if (!this.app.view.contexts) {
                        this.app.view.contexts = ['curriculum-basis'];
                    }
                    if (currentContext && !this.app.view.contexts.includes(currentContext)) {
                        this.app.view.contexts.push(currentContext)
                    }
                    if (!this.app.view.niveaus) {
                        this.app.view.niveaus = [];
                    }
                    await this.app.actions.document(this.app.view.root.id,this.app.view.contexts,this.app.view.niveaus)
                    
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
            })
            .catch(function(error) {
                browser.actions.handleAPIError(error)
            })
        },
        updatePage: function(page) {
            browser.view.page = page
            let url = new URL(document.location)
            url.searchParams.set('page', page)
            window.location = url.href
        },
        addNewRoot: async function(type) {
            // @TODO: check that type is a root type, error if not

            // add change to add new type entity
            let node = {
                    id: uuid(),
                    '@type': type,
                    unreleased: true
            }
            node['@id'] = window.release.apiPath+'uuid/'+node.id
            let change = new changes.Change({
                id: node.id,
                meta: {
                    context: window.slo.getContextByTypeName(type),
                    title: 'Adding '+type,
                    type,
                    timestamp: mkTimestamp()
                },
                type: 'new',
                newValue: node
            })
            changes.changes.push(change)
            changes.update()
            // switch to spreadsheet view of that entity
            history.pushState({}, null, node['@id']) //window.release.apiPath+'uuid/'+node.id)
            this.app.view.item = node
            let button = document.querySelector('[data-simply-command="switchView"][data-simply-value="spreadsheet"]')
            await browser.commands.switchView(button, 'spreadsheet') // updates selected view button and calls switchView action
            window.setTimeout(browser.commands.cellEditor, 100)
        },
        list: function(type) {
            browser.view['listTitle'] = window.titles[type];
            browser.view.list = [];
            return window.localAPI.list(type)
            .then(function(json) {
                type = type.substring(0, type.length-1)
                browser.view.context = window.slo.getContextByType(type)
                browser.view.contextLink = {
                    href: '/'+browser.view.context+'/',
                    innerHTML: slo.contexts[browser.view.context].title
                }

                browser.view.view = 'list';
                browser.view.listType = slo.getTypeNameByType(type);
                browser.view.list = json.data;
                browser.view.listIsRoot = json.root;
                browser.actions.updatePaging(json.count);
            })
            .catch(function(error) {
                browser.actions.handleAPIError(error)
            })
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
            return window.localAPI.spreadsheet(root, context, niveau)
            .then(function(json) {
                browser.view.root = json
                let defs = slo.treeToRows(browser.view.root)
                let prevColumns = JSON.parse(localStorage.getItem('spreadsheet-columns') ?? '[]')
                for (let column of prevColumns) {
                    let c = defs.columns.find(c => c.name==column.name)
                    if (c) {
                        c.checked = column.checked
                    }
                }
                browser.view.view = 'spreadsheet';
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
            .catch(function(error) {
                browser.actions.handleAPIError(error)
            })
        },
        spreadsheetResize: async function() {
            let panel = document.querySelector('.slo-content-panel')
            let rect = panel.getBoundingClientRect()
            let rowHeight = 27
            let rows = Math.floor(rect.height / rowHeight) - 3
            browser.view.sloSpreadsheet.update({
                rows
            })
            browser.view.sloSpreadsheet.render()
        },
        document: async function(root, context, niveau) {
            browser.view.documentList = []
            return window.localAPI.document(root, context, niveau)
            .then(async function(json) {
                browser.view.root = json
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
            .catch(function(error) {
                browser.actions.handleAPIError(error)
            })
        },
        doelniveauList: function(type) {
            browser.view['listTitle'] = window.titles[type];
            browser.view.list = [];
            return window.localAPI.doelniveauList(type)
            .then(function(json) {
                browser.view.view = 'doelniveauList';
                changes.getLocalView(json.data)
                browser.view.list = json.data;
                browser.view['listTitle'] = window.titles[type];
                console.log(window.titles[type],browser.view['listTitle']);
                browser.actions.updatePaging(json.count);
            })
            .catch(function(error) {
                browser.actions.handleAPIError(error)
            })
        },
        item: function(id) {
            return window.localAPI.item(id)
            .then(function(json) {
                let clone = JSON.parse(JSON.stringify(json))
                browser.view.item = clone
                if (browser.view.preferedView && browser.view.preferedView!='item') {
                    browser.actions.switchView(browser.view.preferedView)
                    return
                }
                browser.view.view = 'item';
                browser.actions.updatePaging();
            })
            .catch(function(error) {
                browser.actions.handleAPIError(error)
            })
        },
        listOpNiveau: function(niveau, type) {
            browser.view['listTitle'] = window.titles[type];
            browser.view.list = [];
            return window.localAPI.listOpNiveau(niveau, type)
            .then(function(json) {
                browser.view.view = 'list';
                browser.view.listType = slo.getTypeNameByType(type.slice(0, -1));
                browser.view.list = json;
                browser.view['listTitle'] = window.titles[type];
                console.log(window.titles[type],browser.view['listTitle']);
                browser.actions.updatePaging();
            })
            .catch(function(error) {
                browser.actions.handleAPIError(error)
            })
        },
        itemOpNiveau: function(niveau, type, id) {
            return window.localAPI.itemOpNiveau(niveau, type, id)
            .then(function(json) {
                browser.view.view = 'item';
                browser.view.item = json;
                browser.actions.updatePaging();
            })
            .catch(function(error) {
                browser.actions.handleAPIError(error)
            })
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
            window.slo.api.get(url + "?email=" + email)
            .catch(function(error) {
                browser.actions.handleAPIError(error)
            })
        },
        insertRow: async function(rowEl, type) {
            if (!browser.view.user) return
            let visibleRows = browser.view.sloSpreadsheet.visibleData
            let row = browser.view.sloSpreadsheet.getRow(rowEl)
            let parentNode = row.node
            let typeName = window.slo.getTypeNameByType(type)
            let node = {
                id: uuid(),
                '@type': typeName,
                'prefix': parentNode.prefix,
                'unreleased': true
            }
            node['@id'] = 'https://opendata.slo.nl/curriculum/uuid/'+node.id
            if (!parentNode[typeName]) {
                parentNode[typeName] = []
            }
            let prevValue = parentNode[typeName].slice()
            let newValue = parentNode[typeName].slice()
            newValue.unshift(new changes.InsertedLink(node))
            // now add this to the change history
            let timestamp =  new Date().toISOString()
            let change = new changes.Change({
                id: parentNode.id ?? parentNode.uuid,
                meta: {
                    context: window.slo.getContextByTypeName(parentNode['@type']),
                    title: parentNode.title,
                    type: parentNode['@type'],                    
                    timestamp: timestamp.substring(0, timestamp.indexOf('.'))
                },
                type: 'insert',
                property: typeName,
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
            let typeName = siblingNode['@type']
            let node = {
                id: uuid(),
                '@type': typeName,
                'prefix': siblingNode.prefix,
                'unreleased': true
            }
            node['@id'] = 'https://opendata.slo.nl/curriculum/uuid/'+node.id
            let parentRow = browser.view.sloSpreadsheet.findParentRow(row)
            let parentNode = parentRow.node
            if (!parentNode[typeName]) {
                parentNode[typeName] = []
            }
            let prevValue = parentNode[typeName].slice()
            let newValue = parentNode[typeName].slice()
            let index = parentNode[typeName].findIndex(n => n.id == siblingNode.id)
            newValue.splice(index+1, 0, new changes.InsertedLink(node))

            // now add this to the change history
            let timestamp =  new Date().toISOString()
            let change = new changes.Change({
                id: parentNode.id ?? parentNode.uuid,
                meta: {
                    context: window.slo.getContextByTypeName(parentNode['@type']),
                    title: parentNode.title,
                    type: parentNode['@type'],                    
                    timestamp: timestamp.substring(0, timestamp.indexOf('.'))
                },
                type: 'insert',
                property: typeName,
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
                let typeName = row.node['@type']
                let newValue = parentNode[typeName].slice()
                row.node.undelete(newValue)
                let prevValue = parentNode[typeName].slice()
                let timestamp = new Date().toISOString()
                let change = new changes.Change({
                    id: parentNode.id ?? parentNode.uuid,
                    meta: {
                        context: window.slo.getContextByTypeName(parentNode['@type']),
                        title: parentNode.title,
                        type: parentNode['@type'],   
                        timestamp: timestamp.substring(0, timestamp.indexOf('.'))
                    },
                    type: 'undelete',
                    property: typeName,
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
            let typeName = row.node['@type']

            let prevValue = parentNode[typeName].slice()
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
                    context: window.slo.getContextByTypeName(parentNode['@type']),
                    title: parentNode.title,
                    type: parentNode['@type'],
                    timestamp: timestamp.substring(0, timestamp.indexOf('.'))
                },
                type: 'delete',
                property: typeName,
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
            let siblingType = ''
            if (parentRow) {
                siblingType = parentRow.node['@type']
            }

            browser.view.availableTypes = childTypes
            browser.view.siblingType = siblingType
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
        removeAllChanges: async function() {
            changes.clear()
        },
        commitChanges: async function(message) {
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
        toggleFullScreen(state){
            browser.view.sloSpreadsheet.toggleFullScreen(state);
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
        },
        handleAPIError(error) {
            if (error.error) {
                switch(error.error) {
                    case 404:
                        browser.actions.notfound()
                    break
                    default:
                        if (error.message) {
                            alert('Probleem: '+error.error+': '+error.message)
                        } else {
                            alert('Probleem: er is een onbekend probleem opgetreden: '+error.error)
                            console.error(error)
                        }
                    break
                }
            } else {
                alert('Probleem: er is een onbekend probleem opgetreden.')
                console.error(error)
            }
       } 
    }
});

browser.view.pageSize = 100;
browser.view.page = 1;
let url = new URL(document.location)
if (url.searchParams.has('page')) {
    browser.view.page = parseInt(url.searchParams.get('page'));
}
let user = localStorage.getItem('username')
let key = localStorage.getItem('key')
if (user && key) {
    browser.view.user = user
    browser.view.loggedIn = true
    slo.api.token = btoa(user+':'+key)
    browser.view.changes = changes
} else {
    browser.view.loggedIn = false
}

browser.actions.loadSchemas().then(schemas => {
    browser.view.schemas = schemas
    simply.route.match = routeMatch // restore route.match now slo.contexts is available, and restart route matching
    simply.route.match(document.location.pathname)
    document.body.classList.remove('loading')
})

browser.view.dirtyChecked = true

window.addEventListener('resize', (e) => {
    if (browser.view.view == 'spreadsheet') {
        browser.actions.spreadsheetResize()
    }
})

// @NOTE: templates/scripts.html contains some extra javascript