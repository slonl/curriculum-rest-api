
function storeQuery(url, query, variables, urlQuery) {
	if (!variables) {
		variables = {};
	}

   	variables.page = urlQuery.page ? urlQuery.page : 0;
	variables.perPage = urlQuery.perPage ? urlQuery.perPage : 100;

    url = new URL(url)
    url.searchParams.set('page', variables.page || 0)
    url.searchParams.set('pageSize', variables.perPage || 100)
    console.log('POSTing to ',url,JSON.stringify(query))
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
		throw response
	}).catch(response => {
		response.text().then(error => {
			console.log(error)
			throw new Error(error, response.status)
		})
	})
}

module.exports = storeQuery