/* ==========================================================================
   Banque QCM Interactive — Partie 2 : Cours C7 à C12 (54 QCM)
   Total banque : 113 QCM interactifs couvrant les 34 leçons des 12 cours
   ========================================================================== */
window.EpiData.qcms.push(
  // ==================== C7 : SANTÉ SCOLAIRE ====================
  {
    id: 'Q_C7_1', courseId: 'C7', lessonId: 'L7.1', topic: 'Rattachement EPSP de l’équipe (2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 26 Q1', year: '2025', multiSelect: false, isHard: true, bmUnanswered: true,
    stem: 'L’équipe de santé assurant la prise en charge des enfants scolarisés, exerce au sein :',
    options: [
      { key: 'A', text: 'Des structures de santé de proximité de terrain' },
      { key: 'B', text: 'Des structures de santé privées' },
      { key: 'C', text: 'Un centre hospitalo-universitaire' },
      { key: 'D', text: 'Service de pédiatrie d’un hôpital' }
    ],
    correct: ['A'],
    explanation: 'Slide 15 : les équipes de santé scolaire (médecin, infirmier, chirurgien-dentiste, assistant médical, psychologue) sont rattachées aux EPSP, c’est-à-dire aux structures de santé de proximité de terrain.',
    wrongReasons: {
      B: 'Programme national public, pas le secteur privé.',
      C: 'Le CHU relève du 3ème recours, pas de la santé scolaire de terrain.',
      D: 'Les services hospitaliers reçoivent uniquement les cas référés.'
    },
    courseRef: 'Santé scolaire — Dr Nourani Imane, slide 15'
  },
  {
    id: 'Q_C7_2', courseId: 'C7', lessonId: 'L7.1', topic: 'Prise en charge en milieu scolaire : UDS (2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 26 Q3', year: '2025', multiSelect: false, isHard: false, bmUnanswered: true,
    stem: 'La prise en charge sanitaire des enfants scolarisés en milieu scolaire se fait au niveau :',
    options: [
      { key: 'A', text: 'Des structures de santé privées' },
      { key: 'B', text: 'De pédiatrie' },
      { key: 'C', text: 'Structures de santé de proximité' },
      { key: 'D', text: 'Des unités de dépistage et de suivi UDS' }
    ],
    correct: ['D'],
    explanation: 'En milieu scolaire (collèges et lycées), la prise en charge se fait au niveau des Unités de Dépistage et de Suivi (UDS) couvrant une circonscription (slide 15).',
    wrongReasons: {
      A: 'Faux.',
      B: 'Faux.',
      C: 'Les structures de proximité (EPSP) sont le rattachement de l’équipe (Q1) ; en milieu scolaire le local dédié est l’UDS (D).'
    },
    courseRef: 'Santé scolaire — Dr Nourani Imane, slide 15'
  },
  {
    id: 'Q_C7_3', courseId: 'C7', lessonId: 'L7.1', topic: 'Objectif principal de la santé scolaire (2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 26 Q5', year: '2025', multiSelect: false, isHard: false,
    stem: 'Quel est l’objectif principal du programme de santé scolaire ?',
    options: [
      { key: 'A', text: 'Assurer une couverture vaccinale nationale' },
      { key: 'B', text: 'Fournir aux enfants et adolescents des prestations préventives, curatives et éducatives pour un développement harmonieux' },
      { key: 'C', text: 'Réduire les dépenses en matière de santé publique' },
      { key: 'D', text: 'Promouvoir uniquement la vaccination en milieu scolaire' }
    ],
    correct: ['B'],
    explanation: 'Formulation exacte de la slide 13 : prestations préventives, curatives et éducatives visant un développement harmonieux physique, mental, intellectuel et social.',
    wrongReasons: {
      A: 'La couverture vaccinale nationale est l’objectif global du PEV, pas l’objectif unique de la santé scolaire.',
      C: 'Faux.',
      D: 'Trop restrictif (« uniquement la vaccination »).'
    },
    courseRef: 'Santé scolaire — Dr Nourani Imane, slide 13'
  },
  {
    id: 'Q_C7_4', courseId: 'C7', lessonId: 'L7.1', topic: 'Population cible & mission des UDS (2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 26 Q7', year: '2025', multiSelect: false, isHard: false,
    stem: 'Quelle est la population cible principale du programme de santé scolaire ?',
    options: [
      { key: 'A', text: 'Les enfants scolarisés et les enseignants' },
      { key: 'B', text: 'Les enfants et les personnes âgées' },
      { key: 'C', text: 'Les enseignants uniquement' },
      { key: 'D', text: 'L’ensemble des citoyens' }
    ],
    correct: ['A'],
    explanation: 'Slide 12 : la population cible regroupe les enfants scolarisés, le personnel enseignant et le personnel administratif/de service.',
    wrongReasons: {
      B: 'Les personnes âgées ne sont pas visées par la santé scolaire.',
      C: 'Omet la cible première : les élèves.',
      D: 'Programme en milieu spécifique scolaire, pas toute la population.'
    },
    courseRef: 'Santé scolaire — Dr Nourani Imane, slide 12'
  },
  {
    id: 'Q_C7_5', courseId: 'C7', lessonId: 'L7.2', topic: 'Classes cibles vaccination scolaire (2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 26 Q4', year: '2025', multiSelect: false, isHard: true, bmUnanswered: true,
    stem: 'La vaccination des élèves concernés, conformément au calendrier national de vaccination en vigueur, cible les classes de :',
    options: [
      { key: 'A', text: '1ère année primaire, 2ème année moyenne, 1ère année secondaire' },
      { key: 'B', text: '1ère année primaire, 2ème année moyenne, 3ème année secondaire' },
      { key: 'C', text: '3ème année primaire, 2ème année moyenne, 1ère année secondaire' },
      { key: 'D', text: '1ère année primaire, 1ère année moyenne, 1ère année secondaire' }
    ],
    correct: ['D'],
    explanation: 'Slides 13 et 18 : la vaccination scolaire cible la 1ère année de chaque cycle : 1ère AP, 1ère AM et 1ère AS (+ rattrapage).',
    wrongReasons: {
      A: 'Piège ! La 2ème AM est ciblée par la santé BUCCO-DENTAIRE, pas par la vaccination.',
      B: '2ème AM et 3ème AS sont fausses.',
      C: '3ème AP et 2ème AM sont fausses.'
    },
    courseRef: 'Santé scolaire — Dr Nourani Imane, slides 13 & 18'
  },
  {
    id: 'Q_C7_6', courseId: 'C7', lessonId: 'L7.2', topic: 'Évaluation de la vaccination scolaire (2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 26 Q2', year: '2025', multiSelect: false, isHard: false, bmUnanswered: true,
    stem: 'L’évaluation de l’activité de vaccination dans le cadre du programme national de santé scolaire, se fait :',
    options: [
      { key: 'A', text: 'Par combien d’élèves ont été examinés' },
      { key: 'B', text: 'Par le nombre d’élèves traités pour une ou plusieurs pathologies' },
      { key: 'C', text: 'Par le taux de couverture vaccinale par antigène' },
      { key: 'D', text: 'Par la population des classes-cibles / population scolaire totale' }
    ],
    correct: ['C'],
    explanation: 'Slides 26–27 et 33 : l’indicateur d’activité spécifique de la vaccination scolaire est le taux de couverture vaccinale par antigène (Vaccinés / Population cible).',
    wrongReasons: {
      A: 'Mesure l’activité de visite médicale / dépistage général.',
      B: 'Mesure l’activité curative.',
      D: 'Proportion démographique qui ne mesure pas la vaccination réalisée.'
    },
    courseRef: 'Santé scolaire — Dr Nourani Imane, slides 26–27 & 33'
  },
  {
    id: 'Q_C7_7', courseId: 'C7', lessonId: 'L7.2', topic: 'Élimination du trachome au Sud (2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 13 Q3', year: '2025', multiSelect: false, isHard: true,
    stem: 'Quelle maladie est ciblée par la campagne d’élimination dans les wilayas du Sud ?',
    options: [
      { key: 'A', text: 'La tuberculose miliaire de l’enfant' },
      { key: 'B', text: 'Marasme et kwashiorkor' },
      { key: 'C', text: 'Tuberculose pulmonaire, extra-pulmonaire' },
      { key: 'D', text: 'Aucune des réponses' }
    ],
    correct: ['D'],
    explanation: 'Slide 19 du cours Santé scolaire : la campagne accélérée d’élimination dans les wilayas du Sud cible le TRACHOME ! Comme il ne figure dans aucune des propositions A–C, la bonne réponse est D.',
    wrongReasons: {
      A: 'Faux (piège de classement BM dans Ch. 13).',
      B: 'Faux.',
      C: 'Faux.'
    },
    courseRef: 'Santé scolaire — Dr Nourani Imane, slide 19'
  },
  {
    id: 'Q_C7_8', courseId: 'C7', lessonId: 'L7.3', topic: 'Santé bucco-dentaire (« Stop à la carie »)',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: true,
    stem: 'Concernant le programme de santé bucco-dentaire (« Stop à la carie ») et le contrôle d’hygiène scolaire, cochez les propositions exactes :',
    options: [
      { key: 'A', text: 'Les classes cibles bucco-dentaires sont : Préscolaire, 1ère AP, 4ème AP, 2ème AM et 1ère AS' },
      { key: 'B', text: 'La polyclinique de l’EPSP réserve au moins 2 après-midi par semaine aux élèves' },
      { key: 'C', text: 'Les travailleurs des cantines scolaires subissent des examens médicaux au moins 2 fois par an' },
      { key: 'D', text: 'Les rapports d’évaluation des SEMEP/EPSP sont transmis uniquement une fois par an en fin d’année' }
    ],
    correct: ['A', 'B', 'C'],
    explanation: 'Classes bucco-dentaires (A), créneaux EPSP ≥ 2 après-midi/semaine (B) et cantines ≥ 2 visites/an (C) sont conformes aux slides 20–22.',
    wrongReasons: {
      D: 'Faux : les rapports sont TRIMESTRIELS (transmis aux directeurs d’établissements et à la DSP).'
    },
    courseRef: 'Santé scolaire — Dr Nourani Imane, slides 20–27'
  },
  {
    id: 'Q_C7_9', courseId: 'C7', lessonId: 'L7.3', topic: 'Indices carieux cao vs CAO',
    sourceType: 'course_generated', year: 'Cours', multiSelect: false, isHard: false,
    stem: 'Dans les supports d’évaluation bucco-dentaire scolaire, que mesure l’indice « CAO » (en majuscules) ?',
    options: [
      { key: 'A', text: 'Les dents temporaires (de lait) cariées, absentes ou obturées' },
      { key: 'B', text: 'Les dents permanentes de 6 ans cariées, absentes ou obturées' },
      { key: 'C', text: 'Le taux de couverture vaccinale antitétanique' },
      { key: 'D', text: 'Le pourcentage de cantines conformes' }
    ],
    correct: ['B'],
    explanation: 'Par convention dentaire du cours (slides 34–36), « cao » (minuscules) concerne les dents temporaires et « CAO » (majuscules) les dents permanentes de 6 ans.',
    wrongReasons: {
      A: 'Correspond à « cao » en minuscules.',
      C: 'Sans rapport.',
      D: 'Sans rapport.'
    },
    courseRef: 'Santé scolaire — Dr Nourani Imane, slides 34–36'
  },
  {
    id: 'Q_C7_10', courseId: 'C7', lessonId: 'L7.3', topic: 'Équipe UDS & Comité de wilaya',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: false,
    stem: 'Parmi les affirmations suivantes sur l’organisation de la santé scolaire, lesquelles sont exactes ?',
    options: [
      { key: 'A', text: 'L’équipe complète d’une UDS comprend médecin, infirmier, chirurgien-dentiste, assistant médical et psychologue' },
      { key: 'B', text: 'Les UDS sont implantées au niveau des collèges et lycées' },
      { key: 'C', text: 'Le Comité de wilaya se réunit au début de l’année scolaire et chaque trimestre' },
      { key: 'D', text: 'Les écoles privées agréées sont exclues du programme de dépistage systématique' }
    ],
    correct: ['A', 'B', 'C'],
    explanation: 'Équipe de 5 profils (A), implantation collèges/lycées (B) et réunions du Comité de wilaya (C) sont exactes.',
    wrongReasons: {
      D: 'Faux : le dépistage concerne les établissements publics ET privés agréés.'
    },
    courseRef: 'Santé scolaire — Dr Nourani Imane, slides 15–27'
  },

  // ==================== C8 : CERTIFICATION CMD (100 % cours — 0 BM) ====================
  {
    id: 'Q_C8_1', courseId: 'C8', lessonId: 'L8.1', topic: 'Décret 22-178, exemplaire unique & volets',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: true,
    stem: 'Selon le Décret exécutif n° 22-178 du 28 avril 2022 relatif au Certificat Médical de Décès (CMD), cochez les propositions exactes :',
    options: [
      { key: 'A', text: 'Le CMD peut être établi par tout médecin autorisé à exercer (public, privé/libéral, militaire ou sûreté nationale)' },
      { key: 'B', text: 'Il est délivré en deux exemplaires originaux : un pour l’APC et un pour l’INSP' },
      { key: 'C', text: 'Sa partie supérieure est nominative (volet administratif) et sa partie inférieure est anonyme (volet médical immédiatement scellé par le médecin)' },
      { key: 'D', text: 'Le délai de déclaration à l’APC est de 24 heures, porté à 20 jours dans les wilayas du Sud' }
    ],
    correct: ['A', 'C', 'D'],
    explanation: 'Articles 2 et 5 du Décret 22-178 + délais réglementaires (24 h / 20 j Sud).',
    wrongReasons: {
      B: 'Piège Art. 4 ! Le CMD est délivré en UN SEUL EXEMPLAIRE.'
    },
    courseRef: 'CMD — Décret 22-178 (Art. 2, 4, 5) & modele de cmd et circuit.pptx'
  },
  {
    id: 'Q_C8_2', courseId: 'C8', lessonId: 'L8.1', topic: 'Circuit du volet médical & signalements',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: false,
    stem: 'Concernant le circuit administratif et le formulaire du CMD en Algérie, cochez les propositions exactes :',
    options: [
      { key: 'A', text: 'Le circuit du volet médical suit l’ordre : Médecin → Famille → APC → DSP (SEMEP) → INSP' },
      { key: 'B', text: 'La transmission du volet inférieur par l’APC vers la DSP s’effectue mensuellement avec bordereau' },
      { key: 'C', text: 'Le médecin doit signaler la présence d’une prothèse fonctionnant avec pile ou le besoin de mise en cercueil hermétique' },
      { key: 'D', text: 'Le Décret 22-178 a remplacé la loi sanitaire de 1985 uniquement' }
    ],
    correct: ['A', 'B', 'C'],
    explanation: 'Circuit mensuel APC → DSP (SEMEP) → INSP (A, B) et les 3 signalements particuliers dont prothèse à pile et cercueil hermétique (C) sont exacts.',
    wrongReasons: {
      D: 'Le Décret 22-178 (28/04/2022) abroge précisément le décret exécutif n° 16-80 du 24/02/2016.'
    },
    courseRef: 'modele de cmd et circuit.pptx, slides 4–14 ; Formulaire CMD'
  },
  {
    id: 'Q_C8_3', courseId: 'C8', lessonId: 'L8.1', topic: 'Rôle du SEMEP et de l’INSP',
    sourceType: 'course_generated', year: 'Cours', multiSelect: false, isHard: false,
    stem: 'Dans le circuit national des causes médicales de décès, quel organisme assure la codification CIM-10 finale, l’exploitation statistique et l’archivage national ?',
    options: [
      { key: 'A', text: 'L’officier d’état civil de l’APC' },
      { key: 'B', text: 'Le service des causes de décès de l’INSP' },
      { key: 'C', text: 'La CNAS' },
      { key: 'D', text: 'Le Bureau d’Hygiène Communale (BHC)' }
    ],
    correct: ['B'],
    explanation: 'L’APC conserve le volet nominatif ; le SEMEP/DSP récupère mensuellement les volets médicaux et contrôle leur qualité ; l’INSP assure l’exploitation, la codification CIM-10 et l’archivage.',
    wrongReasons: {
      A: 'Volet administratif uniquement.',
      C: 'Caisse de sécurité sociale, hors circuit CMD.',
      D: 'Intervient sur l’hygiène/TIAC, pas la codification CMD.'
    },
    courseRef: 'modele de cmd et circuit.pptx, slides 10–15'
  },
  {
    id: 'Q_C8_4', courseId: 'C8', lessonId: 'L8.2', topic: 'Cas clinique Partie I vs II & piège ACR',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: true,
    stem: 'Un patient alcoolique suivi pour hépatite B chronique → cirrhose → hypertension portale décède d’un arrêt cardio-respiratoire (ACR) sur rupture de varices œsophagiennes. Comment remplir le CMD ?',
    options: [
      { key: 'A', text: 'Inscrire « Arrêt cardio-respiratoire » sur la dernière ligne de la Partie I comme cause initiale' },
      { key: 'B', text: 'Inscrire « Hémorragie par rupture de varices œsophagiennes » sur la ligne a) (cause directe) de la Partie I' },
      { key: 'C', text: 'Inscrire « Hépatite virale B chronique » sur la ligne la plus basse remplie (d) comme cause initiale' },
      { key: 'D', text: 'Inscrire « Alcoolisme chronique » en Partie II (comorbidité contributive)' }
    ],
    correct: ['B', 'C', 'D'],
    explanation: 'La Partie I se lit de haut en bas : a) cause directe (hémorragie VO, B) ← b) HTP ← c) cirrhose ← d) cause initiale (hépatite B, C — retenue pour stats OMS). Les comorbidités sans lien causal direct vont en Partie II (D).',
    wrongReasons: {
      A: 'Interdiction absolue ! L’ACR est un mode de décès, JAMAIS une cause initiale.'
    },
    courseRef: 'Certification-de-la-Cause-Medicale-de-Deces2(3).pptx, slides 10–20'
  },
  {
    id: 'Q_C8_5', courseId: 'C8', lessonId: 'L8.2', topic: 'Mort violente (Art. 6.2) & Partie III',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: true,
    stem: 'Devant un décès par mort violente, suspecte ou de cause indéterminée (Art. 6.2 du Décret 22-178), cochez les propositions exactes :',
    options: [
      { key: 'A', text: 'Le médecin constatant remplit uniquement la partie supérieure (volet administratif) et avise les autorités' },
      { key: 'B', text: 'La Partie III du volet médical est réservée exclusivement au médecin légiste' },
      { key: 'C', text: 'Le médecin constatant doit quand même remplir les Parties I et II et sceller le certificat' },
      { key: 'D', text: 'Le certificat doit être rédigé lisiblement en majuscules et sans aucune abréviation' }
    ],
    correct: ['A', 'B', 'D'],
    explanation: 'En cas de mort violente/suspecte (Art. 6.2), le médecin constatant remplit uniquement la partie supérieure (A) et le médecin légiste remplit la Partie III (B). Rédaction toujours en majuscules sans abréviation (D).',
    wrongReasons: {
      C: 'Faux : remplir Parties I et II concerne exclusivement la mort naturelle (Art. 6.1).'
    },
    courseRef: 'Republique-Algerienne…pptx (Art. 6) ; modele de cmd et circuit.pptx'
  },
  {
    id: 'Q_C8_6', courseId: 'C8', lessonId: 'L8.2', topic: 'Cause retenue pour les statistiques OMS',
    sourceType: 'course_generated', year: 'Cours', multiSelect: false, isHard: false,
    stem: 'Pour l’établissement des statistiques mondiales de mortalité (OMS), quelle cause du CMD est retenue ?',
    options: [
      { key: 'A', text: 'La cause directe (ligne a de la Partie I)' },
      { key: 'B', text: 'La cause initiale (dernière ligne remplie de la Partie I)' },
      { key: 'C', text: 'La comorbidité inscrite en Partie II' },
      { key: 'D', text: 'Le mode de décès (arrêt cardio-respiratoire)' }
    ],
    correct: ['B'],
    explanation: 'L’OMS sélectionne la cause initiale (maladie ou traumatisme ayant déclenché la séquence morbide), afin d’orienter la prévention à la racine.',
    wrongReasons: {
      A: 'La cause directe est la complication finale, pas la cause statistique OMS.',
      C: 'La Partie II regroupe les états contributifs secondaires.',
      D: 'L’ACR est proscrit comme cause de décès.'
    },
    courseRef: 'Certification-de-la-Cause-Medicale-de-Deces2(3).pptx, slides 10–14'
  },
  {
    id: 'Q_C8_7', courseId: 'C8', lessonId: 'L8.3', topic: 'Les 4 groupes CIM-10 EXCLUS comme cause initiale',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: true,
    stem: 'Parmi les catégories CIM-10 suivantes, lesquelles sont FORMELLEMENT EXCLUES comme cause initiale de décès ?',
    options: [
      { key: 'A', text: 'B95–B97 (agents bactériens et viraux isolés)' },
      { key: 'B', text: 'O80–O84 (accouchement normal/simple)' },
      { key: 'C', text: 'S00–T98 (lésions traumatiques seules sans cause externe)' },
      { key: 'D', text: 'G97, H95, N99 (affections post-actes médicaux ou chirurgicaux)' },
      { key: 'E', text: 'C97 (tumeurs malignes de sièges primitifs multiples indépendants en Partie I)' }
    ],
    correct: ['A', 'B', 'C', 'D'],
    explanation: 'A, B, C et D constituent exactement les 4 groupes CIM-10 exclus comme cause initiale (pour un traumatisme, il faut coder la cause externe ex. AVP !).',
    wrongReasons: {
      E: 'C97 est au contraire un code valide utilisé lorsque 2 tumeurs primitives indépendantes figurent en Partie I.'
    },
    courseRef: 'Certification-de-la-Cause-Medicale-de-Deces2(3).pptx, slides 24–33'
  },
  {
    id: 'Q_C8_8', courseId: 'C8', lessonId: 'L8.3', topic: 'Règles tumeurs (C97, C34) & Décès maternel',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: true,
    stem: 'À propos des règles particulières de certification (tumeurs et décès maternel), cochez les propositions exactes :',
    options: [
      { key: 'A', text: 'Deux tumeurs primitives indépendantes toutes deux en Partie I se codent en C97' },
      { key: 'B', text: 'Si une tumeur primitive est en Partie I et une seconde en Partie II, on code aussi en C97' },
      { key: 'C', text: 'Une lésion pulmonaire (C34) associée à une autre tumeur est présumée métastatique, mais un « cancer bronchique » est considéré comme tumeur primitive' },
      { key: 'D', text: 'Un décès maternel couvre la grossesse, l’accouchement/avortement et les 42 jours suivant la fin de la gestation' }
    ],
    correct: ['A', 'C', 'D'],
    explanation: 'Règles exactes du cours : C97 si 2 primitives en Partie I (A), distinction C34 métastase vs cancer bronchique primitif (C), délai 42 jours pour décès maternel (D).',
    wrongReasons: {
      B: 'Piège du cours ! Si la 2ème tumeur est en Partie II, on IGNORE la Partie II pour le codage C97.'
    },
    courseRef: 'Certification-de-la-Cause-Medicale-de-Deces2(3).pptx, slides 28–36'
  },
  {
    id: 'Q_C8_9', courseId: 'C8', lessonId: 'L8.3', topic: 'Cause externe d’un traumatisme (AVP)',
    sourceType: 'course_generated', year: 'Cours', multiSelect: false, isHard: false,
    stem: 'Un piéton décède d’une hémorragie intracrânienne suite à un traumatisme crânien lors d’un accident de la voie publique (AVP). Quelle est la cause initiale à coder en CIM-10 ?',
    options: [
      { key: 'A', text: 'L’hémorragie intracrânienne' },
      { key: 'B', text: 'Le traumatisme crânien (code S00–T98)' },
      { key: 'C', text: 'La cause externe : l’accident de la voie publique (AVP)' },
      { key: 'D', text: 'L’arrêt cardio-respiratoire' }
    ],
    correct: ['C'],
    explanation: 'Les lésions traumatiques (S00–T98) étant exclues comme cause initiale, la codification retient toujours la CAUSE EXTERNE (ici l’AVP).',
    wrongReasons: {
      A: 'Cause directe/intermédiaire.',
      B: 'Groupe S00–T98 formellement exclu comme cause initiale.',
      D: 'Mode de décès proscrit.'
    },
    courseRef: 'Certification-de-la-Cause-Medicale-de-Deces2(3).pptx, slides 24–27'
  },

  // ==================== C9 : FINANCEMENT ====================
  {
    id: 'Q_C9_1', courseId: 'C9', lessonId: 'L9.1', topic: 'Financement de la sécurité sociale en Algérie',
    sourceType: 'bm_original', bmRef: 'Ch. 15 Q1', year: '2023', multiSelect: true, isHard: true, bmUnanswered: true,
    stem: 'Le financement du système de la sécurité sociale en Algérie est assuré par : (cocher la ou les réponses justes)',
    options: [
      { key: 'A', text: 'Les cotisations à la charge des employeurs et des travailleurs' },
      { key: 'B', text: 'Les taxes et des prélèvements effectués sur des produits à partir de la fiscalité' },
      { key: 'C', text: 'Dépenses totales de santé des ménages' },
      { key: 'D', text: 'Par les biens achetés et consommés par les ménages' }
    ],
    correct: ['A'],
    explanation: 'Slide 10 : le financement propre de la sécurité sociale (CNAS/CASNOS) provient des cotisations obligatoires à la charge des employeurs et des travailleurs. (Attention : Ch. 40 Q1 qui demande le financement du « système de santé » global inclut aussi fiscalité et ménages).',
    wrongReasons: {
      B: 'La fiscalité alimente le budget général de l’État (financement public).',
      C: 'Correspond au financement privé direct par les ménages.',
      D: 'Définit la consommation médicale, pas les recettes de la sécurité sociale.'
    },
    courseRef: 'Financement du système de santé, slides 7–11'
  },
  {
    id: 'Q_C9_2', courseId: 'C9', lessonId: 'L9.1', topic: 'Coût d’investissement d’un projet sanitaire',
    sourceType: 'bm_original', bmRef: 'Ch. 15 Q3', year: '2022', multiSelect: false, isHard: false,
    stem: 'Le coût d’investissement est le coût en capital d’un projet sanitaire, il regroupe généralement : (choisir la bonne réponse)',
    options: [
      { key: 'A', text: 'Les coûts de terrains, des bâtiments, des équipements lourds et semi-lourds' },
      { key: 'B', text: 'Les coûts nécessaires à l’exploitation de l’investissement' },
      { key: 'C', text: 'Les coûts des petites réparations' },
      { key: 'D', text: 'Ce sont des coûts répétitifs' }
    ],
    correct: ['A'],
    explanation: 'Le coût d’investissement (en capital) comprend les terrains, constructions/bâtiments et équipements lourds ou semi-lourds.',
    wrongReasons: {
      B: 'Définit le coût de fonctionnement.',
      C: 'Relève du coût de fonctionnement.',
      D: 'Les coûts répétitifs sont des coûts de fonctionnement (l’investissement est non répétitif).'
    },
    courseRef: 'BM Ch. 15 Q3 (2022) — Financement / gestion de projet'
  },
  {
    id: 'Q_C9_3', courseId: 'C9', lessonId: 'L9.1', topic: 'CNAS / CASNOS & Ticket modérateur',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: false,
    stem: 'Concernant la sécurité sociale et le financement en Algérie, cochez les propositions exactes :',
    options: [
      { key: 'A', text: 'La CNAS couvre les travailleurs salariés et la CASNOS couvre les travailleurs non-salariés' },
      { key: 'B', text: 'Le taux standard de remboursement des médicaments est de 80 % (ticket modérateur = 20 %), porté à 100 % pour les maladies chroniques' },
      { key: 'C', text: 'La contribution symbolique des ménages représente 45 % du budget de fonctionnement des hôpitaux publics' },
      { key: 'D', text: 'L’assurance-maladie algérienne couvre 5 risques : maladie, maternité, invalidité, AT et MP' }
    ],
    correct: ['A', 'B', 'D'],
    explanation: 'CNAS/CASNOS (A), règle 80 % / 20 % / 100 % (B) et 5 risques couverts (D) sont exacts.',
    wrongReasons: {
      C: 'Faux : la contribution des ménages aux établissements publics est symbolique : 1,20 % seulement (depuis 1974 / arrêté 1995).'
    },
    courseRef: 'Financement du système de santé, slides 8–11'
  },
  {
    id: 'Q_C9_4', courseId: 'C9', lessonId: 'L9.2', topic: 'Critère d’équité (2× en BM)',
    sourceType: 'bm_original', bmRef: 'Ch. 15 Q2 (= Q4)', year: '2022', multiSelect: false, isHard: false,
    stem: 'L’équité est un critère d’évaluation d’un système de financement de la santé qui permet d’apprécier : (choisir la bonne réponse)',
    options: [
      { key: 'A', text: 'L’accès aux soins' },
      { key: 'B', text: 'La continuité des services prodigués par un système de santé' },
      { key: 'C', text: 'L’efficacité d’un système de financement de la santé' },
      { key: 'D', text: 'Les objectifs d’un système de financement de la santé' }
    ],
    correct: ['A'],
    explanation: 'Slide 18 : l’équité évalue l’accès financier aux soins pour l’ensemble de la population (tombé à l’identique en 2021 et 2022).',
    wrongReasons: {
      B: 'La continuité des services définit le critère de PÉRENNITÉ.',
      C: 'L’efficacité est un critère distinct de l’équité.',
      D: 'Formulation vague non spécifique.'
    },
    courseRef: 'Financement du système de santé, slide 18'
  },
  {
    id: 'Q_C9_5', courseId: 'C9', lessonId: 'L9.2', topic: 'Financement privé : avantages & limites',
    sourceType: 'bm_original', bmRef: 'Ch. 15 Q5', year: 'ND', multiSelect: false, isHard: true,
    stem: 'Le financement privé des dépenses de santé permet de :',
    options: [
      { key: 'A', text: 'Assurer l’équité dans l’accès aux soins' },
      { key: 'B', text: 'Fournir d’autres ressources à la santé' },
      { key: 'C', text: 'Ne permet pas d’éviter le gaspillage' },
      { key: 'D', text: 'Permet la pérennité des services de santé' }
    ],
    correct: ['B'],
    explanation: 'Le financement privé allège l’État, fournit des ressources additionnelles à la santé (B) et évite le gaspillage.',
    wrongReasons: {
      A: 'Faux : son défaut majeur est au contraire l’inéquité et l’exclusion des pauvres.',
      C: 'Piège de négation : selon le cours, le privé PERMET d’éviter le gaspillage !',
      D: 'La pérennité repose surtout sur les financements collectifs/publics.'
    },
    courseRef: 'Financement du système de santé, slides 9 & 18–19'
  },
  {
    id: 'Q_C9_6', courseId: 'C9', lessonId: 'L9.2', topic: 'Matrice Public / Sécu / Privé',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: false,
    stem: 'Selon la matrice d’évaluation du cours (slides 18–19), cochez les propositions exactes :',
    options: [
      { key: 'A', text: 'Le financement public assure l’équité mais n’est pas entièrement efficace (lourdeurs bureaucratiques)' },
      { key: 'B', text: 'La sécurité sociale assure l’équité et est efficace si un contrôle rigoureux existe' },
      { key: 'C', text: 'La pérennité apprécie la continuité des services dans le temps' },
      { key: 'D', text: 'Le financement privé assure à la fois l’équité et l’efficacité' }
    ],
    correct: ['A', 'B', 'C'],
    explanation: 'Public = équitable mais bureaucratique (A) ; Sécu = équitable et efficace si contrôlée (B) ; Pérennité = continuité (C).',
    wrongReasons: {
      D: 'Faux : le privé n’assure PAS l’équité (exclusion financière des pauvres).'
    },
    courseRef: 'Financement du système de santé, slides 18–19'
  },
  {
    id: 'Q_C9_7', courseId: 'C9', lessonId: 'L9.3', topic: 'Niveaux Macro, Méso et Micro-économique',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: true,
    stem: 'Concernant les 3 niveaux d’analyse économique du financement (slides 13–17), cochez les propositions exactes :',
    options: [
      { key: 'A', text: 'L’analyse du ratio Dépenses Nationales de Santé / PIB (DNS/PIB) relève du niveau macro-économique' },
      { key: 'B', text: 'Au niveau méso-économique, les dépenses de personnel représentent environ 80 % du budget d’un établissement' },
      { key: 'C', text: 'L’analyse de la gestion d’un CHU ou du coût d’un GHM relève du niveau micro-économique' },
      { key: 'D', text: 'En Algérie, le ratio DNS/PIB atteignait 7,23 % en 2018 (contre 4,57 % en 1993)' }
    ],
    correct: ['A', 'B', 'C', 'D'],
    explanation: 'Les 4 items correspondent exactement aux définitions et chiffres des slides 13–17 et 21 du cours.',
    wrongReasons: {},
    courseRef: 'Financement du système de santé, slides 13–17 & 21'
  },
  {
    id: 'Q_C9_8', courseId: 'C9', lessonId: 'L9.3', topic: 'Distinction Méso vs Micro',
    sourceType: 'course_generated', year: 'Cours', multiSelect: false, isHard: false,
    stem: 'L’étude de la consommation pharmaceutique ou du coût précis d’une intervention chirurgicale dans un CHU relève du niveau :',
    options: [
      { key: 'A', text: 'Macro-économique' },
      { key: 'B', text: 'Méso-économique' },
      { key: 'C', text: 'Micro-économique' },
      { key: 'D', text: 'Externe / international' }
    ],
    correct: ['C'],
    explanation: 'Le niveau micro-économique étudie une unité de soins précise (un CHU, un service, un acte/GHM, la consommation de médicaments).',
    wrongReasons: {
      A: 'Macro = échelle nationale/régionale (DNS/PIB).',
      B: 'Méso = échelle globale du secteur de la santé (structure budgétaire sectorielle).',
      D: 'Faux.'
    },
    courseRef: 'Financement du système de santé, slides 16–17'
  },
  {
    id: 'Q_C9_9', courseId: 'C9', lessonId: 'L9.3', topic: 'Problématique de financement & DNS/PIB',
    sourceType: 'course_generated', year: 'Cours', multiSelect: false, isHard: false,
    stem: 'Quelle est la problématique économique fondamentale à l’origine de l’étude du financement des systèmes de santé ?',
    options: [
      { key: 'A', text: 'Des ressources illimitées face à une demande décroissante' },
      { key: 'B', text: 'La rareté des ressources face à la croissance continue des dépenses de santé' },
      { key: 'C', text: 'L’absence de dépenses de personnel dans les hôpitaux publics' },
      { key: 'D', text: 'La gratuité absolue du secteur privé' }
    ],
    correct: ['B'],
    explanation: 'Toute l’économie de la santé repose sur la rareté des ressources limitées face à une demande et des dépenses en croissance constante, imposant une meilleure allocation.',
    wrongReasons: {
      A: 'Exact inverse (ressources limitées, dépenses croissantes).',
      C: 'Les dépenses de personnel représentent au contraire ~80 % du budget !',
      D: 'Faux.'
    },
    courseRef: 'Financement du système de santé, slides 2–3'
  },

  // ==================== C10 : QUESTIONNAIRE ====================
  {
    id: 'Q_C10_1', courseId: 'C10', lessonId: 'L10.1', topic: 'Place du questionnaire (2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 34 Q1', year: '2025', multiSelect: false, isHard: false,
    stem: 'Dans une étude épidémiologique le questionnaire est :',
    options: [
      { key: 'A', text: 'Fait à la fin du protocole' },
      { key: 'B', text: 'Élaboré dans la phase de planification' },
      { key: 'C', text: 'Est détaillé dans la partie « Discussion »' },
      { key: 'D', text: 'Ne répond pas à l’objectif de l’étude' }
    ],
    correct: ['B'],
    explanation: 'Page 1 du cours de Dr Chiboub : le questionnaire est élaboré durant la phase de planification de l’étude (tombé en 2024 ET 2025).',
    wrongReasons: {
      A: 'Jamais à la fin : il doit être prêt et pré-testé avant la collecte.',
      C: 'Il est décrit dans Matériel et Méthodes, pas dans Discussion.',
      D: 'L’objectif de l’étude guide directement la rédaction du questionnaire.'
    },
    courseRef: 'Élaboration du questionnaire d’une étude — Dr Chiboub B., p. 1'
  },
  {
    id: 'Q_C10_2', courseId: 'C10', lessonId: 'L10.1', topic: 'Place du questionnaire (2024)',
    sourceType: 'bm_original', bmRef: 'Ch. 9 Q1', year: '2024', multiSelect: false, isHard: false,
    stem: 'Dans une étude épidémiologique le questionnaire est :',
    options: [
      { key: 'A', text: 'Fait à la fin du travail' },
      { key: 'B', text: 'Élaboré dans la phase de planification' },
      { key: 'C', text: 'Ne répond pas à l’objectif de l’étude' },
      { key: 'D', text: 'Explique la problématique du sujet' }
    ],
    correct: ['B'],
    explanation: 'Doublon quasi-identique de Ch. 34 Q1 (2025) : élaboré dans la phase de planification.',
    wrongReasons: {
      A: 'Faux.',
      C: 'Faux : l’étape 1 consiste justement à définir l’objectif.',
      D: 'La problématique relève de l’introduction du protocole, pas du questionnaire.'
    },
    courseRef: 'Élaboration du questionnaire d’une étude — Dr Chiboub B., p. 1'
  },
  {
    id: 'Q_C10_3', courseId: 'C10', lessonId: 'L10.1', topic: 'Titre, structure & 7 étapes',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: true,
    stem: 'Concernant la présentation et la structuration d’un questionnaire (Dr Chiboub), cochez les propositions exactes :',
    options: [
      { key: 'A', text: 'Il est conseillé d’éviter le mot « Questionnaire » dans le titre car il est jugé péjoratif' },
      { key: 'B', text: 'Les questions sont classées par thème en allant du général au spécifique' },
      { key: 'C', text: 'On commence par des questions simples pour mettre le répondant en confiance' },
      { key: 'D', text: 'Le questionnaire est une technique de collecte de données non quantifiables' }
    ],
    correct: ['A', 'B', 'C'],
    explanation: 'Titre sans « Questionnaire » (A), structure thématique général → spécifique (B) et début par questions simples (C) sont des règles exactes de la p. 1.',
    wrongReasons: {
      D: 'Faux : le questionnaire collecte des données QUANTIFIABLES.'
    },
    courseRef: 'Élaboration du questionnaire d’une étude — Dr Chiboub B., p. 1'
  },
  {
    id: 'Q_C10_4', courseId: 'C10', lessonId: 'L10.2', topic: 'Types de questions & seuils',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: true,
    stem: 'Concernant les types de questions dans un questionnaire (Dr Chiboub), cochez les propositions exactes :',
    options: [
      { key: 'A', text: 'Pour une question fermée ordonnée (classement hiérarchique), on ne doit pas dépasser 3 propositions' },
      { key: 'B', text: 'Les questions ouvertes sont à éviter autant que possible car leur dépouillement est plus long' },
      { key: 'C', text: 'Lors du dépouillement (Étape 7), les questions ouvertes doivent être codifiées' },
      { key: 'D', text: 'Les questions fermées à choix multiples n’influencent jamais les réponses' }
    ],
    correct: ['A', 'B', 'C'],
    explanation: 'Classement ≤ 3 propositions (A), éviter les ouvertes (B) et codifier les ouvertes au dépouillement (C) figurent p. 1–2.',
    wrongReasons: {
      D: 'Faux : le cours mentionne précisément que les QCM peuvent influencer les réponses (et présenter une liste trop longue).'
    },
    courseRef: 'Élaboration du questionnaire d’une étude — Dr Chiboub B., p. 1–2'
  },
  {
    id: 'Q_C10_5', courseId: 'C10', lessonId: 'L10.2', topic: 'Pré-test (4 buts) & E-mailing',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: true,
    stem: 'Concernant le pré-test (Étape 5) et les modes d’administration (Étape 6), cochez les propositions exactes :',
    options: [
      { key: 'A', text: 'Le pré-test vérifie la conception des questions, l’adaptation des modalités, les oublis éventuels et le temps réel de passation' },
      { key: 'B', text: 'L’administration par courriel (e-mailing) est rapide mais peu efficace (environ 5 % de retour)' },
      { key: 'C', text: 'L’administration en face à face permet un contact direct et l’observation des réactions' },
      { key: 'D', text: 'Le pré-test est facultatif lorsque le questionnaire comporte moins de 20 questions' }
    ],
    correct: ['A', 'B', 'C'],
    explanation: 'Les 4 vérifications du pré-test (A), le faible taux de retour de l’e-mailing ~5 % (B) et les avantages du face à face (C) sont exacts.',
    wrongReasons: {
      D: 'Faux : le pré-test est une étape systématique et obligatoire (Étape 5).'
    },
    courseRef: 'Élaboration du questionnaire d’une étude — Dr Chiboub B., p. 2'
  },
  {
    id: 'Q_C10_6', courseId: 'C10', lessonId: 'L10.2', topic: 'Ordre des étapes : Pré-test',
    sourceType: 'course_generated', year: 'Cours', multiSelect: false, isHard: false,
    stem: 'À quel moment intervient le pré-test dans les 7 étapes d’élaboration d’un questionnaire ?',
    options: [
      { key: 'A', text: 'Après le dépouillement statistique final' },
      { key: 'B', text: 'Juste avant l’administration finale (Étape 5 sur 7)' },
      { key: 'C', text: 'Avant même de définir les objectifs de l’étude' },
      { key: 'D', text: 'Uniquement pour les questionnaires par courriel' }
    ],
    correct: ['B'],
    explanation: 'Le pré-test est l’Étape 5 : après choix des modalités (Étape 4) et avant l’administration sur le terrain (Étape 6).',
    wrongReasons: {
      A: 'Trop tard, les données seraient déjà collectées.',
      C: 'L’Étape 1 est toujours la définition des objectifs.',
      D: 'Il s’applique à tous les modes d’administration.'
    },
    courseRef: 'Élaboration du questionnaire d’une étude — Dr Chiboub B., p. 2'
  },

  // ==================== C11 : STATISTIQUE DESCRIPTIVE ====================
  {
    id: 'Q_C11_1', courseId: 'C11', lessonId: 'L11.1', topic: 'Graphique stades d’une affection chronique (2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 37 Q1', year: '2025', multiSelect: true, isHard: false,
    stem: 'Quel est le ou (les) graphique(s), le ou (les) plus adapté(s) pour représenter la fréquence des stades d’une affection chronique :',
    options: [
      { key: 'A', text: 'Diagramme à barres' },
      { key: 'B', text: 'Polygone de fréquence' },
      { key: 'C', text: 'Histogramme' },
      { key: 'D', text: 'Diagramme circulaire' }
    ],
    correct: ['A', 'D'],
    explanation: 'Les stades d’une affection chronique forment une variable qualitative ordinale → diagramme en barres (A) et diagramme circulaire (D).',
    wrongReasons: {
      B: 'Polygone de fréquence = variable quantitative continue.',
      C: 'Histogramme = variable quantitative continue.'
    },
    courseRef: 'Statistique descriptive 2026 — Pr Benaldjia, slides 4 & 24–35'
  },
  {
    id: 'Q_C11_2', courseId: 'C11', lessonId: 'L11.1', topic: 'Graphique poids (2024 ×2)',
    sourceType: 'bm_original', bmRef: 'Ch. 37 Q7 (= Q6)', year: '2024', multiSelect: false, isHard: false,
    stem: 'Quel est le graphique le plus adapté pour représenter le poids d’une série de 1000 individus :',
    options: [
      { key: 'A', text: 'Histogramme' },
      { key: 'B', text: 'Diagramme circulaire' },
      { key: 'C', text: 'Diagramme à barres' },
      { key: 'D', text: 'Diagramme à bâtonnets' }
    ],
    correct: ['A'],
    explanation: 'Le poids est une variable quantitative continue → représentée par un histogramme (barres juxtaposées).',
    wrongReasons: {
      B: 'Réservé aux variables qualitatives.',
      C: 'Réservé aux variables qualitatives.',
      D: 'Réservé aux variables quantitatives discrètes (ex. nombre de rappels).'
    },
    courseRef: 'Statistique descriptive 2026 — Pr Benaldjia, slide 32'
  },
  {
    id: 'Q_C11_3', courseId: 'C11', lessonId: 'L11.1', topic: 'Caractéristiques de l’histogramme',
    sourceType: 'bm_original', bmRef: 'Ch. 37 Q8', year: '2022', multiSelect: true, isHard: false, bmUnanswered: true,
    stem: 'Dans la représentation graphique des données, l’histogramme : (cocher les réponses justes)',
    options: [
      { key: 'A', text: 'Est une représentation graphique des distributions d’un caractère qualitatif' },
      { key: 'B', text: 'Est une représentation graphique des distributions d’un caractère quantitatif continu' },
      { key: 'C', text: 'Les barres du graphe adéquat sont juxtaposées' },
      { key: 'D', text: 'Les surfaces constituent les effectifs cumulés' }
    ],
    correct: ['B', 'C'],
    explanation: 'L’histogramme représente une variable quantitative continue (B) avec des rectangles/barres juxtaposées sans espace (C).',
    wrongReasons: {
      A: 'Un caractère qualitatif se représente par un diagramme en barres (espacées) ou circulaire.',
      D: 'Les surfaces représentent les effectifs simples (ou fréquences relatives), PAS les effectifs cumulés !'
    },
    courseRef: 'Statistique descriptive 2026 — Pr Benaldjia, slides 32–33'
  },
  {
    id: 'Q_C11_4', courseId: 'C11', lessonId: 'L11.1', topic: 'Définition d’un Ratio (2× en BM)',
    sourceType: 'bm_original', bmRef: 'Ch. 17 Q14 (cf. Ch. 37 Q12)', year: '2022', multiSelect: false, isHard: true, bmUnanswered: true,
    stem: 'Un ratio est : (cochez la réponse juste)',
    options: [
      { key: 'A', text: 'Un rapport de fréquences de 02 modalités de 02 variables différentes' },
      { key: 'B', text: 'Rapport de 02 fréquences relatives' },
      { key: 'C', text: 'Un rapport de fréquences de 02 modalités d’une même variable' },
      { key: 'D', text: 'Un rapport de risque de survenue d’un événement' }
    ],
    correct: ['C'],
    explanation: 'Slide 9 : un ratio compare deux modalités exclusives d’une MÊME variable (ex. Sex-ratio = Masculin / Féminin). Note : dans Ch. 37 Q12 où C n’apparaît pas, la bonne réponse est D « Aucune réponse n’est juste » !',
    wrongReasons: {
      A: 'Piège classique : jamais 2 variables différentes !',
      B: 'Formulation incomplète.',
      D: 'Un rapport de risques est un Risque Relatif (RR).'
    },
    courseRef: 'Statistique descriptive 2026 — Pr Benaldjia, slide 9'
  },
  {
    id: 'Q_C11_5', courseId: 'C11', lessonId: 'L11.1', topic: 'Diagramme circulaire & piège 3,6° vs 4,6°',
    sourceType: 'bm_original', bmRef: 'Ch. 37 Q22', year: '2019', multiSelect: false, isHard: true,
    stem: 'Un diagramme circulaire est :',
    options: [
      { key: 'A', text: 'Un graphe adapté pour représenter les variables quantitatives continues' },
      { key: 'B', text: 'Un graphe adapté pour représenter les variables qualitatives nominales' },
      { key: 'C', text: 'Peut être remplacé par un histogramme' },
      { key: 'D', text: 'Les angles des secteurs sont proportionnels aux fréquences relatives : 1 % est représenté par 4,6°' }
    ],
    correct: ['B'],
    explanation: 'Le diagramme circulaire (secteurs) représente les variables qualitatives (nominales ou ordinales à peu de modalités).',
    wrongReasons: {
      A: 'Quantitatif continu → histogramme/polygone.',
      C: 'Jamais remplacé par un histogramme (mais peut l’être par un diagramme en barres).',
      D: 'Piège numérique ! 360° / 100 % = 3,6° pour 1 % (PAS 4,6° !).'
    },
    courseRef: 'Statistique descriptive 2026 — Pr Benaldjia, slides 29–30'
  },
  {
    id: 'Q_C11_6', courseId: 'C11', lessonId: 'L11.2', topic: 'La moyenne arithmétique',
    sourceType: 'bm_original', bmRef: 'Ch. 37 Q23', year: 'ND', multiSelect: true, isHard: false,
    stem: 'La moyenne arithmétique : (cocher les réponses justes)',
    options: [
      { key: 'A', text: 'Est une mesure qui localise le centre d’une distribution' },
      { key: 'B', text: 'Une statistique de la tendance centrale, sans unité de mesure' },
      { key: 'C', text: 'A pour unité, l’unité de la variable' },
      { key: 'D', text: 'Vaut la médiane quand l’échantillon est homogène' },
      { key: 'E', text: 'Est différente de la médiane si la distribution est dissymétrique' }
    ],
    correct: ['A', 'C', 'E'],
    explanation: 'La moyenne localise le centre (A), possède l’unité de la variable (C) et s’écarte de la médiane dans une distribution dissymétrique (E).',
    wrongReasons: {
      B: 'Faux : c’est le CV qui est sans unité ; la moyenne a l’unité de la variable.',
      D: 'Elle vaut la médiane quand la distribution est SYMÉTRIQUE (pas simplement « homogène »).'
    },
    courseRef: 'Statistique descriptive 2026 — Pr Benaldjia, slides 41–45'
  },
  {
    id: 'Q_C11_7', courseId: 'C11', lessonId: 'L11.2', topic: 'La médiane',
    sourceType: 'bm_original', bmRef: 'Ch. 37 Q17', year: '2019', multiSelect: true, isHard: false,
    stem: 'La médiane : (cocher la ou les réponses justes)',
    options: [
      { key: 'A', text: 'Est un paramètre de dispersion' },
      { key: 'B', text: 'Nécessite, pour être calculée, de ranger les valeurs observées par ordre croissant' },
      { key: 'C', text: 'S’exprime dans la même unité que la variable dont elle caractérise la distribution' },
      { key: 'D', text: 'Est la racine carrée de l’écart-type' }
    ],
    correct: ['B', 'C'],
    explanation: 'Pour calculer la médiane, il faut impérativement ranger les données par ordre croissant (B) ; elle s’exprime dans l’unité de la variable (C). (Note : le corrigé BM Q17 en choix unique retient B).',
    wrongReasons: {
      A: 'Paramètre de tendance centrale / position (Q2), pas de dispersion.',
      D: 'Absurde (l’écart-type est la racine carrée de la variance).'
    },
    courseRef: 'Statistique descriptive 2026 — Pr Benaldjia, slides 49–53'
  },
  {
    id: 'Q_C11_8', courseId: 'C11', lessonId: 'L11.2', topic: 'Les quartiles',
    sourceType: 'bm_original', bmRef: 'Ch. 37 Q27', year: 'ND', multiSelect: true, isHard: false,
    stem: 'Les quartiles : (cocher les réponses justes)',
    options: [
      { key: 'A', text: 'Sont au nombre de trois, le deuxième est aussi la médiane' },
      { key: 'B', text: 'Sont des paramètres de dispersion' },
      { key: 'C', text: 'Divisent en quatre parties égales une distribution' },
      { key: 'D', text: 'Occupent un certain rang dans la série de valeurs d’une série statistique' }
    ],
    correct: ['A', 'C'],
    explanation: 'Il existe 3 quartiles (Q1, Q2 = Médiane, Q3 — item A) qui partagent une distribution ordonnée en 4 parts égales de 25 % (C). (Note : D n’est pas retenu dans la clé BM AC car il faut que la série soit ordonnée).',
    wrongReasons: {
      B: 'Ce sont des paramètres de POSITION (quantiles), pas de dispersion.',
      D: 'Imprécis sans mentionner le tri préalable de la série.'
    },
    courseRef: 'Statistique descriptive 2026 — Pr Benaldjia, slides 55–57'
  },
  {
    id: 'Q_C11_9', courseId: 'C11', lessonId: 'L11.3', topic: 'Définition de l’étendue (⚠️ Erreur BM)',
    sourceType: 'bm_original', bmRef: 'Ch. 37 Q14', year: '2019', multiSelect: false, isHard: true,
    bmError: { bmKey: 'A', note: 'Erreur du corrigé BM : A définit l’AMPLITUDE d’une classe ! Selon le cours (slide 64), l’étendue = max − min (réponse C).' },
    stem: 'L’étendue est :',
    options: [
      { key: 'A', text: 'La différence entre la limite supérieure et la limite inférieure d’une classe' },
      { key: 'B', text: 'La différence entre le 3ème et le premier quartile' },
      { key: 'C', text: 'La différence entre la valeur maximale et la valeur minimale d’une série de données' },
      { key: 'D', text: 'La différence entre le 9ème et le 1er quartile' }
    ],
    correct: ['C'],
    explanation: 'Slide 64 : l’étendue (paramètre de dispersion) vaut Xmax − Xmin sur l’ensemble de la série.',
    wrongReasons: {
      A: 'Définit l’amplitude d’une classe (h), pas l’étendue.',
      B: 'Q3 − Q1 = intervalle interquartile (IIQ).',
      D: 'Absurde : il n’existe que 3 quartiles (confusion avec les déciles).'
    },
    courseRef: 'Statistique descriptive 2026 — Pr Benaldjia, slide 64'
  },
  {
    id: 'Q_C11_10', courseId: 'C11', lessonId: 'L11.3', topic: 'La variance (4× en BM)',
    sourceType: 'bm_original', bmRef: 'Ch. 37 Q2 (= Q3, Q10)', year: '2024', multiSelect: false, isHard: false,
    stem: 'La variance est considérée comme :',
    options: [
      { key: 'A', text: 'Un rapport de risque de survenue d’un événement' },
      { key: 'B', text: 'Un paramètre de position d’une série des valeurs observées' },
      { key: 'C', text: 'Une mesure de l’étalement de valeurs observées par rapport à une valeur moyenne' },
      { key: 'D', text: 'Une mesure qui localise le centre d’une distribution de valeurs observées' }
    ],
    correct: ['C'],
    explanation: 'La variance mesure l’étalement (dispersion) des observations autour de la moyenne ; plus elle est élevée, plus les valeurs s’éloignent de la moyenne.',
    wrongReasons: {
      A: 'Définit le Risque Relatif (RR).',
      B: 'Paramètre de dispersion, pas de position.',
      D: 'Définit un paramètre de tendance centrale (moyenne/médiane).'
    },
    courseRef: 'Statistique descriptive 2026 — Pr Benaldjia, slides 65–67'
  },
  {
    id: 'Q_C11_11', courseId: 'C11', lessonId: 'L11.3', topic: 'Coefficient de variation — CV (⚠️ Erreur BM)',
    sourceType: 'bm_original', bmRef: 'Ch. 37 Q11 (cf. Q4, Q5, Q24)', year: '2022', multiSelect: true, isHard: true,
    bmError: { bmKey: 'C seul', note: 'Le corrigé BM oublie l’item B : le CV est bien exprimé en pourcentage (%) ET donné par s / m (×100). Même omission en Q24 (vraie réponse BDE).' },
    stem: 'Le coefficient de variation est : (cocher les réponses justes)',
    options: [
      { key: 'A', text: 'Un paramètre de la tendance centrale' },
      { key: 'B', text: 'Est exprimé par un pourcentage' },
      { key: 'C', text: 'Est donné par la formule CV = écart-type / moyenne' },
      { key: 'D', text: 'Est donné par la formule CV = moyenne / écart-type' }
    ],
    correct: ['B', 'C'],
    explanation: 'Slide 68 : CV = (s / m) × 100 (C), sans unité de la variable, exprimé en pourcentage (B).',
    wrongReasons: {
      A: 'C’est un paramètre de DISPERSION.',
      D: 'Formule inversée (piège récurrent en Q4, Q5, Q11).'
    },
    courseRef: 'Statistique descriptive 2026 — Pr Benaldjia, slide 68'
  },
  {
    id: 'Q_C11_12', courseId: 'C11', lessonId: 'L11.3', topic: 'Calcul complet (Série cours + CV + Angle)',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: true,
    stem: 'Soit la série d’âges du cours : 15 ; 20 ; 25 ; 30 ; 35 ans, et une autre variable de moyenne m = 25 et d’écart-type s = 5. Cochez les propositions exactes :',
    options: [
      { key: 'A', text: 'La moyenne et la médiane de la série 15 ; 20 ; 25 ; 30 ; 35 valent toutes deux 25 ans' },
      { key: 'B', text: 'L’étendue de cette série vaut 20 ans' },
      { key: 'C', text: 'Pour m = 25 et s = 5, le coefficient de variation vaut CV = 20 %' },
      { key: 'D', text: 'La variance est la racine carrée de l’écart-type' }
    ],
    correct: ['A', 'B', 'C'],
    explanation: 'Moyenne = 125/5 = 25, médiane = 3ème valeur = 25 (A) ; Étendue = 35 − 15 = 20 (B) ; CV = (5 / 25) × 100 = 20 % (C).',
    wrongReasons: {
      D: 'Piège classique inversé ! C’est l’ÉCART-TYPE qui est la racine carrée de la variance (S = √S²).'
    },
    courseRef: 'Statistique descriptive 2026 — Pr Benaldjia, slides 41, 50, 64–68'
  },

  // ==================== C12 : TEST DU CHI-DEUX ====================
  {
    id: 'Q_C12_1', courseId: 'C12', lessonId: 'L12.1', topic: 'Risque α vs p-value & H₀/H₁',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: true,
    stem: 'Concernant la démarche d’un test d’hypothèse (Pr Aouidane), cochez les propositions exactes :',
    options: [
      { key: 'A', text: 'Le risque de 1ère espèce α est le risque de rejeter à tort l’hypothèse nulle H₀' },
      { key: 'B', text: 'Le risque α est fixé a priori avant le calcul, tandis que la p-value est déterminée a posteriori après le calcul' },
      { key: 'C', text: 'L’hypothèse alternative bilatérale H₁ s’écrit PA ≠ PB sans préciser le sens de la différence' },
      { key: 'D', text: 'Le test du χ² s’applique directement sur les pourcentages sans passer par les effectifs' }
    ],
    correct: ['A', 'B', 'C'],
    explanation: 'Définition de α (A), opposition α a priori vs p a posteriori (B) et H₁ bilatérale (C) sont conformes aux slides 8–13.',
    wrongReasons: {
      D: 'Piège majeur ! Le test du χ² se calcule TOUJOURS sur des EFFECTIFS (jamais directement sur des pourcentages).'
    },
    courseRef: 'Test d’hypothèse (χ²) — Pr Aouidane, slides 8–16'
  },
  {
    id: 'Q_C12_2', courseId: 'C12', lessonId: 'L12.1', topic: 'χ² de conformité vs d’homogénéité',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: false,
    stem: 'Concernant les types de test du χ² de Pearson, cochez les propositions exactes :',
    options: [
      { key: 'A', text: 'Le χ² de conformité (ou d’ajustement) compare un échantillon observé à une distribution théorique connue' },
      { key: 'B', text: 'Le χ² d’homogénéité compare deux ou plusieurs échantillons entre eux' },
      { key: 'C', text: 'Le but du test est de déterminer si la différence observée est due au hasard (fluctuations d’échantillonnage) ou si elle est réelle' },
      { key: 'D', text: 'Le test du χ² est réservé exclusivement aux variables quantitatives continues non groupées' }
    ],
    correct: ['A', 'B', 'C'],
    explanation: 'Conformité (A), homogénéité (B) et objectif du test (C) sont exacts (slides 5 & 15).',
    wrongReasons: {
      D: 'Faux : il s’applique aux variables qualitatives (ou quantitatives discrétisées en classes) présentées en effectifs.'
    },
    courseRef: 'Test d’hypothèse (χ²) — Pr Aouidane, slides 5 & 15'
  },
  {
    id: 'Q_C12_3', courseId: 'C12', lessonId: 'L12.1', topic: 'Formulation de la conclusion (Non-rejet H₀)',
    sourceType: 'course_generated', year: 'Cours', multiSelect: false, isHard: true,
    stem: 'Dans l’exemple du cours (slide 27), on obtient χ²o = 3,125 pour ddl = 1 (avec χ²10% = 2,706 et χ²5% = 3,841). Quelle est la conclusion statistique rigoureuse au risque α = 5 % ?',
    options: [
      { key: 'A', text: 'p < 0,05 ; rejet de H₀ ; différence statistiquement significative' },
      { key: 'B', text: '0,05 < p < 0,10 ; non-rejet de H₀ ; différence statistiquement non significative' },
      { key: 'C', text: '0,05 < p < 0,10 ; on accepte formellement que H₀ est prouvée vraie' },
      { key: 'D', text: 'p < 0,01 ; différence hautement significative' }
    ],
    correct: ['B'],
    explanation: 'Puisque 2,706 < 3,125 < 3,841, on encadre 0,05 < p < 0,10. Comme χ²o < 3,841, on conclut au NON-REJET de H₀ (différence non significative).',
    wrongReasons: {
      A: 'Faux : 3,125 < 3,841 donc p > 0,05.',
      C: 'Piège du cours : on dit « non-rejet de H₀ », JAMAIS « on accepte H₀ » !',
      D: 'Il faudrait χ²o > 6,635.'
    },
    courseRef: 'Test d’hypothèse (χ²) — Pr Aouidane, slides 25–27'
  },
  {
    id: 'Q_C12_4', courseId: 'C12', lessonId: 'L12.2', topic: 'Décision χ² sur tableau 2×2 (2025)',
    sourceType: 'bm_original', bmRef: 'Ch. 43 Q1 (reclassé vers C12)', year: '2025', multiSelect: true, isHard: false,
    stem: 'On a enquêté dans une commune (827 ménages, 5 670 personnes) pour mesurer la prévalence des handicaps selon le sexe (tableau 2×2 — note : photo BM corrompue). Existe-t-il une relation entre la présence d’un handicap et le sexe ? (cocher les réponses justes)',
    options: [
      { key: 'A', text: 'χ² = 0,04' },
      { key: 'B', text: 'χ² = 0,40' },
      { key: 'C', text: 'Test statistiquement significatif' },
      { key: 'D', text: 'Test statistiquement non significatif' }
    ],
    correct: ['B', 'D'],
    explanation: 'Pour un tableau 2×2 (ddl = 1) au risque α = 5 %, la valeur critique est 3,841. Avec χ² = 0,40 < 3,841, le test est statistiquement non significatif (non-rejet de H₀).',
    wrongReasons: {
      A: 'Erreur de virgule sur le calcul original de l’épreuve.',
      C: 'Faux : il faudrait χ² > 3,841 pour conclure à la significativité.'
    },
    courseRef: 'Test d’hypothèse (χ²) — Pr Aouidane, slides 24–27'
  },
  {
    id: 'Q_C12_5', courseId: 'C12', lessonId: 'L12.2', topic: 'Calcul complet χ² sur tableau 2×2 (inspiré Ch. 42 Q4)',
    sourceType: 'course_generated', year: 'Cours', multiSelect: true, isHard: true,
    stem: 'On compare l’évolution d’une maladie (Guérison vs Rechute) selon la voie d’administration chez N = 100 patients (risque α = 5 %, χ²5%, ddl=1 = 3,841). Cochez les propositions exactes :',
    table: '<table class="mini-table"><thead><tr><th></th><th>Guérison</th><th>Rechute</th><th>Total</th></tr></thead><tbody><tr><td><strong>Voie orale</strong></td><td>18</td><td>32</td><td><strong>50</strong></td></tr><tr><td><strong>Voie parentérale</strong></td><td>32</td><td>18</td><td><strong>50</strong></td></tr><tr><td><strong>Total</strong></td><td><strong>50</strong></td><td><strong>50</strong></td><td><strong>100</strong></td></tr></tbody></table>',
    options: [
      { key: 'A', text: 'Chaque effectif théorique Cij vaut (50 × 50) / 100 = 25 ≥ 5 : condition d’application vérifiée' },
      { key: 'B', text: 'Le nombre de degrés de liberté est ddl = 4' },
      { key: 'C', text: 'La valeur calculée du χ² observé est χ²o = 7,84' },
      { key: 'D', text: 'Comme χ²o > 3,841, on rejette H₀ : la différence est statistiquement significative' }
    ],
    correct: ['A', 'C', 'D'],
    explanation: '1) Cij = (50×50)/100 = 25 ≥ 5 dans les 4 cases (A). 2) χ²o = 4 × (7² / 25) = 196 / 25 = 7,84 (C). 3) ddl = (2−1)(2−1) = 1 → 7,84 > 3,841 (et même > 6,635 ⇒ p < 0,01) ⇒ rejet de H₀, différence significative (D).',
    wrongReasons: {
      B: 'Faux : ddl = (L − 1)(C − 1) = (2 − 1)(2 − 1) = 1 (pas 4 !).'
    },
    courseRef: 'Test d’hypothèse (χ²) — Pr Aouidane, slides 16–27'
  },
  {
    id: 'Q_C12_6', courseId: 'C12', lessonId: 'L12.2', topic: 'Condition d’application Cij ≥ 5 (Théoriques vs Observés)',
    sourceType: 'course_generated', year: 'Cours', multiSelect: false, isHard: true,
    stem: 'Quelle est la condition d’application indispensable du test du χ² de Pearson sur un tableau de contingence ?',
    options: [
      { key: 'A', text: 'Tous les effectifs OBSERVÉS (Oij) doivent être ≥ 5' },
      { key: 'B', text: 'Tous les effectifs THÉORIQUES calculés (Cij) doivent être ≥ 5' },
      { key: 'C', text: 'L’effectif total N doit être supérieur à 1 000' },
      { key: 'D', text: 'Le nombre de degrés de liberté doit être supérieur à 3' }
    ],
    correct: ['B'],
    explanation: 'Slide 20 : la validité du χ² exige que tous les effectifs THÉORIQUES calculés Cij = (Total ligne × Total colonne) / N soient supérieurs ou égaux à 5.',
    wrongReasons: {
      A: 'Piège très fréquent ! Ce sont les effectifs THÉORIQUES (Cij), pas les effectifs observés (Oij).',
      C: 'Faux.',
      D: 'Faux : un tableau 2×2 a ddl = 1.'
    },
    courseRef: 'Test d’hypothèse (χ²) — Pr Aouidane, slide 20'
  }
);
