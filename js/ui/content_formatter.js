/* ==========================================================================
   EpiFormat — Système Global de Typographie & Formatage Médical Sémantique
   Appliqué automatiquement à TOUS les modules, cours (C1–C12, PPT1–PPT7 et
   futurs imports PDF/PPTX), leçons, phases et étapes individuelles.
   RÈGLE D'OR : Préserve 100 % de l'exactitude médicale, des chiffres, des
   formules et de la traçabilité source — sans jamais inventer ni supprimer.
   ========================================================================== */
window.EpiFormat = (function () {
  const esc = (s) => (window.EpiUI ? window.EpiUI.esc(s) : String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'));
  const asArr = (v) => (Array.isArray(v) ? v : (v == null ? [] : [v]));
  const icon = (n, s) => (window.EpiIcons ? window.EpiIcons.get(n, s) : '');

  function stripHtml(str) {
    return String(str || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // Autorise uniquement les balises HTML pédagogiques sûres déjà présentes dans les données MedStudy
  function sanitizeSafeHtml(raw) {
    const str = String(raw == null ? '' : raw);
    if (!/[<>]/.test(str)) return esc(str);
    // Remplacer temporairement les balises pédagogiques autorisées par des jetons sûrs
    const tokens = [];
    const safeTagRe = /<\/?(strong|b|em|i|u|sub|sup|code|br)\s*\/?>|<span(?:\s+class="(?:math-frac|edu-[a-z0-9_-]+)")?>|<\/span>/gi;
    const tokenized = str.replace(safeTagRe, (m) => {
      const idx = tokens.length;
      tokens.push(m);
      return `@@SAFE_TAG_${idx}@@`;
    });
    const escaped = esc(tokenized);
    return escaped.replace(/@@SAFE_TAG_(\d+)@@/g, (_, idx) => tokens[Number(idx)] || '');
  }

  // Enrichissement typographique mesuré UNIQUEMENT sur les nœuds texte (hors balises HTML existantes)
  function enhanceInlineText(htmlStr, opts) {
    const o = opts || {};
    let safe = sanitizeSafeHtml(htmlStr).trim();
    if (!safe) return '';

    // 1. Mettre en valeur un terme directeur en début d'énoncé ("Terme médical : ...") s'il n'est pas déjà en gras
    if (!o.skipLeadTerm && !/^<(strong|b|span)\b/i.test(safe)) {
      const colonIdx = safe.indexOf(':');
      if (colonIdx >= 3 && colonIdx <= 60) {
        const head = safe.slice(0, colonIdx).trim();
        const tail = safe.slice(colonIdx + 1).trim();
        if (tail.length >= 4 && !/[<>]/.test(head) && !/^https?$/i.test(head) && !/^\d+$/.test(head)) {
          safe = `<strong class="edu-term">${head}</strong> : ${tail}`;
        }
      }
    }

    // 2. Traiter uniquement les segments texte hors balises (<...>)
    const parts = safe.split(/(<[^>]+>)/g);
    let numPillCount = 0;
    let inMathFrac = 0;
    let inStrong = 0;

    const enhanced = parts.map(part => {
      if (!part) return '';
      if (part.startsWith('<')) {
        if (/^<span\s+class="math-frac"/i.test(part)) inMathFrac++;
        else if (/^<\/span>/i.test(part) && inMathFrac > 0) inMathFrac--;
        else if (/^<(strong|b)\b/i.test(part)) inStrong++;
        else if (/^<\/(strong|b)>/i.test(part) && inStrong > 0) inStrong--;
        return part;
      }

      if (inMathFrac > 0) return part;

      let txt = part;

      // Contraste " vs " clairement lisible
      txt = txt.replace(/\b(vs\.?)\b/gi, '<span class="edu-vs">vs</span>');

      // Valeurs numériques cliniques, seuils, délais et formules avec unités (plafonné à 4 par bloc pour rester sobre)
      if (!o.skipNumbers && numPillCount < 4) {
        const numRe = /((?:[≥≤><±]\s*)?\d+(?:[.,]\d+)?(?:\s*[–-]\s*\d+(?:[.,]\d+)?)?\s*(?:%|‰|heures?|h\b|jours?|j\b|semaines?|mois|ans?|mg(?:\/dL|\/L)?|g\/L|mmol\/L|mmHg|°C|AP|AM|AS)\b|(?:p|RR|OR|IC)\s*(?:[=<>≤≥]\s*)?\d+(?:[.,]\d+)?\s*%?)/g;
        txt = txt.replace(numRe, (match) => {
          if (numPillCount >= 4) return match;
          numPillCount++;
          return `<span class="edu-num">${match}</span>`;
        });
      }

      // Mots d'alerte déjà mis en majuscules volontaires dans les supports (ex: "EN DEHORS", "NE PAS", "SAUF", "JAMAIS", "FAUX")
      if (!o.skipCriticalCaps && inStrong === 0) {
        txt = txt.replace(/\b(EN DEHORS|NE PAS|NE JAMAIS|UNIQUEMENT|EXCLUSIVEMENT|TRACHOME|INCIDENCE|PRÉVALENCE)\b/g,
          '<span class="edu-critical">$1</span>');
      }

      return txt;
    }).join('');

    return enhanced;
  }

  // ---- DÉTECTION SÉMANTIQUE CONSERVATRICE (PRÉSERVE L'EXACTITUDE MÉDICALE) ----
  const SEMANTIC_META = {
    concept: {
      key: 'concept',
      label: 'Concept clé',
      icon: 'book',
      cls: 'edu-box-concept'
    },
    definition: {
      key: 'definition',
      label: 'Définition',
      icon: 'bookmark',
      cls: 'edu-box-definition'
    },
    memorize: {
      key: 'memorize',
      label: 'À mémoriser',
      icon: 'sparkle',
      cls: 'edu-box-memorize'
    },
    important: {
      key: 'important',
      label: 'Important',
      icon: 'target',
      cls: 'edu-box-important'
    },
    warning: {
      key: 'warning',
      label: 'Attention · Piège examen',
      icon: 'alert',
      cls: 'edu-box-warning'
    },
    example: {
      key: 'example',
      label: 'Exemple concret',
      icon: 'fileText',
      cls: 'edu-box-example'
    },
    distinction: {
      key: 'distinction',
      label: 'À ne pas confondre',
      icon: 'layers',
      cls: 'edu-box-distinction'
    },
    formula: {
      key: 'formula',
      label: 'Formule & Valeur clé',
      icon: 'barChart',
      cls: 'edu-box-formula'
    }
  };

  function classifySemanticBlock(rawHtml, explicitHint) {
    if (explicitHint && SEMANTIC_META[explicitHint]) return explicitHint;
    const plain = stripHtml(rawHtml);
    if (!plain || plain.length < 18) return 'prose';

    // 1. Attention / Piège / Précaution (strictement sur signaux explicites — jamais sur du texte ordinaire)
    if (/(?:^|\b)(attention|pi[eè]ge(?:\s+qcm)?|ne\s+jamais|contre-indication|mise\s+en\s+garde|erreur\s+(?:connue|fr[eé]quente)|[aà]\s+[eé]viter|danger|exception\s*:|h[oô]pital\s+interdit)/i.test(plain)
      || /^⚠️/.test(plain)) {
      // Vérifier s'il s'agit spécifiquement d'un "ne pas confondre"
      if (/ne\s+(?:pas|jamais)\s+confondre/i.test(plain)) return 'distinction';
      return 'warning';
    }

    // 2. À ne pas confondre / Distinction explicite
    if (/(?:ne\s+(?:pas|jamais)\s+confondre|[aà]\s+ne\s+pas\s+confondre|distinction\s+(?:entre|cl[eé])|diff[eé]rence\s+entre|\bvs\.?\b)/i.test(plain)) {
      return 'distinction';
    }

    // 3. Formule ou seuil numérique explicite
    if (/<span\s+class="math-frac"/i.test(String(rawHtml || ''))
      || /(?:=|\bformule\b|\bindice\b|\btaux\s+d[e'’]|\bratio\b|\bodds\s+ratio\b|\brisque\s+relatif\b|\bsensibilit[eé]\s*=|\bsp[eé]cificit[eé]\s*=)/i.test(plain) && /[=÷×\/≥≤><]/.test(plain)) {
      return 'formula';
    }

    // 4. Exemple concret
    if (/^(?:exemple(?:s)?|ex\s*\.|par\s+exemple|cas\s+clinique|illustration)\s*[:\-–]/i.test(plain)) {
      return 'example';
    }

    // 5. Définition explicite
    if (/^(?:d[eé]finition(?:\s+de)?)\s*[:\-–]/i.test(plain)
      || /\b(?:est\s+d[eé]fini(?:e)?\s+(?:comme|par)|se\s+d[eé]finit\s+(?:comme|par)|d[eé]signe\s+(?:un|une|l['’]|le|la)|correspond\s+[aà]\s+(?:un|une|l['’]|toute))\b/i.test(plain)) {
      return 'definition';
    }

    // 6. Important / À noter / Objectif principal
    if (/^(?:important|n\.?b\.?|[aà]\s+noter|[aà]\s+retenir|essentiel|objectif\s+principal|r[eè]gle\s+d['’]or|point\s+cl[eé]|remarque\s+importante)\s*[:\-–]/i.test(plain)) {
      return 'important';
    }

    return 'prose';
  }

  function mapMemorizeCategoryToSemantic(category, title, content) {
    const cat = String(category || '').toLowerCase();
    const joined = `${title || ''} ${stripHtml(content || '')}`.toLowerCase();
    if (/distinction/.test(cat)) return 'distinction';
    if (/pi[eè]ge|exception|attention|erreur/.test(cat)) return 'warning';
    if (/formule|seuil|chiffre|valeur/.test(cat) || /<span\s+class="math-frac"/i.test(String(content || ''))) return 'formula';
    if (/d[eé]finition/.test(cat)) return 'definition';
    if (/liste|[eé]num[eé]ration|classification/.test(cat)) return 'memorize';
    if (/exemple/.test(cat)) return 'example';
    if (/important|r[eè]gle/.test(cat)) return 'important';
    if (/\bvs\.?\b|ne pas confondre/.test(joined)) return 'distinction';
    if (/pi[eè]ge|ne jamais|contre-indication/.test(joined)) return 'warning';
    return 'concept';
  }

  // Découpe les paragraphes trop denses (> 310 caractères) sur les frontières de phrases SANS rien supprimer
  function splitLongParagraph(htmlStr) {
    const plain = stripHtml(htmlStr);
    if (plain.length <= 310) return [htmlStr];
    // Ne pas couper à l'intérieur d'une balise HTML ouverte (si balises complexes, garder intact)
    const sentences = String(htmlStr).split(/(?<=[\.\!\?])\s+(?=[A-ZÉÈÊÀÂÎÔÙÇ«<])/);
    if (sentences.length < 3) return [htmlStr];
    // Vérifier l'équilibre des balises <strong> avant de couper
    const mid = Math.ceil(sentences.length / 2);
    const p1 = sentences.slice(0, mid).join(' ').trim();
    const p2 = sentences.slice(mid).join(' ').trim();
    const balanced = (s) => ((s.match(/<strong\b/gi) || []).length === (s.match(/<\/strong>/gi) || []).length);
    if (p1.length >= 60 && p2.length >= 60 && balanced(p1) && balanced(p2)) {
      return [p1, p2];
    }
    return [htmlStr];
  }

  // Détecte si un paragraphe court dans un support PPT/PDF est en réalité un sous-titre de section
  function isEmbeddedSubheading(rawHtml, nextRaw) {
    const plain = stripHtml(rawHtml);
    if (plain.length < 4 || plain.length > 88) return false;
    if (/[\.\!\?]\s*$/.test(plain) && !/^(?:[IVX]{1,4}\.|[0-9]{1,2}[\.\)])/.test(plain)) return false;
    if (/^(?:[IVX]{1,4}\.|[0-9]{1,2}[\.\)]\s+[A-ZÉÈÊÀÂÎÔÙÇ]|[A-ZÉÈÊÀÂÎÔÙÇ][^\.\!\?:]{3,65}\s*:)$/.test(plain)) return true;
    // Ligne courte sans ponctuation finale suivie d'un paragraphe plus long
    if (nextRaw && plain.length <= 56 && !/[,;:\.\!\?]$/.test(plain) && stripHtml(nextRaw).length > plain.length + 25 && /^[A-ZÉÈÊÀÂÎÔÙÇ]/.test(plain)) {
      return true;
    }
    return false;
  }

  // Rendu d'une carte sémantique dédiée (Définition, Concept clé, Formule, Attention, Exemple, À ne pas confondre, Important, À mémoriser)
  function renderCallout(typeKey, bodyHtml, opts) {
    const o = opts || {};
    const meta = SEMANTIC_META[typeKey] || SEMANTIC_META.concept;
    const label = o.label || meta.label;
    const titleHtml = o.title ? `<div class="edu-callout-title">${esc(o.title)}</div>` : '';
    const refHtml = o.pageRef ? `<span class="edu-ref-pill">${esc(o.pageRef)}</span>` : '';
    const highlightHtml = o.highlight ? `<span class="edu-star-pill">★ Essentiel examen</span>` : '';

    // Traitement enrichi pour "À ne pas confondre" si 2 notions séparées par " | " ou " ; " ou 2 termes en gras distincts
    let innerBody = enhanceInlineText(bodyHtml);
    if (typeKey === 'distinction' && !o.skipSplitDistinction) {
      const splitSides = trySplitDistinction(bodyHtml);
      if (splitSides) {
        innerBody = `
          <div class="edu-distinction-grid">
            <div class="edu-distinction-col">
              <div class="edu-distinction-badge a">${esc(splitSides.leftLabel)}</div>
              <div>${enhanceInlineText(splitSides.leftBody, { skipLeadTerm: true })}</div>
            </div>
            <div class="edu-distinction-sep" aria-hidden="true">VS</div>
            <div class="edu-distinction-col">
              <div class="edu-distinction-badge b">${esc(splitSides.rightLabel)}</div>
              <div>${enhanceInlineText(splitSides.rightBody, { skipLeadTerm: true })}</div>
            </div>
          </div>`;
      }
    }

    return `
      <aside class="edu-callout ${meta.cls}" role="note" aria-label="${esc(label)}">
        <div class="edu-callout-head">
          <span class="edu-callout-tag">${icon(meta.icon, 14)}<span>${esc(label)}</span></span>
          <div class="edu-callout-head-right">${highlightHtml}${refHtml}</div>
        </div>
        ${titleHtml}
        <div class="edu-callout-body">${innerBody}</div>
      </aside>`;
  }

  function trySplitDistinction(rawHtml) {
    const str = String(rawHtml || '').trim();
    // Cas 1 : Deux blocs explicites "<strong>Terme A :</strong> ... <strong>Terme B :</strong> ..." (ignore les mots en gras internes sans ":")
    const strongColonPattern = /^<strong>([^<:]{2,56})\s*:\s*<\/strong>\s*([\s\S]+?)\s+<strong>([^<:]{2,56})\s*:\s*<\/strong>\s*([\s\S]+)$/;
    const m = str.match(strongColonPattern);
    if (m && m[2].trim().length >= 12 && m[4].trim().length >= 12) {
      return { leftLabel: m[1].trim(), leftBody: m[2].trim(), rightLabel: m[3].trim(), rightBody: m[4].trim() };
    }
    // Cas 2 : Deux blocs "<strong>Terme A</strong> : ... <strong>Terme B</strong> : ..."
    const strongOuterColon = /^<strong>([^<:]{2,56})<\/strong>\s*:\s*([\s\S]+?)\s+<strong>([^<:]{2,56})<\/strong>\s*:\s*([\s\S]+)$/;
    const m2 = str.match(strongOuterColon);
    if (m2 && m2[2].trim().length >= 12 && m2[4].trim().length >= 12) {
      return { leftLabel: m2[1].trim(), leftBody: m2[2].trim(), rightLabel: m2[3].trim(), rightBody: m2[4].trim() };
    }
    // Cas 3 : Séparation explicite par " | " entre deux notions
    const pipeParts = str.split(/\s*\|\s*/);
    if (pipeParts.length === 2 && pipeParts[0].includes(':') && pipeParts[1].includes(':')) {
      const [l1, ...lb] = pipeParts[0].split(':');
      const [r1, ...rb] = pipeParts[1].split(':');
      if (stripHtml(l1).length >= 2 && stripHtml(r1).length >= 2 && lb.join(':').trim().length >= 8 && rb.join(':').trim().length >= 8) {
        return { leftLabel: stripHtml(l1), leftBody: lb.join(':').trim(), rightLabel: stripHtml(r1), rightBody: rb.join(':').trim() };
      }
    }
    return null;
  }

  // ---- RENDU COMPLET D'UNE SECTION "À COMPRENDRE" (H2/H3/H4 + CALLOUTS + LISTES + PROSE) ----
  function renderUnderstandSection(section, opts) {
    const o = opts || {};
    const paragraphs = asArr(section && section.paragraphs).filter(p => stripHtml(p).length > 0);
    const bullets = asArr(section && section.bullets).filter(b => stripHtml(b).length > 0);
    const semanticHints = asArr(section && section.semanticHints);
    const blocks = [];

    // 1. Paragraphes structurés : sous-titres H3/H4, callouts sémantiques mesurés ou paragraphes courts
    let calloutsUsed = 0;
    const maxCalloutsPerSection = 3; // Sobriété : ne jamais surligner toute la page

    // Si le titre de la section lui-même est une distinction explicite ("X vs Y") et qu'il y a 2 bullets parallèles
    const headingPlain = stripHtml(section && section.heading);
    const headingIsDistinction = /\bvs\.?\b|distinction|ne\s+pas\s+confondre/i.test(headingPlain);

    paragraphs.forEach((rawP, idx) => {
      const nextP = paragraphs[idx + 1] || null;
      if (isEmbeddedSubheading(rawP, nextP)) {
        const cleanHead = stripHtml(rawP).replace(/:$/, '');
        const tag = /^(?:[IVX]{1,4}\.|[0-9]{1,2}\.)/.test(cleanHead) ? 'h3' : 'h4';
        blocks.push(`<${tag} class="edu-${tag}">${esc(cleanHead)}</${tag}>`);
        return;
      }

      const explicitHint = (semanticHints[idx] && semanticHints[idx].type) || (idx === 0 && section && section.calloutType) || null;
      const semType = classifySemanticBlock(rawP, explicitHint);

      if (semType !== 'prose' && (explicitHint || calloutsUsed < maxCalloutsPerSection)) {
        calloutsUsed++;
        blocks.push(renderCallout(semType, rawP, { pageRef: idx === 0 ? section.pageRef : '' }));
      } else {
        const subParas = splitLongParagraph(rawP);
        subParas.forEach(sp => {
          blocks.push(`<p class="edu-p">${enhanceInlineText(sp)}</p>`);
        });
      }
    });

    // 2. Listes & classifications structurées (numérotées ou à puces, avec détection de distinction 2-colonnes)
    if (bullets.length > 0) {
      if (headingIsDistinction && bullets.length === 2 && stripHtml(bullets[0]).includes(':') && stripHtml(bullets[1]).includes(':')) {
        const [lHead, ...lRest] = String(bullets[0]).split(':');
        const [rHead, ...rRest] = String(bullets[1]).split(':');
        blocks.push(`
          <aside class="edu-callout edu-box-distinction" role="note" aria-label="À ne pas confondre">
            <div class="edu-callout-head">
              <span class="edu-callout-tag">${icon('layers', 14)}<span>À ne pas confondre · Distinction clé</span></span>
              ${section.pageRef ? `<span class="edu-ref-pill">${esc(section.pageRef)}</span>` : ''}
            </div>
            <div class="edu-distinction-grid">
              <div class="edu-distinction-col">
                <div class="edu-distinction-badge a">${esc(stripHtml(lHead))}</div>
                <div>${enhanceInlineText(lRest.join(':').trim(), { skipLeadTerm: true })}</div>
              </div>
              <div class="edu-distinction-sep" aria-hidden="true">VS</div>
              <div class="edu-distinction-col">
                <div class="edu-distinction-badge b">${esc(stripHtml(rHead))}</div>
                <div>${enhanceInlineText(rRest.join(':').trim(), { skipLeadTerm: true })}</div>
              </div>
            </div>
          </aside>`);
      } else {
        const isNumbered = bullets.length >= 2 && bullets.filter(b => /^(?:<strong>)?\s*\d{1,2}[\)\.\-–]/i.test(String(b).trim())).length >= Math.ceil(bullets.length * 0.6);
        const listTag = isNumbered ? 'ol' : 'ul';
        const listCls = isNumbered ? 'edu-ol' : 'edu-ul';

        const itemsHtml = bullets.map((b, bi) => {
          const cleanText = isNumbered ? String(b).replace(/^\s*\d{1,2}[\)\.\-–]\s*/, '') : b;
          const bSem = classifySemanticBlock(cleanText);
          let miniTag = '';
          if (bSem === 'warning') miniTag = `<span class="edu-inline-tag warn">Attention</span> `;
          else if (bSem === 'formula') miniTag = `<span class="edu-inline-tag formula">Formule / Seuil</span> `;
          else if (bSem === 'example') miniTag = `<span class="edu-inline-tag example">Exemple</span> `;
          else if (bSem === 'definition' && bullets.length <= 4) miniTag = `<span class="edu-inline-tag def">Définition</span> `;
          return `<li class="edu-li">${isNumbered ? `<span class="edu-ol-num">${bi + 1}</span>` : ''}<div class="edu-li-body">${miniTag}${enhanceInlineText(cleanText)}</div></li>`;
        }).join('');

        blocks.push(`
          <div class="edu-list-block">
            ${bullets.length >= 3 ? `<h4 class="edu-h4">${isNumbered ? 'Étapes & Ordre à retenir' : 'Points clés & Classification'} (${bullets.length})</h4>` : ''}
            <${listTag} class="${listCls}">${itemsHtml}</${listTag}>
          </div>`);
      }
    }

    if (blocks.length === 0) {
      return `<p class="edu-p" style="color:var(--text-light);">Aucun contenu détaillé dans cette section.</p>`;
    }
    return `<div class="edu-content-flow">${blocks.join('')}</div>`;
  }

  // ---- RENDU TABLEAU MÉDICAL STRUCTURÉ ----
  function renderTableCard(tbl, idx) {
    const headers = asArr(tbl && tbl.headers);
    const rows = asArr(tbl && tbl.rows);
    return `
      <section class="edu-table-card">
        <div class="edu-table-head">
          <span class="edu-callout-tag">${icon('layers', 14)}<span>Tableau & Classification${typeof idx === 'number' ? ` #${idx + 1}` : ''}</span></span>
          <h3 class="edu-h3" style="margin:4px 0 0;">${esc((tbl && tbl.title) || 'Tableau comparatif')}</h3>
        </div>
        <div class="data-table-wrap edu-table-wrap">
          <table class="data-table edu-table">
            <thead><tr>${headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>
            <tbody>
              ${rows.map(r => `<tr>${asArr(r).map((cell, ci) => `<td>${ci === 0 ? `<strong class="edu-term">${enhanceInlineText(cell, { skipLeadTerm: true })}</strong>` : enhanceInlineText(cell, { skipLeadTerm: true })}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </div>
      </section>`;
  }

  // ---- RENDU CARTE "À MÉMORISER" SÉMANTIQUE ----
  function renderMemorizeCardRich(item, isChecked) {
    const semKey = mapMemorizeCategoryToSemantic(item.category, item.title, item.content);
    const meta = SEMANTIC_META[semKey] || SEMANTIC_META.memorize;
    const rawContent = String(item.content || '');
    const splitDist = semKey === 'distinction' ? trySplitDistinction(rawContent) : null;

    // Si la notion est une liste numérotée inline ("1) ... 2) ... 3) ..."), la formater proprement en liste lisible !
    let bodyHtml = '';
    if (splitDist) {
      bodyHtml = `
        <div class="edu-distinction-grid">
          <div class="edu-distinction-col">
            <div class="edu-distinction-badge a">${esc(splitDist.leftLabel)}</div>
            <div>${enhanceInlineText(splitDist.leftBody, { skipLeadTerm: true })}</div>
          </div>
          <div class="edu-distinction-sep" aria-hidden="true">VS</div>
          <div class="edu-distinction-col">
            <div class="edu-distinction-badge b">${esc(splitDist.rightLabel)}</div>
            <div>${enhanceInlineText(splitDist.rightBody, { skipLeadTerm: true })}</div>
          </div>
        </div>`;
    } else if (/(?:^|\s)1\)\s+[\s\S]+?\s2\)\s+/.test(rawContent)) {
      const listItems = rawContent.split(/(?=(?:^|\s)\d+\)\s+)/).map(s => s.replace(/^\s*\d+\)\s*/, '').replace(/,\s*$/, '').trim()).filter(Boolean);
      bodyHtml = `<ol class="edu-ol">${listItems.map((li, i) => `<li class="edu-li"><span class="edu-ol-num">${i + 1}</span><div class="edu-li-body">${enhanceInlineText(li)}</div></li>`).join('')}</ol>`;
    } else {
      bodyHtml = `<div class="edu-mem-rich-text">${enhanceInlineText(rawContent)}</div>`;
    }

    return `
      <div class="edu-callout ${meta.cls} edu-mem-hero ${isChecked ? 'edu-mem-done' : ''}">
        <div class="edu-callout-head">
          <span class="edu-callout-tag">${icon(meta.icon, 14)}<span>${esc(item.category || meta.label)}</span></span>
          <div class="edu-callout-head-right">
            ${item.highlight ? '<span class="edu-star-pill">★ Essentiel examen</span>' : ''}
            ${item.pageRef ? `<span class="edu-ref-pill">${esc(item.pageRef)}</span>` : ''}
          </div>
        </div>
        <h3 class="edu-h3 edu-mem-title">${esc(item.title || '')}</h3>
        <div class="edu-callout-body">${bodyHtml}</div>
      </div>`;
  }

  // ---- RENDU TEXTE COURT FORMATÉ (FLASHCARDS, ACTIVE RECALL, EXPLICATIONS QCM) ----
  function renderRichAnswer(rawText) {
    const str = String(rawText == null ? '' : rawText).trim();
    if (!str) return '';
    // Si réponse multi-lignes à puces ("• ... \n• ...")
    const lines = str.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length >= 2 && lines.every(l => /^[•\-–\*]/.test(l))) {
      return `<ul class="edu-ul">${lines.map(l => `<li class="edu-li"><div class="edu-li-body">${enhanceInlineText(l.replace(/^[•\-–\*]+\s*/, ''))}</div></li>`).join('')}</ul>`;
    }
    if (lines.length >= 2) {
      return lines.map(l => `<p class="edu-p" style="margin-bottom:6px;">${enhanceInlineText(l)}</p>`).join('');
    }
    return enhanceInlineText(str);
  }

  function renderIntroCallout(introText, sourceRef) {
    if (!stripHtml(introText)) return '';
    return `
      <div class="edu-intro-card">
        <div class="edu-callout-head" style="margin-bottom:6px;">
          <span class="edu-callout-tag">${icon('book', 14)}<span>Introduction & Vue d’ensemble</span></span>
          ${sourceRef ? `<span class="edu-ref-pill">${esc(sourceRef)}</span>` : ''}
        </div>
        <p class="edu-p" style="margin:0;">${enhanceInlineText(introText, { skipLeadTerm: true })}</p>
      </div>`;
  }

  return {
    SEMANTIC_META,
    stripHtml,
    sanitizeSafeHtml,
    enhanceInlineText,
    classifySemanticBlock,
    mapMemorizeCategoryToSemantic,
    renderCallout,
    renderUnderstandSection,
    renderTableCard,
    renderMemorizeCardRich,
    renderRichAnswer,
    renderIntroCallout
  };
})();
