const express   = require('express');
const basicAuth = require('express-basic-auth')
const watch     = require('watch');
const fs        = require('fs');
const path      = require('path');
const url       = require('url');
const { v4: uuidv4 } = require('uuid');
const mcache    = require('memory-cache');
const request = require("request-promise-native");
const opendata  = require('./opendata-api.js');
global.opendata = opendata;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.NODE_SENDGRID_API_KEY);

const app       = express();
const port      = process.env.NODE_PORT || 4800;
const apiBase   = process.env.NODE_BASE || "https://opendata.slo.nl/curriculum/2022/api/";
const baseIdURL = process.env.NODE_ID_URL || "https://opendata.slo.nl/curriculum/uuid/";
const graphqlUrl= process.env.NODE_BACKEND_URL || "http://localhost:3500";
const searchUrl = process.env.NODE_SEARCH_URL || "http://localhost:3501";
const baseDatasetURL = process.env.NODE_DATA_URL || 'https://opendata.slo.nl/curriculum/api-acpt/v1/';
const baseDatasetPath = url.parse(baseDatasetURL).pathname;
opendata.url    = graphqlUrl;

//const baseDatasetURL  = 'https://curriculum-rest-api.dev.muze.nl/curriculum/api-acpt/v1/'; //2019/';
//const backendUrl      = 'https://opendata.slo.nl:3500';

const niveauURL       = baseDatasetURL + "niveau/";
const notfound        = { error: "not found"};

var cache = function() {
	return (req, res, next) => {
		let key = '__express__' + req.originalUrl || req.url
		let cachedBody = mcache.get(key)
		if (cachedBody) {
			res.send(cachedBody)
			return
		} else {
//			console.log("cache miss for " + key);
			res.sendResponse = res.send
			res.send = (body) => {
				if (!res.statusCode>=200 && res.statusCode<400) { // response is ok
					// mcache.put(key, body, duration * 1000);
					mcache.put(key, body);
				}
				res.sendResponse(body)
			}
			next()
		}
	}
};

app.use(express.static(process.cwd()+'/www'))

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Origin', req.headers.origin ? req.headers.origin : '*');
	res.header('Access-Control-Allow-Headers','Authorization');
	if ('OPTIONS' == req.method) {
		res.sendStatus(200);
		return;
	} else if (req.accepts('html')) {
		res.set('Content-Type', 'text/html');
		let filePath = path.join(__dirname, '../data-browser/', 'index.html');
		let file = fs.readFileSync(filePath, 'utf8');
		process.env.NODE_PORT = port;
		process.env.NODE_BASE = apiBase;	
		process.env.NODE_ID_URL = baseIdURL;
//		process.env.NODE_BACKEND_URL = backendUrl;
		process.env.NODE_DATA_URL = baseDatasetURL;
		file = file.replace(/\{@(.*)\}/gm, (match, p1) => process.env[p1] || '');
		res.send(file);
		return;
	}
	next();
});


app.route('/' + 'register/').get((req) => {
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
	monitor.on('changed', function() { 
		readKeys();
	});
});

function sendApiKey(email, key) {
	var mail = {
		from: {
		email: "opendata@slo.nl",
		name: "SLO Opendata",
	  },
	  to: {
	  	email: email
	  },
	  subject: "SLO Opendata API Key",
	  content: [
	  	{
	  		type: "text/html",
	  		value: "<p>Bedankt voor het registreren op opendata.slo.nl. Je API key is:<br><b>" + key + "</p>",
	      	},
	    ],
	}
	sgMail.send(mail)
	.then(function (response) {
	    console.log(response[0].statusCode);
	    console.log(response[0].headers);
	    console.log("api key mail sent");
	})
	.catch(function (error) {
	    console.log(error);
	});  
}

readKeys();

function jsonLD(entry, schema, type) {
	if (!entry || !entry.id) {
		return entry;
	}
	var result = {
		'@id': baseIdURL + entry.id,
		'@isPartOf': baseDatasetURL,
		'@references': baseDatasetURL + 'uuid/'+entry.id,
		'uuid': entry.id
	};
	if (schema) {
		result['@context'] = schema;
	}
	if (type) {
		result['@type'] = type;
	}

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
		'Syllabus','SyllabusVakleergebied','SyllabusSpecifiekeEindterm','SyllabusToelichting','SyllabusVakbegrip',
		'InhVakleergebied', 'InhInhoudslijn', 'InhCluster',
		'RefVakleergebied', 'RefDomein', 'RefSubdomein', 'RefOnderwerp', 'RefDeelonderwerp', 'RefTekstkenmerk',
		'ErkVakleergebied', 'ErkGebied', 'ErkCategorie', 'ErkTaalactiviteit', 'ErkSchaal', 'ErkCandobeschrijving', 'ErkVoorbeeld', 'ErkLesidee',
		'NhCategorie', 'NhSector', 'NhSchoolsoort', 'NhLeerweg', 'NhBouw', 'NhNiveau',
		'FoDomein', 'FoSubomein', 'FoDoelzin', 'FoToelichting', 'FoUitwerking',
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
			let vakleergebiedList = {
				'LpibVakleergebied': 'vakleergebied',
				'LdkVakleergebied': 'ldk_vakleergebied',
				'KerndoelVakleergebied': 'kerndoel_vakleergebied',
				'InhVakleergebied': 'inh_vakleergebied',
				'RefVakleergebied': 'ref_vakleergebied',
				'ErkVakleergebied': 'erk_vakleergebied',
				'SyllabusVakleergebied': 'syllabus_vakleergebied'
			};
			Object.keys(vakleergebiedList).forEach(vlg => {
				if (entry['NiveauIndex'][0] && entry['NiveauIndex'][0][vlg]) {
					result[vlg] = entry['NiveauIndex'][0][vlg].map(function(link) {
						return {
							'@id': baseIdURL + link.id,
							'title': link.title,
							'$ref': niveauURL + result.uuid + vakleergebiedList[vlg] + link.id
						}
					});
				}
			});
		} else {
			var urlType = '';
			if (type) {
				if (type.substr(0,3)=='Ldk') {
					urlType = 'ldk_'+type.substr(3).toLowerCase();
				} else if (type.substr(0,4)=='Lpib') {
					urlType = 'lpib_'+type.substr(4).toLowerCase();
				} else if (type.substr(0,3)=='Inh') {
					urlType = 'inh_'+type.substr(4).toLowerCase();
				} else if (type.substr(0,3)=='Ref') {
					urlType = 'ref_'+type.substr(4).toLowerCase();
				} else {
					urlType = type.toLowerCase();
				}
			}

			result['Niveau'] = entry['NiveauIndex']
			.sort(function(a,b) {
				return (a.Niveau[0].prefix<b.Niveau[0].prefix ? -1 : 1);
			})
			.map(function(ni) {
				let niveau = {
					'@id': baseIdURL + ni.Niveau[0].id,
					'title': ni.Niveau[0].title,
					'prefix': ni.Niveau[0].prefix+'-1'
				};
				if (urlType) {
					niveau['$ref'] = niveauURL + ni.Niveau[0].id + '/' + urlType + '/' + result['uuid'];
				}
				return niveau;
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

	list = list.filter(link => {
		if (link.id && parseInt(link.id)<0) {
			meta.count--;
			return false;
		}
		return true;
	})
	.map(function(link) {
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
							'prefix': ni.Niveau[0].prefix,
							'@references': baseDatasetURL + 'uuid/' + ni.Niveau[0].id
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
							'prefix': ni.prefix,
							'@references': baseDatasetURL + 'uuid/' + ni.id //niveauURL + ni.id + '/'
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

Object.keys(opendata.routes).forEach((route) => {
	console.log('adding my route '+route);
	app.route('/' + route)
	.get(cache(), (req, res) => {
		console.log(route);
		opendata.routes[route](req)
		.then((result) => {
			if (Array.isArray(result.data)) {
				result = jsonLDList(result.data, result.schema, result.type, result.meta)
			} else {
				result = jsonLD(result.data, result.schema, result.type);
			}
			res.send(result);
		})
		.catch((err) => {
			res.setHeader('content-type', 'application/json');
			res.status(500).send({ error: 500, message: err.message });
			console.log(route, err);
		});
	});
});

app.route("/" + "search/").get((req, res) => {
	console.log('search for '+req.query.text)
  request({
    url: searchUrl + "/search?text=" + req.query.text,
  }).then((data) => {
    try {
      data = JSON.parse(data);
      res.setHeader("Content-Type", "application/json");
      res.send(jsonLDList(data));
    } catch (e) {
      res.error(e);
    }
  });
});

app.route('/' + 'uuid/:id').get((req, res) => {
	var schema = null;
	var entitytype = null;

	var getEntity = function(result) {
		for (var i in result.data) {
			if (result.data[i].length) {
				return result.data[i][0];
			}
		}
	};
	
	console.log('uuid/:id');
	opendata.api.Id(req.params)
	.then(function(result) {
		for (var i in result.data) {
			if (result.data[i] && result.data[i].length) {
				result = result.data[i][0];
				entitytype = i.replace(/^all/, '');
				switch(entitytype) {
					case "LpibVakleergebied":
					case "LpibVakkern":
					case "LpibVaksubkern":
					case "LpibVakinhoud":
						schema = opendata.schemas.lpib;
					break;
					case "LdkVakleergebied":
					case "LdkVakkern":
					case "LdkVaksubkern":
					case "LdkVakinhoud":
						schema = opendata.schemas.leerdoelenkaarten;
					break;
					case "Kerndoel":
					case "KerndoelDomein":
					case "KerndoelVakleergebied":
					case "KerndoelUitstroomprofiel":
						schema = opendata.schemas.kerndoelen;
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
						schema = opendata.schemas.examenprogramma;
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
						schema = opendata.schemas.examenprogramma_bg;
					break;
					case 'Syllabus':
					case 'SyllabusSpecifiekeEindterm':
					case 'SyllabusToelichting':
					case 'SyllabusVakbegrip':
					case 'SyllabusVakleergebied':
						schema = opendata.schemas.syllabus;
					break;
					case 'InhVakleergebied':
					case 'InhInhoudslijn':
					case 'InhCluster':
						schema = opendata.schemas.inhoudslijnen;
					break;
					case 'RefVakleergebied':
					case 'RefDomein':
					case 'RefSubdomein':
					case 'RefOnderwerp':
					case 'RefDeelonderwerp':
					case 'RefTekstkenmerk':
						schema = opendata.schemas.referentiekader;
					break;
					case 'ErkVakleergebied':
					case 'ErkGebied':
					case 'ErkCategorie':
					case 'ErkTaalactiviteit':
					case 'ErkSchaal':
					case 'ErkCandobeschrijving':
					case 'ErkVoorbeeld':
					case 'ErkLesidee':
						schema = opendata.schemas.erk;
					break;
					case 'NhCategorie':
					case 'NhSector':
					case 'NhSchoolsoort':
					case 'NhLeerweg':
					case 'NhBouw':
					case 'NhNiveau':
						schema = opendata.schemas.niveauhierarchie;
					break;
					case 'FoDomein':
					case 'FoSubomein':
					case 'FoDoelzin':
					case 'FoToelichting':
					case 'FoUitwerking':
						schema = opendata.schemas.fo;
					break;
					case "Vakleergebied":
					default:
						schema = opendata.schemas.basis;
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
				return opendata.api.Id({id: id})
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
				return opendata.api.Id({id: id})
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
		res.send(jsonLD(result, schema, entitytype));
	})
	.catch(function(err) {
		var code = err.message.split(':')[0];
		if (!code) {
			code = 500;
		}
		res.setHeader('content-type', 'application/json');
		res.status(code).send({ error: code, message: err.message});
	});
});



function getById(id) {
	return opendata.api.Id({id: id})
	.then(function(result) {
		if (!result || !result.data) {
			return null;
		}
		for (var i in result.data) {
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

app.route('/'+"legacy/vak/:vak/").get((req, res) => {
	var vak = req.params.vak;
	getLatestVersions([vak])
	.then(function(results) {
		res.send(jsonLDList(results, null, null, {count: results.length}));	
	});
});

app.route('/'+"legacy/vak/:vak/vakkern/:lpib_vakkern/").get((req, res) => {
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

app.route('/'+"legacy/vak/:vak/vakkern/:lpib_vakkern/vaksubkern/:lpib_vaksubkern").get((req, res) => {
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

app.route('/'+"legacy/vak/:vak/vakkern/:lpib_vakkern/vaksubkern/:lpib_vaksubkern/vakinhoud/:lpib_vakinhoud").get((req, res) => {
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

app.route('/' + 'register/').get((req) => {
	console.log("Register user " + req.param.email);
});

// old names redirect to the new names
app.route('/' + 'vakkern/*').get((req,res) => {
	res.redirect(apiBase + 'lpib_vakkern/' + req.params[0] ? req.params[0] : '');
});
app.route('/' + 'vaksubkern/*').get((req,res) => {
	res.redirect(apiBase + 'lpib_vaksubkern/' + req.params[0] ? req.params[0] : '');
});
app.route('/' + 'vakinhoud/*').get((req,res) => {
	res.redirect(apiBase + 'lpib_vakinhoud/' + req.params[0] ? req.params[0] : '');
});
app.route('/' + 'leerlijn/*').get((req,res) => {
	res.redirect(apiBase + 'lpib_leerlijn/' + req.params[0] ? req.params[0] : '');
});
app.route('/' + 'vakkencluster/*').get((req,res) => {
	res.redirect(apiBase + 'lpib_vakkencluster/' + req.params[0] ? req.params[0] : '');
});
app.route('/' + 'niveau/:niveau/vakkern/*').get((req, res) => {
	res.redirect(apiBase + 'niveau/'+ req.params.niveau + '/lpib_vakkern/' + req.params[0] ? req.params[0] : '');
});
app.route('/' + 'niveau/:niveau/vaksubkern/*').get((req, res) => {
	res.redirect(apiBase + 'niveau/'+ req.params.niveau + '/lpib_vaksubkern/' + req.params[0] ? req.params[0] : '');
});
app.route('/' + 'niveau/:niveau/vakinhoud/*').get((req, res) => {
	res.redirect(apiBase + 'niveau/'+ req.params.niveau + '/lpib_vakinhoud/' + req.params[0] ? req.params[0] : '');
});
app.route('/' + 'niveau/:niveau/vak/:id/doelen').get((req,res) => {
	res.redirect(apiBase + 'niveau/'+ req.params.niveau + '/lpib_vakleergebied/' + req.params.id + '/doelen');	
});
app.route('/' + 'niveau/:niveau/vakkencluster/*').get((req, res) => {
	res.redirect(apiBase + 'niveau/'+ req.params.niveau + '/lpib_vakkencluster/' + req.params[0] ? req.params[0] : '');
});
app.route('/' + 'niveau/:niveau/vak/*').get((req,res) => {
	res.redirect(apiBase + 'niveau/'+ req.params.niveau + '/vakleergebied/' + req.params[0] ? req.params[0] : '');
});
app.route('/' + 'niveau/:niveau/kerndoelvakleergebied/*').get((req, res) => {
	res.redirect(apiBase + 'niveau/'+ req.params.niveau + '/kerndoel_vakleergebied/' + req.params[0] ? req.params[0] : '');
});
// add routes above this line
app.route('*').get((req,res) => {
	res.status(404).send(notfound+'('+baseDatasetPath+':'+req.path+')');
});


app.listen(port, () => console.log(`API server listening on port ${port}!`));