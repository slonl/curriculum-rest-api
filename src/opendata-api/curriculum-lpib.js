function FilterEmptyDoelniveau(ent) {
	var found = false;
	['LpibVakkern','LpibVaksubkern','LpibVakinhoud'].forEach(function(type) {
		if (ent[type]) {
			ent[type] = ent[type].filter(FilterEmptyDoelniveau);
			if (!ent[type].length) {
				delete ent[type];
			} else {
				found = true;
			}
		}
	});
	if (ent.Doelniveau && ent.Doelniveau.length) {
		found = true;
	}
	return found;
}

module.exports = {
	context: 'lpib',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/lpib.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-lpib/context.json',
	queries: {
		LpibVakleergebied: `query LpibVakleergebied($page:Int,$perPage:Int) {
		  allLpibVakleergebied(page:$page,perPage:$perPage,sortField:"title") {
			id
			title
			Niveau {
			  ...NiveauShort
			}
		  }
		  _allLpibVakleergebiedMeta {
			count
		  }
		}`,
		LpibVakleergebiedById: `query LpibVakleergebiedById($id:ID) {
		  LpibVakleergebied(id:$id) {
			id
			title
			description
			replaces
			LpibVakkern {
			  id
			  title
			}
			Niveau {
			  ...NiveauShort
			}
			Vakleergebied {
			  id
			  title
			  prefix
			}
		  }
		}`,
		LpibVakkencluster: `query LpibVakkencluster($page:Int,$perPage:Int) {
		  allLpibVakkencluster (page:$page,perPage:$perPage,sortField:"title") {
			id
			title
			Niveau {
			  ...NiveauShort
			}
		  }
		  _allLpibVakkenclusterMeta {
			count
		  }
		}`,
		LpibLeerlijn: `query LpibLeerlijn($page:Int,$perPage:Int) {
		  allLpibLeerlijn (page:$page,perPage:$perPage,sortField:"title") {
			id
			title
			Niveau {
			  ...NiveauShort
			}
		  }
		  _allLpibLeerlijnMeta {
			count
		  }
		}`,
		LpibVakkern: `query LpibVakkern($page:Int,$perPage:Int) {
		  allLpibVakkern(page:$page,perPage:$perPage,sortField:"title") {
			id
			title
			LpibVakleergebied {
			  id
			  title
			}
			NiveauIndex {
			  Niveau {
				...NiveauShort
			  }
			}
		  }
		  _allLpibVakkernMeta {
			count
		  }
		}`,
		LpibVakkernById: `query LpibVakkernById($id:ID) {
		  LpibVakkern(id:$id) {
			id
			title
			description
			replaces
			LpibVaksubkern {
			  id
			  title
			}
			Doelniveau {
			  ...DoelNiveau
			}
			LpibVakleergebied {
			  id
			  title
			}
			NiveauIndex {
			  Niveau {
				...NiveauShort
			  }
			}
		  }
		}`,
		LpibVaksubkern: `query LpibVaksubkern($page:Int,$perPage:Int) {
		  allLpibVaksubkern(page:$page,perPage:$perPage,sortField:"title") {
			id
			title
			LpibVakkern {
			  id
			  title
			  LpibVakleergebied {
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
		  _allLpibVaksubkernMeta {
			count
		  }
		}`,
		LpibVaksubkernById: `query LpibVaksubkernById($id:ID) {
		  LpibVaksubkern(id:$id) {
			id
			title
			description
			LpibVakinhoud {
			  id
			  title
			}
			
			replaces
			Doelniveau {
			  ...DoelNiveau
			}
			LpibVakkern {
			  id
			  title
			}
			NiveauIndex {
			  Niveau {
				...NiveauShort
			  }
			}
		  }
		}`,
		LpibVakinhoud: `query LpibVakinhoud($page:Int,$perPage:Int) {
		  allLpibVakinhoud(page:$page,perPage:$perPage,sortField:"title") {
			id
			title
			LpibVaksubkern {
			  id
			  title
			  LpibVakkern {
				id
				title
				LpibVakleergebied {
				  id
				  title
				}
			  }
			}
			LpibVakkern {
			  id
			  title
			  LpibVakleergebied {
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
		  _allLpibVakinhoudMeta {
			count
		  }
		}`,
		LpibVakinhoudById: `query LpibVakinhoudById($id:ID) {
		  LpibVakinhoud(id:$id) {
			id
			title
			description
			replaces
			Doelniveau {
			  ...DoelNiveau
			}
			LpibVaksubkern {
			  id
			  title
			}
			NiveauIndex {
			  Niveau {
				...NiveauShort
			  }
			}
		  }
		}`,
		LpibVakleergebiedOpNiveau: `query LpibVakleergebiedOpNiveau($niveau:ID) {
		  allNiveau(filter:{id:$niveau}) {
			LpibVakleergebied {
			  id
			  title
			}
		  }
		}`,
		LpibVakleergebiedByIdOpNiveau: `query LpibVakleergebiedByIdOpNiveau($niveau:ID, $id:ID) {
		  allNiveau(filter:{id:$niveau}) {
			LpibVakleergebied(filter:{id:$id}) {
			  id
			  title
			}
			...NiveauShort
		  }
		  allNiveauIndex(filter:{niveau_id:[$niveau]}) {
			LpibVakkern(filter:{lpib_vakleergebied_id:[$id]}) {
			  id
			  title
			}
		  }
		}`,
		LpibVakkernOpNiveau: `query LpibVakkernOpNiveau($niveau:ID) {
		  allNiveauIndex(filter:{niveau_id:[$niveau]}) {
			LpibVakkern {
			  id
			  title
			}
		  }
		}`,
		LpibVakkernByIdOpNiveau: `query LpibVakkernByIdOpNiveau($niveau:ID, $id:ID) {
		  allNiveauIndex(filter:{niveau_id:[$niveau]}) {
			LpibVakkern(filter:{id:$id}) {
			  id
			  title
			  LpibVakleergebied {
				id
				title
			  }
			  Doelniveau(filter:{niveau_id:[$niveau]}) {
				...DoelNiveau
			  } 
			}
			LpibVaksubkern(filter:{lpib_vakkern_id:[$id]}) {
			  id
			  title
			}
			Niveau {
			  ...NiveauShort
			}
		  }
		}`,
		LpibVaksubkernOpNiveau: `query LpibVaksubkernOpNiveau($niveau:ID) {
		  allNiveauIndex(filter:{niveau_id:[$niveau]}) {
			LpibVaksubkern {
			  id
			  title
			}
		  }
		}`,
		LpibVaksubkernByIdOpNiveau: `query LpibVaksubkernByIdOpNiveau($niveau:ID, $id:ID) {
		  allNiveauIndex(filter:{niveau_id:[$niveau]}) {
			LpibVaksubkern(filter:{id:$id}) {
			  id
			  title
			  LpibVakkern {
				id
				title
			  }
			  Doelniveau(filter:{niveau_id:[$niveau]}) {
				...DoelNiveau
			  } 
			}
			LpibVakinhoud(filter:{lpib_vaksubkern_id:[$id]}) {
			  id
			  title
			}
			Niveau {
			  ...NiveauShort
			}
		  }
		}`,
		LpibVakinhoudOpNiveau: `query LpibVakinhoudOpNiveau($niveau:ID) {
		  allNiveauIndex(filter:{niveau_id:[$niveau]}) {
			LpibVakinhoud {
			  id
			  title
			}
		  }
		}`,
		LpibVakinhoudByIdOpNiveau: `query LpibVakinhoudByIdOpNiveau($niveau:ID, $id:ID) {
		  allNiveauIndex(filter:{niveau_id:[$niveau]}) {
			LpibVakinhoud(filter:{id:$id}) {
			  id
			  title
			  LpibVaksubkern {
				id
				title
			  }
			  Doelniveau(filter:{niveau_id:[$niveau]}) {
				...DoelNiveau
			  }
			}
			Niveau {
			  ...NiveauShort
			}
		  }
		}`,
		LpibLeerlijnOpNiveau: `query LpibLeerlijnOpNiveau($id:ID) {
		  allLpibLeerlijn(filter:{niveau_id:[$id]}) {
			id
			title
		  }
		  _allLpibLeerlijnMeta(filter:{niveau_id:[$id]}) {
			count
		  }
		}`,
		LpibVakkenclusterOpNiveau: `query LpibVakkenclusterOpNiveau($id:ID) {
		  allLpibVakkencluster(filter:{niveau_id:[$id]}) {
			id
			title
		  }
		  _allLpibVakkenclusterMeta(filter:{niveau_id:[$id]}) {
			count
		  }
		}`,

		DoelenOpNiveauByLpibVakleergebiedById: `query DoelenOpNiveauByLpibVakleergebiedById($id:ID, $niveau:ID) {
		  LpibVakleergebied(id:$id) {
			id
			title
			Niveau(filter:{id:$niveau}) {
			  id
			  title
			}
			LpibVakkern {
			  id
			  title
			  LpibVaksubkern {
				id
				title
				LpibVakinhoud {
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
			  LpibVakinhoud {
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
		  }
		}`
	},
	typedQueries: {
		'lpib_vakleergebied': `
			id
			title
			description
			replaces
			Vakleergebied {
				id
				title
			}
			LpibVakkencluster {
				id
				title
			}
			LpibLeerlijn {
				id
				title
			}
			LpibVakkern {
				id
				title
				NiveauIndex {
					Niveau {
						...NiveauShort
					}
				}
			}
			Niveau {
				...NiveauShort
			}
		`,
		'lpib_vakkern': `
			id
			title
			description
			replaces
			LpibVaksubkern {
				id
				title
				NiveauIndex {
					Niveau {
						...NiveauShort
					}
				}
			}
			LpibVakinhoud {
				id
				title
				NiveauIndex {
					Niveau {
						...NiveauShort
					}
				}
			}
			Doelniveau {
				...DoelNiveau
			}
			LpibVakleergebied {
				id
				title
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		`,
		'lpib_vaksubkern': `
			id
			title
			description
			replaces
			LpibVakinhoud {
				id
				title
				NiveauIndex {
					Niveau {
						...NiveauShort
					}
				}
			}
			Doelniveau {
				...DoelNiveau
			}
			LpibVakkern {
				id
				title
				LpibVakleergebied {
					id
					title
				}
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		`,
		'lpib_vakinhoud': `
			id
			title
			description
			replaces
			Doelniveau {
				...DoelNiveau
			}
			LpibVakkern {
				id
				title
				LpibVakleergebied {
					id
					title
				}
			}
			LpibVaksubkern {
				id
				title
				LpibVakkern {
					id
					title
					LpibVakleergebied {
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
		`,
		'lpib_vakkencluster': `
			id
			title
			Niveau {
				id
				title
			}
			LpibVakleergebied {
				id
				title
				Niveau {
					...NiveauShort
				}
			}	
		`,
		'lpib_leerlijn': `
			id
			title
			LpibVakleergebied {
				id
				title
				Niveau {
					...NiveauShort
				}
			}
			Doelniveau {
				...DoelNiveau
			}
			Niveau {
				id
				title
			}
		`
	},
	idQuery: `
		allLpibVakleergebied(filter:{id:$id}) {
			id
			title
			description
			replaces
			Vakleergebied {
				id
				title
			}
			LpibVakkencluster {
				id
				title
			}
			LpibLeerlijn {
				id
				title
			}
			LpibVakkern {
				id
				title
				NiveauIndex {
					Niveau {
						...NiveauShort
					}
				}
			}
			Niveau {
				...NiveauShort
			}
		}
		allLpibVakkern(filter:{id:$id}) {
			id
			title
			description
			replaces
			LpibVaksubkern {
				id
				title
				NiveauIndex {
					Niveau {
						...NiveauShort
					}
				}
			}
			LpibVakinhoud {
				id
				title
				NiveauIndex {
					Niveau {
						...NiveauShort
					}
				}
			}
			Doelniveau {
				...DoelNiveau
			}
			LpibVakleergebied {
				id
				title
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		}
		allLpibVaksubkern(filter:{id:$id}) {
			id
			title
			description
			replaces
			LpibVakinhoud {
				id
				title
				NiveauIndex {
					Niveau {
						...NiveauShort
					}
				}
			}
			Doelniveau {
				...DoelNiveau
			}
			LpibVakkern {
				id
				title
				LpibVakleergebied {
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
		allLpibVakinhoud(filter:{id:$id}) {
			id
			title
			description
			replaces
			Doelniveau {
				...DoelNiveau
			}
			LpibVakkern {
				id
				title
				LpibVakleergebied {
					id
					title
				}
			}
			LpibVaksubkern {
				id
				title
				LpibVakkern {
					id
					title
					LpibVakleergebied {
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
		allLpibVakkencluster(filter:{id:$id}) {
			id
			title
			Niveau {
				id
				title
			}
			LpibVakleergebied {
				id
				title
				Niveau {
					...NiveauShort
				}
			}	
		}
		allLpibLeerlijn(filter:{id:$id}) {
			id
			title
			LpibVakleergebied {
				id
				title
				Niveau {
					...NiveauShort
				}
			}
			Doelniveau {
				...DoelNiveau
			}
			Niveau {
				id
				title
			}
		}
	`,
	routes: {
		'lpib_vakkencluster/': (req) =>
			opendata.api["LpibVakkencluster"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allLpibVakkencluster, 
					type: 'LpibVakkencluster',
					meta: result.data._allLpibVakkenclusterMeta
				}
			}),
		'lpib_leerlijn/': (req) =>
			opendata.api["LpibLeerlijn"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allLpibLeerlijn,
					type: 'LpibLeerlijn',
					meta: result.data._allLpibLeerlijnMeta
				}
			}),
		'niveau/:id/lpib_vakkencluster/': (req) =>
			opendata.api["LpibVakkenclusterByNiveau"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allLpibVakkencluster,
					type: 'LpibVakkencluster',
					meta: result.data._allLpibVakkenclusterMeta
				}
			}),
		'lpib_vakleergebied/': (req) =>
			opendata.api["LpibVakleergebied"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allLpibVakleergebied, 
					type: 'LpibVakleergebied',
					meta: result.data._allLpibVakleergebiedMeta
				}
			}),
		'lpib_vakkern/': (req) => 
			opendata.api["LpibVakkern"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allLpibVakkern, 
					type: 'LpibVakkern',
					meta: result.data._allLpibVakkernMeta
				}
			}),
		'lpib_vaksubkern/': (req) =>
			opendata.api["LpibVaksubkern"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allLpibVaksubkern,
					type: 'LpibVaksubkern',
					meta: result.data._allLpibVaksubkernMeta
				}
			}),
		'lpib_vakinhoud/': (req) =>
			opendata.api["LpibVakinhoud"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allLpibVakinhoud, 
					type: 'LpibVakinhoud',
					meta: result.data._allLpibVakinhoudMeta
				}
			}),
		'niveau/:niveau/lpib_vakleergebied': (req) =>
			opendata.api["LpibVakleergebiedOpNiveau"](req.params)
			.then(function(result) {
				return {
					data: result.data.allNiveau[0].LpibVakleergebied,
					type: 'LpibVakleergebied'
				}
			}),
		'niveau/:niveau/lpib_vakleergebied/:id': (req) =>
			opendata.api["LpibVakleergebiedByIdOpNiveau"](req.params)
			.then(function(result) {
				var vak = result.data.allNiveau[0].LpibVakleergebied[0];
				delete result.data.allNiveau[0].LpibVakleergebied;
				vak.LpibVakkern = result.data.allNiveauIndex[0].LpibVakkern;
				delete result.data.allNiveauIndex[0];
				vak.Niveau  = result.data.allNiveau;
				return {
					data: vak, 
					type: 'LpibVakleergebied'
				};
			}),
		'niveau/:niveau/lpib_vakleergebied/:id/doelen': (req) =>
			opendata.api['DoelenOpNiveauByLpibVakleergebiedById'](req.params)
			.then(function(result) {
				result.data.LpibVakleergebied.Niveau = result.data.LpibVakleergebied.Niveau[0];
				FilterEmptyDoelniveau(result.data.LpibVakleergebied);
				return {
					data: result.data.LpibVakleergebied,
					type: 'LpibVakleergebied'
				};
			}),
		'niveau/:niveau/lpib_vakkern': (req) =>
			opendata.api["LpibVakkernOpNiveau"](req.params)
			.then(function(result) {
				return {
					data: result.data.allNiveauIndex[0].LpibVakkern,
					type: 'LpibVakkern'
				};
			}),
		'niveau/:niveau/lpib_vakkern/:id': (req) =>
			opendata.api["LpibVakkernByIdOpNiveau"](req.params)
			.then(function(result) {
				result.data.allNiveauIndex[0].LpibVakkern[0].LpibVaksubkern = result.data.allNiveauIndex[0].LpibVaksubkern;
				result.data.allNiveauIndex[0].LpibVakkern[0].Niveau = result.data.allNiveauIndex[0].Niveau;
				return {
					data: result.data.allNiveauIndex[0].LpibVakkern[0],
					type: 'LpibVakkern'
				};
			}),
		'niveau/:niveau/lpib_vaksubkern': (req) =>
			opendata.api["LpibVaksubkernOpNiveau"](req.params)
			.then(function(result) {
				return {
					data: result.data.allNiveauIndex[0].LpibVaksubkern,
					type: 'LpibVaksubkern'
				};
			}),
		'niveau/:niveau/lpib_vaksubkern/:id': (req) =>
			opendata.api["LpibVaksubkernByIdOpNiveau"](req.params)
			.then(function(result) {
				result.data.allNiveauIndex[0].LpibVaksubkern[0].LpibVakinhoud = result.data.allNiveauIndex[0].LpibVakinhoud;
				result.data.allNiveauIndex[0].LpibVaksubkern[0].Niveau = result.data.allNiveauIndex[0].Niveau;
				return {
					data: result.data.allNiveauIndex[0].LpibVaksubkern[0],
					type: 'LpibVaksubkern'
				};
			}),
		'niveau/:niveau/lpib_vakinhoud': (req) =>
			opendata.api["LpibVakinhoudOpNiveau"](req.params)
			.then(function(result) {
				return {
					data: result.data.allNiveauIndex[0].LpibVakinhoud,
					type: 'LpibVakinhoud'
				};
			}),
		'niveau/:niveau/lpib_vakinhoud/:id': (req) =>
			opendata.api["LpibVakinhoudByIdOpNiveau"](req.params)
			.then(function(result) {
				result.data.allNiveauIndex[0].LpibVakinhoud[0].Niveau = result.data.allNiveauIndex[0].Niveau;
				return {
					data: result.data.allNiveauIndex[0].LpibVakinhoud[0],
					type: 'LpibVakinhoud'
				};
			})
	}
};