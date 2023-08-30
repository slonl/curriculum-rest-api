
    function updateDataSource(name) {
        window.document.querySelectorAll('[data-simply-data="'+name+'"]').forEach(function(list) {
            window.editor.list.applyDataSource(list, name);
        });
    }

    var contexts = {
        'curriculum-fo':{
            title: 'Curriculum Funderend onderwijs',
            data: {
                fo_domein: 'Domein',
                fo_subdomein: 'Subdomein',
                fo_doelzin: 'Doelzin',
                fo_toelichting: 'Toelichting',
                fo_uitwerking: 'Uitwerking'
            }
        },
        'curriculum-samenhang': {
            title: 'Samenhang',
            data: {
                tag: 'Begrippen',
                relatie: 'Relaties'
            }
        },
        'curriculum-basis': {
            title: 'Basis',
            data: {
                vakleergebied: 'Vakleergebied',
                niveau: 'Niveau',
                doelniveau: 'DoelNiveau',
                doel: 'Doel'
            }
        },
        'curriculum-kerndoelen': {
            title: 'Kerndoelen',
            data: {
                kerndoel_vakleergebied: 'KerndoelVakleergebied',
                kerndoel_domein: 'KerndoelDomein',
                kerndoel: 'Kerndoel',
                kerndoel_uitstroomprofiel: 'KerndoelUitstroomprofiel'
            }
        },
        'curriculum-examenprogramma': {
            title: 'Examenprogramma',
            data: {
                examenprogramma: 'Examenprogramma',
                examenprogramma_vakleergebied: 'ExamenprogrammaVakleergebied',
                examenprogramma_domein: 'ExamenprogrammaDomein',
                examenprogramma_subdomein: 'ExamenprogrammaSubdomein',
                examenprogramma_eindterm: 'ExamenprogrammaEindterm'
            }
        },
        'curriculum-syllabus': {
            title: 'Syllabus',
            data: {
                syllabus: 'Syllabus',
                syllabus_vakleergebied: 'SyllabusVakleergebied',
                syllabus_specifieke_eindterm: 'SyllabusSpecifiekeEindterm',
                syllabus_toelichting: 'SyllabusToelichting',
                syllabus_vakbegrip: 'SyllabusVakbegrip'
            }
        },
        'curriculum-examenprogramma-bg': {
            title: 'Examenprogramma Beroepsgericht',
            data: {
                examenprogramma_bg_profiel: 'ExamenprogrammaBgProfiel',
                examenprogramma_bg_kern: 'ExamenprogrammaBgKern',
                examenprogramma_bg_kerndeel: 'ExamenprogrammaBgKerndeel',
                examenprogramma_bg_globale_eindterm: 'ExamenprogrammaBgGlobaleEindterm',
                examenprogramma_bg_module: 'ExamenprogrammaBgModule',
                examenprogramma_bg_keuzevak: 'ExamenprogrammaBgKeuzevak',
                examenprogramma_bg_deeltaak: 'ExamenprogrammaBgDeeltaak',
                examenprogramma_bg_moduletaak: 'ExamenprogrammaBgModuletaak',
                examenprogramma_bg_keuzevaktaak: 'ExamenprogrammaBgKeuzevaktaak'
            }
        },
        'curriculum-referentiekader': {
            title: 'Referentiekader',
            data: {
                ref_vakleergebied: 'RefVakleergebied',
                ref_domein: 'RefDomein',
                ref_subdomein: 'RefSubdomein',
                ref_onderwerp: 'RefOnderwerp',
                ref_deelonderwerp: 'RefDeelonderwerp',
                ref_tekstkenmerk: 'RefTekstkenmerk'
            }
        },
        'curriculum-erk': {
            title: 'Europees referentiekader',
            data: {
                erk_vakleergebied: 'ErkVakleergebied',
                erk_gebied: 'ErkGebied',
                erk_categorie: 'ErkCategorie',
                erk_taalactiviteit: 'ErkTaalactiviteit',
                erk_schaal: 'ErkSchaal',
                erk_candobeschrijving: 'ErkCandobeschrijving',
                erk_voorbeeld: 'ErkVoorbeeld',
                erk_lesidee: 'ErkLesidee'
            }
        },
        'curriculum-leerdoelenkaarten': {
            title: 'Leerdoelenkaarten',
            data: {
                ldk_vakleergebied: 'LdkVakleergebied',
                ldk_vakkern: 'LdkVakkern',
                ldk_vaksubkern: 'LdkVaksubkern',
                ldk_vakinhoud: 'LdkVakinhoud',
                ldk_vakbegrip: 'LdkVakbegrip'
            }
        },
        'curriculum-inhoudslijnen': {
            title: 'Inhoudslijnen',
            data: {
                inh_vakleergebied: 'InhVakleergebied',
                inh_inhoudslijn: 'InhInhoudslijn',
                inh_cluster: 'InhCluster',
                inh_subcluster: 'InhSubcluster'
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
