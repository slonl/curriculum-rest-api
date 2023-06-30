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
				vakleergebied_id
				fo_subdomein_id
				unreleased
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
				unreleased
				fo_doelzin_id
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
				unreleased
				fo_toelichting_id
				fo_uitwerking_id
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
				fo_doelzin_id
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
				fo_doelzin_id
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
			Vakleergebied {
				id
				title
			}
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
			FoDoelzin {
				id
				title
				deprecated
			}
		`,
		'fo_uitwerking': `
			id
			prefix
			title
			FoDoelzin {
				id
				title
				deprecated
			}
		`
	},
	idQuery: `
		allFoDomein(filter:{id:$id}) {
			id
			prefix
			title
			Vakleergebied {
				id
				title
			}
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
			FoDoelzin {
			  id
			  title
			}
		}
		allFoUitwerking(filter:{id:$id}) {
			id
			prefix
			title
			FoDoelzin {
			  id
			  title
			}
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