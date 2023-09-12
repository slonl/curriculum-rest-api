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

function getAll(contexts, niveaus) {
	return (data) => {
		let result = {}
		Object.entries(data).forEach(([k,v]) => {
			if (Array.isArray(v)) {
				result[k] = v.map(e => {
					if (isObject(e)) {
						if (inContexts(e, contexts) && inNiveaus(e, niveaus)) {
                            let f = getAll(contexts,niveaus)
							return f(e)
						}
						// else return null, which will be filtered
					} else {
						return e
					}
				}).filter(Boolean)
			} else {
				result[k] = v
			}
		})
        return result
	}
}

function getContextByType(type) {
	let contexts = {"NhCategorie":"curriculum-niveauhierarchie","NhSector":"curriculum-niveauhierarchie","NhSchoolsoort":"curriculum-niveauhierarchie","NhLeerweg":"curriculum-niveauhierarchie","NhBouw":"curriculum-niveauhierarchie","NhNiveau":"curriculum-niveauhierarchie","Deprecated":"curriculum-samenhang","LdkVakleergebied":"curriculum-leerdoelenkaarten","LdkVakkern":"curriculum-leerdoelenkaarten","LdkVaksubkern":"curriculum-leerdoelenkaarten","LdkVakinhoud":"curriculum-leerdoelenkaarten","LdkVakbegrip":"curriculum-leerdoelenkaarten","SyllabusVakleergebied":"curriculum-syllabus","Syllabus":"curriculum-syllabus","SyllabusSpecifiekeEindterm":"curriculum-syllabus","SyllabusToelichting":"curriculum-syllabus","SyllabusVakbegrip":"curriculum-syllabus","ExamenprogrammaBody":"curriculum-examenprogramma","ExamenprogrammaKop4":"curriculum-examenprogramma","ExamenprogrammaKop3":"curriculum-examenprogramma","ExamenprogrammaKop2":"curriculum-examenprogramma","ExamenprogrammaKop1":"curriculum-examenprogramma","ExamenprogrammaEindterm":"curriculum-examenprogramma","ExamenprogrammaSubdomein":"curriculum-examenprogramma","ExamenprogrammaDomein":"curriculum-examenprogramma","ExamenprogrammaVakleergebied":"curriculum-examenprogramma","Examenprogramma":"curriculum-examenprogramma","ErkVakleergebied":"curriculum-erk","ErkGebied":"curriculum-erk","ErkCategorie":"curriculum-erk","ErkTaalactiviteit":"curriculum-erk","ErkSchaal":"curriculum-erk","ErkCandobeschrijving":"curriculum-erk","ErkVoorbeeld":"curriculum-erk","ErkLesidee":"curriculum-erk","InhVakleergebied":"curriculum-inhoudslijnen","InhInhoudslijn":"curriculum-inhoudslijnen","InhCluster":"curriculum-inhoudslijnen","InhSubcluster":"curriculum-inhoudslijnen","Kerndoel":"curriculum-kerndoelen","KerndoelVakleergebied":"curriculum-kerndoelen","KerndoelDomein":"curriculum-kerndoelen","KerndoelUitstroomprofiel":"curriculum-kerndoelen","Leerlingtekst":"curriculum-doelgroepteksten","FoDomein":"curriculum-fo","FoSubdomein":"curriculum-fo","FoDoelzin":"curriculum-fo","FoUitwerking":"curriculum-fo","FoToelichting":"curriculum-fo","Doelniveau":"curriculum-basis","Doel":"curriculum-basis","Niveau":"curriculum-basis","Vakleergebied":"curriculum-basis","Alias":"curriculum-basis","ExamenprogrammaBgProfiel":"curriculum-examenprogramma-bg","ExamenprogrammaBgKern":"curriculum-examenprogramma-bg","ExamenprogrammaBgKerndeel":"curriculum-examenprogramma-bg","ExamenprogrammaBgModuletaak":"curriculum-examenprogramma-bg","ExamenprogrammaBgKeuzevaktaak":"curriculum-examenprogramma-bg","ExamenprogrammaBgModule":"curriculum-examenprogramma-bg","ExamenprogrammaBgKeuzevak":"curriculum-examenprogramma-bg","ExamenprogrammaBgDeeltaak":"curriculum-examenprogramma-bg","ExamenprogrammaBgGlobaleEindterm":"curriculum-examenprogramma-bg","Tag":"curriculum-samenhang","Relatie":"curriculum-samenhang"}
	return contexts[type]
}

function inContexts(e, contexts) {
	if (!Array.isArray(contexts)) {
		contexts = [contexts]
	}
	let className = JSONTag.getAttribute(e, 'class')
	let context = getContextByType(className)
    return contexts.indexOf(context)!==-1; //s.some(context)
}

from(Index(request.query.id))
.select(getAll(request.query.context, request.query.niveau))
