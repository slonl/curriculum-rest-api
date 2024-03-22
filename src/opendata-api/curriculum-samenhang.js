module.exports = {
	context: 'samenhang',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/samenhang.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-samenhang/context.json',
	queries: {
		Tag: `
		const results = from(data.Tag)
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				unreleased: _,
				fo_toelichting_id: _,
				fo_uitwerking_id: _,
			})

			const meta = {
				data: results,
				page: Page,
				count: data.Tag.length
			}

			meta

		`,
		Relatie: `
		const results = from(data.Syllabus)
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				unreleased: _,
				fo_toelichting_id: _,
				fo_uitwerking_id: _,
			})

			const meta = {
				data: results,
				page: Page,
				count: data.Syllabus.length
			}

			meta

		`
	},
	typedQueries: {
		tag: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			FoToelichting: {
				...shortInfo,
				deprecated: _,
			}
			FoUitwerking: {
				...shortInfo,
				deprecated: _,
			}
		})
		`,
		relatie: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			FoToelichting: {
				...shortInfo,
				deprecated: _,
			}
			FoUitwerking: {
				...shortInfo,
				deprecated: _,
			}
		})
		`
	},
	routes: {
		'tag/': (req) => opendata.api["Tag"](req.params, req.query),
		'relatie/': (req) => opendata.api["Relatie"](req.params, req.query)
	}
};