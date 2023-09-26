module.exports = {
	context: 'erk',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/erk.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-erk/context.json',
	queries: {
		ErkVakleergebied: `
			const results = from(data.ErkVakleergebied)
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
			.sort(sortByPrefix)

			const meta = {
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
		`,
		ErkGebied: `
		const results = from(data.ErkGebied)
			.select({
				'@context': 'http://opendata.slo.nl/curriculum/schemas/erk.jsonld#erk_gebied',
				...shortInfo,
				erk_categorie_id: _,
				erk_taalactiviteit_id: _,
				erk_schaal_id: _,
				unreleased: _,
			})
			.sort(sortByPrefix)

			const meta = {
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
		`,
		ErkCategorie: `
		const results = from(data.ErkCategorie)
			.select({
				'@context': 'http://opendata.slo.nl/curriculum/schemas/erk.jsonld#erk_categorie',
				...shortInfo,
				erk_taalactiviteit_id: _,
				erk_schaal_id: _,
				unreleased: _,
			})
			.sort(sortByPrefix)

			const meta = {
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
		`,
		ErkTaalactiviteit: `
		const results = from(data.ErkTaalactiviteit)
			.select({
				'@context': 'http://opendata.slo.nl/curriculum/schemas/erk.jsonld#erk_taalactiviteit',
				...shortInfo,
				erk_schaal_id: _,
				unreleased: _,
			})
			.sort(sortByPrefix)

			const meta = {
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
		`,
		ErkSchaal: `
			const results = from(data.ErkSchaal)
				.select({
				'@context': 'http://opendata.slo.nl/curriculum/schemas/erk.jsonld#erk_schaal',
				...shortInfo,
				erk_candobeschrijving_id: _,
				unreleased: _,
			})
			.sort(sortByPrefix)

			const meta = {
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
		`,
		ErkCandobeschrijving: `
			const results = from(data.ErkCandobeschrijving)
				.select({
				'@context': 'http://opendata.slo.nl/curriculum/schemas/erk.jsonld#erk_candobeschrijving',
				...shortInfo,
				unreleased: _,
				niveau_id: _,
				erk_voorbeeld_id: _,
				erk_lesidee_id: _,
			})
			.sort(sortByPrefix)

			const meta = {
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
		`,
		ErkVoorbeeld: `
		const results = from(data.ErkVoorbeeld)
			.select({
				'@context': 'http://opendata.slo.nl/curriculum/schemas/erk.jsonld#erk_voorbeeld',
				...shortInfo,
				unreleased: _,
			})
			.sort(sortByPrefix)

			const meta = {
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
		`,
		ErkLesidee: `
		const results = from(data.ErkLesidee)
		.select({
				'@context': 'http://opendata.slo.nl/curriculum/schemas/erk.jsonld#erk_lesidee',
				...shortInfo,
				unreleased: _,
			})
			.sort(sortByPrefix)

			const meta = {
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
		`,
		// @TODO : ErkVolledig in https://github.com/slonl/curriculum-erk/blob/editor/schema.jsonld zetten?
		ErkVolledig: `
		const results = from(Index(request.query.id))
			.select({
			//'@context': 'http://opendata.slo.nl/curriculum/schemas/erk.jsonld#erk_vakleergebied',	
			...shortInfo,
			Niveau: NiveauShort
		  })

		  const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta
		`,
		// @TODO : Find ErkSchalen en context
		ErkSchalen: `
		const results = from(data.ErkSchalen)
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
			.sort(sortByPrefix)

			const meta = {
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta`,
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
		'erk_taalactiviteit/': (req) =>	opendata.api["ErkTaalactiviteit"](req.params, req.query),
		'erk_schaal/': (req) => opendata.api["ErkSchaal"](req.params, req.query),
		'erk_candobeschrijving/': (req) => opendata.api["ErkCandobeschrijving"](req.params, req.query),
		'erk_voorbeeld/': (req) => opendata.api["ErkVoorbeeld"](req.params, req.query),
		'erk_lesidee/': (req) => opendata.api["ErkLesidee"](req.params, req.query),
		'erk_schalen/': (req) => opendata.api["ErkSchalen"](req.params, req.query),	
	}
};