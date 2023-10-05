module.exports = {
	context: 'samenhang',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/samenhang.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-samenhang/context.json',
	queries: {
		Tag: `
		const results = from(data.Tag)
		.select({
			...shortInfo,
			unreleased: _,
			fo_toelichting_id: _,
			fo_uitwerking_id: _,
		})

		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		Relatie: `
		const results = from(data.Syllabus)
		.select({
			...shortInfo,
			unreleased: _,
			fo_toelichting_id: _,
			fo_uitwerking_id: _,
		})

		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
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