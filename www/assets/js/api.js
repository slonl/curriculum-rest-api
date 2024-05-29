(function() {
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
            .filter(([k,v]) => {
                if (!Array.isArray(v) || !v.length || k== 'Niveau') {
                    return false
                }
                return true
            })
            .forEach(([k,v]) => { 
                walk(v,indent,f); 
                node.hasChildren=true; 
            })
        }
    }

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
            get: function(path, params, jsontag=false) {
                var url = new URL(window.apiURL + path);
                if (!params && window.location.search) {
                    url.search = window.location.search;
                }
                if (params) {
                    let args = Object.keys(params).map(function(param) {
                        if (Array.isArray(params[param])) {
                            return params[param].map(value => encodeURIComponent(param)+'='+encodeURIComponent(value)).join('&')
                        } else {
                            return encodeURIComponent(param)+'='+encodeURIComponent(params[param]);
                        }
                    }).filter(Boolean).join('&');
                    url.search = '?' + args;
                }
                let args = {
                    headers: {
                        'Authorization': 'Basic '+slo.api.token
                    }
                }
                if (jsontag) {
                    args.headers.Accept = 'application/jsontag'
                } else {
                    args.headers.Accept = 'application/json'
                }
                return fetch(url, args)
                .then(async function(response) {
                    if (jsontag) {
                        if (response.ok) {
                            let jsontag = await response.text()
                            return JSONTag.parse(jsontag)
                        }
                        throw new Error(response.status+': '+response.statusText)
                    } else {
                        var json = response.json();
                        if (response.ok) {
                            return json;
                        }
                        return json.then(Promise.reject.bind(Promise));
                    }
                })
                .then(function(json) {
                    //FIXME: api must not know about browser.view
                    if (json.error) {
                        browser.view.error = json.error;
                    } else {
                        browser.view.error = '';
                        function fixId(node, indent, parent) {
                            if (node.uuid) {
                                node.id = node.uuid
                            }
                        }
                        walk(json, 0, fixId)
                    }
                    return json;
                })
                .catch(error => {
                    //FIXME: api must not know about browser.view
                    browser.view.error = error.error;
                    browser.view.errorMessage = error.message;
                });
            },
            runCommand: function(command) {
                return fetch(window.apiURL+'/command/', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/jsontag',
                        'Authorization': 'Basic '+slo.api.token
                    },
                    body: JSONTag.stringify(command),
                    method: 'POST'
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
            },
            pollCommand: function(commandId) {
                let counter=0, maxWait=10000
                return new Promise((resolve, reject) => {
                    let interval = setInterval(() => {
                        fetch(window.apiURL+'/command/'+commandId, {
                            headers: {
                                'Accept':'application/jsontag',
                                'Authorization':'Basic '+slo.api.token
                            }
                        })
                        .then(function(response) {
                            if (response.ok) {
                                return response.json()
                            }
                            throw new Error(response.status+': '+response.statusText)
                        })
                        .then(function(json) {
                            if (json.status!='accepted') {
                                resolve(json)
                                clearInterval(interval)
                                return
                            }
                            counter++
                            if (counter>maxWait) {
                                reject({
                                    code: 408,
                                    message: 'Command takes too long'
                                })
                            }
                        })
                    }, 1000)
                })
            }
        },
/*
        contexts: {
            'curriculum-fo':{
                title: 'Curriculum Funderend onderwijs',
                data: {
                    fo_domein: 'FoDomein',
                    fo_subdomein: 'FoSubdomein',
                    fo_doelzin: 'FoDoelzin',
                    fo_toelichting: 'FoToelichting',
                    fo_uitwerking: 'FoUitwerking'
                }
            },
            'curriculum-samenhang': {
                title: 'Samenhang',
                data: {
                    tag: 'Begrippen',
                    relatie: 'Relaties'
                }
            },
            'curriculum-basis': {
                title: 'Basis',
                data: {
                    vakleergebied: 'Vakleergebied',
                    niveau: 'Niveau',
                    doelniveau: 'DoelNiveau',
                    doel: 'Doel'
                }
            },
            'curriculum-kerndoelen': {
                title: 'Kerndoelen',
                data: {
                    kerndoel_vakleergebied: 'KerndoelVakleergebied',
                    kerndoel_domein: 'KerndoelDomein',
                    kerndoel: 'Kerndoel',
                    kerndoel_uitstroomprofiel: 'KerndoelUitstroomprofiel'
                }
            },
            'curriculum-examenprogramma': {
                title: 'Examenprogramma',
                data: {
                    examenprogramma: 'Examenprogramma',
                    examenprogramma_vakleergebied: 'ExamenprogrammaVakleergebied',
                    examenprogramma_domein: 'ExamenprogrammaDomein',
                    examenprogramma_subdomein: 'ExamenprogrammaSubdomein',
                    examenprogramma_eindterm: 'ExamenprogrammaEindterm',
                    examenprogramma_kop1: 'ExamenprogrammaKop1',
                    examenprogramma_kop2: 'ExamenprogrammaKop2',
                    examenprogramma_kop3: 'ExamenprogrammaKop3',
                    examenprogramma_kop4: 'ExamenprogrammaKop4',
                    examenprogramma_body: 'ExamenprogrammaBody'
                }
            },
            'curriculum-syllabus': {
                title: 'Syllabus',
                data: {
                    syllabus: 'Syllabus',
                    syllabus_vakleergebied: 'SyllabusVakleergebied',
                    syllabus_specifieke_eindterm: 'SyllabusSpecifiekeEindterm',
                    syllabus_toelichting: 'SyllabusToelichting',
                    syllabus_vakbegrip: 'SyllabusVakbegrip'
                }
            },
            'curriculum-examenprogramma-bg': {
                title: 'Examenprogramma Beroepsgericht',
                data: {
                    examenprogramma_bg_profiel: 'ExamenprogrammaBgProfiel',
                    examenprogramma_bg_kern: 'ExamenprogrammaBgKern',
                    examenprogramma_bg_kerndeel: 'ExamenprogrammaBgKerndeel',
                    examenprogramma_bg_globale_eindterm: 'ExamenprogrammaBgGlobaleEindterm',
                    examenprogramma_bg_module: 'ExamenprogrammaBgModule',
                    examenprogramma_bg_keuzevak: 'ExamenprogrammaBgKeuzevak',
                    examenprogramma_bg_deeltaak: 'ExamenprogrammaBgDeeltaak',
                    examenprogramma_bg_moduletaak: 'ExamenprogrammaBgModuletaak',
                    examenprogramma_bg_keuzevaktaak: 'ExamenprogrammaBgKeuzevaktaak'
                }
            },
            'curriculum-referentiekader': {
                title: 'Referentiekader',
                data: {
                    ref_vakleergebied: 'RefVakleergebied',
                    ref_domein: 'RefDomein',
                    ref_subdomein: 'RefSubdomein',
                    ref_onderwerp: 'RefOnderwerp',
                    ref_deelonderwerp: 'RefDeelonderwerp',
                    ref_tekstkenmerk: 'RefTekstkenmerk'
                }
            },
            'curriculum-erk': {
                title: 'Europees referentiekader',
                data: {
                    erk_vakleergebied: 'ErkVakleergebied',
                    erk_gebied: 'ErkGebied',
                    erk_categorie: 'ErkCategorie',
                    erk_taalactiviteit: 'ErkTaalactiviteit',
                    erk_schaal: 'ErkSchaal',
                    erk_candobeschrijving: 'ErkCandobeschrijving',
                    erk_voorbeeld: 'ErkVoorbeeld',
                    erk_lesidee: 'ErkLesidee'
                }
            },
            'curriculum-leerdoelenkaarten': {
                title: 'Leerdoelenkaarten',
                data: {
                    ldk_vakleergebied: 'LdkVakleergebied',
                    ldk_vakkern: 'LdkVakkern',
                    ldk_vaksubkern: 'LdkVaksubkern',
                    ldk_vakinhoud: 'LdkVakinhoud',
                    ldk_vakbegrip: 'LdkVakbegrip'
                }
            },
            'curriculum-inhoudslijnen': {
                title: 'Inhoudslijnen',
                data: {
                    inh_vakleergebied: 'InhVakleergebied',
                    inh_inhoudslijn: 'InhInhoudslijn',
                    inh_cluster: 'InhCluster',
                    inh_subcluster: 'InhSubcluster'
                }
    //        },
    //        'curriculum-niveauhierarchie':{
    //            title: 'Niveau Hierarchie',
    //            data: {
    //                nh_categorie: 'NhCategorie',
    //                nh_sector: 'NhSector',
    //                nh_schoolsoort: 'NhSchoolsoort',
    //                nh_leerweg: 'NhLeerweg',
    //                nh_bouw: 'NhBouw',
    //                nh_niveau: 'NhNiveau'
    //            }
            }
        },
*/
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


            const countColumnValues = (columns) => {
                Object.keys(columns).forEach(name => {
                    if (!name) {
                        return
                    }
                    if (!allColumns[name]) {
                        allColumns[name] = {}
                    }
                    if (Array.isArray(columns[name])) {
                        columns[name].forEach(v => {
                            if (!v) {
                                return
                            }
                            if (!allColumns[name][v]) {
                                allColumns[name][v] = 0;
                            }
                            allColumns[name][v]++
                        })
                    } else {
                        if (!columns[name]) {
                            return
                        }
                        if (!allColumns[name][columns[name]]) {
                            allColumns[name][columns[name]] = 0
                        }
                        allColumns[name][columns[name]]++
                    }
                })
            }

            function getColumns(n) {
                let validColumns = Object.keys(n)
                    .filter(c => c[0].match(/[a-z]/))
                    .filter(c => ['uuid','dirty','unreleased','hasChildren'].indexOf(c)===-1)
                let columns = {
                    id: n['@id'],
                    type: n['@type'],
                    niveaus: n.Niveau ? n.Niveau.map(n => n.title) : n.NiveauIndex ? n.NiveauIndex.map(n => n.title) : ''
                }
                validColumns.forEach(column => { if (column!='id') { columns[column] = n[column]}})
                return columns
            }

            function getDiff(a,b) {
                let result = {}
                let toBeRemoved = a.filter(x => !b.find(e => e.uuid == x.uuid))
                let toBeAdded = b.filter(x => !a.find(e => e.uuid == x.uuid))
                if (toBeRemoved.length) {
                    result.toBeRemoved = toBeRemoved
                }
                if (toBeAdded.length) {
                    result.toBeAdded = toBeAdded
                }
                if (!result.toBeRemoved && !result.toBeAdded) {
                    result = null
                }
                return result
            }

            function addRow(n, indent, mark=null) {
                if (n.id || n.uuid) {
                    count++
                    let row = {}
                    row.index = count
                    row['data-simply-template'] = 'entity'
                    row.indent = indent;
                    row.columns = getColumns(n)
                    row.node = n
                    if (n instanceof changes.DeletedLink) {
                        row.deleted = true
                    } else if (n instanceof changes.InsertedLink) {
                        row.inserted = true
                    } else if (n instanceof changes.ChangedNode) {
                        row.changed = true
                    }
                    let prevIndent = allRows[allRows.length-1]?.indent || 0
                    allRows.push(row)
                    countColumnValues(row.columns)
                    return indent+1
                }
                return indent;                
            }
            walk(data, 0, addRow)

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
                    viewer: function(rect, offset, el) {
                        let row = browser.view.sloSpreadsheet.getRow(el)
                        if (!row.node.Niveau?.length) {
                            this.querySelector('ul').style.color='#888'
                            return false
                        }
                    },
                    editor: function(rect, offset, el) {
                        let row = browser.view.sloSpreadsheet.getRow(el)
                        let column = browser.view.sloSpreadsheet.getColumnDefinition(el)
                        let disabled = !row.node.Niveau?.length ? ' disabled' : ''
                        let value = row.columns[column.value] || []
                        let allNiveaus = column.values
                        let html = '<form><ul>'
                        allNiveaus.forEach(n => {
                            if (!n.name) {
                                return
                            }
                            let checked = value.includes(n.name) ? ' checked': ''
                            html+=`<li><input type="checkbox"${checked} ${disabled} name="niveaus" value="${n.name}">${n.name}</li>`
                        } )
                        html+='</ul></form>'
                        this.innerHTML = html
                        this.querySelector('input[type="checkbox"]')?.focus()
                        if (!row.node.Niveau?.length) {
                            this.querySelector('ul').style.color='#888'
                        }
                        if (disabled) {
                            return false
                        }
                    },
                    isEditable: (el) => {
                        let row = browser.view.sloSpreadsheet.getRow(el)
                        if (!row.node.Niveau?.length) {
                            return false
                        }
                        return true
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
                if (columnValues.length<=15 && columnDefinition.name!='Description') { //@FIXME: allow switch to textarea from list type that is set like this?
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
       async documentPage(node){
            
            let documentData = {
                index :  new Map()
            }

            function formatDocumentData(node){
                // @TODO : this leads to print issues as some arrays in the object, although empty still call an empty template, leading to an html element that meses up print.
                let dataObj = { documentSublist : [], documentLeafNode: [],  documentTextNode: [],  documentNiveaus : [], documentNiveauIndex: [], documentExamenprogrammaEindterm:[] };
                
                dataObj["node"] = node;

                documentData.index.set(node.id, dataObj);

                 Object.entries(node).forEach(([key, value]) => {

                    if( Array.isArray(value)){

                        switch (key){
     
                            case 'Doel':
                            case 'ErkLesidee':
                            case 'ErkVoorbeeld':
                            case 'FoToelichting':
                            case 'FoUitwerking':
                            case 'InhSubcluster':
                            case 'KerndoelDomein':
                            case 'KerndoelUitstroomprofiel':
                            case 'LdkVakinhoud':
                            case 'LdkVakbegrip':
                            case 'Leerlingtekst':
                            case 'LpibVakinhoud':
                            case 'RefDeelonderwerp':
                            case 'RefTekstkenmerk':
                            case 'Vakleergebied':
                                for(let child of value){
                                    dataObj['documentSublist'].push(formatDocumentData(child));
                                };
                            break;

                            // @TODO : this one might be broken: value is an empty array.
                            case 'Examenprogramma':
                                //console.log("Examenprogramma")
                                //console.log(value)
                                for(let child of value){
                                    //console.log("Examenprogramma child:  ")
                                    //console.log(child)
                                    dataObj['documentSublist'].push(formatDocumentData(child));
                                };
                            break;
                            
                            //case 'ExamenprogrammaDomein':
                            case 'ExamenprogrammaEindterm':
                                for(let ExamenprogrammaEindterm of value){
                                    // @TODO : some elements are only uses as strings, like Niveau, when the loop is not recursed these nodes are not mappen BY DESIGN

                                    // @TODO : when not recursed the nodes need to be parsed as strings and hoisted to the parent element.

                                    dataObj['documentExamenprogrammaEindterm'].push(ExamenprogrammaEindterm);
                                    //console.log(ExamenprogrammaEindterm.id , ExamenprogrammaEindterm);
                                    documentData.index.set(ExamenprogrammaEindterm.id , ExamenprogrammaEindterm);

                                };
                            break;

                            case 'Doelniveau':
                                for(let doelNiveau of value){
                                    if(doelNiveau.Doel && doelNiveau.Doel[0].title !== ""){
                                        hoistedChild = Object.assign(doelNiveau, {title : doelNiveau.Doel[0].title })
                                        dataObj['documentLeafNode'].push(hoistedChild);

                                    }
                                    else{
                                        dataObj['documentLeafNode'].push(doelNiveau);
                                    }
                                
                                };
                            break;

                            case 'ExamenprogrammaBody':
                                for(let child of value){
                                    dataObj['documentTextNode'].push(child);
                                    documentData.index.set(child.id , child);

                                };
                            break;
                            
                            case 'ExamenprogrammaKop1':
                                for(let child of value){
                                    dataObj['documentSublist'].unshift(formatDocumentData(child));
                                };
                            break;
                                
                            case 'NiveauIndex':
                                for(let child of value){
                                    if (typeof child.Niveau != "undefined") {
                                        dataObj['documentNiveauIndex'].push(child.Niveau);
                                        documentData.index.set(child.Niveau.id , child.Niveau);
                                    }
                                    else {
                                        console.log("Found a NiveauIndex with something that wasn't a Niveau.");
                                    }
                                }
                            break;

                            case 'Niveau':
                                for(let niveau of value){
                                    dataObj['documentNiveauIndex'].push(formatDocumentData(niveau)); //'documentNiveauIndex'
                                };
                            break;

                            // @TODO : check if tag data is complete
                            case 'Tag':
                                for(let child of value){
                                    if (child.title == null){
                                    }
                                    else { 
                                        dataObj['documentSublist'].push(formatDocumentData(child));
                                    };
                                };
                            break;

                            default:
                                if (value.length !==0){
                                    for(let child of value){
                                            dataObj['documentSublist'].push(formatDocumentData(child));
                                    };
                                }
                            //switch indentation
                        } //switch end
                    }
                    else {
                        if ( (typeof(value) === "object" && value !== null)){
                            dataObj['documentSublist'].push(formatDocumentData(value));
                        }
                        else {
                            // if no capital Eindexamen instead of title and things.
                            if(key[0] >= "A" && key[0] <= "Z")
                            { 
                                debugger;
                            }
                            dataObj[key] = value ;
                            // @NOTE : need to figure the following out if it's needed/works
                            //documentData.index.set(dataOj[key].id , value);
                        }
                    }
                });

                // remove object that have empty arrays as values:
                Object.entries(dataObj).forEach(([key, value]) => {
   
                    if (Array.isArray(value) && value.length == 0){
                        delete dataObj[key];
                        return dataObj
                    }

                });
            
                return dataObj;
            }

            documentData.root = formatDocumentData(node);

            //documentData = JSON.parse(JSON.stringify(documentData));

            return documentData;

        },
        getDataModel(name) {
            return dataModels[name]
        },
        getContextByType(type) {
            return Object.keys(slo.contexts)
            .filter(c => {
                let types = Object.values(slo.contexts[c].data)
                return types.includes(type)
            })
            .pop()
        },
        getTypeNameByType(type) {
            let context = slo.getContextByType(type)
            return Object.entries(slo.contexts[context].data)
            .find(([k,v]) => v==type)[0]
        },
        getTypeByTypeName(_type, context) {
            for (context of Object.keys(slo.contexts)) {
                if (slo.contexts[context].data[_type]) {
                    return slo.contexts[context].data[_type]
                }
            }
            return _type
        },
        getAvailableChildTypes(type) {
            let context = slo.getContextByType(type)
            let _type = slo.getTypeNameByType(type)
            let schema = slo.contexts[context].schema
            let children = schema[type].children
            let childTypeNames = Object.keys(children).filter(k => k[0]>='A' && k[0]<='Z')
            let subtypes = childTypeNames.map(name => {
                return {
                    name,
                    type: slo.getTypeByTypeName(name)
                }
            })
            return subtypes
        }
    }
})()