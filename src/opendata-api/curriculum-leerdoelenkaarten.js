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
			'@id': Id,
			uuid: _.id,
			title: _,
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
		LdkVakkern: `
		const results = from(data.LdkVakkern)
		.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			prefix: _,
			deprecated: _,
			LdkVakleergebied: {
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
		LdkVaksubkern: `
		const results = from(data.LdkVaksubkern)
		.select({		
			'@id': Id,
			uuid: _.id,
			title: _,
			prefix: _,
			deprecated: _,
			LdkVakkern: {
			  LdkVakleergebied: {
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
		LdkVakinhoud: `
		const results = from(data.LdkVakinhoud)
		.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			prefix: _,
			deprecated: _,
			LdkVaksubkern: {
			  LdkVakkern: {
				LdkVakleergebied: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				}
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
		LdkVakbegrip: `
		const results = from(data.LdkVakbegrip)
		.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			ce_se: _,
			Doelniveau: {
			  DoelNiveau
			}
		  })

		  const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,

		DoelenOpNiveauByLdkVakleergebiedById: `
		const results = from(data.DoelenOpNiveauByLdkVakleergebiedById)
		.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			NiveauIndex(filter:{niveau_id:[$niveau]}) {
			  Niveau: {
				NiveauShort
			  }
			},
			LdkVakkern: {
				'@id': Id,
				uuid: _.id,
				title: _,
			  LdkVaksubkern: {
					'@id': Id,
					uuid: _.id,
					title: _,
				LdkVakinhoud: {
					'@id': Id,
					uuid: _.id,
					title: _,
				  Doelniveau(filter:{niveau_id:[$niveau]}) {
						Doelen
				  }
				},
				Doelniveau(filter:{niveau_id:[$niveau]}) {
						Doelen
				},
			  },
			  Doelniveau(filter:{niveau_id:[$niveau]}) {
					Doelen
			  }
			}
		  }
		})
		`,


		LdkVakleergebiedOpNiveau: `
		const results = from(data.LdkVakleergebiedOpNiveau)
		.select({
			LdkVakleergebied: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			}
		  }
		}`,
		LdkVakleergebiedByIdOpNiveau: `
		const results = from(data.LdkVakleergebiedByIdOpNiveau)
		.select({
			LdkVakleergebied(filter:{id:$id}): {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
				Doelniveau(filter:{niveau_id:[$niveau]}): {
					DoelNiveau
				} 
			},
			LdkVakkern(filter:{ldk_vakleergebied_id:[$id]}): {
				'@id': Id,
				uuid: _.id,
				title: _,
				prefix: _,
				deprecated: _,
			},
			Niveau: {
					NiveauShort
			}
		  }
		}`,

		LdkVakkernOpNiveau: `
		const results = from(data.LdkVakkernOpNiveau)
		.select({
			LdkVakkern: {
				'@id': Id,
				uuid: _.id,
				title: _,
				prefix: _,
				deprecated: _,
			}
		  }
		}`,
		LdkVakkernByIdOpNiveau: `
		const results = from(data.LdkVakkernByIdOpNiveau
		.select({
			LdkVakkern(filter:{id:$id}): {
				'@id': Id,
				uuid: _.id,
				title: _,
				prefix: _,
				deprecated: _,
			  LdkVakleergebied: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
			  }
			  Doelniveau(filter:{niveau_id:[$niveau]}) {
					DoelNiveau
			  } 
			},
			LdkVaksubkern(filter:{ldk_vakkern_id:[$id]}) {
				'@id': Id,
				uuid: _.id,
				title: _,
				prefix: _,
				deprecated: _,
			},
			Niveau {
					NiveauShort
			}
		  }
		})
		`,
		LdkVaksubkernOpNiveau: `
		const results = from(data.LdkVaksubkernOpNiveau)
		.select({
			LdkVaksubkern :{
				'@id': Id,
				uuid: _.id,
				title: _,
				prefix: _,
				deprecated: _,
			}
		  }
		})
		`,
		LdkVaksubkernByIdOpNiveau: `
		const results = from(data.LdkVaksubkernByIdOpNiveau)
		.select({
			LdkVaksubkern(filter:{id:$id}) {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
				LdkVakkern: {
					'@id': Id,
					uuid: _.id,
					title: _,
					prefix: _,
					deprecated: _,
				}
				Doelniveau(filter:{niveau_id:[$niveau]}): {
					DoelNiveau
				} 
				}
				LdkVakinhoud(filter:{ldk_vaksubkern_id:[$id]}): {
					'@id': Id,
					uuid: _.id,
					title: _,
					prefix: _,
					deprecated: _,
				}
				Niveau: {
					NiveauShort
				}
		  }
		})
		`,

		LdkVakinhoudOpNiveau: `
		const results = from(data.LdkVakinhoudOpNiveau)
		.select({
			LdkVakinhoud: {
				'@id': Id,
				uuid: _.id,
				title: _,
				prefix: _,
				deprecated: _,
			}
		})
		`
	},
	typedQueries: {
		LdkVakleergebied: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			LdkVakkern: {
				'@id': Id,
				uuid: _.id,
				title: _,
				prefix: _,
				deprecated: _,
				NiveauIndex: {
					Niveau: {
						NiveauShort
					}
				}
			},
			Doelniveau: {
				Doelniveau
			},
			NiveauIndex: {
				Niveau: {
					NiveauShort
				}
			},
			Vakleergebied: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			}
		})
		`,
		LdkVakkern: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			prefix: _,
			LdkVaksubkern: {
				'@id': Id,
				uuid: _.id,
				title: _,
				prefix: _,
				deprecated: _,
				NiveauIndex: {
					Niveau: {
						NiveauShort
					}
				}
			}
			Doelniveau: {
				DoelNiveau
			}
			LdkVakleergebied: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			}
			NiveauIndex: {
				Niveau: {
					NiveauShort
				}
			}
		})
		`,
		LdkVaksubkern: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			prefix: _,
			deprecated: _,
			LdkVakinhoud: {
				'@id': Id,
				uuid: _.id,
				title: _,
				prefix: _,
				deprecated: _,
				NiveauIndex: {
					Niveau: {
						NiveauShort
					}
				}
			},
			Doelniveau: {
				DoelNiveau
			},
			LdkVakkern: {
				'@id': Id,
				uuid: _.id,
				title: _,
				prefix: _,
				deprecated: _,
				LdkVakleergebied: {
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
		`,
		LdkVakinhoud: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			prefix: _,
			Doelniveau: {
				DoelNiveau
			},
			LdkVaksubkern: {
				'@id': Id,
				uuid: _.id,
				title: _,
				prefix: _,
				deprecated: _,
				LdkVakkern: {
					'@id': Id,
					uuid: _.id,
					title: _,
					prefix: _,
					deprecated: _,
					LdkVakleergebied: {
						'@id': Id,
						uuid: _.id,
						title: _,
						deprecated: _,
					}
				}
			},
			NiveauIndex: {
				Niveau: {
					NiveauShort
				}
			}
		})	
		`,
		LdkVakbegrip: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			ce_se: _,
			Doelniveau: {
				Doelen
			}
		})
		`
	},
	routes: {
		'ldk_vakleergebied/': (req) => opendata.api["LdkVakleergebied"](req.params, req.query),
		'ldk_vakkern/': (req) => opendata.api["LdkVakkern"](req.params, req.query),
		'ldk_vaksubkern/': (req) => opendata.api["LdkVaksubkern"](req.params, req.query),
		'ldk_vakinhoud/': (req) => opendata.api["LdkVakinhoud"](req.params, req.query),
		'ldk_vakbegrip/': (req) => opendata.api["LdkVakbegrip"](req.params, req.query),

		//TODO check why som have req.query and some do not
		'niveau/:niveau/ldk_vakleergebied': (req) => opendata.api["LdkVakleergebiedOpNiveau"](req.params),
		'niveau/:niveau/ldk_vakleergebied/:id/doelen': (req) => opendata.api['DoelenOpNiveauByLdkVakleergebiedById'](req.params),
		'niveau/:niveau/ldk_vakleergebied/:id/': (req) => opendata.api["LdkVakleergebiedByIdOpNiveau"](req.params),
		'niveau/:niveau/ldk_vakkern': (req) => opendata.api["LdkVakkernOpNiveau"](req.params),
		'niveau/:niveau/ldk_vakkern/:id': (req) => opendata.api["LdkVakkernByIdOpNiveau"](req.params),
		'niveau/:niveau/ldk_vaksubkern': (req) => opendata.api["LdkVaksubkernOpNiveau"](req.params),
		'niveau/:niveau/ldk_vaksubkern/:id': (req) => opendata.api["LdkVaksubkernByIdOpNiveau"](req.params),
		'niveau/:niveau/ldk_vakinhoud': (req) => opendata.api["LdkVakinhoudOpNiveau"](req.params),
		'niveau/:niveau/ldk_vakinhoud/:id': (req) => opendata.api["LdkVakinhoudByIdOpNiveau"](req.params),
	}
};