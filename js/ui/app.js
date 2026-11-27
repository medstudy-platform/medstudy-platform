/* ==========================================================================
   EpiApp — Contrôleur SPA Principal MedStudy (Étudiant + Authentification + Admin CMS)
   Contrôle d'accès sécurisé côté serveur · Persistance synchronisée · Zéro bouton inactif
   ========================================================================== */
window.EpiApp = (function () {
  // Conserver une copie immuable des données initiales (seed unique au 1er démarrage serveur)
  const INITIAL_SEED_SNAPSHOT = window.EpiData ? JSON.parse(JSON.stringify(window.EpiData)) : null;

  const state = {
    booting: true,
    authenticated: !window.EpiAPI.isHttp, // mode offline file:// si hors serveur HTTP
    user: null, // { id, email, name, role: 'admin'|'student' }
    authUi: { mode: 'login', email: '', error: null, busy: false },

    route: 'dashboard', // dashboard | courses | course | lesson | priorities | exam_analysis | final_strategy | revisions | weak | qcm | evolution | admin_courses | admin_inventory | admin_add | admin_editor | admin_modules | admin_security
    courseId: null,
    courseTab: 'roadmap',
    lessonId: null,
    lessonStep: 'A',
    prioritiesTab: 'matrix',
    analysisTab: 'frequencies',
    analysisScoreFilter: 'all',
    strategyTab: 'waves',
    revChecks: {},
    weakFilter: 'all',
    courseFilters: { search: '', subject: 'all', moduleId: 'all', priority: 'all', status: 'all' },
    qcmFilters: { courseId: 'all', sourceType: 'all', special: 'all' },
    qcmLimit: 15,
    sidebarOpen: false,

    // État CMS Administrateur
    adminData: { modules: [], courses: [], flashcards: [], qcms: [], backups: [], users: [], importJobs: [], sourceInventory: [], aiConfig: { provider: 'local', configured: false } },
    adminState: {
      filters: { status: 'all', moduleId: 'all', search: '' },
      invFilters: { status: 'all', search: '' },
      addWizard: { createdCourseId: null, showNewModule: false, selectedModuleId: '', analyzing: false, uploading: false, pendingFiles: [], pendingSupportFiles: [], activeJob: null },
      editor: null,
      scanningPpts: false,
      previewReturnRoute: 'admin_ppt_imports'
    },

    // État éphémère de session étudiante
    theme: window.EpiStorage ? window.EpiStorage.getTheme() : 'light',
    runtime: {
      activeSubStepId: null,
      courseLessonsNavOpen: false,
      phaseStepsCollapsed: false,
      activeRecall: {},
      flashcard: { cardId: null, revealed: false, draft: '' },
      lessonQcms: {},
      arenaQcms: {},
      miniTest: { answers: {}, submitted: false, scorePct: 0, correctCount: 0, newlyMastered: false },
      revSession: null,
      examSim: null
    }
  };

  let examTimerHandle = null;

  function isAdmin() {
    return !!(state.user && state.user.role === 'admin');
  }

  function sortCoursesNaturally(list) {
    const rank = (c) => {
      const mC = String((c && (c.code || c.id)) || '').match(/^C(\d+)$/i);
      if (mC) return parseInt(mC[1], 10);
      const mP = String((c && c.code) || '').match(/^PPT(\d+)$/i);
      if (mP) return 100 + parseInt(mP[1], 10);
      return 500;
    };
    return window.EpiUI.asArr(list).slice().sort((a, b) => rank(a) - rank(b) || String(a.id).localeCompare(String(b.id)));
  }

  function applyStudentCatalog(cat) {
    if (!cat) return;
    const prevMasterAnalysis = window.EpiData && window.EpiData.masterExamAnalysis;
    const prevMasterStrategy = window.EpiData && window.EpiData.masterFinalStrategy;
    window.EpiData = {
      modules: window.EpiUI.asArr(cat.modules),
      courses: sortCoursesNaturally(cat.courses).map(c => Object.assign({}, c, {
        lessons: window.EpiUI.asArr(c.lessons),
        sourceFiles: window.EpiUI.asArr(c.sourceFiles),
        attachments: window.EpiUI.asArr(c.attachments)
      })),
      flashcards: window.EpiUI.asArr(cat.flashcards),
      qcms: window.EpiUI.asArr(cat.qcms).map(q => Object.assign({}, q, {
        options: window.EpiUI.asArr(q.options),
        correct: window.EpiUI.asArr(q.correct)
      })),
      bmAudit: cat.bmAudit || {},
      bmErrors: window.EpiUI.asArr(cat.bmErrors),
      outOfCourseBM: window.EpiUI.asArr(cat.outOfCourseBM),
      masterExamAnalysis: cat.masterExamAnalysis || prevMasterAnalysis || null,
      masterFinalStrategy: cat.masterFinalStrategy || prevMasterStrategy || null
    };
  }

  async function refreshAllData() {
    if (!window.EpiAPI.isHttp || !state.authenticated) return;
    const [cat, progRes] = await Promise.all([
      window.EpiAPI.getCatalog(),
      window.EpiAPI.getProgress()
    ]);
    applyStudentCatalog(cat);
    window.EpiStorage.hydrateFromServer(progRes.progress, state.user);
    state.theme = window.EpiStorage.getTheme();

    if (isAdmin()) {
      const adm = await window.EpiAPI.getAdminCatalog();
      state.adminData = {
        modules: window.EpiUI.asArr(adm.modules),
        courses: window.EpiUI.asArr(adm.courses),
        flashcards: window.EpiUI.asArr(adm.flashcards),
        qcms: window.EpiUI.asArr(adm.qcms),
        backups: window.EpiUI.asArr(adm.backups),
        users: window.EpiUI.asArr(adm.users),
        importJobs: window.EpiUI.asArr(adm.importJobs),
        sourceInventory: window.EpiUI.asArr(adm.sourceInventory).length ? window.EpiUI.asArr(adm.sourceInventory) : window.EpiUI.asArr(INITIAL_SEED_SNAPSHOT && INITIAL_SEED_SNAPSHOT.sourceInventory),
        aiConfig: adm.aiConfig || { provider: 'local', configured: false }
      };
      if (!state.adminState.addWizard.selectedModuleId && state.adminData.modules[0]) {
        state.adminState.addWizard.selectedModuleId = state.adminData.modules[0].id;
      }
    }
  }

  async function refreshCatalogsOnly() {
    if (!window.EpiAPI.isHttp || !state.authenticated) return;
    const cat = await window.EpiAPI.getCatalog();
    applyStudentCatalog(cat);
    if (isAdmin()) {
      const adm = await window.EpiAPI.getAdminCatalog();
      state.adminData = {
        modules: window.EpiUI.asArr(adm.modules),
        courses: window.EpiUI.asArr(adm.courses),
        flashcards: window.EpiUI.asArr(adm.flashcards),
        qcms: window.EpiUI.asArr(adm.qcms),
        backups: window.EpiUI.asArr(adm.backups),
        users: window.EpiUI.asArr(adm.users),
        importJobs: window.EpiUI.asArr(adm.importJobs),
        sourceInventory: window.EpiUI.asArr(adm.sourceInventory).length ? window.EpiUI.asArr(adm.sourceInventory) : window.EpiUI.asArr(INITIAL_SEED_SNAPSHOT && INITIAL_SEED_SNAPSHOT.sourceInventory),
        aiConfig: adm.aiConfig || { provider: 'local', configured: false }
      };
    }
  }

  function openCourseInEditor(courseId, initialTab) {
    const c = state.adminData.courses.find(x => x.id === courseId);
    if (!c) {
      window.EpiUI.toast('Cours introuvable dans le CMS.', 'warning');
      return;
    }
    const cloneCourse = JSON.parse(JSON.stringify(c));
    cloneCourse.lessons = window.EpiUI.asArr(cloneCourse.lessons);
    cloneCourse.attachments = window.EpiUI.asArr(cloneCourse.attachments);
    const fcs = JSON.parse(JSON.stringify(state.adminData.flashcards.filter(f => f.courseId === courseId)));
    const qs = JSON.parse(JSON.stringify(state.adminData.qcms.filter(q => q.courseId === courseId)));

    const latestJob = window.EpiUI.asArr(state.adminData.importJobs).find(j => j.courseId === courseId) || null;
    state.adminState.editor = {
      course: cloneCourse,
      flashcards: fcs,
      qcms: qs,
      tab: initialTab || 'lessons',
      activeLessonIdx: 0,
      fcLessonFilter: 'all',
      qcmLessonFilter: 'all',
      qcmSourceFilter: 'all',
      majorLessonIds: [],
      qualityReport: (cloneCourse.aiExtraction && cloneCourse.aiExtraction.qualityReport) || (cloneCourse.metadata && cloneCourse.metadata.lastQualityReport) || null,
      activeJob: latestJob,
      dirty: false,
      saving: false,
      analyzing: false,
      regenerating: false
    };
    state.route = 'admin_editor';
    state.sidebarOpen = false;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function runUniversalImportPipeline(courseId, existingJobId, retryStage) {
    const syncJobUi = (jobObj, busy) => {
      if (state.adminState.addWizard && state.adminState.addWizard.createdCourseId === courseId) {
        state.adminState.addWizard.activeJob = jobObj;
        state.adminState.addWizard.analyzing = busy;
      }
      if (state.adminState.editor && state.adminState.editor.course && state.adminState.editor.course.id === courseId) {
        state.adminState.editor.activeJob = jobObj;
        state.adminState.editor.analyzing = busy;
      }
      render();
    };

    try {
      let job = null;
      if (existingJobId) {
        const res = await window.EpiAPI.stepImportJob(existingJobId, retryStage);
        job = res.job;
        syncJobUi(job, !res.completed && res.ok);
        if (!res.ok) {
          window.EpiUI.toast(res.error || 'Échec de l’étape du pipeline.', 'warning');
          return;
        }
      } else {
        syncJobUi(null, true);
        const startRes = await window.EpiAPI.startImportJob(courseId);
        job = startRes.job;
        syncJobUi(job, true);
      }

      let guard = 0;
      while (job && job.status === 'running' && guard < 14) {
        guard++;
        const stepRes = await window.EpiAPI.stepImportJob(job.id);
        job = stepRes.job;
        if (!stepRes.ok) {
          syncJobUi(job, false);
          window.EpiUI.toast(stepRes.error || `Erreur à l’étape ${job ? job.currentStage : ''}.`, 'warning');
          return;
        }
        syncJobUi(job, !stepRes.completed);
        if (stepRes.completed) {
          await refreshCatalogsOnly();
          const freshCourse = state.adminData.courses.find(c => c.id === courseId);
          const qr = job.qualityReport || (freshCourse && freshCourse.aiExtraction && freshCourse.aiExtraction.qualityReport);
          const ai = (freshCourse && freshCourse.aiExtraction) || {};
          window.EpiUI.toast(
            `Pipeline 11 étapes terminé : ${ai.lessonsExtracted || 0} leçon(s), ${ai.flashcardsCreated || 0} flashcards, ${ai.qcmsCreated || 0} QCM · Qualité ${qr ? qr.score + '/100' : 'OK'} (en brouillon).`,
            'success'
          );
          if (state.route === 'admin_editor' && state.adminState.editor && state.adminState.editor.course.id === courseId) {
            openCourseInEditor(courseId, 'lessons');
          } else {
            syncJobUi(job, false);
          }
          return;
        }
      }
      syncJobUi(job, false);
    } catch (err) {
      if (state.adminState.addWizard) state.adminState.addWizard.analyzing = false;
      if (state.adminState.editor) state.adminState.editor.analyzing = false;
      window.EpiUI.toast(err.message || 'Erreur lors du traitement du cours.', 'warning');
      render();
    }
  }

  function stopExamTimer() {
    if (examTimerHandle) {
      clearInterval(examTimerHandle);
      examTimerHandle = null;
    }
  }

  function startExamTimer() {
    stopExamTimer();
    examTimerHandle = setInterval(() => {
      const sim = state.runtime.examSim;
      const el = document.getElementById('exam-timer');
      if (!sim || !sim.active || sim.submitted || !el) {
        stopExamTimer();
        return;
      }
      const sec = Math.floor((Date.now() - sim.startedAt) / 1000);
      el.textContent = `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
    }, 1000);
  }

  function notifyBadges(newBadges) {
    (newBadges || []).forEach(b => {
      window.EpiUI.toast(`🏆 Badge débloqué : ${b.title} !`, 'success');
    });
  }

  function getActiveCatalog() {
    if (isAdmin() && (state.route === 'admin_preview_course' || state.route === 'admin_preview_lesson')) {
      return state.adminData;
    }
    return window.EpiData;
  }

  function findLesson(lessonId, catalog) {
    const src = catalog || getActiveCatalog();
    for (const c of window.EpiUI.asArr(src.courses)) {
      for (const l of window.EpiUI.asArr(c.lessons)) {
        if (l.id === lessonId) return { course: c, lesson: l };
      }
    }
    return null;
  }

  function openLesson(courseId, lessonId, step, subStepId) {
    const profile = window.EpiStorage.getActiveProfile();
    const pair = findLesson(lessonId);
    if (!pair) return;
    state.route = 'lesson';
    state.courseId = pair.course.id;
    state.lessonId = pair.lesson.id;
    state.sidebarOpen = false;
    state.runtime.courseLessonsNavOpen = false;
    state.runtime.phaseStepsCollapsed = false;
    state.runtime.activeRecall = {};
    state.runtime.flashcard = { cardId: null, revealed: false, draft: '' };
    state.runtime.lessonQcms = {};
    state.runtime.miniTest = { answers: {}, submitted: false, scorePct: 0, correctCount: 0, newlyMastered: false };

    const lj = window.EpiJourney.getLessonJourney(profile, pair.course, pair.lesson, {
      catalog: window.EpiData,
      runtime: state.runtime,
      activePhaseKey: step || null,
      activeStepId: subStepId || null
    });

    const chosenPhase = step
      ? (lj.phases.find(p => p.key === step) || lj.activePhase || lj.phases[0])
      : (lj.nextPhase || lj.phases[0]);
    state.lessonStep = chosenPhase ? chosenPhase.key : 'A';

    const lRec = profile.lessons[pair.lesson.id];
    const savedStepId = lRec && lRec.lastActiveStepByPhase && lRec.lastActiveStepByPhase[state.lessonStep];
    const resolvedStep = chosenPhase && chosenPhase.steps.length
      ? (chosenPhase.steps.find(s => s.id === subStepId)
        || chosenPhase.steps.find(s => s.id === savedStepId)
        || chosenPhase.nextStep
        || chosenPhase.steps[0])
      : null;
    state.runtime.activeSubStepId = resolvedStep ? resolvedStep.id : null;

    // RÈGLE STRICTE : ouvrir une leçon ou une étape NE la marque PAS comme étudiée ni terminée !
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startRevisionSession(mode) {
    const profile = window.EpiStorage.getActiveProfile();
    const rev = window.EpiSRS.getRevisionsSummary(profile);
    let queue = [];

    if (mode === 'urgent') {
      const urgentCards = [...rev.forgotten, ...rev.overdue, ...rev.dueToday].filter(x => x.kind === 'flashcard');
      urgentCards.forEach(u => {
        queue.push({ card: u.card, courseCode: u.course.code, lessonTitle: u.lesson.title, lessonId: u.lesson.id });
      });
      const urgentLessons = [...rev.overdue, ...rev.dueToday].filter(x => x.kind === 'lesson');
      urgentLessons.forEach(u => {
        const lCards = window.EpiData.flashcards.filter(f => f.lessonId === u.lesson.id);
        lCards.forEach(c => {
          if (!queue.some(q => q.card.id === c.id)) {
            queue.push({ card: c, courseCode: u.course.code, lessonTitle: u.lesson.title, lessonId: u.lesson.id });
          }
        });
      });
    } else {
      const all = window.EpiData.flashcards.slice().sort((a, b) => {
        const ra = profile.flashcards[a.id];
        const rb = profile.flashcards[b.id];
        const sa = ra ? (ra.lastRating === 'forgot' ? 0 : (ra.lastRating === 'partial' ? 1 : 2)) : 3;
        const sb = rb ? (rb.lastRating === 'forgot' ? 0 : (rb.lastRating === 'partial' ? 1 : 2)) : 3;
        return sa - sb;
      }).slice(0, 8);
      all.forEach(c => {
        const pair = findLesson(c.lessonId);
        if (pair) queue.push({ card: c, courseCode: pair.course.code, lessonTitle: pair.lesson.title, lessonId: pair.lesson.id });
      });
    }

    if (queue.length === 0) {
      window.EpiUI.toast('Aucune carte urgente disponible pour le moment.', 'warning');
      return;
    }

    state.route = 'revisions';
    state.runtime.revSession = {
      active: true,
      items: queue,
      idx: 0,
      revealed: false,
      knew: 0,
      partial: 0,
      forgot: 0,
      lessonScores: {}
    };
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startExamSimulation(count) {
    const n = Number(count) || 20;
    const bm = shuffle(window.EpiData.qcms.filter(q => q.sourceType === 'bm_original'));
    const gen = shuffle(window.EpiData.qcms.filter(q => q.sourceType !== 'bm_original'));
    const picked = bm.concat(gen).slice(0, Math.min(n, window.EpiData.qcms.length));
    state.route = 'qcm';
    state.runtime.examSim = {
      active: true,
      questions: picked,
      answers: {},
      submitted: false,
      scorePct: 0,
      correctCount: 0,
      startedAt: Date.now(),
      endedAt: null
    };
    render();
    startExamTimer();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function openNotificationsModal(profile) {
    const rev = window.EpiSRS.getRevisionsSummary(profile);
    const weak = window.EpiSRS.getWeakPoints(profile).filter(w => w.mastery.level === 'red');
    const updatedCount = window.EpiData.courses.reduce((acc, c) =>
      acc + window.EpiUI.asArr(c.lessons).filter(l => window.EpiStorage.isLessonFlaggedUpdated(profile, l)).length, 0);

    const html = `
      <div class="alert alert-info" style="font-size:13.5px;">
        <div><strong>Canal de notification :</strong> rappels internes à l’application uniquement. Aucune notification externe (e-mail, SMS ou push système) n’est envoyée.</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${updatedCount > 0 ? `
          <div class="alert alert-warning" style="margin:0;">
            <div>
              <strong>🔄 ${updatedCount} leçon(s) mise(s) à jour</strong><br>
              L’enseignant a modifié le contenu d’une leçon déjà étudiée (votre progression est conservée).
              <div style="margin-top:8px;"><button class="btn btn-warning btn-sm" data-action="modal-go-revisions">Voir les mises à jour →</button></div>
            </div>
          </div>` : ''}
        ${rev.urgentCount > 0 ? `
          <div class="alert alert-warning" style="margin:0;">
            <div>
              <strong>${rev.urgentCount} révision(s) à effectuer</strong><br>
              ${rev.overdue.length} en retard · ${rev.dueToday.length} due(s) aujourd’hui · ${rev.forgotten.length} oubliée(s).
              <div style="margin-top:8px;"><button class="btn btn-warning btn-sm" data-action="modal-go-revisions">Lancer mes révisions →</button></div>
            </div>
          </div>` : `<div style="font-size:14px;color:var(--text-muted);padding:8px 0;">✅ Aucune révision urgente en retard aujourd’hui.</div>`}
        ${weak.length > 0 ? `
          <div class="alert alert-danger" style="margin:0;">
            <div>
              <strong>${weak.length} point(s) faible(s) en Rouge</strong><br>
              Prioritaire : ${window.EpiUI.esc(weak[0].course.code)} — ${window.EpiUI.esc(weak[0].lesson.title)}
              <div style="margin-top:8px;"><button class="btn btn-danger btn-sm" data-action="modal-go-weak">Voir Mes points faibles →</button></div>
            </div>
          </div>` : ''}
      </div>`;
    window.EpiUI.openModal('Rappels & Notifications internes', html);
  }

  function openProfileModal() {
    const active = window.EpiStorage.getActiveProfile();
    if (window.EpiStorage.isServerMode() && state.user) {
      const html = `
        <div class="alert alert-info" style="font-size:13.5px;">
          <div>
            <strong>Compte connecté :</strong> ${window.EpiUI.esc(state.user.name)} (<code>${window.EpiUI.esc(state.user.email)}</code>)<br>
            <strong>Rôle :</strong> ${state.user.role === 'admin' ? 'Administrateur (CMS activé)' : 'Étudiant'} · Progression synchronisée automatiquement sur le serveur.
          </div>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;padding-top:8px;">
          <button class="btn btn-danger btn-sm" data-action="reset-profile">Réinitialiser ma progression à 0 %</button>
          <button class="btn btn-secondary btn-sm" data-action="auth-logout">${window.EpiIcons.get('logout', 15)} Se déconnecter</button>
        </div>`;
      window.EpiUI.openModal('Mon compte MedStudy', html);
      return;
    }

    const profiles = window.EpiStorage.listProfiles();
    const listHtml = profiles.map(p => `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border:1px solid ${p.id === active.id ? 'var(--primary)' : 'var(--border)'};border-radius:10px;background:${p.id === active.id ? 'var(--primary-soft)' : 'var(--surface)'};margin-bottom:8px;">
        <div>
          <strong style="color:var(--navy);">${window.EpiUI.esc(p.name)}</strong> ${p.id === active.id ? '<span class="badge badge-medium">Actif</span>' : ''}
          <div style="font-size:12px;color:var(--text-light);">${p.xp} XP · Série ${p.streak.count} j</div>
        </div>
        <div style="display:flex;gap:6px;">
          ${p.id !== active.id ? `<button class="btn btn-primary btn-sm" data-action="switch-profile" data-pid="${p.id}">Activer</button>` : ''}
          ${profiles.length > 1 ? `<button class="btn btn-ghost btn-sm" style="color:var(--red);" data-action="delete-profile" data-pid="${p.id}">Suppr.</button>` : ''}
        </div>
      </div>`).join('');

    const html = `
      <div style="margin-bottom:16px;">
        <h4 style="margin:0 0 8px;font-size:14px;color:var(--navy);">Profils étudiants locaux (${profiles.length})</h4>
        ${listHtml}
      </div>
      <div style="border-top:1px solid var(--border);padding-top:14px;margin-bottom:16px;">
        <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;">Créer un nouveau profil étudiant (démarre à 0 %)</label>
        <div style="display:flex;gap:8px;">
          <input type="text" id="new-profile-name" class="input" style="flex:1;" placeholder="Ex. Amine — 6ème Année">
          <button class="btn btn-primary btn-sm" data-action="create-profile">Créer</button>
        </div>
      </div>
      <div style="border-top:1px solid var(--border);padding-top:14px;margin-bottom:16px;">
        <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;">Renommer le profil actif</label>
        <div style="display:flex;gap:8px;">
          <input type="text" id="rename-profile-input" class="input" style="flex:1;" value="${window.EpiUI.esc(active.name)}">
          <button class="btn btn-secondary btn-sm" data-action="rename-profile">Renommer</button>
        </div>
      </div>
      <div style="border-top:1px solid var(--border);padding-top:14px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
        <span style="font-size:12.5px;color:var(--text-light);">Réinitialiser toutes les données du profil actif :</span>
        <button class="btn btn-danger btn-sm" data-action="reset-profile">Réinitialiser à 0 %</button>
      </div>`;
    window.EpiUI.openModal('Gestion des profils étudiants', html);
  }

  function openEditModuleModal(mid) {
    const mod = state.adminData.modules.find(m => m.id === mid);
    if (!mod) return;
    const html = `
      <form data-form="admin-update-module" data-mid="${window.EpiUI.esc(mod.id)}" style="display:flex;flex-direction:column;gap:12px;">
        <div class="form-field">
          <label>Matière / Discipline *</label>
          <input name="subject" type="text" class="input" required value="${window.EpiUI.esc(mod.subject || '')}">
        </div>
        <div class="form-field">
          <label>Titre du module *</label>
          <input name="title" type="text" class="input" required value="${window.EpiUI.esc(mod.title || '')}">
        </div>
        <div class="form-field">
          <label>Code</label>
          <input name="code" type="text" class="input" value="${window.EpiUI.esc(mod.code || '')}">
        </div>
        <div class="form-field">
          <label>Description</label>
          <textarea name="description" rows="2" class="input">${window.EpiUI.esc(mod.description || '')}</textarea>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;">
          <button type="button" class="btn btn-secondary btn-sm" data-action="close-modal">Annuler</button>
          <button type="submit" class="btn btn-primary btn-sm">Enregistrer</button>
        </div>
      </form>`;
    window.EpiUI.openModal('Modifier le module médical', html);
  }

  // ==================== RENDU PRINCIPAL ====================
  function render() {
    const authRoot = document.getElementById('auth-root');
    const appShell = document.getElementById('app-shell');

    if (state.booting) {
      authRoot.innerHTML = '';
      appShell.style.display = 'flex';
      document.getElementById('main-content').innerHTML = `<div class="card empty-state">Initialisation sécurisée de MedStudy…</div>`;
      return;
    }

    if (window.EpiAPI.isHttp && !state.authenticated) {
      appShell.style.display = 'none';
      authRoot.innerHTML = window.EpiViewsAuth.renderAuthScreen(state.authUi);
      return;
    }

    authRoot.innerHTML = '';
    appShell.style.display = 'flex';

    // Protection UI supplémentaire : empêcher tout non-admin d'afficher une route admin
    if (state.route.startsWith('admin_') && !isAdmin()) {
      state.route = 'dashboard';
    }

    const profile = window.EpiStorage.getActiveProfile();
    const rev = window.EpiSRS.getRevisionsSummary(profile);
    const weak = window.EpiSRS.getWeakPoints(profile);
    const lvl = window.EpiGamification.getLevelInfo(profile.xp);
    const updatedCount = window.EpiData.courses.reduce((acc, c) =>
      acc + window.EpiUI.asArr(c.lessons).filter(l => window.EpiStorage.isLessonFlaggedUpdated(profile, l)).length, 0);

    const navItems = [
      { route: 'dashboard', label: 'Tableau de bord', icon: 'home' },
      { route: 'courses', label: 'Mes cours', icon: 'book', badge: `${window.EpiData.courses.length}` },
      { route: 'exam_analysis', label: 'Analyse des examens', icon: 'barChart', badge: '25 c.' },
      { route: 'final_strategy', label: 'Stratégie finale', icon: 'sparkle', badge: 'Survie' },
      { route: 'priorities', label: 'Priorités d’examen', icon: 'target' },
      { route: 'revisions', label: 'Mes révisions', icon: 'repeat', badge: (rev.urgentCount + updatedCount) > 0 ? String(rev.urgentCount + updatedCount) : null, urgent: rev.urgentCount > 0 },
      { route: 'weak', label: 'Mes points faibles', icon: 'alert', badge: weak.length > 0 ? String(weak.length) : null, urgent: weak.some(w => w.mastery.level === 'red') },
      { route: 'qcm', label: 'Banque QCM & Examen', icon: 'clipboard' },
      { route: 'evolution', label: 'Mon évolution', icon: 'trending' }
    ];

    const draftCount = state.adminData.courses.filter(c => c.status === 'draft').length;
    const pptCount = state.adminData.courses.filter(c => c.pptImport && c.pptImport.isPowerPoint).length;
    const invCount = window.EpiUI.asArr(state.adminData.sourceInventory).length;
    const adminNavItems = isAdmin() ? [
      { route: 'admin_courses', label: 'Gestion des cours', icon: 'layers', badge: draftCount > 0 ? `${draftCount} br.` : String(state.adminData.courses.length) },
      { route: 'admin_inventory', label: 'Inventaire sources', icon: 'fileText', badge: invCount > 0 ? String(invCount) : null },
      { route: 'admin_ppt_imports', label: 'Imports PowerPoint', icon: 'fileText', badge: pptCount > 0 ? String(pptCount) : null },
      { route: 'admin_add', label: 'Ajouter un cours', icon: 'plus' },
      { route: 'admin_modules', label: 'Modules médicaux', icon: 'book', badge: String(state.adminData.modules.length) },
      { route: 'admin_security', label: 'Sauvegardes & Sécurité', icon: 'shield' }
    ] : [];

    const isRouteActive = (r) => {
      if (r === 'courses' && (state.route === 'course' || state.route === 'lesson')) return true;
      if (r === 'admin_courses' && state.route === 'admin_editor') return true;
      if (r === 'admin_ppt_imports' && (state.route === 'admin_preview_course' || state.route === 'admin_preview_lesson')) return true;
      return state.route === r;
    };

    const sidebarEl = document.getElementById('sidebar');
    sidebarEl.className = 'sidebar' + (state.sidebarOpen ? ' open' : '');
    sidebarEl.innerHTML = `
      <div class="sidebar-brand">
        <div class="brand-mark">${window.EpiIcons.get('stethoscope', 22)}</div>
        <div class="brand-text">
          <strong>MedStudy</strong>
          <span>${isAdmin() ? 'Plateforme & Admin CMS' : 'Études Médicales'}</span>
        </div>
      </div>
      <nav class="sidebar-nav" aria-label="Navigation principale">
        <div class="nav-section-label">Apprentissage & Stratégie</div>
        ${navItems.slice(0, 5).map(n => `
          <button class="nav-item ${isRouteActive(n.route) ? 'active' : ''}" data-action="nav" data-route="${n.route}">
            ${window.EpiIcons.get(n.icon, 18)}
            <span>${n.label}</span>
            ${n.badge ? `<span class="nav-badge ${n.urgent ? 'urgent' : ''}">${n.badge}</span>` : ''}
          </button>`).join('')}
        <div class="nav-section-label">Mémoire & Suivi</div>
        ${navItems.slice(5).map(n => `
          <button class="nav-item ${isRouteActive(n.route) ? 'active' : ''}" data-action="nav" data-route="${n.route}">
            ${window.EpiIcons.get(n.icon, 18)}
            <span>${n.label}</span>
            ${n.badge ? `<span class="nav-badge ${n.urgent ? 'urgent' : ''}">${n.badge}</span>` : ''}
          </button>`).join('')}
        ${adminNavItems.length > 0 ? `
          <div class="nav-section-label" style="color:#93c5fd;">Administration CMS</div>
          ${adminNavItems.map(n => `
            <button class="nav-item ${isRouteActive(n.route) ? 'active' : ''}" data-action="nav" data-route="${n.route}">
              ${window.EpiIcons.get(n.icon, 18)}
              <span>${n.label}</span>
              ${n.badge ? `<span class="nav-badge">${n.badge}</span>` : ''}
            </button>`).join('')}
        ` : ''}
      </nav>
      <div class="sidebar-footer">
        <button class="profile-chip" data-action="open-profile-modal">
          <div class="avatar-circle">${window.EpiUI.initials(profile.name)}</div>
          <div class="profile-chip-info">
            <strong>${window.EpiUI.esc(profile.name)}</strong>
            <span>${isAdmin() ? 'Admin · ' : ''}Niv. ${lvl.current.level} · ${profile.xp} XP</span>
          </div>
        </button>
        ${window.EpiAPI.isHttp ? `
          <button class="sidebar-logout-btn" data-action="auth-logout">
            ${window.EpiIcons.get('logout', 15)} Déconnexion
          </button>` : ''}
      </div>`;

    document.getElementById('sidebar-overlay').className = 'sidebar-overlay' + (state.sidebarOpen ? ' open' : '');

    // 2. Topbar
    const routeTitles = {
      dashboard: 'Mon tableau de bord',
      courses: 'Catalogue de cours médicaux',
      course: 'Feuille de route du cours',
      lesson: 'Studio d’apprentissage',
      exam_analysis: 'Analyse des examens (Master 01 · 25 cours)',
      final_strategy: 'Stratégie finale & Fiche de survie (Master 04)',
      priorities: 'Priorités d’examen & Audit BM',
      revisions: 'Mes révisions (Répétition espacée)',
      weak: 'Mes points faibles',
      qcm: 'Banque QCM & Simulation d’examen',
      evolution: 'Mon évolution',
      admin_courses: 'Administration — Gestion des cours',
      admin_inventory: 'Administration — Inventaire des sources (51 + Master)',
      admin_ppt_imports: 'Administration — Imports PowerPoint (.ppt / .pptx)',
      admin_add: 'Administration — Ajouter un cours',
      admin_editor: 'Administration — Éditeur & Révision',
      admin_preview_course: 'Prévisualisation Administrateur (Vue Étudiant)',
      admin_preview_lesson: 'Prévisualisation Administrateur — Studio de Leçon',
      admin_modules: 'Administration — Modules médicaux',
      admin_security: 'Administration — Sauvegardes & Sécurité'
    };

    document.getElementById('topbar').innerHTML = `
      <div class="topbar-left">
        <button class="menu-toggle" data-action="toggle-sidebar" aria-label="Menu">${window.EpiIcons.get('menu', 20)}</button>
        <div class="topbar-title">${routeTitles[state.route] || 'MedStudy'}</div>
      </div>
      <div class="topbar-right">
        ${isAdmin() ? `<button class="btn btn-navy btn-sm topbar-add-btn" data-action="admin-go-add" aria-label="Ajouter un cours" title="Ajouter un cours" style="white-space:nowrap;">${window.EpiIcons.get('plus', 15)}<span class="hide-sm"> Ajouter un cours</span></button>` : ''}
        <div class="stat-pill streak" title="Série quotidienne">${window.EpiIcons.get('flame', 15)} <strong>${profile.streak.count} j</strong> <span class="hide-sm">série</span></div>
        <div class="stat-pill xp" title="Points d'expérience">${window.EpiIcons.get('award', 15)} <strong>${profile.xp} XP</strong> <span class="hide-sm">· Niv. ${lvl.current.level}</span></div>
        <button class="icon-btn" data-action="toggle-theme" aria-label="Changer de thème" title="${state.theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}">
          ${window.EpiIcons.get(state.theme === 'dark' ? 'sun' : 'moon', 17)}
        </button>
        <button class="icon-btn" data-action="open-notifications" aria-label="Rappels de révision" title="Rappels internes">
          ${window.EpiIcons.get('bell', 18)}
          ${(rev.urgentCount + updatedCount) > 0 ? '<span class="dot-alert"></span>' : ''}
        </button>
      </div>`;

    // 3. Main view content
    const mainEl = document.getElementById('main-content');
    if (state.route === 'dashboard') {
      mainEl.innerHTML = window.EpiViewsDashboard.renderDashboard(profile);
    } else if (state.route === 'courses') {
      mainEl.innerHTML = window.EpiViewsDashboard.renderCourses(profile, state.courseFilters);
    } else if (state.route === 'course') {
      const revMap = (profile && profile.revisionChecks && typeof profile.revisionChecks === 'object') ? profile.revisionChecks : state.revChecks;
      mainEl.innerHTML = window.EpiViewsLesson.renderCourseOverview(profile, state.courseId, { courseTab: state.courseTab, revChecks: revMap });
    } else if (state.route === 'lesson') {
      mainEl.innerHTML = window.EpiViewsLesson.renderLessonStudio(profile, state.courseId, state.lessonId, state.lessonStep, state.runtime);
    } else if (state.route === 'exam_analysis') {
      mainEl.innerHTML = window.EpiViewsMaster.renderExamAnalysis(profile, state);
    } else if (state.route === 'final_strategy') {
      mainEl.innerHTML = window.EpiViewsMaster.renderFinalStrategy(profile, state);
    } else if (state.route === 'priorities') {
      mainEl.innerHTML = window.EpiViewsDashboard.renderPriorities(profile, state.prioritiesTab);
    } else if (state.route === 'revisions') {
      mainEl.innerHTML = window.EpiViewsTools.renderRevisions(profile, state.runtime);
    } else if (state.route === 'weak') {
      mainEl.innerHTML = window.EpiViewsTools.renderWeakPoints(profile, state.weakFilter);
    } else if (state.route === 'qcm') {
      mainEl.innerHTML = window.EpiViewsTools.renderQcmArena(profile, {
        qcmFilters: state.qcmFilters,
        qcmLimit: state.qcmLimit,
        arenaQcms: state.runtime.arenaQcms,
        examSim: state.runtime.examSim
      });
    } else if (state.route === 'evolution') {
      mainEl.innerHTML = window.EpiViewsTools.renderEvolution(profile);
    } else if (state.route === 'admin_courses') {
      mainEl.innerHTML = window.EpiViewsAdmin.renderCoursesManager(state.adminData, state.adminState);
    } else if (state.route === 'admin_inventory') {
      mainEl.innerHTML = window.EpiViewsAdmin.renderSourceInventory(state.adminData, state.adminState);
    } else if (state.route === 'admin_ppt_imports') {
      mainEl.innerHTML = window.EpiViewsAdmin.renderPptImportsManager(state.adminData, state.adminState);
    } else if (state.route === 'admin_preview_course') {
      mainEl.innerHTML = window.EpiViewsLesson.renderCourseOverview(profile, state.courseId, { catalog: state.adminData, isPreview: true, courseTab: state.courseTab, revChecks: state.revChecks });
    } else if (state.route === 'admin_preview_lesson') {
      mainEl.innerHTML = window.EpiViewsLesson.renderLessonStudio(profile, state.courseId, state.lessonId, state.lessonStep, state.runtime, { catalog: state.adminData, isPreview: true });
    } else if (state.route === 'admin_add') {
      mainEl.innerHTML = window.EpiViewsAdmin.renderAddCourse(state.adminData, state.adminState);
    } else if (state.route === 'admin_editor') {
      mainEl.innerHTML = window.EpiViewsAdmin.renderCourseEditor(state.adminData, state.adminState);
    } else if (state.route === 'admin_modules') {
      mainEl.innerHTML = window.EpiViewsAdmin.renderModulesManager(state.adminData);
    } else if (state.route === 'admin_security') {
      mainEl.innerHTML = window.EpiViewsAdmin.renderSecurityBackups(state.adminData);
    }
  }

  // ==================== GESTIONNAIRE DE FORMULAIRES ====================
  async function handleSubmit(e) {
    const form = e.target.closest('form[data-form]');
    if (!form) return;
    e.preventDefault();
    const kind = form.getAttribute('data-form');
    const fd = new FormData(form);

    try {
      if (kind === 'auth-login') {
        const email = String(fd.get('email') || '').trim();
        const password = String(fd.get('password') || '');
        state.authUi = { mode: 'login', email, error: null, busy: true };
        render();
        const res = await window.EpiAPI.login(email, password);
        state.user = res.user;
        state.authenticated = true;
        state.authUi = { mode: 'login', email: '', error: null, busy: false };
        await refreshAllData();
        state.route = isAdmin() ? 'admin_courses' : 'dashboard';
        window.EpiUI.toast(`Bienvenue, ${state.user.name} !`, 'success');
        render();
        return;
      }

      if (kind === 'auth-register') {
        const name = String(fd.get('name') || '').trim();
        const email = String(fd.get('email') || '').trim();
        const password = String(fd.get('password') || '');
        state.authUi = { mode: 'register', email, error: null, busy: true };
        render();
        const res = await window.EpiAPI.register(name, email, password);
        state.user = res.user;
        state.authenticated = true;
        state.authUi = { mode: 'login', email: '', error: null, busy: false };
        await refreshAllData();
        state.route = 'dashboard';
        window.EpiUI.toast(`Compte étudiant créé ! Bienvenue ${state.user.name}.`, 'success');
        render();
        return;
      }

      if (kind === 'admin-create-course') {
        const moduleId = state.adminState.addWizard.selectedModuleId || String(fd.get('moduleId') || '');
        const semester = String(fd.get('semester') || '').trim();
        const tagsRaw = String(fd.get('tags') || '').trim();
        const payload = {
          moduleId,
          title: String(fd.get('title') || '').trim(),
          code: String(fd.get('code') || '').trim(),
          academicYear: String(fd.get('academicYear') || '').trim(),
          professor: String(fd.get('professor') || '').trim(),
          priority: String(fd.get('priority') || 'medium'),
          summary: String(fd.get('summary') || '').trim(),
          metadata: {
            semester,
            tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : []
          }
        };
        const pendingPrimary = window.EpiUI.asArr(state.adminState.addWizard.pendingFiles);
        const pendingSupport = window.EpiUI.asArr(state.adminState.addWizard.pendingSupportFiles);

        state.adminState.addWizard.uploading = pendingPrimary.length > 0 || pendingSupport.length > 0;
        render();

        const res = await window.EpiAPI.createCourse(payload);
        const cid = res.course.id;
        state.adminState.addWizard.createdCourseId = cid;
        state.adminState.addWizard.showNewModule = false;
        state.adminState.addWizard.pendingFiles = [];
        state.adminState.addWizard.pendingSupportFiles = [];

        let uploadedPrimary = 0;
        for (const f of pendingPrimary) {
          await window.EpiAPI.uploadCourseFile(cid, f, 'primary_source');
          uploadedPrimary++;
        }
        for (const f of pendingSupport) {
          await window.EpiAPI.uploadCourseFile(cid, f, 'support_doc');
        }
        state.adminState.addWizard.uploading = false;
        await refreshCatalogsOnly();
        render();

        if (uploadedPrimary > 0) {
          window.EpiUI.toast('Brouillon créé & fichier téléversé — lancement du Pipeline 11 étapes…', 'success');
          await runUniversalImportPipeline(cid);
        } else {
          window.EpiUI.toast('Brouillon créé ! Téléversez maintenant votre fichier PDF ou PowerPoint.', 'success');
        }
        return;
      }

      if (kind === 'admin-create-module') {
        const payload = {
          subject: String(fd.get('subject') || '').trim(),
          title: String(fd.get('title') || '').trim(),
          code: String(fd.get('code') || '').trim(),
          accent: String(fd.get('accent') || '#1d4ed8'),
          description: String(fd.get('description') || '').trim()
        };
        await window.EpiAPI.createModule(payload);
        await refreshCatalogsOnly();
        window.EpiUI.toast(`Module médical « ${payload.title} » (${payload.subject}) créé !`, 'success');
        render();
        return;
      }

      if (kind === 'admin-update-module') {
        const mid = form.getAttribute('data-mid');
        const payload = {
          subject: String(fd.get('subject') || '').trim(),
          title: String(fd.get('title') || '').trim(),
          code: String(fd.get('code') || '').trim(),
          description: String(fd.get('description') || '').trim()
        };
        await window.EpiAPI.updateModule(mid, payload);
        window.EpiUI.closeModal();
        await refreshCatalogsOnly();
        window.EpiUI.toast('Module médical mis à jour.', 'success');
        render();
        return;
      }

      if (kind === 'admin-change-password') {
        await window.EpiAPI.changeAdminPassword(String(fd.get('currentPassword') || ''), String(fd.get('newPassword') || ''));
        form.reset();
        window.EpiUI.toast('Mot de passe administrateur mis à jour avec succès.', 'success');
        return;
      }

      if (kind === 'admin-ai-config') {
        await window.EpiAPI.saveAiConfig(String(fd.get('provider') || 'local'), String(fd.get('apiKey') || ''), false);
        await refreshCatalogsOnly();
        window.EpiUI.toast('Configuration IA serveur enregistrée de manière sécurisée.', 'success');
        render();
        return;
      }
    } catch (err) {
      if (kind === 'auth-login' || kind === 'auth-register') {
        state.authUi.busy = false;
        state.authUi.error = err.message;
        render();
      } else {
        window.EpiUI.toast(err.message || 'Une erreur est survenue.', 'warning');
      }
    }
  }

  // ==================== GESTIONNAIRE DE CLICS ====================
  async function handleClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-action');

    // Actions Auth (accessibles avant connexion)
    if (action === 'auth-switch-mode') {
      state.authUi = { mode: btn.getAttribute('data-mode') || 'login', email: state.authUi.email || '', error: null, busy: false };
      render();
      return;
    }

    if (action === 'auth-logout') {
      window.EpiUI.closeModal();
      stopExamTimer();
      try {
        await window.EpiStorage.syncNow();
        await window.EpiAPI.logout();
      } catch (err) {}
      window.EpiStorage.clearServerSession();
      state.authenticated = false;
      state.user = null;
      state.route = 'dashboard';
      state.adminState.editor = null;
      state.runtime = {
        activeSubStepId: null,
        courseLessonsNavOpen: false,
        phaseStepsCollapsed: false,
        activeRecall: {},
        flashcard: { cardId: null, revealed: false, draft: '' },
        lessonQcms: {},
        arenaQcms: {},
        miniTest: { answers: {}, submitted: false, scorePct: 0, correctCount: 0, newlyMastered: false },
        revSession: null,
        examSim: null
      };
      render();
      return;
    }

    const profile = window.EpiStorage.getActiveProfile();

    try {
      switch (action) {
        case 'toggle-theme':
          state.theme = window.EpiStorage.setTheme(state.theme === 'dark' ? 'light' : 'dark');
          if (profile) {
            profile.theme = state.theme;
            window.EpiStorage.syncNow();
          }
          render();
          break;

        case 'toggle-sidebar':
          state.sidebarOpen = !state.sidebarOpen;
          render();
          break;

        case 'nav': {
          const targetRoute = btn.getAttribute('data-route');
          if (targetRoute.startsWith('admin_') && !isAdmin()) {
            window.EpiUI.toast('Accès réservé aux administrateurs.', 'warning');
            return;
          }
          stopExamTimer();
          state.route = targetRoute;
          state.sidebarOpen = false;
          if (targetRoute !== 'revisions') state.runtime.revSession = null;
          if (targetRoute === 'admin_add') {
            state.adminState.addWizard = {
              createdCourseId: null,
              showNewModule: false,
              selectedModuleId: (state.adminData.modules[0] && state.adminData.modules[0].id) || '',
              analyzing: false,
              uploading: false,
              pendingFiles: [],
              pendingSupportFiles: [],
              activeJob: null
            };
          }
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        }

        // ---- ADMIN CMS ACTIONS ----
        case 'admin-go-add':
          if (!isAdmin()) return;
          state.adminState.addWizard = {
            createdCourseId: null,
            showNewModule: false,
            selectedModuleId: (state.adminData.modules[0] && state.adminData.modules[0].id) || '',
            analyzing: false,
            uploading: false,
            pendingFiles: [],
            pendingSupportFiles: [],
            activeJob: null
          };
          state.route = 'admin_add';
          state.sidebarOpen = false;
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;

        case 'admin-filter-status':
          state.adminState.filters.status = btn.getAttribute('data-status') || 'all';
          render();
          break;

        case 'admin-toggle-inline-module':
          state.adminState.addWizard.showNewModule = !state.adminState.addWizard.showNewModule;
          render();
          break;

        case 'admin-pick-subject': {
          const targetId = btn.getAttribute('data-target');
          const inp = document.getElementById(targetId);
          if (inp) { inp.value = btn.getAttribute('data-val') || ''; inp.focus(); }
          break;
        }

        case 'admin-create-inline-module': {
          const subject = (document.getElementById('inline-mod-subject')?.value || '').trim();
          const title = (document.getElementById('inline-mod-title')?.value || '').trim();
          const code = (document.getElementById('inline-mod-code')?.value || '').trim();
          const accent = document.getElementById('inline-mod-accent')?.value || '#1d4ed8';
          const description = (document.getElementById('inline-mod-desc')?.value || '').trim();
          if (!subject || title.length < 2) {
            window.EpiUI.toast('Indiquez la matière et un titre de module (≥ 2 caractères).', 'warning');
            return;
          }
          const res = await window.EpiAPI.createModule({ subject, title, code, accent, description });
          await refreshCatalogsOnly();
          state.adminState.addWizard.selectedModuleId = res.module.id;
          state.adminState.addWizard.showNewModule = false;
          window.EpiUI.toast(`Module « ${res.module.title} » créé et sélectionné.`, 'success');
          render();
          break;
        }

        case 'admin-open-editor':
          openCourseInEditor(btn.getAttribute('data-cid'), btn.getAttribute('data-tab') || 'lessons');
          break;

        case 'admin-preview-course': {
          if (!isAdmin()) return;
          const cid = btn.getAttribute('data-cid');
          if (state.route === 'admin_courses' || state.route === 'admin_ppt_imports' || state.route === 'admin_editor') {
            state.adminState.previewReturnRoute = state.route;
          }
          state.courseId = cid;
          state.route = 'admin_preview_course';
          state.sidebarOpen = false;
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        }

        case 'admin-preview-lesson': {
          if (!isAdmin()) return;
          const cid = btn.getAttribute('data-course');
          const lid = btn.getAttribute('data-lesson');
          const reqStep = btn.getAttribute('data-step') || 'A';
          const reqSub = btn.getAttribute('data-substep') || null;
          state.courseId = cid;
          state.lessonId = lid;
          state.lessonStep = reqStep;
          state.route = 'admin_preview_lesson';
          state.runtime.courseLessonsNavOpen = false;
          state.runtime.phaseStepsCollapsed = false;
          state.runtime.activeRecall = {};
          state.runtime.activeSubStepId = reqSub;
          state.runtime.flashcard = { cardId: null, revealed: false, draft: '' };
          state.runtime.lessonQcms = {};
          state.runtime.miniTest = { answers: {}, submitted: false, scorePct: 0, correctCount: 0, newlyMastered: false };
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        }

        case 'admin-exit-preview':
          state.route = state.adminState.previewReturnRoute || 'admin_ppt_imports';
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;

        case 'admin-scan-workspace-ppts': {
          if (!isAdmin()) return;
          state.adminState.scanningPpts = true;
          render();
          try {
            const res = await window.EpiAPI.importWorkspacePpts();
            await refreshCatalogsOnly();
            state.adminState.scanningPpts = false;
            window.EpiUI.toast(
              res.importedCount > 0
                ? `${res.importedCount} nouvelle(s) présentation(s) PowerPoint importée(s) en brouillon (${res.skippedCount} déjà présente(s)).`
                : `Scan terminé : ${res.totalFound} fichier(s) PowerPoint déjà importé(s), aucun doublon créé.`,
              'success'
            );
            render();
          } catch (err) {
            state.adminState.scanningPpts = false;
            window.EpiUI.toast(err.message || 'Erreur lors du scan PowerPoint.', 'warning');
            render();
          }
          break;
        }

        case 'admin-resolve-overlap': {
          if (!isAdmin()) return;
          const cid = btn.getAttribute('data-cid');
          const decision = btn.getAttribute('data-decision');
          const targetId = btn.getAttribute('data-target') || '';
          const msg = decision === 'merge'
            ? 'Fusionner les leçons, flashcards et QCM de ce PowerPoint dans le cours existant ?\n\nAucune leçon existante ni aucune progression étudiante ne sera écrasée (une sauvegarde automatique est créée avant).'
            : 'Confirmer que vous souhaitez conserver cette présentation PowerPoint comme cours séparé (indépendant du cours existant) ?';
          if (!window.confirm(msg)) return;
          await window.EpiAPI.resolveOverlap(cid, decision, targetId);
          await refreshCatalogsOnly();
          if (state.adminState.editor && state.adminState.editor.course.id === cid) {
            openCourseInEditor(cid, state.adminState.editor.tab);
          } else {
            render();
          }
          window.EpiUI.toast(
            decision === 'merge'
              ? '🔀 Contenu PowerPoint fusionné sans perte de progression étudiante !'
              : '📌 Cours PowerPoint marqué comme séparé (prêt pour relecture et publication).',
            'success'
          );
          break;
        }

        case 'admin-exit-editor':
          if (state.adminState.editor && state.adminState.editor.dirty) {
            if (!window.confirm('Vous avez des modifications non enregistrées. Quitter l’éditeur sans enregistrer ?')) return;
          }
          state.adminState.editor = null;
          state.route = 'admin_courses';
          render();
          break;

        case 'admin-editor-tab':
          if (state.adminState.editor) {
            state.adminState.editor.tab = btn.getAttribute('data-tab') || 'lessons';
            render();
          }
          break;

        case 'admin-start-pipeline':
        case 'admin-analyze-course': {
          const cid = btn.getAttribute('data-cid');
          const existing = state.adminData.courses.find(c => c.id === cid);
          if (existing && window.EpiUI.asArr(existing.lessons).length > 0) {
            if (!window.confirm('Relancer le pipeline universel en 11 étapes remplacera les brouillons actuels de leçons, flashcards, QCM et mini-tests de ce cours (une sauvegarde automatique est créée avant). Continuer ?')) return;
          }
          await runUniversalImportPipeline(cid);
          break;
        }

        case 'admin-retry-job-stage': {
          const jid = btn.getAttribute('data-jid');
          const st = Number(btn.getAttribute('data-stage')) || 1;
          const jobRef = (state.adminState.addWizard && state.adminState.addWizard.activeJob && state.adminState.addWizard.activeJob.id === jid && state.adminState.addWizard.activeJob)
            || (state.adminState.editor && state.adminState.editor.activeJob && state.adminState.editor.activeJob.id === jid && state.adminState.editor.activeJob)
            || state.adminData.importJobs.find(j => j.id === jid);
          if (!jobRef) return;
          await runUniversalImportPipeline(jobRef.courseId, jid, st);
          break;
        }

        case 'admin-regenerate-lesson': {
          const cid = btn.getAttribute('data-cid');
          const lid = btn.getAttribute('data-lid');
          if (!window.confirm('Régénérer uniquement cette section/leçon (Comprendre, À mémoriser, Rappel actif, Flashcards, QCM & Mini-test) ? Les autres leçons restent intactes.')) return;
          if (state.adminState.editor) { state.adminState.editor.regenerating = true; render(); }
          try {
            await window.EpiAPI.regenerateLesson(cid, lid);
            await refreshCatalogsOnly();
            const activeTab = (state.adminState.editor && state.adminState.editor.tab) || 'lessons';
            const prevIdx = (state.adminState.editor && state.adminState.editor.activeLessonIdx) || 0;
            openCourseInEditor(cid, activeTab);
            if (state.adminState.editor) {
              state.adminState.editor.activeLessonIdx = Math.min(prevIdx, Math.max(0, state.adminState.editor.course.lessons.length - 1));
              render();
            }
            window.EpiUI.toast('Section régénérée et contrôle qualité mis à jour.', 'success');
          } catch (err) {
            if (state.adminState.editor) state.adminState.editor.regenerating = false;
            window.EpiUI.toast(err.message || 'Échec de la régénération.', 'warning');
            render();
          }
          break;
        }

        case 'admin-run-quality-check': {
          const ed = state.adminState.editor;
          const cid = btn.getAttribute('data-cid') || (ed && ed.course && ed.course.id);
          if (!cid) return;
          const res = await window.EpiAPI.runQualityCheck(cid, ed ? { course: ed.course, flashcards: ed.flashcards, qcms: ed.qcms } : {});
          if (ed) {
            ed.qualityReport = res.qualityReport;
            ed.tab = 'quality';
          }
          window.EpiUI.toast(`Audit qualité terminé : ${res.qualityReport.score}/100 (${res.qualityReport.blockingCount} blocage(s), ${res.qualityReport.warningCount} alerte(s)).`, res.qualityReport.blockingCount > 0 ? 'warning' : 'success');
          render();
          break;
        }

        case 'admin-approve-publish': {
          const ed = state.adminState.editor;
          const cid = btn.getAttribute('data-cid') || (ed && ed.course && ed.course.id);
          if (!cid) return;
          if (ed && ed.course.lessons.length === 0) {
            window.EpiUI.toast('Ajoutez au moins une leçon avant de publier ce cours.', 'warning');
            return;
          }
          if (ed) { ed.saving = true; render(); }
          try {
            if (ed) {
              const draftPayload = JSON.parse(JSON.stringify(ed.course));
              draftPayload.status = 'draft';
              await window.EpiAPI.updateCourse(cid, {
                course: draftPayload,
                flashcards: ed.flashcards,
                qcms: ed.qcms,
                majorLessonIds: ed.majorLessonIds || [],
                publish: false
              });
            }
            const appRes = await window.EpiAPI.approveCourse(cid, true, false);
            await refreshCatalogsOnly();
            openCourseInEditor(cid, 'lessons');
            window.EpiUI.toast(`🚀 Cours approuvé (Qualité ${appRes.qualityReport ? appRes.qualityReport.score + '/100' : 'OK'}) et publié pour les étudiants !`, 'success');
          } catch (err) {
            if (ed) {
              ed.saving = false;
              if (err.data && err.data.qualityReport) {
                ed.qualityReport = err.data.qualityReport;
                ed.tab = 'quality';
              }
            }
            window.EpiUI.toast(err.message || 'Publication bloquée par le contrôle qualité.', 'warning');
            render();
          }
          break;
        }

        case 'admin-delete-file': {
          const cid = btn.getAttribute('data-cid');
          const fid = btn.getAttribute('data-fid');
          if (!window.confirm('Supprimer ce fichier du serveur ?')) return;
          await window.EpiAPI.deleteCourseFile(cid, fid);
          await refreshCatalogsOnly();
          if (state.adminState.editor && state.adminState.editor.course.id === cid) {
            const fresh = state.adminData.courses.find(c => c.id === cid);
            if (fresh) state.adminState.editor.course.attachments = window.EpiUI.asArr(fresh.attachments);
          }
          window.EpiUI.toast('Fichier supprimé.', 'success');
          render();
          break;
        }

        case 'admin-editor-save': {
          const ed = state.adminState.editor;
          if (!ed) return;
          const mode = btn.getAttribute('data-mode'); // 'draft' | 'publish'
          if (mode === 'publish' && ed.course.lessons.length === 0) {
            window.EpiUI.toast('Ajoutez au moins une leçon avant de publier ce cours.', 'warning');
            return;
          }
          ed.saving = true;
          render();
          try {
            const coursePayload = JSON.parse(JSON.stringify(ed.course));
            coursePayload.status = mode === 'publish' ? 'published' : 'draft';
            await window.EpiAPI.updateCourse(coursePayload.id, {
              course: coursePayload,
              flashcards: ed.flashcards,
              qcms: ed.qcms,
              majorLessonIds: ed.majorLessonIds || [],
              publish: mode === 'publish'
            });
            await refreshCatalogsOnly();
            openCourseInEditor(coursePayload.id, ed.tab);
            window.EpiUI.toast(
              mode === 'publish'
                ? '🚀 Cours publié et immédiatement accessible aux étudiants !'
                : '💾 Cours enregistré comme brouillon (non visible aux étudiants).',
              'success'
            );
          } catch (err) {
            ed.saving = false;
            window.EpiUI.toast(err.message || 'Erreur lors de la sauvegarde.', 'warning');
            render();
          }
          break;
        }

        case 'admin-set-status': {
          const cid = btn.getAttribute('data-cid');
          const newStatus = btn.getAttribute('data-status');
          const msg = newStatus === 'published'
            ? 'Publier ce cours ? Il apparaîtra immédiatement dans l’interface étudiant.'
            : (newStatus === 'draft'
              ? 'Dépublier ce cours ? Il sera retiré de la navigation étudiant SANS supprimer leur progression.'
              : 'Archiver ce cours ? Il ne sera plus visible aux étudiants mais leur progression reste préservée.');
          if (!window.confirm(msg)) return;
          await window.EpiAPI.setCourseStatus(cid, newStatus);
          await refreshCatalogsOnly();
          window.EpiUI.toast(
            newStatus === 'published' ? 'Cours publié !' : (newStatus === 'draft' ? 'Cours dépublié (brouillon).' : 'Cours archivé.'),
            'success'
          );
          render();
          break;
        }

        case 'admin-duplicate-course': {
          const cid = btn.getAttribute('data-cid');
          const res = await window.EpiAPI.duplicateCourse(cid);
          await refreshCatalogsOnly();
          window.EpiUI.toast(`Copie brouillon créée : « ${res.course.title} ».`, 'success');
          render();
          break;
        }

        case 'admin-delete-course': {
          const cid = btn.getAttribute('data-cid');
          const target = state.adminData.courses.find(c => c.id === cid);
          if (!window.confirm(`Supprimer définitivement le cours « ${target ? target.title : cid} » ?\n\nUne sauvegarde serveur automatique sera créée avant la suppression.`)) return;
          const res = await window.EpiAPI.deleteCourse(cid);
          await refreshCatalogsOnly();
          window.EpiUI.toast(`Cours supprimé (sauvegarde créée : ${res.backup || 'OK'}).`, 'warning');
          render();
          break;
        }

        // ---- EDITOR SUB-ACTIONS (LESSONS / MEM / FC / QCM) ----
        case 'admin-ed-select-lesson':
          if (state.adminState.editor) {
            state.adminState.editor.activeLessonIdx = Number(btn.getAttribute('data-idx')) || 0;
            render();
          }
          break;

        case 'admin-ed-add-lesson': {
          const ed = state.adminState.editor;
          if (!ed) return;
          const n = ed.course.lessons.length + 1;
          const lid = `${ed.course.id}_L${Date.now().toString(36).slice(-4)}_${n}`;
          ed.course.lessons.push({
            id: lid,
            courseId: ed.course.id,
            order: n,
            title: `Nouveau chapitre ${n}`,
            durationMin: 10,
            sourceRef: 'Ajout manuel',
            pageRefs: [],
            bmCount: 0,
            bmRefs: [],
            priority: ed.course.priority || 'medium',
            priorityScore: 50,
            bmWarning: '',
            revisionVersion: 1,
            majorUpdateNote: '',
            needsReview: false,
            understand: {
              intro: '',
              sections: [{ heading: `Chapitre ${n}`, paragraphs: [], bullets: [] }],
              tables: [],
              darija: '',
              triad: { toUnderstand: [], toMemorize: [], toRecognizeInQcm: [] }
            },
            memorize: []
          });
          ed.activeLessonIdx = ed.course.lessons.length - 1;
          ed.dirty = true;
          render();
          break;
        }

        case 'admin-ed-move-lesson': {
          const ed = state.adminState.editor;
          if (!ed) return;
          const idx = Number(btn.getAttribute('data-idx'));
          const dir = Number(btn.getAttribute('data-dir'));
          const target = idx + dir;
          if (target < 0 || target >= ed.course.lessons.length) return;
          const tmp = ed.course.lessons[idx];
          ed.course.lessons[idx] = ed.course.lessons[target];
          ed.course.lessons[target] = tmp;
          ed.activeLessonIdx = target;
          ed.dirty = true;
          render();
          break;
        }

        case 'admin-ed-delete-lesson': {
          const ed = state.adminState.editor;
          if (!ed) return;
          const idx = Number(btn.getAttribute('data-idx'));
          if (!window.confirm('Supprimer cette leçon du cours ?')) return;
          const removed = ed.course.lessons.splice(idx, 1)[0];
          if (removed) {
            ed.flashcards = ed.flashcards.filter(f => f.lessonId !== removed.id);
            ed.qcms = ed.qcms.filter(q => q.lessonId !== removed.id);
          }
          ed.activeLessonIdx = Math.max(0, Math.min(ed.activeLessonIdx, ed.course.lessons.length - 1));
          ed.dirty = true;
          render();
          break;
        }

        case 'admin-ed-toggle-major': {
          const ed = state.adminState.editor;
          if (!ed) return;
          const lid = btn.getAttribute('data-lid');
          const i = ed.majorLessonIds.indexOf(lid);
          if (i >= 0) ed.majorLessonIds.splice(i, 1);
          else ed.majorLessonIds.push(lid);
          ed.dirty = true;
          render();
          break;
        }

        case 'admin-ed-add-mem': {
          const ed = state.adminState.editor;
          const lidx = Number(btn.getAttribute('data-lidx'));
          const lesson = ed && ed.course.lessons[lidx];
          if (!lesson) return;
          if (!Array.isArray(lesson.memorize)) lesson.memorize = [];
          lesson.memorize.push({
            id: `M_${lesson.id}_${Date.now().toString(36).slice(-4)}`,
            category: 'Définition',
            title: 'Nouvelle notion clé',
            content: '',
            pageRef: '',
            highlight: true
          });
          ed.dirty = true;
          render();
          break;
        }

        case 'admin-ed-del-mem': {
          const ed = state.adminState.editor;
          const lidx = Number(btn.getAttribute('data-lidx'));
          const midx = Number(btn.getAttribute('data-midx'));
          const lesson = ed && ed.course.lessons[lidx];
          if (!lesson || !Array.isArray(lesson.memorize)) return;
          lesson.memorize.splice(midx, 1);
          ed.dirty = true;
          render();
          break;
        }

        case 'admin-ed-add-section': {
          const ed = state.adminState.editor;
          const lidx = Number(btn.getAttribute('data-lidx'));
          const lesson = ed && ed.course.lessons[lidx];
          if (!lesson) return;
          if (!lesson.understand) lesson.understand = { intro: '', sections: [], tables: [], darija: '', triad: { toUnderstand: [], toMemorize: [], toRecognizeInQcm: [] } };
          if (!Array.isArray(lesson.understand.sections)) lesson.understand.sections = [];
          lesson.understand.sections.push({
            heading: `Nouvelle sous-section ${lesson.understand.sections.length + 1}`,
            pageRef: lesson.slideRange || '',
            provenance: 'source_explicit',
            paragraphs: [],
            bullets: []
          });
          ed.dirty = true;
          render();
          break;
        }

        case 'admin-ed-del-section': {
          const ed = state.adminState.editor;
          const lidx = Number(btn.getAttribute('data-lidx'));
          const sidx = Number(btn.getAttribute('data-sidx'));
          const lesson = ed && ed.course.lessons[lidx];
          if (!lesson || !lesson.understand || !Array.isArray(lesson.understand.sections)) return;
          if (lesson.understand.sections.length <= 1) return;
          lesson.understand.sections.splice(sidx, 1);
          ed.dirty = true;
          render();
          break;
        }

        case 'admin-ed-del-table': {
          const ed = state.adminState.editor;
          const lidx = Number(btn.getAttribute('data-lidx'));
          const tidx = Number(btn.getAttribute('data-tidx'));
          const lesson = ed && ed.course.lessons[lidx];
          if (!lesson || !lesson.understand || !Array.isArray(lesson.understand.tables)) return;
          lesson.understand.tables.splice(tidx, 1);
          ed.dirty = true;
          render();
          break;
        }

        case 'admin-ed-add-recall': {
          const ed = state.adminState.editor;
          const lidx = Number(btn.getAttribute('data-lidx'));
          const lesson = ed && ed.course.lessons[lidx];
          if (!lesson) return;
          if (!Array.isArray(lesson.activeRecall)) lesson.activeRecall = [];
          lesson.activeRecall.push({
            id: `AR_${lesson.id}_${Date.now().toString(36).slice(-4)}`,
            prompt: '',
            expectedAnswer: '',
            pageRef: lesson.slideRange || '',
            sourceFile: lesson.sourceFile || '',
            provenance: 'ai_reformulated'
          });
          ed.dirty = true;
          render();
          break;
        }

        case 'admin-ed-del-recall': {
          const ed = state.adminState.editor;
          const lidx = Number(btn.getAttribute('data-lidx'));
          const ridx = Number(btn.getAttribute('data-ridx'));
          const lesson = ed && ed.course.lessons[lidx];
          if (!lesson || !Array.isArray(lesson.activeRecall)) return;
          lesson.activeRecall.splice(ridx, 1);
          ed.dirty = true;
          render();
          break;
        }

        case 'admin-ed-add-fc': {
          const ed = state.adminState.editor;
          if (!ed || !ed.course.lessons.length) return;
          const defaultLid = (ed.fcLessonFilter && ed.fcLessonFilter !== 'all') ? ed.fcLessonFilter : ed.course.lessons[0].id;
          ed.flashcards.unshift({
            id: `FC_${ed.course.id}_${Date.now().toString(36).slice(-5)}`,
            courseId: ed.course.id,
            lessonId: defaultLid,
            type: 'definition',
            question: '',
            answer: '',
            hint: '',
            pageRef: '',
            sourceType: 'manual',
            needsReview: false
          });
          ed.dirty = true;
          render();
          break;
        }

        case 'admin-ed-approve-fc': {
          const ed = state.adminState.editor;
          const fidx = Number(btn.getAttribute('data-fidx'));
          if (ed && ed.flashcards[fidx]) {
            ed.flashcards[fidx].needsReview = false;
            ed.dirty = true;
            render();
          }
          break;
        }

        case 'admin-ed-approve-all-fc': {
          const ed = state.adminState.editor;
          if (ed) {
            ed.flashcards.forEach(f => { f.needsReview = false; });
            ed.dirty = true;
            window.EpiUI.toast('Toutes les flashcards marquées comme validées.', 'success');
            render();
          }
          break;
        }

        case 'admin-ed-del-fc': {
          const ed = state.adminState.editor;
          const fidx = Number(btn.getAttribute('data-fidx'));
          if (ed) {
            ed.flashcards.splice(fidx, 1);
            ed.dirty = true;
            render();
          }
          break;
        }

        case 'admin-ed-add-qcm': {
          const ed = state.adminState.editor;
          if (!ed || !ed.course.lessons.length) return;
          const defaultLid = (ed.qcmLessonFilter && ed.qcmLessonFilter !== 'all') ? ed.qcmLessonFilter : ed.course.lessons[0].id;
          ed.qcms.unshift({
            id: `Q_${ed.course.id}_${Date.now().toString(36).slice(-5)}`,
            courseId: ed.course.id,
            lessonId: defaultLid,
            topic: ed.course.shortTitle || ed.course.title,
            sourceType: 'course_generated',
            bmRef: '',
            year: 'Cours',
            pageRef: '',
            multiSelect: false,
            isHard: false,
            needsReview: false,
            stem: '',
            options: [
              { key: 'A', text: '' },
              { key: 'B', text: '' },
              { key: 'C', text: '' },
              { key: 'D', text: '' }
            ],
            correct: ['A'],
            explanation: '',
            wrongReasons: {},
            courseRef: ed.course.title
          });
          ed.dirty = true;
          render();
          break;
        }

        case 'admin-ed-approve-qcm': {
          const ed = state.adminState.editor;
          const qidx = Number(btn.getAttribute('data-qidx'));
          if (ed && ed.qcms[qidx]) {
            ed.qcms[qidx].needsReview = false;
            if (ed.qcms[qidx].sourceType === 'ai_draft') ed.qcms[qidx].sourceType = 'course_generated';
            ed.dirty = true;
            render();
          }
          break;
        }

        case 'admin-ed-approve-all-qcm': {
          const ed = state.adminState.editor;
          if (ed) {
            ed.qcms.forEach(q => {
              q.needsReview = false;
              if (q.sourceType === 'ai_draft') q.sourceType = 'course_generated';
            });
            ed.dirty = true;
            window.EpiUI.toast('Tous les QCM marqués comme validés.', 'success');
            render();
          }
          break;
        }

        case 'admin-ed-del-qcm': {
          const ed = state.adminState.editor;
          const qidx = Number(btn.getAttribute('data-qidx'));
          if (ed) {
            ed.qcms.splice(qidx, 1);
            ed.dirty = true;
            render();
          }
          break;
        }

        // ---- MODULES & BACKUPS ----
        case 'admin-edit-module-modal':
          openEditModuleModal(btn.getAttribute('data-mid'));
          break;

        case 'admin-delete-module': {
          const mid = btn.getAttribute('data-mid');
          if (!window.confirm('Supprimer ce module médical ?')) return;
          await window.EpiAPI.deleteModule(mid);
          await refreshCatalogsOnly();
          window.EpiUI.toast('Module médical supprimé.', 'warning');
          render();
          break;
        }

        case 'admin-create-backup': {
          const res = await window.EpiAPI.createBackup();
          await refreshCatalogsOnly();
          window.EpiUI.toast(`Sauvegarde créée : ${res.filename}`, 'success');
          render();
          break;
        }

        case 'admin-restore-backup': {
          const file = btn.getAttribute('data-file');
          if (!window.confirm(`Restaurer la base de données depuis « ${file} » ?\n\nUne sauvegarde de l’état actuel sera créée automatiquement avant restauration.`)) return;
          await window.EpiAPI.restoreBackup(file);
          await refreshAllData();
          state.adminState.editor = null;
          window.EpiUI.toast('Base de données restaurée avec succès.', 'success');
          render();
          break;
        }

        case 'admin-clear-ai-key':
          if (!window.confirm('Effacer la clé API IA enregistrée sur le serveur ?')) return;
          await window.EpiAPI.saveAiConfig('local', '', true);
          await refreshCatalogsOnly();
          window.EpiUI.toast('Clé API effacée — retour au mode local.', 'success');
          render();
          break;

        // ---- ÉTUDIANT : RECONNAISSANCE MAJ MAJEURE ----
        case 'ack-lesson-update': {
          const lid = btn.getAttribute('data-lesson');
          const pair = findLesson(lid);
          if (pair) {
            window.EpiStorage.acknowledgeLessonUpdate(profile, pair.lesson);
            window.EpiUI.toast('Mise à jour prise en compte — votre progression reste intacte.', 'success');
            render();
          }
          break;
        }

        // ---- ACTIONS ÉTUDIANTES EXISTANTES & PARCOURS UNIFIÉ ----
        case 'hero-go': {
          const r = btn.getAttribute('data-route');
          if (btn.getAttribute('data-start-session') === '1') {
            startRevisionSession('urgent');
          } else if (btn.getAttribute('data-start-exam')) {
            startExamSimulation(btn.getAttribute('data-start-exam'));
          } else if (r === 'lesson') {
            openLesson(
              btn.getAttribute('data-course'),
              btn.getAttribute('data-lesson'),
              btn.getAttribute('data-step') || null,
              btn.getAttribute('data-substep') || null
            );
          } else {
            state.route = r || 'courses';
            render();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          break;
        }

        case 'go-course':
          state.route = 'course';
          state.courseId = btn.getAttribute('data-course');
          state.courseTab = 'roadmap';
          state.sidebarOpen = false;
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;

        case 'go-course-revision':
          state.route = 'course';
          state.courseId = btn.getAttribute('data-course');
          state.courseTab = 'revision';
          state.sidebarOpen = false;
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;

        case 'course-tab':
          state.courseTab = btn.getAttribute('data-tab') || 'roadmap';
          render();
          break;

        case 'toggle-rev-check': {
          const k = btn.getAttribute('data-key');
          if (k) {
            if (state.route === 'admin_preview_course') {
              state.revChecks[k] = !state.revChecks[k];
            } else {
              const p = window.EpiStorage.getActiveProfile();
              if (p) {
                if (!p.revisionChecks || typeof p.revisionChecks !== 'object') p.revisionChecks = {};
                p.revisionChecks[k] = !p.revisionChecks[k];
                window.EpiStorage.save();
              } else {
                state.revChecks[k] = !state.revChecks[k];
              }
            }
            render();
          }
          break;
        }

        case 'analysis-tab':
          state.analysisTab = btn.getAttribute('data-tab') || 'frequencies';
          render();
          break;

        case 'analysis-score-filter':
          state.analysisScoreFilter = btn.getAttribute('data-level') || 'all';
          render();
          break;

        case 'strategy-tab':
          state.strategyTab = btn.getAttribute('data-tab') || 'waves';
          render();
          break;

        case 'qcm-filter-course':
          state.qcmFilters.courseId = btn.getAttribute('data-course') || 'all';
          state.qcmLimit = 15;
          state.route = 'qcm';
          state.sidebarOpen = false;
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;

        case 'admin-inv-filter-status':
          state.adminState.invFilters.status = btn.getAttribute('data-status') || 'all';
          render();
          break;

        case 'go-lesson':
          openLesson(
            btn.getAttribute('data-course'),
            btn.getAttribute('data-lesson'),
            btn.getAttribute('data-step') || null,
            btn.getAttribute('data-substep') || null
          );
          break;

        case 'toggle-course-lessons-nav':
          state.runtime.courseLessonsNavOpen = !state.runtime.courseLessonsNavOpen;
          render();
          break;

        case 'toggle-phase-steps-list':
          state.runtime.phaseStepsCollapsed = !state.runtime.phaseStepsCollapsed;
          render();
          break;

        case 'lesson-step': {
          const nextPhaseKey = btn.getAttribute('data-step') || 'A';
          const cat = getActiveCatalog();
          const pair = findLesson(state.lessonId, cat);
          state.lessonStep = nextPhaseKey;
          state.runtime.phaseStepsCollapsed = false;
          state.runtime.flashcard = { cardId: null, revealed: false, draft: '' };

          if (pair) {
            const lj = window.EpiJourney.getLessonJourney(profile, pair.course, pair.lesson, {
              catalog: cat,
              runtime: state.runtime,
              activePhaseKey: nextPhaseKey
            });
            const phase = lj.phases.find(p => p.key === nextPhaseKey);
            const lRec = profile.lessons[pair.lesson.id];
            const savedId = lRec && lRec.lastActiveStepByPhase && lRec.lastActiveStepByPhase[nextPhaseKey];
            const pick = phase && phase.steps.length
              ? (phase.steps.find(s => s.id === savedId) || phase.nextStep || phase.steps[0])
              : null;
            state.runtime.activeSubStepId = pick ? pick.id : null;
          }
          // RÈGLE STRICTE : cliquer sur un bouton de navigation NE valide aucune phase ni étape !
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        }

        case 'lesson-select-substep': {
          const phaseKey = btn.getAttribute('data-phase') || state.lessonStep || 'A';
          const subStepId = btn.getAttribute('data-substep') || null;
          state.lessonStep = phaseKey;
          state.runtime.activeSubStepId = subStepId;
          if (phaseKey === 'C') {
            state.runtime.flashcard = { cardId: subStepId, revealed: false, draft: '' };
          }
          // Mémoriser le repère de navigation SANS marquer l'étape terminée ni étudiée
          if (!state.route.startsWith('admin_preview_') && state.lessonId && profile.lessons[state.lessonId]) {
            const lRec = window.EpiStorage.ensureLessonRecord(profile, state.lessonId);
            lRec.lastActivePhase = phaseKey;
            if (subStepId) lRec.lastActiveStepByPhase[phaseKey] = subStepId;
            window.EpiStorage.save();
          }
          render();
          const ws = document.querySelector('.j-workspace-card');
          if (ws) ws.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        }

        case 'complete-understand-step': {
          const lid = btn.getAttribute('data-lesson') || state.lessonId;
          const sid = btn.getAttribute('data-stepid');
          if (!lid || !sid) break;
          const cat = getActiveCatalog();
          const pair = findLesson(lid, cat);
          if (!pair) break;

          if (state.route.startsWith('admin_preview_')) {
            window.EpiUI.toast('Mode prévisualisation : validation non enregistrée.');
            break;
          }

          const lRec = window.EpiStorage.ensureLessonRecord(profile, lid);
          const isNew = !lRec.understandCompletedIds.includes(sid);
          if (isNew) {
            lRec.understandCompletedIds.push(sid);
            lRec.lastStudiedAt = new Date().toISOString();
            if (lRec.status === 'not_started') {
              lRec.status = 'in_progress';
              lRec.seenRevisionVersion = Number(pair.lesson.revisionVersion) || 1;
            }
            const log = window.EpiStorage.ensureDailyLog(profile);
            if (!log.lessonsStudied.includes(lid)) log.lessonsStudied.push(lid);
            notifyBadges(window.EpiGamification.awardXP(profile, 6));
          }

          const lj = window.EpiJourney.syncDerivedLessonFlags(profile, pair.course, pair.lesson, cat);
          const pA = lj.phases.find(p => p.key === 'A');
          lRec.lastActivePhase = 'A';

          if (pA && pA.isCompleted) {
            lRec.stepAVisited = true;
            if (isNew) notifyBadges(window.EpiGamification.awardXP(profile, 10));
            window.EpiUI.toast('✅ Phase « À comprendre » terminée ! Passez maintenant à la phase suivante.', 'success');
          } else if (pA && pA.nextStep) {
            state.runtime.activeSubStepId = pA.nextStep.id;
            lRec.lastActiveStepByPhase.A = pA.nextStep.id;
            window.EpiUI.toast(`Étape validée (${pA.completedCount}/${pA.totalCount}) — continuez avec l’étape ${pA.nextStep.number}.`, 'success');
          }

          window.EpiStorage.syncNow();
          render();
          const ws = document.querySelector('.j-workspace-card');
          if (ws) ws.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        }

        case 'uncomplete-understand-step': {
          const lid = btn.getAttribute('data-lesson') || state.lessonId;
          const sid = btn.getAttribute('data-stepid');
          if (!lid || !sid || state.route.startsWith('admin_preview_')) break;
          const cat = getActiveCatalog();
          const pair = findLesson(lid, cat);
          const lRec = window.EpiStorage.ensureLessonRecord(profile, lid);
          lRec.understandCompletedIds = lRec.understandCompletedIds.filter(x => x !== sid);
          lRec.stepProgressVersion = 2;
          lRec.stepAVisited = false;
          if (pair) window.EpiJourney.syncDerivedLessonFlags(profile, pair.course, pair.lesson, cat);
          window.EpiStorage.syncNow();
          window.EpiUI.toast('Validation de l’étape retirée.');
          render();
          break;
        }

        case 'ar-reveal': {
          const arid = btn.getAttribute('data-arid');
          if (!arid) break;
          if (!state.runtime.activeRecall[arid]) state.runtime.activeRecall[arid] = { revealed: false, draft: '' };
          state.runtime.activeRecall[arid].revealed = true;
          render();
          break;
        }

        case 'complete-ar-step': {
          const lid = btn.getAttribute('data-lesson') || state.lessonId;
          const arid = btn.getAttribute('data-arid');
          if (!lid || !arid) break;
          const cat = getActiveCatalog();
          const pair = findLesson(lid, cat);
          if (!pair) break;
          if (state.route.startsWith('admin_preview_')) {
            window.EpiUI.toast('Mode prévisualisation : validation non enregistrée.');
            break;
          }
          const lRec = window.EpiStorage.ensureLessonRecord(profile, lid);
          if (!lRec.activeRecallDoneIds.includes(arid)) {
            lRec.activeRecallDoneIds.push(arid);
            lRec.lastStudiedAt = new Date().toISOString();
            if (lRec.status === 'not_started') {
              lRec.status = 'in_progress';
              lRec.seenRevisionVersion = Number(pair.lesson.revisionVersion) || 1;
            }
            notifyBadges(window.EpiGamification.awardXP(profile, 6));
          }
          const lj = window.EpiJourney.syncDerivedLessonFlags(profile, pair.course, pair.lesson, cat);
          const pAR = lj.phases.find(p => p.key === 'AR');
          lRec.lastActivePhase = 'AR';
          if (pAR && pAR.isCompleted) {
            window.EpiUI.toast('✅ Phase « Active Recall » terminée ! Passez maintenant aux Flashcards.', 'success');
          } else if (pAR && pAR.nextStep) {
            state.runtime.activeSubStepId = pAR.nextStep.id;
            lRec.lastActiveStepByPhase.AR = pAR.nextStep.id;
            window.EpiUI.toast(`Activité validée (${pAR.completedCount}/${pAR.totalCount}) — continuez avec l’activité ${pAR.nextStep.number}.`, 'success');
          }
          window.EpiStorage.syncNow();
          render();
          break;
        }

        case 'set-daily-time':
          profile.dailyGoalMin = Number(btn.getAttribute('data-min')) || 45;
          window.EpiStorage.save();
          window.EpiUI.toast(`Objectif quotidien adapté à ${profile.dailyGoalMin} min.`, 'success');
          render();
          break;

        case 'priorities-tab':
          state.prioritiesTab = btn.getAttribute('data-tab');
          render();
          break;

        case 'reset-course-filters':
          state.courseFilters = { search: '', subject: 'all', moduleId: 'all', priority: 'all', status: 'all' };
          render();
          break;

        case 'weak-filter':
          state.weakFilter = btn.getAttribute('data-level');
          render();
          break;

        case 'qcm-go-failed':
          state.route = 'qcm';
          state.qcmFilters = { courseId: 'all', sourceType: 'all', special: 'failed' };
          state.runtime.arenaQcms = {};
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;

        case 'qcm-load-more':
          state.qcmLimit += 15;
          render();
          break;

        case 'toggle-studied': {
          const lid = btn.getAttribute('data-lesson');
          const lRec = window.EpiStorage.ensureLessonRecord(profile, lid);
          lRec.studied = !lRec.studied;
          if (lRec.studied && lRec.status === 'not_started') lRec.status = 'in_progress';
          lRec.lastStudiedAt = new Date().toISOString();
          const log = window.EpiStorage.ensureDailyLog(profile);
          if (lRec.studied && !log.lessonsStudied.includes(lid)) log.lessonsStudied.push(lid);
          window.EpiStorage.save();
          window.EpiUI.toast(lRec.studied ? 'Leçon marquée comme étudiée (distinct de Maîtrisée).' : 'Marquage « étudiée » retiré.');
          render();
          break;
        }

        case 'toggle-mem-item': {
          const lid = btn.getAttribute('data-lesson');
          const mid = btn.getAttribute('data-mid');
          const shouldAdvance = btn.getAttribute('data-advance') === '1';
          if (state.route.startsWith('admin_preview_')) {
            window.EpiUI.toast('Mode prévisualisation : validation non enregistrée.');
            break;
          }
          const cat = getActiveCatalog();
          const pair = findLesson(lid, cat);
          const lRec = window.EpiStorage.ensureLessonRecord(profile, lid);
          const idx = lRec.memCheckedIds.indexOf(mid);
          if (idx >= 0) {
            lRec.memCheckedIds.splice(idx, 1);
            lRec.memDeclaredAll = false;
          } else {
            lRec.memCheckedIds.push(mid);
            lRec.lastStudiedAt = new Date().toISOString();
            if (lRec.status === 'not_started') {
              lRec.status = 'in_progress';
              if (pair) lRec.seenRevisionVersion = Number(pair.lesson.revisionVersion) || 1;
            }
            const log = window.EpiStorage.ensureDailyLog(profile);
            if (!log.memItems.includes(mid)) {
              log.memItems.push(mid);
              notifyBadges(window.EpiGamification.awardXP(profile, 5));
            }
          }
          if (pair) {
            const lj = window.EpiJourney.syncDerivedLessonFlags(profile, pair.course, pair.lesson, cat);
            const pB = lj.phases.find(p => p.key === 'B');
            lRec.lastActivePhase = 'B';
            if (pB && pB.isCompleted) {
              lRec.memDeclaredAll = true;
              window.EpiUI.toast('✅ Phase « À mémoriser » terminée ! Passez maintenant à la phase suivante.', 'success');
            } else if (shouldAdvance && pB && pB.nextStep) {
              state.runtime.activeSubStepId = pB.nextStep.id;
              lRec.lastActiveStepByPhase.B = pB.nextStep.id;
              window.EpiUI.toast(`Notion mémorisée (${pB.completedCount}/${pB.totalCount}) — continuez avec la notion ${pB.nextStep.number}.`, 'success');
            }
          }
          window.EpiStorage.syncNow();
          render();
          break;
        }

        case 'declare-mem-all': {
          const lid = btn.getAttribute('data-lesson');
          const pair = findLesson(lid);
          const lRec = window.EpiStorage.ensureLessonRecord(profile, lid);
          lRec.memDeclaredAll = !lRec.memDeclaredAll;
          if (lRec.memDeclaredAll && pair) {
            const log = window.EpiStorage.ensureDailyLog(profile);
            (pair.lesson.memorize || []).forEach(m => {
              if (!lRec.memCheckedIds.includes(m.id)) lRec.memCheckedIds.push(m.id);
              if (!log.memItems.includes(m.id)) log.memItems.push(m.id);
            });
            notifyBadges(window.EpiGamification.awardXP(profile, 10));
            window.EpiUI.toast('Section marquée mémorisée — vérifiez-la maintenant avec les flashcards !');
          }
          window.EpiStorage.syncNow();
          render();
          break;
        }

        case 'fc-jump': {
          const jumpIdx = Number(btn.getAttribute('data-idx')) || 0;
          const cards = window.EpiUI.asArr(getActiveCatalog().flashcards).filter(f => f.lessonId === state.lessonId);
          const targetCard = cards[jumpIdx];
          state.runtime.activeSubStepId = targetCard ? targetCard.id : null;
          state.runtime.flashcard = { cardId: targetCard ? targetCard.id : null, revealed: false, draft: '' };
          render();
          break;
        }

        case 'fc-reveal': {
          const cid = btn.getAttribute('data-cid') || state.runtime.activeSubStepId;
          state.runtime.flashcard = { cardId: cid, revealed: true, draft: state.runtime.flashcard.draft || '' };
          render();
          break;
        }

        case 'fc-rate': {
          const cid = btn.getAttribute('data-cid');
          const rating = btn.getAttribute('data-rating');
          const cat = getActiveCatalog();
          const pair = findLesson(state.lessonId, cat);

          if (state.route.startsWith('admin_preview_')) {
            const cards = window.EpiUI.asArr(cat.flashcards).filter(f => f.lessonId === state.lessonId);
            const curI = cards.findIndex(c => c.id === cid);
            const nextC = cards[(curI + 1) % Math.max(1, cards.length)];
            state.runtime.activeSubStepId = nextC ? nextC.id : null;
            state.runtime.flashcard = { cardId: nextC ? nextC.id : null, revealed: false, draft: '' };
            window.EpiUI.toast('Mode aperçu : carte suivante affichée (progression non modifiée).');
            render();
            break;
          }
          const rec = window.EpiSRS.recordFlashcardReview(profile, cid, rating);
          const log = window.EpiStorage.ensureDailyLog(profile);
          log.flashcardsDone += 1;
          const xp = rating === 'knew' ? 8 : (rating === 'partial' ? 4 : 2);
          notifyBadges(window.EpiGamification.awardXP(profile, xp));

          let nextCardId = null;
          let phaseCCompleted = false;
          if (pair) {
            const lRec = window.EpiStorage.ensureLessonRecord(profile, pair.lesson.id);
            lRec.lastStudiedAt = new Date().toISOString();
            if (lRec.status === 'not_started') {
              lRec.status = 'in_progress';
              lRec.seenRevisionVersion = Number(pair.lesson.revisionVersion) || 1;
            }
            if (!lRec.mastered && lRec.miniTestBest !== null && lRec.miniTestBest >= 80 && window.EpiSRS.hasCompletedMemorizationEvidence(profile, pair.lesson)) {
              lRec.mastered = true;
              lRec.studied = true;
              lRec.status = 'completed';
              lRec.masteredAt = new Date().toISOString();
              lRec.seenRevisionVersion = Number(pair.lesson.revisionVersion) || 1;
              window.EpiSRS.scheduleLessonAfterMastery(profile, pair.lesson.id);
              window.EpiUI.toast('🎉 Leçon désormais MAÎTRISÉE et planifiée en répétition espacée (J+1) !', 'success');
            }
            const lj = window.EpiJourney.syncDerivedLessonFlags(profile, pair.course, pair.lesson, cat);
            const pC = lj.phases.find(p => p.key === 'C');
            if (pC) {
              phaseCCompleted = pC.isCompleted;
              if (pC.nextStep) {
                nextCardId = pC.nextStep.id;
                lRec.lastActiveStepByPhase.C = nextCardId;
              }
            }
            lRec.lastActivePhase = 'C';
          }

          window.EpiStorage.syncNow();
          if (nextCardId) {
            state.runtime.activeSubStepId = nextCardId;
            state.runtime.flashcard = { cardId: nextCardId, revealed: false, draft: '' };
          } else {
            state.runtime.flashcard = { cardId: cid, revealed: false, draft: '' };
          }
          const msg = phaseCCompleted
            ? '✅ Toutes les flashcards de la leçon sont évaluées ! Passez maintenant à l’entraînement QCM.'
            : (rating === 'knew'
              ? `Bravo ! Prochaine révision programmée dans ${rec.intervalDays} jour(s).`
              : (rating === 'partial' ? 'Noté partiel — carte ramenée dès demain (J+1).' : 'Ajoutée à vos concepts oubliés & points faibles pour révision immédiate.'));
          window.EpiUI.toast(msg, (phaseCCompleted || rating === 'knew') ? 'success' : 'warning');
          render();
          break;
        }

        case 'qcm-toggle': {
          const prefix = btn.getAttribute('data-prefix');
          const qid = btn.getAttribute('data-qid');
          const key = btn.getAttribute('data-key');
          const qcm = window.EpiUI.asArr(getActiveCatalog().qcms).find(q => q.id === qid);
          if (!qcm) return;

          let targetArr;
          if (prefix === 'lessonq') {
            if (!state.runtime.lessonQcms[qid]) state.runtime.lessonQcms[qid] = { selected: [], submitted: false, isCorrect: false };
            if (state.runtime.lessonQcms[qid].submitted) return;
            targetArr = state.runtime.lessonQcms[qid].selected;
          } else if (prefix === 'arena') {
            if (!state.runtime.arenaQcms[qid]) state.runtime.arenaQcms[qid] = { selected: [], submitted: false, isCorrect: false };
            if (state.runtime.arenaQcms[qid].submitted) return;
            targetArr = state.runtime.arenaQcms[qid].selected;
          } else if (prefix === 'minitest') {
            if (state.runtime.miniTest.submitted) return;
            if (!state.runtime.miniTest.answers[qid]) state.runtime.miniTest.answers[qid] = [];
            targetArr = state.runtime.miniTest.answers[qid];
          } else if (prefix === 'exam') {
            if (!state.runtime.examSim || state.runtime.examSim.submitted) return;
            if (!state.runtime.examSim.answers[qid]) state.runtime.examSim.answers[qid] = [];
            targetArr = state.runtime.examSim.answers[qid];
          } else {
            return;
          }

          if (qcm.multiSelect) {
            const i = targetArr.indexOf(key);
            if (i >= 0) targetArr.splice(i, 1);
            else targetArr.push(key);
          } else {
            targetArr.length = 0;
            targetArr.push(key);
          }
          render();
          break;
        }

        case 'qcm-submit': {
          const prefix = btn.getAttribute('data-prefix');
          const qid = btn.getAttribute('data-qid');
          const qcm = window.EpiUI.asArr(getActiveCatalog().qcms).find(q => q.id === qid);
          const bucket = prefix === 'lessonq' ? state.runtime.lessonQcms : state.runtime.arenaQcms;
          const st = bucket[qid];
          if (!qcm || !st || st.submitted || st.selected.length === 0) return;

          const isCorrect = window.EpiViewsLesson.arraysEqualSet(st.selected, qcm.correct);
          st.submitted = true;
          st.isCorrect = isCorrect;
          if (!state.route.startsWith('admin_preview_')) {
            window.EpiSRS.recordQcmAttempt(profile, qid, st.selected, isCorrect);
            const log = window.EpiStorage.ensureDailyLog(profile);
            log.qcmsDone += 1;
            if (isCorrect) log.qcmsCorrect += 1;
            notifyBadges(window.EpiGamification.awardXP(profile, isCorrect ? 12 : 3));
            if (prefix === 'lessonq' && state.lessonId) {
              const pair = findLesson(state.lessonId);
              if (pair) {
                const lRec = window.EpiStorage.ensureLessonRecord(profile, pair.lesson.id);
                lRec.lastStudiedAt = new Date().toISOString();
                if (lRec.status === 'not_started') {
                  lRec.status = 'in_progress';
                  lRec.seenRevisionVersion = Number(pair.lesson.revisionVersion) || 1;
                }
                const lj = window.EpiJourney.syncDerivedLessonFlags(profile, pair.course, pair.lesson, window.EpiData);
                const pD = lj.phases.find(p => p.key === 'D');
                lRec.lastActivePhase = 'D';
                if (pD && pD.isCompleted) {
                  window.EpiUI.toast('✅ Phase « Entraînement QCM » terminée ! Passez maintenant au Mini-test.', 'success');
                }
              }
            }
            window.EpiStorage.syncNow();
          }
          render();
          break;
        }

        case 'lesson-qcm-reset':
          state.runtime.lessonQcms = {};
          render();
          break;

        case 'lesson-qcm-reset-one': {
          const qid = btn.getAttribute('data-qid');
          if (qid && state.runtime.lessonQcms[qid]) delete state.runtime.lessonQcms[qid];
          render();
          break;
        }

        case 'minitest-submit': {
          const cat = getActiveCatalog();
          const pair = findLesson(state.lessonId, cat);
          if (!pair) return;
          const questions = window.EpiViewsLesson.getMiniTestQuestions(pair.course, pair.lesson, cat);
          if (!questions.length) return;
          const mt = state.runtime.miniTest;
          let correctCount = 0;
          const isPrev = state.route.startsWith('admin_preview_');
          const log = isPrev ? null : window.EpiStorage.ensureDailyLog(profile);

          questions.forEach(q => {
            const sel = mt.answers[q.id] || [];
            const ok = window.EpiViewsLesson.arraysEqualSet(sel, q.correct);
            if (ok) correctCount++;
            if (!isPrev) {
              window.EpiSRS.recordQcmAttempt(profile, q.id, sel, ok);
              log.qcmsDone += 1;
              if (ok) log.qcmsCorrect += 1;
            }
          });

          const scorePct = Math.round((correctCount / questions.length) * 100);
          mt.submitted = true;
          mt.scorePct = scorePct;
          mt.correctCount = correctCount;

          if (isPrev) {
            render();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
          }

          const lRec = window.EpiStorage.ensureLessonRecord(profile, pair.lesson.id);
          lRec.miniTestAttempts += 1;
          lRec.lastMiniTestScore = scorePct;
          lRec.studied = true;
          lRec.lastStudiedAt = new Date().toISOString();
          lRec.lastActivePhase = 'E';
          lRec.lastActiveStepByPhase.E = 'mt_validate';
          state.runtime.activeSubStepId = 'mt_validate';
          if (lRec.miniTestBest === null || scorePct > lRec.miniTestBest) lRec.miniTestBest = scorePct;
          if (!log.lessonsStudied.includes(pair.lesson.id)) log.lessonsStudied.push(pair.lesson.id);

          if (scorePct > (profile.personalBestQuiz || 0)) profile.personalBestQuiz = scorePct;
          profile.examHistory.push({
            date: new Date().toISOString(),
            type: 'minitest',
            label: `Mini-test ${pair.course.code} · ${pair.lesson.title}`,
            scorePct,
            correct: correctCount,
            total: questions.length,
            courseId: pair.course.id,
            lessonId: pair.lesson.id
          });

          const passingScore = (pair.lesson.miniTest && pair.lesson.miniTest.passingScore) || 80;
          const memOk = window.EpiSRS.hasCompletedMemorizationEvidence(profile, pair.lesson);
          if (scorePct >= passingScore && memOk) {
            lRec.mastered = true;
            lRec.status = 'completed';
            lRec.masteredAt = lRec.masteredAt || new Date().toISOString();
            lRec.seenRevisionVersion = Number(pair.lesson.revisionVersion) || 1;
            mt.newlyMastered = true;
            window.EpiSRS.scheduleLessonAfterMastery(profile, pair.lesson.id);
            if (!log.lessonsMastered.includes(pair.lesson.id)) log.lessonsMastered.push(pair.lesson.id);
            notifyBadges(window.EpiGamification.awardXP(profile, 40));
          } else {
            lRec.status = 'in_progress';
            notifyBadges(window.EpiGamification.awardXP(profile, 15));
          }

          window.EpiJourney.syncDerivedLessonFlags(profile, pair.course, pair.lesson, cat);
          window.EpiStorage.syncNow();
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        }

        case 'minitest-retry': {
          state.runtime.miniTest = { answers: {}, submitted: false, scorePct: 0, correctCount: 0, newlyMastered: false };
          const cat = getActiveCatalog();
          const pair = findLesson(state.lessonId, cat);
          const qs = pair ? window.EpiViewsLesson.getMiniTestQuestions(pair.course, pair.lesson, cat) : [];
          state.runtime.activeSubStepId = qs[0] ? `mtq_${qs[0].id}` : 'mt_validate';
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        }

        case 'srs-start-session':
          startRevisionSession(btn.getAttribute('data-mode'));
          break;

        case 'srs-reveal':
          if (state.runtime.revSession) {
            state.runtime.revSession.revealed = true;
            render();
          }
          break;

        case 'srs-rate': {
          const s = state.runtime.revSession;
          if (!s || s.idx >= s.items.length) return;
          const rating = btn.getAttribute('data-rating');
          const cur = s.items[s.idx];
          window.EpiSRS.recordFlashcardReview(profile, cur.card.id, rating);

          if (rating === 'knew') s.knew += 1;
          else if (rating === 'partial') s.partial += 1;
          else s.forgot += 1;

          if (!s.lessonScores[cur.lessonId]) s.lessonScores[cur.lessonId] = { total: 0, good: 0 };
          s.lessonScores[cur.lessonId].total += 1;
          if (rating === 'knew') s.lessonScores[cur.lessonId].good += 1;

          const log = window.EpiStorage.ensureDailyLog(profile);
          log.revisionsDone += 1;
          log.flashcardsDone += 1;
          notifyBadges(window.EpiGamification.awardXP(profile, rating === 'knew' ? 10 : 4));

          s.idx += 1;
          s.revealed = false;

          if (s.idx >= s.items.length) {
            Object.keys(s.lessonScores).forEach(lid => {
              if (profile.lessonSrs[lid]) {
                const ls = s.lessonScores[lid];
                const pct = Math.round((ls.good / ls.total) * 100);
                window.EpiSRS.recordLessonRevision(profile, lid, pct);
              }
            });
            notifyBadges(window.EpiGamification.awardXP(profile, 20));
          }

          window.EpiStorage.save();
          render();
          break;
        }

        case 'srs-end-session':
          state.runtime.revSession = null;
          render();
          break;

        case 'exam-start':
          startExamSimulation(btn.getAttribute('data-count'));
          break;

        case 'exam-submit': {
          const sim = state.runtime.examSim;
          if (!sim || sim.submitted) return;
          stopExamTimer();
          let correctCount = 0;
          const log = window.EpiStorage.ensureDailyLog(profile);
          sim.questions.forEach(q => {
            const sel = sim.answers[q.id] || [];
            const ok = window.EpiViewsLesson.arraysEqualSet(sel, q.correct);
            if (ok) correctCount++;
            window.EpiSRS.recordQcmAttempt(profile, q.id, sel, ok);
            log.qcmsDone += 1;
            if (ok) log.qcmsCorrect += 1;
          });
          const scorePct = Math.round((correctCount / sim.questions.length) * 100);
          sim.submitted = true;
          sim.correctCount = correctCount;
          sim.scorePct = scorePct;
          sim.endedAt = Date.now();

          if (scorePct > (profile.personalBestQuiz || 0)) profile.personalBestQuiz = scorePct;
          profile.examHistory.push({
            date: new Date().toISOString(),
            type: 'exam_sim',
            label: `Simulation d’examen (${sim.questions.length} QCM)`,
            scorePct,
            correct: correctCount,
            total: sim.questions.length
          });
          notifyBadges(window.EpiGamification.awardXP(profile, 20 + correctCount * 4));
          window.EpiStorage.save();
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        }

        case 'exam-exit':
          stopExamTimer();
          state.runtime.examSim = null;
          render();
          break;

        case 'open-notifications':
          openNotificationsModal(profile);
          break;

        case 'modal-go-revisions':
          window.EpiUI.closeModal();
          state.route = 'revisions';
          render();
          break;

        case 'modal-go-weak':
          window.EpiUI.closeModal();
          state.route = 'weak';
          render();
          break;

        case 'open-profile-modal':
          openProfileModal();
          break;

        case 'close-modal':
          window.EpiUI.closeModal();
          break;

        case 'create-profile': {
          const inp = document.getElementById('new-profile-name');
          const name = inp ? inp.value.trim() : '';
          if (!name) { window.EpiUI.toast('Veuillez saisir un nom de profil.', 'warning'); return; }
          window.EpiStorage.createProfile(name);
          window.EpiUI.closeModal();
          window.EpiUI.toast(`Profil « ${name} » créé et activé.`, 'success');
          state.route = 'dashboard';
          render();
          break;
        }

        case 'switch-profile':
          window.EpiStorage.switchProfile(btn.getAttribute('data-pid'));
          window.EpiUI.closeModal();
          state.route = 'dashboard';
          window.EpiUI.toast('Profil étudiant changé.', 'success');
          render();
          break;

        case 'rename-profile': {
          const inp = document.getElementById('rename-profile-input');
          const name = inp ? inp.value.trim() : '';
          if (name) {
            window.EpiStorage.renameProfile(profile.id, name);
            window.EpiUI.closeModal();
            window.EpiUI.toast('Profil renommé.', 'success');
            render();
          }
          break;
        }

        case 'delete-profile':
          if (window.EpiStorage.deleteProfile(btn.getAttribute('data-pid'))) {
            openProfileModal();
            render();
          }
          break;

        case 'reset-profile':
          if (window.confirm('Réinitialiser à 0 % toute votre progression personnelle ?')) {
            window.EpiStorage.resetActiveProfile();
            window.EpiUI.closeModal();
            state.route = 'dashboard';
            window.EpiUI.toast('Progression réinitialisée à 0 %.', 'warning');
            render();
          }
          break;

        case 'export-backup': {
          const blob = new Blob([window.EpiStorage.exportJSON()], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `medstudy-progress-backup-${window.EpiStorage.todayKey()}.json`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          window.EpiUI.toast('Sauvegarde JSON téléchargée.', 'success');
          break;
        }
      }
    } catch (err) {
      window.EpiUI.toast(err.message || 'Erreur lors de l’opération.', 'warning');
    }
  }

  // ==================== GESTIONNAIRE ÉDITEUR EN MÉMOIRE (ZÉRO SAUT DE CURSEUR) ====================
  function handleEditorLiveField(el) {
    const ed = state.adminState.editor;
    if (!ed) return false;

    const cField = el.getAttribute('data-ed-course');
    if (cField) {
      ed.course[cField] = el.value;
      ed.dirty = true;
      return true;
    }

    if (el.hasAttribute('data-ed-lesson-reviewed')) {
      const lidx = Number(el.getAttribute('data-ed-lesson-reviewed'));
      if (ed.course.lessons[lidx]) {
        ed.course.lessons[lidx].needsReview = !el.checked;
        ed.dirty = true;
      }
      return true;
    }

    const lField = el.getAttribute('data-ed-lesson');
    if (lField) {
      const lidx = Number(el.getAttribute('data-lidx'));
      const lesson = ed.course.lessons[lidx];
      if (!lesson) return true;
      if (!lesson.understand) lesson.understand = { intro: '', sections: [{ heading: lesson.title, paragraphs: [], bullets: [] }], tables: [], darija: '', triad: { toUnderstand: [], toMemorize: [], toRecognizeInQcm: [] } };
      if (!Array.isArray(lesson.understand.sections) || !lesson.understand.sections.length) {
        lesson.understand.sections = [{ heading: lesson.title, paragraphs: [], bullets: [] }];
      }
      if (!lesson.understand.triad) lesson.understand.triad = { toUnderstand: [], toMemorize: [], toRecognizeInQcm: [] };

      const splitLines = (v) => String(v || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean);

      if (lField === 'durationMin') lesson.durationMin = Number(el.value) || 10;
      else if (lField === 'intro') lesson.understand.intro = el.value;
      else if (lField === 'darija') lesson.understand.darija = el.value;
      else if (lField === 'sec0Heading') lesson.understand.sections[0].heading = el.value;
      else if (lField === 'sec0Paragraphs') lesson.understand.sections[0].paragraphs = splitLines(el.value);
      else if (lField === 'sec0Bullets') lesson.understand.sections[0].bullets = splitLines(el.value);
      else if (lField === 'triadUnderstand') lesson.understand.triad.toUnderstand = splitLines(el.value);
      else if (lField === 'triadMemorize') lesson.understand.triad.toMemorize = splitLines(el.value);
      else if (lField === 'triadQcm') lesson.understand.triad.toRecognizeInQcm = splitLines(el.value);
      else lesson[lField] = el.value;
      ed.dirty = true;
      return true;
    }

    const secField = el.getAttribute('data-ed-sec');
    if (secField) {
      const lidx = Number(el.getAttribute('data-lidx'));
      const sidx = Number(el.getAttribute('data-sidx'));
      const lesson = ed.course.lessons[lidx];
      if (lesson && lesson.understand && Array.isArray(lesson.understand.sections) && lesson.understand.sections[sidx]) {
        const splitLines = (v) => String(v || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean);
        if (secField === 'heading') lesson.understand.sections[sidx].heading = el.value;
        else if (secField === 'paragraphs') lesson.understand.sections[sidx].paragraphs = splitLines(el.value);
        else if (secField === 'bullets') lesson.understand.sections[sidx].bullets = splitLines(el.value);
        ed.dirty = true;
      }
      return true;
    }

    const rField = el.getAttribute('data-ed-recall');
    if (rField) {
      const lidx = Number(el.getAttribute('data-lidx'));
      const ridx = Number(el.getAttribute('data-ridx'));
      const lesson = ed.course.lessons[lidx];
      if (lesson && Array.isArray(lesson.activeRecall) && lesson.activeRecall[ridx]) {
        lesson.activeRecall[ridx][rField] = el.value;
        ed.dirty = true;
      }
      return true;
    }

    const mField = el.getAttribute('data-ed-mem');
    if (mField) {
      const lidx = Number(el.getAttribute('data-lidx'));
      const midx = Number(el.getAttribute('data-midx'));
      const lesson = ed.course.lessons[lidx];
      if (lesson && lesson.memorize && lesson.memorize[midx]) {
        lesson.memorize[midx][mField] = el.value;
        ed.dirty = true;
      }
      return true;
    }

    if (el.hasAttribute('data-ed-rev')) {
      const rKey = el.getAttribute('data-ed-rev');
      if (!ed.course.metadata || typeof ed.course.metadata !== 'object') ed.course.metadata = {};
      if (!ed.course.metadata.revisionSheet || typeof ed.course.metadata.revisionSheet !== 'object') {
        ed.course.metadata.revisionSheet = { sourceSummary: '', mustMemorize: [], mostFrequent: [], distinctions: [], formulas: [], traps: [], lessTime: [], checklist: [], darija: '' };
      }
      if (el.getAttribute('data-ed-rev-list') === '1') {
        ed.course.metadata.revisionSheet[rKey] = el.value.split('\n').map(s => s.trim()).filter(Boolean);
      } else {
        ed.course.metadata.revisionSheet[rKey] = el.value;
      }
      ed.dirty = true;
      return true;
    }

    const fcField = el.getAttribute('data-ed-fc');
    if (fcField) {
      const fidx = Number(el.getAttribute('data-fidx'));
      if (ed.flashcards[fidx]) {
        ed.flashcards[fidx][fcField] = el.value;
        ed.dirty = true;
      }
      return true;
    }

    const qField = el.getAttribute('data-ed-qcm');
    if (qField) {
      const qidx = Number(el.getAttribute('data-qidx'));
      if (ed.qcms[qidx]) {
        ed.qcms[qidx][qField] = (qField === 'multiSelect') ? !!el.checked : el.value;
        ed.dirty = true;
      }
      return true;
    }

    if (el.hasAttribute('data-ed-qcm-opt')) {
      const qidx = Number(el.getAttribute('data-qidx'));
      const oi = Number(el.getAttribute('data-ed-qcm-opt'));
      if (ed.qcms[qidx] && ed.qcms[qidx].options && ed.qcms[qidx].options[oi]) {
        ed.qcms[qidx].options[oi].text = el.value;
        ed.dirty = true;
      }
      return true;
    }

    if (el.hasAttribute('data-ed-qcm-wrong')) {
      const qidx = Number(el.getAttribute('data-qidx'));
      const key = el.getAttribute('data-ed-qcm-wrong');
      const q = ed.qcms[qidx];
      if (q) {
        if (!q.wrongReasons || typeof q.wrongReasons !== 'object') q.wrongReasons = {};
        q.wrongReasons[key] = el.value;
        ed.dirty = true;
      }
      return true;
    }

    if (el.hasAttribute('data-ed-qcm-corr')) {
      const qidx = Number(el.getAttribute('data-qidx'));
      const key = el.getAttribute('data-ed-qcm-corr');
      const q = ed.qcms[qidx];
      if (q) {
        const cur = new Set(window.EpiUI.asArr(q.correct));
        if (el.checked) cur.add(key);
        else cur.delete(key);
        q.correct = Array.from(cur).sort();
        ed.dirty = true;
      }
      return true;
    }

    return false;
  }

  // ==================== GESTIONNAIRE INPUT / CHANGE / UPLOAD ====================
  async function handleInputOrChange(e) {
    const el = e.target;

    // 1. Champs de l'éditeur Admin (sans re-rendre tout le DOM pendant la saisie !)
    if (handleEditorLiveField(el)) return;

    // 1b. Sélection de fichiers dans le formulaire unifié "Ajouter un cours" (sans perdre la saisie)
    if (el.getAttribute('data-action') === 'admin-wizard-select-files' && el.files && el.files.length > 0) {
      const kind = el.getAttribute('data-kind') || 'primary_source';
      const files = Array.from(el.files);
      const snapIds = ['add-course-title', 'add-course-code', 'add-course-year', 'add-course-prof', 'add-course-priority', 'add-course-semester', 'add-course-tags', 'add-course-summary'];
      const savedVals = {};
      snapIds.forEach(id => { const node = document.getElementById(id); if (node) savedVals[id] = node.value; });

      if (kind === 'support_doc') state.adminState.addWizard.pendingSupportFiles = files;
      else state.adminState.addWizard.pendingFiles = files;
      render();

      snapIds.forEach(id => { const node = document.getElementById(id); if (node && savedVals[id] !== undefined) node.value = savedVals[id]; });
      window.EpiUI.toast(`${files.length} fichier(s) sélectionné(s) — cliquez sur « Téléverser & Analyser le cours ».`, 'success');
      return;
    }

    // 2. Upload de fichiers PDF / Annexes
    if (el.getAttribute('data-action') === 'admin-upload-files' && el.files && el.files.length > 0) {
      const cid = el.getAttribute('data-cid');
      const kind = el.getAttribute('data-kind') || 'primary_pdf';
      const files = Array.from(el.files);
      state.adminState.addWizard.uploading = true;
      render();
      let okCnt = 0;
      for (const f of files) {
        try {
          await window.EpiAPI.uploadCourseFile(cid, f, kind);
          okCnt++;
        } catch (err) {
          window.EpiUI.toast(`${f.name} : ${err.message}`, 'warning');
        }
      }
      state.adminState.addWizard.uploading = false;
      await refreshCatalogsOnly();
      if (state.adminState.editor && state.adminState.editor.course.id === cid) {
        const fresh = state.adminData.courses.find(c => c.id === cid);
        if (fresh) state.adminState.editor.course.attachments = window.EpiUI.asArr(fresh.attachments);
      }
      if (okCnt > 0) window.EpiUI.toast(`${okCnt} fichier(s) téléversé(s) avec succès.`, 'success');
      render();
      return;
    }

    // 3. Sélecteur de module dans l'assistant "Ajouter un cours"
    if (el.getAttribute('data-action') === 'admin-wizard-module-change') {
      state.adminState.addWizard.selectedModuleId = el.value;
      const hidden = document.querySelector('form[data-form="admin-create-course"] input[name="moduleId"]');
      if (hidden) hidden.value = el.value;
      return;
    }

    // 4. Filtres Admin & Étudiant
    const filter = el.getAttribute('data-filter');
    if (filter === 'courses-search') {
      state.courseFilters.search = el.value;
      render();
      const restored = document.querySelector('[data-filter="courses-search"]');
      if (restored) { restored.focus(); restored.setSelectionRange(el.value.length, el.value.length); }
      return;
    }
    if (filter === 'courses-subject') { state.courseFilters.subject = el.value; render(); return; }
    if (filter === 'courses-module') { state.courseFilters.moduleId = el.value; render(); return; }
    if (filter === 'courses-priority') { state.courseFilters.priority = el.value; render(); return; }
    if (filter === 'courses-status') { state.courseFilters.status = el.value; render(); return; }

    if (filter === 'admin-search') {
      state.adminState.filters.search = el.value;
      render();
      const restored = document.querySelector('[data-filter="admin-search"]');
      if (restored) { restored.focus(); restored.setSelectionRange(el.value.length, el.value.length); }
      return;
    }
    if (filter === 'admin-module') { state.adminState.filters.moduleId = el.value; render(); return; }
    if (filter === 'admin-inv-search') {
      state.adminState.invFilters.search = el.value;
      render();
      const restored = document.querySelector('[data-filter="admin-inv-search"]');
      if (restored) { restored.focus(); restored.setSelectionRange(el.value.length, el.value.length); }
      return;
    }
    if (filter === 'admin-ed-fc-lesson' && state.adminState.editor) { state.adminState.editor.fcLessonFilter = el.value; render(); return; }
    if (filter === 'admin-ed-qcm-lesson' && state.adminState.editor) { state.adminState.editor.qcmLessonFilter = el.value; render(); return; }
    if (filter === 'admin-ed-qcm-source' && state.adminState.editor) { state.adminState.editor.qcmSourceFilter = el.value; render(); return; }

    if (filter === 'qcm-course') { state.qcmFilters.courseId = el.value; state.qcmLimit = 15; render(); return; }
    if (filter === 'qcm-source') { state.qcmFilters.sourceType = el.value; state.qcmLimit = 15; render(); return; }
    if (filter === 'qcm-special') { state.qcmFilters.special = el.value; state.qcmLimit = 15; render(); return; }

    if (el.getAttribute('data-action') === 'fc-draft') {
      state.runtime.flashcard.draft = el.value;
      return;
    }

    if (el.getAttribute('data-action') === 'ar-draft') {
      const arid = el.getAttribute('data-arid');
      if (arid) {
        if (!state.runtime.activeRecall[arid]) state.runtime.activeRecall[arid] = { revealed: false, draft: '' };
        state.runtime.activeRecall[arid].draft = el.value;
      }
      return;
    }

    if (el.getAttribute('data-action') === 'import-backup' && el.files && el.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        const res = window.EpiStorage.importJSON(reader.result);
        if (res.ok) {
          window.EpiUI.toast(`Sauvegarde importée (${res.profilesCount} profil(s)).`, 'success');
          state.route = 'dashboard';
          render();
        } else {
          window.EpiUI.toast(res.error, 'warning');
        }
      };
      reader.readAsText(el.files[0]);
    }
  }

  async function bootServerSession() {
    if (!window.EpiAPI.isHttp) {
      state.booting = false;
      state.authenticated = true;
      render();
      return;
    }

    try {
      const me = await window.EpiAPI.me();
      if (!me.seeded && INITIAL_SEED_SNAPSHOT) {
        await window.EpiAPI.bootstrapSeed(INITIAL_SEED_SNAPSHOT);
      }
      if (me.authenticated && me.user) {
        state.authenticated = true;
        state.user = me.user;
        await refreshAllData();
      } else {
        state.authenticated = false;
        state.user = null;
      }
    } catch (err) {
      console.error('MedStudy boot error:', err);
      state.authUi.error = 'Impossible de joindre le serveur MedStudy. Vérifiez que server.ps1 est actif.';
      state.authenticated = false;
    } finally {
      state.booting = false;
      render();
    }
  }

  function init() {
    state.theme = window.EpiStorage.setTheme(window.EpiStorage.getTheme());
    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);
    document.addEventListener('input', (e) => {
      if (e.target.matches('[data-filter="courses-search"], [data-filter="admin-search"], [data-filter="admin-inv-search"], [data-action="fc-draft"], [data-action="ar-draft"], [data-ed-course], [data-ed-lesson], [data-ed-sec], [data-ed-recall], [data-ed-mem], [data-ed-rev], [data-ed-fc], [data-ed-qcm], [data-ed-qcm-opt], [data-ed-qcm-wrong]')) {
        handleInputOrChange(e);
      }
    });
    document.addEventListener('change', (e) => {
      if (e.target.matches('select[data-filter], input[data-action="import-backup"], input[data-action="admin-upload-files"], input[data-action="admin-wizard-select-files"], select[data-action="admin-wizard-module-change"], [data-ed-course], [data-ed-lesson], [data-ed-lesson-reviewed], [data-ed-sec], [data-ed-recall], [data-ed-mem], [data-ed-rev], [data-ed-fc], [data-ed-qcm], [data-ed-qcm-corr], [data-ed-qcm-wrong]')) {
        handleInputOrChange(e);
      }
    });
    document.getElementById('sidebar-overlay').addEventListener('click', () => {
      state.sidebarOpen = false;
      render();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') window.EpiUI.closeModal();
    });
    window.addEventListener('pagehide', () => {
      if (state.authenticated && window.EpiStorage.isServerMode()) {
        window.EpiStorage.syncNow();
      }
    });

    render();
    bootServerSession();
  }

  document.addEventListener('DOMContentLoaded', init);

  return { render, state, refreshAllData };
})();
