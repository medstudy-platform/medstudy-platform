/* ==========================================================================
   Vues Principales : Tableau de bord, Mes cours, Priorités d'examen & Pièges BM
   ========================================================================== */
window.EpiViewsDashboard = (function () {
  const esc = (s) => window.EpiUI.esc(s);
  const icon = (n, s) => window.EpiIcons.get(n, s);

  function renderDashboard(profile) {
    const stats = window.EpiPlanner.getGlobalStats(profile);
    const rev = window.EpiSRS.getRevisionsSummary(profile);
    const weak = window.EpiSRS.getWeakPoints(profile);
    const redCount = weak.filter(w => w.mastery.level === 'red').length;
    const orangeCount = weak.filter(w => w.mastery.level === 'orange').length;
    const nextAction = window.EpiPlanner.getNextBestAction(profile);
    const mission = window.EpiPlanner.getDailyMission(profile);
    const coursesNeedingRev = window.EpiData.courses.filter(c => window.EpiPlanner.getCourseStats(profile, c).needsRevision > 0);

    // Hero action data attributes
    const act = nextAction.action || { route: 'courses' };
    let heroBtnAttrs = `data-action="hero-go" data-route="${esc(act.route)}"`;
    if (act.courseId) heroBtnAttrs += ` data-course="${esc(act.courseId)}"`;
    if (act.lessonId) heroBtnAttrs += ` data-lesson="${esc(act.lessonId)}"`;
    if (act.step) heroBtnAttrs += ` data-step="${esc(act.step)}"`;
    if (act.startSession) heroBtnAttrs += ` data-start-session="1"`;
    if (act.startExam) heroBtnAttrs += ` data-start-exam="${act.startExam}"`;

    // Rappels internes honnêtes
    const internalReminderHtml = rev.urgentCount > 0 ? `
      <div class="alert alert-warning" style="align-items:center;justify-content:space-between;flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:10px;">
          ${icon('bell', 19)}
          <div>
            <strong>Rappel interne de révision :</strong> vous avez <strong>${rev.urgentCount} élément${rev.urgentCount > 1 ? 's' : ''}</strong> à réviser (${rev.overdue.length} en retard, ${rev.dueToday.length} aujourd’hui, ${rev.forgotten.length} oublié${rev.forgotten.length > 1 ? 's' : ''}).
          </div>
        </div>
        <button class="btn btn-warning btn-sm" data-action="nav" data-route="revisions">Ouvrir Mes révisions →</button>
      </div>` : '';

    // Sélecteur temps Mission du jour
    const timeBtns = window.EpiPlanner.TIME_PRESETS.map(p => `
      <button type="button" class="time-pill ${profile.dailyGoalMin === p.min ? 'active' : ''}" data-action="set-daily-time" data-min="${p.min}">
        ${p.min} min
      </button>`).join('');

    const missionTasksHtml = mission.tasks.map(t => {
      let btnAttrs = `data-action="hero-go" data-route="${esc(t.action.route)}"`;
      if (t.action.courseId) btnAttrs += ` data-course="${esc(t.action.courseId)}"`;
      if (t.action.lessonId) btnAttrs += ` data-lesson="${esc(t.action.lessonId)}"`;
      if (t.action.step) btnAttrs += ` data-step="${esc(t.action.step)}"`;
      return `
        <div class="mission-item ${t.completed ? 'done' : ''}">
          <div style="min-width:0;flex:1;">
            <div style="font-weight:700;font-size:14px;color:#0f1e3a;display:flex;align-items:center;gap:7px;">
              <span>${t.completed ? '✅' : '○'}</span>
              <span>${esc(t.label)}</span>
              <span class="badge ${t.completed ? 'badge-green' : 'badge-neutral'}" style="font-variant-numeric:tabular-nums;">${t.current} / ${t.target}</span>
            </div>
            <div style="font-size:12.5px;color:#64748b;margin-top:2px;">${esc(t.detail)}</div>
          </div>
          ${t.completed
            ? `<span style="font-size:12.5px;font-weight:700;color:#059669;">Accompli</span>`
            : `<button class="btn btn-secondary btn-sm" ${btnAttrs}>Aller →</button>`}
        </div>`;
    }).join('');

    // Panneau droit : Prochaines révisions + Points faibles
    const upcomingItems = [...rev.overdue, ...rev.forgotten, ...rev.dueToday, ...rev.upcoming].slice(0, 4);
    const revPreviewHtml = upcomingItems.length > 0
      ? upcomingItems.map(item => `
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid #f1f5f9;">
            <div style="min-width:0;">
              <div style="font-size:13.5px;font-weight:600;color:#0f1e3a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(item.title)}</div>
              <div style="font-size:12px;color:#64748b;">${esc(item.subtitle)}</div>
            </div>
            <span class="badge ${item.lastRating === 'forgot' || (item.daysUntil !== null && item.daysUntil <= 0) ? 'badge-red' : 'badge-medium'}">
              ${item.lastRating === 'forgot' ? 'Oublié' : window.EpiUI.formatDueLabel(item.daysUntil)}
            </span>
          </div>`).join('')
      : `<div style="padding:14px 0;font-size:13.5px;color:#64748b;">Aucune révision programmée pour l’instant. Maîtrisez une leçon ou pratiquez des flashcards pour activer le calendrier espacé (J+1 → J+3 → J+7 → J+14 → J+30).</div>`;

    const weakPreviewHtml = weak.slice(0, 3).map(w => `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid #f1f5f9;">
        <div style="min-width:0;">
          <div style="font-size:13.5px;font-weight:600;color:#0f1e3a;display:flex;align-items:center;gap:6px;">
            <span class="mastery-dot ${w.mastery.color}"></span>
            <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(w.course.code)} · ${esc(w.lesson.title)}</span>
          </div>
          <div style="font-size:12px;color:#64748b;">${esc(w.mastery.reasons[0] || '')}</div>
        </div>
        <button class="btn btn-secondary btn-sm" data-action="go-lesson" data-course="${esc(w.course.id)}" data-lesson="${esc(w.lesson.id)}" data-step="${esc(w.targetStep)}">Pratiquer</button>
      </div>`).join('');

    // Grille des 12 cours (classés par priorité examen puis code)
    const sortedCourses = window.EpiData.courses.slice().sort((a, b) => b.priorityScore - a.priorityScore);
    const coursesHtml = sortedCourses.map(c => renderCourseCard(profile, c)).join('');

    return `
      ${internalReminderHtml}

      <section class="hero-action">
        <div>
          <div class="hero-badge">${icon('sparkle', 14)} Que faire maintenant ? · ${esc(nextAction.badge)}</div>
          <h1>${esc(nextAction.title)}</h1>
          <p>${esc(nextAction.reason)}</p>
        </div>
        <button class="hero-cta-btn" ${heroBtnAttrs}>
          ${esc(nextAction.ctaLabel)} ${icon('arrowRight', 18)}
        </button>
      </section>

      <section class="kpi-grid">
        <div class="kpi-card clickable" data-action="nav" data-route="courses">
          <div class="kpi-top"><span>Progression globale</span>${icon('graduation', 18)}</div>
          <div class="kpi-value">${stats.overallPct} %</div>
          <div class="progress-bar"><div class="progress-fill green" style="width:${stats.overallPct}%"></div></div>
          <div class="kpi-meta">${stats.masteredLessons} / ${stats.totalLessons} leçons maîtrisées (${stats.studiedLessons} étudiée${stats.studiedLessons > 1 ? 's' : ''})</div>
        </div>

        <div class="kpi-card clickable" data-action="nav" data-route="revisions">
          <div class="kpi-top"><span>Révisions à faire</span>${icon('repeat', 18)}</div>
          <div class="kpi-value" style="color:${rev.urgentCount > 0 ? '#dc2626' : '#0f1e3a'};">${rev.urgentCount}</div>
          <div class="kpi-meta">${rev.overdue.length} en retard · ${rev.dueToday.length} aujourd’hui · ${rev.upcoming.length} à venir</div>
        </div>

        <div class="kpi-card clickable" data-action="nav" data-route="weak">
          <div class="kpi-top"><span>Points faibles détectés</span>${icon('alert', 18)}</div>
          <div class="kpi-value" style="color:${redCount > 0 ? '#dc2626' : '#0f1e3a'};">${weak.length}</div>
          <div class="kpi-meta">${redCount} rouge${redCount > 1 ? 's' : ''} (non maîtrisé) · ${orangeCount} orange (partiel)</div>
        </div>

        <div class="kpi-card clickable" data-action="nav" data-route="evolution">
          <div class="kpi-top"><span>Performance QCM & Mémoire</span>${icon('barChart', 18)}</div>
          <div class="kpi-value">${stats.qcmAccuracy !== null ? stats.qcmAccuracy + ' %' : '—'}</div>
          <div class="kpi-meta">
            ${stats.qcmAttempts > 0 ? `${stats.qcmCorrect}/${stats.qcmAttempts} QCM justes` : 'Aucun QCM encore réalisé'}
            · ${stats.fcRetention !== null ? `Mémoire ${stats.fcRetention} %` : '0 flashcard'}
          </div>
        </div>
      </section>

      <section class="two-col">
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">${icon('target', 19)} Mission du jour (${mission.completedTasks}/${mission.totalTasks})</h2>
              <p class="card-subtitle">Choisissez votre temps disponible : votre charge quotidienne s’adapte automatiquement.</p>
            </div>
            <div class="time-selector">${timeBtns}</div>
          </div>
          <div class="progress-bar" style="margin-bottom:8px;">
            <div class="progress-fill ${mission.pct === 100 ? 'green' : ''}" style="width:${mission.pct}%"></div>
          </div>
          <div class="mission-list">${missionTasksHtml}</div>
        </div>

        <div style="display:flex;flex-direction:column;gap:16px;">
          <div class="card">
            <div class="card-header" style="margin-bottom:6px;">
              <h2 class="card-title">${icon('clock', 18)} Rappels de révision (SRS)</h2>
              <button class="btn btn-ghost btn-sm" data-action="nav" data-route="revisions">Tout voir →</button>
            </div>
            ${revPreviewHtml}
          </div>

          <div class="card">
            <div class="card-header" style="margin-bottom:6px;">
              <h2 class="card-title">${icon('alert', 18)} Vos points faibles</h2>
              <button class="btn btn-ghost btn-sm" data-action="nav" data-route="weak">Tout voir →</button>
            </div>
            ${weakPreviewHtml || `<div style="padding:12px 0;font-size:13.5px;color:#64748b;">Aucun point faible enregistré pour le moment. Vos difficultés apparaîtront ici dès vos premiers QCM, flashcards et mini-tests.</div>`}
          </div>
        </div>
      </section>

      ${coursesNeedingRev.length > 0 ? `
        <div class="card" style="margin-bottom:22px;background:#fffbeb;border-color:#fde68a;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
            <div>
              <strong style="color:#92400e;">Cours nécessitant une révision (${coursesNeedingRev.length}) :</strong>
              <span style="font-size:13.5px;color:#78350f;">
                ${coursesNeedingRev.map(c => `${c.code} (${c.shortTitle})`).join(' · ')}
              </span>
            </div>
            <button class="btn btn-warning btn-sm" data-action="nav" data-route="revisions">Réviser maintenant</button>
          </div>
        </div>` : ''}

      <div class="section-heading">
        <span>Mes cours publiés (${window.EpiData.courses.length} cours · ${window.EpiData.modules.length} modules)</span>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-secondary btn-sm" data-action="nav" data-route="priorities">Voir la matrice & priorités</button>
          <button class="btn btn-primary btn-sm" data-action="nav" data-route="courses">Explorer par modules médicaux</button>
        </div>
      </div>

      <div class="courses-grid">${coursesHtml}</div>
    `;
  }

  function renderCourseCard(profile, course) {
    const st = window.EpiPlanner.getCourseStats(profile, course);
    const mod = window.EpiData.modules.find(m => m.id === course.moduleId);
    const lessons = window.EpiUI.asArr(course.lessons);
    const firstTarget = lessons.find(l => !(profile.lessons[l.id] && profile.lessons[l.id].mastered)) || lessons[0];
    const hasUpdated = lessons.some(l => window.EpiStorage.isLessonFlaggedUpdated(profile, l));
    const ctaText = st.completed === st.total && st.total > 0 ? 'Réviser le cours' : (st.inProgress > 0 || st.studied > 0 ? 'Continuer' : 'Commencer à apprendre');
    const fcCount = window.EpiData.flashcards.filter(f => f.courseId === course.id).length;
    const qcmCount = window.EpiData.qcms.filter(q => q.courseId === course.id).length;

    return `
      <article class="course-card">
        <div class="course-card-top">
          <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;">
            <span class="course-code-pill">${esc(course.code)}</span>
            ${mod && mod.subject ? `<span class="badge badge-neutral" style="font-size:11px;">${esc(mod.subject)}</span>` : ''}
          </div>
          <div style="display:flex;gap:5px;flex-wrap:wrap;justify-content:flex-end;">
            ${course.bmCount > 0 || course.vigilance2026 ? window.EpiUI.priorityBadge(course.priority, course.vigilance2026) : ''}
            ${hasUpdated ? `<span class="badge badge-orange">🔄 Mis à jour</span>` : ''}
          </div>
        </div>
        <div>
          <h3>${esc(course.title)}</h3>
          <div class="course-prof">${esc(course.professor || 'Faculté de Médecine')}</div>
        </div>
        <div style="font-size:13px;color:#475569;display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
          ${course.bmCount > 0 ? `<span><strong>${course.bmCount}</strong> QCM BM</span><span>·</span>` : `<span><strong>${fcCount}</strong> flashcards · <strong>${qcmCount}</strong> QCM</span><span>·</span>`}
          <span><strong>${st.total}</strong> leçon${st.total > 1 ? 's' : ''}</span>
          ${st.needsRevision > 0 ? `<span class="badge badge-red" style="padding:1px 8px;">${st.needsRevision} à réviser</span>` : ''}
        </div>
        <div>
          <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:5px;color:#475569;">
            <span>Maîtrise : <strong>${st.completed}/${st.total}</strong> leçons</span>
            <strong style="font-variant-numeric:tabular-nums;">${st.masteryPct} %</strong>
          </div>
          <div class="progress-bar"><div class="progress-fill ${st.masteryPct === 100 ? 'green' : ''}" style="width:${st.masteryPct}%"></div></div>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:auto;padding-top:4px;">
          <button class="btn btn-ghost btn-sm" data-action="go-course" data-course="${esc(course.id)}">Feuille de route</button>
          ${firstTarget ? `<button class="btn btn-primary btn-sm" data-action="go-lesson" data-course="${esc(course.id)}" data-lesson="${esc(firstTarget.id)}" data-step="A">${ctaText}</button>` : ''}
        </div>
      </article>`;
  }

  function renderCourses(profile, filters) {
    const f = filters || { search: '', subject: 'all', moduleId: 'all', priority: 'all', status: 'all' };
    const q = (f.search || '').trim().toLowerCase();
    const subjects = Array.from(new Set(window.EpiData.modules.map(m => m.subject || 'Médecine'))).sort();

    const matchesCourse = (course, mod) => {
      if (f.subject && f.subject !== 'all' && (mod.subject || 'Médecine') !== f.subject) return false;
      if (f.moduleId !== 'all' && course.moduleId !== f.moduleId) return false;
      if (f.priority !== 'all' && course.priority !== f.priority) return false;
      const st = window.EpiPlanner.getCourseStats(profile, course);
      if (f.status === 'revision' && st.needsRevision === 0) return false;
      if (f.status === 'in_progress' && !(st.inProgress > 0 || (st.studied > 0 && st.completed < st.total))) return false;
      if (f.status === 'not_started' && (st.completed > 0 || st.studied > 0 || st.inProgress > 0)) return false;
      if (f.status === 'mastered' && st.completed < st.total) return false;
      if (q) {
        const hay = (course.code + ' ' + course.title + ' ' + (mod.subject || '') + ' ' + (course.professor || '') + ' ' + (course.summary || '') + ' ' + window.EpiUI.asArr(course.lessons).map(l => l.title).join(' ')).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    };

    const modulesHtml = window.EpiData.modules.map(mod => {
      const modCourses = window.EpiData.courses.filter(c => c.moduleId === mod.id && matchesCourse(c, mod));
      if (modCourses.length === 0) return '';
      return `
        <section style="margin-bottom:28px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <span style="width:10px;height:28px;border-radius:4px;background:${mod.accent || '#1d4ed8'};display:inline-block;"></span>
            <div>
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <h2 style="margin:0;font-size:17.5px;color:#0f1e3a;">${esc(mod.code)} — ${esc(mod.title)}</h2>
                <span class="badge badge-medium">${esc(mod.subject || 'Médecine')}</span>
              </div>
              <div style="font-size:13px;color:#64748b;">${esc(mod.description || '')}</div>
            </div>
          </div>
          <div class="courses-grid">
            ${modCourses.map(c => renderCourseCard(profile, c)).join('')}
          </div>
        </section>`;
    }).join('');

    const audit = window.EpiData.bmAudit || {};
    const totalLessons = window.EpiData.courses.reduce((s, c) => s + window.EpiUI.asArr(c.lessons).length, 0);

    return `
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header" style="margin-bottom:12px;">
          <div>
            <h2 class="card-title">${icon('book', 19)} Catalogue de cours médicaux (${window.EpiData.courses.length} cours · ${window.EpiData.modules.length} modules · ${totalLessons} leçons)</h2>
            <p class="card-subtitle">Tous les cours publiés par vos enseignants, organisés par matière et module médical.</p>
          </div>
        </div>
        <div class="filter-bar" style="margin-bottom:0;">
          <input type="search" class="input" style="flex:1;min-width:200px;" placeholder="Rechercher un cours, une matière, un concept…" value="${esc(f.search || '')}" data-filter="courses-search">
          <select class="select" data-filter="courses-subject">
            <option value="all" ${(!f.subject || f.subject === 'all') ? 'selected' : ''}>Toutes les matières (${subjects.length})</option>
            ${subjects.map(s => `<option value="${esc(s)}" ${f.subject === s ? 'selected' : ''}>${esc(s)}</option>`).join('')}
          </select>
          <select class="select" data-filter="courses-module">
            <option value="all" ${f.moduleId === 'all' ? 'selected' : ''}>Tous les modules</option>
            ${window.EpiData.modules.map(m => `<option value="${m.id}" ${f.moduleId === m.id ? 'selected' : ''}>${esc(m.subject || 'Médecine')} · ${esc(m.title)}</option>`).join('')}
          </select>
          <select class="select" data-filter="courses-priority">
            <option value="all" ${f.priority === 'all' ? 'selected' : ''}>Toutes priorités</option>
            <option value="very_high" ${f.priority === 'very_high' ? 'selected' : ''}>Très Haute priorité</option>
            <option value="high" ${f.priority === 'high' ? 'selected' : ''}>Haute priorité</option>
            <option value="medium" ${f.priority === 'medium' ? 'selected' : ''}>Priorité moyenne</option>
            <option value="low" ${f.priority === 'low' ? 'selected' : ''}>Faible / Vigilance</option>
          </select>
          <select class="select" data-filter="courses-status">
            <option value="all" ${f.status === 'all' ? 'selected' : ''}>Tous les statuts</option>
            <option value="revision" ${f.status === 'revision' ? 'selected' : ''}>À réviser</option>
            <option value="in_progress" ${f.status === 'in_progress' ? 'selected' : ''}>En cours</option>
            <option value="not_started" ${f.status === 'not_started' ? 'selected' : ''}>Non commencé</option>
            <option value="mastered" ${f.status === 'mastered' ? 'selected' : ''}>Maîtrisé</option>
          </select>
        </div>
      </div>

      ${modulesHtml || `<div class="card empty-state">Aucun cours publié ne correspond à vos filtres actuels. <br><button class="btn btn-secondary btn-sm" style="margin-top:12px;" data-action="reset-course-filters">Réinitialiser les filtres</button></div>`}

      ${audit.actualVerifiedCount ? `
        <div class="alert alert-info" style="margin-top:18px;">
          ${icon('shield', 19)}
          <div>
            <strong>Transparence documentaire (Épidémiologie BM 2026) :</strong> sur les <strong>${audit.actualVerifiedCount} questions</strong> réellement présentes dans la BM 2026, <strong>${audit.matchedTo12Courses}</strong> correspondent aux 12 cours initiaux et <strong>${audit.outOfCourseVisible + audit.missingScanQuestions}</strong> portent sur d’autres chapitres.
            <button class="btn btn-ghost btn-sm" style="padding:2px 8px;margin-left:6px;" data-action="nav" data-route="priorities">Voir l’audit BM complet →</button>
          </div>
        </div>` : ''}
    `;
  }

  function renderPriorities(profile, activeTab) {
    const tab = activeTab || 'matrix';
    const flat = window.EpiPlanner.getAllLessonsFlat().sort((a, b) => b.lesson.priorityScore - a.lesson.priorityScore);
    const audit = window.EpiData.bmAudit;

    let bodyHtml = '';
    if (tab === 'matrix') {
      const rowsHtml = flat.map((x, idx) => {
        const m = window.EpiSRS.getLessonMastery(profile, x.lesson);
        let actionTxt = 'Étudier';
        let step = 'A';
        if (m.level === 'red') { actionTxt = 'Corriger d’urgence'; step = 'B'; }
        else if (m.level === 'orange') { actionTxt = 'Valider le mini-test'; step = 'E'; }
        else if (m.level === 'green') { actionTxt = 'Réviser (SRS)'; step = 'C'; }

        return `
          <tr>
            <td style="font-weight:700;color:#64748b;">#${idx + 1}</td>
            <td><strong>${esc(x.course.code)}</strong><br><span style="font-size:12px;color:#64748b;">${esc(x.course.shortTitle)}</span></td>
            <td>
              <div style="font-weight:600;color:#0f1e3a;">${esc(x.lesson.title)}</div>
              <div style="font-size:12px;color:#64748b;">${esc(x.lesson.sourceRef)}</div>
            </td>
            <td style="font-variant-numeric:tabular-nums;">
              <strong>${x.lesson.bmCount} QCM</strong>
              ${x.lesson.bmRefs.length ? `<div style="font-size:11.5px;color:#64748b;">${esc(x.lesson.bmRefs.slice(0, 2).join(', '))}</div>` : `<div style="font-size:11.5px;color:#64748b;">Non tombé en BM 2012–2025</div>`}
            </td>
            <td>
              ${window.EpiUI.priorityBadge(x.lesson.priority, x.course.vigilance2026 && x.lesson.bmCount === 0)}
              <div style="font-size:11.5px;color:#64748b;margin-top:3px;">Score : ${x.lesson.priorityScore}/100</div>
            </td>
            <td>${window.EpiUI.masteryBadge(m)}</td>
            <td>
              <button class="btn btn-secondary btn-sm" data-action="go-lesson" data-course="${esc(x.course.id)}" data-lesson="${esc(x.lesson.id)}" data-step="${step}">${actionTxt}</button>
            </td>
          </tr>`;
      }).join('');

      bodyHtml = `
        <div class="alert alert-info">
          ${icon('target', 19)}
          <div>
            <strong>Distinction essentielle :</strong> cette matrice sépare clairement <strong>(1) la fréquence réelle dans la BM</strong> (données comptées), <strong>(2) l’importance du cours</strong> (ex. C8 CMD et C5 Instr. 2024–2026 à 0 QCM en BM mais à forte vigilance 2026) et <strong>(3) votre niveau personnel de maîtrise</strong>. Aucun sujet basse fréquence n’est masqué.
          </div>
        </div>
        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Rang</th>
                <th>Cours</th>
                <th>Leçon / Sujet</th>
                <th>Fréquence BM</th>
                <th>Priorité Examen</th>
                <th>Votre maîtrise</th>
                <th>Action recommandée</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>`;
    } else if (tab === 'errors') {
      const errRows = window.EpiData.bmErrors.map((e, i) => `
        <tr>
          <td><strong>#${i + 1}</strong></td>
          <td><span class="badge badge-bm">${esc(e.bmRef)}</span><br><span style="font-size:12px;color:#64748b;">${esc(e.courseId)}</span></td>
          <td><strong>${esc(e.topic)}</strong><div style="font-size:12.5px;color:#475569;margin-top:4px;">${esc(e.reason)}</div><div style="font-size:11.5px;color:#64748b;margin-top:3px;">Source : ${esc(e.courseProof)}</div></td>
          <td><span class="badge badge-red">❌ BM : ${esc(e.bmAnswer)}</span></td>
          <td><span class="badge badge-green">✅ Cours : ${esc(e.courseAnswer)}</span></td>
          <td><button class="btn btn-secondary btn-sm" data-action="go-lesson" data-course="${esc(e.courseId)}" data-lesson="${esc(e.lessonId)}" data-step="D">Pratiquer</button></td>
        </tr>`).join('');

      bodyHtml = `
        <div class="alert alert-danger">
          ${icon('alert', 19)}
          <div><strong>Attention critique :</strong> ne mémorisez jamais aveuglément le « Corrigé type » de la BM ! Voici les <strong>12 erreurs ou contradictions majeures</strong> détectées en croisant la BM avec les supports officiels de vos professeurs.</div>
        </div>
        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr><th>#</th><th>Réf. BM</th><th>Sujet & Preuve du cours</th><th>Corrigé BM</th><th>Vraie réponse</th><th>Action</th></tr>
            </thead>
            <tbody>${errRows}</tbody>
          </table>
        </div>`;
    } else {
      const outRows = window.EpiData.outOfCourseBM.map(o => `
        <tr>
          <td><strong>${esc(o.chapters)}</strong></td>
          <td style="font-weight:700;font-variant-numeric:tabular-nums;">${o.count} QCM</td>
          <td style="color:#475569;">${esc(o.note)}</td>
        </tr>`).join('');

      bodyHtml = `
        <div class="alert alert-warning">
          ${icon('shield', 19)}
          <div>
            <strong>Audit exhaustif de la BM 2026 :</strong> ${audit.matchedTo12Courses} QCM correspondent à vos 12 cours fournis + ${audit.outOfCourseVisible} QCM visibles hors cours fournis + ${audit.missingScanQuestions} QCM manquants sur la page livret 184/273 absente du scan = <strong>${audit.actualVerifiedCount} QCM exacts</strong> (couverture : « +772 »). Vérifiez auprès de votre promotion si les chapitres ci-dessous figurent à votre session.
          </div>
        </div>
        <div class="data-table-wrap">
          <table class="data-table">
            <thead><tr><th>Chapitres BM non présents dans votre dossier de cours</th><th>Volume BM</th><th>Remarque</th></tr></thead>
            <tbody>${outRows}</tbody>
          </table>
        </div>`;
    }

    return `
      <div class="card">
        <div class="card-header" style="margin-bottom:8px;">
          <div>
            <h2 class="card-title">${icon('target', 19)} Priorités d’examen & Audit BM Épidémiologie 2026</h2>
            <p class="card-subtitle">Priorisez votre temps intelligemment à partir des preuves réelles de la banque d’examens Batna (2012–2025).</p>
          </div>
        </div>
        <div class="tabs-row">
          <button class="tab-btn ${tab === 'matrix' ? 'active' : ''}" data-action="priorities-tab" data-tab="matrix">Matrice des ${flat.length} leçons</button>
          <button class="tab-btn ${tab === 'errors' ? 'active' : ''}" data-action="priorities-tab" data-tab="errors">⚠️ ${(window.EpiData.bmErrors || []).length} Erreurs du corrigé BM</button>
          <button class="tab-btn ${tab === 'out' ? 'active' : ''}" data-action="priorities-tab" data-tab="out">Hors cours fournis</button>
        </div>
        ${bodyHtml}
      </div>`;
  }

  return { renderDashboard, renderCourses, renderPriorities };
})();
