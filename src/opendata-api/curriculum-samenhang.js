module.exports = {
	context: 'fo',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/samenhang.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-samenhang/context.json',
	queries: {
		ShTag: `query ShTag($page:Int, $perPage:Int) {
			allShTag(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:null}) {
				id
				prefix
				title
				unreleased
			}
			_allShTagMeta {
				count
			}
		}`,
		ShRelatie: `query ShRelatie($page:Int, $perPage:Int) {
			allShRelatie(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:null}) {
				id
				prefix
				title
				unreleased
			}
			_allShRelatieMeta {
				count
			}
		}`
	},
	typedQueries: {
		'sh_tag': `
			id
			prefix
			title
		`,
		'sh_relatie': `
			id
			prefix
			title
		`
	},
	idQuery: `
		allShTag(filter:{id:$id}) {
			id
			prefix
			title
		}
		allShRelatie(filter:{id:$id}) {
			id
			prefix
			title
		}`,
	routes: {
		'sh_tag/': (req) =>
			opendata.api["ShTag"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allShTag, 
					type: 'ShTag', 
					meta: result.data._allShTagMeta
				}
			}),
		'sh_relatie/': (req) =>
			opendata.api["ShRelatie"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allShRelatie, 
					type: 'ShRelatie', 
					meta: result.data._allShRelatieMeta
				}
			})
	}
};