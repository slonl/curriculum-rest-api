module.exports = {
	context: 'referentiekader',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/referentiekader.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-referentiekader/context.json',
	fragments: ``,
	queries: {
		RefVakleergebied: `
		const results = from(data.RefVakleergebied)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				unreleased: _,
				description: _,					
				Vakleergebied: {
					...shortInfo,
					deprecated: _,
				},
				Niveau: NiveauIndex
			})
			
			const response = {
				data: results,
				page: Page,
				count: data.RefVakleergebied.length,
				root: meta.schema.types.RefVakleergebied.root
			}

			response

		`,
		RefDomein: `
		const results = from(data.RefDomein)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				unreleased: _,
				RefVakleergebied: {
					...shortInfo,
					deprecated: _,
				},
				Niveau: NiveauIndex
			})
				
			const response = {
				data: results,
				page: Page,
				count: data.RefDomein.length,
				root: meta.schema.types.RefDomein.root
			}

			response
		`,
		RefSubdomein: `
		const results = from(data.RefSubdomein)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				unreleased: _,
				RefDomein: { 
					RefVakleergebied: {
						...shortInfo,
						deprecated: _,
					}
				},
				Niveau: NiveauIndex
			})
			
			const response = {
				data: results,
				page: Page,
				count: data.RefSubdomein.length,
				root: meta.schema.types.RefSubdomein.root
			}

			response
		`,
		RefOnderwerp: `
		const results = from(data.RefOnderwerp)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				unreleased: _,
				RefSubdomein: {
					RefDomein: {
						RefVakleergebied: {
							...shortInfo,
							deprecated: _,
						}
					}
				},
				Niveau: NiveauIndex
			})

			const response = {
				data: results,
				page: Page,
				count: data.RefOnderwerp.length,
				root: meta.schema.types.RefOnderwerp.root
			}

			response
		`,
		RefDeelonderwerp: `
		const results = from(data.RefDeelonderwerp)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				unreleased: _,
				RefOnderwerp: {
					RefSubdomein: {
						RefDomein: {
							RefVakleergebied: {
								...shortInfo,
								deprecated: _,
							}
						}
					}
				},
				Niveau: NiveauIndex
			})

			const response = {
				data: results,
				page: Page,
				count: data.RefDeelonderwerp.length,
				root: meta.schema.types.RefDeelonderwerp.root
			}

			response
		`,

		// @TODO : Check if RefTekstkenmerk is indeed empty
		RefTekstkenmerk: `
		const results = from(data.RefTekstkenmerk)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				unreleased: _,
				RefOnderwerp: {
					RefSubdomein: {
						RefDomein: {
							RefVakleergebied: {
								...shortInfo,
								deprecated: _,
							}
						}
					}
				},
				Niveau: NiveauIndex
			})

			const response = {
				data: results,
				page: Page,
				count: data.RefTekstkenmerk.length,
				root: meta.schema.types.RefTekstkenmerk.root
			}

			response
		`,
		/*
		// @TODO : Check if ReferentiekaderVolledig is a word
		ReferentiekaderVolledig: `
		const results = from(data.ReferentiekaderVolledig)
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			deprecated: _,
			Niveau: NiveauIndex,
			RefDomein {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
				RefSubdomein: {
					'@id': Id,
					uuid: _.id,
					prefix: _,
					title: _,
					deprecated: _,
					RefOnderwerp: {
						'@id': Id,
						uuid: _.id,
						prefix: _,
						title: _,
						deprecated: _,
						RefDeelonderwerp: {
							'@id': Id,
							uuid: _.id,
							prefix: _,
							title: _,
							deprecated: _,
							Doelniveau:	Doelen,
						},
						Doelniveau: Doelen,
					},
					Doelniveau:	Doelen,
				},
				Doelniveau: Doelen
			},
			Doelniveau: Doelen,
		}
	})`
		*/
	},

	typedQueries: {
		RefVakleergebied:`
		from(Index(request.query.id))
		.select({
			...shortInfo,
			RefDomein: {
				...shortInfo,
					deprecated: _,
			},
			Doelniveau: Doelniveau,
			Niveau: NiveauIndex
		})
		`,
		RefDomein: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			RefSubdomein: {
				...shortInfo,
				deprecated: _,
			},
			RefVakleergebied: {
				...shortInfo,
				deprecated: _,
			},
			Doelniveau: Doelniveau,
			Niveau: NiveauIndex
		})
		`,
		RefSubdomein: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			RefOnderwerp: {
				...shortInfo,
				deprecated: _,
			},
			RefDomein: {
				...shortInfo,
				deprecated: _,
			},
			Doelniveau: Doelniveau,
			Niveau: NiveauIndex
		})
		`,
		RefOnderwerp: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			RefSubdomein: {
				...shortInfo,
				deprecated: _,
			},
			RefDeelonderwerp: {
				...shortInfo,
				deprecated: _,
			},
			RefTekstkenmerk: {
				...shortInfo,
				deprecated: _,
			},
			Doelniveau: Doelniveau,
			Niveau: NiveauIndex
		})
		`,
		RefDeelonderwerp: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			RefOnderwerp: {
				...shortInfo,
				deprecated: _,
			},
			Doelniveau: Doelniveau,
			Niveau: NiveauIndex
		})
		`,
		RefTekstkenmerk: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			RefOnderwerp {
				...shortInfo,
				deprecated: _,
			},
			Doelniveau: Doelniveau,
			Niveau: NiveauIndex
		})	
		`,	
	},
	routes: {
		'ref_vakleergebied/': (req) => opendata.api["RefVakleergebied"](req.params, req.query),
		'ref_domein/': (req) => opendata.api["RefDomein"](req.params, req.query),
		'ref_subdomein/': (req) => opendata.api["RefSubdomein"](req.params, req.query),
		'ref_onderwerp/': (req) => opendata.api["RefOnderwerp"](req.params, req.query),
		'ref_deelonderwerp/': (req) => opendata.api["RefDeelonderwerp"](req.params, req.query),
		'ref_tekstkenmerk': (req) => opendata.api["RefTekstkenmerk"](req.params, req.query),
		'niveau/:niveau/ref_vakleergebied/:id/doelen': (req) => opendata.api["ReferentiekaderVolledig"](req.params, req.query)
		}
};