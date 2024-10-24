function FilterEmptyDoelniveau(ent) {
	var found = false;
	/*['LpibVakkern','LpibVaksubkern','LpibVakinhoud'].forEach(function(type) {
		if (ent[type]) {
			ent[type] = ent[type].filter(FilterEmptyDoelniveau);
			if (!ent[type].length) {
				delete ent[type];
			} else {
				found = true;
			}
		}
	});*/
	if (ent.Doelniveau && ent.Doelniveau.length) {
		found = true;
	}
	return found;
}

module.exports = {
	context: 'leerdoelenkaarten',
	fragments:``,
	queries: {
		LdkVakleergebied: `
		const results = from(data.LdkVakleergebied)
			.orderBy({
				title:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				Niveau: NiveauIndex
		  	})

			const response = {
				data: results,
				page: Page,
				count: data.LdkVakleergebied.length,
				root: meta.schema.types.LdkVakleergebied.root
			}

			response

		`,
		LdkVakkern: `
		const results = from(data.LdkVakkern)
			.orderBy({
				title:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				deprecated: _,
				LdkVakleergebied: {
					...shortInfo,
					deprecated: _,
				},
				NiveauIndex: {
					Niveau: NiveauShort
				}
			})
			
			const response = {
				data: results,
				page: Page,
				count: data.LdkVakkern.length,
				root: meta.schema.types.LdkVakkern.root
			}

			response

		`,
		LdkVaksubkern: `
		const results = from(data.LdkVaksubkern)
			.orderBy({
				title:asc
			})
			.slice(Paging.start,Paging.end)
			.select({		
				...shortInfo,
				deprecated: _,
				LdkVakkern: {
					LdkVakleergebied: {
						...shortInfo,
						deprecated: _,
					}
				},
				Niveau: NiveauIndex
			})
			
		  	const response = {
				data: results,
				page: Page,
				count: data.LdkVaksubkern.length,
				root: meta.schema.types.LdkVaksubkern.root
			}

			response

		`,
		LdkVakinhoud: `
		const results = from(data.LdkVakinhoud)
			.orderBy({
				title:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				deprecated: _,
				LdkVaksubkern: {
					LdkVakkern: {
						LdkVakleergebied: {
							...shortInfo,
							deprecated: _,
						}
					}
				},
				NiveauIndex: {
					Niveau: NiveauShort
				}
			})
			
			const response = {
				data: results,
				page: Page,
				count: data.LdkVakinhoud.length,
				root: meta.schema.types.LdkVakinhoud.root
			}

			response

		`,
		LdkVakbegrip: `
		const results = from(data.LdkVakbegrip)
			.orderBy({
				title:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				ce_se: _,
				Doelniveau: Doelniveau,
			})
			
			const response = {
				data: results,
				page: Page,
				count: data.LdkVakbegrip.length,
				root: meta.schema.types.LdkVakbegrip.root
			}

			response

		`,
		DoelenOpNiveauByLdkVakleergebiedById: `
		const results = from(Index(request.query.id))
			.select({
  				...shortInfo,
  				NiveauIndex : o => from(o.NiveauIndex)
					.where({
						Niveau : { id: request.query.niveau }
					})
					.select({
						...NiveauShort
					})
  			,
  
  			LdkVakkern : {
              ...shortInfo,
              	Doelniveau : o => from(o.Doelniveau)			  
					.where({
						Niveau : { id: request.query.niveau }
					})
					.select({
						...Doelen
					}),
				
                LdkVaksubkern : {
                  	...shortInfo,
                    Doelniveau : o => from(o.Doelniveau)			  
						.where({
							Niveau : { id: request.query.niveau }
						})
						.select({
							...Doelen
						}),

                  LdkVakinhoud: {
						...shortInfo,
						Doelniveau : o => from(o.Doelniveau)			  
							.where({
								Niveau : { id: request.query.niveau }
							})
							.select({
								...Doelen
							})
                		},
              		},
            	}			
			})
		`,
		LdkVakleergebiedOpNiveau: `
		const results = from(data.NiveauIndex)
		.where({
			uuid : request.query.id,
		})
		.select({
			LdkVakleergebied: {
				...shortInfo,
				deprecated: _,
			}
		})`,
		LdkVakleergebiedByIdOpNiveau: `
		const results = from(data.NiveauIndex)
		.where({
			uuid: request.query.id
		})
		.select({
			LdkVakleergebied: {
				...shortInfo,
				deprecated: _,
				Doelniveau : o => from(o.Doelniveau)			  
				.where({
					Niveau : { id: request.query.niveau }
				})
				.select({
					...Doelen
				})
			},
			LdkVakkern: {
				...shortInfo,
				deprecated: _,
			},
			Niveau: NiveauShort
		})`,

		LdkVakkernOpNiveau: `
		const results = from(data.NiveauIndex)
		.where({
			uuid : request.query.id
		})
		.select({
			LdkVakkern: {
				...shortInfo,
				deprecated: _,
		  }
		})`,

		LdkVakkernByIdOpNiveau: `
		const results = from(data.NiveauIndex)
		.where({
			uuid : request.query.id
		})
		.select({
			LdkVakkern: {
				...shortInfo,
				deprecated: _,
				LdkVakleergebied: {
					...shortInfo,
						deprecated: _,
					},
					Doelniveau : o => from(o.Doelniveau)			  
					.where({
						Niveau : { id: request.query.niveau }
					})
					.select({
						...Doelen
					})
				},
			LdkVaksubkern: {
				...shortInfo,
				deprecated: _,
			},
			Niveau: NiveauShort,
		})
		`,

		LdkVaksubkernOpNiveau: `
		const results = from(data.NiveauIndex)
		.where({
			uuid : request.query.id
		})
		.select({
			LdkVaksubkern :{
				...shortInfo,
				deprecated: _,
			}
		})
		`,

		LdkVaksubkernByIdOpNiveau: `
		const results = from(data.NiveauIndex)
		.where({
			uuid : request.query.id 
		})
		.select({
			LdkVaksubkern: {
				...shortInfo,
				deprecated: _,
				LdkVakkern: {
					...shortInfo,
					deprecated: _,
				},
				Doelniveau : o => from(o.Doelniveau)			  
					.where({
						Niveau : { id: request.query.niveau }
					})
					.select({
						...Doelen
					})
				,
				LdkVakinhoud: {
					...shortInfo,
					deprecated: _,
				},
				Niveau: NiveauShort
		  	}
		})
		`,

		LdkVakinhoudOpNiveau: `
		const results = from(data.NiveauIndex)
		.where({
			uuid : request.query.id 
		})
		.select({
			LdkVakinhoud: {
				...shortInfo,
				deprecated: _,
			}
		})
		`
	},
	typedQueries: {
		LdkVakleergebied: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			LdkVakkern: {
				...shortInfo,
				deprecated: _,
				Niveau: NiveauIndex
			},
			Doelniveau: Doelniveau,
			Niveau: NiveauIndex,
			Vakleergebied: {
				...shortInfo,
				deprecated: _,
			}
		})
		`,
		LdkVakkern: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			LdkVaksubkern: {
				...shortInfo,
				deprecated: _,
				Niveau: NiveauIndex
			},
			Doelniveau: Doelniveau,
			LdkVakleergebied: {
				...shortInfo,
				deprecated: _,
			},
			Niveau: NiveauIndex
		})
		`,
		LdkVaksubkern: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			deprecated: _,
			LdkVakinhoud: {
				...shortInfo,
				deprecated: _,
				Niveau: NiveauIndex
			},
			Doelniveau: Doelniveau,
			LdkVakkern: {
				...shortInfo,
				deprecated: _,
				LdkVakleergebied: {
					...shortInfo,
					deprecated: _,
				}
			},
			Niveau: NiveauIndex
		})
		`,
		LdkVakinhoud: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			Doelniveau: Doelniveau,
			LdkVaksubkern: {
				...shortInfo,
				deprecated: _,
				LdkVakkern: {
					...shortInfo,
					deprecated: _,
					LdkVakleergebied: {
						...shortInfo,
						deprecated: _,
					}
				}
			},
			Niveau: NiveauIndex
		})	
		`,
		LdkVakbegrip: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			ce_se: _,
			Doelniveau: Doelen
		})
		`
	},
	routes: {
		'ldk_vakleergebied/': (req) => opendata.api["LdkVakleergebied"](req.params, req.query),
		'ldk_vakkern/': (req) => opendata.api["LdkVakkern"](req.params, req.query),
		'ldk_vaksubkern/': (req) => opendata.api["LdkVaksubkern"](req.params, req.query),
		'ldk_vakinhoud/': (req) => opendata.api["LdkVakinhoud"](req.params, req.query),
		'ldk_vakbegrip/': (req) => opendata.api["LdkVakbegrip"](req.params, req.query),
		'niveau/:niveau/ldk_vakleergebied': (req) => opendata.api["LdkVakleergebiedOpNiveau"](req.params, req.query),
		'niveau/:niveau/ldk_vakleergebied/:id/doelen': (req) => opendata.api['DoelenOpNiveauByLdkVakleergebiedById'](req.params, req.query),
		'niveau/:niveau/ldk_vakleergebied/:id/': (req) => opendata.api["LdkVakleergebiedByIdOpNiveau"](req.params, req.query),
		'niveau/:niveau/ldk_vakkern': (req) => opendata.api["LdkVakkernOpNiveau"](req.params, req.query),
		'niveau/:niveau/ldk_vakkern/:id': (req) => opendata.api["LdkVakkernByIdOpNiveau"](req.params, req.query),
		'niveau/:niveau/ldk_vaksubkern': (req) => opendata.api["LdkVaksubkernOpNiveau"](req.params, req.query),
		'niveau/:niveau/ldk_vaksubkern/:id': (req) => opendata.api["LdkVaksubkernByIdOpNiveau"](req.params, req.query),
		'niveau/:niveau/ldk_vakinhoud': (req) => opendata.api["LdkVakinhoudOpNiveau"](req.params, req.query),
		'niveau/:niveau/ldk_vakinhoud/:id': (req) => opendata.api["LdkVakinhoudByIdOpNiveau"](req.params, req.query),
	}
};