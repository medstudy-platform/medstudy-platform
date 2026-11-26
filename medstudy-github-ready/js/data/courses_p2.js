/* ==========================================================================
   Cours Partie 2 : C4 (Investigation), C5 (TIAC), C6 (IAS & Hygiène)
   Contenu 100 % fidèle aux supports officiels Batna 2
   ========================================================================== */
window.EpiData.courses.push(
  // =========================================================================
  // COURS 4 — Investigation d'une épidémie
  // =========================================================================
  {
    id: 'C4',
    moduleId: 'M2',
    code: 'C4',
    title: 'Investigation d’une épidémie',
    shortTitle: 'Investigation Épidémie',
    professor: 'Dr F. BEICHI (Université Batna 2)',
    sourceFiles: ['investigation d\'une épidémie.pdf (8 pages)'],
    bmCount: 12,
    bmSharedNote: '+ 2 liens directs en C5 (TIAC Ch. 6 Q1–Q2) — 5 QCM en 2025 !',
    bmRecentCount: 5,
    uniqueConcepts: 8,
    priority: 'very_high',
    priorityScore: 86,
    vigilance2026: false,
    summary: 'Définitions (épidémie, outbreak, endémie, pandémie, source ponctuelle vs persistante), objectifs, phase descriptive (fausses épidémies, collecte de cas, courbe épidémique, taux d’attaque) et phase analytique (cohorte rétrospective vs cas-témoins).',
    lessons: [
      {
        id: 'L4.1',
        courseId: 'C4',
        order: 1,
        title: 'Définitions de base (Épidémie, Outbreak, Sources) & objectifs',
        durationMin: 10,
        sourceRef: '§ I et II, pages 2–3',
        bmCount: 5,
        bmRefs: ['Ch. 19 Q1 (2025)', 'Ch. 19 Q4 (2025)', 'Ch. 19 Q5 (2025)', 'Ch. 19 Q6 (2025)', 'Ch. 19 Q15 (ND)'],
        priority: 'very_high',
        priorityScore: 86,
        understand: {
          intro: 'Quatre questions sur 5 tombées en 2025 dans le chapitre Investigation portent directement sur les définitions des pages 2 et 3 ! Chaque mot compte.',
          sections: [
            {
              heading: 'Objectifs généraux d’une investigation épidémiologique',
              paragraphs: ['L’investigation est une intervention <strong>rapide et limitée dans le temps</strong> (contrairement à la surveillance qui est permanente).'],
              bullets: [
                '<strong>Objectifs principaux (Ch. 19 Q1 C) :</strong> <strong>interrompre la transmission / arrêter l’épidémie</strong> et <strong>prévenir la survenue de nouveaux cas / épisodes</strong>.',
                '<strong>Objectifs secondaires :</strong> approfondir les connaissances sur la maladie/agent, évaluer ou créer un système de surveillance, enseigner l’épidémiologie de terrain.'
              ]
            },
            {
              heading: 'Source ponctuelle vs Source persistante & Véhicule',
              paragraphs: ['La distinction sur la durée d’émission de l’agent pathogène est tombée en 2025 (`Ch. 19 Q4`) :'],
              bullets: [
                '<strong>Source ponctuelle :</strong> libère l’agent pathogène sur une <strong>courte période uniquement</strong> (ex. repas contaminé dans une TIAC) → un seul pic bref.',
                '<strong>Source persistante :</strong> libère l’agent de manière <strong>continue/prolongée</strong> (ex. pollution/eau contaminée en continu — piège : PAS « épisodique » !).',
                '<strong>Véhicule :</strong> support physique assurant la diffusion entre la source et la population (ex. aliment, eau).'
              ]
            }
          ],
          tables: [
            {
              title: 'Distinction Temps / Espace des phénomènes épidémiques',
              headers: ['Terme', 'Temps', 'Espace', 'Définition clé'],
              rows: [
                ['Épidémie', 'Limité', 'Limité', 'Excès de cas par rapport au niveau habituel/attendu (Ch. 19 Q6 B & Q15 CD)'],
                ['Outbreak (cas groupés)', 'Limité', 'Très circonscrit', 'Épidémie de taille limitée géographiquement ou dans le temps (Ch. 19 Q5 B)'],
                ['Endémie', 'Illimité (constante)', 'Limité', 'Présence habituelle continue ou discontinue dans une région'],
                ['Pandémie', 'Limité (vagues)', 'Illimité', 'Épidémie très étendue géographiquement (plusieurs continents)'],
                ['Éclosion', 'Début', 'Limité', 'Développement initial d’une épidémie']
              ]
            }
          ],
          darija: 'فرق ساهل بزاف وطاح 4 مرات في 2025 : <strong>Épidémie</strong> = حالات زايدة على المتوقع ومحدودة في الزمان والمكان. <strong>Outbreak</strong> = وباء صغير ومحدود. <strong>Source ponctuelle</strong> = تطلق الميكروب لمدة <strong>قصيرة برك</strong> (pic واحد)؛ أما <strong>Source persistante</strong> = تطلقو بشكل <strong>مستمر (continue)</strong> ماشي متقطع (épisodique) !',
          triad: {
            toUnderstand: [
              'La différence entre une investigation (ponctuelle, rapide) et la surveillance (permanente).',
              'Comment la dynamique d’exposition (source ponctuelle vs persistante) façonne la courbe épidémique.'
            ],
            toMemorize: [
              'Épidémie = excès de cas par rapport au niveau attendu, limitée dans le temps ET l’espace.',
              'Outbreak = épidémie limitée géographiquement ou dans le temps.',
              'Objectif principal = interrompre la transmission et prévenir de nouveaux cas.'
            ],
            toRecognizeInQcm: [
              '« source persistante émet de manière épisodique » → FAUX (c’est continu !).',
              '« augmentation saisonnière prévue » → FAUX (ce n’est pas une épidémie).'
            ]
          }
        },
        memorize: [
          { id: 'M_L4.1_1', category: 'Définition', title: 'Épidémie & Outbreak', content: '<strong>Épidémie :</strong> excès de cas par rapport au niveau attendu, <strong>limitée dans le temps et l’espace</strong>. <strong>Outbreak :</strong> épidémie limitée géographiquement ou dans le temps.', highlight: true },
          { id: 'M_L4.1_2', category: 'Distinction', title: 'Source ponctuelle vs Source persistante', content: '<strong>Ponctuelle :</strong> libère l’agent sur une <strong>courte période</strong> (pic unique). <strong>Persistante :</strong> émission <strong>continue</strong> (jamais « épisodique » !).', highlight: true },
          { id: 'M_L4.1_3', category: 'Distinction', title: 'Endémie vs Pandémie', content: '<strong>Endémie :</strong> illimitée dans le temps, limitée dans l’espace. <strong>Pandémie :</strong> illimitée dans l’espace (continents).', highlight: false },
          { id: 'M_L4.1_4', category: 'Liste', title: 'Objectif principal de l’investigation', content: '<strong>Interrompre la transmission (arrêter l’épidémie)</strong> et <strong>prévenir de nouveaux cas / épisodes</strong>.', highlight: true }
        ]
      },
      {
        id: 'L4.2',
        courseId: 'C4',
        order: 2,
        title: 'Phase descriptive (Étapes 1–5) : courbe épidémique & taux d’attaque',
        durationMin: 14,
        sourceRef: '§ III.3.2 Étapes 1 à 5, pages 4–6',
        bmCount: 5,
        bmRefs: ['Ch. 19 Q3 (2025)', 'Ch. 19 Q8 (2022)', 'Ch. 14 Q49 (ND)', 'Ch. 19 Q13 (2022)', 'Ch. 17 Q32 (2019)'],
        priority: 'very_high',
        priorityScore: 80,
        bmWarning: '⚠️ Erreur corrigé BM sur Ch. 14 Q49 : le BM ne donne que B pour la courbe épidémique alors que le cours (p. 6) prouve que B (incubation), C (type de transmission) et D (nature de la source) sont tous trois justes !',
        understand: {
          intro: 'La phase descriptive répond aux questions « Qui, Où, Quand ? » à travers les 5 premières étapes de l’investigation, pour faire émerger des hypothèses solides.',
          sections: [
            {
              heading: 'Les 5 étapes de la phase descriptive',
              paragraphs: ['Ces étapes peuvent se chevaucher sur le terrain, mais suivent une logique rigoureuse :'],
              bullets: [
                '<strong>Étape 1 — Affirmer la réalité de l’épidémie :</strong> cas observés > cas attendus, après avoir éliminé les <strong>5 causes de fausse épidémie</strong> (variation saisonnière, erreur diagnostique, contamination de milieux de culture au labo, doublons de déclaration, notification groupée).',
                '<strong>Étape 2 — Confirmer le diagnostic :</strong> examen clinique + prélèvements microbiologiques.',
                '<strong>Étape 3 — Définir un cas :</strong> critères cliniques/biologiques + temps/lieu/personne. Si la maladie est mal connue, <strong>privilégier la sensibilité</strong> (cas certains, probables, possibles).',
                '<strong>Étape 4 — Collecter les cas et les données (Ch. 19 Q3 B) :</strong> à partir des <strong>dossiers hospitaliers, registres et laboratoires de diagnostic</strong>. Donnée temporelle indispensable = <strong>date de début des symptômes</strong> (jamais la date de déclaration !).',
                '<strong>Étape 5 — Décrire l’épidémie :</strong> Temps (<strong>courbe épidémique</strong>), Lieu (cartographie), Personne (âge, sexe, <strong>taux d’attaque</strong>).'
              ]
            }
          ],
          tables: [
            {
              title: 'Ce que donne (et NE donne PAS) la courbe épidémique (Étape 5A)',
              headers: ['Renseignement apporté ?', 'Détail exact du cours (p. 6)'],
              rows: [
                ['✅ OUI — Durée d’incubation', 'Permet d’estimer la période probable d’exposition et la durée d’incubation'],
                ['✅ OUI — Type de transmission', 'Oriente entre source commune et transmission interhumaine (vagues successives)'],
                ['✅ OUI — Nature de la source', 'Oriente entre source ponctuelle (pic bref) et source persistante (plateau/prolongé)'],
                ['❌ NON — Certitude sur l’agent causal', 'NE renseigne JAMAIS avec certitude sur la nature du germe (seul le laboratoire / Étape 8 le confirme !)']
              ]
            }
          ],
          darija: '<strong>La courbe épidémique</strong> تعطيك 3 حوايج : <strong>Incubation + Type de transmission + Nature de la source</strong> (يعني <strong>BCD</strong>). بصح <strong>عمرها ما تأكدلك باليقين (avec certitude) اسم الميكروب</strong> ! والـ <strong>Taux d’attaque</strong> = عدد المرضى ÷ عدد السكان المعرضين للخطر.',
          triad: {
            toUnderstand: [
              'Pourquoi on trace la courbe épidémique avec la date de début des symptômes (et non la date de notification).',
              'Pourquoi on privilégie la sensibilité au début d’une épidémie mal connue (éviter de manquer des cas).'
            ],
            toMemorize: [
              'Courbe épidémique = incubation + transmission + source (JAMAIS certitude sur l’agent causal).',
              'Taux d’attaque = Nombre de sujets atteints / Population exposée (de la zone).',
              'Collecte des cas = dossiers hospitaliers, registres et laboratoires de diagnostic.'
            ],
            toRecognizeInQcm: [
              '« renseigne avec certitude sur l’agent causal » → PIÈGE FAUX !',
              '« nombre de sujets atteints / population de la zone » lors d’une épidémie → Taux d’attaque (Ch. 19 Q13 & Ch. 17 Q32).'
            ]
          }
        },
        memorize: [
          { id: 'M_L4.2_1', category: 'Liste', title: 'Les 5 causes de fausse épidémie (Étape 1)', content: '1) Variation saisonnière, 2) Erreur diagnostique, 3) Contamination des milieux de culture, 4) Doublons, 5) Notification groupée.', highlight: false },
          { id: 'M_L4.2_2', category: 'Piège QCM', title: 'Courbe épidémique (Étape 5A)', content: 'Informe sur : <strong>durée d’incubation</strong>, <strong>type de transmission</strong> et <strong>nature de la source</strong>. <strong>NE renseigne JAMAIS avec certitude sur l’agent causal !</strong>', highlight: true },
          { id: 'M_L4.2_3', category: 'Formule', title: 'Taux d’attaque (TA)', content: 'TA = <span class="math-frac"><span>Nombre de sujets atteints (nouveaux cas)</span><span>Nombre de sujets de la population exposée</span></span> × 100.', highlight: true },
          { id: 'M_L4.2_4', category: 'Liste', title: 'Collecte des cas (Étape 4 — 2025)', content: 'Repose sur les <strong>dossiers hospitaliers, registres et laboratoires de diagnostic</strong>. Date clé : <strong>date de début des symptômes</strong>.', highlight: true }
        ]
      },
      {
        id: 'L4.3',
        courseId: 'C4',
        order: 3,
        title: 'Phase analytique (Étapes 6–10) : cohorte, cas-témoins & mesures',
        durationMin: 10,
        sourceRef: '§ III.3.2 Étapes 6 à 10, pages 6–7',
        bmCount: 2,
        bmRefs: ['Ch. 19 Q9 (2022)', 'Ch. 19 Q14 (2019)', '+ Ch. 6 Q1–Q2 (2024)'],
        priority: 'high',
        priorityScore: 67,
        understand: {
          intro: 'Une fois les hypothèses formulées par la phase descriptive (Étape 6), la phase analytique (Étape 7) teste statistiquement le lien entre l’exposition suspectée et la maladie, sans jamais retarder les mesures de contrôle.',
          sections: [
            {
              heading: 'Étapes 6 à 10 : de l’hypothèse aux mesures de prévention',
              paragraphs: ['L’investigation suit toujours l’ordre <strong>phase descriptive PUIS phase analytique</strong> :'],
              bullets: [
                '<strong>Étape 6 :</strong> Formuler des hypothèses (agent, source, véhicule, mode de transmission).',
                '<strong>Étape 7 — Tester les hypothèses (Phase étiologique/analytique) :</strong> utilisation d’une <strong>étude de cohorte rétrospective</strong> (Ch. 19 Q14 C) ou d’une <strong>étude cas-témoins</strong>.',
                '<strong>Étape 8 — Preuve biologique :</strong> prélèvements sur les cas, les sources et les véhicules (aliments/eau).',
                '<strong>Étape 9 — Rapport d’investigation</strong> et diffusion aux autorités.',
                '<strong>Étape 10 — Mesures de prévention et contrôle :</strong> <strong>NE PAS attendre la fin de l’investigation</strong> — mesures générales dès le début, puis mesures spécifiques dès l’identification de la source.'
              ]
            }
          ],
          tables: [
            {
              title: 'Phase analytique (Étape 7) : Cohorte rétrospective vs Cas-témoins',
              headers: ['Critère', 'Enquête de cohorte rétrospective', 'Enquête cas-témoins'],
              rows: [
                ['Quand l’utiliser ?', 'Population exposée bien définie et circonscrite (ex. invités d’un banquet, cantine)', 'Population vaste ou mal connue (ex. toute une ville)'],
                ['Ce qu’on compare', 'Taux d’attaque chez les exposés vs les non-exposés (Risque Relatif)', 'Proportion d’exposés parmi les cas vs parmi les témoins (Odds Ratio)']
              ]
            }
          ],
          darija: 'ديما نبداو بالـ <strong>Phase descriptive</strong> (التصديق على الوباء + تحديد الأشخاص المعرضين للخطر) ومبعد <strong>Phase analytique / étiologique</strong> (باستعمال <strong>Cohorte rétrospective</strong> ولا <strong>Cas-témoins</strong>). و<strong>ما نستناوش نهاية التحقيق</strong> باش نبداو إجراءات الوقاية (Étape 10) !',
          triad: {
            toUnderstand: [
              'La frontière exacte entre ce qui appartient à la phase descriptive (Étapes 1–6) et à la phase analytique/conclusive (Étapes 7–10).',
              'Quand choisir cohorte rétrospective vs cas-témoins sur le terrain.'
            ],
            toMemorize: [
              'Phase descriptive = affirmation de l’épidémie + identification des personnes à risque (Ch. 19 Q9 AB).',
              'Phase étiologique = approche cohorte rétrospective (Ch. 19 Q14 C) ou cas-témoins.',
              'Mesures de prévention : dès le début (générales), puis spécifiques (ne pas attendre la fin).'
            ],
            toRecognizeInQcm: [
              'La rédaction du rapport et l’étude analytique approfondie ne font PAS partie de la phase descriptive (Ch. 19 Q9).',
              'Phase étiologique → cocher « approche cohorte » (pas transversale ni expérimentale).'
            ]
          }
        },
        memorize: [
          { id: 'M_L4.3_1', category: 'Distinction', title: 'Phase descriptive vs Phase analytique', content: '<strong>Descriptive (Étapes 1–6) :</strong> affirmer l’épidémie, confirmer diag, définir/collecter cas, décrire T/L/P, identifier personnes à risque. <strong>Analytique (Étape 7) :</strong> tester les hypothèses (<strong>cohorte rétrospective</strong> ou <strong>cas-témoins</strong>).', highlight: true },
          { id: 'M_L4.3_2', category: 'Distinction', title: 'Cohorte rétrospective vs Cas-témoins', content: '<strong>Cohorte rétrospective :</strong> compare les <strong>taux d’attaque</strong> (exposés vs non-exposés). <strong>Cas-témoins :</strong> compare les <strong>proportions d’exposés</strong> (cas vs témoins).', highlight: true },
          { id: 'M_L4.3_3', category: 'Piège QCM', title: 'Règle d’or de l’Étape 10', content: '<strong>Ne jamais attendre la fin de l’investigation</strong> pour instaurer des mesures de contrôle (générales d’abord, spécifiques ensuite).', highlight: true }
        ]
      }
    ]
  },

  // =========================================================================
  // COURS 5 — Conduite à tenir devant une TIAC & Prévention
  // =========================================================================
  {
    id: 'C5',
    moduleId: 'M2',
    code: 'C5',
    title: 'Conduite à tenir devant une TIAC & Prévention',
    shortTitle: 'CAT TIAC & Prévention',
    professor: 'Dr NOURANI Imane + Instructions MS 2024 & 2026',
    sourceFiles: ['CAT TIAC.pdf (20 slides)', 'Cours_Epidemiologie_TIAC.pdf (Instr. N°19/2026, 9 p.)', 'INSTRUCTION TIAC.pdf (Instr. N°18/2024, 4 p.)'],
    bmCount: 5,
    bmSharedNote: '5 QCM en 2024 + 2 instructions ministérielles 2024–2026 dans votre dossier',
    bmRecentCount: 5,
    uniqueConcepts: 4,
    priority: 'high',
    priorityScore: 68,
    vigilance2026: true,
    summary: 'Définition TIAC (exception botulisme = 1 cas), urgence médico-épidémiologique, déclaration et investigation, germes et incubations, règles de prélèvement (ne pas congeler), traitement (Imodium proscrit) et prévention (5 Clés OMS, marche en avant, plat témoin).',
    lessons: [
      {
        id: 'L5.1',
        courseId: 'C5',
        order: 1,
        title: 'Définition, urgence, déclaration obligatoire & investigation TIAC',
        durationMin: 10,
        sourceRef: 'CAT TIAC slides 2–10 ; Instr. 2026 p. 1 & 4–5',
        bmCount: 5,
        bmRefs: ['Ch. 6 Q1 (2024)', 'Ch. 6 Q2 (2024)', 'Ch. 6 Q3 (2024)', 'Ch. 6 Q4 (2024)', 'Ch. 6 Q5 (2024)'],
        priority: 'high',
        priorityScore: 65,
        understand: {
          intro: 'Toutes les 5 questions de la BM Ch. 6 (2024) portent sur cette première leçon : définition, caractère d’urgence, déclaration obligatoire, facteurs favorisants et enquête descriptive puis analytique.',
          sections: [
            {
              heading: 'Définition exacte, statut & chiffres Algérie',
              paragraphs: ['Une <strong>TIAC</strong> est l’apparition d’<strong>au moins 2 cas groupés similaires</strong> d’une symptomatologie en général gastro-intestinale rapportable à une même origine alimentaire ou hydrique, <strong>SAUF pour le botulisme où 1 seul cas suffit</strong> !'],
              bullets: [
                '<strong>Statut :</strong> maladie transmissible, <strong>NON contagieuse</strong>, à <strong>déclaration obligatoire (MDO)</strong>, constituant une <strong>urgence médicale et épidémiologique</strong> (Ch. 6 Q5 A).',
                '<strong>Gravité :</strong> généralement bénigne (~10 % hospitalisation, 0,005 % décès) ; facteurs de gravité = germe (inoculum, virulence) + hôte (immunodéprimé, femme enceinte, âges extrêmes).',
                '<strong>Écart documentaire Algérie :</strong> ~3 000 cas/an dans les slides (`CAT TIAC.pdf`) vs ~10 000 cas/an depuis 2022 dans `Instr. N°19/2026` — connaître les deux repères !'
              ]
            },
            {
              heading: 'Déclaration, circuit & enquête en 2 temps',
              paragraphs: ['Dès suspicion d’une TIAC, le médecin doit agir immédiatement :'],
              bullets: [
                '<strong>Déclaration (Ch. 6 Q3 B) :</strong> <strong>signalement rapide immédiat</strong> (par téléphone au SEMEP) <strong>ET notification écrite sur un relevé des MDO</strong> (déclaration « zéro cas » hebdomadaire).',
                '<strong>Circuit intersectoriel :</strong> Médecin → <strong>SEMEP</strong> → <strong>DSP / MS / INSP</strong> + enquête conjointe avec <strong>BHC</strong> (Bureau d’Hygiène Communale) et <strong>DCP</strong> (Commerce) → Prélèvements à l’<strong>IPA</strong> ou Labo d’Hygiène de Wilaya.',
                '<strong>Enquête épidémiologique (Ch. 6 Q1–Q2 C) :</strong> toujours une <strong>étape descriptive suivie d’une étape analytique</strong>.',
                '<strong>Facteurs favorisants (Ch. 6 Q4 B) :</strong> erreurs dans le processus de préparation des aliments, rupture de chaîne du froid, délai prolongé préparation-consommation.'
              ]
            }
          ],
          tables: [
            {
              title: 'Synthèse des 5 points tombés en 2024 (BM Ch. 6)',
              headers: ['Thème QCM 2024', 'Réponse exacte à retenir'],
              rows: [
                ['Nature de la TIAC (Q5)', 'Urgence médicale ET épidémiologique'],
                ['Déclaration (Q3)', 'Signalement rapide + notification sur un relevé des MDO'],
                ['Investigation (Q1 & Q2)', 'Enquête descriptive PUIS enquête analytique'],
                ['Facteurs favorisants (Q4)', 'Erreurs dans le processus de préparation des aliments']
              ]
            }
          ],
          darija: 'الـ TIAC لازم <strong>زوج حالات على الأقل (≥ 2 cas)</strong> من نفس الماكلة، <strong>إلا الـ Botulisme حالة وحدة تكفي !</strong> وهي مرض <strong>transmissible بصح NON contagieuse</strong>، وتصريحها يكون بـ <strong>signalement rapide + relevé MDO</strong>، والتحقيق ديما <strong>descriptive ومن بعد analytique</strong>.',
          triad: {
            toUnderstand: [
              'Pourquoi la TIAC est une urgence à la fois médicale (soins/réhydratation) et épidémiologique (retirer l’aliment contaminé avant d’autres cas).',
              'Le rôle conjoint du SEMEP, du BHC, de la DCP et de l’IPA.'
            ],
            toMemorize: [
              'Définition TIAC (≥ 2 cas, SAUF botulisme = 1 cas) ; transmissible NON contagieuse.',
              'Déclaration = signalement rapide + relevé MDO ; Enquête = descriptive PUIS analytique.'
            ],
            toRecognizeInQcm: [
              'Respect de la chaîne du froid et délai réduit = facteurs PROTECTEURS (ne pas cocher comme favorisants !).',
              'Ne pas inverser l’ordre : descriptive d’abord, analytique ensuite.'
            ]
          }
        },
        memorize: [
          { id: 'M_L5.1_1', category: 'Définition', title: 'Définition TIAC & exception botulisme', content: '<strong>≥ 2 cas groupés similaires</strong> de symptomatologie généralement gastro-intestinale de même origine alimentaire/hydrique, <strong>SAUF botulisme : 1 seul cas suffit</strong>.', highlight: true },
          { id: 'M_L5.1_2', category: 'Piège QCM', title: 'Statut épidémiologique de la TIAC', content: 'Maladie transmissible, <strong>NON contagieuse</strong>, MDO, <strong>urgence médicale et épidémiologique</strong>.', highlight: true },
          { id: 'M_L5.1_3', category: 'Liste', title: 'Déclaration & Enquête TIAC', content: '<strong>Signalement rapide + notification sur relevé MDO</strong> au SEMEP (→ DSP, MS, INSP + BHC/DCP). Enquête : <strong>descriptive PUIS analytique</strong>.', highlight: true }
        ]
      },
      {
        id: 'L5.2',
        courseId: 'C5',
        order: 2,
        title: 'Germes, incubations, prélèvements & traitement des TIAC',
        durationMin: 13,
        sourceRef: 'Cours_Epidemiologie_TIAC.pdf (Instr. N°19/2026), p. 1–8',
        bmCount: 0,
        bmRefs: [],
        priority: 'low',
        priorityScore: 30,
        understand: {
          intro: '⚠️ Vigilance 2026 : votre dossier contient l’Instruction ministérielle détaillée N°19 (2026) avec le tableau complet des germes, les normes strictes de prélèvement et les contre-indications thérapeutiques.',
          sections: [
            {
              heading: 'Règles d’or des prélèvements (Annexe 2 — NE PAS CONGELER !)',
              paragraphs: ['<strong>Interdiction absolue :</strong> <strong>NE JAMAIS congeler les prélèvements</strong> (sauf cas de force majeure), sous peine de détruire les germes recherchés !'],
              bullets: [
                '<strong>Selles :</strong> <strong>≥ 10 g</strong> avant toute antibiothérapie, pot hermétique, transport immédiat à 25 °C (< 2 h [Instr.] / < 24 h [slides]) ou à +4 °C (max 24 h).',
                '<strong>Vomissures :</strong> <strong>10–20 g</strong> dès les premiers symptômes, à 25 °C (< 2 h) ou +4 °C (max 24 h).',
                '<strong>Aliment suspect / plat témoin :</strong> <strong>250 g</strong>, transport immédiat à <strong>+4 °C</strong>.',
                '<strong>Eau :</strong> <strong>1 litre</strong> en flacon stérile, transport immédiat à <strong>+4 °C</strong>.'
              ]
            },
            {
              heading: 'Prise en charge thérapeutique',
              paragraphs: ['La priorité clinique est de corriger la déshydratation sans aggraver un syndrome invasif/toxinique :'],
              bullets: [
                '<strong>Réhydratation :</strong> per os / SRO (1–2 L le 1er jour si modérée) ou voie IV si sévère.',
                '<strong>Régime :</strong> supprimer lait (sauf yaourt), café, gras, crudités ; réalimentation précoce (yaourt, riz, carottes, pâtes, bananes).',
                '<strong>Anti-diarrhéiques — PIÈGE MAJEUR :</strong> <strong>Lopéramide (Imodium®) PROSCRIT si syndrome dysentérique</strong> (risque de colo-stase !) ; Diosmectite (Smecta®) et Racécadotril (Tiorfan®) recommandés.',
                '<strong>Antibiothérapie :</strong> réservée aux cas graves/terrains fragiles, adaptée à l’antibiogramme.'
              ]
            }
          ],
          tables: [
            {
              title: 'Tableau complet des germes de TIAC (Incubation, Aliments, Clinique)',
              headers: ['Mécanisme', 'Germe', 'Incubation', 'Aliments typiques', 'Signes / Complications clés'],
              rows: [
                ['Toxinique', 'Staphylococcus aureus', '1–6 h (très courte)', 'Pâtisseries, glaces, œufs mayonnaise', 'Vomissements + diarrhée SANS fièvre ; collapsus'],
                ['Toxinique', 'Bacillus cereus', '1–16 h', 'Riz, purée de légumes', 'Vomissements, diarrhées'],
                ['Toxinique', 'Clostridium perfringens', '8–24 h', 'Viandes, sauces (refroidissement lent)', 'Douleurs abdo, diarrhée SANS fièvre ; entérocolite nécrosante'],
                ['Toxinique', 'E. coli EHEC', '3–8 jours', 'Viande crue/peu cuite, lait cru', 'Diarrhée sanglante → SHU, IRA'],
                ['Invasif', 'Salmonella non typhoïdique', '12–72 h', 'Œufs, volailles, viandes, produits laitiers', 'FIÈVRE (38–40 °C) + diarrhée aiguë invasive'],
                ['Invasif', 'Shigella', '24–72 h', 'Eau contaminée, interhumaine', 'Syndrome dysentérique (glairo-sanglant), SHU, convulsions'],
                ['Invasif', 'Campylobacter', '2–10 jours', 'Volaille, lait non pasteurisé', 'Diarrhée, fièvre → Guillain-Barré, arthrite réactionnelle'],
                ['Extra-digestif', 'Listeria monocytogenes', '3–30 jours', 'Fromage, charcuterie, foie gras', 'Femme enceinte (avortement), nouveau-né (méningite)'],
                ['Extra-digestif', 'Clostridium botulinum', '—', 'Conserves déformées / bombées', 'Paralysies ; 1 SEUL CAS suffit pour déclarer une TIAC !']
              ]
            }
          ],
          darija: 'احفظها بالزربة : <strong>1–6 سوايع بلا سخانة + باتيسري/مايونيز = Staph</strong> ؛ <strong>الروز = Bacillus cereus</strong> ؛ <strong>اللحم والمرقة بردو بشوية بلا سخانة = C. perfringens</strong> ؛ <strong>12–72 سا + سخانة 39° + بيض/دجاج = Salmonelle</strong> ؛ <strong>مرأة حامل + فرماج = Listeria</strong>. و<strong>جامي تجمد العينات (ne pas congeler)</strong> و<strong>Imodium ممنوع في الـ dysenterie !</strong>',
          triad: {
            toUnderstand: [
              'La logique : toxine préformée = incubation très courte (1–6 h) sans fièvre vs germe invasif = incubation plus longue (12–72 h) avec fièvre.',
              'Pourquoi le lopéramide est dangereux dans un syndrome dysentérique (stase colique des germes/toxines).'
            ],
            toMemorize: [
              'Ne jamais congeler les prélèvements ; Selles ≥ 10 g (avant ATB), Aliment 250 g, Eau 1 L (+4 °C).',
              'Imodium® proscrit si dysenterie ; incubations Staph (1–6 h) vs Salmonella (12–72 h).'
            ],
            toRecognizeInQcm: [
              'Vomissements sans fièvre 3 h après pâtisserie → S. aureus.',
              'Congélation des selles/aliments pour envoi à l’IPA → FAUX !',
              'Lopéramide devant diarrhée glairo-sanglante fébrile → FAUX (proscrit) !'
            ]
          }
        },
        memorize: [
          { id: 'M_L5.2_1', category: 'Classification', title: 'Trio d’incubations phares', content: '<strong>S. aureus :</strong> 1–6 h (sans fièvre, pâtisseries). <strong>C. perfringens :</strong> 8–24 h (viandes/sauces refroidissement lent, sans fièvre). <strong>Salmonella :</strong> 12–72 h (<strong>fièvre 38–40 °C</strong>, œufs/volailles).', highlight: true },
          { id: 'M_L5.2_2', category: 'Seuil / Chiffre', title: 'Normes de prélèvements TIAC', content: '<strong>NE JAMAIS CONGELER</strong> (sauf force majeure) ! Selles <strong>≥ 10 g</strong> (avant ATB), Vomis 10–20 g, Aliment <strong>250 g</strong> (+4 °C), Eau <strong>1 litre</strong> flacon stérile (+4 °C).', highlight: true },
          { id: 'M_L5.2_3', category: 'Piège QCM', title: 'Contre-indication thérapeutique majeure', content: '<strong>Lopéramide (Imodium®) PROSCRIT</strong> si syndrome dysentérique (colo-stase). Préférer SRO + Smecta® / Tiorfan®.', highlight: true },
          { id: 'M_L5.2_4', category: 'Liste', title: 'Complications spécifiques à reconnaître', content: '<strong>EHEC / Shigella</strong> → SHU ; <strong>Campylobacter</strong> → Guillain-Barré ; <strong>Listeria</strong> → femme enceinte (avortement) & nouveau-né (méningite).', highlight: false }
        ]
      },
      {
        id: 'L5.3',
        courseId: 'C5',
        order: 3,
        title: 'Prévention : 5 Clés OMS, marche en avant & plat témoin',
        durationMin: 9,
        sourceRef: 'INSTRUCTION TIAC.pdf (N°18/2024) & CAT TIAC slides 16–19',
        bmCount: 0,
        bmRefs: [],
        priority: 'low',
        priorityScore: 30,
        understand: {
          intro: 'Les mesures préventives combinent les 5 Clés de l’OMS pour la sécurité sanitaire des aliments et les règles réglementaires de l’Instruction N°18 du 01/08/2024 pour la restauration collective.',
          sections: [
            {
              heading: 'Les 5 Clés de l’OMS pour des aliments plus sûrs',
              paragraphs: ['Toute prévention individuelle ou collective s’articule autour de 5 règles simples :'],
              bullets: [
                '<strong>1) Propreté</strong> (lavage mains, surfaces, lutte nuisibles).',
                '<strong>2) Séparation aliments crus / aliments cuits</strong> (éviter contamination croisée).',
                '<strong>3) Cuisson soigneuse</strong> (≥ 70 °C à cœur).',
                '<strong>4) Maintien à bonne température</strong> (ne pas laisser > 2 h à température ambiante ; réfrigérer < 5 °C / 4 °C ; maintenir chaud > 60 °C OMS / > 65 °C Instr. 2024).',
                '<strong>5) Utiliser de l’eau et des produits sûrs.</strong>'
              ]
            },
            {
              heading: 'Restauration collective (Instruction N°18 du 01/08/2024)',
              paragraphs: ['Des normes précises encadrent les cuisines collectives (cantines, résidences universitaires, hôpitaux) :'],
              bullets: [
                '<strong>Principe de la « marche en avant » :</strong> « jamais un circuit sale ne doit couper un circuit propre ».',
                '<strong>Températures :</strong> plats chauds maintenus à <strong>> 65 °C</strong> ; plats froids entre <strong>2 et 4 °C</strong> (servis en < 1 h, consommés le jour même) ; <strong>restes systématiquement jetés</strong>.',
                '<strong>Plat témoin :</strong> échantillon de <strong>50–100 g conservé à +4 °C pendant ≥ 72 heures</strong> selon Instr. 2024 <em>(⚠️ note : les slides CAT TIAC.pdf indiquent 5 jours — retenir les deux !)</em>.',
                '<strong>Hygiène matériel & personnel :</strong> ustensiles viande hachée désinfectés à l’<strong>eau javellisée 12°</strong> ; visite médicale du personnel de cuisine <strong>à l’embauche + tous les trimestres</strong>.'
              ]
            }
          ],
          tables: [
            {
              title: 'Repères chiffrés de prévention TIAC (attention aux écarts entre supports)',
              headers: ['Paramètre', 'Instruction N°18 (2024)', 'Slides CAT TIAC / OMS'],
              rows: [
                ['Cuisson à cœur', 'Cuisson complète', '≥ 70 °C (OMS)'],
                ['Maintien au chaud', '> 65 °C', '> 60 °C (OMS)'],
                ['Chaîne du froid / plats froids', '2 à 4 °C (servir < 1 h, consommer le jour même)', '< 5 °C ; pas > 2 h à temp. ambiante'],
                ['Plat témoin', '50–100 g à +4 °C pendant ≥ 72 h', '5 jours (CAT TIAC slide 10)']
              ]
            }
          ],
          darija: 'في المطاعم الجماعية (restauration collective) : قاعدة <strong>La marche en avant</strong> معناها « جامي الطريق الوسخ يقطع الطريق النظيف ». والماكلة السخونة فوق <strong>65 °C</strong>، الباردة بين <strong>2 و 4 °C</strong>، والباقي يترمى (restes jetés)، و<strong>plat témoin</strong> يتخبى على +4 °C لمدة <strong>≥ 72 سا</strong> (في الـ slides مكتوبة 5 أيام).',
          triad: {
            toUnderstand: [
              'Pourquoi la zone de danger bactérien se situe entre +4 °C et +60/65 °C.',
              'À quoi sert le plat témoin (analyse microbiologique immédiate en cas de TIAC).'
            ],
            toMemorize: [
              'Les 5 Clés OMS (propreté, cru/cuit, cuisson ≥ 70 °C, températures, produits sûrs).',
              'Marche en avant ; chaud > 65 °C ; froid 2–4 °C ; plat témoin 50–100 g à +4 °C (≥ 72 h / 5 j) ; personnel cuisine = visite embauche + trimestrielle.'
            ],
            toRecognizeInQcm: [
              'Définition de la marche en avant (circuit sale ne croise jamais circuit propre).',
              'Conservation des restes pour le lendemain en restauration collective → INTERDIT !'
            ]
          }
        },
        memorize: [
          { id: 'M_L5.3_1', category: 'Liste', title: 'Les 5 Clés de l’OMS', content: '1) Propreté, 2) Séparation cru/cuit, 3) Cuisson (≥ 70 °C), 4) Températures (< 5 °C / > 60 °C, ≤ 2 h ambiante), 5) Eau et produits sûrs.', highlight: true },
          { id: 'M_L5.3_2', category: 'Définition', title: 'Principe de la marche en avant', content: 'En cuisine collective : <strong>« jamais un circuit sale ne doit couper un circuit propre »</strong>.', highlight: true },
          { id: 'M_L5.3_3', category: 'Seuil / Chiffre', title: 'Plat témoin & Températures (Instr. 2024)', content: 'Chaud <strong>> 65 °C</strong> ; Froid <strong>2–4 °C</strong> ; Restes <strong>jetés</strong> ; Plat témoin : <strong>50–100 g à +4 °C pendant ≥ 72 h</strong> *(5 jours dans les slides)* ; Javel <strong>12°</strong> ; Visite médicale personnel : <strong>embauche + trimestrielle</strong>.', highlight: true }
        ]
      }
    ]
  },

  // =========================================================================
  // COURS 6 — Épidémiologie des IAS & Hygiène hospitalière
  // =========================================================================
  {
    id: 'C6',
    moduleId: 'M2',
    code: 'C6',
    title: 'Épidémiologie des IAS & Hygiène hospitalière',
    shortTitle: 'IAS & Hygiène',
    professor: 'Pr A. TOBBI & Dr H. BENALDJIA (CHU Batna)',
    sourceFiles: ['Les infections associées aux soins.pptx (27 slides) + Volet Hygiène des mains (BM Ch. 10)'],
    bmCount: 28,
    bmSharedNote: '24 QCM Ch. 10 + 4 QCM 2025 Ch. 16 (copier-coller !) — ⚠️ 4 erreurs corrigé BM',
    bmRecentCount: 7,
    uniqueConcepts: 6,
    priority: 'very_high',
    priorityScore: 95,
    vigilance2026: false,
    summary: 'Définition IAS (IN + ILS) et délais (> 48 h, 30 j chirurgie, 1 an prothèse), les 5 sites d’IN et leurs germes, organisation CNHH/CLIN (1998), flore cutanée résidente vs transitoire et hygiène des mains / SHA.',
    lessons: [
      {
        id: 'L6.1',
        courseId: 'C6',
        order: 1,
        title: 'Définition IAS/IN/ILS, délais (> 48 h / 30 j / 1 an) & CNHH/CLIN',
        durationMin: 11,
        sourceRef: 'Slides 5–9 & 22–25',
        bmCount: 5,
        bmRefs: ['Ch. 10 Q5, Q13, Q14, Q21', 'Ch. 16 Q1 (2025)'],
        priority: 'very_high',
        priorityScore: 95,
        bmWarning: '⚠️ 2 erreurs majeures du corrigé BM : Ch. 10 Q14 (prothèse genou 2 mois = ISO [A], PAS C car délai = 1 an !) et Ch. 10 Q21 (IAS inclut aussi le milieu libéral ILS = D [1-2-4], PAS A).',
        understand: {
          intro: 'Les critères chronologiques d’une IAS et sa portée (hôpital + milieu libéral) reviennent constamment (2021, 2022, 2025) et comportent les pièges les plus sévères du corrigé BM.',
          sections: [
            {
              heading: 'Définition & délais chronologiques officiels (Slides 5–7)',
              paragraphs: ['Une <strong>IAS</strong> survient au cours ou au décours d’une prise en charge (diagnostique, thérapeutique ou préventive), et n’était ni présente ni en incubation à l’admission :'],
              bullets: [
                '<strong>IAS = IN + ILS :</strong> comprend les <strong>Infections Nosocomiales</strong> (acquises en établissement de santé ; concernent patients, <strong>personnel et visiteurs</strong> ; peuvent apparaître après la sortie) <strong>ET</strong> les <strong>Infections Liées aux Soins en milieu libéral / extrahospitalier (ILS)</strong>.',
                '<strong>Délai standard d’hospitalisation :</strong> <strong>> 48 heures</strong> (ou supérieur à la période d’incubation).',
                '<strong>Infection du Site Opératoire (ISO) sans implant :</strong> jusqu’à <strong>30 jours</strong> après l’intervention.',
                '<strong>ISO avec implant ou prothèse :</strong> jusqu’à <strong>1 AN</strong> après la pose !'
              ]
            },
            {
              heading: 'Épidémiologie & organisation en Algérie (Slides 9 & 22–25)',
              paragraphs: ['L’Algérie a structuré la lutte contre les IN dès 1998 :'],
              bullets: [
                '<strong>Prévalence IN Algérie (2005) :</strong> <strong>14 %</strong> (France : 6–7 % ; USA SENIC : 3,6 % ; CHU Batna ISO neurochirurgie 2015 : <strong>5,30 %</strong>).',
                '<strong>CNHH (Comité National d’Hygiène Hospitalière) :</strong> créé le <strong>28 mars 1998</strong> (niveau national).',
                '<strong>CLIN (Comité de Lutte contre les Infections Nosocomiales) :</strong> créé le <strong>27 novembre 1998</strong> (dans chaque établissement).',
                '<strong>Stratégie nationale :</strong> Surveillance (« l’information appelant l’action ») + Mesures d’hygiène (<strong>Précautions standard</strong> : par tous les professionnels, pour tous les patients, pour tous les soins).'
              ]
            }
          ],
          tables: [
            {
              title: 'Les 3 seuils temporels absolus des IAS',
              headers: ['Situation clinique', 'Seuil temporel exact', 'Exemple QCM'],
              rows: [
                ['Hospitalisation standard', '> 48 heures', 'Avant 12 h ou avant 24 h = FAUX (Ch. 16 Q1 D)'],
                ['Chirurgie sans implant', 'Jusqu’à 30 jours', 'Infection plaie opératoire à J15 = ISO'],
                ['Chirurgie AVEC implant ou prothèse', 'Jusqu’à 1 AN', 'Endophtalmie à J3 sur implant cataracte (Q13 A) & prothèse genou à 2 mois (Q14 A !)']
              ]
            }
          ],
          darija: 'الديلي تاع الـ IAS : العادي <strong>أكثر من 48 ساعة (> 48 h)</strong>، الجراحة العادية <strong>30 يوم</strong>، بصح كي يركبو <strong>implant ولا prothèse</strong> (كيما prothèse du genou) الديلي يولي <strong>عام كامل (1 an)</strong> ! والـ IAS تشمل المستشفى (IN) <strong>و</strong>العيادات الخاصة (ILS).',
          triad: {
            toUnderstand: [
              'Pourquoi le concept d’IAS a remplacé celui d’IN (inclusion des soins ambulatoires/libéraux).',
              'Pourquoi le diagnostic d’IAS est chronologique et clinique (ne nécessite pas de connaître le germe au préalable).'
            ],
            toMemorize: [
              'Seuils : > 48 h (standard) | 30 jours (chirurgie) | 1 an (implant/prothèse).',
              'IAS = IN + ILS ; Prévalence Algérie (2005) = 14 % ; CNHH (28/03/1998) & CLIN (27/11/1998).'
            ],
            toRecognizeInQcm: [
              '« survient avant 24 h / avant 12 h / uniquement en milieu hospitalier » → TOUT FAUX → cocher « Aucune réponse n’est juste » (Ch. 16 Q1 D).',
              'Prothèse du genou à 2 mois → c’est bien une ISO (A), ne pas suivre l’erreur C du BM !'
            ]
          }
        },
        memorize: [
          { id: 'M_L6.1_1', category: 'Seuil / Chiffre', title: 'Les 3 délais IAS / ISO', content: 'Standard : <strong>> 48 heures</strong> d’hospitalisation | Chirurgie (ISO) : <strong>30 jours</strong> | Implant ou prothèse : <strong>1 an</strong>.', highlight: true },
          { id: 'M_L6.1_2', category: 'Définition', title: 'IAS = IN + ILS', content: 'Survient au cours ou au décours d’une prise en charge ; comprend les <strong>IN</strong> (hôpital — patients, personnel, visiteurs) ET les <strong>ILS</strong> (milieu libéral).', highlight: true },
          { id: 'M_L6.1_3', category: 'Seuil / Chiffre', title: 'Organisation & chiffres Algérie', content: 'Prévalence IN Algérie (2005) = <strong>14 %</strong> (Batna ISO neurochirurgie 2015 = 5,30 %). <strong>CNHH : 28 mars 1998</strong> ; <strong>CLIN : 27 novembre 1998</strong>.', highlight: false }
        ]
      },
      {
        id: 'L6.2',
        courseId: 'C6',
        order: 2,
        title: 'Les 5 localisations d’IN, germes majeurs & colonisation cathéter',
        durationMin: 12,
        sourceRef: 'Slides 15–20',
        bmCount: 10,
        bmRefs: ['Ch. 10 Q1–Q3 (2024)', 'Ch. 16 Q2–Q4 (2025)', 'Ch. 10 Q9 (2021)', 'Ch. 10 Q22–Q24 (ND)'],
        priority: 'very_high',
        priorityScore: 95,
        bmWarning: '⚠️ Erreur corrigé BM sur Ch. 10 Q22 : la colonisation de cathéter = culture positive significative + ABSENCE de signes locaux et généraux (C : 1-2-3), PAS D (1-4 avec érythème) !',
        understand: {
          intro: 'Ce trio « IUN / Pneumonie / Cathéter » est un jackpot absolu à l’examen : 3 questions exactes sont tombées en 2024 (Ch. 10 Q1–Q3) et ont été reposées MOT POUR MOT en 2025 (Ch. 16 Q2–Q4) !',
          sections: [
            {
              heading: 'Bactériémie vs Septicémie & Caractéristiques des germes',
              paragraphs: ['En plus des 4 sites d’organes majeurs, le cours distingue deux tableaux sanguins et rappelle la microbiologie globale des IAS :'],
              bullets: [
                '<strong>Bactériémie :</strong> passage <strong>bref et transitoire</strong> de bactéries dans le sang.',
                '<strong>Septicémie :</strong> <strong>décharges massives et répétées</strong> de bactéries à partir d’un foyer septique.',
                '<strong>Micro-organismes (Ch. 10 Q24 ABC) :</strong> les <strong>bactéries</strong> sont les 1ers micro-organismes en fréquence décroissante (les virus existent aussi !), posant un problème majeur de <strong>résistance aux antibiotiques</strong> ; les <strong>visiteurs</strong> peuvent constituer un réservoir.',
                '<strong>Colonisation d’un cathéter (Ch. 10 Q22) :</strong> culture positive au seuil significatif + <strong>absence de signes locaux</strong> (pas d’érythème !) + <strong>absence de signes généraux</strong>.'
              ]
            }
          ],
          tables: [
            {
              title: 'Tableau d’or des localisations d’IN (Jackpot 2024 & 2025)',
              headers: ['Site d’IN', 'Rang clé en QCM', 'Germe n°1 à cocher', 'FDR majeur'],
              rows: [
                ['Urinaire (IUN)', '1ère en FRÉQUENCE (la plus fréquente — Q9 A)', 'E. coli (> Entérocoques, Pseudomonas)', 'Sondage vésical +++'],
                ['Pneumonie nosocomiale', '1ère cause de DÉCÈS par IN (2024 & 2025 !)', 'Bacilles Gram Négatif — BGN (60 %) > S. aureus 30 % > Candida 10 %', 'Intubation endotrachéale +++'],
                ['Cathéters', 'Fréquente en réanimation', 'Staphylocoques (50 %) > BGN 10 % > levures (2024 & 2025 !)', 'Cathéter central non tunnellisé, voies multiples, site fémoral'],
                ['ISO (Site opératoire)', 'Allongement du séjour ≈ 1 semaine', 'Cocci Gram+ (S. aureus), Entérobactéries, Pseudomonas', 'Score ASA élevé, séjour préop, type chirurgie, dépilation']
              ]
            }
          ],
          darija: 'احفظ هاد الثلاثي لي طاح في 2024 وعاود طاح حرفيا في 2025 : <strong>أكثر وحدة تنتشر = Urinaire (IUN)</strong> ؛ <strong>أكثر وحدة تقتل (1ère cause de décès) = Pneumonie والميكروب تاعها BGN (60 %)</strong> ؛ <strong>الـ Cathéter = Staphylocoques (50 %)</strong> ! و<strong>Colonisation</strong> معناها <strong>ما كانش érythème</strong> (بلا علامات محلية ولا عامة).',
          triad: {
            toUnderstand: [
              'La différence entre site le plus fréquent (urinaire) et site le plus mortel (pneumonie).',
              'La différence entre colonisation (asymptomatique) et infection locale (érythème/pus).'
            ],
            toMemorize: [
              'IUN = 1ère fréquence ; Pneumonie = 1ère cause de décès + BGN (60 %) ; Cathéter = Staphylocoques (50 %).',
              'Bactériémie (passage bref) vs Septicémie (décharges massives et répétées).',
              'Facteurs IAS (Ch. 10 Q23 B) : FDR patient + qualité des soins + utilisation des techniques médicales.'
            ],
            toRecognizeInQcm: [
              '« Il n’y a pas d’infection nosocomiale d’origine virale » → FAUX (Ch. 10 Q24 D) !',
              'Ne pas confondre BGN (Pneumonies) et Staphylocoques (Cathéters).'
            ]
          }
        },
        memorize: [
          { id: 'M_L6.2_1', category: 'Classification', title: 'Trio QCM 2024–2025 (Sites & Germes)', content: '<strong>IUN :</strong> 1ère en fréquence. <strong>Pneumonie :</strong> 1ère cause de décès + <strong>BGN (60 %)</strong>. <strong>Cathéter :</strong> <strong>Staphylocoques (50 %)</strong>.', highlight: true },
          { id: 'M_L6.2_2', category: 'Définition', title: 'Colonisation du cathéter (⚠️ Erreur BM)', content: '1) Culture positive significative + 2) <strong>Absence de signes locaux</strong> (PAS d’érythème !) + 3) <strong>Absence de signes généraux</strong>.', highlight: true },
          { id: 'M_L6.2_3', category: 'Distinction', title: 'Bactériémie vs Septicémie', content: '<strong>Bactériémie :</strong> passage bref/transitoire. <strong>Septicémie :</strong> décharges massives et répétées à partir d’un foyer septique.', highlight: false },
          { id: 'M_L6.2_4', category: 'Liste', title: 'Microbiologie & réservoirs IAS', content: 'Bactéries = 1er micro-organisme (mais virus existent !) ; problème de <strong>résistance aux ATB</strong> ; <strong>visiteurs</strong> = réservoir possible.', highlight: false }
        ]
      },
      {
        id: 'L6.3',
        courseId: 'C6',
        order: 3,
        title: 'Flore cutanée, hygiène des mains, SHA, gants & précautions standard',
        durationMin: 13,
        sourceRef: 'Volet Hygiène des mains (BM Ch. 10 : 13 QCM) + Slide 25',
        bmCount: 13,
        bmRefs: ['Ch. 10 Q4, Q6–Q8, Q10–Q12, Q15–Q20 (2019–2022, ND)'],
        priority: 'very_high',
        priorityScore: 80,
        bmWarning: '⚠️ Erreur corrigé BM sur Ch. 10 Q6 : le BM met ABC (incluant pain de savon et serviette !), contredisant Ch. 10 Q10 & Q20. La vraie réponse est AD (zéro bijou + pas d’appareil électrique de séchage).',
        understand: {
          intro: 'Près de la moitié des questions de la BM Ch. 10 (13 QCM !) porte sur la flore des mains, les pré-requis, les produits recommandés, les contre-indications de la SHA et les erreurs à éviter. Ce volet n’est pas détaillé dans le PPTX fourni : cette leçon vous donne 100 % des règles testées.',
          sections: [
            {
              heading: 'Pré-requis, produits recommandés & erreurs à éviter',
              paragraphs: ['L’hygiène des mains est la mesure n°1 des précautions standard :'],
              bullets: [
                '<strong>Pré-requis absolus (Ch. 10 Q7 ABD) :</strong> ongles courts, pas de vernis, <strong>ZÉRO bijou (même l’alliance lisse est INTERDITE !)</strong>, manches courtes.',
                '<strong>Produits recommandés (Ch. 10 Q10 ACD) :</strong> savon doux liquide, savon antiseptique liquide, gel ou solution hydro-alcoolique (SHA).',
                '<strong>Erreurs formellement proscrites (Ch. 10 Q15, Q20) :</strong> <strong>savon en pain</strong>, remplissage d’un flacon non nettoyé-désinfecté, rinçage insuffisant, <strong>séchage insuffisant ou par air chaud électrique</strong>, serviette en tissu réutilisable, <strong>association de 2 antiseptiques (FAUX !)</strong>.',
                '<strong>Contre-indications de la SHA (Ch. 10 Q11 ABD) :</strong> <strong>mains mouillées</strong>, <strong>mains poudrées/talquées</strong>, <strong>mains visiblement souillées</strong> (condition requise : mains sèches et visuellement propres).',
                '<strong>Gants, lavage simple & toux :</strong> gants = double protection soignant + patient (lavage/SHA <strong>obligatoire</strong> après retrait !) ; ponction lombaire ≠ lavage simple (geste invasif !) ; toux = coude ou mouchoir usage unique couvrant nez ET bouche (Ch. 10 Q12 AB).'
              ]
            }
          ],
          tables: [
            {
              title: 'Flore résidente vs Flore transitoire (3 QCM BM : Q8, Q16, Q19)',
              headers: ['Caractéristique', 'Flore résidente', 'Flore transitoire'],
              rows: [
                ['Origine / Acquisition', 'Ancienne, profonde, propre à l’individu', 'Acquisition récente (environnement hospitalier, malades)'],
                ['Pathogénicité', 'Rarement pathogène — risque faible d’infections manuportées', 'Constituée de germes pathogènes (BMR, infections manuportées)'],
                ['Élimination par hygiène', 'DIFFICILE à enlever par les gestes courants (réduite seulement)', 'FACILE à enlever (lavage simple / SHA)']
              ]
            }
          ],
          darija: 'احفظ 3 موانع الـ <strong>SHA</strong> (Contre-indications) : <strong>يدين مشمخين (mouillées) + فيهم البودرة (poudrées) + وسخين باينين (visiblement souillées)</strong>. ممنوع تماما <strong>savon en pain</strong>، ممنوع <strong>الخاتم حتى alliance lisse</strong>، ممنوع <strong>خلط 2 antiseptiques</strong>، وممنوع <strong>المجفف الكهربائي</strong> !',
          triad: {
            toUnderstand: [
              'Pourquoi la flore transitoire (superficielle, récente, pathogène) est la cible principale de la SHA.',
              'Pourquoi la SHA est inefficace/irritante sur mains mouillées, souillées ou poudrées.'
            ],
            toMemorize: [
              '3 contre-indications SHA : mains mouillées, poudrées/talquées, visiblement souillées.',
              'Pré-requis : ongles courts, sans vernis, 0 bijou (alliance lisse interdite).',
              'Flore résidente (difficile à enlever, risque faible) vs transitoire (facile à enlever, pathogène).'
            ],
            toRecognizeInQcm: [
              '« alliance lisse autorisée » → FAUX ; « association de 2 antiseptiques » → FAUX ; « ponction lombaire = lavage simple » → FAUX.',
              '« couvrir la bouche seulement » en toussant → FAUX (nez ET bouche !).'
            ]
          }
        },
        memorize: [
          { id: 'M_L6.3_1', category: 'Distinction', title: 'Flore résidente vs Flore transitoire', content: '<strong>Résidente :</strong> risque faible, rarement pathogène, <strong>difficile à enlever</strong>. <strong>Transitoire :</strong> acquisition récente (environnement/malades), germes pathogènes, <strong>facile à enlever</strong>.', highlight: true },
          { id: 'M_L6.3_2', category: 'Liste', title: '3 Contre-indications de la SHA', content: '1) Mains <strong>mouillées</strong>, 2) Mains <strong>poudrées/talquées</strong>, 3) Mains <strong>visiblement souillées</strong>. (Condition requise : mains sèches et propres).', highlight: true },
          { id: 'M_L6.3_3', category: 'Liste', title: 'Pré-requis & Produits recommandés', content: '<strong>Pré-requis :</strong> ongles courts, sans vernis, <strong>pas de bijoux (alliance lisse interdite !)</strong>. <strong>Produits :</strong> savon doux liquide, savon antiseptique liquide, SHA (<strong>JAMAIS pain de savon</strong>).', highlight: true },
          { id: 'M_L6.3_4', category: 'Piège QCM', title: 'Gants, antiseptiques, séchage & toux', content: 'Gants = double protection + lavage obligatoire après retrait ; <strong>jamais 2 antiseptiques associés</strong> ; <strong>pas de séchoir air chaud</strong> ; essuie-mains usage unique ; toux = coude ou mouchoir couvrant <strong>nez ET bouche</strong>.', highlight: false }
        ]
      }
    ]
  }
);
