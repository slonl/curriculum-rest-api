module.exports = {
	context: 'referentiekader',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/referentiekader.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-referentiekader/context.json',
	fragments: ``,
	queries: {
		RefVakleergebied: `
		const results = from(data.RefVakleergebied)
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			unreleased: _,
			description: _,					
			Vakleergebied: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			NiveauIndex: {
				Niveau: NiveauShort
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
		RefDomein: `
		const results = from(data.RefDomein)
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			unreleased: _,
			RefVakleergebied: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			NiveauIndex: {
				Niveau: NiveauShort
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
		RefSubdomein: `
		const results = from(data.RefSubdomein)
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			unreleased: _,
			RefDomein: { 
				RefVakleergebied: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				}
			},
			NiveauIndex: {
				Niveau: NiveauShort
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
		RefOnderwerp: `
		const results = from(data.RefOnderwerp)
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			unreleased: _,
			RefSubdomein: {
				RefDomein: {
					RefVakleergebied: {
						'@id': Id,
						uuid: _.id,
						title: _,
						deprecated: _,
					}
				}
			},
			NiveauIndex: {
				Niveau: NiveauShort
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
		RefDeelonderwerp: `
		const results = from(data.RefDeelonderwerp)
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			unreleased: _,
			RefOnderwerp: {
				RefSubdomein: {
					RefDomein: {
						RefVakleergebied: {
							'@id': Id,
							uuid: _.id,
							title: _,
							deprecated: _,
						}
					}
				}
			},
			NiveauIndex: {
				Niveau: NiveauShort
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

		// @TODO : Check if RefTekstkenmerk is indeed empty
		RefTekstkenmerk: `
		const results = from(data.RefTekstkenmerk)
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			unreleased: _,
			RefOnderwerp: {
				RefSubdomein: {
					RefDomein: {
						RefVakleergebied: {
							'@id': Id,
							uuid: _.id,
							title: _,
							deprecated: _,
						}
					}
				}
			},
			NiveauIndex: {
				Niveau: NiveauShort
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
			NiveauIndex: {
				Niveau: NiveauShort
			},
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
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			RefDomein: {
					'@id': Id,
					uuid: _.id,
					prefix: _,
					title: _,
					deprecated: _,
			},
			Doelniveau: Doelniveau,
			NiveauIndex: {
				Niveau: NiveauShort
			},
		})
		`,
		RefDomein: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			RefSubdomein: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			RefVakleergebied: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			Doelniveau: Doelniveau,
			NiveauIndex: {
				Niveau: NiveauShort,
			}
		})
		`,
		RefSubdomein: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			RefOnderwerp: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			RefDomein: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			Doelniveau: Doelniveau,
			NiveauIndex: {
				Niveau: NiveauShort
			}
		})
		`,
		RefOnderwerp: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			RefSubdomein: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			RefDeelonderwerp: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			RefTekstkenmerk: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			Doelniveau: Doelniveau,
			NiveauIndex: {
				Niveau: NiveauShort
			}
		})
		`,
		RefDeelonderwerp: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			RefOnderwerp: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			Doelniveau: Doelniveau,
			NiveauIndex: {
				Niveau: NiveauShort
			}
		})
		`,
		RefTekstkenmerk: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			RefOnderwerp {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			Doelniveau: Doelniveau,
			NiveauIndex: {
				Niveau: NiveauShort
			}
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
		'niveau/:niveau/ref_vakleergebied/:id/doelen': (req) => opendata.api["ReferentiekaderVolledig"](req.params)
		}
};