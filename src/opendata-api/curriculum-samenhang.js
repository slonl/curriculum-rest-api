module.exports = {
	context: 'samenhang',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/samenhang.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-samenhang/context.json',
	queries: {
		Tag: `
		const results = from(data.Tag)
		.select({
			'@id': Id,
			uuid: _.id,
			title: _,
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
			'@id': Id,
			uuid: _.id,
			title: _,
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
			'@id': Id,
			uuid: _.id,
			title: _,
			FoToelichting: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			}
			FoUitwerking: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			}
		})
		`,
		relatie: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			FoToelichting: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			}
			FoUitwerking: {
				'@id': Id,
				uuid: _.id,
				title: _,
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