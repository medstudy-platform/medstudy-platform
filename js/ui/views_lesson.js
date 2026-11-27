/* ==========================================================================
   Vues Cours & Studio de Leçon — Parcours Pédagogique Unifié (Global MedStudy)
   S'adapte dynamiquement à TOUS les cours (existants & futurs PDF/PowerPoint),
   toutes les leçons, toutes les phases et toutes les étapes individuelles.
   ========================================================================== */
window.EpiViewsLesson = (function () {
  const esc = (s) => window.EpiUI.esc(s);
  const asArr = (v) => window.EpiUI.asArr(v);
  const icon = (n, s) => window.EpiIcons.get(n, s);

  function getMiniTestQuestions(course, lesson, catalog) {
    return window.EpiJourney.getMiniTestQuestions(course, lesson, catalog);
  }

  function arraysEqualSet(a, b) {
    return window.EpiJourney.arraysEqualSet(a, b);
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

  // ==================== VUE FEUILLE DE ROUTE D'UN COURS ====================
  function renderCourseOverview(profile, courseId, opts) {
    const o = opts || {};
    const catalog = o.catalog || window.EpiData;
    const isPreview = !!o.isPreview;
    const course = asArr(catalog.courses).find(c => c.id === courseId);
    if (!course) return `<div class="card empty-state">Cours introuvable.</div>`;

    const st = window.EpiPlanner.getCourseStats(profile, course);
    const cj = window.EpiJourney.getCourseJourney(profile, course, { catalog });
    const nextLj = cj.nextLessonJourney;
    const openAction = isPreview ? 'admin-preview-lesson' : 'go-lesson';
    const nextTargetPhase = (nextLj && nextLj.nextPhase && nextLj.nextPhase.key) || 'A';
    const nextTargetSubStep = (nextLj && nextLj.nextStep && nextLj.nextStep.id) || '';

    const roadmapHtml = cj.lessons.map((lj) => {
      const lesson = lj.lesson;
      const lRec = profile.lessons[lesson.id];
      const m = window.EpiSRS.getLessonMastery(profile, lesson);
      const srs = profile.lessonSrs[lesson.id];
      const fcCount = asArr(catalog.flashcards).filter(f => f.lessonId === lesson.id).length;
      const qcmCount = asArr(catalog.qcms).filter(q => q.lessonId === lesson.id).length;
      const isUpdated = window.EpiStorage.isLessonFlaggedUpdated(profile, lesson);
      const isNext = nextLj && nextLj.id === lesson.id && !lj.isCompleted;
      const targetPhaseKey = (lj.nextPhase && lj.nextPhase.key) || 'A';
      const targetSubStep = (lj.nextStep && lj.nextStep.id) || '';

      let ctaText = 'Commencer';
      if (isPreview) ctaText = 'Prévisualiser';
      else if (isUpdated) ctaText = 'Revoir la MAJ';
      else if (lj.isCompleted) ctaText = 'Réviser';
      else if (lj.completedSteps > 0 || lj.status === 'in_progress') ctaText = 'Continuer';

      const phasePillsHtml = lj.phases.map(p => {
        const pCls = p.isCompleted ? 'done' : (p.completedCount > 0 ? 'progress' : 'idle');
        const pIcon = p.isCompleted ? 'checkCircle' : (p.completedCount > 0 ? 'disc' : 'circle');
        return `
          <button type="button" class="j-roadmap-phase-pill ${pCls}"
            data-action="${openAction}" data-course="${esc(course.id)}" data-lesson="${esc(lesson.id)}" data-step="${esc(p.key)}"
            title="${esc(p.name)} : ${esc(p.progressText)}">
            ${icon(pIcon, 12)}
            <span>${esc(p.shortName)}</span>
            <strong>${p.completedCount}/${p.totalCount}</strong>
          </button>`;
      }).join('');

      return `
        <article class="j-roadmap-card ${isUpdated ? 'roadmap-updated' : ''} ${lj.isCompleted ? 'is-done' : (isNext ? 'is-next' : '')}">
          <div class="j-roadmap-top">
            <div class="j-roadmap-left">
              <div class="j-step-num ${lj.isCompleted ? 'done' : (isNext ? 'current' : '')}">
                ${lj.isCompleted ? icon('check', 15) : lj.index}
              </div>
              <div style="min-width:0;flex:1;">
                <div class="j-roadmap-badges">
                  <span class="j-step-id">Leçon ${lj.index}/${cj.totalLessons} · ${esc(lj.identifier)}</span>
                  ${window.EpiJourneyUI.renderStatusBadge(lj.status)}
                  ${window.EpiUI.masteryBadge(m)}
                  ${isNext ? `<span class="j-next-tag">${icon('arrowRight', 12)} Prochaine leçon recommandée</span>` : ''}
                  ${isPreview && lesson.hasManualFlags ? `<span class="badge badge-vigilance">Relecture recommandée</span>` : ''}
                  ${isUpdated ? `<span class="badge badge-orange">🔄 Contenu mis à jour</span>` : ''}
                  ${course.bmCount > 0 || lesson.bmCount > 0 ? window.EpiUI.priorityBadge(lesson.priority, course.vigilance2026 && lesson.bmCount === 0) : ''}
                </div>
                <h3 class="j-roadmap-title">${esc(lesson.title)}</h3>
                <div class="j-roadmap-meta">
                  <span>${esc(lesson.sourceRef || 'Support de cours')}</span>
                  <span>· ~${lesson.durationMin || 10} min</span>
                  ${lesson.bmCount > 0 ? `<span>· <strong>${lesson.bmCount}</strong> QCM BM</span>` : ''}
                  <span>· ${fcCount} flashcards · ${qcmCount} QCM</span>
                  ${lRec && lRec.miniTestBest !== null ? `<span>· Mini-test : <strong>${lRec.miniTestBest} %</strong></span>` : ''}
                  ${srs && srs.nextReviewAt ? `<span>· Révision SRS : <strong>${window.EpiUI.formatDueLabel(window.EpiSRS.daysUntil(srs.nextReviewAt))}</strong></span>` : ''}
                </div>
              </div>
            </div>
            <div class="j-roadmap-cta">
              <div class="j-roadmap-pct">
                <strong>${lj.pct} %</strong>
                <span>${lj.completedPhases}/${lj.totalPhases} phases</span>
              </div>
              <button type="button" class="btn ${lj.isCompleted ? 'btn-secondary' : 'btn-primary'} btn-sm"
                data-action="${openAction}" data-course="${esc(course.id)}" data-lesson="${esc(lesson.id)}" data-step="${esc(targetPhaseKey)}" data-substep="${esc(targetSubStep)}">
                ${esc(ctaText)} ${icon('arrowRight', 14)}
              </button>
            </div>
          </div>

          <div class="progress-bar j-mini-bar" style="margin:12px 0 10px;">
            <div class="progress-fill ${lj.isCompleted ? 'green' : ''}" style="width:${lj.pct}%"></div>
          </div>

          <div class="j-roadmap-phases-row" aria-label="Phases de la leçon ${esc(lesson.title)}">
            ${phasePillsHtml}
          </div>
        </article>`;
    }).join('');

    const mod = asArr(catalog.modules).find(m => m.id === course.moduleId);
    const attachments = asArr(course.attachments);
    const attachmentsHtml = attachments.length > 0 ? `
      <div class="j-attachments-strip">
        <div class="j-attachments-label">Supports originaux joints (${attachments.length}) :</div>
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
              ${course.academicYear ? `<span class="badge badge-neutral">${esc(course.academicYear)}</span>` : ''}
              ${window.EpiJourneyUI.renderStatusBadge(cj.status)}
              ${course.pptImport && course.pptImport.isPowerPoint ? `<span class="badge badge-medium">PowerPoint · ${course.pptImport.slidesProcessed} diapos</span>` : ''}
              ${course.bmCount > 0 || course.vigilance2026 ? window.EpiUI.priorityBadge(course.priority, course.vigilance2026) : ''}
              ${course.bmCount > 0 ? `<span class="badge badge-bm">${course.bmCount} QCM dans la BM</span>` : ''}
            </div>
            <h1 class="j-course-heading">${esc(course.title)}</h1>
            <p class="j-course-summary">${esc(course.summary || '')}</p>
            <div class="j-course-meta">
              <strong>Enseignant :</strong> ${esc(course.professor || 'Faculté de Médecine')}
              ${asArr(course.sourceFiles).length ? ` · <strong>Source(s) :</strong> ${esc(asArr(course.sourceFiles).join(' ; '))}` : ''}
              ${course.bmSharedNote ? `<br><strong>Note BM :</strong> ${esc(course.bmSharedNote)}` : ''}
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
            ${window.EpiIcons.progressRing(cj.overallPct, 86, cj.overallPct === 100 ? '#059669' : '#2563eb')}
            ${nextLj ? `<button type="button" class="btn btn-primary" data-action="${openAction}" data-course="${esc(course.id)}" data-lesson="${esc(nextLj.id)}" data-step="${esc(nextTargetPhase)}" data-substep="${esc(nextTargetSubStep)}">
              ${isPreview ? 'Prévisualiser la 1ère leçon →' : (cj.completedLessons === cj.totalLessons ? 'Réviser ce cours →' : (cj.completedSteps > 0 ? 'Continuer mon parcours →' : 'Commencer le cours →'))}
            </button>` : ''}
          </div>
        </div>

        <div class="j-guidance-banner ${cj.status === 'completed' ? 'j-guide-success' : 'j-guide-info'}" style="margin-top:16px;">
          <div class="j-guidance-icon">${icon(cj.status === 'completed' ? 'checkCircle' : 'target', 18)}</div>
          <div class="j-guidance-copy">
            <strong>Parcours du cours : ${cj.completedLessons}/${cj.totalLessons} leçons · ${cj.completedPhases}/${cj.totalPhases} phases · ${cj.completedSteps}/${cj.totalSteps} étapes (${cj.overallPct} %)</strong>
            <span>${esc(cj.guidance)}</span>
          </div>
        </div>

        ${attachmentsHtml}

        <div class="kpi-grid j-course-kpis">
          <div class="j-mini-kpi">
            <span>Leçons terminées</span>
            <strong style="color:var(--green);">${cj.completedLessons} / ${cj.totalLessons}</strong>
          </div>
          <div class="j-mini-kpi">
            <span>Phases validées</span>
            <strong style="color:var(--primary);">${cj.completedPhases} / ${cj.totalPhases}</strong>
          </div>
          <div class="j-mini-kpi">
            <span>Étapes complétées</span>
            <strong>${cj.completedSteps} / ${cj.totalSteps}</strong>
          </div>
          <div class="j-mini-kpi">
            <span>Maîtrisées (SRS ≥ 80 %)</span>
            <strong style="color:${st.needsRevision > 0 ? 'var(--red)' : 'var(--green)'};">${st.completed} / ${st.total}${st.needsRevision > 0 ? ` (${st.needsRevision} à réviser)` : ''}</strong>
          </div>
        </div>
      </div>

      <h2 class="section-heading" style="margin-top:6px;">
        <span>Feuille de route du cours (${cj.totalLessons} leçon${cj.totalLessons > 1 ? 's' : ''} · ${cj.totalPhases} phases · ${cj.totalSteps} étapes)</span>
      </h2>
      <div class="j-roadmap-list">${roadmapHtml || '<div class="card empty-state">Aucune leçon disponible dans ce cours pour le moment.</div>'}</div>
    `;
  }

  // ==================== STUDIO DE LEÇON UNIFIÉ (TOUTES PHASES & ÉTAPES) ====================
  function renderLessonStudio(profile, courseId, lessonId, activeStep, runtime, opts) {
    const o = opts || {};
    const catalog = o.catalog || window.EpiData;
    const isPreview = !!o.isPreview;
    const course = asArr(catalog.courses).find(c => c.id === courseId);
    const lesson = course ? asArr(course.lessons).find(l => l.id === lessonId) : null;
    if (!course || !lesson) return `<div class="card empty-state">Leçon introuvable.</div>`;

    const lRec = window.EpiStorage.ensureLessonRecord(profile, lesson.id);
    const mastery = window.EpiSRS.getLessonMastery(profile, lesson);
    const memEvidence = window.EpiSRS.hasCompletedMemorizationEvidence(profile, lesson);

    const cj = window.EpiJourney.getCourseJourney(profile, course, { catalog });
    const lj = window.EpiJourney.getLessonJourney(profile, course, lesson, {
      catalog,
      runtime,
      activePhaseKey: activeStep || 'A',
      activeStepId: runtime.activeSubStepId || null
    });

    const activePhase = lj.activePhase;
    const activePhaseIdx = lj.phases.findIndex(p => p.key === (activePhase && activePhase.key));
    const prevPhase = activePhaseIdx > 0 ? lj.phases[activePhaseIdx - 1] : null;
    const nextPhase = (activePhaseIdx >= 0 && activePhaseIdx < lj.phases.length - 1) ? lj.phases[activePhaseIdx + 1] : null;
    const currentStep = lj.activeStep;

    const backAction = isPreview ? 'admin-preview-course' : 'go-course';
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

    let workspaceHtml = '';
    if (activePhase && currentStep) {
      if (activePhase.key === 'A') {
        workspaceHtml = renderUnderstandStepWorkspace(lesson, activePhase, currentStep, prevPhase, nextPhase, lj.nextLesson, course.id, isPreview);
      } else if (activePhase.key === 'B') {
        workspaceHtml = renderMemorizeStepWorkspace(lesson, lRec, activePhase, currentStep, prevPhase, nextPhase, lj.nextLesson, course.id, isPreview);
      } else if (activePhase.key === 'AR') {
        workspaceHtml = renderActiveRecallStepWorkspace(lesson, activePhase, currentStep, runtime, prevPhase, nextPhase, lj.nextLesson, course.id, isPreview);
      } else if (activePhase.key === 'C') {
        workspaceHtml = renderFlashcardStepWorkspace(profile, lesson, activePhase, currentStep, runtime, prevPhase, nextPhase, lj.nextLesson, course.id, isPreview);
      } else if (activePhase.key === 'D') {
        workspaceHtml = renderQcmStepWorkspace(profile, lesson, activePhase, currentStep, runtime, prevPhase, nextPhase, lj.nextLesson, course.id, isPreview);
      } else if (activePhase.key === 'E') {
        workspaceHtml = renderMiniTestStepWorkspace(profile, course, lesson, lRec, memEvidence, activePhase, currentStep, runtime, catalog, prevPhase, lj.nextLesson, isPreview);
      }
    } else {
      workspaceHtml = `<div class="card empty-state">Aucune activité disponible dans cette phase pour le moment.</div>`;
    }

    return `
      ${isPreview ? renderPreviewBanner(course) : ''}

      <div class="j-top-breadcrumb">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-ghost btn-sm" data-action="${backAction}" data-course="${esc(course.id)}">
            ${icon('arrowLeft', 16)} ${esc(course.code)} · ${esc(course.shortTitle || course.title)}
          </button>
          <span class="j-sep">/</span>
          <span class="j-crumb-current">Leçon ${lj.lessonIndex}/${lj.totalLessonsInCourse} · ${esc(lesson.slideRange || lesson.id)}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          ${!isPreview ? `<button type="button" class="btn ${lRec.studied ? 'btn-success' : 'btn-secondary'} btn-sm" data-action="toggle-studied" data-lesson="${esc(lesson.id)}">
            ${lRec.studied ? '✓ Marquée comme étudiée' : 'Marquer comme étudiée'}
          </button>` : ''}
        </div>
      </div>

      ${window.EpiJourneyUI.renderCourseLessonsNavigator(cj, lesson.id, {
        expanded: !!runtime.courseLessonsNavOpen,
        isPreview
      })}

      ${updateBannerHtml}

      <div class="card j-lesson-hero">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap;">
          <div style="flex:1;min-width:240px;">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
              <span class="j-step-id">${esc(lesson.id)}</span>
              ${window.EpiJourneyUI.renderStatusBadge(lj.status)}
              ${window.EpiUI.masteryBadge(mastery)}
              ${course.bmCount > 0 || lesson.bmCount > 0 ? window.EpiUI.priorityBadge(lesson.priority, course.vigilance2026 && lesson.bmCount === 0) : ''}
              ${lesson.slideRange ? `<span class="badge badge-medium">${esc(lesson.slideRange)}</span>` : ''}
              ${lesson.bmCount > 0 ? `<span class="badge badge-bm">${lesson.bmCount} QCM BM</span>` : ''}
              ${lRec.mastered && mastery.level === 'green' ? `<span class="badge badge-green">🏆 Leçon maîtrisée</span>` : ''}
            </div>
            <h1 class="edu-h1 j-lesson-title">${esc(lesson.title)}</h1>
            <div class="j-course-meta">
              <strong>Source :</strong> ${esc(lesson.sourceRef || 'Support de cours')} · <strong>Durée estimée :</strong> ~${lesson.durationMin || 10} min
              ${asArr(lesson.bmRefs).length ? ` · <strong>Réf. BM :</strong> ${esc(asArr(lesson.bmRefs).join(', '))}` : ''}
            </div>
          </div>
          <div class="j-lesson-hero-stats">
            <div class="j-hero-pct">${lj.overallPct} %</div>
            <div class="j-hero-sub">${lj.completedPhases}/${lj.totalPhases} phases · ${lj.completedSteps}/${lj.totalSteps} étapes</div>
          </div>
        </div>
      </div>

      ${lesson.bmWarning ? `<div class="alert alert-danger">${icon('alert', 19)}<div>${esc(lesson.bmWarning)}</div></div>` : ''}
      ${isPreview && lesson.hasManualFlags && lesson.extractionNote ? `<div class="alert alert-warning">${icon('alert', 18)}<div><strong>Point de vigilance import PowerPoint :</strong> ${esc(lesson.extractionNote)}</div></div>` : ''}

      ${window.EpiJourneyUI.renderLessonPhasesStepper(lj, activePhase ? activePhase.key : 'A')}

      ${activePhase ? window.EpiJourneyUI.renderPhaseOverviewAndSteps(activePhase, currentStep ? currentStep.id : null, nextPhase, {
        collapsedSteps: !!runtime.phaseStepsCollapsed
      }) : ''}

      <div class="j-step-workspace-wrap">${workspaceHtml}</div>
    `;
  }

  // ---- WORKSPACE PHASE A : À COMPRENDRE (TYPOGRAPHIE MÉDICALE & BLOCS SÉMANTIQUES) ----
  function renderUnderstandStepWorkspace(lesson, phase, step, prevPhase, nextPhase, nextLesson, courseId, isPreview) {
    const u = lesson.understand || {};
    const fmt = window.EpiFormat;
    let bodyHtml = '';

    if (step.kind === 'section' && step.section) {
      const sec = step.section;
      bodyHtml = `
        ${step.number === 1 && u.intro ? (fmt ? fmt.renderIntroCallout(u.intro, lesson.sourceRef) : `<div class="j-intro-callout">${esc(u.intro)}</div>`) : ''}
        ${fmt ? fmt.renderUnderstandSection(sec) : `
          <div class="j-prose">
            ${asArr(sec.paragraphs).map(p => `<p>${p}</p>`).join('')}
            ${asArr(sec.bullets).length ? `<ul>${asArr(sec.bullets).map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
          </div>`}`;
    } else if (step.kind === 'tables') {
      bodyHtml = asArr(step.tables).map((tbl, ti) => fmt
        ? fmt.renderTableCard(tbl, ti)
        : `<div style="margin-bottom:18px;"><h4 class="edu-h4">${esc(tbl.title)}</h4></div>`).join('');
    } else if (step.kind === 'synthesis') {
      const triad = step.triad || {};
      const fmtItem = (t) => (fmt ? fmt.enhanceInlineText(t) : esc(t));
      bodyHtml = `
        ${step.darija ? `
          <div class="darija-box">
            <div class="darija-box-title">${icon('sparkle', 15)} Explication simplifiée en Darija algérienne (باش تفهم بالخف)</div>
            <p>${fmt ? fmt.enhanceInlineText(step.darija, { skipLeadTerm: true }) : step.darija}</p>
          </div>` : ''}
        <div class="edu-summary-head">
          <h3 class="edu-h3" style="margin:0;">Synthèse & Points essentiels à retenir</h3>
          <span class="edu-ref-pill">${esc(lesson.sourceRef || lesson.id)}</span>
        </div>
        <div class="triad-grid edu-triad-grid">
          <div class="triad-card understand edu-triad-understand">
            <h4 class="edu-h4">💡 Ce que tu dois comprendre</h4>
            <ul class="edu-ul">${asArr(triad.toUnderstand).map(i => `<li class="edu-li"><div class="edu-li-body">${fmtItem(i)}</div></li>`).join('')}</ul>
          </div>
          <div class="triad-card memorize edu-triad-memorize">
            <h4 class="edu-h4">📌 Ce que tu dois mémoriser</h4>
            <ul class="edu-ul">${asArr(triad.toMemorize).map(i => `<li class="edu-li"><div class="edu-li-body">${fmtItem(i)}</div></li>`).join('')}</ul>
          </div>
          <div class="triad-card qcm edu-triad-qcm">
            <h4 class="edu-h4">🎯 Ce qu’il faut reconnaître en QCM</h4>
            <ul class="edu-ul">${asArr(triad.toRecognizeInQcm).map(i => `<li class="edu-li"><div class="edu-li-body">${fmtItem(i)}</div></li>`).join('')}</ul>
          </div>
        </div>`;
    } else {
      bodyHtml = fmt ? fmt.renderIntroCallout(step.intro || u.intro || '', lesson.sourceRef) : `<div class="j-prose"><p>${esc(step.intro || u.intro || '')}</p></div>`;
    }

    const remainingOthers = phase.steps.filter(s => !s.completed && s.id !== step.id).length;
    let primaryBtnHtml = '';
    if (!step.completed) {
      const lbl = remainingOthers === 0
        ? '✓ J’ai compris cette étape — Terminer la phase'
        : '✓ J’ai compris cette étape — Passer à la suivante';
      primaryBtnHtml = `
        <button type="button" class="btn btn-primary btn-lg"
          data-action="complete-understand-step" data-lesson="${esc(lesson.id)}" data-stepid="${esc(step.id)}">
          ${lbl} ${icon('arrowRight', 18)}
        </button>`;
    } else {
      const undoBtn = !isPreview
        ? `<button type="button" class="btn btn-ghost btn-sm" data-action="uncomplete-understand-step" data-lesson="${esc(lesson.id)}" data-stepid="${esc(step.id)}">Retirer la validation</button>`
        : '';
      const nextStepObj = phase.steps.find(s => !s.completed);
      const continueBtn = phase.isCompleted && nextPhase
        ? `<button type="button" class="btn btn-success btn-lg" data-action="lesson-step" data-step="${esc(nextPhase.key)}">Passer maintenant à : ${esc(nextPhase.name)} ${icon('arrowRight', 18)}</button>`
        : (nextStepObj
          ? `<button type="button" class="btn btn-primary btn-lg" data-action="lesson-select-substep" data-phase="A" data-substep="${esc(nextStepObj.id)}">Continuer avec l’étape ${nextStepObj.number} ${icon('arrowRight', 18)}</button>`
          : '');
      primaryBtnHtml = `${undoBtn}${continueBtn}`;
    }

    return `
      <div class="card j-workspace-card edu-phase-A">
        <div class="j-workspace-head">
          <div>
            <div class="j-workspace-kicker">
              <span class="edu-phase-pill edu-phase-pill-A">${icon('book', 13)} À comprendre</span>
              <span class="j-step-id">Étape ${step.number}/${phase.totalCount} · ${esc(step.identifier)}</span>
              ${window.EpiJourneyUI.renderStatusBadge(step.completed ? 'completed' : 'in_progress')}
            </div>
            <h2 class="edu-h2 j-workspace-title">${esc(step.title)}</h2>
          </div>
        </div>
        ${bodyHtml}
        ${window.EpiJourneyUI.renderStepFooterGuidance(phase, step, nextPhase, nextLesson, courseId, {
          prevPhase,
          isPreview,
          primaryActionHtml: primaryBtnHtml
        })}
      </div>`;
  }

  // ---- WORKSPACE PHASE B : À MÉMORISER (CARTES SÉMANTIQUES HAUTE LISIBILITÉ) ----
  function renderMemorizeStepWorkspace(lesson, lRec, phase, step, prevPhase, nextPhase, nextLesson, courseId, isPreview) {
    const item = step.item || {};
    const isChecked = !!step.completed;
    const fmt = window.EpiFormat;
    const remainingOthers = phase.steps.filter(s => !s.completed && s.id !== step.id).length;

    let primaryBtnHtml = '';
    if (!isChecked) {
      const lbl = remainingOthers === 0
        ? '✓ J’ai mémorisé cette notion — Terminer la phase'
        : '✓ J’ai mémorisé cette notion — Suivante';
      primaryBtnHtml = `
        <button type="button" class="btn btn-primary btn-lg"
          data-action="toggle-mem-item" data-lesson="${esc(lesson.id)}" data-mid="${esc(item.id)}" data-advance="1">
          ${lbl} ${icon('arrowRight', 18)}
        </button>`;
    } else {
      const undoBtn = !isPreview
        ? `<button type="button" class="btn btn-ghost btn-sm" data-action="toggle-mem-item" data-lesson="${esc(lesson.id)}" data-mid="${esc(item.id)}">Retirer le marquage</button>`
        : '';
      const nextStepObj = phase.steps.find(s => !s.completed);
      const continueBtn = phase.isCompleted && nextPhase
        ? `<button type="button" class="btn btn-success btn-lg" data-action="lesson-step" data-step="${esc(nextPhase.key)}">Passer maintenant à : ${esc(nextPhase.name)} ${icon('arrowRight', 18)}</button>`
        : (nextStepObj
          ? `<button type="button" class="btn btn-primary btn-lg" data-action="lesson-select-substep" data-phase="B" data-substep="${esc(nextStepObj.id)}">Continuer avec la notion ${nextStepObj.number} ${icon('arrowRight', 18)}</button>`
          : '');
      primaryBtnHtml = `${undoBtn}${continueBtn}`;
    }

    return `
      <div class="card j-workspace-card edu-phase-B">
        <div class="j-workspace-head">
          <div>
            <div class="j-workspace-kicker">
              <span class="edu-phase-pill edu-phase-pill-B">${icon('bookmark', 13)} À mémoriser</span>
              <span class="j-step-id">Notion ${step.number}/${phase.totalCount} · ${esc(step.identifier)}</span>
              ${window.EpiJourneyUI.renderStatusBadge(isChecked ? 'completed' : 'in_progress')}
            </div>
            <h2 class="edu-h2 j-workspace-title">${esc(item.title)}</h2>
          </div>
        </div>

        ${fmt ? fmt.renderMemorizeCardRich(item, isChecked) : `
          <div class="j-mem-focus-box ${item.highlight ? 'highlight' : ''} ${isChecked ? 'checked' : ''}">
            <div class="j-mem-focus-content">${item.content || ''}</div>
          </div>`}

        <div class="alert alert-info" style="margin-top:16px;margin-bottom:0;">
          ${icon('brain', 18)}
          <div><strong>Règle pédagogique :</strong> valider une notion confirme son étude dans « À mémoriser », mais la maîtrise réelle est vérifiée en <strong>Flashcards</strong> (répétition espacée) et au <strong>Mini-test (≥ 80 %)</strong>.</div>
        </div>

        ${window.EpiJourneyUI.renderStepFooterGuidance(phase, step, nextPhase, nextLesson, courseId, {
          prevPhase,
          isPreview,
          primaryActionHtml: primaryBtnHtml
        })}
      </div>`;
  }

  // ---- WORKSPACE PHASE AR : ACTIVE RECALL (QUESTION / RÉPONSE STRUCTURÉE) ----
  function renderActiveRecallStepWorkspace(lesson, phase, step, runtime, prevPhase, nextPhase, nextLesson, courseId, isPreview) {
    const ar = step.promptObj || {};
    const fmt = window.EpiFormat;
    const arState = (runtime.activeRecall && runtime.activeRecall[step.id]) || { revealed: false, draft: '' };
    const remainingOthers = phase.steps.filter(s => !s.completed && s.id !== step.id).length;

    let primaryBtnHtml = '';
    if (!arState.revealed && !step.completed) {
      primaryBtnHtml = `
        <button type="button" class="btn btn-primary btn-lg" data-action="ar-reveal" data-arid="${esc(step.id)}">
          Révéler la réponse attendue
        </button>`;
    } else if (!step.completed) {
      const lbl = remainingOthers === 0
        ? '✓ Réponse vérifiée — Terminer Active Recall'
        : '✓ Réponse vérifiée — Activité suivante';
      primaryBtnHtml = `
        <button type="button" class="btn btn-success btn-lg" data-action="complete-ar-step" data-lesson="${esc(lesson.id)}" data-arid="${esc(step.id)}">
          ${lbl} ${icon('arrowRight', 18)}
        </button>`;
    } else {
      const nextStepObj = phase.steps.find(s => !s.completed);
      primaryBtnHtml = phase.isCompleted && nextPhase
        ? `<button type="button" class="btn btn-success btn-lg" data-action="lesson-step" data-step="${esc(nextPhase.key)}">Passer maintenant à : ${esc(nextPhase.name)} ${icon('arrowRight', 18)}</button>`
        : (nextStepObj
          ? `<button type="button" class="btn btn-primary btn-lg" data-action="lesson-select-substep" data-phase="AR" data-substep="${esc(nextStepObj.id)}">Continuer avec l’activité ${nextStepObj.number} ${icon('arrowRight', 18)}</button>`
          : '');
    }

    return `
      <div class="card j-workspace-card edu-phase-AR">
        <div class="j-workspace-head">
          <div>
            <div class="j-workspace-kicker">
              <span class="edu-phase-pill edu-phase-pill-AR">${icon('sparkle', 13)} Active Recall</span>
              <span class="j-step-id">Activité ${step.number}/${phase.totalCount} · ${esc(step.identifier)}</span>
              ${window.EpiJourneyUI.renderStatusBadge(step.completed ? 'completed' : 'in_progress')}
            </div>
            <h2 class="edu-h2 j-workspace-title">Restitution active de mémoire</h2>
          </div>
        </div>

        <div class="edu-recall-stage">
          <div class="edu-fc-q-zone">
            <h4 class="edu-h4" style="margin:0 0 6px;">Question de rappel libre</h4>
            <div class="edu-fc-question">${fmt ? fmt.enhanceInlineText(step.fullTitle || ar.prompt, { skipLeadTerm: true }) : esc(step.fullTitle || ar.prompt)}</div>
          </div>
          <div class="edu-fc-work-zone">
            <textarea class="input" rows="3" style="width:100%;resize:vertical;" placeholder="Écrivez ou formulez mentalement votre réponse avant de révéler la correction du cours…" data-action="ar-draft" data-arid="${esc(step.id)}">${esc(arState.draft || '')}</textarea>
            ${(arState.revealed || step.completed) ? `
              <div class="edu-fc-a-zone">
                <div class="edu-callout-head" style="margin-bottom:6px;">
                  <span class="edu-callout-tag">${icon('checkCircle', 14)}<span>Réponse attendue (source cours)</span></span>
                  ${ar.pageRef ? `<span class="edu-ref-pill">${esc(ar.pageRef)}</span>` : ''}
                </div>
                <div class="edu-callout-body">${fmt ? fmt.renderRichAnswer(ar.expectedAnswer || '') : esc(ar.expectedAnswer || '')}</div>
              </div>` : `
              <div style="margin-top:10px;font-size:13px;color:var(--text-light);">
                Tentez de restituer la notion de mémoire, puis révélez la réponse pour vérifier et valider cette activité.
              </div>`}
          </div>
        </div>

        ${window.EpiJourneyUI.renderStepFooterGuidance(phase, step, nextPhase, nextLesson, courseId, {
          prevPhase,
          isPreview,
          primaryActionHtml: primaryBtnHtml
        })}
      </div>`;
  }

  // ---- WORKSPACE PHASE C : FLASHCARDS (CARTE DOUBLE ZONE QUESTION / RÉPONSE) ----
  function renderFlashcardStepWorkspace(profile, lesson, phase, step, runtime, prevPhase, nextPhase, nextLesson, courseId, isPreview) {
    const card = step.card;
    if (!card) return `<div class="card empty-state">Aucune flashcard disponible pour cette leçon.</div>`;
    const fmt = window.EpiFormat;
    const rec = profile.flashcards[card.id];
    const fcState = (runtime.flashcard && runtime.flashcard.cardId === card.id)
      ? runtime.flashcard
      : { cardId: card.id, revealed: false, draft: '' };

    const nextStepObj = phase.steps.find(s => !s.completed && s.id !== step.id) || phase.steps.find(s => !s.completed);
    let footerPrimaryHtml = '';
    if (phase.isCompleted && nextPhase) {
      footerPrimaryHtml = `
        <button type="button" class="btn btn-success btn-lg" data-action="lesson-step" data-step="${esc(nextPhase.key)}">
          Passer maintenant à : ${esc(nextPhase.name)} ${icon('arrowRight', 18)}
        </button>`;
    } else if (step.completed && nextStepObj) {
      footerPrimaryHtml = `
        <button type="button" class="btn btn-primary btn-lg" data-action="lesson-select-substep" data-phase="C" data-substep="${esc(nextStepObj.id)}">
          Continuer avec la carte ${nextStepObj.number} ${icon('arrowRight', 18)}
        </button>`;
    }

    return `
      <div class="card j-workspace-card edu-phase-C">
        <div class="j-workspace-head">
          <div>
            <div class="j-workspace-kicker">
              <span class="edu-phase-pill edu-phase-pill-C">${icon('brain', 13)} Flashcard SRS</span>
              <span class="j-step-id">Carte ${step.number}/${phase.totalCount} · ${esc(step.identifier)}</span>
              ${window.EpiJourneyUI.renderStatusBadge(step.completed ? 'completed' : 'in_progress')}
              ${rec ? `<span class="badge badge-neutral">Dernier retour : ${rec.lastRating === 'knew' ? 'Su ✓' : (rec.lastRating === 'partial' ? 'Partiel' : 'Oublié')} · ${window.EpiUI.formatDueLabel(window.EpiSRS.daysUntil(rec.nextReviewAt))}</span>` : '<span class="badge badge-neutral">Nouvelle carte</span>'}
            </div>
            <h2 class="edu-h2 j-workspace-title">Carte de rappel espacé</h2>
          </div>
        </div>

        <div class="edu-recall-stage">
          <div class="edu-fc-q-zone">
            <div class="edu-callout-head" style="margin-bottom:6px;">
              <h4 class="edu-h4" style="margin:0;">Question</h4>
              ${card.pageRef ? `<span class="edu-ref-pill">${esc(card.pageRef)}</span>` : ''}
            </div>
            <div class="edu-fc-question">${fmt ? fmt.enhanceInlineText(card.question, { skipLeadTerm: true }) : esc(card.question)}</div>
          </div>

          <div class="edu-fc-work-zone">
            ${!fcState.revealed ? `
              <div>
                <textarea class="input" rows="2" style="width:100%;resize:vertical;margin-bottom:12px;" placeholder="Essayez d’écrire ou de formuler mentalement votre réponse avant de révéler…" data-action="fc-draft">${esc(fcState.draft || '')}</textarea>
                <button type="button" class="btn btn-primary btn-lg" style="width:100%;" data-action="fc-reveal" data-cid="${esc(card.id)}">
                  Révéler la réponse
                </button>
              </div>
            ` : `
              <div>
                <div class="edu-fc-a-zone">
                  <div class="edu-callout-head" style="margin-bottom:6px;">
                    <span class="edu-callout-tag">${icon('checkCircle', 14)}<span>Réponse exacte (source cours)</span></span>
                    ${card.pageRef ? `<span class="edu-ref-pill">${esc(card.pageRef)}</span>` : ''}
                  </div>
                  <div class="edu-callout-body">${fmt ? fmt.renderRichAnswer(card.answer) : esc(card.answer)}</div>
                  ${card.hint ? `<div class="edu-fc-hint"><strong>💡 Repère examen :</strong> ${fmt ? fmt.enhanceInlineText(card.hint, { skipLeadTerm: true }) : esc(card.hint)}</div>` : ''}
                </div>
                <div style="margin-top:14px;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px;text-align:center;">
                  Évaluez honnêtement votre rappel pour valider cette carte et programmer sa révision SRS :
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

        ${window.EpiJourneyUI.renderStepFooterGuidance(phase, step, nextPhase, nextLesson, courseId, {
          prevPhase,
          isPreview,
          primaryActionHtml: footerPrimaryHtml
        })}
      </div>`;
  }

  // ---- WORKSPACE PHASE D : ENTRAÎNEMENT QCM ----
  function renderQcmStepWorkspace(profile, lesson, phase, step, runtime, prevPhase, nextPhase, nextLesson, courseId, isPreview) {
    const q = step.qcm;
    if (!q) return `<div class="card empty-state">Aucun QCM disponible pour cette leçon.</div>`;

    const st = runtime.lessonQcms[q.id] || { selected: [], submitted: false, isCorrect: false };
    const persisted = profile.qcms[q.id];
    const nextStepObj = phase.steps.find(s => !s.completed && s.id !== step.id) || phase.steps.find(s => !s.completed);

    let footerPrimaryHtml = '';
    if (phase.isCompleted && nextPhase) {
      footerPrimaryHtml = `
        <button type="button" class="btn btn-success btn-lg" data-action="lesson-step" data-step="${esc(nextPhase.key)}">
          Passer maintenant à : ${esc(nextPhase.name)} ${icon('arrowRight', 18)}
        </button>`;
    } else if ((st.submitted || step.completed) && nextStepObj) {
      footerPrimaryHtml = `
        <button type="button" class="btn btn-primary btn-lg" data-action="lesson-select-substep" data-phase="D" data-substep="${esc(nextStepObj.id)}">
          Continuer avec le QCM ${nextStepObj.number} ${icon('arrowRight', 18)}
        </button>`;
    }

    return `
      <div class="card j-workspace-card edu-phase-D">
        <div class="j-workspace-head">
          <div>
            <div class="j-workspace-kicker">
              <span class="edu-phase-pill edu-phase-pill-D">${icon('clipboard', 13)} Entraînement QCM</span>
              <span class="j-step-id">QCM ${step.number}/${phase.totalCount} · ${esc(step.identifier)}</span>
              ${window.EpiJourneyUI.renderStatusBadge(step.completed ? 'completed' : 'in_progress')}
              ${persisted && !st.submitted ? `<span class="badge ${persisted.lastCorrect ? 'badge-green' : 'badge-orange'}">Historique : ${persisted.lastCorrect ? 'Réussi ✓' : 'À retravailler'} (${persisted.attempts} essai${persisted.attempts > 1 ? 's' : ''})</span>` : ''}
            </div>
            <h2 class="edu-h2 j-workspace-title">${esc(step.title)}</h2>
          </div>
          ${st.submitted ? `<button type="button" class="btn btn-secondary btn-sm" data-action="lesson-qcm-reset-one" data-qid="${esc(q.id)}">Refaire ce QCM</button>` : ''}
        </div>

        ${window.EpiUI.renderQcmCard(q, st, { prefix: 'lessonq', number: step.number })}

        ${window.EpiJourneyUI.renderStepFooterGuidance(phase, step, nextPhase, nextLesson, courseId, {
          prevPhase,
          isPreview,
          primaryActionHtml: footerPrimaryHtml
        })}
      </div>`;
  }

  // ---- WORKSPACE PHASE E : MINI-TEST DE VALIDATION (≥ 80 %) ----
  function renderMiniTestStepWorkspace(profile, course, lesson, lRec, memEvidence, phase, step, runtime, catalog, prevPhase, nextLesson, isPreview) {
    const questions = getMiniTestQuestions(course, lesson, catalog);
    if (!questions.length) {
      return `
        <div class="card empty-state">
          <strong>Aucun QCM disponible pour ce mini-test pour le moment.</strong><br>
          <span style="font-size:13.5px;">Ajoutez ou validez des QCM depuis l’espace Administration CMS pour activer le mini-test de cette leçon.</span>
        </div>`;
    }

    const passingScore = phase.passingScore || 80;
    const mt = runtime.miniTest || { answers: {}, submitted: false, scorePct: 0, correctCount: 0, newlyMastered: false };
    const answeredCount = questions.filter(q => asArr(mt.answers[q.id]).length > 0).length;
    const openLessonAction = isPreview ? 'admin-preview-lesson' : 'go-lesson';

    let resultBanner = '';
    if (mt.submitted) {
      const nextRec = window.EpiPlanner.getNextLessonInCourse(profile, course.id, lesson.id);
      if (mt.scorePct >= passingScore && memEvidence) {
        const srs = profile.lessonSrs[lesson.id];
        resultBanner = `
          <div class="card j-mt-result-pass">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
              <div style="flex:1;min-width:260px;">
                <span class="badge badge-green" style="margin-bottom:8px;">🏆 Score : ${mt.scorePct} % (${mt.correctCount}/${questions.length}) · PHASE & LEÇON VALIDÉES</span>
                <h2 style="margin:4px 0 6px;font-size:19px;">Bravo ! Cette phase est terminée et la leçon est maîtrisée.</h2>
                <p style="margin:0;font-size:14px;">
                  Répétition espacée programmée automatiquement : <strong>1ère révision prévue ${srs ? window.EpiUI.formatDueLabel(window.EpiSRS.daysUntil(srs.nextReviewAt)) : 'demain (J+1)'}</strong> (J+1 → J+3 → J+7 → J+14 → J+30).
                </p>
              </div>
              <div style="display:flex;flex-direction:column;gap:8px;">
                ${nextRec ? `<button class="btn btn-success btn-lg" data-action="${openLessonAction}" data-course="${esc(nextRec.course.id)}" data-lesson="${esc(nextRec.lesson.id)}" data-step="A">Leçon suivante recommandée →</button>` : ''}
                <button class="btn btn-secondary btn-sm" data-action="minitest-retry">Refaire le mini-test</button>
              </div>
            </div>
          </div>`;
      } else if (mt.scorePct >= passingScore && !memEvidence) {
        resultBanner = `
          <div class="alert alert-warning" style="margin-bottom:18px;align-items:center;justify-content:space-between;flex-wrap:wrap;">
            <div>
              <strong>Excellent score : ${mt.scorePct} % (${mt.correctCount}/${questions.length}) !</strong><br>
              Le mini-test est réussi. Pour activer la maîtrise SRS complète, terminez également vos Flashcards (au moins 2 cartes évaluées) et la phase À mémoriser.
            </div>
            <button class="btn btn-warning btn-sm" data-action="lesson-step" data-step="C">Aller aux Flashcards →</button>
          </div>`;
      } else {
        resultBanner = `
          <div class="alert alert-danger" style="margin-bottom:18px;align-items:center;justify-content:space-between;flex-wrap:wrap;">
            <div>
              <strong>Score obtenu : ${mt.scorePct} % (${mt.correctCount}/${questions.length}) — Seuil requis : ${passingScore} %</strong><br>
              La phase Mini-test reste <strong>En cours</strong>. Relisez les explications ci-dessous puis réessayez pour atteindre ≥ ${passingScore} %.
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button class="btn btn-secondary btn-sm" data-action="lesson-step" data-step="B">Revoir À mémoriser</button>
              <button class="btn btn-danger btn-sm" data-action="minitest-retry">Réessayer le mini-test</button>
            </div>
          </div>`;
      }
    }

    const objectivesHtml = lesson.miniTest && asArr(lesson.miniTest.objectives).length > 0 ? `
      <div class="j-mt-objectives">
        <strong>Objectifs évalués :</strong>
        <ul>${asArr(lesson.miniTest.objectives).map(o => `<li>${esc(o)}</li>`).join('')}</ul>
      </div>` : '';

    // Mode A : Une question du mini-test sélectionnée
    if (step.kind === 'minitest_q' && step.qcm) {
      const q = step.qcm;
      const sel = asArr(mt.answers[q.id]);
      const isCorr = mt.submitted && arraysEqualSet(sel, q.correct);
      const nextUnanswered = questions.find((qq, qi) => qi > step.qIndex && asArr(mt.answers[qq.id]).length === 0)
        || questions.find(qq => asArr(mt.answers[qq.id]).length === 0 && qq.id !== q.id);

      let footerPrimaryHtml = '';
      if (answeredCount === questions.length && !mt.submitted) {
        footerPrimaryHtml = `
          <button type="button" class="btn btn-success btn-lg" data-action="lesson-select-substep" data-phase="E" data-substep="mt_validate">
            Toutes les questions répondues — Aller à la validation finale ${icon('arrowRight', 18)}
          </button>`;
      } else if (nextUnanswered) {
        footerPrimaryHtml = `
          <button type="button" class="btn btn-primary btn-lg" data-action="lesson-select-substep" data-phase="E" data-substep="mtq_${esc(nextUnanswered.id)}">
            Question suivante non répondue ${icon('arrowRight', 18)}
          </button>`;
      } else {
        footerPrimaryHtml = `
          <button type="button" class="btn btn-primary btn-lg" data-action="lesson-select-substep" data-phase="E" data-substep="mt_validate">
            Voir le récapitulatif & valider ${icon('arrowRight', 18)}
          </button>`;
      }

      return `
        ${resultBanner}
        <div class="card j-workspace-card edu-phase-E">
          <div class="j-workspace-head">
            <div>
              <div class="j-workspace-kicker">
                <span class="edu-phase-pill edu-phase-pill-E">${icon('award', 13)} Mini-test · Seuil ≥ ${passingScore} %</span>
                <span class="j-step-id">Question ${step.number}/${questions.length} · ${esc(step.identifier)}</span>
                ${window.EpiJourneyUI.renderStatusBadge(sel.length > 0 ? 'completed' : 'in_progress', sel.length > 0 ? 'Répondue' : 'En cours')}
                ${lRec.miniTestBest !== null ? `<span class="badge ${lRec.miniTestBest >= passingScore ? 'badge-green' : 'badge-orange'}">Meilleur : ${lRec.miniTestBest} %</span>` : ''}
              </div>
              <h2 class="edu-h2 j-workspace-title">${esc(step.title)}</h2>
            </div>
            <span class="badge badge-neutral">${answeredCount}/${questions.length} répondues</span>
          </div>

          ${objectivesHtml}

          ${window.EpiUI.renderQcmCard(
            q,
            { selected: sel, submitted: mt.submitted, isCorrect: isCorr },
            { prefix: 'minitest', number: step.number, hideSubmit: true }
          )}

          ${window.EpiJourneyUI.renderStepFooterGuidance(phase, step, null, nextLesson, course.id, {
            prevPhase,
            isPreview,
            primaryActionHtml: footerPrimaryHtml
          })}
        </div>`;
    }

    // Mode B : Étape finale de validation du Mini-test (récapitulatif + soumission + corrections complètes)
    const checklistHtml = questions.map((q, idx) => {
      const sel = asArr(mt.answers[q.id]);
      const answered = sel.length > 0;
      const ok = mt.submitted && arraysEqualSet(sel, q.correct);
      return `
        <div class="j-mt-check-row ${mt.submitted ? (ok ? 'ok' : 'ko') : (answered ? 'answered' : '')}">
          <div style="min-width:0;flex:1;">
            <strong>Q${idx + 1}. ${esc(q.topic || q.id)}</strong>
            <div style="font-size:12.5px;color:var(--text-light);">
              ${mt.submitted
                ? (ok ? 'Bonne réponse ✓' : `Réponse(s) attendue(s) : ${q.correct.join(', ')} (votre choix : ${sel.join(', ') || '—'})`)
                : (answered ? `Réponse sélectionnée : ${sel.join(', ')}` : 'Pas encore répondue')}
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" data-action="lesson-select-substep" data-phase="E" data-substep="mtq_${esc(q.id)}">
            ${mt.submitted ? 'Voir la correction' : (answered ? 'Modifier' : 'Répondre →')}
          </button>
        </div>`;
    }).join('');

    const fullCorrectionsHtml = mt.submitted ? `
      <div style="margin-top:18px;">
        <h3 style="margin:0 0 12px;font-size:16px;">Correction détaillée des ${questions.length} questions</h3>
        ${questions.map((q, idx) => {
          const sel = asArr(mt.answers[q.id]);
          const ok = arraysEqualSet(sel, q.correct);
          return window.EpiUI.renderQcmCard(q, { selected: sel, submitted: true, isCorrect: ok }, { prefix: 'minitest', number: idx + 1, hideSubmit: true });
        }).join('')}
      </div>` : '';

    const submitBtnHtml = !mt.submitted ? `
      <button type="button" class="btn btn-primary btn-lg" data-action="minitest-submit" ${answeredCount < questions.length ? 'disabled' : ''}>
        Terminer la leçon & Corriger le mini-test (${answeredCount}/${questions.length})
      </button>` : `
      <button type="button" class="btn btn-secondary" data-action="minitest-retry">Refaire le mini-test</button>
      ${nextLesson && phase.isCompleted ? `<button type="button" class="btn btn-success btn-lg" data-action="${openLessonAction}" data-course="${esc(course.id)}" data-lesson="${esc(nextLesson.id)}" data-step="A">Passer à la leçon suivante ${icon('arrowRight', 18)}</button>` : ''}`;

    return `
      ${resultBanner}
      <div class="card j-workspace-card edu-phase-E">
        <div class="j-workspace-head">
          <div>
            <div class="j-workspace-kicker">
              <span class="edu-phase-pill edu-phase-pill-E">${icon('award', 13)} Validation Mini-test</span>
              <span class="j-step-id">Validation finale · ${esc(step.identifier)}</span>
              ${window.EpiJourneyUI.renderStatusBadge(phase.isCompleted ? 'completed' : 'in_progress')}
              ${lRec.miniTestBest !== null ? `<span class="badge ${lRec.miniTestBest >= passingScore ? 'badge-green' : 'badge-orange'}">Meilleur score : ${lRec.miniTestBest} %</span>` : ''}
            </div>
            <h2 class="edu-h2 j-workspace-title">${esc((lesson.miniTest && lesson.miniTest.title) || 'Validation du Mini-test')}</h2>
          </div>
        </div>

        ${objectivesHtml}

        <div class="j-mt-checklist">${checklistHtml}</div>

        ${window.EpiJourneyUI.renderStepFooterGuidance(phase, step, null, nextLesson, course.id, {
          prevPhase,
          isPreview,
          primaryActionHtml: submitBtnHtml
        })}

        ${fullCorrectionsHtml}
      </div>`;
  }

  return {
    getMiniTestQuestions,
    arraysEqualSet,
    renderCourseOverview,
    renderLessonStudio
  };
})();
