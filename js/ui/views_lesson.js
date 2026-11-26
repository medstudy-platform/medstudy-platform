/* ==========================================================================
   Vues Cours & Studio de Leçon (Feuille de route + 5 Étapes A → B → C → D → E)
   ========================================================================== */
window.EpiViewsLesson = (function () {
  const esc = (s) => window.EpiUI.esc(s);
  const asArr = (v) => window.EpiUI.asArr(v);
  const icon = (n, s) => window.EpiIcons.get(n, s);

  const FC_TYPE_LABELS = {
    definition: 'Définition',
    cloze: 'Compléter la phrase',
    list: 'Liste / Énumération',
    difference: 'Expliquer la différence',
    formula: 'Formule / Seuil clé',
    short_answer: 'Réponse courte'
  };

  function getMiniTestQuestions(course, lesson, catalog) {
    const src = catalog || window.EpiData;
    const allQ = asArr(src.qcms);
    const own = allQ.filter(q => q.lessonId === lesson.id);
    if (own.length >= 4) return own.slice(0, 5);
    const extras = allQ
      .filter(q => q.courseId === course.id && q.lessonId !== lesson.id)
      .sort((a, b) => (b.isHard ? 1 : 0) - (a.isHard ? 1 : 0));
    return own.concat(extras.slice(0, Math.max(0, 4 - own.length)));
  }

  function renderPreviewBanner(course) {
    return `
      <div class="alert alert-info" style="background:#eef2ff;border-color:#a5b4fc;color:#312e81;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:10px;">
          ${icon('shield', 18)}
          <div>
            <strong>👁 Mode Prévisualisation Administrateur (Vue Étudiant identique)</strong> —
            Statut actuel : ${window.EpiUI.statusBadge(course.status)}
            ${course.status !== 'published' ? ' · <em>Ce cours brouillon reste totalement invisible pour les étudiants tant que vous ne le publiez pas.</em>' : ''}
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button type="button" class="btn btn-secondary btn-sm" data-action="admin-open-editor" data-cid="${esc(course.id)}">${icon('edit', 14)} Modifier dans l’éditeur</button>
          ${course.status !== 'published' ? `<button type="button" class="btn btn-success btn-sm" data-action="admin-set-status" data-cid="${esc(course.id)}" data-status="published">Publier le cours</button>` : ''}
          <button type="button" class="btn btn-navy btn-sm" data-action="admin-exit-preview">← Retour au CMS</button>
        </div>
      </div>`;
  }

  function renderCourseOverview(profile, courseId, opts) {
    const o = opts || {};
    const catalog = o.catalog || window.EpiData;
    const isPreview = !!o.isPreview;
    const course = asArr(catalog.courses).find(c => c.id === courseId);
    if (!course) return `<div class="card empty-state">Cours introuvable.</div>`;
    const st = window.EpiPlanner.getCourseStats(profile, course);
    const lessonsArr = asArr(course.lessons);
    const nextTarget = lessonsArr.find(l => !(profile.lessons[l.id] && profile.lessons[l.id].mastered)) || lessonsArr[0];
    const openAction = isPreview ? 'admin-preview-lesson' : 'go-lesson';

    const roadmapHtml = lessonsArr.map((lesson, idx) => {
      const lRec = profile.lessons[lesson.id];
      const m = window.EpiSRS.getLessonMastery(profile, lesson);
      const srs = profile.lessonSrs[lesson.id];
      const fcCount = asArr(catalog.flashcards).filter(f => f.lessonId === lesson.id).length;
      const qcmCount = asArr(catalog.qcms).filter(q => q.lessonId === lesson.id).length;
      const isUpdated = window.EpiStorage.isLessonFlaggedUpdated(profile, lesson);

      let stateLabel = 'Non commencée';
      let stateCls = 'badge-neutral';
      if (lRec && lRec.mastered) { stateLabel = 'Maîtrisée ✅'; stateCls = 'badge-green'; }
      else if (lRec && lRec.studied) { stateLabel = 'Étudiée (à maîtriser)'; stateCls = 'badge-orange'; }
      else if (lRec && lRec.status === 'in_progress') { stateLabel = 'En cours'; stateCls = 'badge-medium'; }

      return `
        <div class="roadmap-item ${isUpdated ? 'roadmap-updated' : ''}">
          <div style="display:flex;align-items:flex-start;gap:14px;min-width:0;flex:1;">
            <div style="width:34px;height:34px;border-radius:10px;background:${lRec && lRec.mastered ? '#059669' : '#eff6ff'};color:${lRec && lRec.mastered ? '#fff' : '#1d4ed8'};font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              ${lRec && lRec.mastered ? '✓' : idx + 1}
            </div>
            <div style="min-width:0;flex:1;">
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">
                <strong style="font-size:15px;color:#0f1e3a;">${esc(lesson.title)}</strong>
                <span class="badge ${stateCls}">${stateLabel}</span>
                ${lesson.slideRange ? `<span class="badge badge-neutral">${esc(lesson.slideRange)}</span>` : ''}
                ${isPreview && lesson.hasManualFlags ? `<span class="badge badge-vigilance">Relecture recommandée</span>` : ''}
                ${isUpdated ? `<span class="badge badge-orange">🔄 Contenu mis à jour — révision conseillée</span>` : ''}
                ${course.bmCount > 0 || lesson.bmCount > 0 ? window.EpiUI.priorityBadge(lesson.priority, course.vigilance2026 && lesson.bmCount === 0) : ''}
              </div>
              <div style="font-size:13px;color:#64748b;display:flex;flex-wrap:wrap;gap:12px;">
                <span>${esc(lesson.sourceRef || 'Support de cours')}</span>
                <span>· ~${lesson.durationMin || 10} min</span>
                ${lesson.bmCount > 0 ? `<span>· <strong>${lesson.bmCount}</strong> QCM BM</span>` : ''}
                <span>· ${fcCount} flashcards · ${qcmCount} QCM</span>
                ${lRec && lRec.miniTestBest !== null ? `<span>· Meilleur mini-test : <strong>${lRec.miniTestBest} %</strong></span>` : ''}
                ${srs && srs.nextReviewAt ? `<span>· Prochaine révision : <strong>${window.EpiUI.formatDueLabel(window.EpiSRS.daysUntil(srs.nextReviewAt))}</strong></span>` : ''}
              </div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:10px;flex-shrink:0;">
            ${window.EpiUI.masteryBadge(m)}
            <button class="btn btn-primary btn-sm" data-action="${openAction}" data-course="${esc(course.id)}" data-lesson="${esc(lesson.id)}" data-step="A">
              ${isPreview ? 'Prévisualiser' : (isUpdated ? 'Revoir MAJ' : (lRec && lRec.mastered ? 'Réviser' : (lRec && lRec.status === 'in_progress' ? 'Continuer' : 'Étudier')))}
            </button>
          </div>
        </div>`;
    }).join('');

    const mod = asArr(catalog.modules).find(m => m.id === course.moduleId);
    const attachments = asArr(course.attachments);
    const attachmentsHtml = attachments.length > 0 ? `
      <div style="margin-top:14px;padding-top:14px;border-top:1px solid #e2e8f0;">
        <div style="font-size:12.5px;font-weight:700;color:#475569;margin-bottom:8px;">Supports originaux joints (${attachments.length}) :</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${attachments.map(att => {
            const unit = att.kind === 'primary_ppt' ? 'diapos' : 'p.';
            return `
            <a class="btn btn-secondary btn-sm" href="${window.EpiAPI.fileUrl(att.id)}" target="_blank" rel="noopener">
              ${icon('fileText', 14)} ${esc(att.originalName)} ${att.pageCount ? `(${att.pageCount} ${unit})` : ''}
            </a>`;
          }).join('')}
        </div>
      </div>` : '';

    return `
      ${isPreview ? renderPreviewBanner(course) : `
        <div style="margin-bottom:14px;">
          <button class="btn btn-ghost btn-sm" data-action="nav" data-route="courses">${icon('arrowLeft', 16)} Retour à Mes cours</button>
        </div>`}

      <div class="card" style="margin-bottom:20px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;">
          <div style="flex:1;min-width:260px;">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
              <span class="course-code-pill">${esc(course.code)}</span>
              ${mod && mod.subject ? `<span class="badge badge-neutral">${esc(mod.subject)}</span>` : ''}
              ${course.pptImport && course.pptImport.isPowerPoint ? `<span class="badge badge-medium">PowerPoint · ${course.pptImport.slidesProcessed} diapos</span>` : ''}
              ${course.bmCount > 0 || course.vigilance2026 ? window.EpiUI.priorityBadge(course.priority, course.vigilance2026) : ''}
              ${course.bmCount > 0 ? `<span class="badge badge-bm">${course.bmCount} QCM dans la BM</span>` : ''}
            </div>
            <h1 style="margin:0 0 6px;font-size:22px;color:#0f1e3a;">${esc(course.title)}</h1>
            <p style="margin:0 0 8px;font-size:14px;color:#475569;">${esc(course.summary || '')}</p>
            <div style="font-size:12.5px;color:#64748b;">
              <strong>Enseignant :</strong> ${esc(course.professor || 'Faculté de Médecine')}
              ${asArr(course.sourceFiles).length ? ` · <strong>Source(s) :</strong> ${esc(asArr(course.sourceFiles).join(' ; '))}` : ''}
              ${course.bmSharedNote ? `<br><strong>Note BM :</strong> ${esc(course.bmSharedNote)}` : ''}
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
            ${window.EpiIcons.progressRing(st.masteryPct, 82, st.masteryPct === 100 ? '#059669' : '#2563eb')}
            ${nextTarget ? `<button class="btn btn-primary" data-action="${openAction}" data-course="${esc(course.id)}" data-lesson="${esc(nextTarget.id)}" data-step="A">
              ${isPreview ? 'Prévisualiser la 1ère leçon →' : (st.completed === st.total ? 'Réviser ce cours' : 'Lancer la prochaine leçon →')}
            </button>` : ''}
          </div>
        </div>
        ${attachmentsHtml}

        <div class="kpi-grid" style="margin:18px 0 0;grid-template-columns:repeat(4,1fr);">
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;">
            <div style="font-size:12px;color:#64748b;font-weight:600;">Leçons terminées</div>
            <div style="font-size:20px;font-weight:800;color:#059669;">${st.completed}</div>
          </div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;">
            <div style="font-size:12px;color:#64748b;font-weight:600;">Leçons restantes</div>
            <div style="font-size:20px;font-weight:800;color:#0f1e3a;">${st.remaining}</div>
          </div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;">
            <div style="font-size:12px;color:#64748b;font-weight:600;">Sujets bien maîtrisés</div>
            <div style="font-size:20px;font-weight:800;color:#059669;">${st.green}</div>
          </div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;">
            <div style="font-size:12px;color:#64748b;font-weight:600;">Sujets à réviser</div>
            <div style="font-size:20px;font-weight:800;color:${st.needsRevision > 0 ? '#dc2626' : '#0f1e3a'};">${st.needsRevision}</div>
          </div>
        </div>
      </div>

      <h2 class="section-heading" style="margin-top:6px;">Feuille de route du cours (${lessonsArr.length} leçons)</h2>
      <div class="roadmap-list">${roadmapHtml || '<div class="card empty-state">Aucune leçon disponible dans ce cours pour le moment.</div>'}</div>
    `;
  }

  function renderLessonStudio(profile, courseId, lessonId, activeStep, runtime, opts) {
    const o = opts || {};
    const catalog = o.catalog || window.EpiData;
    const isPreview = !!o.isPreview;
    const course = asArr(catalog.courses).find(c => c.id === courseId);
    const lesson = course ? asArr(course.lessons).find(l => l.id === lessonId) : null;
    if (!course || !lesson) return `<div class="card empty-state">Leçon introuvable.</div>`;

    const lRec = window.EpiStorage.ensureLessonRecord(profile, lesson.id);
    const mastery = window.EpiSRS.getLessonMastery(profile, lesson);
    const lessonCards = asArr(catalog.flashcards).filter(f => f.lessonId === lesson.id);
    const lessonQcms = asArr(catalog.qcms).filter(q => q.lessonId === lesson.id);
    const memEvidence = window.EpiSRS.hasCompletedMemorizationEvidence(profile, lesson);

    const step = activeStep || 'A';
    const backAction = isPreview ? 'admin-preview-course' : 'go-course';
    const switchLessonAction = isPreview ? 'admin-preview-lesson' : 'go-lesson';

    const doneA = lRec.stepAVisited;
    const doneB = lRec.memCheckedIds.length > 0 || lRec.memDeclaredAll;
    const doneC = lessonCards.filter(c => profile.flashcards[c.id] && profile.flashcards[c.id].totalReviews > 0).length >= Math.min(2, lessonCards.length);
    const doneD = lessonQcms.some(q => profile.qcms[q.id] && profile.qcms[q.id].attempts > 0);
    const doneE = lRec.miniTestBest !== null && lRec.miniTestBest >= 80;

    const stepsMeta = [
      { key: 'A', letter: 'Étape A', name: 'Comprendre', done: doneA },
      { key: 'B', letter: 'Étape B', name: 'À mémoriser', done: doneB },
      { key: 'C', letter: 'Étape C', name: `Rappel actif (${lessonCards.length})`, done: doneC },
      { key: 'D', letter: 'Étape D', name: `QCM (${lessonQcms.length})`, done: doneD },
      { key: 'E', letter: 'Étape E', name: 'Mini-test (≥80%)', done: doneE }
    ];

    const stepperHtml = stepsMeta.map(s => `
      <button type="button" class="step-tab ${step === s.key ? 'active' : ''} ${s.done ? 'done-step' : ''}" data-action="lesson-step" data-step="${s.key}">
        <span class="step-letter">${s.letter} ${s.done ? '✓' : ''}</span>
        <span class="step-name">${s.name}</span>
      </button>`).join('');

    let stepBody = '';
    if (step === 'A') stepBody = renderStepA(lesson);
    else if (step === 'B') stepBody = renderStepB(lesson, lRec);
    else if (step === 'C') stepBody = renderStepC(profile, lesson, lessonCards, runtime);
    else if (step === 'D') stepBody = renderStepD(lesson, lessonQcms, runtime);
    else stepBody = renderStepE(profile, course, lesson, lRec, memEvidence, runtime, catalog);

    const otherLessonsBtns = asArr(course.lessons).map((l, i) => `
      <button type="button" class="time-pill ${l.id === lesson.id ? 'active' : ''}" data-action="${switchLessonAction}" data-course="${esc(course.id)}" data-lesson="${esc(l.id)}" data-step="A">
        ${i + 1}. ${esc(l.slideRange || l.id)}
      </button>`).join('');

    const isUpdated = window.EpiStorage.isLessonFlaggedUpdated(profile, lesson);
    const updateBannerHtml = isUpdated ? `
      <div class="alert alert-warning" style="align-items:center;justify-content:space-between;flex-wrap:wrap;">
        <div style="display:flex;align-items:flex-start;gap:10px;">
          ${icon('refresh', 19)}
          <div>
            <strong>🔄 Contenu mis à jour (révision conseillée — v${lesson.revisionVersion || 2}) :</strong>
            ${esc(lesson.majorUpdateNote || 'L’enseignant a apporté une modification majeure à cette leçon. Votre progression antérieure a été entièrement conservée.')}
          </div>
        </div>
        <button type="button" class="btn btn-warning btn-sm" data-action="ack-lesson-update" data-lesson="${esc(lesson.id)}">
          ✓ J’ai pris connaissance de la mise à jour
        </button>
      </div>` : '';

    return `
      ${isPreview ? renderPreviewBanner(course) : ''}
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:14px;">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-ghost btn-sm" data-action="${backAction}" data-course="${esc(course.id)}">${icon('arrowLeft', 16)} ${esc(course.code)} · ${esc(course.shortTitle)}</button>
          <span style="color:#cbd5e1;">/</span>
          <span style="font-size:13.5px;font-weight:600;color:#475569;">${esc(lesson.slideRange || ('Leçon ' + lesson.id))}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <div class="time-selector">${otherLessonsBtns}</div>
          ${!isPreview ? `<button type="button" class="btn ${lRec.studied ? 'btn-success' : 'btn-secondary'} btn-sm" data-action="toggle-studied" data-lesson="${esc(lesson.id)}">
            ${lRec.studied ? '✓ Marquée comme étudiée' : 'Marquer comme étudiée'}
          </button>` : ''}
        </div>
      </div>

      ${updateBannerHtml}

      <div class="card" style="margin-bottom:16px;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap;">
          <div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              ${course.bmCount > 0 || lesson.bmCount > 0 ? window.EpiUI.priorityBadge(lesson.priority, course.vigilance2026 && lesson.bmCount === 0) : ''}
              ${window.EpiUI.masteryBadge(mastery)}
              ${lesson.slideRange ? `<span class="badge badge-medium">${esc(lesson.slideRange)}</span>` : ''}
              ${lesson.bmCount > 0 ? `<span class="badge badge-bm">${lesson.bmCount} QCM BM</span>` : ''}
              ${lRec.mastered && mastery.level === 'green' ? `<span class="badge badge-green">🏆 Leçon maîtrisée</span>` : ''}
              ${lRec.mastered && mastery.level !== 'green' ? `<span class="badge badge-orange">⚠️ Mini-test validé — révision recommandée</span>` : ''}
              ${isUpdated ? `<span class="badge badge-orange">🔄 Mise à jour à revoir</span>` : ''}
            </div>
            <h1 style="margin:0 0 4px;font-size:21px;color:#0f1e3a;">${esc(lesson.title)}</h1>
            <div style="font-size:13px;color:#64748b;">
              <strong>Source :</strong> ${esc(lesson.sourceRef || 'Support de cours')} · <strong>Durée estimée :</strong> ~${lesson.durationMin || 10} min
              ${asArr(lesson.bmRefs).length ? ` · <strong>Réf. BM :</strong> ${esc(asArr(lesson.bmRefs).join(', '))}` : ''}
            </div>
          </div>
          <div style="font-size:12.5px;color:#475569;text-align:right;">
            <div>Critères de maîtrise :</div>
            <div>${doneA ? '✅' : '○'} Étudiée · ${memEvidence ? '✅' : '○'} Rappel actif · ${doneE ? '✅' : '○'} Mini-test ≥ 80 %</div>
          </div>
        </div>
      </div>

      ${lesson.bmWarning ? `<div class="alert alert-danger">${icon('alert', 19)}<div>${esc(lesson.bmWarning)}</div></div>` : ''}
      ${isPreview && lesson.hasManualFlags && lesson.extractionNote ? `<div class="alert alert-warning">${icon('alert', 18)}<div><strong>Point de vigilance import PowerPoint :</strong> ${esc(lesson.extractionNote)}</div></div>` : ''}

      <div class="stepper-bar">${stepperHtml}</div>

      <div>${stepBody}</div>
    `;
  }

  // ---- ÉTAPE A : COMPRENDRE ----
  function renderStepA(lesson) {
    const u = lesson.understand || { intro: '', sections: [], tables: [], darija: '', triad: { toUnderstand: [], toMemorize: [], toRecognizeInQcm: [] } };
    const sectionsHtml = asArr(u.sections).map(sec => `
      <div style="margin-top:18px;">
        <h3 style="margin:0 0 8px;font-size:16.5px;color:#0f1e3a;">${esc(sec.heading)}</h3>
        ${asArr(sec.paragraphs).map(p => `<p style="margin:0 0 8px;color:#334155;">${p}</p>`).join('')}
        ${asArr(sec.bullets).length ? `<ul style="margin:6px 0 0;padding-left:20px;color:#1e293b;">${asArr(sec.bullets).map(b => `<li style="margin-bottom:6px;">${b}</li>`).join('')}</ul>` : ''}
      </div>`).join('');

    const tablesHtml = asArr(u.tables).map(tbl => `
      <div style="margin-top:20px;">
        <h4 style="margin:0 0 8px;font-size:14.5px;color:#0f1e3a;">${esc(tbl.title)}</h4>
        <div class="data-table-wrap">
          <table class="data-table">
            <thead><tr>${asArr(tbl.headers).map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>
            <tbody>${asArr(tbl.rows).map(r => `<tr>${asArr(r).map((cell, ci) => `<td>${ci === 0 ? `<strong>${esc(cell)}</strong>` : esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>
        </div>
      </div>`).join('');

    const triad = u.triad || { toUnderstand: [], toMemorize: [], toRecognizeInQcm: [] };

    return `
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">${icon('book', 19)} Étape A — Ce qu’il faut comprendre</h2>
            <p class="card-subtitle">Explication claire fidèle au cours du professeur, structurée pour l’examen.</p>
          </div>
        </div>
        <p style="font-size:15px;color:#1e293b;margin-top:0;">${esc(u.intro || '')}</p>
        ${sectionsHtml}
        ${tablesHtml}
        ${u.darija ? `
          <div class="darija-box">
            <div class="darija-box-title">${icon('sparkle', 15)} Explication simplifiée en Darija algérienne (باش تفهم بالخف)</div>
            <p>${u.darija}</p>
          </div>` : ''}

        <div class="triad-grid">
          <div class="triad-card understand">
            <h4>💡 Ce que tu dois comprendre</h4>
            <ul>${asArr(triad.toUnderstand).map(i => `<li>${esc(i)}</li>`).join('')}</ul>
          </div>
          <div class="triad-card memorize">
            <h4>📌 Ce que tu dois mémoriser</h4>
            <ul>${asArr(triad.toMemorize).map(i => `<li>${esc(i)}</li>`).join('')}</ul>
          </div>
          <div class="triad-card qcm">
            <h4>🎯 Ce qu’il faut reconnaître en QCM</h4>
            <ul>${asArr(triad.toRecognizeInQcm).map(i => `<li>${esc(i)}</li>`).join('')}</ul>
          </div>
        </div>

        <div style="margin-top:22px;display:flex;justify-content:flex-end;">
          <button class="btn btn-primary btn-lg" data-action="lesson-step" data-step="B">
            Passer à l’Étape B : À mémoriser ${icon('arrowRight', 18)}
          </button>
        </div>
      </div>`;
  }

  // ---- ÉTAPE B : À MÉMORISER ----
  function renderStepB(lesson, lRec) {
    const items = lesson.memorize || [];
    const checkedSet = new Set(lRec.memCheckedIds || []);
    const checkedCount = items.filter(i => checkedSet.has(i.id)).length;

    const cardsHtml = items.map(item => {
      const isChecked = checkedSet.has(item.id);
      return `
        <div class="mem-card ${item.highlight ? 'highlight' : ''} ${isChecked ? 'checked' : ''}">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <span class="badge ${item.highlight ? 'badge-medium' : 'badge-neutral'}">${esc(item.category || 'Notion clé')}</span>
              ${item.pageRef ? `<span class="badge badge-neutral">${esc(item.pageRef)}</span>` : ''}
            </div>
            ${item.highlight ? '<span style="font-size:11.5px;font-weight:700;color:#2563eb;">★ Essentiel examen</span>' : ''}
          </div>
          <strong style="font-size:15px;color:#0f1e3a;">${esc(item.title)}</strong>
          <div style="font-size:14px;color:#1e293b;line-height:1.55;">${item.content}</div>
          <div style="margin-top:auto;padding-top:8px;">
            <button type="button" class="btn ${isChecked ? 'btn-success' : 'btn-secondary'} btn-sm" data-action="toggle-mem-item" data-lesson="${esc(lesson.id)}" data-mid="${esc(item.id)}">
              ${isChecked ? '✓ Mémorisé (à vérifier en Étape C)' : 'J’ai mémorisé ceci'}
            </button>
          </div>
        </div>`;
    }).join('');

    return `
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">${icon('bookmark', 19)} Étape B — Ce que tu DOIS mémoriser (${checkedCount}/${items.length})</h2>
            <p class="card-subtitle">Définitions exactes, classifications, formules, seuils et distinctions incontournables.</p>
          </div>
          <button type="button" class="btn ${lRec.memDeclaredAll ? 'btn-success' : 'btn-navy'}" data-action="declare-mem-all" data-lesson="${esc(lesson.id)}">
            ${lRec.memDeclaredAll ? '✓ Section déclarée mémorisée' : 'J’ai mémorisé cette section'}
          </button>
        </div>

        <div class="alert alert-info">
          ${icon('brain', 18)}
          <div><strong>Règle pédagogique :</strong> cliquer sur « J’ai mémorisé ceci » enregistre votre auto-déclaration, mais <strong>ne valide pas la maîtrise</strong>. Votre mémoire sera réellement vérifiée par les flashcards de rappel actif (Étape C) et le mini-test (Étape E, ≥ 80 %).</div>
        </div>

        <div class="mem-grid">${cardsHtml}</div>

        <div style="margin-top:22px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;">
          <button class="btn btn-secondary" data-action="lesson-step" data-step="A">${icon('arrowLeft', 16)} Revoir Étape A</button>
          <button class="btn btn-primary btn-lg" data-action="lesson-step" data-step="C">
            Vérifier par Rappel actif (Étape C) ${icon('arrowRight', 18)}
          </button>
        </div>
      </div>`;
  }

  // ---- ÉTAPE C : RAPPEL ACTIF (FLASHCARDS) ----
  function renderStepC(profile, lesson, cards, runtime) {
    if (!cards.length) {
      return `<div class="card empty-state">Aucune flashcard disponible pour cette leçon.</div>`;
    }
    const fcState = runtime.flashcard || { idx: 0, revealed: false, draft: '', doneCount: 0 };
    const idx = Math.min(fcState.idx, cards.length - 1);
    const card = cards[idx];
    const rec = profile.flashcards[card.id];
    const reviewedInLesson = cards.filter(c => profile.flashcards[c.id] && profile.flashcards[c.id].totalReviews > 0).length;

    return `
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">${icon('brain', 19)} Étape C — Rappel actif (Flashcards interactives)</h2>
            <p class="card-subtitle">Formulez votre réponse avant de révéler la correction. Votre auto-évaluation pilote la répétition espacée.</p>
          </div>
          <span class="badge ${reviewedInLesson === cards.length ? 'badge-green' : 'badge-medium'}">
            ${reviewedInLesson} / ${cards.length} cartes pratiquées
          </span>
        </div>

        <div class="flashcard-stage">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;font-size:13px;color:#64748b;">
            <span>Carte <strong>${idx + 1}</strong> sur <strong>${cards.length}</strong></span>
            <div style="display:flex;gap:6px;">
              ${cards.map((c, ci) => {
                const cr = profile.flashcards[c.id];
                const col = !cr ? '#e2e8f0' : (cr.lastRating === 'knew' ? '#059669' : (cr.lastRating === 'partial' ? '#d97706' : '#dc2626'));
                return `<button type="button" data-action="fc-jump" data-idx="${ci}" title="Carte ${ci + 1}" style="width:26px;height:8px;border-radius:99px;border:${ci === idx ? '2px solid #0f1e3a' : 'none'};background:${col};"></button>`;
              }).join('')}
            </div>
          </div>

          <div class="flashcard-box">
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                  <span class="badge badge-medium">${esc(FC_TYPE_LABELS[card.type] || 'Rappel actif')}</span>
                  ${card.pageRef ? `<span class="badge badge-neutral">${esc(card.pageRef)}</span>` : ''}
                </div>
                ${rec ? `<span style="font-size:12px;color:#64748b;">Dernier retour : <strong>${rec.lastRating === 'knew' ? 'Su ✅' : (rec.lastRating === 'partial' ? 'Partiel 🟠' : 'Oublié 🔴')}</strong> · Prochaine : ${window.EpiUI.formatDueLabel(window.EpiSRS.daysUntil(rec.nextReviewAt))}</span>` : '<span style="font-size:12px;color:#64748b;">Nouvelle carte</span>'}
              </div>
              <div class="flashcard-q">${esc(card.question)}</div>
            </div>

            ${!fcState.revealed ? `
              <div>
                <textarea class="input" rows="2" style="width:100%;resize:vertical;margin-bottom:12px;" placeholder="Essayez d’écrire ou de formuler mentalement votre réponse avant de révéler…" data-action="fc-draft">${esc(fcState.draft || '')}</textarea>
                <button type="button" class="btn btn-primary btn-lg" style="width:100%;" data-action="fc-reveal">
                  Révéler la réponse
                </button>
              </div>
            ` : `
              <div>
                <div class="flashcard-a">
                  <div style="font-size:12px;font-weight:700;text-transform:uppercase;color:#1d4ed8;margin-bottom:4px;">Réponse exacte (source cours)</div>
                  <div>${esc(card.answer)}</div>
                  ${card.hint ? `<div style="margin-top:8px;font-size:13px;color:#475569;"><em>💡 Repère examen : ${esc(card.hint)}</em></div>` : ''}
                </div>
                <div style="margin-top:14px;font-size:13px;font-weight:600;color:#475569;margin-bottom:8px;text-align:center;">
                  Évaluez honnêtement votre rappel pour programmer votre révision :
                </div>
                <div class="rating-row">
                  <button type="button" class="btn btn-success" data-action="fc-rate" data-cid="${esc(card.id)}" data-rating="knew">✅ Je le savais</button>
                  <button type="button" class="btn btn-warning" data-action="fc-rate" data-cid="${esc(card.id)}" data-rating="partial">🟠 Partiellement souvenu</button>
                  <button type="button" class="btn btn-danger" data-action="fc-rate" data-cid="${esc(card.id)}" data-rating="forgot">🔴 J’ai oublié</button>
                </div>
              </div>
            `}
          </div>
        </div>

        <div style="margin-top:24px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;">
          <button class="btn btn-secondary" data-action="lesson-step" data-step="B">${icon('arrowLeft', 16)} Revoir Étape B</button>
          <button class="btn btn-primary btn-lg" data-action="lesson-step" data-step="D">
            Passer à l’Étape D : Entraînement QCM ${icon('arrowRight', 18)}
          </button>
        </div>
      </div>`;
  }

  // ---- ÉTAPE D : ENTRAÎNEMENT QCM ----
  function renderStepD(lesson, qcms, runtime) {
    // Priorité aux originaux BM en premier
    const ordered = qcms.slice().sort((a, b) => (a.sourceType === 'bm_original' ? -1 : 1) - (b.sourceType === 'bm_original' ? -1 : 1));
    const bmCnt = ordered.filter(q => q.sourceType === 'bm_original').length;
    const genCnt = ordered.length - bmCnt;

    const cardsHtml = ordered.map((q, idx) => {
      const st = runtime.lessonQcms[q.id] || { selected: [], submitted: false, isCorrect: false };
      return window.EpiUI.renderQcmCard(q, st, { prefix: 'lessonq', number: idx + 1 });
    }).join('');

    return `
      <div class="card" style="margin-bottom:18px;">
        <div class="card-header" style="margin-bottom:6px;">
          <div>
            <h2 class="card-title">${icon('clipboard', 19)} Étape D — Entraînement QCM ciblé (${ordered.length} questions)</h2>
            <p class="card-subtitle">${bmCnt} question${bmCnt > 1 ? 's' : ''} originale${bmCnt > 1 ? 's' : ''} BM Épidémiologie + ${genCnt} nouveau${genCnt > 1 ? 'x' : ''} QCM généré${genCnt > 1 ? 's' : ''} depuis le cours.</p>
          </div>
          <button class="btn btn-secondary btn-sm" data-action="lesson-qcm-reset">Réinitialiser mes réponses</button>
        </div>
      </div>

      ${cardsHtml}

      <div style="margin-top:20px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;">
        <button class="btn btn-secondary" data-action="lesson-step" data-step="C">${icon('arrowLeft', 16)} Revoir Flashcards</button>
        <button class="btn btn-primary btn-lg" data-action="lesson-step" data-step="E">
          Tester mes connaissances (Mini-test Étape E) ${icon('arrowRight', 18)}
        </button>
      </div>`;
  }

  // ---- ÉTAPE E : MINI-TEST & COMPLÉTION INTELLIGENTE ----
  function renderStepE(profile, course, lesson, lRec, memEvidence, runtime, catalog) {
    const questions = getMiniTestQuestions(course, lesson, catalog);
    if (!questions.length) {
      return `
        <div class="card empty-state">
          <strong>Aucun QCM disponible pour ce mini-test pour le moment.</strong><br>
          <span style="font-size:13.5px;">Ajoutez ou validez des QCM depuis l’espace Administration CMS pour activer le mini-test de cette leçon.</span>
        </div>`;
    }
    const mt = runtime.miniTest || { answers: {}, submitted: false, scorePct: 0, correctCount: 0, newlyMastered: false };
    const answeredCount = questions.filter(q => (mt.answers[q.id] || []).length > 0).length;

    let resultBanner = '';
    if (mt.submitted) {
      const nextRec = window.EpiPlanner.getNextLessonInCourse(profile, course.id, lesson.id);
      if (mt.scorePct >= 80 && memEvidence) {
        const srs = profile.lessonSrs[lesson.id];
        resultBanner = `
          <div class="card" style="background:linear-gradient(135deg,#ecfdf5,#f0fdfa);border:1.5px solid #6ee7b7;margin-bottom:20px;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
              <div style="flex:1;min-width:260px;">
                <span class="badge badge-green" style="margin-bottom:8px;">🏆 Score : ${mt.scorePct} % (${mt.correctCount}/${questions.length}) · LEÇON MAÎTRISÉE</span>
                <h2 style="margin:4px 0 6px;color:#065f46;font-size:19px;">
                  Bravo ! Tu as terminé cette leçon. Mais attention : pour ne pas oublier, tu dois la réviser régulièrement.
                </h2>
                <p style="margin:0;font-size:14px;color:#047857;">
                  Ta répétition espacée est programmée automatiquement : <strong>1ère révision prévue ${srs ? window.EpiUI.formatDueLabel(window.EpiSRS.daysUntil(srs.nextReviewAt)) : 'dans 1 jour (J+1)'}</strong> (puis J+3 → J+7 → J+14 → J+30).
                </p>
              </div>
              <div style="display:flex;flex-direction:column;gap:8px;">
                ${nextRec ? `<button class="btn btn-success btn-lg" data-action="go-lesson" data-course="${esc(nextRec.course.id)}" data-lesson="${esc(nextRec.lesson.id)}" data-step="A">Prochaine leçon recommandée →</button>` : ''}
                <button class="btn btn-secondary btn-sm" data-action="minitest-retry">Refaire le mini-test</button>
              </div>
            </div>
          </div>`;
      } else if (mt.scorePct >= 80 && !memEvidence) {
        resultBanner = `
          <div class="alert alert-warning" style="margin-bottom:20px;align-items:center;justify-content:space-between;flex-wrap:wrap;">
            <div>
              <strong>Excellent score : ${mt.scorePct} % (${mt.correctCount}/${questions.length}) !</strong><br>
              Pour que la leçon soit officiellement marquée <strong>Maîtrisée</strong> et planifiée en répétition espacée, complétez d’abord vos exercices de mémorisation / rappel actif (au moins 2 flashcards en Étape C + Étape B).
            </div>
            <button class="btn btn-warning btn-sm" data-action="lesson-step" data-step="C">Aller aux Flashcards (Étape C) →</button>
          </div>`;
      } else {
        resultBanner = `
          <div class="alert alert-danger" style="margin-bottom:20px;align-items:center;justify-content:space-between;flex-wrap:wrap;">
            <div>
              <strong>Score obtenu : ${mt.scorePct} % (${mt.correctCount}/${questions.length}) — Seuil de maîtrise : 80 %</strong><br>
              Cette leçon reste « En cours » et a été ajoutée à vos points faibles. Nous vous recommandons de relire l’Étape A/B et de revoir les corrections ci-dessous avant de réessayer.
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button class="btn btn-secondary btn-sm" data-action="lesson-step" data-step="B">Revoir À mémoriser</button>
              <button class="btn btn-danger btn-sm" data-action="minitest-retry">Réessayer le mini-test</button>
            </div>
          </div>`;
      }
    }

    const questionsHtml = questions.map((q, idx) => {
      const sel = mt.answers[q.id] || [];
      const isCorr = mt.submitted && arraysEqualSet(sel, q.correct);
      return window.EpiUI.renderQcmCard(
        q,
        { selected: sel, submitted: mt.submitted, isCorrect: isCorr },
        { prefix: 'minitest', number: idx + 1, hideSubmit: true }
      );
    }).join('');

    return `
      <div class="card" style="margin-bottom:18px;">
        <div class="card-header" style="margin-bottom:4px;">
          <div>
            <h2 class="card-title">${icon('award', 19)} Étape E — Mini-test de validation (${questions.length} questions)</h2>
            <p class="card-subtitle">Teste compréhension, mémorisation, pièges QCM et distinctions. Objectif : <strong>≥ 80 %</strong> pour maîtriser la leçon et lancer le calendrier SRS.</p>
          </div>
          ${lRec.miniTestBest !== null ? `<span class="badge ${lRec.miniTestBest >= 80 ? 'badge-green' : 'badge-orange'}">Meilleur score : ${lRec.miniTestBest} %</span>` : ''}
        </div>
      </div>

      ${resultBanner}

      ${questionsHtml}

      ${!mt.submitted ? `
        <div class="card" style="display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;">
          <div style="font-size:14px;color:#475569;">
            Progression du mini-test : <strong>${answeredCount} / ${questions.length}</strong> question(s) répondue(s)
          </div>
          <button type="button" class="btn btn-primary btn-lg" data-action="minitest-submit" ${answeredCount < questions.length ? 'disabled' : ''}>
            Terminer la leçon & Corriger le mini-test
          </button>
        </div>` : ''}
    `;
  }

  function arraysEqualSet(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    const sa = a.slice().sort().join(',');
    const sb = b.slice().sort().join(',');
    return sa === sb;
  }

  return {
    getMiniTestQuestions,
    arraysEqualSet,
    renderCourseOverview,
    renderLessonStudio
  };
})();
