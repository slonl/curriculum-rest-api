module.exports = {
	context: 'fo',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/fo.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-fo/context.json',
	queries: {
		FoVolledig: `
			const results = from(data.FoSet)
			.orderBy({
			title: asc
			})

			results
		`,

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
		FoKernzin: `
		const results = from(data.FoKernzin)
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				FoDoelzin: shortInfo
			})
	
			const response = {
				type: 'FoKernzin',
				data: results,
				page: Page,
				count: data.FoKernzin.length
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
				FoDomein: {
                  ...shortInfo,
					description: _,
                    FoDoelzin: {
                      ...shortInfo,
	   				description: _,
                      se: _,
                      ce: _,
	    	              FoUitwerking: {
                        ...shortInfo, 
                      	description:  _                        
                      },
                      FoToelichting:  {
                        ...shortInfo, 
                      	description:  _                        
                      },
                    },
                  FoSubdomein: {
                    ...shortInfo,
					description: _,
                    FoDoelzin: {
                      ...shortInfo,
                      description: _,
                      se: _,
                      ce: _,
                      FoUitwerking: {
                        ...shortInfo, 
                      	description:  _                        
                      },
                      FoToelichting:  {
                        ...shortInfo, 
                      	description:  _                        
                      },
                    },
                  },
                },
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
		FoKernzin: `
			from(Index(request.query.id))
			.select({
				'@context': 'https://opendata.slo.nl/curriculum/schemas/fo.jsonld#FoKernzin',
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
		'fo_volledig/': (req) => opendata.api["FoVolledig"](req.params, req.query),
		'fo_set/': (req) => opendata.api["FoSet"](req.params, req.query),
		'fo_domein/': (req) => opendata.api["FoDomein"](req.params, req.query),
		'fo_subdomein/': (req) => opendata.api["FoSubdomein"](req.params, req.query),
		'fo_kernzin/': (req) => opendata.api["FoKernzin"](req.params, req.query),
		'fo_doelzin/': (req) => opendata.api["FoDoelzin"](req.params, req.query),
		'fo_toelichting/': (req) => opendata.api["FoToelichting"](req.params, req.query),
		'fo_uitwerking/': (req) => opendata.api["FoUitwerking"](req.params, req.query)
	}
};