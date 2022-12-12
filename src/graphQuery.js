const request   = require('request-promise-native');

module.exports = function graphQuery(url, query, variables, operationName, urlQuery) {
	if (!variables) {
		variables = {};
	}
	if (!urlQuery) {
		urlQuery = {};
	}

	for (var i in variables) {
		if (typeof variables[i]==='string') {
			// replace legacy bk: ids to basic uuids.
			variables[i] = variables[i].replace(/^bk:/, '');
		}
	}

	variables.page = urlQuery.page ? urlQuery.page : 0;
	variables.perPage = urlQuery.perPage ? urlQuery.perPage : 100;

	var postData = {
		query : query,
		operationName : operationName,
		variables : variables
	};

	return request({
		url : url,
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
};