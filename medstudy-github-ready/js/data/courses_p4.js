/* ==========================================================================
   Cours Partie 4 : C10 (Questionnaire), C11 (Stat. descriptive), C12 (Test Chi²)
   Contenu 100 % fidèle aux supports officiels Batna 2
   ========================================================================== */
window.EpiData.courses.push(
  // =========================================================================
  // COURS 10 — Élaboration du questionnaire d'une étude
  // =========================================================================
  {
    id: 'C10',
    moduleId: 'M4',
    code: 'C10',
    title: 'Élaboration du questionnaire d’une étude',
    shortTitle: 'Questionnaire d’Étude',
    professor: 'Dr CHIBOUB B. (Université Batna 2)',
    sourceFiles: ['12-Elaboration du questionnaire d’une étude.pdf (2 pages)'],
    bmCount: 2,
    bmSharedNote: 'Tombé 2 années de suite (2024 Ch. 9 Q1 & 2025 Ch. 34 Q1) — cours ultra-court de 2 pages !',
    bmRecentCount: 2,
    uniqueConcepts: 1,
    priority: 'medium',
    priorityScore: 57,
    vigilance2026: false,
    summary: 'Place du questionnaire dans la phase de planification, règles de présentation (titre sans le mot « Questionnaire »), les 7 étapes élémentaires, types de questions (fermées/ordonnées ≤ 3/ouvertes), pré-test (4 objectifs) et modes d’administration (e-mailing 5 %).',
    lessons: [
      {
        id: 'L10.1',
        courseId: 'C10',
        order: 1,
        title: 'Place dans la planification, présentation & les 7 étapes',
        durationMin: 7,
        sourceRef: 'Page 1',
        bmCount: 2,
        bmRefs: ['Ch. 9 Q1 (2024)', 'Ch. 34 Q1 (2025)'],
        priority: 'medium',
        priorityScore: 57,
        understand: {
          intro: 'Ce cours de seulement 2 pages offre le meilleur ratio temps/points du programme : la question sur la phase de planification est tombée en 2024 ET de nouveau en 2025 !',
          sections: [
            {
              heading: 'Définition, moment d’élaboration & présentation',
              paragraphs: ['Parmi les 4 méthodes de recueil d’information (enquête par questionnaire, entretien, observation, étude des documents), le <strong>questionnaire</strong> est une technique de collecte de données <strong>quantifiables</strong>, constituée d’une série de questions précises, claires, écrites, dans un ordre logique.'],
              bullets: [
                '<strong>Moment d’élaboration (tombé en 2024 ET 2025 !) :</strong> il est <strong>élaboré dans la phase de planification</strong> de l’étude (jamais à la fin du travail/protocole, jamais dans la « Discussion »), et répond directement aux <strong>objectifs de l’étude</strong>.',
                '<strong>Présentation :</strong> en-tête simplifiée, introduction brève, et un <strong>titre attrayant</strong> — <strong>ÉVITER le mot « Questionnaire »</strong> dans le titre (jugé péjoratif !).'
              ]
            },
            {
              heading: 'Les 7 étapes élémentaires dans l’ordre',
              paragraphs: ['L’élaboration suit rigoureusement 7 étapes successives :'],
              bullets: [
                '<strong>1) Définir l’objectif</strong> (ce sont les objectifs qui guident la rédaction).',
                '<strong>2) Choisir les types de questions</strong>.',
                '<strong>3) Structurer le questionnaire</strong> (regrouper par thème, aller du <strong>général au spécifique</strong>, commencer par des <strong>questions simples</strong> pour mettre en confiance, veiller à la longueur et l’utilité).',
                '<strong>4) Choisir les modalités d’administration</strong> (cible, taille suffisante, mode).',
                '<strong>5) Tester le questionnaire (Pré-test systématique)</strong>.',
                '<strong>6) Administrer le questionnaire</strong>.',
                '<strong>7) Traiter le questionnaire (Dépouillement)</strong> : bon outil, <strong>codifier les questions ouvertes</strong>, organiser saisie, analyser et rédiger le rapport.'
              ]
            }
          ],
          tables: [
            {
              title: 'Synthèse des 7 étapes (Dr Chiboub)',
              headers: ['Étape', 'Règle clé à retenir'],
              rows: [
                ['1. Objectif', 'Guide toute la rédaction (un questionnaire répond toujours à l’objectif)'],
                ['2. Types de questions', 'Privilégier les fermées ; éviter les ouvertes ; classement ordonné ≤ 3 items'],
                ['3. Structuration', 'Par thème, du général au spécifique (entonnoir), début par questions simples'],
                ['4–6. Modalités, Pré-test, Administration', 'Pré-test OBLIGATOIRE avant l’administration finale'],
                ['7. Traitement / Dépouillement', 'Codification préalable des questions ouvertes + saisie + analyse + rapport']
              ]
            }
          ],
          darija: 'السؤال لي طاح في 2024 وعاود في 2025 : الـ questionnaire يتخدم في <strong>مرحلة التخطيط (phase de planification)</strong> ماشي في اللخر ! وتفادى تكتب كلمة « Questionnaire » في العنوان، وابدا بأسئلة ساهلة ومن العام للخاص.',
          triad: {
            toUnderstand: [
              'Pourquoi le questionnaire doit être finalisé et pré-testé durant la planification avant le terrain.'
            ],
            toMemorize: [
              'Élaboré dans la phase de planification ; répond à l’objectif ; éviter le mot « Questionnaire » dans le titre.',
              'Les 7 étapes dans l’ordre ; structure du général au spécifique + début par questions simples.'
            ],
            toRecognizeInQcm: [
              '« Fait à la fin du travail/protocole » ou « détaillé dans la Discussion » → FAUX !',
              '« Ne répond pas à l’objectif de l’étude » → FAUX !'
            ]
          }
        },
        memorize: [
          { id: 'M_L10.1_1', category: 'Piège QCM', title: 'Place du questionnaire (2024 & 2025)', content: '<strong>Élaboré dans la phase de planification</strong> de l’étude et répond directement à ses objectifs (collecte de données quantifiables).', highlight: true },
          { id: 'M_L10.1_2', category: 'Liste', title: 'Les 7 étapes d’élaboration', content: '1) Objectif → 2) Types de questions → 3) Structurer (général → spécifique, questions simples au début) → 4) Modalités → 5) <strong>Pré-test</strong> → 6) Administrer → 7) Traiter/dépouiller.', highlight: true },
          { id: 'M_L10.1_3', category: 'Piège QCM', title: 'Règle du titre', content: 'Titre attrayant : <strong>éviter le mot « Questionnaire »</strong> (terme péjoratif).', highlight: false }
        ]
      },
      {
        id: 'L10.2',
        courseId: 'C10',
        order: 2,
        title: 'Types de questions, pré-test (4 buts) & modes d’administration',
        durationMin: 7,
        sourceRef: 'Pages 1–2',
        bmCount: 0,
        bmRefs: [],
        priority: 'low',
        priorityScore: 20,
        understand: {
          intro: 'Cette deuxième page contient toutes les distinctions techniques : avantages/inconvénients de chaque type de question, les 4 objectifs exacts du pré-test et les taux de retour des modes d’administration.',
          sections: [
            {
              heading: 'Les 4 objectifs du pré-test (Étape 5) & Modes d’administration (Étape 6)',
              paragraphs: ['Le pré-test est une étape <strong>systématique et indispensable</strong> sur un petit échantillon avant de lancer l’enquête :'],
              bullets: [
                '<strong>Les 4 vérifications du pré-test :</strong> 1) Conception/compréhension des questions, 2) Adaptation des modalités de réponse, 3) Oublis éventuels, 4) <strong>Temps réel de passation</strong>.',
                '<strong>Face à face :</strong> contact direct, permet d’observer les réactions et de reformuler si besoin.',
                '<strong>Téléphone :</strong> rapide et économique, mais nécessite une mise à jour des numéros.',
                '<strong>Courriel / E-mailing :</strong> rapide mais <strong>peu efficace (~5 % de taux de retour seulement !)</strong>.'
              ]
            }
          ],
          tables: [
            {
              title: 'Comparaison des types de questions (Page 1)',
              headers: ['Type de question', 'Avantages', 'Inconvénients / Limites'],
              rows: [
                ['Fermée à choix unique', 'Rapidité, simplicité de traitement', 'Peu pratique pour étudier les comportements complexes'],
                ['Fermée à choix multiples', 'Simplicité de traitement et dépouillement', 'Influence les réponses, liste parfois trop longue'],
                ['Fermée ordonnée (classement)', 'Classement par préférence, précision', 'Classement NON supérieur à 3 propositions (≤ 3) !'],
                ['Ouverte (À ÉVITER)', 'Richesse de contenu, spontanéité', 'Dépouillement et analyse longs (nécessite codification à l’Étape 7)']
              ]
            }
          ],
          darija: 'احفظ 3 أرقام/قواعد في الصفحة الثانية : الترتيب (question ordonnée) ما يفوتش <strong>3 اختيارات (≤ 3 propositions)</strong> ؛ الـ <strong>Questions ouvertes</strong> نتفاداوهم ونكوديوهوم في اللخر ؛ والـ <strong>E-mailing</strong> ضعيف يرجع غير <strong>5 %</strong> !',
          triad: {
            toUnderstand: [
              'Pourquoi les questions ouvertes compliquent l’analyse statistique (codification manuelle requise).'
            ],
            toMemorize: [
              'Classement hiérarchique : ≤ 3 propositions ; Questions ouvertes : à éviter (codifier au dépouillement).',
              '4 buts du pré-test : conception, adaptation des modalités, oublis, temps réel de passation.',
              'E-mailing : taux de retour faible (~5 %).'
            ],
            toRecognizeInQcm: [
              '« Privilégier les questions ouvertes pour faciliter le dépouillement » → FAUX !',
              '« L’e-mailing assure un taux de retour élevé (> 70 %) » → FAUX (5 % seulement !).'
            ]
          }
        },
        memorize: [
          { id: 'M_L10.2_1', category: 'Seuil / Chiffre', title: 'Types de questions & seuils', content: 'Fermée ordonnée : <strong>≤ 3 propositions</strong> à classer. Questions <strong>ouvertes : à éviter</strong> (dépouillement long, codification requise à l’Étape 7).', highlight: true },
          { id: 'M_L10.2_2', category: 'Liste', title: 'Les 4 vérifications du Pré-test (Étape 5)', content: '1) Conception des questions, 2) Adaptation des modalités, 3) Oublis éventuels, 4) <strong>Temps réel de passation</strong>.', highlight: true },
          { id: 'M_L10.2_3', category: 'Seuil / Chiffre', title: 'Modes d’administration', content: 'Face à face (contact/réactions), Téléphone (rapide/économique), <strong>E-mailing = peu efficace (~5 % de retour)</strong>.', highlight: false }
        ]
      }
    ]
  },

  // =========================================================================
  // COURS 11 — Statistique descriptive (+ TD)
  // =========================================================================
  {
    id: 'C11',
    moduleId: 'M4',
    code: 'C11',
    title: 'Statistique descriptive (+ TD)',
    shortTitle: 'Statistique Descriptive',
    professor: 'Pr H. BENALDJIA (Université Batna 2, 2026–2027)',
    sourceFiles: ['statistique descriptive 2026.pdf (69 slides)', 'TD statistique descriptive.pptx (25 slides)'],
    bmCount: 29,
    bmSharedNote: 'Cours n°2 en volume dans la BM (28 QCM Ch. 37 + 1 QCM Ch. 17 Q14) — ⚠️ 3 erreurs corrigé BM',
    bmRecentCount: 7,
    uniqueConcepts: 8,
    priority: 'very_high',
    priorityScore: 100,
    vigilance2026: false,
    summary: 'Types de variables, fréquences relatives, ratio et sex-ratio, choix du graphique selon la variable (10 QCM !), tendance centrale (moyenne, médiane, mode), quantiles (quartiles/déciles/percentiles) et dispersion (étendue, variance, écart-type, CV — 10 QCM !).',
    lessons: [
      {
        id: 'L11.1',
        courseId: 'C11',
        order: 1,
        title: 'Types de variables, fréquences, ratio & représentations graphiques',
        durationMin: 14,
        sourceRef: 'Slides 4–36 + TD',
        bmCount: 15,
        bmRefs: ['Ch. 37 Q1 (2025)', 'Q6–Q8 (2022–2024)', 'Q12–Q13, Q15–Q16, Q19–Q22, Q25, Q28', 'Ch. 17 Q14 (2022)'],
        priority: 'very_high',
        priorityScore: 100,
        understand: {
          intro: 'Sujet n°1 ex-aequo de toute la plateforme (Score 100/100) ! 10 QCM testent directement le choix du graphique selon le type de variable, et 5 autres testent les types de variables, fréquences relatives et ratio/sex-ratio.',
          sections: [
            {
              heading: 'Types de variables, Fréquence relative, Ratio & Sex-ratio',
              paragraphs: ['Avant de choisir un tableau ou un graphique, il faut identifier avec précision la nature de la variable :'],
              bullets: [
                '<strong>Qualitative nominale :</strong> modalités sans ordre (sexe, groupe sanguin, état civil).',
                '<strong>Qualitative ordinale :</strong> modalités ordonnées (satisfaction, <strong>stades d’une affection chronique</strong> — tombé en 2025 `Ch. 37 Q1` !).',
                '<strong>Quantitative discontinue (discrète) :</strong> valeurs entières isolées (<strong>nombre de rappels d’un vaccin</strong> — `Ch. 37 Q19 D`, fréquence cardiaque, fratrie).',
                '<strong>Quantitative continue :</strong> toutes valeurs réelles dans un intervalle (<strong>poids</strong> — `Ch. 37 Q6 & Q7`, taille, glycémie, TA).',
                '<strong>Fréquence relative (Ch. 37 Q16 A) :</strong> rapport entre la fréquence absolue (<em>n<sub>i</sub></em>) et l’effectif total (<em>N</em>). Fréquences cumulées : uniquement pour variables ordonnées.',
                '<strong>Ratio (Ch. 17 Q14 C & Ch. 37 Q12) :</strong> rapport des effectifs/fréquences de <strong>2 modalités d’une MÊME variable</strong> (ex. <strong>Sex-ratio = Masculin / Féminin</strong> — `Ch. 37 Q21 A`, exemple cours : 15/35 = 0,43).'
              ]
            }
          ],
          tables: [
            {
              title: 'Tableau d’or : Quel graphique pour quelle variable ? (10 QCM BM !)',
              headers: ['Type de variable', 'Graphique(s) adapté(s)', 'Caractéristiques & Pièges QCM'],
              rows: [
                ['Qualitative (nominale ou ordinale : sexe, stades)', 'Diagramme en barres (barres ESPACÉES) + Diagramme circulaire (≤ 6 modalités)', '1 % = 3,6° (PAS 4,6° !). JAMAIS remplacé par un histogramme !'],
                ['Quantitative discontinue / discrète (nb rappels vaccin)', 'Diagramme en bâtons (bâtonnets)', 'Bâtons fins verticaux sur valeurs entières'],
                ['Quantitative continue (poids, taille, âge)', 'Histogramme (barres JUXTAPOSÉES) + Polygone de fréquence + Boîte à moustaches', 'Polygone = ligne brisée joignant les milieux des sommets, compare plusieurs distributions ; surfaces = effectifs simples (PAS cumulés !)']
              ]
            }
          ],
          darija: 'هاد الجدول يجيبلك نقاط مضمونة : <strong>Qualitatif</strong> (الجنس، مراحل مرض) ← <strong>Diagramme en barres (متباعدين)</strong> + <strong>Circulaire (1 % = 3,6°)</strong>. <strong>Quantitatif continu</strong> (الوزن، الطول) ← <strong>Histogramme (أعمدة لاصقين juxtaposées)</strong> + <strong>Polygone de fréquence</strong>. و<strong>Ratio</strong> = زوج modalités من <strong>نفس المتغير</strong> (Sex-ratio = رجال ÷ نساء).',
          triad: {
            toUnderstand: [
              'Pourquoi les barres sont juxtaposées dans un histogramme (continuité des classes) et espacées dans un diagramme en barres (catégories distinctes).',
              'Pourquoi un titre de tableau/graphique (TD) doit mentionner Quoi, Qui, Où, Quand + effectif N + unités.'
            ],
            toMemorize: [
              'Qualitative → Barres espacées + Circulaire (1 % = 3,6°) ; Discrète → Bâtons ; Continue → Histogramme (juxtaposé) + Polygone.',
              'Ratio = 2 modalités d’une MÊME variable ; Sex-ratio = Masculin / Féminin.',
              'Polygone de fréquence = ligne brisée joignant les milieux des sommets de l’histogramme.'
            ],
            toRecognizeInQcm: [
              '« Stades d’une affection chronique » (2025) = qualitative ordinale → Diagramme à barres + Circulaire (AD).',
              '« Poids d’une série d’individus » (2024 ×2) = quantitative continue → Histogramme (A).',
              '« 2 modalités de 2 variables différentes » pour un ratio → PIÈGE FAUX !'
            ]
          }
        },
        memorize: [
          { id: 'M_L11.1_1', category: 'Classification', title: 'Association Variables ↔ Graphiques (10× en BM)', content: '<strong>Qualitative :</strong> Barres espacées + Circulaire. <strong>Quanti discrète :</strong> Bâtons. <strong>Quanti continue :</strong> <strong>Histogramme</strong> (barres juxtaposées) + <strong>Polygone de fréquence</strong>.', highlight: true },
          { id: 'M_L11.1_2', category: 'Formule', title: 'Angle du diagramme circulaire', content: '<strong>1 % = 3,6°</strong> (Angle = Fréquence % × 3,6°). <em>Piège BM Ch. 37 Q22 D : « 4,6° » est FAUX !</em>', highlight: true },
          { id: 'M_L11.1_3', category: 'Formule', title: 'Ratio & Sex-ratio', content: '<strong>Ratio :</strong> rapport des fréquences de <strong>2 modalités d’une MÊME variable</strong>. <strong>Sex-ratio</strong> = <span class="math-frac"><span>Effectif Masculin</span><span>Effectif Féminin</span></span>.', highlight: true },
          { id: 'M_L11.1_4', category: 'Définition', title: 'Polygone de fréquence (Ch. 37 Q28)', content: 'Graphe pour <strong>variable quantitative continue</strong>, construit en joignant le <strong>point milieu du sommet</strong> de chaque rectangle de l’histogramme (aspect de <strong>ligne brisée</strong>).', highlight: false }
        ]
      },
      {
        id: 'L11.2',
        courseId: 'C11',
        order: 2,
        title: 'Paramètres de tendance centrale & de position (Quantiles)',
        durationMin: 10,
        sourceRef: 'Slides 38–61',
        bmCount: 4,
        bmRefs: ['Ch. 37 Q17 (2019)', 'Ch. 37 Q23 (ND)', 'Ch. 37 Q26 (ND)', 'Ch. 37 Q27 (ND)'],
        priority: 'high',
        priorityScore: 70,
        understand: {
          intro: 'Les paramètres de réduction se répartissent en 3 familles qu’il ne faut jamais mélanger en QCM : Tendance centrale (moyenne, médiane, mode), Position (quartiles, déciles, percentiles) et Dispersion (leçon suivante).',
          sections: [
            {
              heading: 'Les 3 paramètres de tendance centrale',
              paragraphs: ['Ils résument le « centre » d’une distribution et s’expriment tous dans <strong>la même unité que la variable</strong> :'],
              bullets: [
                '<strong>Moyenne arithmétique (Ch. 37 Q23 ACE) :</strong> <em>M</em> = Σx<sub>i</sub> / N (ou pondérée Σn<sub>i</sub>x<sub>i</sub> / N). Localise le centre, a <strong>l’unité de la variable</strong>, et est <strong>différente de la médiane si la distribution est dissymétrique</strong> (sensible aux valeurs extrêmes !). Ex. cours slide 41 : <code>3,3,3,3,4,4,5,5,5,5,7,9</code> (N=12) → M = 56/12 = 4,7.',
                '<strong>Médiane (Ch. 37 Q17 BC) :</strong> valeur du milieu qui partage la série en 2 moitiés égales (50 % / 50 %). <strong>Nécessite obligatoirement de ranger les valeurs par ordre croissant</strong> au préalable ! S’exprime dans l’unité de la variable. Si N impair : rang (N+1)/2 (ex. N=27 → 14e valeur = 163 cm) ; si N pair : demi-somme des 2 valeurs centrales.',
                '<strong>Mode (Ch. 37 Q26 ABC) :</strong> valeur la plus fréquente (dominante) ; s’observe dans une série, se calcule dans une distribution groupée ; <strong>égal à la médiane dans une distribution symétrique</strong> ; <strong>peut ne pas exister</strong> (ou être bi/plurimodal).'
              ]
            },
            {
              heading: 'Les paramètres de position : Quantiles',
              paragraphs: ['Ils divisent une série ordonnée en parts égales d’effectif (ce ne sont PAS des paramètres de dispersion !) :'],
              bullets: [
                '<strong>Quartiles (Ch. 37 Q27 AC) :</strong> au nombre de <strong>3</strong> (Q₁, Q₂, Q₃), divisent la distribution en <strong>4 parties égales</strong> (25 % chacune) ; <strong>Q₂ = Médiane</strong>.',
                '<strong>Déciles :</strong> au nombre de <strong>9</strong> (D₁ à D₉), divisent en <strong>10 parties égales</strong> ; <strong>D₅ = Médiane</strong>.',
                '<strong>Percentiles (Centiles) :</strong> au nombre de <strong>99</strong>, divisent en <strong>100 parties égales</strong> ; P₅₀ = Médiane.'
              ]
            }
          ],
          tables: [
            {
              title: 'Comparaison Moyenne / Médiane / Mode / Quantiles',
              headers: ['Paramètre', 'Famille', 'Condition / Propriété clé'],
              rows: [
                ['Moyenne arithmétique', 'Tendance centrale', 'Même unité que la variable ; sensible aux valeurs extrêmes ; ≠ médiane si dissymétrique'],
                ['Médiane (= Q₂ = D₅)', 'Tendance centrale / Position', 'Ranger par ordre croissant d’abord ; même unité ; robuste aux extrêmes'],
                ['Mode', 'Tendance centrale', 'Valeur la plus fréquente ; peut ne pas exister ; = médiane si symétrique unimodale'],
                ['Quartiles / Déciles / Percentiles', 'Position (Quantiles)', '3 quartiles (4 parts) | 9 déciles (10 parts) | 99 percentiles (100 parts) — PAS de dispersion !']
              ]
            }
          ],
          darija: 'رد بالك من 3 أفخاخ : (1) <strong>La médiane</strong> لازم قبل كل شي ترتب الأرقام تصاعديا (ordre croissant) وعندها نفس وحدة المتغير. (2) <strong>La moyenne</strong> عندها نفس وحدة المتغير وتختلف على la médiane كي تكون السلسلة غير متناظرة (dissymétrique). (3) <strong>Les quartiles</strong> عددهم <strong>3</strong> (يقسمو على 4) و<strong>Q₂ = Médiane</strong> وهما paramètres de <strong>position</strong> ماشي dispersion !',
          triad: {
            toUnderstand: [
              'Pourquoi la moyenne s’écarte de la médiane dans une distribution asymétrique (attraction par les extrêmes).'
            ],
            toMemorize: [
              'Moyenne, Médiane, Mode = tendance centrale (même unité que la variable).',
              'Médiane = nécessite tri croissant ; = Q₂ = D₅.',
              '3 quartiles (4 parts), 9 déciles (10 parts), 99 percentiles (100 parts).'
            ],
            toRecognizeInQcm: [
              '« La moyenne est sans unité » → FAUX (c’est le CV qui est sans unité !).',
              '« Les quartiles sont des paramètres de dispersion » → FAUX (ce sont des paramètres de position !).'
            ]
          }
        },
        memorize: [
          { id: 'M_L11.2_1', category: 'Définition', title: 'Moyenne, Médiane & Mode', content: '<strong>Moyenne :</strong> centre, même unité, ≠ médiane si dissymétrique. <strong>Médiane :</strong> exige <strong>ordre croissant</strong>, même unité, = Q₂. <strong>Mode :</strong> valeur dominante, peut ne pas exister, = médiane si symétrique.', highlight: true },
          { id: 'M_L11.2_2', category: 'Seuil / Chiffre', title: 'Les Quantiles (Position)', content: '<strong>Quartiles :</strong> <strong>3</strong> valeurs → 4 parts (Q₂ = Médiane). <strong>Déciles :</strong> <strong>9</strong> valeurs → 10 parts (D₅ = Médiane). <strong>Percentiles :</strong> <strong>99</strong> valeurs → 100 parts.', highlight: true }
        ]
      },
      {
        id: 'L11.3',
        courseId: 'C11',
        order: 3,
        title: 'Paramètres de dispersion (Étendue, Variance, Écart-type, CV)',
        durationMin: 13,
        sourceRef: 'Slides 62–69',
        bmCount: 10,
        bmRefs: ['Ch. 37 Q2–Q5 (2024)', 'Q9–Q11 (2022)', 'Q14, Q18 (2019)', 'Q24 (ND)'],
        priority: 'very_high',
        priorityScore: 95,
        bmWarning: '⚠️ 3 erreurs dans le corrigé BM Ch. 37 : Q14 (Étendue = C [max − min], PAS A [amplitude classe] !), Q11 (CV = BC, pas seulement C) et Q24 (CV = BDE, pas seulement BE).',
        understand: {
          intro: 'Deuxième pilier géant du Cours 11 : 10 QCM dans la BM ! La variance (4×) et le coefficient de variation (4×) sont parmi les définitions les plus répétées de toute l’épidémiologie à Batna.',
          sections: [
            {
              heading: 'Les 4 paramètres de dispersion & exemples exacts du cours',
              paragraphs: ['Les paramètres de dispersion mesurent à quel point les observations sont regroupées ou étalées autour du centre :'],
              bullets: [
                '<strong>Étendue (Ch. 37 Q9 C & Q14 C) :</strong> paramètre de dispersion = <strong>Valeur maximale − Valeur minimale</strong> (<em>X<sub>max</sub> − X<sub>min</sub></em>). <em>Ne jamais confondre avec l’amplitude d’une classe (borne sup − borne inf d’une classe) !</em>',
                '<strong>Variance S² (4× en BM : Q2, Q3, Q10, Q18) :</strong> mesure de l’<strong>étalement des valeurs observées par rapport à la valeur moyenne</strong>. <strong>Plus elle est élevée, plus les données sont éloignées de la moyenne.</strong> Formule slide 65 : <em>S² = Σ(x<sub>i</sub> − m)² / N</em> <em>(note : l’exemple numérique slide 67 utilise N−1 sur échantillon : Série 1 <code>15,20,25,30,35</code> → S² = 62,5, S = 7,9 ; Série 2 <code>5,15,25,35,45</code> → S² = 250, S = 15,8)</em>.',
                '<strong>Écart-type S :</strong> <strong>racine carrée de la variance</strong> (<em>S = √S²</em>), exprimé dans la même unité que la variable. Plus il est faible, plus les données sont concentrées autour de la moyenne.',
                '<strong>Coefficient de variation CV (4× en BM : Q4, Q5, Q11, Q24) :</strong> <em>CV = (s / m) × 100</em>. Exprime le degré de dispersion (l’écart-type) en fonction de la moyenne ; <strong>sans unité de mesure</strong> (exprimé en <strong>%</strong>) ; permet de comparer la variabilité de <strong>2 variables d’unités différentes</strong> dans une même population.'
              ]
            }
          ],
          tables: [
            {
              title: 'Récapitulatif des 4 formules de dispersion & pièges BM',
              headers: ['Paramètre', 'Formule exacte', 'Unité', 'Piège classique en QCM'],
              rows: [
                ['Étendue', 'Xmax − Xmin', 'Unité de la variable', '≠ amplitude d’une classe (⚠️ erreur BM Ch. 37 Q14 !)'],
                ['Variance (S²)', 'Σ(xi − m)² / N  (ou N−1 éch.)', '(Unité)²', '≠ racine carrée de l’écart-type (c’est l’inverse !)'],
                ['Écart-type (S)', '√(Variance) = √(S²)', 'Unité de la variable', 'C’est S qui est la racine carrée de S² !'],
                ['Coefficient de variation (CV)', '(s / m) × 100', 'SANS unité (en %)', '≠ moyenne / écart-type ! Exprimé en % (⚠️ BM Q11 & Q24)']
              ]
            }
          ],
          darija: 'احفظ 3 قواعد حديدية : (1) <strong>La variance</strong> = تباعد القيم على <strong>المتوسط (moyenne)</strong> (كلما تكبر كلما القيم بعاد). (2) <strong>L’écart-type</strong> هو الجذر التربيعي تاع la variance (ماشي العكس!). (3) <strong>CV = écart-type ÷ moyenne × 100</strong>، <strong>بلا وحدة</strong> ويخرج بـ <strong>%</strong>. و<strong>Étendue = max − min</strong> (تجاهل غلطة الـ BM في Q14!).',
          triad: {
            toUnderstand: [
              'Pourquoi le CV (sans dimension) est le seul outil permettant de comparer la dispersion d’un poids (en kg) et d’une glycémie (en g/L).'
            ],
            toMemorize: [
              'Variance = mesure de l’étalement par rapport à la moyenne.',
              'CV = (écart-type / moyenne) × 100 ; sans unité ; exprimé en %.',
              'Étendue = Xmax − Xmin (paramètre de dispersion).'
            ],
            toRecognizeInQcm: [
              '« CV = moyenne / écart-type » → PIÈGE FAUX (toujours s / m !).',
              '« La variance est la racine carrée de l’écart-type » → PIÈGE FAUX !',
              '« CV exprimé dans la même unité que la variable » → PIÈGE FAUX (sans unité, en % !).'
            ]
          }
        },
        memorize: [
          { id: 'M_L11.3_1', category: 'Définition', title: 'Variance (4× en BM)', content: 'Mesure de l’<strong>étalement des valeurs observées par rapport à la valeur moyenne</strong>. Plus elle est élevée, plus les données sont éloignées de la moyenne. <strong>Écart-type = √Variance</strong>.', highlight: true },
          { id: 'M_L11.3_2', category: 'Formule', title: 'Coefficient de variation — CV (4× en BM)', content: '<strong>CV = <span class="math-frac"><span>écart-type (s)</span><span>moyenne (m)</span></span> × 100</strong>. Paramètre de dispersion, <strong>sans unité</strong>, exprimé en <strong>%</strong>, compare 2 variables d’unités différentes.', highlight: true },
          { id: 'M_L11.3_3', category: 'Formule', title: 'Étendue (⚠️ Erreur BM Q14)', content: 'Paramètre de dispersion : <strong>Étendue = Valeur maximale − Valeur minimale</strong> (≠ amplitude d’une classe !).', highlight: true }
        ]
      }
    ]
  },

  // =========================================================================
  // COURS 12 — Test d'hypothèse : Comparaison de deux pourcentages (χ²)
  // =========================================================================
  {
    id: 'C12',
    moduleId: 'M4',
    code: 'C12',
    title: 'Test d’hypothèse : Comparaison de 2 pourcentages (Test du χ²)',
    shortTitle: 'Test du Chi-deux (χ²)',
    professor: 'Pr AOUIDANE (Université Batna 2)',
    sourceFiles: ['test d\'hypothèse  comparaison de 2 pourcentage.ppsx.pptx (29 slides)'],
    bmCount: 2,
    bmSharedNote: 'Tombe chaque année (2024 Ch. 42 Q4 & 2025 Ch. 43 Q1 reclassée !)',
    bmRecentCount: 2,
    uniqueConcepts: 1,
    priority: 'high',
    priorityScore: 67,
    vigilance2026: false,
    summary: 'Démarche hypothético-déductive (H₀ / H₁), risque α (a priori) vs p-value (a posteriori), χ² de conformité vs d’homogénéité, calcul complet sur tableau 2×2 (Cij ≥ 5, χ²o, ddl = (L−1)(C−1), seuil 3,841) et règle de décision.',
    lessons: [
      {
        id: 'L12.1',
        courseId: 'C12',
        order: 1,
        title: 'Démarche hypothético-déductive, risque α vs p-value & types de χ²',
        durationMin: 10,
        sourceRef: 'Slides 5–15',
        bmCount: 0,
        bmRefs: [],
        priority: 'low',
        priorityScore: 25,
        understand: {
          intro: 'Avant de faire le calcul du χ², il faut comprendre parfaitement le sens de H₀, H₁, du risque α et de la p-value pour ne tomber dans aucun piège de formulation théorique.',
          sections: [
            {
              heading: 'Les 4 étapes de la démarche hypothético-déductive',
              paragraphs: ['Le <strong>but d’un test statistique</strong> (slide 5) est de déterminer si la différence observée entre deux échantillons est due au <strong>hasard</strong> (fluctuations d’échantillonnage) ou si elle est <strong>réelle</strong> :'],
              bullets: [
                '<strong>1) Hypothèse nulle (H₀) :</strong> absence de différence (<em>P<sub>A</sub> = P<sub>B</sub></em>) — hypothèse de départ que l’on cherche à invalider/rejeter.',
                '<strong>2) Hypothèse alternative (H₁) :</strong> retenue si H₀ est rejetée ; en formulation <strong>bilatérale</strong> : <em>P<sub>A</sub> ≠ P<sub>B</sub></em> (sans préciser le sens).',
                '<strong>3) Risque de 1ère espèce (α) :</strong> risque de <strong>rejeter à tort H₀</strong> (conclure à une différence qui n’existe pas) ; fixé <strong>a priori</strong> avant tout calcul (généralement <strong>α = 0,05 = 5 %</strong>).',
                '<strong>4) Degré de signification (p-value) :</strong> probabilité d’observer une valeur du test au moins aussi grande si H₀ est vraie ; déterminé <strong>a posteriori</strong> après calcul.'
              ]
            }
          ],
          tables: [
            {
              title: '2 Distinctions fondamentales du cours du Pr Aouidane',
              headers: ['Concept A', 'Concept B', 'Différence clé'],
              rows: [
                ['Risque α (seuil)', 'Degré de signification (p-value)', 'α est fixé A PRIORI (ex. 5 %) avant calcul ; p est déterminé A POSTERIORI après calcul'],
                ['χ² de conformité (ajustement)', 'χ² d’homogénéité', 'Conformité = 1 échantillon vs distribution théorique connue ; Homogénéité = ≥ 2 échantillons comparés entre eux'],
                ['Effectifs (Oij, Cij)', 'Pourcentages (%)', 'Le test du χ² compare des pourcentages mais se calcule TOUJOURS sur des EFFECTIFS !']
              ]
            }
          ],
          darija: 'الفرق بين <strong>α</strong> و <strong>p</strong> ساهل : <strong>α</strong> نحددوه <strong>قبل الحساب (a priori = 5 %)</strong> وهو خطر نرفضو H₀ بالغلط؛ أما <strong>p-value</strong> تخرج <strong>بعد الحساب (a posteriori)</strong> من الجدول. و<strong>χ² de conformité</strong> = عينة وحدة ضد نظرية، أما <strong>d’homogénéité</strong> = زوج عينات ولا أكثر ضد بعضاهم.',
          triad: {
            toUnderstand: [
              'Pourquoi on teste toujours H₀ (égalité) pour voir si les données la contredisent au-delà du hasard.'
            ],
            toMemorize: [
              'α = risque de rejeter H₀ à tort, fixé a priori (5 %) ; p = déterminé a posteriori.',
              'χ² de conformité (1 échantillon vs théorique) vs χ² d’homogénéité (≥ 2 échantillons).',
              'Le χ² se calcule toujours sur des EFFECTIFS (jamais directement sur des pourcentages).'
            ],
            toRecognizeInQcm: [
              '« α est calculé a posteriori » → FAUX (c’est a priori !).',
              '« On applique directement la formule du χ² sur les pourcentages » → FAUX (sur les effectifs !).'
            ]
          }
        },
        memorize: [
          { id: 'M_L12.1_1', category: 'Distinction', title: 'Risque α vs Degré de signification (p)', content: '<strong>Risque α :</strong> risque de rejeter à tort H₀, fixé <strong>a priori</strong> (5 %). <strong>p-value :</strong> déterminée <strong>a posteriori</strong> après calcul de χ²o.', highlight: true },
          { id: 'M_L12.1_2', category: 'Distinction', title: 'χ² de conformité vs χ² d’homogénéité', content: '<strong>Conformité (ajustement) :</strong> 1 échantillon vs distribution théorique. <strong>Homogénéité :</strong> ≥ 2 échantillons entre eux. Toujours calculé sur des <strong>effectifs</strong> !', highlight: true }
        ]
      },
      {
        id: 'L12.2',
        courseId: 'C12',
        order: 2,
        title: 'Calcul pas à pas du χ² sur tableau 2×2 (Cij ≥ 5, ddl, seuil 3,841)',
        durationMin: 13,
        sourceRef: 'Slides 16–27',
        bmCount: 2,
        bmRefs: ['Ch. 43 Q1 (2025 — reclassé !)', 'Ch. 42 Q4 (2024 — incomplet)'],
        priority: 'high',
        priorityScore: 67,
        bmWarning: 'ℹ️ Anomalies BM signalées : Ch. 42 Q4 (2024) est imprimée sans tableau ni options, et Ch. 43 Q1 (2025) a été classée par erreur dans « Validité d’un test diagnostic » avec une photo de tableau corrompue (mais sa logique χ² = 0,40 < 3,841 ⇒ non significatif est exacte !).',
        understand: {
          intro: 'Un exercice pratique de tableau 2×2 est tombé en 2024 ET en 2025 ! La recette en 4 étapes ci-dessous est toujours identique et vous garantit des points faciles.',
          sections: [
            {
              heading: 'La recette en 4 étapes + exemple exact du cours (Slide 27)',
              paragraphs: ['Pour tout tableau de contingence à <em>L</em> lignes et <em>C</em> colonnes (<em>N</em> observations) :'],
              bullets: [
                '<strong>Étape 1 — Effectifs théoriques C<sub>ij</sub> :</strong> C<sub>ij</sub> = (Total ligne <em>i</em> × Total colonne <em>j</em>) / N. <strong>Condition absolue : tous les effectifs THÉORIQUES C<sub>ij</sub> doivent être ≥ 5</strong> (pas les effectifs observés !).',
                '<strong>Étape 2 — Calcul de χ²<sub>o</sub> :</strong> χ²<sub>o</sub> = Σ (O<sub>ij</sub> − C<sub>ij</sub>)² / C<sub>ij</sub> (somme sur les 4 cases pour un tableau 2×2).',
                '<strong>Étape 3 — Degrés de liberté :</strong> ddl = (L − 1)(C − 1). Pour un 2×2 : <strong>ddl = 1</strong> → valeur critique au risque α = 5 % : <strong>χ²<sub>5%</sub> = 3,841</strong>.',
                '<strong>Étape 4 — Prise de décision (slides 25–27) :</strong> Si χ²<sub>o</sub> > 3,841 (<em>p</em> < 0,05) → <strong>Rejet de H₀</strong> (différence <strong>statistiquement significative</strong>). Si χ²<sub>o</sub> ≤ 3,841 (<em>p</em> ≥ 0,05) → <strong>Non-rejet de H₀</strong> (NE JAMAIS dire « on accepte H₀ » ! Différence non significative, due au hasard).',
                '<strong>Exemple du cours (slide 27) :</strong> χ²<sub>o</sub> = 3,125 (ddl = 1). Comme 2,706 < 3,125 < 3,841, on a 0,05 < <em>p</em> < 0,10 → <strong>non-rejet de H₀</strong> (différence non significative).'
              ]
            }
          ],
          tables: [
            {
              title: 'Ligne essentielle de la table du χ² à connaître par cœur (ddl = 1)',
              headers: ['Risque α', '0,10 (10 %)', '0,05 (5 %) ★', '0,01 (1 %)', '0,001 (0,1 %)'],
              rows: [
                ['Valeur critique χ²α (ddl = 1)', '2,706', '3,841', '6,635', '10,827']
              ]
            }
          ],
          darija: 'في جدول 2×2 (ddl = 1) عند α = 5 %، الرقم السحري هو <strong>3,841</strong> ! إذا خرجلك <strong>χ² كبير على 3,841</strong> ← <strong>Rejet de H₀ (Significatif)</strong>. إذا خرج <strong>صغير على 3,841</strong> (كيما 3,125 في الكور ولا 0,40 في QCM 2025) ← <strong>Non-rejet de H₀ (Non significatif)</strong> — وما تقولش jamais « on accepte H₀ » ! وديما الشرط على <strong>effectifs théoriques Cij ≥ 5</strong>.',
          triad: {
            toUnderstand: [
              'Comment encadrer la p-value grâce à la table (ex. 2,706 < 3,125 < 3,841 ⇒ 0,05 < p < 0,10).'
            ],
            toMemorize: [
              'Cij = (Total ligne × Total colonne) / N ; condition : tous les Cij ≥ 5 (théoriques !).',
              'χ²o = Σ (Oij − Cij)² / Cij ; ddl = (L − 1)(C − 1) ; seuil 5 % pour ddl=1 : 3,841.',
              'Toujours dire « non-rejet de H₀ » (jamais « acceptation de H₀ »).'
            ],
            toRecognizeInQcm: [
              '« Condition d’application : effectifs observés ≥ 5 » → PIÈGE FAUX (effectifs THÉORIQUES Cij ≥ 5 !).',
              'χ²o = 0,40 < 3,841 → Test statistiquement non significatif (Ch. 43 Q1 BD).'
            ]
          }
        },
        memorize: [
          { id: 'M_L12.2_1', category: 'Formule', title: 'Effectif théorique & Condition d’application', content: 'C<sub>ij</sub> = <span class="math-frac"><span>Total ligne i × Total col. j</span><span>N</span></span>. Condition absolue : <strong>tous les effectifs THÉORIQUES C<sub>ij</sub> ≥ 5</strong>.', highlight: true },
          { id: 'M_L12.2_2', category: 'Formule', title: 'Formule du χ² observé & ddl', content: '<strong>χ²<sub>o</sub> = Σ <span class="math-frac"><span>(O<sub>ij</sub> − C<sub>ij</sub>)²</span><span>C<sub>ij</sub></span></span></strong> ; <strong>ddl = (L − 1)(C − 1)</strong> (= 1 pour un tableau 2×2).', highlight: true },
          { id: 'M_L12.2_3', category: 'Seuil / Chiffre', title: 'Seuil critique (ddl = 1) & Décision', content: 'Pour ddl = 1, α = 5 % : <strong>χ²<sub>5%</sub> = 3,841</strong> (10 % : 2,706 ; 1 % : 6,635). Si χ²<sub>o</sub> > 3,841 → <strong>Rejet de H₀ (Significatif)</strong> ; si ≤ 3,841 → <strong>Non-rejet de H₀ (Non significatif)</strong>.', highlight: true }
        ]
      }
    ]
  }
);
