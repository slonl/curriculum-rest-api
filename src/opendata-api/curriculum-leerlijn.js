module.exports = {
	context: 'leerlijn',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/leerlijn.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-leerlijn/context.json',
	queries: {
		Leerlijn: `
		const results = from(data.Leerlijn)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo
			})

			const response = {
				data: results,
				page: Page,
				count: data.Leerlijn.length,
				root: meta.schema.types.Leerlijn.root
			}

			response

		`,
		LeerlijnFocus: `
		const results = from(data.LeerlijnFocus)
			.orderBy({
				title:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				Niveau: NiveauIndex
			})

			const response = {
				data: results,
				page: Page,
				count: data.LeerlijnFocus.length,
				root: meta.schema.types.LeerlijnFocus.root
			}

			response

		`,
		LeerlijnInhoudsblok: `
		const results = from(data.LeerlijnInhoudsblok)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				LeerlijnSubinhoudsblok: {
					...shortInfo,
					deprecated: _,
				}
			})

			const response = {
				data: results,
				page: Page,
				count: data.LeerlijnInhoudsblok.length,
				root: meta.schema.types.LeerlijnInhoudsblok.root
			}

			response

		`,
		LeerlijnSubinhoudsblok: `
		const results = from(data.LeerlijnSubinhoudsblok)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				LeerlijnInhoudsrij: {
					...shortInfo,
					deprecated: _,
				}
			})

			const response = {
				data: results,
				page: Page,
				count: data.LeerlijnSubinhoudsblok.length,
				root: meta.schema.types.LeerlijnSubinhoudsblok.root
			}

			response

		`,
		LeerlijnInhoudsrij: `
		const results = from(data.LeerlijnInhoudsrij)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				LeerlijnInhoud: {
					...shortInfo,
					deprecated: _,
				}
			})

			const response = {
				data: results,
				page: Page,
				count: data.LeerlijnInhoudsrij.length,
				root: meta.schema.types.LeerlijnInhoudsrij.root
			}

			response

		`,
		LeerlijnInhoud: `
		const results = from(data.LeerlijnInhoud)
			.orderBy({
				title:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				Niveau: NiveauIndex,
				LeerlijnVoorbeeld: {
					...shortInfo,
					deprecated: _,
				}
			})

			const response = {
				data: results,
				page: Page,
				count: data.LeerlijnInhoud.length,
				root: meta.schema.types.LeerlijnInhoud.root
			}

			response

		`,
		LeerlijnVoorbeeld: `
		const results = from(data.LeerlijnVoorbeeld)
			.orderBy({
				title:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				Niveau: NiveauIndex,
				LeerlijnInhoudsblok: {
					...shortInfo,
					deprecated: _,
				},
				LeerlijnInhoud: {
					...shortInfo,
					deprecated: _,
				}
			})

			const response = {
				data: results,
				page: Page,
				count: data.LeerlijnVoorbeeld.length,
				root: meta.schema.types.LeerlijnVoorbeeld.root
			}

			response

		`
	},
	typedQueries: {
		Leerlijn: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			LeerlijnInhoudsblok: {
				...shortInfo,
				deprecated: _,
			},
			LeerlijnFocus: {
				...shortInfo,
				deprecated: _,
			}
		})
		`,
		LeerlijnFocus: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			Niveau: NiveauIndex
		})
		`,
		LeerlijnInhoudsblok: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			LeerlijnSubinhoudsblok: {
				...shortInfo,
				deprecated: _,
			},
			LeerlijnVoorbeeld: {
				...shortInfo,
				deprecated: _,
			}
		})
		`,
		LeerlijnSubinhoudsblok: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			LeerlijnInhoudsrij: {
				...shortInfo,
				deprecated: _,
			}
		})
		`,
		LeerlijnInhoudsrij: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			LeerlijnInhoud: {
				...shortInfo,
				deprecated: _,
			}
		})
		`,
		LeerlijnInhoud: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			Niveau: NiveauIndex,
			LeerlijnVoorbeeld: {
				...shortInfo,
				deprecated: _,
			}
		})
		`,
		LeerlijnVoorbeeld: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			Niveau: NiveauIndex,
			LeerlijnInhoudsblok: {
				...shortInfo,
				deprecated: _,
			},
			LeerlijnInhoud: {
				...shortInfo,
				deprecated: _,
			}
		})
		`
	},
	routes: {
		'leerlijn/': (req) => opendata.api["Leerlijn"](req.params, req.query),
		'leerlijn_focus/': (req) => opendata.api["LeerlijnFocus"](req.params, req.query),
		'leerlijn_inhoudsblok/': (req) => opendata.api["LeerlijnInhoudsblok"](req.params, req.query),
		'leerlijn_subinhoudsblok/': (req) => opendata.api["LeerlijnSubinhoudsblok"](req.params, req.query),
		'leerlijn_inhoudsrij/': (req) => opendata.api["LeerlijnInhoudsrij"](req.params, req.query),
		'leerlijn_inhoud/': (req) => opendata.api["LeerlijnInhoud"](req.params, req.query),
		'leerlijn_voorbeeld/': (req) => opendata.api["LeerlijnVoorbeeld"](req.params, req.query)
	}
};
