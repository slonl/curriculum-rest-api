module.exports = {
	context: 'basis',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/basis.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-basis/context.json',
	fragments: `
		const Id = o => 'https://opendata.slo.nl/curriculum'+JSONTag.getAttribute(o,'id')
		const Type = o => JSONTag.getAttribute(o,"class")
		const Doelniveau = {
			'@context': 'https://opendata.slo.nl/curriculum/schemas/doel.jsonld#Doelniveau',
			'@id': Id,
			'@type': Type,
			uuid: _.id,
			prefix: _,
			ce_se: _,
			Doel: {
				'@context': 'https://opendata.slo.nl/curriculum/schemas/doel.jsonld#Doel',
				'@id': Id,
				'@type': Type,
				uuid: _.id,
				title: _,
				description: _,
				vakbegrippen: _,
				bron: _,
				aanbodid: _,
				Leerlingtekst: {
					title: _,
					description: _,
				}     
			},
			Niveau: {
				'@context': 'https://opendata.slo.nl/curriculum/schemas/doel.jsonld#Niveau',
				'@id': Id,
				'@type': Type,
				uuid: _.id,
				title: _,
				description: _,
				prefix: _,
				type: _,
			},
			Kerndoel: {
				'@context': 'https://opendata.slo.nl/curriculum/schemas/kerndoel.jsonld#Kerndoel',
				'@id': Id,
				'@type': Type,
				uuid: _.id,
				title: _,
				description: _,
				kerndoelLabel: _,
				prefix: _,
			},
			ExamenprogrammaDomein: {
				'@context': 'https://opendata.slo.nl/curriculum/schemas/examenprogramma.jsonld#examenprogramma_domein',
				'@id': Id,
				'@type': Type,
				uuid: _.id,
				title: _,
				prefix: _,
			},
			ExamenprogrammaSubdomein: {
				'@context': 'https://opendata.slo.nl/curriculum/schemas/examenprogramma.jsonld#examenprogramma_subdomein',
				'@id': Id,
				'@type': Type,
				uuid: _.id,
				title: _,
				prefix: _,
			},
			ExamenprogrammaEindterm: {
				'@context': 'https://opendata.slo.nl/curriculum/schemas/examenprogramma.jsonld#examenprogramma_eindterm',
				'@id': Id,
				'@type': Type,
				uuid: _.id,
				title: _,
				prefix: _,
			},
			LdkVakbegrip: {
				'@context': 'https://opendata.slo.nl/curriculum/schemas/leerdoelenkaart.jsonld#ldk_vakbegrip',
				'@id': Id,
				'@type': Type,
				uuid: _.id,
				title: _,
				ce_se: _,
			}
		}
		const Doelen = {
			'@context': 'https://opendata.slo.nl/curriculum/schemas/doel.jsonld',
			'@id': Id,
			uuid: _.id,
			prefix: _,
			ce_se: _,
			Doel: {
				'@id': Id,
				'@type': Type,
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
				'@context': 'https://opendata.slo.nl/curriculum/schemas/kerndoel.jsonld#Kerndoel',
				'@id': Id,
				'@type': Type,
				uuid: _.id,
				title: _,
				description: _,
				kerndoelLabel: _,
				prefix: _,
			},
			LdkVakbegrip: {
				'@context': 'https://opendata.slo.nl/curriculum/schemas/leerdoelenkaart.jsonld#ldk_vakbegrip',
				'@id': Id,
				'@type': Type,
				uuid: _.id,
				title: _,
				ce_se: _,
			}
		}
		const Niveau = {
			'@context': 'https://opendata.slo.nl/curriculum/schemas/doel.jsonld#Niveau',
			'@id': Id,
			'@type': Type,
			uuid: _.id,
			 title: _,
			 description: _,
			 prefix: _,
			 type: _
		}
		const NiveauShort = {
			'@context': 'https://opendata.slo.nl/curriculum/schemas/doel.jsonld#Niveau',
			'@id': Id,
			'@type': Type,
			uuid: _.id,
			title: _,
			prefix: _,
		}
		const ShortLink = {
			'@id': Id,
			'@type': Type,
			uuid: _.id,
			title: _,
			deprecated: _,
		}
		const PageSize = request.query.pageSize || 100
		const Page = request.query.page || 0
		const Paging = {
			start: Page*PageSize,
			end: (Page+1)*PageSize-1
		}
		const Index = id => meta.index.id.get('/uuid/'+id)?.deref()
		
		function sortByTitle(a,b) {
			if (a.title<b.title) {
			  return -1
			} else if (a.title>b.title) {
			  return 1
			}
			return 0
		  }

		function sortByPrefix(a,b) {
			if (a.prefix<b.prefix) {
				return -1
			} else if (a.prefix>b.prefix) {
				return 1
			}
			return 0
		}

		function sortByNiveau(a,b) {
			if (a.Niveau<b.Niveau) {
				return -1
			} else if (a.Niveau>b.Niveau) {
				return 1
			}
			return 0
		}
		
	`,
	queries: {
		Vakleergebied: `
		const results = from(data.Vakleergebied)
				.select({
					'@context': 'https://opendata.slo.nl/curriculum/schemas/doel.jsonld#Vakleergebied',
					'@id': Id,
					'@type': Type,
					uuid: _.id,
					prefix: _,
					title: _,
					Niveau: ShortLink
				})
				.sort(sortByTitle)

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
			'@context': 'https://opendata.slo.nl/curriculum/schemas/doel.jsonld#Niveau',
			'@id': Id,
			'@type': Type,
			uuid: _.id,
			title: _,
			description: _,
			prefix: _,
			type: _
		})
		.sort(sortByTitle)

		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		Doel: `
		const results = from(data.Doel)
		.select({
			'@context': 'https://opendata.slo.nl/curriculum/schemas/doel.jsonld#Doel',
			'@id': Id,
			'@type': Type,
			uuid: _.id,
			title: _,
		})
		.sort(sortByTitle)

		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		Doelniveau: `
		const results = from(data.Doelniveau)
		.select({
			'@context': 'https://opendata.slo.nl/curriculum/schemas/doel.jsonld#Doelniveau',
			'@id': Id,
			'@type': Type,
			uuid: _.id,
			prefix: _,
			ce_se: _,
			Doel: {
				'@context': 'https://opendata.slo.nl/curriculum/schemas/doel.jsonld#Doel',
				'@id': Id,
				'@type': Type,
				uuid: _.id,
				title: _,
				description: _,
				vakbegrippen: _,
				bron: _,
				aanbodid: _,
				Leerlingtekst: {
					title: _,
					description: _,
				}     
			},
		})

		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
	},
	typedQueries: {
		Vakleergebied: `
		from(Index(request.query.id))
			.select({
				'@context': 'https://opendata.slo.nl/curriculum/schemas/doel.jsonld#Vakleergebied',
				'@id': Id,
				'@type': Type,
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
			.sort(sortByTitle)

		`,
		Niveau: `
		from(Index(request.query.id))
		.select({
			'@context': 'https://opendata.slo.nl/curriculum/schemas/doel.jsonld#Niveau',
			'@id': Id,
			'@type': Type,
			uuid: _.id,
			prefix: _,
			title: _,
			description: _,
			})
			.sort(sortByTitle)		
		`,
		Doel: `
		from(Index(request.query.id))
		.select({
			'@context': 'https://opendata.slo.nl/curriculum/schemas/doel.jsonld#Doel',
			'@id': Id,
			'@type': Type,
			uuid: _.id,
			sloID: _,
			title: _,
			description: _,
			bron: _,
		})
		.sort(sortByTitle)
		`,
		Doelniveau:`
		from(Index(request.query.id))
		.select({
			'@context': 'https://opendata.slo.nl/curriculum/schemas/doel.jsonld#Doelniveau',
			'@id': Id,
			'@type': Type,
			uuid: _.id,
			prefix: _,
			ce_se: _,
			Doel: {
				'@context': 'https://opendata.slo.nl/curriculum/schemas/doel.jsonld#Doel',
				'@id': Id,
				'@type': Type,
				uuid: _.id,
				title: _,
				description: _,
				vakbegrippen: _,
				bron: _,
				aanbodid: _,
				Leerlingtekst: {
					title: _,
					description: _,
				}     
			},
		})
		`,
	},
	routes: {
		'vakleergebied/': (req) => opendata.api["Vakleergebied"](req.params, req.query),
		'niveau/': (req) => opendata.api["Niveau"](req.params, req.query),
		'doel/': (req) => opendata.api["Doel"](req.params, req.query),
		'doelniveau/': (req) => opendata.api["Doelniveau"](req.params, req.query),
	}
}