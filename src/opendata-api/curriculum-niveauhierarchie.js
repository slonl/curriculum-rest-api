module.exports = {
	context: 'niveauhierarchie',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/niveauhierarchie.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-niveauhierarchie/context.json',
	queries: {
		NhCategorie: `
		const results = from(data.NhCategorie)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				nh_sector_id: _,
				nh_niveau_id: _,
				unreleased: _,
			})

			const meta = {
				data: results,
				page: Page,
				count: data.NhCategorie.length,
				root: data.schema.types.NhCategorie.root
			}

			meta

		`,
		NhSector: `
		const results = from(data.NhSector)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				nh_schoolsoort_id: _,
				nh_bouw_id: _,
				nh_niveau_id: _,
				unreleased: _,
			})

			const meta = {
				data: results,
				page: Page,
				count: data.NhSector.length,
				root: data.schema.types.NhSector.root
			}

			meta

		`,
		NhSchoolsoort: `
		const results = from(data.NhSchoolsoort)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				nh_leerweg_id: _,
				nh_bouw_id: _,
				nh_niveau_id: _,
				unreleased: _,
			})
			
			const meta = {
				data: results,
				page: Page,
				count: data.NhSchoolsoort.length,
				root: data.schema.types.NhSchoolsoort.root
			}

			meta

		`,
		NhLeerweg: `
		const results = from(data.NhLeerweg)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				nh_bouw_id: _,
				nh_niveau_id: _,
				unreleased: _,
			})

			const meta = {
				data: results,
				page: Page,
				count: data.NhLeerweg.length,
				root: data.schema.types.NhLeerweg.root
			}

			meta

		`,
		NhBouw: `
		const results = from(data.NhBouw)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				nh_niveau_id: _,
				unreleased: _,
			})
		
			const meta = {
				data: results,
				page: Page,
				count: data.NhBouw.length,
				root: data.schema.types.NhBouw.root
			}

			meta

		`,
		NhNiveau: `
		const results = from(data.NhNiveau)
			.orderBy({
				prefix:asc
			})
			.slice(Paging.start,Paging.end)
			.select({
				...shortInfo,
				unreleased: _,
			})
			
			const meta = {
				data: results,
				page: Page,
				count: data.NhNiveau.length,
				root: data.schema.types.NhNiveau.root
			}

			meta

		`,
	},
	typedQueries: {
		NhCategorie: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
		})
		`,
		NhSector: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
		})
		`,
		NhSchoolsoort: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
		})
		`,
		NhLeerweg: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
		})
		`,
		NhBouw: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
		})
		`,
		NhNiveau: `
		from(Index(request.query.id))
		.select({
			...shortInfo,
		})
		`
	},
	routes: {
		'nh_categorie/': (req) => opendata.api["NhCategorie"](req.params, req.query),
		'nh_sector/': (req) => opendata.api["NhSector"](req.params, req.query),
		'nh_schoolsoort/': (req) => opendata.api["NhSchoolsoort"](req.params, req.query),
		'nh_leerweg/': (req) => opendata.api["NhLeerweg"](req.params, req.query),
		'nh_bouw/': (req) => opendata.api["NhBouw"](req.params, req.query),
		'nh_niveau/': (req) => opendata.api["NhNiveau"](req.params, req.query)
	}
};