module.exports = {
	context: 'basis',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/basis.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-basis/context.json',
	fragments: {
		DoelNiveau: `fragment DoelNiveau on Doelniveau {
			id
			prefix
			ce_se
			Doel {
				id
				title
				description
				vakbegrippen
				bron
				aanbodid
				Leerlingtekst {
					title
					description
				}     
			}
			Niveau {
				id
				title
				description
				prefix
				type
			}
			Kerndoel {
				id
				title
				description
				kerndoelLabel
				prefix
			}
			ExamenprogrammaDomein {
				id
				title
				prefix
			}
			ExamenprogrammaSubdomein {
				id
				title
				prefix
			}
			ExamenprogrammaEindterm {
				id
				title
				prefix
			}
			LdkVakbegrip {
				id
				title
				ce_se
			}
		}`,
		Doelen: `fragment Doelen on Doelniveau {
			id
			prefix
			ce_se
			Doel {
				id
				title
				description
				bron
				vakbegrippen
				aanbodid
				Leerlingtekst {
					title
					description
				}     
			}
			Kerndoel {
				id
				title
				description
				kerndoelLabel
				prefix
			}
			LdkVakbegrip {
				id
				title
				ce_se
			}
		}`,
		Niveau: `fragment Niveau on Niveau {
			 id
			 title
			 description
			 prefix
			 type
		}`,
		NiveauShort: `fragment NiveauShort on Niveau {
			id
			title
			prefix
		}`
	},
	queries: {
		DoelNiveau: `query DoelNiveau($page:Int,$perPage:Int) {
			allDoelniveau(page:$page,perPage:$perPage) {
				...DoelNiveau
			}
			_allDoelniveauMeta {
				count
			}
		}`,
		DoelNiveauById: `query DoelNiveauById($id:ID) {
			Doelniveau(id:$id) {
				...DoelNiveau
			}
		}`,
		Doel: `query Doel($page:Int,$perPage:Int) {
			allDoel(page:$page,perPage:$perPage,sortField:"title") {
				id
				title
			}
			_allDoelMeta {
				count
			}
		}`,
		DoelById: `query DoelById($id:ID) {
			Doel(id:$id) {
				id
				title
				description
				bron
				vakbegrippen				
				Doelniveau {
					id
					prefix
					ce_se
					Niveau {
						...Niveau
					}
				}
			}
		}`,
		Niveau: `query Niveau($page:Int,$perPage:Int) {
			allNiveau(page:$page,perPage:$perPage,sortField:"title") {
				id
				title
				description
				prefix
			}
			_allNiveauMeta {
				count
			}
		}`,
		NiveauById: `query NiveauById($id:ID) {
			Niveau(id:$id) {
				...Niveau
			}
		}`,
		NiveauVakleergebied: `query NiveauVakleergebied($page:Int,$perPage:Int) {
		   allNiveau(page:$page,perPage:$perPage,sortField:"title") {
			   id
			   title
			   Vakleergebied {
				 id
				 title
			   }
			   LpibVakleergebied {
				 id
				 title
			   }
			   ErkVakleergebied {
				 id
				 title
			   }
			   RefVakleergebied {
			     id
			     title
			  }
		   }
		   allNiveauIndex(page:$page, perPage:$perPage, sortField:"title") {
			 Niveau {
			   id
			   title
			 }
			   KerndoelVakleergebied {
				 id
				 title
			   }
			 ExamenprogrammaVakleergebied {
			   id
			   title
			 }
			 SyllabusVakleergebied {
			   id
			   title
			 }
			 LdkVakleergebied {
			   id
			   title
			 }
			 InhVakleergebied {
			   id
			   title
			 }
		   }
		}`,
		Vakleergebied: `query Vakleergebied($page:Int,$perPage:Int) {
			allVakleergebied(page:$page,perPage:$perPage,sortField:"title") {
				id
				prefix
				title
				prefix
				Niveau {
					...NiveauShort
				}
			}
			_allVakleergebiedMeta {
				count
			}
		}`,
		VakleergebiedById: `query VakleergebiedById($id:ID) {
			Vakleergebied(id:$id) {
				id
				title
				description
				prefix
				replaces
				Niveau {
					...NiveauShort
				}
				KerndoelVakleergebied {
					id
					title
				}
				ExamenprogrammaVakleergebied {
					id
					title
				}
				SyllabusVakleergebied {
					id
					title
				}
				ExamenprogrammaBgProfiel {
					id
					title
				}
				LdkVakleergebied {
					id
					title
				}
				InhVakleergebied {
					id
					title
				}
				RefVakleergebied {
					id
					title
				}
				ErkVakleergebied {
					id
					title
				}
				LpibVakleergebied {
					id
					title
				}
			}
		}`,
		Deprecated: `query Deprecated {
			allDeprecated {
				id
				title
				replacedBy
			}
		}`,
		DeprecatedById: `query DeprecatedById($id:ID) {
			Deprecated(id:$id) {
				id
				title
				description
				types
				replacedBy
				lpib_vakkern_id
				lpib_vaksubkern_id
				lpib_vakinhoud_id
				doelniveau_id
			}
		}`,

		VakleergebiedOpNiveau: `query VakleergebiedOpNiveau($niveau:ID) {
			allNiveau(filter:{id:$niveau}) {
				Vakleergebied {
					id
					title
				}
			}
		}`,
		VakleergebiedByIdOpNiveau: `query VakleergebiedByIdOpNiveau($niveau:ID, $id:ID) {
			allNiveau(filter:{id:$niveau}) {
				Vakleergebied(filter:{id:$id}) {
					id
					title
				}
				...NiveauShort
			}
			allNiveauIndex(filter:{niveau_id:[$niveau]}) {
				LpibVakkern(filter:{vakleergebied_id:[$id]}) {
					id
					title
				}
			}
		}`
	},
	idQuery: `
		allVakleergebied(filter:{id:$id}) {
			id
			prefix
			title
			description
			prefix
			replaces
			KerndoelVakleergebied {
				id
				title
			}
			ExamenprogrammaVakleergebied {
				id
				title
			}
			SyllabusVakleergebied {
				id
				title
			}
			ExamenprogrammaBgProfiel {
				id
				title
			}
			LdkVakleergebied {
				id
				title
			}
			InhVakleergebied {
				id
				title
			}
			RefVakleergebied {
				id
				title
			}
			ErkVakleergebied {
				id
				title
			}
			LpibVakleergebied {
				id
				title
			}
			Niveau {
				...NiveauShort
			}
		}
		allDoel(filter:{id:$id}) {
			id
			title
			description
			bron
			vakbegrippen
			Doelniveau {
				...DoelNiveau
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
				LpibVakinhoud {
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
				}
			}
		}
		allNiveau(filter:{id:$id}) {
			id
			prefix
			title
			description
			type
			prefix
			Vakleergebied {
				id
				title
			}
		}
		allDoelniveau(filter:{id:$id}) {
			...DoelNiveau
			LpibVakkern {
				id
				title
				Vakleergebied {
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
			LpibVakinhoud {
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
			}
			LdkVakleergebied {
				id
				title
			}
			LdkVakkern {
				id
				title
				LdkVakleergebied {
					id
					title
				}
			}
			LdkVaksubkern {
				id
				title
				LdkVakkern {
					id
					title
					LdkVakleergebied {
						id
						title
					}
				}
			}
			LdkVakinhoud {
				id
				title
				LdkVaksubkern {
					id
					title
					LdkVakkern {
						id
						title
						LdkVakleergebied {
							id
							title
						}
					}
				}
			}
		}
		allDeprecated(filter:{id:$id}) {
			id
			title
			description
			types
			replacedBy
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
			LpibVakinhoud {
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
			}
			Doelniveau {
				...DoelNiveau
			}
		}
	`,
	routes: {
		'niveau/:id': (req) => 
			opendata.api["NiveauById"](req.params)
			.then(function(result) {
				return {
					data: result.data.Niveau, 
					type: 'Niveau'
				};
			}),
		'niveau/': (req) =>
			opendata.api["Niveau"](req.params, req.query)
			.then(function(result) {
				return {
					data:   result.data.allNiveau, 
					type:   'Niveau', 
					meta:   result.data._allNiveauMeta
				}
			}),
		'deprecated/': (req) =>
			opendata.api["Deprecated"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allDeprecated,
					meta: result.data._allDeprecatedMeta
				};
			}),
		'deprecated/:id': (req) =>
			opendata.api["DeprecatedById"](req.params)
			.then(function(result) {
				return {
					data: result.data.Deprecated
				};
			}),
		'doel/': (req) =>
			opendata.api["Doel"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allDoel,
					type: 'Doel',
					meta: result.data._allDoelMeta
				};
			}),
		'doelniveau/': (req) =>
			opendata.api["DoelNiveau"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allDoelniveau,
					type: 'DoelNiveau', 
					meta: result.data._allDoelniveauMeta
				};
			}),
		'vakleergebied/': (req) => 
			opendata.api["Vakleergebied"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allVakleergebied, 
					type: 'Vakleergebied',
					meta: result.data._allVakleergebiedMeta
				};
			}),
		'niveau_vakleergebied/': (req) =>
			opendata.api["NiveauVakleergebied"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allNiveau,
					type: 'Niveau',
					meta: result.data._allNiveauMeta
				};
			}),
		'niveau/:niveau/vakleergebied/': (req) =>
			opendata.api["VakleergebiedOpNiveau"](req.params)
			.then(function(result) {
				return { 
					data: result.data.allNiveau[0].Vakleergebied,
					type: 'Vakleergebied'
				}
			}),
		'niveau/:niveau/vakleergebied/:id/': (req) =>
			opendata.api["VakleergebiedByIdOpNiveau"](req.params)
			.then(function(result) {
				var vak = result.data.allNiveau[0].Vakleergebied[0];
				delete result.data.allNiveau[0].Vakleergebied;
				vak.LpibVakkern = result.data.allNiveauIndex[0].LpibVakkern;
				delete result.data.allNiveauIndex[0];
				vak.Niveau  = result.data.allNiveau;
				return {
					data: vak,
					type: 'Vakleergebied'
				};
			})

	}
};
