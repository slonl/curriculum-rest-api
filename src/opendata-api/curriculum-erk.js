module.exports = {
	context: 'erk',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/erk.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-erk/context.json',
	queries: {
		ErkVakleergebied: `
		const results = from(data.ErkVakleergebied)
			.orderBy({ 
				prefix:asc 
			})
			.slice(Paging.start,Paging.end)
			.select({
				'@context': 'http://opendata.slo.nl/curriculum/schemas/erk.jsonld#erk_vakleergebied',
				...shortInfo,
				unreleased: _,
				Vakleergebied: {
						'@id': Id,
						'@type': Type,
						uuid: _.id,
						title: _,
				},
				Niveau: NiveauShort 
			})
			
			const response = {
				data: results,
				page: Page,
				count: data.ErkVakleergebied.length,
				root: meta.schema.types.ErkVakleergebied.root
			}
	
			response
		`,
		ErkGebied: `
		const results = from(data.ErkGebied)
			.orderBy({ 
				prefix:asc 
			})
			.slice(Paging.start,Paging.end)
			.select({
				'@context': 'http://opendata.slo.nl/curriculum/schemas/erk.jsonld#erk_gebied',
				...shortInfo,
				erk_categorie_id: _,
				erk_taalactiviteit_id: _,
				erk_schaal_id: _,
				unreleased: _,
			})
			

			const response = {
				data: results,
				page: Page,
				count: data.ErkGebied.length,
				root: meta.schema.types.ErkGebied.root
			}
	
			response
		`,
		ErkCategorie: `
		const results = from(data.ErkCategorie)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				'@context': 'http://opendata.slo.nl/curriculum/schemas/erk.jsonld#erk_categorie',
				...shortInfo,
				erk_taalactiviteit_id: _,
				erk_schaal_id: _,
				unreleased: _,
			})
			

			const response = {
				data: results,
				page: Page,
				count: data.ErkCategorie.length,
				root: meta.schema.types.ErkCategorie.root
			}
	
			response
		`,
		ErkTaalprofiel:`
		const results = from(data.ErkTaalprofiel)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				'@context': 'http://opendata.slo.nl/curriculum/schemas/erk.jsonld#erk_taalprofiel',
				...shortInfo,
  				ErkTaalprofieltekst: shortInfo,
  				ErkSchaal: shortInfo,
			})
			

			const response = {
				data: results,
				page: Page,
				count: data.ErkTaalprofiel.length,
				root: meta.schema.types.ErkTaalprofiel.root
			}
	
			response
		`,
		ErkTaalprofieltekst:`
		const results = from(data.ErkTaalprofieltekst)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				'@context': 'http://opendata.slo.nl/curriculum/schemas/erk.jsonld#erk_taalprofieltekst',
				...shortInfo,
				Niveau: NiveauShort
			})
			

			const response = {
				data: results,
				page: Page,
				count: data.ErkTaalprofieltekst.length,
				root: meta.schema.types.ErkTaalprofieltekst.root
			}
	
			response
		`,
		ErkTaalactiviteit: `
		const results = from(data.ErkTaalactiviteit)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				'@context': 'http://opendata.slo.nl/curriculum/schemas/erk.jsonld#erk_taalactiviteit',
				...shortInfo,
				ErkSchaal: shortInfo,
				unreleased: _,
			})
			

			const response = {
				data: results,
				page: Page,
				count: data.ErkTaalactiviteit.length,
				root: meta.schema.types.ErkTaalactiviteit.root
			}
	
			response
		`,
		ErkSchaal: `
			const results = from(data.ErkSchaal)
				.orderBy({
					prefix:asc
				})
				.slice(Paging.start,Paging.end)
				.select({
				'@context': 'http://opendata.slo.nl/curriculum/schemas/erk.jsonld#erk_schaal',
				...shortInfo,
				ErkCandobeschrijving: shortInfo,
				unreleased: _,
			})
			

			const response = {
				data: results,
				page: Page,
				count: data.ErkSchaal.length,
				root: meta.schema.types.ErkSchaal.root
			}
	
			response
		`,
		ErkCandobeschrijving: `
		const results = from(data.ErkCandobeschrijving)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				'@context': 'http://opendata.slo.nl/curriculum/schemas/erk.jsonld#erk_candobeschrijving',
				...shortInfo,
				unreleased: _,
				niveau_id: _,
				ErkVoorbeeld: shortInfo,
				ErkLesidee: shortInfo,
			})
			
			const response = {
				data: results,
				page: Page,
				count: data.ErkCandobeschrijving.length,
				root: meta.schema.types.ErkCandobeschrijving.root
			}
	
			response
		`,
		ErkVoorbeeld: `
		const results = from(data.ErkVoorbeeld)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				'@context': 'http://opendata.slo.nl/curriculum/schemas/erk.jsonld#erk_voorbeeld',
				...shortInfo,
				unreleased: _,
			})
			
			const response = {
				data: results,
				page: Page,
				count: data.ErkVoorbeeld.length,
				root: meta.schema.types.ErkVoorbeeld.root
			}
	
			response
		`,
		ErkLesidee: `
		const results = from(data.ErkLesidee)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				'@context': 'http://opendata.slo.nl/curriculum/schemas/erk.jsonld#erk_lesidee',
				...shortInfo,
				unreleased: _,
			})
			
			const response = {
				data: results,
				page: Page,
				count: data.ErkLesidee.length,
				root: meta.schema.types.ErkLesidee.root			}
	
			response
		`,
		// @TODO : ErkVolledig in https://github.com/slonl/curriculum-erk/blob/editor/schema.jsonld zetten?
		ErkVolledig: `
			const results = from(Index(request.query.id))
			.slice(Paging.start,Paging.end)
			.select({
				//'@context': 'http://opendata.slo.nl/curriculum/schemas/erk.jsonld#erk_vakleergebied',	
				...shortInfo,
				Niveau: NiveauShort
		  	})
			const response = {
				data: results,
				page: Page,
				count: Index(request.query.id).length
			}
			response
		`,
		// @TODO : Find ErkSchalen en context
		ErkSchalen: `
		const results = from(data.ErkSchalen)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				//'@context': 'http://opendata.slo.nl/curriculum/schemas/erk.jsonld#erk_ONBEKEND',
				...shortInfo,
				ErkCategorie: {
					...shortInfo,
					ErkTaalactiviteit: {
						...shortInfo,
						ErkSchaal: {
							...shortInfo,
							algemeen: _,
						},
					},
					ErkSchaal: {
						...shortInfo,
						algemeen: _,
					},
				},
				ErkTaalactiviteit: {
					...shortInfo,
					ErkSchaal: {
						...shortInfo,
						algemeen: _,
					},
				},
				ErkSchaal: {
					...shortInfo,
					algemeen: _,
				},
			})
			

			const response = {
				data: results,
				page: Page,
				count: data.ErkSchalen.length
			}
	
			response`,
	},
	typedQueries: {
		ErkVakleergebied: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			Niveau: {
				...shortInfo,
				deprecated: _,
			},
			Vakleergebied: {
				...shortInfo,
				deprecated: _,
			},
		})
		`,
		ErkGebied: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			ErkCategorie: {
				...shortInfo,
				deprecated: _,
			},
			ErkTaalactiviteit: {
				...shortInfo,
				deprecated: _,
			},
			ErkSchaal: {
				...shortInfo,
				deprecated: _,
			},
		})	
		`,
		ErkCategorie: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			ErkTaalactiviteit: {
				...shortInfo,
				deprecated: _,
			},
			ErkSchaal: {
				...shortInfo,
				deprecated: _,
			},
		})
		`,
		ErkTaalprofiel: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			ErkSchaal: {
				...shortInfo,
				deprecated: _,
			},
		})
		`,
		ErkTaalprofieltekst: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
		})
		`,
		ErkTaalactiviteit: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			ErkSchaal: {
				...shortInfo,
				deprecated: _,
			},
		})
		`,
		ErkSchaal: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			ErkCandobeschrijving: {
				...shortInfo,
				isempty: _,
				deprecated: _,
				Niveau: {
					...shortInfo,
					deprecated: _,
				},
			},
		})
		`,
		ErkCandobeschrijving: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			isempty: _,
			Niveau: {
				...shortInfo,
				deprecated: _,
			},
			ErkVoorbeeld: {
				...shortInfo,
				deprecated: _,
			},
			ErkLesidee: {
				...shortInfo,
				deprecated: _,
			},
		})
		`,
		ErkVoorbeeld: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
		})	
		`,
		ErkLesidee: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
		})
		`
	},
	routes: {
		'erk_vakleergebied/': (req) => opendata.api["ErkVakleergebied"](req.params, req.query),
		'erk_vakleergebied/:id': (req) => opendata.api["ErkVolledig"](req.params, req.query),
		'erk_gebied/': (req) =>  opendata.api["ErkGebied"](req.params, req.query),
		'erk_categorie/': (req) => opendata.api["ErkCategorie"](req.params, req.query),
		'erk_taalprofiel/': (req) =>	opendata.api["ErkTaalprofiel"](req.params, req.query),
		'erk_taalprofieltekst/': (req) =>	opendata.api["ErkTaalprofieltekst"](req.params, req.query),
		'erk_taalactiviteit/': (req) =>	opendata.api["ErkTaalactiviteit"](req.params, req.query),
		'erk_schaal/': (req) => opendata.api["ErkSchaal"](req.params, req.query),
		'erk_candobeschrijving/': (req) => opendata.api["ErkCandobeschrijving"](req.params, req.query),
		'erk_voorbeeld/': (req) => opendata.api["ErkVoorbeeld"](req.params, req.query),
		'erk_lesidee/': (req) => opendata.api["ErkLesidee"](req.params, req.query),
		'erk_schalen/': (req) => opendata.api["ErkSchalen"](req.params, req.query),	
	}
};