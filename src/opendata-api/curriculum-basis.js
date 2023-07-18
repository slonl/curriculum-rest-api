module.exports = {
	context: 'basis',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/basis.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-basis/context.json',
	fragments: `
		const Doelniveau = {
			id: _,
			prefix: _,
			ce_se: _,
			Doel: {
				id: _,
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
				id: _,
				title: _,
				description: _,
				prefix: _,
				type: _
			},
			Kerndoel: {
				id: _,
				title: _,
				description: _,
				kerndoelLabel: _,
				prefix: _
			},
			ExamenprogrammaDomein: {
				id: _,
				title: _,
				prefix: _,
			},
			ExamenprogrammaSubdomein: {
				id: _,
				title: _,
				prefix: _,
			},
			ExamenprogrammaEindterm: {
				id: _,
				title: _,
				prefix: _
			},
			LdkVakbegrip: {
				id: _,
				title: _,
				ce_se: _
			}
		}
		const Doelen = {
			id: _,
			prefix: _,
			ce_se: _,
			Doel: {
				id: _,
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
				id: _,
				title: _,
				description: _,
				kerndoelLabel: _,
				prefix: _,
			},
			LdkVakbegrip: {
				id: _,
				title: _,
				ce_se: _
			}
		}
		const Niveau = {
			 id: _,
			 title: _,
			 description: _,
			 prefix: _,
			 type: _
		}
		const NiveauShort = {
			id: _,
			title: _,
			prefix: _
		}
		const ShortLink = {
			id: _,
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
		Vakleergebied: `
const results = from(data.Vakleergebied)
		.where({
			deprecated: _ => _ !== null
		})
		.select({
			id: _,
			prefix: _,
			title: _,
			prefix: _,
			Niveau:ShortLink
		})

const meta = {
	data: results.slice(Paging.start,Paging.end),
	page: Page,
	count: results.length
}

meta

`
	},
	typedQueries: {
		Vakleergebied: `
from(Index(request.query.id))
.select({
  id: _,
  prefix: _,
  title: _,
  description: _,
  replaces: ShortLink,
  KerndoelVakleergebied: ShortLink,
  ExamenprogrammaVakleergebied: ShortLink,
  SyllabusVakleergebied: ShortLink,
  ExamenprogrammaBgProfiel: ShortLink,
  LdkVakleergebied: ShortLink,
  InhVakleergebied: ShortLink,
  RefVakleergebied: ShortLink,
  ErkVakleergebied: ShortLink,
  Niveau
})

		`,
	},
	routes: {
		'vakleergebied/': (req) => 
			opendata.api["Vakleergebied"](req.params, req.query)
			.then(function(result) {
				return {
					data: result, 
					type: 'Vakleergebied'
				};
			})

	}
}
