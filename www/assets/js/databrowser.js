function getType(node) {
    return JSONTag.getAttribute(node, 'class') || node['@type']
} 

function getId(node) {
    let id = JSONTag.getAttribute(node, 'id')
    return id ? 'https://opendata.slo.nl/curriculum'+id : node['@id']
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

function getTypeRoutes() {
    let routes = {}
    for (let typeName in meta.schemas.types) {
        let type = meta.schemas.types[typeName].label
        routes['/'+type+'/'] = function(params) {
            browser.actions.list(type+'/')
        }
    }
    return routes
}


let meta = {}
var browser = {}

slo.api.loadSchemas()
.then(schemas => {
    meta.schemas = schemas

    let typeRoutes = getTypeRoutes()

    document.body.classList.remove('loading')

simply.route.init({
    root: window.release.apiPath
});

browser = simply.app({
    container: document.body,

    view: {
        showSource: 0,
        spreadsheet: {
            focus: {
                row: 0,
                column: 0
            }
        }
    },

    routes: Object.assign(typeRoutes, {
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
        '/doelniveau/': function(params) {
            browser.actions.doelniveauList('doelniveau/')
        },
        '/niveau/:niveau/kerndoel_vakleergebied/:vakid': function(params) {
            browser.actions.itemOpNiveau(params.niveau, 'kerndoelvakleergebied/', params.vakid);
        },

        '/niveau/:niveau': function(params) {
            browser.actions.item(params.niveau);
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
    }),
    keyboard: {
        default: {
            //sometimes the keyboard needs to work as normal.
        },

        //@TODO: keyboard definition should be in spreadsheet.js, and referenced here
        spreadsheet: {
            "Control+f": (e) => {
                browser.actions.switchKeyboard('spreadsheet-search')
                browser.actions.showSearch()
                e.preventDefault()
            },
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
                browser.view.sloSpreadsheet.goto(1,1)
            },
            "End": (e) => {
                e.preventDefault()
                let spreadsheet = browser.view.sloSpreadsheet
                let data = spreadsheet.visibleData
                let row = data.length-1
                let column = spreadsheet.options.columns.length
                spreadsheet.goto(data[row].index, column)
            },
            "PageUp": (e) => {
                e.preventDefault()
                let spreadsheet = browser.view.sloSpreadsheet
                let rowsPerPage = spreadsheet.options.rows
                let data = spreadsheet.visibleData
                let currentLine = spreadsheet.visibleData.findIndex(r => r.index == spreadsheet.options.focus.row)
                let row = Math.max(0, currentLine - (rowsPerPage - 1) -1)
                let column = spreadsheet.options.focus.column
                spreadsheet.goto(data[row].index, column)
            },
            "PageDown": (e) => {
                e.preventDefault()
                let spreadsheet = browser.view.sloSpreadsheet
                let rowsPerPage = spreadsheet.options.rows
                let data = spreadsheet.visibleData
                let currentLine = spreadsheet.visibleData.findIndex(r => r.index == spreadsheet.options.focus.row)
                let row = Math.min(data.length-1, currentLine + (rowsPerPage - 1) -1)
                let column = spreadsheet.options.focus.column
                spreadsheet.goto(data[row].index, column)                    
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
        "spreadsheet-search": {
            "Escape": (e) => {
                e.preventDefault()
                if (document.querySelector('.slo-spreadsheet-search')?.getAttribute('open')) {
                    document.querySelector('.slo-spreadsheet-search').removeAttribute('open')
                }
                browser.actions.switchKeyboard()
            },
            "ArrowUp": (e) => {
                const searchInput = document.querySelector('.slo-spreadsheet-search input[name="searchText"]')
                browser.actions.searchTextPrev(searchInput.value)
                e.preventDefault()
            },
            "ArrowDown": (e) => {
                const searchInput = document.querySelector('.slo-spreadsheet-search input[name="searchText"]')
                browser.actions.searchTextNext(searchInput.value)
                e.preventDefault()
            }
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
                if (browser.view.user) {
                    let el = document.querySelector('td.focus')
                    let selector = document.querySelector('.slo-type-selector')
                    let type = selector.querySelector('input:checked')
                    if (type) {
                        //FIXME: check for addNiveau, so do form submit which triggers form command
                        //FIXME: check that .slo-type-selector is visible
                        e.preventDefault()
                        browser.actions.hideTypeSelector()
                        return browser.actions.insertRow(el.closest('tr'), type.value)
                    }
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
                    let targets = Array.from(target.closest('.slo-cell-selector').querySelectorAll('input[type="checkbox"],input[type="radio"]'))
                    let current = targets.findIndex(input => input==e.target)
                    if (current>=0) {
                        current++
                        targets[current]?.focus()
                    }
                    e.preventDefault()
                }
            },
            "ArrowUp": (e) => {
                let target = document.activeElement
                if (target && (target.type=='checkbox' || target.type=='radio')) {
                    let targets = Array.from(target.closest('.slo-cell-selector').querySelectorAll('input[type="checkbox"],input[type="radio"]'))
                    let current = targets.findIndex(input => input==e.target)
                    if (current>0) {
                        current--
                        targets[current]?.focus()
                    }
                    e.preventDefault()
                }
            },
            "Control+Enter": async (e) => {
                // save changes, close editor
                e.preventDefault()
                await browser.actions.saveChangesSpreadsheet()
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
                browser.actions.saveChangesDocument()
            },
            "Escape": (e) => {
                e.preventDefault();
                browser.actions.documentHideEditor()
            }
        },
    },

    commands: {
        toggleSource: (el, value) => {
            browser.view.showSource = browser.view.showSource ? 0 : 1
            let url = new URL(document.location.href)
            if (browser.view.showSource) {
                url.searchParams.set('source', browser.view.showSource)
            } else {
                url.searchParams.delete('source')
            }
            history.pushState({}, null, url)
        },
        copyPre: (el, value) => {
            const pre = el.parentElement.querySelector('pre')
            navigator.clipboard.writeText(pre.innerText)
        },
        saveToken: (form, values) => {
            const requestToken = values.requestToken
            const requestEmail = values.requestEmail
            localStorage.setItem('requestToken', JSON.stringify(requestToken))
            localStorage.setItem('requestEmail', JSON.stringify(requestEmail))
            browser.view.requestEmail = requestEmail
            browser.view.requestToken = requestToken
            window.location.reload()
        },
        searchText: (el, value) => {
            if (!browser.view.searchFrom) {
                browser.view.searchFrom = Object.assign({},browser.view.sloSpreadsheet.options.focus)
            }
            browser.actions.searchTextNext(value, browser.view.searchFrom)
        },
        searchTextNext: (el) => {
            const form = el.closest('form')
            const search = form.elements['searchText']
            browser.actions.searchTextNext(search.value)
        },
        searchTextPrev: (el) => {
            const form = el.closest('form')
            const search = form.elements['searchText']
            browser.actions.searchTextPrev(search.value)
        },
        saveChangesDocument:(form, values)=>{
            browser.actions.saveChangesDocument()
        },
        saveChangesSpreadsheet: (form, values) => {
            browser.actions.saveChangesSpreadsheet()
        },
        import: (el, value) => {
            document.getElementById('importDialog').showModal()            
        },
        importXLSX: async (form, values) => {
            if (await browser.actions.importXLSX(form.file.files[0])) {
                document.getElementById('importDialog').close()
            }
        },
        export: async (el, value) => {
            const csv = await browser.actions.export()
            window.open(encodeURI("data:text/csv;charset=urf-8,"+csv))
        },
        // @TODO : spreadsheet commands should be in spreadsheet.js and referenced here
        closeFilter: (el, value) => {
            el.closest('.ds-dropdown').querySelector('.ds-dropdown-state').checked = false
            // add filter display trigger here
            browser.actions.updateFilterStatus()

        },
        closeDialog: (el, value) => {
            el.closest('dialog').close(false)
            browser.actions.switchKeyboard()
            browser.actions.updateView()
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
        },
        filterText: (el, value) => {
            document.body.dataset.simplyKeyboard = 'default'
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
        removeFilter: (el, value) => {
            let parts = (el.parentElement.parentElement.id).split("-");
            parts.shift()
            let columnValue = parts.join("-")
        
            let column = browser.view.sloSpreadsheet.options.columns
            .find(c => c.value==columnValue)

            let filter = {}

            if (Array.isArray(browser.view.sloSpreadsheet.options.filter[columnValue])){

                filter[columnValue] = ''
                column.filteredValues = ''              
                browser.view.sloSpreadsheet.update({
                    filter
                })              
                delete browser.view.sloSpreadsheet.options.filter[columnValue]
                browser.actions.updateFilterStatus()
            }

            if (!Array.isArray(browser.view.sloSpreadsheet.options.filter[columnValue])){
                let filter = {}
                filter[columnValue] = ""
                browser.view.sloSpreadsheet.update({
                    filter
                })        
                delete browser.view.sloSpreadsheet.options.filter[columnValue]
                browser.actions.updateFilterStatus()
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
            browser.actions.switchKeyboard('default')
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
                browser.actions.switchView(browser.view.preferedView)
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
            browser.actions.showTypeSelector(el)                
        },
        showLinkForm: async function(el, value) {
            let dialog = el.closest('dialog')
            let typelist = dialog.querySelector('.slo-types')
            dialog.querySelectorAll('form').forEach(form => form.classList.add('slo-hidden'))
            let form = dialog.querySelector('form.slo-link')
            form.classList.remove('slo-hidden')
            typelist.classList.add('slo-hidden')
            form.querySelector('input[name="link"]').focus()
        },
        showAvailableTypes: async function(el, value) {
            let dialog = el.closest('dialog')
            let typelist = dialog.querySelector('.slo-types')
            dialog.querySelectorAll('form').forEach(form => form.classList.add('slo-hidden'))
            typelist.classList.remove('slo-hidden')
            typelist.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false)
        },
        addChild: async function(el, value) {
            if (value=='niveau') {
                let dialog = el.closest('dialog')
                let typelist = dialog.querySelector('.slo-types')
                dialog.querySelectorAll('form').forEach(form => form.classList.add('slo-hidden'))
                let form = dialog.querySelector('form.slo-niveau')
                form.classList.remove('slo-hidden')
                typelist.classList.add('slo-hidden')
                form.querySelector('input[name="niveau"]').focus()
            } else {
                browser.actions.hideTypeSelector()
                //el = document.querySelector('td.focus') //FIXME: use el set when starting dialog
                el = browser.view.insertParentRow
                let row = await browser.actions.insertRow(el.closest('tr'),value)
                let line = browser.view.sloSpreadsheet.getLineByRow(row)
                el = browser.view.sloSpreadsheet.goto(row.index, 1)
                while (!browser.view.sloSpreadsheet.isEditable(el)) {
                    el = browser.view.sloSpreadsheet.moveNext()
                }
                browser.view.sloSpreadsheet.editor(el)
            }
        },
        addLink: async function(form, values) {
            try {
                el = browser.view.insertParentRow
                let parentRow = browser.view.sloSpreadsheet.getRow(el.closest('tr'))
                await browser.actions.addLink(parentRow, values.link)
                browser.actions.spreadsheetUpdate()
                browser.actions.hideTypeSelector()
            } catch(e) {
                browser.view.addEntityError = e.message || e.error || e
            }
        },
        addNiveau: async function(form, values) {
            browser.actions.hideTypeSelector()
            el = browser.view.insertParentRow
            let parentRow = browser.view.sloSpreadsheet.getRow(el.closest('tr'))
            if (await browser.actions.addNiveau(parentRow, values.niveau)) {
                browser.actions.spreadsheetUpdate()
                browser.actions.hideTypeSelector()
            }
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
            el = browser.view.sloSpreadsheet.goto(newrow.index, 1)
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
        focusElement: function(el, value){
            browser.actions.focusElement(el, value)
        },
        documentEdit: function(el, value){
            browser.actions.documentEdit()
        },
        cancel: function(el, value){
            browser.actions.hideEditorDialog(el);
        },
        documentCloseEditor: function(){
            browser.actions.documentHideEditor()
        }
    },
    actions: {
        showSearch: () => {
            let searchDialog = document.querySelector('.slo-spreadsheet-search')
            searchDialog.setAttribute('open','open')
            searchDialog.querySelector('[name="searchText"]').focus()
        },
        searchTextNext: async function(search, from) {
            const results = browser.view.sloSpreadsheet.search(search)
            if (!results.length) {
                return
            }
            const focus = from || browser.view.sloSpreadsheet.options.focus
            for (const result of results) {
                if (result.row==focus.row) {
                    if (result.column>focus.column) {
                        return browser.actions.highlightSearchResult(search, result.row, result.column)
                    }
                } else if (result.row>focus.row) {
                    return browser.actions.highlightSearchResult(search, result.row, result.column)
                }
            }
            let result = results[0]
            return browser.actions.highlightSearchResult(search, result.row, result.column)
        },
        searchTextPrev: async function(search) {
            const results = browser.view.sloSpreadsheet.search(search).reverse()
            if (!results.length) {
                return
            }
            const focus = browser.view.sloSpreadsheet.options.focus
            for (const result of results) {
                if (result.row<focus.row) {
                    return browser.actions.highlightSearchResult(search, result.row, result.column)
                } else if (result.row==focus.row) {
                    if (result.column<focus.column) {
                        return browser.actions.highlightSearchResult(search, result.row, result.column)
                    }
                }
            }
            let result = results[0]
            return browser.actions.highlightSearchResult(search, result.row, result.column)
        },
        highlightSearchResult: async function(search, row, column) {
            const el = browser.view.sloSpreadsheet.goto(row, column)
        },
        saveChangesSpreadsheet: async function(){
           browser.view.sloSpreadsheet.saveChanges()
           let el = document.querySelector('td.focus')
           browser.view.sloSpreadsheet.selector(el)
        },
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
        importXLSX: async function(file) {
            let tree = {
                errors: []
            }
            try {
                tree = await slo.importXLSX(file, meta.schemas, window.slo.niveaus)
                if (tree.roots.length>1) {
                    tree.errors.push(new Error('Er mag maar 1 root entiteit zijn', {cause:tree.roots}))
                }
                if (!tree.errors.length) {
                    // check if root is a new entity or existing one
                    let root = tree.roots[0]
                    let change = null
                    let current = null
                    try {
                        current = await localAPI.item(root.id)
                    } catch(e) {
                        // ignore errors
                    }
                    if (current) {
                        // do an update
                        change = new changes.Change({
                            id: root.id,
                            meta: {
                                context: window.slo.getContextByTypeName(root['@type']),
                                title: root.title,
                                type: root['@type'],
                                timestamp: mkTimestamp()
                            },
                            type: 'update',
                            prevValue: current,
                            newValue: root
                        })
                    } else {
                        // do a new
                        change = new changes.Change({
                            id: root.id,
                            meta: {
                                context: window.slo.getContextByTypeName(root['@type']),
                                title: 'Importing '+root['@type'],
                                type: root['@type'],
                                timestamp: mkTimestamp()
                            },
                            type: 'new',
                            newValue: root
                        })
                    }
                    changes.changes.push(change)
                    changes.update()
                    // switch to spreadsheet view of that entity
                    history.pushState({}, null, root['@id']) //window.release.apiPath+'uuid/'+node.id)
                    this.app.view.item = root
                    let button = document.querySelector('[data-simply-command="switchView"][data-simply-value="spreadsheet"]')
                    await browser.commands.switchView(button, 'spreadsheet') // updates selected view button and calls switchView action
                }
            } catch(error) {
                if (!Array.isArray(error.cause)) {
                    error.cause = [ error.cause ]
                }
                error.cause.forEach(cause => {
                    tree.errors.unshift(new Error(error.message, {cause}))
                })
            }
            if (tree?.errors?.length) {
                // collect errors by message
                let errorMap = new Map()
                for(error of tree.errors) {
                    if (!errorMap.has(error.message)) {
                        errorMap.set(error.message, { message: error.message, errors: []})
                    }
                    let em = errorMap.get(error.message)
                    em.errors.push(error)
                }
                this.app.view.importErrors = Array.from(errorMap, ([n, v]) => v)
                return false
            }
            return true
        },
        export: async function() {
            const escapeCSV = (v => {
                if (Array.isArray(v)) {
                    return v.map(escapeCSV).join(',')
                } else if (typeof v == 'string' || v instanceof String) {
                    return v.replaceAll('"','""')
                } else {
                    return ''+v
                }
            })
            //   get current visible columns
            const visibleColumns = this.app.view.sloSpreadsheet.options.columns.filter(c => c.checked)
            let headings = visibleColumns.map(c => c.value)
            let mapping = []

            // TODO: is there a filter?
            if (!document.querySelector('.slo-tree-table.sorted,.slo-tree-table.filtered')) {
                // if not add parentID: 
                headings.unshift('ParentID')

                let lastId = ''
                let parents = []
                let indent = 0
                mapping.push((row) => {
                    if (row.indent>indent) {
                        parents.push(lastId)
                    }
                    while (indent>row.indent) {
                        indent--
                        parents.pop()
                    }
                    indent = row.indent
                    lastId = row.node.id
                    return parents[parents.length-1] || ''
                })
            }
            // continue here withour parentID
            visibleColumns.forEach(c => {
                mapping.push((r) => {
                    let result
                    switch(c.value) {
                        case 'id':
                            result = r.node.id
                        break
                        case 'niveaus':
                        case 'level':
                            if (r.node.Niveau) {
                                result = r.columns[c.value] || ''
                            } else {
                                result = ''
                            }
                        break
                        default:
                            result = r.columns[c.value] || ''
                        break
                    }
                    return result
                })
            })
            //   get current visibleRows
            const visibleRows = this.app.view.sloSpreadsheet.visibleData
            //   create csv from rows and columns
            let csv = [headings.map(h => escapeCSV(h)).join(';')]
            visibleRows.forEach(row => {
                let foo = mapping.map(m => m(row))
                let bar = foo.map(c => '"'+escapeCSV(c)+'"') // FIXME: not all columns must be exported - Niveaus only for editable niveaus
                let baz = bar.join(';')
                csv.push( baz )
            })
            return csv.join("\n") //TODO: add correct header?
        },
        updateView: async function(root) {
            this.app.actions.switchView(this.app.view.view, root)
        },
        updateFilterStatus: async function() {
            let filters = browser.view.sloSpreadsheet.options?.filter           
            if (filters && Object.values(filters).find(v => v)) {
                document.querySelector('table.slo-tree-table').classList.add('filtered')
            } else {
                document.querySelector('table.slo-tree-table').classList.remove('filtered')
            }
            browser.view.sloSpreadsheet.render()
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
//                        this.app.view.item.uuid = root.id // TODO: remove this when no longer needed
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
//                        this.app.view.item.uuid = uuid //TODO: remove this when no longer needed
                        history.replaceState({}, '', new URL(uuid, window.location))
                    })
                    this.app.view.sloSpreadsheet.onEdit((update) => {
                        let index = parseInt(update.id.substring(4))-1
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
                        } else if (columnDef.type=='checkbox') {
                            let checkedValue = update.values.getAll(update.property).pop()
                            newValue = (checkedValue=="1") ? 1 : 0
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
                                context: window.slo.getContextByTypeName(getType(node)),
                                title: node.title ?? '[Geen titel]',
                                type: getType(node),
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
//                        this.app.view.item.uuid = root.id //TODO: remove this when no longer needed
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
            return window.slo.api.get('search', {text: text}).then(data => {
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
        addLink: async function(row, id) {
            // turn values.link into an id or error
            id = new URL(id, document.location)
            id = id.pathname.split('/').filter(Boolean).pop()
            // fetch the entity with this id or error
            let entity = await localAPI.item(id)
            // check the type of the entity with the row.node 
            let parentType = getType(row.node)
            let entityType = getType(entity)
            // item() also adds parent links, but these must not be kept or the tree will become a graph
            for (let prop of Object.keys(entity)) {
                if (prop[0]>='A' && prop[0]<='Z') {
                    if (!meta.schemas.types[entityType].children[prop]) {
                        delete entity[prop]
                    }
                }
            }
            // if allowed child - addChild link
            if (meta.schemas.types[parentType]?.children[entityType]) {
                // TODO: create a function to add this change, so we can re-use it 
                // create change to add this entity here
                let prop, prevValue, newValue
                let dirty = true
                let node = row.node
                prop = node[entityType]
                prevValue = prop
                newValue = Array.from(new Set([entity, ...prop])) // Set so the array is unique TODO: make a function for this that guarantees keeping the same order and removing only doubled entities later in the array
                dirty = true
                if (newValue == prevValue) {
                    return // no change failsave
                } else if (!newValue && !prevValue) {
                    return // check if both are empty
                }

                let timestamp = new Date().toISOString()
                let change = new changes.Change({
                    id: node.id ?? node.uuid,
                    meta: {
                        context: window.slo.getContextByTypeName(getType(node)),
                        title: node.title,
                        type: getType(node),
                        timestamp: timestamp.substring(0, timestamp.indexOf('.'))
                    },
                    type: 'patch',
                    property: entityType,
                    prevValue,
                    newValue,
                    dirty
                })
                changes.changes.push(change)
                changes.update()
                return browser.actions.spreadsheetUpdate()
            } else {
                let siblingNode = row.node
                parentRow = browser.view.sloSpreadsheet.findParentRow(row)
                if (parentRow) {
                    parentType = getType(parentRow.node)
                    // if not, but row.node.parent allows it, addSibling link
                    if (meta.schemas.types[parentType]?.children[entityType]) {
                        // create change to add this entity here
                        let prop, prevValue, newValue
                        let dirty = true
                        let node = parentRow.node
                        prop = node[entityType]
                        prevValue = prop
                        //FIXME: add entity directly after siblingNode
                        let siblingIndex = prevValue.findIndex(n => n===siblingNode)
                        if (siblingIndex==-1) { // should never happen
                            newValue = Array.from(new Set([...prop, entity])) // Set so the array is unique
                        } else {
                            newValue = prevValue.slice()
                            newValue.splice(siblingIndex+1, 0, entity)
                            newValue = Array.from(new Set(newValue)) // Set so the array is unique TODO: make a function for this that guarantees keeping the same order and removing only doubled entities later in the array
                        }
                        dirty = true
                        if (newValue == prevValue) {
                            return // no change failsave
                        } else if (!newValue && !prevValue) {
                            return // check if both are empty
                        }

                        let timestamp = new Date().toISOString()
                        let change = new changes.Change({
                            id: node.id,
                            meta: {
                                context: window.slo.getContextByTypeName(getType(node)),
                                title: node.title,
                                type: getType(node),
                                timestamp: timestamp.substring(0, timestamp.indexOf('.'))
                            },
                            type: 'patch',
                            property: entityType,
                            prevValue,
                            newValue,
                            dirty
                        })
                        changes.changes.push(change)
                        changes.update()
                        return browser.actions.spreadsheetUpdate()
                    } else {
                        throw new Error('Entiteit type '+entityType+' mag niet onder of naast deze rij geplaatst worden')
                    }
                } else {
                    throw new Error('Entiteit type '+entityType+' mag niet onder of naast deze rij geplaatst worden')
                }
            }
        },
        addNiveau: async function(row, niveau) {
            //TODO: deze code is duplicaat van code in onEdit
            //functie abstraheren en in beide plekken aanroepen
            let prop, prevValue, newValue
            let dirty = browser.view.dirtyChecked==1
            let node = row.node
            prop = row.columns.niveaus
            prevValue = prop
            newValue = Array.from(new Set([...prop, niveau])) // Set so the array is unique
            dirty = true
            if (newValue == prevValue) {
                return // no change failsave
            } else if (!newValue && !prevValue) {
                return // check if both are empty
            }

            let timestamp = new Date().toISOString()
            let change = new changes.Change({
                id: node.id ?? node.uuid,
                meta: {
                    context: window.slo.getContextByTypeName(getType(node)),
                    title: node.title ?? '[Geen titel]',
                    type: getType(node),
                    timestamp: timestamp.substring(0, timestamp.indexOf('.'))
                },
                type: 'patch',
                property: 'niveaus',
                prevValue,
                newValue,
                dirty
            })
            changes.changes.push(change)
            changes.update()
            return true
        },
        list: function(type) {
            browser.view['listTitle'] = window.titles[type];
            browser.view.list = [];
            return window.localAPI.list(type)
            .then(function(json) {
                browser.view.request = window.localAPI.reflect.list(type)
                browser.view.source = JSON.stringify(json, null, 4)
                type = type.substring(0, type.length-1)
                browser.view.context = window.slo.getContextByType(type)
                browser.view.contextLink = {
                    href: '/'+browser.view.context+'/',
                    innerHTML: slo.contexts[browser.view.context].title
                }

                browser.view.view = 'list';
                browser.view.listType = slo.getTypeNameByType(type);
                browser.view.list = json.data;
                browser.view.listIsRoot = meta.schemas.types[browser.view.listType].root;
                browser.actions.updatePaging(json.count);
            })
            .catch(function(error) {
                browser.actions.handleAPIError(error)
            })
        },
        spreadsheetUpdate: function() {
            let localData = changes.getLocalView(browser.view.root)
            let defs = slo.treeToRows(localData)
            browser.view.sloSpreadsheet.update({data:defs.rows}) //FIXME: if a node was previously changed (deleted row) but no longer, this doesn't remove the changed mark or update that property to undelete the row
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
                let localData = changes.getLocalView(json.data)
                browser.view.list = localData;
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
                browser.view.request = window.localAPI.reflect.item(id)
                browser.view.source = JSON.stringify(json, null, 4)
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
                browser.view.source = JSON.stringify(json, null, 4)
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
                browser.view.source = JSON.stringify(json, null, 4)
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
            window.slo.api.get("register/?email=" + email)
            .catch(function(error) {
                browser.actions.handleAPIError(error)
            })
        },
        insertRow: async function(rowEl, type) {
            if (!browser.view.user) return
            let row = browser.view.sloSpreadsheet.getRow(rowEl)
            let line = row.index
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
                    context: window.slo.getContextByTypeName(getType(parentNode)),
                    title: 'addChild to '+parentNode.title,
                    type: getType(parentNode),                    
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
            let rows = browser.view.sloSpreadsheet.getRowsById(node['@id'])//FIXME: can be a different row than what was just inserted
            rows = rows.filter(r => r.index>line)
            return rows[0]
        },
        appendRow: async function(rowEl) {
            if (!browser.view.user) return
            let row = browser.view.sloSpreadsheet.getRow(rowEl)
            let line = row.index
            let siblingNode = row.node
            let typeName = getType(siblingNode)
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
                    context: window.slo.getContextByTypeName(getType(parentNode)),
                    title: 'append child to '+parentNode.title,
                    type: getType(parentNode),
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
            let rows = browser.view.sloSpreadsheet.getRowsById(node['@id']) //FIXME: can be a different row than what was just inserted
            rows = rows.filter(r => r.index>line)
            return rows[0]
        },
        undeleteRow: function(rowEl) {
            row = browser.view.sloSpreadsheet.getRow(rowEl)
            if (row.deleted) {
                let parent = browser.view.sloSpreadsheet.findParentRow(row)
                let parentNode = parent.node
                let typeName = getType(row.node)
                let prevValue = parentNode[typeName].slice()
                let newValue = parentNode[typeName].slice()
                row.node.undelete(newValue)
                parentNode[typeName] = newValue //Makes sure current datamodel is up to date
                let timestamp = new Date().toISOString()
                let change = new changes.Change({
                    id: parentNode.id ?? parentNode.uuid,
                    meta: {
                        context: window.slo.getContextByTypeName(getType(parentNode)),
                        title: 'undelete child in '+parentNode.title,
                        type: getType(parentNode),   
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
            row = browser.view.sloSpreadsheet.getRow(row)
            let parent = browser.view.sloSpreadsheet.findParentRow(row)
            let parentNode = parent.node
            let typeName = getType(row.node)

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
                    context: window.slo.getContextByTypeName(getType(parentNode)),
                    title: 'delete child of '+parentNode.title,
                    type: getType(parentNode),
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
            browser.view.insertParentRow = el.closest('tr')
            browser.view.addEntityError = ''
            let row = browser.view.sloSpreadsheet.getRow(el)
            let thisType = getType(row.node)
            let childTypes = slo.getAvailableChildTypes(thisType)
            let parentRow = browser.view.sloSpreadsheet.findParentRow(row)
            let siblingType = thisType

            browser.view.availableTypes = childTypes
            browser.view.siblingType = siblingType
            document.body.dataset.simplyKeyboard = 'spreadsheet-types'
            let rect = el.getBoundingClientRect()
            let selector = document.querySelector('.slo-type-selector')
            let bodySize = document.body.getBoundingClientRect()
            let forms = selector.querySelectorAll('form')
            let typelist = selector.querySelector('[data-simply-list="availableTypes"]')
            forms.forEach(form => form.classList.add('slo-hidden'))
            typelist.classList.remove('slo-hidden')
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
                    let isInDialog = true
                    if (evt.target) {
                        if (evt.target.closest('dialog')!=selector) {
                            isInDialog = false
                        }
                    } else {
                        let rect = selector.getBoundingClientRect()
                        isInDialog = (rect.top<=evt.clientY 
                            && rect.bottom >= evt.clientY
                            && rect.left <= evt.clientX
                            && rect.right >= evt.clientX)
                    }
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
            const walk = e => {
                if (e.id) {
                    JSONTag.setAttribute(e, 'id', e.id)
                    Object.entries(e).forEach(([prop, values]) => {
                        if (Array.isArray(values)) {
                            values.forEach(v => walk(v))
                        } else if (JSONTag.getType(values)=='object') {
                            Object.values(values).forEach(v => walk(v))
                        }
                    })
                }
            }
            walk(commit)
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
        focusElement(el, value){
            browser.view.sloDocument.setFocus(el, value);
        },
        documentEdit(){
            // @TODO: move code that agregates the data to be shown here and pass it as parameter(s) into showEditor()
            // @NOTE : depending on context differen data will have to be displayed in the editor

            browser.view.sloDocument.showEditor()
        },
        saveChangesDocument(){
            
            // @TODO: saveChangesDocument should return the elements to be saved
            browser.view.sloDocument.saveChangesDocument();
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
       }, 

        switchKeyboard(keyboard){
            if(!keyboard){
                if(document.querySelector(".slo-document")){
                    document.body.dataset.simplyKeyboard = 'document'
                } else if(document.querySelector(".slo-spreadsheet")){
                    document.body.dataset.simplyKeyboard = 'spreadsheet'
                } else {
                    document.body.dataset.simplyKeyboard = 'default'
                }
            } else {
                document.body.dataset.simplyKeyboard = keyboard
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
const requestToken = localStorage.getItem('requestToken')
const requestEmail = localStorage.getItem('requestEmail')
if (requestToken) {
    browser.view.requestToken = JSON.parse(requestToken)
}
if (requestEmail) {
    browser.view.requestEmail = JSON.parse(requestEmail)
}

browser.view.dirtyChecked = true
const locationURL = new URL(document.location.href)
if (locationURL.searchParams.get('source')) {
    browser.view.showSource = 1
}
window.addEventListener('resize', (e) => {
    if (browser.view.view == 'spreadsheet') {
        browser.actions.spreadsheetResize()
    }
})

}); // end promise.then


let dragging = false
/*
simply.activate.addListener('slip', function() {
    if (browser.view.user) {
        new Slip(this)
    }
})
*/
document.addEventListener('slip:reorder', function(e) {
    dragging = true
    let node = browser.view.item
    let prop, prevValue, newValue
    let list = e.target.closest('ul')
    let property = list.dataset.simplyList.substr(5)
    prevValue = node[property].slice()
    e.target.parentNode.insertBefore(e.target, e.detail.insertBefore)
    newValue = Array.from(list.querySelectorAll('li a')).map(e => e.href).map(href => prevValue.find(s => s['@references']==href))
    //FIXME: get id values in each entry in newValue/prevValue, otherwise commit won't work
    //commit will not change the values to JSONTag.Link if no .id field is
    if (arrayEquals(newValue, prevValue)) {
        return // no change failsave
    } else if (!newValue && !prevValue) {
        return // check if both are empty
    }

    let timestamp = new Date().toISOString()
    let change = new changes.Change({
        id: node.id ?? node.uuid,
        meta: {
            context: window.slo.getContextByTypeName(getType(node)),
            title: node.title,
            type: getType(node),
            timestamp: timestamp.substring(0, timestamp.indexOf('.'))
        },
        type: 'patch',
        property,
        prevValue,
        newValue,
        dirty: true
    })
    changes.changes.push(change)
    changes.update()
})
document.addEventListener('click', function(e) {
    if (dragging) {
        e.preventDefault()
        e.stopPropagation()
        dragging = false
    }
}, true)

document.addEventListener('simply-content-loaded', function(evt) {
    var menu = editor.currentData['/'].menu;
    if (menu && menu[1]) {
        var api = menu[1].submenu[0]['data-simply-template'] = 'api';
    }
});

var treeviewNiveaus, treeviewSchemas;
simply.activate.addListener('roots-select', function() {
    if (!browser.view.roots || browser.view.roots.length<2) {
        document.querySelector('.slo-roots-select').style.display = 'none'
    } else {
        treeviewNiveaus = new vanillaSelectBox('.slo-roots-select');
        if (browser.view.root) {
            let selectedIndex = browser.view.roots.findIndex(v => v.id==browser.view.root?.id)
            if (selectedIndex>-1) {
                treeviewNiveaus.setValue(browser.view.roots[selectedIndex].id)
            }
        }
    }
});
simply.activate.addListener('niveaus-select', function() {
    treeviewNiveaus = new vanillaSelectBox('.slo-niveaus-select', {'placeHolder': 'Selecteer niveaus', 'search':true});
});
simply.activate.addListener('contexts-select', function() {
    if (browser.view.contexts) {
        Array.from(this.options).forEach(option => {
            if (browser.view.contexts.includes(option.value)) {
                option.setAttribute('selected','selected');
            }
        })
    }
    treeviewSchemas = new vanillaSelectBox('.slo-contexts-select', {'placeHolder':'Selecteer contexten'});
});

simply.collect.addListener('niveaus-contexts', function(elements) {
    browser.view.niveaus = Array.from(elements['niveaus'].options).filter(o => o.selected).map(o => o.value)
    browser.view.contexts = Array.from(elements['contexts'].options).filter(o => o.selected).map(o => o.value)
    if (browser.view.view=='spreadsheet') {
        browser.actions.switchView('spreadsheet')
    }
    else if (browser.view.view=='document') {
        browser.actions.switchView('document')
    }
})
