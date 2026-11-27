/* ==========================================================================
   EpiJourneyUI — Système de Composants Réutilisables de Navigation Pédagogique
   Utilisé globalement sur TOUS les modules, cours, chapitres, leçons, phases
   et étapes individuelles (existant + futurs cours importés PDF/PowerPoint).
   Icônes + textes explicites · Responsive Desktop & Mobile · Thème Clair/Sombre
   ========================================================================== */
window.EpiJourneyUI = (function () {
  const esc = (s) => window.EpiUI.esc(s);
  const icon = (n, s) => window.EpiIcons.get(n, s);

  // Statut lisible associant TOUJOURS icône + texte (jamais la couleur seule)
  function renderStatusBadge(status, extraText) {
    if (status === 'completed') {
      return `<span class="j-status j-status-done">${icon('checkCircle', 13)}<span>${esc(extraText || 'Terminée')}</span></span>`;
    }
    if (status === 'in_progress') {
      return `<span class="j-status j-status-progress">${icon('disc', 13)}<span>${esc(extraText || 'En cours')}</span></span>`;
    }
    return `<span class="j-status j-status-idle">${icon('circle', 13)}<span>${esc(extraText || 'Non commencée')}</span></span>`;
  }

  // ---- 1. BARRE & PANNEAU DE NAVIGATION DES LEÇONS DU COURS (remplace les pills L1.1/L1.2) ----
  function renderCourseLessonsNavigator(courseJourney, currentLessonId, opts) {
    const o = opts || {};
    const expanded = !!o.expanded;
    const openAction = o.isPreview ? 'admin-preview-lesson' : 'go-lesson';
    const lessons = courseJourney.lessons || [];
    const cur = lessons.find(l => l.id === currentLessonId) || lessons[0];

    const cardsHtml = lessons.map(lj => {
      const isCurrent = lj.id === currentLessonId;
      const effectiveStatus = lj.isCompleted ? 'completed' : (isCurrent || lj.status === 'in_progress' ? 'in_progress' : 'not_started');
      const targetPhaseKey = (lj.nextPhase && lj.nextPhase.key) || 'A';
      let actionLabel = 'Commencer';
      if (isCurrent) actionLabel = 'Leçon actuelle';
      else if (lj.isCompleted) actionLabel = 'Revoir';
      else if (lj.completedSteps > 0) actionLabel = 'Continuer';

      return `
        <div class="j-step-card ${isCurrent ? 'is-current' : ''} ${lj.isCompleted ? 'is-done' : ''}">
          <div class="j-step-card-head">
            <span class="j-step-num ${lj.isCompleted ? 'done' : (isCurrent ? 'current' : '')}">
              ${lj.isCompleted ? icon('check', 14) : lj.index}
            </span>
            <div class="j-step-meta">
              <span class="j-step-id">Leçon ${lj.index}/${lessons.length} · ${esc(lj.identifier)}</span>
              ${renderStatusBadge(effectiveStatus)}
            </div>
          </div>
          <div class="j-step-title">${esc(lj.title)}</div>
          <div class="j-step-desc">${esc(lj.description)}</div>
          <div class="j-step-progress-row">
            <span>${lj.completedPhases}/${lj.totalPhases} phases · ${lj.completedSteps}/${lj.totalSteps} étapes</span>
            <strong>${lj.pct} %</strong>
          </div>
          <div class="progress-bar j-mini-bar"><div class="progress-fill ${lj.isCompleted ? 'green' : ''}" style="width:${lj.pct}%"></div></div>
          <div class="j-step-card-foot">
            ${isCurrent ? `<span class="j-current-tag">${icon('disc', 12)} En cours de lecture</span>` : '<span></span>'}
            <button type="button" class="btn ${isCurrent ? 'btn-navy' : (lj.isCompleted ? 'btn-secondary' : 'btn-primary')} btn-sm"
              data-action="${openAction}" data-course="${esc(courseJourney.course.id)}" data-lesson="${esc(lj.id)}" data-step="${esc(targetPhaseKey)}"
              ${isCurrent ? 'disabled' : ''}>
              ${esc(actionLabel)}
            </button>
          </div>
        </div>`;
    }).join('');

    return `
      <section class="j-course-nav-box" aria-label="Navigation des leçons du cours">
        <div class="j-course-nav-bar">
          <div class="j-course-nav-summary">
            <div class="j-course-nav-kicker">
              ${icon('layers', 15)}
              <span>PARCOURS DU COURS · ${esc(courseJourney.course.code)}</span>
              <span class="j-pill-count">${courseJourney.completedLessons}/${courseJourney.totalLessons} leçons terminées — ${courseJourney.overallPct} %</span>
            </div>
            <div class="j-course-nav-current">
              Leçon <strong>${cur ? cur.index : 1}/${lessons.length}</strong> :
              <span>${esc(cur ? cur.title : '')}</span>
              ${cur ? `<span class="j-id-chip">${esc(cur.identifier)}</span>` : ''}
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm j-toggle-btn" data-action="toggle-course-lessons-nav" aria-expanded="${expanded ? 'true' : 'false'}">
            ${icon(expanded ? 'chevronUp' : 'chevronDown', 15)}
            <span>${expanded ? 'Masquer les leçons' : `Voir toutes les leçons (${lessons.length})`}</span>
          </button>
        </div>
        ${expanded ? `
          <div class="j-course-nav-panel">
            <div class="j-guidance-inline">
              ${icon('target', 15)}
              <span><strong>Guide du cours :</strong> ${esc(courseJourney.guidance)}</span>
            </div>
            <div class="j-steps-grid j-lessons-grid">${cardsHtml}</div>
          </div>` : ''}
      </section>`;
  }

  // ---- 2. STEPPER DES PHASES D'UNE LEÇON (remplace les anciens petits onglets A–E) ----
  function renderLessonPhasesStepper(lessonJourney, activePhaseKey) {
    const phases = lessonJourney.phases || [];
    const cols = phases.length;

    const cardsHtml = phases.map(p => {
      const isActive = p.key === activePhaseKey;
      const visualStatus = p.isCompleted ? 'completed' : (isActive || p.status === 'in_progress' ? 'in_progress' : 'not_started');
      let ctaLabel = 'Commencer';
      if (isActive) ctaLabel = 'Phase actuelle';
      else if (p.isCompleted) ctaLabel = 'Revoir';
      else if (p.completedCount > 0) ctaLabel = 'Continuer';

      return `
        <button type="button"
          class="j-phase-card edu-phase-${esc(p.key)} ${isActive ? 'is-current' : ''} ${p.isCompleted ? 'is-done' : ''}"
          data-action="lesson-step" data-step="${esc(p.key)}"
          aria-current="${isActive ? 'step' : 'false'}">
          <div class="j-phase-card-top">
            <span class="j-phase-badge">
              ${icon(p.icon, 14)}
              <span>${esc(p.code)}</span>
            </span>
            ${renderStatusBadge(visualStatus)}
          </div>
          <div class="j-phase-card-title">${esc(p.name)}</div>
          <div class="j-phase-card-progress">${esc(p.progressText)}</div>
          <div class="progress-bar j-mini-bar">
            <div class="progress-fill ${p.isCompleted ? 'green' : ''}" style="width:${p.pct}%"></div>
          </div>
          <div class="j-phase-card-foot">
            <span class="j-phase-cta">${esc(ctaLabel)}${isActive ? '' : ' →'}</span>
          </div>
        </button>`;
    }).join('');

    return `
      <section class="j-phases-section" aria-label="Phases d’apprentissage de la leçon">
        <div class="j-phases-header">
          <div>
            <div class="j-section-kicker">${icon('listChecks', 15)} PARCOURS DE LA LEÇON (${lessonJourney.completedPhases}/${lessonJourney.totalPhases} PHASES TERMINÉES — ${lessonJourney.overallPct} %)</div>
            <div class="j-section-sub">Complétez toutes les étapes de chaque phase dans l’ordre pour maîtriser la leçon.</div>
          </div>
          <div class="j-lesson-total-chip">
            <span>${lessonJourney.completedSteps}/${lessonJourney.totalSteps} étapes globales</span>
            ${renderStatusBadge(lessonJourney.status)}
          </div>
        </div>
        <div class="j-phases-grid" style="--phase-cols:${cols};">${cardsHtml}</div>
      </section>`;
  }

  // ---- 3. EN-TÊTE DE PHASE + CARTES DES ÉTAPES INDIVIDUELLES ----
  function renderPhaseOverviewAndSteps(phase, activeStepId, nextPhase, opts) {
    const o = opts || {};
    const collapsedSteps = !!o.collapsedSteps;
    const steps = phase.steps || [];
    const guidance = phase.guidance || { tone: 'info', headline: '', detail: '' };
    const isCompleted = phase.isCompleted;

    const guidanceCls = guidance.tone === 'success' ? 'j-guide-success' : (guidance.tone === 'primary' ? 'j-guide-primary' : 'j-guide-info');
    const guidanceIcon = guidance.tone === 'success' ? 'checkCircle' : (guidance.tone === 'primary' ? 'arrowRight' : 'target');

    const stepCardsHtml = steps.map((st, idx) => {
      const isCurrent = st.id === activeStepId;
      const stStatus = st.completed ? 'completed' : (isCurrent ? 'in_progress' : 'not_started');
      let btnText = 'Commencer';
      if (isCurrent) btnText = 'Étape actuelle';
      else if (st.completed) btnText = 'Revoir';
      else if (idx === 0 && phase.completedCount === 0) btnText = 'Commencer';
      else btnText = 'Ouvrir';

      return `
        <div class="j-step-card ${isCurrent ? 'is-current' : ''} ${st.completed ? 'is-done' : ''}" data-step-card="${esc(st.id)}">
          <div class="j-step-card-head">
            <span class="j-step-num ${st.completed ? 'done' : (isCurrent ? 'current' : '')}">
              ${st.completed ? icon('check', 14) : st.number}
            </span>
            <div class="j-step-meta">
              <span class="j-step-id">Étape ${st.number}/${steps.length} · ${esc(st.identifier)}</span>
              ${renderStatusBadge(stStatus)}
            </div>
          </div>
          <div class="j-step-title">${esc(st.title)}</div>
          ${st.description ? `<div class="j-step-desc">${esc(st.description)}</div>` : ''}
          <div class="j-step-card-foot">
            ${isCurrent
              ? `<span class="j-current-tag">${icon('disc', 12)} En cours maintenant</span>`
              : (phase.nextStep && phase.nextStep.id === st.id
                ? `<span class="j-next-tag">${icon('arrowRight', 12)} Prochaine étape</span>`
                : '<span></span>')}
            <button type="button"
              class="btn ${isCurrent ? 'btn-navy' : (st.completed ? 'btn-secondary' : 'btn-primary')} btn-sm"
              data-action="lesson-select-substep" data-phase="${esc(phase.key)}" data-substep="${esc(st.id)}"
              ${isCurrent ? 'aria-current="step"' : ''}>
              ${esc(btnText)}
            </button>
          </div>
        </div>`;
    }).join('');

    const nextPhaseCta = isCompleted && nextPhase ? `
      <button type="button" class="btn btn-success btn-sm" data-action="lesson-step" data-step="${esc(nextPhase.key)}">
        Passer à ${esc(nextPhase.name)} ${icon('arrowRight', 15)}
      </button>` : '';

    const jumpNextStepCta = !isCompleted && phase.nextStep && phase.nextStep.id !== activeStepId ? `
      <button type="button" class="btn btn-primary btn-sm" data-action="lesson-select-substep" data-phase="${esc(phase.key)}" data-substep="${esc(phase.nextStep.id)}">
        Aller à l’étape ${phase.nextStep.number} ${icon('arrowRight', 15)}
      </button>` : '';

    return `
      <div class="card j-phase-banner edu-phase-${esc(phase.key)}">
        <div class="j-phase-banner-top">
          <div>
            <div class="j-phase-banner-kicker">
              ${icon(phase.icon, 16)}
              <span>${esc(phase.code.toUpperCase())} — ${esc(phase.name.toUpperCase())}</span>
              ${renderStatusBadge(phase.status)}
            </div>
            <div class="j-phase-banner-metric">${esc(phase.progressText)}</div>
          </div>
          <div class="j-phase-banner-actions">
            ${nextPhaseCta || jumpNextStepCta}
            ${steps.length > 4 ? `
              <button type="button" class="btn btn-ghost btn-sm" data-action="toggle-phase-steps-list">
                ${icon(collapsedSteps ? 'chevronDown' : 'chevronUp', 15)}
                <span>${collapsedSteps ? `Afficher les ${steps.length} étapes` : 'Réduire la liste'}</span>
              </button>` : ''}
          </div>
        </div>

        <div class="progress-bar j-phase-bar">
          <div class="progress-fill ${isCompleted ? 'green' : ''}" style="width:${phase.pct}%"></div>
        </div>

        <div class="j-guidance-banner ${guidanceCls}">
          <div class="j-guidance-icon">${icon(guidanceIcon, 18)}</div>
          <div class="j-guidance-copy">
            <strong>${esc(guidance.headline)}</strong>
            <span>${esc(guidance.detail)}</span>
            <div class="j-requirement-note">${esc(phase.requirementText)}</div>
          </div>
        </div>

        ${!collapsedSteps ? `
          <div class="j-steps-grid" role="list" aria-label="Étapes requises de la phase ${esc(phase.name)}">
            ${stepCardsHtml}
          </div>` : ''}
      </div>`;
  }

  // ---- 4. BARRE DE GUIDAGE EN BAS DE CHAQUE ÉTAPE ----
  function renderStepFooterGuidance(phase, activeStep, nextPhase, nextLesson, courseId, opts) {
    const o = opts || {};
    const steps = phase.steps || [];
    const curIdx = steps.findIndex(s => s.id === (activeStep && activeStep.id));
    const prevStep = curIdx > 0 ? steps[curIdx - 1] : null;
    const nextSequentialStep = curIdx >= 0 && curIdx < steps.length - 1 ? steps[curIdx + 1] : null;
    const nextIncompleteStep = steps.find((s, i) => i > curIdx && !s.completed) || steps.find(s => !s.completed && s.id !== (activeStep && activeStep.id)) || null;
    const openLessonAction = o.isPreview ? 'admin-preview-lesson' : 'go-lesson';

    let rightHtml = '';
    if (o.primaryActionHtml) {
      rightHtml = o.primaryActionHtml;
    } else if (phase.isCompleted && nextPhase) {
      rightHtml = `
        <button type="button" class="btn btn-success btn-lg" data-action="lesson-step" data-step="${esc(nextPhase.key)}">
          Passer maintenant à : ${esc(nextPhase.name)} ${icon('arrowRight', 18)}
        </button>`;
    } else if (phase.isCompleted && !nextPhase && nextLesson) {
      rightHtml = `
        <button type="button" class="btn btn-success btn-lg" data-action="${openLessonAction}" data-course="${esc(courseId)}" data-lesson="${esc(nextLesson.id)}" data-step="A">
          Passer à la leçon suivante : ${esc(nextLesson.title)} ${icon('arrowRight', 18)}
        </button>`;
    } else if (nextIncompleteStep) {
      rightHtml = `
        <button type="button" class="btn btn-primary btn-lg" data-action="lesson-select-substep" data-phase="${esc(phase.key)}" data-substep="${esc(nextIncompleteStep.id)}">
          Continuer avec l’étape ${nextIncompleteStep.number} ${icon('arrowRight', 18)}
        </button>`;
    } else if (nextSequentialStep) {
      rightHtml = `
        <button type="button" class="btn btn-primary btn-lg" data-action="lesson-select-substep" data-phase="${esc(phase.key)}" data-substep="${esc(nextSequentialStep.id)}">
          Étape suivante (${nextSequentialStep.number}/${steps.length}) ${icon('arrowRight', 18)}
        </button>`;
    }

    const leftHtml = prevStep
      ? `<button type="button" class="btn btn-secondary" data-action="lesson-select-substep" data-phase="${esc(phase.key)}" data-substep="${esc(prevStep.id)}">${icon('arrowLeft', 16)} Étape précédente (${prevStep.number}/${steps.length})</button>`
      : (o.prevPhase
        ? `<button type="button" class="btn btn-secondary" data-action="lesson-step" data-step="${esc(o.prevPhase.key)}">${icon('arrowLeft', 16)} Phase précédente : ${esc(o.prevPhase.shortName)}</button>`
        : '<span></span>');

    return `
      <div class="j-step-footer">
        <div>${leftHtml}</div>
        <div class="j-step-footer-right">${rightHtml}</div>
      </div>`;
  }

  return {
    renderStatusBadge,
    renderCourseLessonsNavigator,
    renderLessonPhasesStepper,
    renderPhaseOverviewAndSteps,
    renderStepFooterGuidance
  };
})();
