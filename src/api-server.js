const express = require('express');
const request = require('request-promise-native');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 4000;
const apiBase = "/";

const backendUrl      = "http://localhost:3000";
const inhoudSchemaURL = "https://opendata.slo.nl/curriculum/schemas/inhoud.jsonld";
const doelSchemaURL   = "https://opendata.slo.nl/curriculum/schemas/doel.jsonld";
const kerndoelSchemaURL   = "https://opendata.slo.nl/curriculum/schemas/kerndoel.jsonld";
const examenprogrammaSchemaURL = "https://opendata.slo.nl/curriculum/schemas/examenprogramma.jsonld";
const baseIdURL       = "/curriculum/uuid/";
const niveauURL       = "/curriculum/api/v1/niveau/";

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin','*');
	if (req.accepts('html')) {
		res.set('Content-Type', 'text/html');
		res.sendFile(path.join(__dirname, '../www/', 'index.html'));
		return;
	}
	next();
});


var graphQueries = fs.readFileSync("graph/api.graph", "utf8");

function graphQuery(operationName, variables, query) {
	if (!variables) {
		variables = {};
	}
	if (!query) {
		query = {};
	}

	for (i in variables) {
		// replace legacy bk: ids to basic uuids.
		variables[i] = variables[i].replace(/^bk:/, '');
	}

	variables.page = query.page ? query.page : 0;
	variables.perPage = query.perPage ? query.perPage : 100;

	var postData = {
		query : graphQueries,
		operationName : operationName,
		variables : variables
	};

	return request({
		url : backendUrl,
		method : "POST",
		json : postData
	}).then(function(body) {
		if (body.errors) {
			throw new Error(body.errors);
		}
		return body;
	}).catch(function(error) {
		console.log(error)
	});
}

function jsonLD(entry, schema, type) {
	if (!entry || !entry.id) {
		return entry;
	}
	var result = {
		'@id': baseIdURL + entry.id,
		'@context': schema,
		'@type': type,
		'uuid': entry.id
	};
	delete entry.id;
	[
		'ExamenprogrammaBody','ExamenprogrammaKop4','ExamenprogrammaKop3','ExamenprogrammaKop2','ExamenprogrammaKop1',
		'ExamenprogrammaEindterm','ExamenprogrammaSubdomein','ExamenprogrammaDomein','Examenprogramma','ExamenprogrammaVakleergebied',
		'Kerndoel','KerndoelDomein','KerndoelVakleergebied','KerndoelUitstroomprofiel',
		'Vak','Vakkern','Vaksubkern','Vakinhoud',
		'Doelniveau', 'Doel', 'Niveau',
		'replaces','replacedBy'
	].forEach(function(listName) {
		if (entry[listName]) {
			result[listName] = jsonLDList(entry[listName]);
			if (listName=='Niveau') {
				result[listName] = result[listName].map(function(entry) {
					entry['$ref'] = niveauURL + entry.uuid;
					return entry;
				});
			}
			delete entry[listName];
		}
	});
	if (entry['NiveauIndex']) {
		if (type=='Niveau') {
			if (entry['NiveauIndex'][0] && entry['NiveauIndex'][0]['Vak']) {
				result['Vak'] = entry['NiveauIndex'][0]['Vak'].map(function(link) {
					return {
						'@id': baseIdURL + link.id,
						'title': link.title,
						'$ref': niveauURL + result.uuid + '/vak/' + link.id
					}
				});
			}
		} else {
			var urlType = '';
			urlType = type.toLowerCase();
				
			result['Niveau'] = entry['NiveauIndex'].map(function(ni) {
				return {
					'@id': baseIdURL + ni.Niveau[0].id,
					'title': ni.Niveau[0].title,
					'$ref': niveauURL + ni.Niveau[0].id + '/' + urlType + '/' + result['uuid']
				}
			});
		}
		delete entry['NiveauIndex'];
	}
/*	['replaces','replacedBy'].forEach(function(listName) {
		if (!entry[listName]) {
			return;
		}
		result[listName] = entry[listName].map(function(id) {
			return {
				'@id': baseIdURL + id,
				'uuid': id
			}
		});
		delete entry[listName];
	});
*/
	Object.keys(entry).forEach(function(key) {
		result[key] = entry[key];
	});
	return result;
}

function jsonLDList(list, schema, niveau, meta) {
	if (schema) {
		list['@context'] = schema;
	}
	list = list.map(function(link) {
		var result = {
			'@id': baseIdURL + link.id,
			'uuid': link.id
		};
		delete link.id;
		Object.keys(link).forEach(function(key) {
			if (Array.isArray(link[key])) {
				result[key] = jsonLDList(link[key]);
			} else {
				result[key] = link[key];
			}
		});
		return result;
	});
	if (meta) {
		meta.data = list;
		return meta;
	} else {
		return list;
	}
}

app.route(apiBase + 'uuid/:id').get((req, res) => {
	var schema = null;
	var entitytype = null;

	var getEntity = function(result) {
		for (i in result.data) {
			if (result.data[i].length) {
				return result.data[i][0];
			}
		}
	};
	
        graphQuery("Id", req.params)
	.then(function(result) {
		for (i in result.data) {
			if (result.data[i] && result.data[i].length) {
				result = result.data[i][0];
				entitytype = i.replace(/^all/, '');
				switch(entitytype) {
					case "Vak":
					case "Vakkern":
					case "Vaksubkern":
					case "Vakinhoud":
						schema = inhoudSchemaURL;
					break;
					case "Kerndoel":
					case "KerndoelDomein":
					case "KerndoelVakleergebied":
					case "KerndoelUitstroomprofiel":
						schema = kerndoelSchemaURL;
					break;
					case 'ExamenprogrammaEindterm':
					case 'ExamenprogrammaSubdomein':
					case 'ExamenprogrammaDomein':
					case 'ExamenprogrammaExamenprogramma':
					case 'ExamenprogrammaVakleergebied':
					case 'ExamenprogrammaKop1':
					case 'ExamenprogrammaKop2':
					case 'ExamenprogrammaKop3':
					case 'ExamenprogrammaKop4':
						schema = examenprogrammaSchemaURL;
					break;					
					default:
						schema = doelSchemaURL;
					break;
				}
				return result;
			}
		}
		return result;
	})
	.then(function(result) {
		if (result.replacedBy) {
			return Promise.all(result.replacedBy.map(function(id) {
				return graphQuery("Id", {id: id})
				.then(function(result) {
					return getEntity(result);
				})
				.then(function(entity) {
					return {
						id: entity.id,
						title: entity.title
					}
				});
			}))
			.then(function(replacedBy) {
				result.replacedBy = replacedBy;
				return result;
			});
		}
		return result;
	})
	.then(function(result) {
		if (result.replaces) {
			return Promise.all(result.replaces.map(function(id) {
				return graphQuery("Id",{id: id})
				.then(function(result) {
					return getEntity(result);
				})
				.then(function(entity) {
					console.log(entity);
					return {
						id: entity.id,
						title: entity.title
					}
				});
			}))
			.then(function(replaces) {
				result.replaces = replaces;
				return result;
			});
		}
		return result;
	})
	.then(function(result) {
		res.send(jsonLD(result, schema, entitytype));
        });
});

app.route(apiBase + 'deprecated/').get((req, res) => {
	graphQuery("Deprecated", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allDeprecated, result.data._allDeprecatedMeta));
	});
});

app.route(apiBase + 'deprecated/:id').get((req, res) => {
	graphQuery("DeprecatedById", req.params)
	.then(function(result) {
		res.send(jsonLD(result.data.Deprecated, inhoudSchemaURL, 'Deprecated'));
	});
});

// FIXME: what does this do?
app.route(apiBase + 'deprecated/:id/vak/:id').get((req, res) => {
	graphQuery("DeprecatedById", req.params)
	.then(function(result) {
		res.send(jsonLDList(result.data.Deprecated));
	});
});


app.route(apiBase + 'niveau').get((req, res) => {
	graphQuery("Niveau", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allNiveau, null, null, result.data._allNiveauMeta));
	});
});


app.route(apiBase + 'niveau/:id').get((req, res) => {
	graphQuery("NiveauById", req.params)
	.then(function(result) {
		res.send(jsonLD(result.data.Niveau, doelSchemaURL, 'Niveau'));
	});
});

app.route(apiBase + 'doel').get((req, res) => {
	graphQuery("Doel", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allDoel, null, null, result.data._allDoelMeta));
	});
});

app.route(apiBase + 'doelniveau').get((req, res) => {
	graphQuery("DoelNiveau", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allDoelniveau, null, null, result.data._allDoelniveauMeta));
	});
});

app.route(apiBase + 'vak').get((req, res) => {
	graphQuery("Vak", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allVak, null, null, result.data._allVakMeta));
	});
});

app.route(apiBase + 'vakkern').get((req, res) => {
	graphQuery("Vakkern", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allVakkern, null, null, result.data._allVakkernMeta));
	});
});

app.route(apiBase + 'vaksubkern').get((req, res) => {
	graphQuery("Vaksubkern", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allVaksubkern, null, null, result.data._allVaksubkernMeta));
	});
});

app.route(apiBase + 'vakinhoud').get((req, res) => {
	graphQuery("Vakinhoud", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allVakinhoud, null, null, result.data._allVakinhoudMeta));
	});
});

app.route(apiBase + 'kerndoel').get((req, res) => {
	graphQuery("Kerndoel", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allKerndoel, null, null, result.data._allKerndoelMeta));
	});
});

app.route(apiBase + 'kerndoel_domein').get((req, res) => {
	graphQuery("KerndoelDomein", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allKerndoelDomein, null, null, result.data._allKerndoelDomeinMeta));
	});
});
app.route(apiBase + 'kerndoel_vakleergebied').get((req, res) => {
	graphQuery("KerndoelVakleergebied", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allKerndoelVakleergebied, null, null, result.data._allKerndoelVakleergebiedMeta));
	});
});
app.route(apiBase + 'kerndoel_uitstroomprofiel').get((req, res) => {
	graphQuery("KerndoelUitstroomprofiel", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allKerndoelUitstroomprofiel, null, null, result.data._allKerndoelUitstroomprofielMeta));
	});
});

app.route(apiBase + 'examenprogramma_vakleergebied').get((req, res) => {
	graphQuery("ExamenprogrammaVakleergebied", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaVakleergebied, null, null, result.data._allExamenprogrammaVakleergebiedMeta));
	});
});
app.route(apiBase + 'examenprogramma').get((req, res) => {
	graphQuery("Examenprogramma", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogramma, null, null, result.data._allExamenprogrammaMeta));
	});
});
app.route(apiBase + 'examenprogramma_domein').get((req, res) => {
	graphQuery("ExamenprogrammaDomein", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaDomein, null, null, result.data._allExamenprogrammaDomeinMeta));
	});
});
app.route(apiBase + 'examenprogramma_subdomein').get((req, res) => {
	graphQuery("ExamenprogrammaSubdomein", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaSubdomein, null, null, result.data._allExamenprogrammaSubdomeinMeta));
	});
});
app.route(apiBase + 'examenprogramma_eindterm').get((req, res) => {
	graphQuery("ExamenprogrammaEindterm", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaEindterm, null, null, result.data._allExamenprogrammaEindtermMeta));
	});
});
app.route(apiBase + 'examenprogramma_kop1').get((req, res) => {
	graphQuery("ExamenprogrammaKop1", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaKop1, null, null, result.data._allExamenprogrammaKop1Meta));
	});
});
app.route(apiBase + 'examenprogramma_kop2').get((req, res) => {
	graphQuery("ExamenprogrammaKop2", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaKop2, null, null, result.data._allExamenprogrammaKop2Meta));
	});
});
app.route(apiBase + 'examenprogramma_kop3').get((req, res) => {
	graphQuery("ExamenprogrammaKop3", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaKop3, null, null, result.data._allExamenprogrammaKop3Meta));
	});
});
app.route(apiBase + 'examenprogramma_kop4').get((req, res) => {
	graphQuery("ExamenprogrammaKop4", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaKop4, null, null, result.data._allExamenprogrammaKop4Meta));
	});
});
app.route(apiBase + 'examenprogramma_body').get((req, res) => {
	graphQuery("ExamenprogrammaBody", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaBody, null, null, result.data._allExamenprogrammaBodyMeta));
	});
});



/* Queries op niveau */
app.route(apiBase + 'niveau/:niveau/doel').get((req, res) => {
	graphQuery("DoelOpNiveau", req.params)
	.then(function(result) {
		res.send(jsonLDList(result.data.allNiveauIndex[0].Doel));
	});
});

app.route(apiBase + 'niveau/:niveau/doel/:id').get((req, res) => {
	graphQuery("DoelOpNiveauById", req.params)
	.then(function(result) {
		res.send(jsonLD(result.data.Doel, doelSchemaURL, 'Doel'));
	});
});

app.route(apiBase + 'niveau/:niveau/kerndoel').get((req, res) => {
	graphQuery("KerndoelOpNiveau", req.params)
	.then(function(result) {
		res.send(jsonLD(result.data.allNiveauIndex[0].Kerndoel, doelSchemaURL, 'Kerndoel'));
	});
});

app.route(apiBase + 'niveau/:niveau/kerndoel/:id').get((req, res) => {
	graphQuery("KerndoelOpNiveauById", req.params)
	.then(function(result) {
		res.send(jsonLD(result.data.Kerndoel, doelSchemaURL, 'Kerndoel'));
	});
});

app.route(apiBase + 'niveau/:niveau/vak').get((req, res) => {
	graphQuery("VakOpNiveau", req.params)
	.then(function(result) {
		res.send(jsonLDList(result.data.allNiveauIndex[0].Vak));
	});
});

app.route(apiBase + 'niveau/:niveau/vak/:id').get((req, res) => {
	graphQuery("VakByIdOpNiveau", req.params)
	.then(function(result) {
		result.data.allNiveauIndex[0].Vak[0].Vakkern = result.data.allNiveauIndex[0].Vakkern;
		result.data.allNiveauIndex[0].Vak[0].Niveau = result.data.allNiveauIndex[0].Niveau;
		res.send(jsonLD(result.data.allNiveauIndex[0].Vak[0], inhoudSchemaURL, 'Vak'));
	});
});

app.route(apiBase + 'niveau/:niveau/vakkern').get((req, res) => {
	graphQuery("VakkernOpNiveau", req.params)
	.then(function(result) {
		res.send(jsonLDList(result.data.allNiveauIndex[0].Vakkern));
	});
});

app.route(apiBase + 'niveau/:niveau/vakkern/:id').get((req, res) => {
	graphQuery("VakkernByIdOpNiveau", req.params)
	.then(function(result) {
		result.data.allNiveauIndex[0].Vakkern[0].Vaksubkern = result.data.allNiveauIndex[0].Vaksubkern;
		result.data.allNiveauIndex[0].Vakkern[0].Niveau = result.data.allNiveauIndex[0].Niveau;
		res.send(jsonLD(result.data.allNiveauIndex[0].Vakkern[0], inhoudSchemaURL, 'Vakkern'));
	});
});

app.route(apiBase + 'niveau/:niveau/vaksubkern').get((req, res) => {
	graphQuery("VaksubkernOpNiveau", req.params)
	.then(function(result) {
		res.send(jsonLDList(result.data.allNiveauIndex[0].Vaksubkern));
	});
});

app.route(apiBase + 'niveau/:niveau/vaksubkern/:id').get((req, res) => {
	graphQuery("VaksubkernByIdOpNiveau", req.params)
	.then(function(result) {
		result.data.allNiveauIndex[0].Vaksubkern[0].Vakinhoud = result.data.allNiveauIndex[0].Vakinhoud;
		result.data.allNiveauIndex[0].Vaksubkern[0].Niveau = result.data.allNiveauIndex[0].Niveau;
		res.send(jsonLD(result.data.allNiveauIndex[0].Vaksubkern[0], inhoudSchemaURL, 'Vaksubkern'));
	});
});

app.route(apiBase + 'niveau/:niveau/vakinhoud').get((req, res) => {
	graphQuery("VakinhoudOpNiveau", req.params)
	.then(function(result) {
		res.send(jsonLDList(result.data.allNiveauIndex[0].Vakinhoud));
	});
});

app.route(apiBase + 'niveau/:niveau/vakinhoud/:id').get((req, res) => {
	graphQuery("VakinhoudByIdOpNiveau", req.params)
	.then(function(result) {
		result.data.allNiveauIndex[0].Vakinhoud[0].Niveau = result.data.allNiveauIndex[0].Niveau;
		res.send(jsonLD(result.data.allNiveauIndex[0].Vakinhoud[0], inhoudSchemaURL, 'Vakinhoud'));
	});
});

function getById(id) {
	return graphQuery("Id", {id: id}).then(function(result) {
		if (!result || !result.data) {
			return null;
		}
		for (i in result.data) {
			if (result.data[i].length) {
				result = result.data[i][0];
				result["entitytype"] = i.replace(/^all/, '');
				return result;
			}
		}
		return null;
	});
}

function getAllVersions(ids, entities) {
	if (!entities) {
		entities = [];
	}
	return Promise.all(ids.map(function(id) {
		return getById(id);
	}))
	.then(function(results) {
		var replaced = [];
		var all = [];
		results.forEach(function(entity, index) {
			if (!entity) {
				console.error('null values returned for ids at index:'+index,ids);
				return;
			}
			if (entity.replacedBy) {
				replaced = replaced.concat(entity.replacedBy);
			}
			all.push(entity);
		});
		if (replaced.length) {
			return getAllVersions(replaced, entities.concat(all));
		} else {
			return entities.concat(all);
		}
	});
}

function getLatestVersions(ids) {
	return getAllVersions(ids)
	.then(function(results) {
		return results.filter(function(entity) {
			return !entity.replacedBy;
		});
	});
}

function hasId(list, id) {
	for (var i=0; i<list.length; i++) {
		if (list[i].id == id) {
			return true;
		}
	}
	return false;
}

function walkReplacedBy(idIndex, ids) {
	var results = ids.map(function(id) {
		if (!idIndex[id]) {
			return null;
		}
		if (!idIndex[id].replacedBy) {
			return idIndex[id];
		}
		return walkReplacedBy(idIndex, idIndex[id].replacedBy);
	});
	return flatten(results).filter(x => x);
}

const flatten = function(arr, result = []) {
  for (let i = 0, length = arr.length; i < length; i++) {
    const value = arr[i];
    if (Array.isArray(value)) {
      flatten(value, result);
    } else {
      result.push(value);
    }
  }
  return result;
};

app.route(apiBase+"legacy/vak/:vak/").get((req, res) => {
	var vak = req.params.vak;
	getLatestVersions([vak])
	.then(function(results) {
		res.send(jsonLDList(results, null, null, {count: results.length}));	
	});
});

app.route(apiBase+"legacy/vak/:vak/vakkern/:vakkern/").get((req, res) => {
	var vak = req.params.vak;
	var vakkern = req.params.vakkern;
	var idIndex = {};

	getAllVersions([vak,vakkern])
	.then(function(results) {
		results.forEach(function(entity) {
			idIndex[entity.id] = entity;
		});
		return idIndex;
	})		
	.then(function(idIndex) {
		var vakken = walkReplacedBy(idIndex, [vak]);
		var vakkernen = walkReplacedBy(idIndex, [vakkern]);
		var matchingVakkernen = vakkernen.filter(function(entry) {
			var matchingVakken = vakken.filter(function(vakEntry) {
				return hasId(vakEntry.Vakkern, entry.id);
			});
			return matchingVakken.length>0;
		});
		if (matchingVakkernen.length) {
			res.send(jsonLDList(matchingVakkernen, null, null, {count: vakkernen.length}));
		} else {
			res.send(jsonLDList(vakkernen,null,null,{error: 'not found'}));
		}
	});
});

app.route(apiBase+"legacy/vak/:vak/vakkern/:vakkern/vaksubkern/:vaksubkern").get((req, res) => {
	var vak = req.params.vak;
	var vakkern = req.params.vakkern;
	var vaksubkern = req.params.vaksubkern;
	var idIndex = {};

	getAllVersions([vak, vakkern, vaksubkern])
	.then(function(results) {
		results.forEach(function(entry) {
			idIndex[entry.id] = entry;
		});

		return idIndex;
	}).then(function(idIndex) {

		var vaksubkernen = walkReplacedBy(idIndex, [vaksubkern]);
		var vakkernen    = walkReplacedBy(idIndex, [vakkern]);
		var vakken       = walkReplacedBy(idIndex, [vak]);

		vakkernen = vakkernen.filter(function(entry) {
			var matchingVakken = vakken.filter(function(vakEntry) {
				return hasId(vakEntry.Vakkern, entry.id);
			});
			return matchingVakken.length>0;
		});
		
		var matchingVaksubkernen = vaksubkernen.filter(function(entry) {
			var matchingVakkernen = vakkernen.filter(function(vakkernEntry) {
				return hasId(vakkernEntry.Vaksubkern, entry.id);
			});
			return matchingVakkernen.length>0;
		});
		if (matchingVaksubkernen.length) {
			res.send(jsonLDList(matchingVaksubkernen, null, null, {count: vaksubkernen.length}));
		} else {
			res.send(jsonLDList(vaksubkernen,null,null,{error: 'not found'}));
		}
	});

});

app.route(apiBase+"legacy/vak/:vak/vakkern/:vakkern/vaksubkern/:vaksubkern/vakinhoud/:vakinhoud").get((req, res) => {
	var vak = req.params.vak;
	var vakkern = req.params.vakkern;
	var vaksubkern = req.params.vaksubkern;
	var vakinhoud = req.params.vakinhoud;
	var idIndex = {};

	getAllVersions([vak, vakkern, vaksubkern, vakinhoud])
	.then(function(results) {
		results.forEach(function(entry) {
			idIndex[entry.id] = entry;
		});

		return idIndex;
	}).then(function(idIndex) {

		var vakinhouden  = walkReplacedBy(idIndex, [vakinhoud]);
		var vaksubkernen = walkReplacedBy(idIndex, [vaksubkern]);
		var vakkernen    = walkReplacedBy(idIndex, [vakkern]);
		var vakken       = walkReplacedBy(idIndex, [vak]);
		
		vakkernen = vakkernen.filter(function(entry) {
			var matchingVakken = vakken.filter(function(vakEntry) {
				return hasId(vakEntry.Vakkern, entry.id);
			});
			return matchingVakken.length>0;
		});
		
		vaksubkernen = vaksubkernen.filter(function(entry) {
			var matchingVakkernen = vakkernen.filter(function(vakkernEntry) {
				return hasId(vakkernEntry.Vaksubkern, entry.id);
			});
			return matchingVakkernen.length>0;
		});
		
		var matchingVakinhouden = vakinhouden.filter(function(entry) {
			var matchingVaksubkernen = vaksubkernen.filter(function(vaksubkernEntry) {
				return hasId(vaksubkernEntry.Vakinhoud, entry.id);
			});
			return matchingVaksubkernen.length>0;
		});
		
		if (matchingVakinhouden.length) {
			res.send(jsonLDList(matchingVakinhouden, null, null, {count: vakinhouden.length}));
		} else {
			res.send(jsonLDList(vakinhouden,null,null,{error: 'not found'}));
		}
	});

});

app.listen(port, () => console.log(`API server listening on port ${port}!`));