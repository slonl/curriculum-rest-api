module.exports = {
  context: "kerndoelen",
  jsonld: "https://opendata.slo.nl/curriculum/schemas/kerndoel.jsonld",
  schema:
    "https://opendata.slo.nl/curriculum/schemas/curriculum-kerndoelen/context.json",
  queries: {
    Kerndoel: `query Kerndoel($page:Int,$perPage:Int) {
		  allKerndoel(page:$page,perPage:$perPage,sortField:"prefix") {
			id
			prefix
			title
			description
			kerndoelLabel
			Niveau {
			  ...NiveauShort
			}
		  }
		  _allKerndoelMeta {
			count
		  }
		}`,
    KerndoelById: `query KerndoelById($id:ID) {
		  Kerndoel(id:$id) {
			id
			title
			Doelniveau {
			  ...DoelNiveau
			}
		  }
		}`,
    KerndoelDomein: `query KerndoelDomein($page:Int,$perPage:Int) {
		  allKerndoelDomein(page:$page,perPage:$perPage,sortField:"title") {
			id
			title
			KerndoelVakleergebied {
			  id
			  title
			  
			}
		  }
		  _allKerndoelDomeinMeta {
			count
		  }
		}`,
    KerndoelUitstroomprofiel: `query KerndoelUitstroomprofiel($page:Int,$perPage:Int) {
		  allKerndoelUitstroomprofiel(page:$page,perPage:$perPage,sortField:"title") {
			id
			title
			KerndoelVakleergebied {
			  id
			  title
			  
			}
		  }
		  _allKerndoelUitstroomprofielMeta {
			count
		  }
		}`,
    KerndoelVakleergebied: `query KerndoelVakleergebied($page:Int,$perPage:Int) {
		  allKerndoelVakleergebied(page:$page,perPage:$perPage,sortField:"title") {
			id
			title
		  }
		  _allKerndoelVakleergebiedMeta {
			count
		  }
		}`,
  },
  typedQueries: {
    kerndoel: `
			id
			title
			description
			kerndoelLabel
			prefix
			KerndoelDomein {
				id
				title
				
				KerndoelVakleergebied {
					id
					title
					
				}
			}
			Niveau {
				...NiveauShort
			}
			Doelniveau {
				...DoelNiveau
			}
			Niveau {
				...Niveau
			}
		`,
    kerndoel_domein: `
			id
			title
			Kerndoel {
				id
				title
				prefix
				kerndoelLabel
				
				Niveau {
					...NiveauShort
				}
			}
			KerndoelVakleergebied {
				id
				title
				
			}
		`,
    kerndoel_vakleergebied: `
			id
			title
			Vakleergebied {
				id
				title
				
			}
			KerndoelDomein {
				id
				title
				
			}
			KerndoelUitstroomprofiel {
				id
				title
				
			}
			Kerndoel {
				id
				title
				prefix
				kerndoelLabel
				
				Niveau {
					...NiveauShort
				}
			}
		`,
    kerndoel_uitstroomprofiel: `
			id
			title
			KerndoelVakleergebied {
				id
				title
				
			}
		`,
  },
  idQuery: `
		allKerndoel(filter:{id:$id}) {
			id
			title
			description
			kerndoelLabel
			prefix
			KerndoelDomein {
				id
				title
				KerndoelVakleergebied {
					id
					title
				}
			}
			Niveau {
				...NiveauShort
			}
			Doelniveau {
				...DoelNiveau
			}
			Niveau {
				...Niveau
			}
		}
		allKerndoelDomein(filter:{id:$id}) {
			id
			title
			Kerndoel {
				id
				title
				prefix
				kerndoelLabel
				Niveau {
					...NiveauShort
				}
			}
			KerndoelVakleergebied {
				id
				title
			}
		}
		allKerndoelVakleergebied(filter:{id:$id}) {
			id
			title
			Vakleergebied {
				id
				title
			}
			KerndoelDomein {
				id
				title
			}
			KerndoelUitstroomprofiel {
				id
				title
			}
			Kerndoel {
				id
				title
				prefix
				kerndoelLabel
				Niveau {
					...NiveauShort
				}
			}
		}
		allKerndoelUitstroomprofiel(filter:{id:$id}) {
			id
			title
			KerndoelVakleergebied {
				id
				title
			}
		}
	`,
  routes: {
    "kerndoel/": (req) =>
      opendata.api["Kerndoel"](req.params, req.query).then(function (result) {
        return {
          data: result.data.allKerndoel,
          type: "Kerndoel",
          meta: result.data._allKerndoelMeta,
        };
      }),
    "kerndoel_domein/": (req) =>
      opendata.api["KerndoelDomein"](req.params, req.query).then(function (
        result
      ) {
        return {
          data: result.data.allKerndoelDomein,
          type: "KerndoelDomein",
          meta: result.data._allKerndoelDomeinMeta,
        };
      }),
    "kerndoel_vakleergebied/": (req) =>
      opendata.api["KerndoelVakleergebied"](req.params, req.query).then(
        function (result) {
          return {
            data: result.data.allKerndoelVakleergebied,
            type: "KerndoelVakleergebied",
            meta: result.data._allKerndoelVakleergebiedMeta,
          };
        }
      ),
    "kerndoel_uitstroomprofiel/": (req) =>
      opendata.api["KerndoelUitstroomprofiel"](req.params, req.query).then(
        function (result) {
          return {
            data: result.data.allKerndoelUitstroomprofiel,
            type: "KerndoelUitstroomprofiel",
            meta: result.data._allKerndoelUitstroomprofielMeta,
          };
        }
      ),
    "niveau/:niveau/kerndoel": (req) =>
      opendata.api["KerndoelOpNiveau"](req.params).then(function (result) {
        return {
          data: result.data.allNiveauIndex[0].Kerndoel,
          type: "Kerndoel",
        };
      }),

    "niveau/:niveau/kerndoel/:id": (req) =>
      opendata.api["KerndoelOpNiveauById"](req.params).then(function (result) {
        return {
          data: result.data.Kerndoel,
          type: "Kerndoel",
        };
      }),

    "niveau/:niveau/kerndoel_vakleergebied": (req) =>
      opendata.api["KerndoelVakleergebiedOpNiveau"](req.params).then(function (
        result
      ) {
        return {
          data: result.data.allNiveauIndex[0].KerndoelVakleergebied,
          type: "KerndoelVakleergebied",
        };
      }),

    "niveau/:niveau/kerndoel_vakleergebied/:id": (req) =>
      opendata.api["KerndoelVakleergebiedByIdOpNiveau"](req.params).then(
        function (result) {
          result.data.allNiveauIndex[0].KerndoelVakleergebied[0].KerndoelDomein =
            result.data.allNiveauIndex[0].KerndoelDomein;
          result.data.allNiveauIndex[0].KerndoelVakleergebied[0].Kerndoel =
            result.data.allNiveauIndex[0].Kerndoel;
          result.data.allNiveauIndex[0].KerndoelVakleergebied[0].Niveau =
            result.data.allNiveauIndex[0].Niveau;
          return {
            data: result.data.allNiveauIndex[0].kerndoelVakleergebied[0],
            type: "kerndoelVakleergebied",
          };
        }
      ),
  },
};
