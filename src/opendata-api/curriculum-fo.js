module.exports = {
	context: 'fo',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/fo.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-fo/context.json',
	queries: {
		FoDomein: `
		const results = from(data.FoDomein)
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				Vakleergebied: _,
				FoSubdomein: _,
				unreleased: _,
			})

			const meta = {
				type: 'Doelniveau',
				data: results,
				page: Page,
				count: results.length
			}
	
			meta
	
		`,
		FoSubdomein: `
		const results = from(data.FoSubdomein)
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				FoDoelzin: _
			})
	
			const meta = {
				type: 'Doelniveau',
				data: results,
				page: Page,
				count: results.length
			}
	
			meta
	
		`,
		FoDoelzin: `
		const results = from(data.FoDoelzin)
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				FoToelichting: _,
				FoUitwerking: _
			})

			const meta = {
				type: 'Doelniveau',
				data: results,
				page: Page,
				count: results.length
			}
	
			meta
	
		`,
		FoToelichting: `
		const results = from(data.FoToelichting)
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				FoDoelzin: _,
				unreleased: _
			})

			const meta = {
				type: 'Doelniveau',
				data: results,
				page: Page,
				count: results.length
			}
	
			meta
	
			`,
		FoUitwerking: `
		const results = from(data.FoUitwerking)
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				FoDoelzin: _,
				unreleased: _,
			})
	
			const meta = {
				type: 'Doelniveau',
				data: results,
				page: Page,
				count: results.length
			}
	
			meta
	
			`
	},
	typedQueries: {
		FoDomein: `
			from(Index(request.query.id))
			.select({
				'@context': 'https://opendata.slo.nl/curriculum/schemas/fo.jsonld#FoDomein',
				...shortInfo,
				description: _,
				replaces: ShortLink,
				FoSubdomein: shortInfo
			})
		`,
		FoSubdomein: `
			from(Index(request.query.id))
			.select({
				'@context': 'https://opendata.slo.nl/curriculum/schemas/fo.jsonld#FoSubdomein',
				...shortInfo,
				description: _,
				replaces: ShortLink,
				FoDoelzin: shortInfo
			})
		`,
		FoDoelzin: `
			from(Index(request.query.id))
			.select({
				'@context': 'https://opendata.slo.nl/curriculum/schemas/fo.jsonld#FoDoelzin',
				...shortInfo,
				description: _,
				replaces: ShortLink,
				FoToelichting: shortInfo,
				FoUitwerking: shortInfo
			})
		`,
		FoToelichting: `
			from(Index(request.query.id))
			.select({
				'@context': 'https://opendata.slo.nl/curriculum/schemas/fo.jsonld#FoToelichting',
				...shortInfo,
				description: _,
				replaces: ShortLink,
				FoDoelzin: shortInfo
			})
		`,
		FoUitwerking: `
			from(Index(request.query.id))
			.select({
				'@context': 'https://opendata.slo.nl/curriculum/schemas/fo.jsonld#FoUitwerking',
				...shortInfo,
				description: _,
				replaces: ShortLink,
				FoDoelzin: shortInfo
			})
		`
	},
	routes: {
		'fo_domein/': (req) => opendata.api["FoDomein"](req.params, req.query),
		'fo_subdomein/': (req) => opendata.api["FoSubdomein"](req.params, req.query),
		'fo_doelzin/': (req) => opendata.api["FoDoelzin"](req.params, req.query),
		'fo_toelichting/': (req) => opendata.api["FoToelichting"](req.params, req.query),
		'fo_uitwerking/': (req) => opendata.api["FoUitwerking"](req.params, req.query)
		
	}
};