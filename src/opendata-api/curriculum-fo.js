module.exports = {
	context: 'fo',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/fo.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-fo/context.json',
	queries: {
		FoSet: `
		const results = from(data.FoSet)
			.orderBy({
				title: asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				Vakleergebied: shortInfo,
				Niveau: o => from(o.NiveauIndex).select(shortInfo),
				unreleased: _,
			})

			const response = {
				type: 'FoSet',
				data: results,
				page: Page,
				count: data.FoSet.length
			}
	
			response

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

			const response = {
				type: 'FoDomein',
				data: results,
				page: Page,
				count: data.FoDomein.length
			}
	
			response
	
		`,
		FoSubdomein: `
		const results = from(data.FoSubdomein)
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				FoDoelzin: shortInfo
			})
	
			const response = {
				type: 'FoSubdomein',
				data: results,
				page: Page,
				count: data.FoSubdomein.length
			}
	
			response
	
		`,
		FoDoelzin: `
		const results = from(data.FoDoelzin)
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				FoToelichting: shortInfo,
				FoUitwerking: shortInfo
			})

			const response = {
				type: 'FoDoelzin',
				data: results,
				page: Page,
				count: data.FoDoelzin.length
			}
	
			response
	
		`,
		FoToelichting: `
		const results = from(data.FoToelichting)
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				FoDoelzin: shortInfo,
				unreleased: shortInfo
			})

			const response = {
				type: 'FoToelichting',
				data: results,
				page: Page,
				count: data.FoToelichting.length
			}
	
			response
	
			`,
		FoUitwerking: `
		const results = from(data.FoUitwerking)
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				FoDoelzin: shortInfo,
				unreleased: _,
			})
	
			const response = {
				type: 'FoUitwerking',
				data: results,
				page: Page,
				count: data.FoUitwerking.length
			}
	
			response
	
			`,
		FoVolledig: `data.FoSet`
			
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
		'fo_uitwerking/': (req) => opendata.api["FoUitwerking"](req.params, req.query),
		
	}
};