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

    function isString(s) {
        return typeof s === 'string' || s instanceof String
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
                //TODO: calculate prev/next row while skipping over
                //closed trees. So find the prev/next visible row.
                "ArrowDown": (e) => {
                    e.preventDefault();
                    let focussedElement = document.getElementsByClassName("focus")[0];

                    let getAllNodes = Array.from( document.querySelectorAll(".slo-document .slo-entity"));
                    let itemIndex = getAllNodes.indexOf(focussedElement);

                    getAllNodes[itemIndex].classList.remove("focus");
                    
                    if (itemIndex < (getAllNodes.length -1) ){
                        itemIndex++;
                    }
                    else{
                        itemIndex = getAllNodes.length -1;
                    }

                    getAllNodes[itemIndex].scrollIntoView({ block: "center" });
                    getAllNodes[itemIndex].classList.add("focus");

                    let nextFocussedElement = document.querySelector(".focus");

                    // when the next element doesn't have an id skip it.
                    if(nextFocussedElement.id === ""){
                        getAllNodes[itemIndex].classList.remove("focus");
                        itemIndex++;
                        getAllNodes[itemIndex].scrollIntoView({ block: "center" });
                        getAllNodes[itemIndex].classList.add("focus");
                        nextFocussedElement = document.querySelector(".focus");
                    }
                                        
                    let nextDocumentLocation = new URL(document.location.href);
                                    
                    let idPath = new URL(nextFocussedElement.id);

                    let nextID = idPath.pathname.split("/").pop();

                    idPath.pathname = "/uuid/" + nextID;

                    idPath.href = nextDocumentLocation.origin + "/uuid/" + nextID;

                    window.history.replaceState({}, '', idPath.href);                                
                },
                
                "ArrowUp": (e) => {
                    e.preventDefault()
                    let focussedElement = document.getElementsByClassName("focus")[0];

                    let getAllNodes = Array.from( document.querySelectorAll(".slo-document .slo-entity"));
                    let itemIndex = getAllNodes.indexOf(focussedElement);   

                    getAllNodes[itemIndex].classList.remove("focus");

                    if (itemIndex > 0 ){
                        itemIndex-- ;
                    }
                    else{
                        itemIndex = 0;
                    }
                   
                    getAllNodes[itemIndex].scrollIntoView({ block: "center" });
                    getAllNodes[itemIndex].classList.add("focus");

                    let nextFocussedElement = document.querySelector(".focus");

                    // when the next element doesn't have an id skip it.
                    if(nextFocussedElement.id === ""){
                        getAllNodes[itemIndex].classList.remove("focus");
                        itemIndex--
                        getAllNodes[itemIndex].scrollIntoView({ block: "center" });
                        getAllNodes[itemIndex].classList.add("focus");
                        nextFocussedElement = document.querySelector(".focus");
                    }
                    
                    let nextDocumentLocation = new URL(document.location.href);
                 
                    let idPath = new URL(nextFocussedElement.id);

                    let nextID = idPath.pathname.split("/").pop();

                    idPath.pathname = "/uuid/" + nextID;

                    idPath.href = nextDocumentLocation.origin + "/uuid/" + nextID;

                    window.history.replaceState({}, '', idPath.href);
                },
                "ArrowLeft": (e) => {
                  e.preventDefault()
                    let focussedElement = document.getElementsByClassName("focus")[0];

                    let getAllNodes = Array.from( document.querySelectorAll(".slo-document .slo-entity"));
                    let itemIndex = getAllNodes.indexOf(focussedElement);   

                    getAllNodes[itemIndex].classList.remove("focus");

                    if (itemIndex > 0 ){
                        itemIndex-- ;
                    }
                    else{
                        itemIndex = 0;
                    }

                    getAllNodes[itemIndex].scrollIntoView({ block: "center" });
                    getAllNodes[itemIndex].classList.add("focus");

                    let nextFocussedElement = document.querySelector(".focus");

                    // when the next element doesn't have an id skip it.
                    if(nextFocussedElement.id === ""){
                        getAllNodes[itemIndex].classList.remove("focus");
                        itemIndex--;
                        getAllNodes[itemIndex].scrollIntoView({ block: "center" });
                        getAllNodes[itemIndex].classList.add("focus");
                        nextFocussedElement = document.querySelector(".focus");
                    }
                                        
                    let nextDocumentLocation = new URL(document.location.href);
                                    
                    let idPath = new URL(nextFocussedElement.id);

                    let nextID = idPath.pathname.split("/").pop();

                    idPath.pathname = "/uuid/" + nextID;

                    idPath.href = nextDocumentLocation.origin + "/uuid/" + nextID;

                    window.history.replaceState({}, '', idPath.href);   
                },
                "ArrowRight": (e) => {
                    e.preventDefault()
                    let focussedElement = document.getElementsByClassName("focus")[0];

                    let getAllNodes = Array.from( document.querySelectorAll(".slo-document .slo-entity"));
                    let itemIndex = getAllNodes.indexOf(focussedElement);   

                    getAllNodes[itemIndex].classList.remove("focus");

                    if (itemIndex < (getAllNodes.length -1) ){
                        itemIndex++;
                    }
                    else{
                        itemIndex = (getAllNodes.length -1);
                    }
                   
                    getAllNodes[itemIndex].scrollIntoView({ block: "center" });
                    getAllNodes[itemIndex].classList.add("focus");

                    let nextFocussedElement = document.querySelector(".focus");

                    // when the next element doesn't have an id skip it.
                    if(nextFocussedElement.id === ""){
                        getAllNodes[itemIndex].classList.remove("focus");
                        itemIndex++;
                        getAllNodes[itemIndex].scrollIntoView({ block: "center" });
                        getAllNodes[itemIndex].classList.add("focus");
                        nextFocussedElement = document.querySelector(".focus");
                    }
                    
                    let nextDocumentLocation = new URL(document.location.href);
                 
                    let idPath = new URL(nextFocussedElement.id);

                    let nextID = idPath.pathname.split("/").pop();

                    idPath.pathname = "/uuid/" + nextID;

                    idPath.href = nextDocumentLocation.origin + "/uuid/" + nextID;

                    window.history.replaceState({}, '', idPath.href);
                },
                "Enter": (e) => {
                    e.preventDefault()
                    if (browser.view.user) {
                        let el = document.querySelector('.focus');
                        console.log(el);
                        //let selector = document.querySelector('.slo-type-selector')
                        //let type = selector.querySelector('input:checked')
                        //browser.actions.hideTypeSelector()
                        //return browser.actions.insertRow(el.closest('tr'), type.value)
                    }
                },/*
                "Escape": (e) => {
                    e.preventDefault()
                    let focussedElement = document.getElementsByClassName("focus")[0];
                },*/
                "Home": (e) => {
                    e.preventDefault()
                    let focussedElement = document.getElementsByClassName("focus")[0];

                    let getAllNodes = Array.from( document.querySelectorAll(".slo-document .slo-entity"));
                    let itemIndex = getAllNodes.indexOf(focussedElement);   

                    getAllNodes[itemIndex].classList.remove("focus");
                   
                    itemIndex = 0;
 
                    getAllNodes[itemIndex].scrollIntoView({ block: "center" });
                    getAllNodes[itemIndex].classList.add("focus");

                    let nextFocussedElement = document.querySelector(".focus");
                    
                    let nextDocumentLocation = new URL(document.location.href);
                 
                    let idPath = new URL(nextFocussedElement.id);

                    let nextID = idPath.pathname.split("/").pop();

                    idPath.pathname = "/uuid/" + nextID;

                    idPath.href = nextDocumentLocation.origin + "/uuid/" + nextID;

                    window.history.replaceState({}, '', idPath.href);     
                },
                "End": (e) => {
                    e.preventDefault()
                    let focussedElement = document.getElementsByClassName("focus")[0];

                    let getAllNodes = Array.from( document.querySelectorAll(".slo-document .slo-entity"));
                    let itemIndex = getAllNodes.indexOf(focussedElement);   

                    getAllNodes[itemIndex].classList.remove("focus");
                   
                    itemIndex = getAllNodes.length -1 ;
 
                    getAllNodes[itemIndex].scrollIntoView({ block: "center" });
                    getAllNodes[itemIndex].classList.add("focus");

                    let nextFocussedElement = document.querySelector(".focus");
                    
                    let nextDocumentLocation = new URL(document.location.href);
                 
                    let idPath = new URL(nextFocussedElement.id);

                    let nextID = idPath.pathname.split("/").pop();

                    idPath.pathname = "/uuid/" + nextID;

                    idPath.href = nextDocumentLocation.origin + "/uuid/" + nextID;

                    window.history.replaceState({}, '', idPath.href);    
                },
                "PageUp": (e) => {
                    e.preventDefault()
                    let incrementMovement = 5;
                    let focussedElement = document.getElementsByClassName("focus")[0];

                    let getAllNodes = Array.from( document.querySelectorAll(".slo-document .slo-entity"));
                    let itemIndex = getAllNodes.indexOf(focussedElement);   

                    getAllNodes[itemIndex].classList.remove("focus");

                    //finding top of page and staying there
                    if (itemIndex > incrementMovement ){
                        itemIndex -= incrementMovement;
                    }
                    else {
                        itemIndex = 0;
                    }                  

                    // when the next element doesn't have an id skip it.
                    if ( typeof getAllNodes[itemIndex] !== "undefined" 
                        && getAllNodes[itemIndex].id === ""
                        && itemIndex > incrementMovement)
                        {
                        itemIndex--;
                    }

                    getAllNodes[itemIndex].scrollIntoView({ block: "center" });
                    getAllNodes[itemIndex].classList.add("focus");

                    let nextFocussedElement = document.querySelector(".focus");
                    
                    let nextDocumentLocation = new URL(document.location.href);
                 
                    let idPath = new URL(nextFocussedElement.id);

                    let nextID = idPath.pathname.split("/").pop();

                    idPath.pathname = "/uuid/" + nextID;

                    idPath.href = nextDocumentLocation.origin + "/uuid/" + nextID;

                    window.history.replaceState({}, '', idPath.href);                   
                },
                "PageDown": (e) => {
                    e.preventDefault()
                    let incrementMovement = 5;
                    let focussedElement = document.getElementsByClassName("focus")[0];

                    let getAllNodes = Array.from( document.querySelectorAll(".slo-document .slo-entity"));
                    let itemIndex = getAllNodes.indexOf(focussedElement);   

                    getAllNodes[itemIndex].classList.remove("focus");

                    //finding bottom of page and staying there
                    if (itemIndex < getAllNodes.length - (incrementMovement +1) ){
                        itemIndex += incrementMovement;
                    }
                    else {
                        itemIndex = getAllNodes.length -1 ;
                    }
                    
                    // moving beyond the array sends us to an undefined index, need to move back
                    if (typeof getAllNodes[itemIndex] === "undefined") {
                        itemIndex = getAllNodes.length -1 ;
                    }

                    // when the next element doesn't have an id skip it.
                    if ( typeof getAllNodes[itemIndex] !== "undefined" && getAllNodes[itemIndex].id === "" && itemIndex < getAllNodes.length -6 ) {
                        itemIndex++ ;
                    }
              
                    getAllNodes[itemIndex].scrollIntoView({ block: "center" });
                    getAllNodes[itemIndex].classList.add("focus");

                    let nextFocussedElement = document.querySelector(".focus");
                    
                    let nextDocumentLocation = new URL(document.location.href);
                 
                    let idPath = new URL(nextFocussedElement.id);

                    let nextID = idPath.pathname.split("/").pop();

                    idPath.pathname = "/uuid/" + nextID;

                    idPath.href = nextDocumentLocation.origin + "/uuid/" + nextID;

                    window.history.replaceState({}, '', idPath.href);    
                },/*
                "Insert": async (e) => {
                    e.preventDefault()
                  let focussedElement = document.getElementsByClassName("focus")[0];
                },
                "Delete": (e) => {
                    e.preventDefault()
                 let focussedElement = document.getElementsByClassName("focus")[0];
                }
            */
            },
        },
        commands: {
            //@TODO: spreadsheet commands should be in spreadsheet.js and referenced here
            closeFilter: (el, value) => {
                el.closest('.ds-dropdown').querySelector('.ds-dropdown-state').checked = false
            },
            toggleColumn: (el, value) => {
              let column = browser.view.sloSpreadsheet.options.columns.find(c => c.name==el.name)
              column.checked = el.checked
              browser.view.sloSpreadsheet.render()
            },
            filterValue: (el, value) => {
              let column = browser.view.sloSpreadsheet.options.columns.find(c => c.value==el.name)
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
                alert('nog niet geimplementeerd')
            },
            commitChanges: async function(el, value) {
                alert('nog niet geimplementeerd')
            },
            showChange: async function(el, value) {
                alert('nog niet geimplementeerd')
            },
            insertRow: async function(el, value) {
                //find possible types for sibling and child of node
                //show popup with list of types
                let selectedType = await browser.actions.showTypeSelector(el)
            },
            selectType: async function(el, value) {
                browser.actions.hideTypeSelector()
                el = document.querySelector('td.focus')
                browser.actions.insertRow(el.closest('tr'),value)
            },
            deleteRow: async function(el, value) {
                browser.actions.deleteRow(el.closest('tr'))
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
            switchView: async function(view){
                let currentView = this.app.view.view;

                if (!this.app.view?.item?.uuid) {
                    return
                }

                let currentItem, currentId, roots, currentType, currrentContext;
                
                switch(view) {
                    case 'item':
                        document.body.setAttribute('data-simply-keyboard','item')
                        // get focused item
                        return this.app.actions.item(this.app.view.item.uuid)
                        // switch to that
                    break;
                    case 'spreadsheet':
                        document.body.setAttribute('data-simply-keyboard','spreadsheet')
                        currentItem = this.app.view.item.uuid
                        currentId = this.app.view.item['@id']
                        // get roots of current item
                        roots = await window.slo.api.get('/roots/'+currentItem)
                        // pick one
                        // FIXME: remember which one was picked last
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
                        await this.app.actions.spreadsheet(roots[0].id,this.app.view.contexts,this.app.view.niveaus)
                        // focus current item
                        this.app.view.sloSpreadsheet.gotoId(currentId)
                        this.app.view.sloSpreadsheet.onChange((id) => {
                            let url = new URL(id)
                            let uuid = id.pathname.split('/').pop()
                            this.app.view.item.uuid = uuid
                            history.replaceState({}, '', new URL(uuid, window.location))
                        })
                        this.app.view.sloSpreadsheet.onEdit((update) => {
                            //@FIXME: handle add/delete entities (relations)
                            let index = this.app.view.sloSpreadsheet.data.findIndex(r => r.columns.id===update.id)
                            let columnDef = this.app.view.sloSpreadsheet.options.columns.filter(c => c.value===update.property).pop()
                            let row = this.app.view.sloSpreadsheet.data[index]
                            let node = row.node
                            let prop = node[update.property]
                            let change = {
                                id: update.id,
                                property: update.property,
                                prevValue: prop,
                                timestamp: new Date().toLocaleString('nl-NL')
                            }
                            if (columnDef.type=='list') {
                                change.newValue = update.values.getAll(update.property)
                            } else {
                                change.newValue = update.values.get(update.property)
                                if (update.values.get('dirty')==='unset') {
                                    change.dirty = false
                                }
                            }
                            if (change.newValue === change.prevValue) {
                                return // no change failsave
                            }
                            slo.changeHistory.push(change)
                            browser.view.undoHistory = slo.changeHistory.toReversed().slice(0,5)
                            browser.view.undoSize = slo.changeHistory.length
                            localStorage.setItem('changeHistory',JSON.stringify(slo.changeHistory))
                            node[update.property] = change.newValue
                            row.columns[update.property] = change.newValue
                            this.app.view.sloSpreadsheet.update({
                                data: this.app.view.sloSpreadsheet.data
                            })
                            this.app.view.sloSpreadsheet.renderBody()
                        })
                    break;
                    case 'document':
                        document.body.setAttribute('data-simply-keyboard','document')
                        currentItem = this.app.view.item.uuid
                        currentId = this.app.view.item['@id']
                        // get roots of current item
                        roots = await window.slo.api.get('/roots/'+currentItem)
                                              
                        // pick one
                        // FIXME: remember which one was picked last
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
                        await this.app.actions.renderDocumentPage(roots[0].id,this.app.view.contexts,this.app.view.niveaus)
                        
                        let documentModel = window.slo.getDataModel('items');

                        //focus on item
                        document.getElementById(("https://opendata.slo.nl/curriculum/uuid/" + currentItem)).scrollIntoView({ block: "center" });
                        document.getElementById(("https://opendata.slo.nl/curriculum/uuid/" + currentItem)).classList.add("focus");
                        
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
                    slo.applyHistory(json.data)
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
                return window.slo.api.get(window.release.apiPath+'tree/'+root, {
                    niveau, context
                })
                .then(function(json) {
                    browser.view.root = json
                    slo.applyHistory(json)
                    let defs = slo.treeToRows(json)
                    browser.view.view = 'spreadsheet';
                    //@TODO: als browser.view.user, dan editmode enablen
                    //@TODO: on window resize, recalculate
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
                    browser.view.view = 'document';
                    browser.view.documentList = await window.slo.documentPage(json)
                    browser.view.sloDocument = sloDocument({
                        container: document.getElementById('slo-document')
                        }
                    );
                })
            },
            doelniveauList: function(type) {
                browser.view['listTitle'] = titles[type];
                browser.view.list = [];
                return window.slo.api.get(window.release.apiPath+type)
                .then(function(json) {
                    browser.view.view = 'doelniveauList';
                    slo.applyHistory(json.data)
                    browser.view.list = json.data;
                    browser.view['listTitle'] = titles[type];
                    console.log(titles[type],browser.view['listTitle']);
                    browser.actions.updatePaging(json.count);
                });
            },
            item: function(id) {
                return window.slo.api.get(window.release.apiPath+'uuid/'+id+'/')
                .then(function(json) {
                    slo.applyHistory(json)
                    browser.view.item = json;
                    if (browser.view.preferedView && browser.view.preferedView!='item') {
                        browser.actions.switchView(browser.view.preferedView)
                        return
                    }
                    browser.view.view = 'item';
                    browser.actions.updatePaging();
                });
            },
            listOpNiveau: function(niveau, type) {
                browser.view['listTitle'] = titles[type];
                browser.view.list = [];
                return window.slo.api.get(window.release.apiPath+'niveau/'+niveau+'/'+type)
                .then(function(json) {
                    browser.view.view = 'list';
                    slo.applyHistory(json)
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
                    slo.applyHistory(json)
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
            insertRow: function(row, type, parent=null) {
                //FIXME: implement parent
                if (!browser.view.user) return
                let visibleRows = browser.view.sloSpreadsheet.visibleData
                rowNumber = browser.view.sloSpreadsheet.options.focus.row
                row = browser.view.sloSpreadsheet.getRowByLine(rowNumber)
                let parentNode = row.node
                let node = {
                    'uuid': curriculum.uuid(),
                    '@type': type,
                    'prefix': parentNode.prefix
                }
                node['@id'] = 'https://opendata.slo.nl/curriculum/uuid/'+node.uuid
                if (!parentNode[type]) {
                    parentNode[type] = []
                }
                parentNode[type].unshift(node)
                let data = slo.treeToRows(browser.view.root)
                browser.view.sloSpreadsheet.update({
                    data: data.rows
                })
            },
            deleteRow: function(row) {
                if (!browser.view.user) return
                let visibleRows = browser.view.sloSpreadsheet.visibleData
                rowNumber = browser.view.sloSpreadsheet.options.focus.row
                row = browser.view.sloSpreadsheet.getRowByLine(rowNumber)
                row.deleted = true
                browser.view.sloSpreadsheet.renderBody()
            },
            showTypeSelector: async function(el) {
                let thisType = browser.view.sloSpreadsheet.getRow(el).node['@type']
                let childTypes = slo.getAvailableChildTypes(thisType)
                // @FIXME: add parent types as well

                browser.view.availableTypes = childTypes
                document.body.dataset.simplyKeyboard = 'spreadsheet-types'
                let rect = el.getBoundingClientRect()
                let selector = document.querySelector('.slo-type-selector')
                selector.style.top = rect.top
                selector.style.left = rect.left
                selector.setAttribute('open','open')
                selector.querySelector('input').focus()
            },
            hideTypeSelector: async function() {
                document.body.dataset.simplyKeyboard = 'spreadsheet'
                let selector = document.querySelector('.slo-type-selector')
                selector.removeAttribute('open')
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
        })
    } else {
        browser.view.loggedIn = false
    }

    changeHistory = localStorage.getItem('changeHistory')
    if (changeHistory) {
        slo.changeHistory = JSON.parse(changeHistory)
        browser.view.undoHistory = slo.changeHistory.toReversed().slice(0,5)
        browser.view.undoSize = slo.changeHistory.length
        slo.parseHistory()
    } else {
        slo.changeHistory = []
    }
    delete changeHistory