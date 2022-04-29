module.exports = {
	context: 'niveauhierarchie',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/niveauhierarchie.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-niveauhierarchie/context.json',
	queries: {
		NhCategorie: `query NhCategorie($page:Int, $perPage:Int) {
			allNhCategorie(page:$page, perPage:$perPage, sortField:"prefix") {
				id
				prefix
				title
				nh_sector_id
				nh_niveau_id
				unreleased
			}
			_allNhCategorieMeta {
				count
			}
		}`,
		NhSector: `query NhSector($page:Int, $perPage:Int) {
			allNhSector(page:$page, perPage:$perPage, sortField:"prefix") {
				id
				prefix
				title
				nh_schoolsoort_id
				nh_bouw_id
				nh_niveau_id
				unreleased
			}
			_allNhSectorMeta {
				count
			}
		}`,
		NhSchoolsoort: `query NhSchoolsoort($page:Int, $perPage:Int) {
			allNhSchoolsoort(page:$page, perPage:$perPage, sortField:"prefix") {
				id
				prefix
				title
				nh_leerweg_id
				nh_bouw_id
				nh_niveau_id
				unreleased
			}
			_allNhSchoolsoortMeta {
				count
			}
		}`,
		NhLeerweg: `query NhLeerweg($page:Int, $perPage:Int) {
			allNhLeerweg(page:$page, perPage:$perPage, sortField:"prefix") {
				id
				prefix
				title
				nh_bouw_id
				nh_niveau_id
				unreleased
			}
			_allNhLeerwegMeta {
				count
			}
		}`,
		NhBouw: `query NhBouw($page:Int, $perPage:Int) {
			allNhBouw(page:$page, perPage:$perPage, sortField:"prefix") {
				id
				prefix
				title
				nh_niveau_id
				unreleased
			}
			_allNhBouwMeta {
				count
			}
		}`,
		NhNiveau: `query NhNiveau($page:Int, $perPage:Int) {
			allNhNiveau(page:$page, perPage:$perPage, sortField:"prefix") {
				id
				prefix
				title
				unreleased
			}
			_allNhNiveauMeta {
				count
			}
		}`
	},
	idQuery: `
		allNhCategorie(filter:{id:$id}) {
			id
			prefix
			title
		}
		allNhSector(filter:{id:$id}) {
			id
			prefix
			title
		}
		allNhSchoolsoort(filter:{id:$id}) {
			id
			prefix
			title
		}
		allNhLeerweg(filter:{id:$id}) {
			id
			prefix
			title
		}
		allNhBouw(filter:{id:$id}) {
			id
			prefix
			title
		}
		allNhNiveau(filter:{id:$id}) {
			id
			prefix
			title
		}`,
	routes: {
		'nh_categorie/': (req) =>
			opendata.api["NhCategorie"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allNhCategorie, 
					type: 'NhCategorie', 
					meta: result.data._allNhCategorieMeta
				}
			}),
		'nh_sector/': (req) =>
			opendata.api["NhSector"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allNhSector, 
					type: 'NhSector', 
					meta: result.data._allNhSectorMeta
				}
			}),
		'nh_schoolsoort/': (req) =>
			opendata.api["NhSchoolsoort"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allNhSchoolsoort, 
					type: 'NhSchoolsoort', 
					meta: result.data._allNhSchoolsoortMeta
				}
			}),
		'nh_leerweg/': (req) =>
			opendata.api["NhLeerweg"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allNhLeerweg, 
					type: 'NhLeerweg', 
					meta: result.data._allNhLeerwegMeta
				}
			}),
		'nh_bouw/': (req) =>
			opendata.api["NhBouw"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allNhBouw, 
					type: 'NhBouw', 
					meta: result.data._allNhBouwMeta
				}
			}),
		'nh_niveau/': (req) =>
			opendata.api["NhNiveau"](req.params, req.query)
			.then(function(result) {
				return { 
					data: result.data.allNhNiveau, 
					type: 'NhNiveau', 
					meta: result.data._allNhNiveauMeta
				}
			})
	}
};