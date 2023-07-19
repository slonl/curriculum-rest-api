module.exports = {
	context: 'referentiekader',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/referentiekader.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-referentiekader/context.json',
	fragments: ``,
	queries: {
		RefVakleergebied: `
			const results = from(data.RefVakleergebied)
				.select({
					'@id': Id,
					uuid: _.id,
					prefix: _,
					title: _,
					unreleased: _,
					description: _,					
					Vakleergebied: {
						'@id': Id,
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
					'@id': Id,
					uuid: _.id,
					prefix: _,
					title: _,
					unreleased: _,
					RefVakleergebied: {
						'@id': Id,
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
					'@id': Id,
					uuid: _.id,
					prefix: _,
					title: _,
					unreleased: _,
					RefDomein: { 
						RefVakleergebied: {
							'@id': Id,
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
					'@id': Id,
					uuid: _.id,
					prefix: _,
					title: _,
					unreleased: _,
					RefSubdomein: {
						RefDomein: {
							RefVakleergebied: {
								'@id': Id,
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
					'@id': Id,
					uuid: _.id,
					prefix: _,
					title: _,
					unreleased: _,
					RefOnderwerp: {
						RefSubdomein: {
							RefDomein: {
								RefVakleergebied: {
									'@id': Id,
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
					'@id': Id,
					uuid: _.id,
					prefix: _,
					title: _,
					unreleased: _,
					RefOnderwerp: {
						RefSubdomein: {
							RefDomein: {
								RefVakleergebied: {
									'@id': Id,
									uuid: _.id,
									title: _,
									deprecated: _,
								}
							}
						}
					}
				})

				/*
				NiveauIndex: {
					Niveau: {
						NiveauShort
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
					'@id': Id,
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
					'@id': Id,
					uuid: _.id,
		      prefix: _,
		      title: _,
		      deprecated
		      RefSubdomein {
					'@id': Id,
					uuid: _.id,
		        prefix: _,
		        title: _,
		        deprecated
		        RefOnderwerp {
					'@id': Id,
					uuid: _.id,
		          prefix: _,
		          title: _,
		          deprecated
		          RefDeelonderwerp {
					'@id': Id,
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
		*/
	},

	typedQueries: {
		RefVakleergebied:`
			from(Index(request.query.id))
			.select({
					'@id': Id,
					uuid: _.id,
					prefix: _,
					title: _,
					RefDomein: {
							'@id': Id,
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
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				RefSubdomein: {
					'@id': Id,
					uuid: _.id,
					prefix: _,
					title: _,
					deprecated: _,
				}
				RefVakleergebied: {
					'@id': Id,
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
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			RefOnderwerp: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			RefDomein: {
				'@id': Id,
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
		RefOnderwerp: `
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			RefSubdomein: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			RefDeelonderwerp: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			RefTekstkenmerk: {
					'@id': Id,
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
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			RefOnderwerp: {
				'@id': Id,
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
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			RefOnderwerp {
				'@id': Id,
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
	
	},
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
		/* @TODO
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
};