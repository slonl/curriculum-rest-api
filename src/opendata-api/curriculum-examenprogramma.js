module.exports = {
	context: 'examenprogramma',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/examenprogramma.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-examenprogramma/context.json',
	fragments:`
		const SyllabusInfo = {
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ce_se: _,
			niveau_id: _,
			SyllabusVakbegrip: {
			  '@id': Id,
			  uuid: _.id,
			  prefix: _,
			  title: _,
			  ce_se: _,
			  deprecated: _,
			},
			SyllabusToelichting: {
			  '@id': Id,
			  uuid: _.id,
			  prefix: _,
			  title: _,
			  ce_se: _,
			  deprecated: _,
			},
			Syllabus: {
			  '@id': Id,
			  uuid: _.id,
			  title: _,
			  ce_se: _,
			  deprecated: _,
			  examenjaar: _,
				Niveau: {
				  NiveauShort
			  }
			}
		}`
	,
	queries: {
		ExamenprogrammaVakleergebied:`
		const results = from(data.ExamenprogrammaVakleergebied) 
		.select({
			'@id': Id,
			uuid: _.id,
			title: _,
		})
		
		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		Examenprogramma: `
		const results = from(data.Examenprogramma) 
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
		})
		
		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		ExamenprogrammaDomein: `
		const results = from(data.ExamenprogrammaDomein) 
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			Examenprogramma: {
			  '@id': Id,
			  title: _,
			  deprecated: _,
			}
		})
		  		
		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		ExamenprogrammaSubdomein: `
		const results = from(data.ExamenprogrammaSubdomein) 
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ExamenprogrammaDomein: {
			  '@id': Id,
			  uuid: _.id,
			  title: _,
			  deprecated: _,
			  Examenprogramma: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
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
		ExamenprogrammaEindterm: `
		const results = from(data.ExamenprogrammaEindterm) 
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
		})
		 		
		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		ExamenprogrammaKop1: `
		const results = from(data.ExamenprogrammaKop1) 
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			Examenprogramma:{
			  '@id': Id,
			  title: _,
			  deprecated: _,
			}
		})
				
		  const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		ExamenprogrammaKop2: `
		const results = from(data.ExamenprogrammaKop2) 
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
		})
		
		  const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		ExamenprogrammaKop3: `
		const results = from(data.ExamenprogrammaKop3) 
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
		})
		
		  const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		ExamenprogrammaKop4: `
		const results = from(data.ExamenprogrammaKop4) 
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
		})
		
		  const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		ExamenprogrammaBody: `
		const results = from(data.ExamenprogrammaBody) 
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
		})
		
		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		ExamenprogrammaVolledig: `
		const results = from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			NiveauIndex: {
			  Niveau: {
				NiveauShort
			  }
			},
			Syllabus: {
			  '@id': Id,
			  uuid: _.id,
			  title: _,
			  ce_se: _,
			  deprecated: _,
			  examenjaar: _,
			},
			ExamenprogrammaKop1: {
			  '@id': Id,
			  uuid: _.id,
			  title: _,
			  deprecated: _,
			  ExamenprogrammaKop2: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
				ExamenprogrammaKop3: {
				  '@id': Id,
				  uuid: _.id,
				  title: _,
				  deprecated: _,
				  ExamenprogrammaKop4: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
					ExamenprogrammaBody: {
					  '@id': Id,
					  uuid: _.id,
					  title: _,
					  ce_se: _,
					  deprecated: _,
					}
				  },
				  ExamenprogrammaBody: {
					'@id': Id,
					uuid: _.id,
					title: _,
					ce_se: _,
					deprecated: _,
				  }
				},
				ExamenprogrammaKop4: {
				  '@id': Id,
				  uuid: _.id,
				  title: _,
				  deprecated: _,
				  ExamenprogrammaBody: {
					'@id': Id,
					uuid: _.id,
					title: _,
					ce_se: _,
					deprecated: _,
				  }
				},
				ExamenprogrammaBody: {
				  '@id': Id,
				  uuid: _.id,
				  title: _,
				  ce_se: _,
				  deprecated: _,
				}
			},
			  ExamenprogrammaKop3: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
				ExamenprogrammaKop4: {
				  '@id': Id,
				  uuid: _.id,
				  title: _,
				  deprecated: _,
				  ExamenprogrammaBody: {
					'@id': Id,
					uuid: _.id,
					title: _,
					ce_se: _,
					deprecated: _,
				  }
				},
				ExamenprogrammaBody: {
				  '@id': Id,
				  uuid: _.id,
				  title: _,
				  ce_se: _,
				  deprecated: _,
				}
			  },
			  ExamenprogrammaBody: {
				'@id': Id,
				uuid: _.id,
				title: _,
				ce_se: _,
				deprecated: _,
			  }
			},
			ExamenprogrammaDomein: {
			  '@id': Id,
			  uuid: _.id,
			  title: _,
			  ce_se: _,
			  deprecated: _,
			  SyllabusSpecifiekeEindterm: {
				SyllabusInfo
			  },
			  SyllabusToelichting: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				ce_se: _,
				deprecated: _,
			  },
			  ExamenprogrammaSubdomein: {
				'@id': Id,
				uuid: _.id,
				title: _,
				ce_se: _,
				deprecated: _,
				ExamenprogrammaEindterm: {
				  '@id': Id,
				  uuid: _.id,
				  title: _,
				  ce_se: _,
				  deprecated: _,
				  SyllabusSpecifiekeEindterm: {
					SyllabusInfo
				  },
				  SyllabusVakbegrip: {
					'@id': Id,
					uuid: _.id,
					prefix: _,
					title: _,
					ce_se: _,
					deprecated: _,
				  },
				  Niveau: {
				    NiveauShort
				  },
				},
				SyllabusSpecifiekeEindterm: {
					SyllabusInfo
				},
				SyllabusToelichting: {
				  '@id': Id,
				  uuid: _.id,
				  prefix: _,
				  title: _,
				  ce_se: _,
				  deprecated: _,
				}
			  },
			  ExamenprogrammaEindterm: {
				'@id': Id,
				uuid: _.id,
				title: _,
				ce_se: _,
				deprecated: _,
				SyllabusSpecifiekeEindterm: {
					SyllabusInfo
			 	},
			    SyllabusVakbegrip: {
		          '@id': Id,
				  uuid: _.id,
		          prefix: _,
		          title: _,
				  ce_se: _,
				  deprecated: _,
		        },
				Niveau: {
				  NiveauShort
				}
			  },
			},
			ExamenprogrammaVakleergebied: {
			  '@id': Id,
			  uuid: _.id,
			  title: _,
			  deprecated: _,
			}
		})
		
		`
	},
	typedQueries: {
		ExamenprogrammaVakleergebied:`
			'@id': Id,
			uuid: _.id,
			title: _,
			Vakleergebied: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			}
			Examenprogramma: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			} 
		`,
		Examenprogramma:`
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ExamenprogrammaVakleergebied: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			}
			ExamenprogrammaDomein: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			ExamenprogrammaKop1: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			Syllabus: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			}
			Niveau: {
				NiveauShort
			}
		`,
		ExamenprogrammaDomein:`
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ce_se: _,
			Tag: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			}
			Examenprogramma: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			ExamenprogrammaSubdomein: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			ExamenprogrammaEindterm: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
				Niveau: {
					NiveauShort
				}
			}
			SyllabusToelichting: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			}
			SyllabusSpecifiekeEindterm: {
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
		`,
		ExamenprogrammaSubdomein:`
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ce_se: _,
			Tag: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			}
			ExamenprogrammaDomein: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
				Examenprogramma: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				}
			}
			ExamenprogrammaEindterm: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
				Niveau: {
					NiveauShort
				}
			}
			Doelniveau: {
				DoelNiveau
			}
			NiveauIndex: {
				Niveau: {
					NiveauShort
				}
			}
		`,
		ExamenprogrammaEindterm:`
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ce_se: _,
			ExamenprogrammaSubdomein: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
				ExamenprogrammaDomein: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
					Examenprogramma: {
						'@id': Id,
						uuid: _.id,
						title: _,
						deprecated: _,
					}
				}
			}
			ExamenprogrammaDomein: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
				Examenprogramma: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				}
			}
			SyllabusSpecifiekeEindterm: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			}
			SyllabusToelichting: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			}
			SyllabusVakbegrip: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			}
			Niveau: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			}
		`,
		ExamenprogrammaKop1:`
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			deprecated: _,
			Examenprogramma: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			ExamenprogrammaKop2: {	  
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			ExamenprogrammaBody: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
		`,
		ExamenprogrammaKop2:`
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ExamenprogrammaKop1: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
				Examenprogramma: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				}
			}
			ExamenprogrammaKop3: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			ExamenprogrammaBody: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
		`,
		ExamenprogrammaKop3:`
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ExamenprogrammaKop2: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			ExamenprogrammaKop4: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			ExamenprogrammaBody: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
		`,
		ExamenprogrammaKop4:`
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ExamenprogrammaKop3: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			ExamenprogrammaBody: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
		`,
		ExamenprogrammaBody:`
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ExamenprogrammaKop1: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
				Examenprogramma: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				}
			}
			ExamenprogrammaKop2: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			ExamenprogrammaKop3: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
			ExamenprogrammaKop4: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
		`
	},
	routes: {
		'examenprogramma_vakleergebied': (req) => opendata.api["ExamenprogrammaVakleergebied"](req.params, req.query),
		'examenprogramma': (req) => opendata.api["Examenprogramma"](req.params, req.query),
		'examenprogramma/:id': (req) =>	opendata.api["ExamenprogrammaVolledig"](req.params, req.query),
		'examenprogramma_domein': (req) => opendata.api["ExamenprogrammaDomein"](req.params, req.query),
		'examenprogramma_subdomein': (req) => opendata.api["ExamenprogrammaSubdomein"](req.params, req.query),
		'examenprogramma_eindterm': (req) => opendata.api["ExamenprogrammaEindterm"](req.params, req.query),
		'examenprogramma_kop1': (req) => opendata.api["ExamenprogrammaKop1"](req.params, req.query),
		'examenprogramma_kop2': (req) => opendata.api["ExamenprogrammaKop2"](req.params, req.query),
		'examenprogramma_kop3': (req) => opendata.api["ExamenprogrammaKop3"](req.params, req.query),
		'examenprogramma_kop4': (req) => opendata.api["ExamenprogrammaKop4"](req.params, req.query),
		'examenprogramma_body': (req) => opendata.api["ExamenprogrammaBody"](req.params, req.query)
	}
};