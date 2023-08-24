module.exports = {
	context: 'kerndoelen',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/kerndoel.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-kerndoelen/context.json',
	queries: {
		Kerndoel: `
		const results = from(data.Kerndoel)
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
			description: _,
			kerndoelLabel: _,
			Niveau: {
			  NiveauShort
			}
		})

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
			'@id': Id,
			uuid: _.id,
			title: _,
			Doelniveau: {
				Doelniveau
			}
		})
		`,
		KerndoelDomein: `
		const results = from(data.KerndoelDomein)
		.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			KerndoelVakleergebied: {
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
		KerndoelUitstroomprofiel: `
		const results = from(data.KerndoelUitstroomprofiel)
		.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			KerndoelVakleergebied: {
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
		KerndoelVakleergebied: `
		const results = from(data.KerndoelVakleergebied)
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
	},
	typedQueries: {
		Kerndoel: `
		const results = from(Index(request.query.id))
			.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			description: _,
			kerndoelLabel: _,
			prefix: _,
			KerndoelDomein: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
				KerndoelVakleergebied: {
					'@id': Id,
					uuid: _.id,
					title: _,
					deprecated: _,
				}
			},
			Niveau: {
				NiveauShort
			},
			Doelniveau: {
				Doelniveau
			},
			Niveau: {
				Niveau
			},
		})

		`,
		KerndoelDomein: `
		const results = from(Index(request.query.id))
			.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			Kerndoel: {
				'@id': Id,
				uuid: _.id,
				title: _,
				prefix: _,
				kerndoelLabel: _,
				deprecated: _,
				Niveau: {
					NiveauShort
				}
			},
			KerndoelVakleergebied {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			}
		})
		`,
		KerndoelVakleergebied: `
		const results = from(Index(request.query.id))
			.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			Vakleergebied: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			KerndoelDomein: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			KerndoelUitstroomprofiel: {
				'@id': Id,
				uuid: _.id,
				title: _,
				deprecated: _,
			},
			Kerndoel: {
				'@id': Id,
				uuid: _.id,
				title: _,
				prefix: _,
				kerndoelLabel: _,
				deprecated: _,
				Niveau: {
					
				}
			}
		})
		`,
		KerndoelUitstroomprofiel: `
		const results = from(Index(request.query.id))
			.select({
			'@id': Id,
			uuid: _.id,
			title: _,
			KerndoelVakleergebied: {
				'@id': Id,
				uuid: _.id,
				title: _,
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