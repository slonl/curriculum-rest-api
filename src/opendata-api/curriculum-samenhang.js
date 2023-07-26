module.exports = {
	context: 'Samenhang',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/samenhang.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-samenhang/context.json',
	queries: {
		Tag: `query Tag($page:Int, $perPage: Int) {
			allTag(page:$page, perPage:$perPage, sortField:"title", filter:{deprecated:null}) {
				id
				title
				unreleased
			}
			_allTagMeta {
				count
			}
		} 
		`
	},
	typedQueries: {
		'tag': `
			id
			title
			FoDoelzin {
				id
				title
				deprecated
			}
			FoToelichting {
				id
				title
				deprecated
			}
			FoUitwerking {
				id
				title
				deprecated
			}
		`
	},
	routes: {
		'tag/': (req) =>
			opendata.api["Tag"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allTag, 
					type: 'Tag', 
					meta: result.data._allTagMeta
				}
			}),
	}
};