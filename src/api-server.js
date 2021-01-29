const express     = require('express');
const basicAuth   = require('express-basic-auth')
const watch       = require('watch');
const request     = require('request-promise-native');
const fs          = require('fs');
const path        = require('path');
const {v4:uuidv4} = require('uuid');
const nodemailer  = require('nodemailer');
const mcache      = require('memory-cache');

const app     = express();
const port    = 4500;
const apiBase = "/";

const lpibSchemaURL              = "https://opendata.slo.nl/curriculum/schemas/lpib.jsonld";
const basisSchemaURL             = "https://opendata.slo.nl/curriculum/schemas/basis.jsonld";
const kerndoelSchemaURL          = "https://opendata.slo.nl/curriculum/schemas/kerndoel.jsonld";
const leerdoelkaartSchemaURL     = "https://opendata.slo.nl/curriculum/schemas/leerdoelenkaart.jsonld";
const examenprogrammaSchemaURL   = "https://opendata.slo.nl/curriculum/schemas/examenprogramma.jsonld";
const examenprogrammaBgSchemaURL = "https://opendata.slo.nl/curriculum/schemas/examenprogramma_bg.jsonld";
const syllabusSchemaURL          = "https://opendata.slo.nl/curriculum/schemas/syllabus.jsonld";
const inhoudslijnenSchemaURL     = "https://opendata.slo.nl/curriculum/schemas/inhoudslijn.jsonld";
const baseIdURL                  = "https://opendata.slo.nl/curriculum/uuid/";

const backendUrl      = "http://localhost:3500";
//const baseDatasetURL  = 'https://curriculum-rest-api.dev.muze.nl/curriculum/api-acpt/v1/'; //2019/';
//const backendUrl      = 'https://opendata.slo.nl:3500';
const baseDatasetURL  = 'https://opendata.slo.nl/curriculum/api-acpt/v1/';

const niveauURL       = baseDatasetURL + "niveau/";
const notfound        = { error: "not found"};

var cache = function() {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      console.log("cache hit for " + key);
      res.send(cachedBody)
      return
    } else {
      console.log("cache miss for " + key);
      res.sendResponse = res.send
      res.send = (body) => {
        // mcache.put(key, body, duration * 1000);
        mcache.put(key, body);
        res.sendResponse(body)
      }
      next()
    }
  }
};

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Origin', req.headers.origin ? req.headers.origin : '*');
	res.header('Access-Control-Allow-Headers','Authorization');
	if ('OPTIONS' == req.method) {
		res.sendStatus(200);
		return;
	} else if (req.accepts('html')) {
		res.set('Content-Type', 'text/html');
		res.sendFile(path.join(__dirname, '../www/', 'index.html'));
		return;
	}
	next();
});

app.route(apiBase + 'register/').get((req, res) => {
	var user = req.query.email;
    console.log("Register " + user);

	var keyData = fs.readFileSync("apiKeys.json", "utf8");
	keyData = JSON.parse(keyData);

	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	today = yyyy + '-' + mm + '-' + dd;

	if (!keyData[user]) {
		keyData[user] = {
			key : uuidv4(),
			created : today
		}
		sendApiKey(user, keyData[user].key);
	}
	fs.writeFile("apiKeys.json.new", JSON.stringify(keyData, null, 2), function() {
		fs.rename("apiKeys.json.new", "apiKeys.json", readKeys);
	});
});

function myAuthorizer(username, password) {
    console.log("checking api key for " + username);
    if (!apiKeys[username]) {
        console.log('user does not exist');
        return false;
    }
    if (basicAuth.safeCompare(password, apiKeys[username].key)) {
        return true;
    } else {
       console.log('password does not match');
    }
}
app.use(basicAuth( { authorizer: myAuthorizer, challenge: true } ));

var apiKeys = {};
 
function readKeys() {
    var keyData = fs.readFileSync("apiKeys.json", "utf8");
    try {
       keyData = JSON.parse(keyData);
    } catch (e) {
        console.log("Invalid JSON in key API data");
        console.log(e);
    }
    apiKeys = keyData;
}

watch.createMonitor('.', function(monitor) {
    monitor.files['./apikeys.json']
    monitor.on('changed', function(f, curr, prev) { 
        readKeys();
    });
});

function sendApiKey(email, key) {
	let transporter = nodemailer.createTransport({
	    host: "localhost",
	    port: 25
	});
    	var mail = {
	    from: "SLO Opendata <opendata@slo.nl>",
	    to: email,
	    bcc: 'opendata@slo.nl',
	    subject: "SLO Opendata API key",
	    text: "Bedankt voor het registreren op opendata.slo.nl. Je API key is:\n" + key,
	    html: "<p>Bedankt voor het registreren op opendata.slo.nl. Je API key is:<br><b>" + key + "</p>"
	}

	transporter.sendMail(mail);
	
}

readKeys();

var graphQueries = fs.readFileSync("graph/api.graph", "utf8");

function graphQuery(operationName, variables, query) {
	console.log(operationName);
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
		'@isPartOf': baseDatasetURL,
		'@references': baseDatasetURL + 'uuid/'+entry.id,
		'uuid': entry.id
	};
	delete entry.id;
	[
		'ExamenprogrammaBody','ExamenprogrammaKop4','ExamenprogrammaKop3','ExamenprogrammaKop2','ExamenprogrammaKop1',
		'ExamenprogrammaEindterm','ExamenprogrammaSubdomein','ExamenprogrammaDomein','Examenprogramma','ExamenprogrammaVakleergebied',
		'ExamenprogrammaBgProfiel','ExamenprogrammaBgKern','ExamenprogrammaBgKerndeel','ExamenprogrammaBgGlobaleEindterm','ExamenprogrammaBgModule',
		'ExamenprogrammaBgKeuzevak','ExamenprogrammaBgDeeltaak','ExamenprogrammaBgModuletaak','ExamenprogrammaBgKeuzevaktaak',
		'LdkVakleergebied','LdkVakkern','LdkVaksubkern','LdkVakinhoud',
		'Kerndoel','KerndoelDomein','KerndoelVakleergebied','KerndoelUitstroomprofiel',
		'LpibVakleergebied','LpibVakkern','LpibVaksubkern','LpibVakinhoud','LpibVakkencluster','LpibLeerlijn',
		'Vakleergebied', 'Doelniveau', 'Doel', 'Niveau',
		'Syllabus','SyllabusSpecifiekeEindterm','SyllabusToelichting','SyllabusVakbegrip',
		'InhVakleergebied', 'InhInhoudslijn', 'InhCluster',
		'replaces','replacedBy'
	].forEach(function(listName) {
		if (entry[listName] && Array.isArray(entry[listName])) {
			result[listName] = jsonLDList(entry[listName]);
			if (listName=='Niveau') {
				result[listName] = result[listName]
				.sort(function(a,b) {
					return a.prefix<b.prefix ? -1 : 1;
				})
				.map(function(childEntry) {
					childEntry['$ref'] = niveauURL + childEntry.uuid;
					if (type=='Vakleergebied') {
						childEntry['$ref'] += '/vakleergebied/' + result.uuid;
					}
					return childEntry;
				});
			}
			delete entry[listName];
		}
	});
	if (entry['NiveauIndex']) {
		if (type=='Niveau') {
			if (entry['NiveauIndex'][0] && entry['NiveauIndex'][0]['LpibVakleergebied']) {
				result['LpibVakleergebied'] = entry['NiveauIndex'][0]['LpibVakleergebied'].map(function(link) {
					return {
						'@id': baseIdURL + link.id,
						'title': link.title,
						'$ref': niveauURL + result.uuid + '/vakleergebied/' + link.id
					}
				});
			}
			if (entry['NiveauIndex'][0] && entry['NiveauIndex'][0]['LdkVakleergebied']) {
				result['LdkVakleergebied'] = entry['NiveauIndex'][0]['LdkVakleergebied'].map(function(link) {
					return {
						'@id': baseIdURL + link.id,
						'title': link.title,
						'$ref': niveauURL + result.uuid + '/ldk_vakleergebied/' + link.id
					}
				});
			}
			if (entry['NiveauIndex'][0] && entry['NiveauIndex'][0]['KerndoelVakleergebied']) {
				result['KerndoelVakleergebied'] = entry['NiveauIndex'][0]['KerndoelVakleergebied'].map(function(link) {
					return {
						'@id': baseIdURL + link.id,
						'title': link.title,
						'$ref': niveauURL + result.uuid + '/kerndoel_vakleergebied/' + link.id
					}
				});
			}
			if (entry['NiveauIndex'][0] && entry['NiveauIndex'][0]['InhVakleergebied']) {
				result['InhVakleergebied'] = entry['NiveauIndex'][0]['InhVakleergebied'].map(function(link) {
					return {
						'@id': baseIdURL + link.id,
						'title': link.title,
						'$ref': niveauURL + result.uuid + '/inh_vakleergebied/' + link.id
					}
				});
			}
		} else {
			var urlType = '';
			if (type.substr(0,3)=='Ldk') {
				urlType = 'ldk_'+type.substr(3).toLowerCase();
			} else if (type.substr(0,4)=='Lpib') {
				urlType = 'lpib_'+type.substr(4).toLowerCase();
			} else {
				urlType = type.toLowerCase();
			}
				
			result['Niveau'] = entry['NiveauIndex']
			.sort(function(a,b) {
				return (a.Niveau[0].prefix<b.Niveau[0].prefix ? -1 : 1);
			})
			.map(function(ni) {
				return {
					'@id': baseIdURL + ni.Niveau[0].id,
					'title': ni.Niveau[0].title,
					'prefix': ni.Niveau[0].prefix+'-1',
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

function jsonLDList(list, schema, type, meta) {
	// remove dummy entries from returned list
	// TODO: remove these in the graphql server, they are only there to 
	// provide access to properties which aren't actually set in the current data, but may be set later
	if (list[list.length-1] && list[list.length-1].id && parseInt(list[list.length-1].id)<0) {
		list.pop();
	}
	if (list[0] && list[0].id && parseInt(list[0].id)<0) {
		list.shift();
	}
	list = list.map(function(link) {
		var result = {
			'@id': baseIdURL + link.id,
			'@references': baseDatasetURL + 'uuid/'+link.id,
			'uuid': link.id
		};

		if (schema) {
			result['@context'] = schema;
		}
		if (type) {
			result['@type'] = type;
		}
		delete link.id;
		Object.keys(link).forEach(function(key) {
			if (Array.isArray(link[key])) {
				if (key=='NiveauIndex') {
					result['Niveau'] = link['NiveauIndex']
					.sort(function(a,b) {
						return (a.Niveau[0].prefix<b.Niveau[0].prefix ? -1 : 1);
					})
					.map(function(ni) {
						return {
							'@id': baseIdURL + ni.Niveau[0].id,
							'title': ni.Niveau[0].title,
							'@references': niveauURL + ni.Niveau[0].id + '/'
						}
					});
				} else if (key=='Niveau') {
					result['Niveau'] = link['Niveau']
					.sort(function(a,b) {
						return (a.prefix<b.prefix ? -1 : 1);
					})
					.map(function(ni) {
						return {
							'@id': baseIdURL + ni.id,
							'title': ni.title,
							'@references': niveauURL + ni.id + '/'
						}
					});
				} else {
					result[key] = jsonLDList(link[key]).sort();
				}
			} else {
				result[key] = link[key];
			}
		});
		return result;
	});
	if (meta) {
		meta.data = list;
		meta['@isPartOf'] = baseDatasetURL;
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
	
	console.log('uuid/:id');
	 graphQuery("Id", req.params)
	.then(function(result) {
		for (i in result.data) {
			if (result.data[i] && result.data[i].length) {
				result = result.data[i][0];
				entitytype = i.replace(/^all/, '');
				switch(entitytype) {
					case "LpibVakleergebied":
					case "LpibVakkern":
					case "LpibVaksubkern":
					case "LpibVakinhoud":
						schema = lpibSchemaURL;
					break;
					case "LdkVakleergebied":
					case "LdkVakkern":
					case "LdkVaksubkern":
					case "LdkVakinhoud":
						schema = leerdoelkaartSchemaURL;
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
					case 'ExamenprogrammaBgProfiel':
					case 'ExamenprogrammaBgKern':
					case 'ExamenprogrammaBgKerndeel':
					case 'ExamenprogrammaBgGlobaleEindterm':
					case 'ExamenprogrammaBgModule':
					case 'ExamenprogrammaBgKeuzevak':
					case 'ExamenprogrammaBgDeeltaak':
					case 'ExamenprogrammaBgModuletaak':
					case 'ExamenprogrammaBgKeuzevaktaak':
						schema = examenprogrammaBgSchemaURL;
					break;
					case 'Syllabus':
					case 'SyllabusSpecifiekeEindterm':
					case 'SyllabusToelichting':
					case 'SyllabusVakbegrip':
						schema = syllabusSchemaURL;
					break;
					case 'InhVakleergebied':
					case 'InhInhoudslijn':
					case 'InhCluster':
						schema = inhoudslijnenSchemaURL;
					break;
					case "Vakleergebied":
					default:
						schema = basisSchemaURL;
					break;
				}
				return result;
			}
		}
		throw new Error("404: not found");
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
		if (entitytype=='Vakleergebied') {
			var examenprogramma = [];
			var syllabus = [];
			if (result['ExamenprogrammaVakleergebied']) {
				result['ExamenprogrammaVakleergebied'].forEach(function(vlg) {
					if (vlg['Examenprogramma']) {
						vlg['Examenprogramma'].forEach(function(exp) {
							examenprogramma.push(exp);
							if (exp['Syllabus']) {
								syllabus = syllabus.concat(exp['Syllabus']);
							}
						});
					}
				});
			}
			if (examenprogramma.length) {
				result['Examenprogramma'] = examenprogramma;
			}
			if (syllabus.length) {
				result['Syllabus'] = syllabus;
			}
		}
		return result;
	})
	.then(function(result) {
		var json = jsonLD(result, schema, entitytype);
		res.send(json);
	})
	.catch(function(err) {
		var code = err.message.split(':')[0];
		if (!code) {
			code = 501;
		}
		res.status(code).send({ error: code, message: err.message});
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
		res.send(jsonLD(result.data.Deprecated, lpibSchemaURL, 'Deprecated'));
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
		res.send(jsonLDList(result.data.allNiveau, basisSchemaURL, 'Niveau', result.data._allNiveauMeta));
	});
});

app.route(apiBase + 'niveau_vakleergebied').get((req, res) => {
	graphQuery("NiveauVakleergebied", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allNiveau, basisSchemaURL, 'Niveau', result.data._allNiveauMeta));
	});
});

app.route(apiBase + 'niveau/:id').get((req, res) => {
	console.log('niveau/:id');
	graphQuery("NiveauById", req.params)
	.then(function(result) {
		res.send(jsonLD(result.data.Niveau, basisSchemaURL, 'Niveau'));
	});
});

app.route(apiBase + 'doel').get((req, res) => {
	graphQuery("Doel", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allDoel, basisSchemaURL, 'Doel', result.data._allDoelMeta));
	});
});

app.route(apiBase + 'doelniveau').get((req, res) => {
	graphQuery("DoelNiveau", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allDoelniveau, basisSchemaURL, 'DoelNiveau', result.data._allDoelniveauMeta));
	});
});
app.route(apiBase + 'lpib_vakkencluster').get((req, res) => {
	graphQuery("LpibVakkencluster", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allLpibVakkencluster, lpibSchemaURL, null, result.data._allLpibVakkenclusterMeta));
	});
});
app.route(apiBase + 'lpib_leerlijn').get((req, res) => {
	graphQuery("LpibLeerlijn", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allLpibLeerlijn, lpibSchemaURL, null, result.data._allLpibLeerlijnMeta));
	});
});
app.route(apiBase + 'niveau/:id/lpib_vakkencluster').get((req, res) => {
	graphQuery("LpibVakkenclusterByNiveau", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allLpibVakkencluster, lpibSchemaURL, null, result.data._allLpibVakkenclusterMeta));
	});
});
app.route(apiBase + 'vakleergebied').get((req, res) => {
	graphQuery("Vakleergebied", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allVakleergebied, basisSchemaURL, 'Vakleergebied', result.data._allVakleergebiedMeta));
	});
});
app.route(apiBase + 'lpib_vakleergebied').get((req, res) => {
	graphQuery("LpibVakleergebied", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allLpibVakleergebied, lpibSchemaURL, 'LpibVakleergebied', result.data._allLpibVakleergebiedMeta));
	});
});

app.route(apiBase + 'lpib_vakkern').get((req, res) => {
	graphQuery("LpibVakkern", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allLpibVakkern, lpibSchemaURL, 'LpibVakkern', result.data._allLpibVakkernMeta));
	});
});

app.route(apiBase + 'lpib_vaksubkern').get((req, res) => {
	graphQuery("LpibVaksubkern", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allLpibVaksubkern, lpibSchemaURL, 'LpibVaksubkern', result.data._allLpibVaksubkernMeta));
	});
});

app.route(apiBase + 'lpib_vakinhoud').get((req, res) => {
	graphQuery("LpibVakinhoud", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allLpibVakinhoud, lpibSchemaURL, 'LpibVakinhoud', result.data._allLpibVakinhoudMeta));
	});
});

app.route(apiBase + 'ldk_vakleergebied').get((req, res) => {
	graphQuery("LdkVakleergebied", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allLdkVakleergebied, null, null, result.data._allLdkVakleergebiedMeta));
	});
});
app.route(apiBase + 'ldk_vakkern').get((req, res) => {
	graphQuery("LdkVakkern", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allLdkVakkern, null, null, result.data._allLdkVakkernMeta));
	});
});
app.route(apiBase + 'ldk_vaksubkern').get((req, res) => {
	graphQuery("LdkVaksubkern", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allLdkVaksubkern, null, null, result.data._allLdkVaksubkernMeta));
	});
});
app.route(apiBase + 'ldk_vakinhoud').get((req, res) => {
	graphQuery("LdkVakinhoud", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allLdkVakinhoud, null, null, result.data._allLdkVakinhoudMeta));
	});
});

app.route(apiBase + 'kerndoel').get((req, res) => {
	graphQuery("Kerndoel", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allKerndoel, kerndoelSchemaURL, 'Kerndoel', result.data._allKerndoelMeta));
	});
});

app.route(apiBase + 'kerndoel_domein').get((req, res) => {
	graphQuery("KerndoelDomein", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allKerndoelDomein, kerndoelSchemaURL, 'KerndoelDomein', result.data._allKerndoelDomeinMeta));
	});
});
app.route(apiBase + 'kerndoel_vakleergebied').get((req, res) => {
	graphQuery("KerndoelVakleergebied", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allKerndoelVakleergebied, kerndoelSchemaURL, 'KerndoelVakleergebied', result.data._allKerndoelVakleergebiedMeta));
	});
});
app.route(apiBase + 'kerndoel_uitstroomprofiel').get((req, res) => {
	graphQuery("KerndoelUitstroomprofiel", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allKerndoelUitstroomprofiel, kerndoelSchemaURL, 'KerndoelUitstroomprofiel', result.data._allKerndoelUitstroomprofielMeta));
	});
});

app.route(apiBase + 'examenprogramma_vakleergebied').get((req, res) => {
	graphQuery("ExamenprogrammaVakleergebied", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaVakleergebied, examenprogrammaSchemaURL, 'ExamenprogrammaVakleergebied', result.data._allExamenprogrammaVakleergebiedMeta));
	});
});
app.route(apiBase + 'examenprogramma').get((req, res) => {
	graphQuery("Examenprogramma", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogramma, examenprogrammaSchemaURL, 'Examenprogramma', result.data._allExamenprogrammaMeta));
	});
});
app.route(apiBase + 'examenprogramma/:id').get((req, res) => {
	graphQuery("ExamenprogrammaVolledig", req.params, req.query)
	.then(function(result) {
		res.send(jsonLD(result.data.Examenprogramma, examenprogrammaSchemaURL, 'Examenprogramma'));
	});
});
app.route(apiBase + 'examenprogramma_domein').get((req, res) => {
	graphQuery("ExamenprogrammaDomein", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaDomein, examenprogrammaSchemaURL, 'ExamenprogrammaDomein', result.data._allExamenprogrammaDomeinMeta));
	});
});
app.route(apiBase + 'examenprogramma_subdomein').get((req, res) => {
	graphQuery("ExamenprogrammaSubdomein", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaSubdomein, examenprogrammaSchemaURL, 'ExamenprogrammaSubdomein', result.data._allExamenprogrammaSubdomeinMeta));
	});
});
app.route(apiBase + 'examenprogramma_eindterm').get((req, res) => {
	graphQuery("ExamenprogrammaEindterm", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaEindterm, examenprogrammaSchemaURL, 'ExamenprogrammaEindterm', result.data._allExamenprogrammaEindtermMeta));
	});
});
app.route(apiBase + 'examenprogramma_kop1').get((req, res) => {
	graphQuery("ExamenprogrammaKop1", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaKop1, examenprogrammaSchemaURL, 'ExamenprogrammaKop1', result.data._allExamenprogrammaKop1Meta));
	});
});
app.route(apiBase + 'examenprogramma_kop2').get((req, res) => {
	graphQuery("ExamenprogrammaKop2", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaKop2, examenprogrammaSchemaURL, 'ExamenprogrammaKop2', result.data._allExamenprogrammaKop2Meta));
	});
});
app.route(apiBase + 'examenprogramma_kop3').get((req, res) => {
	graphQuery("ExamenprogrammaKop3", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaKop3, examenprogrammaSchemaURL, 'ExamenprogrammaKop3', result.data._allExamenprogrammaKop3Meta));
	});
});
app.route(apiBase + 'examenprogramma_kop4').get((req, res) => {
	graphQuery("ExamenprogrammaKop4", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaKop4, examenprogrammaSchemaURL, 'ExamenprogrammaKop4', result.data._allExamenprogrammaKop4Meta));
	});
});
app.route(apiBase + 'examenprogramma_body').get((req, res) => {
	graphQuery("ExamenprogrammaBody", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaBody, examenprogrammaSchemaURL, 'ExamenprogrammaBody', result.data._allExamenprogrammaBodyMeta));
	});
});

app.route(apiBase + 'examenprogramma_bg_profiel').get((req, res) => {
	graphQuery("ExamenprogrammaBgProfiel", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaBgProfiel, examenprogrammaBgSchemaURL, 'ExamenprogrammaBgProfiel', result.data._allExamenprogrammaBgProfielMeta));
	});
});
app.route(apiBase + 'examenprogramma_bg_kern').get((req, res) => {
	graphQuery("ExamenprogrammaBgKern", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaBgKern, examenprogrammaBgSchemaURL, 'ExamenprogrammaBgKern', result.data._allExamenprogrammaBgKernMeta));
	});
});
app.route(apiBase + 'examenprogramma_bg_kerndeel').get((req, res) => {
	graphQuery("ExamenprogrammaBgKerndeel", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaBgKerndeel, examenprogrammaBgSchemaURL, 'ExamenprogrammaBgKerndeel', result.data._allExamenprogrammaBgKerndeelMeta));
	});
});
app.route(apiBase + 'examenprogramma_bg_globale_eindterm').get((req, res) => {
	graphQuery("ExamenprogrammaBgGlobaleEindterm", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaBgGlobaleEindterm, examenprogrammaBgSchemaURL, 'ExamenprogrammaBgGlobaleEindterm', result.data._allExamenprogrammaBgGlobaleEindtermMeta));
	});
});
app.route(apiBase + 'examenprogramma_bg_module').get((req, res) => {
	graphQuery("ExamenprogrammaBgModule", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaBgModule, examenprogrammaBgSchemaURL, 'ExamenprogrammaBgModule', result.data._allExamenprogrammaBgModuleMeta));
	});
});
app.route(apiBase + 'examenprogramma_bg_keuzevak').get((req, res) => {
	graphQuery("ExamenprogrammaBgKeuzevak", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaBgKeuzevak, examenprogrammaBgSchemaURL, 'ExamenprogrammaBgKeuzevak', result.data._allExamenprogrammaBgKeuzevakMeta));
	});
});
app.route(apiBase + 'examenprogramma_bg_deeltaak').get((req, res) => {
	graphQuery("ExamenprogrammaBgDeeltaak", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaBgDeeltaak, examenprogrammaBgSchemaURL, 'ExamenprogrammaBgDeeltaak', result.data._allExamenprogrammaBgDeeltaakMeta));
	});
});
app.route(apiBase + 'examenprogramma_bg_moduletaak').get((req, res) => {
	graphQuery("ExamenprogrammaBgModuletaak", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaBgModuletaak, examenprogrammaBgSchemaURL, 'ExamenprogrammaBgModuletaak', result.data._allExamenprogrammaBgModuletaakMeta));
	});
});
app.route(apiBase + 'examenprogramma_bg_keuzevaktaak').get((req, res) => {
	graphQuery("ExamenprogrammaBgKeuzevaktaak", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allExamenprogrammaBgKeuzevaktaak, examenprogrammaBgSchemaURL, 'ExamenprogrammaBgKeuzevaktaak', result.data._allExamenprogrammaBgKeuzevaktaakMeta));
	});
});

app.route(apiBase + 'syllabus').get((req, res) => {
	graphQuery("Syllabus", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allSyllabus, syllabusSchemaURL, 'Syllabus', result.data._allSyllabusMeta));
	});
});

app.route(apiBase + 'syllabus/:id').get((req, res) => {
	graphQuery("SyllabusVolledig", req.params, req.query)
	.then(function(result) {
		res.send(jsonLD(result.data.Syllabus, syllabusSchemaURL, 'Syllabus'));
	});
});

app.route(apiBase + 'syllabus_toelichting').get((req, res) => {
	graphQuery("SyllabusToelichting", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allSyllabusToelichting, syllabusSchemaURL, 'SyllabusToelichting', result.data._allSyllabusToelichtingMeta));
	});
});
app.route(apiBase + 'syllabus_specifieke_eindterm').get((req, res) => {
	graphQuery("SyllabusSpecifiekeEindterm", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allSyllabusSpecifiekeEindterm, syllabusSchemaURL, 'SyllabusSpecifiekeEindterm', result.data._allSyllabusSpecifiekeEindtermMeta));
	});
});
app.route(apiBase + 'syllabus_vakbegrip').get((req, res) => {
	graphQuery("SyllabusVakbegrip", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allSyllabusVakbegrip, syllabusSchemaURL, 'SyllabusVakbegrip', result.data._allSyllabusVakbegripMeta));
	});
});

/* Inhoudslijnen */
app.route(apiBase + 'inh_vakleergebied').get((req, res) => {
	graphQuery("InhVakleergebied", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allInhVakleergebied, inhoudslijnenSchemaURL, 'InhVakleergebied', result.data._allInhVakleergebiedMeta));
	});
});

app.route(apiBase + 'inh_inhoudslijn').get((req, res) => {
	graphQuery("InhInhoudslijn", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allInhInhoudslijn, inhoudslijnenSchemaURL, 'InhInhoudslijn', result.data._allInhInhoudslijnMeta));
	});
});

app.route(apiBase + 'inh_cluster').get((req, res) => {
	graphQuery("InhCluster", req.params, req.query)
	.then(function(result) {
		res.send(jsonLDList(result.data.allInhCluster, inhoudslijnenSchemaURL, 'InhCluster', result.data._allInhClusterMeta));
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
		res.send(jsonLD(result.data.Doel, basisSchemaURL, 'Doel'));
	});
});

app.route(apiBase + 'niveau/:niveau/kerndoel').get((req, res) => {
	graphQuery("KerndoelOpNiveau", req.params)
	.then(function(result) {
		res.send(jsonLD(result.data.allNiveauIndex[0].Kerndoel, basisSchemaURL, 'Kerndoel'));
	});
});

app.route(apiBase + 'niveau/:niveau/kerndoel/:id').get((req, res) => {
	graphQuery("KerndoelOpNiveauById", req.params)
	.then(function(result) {
		res.send(jsonLD(result.data.Kerndoel, basisSchemaURL, 'Kerndoel'));
	});
});

app.route(apiBase + 'niveau/:niveau/vakleergebied').get((req, res) => {
	graphQuery("VakleergebiedOpNiveau", req.params)
	.then(function(result) {
		res.send(jsonLDList(result.data.allNiveau[0].Vakleergebied));
	});
});

app.route(apiBase + 'niveau/:niveau/vakleergebied/:id').get((req, res) => {
	graphQuery("VakleergebiedByIdOpNiveau", req.params)
	.then(function(result) {
		var vak = result.data.allNiveau[0].Vakleergebied[0];
		delete result.data.allNiveau[0].Vakleergebied;
		vak.LpibVakkern = result.data.allNiveauIndex[0].LpibVakkern;
		delete result.data.allNiveauIndex[0];
		vak.Niveau  = result.data.allNiveau;
		res.send(jsonLD(vak, lpibSchemaURL, 'Vakleergebied'));
	});
});

app.route(apiBase + 'niveau/:niveau/lpib_vakleergebied').get((req, res) => {
	graphQuery("LpibVakleergebiedOpNiveau", req.params)
	.then(function(result) {
		res.send(jsonLDList(result.data.allNiveau[0].LpibVakleergebied));
	});
});

app.route(apiBase + 'niveau/:niveau/lpib_vakleergebied/:id').get((req, res) => {
	graphQuery("LpibVakleergebiedByIdOpNiveau", req.params)
	.then(function(result) {
		var vak = result.data.allNiveau[0].LpibVakleergebied[0];
		delete result.data.allNiveau[0].LpibVakleergebied;
		vak.LpibVakkern = result.data.allNiveauIndex[0].LpibVakkern;
		delete result.data.allNiveauIndex[0];
		vak.Niveau  = result.data.allNiveau;
		res.send(jsonLD(vak, lpibSchemaURL, 'LpibVakleergebied'));
	});
});

app.route(apiBase + 'niveau/:niveau/ldk_vakleergebied').get((req, res) => {
	graphQuery("LdkVakleergebiedOpNiveau", req.params)
	.then(function(result) {
		res.send(jsonLDList(result.data.allNiveauIndex[0].LdkVakleergebied));
	});
});

app.route(apiBase + 'niveau/:niveau/ldk_vakleergebied/:id').get((req, res) => {
	graphQuery("LdkVakleergebiedByIdOpNiveau", req.params)
	.then(function(result) {
		result.data.allNiveauIndex[0].LdkVakleergebied[0].LdkVakkern = result.data.allNiveauIndex[0].LdkVakkern;
		result.data.allNiveauIndex[0].LdkVakleergebied[0].Niveau = result.data.allNiveauIndex[0].Niveau;
		res.send(jsonLD(result.data.allNiveauIndex[0].LdkVakleergebied[0], leerdoelkaartSchemaURL, 'LdkVakleergebied'));
	});
});

function FilterEmptyDoelniveau(ent) {
    var found = false;
    ['LpibVakkern','LpibVaksubkern','LpibVakinhoud'].forEach(function(type) {
        if (ent[type]) {
            ent[type] = ent[type].filter(FilterEmptyDoelniveau);
            if (!ent[type].length) {
                delete ent[type];
            } else {
                found = true;
            }
        }
    });
    if (ent.Doelniveau && ent.Doelniveau.length) {
        found = true;
    }
    return found;
}

app.route(apiBase + 'niveau/:niveau/lpib_vakleergebied/:id/doelen').get(cache(), (req, res) => {
    graphQuery('DoelenOpNiveauByLpibVakleergebiedById', req.params)
    .then(function(result) {
        result.data.LpibVakleergebied.Niveau = result.data.LpibVakleergebied.Niveau[0];
        FilterEmptyDoelniveau(result.data.LpibVakleergebied);
        res.send(jsonLD(result.data.LpibVakleergebied, lpibSchemaURL, 'LpibVakleergebied'));
    });
});

app.route(apiBase + 'niveau/:niveau/lpib_vakkern').get((req, res) => {
	graphQuery("LpibVakkernOpNiveau", req.params)
	.then(function(result) {
		res.send(jsonLDList(result.data.allNiveauIndex[0].LpibVakkern));
	});
});

app.route(apiBase + 'niveau/:niveau/lpib_vakkern/:id').get((req, res) => {
	graphQuery("LpibVakkernByIdOpNiveau", req.params)
	.then(function(result) {
		result.data.allNiveauIndex[0].LpibVakkern[0].LpibVaksubkern = result.data.allNiveauIndex[0].LpibVaksubkern;
		result.data.allNiveauIndex[0].LpibVakkern[0].Niveau = result.data.allNiveauIndex[0].Niveau;
		res.send(jsonLD(result.data.allNiveauIndex[0].LpibVakkern[0], lpibSchemaURL, 'LpibVakkern'));
	});
});

app.route(apiBase + 'niveau/:niveau/ldk_vakkern').get((req, res) => {
	graphQuery("LdkVakkernOpNiveau", req.params)
	.then(function(result) {
		res.send(jsonLDList(result.data.allNiveauIndex[0].LdkVakkern));
	});
});

app.route(apiBase + 'niveau/:niveau/ldk_vakkern/:id').get((req, res) => {
	graphQuery("LdkVakkernByIdOpNiveau", req.params)
	.then(function(result) {
		result.data.allNiveauIndex[0].LdkVakkern[0].LdkVaksubkern = result.data.allNiveauIndex[0].LdkVaksubkern;
		result.data.allNiveauIndex[0].LdkVakkern[0].Niveau = result.data.allNiveauIndex[0].Niveau;
		res.send(jsonLD(result.data.allNiveauIndex[0].LdkVakkern[0], leerdoelkaartSchemaURL, 'LdkVakkern'));
	});
});


app.route(apiBase + 'niveau/:niveau/lpib_vaksubkern').get((req, res) => {
	graphQuery("LpibVaksubkernOpNiveau", req.params)
	.then(function(result) {
		res.send(jsonLDList(result.data.allNiveauIndex[0].LpibVaksubkern));
	});
});

app.route(apiBase + 'niveau/:niveau/lpib_vaksubkern/:id').get((req, res) => {
	graphQuery("LpibVaksubkernByIdOpNiveau", req.params)
	.then(function(result) {
		result.data.allNiveauIndex[0].LpibVaksubkern[0].LpibVakinhoud = result.data.allNiveauIndex[0].LpibVakinhoud;
		result.data.allNiveauIndex[0].LpibVaksubkern[0].Niveau = result.data.allNiveauIndex[0].Niveau;
		res.send(jsonLD(result.data.allNiveauIndex[0].LpibVaksubkern[0], lpibSchemaURL, 'LpibVaksubkern'));
	});
});

app.route(apiBase + 'niveau/:niveau/ldk_vaksubkern').get((req, res) => {
	graphQuery("LdkVaksubkernOpNiveau", req.params)
	.then(function(result) {
		res.send(jsonLDList(result.data.allNiveauIndex[0].LdkVaksubkern));
	});
});

app.route(apiBase + 'niveau/:niveau/ldk_vaksubkern/:id').get((req, res) => {
	graphQuery("LdkVaksubkernByIdOpNiveau", req.params)
	.then(function(result) {
		result.data.allNiveauIndex[0].LdkVaksubkern[0].LdkVakinhoud = result.data.allNiveauIndex[0].LdkVakinhoud;
		result.data.allNiveauIndex[0].LdkVaksubkern[0].Niveau = result.data.allNiveauIndex[0].Niveau;
		res.send(jsonLD(result.data.allNiveauIndex[0].LdkVaksubkern[0], leerdoelkaartSchemaURL, 'LdkVaksubkern'));
	});
});

app.route(apiBase + 'niveau/:niveau/lpib_vakinhoud').get((req, res) => {
	graphQuery("LpibVakinhoudOpNiveau", req.params)
	.then(function(result) {
		res.send(jsonLDList(result.data.allNiveauIndex[0].LpibVakinhoud));
	});
});

app.route(apiBase + 'niveau/:niveau/lpib_vakinhoud/:id').get((req, res) => {
	graphQuery("LpibVakinhoudByIdOpNiveau", req.params)
	.then(function(result) {
		result.data.allNiveauIndex[0].LpibVakinhoud[0].Niveau = result.data.allNiveauIndex[0].Niveau;
		res.send(jsonLD(result.data.allNiveauIndex[0].LpibVakinhoud[0], lpibSchemaURL, 'LpibVakinhoud'));
	});
});

app.route(apiBase + 'niveau/:niveau/ldk_vakinhoud').get((req, res) => {
	graphQuery("LdkVakinhoudOpNiveau", req.params)
	.then(function(result) {
		res.send(jsonLDList(result.data.allNiveauIndex[0].LdkVakinhoud));
	});
});

app.route(apiBase + 'niveau/:niveau/ldk_vakinhoud/:id').get((req, res) => {
	graphQuery("LdkVakinhoudByIdOpNiveau", req.params)
	.then(function(result) {
		result.data.allNiveauIndex[0].LdkVakinhoud[0].Niveau = result.data.allNiveauIndex[0].Niveau;
		res.send(jsonLD(result.data.allNiveauIndex[0].LdkVakinhoud[0], leerdoelkaartSchemaURL, 'LdkVakinhoud'));
	});
});

app.route(apiBase + 'niveau/:niveau/kerndoel_vakleergebied').get((req, res) => {
	graphQuery("KerndoelVakleergebiedOpNiveau", req.params)
	.then(function(result) {
		res.send(jsonLDList(result.data.allNiveauIndex[0].KerndoelVakleergebied));
	});
});

app.route(apiBase + 'niveau/:niveau/kerndoel_vakleergebied/:id').get(cache(), (req, res) => {
	graphQuery("KerndoelVakleergebiedByIdOpNiveau", req.params)
	.then(function(result) {
		result.data.allNiveauIndex[0].KerndoelVakleergebied[0].KerndoelDomein = result.data.allNiveauIndex[0].KerndoelDomein;
		result.data.allNiveauIndex[0].KerndoelVakleergebied[0].Kerndoel = result.data.allNiveauIndex[0].Kerndoel;
		result.data.allNiveauIndex[0].KerndoelVakleergebied[0].Niveau = result.data.allNiveauIndex[0].Niveau;
		res.send(jsonLD(result.data.allNiveauIndex[0].KerndoelVakleergebied[0], kerndoelSchemaURL, 'KerndoelVakleergebied'));
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

app.route(apiBase+"legacy/vak/:vak/vakkern/:lpib_vakkern/").get((req, res) => {
	var vak = req.params.vak;
	var lpib_vakkern = req.params.lpib_vakkern;
	var idIndex = {};

	getAllVersions([vak,lpib_vakkern])
	.then(function(results) {
		results.forEach(function(entity) {
			idIndex[entity.id] = entity;
		});
		return idIndex;
	})		
	.then(function(idIndex) {
		var vakken = walkReplacedBy(idIndex, [vak]);
		var lpib_vakkernen = walkReplacedBy(idIndex, [lpib_vakkern]);
		var matchingVakkernen = lpib_vakkernen.filter(function(entry) {
			var matchingVakken = vakken.filter(function(vakEntry) {
				return hasId(vakEntry.LpibVakkern, entry.id);
			});
			return matchingVakken.length>0;
		});
		if (matchingVakkernen.length) {
			res.send(jsonLDList(matchingVakkernen, null, null, {count: lpib_vakkernen.length}));
		} else {
			res.send(jsonLDList(lpib_vakkernen,null,null,{error: 'not found'}));
		}
	});
});

app.route(apiBase+"legacy/vak/:vak/vakkern/:lpib_vakkern/vaksubkern/:lpib_vaksubkern").get((req, res) => {
	var vak = req.params.vak;
	var lpib_vakkern = req.params.lpib_vakkern;
	var lpib_vaksubkern = req.params.lpib_vaksubkern;
	var idIndex = {};

	getAllVersions([vak, lpib_vakkern, lpib_vaksubkern])
	.then(function(results) {
		results.forEach(function(entry) {
			idIndex[entry.id] = entry;
		});

		return idIndex;
	}).then(function(idIndex) {

		var lpib_vaksubkernen = walkReplacedBy(idIndex, [lpib_vaksubkern]);
		var lpib_vakkernen    = walkReplacedBy(idIndex, [lpib_vakkern]);
		var vakken       = walkReplacedBy(idIndex, [vak]);

		lpib_vakkernen = lpib_vakkernen.filter(function(entry) {
			var matchingVakken = vakken.filter(function(vakEntry) {
				return hasId(vakEntry.LpibVakkern, entry.id);
			});
			return matchingVakken.length>0;
		});
		
		var matchingVaksubkernen = lpib_vaksubkernen.filter(function(entry) {
			var matchingVakkernen = lpib_vakkernen.filter(function(lpib_vakkernEntry) {
				return hasId(lpib_vakkernEntry.LpibVaksubkern, entry.id);
			});
			return matchingVakkernen.length>0;
		});
		if (matchingVaksubkernen.length) {
			res.send(jsonLDList(matchingVaksubkernen, null, null, {count: lpib_vaksubkernen.length}));
		} else {
			res.send(jsonLDList(lpib_vaksubkernen,null,null,{error: 'not found'}));
		}
	});

});

app.route(apiBase+"legacy/vak/:vak/vakkern/:lpib_vakkern/vaksubkern/:lpib_vaksubkern/vakinhoud/:lpib_vakinhoud").get((req, res) => {
	var vak = req.params.vak;
	var lpib_vakkern = req.params.lpib_vakkern;
	var lpib_vaksubkern = req.params.lpib_vaksubkern;
	var lpib_vakinhoud = req.params.lpib_vakinhoud;
	var idIndex = {};

	getAllVersions([vak, lpib_vakkern, lpib_vaksubkern, lpib_vakinhoud])
	.then(function(results) {
		results.forEach(function(entry) {
			idIndex[entry.id] = entry;
		});

		return idIndex;
	}).then(function(idIndex) {

		var lpib_vakinhouden  = walkReplacedBy(idIndex, [lpib_vakinhoud]);
		var lpib_vaksubkernen = walkReplacedBy(idIndex, [lpib_vaksubkern]);
		var lpib_vakkernen    = walkReplacedBy(idIndex, [lpib_vakkern]);
		var vakken       = walkReplacedBy(idIndex, [vak]);
		
		lpib_vakkernen = lpib_vakkernen.filter(function(entry) {
			var matchingVakken = vakken.filter(function(vakEntry) {
				return hasId(vakEntry.LpibVakkern, entry.id);
			});
			return matchingVakken.length>0;
		});
		
		lpib_vaksubkernen = lpib_vaksubkernen.filter(function(entry) {
			var matchingVakkernen = lpib_vakkernen.filter(function(lpib_vakkernEntry) {
				return hasId(lpib_vakkernEntry.LpibVaksubkern, entry.id);
			});
			return matchingVakkernen.length>0;
		});
		
		var matchingLpibVakinhouden = lpib_vakinhouden.filter(function(entry) {
			var matchingVaksubkernen = lpib_vaksubkernen.filter(function(lpib_vaksubkernEntry) {
				return hasId(lpib_vaksubkernEntry.LpibVakinhoud, entry.id);
			});
			return matchingVaksubkernen.length>0;
		});
		
		if (matchingLpibVakinhouden.length) {
			res.send(jsonLDList(matchingLpibVakinhouden, null, null, {count: lpib_vakinhouden.length}));
		} else {
			res.send(jsonLDList(lpib_vakinhouden,null,null,{error: 'not found'}));
		}
	});

});

app.route(apiBase + 'register/').get((req, res) => {
    console.log("Register user " + req.param.email);
});

// old names redirect to the new names
app.route(apiBase + 'vakkern/*').get((req,res) => {
	res.redirect(apiBase + 'lpib_vakkern/' + req.params[0] ? req.params[0] : '');
});
app.route(apiBase + 'vaksubkern/*').get((req,res) => {
	res.redirect(apiBase + 'lpib_vaksubkern/' + req.params[0] ? req.params[0] : '');
});
app.route(apiBase + 'vakinhoud/*').get((req,res) => {
	res.redirect(apiBase + 'lpib_vakinhoud/' + req.params[0] ? req.params[0] : '');
});
app.route(apiBase + 'leerlijn/*').get((req,res) => {
	res.redirect(apiBase + 'lpib_leerlijn/' + req.params[0] ? req.params[0] : '');
});
app.route(apiBase + 'vakkencluster/*').get((req,res) => {
	res.redirect(apiBase + 'lpib_vakkencluster/' + req.params[0] ? req.params[0] : '');
});
app.route(apiBase + 'niveau/:niveau/vakkern/*').get((req, res) => {
	res.redirect(apiBase + 'niveau/'+ req.params.niveau + '/lpib_vakkern/' + req.params[0] ? req.params[0] : '');
});
app.route(apiBase + 'niveau/:niveau/vaksubkern/*').get((req, res) => {
	res.redirect(apiBase + 'niveau/'+ req.params.niveau + '/lpib_vaksubkern/' + req.params[0] ? req.params[0] : '');
});
app.route(apiBase + 'niveau/:niveau/vakinhoud/*').get((req, res) => {
	res.redirect(apiBase + 'niveau/'+ req.params.niveau + '/lpib_vakinhoud/' + req.params[0] ? req.params[0] : '');
});
app.route(apiBase + 'niveau/:niveau/vak/:id/doelen').get((req,res) => {
	res.redirect(apiBase + 'niveau/'+ req.params.niveau + '/lpib_vakleergebied/' + req.params.id + '/doelen');	
});
app.route(apiBase + 'niveau/:niveau/vakkencluster/*').get((req, res) => {
	res.redirect(apiBase + 'niveau/'+ req.params.niveau + '/lpib_vakkencluster/' + req.params[0] ? req.params[0] : '');
});
app.route(apiBase + 'niveau/:niveau/vak/*').get((req,res) => {
	res.redirect(apiBase + 'niveau/'+ req.params.niveau + '/vakleergebied/' + req.params[0] ? req.params[0] : '');
});
app.route(apiBase + 'niveau/:niveau/kerndoelvakleergebied/*').get((req, res) => {
	res.redirect(apiBase + 'niveau/'+ req.params.niveau + '/kerndoel_vakleergebied/' + req.params[0] ? req.params[0] : '');
});
// add routes above this line
app.route('*').get((req,res) => {
	res.status(404).send(notfound);
});


app.listen(port, () => console.log(`API server listening on port ${port}!`));