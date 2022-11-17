module.exports = {
  context: "examenprogramma_bg",
  jsonld:
    "https://opendata.slo.nl/curriculum/schemas/examenprogramma_bg.jsonld",
  schema:
    "https://opendata.slo.nl/curriculum/schemas/curriculum-examenprogramma-bg/context.json",
  queries: {
    ExamenprogrammaBgProfiel: `query ExamenprogrammaBgProfiel($page:Int,$perPage:Int) {
		  allExamenprogrammaBgProfiel (page:$page,perPage:$perPage,sortField:"prefix") {
			id
			prefix
			title
			Vakleergebied {
			  id
			  title
			  deprecated
			}
		  }
		  _allExamenprogrammaBgProfielMeta {
			 count
		  }
		}`,
    ExamenprogrammaBgKern: `query ExamenprogrammaBgKern($page:Int,$perPage:Int) {
		  allExamenprogrammaBgKern (page:$page,perPage:$perPage,sortField:"prefix") {
			id
			prefix
			title
			ExamenprogrammaBgProfiel {
			  id
			  title
			  deprecated
			}
		  }
		  _allExamenprogrammaBgKernMeta {
			count
		  }
		}`,
    ExamenprogrammaBgKerndeel: `query ExamenprogrammaBgKerndeel($page:Int,$perPage:Int) {
		  allExamenprogrammaBgKerndeel (page:$page,perPage:$perPage,sortField:"prefix") {
			id
			prefix
			title
		  }
		  _allExamenprogrammaBgKerndeelMeta {
			count
		  }
		}`,
    ExamenprogrammaBgGlobaleEindterm: `query ExamenprogrammaBgGlobaleEindterm($page:Int,$perPage:Int) {
		  allExamenprogrammaBgGlobaleEindterm (page:$page,perPage:$perPage,sortField:"prefix") {
			id
			prefix
			title
		  }
		  _allExamenprogrammaBgGlobaleEindtermMeta {
			count
		  }
		}`,
    ExamenprogrammaBgModule: `query ExamenprogrammaBgModule($page:Int,$perPage:Int) {
		  allExamenprogrammaBgModule (page:$page,perPage:$perPage,sortField:"prefix") {
			id
			prefix
			title
			ExamenprogrammaBgProfiel {
			  id
			  title
			  deprecated
			}
		  }
		  _allExamenprogrammaBgModuleMeta {
			count
		  }
		}`,
    ExamenprogrammaBgDeeltaak: `query ExamenprogrammaBgDeeltaak($page:Int,$perPage:Int) {
		  allExamenprogrammaBgDeeltaak (page:$page,perPage:$perPage,sortField:"prefix") {
			id
			prefix
			title
		  }
		  _allExamenprogrammaBgDeeltaakMeta {
			count
		  }
		}`,
    ExamenprogrammaBgModuletaak: `query ExamenprogrammaBgModuletaak($page:Int,$perPage:Int) {
		  allExamenprogrammaBgModuletaak (page:$page,perPage:$perPage,sortField:"prefix") {
			id
			prefix
			title
		  }
		  _allExamenprogrammaBgModuletaakMeta {
			count
		  }
		}`,
    ExamenprogrammaBgKeuzevak: `query ExamenprogrammaBgKeuzevak($page:Int,$perPage:Int) {
		  allExamenprogrammaBgKeuzevak (page:$page,perPage:$perPage,sortField:"prefix") {
			id
			prefix
			title
			ExamenprogrammaBgProfiel {
			  id
			  title
			  deprecated
			}
		  }
		  _allExamenprogrammaBgKeuzevakMeta {
			count
		  }
		}`,
    ExamenprogrammaBgKeuzevaktaak: `query ExamenprogrammaBgKeuzevaktaak($page:Int,$perPage:Int) {
		  allExamenprogrammaBgKeuzevaktaak (page:$page,perPage:$perPage,sortField:"prefix") {
			id
			prefix
			title
		  }
		  _allExamenprogrammaBgKeuzevaktaakMeta {
			count
		  }
		}`,
    ExamenprogrammaBgVolledig: `query ExamenprogrammaBgVolledig($id:ID) {
		  ExamenprogrammaBgProfiel(id:$id){
			id
			prefix
			title
			deprecated
			  ExamenprogrammaBgKern {
				id
				title
				deprecated
				ExamenprogrammaBgKerndeel {
				  id
				  title
				  deprecated
				  ExamenprogrammaBgGlobaleEindterm {
					id
					title
					deprecated
				  }
				}
			  }
			  ExamenprogrammaBgModule {
				id
				title
				deprecated
				ExamenprogrammaBgDeeltaak {
				  id
				  title
				  deprecated
				  ExamenprogrammaBgGlobaleEindterm {
					id
					title
					deprecated
				  }
				}
				ExamenprogrammaBgModuletaak {
					id
					title
					deprecated
				}
			  }
			  ExamenprogrammaBgKeuzevak {
				id
				title
				deprecated
				ExamenprogrammaBgDeeltaak {
				  id
				  title
				  deprecated
				  ExamenprogrammaBgGlobaleEindterm {
					id
					title
					deprecated
				  }
				}
				ExamenprogrammaBgKeuzevaktaak {
					id
					title
					deprecated
				}
			  }
			}
		  }`,
  },
  typedQueries: {
    examenprogramma_bg_profiel: `
			id
			prefix
			title
			replaces
			Vakleergebied {
			  id
			  title
			  deprecated
			}
			ExamenprogrammaBgKern {
			  id
			  prefix
			  title
			  deprecated
			}
			ExamenprogrammaBgModule {
			  id
			  prefix
			  title
			  deprecated
			}
			ExamenprogrammaBgKeuzevak {
			  id
			  prefix
			  title
			  deprecated
			}
		`,
    examenprogramma_bg_kern: `
			id
			prefix
			title
			replaces
			ExamenprogrammaBgProfiel {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaBgKerndeel {
				id
				prefix
				title
				deprecated
			}
		`,
    examenprogramma_bg_kerndeel: `
			id
			prefix
			title
			ExamenprogrammaBgKern {
				id
				prefix
				title
				deprecated
				ExamenprogrammaBgProfiel {
					id
					title
					deprecated
				}
			}
			ExamenprogrammaBgGlobaleEindterm {
				id
				prefix
				title
				deprecated
			}
		`,
    examenprogramma_bg_globale_eindterm: `
			id
			prefix
			title
			Niveau {
				...NiveauShort
			}
			ExamenprogrammaBgKerndeel {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaBgDeeltaak {
				id
				prefix
				title
				deprecated
			}
		`,
    examenprogramma_bg_module: `
			id
			prefix
			title
			ExamenprogrammaBgProfiel {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaBgDeeltaak {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaBgModuletaak{
				id
				prefix
				title
				deprecated
			}
		`,
    examenprogramma_bg_deeltaak: `
			id
			prefix
			title
			ExamenprogrammaBgGlobaleEindterm {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaBgModule {
				id
				prefix
				title
				deprecated
				ExamenprogrammaBgProfiel {
					id
					title
					deprecated
				}
			}
			ExamenprogrammaBgKeuzevak {
				id
				prefix
				title
				deprecated
				ExamenprogrammaBgProfiel {
					id
					title
					deprecated
				}
			}
		`,
    examenprogramma_bg_moduletaak: `
			id
			prefix
			title
			ExamenprogrammaBgModule {
				id
				prefix
				title
				deprecated
				ExamenprogrammaBgProfiel {
					id
					title
					deprecated
				}
			}
			Niveau {
				...NiveauShort
			}
		`,
    examenprogramma_bg_keuzevak: `
			id
			prefix
			title
			ExamenprogrammaBgProfiel {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaBgDeeltaak {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaBgKeuzevaktaak {
				id
				prefix
				title
				deprecated
			}
		`,
    examenprogramma_bg_keuzevaktaak: `
			id
			prefix
			title
			ExamenprogrammaBgKeuzevak {
				id
				prefix
				title
				deprecated
				ExamenprogrammaBgProfiel {
					id
					title
					deprecated
				}
			}
			Niveau {
				...NiveauShort
			}
		`,
  },
  idQuery: `
		allExamenprogrammaBgProfiel(filter:{id:$id}) {
			id
			prefix
			title
			Vakleergebied {
				id
				title
				deprecated
			}
			ExamenprogrammaBgKern {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaBgModule {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaBgKeuzevak {
				id
				prefix
				title
				deprecated
			}
		}
		allExamenprogrammaBgKern(filter:{id:$id}) {
			id
			prefix
			title
			ExamenprogrammaBgProfiel {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaBgKerndeel {
				id
				prefix
				title
				deprecated
			}
		}
		allExamenprogrammaBgKerndeel(filter:{id:$id}) {
			id
			prefix
			title
			ExamenprogrammaBgKern {
				id
				prefix
				title
				deprecated
				ExamenprogrammaBgProfiel {
					id
					title
					deprecated
				}
			}
			ExamenprogrammaBgGlobaleEindterm {
				id
				prefix
				title
				deprecated
			}
		}
		allExamenprogrammaBgGlobaleEindterm(filter:{id:$id}) {
			id
			prefix
			title
			ExamenprogrammaBgKerndeel {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaBgDeeltaak {
				id
				prefix
				title
				deprecated
			}
		}
		allExamenprogrammaBgModule(filter:{id:$id}) {
			id
			prefix
			title
			ExamenprogrammaBgProfiel {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaBgDeeltaak {
				id
				prefix
				title
				deprecated
			}
			ExamenprogrammaBgModuletaak{
				id
				prefix
				title
				deprecated
			}
		}
		allExamenprogrammaBgDeeltaak(filter:{id:$id}) {
			id
			prefix
			title
			replaces
			ExamenprogrammaBgGlobaleEindterm {
				id
				prefix
				title
			}
			ExamenprogrammaBgModule {
				id
				prefix
				title
				ExamenprogrammaBgProfiel {
					id
					title
				}
			}
			ExamenprogrammaBgKeuzevak {
				id
				prefix
				title	  
				ExamenprogrammaBgProfiel {
					id
					title
				}
			}
		}
		allExamenprogrammaBgModuletaak(filter:{id:$id}) {
			id
			prefix
			title
			replaces
			ExamenprogrammaBgModule {
				id
				prefix
				title
				ExamenprogrammaBgProfiel {
					id
					title
				}
			}
			Niveau {
				...NiveauShort
			}
		}
		allExamenprogrammaBgKeuzevak(filter:{id:$id}) {
			id
			prefix
			title
			replaces
			ExamenprogrammaBgProfiel {
				id
				prefix
				title
			}
			ExamenprogrammaBgDeeltaak {
				id
				prefix
				title
			}
			ExamenprogrammaBgKeuzevaktaak {
				id
				prefix
				title
			}
		}
		allExamenprogrammaBgKeuzevaktaak(filter:{id:$id}) {
			id
			prefix
			title
			replaces
			ExamenprogrammaBgKeuzevak {
				id
				prefix
				title
				ExamenprogrammaBgProfiel {
					id
					title
				}
			}
			Niveau {
				...NiveauShort
			}
		}
	`,
  routes: {
    "examenprogramma_bg/:id": (req) =>
      opendata.api["ExamenprogrammaBgVolledig"](req.params, req.query).then(
        function (result) {
          return {
            data: result.data.ExamenprogrammaBgProfiel,
            type: "ExamenprogrammaBgProfiel",
          };
        }
      ),
    "examenprogramma_bg_profiel/": (req) =>
      opendata.api["ExamenprogrammaBgProfiel"](req.params, req.query).then(
        function (result) {
          return {
            data: result.data.allExamenprogrammaBgProfiel,
            type: "ExamenprogrammaBgProfiel",
            meta: result.data._allExamenprogrammaBgProfielMeta,
          };
        }
      ),
    "examenprogramma_bg_kern/": (req) =>
      opendata.api["ExamenprogrammaBgKern"](req.params, req.query).then(
        function (result) {
          return {
            data: result.data.allExamenprogrammaBgKern,
            type: "ExamenprogrammaBgKern",
            meta: result.data._allExamenprogrammaBgKernMeta,
          };
        }
      ),
    "examenprogramma_bg_kerndeel/": (req) =>
      opendata.api["ExamenprogrammaBgKerndeel"](req.params, req.query).then(
        function (result) {
          return {
            data: result.data.allExamenprogrammaBgKerndeel,
            type: "ExamenprogrammaBgKerndeel",
            meta: result.data._allExamenprogrammaBgKerndeelMeta,
          };
        }
      ),
    "examenprogramma_bg_globale_eindterm/": (req) =>
      opendata.api["ExamenprogrammaBgGlobaleEindterm"](
        req.params,
        req.query
      ).then(function (result) {
        return {
          data: result.data.allExamenprogrammaBgGlobaleEindterm,
          type: "ExamenprogrammaBgGlobaleEindterm",
          meta: result.data._allExamenprogrammaBgGlobaleEindtermMeta,
        };
      }),
    "examenprogramma_bg_module/": (req) =>
      opendata.api["ExamenprogrammaBgModule"](req.params, req.query).then(
        function (result) {
          return {
            data: result.data.allExamenprogrammaBgModule,
            type: "ExamenprogrammaBgModule",
            meta: result.data._allExamenprogrammaBgModuleMeta,
          };
        }
      ),
    "examenprogramma_bg_keuzevak/": (req) =>
      opendata.api["ExamenprogrammaBgKeuzevak"](req.params, req.query).then(
        function (result) {
          return {
            data: result.data.allExamenprogrammaBgKeuzevak,
            type: "ExamenprogrammaBgKeuzevak",
            meta: result.data._allExamenprogrammaBgKeuzevakMeta,
          };
        }
      ),
    "examenprogramma_bg_deeltaak/": (req) =>
      opendata.api["ExamenprogrammaBgDeeltaak"](req.params, req.query).then(
        function (result) {
          return {
            data: result.data.allExamenprogrammaBgDeeltaak,
            type: "ExamenprogrammaBgDeeltaak",
            meta: result.data._allExamenprogrammaBgDeeltaakMeta,
          };
        }
      ),
    "examenprogramma_bg_moduletaak/": (req) =>
      opendata.api["ExamenprogrammaBgModuletaak"](req.params, req.query).then(
        function (result) {
          return {
            data: result.data.allExamenprogrammaBgModuletaak,
            type: "ExamenprogrammaBgModuletaak",
            meta: result.data._allExamenprogrammaBgModuletaakMeta,
          };
        }
      ),
    "examenprogramma_bg_keuzevaktaak/": (req) =>
      opendata.api["ExamenprogrammaBgKeuzevaktaak"](req.params, req.query).then(
        function (result) {
          return {
            data: result.data.allExamenprogrammaBgKeuzevaktaak,
            type: "ExamenprogrammaBgKeuzevaktaak",
            meta: result.data._allExamenprogrammaBgKeuzevaktaakMeta,
          };
        }
      ),
  },
};
