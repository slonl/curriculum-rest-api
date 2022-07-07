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
	fragments: {
		LdkVakkern: `fragment LdkVakkern on LdkVakkern {
			id
			title
			prefix
			deprecated
		}`,
		LdkVaksubkern: `fragment LdkVaksubkern on LdkVaksubkern {
			id
			title
			prefix
			deprecated
		}`,
		LdkVakinhoud: `fragment LdkVakinhoud on LdkVakinhoud {
			id
			title
			prefix
			deprecated
		}`
	},
	queries: {
		LdkVakleergebied: `query LdkVakleergebied($page:Int,$perPage:Int) {
		  allLdkVakleergebied(page:$page,perPage:$perPage,sortField:"title",filter:{deprecated:false}) {
			id
			title
			NiveauIndex {
			  Niveau {
				...NiveauShort
			  }
			}
		  }
		  _allLdkVakleergebiedMeta {
			count
		  }
		}`,
		LdkVakkern: `query LdkVakkern($page:Int,$perPage:Int) {
		  allLdkVakkern(page:$page,perPage:$perPage,sortField:"title",filter:{deprecated:false}) {
			...LdkVakkern
			LdkVakleergebied {
			  id
			  title
			  deprecated
			}
			NiveauIndex {
			  Niveau {
				...NiveauShort
			  }
			}
		  }
		  _allLdkVakkernMeta {
			count
		  }
		}`,
		LdkVaksubkern: `query LdkVaksubkern($page:Int,$perPage:Int) {
		  allLdkVaksubkern(page:$page,perPage:$perPage,sortField:"title",filter:{deprecated:false}) {
			...LdkVaksubkern
			LdkVakkern {
			  LdkVakleergebied {
				id
				title
				deprecated
			  }
			}
			NiveauIndex {
			  Niveau {
				...NiveauShort
			  }
			}
		  }
		  _allLdkVaksubkernMeta {
			count
		  }
		}`,
		LdkVakinhoud: `query LdkVakinhoud($page:Int,$perPage:Int) {
		  allLdkVakinhoud(page:$page,perPage:$perPage,sortField:"title",filter:{deprecated:false}) {
			...LdkVakinhoud
			LdkVaksubkern {
			  LdkVakkern {
				LdkVakleergebied {
				  id
				  title
				  deprecated
				}
			  }
			}
			NiveauIndex {
			  Niveau {
				...NiveauShort
			  }
			}
		  }
		  _allLdkVakinhoudMeta {
			count
		  }
		}`,
		LdkVakbegrip: `query LdkVakbegrip($page:Int,$perPage:Int) {
		  allLdkVakbegrip(page:$page, perPage:$perPage,sortField:"title",filter:{deprecated:false}) {
			id
			title
			ce_se
			Doelniveau {
			  ...DoelNiveau
			}
		  }
		  _allLdkVakbegripMeta {
			count
		  }
		}`,

		DoelenOpNiveauByLdkVakleergebiedById: `query DoelenOpNiveauByLdkVakleergebiedById($id:ID, $niveau:ID) {
		  LdkVakleergebied(id:$id) {
			id
			title
			NiveauIndex(filter:{niveau_id:[$niveau]}) {
			  Niveau {
				...NiveauShort
			  }
			}
			LdkVakkern {
			  id
			  title
			  LdkVaksubkern {
				id
				title
				LdkVakinhoud {
				  id
				  title
				  Doelniveau(filter:{niveau_id:[$niveau]}) {
					...Doelen
				  }
				}
				Doelniveau(filter:{niveau_id:[$niveau]}) {
				  ...Doelen
				}
			  }
			  Doelniveau(filter:{niveau_id:[$niveau]}) {
				...Doelen
			  }
			}
		  }
		}`,


		LdkVakleergebiedOpNiveau: `query LdkVakleergebiedOpNiveau($niveau:ID) {
		  allNiveauIndex(filter:{niveau_id:[$niveau]}) {
			LdkVakleergebied {
			  id
			  title
			  deprecated
			}
		  }
		}`,
		LdkVakleergebiedByIdOpNiveau: `query LdkVakleergebiedByIdOpNiveau($niveau:ID, $id:ID) {
		  allNiveauIndex(filter:{niveau_id:[$niveau]}) {
			LdkVakleergebied(filter:{id:$id}) {
			  id
			  title
			  deprecated
			  Doelniveau(filter:{niveau_id:[$niveau]}) {
				...DoelNiveau
			  } 
			}
			LdkVakkern(filter:{ldk_vakleergebied_id:[$id]}) {
			  ...LdkVakkern
			}
			Niveau {
			  ...NiveauShort
			}
		  }
		}`,

		LdkVakkernOpNiveau: `query LdkVakkernOpNiveau($niveau:ID) {
		  allNiveauIndex(filter:{niveau_id:[$niveau]}) {
			LdkVakkern {
			  ...LdkVakkern
			}
		  }
		}`,
		LdkVakkernByIdOpNiveau: `query LdkVakkernByIdOpNiveau($niveau:ID, $id:ID) {
		  allNiveauIndex(filter:{niveau_id:[$niveau]}) {
			LdkVakkern(filter:{id:$id}) {
			  ...LdkVakkern
			  LdkVakleergebied {
				id
				title
				deprecated
			  }
			  Doelniveau(filter:{niveau_id:[$niveau]}) {
				...DoelNiveau
			  } 
			}
			LdkVaksubkern(filter:{ldk_vakkern_id:[$id]}) {
			  ...LdkVaksubkern
			}
			Niveau {
			  ...NiveauShort
			}
		  }
		}`,
		LdkVaksubkernOpNiveau: `query LdkVaksubkernOpNiveau($niveau:ID) {
		  allNiveauIndex(filter:{niveau_id:[$niveau]}) {
			LdkVaksubkern {
			  ...LdkVaksubkern
			}
		  }
		}`,
		LdkVaksubkernByIdOpNiveau: `query LdkVaksubkernByIdOpNiveau($niveau:ID, $id:ID) {
		  allNiveauIndex(filter:{niveau_id:[$niveau]}) {
			LdkVaksubkern(filter:{id:$id}) {
			  id
			  title
			  deprecated
			  LdkVakkern {
				...LdkVakkern
			  }
			  Doelniveau(filter:{niveau_id:[$niveau]}) {
				...DoelNiveau
			  } 
			}
			LdkVakinhoud(filter:{ldk_vaksubkern_id:[$id]}) {
			  ...LdkVakinhoud
			}
			Niveau {
			  ...NiveauShort
			}
		  }
		}`,

		LdkVakinhoudOpNiveau: `query LdkVakinhoudOpNiveau($niveau:ID) {
		  allNiveauIndex(filter:{niveau_id:[$niveau]}) {
			LdkVakinhoud {
			  ...LdkVakinhoud
			}
		  }
		}`
	},
	typedQueries: {
		'ldk_vakleergebied': `
			id
			title
			LdkVakkern {
				...LdkVakkern
				NiveauIndex {
					Niveau {
						...NiveauShort
					}
				}
			}
			Doelniveau {
				...DoelNiveau
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
			Vakleergebied {
				id
				title
				deprecated
			}
		`,
		'ldk_vakkern': `
			id
			title
			prefix
			LdkVaksubkern {
				...LdkVaksubkern
				NiveauIndex {
					Niveau {
						...NiveauShort
					}
				}
			}
			Doelniveau {
				...DoelNiveau
			}
			LdkVakleergebied {
				id
				title
				deprecated
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		`,
		'ldk_vaksubkern': `
			...LdkVaksubkern
			LdkVakinhoud {
				...LdkVakinhoud
				NiveauIndex {
					Niveau {
						...NiveauShort
					}
				}
			}
			Doelniveau {
				...DoelNiveau
			}
			LdkVakkern {
				...LdkVakkern
				LdkVakleergebied {
					id
					title
					deprecated
				}
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		`,
		'ldk_vakinhoud': `
			id
			title
			prefix
			Doelniveau {
				...DoelNiveau
			}
			LdkVaksubkern {
				...LdkVaksubkern
				LdkVakkern {
					...LdkVakkern
					LdkVakleergebied {
						id
						title
						deprecated
					}
				}
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		`,
		'ldk_vakbegrip': `
			id
			title
			ce_se
			Doelniveau {
				...Doelen
			}
		`
	},
	idQuery: `
		allLdkVakleergebied(filter:{id:$id}) {
			id
			title
			LdkVakkern {
				...LdkVakkern
				NiveauIndex {
					Niveau {
						...NiveauShort
					}
				}
			}
			Doelniveau {
				...DoelNiveau
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
			Vakleergebied {
				id
				title
			}
		}
		allLdkVakkern(filter:{id:$id}) {
			id
			title
			prefix
			LdkVaksubkern {
				...LdkVaksubkern
				NiveauIndex {
					Niveau {
						...NiveauShort
					}
				}
			}
			Doelniveau {
				...DoelNiveau
			}
			LdkVakleergebied {
				id
				title
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		}
		allLdkVaksubkern(filter:{id:$id}) {
			...LdkVaksubkern
			LdkVakinhoud {
				...LdkVakinhoud
				NiveauIndex {
					Niveau {
						...NiveauShort
					}
				}
			}
			Doelniveau {
				...DoelNiveau
			}
			LdkVakkern {
				...LdkVakkern
				LdkVakleergebied {
					id
					title
				}
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		}
		allLdkVakinhoud(filter:{id:$id}) {
			id
			title
			prefix
			Doelniveau {
				...DoelNiveau
			}
			LdkVaksubkern {
				...LdkVaksubkern
				LdkVakkern {
					...LdkVakkern
					LdkVakleergebied {
						id
						title
					}
				}
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		}
		allLdkVakbegrip(filter:{id:$id}) {
			id
			title
			ce_se
			Doelniveau {
				...Doelen
			}
		}
	`,
	routes: {
		'ldk_vakleergebied/': (req) =>
			opendata.api["LdkVakleergebied"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allLdkVakleergebied,
					meta: result.data._allLdkVakleergebiedMeta
				}
			}),
		'ldk_vakkern/': (req) =>
			opendata.api["LdkVakkern"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allLdkVakkern,
					meta: result.data._allLdkVakkernMeta
				}
			}),
		'ldk_vaksubkern/': (req) =>
			opendata.api["LdkVaksubkern"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allLdkVaksubkern,
					meta: result.data._allLdkVaksubkernMeta
				}
			}),
		'ldk_vakinhoud/': (req) =>
			opendata.api["LdkVakinhoud"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allLdkVakinhoud, 
					meta: result.data._allLdkVakinhoudMeta
				}
			}),
		'ldk_vakbegrip/': (req) =>
			opendata.api["LdkVakbegrip"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allLdkVakbegrip,
					meta: result.data._allLdkVakbegripMeta
				}
			}),
		'niveau/:niveau/ldk_vakleergebied': (req) =>
			opendata.api["LdkVakleergebiedOpNiveau"](req.params)
			.then(function(result) {
				return {
					data: result.data.allNiveauIndex[0].LdkVakleergebied,
					type: 'LdkVakleergebied'
				};
			}),
		'niveau/:niveau/ldk_vakleergebied/:id/doelen': (req) =>
			opendata.api['DoelenOpNiveauByLdkVakleergebiedById'](req.params)
			.then(function(result) {
				if (!result.data.LdkVakleergebied) {
					throw new Error('LdkVakleergebied not found: '+req.params.id, 404);
				}
				result.data.LdkVakleergebied.Niveau = result.data.LdkVakleergebied.NiveauIndex[0].Niveau;
				FilterEmptyDoelniveau(result.data.LdkVakleergebied);
				return {
					data: result.data.LdkVakleergebied,
					type: 'LdkVakleergebied'
				}
			}),
		'niveau/:niveau/ldk_vakleergebied/:id/': (req) =>
			opendata.api["LdkVakleergebiedByIdOpNiveau"](req.params)
			.then(function(result) {
				if (!result.data.allNiveauIndex[0]) {
					throw new Error('Niveau not found: '+req.params.niveau, 404);
				}
				if (!result.data.allNiveauIndex[0].LdkVakleergebied[0]) {
					throw new Error('LdkVakleergebied not found: '+req.params.id, 404);
				}
				result.data.allNiveauIndex[0].LdkVakleergebied[0].LdkVakkern = result.data.allNiveauIndex[0].LdkVakkern;
				result.data.allNiveauIndex[0].LdkVakleergebied[0].Niveau = result.data.allNiveauIndex[0].Niveau;
				return {
					data: result.data.allNiveauIndex[0].LdkVakleergebied[0],
					type: 'LdkVakleergebied'
				}
			}),
		'niveau/:niveau/ldk_vakkern': (req) =>
			opendata.api["LdkVakkernOpNiveau"](req.params)
			.then(function(result) {
				return {
					data: result.data.allNiveauIndex[0].LdkVakkern,
					type: 'LdkVakkern'
				};
			}),
		'niveau/:niveau/ldk_vakkern/:id': (req) =>
			opendata.api["LdkVakkernByIdOpNiveau"](req.params)
			.then(function(result) {
				result.data.allNiveauIndex[0].LdkVakkern[0].LdkVaksubkern = result.data.allNiveauIndex[0].LdkVaksubkern;
				result.data.allNiveauIndex[0].LdkVakkern[0].Niveau = result.data.allNiveauIndex[0].Niveau;
				return {
					data: result.data.allNiveauIndex[0].LdkVakkern[0], 
					type: 'LdkVakkern'
				};
			}),
		'niveau/:niveau/ldk_vaksubkern': (req) =>
			opendata.api["LdkVaksubkernOpNiveau"](req.params)
			.then(function(result) {
				return {
					data: result.data.allNiveauIndex[0].LdkVaksubkern,
					type: 'LdkVaksubkern'
				};
			}),
		'niveau/:niveau/ldk_vaksubkern/:id': (req) =>
			opendata.api["LdkVaksubkernByIdOpNiveau"](req.params)
			.then(function(result) {
				result.data.allNiveauIndex[0].LdkVaksubkern[0].LdkVakinhoud = result.data.allNiveauIndex[0].LdkVakinhoud;
				result.data.allNiveauIndex[0].LdkVaksubkern[0].Niveau = result.data.allNiveauIndex[0].Niveau;
				return {
					data: result.data.allNiveauIndex[0].LdkVaksubkern[0],
					type: 'LdkVaksubkern'
				};
			}),
		'niveau/:niveau/ldk_vakinhoud': (req) =>
			opendata.api["LdkVakinhoudOpNiveau"](req.params)
			.then(function(result) {
				return {
					data: result.data.allNiveauIndex[0].LdkVakinhoud,
					type: 'LdkVakinhoud'
				};
			}),
		'niveau/:niveau/ldk_vakinhoud/:id': (req) =>
			opendata.api["LdkVakinhoudByIdOpNiveau"](req.params)
			.then(function(result) {
				result.data.allNiveauIndex[0].LdkVakinhoud[0].Niveau = result.data.allNiveauIndex[0].Niveau;
				return {
					data: result.data.allNiveauIndex[0].LdkVakinhoud[0],
					type: 'LdkVakinhoud'
				};
			})
	}
};