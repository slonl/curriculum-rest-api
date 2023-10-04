
    function updateDataSource(name) {
        window.document.querySelectorAll('[data-simply-data="'+name+'"]').forEach(function(list) {
            window.editor.list.applyDataSource(list, name);
        });
    }

    var contexts = {
        'curriculum-fo':{
            title: 'Curriculum Funderend onderwijs',
            data: {
                FoDomein: 'Domein',
                FoSubdomein: 'Subdomein',
                FoDoelzin: 'Doelzin',
                FoToelichting: 'Toelichting',
                FoUitwerking: 'Uitwerking'
            }
        },
        'curriculum-samenhang': {
            title: 'Samenhang',
            data: {
                Tag: 'Begrippen',
                Relatie: 'Relaties'
            }
        },
        'curriculum-basis': {
            title: 'Basis',
            data: {
                Vakleergebied: 'Vakleergebied',
                Niveau: 'Niveau',
                Doelniveau: 'DoelNiveau',
                Doel: 'Doel'
            }
        },
        'curriculum-kerndoelen': {
            title: 'Kerndoelen',
            data: {
                KerndoelVakleergebied: 'KerndoelVakleergebied',
                KerndoelDomein: 'KerndoelDomein',
                Kerndoel: 'Kerndoel',
                KerndoelUitstroomprofiel: 'KerndoelUitstroomprofiel'
            }
        },
        'curriculum-examenprogramma': {
            title: 'Examenprogramma',
            data: {
                Examenprogramma: 'Examenprogramma',
                ExamenprogrammaVakleergebied: 'ExamenprogrammaVakleergebied',
                ExamenprogrammaDomein: 'ExamenprogrammaDomein',
                ExamenprogrammaSubdomein: 'ExamenprogrammaSubdomein',
                ExamenprogrammaEindterm: 'ExamenprogrammaEindterm'
            }
        },
        'curriculum-syllabus': {
            title: 'Syllabus',
            data: {
                Syllabus: 'Syllabus',
                SyllabusVakleergebied: 'SyllabusVakleergebied',
                SyllabusSpecifiekeEindterm: 'SyllabusSpecifiekeEindterm',
                SyllabusToelichting: 'SyllabusToelichting',
                SyllabusVakbegrip: 'SyllabusVakbegrip'
            }
        },
        'curriculum-examenprogramma-bg': {
            title: 'Examenprogramma Beroepsgericht',
            data: {
                ExamenprogrammaBgProfiel: 'ExamenprogrammaBgProfiel',
                ExamenprogrammaBgKern: 'ExamenprogrammaBgKern',
                ExamenprogrammaBgKerndeel: 'ExamenprogrammaBgKerndeel',
                ExamenprogrammaBgGlobaleEindterm: 'ExamenprogrammaBgGlobaleEindterm',
                ExamenprogrammaBgModule: 'ExamenprogrammaBgModule',
                ExamenprogrammaBgKeuzevak: 'ExamenprogrammaBgKeuzevak',
                ExamenprogrammaBgDeeltaak: 'ExamenprogrammaBgDeeltaak',
                ExamenprogrammaBgModuletaak: 'ExamenprogrammaBgModuletaak',
                ExamenprogrammaBgKeuzevaktaak: 'ExamenprogrammaBgKeuzevaktaak'
            }
        },
        'curriculum-referentiekader': {
            title: 'Referentiekader',
            data: {
                RefVakleergebied: 'RefVakleergebied',
                RefDomein: 'RefDomein',
                RefSubdomein: 'RefSubdomein',
                RefOnderwerp: 'RefOnderwerp',
                RefDeelonderwerp: 'RefDeelonderwerp',
                RefTekstkenmerk: 'RefTekstkenmerk'
            }
        },
        'curriculum-erk': {
            title: 'Europees referentiekader',
            data: {
                ErkVakleergebied: 'ErkVakleergebied',
                ErkGebied: 'ErkGebied',
                ErkCategorie: 'ErkCategorie',
                ErkTaalactiviteit: 'ErkTaalactiviteit',
                ErkSchaal: 'ErkSchaal',
                ErkCandobeschrijving: 'ErkCandobeschrijving',
                ErkVoorbeeld: 'ErkVoorbeeld',
                ErkLesidee: 'ErkLesidee'
            }
        },
        'curriculum-leerdoelenkaarten': {
            title: 'Leerdoelenkaarten',
            data: {
                LdkVakleergebied: 'LdkVakleergebied',
                LdkVakkern: 'LdkVakkern',
                LdkVaksubkern: 'LdkVaksubkern',
                LdkVakinhoud: 'LdkVakinhoud',
                LdkVakbegrip: 'LdkVakbegrip'
            }
        },
        'curriculum-inhoudslijnen': {
            title: 'Inhoudslijnen',
            data: {
                InhVakleergebied: 'InhVakleergebied',
                InhInhoudslijn: 'InhInhoudslijn',
                InhCluster: 'InhCluster',
                InhSubcluster: 'InhSubcluster'
            }
//        },
//        'curriculum-niveauhierarchie':{
//            title: 'Niveau Hierarchie',
//            data: {
//                nh_categorie: 'NhCategorie',
//                nh_sector: 'NhSector',
//                nh_schoolsoort: 'NhSchoolsoort',
//                nh_leerweg: 'NhLeerweg',
//                nh_bouw: 'NhBouw',
//                nh_niveau: 'NhNiveau'
//            }
        }
    }

    editor.addDataSource('contexts', {
        load: Object.entries(contexts).map(([key, value]) => {
            return {
                link: {
                    href: key+'/',
                    innerHTML: value.title
                }
            }
        })
    })

    editor.addDataSource('contexts-select', {
        load: Object.keys(contexts)
    })

    let titles = {}

    Object
        .entries(contexts)
        .forEach(([path, context]) => {
            editor.addDataSource(path, {
                load: Object.entries(context.data).map(([key,value]) => {
                    return {
                        link: {
                            href: key+'/',
                            innerHTML: value
                        }
                    }
                })
            })
            Object.entries(context.data).forEach(([key,value]) => {
                titles[key+'/'] = value;
            })
        }); // leave this ;, otherwise the (function() ) below is parsed incorrectly

    let niveaus = []
    window.slo.api.get('/niveau/')
    .then(niveaus => {
        niveaus = niveaus.data.map(n => n.title)
        editor.addDataSource('niveaus', {
            load: niveaus
        })
    })