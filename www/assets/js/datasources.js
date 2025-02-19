    window.titles = {}

    function updateDataSource(name) {
        window.document.querySelectorAll('[data-simply-data="'+name+'"]').forEach(function(list) {
            window.editor.list.applyDataSource(list, name);
        });
    }

    function initContexts() {
        var contexts = slo.contexts;
        
        editor.addDataSource('contexts', {
            load: Object.entries(contexts).map(([key, value]) => {
                return {
                    link: {
                        href: key+'/',
                        innerHTML: value.title
                    }
                }
            })
        })

        editor.addDataSource('contexts-select', {
            load: Object.keys(contexts)
        })


        Object
            .entries(contexts)
            .forEach(([path, context]) => {
                editor.addDataSource(path, {
                    load: Object.entries(context.data).map(([key,value]) => {
                        return {
                            link: {
                                href: value+'/',
                                innerHTML: key
                            }
                        }
                    })
                })
                Object.entries(context.data).forEach(([key,value]) => {
                    titles[value+'/'] = key;
                })
            }); // leave this ;, otherwise the (function() ) below is parsed incorrectly
    }

    window.slo.api.get('/niveau/')
    .then(niveaus => {
        window.slo.niveaus = niveaus.data.map(n => {
            if (!n.deleted) {
                delete n.deleted
            }
            if (!n.dirty) {
                delete n.dirty
            }
            return n
        })
        editor.addDataSource('niveaus', {
            load: niveaus.data.map(n => n.title)
        })
    })