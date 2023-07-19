function storeQuery(url, query, variables, urlQuery) {
	if (!variables) {
		variables = {};
	}

   	variables.page = urlQuery?.page ? urlQuery.page : 0;
	variables.perPage = urlQuery?.perPage ? urlQuery.perPage : 10;

    url = new URL(url)
	if (variables) {
	    Object.keys(variables).forEach(param => {
	    	url.searchParams.set(param, variables[param])
	    })
	}
    if (urlQuery) {
	    Object.keys(urlQuery).forEach(param => {
	    	url.searchParams.set(param, urlQuery[param])
	    })
	}
	return fetch(url, {
		method : "POST",
		body : query,
		headers: {
			"Accept":"application/jsontag"
		}
	}).then(response => {
		if (response.ok) {
			return response.text()
		}
		throw new Error(response, response.status)
	}).then(json => {
		return JSON.parse(json)
	})
}

module.exports = storeQuery