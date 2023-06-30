module.exports = {
	context: 'samenhang',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/samenhang.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-samenhang/context.json',
	queries: {
		Tag: `query Tag($page:Int, $perPage:Int) {
			allTag(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:null}) {
				id
				title
				unreleased
			}
			_allTagMeta {
				count
			}
		}`,
		Relatie: `query Relatie($page:Int, $perPage:Int) {
			allRelatie(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:null}) {
				id
				title
				unreleased
			}
			_allRelatieMeta {
				count
			}
		}`
	},
	typedQueries: {
		'tag': `
			id
			title
		`,
		'relatie': `
			id
			title
		`
	},
	idQuery: `
		allTag(filter:{id:$id}) {
			id
			title
		}
		allRelatie(filter:{id:$id}) {
			id
			title
		}`,
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
		'relatie/': (req) =>
			opendata.api["Relatie"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allRelatie, 
					type: 'Relatie', 
					meta: result.data._allRelatieMeta
				}
			})
	}
};