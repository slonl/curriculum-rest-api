(function() {

    if (!globalThis.jsontagMeta) {
        globalThis.jsontagMeta = {}
    }

    const walk = (node, indent, f) => {
        if (!node) return;
        if (getType(node)==='Niveau') {
            return
        }
        if (Array.isArray(node)) {
            node.forEach(n => walk(n,indent,f))
        } else if (typeof node === 'object' ) {
            indent = f(node, indent)
            Object.entries(node)
            .filter(([k,v]) => {
                if (!Array.isArray(v) || !v.length || k== 'Niveau' || k[0]=='$' || k[0]=='@') {
                    return false
                }
                return true
            })
            .forEach(([k,v]) => { 
                walk(v,indent,f); 
                node.$hasChildren=true;
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
                if (path[0]!='/') {
                    path = '/'+path
                }
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
                            return JSONTag.parse(jsontag, null, globalThis.jsontagMeta)
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
                        throw new Error(json.error)
                    } else {
                        function fixId(node, indent, parent) {
                            if (node.uuid) {
                                node.id = node.uuid
                            }
                        }
                        walk(json, 0, fixId)
                    }
                    return json;
                })
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
                        throw new Error(json.error)
                    }
                    return json;
                })
            },
            pollCommand: function(commandId) {
                let counter=0, maxWait=30000
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
                    }, 2000)
                })
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
            }
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
                let validColumns = Object.keys(n)
                    .filter(c => c[0].match(/[a-z]/))
                    .filter(c => ['sloID', 'uuid','dirty','unreleased','$hasChildren'].indexOf(c)===-1)
                let columns = {
                    id: getId(n),
                    type: getType(n),
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
                        let columnDef = browser.view.sloSpreadsheet.getColumnDefinition(el)
                        let row = browser.view.sloSpreadsheet.getRow(el)
                        let value = row.columns[columnDef.value] || ''
                        let span = el.querySelector('span.slo-indent')
                        let spanRect = span.getBoundingClientRect()
                        this.style.left = (spanRect.left - offset.left)+'px'
                        this.style.width = rect.width - (spanRect.left - rect.left)+'px'
                        let header = `
<button class="ds-button ds-button-naked ds-button-close slo-edit" data-simply-command="cellEditor">
  <svg class="ds-icon ds-icon-feather">
    <use xlink:href="/assets/icons/feather-sprite.svg#edit">
  </use></svg>
</button>
`
                        this.innerHTML = header + value
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
                        if (!meta.schemas.types[row.node['@type']]?.children?.Niveau) {
                            this.querySelector('ul').style.color='#888'
                            return false
                        }
                    },
                    editor: function(rect, offset, el) {
                        let row = browser.view.sloSpreadsheet.getRow(el)
                        let column = browser.view.sloSpreadsheet.getColumnDefinition(el)
                        let disabled = !meta.schemas.types[row.node['@type']]?.children?.Niveau ? ' disabled' : ''
                        let value = row.columns[column.value] || []
                        let allNiveaus = column.values
                        let html = `
<button class="ds-button ds-button-naked ds-button-close" data-simply-command="closeEditor">
    <svg class="ds-icon ds-icon-feather">
        <use xlink:href="/assets/icons/feather-sprite.svg#x">
        </use>
    </svg>
</button>
<form><ul class="slo-list-selector">`
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
                        if (disabled) {
                            this.querySelector('ul').style.color='#888'
                            return false
                        }
                    },
                    isEditable: (el) => {
                        let row = browser.view.sloSpreadsheet.getRow(el)
                        let disabled = !meta.schemas.types[row.node['@type']]?.children?.Niveau ? ' disabled' : ''
                        return !disabled
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
                    let propSchema = meta.schemas.properties[c]
                    if (propSchema?.type) {
                        if (propSchema.type=='string') {
                            columnDefinition.type = 'autocomplete'
                        } else if (propSchema.type=='integer') {
                            if (propSchema.minimum==0 && propSchema.maximum==1) {
                                columnDefinition.type = 'checkbox'
                            }
                        }
                    }
                }
                columnDefinition.values = Object.keys(allColumns[c]).map(name => {
                    return {
                        name,
                        count: allColumns[c][name]
                    }
                })
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

                    if(Array.isArray(value)){

                        switch (key){

                            case 'ExamenprogrammaEindterm':
                                for(let ExamenprogrammaEindterm of value){
                                    // @TODO : some elements are only used as strings, like Niveau, when the loop is not recursed these nodes are not mapped BY DESIGN
                                    if(!ExamenprogrammaEindterm['@id']){
                                        ExamenprogrammaEindterm['@id'] = getId(ExamenprogrammaEindterm)
                                    }
                                    if(!ExamenprogrammaEindterm['@type']){
                                        ExamenprogrammaEindterm['@type'] = getType(ExamenprogrammaEindterm)
                                    }
                                    
                                    // @TODO : when not recursed the nodes need to be parsed as strings and hoisted to the parent element.
                                    //if(value.title !== ""){
                                    dataObj['documentExamenprogrammaEindterm'].push(ExamenprogrammaEindterm)
                                    documentData.index.set(ExamenprogrammaEindterm.id , ExamenprogrammaEindterm)
                                    //}

                                };
                            break;

                            case 'Doelniveau':
                                for(let doelNiveau of value){                     
                                    if(doelNiveau.Doel && doelNiveau.Doel[0].title !== ""){
                                        let hoistedID = window.release.apiPath + "uuid/" + doelNiveau.Doel[0].id // @TODO check if document.baseURI needs to be used instead
                                        hoistedChild = Object.assign(doelNiveau, {title : doelNiveau.Doel[0].title}, { '@id' : hoistedID})
                                        dataObj['documentLeafNode'].push(hoistedChild);
                                        documentData.index.set(doelNiveau.Doel[0].id, doelNiveau.Doel[0]);

                                    }
                                    else{
                                        dataObj['documentLeafNode'].push(doelNiveau);
                                        documentData.index.set(doelNiveau.id, doelNiveau)
                                    }         
                                };
                            break;

                            case 'ExamenprogrammaBody':
                                for(let child of value){
                                    if(!child['@id']){
                                        child['@id'] = getId(child)
                                    }
                                    if(!child['@type']){
                                        child['@type'] = getType(child)
                                    }
                                    dataObj['documentTextNode'].push(child);
                                    documentData.index.set(child.id , child);
                                };
                            break;
                            
                            case 'ExamenprogrammaKop1':
                                for(let child of value){
                                    if(!child['@id']){
                                        child['@id'] = getId(child)
                                    }
                                    if(!child['@type']){
                                        child['@type'] = getType(child)
                                    }
                                    dataObj['documentSublist'].unshift(formatDocumentData(child));
                                    documentData.index.set(child.id, child)
                                };
                            break;

                            case 'NiveauIndex':
                                for(let child of value){
                                    if (typeof child.Niveau != "undefined") {
                                        //console.log("hoisting child niveau: ", child.Niveau); // @TODO: remove when done debugging
                                        if(!child['@id']){
                                            child['@id'] = getId(child)
                                        }
                                        if(!child['@type']){
                                            child['@type'] = getType(child)
                                        }
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
                                    documentData.index.set(niveau.id , niveau);
                                };
                            break;

                            case '$mark':
                                switch(value){
                                    case 'changed':
                                        dataObj['documentSublist'].push({$mark:'changed'}); //not sure if I should instead put the CSS here somehow
                                    break;
                                    case 'deleted':
                                        dataObj['documentSublist'].push({$mark:'deleted'}) //not sure if I should instead put the CSS here somehow
                                    break;
                                    case 'inserted':
                                        dataObj['documentSublist'].push({$mark:'inserted'}) //not sure if I should instead put the CSS here somehow
                                    break;
                                    default:
                                        console.log("found an unknown type of $mark")
                                }
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
                // @TODO : Timely solution, double check later.
                if(!dataObj['@id']){
                    dataObj['@id'] = getId(node)
                }
                if(!dataObj['@type']){
                    dataObj['@type'] = getType(node)
                }
                return dataObj;
            }

            documentData.root = formatDocumentData(node);
            //console.log(JSON.stringify(documentData)); // NOTE: used for debugging

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
        getContextByTypeName(typeName) {
            return Object.keys(slo.contexts)
            .filter(c => {
                let types = Object.keys(slo.contexts[c].data)
                return types.includes(typeName)
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
        getAvailableChildTypes(typeName) {
            let context = slo.getContextByTypeName(typeName)
            let schema = slo.contexts[context].schema
            let children = schema[typeName].children
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