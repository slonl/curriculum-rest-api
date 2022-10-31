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
			allDoelniveau(page:$page,perPage:$perPage,filter:{deprecated:null}) {
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
			allDoel(page:$page,perPage:$perPage,sortField:"title",filter:{deprecated:null}) {
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
			allNiveau(page:$page,perPage:$perPage,sortField:"title",filter:{deprecated:null}) {
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
		NiveauVakleergebied: `query NiveauVakleergebied($page:Int,$perPage:Int,) {
			allNiveau(page:$page,perPage:$perPage,sortField:"title",filter:{deprecated:null}) {
				id
				title
				Vakleergebied(filter:{deprecated:null}) {
					id
					title
				}
				ErkVakleergebied(filter:{deprecated:null}) {
					id
					title
				}
				RefVakleergebied(filter:{deprecated:null}) {
					id
					title
				}
			}
			allNiveauIndex(page:$page, perPage:$perPage, sortField:"title") {
				Niveau(filter:{deprecated:null}) {
					id
					title
				}
				KerndoelVakleergebied(filter:{deprecated:null}) {
					id
					title
				}
				ExamenprogrammaVakleergebied(filter:{deprecated:null}) {
					id
					title
				}
				SyllabusVakleergebied(filter:{deprecated:null}) {
					id
					title
				}
				LdkVakleergebied(filter:{deprecated:null}) {
					id
					title
				}
				InhVakleergebied(filter:{deprecated:null}) {
					id
					title
				}
				ErkVakleergebied(filter:{deprecated:null}) {
					id
					title
				}
				RefVakleergebied(filter:{deprecated:null}) {
					id
					title
				}
			}
		}`,
		Vakleergebied: `query Vakleergebied($page:Int,$perPage:Int) {
			allVakleergebied(page:$page,perPage:$perPage,sortField:"title",filter:{deprecated:null}) {
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
			}
		}`,
/*		Deprecated: `query Deprecated {
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
*/
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
		}`
	},
	typedQueries: {
		'vakleergebied': `
			id
			prefix
			title
			description
			prefix
			replaces
			KerndoelVakleergebied {
				id
				title
				deprecated
			}
			ExamenprogrammaVakleergebied {
				id
				title
				deprecated
			}
			SyllabusVakleergebied {
				id
				title
				deprecated
			}
			ExamenprogrammaBgProfiel {
				id
				title
				deprecated
			}
			LdkVakleergebied {
				id
				title
				deprecated
			}
			InhVakleergebied {
				id
				title
				deprecated
			}
			RefVakleergebied {
				id
				title
				deprecated
			}
			ErkVakleergebied {
				id
				title
				deprecated
			}
			Niveau {
				...NiveauShort
			}
		`,
		'doel':`
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
						deprecated
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
							deprecated
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
								deprecated
							}
						}
					}
				}
				LdkVakleergebied {
					id
					title
					deprecated
				}
				LdkVakkern {
					id
					title
					LdkVakleergebied {
						id
						title
						deprecated
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
							deprecated
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
								deprecated
							}
						}
					}
				}
			}
		`,
		'niveau':`
			id
			prefix
			title
			description
			type
			Vakleergebied {
				id
				title
				deprecated
			}
		`,
		'doelniveau':`
			...DoelNiveau
			LpibVakkern {
				id
				title
				Vakleergebied {
					id
					title
					deprecated
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
						deprecated
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
							deprecated
						}
					}
				}
			}
			LdkVakleergebied {
				id
				title
				deprecated
			}
			LdkVakkern {
				id
				title
				LdkVakleergebied {
					id
					title
					deprecated
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
						deprecated
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
							deprecated
						}
					}
				}
			}
		`
	},
	idQuery: `
		allVakleergebied(filter:{id:$id}) {
			id
			prefix
			title
			description
			prefix
			replaces
			replacedBy
			deprecated
			KerndoelVakleergebied {
				id
				title
				deprecated
			}
			ExamenprogrammaVakleergebied {
				id
				title
				deprecated
			}
			SyllabusVakleergebied {
				id
				title
				deprecated
			}
			ExamenprogrammaBgProfiel {
				id
				title
				deprecated
			}
			LdkVakleergebied {
				id
				title
				deprecated
			}
			InhVakleergebied {
				id
				title
				deprecated
			}
			RefVakleergebied {
				id
				title
				deprecated
			}
			ErkVakleergebied {
				id
				title
				deprecated
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
			replaces
			replacedBy
			deprecated
			Doelniveau {
				...DoelNiveau
				LdkVakleergebied {
					id
					title
					deprecated
				}
				LdkVakkern {
					id
					title
					LdkVakleergebied {
						id
						title
						deprecated
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
							deprecated
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
								deprecated
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
			replacedBy
			deprecated
			Vakleergebied {
				id
				title
				deprecated
			}
		}
		allDoelniveau(filter:{id:$id}) {
			...DoelNiveau
			replaces
			replacedBy
			deprecated
			LdkVakleergebied {
				id
				title
				deprecated
			}
			LdkVakkern {
				id
				title
				LdkVakleergebied {
					id
					title
					deprecated
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
						deprecated
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
							deprecated
						}
					}
				}
			}
		}
`,
/*		allDeprecated(filter:{id:$id}) {
			id
			title
			description
			types
			replaces
			replacedBy
			Doelniveau {
				...DoelNiveau
			}
		}
	`,
*/
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
/*
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
*/
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
				let merged = result.data.allNiveau;
				result.data.allNiveauIndex.forEach(ni => {
					let niveau = ni.Niveau;
					Object.keys(ni).forEach(k => {
						if (k!=='Niveau') {
							niveau[k] = ni[k];
						}
					});
					result.data.allNiveau.push(niveau);
				});
				return {
					data: merged,
					type: 'Niveau'
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
		'niveau/:niveau/vakleergebied/:id/': (req) => {
			return opendata.api["VakleergebiedByIdOpNiveau"](req.params)
			.then(function(result) {
				var vak = result.data.allNiveau[0].Vakleergebied[0];
				delete result.data.allNiveau[0].Vakleergebied;
				//vak.LpibVakkern = result.data.allNiveauIndex[0].LpibVakkern;
				//delete result.data.allNiveauIndex[0];
				vak.Niveau  = result.data.allNiveau;
				return {
					data: vak,
					type: 'Vakleergebied'
				};
			})
		}

	}
};
