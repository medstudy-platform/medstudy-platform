/* ==========================================================================
   Vues Outils : Mes révisions (SRS), Mes points faibles, Banque QCM & Évolution
   ========================================================================== */
window.EpiViewsTools = (function () {
  const esc = (s) => window.EpiUI.esc(s);
  const icon = (n, s) => window.EpiIcons.get(n, s);

  // ==================== MES RÉVISIONS (SRS) ====================
  function renderRevisions(profile, runtime) {
    const rev = window.EpiSRS.getRevisionsSummary(profile);
    const session = runtime.revSession;

    // Si une session de révision SRS est active
    if (session && session.active) {
      return renderRevisionSession(session);
    }

    const renderList = (items, emptyMsg, badgeMode) => {
      if (!items.length) return `<div style="padding:14px 0;font-size:13.5px;color:var(--text-light);">${emptyMsg}</div>`;
      return items.map(it => `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 0;border-bottom:1px solid var(--border);flex-wrap:wrap;">
          <div style="min-width:0;flex:1;">
            <div style="font-weight:600;font-size:14px;color:var(--navy);">
              <span class="badge ${it.kind === 'lesson' ? 'badge-medium' : 'badge-neutral'}" style="margin-right:6px;">${it.kind === 'lesson' ? 'Leçon' : 'Flashcard'}</span>
              ${esc(it.title)}
            </div>
            <div style="font-size:12.5px;color:var(--text-light);margin-top:2px;">
              ${esc(it.subtitle)} ${it.intervalDays ? `· Intervalle actuel : J+${it.intervalDays}` : ''}
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="badge ${badgeMode === 'red' ? 'badge-red' : (badgeMode === 'green' ? 'badge-green' : 'badge-medium')}">
              ${it.lastRating === 'forgot' ? 'Oublié' : window.EpiUI.formatDueLabel(it.daysUntil)}
            </span>
            <button class="btn btn-secondary btn-sm" data-action="go-lesson" data-course="${esc(it.course.id)}" data-lesson="${esc(it.lesson.id)}" data-step="${it.kind === 'lesson' ? 'E' : 'C'}">Ouvrir</button>
          </div>
        </div>`).join('');
    };

    const masteredHtml = rev.mastered.length
      ? rev.mastered.map(m => `
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);">
            <div>
              <strong style="font-size:14px;color:var(--sem-green);">✓ ${esc(m.course.code)} · ${esc(m.lesson.title)}</strong>
              <div style="font-size:12px;color:var(--text-light);">Prochaine révision : ${m.srs ? window.EpiUI.formatDueLabel(window.EpiSRS.daysUntil(m.srs.nextReviewAt)) : 'Programmée'}</div>
            </div>
            <button class="btn btn-ghost btn-sm" data-action="go-lesson" data-course="${esc(m.course.id)}" data-lesson="${esc(m.lesson.id)}" data-step="C">Consolider</button>
          </div>`).join('')
      : `<div style="padding:14px 0;font-size:13.5px;color:var(--text-light);">Aucune leçon encore maîtrisée. Validez un mini-test (≥ 80 %) pour remplir cette liste !</div>`;

    const updatedLessons = [];
    window.EpiData.courses.forEach(c => {
      window.EpiUI.asArr(c.lessons).forEach(l => {
        if (window.EpiStorage.isLessonFlaggedUpdated(profile, l)) {
          updatedLessons.push({ course: c, lesson: l });
        }
      });
    });

    const updatedBoxHtml = updatedLessons.length > 0 ? `
      <div class="card" style="margin-bottom:20px;background:var(--orange-soft);border:1.5px solid var(--orange-border);">
        <div class="card-header" style="margin-bottom:10px;">
          <div>
            <h3 class="card-title" style="color:var(--sem-amber);">🔄 Leçons mises à jour par l’enseignant (${updatedLessons.length})</h3>
            <p class="card-subtitle" style="color:var(--sem-amber);">Votre progression antérieure a été préservée ; relisez ces leçons pour intégrer les modifications récentes.</p>
          </div>
        </div>
        ${updatedLessons.map(u => `
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid var(--orange-border);flex-wrap:wrap;">
            <div>
              <strong style="color:var(--navy);">${esc(u.course.code)} · ${esc(u.lesson.title)}</strong>
              <div style="font-size:12.5px;color:var(--sem-amber);">${esc(u.lesson.majorUpdateNote || 'Modification majeure de contenu — révision recommandée.')}</div>
            </div>
            <button class="btn btn-warning btn-sm" data-action="go-lesson" data-course="${esc(u.course.id)}" data-lesson="${esc(u.lesson.id)}" data-step="A">Revoir la leçon →</button>
          </div>`).join('')}
      </div>` : '';

    return `
      <div class="alert alert-info">
        ${icon('bell', 18)}
        <div>
          <strong>Notifications & rappels internes :</strong> les rappels de révision s’affichent directement dans l’application (barre supérieure et cette page). <em>Aucune notification externe (e-mail ou push) n’est configurée.</em>
        </div>
      </div>

      ${updatedBoxHtml}

      <div class="card" style="margin-bottom:20px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
          <div>
            <h2 class="card-title">${icon('repeat', 20)} Système de Répétition Espacée (SRS)</h2>
            <p class="card-subtitle">Calendrier adaptatif automatique : <strong>J+1 → J+3 → J+7 → J+14 → J+30</strong>. Un oubli ramène la notion immédiatement ; une bonne maîtrise allonge l’intervalle.</p>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button class="btn btn-primary btn-lg" data-action="srs-start-session" data-mode="urgent" ${rev.urgentCount === 0 ? 'disabled' : ''}>
              Lancer la révision urgente (${rev.urgentCount})
            </button>
            <button class="btn btn-secondary" data-action="srs-start-session" data-mode="practice">
              Session de consolidation libre (8 cartes)
            </button>
          </div>
        </div>

        <div class="kpi-grid" style="margin:18px 0 0;grid-template-columns:repeat(5,1fr);">
          <div style="background:var(--red-soft);border:1px solid var(--red-border);border-radius:10px;padding:12px;">
            <div style="font-size:12px;color:var(--sem-red);font-weight:600;">En retard</div>
            <div style="font-size:22px;font-weight:800;color:var(--red);">${rev.overdue.length}</div>
          </div>
          <div style="background:var(--orange-soft);border:1px solid var(--orange-border);border-radius:10px;padding:12px;">
            <div style="font-size:12px;color:var(--sem-amber);font-weight:600;">Dues aujourd’hui</div>
            <div style="font-size:22px;font-weight:800;color:var(--orange);">${rev.dueToday.length}</div>
          </div>
          <div style="background:var(--red-soft);border:1px solid var(--red-border);border-radius:10px;padding:12px;">
            <div style="font-size:12px;color:var(--sem-red);font-weight:600;">Concepts oubliés</div>
            <div style="font-size:22px;font-weight:800;color:var(--red);">${rev.forgotten.length}</div>
          </div>
          <div style="background:var(--primary-soft);border:1px solid var(--primary-border);border-radius:10px;padding:12px;">
            <div style="font-size:12px;color:var(--sem-blue);font-weight:600;">À venir</div>
            <div style="font-size:22px;font-weight:800;color:var(--sem-blue);">${rev.upcoming.length}</div>
          </div>
          <div style="background:var(--green-soft);border:1px solid var(--green-border);border-radius:10px;padding:12px;">
            <div style="font-size:12px;color:var(--sem-green);font-weight:600;">Sujets maîtrisés</div>
            <div style="font-size:22px;font-weight:800;color:var(--green);">${rev.mastered.length}</div>
          </div>
        </div>
      </div>

      <div class="two-col">
        <div style="display:flex;flex-direction:column;gap:16px;">
          <div class="card">
            <h3 class="card-title" style="margin-bottom:8px;">🔴 Révisions en retard & Concepts oubliés (${rev.overdue.length + rev.forgotten.length})</h3>
            ${renderList([...rev.overdue, ...rev.forgotten], 'Aucun retard ni concept oublié — continuez ainsi !', 'red')}
          </div>
          <div class="card">
            <h3 class="card-title" style="margin-bottom:8px;">🟠 Révisions dues aujourd’hui (${rev.dueToday.length})</h3>
            ${renderList(rev.dueToday, 'Aucune révision programmée exactement pour aujourd’hui.', 'orange')}
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:16px;">
          <div class="card">
            <h3 class="card-title" style="margin-bottom:8px;">📅 Révisions à venir (${rev.upcoming.length})</h3>
            ${renderList(rev.upcoming.slice(0, 10), 'Les prochaines échéances (J+1, J+3, J+7, J+14, J+30) apparaîtront ici dès vos premières validations.', 'blue')}
          </div>
          <div class="card">
            <h3 class="card-title" style="margin-bottom:8px;">🟢 Sujets maîtrisés avec succès (${rev.mastered.length})</h3>
            ${masteredHtml}
          </div>
        </div>
      </div>
    `;
  }

  function renderRevisionSession(session) {
    if (session.idx >= session.items.length) {
      return `
        <div class="card" style="max-width:680px;margin:20px auto;text-align:center;padding:34px;">
          <div style="font-size:40px;margin-bottom:8px;">🎯</div>
          <h2 style="margin:0 0 8px;color:var(--navy);">Session de révision terminée !</h2>
          <p style="color:var(--text-muted);margin-bottom:20px;">
            Vous avez révisé <strong>${session.items.length} carte(s)</strong> :
            <strong>${session.knew}</strong> sue(s) ✅ · <strong>${session.partial}</strong> partielle(s) 🟠 · <strong>${session.forgot}</strong> oubliée(s) 🔴.
            Vos intervalles SRS (J+1 → J+30) ont été mis à jour automatiquement.
          </p>
          <button class="btn btn-primary btn-lg" data-action="srs-end-session">Retour à Mes révisions</button>
        </div>`;
    }

    const item = session.items[session.idx];
    return `
      <div class="card" style="max-width:740px;margin:0 auto;">
        <div class="card-header">
          <div>
            <h2 class="card-title">${icon('repeat', 19)} Session de révision active (${session.idx + 1} / ${session.items.length})</h2>
            <p class="card-subtitle">${esc(item.courseCode)} · ${esc(item.lessonTitle)}</p>
          </div>
          <button class="btn btn-ghost btn-sm" data-action="srs-end-session">Quitter</button>
        </div>
        <div class="progress-bar" style="margin-bottom:18px;">
          <div class="progress-fill" style="width:${Math.round((session.idx / session.items.length) * 100)}%"></div>
        </div>

        <div class="edu-recall-stage">
          <div class="edu-fc-q-zone">
            <h4 class="edu-h4" style="margin:0 0 6px;">Question de révision SRS</h4>
            <div class="edu-fc-question">${window.EpiFormat ? window.EpiFormat.enhanceInlineText(item.card.question, { skipLeadTerm: true }) : esc(item.card.question)}</div>
          </div>
          <div class="edu-fc-work-zone">
          ${!session.revealed ? `
            <button type="button" class="btn btn-primary btn-lg" style="width:100%;" data-action="srs-reveal">Révéler la réponse</button>
          ` : `
            <div>
              <div class="edu-fc-a-zone">
                <div class="edu-callout-head" style="margin-bottom:6px;">
                  <span class="edu-callout-tag">${icon('checkCircle', 14)}<span>Réponse exacte (source cours)</span></span>
                </div>
                <div class="edu-callout-body">${window.EpiFormat ? window.EpiFormat.renderRichAnswer(item.card.answer) : esc(item.card.answer)}</div>
                ${item.card.hint ? `<div class="edu-fc-hint"><strong>💡 Repère :</strong> ${window.EpiFormat ? window.EpiFormat.enhanceInlineText(item.card.hint, { skipLeadTerm: true }) : esc(item.card.hint)}</div>` : ''}
              </div>
              <div class="rating-row" style="margin-top:16px;">
                <button type="button" class="btn btn-success" data-action="srs-rate" data-rating="knew">✅ Je le savais</button>
                <button type="button" class="btn btn-warning" data-action="srs-rate" data-rating="partial">🟠 Partiellement</button>
                <button type="button" class="btn btn-danger" data-action="srs-rate" data-rating="forgot">🔴 J’ai oublié</button>
              </div>
            </div>
          `}
          </div>
        </div>
      </div>`;
  }

  // ==================== MES POINTS FAIBLES ====================
  function renderWeakPoints(profile, filterLevel) {
    const fl = filterLevel || 'all';
    const weak = window.EpiSRS.getWeakPoints(profile);
    const flat = window.EpiPlanner.getAllLessonsFlat();
    let greenCnt = 0, orangeCnt = 0, redCnt = 0, unstartedCnt = 0;
    flat.forEach(x => {
      const l = window.EpiSRS.getLessonMastery(profile, x.lesson).level;
      if (l === 'green') greenCnt++;
      else if (l === 'orange') orangeCnt++;
      else if (l === 'red') redCnt++;
      else unstartedCnt++;
    });

    const filtered = weak.filter(w => fl === 'all' || w.mastery.level === fl);

    // QCM récemment ratés
    const failedQcms = window.EpiData.qcms.filter(q => profile.qcms[q.id] && profile.qcms[q.id].lastCorrect === false);

    const listHtml = filtered.length
      ? filtered.map(w => `
          <div class="card" style="margin-bottom:12px;border-left:4px solid ${w.mastery.level === 'red' ? 'var(--red)' : 'var(--orange)'};">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap;">
              <div style="flex:1;min-width:250px;">
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
                  <span class="course-code-pill">${esc(w.course.code)}</span>
                  ${window.EpiUI.masteryBadge(w.mastery)}
                  ${window.EpiUI.priorityBadge(w.lesson.priority)}
                </div>
                <h3 style="margin:0 0 6px;font-size:16px;color:var(--navy);">${esc(w.lesson.title)}</h3>
                <div style="font-size:13.5px;color:var(--text-muted);margin-bottom:6px;">
                  <strong>Pourquoi vous bloquez :</strong> ${esc(w.mastery.reasons.join(' · '))}
                </div>
                <div style="font-size:13.5px;color:var(--sem-blue);">
                  <strong>Révision recommandée :</strong> ${esc(w.recommendedAction)}
                </div>
              </div>
              <div style="display:flex;flex-direction:column;gap:8px;flex-shrink:0;">
                <button class="btn btn-primary btn-sm" data-action="go-lesson" data-course="${esc(w.course.id)}" data-lesson="${esc(w.lesson.id)}" data-step="${esc(w.targetStep)}">
                  Pratiquer à nouveau →
                </button>
                <button class="btn btn-ghost btn-sm" data-action="go-lesson" data-course="${esc(w.course.id)}" data-lesson="${esc(w.lesson.id)}" data-step="A">
                  Relire la leçon
                </button>
              </div>
            </div>
          </div>`).join('')
      : `<div class="card empty-state">
           <strong style="color:var(--navy);">Aucun point faible dans cette catégorie.</strong><br>
           <span style="font-size:13.5px;">Vos difficultés apparaîtront automatiquement dès que vous répondrez à des QCM, flashcards ou mini-tests.</span>
         </div>`;

    return `
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header">
          <div>
            <h2 class="card-title">${icon('alert', 19)} Suivi Mémoire & Mes points faibles</h2>
            <p class="card-subtitle">Chaque sujet évolue dynamiquement en Rouge, Orange ou Vert selon vos résultats réels en QCM, flashcards et mini-tests.</p>
          </div>
          ${failedQcms.length > 0 ? `<button class="btn btn-danger btn-sm" data-action="qcm-go-failed">Refaire mes ${failedQcms.length} QCM ratés →</button>` : ''}
        </div>
        <div class="kpi-grid" style="margin:0;grid-template-columns:repeat(4,1fr);">
          <div style="background:var(--red-soft);border:1px solid var(--red-border);border-radius:10px;padding:12px;">
            <div style="font-size:12px;font-weight:700;color:var(--sem-red);">🔴 Rouge — Non maîtrisé</div>
            <div style="font-size:22px;font-weight:800;color:var(--red);">${redCnt}</div>
          </div>
          <div style="background:var(--orange-soft);border:1px solid var(--orange-border);border-radius:10px;padding:12px;">
            <div style="font-size:12px;font-weight:700;color:var(--sem-amber);">🟠 Orange — Partiel</div>
            <div style="font-size:22px;font-weight:800;color:var(--orange);">${orangeCnt}</div>
          </div>
          <div style="background:var(--green-soft);border:1px solid var(--green-border);border-radius:10px;padding:12px;">
            <div style="font-size:12px;font-weight:700;color:var(--sem-green);">🟢 Vert — Bien maîtrisé</div>
            <div style="font-size:22px;font-weight:800;color:var(--green);">${greenCnt}</div>
          </div>
          <div style="background:var(--surface-soft);border:1px solid var(--border);border-radius:10px;padding:12px;">
            <div style="font-size:12px;font-weight:700;color:var(--text-muted);">⚪ Non commencé</div>
            <div style="font-size:22px;font-weight:800;color:var(--text-muted);">${unstartedCnt}</div>
          </div>
        </div>
      </div>

      <div class="filter-bar">
        <button class="time-pill ${fl === 'all' ? 'active' : ''}" data-action="weak-filter" data-level="all">Tous (${weak.length})</button>
        <button class="time-pill ${fl === 'red' ? 'active' : ''}" data-action="weak-filter" data-level="red">🔴 Non maîtrisé (${redCnt})</button>
        <button class="time-pill ${fl === 'orange' ? 'active' : ''}" data-action="weak-filter" data-level="orange">🟠 Partiellement maîtrisé (${orangeCnt})</button>
      </div>

      ${listHtml}
    `;
  }

  // ==================== BANQUE QCM & SIMULATION D'EXAMEN ====================
  function renderQcmArena(profile, runtime) {
    const exam = runtime.examSim;
    if (exam && exam.active) {
      return renderExamSimulation(exam);
    }

    const f = runtime.qcmFilters || { courseId: 'all', sourceType: 'all', special: 'all' };
    const filtered = window.EpiData.qcms.filter(q => {
      if (f.courseId !== 'all' && q.courseId !== f.courseId) return false;
      if (f.sourceType === 'bm_original' && q.sourceType !== 'bm_original') return false;
      if (f.sourceType === 'ai_generated' && q.sourceType === 'bm_original') return false;
      if (f.sourceType !== 'all' && f.sourceType !== 'bm_original' && f.sourceType !== 'ai_generated' && q.sourceType !== f.sourceType) return false;
      if (f.special === 'bm_errors' && !q.bmError) return false;
      if (f.special === 'needs_review' && !q.needsReview) return false;
      if (f.special === 'failed' && !(profile.qcms[q.id] && profile.qcms[q.id].lastCorrect === false)) return false;
      if (f.special === 'unanswered' && (profile.qcms[q.id] && profile.qcms[q.id].attempts > 0)) return false;
      return true;
    });

    const limit = runtime.qcmLimit || 15;
    const shown = filtered.slice(0, limit);

    const cardsHtml = shown.map((q, idx) => {
      const st = runtime.arenaQcms[q.id] || { selected: [], submitted: false, isCorrect: false };
      return window.EpiUI.renderQcmCard(q, st, { prefix: 'arena', number: idx + 1, showLessonLink: true });
    }).join('');

    return `
      <div class="card" style="margin-bottom:20px;background:linear-gradient(135deg,#0f1e3a,#1b3668);color:#fff;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
          <div>
            <h2 style="margin:0 0 6px;font-size:19px;color:#fff;">Mode Simulation d’Examen Chronométrée</h2>
            <p style="margin:0;font-size:14px;color:#cbd5e1;">Entraînez-vous dans les conditions réelles de l’examen de Batna 2 avec correction détaillée par cours.</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="hero-cta-btn" style="padding:9px 16px;font-size:13.5px;" data-action="exam-start" data-count="10">Express (10 QCM)</button>
            <button class="hero-cta-btn" style="padding:9px 16px;font-size:13.5px;" data-action="exam-start" data-count="20">Standard (20 QCM)</button>
            <button class="hero-cta-btn" style="padding:9px 16px;font-size:13.5px;" data-action="exam-start" data-count="30">Examen complet (30 QCM)</button>
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom:18px;">
        <div class="card-header" style="margin-bottom:10px;">
          <div>
            <h2 class="card-title">${icon('clipboard', 19)} Banque QCM interactive (${filtered.length} / ${window.EpiData.qcms.length} questions)</h2>
            <p class="card-subtitle">Distinction transparente entre originaux BM Épidémiologie et nouveaux QCM générés depuis vos cours.</p>
          </div>
        </div>
        <div class="filter-bar" style="margin-bottom:0;">
          <select class="select" data-filter="qcm-course">
            <option value="all" ${f.courseId === 'all' ? 'selected' : ''}>Tous les cours (${window.EpiData.courses.length})</option>
            ${window.EpiData.courses.map(c => `<option value="${c.id}" ${f.courseId === c.id ? 'selected' : ''}>${esc(c.code)} — ${esc(c.shortTitle)}</option>`).join('')}
          </select>
          <select class="select" data-filter="qcm-source">
            <option value="all" ${f.sourceType === 'all' ? 'selected' : ''}>Toutes sources</option>
            <option value="bm_original" ${f.sourceType === 'bm_original' ? 'selected' : ''}>BM Épidémiologie (Originaux)</option>
            <option value="ai_generated" ${f.sourceType === 'ai_generated' ? 'selected' : ''}>🤖 Questions générées par IA (Cours / 2026)</option>
          </select>
          <select class="select" data-filter="qcm-special">
            <option value="all" ${f.special === 'all' ? 'selected' : ''}>Toutes les questions</option>
            <option value="bm_errors" ${f.special === 'bm_errors' ? 'selected' : ''}>⚠️ Pièges avec erreur corrigé BM</option>
            <option value="needs_review" ${f.special === 'needs_review' ? 'selected' : ''}>🔎 Nuances / Relecture signalée</option>
            <option value="failed" ${f.special === 'failed' ? 'selected' : ''}>🔴 Mes QCM ratés</option>
            <option value="unanswered" ${f.special === 'unanswered' ? 'selected' : ''}>Non encore répondus</option>
          </select>
        </div>
      </div>

      ${cardsHtml || `<div class="card empty-state">Aucune question ne correspond à ces filtres.</div>`}

      ${filtered.length > shown.length ? `
        <div style="text-align:center;margin-top:16px;">
          <button class="btn btn-secondary" data-action="qcm-load-more">Afficher plus de questions (${filtered.length - shown.length} restantes)</button>
        </div>` : ''}
    `;
  }

  function renderExamSimulation(exam) {
    const answered = exam.questions.filter(q => (exam.answers[q.id] || []).length > 0).length;
    const elapsedSec = Math.floor(((exam.endedAt || Date.now()) - exam.startedAt) / 1000);
    const mm = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
    const ss = String(elapsedSec % 60).padStart(2, '0');

    let summaryHtml = '';
    if (exam.submitted) {
      summaryHtml = `
        <div class="card" style="margin-bottom:20px;border:2px solid ${exam.scorePct >= 80 ? 'var(--green)' : (exam.scorePct >= 50 ? 'var(--orange)' : 'var(--red)')};">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
            <div>
              <h2 style="margin:0 0 6px;color:var(--navy);">Résultat de la simulation : ${exam.scorePct} % (${exam.correctCount} / ${exam.questions.length})</h2>
              <div style="font-size:14px;color:var(--text-muted);">Durée : ${mm}:${ss} · Toutes vos erreurs ont été automatiquement remontées dans « Mes points faibles ».</div>
            </div>
            <button class="btn btn-primary" data-action="exam-exit">Retour à la Banque QCM</button>
          </div>
        </div>`;
    }

    const qHtml = exam.questions.map((q, idx) => {
      const sel = exam.answers[q.id] || [];
      const isCorr = exam.submitted && window.EpiViewsLesson.arraysEqualSet(sel, q.correct);
      return window.EpiUI.renderQcmCard(q, { selected: sel, submitted: exam.submitted, isCorrect: isCorr }, { prefix: 'exam', number: idx + 1, hideSubmit: true, showLessonLink: exam.submitted });
    }).join('');

    return `
      <div class="card" style="margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
        <div>
          <h2 class="card-title">${icon('clock', 19)} Simulation d’examen (${exam.questions.length} QCM)</h2>
          <p class="card-subtitle">Répondues : ${answered}/${exam.questions.length} · Temps écoulé : <strong id="exam-timer">${mm}:${ss}</strong></p>
        </div>
        <button class="btn btn-ghost btn-sm" data-action="exam-exit">Quitter la simulation</button>
      </div>

      ${summaryHtml}
      ${qHtml}

      ${!exam.submitted ? `
        <div class="card" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <span>Vous avez répondu à <strong>${answered} / ${exam.questions.length}</strong> questions.</span>
          <button class="btn btn-primary btn-lg" data-action="exam-submit">Corriger toute la simulation</button>
        </div>` : ''}
    `;
  }

  // ==================== MON ÉVOLUTION & PROFILS ====================
  function renderEvolution(profile) {
    const stats = window.EpiPlanner.getGlobalStats(profile);
    const lvl = window.EpiGamification.getLevelInfo(profile.xp);
    const weekly = window.EpiGamification.getWeeklyActivity(profile);
    const unlockedMap = new Map((profile.badgesUnlocked || []).map(b => [b.id, b.unlockedAt]));

    const badgesHtml = window.EpiGamification.BADGES.map(b => {
      const unlockedAt = unlockedMap.get(b.id);
      return `
        <div class="badge-card ${unlockedAt ? 'unlocked' : 'locked'}">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="width:36px;height:36px;border-radius:10px;background:${unlockedAt ? 'var(--primary-soft)' : 'var(--border)'};color:${unlockedAt ? 'var(--sem-blue)' : 'var(--text-light)'};display:flex;align-items:center;justify-content:center;">
              ${icon(b.icon, 20)}
            </span>
            <span class="badge ${unlockedAt ? 'badge-green' : 'badge-neutral'}">${unlockedAt ? 'Débloqué' : 'À débloquer'}</span>
          </div>
          <strong style="font-size:14.5px;color:var(--navy);margin-top:4px;">${esc(b.title)}</strong>
          <div style="font-size:12.5px;color:var(--text-light);">${esc(b.description)}</div>
          ${unlockedAt ? `<div style="font-size:11.5px;color:var(--green);margin-top:auto;">Obtenu le ${window.EpiUI.formatDateFR(unlockedAt)}</div>` : ''}
        </div>`;
    }).join('');

    const milestonesHtml = window.EpiData.courses.map(c => {
      const st = window.EpiPlanner.getCourseStats(profile, c);
      return `
        <div style="display:flex;align-items:center;gap:14px;padding:9px 0;border-bottom:1px solid var(--border);">
          <span class="course-code-pill" style="min-width:42px;text-align:center;">${esc(c.code)}</span>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;justify-content:space-between;font-size:13.5px;margin-bottom:4px;">
              <strong style="color:var(--navy);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(c.title)}</strong>
              <span style="color:var(--text-muted);font-variant-numeric:tabular-nums;">${st.completed}/${st.total} (${st.masteryPct}%)</span>
            </div>
            <div class="progress-bar"><div class="progress-fill ${st.masteryPct === 100 ? 'green' : ''}" style="width:${st.masteryPct}%"></div></div>
          </div>
        </div>`;
    }).join('');

    const historyHtml = (profile.examHistory || []).length
      ? `<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Date</th><th>Évaluation</th><th>Score</th></tr></thead><tbody>${profile.examHistory.slice().reverse().slice(0, 12).map(h => `
          <tr>
            <td>${window.EpiUI.formatDateFR(h.date)}</td>
            <td><strong>${esc(h.label)}</strong></td>
            <td><span class="badge ${h.scorePct >= 80 ? 'badge-green' : (h.scorePct >= 50 ? 'badge-orange' : 'badge-red')}">${h.scorePct} % (${h.correct}/${h.total})</span></td>
          </tr>`).join('')}</tbody></table></div>`
      : `<div style="font-size:13.5px;color:var(--text-light);padding:12px 0;">Aucun mini-test ou simulation enregistré pour l’instant.</div>`;

    return `
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-top"><span>Niveau & Expérience</span>${icon('award', 18)}</div>
          <div class="kpi-value" style="font-size:20px;">Niv. ${lvl.current.level} · ${profile.xp} XP</div>
          <div class="progress-bar"><div class="progress-fill" style="width:${lvl.progressPct}%"></div></div>
          <div class="kpi-meta">${esc(lvl.current.name)} ${lvl.next ? `(${lvl.xpToNext} XP avant Niv. ${lvl.next.level})` : '(Niveau max atteint !)'}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-top"><span>Série quotidienne</span>${icon('flame', 18)}</div>
          <div class="kpi-value">${profile.streak.count} j</div>
          <div class="kpi-meta">Record personnel : <strong>${profile.streak.best} jour${profile.streak.best > 1 ? 's' : ''}</strong></div>
        </div>
        <div class="kpi-card">
          <div class="kpi-top"><span>Meilleur score Quiz</span>${icon('trending', 18)}</div>
          <div class="kpi-value">${profile.personalBestQuiz > 0 ? profile.personalBestQuiz + ' %' : '—'}</div>
          <div class="kpi-meta">${(profile.examHistory || []).length} évaluation(s) complétée(s)</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-top"><span>Cours complétés</span>${icon('graduation', 18)}</div>
          <div class="kpi-value">${stats.coursesCompleted} / ${stats.totalCourses}</div>
          <div class="kpi-meta">${stats.masteredLessons} / ${stats.totalLessons} leçons maîtrisées</div>
        </div>
      </div>

      <div class="two-col">
        <div class="card">
          <h3 class="card-title" style="margin-bottom:4px;">${icon('barChart', 18)} Progression hebdomadaire (7 derniers jours)</h3>
          <p class="card-subtitle">Activité réelle mesurée en XP gagnés par jour.</p>
          ${window.EpiIcons.weeklyChart(weekly)}
        </div>
        <div class="card">
          <h3 class="card-title" style="margin-bottom:8px;">${icon('clipboard', 18)} Historique des mini-tests & simulations</h3>
          ${historyHtml}
        </div>
      </div>

      <div class="card" style="margin-bottom:22px;">
        <h3 class="card-title" style="margin-bottom:14px;">${icon('award', 18)} Badges de réussite (${unlockedMap.size} / ${window.EpiGamification.BADGES.length})</h3>
        <div class="badges-grid">${badgesHtml}</div>
      </div>

      <div class="card" style="margin-bottom:22px;">
        <h3 class="card-title" style="margin-bottom:10px;">${icon('graduation', 18)} Jalons de complétion des cours (${window.EpiData.courses.length})</h3>
        ${milestonesHtml}
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">${icon('user', 18)} Compte personnel & Sauvegarde</h3>
            <p class="card-subtitle">${window.EpiStorage.isServerMode() ? 'Votre progression est synchronisée automatiquement avec votre compte MedStudy sur le serveur.' : 'Vos progrès sont sauvegardés localement dans votre navigateur.'} Exportez une sauvegarde JSON à tout moment.</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${!window.EpiStorage.isServerMode() ? '<button class="btn btn-secondary btn-sm" data-action="open-profile-modal">Gérer / Changer de profil</button>' : '<button class="btn btn-danger btn-sm" data-action="reset-profile">Réinitialiser ma progression</button>'}
            <button class="btn btn-secondary btn-sm" data-action="export-backup">${icon('download', 15)} Exporter JSON</button>
            <label class="btn btn-secondary btn-sm" style="cursor:pointer;">
              ${icon('upload', 15)} Importer JSON
              <input type="file" accept=".json,application/json" style="display:none;" data-action="import-backup">
            </label>
          </div>
        </div>
      </div>
    `;
  }

  return { renderRevisions, renderWeakPoints, renderQcmArena, renderEvolution };
})();
