/* ==========================================================================
   EpiSRS — Algorithme de Répétition Espacée (1j → 3j → 7j → 14j → 30j)
   + Suivi de Maîtrise Mémoire (Rouge / Orange / Vert) & Points Faibles
   ========================================================================== */
window.EpiSRS = (function () {
  const INTERVALS = [1, 3, 7, 14, 30]; // jours exacts demandés
  const DAY_MS = 24 * 60 * 60 * 1000;

  function startOfDayMs(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  function addDaysISO(baseDate, days) {
    const d = new Date(baseDate.getTime() + days * DAY_MS);
    return d.toISOString();
  }

  function daysUntil(isoStr) {
    if (!isoStr) return null;
    const today = startOfDayMs(new Date());
    const target = startOfDayMs(new Date(isoStr));
    return Math.round((target - today) / DAY_MS);
  }

  // Enregistrer le retour d'une flashcard (Étape C ou Session de révision)
  function recordFlashcardReview(profile, cardId, rating) {
    // rating : 'knew' | 'partial' | 'forgot'
    const now = new Date();
    const rec = profile.flashcards[cardId] || {
      intervalIdx: -1,
      intervalDays: 0,
      nextReviewAt: null,
      lastReviewedAt: null,
      lastRating: null,
      knownCount: 0,
      partialCount: 0,
      forgotCount: 0,
      totalReviews: 0
    };

    rec.totalReviews += 1;
    rec.lastReviewedAt = now.toISOString();
    rec.lastRating = rating;

    if (rating === 'knew') {
      rec.knownCount += 1;
      const nextIdx = Math.min(rec.intervalIdx + 1, INTERVALS.length - 1);
      rec.intervalIdx = nextIdx;
      rec.intervalDays = INTERVALS[nextIdx];
      rec.nextReviewAt = addDaysISO(now, rec.intervalDays);
    } else if (rating === 'partial') {
      rec.partialCount += 1;
      const nextIdx = Math.max(0, rec.intervalIdx - 1);
      rec.intervalIdx = nextIdx;
      rec.intervalDays = 1; // ramener dès demain
      rec.nextReviewAt = addDaysISO(now, 1);
    } else {
      // 'forgot' -> ramener immédiatement (aujourd'hui !)
      rec.forgotCount += 1;
      rec.intervalIdx = 0;
      rec.intervalDays = 0;
      rec.nextReviewAt = now.toISOString();
    }

    profile.flashcards[cardId] = rec;
    return rec;
  }

  // Planifier une leçon dans le système SRS après réussite / maîtrise
  function scheduleLessonAfterMastery(profile, lessonId) {
    const now = new Date();
    const existing = profile.lessonSrs[lessonId];
    if (!existing) {
      profile.lessonSrs[lessonId] = {
        intervalIdx: 0,
        intervalDays: INTERVALS[0], // 1 jour
        nextReviewAt: addDaysISO(now, INTERVALS[0]),
        lastReviewedAt: now.toISOString(),
        reviewsCount: 0,
        forgotCount: 0
      };
    }
    return profile.lessonSrs[lessonId];
  }

  // Mettre à jour le SRS d'une leçon après une session de révision
  function recordLessonRevision(profile, lessonId, scorePct) {
    const now = new Date();
    const rec = profile.lessonSrs[lessonId] || {
      intervalIdx: 0,
      intervalDays: 1,
      nextReviewAt: addDaysISO(now, 1),
      lastReviewedAt: null,
      reviewsCount: 0,
      forgotCount: 0
    };
    rec.reviewsCount += 1;
    rec.lastReviewedAt = now.toISOString();

    if (scorePct >= 80) {
      const nextIdx = Math.min(rec.intervalIdx + 1, INTERVALS.length - 1);
      rec.intervalIdx = nextIdx;
      rec.intervalDays = INTERVALS[nextIdx];
      rec.nextReviewAt = addDaysISO(now, rec.intervalDays);
    } else if (scorePct >= 60) {
      rec.intervalIdx = Math.max(0, rec.intervalIdx - 1);
      rec.intervalDays = Math.min(3, INTERVALS[rec.intervalIdx]);
      rec.nextReviewAt = addDaysISO(now, rec.intervalDays);
    } else {
      rec.forgotCount += 1;
      rec.intervalIdx = 0;
      rec.intervalDays = 1;
      rec.nextReviewAt = addDaysISO(now, 1);
    }

    profile.lessonSrs[lessonId] = rec;
    return rec;
  }

  // Enregistrer une réponse QCM
  function recordQcmAttempt(profile, qcmId, selectedKeys, isCorrect) {
    const now = new Date().toISOString();
    const rec = profile.qcms[qcmId] || {
      attempts: 0,
      correctCount: 0,
      wrongCount: 0,
      lastCorrect: null,
      lastAnsweredAt: null,
      lastSelected: []
    };
    rec.attempts += 1;
    if (isCorrect) rec.correctCount += 1;
    else rec.wrongCount += 1;
    rec.lastCorrect = isCorrect;
    rec.lastAnsweredAt = now;
    rec.lastSelected = selectedKeys.slice();
    profile.qcms[qcmId] = rec;
    return rec;
  }

  // Vérifier si les exercices de mémorisation / rappel actif de la leçon ont été faits
  function hasCompletedMemorizationEvidence(profile, lesson) {
    const lRec = window.EpiStorage.ensureLessonRecord(profile, lesson.id);
    const cards = window.EpiData.flashcards.filter(c => c.lessonId === lesson.id);
    const reviewedCards = cards.filter(c => profile.flashcards[c.id] && profile.flashcards[c.id].totalReviews > 0);
    // Exige au moins 2 flashcards pratiquées (ou toutes si < 2) — cliquer "J'ai mémorisé" seul NE SUFFIT PAS !
    const minCards = Math.min(2, cards.length);
    return reviewedCards.length >= minCards && (lRec.memCheckedIds.length > 0 || lRec.memDeclaredAll || reviewedCards.length === cards.length);
  }

  // Calcul du niveau de maîtrise d'une leçon (Rouge / Orange / Vert / Non démarré)
  function getLessonMastery(profile, lesson) {
    const lRec = profile.lessons[lesson.id];
    const lessonCards = window.EpiData.flashcards.filter(c => c.lessonId === lesson.id);
    const lessonQcms = window.EpiData.qcms.filter(q => q.lessonId === lesson.id);

    let cardsReviewed = 0, cardsForgotLast = 0, cardsPartialLast = 0, cardsKnewLast = 0;
    lessonCards.forEach(c => {
      const r = profile.flashcards[c.id];
      if (r && r.totalReviews > 0) {
        cardsReviewed++;
        if (r.lastRating === 'forgot') cardsForgotLast++;
        else if (r.lastRating === 'partial') cardsPartialLast++;
        else if (r.lastRating === 'knew') cardsKnewLast++;
      }
    });

    let qcmAnswered = 0, qcmCorrectLast = 0, qcmWrongLast = 0;
    lessonQcms.forEach(q => {
      const r = profile.qcms[q.id];
      if (r && r.attempts > 0) {
        qcmAnswered++;
        if (r.lastCorrect) qcmCorrectLast++;
        else qcmWrongLast++;
      }
    });

    const hasStepWork = lRec && (
      (Array.isArray(lRec.understandCompletedIds) && lRec.understandCompletedIds.length > 0) ||
      (Array.isArray(lRec.activeRecallDoneIds) && lRec.activeRecallDoneIds.length > 0) ||
      (Array.isArray(lRec.memCheckedIds) && lRec.memCheckedIds.length > 0)
    );
    const hasActivity = (lRec && (lRec.status !== 'not_started' || lRec.studied || lRec.stepAVisited || lRec.miniTestAttempts > 0 || hasStepWork))
      || cardsReviewed > 0 || qcmAnswered > 0;

    if (!hasActivity) {
      return { level: 'unstarted', label: 'Non commencé', color: 'neutral', reasons: [] };
    }

    const reasons = [];
    if (lRec && lRec.lastMiniTestScore !== null && lRec.lastMiniTestScore < 80) {
      reasons.push(`Dernier mini-test : ${lRec.lastMiniTestScore} % (seuil de maîtrise : 80 %)`);
    }
    if (cardsForgotLast > 0) {
      reasons.push(`${cardsForgotLast} flashcard${cardsForgotLast > 1 ? 's' : ''} marquée${cardsForgotLast > 1 ? 's' : ''} « J’ai oublié »`);
    }
    if (qcmWrongLast > 0) {
      reasons.push(`${qcmWrongLast} erreur${qcmWrongLast > 1 ? 's' : ''} récente${qcmWrongLast > 1 ? 's' : ''} en QCM`);
    }
    if (cardsPartialLast > 0) {
      reasons.push(`${cardsPartialLast} carte${cardsPartialLast > 1 ? 's' : ''} partiellement retenue${cardsPartialLast > 1 ? 's' : ''}`);
    }

    // Rouge : échec mini-test < 60 %, ou carte oubliée, ou majorité de QCM ratés
    if (
      cardsForgotLast > 0 ||
      (lRec && lRec.lastMiniTestScore !== null && lRec.lastMiniTestScore < 60) ||
      (qcmAnswered >= 2 && (qcmWrongLast / qcmAnswered) >= 0.5)
    ) {
      return {
        level: 'red',
        label: 'Non maîtrisé',
        color: 'red',
        reasons: reasons.length ? reasons : ['Performances insuffisantes sur cette leçon']
      };
    }

    // Vert : leçon maîtrisée (étudiée + rappel actif + mini-test >= 80 %) ET pas d'erreur QCM récente ni d'oubli
    if (
      lRec && lRec.mastered &&
      cardsForgotLast === 0 &&
      qcmWrongLast === 0 &&
      (lRec.lastMiniTestScore === null || lRec.lastMiniTestScore >= 80)
    ) {
      return {
        level: 'green',
        label: 'Bien maîtrisé',
        color: 'green',
        reasons: []
      };
    }

    // Sinon Orange (en cours d'acquisition ou partiellement maîtrisé)
    if (!lRec || !lRec.mastered) {
      if (lRec && lRec.studied) reasons.push('Leçon étudiée mais mini-test (≥ 80 %) ou rappel actif non encore validés');
      else reasons.push('Apprentissage en cours — validez les étapes B, C et le mini-test E');
    }
    return {
      level: 'orange',
      label: 'Partiellement maîtrisé',
      color: 'orange',
      reasons
    };
  }

  // Liste complète des points faibles (Rouge en priorité, puis Orange)
  function getWeakPoints(profile) {
    const items = [];
    window.EpiData.courses.forEach(course => {
      course.lessons.forEach(lesson => {
        const m = getLessonMastery(profile, lesson);
        if (m.level === 'red' || m.level === 'orange') {
          let recommendedAction = 'Revoir Étape A/B puis pratiquer les flashcards (Étape C)';
          let targetStep = 'C';
          const lRec = profile.lessons[lesson.id];
          if (lRec && lRec.lastMiniTestScore !== null && lRec.lastMiniTestScore < 80) {
            recommendedAction = 'Relire les points à mémoriser (Étape B) puis repasser le Mini-test (≥ 80 %)';
            targetStep = 'B';
          } else if (m.reasons.some(r => r.includes('QCM'))) {
            recommendedAction = 'Refaire les QCM ratés (Étape D) avec leurs explications détaillées';
            targetStep = 'D';
          }
          items.push({
            course,
            lesson,
            mastery: m,
            recommendedAction,
            targetStep
          });
        }
      });
    });

    items.sort((a, b) => {
      const rank = { red: 0, orange: 1 };
      if (rank[a.mastery.level] !== rank[b.mastery.level]) {
        return rank[a.mastery.level] - rank[b.mastery.level];
      }
      return b.lesson.priorityScore - a.lesson.priorityScore;
    });
    return items;
  }

  // Bilan complet de la page "Mes révisions" (SRS)
  function getRevisionsSummary(profile) {
    const overdue = [];
    const dueToday = [];
    const upcoming = [];
    const forgotten = [];
    const mastered = [];

    // 1. Leçons dans le SRS
    window.EpiData.courses.forEach(course => {
      course.lessons.forEach(lesson => {
        const lRec = profile.lessons[lesson.id];
        const srs = profile.lessonSrs[lesson.id];
        if (lRec && lRec.mastered) {
          mastered.push({ kind: 'lesson', course, lesson, srs });
        }
        if (srs && srs.nextReviewAt) {
          const d = daysUntil(srs.nextReviewAt);
          const entry = {
            kind: 'lesson',
            id: lesson.id,
            course,
            lesson,
            title: lesson.title,
            subtitle: `${course.code} — ${course.shortTitle}`,
            intervalDays: srs.intervalDays,
            nextReviewAt: srs.nextReviewAt,
            daysUntil: d,
            reviewsCount: srs.reviewsCount
          };
          if (d < 0) overdue.push(entry);
          else if (d === 0) dueToday.push(entry);
          else upcoming.push(entry);
        }
      });
    });

    // 2. Flashcards dans le SRS
    window.EpiData.flashcards.forEach(card => {
      const rec = profile.flashcards[card.id];
      if (!rec || rec.totalReviews === 0) return;
      const course = window.EpiData.courses.find(c => c.id === card.courseId);
      const lesson = course ? course.lessons.find(l => l.id === card.lessonId) : null;
      if (!course || !lesson) return;

      const d = daysUntil(rec.nextReviewAt);
      const entry = {
        kind: 'flashcard',
        id: card.id,
        card,
        course,
        lesson,
        title: card.question,
        subtitle: `${course.code} · ${lesson.id} — ${lesson.title}`,
        intervalDays: rec.intervalDays,
        nextReviewAt: rec.nextReviewAt,
        daysUntil: d,
        lastRating: rec.lastRating,
        forgotCount: rec.forgotCount
      };

      if (rec.lastRating === 'forgot') {
        forgotten.push(entry);
      } else if (d !== null) {
        if (d < 0) overdue.push(entry);
        else if (d === 0) dueToday.push(entry);
        else upcoming.push(entry);
      }
    });

    upcoming.sort((a, b) => a.daysUntil - b.daysUntil);
    overdue.sort((a, b) => a.daysUntil - b.daysUntil);

    return {
      overdue,
      dueToday,
      upcoming,
      forgotten,
      mastered,
      urgentCount: overdue.length + dueToday.length + forgotten.length
    };
  }

  return {
    INTERVALS,
    daysUntil,
    recordFlashcardReview,
    scheduleLessonAfterMastery,
    recordLessonRevision,
    recordQcmAttempt,
    hasCompletedMemorizationEvidence,
    getLessonMastery,
    getWeakPoints,
    getRevisionsSummary
  };
})();
