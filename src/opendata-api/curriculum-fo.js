module.exports = {
        context: 'fo',
        jsonld: 'https://opendata.slo.nl/curriculum/schemas/fo.jsonld',
        schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-fo/context.json',
        fragments: {
                SetBasics: `fragment SetBasics on FoSet {
                        id
                        prefix
                        title
                        description
                        karakteristiek
                        NiveauIndex {
                                Niveau {
                                        ...NiveauShort
                                }
                        }
                        Vakleergebied {
                                id
                                title
                                description     
                        }
                }`,
                Doelzin: `fragment Doelzin on FoDoelzin {
                        id
                        prefix
                        title
                        description
                        soort
                        se
                        ce
                        NiveauIndex {
                                Niveau {
                                        ...NiveauShort
                                }
                        }
                        FoUitwerking {
                                id
                                prefix
                                title
                                description
                                Niveau {
                                        id
                                        title
                                        prefix
                                }
                        }
                        FoToelichting {
                                id
                                prefix
                                title
                                description
                                Niveau {
                                        id
                                        title
                                        prefix
                                }
                        }
		}`
        },
        queries: {
                Fo: `query Fo($page: Int, $perPage: Int) {
                        allFoSet(page: $page, perPage: $perPage, sortField: "title", filter: {deprecated: null}) {
                                ...SetBasics
                                FoDomein {
                                        id
                                        prefix
                                        title
                                        description
                                        NiveauIndex {
                                                Niveau {
                                                ...NiveauShort
                                                }
                                        }
                                        FoDoelzin {
                                                ...Doelzin
                                        }
                                        FoSubdomein {
                                                id
                                                prefix
                                                title
                                                description
                                                FoDoelzin {
                                                ...Doelzin
                                                }
                                        }
                                }
                        }
                        _allFoSetMeta {
                                count
                        }
                }`,
                FoVakleergebiedFormPH: `query FoVakleergebiedFormPH($page: Int, $perPage: Int) {
                        allFoSet(page: $page, perPage: $perPage, sortField: "title", filter: {deprecated: null}) {
                                id
                                prefix
                                title
                                description
                                Vakleergebied {
                                        id
                                        title
                                        description     
                                }
                        }
                        _allFoSetMeta {
                                count
                        }
                }`,
                FoSet: `query FoSet($page:Int, $perPage:Int) {
                        allFoSet(page:$page, perPage:$perPage, sortField:"title",filter:{deprecated:null}) {
                                ...SetBasics
                                FoDomein {
                                        id
                                        prefix
                                        title
                                        description
                                        NiveauIndex {
                                                Niveau {
                                                ...NiveauShort
                                                }
                                        }
                                        FoDoelzin {
                                                ...Doelzin
                                        }
                                        FoSubdomein {
                                                id
                                                prefix
                                                title
                                                description
                                                FoDoelzin {
                                                ...Doelzin
                                                }
                                        }
                                }
                        }
                        _allFoSetMeta {
                                count
                        }
                }`,
                FoDomein: `query FoDomein($page:Int, $perPage:Int) {
                        allFoDomein(page:$page, perPage:$perPage, sortField:"title",filter:{deprecated:null}) {
                                id
                                prefix
                                title
                                description
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                                FoSet{
                                        ...SetBasics
                                }
                                FoSubdomein{
                                        id
                                        prefix
                                        title
                                        description
                                        NiveauIndex {
                                                Niveau {
                                                        ...NiveauShort
                                                }
                                        }
                                }
                                FoDoelzin {
                                        ...Doelzin
                                }
                        }
                        _allFoDomeinMeta {
                                count
                        }
                }`,
                FoSubdomein: `query FoSubdomein($page:Int, $perPage:Int) {
                        allFoSubdomein(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:null}) {
                                id
                                prefix
                                title
                                description
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                                FoDomein{
                                        id
                                        prefix
                                        title
                                        description
                                        NiveauIndex {
                                                Niveau {
                                                        ...NiveauShort
                                                }
                                        }
                                }
                                FoDoelzin {
                                        ...Doelzin
                                }
                        }
                        _allFoSubdomeinMeta {
                                count
                        }
                }`,
                FoDoelzin: `query FoDoelzin($page:Int, $perPage:Int) {
                        allFoDoelzin(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:null}) {
                                id
                                prefix
                                title
                                description
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                                FoDomein{
                                        id
                                        prefix
                                        title
                                        description
                                        NiveauIndex {
                                                Niveau {
                                                        ...NiveauShort
                                                }
                                        }
                                }
                                FoSubdomein{
                                        id
                                        prefix
                                        title
                                        description
                                        NiveauIndex {
                                                Niveau {
                                                        ...NiveauShort
                                                }
                                        }
                                }
                                FoUitwerking{
                                        id
                                        prefix
                                        title
                                        description
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                                FoToelichting{
                                        id
                                        prefix
                                        title
                                        description
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        _allFoDoelzinMeta {
                                count
                        }
                }`,
                FoUitwerking: `query FoUitwerking($page:Int, $perPage:Int) {
                        allFoUitwerking(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:null}) {
                                id
                                prefix
                                title
                                description
                                Niveau {
                                        ...NiveauShort
                                }
                                FoDoelzin {
                                        id
                                        prefix
                                        title
                                        description
                                        deprecated
                                        NiveauIndex {
                                                Niveau {
                                                        ...NiveauShort
                                                }
                                        }
                                }
                        }
                        _allFoUitwerkingMeta {
                                count
                        }
                }`,
                FoToelichting: `query FoToelichting($page:Int, $perPage:Int) {
                        allFoToelichting(page:$page, perPage:$perPage, sortField:"prefix",filter:{deprecated:null}) {
                                id
                                prefix
                                title
                                description
                                Niveau {
                                        ...NiveauShort
                                }
                                FoDoelzin {
                                        id
                                        prefix
                                        title
                                        description
                                        deprecated
                                        NiveauIndex {
                                                Niveau {
                                                        ...NiveauShort
                                                }
                                        }
                                }
                        }
                        _allFoToelichtingMeta {
                                count
                        }
                }`
        },
        typedQueries: {
                'fo_set': `
                        ...SetBasics
                        FoDomein {
                                id
                                prefix
                                title
                                description
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        deprecated
                `,
                'fo_domein': `
                        id
                        prefix
                        title
                        description
                        NiveauIndex {
                                Niveau {
                                        ...NiveauShort
                                }
                        }
                        FoSubdomein {
                                id
                                prefix
                                title
                                description
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        FoDoelzin {
                                ...Doelzin
                        }
                        deprecated
                `,
                'fo_subdomein': `
                        id
                        prefix
                        title
                        description
                        FoDomein {
                                id
                                prefix
                                title
                                description
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        NiveauIndex {
                                Niveau {
                                        ...NiveauShort
                                }
                        }
                        FoDoelzin {
                                ...Doelzin
                        }
                        deprecated
                `,
                'fo_doelzin': `
                        id
                        prefix
                        title
                        description
                        NiveauIndex {
                                Niveau {
                                        ...NiveauShort
                                }
                        }
                        FoDomein {
                                id
                                prefix
                                title
                                description
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        FoSubdomein {
                                id
                                prefix
                                title
                                description
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        FoUitwerking {
                                id
                                prefix
                                title
                                description
                                deprecated
                                Niveau {
                                        ...NiveauShort
                                }
                        }
                        FoToelichting {
                                id
                                prefix
                                title
                                description
                                deprecated
                                Niveau {
                                        ...NiveauShort
                                }
                        }
                `,
                'fo_toelichting': `
                        id
                        prefix
                        title
                        description
                        Niveau {
                                ...NiveauShort
                        }
                        FoDoelzin {
                                id
                                prefix
                                title
                                description
                                deprecated
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                `,
                'fo_uitwerking': `
                        id
                        prefix
                        title
                        description
                        Niveau {
                                ...NiveauShort
                        }
                        FoDoelzin {
                                id
                                prefix
                                title
                                description
                                deprecated
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                `
        },
        idQuery: `
                allFoSet(filter:{id:$id}) {
                        id
                        prefix
                        title
                        description
                        Vakleergebied {
                                id
                                prefix
                                title
                                description
                        }
                        FoDomein {
                                id
                                prefix
                                title
                                description
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        NiveauIndex {
                                Niveau {
                                        ...NiveauShort
                                }
                        }
                }
                allFoDomein(filter:{id:$id}) {
                        id
                        prefix
                        title
                        description
                        FoSet {
                                id
                                prefix
                                title
                                description
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        FoSubdomein {
                                id
                                prefix
                                title
                                description
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        FoDoelzin {
                                id
                                prefix
                                title
                                description
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        NiveauIndex {
                                Niveau {
                                        ...NiveauShort
                                }
                        }
                }
                allFoSubdomein(filter:{id:$id}) {
                        id
                        prefix
                        title
                        description
                        FoDomein {
                                id
                                prefix
                                title
                                description
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        FoDoelzin {
                                id
                                prefix
                                title
                                description
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        NiveauIndex {
                                Niveau {
                                        ...NiveauShort
                                }
                        }
                }
                allFoDoelzin(filter:{id:$id}) {
                        id
                        prefix
                        title
                        description
                        FoDomein {
                                id
                                prefix
                                title
                                description
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        FoSubdomein {
                                id
                                prefix
                                title
                                description
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        FoToelichting {
                                id
                                prefix
                                title
                                description
                                Niveau {
                                        ...NiveauShort
                                }
                        }
                        FoUitwerking {
                                id
                                prefix
                                title
                                description
                                Niveau {
                                        ...NiveauShort
                                }
                        }
                        NiveauIndex {
                                Niveau {
                                        ...NiveauShort
                                }
                        }
                        FoSubdomein {
                                id
                                prefix
                                title
                                description
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                }
                allFoToelichting(filter:{id:$id}) {
                        id
                        prefix
                        title
                        description
                        Niveau {
                                id
                                prefix
                                title
                                description
                        }
                        FoDoelzin {
                                id
                                prefix
                                title
                                description
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                }
                allFoUitwerking(filter:{id:$id}) {
                        id
                        prefix
                        title
                        description
                        Niveau {
                                id
                                prefix
                                title
                                description
                        }
                        FoDoelzin {
                                id
                                prefix
                                title
                                description
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                }`,
        routes: {
                'fo/': (req) =>
                        opendata.api["Fo"](req.params, req.query)
                                .then(function (result) {
                                        return {
                                                data: result.data.allFoSet,
                                                type: 'FoSet',
                                                meta: result.data._allFoSetMeta
                                        }
                                }),
                'fovakleergebiedformph/': (req) =>
                        opendata.api["FoVakleergebiedFormPH"](req.params, req.query)
                                .then(function (result) {
                                        return {
                                                data: result.data.allFoSet,
                                                type: 'FoSet',
                                                meta: result.data._allFoSetMeta
                                        }
                                }),
                'fo_set/': (req) =>
                        opendata.api["FoSet"](req.params, req.query)
                                .then(function (result) {
                                        return {
                                                data: result.data.allFoSet,
                                                type: 'FoSet',
                                                meta: result.data._allFoSetMeta
                                        }
                                }),
                'fo_domein/': (req) =>
                        opendata.api["FoDomein"](req.params, req.query)
                                .then(function (result) {
                                        return {
                                                data: result.data.allFoDomein,
                                                type: 'FoDomein',
                                                meta: result.data._allFoDomeinMeta
                                        }
                                }),
                'fo_subdomein/': (req) =>
                        opendata.api["FoSubdomein"](req.params, req.query)
                                .then(function (result) {
                                        return {
                                                data: result.data.allFoSubdomein,
                                                type: 'FoSubdomein',
                                                meta: result.data._allFoSubdomeinMeta
                                        }
                                }),
                'fo_doelzin/': (req) =>
                        opendata.api["FoDoelzin"](req.params, req.query)
                                .then(function (result) {
                                        return {
                                                data: result.data.allFoDoelzin,
                                                type: 'FoDoelzin',
                                                meta: result.data._allFoDoelzinMeta
                                        }
                                }),
                'fo_toelichting/': (req) =>
                        opendata.api["FoToelichting"](req.params, req.query)
                                .then(function (result) {
                                        return {
                                                data: result.data.allFoToelichting,
                                                type: 'FoToelichting',
                                                meta: result.data._allFoToelichtingMeta
                                        }
                                }),
                'fo_uitwerking/': (req) =>
                        opendata.api["FoUitwerking"](req.params, req.query)
                                .then(function (result) {
                                        return {
                                                data: result.data.allFoUitwerking,
                                                type: 'FoUitwerking',
                                                meta: result.data._allFoUitwerkingMeta
                                        }
                                })
        }
};