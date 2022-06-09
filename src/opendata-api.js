const graphQuery = require('./graphQuery.js');

var opendata = {
	url: '',
	schemas: {},
	fragments: {},
	queries: {},
	idQuery: '',
	routes: {},
	api: {}
};

var apis = [
	require('./opendata-api/curriculum-basis.js'),
	require('./opendata-api/curriculum-kerndoelen.js'),
	require('./opendata-api/curriculum-examenprogramma.js'),
	require('./opendata-api/curriculum-examenprogramma-bg.js'),
	require('./opendata-api/curriculum-syllabus.js'),
//	require('./opendata-api/curriculum-lpib.js'),
	require('./opendata-api/curriculum-inhoudslijnen.js'),
	require('./opendata-api/curriculum-referentiekader.js'),
	require('./opendata-api/curriculum-erk.js'),
	require('./opendata-api/curriculum-niveauhierarchie.js'),
	require('./opendata-api/curriculum-leerdoelenkaarten.js')
];

/**
 * Because Grahpql-js validates the query and fails if you specify a fragment that
 * is not used, we cannot just add all the fragments to each query. So instead
 * this function looks for fragment usage in a graphql query string and only appends
 * those fragments that are used.
 * (Since the graphql-js library is so far removed from the json-graphql-server package
 * it isn't really feasible to change the validation rules, even though graphsql-js allows
 * this)
 */
function getFragments(query) {
	const re = /\.\.\.(.+)/gm;
	let fragments = [];
	while ((match = re.exec(query))!==null) {
		fragments.push(match[1]);
	}
	fragments = fragments.filter((elem,pos) => fragments.indexOf(elem)==pos);

	return fragments
		.map(f => opendata.fragments[f])
		.join("\n");
}

apis.forEach(api => {
	if (api.fragments) {
		opendata.fragments = Object.assign(opendata.fragments, api.fragments);
	}
	if (api.queries) {
		opendata.queries = Object.assign(opendata.queries, api.queries);

		Object.keys(api.queries).forEach(operationName => {
			var query = opendata.queries[operationName];
			var fragments = getFragments(query);

			opendata.api[operationName] = (variables, urlQuery) => {

				return graphQuery(opendata.url, fragments + query, variables, operationName, urlQuery)
				.then((result) => {
					result.schema = api.schema;
					return result;
				});
			}
		});
	}
	if (api.idQuery) {
		opendata.idQuery += api.idQuery
	}
	if (api.routes) {
		opendata.routes = Object.assign(opendata.routes, api.routes);
	}
	opendata.schemas[api.context] = api.schema;
});

opendata.queries.Id = 'query Id($id:ID) {' + opendata.idQuery + '}';
opendata.api.Id     = (variables, urlQuery) => graphQuery(opendata.url, getFragments(opendata.queries.Id)+opendata.queries.Id, variables, 'Id', urlQuery);



module.exports = opendata;