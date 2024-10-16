module.exports = {
	context: 'syllabus',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/syllabus.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-syllabus/context.json',
	queries: {
		Syllabus: `
		const results = from(data.Syllabus)
			.orderBy({
				title:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,  
			})

			const meta = {
				data: results,
				page: Page,
				count: data.Syllabus.length
			}

			meta

		`,
		SyllabusVakbegrip: `
		const results = from(data.SyllabusVakbegrip)
			.orderBy({
				title:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				Syllabus: {
					...shortInfo,
					deprecated: _,
				}
			})

			const meta = {
				data: results,
				page: Page,
				count: data.SyllabusVakbegrip.length
			}

			meta

		`,
		SyllabusVakleergebied: `
		const results = from(data.SyllabusVakleergebied)
			.orderBy({
				title:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				'@id': Id,
				'@type': Type,
				uuid: _.id,
				title: _,
				Syllabus: {
					...shortInfo,
					deprecated: _,
				},
				Vakleergebied: {
					...shortInfo,
					deprecated: _,
				}
			})

			const meta = {
				data: results,
				page: Page,
				count: data.SyllabusVakleergebied.length
			}

			meta

		`,
		SyllabusToelichting: `
		const results = from(data.SyllabusToelichting)
			.orderBy({
				title:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				Syllabus: {
					...shortInfo,
					deprecated: _,
				},
				SyllabusSpecifiekeEindterm: {
					Syllabus: {
						...shortInfo,
						deprecated: _,
					}
				}
			})
			
			const meta = {
				data: results,
				page: Page,
				count: data.SyllabusToelichting.length
			}

			meta

		`,
		SyllabusSpecifiekeEindterm: `
		const results = from(data.SyllabusSpecifiekeEindterm)
			.orderBy({
				title:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				Syllabus: {
					...shortInfo,
					deprecated: _,
				}
			})

			const meta = {
				data: results,
				page: Page,
				count: data.SyllabusSpecifiekeEindterm.length
			}

			meta

		`,
		SyllabusVolledig: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			ingangsdatum: _,
			versie: _,
			url: _,
			examenjaar: _,
			status: _,
			ce_se: _,
			Niveau: NiveauIndex,
			SyllabusSpecifiekeEindterm: {
				...shortInfo,
				ce_se: _,
				deprecated: _,
				Tag {
					...shortInfo,
					deprecated: _,
				},
				ExamenprogrammaEindterm: {
					...shortInfo,
					deprecated: _,
				},
				ExamenprogrammaDomein: {
					...shortInfo,
					deprecated: _,
				},
			},
			SyllabusToelichting: {
				...shortInfo,
				ce_se: _,
				deprecated: _,
				Tag: {
					...shortInfo,
					deprecated: _,
				},
				ExamenprogrammaEindterm: {
					...shortInfo,
					deprecated: _,
				},
				ExamenprogrammaDomein: {
					...shortInfo,
					deprecated: _,
				},
				Examenprogramma: {
					...shortInfo,
					deprecated: _,
				},
				SyllabusSpecifiekeEindterm: {
					...shortInfo,
					deprecated: _,
				}	  
			},
			SyllabusVakbegrip: {
				...shortInfo,
				ce_se: _,
				deprecated: _,
				Tag: {
					...shortInfo,
					deprecated: _,
				},
				ExamenprogrammaEindterm: {
					...shortInfo,
					deprecated: _,
				}
			}
		  }
		})
		`
	},
	typedQueries: {
		Syllabus: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			ingangsdatum: _,
			versie: _,
			url: _,
			examenjaar: _,
			status: _,
			ce_se: _,
			Examenprogramma: {
				...shortInfo,
				deprecated: _,
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
			Niveau: NiveauIndex
		})
		`,
		SyllabusVakleergebied: `
		from(Index(request.query.id))
			.select({
				...shortInfo,
			Syllabus: {
				...shortInfo,
				deprecated: _,
			},
			Vakleergebied: {
				...shortInfo,
				deprecated: _,
			}
		})
		`,
		SyllabusVakbegrip: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			ce_se: _,
			Tag: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaEindterm: {
				...shortInfo,
				deprecated: _,
			},
			Syllabus: {
				...shortInfo,
				deprecated: _,
			},
			Niveau: NiveauIndex
		})
		`,
		SyllabusToelichting: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			ce_se: _,
			Tag: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaEindterm: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaDomein: {
				...shortInfo,
				deprecated: _,
			},
			Syllabus: {
				...shortInfo,
				deprecated: _,
			},
			SyllabusSpecifiekeEindterm: {
				...shortInfo,
				deprecated: _,
			},
			Niveau: NiveauIndex
		})
		`,
		SyllabusSpecifiekeEindterm: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
			ce_se: _,
			Tag: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaEindterm: {
				...shortInfo,
				deprecated: _,
			},
			ExamenprogrammaDomein: {
				...shortInfo,
				deprecated: _,
			},
			Syllabus: {
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
			Niveau: NiveauIndex
		})
		`
	},
	routes: {
		'syllabus/': (req) => opendata.api["Syllabus"](req.params, req.query),
		'syllabus/:id/': (req) => opendata.api["SyllabusVolledig"](req.params, req.query),
		'syllabus_vakleergebied/': (req) => opendata.api["SyllabusVakleergebied"](req.params, req.query),
		'syllabus_toelichting/': (req) => opendata.api["SyllabusToelichting"](req.params, req.query),
		'syllabus_specifieke_eindterm/': (req) => opendata.api["SyllabusSpecifiekeEindterm"](req.params, req.query),
		'syllabus_vakbegrip/': (req) => opendata.api["SyllabusVakbegrip"](req.params, req.query)
	}
};
