/* ==========================================================================
   EpiMaster Batna — Métadonnées, Modules, Audit BM 2026 & Erreurs Corrigé BM
   Source de vérité : 18 fichiers de cours (12 cours) + BM Épidémiologie 2026
   ========================================================================== */
window.EpiData = window.EpiData || {
  modules: [],
  courses: [],
  flashcards: [],
  qcms: [],
  bmAudit: {},
  bmErrors: [],
  outOfCourseBM: []
};

window.EpiData.bmAudit = {
  documentName: 'BM Épidémiologie 2026 (Banque MAGIC QCM — Batna 2, 2012–2025)',
  pagesScanned: 188,
  chaptersCount: 43,
  coverClaimedCount: 772,
  actualVerifiedCount: 476,
  matchedTo12Courses: 142,
  outOfCourseVisible: 328,
  missingScanQuestions: 6,
  missingScanNote: 'Page livret 184/273 absente du scan PDF (Ch. 29 Q20–Q25 + énoncé Q26, hors cours fournis).',
  bmCorrigeErrorsCount: 12,
  unansweredSolvedCount: 28,
  courseFilesCount: 18,
  distinctCoursesCount: 12
};

window.EpiData.modules = [
  {
    id: 'M1',
    code: 'Module 1',
    title: 'Santé Publique & Maladies Non Transmissibles',
    description: 'Concepts fondateurs, approches de la santé, niveaux de prévention, transition épidémiologique et fardeau des MNT.',
    accent: '#1d4ed8',
    courseIds: ['C1', 'C3']
  },
  {
    id: 'M2',
    code: 'Module 2',
    title: 'Maladies Transmissibles, Épidémies, TIAC & IAS',
    description: 'Surveillance épidémiologique, MDO (Décret 22-250), investigation d’épidémie, conduite devant TIAC et lutte contre les IAS.',
    accent: '#0f766e',
    courseIds: ['C2', 'C4', 'C5', 'C6']
  },
  {
    id: 'M3',
    code: 'Module 3',
    title: 'Programmes Spécifiques, Certification CMD & Financement',
    description: 'Santé scolaire (UDS/EPSP), certification de la cause médicale de décès (Décret 22-178) et financement du système de santé.',
    accent: '#0369a1',
    courseIds: ['C7', 'C8', 'C9']
  },
  {
    id: 'M4',
    code: 'Module 4',
    title: 'Méthodologie d’Enquête & Biostatistique',
    description: 'Élaboration du questionnaire, statistique descriptive (graphiques, dispersion, CV) et test d’hypothèse du Chi-deux (χ²).',
    accent: '#4338ca',
    courseIds: ['C10', 'C11', 'C12']
  }
];

window.EpiData.bmErrors = [
  {
    id: 'ERR_1',
    bmRef: 'Ch. 2 Q1 (2024)',
    courseId: 'C1',
    lessonId: 'L1.1',
    topic: 'Approche prospective de la santé',
    bmAnswer: 'C',
    courseAnswer: 'B',
    reason: 'L’item C (dimensions physique, mentale, sociale) définit l’approche globaliste (OMS 1946). L’approche prospective (B) tient compte des moyens de contrôle des facteurs endogènes et exogènes.',
    courseProof: 'Introduction à la santé publique — Pr Boumaraf, slides 7 & 9'
  },
  {
    id: 'ERR_2',
    bmRef: 'Ch. 14 Q2 (2025)',
    courseId: 'C1',
    lessonId: 'L1.1',
    topic: 'Approche conventionnelle de la santé',
    bmAnswer: 'ABC',
    courseAnswer: 'C uniquement',
    reason: 'L’approche conventionnelle (absence de maladie) se définit « en dehors de tout critère socio-économique et culturel ». A et B sont donc faux.',
    courseProof: 'Introduction à la santé publique — Pr Boumaraf, slides 5–6'
  },
  {
    id: 'ERR_3',
    bmRef: 'Ch. 10 Q14 (2021)',
    courseId: 'C6',
    lessonId: 'L6.1',
    topic: 'Délai ISO sur prothèse du genou (2 mois)',
    bmAnswer: 'C',
    courseAnswer: 'A',
    reason: 'Le délai ISO est de 30 jours en chirurgie standard, mais passe à 1 AN en cas de mise en place d’un implant ou d’une prothèse. À 2 mois, c’est bien une ISO (A).',
    courseProof: 'Les infections associées aux soins — Pr Tobbi / Dr Benaldjia, slide 6'
  },
  {
    id: 'ERR_4',
    bmRef: 'Ch. 10 Q22 (ND)',
    courseId: 'C6',
    lessonId: 'L6.2',
    topic: 'Colonisation d’un cathéter',
    bmAnswer: 'D (1-4)',
    courseAnswer: 'C (1-2-3)',
    reason: 'Une colonisation associe culture positive significative + ABSENCE de signes locaux et généraux. L’érythème (item 4) est un signe local d’infection, pas une colonisation.',
    courseProof: 'Définitions standard IAS / cathéters (complément slide 18)'
  },
  {
    id: 'ERR_5',
    bmRef: 'Ch. 10 Q6 (2022)',
    courseId: 'C6',
    lessonId: 'L6.3',
    topic: 'Règles d’hygiène des mains',
    bmAnswer: 'ABC',
    courseAnswer: 'AD',
    reason: 'Contredit Ch. 10 Q10 et Q20 : le pain de savon (B) et la serviette réutilisable (C) sont proscrits. Proscrire bijoux (A) et appareil séchoir électrique (D).',
    courseProof: 'Volet Hygiène des mains — cohérence BM Ch. 10 Q7, Q10 & Q20'
  },
  {
    id: 'ERR_6',
    bmRef: 'Ch. 10 Q21 (ND)',
    courseId: 'C6',
    lessonId: 'L6.1',
    topic: 'Définition de l’IAS (IN + ILS)',
    bmAnswer: 'A (1-4)',
    courseAnswer: 'D (1-2-4)',
    reason: 'Les IAS englobent les infections nosocomiales (hôpital) ET les infections liées aux soins en milieu libéral (ILS, item 2). Seul « avant 24h » est faux.',
    courseProof: 'Les infections associées aux soins — slides 5–7'
  },
  {
    id: 'ERR_7',
    bmRef: 'Ch. 37 Q14 (2019)',
    courseId: 'C11',
    lessonId: 'L11.3',
    topic: 'Définition de l’étendue',
    bmAnswer: 'A',
    courseAnswer: 'C',
    reason: 'L’étendue est la différence entre la valeur maximale et la valeur minimale d’une série (C). L’option A définit l’amplitude d’une classe.',
    courseProof: 'Statistique descriptive 2026 — Pr Benaldjia, slide 64'
  },
  {
    id: 'ERR_8',
    bmRef: 'Ch. 37 Q11 (2022)',
    courseId: 'C11',
    lessonId: 'L11.3',
    topic: 'Coefficient de variation (CV)',
    bmAnswer: 'C',
    courseAnswer: 'BC',
    reason: 'Le corrigé BM oublie l’item B : le CV est exprimé en pourcentage (%) ET donné par s / m (× 100).',
    courseProof: 'Statistique descriptive 2026 — Pr Benaldjia, slide 68'
  },
  {
    id: 'ERR_9',
    bmRef: 'Ch. 37 Q24 (ND)',
    courseId: 'C11',
    lessonId: 'L11.3',
    topic: 'Propriétés du Coefficient de variation',
    bmAnswer: 'BE',
    courseAnswer: 'BDE',
    reason: 'L’item D reprend mot pour mot le cours : « exprime le degré de dispersion en fonction de la moyenne ».',
    courseProof: 'Statistique descriptive 2026 — Pr Benaldjia, slide 68'
  },
  {
    id: 'ERR_10',
    bmRef: 'Ch. 14 Q49 (ND)',
    courseId: 'C4',
    lessonId: 'L4.2',
    topic: 'Apports de la courbe épidémique',
    bmAnswer: 'B',
    courseAnswer: 'BCD',
    reason: 'La courbe épidémique oriente sur l’incubation (B), le type de transmission (C) ET la nature de la source (D), mais jamais avec certitude sur l’agent causal (A).',
    courseProof: 'Investigation d’une épidémie — Dr F. Beichi, p. 6 (Étape 5A)'
  },
  {
    id: 'ERR_11',
    bmRef: 'Ch. 12 Q1 vs Q6 (2024)',
    courseId: 'C2',
    lessonId: 'L2.1',
    topic: 'MT dans le monde vs contagiosité',
    bmAnswer: 'Q1=B vs Q6=C',
    courseAnswer: 'Nuance C2 / C3',
    reason: 'Les MT sont la principale cause de morbi-mortalité dans les PED (dans le monde global, les MNT = 74 % des décès). Toutes les contagieuses sont transmissibles mais l’inverse est faux.',
    courseProof: 'Épidémiologie des MT — Dr Beichi, p. 2 & MNT slide 5'
  },
  {
    id: 'ERR_12',
    bmRef: 'Ch. 12 Q9 vs Ch. 38 Q1/Q11',
    courseId: 'C2',
    lessonId: 'L2.2',
    topic: 'Surveillance des MDO',
    bmAnswer: 'ABC / ABCD / C',
    courseAnswer: 'ABCD / CE',
    reason: 'Trois clés différentes dans la BM pour le même concept : retenir que la surveillance MDO est passive, exhaustive, obligatoire (réglementation) et repose sur les professionnels.',
    courseProof: 'Épidémiologie des MT — Dr Beichi, § V.5–VI, p. 7–8'
  }
];

window.EpiData.outOfCourseBM = [
  { chapters: 'Ch. 29 & Ch. 41 — Systèmes de santé (Bismarck/Beveridge, USA, Algérie)', count: 88, note: 'Inclut 6 questions manquantes sur p. 184/273 non scannée.' },
  { chapters: 'Ch. 14 — Études épidémiologiques (Cohorte, Cas-témoins, Biais, RR, OR)', count: 47, note: '3 questions reclassées vers C1 et C4.' },
  { chapters: 'Ch. 25 & Ch. 28 — Outils d’analyse économique / Consommation médicale (PIB, IDH)', count: 46, note: 'Ch. 28 est un doublon intégral de Ch. 25.' },
  { chapters: 'Ch. 17 — Indicateurs de santé (TBM, TMS, Létalité, Mortalité prop.)', count: 29, note: '3 questions reclassées vers C1, C4 et C11.' },
  { chapters: 'Ch. 4 — Besoin et demande de santé (3 cercles, élasticité)', count: 24, note: 'Recoupe la notion de rareté des ressources (C9).' },
  { chapters: 'Ch. 27 — Médicament générique & Pharmacovigilance', count: 19, note: 'Cours non présent dans le dossier fourni.' },
  { chapters: 'Ch. 18 — Indicateurs économiques (Coût-efficacité)', count: 15, note: 'Q15 recoupe le niveau macro-économique (C9).' },
  { chapters: 'Ch. 33 — Programme Élargi de Vaccination (PEV)', count: 15, note: 'Calendrier vaccinal, PCV, vaccins vivants/inactivés.' },
  { chapters: 'Ch. 32 — Programmation sanitaire', count: 10, note: '4 questions Prévention reclassées vers C1.' },
  { chapters: 'Ch. 7, 20, 34 — Communication scientifique & Rédaction / Vancouver', count: 10, note: 'Ch. 34 Q1 reclassée vers C10.' },
  { chapters: 'Ch. 21, 24, 31, 43 Q2 + intrus — LCA & Validité test diagnostique', count: 9, note: 'Ch. 43 Q1 (Chi²) reclassée vers C12.' },
  { chapters: 'Ch. 5 (Méningite), Ch. 3 (Intro Épi), Ch. 1 (Méthodo), Ch. 8/22/36 (SCTMR), Ch. 23/35 (RSI), Ch. 39 (SIS), Ch. 40 (Prot. soc.), Ch. 19 Q12', count: 22, note: 'Chapitres de 1 à 5 questions hors dossier fourni.' }
];
