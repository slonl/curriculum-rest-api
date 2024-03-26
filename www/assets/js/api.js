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
                    examenprogramma_eindterm: 'ExamenprogrammaEindterm',
                    examenprogramma_kop1: 'ExamenprogrammaKop1',
                    examenprogramma_kop2: 'ExamenprogrammaKop2',
                    examenprogramma_kop3: 'ExamenprogrammaKop3',
                    examenprogramma_kop4: 'ExamenprogrammaKop4',
                    examenprogramma_boyd: 'ExamenprogrammaBody'
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
//        inserted: [],
        mergeHistory: function(changes) {
            let merged = {}
            for (let change of changes) {
                switch (change.type) {
                    case 'delete':
                    case 'undelete':
                    case 'patch':
                    case 'insert':
                        if (!merged[change.id]) {
                            merged[change.id] = {
                                type: 'patch',
                                context: change.context,
                                '@type': change['@type'],
                                title: change.title
                            }
                        }
                        if (!merged[change.id][change.property]) {
                            merged[change.id][change.property] = {
                                prevValue: change.prevValue
                            }
                        }
                        merged[change.id][change.property].newValue = change.newValue
                        if (change.type == 'insert') {
                            merged[change.child.id] = {
                                type: 'insert',
                                context: slo.getContextByType(change['@type']),
                                '@type': change['@type']
                            }
                            for (let prop in change.child) {
                                merged[change.child.id][prop] = {
                                    prevValue: null,
                                    newValue: change.child[prop]
                                }
                            }
                        }
                    break
                    default:
                        throw new Error('Unknown change type:'+change.type, { details: change })
                    break
                }
            }
            // remove any property changes that have been undone (reverted to original, e.g. undelete)
            for (let id in merged) {
                for (let prop in merged[id]) {
                    if (!merged[id][prop].newValue) {
                        continue //type etc.
                    }
                    if (merged[id][prop].newValue===merged[id][prop].prevValue) {
                        delete merged[id][prop]
                    }
                }
            }
            return merged
        },
        mergeChanges: function() {
            // prepare change history for overview
            let merged = slo.mergeHistory(slo.changeHistory)
            let contexts = {}
            for (let id in merged) {
                let context = merged[id].context
                if (!contexts[context]) {
                    contexts[context] = {}
                }
                let type = merged[id]['@type']
                if (!contexts[context][type]) {
                    contexts[context][type] = []
                }
                contexts[context][type].push({
                    title: merged[id].title,
                    patch: merged[id]
                })
            }
            let result = []
            for (let context in contexts) {
                let types = []
                for (let type in contexts[context]) {
                    types.push({
                        type,
                        entities: contexts[context][type],
                        count: contexts[context][type].length
                    })
                }
                result.push({
                    context,
                    types,
                    count: types.reduce((a,t) => a+t.count, 0)
                })
            }
            return result
        },
        parseHistory: function() {
            //FIXME: delete must show row crossed through, not removed entirely
            //check changes for current entity? if array && newValue != remote -> show added/removed entries?
            let merged = slo.mergeHistory(slo.changeHistory)
            for (let id in merged) {
                if (!slo.current[id]) {
                    slo.current[id] = {}
                }
                for (let prop in merged[id]) {
                    slo.current[id][prop] = merged[id][prop].newValue
                }
//                if (merged[id].type=='insert') {
//                    slo.inserted[id] = slo.current[id]
//                }
            }
        },
        applyHistory: function(data) {
            if (!Array.isArray(data)) {
                data = [data]
            }
            data.forEach(node => {
                walk(node, 0, (n) => {
                    let id = '/uuid/'+n['uuid']
                    if (slo.current[id]) {
                        Object.keys(slo.current[id]).forEach(prop => {
                            if (!n._previous) {
                                n._previous = Object.assign({}, n)
                            }
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

            let marks = []
            function addRow(n, indent, mark=null) {
                if (n.id || n.uuid) {
                    count++
                    let row = {}
                    row.index = count
                    row['data-simply-template'] = 'entity'
                    row.indent = indent;
                    row.columns = getColumns(n)
                    row.node = n

                    // marks contain add/removed information for parent nodes of current row
                    // marks works as a stack
                    marks = marks.slice(0, indent) // remove marks from other parents
                    marks[indent] = [] // clear marks for this row as parent
                    if (n._previous) {
                        // deleted entries are not in n[prop], so add row manually
                        // added entries are in n[prop], so will come around later... keep track of parent-child ids and match these somehow
                        for (let prop in n._previous) {
                            if (Array.isArray(n._previous[prop])) {
                                let diff = getDiff(n._previous[prop],n[prop])
                                if (diff) {
                                    if (diff.toBeAdded) {
                                        marks[indent].push({
                                            type: 'insert',
                                            [prop]: diff.toBeAdded
                                        })
                                    }
                                    if (diff.toBeRemoved) {
                                        marks[indent].push({
                                            type: 'delete',
                                            [prop]: diff.toBeRemoved
                                        })
                                        if (!diff.toBeAdded) {
                                            n[prop] = n._previous[prop]
                                        } else {
                                            // FIXME: need to order the toBeAdded/toBeRemoved correctly
                                            n[prop] = n._previous[prop].concat(diff.toBeAdded)
                                        }
                                    }

                                }
                            } else if (n._previous[prop]!=n[prop]) {
                                row.changed=true
                            }
                        }
                    }
                    if (marks[indent-1]) { // marks info for the parent of this row
                        for (let m of marks[indent-1]) {
                            for (let prop in m) {
                                if (prop=='type') {
                                    continue
                                }
                                if (m[prop].find(e => e.uuid == row.node.uuid)) {
                                    if (m.type=='insert') {
                                        row.inserted = true
                                    } else if (m.type=='delete') {
                                        row.deleted = true
                                    }
                                }
                            }
                        }
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
       async documentPage(json){
            let documentData = []
            
            //json as received from the database
            //console.log(JSON.stringify(json, null, 4));

            function formatDocumentData(json){
                // @TODO : this leads to print issues as some arrays in the object, although empty still call an empty template, leading to an html element that meses up print.
                let dataObj = { documentSublist : [], documentLeafNode: [],  documentTextNode: [],  documentNiveaus : [], documentNiveauIndex: [], documentExamenprogrammaEindterm:[] };

                 Object.entries(json).forEach(([key, value]) => {

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
                                    dataObj['documentExamenprogrammaEindterm'].push(ExamenprogrammaEindterm);
                                };
                            break;


                            case 'Doelniveau':
                                for(let doelNiveau of value){
                                    if(doelNiveau.Doel && doelNiveau.Doel[0].title !== ""){
                                        hoistedChild = Object.assign(doelNiveau, {title : doelNiveau.Doel[0].title })
                                        dataObj['documentLeafNode'].push(hoistedChild);//child.Doel[0].title);
                                    }
                                    else{
                                        dataObj['documentLeafNode'].push(doelNiveau);
                                    }
                                
                                };
                            break;


                            case 'ExamenprogrammaBody':
                                for(let child of value){
                                    dataObj['documentTextNode'].push(child);
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
                                        dataObj['documentNiveauIndex'].push(child.Niveau); //'documentNiveauIndex'
                                    }
                                    else {
                                        console.log("Found a NiveauIndex with something that wasn't a Niveau.");
                                    }
                                }
                            break;

                            case 'Niveau':
                                for(let niveau of value){
                                    //console.log(niveau.description);
                                    dataObj['documentNiveauIndex'].push(formatDocumentData(niveau)); //'documentNiveauIndex'
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
                            //switch indentation
                        } //switch end
                    }
                    else {
                        if ( (typeof(value) === "object" && value !== null)){
                            dataObj['documentSublist'].push(formatDocumentData(value));
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
            for (context of Object.keys(contexts)) {
                if (contexts[context].data[_type]) {
                    return contexts[context].data[_type]
                }
            }
            return _type
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