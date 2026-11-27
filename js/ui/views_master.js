/* ==========================================================================
   EpiViewsMaster — Intégration Interactive des Livrables Master 01–04 (25 Cours)
   1) Fiche de révision structurée en 7 sections dans chaque cours (C1–C25)
   2) Vue « Analyse des examens » (Master 01 — Fréquences, Répétitions, Scoring 0–100)
   3) Vue « Stratégie finale » (Master 04 — 4 Vagues, Top 20, Fiche de Survie Ultime)
   ========================================================================== */
window.EpiViewsMaster = (function () {
  const esc = (s) => window.EpiUI.esc(s);
  const asArr = (v) => window.EpiUI.asArr(v);
  const icon = (n, s) => window.EpiIcons.get(n, s);

  function fmtInline(text) {
    return window.EpiFormat ? window.EpiFormat.enhanceInlineText(String(text || ''), { skipLeadTerm: true }) : esc(text);
  }

  // ==================== 1. FICHE DE RÉVISION (7 SECTIONS) PAR COURS ====================
  function renderRevisionSheetBlock(course, checkedMap, opts) {
    const o = opts || {};
    const rs = course && course.metadata && course.metadata.revisionSheet;
    if (!rs) {
      return `
        <div class="card empty-state">
          <strong>Aucune fiche de révision structurée pour ce cours.</strong><br>
          <span style="font-size:13.5px;color:var(--text-light);">Les 25 cours officiels d’Épidémiologie (C1 à C25) disposent chacun de leur fiche complète en 7 sections.</span>
        </div>`;
    }

    const checks = asArr(rs.checklist);
    const checkedDone = checks.filter((_, i) => !!(checkedMap && checkedMap[`${course.id}_${i}`])).length;

    const distinctions = asArr(rs.distinctions);
    const distHtml = distinctions.length > 0 ? `
      <div class="data-table-wrap" style="margin-top:10px;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Concept A</th>
              <th>Concept B</th>
              <th>Distinction & Piège d’examen</th>
            </tr>
          </thead>
          <tbody>
            ${distinctions.map(d => `
              <tr>
                <td><strong>${fmtInline(d.left)}</strong></td>
                <td><strong>${fmtInline(d.right)}</strong></td>
                <td>${fmtInline(d.detail)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>` : `<p style="font-size:13.5px;color:var(--text-muted);margin:0;">Aucune distinction particulière signalée.</p>`;

    return `
      <div class="card" style="margin-bottom:18px;border-left:4px solid var(--primary);">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
          <div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <span class="course-code-pill">${esc(course.code)}</span>
              <span class="badge badge-bm">Fiche de révision · 7 sections</span>
              ${course.bmCount > 0 ? `<span class="badge badge-medium">${course.bmCount} QCM BM</span>` : '<span class="badge badge-vigilance">Vigilance 2026</span>'}
            </div>
            <h2 class="edu-h2" style="margin:0 0 4px;">Fiche de révision stratégique — ${esc(course.title)}</h2>
            <div style="font-size:13px;color:var(--text-light);">${esc(rs.sourceSummary || '')}</div>
          </div>
          ${!o.isPreview ? `
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="btn btn-secondary btn-sm" data-action="qcm-filter-course" data-course="${esc(course.id)}">${icon('clipboard', 14)} QCM de ${esc(course.code)}</button>
              <button type="button" class="btn btn-primary btn-sm" data-action="course-tab" data-tab="roadmap">← Feuille de route</button>
            </div>` : ''}
        </div>
      </div>

      ${rs.darija ? `
        <div class="edu-callout edu-box-darija" style="margin-bottom:18px;">
          <div class="edu-callout-head">
            <span class="edu-callout-tag">${icon('sparkle', 14)}<span>💡 Résumé express en Darija algérienne</span></span>
          </div>
          <div class="edu-callout-body">${fmtInline(rs.darija)}</div>
        </div>` : ''}

      <div class="card" style="margin-bottom:16px;">
        <h3 class="edu-h3" style="margin:0 0 10px;">1. Ce que je DOIS mémoriser absolument</h3>
        <ul class="edu-list">
          ${asArr(rs.mustMemorize).map(item => `<li>${fmtInline(item)}</li>`).join('')}
        </ul>
      </div>

      <div class="two-col" style="margin-bottom:16px;">
        <div class="card" style="margin:0;">
          <h3 class="edu-h3" style="margin:0 0 10px;">2. Ce qui tombe le plus souvent dans la BM</h3>
          <ul class="edu-list">
            ${asArr(rs.mostFrequent).map(item => `<li>${fmtInline(item)}</li>`).join('')}
          </ul>
        </div>

        <div class="card" style="margin:0;">
          <h3 class="edu-h3" style="margin:0 0 10px;">4. Formules, chiffres & repères clés</h3>
          <ul class="edu-list">
            ${asArr(rs.formulas).map(item => `<li>${fmtInline(item)}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <h3 class="edu-h3" style="margin:0 0 6px;">3. Distinctions essentielles à ne jamais confondre</h3>
        ${distHtml}
      </div>

      <div class="edu-callout edu-box-warning" style="margin-bottom:16px;">
        <div class="edu-callout-head">
          <span class="edu-callout-tag">${icon('alert', 14)}<span>5. Pièges d’examen & Erreurs prouvées du corrigé BM</span></span>
        </div>
        <div class="edu-callout-body">
          <ul class="edu-list" style="margin:6px 0 0;">
            ${asArr(rs.traps).map(item => `<li>${fmtInline(item)}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="two-col">
        <div class="card" style="margin:0;">
          <h3 class="edu-h3" style="margin:0 0 10px;">6. Moins représenté dans la BM (2e tour)</h3>
          <ul class="edu-list">
            ${asArr(rs.lessTime).map(item => `<li>${fmtInline(item)}</li>`).join('')}
          </ul>
        </div>

        <div class="card" style="margin:0;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;">
            <h3 class="edu-h3" style="margin:0;">7. Checklist finale (${checkedDone}/${checks.length})</h3>
            <span class="badge ${checkedDone === checks.length && checks.length > 0 ? 'badge-green' : 'badge-neutral'}">${checks.length > 0 ? Math.round((checkedDone / checks.length) * 100) : 0} %</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${checks.map((item, idx) => {
              const key = `${course.id}_${idx}`;
              const isChk = !!(checkedMap && checkedMap[key]);
              return `
                <label style="display:flex;align-items:flex-start;gap:10px;padding:9px 11px;border-radius:10px;border:1px solid ${isChk ? 'var(--green-border)' : 'var(--border)'};background:${isChk ? 'var(--green-soft)' : 'var(--surface-soft)'};cursor:pointer;font-size:13.5px;">
                  <input type="checkbox" ${isChk ? 'checked' : ''} data-action="toggle-rev-check" data-key="${esc(key)}" style="margin-top:3px;">
                  <span style="${isChk ? 'text-decoration:line-through;opacity:0.8;' : ''}">${fmtInline(item)}</span>
                </label>`;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ==================== 2. VUE « ANALYSE DES EXAMENS » (MASTER 01) ====================
  function renderExamAnalysis(profile, uiState) {
    const data = window.EpiData.masterExamAnalysis;
    const audit = window.EpiData.bmAudit || {};
    const bmErrors = asArr(window.EpiData.bmErrors);
    const outOfCourse = asArr(window.EpiData.outOfCourseBM);
    if (!data) {
      return `<div class="card empty-state">Les données d’analyse des examens (Master 01) ne sont pas encore chargées.</div>`;
    }

    const tab = (uiState && uiState.analysisTab) || 'frequencies';
    const scoreFilter = (uiState && uiState.analysisScoreFilter) || 'all';
    const courseFreqs = asArr(data.courseFrequencies);
    const maxRaw = Math.max(1, ...courseFreqs.map(c => Number(c.rawCount) || 0));

    let bodyHtml = '';

    if (tab === 'frequencies') {
      bodyHtml = `
        <div class="card" style="margin-bottom:18px;">
          <div class="card-header" style="margin-bottom:14px;">
            <div>
              <h2 class="card-title">${icon('barChart', 19)} Fréquence historique des 25 cours dans la BM (2012–2025)</h2>
              <p class="card-subtitle">Réconciliation mathématique exacte sans double comptage : <strong>362 QCM liés aux 25 cours</strong> + 114 hors cours = 476 questions vérifiées.</p>
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:10px;">
            ${courseFreqs.map((c, idx) => {
              const pctW = Math.max(3, Math.round(((Number(c.rawCount) || 0) / maxRaw) * 100));
              const barColor = c.priority === 'very_high' ? 'var(--red)' : (c.priority === 'high' ? 'var(--orange)' : 'var(--primary)');
              return `
                <div style="padding:12px 14px;border:1px solid var(--border);border-radius:12px;background:var(--surface-soft);">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:6px;">
                    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-width:0;flex:1;">
                      <span style="font-size:12px;font-weight:800;color:var(--text-light);width:22px;">#${idx + 1}</span>
                      <span class="course-code-pill">${esc(c.code)}</span>
                      <strong style="font-size:14.5px;color:var(--navy);">${esc(c.title)}</strong>
                      ${window.EpiUI.priorityBadge(c.priority, !!c.vigilance2026)}
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                      <span class="badge badge-bm">${c.rawCount} bruts · ${c.uniqueQuestions} uniques</span>
                      ${c.recent2024_2025 > 0 ? `<span class="badge badge-high">${c.recent2024_2025} en 2024–25</span>` : ''}
                      <span class="badge badge-neutral">Score ${c.priorityScore}/100</span>
                      <button type="button" class="btn btn-secondary btn-sm" data-action="go-course-revision" data-course="${esc(c.courseId)}">📄 Fiche</button>
                      <button type="button" class="btn btn-primary btn-sm" data-action="go-course" data-course="${esc(c.courseId)}">Ouvrir →</button>
                    </div>
                  </div>
                  <div class="progress-bar" style="height:8px;margin-bottom:6px;">
                    <div class="progress-fill" style="width:${pctW}%;background:${barColor};"></div>
                  </div>
                  <div style="font-size:12.5px;color:var(--text-muted);">${esc(c.note)}</div>
                </div>`;
            }).join('')}
          </div>
        </div>`;
    } else if (tab === 'repetitions') {
      const reps = asArr(data.topRepetitions);
      const concepts = asArr(data.conceptualRepetitions);
      bodyHtml = `
        <div class="card" style="margin-bottom:18px;">
          <h2 class="card-title" style="margin-bottom:6px;">🔁 Top des questions répétées (exactes & quasi-identiques)</h2>
          <p class="card-subtitle" style="margin-bottom:14px;">Questions revenues jusqu’à 12 fois dans les sessions de Batna 2 (2019–2025).</p>
          <div class="data-table-wrap">
            <table class="data-table">
              <thead>
                <tr><th>#</th><th>Cours</th><th>Question / Thème répété</th><th>Type</th><th>Références BM</th><th>Fréq.</th><th>Action</th></tr>
              </thead>
              <tbody>
                ${reps.map(r => `
                  <tr>
                    <td><strong>${r.rank}</strong></td>
                    <td><span class="course-code-pill">${esc(r.courseId)}</span></td>
                    <td><strong>${esc(r.topic)}</strong></td>
                    <td><span class="badge badge-neutral">${esc(r.type)}</span></td>
                    <td style="font-size:12.5px;color:var(--text-muted);">${esc(r.refs)}</td>
                    <td><span class="badge badge-very_high">${r.freq}×</span></td>
                    <td><button type="button" class="btn btn-ghost btn-sm" data-action="go-course-revision" data-course="${esc(r.courseId)}">Fiche →</button></td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <h2 class="card-title" style="margin-bottom:10px;">🧠 Top 10 des répétitions conceptuelles (formulations variées)</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px;">
            ${concepts.map(cp => `
              <div style="padding:12px 14px;border:1px solid var(--border);border-radius:10px;background:var(--surface-soft);display:flex;align-items:center;justify-content:space-between;gap:10px;">
                <div>
                  <div style="font-size:12px;font-weight:700;color:var(--primary);">#${cp.rank} · ${esc(cp.courses)}</div>
                  <div style="font-size:13.5px;font-weight:700;color:var(--navy);margin-top:2px;">${esc(cp.concept)}</div>
                </div>
                <span class="badge badge-bm" style="flex-shrink:0;">${cp.count} occ.</span>
              </div>`).join('')}
          </div>
        </div>`;
    } else if (tab === 'scoring') {
      const ranking = asArr(data.priorityRanking).filter(r => scoreFilter === 'all' || r.level === scoreFilter);
      const meth = asArr(data.methodology);
      bodyHtml = `
        <div class="card" style="margin-bottom:18px;">
          <h3 class="card-title" style="margin-bottom:10px;">Méthodologie transparente du Score de Priorité (0 à 100)</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;">
            ${meth.map(m => `
              <div style="padding:12px;border:1px solid var(--border);border-radius:10px;background:var(--surface-soft);">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:4px;">
                  <strong style="font-size:13px;color:var(--navy);">${esc(m.criterion)}</strong>
                  <span class="badge badge-medium">${m.maxPts} pts</span>
                </div>
                <div style="font-size:11.5px;font-weight:700;color:var(--primary);margin-bottom:4px;">${esc(m.nature)}</div>
                <div style="font-size:12px;color:var(--text-muted);">${esc(m.rule)}</div>
              </div>`).join('')}
          </div>
        </div>

        <div class="card">
          <div class="card-header" style="margin-bottom:12px;">
            <div>
              <h2 class="card-title">Classement des thèmes prioritaires (${ranking.length})</h2>
              <p class="card-subtitle">80–100 = Très Haute · 60–79 = Haute · 35–59 = Moyenne · Vigilance 2026 = 0 occ. historique mais fort enjeu.</p>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${[
                ['all', 'Tous'],
                ['very_high', '🔴 Très Haute (80–100)'],
                ['high', '🟠 Haute (60–79)'],
                ['medium', '🟡 Moyenne'],
                ['vigilance', '⚠️ Vigilance 2026']
              ].map(([k, lbl]) => `
                <button type="button" class="time-pill ${scoreFilter === k ? 'active' : ''}" data-action="analysis-score-filter" data-level="${k}">${lbl}</button>
              `).join('')}
            </div>
          </div>

          <div class="data-table-wrap">
            <table class="data-table">
              <thead><tr><th>Rang</th><th>Cours</th><th>Thème</th><th>Fréq. BM</th><th>Années</th><th>Score</th><th>Action</th></tr></thead>
              <tbody>
                ${ranking.map(r => `
                  <tr>
                    <td><strong>#${r.rank}</strong></td>
                    <td><span class="course-code-pill">${esc(r.courseId)}</span></td>
                    <td><strong>${esc(r.topic)}</strong></td>
                    <td>${r.freq} Q</td>
                    <td style="font-size:12.5px;color:var(--text-muted);">${esc(r.years)}</td>
                    <td><span class="badge ${r.score >= 80 ? 'badge-very_high' : (r.score >= 60 ? 'badge-high' : (r.level === 'vigilance' ? 'badge-vigilance' : 'badge-medium'))}">${r.score}/100</span></td>
                    <td><button type="button" class="btn btn-ghost btn-sm" data-action="go-course-revision" data-course="${esc(r.courseId)}">Réviser →</button></td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>`;
    } else {
      bodyHtml = `
        <div class="card" style="margin-bottom:18px;">
          <h2 class="card-title" style="margin-bottom:6px;color:var(--sem-red);">⚠️ Les ${bmErrors.length} erreurs prouvées du corrigé imprimé BM (corrigées d’après vos cours)</h2>
          <p class="card-subtitle" style="margin-bottom:14px;">Ne mémorisez jamais la clé imprimée sans vérification : chaque correction ci-dessous cite la page ou diapositive exacte du cours officiel.</p>
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${bmErrors.map((e, i) => `
              <div style="padding:12px 14px;border:1px solid var(--red-border);border-left:4px solid var(--red);border-radius:10px;background:var(--surface-soft);">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
                  <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                    <strong>#${i + 1} · ${esc(e.bmRef)}</strong>
                    <span class="course-code-pill">${esc(e.courseId)}</span>
                    <span class="badge badge-red">BM imprimé : ${esc(e.bmAnswer)} ❌</span>
                    <span class="badge badge-green">Cours officiel : ${esc(e.courseAnswer)} ✅</span>
                  </div>
                  <button type="button" class="btn btn-ghost btn-sm" data-action="go-course-revision" data-course="${esc(e.courseId)}">Voir Fiche ${esc(e.courseId)} →</button>
                </div>
                <div style="font-size:13.5px;color:var(--text-main);"><strong>${esc(e.topic)} :</strong> ${esc(e.reason)}</div>
                <div style="font-size:12px;color:var(--text-light);margin-top:4px;">Preuve cours : ${esc(e.courseProof)}</div>
              </div>`).join('')}
          </div>
        </div>

        <div class="card">
          <h2 class="card-title" style="margin-bottom:6px;">Questions hors cours fournis (${audit.outOfCourseVisible || 114} QCM = 23,9 % de la BM)</h2>
          <p class="card-subtitle" style="margin-bottom:12px;">Transparence totale : ces chapitres relèvent principalement de l’Économie de la santé / Médicament générique, absents des 51 supports d’Épidémiologie.</p>
          <div class="data-table-wrap">
            <table class="data-table">
              <thead><tr><th>Chapitre(s) BM</th><th>Nb QCM</th><th>Détail d’audit</th></tr></thead>
              <tbody>
                ${outOfCourse.map(o => `
                  <tr>
                    <td><strong>${esc(o.chapters)}</strong></td>
                    <td><span class="badge badge-neutral">${o.count}</span></td>
                    <td style="font-size:13px;color:var(--text-muted);">${esc(o.note)}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>`;
    }

    return `
      <div class="card" style="margin-bottom:18px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:14px;">
          <div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <span class="badge badge-bm">Master 01 · Audit intégral 25 cours</span>
              <span class="badge badge-green">✓ 6/6 QCM page 184 récupérés via Ch. 41</span>
            </div>
            <h1 class="edu-h1" style="margin:0 0 4px;">Analyse des examens & Fréquences BM (C1–C25)</h1>
            <p style="margin:0;font-size:14px;color:var(--text-muted);">${esc(audit.documentName || 'BM Épidémiologie 2026')} · 51 supports officiels Batna 2.</p>
          </div>
          <button type="button" class="btn btn-primary" data-action="nav" data-route="final_strategy">Voir Stratégie finale & Survie →</button>
        </div>

        <div class="kpi-grid" style="margin:0 0 14px;grid-template-columns:repeat(4,minmax(0,1fr));">
          <div class="j-mini-kpi"><span>QCM BM vérifiés</span><strong>${audit.actualVerifiedCount || 476}</strong></div>
          <div class="j-mini-kpi"><span>Rattachés aux 25 cours</span><strong style="color:var(--green);">${audit.matchedTo25Courses || 362} (76,1 %)</strong></div>
          <div class="j-mini-kpi"><span>Erreurs corrigé BM prouvées</span><strong style="color:var(--red);">${bmErrors.length}</strong></div>
          <div class="j-mini-kpi"><span>Hors cours fournis</span><strong style="color:var(--text-muted);">${audit.outOfCourseVisible || 114} (23,9 %)</strong></div>
        </div>

        <div class="alert alert-info" style="margin:0;">
          ${icon('alert', 18)}
          <div style="font-size:13px;"><strong>Distinction fréquence historique vs prédiction future :</strong> ${esc(data.disclaimer)}</div>
        </div>
      </div>

      <div class="tabs-row">
        <button type="button" class="tab-btn ${tab === 'frequencies' ? 'active' : ''}" data-action="analysis-tab" data-tab="frequencies">📊 Fréquence des 25 cours</button>
        <button type="button" class="tab-btn ${tab === 'repetitions' ? 'active' : ''}" data-action="analysis-tab" data-tab="repetitions">🔁 Questions répétées</button>
        <button type="button" class="tab-btn ${tab === 'scoring' ? 'active' : ''}" data-action="analysis-tab" data-tab="scoring">🎯 Scoring 0–100 (50 thèmes)</button>
        <button type="button" class="tab-btn ${tab === 'errors' ? 'active' : ''}" data-action="analysis-tab" data-tab="errors">⚠️ ${bmErrors.length} Erreurs BM & Hors-cours</button>
      </div>

      ${bodyHtml}
    `;
  }

  // ==================== 3. VUE « STRATÉGIE FINALE » (MASTER 04) ====================
  function renderFinalStrategy(profile, uiState) {
    const strat = window.EpiData.masterFinalStrategy;
    if (!strat) {
      return `<div class="card empty-state">Les données de stratégie finale (Master 04) ne sont pas encore chargées.</div>`;
    }

    const tab = (uiState && uiState.strategyTab) || 'waves';
    const courseMap = {};
    asArr(window.EpiData.courses).forEach(c => { courseMap[c.id] = c; });

    let bodyHtml = '';

    if (tab === 'waves') {
      const waves = asArr(strat.revisionWaves);
      bodyHtml = `
        <div style="display:flex;flex-direction:column;gap:16px;">
          ${waves.map(w => {
            const wCourses = asArr(w.courseIds).map(id => courseMap[id]).filter(Boolean);
            let doneSteps = 0, totSteps = 0;
            wCourses.forEach(c => {
              const cj = window.EpiJourney ? window.EpiJourney.getCourseJourney(profile, c) : null;
              if (cj) { doneSteps += cj.completedSteps; totSteps += cj.totalSteps; }
            });
            const pct = totSteps > 0 ? Math.round((doneSteps / totSteps) * 100) : 0;
            const borderCol = w.color === 'red' ? 'var(--red)' : (w.color === 'orange' ? 'var(--orange)' : (w.color === 'purple' ? '#7c3aed' : 'var(--primary)'));
            return `
              <section class="card" style="border-left:5px solid ${borderCol};">
                <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:10px;">
                  <div>
                    <span class="badge ${w.color === 'red' ? 'badge-very_high' : (w.color === 'orange' ? 'badge-high' : (w.color === 'purple' ? 'badge-ai' : 'badge-medium'))}" style="margin-bottom:6px;">${esc(w.badge)}</span>
                    <h2 class="card-title" style="margin:4px 0 4px;">${esc(w.title)}</h2>
                    <p class="card-subtitle" style="margin:0;">${esc(w.summary)}</p>
                  </div>
                  <div style="min-width:160px;text-align:right;">
                    <div style="font-size:12.5px;color:var(--text-muted);margin-bottom:4px;">Ma progression Vague ${w.wave} : <strong>${pct} %</strong></div>
                    <div class="progress-bar" style="height:8px;"><div class="progress-fill ${pct === 100 ? 'green' : ''}" style="width:${pct}%;"></div></div>
                  </div>
                </div>

                <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;">
                  ${wCourses.map(c => {
                    const cj = window.EpiJourney ? window.EpiJourney.getCourseJourney(profile, c) : null;
                    const cpct = cj ? cj.overallPct : 0;
                    return `
                      <button type="button" class="btn btn-secondary btn-sm" data-action="go-course-revision" data-course="${esc(c.id)}" title="Ouvrir la fiche de révision ${esc(c.code)}">
                        <strong>${esc(c.code)}</strong> · ${esc(c.shortTitle || c.title)} <span class="badge ${cpct >= 80 ? 'badge-green' : 'badge-neutral'}" style="margin-left:4px;padding:1px 6px;">${cpct}%</span>
                      </button>`;
                  }).join('')}
                </div>

                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;">
                  ${asArr(w.blocks).map(bl => `
                    <div style="padding:12px 14px;border:1px solid var(--border);border-radius:10px;background:var(--surface-soft);">
                      <strong style="display:block;font-size:13.5px;color:var(--navy);margin-bottom:8px;">${esc(bl.label)}</strong>
                      <ul class="edu-list" style="margin:0;">
                        ${asArr(bl.items).map(it => `<li style="font-size:13px;">${fmtInline(it)}</li>`).join('')}
                      </ul>
                    </div>`).join('')}
                </div>
              </section>`;
          }).join('')}
        </div>`;
    } else if (tab === 'top20') {
      const top20 = asArr(strat.top20Themes);
      bodyHtml = `
        <div class="card">
          <h2 class="card-title" style="margin-bottom:6px;">🏆 Top 20 des thèmes les plus rentables sur les 25 cours</h2>
          <p class="card-subtitle" style="margin-bottom:14px;">Cliquez sur n’importe quel thème pour ouvrir directement la Fiche de révision 7 sections du cours correspondant.</p>
          <div class="data-table-wrap">
            <table class="data-table">
              <thead><tr><th>Rang</th><th>Cours</th><th>Thème précis à maîtriser absolument</th><th>Preuve BM</th><th>Score</th><th>Action</th></tr></thead>
              <tbody>
                ${top20.map(t => `
                  <tr>
                    <td><strong>#${t.rank}</strong></td>
                    <td><span class="course-code-pill">${esc(t.courseId)}</span></td>
                    <td><strong>${fmtInline(t.theme)}</strong></td>
                    <td style="font-size:12.5px;color:var(--text-muted);">${esc(t.proof)}</td>
                    <td><span class="badge badge-very_high">${t.score}/100</span></td>
                    <td><button type="button" class="btn btn-primary btn-sm" data-action="go-course-revision" data-course="${esc(t.courseId)}">📄 Fiche</button></td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>`;
    } else {
      const sv = strat.survivalSheet || {};
      bodyHtml = `
        <div class="card" style="margin-bottom:16px;">
          <h2 class="edu-h2" style="margin:0 0 12px;">📐 1. Toutes les Formules & Seuils Indispensables (avec Dénominateurs !)</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px;">
            ${asArr(sv.formulas).map(fg => `
              <div style="padding:14px;border:1px solid var(--border);border-radius:12px;background:var(--surface-soft);">
                <strong style="display:block;font-size:14px;color:var(--primary);margin-bottom:8px;">${esc(fg.group)}</strong>
                <ul class="edu-list" style="margin:0;">
                  ${asArr(fg.items).map(it => `<li style="font-size:13px;">${fmtInline(it)}</li>`).join('')}
                </ul>
              </div>`).join('')}
          </div>
        </div>

        <div class="card" style="margin-bottom:16px;">
          <h2 class="edu-h2" style="margin:0 0 12px;">🗓️ 2. Chiffres, Délais & Calendriers Pièges (Mémorisation Express)</h2>
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${asArr(sv.numbersAndSchedules).map(ns => `
              <div style="padding:12px 14px;border:1px solid var(--border);border-left:4px solid var(--primary);border-radius:10px;background:var(--surface-soft);">
                <strong style="font-size:14px;color:var(--navy);">${esc(ns.domain)} :</strong>
                <div style="font-size:13.5px;color:var(--text-main);margin-top:4px;">${fmtInline(ns.detail)}</div>
              </div>`).join('')}
          </div>
        </div>

        <div class="edu-callout edu-box-warning" style="margin-bottom:16px;">
          <div class="edu-callout-head">
            <span class="edu-callout-tag">${icon('alert', 14)}<span>❌ 3. Top 12 Erreurs du Corrigé BM à NE JAMAIS COPIER !</span></span>
          </div>
          <div class="edu-callout-body">
            <ol style="margin:8px 0 0;padding-left:20px;display:flex;flex-direction:column;gap:5px;">
              ${asArr(sv.top12BmErrors).map(err => `<li style="font-size:13.5px;">${fmtInline(err)}</li>`).join('')}
            </ol>
          </div>
        </div>

        ${sv.darijaClosing ? `
          <div class="edu-callout edu-box-darija">
            <div class="edu-callout-head">
              <span class="edu-callout-tag">${icon('sparkle', 14)}<span>🎯 Mot de la fin en Darija algérienne</span></span>
            </div>
            <div class="edu-callout-body">${fmtInline(sv.darijaClosing)}</div>
          </div>` : ''}`;
    }

    return `
      <div class="card" style="margin-bottom:18px;background:linear-gradient(135deg,#0f1e3a,#1b3668);color:#fff;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
          <div>
            <span class="badge" style="background:rgba(255,255,255,0.16);color:#fff;margin-bottom:8px;">Master 04 · Plan 25 Cours & Fiche de Survie</span>
            <h1 style="margin:0 0 6px;font-size:22px;color:#fff;">Stratégie finale de révision & Fiche de survie ultime</h1>
            <p style="margin:0;font-size:14px;color:#cbd5e1;">Plan de révision en 4 vagues connecté à votre progression réelle, Top 20 examens et mémento complet de dernière minute.</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button type="button" class="hero-cta-btn" style="padding:9px 15px;font-size:13.5px;" data-action="strategy-tab" data-tab="survival">⚡ Fiche de Survie</button>
            <button type="button" class="btn btn-secondary btn-sm" data-action="nav" data-route="exam_analysis">📊 Analyse des examens</button>
          </div>
        </div>
      </div>

      <div class="tabs-row">
        <button type="button" class="tab-btn ${tab === 'waves' ? 'active' : ''}" data-action="strategy-tab" data-tab="waves">🌊 Plan en 4 Vagues (Dernière minute)</button>
        <button type="button" class="tab-btn ${tab === 'top20' ? 'active' : ''}" data-action="strategy-tab" data-tab="top20">🏆 Top 20 Thèmes incontournables</button>
        <button type="button" class="tab-btn ${tab === 'survival' ? 'active' : ''}" data-action="strategy-tab" data-tab="survival">⚡ Fiche de Survie Ultime (25 cours)</button>
      </div>

      ${bodyHtml}
    `;
  }

  return {
    renderRevisionSheetBlock,
    renderExamAnalysis,
    renderFinalStrategy
  };
})();
