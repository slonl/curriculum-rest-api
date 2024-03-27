module.exports = {
	context: 'examenprogramma',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/examenprogramma.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-examenprogramma/context.json',
	fragments:`
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
		}
	`
	,
	queries: {
		ExamenprogrammaVakleergebied:`
		const results = from(data.ExamenprogrammaVakleergebied)
			.orderBy({
				title:asc
			})
			.slice(Paging.start,Paging.end)
			.select(shortInfo)
			
			const meta = {
				data: results,
				page: Page,
				count: data.ExamenprogrammaVakleergebied.length
			}

			meta

		`,
		Examenprogramma: `
		const results = from(data.Examenprogramma)
			.orderBy({
				title:asc
			})
			.slice(Paging.start,Paging.end)
			.select(shortInfo)
		
		
			const meta = {
				data: results,
				page: Page,
				count: data.Examenprogramma.length
			}
			
			meta

		`,
		ExamenprogrammaDomein: `
		const results = from(data.ExamenprogrammaDomein)
			.orderBy({
				title:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				Examenprogramma: {
					...shortInfo,
				}
			})
			
			const meta = {
				data: results,
				page: Page,
				count: data.ExamenprogrammaDomein.length
			}

			meta

		`,
		ExamenprogrammaSubdomein: `
		const results = from(data.ExamenprogrammaSubdomein)
			.orderBy({
				title:asc
			})
			.slice(Paging.start,Paging.end)
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
				data: results,
				page: Page,
				count: data.ExamenprogrammaSubdomein.length
			}

			meta

		`,
		ExamenprogrammaEindterm: `
		const results = from(data.ExamenprogrammaEindterm)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select(shortInfo)

			const meta = {
				data: results,
				page: Page,
				count: data.ExamenprogrammaEindterm.length
			}

		meta

		`,
		ExamenprogrammaKop1: `
		const results = from(data.ExamenprogrammaKop1)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				Examenprogramma:{
					...shortInfo,
					deprecated: _,
				}
			})
		
			const meta = {
				data: results,
				page: Page,
				count: data.ExamenprogrammaKop1.length
			}

			meta

		`,
		ExamenprogrammaKop2: `
		const results = from(data.ExamenprogrammaKop2)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select(shortInfo)
			
			
			const meta = {
				data: results,
				page: Page,
				count: data.ExamenprogrammaKop2.length
			}

			meta

		`,
		ExamenprogrammaKop3: `
		const results = from(data.ExamenprogrammaKop3)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select(shortInfo)
		
			const meta = {
				data: results,
				page: Page,
				count: data.ExamenprogrammaKop3.length
			}

			meta

		`,
		ExamenprogrammaKop4: `
		const results = from(data.ExamenprogrammaKop4)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select(shortInfo)
					
			const meta = {
				data: results,
				page: Page,
				count: data.ExamenprogrammaKop4.length
			}

			meta

		`,
		ExamenprogrammaBody: `
		const results = from(data.ExamenprogrammaBody)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select(shortInfo)
		
			const meta = {
				data: results,
				page: Page,
				count: data.ExamenprogrammaBody.length
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
			...shortInfo,
			'@context': 'https://opendata.slo.nl/curriculum/schemas/curriculum-examenprogramma/context.json',
			Vakleergebied: {
				...shortInfo,
				deprecated: _,
			},
			Examenprogramma: {
				...shortInfo,
				deprecated: _,
			}
		})
		`,
		Examenprogramma:`
		from(Index(request.query.id))
		.select({
			...shortInfo,
			'@context': 'https://opendata.slo.nl/curriculum/schemas/curriculum-examenprogramma/context.json',
			ExamenprogrammaVakleergebied: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaDomein: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaKop1: {
				...shortInfo,
				deprecated: _,
			},
			Syllabus: {
				...shortInfo,
				deprecated: _,
			},
			Niveau: NiveauShort
		})
		`,
		ExamenprogrammaDomein:`
		from(Index(request.query.id))
		.select({
			...shortInfo,
			'@context': 'https://opendata.slo.nl/curriculum/schemas/curriculum-examenprogramma/context.json',
			ce_se: _,
			Tag: {
				...shortInfo,
				deprecated: _,
			},
			Examenprogramma: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaSubdomein: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaEindterm: {
				...shortInfo,
				deprecated: _,
				Niveau: NiveauShort,
			},
			SyllabusToelichting: {
				...shortInfo,
				deprecated: _,
			},
			SyllabusSpecifiekeEindterm: {
				...shortInfo,
				deprecated: _,
			},
			NiveauIndex: {
				Niveau: NiveauShort
			}
		})
		`,
		ExamenprogrammaSubdomein:`
		from(Index(request.query.id))
		.select({
			...shortInfo,
			'@context': 'https://opendata.slo.nl/curriculum/schemas/curriculum-examenprogramma/context.json',
			ce_se: _,
			Tag: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaDomein: {
				...shortInfo,
				deprecated: _,
				Examenprogramma: {
					...shortInfo,
					deprecated: _,
				}
			},
			ExamenprogrammaEindterm: {
				...shortInfo,
				deprecated: _,
				Niveau: NiveauShort,
			},
			Doelniveau: Doelniveau,
			NiveauIndex: {
				Niveau: NiveauShort
			},
		})
		`,
		ExamenprogrammaEindterm:`
		from(Index(request.query.id))
		.select({
			...shortInfo,
			'@context': 'https://opendata.slo.nl/curriculum/schemas/curriculum-examenprogramma/context.json',
			ce_se: _,
			ExamenprogrammaSubdomein: {
				...shortInfo,
				deprecated: _,
				ExamenprogrammaDomein: {
					...shortInfo,
					deprecated: _,
					Examenprogramma: {
						...shortInfo,
						deprecated: _,
					}
				}
			},
			ExamenprogrammaDomein: {
				...shortInfo,
				deprecated: _,
				Examenprogramma: {
					...shortInfo,
					deprecated: _,
				}
			},
			SyllabusSpecifiekeEindterm: {
				...shortInfo,
				deprecated: _,
			},
			SyllabusToelichting: {
				...shortInfo,
				deprecated: _,
			},
			SyllabusVakbegrip: {
				...shortInfo,
				deprecated: _,
			},
			Niveau: {
				...shortInfo,
				deprecated: _,
			}
		})
		`,
		ExamenprogrammaKop1:`
		from(Index(request.query.id))
		.select({
			...shortInfo,
			'@context': 'https://opendata.slo.nl/curriculum/schemas/curriculum-examenprogramma/context.json',
			deprecated: _,
			Examenprogramma: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaKop2: {		
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaBody: {
				...shortInfo,
				deprecated: _,
			}
		})
		`,
		ExamenprogrammaKop2:`
		from(Index(request.query.id))
		.select({
			...shortInfo,
			'@context': 'https://opendata.slo.nl/curriculum/schemas/curriculum-examenprogramma/context.json',
			ExamenprogrammaKop1: {
				...shortInfo,
				deprecated: _,
				Examenprogramma: {
					...shortInfo,
					deprecated: _,
				}
			},
			ExamenprogrammaKop3: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaBody: {
				...shortInfo,
				deprecated: _,
			}
		})
		`,
		ExamenprogrammaKop3:`
		from(Index(request.query.id))
		.select({
			...shortInfo,
			'@context': 'https://opendata.slo.nl/curriculum/schemas/curriculum-examenprogramma/context.json',
			ExamenprogrammaKop2: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaKop4: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaBody: {
				...shortInfo,
				deprecated: _,
			}
		})
		`,
		ExamenprogrammaKop4:`
		from(Index(request.query.id))
		.select({
			...shortInfo,
			'@context': 'https://opendata.slo.nl/curriculum/schemas/curriculum-examenprogramma/context.json',
			ExamenprogrammaKop3: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaBody: {
				...shortInfo,
				deprecated: _,
			}
		})
		`,
		ExamenprogrammaBody:`
		from(Index(request.query.id))
		.select({
			...shortInfo,
			'@context': 'https://opendata.slo.nl/curriculum/schemas/curriculum-examenprogramma/context.json',
			ExamenprogrammaKop1: {
				...shortInfo,
				deprecated: _,
				Examenprogramma: {
					...shortInfo,
					deprecated: _,
				}
			},
			ExamenprogrammaKop2: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaKop3: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaKop4: {
				...shortInfo,
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