module.exports = {
	context: 'basis',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/basis.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-basis/context.json',
	fragments: `
		const Doelniveau = {
			'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
			uuid: _.id,
			prefix: _,
			ce_se: _,
			Doel: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
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
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				title: _,
				description: _,
				prefix: _,
				type: _
			},
			Kerndoel: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				title: _,
				description: _,
				kerndoelLabel: _,
				prefix: _
			},
			ExamenprogrammaDomein: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				title: _,
				prefix: _,
			},
			ExamenprogrammaSubdomein: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				title: _,
				prefix: _,
			},
			ExamenprogrammaEindterm: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				title: _,
				prefix: _
			},
			LdkVakbegrip: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				title: _,
				ce_se: _
			}
		}
		const Doelen = {
			'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
			uuid: _.id,
			prefix: _,
			ce_se: _,
			Doel: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
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
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				title: _,
				description: _,
				kerndoelLabel: _,
				prefix: _,
			},
			LdkVakbegrip: {
				'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
				uuid: _.id,
				title: _,
				ce_se: _
			}
		}
		const Niveau = {
			'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
			uuid: _.id,
			 title: _,
			 description: _,
			 prefix: _,
			 type: _
		}
		const NiveauShort = {
			'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
			uuid: _.id,
			title: _,
			prefix: _
		}
		const ShortLink = {
			'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
			uuid: _.id,
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
		.select({
			'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
			uuid: _.id,
			prefix: _,
			title: _,
			Niveau:ShortLink
		})

const meta = {
	data: results.slice(Paging.start,Paging.end),
	page: Page,
	count: results.length
}

meta

`,
		Niveau: `
		const results = from(data.Niveau)
		.select({
			'@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
			uuid: _.id,
			title: _,
			description: _,
			prefix: _,
			type: _
		})

const meta = {
	data: results.slice(Paging.start,Paging.end),
	page: Page,
	count: results.length
}

meta

`,
		Doel: `

`,
		Doelniveau: `
`
	},
	typedQueries: {
		Vakleergebied: `
from(Index(request.query.id))
.select({
  '@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
  uuid: _.id,
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
		Niveau: `
from(Index(request.query.id))
.select({
  '@id': o => 'https://opendata.slo.nl/curriculum/uuid/'+o.id,
  uuid: _.id,
  prefix: _,
  title: _,
  description: _,
})		
		`

	},
	routes: {
		'vakleergebied/': (req) => 
			opendata.api["Vakleergebied"](req.params, req.query)
			.then(function(result) {
				return {
					data: result, 
					type: 'Vakleergebied'
				};
			}),
		'niveau/': (req) => 
		opendata.api["Niveau"](req.params, req.query)
		.then(function(result) {
			return {
				data: result, 
				type: 'Niveau'
			};
		}),

	}
}
