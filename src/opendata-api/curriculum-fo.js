module.exports = {
	context: 'fo',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/fo.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-fo/context.json',
	queries: {
		FoDomein: `query FoDomein($page:Int, $perPage:Int) {
			allFoDomein(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:null}) {
				id
				prefix
				title
				unreleased
				Vakleergebied {
					id
					title
				}
				FoSubdomein {
					id
					title
				}
			}
			_allFoDomeinMeta {
				count
			}
		}`,
		FoSubdomein: `query FoSubdomein($page:Int, $perPage:Int) {
			allFoSubdomein(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:null}) {
				id
				prefix
				title
				fo_doelzin_id
				unreleased
			}
			_allFoSubdomeinMeta {
				count
			}
		}`,
		FoDoelzin: `query FoDoelzin($page:Int, $perPage:Int) {
			allFoDoelzin(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:null}) {
				id
				prefix
				title
				fo_toelichting_id
				fo_uitwerking_id
				unreleased
			}
			_allFoDoelzinMeta {
				count
			}
		}`,
		FoToelichting: `query FoToelichting($page:Int, $perPage:Int) {
			allFoToelichting(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:null}) {
				id
				prefix
				title
				unreleased
			}
			_allFoToelichtingMeta {
				count
			}
		}`,
		FoUitwerking: `query FoUitwerking($page:Int, $perPage:Int) {
			allFoUitwerking(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:null}) {
				id
				prefix
				title
				unreleased
			}
			_allFoUitwerkingMeta {
				count
			}
		}`
	},
	typedQueries: {
		'fo_domein': `
			id
			prefix
			title
			FoSubdomein {
				id
				title
				deprecated
			}
		`,
		'fo_subdomein': `
			id
			prefix
			title
			FoDoelzin {
				id
				title
				deprecated
			}
		`,
		'fo_doelzin': `
			id
			prefix
			title
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
		`,
		'fo_toelichting': `
			id
			prefix
			title
		`,
		'fo_uitwerking': `
			id
			prefix
			title
		`
	},
	idQuery: `
		allFoDomein(filter:{id:$id}) {
			id
			prefix
			title
			FoSubdomein {
			  id
			  title
			}
		}
		allFoSubdomein(filter:{id:$id}) {
			id
			prefix
			title
			FoDoelzin {
			  id
			  title
			}
		}
		allFoDoelzin(filter:{id:$id}) {
			id
			prefix
			title
			FoToelichting {
			  id
			  title
			}
			FoUitwerking {
			  id
			  title
			}
		}
		allFoToelichting(filter:{id:$id}) {
			id
			prefix
			title
		}
		allFoUitwerking(filter:{id:$id}) {
			id
			prefix
			title
		}`,
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
		'fo_subdomein/': (req) =>
			opendata.api["FoSubdomein"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allFoSubdomein, 
					type: 'FoSubdomein', 
					meta: result.data._allFoSubdomeinMeta
				}
			}),
		'fo_doelzin/': (req) =>
			opendata.api["FoDoelzin"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allFoDoelzin, 
					type: 'FoDoelzin', 
					meta: result.data._allFoDoelzinMeta
				}
			}),
		'fo_toelichting/': (req) =>
			opendata.api["FoToelichting"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allFoToelichting, 
					type: 'FoToelichting', 
					meta: result.data._allFoToelichtingMeta
				}
			}),
		'fo_uitwerking/': (req) =>
			opendata.api["FoUitwerking"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allFoUitwerking, 
					type: 'FoUitwerking', 
					meta: result.data._allFoUitwerkingMeta
				}
			})
	}
};