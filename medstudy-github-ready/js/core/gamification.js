/* ==========================================================================
   EpiGamification — XP, Niveaux Académiques, Séries, Badges & Historique 7j
   Motivant, sobre et 100 % basé sur l'activité réelle de l'étudiant
   ========================================================================== */
window.EpiGamification = (function () {
  const LEVELS = [
    { level: 1, name: 'Externe Débutant', minXp: 0 },
    { level: 2, name: 'Externe Confirmé', minXp: 150 },
    { level: 3, name: 'Interne en Épidémiologie', minXp: 400 },
    { level: 4, name: 'Résident Méthodologie', minXp: 800 },
    { level: 5, name: 'Spécialiste Santé Publique', minXp: 1400 },
    { level: 6, name: 'Maître Épidémiologiste Batna', minXp: 2200 }
  ];

  const BADGES = [
    {
      id: 'first_lesson',
      title: 'Première leçon terminée',
      description: 'Maîtriser votre toute première leçon (≥ 80 % au mini-test).',
      icon: 'award',
      check: (profile, stats) => stats.masteredLessons >= 1
    },
    {
      id: 'ten_defs',
      title: '10 définitions mémorisées',
      description: 'Travailler au moins 10 éléments de mémorisation + flashcards retenues.',
      icon: 'bookmark',
      check: (profile, stats) => (stats.memCheckedTotal + stats.fcKnew) >= 10
    },
    {
      id: 'qcm_master',
      title: 'Maître des QCM',
      description: 'Répondre correctement à au moins 25 QCM avec ≥ 80 % de réussite globale.',
      icon: 'checkCircle',
      check: (profile, stats) => stats.qcmCorrect >= 25 && (stats.qcmAccuracy || 0) >= 80
    },
    {
      id: 'streak_7',
      title: 'Série de 7 jours',
      description: 'Maintenir une série active de révision pendant 7 jours consécutifs.',
      icon: 'flame',
      check: (profile) => (profile.streak.best || 0) >= 7
    },
    {
      id: 'course_completed',
      title: 'Cours terminé',
      description: 'Maîtriser 100 % des leçons d’un cours complet.',
      icon: 'graduation',
      check: (profile, stats) => stats.coursesCompleted >= 1
    },
    {
      id: 'revision_champion',
      title: 'Champion des révisions',
      description: 'Accomplir au moins 10 sessions / cartes de répétition espacée.',
      icon: 'repeat',
      check: (profile) => {
        const revTotal = Object.values(profile.dailyLog).reduce((s, d) => s + (d.revisionsDone || 0), 0);
        return revTotal >= 10;
      }
    },
    {
      id: 'bm_trap_hunter',
      title: 'Chasseur de pièges BM',
      description: 'Réussir au moins 3 QCM comportant une erreur connue du corrigé BM.',
      icon: 'shield',
      check: (profile) => {
        const errorQcms = window.EpiData.qcms.filter(q => q.bmError);
        const solved = errorQcms.filter(q => profile.qcms[q.id] && profile.qcms[q.id].correctCount > 0);
        return solved.length >= 3;
      }
    },
    {
      id: 'biostat_expert',
      title: 'Expert Biostatistique',
      description: 'Maîtriser les 2 cours de biostatistique (C11 Stat. descriptive & C12 Chi²).',
      icon: 'barChart',
      check: (profile) => {
        const c11 = window.EpiData.courses.find(c => c.id === 'C11');
        const c12 = window.EpiData.courses.find(c => c.id === 'C12');
        if (!c11 || !c12) return false;
        const s11 = window.EpiPlanner.getCourseStats(profile, c11);
        const s12 = window.EpiPlanner.getCourseStats(profile, c12);
        return s11.completed === s11.total && s12.completed === s12.total;
      }
    }
  ];

  function getLevelInfo(xp) {
    let cur = LEVELS[0];
    let next = LEVELS[1];
    for (let i = 0; i < LEVELS.length; i++) {
      if (xp >= LEVELS[i].minXp) {
        cur = LEVELS[i];
        next = LEVELS[i + 1] || null;
      }
    }
    const progressPct = next
      ? Math.min(100, Math.round(((xp - cur.minXp) / (next.minXp - cur.minXp)) * 100))
      : 100;
    return { current: cur, next, progressPct, xpToNext: next ? next.minXp - xp : 0 };
  }

  function touchStreak(profile) {
    const today = window.EpiStorage.todayKey();
    const last = profile.streak.lastActiveDate;
    if (last === today) return;

    if (last) {
      const dToday = new Date(today + 'T00:00:00');
      const dLast = new Date(last + 'T00:00:00');
      const diffDays = Math.round((dToday - dLast) / (24 * 60 * 60 * 1000));
      if (diffDays === 1) {
        profile.streak.count += 1;
      } else if (diffDays > 1) {
        profile.streak.count = 1;
      }
    } else {
      profile.streak.count = 1;
    }

    if (profile.streak.count > profile.streak.best) {
      profile.streak.best = profile.streak.count;
    }
    profile.streak.lastActiveDate = today;
  }

  function awardXP(profile, amount) {
    if (!amount || amount <= 0) return [];
    touchStreak(profile);
    profile.xp += amount;
    const log = window.EpiStorage.ensureDailyLog(profile);
    log.xpEarned += amount;
    return checkBadges(profile);
  }

  function checkBadges(profile) {
    const stats = window.EpiPlanner.getGlobalStats(profile);
    const unlockedSet = new Set((profile.badgesUnlocked || []).map(b => b.id));
    const newlyUnlocked = [];
    BADGES.forEach(badge => {
      if (!unlockedSet.has(badge.id) && badge.check(profile, stats)) {
        const rec = { id: badge.id, unlockedAt: new Date().toISOString() };
        profile.badgesUnlocked.push(rec);
        newlyUnlocked.push(badge);
      }
    });
    return newlyUnlocked;
  }

  function getWeeklyActivity(profile) {
    const days = [];
    const dayLabels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = window.EpiStorage.todayKey(d);
      const log = profile.dailyLog[key] || { qcmsDone: 0, flashcardsDone: 0, revisionsDone: 0, xpEarned: 0, lessonsMastered: [] };
      days.push({
        date: key,
        label: i === 0 ? 'Auj.' : dayLabels[d.getDay()],
        xp: log.xpEarned || 0,
        actions: (log.qcmsDone || 0) + (log.flashcardsDone || 0) + (log.revisionsDone || 0) + (log.lessonsMastered ? log.lessonsMastered.length * 5 : 0),
        qcms: log.qcmsDone || 0,
        flashcards: log.flashcardsDone || 0
      });
    }
    return days;
  }

  return {
    LEVELS,
    BADGES,
    getLevelInfo,
    touchStreak,
    awardXP,
    checkBadges,
    getWeeklyActivity
  };
})();
