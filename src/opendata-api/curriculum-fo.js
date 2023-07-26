module.exports = {
	context: 'fo',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/fo.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-fo/context.json',
	queries: {
		FoDomein: `query FoDomein($page:Int, $perPage:Int) {
			allFoDomein(page:$page, perPage:$perPage, sortField:"prefix",filer:{deprecated:null}) {
				id
				prefix
				title
				unreleased
				FoSubdomein {
					id
					title
				}
				Vakleergebied {
					id
					title
				}
			}
			_allFoDomeinMeta {
				count
			}
		}`,
		
	},
	typedQueries: {
		'fo_domein': `
			id
			prefix
			title
			Vakleergebied {
				id
				title
				deprecated
			}
		`
	},
	routes: {
		'fo_domein/': (req) =>
			opendata.api["FoDomein"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allFoDomein, 
					type: 'FoDomein', 
					meta: result.data._allFoDomeinMeta
				}
			}),
	}
};