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
		.select({
			...shortInfo,
			NiveauIndex: {
			  Niveau: NiveauShort
			}
		  })
		  .sort(sortByTitle)

		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		LdkVakkern: `
		const results = from(data.LdkVakkern)
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
		  .sort(sortByTitle)

		  const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		LdkVaksubkern: `
		const results = from(data.LdkVaksubkern)
		.select({		
			...shortInfo,
			deprecated: _,
			LdkVakkern: {
			  LdkVakleergebied: {
				...shortInfo,
				deprecated: _,
			  }
			},
			NiveauIndex: {
				Niveau: NiveauShort
			}
		  })
		  .sort(sortByTitle)

		  const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		LdkVakinhoud: `
		const results = from(data.LdkVakinhoud)
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
		.sort(sortByTitle)

		  const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		LdkVakbegrip: `
		const results = from(data.LdkVakbegrip)
		.select({
			...shortInfo,
			ce_se: _,
			Doelniveau: Doelniveau,
		  })
		  .sort(sortByTitle)

		  const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		// @ TODO : Check why the from(data.DoelenOpNiveauByLdkVakleergebiedById) doesn't exist
		DoelenOpNiveauByLdkVakleergebiedById: `
		const results = from(data.DoelenOpNiveauByLdkVakleergebiedById)
		.select({
			...shortInfo,
			NiveauIndex:{
			  Niveau: NiveauShort
			},
			LdkVakkern: {
				...shortInfo,
				LdkVaksubkern: {
					...shortInfo,
					LdkVakinhoud: {
						...shortInfo,
						Doelniveau: Doelen,
					},
					Doelniveau:	Doelen,
				},
				Doelniveau: Doelen,
			}
		})
		`,
		// @ TODO : Check why the from(data.LdkVakleergebiedOpNiveau) doesn't exist
		LdkVakleergebiedOpNiveau: `
		const results = from(data.LdkVakleergebiedOpNiveau)
		.select({
			LdkVakleergebied: {
				...shortInfo,
				deprecated: _,
			}
		})`,

		// @ TODO : Check why the from(data.LdkVakleergebiedByIdOpNiveau) doesn't exist
		LdkVakleergebiedByIdOpNiveau: `
		const results = from(data.LdkVakleergebiedByIdOpNiveau)
		.select({
			LdkVakleergebied: {
				...shortInfo,
				deprecated: _,
				Doelniveau: Doelniveau
			},
			LdkVakkern: {
				...shortInfo,
				deprecated: _,
			},
			Niveau: NiveauShort
		})`,

		// @ TODO : Check why the from(data.LdkVakkernOpNiveau) doesn't exist
		LdkVakkernOpNiveau: `
		const results = from(data.LdkVakkernOpNiveau)
		.select({
			LdkVakkern: {
				...shortInfo,
				deprecated: _,
			}
		  }
		}`,

		LdkVakkernByIdOpNiveau: `
		const results = from(data.LdkVakkernByIdOpNiveau)
		.select({
			LdkVakkern: {
				...shortInfo,
				deprecated: _,
				LdkVakleergebied: {
					...shortInfo,
						deprecated: _,
				}
				Doelniveau: Doelniveau,
			},
			LdkVaksubkern: {
				...shortInfo,
				deprecated: _,
			},
			Niveau NiveauShort,
		  }
		})
		`,

		LdkVaksubkernOpNiveau: `
		const results = from(data.LdkVaksubkernOpNiveau)
		.select({
			LdkVaksubkern :{
				...shortInfo,
				deprecated: _,
			}
		})
		`,

		LdkVaksubkernByIdOpNiveau: `
		const results = from(data.LdkVaksubkernByIdOpNiveau)
		.select({
			LdkVaksubkern: {
				...shortInfo,
				deprecated: _,
				LdkVakkern: {
					...shortInfo,
					deprecated: _,
				},
				Doelniveau:	Doelniveau
				},
				LdkVakinhoud: {
					...shortInfo,
					deprecated: _,
				},
				Niveau: NiveauShort
		  	}
		})
		`,

		LdkVakinhoudOpNiveau: `
		const results = from(data.LdkVakinhoudOpNiveau)
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
				NiveauIndex: {
					Niveau: NiveauShort
				}
			},
			Doelniveau: Doelniveau,
			NiveauIndex: {
				Niveau: NiveauShort
			},
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
				NiveauIndex: {
					Niveau: NiveauShort
				}
			},
			Doelniveau: Doelniveau,
			LdkVakleergebied: {
				...shortInfo,
				deprecated: _,
			},
			NiveauIndex: {
				Niveau: NiveauShort
			}
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
				NiveauIndex: {
					Niveau: NiveauShort
				}
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
			NiveauIndex: {
				Niveau: NiveauShort
			}
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
			NiveauIndex: {
				Niveau: NiveauShort
			}
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