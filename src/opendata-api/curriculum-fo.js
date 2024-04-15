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
                        unreleased
                }`,
                Doelzin: `fragment Doelzin on FoDoelzin {
                        id
                        title
                        FoUitwerking {
                                id
                                title
                                Niveau {
                                        id
                                        title
                                        prefix
                                }
                        }
                        FoToelichting {
                        id
                        title
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
                                id
                                prefix
                                title
                                FoDomein {
                                        id
                                        title
                                        FoDoelzin {
                                                ...Doelzin
                                        }
                                        FoSubdomein {
                                                id
                                                title
                                                FoDoelzin {
                                                        ...Doelzin
                                                }
                                        }       
                                }
                                unreleased
                                }
                                _allFoSetMeta {
                                count
                        }
                }`,
                FoSet: `query FoSet($page:Int, $perPage:Int) {
                        allFoSet(page:$page, perPage:$perPage, sortField:"title",filter:{deprecated:null}) {
                                ...SetBasics
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                                Vakleergebied {
                                        id
                                        title
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
                                FoSet{
                                        ...SetBasics
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
                                FoSubdomein{
                                        id
                                        title
                                        NiveauIndex {
                                                Niveau {
                                                        ...NiveauShort
                                                }
                                        }
                                }
                                FoDoelzin{
                                        id
                                        title
                                        NiveauIndex {
                                                Niveau {
                                                        ...NiveauShort
                                                }
                                        }
                                }
                                unreleased
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
                                FoDomein{
                                        id
                                        title
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                                FoDoelzin{
                                        id
                                        title
                                        NiveauIndex {
                                                Niveau {
                                                        ...NiveauShort
                                                }
                                        }
                                }
                                unreleased
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
                                FoDomein{
                                        id
                                        title
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                                FoSubdomein{
                                        id
                                        title
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                                unreleased
                                FoUitwerking{
                                        id
                                        title
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                                FoToelichting{
                                        id
                                        title
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
                                FoDoelzin{
                                        id
                                        title
                                        NiveauIndex {
                                                Niveau {
                                                        ...NiveauShort
                                                }
                                        }
                                }
                                unreleased
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
                                FoDoelzin{
                                        id
                                        title
                                        NiveauIndex {
                                                Niveau {
                                                        ...NiveauShort
                                                }
                                        }
                                }
                                unreleased
                        }
                        _allFoToelichtingMeta {
                                count
                        }
                }`
        },
        typedQueries: {
                'fo_set': `
                        id
                        Vakleergebied {
                                id
                                title
                        }
                        prefix
                        title
                        NiveauIndex {
                                Niveau {
                                        ...NiveauShort
                                }
                        }
                        FoDomein {
                                id
                                title
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
                        FoSet {
                                id
                                prefix
                                title
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
                        FoSubdomein {
                                id
                                title
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        FoDoelzin {
                                id
                                title
                                deprecated
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        deprecated
                `,
                'fo_subdomein': `
                        id
                        prefix
                        title
                        FoDomein {
                                id
                                prefix
                                title
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
                                id
                                title
                                deprecated
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        deprecated
                `,
                'fo_doelzin': `
                        id
                        prefix
                        title
                        description
                        FoDomein {
                                id
                                prefix
                                title
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
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        FoUitwerking {
                                id
                                title
                                deprecated
                                Niveau {
                                        ...NiveauShort
                                }
                        }
                        FoToelichting {
                                id
                                title
                                deprecated
                                Niveau {
                                        ...NiveauShort
                                }
                        }
                        NiveauIndex {
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
                                title
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
                                title
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
                        Vakleergebied {
                                id
                                title
                        }
                        FoDomein {
                                id
                                title
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
                        FoSet {
                                id
                                title
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        FoSubdomein {
                                id
                                title
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        FoDoelzin {
                                id
                                title
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
                        FoDomein {
                                id
                                title
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        FoDoelzin {
                                id
                                title
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
                                title
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        FoSubdomein {
                                id
                                title
                                NiveauIndex {
                                        Niveau {
                                                ...NiveauShort
                                        }
                                }
                        }
                        FoToelichting {
                                id
                                title
                                description
                                Niveau {
                                        ...NiveauShort
                                }
                        }
                        FoUitwerking {
                                id
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
                                title
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
                        }
                        FoDoelzin {
                                id
                                title
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
                        }
                        FoDoelzin {
                                id
                                title
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