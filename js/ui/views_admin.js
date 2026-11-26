/* ==========================================================================
   EpiViewsAdmin — Système de Gestion de Contenu (CMS) Propriétaire MedStudy
   Gestion multi-matières : Cours, Upload PDF, Extraction IA, Éditeur & Sécurité
   ========================================================================== */
window.EpiViewsAdmin = (function () {
  const esc = (s) => window.EpiUI.esc(s);
  const asArr = (v) => window.EpiUI.asArr(v);
  const icon = (n, s) => window.EpiIcons.get(n, s);

  const SUBJECT_SUGGESTIONS = [
    'Anatomie', 'Physiologie', 'Histologie', 'Biochimie',
    'Épidémiologie', 'Sémiologie', 'Pharmacologie', 'Pathologie', 'Microbiologie'
  ];

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
              <strong style="color:#0f1e3a;">${esc(c.title)}</strong>
              ${needsRev && c.status === 'draft' ? '<span class="badge badge-vigilance">À relire</span>' : ''}
              ${ov && ov.resolution === 'pending' ? `<span class="badge badge-orange">⚠️ Chevauche ${esc(ov.matchedCourseCode)}</span>` : ''}
            </div>
            <div style="font-size:12px;color:#64748b;">
              ${esc(c.professor || 'Faculté de Médecine')} · ${attCount} fichier${attCount > 1 ? 's' : ''} joint${attCount > 1 ? 's' : ''}
              ${isPpt && asArr(c.pptImport.manualReviewSlides).length > 0 ? ` · <span style="color:#b45309;">${asArr(c.pptImport.manualReviewSlides).length} diapo(s) à vérifier</span>` : ''}
            </div>
          </td>
          <td>
            <span class="badge badge-medium" style="margin-bottom:3px;">${esc((m && m.subject) || 'Médecine')}</span>
            <div style="font-size:12.5px;color:#334155;">${esc(m ? m.title : 'Module inconnu')}</div>
          </td>
          <td style="font-variant-numeric:tabular-nums;">
            <strong>${lessonsCount}</strong> leçon${lessonsCount > 1 ? 's' : ''}
            <div style="font-size:12px;color:#64748b;">${fcCount} flashcards · ${qCount} QCM</div>
          </td>
          <td>
            ${window.EpiUI.statusBadge(c.status)}
            <div style="font-size:11.5px;color:#64748b;margin-top:3px;">v${c.version || 1}</div>
          </td>
          <td style="font-size:12.5px;color:#475569;white-space:nowrap;">${window.EpiUI.formatDateFR(c.createdAt)}</td>
          <td style="font-size:12.5px;color:#475569;white-space:nowrap;">${window.EpiUI.formatDateFR(c.updatedAt)}</td>
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
              <button type="button" class="btn btn-ghost btn-sm" style="color:#dc2626;" data-action="admin-delete-course" data-cid="${esc(c.id)}" title="Supprimer (avec sauvegarde préalable)">${icon('trash', 14)}</button>
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

        <div class="kpi-grid" style="margin:0 0 18px;grid-template-columns:repeat(4,minmax(0,1fr));">
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

  // ==================== 2. WORKFLOW "AJOUTER UN COURS" ====================
  function renderAddCourse(adminData, adminState) {
    const modules = asArr(adminData.modules);
    const wizard = adminState.addWizard || {
      createdCourseId: null,
      showNewModule: false,
      selectedModuleId: modules[0] ? modules[0].id : '',
      analyzing: false,
      uploading: false
    };

    const createdCourse = wizard.createdCourseId
      ? asArr(adminData.courses).find(c => c.id === wizard.createdCourseId)
      : null;

    if (!createdCourse) {
      return `
        <div style="margin-bottom:14px;">
          <button type="button" class="btn btn-ghost btn-sm" data-action="nav" data-route="admin_courses">${icon('arrowLeft', 16)} Retour à Gestion des cours</button>
        </div>

        <div class="card" style="max-width:860px;margin:0 auto;">
          <div class="card-header">
            <div>
              <h2 class="card-title">${icon('plus', 20)} Ajouter un nouveau cours médical</h2>
              <p class="card-subtitle">Étape 1 / 3 — Choisissez ou créez un module médical, renseignez le cours, puis téléversez vos PDF.</p>
            </div>
            <span class="badge badge-orange">Sera enregistré comme Brouillon</span>
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
              <h4 style="margin:0 0 10px;font-size:14.5px;color:#0f1e3a;">Créer un nouveau module médical (toute spécialité)</h4>
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
                <input id="add-course-code" name="code" type="text" class="input" placeholder="Ex. PH1, ANAT-2 (auto si vide)">
              </div>
              <div class="form-field">
                <label for="add-course-prof">Enseignant / Service</label>
                <input id="add-course-prof" name="professor" type="text" class="input" placeholder="Ex. Pr. Benali — Faculté de Médecine">
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
              <div class="form-field" style="grid-column:1 / -1;">
                <label for="add-course-summary">Description / Objectifs pédagogiques</label>
                <textarea id="add-course-summary" name="summary" rows="3" class="input" placeholder="Résumé des objectifs clés de ce cours…"></textarea>
              </div>
            </div>

            <div style="margin-top:20px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
              <button type="button" class="btn btn-secondary" data-action="nav" data-route="admin_courses">Annuler</button>
              <button type="submit" class="btn btn-primary btn-lg">
                Enregistrer comme brouillon & Téléverser les PDF →
              </button>
            </div>
          </form>
        </div>`;
    }

    // Étape 2 : Upload PDF ou PowerPoint (.pptx / .ppt) + Analyse IA
    const attachments = asArr(createdCourse.attachments);
    const primarySources = attachments.filter(a => a.kind === 'primary_pdf' || a.kind === 'primary_ppt');
    const mod = getModMap(adminData)[createdCourse.moduleId];

    return `
      <div style="margin-bottom:14px;">
        <button type="button" class="btn btn-ghost btn-sm" data-action="nav" data-route="admin_courses">${icon('arrowLeft', 16)} Retour à Gestion des cours</button>
      </div>

      <div class="card" style="max-width:900px;margin:0 auto;">
        <div class="card-header">
          <div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <span class="course-code-pill">${esc(createdCourse.code)}</span>
              <span class="badge badge-medium">${esc((mod && mod.subject) || 'Médecine')}</span>
              ${window.EpiUI.statusBadge(createdCourse.status)}
            </div>
            <h2 class="card-title">${esc(createdCourse.title)}</h2>
            <p class="card-subtitle">Étape 2 / 3 — Téléversez un ou plusieurs fichiers PDF ou PowerPoint (.pptx / .ppt, max 35 Mo), puis lancez l’analyse IA.</p>
          </div>
        </div>

        <div class="two-col" style="margin-bottom:18px;grid-template-columns:1fr 1fr;">
          <div class="upload-zone">
            <div style="font-weight:700;color:#0f1e3a;margin-bottom:4px;">${icon('fileText', 18)} Support principal : PDF ou PowerPoint (.pptx / .ppt)</div>
            <p style="font-size:12.5px;color:#64748b;margin:0 0 12px;">Formats vérifiés : <code>.pdf</code>, <code>.pptx</code>, <code>.ppt</code> (max 35 Mo). Extrait diapositives, tableaux, graphiques, notes présentateur, images OCR, flashcards et QCM.</p>
            <label class="btn btn-primary btn-sm" style="cursor:pointer;">
              ${icon('upload', 15)} ${wizard.uploading ? 'Téléversement en cours…' : 'Choisir PDF ou PowerPoint'}
              <input type="file" accept=".pdf,.pptx,.ppt,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint" multiple style="display:none;" data-action="admin-upload-files" data-cid="${esc(createdCourse.id)}" data-kind="primary_source" ${wizard.uploading ? 'disabled' : ''}>
            </label>
          </div>

          <div class="upload-zone secondary">
            <div style="font-weight:700;color:#0f1e3a;margin-bottom:4px;">${icon('bookmark', 18)} Documents annexes (optionnel)</div>
            <p style="font-size:12.5px;color:#64748b;margin:0 0 12px;">Fiches TD, schémas, annexes (<code>PDF, PPTX, PPT, TXT, MD, DOCX, PNG, JPG</code>, max 35 Mo).</p>
            <label class="btn btn-secondary btn-sm" style="cursor:pointer;">
              ${icon('upload', 15)} Ajouter des documents annexes
              <input type="file" accept=".pdf,.pptx,.ppt,.txt,.md,.docx,.png,.jpg,.jpeg" multiple style="display:none;" data-action="admin-upload-files" data-cid="${esc(createdCourse.id)}" data-kind="support_doc" ${wizard.uploading ? 'disabled' : ''}>
            </label>
          </div>
        </div>

        ${renderAttachmentsList(createdCourse)}

        <div class="alert alert-info" style="margin-top:16px;">
          ${icon('sparkle', 18)}
          <div>
            <strong>Extraction transparente et contrôlée :</strong> le bouton « Analyser le cours avec l’IA » extrait chaque page PDF ou diapositive PowerPoint (avec tableaux, graphiques, notes et OCR), préserve la terminologie d’origine, indique le numéro de page/diapositive source et signale toute zone incertaine. <strong>Tout reste en brouillon tant que vous ne publiez pas.</strong>
          </div>
        </div>

        <div style="margin-top:20px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
          <button type="button" class="btn btn-secondary" data-action="admin-open-editor" data-cid="${esc(createdCourse.id)}">
            Ouvrir l’éditeur manuel →
          </button>
          <button type="button" class="btn btn-navy btn-lg" data-action="admin-analyze-course" data-cid="${esc(createdCourse.id)}" ${primarySources.length === 0 || wizard.analyzing ? 'disabled' : ''}>
            ${icon('sparkle', 18)} ${wizard.analyzing ? 'Analyse IA & OCR en cours…' : 'Analyser le cours avec l’IA'}
          </button>
        </div>
      </div>`;
  }

  function renderAttachmentsList(course) {
    const attachments = asArr(course.attachments);
    if (!attachments.length) {
      return `<div style="padding:14px;border:1px dashed #cbd5e1;border-radius:10px;text-align:center;color:#64748b;font-size:13.5px;">Aucun fichier téléversé pour ce cours pour le moment.</div>`;
    }
    return `
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${attachments.map(a => `
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:10px;min-width:0;">
              ${icon('fileText', 17)}
              <div style="min-width:0;">
                <strong style="font-size:13.5px;color:#0f1e3a;">${esc(a.originalName)}</strong>
                <div style="font-size:12px;color:#64748b;">
                  <span class="badge ${a.kind === 'primary_pdf' || a.kind === 'primary_ppt' ? 'badge-medium' : 'badge-neutral'}">${a.kind === 'primary_ppt' ? 'PowerPoint principal' : (a.kind === 'primary_pdf' ? 'PDF principal' : 'Annexe')}</span>
                  · ${window.EpiUI.formatBytes(a.sizeBytes)}
                  ${a.pageCount ? ` · <strong>${a.pageCount} ${a.kind === 'primary_ppt' ? 'diapositive' : 'page'}${a.pageCount > 1 ? 's' : ''}</strong>` : ''}
                </div>
              </div>
            </div>
            <div style="display:flex;gap:8px;">
              <a class="btn btn-secondary btn-sm" href="${window.EpiAPI.fileUrl(a.id)}" target="_blank" rel="noopener">Ouvrir</a>
              <button type="button" class="btn btn-ghost btn-sm" style="color:#dc2626;" data-action="admin-delete-file" data-cid="${esc(course.id)}" data-fid="${esc(a.id)}">${icon('trash', 14)}</button>
            </div>
          </div>`).join('')}
      </div>`;
  }

  // ==================== 3. ÉDITEUR & RÉVISION AVANT PUBLICATION ====================
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

    let tabBody = '';
    if (tab === 'meta') {
      tabBody = renderEditorMetaTab(course, modules, ed);
    } else if (tab === 'lessons') {
      tabBody = renderEditorLessonsTab(course, lessons, ed);
    } else if (tab === 'flashcards') {
      tabBody = renderEditorFlashcardsTab(lessons, flashcards, ed);
    } else {
      tabBody = renderEditorQcmsTab(lessons, qcms, ed);
    }

    return `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:14px;">
        <button type="button" class="btn btn-ghost btn-sm" data-action="admin-exit-editor">${icon('arrowLeft', 16)} Retour à Gestion des cours</button>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          ${ed.dirty ? '<span class="badge badge-orange">● Modifications non enregistrées</span>' : '<span class="badge badge-green">✓ Synchronisé</span>'}
          <button type="button" class="btn btn-secondary btn-sm" data-action="admin-preview-course" data-cid="${esc(course.id)}">
            👁 Prévisualiser (Vue Étudiant)
          </button>
          <button type="button" class="btn btn-secondary btn-sm" data-action="admin-analyze-course" data-cid="${esc(course.id)}" ${primarySourceCount === 0 || ed.analyzing ? 'disabled' : ''}>
            ${icon('sparkle', 15)} ${ed.analyzing ? 'Analyse IA en cours…' : 'Analyser le cours avec l’IA'}
          </button>
          ${course.status === 'published' ? `
            <button type="button" class="btn btn-warning btn-sm" data-action="admin-editor-save" data-mode="draft" ${ed.saving ? 'disabled' : ''}>
              Enregistrer comme brouillon (Dépublier)
            </button>
            <button type="button" class="btn btn-success" data-action="admin-editor-save" data-mode="publish" ${ed.saving ? 'disabled' : ''}>
              ${icon('check', 16)} ${ed.saving ? 'Enregistrement…' : 'Enregistrer les modifications (Publié)'}
            </button>
          ` : `
            <button type="button" class="btn btn-secondary" data-action="admin-editor-save" data-mode="draft" ${ed.saving ? 'disabled' : ''}>
              ${ed.saving ? 'Enregistrement…' : 'Enregistrer comme brouillon'}
            </button>
            <button type="button" class="btn btn-success" data-action="admin-editor-save" data-mode="publish" ${ed.saving ? 'disabled' : ''}>
              ${icon('check', 16)} ${ed.saving ? 'Publication…' : 'Publier le cours'}
            </button>
          `}
        </div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
          <div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:5px;">
              <span class="course-code-pill">${esc(course.code)}</span>
              <span class="badge badge-medium">${esc((mod && mod.subject) || 'Médecine')}</span>
              ${window.EpiUI.statusBadge(course.status)}
              <span style="font-size:12px;color:#64748b;">Version ${course.version || 1} · ${lessons.length} leçon(s) · ${flashcards.length} flashcard(s) · ${qcms.length} QCM</span>
            </div>
            <h1 style="margin:0;font-size:20px;color:#0f1e3a;">Éditeur : ${esc(course.title)}</h1>
          </div>
        </div>

        ${course.status === 'published' ? `
          <div class="alert alert-info" style="margin:14px 0 0;">
            ${icon('shield', 18)}
            <div>
              <strong>Protection de la progression étudiante :</strong> ce cours est publié. Les corrections mineures n’affectent pas les étudiants. Si une leçon subit un changement structurel majeur, cochez <em>« Modification majeure de structure »</em> dans l’onglet Chapitres & Leçons : elle sera signalée pour révision <strong>sans effacer leur progression</strong>.
            </div>
          </div>` : ''}

        ${ov ? `
          <div class="alert alert-warning" style="margin:14px 0 0;align-items:center;justify-content:space-between;flex-wrap:wrap;">
            <div style="flex:1;min-width:240px;">
              <strong>⚠️ Chevauchement détecté avec le cours existant ${esc(ov.matchedCourseCode)} (« ${esc(ov.matchedCourseTitle)} ») :</strong>
              ${esc(ov.reason)}
              ${ov.resolution && ov.resolution !== 'pending' ? `<br><span class="badge badge-green" style="margin-top:4px;">Décision enregistrée : ${ov.resolution === 'merged' ? 'Fusionné' : 'Conservé séparé'}</span>` : ''}
            </div>
            ${ov.resolution === 'pending' ? `
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button type="button" class="btn btn-navy btn-sm" data-action="admin-resolve-overlap" data-cid="${esc(course.id)}" data-decision="merge" data-target="${esc(ov.matchedCourseId)}">🔀 Fusionner dans ${esc(ov.matchedCourseCode)}</button>
                <button type="button" class="btn btn-secondary btn-sm" data-action="admin-resolve-overlap" data-cid="${esc(course.id)}" data-decision="keep_separate">📌 Garder séparé</button>
              </div>` : ''}
          </div>` : ''}

        ${ai.analyzedAt ? `
          <div class="alert ${warnings.length > 0 ? 'alert-warning' : 'alert-success'}" style="margin:14px 0 0;">
            ${icon('sparkle', 18)}
            <div style="flex:1;">
              <strong>Rapport d’extraction ${ppt ? 'PowerPoint' : 'IA'} (${window.EpiUI.formatDateFR(ai.analyzedAt)}) :</strong>
              ${ai.totalPages || 0} ${ppt ? 'diapositive(s)' : 'page(s)'} analysée(s) via <em>${esc(ai.engine || 'Moteur MedStudy')}</em> → ${lessons.length} chapitre(s)/leçon(s), ${flashcards.length} flashcard(s), ${qcms.length} QCM.
              ${ppt ? `<br><strong>Éléments extraits :</strong> ${ppt.tablesExtracted || 0} tableau(x) · ${ppt.chartsExtracted || 0} graphique(s) · ${ppt.speakerNotesExtracted || 0} note(s) présentateur · ${ppt.imagesOcrCount || 0} image(s) analysée(s) par OCR.` : ''}
              ${lowPages.length > 0 ? `<br><strong>⚠️ ${ppt ? 'Diapositives' : 'Pages'} à vérifier manuellement :</strong> ${ppt ? 'Diapos' : 'Pages'} ${lowPages.join(', ')}.` : ''}
              ${ppt && asArr(ppt.manualReviewSlides).length > 0 ? `<ul style="margin:6px 0 0;padding-left:18px;font-size:12.5px;">${asArr(ppt.manualReviewSlides).map(ms => `<li><strong>Diapo ${ms.slideNum}</strong> (${esc(ms.title)}) : ${esc(ms.reason)}</li>`).join('')}</ul>` : (warnings.length > 0 ? `<ul style="margin:6px 0 0;padding-left:18px;font-size:13px;">${warnings.map(w => `<li>${esc(w)}</li>`).join('')}</ul>` : '')}
            </div>
          </div>` : ''}
      </div>

      <div class="tabs-row">
        <button type="button" class="tab-btn ${tab === 'meta' ? 'active' : ''}" data-action="admin-editor-tab" data-tab="meta">
          Métadonnées & PDF (${asArr(course.attachments).length})
        </button>
        <button type="button" class="tab-btn ${tab === 'lessons' ? 'active' : ''}" data-action="admin-editor-tab" data-tab="lessons">
          Chapitres & Leçons (${lessons.length})
        </button>
        <button type="button" class="tab-btn ${tab === 'flashcards' ? 'active' : ''}" data-action="admin-editor-tab" data-tab="flashcards">
          Flashcards (${flashcards.length})${fcNeedsReview > 0 ? ` · ${fcNeedsReview} à relire` : ''}
        </button>
        <button type="button" class="tab-btn ${tab === 'qcms' ? 'active' : ''}" data-action="admin-editor-tab" data-tab="qcms">
          QCM (${qcms.length})${qcmNeedsReview > 0 ? ` · ${qcmNeedsReview} à relire` : ''}
        </button>
      </div>

      ${tabBody}`;
  }

  function renderEditorMetaTab(course, modules, ed) {
    return `
      <div class="card" style="margin-bottom:16px;">
        <h3 class="card-title" style="margin-bottom:14px;">Informations générales du cours</h3>
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
            <label>Titre abrégé</label>
            <input type="text" class="input" value="${esc(course.shortTitle || '')}" data-ed-course="shortTitle">
          </div>
          <div class="form-field">
            <label>Enseignant</label>
            <input type="text" class="input" value="${esc(course.professor || '')}" data-ed-course="professor">
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
      </div>

      <div class="card">
        <div class="card-header" style="margin-bottom:12px;">
          <div>
            <h3 class="card-title">${icon('fileText', 18)} Fichiers PDF & Supports annexes</h3>
            <p class="card-subtitle">Les fichiers sont stockés dans le répertoire serveur protégé et accessibles uniquement selon les droits du cours.</p>
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
      </div>`;
  }

  function renderEditorLessonsTab(course, lessons, ed) {
    const activeIdx = Math.min(Math.max(0, ed.activeLessonIdx || 0), Math.max(0, lessons.length - 1));
    const lesson = lessons[activeIdx] || null;
    const majorSet = new Set(ed.majorLessonIds || []);

    const listHtml = lessons.map((l, idx) => `
      <div class="editor-lesson-pill ${idx === activeIdx ? 'active' : ''}">
        <button type="button" class="editor-lesson-select" data-action="admin-ed-select-lesson" data-idx="${idx}">
          <div style="font-weight:700;font-size:13.5px;color:#0f1e3a;">${idx + 1}. ${esc(l.title || 'Sans titre')}</div>
          <div style="font-size:11.5px;color:#64748b;display:flex;gap:6px;flex-wrap:wrap;margin-top:2px;">
            <span>${esc(l.sourceRef || l.id)}</span>
            ${l.needsReview ? '<span class="badge badge-vigilance" style="padding:1px 6px;">À relire</span>' : ''}
            ${majorSet.has(l.id) ? '<span class="badge badge-orange" style="padding:1px 6px;">MAJ majeure</span>' : ''}
          </div>
        </button>
        <div style="display:flex;gap:4px;">
          ${idx > 0 ? `<button type="button" class="btn btn-ghost btn-sm" style="padding:2px 6px;" data-action="admin-ed-move-lesson" data-idx="${idx}" data-dir="-1" title="Monter">▲</button>` : ''}
          ${idx < lessons.length - 1 ? `<button type="button" class="btn btn-ghost btn-sm" style="padding:2px 6px;" data-action="admin-ed-move-lesson" data-idx="${idx}" data-dir="1" title="Descendre">▼</button>` : ''}
          <button type="button" class="btn btn-ghost btn-sm" style="padding:2px 6px;color:#dc2626;" data-action="admin-ed-delete-lesson" data-idx="${idx}" title="Supprimer">${icon('trash', 13)}</button>
        </div>
      </div>`).join('');

    let detailHtml = `<div class="card empty-state">Aucune leçon dans ce cours. Cliquez sur « + Ajouter une leçon » ou lancez « Analyser le cours avec l’IA ».</div>`;
    if (lesson) {
      const u = lesson.understand || { intro: '', sections: [{ heading: lesson.title, paragraphs: [], bullets: [] }], tables: [], darija: '', triad: { toUnderstand: [], toMemorize: [], toRecognizeInQcm: [] } };
      const sec0 = asArr(u.sections)[0] || { heading: lesson.title, paragraphs: [], bullets: [] };
      const triad = u.triad || { toUnderstand: [], toMemorize: [], toRecognizeInQcm: [] };
      const memItems = asArr(lesson.memorize);
      const isMajor = majorSet.has(lesson.id);

      const stripTags = (s) => String(s || '').replace(/<[^>]+>/g, '').trim();

      detailHtml = `
        <div class="card">
          <div class="card-header" style="margin-bottom:14px;">
            <div>
              <h3 class="card-title">Chapitre / Leçon #${activeIdx + 1} (${esc(lesson.id)})</h3>
              ${lesson.extractionNote ? `<p class="card-subtitle" style="color:#b45309;">${esc(lesson.extractionNote)}</p>` : ''}
            </div>
            <label style="display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;cursor:pointer;">
              <input type="checkbox" ${!lesson.needsReview ? 'checked' : ''} data-ed-lesson-reviewed="${activeIdx}">
              Relue & validée
            </label>
          </div>

          ${course.status === 'published' ? `
            <div class="admin-major-box ${isMajor ? 'active' : ''}">
              <label style="display:flex;align-items:flex-start;gap:9px;cursor:pointer;font-size:13.5px;font-weight:700;color:#92400e;">
                <input type="checkbox" ${isMajor ? 'checked' : ''} data-action="admin-ed-toggle-major" data-lid="${esc(lesson.id)}" style="margin-top:3px;">
                <span>🔄 Modification majeure de structure — signaler cette leçon pour révision aux étudiants (sans effacer leur progression)</span>
              </label>
              ${isMajor ? `
                <div style="margin-top:8px;">
                  <input type="text" class="input" style="width:100%;" placeholder="Ex. Ajout des nouveaux critères diagnostiques 2026 et mise à jour des seuils" value="${esc(lesson.majorUpdateNote || '')}" data-ed-lesson="majorUpdateNote" data-lidx="${activeIdx}">
                </div>` : ''}
            </div>` : ''}

          <div class="form-grid" style="margin-bottom:16px;">
            <div class="form-field" style="grid-column:1 / -1;">
              <label>Titre de la leçon / chapitre *</label>
              <input type="text" class="input" value="${esc(lesson.title || '')}" data-ed-lesson="title" data-lidx="${activeIdx}">
            </div>
            <div class="form-field">
              <label>Référence PDF / Source (traçabilité page)</label>
              <input type="text" class="input" value="${esc(lesson.sourceRef || '')}" data-ed-lesson="sourceRef" data-lidx="${activeIdx}">
            </div>
            <div class="form-field">
              <label>Durée estimée (minutes)</label>
              <input type="number" min="3" max="120" class="input" value="${Number(lesson.durationMin) || 10}" data-ed-lesson="durationMin" data-lidx="${activeIdx}">
            </div>
          </div>

          <div class="admin-subpanel" style="margin-bottom:16px;">
            <h4 style="margin:0 0 10px;font-size:14.5px;color:#0f1e3a;">Étape A — Explication du cours</h4>
            <div class="form-field" style="margin-bottom:10px;">
              <label>Introduction pédagogique</label>
              <textarea rows="2" class="input" data-ed-lesson="intro" data-lidx="${activeIdx}">${esc(u.intro || '')}</textarea>
            </div>
            <div class="form-field" style="margin-bottom:10px;">
              <label>Titre de la section principale</label>
              <input type="text" class="input" value="${esc(sec0.heading || lesson.title || '')}" data-ed-lesson="sec0Heading" data-lidx="${activeIdx}">
            </div>
            <div class="form-field" style="margin-bottom:10px;">
              <label>Paragraphes explicatifs (1 paragraphe par ligne)</label>
              <textarea rows="5" class="input" data-ed-lesson="sec0Paragraphs" data-lidx="${activeIdx}">${esc(asArr(sec0.paragraphs).map(stripTags).join('\n'))}</textarea>
            </div>
            <div class="form-field" style="margin-bottom:10px;">
              <label>Points clés / Énumérations (1 puce par ligne)</label>
              <textarea rows="4" class="input" data-ed-lesson="sec0Bullets" data-lidx="${activeIdx}">${esc(asArr(sec0.bullets).map(stripTags).join('\n'))}</textarea>
            </div>
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

          <div class="admin-subpanel">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;flex-wrap:wrap;">
              <h4 style="margin:0;font-size:14.5px;color:#0f1e3a;">Étape B — Fiches « À mémoriser » (${memItems.length})</h4>
              <button type="button" class="btn btn-primary btn-sm" data-action="admin-ed-add-mem" data-lidx="${activeIdx}">${icon('plus', 14)} Ajouter un élément</button>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;">
              ${memItems.map((m, mi) => `
                <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:12px;">
                  <div style="display:grid;grid-template-columns:1fr 1.6fr 0.8fr auto;gap:8px;margin-bottom:8px;align-items:center;">
                    <input type="text" class="input" placeholder="Catégorie" value="${esc(m.category || 'Définition')}" data-ed-mem="category" data-lidx="${activeIdx}" data-midx="${mi}">
                    <input type="text" class="input" placeholder="Titre de la notion" value="${esc(m.title || '')}" data-ed-mem="title" data-lidx="${activeIdx}" data-midx="${mi}">
                    <input type="text" class="input" placeholder="Page PDF" value="${esc(m.pageRef || '')}" data-ed-mem="pageRef" data-lidx="${activeIdx}" data-midx="${mi}">
                    <button type="button" class="btn btn-ghost btn-sm" style="color:#dc2626;" data-action="admin-ed-del-mem" data-lidx="${activeIdx}" data-midx="${mi}">${icon('trash', 14)}</button>
                  </div>
                  <textarea rows="2" class="input" style="width:100%;" placeholder="Contenu exact à mémoriser…" data-ed-mem="content" data-lidx="${activeIdx}" data-midx="${mi}">${esc(stripTags(m.content || ''))}</textarea>
                </div>`).join('') || '<div style="font-size:13px;color:#64748b;">Aucun élément à mémoriser dans cette leçon.</div>'}
            </div>
          </div>
        </div>`;
    }

    return `
      <div class="editor-split">
        <div class="card" style="padding:14px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
            <strong style="font-size:14px;color:#0f1e3a;">Chapitres (${lessons.length})</strong>
            <button type="button" class="btn btn-primary btn-sm" data-action="admin-ed-add-lesson">${icon('plus', 14)} Ajouter</button>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;">
            ${listHtml || '<div style="font-size:13px;color:#64748b;padding:8px;">Aucune leçon</div>'}
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
            <strong style="font-size:15px;color:#0f1e3a;">Révision des Flashcards (${items.length})</strong>
            <select class="select" data-filter="admin-ed-fc-lesson">
              <option value="all" ${flt === 'all' ? 'selected' : ''}>Toutes les leçons</option>
              ${lessons.map((l, i) => `<option value="${esc(l.id)}" ${flt === l.id ? 'selected' : ''}>${i + 1}. ${esc(l.title)}</option>`).join('')}
            </select>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button type="button" class="btn btn-secondary btn-sm" data-action="admin-ed-approve-all-fc">${icon('check', 14)} Tout valider (retirer « À relire »)</button>
            <button type="button" class="btn btn-primary btn-sm" data-action="admin-ed-add-fc" ${lessons.length === 0 ? 'disabled' : ''}>${icon('plus', 14)} Ajouter une flashcard</button>
          </div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:12px;">
        ${items.map(({ fc, idx }) => `
          <div class="card" style="padding:16px;border-left:4px solid ${fc.needsReview ? '#d97706' : '#059669'};">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <span class="badge ${fc.needsReview ? 'badge-vigilance' : 'badge-green'}">${fc.needsReview ? 'Brouillon IA à relire' : 'Validée'}</span>
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
                <input type="text" class="input" style="width:110px;padding:5px 8px;font-size:13px;" placeholder="Page PDF" value="${esc(fc.pageRef || '')}" data-ed-fc="pageRef" data-fidx="${idx}">
              </div>
              <div style="display:flex;gap:6px;">
                ${fc.needsReview ? `<button type="button" class="btn btn-success btn-sm" data-action="admin-ed-approve-fc" data-fidx="${idx}">✓ Valider</button>` : ''}
                <button type="button" class="btn btn-ghost btn-sm" style="color:#dc2626;" data-action="admin-ed-del-fc" data-fidx="${idx}">${icon('trash', 14)} Suppr.</button>
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
            <strong style="font-size:15px;color:#0f1e3a;">Révision des QCM (${items.length})</strong>
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
          return `
            <div class="card" style="padding:16px;border-left:4px solid ${q.needsReview ? '#d97706' : '#059669'};">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                  <span class="badge ${q.needsReview ? 'badge-vigilance' : 'badge-green'}">${q.needsReview ? 'Brouillon IA à relire' : 'Validé'}</span>
                  <select class="select" style="padding:5px 8px;font-size:13px;" data-ed-qcm="lessonId" data-qidx="${idx}">
                    ${lessons.map((l, li) => `<option value="${esc(l.id)}" ${q.lessonId === l.id ? 'selected' : ''}>Leçon ${li + 1} : ${esc(l.title)}</option>`).join('')}
                  </select>
                  <input type="text" class="input" style="width:110px;padding:5px 8px;font-size:13px;" placeholder="Page PDF" value="${esc(q.pageRef || '')}" data-ed-qcm="pageRef" data-qidx="${idx}">
                  <label style="font-size:12.5px;display:flex;align-items:center;gap:5px;cursor:pointer;">
                    <input type="checkbox" ${q.multiSelect ? 'checked' : ''} data-ed-qcm="multiSelect" data-qidx="${idx}"> Choix multiples
                  </label>
                </div>
                <div style="display:flex;gap:6px;">
                  ${q.needsReview ? `<button type="button" class="btn btn-success btn-sm" data-action="admin-ed-approve-qcm" data-qidx="${idx}">✓ Valider</button>` : ''}
                  <button type="button" class="btn btn-ghost btn-sm" style="color:#dc2626;" data-action="admin-ed-del-qcm" data-qidx="${idx}">${icon('trash', 14)} Suppr.</button>
                </div>
              </div>

              <div class="form-field" style="margin-bottom:10px;">
                <label>Énoncé de la question</label>
                <textarea rows="2" class="input" data-ed-qcm="stem" data-qidx="${idx}">${esc(q.stem || '')}</textarea>
              </div>

              <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px;">
                <label style="font-size:12.5px;font-weight:700;color:#475569;">Propositions (cochez la ou les bonne(s) réponse(s)) :</label>
                ${opts.map((opt, oi) => `
                  <div style="display:flex;align-items:center;gap:8px;">
                    <label style="display:flex;align-items:center;gap:4px;min-width:54px;font-weight:700;color:${correctSet.has(opt.key) ? '#059669' : '#475569'};cursor:pointer;">
                      <input type="checkbox" ${correctSet.has(opt.key) ? 'checked' : ''} data-ed-qcm-corr="${esc(opt.key)}" data-qidx="${idx}"> ${esc(opt.key)}
                    </label>
                    <input type="text" class="input" style="flex:1;" value="${esc(opt.text || '')}" data-ed-qcm-opt="${oi}" data-qidx="${idx}">
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
          <h4 style="margin:0 0 10px;font-size:14.5px;color:#0f1e3a;">Ajouter un nouveau module médical</h4>
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
              <p style="margin:0;font-size:13px;color:#64748b;">${esc(m.description || '')}</p>
              <div style="font-size:13px;color:#475569;margin-top:auto;">
                <strong>${modCourses.length}</strong> cours (${pubCnt} publié${pubCnt > 1 ? 's' : ''})
              </div>
              <div style="display:flex;justify-content:space-between;gap:8px;padding-top:6px;border-top:1px solid #f1f5f9;">
                <button type="button" class="btn btn-secondary btn-sm" data-action="admin-edit-module-modal" data-mid="${esc(m.id)}">${icon('edit', 14)} Modifier</button>
                <button type="button" class="btn btn-ghost btn-sm" style="color:#dc2626;" data-action="admin-delete-module" data-mid="${esc(m.id)}" ${modCourses.length > 0 ? 'disabled title="Supprimez ou déplacez les cours d’abord"' : ''}>${icon('trash', 14)} Supprimer</button>
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
                    <td><code style="font-size:12px;">${esc(b.filename)}</code></td>
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
            <h3 class="card-title" style="margin-bottom:6px;">${icon('sparkle', 18)} Moteur d’extraction IA (Serveur uniquement)</h3>
            <p class="card-subtitle" style="margin-bottom:12px;">Toute clé API éventuelle est stockée exclusivement dans <code>server_data/secrets.json</code> (jamais exposée au navigateur).</p>
            <div style="margin-bottom:10px;font-size:13px;">
              Moteur actif : <span class="badge badge-medium">${esc(aiCfg.provider)}</span> ·
              Clé API : <span class="badge ${aiCfg.configured ? 'badge-green' : 'badge-neutral'}">${aiCfg.configured ? 'Configurée côté serveur' : 'Mode 100 % local (OCR fr-FR)'}</span>
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
                ${aiCfg.configured ? '<button type="button" class="btn btn-ghost btn-sm" style="color:#dc2626;" data-action="admin-clear-ai-key">Effacer la clé</button>' : ''}
              </div>
            </form>
          </div>

          <div class="card">
            <h3 class="card-title" style="margin-bottom:10px;">${icon('user', 18)} Utilisateurs enregistrés (${users.length})</h3>
            ${users.map(u => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;gap:10px;">
                <div>
                  <strong style="font-size:13.5px;color:#0f1e3a;">${esc(u.name)}</strong>
                  <div style="font-size:12px;color:#64748b;">${esc(u.email)}</div>
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
              <strong style="color:#0f1e3a;">${esc(p.presentationTitle || c.title)}</strong>
            </div>
            <div style="font-size:12px;color:#475569;margin-bottom:4px;">
              <strong>Fichier :</strong> <code>${esc(p.originalFilename)}</code> · <span class="badge badge-neutral">${esc(m ? `${m.code} (${m.subject || 'Médecine'})` : c.moduleId)}</span>
            </div>
            ${ov ? `
              <div style="font-size:12px;padding:6px 8px;border-radius:7px;background:#fffbeb;border:1px solid #fde68a;color:#92400e;margin-top:4px;">
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
            <div style="font-size:11.5px;color:#64748b;margin-top:3px;">
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
              <div style="font-size:11.5px;color:#b45309;margin-top:4px;max-width:210px;">
                ${manSlides.slice(0, 6).map(ms => `<span title="${esc(ms.reason)}" style="display:inline-block;background:#fef3c7;padding:1px 5px;border-radius:4px;margin:1px 2px;font-weight:700;">S${ms.slideNum}</span>`).join('')}
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
