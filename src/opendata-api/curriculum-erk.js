module.exports = {
	context: 'erk',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/erk.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-erk/context.json',
	queries: {
		ErkVakleergebied: `query ErkVakleergebied($page:Int, $perPage:Int) {
			allErkVakleergebied(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:false}) {
				id
				prefix
				title
				unreleased
				Vakleergebied {
						id
						title
				}
				Niveau {
				  ...NiveauShort
				}
			}
			_allErkVakleergebiedMeta {
				count
			}
		}`,
		ErkGebied: `query ErkGebied($page:Int, $perPage:Int) {
			allErkGebied(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:false}) {
				id
				prefix
				title
				erk_categorie_id
				erk_taalactiviteit_id
				erk_schaal_id
				unreleased
			}
			_allErkGebiedMeta {
				count
			}
		}`,
		ErkCategorie: `query ErkCategorie($page:Int, $perPage:Int) {
			allErkCategorie(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:false}) {
				id
				prefix
				title
				erk_taalactiviteit_id
				erk_schaal_id
				unreleased
			}
			_allErkCategorieMeta {
				count
			}
		}`,
		ErkTaalactiviteit: `query ErkTaalactiviteit($page:Int, $perPage:Int) {
			allErkTaalactiviteit(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:false}) {
				id
				prefix
				title
				erk_schaal_id
				unreleased
			}
			_allErkTaalactiviteitMeta {
				count
			}
		}`,
		ErkSchaal: `query ErkSchaal($page:Int, $perPage:Int) {
			allErkSchaal(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:false}) {
				id
				prefix
				title
				erk_candobeschrijving_id
				unreleased
			}
			_allErkSchaalMeta {
				count
			}
		}`,
		ErkCandobeschrijving: `query ErkCandobeschrijving($page:Int, $perPage:Int) {
			allErkCandobeschrijving(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:false}) {
				id
				prefix
				title
				unreleased
				niveau_id
				erk_voorbeeld_id
				erk_lesidee_id
			}
			_allErkCandobeschrijvingMeta {
				count
			}
		}`,
		ErkVoorbeeld: `query ErkVoorbeeld($page:Int, $perPage:Int) {
			allErkVoorbeeld(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:false}) {
				id
				prefix
				title
				unreleased
			}
			_allErkVoorbeeldMeta {
				count
			}
		}`,
		ErkLesidee: `query ErkLesidee($page:Int, $perPage:Int) {
			allErkLesidee(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:false}) {
				id
				prefix
				title
				unreleased
			}
			_allErkLesideeMeta {
				count
			}
		}`,
		ErkVolledig: `query ErkVolledig($id:ID, $niveau:ID) {
		  ErkVakleergebied(id:$id) {
		    id
		    prefix
		    title
			Niveau {
			  ...NiveauShort
			}
		  }
		}`,
		ErkSchalen: `query ErkSchalen($page:Int, $perPage:Int) {
			allErkGebied(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:false}) {
				id
				prefix
				title
				ErkCategorie {
					id
					prefix
					title
					ErkTaalactiviteit {
						id
						prefix
						title
						ErkSchaal {
							id
							prefix
							title
							algemeen
						}
					}
					ErkSchaal {
						id
						prefix
						title
						algemeen
					}
				}
				ErkTaalactiviteit {
					id
					prefix
					title
					ErkSchaal {
						id
						prefix
						title
						algemeen
					}
				}
				ErkSchaal {
					id
					prefix
					title
					algemeen
				} 
			}
			_allErkGebiedMeta {
				count
			}
		}`
	},
	typedQueries: {
		'erk_vakleergebied': `
			id
			prefix
			title
			Niveau {
				id
				title
				deprecated
			}
			Vakleergebied {
				id
				title
				deprecated
			}
		`,
		'erk_gebied': `
			id
			prefix
			title
			ErkCategorie {
				id
				title
				deprecated
			}
			ErkTaalactiviteit {
				id
				title
				deprecated
			}
			ErkSchaal {
				id
				title
				deprecated
			}
		`,
		'erk_categorie': `
			id
			prefix
			title
			ErkTaalactiviteit {
				id
				title
				deprecated
			}
			ErkSchaal {
				id
				title
				deprecated
			}
		`,
		'erk_taalactiviteit': `
			id
			prefix
			title
			ErkSchaal {
				id
				title
				deprecated
			}
		`,
		'erk_schaal': `
			id
			prefix
			title
			ErkCandobeschrijving {
				id
				title
				isempty
				deprecated
				Niveau {
					id
					title
					deprecated
				}
			}
		`,
		'erk_candobeschrijving': `
			id
			prefix
			title
			isempty
			Niveau {
				id
				title
				deprecated
			}
			ErkVoorbeeld {
				id
				title
				deprecated
			}
			ErkLesidee {
				id
				title
				deprecated
			}
		`,
		'erk_voorbeeld': `
			id
			prefix
			title
		`,
		'erk_lesidee': `
			id
			prefix
			title
		`
	},
	idQuery: `
		allErkVakleergebied(filter:{id:$id}) {
			id
			prefix
			title
			Niveau {
			  id
			  title
			}
			Vakleergebied {
					id
					title
			}
		}
		allErkGebied(filter:{id:$id}) {
			id
			prefix
			title
			ErkCategorie {
			  id
			  title
			}
			ErkTaalactiviteit {
			  id
			  title
			}
			ErkSchaal {
			  id
			  title
			}
		}
		allErkCategorie(filter:{id:$id}) {
			id
			prefix
			title
			ErkTaalactiviteit {
			  id
			  title
			}
			ErkSchaal {
			  id
			  title
			}
		}
		allErkTaalactiviteit(filter:{id:$id}) {
			id
			prefix
			title
			ErkSchaal {
			  id
			  title
			}
		}
		allErkSchaal(filter:{id:$id}) {
			id
			prefix
			title
			ErkCandobeschrijving {
				id
				title
				isempty
				Niveau {
				  id
				  title
				}
			}
		}
		allErkCandobeschrijving(filter:{id:$id}) {
			id
			prefix
			title
			isempty
			Niveau {
			  id
			  title
			}
			ErkVoorbeeld {
			  id
			  title
			}
			ErkLesidee {
			  id
			  title
			}
		}
		allErkVoorbeeld(filter:{id:$id}) {
			id
			prefix
			title
		}
		allErkLesidee(filter:{id:$id}) {
			id
			prefix
			title
		}`,
	routes: {
		'erk_vakleergebied/': (req) =>
			opendata.api["ErkVakleergebied"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allErkVakleergebied, 
					type: 'ErkVakleergebied', 
					meta: result.data._allErkVakleergebiedMeta
				}
			}),
		'erk_vakleergebied/:id': (req) =>
			opendata.api["ErkVolledig"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.ErkVakleergebied,
					type: 'ErkVakleergebied'
				}
			}),
		'erk_gebied/': (req) =>
			opendata.api["ErkGebied"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allErkGebied, 
					type: 'ErkGebied', 
					meta: result.data._allErkGebiedMeta
				}
			}),
		'erk_categorie/': (req) =>
			opendata.api["ErkCategorie"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allErkCategorie, 
					type: 'ErkCategorie', 
					meta: result.data._allErkCategorieMeta
				}
			}),
		'erk_taalactiviteit/': (req) =>
			opendata.api["ErkTaalactiviteit"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allErkTaalactiviteit, 
					type: 'ErkTaalactiviteit', 
					meta: result.data._allErkTaalactiviteitMeta
				}
			}),
		'erk_schaal/': (req) =>
			opendata.api["ErkSchaal"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allErkSchaal, 
					type: 'ErkSchaal', 
					meta: result.data._allErkSchaalMeta
				}
			}),
		'erk_candobeschrijving/': (req) =>
			opendata.api["ErkCandobeschrijving"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allErkCandobeschrijving, 
					type: 'ErkCandobeschrijving', 
					meta: result.data._allErkCandobeschrijvingMeta
				}
			}),
		'erk_voorbeeld/': (req) =>
			opendata.api["ErkVoorbeeld"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allErkVoorbeeld, 
					type: 'ErkVoorbeeld', 
					meta: result.data._allErkVoorbeeldMeta
				}
			}),
		'erk_lesidee/': (req) =>
			opendata.api["ErkLesidee"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allErkLesidee, 
					type: 'ErkLesidee', 
					meta: result.data._allErkLesideeMeta
				}
			}),
		'erk_schalen/': (req) =>
			opendata.api["ErkSchalen"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allErkGebied, 
					type: 'ErkGebied', 
					meta: result.data._allErkGebiedMeta
				}
			})
	}
};