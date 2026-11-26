/* ==========================================================================
   EpiUI — Composants réutilisables (badges, formatage, modales, toasts)
   ========================================================================== */
window.EpiUI = (function () {
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function priorityBadge(priority, vigilance2026) {
    const map = {
      very_high: ['badge-very_high', 'Très Haute priorité'],
      high: ['badge-high', 'Haute priorité'],
      medium: ['badge-medium', 'Priorité moyenne'],
      low: ['badge-low', 'Faible fréquence BM']
    };
    const [cls, txt] = map[priority] || map.low;
    let html = `<span class="badge ${cls}">${txt}</span>`;
    if (vigilance2026) {
      html += ` <span class="badge badge-vigilance">Vigilance 2026</span>`;
    }
    return html;
  }

  function masteryBadge(mastery) {
    const map = {
      green: ['badge-green', 'Bien maîtrisé'],
      orange: ['badge-orange', 'Partiellement maîtrisé'],
      red: ['badge-red', 'Non maîtrisé'],
      unstarted: ['badge-neutral', 'Non commencé']
    };
    const [cls, txt] = map[mastery.level] || map.unstarted;
    return `<span class="badge ${cls}"><span class="mastery-dot ${mastery.color}"></span>${txt}</span>`;
  }

  function asArr(v) {
    if (Array.isArray(v)) return v;
    if (v === null || v === undefined) return [];
    return [v];
  }

  function statusBadge(status) {
    const map = {
      published: ['badge-green', 'Publié'],
      draft: ['badge-orange', 'Brouillon'],
      archived: ['badge-neutral', 'Archivé']
    };
    const [cls, txt] = map[status] || map.draft;
    return `<span class="badge ${cls}">${txt}</span>`;
  }

  function formatBytes(bytes) {
    const n = Number(bytes) || 0;
    if (n < 1024) return `${n} o`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} Ko`;
    return `${(n / (1024 * 1024)).toFixed(2)} Mo`;
  }

  function qcmSourceBadge(qcm) {
    if (qcm.sourceType === 'bm_original') {
      return `<span class="badge badge-bm">BM Épidémiologie · Original (${esc(qcm.bmRef)}, ${esc(qcm.year)})</span>`;
    }
    if (qcm.sourceType === 'ai_generated_practice') {
      return `<span class="badge badge-ai">✨ QCM d’entraînement généré par IA${qcm.pageRef ? ' · ' + esc(qcm.pageRef) : ''}</span>`;
    }
    if (qcm.sourceType === 'ai_draft') {
      return `<span class="badge badge-ai">✨ QCM généré par IA (Cours)${qcm.pageRef ? ' · ' + esc(qcm.pageRef) : ''}</span>`;
    }
    return `<span class="badge badge-ai">✨ QCM d’entraînement (Cours)${qcm.pageRef ? ' · ' + esc(qcm.pageRef) : ''}</span>`;
  }

  function formatDateFR(isoStr) {
    if (!isoStr) return '—';
    const d = new Date(isoStr);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function formatDueLabel(days) {
    if (days === null || days === undefined) return 'Non planifiée';
    if (days < 0) return `En retard de ${Math.abs(days)} j`;
    if (days === 0) return 'Due aujourd’hui';
    if (days === 1) return 'Demain (J+1)';
    return `Dans ${days} jours (J+${days})`;
  }

  function initials(name) {
    const parts = (name || 'ET').trim().split(/\s+/);
    return (parts[0][0] + (parts[1] ? parts[1][0] : (parts[0][1] || ''))).toUpperCase();
  }

  function toast(message, variant) {
    let stack = document.getElementById('toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.id = 'toast-stack';
      stack.className = 'toast-stack';
      document.body.appendChild(stack);
    }
    const el = document.createElement('div');
    el.className = 'toast ' + (variant || '');
    el.innerHTML = `${window.EpiIcons.get(variant === 'success' ? 'checkCircle' : (variant === 'warning' ? 'alert' : 'sparkle'), 18)}<span>${esc(message)}</span>`;
    stack.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.25s ease';
      setTimeout(() => el.remove(), 260);
    }, 3400);
  }

  function openModal(title, bodyHtml) {
    closeModal();
    const wrap = document.createElement('div');
    wrap.id = 'app-modal';
    wrap.className = 'modal-backdrop';
    wrap.innerHTML = `
      <div class="modal-box" role="dialog" aria-modal="true" aria-label="${esc(title)}">
        <div class="card-header" style="margin-bottom:16px;">
          <h3 class="card-title" style="font-size:18px;">${esc(title)}</h3>
          <button class="icon-btn" data-action="close-modal" aria-label="Fermer">${window.EpiIcons.get('x', 18)}</button>
        </div>
        <div>${bodyHtml}</div>
      </div>`;
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap) closeModal();
    });
    document.body.appendChild(wrap);
  }

  function closeModal() {
    const existing = document.getElementById('app-modal');
    if (existing) existing.remove();
  }

  function renderQcmCard(qcm, state, opts) {
    // state = { selected: [], submitted: false, isCorrect: false }
    const options = opts || {};
    const selected = state.selected || [];
    const submitted = !!state.submitted;
    const prefix = options.prefix || 'qcm';
    const isMulti = qcm.multiSelect;

    const optsHtml = qcm.options.map(opt => {
      const isSel = selected.includes(opt.key);
      const isCorr = qcm.correct.includes(opt.key);
      let cls = 'qcm-opt';
      if (!submitted) {
        if (isSel) cls += ' selected';
      } else {
        if (isCorr && isSel) cls += ' correct';
        else if (isCorr && !isSel) cls += ' missed';
        else if (!isCorr && isSel) cls += ' wrong';
      }
      return `
        <button type="button" class="${cls}" data-action="qcm-toggle" data-prefix="${esc(prefix)}" data-qid="${esc(qcm.id)}" data-key="${esc(opt.key)}" ${submitted ? 'disabled' : ''}>
          <span class="opt-key">${esc(opt.key)}</span>
          <span style="flex:1;">${esc(opt.text)}</span>
        </button>`;
    }).join('');

    let feedbackHtml = '';
    if (submitted) {
      const wrongKeys = Object.keys(qcm.wrongReasons || {});
      const wrongsHtml = wrongKeys.length
        ? `<div style="margin-top:10px;"><strong>Pourquoi les autres choix sont faux :</strong><ul class="wrong-reasons-list">${wrongKeys.map(k => `<li><strong>${esc(k)} :</strong> ${esc(qcm.wrongReasons[k])}</li>`).join('')}</ul></div>`
        : '';

      const bmErrHtml = qcm.bmError
        ? `<div class="alert alert-danger" style="margin-top:12px;margin-bottom:0;">
             ${window.EpiIcons.get('alert', 18)}
             <div><strong>⚠️ Erreur connue du corrigé BM (imprime « ${esc(qcm.bmError.bmKey)} ») :</strong> ${esc(qcm.bmError.note)}</div>
           </div>`
        : '';

      const unansHtml = qcm.bmUnanswered
        ? `<div class="alert alert-info" style="margin-top:12px;margin-bottom:0;">
             ${window.EpiIcons.get('sparkle', 18)}
             <div><strong>Corrigé manquant (/) dans la BM :</strong> résolu à partir du cours officiel de votre professeur.</div>
           </div>`
        : '';

      feedbackHtml = `
        <div class="qcm-feedback ${state.isCorrect ? 'ok' : 'ko'}">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
            <strong style="color:${state.isCorrect ? '#065f46' : '#991b1b'};">
              ${state.isCorrect ? '✅ Bonne réponse !' : '❌ Réponse incorrecte ou incomplète'}
            </strong>
            <span class="badge ${state.isCorrect ? 'badge-green' : 'badge-red'}">Bonne(s) réponse(s) : ${qcm.correct.join(', ')}</span>
          </div>
          <div><strong>Explication (source cours) :</strong> ${esc(qcm.explanation)}</div>
          ${wrongsHtml}
          ${bmErrHtml}
          ${unansHtml}
          <div style="margin-top:10px;font-size:12.5px;color:#64748b;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
            <span><strong>Référence cours :</strong> ${esc(qcm.courseRef)}</span>
            ${options.showLessonLink ? `<button class="btn btn-ghost btn-sm" data-action="go-lesson" data-course="${esc(qcm.courseId)}" data-lesson="${esc(qcm.lessonId)}" data-step="A">Revoir la leçon (${esc(qcm.lessonId)}) →</button>` : ''}
          </div>
        </div>`;
    }

    return `
      <div class="qcm-card" id="${esc(prefix)}_${esc(qcm.id)}">
        <div class="qcm-meta">
          ${qcmSourceBadge(qcm)}
          <span class="badge badge-neutral">${isMulti ? 'Choix multiple(s)' : 'Choix unique'}</span>
          ${qcm.isHard ? '<span class="badge badge-high">Piège / Difficile</span>' : ''}
          ${qcm.bmError ? '<span class="badge badge-red">⚠️ Corrigé BM erroné</span>' : ''}
          <span style="margin-left:auto;font-size:12px;color:#64748b;">${esc(qcm.topic)}</span>
        </div>
        <div class="qcm-stem">${options.number ? `<span style="color:#2563eb;">Q${options.number}.</span> ` : ''}${esc(qcm.stem)}</div>
        ${qcm.table ? `<div class="data-table-wrap">${qcm.table}</div>` : ''}
        <div class="qcm-options">${optsHtml}</div>
        ${!submitted && !options.hideSubmit ? `
          <div style="margin-top:14px;display:flex;align-items:center;gap:10px;">
            <button type="button" class="btn btn-primary btn-sm" data-action="qcm-submit" data-prefix="${esc(prefix)}" data-qid="${esc(qcm.id)}" ${selected.length === 0 ? 'disabled' : ''}>
              Valider ma réponse
            </button>
            <span style="font-size:12.5px;color:#64748b;">${isMulti ? 'Sélectionnez une ou plusieurs options' : 'Sélectionnez une seule option'}</span>
          </div>` : ''}
        ${feedbackHtml}
      </div>`;
  }

  return {
    esc,
    asArr,
    statusBadge,
    formatBytes,
    priorityBadge,
    masteryBadge,
    qcmSourceBadge,
    formatDateFR,
    formatDueLabel,
    initials,
    toast,
    openModal,
    closeModal,
    renderQcmCard
  };
})();
