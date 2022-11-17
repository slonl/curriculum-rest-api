module.exports = {
	context: 'syllabus',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/syllabus.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-syllabus/context.json',
	queries: {
		Syllabus: `query Syllabus($page:Int,$perPage:Int) {
		  allSyllabus (page:$page,perPage:$perPage,sortField:"title",filter:{deprecated:null}) {
			id	
			title   
		  }
		  _allSyllabusMeta {
			count
		  }
		}`,
		SyllabusVakbegrip: `query SyllabusVakbegrip($page:Int,$perPage:Int) {
		  allSyllabusVakbegrip (page:$page,perPage:$perPage,sortField:"title",filter:{deprecated:null}) {
			id
			prefix
			title
			Syllabus {
			  id
			  title
			  deprecated
			}
		  }
		  _allSyllabusVakbegripMeta {
			count
		  }
		}`,
		SyllabusVakleergebied: `query SyllabusVakleergebied($page:Int,$perPage:Int) {
		  allSyllabusVakleergebied (page:$page,perPage:$perPage,sortField:"title",filter:{deprecated:null}) {
			id
			title
			Syllabus {
			  id
			  title
			  deprecated
			}
			Vakleergebied {
			  id
			  title
			  deprecated
			}
		  }
		  _allSyllabusVakleergebiedMeta {
			count
		  }
		}`,
		SyllabusToelichting: `query SyllabusToelichting($page:Int,$perPage:Int) {
		  allSyllabusToelichting (page:$page,perPage:$perPage,sortField:"title",filter:{deprecated:null}) {
			id
			title
			Syllabus {
			  id
			  title
			  deprecated
			}
			SyllabusSpecifiekeEindterm{
			  Syllabus {
				id
				title
				deprecated
			  }
			}
		  }
		  _allSyllabusToelichtingMeta {
			count
		  }
		}`,
		SyllabusSpecifiekeEindterm: `query SyllabusSpecifiekeEindterm($page:Int,$perPage:Int) {
		  allSyllabusSpecifiekeEindterm (page:$page,perPage:$perPage,sortField:"title",filter:{deprecated:null}) {
			id
			title
			Syllabus {
			  id
			  title
			  deprecated
			}
		  }
		  _allSyllabusSpecifiekeEindtermMeta {
			count
		  }
		}`,
		SyllabusVolledig: `query SyllabusVolledig($id:ID){
		  Syllabus(id:$id){
			id
			title
			ingangsdatum
			versie
			url
			examenjaar
			status
			ce_se
			NiveauIndex {
			  Niveau {
				...NiveauShort
			  }
			}
			SyllabusSpecifiekeEindterm {
			  id
			  prefix
			  title
			  ce_se
			  deprecated
			  Tag {
				id
				title
				deprecated
			  }
			  ExamenprogrammaEindterm {
				id
				title
				deprecated
			  }
			  ExamenprogrammaDomein {
				id
				title
				deprecated
			  }
			}
			SyllabusToelichting {
			  id
			  prefix
			  title
			  ce_se
			  deprecated
			  Tag {
				id
				title
				deprecated
			  }
			  ExamenprogrammaEindterm {
				id
				title
				deprecated
			  }
			  ExamenprogrammaDomein {
				id
				title
				deprecated
			  }
			  Examenprogramma {
				id
				title
				deprecated
			  }
			  SyllabusSpecifiekeEindterm {
				id
				title
				deprecated
			  }	  
			}
			SyllabusVakbegrip {
			  id
			  prefix
			  title
			  ce_se
			  deprecated
			  Tag {
				id
				title
				deprecated
			  }
			  ExamenprogrammaEindterm {
				id
				title
				deprecated
			  }
			}
		  }
		}`
	},
	typedQueries: {
		'syllabus': `
			id	
			title
			ingangsdatum
			versie
			url
			examenjaar
			status
			ce_se
			Examenprogramma {
				id
				prefix
				title
				deprecated
			}
			SyllabusSpecifiekeEindterm {
				id
				prefix
				title
				deprecated
			}
			SyllabusToelichting {
				id
				prefix
				title
				deprecated
			}
			SyllabusVakbegrip {
				id
				prefix
				title
				deprecated
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		`,
		'syllabus_vakleergebied': `
			id
			title
			Syllabus {
				id
				title
				deprecated
			}
			Vakleergebied {
				id
				title
				deprecated
			}
		`,
		'syllabus_vakbegrip': `
			id
			prefix
			title
			ce_se
			Tag {
				id
				title
				deprecated
			}
			ExamenprogrammaEindterm {
				id
				title
				deprecated
			}
			Syllabus {
				id
				title
				deprecated
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		`,
		'syllabus_toelichting': `
			id
			prefix
			title
			ce_se
			Tag {
				id
				title
				deprecated
			}
			ExamenprogrammaEindterm {
				id
				title
				deprecated
			}
			ExamenprogrammaDomein {
				id
				title
				deprecated
			}
			Syllabus {
				id
				title
				deprecated
			}
			SyllabusSpecifiekeEindterm {
				id
				title
				deprecated
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		`,
		'syllabus_specifieke_eindterm': `
			id
			prefix
			title
			ce_se
			Tag {
				id
				title
				deprecated
			}
			ExamenprogrammaEindterm {
				id
				title
				deprecated
			}
			ExamenprogrammaDomein {
				id
				title
				deprecated
			}
			Syllabus {
				id
				title
				deprecated
			}
			SyllabusToelichting {
				id
				title
				deprecated
			}
			SyllabusVakbegrip {
				id
				title
				deprecated
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		`
	},
	idQuery: `
		allSyllabus(filter:{id:$id}) {
			id	
			title
			ingangsdatum
			versie
			url
			examenjaar
			status
			ce_se
			Examenprogramma {
				id
				prefix
				title
			}
			SyllabusSpecifiekeEindterm {
				id
				prefix
				title
			}
			SyllabusToelichting {
				id
				prefix
				title
			}
			SyllabusVakbegrip {
				id
				prefix
				title
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		}
		allSyllabusVakleergebied(filter:{id:$id}) {
			id
			title
			Syllabus {
				id
				title
			}
			Vakleergebied {
				id
				title
			}
		}
		allSyllabusVakbegrip(filter:{id:$id}) {
			id
			prefix
			title
			ce_se
			Tag {
				id
				title
			}
			ExamenprogrammaEindterm {
				id
				title
			}
			Syllabus {
				id
				title
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		}
		allSyllabusToelichting(filter:{id:$id}) {
			id
			prefix
			title
			ce_se
			Tag {
				id
				title
			}
			ExamenprogrammaEindterm {
				id
				title
			}
			ExamenprogrammaDomein {
				id
				title
			}
			Syllabus {
				id
				title
			}
			SyllabusSpecifiekeEindterm {
				id
				title
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		} 
		allSyllabusSpecifiekeEindterm(filter:{id:$id}) {
			id
			prefix
			title
			ce_se
			Tag {
				id
				title
			}
			ExamenprogrammaEindterm {
				id
				title
			}
			ExamenprogrammaDomein {
				id
				title
			}
			Syllabus {
				id
				title
			}
			SyllabusToelichting {
				id
				title
			}
			SyllabusVakbegrip {
				id
				title
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		}
	`,
	routes: {
		'syllabus/': (req) =>
			opendata.api["Syllabus"](req.params, req.query)
			.then(function(result) {
				return { data: result.data.allSyllabus, type: 'Syllabus', meta: result.data._allSyllabusMeta}
			}),
		'syllabus/:id/': (req) =>
			opendata.api["SyllabusVolledig"](req.params, req.query)
			.then(function(result) {
				return { data: result.data.Syllabus, type: 'Syllabus'}
			}),
		'syllabus_vakleergebied/': (req) =>
			opendata.api["SyllabusVakleergebied"](req.params, req.query)
			.then(function(result) {
				return { data: result.data.allSyllabusVakleergebied, type: 'SyllabusVakleergebied', meta: result.data._allSyllabusVakleergebiedMeta}
			}),
		'syllabus_toelichting/': (req) =>
			opendata.api["SyllabusToelichting"](req.params, req.query)
			.then(function(result) {
				return { data: result.data.allSyllabusToelichting, type: 'SyllabusToelichting', meta: result.data._allSyllabusToelichtingMeta}
			}),
		'syllabus_specifieke_eindterm/': (req) =>
			opendata.api["SyllabusSpecifiekeEindterm"](req.params, req.query)
			.then(function(result) {
				return { data: result.data.allSyllabusSpecifiekeEindterm, type: 'SyllabusSpecifiekeEindterm', meta: result.data._allSyllabusSpecifiekeEindtermMeta}
			}),
		'syllabus_vakbegrip/': (req) =>
			opendata.api["SyllabusVakbegrip"](req.params, req.query)
			.then(function(result) {
				return { data: result.data.allSyllabusVakbegrip, type: 'SyllabusVakbegrip', meta: result.data._allSyllabusVakbegripMeta}
			})
	}
};