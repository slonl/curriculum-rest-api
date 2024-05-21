module.exports = {
	context: 'examenprogramma_bg',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/examenprogramma_bg.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-examenprogramma-bg/context.json',
	queries: {
		ExamenprogrammaBgProfiel: `
			const results = from(data.ExamenprogrammaBgProfiel)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
			Vakleergebied: {
				...shortInfo,
			  deprecated: _,
			}
		  })
		 

		  const meta = {
			data: results,
			page: Page,
			count: data.ExamenprogrammaBgProfiel.length,
			root: data.schema.types.ExamenprogrammaBgProfiel.root
		}

		meta
		`,
		ExamenprogrammaBgKern: `
		const results = from(data.ExamenprogrammaBgKern)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				ExamenprogrammaBgProfiel: {
					...shortInfo,
					deprecated: _,
				},
		  	})
	
		  	const meta = {
				data: results,
				page: Page,
				count: data.ExamenprogrammaBgKern.length,
				root: data.schema.types.ExamenprogrammaBgKern.root
			}

		meta
		`,
		ExamenprogrammaBgKerndeel: `
		const results = from(data.ExamenprogrammaBgKerndeel)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
		  	})
		  
			const meta = {
				data: results,
				page: Page,
				count: data.ExamenprogrammaBgKerndeel.length,
				root: data.schema.types.ExamenprogrammaBgKerndeel.root
			}

			meta
		`,
		ExamenprogrammaBgGlobaleEindterm: `
		const results = from(data.ExamenprogrammaBgGlobaleEindterm)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
			})

		  	const meta = {
				data: results,
				page: Page,
				count: data.ExamenprogrammaBgGlobaleEindterm.length,
				root: data.schema.types.ExamenprogrammaBgGlobaleEindterm.root
			}

			meta
		`,
		ExamenprogrammaBgModule: `
		const results = from(data.ExamenprogrammaBgModule)
			.orderBy({ prefix:asc })
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				ExamenprogrammaBgProfiel: {
					...shortInfo,
					deprecated: _,
				}
			})
		  
	
			const meta = {
				data: results,
				page: Page,
				count: data.ExamenprogrammaBgModule.length,
				root: data.schema.types.ExamenprogrammaBgModule.root
			}

			meta
		`,
		ExamenprogrammaBgDeeltaak: `
		const results = from(data.ExamenprogrammaBgDeeltaak)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
			})
			
			const meta = {
				data: results,
				page: Page,
				count: data.ExamenprogrammaBgDeeltaak.length,
				root: data.schema.types.ExamenprogrammaBgDeeltaak.root
			}

			meta
		`,
		ExamenprogrammaBgModuletaak: `
		const results = from(data.ExamenprogrammaBgModuletaak)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
			})
		
			const meta = {
				data: results,
				page: Page,
				count: data.ExamenprogrammaBgModuletaak.length,
				root: data.schema.types.ExamenprogrammaBgModuletaak.root
			}

			meta
		`,
		ExamenprogrammaBgKeuzevak: `
		const results = from(data.ExamenprogrammaBgKeuzevak)
			.orderBy({ prefix:asc })
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				ExamenprogrammaBgProfiel: {
					...shortInfo,
					deprecated: _,
				}
			})

			const meta = {
				data: results,
				page: Page,
				count: data.ExamenprogrammaBgKeuzevak.length,
				root: data.schema.types.ExamenprogrammaBgKeuzevak.root
			}

			meta
		`,
		ExamenprogrammaBgKeuzevaktaak: `
		const results = from(data.ExamenprogrammaBgKeuzevaktaak)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
			})
		
		  	const meta = {
				data: results,
				page: Page,
				count: data.ExamenprogrammaBgKeuzevaktaak.length,
				root: data.schema.types.ExamenprogrammaBgKeuzevaktaak.root
			}

			meta
		`,

		ExamenprogrammaBgVolledig: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			deprecated: _,
			  	ExamenprogrammaBgKern: {
					...shortInfo,
					deprecated: _,
					ExamenprogrammaBgKerndeel: {
						...shortInfo,
				  		deprecated: _,
				  		ExamenprogrammaBgGlobaleEindterm: {
							...shortInfo,
							deprecated: _,
				  		},
					},
			  	},
			  	ExamenprogrammaBgModule: {
					...shortInfo,
					deprecated: _,
					ExamenprogrammaBgDeeltaak: {
						...shortInfo,
				  		deprecated: _,
				  		ExamenprogrammaBgGlobaleEindterm: {
							...shortInfo,
							deprecated: _,
				  		},
					},
					ExamenprogrammaBgModuletaak: {
						...shortInfo,
						deprecated: _,
					},
			  	},
			  	ExamenprogrammaBgKeuzevak: {
					...shortInfo,
					deprecated: _,
					ExamenprogrammaBgDeeltaak: {
						...shortInfo,
				  		deprecated: _,
				  		ExamenprogrammaBgGlobaleEindterm: {
							...shortInfo,
							deprecated: _,
				  		},
					},
					ExamenprogrammaBgKeuzevaktaak: {
						...shortInfo,
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
			...shortInfo,
			replaces: _,
			Vakleergebied: {
				...shortInfo,
			  	deprecated: _,
			},
			ExamenprogrammaBgKern: {
				...shortInfo,
			 	deprecated: _,
			},
			ExamenprogrammaBgModule: {
				...shortInfo,
			  	deprecated: _,
			},
			ExamenprogrammaBgKeuzevak: {
				...shortInfo,
			  	deprecated: _,
			},
		})
		`,
		ExamenprogrammaBgKern:`
		from(Index(request.query.id))
		.select({
			...shortInfo,
			replaces: _,
			ExamenprogrammaBgProfiel: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaBgKerndeel: {
				...shortInfo,
				deprecated: _,
			},
		})
		`,
		ExamenprogrammaBgKerndeel:`
		from(Index(request.query.id))
		.select({
			...shortInfo,
			ExamenprogrammaBgKern: {
				...shortInfo,
				deprecated: _,
				ExamenprogrammaBgProfiel: {
					...shortInfo,
					deprecated: _,
				},
			},
			ExamenprogrammaBgGlobaleEindterm: {
				...shortInfo,
				deprecated: _,
			},
		})
		`,
		ExamenprogrammaBgGlobaleEindterm:`
		from(Index(request.query.id))
		.select({
			...shortInfo,
			Niveau: NiveauShort,
			ExamenprogrammaBgKerndeel: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaBgDeeltaak: {
				...shortInfo,
				deprecated: _,
			},
		})
		`,
		ExamenprogrammaBgModule:`
		from(Index(request.query.id))
		.select({
			...shortInfo,
			ExamenprogrammaBgProfiel: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaBgDeeltaak: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaBgModuletaak: {
				...shortInfo,
				deprecated: _,
			},
		})
		`,
		ExamenprogrammaBgDeeltaak:`
		from(Index(request.query.id))
		.select({
			...shortInfo,
			ExamenprogrammaBgGlobaleEindterm: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaBgModule: {
				...shortInfo,
				deprecated: _,
				ExamenprogrammaBgProfiel: {
					...shortInfo,
					deprecated: _,
				},
			},
			ExamenprogrammaBgKeuzevak: {
				...shortInfo,
				deprecated: _,
				ExamenprogrammaBgProfiel: {
					...shortInfo,
					deprecated: _,
				},
			},
		})
		`,
		ExamenprogrammaBgModuletaak:`
		from(Index(request.query.id))
		.select({
			...shortInfo,
			ExamenprogrammaBgModule: {
				...shortInfo,
				deprecated: _,
				ExamenprogrammaBgProfiel: {
					...shortInfo,
					deprecated: _,
				},
			},
			Niveau: NiveauShort
		})
		`,
		ExamenprogrammaBgKeuzevak:`
		from(Index(request.query.id))
		.select({
			...shortInfo,
			ExamenprogrammaBgProfiel: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaBgDeeltaak: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaBgKeuzevaktaak: {
				...shortInfo,
				deprecated: _,
			},
		})
		`,
		ExamenprogrammaBgKeuzevaktaak: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			ExamenprogrammaBgKeuzevak: {
				...shortInfo,
				deprecated: _,
				ExamenprogrammaBgProfiel: {
					...shortInfo,
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