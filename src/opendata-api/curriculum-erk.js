module.exports = {
	context: 'erk',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/erk.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-erk/context.json',
	queries: {
		ErkVakleergebied: `
			const results = from(data.ErkVakleergebied)
			.select({
				'@context': 'http://opendata.slo.nl/curriculum/schemas/erk.jsonld#erk_vakleergebied',
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				unreleased: _,
				Vakleergebied: {
						'@id': Id,
						uuid: _.id,
						title: _,
				},
				Niveau: {
					NiveauShort
				} 
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
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
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
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
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
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
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
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
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
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
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
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
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
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
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
		    '@id': Id,
			uuid: _.id,
		    prefix: _,
		    title: _,
			Niveau: {
			  NiveauShort: _,
			}
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
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				ErkCategorie: {
					'@id': Id,
					uuid: _.id,
					prefix: _,
					title: _,
					ErkTaalactiviteit: {
						'@id': Id,
						uuid: _.id,
						prefix: _,
						title: _,
						ErkSchaal: {
							'@id': Id,
							uuid: _.id,
							prefix: _,
							title: _,
							algemeen: _,
						},
					},
					ErkSchaal: {
						'@id': Id,
						uuid: _.id,
						prefix: _,
						title: _,
						algemeen: _,
					},
				},
				ErkTaalactiviteit: {
					'@id': Id,
					uuid: _.id,
					prefix: _,
					title: _,
					ErkSchaal: {
						'@id': Id,
						uuid: _.id,
						prefix: _,
						title: _,
						algemeen: _,
					},
				},
				ErkSchaal: {
					'@id': Id,
					uuid: _.id,
					prefix: _,
					title: _,
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
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			Niveau: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			Vakleergebied: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
		})
		`,
		ErkGebied: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ErkCategorie: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			ErkTaalactiviteit: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			ErkSchaal: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
		})	
		`,
		ErkCategorie: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ErkTaalactiviteit: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			ErkSchaal: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated
			},
		})
		`,
		ErkTaalactiviteit: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ErkSchaal: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
		})
		`,
		ErkSchaal: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ErkCandobeschrijving: {
				'@id': Id,
				uuid: _.id,
				title: _,
				isempty: _,
				deprecated: _,
				Niveau: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				},
			},
		})
		`,
		ErkCandobeschrijving: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			isempty: _,
			Niveau: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			ErkVoorbeeld: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			ErkLesidee: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
		})
		`,
		ErkVoorbeeld: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
		})	
		`,
		ErkLesidee: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
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