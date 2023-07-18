module.exports = {
	context: 'referentiekader',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/referentiekader.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-referentiekader/context.json',
	fragments: `
		const Doelniveau = {
			'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
			uuid: _.id,
			prefix: _,
			ce_se: _,
			Doel: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				title: _,
				description: _,
				vakbegrippen: _,
				bron: _,
				aanbodid: _,
				Leerlingtekst: {
					title: _,
					description: _
				}     
			},
			Niveau: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				title: _,
				description: _,
				prefix: _,
				type: _
			},
			Kerndoel: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				title: _,
				description: _,
				kerndoelLabel: _,
				prefix: _
			},
			ExamenprogrammaDomein: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				title: _,
				prefix: _,
			},
			ExamenprogrammaSubdomein: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				title: _,
				prefix: _,
			},
			ExamenprogrammaEindterm: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				title: _,
				prefix: _
			},
			LdkVakbegrip: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				title: _,
				ce_se: _
			}
		}
		const Doelen = {
			'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
			uuid: _.id,
			prefix: _,
			ce_se: _,
			Doel: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				title: _,
				description: _,
				bron: _,
				vakbegrippen: _,
				aanbodid: _,
				Leerlingtekst: {
					title: _,
					description: _,
				}     
			},
			Kerndoel: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				title: _,
				description: _,
				kerndoelLabel: _,
				prefix: _,
			},
			LdkVakbegrip: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				title: _,
				ce_se: _
			}
		}
		const Niveau = {
			'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
			uuid: _.id,S
			title: _,
			description: _,
			prefix: _,
			type: _
		}
		const NiveauShort = {
			'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
			uuid: _.id,
			title: _,
			prefix: _
		}
		const ShortLink = {
			'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
			uuid: _.id,
			title: _,
			deprecated: _
		}
		const PageSize = request.query.pageSize || 100
		const Page = request.query.page || 0
		const Paging = {
			start: Page*PageSize,
			end: (Page+1)*PageSize-1
		}
		const Index = id => meta.index.id.get('/uuid/'+id)?.deref()
	`,
	queries: {
		RefVakleergebied: `
			const results = from(data.RefVakleergebied)
				.select({
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
					prefix: _,
					title: _,
					unreleased: _,
					description: _,					
					Vakleergebied: {
						'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
						uuid: _.id,
						title: _,
						deprecated: _,
					}
				})
					/*
					NiveauIndex: {
						Niveau: {
							Niveau
						}
					}
					*/
				
				const meta = {
					data: results.slice(Paging.start,Paging.end),
					page: Page,
					count: results.length
				}

				meta

		`,
		RefDomein: `const results = from(data.RefDomein)
				.select({
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
					prefix: _,
					title: _,
					unreleased: _,
					RefVakleergebied: {
						'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
						uuid: _.id,
						title: _,
						deprecated: _,
					}
				})

					/*
					NiveauIndex: {
						Niveau: {
							NiveauShort
						}
					}
					*/
				
				const meta = {
					data: results.slice(Paging.start,Paging.end),
					page: Page,
					count: results.length
				}
	
				meta
		`,
		RefSubdomein: `const results = from(data.RefSubdomein)
				.select({
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
					prefix: _,
					title: _,
					unreleased: _,
					RefDomein: { 
						RefVakleergebied: {
							'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
							uuid: _.id,
							title: _,
							deprecated: _,
						}
					}		
				})
			
					/*
					NiveauIndex {
						Niveau {
							...NiveauShort
					}
					*/
				
				const meta = {
					data: results.slice(Paging.start,Paging.end),
					page: Page,
					count: results.length
				}

				meta
		`,
		RefOnderwerp: `const results = from(data.RefOnderwerp)
				.select({
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
					prefix: _,
					title: _,
					unreleased: _,
					RefSubdomein: {
						RefDomein: {
							RefVakleergebied: {
								'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
								uuid: _.id,
								title: _,
								deprecated: _,
							}
						}
					}
				})

				/*
				NiveauIndex {
					Niveau {
						...NiveauShort
					}
				}
				*/
			
				const meta = {
					data: results.slice(Paging.start,Paging.end),
					page: Page,
					count: results.length
				}

				meta
		`,
		RefDeelonderwerp: `const results = from(data.RefDeelonderwerp)
				.select({
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
					prefix: _,
					title: _,
					unreleased: _,
					RefOnderwerp: {
						RefSubdomein: {
							RefDomein: {
								RefVakleergebied: {
									'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
									uuid: _.id,
									title: _,
									deprecated: _,
								}
							}
						}
					}
				})

				/*
				NiveauIndex {
					Niveau {
						...NiveauShort
					}
				}
				*/
				
				const meta = {
					data: results.slice(Paging.start,Paging.end),
					page: Page,
					count: results.length
				}

				meta
		`,
		RefTekstkenmerk: `const results = from(data.RefTekstkenmerk)
				.select({
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
					prefix: _,
					title: _,
					unreleased: _,
					RefOnderwerp: {
						RefSubdomein: {
							RefDomein: {
								RefVakleergebied: {
									'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
									uuid: _.id,
									title: _,
									deprecated: _,
								}
							}
						}
					}
				})

				/*
				NiveauIndex {
					Niveau {
						...NiveauShort
					}
				}
				*/
			}
			const meta = {
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}

			meta
		`,
		/*
		ReferentiekaderVolledig: `const results = from(data.ReferentiekaderVolledig)
				.select({
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
		    		prefix: _,
		    		title: _,
		    		deprecated: _,
		    
					
			NiveauIndex(filter:{niveau_id:[$niveau]}) {
		      Niveau {
		        ...NiveauShort
		      }
		    }
		    RefDomein {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
		      prefix: _,
		      title: _,
		      deprecated
		      RefSubdomein {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
		        prefix: _,
		        title: _,
		        deprecated
		        RefOnderwerp {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
		          prefix: _,
		          title: _,
		          deprecated
		          RefDeelonderwerp {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
		            prefix: _,
		            title: _,
		            deprecated: _,
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
		      Doelniveau(filter:{niveau_id:[$niveau]}) {
		        ...Doelen
		      }
		    }
		    Doelniveau(filter:{niveau_id:[$niveau]}) {
		      ...Doelen
		    }
		  }
		}`
	},
	*/
	typedQueries: {
		RefVakleergebied:`
			from(Index(request.query.id))
			.select({
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
					prefix: _,
					title: _,
					RefDomein: {
							'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
							uuid: _.id,
							prefix: _,
							title: _,
							deprecated: _,
					},
					Doelniveau: {
						Doelniveau
					},
					/*
					NiveauIndex {
						Niveau: {
							NiveauShort
						}
					}
					*/
				})
		`,
		RefDomein: `
			from(Index(request.query.id))
			.select({
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				prefix: _,
				title: _,
				RefSubdomein: {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
					prefix: _,
					title: _,
					deprecated: _,
				}
				RefVakleergebied: {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
					prefix: _,
					title: _,
					deprecated: _,
				}
				Doelniveau: {
					Doelniveau
				}
				NiveauIndex: {
					Niveau: {
						NiveauShort
					}
				}
			})
		`,
		RefSubdomein: `
			'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
			uuid: _.id,
			prefix: _,
			title: _,
			RefOnderwerp: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			RefDomein: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			Doelniveau: {
				Doelniveau
			}
			NiveauIndex: {
				Niveau {
					NiveauShort
				}
			}
		`,
		RefOnderwerp: `
			'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
			uuid: _.id,
			prefix: _,
			title: _,
			RefSubdomein: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			RefDeelonderwerp: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			RefTekstkenmerk: {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			Doelniveau: {
				Doelniveau
			}
			NiveauIndex: {
				Niveau: {
					NiveauShort
				}
			}
		`,
		RefDeelonderwerp: `
			'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
			uuid: _.id,
			prefix: _,
			title: _,
			RefOnderwerp: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			Doelniveau: {
				Doelniveau
			}
			NiveauIndex: {
				Niveau: {
					NiveauShort
				}
			}
		`,
		RefTekstkenmerk: `
			'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
			uuid: _.id,
			prefix: _,
			title: _,
			RefOnderwerp {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			Doelniveau: {
				Doelniveau
			}
			NiveauIndex: {
				Niveau: {
					NiveauShort
				}
			}
		`
	},
	/*
	idQuery: `
		allRefVakleergebied(filter:{id:$id}) {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
			prefix: _,
			title: _,
			RefDomein {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
				prefix
				title
				deprecated
			}
			Doelniveau {
				...DoelNiveau
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		}
		allRefDomein(filter:{id:$id}) {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
			prefix
			title
			RefSubdomein {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
				prefix
				title
				deprecated
			}
			RefVakleergebied {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
				prefix
				title
				deprecated
			}
			Doelniveau {
				...DoelNiveau
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		}
		allRefSubdomein(filter:{id:$id}) {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
			prefix
			title
			RefOnderwerp {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
				prefix
				title
				deprecated
			}
			RefDomein {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
				prefix
				title
				deprecated
			}
			Doelniveau {
				...DoelNiveau
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		}
		allRefOnderwerp(filter:{id:$id}) {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
			prefix
			title
			RefSubdomein {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
				prefix
				title
				deprecated
			}
			RefDeelonderwerp {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
				prefix
				title
				deprecated
			}
			RefTekstkenmerk {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
				prefix
				title
				deprecated
			}
			Doelniveau {
				...DoelNiveau
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		}
		allRefDeelonderwerp(filter:{id:$id}) {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
			prefix
			title
			RefOnderwerp {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
				prefix
				title
				deprecated
			}
			Doelniveau {
				...DoelNiveau
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		}
		allRefTekstkenmerk(filter:{id:$id}) {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
			prefix
			title
			RefOnderwerp {
					'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
					uuid: _.id,
				prefix
				title
				deprecated
			}
			Doelniveau {
				...DoelNiveau
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		}
	`,
	*/
	routes: {
		'ref_vakleergebied/': (req) => 
		opendata.api["RefVakleergebied"](req.params, req.query)
		.then(function(result) {
			return {
				data: result, 
				type: 'RefVakleergebied'
			};
		}),
		'ref_domein/': (req) => 
		opendata.api["RefDomein"](req.params, req.query)
		.then(function(result) {
			return {
				data: result, 
				type: 'RefDomein'
			};
		}),
		'ref_subdomein/': (req) => 
		opendata.api["RefSubdomein"](req.params, req.query)
		.then(function(result) {
			return {
				data: result, 
				type: 'RefSubdomein'
			};
		}),
		'ref_onderwerp/': (req) => 
		opendata.api["RefOnderwerp"](req.params, req.query)
		.then(function(result) {
			return {
				data: result, 
				type: 'RefOnderwerp'
			};
		}),
		'ref_deelonderwerp/': (req) => 
		opendata.api["RefDeelonderwerp"](req.params, req.query)
		.then(function(result) {
			return {
				data: result, 
				type: 'RefDeelonderwerp'
			};
		}),
		'ref_tekstkenmerk': (req) => 
		opendata.api["RefTekstkenmerk"](req.params, req.query)
		.then(function(result) {
			return {
				data: result, 
				type: 'RefTekstkenmerk'
			};
		}),
		/*
		'niveau/:niveau/ref_vakleergebied/:id/doelen': (req) =>
			opendata.api["ReferentiekaderVolledig"](req.params)
			.then(function(result) {
				result.data.RefVakleergebied.Niveau = result.data.RefVakleergebied.NiveauIndex[0].Niveau[0];
				return {
					data: result.data.RefVakleergebied,
					type: 'Refvakleergebied'
				}
			})
			*/
		}
	}
};