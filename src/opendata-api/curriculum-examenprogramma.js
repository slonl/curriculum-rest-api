module.exports = {
	context: 'examenprogramma',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/examenprogramma.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-examenprogramma/context.json',
	fragments:`
		const shortInfo = {
		    '@id': Id,
		    '@type': Type,
		    uuid: _.id,
		    prefix: _,
		    title: _,
		};
		const SyllabusInfo = {
			...shortInfo,
			ce_se: _,
			niveau_id: _,
			SyllabusVakbegrip: {
				...shortInfo,
				ce_se: _,
			},
			SyllabusToelichting: {
				...shortInfo,
				ce_se: _,
			},
			Syllabus: {
				...shortInfo,
				ce_se: _,
				examenjaar: _,
				Niveau: NiveauShort
			}
		}`
	,
	queries: {
		ExamenprogrammaVakleergebied:`
		const results = from(data.ExamenprogrammaVakleergebied) 
		.select(shortInfo)
		
		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		Examenprogramma: `
		const results = from(data.Examenprogramma) 
		.select(shortInfo)
		
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
			...shortInfo,
			Examenprogramma: {
				'@id': Id,
				title: _,
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
			...shortInfo,
			ExamenprogrammaDomein: {
				...shortInfo,
				Examenprogramma: {
					...shortInfo
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
		.select(shortInfo)
		 		
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
			...shortInfo,
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
		.select(shortInfo)
		
		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		ExamenprogrammaKop3: `
		const results = from(data.ExamenprogrammaKop3) 
		.select(shortInfo)
		
		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		ExamenprogrammaKop4: `
		const results = from(data.ExamenprogrammaKop4) 
		.select(shortInfo)
		
		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		ExamenprogrammaBody: `
		const results = from(data.ExamenprogrammaBody) 
		.select(shortInfo)
		
		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		ExamenprogrammaVolledig: `
from(Index(request.query.id))
    .select({
		...shortInfo,
        NiveauIndex: {
            Niveau: NiveauShort
        },
        Syllabus: {
			...shortInfo,
            ce_se: _,
            examenjaar: _,
        },
        ExamenprogrammaKop1: {
			...shortInfo,
            ExamenprogrammaKop2: {
				...shortInfo,
                ExamenprogrammaKop3: {
					...shortInfo,
                    ExamenprogrammaKop4: {
						...shortInfo,
                        ExamenprogrammaBody: {
							...shortInfo,
                            ce_se: _,
                        }
                    },
                    ExamenprogrammaBody: {
						...shortInfo,
                        ce_se: _,
                    }
                },
                ExamenprogrammaKop4: {
					...shortInfo,
                    ExamenprogrammaBody: {
						...shortInfo,
                        ce_se: _,
                    }
                },
                ExamenprogrammaBody: {
					...shortInfo,
                    ce_se: _,
                }
            },
            ExamenprogrammaKop3: {
				...shortInfo,
                ExamenprogrammaKop4: {
					...shortInfo,
                    ExamenprogrammaBody: {
						...shortInfo,
                        ce_se: _,
                    }
                },
                ExamenprogrammaBody: {
					...shortInfo,
                    ce_se: _,
                }
            },
            ExamenprogrammaBody: {
				...shortInfo,
                ce_se: _,
            }
        },
        ExamenprogrammaDomein: {
			...shortInfo,
            ce_se: _,
            SyllabusSpecifiekeEindterm: SyllabusInfo,
            SyllabusToelichting: {
				...shortInfo,
                ce_se: _,
            },
            ExamenprogrammaSubdomein: {
				...shortInfo,
                ce_se: _,
                ExamenprogrammaEindterm: {
					...shortInfo,
                    ce_se: _,
                    SyllabusSpecifiekeEindterm: SyllabusInfo,
                    SyllabusVakbegrip: {
						...shortInfo,
                        ce_se: _,
                    },
                    Niveau: NiveauShort,
                },
                SyllabusSpecifiekeEindterm: SyllabusInfo,
                SyllabusToelichting: {
					...shortInfo,
                    ce_se: _,
                }
            },
            ExamenprogrammaEindterm: {
				...shortInfo,
                ce_se: _,
                SyllabusSpecifiekeEindterm: SyllabusInfo,
                SyllabusVakbegrip: {
	    			...shortInfo,
                    ce_se: _,
                },
                Niveau: NiveauShort
            },
        },
        ExamenprogrammaVakleergebied: {
			...shortInfo,
        }
    })`
	},
	typedQueries: {
		ExamenprogrammaVakleergebied:`
		from(Index(request.query.id))
			.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			Vakleergebied: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			Examenprogramma: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			}
		})
		`,
		Examenprogramma:`
		from(Index(request.query.id))
			.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			ExamenprogrammaVakleergebied: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			ExamenprogrammaDomein: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
			ExamenprogrammaKop1: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
			Syllabus: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			Niveau: {
				NiveauShort
			}
		})
		`,
		ExamenprogrammaDomein:`
		from(Index(request.query.id))
			.select({
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
			},
			Examenprogramma: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
			ExamenprogrammaSubdomein: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
			ExamenprogrammaEindterm: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
				Niveau: {
					NiveauShort
				}
			},
			SyllabusToelichting: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			SyllabusSpecifiekeEindterm: {
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
		`,
		ExamenprogrammaSubdomein:`
		from(Index(request.query.id))
			.select({
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
			},
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
			},
			ExamenprogrammaEindterm: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
				Niveau: {
					NiveauShort
				}
			},
			Doelniveau: {
				DoelNiveau
			},
			NiveauIndex: {
				Niveau: {
					NiveauShort
				}
			}
		})
		`,
		ExamenprogrammaEindterm:`
		from(Index(request.query.id))
			.select({
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
			},
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
			},
			SyllabusSpecifiekeEindterm: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			SyllabusToelichting: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			SyllabusVakbegrip: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			Niveau: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			}
		})
		`,
		ExamenprogrammaKop1:`
		from(Index(request.query.id))
			.select({
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
			},
			ExamenprogrammaKop2: {		
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
			ExamenprogrammaBody: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
		})
		`,
		ExamenprogrammaKop2:`
		from(Index(request.query.id))
			.select({
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
			},
			ExamenprogrammaKop3: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
			ExamenprogrammaBody: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
		})
		`,
		ExamenprogrammaKop3:`
		from(Index(request.query.id))
			.select({
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
			},
			ExamenprogrammaKop4: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
			ExamenprogrammaBody: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
		})
		`,
		ExamenprogrammaKop4:`
		from(Index(request.query.id))
			.select({
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
			},
			ExamenprogrammaBody: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
		})
		`,
		ExamenprogrammaBody:`
		from(Index(request.query.id))
			.select({
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
			},
			ExamenprogrammaKop2: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
			ExamenprogrammaKop3: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
			ExamenprogrammaKop4: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			}
		})
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