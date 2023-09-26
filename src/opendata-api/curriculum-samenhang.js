module.exports = {
        context: 'samenhang',
        jsonld: 'https://opendata.slo.nl/curriculum/schemas/samenhang.jsonld',
        schema: 'https://opendata.slo.nl/curriculum/schemas/curriculum-samenhang/context.json',
        queries: {
                Tag: `query Tag($page:Int, $perPage:Int) {
                        allTag(page:$page, perPage:$perPage, filter:{deprecated:null}) {
                                id
                                title
                                unreleased
                                fo_toelichting_id
                                fo_uitwerking_id
                        }
                        _allTagMeta {
                                count
                        }
                }`,
                Relatie: `query Relatie($page:Int, $perPage:Int) {
                        allRelatie(page:$page, perPage:$perPage, filter:{deprecated:null}) {
                                id
                                title
                                unreleased
                                fo_toelichting_id
                                fo_uitwerking_id
                        }
                        _allRelatieMeta {
                                count
                        }
                }`
        },
        typedQueries: {
                'tag': `
                        id
                        title
                        FoToelichting {
                                id
                                title
                                deprecated
                        }
                        FoUitwerking {
                                id
                                title
                                deprecated
                        }
                `,
                'relatie': `
                        id
                        title
                        FoToelichting {
                                id
                                title
                                deprecated
                        }
                        FoUitwerking {
                                id
                                title
                                deprecated
                        }
                `
        },
        idQuery: `
                allTag(filter:{id:$id}) {
                        id
                        title
                        FoToelichting {
                                id
                                title
                                deprecated
                        }
                        FoUitwerking {
                                id
                                title
                                deprecated
                        }
                }
                allRelatie(filter:{id:$id}) {
                        id
                        title
                        FoToelichting {
                                id
                                title
                                deprecated
                        }
                        FoUitwerking {
                                id
                                title
                                deprecated
                        }
                }`,
        routes: {
                'tag/': (req) =>
                        opendata.api["Tag"](req.params, req.query)
                        .then(function(result) {
                                return {
                                        data: result.data.allTag,
                                        type: 'Tag',
                                        meta: result.data._allTagMeta
                                }
                        }),
                'relatie/': (req) =>
                        opendata.api["Relatie"](req.params, req.query)
                        .then(function(result) {
                                return {
                                        data: result.data.allRelatie,
                                        type: 'Relatie',
                                        meta: result.data._allRelatieMeta
                                }
                        })
        }
};