module.exports = {
	context: 'syllabus',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/syllabus.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-syllabus/context.json',
	queries: {
		Syllabus: `
		const results = from(data.Syllabus)
		.select({
			...shortInfo,  
		})
		.orderBy({ title:asc })

		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		SyllabusVakbegrip: `
		const results = from(data.SyllabusVakbegrip)
		.select({
			...shortInfo,
			Syllabus: {
				...shortInfo,
				deprecated: _,
			}
		})
		.orderBy({ title:asc })

		  const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		SyllabusVakleergebied: `
		const results = from(data.SyllabusVakleergebied)
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
		.orderBy({ title:asc })

		  const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		SyllabusToelichting: `
		const results = from(data.SyllabusToelichting)
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
		.orderBy({ title:asc })

		  const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		SyllabusSpecifiekeEindterm: `
		const results = from(data.SyllabusSpecifiekeEindterm)
		.select({
			...shortInfo,
			Syllabus: {
				...shortInfo,
				deprecated: _,
			}
		})
		.orderBy({ title:asc })

		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
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
			NiveauIndex: {
				Niveau: NiveauShort
			},
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
			NiveauIndex: {
				Niveau: NiveauShort
			}
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
			NiveauIndex: {
				Niveau: NiveauShort
			}
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
			NiveauIndex: {
				Niveau: NiveauShort
			}
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
			NiveauIndex: {
				Niveau: NiveauShort
			}
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