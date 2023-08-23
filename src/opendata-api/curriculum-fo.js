module.exports = {
	context: 'fo',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/fo.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-fo/context.json',
	queries: {
		FoDomein: `
		const results = from(data.FoDomein)
		.select({
				'@id": Id,
				prefix: _,
				title: _,
				vakleergebied_id: _,
				fo_subdomein_id: _,
				unreleased: _,
			})

			const meta = {
				type: 'Doelniveau',
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
	
			`,
		FoSubdomein: `
		const results = from(data.FoSubdomein)
		.select({
				'@id": Id,
				prefix: _,
				title: _,
				unreleased: _,
				fo_doelzin_id
			})
	
			const meta = {
				type: 'Doelniveau',
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
	
			`,
		FoDoelzin: `
		const results = from(data.FoDoelzin)
		.select({
				'@id": Id,
				prefix: _,
				title: _,
				unreleased: _,
				fo_toelichting_id
				fo_uitwerking_id
			})

			const meta = {
				type: 'Doelniveau',
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
	
			`,
		FoToelichting: `
		const results = from(data.FoToelichting)
		.select({
				'@id": Id,
				prefix: _,
				title: _,
				fo_doelzin_id
				unreleased: _,
			})

			const meta = {
				type: 'Doelniveau',
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
	
			`,
		FoUitwerking: `
		const results = from(data.FoUitwerking)
		.select({
				'@id": Id,
				prefix: _,
				title: _,
				fo_doelzin_id
				unreleased: _,
			})
	
			const meta = {
				type: 'Doelniveau',
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
	
			`
	},
	typedQueries: {
		'fo_domein': `
			'@id": Id,
			prefix: _,
			title: _,
			Vakleergebied {
				'@id": Id,
				title: _,
			}
			FoSubdomein {
				'@id": Id,
				title: _,
				deprecated
			}
		`,
		'fo_subdomein': `
			'@id": Id,
			prefix: _,
			title: _,
			FoDoelzin {
				'@id": Id,
				title: _,
				deprecated
			}
		`,
		'fo_doelzin': `
			'@id": Id,
			prefix: _,
			title: _,
			FoToelichting {
				'@id": Id,
				title: _,
				deprecated
			}
			FoUitwerking {
				'@id": Id,
				title: _,
				deprecated
			}
		`,
		'fo_toelichting': `
			'@id": Id,
			prefix: _,
			title: _,
			FoDoelzin {
				'@id": Id,
				title: _,
				deprecated
			}
		`,
		'fo_uitwerking': `
			'@id": Id,
			prefix: _,
			title: _,
			FoDoelzin {
				'@id": Id,
				title: _,
				deprecated
			}
		`
	},
	idQuery: `
		allFoDomein(filter:{'@id": Id,:$'@id": Id,}) {
			'@id": Id,
			prefix: _,
			title: _,
			Vakleergebied {
				'@id": Id,
				title: _,
			}
			FoSubdomein {
			  '@id": Id,
			  title: _,
			}
		}
		allFoSubdomein(filter:{'@id": Id,:$'@id": Id,}) {
			'@id": Id,
			prefix: _,
			title: _,
			FoDoelzin {
			  '@id": Id,
			  title: _,
			}
		}
		allFoDoelzin(filter:{'@id": Id,:$'@id": Id,}) {
			'@id": Id,
			prefix: _,
			title: _,
			FoToelichting {
			  '@id": Id,
			  title: _,
			}
			FoUitwerking {
			  '@id": Id,
			  title: _,
			}
		}
		allFoToelichting(filter:{'@id": Id,:$'@id": Id,}) {
			'@id": Id,
			prefix: _,
			title: _,
			FoDoelzin {
			  '@id": Id,
			  title: _,
			}
		}
		allFoUitwerking(filter:{'@id": Id,:$'@id": Id,}) {
			'@id": Id,
			prefix: _,
			title: _,
			FoDoelzin {
			  '@id": Id,
			  title: _,
			}
		}`,
	routes: {
		'fo_domein/': (req) => opendata.api["FoDomein"](req.params, req.query),
		'fo_subdomein/': (req) => opendata.api["FoSubdomein"](req.params, req.query),
		'fo_doelzin/': (req) => opendata.api["FoDoelzin"](req.params, req.query),
		'fo_toelichting/': (req) => opendata.api["FoToelichting"](req.params, req.query),
		'fo_uitwerking/': (req) => opendata.api["FoUitwerking"](req.params, req.query)
		
	}
};