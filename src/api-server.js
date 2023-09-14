const express   = require('express');
const basicAuth = require('express-basic-auth')
const watch     = require('watch');
const fs        = require('fs');
const path      = require('path');
const url       = require('url');
const { v4: uuidv4 } = require('uuid');
const opendata  = require('./opendata-api.js');
global.opendata = opendata;

const sgMail = require('@sendgrid/mail');
const { type } = require('os');
sgMail.setApiKey(process.env.NODE_SENDGRID_API_KEY);

const app       = express();
const port      = process.env.NODE_PORT || 4800;
const apiBase   = process.env.NODE_BASE || "https://opendata.slo.nl/curriculum/2022/api/";
const baseIdURL = process.env.NODE_ID_URL || "https://opendata.slo.nl/curriculum/uuid/";
const storeUrl  = process.env.NODE_SIMPLYSTORE_URL || "http://localhost:3500";
const searchUrl = process.env.NODE_SEARCH_URL || "http://localhost:3501";
const baseDatasetURL = process.env.NODE_DATA_URL || 'https://opendata.slo.nl/curriculum/api-acpt/v1/';
const baseDatasetPath = url.parse(baseDatasetURL).pathname;
opendata.url    = storeUrl;

const niveauURL = baseDatasetURL + "niveau/";
const notfound  = { error: "not found"};

app.route('/status/').get((req, res) => {
	console.log('status')
	return request({
		url : opendata.url + '/status/',
		method : "GET"
	}).then(function(body) {
		if (body.errors) {
			throw new Error(body.errors)
		}
		console.log(body)
		res.set('Content-Type', 'application/json')
		res.send(body)
	}).catch(function(error) {
		res.setHeader('content-type', 'application/json');
		res.status(500).send({ error: 500, message: error.message });
		console.log(error)
	})
})

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
		//process.env.NODE_BACKEND_URL = backendUrl;
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

function jsonLD(entry) {
	if (entry.Niveau && Array.isArray(entry.Niveau)) {
		entry.Niveau
		.sort((a,b) => a.prefix<b.prefix ? -1 : 1)
		.map(child => {
			child['$ref'] = niveauURL + child.uuid;
			if (entry['@type']=='Vakleergebied') {
				child['$ref'] += '/vakleergebied/' + entry.uuid;
			}
			return child;
		});
	}
	// add a '@references' tot the entry children
	// this is just some comment to convince git there are changes to commit in a branch
	addReference(entry);
	return entry;
}

function jsonLDList(list, schema, type, meta) {
	return list.map(entity => { entity['@references'] = baseDatasetURL + 'uuid/' + entity.uuid; return entity})
}

function addReference(entry){
	if (Array.isArray(entry)){ 
		entry.forEach(addReference);
	}
	else if(isObject(entry)) { 
		if (entry.uuid) {
			entry['@references'] = baseDatasetURL + 'uuid/' + entry.uuid;
		}
		Object.values(entry).forEach(addReference);	
	};
}

function isObject(value){
	if (value !== null && typeof value == 'object' && typeof value !== 'string' && typeof value !== 'Number' && typeof value !== "Boolean"){
		return true;
	}
	else {
		return false;
	}
}

Object.keys(opendata.routes).forEach((route) => {
	console.log('adding my route '+route);
	app.route('/' + route)
	.get(async (req, res) => {
		console.log(route);
		try {
			let result = await opendata.routes[route](req)
			if (Array.isArray(result.data)) {
				result.data = jsonLDList(result.data);
				result['@isPartOf'] = baseDatasetURL;
			} else {
				result = jsonLD(result);
			} 
			res.send(result);
		} catch(err) {
			res.setHeader('content-type', 'application/json');
			res.status(500).send({ error: 500, message: err.message });
			console.log(route, err);
		}
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

app.route('/' + 'uuid/:id').get(async (req, res) => {
	try {
		let result = await opendata.api.Id(req.params)
		if (!result) {
			res.status(404).send({ error: 404, message: '404: not found' });
		} else {
			res.send(jsonLD(result));
		}
	} catch(err) {
		res.setHeader('content-type', 'application/json');
		res.status(500).send({ error: 500, message: err.message });
		console.log('/uuid/'+req.params.id, err);
	}
});

app.route('/roots/:id').get(async (req,res) => {
	try {
		let result = await opendata.api.Roots(req.params)
		if (!result) {
	  		res.status(404).send({ error: 404, message: '404: not found' });
		} else {
			res.send(jsonLDList(result));
		}
	} catch(err) {
		res.setHeader('content-type', 'application/json');
		res.status(500).send({ error: 500, message: err.message });
		console.log('/roots/'+req.params.id, err);
	}
})

app.route('/tree/:id').get(async (req, res) => {
	try {
		let result = await opendata.api.Tree(req.params, req.query)
		if (!result) {
			res.status(404).send({ error: 404, message: '404: not found' });
		} else {
			addReference(result);
			res.send(jsonLD(result));
		}
	} catch(err) {
		res.setHeader('content-type', 'application/json');
		res.status(500).send({ error: 500, message: err.message });
		console.log('/roots/'+req.params.id, err);
	}
})

async function getById(id) {
	return await opendata.api.Id({id: id})
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


app.route('/' + 'register/').get((req) => {
	console.log("Register user " + req.param.email);
});

// add routes above this line
app.route('*').get((req,res) => {
	res.status(404).send(notfound+'('+baseDatasetPath+':'+req.path+')');
});

app.listen(port, () => console.log(`API server listening on port ${port}!`));