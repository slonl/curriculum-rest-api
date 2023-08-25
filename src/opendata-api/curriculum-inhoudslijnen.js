module.exports = {
	context: 'inhoudslijnen',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/inhoudslijnen.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-inhoudslijnen/context.json',
	queries: {
		InhVakleergebied: `
		const results = from(data.InhVakleergebied)
		.select({
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				Vakleergebied: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				},
				NiveauIndex: {
					Niveau: {
						NiveauShort
					}
				}
			})

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
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			InhVakleergebied: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			NiveauIndex: {
					Niveau: {
						NiveauShort
					}
				}
			})

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
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			unreleased: _,
			InhInhoudslijn: {
				InhVakleergebied: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				}
			},
			NiveauIndex: {
				Niveau: {
					NiveauShort
				}
			}
		})

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
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			unreleased: _,
			InhCluster: {
				InhInhoudslijn: {
					InhVakleergebied: {
						'@id': Id,
						uuid: _.id,
						title: _,
						deprecated: _,
						}
					}
				}
			})

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
			'@id': Id,
			uuid: _.id,
		    prefix: _,
		    title: _,
		    NiveauIndex(filter:{niveau_id:[$niveau]}): {
		 		Niveau: {
		        	NiveauShort
		      	}
		    },
		    InhInhoudslijn: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
				InhCluster: {
					'@id': Id,
					uuid: _.id,
					prefix: _,
					title: _,
					deprecated: _,
					InhSubcluster: {
						'@id': Id,
						uuid: _.id,
						prefix: _,
						title: _,
						deprecated: _,
						Doelniveau(filter:{niveau_id:[$niveau]}): {
							Doelen
						}
		        	},
					Doelniveau(filter:{niveau_id:[$niveau]}): {
						Doelen
					}
		      	},
				Doelniveau(filter:{niveau_id:[$niveau]}): {
						Doelen
				}
		    },
		    Doelniveau(filter:{niveau_id:[$niveau]}): {
		     	Doelen
		    }
		  }
		})`
	},
	typedQueries: {
		InhVakleergebied: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			Vakleergebied: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			InhInhoudslijn: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
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
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			InhCluster: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
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
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			InhSubcluster: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
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
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			InhCluster: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
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
		'niveau/:niveau/inh_vakleergebied/:id/doelen': (req) => opendata.api['InhoudslijnVolledig'](req.params)
	}
};