module.exports = {
	context: 'fo',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/fo.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-fo/context.json',
	queries: {
		FoSet: `
		const results = from(data.FoSet)
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				FoDomein: shortInfo,
				unreleased: _,
			})

			const meta = {
				type: 'FoSet',
				data: results,
				page: Page,
				count: data.FoSet.length
			}
	
			meta

		`,
		FoDomein: `
		const results = from(data.FoDomein)
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				Vakleergebied: shortInfo,
				FoSubdomein: shortInfo,
				unreleased: _,
			})

			const meta = {
				type: 'FoDomein',
				data: results,
				page: Page,
				count: data.FoDomein.length
			}
	
			meta
	
		`,
		FoSubdomein: `
		const results = from(data.FoSubdomein)
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				FoDoelzin: shortInfo
			})
	
			const meta = {
				type: 'FoSubdomein',
				data: results,
				page: Page,
				count: data.FoSubdomein.length
			}
	
			meta
	
		`,
		FoDoelzin: `
		const results = from(data.FoDoelzin)
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				FoToelichting: shortInfo,
				FoUitwerking: shortInfo
			})

			const meta = {
				type: 'FoDoelzin',
				data: results,
				page: Page,
				count: data.FoDoelzin.length
			}
	
			meta
	
		`,
		FoToelichting: `
		const results = from(data.FoToelichting)
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				FoDoelzin: shortInfo,
				unreleased: shortInfo
			})

			const meta = {
				type: 'FoToelichting',
				data: results,
				page: Page,
				count: data.FoToelichting.length
			}
	
			meta
	
			`,
		FoUitwerking: `
		const results = from(data.FoUitwerking)
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				FoDoelzin: shortInfo,
				unreleased: _,
			})
	
			const meta = {
				type: 'FoUitwerking',
				data: results,
				page: Page,
				count: data.FoUitwerking.length
			}
	
			meta
	
			`
	},
	typedQueries: {
		FoSet: `
			from(Index(request.query.id))
			.select({
				'@context': 'https://opendata.slo.nl/curriculum/schemas/fo.jsonld#FoSet',
				...shortInfo,
				description: _,
				replaces: ShortLink,
				FoDomein: shortInfo
			})
		`,
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
		'fo_set/': (req) => opendata.api["FoSet"](req.params, req.query),
		'fo_domein/': (req) => opendata.api["FoDomein"](req.params, req.query),
		'fo_subdomein/': (req) => opendata.api["FoSubdomein"](req.params, req.query),
		'fo_doelzin/': (req) => opendata.api["FoDoelzin"](req.params, req.query),
		'fo_toelichting/': (req) => opendata.api["FoToelichting"](req.params, req.query),
		'fo_uitwerking/': (req) => opendata.api["FoUitwerking"](req.params, req.query)
		
	}
};