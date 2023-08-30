module.exports = {
	context: 'niveauhierarchie',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/niveauhierarchie.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-niveauhierarchie/context.json',
	queries: {
		NhCategorie: `
		const results = from(data.NhCategorie)
		.select({
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				nh_sector_id: _,
				nh_niveau_id: _,
				unreleased: _,
			})

			const meta = {
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
	
			`,
		NhSector: `
		const results = from(data.NhSector)
		.select({
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				nh_schoolsoort_id: _,
				nh_bouw_id: _,
				nh_niveau_id: _,
				unreleased: _,
			})

			const meta = {
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
	
			`,
		NhSchoolsoort: `
		const results = from(data.NhSchoolsoort)
		.select({
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				nh_leerweg_id: _,
				nh_bouw_id: _,
				nh_niveau_id: _,
				unreleased: _,
			})

			const meta = {
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
	
			`,
		NhLeerweg: `
		const results = from(data.NhLeerweg)
		.select({
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				nh_bouw_id: _,
				nh_niveau_id: _,
				unreleased: _,
			})

			const meta = {
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
	
			`,
		NhBouw: `
		const results = from(data.NhBouw)
		.select({
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				nh_niveau_id: _,
				unreleased: _,
			})

			const meta = {
				data: results.slice(Paging.start,Paging.end),
				page: Page,
				count: results.length
			}
	
			meta
	
			`,
		NhNiveau: `
		const results = from(data.NhNiveau)
		.select({
				'@id': Id,
				uuid: _.id,
				prefix: _,
				title: _,
				unreleased: _,
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
		NhCategorie: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
		})
		`,
		NhSector: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
		})
		`,
		NhSchoolsoort: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
		})
		`,
		NhLeerweg: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
		})
		`,
		NhBouw: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
		})
		`,
		NhNiveau: `
		from(Index(request.query.id))
		.select({
			'@id': Id,
			uuid: _.id,
			prefix: _,
			title: _,
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