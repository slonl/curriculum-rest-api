let JSONTag;

import('@muze-nl/jsontag').then(module => {
	JSONTag=module.default
})

function storeQuery(url, query, variables, urlQuery) {
	if (!variables) {
		variables = {};
	}

   	variables.page = urlQuery?.page ? urlQuery.page : 0;
	variables.perPage = urlQuery?.perPage ? urlQuery.perPage : 10;

    url = new URL(url)
	if (variables) {
	    Object.keys(variables).forEach(param => {
	    	if (Array.isArray(variables[param])) {
		    	variables[param].forEach(v => url.searchParams.append(param, v))
		    } else {
		    	url.searchParams.set(param, variables[param])
		    }
	    })
	}
    if (urlQuery) {
	    Object.keys(urlQuery).forEach(param => {
	    	if (Array.isArray(urlQuery[param])) {
		    	urlQuery[param].forEach(v => url.searchParams.append(param, v))
		    } else {
		    	url.searchParams.set(param, urlQuery[param])
		    }
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
		throw new Error(response.status+': '+response.statusText, {details: response})
	}).then(json => {
		return JSONTag.parse(json)
	})
}

module.exports = storeQuery