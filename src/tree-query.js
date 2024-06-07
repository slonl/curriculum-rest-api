function addToKey(data, key, value) {
    if (data[key]) {
        if (!Array.isArray(data[key])) {
            data[key] = [ data[key] ]
        }
        data[key].push(value)
    } else {
        data[key] = value;
    }
}

function isObject(data) 
{
    return typeof data === 'object' && !(
        data instanceof String
        || data instanceof Number
        || data instanceof Boolean
        || Array.isArray(data)
        || data === null
    )
}

function flattenObj(ob) {
    let result = {};
    for (const i in ob) {
        if (isObject(ob[i])) {
            const temp = flattenObj(ob[i]);
            for (const j in temp) {
                addToKey(result, j, temp[j])
            }
        } else {
            addToKey(result, i, ob[i])
        }
    }
    return result;
};

function inNiveaus(e, niveaus) {
    if (!Array.isArray(niveaus)) {
        niveaus = [niveaus]
    }
    let hasNiveaus = e.Niveau 
    ? from(e.Niveau).select({title: _}) 
    : from(e.NiveauIndex).select({Niveau: {title: _}})
    hasNiveaus = flattenObj(hasNiveaus)
    return niveaus.filter(value => {
      return hasNiveaus?.title?.includes(value)
    }).length>0
}

const nonEnumerables = {
  NiveauIndex: {
    Niveau: {
      id: _,
      title: _
    }
  },
  Tag: {
    title: _
  }
}

function getAll(contexts, niveaus) {
    return (data) => {
        let result = {}
        Object.entries(data).forEach(([k,v]) => {
            if (Array.isArray(v)) {
                result[k] = v.map(e => {
                    if (isObject(e)) {
                        if ((!contexts || !contexts.length || inContexts(e, contexts)) 
                            && (!niveaus || !niveaus.length || inNiveaus(e, niveaus))) {
                            let f = getAll(contexts,niveaus)
                            return f(e)
                        }
                        // else return null, which will be filtered
                    } else {
                        return e
                    }
                }).filter(Boolean)
            } else {
                if (k==='id') {
                    result['@id'] = 'https://opendata.slo.nl/curriculum/uuid/'+v
                    k = 'uuid'
                }
                result[k] = v
            }
        })
        // add non-enumerable tags that we still want, Tag, NiveauIndex, etc.
        // @FIXME: somehow this doesn't work
        Object.keys(nonEnumerables).forEach(k => {
            if (data[k]) {
                result[k] = from(data[k]).select(nonEnumerables[k])
            }
        })
        if (result.uuid) {
            result['@type'] = JSONTag.getAttribute(data, 'class')
        }
        return result
    }
}

function getContextByType(type) {
    let contexts = {}
    for( let context of Object.keys(data.schema.contexts)) {
        for (let typeName of Object.keys(data.schema.contexts[context])) {
            contexts[typeName] = 'curriculum-'+data.schema.contexts[context].label
        }
    }
    return contexts[type]
}

function inContexts(e, contexts) {
    if (!Array.isArray(contexts)) {
        contexts = [contexts]
    }
    let className = JSONTag.getAttribute(e, 'class')
    let context = getContextByType(className)
    return contexts.indexOf(context)!==-1 || className=='Niveau'; //s.some(context)
}

from(Index(request.query.id))
.select(getAll(request.query.context, request.query.niveau))
