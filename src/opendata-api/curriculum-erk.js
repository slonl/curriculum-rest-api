module.exports = {
	context: 'erk',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/erk.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-erk/context.json',
	queries: {
		ErkVakleergebied: `query ErkVakleergebied($page:Int, $perPage:Int) {
			allErkVakleergebied(page:$page, perPage:$perPage, sortField:"prefix") {
				id
				prefix
				title
				unreleased
				Vakleergebied {
						id
						title
				}
				NiveauIndex {
					Niveau {
						...NiveauShort
					}
				}
			}
			_allErkVakleergebiedMeta {
				count
			}
		}`,
		ErkVolledig: `query ErkVolledig($id:ID, $niveau:ID) {
		  ErkVakleergebied(id:$id) {
		    id
		    prefix
		    title
		    NiveauIndex(filter:{niveau_id:[$niveau]}) {
		      Niveau {
		        ...NiveauShort
		      }
		    }
		  }
		}`
	},
	idQuery: `
		allErkVakleergebied(filter:{id:$id}) {
			id
			prefix
			title
		}`,
	routes: {
		'erk_vakleergebied/': (req) =>
			opendata.api["ErkVakleergebied"](req.params, req.query)
			.then(function(result) {
				return { data: result.data.allErkVakleergebied, type: 'ErkVakleergebied', meta: result.data._allErkVakleergebiedMeta}
			}),
		'erk_vakleergebied/:id': (req) =>
			opendata.api["ErkVolledig"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.ErkVakleergebied,
					type: 'ErkVakleergebied'
				}
			})
	}
};