/* ==========================================================================
   EpiPlanner — Planificateur Quotidien Personnalisé (15–120 min)
   & Moteur "Que faire maintenant ?" (Next Best Action)
   ========================================================================== */
window.EpiPlanner = (function () {
  const TIME_PRESETS = [
    { min: 15, label: '15 min (Express)', lessons: 0, definitions: 3, qcms: 5, revisions: 1 },
    { min: 30, label: '30 min (Ciblé)', lessons: 1, definitions: 4, qcms: 8, revisions: 1 },
    { min: 45, label: '45 min (Standard)', lessons: 1, definitions: 5, qcms: 10, revisions: 2 },
    { min: 60, label: '60 min (Soutenu)', lessons: 1, definitions: 7, qcms: 14, revisions: 2 },
    { min: 90, label: '90 min (Intensif)', lessons: 2, definitions: 10, qcms: 20, revisions: 3 },
    { min: 120, label: '120 min (Marathon)', lessons: 2, definitions: 14, qcms: 28, revisions: 4 }
  ];

  function getPreset(minutes) {
    return TIME_PRESETS.find(p => p.min === Number(minutes)) || TIME_PRESETS[2];
  }

  function getAllLessonsFlat() {
    const out = [];
    window.EpiData.courses.forEach(course => {
      course.lessons.forEach(lesson => {
        out.push({ course, lesson });
      });
    });
    return out;
  }

  function getCourseStats(profile, course) {
    let completed = 0; // maîtrisées
    let studied = 0;
    let inProgress = 0;
    let green = 0, orange = 0, red = 0;
    let needsRevision = 0;

    course.lessons.forEach(lesson => {
      const lRec = profile.lessons[lesson.id];
      const m = window.EpiSRS.getLessonMastery(profile, lesson);
      const srs = profile.lessonSrs[lesson.id];

      if (lRec && lRec.mastered) completed++;
      if (lRec && lRec.studied) studied++;
      if (lRec && lRec.status === 'in_progress') inProgress++;

      if (m.level === 'green') green++;
      else if (m.level === 'orange') orange++;
      else if (m.level === 'red') red++;

      const due = srs && srs.nextReviewAt && window.EpiSRS.daysUntil(srs.nextReviewAt) <= 0;
      if (due || m.level === 'red') needsRevision++;
    });

    const total = course.lessons.length;
    const cj = window.EpiJourney ? window.EpiJourney.getCourseJourney(profile, course) : null;
    const progressPct = cj
      ? cj.overallPct
      : (total > 0 ? Math.round(((completed + studied * 0.35 - completed * 0.35) / total) * 100) : 0);
    const masteryPct = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      studied,
      remaining: total - completed,
      inProgress,
      green,
      orange,
      red,
      needsRevision,
      progressPct: Math.min(100, Math.max(0, progressPct)),
      masteryPct,
      phasesCompleted: cj ? cj.completedPhases : 0,
      phasesTotal: cj ? cj.totalPhases : 0,
      stepsCompleted: cj ? cj.completedSteps : 0,
      stepsTotal: cj ? cj.totalSteps : 0,
      journeyCompletedLessons: cj ? cj.completedLessons : completed
    };
  }

  function getGlobalStats(profile) {
    const flat = getAllLessonsFlat();
    let totalLessons = flat.length;
    let masteredLessons = 0;
    let studiedLessons = 0;
    let inProgressLessons = 0;
    let coursesCompleted = 0;

    window.EpiData.courses.forEach(c => {
      const st = getCourseStats(profile, c);
      masteredLessons += st.completed;
      studiedLessons += st.studied;
      inProgressLessons += st.inProgress;
      if (st.completed === st.total && st.total > 0) coursesCompleted++;
    });

    // Performance QCM réelle
    const qcmRecords = Object.values(profile.qcms);
    let qcmAttempts = 0, qcmCorrect = 0;
    qcmRecords.forEach(r => {
      qcmAttempts += r.attempts;
      qcmCorrect += r.correctCount;
    });
    const qcmAccuracy = qcmAttempts > 0 ? Math.round((qcmCorrect / qcmAttempts) * 100) : null;

    // Performance mémorisation (flashcards réelles)
    const fcRecords = Object.values(profile.flashcards);
    let fcTotal = 0, fcKnew = 0;
    fcRecords.forEach(r => {
      fcTotal += r.totalReviews;
      fcKnew += r.knownCount;
    });
    const fcRetention = fcTotal > 0 ? Math.round((fcKnew / fcTotal) * 100) : null;

    // Définitions/éléments cochés et vérifiés
    let memCheckedTotal = 0;
    Object.values(profile.lessons).forEach(l => {
      memCheckedTotal += (l.memCheckedIds || []).length;
    });

    const overallPct = totalLessons > 0 ? Math.round((masteredLessons / totalLessons) * 100) : 0;

    return {
      totalLessons,
      masteredLessons,
      studiedLessons,
      inProgressLessons,
      remainingLessons: totalLessons - masteredLessons,
      coursesCompleted,
      totalCourses: window.EpiData.courses.length,
      overallPct,
      qcmAttempts,
      qcmCorrect,
      qcmAccuracy,
      fcTotal,
      fcKnew,
      fcRetention,
      memCheckedTotal
    };
  }

  // Recommande la prochaine leçon prioritaire non maîtrisée
  function getRecommendedNextLesson(profile, excludeLessonId) {
    const flat = getAllLessonsFlat().filter(x => x.lesson.id !== excludeLessonId);

    // 1) Leçon déjà commencée (in_progress) la plus prioritaire
    const inProg = flat.filter(x => {
      const r = profile.lessons[x.lesson.id];
      return r && !r.mastered && (r.status === 'in_progress' || r.studied);
    }).sort((a, b) => b.lesson.priorityScore - a.lesson.priorityScore);
    if (inProg.length > 0) return inProg[0];

    // 2) Leçon non commencée la plus rentable à l'examen (score BM puis ordre cours)
    const unstarted = flat.filter(x => {
      const r = profile.lessons[x.lesson.id];
      return !r || !r.mastered;
    }).sort((a, b) => {
      if (b.lesson.priorityScore !== a.lesson.priorityScore) {
        return b.lesson.priorityScore - a.lesson.priorityScore;
      }
      return b.lesson.bmCount - a.lesson.bmCount;
    });
    return unstarted[0] || null;
  }

  function getNextLessonInCourse(profile, courseId, currentLessonId) {
    const course = window.EpiData.courses.find(c => c.id === courseId);
    if (!course) return null;
    const idx = course.lessons.findIndex(l => l.id === currentLessonId);
    for (let i = idx + 1; i < course.lessons.length; i++) {
      const l = course.lessons[i];
      const r = profile.lessons[l.id];
      if (!r || !r.mastered) return { course, lesson: l };
    }
    return getRecommendedNextLesson(profile, currentLessonId);
  }

  // Moteur "Que faire maintenant ?" (toujours 1 action claire et prioritaire)
  function getNextBestAction(profile) {
    const rev = window.EpiSRS.getRevisionsSummary(profile);
    const weak = window.EpiSRS.getWeakPoints(profile);
    const redWeak = weak.filter(w => w.mastery.level === 'red');

    // 1. Révisions en retard ou concepts oubliés
    if (rev.overdue.length > 0 || rev.forgotten.length > 0) {
      const count = rev.overdue.length + rev.forgotten.length;
      return {
        type: 'revisions',
        badge: 'Priorité mémoire · Répétition espacée',
        title: `Réviser ${count} notion${count > 1 ? 's' : ''} urgente${count > 1 ? 's' : ''} (${rev.forgotten.length} oubliée${rev.forgotten.length > 1 ? 's' : ''}, ${rev.overdue.length} en retard)`,
        reason: 'Consolider immédiatement les notions oubliées ou en retard empêche la courbe de l’oubli d’effacer vos acquis.',
        ctaLabel: 'Lancer ma session de révision',
        action: { route: 'revisions', startSession: true }
      };
    }

    // 2. Continuer une leçon en cours
    const flat = getAllLessonsFlat();
    const inProg = flat.find(x => {
      const r = profile.lessons[x.lesson.id];
      const lj = window.EpiJourney ? window.EpiJourney.getLessonJourney(profile, x.course, x.lesson) : null;
      return ((r && r.status === 'in_progress') || (lj && lj.status === 'in_progress')) && !(r && r.mastered && lj && lj.isCompleted);
    });
    if (inProg) {
      const lj = window.EpiJourney ? window.EpiJourney.getLessonJourney(profile, inProg.course, inProg.lesson) : null;
      const targetPhase = (lj && lj.nextPhase) || { key: 'A', name: 'À comprendre', progressText: '' };
      const step = targetPhase.key || 'A';
      const subStepId = targetPhase.nextStep ? targetPhase.nextStep.id : '';

      return {
        type: 'lesson',
        badge: `Leçon en cours · ${inProg.course.code}`,
        title: `Continuer : ${inProg.lesson.title}`,
        reason: lj
          ? `Progression : ${lj.completedPhases}/${lj.totalPhases} phases (${lj.overallPct} %). Reprenez directement dans « ${targetPhase.name} » (${targetPhase.progressText}).`
          : `Vous avez déjà entamé cette leçon. Reprenez à la phase suivante pour valider la maîtrise (≥ 80 %).`,
        ctaLabel: `Reprendre : ${targetPhase.shortName || targetPhase.name}`,
        action: { route: 'lesson', courseId: inProg.course.id, lessonId: inProg.lesson.id, step, subStepId }
      };
    }

    // 3. Révisions dues aujourd'hui
    if (rev.dueToday.length > 0) {
      return {
        type: 'revisions',
        badge: 'Planifié aujourd’hui · SRS',
        title: `Compléter ${rev.dueToday.length} révision${rev.dueToday.length > 1 ? 's' : ''} programmée${rev.dueToday.length > 1 ? 's' : ''} aujourd’hui`,
        reason: 'Valider vos révisions au bon intervalle (J+1 / J+3 / J+7 / J+14 / J+30) ancre la mémoire à long terme.',
        ctaLabel: 'Faire mes révisions du jour',
        action: { route: 'revisions', startSession: true }
      };
    }

    // 4. Point faible rouge
    if (redWeak.length > 0) {
      const top = redWeak[0];
      return {
        type: 'weak',
        badge: `Point faible prioritaire · ${top.course.code}`,
        title: `Consolider : ${top.lesson.title}`,
        reason: top.mastery.reasons[0] || 'Résultats récents à renforcer avant de passer à la suite.',
        ctaLabel: 'Pratiquer ce point faible',
        action: { route: 'lesson', courseId: top.course.id, lessonId: top.lesson.id, step: top.targetStep }
      };
    }

    // 5. Prochaine leçon haute priorité examen
    const next = getRecommendedNextLesson(profile);
    if (next) {
      const bmNote = next.lesson.bmCount > 0
        ? `${next.lesson.bmCount} QCM recensés dans la BM Épidémiologie (score priorité ${next.lesson.priorityScore}/100).`
        : `Section importante du cours (vigilance examen 2026).`;
      return {
        type: 'lesson',
        badge: `Recommandé par la BM · ${next.course.code}`,
        title: `Étudier : ${next.lesson.title}`,
        reason: bmNote,
        ctaLabel: 'Commencer à apprendre',
        action: { route: 'lesson', courseId: next.course.id, lessonId: next.lesson.id, step: 'A' }
      };
    }

    // 6. Tout maîtrisé -> simulation examen !
    return {
      type: 'exam',
      badge: 'Programme maîtrisé · Mode Examen',
      title: 'Lancer une simulation d’examen chronométrée (30 QCM)',
      reason: 'Toutes les leçons sont maîtrisées ! Maintenez votre niveau avec des simulations mixtes en conditions réelles.',
      ctaLabel: 'Démarrer la simulation',
      action: { route: 'qcm', startExam: 30 }
    };
  }

  // Mission du jour adaptée au temps disponible
  function getDailyMission(profile) {
    const preset = getPreset(profile.dailyGoalMin);
    const log = window.EpiStorage.ensureDailyLog(profile);
    const rev = window.EpiSRS.getRevisionsSummary(profile);
    const nextLesson = getRecommendedNextLesson(profile);

    // Ajuster la cible de révisions au réel si l'utilisateur a des révisions dues
    const revTarget = rev.urgentCount > 0 ? Math.min(preset.revisions, rev.urgentCount) : preset.revisions;

    const tasks = [];
    if (preset.lessons > 0) {
      const done = log.lessonsMastered.length + (log.lessonsStudied.length > log.lessonsMastered.length ? 0.5 : 0);
      tasks.push({
        id: 'task_lessons',
        label: `Étudier ${preset.lessons} nouvelle${preset.lessons > 1 ? 's' : ''} leçon${preset.lessons > 1 ? 's' : ''}`,
        detail: nextLesson ? `Recommandée : ${nextLesson.course.code} — ${nextLesson.lesson.title}` : 'Toutes les leçons sont maîtrisées !',
        current: Math.min(preset.lessons, Math.floor(done)),
        target: preset.lessons,
        completed: log.lessonsStudied.length >= preset.lessons,
        action: nextLesson ? { route: 'lesson', courseId: nextLesson.course.id, lessonId: nextLesson.lesson.id, step: 'A' } : { route: 'courses' }
      });
    }

    tasks.push({
      id: 'task_defs',
      label: `Mémoriser ${preset.definitions} notions / définitions clés`,
      detail: 'Cochez les éléments à mémoriser (Étape B) puis testez-les en flashcards (Étape C)',
      current: Math.min(preset.definitions, log.memItems.length + log.flashcardsDone),
      target: preset.definitions,
      completed: (log.memItems.length + log.flashcardsDone) >= preset.definitions,
      action: nextLesson ? { route: 'lesson', courseId: nextLesson.course.id, lessonId: nextLesson.lesson.id, step: 'B' } : { route: 'courses' }
    });

    tasks.push({
      id: 'task_qcms',
      label: `Compléter ${preset.qcms} QCM d’entraînement`,
      detail: 'Priorité aux originaux BM Épidémiologie et aux pièges fréquents',
      current: Math.min(preset.qcms, log.qcmsDone),
      target: preset.qcms,
      completed: log.qcmsDone >= preset.qcms,
      action: { route: 'qcm' }
    });

    tasks.push({
      id: 'task_rev',
      label: rev.urgentCount > 0
        ? `Réviser ${revTarget} notion${revTarget > 1 ? 's' : ''} due${revTarget > 1 ? 's' : ''} (SRS)`
        : `Faire ${revTarget} révision${revTarget > 1 ? 's' : ''} de consolidation`,
      detail: rev.urgentCount > 0
        ? `${rev.urgentCount} révision(s) en attente dans « Mes révisions »`
        : 'Aucune révision en retard — pratiquez vos flashcards ou une ancienne leçon',
      current: Math.min(revTarget, log.revisionsDone),
      target: revTarget,
      completed: log.revisionsDone >= revTarget,
      action: { route: 'revisions' }
    });

    const completedTasks = tasks.filter(t => t.completed).length;
    return {
      preset,
      tasks,
      completedTasks,
      totalTasks: tasks.length,
      pct: Math.round((completedTasks / tasks.length) * 100)
    };
  }

  return {
    TIME_PRESETS,
    getPreset,
    getAllLessonsFlat,
    getCourseStats,
    getGlobalStats,
    getRecommendedNextLesson,
    getNextLessonInCourse,
    getNextBestAction,
    getDailyMission
  };
})();
