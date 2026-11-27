/* ==========================================================================
   EpiJourney — Moteur Unifié de Parcours Pédagogique Dynamique (Global MedStudy)
   Découvre automatiquement TOUS les modules, cours, chapitres, leçons, phases
   et étapes individuelles directement depuis la base de données (existant & futurs).
   Zéro valeur codée en dur · Logique de complétion stricte · Persistance native.
   ========================================================================== */
window.EpiJourney = (function () {
  const FC_TYPE_LABELS = {
    definition: 'Définition',
    cloze: 'Phrase à compléter',
    list: 'Liste / Énumération',
    difference: 'Distinction / Comparaison',
    formula: 'Formule / Seuil clé',
    short_answer: 'Réponse courte'
  };

  function asArr(v) {
    if (Array.isArray(v)) return v;
    if (v === null || v === undefined) return [];
    return [v];
  }

  function stripHtml(str) {
    return String(str || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function truncate(str, max) {
    const clean = stripHtml(str);
    if (clean.length <= max) return clean;
    return clean.slice(0, Math.max(10, max - 1)).trim() + '…';
  }

  function arraysEqualSet(a, b) {
    const aa = asArr(a);
    const bb = asArr(b);
    if (aa.length !== bb.length) return false;
    return aa.slice().sort().join(',') === bb.slice().sort().join(',');
  }

  function getMiniTestQuestions(course, lesson, catalog) {
    const src = catalog || window.EpiData || { qcms: [] };
    const allQ = asArr(src.qcms);
    if (lesson && lesson.miniTest && asArr(lesson.miniTest.questionIds).length > 0) {
      const qMap = {};
      allQ.forEach(q => { qMap[q.id] = q; });
      const mapped = asArr(lesson.miniTest.questionIds).map(id => qMap[id]).filter(Boolean);
      if (mapped.length >= 2) return mapped.slice(0, 5);
    }
    const own = allQ.filter(q => q.lessonId === lesson.id);
    if (own.length >= 4) return own.slice(0, 5);
    const extras = allQ
      .filter(q => q.courseId === course.id && q.lessonId !== lesson.id)
      .sort((a, b) => (b.isHard ? 1 : 0) - (a.isHard ? 1 : 0));
    return own.concat(extras.slice(0, Math.max(0, 4 - own.length)));
  }

  function getOrderedLessonQcms(lesson, catalog) {
    const src = catalog || window.EpiData || { qcms: [] };
    return asArr(src.qcms)
      .filter(q => q.lessonId === lesson.id)
      .slice()
      .sort((a, b) => (a.sourceType === 'bm_original' ? -1 : 1) - (b.sourceType === 'bm_original' ? -1 : 1));
  }

  function getLessonFlashcards(lesson, catalog) {
    const src = catalog || window.EpiData || { flashcards: [] };
    return asArr(src.flashcards).filter(f => f.lessonId === lesson.id);
  }

  function isLegacyMasteredUnderstand(lRec) {
    // Préserve la progression antérieure des leçons déjà maîtrisées avant l'ajout du suivi par étape
    return !!(lRec && lRec.mastered && lRec.stepProgressVersion == null && asArr(lRec.understandCompletedIds).length === 0);
  }

  // ---- DÉCOUVERTE DYNAMIQUE DES ÉTAPES DE CHAQUE PHASE ----
  function buildPhaseA(profile, lesson, lRec) {
    const u = lesson.understand || { intro: '', sections: [], tables: [], darija: '', triad: {} };
    const sections = asArr(u.sections);
    const tables = asArr(u.tables);
    const triad = u.triad || {};
    const hasTriad = asArr(triad.toUnderstand).length > 0 || asArr(triad.toMemorize).length > 0 || asArr(triad.toRecognizeInQcm).length > 0;
    const hasSynthesis = hasTriad || !!u.darija;

    const doneSet = new Set(asArr(lRec && lRec.understandCompletedIds));
    const legacyDone = isLegacyMasteredUnderstand(lRec);
    const steps = [];

    sections.forEach((sec, idx) => {
      const id = `sec_${idx}`;
      const firstPara = asArr(sec.paragraphs)[0] || asArr(sec.bullets)[0] || '';
      const idLabel = sec.pageRef ? `${lesson.id} · ${sec.pageRef}` : `${lesson.id} · S${idx + 1}`;
      steps.push({
        id,
        number: steps.length + 1,
        title: sec.heading || `Section ${idx + 1}`,
        identifier: idLabel,
        description: truncate(firstPara, 115) || 'Explication structurée fidèle au cours.',
        kind: 'section',
        sectionIdx: idx,
        section: sec,
        completed: legacyDone || doneSet.has(id)
      });
    });

    if (tables.length > 0) {
      const id = 'tables';
      const title = tables.length === 1
        ? (tables[0].title || 'Tableau de synthèse')
        : `Tableaux de synthèse (${tables.length} tableaux)`;
      const desc = tables.length === 1
        ? `${asArr(tables[0].headers).length} colonnes · ${asArr(tables[0].rows).length} lignes comparatives`
        : truncate(tables.map(t => t.title).filter(Boolean).join(' · '), 115);
      steps.push({
        id,
        number: steps.length + 1,
        title,
        identifier: `${lesson.id} · TAB`,
        description: desc || 'Tableaux comparatifs et repères clés du cours.',
        kind: 'tables',
        tables,
        completed: legacyDone || doneSet.has(id)
      });
    }

    if (hasSynthesis) {
      const id = 'synthesis';
      steps.push({
        id,
        number: steps.length + 1,
        title: 'Synthèse d’examen : Comprendre, Mémoriser & Pièges QCM',
        identifier: `${lesson.id} · SYNTH`,
        description: u.darija
          ? 'Explication simplifiée en Darija + triade de synthèse pour l’examen.'
          : 'Triade d’examen : points à comprendre, mémoriser et reconnaître en QCM.',
        kind: 'synthesis',
        triad,
        darija: u.darija || '',
        completed: legacyDone || doneSet.has(id)
      });
    }

    if (steps.length === 0) {
      steps.push({
        id: 'intro',
        number: 1,
        title: lesson.title || 'Introduction de la leçon',
        identifier: `${lesson.id} · INTRO`,
        description: truncate(u.intro || 'Présentation générale de la leçon.', 115),
        kind: 'intro',
        intro: u.intro || '',
        completed: legacyDone || doneSet.has('intro')
      });
    }

    return {
      key: 'A',
      code: 'Phase 1',
      name: 'À comprendre',
      shortName: 'Comprendre',
      icon: 'book',
      unitSingular: 'étape',
      unitPlural: 'étapes',
      requirementText: 'Lisez chaque section puis cliquez sur « J’ai compris cette étape » pour valider votre compréhension. Ouvrir une section ne suffit pas à la terminer.',
      steps
    };
  }

  function buildPhaseB(profile, lesson, lRec) {
    const items = asArr(lesson.memorize);
    const checkedSet = new Set(asArr(lRec && lRec.memCheckedIds));
    const steps = items.map((item, idx) => {
      const id = item.id || `mem_${lesson.id}_${idx + 1}`;
      const idParts = [item.id || `M${idx + 1}`, item.category || 'Notion clé'];
      if (item.pageRef) idParts.push(item.pageRef);
      return {
        id,
        number: idx + 1,
        title: item.title || `Notion essentielle ${idx + 1}`,
        identifier: idParts.join(' · '),
        description: truncate(item.content, 115),
        kind: 'memorize',
        item: Object.assign({}, item, { id }),
        highlight: !!item.highlight,
        completed: checkedSet.has(id)
      };
    });

    return {
      key: 'B',
      code: 'Phase 2',
      name: 'À mémoriser',
      shortName: 'À mémoriser',
      icon: 'bookmark',
      unitSingular: 'notion',
      unitPlural: 'notions',
      requirementText: 'Confirmez individuellement chaque notion essentielle après l’avoir mémorisée. La phase n’est terminée que lorsque toutes les notions sont validées.',
      steps
    };
  }

  function buildPhaseAR(profile, lesson, lRec) {
    const prompts = asArr(lesson.activeRecall);
    if (prompts.length === 0) return null;
    const doneSet = new Set(asArr(lRec && lRec.activeRecallDoneIds));
    const steps = prompts.map((ar, idx) => {
      const id = ar.id || `AR_${lesson.id}_${idx + 1}`;
      const idParts = [id];
      if (ar.pageRef) idParts.push(ar.pageRef);
      return {
        id,
        number: idx + 1,
        title: truncate(ar.prompt || `Question de rappel ${idx + 1}`, 95),
        fullTitle: ar.prompt || `Question de rappel ${idx + 1}`,
        identifier: idParts.join(' · '),
        description: 'Formulez votre réponse de mémoire, révélez la correction sourcée, puis confirmez votre vérification.',
        kind: 'active_recall',
        promptObj: Object.assign({}, ar, { id }),
        completed: doneSet.has(id)
      };
    });

    return {
      key: 'AR',
      code: 'Phase 3',
      name: 'Active Recall',
      shortName: 'Active Recall',
      icon: 'sparkle',
      unitSingular: 'activité',
      unitPlural: 'activités',
      requirementText: 'Restituez chaque réponse de mémoire avant de révéler la correction, puis validez votre vérification pour terminer la phase Active Recall.',
      steps
    };
  }

  function buildPhaseC(profile, lesson, catalog, hasSeparateAR) {
    const cards = getLessonFlashcards(lesson, catalog);
    const steps = cards.map((card, idx) => {
      const rec = profile && profile.flashcards ? profile.flashcards[card.id] : null;
      const reviewed = !!(rec && rec.totalReviews > 0);
      const idParts = [card.id || `FC${idx + 1}`, FC_TYPE_LABELS[card.type] || 'Flashcard'];
      if (card.pageRef) idParts.push(card.pageRef);
      let desc = card.hint ? `Repère : ${truncate(card.hint, 90)}` : 'Formulez votre réponse, révélez la carte puis évaluez votre rappel (SRS).';
      if (reviewed) {
        const ratingLbl = rec.lastRating === 'knew' ? 'Su ✓' : (rec.lastRating === 'partial' ? 'Partiel' : 'À revoir');
        const nextLbl = rec.nextReviewAt && window.EpiUI && window.EpiSRS
          ? window.EpiUI.formatDueLabel(window.EpiSRS.daysUntil(rec.nextReviewAt))
          : 'Planifiée';
        desc = `Dernier retour : ${ratingLbl} · Prochaine révision : ${nextLbl}`;
      }
      return {
        id: card.id,
        number: idx + 1,
        title: truncate(card.question, 95),
        fullTitle: card.question,
        identifier: idParts.join(' · '),
        description: desc,
        kind: 'flashcard',
        card,
        cardIdx: idx,
        srsRec: rec || null,
        completed: reviewed
      };
    });

    return {
      key: 'C',
      code: hasSeparateAR ? 'Phase 4' : 'Phase 3',
      name: hasSeparateAR ? 'Flashcards (SRS)' : 'Rappel actif · Flashcards',
      shortName: hasSeparateAR ? 'Flashcards' : 'Rappel actif',
      icon: 'brain',
      unitSingular: 'carte',
      unitPlural: 'cartes',
      requirementText: 'Révélez chaque flashcard et évaluez honnêtement votre rappel (Su / Partiel / Oublié) pour l’enregistrer dans le calendrier SRS.',
      steps
    };
  }

  function buildPhaseD(profile, lesson, catalog, hasSeparateAR) {
    const qcms = getOrderedLessonQcms(lesson, catalog);
    const steps = qcms.map((q, idx) => {
      const rec = profile && profile.qcms ? profile.qcms[q.id] : null;
      const done = !!(rec && rec.attempts > 0);
      const idParts = [q.id || `Q${idx + 1}`];
      if (q.bmRef) idParts.push(`BM ${q.bmRef}`);
      else if (q.pageRef) idParts.push(q.pageRef);
      idParts.push(q.multiSelect ? 'Choix multiple' : 'Choix unique');
      let desc = truncate(q.stem, 110);
      if (done) {
        desc = `${rec.lastCorrect ? 'Dernière réponse : Correcte ✓' : 'Dernière réponse : Incorrecte — révision conseillée'} (${rec.attempts} essai${rec.attempts > 1 ? 's' : ''})`;
      }
      return {
        id: q.id,
        number: idx + 1,
        title: q.topic || truncate(q.stem, 85),
        identifier: idParts.join(' · '),
        description: desc,
        kind: 'qcm',
        qcm: q,
        qcmIdx: idx,
        qcmRec: rec || null,
        completed: done
      };
    });

    return {
      key: 'D',
      code: hasSeparateAR ? 'Phase 5' : 'Phase 4',
      name: 'Entraînement QCM',
      shortName: 'QCM',
      icon: 'clipboard',
      unitSingular: 'QCM',
      unitPlural: 'QCM',
      requirementText: 'Sélectionnez vos réponses puis cliquez sur « Valider ma réponse » pour chaque QCM. Lire une question sans valider ne la marque pas terminée.',
      steps
    };
  }

  function buildPhaseE(profile, course, lesson, lRec, catalog, runtime, hasSeparateAR) {
    const questions = getMiniTestQuestions(course, lesson, catalog);
    const passingScore = (lesson.miniTest && lesson.miniTest.passingScore) || 80;
    const passed = !!(lRec && lRec.miniTestBest !== null && lRec.miniTestBest >= passingScore);
    const mt = (runtime && runtime.miniTest) || { answers: {}, submitted: false, scorePct: 0, correctCount: 0 };
    const hasCurrentAnswers = Object.keys(mt.answers || {}).some(k => asArr(mt.answers[k]).length > 0);

    const steps = questions.map((q, idx) => {
      const sel = asArr((mt.answers || {})[q.id]);
      const answeredNow = sel.length > 0;
      const isCorrectNow = mt.submitted && arraysEqualSet(sel, q.correct);
      const idParts = [q.id || `MTQ${idx + 1}`, q.multiSelect ? 'Choix multiple' : 'Choix unique'];
      if (q.bmRef) idParts.push(`BM ${q.bmRef}`);
      else if (q.pageRef) idParts.push(q.pageRef);

      let desc = truncate(q.stem, 110);
      if (mt.submitted) {
        desc = isCorrectNow ? 'Bonne réponse sur cette tentative ✓' : 'Réponse à corriger — consultez l’explication ci-dessous';
      } else if (answeredNow) {
        desc = `Option(s) sélectionnée(s) : ${sel.join(', ')} (en attente de validation finale)`;
      } else if (passed) {
        desc = `Validé lors de votre meilleur mini-test (${lRec.miniTestBest} %)`;
      }

      return {
        id: `mtq_${q.id}`,
        number: idx + 1,
        title: q.topic || `Question ${idx + 1}`,
        identifier: idParts.join(' · '),
        description: desc,
        kind: 'minitest_q',
        qcm: q,
        qIndex: idx,
        answeredNow,
        // Une question est considérée complétée si le mini-test est déjà réussi (>=80%) ou répondue dans la tentative en cours
        completed: passed ? (!hasCurrentAnswers || answeredNow) : answeredNow
      };
    });

    const mtId = (lesson.miniTest && lesson.miniTest.id) || `MT_${lesson.id}`;
    steps.push({
      id: 'mt_validate',
      number: steps.length + 1,
      title: `Validation finale du Mini-test (seuil ≥ ${passingScore} %)`,
      identifier: mtId,
      description: passed
        ? `Validé avec succès ! Meilleur score : ${lRec.miniTestBest} % (${lRec.miniTestAttempts} tentative${lRec.miniTestAttempts > 1 ? 's' : ''}).`
        : (lRec && lRec.miniTestAttempts > 0
          ? `Dernier score : ${lRec.lastMiniTestScore} % (meilleur : ${lRec.miniTestBest} %) — objectif ≥ ${passingScore} %.`
          : `Répondez aux ${questions.length} questions puis soumettez le mini-test (≥ ${passingScore} %).`),
      kind: 'minitest_submit',
      passingScore,
      questionsCount: questions.length,
      completed: passed
    });

    return {
      key: 'E',
      code: hasSeparateAR ? 'Phase 6' : 'Phase 5',
      name: `Mini-test (≥ ${passingScore} %)`,
      shortName: 'Mini-test',
      icon: 'award',
      unitSingular: 'étape',
      unitPlural: 'étapes',
      passingScore,
      passed,
      isMiniTest: true,
      requirementText: `Répondez à toutes les questions puis validez le mini-test avec un score d’au moins ${passingScore} % pour terminer cette phase et activer le calendrier SRS.`,
      steps
    };
  }

  // ---- CALCUL DYNAMIQUE DE PROGRESSION & GUIDAGE PAR PHASE ----
  function finalizePhase(phaseDef, activePhaseKey, activeStepId, isPhaseTouched) {
    const steps = asArr(phaseDef.steps);
    const totalCount = steps.length;
    let completedCount = steps.filter(s => s.completed).length;

    // Règle stricte Mini-test : ne peut JAMAIS être à 100 % ou "Terminée" sans score >= passingScore !
    let isCompleted = totalCount > 0 && completedCount === totalCount;
    if (phaseDef.isMiniTest) {
      isCompleted = !!phaseDef.passed;
      if (isCompleted) completedCount = totalCount;
      else if (completedCount >= totalCount && totalCount > 0) completedCount = totalCount - 1;
    }

    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const remainingCount = Math.max(0, totalCount - completedCount);

    let status = 'not_started';
    if (isCompleted) status = 'completed';
    else if (completedCount > 0 || isPhaseTouched) status = 'in_progress';

    const firstIncomplete = steps.find(s => !s.completed) || null;
    const isCurrentPhase = phaseDef.key === activePhaseKey;

    // Statut individuel de chaque étape (Non commencée / En cours / Terminée)
    const enrichedSteps = steps.map(s => {
      const isCurrentStep = isCurrentPhase && s.id === activeStepId;
      let stepStatus = 'not_started';
      if (s.completed) stepStatus = 'completed';
      else if (isCurrentStep) stepStatus = 'in_progress';
      return Object.assign({}, s, {
        isCurrent: isCurrentStep,
        status: stepStatus
      });
    });

    const unitLabel = totalCount > 1 ? phaseDef.unitPlural : phaseDef.unitSingular;
    const completedWord = phaseDef.unitSingular === 'QCM'
      ? (totalCount > 1 ? 'complétés' : 'complété')
      : (totalCount > 1 ? 'terminées' : 'terminée');
    const progressText = `${completedCount}/${totalCount} ${unitLabel} ${completedWord} — ${pct} %`;

    return Object.assign({}, phaseDef, {
      steps: enrichedSteps,
      totalCount,
      completedCount,
      remainingCount,
      pct,
      status,
      isCompleted,
      isCurrent: isCurrentPhase,
      nextStep: firstIncomplete,
      progressText
    });
  }

  function buildPhaseGuidance(phase, activeStep, nextPhase, isLastLessonInCourse) {
    if (phase.isCompleted) {
      if (nextPhase) {
        return {
          tone: 'success',
          headline: 'Cette phase est terminée.',
          detail: `Bravo ! Toutes les étapes requises de « ${phase.name} » sont complétées. Passez maintenant à la phase suivante : « ${nextPhase.name} ».`
        };
      }
      return {
        tone: 'success',
        headline: 'Cette phase est terminée.',
        detail: isLastLessonInCourse
          ? 'Félicitations ! Vous avez terminé toutes les phases de cette leçon.'
          : 'Excellent travail ! Cette leçon est terminée. Passez maintenant à la leçon suivante.'
      };
    }

    if (phase.completedCount === 0) {
      return {
        tone: 'info',
        headline: 'Commencez par cette étape.',
        detail: phase.totalCount === 1
          ? `Complétez cette étape unique pour terminer « ${phase.name} ».`
          : `Il vous reste ${phase.totalCount} ${phase.unitPlural} à terminer dans « ${phase.name} ». Toutes les étapes requises doivent être complétées.`
      };
    }

    if (phase.remainingCount === 1) {
      if (activeStep && !activeStep.completed) {
        return {
          tone: 'primary',
          headline: 'Vous êtes à la dernière étape.',
          detail: `Terminez cette dernière étape pour valider entièrement la phase « ${phase.name} ».`
        };
      }
      return {
        tone: 'primary',
        headline: 'Il ne vous reste plus qu’1 étape.',
        detail: phase.nextStep
          ? `Continuez avec « ${phase.nextStep.title} » pour terminer cette phase.`
          : `Terminez la dernière étape restante pour valider cette phase.`
      };
    }

    return {
      tone: 'primary',
      headline: `Il vous reste ${phase.remainingCount} ${phase.unitPlural}.`,
      detail: activeStep && activeStep.completed && phase.nextStep
        ? `Continuez avec l’étape suivante : « ${phase.nextStep.title} ».`
        : `Validez l’étape en cours puis continuez avec l’étape suivante.`
    };
  }

  // ---- PARCOURS COMPLET D'UNE LEÇON ----
  function getLessonJourney(profile, course, lesson, opts) {
    const o = opts || {};
    const catalog = o.catalog || window.EpiData || { courses: [], flashcards: [], qcms: [] };
    const runtime = o.runtime || {};
    const activePhaseKey = o.activePhaseKey || null;
    const activeStepId = o.activeStepId || null;
    const lRec = profile && profile.lessons ? profile.lessons[lesson.id] : null;

    const rawPhases = [];
    rawPhases.push(buildPhaseA(profile, lesson, lRec));
    const pB = buildPhaseB(profile, lesson, lRec);
    if (pB.steps.length > 0) rawPhases.push(pB);

    const pAR = buildPhaseAR(profile, lesson, lRec);
    const hasSeparateAR = !!pAR;
    if (pAR) rawPhases.push(pAR);

    const pC = buildPhaseC(profile, lesson, catalog, hasSeparateAR);
    if (pC.steps.length > 0) rawPhases.push(pC);

    const pD = buildPhaseD(profile, lesson, catalog, hasSeparateAR);
    if (pD.steps.length > 0) rawPhases.push(pD);

    const pE = buildPhaseE(profile, course, lesson, lRec, catalog, runtime, hasSeparateAR);
    if (pE.steps.length > 0) rawPhases.push(pE);

    const phases = rawPhases.map((p, idx) => {
      const touched = (activePhaseKey === p.key) || (lRec && lRec.lastActivePhase === p.key) || (p.isMiniTest && lRec && lRec.miniTestAttempts > 0);
      const finalized = finalizePhase(p, activePhaseKey, activeStepId, touched);
      finalized.phaseIndex = idx + 1;
      finalized.code = `Phase ${idx + 1}`;
      return finalized;
    });

    const totalPhases = phases.length;
    const completedPhases = phases.filter(p => p.isCompleted).length;
    const totalSteps = phases.reduce((s, p) => s + p.totalCount, 0);
    const completedSteps = phases.reduce((s, p) => s + p.completedCount, 0);
    const overallPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    let status = 'not_started';
    if (totalPhases > 0 && completedPhases === totalPhases) status = 'completed';
    else if (completedSteps > 0 || (lRec && (lRec.status === 'in_progress' || lRec.studied || lRec.mastered || lRec.miniTestAttempts > 0))) status = 'in_progress';

    const nextPhase = phases.find(p => !p.isCompleted) || null;
    const activePhase = phases.find(p => p.key === activePhaseKey) || nextPhase || phases[0] || null;
    const activePhaseIdx = activePhase ? phases.findIndex(p => p.key === activePhase.key) : 0;
    const nextAfterActivePhase = (activePhaseIdx >= 0 && activePhaseIdx < phases.length - 1) ? phases[activePhaseIdx + 1] : null;

    // Résoudre l'étape active dans la phase active
    let resolvedStep = null;
    if (activePhase && activePhase.steps.length > 0) {
      resolvedStep = activePhase.steps.find(s => s.id === activeStepId)
        || (lRec && lRec.lastActiveStepByPhase && activePhase.steps.find(s => s.id === lRec.lastActiveStepByPhase[activePhase.key]))
        || activePhase.nextStep
        || activePhase.steps[0];
    }

    const courseLessons = asArr(course && course.lessons);
    const lessonIdx = courseLessons.findIndex(l => l.id === lesson.id);
    const isLastLesson = lessonIdx >= 0 && lessonIdx === courseLessons.length - 1;
    const nextLesson = (lessonIdx >= 0 && lessonIdx < courseLessons.length - 1) ? courseLessons[lessonIdx + 1] : null;

    // Attacher le guidage dynamique à chaque phase
    phases.forEach((p, i) => {
      const np = i < phases.length - 1 ? phases[i + 1] : null;
      const curSt = p.key === (activePhase && activePhase.key) ? resolvedStep : p.nextStep;
      p.guidance = buildPhaseGuidance(p, curSt, np, isLastLesson);
    });

    return {
      course,
      lesson,
      lessonIndex: lessonIdx + 1,
      totalLessonsInCourse: courseLessons.length,
      phases,
      totalPhases,
      completedPhases,
      remainingPhases: Math.max(0, totalPhases - completedPhases),
      totalSteps,
      completedSteps,
      remainingSteps: Math.max(0, totalSteps - completedSteps),
      overallPct,
      status,
      isCompleted: status === 'completed',
      nextPhase,
      activePhase,
      nextAfterActivePhase,
      activeStep: resolvedStep,
      nextLesson
    };
  }

  // ---- PARCOURS COMPLET D'UN COURS ----
  function getCourseJourney(profile, course, opts) {
    const o = opts || {};
    const catalog = o.catalog || window.EpiData || { courses: [], flashcards: [], qcms: [] };
    const lessons = asArr(course && course.lessons);

    const lessonJourneys = lessons.map((lesson, idx) => {
      const lj = getLessonJourney(profile, course, lesson, { catalog });
      return {
        index: idx + 1,
        lesson,
        id: lesson.id,
        title: lesson.title,
        identifier: lesson.slideRange ? `${lesson.id} · ${lesson.slideRange}` : lesson.id,
        description: lesson.sourceRef || `~${lesson.durationMin || 10} min`,
        phases: lj.phases,
        completedPhases: lj.completedPhases,
        totalPhases: lj.totalPhases,
        completedSteps: lj.completedSteps,
        totalSteps: lj.totalSteps,
        pct: lj.overallPct,
        status: lj.status,
        isCompleted: lj.isCompleted,
        mastered: !!(profile && profile.lessons && profile.lessons[lesson.id] && profile.lessons[lesson.id].mastered),
        nextPhase: lj.nextPhase,
        nextStep: lj.nextPhase ? lj.nextPhase.nextStep : null
      };
    });

    const totalLessons = lessonJourneys.length;
    const completedLessons = lessonJourneys.filter(l => l.isCompleted).length;
    const masteredLessons = lessonJourneys.filter(l => l.mastered).length;
    const totalPhases = lessonJourneys.reduce((s, l) => s + l.totalPhases, 0);
    const completedPhases = lessonJourneys.reduce((s, l) => s + l.completedPhases, 0);
    const totalSteps = lessonJourneys.reduce((s, l) => s + l.totalSteps, 0);
    const completedSteps = lessonJourneys.reduce((s, l) => s + l.completedSteps, 0);
    const overallPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    let status = 'not_started';
    if (totalLessons > 0 && completedLessons === totalLessons) status = 'completed';
    else if (completedSteps > 0 || lessonJourneys.some(l => l.status !== 'not_started')) status = 'in_progress';

    const nextLessonJourney = lessonJourneys.find(l => !l.isCompleted) || lessonJourneys[0] || null;
    const remainingLessons = Math.max(0, totalLessons - completedLessons);

    let guidance = 'Commencez par la première leçon de ce cours.';
    if (totalLessons > 0 && completedLessons === totalLessons) {
      guidance = 'Félicitations ! Toutes les leçons et phases de ce cours sont terminées.';
    } else if (completedLessons === 0 && completedSteps === 0) {
      guidance = `Commencez par la leçon 1 sur ${totalLessons}. Toutes les phases de chaque leçon doivent être validées.`;
    } else if (remainingLessons === 1) {
      guidance = `Vous êtes à la dernière leçon restante du cours : « ${nextLessonJourney.title} ».`;
    } else {
      guidance = `Il vous reste ${remainingLessons} leçons sur ${totalLessons} à terminer (${completedPhases}/${totalPhases} phases validées).`;
    }

    return {
      course,
      lessons: lessonJourneys,
      totalLessons,
      completedLessons,
      masteredLessons,
      remainingLessons,
      totalPhases,
      completedPhases,
      totalSteps,
      completedSteps,
      overallPct,
      status,
      nextLessonJourney,
      guidance
    };
  }

  // ---- AUDIT GLOBAL PLATEFORME (DYNAMIQUE) ----
  function getPlatformAudit(profile, catalog) {
    const src = catalog || window.EpiData || { modules: [], courses: [], flashcards: [], qcms: [] };
    const modules = asArr(src.modules);
    const courses = asArr(src.courses);
    const chapterSet = new Set();
    let lessonsCount = 0;
    let phasesCount = 0;
    let stepsCount = 0;
    let completedSteps = 0;
    let completedPhases = 0;
    let completedLessons = 0;

    courses.forEach(c => {
      const cj = getCourseJourney(profile, c, { catalog: src });
      lessonsCount += cj.totalLessons;
      phasesCount += cj.totalPhases;
      stepsCount += cj.totalSteps;
      completedSteps += cj.completedSteps;
      completedPhases += cj.completedPhases;
      completedLessons += cj.completedLessons;
      asArr(c.lessons).forEach(l => {
        chapterSet.add(`${c.id}::${l.chapterTitle || l.title}`);
      });
    });

    return {
      modulesCount: modules.length,
      coursesCount: courses.length,
      chaptersCount: chapterSet.size,
      lessonsCount,
      phasesCount,
      stepsCount,
      completedLessons,
      completedPhases,
      completedSteps,
      overallStepPct: stepsCount > 0 ? Math.round((completedSteps / stepsCount) * 100) : 0
    };
  }

  // Synchronise stepAVisited avec la complétion réelle de toutes les étapes de Phase A
  function syncDerivedLessonFlags(profile, course, lesson, catalog) {
    const lRec = window.EpiStorage.ensureLessonRecord(profile, lesson.id);
    const lj = getLessonJourney(profile, course, lesson, { catalog });
    const pA = lj.phases.find(p => p.key === 'A');
    if (pA && pA.isCompleted) {
      lRec.stepAVisited = true;
    }
    if (lj.completedSteps > 0 && lRec.status === 'not_started') {
      lRec.status = 'in_progress';
    }
    if (lj.isCompleted && lRec.mastered) {
      lRec.status = 'completed';
    }
    return lj;
  }

  return {
    FC_TYPE_LABELS,
    getMiniTestQuestions,
    getOrderedLessonQcms,
    getLessonFlashcards,
    getLessonJourney,
    getCourseJourney,
    getPlatformAudit,
    syncDerivedLessonFlags,
    arraysEqualSet
  };
})();
