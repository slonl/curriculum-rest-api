const storeQuery = require('./storeQuery.js');

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
	require('./opendata-api/curriculum-kerndoelen.js'),
	require('./opendata-api/curriculum-basis.js'),
	require('./opendata-api/curriculum-referentiekader.js'),
	require('./opendata-api/curriculum-erk.js'),
	require('./opendata-api/curriculum-examenprogramma-bg.js'),
	require('./opendata-api/curriculum-examenprogramma.js')
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
			console.log(query); //TODO remove as it is for debugging purposes
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
	let type = await storeQuery(opendata.url+'/query/', `JSONTag.getAttribute(meta.index.id.get('/uuid/${variables.id}')?.deref(),'class')`)
	let typedQuery = opendata.typedQueries[type]
	if (!typedQuery) {
		console.error('missing typedquery for '+type)
	}
	console.log(typedQuery); //Todo: remove as it is for debugging purposes
	let result = await storeQuery(opendata.url+'/query/', opendata.fragments +';'+ typedQuery, variables, urlQuery)
	return result
}

module.exports = opendata;