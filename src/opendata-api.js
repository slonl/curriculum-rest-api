const storeQuery = require('./storeQuery.js')
const fs = require('fs')

var opendata = {
	url: '',
	schemas: {},
	fragments: '',
	queries: {},
	typedQueries: {},
	idQuery: '',
	routes: {},
	api: {}
};

var apis = [

	require('./opendata-api/curriculum-basis.js'),
	require('./opendata-api/curriculum-erk.js'),
	require('./opendata-api/curriculum-examenprogramma.js'),
	require('./opendata-api/curriculum-examenprogramma-bg.js'),
	require('./opendata-api/curriculum-inhoudslijnen.js'),
	require('./opendata-api/curriculum-kerndoelen.js'),
	require('./opendata-api/curriculum-leerdoelenkaarten.js'),
	require('./opendata-api/curriculum-niveauhierarchie.js'),
	require('./opendata-api/curriculum-referentiekader.js'),
	require('./opendata-api/curriculum-samenhang.js'),
	require('./opendata-api/curriculum-fo.js'),
	require('./opendata-api/curriculum-syllabus.js')
];

opendata.typedQueries = {}

apis.forEach(api => {
	if (api.fragments) {
		opendata.fragments += ';'+api.fragments;
	}
	if (api.queries) {
		opendata.queries = Object.assign(opendata.queries, api.queries);

		Object.keys(api.queries).forEach(operationName => {
			var query = opendata.queries[operationName];
//			console.log(query); //TODO remove as it is for debugging purposes
			opendata.api[operationName] = (variables, urlQuery) => {

				return storeQuery(opendata.url+'/query/', opendata.fragments +';'+ query, variables, urlQuery)
				.then((result) => {
					result.schema = api.schema;
					return result;
				});
			}
		});
	}
	if (api.typedQueries) {
		for (type in api.typedQueries) {
			opendata.typedQueries[type] = api.typedQueries[type]
		}
	}
	if (api.routes) {
		opendata.routes = Object.assign(opendata.routes, api.routes);
	}
	opendata.schemas[api.context] = api.schema;
});


function camelize(str) {
	return str.replace(/_([a-z])/g, (m, p1) => p1.toUpperCase())
}

opendata.api.Id = async (variables, urlQuery) => {
	let type = await storeQuery(opendata.url+'/query/', `JSONTag.getAttribute(meta.index.id.get('/uuid/${variables.id}'),'class')`)
	let typedQuery = opendata.typedQueries[type]
	if (!typedQuery) {
		console.error('missing typedquery for '+type)
	}
//	console.log(typedQuery); //Todo: remove as it is for debugging purposes
	let result = await storeQuery(opendata.url+'/query/', opendata.fragments +';'+ typedQuery, variables, urlQuery)
	return result
}

opendata.api.Roots = async (variables, urlQuery) => {
	let query = `
from(Index('${variables.id}')?.root)
.select({
	id: _,
	'@type': Type,
	prefix: _,
	title: _
})
`	
	return storeQuery(opendata.url+'/query/', opendata.fragments+';'+query, variables, urlQuery)
}

opendata.api.Schemas = async (variables, urlQuery) => {
	let query = `
data.schema
`
	return storeQuery(opendata.url+'/query/', query)
}

const treeQuery = fs.readFileSync(__dirname+'/tree-query.js')
opendata.api.Tree = async (variables, urlQuery) => {
	// variables.id naar request.query.id?
	return storeQuery(opendata.url+'/query/', opendata.fragments+';'+treeQuery, variables, urlQuery)
}

opendata.api.runCommand = async (commandStr) => {
	let response = await fetch(opendata.url+'/command/', {
		headers: {
			'Content-Type':'application/jsontag',
			'Accept':'application/jsontag'
		},
		method: 'POST',
		body: commandStr
	})
	let result = await response.json()
	if (!response.ok) {
		throw result
	}
	return result
}

opendata.api.getCommandStatus = async (commandId) => {
	let response = await fetch(opendata.url+'/command/'+commandId, {
		headers: {
			'Accept':'application/jsontag'
		}
	})
	let result = await response.json()
	console.log('status',result)
	if (!response.ok) {
		throw result
	}
	return result
}

module.exports = opendata;