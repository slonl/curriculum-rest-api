module.exports = {
	context: 'examenprogramma_bg',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/examenprogramma_bg.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-examenprogramma-bg/context.json',
	queries: {
		ExamenprogrammaBgProfiel: `
			const results = from(data.ExamenprogrammaBgProfiel)
			.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			Vakleergebied: {
			  '@id': Id,
			  uuid: _.id,
			  title: _,
			  deprecated: _,
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
		ExamenprogrammaBgKern: `
			const results = from(data.ExamenprogrammaBgKern)
			.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ExamenprogrammaBgProfiel: {
			  '@id': Id,
			  uuid: _.id,
			  title: _,
			  deprecated: _,
			},
		  })
		  .sort(sortByPrefix)
	
		  const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta
		`,
		ExamenprogrammaBgKerndeel: `
			const results = from(data.ExamenprogrammaBgKerndeel)
			.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
		  })
		  .sort(sortByPrefix)
	
		  const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta
		`,
		ExamenprogrammaBgGlobaleEindterm: `
		const results = from(data.ExamenprogrammaBgGlobaleEindterm)
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
		  })
		  .sort(sortByPrefix)

		  const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta
		`,
		ExamenprogrammaBgModule: `
		const results = from(data.ExamenprogrammaBgModule)
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ExamenprogrammaBgProfiel: {
			  '@id': Id,
			  title: _,
			  deprecated: _,
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
		ExamenprogrammaBgDeeltaak: `
		const results = from(data.ExamenprogrammaBgDeeltaak)
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
		})
		.sort(sortByPrefix)

		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta
		`,
		ExamenprogrammaBgModuletaak: `
		const results = from(data.ExamenprogrammaBgModuletaak)
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
		})
		.sort(sortByPrefix)

		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta
		`,
		ExamenprogrammaBgKeuzevak: `
		const results = from(data.ExamenprogrammaBgKeuzevak)
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ExamenprogrammaBgProfiel: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
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
		ExamenprogrammaBgKeuzevaktaak: `
		const results = from(data.ExamenprogrammaBgKeuzevaktaak)
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
		})
		.sort(sortByPrefix)

		  const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta
		`,

		ExamenprogrammaBgVolledig: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			deprecated: _,
			  ExamenprogrammaBgKern: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
				ExamenprogrammaBgKerndeel: {
				  '@id': Id,
				  uuid: _.id,
				  title: _,
				  deprecated: _,
				  ExamenprogrammaBgGlobaleEindterm: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				  },
				},
			  },
			  ExamenprogrammaBgModule: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
				ExamenprogrammaBgDeeltaak: {
				  '@id': Id,
				  uuid: _.id,
				  title: _,
				  deprecated: _,
				  ExamenprogrammaBgGlobaleEindterm: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				  },
				},
				ExamenprogrammaBgModuletaak: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				},
			  },
			  ExamenprogrammaBgKeuzevak: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
				ExamenprogrammaBgDeeltaak: {
				  '@id': Id,
				  uuid: _.id,
				  title: _,
				  deprecated: _,
				  ExamenprogrammaBgGlobaleEindterm: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				  },
				},
				ExamenprogrammaBgKeuzevaktaak: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				},
			  },
			})
	    `
	},
	typedQueries: {
		ExamenprogrammaBgProfiel:`
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			replaces: _,
			Vakleergebied: {
			  '@id': Id,
			  uuid: _.id,
			  title: _,
			  deprecated: _,
			},
			ExamenprogrammaBgKern: {
			  '@id': Id,
			  uuid: _.id,
			  prefix: _,
			  title: _,
			  deprecated: _,
			},
			ExamenprogrammaBgModule: {
			  '@id': Id,
			  uuid: _.id,
			  prefix: _,
			  title: _,
			  deprecated: _,
			},
			ExamenprogrammaBgKeuzevak: {
			  '@id': Id,
			  uuid: _.id,
			  prefix: _,
			  title: _,
			  deprecated: _,
			},
		})
		`,
		ExamenprogrammaBgKern:`
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			replaces: _,
			ExamenprogrammaBgProfiel: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
			ExamenprogrammaBgKerndeel: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
		})
		`,
		ExamenprogrammaBgKerndeel:`
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ExamenprogrammaBgKern: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
				ExamenprogrammaBgProfiel: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				},
			},
			ExamenprogrammaBgGlobaleEindterm: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
		})
		`,
		ExamenprogrammaBgGlobaleEindterm:`
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			Niveau: NiveauShort,
			ExamenprogrammaBgKerndeel: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
			ExamenprogrammaBgDeeltaak: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
		})
		`,
		ExamenprogrammaNgModule:`
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ExamenprogrammaBgProfiel: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
			ExamenprogrammaBgDeeltaak: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
			ExamenprogrammaBgModuletaak: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
		})
		`,
		ExamenprogrammaBgDeeltaak:`
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ExamenprogrammaBgGlobaleEindterm: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
			ExamenprogrammaBgModule: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
				ExamenprogrammaBgProfiel: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				},
			},
			ExamenprogrammaBgKeuzevak: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
				ExamenprogrammaBgProfiel: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				},
			},
		})
		`,
		ExamenprogrammaBgModuletaak:`
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ExamenprogrammaBgModule: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
				ExamenprogrammaBgProfiel: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				},
			},
			Niveau: NiveauShort
		})
		`,
		ExamenprogrammaBgKeuzevak:`
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ExamenprogrammaBgProfiel: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
			ExamenprogrammaBgDeeltaak: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
			ExamenprogrammaBgKeuzevaktaak: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
		})
		`,
		ExamenprogrammaBgKeuzevaktaak: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ExamenprogrammaBgKeuzevak: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
				ExamenprogrammaBgProfiel: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				},
			},
			Niveau: NiveauShort
		})
		`
	},
	routes: {
		'examenprogramma_bg/:id': (req) => opendata.api["ExamenprogrammaBgVolledig"](req.params, req.query),
		'examenprogramma_bg_profiel/': (req) =>	opendata.api["ExamenprogrammaBgProfiel"](req.params, req.query),
		'examenprogramma_bg_kern/': (req) => opendata.api["ExamenprogrammaBgKern"](req.params, req.query),
		'examenprogramma_bg_kerndeel/': (req) => opendata.api["ExamenprogrammaBgKerndeel"](req.params, req.query),
		'examenprogramma_bg_globale_eindterm/': (req) => opendata.api["ExamenprogrammaBgGlobaleEindterm"](req.params, req.query),
		'examenprogramma_bg_module/': (req) => opendata.api["ExamenprogrammaBgModule"](req.params, req.query),
		'examenprogramma_bg_keuzevak/': (req) => opendata.api["ExamenprogrammaBgKeuzevak"](req.params, req.query),
		'examenprogramma_bg_deeltaak/': (req) => opendata.api["ExamenprogrammaBgDeeltaak"](req.params, req.query),
		'examenprogramma_bg_moduletaak/': (req) =>opendata.api["ExamenprogrammaBgModuletaak"](req.params, req.query),
		'examenprogramma_bg_keuzevaktaak/': (req) => opendata.api["ExamenprogrammaBgKeuzevaktaak"](req.params, req.query)
		
	}
};