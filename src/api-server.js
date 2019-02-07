const express = require('express');
const request = require('request-promise-native');
const fs = require('fs');

const app = express();
const port = 4000;
const apiBase = "/";

const backendUrl      = "http://localhost:3000";
const inhoudSchemaURL = "https://opendata.slo.nl/curriculum/schemas/inhoud.jsonld";
const doelSchemaURL   = "https://opendata.slo.nl/curriculum/schemas/doel.jsonld";
const baseIdURL       = "https://opendata.slo.nl/curriculum/api/v1/uuid/";

var graphQueries = fs.readFileSync("../graph/api.graph", "utf8");

function graphQuery(operationName, variables) {
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
	entry['@context'] = schema;
	entry['@type'] = type;
	['vakkern_id','vaksubkern_id','vakinhoud_id'].forEach(function(listName) {
		if (entry[listName]) {
			entry[listName] = jsonLDList(entry[listName]);
		}
	});
	return entry;
}

function jsonLDList(list, schema) {
	if (schema) {
		list['@context'] = schema;
	}
	list = list.map(function(link) {
		return {
			'@id': baseIdURL + link.id
		};
	});
	return list;
}

app.route(apiBase + 'uuid/:id').get((req, res) => {
        graphQuery("Id", req.params)
	.then(function(result) {
		for (i in result.data) {
			if (result.data[i].length) {
				result = result.data[i][0];
				var entitytype = i.replace(/^all/, '');
				switch(entitype) {
					case "Vak":
					case "Vakkern":
					case "Vaksubkern":
					case "Vakinhoud":
						var schema = inhoudSchemaURL;
					break;
					default:
						var schema = doelSchemaURL;
					break;
				}
				res.send(jsonLD(result, schema, entitype));
				return;
			}
		}
        });
});

app.route(apiBase + 'deprecated/').get((req, res) => {
	graphQuery("Deprecated", null, function(result) {
		res.send(jsonLD(result.data.allDeprecated, inhoudSchemaURL, 'Deprecated'));
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
	graphQuery("Niveau", null)
	.then(function(result) {
		res.send(jsonLDList(result.data.allNiveau));
	});
});


app.route(apiBase + 'niveau/:id').get((req, res) => {
	graphQuery("NiveauById", req.params)
	.then(function(result) {
		res.send(jsonLD(result.data.Niveau, doelSchemaURL, 'Niveau'));
	});
});

app.route(apiBase + 'doel').get((req, res) => {
	graphQuery("Doel", null)
	.then(function(result) {
		res.send(jsonLDList(result.data.allDoel));
	});
});

app.route(apiBase + 'doel/:id').get((req, res) => {
	graphQuery("DoelById", req.params)
	.then(function(result) {
		res.send(jsonLD(result.data.Doel, doelSchemaURL, 'Doel'));
	});
});

app.route(apiBase + 'kerndoel').get((req, res) => {
	graphQuery("Kerndoel", null)
	.then(function(result) {
		res.send(jsonLDList(result.data.allKerndoel));
	});
});

app.route(apiBase + 'kerndoel/:id').get((req, res) => {
	graphQuery("KerndoelById", req.params)
	.then(function(result) {
		res.send(jsonLD(result.data.Kerndoel, doelSchemaURL, 'Kerndoel'));
	});
});

app.route(apiBase + 'vak').get((req, res) => {
	graphQuery("Vak", null)
	.then(function(result) {
		res.send(jsonLDList(result.data.allVak));
	});
});

app.route(apiBase + 'vak/:id').get((req, res) => {
	graphQuery("VakById", req.params)
	.then(function(result) {
		res.send(jsonLD(result.data.Vak, inhoudSchemaURL, 'Vak'));
	});
});

app.route(apiBase + 'vakkern').get((req, res) => {
	graphQuery("Vakkern", null)
	.then(function(result) {
		res.send(jsonLDList(result.data.allVakkern));
	});
});

app.route(apiBase + 'vakkern/:id').get((req, res) => {
	graphQuery("VakkernById", req.params)
	.then(function(result) {
		res.send(jsonLD(result.data.Vakkern, inhoudSchemaURL, 'Vakkern'));
	});
});

app.route(apiBase + 'vaksubkern').get((req, res) => {
	graphQuery("Vaksubkern", null)
	.then(function(result) {
		res.send(jsonLDList(result.data.allVaksubkern));
	});
});

app.route(apiBase + 'vaksubkern/:id').get((req, res) => {
	graphQuery("VaksubkernById", req.params)
	.then(function(result) {
		res.send(jsonLD(result.data.Vaksubkern, inhoudSchemaURL, 'Vaksubkern'));
	});
});

app.route(apiBase + 'vakinhoud').get((req, res) => {
	graphQuery("Vakinhoud", null)
	.then(function(result) {
		res.send(jsonLDList(result.data.allVakinhoud));
	});
});

app.route(apiBase + 'vakinhoud/:id').get((req, res) => {
	graphQuery("VakinhoudById", req.params)
	.then(function(result) {
		res.send(jsonLD(result.data.Vakinhoud, inhoudSchemaURL, 'Vakinhoud'));
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
		res.send(jsonLD(result.data.allNiveauIndex[0].Vak[0], inhoudSchemaURL, 'Vak');
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
		res.send(jsonLD(result.data.allNiveauIndex[0].Vakkern[0], inhoudSchemaURL, 'Vakkern');
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
		res.send(jsonLD(result.data.allNiveauIndex[0].Vaksubkern[0], inhoudSchemaURL, 'Vaksubkern');
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
		res.send(jsonLD(result.data.allNiveauIndex[0].Vakinhoud[0], inhoudSchemaURL, 'Vakinhoud');
	});
});


/*
app.route("/api/legacy/vak/:vak/").get((req, res) => {
});
app.route("/api/legacy/vak/:vak/vakkern/:vakkern/").get((req, res) => {
});
*/
app.route("/api/legacy/vak/:vak/vakkern/:vakkern/vaksubkern/:vaksubkern").get((req, res) => {

	function getById(id) {
		return graphQuery("Id", {id: id}).then(function(result) {
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

	var vak = req.params.vak;
	var vakkern = req.params.vakkern;
	var vaksubkern = req.params.vaksubkern;
	var idIndex = {};

	Promise.all([
	        getById(vak),
	        getById(vakkern),
	        getById(vaksubkern),
        ])
	.then(function(results) {
		var vakOb = results[0];
		var vakkernOb = results[1];
		var vaksubkernOb = results[2];
		idIndex[vak] = vakOb;
		idIndex[vakkern] = vakkernOb;
		idIndex[vaksubkern] = vaksubkernOb;

		subQueries = [];
		results.forEach(function(entry) {
			if (entry.replacedBy) { // fixme: checks of ze bestaan;
				entry.replacedBy.forEach(function(id) {
					subQueries.push(getById(id));
				});
			}
		});

		return Promise.all(subQueries);
	}).then(function(results) {
		//FIXME: subquery results may in the future also be deprecated, so this should be done recursively
		results.forEach(function(entry) {
			idIndex[entry.id] = entry;
		});

		return idIndex;
	}).then(function(idIndex) {
		function hasId(list, id) {
			for (var i=0; i<list.length; i++) {
				if (list[i].id == id) {
					return true;
				}
			}
			return false;
		}

		var vaksubkernPotentials = idIndex[vaksubkern].replacedBy; //TODO: early exit if replacedBy doesn't exist
		var vakkernPotentials = idIndex[vakkern].replacedBy;
		var vakPotentials = idIndex[vak].replacedBy;
		// FIXME: could be more than one
		var matchingVak = idIndex[vakPotentials[0]];
		vakkernPotentials = vakkernPotentials.filter(function(entryId) {
			if (hasId(matchingVak.Vakkern, entryId)) {
				return true;
			} else {
				return false;
			}
		});
		//FIXME: could be more than one
		var matchingVakkern = idIndex[vakkernPotentials[0]];
		vaksubkernPotentials = vaksubkernPotentials.filter(function(entryId) {
			if (hasId(matchingVakkern.Vaksubkern, entryId)) {
				return true;
			} else {
				return false;
			}
		});
		var matchingVaksubkern = idIndex[vaksubkernPotentials[0]];
		res.send(matchingVaksubkern);
	});


});
/*
app.route("/api/legacy/vak/:vak/vakkern/:vakkern/vaksubkern/:vaksubkern/vakinhoud/:vakinhoud").get((req, res) => {
});
*/
app.listen(port, () => console.log(`API server listening on port ${port}!`));