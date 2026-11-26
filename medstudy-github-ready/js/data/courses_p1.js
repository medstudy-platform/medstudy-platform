/* ==========================================================================
   Cours Partie 1 : C1 (Intro Santé Publique), C2 (MT & Surveillance), C3 (MNT)
   Contenu 100 % fidèle aux supports officiels Batna 2
   ========================================================================== */
window.EpiData.courses.push(
  // =========================================================================
  // COURS 1 — Introduction à la santé publique
  // =========================================================================
  {
    id: 'C1',
    moduleId: 'M1',
    code: 'C1',
    title: 'Introduction à la santé publique',
    shortTitle: 'Intro Santé Publique',
    professor: 'Pr BOUMARAF Khawla (SEMEP CHU Batna)',
    sourceFiles: ['Introduction à la santé publique- Pr Boumaraf.pdf (62 slides)'],
    bmCount: 13,
    bmSharedNote: '+ 3 recoupements directs 2025 avec C3 (MNT)',
    bmRecentCount: 4,
    uniqueConcepts: 6,
    priority: 'very_high',
    priorityScore: 92,
    vigilance2026: false,
    summary: 'Concepts fondateurs de la santé, les 3 approches (conventionnelle, globaliste, prospective), niveaux de prévention (I à IV), déterminants, historique en Algérie (1974), priorités de santé publique, SSP et outils.',
    lessons: [
      {
        id: 'L1.1',
        courseId: 'C1',
        order: 1,
        title: 'Concepts, 3 approches de la santé & déterminants',
        durationMin: 12,
        sourceRef: 'Chapitre 2, slides 5–10',
        bmCount: 5,
        bmRefs: ['Ch. 2 Q1 (2024)', 'Ch. 14 Q2 (2025)', 'Ch. 14 Q3 (2025)', 'Ch. 17 Q9 (2022)', 'Ch. 19 Q11 (2022)'],
        priority: 'very_high',
        priorityScore: 80,
        bmWarning: '⚠️ 2 erreurs majeures dans le corrigé BM : Ch. 2 Q1 (approche prospective = B, PAS C) et Ch. 14 Q2 (approche conventionnelle = C seul, PAS ABC).',
        understand: {
          intro: 'La notion de « santé » a profondément évolué : d’une vision purement biologique (absence de maladie) vers une approche globale (OMS) puis dynamique et adaptative (prospective). Ce chapitre est tombé en 2024 et en 2025.',
          sections: [
            {
              heading: 'Les 3 définitions historiques de référence',
              paragraphs: ['Le cours du Pr Boumaraf retient trois jalons chronologiques pour cerner la santé :'],
              bullets: [
                '<strong>Leriche (1937) :</strong> « La santé est la vie dans le silence des organes » (vision physiologique/clinique).',
                '<strong>OMS (1946) :</strong> « Un état de complet bien-être physique, mental et social, et ne consiste pas seulement en une absence de maladie ou d’infirmité ».',
                '<strong>UNICEF (1989) :</strong> la santé dépend aussi du travail, du revenu, de l’éducation, de la culture, des droits et des libertés.'
              ]
            },
            {
              heading: 'Les déterminants de la santé (objectifs/subjectifs, intrinsèques/extrinsèques)',
              paragraphs: ['Les déterminants sont l’ensemble des facteurs qui influencent l’état de santé d’une population — ils peuvent être <strong>positifs</strong> (protecteurs) ou <strong>négatifs</strong> (facteurs de risque).'],
              bullets: [
                '<strong>Déterminants intrinsèques :</strong> patrimoine génétique, caractéristiques biologiques individuelles.',
                '<strong>Déterminants extrinsèques :</strong> infrastructures sanitaires, environnement microbiologique, culture et comportements, conditions socio-économiques.'
              ]
            }
          ],
          tables: [
            {
              title: 'Comparaison des 3 approches de la santé (Ultra-testé 2024–2025)',
              headers: ['Critère', 'Approche Conventionnelle', 'Approche Globaliste', 'Approche Prospective'],
              rows: [
                ['Idée centrale', 'Santé = absence de maladie (norme vs dysfonctionnement biologique)', 'Maladie = fait biologique ET social', 'Santé = processus dynamique, capacité d’adaptation et de réaction à l’environnement'],
                ['Référence / Clé', 'Pratique médicale quotidienne', 'Définition OMS (1946) : bien-être physique, mental et social', 'Équilibre facteurs endogènes/exogènes + moyens de contrôle disponibles'],
                ['Limite / Piège QCM', 'Définie EN DEHORS de tout critère socio-économique et culturel', 'Idéal philosophique difficile à quantifier', 'Ne se limite PAS uniquement à l’environnement']
              ]
            }
          ],
          darija: 'باش ما تغلطش أبدا في الـ QCM : <strong>Conventionnelle</strong> = غير « ما راكش مريض » بلا أي معيار اجتماعي أو ثقافي. <strong>Globaliste</strong> = تعريف l’OMS (بدني + نفسي + اجتماعي). <strong>Prospective</strong> = القدرة على التكيف + <strong>les moyens de contrôle</strong> تاع العوامل الداخلية والخارجية (endogènes/exogènes). وحذاري من غلطتين في الـ BM (Ch.2 Q1 و Ch.14 Q2) !',
          triad: {
            toUnderstand: [
              'Pourquoi l’approche conventionnelle est jugée réductrice en santé publique.',
              'Comment l’approche prospective introduit la notion dynamique de capacité d’adaptation et de moyens de contrôle.'
            ],
            toMemorize: [
              'Les mots-clés exacts de chaque approche (absence de maladie / OMS 1946 / moyens de contrôle endogènes-exogènes).',
              'Déterminants intrinsèques (patrimoine génétique) vs extrinsèques (infrastructures, microbiologie, culture/comportements).'
            ],
            toRecognizeInQcm: [
              '« en dehors de tout critère socio-économique et culturel » → Conventionnelle.',
              '« dimensions physique, mentale et sociale » → Globaliste (NE PAS cocher pour Prospective !).',
              '« facteurs endogènes et exogènes » ou « capacité d’adaptation / interaction » → Prospective.'
            ]
          }
        },
        memorize: [
          { id: 'M_L1.1_1', category: 'Définition', title: 'Approche conventionnelle', content: 'Santé = <strong>absence de maladie</strong> (dysfonctionnement biologique), définie <strong>en dehors de tout critère socio-économique et culturel</strong>.', highlight: true },
          { id: 'M_L1.1_2', category: 'Définition', title: 'Approche globaliste (OMS 1946)', content: 'Maladie = fait biologique ET social. Santé = <strong>état de complet bien-être physique, mental et social</strong> (ne consiste pas seulement en une absence de maladie).', highlight: true },
          { id: 'M_L1.1_3', category: 'Définition', title: 'Approche prospective', content: 'Processus dynamique : <strong>capacité d’adaptation et d’interaction</strong> avec l’environnement, tenant compte des <strong>moyens de contrôle des facteurs endogènes et exogènes</strong>.', highlight: true },
          { id: 'M_L1.1_4', category: 'Distinction', title: 'Déterminants intrinsèques vs extrinsèques', content: '<strong>Intrinsèques :</strong> patrimoine génétique, biologie. <strong>Extrinsèques :</strong> infrastructures sanitaires, environnement microbiologique, culture et comportements. Ils sont <strong>positifs et/ou négatifs</strong>.', highlight: false },
          { id: 'M_L1.1_5', category: 'Définition', title: 'Leriche (1937) & UNICEF (1989)', content: '<strong>Leriche (1937) :</strong> « La vie dans le silence des organes ». <strong>UNICEF (1989) :</strong> intègre travail, revenu, éducation, culture, droits et libertés.', highlight: false }
        ]
      },
      {
        id: 'L1.2',
        courseId: 'C1',
        order: 2,
        title: 'Les 4 niveaux de prévention, éducation & promotion de la santé',
        durationMin: 12,
        sourceRef: 'Chapitre 7.5.1 & 7.5.2, slides 46–53',
        bmCount: 5,
        bmRefs: ['Ch. 2 Q2 (2024)', 'Ch. 32 Q3–Q4 (2022)', 'Ch. 32 Q11–Q12 (ND)', '+ 5 QCM partagés C3 (MNT)'],
        priority: 'very_high',
        priorityScore: 100,
        understand: {
          intro: 'Les niveaux de prévention constituent l’un des 2 sujets les plus testés de toute la BM (10 occurrences cumulées C1 + C3 de 2021 à 2025). La clé est d’associer sans erreur chaque niveau à son indicateur (incidence vs prévalence) et à ses exemples concrets.',
          sections: [
            {
              heading: 'Prévention vs Prophylaxie',
              paragraphs: ['La prévention regroupe l’ensemble des mesures visant à éviter ou réduire le nombre et la gravité des maladies ou accidents.'],
              bullets: [
                '<strong>Prophylaxie :</strong> prévention spécifiquement dirigée contre une <strong>maladie transmissible</strong>.',
                '<strong>Chimioprophylaxie :</strong> prévention d’une maladie transmissible par administration d’un médicament (ex. méningite à méningocoque, paludisme).'
              ]
            },
            {
              heading: 'Éducation pour la santé vs Promotion de la santé',
              paragraphs: ['Ces deux notions sont complémentaires mais ne sont pas synonymes :'],
              bullets: [
                '<strong>Éducation pour la santé :</strong> outil ciblant les connaissances, attitudes et comportements individuels.',
                '<strong>Promotion de la santé (Charte d’Ottawa) :</strong> approche globale agissant sur les comportements ET sur les environnements favorables, les politiques publiques et l’autonomisation des communautés.'
              ]
            }
          ],
          tables: [
            {
              title: 'Tableau d’or des 4 niveaux de prévention (Score 100/100)',
              headers: ['Niveau', 'Cible', 'Objectif / Indicateur', 'Exemples classiques en QCM'],
              rows: [
                ['Primaire', 'Sujets sains / exposés avant la maladie', 'Diminuer l’INCIDENCE (nouveaux cas)', 'Vaccination, ioduration du sel (goitre/crétinisme), arrêt du tabac, hygiène'],
                ['Secondaire', 'Sujets asymptomatiques / stade précoce', 'Diminuer la PRÉVALENCE (nouveaux + anciens cas) et la durée', 'Dépistage précoce (mammographie cancer du sein, FCV, glycémie, coloscopie)'],
                ['Tertiaire', 'Malades avérés', 'Diminuer complications, rechutes, récidives et incapacités', 'Suivi diabétique, traitement rétinopathie, réadaptation cardiaque'],
                ['Quaternaire', 'Patients exposés au système de soins', 'Protéger contre la surmédicalisation, les soins/actes invasifs inutiles et les IAS', 'Éviter examens ou prescriptions inutiles, pertinence des soins']
              ]
            }
          ],
          darija: 'احفظ هاد المعادلة الذهبية : <strong>Primaire = تنقص Incidence</strong> (حالات جدد : تلقيح، ملح باليود، توقيف الدخان). <strong>Secondaire = Dépistage وتنقص Prévalence</strong> (حالات جدد + قدم). <strong>Tertiaire = المضاعفات والانتكاس (récidives)</strong>. <strong>Quaternaire = حماية من كثرة الفحوصات والدواء الزايد (surmédicalisation)</strong>.',
          triad: {
            toUnderstand: [
              'Pourquoi le dépistage réduit la prévalence (durée d’évolution écourtée) et non l’incidence.',
              'Pourquoi la prévention quaternaire protège à la fois le patient et le soignant de la surmédicalisation.'
            ],
            toMemorize: [
              'Primaire → Incidence ; Secondaire → Prévalence ; Tertiaire → Complications/récidives ; Quaternaire → Surmédicalisation / IAS.',
              'L’ioduration du sel contre le goitre/crétinisme = prévention PRIMAIRE (piège Ch. 2 Q2 B).'
            ],
            toRecognizeInQcm: [
              '« diminuer les nouveaux cas » → Primaire ; « diminuer nouveaux et anciens cas » → Secondaire.',
              '« déceler précocement » / « dépistage » → Secondaire.',
              '« réduire la prescription d’interventions inutiles » → Quaternaire.'
            ]
          }
        },
        memorize: [
          { id: 'M_L1.2_1', category: 'Classification', title: 'Prévention Primaire', content: 'Actes destinés à <strong>diminuer l’incidence</strong> (nouveaux cas). Exemples : vaccination, <strong>ioduration du sel</strong>, lutte antitabac.', highlight: true },
          { id: 'M_L1.2_2', category: 'Classification', title: 'Prévention Secondaire', content: 'Actes visant à <strong>déceler précocement</strong> la maladie et <strong>diminuer sa prévalence</strong> (nouveaux + anciens cas) et sa durée. Axe principal : <strong>le dépistage</strong> (ex. cancer du sein).', highlight: true },
          { id: 'M_L1.2_3', category: 'Classification', title: 'Prévention Tertiaire', content: 'Actes destinés à prévenir les <strong>complications, rechutes, récidives et séquelles</strong> chez un malade avéré.', highlight: true },
          { id: 'M_L1.2_4', category: 'Classification', title: 'Prévention Quaternaire', content: 'Protection du patient et du soignant contre la <strong>surmédicalisation</strong>, les <strong>interventions inutiles/invasives</strong> et les <strong>IAS</strong>.', highlight: true },
          { id: 'M_L1.2_5', category: 'Définition', title: 'Prophylaxie vs Chimioprophylaxie', content: '<strong>Prophylaxie :</strong> prévention contre une maladie transmissible. <strong>Chimioprophylaxie :</strong> prévention par médicament.', highlight: false }
        ]
      },
      {
        id: 'L1.3',
        courseId: 'C1',
        order: 3,
        title: 'Historique (Algérie 1974), priorités de SP, SSP & outils',
        durationMin: 12,
        sourceRef: 'Chapitres 3 à 8, slides 13–60',
        bmCount: 3,
        bmRefs: ['Ch. 29 Q14 (2023)', 'Ch. 41 Q6 (2023)', 'Ch. 38 Q8 (2022)'],
        priority: 'medium',
        priorityScore: 52,
        understand: {
          intro: 'Cette leçon rassemble les repères historiques mondiaux et algériens (dont la date-clé de 1974 tombée 2 fois), les critères d’une priorité de santé publique, la hiérarchie Politique/Plan/Programme/Action et les Soins de Santé Primaires (SSP).',
          sections: [
            {
              heading: 'Historique clé de la santé publique (Monde & Algérie)',
              paragraphs: ['L’histoire de la santé publique relie l’observation environnementale à l’épidémiologie moderne et aux systèmes de santé :'],
              bullets: [
                '<strong>Hippocrate :</strong> « Primum non nocere », traité <em>Des airs, des eaux et des lieux</em>.',
                '<strong>Semmelweis (1847) :</strong> lien entre lavage des mains des médecins et fièvre puerpérale.',
                '<strong>John Snow (1854–1855) :</strong> démonstration du lien choléra ↔ eau contaminée (pompe de Broad Street à Londres), réfutant la théorie des miasmes.',
                '<strong>Transition épidémiologique (Abdel Omran, 1971) :</strong> 3 âges (pestilence/famine EV < 30 ans → recul des infections → maladies dégénératives et chroniques).',
                '<strong>Algérie — Phase de transition :</strong> <strong>Gratuité des soins en janvier 1974</strong>, réforme des études médicales et création du secteur sanitaire.'
              ]
            },
            {
              heading: 'Priorités de santé publique & hiérarchie des interventions',
              paragraphs: ['Face à des ressources limitées, un problème est retenu comme priorité de santé publique sur 4 critères principaux (plus la vulnérabilité/curabilité) :'],
              bullets: [
                '<strong>4 critères du cours :</strong> 1) <strong>Grave</strong> (létalité, séquelles, incapacités), 2) <strong>Fréquente</strong> (prévalence/ampleur élevée), 3) <strong>Impact socio-économique</strong>, 4) <strong>Perception sociale</strong> (+ maladie curable ou évitable par la prévention).',
                '<strong>Hiérarchie :</strong> Politique de SP ⊃ <strong>Plan de SP</strong> (série de programmes coordonnés) ⊃ <strong>Programme de SP</strong> (actions coordonnées dans le temps/espace pour objectifs précis) ⊃ <strong>Action de SP</strong> (composante opérationnelle).',
                '<strong>3 objectifs SP (OMS 1985) :</strong> réduire morbidité/incapacité, réduire mortalité prématurée/évitable, assurer l’égalité dans la santé.'
              ]
            }
          ],
          tables: [
            {
              title: 'Repères institutionnels & outils de la santé publique',
              headers: ['Concept', 'Contenu clé à retenir'],
              rows: [
                ['Algérie — Janvier 1974', 'Instauration de la gratuité des soins (tombé 2× dans la BM : Ch. 29 Q14 & Ch. 41 Q6)'],
                ['Soins de Santé Primaires (SSP)', 'Chronologie : Famille → Communauté → Services de santé (8 composantes essentielles)'],
                ['Outils de la SP', 'Épidémiologie, biostatistique, démographie, économie de la santé, planification/évaluation, éducation sanitaire']
              ]
            }
          ],
          darija: 'التاريخ لي تكرر زوج مرات في الـ BM : <strong>مجانية العلاج في الجزائر (Gratuité des soins) = جانفي 1974</strong> ! وشفا بلي باش مرض يولي <strong>priorité de santé publique</strong> لازم يكون : منتشر (prévalence élevée) + خطير + قابل للعلاج أو الوقاية (curable ou évitable).',
          triad: {
            toUnderstand: [
              'La logique descendante Politique → Plan → Programme → Action.',
              'Pourquoi la vulnérabilité (curable ou évitable) conditionne le classement en priorité sanitaire.'
            ],
            toMemorize: [
              'Gratuité des soins en Algérie : janvier 1974.',
              'Les 4 critères de priorité : Grave, Fréquente, Impact socio-économique, Perception sociale (+ curable/évitable).',
              'John Snow (1854–1855, Broad Street, choléra) ; Semmelweis (1847, lavage des mains) ; Abdel Omran (1971, transition).'
            ],
            toRecognizeInQcm: [
              'Date de la gratuité des soins en Algérie → 1974 (pièges : 1949, 1976).',
              'Critères priorité SP : prévalence élevée + curable/évitable (exclure « pas de traitement » et « coût élevé du traitement »).'
            ]
          }
        },
        memorize: [
          { id: 'M_L1.3_1', category: 'Seuil / Chiffre', title: 'Gratuité des soins en Algérie', content: 'Instaurée en <strong>janvier 1974</strong> (avec réforme des études médicales et création du secteur sanitaire).', highlight: true },
          { id: 'M_L1.3_2', category: 'Liste', title: 'Critères d’une priorité de santé publique', content: '<strong>1) Grave</strong> (létalité, séquelles), <strong>2) Fréquente</strong> (prévalence élevée), <strong>3) Impact socio-économique</strong>, <strong>4) Perception sociale</strong>, et <strong>curable ou évitable</strong> par la prévention.', highlight: true },
          { id: 'M_L1.3_3', category: 'Classification', title: 'Hiérarchie des interventions', content: '<strong>Politique de SP</strong> ⊃ <strong>Plan de SP</strong> ⊃ <strong>Programme de SP</strong> ⊃ <strong>Action de SP</strong>.', highlight: false },
          { id: 'M_L1.3_4', category: 'Liste', title: 'Transition épidémiologique (Abdel Omran, 1971)', content: '3 âges : (1) Pestilence et famine (EV < 30 ans), (2) Recul des maladies infectieuses, (3) Maladies dégénératives et chroniques.', highlight: false }
        ]
      }
    ]
  },

  // =========================================================================
  // COURS 2 — Épidémiologie des maladies transmissibles & surveillance
  // =========================================================================
  {
    id: 'C2',
    moduleId: 'M2',
    code: 'C2',
    title: 'Épidémiologie des maladies transmissibles & surveillance',
    shortTitle: 'MT & Surveillance',
    professor: 'Dr F. BEICHI (Université Batna 2)',
    sourceFiles: ['Epidémiologie des MT .pdf (10 p., avec Annexe Décret MDO 22-250)'],
    bmCount: 30,
    bmSharedNote: 'Cours n°1 en volume dans la BM (Ch. 12 + Ch. 13 + Ch. 38 + Ch. 19 Q10)',
    bmRecentCount: 8,
    uniqueConcepts: 10,
    priority: 'very_high',
    priorityScore: 95,
    vigilance2026: false,
    summary: 'Importance des MT (Monde vs Algérie), chaîne épidémiologique, pouvoir pathogène/virulence/contagiosité (R0), surveillance épidémiologique (processus, types, qualités Ch. 38), MDO Décret 22-250 (44 Cat.1 / 14 Cat.2) et prophylaxie.',
    lessons: [
      {
        id: 'L2.1',
        courseId: 'C2',
        order: 1,
        title: 'Situation des MT (Monde/Algérie), chaîne & agent pathogène',
        durationMin: 14,
        sourceRef: '§ I à II, pages 2–5',
        bmCount: 8,
        bmRefs: ['Ch. 12 Q1, Q3, Q5, Q6, Q10 (2021–2024)', 'Ch. 13 Q1–Q2 (2025)', 'Ch. 19 Q10 (2022)'],
        priority: 'very_high',
        priorityScore: 85,
        bmWarning: '⚠️ Nuance BM Ch. 12 Q1 vs Q6 : les MT sont principales causes de morbi-mortalité dans les PED (dans le monde, MNT = 74 %). En Algérie : ÉRADICATION de la poliomyélite et du paludisme autochtone, mais simple DIMINUTION de la tuberculose !',
        understand: {
          intro: 'Les maladies transmissibles restent un enjeu majeur de santé publique (notamment dans les PED et par les maladies émergentes/réémergentes). En 2024 et 2025, 5 QCM ont directement testé les résultats en Algérie et les propriétés de l’agent pathogène.',
          sections: [
            {
              heading: 'Transmissible vs Contagieuse & Résultats obtenus en Algérie',
              paragraphs: ['<strong>Règle fondamentale (p. 2) :</strong> « Toutes les maladies contagieuses sont transmissibles, mais l’inverse n’est pas vrai » (ex. tétanos, paludisme, toxoplasmose, TIAC sont transmissibles mais NON contagieuses d’homme à homme).'],
              bullets: [
                '<strong>Poliomyélite en Algérie :</strong> <strong>éradication</strong> obtenue (attention : le QCM 2024 Ch. 12 Q3 retient « éradication », pas seulement « élimination »).',
                '<strong>Paludisme autochtone :</strong> maîtrise puis <strong>éradication/élimination</strong> (certifié par l’OMS).',
                '<strong>Tuberculose pulmonaire :</strong> <strong>diminution</strong> de l’incidence (NON éliminée !).',
                '<strong>MTH & endémo-épidémiques :</strong> manifestations sporadiques ou épidémiques (TIAC, typhoïde, leishmanioses, brucellose, méningites).'
              ]
            },
            {
              heading: 'Les 4 maillons de la chaîne épidémiologique',
              paragraphs: ['Toute transmission infectieuse suppose la succession de 4 maillons indissociables :'],
              bullets: [
                '<strong>1) Agent pathogène :</strong> caractérisé par pouvoir pathogène, virulence, contagiosité (R₀) et immunogénicité.',
                '<strong>2) Réservoir :</strong> humain (malade ou porteur sain), animal (zoonoses) ou inanimé (tellurique, inerte, hydrique).',
                '<strong>3) Mode de transmission :</strong> horizontale (directe ou indirecte via véhicule/vecteur) ou verticale (transplacentaire, génitale).',
                '<strong>4) Hôte réceptif :</strong> état immunitaire, âge, nutrition, facteurs génétiques et environnementaux.'
              ]
            }
          ],
          tables: [
            {
              title: 'Distinction capitale : Pouvoir pathogène vs Virulence vs Contagiosité',
              headers: ['Propriété', 'Définition exacte du cours', 'Mesure / Piège QCM'],
              rows: [
                ['Pouvoir pathogène', 'Capacité (aptitude) de provoquer des manifestations morbides chez l’hôte réceptif', 'Taux d’attaque, sévérité, létalité (PAS « exclusivement » la létalité !)'],
                ['Virulence', 'Expression et intensité du pouvoir pathogène ; aptitude à se multiplier / reproduire la maladie', 'Dépend du germe (toxines, multiplication) et de l’hôte (BM Ch. 12 Q10 = B)'],
                ['Contagiosité', 'Aptitude à se propager dans une collectivité donnée', 'Mesurée par R₀ : rougeole (très élevé) > SARS-CoV-2 ; nulle dans brucellose/tétanos']
              ]
            }
          ],
          darija: 'شفا على هاد 3 فروق في الكور تاع Dr Beichi : <strong>Pouvoir pathogène</strong> = القدرة يديرلك مرض. <strong>Virulence</strong> = شدة المرض والقدرة على التكاثر (reproduire la maladie). <strong>Contagiosité</strong> = سرعة الانتشار في المجتمع (<strong>R₀</strong> : بوحمرون <em>rougeole</em> أكثر انتشارا من <em>SARS-CoV-2</em> !). وفي الجزائر : <strong>Polio = Éradication</strong>، <strong>Paludisme autochtone = Éradiqué</strong>، أما <strong>Tuberculose = نقصت برك (ماشي éliminée)</strong>.',
          triad: {
            toUnderstand: [
              'Pourquoi une maladie transmissible (ex. tétanos, paludisme) n’est pas forcément contagieuse.',
              'La différence entre capacité à causer un trouble (pouvoir pathogène), intensité/multiplication (virulence) et diffusion communautaire (contagiosité).'
            ],
            toMemorize: [
              'Acquis Algérie : éradication poliomyélite, éradication paludisme autochtone, diminution tuberculose.',
              'Définition de R₀ et fait que R₀(rougeole) > R₀(SARS-CoV-2).'
            ],
            toRecognizeInQcm: [
              '« capacité de provoquer des manifestations morbides » → Pouvoir pathogène (Ch. 12 Q5 B).',
              '« aptitude à reproduire la maladie » → Virulence (Ch. 12 Q10 B).',
              '« élimination de la tuberculose pulmonaire en Algérie » → TOUJOURS FAUX !'
            ]
          }
        },
        memorize: [
          { id: 'M_L2.1_1', category: 'Distinction', title: 'Transmissible vs Contagieuse', content: 'Toutes les maladies contagieuses sont transmissibles, mais <strong>l’inverse est faux</strong> (ex. paludisme, tétanos, TIAC = transmissibles non contagieuses).', highlight: true },
          { id: 'M_L2.1_2', category: 'Liste', title: 'Résultats sanitaires en Algérie', content: '<strong>Éradication</strong> de la poliomyélite ; <strong>éradication/disparition</strong> du paludisme autochtone ; <strong>diminution</strong> (non élimination) de la tuberculose pulmonaire.', highlight: true },
          { id: 'M_L2.1_3', category: 'Définition', title: 'Pouvoir pathogène vs Virulence vs Contagiosité', content: '<strong>Pouvoir pathogène :</strong> capacité à provoquer des manifestations morbides. <strong>Virulence :</strong> intensité / aptitude à reproduire la maladie. <strong>Contagiosité :</strong> aptitude à se propager dans une collectivité (<strong>R₀</strong>).', highlight: true },
          { id: 'M_L2.1_4', category: 'Formule', title: 'Taux de reproduction de base (R₀)', content: 'Nombre moyen de sujets infectés par un cas contagieux dans une population <strong>entièrement susceptible</strong>. <strong>R₀(rougeole) > R₀(SARS-CoV-2)</strong>.', highlight: true }
        ]
      },
      {
        id: 'L2.2',
        courseId: 'C2',
        order: 2,
        title: 'Surveillance épidémiologique : processus, types & attributs qualité',
        durationMin: 15,
        sourceRef: '§ V, pages 6–8 + Complément BM Ch. 38 (7 QCM)',
        bmCount: 16,
        bmRefs: ['Ch. 12 Q4, Q9 (2021, 2024)', 'Ch. 38 Q1–Q7, Q9–Q15 (2019–2022, ND)'],
        priority: 'very_high',
        priorityScore: 90,
        bmWarning: '⚠️ Complément indispensable : 7 QCM de Ch. 38 testent les attributs de qualité d’un système de surveillance (Représentativité, Souplesse, Se, Sp, Simplicité, Acceptabilité) non détaillés dans le polycopié de 10 p. De plus, Ch. 12 Q9 / Ch. 38 Q1 / Q11 ont des clés divergentes sur la surveillance MDO (retenir : passive + obligatoire + professionnels).',
        understand: {
          intro: 'Avec 16 QCM dans la BM (Ch. 12 + Ch. 38), la surveillance épidémiologique est le cœur absolu du Cours 2. Elle repose sur un processus CONTINU en 4 étapes dont la finalité ultime est l’ACTION.',
          sections: [
            {
              heading: 'Définition, 4 étapes, finalité & circuit algérien',
              paragraphs: ['La surveillance épidémiologique est un <strong>processus continu et systématique</strong> (JAMAIS ponctuel — contrairement à une enquête !).'],
              bullets: [
                '<strong>4 étapes :</strong> 1) Collecte des données → 2) Compilation / regroupement / tabulation → 3) Analyse et interprétation → 4) Diffusion (rétro-information).',
                '<strong>Finalité ultime :</strong> produire de l’information <strong>pour mettre en place des actions de contrôle</strong> / aide à la décision (Ch. 38 Q12 C).',
                '<strong>Condition de fonctionnement :</strong> la <strong>rapidité du traitement de l’information et sa diffusion</strong> (Ch. 38 Q14 D).',
                '<strong>Circuit en Algérie :</strong> <strong>SEMEP</strong> (niveau local) → <strong>DSP</strong> (wilaya) → <strong>INSP + DGPPS / MS</strong> (national).'
              ]
            },
            {
              heading: 'Les 3 modes de surveillance (Passive, Active, Sentinelle)',
              paragraphs: ['Le mode de collecte distingue la manière dont l’information remonte vers l’autorité sanitaire :'],
              bullets: [
                '<strong>Surveillance passive :</strong> le système attend la remontée routinière des données recueillies au cours de l’activité médicale, sans sollicitation active (ex. <strong>MDO</strong>, <strong>TIAC</strong>).',
                '<strong>Surveillance active :</strong> les autorités sanitaires recherchent activement et périodiquement les cas auprès des services (ex. <strong>PFA</strong> pour la poliomyélite).',
                '<strong>Surveillance sentinelle :</strong> échantillon de praticiens/services/labos <strong>volontaires</strong> (non exhaustif) déclarant régulièrement (ex. réseau <strong>GROG</strong> pour la grippe dans 6 wilayas ; note : considérée comme active dans Ch. 12 Q4 A).'
              ]
            }
          ],
          tables: [
            {
              title: 'Les 6 attributs de qualité d’un système de surveillance (7 QCM BM Ch. 38 !)',
              headers: ['Attribut', 'Signification exacte à connaître pour les QCM', 'Formule / Indicateur'],
              rows: [
                ['Sensibilité (Se)', 'Capacité à identifier correctement la maladie / les vrais positifs', 'VP / (VP + FN)'],
                ['Spécificité (Sp)', 'Capacité à identifier l’absence de maladie / les vrais négatifs', 'VN / (VN + FP)'],
                ['Représentativité', 'La maladie est bien décrite selon les caractères temps, lieu et personne (portrait fidèle)', 'Distribution T / L / P'],
                ['Souplesse', 'Capacité à s’adapter aux changements de définition de cas ou à de nouvelles sources d’information', 'Adaptabilité'],
                ['Simplicité', 'Structure légère, procédures de recueil rapides, définition de cas facile à utiliser', 'Légèreté & rapidité'],
                ['Acceptabilité', 'Volonté de participation des acteurs : taux de participation + qualité des rapports transmis', 'Taux de participation']
              ]
            }
          ],
          darija: 'الـ <strong>Surveillance</strong> عملية <strong>مستمرة (continue)</strong> ماشي ponctuelle ! الهدف تاعها هو <strong>l’action</strong> (اتخاذ القرار). <strong>Passive</strong> = الدولة تستنى الطبيب يصرح (MDO، TIAC). <strong>Active</strong> = الدولة تروح تحوس على الحالات (PFA). <strong>Sentinelle</strong> = عينة أطباء متطوعين (GROG في 6 ولايات). واحفظ جدول الصفات الستة (Ch. 38) راهو طاح 7 مرات !',
          triad: {
            toUnderstand: [
              'Pourquoi la diffusion rapide (rétro-information) conditionne l’efficacité de la surveillance.',
              'La différence entre une surveillance exhaustive/obligatoire (MDO) et un réseau sentinelle volontaire (GROG).'
            ],
            toMemorize: [
              'Les 4 étapes : collecte → compilation → analyse → diffusion.',
              'Les formules exactes de Sensibilité = VP/(VP+FN) et Spécificité = VN/(VN+FP).',
              'Les mots-clés exacts des 6 attributs (Représentativité = T/L/P ; Souplesse = adaptation définition/sources ; Acceptabilité = participation).'
            ],
            toRecognizeInQcm: [
              '« processus ponctuel » → TOUJOURS FAUX pour la surveillance !',
              '« s’adapter à des changements de définition de cas ou nouvelles sources » → Souplesse (Ch. 38 Q3 BC).',
              '« léger de par sa structure, recueil rapide » → Simplicité (Ch. 38 Q15 A).'
            ]
          }
        },
        memorize: [
          { id: 'M_L2.2_1', category: 'Définition', title: 'Surveillance épidémiologique (4 étapes & finalité)', content: 'Processus <strong>continu</strong> (collecte, compilation, analyse, diffusion) dont la finalité est l’<strong>action de contrôle</strong>, conditionné par la <strong>rapidité du traitement et de la diffusion</strong>.', highlight: true },
          { id: 'M_L2.2_2', category: 'Distinction', title: 'Passive vs Active vs Sentinelle', content: '<strong>Passive :</strong> attend la remontée (MDO, TIAC). <strong>Active :</strong> recherche périodique (PFA). <strong>Sentinelle :</strong> échantillon volontaire (GROG grippe, 6 wilayas ; classée active en Ch. 12 Q4).', highlight: true },
          { id: 'M_L2.2_3', category: 'Formule', title: 'Sensibilité & Spécificité (Ch. 38)', content: '<strong>Sensibilité</strong> = <span class="math-frac"><span>VP</span><span>VP + FN</span></span> (vrais positifs). <strong>Spécificité</strong> = <span class="math-frac"><span>VN</span><span>VN + FP</span></span> (vrais négatifs / absence de maladie).', highlight: true },
          { id: 'M_L2.2_4', category: 'Liste', title: 'Représentativité, Souplesse, Simplicité, Acceptabilité', content: '<strong>Représentativité :</strong> temps/lieu/personne. <strong>Souplesse :</strong> adaptation changement définition/sources. <strong>Simplicité :</strong> structure légère/recueil rapide. <strong>Acceptabilité :</strong> taux de participation + qualité rapports.', highlight: true }
        ]
      },
      {
        id: 'L2.3',
        courseId: 'C2',
        order: 3,
        title: 'MDO algériennes (Décret 22-250) & prophylaxie en 3 axes',
        durationMin: 13,
        sourceRef: '§ III, IV, VI & Annexe Décret 22-250, pages 5–10',
        bmCount: 6,
        bmRefs: ['Ch. 12 Q2 (2024)', 'Ch. 12 Q7–Q8 (2022)', 'Ch. 12 Q11–Q12 (2021)', 'Ch. 12 Q13 (ND)'],
        priority: 'very_high',
        priorityScore: 85,
        understand: {
          intro: 'Le Décret exécutif n° 22-250 du 30 juin 2022 actualise la liste officielle algérienne des Maladies à Déclaration Obligatoire (MDO) en deux catégories bien distinctes — source directe de 5 QCM BM très répétitifs.',
          sections: [
            {
              heading: 'Décret exécutif n° 22-250 du 30 juin 2022 : Catégorie 1 vs Catégorie 2',
              paragraphs: ['La déclaration est <strong>obligatoire</strong> pour tous les <strong>médecins</strong> (publics et libéraux) et <strong>biologistes</strong> (publics et privés).'],
              bullets: [
                '<strong>Catégorie 1 (44 maladies — surveillance nationale) :</strong> Rubéole, Peste, Méningite à méningocoque, TIAC, Botulisme, Rage, Tuberculose, VIH/SIDA, Hépatites A/B/C, PFA, Paludisme, Tétanos, Brucellose, Leishmanioses, ISO, PAVM, BMR…',
                '<strong>Catégorie 2 (14 maladies — surveillance internationale / notifiables OMS) :</strong> <strong>SRAS (SARS)</strong>, <strong>Ebola</strong>, Choléra, Fièvre jaune, Variole, Poliomyélite (virus sauvage), SARS-CoV-2, MERS, <strong>Grippe humaine causée par un nouveau sous-type</strong>, Dengue, Chikungunya, Fièvre de la Vallée du Rift, West Nile, Autres fièvres hémorragiques.',
                '<strong>Pièges hors-liste MDO (tombés en QCM) :</strong> Grippe saisonnière banale (NON !), Ankylostomiase (NON !), Maladie de Lyme (NON !).'
              ]
            },
            {
              heading: 'Prophylaxie des MT : rupture de la chaîne en 3 axes',
              paragraphs: ['Toute lutte contre une MT vise à rompre au moins un maillon de la chaîne épidémiologique :'],
              bullets: [
                '<strong>1) Action sur le réservoir :</strong> isolement, traitement curatif, dépistage/surveillance des suspects et contacts, déclaration obligatoire, lutte contre réservoir animal.',
                '<strong>2) Action sur la transmission :</strong> IEC (éducation sanitaire), hygiène du milieu (MTH : eau potable, assainissement), désinfection, désinsectisation/dératisation.',
                '<strong>3) Protection du sujet réceptif :</strong> immunisation active (vaccination), immunisation passive / <strong>séroprophylaxie</strong> (SAS, SAT), <strong>chimioprophylaxie</strong> (paludisme, méningite à méningocoque).'
              ]
            }
          ],
          tables: [
            {
              title: 'MDO Algérie : Tableau anti-piège QCM (Décret 22-250)',
              headers: ['Maladie testée dans la BM', 'Statut MDO en Algérie', 'Catégorie / Notification OMS'],
              rows: [
                ['SRAS (SARS) & Ebola', 'OUI — MDO', 'Catégorie 2 — Obligatoirement notifiable à l’OMS (Ch. 12 Q7, Q11, Q13)'],
                ['Rubéole, Peste, Méningite à méningocoque', 'OUI — MDO', 'Catégorie 1 — Surveillance nationale (Ch. 12 Q8, Q12)'],
                ['Grippe saisonnière / Ankylostomiase / Lyme', 'NON (piège !)', 'Seule la grippe par NOUVEAU sous-type est MDO Cat. 2 !']
              ]
            }
          ],
          darija: 'احفظ الأرقام تاع المرسوم <strong>Décret 22-250 (30 juin 2022)</strong> : <strong>44 أمراض في Catégorie 1</strong> (وطني) و <strong>14 في Catégorie 2</strong> (دولي للـ OMS، كيما <strong>SRAS و Ebola</strong>). رد بالك من فخ الـ BM : « Grippe » وحدها ماشي MDO، و« 42 MDO de l’arrêté de 1990/2013 » فخ قديم ما تكوشيهش !',
          triad: {
            toUnderstand: [
              'Pourquoi la Catégorie 2 correspond aux urgences de portée internationale (RSI / OMS).',
              'Comment chaque mesure prophylactique cible un maillon précis (réservoir, transmission ou sujet réceptif).'
            ],
            toMemorize: [
              'Décret 22-250 du 30 juin 2022 : 44 Cat. 1 + 14 Cat. 2 ; déclarants = médecins + biologistes.',
              'Les 14 maladies de Catégorie 2 (SRAS, Ebola, Choléra, Fièvre jaune, Variole, Polio, COVID-19, MERS, Grippe nouveau sous-type…).',
              'Modélisation (Ch. 12 Q2) = étude prévisionnelle et tendancielle des MT.'
            ],
            toRecognizeInQcm: [
              'SRAS ou Ebola → cocher « Catégorie 2 » + « Obligatoirement notifiable à l’OMS » (AD).',
              'Rejeter « arrêté de novembre 1990 » ou « décembre 2013 » pour SRAS et Ebola.',
              'Dans une liste MDO : cocher Rubéole, Peste, Méningite à méningocoque ; exclure Grippe (simple), Lyme, Ankylostomiase.'
            ]
          }
        },
        memorize: [
          { id: 'M_L2.3_1', category: 'Seuil / Chiffre', title: 'Décret 22-250 du 30 juin 2022 (MDO)', content: '<strong>44 maladies Catégorie 1</strong> (surveillance nationale) + <strong>14 maladies Catégorie 2</strong> (surveillance internationale, notifiables à l’OMS). Déclarants : <strong>médecins et biologistes</strong>.', highlight: true },
          { id: 'M_L2.3_2', category: 'Liste', title: 'Les 14 MDO de Catégorie 2 (OMS)', content: 'Choléra, Fièvre jaune, <strong>Ebola</strong>, Variole, Poliomyélite, <strong>SRAS</strong>, SARS-CoV-2, MERS, <strong>Grippe par nouveau sous-type</strong>, Dengue, Chikungunya, Vallée du Rift, West Nile, Autres fièvres hémorragiques.', highlight: true },
          { id: 'M_L2.3_3', category: 'Piège QCM', title: 'Pièges classiques MDO dans la BM', content: '<strong>OUI (Cat. 1) :</strong> Rubéole, Peste, Méningite à méningocoque, TIAC. <strong>NON :</strong> Grippe saisonnière, Ankylostomiase, Maladie de Lyme.', highlight: true },
          { id: 'M_L2.3_4', category: 'Classification', title: 'Prophylaxie en 3 axes', content: '1) <strong>Réservoir</strong> (isolement, traitement, MDO) ; 2) <strong>Transmission</strong> (IEC, hygiène, vecteurs) ; 3) <strong>Réceptivité</strong> (vaccination, séroprophylaxie SAS/SAT, chimioprophylaxie).', highlight: false },
          { id: 'M_L2.3_5', category: 'Définition', title: 'Modélisation en surveillance (Ch. 12 Q2)', content: '<strong>Étude prévisionnelle et tendancielle</strong> de l’évolution des maladies transmissibles.', highlight: false }
        ]
      }
    ]
  },

  // =========================================================================
  // COURS 3 — Épidémiologie des maladies non transmissibles (MNT)
  // =========================================================================
  {
    id: 'C3',
    moduleId: 'M1',
    code: 'C3',
    title: 'Épidémiologie des maladies non transmissibles (MNT)',
    shortTitle: 'Épidémiologie des MNT',
    professor: 'Faculté de médecine Batna 2 (2025/2026)',
    sourceFiles: ['EPIDEMIOLOGIE-DES-MALADIES-NON-TRANSMISSIBLES (1).pptx (30 slides)'],
    bmCount: 7,
    bmSharedNote: '+ 5 recoupements directs avec C1 (Prévention)',
    bmRecentCount: 3,
    uniqueConcepts: 4,
    priority: 'high',
    priorityScore: 76,
    vigilance2026: false,
    summary: 'Fardeau mondial (74 %) et algérien (80 %) des MNT, classification des facteurs de risque, transition épidémiologique, histoire naturelle, les 4 niveaux de prévention, surveillance STEPS OMS, DALYs et « Best Buys ».',
    lessons: [
      {
        id: 'L3.1',
        courseId: 'C3',
        order: 1,
        title: 'Fardeau MNT (Monde/Algérie), facteurs de risque & transition',
        durationMin: 11,
        sourceRef: 'Slides 4–14',
        bmCount: 2,
        bmRefs: ['Ch. 11 Q1 (2022)', 'Ch. 19 Q2 (2025)'],
        priority: 'high',
        priorityScore: 62,
        understand: {
          intro: 'Les MNT sont des maladies chroniques, non infectieuses, de longue durée et de progression lente. Elles dominent aujourd’hui la mortalité mondiale et algérienne suite à la transition épidémiologique.',
          sections: [
            {
              heading: 'Les 4 catégories majeures (+ troubles mentaux) & chiffres clés',
              paragraphs: ['Les 4 grands groupes sont les <strong>MCV</strong> (coronaropathies, AVC, HTA), les <strong>Cancers</strong>, les <strong>Maladies Respiratoires Chroniques</strong> (BPCO, asthme) et le <strong>Diabète</strong> (surtout type 2).'],
              bullets: [
                '<strong>Dans le monde :</strong> <strong>74 % des décès</strong> (41 millions/an), dont <strong>86 % dans les PRFI</strong> ; coût estimé à 7 000 milliards USD (2020–2035).',
                '<strong>En Algérie (transition dès les années 1980) :</strong> espérance de vie <strong>77 ans</strong> (2013), MNT = <strong>80 % des décès</strong> (<strong>MCV 35 %</strong>, <strong>Cancers 15 %</strong>, <strong>Diabète > 14 %</strong>, <strong>Obésité femmes > 27 %</strong>).'
              ]
            },
            {
              heading: 'Facteur de risque vs Marqueur de risque & les 4 familles de FDR',
              paragraphs: ['En QCM (`Ch. 11 Q1`), un <strong>facteur de risque</strong> est défini comme <strong>une variable qui augmente la probabilité de survenue de la maladie</strong> (ce n’est JAMAIS une constante et il se distingue d’un simple marqueur non modifiable).'],
              bullets: [
                '<strong>Comportementaux :</strong> tabagisme (<strong>8,7 M décès/an</strong>), alcool (<strong>2,3 M</strong>), alimentation malsaine (sel, sucre, graisses), sédentarité.',
                '<strong>Biologiques :</strong> HTA (1er FDR cardiovasculaire), hyperglycémie, dyslipidémie, surpoids/obésité.',
                '<strong>Sociaux & environnementaux :</strong> pauvreté, faible éducation, urbanisation rapide, pollution air/eau.',
                '<strong>Non modifiables (marqueurs) :</strong> âge, sexe, hérédité.'
              ]
            }
          ],
          tables: [
            {
              title: 'Chiffres clés MNT : Monde vs Algérie',
              headers: ['Indicateur', 'Monde', 'Algérie'],
              rows: [
                ['Part des MNT dans les décès', '74 % (41 millions/an)', '~80 % des décès'],
                ['Principales causes / prévalences', '86 % des décès prématurés dans PRFI', 'MCV 35 % ; Cancers 15 % ; Diabète > 14 % ; Obésité femmes > 27 %'],
                ['Transition épidémiologique', 'Recul infectieux → hausse espérance de vie', 'Amorcée années 1980 ; EV = 77 ans (2013)']
              ]
            }
          ],
          darija: 'في الـ MNT، الـ <strong>Facteur de risque</strong> هو <strong>متغير (variable) يزيد احتمال ظهور المرض</strong> (عمره ما يكون constante !). والـ <strong>Transition épidémiologique</strong> (طاحت في 2025) علامتها الأساسية هي <strong>زيادة أمل الحياة (augmentation de l’espérance de vie)</strong> وتراجع الأمراض المعدية مقابل ارتفاع الأمراض المزمنة (80 % من الوفيات في الجزائر).',
          triad: {
            toUnderstand: [
              'Pourquoi la hausse de l’espérance de vie est la marque centrale de la transition épidémiologique.',
              'La distinction entre facteur de risque modifiable (causal) et marqueur non modifiable (âge, sexe, hérédité).'
            ],
            toMemorize: [
              'Définition FDR : variable qui augmente la probabilité de survenue de la maladie.',
              'Chiffres Algérie : MNT 80 %, MCV 35 %, Cancers 15 %, Diabète > 14 %, Obésité femmes > 27 %, EV 77 ans.',
              'Monde : 74 % décès (41 M/an), tabac 8,7 M/an, alcool 2,3 M/an.'
            ],
            toRecognizeInQcm: [
              'Facteur de risque → cocher « variable qui augmente la probabilité… », rejeter « constante » et « marqueur de risque ».',
              'Transition épidémiologique → cocher « augmentation de l’espérance de vie ».'
            ]
          }
        },
        memorize: [
          { id: 'M_L3.1_1', category: 'Définition', title: 'Facteur de risque dans les MNT', content: '<strong>Variable</strong> (jamais une constante !) qui <strong>augmente la probabilité de survenue de la maladie</strong> (≠ marqueur de risque).', highlight: true },
          { id: 'M_L3.1_2', category: 'Seuil / Chiffre', title: 'Fardeau MNT — Monde vs Algérie', content: '<strong>Monde :</strong> 74 % des décès (41 M/an, 86 % PRFI). <strong>Algérie :</strong> ~<strong>80 %</strong> des décès (MCV 35 %, Cancers 15 %, Diabète > 14 %, Obésité femmes > 27 %, EV 77 ans).', highlight: true },
          { id: 'M_L3.1_3', category: 'Classification', title: 'Les 4 familles de FDR des MNT', content: '1) <strong>Comportementaux</strong> (tabac 8,7 M, alcool 2,3 M, diète, sédentarité), 2) <strong>Biologiques</strong> (HTA, diabète, lipides, obésité), 3) <strong>Socio-environnementaux</strong>, 4) <strong>Non modifiables</strong> (âge, sexe, hérédité).', highlight: false },
          { id: 'M_L3.1_4', category: 'Définition', title: 'Transition épidémiologique', content: 'Recul des maladies infectieuses, <strong>augmentation de l’espérance de vie</strong> et prédominance des MNT (amorcée en Algérie dans les années 1980).', highlight: true }
        ]
      },
      {
        id: 'L3.2',
        courseId: 'C3',
        order: 2,
        title: 'Histoire naturelle & les 4 niveaux de prévention des MNT',
        durationMin: 10,
        sourceRef: 'Slides 17–22',
        bmCount: 5,
        bmRefs: ['Ch. 11 Q2–Q4 (2021–2022, ND)', 'Ch. 29 Q1–Q2 (2025)'],
        priority: 'very_high',
        priorityScore: 100,
        understand: {
          intro: '3 des 4 questions du chapitre BM 11 et 2 questions de 2025 portent sur la prévention des MNT — en particulier la prévention secondaire (dépistage / baisse de prévalence) et la prévention quaternaire (surmédicalisation).',
          sections: [
            {
              heading: 'Chronologie / Histoire naturelle des MNT (4 stades)',
              paragraphs: ['Avant l’apparition des symptômes, une MNT évolue silencieusement pendant des années — c’est cette fenêtre qui rend le dépistage efficace :'],
              bullets: [
                '<strong>1) Exposition prolongée aux FDR</strong> (incubation / phase de susceptibilité) → cible de la <strong>prévention primaire</strong>.',
                '<strong>2) Stade préclinique</strong> (anomalies biologiques sans symptômes) → cible de la <strong>prévention secondaire (dépistage)</strong>.',
                '<strong>3) Stade clinique</strong> (symptômes, diagnostic) → prise en charge et <strong>prévention tertiaire</strong>.',
                '<strong>4) Complications à long terme / phase terminale</strong> (multimorbidité, incapacités).'
              ]
            }
          ],
          tables: [
            {
              title: 'Application exacte des 4 niveaux de prévention aux MNT',
              headers: ['Niveau', 'Effet épidémiologique', 'Exemples spécifiques MNT (tombés en QCM)'],
              rows: [
                ['Primaire', 'Diminue l’INCIDENCE (nouveaux cas)', 'Arrêter le tabac pour prévenir le cancer pulmonaire (Ch. 29 Q2 B), nutrition, activité physique'],
                ['Secondaire', 'Diminue la PRÉVALENCE (« nouveaux et anciens cas » — Ch. 11 Q2 D)', 'Dépistage : mammographie, FCV, coloscopie, glycémie, scanner chez ancien fumeur'],
                ['Tertiaire', 'Prévient complications et invalidité', 'Traiter une rétinopathie diabétique, réadaptation post-IDM'],
                ['Quaternaire', 'Réduit les interventions inutiles / surmédicalisation (Ch. 29 Q1 B)', 'Éviter bilans ou prescriptions sans bénéfice clinique prouvé']
              ]
            }
          ],
          darija: 'ركز مليح على هاد الفخ في `Ch. 11 Q2` : كي يقولك « diminuer les nouveaux et anciens cas » راهي معناها <strong>Prévalence = Prévention secondaire</strong> ! وكي يقولك « scanner thoracique chez un ancien fumeur » راهي <strong>Secondaire (dépistage)</strong> ماشي Primaire (الـ Primaire هي توقيف الدخان قبل المرض).',
          triad: {
            toUnderstand: [
              'Le lien entre les 4 stades de l’histoire naturelle d’une MNT et les 4 niveaux de prévention.',
              'Pourquoi le dépistage (secondaire) cible le stade préclinique asymptomatique.'
            ],
            toMemorize: [
              'Prévention secondaire = diminuer la prévalence (« nouveaux et anciens cas ») + déceler précocement par dépistage.',
              'Prévention quaternaire = réduire la prescription d’interventions inutiles (surmédicalisation).'
            ],
            toRecognizeInQcm: [
              'Arrêt du tabac → Primaire ; Mammographie / scanner fumeur → Secondaire ; Rétinopathie diabétique → Tertiaire.',
              '« nouveaux et anciens cas » = synonyme exact de « prévalence » → Secondaire.'
            ]
          }
        },
        memorize: [
          { id: 'M_L3.2_1', category: 'Liste', title: 'Chronologie des MNT (4 stades)', content: 'Exposition aux FDR → <strong>Stade préclinique</strong> (asymptomatique) → <strong>Stade clinique</strong> → <strong>Complications / phase terminale</strong>.', highlight: false },
          { id: 'M_L3.2_2', category: 'Piège QCM', title: 'Prévention secondaire des MNT (3× en BM)', content: 'Déceler précocement (axe principal : <strong>dépistage</strong>) pour <strong>diminuer la prévalence</strong> (= diminuer les <strong>nouveaux et anciens cas</strong>).', highlight: true },
          { id: 'M_L3.2_3', category: 'Définition', title: 'Prévention quaternaire (2025)', content: 'Objectif principal : <strong>réduire la prescription d’interventions inutiles</strong> et protéger contre la <strong>surmédicalisation</strong>.', highlight: true }
        ]
      },
      {
        id: 'L3.3',
        courseId: 'C3',
        order: 3,
        title: 'Surveillance MNT, enquête STEPS OMS, DALYs & « Best Buys »',
        durationMin: 9,
        sourceRef: 'Slides 23–29',
        bmCount: 0,
        bmRefs: [],
        priority: 'low',
        priorityScore: 25,
        understand: {
          intro: 'Bien que cette section n’ait pas encore donné lieu à un QCM dans la BM 2012–2025, elle contient 4 notions phares du cours 2025/2026 (STEPS, DALYs, taux standardisé, Best Buys) particulièrement faciles à évaluer en examen.',
          sections: [
            {
              heading: 'Outils de surveillance & indicateurs de charge morbide',
              paragraphs: ['Contrairement aux MT aiguës (MDO), la surveillance des MNT repose sur des dispositifs au long cours :'],
              bullets: [
                '<strong>Registres de morbidité :</strong> registres du cancer, du diabète, des AVC.',
                '<strong>Enquête STEPS de l’OMS :</strong> approche standardisée de surveillance des FDR en <strong>3 étapes</strong> : Step 1 (questionnaire comportemental), Step 2 (mesures physiques : poids, taille, TA), Step 3 (mesures biochimiques : glycémie, lipides).',
                '<strong>Stratégie OMS « Best Buys » :</strong> interventions au meilleur rapport coût-efficacité (taxation du tabac et boissons sucrées, réduction du sel, étiquetage nutritionnel, promotion activité physique).'
              ]
            }
          ],
          tables: [
            {
              title: 'Indicateurs de comparaison & de charge des MNT',
              headers: ['Indicateur', 'Définition & Utilité'],
              rows: [
                ['Taux brut de mortalité', 'Nombre de décès / population totale sans ajustement d’âge (biaisé par la structure d’âge)'],
                ['Taux standardisé sur l’âge', 'Ajusté sur une population de référence → permet des comparaisons équitables entre pays'],
                ['DALYs (AVAI)', 'Années de vie ajustées sur l’incapacité = YLL (années perdues par décès prématuré) + YLD (années vécues avec incapacité)']
              ]
            }
          ],
          darija: 'الـ <strong>DALYs</strong> تجمع زوج حوايج : السنين لي ضاعو بالموت المبكر (YLL) + السنين لي عاشهم المريض بالإعاقة (YLD). و<strong>STEPS</strong> تاع l’OMS فيها 3 مراحل : استبيان → قياسات جسدية (طول/وزن/ضغط) → تحاليل دم (سكر/دهون).',
          triad: {
            toUnderstand: [
              'Pourquoi on utilise des taux standardisés (et non bruts) pour comparer la mortalité MNT entre pays jeunes et pays âgés.',
              'Comment les DALYs capturent à la fois mortalité prématurée et incapacité chronique.'
            ],
            toMemorize: [
              'DALYs = YLL (mortalité prématurée) + YLD (incapacité).',
              'STEPS OMS = 3 étapes (questionnaire, mesures physiques, biochimie).',
              'Best Buys = mesures très coût-efficaces (taxation tabac, réduction sel, étiquetage).'
            ],
            toRecognizeInQcm: [
              'Comparaison équitable entre pays de structures d’âge différentes → Taux standardisé.',
              'Indicateur combinant mortalité prématurée et morbidité/incapacité → DALYs.'
            ]
          }
        },
        memorize: [
          { id: 'M_L3.3_1', category: 'Formule', title: 'DALYs (AVAI)', content: '<strong>DALY = YLL + YLD</strong> (années de vie perdues par mortalité prématurée + années vécues avec incapacité).', highlight: true },
          { id: 'M_L3.3_2', category: 'Classification', title: 'Enquête STEPS (OMS)', content: 'Surveillance standardisée des FDR des MNT en <strong>3 étapes</strong> : (1) Questionnaire, (2) Mesures physiques, (3) Mesures biochimiques.', highlight: true },
          { id: 'M_L3.3_3', category: 'Distinction', title: 'Taux brut vs Taux standardisé', content: 'Le <strong>taux standardisé</strong> ajuste sur la structure d’âge pour comparer équitablement deux populations ou pays.', highlight: false },
          { id: 'M_L3.3_4', category: 'Définition', title: 'Stratégie OMS « Best Buys »', content: 'Interventions de santé publique très <strong>coût-efficaces</strong> (taxation tabac, réduction sel, étiquetage nutritionnel, lutte contre sédentarité).', highlight: false }
        ]
      }
    ]
  }
);
