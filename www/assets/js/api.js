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
        contexts: {
            'curriculum-fo':{
                title: 'Curriculum Funderend onderwijs',
                data: {
                    fo_domein: 'Domein',
                    fo_subdomein: 'Subdomein',
                    fo_doelzin: 'Doelzin',
                    fo_toelichting: 'Toelichting',
                    fo_uitwerking: 'Uitwerking'
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
                    examenprogramma_eindterm: 'ExamenprogrammaEindterm'
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

        changeHistory: [],
        current: {},
        parseHistory: function() {
            slo.changeHistory.forEach(change => {
                if (!slo.current[change.id]) {
                    slo.current[change.id] = {}
                }
                slo.current[change.id][change.property] = change.newValue
            })
        },
        applyHistory: function(data) {
            if (!Array.isArray(data)) {
                data = [data]
            }
            data.forEach(node => {
                walk(node, 0, (n) => {
                    let id = n['@id']
                    if (slo.current[id]) {
                        Object.keys(slo.current[id]).forEach(prop => {
                            n[prop] = slo.current[id][prop]
                        })
                    }
                })
            })
        },
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
                let validColumns = Object.keys(n).filter(c => c[0].match(/[a-z]/))
                let columns = {
                    id: n['@id'],
                    type: n['@type'],
                    niveaus: n.Niveau ? n.Niveau.map(n => n.title) : n.NiveauIndex ? n.NiveauIndex.map(n => n.title) : ''
                }
                validColumns.forEach(column => { columns[column] = n[column]})
                //TODO: add niveaus
                return columns
            }

            walk(data, 0, (n,indent) => {
                if (n.id || n.uuid) {
                    count++
                    let row = {}
                    row.index = count
                    row['data-simply-template'] = 'entity'
                    row.indent = indent;
                    row.columns = getColumns(n)
                    row.node = n
                    let prevIndent = allRows[allRows.length-1]?.indent || 0
                    allRows.push(row)
                    countColumnValues(row.columns)
                    return indent+1
                }
                return indent;
            })
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
                if (columnValues.length<=15) {
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
       async SLOdocumentPage(json){
            let documentData = []
            
            //json as received from the database
            //console.log(JSON.stringify(json, null, 4));

            function formatDocumentData(json){
                let dataObj = { documentSublist : [], documentNiveaus : [], documentExamenprogrammaEindterm: [], documentVakleergebied: [], documentNiveauIndex: [],  documentExamenprogrammaBody:[] };

                 Object.entries(json).forEach(([key, value]) => {

                    if( Array.isArray(value)){

                        switch (key){
                            case 'ExamenprogrammaEindterm':
                                for(let child of value){
                                    dataObj['documentExamenprogrammaEindterm'].push(formatDocumentData(child));
                                };
                            break;
                            case 'ExamenprogrammaKop1':
                                for(let child of value){
                                    dataObj['documentSublist'].unshift(formatDocumentData(child));
                                };
                            break;
                            case 'ExamenprogrammaBody':
                                for(let child of value){
                                    dataObj['documentExamenprogrammaBody'].push(formatDocumentData(child));
                                };
                            break;
                            case 'Vakleergebied':
                                for(let child of value){
                                    dataObj['documentVakleergebied'].push(formatDocumentData(child));
                                };
                            break;
                            case 'NiveauIndex':
                                for(let child of value){
                                    if (typeof child.Niveau != "undefined") {
                                        dataObj['documentNiveauIndex'].push(child.Niveau);
                                    }
                                    else {
                                        console.log("Found a NiveauIndex with something that wasn't a Niveau.");
                                    }
                                }
                            break;
                            case 'Niveau':
                                for(let child of value){
                                    dataObj['documentNiveauIndex'].push(formatDocumentData(child));
                                };
                            break;
                            // @TODO : check if tag data is complete
                            case 'Tag':
                                for(let child of value){
                                    if (child.title == null){
                                        //console.log("Found a Tag without a title");
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
                            }
                    }
                    else {
                        if ( (typeof(value) === "object" && value !== null)){
                                Object.assign(dataObj["documentSublist"], formatDocumentData(value) );
                        }
                        else {
                            dataObj[key] = value ;
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

            documentData = formatDocumentData(json);

            //documentData is the json that will be sent to the client
            //console.log(JSON.stringify(documentData, null, 4));

            documentData = JSON.parse(JSON.stringify(documentData));

            return [documentData];

        },
        getDataModel(name) {
            return dataModels[name]
        },
        getContextByType(type) {
            return Object.keys(contexts)
            .filter(c => {
                let types = Object.values(contexts[c].data)
                return types.includes(type)
            })
            .pop()
        },
        getTypeNameByType(type) {
            let context = slo.getContextByType(type)
            return Object.entries(contexts[context].data)
            .find(([k,v]) => v==type)[0]
        },
        getTypeByTypeName(_type, context) {            
            return contexts[context].data[_type]
        },
        getAvailableChildTypes(type) {
            let context = slo.getContextByType(type)
            let _type = slo.getTypeNameByType(type)
            let schema = browser.view.schemas
                .find(s => s['$id'] == 'https://opendata.slo.nl/curriculum/schemas/'+context+'/context.json')
            let props = schema.properties[_type].items.properties
            let subtypes = Object.keys(props)
                .filter(k => k.substr(k.length-3)=='_id')
                .map(k => {
                    let type = k.substr(0, k.length-3)
                    let name = slo.getTypeByTypeName(type, context)
                    return {
                        name,
                        type: name
                    }
                })
            return subtypes
        },
        async parseSchema(schema) {
            // from https://github.com/mokkabonna/json-schema-merge-allof

            const customizer = (objValue, srcValue) => {
                if (Array.isArray(objValue)) {
                    return _.union(objValue, srcValue)
                }
                return
            }

            const resolveAllOf = (inputSpec) => {
                if (inputSpec && typeof inputSpec === 'object') {
                    if (Object.keys(inputSpec).length > 0) {
                        if (inputSpec.allOf) {
                            const allOf  = inputSpec.allOf
                            delete inputSpec.allOf
                            const nested = _.mergeWith.apply(_, [{}].concat(allOf, [customizer]))
                            inputSpec    = _.defaultsDeep(inputSpec, nested, customizer)
                        }
                        Object.keys(inputSpec).forEach((key) => {
                            inputSpec[key] = resolveAllOf(inputSpec[key])
                        })
                    }
                }
                return inputSpec
            }

            return resolveAllOf(await $RefParser.dereference(schema))
        }
    }
})()