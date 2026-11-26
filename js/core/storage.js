/* ==========================================================================
   EpiStorage — Persistance Synchronisée Serveur (par compte) + Fallback local
   Préserve la progression étudiante lors des mises à jour ou dépublications.
   RÈGLE STRICTE : Zéro fausse donnée de progression !
   ========================================================================== */
window.EpiStorage = (function () {
  const STORAGE_KEY = 'epimaster_batna_v1';
  let memoryFallback = null;
  let cache = null;
  let serverMode = false;
  let serverProfile = null;
  let syncTimer = null;
  let lastSyncError = null;

  function todayKey(dateObj) {
    const d = dateObj || new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function createEmptyProfile(name, customId) {
    const id = customId || ('prof_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6));
    return {
      id,
      name: (name || 'Étudiant Médecine').trim(),
      createdAt: new Date().toISOString(),
      dailyGoalMin: 45,
      xp: 0,
      streak: {
        count: 0,
        best: 0,
        lastActiveDate: null
      },
      lessons: {},
      flashcards: {},
      qcms: {},
      lessonSrs: {},
      dailyLog: {},
      examHistory: [],
      badgesUnlocked: [],
      personalBestQuiz: 0,
      dismissedNotifDate: null
    };
  }

  function normalizeProfile(raw, fallbackName, fallbackId) {
    const base = createEmptyProfile(fallbackName || (raw && raw.name), fallbackId || (raw && raw.id));
    if (!raw || typeof raw !== 'object') return base;
    return Object.assign(base, raw, {
      streak: Object.assign(base.streak, raw.streak || {}),
      lessons: raw.lessons && typeof raw.lessons === 'object' ? raw.lessons : {},
      flashcards: raw.flashcards && typeof raw.flashcards === 'object' ? raw.flashcards : {},
      qcms: raw.qcms && typeof raw.qcms === 'object' ? raw.qcms : {},
      lessonSrs: raw.lessonSrs && typeof raw.lessonSrs === 'object' ? raw.lessonSrs : {},
      dailyLog: raw.dailyLog && typeof raw.dailyLog === 'object' ? raw.dailyLog : {},
      examHistory: Array.isArray(raw.examHistory) ? raw.examHistory : [],
      badgesUnlocked: Array.isArray(raw.badgesUnlocked) ? raw.badgesUnlocked : []
    });
  }

  function hydrateFromServer(progressObj, user) {
    serverMode = true;
    serverProfile = normalizeProfile(progressObj, user && user.name, user && user.id);
    lastSyncError = null;
    return serverProfile;
  }

  function clearServerSession() {
    if (syncTimer) { clearTimeout(syncTimer); syncTimer = null; }
    serverMode = false;
    serverProfile = null;
  }

  function isServerMode() {
    return serverMode;
  }

  function syncNow() {
    if (!serverMode || !serverProfile || !window.EpiAPI) return Promise.resolve();
    if (syncTimer) { clearTimeout(syncTimer); syncTimer = null; }
    return window.EpiAPI.saveProgress(serverProfile).then(() => {
      lastSyncError = null;
    }).catch((err) => {
      lastSyncError = err.message;
      console.warn('MedStudy sync progress warning:', err);
    });
  }

  function scheduleServerSync() {
    if (!serverMode || !serverProfile || !window.EpiAPI) return;
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(() => {
      syncTimer = null;
      syncNow();
    }, 120);
  }

  function createDefaultStore() {
    const first = createEmptyProfile('Étudiant Médecine Batna 2');
    return {
      version: 1,
      activeProfileId: first.id,
      profiles: { [first.id]: first }
    };
  }

  function readRaw() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.profiles && Object.keys(parsed.profiles).length > 0) {
          if (!parsed.profiles[parsed.activeProfileId]) {
            parsed.activeProfileId = Object.keys(parsed.profiles)[0];
          }
          return parsed;
        }
      }
    } catch (e) {
      if (memoryFallback) return memoryFallback;
    }
    const fresh = createDefaultStore();
    writeRaw(fresh);
    return fresh;
  }

  function writeRaw(store) {
    memoryFallback = store;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {
      console.warn('EpiStorage: sauvegarde localStorage impossible, mode mémoire actif.', e);
    }
  }

  function getStore() {
    if (serverMode && serverProfile) {
      return {
        version: 2,
        activeProfileId: serverProfile.id,
        profiles: { [serverProfile.id]: serverProfile }
      };
    }
    if (!cache) cache = readRaw();
    return cache;
  }

  function save() {
    if (serverMode) {
      scheduleServerSync();
      return;
    }
    writeRaw(getStore());
  }

  function getActiveProfile() {
    if (serverMode && serverProfile) return serverProfile;
    const store = getStore();
    return store.profiles[store.activeProfileId];
  }

  function listProfiles() {
    if (serverMode && serverProfile) return [serverProfile];
    const store = getStore();
    return Object.values(store.profiles);
  }

  function createProfile(name) {
    if (serverMode) return serverProfile;
    const store = getStore();
    const prof = createEmptyProfile(name || 'Nouveau profil');
    store.profiles[prof.id] = prof;
    store.activeProfileId = prof.id;
    save();
    return prof;
  }

  function switchProfile(profileId) {
    if (serverMode) return false;
    const store = getStore();
    if (store.profiles[profileId]) {
      store.activeProfileId = profileId;
      save();
      return true;
    }
    return false;
  }

  function renameProfile(profileId, newName) {
    const trimmed = (newName || '').trim();
    if (!trimmed) return false;
    if (serverMode && serverProfile) {
      serverProfile.name = trimmed;
      syncNow();
      return true;
    }
    const store = getStore();
    if (store.profiles[profileId]) {
      store.profiles[profileId].name = trimmed;
      save();
      return true;
    }
    return false;
  }

  function deleteProfile(profileId) {
    if (serverMode) return false;
    const store = getStore();
    const ids = Object.keys(store.profiles);
    if (ids.length <= 1 || !store.profiles[profileId]) return false;
    delete store.profiles[profileId];
    if (store.activeProfileId === profileId) {
      store.activeProfileId = Object.keys(store.profiles)[0];
    }
    save();
    return true;
  }

  function resetActiveProfile() {
    if (serverMode && serverProfile) {
      const fresh = createEmptyProfile(serverProfile.name, serverProfile.id);
      serverProfile = fresh;
      syncNow();
      return fresh;
    }
    const store = getStore();
    const cur = getActiveProfile();
    const fresh = createEmptyProfile(cur.name, cur.id);
    store.profiles[cur.id] = fresh;
    save();
    return fresh;
  }

  function ensureLessonRecord(profile, lessonId) {
    if (!profile.lessons[lessonId]) {
      profile.lessons[lessonId] = {
        status: 'not_started',
        studied: false,
        mastered: false,
        stepAVisited: false,
        memCheckedIds: [],
        memDeclaredAll: false,
        miniTestBest: null,
        miniTestAttempts: 0,
        lastMiniTestScore: null,
        lastStudiedAt: null,
        masteredAt: null,
        seenRevisionVersion: 1
      };
    } else if (profile.lessons[lessonId].seenRevisionVersion == null) {
      profile.lessons[lessonId].seenRevisionVersion = 1;
    }
    return profile.lessons[lessonId];
  }

  function isLessonFlaggedUpdated(profile, lesson) {
    const lRec = profile && profile.lessons ? profile.lessons[lesson.id] : null;
    if (!lRec) return false;
    const hasProgress = lRec.studied || lRec.mastered || lRec.stepAVisited || lRec.status !== 'not_started';
    if (!hasProgress) return false;
    const rev = Number(lesson.revisionVersion) || 1;
    const seen = Number(lRec.seenRevisionVersion) || 1;
    return rev > seen;
  }

  function acknowledgeLessonUpdate(profile, lesson) {
    const lRec = ensureLessonRecord(profile, lesson.id);
    lRec.seenRevisionVersion = Number(lesson.revisionVersion) || 1;
    save();
  }

  function ensureDailyLog(profile, dateStr) {
    const key = dateStr || todayKey();
    if (!profile.dailyLog[key]) {
      profile.dailyLog[key] = {
        lessonsStudied: [],
        lessonsMastered: [],
        memItems: [],
        flashcardsDone: 0,
        qcmsDone: 0,
        qcmsCorrect: 0,
        revisionsDone: 0,
        xpEarned: 0
      };
    }
    return profile.dailyLog[key];
  }

  function exportJSON() {
    return JSON.stringify(getStore(), null, 2);
  }

  function importJSON(jsonText) {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed || !parsed.profiles || typeof parsed.profiles !== 'object') {
        return { ok: false, error: 'Format de fichier de sauvegarde invalide.' };
      }
      const ids = Object.keys(parsed.profiles);
      if (ids.length === 0) return { ok: false, error: 'Aucun profil trouvé dans la sauvegarde.' };
      if (!parsed.profiles[parsed.activeProfileId]) parsed.activeProfileId = ids[0];
      if (serverMode && serverProfile) {
        const imported = parsed.profiles[parsed.activeProfileId];
        serverProfile = normalizeProfile(imported, serverProfile.name, serverProfile.id);
        syncNow();
        return { ok: true, profilesCount: 1 };
      }
      cache = parsed;
      save();
      return { ok: true, profilesCount: ids.length };
    } catch (e) {
      return { ok: false, error: 'JSON illisible : ' + e.message };
    }
  }

  return {
    todayKey,
    hydrateFromServer,
    clearServerSession,
    isServerMode,
    syncNow,
    getStore,
    save,
    getActiveProfile,
    listProfiles,
    createProfile,
    switchProfile,
    renameProfile,
    deleteProfile,
    resetActiveProfile,
    ensureLessonRecord,
    isLessonFlaggedUpdated,
    acknowledgeLessonUpdate,
    ensureDailyLog,
    exportJSON,
    importJSON
  };
})();
