
    function updateDataSource(name) {
        window.document.querySelectorAll('[data-simply-data="'+name+'"]').forEach(function(list) {
            window.editor.list.applyDataSource(list, name);
        });
    }

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

    let titles = {}

    Object
        .entries(contexts)
        .forEach(([path, context]) => {
            editor.addDataSource(path, {
                load: Object.entries(context.data).map(([key,value]) => {
                    return {
                        link: {
                            href: key+'/',
                            innerHTML: value
                        }
                    }
                })
            })
            Object.entries(context.data).forEach(([key,value]) => {
                titles[key+'/'] = value;
            })
        }); // leave this ;, otherwise the (function() ) below is parsed incorrectly

    let niveaus = []
    window.slo.api.get('/niveau/')
    .then(niveaus => {
        niveaus = niveaus.data.map(n => n.title)
        editor.addDataSource('niveaus', {
            load: niveaus
        })
    })