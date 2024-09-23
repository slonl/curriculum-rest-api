module.exports = {
	context: 'inhoudslijnen',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/inhoudslijnen.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-inhoudslijnen/context.json',
	queries: {
		InhVakleergebied: `
		const results = from(data.InhVakleergebied)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				Vakleergebied: {
					...shortInfo,
					deprecated: _,
				},
				Niveau: NiveauIndex	
			})

			const meta = {
				data: results,
				page: Page,
				count: data.InhVakleergebied.length,
				root: meta.schema.types.InhVakleergebied.root
			}
	
			meta
	
		`,
		InhInhoudslijn: `
		const results = from(data.InhInhoudslijn)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				InhVakleergebied: {
					...shortInfo,
					deprecated: _,
				},
				Niveau: NiveauIndex
			})

			const meta = {
				data: results,
				page: Page,
				count: data.InhInhoudslijn.length,
				root: meta.schema.types.InhInhoudslijn.root
			}
	
			meta
	
		`,
		InhCluster: `
		const results = from(data.InhCluster)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				unreleased: _,
				InhInhoudslijn: {
					InhVakleergebied: {
						...shortInfo,
						deprecated: _,
					}
				},
				Niveau: NiveauIndex
			})

			const meta = {
				data: results,
				page: Page,
				count: data.InhCluster.length,
				root: meta.schema.types.InhCluster.root
			}
	
			meta
	
		`,
		InhSubcluster: `
		const results = from(data.InhSubcluster)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				unreleased: _,
				InhCluster: {
					InhInhoudslijn: {
						InhVakleergebied: {
							...shortInfo,
							deprecated: _,
						}
					}
				}
			})
			
			const meta = {
				data: results,
				page: Page,
				count: data.InhSubcluster.length,
				root: meta.schema.types.InhSubcluster.root
			}
	
			meta
	
		`,
		InhoudslijnVolledig: `
		const results = from(data.InhVakleergebied)
			.select({
				...shortInfo,
				Niveau: NiveauIndex
				InhInhoudslijn: {
					...shortInfo,
					deprecated: _,
					InhCluster: {
						...shortInfo,
						deprecated: _,
						InhSubcluster: {
							...shortInfo,
							deprecated: _,
							Doelniveau: Doelen,
						},
						Doelniveau: Doelen,
					},
					Doelniveau:	Doelen,
				},
				Doelniveau: Doelen,
			})`
	},
	typedQueries: {
		InhVakleergebied: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			Vakleergebied: {
				...shortInfo,
				deprecated: _,
			},
			InhInhoudslijn: {
				...shortInfo,
				deprecated: _, 
			},
			Doelniveau,
			Niveau: NiveauIndex
		})
		`,
		InhInhoudslijn: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			InhCluster: {
				...shortInfo,
				deprecated: _,
			},
			Doelniveau,	
			Niveau: NiveauIndex
		})
		`,
		InhCluster: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			InhSubcluster: {
				...shortInfo,
				deprecated: _,
			},
			Doelniveau,
			Niveau: NiveauIndex
		})
		`,
		InhSubcluster: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			InhCluster: {
				...shortInfo,
				deprecated: _,
			},
			Doelniveau
		})   
		`
	},
	routes: {
		'inh_vakleergebied/': (req) => opendata.api["InhVakleergebied"](req.params, req.query),
		'inh_inhoudslijn/': (req) => opendata.api["InhInhoudslijn"](req.params, req.query),
		'inh_cluster/': (req) => opendata.api["InhCluster"](req.params, req.query),
		'inh_subcluster/': (req) => opendata.api["InhSubcluster"](req.params, req.query),
		'niveau/:niveau/inh_vakleergebied/:id/doelen': (req) => opendata.api['InhoudslijnVolledig'](req.params, req.query)
	}
};