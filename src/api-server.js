const express = require('express');
const request = require('request-promise-native');
const fs = require('fs');

const app = express();
const port = 4000;
const apiBase = "/";

const backendUrl = "http://localhost:3000";

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

app.route(apiBase + 'uuid/:id').get((req, res) => {
        graphQuery("Id", req.params)
	.then(function(result) {
		for (i in result.data) {
			if (result.data[i].length) {
				result = result.data[i][0];
				result["entitytype"] = i.replace(/^all/, '');
				res.send(result);
				return;
			}
		}
        });
});

app.route(apiBase + 'deprecated/').get((req, res) => {
	graphQuery("Deprecated", null, function(result) {
		res.send(result.data.allDeprecated);
	});
});

app.route(apiBase + 'deprecated/:id').get((req, res) => {
	graphQuery("DeprecatedById", req.params)
	.then(function(result) {
		res.send(result.data.Deprecated);
	});
});

app.route(apiBase + 'deprecated/:id/vak/:id').get((req, res) => {
	graphQuery("DeprecatedById", req.params)
	.then(function(result) {

		res.send(result.data.Deprecated);
	});
});


app.route(apiBase + 'niveau').get((req, res) => {
	graphQuery("Niveau", null)
	.then(function(result) {
		res.send(result.data.allNiveau);
	});
});


app.route(apiBase + 'niveau/:id').get((req, res) => {
	graphQuery("NiveauById", req.params)
	.then(function(result) {
		res.send(result.data.Niveau);
	});
});

app.route(apiBase + 'doel').get((req, res) => {
	graphQuery("Doel", null)
	.then(function(result) {
		res.send(result.data.allDoel);
	});
});

app.route(apiBase + 'doel/:id').get((req, res) => {
	graphQuery("DoelById", req.params)
	.then(function(result) {
		res.send(result.data.Doel);
	});
});

app.route(apiBase + 'kerndoel').get((req, res) => {
	graphQuery("Kerndoel", null)
	.then(function(result) {
		res.send(result.data.allKerndoel);
	});
});

app.route(apiBase + 'kerndoel/:id').get((req, res) => {
	graphQuery("KerndoelById", req.params)
	.then(function(result) {
		res.send(result.data.Kerndoel);
	});
});

app.route(apiBase + 'vak').get((req, res) => {
	graphQuery("Vak", null)
	.then(function(result) {
		res.send(result.data.allVak);
	});
});

app.route(apiBase + 'vak/:id').get((req, res) => {
	graphQuery("VakById", req.params)
	.then(function(result) {
		res.send(result.data.Vak);
	});
});

app.route(apiBase + 'vakkern').get((req, res) => {
	graphQuery("Vakkern", null)
	.then(function(result) {
		res.send(result.data.allVakkern);
	});
});

app.route(apiBase + 'vakkern/:id').get((req, res) => {
	graphQuery("VakkernById", req.params)
	.then(function(result) {
		res.send(result.data.Vakkern);
	});
});

app.route(apiBase + 'vaksubkern').get((req, res) => {
	graphQuery("Vaksubkern", null)
	.then(function(result) {
		res.send(result.data.allVaksubkern);
	});
});

app.route(apiBase + 'vaksubkern/:id').get((req, res) => {
	graphQuery("VaksubkernById", req.params)
	.then(function(result) {
		res.send(result.data);
	});
});

app.route(apiBase + 'vakinhoud').get((req, res) => {
	graphQuery("Vakinhoud", null)
	.then(function(result) {
		res.send(result.data.allVakinhoud);
	});
});

app.route(apiBase + 'vakinhoud/:id').get((req, res) => {
	graphQuery("VakinhoudById", req.params)
	.then(function(result) {
		res.send(result.data.Vakinhoud);
	});
});
/* Queries op niveau */
app.route(apiBase + 'niveau/:niveau/doel').get((req, res) => {
	graphQuery("DoelOpNiveau", req.params)
	.then(function(result) {
		res.send(result.data.allNiveauIndex[0].Doel);
	});
});

app.route(apiBase + 'niveau/:niveau/doel/:id').get((req, res) => {
	graphQuery("DoelOpNiveauById", req.params)
	.then(function(result) {
		res.send(result.data.Doel);
	});
});

app.route(apiBase + 'niveau/:niveau/kerndoel').get((req, res) => {
	graphQuery("KerndoelOpNiveau", req.params)
	.then(function(result) {
		res.send(result.data.allNiveauIndex[0].Kerndoel);
	});
});

app.route(apiBase + 'niveau/:niveau/kerndoel/:id').get((req, res) => {
	graphQuery("KerndoelOpNiveauById", req.params)
	.then(function(result) {
		res.send(result.data.Kerndoel);
	});
});

app.route(apiBase + 'niveau/:niveau/vak').get((req, res) => {
	graphQuery("VakOpNiveau", req.params)
	.then(function(result) {
		res.send(result.data.allNiveauIndex[0].Vak);
	});
});

app.route(apiBase + 'niveau/:niveau/vak/:id').get((req, res) => {
	graphQuery("VakByIdOpNiveau", req.params)
	.then(function(result) {
		result.data.allNiveauIndex[0].Vak[0].Vakkern = result.data.allNiveauIndex[0].Vakkern;
		res.send(result.data.allNiveauIndex[0].Vak[0]);
	});
});

app.route(apiBase + 'niveau/:niveau/vakkern').get((req, res) => {
	graphQuery("VakkernOpNiveau", req.params)
	.then(function(result) {
		res.send(result.data.allNiveauIndex[0].Vakkern);
	});
});

app.route(apiBase + 'niveau/:niveau/vakkern/:id').get((req, res) => {
	graphQuery("VakkernByIdOpNiveau", req.params)
	.then(function(result) {
		result.data.allNiveauIndex[0].Vakkern[0].Vaksubkern = result.data.allNiveauIndex[0].Vaksubkern;
		res.send(result.data.allNiveauIndex[0].Vakkern[0]);
	});
});

app.route(apiBase + 'niveau/:niveau/vaksubkern').get((req, res) => {
	graphQuery("VaksubkernOpNiveau", req.params)
	.then(function(result) {
		res.send(result.data.allNiveauIndex[0].Vaksubkern);
	});
});

app.route(apiBase + 'niveau/:niveau/vaksubkern/:id').get((req, res) => {
	graphQuery("VaksubkernByIdOpNiveau", req.params)
	.then(function(result) {
		result.data.allNiveauIndex[0].Vaksubkern[0].Vakinhoud = result.data.allNiveauIndex[0].Vakinhoud;
		res.send(result.data.allNiveauIndex[0].Vaksubkern[0]);
	});
});

app.route(apiBase + 'niveau/:niveau/vakinhoud').get((req, res) => {
	graphQuery("VakinhoudOpNiveau", req.params)
	.then(function(result) {
		res.send(result.data.allNiveauIndex[0].Vakinhoud);
	});
});

app.route(apiBase + 'niveau/:niveau/vakinhoud/:id').get((req, res) => {
	graphQuery("VakinhoudByIdOpNiveau", req.params)
	.then(function(result) {
		res.send(result.data.allNiveauIndex[0].Vakinhoud[0]);
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