module.exports = {
	context: 'inhoudslijnen',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/inhoudslijnen.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-inhoudslijnen/context.json',
	queries: {
		InhVakleergebied: `
		const results = from(data.InhVakleergebied)
		.select({
			...shortInfo,
				Vakleergebied: {
					...shortInfo,
					deprecated: _,
				},
				NiveauIndex: {
					Niveau: NiveauShort	
				}
			})
			.sort(sortByPrefix)

			const meta = {
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
	
			`,
		InhInhoudslijn: `
		const results = from(data.InhInhoudslijn)
		.select({
			...shortInfo,
			InhVakleergebied: {
				...shortInfo,
				deprecated: _,
			},
			NiveauIndex: {
				Niveau: NiveauShort
			}
		})
		.sort(sortByPrefix)

			const meta = {
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
	
			`,
		InhCluster: `
		const results = from(data.InhCluster)
		.select({
			...shortInfo,
			unreleased: _,
			InhInhoudslijn: {
				InhVakleergebied: {
					...shortInfo,
					deprecated: _,
				}
			},
			NiveauIndex: {
				Niveau: NiveauShort
			}
		})
		.sort(sortByPrefix)

			const meta = {
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
	
			`,
		InhSubcluster: `
		const results = from(data.InhSubcluster)
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
			.sort(sortByPrefix)

			const meta = {
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
	
			`,
		InhoudslijnVolledig: `
		const results = from(data.InhVakleergebied)
		.select({
			...shortInfo,
		    NiveauIndex:{
		 		Niveau: NiveauShort
		    },
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
			Doelniveau: {
				Doelniveau
			},
			NiveauIndex: {
				Niveau: {
					NiveauShort
				}
			}
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
			Doelniveau: {
				Doelniveau
			},	
			NiveauIndex: {
				Niveau: {
					NiveauShort
				}
			}
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
			Doelniveau: {
				Doelniveau
			},
			NiveauIndex: {
				Niveau: {
					NiveauShort
				}
			}
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
			Doelniveau: {
				Doelniveau
			}
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