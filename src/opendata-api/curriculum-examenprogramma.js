module.exports = {
	context: 'examenprogramma',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/examenprogramma.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-examenprogramma/context.json',
	fragments: {
		SyllabusInfo: `fragment SyllabusInfo on SyllabusSpecifiekeEindterm {
		  id
		  prefix
		  title
		  ce_se
		  niveau_id
		  SyllabusVakbegrip {
			id
			prefix
			title
			ce_se
			deprecated
		  }
		  SyllabusToelichting {
			id
			prefix
			title
			ce_se
			deprecated
		  }
		  Syllabus {
			id
			title
			ce_se
			deprecated
			examenjaar
			  Niveau {
				...NiveauShort
			}
		  }
		}`
	},
	queries: {
		ExamenprogrammaVakleergebied: `query ExamenprogrammaVakleergebied($page:Int,$perPage:Int) {
		  allExamenprogrammaVakleergebied (page:$page,perPage:$perPage,sortField:"title",filter:{deprecated:null}) {
			id
			title
		  }
		  _allExamenprogrammaVakleergebiedMeta {
			count
		  }
		}`,
		Examenprogramma: `query Examenprogramma($page:Int,$perPage:Int) {
		  allExamenprogramma (page:$page,perPage:$perPage,sortField:"title",filter:{deprecated:null}) {
			id
			prefix
			title
		  }
		  _allExamenprogrammaMeta {
			count
		  }
		}`,
		ExamenprogrammaDomein: `query ExamenprogrammaDomein($page:Int,$perPage:Int) {
		  allExamenprogrammaDomein (page:$page,perPage:$perPage,sortField:"title",filter:{deprecated:null}) {
			id
			prefix
			title
			Examenprogramma {
			  id
			  title
			  deprecated
			}
		  }
		  _allExamenprogrammaDomeinMeta {
			count
		  }
		}`,
		ExamenprogrammaSubdomein: `query ExamenprogrammaSubdomein($page:Int,$perPage:Int) {
		  allExamenprogrammaSubdomein (page:$page,perPage:$perPage,sortField:"title",filter:{deprecated:null}) {
			id
			prefix
			title
			ExamenprogrammaDomein {
			  id
			  title
			  deprecated
			  Examenprogramma {
				id
				title
				deprecated
			  }
			}
		  }
		  _allExamenprogrammaSubdomeinMeta {
			count
		  }
		}`,
		ExamenprogrammaEindterm: `query ExamenprogrammaEindterm($page:Int,$perPage:Int) {
		  allExamenprogrammaEindterm (page:$page,perPage:$perPage,sortField:"prefix",filter:{deprecated:null}) {
			id
			prefix
			title
		  }
		  _allExamenprogrammaEindtermMeta {
			count
		  }
		}`,
		ExamenprogrammaKop1: `query ExamenprogrammaKop1($page:Int,$perPage:Int) {
		  allExamenprogrammaKop1 (page:$page,perPage:$perPage,sortField:"prefix",filter:{deprecated:null}) {
			id
			prefix
			title
			Examenprogramma {
			  id
			  title
			  deprecated
			}
		  }
		  _allExamenprogrammaKop1Meta {
			count
		  }
		}`,
		ExamenprogrammaKop2: `query ExamenprogrammaKop2($page:Int,$perPage:Int) {
		  allExamenprogrammaKop2 (page:$page,perPage:$perPage,sortField:"prefix",filter:{deprecated:null}) {
			id
			prefix
			title
		  }
		  _allExamenprogrammaKop2Meta {
			count
		  }
		}`,
		ExamenprogrammaKop3: `query ExamenprogrammaKop3($page:Int,$perPage:Int) {
		  allExamenprogrammaKop3 (page:$page,perPage:$perPage,sortField:"prefix",filter:{deprecated:null}) {
			id
			prefix
			title
		  }
		  _allExamenprogrammaKop3Meta {
			count
		  }
		}`,
		ExamenprogrammaKop4: `query ExamenprogrammaKop4($page:Int,$perPage:Int) {
		  allExamenprogrammaKop4 (page:$page,perPage:$perPage,sortField:"prefix",filter:{deprecated:null}) {
			id
			prefix
			title
		  }
		  _allExamenprogrammaKop4Meta {
			count
		  }
		}`,
		ExamenprogrammaBody: `query ExamenprogrammaBody($page:Int,$perPage:Int) {
		  allExamenprogrammaBody (page:$page,perPage:$perPage,sortField:"prefix",filter:{deprecated:null}) {
			id
			prefix
			title
		  }
		  _allExamenprogrammaBodyMeta {
			count
		  }
		}`,
		ExamenprogrammaVolledig: `query ExamenprogrammaVolledig($id:ID) {
		  Examenprogramma(id:$id){
			id
			prefix
			title
			NiveauIndex {
			  Niveau {
				...NiveauShort
			  }
			}
			Syllabus {
			  id
			  title
			  ce_se
			  deprecated
			  examenjaar
			}
			ExamenprogrammaKop1 {
			  id
			  title
			  deprecated
			  ExamenprogrammaKop2 {
				id
				title
				deprecated
				ExamenprogrammaKop3 {
				  id
				  title
				  deprecated
				  ExamenprogrammaKop4 {
					id
					title
					deprecated
					ExamenprogrammaBody {
					  id
					  title
					  ce_se
					  deprecated
					}
				  }
				  ExamenprogrammaBody {
					id
					title
					ce_se
					deprecated
				  }
				}
				ExamenprogrammaKop4 {
				  id
				  title
				  deprecated
				  ExamenprogrammaBody {
					id
					title
					ce_se
					deprecated
				  }
				}
				ExamenprogrammaBody {
				  id
				  title
				  ce_se
				  deprecated
				}
			  }
			  ExamenprogrammaKop3 {
				id
				title
				deprecated
				ExamenprogrammaKop4 {
				  id
				  title
				  deprecated
				  ExamenprogrammaBody {
					id
					title
					ce_se
					deprecated
				  }
				}
				ExamenprogrammaBody {
				  id
				  title
				  ce_se
				  deprecated
				}
			  }
			  ExamenprogrammaBody {
				id
				title
				ce_se
				deprecated
			  }
			}
			ExamenprogrammaDomein {
			  id
			  title
			  ce_se
			  deprecated
			  SyllabusSpecifiekeEindterm {
				...SyllabusInfo
			  }
			  SyllabusToelichting {
				id
				prefix
				title
				ce_se
				deprecated
			  }
			  ExamenprogrammaSubdomein {
				id
				title
				ce_se
				deprecated
				ExamenprogrammaEindterm {
				  id
				  title
				  ce_se
				  deprecated
				  SyllabusSpecifiekeEindterm {
					...SyllabusInfo
				  }
				  SyllabusVakbegrip {
					id
					prefix
					title
					ce_se
					deprecated
				  }
				  Niveau {
				    ...NiveauShort
				  }
				}
				SyllabusSpecifiekeEindterm {
					...SyllabusInfo
				}
				SyllabusToelichting {
				  id
				  prefix
				  title
				  ce_se
				  deprecated
				}
			  }
			  ExamenprogrammaEindterm {
				id
				title
				ce_se
				deprecated
				SyllabusSpecifiekeEindterm {
					...SyllabusInfo
			 	}
			    SyllabusVakbegrip {
		          id
		          prefix
		          title
				  ce_se
				  deprecated
		        }
				Niveau {
				  ...NiveauShort
				}
			  }
			}
			ExamenprogrammaVakleergebied {
			  id
			  title
			  deprecated
			}
		  } 
		}`
	},
	typedQueries: {
		'examenprogramma_vakleergebied':`
			id
			title
			Vakleergebied {
				id
				title
				deprecated
			}
			Examenprogramma {
				id
				title
				deprecated
			} 
		`,
		'examenprogramma':`
			id
			prefix
			title
			ExamenprogrammaVakleergebied {
				id
				title
				deprecated
			}
			ExamenprogrammaDomein {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaKop1 {
				id
				prefix
				title
				deprecated
			}
			Syllabus {
				id
				title
				deprecated
			}
			Niveau {
				...NiveauShort
			}
		`,
		'examenprogramma_domein':`
			id
			prefix
			title
			ce_se
			Tag {
				id
				title
				deprecated
			}
			Examenprogramma {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaSubdomein {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaEindterm {
				id
				prefix
				title
				deprecated
				Niveau {
					...NiveauShort
				}
			}
			SyllabusToelichting {
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
		'examenprogramma_subdomein':`
			id
			prefix
			title
			ce_se
			Tag {
				id
				title
				deprecated
			}
			ExamenprogrammaDomein {
				id
				prefix
				title
				deprecated
				Examenprogramma {
					id
					title
					deprecated
				}
			}
			ExamenprogrammaEindterm {
				id
				prefix
				title
				deprecated
				Niveau {
					...NiveauShort
				}
			}
			Doelniveau {
				...DoelNiveau
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		`,
		'examenprogramma_eindterm':`
			id
			prefix
			title
			ce_se
			ExamenprogrammaSubdomein {
				id
				prefix
				title
				deprecated
				ExamenprogrammaDomein {
					id
					title
					deprecated
					Examenprogramma {
						id
						title
						deprecated
					}
				}
			}
			ExamenprogrammaDomein {
				id
				prefix
				title
				deprecated
				Examenprogramma {
					id
					title
					deprecated
				}
			}
			SyllabusSpecifiekeEindterm {
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
			Niveau {
				id
				title
				deprecated
			}
		`,
		'examenprogramma_kop1':`
			id
			prefix
			title
			deprecated
			Examenprogramma {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaKop2 {	  
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaBody {
				id
				prefix
				title
				deprecated
			}
		`,
		'examenprogramma_kop2':`
			id
			prefix
			title
			ExamenprogrammaKop1 {
				id
				prefix
				title
				deprecated
				Examenprogramma {
					id
					title
					deprecated
				}
			}
			ExamenprogrammaKop3 {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaBody {
				id
				prefix
				title
				deprecated
			}
		`,
		'examenprogramma_kop3':`
			id
			prefix
			title
			ExamenprogrammaKop2 {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaKop4 {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaBody {
				id
				prefix
				title
				deprecated
			}
		`,
		'examenprogramma_kop4':`
			id
			prefix
			title
			ExamenprogrammaKop3 {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaBody {
				id
				prefix
				title
				deprecated
			}
		`,
		'examenprogramma_body':`
			id
			prefix
			title
			ExamenprogrammaKop1 {
				id
				prefix
				title
				deprecated
				Examenprogramma {
					id
					title
					deprecated
				}
			}
			ExamenprogrammaKop2 {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaKop3 {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaKop4 {
				id
				prefix
				title
				deprecated
			}
		`
	},
	idQuery: `
		allExamenprogrammaVakleergebied(filter:{id:$id}) {
			id
			title
			Vakleergebied {
				id
				title
			}
			Examenprogramma {
				id
				title
			} 
		}
		allExamenprogramma(filter:{id:$id}) {
			id
			prefix
			title	
			ExamenprogrammaVakleergebied {
				id
				title
			}
			ExamenprogrammaDomein {
				id
				prefix
				title
			}
			ExamenprogrammaKop1 {
				id
				prefix
				title
			}
			Syllabus {
				id
				title
			}
			Niveau {
				...NiveauShort
			}
		}
		allExamenprogrammaDomein(filter:{id:$id}) {
			id
			prefix
			title
			ce_se
			Tag {
				id
				title
			}
			Examenprogramma {
				id
				prefix
				title
			}
			ExamenprogrammaSubdomein {
				id
				prefix
				title
			}
			ExamenprogrammaEindterm {
				id
				prefix
				title
				Niveau {
					...NiveauShort
				}
			}
			SyllabusToelichting {
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
		allExamenprogrammaSubdomein(filter:{id:$id}) {
			id
			prefix
			title
			ce_se
			Tag {
				id
				title
			}
			ExamenprogrammaDomein {
				id
				prefix
				title
				Examenprogramma {
					id
					title
				}
			}
			ExamenprogrammaEindterm {
				id
				prefix
				title
				Niveau {
					...NiveauShort
				}
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		}
		allExamenprogrammaEindterm(filter:{id:$id}) {
			id
			prefix
			title
			ce_se
			ExamenprogrammaSubdomein {
				id
				prefix
				title
				ExamenprogrammaDomein {
					id
					title
					Examenprogramma {
						id
						title
					}
				}
			}
			ExamenprogrammaDomein {
				id
				prefix
				title
				Examenprogramma {
					id
					title
				}
			}
			SyllabusSpecifiekeEindterm {
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
			Niveau {
				id
				title
			}
		}
		allExamenprogrammaKop1(filter:{id:$id}) {
			id
			prefix
			title
			Examenprogramma {
				id
				prefix
				title
			}
			ExamenprogrammaKop2 {	  
				id
				prefix
				title
			}
			ExamenprogrammaBody {
				id
				prefix
				title
			}
		}
		allExamenprogrammaKop2(filter:{id:$id}) {
			id
			prefix
			title
			ExamenprogrammaKop1 {
				id
				prefix
				title
				Examenprogramma {
					id
					title
				}
			}
			ExamenprogrammaKop3 {
				id
				prefix
				title
			}
			ExamenprogrammaBody {
				id
				prefix
				title
			}
		}
		allExamenprogrammaKop3(filter:{id:$id}) {
			id
			prefix
			title
			ExamenprogrammaKop2 {
				id
				prefix
				title
			}
			ExamenprogrammaKop4 {
				id
				prefix
				title
			}
			ExamenprogrammaBody {
				id
				prefix
				title
			}
		}
		allExamenprogrammaKop4(filter:{id:$id}) {
			id
			prefix
			title
			ExamenprogrammaKop3 {
				id
				prefix
				title
			}
			ExamenprogrammaBody {
				id
				prefix
				title
			}
		}
		allExamenprogrammaBody(filter:{id:$id}) {
			id
			prefix
			title
			ExamenprogrammaKop1 {
				id
				prefix
				title
				Examenprogramma {
					id
					title
				}
			}
			ExamenprogrammaKop2 {
				id
				prefix
				title
			}
			ExamenprogrammaKop3 {
				id
				prefix
				title
			}
			ExamenprogrammaKop4 {
				id
				prefix
				title
			}
		}
	`,
	routes: {
		'examenprogramma_vakleergebied': (req) =>
			opendata.api["ExamenprogrammaVakleergebied"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allExamenprogrammaVakleergebied,
					type: 'ExamenprogrammaVakleergebied',
					meta: result.data._allExamenprogrammaVakleergebiedMeta
				}
			}),
		'examenprogramma': (req) =>
			opendata.api["Examenprogramma"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allExamenprogramma,
					type: 'Examenprogramma', 
					meta: result.data._allExamenprogrammaMeta
				}
			}),
		'examenprogramma/:id': (req) =>
			opendata.api["ExamenprogrammaVolledig"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.Examenprogramma,
					type: 'Examenprogramma'
				}
			}),
		'examenprogramma_domein': (req) =>
			opendata.api["ExamenprogrammaDomein"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allExamenprogrammaDomein,
					type: 'ExamenprogrammaDomein',
					meta: result.data._allExamenprogrammaDomeinMeta
				}
			}),
		'examenprogramma_subdomein': (req) =>
			opendata.api["ExamenprogrammaSubdomein"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allExamenprogrammaSubdomein,
					type: 'ExamenprogrammaSubdomein',
					meta: result.data._allExamenprogrammaSubdomeinMeta
				}
			}),
		'examenprogramma_eindterm': (req) =>
			opendata.api["ExamenprogrammaEindterm"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allExamenprogrammaEindterm,
					type: 'ExamenprogrammaEindterm',
					meta: result.data._allExamenprogrammaEindtermMeta
				}
			}),
		'examenprogramma_kop1': (req) =>
			opendata.api["ExamenprogrammaKop1"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allExamenprogrammaKop1,
					type: 'ExamenprogrammaKop1',
					meta: result.data._allExamenprogrammaKop1Meta
				}
			}),
		'examenprogramma_kop2': (req) =>
			opendata.api["ExamenprogrammaKop2"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allExamenprogrammaKop2,
					type: 'ExamenprogrammaKop2',
					meta: result.data._allExamenprogrammaKop2Meta
				}
			}),
		'examenprogramma_kop3': (req) =>
			opendata.api["ExamenprogrammaKop3"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allExamenprogrammaKop3,
					type: 'ExamenprogrammaKop3',
					meta: result.data._allExamenprogrammaKop3Meta
				}
			}),
		'examenprogramma_kop4': (req) =>
			opendata.api["ExamenprogrammaKop4"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allExamenprogrammaKop4,
					type: 'ExamenprogrammaKop4',
					meta: result.data._allExamenprogrammaKop4Meta
				}
			}),
		'examenprogramma_body': (req) =>
			opendata.api["ExamenprogrammaBody"](req.params, req.query)
			.then(function(result) {
				return {
					data: result.data.allExamenprogrammaBody,
					type: 'ExamenprogrammaBody',
					meta: result.data._allExamenprogrammaBodyMeta
				}
			})
	}
};