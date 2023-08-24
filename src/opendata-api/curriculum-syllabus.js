module.exports = {
	context: 'syllabus',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/syllabus.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-syllabus/context.json',
	queries: {
		Syllabus: `
		const results = from(data.Syllabus)
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
		SyllabusVakbegrip: `
		const results = from(data.SyllabusVakbegrip)
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			Syllabus: {
				'@id': Id,
				uuid: _.id,
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
		SyllabusVakleergebied: `
		const results = from(data.SyllabusVakleergebied)
		.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			Syllabus: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			Vakleergebied: {
				'@id': Id,
				uuid: _.id,
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
		SyllabusToelichting: `
		const results = from(data.SyllabusToelichting)
		.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			Syllabus: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			SyllabusSpecifiekeEindterm: {
			  Syllabus: {
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
		SyllabusSpecifiekeEindterm: `
		const results = from(data.SyllabusSpecifiekeEindterm)
		.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			Syllabus: {
				'@id': Id,
				uuid: _.id,
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
		SyllabusVolledig: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			ingangsdatum: _,
			versie: _,
			url: _,
			examenjaar: _,
			status: _,
			ce_se: _,
			NiveauIndex: {
				Niveau: {
					NiveauShort
			  }
			},
			SyllabusSpecifiekeEindterm: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				ce_se: _,
				deprecated: _,
				Tag {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				},
				ExamenprogrammaEindterm: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				},
				ExamenprogrammaDomein: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				},
			},
			SyllabusToelichting: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				ce_se: _,
				deprecated: _,
				Tag: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				},
				ExamenprogrammaEindterm: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				},
				ExamenprogrammaDomein: {
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
				},
				SyllabusSpecifiekeEindterm: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				}	  
			},
			SyllabusVakbegrip: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				ce_se: _,
				deprecated: _,
				Tag: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				},
				ExamenprogrammaEindterm: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				}
			}
		  }
		}`
	},
	typedQueries: {
		Syllabus: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,	
			title: _,
			ingangsdatum: _,
			versie: _,
			url: _,
			examenjaar: _,
			status: _,
			ce_se: _,
			Examenprogramma: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
			SyllabusSpecifiekeEindterm: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
			SyllabusToelichting: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				deprecated: _,
			},
			SyllabusVakbegrip: {
				'@id': Id,
				uuid: _.id,
				prefix: _,
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
		SyllabusVakleergebied: `
		from(Index(request.query.id))
			.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			Syllabus: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			Vakleergebied: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			}
		})
		`,
		SyllabusVakbegrip: `
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
			ExamenprogrammaEindterm: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			Syllabus: {
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
		SyllabusToelichting: `
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
			ExamenprogrammaEindterm: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			ExamenprogrammaDomein: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			Syllabus: {
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
		SyllabusSpecifiekeEindterm: `
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
			ExamenprogrammaEindterm: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			ExamenprogrammaDomein: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			Syllabus: {
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
			NiveauIndex: {
				Niveau: {
					NiveauShort
				}
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