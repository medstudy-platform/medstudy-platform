/* ==========================================================================
   Banque QCM Interactive — Partie 1 : Cours C1 à C6 (59 QCM)
   Source : BM Épidémiologie 2026 (Originaux verbatim) + QCM d'entraînement cours
   ========================================================================== */
window.EpiData.qcms.push(
  // ==================== C1 : INTRO SANTÉ PUBLIQUE ====================
  {
    id: 'Q_C1_1', courseId: 'C1', lessonId: 'L1.1', topic: 'Approche prospective de la santé',
    sourceType: 'bm_original', bmRef: 'Ch. 2 Q1', year: '2024', multiSelect: false, isHard: true,
    bmError: { bmKey: 'C', note: 'Le corrigé BM imprime C (approche globaliste OMS) au lieu de B (approche prospective — slide 9).' },
    stem: 'L’approche prospective de la santé, signifie que :',
    options: [
      { key: 'A', text: 'Approche de la santé en dehors de tout critère socioéconomique et culturel' },
      { key: 'B', text: 'Approche de la santé tenant compte des moyens de contrôle des facteurs endogènes et exogènes' },
      { key: 'C', text: 'Approche de la santé tenant compte des dimensions sociale, physique et mentale' },
      { key: 'D', text: 'Approche de la santé tenant compte uniquement des dimensions de l’environnement' }
    ],
    correct: ['B'],
    explanation: 'Selon le Pr Boumaraf (slide 9), l’approche prospective aborde la santé comme un processus dynamique qui tient compte des moyens de contrôle disponibles face aux facteurs endogènes et exogènes.',
    wrongReasons: {
      A: 'Définit l’approche conventionnelle (absence de maladie, hors critères socio-économiques et culturels).',
      C: 'Définit l’approche globaliste (définition OMS 1946 : physique, mental et social).',
      D: 'Trop restrictif (« uniquement l’environnement ») : elle intègre facteurs endogènes ET exogènes.'
    },
    courseRef: 'Intro Santé Publique — Pr Boumaraf, Ch. 2, slides 5–9'
  },
  {
    id: 'Q_C1_2', courseId: 'C1', lessonId: 'L1.1', topic: 'Approche conventionnelle de la santé',
    sourceType: 'bm_original', bmRef: 'Ch. 14 Q2', year: '2025', multiSelect: true, isHard: true,
    bmError: { bmKey: 'ABC', note: 'Le corrigé BM imprime ABC, alors que le cours précise que l’approche conventionnelle exclut tout critère socio-économique et culturel (seul C est juste).' },
    stem: 'L’approche conventionnelle de la santé est caractérisée par les éléments suivants : (Cocher la ou les réponses justes)',
    options: [
      { key: 'A', text: 'Elle tient compte de l’environnement économique et culturel' },
      { key: 'B', text: 'Elle tient compte de l’environnement social' },
      { key: 'C', text: 'Se définit comme : la santé c’est l’absence de la maladie' },
      { key: 'D', text: 'Se définit comme un état complet de bien-être physique, social et psychique' }
    ],
    correct: ['C'],
    explanation: 'L’approche conventionnelle (biomédicale) réduit la santé à la simple absence de maladie ou de dysfonctionnement biologique, en dehors de tout critère socio-économique et culturel.',
    wrongReasons: {
      A: 'Faux : l’approche conventionnelle ignore l’environnement économique et culturel.',
      B: 'Faux : la dimension sociale appartient à l’approche globaliste (OMS).',
      D: 'Faux : c’est la définition OMS (1946), donc l’approche globaliste.'
    },
    courseRef: 'Intro Santé Publique — Pr Boumaraf, Ch. 2, slides 5–7'
  },
  {
    id: 'Q_C1_3', courseId: 'C1', lessonId: 'L1.1', topic: 'Approche prospective (formulation 2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 14 Q3', year: '2025', multiSelect: true, isHard: false,
    stem: 'L’approche prospective de la santé, veut dire : (Cocher les réponses justes)',
    options: [
      { key: 'A', text: 'Est perçue comme une capacité d’adaptation de l’homme à son environnement' },
      { key: 'B', text: 'Seuls les facteurs socio-économiques influent sur la santé de l’individu' },
      { key: 'C', text: 'La santé est le résultat de réactions de l’individu à son environnement et sa capacité à interagir' },
      { key: 'D', text: 'Aucune des réponses n’est juste' }
    ],
    correct: ['A', 'C'],
    explanation: 'L’approche prospective conçoit la santé comme un processus adaptatif : capacité d’adaptation de l’homme (A) et résultat de ses réactions et interactions avec son environnement (C).',
    wrongReasons: {
      B: 'Faux : les facteurs biologiques/endogènes et comportementaux interviennent également.',
      D: 'Faux car A et C sont exactes.'
    },
    courseRef: 'Intro Santé Publique — Pr Boumaraf, Ch. 2, slide 9'
  },
  {
    id: 'Q_C1_4', courseId: 'C1', lessonId: 'L1.1', topic: 'Déterminants extrinsèques vs intrinsèques',
    sourceType: 'bm_original', bmRef: 'Ch. 19 Q11', year: '2022', multiSelect: true, isHard: false, bmUnanswered: true,
    stem: 'Les déterminants extrinsèques d’une maladie font intervenir les éléments suivants : (Cochez les réponses justes)',
    options: [
      { key: 'A', text: 'Infrastructures sanitaires' },
      { key: 'B', text: 'Environnement microbiologique' },
      { key: 'C', text: 'Culture et comportements' },
      { key: 'D', text: 'Patrimoine génétique' }
    ],
    correct: ['A', 'B', 'C'],
    explanation: 'Les déterminants extrinsèques sont extérieurs à la biologie propre de l’individu : infrastructures sanitaires (A), environnement microbiologique (B), culture et comportements (C).',
    wrongReasons: {
      D: 'Le patrimoine génétique est un déterminant INTRINSÈQUE (endogène).'
    },
    courseRef: 'Intro Santé Publique — Pr Boumaraf, Ch. 2, slide 10'
  },
  {
    id: 'Q_C1_5', courseId: 'C1', lessonId: 'L1.2', topic: 'Prévention secondaire vs primaire/tertiaire',
    sourceType: 'bm_original', bmRef: 'Ch. 2 Q2', year: '2024', multiSelect: false, isHard: false,
    stem: 'La prévention secondaire, comprend :',
    options: [
      { key: 'A', text: 'Tous les actes destinés à diminuer les nouveaux cas d’une maladie' },
      { key: 'B', text: 'L’ioduration du sel de cuisine contre le crétinisme et le goitre en est un exemple' },
      { key: 'C', text: 'Le dépistage du cancer du sein en est un exemple' },
      { key: 'D', text: 'Tous les actes destinés à réduire les récidives d’une maladie' }
    ],
    correct: ['C'],
    explanation: 'La prévention secondaire repose sur le dépistage et le traitement précoce (ex. dépistage du cancer du sein) afin de réduire la durée d’évolution et la prévalence.',
    wrongReasons: {
      A: 'Diminuer les nouveaux cas (= incidence) correspond à la prévention primaire.',
      B: 'L’ioduration du sel empêche l’apparition du goitre → prévention primaire.',
      D: 'Réduire les récidives et complications relève de la prévention tertiaire.'
    },
    courseRef: 'Intro Santé Publique — Pr Boumaraf, Ch. 7.5.1, slides 46–49'
  },
  {
    id: 'Q_C1_6', courseId: 'C1', lessonId: 'L1.2', topic: 'Prévention quaternaire (2022)',
    sourceType: 'bm_original', bmRef: 'Ch. 32 Q3', year: '2022', multiSelect: false, isHard: false, bmUnanswered: true,
    stem: 'La prévention quaternaire : (choisir la bonne réponse)',
    options: [
      { key: 'A', text: 'Comprend des activités visant à diminuer l’incidence d’une maladie' },
      { key: 'B', text: 'Fait appel à des activités visant à déceler la maladie précocement' },
      { key: 'C', text: 'Axée sur la prévention des complications' },
      { key: 'D', text: 'Est une protection du patient et du soignant d’une surmédicalisation' }
    ],
    correct: ['D'],
    explanation: 'La prévention quaternaire protège le patient (et le soignant) contre la surmédicalisation, les interventions inutiles et le risque iatrogène/IAS.',
    wrongReasons: {
      A: 'Prévention primaire (incidence).',
      B: 'Prévention secondaire (dépistage précoce).',
      C: 'Prévention tertiaire (complications).'
    },
    courseRef: 'Intro Santé Publique — Pr Boumaraf, slide 50'
  },
  {
    id: 'Q_C1_7', courseId: 'C1', lessonId: 'L1.2', topic: 'Prévention secondaire (durée & prévalence)',
    sourceType: 'bm_original', bmRef: 'Ch. 32 Q12', year: 'ND', multiSelect: true, isHard: false,
    stem: 'La prévention secondaire : (cocher les réponses justes)',
    options: [
      { key: 'A', text: 'Est l’ensemble des actes destinés à réduire la durée de vie de la maladie' },
      { key: 'B', text: 'A pour objectif de diminuer l’incidence de la maladie' },
      { key: 'C', text: 'Parmi ses activités : la vaccination' },
      { key: 'D', text: 'Vise à identifier un patient et une population à risque de surmédicalisation' },
      { key: 'E', text: 'A pour objectif de diminuer la prévalence de la maladie' }
    ],
    correct: ['A', 'E'],
    explanation: 'La prévention secondaire dépiste tôt pour traiter tôt, ce qui réduit la durée d’évolution de la maladie (A) et diminue sa prévalence (E).',
    wrongReasons: {
      B: 'Diminuer l’incidence = prévention primaire.',
      C: 'La vaccination = prévention primaire.',
      D: 'Surmédicalisation = prévention quaternaire.'
    },
    courseRef: 'Intro Santé Publique — Pr Boumaraf, slides 47–48'
  },
  {
    id: 'Q_C1_8', courseId: 'C1', lessonId: 'L1.3', topic: 'Gratuité des soins en Algérie (1974)',
    sourceType: 'bm_original', bmRef: 'Ch. 29 Q14 (= Ch. 41 Q6)', year: '2023', multiSelect: false, isHard: false, bmUnanswered: true,
    stem: 'L’instauration de la gratuité des soins en Algérie était en :',
    options: [
      { key: 'A', text: '1949' },
      { key: 'B', text: '1976' },
      { key: 'C', text: '1974' },
      { key: 'D', text: 'Aucune réponse' }
    ],
    correct: ['C'],
    explanation: 'La gratuité des soins a été instaurée en Algérie en janvier 1974 (phase de transition), accompagnée de la réforme des études médicales et de la création du secteur sanitaire.',
    wrongReasons: {
      A: '1949 est antérieur à l’indépendance.',
      B: '1976 correspond à la Charte nationale / Constitution, pas à la gratuité des soins.',
      D: 'Faux car 1974 figure en C.'
    },
    courseRef: 'Intro Santé Publique — Pr Boumaraf, Ch. 5, slide 26'
  },
  {
    id: 'Q_C1_9', courseId: 'C1', lessonId: 'L1.3', topic: 'Critères de priorité de santé publique',
    sourceType: 'bm_original', bmRef: 'Ch. 38 Q8', year: '2022', multiSelect: true, isHard: false, bmUnanswered: true,
    stem: 'Une maladie devient une priorité en santé publique aux conditions suivantes : (Cochez les réponses justes)',
    options: [
      { key: 'A', text: 'La prévalence est élevée dans la population' },
      { key: 'B', text: 'La maladie est curable ou évitable par la prévention' },
      { key: 'C', text: 'Il n’y a pas encore de traitement efficace' },
      { key: 'D', text: 'Traitement curatif et prévention ont un coût élevé' }
    ],
    correct: ['A', 'B'],
    explanation: 'Une maladie devient prioritaire si son ampleur/fréquence est élevée (A), sa gravité/impact importants, et qu’elle est vulnérable aux actions de santé publique (curable ou évitable, B).',
    wrongReasons: {
      C: 'L’absence de moyen d’action efficace réduit la faisabilité immédiate d’un programme de lutte.',
      D: 'Un coût élevé du traitement/prévention est une contrainte, pas une condition pour prioriser.'
    },
    courseRef: 'Intro Santé Publique — Pr Boumaraf, Ch. 6, slide 30'
  },
  {
    id: 'Q_C1_10', courseId: 'C1', lessonId: 'L1.3', topic: 'Historique, SSP & Éducation vs Promotion',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: true,
    stem: 'Concernant l’historique et les outils de la santé publique (Pr Boumaraf), cochez les propositions exactes :',
    options: [
      { key: 'A', text: 'John Snow a établi en 1854–1855 le lien entre le choléra et l’eau contaminée (pompe de Broad Street)' },
      { key: 'B', text: 'La hiérarchie des interventions suit l’ordre : Politique de SP ⊃ Plan de SP ⊃ Programme de SP ⊃ Action de SP' },
      { key: 'C', text: 'L’éducation pour la santé est strictement synonyme de la promotion de la santé' },
      { key: 'D', text: 'Ignace Semmelweis a démontré en 1847 le rôle du lavage des mains dans la prévention de la fièvre puerpérale' }
    ],
    correct: ['A', 'B', 'D'],
    explanation: 'John Snow (1854–1855, A), Semmelweis (1847, D) et la hiérarchie Politique ⊃ Plan ⊃ Programme ⊃ Action (B) sont des jalons clés du cours du Pr Boumaraf.',
    wrongReasons: {
      C: 'L’éducation pour la santé cible le comportement individuel, tandis que la promotion de la santé (Charte d’Ottawa) est plus globale (environnements favorables, politiques publiques, autonomisation).'
    },
    courseRef: 'Intro Santé Publique — Pr Boumaraf, slides 15–16, 32, 51–53'
  },

  // ==================== C2 : MT & SURVEILLANCE ====================
  {
    id: 'Q_C2_1', courseId: 'C2', lessonId: 'L2.1', topic: 'Pouvoir pathogène vs Virulence vs R0',
    sourceType: 'bm_original', bmRef: 'Ch. 12 Q5', year: '2024', multiSelect: false, isHard: false,
    stem: 'Le pouvoir pathogène d’un agent infectieux :',
    options: [
      { key: 'A', text: 'Est l’intensité des manifestations morbides chez l’hôte réceptif' },
      { key: 'B', text: 'Est sa capacité de provoquer des manifestations morbides chez l’hôte réceptif' },
      { key: 'C', text: 'Peut être, exclusivement, mesuré par le taux de létalité' },
      { key: 'D', text: 'Le taux de reproduction R0 (contagiosité) du virus SARS-CoV-2 est supérieur à celui du virus de la rougeole' }
    ],
    correct: ['B'],
    explanation: 'Le pouvoir pathogène (pathogénicité) est la capacité d’un agent à provoquer des manifestations morbides chez un hôte réceptif.',
    wrongReasons: {
      A: 'L’intensité/gravité des manifestations morbides définit la virulence.',
      C: 'Faux (« exclusivement ») : mesuré aussi par taux d’attaque et indice de gravité.',
      D: 'Faux : R0 de la rougeole (~12–18) est très supérieur à celui du SARS-CoV-2.'
    },
    courseRef: 'Épidémiologie des MT — Dr F. Beichi, § II.1, p. 3–4'
  },
  {
    id: 'Q_C2_2', courseId: 'C2', lessonId: 'L2.1', topic: 'Définition de la virulence',
    sourceType: 'bm_original', bmRef: 'Ch. 12 Q10 (= Ch. 19 Q10)', year: '2021', multiSelect: false, isHard: false,
    stem: 'La virulence d’un agent pathogène peut être définie comme étant :',
    options: [
      { key: 'A', text: 'Son aptitude à se propager dans une collectivité donnée' },
      { key: 'B', text: 'Son aptitude à reproduire la maladie' },
      { key: 'C', text: 'Son aptitude à provoquer des troubles morbides' },
      { key: 'D', text: 'Toutes les réponses sont correctes' }
    ],
    correct: ['B'],
    explanation: 'Dans le cours et la BM (Ch. 12 Q10), la virulence exprime la capacité de multiplication / aptitude à reproduire la maladie et l’intensité du pouvoir pathogène.',
    wrongReasons: {
      A: 'Aptitude à se propager dans une collectivité = contagiosité.',
      C: 'Aptitude à provoquer des troubles morbides = pouvoir pathogène.',
      D: 'Faux car A et C définissent d’autres propriétés.'
    },
    courseRef: 'Épidémiologie des MT — Dr F. Beichi, § II.1, p. 4'
  },
  {
    id: 'Q_C2_3', courseId: 'C2', lessonId: 'L2.1', topic: 'Situation des MT en Algérie (2024)',
    sourceType: 'bm_original', bmRef: 'Ch. 12 Q3', year: '2024', multiSelect: false, isHard: true,
    stem: 'En Algérie :',
    options: [
      { key: 'A', text: 'Les stratégies de prévention adoptées ont permis l’élimination de la poliomyélite' },
      { key: 'B', text: 'Les actions menées sur le terrain ont abouti à l’éradication de la poliomyélite' },
      { key: 'C', text: 'Les stratégies de prévention adoptées ont permis l’élimination de la tuberculose pulmonaire' },
      { key: 'D', text: 'Les maladies à transmission hydrique sont prédominantes' }
    ],
    correct: ['B'],
    explanation: 'Le cours du Dr Beichi (p. 3) retient explicitement l’éradication de la poliomyélite en Algérie (nuance terminologique testée face à « élimination »).',
    wrongReasons: {
      A: 'Le cours et le corrigé 2024 distinguent précisément « éradication » (B) d’« élimination ».',
      C: 'La tuberculose pulmonaire a diminué d’incidence mais n’est PAS éliminée.',
      D: 'Les MTH ne sont plus prédominantes (elles surviennent de façon sporadique/épidémique).'
    },
    courseRef: 'Épidémiologie des MT — Dr F. Beichi, § I.4, p. 2–3'
  },
  {
    id: 'Q_C2_4', courseId: 'C2', lessonId: 'L2.1', topic: 'Situation des MT en Algérie (2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 13 Q1', year: '2025', multiSelect: false, isHard: true, bmUnanswered: true,
    stem: 'En Algérie :',
    options: [
      { key: 'A', text: 'Les stratégies de prévention mises en place ont conduit à l’élimination de la poliomyélite' },
      { key: 'B', text: 'Les actions de terrain ont permis d’éradiquer le paludisme autochtone' },
      { key: 'C', text: 'Les maladies à transmission hydrique sont désormais rares et sporadiques' },
      { key: 'D', text: 'Les mesures de prévention adoptées ont favorisé l’élimination de la tuberculose pulmonaire' }
    ],
    correct: ['B'],
    explanation: 'En Algérie, le paludisme autochtone a été maîtrisé jusqu’à sa disparition/éradication (certification OMS 2019 — p. 3). (Note : si QCM à choix multiples, C reflète aussi la baisse des MTH vers des formes sporadiques, mais B reste l’item phare en réponse unique).',
    wrongReasons: {
      A: 'Comme en 2024 (Ch. 12 Q3), le cours emploie « éradication » pour la poliomyélite.',
      C: 'Les MTH restent responsables d’épisodes épidémiques saisonniers (TIAC, typhoïde), pas totalement rares.',
      D: 'Faux : la tuberculose pulmonaire n’est pas éliminée.'
    },
    courseRef: 'Épidémiologie des MT — Dr F. Beichi, § I.4, p. 2–3'
  },
  {
    id: 'Q_C2_5', courseId: 'C2', lessonId: 'L2.2', topic: 'Surveillance des MDO (passive + réglementation)',
    sourceType: 'bm_original', bmRef: 'Ch. 38 Q1', year: '2022', multiSelect: true, isHard: true,
    bmError: { bmKey: 'ABCD (vs ABC Ch.12 Q9 / C Ch.38 Q11)', note: 'Contradiction interne entre 3 occurrences BM : retenir que les 4 propositions ABCD décrivent la surveillance passive et obligatoire des MDO.' },
    stem: 'Dans un système de surveillance des maladies à déclaration obligatoire (M.D.O.) : (Cocher les réponses justes)',
    options: [
      { key: 'A', text: 'L’autorité sanitaire n’est pas censée intervenir dans le processus de collecte de l’information' },
      { key: 'B', text: 'Le professionnel de santé est responsable de la collecte des données' },
      { key: 'C', text: 'Une réglementation émanant de l’autorité sanitaire du pays est nécessaire' },
      { key: 'D', text: 'Passive c.-à-d. initiée par les professionnels sans que les autorités sanitaires n’interviennent' }
    ],
    correct: ['A', 'B', 'C', 'D'],
    explanation: 'La surveillance des MDO est passive (les autorités attendent la remontée des données recueillies par les professionnels de santé, A, B, D) et obligatoire, donc encadrée par une réglementation nationale (C — Décret 22-250).',
    wrongReasons: {},
    courseRef: 'Épidémiologie des MT — Dr F. Beichi, § V.5–VI, p. 7–8'
  },
  {
    id: 'Q_C2_6', courseId: 'C2', lessonId: 'L2.2', topic: 'Spécificité d’un système de surveillance',
    sourceType: 'bm_original', bmRef: 'Ch. 38 Q4', year: '2022', multiSelect: true, isHard: false,
    stem: 'La spécificité d’un système de surveillance épidémiologique se définit comme : (Cocher les réponses justes)',
    options: [
      { key: 'A', text: 'La capacité à identifier l’absence de la maladie sous surveillance' },
      { key: 'B', text: 'La capacité à correctement identifier les vrais négatifs' },
      { key: 'C', text: 'La capacité à correctement identifier les cas confirmés' },
      { key: 'D', text: 'Un rapport, au numérateur les vrais négatifs et au dénominateur les vrais négatifs et les faux positifs' }
    ],
    correct: ['A', 'B', 'D'],
    explanation: 'La spécificité mesure la capacité du système à exclure les non-malades (A, B) et se calcule par VN / (VN + FP) (D).',
    wrongReasons: {
      C: 'Identifier les cas confirmés (vrais positifs) correspond à la SENSIBILITÉ = VP / (VP + FN).'
    },
    courseRef: 'BM Ch. 38 (Surveillance épidémiologique) — complément Cours 2 § V'
  },
  {
    id: 'Q_C2_7', courseId: 'C2', lessonId: 'L2.2', topic: 'Souplesse d’un système de surveillance',
    sourceType: 'bm_original', bmRef: 'Ch. 38 Q3', year: '2022', multiSelect: true, isHard: false,
    stem: 'La souplesse d’un système de surveillance sous-entend que : (Cocher les réponses justes)',
    options: [
      { key: 'A', text: 'Le système est léger de par sa structure et le nombre d’acteurs' },
      { key: 'B', text: 'Le système est capable de s’adapter à des changements dans la définition du cas de maladie' },
      { key: 'C', text: 'Le système est capable de s’adapter à d’autres sources d’information' },
      { key: 'D', text: 'Le délai nécessaire à la transmission de l’information est suffisant' }
    ],
    correct: ['B', 'C'],
    explanation: 'La souplesse (flexibilité) est la capacité d’adaptation du système à de nouvelles définitions de cas (B) ou à de nouvelles sources d’information (C).',
    wrongReasons: {
      A: 'Structure légère et peu d’acteurs définissent la SIMPLICITÉ (Ch. 38 Q15).',
      D: 'Le délai de transmission renvoie à la RÉACTIVITÉ / rapidité.'
    },
    courseRef: 'BM Ch. 38 (Surveillance épidémiologique) — complément Cours 2 § V'
  },
  {
    id: 'Q_C2_8', courseId: 'C2', lessonId: 'L2.2', topic: 'Définition & processus continu de surveillance',
    sourceType: 'bm_original', bmRef: 'Ch. 38 Q5', year: '2022', multiSelect: true, isHard: false, bmUnanswered: true,
    stem: 'La surveillance épidémiologique d’un phénomène de santé, est : (Cocher les réponses justes)',
    options: [
      { key: 'A', text: 'Processus ponctuel dans le temps qui rejoint les enquêtes' },
      { key: 'B', text: 'Conditionnée par la rapidité du traitement de l’information' },
      { key: 'C', text: 'La diffusion des résultats est capitale' },
      { key: 'D', text: 'Permet une aide à la décision de santé' }
    ],
    correct: ['B', 'C', 'D'],
    explanation: 'La surveillance est conditionnée par la rapidité de traitement (B) et la diffusion (C, cf. Ch. 38 Q14), et sa finalité est l’aide à la décision / action de contrôle (D, cf. Ch. 38 Q12).',
    wrongReasons: {
      A: 'Piège classique : la surveillance est un processus CONTINU (jamais ponctuel !).'
    },
    courseRef: 'Épidémiologie des MT — Dr F. Beichi, § V, p. 6–7 & Ch. 38 Q12–Q14'
  },
  {
    id: 'Q_C2_9', courseId: 'C2', lessonId: 'L2.2', topic: 'Surveillance sentinelle (2024)',
    sourceType: 'bm_original', bmRef: 'Ch. 12 Q4', year: '2024', multiSelect: false, isHard: false,
    stem: 'La surveillance sentinelle des maladies transmissibles :',
    options: [
      { key: 'A', text: 'Est une surveillance active' },
      { key: 'B', text: 'Est une surveillance passive' },
      { key: 'C', text: 'Est une méthode non utilisée en Algérie' },
      { key: 'D', text: 'La surveillance des cas de COVID-19 en est un exemple' }
    ],
    correct: ['A'],
    explanation: 'Dans l’examen 2024 (Ch. 12 Q4), la surveillance sentinelle est classée comme une forme de surveillance active (déclarations régulières par un réseau ciblé volontaire, ex. GROG grippe dans 6 wilayas en Algérie).',
    wrongReasons: {
      B: 'La surveillance passive correspond surtout aux MDO routinières.',
      C: 'Faux : l’Algérie utilise le réseau sentinelle GROG (grippe) et des labos sentinelles PFA/SIDA.',
      D: 'La COVID-19 (SARS-CoV-2) relève d’une MDO Catégorie 2 exhaustive.'
    },
    courseRef: 'Épidémiologie des MT — Dr F. Beichi, § V.6, p. 7'
  },
  {
    id: 'Q_C2_10', courseId: 'C2', lessonId: 'L2.3', topic: 'SRAS — MDO Catégorie 2',
    sourceType: 'bm_original', bmRef: 'Ch. 12 Q7 (= Q11)', year: '2022', multiSelect: true, isHard: false, bmUnanswered: true,
    stem: 'Le syndrome respiratoire aigu sévère (S.R.A.S.) est une MDO : (Cocher les réponses justes)',
    options: [
      { key: 'A', text: 'Faisant partie de la catégorie 2 du nouveau listing des MDO' },
      { key: 'B', text: 'Faisant partie de la catégorie 1 du nouveau listing des MDO' },
      { key: 'C', text: 'Fait partie des 42 MDO de l’arrêté de Novembre 1990' },
      { key: 'D', text: 'Est obligatoirement notifiable à l’OMS' }
    ],
    correct: ['A', 'D'],
    explanation: 'Dans le Décret 22-250 (30 juin 2022), le SRAS (comme Ebola, Ch. 12 Q13) figure parmi les 14 maladies de Catégorie 2 (A) soumises à surveillance internationale et obligatoirement notifiables à l’OMS (D).',
    wrongReasons: {
      B: 'La Catégorie 1 regroupe les 44 MDO à surveillance nationale.',
      C: 'L’arrêté de 1990 est antérieur au SRAS (2002) et a été remplacé.'
    },
    courseRef: 'Épidémiologie des MT — Dr F. Beichi, Annexe Décret 22-250, p. 8–10'
  },
  {
    id: 'Q_C2_11', courseId: 'C2', lessonId: 'L2.3', topic: 'Liste des MDO en Algérie (piège Grippe)',
    sourceType: 'bm_original', bmRef: 'Ch. 12 Q8 (= Q12)', year: '2022', multiSelect: true, isHard: true, bmUnanswered: true,
    stem: 'Parmi les maladies citées ci-dessous, lesquelles sont à déclaration obligatoire : (cocher les réponses justes)',
    options: [
      { key: 'A', text: 'La rubéole' },
      { key: 'B', text: 'La grippe' },
      { key: 'C', text: 'La peste' },
      { key: 'D', text: 'La méningite à méningocoque' }
    ],
    correct: ['A', 'C', 'D'],
    explanation: 'La rubéole (A), la peste (C) et la méningite à méningocoque (D) sont des MDO de Catégorie 1 (Décret 22-250).',
    wrongReasons: {
      B: 'Piège classique ! La grippe saisonnière n’est PAS une MDO (suivie par le réseau sentinelle GROG) ; seule la grippe causée par un NOUVEAU sous-type est MDO (Cat. 2).'
    },
    courseRef: 'Épidémiologie des MT — Dr F. Beichi, Annexe Décret 22-250, p. 9–10'
  },
  {
    id: 'Q_C2_12', courseId: 'C2', lessonId: 'L2.3', topic: 'Modélisation en surveillance des MT',
    sourceType: 'bm_original', bmRef: 'Ch. 12 Q2', year: '2024', multiSelect: false, isHard: false, bmUnanswered: true,
    stem: 'Dans la surveillance des maladies transmissibles, la modélisation consiste en :',
    options: [
      { key: 'A', text: 'Une étude prévisionnelle et tendancielle des maladies transmissibles' },
      { key: 'B', text: 'Une évaluation des activités sanitaires de prévention' },
      { key: 'C', text: 'Une application des méthodes fondamentales de recherche des facteurs étiologiques' },
      { key: 'D', text: 'Une rédaction de rapports et émission de recommandations pour lutter contre une maladie transmissible' }
    ],
    correct: ['A'],
    explanation: 'La modélisation mathématique/épidémiologique permet d’établir des prévisions et d’anticiper les tendances évolutives d’une maladie transmissible.',
    wrongReasons: {
      B: 'Relève de l’évaluation de programme.',
      C: 'Relève de l’épidémiologie analytique/étiologique.',
      D: 'Correspond à l’étape de diffusion/rétro-information.'
    },
    courseRef: 'BM Ch. 12 Q2 (2024) — complément surveillance MT'
  },
  {
    id: 'Q_C2_13', courseId: 'C2', lessonId: 'L2.3', topic: 'Décret 22-250 & Prophylaxie en 3 axes',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: true,
    stem: 'À propos du Décret 22-250 (2022) et de la prophylaxie des MT (Dr Beichi), cochez les propositions exactes :',
    options: [
      { key: 'A', text: 'Le Décret 22-250 du 30 juin 2022 fixe 44 MDO de Catégorie 1 et 14 MDO de Catégorie 2' },
      { key: 'B', text: 'La séroprophylaxie (SAS, SAT) et la chimioprophylaxie agissent sur le 3ème maillon (protection du sujet réceptif)' },
      { key: 'C', text: 'Toutes les maladies transmissibles sont contagieuses d’homme à homme' },
      { key: 'D', text: 'Les déclarants obligatoires des MDO sont les médecins et les biologistes (secteurs public et privé)' }
    ],
    correct: ['A', 'B', 'D'],
    explanation: 'Les chiffres 44/14 (A), les déclarants médecins + biologistes (D) et les 3 axes prophylactiques (B) proviennent directement du polycopié du Dr Beichi.',
    wrongReasons: {
      C: 'Faux : toutes les contagieuses sont transmissibles, mais l’inverse est faux (tétanos, paludisme, TIAC ne sont pas contagieuses).'
    },
    courseRef: 'Épidémiologie des MT — Dr F. Beichi, p. 2, 6, 8–10'
  },

  // ==================== C3 : MNT ====================
  {
    id: 'Q_C3_1', courseId: 'C3', lessonId: 'L3.1', topic: 'Définition facteur de risque MNT',
    sourceType: 'bm_original', bmRef: 'Ch. 11 Q1', year: '2022', multiSelect: false, isHard: false,
    stem: 'Dans les maladies non transmissibles un facteur de risque est :',
    options: [
      { key: 'A', text: 'Une constante' },
      { key: 'B', text: 'Une variable qui augmente la probabilité de la survenue de la maladie' },
      { key: 'C', text: 'Une variable que l’on peut mesurer' },
      { key: 'D', text: 'C’est un marqueur de risque' }
    ],
    correct: ['B'],
    explanation: 'Un facteur de risque est une variable liée causalement à la maladie qui augmente sa probabilité de survenue.',
    wrongReasons: {
      A: 'Ce n’est jamais une constante (il varie d’un sujet à l’autre).',
      C: 'Trop vague et non spécifique d’un facteur de risque.',
      D: 'Un marqueur de risque est non modifiable / non causal, distinct d’un facteur de risque.'
    },
    courseRef: 'Épidémiologie des MNT, slides 6–9'
  },
  {
    id: 'Q_C3_2', courseId: 'C3', lessonId: 'L3.1', topic: 'Transition épidémiologique (2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 19 Q2', year: '2025', multiSelect: false, isHard: false,
    stem: 'L’étape essentielle de la transition épidémiologique est marquée par :',
    options: [
      { key: 'A', text: 'La résurgence des maladies infectieuses' },
      { key: 'B', text: 'La baisse de l’incidence des MNT' },
      { key: 'C', text: 'La disparition des facteurs environnementaux de risque' },
      { key: 'D', text: 'L’augmentation de l’espérance de vie' }
    ],
    correct: ['D'],
    explanation: 'La transition épidémiologique se caractérise par le recul des maladies infectieuses, l’augmentation de l’espérance de vie (77 ans en Algérie) et la prédominance des MNT.',
    wrongReasons: {
      A: 'Inverse : recul global des infections.',
      B: 'Inverse : forte hausse des MNT.',
      C: 'Faux : l’urbanisation et l’industrialisation créent de nouveaux risques environnementaux.'
    },
    courseRef: 'Épidémiologie des MNT, slides 10–11 (+ C1 slides 23–24)'
  },
  {
    id: 'Q_C3_3', courseId: 'C3', lessonId: 'L3.1', topic: 'Chiffres MNT Monde & Algérie',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: false,
    stem: 'Concernant le poids épidémiologique des MNT dans le monde et en Algérie, cochez les réponses exactes :',
    options: [
      { key: 'A', text: 'Les MNT causent environ 74 % des décès dans le monde (41 millions/an)' },
      { key: 'B', text: 'En Algérie, les MNT représentent environ 80 % des décès, dominées par les MCV (35 %)' },
      { key: 'C', text: 'L’âge, le sexe et l’hérédité sont des facteurs de risque comportementaux modifiables' },
      { key: 'D', text: 'En Algérie, la prévalence du diabète dépasse 14 % et l’obésité féminine dépasse 27 %' }
    ],
    correct: ['A', 'B', 'D'],
    explanation: 'Tous les chiffres de A, B et D figurent textuellement dans les slides 5, 11 et 12 du cours MNT.',
    wrongReasons: {
      C: 'Âge, sexe et hérédité sont des facteurs NON modifiables (marqueurs de risque).'
    },
    courseRef: 'Épidémiologie des MNT, slides 5, 8, 11–12'
  },
  {
    id: 'Q_C3_4', courseId: 'C3', lessonId: 'L3.2', topic: 'Prévention secondaire MNT (nouveaux & anciens cas)',
    sourceType: 'bm_original', bmRef: 'Ch. 11 Q2', year: '2022', multiSelect: false, isHard: true,
    stem: 'La prévention secondaire des maladies non transmissibles :',
    options: [
      { key: 'A', text: 'Tend à diminuer de nouveaux cas de maladie' },
      { key: 'B', text: 'Repose sur l’éducation et l’observance des mesures de sécurité' },
      { key: 'C', text: 'Sont des mesures non spécifiques' },
      { key: 'D', text: 'Vise à diminuer les nouveaux et anciens cas de maladie' }
    ],
    correct: ['D'],
    explanation: 'La prévention secondaire vise à réduire la PRÉVALENCE (Ch. 11 Q4 B), qui correspond exactement à l’ensemble des nouveaux ET anciens cas.',
    wrongReasons: {
      A: 'Diminuer les nouveaux cas (= incidence) définit la prévention primaire.',
      B: 'Mesures générales en amont = prévention primaire.',
      C: 'Les actions de dépistage secondaire sont au contraire ciblées et spécifiques.'
    },
    courseRef: 'Épidémiologie des MNT, slide 20'
  },
  {
    id: 'Q_C3_5', courseId: 'C3', lessonId: 'L3.2', topic: 'Prévention primaire MNT (2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 29 Q2', year: '2025', multiSelect: false, isHard: false,
    stem: 'Parmi les propositions suivantes, laquelle correspond à un exemple type de prévention Primaire ?',
    options: [
      { key: 'A', text: 'Traiter une rétinopathie diabétique' },
      { key: 'B', text: 'Arrêter la consommation de tabac pour prévenir le cancer pulmonaire' },
      { key: 'C', text: 'Dépister un cancer par mammographie' },
      { key: 'D', text: 'Effectuer un scanner thoracique chez un ancien fumeur' }
    ],
    correct: ['B'],
    explanation: 'Le sevrage tabagique supprime l’exposition au facteur de risque avant l’apparition du cancer → prévention primaire.',
    wrongReasons: {
      A: 'Traiter une complication avérée = prévention tertiaire.',
      C: 'Dépistage mammographique = prévention secondaire.',
      D: 'Scanner thoracique chez un ancien fumeur = dépistage (prévention secondaire).'
    },
    courseRef: 'Épidémiologie des MNT, slides 19–21'
  },
  {
    id: 'Q_C3_6', courseId: 'C3', lessonId: 'L3.2', topic: 'Prévention quaternaire (2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 29 Q1', year: '2025', multiSelect: false, isHard: false,
    stem: 'La prévention quaternaire a pour principal objectif de :',
    options: [
      { key: 'A', text: 'Favoriser l’augmentation des traitements disponibles' },
      { key: 'B', text: 'Réduire la prescription d’interventions inutiles' },
      { key: 'C', text: 'Étendre les programmes de dépistage systématique' },
      { key: 'D', text: 'Promouvoir uniquement la recherche clinique expérimentale' }
    ],
    correct: ['B'],
    explanation: 'La prévention quaternaire vise la pertinence des soins et la réduction des examens/interventions inutiles (lutte contre la surmédicalisation).',
    wrongReasons: {
      A: 'Opposé au principe de sobriété et de pertinence des soins.',
      C: 'Le dépistage relève de la prévention secondaire.',
      D: 'Sans rapport avec la prévention quaternaire.'
    },
    courseRef: 'Épidémiologie des MNT, slide 22'
  },
  {
    id: 'Q_C3_7', courseId: 'C3', lessonId: 'L3.3', topic: 'Enquête STEPS OMS, DALYs & Best Buys',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: true,
    stem: 'À propos de la surveillance et des indicateurs des MNT, cochez les propositions exactes :',
    options: [
      { key: 'A', text: 'L’enquête STEPS de l’OMS comporte 3 étapes : questionnaire, mesures physiques et mesures biochimiques' },
      { key: 'B', text: 'Les DALYs combinent uniquement la mortalité prématurée (YLL), sans intégrer l’incapacité' },
      { key: 'C', text: 'Le taux standardisé sur l’âge permet de comparer équitablement la mortalité entre pays de démographies différentes' },
      { key: 'D', text: 'Les « Best Buys » de l’OMS désignent des interventions très coût-efficaces (taxation tabac, réduction du sel…)' }
    ],
    correct: ['A', 'C', 'D'],
    explanation: 'STEPS en 3 étapes (A), standardisation sur l’âge (C) et stratégie Best Buys (D) sont les piliers des slides 23–28.',
    wrongReasons: {
      B: 'Faux : DALY = YLL (années perdues par décès prématuré) + YLD (années vécues avec incapacité).'
    },
    courseRef: 'Épidémiologie des MNT, slides 23–28'
  },
  {
    id: 'Q_C3_8', courseId: 'C3', lessonId: 'L3.3', topic: 'Indicateur DALY & Taux standardisé',
    sourceType: 'course_generated', year: 'Cours', multiSelect: false, isHard: false,
    stem: 'Quel indicateur de charge morbide combine à la fois les années de vie perdues par mortalité prématurée et les années vécues avec incapacité ?',
    options: [
      { key: 'A', text: 'Le taux brut de mortalité' },
      { key: 'B', text: 'Le taux d’attaque' },
      { key: 'C', text: 'Les DALYs (AVAI)' },
      { key: 'D', text: 'Le sex-ratio' }
    ],
    correct: ['C'],
    explanation: 'Les DALYs (Disability-Adjusted Life Years / AVAI) additionnent YLL (mortalité prématurée) et YLD (morbidité/incapacité).',
    wrongReasons: {
      A: 'Ne mesure que les décès bruts sans ajustement ni incapacité.',
      B: 'Indicateur d’incidence cumulée en épidémie aiguë.',
      D: 'Ratio démographique Hommes / Femmes.'
    },
    courseRef: 'Épidémiologie des MNT, slides 24–25'
  },
  {
    id: 'Q_C3_9', courseId: 'C3', lessonId: 'L3.3', topic: 'Surveillance MNT (registres & STEPS)',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: false,
    stem: 'Quels outils participent directement à la surveillance épidémiologique des MNT ?',
    options: [
      { key: 'A', text: 'Les registres du cancer, du diabète et des AVC' },
      { key: 'B', text: 'Les enquêtes STEPS de l’OMS' },
      { key: 'C', text: 'La déclaration obligatoire en Catégorie 2 (OMS) de l’HTA' },
      { key: 'D', text: 'Les statistiques de mortalité par cause (taux standardisés)' }
    ],
    correct: ['A', 'B', 'D'],
    explanation: 'La surveillance des MNT s’appuie sur les registres de morbidité (A), les enquêtes de FDR STEPS (B) et les données de mortalité (D).',
    wrongReasons: {
      C: 'Faux : la Catégorie 2 MDO concerne 14 maladies infectieuses à potentiel épidémique international, jamais l’HTA.'
    },
    courseRef: 'Épidémiologie des MNT, slides 23–26'
  },

  // ==================== C4 : INVESTIGATION D'UNE ÉPIDÉMIE ====================
  {
    id: 'Q_C4_1', courseId: 'C4', lessonId: 'L4.1', topic: 'Définition d’une épidémie (2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 19 Q6', year: '2025', multiSelect: false, isHard: false,
    stem: 'Parmi les propositions suivantes, laquelle définit le mieux une épidémie ?',
    options: [
      { key: 'A', text: 'Survenue inattendue de cas sporadiques sans lien épidémiologique' },
      { key: 'B', text: 'Excès de cas par rapport au niveau attendu dans une population et un temps donné' },
      { key: 'C', text: 'Augmentation saisonnière prévue d’une maladie endémique' },
      { key: 'D', text: 'Apparition simultanée de différentes maladies dans une population' }
    ],
    correct: ['B'],
    explanation: 'Une épidémie est la survenue en excès de cas par rapport au nombre habituellement attendu dans une population, un lieu et une période donnés.',
    wrongReasons: {
      A: 'Correspond à des cas sporadiques isolés.',
      C: 'Une variation saisonnière habituelle/prévue est une fausse épidémie.',
      D: 'Une épidémie porte sur une même maladie / un même événement.'
    },
    courseRef: 'Investigation d’une épidémie — Dr F. Beichi, § I.1, p. 2'
  },
  {
    id: 'Q_C4_2', courseId: 'C4', lessonId: 'L4.1', topic: 'Source ponctuelle vs Source persistante (2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 19 Q4', year: '2025', multiSelect: false, isHard: true,
    stem: 'La différence principale entre une source ponctuelle et une source persistante est que :',
    options: [
      { key: 'A', text: 'La source ponctuelle entraîne une épidémie de longue durée' },
      { key: 'B', text: 'La source persistante génère un seul pic épidémique' },
      { key: 'C', text: 'La source ponctuelle libère l’agent pathogène sur une courte période uniquement' },
      { key: 'D', text: 'La source persistante émet de manière épisodique l’agent pathogène' }
    ],
    correct: ['C'],
    explanation: 'Une source ponctuelle expose sur une courte période unique (ex. repas contaminé), générant un pic bref.',
    wrongReasons: {
      A: 'Faux : épidémie courte (à l’inverse de la source persistante).',
      B: 'Faux : c’est la source ponctuelle qui génère un pic unique.',
      D: 'Piège de vocabulaire : une source persistante émet de manière CONTINUE (pas épisodique/intermittente).'
    },
    courseRef: 'Investigation d’une épidémie — Dr F. Beichi, § I.3, p. 2'
  },
  {
    id: 'Q_C4_3', courseId: 'C4', lessonId: 'L4.1', topic: 'Définition Outbreak (2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 19 Q5', year: '2025', multiSelect: false, isHard: false,
    stem: 'Le terme Outbreak désigne spécifiquement :',
    options: [
      { key: 'A', text: 'L’apparition simultanée de plusieurs agents pathogènes' },
      { key: 'B', text: 'Une épidémie limitée géographiquement ou dans le temps' },
      { key: 'C', text: 'Une pandémie de grande ampleur' },
      { key: 'D', text: 'Une augmentation de cas sans preuve épidémiologique claire' }
    ],
    correct: ['B'],
    explanation: 'Outbreak (cas groupés) désigne une épidémie de taille limitée, circonscrite dans le temps ou géographiquement.',
    wrongReasons: {
      A: 'Faux.',
      C: 'Exact opposé (une pandémie s’étend sur plusieurs continents).',
      D: 'Faux.'
    },
    courseRef: 'Investigation d’une épidémie — Dr F. Beichi, § I.2, p. 2'
  },
  {
    id: 'Q_C4_4', courseId: 'C4', lessonId: 'L4.1', topic: 'Objectifs généraux d’une investigation (2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 19 Q1', year: '2025', multiSelect: false, isHard: false,
    stem: 'Concernant les objectifs généraux d’une investigation épidémiologique, indiquez l’affirmation correcte :',
    options: [
      { key: 'A', text: 'L’unique objectif est de produire des publications scientifiques' },
      { key: 'B', text: 'Il s’agit de confirmer l’efficacité des actions de prévention' },
      { key: 'C', text: 'Elle vise principalement à interrompre la transmission et prévenir de nouveaux cas' },
      { key: 'D', text: 'Elle consiste uniquement en la surveillance de la maladie sans action corrective' }
    ],
    correct: ['C'],
    explanation: 'Les objectifs premiers d’une investigation sont d’arrêter l’épidémie (interrompre la transmission) et de prévenir de nouveaux cas ou épisodes.',
    wrongReasons: {
      A: 'La publication n’est jamais l’unique objectif.',
      B: 'Objectif secondaire / d’évaluation, pas l’objectif principal immédiat.',
      D: 'Faux : l’investigation débouche impérativement sur des actions correctives.'
    },
    courseRef: 'Investigation d’une épidémie — Dr F. Beichi, § II.1, p. 3'
  },
  {
    id: 'Q_C4_5', courseId: 'C4', lessonId: 'L4.2', topic: 'Courbe épidémique (Étape 5A)',
    sourceType: 'bm_original', bmRef: 'Ch. 19 Q8 (= Ch. 14 Q49)', year: '2022', multiSelect: true, isHard: true, bmUnanswered: true,
    bmError: { bmKey: 'B seul (Ch. 14 Q49) / manquant (Ch. 19 Q8)', note: 'Le cours p. 6 confirme que B, C et D sont toutes exactes ; seul A est faux.' },
    stem: 'La courbe épidémique du nombre de cas d’un événement de santé dans son évolution dans le temps : (Cocher les réponses justes)',
    options: [
      { key: 'A', text: 'Renseigne avec certitude sur la nature de l’agent causal de la maladie' },
      { key: 'B', text: 'Permet de calculer la durée d’incubation de la maladie' },
      { key: 'C', text: 'Fournit des informations sur le type de transmission de l’agent infectieux' },
      { key: 'D', text: 'Fournit des informations sur la nature de la source de contamination' }
    ],
    correct: ['B', 'C', 'D'],
    explanation: 'La courbe épidémique permet d’estimer la durée d’incubation (B), le type de transmission (C) et la nature de la source — ponctuelle vs persistante (D).',
    wrongReasons: {
      A: 'Piège majeur ! Elle oriente les hypothèses mais NE donne JAMAIS de certitude sur l’agent causal (seul le laboratoire le confirme).'
    },
    courseRef: 'Investigation d’une épidémie — Dr F. Beichi, Étape 5A, p. 6'
  },
  {
    id: 'Q_C4_6', courseId: 'C4', lessonId: 'L4.2', topic: 'Taux d’attaque en épidémie',
    sourceType: 'bm_original', bmRef: 'Ch. 19 Q13 (= Ch. 17 Q32)', year: '2022', multiSelect: false, isHard: false, bmUnanswered: true,
    stem: 'Vous avez investigué une épidémie récente, et vous avez calculé le rapport nombre de sujets atteints / nombre de sujets de la population de la zone ; on appelle cela :',
    options: [
      { key: 'A', text: 'Le taux d’incidence' },
      { key: 'B', text: 'Le taux d’attaque' },
      { key: 'C', text: 'La fréquence de la maladie' },
      { key: 'D', text: 'Le taux de morbidité' }
    ],
    correct: ['B'],
    explanation: 'Dans le contexte d’une épidémie aiguë sur une population exposée définie, ce rapport s’appelle spécifiquement le taux d’attaque (confirmé par Ch. 17 Q32 = C).',
    wrongReasons: {
      A: 'Terme plus général ; le terme spécifique en investigation d’épidémie est taux d’attaque.',
      C: 'Terme trop générique.',
      D: 'Terme non spécifique.'
    },
    courseRef: 'Investigation d’une épidémie — Dr F. Beichi, Étape 5, p. 6'
  },
  {
    id: 'Q_C4_7', courseId: 'C4', lessonId: 'L4.2', topic: 'Collecte des cas (Étape 4 — 2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 19 Q3', year: '2025', multiSelect: false, isHard: false,
    stem: 'La collecte des cas durant une investigation repose sur :',
    options: [
      { key: 'A', text: 'Les associations des quartiers et les témoignages populaires' },
      { key: 'B', text: 'Les dossiers hospitaliers, les registres et les laboratoires de diagnostic' },
      { key: 'C', text: 'Les prédictions basées sur les modèles climatiques' },
      { key: 'D', text: 'Une enquête de satisfaction auprès des patients guéris' }
    ],
    correct: ['B'],
    explanation: 'La recherche active et systématique des cas s’appuie sur des sources médicales fiables : dossiers hospitaliers, registres et laboratoires de diagnostic.',
    wrongReasons: {
      A: 'Sources informelles non validées cliniquement.',
      C: 'Modèles climatiques sans rapport avec le recensement des malades.',
      D: 'Ne recense pas les cas de l’épidémie.'
    },
    courseRef: 'Investigation d’une épidémie — Dr F. Beichi, Étape 4, p. 5'
  },
  {
    id: 'Q_C4_8', courseId: 'C4', lessonId: 'L4.3', topic: 'Contenu de la phase descriptive',
    sourceType: 'bm_original', bmRef: 'Ch. 19 Q9', year: '2022', multiSelect: true, isHard: false,
    stem: 'La phase descriptive de l’investigation d’une épidémie comporte les étapes suivantes : (Cocher les réponses justes)',
    options: [
      { key: 'A', text: 'L’affirmation de l’épisode épidémique' },
      { key: 'B', text: 'L’identification des personnes à risque' },
      { key: 'C', text: 'La réalisation éventuelle d’une étude épidémiologique plus approfondie' },
      { key: 'D', text: 'La rédaction du rapport de l’épidémie' }
    ],
    correct: ['A', 'B'],
    explanation: 'La phase descriptive (Étapes 1–6) comprend l’affirmation de l’épidémie (A) et la description temps/lieu/personne permettant d’identifier les personnes à risque (B).',
    wrongReasons: {
      C: 'Correspond à la phase analytique / étiologique (Étape 7).',
      D: 'La rédaction du rapport est l’Étape 9, en fin d’investigation.'
    },
    courseRef: 'Investigation d’une épidémie — Dr F. Beichi, § III, p. 3–6'
  },
  {
    id: 'Q_C4_9', courseId: 'C4', lessonId: 'L4.3', topic: 'Phase étiologique : approche cohorte',
    sourceType: 'bm_original', bmRef: 'Ch. 19 Q14', year: '2019', multiSelect: false, isHard: false,
    stem: 'La phase étiologique lors de l’investigation d’une épidémie, utilise :',
    options: [
      { key: 'A', text: 'L’approche expérimentale' },
      { key: 'B', text: 'L’étude épidémiologique transversale' },
      { key: 'C', text: 'L’approche cohorte' },
      { key: 'D', text: 'L’étude démographique' }
    ],
    correct: ['C'],
    explanation: 'À l’Étape 7 (phase analytique/étiologique), on teste les hypothèses par une étude de cohorte rétrospective (comparaison de taux d’attaque) ou une étude cas-témoins.',
    wrongReasons: {
      A: 'On n’expérimente pas l’exposition à un pathogène sur l’homme.',
      B: 'L’étude transversale est descriptive, pas étiologique d’investigation.',
      D: 'Une étude démographique ne teste pas une exposition causale.'
    },
    courseRef: 'Investigation d’une épidémie — Dr F. Beichi, Étape 7, p. 6'
  },
  {
    id: 'Q_C4_10', courseId: 'C4', lessonId: 'L4.3', topic: 'Étapes 1–10 (sensibilité, date début, mesures)',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: true,
    stem: 'Concernant les règles opérationnelles des 10 étapes d’investigation (Dr Beichi), cochez les propositions exactes :',
    options: [
      { key: 'A', text: 'Si la maladie est mal connue, la définition de cas privilégie la sensibilité (cas certains, probables et possibles)' },
      { key: 'B', text: 'La date essentielle à recueillir pour tracer la courbe épidémique est la date de début des symptômes' },
      { key: 'C', text: 'Il faut obligatoirement attendre la fin de l’étude analytique avant de mettre en place toute mesure de prévention' },
      { key: 'D', text: 'Une étude cas-témoins en phase analytique compare les proportions d’exposition chez les cas et chez les témoins' }
    ],
    correct: ['A', 'B', 'D'],
    explanation: 'Sensibilité de la définition de cas (A), date de début des symptômes (B) et principe de l’étude cas-témoins (D) sont des points clés du cours.',
    wrongReasons: {
      C: 'Piège majeur (Étape 10) : ne JAMAIS attendre la fin de l’investigation — instaurer des mesures générales dès le début !'
    },
    courseRef: 'Investigation d’une épidémie — Dr F. Beichi, Étapes 3, 4, 7 & 10, p. 5–7'
  },

  // ==================== C5 : TIAC ====================
  {
    id: 'Q_C5_1', courseId: 'C5', lessonId: 'L5.1', topic: 'Enquête épidémiologique TIAC (2024)',
    sourceType: 'bm_original', bmRef: 'Ch. 6 Q2 (= Q1)', year: '2024', multiSelect: false, isHard: false,
    stem: 'L’investigation d’une épidémie de toxi-infection alimentaire collective TIAC nécessite :',
    options: [
      { key: 'A', text: 'Une étape strictement descriptive' },
      { key: 'B', text: 'Une étape à visée étiologique obligatoire' },
      { key: 'C', text: 'Une étape descriptive suivie obligatoirement d’une étape analytique' },
      { key: 'D', text: 'Une étape descriptive selon les caractères de lieu, de personne et temps, non suivie obligatoirement d’une étape analytique' }
    ],
    correct: ['C'],
    explanation: 'L’investigation d’une TIAC associe systématiquement une enquête descriptive (T/L/P) suivie d’une enquête analytique pour identifier l’aliment incriminé.',
    wrongReasons: {
      A: 'Insuffisant pour démontrer statistiquement l’aliment responsable.',
      B: 'Omet l’étape descriptive indispensable.',
      D: 'Faux : l’étape analytique suit la phase descriptive.'
    },
    courseRef: 'CAT TIAC — Dr Nourani, slides 4 & 10'
  },
  {
    id: 'Q_C5_2', courseId: 'C5', lessonId: 'L5.1', topic: 'Déclaration des cas de TIAC (2024)',
    sourceType: 'bm_original', bmRef: 'Ch. 6 Q3', year: '2024', multiSelect: false, isHard: false,
    stem: 'La déclaration des cas de TIAC se fait, par :',
    options: [
      { key: 'A', text: 'Une fiche d’enquête des toxi-infections alimentaires' },
      { key: 'B', text: 'Un signalement rapide et une notification sur un relevé des MDO' },
      { key: 'C', text: 'Un registre de renseignement des données des MDO' },
      { key: 'D', text: 'Des formulaires des maladies à déclaration obligatoire' }
    ],
    correct: ['B'],
    explanation: 'La TIAC étant une urgence médico-épidémiologique, elle impose un signalement rapide immédiat (SEMEP) ET une notification écrite sur le relevé des MDO.',
    wrongReasons: {
      A: 'La fiche d’enquête sert à l’investigation par le SEMEP, pas à la déclaration initiale.',
      C: 'Ne comporte pas l’alerte/signalement rapide immédiat.',
      D: 'Incomplet sans le signalement rapide immédiat.'
    },
    courseRef: 'CAT TIAC — Dr Nourani, slide 9 ; Instr. 2026 p. 4–5'
  },
  {
    id: 'Q_C5_3', courseId: 'C5', lessonId: 'L5.1', topic: 'Facteurs favorisants des TIAC (2024)',
    sourceType: 'bm_original', bmRef: 'Ch. 6 Q4', year: '2024', multiSelect: false, isHard: false,
    stem: 'Les facteurs favorisant les Toxi-infections alimentaires collectives (TIAC) :',
    options: [
      { key: 'A', text: 'Le respect de la chaîne de froid' },
      { key: 'B', text: 'Des erreurs dans le processus de préparation des aliments' },
      { key: 'C', text: 'Un délai réduit entre la préparation et la consommation' },
      { key: 'D', text: 'La fréquence des gastro-entérites' }
    ],
    correct: ['B'],
    explanation: 'Les erreurs de préparation, de conservation et d’hygiène alimentaire sont les principaux facteurs favorisants des TIAC.',
    wrongReasons: {
      A: 'Facteur protecteur (prévention), pas favorisant.',
      C: 'Facteur protecteur (moins de temps de multiplication bactérienne).',
      D: 'Sans lien causal direct avec la contamination d’un repas collectif.'
    },
    courseRef: 'CAT TIAC — Dr Nourani, slides 5 & 16–19'
  },
  {
    id: 'Q_C5_4', courseId: 'C5', lessonId: 'L5.1', topic: 'Urgence médicale et épidémiologique (2024)',
    sourceType: 'bm_original', bmRef: 'Ch. 6 Q5', year: '2024', multiSelect: false, isHard: false,
    stem: 'Les toxi-infections alimentaires collectives sont :',
    options: [
      { key: 'A', text: 'Des urgences médicales et épidémiologiques' },
      { key: 'B', text: 'Des urgences médicales nécessitant une mobilisation de moyens humains' },
      { key: 'C', text: 'Des urgences épidémiologiques nécessitant une approche uniquement environnementale' },
      { key: 'D', text: 'Des urgences médicales impactant les activités habituelles des structures' }
    ],
    correct: ['A'],
    explanation: 'Les TIAC constituent une double urgence : médicale (prise en charge des malades, réhydratation) et épidémiologique (alerte, retrait de l’aliment contaminé).',
    wrongReasons: {
      B: 'Omet la dimension d’urgence épidémiologique.',
      C: 'Faux (« uniquement environnementale »).',
      D: 'Incomplet par rapport à la définition exacte du cours.'
    },
    courseRef: 'CAT TIAC — Dr Nourani, slides 2–4'
  },
  {
    id: 'Q_C5_5', courseId: 'C5', lessonId: 'L5.2', topic: 'Germes, incubations & botulisme',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: true,
    stem: '25 convives présentent des vomissements et diarrhées SANS fièvre 3 h après des pâtisseries à la crème. Cochez les propositions exactes sur les TIAC :',
    options: [
      { key: 'A', text: 'Le germe le plus probable ici est Staphylococcus aureus (toxine préformée, incubation 1–6 h)' },
      { key: 'B', text: 'Une TIAC exige toujours au moins 2 cas groupés similaires, même pour le botulisme' },
      { key: 'C', text: 'Une TIAC fébrile (39 °C) 24 h après œufs/volaille évoque Salmonella non typhoïdique' },
      { key: 'D', text: 'Listeria monocytogenes expose particulièrement la femme enceinte (avortement) et le nouveau-né (méningite)' }
    ],
    correct: ['A', 'C', 'D'],
    explanation: 'S. aureus (1–6 h sans fièvre, A), Salmonella (12–72 h fébrile sur œufs/volailles, C) et Listeria (femme enceinte/nouveau-né, D) sont les tableaux phares du cours.',
    wrongReasons: {
      B: 'Faux : exception absolue pour le BOTULISME où 1 SEUL cas suffit !'
    },
    courseRef: 'Cours_Epidemiologie_TIAC.pdf (Instr. 2026), p. 1–3'
  },
  {
    id: 'Q_C5_6', courseId: 'C5', lessonId: 'L5.2', topic: 'Prélèvements & Traitement des TIAC',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: true,
    stem: 'Concernant les prélèvements et le traitement d’une TIAC (Instr. N°19/2026), cochez les propositions exactes :',
    options: [
      { key: 'A', text: 'Il est formellement recommandé de congeler tous les prélèvements avant leur envoi à l’IPA' },
      { key: 'B', text: 'Le lopéramide (Imodium®) est formellement proscrit en cas de syndrome dysentérique' },
      { key: 'C', text: 'Un prélèvement d’eau suspecte requiert un flacon stérile de 1 litre transporté immédiatement à +4 °C' },
      { key: 'D', text: 'Les selles doivent être prélevées (≥ 10 g) avant toute antibiothérapie' }
    ],
    correct: ['B', 'C', 'D'],
    explanation: 'Imodium® proscrit si dysenterie (B, risque de colo-stase), eau = 1 L à +4 °C (C), selles ≥ 10 g avant ATB (D).',
    wrongReasons: {
      A: 'Piège critique ! Ne JAMAIS congeler les prélèvements (sauf force majeure), au risque de détruire les germes.'
    },
    courseRef: 'Cours_Epidemiologie_TIAC.pdf (Instr. 2026), p. 5–8'
  },
  {
    id: 'Q_C5_7', courseId: 'C5', lessonId: 'L5.2', topic: 'Complications spécifiques TIAC',
    sourceType: 'course_generated', year: 'Cours', multiSelect: false, isHard: false,
    stem: 'Parmi ces couples « Germe TIAC — Aliment / Complication typique », lequel est INEXACT ?',
    options: [
      { key: 'A', text: 'Bacillus cereus — Riz / purée de légumes' },
      { key: 'B', text: 'E. coli entéro-hémorragique (EHEC) — Syndrome hémolytique et urémique (SHU)' },
      { key: 'C', text: 'Campylobacter — Syndrome de Guillain-Barré' },
      { key: 'D', text: 'Clostridium perfringens — Fièvre élevée à 40 °C dès la 2ème heure' }
    ],
    correct: ['D'],
    explanation: 'Clostridium perfringens a une incubation de 8–24 h (viandes/sauces refroidies lentement) et provoque une diarrhée SANS fièvre !',
    wrongReasons: {
      A: 'Exact (incubation 1–16 h).',
      B: 'Exact (incubation 3–8 j, viande peu cuite/lait cru).',
      C: 'Exact (incubation 2–10 j, volaille/lait cru).'
    },
    courseRef: 'Cours_Epidemiologie_TIAC.pdf (Instr. 2026), p. 2–3'
  },
  {
    id: 'Q_C5_8', courseId: 'C5', lessonId: 'L5.3', topic: '5 Clés OMS & Instruction 2024',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: true,
    stem: 'Concernant la prévention des TIAC en restauration collective (Instruction N°18/2024 & OMS), cochez les propositions exactes :',
    options: [
      { key: 'A', text: 'Le principe de la marche en avant interdit qu’un circuit sale coupe un circuit propre' },
      { key: 'B', text: 'Les plats chauds doivent être maintenus à > 65 °C et les plats froids entre 2 et 4 °C' },
      { key: 'C', text: 'Les restes non consommés peuvent être réchauffés et resservis le lendemain s’ils sont réfrigérés' },
      { key: 'D', text: 'Un plat témoin (50–100 g) doit être conservé à +4 °C pendant ≥ 72 h (5 jours selon les slides)' }
    ],
    correct: ['A', 'B', 'D'],
    explanation: 'Marche en avant (A), températures > 65 °C / 2–4 °C (B) et plat témoin à +4 °C (D) sont les règles officielles de l’Instruction 2024.',
    wrongReasons: {
      C: 'Interdit ! En restauration collective, les restes doivent être systématiquement jetés.'
    },
    courseRef: 'INSTRUCTION TIAC.pdf (N°18/2024), p. 2–3 ; CAT TIAC slide 10'
  },
  {
    id: 'Q_C5_9', courseId: 'C5', lessonId: 'L5.3', topic: 'Personnel de cuisine & désinfection',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: false,
    stem: 'Selon l’Instruction N°18 (2024) relative à la restauration collective, cochez les règles exactes :',
    options: [
      { key: 'A', text: 'Le personnel de cuisine doit subir une visite médicale à l’embauche puis tous les trimestres' },
      { key: 'B', text: 'Les ustensiles utilisés pour la viande hachée sont désinfectés à l’eau javellisée 12°' },
      { key: 'C', text: 'Les aliments cuits peuvent rester 6 heures à température ambiante avant réfrigération' },
      { key: 'D', text: 'Les 5 Clés OMS incluent la séparation des aliments crus et cuits et une cuisson ≥ 70 °C' }
    ],
    correct: ['A', 'B', 'D'],
    explanation: 'Visite embauche + trimestrielle (A), javel 12° (B) et 5 Clés OMS (D) sont exactes.',
    wrongReasons: {
      C: 'Faux : ne jamais laisser un aliment cuit plus de 2 heures à température ambiante (OMS).'
    },
    courseRef: 'INSTRUCTION TIAC.pdf (N°18/2024), p. 2–3 ; CAT TIAC slides 16–19'
  },
  {
    id: 'Q_C5_10', courseId: 'C5', lessonId: 'L5.3', topic: 'Les 5 Clés OMS',
    sourceType: 'course_generated', year: 'Cours', multiSelect: false, isHard: false,
    stem: 'Laquelle des propositions suivantes NE fait PAS partie des « 5 Clés de l’OMS » pour des aliments plus sûrs ?',
    options: [
      { key: 'A', text: 'Prendre l’habitude de la propreté' },
      { key: 'B', text: 'Séparer les aliments crus des aliments cuits' },
      { key: 'C', text: 'Congeler systématiquement les repas témoins à −20 °C' },
      { key: 'D', text: 'Maintenir les aliments à bonne température et bien les cuire (≥ 70 °C)' }
    ],
    correct: ['C'],
    explanation: 'Les plats témoins se conservent à +4 °C (réfrigération, jamais congélation) et ne font pas partie de l’intitulé des 5 Clés OMS.',
    wrongReasons: {
      A: 'Clé n°1 OMS.',
      B: 'Clé n°2 OMS.',
      D: 'Clés n°3 et n°4 OMS.'
    },
    courseRef: 'CAT TIAC slides 16–19 ; Instr. 2024 p. 3'
  },

  // ==================== C6 : IAS & HYGIÈNE ====================
  {
    id: 'Q_C6_1', courseId: 'C6', lessonId: 'L6.1', topic: 'Délai ISO sur prothèse du genou (1 an)',
    sourceType: 'bm_original', bmRef: 'Ch. 10 Q14', year: '2021', multiSelect: false, isHard: true,
    bmError: { bmKey: 'C', note: 'Le corrigé BM met C (« délai 30 jours dépassé »), oubliant que le délai ISO passe à 1 AN en cas de prothèse ou d’implant (slide 6) ! La vraie réponse est A.' },
    stem: 'Un patient revient 2 mois après une intervention pour une prothèse du genou dans le cadre d’une infection sur le site de sa prothèse : (cocher la bonne réponse)',
    options: [
      { key: 'A', text: 'Il s’agit d’une infection du site opératoire' },
      { key: 'B', text: 'On ne peut pas retenir le diagnostic d’une infection associée aux soins car on n’a pas d’information concernant le germe en cause' },
      { key: 'C', text: 'On ne peut pas retenir le diagnostic d’une infection du site opératoire pour ce patient car le délai de 30 jours est dépassé' },
      { key: 'D', text: 'C’est une infection communautaire' }
    ],
    correct: ['A'],
    explanation: 'Slide 6 du cours : le délai d’une ISO est de 30 jours en chirurgie sans matériel, mais s’étend jusqu’à 1 AN en cas de mise en place d’un implant ou d’une prothèse. À 2 mois, c’est donc bien une ISO.',
    wrongReasons: {
      B: 'Le diagnostic d’ISO/IAS n’exige pas la connaissance préalable du germe.',
      C: 'Erreur classique (et erreur du corrigé BM) : 30 jours ne s’applique que sans implant/prothèse.',
      D: 'Infection directement secondaire à l’acte chirurgical prothétique.'
    },
    courseRef: 'Les infections associées aux soins — Pr Tobbi / Dr Benaldjia, slide 6'
  },
  {
    id: 'Q_C6_2', courseId: 'C6', lessonId: 'L6.1', topic: 'Définition IAS (2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 16 Q1 (= Ch. 10 Q5)', year: '2025', multiSelect: false, isHard: false,
    stem: 'L’infection associée aux soins (IAS) :',
    options: [
      { key: 'A', text: 'Survient avant 24h d’hospitalisation' },
      { key: 'B', text: 'Survient uniquement en milieu hospitalier' },
      { key: 'C', text: 'Survient avant 12h d’hospitalisation' },
      { key: 'D', text: 'Aucune réponse n’est juste' }
    ],
    correct: ['D'],
    explanation: 'Une IAS survient après un délai standard > 48 h d’hospitalisation (jamais avant 12 h ou 24 h) et englobe aussi bien l’hôpital (IN) que le milieu libéral (ILS). Donc aucune des options A, B, C n’est juste.',
    wrongReasons: {
      A: 'Faux : délai standard > 48 h.',
      B: 'Faux : inclut aussi les soins extrahospitaliers / libéraux (ILS).',
      C: 'Faux : délai standard > 48 h.'
    },
    courseRef: 'Les infections associées aux soins, slides 5–7'
  },
  {
    id: 'Q_C6_3', courseId: 'C6', lessonId: 'L6.1', topic: 'Définition complète IAS (IN + ILS)',
    sourceType: 'bm_original', bmRef: 'Ch. 10 Q21', year: 'ND', multiSelect: false, isHard: true,
    bmError: { bmKey: 'A (1-4)', note: 'Le corrigé BM omet l’item 2 (soins en milieu libéral = ILS), pourtant explicitement inclus dans les IAS (slides 5–7). La réponse complète est D (1-2-4).' },
    stem: 'L’Infection associée aux soins (IAS) :\n1) Survient au cours ou au décours d’une prise en charge\n2) Infections secondaires à des soins en milieu libéral\n3) Quel que soit l’acte thérapeutique de prévention\n4) Comprennent les infections nosocomiales\n5) Survient avant 24h d’hospitalisation',
    options: [
      { key: 'A', text: '1-4' },
      { key: 'B', text: '2-3' },
      { key: 'C', text: '2-5' },
      { key: 'D', text: '1-2-4' }
    ],
    correct: ['D'],
    explanation: 'Les IAS surviennent au cours ou au décours d’une prise en charge (1), englobent les IN hospitalières (4) ET les ILS en milieu libéral (2).',
    wrongReasons: {
      A: 'Incomplet : omet les soins en milieu libéral (item 2).',
      B: 'Omet les items 1 et 4.',
      C: 'Inclut l’item 5 qui est faux (délai > 48 h, pas avant 24 h).'
    },
    courseRef: 'Les infections associées aux soins, slides 5–7'
  },
  {
    id: 'Q_C6_4', courseId: 'C6', lessonId: 'L6.1', topic: 'Organisation CNHH/CLIN & Prévalence Algérie',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: false,
    stem: 'Concernant l’épidémiologie et l’organisation de la lutte contre les IAS en Algérie, cochez les propositions exactes :',
    options: [
      { key: 'A', text: 'L’enquête nationale algérienne de 2005 a retrouvé une prévalence des IN de 14 %' },
      { key: 'B', text: 'Le CNHH (28 mars 1998) et les CLIN (27 novembre 1998) ont été créés en 1998' },
      { key: 'C', text: 'Les précautions standard s’appliquent uniquement aux patients porteurs connus de BMR' },
      { key: 'D', text: 'Une endophtalmie survenant 3 jours après chirurgie de la cataracte avec implant fait suspecter une ISO' }
    ],
    correct: ['A', 'B', 'D'],
    explanation: 'Prévalence 14 % (A), CNHH & CLIN en 1998 (B), endophtalmie à J3 sur implant cataracte = ISO suspectée (D, conforme Ch. 10 Q13 A).',
    wrongReasons: {
      C: 'Faux : les précautions standard s’appliquent par TOUS les professionnels, pour TOUS les patients et pour TOUS les soins !'
    },
    courseRef: 'Les infections associées aux soins, slides 6, 9, 22–25'
  },
  {
    id: 'Q_C6_5', courseId: 'C6', lessonId: 'L6.2', topic: 'Pneumonies nosocomiales — 1ère cause de décès',
    sourceType: 'bm_original', bmRef: 'Ch. 16 Q2 (= Ch. 10 Q2)', year: '2025', multiSelect: false, isHard: false,
    stem: 'Les pneumonies nosocomiales constituent :',
    options: [
      { key: 'A', text: '1ère cause de décès par infection nosocomiale' },
      { key: 'B', text: '2ème cause de décès par infection nosocomiale' },
      { key: 'C', text: 'Causent rarement de décès' },
      { key: 'D', text: 'Aucune réponse n’est juste' }
    ],
    correct: ['A'],
    explanation: 'Si l’infection urinaire (IUN) est la plus fréquente, la pneumonie nosocomiale est la 1ère cause de mortalité par IN (tombé en 2024 ET en 2025).',
    wrongReasons: {
      B: 'Faux : elle est au 1er rang de mortalité.',
      C: 'Faux : mortalité très élevée, surtout en réanimation sous intubation.',
      D: 'Faux car A est exacte.'
    },
    courseRef: 'Les infections associées aux soins, slide 16'
  },
  {
    id: 'Q_C6_6', courseId: 'C6', lessonId: 'L6.2', topic: 'Germes sur cathéters (2024 & 2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 16 Q3 (= Ch. 10 Q1)', year: '2025', multiSelect: false, isHard: false,
    stem: 'Parmi les germes suivants quels sont les plus incriminés dans les infections nosocomiales sur cathéters :',
    options: [
      { key: 'A', text: 'Germes Bacilles Gram négatif' },
      { key: 'B', text: 'Staphylocoques' },
      { key: 'C', text: 'Champignons et levures' },
      { key: 'D', text: 'Aucune réponse n’est juste' }
    ],
    correct: ['B'],
    explanation: 'Les Staphylocoques représentent 50 % des IN sur cathéters, devant les BGN (10 %) et les levures.',
    wrongReasons: {
      A: 'Les BGN (60 %) sont le germe n°1 des PNEUMONIES nosocomiales (Ch. 16 Q4 A), pas des cathéters.',
      C: 'Minoritaire par rapport aux Staphylocoques.',
      D: 'Faux car B est exacte.'
    },
    courseRef: 'Les infections associées aux soins, slide 18'
  },
  {
    id: 'Q_C6_7', courseId: 'C6', lessonId: 'L6.2', topic: 'Germes des pneumonies nosocomiales (2024 & 2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 16 Q4 (= Ch. 10 Q3)', year: '2025', multiSelect: false, isHard: false,
    stem: 'Parmi les germes suivants quels sont les plus incriminés dans les Pneumonies nosocomiales :',
    options: [
      { key: 'A', text: 'Germes Bacilles Gram négatif' },
      { key: 'B', text: 'Germes Bacilles Gram positifs' },
      { key: 'C', text: 'Candida' },
      { key: 'D', text: 'Aspergillus' }
    ],
    correct: ['A'],
    explanation: 'Les Bacilles Gram Négatif (BGN) représentent 60 % des pneumonies nosocomiales (suivis par S. aureus 30 %, Candida 10 % et Aspergillus).',
    wrongReasons: {
      B: 'S. aureus est un cocci Gram+ (30 %), derrière les BGN.',
      C: '10 % seulement.',
      D: 'Plus rare (immunodéprimés).'
    },
    courseRef: 'Les infections associées aux soins, slide 16'
  },
  {
    id: 'Q_C6_8', courseId: 'C6', lessonId: 'L6.2', topic: 'Colonisation du cathéter',
    sourceType: 'bm_original', bmRef: 'Ch. 10 Q22', year: 'ND', multiSelect: false, isHard: true,
    bmError: { bmKey: 'D (1-4)', note: 'Le corrigé BM coche 1-4 (érythème), ce qui est une erreur : l’érythème est un signe local d’INFECTION, pas une colonisation ! La vraie réponse est C (1-2-3).' },
    stem: 'La colonisation du cathéter se caractérise par :\n1) Culture positive avec un taux significatif\n2) Absence des signes locaux d’infection\n3) Absence des signes généraux d’infection\n4) Présence d’érythème\n5) Aucune réponse n’est juste',
    options: [
      { key: 'A', text: '2-3' },
      { key: 'B', text: '2-4' },
      { key: 'C', text: '1-2-3' },
      { key: 'D', text: '1-4' }
    ],
    correct: ['C'],
    explanation: 'Une colonisation = culture positive au seuil significatif (1) SANS signe local (2) et SANS signe général d’infection (3).',
    wrongReasons: {
      A: 'Omet la culture positive significative (item 1).',
      B: 'Contradictoire (items 2 et 4 s’excluent mutuellement).',
      D: 'Erreur BM : l’érythème (4) signe une infection locale, plus une colonisation.'
    },
    courseRef: 'Définitions standard IAS / cathéters (complément slide 18)'
  },
  {
    id: 'Q_C6_9', courseId: 'C6', lessonId: 'L6.2', topic: 'IN la plus fréquente & bactéries/visiteurs',
    sourceType: 'bm_original', bmRef: 'Ch. 10 Q9', year: '2021', multiSelect: false, isHard: false,
    stem: 'Parmi les infections nosocomiales suivantes, quelle est la plus fréquente ? (Cocher la bonne réponse)',
    options: [
      { key: 'A', text: 'Infection urinaire' },
      { key: 'B', text: 'Infection sur brûlure' },
      { key: 'C', text: 'Bactériémie sur cathéter' },
      { key: 'D', text: 'Infection pulmonaire' }
    ],
    correct: ['A'],
    explanation: 'L’infection urinaire nosocomiale (IUN, favorisée par le sondage vésical, germe n°1 E. coli) occupe le 1er rang en fréquence.',
    wrongReasons: {
      B: 'Spécifique aux services de brûlés.',
      C: 'Moins fréquente que les IUN.',
      D: 'L’infection pulmonaire est la 1ère cause de DÉCÈS, pas la 1ère en fréquence.'
    },
    courseRef: 'Les infections associées aux soins, slide 15'
  },
  {
    id: 'Q_C6_10', courseId: 'C6', lessonId: 'L6.3', topic: 'Règles d’hygiène des mains',
    sourceType: 'bm_original', bmRef: 'Ch. 10 Q6', year: '2022', multiSelect: true, isHard: true,
    bmError: { bmKey: 'ABC', note: 'Erreur manifeste du corrigé BM (contredit Ch. 10 Q10 & Q20) : le pain de savon (B) et la serviette réutilisable (C) sont proscrits ! La vraie réponse est AD.' },
    stem: 'Pour une bonne hygiène des mains : (Cochez les réponses justes)',
    options: [
      { key: 'A', text: 'Je proscris tous les bijoux' },
      { key: 'B', text: 'J’utilise un pain de savon individuel' },
      { key: 'C', text: 'J’utilise une serviette changée tous les jours pour m’essuyer les mains' },
      { key: 'D', text: 'Je n’utilise absolument pas un appareil électrique pour me sécher les mains' }
    ],
    correct: ['A', 'D'],
    explanation: 'Proscrire tous les bijoux (A, y compris alliance lisse) et proscrire le séchoir à air chaud électrique (D, cf. Ch. 10 Q20) sont des règles strictes d’hygiène hospitalière.',
    wrongReasons: {
      B: 'Le savon en pain est un réservoir microbien proscrit (utiliser savon liquide ou SHA — Ch. 10 Q10 & Q20).',
      C: 'Les serviettes réutilisables sont proscrites (utiliser essuie-mains papier à usage unique).'
    },
    courseRef: 'Volet Hygiène des mains — cohérence BM Ch. 10 Q7, Q10 & Q20'
  },
  {
    id: 'Q_C6_11', courseId: 'C6', lessonId: 'L6.3', topic: 'Contre-indications de la SHA',
    sourceType: 'bm_original', bmRef: 'Ch. 10 Q11', year: '2021', multiSelect: true, isHard: false,
    stem: 'Parmi les propositions suivantes choisissez celles qui correspondent à des contre-indications de la friction hydro-alcoolique :',
    options: [
      { key: 'A', text: 'Les mains mouillées' },
      { key: 'B', text: 'Les mains poudrées ou talquées' },
      { key: 'C', text: 'Les mains sèches' },
      { key: 'D', text: 'Les mains visiblement souillées' }
    ],
    correct: ['A', 'B', 'D'],
    explanation: 'La SHA est contre-indiquée sur mains mouillées (A), poudrées/talquées (B) et visiblement souillées (D). Elle nécessite des mains propres et sèches.',
    wrongReasons: {
      C: 'Des mains sèches constituent au contraire la condition requise pour utiliser la SHA.'
    },
    courseRef: 'Volet Hygiène des mains / Précautions standard (BM Ch. 10 Q11 & Q18)'
  },
  {
    id: 'Q_C6_12', courseId: 'C6', lessonId: 'L6.3', topic: 'Flore résidente vs Flore transitoire',
    sourceType: 'bm_original', bmRef: 'Ch. 10 Q8', year: '2021', multiSelect: false, isHard: false,
    stem: 'Parmi les caractéristiques de la flore microbienne résidente, on retient : (cocher la bonne réponse)',
    options: [
      { key: 'A', text: 'Elle est d’acquisition récente à partir de l’environnement hospitalier lors des activités de soins' },
      { key: 'B', text: 'Elle est difficile à enlever par les gestes d’hygiène courants' },
      { key: 'C', text: 'Elle est facile à enlever par les gestes d’hygiène courants' },
      { key: 'D', text: 'Elle est toujours pathogène' }
    ],
    correct: ['B'],
    explanation: 'La flore résidente est profonde, propre à l’individu, rarement pathogène et difficile à éliminer par les gestes d’hygiène courants.',
    wrongReasons: {
      A: 'Caractéristique de la flore TRANSITOIRE.',
      C: 'Caractéristique de la flore TRANSITOIRE.',
      D: 'Faux : elle constitue au contraire un risque faible d’infections manuportées.'
    },
    courseRef: 'Volet Hygiène des mains (BM Ch. 10 Q8, Q16 & Q19)'
  },
  {
    id: 'Q_C6_13', courseId: 'C6', lessonId: 'L6.3', topic: 'Pré-requis hygiène des mains (alliance)',
    sourceType: 'bm_original', bmRef: 'Ch. 10 Q7', year: '2021', multiSelect: true, isHard: false,
    stem: 'Les règles qu’on doit respecter avant l’hygiène des mains sont appelées : pré-requis. Parmi les propositions suivantes choisir les règles correctes :',
    options: [
      { key: 'A', text: 'Les ongles doivent être courts' },
      { key: 'B', text: 'Pas de vernis à ongles' },
      { key: 'C', text: 'L’alliance lisse est autorisée' },
      { key: 'D', text: 'Pas de bijoux' }
    ],
    correct: ['A', 'B', 'D'],
    explanation: 'Les pré-requis exigent ongles courts (A), sans vernis (B) et absence totale de bijoux (D).',
    wrongReasons: {
      C: 'Piège classique ! Même l’alliance lisse est INTERDITE en milieu de soins.'
    },
    courseRef: 'Volet Hygiène des mains (BM Ch. 10 Q7)'
  }
);
