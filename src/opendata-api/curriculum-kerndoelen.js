module.exports = {
	context: 'kerndoelen',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/kerndoel.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-kerndoelen/context.json',
	queries: {
		Kerndoel: `
		const results = from(data.Kerndoel)
		.select({
			...shortInfo,
			description: _,
			kerndoelLabel: _,
			Niveau: NiveauShort,
		})
		.sort(sortByPrefix)

		const meta = {
		data: results.slice(Paging.start,Paging.end),
		page: Page,
		count: results.length
		}

		meta
			
		`,
		KerndoelById: `
		const results = from(Index(request.query.id))
		.select({
			...shortInfo,
			Doelniveau: Doelniveau
		})
		`,
		KerndoelDomein: `
		const results = from(data.KerndoelDomein)
		.select({
			...shortInfo,
			KerndoelVakleergebied: {
				...shortInfo,
				deprecated: _,
			}
		})
		.sort(sortByTitle)

		  const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		KerndoelUitstroomprofiel: `
		const results = from(data.KerndoelUitstroomprofiel)
		.select({
			...shortInfo,
			KerndoelVakleergebied: {
				...shortInfo,
			  deprecated: _,
			}
		})
		.sort(sortByPrefix)

		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
		KerndoelVakleergebied: `
		const results = from(data.KerndoelVakleergebied)
		.select({
			...shortInfo,
		})
		.sort(sortByPrefix)

		const meta = {
			data: results.slice(Paging.start,Paging.end),
			page: Page,
			count: results.length
		}

		meta

		`,
	},
	typedQueries: {
		Kerndoel: `
		from(Index(request.query.id))
			.select({
				...shortInfo,
			description: _,
			kerndoelLabel: _,
			KerndoelDomein: {
				...shortInfo,
				deprecated: _,
				KerndoelVakleergebied: {
					...shortInfo,
					deprecated: _,
				}
			},
			Niveau: NiveauShort,
			Doelniveau: Doelniveau,
			Niveau: Niveau,
		})

		`,
		KerndoelDomein: `
		from(Index(request.query.id))
			.select({
				...shortInfo,
			Kerndoel: {
				...shortInfo,
				kerndoelLabel: _,
				deprecated: _,
				Niveau: NiveauShort
			},
			KerndoelVakleergebied: {
				...shortInfo,
				deprecated: _,
			}
		})
		`,
		KerndoelVakleergebied: `
		from(Index(request.query.id))
			.select({
				...shortInfo,
			Vakleergebied: {
				...shortInfo,
				deprecated: _,
			},
			KerndoelDomein: {
				...shortInfo,
				deprecated: _,
			},
			KerndoelUitstroomprofiel: {
				...shortInfo,
				deprecated: _,
			},
			Kerndoel: {
				...shortInfo,
				kerndoelLabel: _,
				deprecated: _,
				Niveau: NiveauShort,
			}
		})
		`,
		KerndoelUitstroomprofiel: `
		from(Index(request.query.id))
			.select({
				...shortInfo,
			KerndoelVakleergebied: {
				...shortInfo,
				deprecated: _,
			}
		})
		`
	},
	routes: {
		'kerndoel/': (req) => opendata.api["Kerndoel"](req.params, req.query),
		'kerndoel_domein/': (req) => opendata.api["KerndoelDomein"](req.params, req.query),
		'kerndoel_vakleergebied/': (req) =>	opendata.api["KerndoelVakleergebied"](req.params, req.query),
		'kerndoel_uitstroomprofiel/': (req) => opendata.api["KerndoelUitstroomprofiel"](req.params, req.query),
		'niveau/:niveau/kerndoel': (req) =>	opendata.api["KerndoelOpNiveau"](req.params, req.query),
		'niveau/:niveau/kerndoel/:id': (req) =>	opendata.api["KerndoelOpNiveauById"](req.params, req.query),
		'niveau/:niveau/kerndoel_vakleergebied': (req) => opendata.api["KerndoelVakleergebiedOpNiveau"](req.params, req.query),
		'niveau/:niveau/kerndoel_vakleergebied/:id': (req) => opendata.api["KerndoelVakleergebiedByIdOpNiveau"](req.params, req.query)
	}
};