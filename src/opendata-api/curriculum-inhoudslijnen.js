module.exports = {
	context: 'inhoudslijnen',
	jsonld: 'https://opendata.slo.nl/curriculum/schemas/inhoudslijnen.jsonld',
	schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-inhoudslijnen/context.json',
	queries: {
		InhVakleergebied: `query InhVakleergebied($page:Int, $perPage:Int) {
			allInhVakleergebied(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:false}) {
				id
				prefix
				title
				Vakleergebied {
					id
					title
					deprecated
				}
				NiveauIndex {
					Niveau {
						...NiveauShort
					}
				}
			}
			_allInhVakleergebiedMeta {
				count
			}
		}`,
		InhInhoudslijn: `query InhInhoudslijn($page:Int, $perPage:Int) {
			allInhInhoudslijn(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:false}) {
				id
				prefix
				title
				InhVakleergebied {
					id
					title
					deprecated
				}
				NiveauIndex {
					Niveau {
						...NiveauShort
					}
				}
			}
			_allInhInhoudslijnMeta {
				count
			}
		}`,
		InhCluster: `query InhCluster($page:Int, $perPage:Int) {
			allInhCluster(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:false}) {
				id
				prefix
				title
				unreleased
				InhInhoudslijn {
					InhVakleergebied {
						id
						title
						deprecated
					}
				}
				NiveauIndex {
					Niveau {
						...NiveauShort
					}
				}
			}
			_allInhClusterMeta {
				count
			}
		}`,
		InhSubcluster: `query InhSubcluster($page:Int, $perPage:Int) {
			allInhSubcluster(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:false}) {
				id
				prefix
				title
				unreleased
				InhCluster {
					InhInhoudslijn {
						InhVakleergebied {
							id
							title
							deprecated
						}
					}
				}
			}
			_allInhSubclusterMeta {
				count
			}
		}`,
		InhoudslijnVolledig: `query InhoudslijnVolledig($id:ID, $niveau:ID){
		  InhVakleergebied(id:$id){
		    id
		    prefix
		    title
		    NiveauIndex(filter:{niveau_id:[$niveau]}) {
		      Niveau {
		        ...NiveauShort
		      }
		    }
		    InhInhoudslijn {
		      id
		      prefix
		      title
		      deprecated
		      InhCluster {
		        id
		        prefix
		        title
		        deprecated
		        InhSubcluster {
		          id
		          prefix
		          title
		          deprecated
		          Doelniveau(filter:{niveau_id:[$niveau]}) {
		            ...Doelen
		          }
		        }
		        Doelniveau(filter:{niveau_id:[$niveau]}) {
		          ...Doelen
		        }
		      }
		      Doelniveau(filter:{niveau_id:[$niveau]}) {
		        ...Doelen
		      }
		    }
		    Doelniveau(filter:{niveau_id:[$niveau]}) {
		      ...Doelen
		    }
		  }
		}`
	},
	typedQueries: {
		'inh_vakleergebied': `
			id
			prefix
			title
			Vakleergebied {
				id
				title
				deprecated
			}
			InhInhoudslijn {
				id
				prefix
				title
				deprecated 
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
		'inh_inhoudslijn': `
			id
			prefix
			title
			InhCluster {
				id
				prefix
				title
				deprecated
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
		'inh_cluster': `
			id
			prefix
			title
			InhSubcluster {
				id
				prefix
				title
				deprecated
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
		'inh_subcluster': `
			id
			prefix
			title
			InhCluster {
				id
				prefix
				title
				deprecated
			}
			Doelniveau {
				...DoelNiveau
			}    
		`
	},
	idQuery: `
		allInhVakleergebied(filter:{id:$id}) {
			id
			prefix
			title
			Vakleergebied {
				id
				title
				deprecated
			}
			InhInhoudslijn {
				id
				prefix
				title
				deprecated 
			}
			Doelniveau {
				...DoelNiveau
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		}
		allInhInhoudslijn(filter:{id:$id}) {
			id
			prefix
			title
			InhCluster {
				id
				prefix
				title
			}
			Doelniveau {
				...DoelNiveau
			}		
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		}
		allInhCluster(filter:{id:$id}) {
			id
			prefix
			title
			InhSubcluster {
				id
				prefix
				title
			}
			Doelniveau {
				...DoelNiveau
			}
			NiveauIndex {
				Niveau {
					...NiveauShort
				}
			}
		}
		allInhSubcluster(filter:{id:$id}) {
			id
			prefix
			title
			InhCluster {
				id
				prefix
				title
			}
			Doelniveau {
				...DoelNiveau
			}    
		}

	`,
	routes: {
		'inh_vakleergebied/': (req) =>
			opendata.api["InhVakleergebied"](req.params, req.query)
			.then(function(result) {
				return { data: result.data.allInhVakleergebied, type: 'InhVakleergebied', meta: result.data._allInhVakleergebiedMeta}
			}),
		'inh_inhoudslijn/': (req) =>
			opendata.api["InhInhoudslijn"](req.params, req.query)
			.then(function(result) {
				return { data: result.data.allInhInhoudslijn, type: 'InhInhoudslijn', meta: result.data._allInhInhoudslijnMeta}
			}),
		'inh_cluster/': (req) =>
			opendata.api["InhCluster"](req.params, req.query)
			.then(function(result) {
				return { data: result.data.allInhCluster, type: 'InhCluster', meta: result.data._allInhClusterMeta}
			}),
		'inh_subcluster/': (req) =>
			opendata.api["InhSubcluster"](req.params, req.query)
			.then(function(result) {
				return { data: result.data.allInhCluster, type: 'InhSubcluster', meta: result.data._allInhSubclusterMeta}
			}),
		'niveau/:niveau/inh_vakleergebied/:id/doelen': (req) =>
			opendata.api['InhoudslijnVolledig'](req.params)
			.then(function(result) {
				result.data.InhVakleergebied.Niveau = result.data.InhVakleergebied.NiveauIndex[0].Niveau[0];
				return {
					data: result.data.InhVakleergebied,
					type: 'InhVakleergebied'
				}
			})
	}
};