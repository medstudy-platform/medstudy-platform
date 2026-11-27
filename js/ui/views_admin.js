/* ==========================================================================
   EpiViewsAdmin — Système de Gestion de Contenu (CMS) Propriétaire MedStudy
   Gestion multi-matières : Cours, Upload PDF, Extraction IA, Éditeur & Sécurité
   ========================================================================== */
window.EpiViewsAdmin = (function () {
  const esc = (s) => window.EpiUI.esc(s);
  const asArr = (v) => window.EpiUI.asArr(v);
  const icon = (n, s) => window.EpiIcons.get(n, s);

  const SUBJECT_SUGGESTIONS = [
    'Épidémiologie', 'Cardiologie', 'Pneumologie', 'Neurologie',
    'Anatomie', 'Physiologie', 'Pharmacologie', 'Pathologie',
    'Sémiologie', 'Microbiologie', 'Biochimie', 'Histologie'
  ];

  function provenanceBadge(prov) {
    if (prov === 'source_explicit') return '<span class="badge badge-prov-source">📄 Extrait source</span>';
    if (prov === 'needs_verification') return '<span class="badge badge-prov-verify">⚠️ À vérifier</span>';
    return '<span class="badge badge-prov-ai">✨ Reformulation IA sourcée</span>';
  }

  function renderPipelineTracker(job, course) {
    if (!job) return '';
    const stages = asArr(job.stages);
    const logs = asArr(job.logs);
    const pct = Number(job.progressPct) || 0;
    const isRunning = job.status === 'running' || job.status === 'queued';
    const isFailed = job.status === 'failed';
    const isDone = job.status === 'completed';

    const statusBadgeHtml = isDone
      ? '<span class="badge badge-green">✓ Brouillon complet prêt pour révision</span>'
      : (isFailed
        ? `<span class="badge badge-red">✕ Interrompu à l’étape ${job.currentStage || 1}/11</span>`
        : `<span class="badge badge-medium">⏳ Traitement en cours (${pct} %)…</span>`);

    const stageDot = (st) => {
      if (st.status === 'done') return '✓';
      if (st.status === 'warning') return '!';
      if (st.status === 'failed') return '✕';
      if (st.status === 'running') return '…';
      return String(st.index);
    };

    return `
      <div class="pipeline-card" id="medstudy-pipeline-tracker">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:10px;">
          <div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">
              <strong style="font-size:15.5px;color:var(--navy);">Pipeline Universel MedStudy (11 étapes)</strong>
              ${statusBadgeHtml}
              <span class="badge badge-neutral">Job ${esc(job.id)}</span>
              <span class="badge badge-neutral">Moteur : ${esc(job.aiMode || 'deterministic_medical')}</span>
            </div>
            <div style="font-size:12.5px;color:var(--text-light);">
              Étape active : <strong>${job.currentStage || 1}/11</strong> (${esc(job.currentStageKey || '')})
              ${job.retryCount > 0 ? ` · ${job.retryCount} reprise(s)` : ''}
            </div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${isFailed ? `
              <button type="button" class="btn btn-warning btn-sm" data-action="admin-retry-job-stage" data-jid="${esc(job.id)}" data-stage="${job.currentStage || 1}">
                ↻ Réessayer l’étape ${job.currentStage || 1}
              </button>
              <button type="button" class="btn btn-secondary btn-sm" data-action="admin-start-pipeline" data-cid="${esc(course.id)}">
                ↻ Relancer depuis l’étape 1
              </button>` : ''}
            ${isDone ? `
              <button type="button" class="btn btn-secondary btn-sm" data-action="admin-preview-course" data-cid="${esc(course.id)}">
                👁 Prévisualiser (Vue Étudiant)
              </button>
              <button type="button" class="btn btn-primary btn-sm" data-action="admin-open-editor" data-cid="${esc(course.id)}">
                Ouvrir le Studio de Révision & Contrôle Qualité →
              </button>` : ''}
          </div>
        </div>

        <div class="progress-bar" style="height:10px;">
          <div class="progress-fill ${isDone ? 'green' : (isFailed ? 'orange' : '')}" style="width:${pct}%;"></div>
        </div>

        ${isFailed && job.errorMessage ? `
          <div class="alert alert-danger" style="margin:12px 0 0;">
            ${icon('alert', 18)}
            <div><strong>Erreur détectée :</strong> ${esc(job.errorMessage)}</div>
          </div>` : ''}

        <div class="pipeline-stages-grid">
          ${stages.map(st => `
            <div class="pipeline-stage ${esc(st.status || 'pending')}">
              <div class="pipeline-stage-dot">${stageDot(st)}</div>
              <div style="min-width:0;flex:1;">
                <div style="font-weight:700;color:var(--navy);">${esc(st.label)}</div>
                ${st.message ? `<div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${esc(st.message)}</div>` : `<div style="font-size:11.5px;color:var(--text-light);">${st.status === 'running' ? 'Exécution en cours…' : 'En attente'}</div>`}
              </div>
            </div>`).join('')}
        </div>

        ${logs.length > 0 ? `
          <details style="margin-top:12px;" ${isFailed || isRunning ? 'open' : ''}>
            <summary style="font-size:12.5px;font-weight:700;color:var(--text-muted);cursor:pointer;">Journal détaillé du traitement (${logs.length} entrées)</summary>
            <div class="pipeline-logs-box">
              ${logs.map(l => `<div><span style="color:var(--text-light);">[E${l.stage || '-'}]</span> <span style="color:${l.level === 'error' ? '#fca5a5' : (l.level === 'warning' ? '#fcd34d' : '#93c5fd')};">${esc(l.key || '')}</span> : ${esc(l.message)}</div>`).join('')}
            </div>
          </details>` : ''}
      </div>`;
  }

  const ACCENT_PALETTE = [
    '#1d4ed8', '#0f766e', '#7c3aed', '#b45309', '#be123c', '#0369a1', '#047857', '#4338ca'
  ];

  function getModMap(adminData) {
    const map = {};
    asArr(adminData && adminData.modules).forEach(m => { map[m.id] = m; });
    return map;
  }

  // ==================== 1. GESTION CENTRALE DES COURS ====================
  function renderCoursesManager(adminData, adminState) {
    const courses = asArr(adminData.courses);
    const modules = asArr(adminData.modules);
    const flashcards = asArr(adminData.flashcards);
    const qcms = asArr(adminData.qcms);
    const modMap = getModMap(adminData);

    const f = adminState.filters || { status: 'all', moduleId: 'all', search: '' };
    const q = (f.search || '').trim().toLowerCase();

    const cntAll = courses.length;
    const cntPub = courses.filter(c => c.status === 'published').length;
    const cntDraft = courses.filter(c => c.status === 'draft').length;
    const cntArch = courses.filter(c => c.status === 'archived').length;

    const filtered = courses.filter(c => {
      if (f.status !== 'all' && c.status !== f.status) return false;
      if (f.moduleId !== 'all' && c.moduleId !== f.moduleId) return false;
      if (q) {
        const m = modMap[c.moduleId];
        const hay = `${c.title} ${c.code} ${c.professor || ''} ${m ? m.title + ' ' + (m.subject || '') : ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));

    const rowsHtml = filtered.map(c => {
      const m = modMap[c.moduleId];
      const lessonsCount = asArr(c.lessons).length;
      const fcCount = flashcards.filter(x => x.courseId === c.id).length;
      const qCount = qcms.filter(x => x.courseId === c.id).length;
      const attCount = asArr(c.attachments).length;
      const isPpt = !!(c.pptImport && c.pptImport.isPowerPoint);
      const ov = isPpt && c.pptImport.overlapInfo && c.pptImport.overlapInfo.hasOverlap ? c.pptImport.overlapInfo : null;
      const needsRev = (c.aiExtraction && c.aiExtraction.status === 'needs_review') ||
        asArr(c.lessons).some(l => l.needsReview);

      return `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:3px;">
              <span class="course-code-pill">${esc(c.code)}</span>
              ${isPpt ? `<span class="badge badge-medium">PPT · ${c.pptImport.slidesProcessed} diapos</span>` : ''}
              <strong style="color:var(--navy);">${esc(c.title)}</strong>
              ${needsRev && c.status === 'draft' ? '<span class="badge badge-vigilance">À relire</span>' : ''}
              ${ov && ov.resolution === 'pending' ? `<span class="badge badge-orange">⚠️ Chevauche ${esc(ov.matchedCourseCode)}</span>` : ''}
            </div>
            <div style="font-size:12px;color:var(--text-light);">
              ${esc(c.professor || 'Faculté de Médecine')} · ${attCount} fichier${attCount > 1 ? 's' : ''} joint${attCount > 1 ? 's' : ''}
              ${isPpt && asArr(c.pptImport.manualReviewSlides).length > 0 ? ` · <span style="color:var(--sem-amber);">${asArr(c.pptImport.manualReviewSlides).length} diapo(s) à vérifier</span>` : ''}
            </div>
          </td>
          <td>
            <span class="badge badge-medium" style="margin-bottom:3px;">${esc((m && m.subject) || 'Médecine')}</span>
            <div style="font-size:12.5px;color:var(--text-muted);">${esc(m ? m.title : 'Module inconnu')}</div>
          </td>
          <td style="font-variant-numeric:tabular-nums;">
            <strong>${lessonsCount}</strong> leçon${lessonsCount > 1 ? 's' : ''}
            <div style="font-size:12px;color:var(--text-light);">${fcCount} flashcards · ${qCount} QCM</div>
          </td>
          <td>
            ${window.EpiUI.statusBadge(c.status)}
            <div style="font-size:11.5px;color:var(--text-light);margin-top:3px;">v${c.version || 1}</div>
          </td>
          <td style="font-size:12.5px;color:var(--text-muted);white-space:nowrap;">${window.EpiUI.formatDateFR(c.createdAt)}</td>
          <td style="font-size:12.5px;color:var(--text-muted);white-space:nowrap;">${window.EpiUI.formatDateFR(c.updatedAt)}</td>
          <td>
            <div class="admin-row-actions">
              <button type="button" class="btn btn-secondary btn-sm" data-action="admin-preview-course" data-cid="${esc(c.id)}" title="Prévisualiser dans l’interface étudiant">
                👁 Aperçu
              </button>
              <button type="button" class="btn btn-primary btn-sm" data-action="admin-open-editor" data-cid="${esc(c.id)}" title="Éditer et réviser">
                ${icon('edit', 14)} Éditer
              </button>
              ${c.status === 'published'
                ? `<button type="button" class="btn btn-warning btn-sm" data-action="admin-set-status" data-cid="${esc(c.id)}" data-status="draft" title="Retirer de la vue étudiant sans supprimer leur progrès">Dépublier</button>`
                : `<button type="button" class="btn btn-success btn-sm" data-action="admin-set-status" data-cid="${esc(c.id)}" data-status="published" title="Rendre visible aux étudiants">Publier</button>`}
              <button type="button" class="btn btn-secondary btn-sm" data-action="admin-duplicate-course" data-cid="${esc(c.id)}" title="Dupliquer en brouillon">${icon('copy', 14)}</button>
              ${c.status !== 'archived'
                ? `<button type="button" class="btn btn-secondary btn-sm" data-action="admin-set-status" data-cid="${esc(c.id)}" data-status="archived" title="Archiver">${icon('archive', 14)}</button>`
                : ''}
              <button type="button" class="btn btn-ghost btn-sm" style="color:var(--red);" data-action="admin-delete-course" data-cid="${esc(c.id)}" title="Supprimer (avec sauvegarde préalable)">${icon('trash', 14)}</button>
            </div>
          </td>
        </tr>`;
    }).join('');

    return `
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header" style="margin-bottom:14px;">
          <div>
            <h2 class="card-title">${icon('layers', 20)} Gestion centrale des cours (CMS Administrateur)</h2>
            <p class="card-subtitle">Ajoutez, analysez par IA, relisez, publiez, dépubliez ou archivez vos cours pour toutes les disciplines médicales.</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button type="button" class="btn btn-secondary btn-sm" data-action="nav" data-route="admin_modules">${icon('book', 15)} Gérer les modules</button>
            <button type="button" class="btn btn-primary" data-action="admin-go-add">${icon('plus', 16)} Ajouter un cours</button>
          </div>
        </div>

        <div class="kpi-grid" style="margin:0 0 18px;">
          <div class="admin-kpi" data-action="admin-filter-status" data-status="all">
            <span>Total des cours</span><strong>${cntAll}</strong>
          </div>
          <div class="admin-kpi green" data-action="admin-filter-status" data-status="published">
            <span>Publiés (étudiants)</span><strong>${cntPub}</strong>
          </div>
          <div class="admin-kpi orange" data-action="admin-filter-status" data-status="draft">
            <span>Brouillons</span><strong>${cntDraft}</strong>
          </div>
          <div class="admin-kpi neutral" data-action="admin-filter-status" data-status="archived">
            <span>Archivés</span><strong>${cntArch}</strong>
          </div>
        </div>

        <div class="filter-bar" style="margin-bottom:0;">
          <div class="time-selector">
            <button type="button" class="time-pill ${f.status === 'all' ? 'active' : ''}" data-action="admin-filter-status" data-status="all">Tous (${cntAll})</button>
            <button type="button" class="time-pill ${f.status === 'draft' ? 'active' : ''}" data-action="admin-filter-status" data-status="draft">Brouillons (${cntDraft})</button>
            <button type="button" class="time-pill ${f.status === 'published' ? 'active' : ''}" data-action="admin-filter-status" data-status="published">Publiés (${cntPub})</button>
            <button type="button" class="time-pill ${f.status === 'archived' ? 'active' : ''}" data-action="admin-filter-status" data-status="archived">Archivés (${cntArch})</button>
          </div>
          <input type="search" class="input" style="flex:1;min-width:200px;" placeholder="Rechercher titre, code, matière, enseignant…" value="${esc(f.search || '')}" data-filter="admin-search">
          <select class="select" data-filter="admin-module">
            <option value="all" ${f.moduleId === 'all' ? 'selected' : ''}>Tous les modules (${modules.length})</option>
            ${modules.map(m => `<option value="${esc(m.id)}" ${f.moduleId === m.id ? 'selected' : ''}>${esc(m.subject || 'Médecine')} — ${esc(m.title)}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Cours</th>
              <th>Module & Matière</th>
              <th>Contenu</th>
              <th>Statut</th>
              <th>Création</th>
              <th>Dernière MAJ</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || `<tr><td colspan="7" class="empty-state">Aucun cours dans ce filtre.</td></tr>`}
          </tbody>
        </table>
      </div>`;
  }

  // ==================== 2. WORKFLOW UNIVERSEL "AJOUTER UN COURS" ====================
  function renderAddCourse(adminData, adminState) {
    const modules = asArr(adminData.modules);
    const wizard = adminState.addWizard || {
      createdCourseId: null,
      showNewModule: false,
      selectedModuleId: modules[0] ? modules[0].id : '',
      analyzing: false,
      uploading: false,
      pendingFiles: [],
      pendingSupportFiles: [],
      activeJob: null
    };

    const createdCourse = wizard.createdCourseId
      ? asArr(adminData.courses).find(c => c.id === wizard.createdCourseId)
      : null;

    if (!createdCourse) {
      const pendingPrimary = asArr(wizard.pendingFiles);
      const pendingSupport = asArr(wizard.pendingSupportFiles);
      return `
        <div style="margin-bottom:14px;">
          <button type="button" class="btn btn-ghost btn-sm" data-action="nav" data-route="admin_courses">${icon('arrowLeft', 16)} Retour à Gestion des cours</button>
        </div>

        <div class="card" style="max-width:920px;margin:0 auto;">
          <div class="card-header">
            <div>
              <h2 class="card-title">${icon('plus', 20)} Ajouter un nouveau cours médical (Moteur Universel)</h2>
              <p class="card-subtitle">Téléversez un PDF ou PowerPoint (.pptx / .ppt) et cliquez sur un seul bouton : MedStudy exécute le pipeline complet en 11 étapes au standard pédagogique des 12 cours originaux.</p>
            </div>
            <span class="badge badge-orange">Toujours créé en Brouillon</span>
          </div>

          <div class="form-grid" style="margin-bottom:16px;">
            <div class="form-field" style="grid-column:1 / -1;">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:4px;">
                <label for="add-course-module">Module médical *</label>
                <button type="button" class="btn btn-ghost btn-sm" data-action="admin-toggle-inline-module">
                  ${wizard.showNewModule ? '✕ Annuler le nouveau module' : '+ Créer un nouveau module médical'}
                </button>
              </div>
              <select id="add-course-module" name="moduleId" class="select" style="width:100%;" data-action="admin-wizard-module-change">
                ${modules.map(m => `<option value="${esc(m.id)}" ${wizard.selectedModuleId === m.id ? 'selected' : ''}>${esc(m.subject || 'Médecine')} — ${esc(m.code)} : ${esc(m.title)}</option>`).join('')}
              </select>
            </div>
          </div>

          ${wizard.showNewModule ? `
            <div class="admin-subpanel" style="margin-bottom:18px;">
              <h4 style="margin:0 0 10px;font-size:14.5px;color:var(--navy);">Créer un nouveau module médical (toute spécialité)</h4>
              <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">
                ${SUBJECT_SUGGESTIONS.map(s => `<button type="button" class="time-pill" data-action="admin-pick-subject" data-target="inline-mod-subject" data-val="${esc(s)}">${esc(s)}</button>`).join('')}
              </div>
              <div class="form-grid">
                <div class="form-field">
                  <label for="inline-mod-subject">Discipline / Matière *</label>
                  <input id="inline-mod-subject" type="text" class="input" placeholder="Ex. Pharmacologie, Anatomie, Cardiologie…">
                </div>
                <div class="form-field">
                  <label for="inline-mod-title">Titre du module *</label>
                  <input id="inline-mod-title" type="text" class="input" placeholder="Ex. Pharmacologie Générale & Clinique">
                </div>
                <div class="form-field">
                  <label for="inline-mod-code">Code court</label>
                  <input id="inline-mod-code" type="text" class="input" placeholder="Ex. PHARMA-1">
                </div>
                <div class="form-field">
                  <label for="inline-mod-accent">Couleur d’accent</label>
                  <select id="inline-mod-accent" class="select">
                    ${ACCENT_PALETTE.map((col, idx) => `<option value="${col}">Palette #${idx + 1} (${col})</option>`).join('')}
                  </select>
                </div>
                <div class="form-field" style="grid-column:1 / -1;">
                  <label for="inline-mod-desc">Description</label>
                  <input id="inline-mod-desc" type="text" class="input" placeholder="Brève présentation du module médical">
                </div>
              </div>
              <div style="margin-top:10px;display:flex;justify-content:flex-end;">
                <button type="button" class="btn btn-navy btn-sm" data-action="admin-create-inline-module">${icon('plus', 14)} Créer et sélectionner ce module</button>
              </div>
            </div>` : ''}

          <form data-form="admin-create-course">
            <input type="hidden" name="moduleId" value="${esc(wizard.selectedModuleId || (modules[0] && modules[0].id) || '')}">
            <div class="form-grid">
              <div class="form-field" style="grid-column:1 / -1;">
                <label for="add-course-title">Titre complet du cours *</label>
                <input id="add-course-title" name="title" type="text" class="input" required minlength="3" placeholder="Ex. Pharmacocinétique : Absorption, Distribution, Métabolisme et Élimination">
              </div>
              <div class="form-field">
                <label for="add-course-code">Code du cours</label>
                <input id="add-course-code" name="code" type="text" class="input" placeholder="Ex. CARD1, NEURO2 (auto si vide)">
              </div>
              <div class="form-field">
                <label for="add-course-year">Année académique</label>
                <input id="add-course-year" name="academicYear" type="text" class="input" placeholder="Ex. 4ème Année Médecine · 2025-2026">
              </div>
              <div class="form-field">
                <label for="add-course-prof">Enseignant / Service</label>
                <input id="add-course-prof" name="professor" type="text" class="input" placeholder="Ex. Pr. Benali — CHU (détecté auto si présent dans le support)">
              </div>
              <div class="form-field">
                <label for="add-course-priority">Priorité d’examen estimée</label>
                <select id="add-course-priority" name="priority" class="select">
                  <option value="medium" selected>Priorité moyenne</option>
                  <option value="high">Haute priorité</option>
                  <option value="very_high">Très Haute priorité</option>
                  <option value="low">Priorité faible</option>
                </select>
              </div>
              <div class="form-field">
                <label for="add-course-semester">Semestre / Unité (optionnel)</label>
                <input id="add-course-semester" name="semester" type="text" class="input" placeholder="Ex. Semestre 1 · Unité Cardio-Respiratoire">
              </div>
              <div class="form-field">
                <label for="add-course-tags">Mots-clés / Métadonnées (optionnel)</label>
                <input id="add-course-tags" name="tags" type="text" class="input" placeholder="Ex. ECG, sémiologie, urgence">
              </div>
              <div class="form-field" style="grid-column:1 / -1;">
                <label for="add-course-summary">Description / Objectifs pédagogiques</label>
                <textarea id="add-course-summary" name="summary" rows="2" class="input" placeholder="Résumé des objectifs clés de ce cours…"></textarea>
              </div>
            </div>

            <div class="two-col" style="margin-top:16px;grid-template-columns:1fr 1fr;">
              <div class="upload-zone">
                <div style="font-weight:700;color:var(--navy);margin-bottom:4px;">${icon('fileText', 18)} Fichier source principal (PDF, PPTX ou PPT)</div>
                <p style="font-size:12.5px;color:var(--text-light);margin:0 0 10px;">Extraction complète : titres, définitions, tableaux, graphiques, SmartArt, formules, notes, OCR & traçabilité (max 35 Mo).</p>
                <label class="btn btn-primary btn-sm" style="cursor:pointer;">
                  ${icon('upload', 15)} Choisir un fichier PDF ou PowerPoint
                  <input type="file" id="wizard-primary-file-input" accept=".pdf,.pptx,.ppt,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint" multiple style="display:none;" data-action="admin-wizard-select-files" data-kind="primary_source">
                </label>
                ${pendingPrimary.length > 0 ? `
                  <div style="margin-top:10px;width:100%;display:flex;flex-direction:column;gap:4px;">
                    ${pendingPrimary.map(f => `<div style="font-size:12.5px;color:var(--sem-green);background:var(--green-soft);border:1px solid var(--green-border);padding:5px 8px;border-radius:7px;">✓ <strong>${esc(f.name)}</strong> (${window.EpiUI.formatBytes(f.size)})</div>`).join('')}
                  </div>` : ''}
              </div>

              <div class="upload-zone secondary">
                <div style="font-weight:700;color:var(--navy);margin-bottom:4px;">${icon('bookmark', 18)} Documents annexes (optionnel)</div>
                <p style="font-size:12.5px;color:var(--text-light);margin:0 0 10px;">TD, schémas complémentaires, fiches (<code>PDF, PPTX, PPT, TXT, MD, DOCX, PNG, JPG</code>).</p>
                <label class="btn btn-secondary btn-sm" style="cursor:pointer;">
                  ${icon('upload', 15)} Joindre des annexes
                  <input type="file" accept=".pdf,.pptx,.ppt,.txt,.md,.docx,.png,.jpg,.jpeg" multiple style="display:none;" data-action="admin-wizard-select-files" data-kind="support_doc">
                </label>
                ${pendingSupport.length > 0 ? `
                  <div style="margin-top:10px;width:100%;display:flex;flex-direction:column;gap:4px;">
                    ${pendingSupport.map(f => `<div style="font-size:12px;color:var(--text-muted);background:var(--surface);border:1px solid var(--border-strong);padding:4px 8px;border-radius:7px;">📎 ${esc(f.name)} (${window.EpiUI.formatBytes(f.size)})</div>`).join('')}
                  </div>` : ''}
              </div>
            </div>

            <div style="margin-top:20px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
              <button type="button" class="btn btn-secondary" data-action="nav" data-route="admin_courses">Annuler</button>
              <button type="submit" class="btn btn-navy btn-lg" ${wizard.uploading || wizard.analyzing ? 'disabled' : ''}>
                ${icon('sparkle', 18)} ${pendingPrimary.length > 0 ? 'Téléverser & Analyser le cours (Pipeline 11 étapes)' : 'Créer le brouillon & Téléverser →'}
              </button>
            </div>
          </form>
        </div>`;
    }

    // Vue Suivi du cours créé : Fichiers + Pipeline 11 étapes en direct
    const attachments = asArr(createdCourse.attachments);
    const primarySources = attachments.filter(a => a.kind === 'primary_pdf' || a.kind === 'primary_ppt');
    const mod = getModMap(adminData)[createdCourse.moduleId];
    const activeJob = wizard.activeJob || asArr(adminData.importJobs).find(j => j.courseId === createdCourse.id) || null;

    return `
      <div style="margin-bottom:14px;">
        <button type="button" class="btn btn-ghost btn-sm" data-action="nav" data-route="admin_courses">${icon('arrowLeft', 16)} Retour à Gestion des cours</button>
      </div>

      <div class="card" style="max-width:960px;margin:0 auto;">
        <div class="card-header">
          <div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <span class="course-code-pill">${esc(createdCourse.code)}</span>
              <span class="badge badge-medium">${esc((mod && mod.subject) || 'Médecine')}</span>
              ${createdCourse.academicYear ? `<span class="badge badge-neutral">${esc(createdCourse.academicYear)}</span>` : ''}
              ${window.EpiUI.statusBadge(createdCourse.status)}
            </div>
            <h2 class="card-title">${esc(createdCourse.title)}</h2>
            <p class="card-subtitle">Téléversez vos supports PDF / PowerPoint puis lancez le moteur universel de traitement en 11 étapes.</p>
          </div>
        </div>

        <div class="two-col" style="margin-bottom:18px;grid-template-columns:1fr 1fr;">
          <div class="upload-zone">
            <div style="font-weight:700;color:var(--navy);margin-bottom:4px;">${icon('fileText', 18)} Support principal : PDF ou PowerPoint (.pptx / .ppt)</div>
            <p style="font-size:12.5px;color:var(--text-light);margin:0 0 12px;">Formats vérifiés : <code>.pdf</code>, <code>.pptx</code>, <code>.ppt</code> (max 35 Mo).</p>
            <label class="btn btn-primary btn-sm" style="cursor:pointer;">
              ${icon('upload', 15)} ${wizard.uploading ? 'Téléversement en cours…' : 'Ajouter PDF ou PowerPoint'}
              <input type="file" accept=".pdf,.pptx,.ppt,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint" multiple style="display:none;" data-action="admin-upload-files" data-cid="${esc(createdCourse.id)}" data-kind="primary_source" ${wizard.uploading ? 'disabled' : ''}>
            </label>
          </div>

          <div class="upload-zone secondary">
            <div style="font-weight:700;color:var(--navy);margin-bottom:4px;">${icon('bookmark', 18)} Documents annexes (optionnel)</div>
            <p style="font-size:12.5px;color:var(--text-light);margin:0 0 12px;">Fiches TD, schémas, annexes (<code>PDF, PPTX, PPT, TXT, MD, DOCX, PNG, JPG</code>).</p>
            <label class="btn btn-secondary btn-sm" style="cursor:pointer;">
              ${icon('upload', 15)} Ajouter des annexes
              <input type="file" accept=".pdf,.pptx,.ppt,.txt,.md,.docx,.png,.jpg,.jpeg" multiple style="display:none;" data-action="admin-upload-files" data-cid="${esc(createdCourse.id)}" data-kind="support_doc" ${wizard.uploading ? 'disabled' : ''}>
            </label>
          </div>
        </div>

        ${renderAttachmentsList(createdCourse)}

        ${activeJob ? renderPipelineTracker(activeJob, createdCourse) : ''}

        <div style="margin-top:20px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
          <button type="button" class="btn btn-secondary" data-action="admin-open-editor" data-cid="${esc(createdCourse.id)}">
            Ouvrir le Studio de Révision →
          </button>
          <button type="button" class="btn btn-navy btn-lg" data-action="admin-start-pipeline" data-cid="${esc(createdCourse.id)}" ${primarySources.length === 0 || wizard.analyzing ? 'disabled' : ''}>
            ${icon('sparkle', 18)} ${wizard.analyzing ? 'Pipeline 11 étapes en cours…' : (activeJob ? '↻ Relancer le Pipeline complet (11 étapes)' : 'Analyser le cours (Pipeline 11 étapes)')}
          </button>
        </div>
      </div>`;
  }

  function renderAttachmentsList(course) {
    const attachments = asArr(course.attachments);
    if (!attachments.length) {
      return `<div style="padding:14px;border:1px dashed var(--border-strong);border-radius:10px;text-align:center;color:var(--text-light);font-size:13.5px;">Aucun fichier téléversé pour ce cours pour le moment.</div>`;
    }
    return `
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${attachments.map(a => `
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px;border:1px solid var(--border);border-radius:10px;background:var(--surface-soft);flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:10px;min-width:0;">
              ${icon('fileText', 17)}
              <div style="min-width:0;">
                <strong style="font-size:13.5px;color:var(--navy);">${esc(a.originalName)}</strong>
                <div style="font-size:12px;color:var(--text-light);">
                  <span class="badge ${a.kind === 'primary_pdf' || a.kind === 'primary_ppt' ? 'badge-medium' : 'badge-neutral'}">${a.kind === 'primary_ppt' ? 'PowerPoint principal' : (a.kind === 'primary_pdf' ? 'PDF principal' : 'Annexe')}</span>
                  · ${window.EpiUI.formatBytes(a.sizeBytes)}
                  ${a.pageCount ? ` · <strong>${a.pageCount} ${a.kind === 'primary_ppt' ? 'diapositive' : 'page'}${a.pageCount > 1 ? 's' : ''}</strong>` : ''}
                </div>
              </div>
            </div>
            <div style="display:flex;gap:8px;">
              <a class="btn btn-secondary btn-sm" href="${window.EpiAPI.fileUrl(a.id)}" target="_blank" rel="noopener">Ouvrir</a>
              <button type="button" class="btn btn-ghost btn-sm" style="color:var(--red);" data-action="admin-delete-file" data-cid="${esc(course.id)}" data-fid="${esc(a.id)}">${icon('trash', 14)}</button>
            </div>
          </div>`).join('')}
      </div>`;
  }

  // ==================== 3. ÉDITEUR & CONTRÔLE QUALITÉ AVANT PUBLICATION ====================
  function renderCourseEditor(adminData, adminState) {
    const ed = adminState.editor;
    if (!ed || !ed.course) {
      return `<div class="card empty-state">Aucun cours sélectionné pour édition. <br><button class="btn btn-primary btn-sm" style="margin-top:12px;" data-action="nav" data-route="admin_courses">Retour à Gestion des cours</button></div>`;
    }

    const course = ed.course;
    const lessons = asArr(course.lessons);
    const flashcards = asArr(ed.flashcards);
    const qcms = asArr(ed.qcms);
    const tab = ed.tab || 'lessons';
    const modules = asArr(adminData.modules);
    const mod = getModMap(adminData)[course.moduleId];
    const ai = course.aiExtraction || {};
    const warnings = asArr(ai.warnings);
    const lowPages = asArr(ai.lowConfidencePages);
    const primarySourceCount = asArr(course.attachments).filter(a => a.kind === 'primary_pdf' || a.kind === 'primary_ppt').length;
    const ppt = course.pptImport && course.pptImport.isPowerPoint ? course.pptImport : null;
    const ov = ppt && ppt.overlapInfo && ppt.overlapInfo.hasOverlap ? ppt.overlapInfo : null;
    const fcNeedsReview = flashcards.filter(f => f.needsReview).length;
    const qcmNeedsReview = qcms.filter(q => q.needsReview).length;
    const qr = ed.qualityReport || ai.qualityReport || (course.metadata && course.metadata.lastQualityReport) || null;
    const activeJob = ed.activeJob || asArr(adminData.importJobs).find(j => j.courseId === course.id) || null;
    const miniTestCount = lessons.filter(l => l.miniTest && asArr(l.miniTest.questionIds).length > 0).length;

    let tabBody = '';
    if (tab === 'meta') {
      tabBody = renderEditorMetaTab(course, modules, ed, activeJob);
    } else if (tab === 'lessons') {
      tabBody = renderEditorLessonsTab(course, lessons, ed);
    } else if (tab === 'flashcards') {
      tabBody = renderEditorFlashcardsTab(lessons, flashcards, ed);
    } else if (tab === 'qcms') {
      tabBody = renderEditorQcmsTab(lessons, qcms, ed);
    } else if (tab === 'minitests') {
      tabBody = renderEditorMiniTestsTab(course, lessons, qcms);
    } else {
      tabBody = renderEditorQualityTab(course, lessons, flashcards, qcms, qr, activeJob);
    }

    return `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:14px;">
        <button type="button" class="btn btn-ghost btn-sm" data-action="admin-exit-editor">${icon('arrowLeft', 16)} Retour à Gestion des cours</button>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          ${ed.dirty ? '<span class="badge badge-orange">● Modifications non enregistrées</span>' : '<span class="badge badge-green">✓ Synchronisé</span>'}
          <button type="button" class="btn btn-secondary btn-sm" data-action="admin-preview-course" data-cid="${esc(course.id)}">
            👁 Prévisualiser (Vue Étudiant)
          </button>
          <button type="button" class="btn btn-secondary btn-sm" data-action="admin-start-pipeline" data-cid="${esc(course.id)}" ${primarySourceCount === 0 || ed.analyzing ? 'disabled' : ''}>
            ${icon('sparkle', 15)} ${ed.analyzing ? 'Pipeline 11 étapes…' : '↻ Relancer l’extraction (11 étapes)'}
          </button>
          <button type="button" class="btn btn-secondary btn-sm" data-action="admin-run-quality-check" data-cid="${esc(course.id)}">
            🔎 Audit qualité
          </button>
          ${course.status === 'published' ? `
            <button type="button" class="btn btn-warning btn-sm" data-action="admin-editor-save" data-mode="draft" ${ed.saving ? 'disabled' : ''}>
              Dépublier (Brouillon)
            </button>
            <button type="button" class="btn btn-success" data-action="admin-editor-save" data-mode="publish" ${ed.saving ? 'disabled' : ''}>
              ${icon('check', 16)} ${ed.saving ? 'Enregistrement…' : 'Enregistrer (Publié)'}
            </button>
          ` : `
            <button type="button" class="btn btn-secondary" data-action="admin-editor-save" data-mode="draft" ${ed.saving ? 'disabled' : ''}>
              ${ed.saving ? 'Enregistrement…' : 'Enregistrer brouillon'}
            </button>
            <button type="button" class="btn btn-success" data-action="admin-approve-publish" data-cid="${esc(course.id)}" ${ed.saving ? 'disabled' : ''}>
              ${icon('check', 16)} ${ed.saving ? 'Publication…' : 'Approuver & Publier'}
            </button>
          `}
        </div>
      </div>

      ${ed.analyzing || (activeJob && activeJob.status === 'failed') ? renderPipelineTracker(activeJob, course) : ''}

      <div class="card" style="margin-bottom:16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
          <div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:5px;">
              <span class="course-code-pill">${esc(course.code)}</span>
              <span class="badge badge-medium">${esc((mod && mod.subject) || 'Médecine')}</span>
              ${course.academicYear ? `<span class="badge badge-neutral">${esc(course.academicYear)}</span>` : ''}
              ${window.EpiUI.statusBadge(course.status)}
              ${qr ? `<span class="badge ${qr.blockingCount > 0 ? 'badge-red' : (qr.warningCount > 0 ? 'badge-orange' : 'badge-green')}">Qualité : ${qr.score}/100</span>` : ''}
              <span style="font-size:12px;color:var(--text-light);">v${course.version || 1} · ${lessons.length} leçon(s) · ${flashcards.length} flashcards · ${qcms.length} QCM · ${miniTestCount} mini-test(s)</span>
            </div>
            <h1 style="margin:0;font-size:20px;color:var(--navy);">Studio de Révision : ${esc(course.title)}</h1>
          </div>
          ${qr && (qr.blockingCount > 0 || qr.warningCount > 0) ? `
            <button type="button" class="btn ${qr.blockingCount > 0 ? 'btn-danger' : 'btn-warning'} btn-sm" data-action="admin-editor-tab" data-tab="quality">
              ⚠️ ${qr.blockingCount} blocage(s) · ${qr.warningCount} alerte(s) — Voir l’audit
            </button>` : ''}
        </div>

        ${course.status === 'published' ? `
          <div class="alert alert-info" style="margin:14px 0 0;">
            ${icon('shield', 18)}
            <div>
              <strong>Protection de la progression étudiante :</strong> ce cours est publié. Les corrections mineures n’affectent pas les étudiants. Si une leçon subit un changement structurel majeur, cochez <em>« Modification majeure de structure »</em> : elle sera signalée pour révision <strong>sans effacer leur progression</strong>.
            </div>
          </div>` : ''}

        ${ov ? `
          <div class="alert alert-warning" style="margin:14px 0 0;align-items:center;justify-content:space-between;flex-wrap:wrap;">
            <div style="flex:1;min-width:240px;">
              <strong>⚠️ Chevauchement détecté avec ${esc(ov.matchedCourseCode)} (« ${esc(ov.matchedCourseTitle)} ») :</strong>
              ${esc(ov.reason)}
              ${ov.resolution && ov.resolution !== 'pending' ? `<br><span class="badge badge-green" style="margin-top:4px;">Décision : ${ov.resolution === 'merged' ? 'Fusionné' : 'Conservé séparé'}</span>` : ''}
            </div>
            ${ov.resolution === 'pending' ? `
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button type="button" class="btn btn-navy btn-sm" data-action="admin-resolve-overlap" data-cid="${esc(course.id)}" data-decision="merge" data-target="${esc(ov.matchedCourseId)}">🔀 Fusionner dans ${esc(ov.matchedCourseCode)}</button>
                <button type="button" class="btn btn-secondary btn-sm" data-action="admin-resolve-overlap" data-cid="${esc(course.id)}" data-decision="keep_separate">📌 Garder séparé</button>
              </div>` : ''}
          </div>` : ''}

        ${ai.analyzedAt ? `
          <div class="alert ${lowPages.length > 0 || (qr && qr.blockingCount > 0) ? 'alert-warning' : 'alert-success'}" style="margin:14px 0 0;">
            ${icon('sparkle', 18)}
            <div style="flex:1;">
              <strong>Rapport d’extraction universelle (${window.EpiUI.formatDateFR(ai.analyzedAt)}) :</strong>
              ${ai.totalPages || 0} ${ppt ? 'diapositive(s)' : 'page(s)'} via <em>${esc(ai.engine || 'Moteur MedStudy')}</em> → ${lessons.length} chapitre(s), ${flashcards.length} flashcard(s), ${qcms.length} QCM, ${miniTestCount} mini-test(s).
              ${lowPages.length > 0 ? `<br><strong>⚠️ ${ppt ? 'Diapositives' : 'Pages'} signalées pour vérification visuelle :</strong> ${lowPages.join(', ')}.` : ''}
            </div>
          </div>` : ''}
      </div>

      <div class="tabs-row">
        <button type="button" class="tab-btn ${tab === 'meta' ? 'active' : ''}" data-action="admin-editor-tab" data-tab="meta">
          Métadonnées & Fichiers (${asArr(course.attachments).length})
        </button>
        <button type="button" class="tab-btn ${tab === 'lessons' ? 'active' : ''}" data-action="admin-editor-tab" data-tab="lessons">
          Chapitres & Leçons (${lessons.length})
        </button>
        <button type="button" class="tab-btn ${tab === 'flashcards' ? 'active' : ''}" data-action="admin-editor-tab" data-tab="flashcards">
          Flashcards (${flashcards.length})${fcNeedsReview > 0 ? ` · ${fcNeedsReview}` : ''}
        </button>
        <button type="button" class="tab-btn ${tab === 'qcms' ? 'active' : ''}" data-action="admin-editor-tab" data-tab="qcms">
          QCM (${qcms.length})${qcmNeedsReview > 0 ? ` · ${qcmNeedsReview}` : ''}
        </button>
        <button type="button" class="tab-btn ${tab === 'minitests' ? 'active' : ''}" data-action="admin-editor-tab" data-tab="minitests">
          Mini-tests (${miniTestCount})
        </button>
        <button type="button" class="tab-btn ${tab === 'quality' ? 'active' : ''}" data-action="admin-editor-tab" data-tab="quality">
          Qualité & Traçabilité ${qr ? `(${qr.score}/100)` : ''}
        </button>
      </div>

      ${tabBody}`;
  }

  function renderEditorMetaTab(course, modules, ed, activeJob) {
    const meta = course.metadata && typeof course.metadata === 'object' ? course.metadata : {};
    return `
      <div class="card" style="margin-bottom:16px;">
        <h3 class="card-title" style="margin-bottom:14px;">Informations générales & Métadonnées académiques</h3>
        <div class="form-grid">
          <div class="form-field" style="grid-column:1 / -1;">
            <label>Titre complet</label>
            <input type="text" class="input" value="${esc(course.title)}" data-ed-course="title">
          </div>
          <div class="form-field">
            <label>Module médical</label>
            <select class="select" data-ed-course="moduleId">
              ${modules.map(m => `<option value="${esc(m.id)}" ${course.moduleId === m.id ? 'selected' : ''}>${esc(m.subject || 'Médecine')} — ${esc(m.title)}</option>`).join('')}
            </select>
          </div>
          <div class="form-field">
            <label>Code court</label>
            <input type="text" class="input" value="${esc(course.code)}" data-ed-course="code">
          </div>
          <div class="form-field">
            <label>Année académique</label>
            <input type="text" class="input" placeholder="Ex. 4ème Année · 2025-2026" value="${esc(course.academicYear || '')}" data-ed-course="academicYear">
          </div>
          <div class="form-field">
            <label>Enseignant / Service</label>
            <input type="text" class="input" value="${esc(course.professor || '')}" data-ed-course="professor">
          </div>
          <div class="form-field">
            <label>Titre abrégé</label>
            <input type="text" class="input" value="${esc(course.shortTitle || '')}" data-ed-course="shortTitle">
          </div>
          <div class="form-field">
            <label>Priorité d’examen</label>
            <select class="select" data-ed-course="priority">
              <option value="very_high" ${course.priority === 'very_high' ? 'selected' : ''}>Très Haute priorité</option>
              <option value="high" ${course.priority === 'high' ? 'selected' : ''}>Haute priorité</option>
              <option value="medium" ${course.priority === 'medium' ? 'selected' : ''}>Priorité moyenne</option>
              <option value="low" ${course.priority === 'low' ? 'selected' : ''}>Priorité faible</option>
            </select>
          </div>
          <div class="form-field" style="grid-column:1 / -1;">
            <label>Description / Résumé du cours</label>
            <textarea rows="3" class="input" data-ed-course="summary">${esc(course.summary || '')}</textarea>
          </div>
        </div>
        ${meta.approvedAt ? `<div style="margin-top:10px;font-size:12.5px;color:var(--green);">✓ Approuvé par ${esc(meta.approvedBy || 'Admin')} le ${window.EpiUI.formatDateFR(meta.approvedAt)}</div>` : ''}
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="card-header" style="margin-bottom:12px;">
          <div>
            <h3 class="card-title">${icon('fileText', 18)} Fichiers PDF, PowerPoint & Annexes</h3>
            <p class="card-subtitle">Stockés dans le bucket privé protégé et accessibles selon le statut de publication du cours.</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <label class="btn btn-primary btn-sm" style="cursor:pointer;">
              ${icon('upload', 14)} Ajouter PDF / PowerPoint
              <input type="file" accept=".pdf,.pptx,.ppt,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint" multiple style="display:none;" data-action="admin-upload-files" data-cid="${esc(course.id)}" data-kind="primary_source">
            </label>
            <label class="btn btn-secondary btn-sm" style="cursor:pointer;">
              ${icon('upload', 14)} Ajouter annexe
              <input type="file" accept=".pdf,.txt,.md,.docx,.pptx,.png,.jpg,.jpeg" multiple style="display:none;" data-action="admin-upload-files" data-cid="${esc(course.id)}" data-kind="support_doc">
            </label>
          </div>
        </div>
        ${renderAttachmentsList(course)}
      </div>

      ${activeJob ? renderPipelineTracker(activeJob, course) : ''}`;
  }

  function renderEditorLessonsTab(course, lessons, ed) {
    const activeIdx = Math.min(Math.max(0, ed.activeLessonIdx || 0), Math.max(0, lessons.length - 1));
    const lesson = lessons[activeIdx] || null;
    const majorSet = new Set(ed.majorLessonIds || []);

    const listHtml = lessons.map((l, idx) => `
      <div class="editor-lesson-pill ${idx === activeIdx ? 'active' : ''}">
        <button type="button" class="editor-lesson-select" data-action="admin-ed-select-lesson" data-idx="${idx}">
          <div style="font-weight:700;font-size:13.5px;color:var(--navy);">${idx + 1}. ${esc(l.title || 'Sans titre')}</div>
          <div style="font-size:11.5px;color:var(--text-light);display:flex;gap:6px;flex-wrap:wrap;margin-top:2px;">
            <span>${esc(l.slideRange || l.sourceRef || l.id)}</span>
            ${l.hasManualFlags ? '<span class="badge badge-red" style="padding:1px 6px;">OCR/Visuel</span>' : ''}
            ${l.needsReview ? '<span class="badge badge-vigilance" style="padding:1px 6px;">À relire</span>' : ''}
            ${majorSet.has(l.id) ? '<span class="badge badge-orange" style="padding:1px 6px;">MAJ majeure</span>' : ''}
          </div>
        </button>
        <div style="display:flex;gap:4px;">
          ${idx > 0 ? `<button type="button" class="btn btn-ghost btn-sm" style="padding:2px 6px;" data-action="admin-ed-move-lesson" data-idx="${idx}" data-dir="-1" title="Monter">▲</button>` : ''}
          ${idx < lessons.length - 1 ? `<button type="button" class="btn btn-ghost btn-sm" style="padding:2px 6px;" data-action="admin-ed-move-lesson" data-idx="${idx}" data-dir="1" title="Descendre">▼</button>` : ''}
          <button type="button" class="btn btn-ghost btn-sm" style="padding:2px 6px;color:var(--red);" data-action="admin-ed-delete-lesson" data-idx="${idx}" title="Supprimer">${icon('trash', 13)}</button>
        </div>
      </div>`).join('');

    let detailHtml = `<div class="card empty-state">Aucune leçon dans ce cours. Cliquez sur « + Ajouter » ou lancez le pipeline en 11 étapes.</div>`;
    if (lesson) {
      const u = lesson.understand || { intro: '', sections: [], tables: [], darija: '', triad: { toUnderstand: [], toMemorize: [], toRecognizeInQcm: [] } };
      const sections = asArr(u.sections);
      const tables = asArr(u.tables);
      const triad = u.triad || { toUnderstand: [], toMemorize: [], toRecognizeInQcm: [] };
      const memItems = asArr(lesson.memorize);
      const recallItems = asArr(lesson.activeRecall);
      const isMajor = majorSet.has(lesson.id);
      const stripTags = (s) => String(s || '').replace(/<[^>]+>/g, '').trim();

      detailHtml = `
        <div class="card">
          <div class="card-header" style="margin-bottom:14px;">
            <div>
              <h3 class="card-title">Chapitre / Leçon #${activeIdx + 1} (${esc(lesson.id)})</h3>
              ${lesson.extractionNote ? `<p class="card-subtitle" style="color:${lesson.hasManualFlags ? 'var(--sem-amber)' : 'var(--text-light)'};">${esc(lesson.extractionNote)}</p>` : ''}
            </div>
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
              <button type="button" class="btn btn-secondary btn-sm" data-action="admin-regenerate-lesson" data-cid="${esc(course.id)}" data-lid="${esc(lesson.id)}" ${ed.regenerating ? 'disabled' : ''}>
                ${icon('refresh', 14)} ${ed.regenerating ? 'Régénération…' : 'Régénérer cette section'}
              </button>
              <label style="display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;cursor:pointer;">
                <input type="checkbox" ${!lesson.needsReview ? 'checked' : ''} data-ed-lesson-reviewed="${activeIdx}">
                Relue & validée
              </label>
            </div>
          </div>

          ${course.status === 'published' ? `
            <div class="admin-major-box ${isMajor ? 'active' : ''}">
              <label style="display:flex;align-items:flex-start;gap:9px;cursor:pointer;font-size:13.5px;font-weight:700;color:var(--sem-amber);">
                <input type="checkbox" ${isMajor ? 'checked' : ''} data-action="admin-ed-toggle-major" data-lid="${esc(lesson.id)}" style="margin-top:3px;">
                <span>🔄 Modification majeure — signaler cette leçon pour révision aux étudiants (sans effacer leur progression)</span>
              </label>
              ${isMajor ? `<div style="margin-top:8px;"><input type="text" class="input" style="width:100%;" placeholder="Note de mise à jour…" value="${esc(lesson.majorUpdateNote || '')}" data-ed-lesson="majorUpdateNote" data-lidx="${activeIdx}"></div>` : ''}
            </div>` : ''}

          <div class="form-grid" style="margin-bottom:16px;">
            <div class="form-field" style="grid-column:1 / -1;">
              <label>Titre de la leçon / chapitre *</label>
              <input type="text" class="input" value="${esc(lesson.title || '')}" data-ed-lesson="title" data-lidx="${activeIdx}">
            </div>
            <div class="form-field">
              <label>Référence source (fichier · pages/diapos)</label>
              <input type="text" class="input" value="${esc(lesson.sourceRef || '')}" data-ed-lesson="sourceRef" data-lidx="${activeIdx}">
            </div>
            <div class="form-field">
              <label>Durée estimée (minutes)</label>
              <input type="number" min="3" max="120" class="input" value="${Number(lesson.durationMin) || 10}" data-ed-lesson="durationMin" data-lidx="${activeIdx}">
            </div>
          </div>

          <div class="admin-subpanel" style="margin-bottom:16px;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;flex-wrap:wrap;">
              <h4 style="margin:0;font-size:14.5px;color:var(--navy);">Étape A — Comprendre (${sections.length} sous-section(s), ${tables.length} tableau(x))</h4>
              <button type="button" class="btn btn-secondary btn-sm" data-action="admin-ed-add-section" data-lidx="${activeIdx}">${icon('plus', 13)} Ajouter une sous-section</button>
            </div>
            <div class="form-field" style="margin-bottom:12px;">
              <label>Introduction pédagogique</label>
              <textarea rows="2" class="input" data-ed-lesson="intro" data-lidx="${activeIdx}">${esc(u.intro || '')}</textarea>
            </div>

            <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:12px;">
              ${sections.map((sec, si) => `
                <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:12px;">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                      <strong style="font-size:13px;color:var(--navy);">Sous-section #${si + 1}</strong>
                      ${sec.pageRef ? `<span class="badge badge-neutral">${esc(sec.pageRef)}</span>` : ''}
                      ${provenanceBadge(sec.provenance || 'source_explicit')}
                    </div>
                    ${sections.length > 1 ? `<button type="button" class="btn btn-ghost btn-sm" style="color:var(--red);" data-action="admin-ed-del-section" data-lidx="${activeIdx}" data-sidx="${si}">${icon('trash', 13)}</button>` : ''}
                  </div>
                  <div class="form-field" style="margin-bottom:8px;">
                    <label>Titre de la sous-section</label>
                    <input type="text" class="input" value="${esc(sec.heading || '')}" data-ed-sec="heading" data-lidx="${activeIdx}" data-sidx="${si}">
                  </div>
                  <div class="form-field" style="margin-bottom:8px;">
                    <label>Paragraphes explicatifs (1 paragraphe par ligne)</label>
                    <textarea rows="3" class="input" data-ed-sec="paragraphs" data-lidx="${activeIdx}" data-sidx="${si}">${esc(asArr(sec.paragraphs).map(stripTags).join('\n'))}</textarea>
                  </div>
                  <div class="form-field">
                    <label>Points clés / Énumérations (1 puce par ligne)</label>
                    <textarea rows="3" class="input" data-ed-sec="bullets" data-lidx="${activeIdx}" data-sidx="${si}">${esc(asArr(sec.bullets).map(stripTags).join('\n'))}</textarea>
                  </div>
                </div>`).join('')}
            </div>

            ${tables.length > 0 ? `
              <div style="margin-bottom:12px;">
                <label style="font-size:12.5px;font-weight:700;color:var(--text-muted);display:block;margin-bottom:6px;">Tableaux & Synthèses extraits (${tables.length}) :</label>
                ${tables.map((tbl, ti) => `
                  <div style="background:var(--surface);border:1px solid var(--border-strong);border-radius:10px;padding:10px 12px;margin-bottom:8px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;flex-wrap:wrap;">
                      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                        <strong style="font-size:13px;color:var(--navy);">${esc(tbl.title || `Tableau ${ti + 1}`)}</strong>
                        ${provenanceBadge(tbl.provenance || 'source_explicit')}
                      </div>
                      <button type="button" class="btn btn-ghost btn-sm" style="color:var(--red);" data-action="admin-ed-del-table" data-lidx="${activeIdx}" data-tidx="${ti}">${icon('trash', 13)} Retirer</button>
                    </div>
                    <div class="data-table-wrap" style="margin:0;">
                      <table class="mini-table">
                        <thead><tr>${asArr(tbl.headers).map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>
                        <tbody>${asArr(tbl.rows).slice(0, 6).map(r => `<tr>${asArr(r).map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
                      </table>
                    </div>
                  </div>`).join('')}
              </div>` : ''}

            <div class="form-field" style="margin-bottom:10px;">
              <label>Explication simplifiée en Darija algérienne (optionnel)</label>
              <textarea rows="2" class="input" placeholder="Clarification courte en Darija si concept difficile…" data-ed-lesson="darija" data-lidx="${activeIdx}">${esc(stripTags(u.darija || ''))}</textarea>
            </div>
            <div class="form-grid" style="grid-template-columns:repeat(3,minmax(0,1fr));">
              <div class="form-field">
                <label>💡 À comprendre (1/ligne)</label>
                <textarea rows="3" class="input" data-ed-lesson="triadUnderstand" data-lidx="${activeIdx}">${esc(asArr(triad.toUnderstand).join('\n'))}</textarea>
              </div>
              <div class="form-field">
                <label>📌 À mémoriser (1/ligne)</label>
                <textarea rows="3" class="input" data-ed-lesson="triadMemorize" data-lidx="${activeIdx}">${esc(asArr(triad.toMemorize).join('\n'))}</textarea>
              </div>
              <div class="form-field">
                <label>🎯 À reconnaître en QCM (1/ligne)</label>
                <textarea rows="3" class="input" data-ed-lesson="triadQcm" data-lidx="${activeIdx}">${esc(asArr(triad.toRecognizeInQcm).join('\n'))}</textarea>
              </div>
            </div>
          </div>

          <div class="admin-subpanel" style="margin-bottom:16px;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;flex-wrap:wrap;">
              <h4 style="margin:0;font-size:14.5px;color:var(--navy);">Étape B — Fiches « À mémoriser » (${memItems.length})</h4>
              <button type="button" class="btn btn-primary btn-sm" data-action="admin-ed-add-mem" data-lidx="${activeIdx}">${icon('plus', 14)} Ajouter un élément</button>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;">
              ${memItems.map((m, mi) => `
                <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:12px;">
                  <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;flex-wrap:wrap;">
                    ${provenanceBadge(m.provenance || 'source_explicit')}
                    ${m.sourceFile ? `<span style="font-size:11.5px;color:var(--text-light);">${esc(m.sourceFile)}</span>` : ''}
                  </div>
                  <div style="display:grid;grid-template-columns:1fr 1.6fr 0.8fr auto;gap:8px;margin-bottom:8px;align-items:center;">
                    <input type="text" class="input" placeholder="Catégorie" value="${esc(m.category || 'Définition')}" data-ed-mem="category" data-lidx="${activeIdx}" data-midx="${mi}">
                    <input type="text" class="input" placeholder="Titre de la notion" value="${esc(m.title || '')}" data-ed-mem="title" data-lidx="${activeIdx}" data-midx="${mi}">
                    <input type="text" class="input" placeholder="Page / Diapo" value="${esc(m.pageRef || '')}" data-ed-mem="pageRef" data-lidx="${activeIdx}" data-midx="${mi}">
                    <button type="button" class="btn btn-ghost btn-sm" style="color:var(--red);" data-action="admin-ed-del-mem" data-lidx="${activeIdx}" data-midx="${mi}">${icon('trash', 14)}</button>
                  </div>
                  <textarea rows="2" class="input" style="width:100%;" placeholder="Contenu exact à mémoriser…" data-ed-mem="content" data-lidx="${activeIdx}" data-midx="${mi}">${esc(stripTags(m.content || ''))}</textarea>
                </div>`).join('') || '<div style="font-size:13px;color:var(--text-light);">Aucun élément à mémoriser dans cette leçon.</div>'}
            </div>
          </div>

          <div class="admin-subpanel">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;flex-wrap:wrap;">
              <h4 style="margin:0;font-size:14.5px;color:var(--navy);">Étape C — Questions de Rappel Actif (${recallItems.length})</h4>
              <button type="button" class="btn btn-secondary btn-sm" data-action="admin-ed-add-recall" data-lidx="${activeIdx}">${icon('plus', 14)} Ajouter une question</button>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;">
              ${recallItems.map((ar, ri) => `
                <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:12px;">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;">
                    <div style="display:flex;align-items:center;gap:6px;">
                      ${provenanceBadge(ar.provenance || 'ai_reformulated')}
                      <input type="text" class="input" style="width:120px;padding:4px 8px;font-size:12.5px;" placeholder="Page/Diapo" value="${esc(ar.pageRef || '')}" data-ed-recall="pageRef" data-lidx="${activeIdx}" data-ridx="${ri}">
                    </div>
                    <button type="button" class="btn btn-ghost btn-sm" style="color:var(--red);" data-action="admin-ed-del-recall" data-lidx="${activeIdx}" data-ridx="${ri}">${icon('trash', 13)}</button>
                  </div>
                  <div class="form-grid">
                    <div class="form-field">
                      <label>Question de récupération mémoire</label>
                      <textarea rows="2" class="input" data-ed-recall="prompt" data-lidx="${activeIdx}" data-ridx="${ri}">${esc(ar.prompt || '')}</textarea>
                    </div>
                    <div class="form-field">
                      <label>Réponse attendue (source cours)</label>
                      <textarea rows="2" class="input" data-ed-recall="expectedAnswer" data-lidx="${activeIdx}" data-ridx="${ri}">${esc(ar.expectedAnswer || '')}</textarea>
                    </div>
                  </div>
                </div>`).join('') || '<div style="font-size:13px;color:var(--text-light);">Aucune question de rappel actif ouverte pour cette leçon.</div>'}
            </div>
          </div>
        </div>`;
    }

    return `
      <div class="editor-split">
        <div class="card" style="padding:14px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
            <strong style="font-size:14px;color:var(--navy);">Chapitres (${lessons.length})</strong>
            <button type="button" class="btn btn-primary btn-sm" data-action="admin-ed-add-lesson">${icon('plus', 14)} Ajouter</button>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;">
            ${listHtml || '<div style="font-size:13px;color:var(--text-light);padding:8px;">Aucune leçon</div>'}
          </div>
        </div>
        <div>${detailHtml}</div>
      </div>`;
  }

  function renderEditorFlashcardsTab(lessons, flashcards, ed) {
    const flt = ed.fcLessonFilter || 'all';
    const items = flashcards.map((fc, idx) => ({ fc, idx })).filter(x => flt === 'all' || x.fc.lessonId === flt);

    return `
      <div class="card" style="margin-bottom:14px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
            <strong style="font-size:15px;color:var(--navy);">Révision des Flashcards (${items.length})</strong>
            <select class="select" data-filter="admin-ed-fc-lesson">
              <option value="all" ${flt === 'all' ? 'selected' : ''}>Toutes les leçons</option>
              ${lessons.map((l, i) => `<option value="${esc(l.id)}" ${flt === l.id ? 'selected' : ''}>${i + 1}. ${esc(l.title)}</option>`).join('')}
            </select>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button type="button" class="btn btn-secondary btn-sm" data-action="admin-ed-approve-all-fc">${icon('check', 14)} Tout valider</button>
            <button type="button" class="btn btn-primary btn-sm" data-action="admin-ed-add-fc" ${lessons.length === 0 ? 'disabled' : ''}>${icon('plus', 14)} Ajouter une flashcard</button>
          </div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:12px;">
        ${items.map(({ fc, idx }) => `
          <div class="card" style="padding:16px;border-left:4px solid ${fc.needsReview ? 'var(--orange)' : 'var(--green)'};">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <span class="badge ${fc.needsReview ? 'badge-vigilance' : 'badge-green'}">${fc.needsReview ? 'À relire' : 'Validée'}</span>
                ${provenanceBadge(fc.provenance || 'ai_reformulated')}
                <select class="select" style="padding:5px 8px;font-size:13px;" data-ed-fc="lessonId" data-fidx="${idx}">
                  ${lessons.map((l, li) => `<option value="${esc(l.id)}" ${fc.lessonId === l.id ? 'selected' : ''}>Leçon ${li + 1} : ${esc(l.title)}</option>`).join('')}
                </select>
                <select class="select" style="padding:5px 8px;font-size:13px;" data-ed-fc="type" data-fidx="${idx}">
                  <option value="definition" ${fc.type === 'definition' ? 'selected' : ''}>Définition</option>
                  <option value="cloze" ${fc.type === 'cloze' ? 'selected' : ''}>Compléter la phrase</option>
                  <option value="list" ${fc.type === 'list' ? 'selected' : ''}>Liste / Énumération</option>
                  <option value="difference" ${fc.type === 'difference' ? 'selected' : ''}>Différence</option>
                  <option value="formula" ${fc.type === 'formula' ? 'selected' : ''}>Formule / Seuil</option>
                  <option value="short_answer" ${fc.type === 'short_answer' ? 'selected' : ''}>Réponse courte</option>
                </select>
                <input type="text" class="input" style="width:120px;padding:5px 8px;font-size:13px;" placeholder="Page / Diapo" value="${esc(fc.pageRef || '')}" data-ed-fc="pageRef" data-fidx="${idx}">
              </div>
              <div style="display:flex;gap:6px;">
                ${fc.needsReview ? `<button type="button" class="btn btn-success btn-sm" data-action="admin-ed-approve-fc" data-fidx="${idx}">✓ Valider</button>` : ''}
                <button type="button" class="btn btn-ghost btn-sm" style="color:var(--red);" data-action="admin-ed-del-fc" data-fidx="${idx}">${icon('trash', 14)} Suppr.</button>
              </div>
            </div>
            <div class="form-grid">
              <div class="form-field">
                <label>Question (Recto)</label>
                <textarea rows="2" class="input" data-ed-fc="question" data-fidx="${idx}">${esc(fc.question || '')}</textarea>
              </div>
              <div class="form-field">
                <label>Réponse exacte (Verso)</label>
                <textarea rows="2" class="input" data-ed-fc="answer" data-fidx="${idx}">${esc(fc.answer || '')}</textarea>
              </div>
              <div class="form-field" style="grid-column:1 / -1;">
                <label>Repère / Indice examen (optionnel)</label>
                <input type="text" class="input" value="${esc(fc.hint || '')}" data-ed-fc="hint" data-fidx="${idx}">
              </div>
            </div>
          </div>`).join('') || '<div class="card empty-state">Aucune flashcard pour ce filtre.</div>'}
      </div>`;
  }

  function renderEditorQcmsTab(lessons, qcms, ed) {
    const flt = ed.qcmLessonFilter || 'all';
    const items = qcms.map((q, idx) => ({ q, idx })).filter(x => flt === 'all' || x.q.lessonId === flt);

    return `
      <div class="card" style="margin-bottom:14px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
            <strong style="font-size:15px;color:var(--navy);">Révision des QCM (${items.length})</strong>
            <select class="select" data-filter="admin-ed-qcm-lesson">
              <option value="all" ${flt === 'all' ? 'selected' : ''}>Toutes les leçons</option>
              ${lessons.map((l, i) => `<option value="${esc(l.id)}" ${flt === l.id ? 'selected' : ''}>${i + 1}. ${esc(l.title)}</option>`).join('')}
            </select>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button type="button" class="btn btn-secondary btn-sm" data-action="admin-ed-approve-all-qcm">${icon('check', 14)} Tout valider</button>
            <button type="button" class="btn btn-primary btn-sm" data-action="admin-ed-add-qcm" ${lessons.length === 0 ? 'disabled' : ''}>${icon('plus', 14)} Ajouter un QCM</button>
          </div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:14px;">
        ${items.map(({ q, idx }) => {
          const opts = asArr(q.options);
          const correctSet = new Set(asArr(q.correct));
          const wr = q.wrongReasons && typeof q.wrongReasons === 'object' ? q.wrongReasons : {};
          return `
            <div class="card" style="padding:16px;border-left:4px solid ${q.needsReview ? 'var(--orange)' : 'var(--green)'};">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                  <span class="badge ${q.needsReview ? 'badge-vigilance' : 'badge-green'}">${q.needsReview ? 'À relire' : 'Validé'}</span>
                  ${window.EpiUI.qcmSourceBadge(q)}
                  ${provenanceBadge(q.provenance || (q.sourceType === 'bm_original' ? 'source_explicit' : 'ai_reformulated'))}
                  <select class="select" style="padding:5px 8px;font-size:13px;" data-ed-qcm="lessonId" data-qidx="${idx}">
                    ${lessons.map((l, li) => `<option value="${esc(l.id)}" ${q.lessonId === l.id ? 'selected' : ''}>Leçon ${li + 1} : ${esc(l.title)}</option>`).join('')}
                  </select>
                  <input type="text" class="input" style="width:120px;padding:5px 8px;font-size:13px;" placeholder="Page / Diapo" value="${esc(q.pageRef || '')}" data-ed-qcm="pageRef" data-qidx="${idx}">
                  <label style="font-size:12.5px;display:flex;align-items:center;gap:5px;cursor:pointer;">
                    <input type="checkbox" ${q.multiSelect ? 'checked' : ''} data-ed-qcm="multiSelect" data-qidx="${idx}"> Choix multiples
                  </label>
                </div>
                <div style="display:flex;gap:6px;">
                  ${q.needsReview ? `<button type="button" class="btn btn-success btn-sm" data-action="admin-ed-approve-qcm" data-qidx="${idx}">✓ Valider</button>` : ''}
                  <button type="button" class="btn btn-ghost btn-sm" style="color:var(--red);" data-action="admin-ed-del-qcm" data-qidx="${idx}">${icon('trash', 14)} Suppr.</button>
                </div>
              </div>

              <div class="form-field" style="margin-bottom:10px;">
                <label>Énoncé de la question</label>
                <textarea rows="2" class="input" data-ed-qcm="stem" data-qidx="${idx}">${esc(q.stem || '')}</textarea>
              </div>

              <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px;">
                <label style="font-size:12.5px;font-weight:700;color:var(--text-muted);">Propositions (cochez la ou les bonne(s) réponse(s)) & justification des choix faux :</label>
                ${opts.map((opt, oi) => `
                  <div style="display:grid;grid-template-columns:56px 1.4fr 1fr;gap:8px;align-items:center;">
                    <label style="display:flex;align-items:center;gap:4px;font-weight:700;color:${correctSet.has(opt.key) ? 'var(--green)' : 'var(--text-muted)'};cursor:pointer;">
                      <input type="checkbox" ${correctSet.has(opt.key) ? 'checked' : ''} data-ed-qcm-corr="${esc(opt.key)}" data-qidx="${idx}"> ${esc(opt.key)}
                    </label>
                    <input type="text" class="input" value="${esc(opt.text || '')}" data-ed-qcm-opt="${oi}" data-qidx="${idx}">
                    ${correctSet.has(opt.key)
                      ? '<span style="font-size:12px;color:var(--green);font-weight:600;">✓ Bonne réponse</span>'
                      : `<input type="text" class="input" style="font-size:12.5px;" placeholder="Pourquoi ${esc(opt.key)} est faux…" value="${esc(wr[opt.key] || '')}" data-ed-qcm-wrong="${esc(opt.key)}" data-qidx="${idx}">`}
                  </div>`).join('')}
              </div>

              <div class="form-grid">
                <div class="form-field">
                  <label>Explication pédagogique (source cours)</label>
                  <textarea rows="2" class="input" data-ed-qcm="explanation" data-qidx="${idx}">${esc(q.explanation || '')}</textarea>
                </div>
                <div class="form-field">
                  <label>Référence source / Chapitre</label>
                  <input type="text" class="input" value="${esc(q.courseRef || '')}" data-ed-qcm="courseRef" data-qidx="${idx}">
                </div>
              </div>
            </div>`;
        }).join('') || '<div class="card empty-state">Aucun QCM pour ce filtre.</div>'}
      </div>`;
  }

  function renderEditorMiniTestsTab(course, lessons, qcms) {
    const qMap = {};
    qcms.forEach(q => { qMap[q.id] = q; });

    return `
      <div class="card" style="margin-bottom:14px;">
        <h3 class="card-title">Mini-tests de validation par leçon (Étape E · Seuil de maîtrise : 80 %)</h3>
        <p class="card-subtitle">Chaque mini-test valide les objectifs d’apprentissage clés et déclenche automatiquement le calendrier de répétition espacée (J+1 → J+3 → J+7 → J+14 → J+30).</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        ${lessons.map((l, idx) => {
          const mt = l.miniTest || null;
          const mappedIds = mt ? asArr(mt.questionIds) : qcms.filter(q => q.lessonId === l.id).slice(0, 5).map(q => q.id);
          const resolvedQs = mappedIds.map(id => qMap[id]).filter(Boolean);
          const okCount = resolvedQs.length >= 4;
          return `
            <div class="card" style="padding:16px;border-left:4px solid ${okCount ? 'var(--green)' : 'var(--orange)'};">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:10px;">
                <div>
                  <strong style="font-size:15px;color:var(--navy);">${idx + 1}. ${esc(mt ? mt.title : `Mini-test — ${l.title}`)}</strong>
                  <div style="font-size:12.5px;color:var(--text-light);">
                    ${resolvedQs.length} question(s) reliée(s) · Seuil : ${mt ? (mt.passingScore || 80) : 80} % · Source : ${esc(l.sourceRef || l.id)}
                  </div>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  <span class="badge ${okCount ? 'badge-green' : 'badge-orange'}">${okCount ? 'Complet (≥ 4 QCM)' : 'À enrichir (< 4 QCM)'}</span>
                  <button type="button" class="btn btn-secondary btn-sm" data-action="admin-preview-lesson" data-course="${esc(course.id)}" data-lesson="${esc(l.id)}" data-step="E">👁 Tester Étape E</button>
                  <button type="button" class="btn btn-secondary btn-sm" data-action="admin-regenerate-lesson" data-cid="${esc(course.id)}" data-lid="${esc(l.id)}">↻ Régénérer</button>
                </div>
              </div>
              ${mt && asArr(mt.objectives).length ? `
                <div style="margin-bottom:10px;font-size:13px;color:var(--text-muted);">
                  <strong>Objectifs évalués :</strong>
                  <ul style="margin:4px 0 0;padding-left:18px;">${asArr(mt.objectives).map(o => `<li>${esc(o)}</li>`).join('')}</ul>
                </div>` : ''}
              <div style="display:flex;flex-direction:column;gap:6px;">
                ${resolvedQs.map((q, qi) => `
                  <div style="font-size:13px;padding:8px 10px;background:var(--surface-soft);border:1px solid var(--border);border-radius:8px;display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                    <span><strong>Q${qi + 1}.</strong> ${esc(q.stem)}</span>
                    <span class="badge badge-neutral">${q.multiSelect ? 'Multi-choix' : 'Choix unique'} · Rép. ${asArr(q.correct).join(', ')}</span>
                  </div>`).join('') || '<div style="font-size:13px;color:var(--sem-amber);">Aucune question reliée à ce mini-test.</div>'}
              </div>
            </div>`;
        }).join('') || '<div class="card empty-state">Aucune leçon disponible.</div>'}
      </div>`;
  }

  function renderEditorQualityTab(course, lessons, flashcards, qcms, qr, activeJob) {
    const checks = qr ? asArr(qr.checks) : [];
    const provCounts = { source: 0, ai: 0, verify: 0 };
    lessons.forEach(l => {
      asArr(l.understand && l.understand.sections).forEach(s => {
        if (s.provenance === 'needs_verification') provCounts.verify++;
        else if (s.provenance === 'ai_reformulated') provCounts.ai++;
        else provCounts.source++;
      });
      asArr(l.memorize).forEach(m => {
        if (m.provenance === 'needs_verification') provCounts.verify++;
        else if (m.provenance === 'ai_reformulated') provCounts.ai++;
        else provCounts.source++;
      });
    });
    flashcards.forEach(f => { if (f.provenance === 'needs_verification') provCounts.verify++; else provCounts.ai++; });
    qcms.forEach(q => {
      if (q.provenance === 'needs_verification') provCounts.verify++;
      else if (q.sourceType === 'bm_original') provCounts.source++;
      else provCounts.ai++;
    });

    return `
      <div class="card" style="margin-bottom:16px;">
        <div class="card-header" style="margin-bottom:14px;">
          <div>
            <h3 class="card-title">${icon('shield', 19)} Contrôle Qualité Automatisé (9 vérifications avant publication)</h3>
            <p class="card-subtitle">Vérifie chapitres, leçons non vides, OCR/extraction, doublons, unicité flashcards, validité QCM, explications, traçabilité et relations.</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button type="button" class="btn btn-primary btn-sm" data-action="admin-run-quality-check" data-cid="${esc(course.id)}">🔎 Relancer l’audit qualité</button>
            ${course.status !== 'published' ? `<button type="button" class="btn btn-success btn-sm" data-action="admin-approve-publish" data-cid="${esc(course.id)}">✅ Approuver & Publier</button>` : ''}
          </div>
        </div>

        <div class="kpi-grid" style="margin:0 0 16px;grid-template-columns:repeat(4,minmax(0,1fr));">
          <div class="admin-kpi ${qr && qr.blockingCount === 0 ? 'green' : 'orange'}">
            <span>Score Qualité</span><strong>${qr ? `${qr.score}/100` : '—'}</strong>
          </div>
          <div class="admin-kpi"><span>📄 Extraits source directs</span><strong>${provCounts.source}</strong></div>
          <div class="admin-kpi"><span>✨ Reformulations IA sourcées</span><strong>${provCounts.ai}</strong></div>
          <div class="admin-kpi ${provCounts.verify > 0 ? 'orange' : 'green'}"><span>⚠️ Zones à vérifier</span><strong>${provCounts.verify}</strong></div>
        </div>

        <div style="display:flex;flex-direction:column;gap:8px;">
          ${checks.map(chk => `
            <div class="quality-check-row ${esc(chk.status)}">
              <div>
                <strong style="color:var(--navy);">${chk.status === 'pass' ? '✅' : (chk.status === 'warning' ? '⚠️' : '❌')} ${esc(chk.label)}</strong>
                <div style="font-size:12.5px;color:var(--text-muted);margin-top:2px;">${esc(chk.detail)}</div>
              </div>
              <span class="badge ${chk.status === 'pass' ? 'badge-green' : (chk.status === 'warning' ? 'badge-orange' : 'badge-red')}">
                ${chk.status === 'pass' ? 'OK' : (chk.status === 'warning' ? 'Avertissement' : 'Bloquant')}
              </span>
            </div>`).join('') || '<div class="empty-state">Cliquez sur « 🔎 Relancer l’audit qualité » pour exécuter les 9 contrôles sur ce cours.</div>'}
        </div>
      </div>

      ${activeJob ? renderPipelineTracker(activeJob, course) : ''}`;
  }

  // ==================== 4. GESTION DES MODULES MÉDICAUX ====================
  function renderModulesManager(adminData) {
    const modules = asArr(adminData.modules);
    const courses = asArr(adminData.courses);

    return `
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header">
          <div>
            <h2 class="card-title">${icon('book', 20)} Modules médicaux & Curriculum complet</h2>
            <p class="card-subtitle">Organisez tout le cursus médical (Anatomie, Physiologie, Histologie, Biochimie, Épidémiologie, Sémiologie, Pharmacologie, Pathologie, Microbiologie ou toute autre matière).</p>
          </div>
        </div>

        <form data-form="admin-create-module" class="admin-subpanel">
          <h4 style="margin:0 0 10px;font-size:14.5px;color:var(--navy);">Ajouter un nouveau module médical</h4>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">
            ${SUBJECT_SUGGESTIONS.map(s => `<button type="button" class="time-pill" data-action="admin-pick-subject" data-target="new-mod-subject" data-val="${esc(s)}">${esc(s)}</button>`).join('')}
          </div>
          <div class="form-grid">
            <div class="form-field">
              <label for="new-mod-subject">Matière / Discipline (saisie libre ou choix rapide) *</label>
              <input id="new-mod-subject" name="subject" type="text" class="input" required placeholder="Ex. Anatomie, Pharmacologie, Cardiologie…">
            </div>
            <div class="form-field">
              <label for="new-mod-title">Titre du module *</label>
              <input id="new-mod-title" name="title" type="text" class="input" required minlength="2" placeholder="Ex. Anatomie du Membre Supérieur">
            </div>
            <div class="form-field">
              <label for="new-mod-code">Code</label>
              <input id="new-mod-code" name="code" type="text" class="input" placeholder="Ex. Module 5 / ANAT-1">
            </div>
            <div class="form-field">
              <label for="new-mod-accent">Couleur</label>
              <select id="new-mod-accent" name="accent" class="select">
                ${ACCENT_PALETTE.map((col, idx) => `<option value="${col}">Couleur #${idx + 1} (${col})</option>`).join('')}
              </select>
            </div>
            <div class="form-field" style="grid-column:1 / -1;">
              <label for="new-mod-desc">Description</label>
              <input id="new-mod-desc" name="description" type="text" class="input" placeholder="Description courte du module…">
            </div>
          </div>
          <div style="margin-top:12px;display:flex;justify-content:flex-end;">
            <button type="submit" class="btn btn-primary">${icon('plus', 15)} Créer le module médical</button>
          </div>
        </form>
      </div>

      <div class="courses-grid">
        ${modules.map(m => {
          const modCourses = courses.filter(c => c.moduleId === m.id);
          const pubCnt = modCourses.filter(c => c.status === 'published').length;
          return `
            <article class="course-card" style="border-top:4px solid ${m.accent || '#1d4ed8'};">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
                <span class="badge badge-medium">${esc(m.subject || 'Médecine')}</span>
                <span class="course-code-pill">${esc(m.code)}</span>
              </div>
              <h3 style="margin:0;">${esc(m.title)}</h3>
              <p style="margin:0;font-size:13px;color:var(--text-light);">${esc(m.description || '')}</p>
              <div style="font-size:13px;color:var(--text-muted);margin-top:auto;">
                <strong>${modCourses.length}</strong> cours (${pubCnt} publié${pubCnt > 1 ? 's' : ''})
              </div>
              <div style="display:flex;justify-content:space-between;gap:8px;padding-top:6px;border-top:1px solid var(--border);">
                <button type="button" class="btn btn-secondary btn-sm" data-action="admin-edit-module-modal" data-mid="${esc(m.id)}">${icon('edit', 14)} Modifier</button>
                <button type="button" class="btn btn-ghost btn-sm" style="color:var(--red);" data-action="admin-delete-module" data-mid="${esc(m.id)}" ${modCourses.length > 0 ? 'disabled title="Supprimez ou déplacez les cours d’abord"' : ''}>${icon('trash', 14)} Supprimer</button>
              </div>
            </article>`;
        }).join('')}
      </div>`;
  }

  // ==================== 5. SAUVEGARDES, UTILISATEURS & SÉCURITÉ ====================
  function renderSecurityBackups(adminData) {
    const backups = asArr(adminData.backups);
    const users = asArr(adminData.users);
    const aiCfg = adminData.aiConfig || { provider: 'local', configured: false };

    return `
      <div class="two-col">
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">${icon('refresh', 19)} Sauvegardes automatiques & Restauration</h2>
              <p class="card-subtitle">Une sauvegarde horodatée est créée automatiquement avant chaque mise à jour, analyse IA ou suppression (25 dernières conservées).</p>
            </div>
            <button type="button" class="btn btn-primary btn-sm" data-action="admin-create-backup">${icon('plus', 14)} Sauvegarder maintenant</button>
          </div>

          <div class="data-table-wrap">
            <table class="data-table">
              <thead><tr><th>Fichier de sauvegarde</th><th>Taille</th><th>Date</th><th>Action</th></tr></thead>
              <tbody>
                ${backups.map(b => `
                  <tr>
                    <td><code style="font-size:11.5px;word-break:break-all;overflow-wrap:anywhere;">${esc(b.filename)}</code></td>
                    <td style="font-size:12.5px;">${window.EpiUI.formatBytes(b.sizeBytes)}</td>
                    <td style="font-size:12.5px;white-space:nowrap;">${window.EpiUI.formatDateFR(b.createdAt)}</td>
                    <td><button type="button" class="btn btn-warning btn-sm" data-action="admin-restore-backup" data-file="${esc(b.filename)}">Restaurer</button></td>
                  </tr>`).join('') || '<tr><td colspan="4" class="empty-state">Aucune sauvegarde trouvée.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:16px;">
          <div class="card">
            <h3 class="card-title" style="margin-bottom:10px;">${icon('lock', 18)} Mot de passe Administrateur</h3>
            <form data-form="admin-change-password" style="display:flex;flex-direction:column;gap:10px;">
              <div class="form-field">
                <label>Mot de passe actuel</label>
                <input name="currentPassword" type="password" class="input" required>
              </div>
              <div class="form-field">
                <label>Nouveau mot de passe (≥ 8 caractères)</label>
                <input name="newPassword" type="password" class="input" required minlength="8">
              </div>
              <button type="submit" class="btn btn-navy btn-sm">Mettre à jour le mot de passe</button>
            </form>
          </div>

          <div class="card">
            <h3 class="card-title" style="margin-bottom:6px;">${icon('sparkle', 18)} Moteur Universel d’Extraction & IA (Serveur uniquement)</h3>
            <p class="card-subtitle" style="margin-bottom:12px;">Sécurité : en production Vercel, configurez <code>GEMINI_API_KEY</code> ou <code>OPENAI_API_KEY</code> dans les variables d’environnement serveur Vercel (jamais exposées au navigateur). Sans clé externe, le moteur structurel médical MedStudy en 11 étapes fonctionne nativement.</p>
            <div style="margin-bottom:10px;font-size:13px;">
              Moteur actif : <span class="badge badge-medium">${esc(aiCfg.provider)}${aiCfg.model ? ` (${esc(aiCfg.model)})` : ''}</span> ·
              Clé IA serveur : <span class="badge ${aiCfg.configured ? 'badge-green' : 'badge-neutral'}">${aiCfg.configured ? 'Activée côté serveur' : 'Moteur structurel médical natif'}</span>
            </div>
            <form data-form="admin-ai-config" style="display:flex;flex-direction:column;gap:10px;">
              <div class="form-field">
                <label>Fournisseur</label>
                <select name="provider" class="select">
                  <option value="local" ${aiCfg.provider === 'local' ? 'selected' : ''}>Local MedStudy (WinRT PDF + OCR fr-FR, hors-ligne)</option>
                  <option value="gemini" ${aiCfg.provider === 'gemini' ? 'selected' : ''}>Gemini API (clé serveur)</option>
                  <option value="openai" ${aiCfg.provider === 'openai' ? 'selected' : ''}>OpenAI API (clé serveur)</option>
                </select>
              </div>
              <div class="form-field">
                <label>Nouvelle clé API (laisser vide pour conserver l’actuelle)</label>
                <input name="apiKey" type="password" class="input" placeholder="Jamais affichée après enregistrement">
              </div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button type="submit" class="btn btn-primary btn-sm">Enregistrer la configuration</button>
                ${aiCfg.configured ? '<button type="button" class="btn btn-ghost btn-sm" style="color:var(--red);" data-action="admin-clear-ai-key">Effacer la clé</button>' : ''}
              </div>
            </form>
          </div>

          <div class="card">
            <h3 class="card-title" style="margin-bottom:10px;">${icon('user', 18)} Utilisateurs enregistrés (${users.length})</h3>
            ${users.map(u => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);gap:10px;">
                <div>
                  <strong style="font-size:13.5px;color:var(--navy);">${esc(u.name)}</strong>
                  <div style="font-size:12px;color:var(--text-light);">${esc(u.email)}</div>
                </div>
                <span class="badge ${u.role === 'admin' ? 'badge-very_high' : 'badge-medium'}">${u.role === 'admin' ? 'Administrateur' : 'Étudiant'}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  // ==================== 6. TABLEAU DE BORD IMPORTS POWERPOINT ====================
  function renderPptImportsManager(adminData, adminState) {
    const courses = asArr(adminData.courses);
    const modMap = getModMap(adminData);
    const pptCourses = courses.filter(c => c.pptImport && c.pptImport.isPowerPoint);
    const scanning = !!(adminState && adminState.scanningPpts);

    const totalSlides = pptCourses.reduce((s, c) => s + (Number(c.pptImport.slidesProcessed) || 0), 0);
    const totalLessons = pptCourses.reduce((s, c) => s + asArr(c.lessons).length, 0);
    const totalFc = pptCourses.reduce((s, c) => s + (Number(c.pptImport.flashcardsGenerated) || 0), 0);
    const totalQcm = pptCourses.reduce((s, c) => s + (Number(c.pptImport.qcmsGenerated) || 0), 0);
    const totalReviewFiles = pptCourses.filter(c => asArr(c.pptImport.manualReviewSlides).length > 0).length;
    const pendingOverlaps = pptCourses.filter(c => c.pptImport.overlapInfo && c.pptImport.overlapInfo.hasOverlap && c.pptImport.overlapInfo.resolution === 'pending').length;

    const rowsHtml = pptCourses.map(c => {
      const p = c.pptImport;
      const m = modMap[c.moduleId];
      const manSlides = asArr(p.manualReviewSlides);
      const ov = p.overlapInfo && p.overlapInfo.hasOverlap ? p.overlapInfo : null;

      let importBadge = '<span class="badge badge-orange">Brouillon — Relecture</span>';
      if (c.status === 'published') importBadge = '<span class="badge badge-green">Approuvé & Publié</span>';
      else if (p.importStatus === 'merged') importBadge = '<span class="badge badge-medium">Fusionné</span>';
      else if (manSlides.length === 0) importBadge = '<span class="badge badge-medium">Brouillon prêt</span>';

      return `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px;">
              <span class="course-code-pill">${esc(c.code)}</span>
              <strong style="color:var(--navy);">${esc(p.presentationTitle || c.title)}</strong>
            </div>
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">
              <strong>Fichier :</strong> <code>${esc(p.originalFilename)}</code> · <span class="badge badge-neutral">${esc(m ? `${m.code} (${m.subject || 'Médecine'})` : c.moduleId)}</span>
            </div>
            ${ov ? `
              <div style="font-size:12px;padding:6px 8px;border-radius:7px;background:var(--orange-soft);border:1px solid var(--orange-border);color:var(--sem-amber);margin-top:4px;">
                <strong>⚠️ Chevauchement avec ${esc(ov.matchedCourseCode)}</strong> (${esc(ov.matchedCourseTitle)})
                ${ov.resolution === 'pending' ? `
                  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;">
                    <button type="button" class="btn btn-navy btn-sm" style="padding:3px 8px;font-size:11.5px;" data-action="admin-resolve-overlap" data-cid="${esc(c.id)}" data-decision="merge" data-target="${esc(ov.matchedCourseId)}">🔀 Fusionner dans ${esc(ov.matchedCourseCode)}</button>
                    <button type="button" class="btn btn-secondary btn-sm" style="padding:3px 8px;font-size:11.5px;" data-action="admin-resolve-overlap" data-cid="${esc(c.id)}" data-decision="keep_separate">📌 Garder séparé</button>
                  </div>` : `<span class="badge badge-green" style="margin-left:6px;">${ov.resolution === 'merged' ? 'Fusionné ✓' : 'Séparé ✓'}</span>`}
              </div>` : '<span class="badge badge-green" style="font-size:11px;">Aucun doublon détecté</span>'}
          </td>
          <td style="font-variant-numeric:tabular-nums;">
            <strong>${p.slidesProcessed}</strong> diapos
            <div style="font-size:11.5px;color:var(--text-light);margin-top:3px;">
              ${p.tablesExtracted || 0} tabl. · ${p.chartsExtracted || 0} graph.<br>
              ${p.speakerNotesExtracted || 0} notes · ${p.imagesOcrCount || 0} img OCR
            </div>
          </td>
          <td style="font-variant-numeric:tabular-nums;">
            <strong>${p.chaptersCreated || asArr(c.lessons).length}</strong> chap. / <strong>${asArr(c.lessons).length}</strong> leçons
          </td>
          <td style="font-variant-numeric:tabular-nums;">
            <strong>${p.flashcardsGenerated || 0}</strong> flashcards<br>
            <strong>${p.qcmsGenerated || 0}</strong> QCM IA
          </td>
          <td>
            ${manSlides.length > 0 ? `
              <span class="badge badge-vigilance">${manSlides.length} diapo(s)</span>
              <div style="font-size:11.5px;color:var(--sem-amber);margin-top:4px;max-width:210px;">
                ${manSlides.slice(0, 6).map(ms => `<span title="${esc(ms.reason)}" style="display:inline-block;background:var(--orange-soft);padding:1px 5px;border-radius:4px;margin:1px 2px;font-weight:700;">S${ms.slideNum}</span>`).join('')}
                ${manSlides.length > 6 ? `<span style="font-size:11px;">+${manSlides.length - 6}</span>` : ''}
              </div>` : '<span class="badge badge-green">Aucune (0)</span>'}
          </td>
          <td>
            ${importBadge}
            <div style="margin-top:4px;">${window.EpiUI.statusBadge(c.status)}</div>
          </td>
          <td>
            <div class="admin-row-actions">
              <button type="button" class="btn btn-secondary btn-sm" data-action="admin-preview-course" data-cid="${esc(c.id)}" title="Prévisualiser avec l’interface étudiant MedStudy">👁 Aperçu</button>
              <button type="button" class="btn btn-primary btn-sm" data-action="admin-open-editor" data-cid="${esc(c.id)}">${icon('edit', 14)} Réviser</button>
              ${c.status === 'draft' ? `<button type="button" class="btn btn-success btn-sm" data-action="admin-set-status" data-cid="${esc(c.id)}" data-status="published">Publier</button>` : ''}
            </div>
          </td>
        </tr>`;
    }).join('');

    return `
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header" style="margin-bottom:14px;">
          <div>
            <h2 class="card-title">${icon('fileText', 20)} Imports PowerPoint (.ppt / .pptx) — Révision Administrateur</h2>
            <p class="card-subtitle">Inventaire complet des présentations extraites avec tableaux, graphiques, notes présentateur, OCR images et détection de chevauchements. Tous les imports restent en <strong>Brouillon</strong> jusqu’à votre approbation.</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button type="button" class="btn btn-secondary btn-sm" data-action="admin-scan-workspace-ppts" ${scanning ? 'disabled' : ''}>
              ${icon('refresh', 15)} ${scanning ? 'Scan en cours…' : 'Scanner nouveaux PPT du dossier'}
            </button>
            <button type="button" class="btn btn-primary btn-sm" data-action="admin-go-add">${icon('upload', 15)} Importer un .ppt / .pptx</button>
          </div>
        </div>

        <div class="kpi-grid" style="margin:0;grid-template-columns:repeat(5,minmax(0,1fr));">
          <div class="admin-kpi"><span>Présentations PPT</span><strong>${pptCourses.length}</strong></div>
          <div class="admin-kpi"><span>Diapositives traitées</span><strong>${totalSlides}</strong></div>
          <div class="admin-kpi green"><span>Chapitres / Leçons</span><strong>${totalLessons}</strong></div>
          <div class="admin-kpi"><span>Flashcards / QCM IA</span><strong>${totalFc} / ${totalQcm}</strong></div>
          <div class="admin-kpi orange"><span>Revue / Chevauchements</span><strong>${totalReviewFiles} / ${pendingOverlaps}</strong></div>
        </div>
      </div>

      <div class="alert alert-info" style="margin-bottom:16px;">
        ${icon('shield', 18)}
        <div>
          <strong>Protection des cours existants :</strong> vos 12 cours publiés initiaux ne sont jamais écrasés. Lorsqu’un PowerPoint chevauche un cours existant, utilisez <strong>« 🔀 Fusionner »</strong> (ajoute les leçons/QCM sans effacer la progression étudiante) ou <strong>« 📌 Garder séparé »</strong>, puis cliquez sur <strong>« 👁 Aperçu »</strong> pour prévisualiser le cours dans le studio étudiant avant publication.
        </div>
      </div>

      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Présentation & Chevauchement</th>
              <th>Diapositives & Médias</th>
              <th>Chapitres / Leçons</th>
              <th>Flashcards & QCM IA</th>
              <th>Relecture manuelle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="7" class="empty-state">Aucune présentation PowerPoint importée pour l’instant. Cliquez sur « Scanner nouveaux PPT du dossier ».</td></tr>'}
          </tbody>
        </table>
      </div>`;
  }

  return {
    renderCoursesManager,
    renderAddCourse,
    renderCourseEditor,
    renderModulesManager,
    renderSecurityBackups,
    renderPptImportsManager
  };
})();
