/* ==========================================================================
   Cours Partie 3 : C7 (Santé scolaire), C8 (CMD Décret 22-178), C9 (Financement)
   Contenu 100 % fidèle aux supports officiels Batna 2
   ========================================================================== */
window.EpiData.courses.push(
  // =========================================================================
  // COURS 7 — Programmes nationaux en milieu spécifique : Santé scolaire
  // =========================================================================
  {
    id: 'C7',
    moduleId: 'M3',
    code: 'C7',
    title: 'Programmes nationaux en milieu spécifique : Santé scolaire',
    shortTitle: 'Santé Scolaire (UDS)',
    professor: 'Dr NOURANI Imane (Université Batna 2)',
    sourceFiles: ['santé scolaire.pdf (39 slides, dont 10 fiches d’évaluation)'],
    bmCount: 8,
    bmSharedNote: '100 % tombés en 2025 (7 QCM Ch. 26 + 1 QCM Ch. 13 Q3 Trachome) !',
    bmRecentCount: 8,
    uniqueConcepts: 5,
    priority: 'very_high',
    priorityScore: 80,
    vigilance2026: false,
    summary: 'Définition d’un programme de santé, population cible, objectif principal, organisation des UDS et équipes EPSP, vaccination scolaire (1AP/1AM/1AS), trachome au Sud, santé bucco-dentaire (« Stop à la carie ») et évaluation.',
    lessons: [
      {
        id: 'L7.1',
        courseId: 'C7',
        order: 1,
        title: 'Programme de santé, population cible, objectif & UDS / EPSP',
        durationMin: 11,
        sourceRef: 'Slides 10–15',
        bmCount: 5,
        bmRefs: ['Ch. 26 Q1 (2025, /)', 'Ch. 26 Q3 (2025, /)', 'Ch. 26 Q5 (2025)', 'Ch. 26 Q6 (2025)', 'Ch. 26 Q7 (2025)'],
        priority: 'very_high',
        priorityScore: 80,
        bmWarning: 'ℹ️ Corrigés manquants (/) dans la BM pour Ch. 26 Q1 à Q4 (tous 2025) : résolus dans cette leçon grâce aux diapositives exactes de Dr Nourani (Q1 = A, Q3 = D).',
        understand: {
          intro: 'Explosion en 2025 : 8 QCM d’un seul coup sur ce cours de Dr Nourani ! Cette première leçon concentre 5 de ces 8 questions autour de la définition des UDS, du rattachement aux EPSP, de l’objectif principal et de la population cible.',
          sections: [
            {
              heading: 'Définition d’un programme, objectif & population cible',
              paragraphs: ['Un <strong>programme de santé</strong> (slide 10) est un ensemble de ressources réunies et mises en œuvre dans une population définie, de façon cohérente dans le temps et l’espace, pour atteindre des objectifs déterminés (<strong>7 notions fondamentales</strong> : problème identifié, population cible, objectifs quantitatifs mesurables, activités, ressources, évaluation, temps).'],
              bullets: [
                '<strong>Population cible (Ch. 26 Q7 A, slide 12) :</strong> 1) <strong>Enfants scolarisés</strong>, 2) <strong>Personnel enseignant</strong>, 3) <strong>Personnel administratif ou de service</strong>.',
                '<strong>Objectif principal (Ch. 26 Q5 B, slide 13) :</strong> fournir à l’enfant et à l’adolescent un ensemble de prestations sur le plan <strong>préventif, curatif et éducatif</strong> pour un <strong>développement harmonieux</strong> physique, mental, intellectuel et social.'
              ]
            },
            {
              heading: 'Organisation des UDS & rattachement EPSP (Piège Q1 vs Q3 !)',
              paragraphs: ['Ne jamais confondre le lieu de rattachement de l’équipe et le local en milieu scolaire :'],
              bullets: [
                '<strong>UDS (Unités de Dépistage et de Suivi — Ch. 26 Q3 D & Q6 B) :</strong> local dédié à la prise en charge sanitaire en milieu scolaire, implanté au niveau des <strong>collèges et lycées</strong>, prenant en charge la santé des enfants scolarisés d’une même <strong>circonscription</strong>.',
                '<strong>Équipe de santé scolaire (Ch. 26 Q1 A) :</strong> composée de <strong>5 profils</strong> (médecin, infirmier, chirurgien-dentiste, assistant médical, psychologue), exerçant au sein des <strong>EPSP (structures de santé de proximité de terrain)</strong>.'
              ]
            }
          ],
          tables: [
            {
              title: 'Distinction clé QCM 2025 : Ch. 26 Q1 vs Q3 vs Q6',
              headers: ['Question BM 2025', 'Ce qui est demandé', 'Réponse exacte (Cours slide 15)'],
              rows: [
                ['Ch. 26 Q1 (corrigé /)', 'L’équipe de santé exerce au sein de…', 'A — Des structures de santé de proximité de terrain (EPSP)'],
                ['Ch. 26 Q3 (corrigé /)', 'La prise en charge en milieu scolaire se fait au niveau…', 'D — Des Unités de Dépistage et de Suivi (UDS)'],
                ['Ch. 26 Q6 (corrigé B)', 'Mission principale des UDS', 'B — Prendre en charge la santé des enfants scolarisés dans une circonscription spécifique']
              ]
            }
          ],
          darija: 'رد بالك من الفرق بين `Q1` و `Q3` في 2025 : <strong>فريق الصحة المدرسية (L’équipe)</strong> يتبع للـ <strong>EPSP</strong> (structures de santé de proximité = `Q1 A`)؛ أما <strong>التكفل داخل الوسط المدرسي</strong> فيدار في الـ <strong>UDS</strong> (`Q3 D`) لي تخدم على نفس الـ <strong>circonscription</strong> وتكون في المتوسطات والثانويات.',
          triad: {
            toUnderstand: [
              'La complémentarité entre l’EPSP (structure de proximité employant les équipes) et l’UDS (unité implantée en collège/lycée par circonscription).',
              'Pourquoi le programme inclut aussi les enseignants et le personnel administratif/de service.'
            ],
            toMemorize: [
              'Population cible : enfants scolarisés + enseignants + personnel administratif/de service.',
              'Objectif principal : prestations préventives, curatives et éducatives pour un développement harmonieux.',
              'Composition UDS (5 profils) : médecin, infirmier, chirurgien-dentiste, assistant médical, psychologue.'
            ],
            toRecognizeInQcm: [
              '« structures de santé privées / CHU / pédiatrie » → FAUX pour la santé scolaire.',
              '« enfants scolarisés et enseignants » → Population cible principale (Ch. 26 Q7 A).'
            ]
          }
        },
        memorize: [
          { id: 'M_L7.1_1', category: 'Définition', title: 'Objectif principal de la santé scolaire (2025)', content: 'Fournir aux enfants et adolescents des prestations <strong>préventives, curatives et éducatives</strong> pour un <strong>développement harmonieux</strong> (physique, mental, intellectuel et social).', highlight: true },
          { id: 'M_L7.1_2', category: 'Liste', title: 'Population cible (2025)', content: '1) <strong>Enfants scolarisés</strong>, 2) <strong>Personnel enseignant</strong>, 3) <strong>Personnel administratif ou de service</strong>.', highlight: true },
          { id: 'M_L7.1_3', category: 'Distinction', title: 'UDS vs EPSP (Piège 2025 Q1 / Q3 / Q6)', content: '<strong>UDS :</strong> implantées en collèges/lycées, prennent en charge les élèves d’une <strong>circonscription</strong>. <strong>Équipe (5 profils) :</strong> rattachée aux <strong>EPSP (structures de santé de proximité de terrain)</strong>.', highlight: true },
          { id: 'M_L7.1_4', category: 'Liste', title: 'Les 5 professionnels de l’équipe UDS', content: 'Médecin, infirmier, chirurgien-dentiste, assistant médical, psychologue.', highlight: false }
        ]
      },
      {
        id: 'L7.2',
        courseId: 'C7',
        order: 2,
        title: 'Vaccination scolaire (1AP/1AM/1AS), couverture & trachome (Sud)',
        durationMin: 9,
        sourceRef: 'Slides 13, 18–19, 26–27 & 33',
        bmCount: 3,
        bmRefs: ['Ch. 26 Q2 (2025, /)', 'Ch. 26 Q4 (2025, /)', 'Ch. 13 Q3 (2025)'],
        priority: 'high',
        priorityScore: 75,
        understand: {
          intro: 'Trois QCM précis de 2025 ont testé les classes cibles de la vaccination, son indicateur d’évaluation et la campagne spécifique des wilayas du Sud (le trachome — question piège mal classée dans Ch. 13 !).',
          sections: [
            {
              heading: 'Vaccination en milieu scolaire & indicateur d’évaluation',
              paragraphs: ['Conformément au calendrier national de vaccination en vigueur :'],
              bullets: [
                '<strong>Classes cibles vaccination (Ch. 26 Q4 D) :</strong> la 1ère année de chaque cycle : <strong>1ère AP, 1ère AM et 1ère AS</strong> (+ rattrapage des non-vaccinés à la rentrée).',
                '<strong>Indicateur d’évaluation de la vaccination (Ch. 26 Q2 C) :</strong> le <strong>taux de couverture vaccinale par antigène</strong> = (Nombre d’élèves vaccinés / Population cible).'
              ]
            },
            {
              heading: 'Campagne accélérée d’élimination du trachome dans les wilayas du Sud',
              paragraphs: ['Slide 19 : la maladie spécifiquement ciblée par la campagne accélérée d’élimination en milieu scolaire dans les <strong>wilayas du Sud</strong> est le <strong>TRACHOME</strong> :'],
              bullets: [
                'Dépistage actif systématique et traitement des cas.',
                'Hygiène quotidienne : lavage des mains et du visage chaque matin.',
                'Amélioration de l’eau, assainissement et lutte contre les mouches.'
              ]
            }
          ],
          tables: [
            {
              title: 'Comparaison anti-piège : Vaccination vs Bucco-dentaire vs Visite systématique',
              headers: ['Activité scolaire', 'Classes cibles exactes', 'Indicateur clé'],
              rows: [
                ['Vaccination scolaire (Q4)', '1ère AP, 1ère AM, 1ère AS (+ rattrapage)', 'Taux de couverture vaccinale par antigène (Q2)'],
                ['Dépistage bucco-dentaire', 'Préscolaire, 1ère AP, 4ème AP, 2ème AM, 1ère AS', 'Indices carieux cao (dents temp.) & CAO (dents 6 ans)'],
                ['Visite médicale systématique', 'Tous les élèves (préscolaire + 1AP à 3AS, public & privé agréé)', '% d’élèves examinés = Examinés / Inscrits']
              ]
            }
          ],
          darija: 'احفظها مليح : التلقيح المدرسي = غير السنوات اللولى تاع كل طور (<strong>1AP, 1AM, 1AS</strong>) ويتقيم بـ <strong>Taux de couverture vaccinale par antigène</strong>. والحملة تاع ولايات الجنوب راهي ضد <strong>Le Trachome (التراخوما)</strong> — عليها في `Ch. 13 Q3` كانت الإجابة <strong>D (Aucune des réponses)</strong> !',
          triad: {
            toUnderstand: [
              'Pourquoi la vaccination cible l’entrée de chaque cycle (1AP, 1AM, 1AS).',
              'Pourquoi Ch. 13 Q3 a pour bonne réponse « Aucune des réponses » (le trachome n’était pas dans A, B, C).'
            ],
            toMemorize: [
              'Vaccination scolaire = 1ère AP, 1ère AM, 1ère AS.',
              'Évaluation vaccination = Taux de couverture vaccinale par antigène.',
              'Campagne wilayas du Sud = Élimination du TRACHOME.'
            ],
            toRecognizeInQcm: [
              '2ème AM dans une question sur la vaccination → PIÈGE FAUX (2ème AM c’est pour les dents !).',
              'Wilayas du Sud + tuberculose / marasme → FAUX (c’est le Trachome !).'
            ]
          }
        },
        memorize: [
          { id: 'M_L7.2_1', category: 'Seuil / Chiffre', title: 'Classes cibles de vaccination scolaire (2025)', content: '<strong>1ère AP, 1ère AM, 1ère AS</strong> (+ séances de rattrapage à la rentrée).', highlight: true },
          { id: 'M_L7.2_2', category: 'Formule', title: 'Évaluation de la vaccination scolaire (2025)', content: '<strong>Taux de couverture vaccinale par antigène</strong> = <span class="math-frac"><span>Vaccinés (B)</span><span>Population cible (A)</span></span>.', highlight: true },
          { id: 'M_L7.2_3', category: 'Piège QCM', title: 'Campagne des wilayas du Sud (2025)', content: 'Campagne accélérée d’élimination du <strong>TRACHOME</strong> (dépistage, traitement, lavage mains/visage, eau/assainissement, lutte mouches).', highlight: true }
        ]
      },
      {
        id: 'L7.3',
        courseId: 'C7',
        order: 3,
        title: 'Santé bucco-dentaire (« Stop à la carie »), cantines & évaluation',
        durationMin: 9,
        sourceRef: 'Slides 20–36',
        bmCount: 0,
        bmRefs: [],
        priority: 'low',
        priorityScore: 25,
        understand: {
          intro: 'Complément direct du cours de Dr Nourani (0 QCM en 2025, mais très propice à de nouveaux QCM 2026) : le programme bucco-dentaire, le contrôle d’hygiène des cantines et la périodicité des rapports d’évaluation.',
          sections: [
            {
              heading: 'Santé bucco-dentaire (« Stop à la carie ») & Contrôle d’hygiène',
              paragraphs: ['Les soins dentaires et la salubrité des établissements complètent le dépistage médical :'],
              bullets: [
                '<strong>Classes cibles bucco-dentaires (slide 20) :</strong> <strong>Préscolaire, 1ère AP, 4ème AP, 2ème AM et 1ère AS</strong>.',
                '<strong>Organisation des soins dentaires :</strong> la polyclinique de l’EPSP réserve <strong>≥ 2 après-midi par semaine</strong> aux élèves ; contrôle <strong>trimestriel</strong>.',
                '<strong>Indices carieux (slides 34–36) :</strong> <strong>cao</strong> (dents temporaires = cariées + absentes + obturées) et <strong>CAO</strong> (dents permanentes de 6 ans) ; Indice = CAO / effectif examiné.',
                '<strong>Cantines scolaires (slide 22) :</strong> les travailleurs des cantines subissent des examens médicaux <strong>au moins 2 fois par an</strong>.',
                '<strong>Évaluation & rapports (slides 26–27) :</strong> 3 types d’indicateurs (dépistage/résultats, activités, coûts) ; rapports <strong>trimestriels</strong> élaborés par les <strong>SEMEP des EPSP</strong> et transmis aux directeurs d’établissements et à la <strong>DSP</strong> ; Comité de wilaya réuni au début de l’année scolaire + chaque trimestre.'
              ]
            }
          ],
          tables: [
            {
              title: 'Repères chiffrés d’hygiène et d’évaluation scolaire',
              headers: ['Élément', 'Norme / Fréquence exacte du cours'],
              rows: [
                ['Classes bucco-dentaires', 'Préscolaire, 1ère AP, 4ème AP, 2ème AM, 1ère AS'],
                ['Créneau polyclinique EPSP (dentaire)', '≥ 2 après-midi par semaine'],
                ['Visite médicale personnel cantines', '≥ 2 fois par an'],
                ['Rapports d’évaluation (SEMEP / EPSP → DSP)', 'Trimestriels (+ réunion Comité de wilaya début d’année et chaque trimestre)']
              ]
            }
          ],
          darija: 'باش ما تتخلطش في 2026 : <strong>الأسنان (Stop à la carie)</strong> = <strong>Préscolaire, 1AP, 4AP, 2AM, 1AS</strong>، وعمال المطاعم المدرسية يديرو فحص طبي <strong>مرتين في العام على الأقل (≥ 2 fois/an)</strong>، والتقارير تبعث <strong>كل ثلاثي (trimestriels)</strong> من SEMEP تاع الـ EPSP للـ DSP.',
          triad: {
            toUnderstand: [
              'La différence entre indices cao (dents de lait) et CAO (dents permanentes de 6 ans).',
              'Le rôle de coordination du SEMEP de l’EPSP et du Comité de wilaya.'
            ],
            toMemorize: [
              'Classes bucco-dentaires : Préscolaire, 1AP, 4AP, 2AM, 1AS.',
              'Polyclinique EPSP ≥ 2 après-midi/semaine ; Cantines ≥ 2 visites médicales/an ; Rapports trimestriels.'
            ],
            toRecognizeInQcm: [
              'Différence de classes cibles entre vaccination (1AP/1AM/1AS) et bucco-dentaire (ajout Préscolaire, 4AP, 2AM).',
              'Périodicité des rapports d’évaluation : trimestrielle (pas annuelle uniquement).'
            ]
          }
        },
        memorize: [
          { id: 'M_L7.3_1', category: 'Liste', title: 'Classes cibles bucco-dentaires (« Stop à la carie »)', content: '<strong>Préscolaire, 1ère AP, 4ème AP, 2ème AM, 1ère AS</strong> (polyclinique EPSP : <strong>≥ 2 après-midi/semaine</strong>).', highlight: true },
          { id: 'M_L7.3_2', category: 'Seuil / Chiffre', title: 'Cantines & Rapports d’évaluation', content: 'Personnel cantines : examens médicaux <strong>≥ 2 fois/an</strong>. Rapports <strong>trimestriels</strong> par les <strong>SEMEP des EPSP</strong> → directeurs + <strong>DSP</strong>.', highlight: true },
          { id: 'M_L7.3_3', category: 'Formule', title: 'Indices carieux cao / CAO', content: '<strong>cao</strong> = dents temporaires (cariées + absentes + obturées) ; <strong>CAO</strong> = dents permanentes de 6 ans ; Indice = CAO / examinés.', highlight: false }
        ]
      }
    ]
  },

  // =========================================================================
  // COURS 8 — Certification de la Cause Médicale de Décès (CMD)
  // =========================================================================
  {
    id: 'C8',
    moduleId: 'M3',
    code: 'C8',
    title: 'Certification de la Cause Médicale de Décès (CMD) & Décret 22-178',
    shortTitle: 'Certificat Décès (CMD)',
    professor: 'Dr NOURANI Imane (SEMEP CHU Batna, 2024–2025)',
    sourceFiles: ['Certification-de-la-Cause-Medicale-de-Deces2(3).pptx (43 slides)', 'modele de cmd et circuit.pptx (19 slides)', 'Republique-Algerienne-Democratique-et-populaire.pptx (16 slides)', 'Formulaire Cértificat médical de décès(1).docx'],
    bmCount: 0,
    bmSharedNote: '⚠️ 0 QCM en BM 2012–2025, MAIS 4 fichiers complets 2024–2025 de Dr Nourani (forte vigilance 2026 !)',
    bmRecentCount: 0,
    uniqueConcepts: 0,
    priority: 'low',
    priorityScore: 30,
    vigilance2026: true,
    summary: 'Décret exécutif n° 22-178 (28/04/2022), 2 volets (nominatif vs anonyme scellé), délais (24 h / 20 j Sud), circuit APC→DSP→INSP, rédaction Partie I (cause initiale vs directe, ACR exclu), Partie II, Partie III (légiste), 4 groupes CIM-10 exclus, règles tumeurs (C97, C34) et décès maternel (42 j).',
    lessons: [
      {
        id: 'L8.1',
        courseId: 'C8',
        order: 1,
        title: 'Décret n° 22-178, les 2 volets, délais & circuit APC → DSP → INSP',
        durationMin: 11,
        sourceRef: 'Republique-Algerienne…pptx (Art. 1–11) & modele de cmd et circuit.pptx',
        bmCount: 0,
        bmRefs: [],
        priority: 'low',
        priorityScore: 30,
        understand: {
          intro: '⚠️ Alerte stratégique 2026 : même si la BM (2012–2025) ne contient encore aucune question sur ce thème, votre dossier comprend 4 fichiers 2024–2025 très détaillés de la même enseignante (Dr Nourani) qui a introduit 8 QCM Santé scolaire en 2025. Maîtrisez-le solidement !',
          sections: [
            {
              heading: 'Cadre juridique : Décret exécutif n° 22-178 du 28 avril 2022',
              paragraphs: ['Ce décret de <strong>11 articles</strong> abroge l’ancien décret 16-80 du 24/02/2016 et fixe le modèle officiel du Certificat Médical de Décès (CMD) en Algérie :'],
              bullets: [
                '<strong>Art. 2 (Médecins habilités) :</strong> établi par <strong>tout médecin autorisé à exercer</strong> (secteur public/fonctionnaire, contractuel, santé militaire, sûreté nationale, secteur privé/libéral).',
                '<strong>Art. 4 (Nombre d’exemplaires) :</strong> délivré en <strong>UN SEUL EXEMPLAIRE</strong> !',
                '<strong>Art. 5 (Structure en 2 volets) :</strong> <strong>Partie supérieure nominative</strong> (volet administratif remis à l’officier d’état civil pour autorisation d’inhumation) + <strong>Partie inférieure anonyme</strong> (volet médical <strong>immédiatement close/scellée par le médecin</strong> pour secret médical, destinée aux autorités sanitaires).',
                '<strong>Art. 8 :</strong> modèle numérique téléchargeable sur la plateforme du Ministère de la Santé.'
              ]
            },
            {
              heading: 'Délais légaux & circuit du volet médical',
              paragraphs: ['Encadré par la Circulaire interministérielle Santé / Intérieur du 16 avril 2017 :'],
              bullets: [
                '<strong>Délai de déclaration par la famille à l’APC (état civil) :</strong> <strong>24 heures</strong>, porté à <strong>20 jours pour les wilayas du Sud</strong>.',
                '<strong>Circuit complet :</strong> <strong>Médecin</strong> → <strong>Famille</strong> → <strong>Officier d’État Civil (APC)</strong> (conserve le volet supérieur, transmet le volet inférieur <strong>mensuellement</strong> avec bordereau) → <strong>DSP</strong> (récupération mensuelle par le <strong>SEMEP</strong>, contrôle qualité, formation médecins) → <strong>INSP</strong> (service des causes de décès : exploitation, codification CIM-10, archivage).'
              ]
            }
          ],
          tables: [
            {
              title: 'Architecture des 2 volets & 3 signalements particuliers du formulaire',
              headers: ['Volet / Rubrique', 'Confidentialité', 'Destinataire & Rôle'],
              rows: [
                ['Partie supérieure', 'Nominative (identité du défunt)', 'Officier d’état civil (APC) → acte de décès & permis d’inhumer'],
                ['Partie inférieure (I, II, III)', 'Anonyme & immédiatement scellée par le médecin', 'Autorités sanitaires : APC → DSP (SEMEP) → INSP (statistiques CIM-10)'],
                ['3 signalements médicolégaux/sanitaires', 'Cases dédiées', '1) Obstacle médicolégal ; 2) Prothèse fonctionnant avec PILE ; 3) Mise immédiate en CERCUEIL HERMÉTIQUE (contagion)']
              ]
            }
          ],
          darija: 'الـ <strong>CMD</strong> في الجزائر يحكمو <strong>Décret 22-178 (28 avril 2022)</strong> : يعمرو <strong>أي طبيب مرخص</strong> في <strong>نسخة وحدة (1 seul exemplaire)</strong> ! فيه زوج أجزاء : الفوقاني بالاسم (للبلدية APC)، والتحتاني <strong>مجهول الهوية (anonyme) ومغلق فورا</strong> من عند الطبيب (يمشي كل شهر : <strong>APC → DSP/SEMEP → INSP</strong>). والديلي تاع التصريح : <strong>24 ساعة</strong> (و<strong>20 يوم</strong> في ولايات الجنوب).',
          triad: {
            toUnderstand: [
              'Pourquoi le volet médical inférieur est détachable, anonyme et scellé par le médecin lui-même (respect du secret médical).',
              'Le rôle de chaque maillon du circuit (APC = administratif, SEMEP/DSP = contrôle qualité mensuel, INSP = codification CIM-10).'
            ],
            toMemorize: [
              'Décret 22-178 du 28 avril 2022 (11 articles, abroge 16-80) ; 1 seul exemplaire.',
              'Délai déclaration APC : 24 h (20 jours wilayas du Sud) ; envoi APC→DSP = mensuel.',
              '3 signalements : obstacle médicolégal, prothèse à pile, cercueil hermétique.'
            ],
            toRecognizeInQcm: [
              '« Délivré en 2 exemplaires » → FAUX (1 seul exemplaire !).',
              '« Réservé aux médecins du secteur public uniquement » → FAUX (tout médecin autorisé, y compris privé/libéral).'
            ]
          }
        },
        memorize: [
          { id: 'M_L8.1_1', category: 'Seuil / Chiffre', title: 'Décret exécutif n° 22-178 (28 avril 2022)', content: '<strong>11 articles</strong> (abroge décret 16-80/2016) ; établi par <strong>tout médecin autorisé</strong> (public, privé, militaire, sûreté) ; délivré en <strong>un seul exemplaire</strong>.', highlight: true },
          { id: 'M_L8.1_2', category: 'Distinction', title: 'Les 2 volets du CMD (Art. 5)', content: '<strong>Partie supérieure :</strong> nominative (volet administratif → APC). <strong>Partie inférieure :</strong> anonyme (volet médical <strong>immédiatement clos/scellé</strong> → DSP/INSP).', highlight: true },
          { id: 'M_L8.1_3', category: 'Seuil / Chiffre', title: 'Délais & Circuit administratif', content: 'Déclaration famille à l’APC : <strong>24 h</strong> (<strong>20 jours</strong> Sud). Circuit (envoi <strong>mensuel</strong>) : <strong>Médecin → Famille → APC → DSP (SEMEP) → INSP</strong>.', highlight: true },
          { id: 'M_L8.1_4', category: 'Liste', title: 'Les 3 signalements particuliers', content: '1) Obstacle médicolégal à l’inhumation, 2) Prothèse fonctionnant avec <strong>pile</strong>, 3) Mise immédiate en <strong>cercueil hermétique</strong> (contagion).', highlight: false }
        ]
      },
      {
        id: 'L8.2',
        courseId: 'C8',
        order: 2,
        title: 'Rédaction Partie I (cause initiale, ACR exclu), Partie II & Partie III',
        durationMin: 12,
        sourceRef: 'Certification-de-la-Cause-Medicale-de-Deces2(3).pptx, slides 10–23 & Art. 6',
        bmCount: 0,
        bmRefs: [],
        priority: 'low',
        priorityScore: 30,
        understand: {
          intro: 'Savoir reconstruire correctement la chaîne causale de la Partie I et distinguer mort naturelle (Art. 6.1) vs mort violente/indéterminée (Art. 6.2) constitue le cœur clinique et médico-légal du cours.',
          sections: [
            {
              heading: 'Règles d’or de rédaction du volet médical (OMS)',
              paragraphs: ['Une rédaction rigoureuse est indispensable pour produire des statistiques de mortalité fiables :'],
              bullets: [
                'Écriture lisible, en <strong>majuscules</strong>, <strong>SANS aucune abréviation</strong> (pas d’« IDM », « AVC », « EP »), <strong>un seul événement par ligne</strong>, sans ligne vide intermédiaire, ordre chronologique respecté.',
                '<strong>INTERDICTION ABSOLUE :</strong> <strong>Ne JAMAIS inscrire « Arrêt cardiaque / ACR »</strong>, un mode de décès (asphyxie terminale, défaillance multiviscérale isolée) ou un symptôme comme cause initiale !',
                '<strong>Statistiques mondiales OMS :</strong> seule la <strong>cause initiale</strong> (dernière ligne remplie de la Partie I) est retenue pour la tabulation nationale et internationale.'
              ]
            },
            {
              heading: 'Mort naturelle (Art. 6.1) vs Mort violente / suspecte / indéterminée (Art. 6.2)',
              paragraphs: ['La conduite du médecin constatant change radicalement selon la nature du décès :'],
              bullets: [
                '<strong>Mort naturelle (Art. 6.1) :</strong> le médecin remplit la partie supérieure ET la partie inférieure (<strong>Parties I et II</strong>), puis la clôt immédiatement.',
                '<strong>Mort violente, suspecte ou indéterminée (Art. 6.2) :</strong> le médecin constatant remplit <strong>UNIQUEMENT la partie supérieure</strong>, coche l’obstacle médicolégal et avise les autorités pour levée de corps. Seul le <strong>médecin légiste</strong> remplit la <strong>Partie III</strong> !'
              ]
            }
          ],
          tables: [
            {
              title: 'Structure exacte du volet médical (avec exemples du cours)',
              headers: ['Rubrique', 'Rôle exact', 'Exemple du cours'],
              rows: [
                ['Partie I — a) Cause directe', 'Complication terminale immédiate ayant entraîné la mort', 'Hémorragie de varices œsophagiennes / Embolie pulmonaire / Choc cardiogénique'],
                ['Partie I — b, c) Intermédiaires', 'Étapes morbides reliant la cause initiale à la directe', 'Hypertension portale ← Cirrhose / Fracture pathologique ← Métastase fémur'],
                ['Partie I — d) Cause INITIALE', 'Maladie ou traumatisme déclencheur (SEULE retenue par l’OMS !)', 'Hépatite virale B chronique / Cancer du sein / HTA chronique / AVP'],
                ['Partie II', 'Autres états morbides importants contributifs SANS lien direct avec Partie I', 'Alcoolisme (dans un ulcère duodénal perforé) ; Varices (jamais répété en Partie I)'],
                ['Partie III', 'Réservée EXCLUSIVEMENT au MÉDECIN LÉGISTE', 'Mort violente, suspecte, indéterminée, CNI']
              ]
            }
          ],
          darija: 'ديما اقرا الـ <strong>Partie I من التحت للفوق</strong> : السطر التحتاني (<strong>d — Cause initiale</strong>) هو المرض الأصلي لي بدى الحكاية كامل وهو لي يدخل في إحصائيات l’OMS؛ والسطر الفوقاني (<strong>a — Cause directe</strong>) هو آخر مضاعفة. <strong>جامي تكتب Arrêt cardiaque (ACR)</strong> ! وكي تكون الموت عنيفة ولا مشبوهة : تعمر <strong>غير الجزء الفوقاني</strong> والـ <strong>Partie III</strong> للطبيب الشرعي وحدو.',
          triad: {
            toUnderstand: [
              'Comment remonter la chaîne causale « dû à » de la ligne a) vers la ligne d).',
              'Pourquoi la Partie II ne doit jamais répéter une affection déjà placée en Partie I.'
            ],
            toMemorize: [
              'Partie I : a = directe ← b/c = intermédiaires ← d = INITIALE (stats OMS).',
              'ACR = mode de décès, JAMAIS cause initiale ; aucune abréviation autorisée.',
              'Art. 6.2 (mort violente) : constatant = partie supérieure uniquement ; Partie III = médecin légiste.'
            ],
            toRecognizeInQcm: [
              'Placer la cause initiale en a) ou inscrire ACR comme cause initiale → FAUX !',
              'Médecin traitant remplissant la Partie III → FAUX (réservée au médecin légiste).'
            ]
          }
        },
        memorize: [
          { id: 'M_L8.2_1', category: 'Classification', title: 'Chaîne causale de la Partie I', content: '<strong>a)</strong> Cause directe/immédiate ← <strong>b, c)</strong> Causes intermédiaires ← <strong>d) Cause INITIALE</strong> (maladie/traumatisme déclencheur — <strong>seule retenue par l’OMS</strong>).', highlight: true },
          { id: 'M_L8.2_2', category: 'Piège QCM', title: 'Interdictions absolues de rédaction', content: '<strong>JAMAIS d’arrêt cardiaque (ACR)</strong> ou mode de décès en cause initiale ; <strong>SANS abréviations</strong> ; 1 seul événement par ligne ; pas de ligne vide intermédiaire.', highlight: true },
          { id: 'M_L8.2_3', category: 'Distinction', title: 'Art. 6.1 (Naturelle) vs Art. 6.2 (Violente/Suspecte)', content: '<strong>Naturelle :</strong> médecin remplit Parties I et II et clôt. <strong>Violente/indéterminée :</strong> médecin remplit <strong>uniquement la partie supérieure</strong> et avise les autorités ; <strong>Partie III = médecin légiste seul</strong>.', highlight: true }
        ]
      },
      {
        id: 'L8.3',
        courseId: 'C8',
        order: 3,
        title: 'Codification CIM-10 (4 groupes exclus), tumeurs & décès maternel',
        durationMin: 11,
        sourceRef: 'Certification-de-la-Cause-Medicale-de-Deces2(3).pptx, slides 24–40',
        bmCount: 0,
        bmRefs: [],
        priority: 'low',
        priorityScore: 30,
        understand: {
          intro: 'Les règles OMS de codification CIM-10 déterminent la cause initiale statistique à partir du certificat rempli — avec 4 groupes formellement exclus, des règles précises pour les cancers et la définition du décès maternel.',
          sections: [
            {
              heading: 'Principe général OMS & les 4 groupes CIM-10 EXCLUS comme cause initiale',
              paragraphs: ['<strong>Principe général OMS :</strong> l’affection mentionnée <strong>seule à la dernière ligne de la Partie I</strong> est sélectionnée comme cause initiale si elle peut logiquement engendrer toutes les affections inscrites au-dessus (si plusieurs affections figurent sur la dernière ligne, rechercher des infos complémentaires).'],
              bullets: [
                '<strong>1) B95–B97 :</strong> agents bactériens ou viraux isolés (sans préciser la maladie clinique).',
                '<strong>2) G97, H95, N99 :</strong> affections post-actes médicaux ou chirurgicaux (coder la pathologie initiale qui a motivé l’acte).',
                '<strong>3) O80–O84 :</strong> accouchement normal/simple (ne peut jamais être cause initiale de décès).',
                '<strong>4) S00–T98 :</strong> lésions traumatiques seules (ex. traumatisme crânien seul exclu → coder la <strong>cause externe</strong>, ex. AVP `V041`, chute, pendaison !).'
              ]
            },
            {
              heading: 'Règles particulières des tumeurs malignes & Décès maternel',
              paragraphs: ['Deux chapitres spéciaux très détaillés dans les cas cliniques de Dr Nourani :'],
              bullets: [
                '<strong>Tumeurs — Code C97 :</strong> deux tumeurs malignes primitives indépendantes toutes deux en <strong>Partie I</strong> → coder <strong>C97</strong>. <strong>Piège :</strong> si la 2ème tumeur est en <strong>Partie II</strong>, on <strong>ignore la Partie II</strong> (PAS de C97 !).',
                '<strong>Lésion pulmonaire (C34) :</strong> associée à une autre tumeur primitive, une lésion du poumon est présumée <strong>métastatique</strong> sauf mention contraire — <strong>SAUF « cancer bronchique »</strong> qui est considéré comme <strong>tumeur primitive</strong> !',
                '<strong>Décès maternel :</strong> décès survenant durant la grossesse, l’accouchement/avortement ou dans les <strong>42 jours</strong> suivant la fin de la gestation (chirurgie récente signalée si < 4 semaines avant décès).'
              ]
            }
          ],
          tables: [
            {
              title: 'Codes CIM-10 & seuils spéciaux à connaître par cœur (C8)',
              headers: ['Code / Seuil', 'Règle exacte du cours'],
              rows: [
                ['B95–B97 / G97,H95,N99 / O80–O84 / S00–T98', 'Les 4 groupes CIM-10 FORMELLEMENT EXCLUS comme cause initiale'],
                ['Traumatisme (ex. Trauma crânien)', 'Ne pas coder S00–T98 en cause initiale → coder la CAUSE EXTERNE (AVP, pendaison…)'],
                ['C97', '2 tumeurs primitives indépendantes en PARTIE I (ignorer la Partie II pour C97 !)'],
                ['C34 (Poumon) vs Cancer bronchique', 'Poumon + autre tumeur = présumé métastase ; « Cancer bronchique » = tumeur PRIMITIVE'],
                ['42 jours / 4 semaines', 'Décès maternel = jusqu’à 42 jours post-gestation ; chirurgie récente = 4 semaines']
              ]
            }
          ],
          darija: 'احفظ 4 مجموعات CIM-10 الممنوعة كـ cause initiale : <strong>B95–B97</strong> (ميكروب وحدو)، <strong>G97/H95/N99</strong> (مضاعفة عملية)، <strong>O80–O84</strong> (ولادة طبيعية)، و<strong>S00–T98</strong> (جرح ولا كسر وحدو ← لازم تكتب السبب الخارجي كيما AVP!). وفي السرطان : زوج أورام أولية في Partie I = <strong>C97</strong> (إذا الثاني في Partie II تجاهلو). ووفيات الأمهات = حتى <strong>42 يوم</strong> بعد الولادة.',
          triad: {
            toUnderstand: [
              'Pourquoi la cause externe (AVP, chute) prime toujours sur la nature de la lésion (trauma crânien S00–T98) en santé publique (prévention des accidents).',
              'La différence entre 2 tumeurs en Partie I (C97) et 1 en Partie I + 1 en Partie II.'
            ],
            toMemorize: [
              'Les 4 groupes CIM-10 exclus : B95–B97, G97/H95/N99, O80–O84, S00–T98.',
              'C97 (2 tumeurs primitives en Partie I) ; C34 (métastase présumée ≠ cancer bronchique primitif) ; Décès maternel = 42 jours.'
            ],
            toRecognizeInQcm: [
              'Trauma crânien S00–T98 choisi comme cause initiale → FAUX (c’est l’AVP !).',
              '2ème tumeur en Partie II → NE PAS coder C97 !'
            ]
          }
        },
        memorize: [
          { id: 'M_L8.3_1', category: 'Liste', title: 'Les 4 groupes CIM-10 EXCLUS comme cause initiale', content: '1) <strong>B95–B97</strong> (agents seuls), 2) <strong>G97 / H95 / N99</strong> (post-actes), 3) <strong>O80–O84</strong> (accouchement normal), 4) <strong>S00–T98</strong> (lésions traumatiques seules → coder la <strong>cause externe</strong>).', highlight: true },
          { id: 'M_L8.3_2', category: 'Distinction', title: 'Règles tumeurs : C97 & Poumon (C34)', content: '<strong>C97 :</strong> 2 tumeurs primitives indépendantes en <strong>Partie I</strong> (ignorer Partie II). Poumon (<strong>C34</strong>) + autre cancer = présumé métastase, <strong>SAUF cancer bronchique = primitif</strong>.', highlight: true },
          { id: 'M_L8.3_3', category: 'Seuil / Chiffre', title: 'Décès maternel & chirurgie récente', content: 'Décès maternel = grossesse, accouchement/avortement ou <strong>≤ 42 jours</strong> après fin de gestation. Chirurgie récente = <strong>≤ 4 semaines</strong>.', highlight: true }
        ]
      }
    ]
  },

  // =========================================================================
  // COURS 9 — Financement du système de santé
  // =========================================================================
  {
    id: 'C9',
    moduleId: 'M3',
    code: 'C9',
    title: 'Financement du système de santé',
    shortTitle: 'Financement Santé',
    professor: 'Faculté de médecine Batna 2 (2023–2024)',
    sourceFiles: ['financement du systèmede santé résumé (1).pdf (22 slides)'],
    bmCount: 6,
    bmSharedNote: '5 QCM Ch. 15 + 1 QCM Ch. 40 Q1 (2021–2023)',
    bmRecentCount: 0,
    uniqueConcepts: 4,
    priority: 'high',
    priorityScore: 65,
    vigilance2026: false,
    summary: 'Problématique de rareté des ressources, les 4 sources de financement en Algérie (État, CNAS/CASNOS, Privé, ressources externes), critères d’évaluation (Équité, Efficacité, Pérennité) et les 3 niveaux d’analyse (Macro, Méso, Micro).',
    lessons: [
      {
        id: 'L9.1',
        courseId: 'C9',
        order: 1,
        title: 'Les 4 sources de financement en Algérie (État, CNAS/CASNOS, Privé)',
        durationMin: 10,
        sourceRef: 'Slides 4–12',
        bmCount: 4,
        bmRefs: ['Ch. 15 Q1 (2023, /)', 'Ch. 40 Q1 (2023, /)', 'Ch. 15 Q3 (2022)', 'Ch. 15 Q5 (ND)'],
        priority: 'high',
        priorityScore: 65,
        understand: {
          intro: 'Face à la rareté des ressources et à la croissance continue des dépenses de santé, le financement en Algérie combine 4 grandes sources complémentaires.',
          sections: [
            {
              heading: 'Les 4 sources de financement du système de santé',
              paragraphs: ['Chaque source possède ses propres recettes, acteurs et rôles :'],
              bullets: [
                '<strong>1) Financement public (État / fiscalité) :</strong> primordial (utilité publique) ; en Algérie, <strong>93,43 %</strong> consacré aux établissements publics (EPSP, EHS, CHU) ; dépenses publiques = 69,8 % (2000) / 74,4 % (2001).',
                '<strong>2) Assurance-maladie / Sécurité sociale (Ch. 15 Q1 A) :</strong> <strong>CNAS</strong> (travailleurs salariés) et <strong>CASNOS</strong> (non-salariés) ; financée par les <strong>cotisations obligatoires des employeurs et travailleurs</strong> ; couvre <strong>5 risques</strong> (maladie, maternité, invalidité, AT, MP) ; remboursement médicaments = <strong>80 %</strong> (<strong>ticket modérateur = 20 %</strong>) et <strong>100 %</strong> maladies chroniques/catégories protégées.',
                '<strong>3) Financement privé :</strong> <strong>direct</strong> (ménages/usagers) ou <strong>indirect</strong> (employeurs, bienfaisance). Contribution symbolique des ménages aux hôpitaux publics = <strong>1,20 %</strong> du budget de fonctionnement (depuis 1974 / arrêté 1995 ; exonérés = démunis, chroniques, PNS, catégories protégées).',
                '<strong>4) Ressources externes :</strong> dons et aides internationales (OMS, UNICEF).'
              ]
            },
            {
              heading: 'Coût d’investissement vs Coût de fonctionnement (Ch. 15 Q3)',
              paragraphs: ['En gestion de projet sanitaire :'],
              bullets: [
                '<strong>Coût d’investissement (en capital — Ch. 15 Q3 A) :</strong> coûts des <strong>terrains, bâtiments, équipements lourds et semi-lourds</strong> (non répétitifs).',
                '<strong>Coût de fonctionnement :</strong> coûts <strong>répétitifs</strong> nécessaires à l’exploitation (salaires, consommables, petites réparations).'
              ]
            }
          ],
          tables: [
            {
              title: 'Sécurité sociale en Algérie : repères exacts',
              headers: ['Organisme / Règle', 'Population / Chiffre exact'],
              rows: [
                ['CNAS vs CASNOS', 'CNAS = travailleurs salariés | CASNOS = travailleurs non-salariés'],
                ['Recettes principales (Ch. 15 Q1)', 'Cotisations obligatoires à la charge des employeurs et des travailleurs'],
                ['Taux de remboursement', '80 % (ticket modérateur 20 %) ; 100 % maladies chroniques & catégories protégées'],
                ['5 risques couverts', 'Maladie, Maternité, Invalidité, Accidents de travail (AT), Maladies professionnelles (MP)']
              ]
            }
          ],
          darija: 'ركز على الفرق في 2023 : تمويل <strong>la sécurité sociale (`Ch.15 Q1`)</strong> يجي من <strong>cotisations</strong> العمال وأرباب العمل (`A`). أما تمويل <strong>le système de santé كامل (`Ch.40 Q1`)</strong> يجمع الدولة (الضرائب) + السيكو (cotisations) + العائلات ! و<strong>CNAS</strong> للأجراء، <strong>CASNOS</strong> لغير الأجراء، والتعويض <strong>80 %</strong> (والـ ticket modérateur = <strong>20 %</strong>).',
          triad: {
            toUnderstand: [
              'La différence entre financement de la sécurité sociale (cotisations) et financement global du système de santé (État + Sécu + ménages + externe).',
              'La distinction coût d’investissement (capital non répétitif) vs coût de fonctionnement (répétitif).'
            ],
            toMemorize: [
              'CNAS (salariés) vs CASNOS (non-salariés) ; remboursement 80 % (ticket modérateur 20 %) / 100 % chroniques.',
              'Coût d’investissement = terrains, bâtiments, équipements lourds/semi-lourds.',
              'Participation ménages aux hôpitaux publics = 1,20 % du budget fonctionnement.'
            ],
            toRecognizeInQcm: [
              '« coûts répétitifs / petites réparations » → fonctionnement (PAS investissement !).',
              'Sécurité sociale = cotisations employeurs/travailleurs (pas la fiscalité directe).'
            ]
          }
        },
        memorize: [
          { id: 'M_L9.1_1', category: 'Liste', title: 'Les 4 sources de financement', content: '1) <strong>Public (État/fiscalité)</strong>, 2) <strong>Assurance-maladie (CNAS/CASNOS — cotisations)</strong>, 3) <strong>Privé</strong> (direct ménages / indirect), 4) <strong>Ressources externes</strong> (OMS, UNICEF).', highlight: true },
          { id: 'M_L9.1_2', category: 'Seuil / Chiffre', title: 'CNAS / CASNOS & Remboursement', content: '<strong>CNAS</strong> = salariés ; <strong>CASNOS</strong> = non-salariés. Remboursement = <strong>80 %</strong> (ticket modérateur <strong>20 %</strong>) ; <strong>100 %</strong> maladies chroniques/protégées. 5 risques : maladie, maternité, invalidité, AT, MP.', highlight: true },
          { id: 'M_L9.1_3', category: 'Définition', title: 'Coût d’investissement (Ch. 15 Q3)', content: 'Coût en capital : <strong>terrains, bâtiments, équipements lourds et semi-lourds</strong> (≠ coûts répétitifs d’exploitation / petites réparations).', highlight: true }
        ]
      },
      {
        id: 'L9.2',
        courseId: 'C9',
        order: 2,
        title: 'Critères d’évaluation (Équité, Efficacité, Pérennité) & rôle du Privé',
        durationMin: 8,
        sourceRef: 'Slides 9 & 18–19',
        bmCount: 2,
        bmRefs: ['Ch. 15 Q2 (2022)', 'Ch. 15 Q4 (2021)', '+ Ch. 15 Q5 (ND)'],
        priority: 'medium',
        priorityScore: 57,
        understand: {
          intro: 'L’équité est tombée deux années de suite (2021 et 2022) dans exactement les mêmes termes ! La matrice Équité / Efficacité pour Public, Sécu et Privé permet de répondre en 3 secondes sans hésitation.',
          sections: [
            {
              heading: 'Les 3 critères d’évaluation d’un système de financement',
              paragraphs: ['Tout système de financement s’évalue selon 3 axes :'],
              bullets: [
                '<strong>Équité (Ch. 15 Q2 & Q4 A) :</strong> permet d’apprécier l’<strong>accès aux soins</strong> (accès financier pour tous, sans barrière excluant les plus démunis).',
                '<strong>Efficacité :</strong> capacité à utiliser de façon optimale les ressources en évitant le gaspillage et la mauvaise gestion.',
                '<strong>Pérennité :</strong> capacité à assurer la <strong>continuité des services</strong> prodigués dans le temps.'
              ]
            }
          ],
          tables: [
            {
              title: 'Matrice comparative Public / Sécurité sociale / Privé (Slides 18–19)',
              headers: ['Source de financement', 'Équité (accès aux soins)', 'Efficacité / Gestion', 'Avantages & Limites clés'],
              rows: [
                ['Public (État)', '✅ OUI (assure l’équité)', '⚠️ Pas entièrement efficace (lourdeurs bureaucratiques)', 'Solidarité nationale, mais risque de gaspillage'],
                ['Assurance-maladie (Sécu)', '✅ OUI (assure l’équité)', '✅ Efficace SI contrôle rigoureux', 'Mutualisation du risque entre cotisants'],
                ['Privé', '❌ NON (exclusion des pauvres, inéquité)', '✅ Plus efficace (évite gaspillage et mauvaise gestion)', 'Fournit d’autres ressources à la santé (Ch. 15 Q5 B) et allège l’État']
              ]
            }
          ],
          darija: 'قاعدة ساهلة : <strong>Équité = accès aux soins</strong> (طاحت في 2021 و 2022) ؛ <strong>Pérennité = continuité des services</strong>. الـ <strong>Public + Sécu</strong> يضمنو الـ Équité. أما الـ <strong>Privé</strong> يعطي موارد إضافية ويمنع التبذير (évite le gaspillage) بصح <strong>ما يضمنش الـ Équité</strong> (يقصي الفقراء).',
          triad: {
            toUnderstand: [
              'Pourquoi le financement privé évite le gaspillage mais crée une barrière financière excluant les pauvres.',
              'Pourquoi l’équité (accès) et la pérennité (continuité) sont deux critères distincts.'
            ],
            toMemorize: [
              'Équité = apprécie l’accès aux soins ; Pérennité = continuité des services.',
              'Financement privé : fournit d’autres ressources + évite gaspillage, MAIS n’assure PAS l’équité.'
            ],
            toRecognizeInQcm: [
              '« Le financement privé ne permet pas d’éviter le gaspillage » → PIÈGE FAUX (il permet au contraire d’éviter le gaspillage !).',
              '« Le financement privé assure l’équité » → FAUX !'
            ]
          }
        },
        memorize: [
          { id: 'M_L9.2_1', category: 'Définition', title: 'Équité vs Pérennité (2× en BM)', content: '<strong>Équité :</strong> apprécie l’<strong>accès aux soins</strong>. <strong>Pérennité :</strong> apprécie la <strong>continuité des services</strong>. <strong>Efficacité :</strong> gestion sans gaspillage.', highlight: true },
          { id: 'M_L9.2_2', category: 'Distinction', title: 'Avantages & limites du financement privé', content: '<strong>Avantages :</strong> allège l’État, <strong>fournit d’autres ressources</strong>, <strong>évite le gaspillage</strong>. <strong>Inconvénients :</strong> <strong>inéquité</strong> et <strong>exclusion des pauvres</strong>.', highlight: true }
        ]
      },
      {
        id: 'L9.3',
        courseId: 'C9',
        order: 3,
        title: 'Les 3 niveaux d’analyse économique (Macro, Méso, Micro)',
        durationMin: 7,
        sourceRef: 'Slides 13–17 & 21',
        bmCount: 0,
        bmRefs: [],
        priority: 'low',
        priorityScore: 20,
        understand: {
          intro: 'L’analyse économique du financement s’opère à trois échelles emboîtées (Macro / Méso / Micro) qu’il faut savoir associer à leurs exemples exacts du cours.',
          sections: [
            {
              heading: 'Macro-économique, Méso-économique et Micro-économique',
              paragraphs: ['Chaque niveau répond à une question différente et mobilise des indicateurs propres :'],
              bullets: [
                '<strong>Macro-économique :</strong> échelle nationale ou régionale ; agrégats globaux tels que le ratio <strong>DNS / PIB</strong> (Algérie : 4,57 % en 1993 → <strong>7,23 % en 2014 & 2018</strong> ; USA : 12 % ; recoupe `Ch. 18 Q15` CMT+DCS = macro-économie).',
                '<strong>Méso-économique :</strong> échelle du <strong>secteur de la santé lui-même</strong> (répartition par poste budgétaire : les <strong>dépenses de personnel représentent ~80 %</strong> du budget d’un établissement).',
                '<strong>Micro-économique :</strong> échelle d’une <strong>unité particulière</strong> (gestion financière d’un CHU, consommation de médicaments, coût d’une intervention chirurgicale ou d’un GHM).'
              ]
            }
          ],
          tables: [
            {
              title: 'Tableau récapitulatif des 3 niveaux d’analyse',
              headers: ['Niveau', 'Échelle', 'Indicateurs / Exemples exacts du cours'],
              rows: [
                ['Macro-économique', 'Pays / Région', 'DNS / PIB (Algérie 7,23 % en 2018 ; USA 12 %), agrégats nationaux'],
                ['Méso-économique', 'Secteur de la santé', 'Structure budgétaire du secteur : dépenses de personnel ≈ 80 %'],
                ['Micro-économique', 'Établissement / Acte / Patient', 'Gestion d’un CHU, consommation médicaments, coût d’une intervention / GHM']
              ]
            }
          ],
          darija: '<strong>Macro</strong> = على مستوى الدولة كاملة (<strong>DNS/PIB</strong> : الجزائر 7,23 % في 2018). <strong>Méso</strong> = على مستوى قطاع الصحة (80 % أجور العمال). <strong>Micro</strong> = على مستوى مستشفى واحد (CHU) ولا تكلفة عملية ولا دواء.',
          triad: {
            toUnderstand: [
              'La gradation d’échelle : Pays (Macro) → Secteur santé (Méso) → Un établissement ou un acte précis (Micro).'
            ],
            toMemorize: [
              'Macro = DNS/PIB (Algérie 7,23 % en 2018) ; Méso = 80 % dépenses personnel ; Micro = gestion d’un CHU, coût d’un acte/GHM.'
            ],
            toRecognizeInQcm: [
              'Ratio DNS/PIB → Macro-économique (jamais micro !).',
              'Gestion d’un CHU particulier → Micro-économique (ne pas confondre avec méso !).'
            ]
          }
        },
        memorize: [
          { id: 'M_L9.3_1', category: 'Classification', title: 'Macro vs Méso vs Micro-économique', content: '<strong>Macro :</strong> pays/région (<strong>DNS/PIB</strong> : Algérie 7,23 % en 2018). <strong>Méso :</strong> secteur santé (dépenses personnel = <strong>80 %</strong>). <strong>Micro :</strong> gestion d’un CHU, consommation médicaments, coût d’une intervention/GHM.', highlight: true }
        ]
      }
    ]
  }
);
