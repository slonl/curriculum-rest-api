module.exports = {
	context: 'samenhang',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/samenhang.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-samenhang/context.json',
	queries: {
		Tag: `
		const results = from(data.Tag)
		.select({
				id
				title
				unreleased
				fo_toelichting_id
				fo_uitwerking_id
		})

		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		Relatie: `
		const results = from(data.Relatie)
		.select({
				id
				title
				unreleased
				fo_toelichting_id
				fo_uitwerking_id
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
		'tag': `
			id
			title
			FoToelichting {
				id
				title
				deprecated
			}
			FoUitwerking {
				id
				title
				deprecated
			}
		`,
		'relatie': `
			id
			title
			FoToelichting {
				id
				title
				deprecated
			}
			FoUitwerking {
				id
				title
				deprecated
			}
		`
	},
	routes: {
		'tag/': (req) => opendata.api["Tag"](req.params, req.query),
		'relatie/': (req) => opendata.api["Relatie"](req.params, req.query)
	}
};