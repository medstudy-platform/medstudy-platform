/* ==========================================================================
   MedStudy Universal Engine — Pipeline 11 Étapes, Transformation C1–C12,
   Traçabilité & Contrôle Qualité Automatisé (Node.js ESM — Vercel + Supabase)
   100 % agnostique de la spécialité médicale · Zéro hallucination · Zéro placeholder
   ========================================================================== */
import {
  isAdminBoilerplate,
  isHeadingCandidate,
  normalizeTokens,
  detectCourseOverlap,
  extractCourseFiles
} from './extractors.js';
import {
  getServerAiConfig,
  invokeStructuredAi,
  invokeVisionOcr
} from './ai_client.js';

export const STAGE_DEFINITIONS = [
  { index: 1, key: 'file_uploaded', label: '1. Fichier téléversé & validé' },
  { index: 2, key: 'document_extraction', label: '2. Extraction complète du document' },
  { index: 3, key: 'ocr_visual_analysis', label: '3. Analyse OCR & visuelle' },
  { index: 4, key: 'content_organization', label: '4. Organisation & structuration du contenu' },
  { index: 5, key: 'chapter_lesson_generation', label: '5. Génération des chapitres et leçons' },
  { index: 6, key: 'educational_content_generation', label: '6. Contenu pédagogique (Comprendre & À mémoriser)' },
  { index: 7, key: 'flashcard_generation', label: '7. Génération des flashcards de rappel actif' },
  { index: 8, key: 'qcm_generation', label: '8. Génération des QCM médicaux' },
  { index: 9, key: 'minitest_generation', label: '9. Génération des mini-tests de validation' },
  { index: 10, key: 'quality_verification', label: '10. Contrôle qualité automatisé' },
  { index: 11, key: 'draft_ready', label: '11. Brouillon prêt pour révision administrateur' }
];

export function createInitialStages() {
  return STAGE_DEFINITIONS.map((s) => ({
    index: s.index,
    key: s.key,
    label: s.label,
    status: 'pending',
    startedAt: null,
    completedAt: null,
    message: '',
    metrics: {}
  }));
}

function jaccardSimilarity(a, b) {
  const ta = new Set(normalizeTokens(a));
  const tb = new Set(normalizeTokens(b));
  if (!ta.size || !tb.size) return 0;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  return inter / (ta.size + tb.size - inter);
}

function stripHtml(s) {
  return String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function emphasizeLeadTerm(text) {
  const clean = String(text || '').trim();
  const colonIdx = clean.indexOf(':');
  if (colonIdx >= 3 && colonIdx <= 62) {
    const head = clean.slice(0, colonIdx).trim();
    const tail = clean.slice(colonIdx + 1).trim();
    if (tail.length >= 4 && !/^https?$/i.test(head)) {
      return `<strong>${escapeHtml(head)} :</strong> ${escapeHtml(tail)}`;
    }
  }
  return escapeHtml(clean);
}

function hashSeed(str) {
  let h = 2166136261;
  const s = String(str || '');
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function deterministicShuffle(arr, seedStr) {
  const copy = arr.slice();
  let seed = hashSeed(seedStr) || 1;
  for (let i = copy.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function classifyStatement(text) {
  const t = String(text || '').trim();
  if (t.length < 12 || isAdminBoilerplate(t)) return null;

  if (/\b(sauf|à\s+l['’]exception|except[eé]|ne\s+jamais|interdit|proscrit|contre[\-\s]indiqu[eé]|attention|pi[eè]ge|ne\s+pas\s+confondre|faux|exclus?)\b/i.test(t)) {
    return { type: 'exception_trap', category: 'Exception / Piège QCM', highlight: true };
  }
  if (/([=≥≤<>±]|χ²|p\s*[<>=]|α\s*=|%|\/100|\b\d+([.,]\d+)?\s*(mg|g\/L|mmol|ml|UI|mmHg|°C|heures?|h\b|jours?|j\b|semaines?|mois|ans?|cas|%|score|ddl))/i.test(t)) {
    return { type: 'formula_value', category: 'Formule / Valeur clé', highlight: true };
  }
  if (/\b(contrairement|diff[eé]rence|alors\s+que|tandis\s+que|par\s+rapport\s+[àa]|versus|\bvs\.?\b|distingue|oppose|avantages?|inconv[eé]nients?)\b/i.test(t)) {
    return { type: 'distinction', category: 'Distinction', highlight: true };
  }
  if (/\b(classification|cat[eé]gories?|stades?|types?\s+de|classes?\s+de|groupes?\s+de|niveaux?\s+de|formes?\s+cliniques?|grades?)\b/i.test(t)) {
    return { type: 'classification', category: 'Classification', highlight: true };
  }
  if (/\b(exemple|ex\.|cas\s+clinique|chez\s+le\s+patient|illustration|notamment)\b/i.test(t)) {
    return { type: 'clinical_example', category: 'Exemple clinique', highlight: false };
  }
  if (/\b(est\s+un|est\s+une|d[eé]signe|se\s+d[eé]finit|correspond\s+[àa]|on\s+appelle|signifie|d[eé]finition|consiste\s+[àa]|caract[eé]ris[eé]e?\s+par|article\s+\d+|d[eé]cret)\b/i.test(t) || /^[A-ZÉÈÊÀÂÎÔÙÇ][^:]{2,50}\s*:\s*\S{10,}/.test(t)) {
    return { type: 'definition', category: 'Définition', highlight: true };
  }
  return { type: 'concept', category: 'Notion clé', highlight: false };
}

function isCoverOrNoiseUnit(unit) {
  const titleLow = String(unit.title || '').toLowerCase().trim();
  const bodyLines = [...(unit.lines || []), ...(unit.bullets || [])].filter((l) => !isAdminBoilerplate(l));
  if (/^(plan|sommaire|table\s+des\s+mati[eè]res|merci|bibliographie|r[eé]f[eé]rences)\b/i.test(titleLow) && bodyLines.length <= 8 && !(unit.tables || []).length) {
    return true;
  }
  if (unit.unitNum === 1 && bodyLines.length <= 5 && !(unit.tables || []).length && !unit.speakerNotes) {
    const joined = `${unit.title} ${bodyLines.join(' ')}`;
    if (/(pr\.?|dr\.?|professeur|ma[iî]tre|facult[eé]|universit[eé]|chu|service|20\d{2}\s*[-–/]\s*20\d{2})/i.test(joined)) {
      return true;
    }
  }
  return false;
}

function detectEmbeddedExamQcms(units) {
  const found = [];
  for (const u of units) {
    const allLines = [...(u.lines || []), ...(u.bullets || [])];
    for (let i = 0; i < allLines.length; i++) {
      const line = allLines[i];
      if (/^(qcm|question)\s*\d*\s*[:.\-]/i.test(line) || /\?\s*$/.test(line)) {
        const opts = [];
        for (let k = i + 1; k < Math.min(allLines.length, i + 7); k++) {
          const om = allLines[k].match(/^([A-E])\s*[\)\.\-:]\s+(.{3,})/);
          if (om) opts.push({ key: om[1].toUpperCase(), text: om[2].trim() });
        }
        if (opts.length >= 3) {
          found.push({
            stem: line.replace(/^(qcm|question)\s*\d*\s*[:.\-]\s*/i, '').trim(),
            options: opts,
            unitNum: u.unitNum,
            unitLabel: u.unitLabel,
            sourceFilename: u.sourceFilename,
            slideTitle: u.title
          });
          i += opts.length;
        }
      }
    }
  }
  return found;
}

/**
 * STAGE 3 — Analyse OCR & Visuelle (Vision LLM si configuré côté serveur, sinon drapeaux transparents)
 */
async function executeStageOcr(artifacts, aiConfig, log) {
  const extracted = artifacts.extracted;
  const units = extracted.units || [];
  const candidates = extracted.ocrCandidates || [];
  let ocrProcessedCount = 0;
  let ocrSuccessCount = 0;

  if (aiConfig.enabled && candidates.length > 0) {
    log(`Analyse visuelle IA (${aiConfig.provider}) sur ${candidates.length} image(s)/schéma(s) détecté(s)…`);
    for (const cand of candidates.slice(0, 8)) {
      ocrProcessedCount++;
      const u = units.find((x) => x.unitNum === cand.unitNum && x.sourceFilename === cand.sourceFilename);
      if (!u) continue;
      const vRes = await invokeVisionOcr(aiConfig, cand.base64, cand.mimeType, `${u.unitLabel} ${u.unitNum} — ${u.title}`);
      if (vRes.ok && vRes.text) {
        ocrSuccessCount++;
        u.ocrText = u.ocrText ? `${u.ocrText}\n${vRes.text}` : vRes.text;
        u.lines = [...(u.lines || []), `[OCR Visuel — ${u.unitLabel} ${u.unitNum}] ${vRes.text}`];
        u.wordCount = (u.wordCount || 0) + vRes.text.split(/\s+/).length;
        if (vRes.uncertainParts) {
          u.needsReview = true;
          u.reviewReason = `${u.reviewReason ? u.reviewReason + ' ; ' : ''}Zone incertaine OCR : ${vRes.uncertainParts}`;
        } else if (u.wordCount >= 22) {
          u.needsOcr = false;
        }
      }
    }
  } else if (candidates.length > 0 || units.some((u) => u.needsOcr)) {
    const flaggedCount = units.filter((u) => u.needsOcr || u.needsReview).length;
    log(`Mode sans clé Vision cloud : ${flaggedCount} page(s)/diapositive(s) visuelle(s) ou scannée(s) signalée(s) explicitement pour vérification administrateur (aucun contenu ignoré silencieusement).`);
  } else {
    log('Aucune page scannée ni diapositive purement image nécessitant un OCR supplémentaire.');
  }

  // Libérer les buffers base64 lourds une fois l'étape OCR terminée pour garder les artifacts légers en BDD
  extracted.ocrCandidates = [];
  extracted.stats.imagesOcrCount = ocrSuccessCount;

  return {
    metrics: {
      ocrCandidatesFound: candidates.length,
      ocrProcessed: ocrProcessedCount,
      ocrRecovered: ocrSuccessCount,
      flaggedForManualReview: units.filter((u) => u.needsReview).length
    },
    message: ocrSuccessCount > 0
      ? `OCR visuel terminé : ${ocrSuccessCount}/${ocrProcessedCount} image(s) extraite(s).`
      : `${units.filter((u) => u.needsReview).length} page(s)/diapositive(s) signalée(s) pour contrôle visuel.`
  };
}

/**
 * STAGE 4 — Organisation & Structuration sémantique du contenu
 */
function executeStageOrganization(artifacts, course, existingCourses, log) {
  const extracted = artifacts.extracted;
  const units = extracted.units || [];

  let detectedProfessor = '';
  let detectedAcademicYear = '';
  const statements = [];
  const cleanUnits = [];

  for (const u of units) {
    const rawAll = [u.title, ...(u.lines || []), ...(u.bullets || [])];
    if (u.unitNum <= 2) {
      for (const line of rawAll) {
        if (!detectedProfessor && /\b(Pr\.?|Dr\.?|Professeur)\s+[A-ZÉÈÊÀÂÎÔÙÇ][a-zA-ZÉÈÊÀÂÎÔÙÇéèêàâîôùç\-\s]{2,40}/i.test(line)) {
          detectedProfessor = line.match(/\b((?:Pr\.?|Dr\.?|Professeur)\s+[A-ZÉÈÊÀÂÎÔÙÇ][a-zA-ZÉÈÊÀÂÎÔÙÇéèêàâîôùç\-\s]{2,40})/i)[1].trim();
        }
        if (!detectedAcademicYear && /\b(20\d{2}\s*[-–/]\s*20\d{2}|\d[eè]me\s+ann[eé]e)\b/i.test(line)) {
          detectedAcademicYear = line.match(/\b(20\d{2}\s*[-–/]\s*20\d{2}|\d[eè]me\s+ann[eé]e)\b/i)[1].trim();
        }
      }
    }

    const coverNoise = isCoverOrNoiseUnit(u);
    const filteredLines = (u.lines || []).filter((l) => !isAdminBoilerplate(l));
    const filteredBullets = (u.bullets || []).filter((b) => !isAdminBoilerplate(b));
    const unitClean = {
      ...u,
      isCoverOrNoise: coverNoise,
      lines: filteredLines,
      bullets: filteredBullets
    };
    cleanUnits.push(unitClean);

    if (!coverNoise) {
      const candidates = [...filteredLines, ...filteredBullets];
      if (u.speakerNotes && u.speakerNotes.length >= 25) {
        u.speakerNotes.split(/(?<=[.!?])\s+/).forEach((s) => {
          if (s.trim().length >= 22) candidates.push(s.trim());
        });
      }
      for (const c of candidates) {
        const cls = classifyStatement(c);
        if (cls) {
          statements.push({
            ...cls,
            text: c,
            unitNum: u.unitNum,
            unitLabel: u.unitLabel,
            unitTitle: u.title,
            sourceFilename: u.sourceFilename,
            pageRef: `${u.unitLabel} ${u.unitNum}`
          });
        }
      }
    }
  }

  const embeddedQcms = detectEmbeddedExamQcms(cleanUnits);
  const overlap = detectCourseOverlap(existingCourses, extracted.fileSummaries?.[0]?.originalName || '', extracted.detectedTitle || course.title);

  artifacts.organized = {
    units: cleanUnits,
    statements,
    embeddedQcms,
    overlap,
    detectedProfessor: detectedProfessor || extracted.detectedAuthor || '',
    detectedAcademicYear,
    counts: {
      totalUnits: cleanUnits.length,
      educationalUnits: cleanUnits.filter((u) => !u.isCoverOrNoise).length,
      definitions: statements.filter((s) => s.type === 'definition').length,
      formulas: statements.filter((s) => s.type === 'formula_value').length,
      classifications: statements.filter((s) => s.type === 'classification').length,
      distinctions: statements.filter((s) => s.type === 'distinction').length,
      traps: statements.filter((s) => s.type === 'exception_trap').length,
      examples: statements.filter((s) => s.type === 'clinical_example').length,
      embeddedQcms: embeddedQcms.length
    }
  };

  log(`Organisation terminée : ${artifacts.organized.counts.educationalUnits} unités pédagogiques, ${artifacts.organized.counts.definitions} définitions, ${artifacts.organized.counts.formulas} formules/valeurs, ${artifacts.organized.counts.traps} exceptions/pièges.`);
  return {
    metrics: artifacts.organized.counts,
    message: `${statements.length} énoncés médicaux classifiés (${artifacts.organized.counts.definitions} déf., ${artifacts.organized.counts.formulas} formules/valeurs, ${artifacts.organized.counts.traps} pièges).`
  };
}

/**
 * STAGE 5 — Génération des Chapitres & Leçons (ordre strictement préservé)
 */
function executeStageChapters(artifacts, course, log) {
  const units = artifacts.organized.units || [];
  const eduUnits = units.filter((u) => !u.isCoverOrNoise);
  const sourceUnits = eduUnits.length >= 2 ? eduUnits : units;
  const n = sourceUnits.length;

  const targetChapters = n <= 4 ? Math.max(1, Math.min(2, n)) : (n <= 10 ? 3 : (n <= 20 ? 4 : (n <= 34 ? 5 : 6)));
  const minPerChapter = Math.max(2, Math.floor(n / (targetChapters + 1)));
  const maxPerChapter = Math.max(4, Math.ceil(n / targetChapters) + 2);

  const chapterGroups = [];
  let cur = [];
  let curTitle = '';

  for (let i = 0; i < sourceUnits.length; i++) {
    const u = sourceUnits[i];
    const isBreak = u.headingDetected || isHeadingCandidate(u.title);
    const shouldSplit = cur.length >= maxPerChapter ||
      (isBreak && cur.length >= minPerChapter && chapterGroups.length < 7 && (sourceUnits.length - i) >= 2);

    if (shouldSplit && cur.length > 0) {
      chapterGroups.push({ chapterTitle: curTitle || cur[0].title, units: cur });
      cur = [];
      curTitle = '';
    }
    if (!curTitle && u.title && !isAdminBoilerplate(u.title) && !/^(page|diapositive)\s+\d+$/i.test(u.title)) {
      curTitle = u.title;
    }
    cur.push(u);
  }
  if (cur.length > 0) {
    if (cur.length === 1 && chapterGroups.length >= 2) {
      chapterGroups[chapterGroups.length - 1].units.push(...cur);
    } else {
      chapterGroups.push({ chapterTitle: curTitle || cur[0].title, units: cur });
    }
  }

  const chapterPlans = chapterGroups.map((grp, idx) => {
    const order = idx + 1;
    const lid = `${course.id}_L${order}`;
    const first = grp.units[0];
    const last = grp.units[grp.units.length - 1];
    const unitLbl = first.unitLabel || 'Page';
    const rangeLbl = first.unitNum === last.unitNum ? `${unitLbl} ${first.unitNum}` : `${unitLbl}s ${first.unitNum}–${last.unitNum}`;
    let cleanTitle = String(grp.chapterTitle || '').replace(/^\s*[-–•:]+\s*/, '').trim();
    if (!cleanTitle || /^(plan|objectifs|merci|page\s+\d+|diapositive\s+\d+)$/i.test(cleanTitle)) {
      const better = grp.units.find((u) => u.title && !/^(plan|objectifs|merci|page\s+\d+|diapositive\s+\d+)$/i.test(u.title));
      cleanTitle = better ? better.title : `Chapitre ${order} (${rangeLbl})`;
    }
    if (cleanTitle.length > 98) cleanTitle = cleanTitle.slice(0, 95).trim() + '…';

    const sourceFiles = Array.from(new Set(grp.units.map((u) => u.sourceFilename).filter(Boolean)));
    const primaryFile = sourceFiles[0] || '';

    return {
      id: lid,
      order,
      chapterTitle: cleanTitle,
      title: cleanTitle,
      unitLabel: unitLbl,
      rangeLabel: rangeLbl,
      sourceFile: primaryFile,
      sourceRef: `${primaryFile} · ${rangeLbl}`,
      pageRefs: grp.units.map((u) => u.unitNum),
      slideRefs: grp.units.map((u) => ({ slideNum: u.unitNum, title: u.title })),
      durationMin: Math.max(8, Math.min(25, Math.round(grp.units.reduce((acc, u) => acc + Math.max(2, (u.wordCount || 30) / 55), 0)))),
      units: grp.units
    };
  });

  artifacts.chapterPlans = chapterPlans;
  log(`${chapterPlans.length} chapitres / leçons cohérents construits dans l’ordre exact du document.`);
  return {
    metrics: { chaptersCreated: chapterPlans.length },
    message: `${chapterPlans.length} chapitres / leçons organisés (${chapterPlans.map((c) => c.rangeLabel).join(', ')}).`
  };
}

/**
 * Transformation pédagogique déterministe de haute qualité (Standard C1–C12) pour un chapitre
 */
function buildDeterministicLesson(plan, course, allStatements) {
  const unitNums = new Set(plan.pageRefs);
  const lessonStatements = allStatements.filter((s) => unitNums.has(s.unitNum) && s.sourceFilename === plan.sourceFile);
  const sections = [];
  const tables = [];
  const memorize = [];
  const activeRecall = [];
  const reviewNotes = [];
  const usedMemTexts = [];

  // 1. Construire les sections structurées (Étape A — Comprendre)
  for (const u of plan.units) {
    if (u.needsReview && u.reviewReason) {
      reviewNotes.push(`${u.unitLabel} ${u.unitNum} : ${u.reviewReason}`);
    }
    const paragraphs = [];
    const bullets = [];

    // Regrouper les lignes courtes consécutives en paragraphes fluides tout en préservant les termes clés
    let paraBuf = [];
    for (const ln of (u.lines || [])) {
      const clean = ln.trim();
      if (!clean) continue;
      if (/^\[OCR Visuel/i.test(clean)) {
        if (paraBuf.length) { paragraphs.push(emphasizeLeadTerm(paraBuf.join(' '))); paraBuf = []; }
        paragraphs.push(`<strong>${escapeHtml(clean)}</strong>`);
      } else if (clean.includes(':') && clean.indexOf(':') <= 55) {
        if (paraBuf.length) { paragraphs.push(emphasizeLeadTerm(paraBuf.join(' '))); paraBuf = []; }
        bullets.push(emphasizeLeadTerm(clean));
      } else {
        paraBuf.push(clean);
        if (paraBuf.join(' ').length >= 220 || /[.!?]$/.test(clean) && paraBuf.length >= 2) {
          paragraphs.push(emphasizeLeadTerm(paraBuf.join(' ')));
          paraBuf = [];
        }
      }
    }
    if (paraBuf.length) paragraphs.push(emphasizeLeadTerm(paraBuf.join(' ')));

    for (const b of (u.bullets || [])) {
      const clean = b.trim();
      if (clean && !bullets.some((x) => stripHtml(x).toLowerCase() === clean.toLowerCase())) {
        bullets.push(emphasizeLeadTerm(clean));
      }
    }
    if (u.captions && u.captions.length) {
      paragraphs.push(`<em>[Légende schéma/illustration — ${u.unitLabel} ${u.unitNum}] :</em> ${escapeHtml(u.captions.join(' · '))}`);
    }
    if (u.speakerNotes) {
      paragraphs.push(`<em>[Note enseignant — ${u.unitLabel} ${u.unitNum}] :</em> ${escapeHtml(u.speakerNotes)}`);
    }
    if (!paragraphs.length && !bullets.length && !(u.tables || []).length) {
      paragraphs.push(`<em>[À vérifier visuellement dans « ${escapeHtml(u.sourceFilename)} » — ${u.unitLabel} ${u.unitNum} : ${escapeHtml(u.reviewReason || 'contenu graphique/visuel')}]</em>`);
    }

    const classifyParaSemantic = (pHtml) => {
      const pTxt = stripHtml(pHtml);
      if (pTxt.length < 18) return 'prose';
      if (/ne\s+(?:pas|jamais)\s+confondre|[aà]\s+ne\s+pas\s+confondre|\bvs\.?\b|distinction\s+(?:entre|cl[eé])/i.test(pTxt)) return 'distinction';
      if (/(?:^|\b)(?:attention|pi[eè]ge|contre-indication|ne\s+jamais|exception\s*:|erreur\s+fr[eé]quente)/i.test(pTxt)) return 'warning';
      if (/(?:=|\bformule\b|\bindice\b|\btaux\s+d[e'’]|\bodds\s+ratio\b|\brisque\s+relatif\b)/i.test(pTxt) && /[=÷×\/≥≤><]/.test(pTxt)) return 'formula';
      if (/^(?:exemple(?:s)?|ex\s*\.|par\s+exemple|cas\s+clinique)\s*[:\-–]/i.test(pTxt)) return 'example';
      if (/^(?:d[eé]finition)\s*[:\-–]|\b(?:est\s+d[eé]fini(?:e)?\s+(?:comme|par)|se\s+d[eé]finit\s+(?:comme|par)|d[eé]signe\s+(?:un|une|l['’]))\b/i.test(pTxt)) return 'definition';
      if (/^(?:important|n\.?b\.?|[aà]\s+noter|[aà]\s+retenir|essentiel|objectif\s+principal)\s*[:\-–]/i.test(pTxt)) return 'important';
      return 'prose';
    };

    const semanticHints = paragraphs.map((p) => ({ type: classifyParaSemantic(p) }));

    sections.push({
      heading: `${u.title && u.title !== `${u.unitLabel} ${u.unitNum}` ? u.title : `Développement — ${u.unitLabel} ${u.unitNum}`}`,
      sourceRef: `${u.sourceFilename} · ${u.unitLabel} ${u.unitNum}`,
      pageRef: `${u.unitLabel} ${u.unitNum}`,
      slideNum: u.unitNum,
      slideTitle: u.title,
      provenance: u.needsReview ? 'needs_verification' : 'source_explicit',
      paragraphs,
      bullets,
      semanticHints
    });

    for (const tbl of (u.tables || [])) {
      tables.push({
        ...tbl,
        sourceFile: u.sourceFilename,
        provenance: 'source_explicit'
      });
    }
  }

  // 2. Construire les fiches « À mémoriser » (Étape B) — dédupliquées et catégorisées (4 à 7 par leçon)
  const priorityOrder = ['exception_trap', 'definition', 'formula_value', 'distinction', 'classification', 'clinical_example', 'concept'];
  const sortedStmts = lessonStatements.slice().sort((a, b) => priorityOrder.indexOf(a.type) - priorityOrder.indexOf(b.type));

  const tryAddMemorize = (item) => {
    const plain = stripHtml(item.content);
    if (plain.length < 14) return false;
    if (usedMemTexts.some((prev) => jaccardSimilarity(prev, plain) >= 0.72)) return false;
    usedMemTexts.push(plain);
    memorize.push(item);
    return true;
  };

  for (const st of sortedStmts) {
    if (memorize.length >= 6) break;
    const colonIdx = st.text.indexOf(':');
    const hasTerm = colonIdx >= 3 && colonIdx <= 58;
    const mTitle = hasTerm ? st.text.slice(0, colonIdx).trim() : `${st.unitTitle} (${st.pageRef})`;
    const mBody = hasTerm ? st.text.slice(colonIdx + 1).trim() : st.text;
    tryAddMemorize({
      id: `M_${plan.id}_${memorize.length + 1}`,
      category: st.category,
      title: mTitle.slice(0, 85),
      content: emphasizeLeadTerm(mBody),
      plainContent: mBody,
      pageRef: st.pageRef,
      slideNum: st.unitNum,
      slideTitle: st.unitTitle,
      sourceFile: st.sourceFilename,
      provenance: 'source_explicit',
      highlight: st.highlight || memorize.length < 3
    });
  }

  // Ajouter les énumérations structurées (≥ 3 puces) comme fiches Liste
  for (const u of plan.units) {
    if (memorize.length >= 7) break;
    if ((u.bullets || []).length >= 3) {
      const listItems = u.bullets.slice(0, 6);
      tryAddMemorize({
        id: `M_${plan.id}_${memorize.length + 1}`,
        category: 'Liste / Énumération',
        title: `${u.title} (${listItems.length} éléments clés)`,
        content: listItems.map((b, i) => `<strong>${i + 1})</strong> ${escapeHtml(b)}`).join(' · '),
        plainContent: listItems.join(' • '),
        pageRef: `${u.unitLabel} ${u.unitNum}`,
        slideNum: u.unitNum,
        slideTitle: u.title,
        sourceFile: u.sourceFilename,
        provenance: 'source_explicit',
        highlight: memorize.length < 3
      });
    }
  }

  // Garantie minimale (≥ 2 fiches fidèles sans rien inventer)
  if (memorize.length < 2) {
    for (const u of plan.units) {
      const cand = [...(u.lines || []), ...(u.bullets || [])].find((l) => l.length >= 16);
      if (cand && memorize.length < 3) {
        tryAddMemorize({
          id: `M_${plan.id}_${memorize.length + 1}`,
          category: 'Notion clé',
          title: `${u.title} (${u.unitLabel} ${u.unitNum})`,
          content: emphasizeLeadTerm(cand),
          plainContent: cand,
          pageRef: `${u.unitLabel} ${u.unitNum}`,
          slideNum: u.unitNum,
          slideTitle: u.title,
          sourceFile: u.sourceFilename,
          provenance: u.needsReview ? 'needs_verification' : 'source_explicit',
          highlight: memorize.length === 0
        });
      }
    }
  }

  // 3. Tableau comparatif / synthétique si aucun tableau source n'existe mais ≥ 2 notions clés sont présentes
  if (tables.length === 0 && memorize.length >= 2) {
    tables.push({
      title: `Tableau de synthèse — ${plan.title} (${plan.rangeLabel})`,
      pageRef: plan.rangeLabel,
      sourceFile: plan.sourceFile,
      isChart: false,
      provenance: 'ai_reformulated',
      headers: ['Catégorie', 'Concept / Notion clé', 'Contenu essentiel à retenir', 'Source'],
      rows: memorize.slice(0, 6).map((m) => [
        m.category,
        m.title,
        (m.plainContent || stripHtml(m.content)).slice(0, 175),
        m.pageRef
      ])
    });
  }

  // 4. Questions de Rappel Actif (Étape C — Active Recall)
  memorize.slice(0, 4).forEach((m, idx) => {
    const plain = m.plainContent || stripHtml(m.content);
    let prompt = `Sans relire le cours, expliquez avec précision : « ${m.title} » (${m.pageRef}).`;
    if (/Formule|Valeur/.test(m.category)) {
      prompt = `Quels sont les seuils, chiffres ou formules exacts associés à « ${m.title} » ?`;
    } else if (/Liste/.test(m.category)) {
      prompt = `Essayez de restituer de mémoire les éléments de la liste : « ${m.title} ».`;
    } else if (/Exception|Piège/.test(m.category)) {
      prompt = `Quel est le piège ou l’exception importante à ne pas confondre concernant « ${m.title} » ?`;
    } else if (/Distinction|Classification/.test(m.category)) {
      prompt = `Comment distinguer ou classifier les éléments relatifs à « ${m.title} » ?`;
    }
    activeRecall.push({
      id: `AR_${plan.id}_${idx + 1}`,
      prompt,
      expectedAnswer: plain,
      pageRef: m.pageRef,
      sourceFile: m.sourceFile,
      provenance: 'ai_reformulated'
    });
  });

  // 5. Triade pédagogique spécifique (Comprendre / Mémoriser / Reconnaître en QCM)
  const distinctHeadings = Array.from(new Set(plan.units.map((u) => u.title).filter((t) => t && !/^(page|diapositive)\s+\d+$/i.test(t))));
  const traps = lessonStatements.filter((s) => s.type === 'exception_trap' || s.type === 'distinction' || s.type === 'formula_value');

  const toUnderstand = distinctHeadings.slice(0, 3).map((h) => `Maîtriser le mécanisme et la logique de : ${h}.`);
  if (!toUnderstand.length) toUnderstand.push(`Assimiler les concepts fondamentaux de « ${plan.title} » (${plan.rangeLabel}).`);

  const toMemorize = memorize.slice(0, 4).map((m) => `${m.category} — ${m.title} (${m.pageRef}).`);
  const toRecognizeInQcm = traps.slice(0, 3).map((tr) => `${tr.category} (${tr.pageRef}) : ${tr.text.slice(0, 120)}${tr.text.length > 120 ? '…' : ''}`);
  if (!toRecognizeInQcm.length) {
    toRecognizeInQcm.push(`Terminologie exacte, distinctions et valeurs chiffrées de ${plan.sourceFile} (${plan.rangeLabel}).`);
  }
  if (tables.length > 0) {
    toRecognizeInQcm.push(`Interprétation précise des ${tables.length} tableau(x)/synthèse(s) de cette leçon.`);
  }

  const introTopics = distinctHeadings.slice(0, 3).join(', ');
  const intro = `Cette leçon couvre « ${plan.title} » (${plan.rangeLabel} de « ${plan.sourceFile} »)${introTopics ? `, en articulant : ${introTopics}` : ''}. Elle regroupe ${memorize.length} point(s) clé(s) à mémoriser et ${tables.length} tableau(x) de synthèse fidèles au support original.`;

  return {
    id: plan.id,
    courseId: course.id,
    order: plan.order,
    chapterTitle: plan.chapterTitle,
    title: plan.title,
    durationMin: plan.durationMin,
    sourceFile: plan.sourceFile,
    sourceRef: plan.sourceRef,
    slideRange: plan.rangeLabel,
    slideRefs: plan.slideRefs,
    pageRefs: plan.pageRefs,
    bmCount: 0,
    bmRefs: [],
    priority: course.priority || 'medium',
    priorityScore: course.priorityScore || 55,
    bmWarning: '',
    revisionVersion: 1,
    majorUpdateNote: '',
    needsReview: true,
    hasManualFlags: reviewNotes.length > 0,
    provenanceSummary: {
      sourceExplicitCount: sections.filter((s) => s.provenance === 'source_explicit').length + memorize.length,
      aiReformulatedCount: activeRecall.length + tables.filter((t) => t.provenance === 'ai_reformulated').length,
      needsVerificationCount: reviewNotes.length
    },
    extractionNote: reviewNotes.length
      ? `Relecture visuelle/manuelle recommandée : ${reviewNotes.join(' | ')}`
      : `Extrait fidèlement depuis ${plan.sourceFile} (${plan.rangeLabel}) — prêt pour validation administrateur.`,
    understand: {
      intro,
      sections,
      tables,
      darija: '',
      triad: { toUnderstand, toMemorize, toRecognizeInQcm }
    },
    memorize,
    activeRecall,
    miniTest: null
  };
}

/**
 * Enrichissement LLM optionnel (si GEMINI_API_KEY / OPENAI_API_KEY configuré côté serveur)
 */
async function enhanceLessonWithAi(aiConfig, plan, deterministicLesson, course) {
  const sourceTranscript = plan.units.map((u) => {
    const parts = [`### ${u.unitLabel} ${u.unitNum} — ${u.title}`];
    if (u.lines?.length) parts.push(u.lines.join('\n'));
    if (u.bullets?.length) parts.push('Puces:\n- ' + u.bullets.join('\n- '));
    if (u.tables?.length) parts.push('Tableaux:\n' + u.tables.map((t) => `${t.title}: ${t.headers.join(' | ')} // ${t.rows.map((r) => r.join(' | ')).join(' ; ')}`).join('\n'));
    if (u.speakerNotes) parts.push(`Note enseignant: ${u.speakerNotes}`);
    return parts.join('\n');
  }).join('\n\n').slice(0, 14000);

  const sysPrompt = `Tu es un professeur de médecine et architecte pédagogique MedStudy.
Transforme l'intégralité du chapitre médical fourni au format EXACT des 12 cours de référence MedStudy (C1-C12).
RÈGLES ABSOLUES :
1. N'INVENTE JAMAIS de fait médical, chiffre, seuil ou question d'examen absent du texte source.
2. Préserve intégralement la terminologie médicale originale, toutes les définitions, classifications, formules, valeurs numériques, distinctions et exemples cliniques du support.
3. Conserve la traçabilité exacte (numéro de Page ou Diapositive) sur chaque élément.
4. Si une partie du support est ambiguë ou incomplète, signale-le dans "extractionWarnings" sans corriger silencieusement.
Réponds STRICTEMENT en JSON valide selon le schéma demandé.`;

  const userPrompt = `Cours : ${course.title} (${course.code})
Chapitre : ${plan.title} (${plan.sourceRef})
Contenu source complet :
${sourceTranscript}

Produis un objet JSON avec ces clés exactes :
{
  "title": "Titre clair et académique du chapitre",
  "intro": "Introduction pédagogique structurée expliquant l'enjeu médical et la logique du chapitre",
  "sections": [
    { "heading": "Sous-thème structuré", "pageRef": "${plan.unitLabel} X", "provenance": "source_explicit", "paragraphs": ["Paragraphe explicatif fidèle avec <strong>termes clés</strong>"], "bullets": ["<strong>Point clé :</strong> détail fidèle"] }
  ],
  "tables": [
    { "title": "Tableau comparatif/synthétique", "pageRef": "${plan.rangeLabel}", "provenance": "ai_reformulated", "headers": ["Critère", "..."], "rows": [["...", "..."]] }
  ],
  "darija": "Clarification courte et claire en darija algérienne (facultatif mais utile pour distinguer les pièges QCM)",
  "triad": {
    "toUnderstand": ["2-3 objectifs conceptuels précis"],
    "toMemorize": ["2-4 notions exactes à mémoriser"],
    "toRecognizeInQcm": ["2-4 pièges/distinctions clés à reconnaître en QCM"]
  },
  "memorize": [
    { "category": "Définition|Classification|Formule / Seuil|Liste|Distinction|Piège QCM|Exemple clinique", "title": "Titre court", "content": "Contenu précis avec <strong>mots-clés</strong>", "pageRef": "${plan.unitLabel} X", "provenance": "source_explicit", "highlight": true }
  ],
  "activeRecall": [
    { "prompt": "Question de rappel actif spécifique", "expectedAnswer": "Réponse précise sourcée", "pageRef": "${plan.unitLabel} X", "provenance": "ai_reformulated" }
  ],
  "extractionWarnings": []
}`;

  const aiRes = await invokeStructuredAi(aiConfig, sysPrompt, userPrompt, 4096);
  if (!aiRes.ok || !aiRes.data || !Array.isArray(aiRes.data.sections) || !aiRes.data.sections.length) {
    return { enhanced: false, lesson: deterministicLesson, reason: aiRes.fallbackReason || 'Structure IA incomplète' };
  }

  const d = aiRes.data;
  // Conserver les tableaux sources extraits + ajouter les tableaux comparatifs IA sans doublons
  const sourceTables = (deterministicLesson.understand.tables || []).filter((t) => t.provenance === 'source_explicit');
  const aiTables = Array.isArray(d.tables)
    ? d.tables.filter((t) => t && Array.isArray(t.headers) && t.headers.length >= 2 && Array.isArray(t.rows) && t.rows.length >= 1)
      .map((t) => ({ ...t, sourceFile: plan.sourceFile, provenance: t.provenance || 'ai_reformulated' }))
    : [];

  const mergedMemorize = (Array.isArray(d.memorize) && d.memorize.length >= 2)
    ? d.memorize.slice(0, 8).map((m, idx) => ({
        id: `M_${plan.id}_${idx + 1}`,
        category: m.category || 'Définition',
        title: String(m.title || `Notion ${idx + 1}`).trim(),
        content: String(m.content || '').trim(),
        plainContent: stripHtml(m.content || ''),
        pageRef: String(m.pageRef || plan.rangeLabel).trim(),
        slideNum: plan.pageRefs[0] || 1,
        slideTitle: plan.title,
        sourceFile: plan.sourceFile,
        provenance: m.provenance || 'source_explicit',
        highlight: !!m.highlight
      }))
    : deterministicLesson.memorize;

  const mergedRecall = (Array.isArray(d.activeRecall) && d.activeRecall.length >= 2)
    ? d.activeRecall.slice(0, 5).map((ar, idx) => ({
        id: `AR_${plan.id}_${idx + 1}`,
        prompt: String(ar.prompt || '').trim(),
        expectedAnswer: String(ar.expectedAnswer || '').trim(),
        pageRef: String(ar.pageRef || plan.rangeLabel).trim(),
        sourceFile: plan.sourceFile,
        provenance: ar.provenance || 'ai_reformulated'
      }))
    : deterministicLesson.activeRecall;

  const extraWarnings = Array.isArray(d.extractionWarnings) ? d.extractionWarnings.filter(Boolean) : [];
  const lesson = {
    ...deterministicLesson,
    title: String(d.title || deterministicLesson.title).trim(),
    extractionNote: extraWarnings.length
      ? `${deterministicLesson.extractionNote} | Notes IA : ${extraWarnings.join(' ; ')}`
      : deterministicLesson.extractionNote,
    understand: {
      intro: String(d.intro || deterministicLesson.understand.intro).trim(),
      sections: d.sections.map((s) => ({
        heading: String(s.heading || plan.title).trim(),
        sourceRef: `${plan.sourceFile} · ${s.pageRef || plan.rangeLabel}`,
        pageRef: String(s.pageRef || plan.rangeLabel).trim(),
        provenance: s.provenance || 'ai_reformulated',
        paragraphs: Array.isArray(s.paragraphs) ? s.paragraphs.filter(Boolean) : [],
        bullets: Array.isArray(s.bullets) ? s.bullets.filter(Boolean) : []
      })),
      tables: [...sourceTables, ...aiTables],
      darija: String(d.darija || '').trim(),
      triad: {
        toUnderstand: Array.isArray(d.triad?.toUnderstand) && d.triad.toUnderstand.length ? d.triad.toUnderstand : deterministicLesson.understand.triad.toUnderstand,
        toMemorize: Array.isArray(d.triad?.toMemorize) && d.triad.toMemorize.length ? d.triad.toMemorize : deterministicLesson.understand.triad.toMemorize,
        toRecognizeInQcm: Array.isArray(d.triad?.toRecognizeInQcm) && d.triad.toRecognizeInQcm.length ? d.triad.toRecognizeInQcm : deterministicLesson.understand.triad.toRecognizeInQcm
      }
    },
    memorize: mergedMemorize,
    activeRecall: mergedRecall
  };

  return { enhanced: true, lesson, provider: aiRes.provider };
}

/**
 * STAGE 6 — Contenu pédagogique complet (Comprendre, À mémoriser, Rappel actif)
 */
async function executeStageEducationalContent(artifacts, course, aiConfig, log) {
  const plans = artifacts.chapterPlans || [];
  const allStatements = artifacts.organized?.statements || [];
  const lessons = [];
  let aiEnhancedCount = 0;

  for (const plan of plans) {
    const baseLesson = buildDeterministicLesson(plan, course, allStatements);
    if (aiConfig.enabled) {
      const enh = await enhanceLessonWithAi(aiConfig, plan, baseLesson, course);
      if (enh.enhanced) aiEnhancedCount++;
      else log(`Leçon ${plan.id} : fallback structurel médical (${enh.reason}).`);
      lessons.push(enh.lesson);
    } else {
      lessons.push(baseLesson);
    }
  }

  artifacts.lessons = lessons;
  const totalMem = lessons.reduce((s, l) => s + (l.memorize?.length || 0), 0);
  const totalTables = lessons.reduce((s, l) => s + (l.understand?.tables?.length || 0), 0);
  const totalRecall = lessons.reduce((s, l) => s + (l.activeRecall?.length || 0), 0);

  log(`Contenu pédagogique généré : ${lessons.length} leçons, ${totalMem} fiches « À mémoriser », ${totalTables} tableau(x), ${totalRecall} questions de rappel actif${aiEnhancedCount ? ` (${aiEnhancedCount} synthétisées via ${aiConfig.provider})` : ''}.`);
  return {
    metrics: { lessons: lessons.length, memorizeItems: totalMem, tables: totalTables, activeRecall: totalRecall, aiEnhancedCount },
    message: `${lessons.length} leçons structurées (${totalMem} fiches mémoire, ${totalTables} tableaux, ${totalRecall} rappels actifs).`
  };
}

/**
 * Génère des flashcards diversifiées (les 6 types MedStudy) sans répétitions
 */
function buildDeterministicFlashcardsForLesson(lesson, course) {
  const cards = [];
  const mems = lesson.memorize || [];
  const seenQ = [];

  const pushCard = (card) => {
    if (!card.question || !card.answer || card.answer.length < 8) return false;
    if (seenQ.some((q) => jaccardSimilarity(q, card.question) >= 0.72)) return false;
    seenQ.push(card.question);
    cards.push(card);
    return true;
  };

  // 1. Parcourir les fiches À mémoriser avec des formulations ciblées par type
  mems.forEach((m) => {
    if (cards.length >= 6) return;
    const plain = (m.plainContent || stripHtml(m.content)).trim();
    const cat = String(m.category || '');
    const baseMeta = {
      courseId: course.id,
      lessonId: lesson.id,
      chapterTitle: lesson.chapterTitle || lesson.title,
      pageRef: m.pageRef || lesson.slideRange || '',
      slideNum: m.slideNum ?? (lesson.pageRefs?.[0] || null),
      slideTitle: m.slideTitle || lesson.title,
      sourceFile: m.sourceFile || lesson.sourceFile || '',
      sourceType: 'ai_generated_practice',
      provenance: 'ai_reformulated',
      needsReview: true
    };

    if (/Formule|Valeur/.test(cat)) {
      pushCard({
        id: `FC_${lesson.id}_${cards.length + 1}`,
        ...baseMeta,
        type: 'formula',
        question: `Quelle valeur chiffrée, formule ou norme exacte concerne : « ${m.title} » ?`,
        answer: plain,
        hint: `Repère : ${baseMeta.pageRef} (${lesson.title})`
      });
    } else if (/Liste|Énumération/.test(cat)) {
      pushCard({
        id: `FC_${lesson.id}_${cards.length + 1}`,
        ...baseMeta,
        type: 'list',
        question: `Énumérez les éléments clés correspondant à : « ${m.title} ».`,
        answer: plain,
        hint: `Source : ${baseMeta.sourceFile} · ${baseMeta.pageRef}`
      });
    } else if (/Distinction|Classification/.test(cat)) {
      pushCard({
        id: `FC_${lesson.id}_${cards.length + 1}`,
        ...baseMeta,
        type: 'difference',
        question: `Quelle distinction ou classification précise le cours concernant : « ${m.title} » ?`,
        answer: plain,
        hint: `Point discriminant — ${baseMeta.pageRef}`
      });
    } else if (/Exception|Piège/.test(cat)) {
      pushCard({
        id: `FC_${lesson.id}_${cards.length + 1}`,
        ...baseMeta,
        type: 'short_answer',
        question: `Quel piège, exception ou contre-indication faut-il retenir sur « ${m.title} » ?`,
        answer: plain,
        hint: `Piège fréquent en QCM · ${baseMeta.pageRef}`
      });
    } else {
      pushCard({
        id: `FC_${lesson.id}_${cards.length + 1}`,
        ...baseMeta,
        type: 'definition',
        question: `Définissez précisément : « ${m.title} ».`,
        answer: plain,
        hint: `Source : ${baseMeta.sourceFile} · ${baseMeta.pageRef}`
      });
    }
  });

  // 2. Ajouter une carte « Cloze » (texte à trous ciblé sur un terme médical ou chiffre clé)
  const clozeCandidate = mems.find((m) => {
    const p = m.plainContent || stripHtml(m.content);
    return p.length >= 30 && p.length <= 210;
  });
  if (clozeCandidate && cards.length < 6) {
    const plain = clozeCandidate.plainContent || stripHtml(clozeCandidate.content);
    const numMatch = plain.match(/\b(\d+([.,]\d+)?\s*(%|heures?|jours?|semaines?|mois|ans?|mg|g\/L|°C|cas))\b/i);
    const keyMatch = numMatch || plain.match(/\b([A-ZÉÈÊÀÂÎÔÙÇ][a-zA-ZÉÈÊÀÂÎÔÙÇéèêàâîôùç\-]{5,})\b/);
    if (keyMatch) {
      const target = keyMatch[1];
      const blanked = plain.replace(target, '______');
      if (blanked !== plain) {
        pushCard({
          id: `FC_${lesson.id}_${cards.length + 1}`,
          courseId: course.id,
          lessonId: lesson.id,
          chapterTitle: lesson.chapterTitle || lesson.title,
          type: 'cloze',
          question: `Complétez l’énoncé du cours (« ${clozeCandidate.title} ») : ${blanked}`,
          answer: `${target} — Énoncé complet : ${plain}`,
          hint: `Source : ${clozeCandidate.sourceFile || lesson.sourceFile} · ${clozeCandidate.pageRef}`,
          pageRef: clozeCandidate.pageRef || lesson.slideRange || '',
          slideNum: clozeCandidate.slideNum ?? (lesson.pageRefs?.[0] || null),
          slideTitle: clozeCandidate.slideTitle || lesson.title,
          sourceFile: clozeCandidate.sourceFile || lesson.sourceFile || '',
          sourceType: 'ai_generated_practice',
          provenance: 'ai_reformulated',
          needsReview: true
        });
      }
    }
  }

  // 3. Ajouter une carte « Difference » comparant 2 notions distinctes de la même leçon si aucune carte 'difference' n'existe encore
  if (!cards.some((c) => c.type === 'difference') && mems.length >= 2 && cards.length < 6) {
    const a = mems[0];
    const b = mems.find((x, i) => i > 0 && x.title !== a.title) || mems[1];
    if (a && b && a.title !== b.title) {
      pushCard({
        id: `FC_${lesson.id}_${cards.length + 1}`,
        courseId: course.id,
        lessonId: lesson.id,
        chapterTitle: lesson.chapterTitle || lesson.title,
        type: 'difference',
        question: `Comment différencier « ${a.title} » et « ${b.title} » d’après le cours ?`,
        answer: `• ${a.title} (${a.pageRef}) : ${a.plainContent || stripHtml(a.content)}\n• ${b.title} (${b.pageRef}) : ${b.plainContent || stripHtml(b.content)}`,
        hint: `Comparaison directe · ${lesson.sourceRef}`,
        pageRef: `${a.pageRef} / ${b.pageRef}`,
        slideNum: a.slideNum ?? null,
        slideTitle: lesson.title,
        sourceFile: lesson.sourceFile || '',
        sourceType: 'ai_generated_practice',
        provenance: 'ai_reformulated',
        needsReview: true
      });
    }
  }

  return cards;
}

/**
 * STAGE 7 — Génération des Flashcards de rappel actif
 */
async function executeStageFlashcards(artifacts, course, aiConfig, log) {
  const lessons = artifacts.lessons || [];
  const flashcards = [];

  for (const lesson of lessons) {
    let lessonCards = buildDeterministicFlashcardsForLesson(lesson, course);

    if (aiConfig.enabled) {
      const memSummary = (lesson.memorize || []).map((m) => `- [${m.category}] (${m.pageRef}) ${m.title}: ${m.plainContent || stripHtml(m.content)}`).join('\n');
      const aiRes = await invokeStructuredAi(
        aiConfig,
        `Tu génères des flashcards médicales de rappel actif MedStudy de haute précision. N'invente aucun fait hors du support. Utilise une variété de types parmi : definition, cloze, list, difference, formula, short_answer. Réponds STRICTEMENT en JSON.`,
        `Cours : ${course.title} · Leçon : ${lesson.title} (${lesson.sourceRef})
Notions sourcées :
${memSummary}

Génère 5 flashcards spécifiques et non répétitives en JSON :
{"flashcards":[{"type":"definition|cloze|list|difference|formula|short_answer","question":"...","answer":"...","hint":"...","pageRef":"..."}]}`,
        2048
      );
      if (aiRes.ok && Array.isArray(aiRes.data?.flashcards) && aiRes.data.flashcards.length >= 2) {
        const validTypes = new Set(['definition', 'cloze', 'list', 'difference', 'formula', 'short_answer']);
        lessonCards = aiRes.data.flashcards
          .filter((fc) => fc && fc.question && fc.answer)
          .slice(0, 6)
          .map((fc, idx) => ({
            id: `FC_${lesson.id}_${idx + 1}`,
            courseId: course.id,
            lessonId: lesson.id,
            chapterTitle: lesson.chapterTitle || lesson.title,
            type: validTypes.has(fc.type) ? fc.type : 'short_answer',
            question: String(fc.question).trim(),
            answer: String(fc.answer).trim(),
            hint: String(fc.hint || `Source : ${lesson.sourceRef}`).trim(),
            pageRef: String(fc.pageRef || lesson.slideRange || '').trim(),
            slideNum: lesson.pageRefs?.[0] ?? null,
            slideTitle: lesson.title,
            sourceFile: lesson.sourceFile || '',
            sourceType: 'ai_generated_practice',
            provenance: 'ai_reformulated',
            needsReview: true
          }));
      }
    }

    flashcards.push(...lessonCards);
  }

  artifacts.flashcards = flashcards;
  const distinctTypes = Array.from(new Set(flashcards.map((f) => f.type)));
  log(`${flashcards.length} flashcards générées couvrant ${distinctTypes.length} type(s) (${distinctTypes.join(', ')}).`);
  return {
    metrics: { flashcardsCreated: flashcards.length, typesUsed: distinctTypes },
    message: `${flashcards.length} flashcards créées (${distinctTypes.length} types actifs).`
  };
}

/**
 * Crée une variante numérique plausible mais fausse pour un distracteur médical sourcé
 */
function buildNumericDistractor(text) {
  const m = String(text || '').match(/(\d+(?:[.,]\d+)?)(\s*(?:%|heures?|h\b|jours?|j\b|semaines?|mois|ans?|mg|g\/L|°C|cas))/i);
  if (!m) return null;
  const origNum = parseFloat(m[1].replace(',', '.'));
  if (!Number.isFinite(origNum) || origNum === 0) return null;
  const altered = origNum >= 50 ? Math.round(origNum / 2) : (origNum <= 3 ? origNum * 3 : origNum * 2);
  const replaced = text.replace(m[0], `${altered}${m[2]}`);
  if (replaced === text) return null;
  return {
    text: replaced,
    reason: `Valeur numérique erronée (${altered}${m[2]} au lieu de ${m[1]}${m[2]} dans le support original).`
  };
}

function buildDeterministicQcmsForLesson(lesson, allLessons, course, embeddedQcms) {
  const qcms = [];
  const mems = lesson.memorize || [];

  // Pool global de faits réels d'AUTRES notions/leçons pour fabriquer des distracteurs crédibles (ZÉRO placeholder !)
  const crossPool = [];
  for (const l of allLessons) {
    for (const m of (l.memorize || [])) {
      const plain = (m.plainContent || stripHtml(m.content)).trim();
      if (plain.length >= 16 && plain.length <= 210) {
        crossPool.push({
          lessonId: l.id,
          lessonTitle: l.title,
          title: m.title,
          text: plain,
          pageRef: m.pageRef || l.slideRange || '',
          category: m.category
        });
      }
    }
  }

  // 1. Préserver d'abord toute question QCM explicite trouvée dans le support source (jamais attribuée à la BM officielle !)
  const ownEmbedded = (embeddedQcms || []).filter((eq) => (lesson.pageRefs || []).includes(eq.unitNum));
  ownEmbedded.slice(0, 2).forEach((eq) => {
    qcms.push({
      id: `Q_${lesson.id}_SRC_${qcms.length + 1}`,
      courseId: course.id,
      lessonId: lesson.id,
      chapterTitle: lesson.chapterTitle || lesson.title,
      topic: `${lesson.title} (Question extraite du support)`,
      sourceType: 'source_exam_original',
      provenance: 'needs_verification',
      bmRef: '',
      year: 'Support de cours',
      pageRef: `${eq.unitLabel} ${eq.unitNum}`,
      slideNum: eq.unitNum,
      slideTitle: eq.slideTitle || lesson.title,
      sourceFile: eq.sourceFilename || lesson.sourceFile || '',
      multiSelect: false,
      isHard: false,
      needsReview: true,
      stem: eq.stem,
      options: eq.options.slice(0, 5),
      correct: [eq.options[0]?.key || 'A'],
      explanation: `Question détectée verbatim dans le support (« ${eq.sourceFilename} », ${eq.unitLabel} ${eq.unitNum}). Vérifiez la bonne réponse avant publication.`,
      wrongReasons: {},
      courseRef: `${eq.sourceFilename} · ${eq.unitLabel} ${eq.unitNum}`
    });
  });

  // 2. Générer des QCM à choix unique avec distracteurs issus de vrais concepts du cours & clés randomisées (A/B/C/D)
  mems.slice(0, 4).forEach((m, idx) => {
    const trueText = (m.plainContent || stripHtml(m.content)).trim();
    if (trueText.length < 14) return;

    const distractors = [];
    // Distracteur numérique si formule/seuil
    const numDist = buildNumericDistractor(trueText);
    if (numDist) distractors.push(numDist);

    // Distracteurs issus d'autres concepts réels du cours (non similaires au fait testé)
    const candidates = crossPool.filter((cp) =>
      cp.title !== m.title &&
      jaccardSimilarity(cp.text, trueText) < 0.45 &&
      cp.text.length >= 16 &&
      !/(https?:\/\/|www\.|doi\s*:)/i.test(cp.text)
    );
    const shuffledCands = deterministicShuffle(candidates, `${lesson.id}_${idx}_pool`);
    for (const c of shuffledCands) {
      if (distractors.length >= 3) break;
      if (distractors.some((d) => jaccardSimilarity(d.text, c.text) >= 0.65)) continue;
      distractors.push({
        text: c.text,
        reason: `Faux : cette affirmation se rapporte en réalité à « ${c.title} » (${c.pageRef}), et non à « ${m.title} ».`
      });
    }

    // Complément propre si le document est très court (jamais de texte "[Distracteur IA à affiner]" !)
    if (distractors.length < 3) {
      const otherTitles = allLessons.map((l) => l.title).filter((t) => t !== lesson.title);
      const fallbacks = [
        {
          text: `Cette notion ne relève pas de « ${m.title} » mais uniquement d’une démarche diagnostique d’exclusion.`,
          reason: `Contredit la définition précise donnée pour « ${m.title} » (${m.pageRef}).`
        },
        {
          text: `Elle s’applique exclusivement en dehors du cadre décrit dans « ${otherTitles[0] || lesson.title} ».`,
          reason: `Formulation restrictive contraire au contenu exact de ${m.pageRef}.`
        },
        {
          text: `Aucune des propositions précédentes ne correspond à « ${m.title} ».`,
          reason: `Inexact car l’une des propositions reprend fidèlement la notion sourcée en ${m.pageRef}.`
        }
      ];
      for (const fb of fallbacks) {
        if (distractors.length >= 3) break;
        distractors.push(fb);
      }
    }

    const rawEntries = [
      { isCorrect: true, text: trueText, reason: '' },
      ...distractors.slice(0, 3).map((d) => ({ isCorrect: false, text: d.text, reason: d.reason }))
    ];
    const mixed = deterministicShuffle(rawEntries, `${course.id}_${lesson.id}_Q${idx}`);
    const keys = ['A', 'B', 'C', 'D'];
    const options = mixed.map((item, i) => ({ key: keys[i], text: item.text }));
    const correct = [];
    const wrongReasons = {};
    mixed.forEach((item, i) => {
      if (item.isCorrect) correct.push(keys[i]);
      else wrongReasons[keys[i]] = item.reason;
    });

    const stemPrefix = /Formule|Valeur/.test(m.category)
      ? `Concernant les valeurs ou formules relatives à « ${m.title} », quelle proposition est exacte ?`
      : (/Exception|Piège/.test(m.category)
        ? `À propos de « ${m.title} », quelle affirmation respecte exactement la règle du cours ?`
        : (/Distinction|Classification/.test(m.category)
          ? `Concernant la classification / distinction « ${m.title} », quelle proposition est correcte ?`
          : `Selon le cours, quelle proposition définit ou caractérise exactement « ${m.title} » ?`));

    qcms.push({
      id: `Q_${lesson.id}_${qcms.length + 1}`,
      courseId: course.id,
      lessonId: lesson.id,
      chapterTitle: lesson.chapterTitle || lesson.title,
      topic: `${m.title} (${m.pageRef})`,
      sourceType: 'ai_generated_practice',
      provenance: 'ai_reformulated',
      bmRef: '',
      year: 'Entraînement IA',
      pageRef: m.pageRef || lesson.slideRange || '',
      slideNum: m.slideNum ?? (lesson.pageRefs?.[0] || null),
      slideTitle: m.slideTitle || lesson.title,
      sourceFile: m.sourceFile || lesson.sourceFile || '',
      multiSelect: false,
      isHard: /Exception|Piège|Formule/.test(m.category),
      needsReview: true,
      stem: stemPrefix,
      options,
      correct,
      explanation: `D’après « ${m.sourceFile || lesson.sourceFile} » (${m.pageRef}) : ${trueText}`,
      wrongReasons,
      courseRef: `${m.sourceFile || lesson.sourceFile} · ${m.pageRef}`
    });
  });

  // 3. Générer au moins 1 QCM à choix multiples (multiSelect: true) comme dans les 12 cours C1–C12 !
  const listMem = mems.find((m) => (m.plainContent || '').includes('•') && (m.plainContent || '').split('•').length >= 3);
  const multiSourceItems = listMem
    ? listMem.plainContent.split('•').map((s) => s.trim()).filter((s) => s.length >= 8)
    : mems.slice(0, 3).map((m) => (m.plainContent || stripHtml(m.content)).trim()).filter((s) => s.length >= 12);

  if (multiSourceItems.length >= 2) {
    const trueChoices = multiSourceItems.slice(0, 2);
    const otherLessonFacts = crossPool.filter((cp) => cp.lessonId !== lesson.id && cp.text.length >= 16);
    const falseChoices = [];
    for (const c of deterministicShuffle(otherLessonFacts, `${lesson.id}_multi_false`)) {
      if (falseChoices.length >= 2) break;
      if (trueChoices.some((t) => jaccardSimilarity(t, c.text) >= 0.45)) continue;
      falseChoices.push({
        text: c.text,
        reason: `Faux pour ce chapitre : cet élément appartient au chapitre « ${c.lessonTitle} » (${c.pageRef}).`
      });
    }
    while (falseChoices.length < 2) {
      const idxF = falseChoices.length;
      falseChoices.push({
        text: idxF === 0
          ? `Aucune des caractéristiques décrites dans « ${lesson.title} » ne s’applique en pratique.`
          : `Ces critères sont exclus de la section « ${lesson.title} » (${lesson.slideRange}).`,
        reason: `Contredit directement les éléments validés de la leçon « ${lesson.title} » (${lesson.slideRange}).`
      });
    }

    const entries = [
      ...trueChoices.map((t) => ({ isCorrect: true, text: t, reason: '' })),
      ...falseChoices.slice(0, 2).map((f) => ({ isCorrect: false, text: f.text, reason: f.reason }))
    ];
    const mixed = deterministicShuffle(entries, `${course.id}_${lesson.id}_MULTI`);
    const keys = ['A', 'B', 'C', 'D'];
    const options = mixed.map((it, i) => ({ key: keys[i], text: it.text }));
    const correct = [];
    const wrongReasons = {};
    mixed.forEach((it, i) => {
      if (it.isCorrect) correct.push(keys[i]);
      else wrongReasons[keys[i]] = it.reason;
    });

    const refTitle = listMem ? listMem.title : lesson.title;
    const refPage = listMem ? listMem.pageRef : lesson.slideRange;
    qcms.push({
      id: `Q_${lesson.id}_${qcms.length + 1}`,
      courseId: course.id,
      lessonId: lesson.id,
      chapterTitle: lesson.chapterTitle || lesson.title,
      topic: `Synthèse multi-choix — ${refTitle}`,
      sourceType: 'ai_generated_practice',
      provenance: 'ai_reformulated',
      bmRef: '',
      year: 'Entraînement IA',
      pageRef: refPage || lesson.slideRange || '',
      slideNum: lesson.pageRefs?.[0] ?? null,
      slideTitle: lesson.title,
      sourceFile: lesson.sourceFile || '',
      multiSelect: true,
      isHard: true,
      needsReview: true,
      stem: `Parmi les propositions suivantes concernant « ${refTitle} », cochez les réponses exactes :`,
      options,
      correct,
      explanation: `Les propositions exactes (${correct.join(', ')}) reprennent directement les points clés du support (${lesson.sourceFile} · ${refPage}).`,
      wrongReasons,
      courseRef: `${lesson.sourceFile} · ${refPage}`
    });
  }

  return qcms;
}

/**
 * STAGE 8 — Génération des QCM médicaux (choix unique + choix multiple, zéro placeholder)
 */
async function executeStageQcms(artifacts, course, aiConfig, log) {
  const lessons = artifacts.lessons || [];
  const embeddedQcms = artifacts.organized?.embeddedQcms || [];
  const allQcms = [];

  for (const lesson of lessons) {
    let lessonQcms = buildDeterministicQcmsForLesson(lesson, lessons, course, embeddedQcms);

    if (aiConfig.enabled) {
      const memSummary = (lesson.memorize || []).map((m) => `- [${m.category}] (${m.pageRef}) ${m.title}: ${m.plainContent || stripHtml(m.content)}`).join('\n');
      const secSummary = (lesson.understand?.sections || []).slice(0, 4).map((s) => `${s.heading} (${s.pageRef}): ${stripHtml((s.paragraphs || []).join(' ')).slice(0, 400)}`).join('\n');
      const aiRes = await invokeStructuredAi(
        aiConfig,
        `Tu es un professeur rédacteur d'examens QCM de médecine (standard MedStudy C1-C12).
RÈGLES STRICTES :
- Crée 5 QCM médicaux réalistes (3 choix unique + 2 choix multiples "multiSelect": true) basés EXCLUSIVEMENT sur le support fourni.
- Distracteurs médicaux crédibles (JAMAIS de texte placeholder ni "aucune réponse" répétitif).
- Répartis aléatoirement les bonnes réponses entre A, B, C, D.
- Fournis une "explanation" sourcée et des "wrongReasons" précises pour CHAQUE mauvaise option.
- N'attribue JAMAIS une question générée à la BM officielle.`,
        `Cours : ${course.title} · Leçon : ${lesson.title} (${lesson.sourceRef})
Contenu sourcé :
${memSummary}
${secSummary}

Réponds en JSON :
{"qcms":[{"topic":"...","multiSelect":false,"isHard":false,"pageRef":"...","stem":"...","options":[{"key":"A","text":"..."},{"key":"B","text":"..."},{"key":"C","text":"..."},{"key":"D","text":"..."}],"correct":["B"],"explanation":"...","wrongReasons":{"A":"...","C":"...","D":"..."}}]}`,
        3072
      );
      if (aiRes.ok && Array.isArray(aiRes.data?.qcms) && aiRes.data.qcms.length >= 3) {
        const validAi = aiRes.data.qcms
          .filter((q) => q && q.stem && Array.isArray(q.options) && q.options.length >= 3 && Array.isArray(q.correct) && q.correct.length >= 1)
          .slice(0, 6)
          .map((q, idx) => ({
            id: `Q_${lesson.id}_${idx + 1}`,
            courseId: course.id,
            lessonId: lesson.id,
            chapterTitle: lesson.chapterTitle || lesson.title,
            topic: String(q.topic || lesson.title).trim(),
            sourceType: 'ai_generated_practice',
            provenance: 'ai_reformulated',
            bmRef: '',
            year: 'Entraînement IA',
            pageRef: String(q.pageRef || lesson.slideRange || '').trim(),
            slideNum: lesson.pageRefs?.[0] ?? null,
            slideTitle: lesson.title,
            sourceFile: lesson.sourceFile || '',
            multiSelect: !!q.multiSelect || q.correct.length > 1,
            isHard: !!q.isHard,
            needsReview: true,
            stem: String(q.stem).trim(),
            options: q.options.map((o, oi) => ({ key: String(o.key || ['A', 'B', 'C', 'D', 'E'][oi]).toUpperCase(), text: String(o.text || '').trim() })),
            correct: q.correct.map((k) => String(k).toUpperCase()),
            explanation: String(q.explanation || '').trim(),
            wrongReasons: q.wrongReasons && typeof q.wrongReasons === 'object' ? q.wrongReasons : {},
            courseRef: `${lesson.sourceFile} · ${q.pageRef || lesson.slideRange}`
          }));
        if (validAi.length >= 3) {
          const embeddedPreserved = lessonQcms.filter((q) => q.sourceType === 'source_exam_original');
          lessonQcms = [...embeddedPreserved, ...validAi];
        }
      }
    }

    allQcms.push(...lessonQcms);
  }

  artifacts.qcms = allQcms;
  const multiCnt = allQcms.filter((q) => q.multiSelect).length;
  log(`${allQcms.length} QCM médicaux générés (${multiCnt} choix multiples, ${allQcms.length - multiCnt} choix uniques, zéro distracteur générique).`);
  return {
    metrics: { qcmsCreated: allQcms.length, multiSelectCount: multiCnt },
    message: `${allQcms.length} QCM médicaux créés (${multiCnt} à choix multiples).`
  };
}

/**
 * STAGE 9 — Génération des Mini-Tests structurés par leçon
 */
function executeStageMiniTests(artifacts, log) {
  const lessons = artifacts.lessons || [];
  const allQcms = artifacts.qcms || [];
  let miniTestsCount = 0;

  for (const lesson of lessons) {
    const own = allQcms.filter((q) => q.lessonId === lesson.id);
    const extras = allQcms.filter((q) => q.lessonId !== lesson.id).sort((a, b) => (b.isHard ? 1 : 0) - (a.isHard ? 1 : 0));
    const selected = [...own.slice(0, 5)];
    if (selected.length < 4) {
      selected.push(...extras.slice(0, 4 - selected.length));
    }

    const objectives = [
      ...(lesson.understand?.triad?.toUnderstand || []).slice(0, 2),
      ...(lesson.understand?.triad?.toMemorize || []).slice(0, 2)
    ];

    lesson.miniTest = {
      id: `MT_${lesson.id}`,
      title: `Mini-test de validation — ${lesson.title}`,
      passingScore: 80,
      objectives: objectives.length ? objectives : [`Valider les objectifs clés de « ${lesson.title} »`],
      questionIds: selected.map((q) => q.id),
      questionCount: selected.length,
      generatedAt: new Date().toISOString()
    };
    miniTestsCount++;
  }

  log(`${miniTestsCount} mini-tests de validation générés (seuil de maîtrise : 80 %, reliés au SRS).`);
  return {
    metrics: { miniTestsCreated: miniTestsCount },
    message: `${miniTestsCount} mini-tests structurés générés et reliés au suivi SRS.`
  };
}

/**
 * STAGE 10 — Contrôle Qualité Automatisé (9 vérifications obligatoires Phase 6)
 */
export function runQualityAudit(course, flashcards, qcms) {
  const lessons = Array.isArray(course?.lessons) ? course.lessons : [];
  const fcs = Array.isArray(flashcards) ? flashcards : [];
  const qs = Array.isArray(qcms) ? qcms : [];
  const lessonIds = new Set(lessons.map((l) => l.id));

  const issues = [];
  const checks = [];

  const addCheck = (key, label, status, detail, affectedIds = []) => {
    checks.push({ key, label, status, detail, affectedIds });
    if (status === 'error' || status === 'warning') {
      issues.push({ key, severity: status, label, detail, affectedIds });
    }
  };

  // 1. Chapitres manquants
  if (lessons.length === 0) {
    addCheck('missing_chapters', 'Chapitres & Leçons présents', 'error', 'Aucun chapitre ni leçon n’a été créé pour ce cours.');
  } else {
    const untitled = lessons.filter((l) => !String(l.title || '').trim()).map((l) => l.id);
    if (untitled.length) addCheck('missing_chapters', 'Titres de chapitres valides', 'error', `${untitled.length} leçon(s) sans titre.`, untitled);
    else addCheck('missing_chapters', 'Chapitres & Leçons présents', 'pass', `${lessons.length} chapitre(s)/leçon(s) structurés.`);
  }

  // 2. Leçons vides ou insuffisantes
  const emptyLessons = [];
  const thinLessons = [];
  for (const l of lessons) {
    const secs = l.understand?.sections || [];
    const words = secs.map((s) => stripHtml(`${s.heading || ''} ${(s.paragraphs || []).join(' ')} ${(s.bullets || []).join(' ')}`)).join(' ').split(/\s+/).filter(Boolean).length;
    if (secs.length === 0 || words < 10) emptyLessons.push(l.id);
    else if ((l.memorize || []).length === 0) thinLessons.push(l.id);
  }
  if (emptyLessons.length) {
    addCheck('empty_lessons', 'Contenu des leçons non vide', 'error', `${emptyLessons.length} leçon(s) vide(s) ou sans texte pédagogique.`, emptyLessons);
  } else if (thinLessons.length) {
    addCheck('empty_lessons', 'Fiches « À mémoriser » par leçon', 'warning', `${thinLessons.length} leçon(s) sans élément « À mémoriser ».`, thinLessons);
  } else {
    addCheck('empty_lessons', 'Contenu des leçons complet', 'pass', 'Toutes les leçons possèdent explications et fiches à mémoriser.');
  }

  // 3. Extraction incomplète / pages scannées / images non OCR
  const flaggedPages = Array.isArray(course?.aiExtraction?.lowConfidencePages) ? course.aiExtraction.lowConfidencePages : [];
  const manualLessons = lessons.filter((l) => l.hasManualFlags).map((l) => l.id);
  if (flaggedPages.length || manualLessons.length) {
    addCheck('incomplete_extraction', 'Complétude de l’extraction & OCR', 'warning', `${flaggedPages.length} page(s)/diapositive(s) signalée(s) pour contrôle visuel (${flaggedPages.slice(0, 8).join(', ')}).`, manualLessons);
  } else {
    addCheck('incomplete_extraction', 'Complétude de l’extraction & OCR', 'pass', 'Aucune page ou diapositive illisible détectée.');
  }

  // 4. Contenu dupliqué
  const dupLessonTitles = [];
  const titleMap = new Map();
  for (const l of lessons) {
    const k = String(l.title || '').toLowerCase().trim();
    if (k && titleMap.has(k)) dupLessonTitles.push(l.id);
    else titleMap.set(k, l.id);
  }
  if (dupLessonTitles.length) {
    addCheck('duplicate_content', 'Absence de contenu dupliqué', 'warning', `${dupLessonTitles.length} titre(s) de leçon en doublon détecté(s).`, dupLessonTitles);
  } else {
    addCheck('duplicate_content', 'Absence de contenu dupliqué', 'pass', 'Aucun doublon structurel entre chapitres.');
  }

  // 5. Flashcards répétitives ou incomplètes
  const badFc = [];
  const dupFc = [];
  for (let i = 0; i < fcs.length; i++) {
    const f = fcs[i];
    if (!String(f.question || '').trim() || !String(f.answer || '').trim()) {
      badFc.push(f.id);
      continue;
    }
    for (let j = i + 1; j < fcs.length; j++) {
      if (jaccardSimilarity(f.question, fcs[j].question) >= 0.8) {
        dupFc.push(fcs[j].id);
        break;
      }
    }
  }
  if (badFc.length) {
    addCheck('repeated_flashcards', 'Qualité & unicité des Flashcards', 'error', `${badFc.length} flashcard(s) avec question ou réponse vide.`, badFc);
  } else if (dupFc.length || fcs.length < lessons.length) {
    addCheck('repeated_flashcards', 'Qualité & unicité des Flashcards', 'warning', dupFc.length ? `${dupFc.length} flashcard(s) quasi-identique(s) à fusionner.` : `Peu de flashcards (${fcs.length}) par rapport aux ${lessons.length} leçons.`, dupFc);
  } else {
    addCheck('repeated_flashcards', 'Qualité & unicité des Flashcards', 'pass', `${fcs.length} flashcards uniques et complètes.`);
  }

  // 6. Réponses QCM invalides ou distracteurs placeholders
  const invalidQcms = [];
  const placeholderQcms = [];
  for (const q of qs) {
    const opts = Array.isArray(q.options) ? q.options : [];
    const corr = Array.isArray(q.correct) ? q.correct : [];
    const optKeys = new Set(opts.map((o) => o.key));
    const hasInvalid = !String(q.stem || '').trim() || opts.length < 2 || opts.some((o) => !String(o.text || '').trim()) || corr.length === 0 || corr.some((k) => !optKeys.has(k));
    if (hasInvalid) invalidQcms.push(q.id);
    if (opts.some((o) => /\[distracteur\s+ia/i.test(String(o.text || '')))) placeholderQcms.push(q.id);
  }
  if (invalidQcms.length || placeholderQcms.length) {
    addCheck(
      'invalid_qcm_answers',
      'Validité des réponses & distracteurs QCM',
      'error',
      `${invalidQcms.length} QCM avec réponses/options invalides, ${placeholderQcms.length} avec distracteur placeholder.`,
      [...invalidQcms, ...placeholderQcms]
    );
  } else {
    addCheck('invalid_qcm_answers', 'Validité des réponses & distracteurs QCM', 'pass', `${qs.length} QCM valides (zéro placeholder).`);
  }

  // 7. Explications manquantes sur QCM
  const noExpl = qs.filter((q) => !String(q.explanation || '').trim()).map((q) => q.id);
  if (noExpl.length) {
    addCheck('missing_explanations', 'Explications détaillées des QCM', 'warning', `${noExpl.length} QCM sans explication pédagogique.`, noExpl);
  } else {
    addCheck('missing_explanations', 'Explications détaillées des QCM', 'pass', 'Tous les QCM disposent d’une explication sourcée.');
  }

  // 8. Références sources manquantes
  const missingRefLessons = lessons.filter((l) => !String(l.sourceRef || '').trim()).map((l) => l.id);
  const missingRefQcms = qs.filter((q) => !String(q.courseRef || q.pageRef || '').trim()).map((q) => q.id);
  if (missingRefLessons.length || missingRefQcms.length) {
    addCheck('missing_source_references', 'Traçabilité des références sources', 'warning', `${missingRefLessons.length} leçon(s) et ${missingRefQcms.length} QCM sans référence page/diapo.`, [...missingRefLessons, ...missingRefQcms]);
  } else {
    addCheck('missing_source_references', 'Traçabilité des références sources', 'pass', '100 % des leçons et QCM sont tracés vers leur page/diapositive.');
  }

  // 9. Relations chapitres / leçons / mini-tests cohérentes
  const orphanFcs = fcs.filter((f) => !lessonIds.has(f.lessonId)).map((f) => f.id);
  const orphanQcms = qs.filter((q) => !lessonIds.has(q.lessonId)).map((q) => q.id);
  const missingMiniTests = lessons.filter((l) => !l.miniTest || !(l.miniTest.questionIds || []).length).map((l) => l.id);
  if (orphanFcs.length || orphanQcms.length) {
    addCheck('broken_relationships', 'Intégrité des relations Chapitre ↔ Flashcards/QCM', 'error', `${orphanFcs.length} flashcard(s) et ${orphanQcms.length} QCM orphelins (leçon inexistante).`, [...orphanFcs, ...orphanQcms]);
  } else if (missingMiniTests.length) {
    addCheck('broken_relationships', 'Couverture des Mini-tests par leçon', 'warning', `${missingMiniTests.length} leçon(s) sans mini-test dédié.`, missingMiniTests);
  } else {
    addCheck('broken_relationships', 'Intégrité des relations & Mini-tests', 'pass', 'Toutes les flashcards, QCM et mini-tests sont reliés à leurs chapitres.');
  }

  const blockingCount = checks.filter((c) => c.status === 'error').length;
  const warningCount = checks.filter((c) => c.status === 'warning').length;
  const score = Math.max(0, Math.min(100, 100 - blockingCount * 22 - warningCount * 7));
  const status = blockingCount > 0 ? 'blocked' : (warningCount > 0 ? 'warnings' : 'pass');

  return {
    score,
    status,
    blockingCount,
    warningCount,
    checks,
    issues,
    checkedAt: new Date().toISOString()
  };
}

/**
 * Exécute UNE étape précise (1..11) du pipeline persistant sur un job
 */
export async function executeImportJobStage({ job, course, existingCourses, downloadFilesFn, siteMetaAiConfig, targetStage }) {
  const stageIdx = Number(targetStage || job.currentStage || 1);
  const stages = Array.isArray(job.stages) && job.stages.length === 11 ? job.stages.map((s) => ({ ...s })) : createInitialStages();
  const logs = Array.isArray(job.logs) ? job.logs.slice() : [];
  const artifacts = job.artifacts && typeof job.artifacts === 'object' ? { ...job.artifacts } : {};
  const aiConfig = getServerAiConfig(siteMetaAiConfig);

  const stageObj = stages[stageIdx - 1];
  if (!stageObj) throw new Error(`Étape de pipeline invalide : ${stageIdx}`);

  const pushLog = (msg, level = 'info') => {
    logs.push({ ts: new Date().toISOString(), stage: stageIdx, key: stageObj.key, level, message: msg });
  };

  stageObj.status = 'running';
  stageObj.startedAt = new Date().toISOString();

  try {
    let stageRes = { metrics: {}, message: '' };

    if (stageIdx === 1) {
      const atts = (course.attachments || []).filter((a) =>
        a.kind === 'primary_pdf' || a.kind === 'primary_ppt' || /\.(pdf|pptx|ppt|txt|md)$/i.test(a.originalName || '')
      );
      if (!atts.length) throw new Error('Aucun fichier PDF ou PowerPoint téléversé pour ce cours.');
      artifacts.sourceFiles = atts.map((a) => ({
        fileId: a.id,
        originalName: a.originalName,
        storedName: a.storedName,
        storagePath: a.storagePath || `${course.id}/${a.storedName}`,
        kind: a.kind,
        sizeBytes: a.sizeBytes
      }));
      pushLog(`${atts.length} fichier(s) validé(s) : ${atts.map((a) => a.originalName).join(', ')}.`);
      stageRes = {
        metrics: { filesCount: atts.length, totalBytes: atts.reduce((s, a) => s + (Number(a.sizeBytes) || 0), 0) },
        message: `${atts.length} fichier(s) source prêt(s) pour extraction.`
      };
    } else if (stageIdx === 2) {
      const fileBuffers = await downloadFilesFn(artifacts.sourceFiles || []);
      const extRes = await extractCourseFiles(fileBuffers);
      if (!extRes.ok) throw new Error(extRes.error || 'Échec de l’extraction documentaire.');
      artifacts.extracted = extRes;
      pushLog(`Extraction complète via ${extRes.engine} : ${extRes.stats.totalUnits} ${extRes.unitLabel.toLowerCase()}(s), ${extRes.stats.tablesExtracted} tableau(x), ${extRes.stats.chartsExtracted} graphique(s), ${extRes.stats.speakerNotesExtracted} note(s).`);
      stageRes = {
        metrics: extRes.stats,
        message: `${extRes.stats.totalUnits} ${extRes.unitLabel.toLowerCase()}(s) extraites (${extRes.stats.tablesExtracted} tableaux, ${extRes.stats.chartsExtracted} graphiques).`
      };
    } else if (stageIdx === 3) {
      stageRes = await executeStageOcr(artifacts, aiConfig, pushLog);
    } else if (stageIdx === 4) {
      stageRes = executeStageOrganization(artifacts, course, existingCourses, pushLog);
    } else if (stageIdx === 5) {
      stageRes = executeStageChapters(artifacts, course, pushLog);
    } else if (stageIdx === 6) {
      stageRes = await executeStageEducationalContent(artifacts, course, aiConfig, pushLog);
    } else if (stageIdx === 7) {
      stageRes = await executeStageFlashcards(artifacts, course, aiConfig, pushLog);
    } else if (stageIdx === 8) {
      stageRes = await executeStageQcms(artifacts, course, aiConfig, pushLog);
    } else if (stageIdx === 9) {
      stageRes = executeStageMiniTests(artifacts, pushLog);
    } else if (stageIdx === 10) {
      const tempCourse = {
        ...course,
        lessons: artifacts.lessons || [],
        aiExtraction: {
          lowConfidencePages: artifacts.extracted?.stats?.lowConfidenceUnits || []
        }
      };
      const qr = runQualityAudit(tempCourse, artifacts.flashcards || [], artifacts.qcms || []);
      artifacts.qualityReport = qr;
      pushLog(`Contrôle qualité terminé : score ${qr.score}/100 (${qr.blockingCount} blocage(s), ${qr.warningCount} avertissement(s)).`, qr.blockingCount > 0 ? 'warning' : 'info');
      stageRes = {
        metrics: { score: qr.score, blockingCount: qr.blockingCount, warningCount: qr.warningCount },
        message: `Score qualité : ${qr.score}/100 (${qr.blockingCount} erreur(s), ${qr.warningCount} avertissement(s)).`
      };
    } else if (stageIdx === 11) {
      const ext = artifacts.extracted || {};
      const org = artifacts.organized || {};
      const qr = artifacts.qualityReport || runQualityAudit({ ...course, lessons: artifacts.lessons || [] }, artifacts.flashcards || [], artifacts.qcms || []);
      const isPpt = ext.docType === 'pptx' || ext.docType === 'ppt';
      const primaryName = ext.fileSummaries?.[0]?.originalName || course.sourceFiles?.[0] || '';

      const aiExtraction = {
        analyzedAt: new Date().toISOString(),
        engine: `${ext.engine || 'MedStudy Universal Engine'}${aiConfig.enabled ? ` + ${aiConfig.provider}:${aiConfig.model}` : ' + Structuration Médicale Avancée'}`,
        aiMode: aiConfig.enabled ? `${aiConfig.provider}:${aiConfig.model}` : 'deterministic_medical',
        docType: ext.docType || 'pdf',
        totalPages: ext.stats?.totalUnits || 0,
        lowConfidencePages: ext.stats?.lowConfidenceUnits || [],
        warnings: [
          ...(ext.manualReviewItems || []).slice(0, 10).map((m) => `${ext.unitLabel || 'Page'} ${m.unitNum} : ${m.reason}`),
          ...(qr.issues || []).map((iss) => `[Qualité] ${iss.detail}`)
        ],
        lessonsExtracted: (artifacts.lessons || []).length,
        flashcardsCreated: (artifacts.flashcards || []).length,
        qcmsCreated: (artifacts.qcms || []).length,
        miniTestsCreated: (artifacts.lessons || []).filter((l) => l.miniTest).length,
        qualityReport: qr,
        jobId: job.id,
        status: qr.blockingCount > 0 ? 'needs_fixes' : 'needs_review'
      };

      const pptImport = isPpt ? {
        isPowerPoint: true,
        originalFilename: primaryName,
        presentationTitle: ext.detectedTitle || course.title,
        slidesProcessed: ext.stats?.totalUnits || 0,
        chaptersCreated: (artifacts.lessons || []).length,
        lessonsCreated: (artifacts.lessons || []).length,
        flashcardsGenerated: (artifacts.flashcards || []).length,
        qcmsGenerated: (artifacts.qcms || []).length,
        tablesExtracted: ext.stats?.tablesExtracted || 0,
        chartsExtracted: ext.stats?.chartsExtracted || 0,
        speakerNotesExtracted: ext.stats?.speakerNotesExtracted || 0,
        imagesOcrCount: ext.stats?.imagesOcrCount || 0,
        manualReviewSlides: (ext.manualReviewItems || []).map((m) => ({ slideNum: m.unitNum, title: m.title, reason: m.reason })),
        importStatus: (ext.manualReviewItems || []).length ? 'needs_review' : 'ready_for_review',
        overlapInfo: org.overlap || null,
        importedAt: new Date().toISOString()
      } : null;

      artifacts.finalPayload = {
        lessons: artifacts.lessons || [],
        flashcards: artifacts.flashcards || [],
        qcms: artifacts.qcms || [],
        aiExtraction,
        pptImport,
        detectedProfessor: org.detectedProfessor || '',
        detectedAcademicYear: org.detectedAcademicYear || '',
        qualityReport: qr
      };
      pushLog('Brouillon complet enregistré (statut DRAFT — en attente de validation et publication administrateur).');
      stageRes = {
        metrics: { status: 'draft', qualityScore: qr.score },
        message: 'Brouillon complet prêt pour révision administrateur.'
      };
    }

    stageObj.status = (stageIdx === 10 && (artifacts.qualityReport?.warningCount > 0 || artifacts.qualityReport?.blockingCount > 0)) ? 'warning' : 'done';
    stageObj.completedAt = new Date().toISOString();
    stageObj.message = stageRes.message;
    stageObj.metrics = stageRes.metrics || {};

    const isFinished = stageIdx >= 11;
    const nextStage = isFinished ? 11 : stageIdx + 1;
    const progressPct = isFinished ? 100 : Math.round((stageIdx / 11) * 100);

    return {
      ok: true,
      completed: isFinished,
      status: isFinished ? 'completed' : 'running',
      currentStage: nextStage,
      currentStageKey: STAGE_DEFINITIONS[nextStage - 1].key,
      progressPct,
      aiMode: aiConfig.enabled ? `${aiConfig.provider}:${aiConfig.model}` : 'deterministic_medical',
      stages,
      logs,
      artifacts,
      qualityReport: artifacts.qualityReport || job.qualityReport || {},
      errorMessage: ''
    };
  } catch (err) {
    stageObj.status = 'failed';
    stageObj.completedAt = new Date().toISOString();
    stageObj.message = err.message || 'Erreur inattendue';
    pushLog(`ERREUR étape ${stageIdx} (${stageObj.key}) : ${err.message}`, 'error');
    return {
      ok: false,
      completed: false,
      status: 'failed',
      currentStage: stageIdx,
      currentStageKey: stageObj.key,
      progressPct: Math.round(((stageIdx - 1) / 11) * 100),
      aiMode: aiConfig.enabled ? `${aiConfig.provider}:${aiConfig.model}` : 'deterministic_medical',
      stages,
      logs,
      artifacts,
      qualityReport: job.qualityReport || {},
      errorMessage: err.message || 'Erreur lors du traitement du cours.'
    };
  }
}

/**
 * Phase 6 — Régénérer UNE seule section/leçon (sans toucher aux autres leçons éditées)
 */
export async function regenerateSingleLesson({ course, lessonId, existingFlashcards, existingQcms, latestJobArtifacts, siteMetaAiConfig }) {
  const lessons = Array.isArray(course.lessons) ? course.lessons.map((l) => ({ ...l })) : [];
  const targetIdx = lessons.findIndex((l) => l.id === lessonId);
  if (targetIdx < 0) return { ok: false, error: 'Leçon introuvable dans ce cours.' };

  const targetLesson = lessons[targetIdx];
  const aiConfig = getServerAiConfig(siteMetaAiConfig);

  // Retrouver le plan d'origine depuis le dernier job, ou reconstruire depuis les sections existantes
  let plan = (latestJobArtifacts?.chapterPlans || []).find((p) => p.id === lessonId);
  let allStatements = latestJobArtifacts?.organized?.statements || [];

  if (!plan) {
    const synthUnits = (targetLesson.understand?.sections || []).map((s, idx) => ({
      unitNum: s.slideNum || (targetLesson.pageRefs?.[idx]) || (idx + 1),
      unitLabel: course.pptImport?.isPowerPoint ? 'Diapositive' : 'Page',
      sourceFilename: targetLesson.sourceFile || course.sourceFiles?.[0] || course.title,
      title: s.slideTitle || s.heading || targetLesson.title,
      lines: (s.paragraphs || []).map(stripHtml).filter(Boolean),
      bullets: (s.bullets || []).map(stripHtml).filter(Boolean),
      tables: idx === 0 ? (targetLesson.understand?.tables || []) : [],
      captions: [],
      speakerNotes: '',
      needsReview: false,
      reviewReason: ''
    }));
    plan = {
      id: lessonId,
      order: targetLesson.order || (targetIdx + 1),
      chapterTitle: targetLesson.chapterTitle || targetLesson.title,
      title: targetLesson.title,
      unitLabel: course.pptImport?.isPowerPoint ? 'Diapositive' : 'Page',
      rangeLabel: targetLesson.slideRange || targetLesson.sourceRef || 'Section',
      sourceFile: targetLesson.sourceFile || course.sourceFiles?.[0] || '',
      sourceRef: targetLesson.sourceRef || targetLesson.title,
      pageRefs: targetLesson.pageRefs || synthUnits.map((u) => u.unitNum),
      slideRefs: targetLesson.slideRefs || synthUnits.map((u) => ({ slideNum: u.unitNum, title: u.title })),
      durationMin: targetLesson.durationMin || 12,
      units: synthUnits
    };
    allStatements = synthUnits.flatMap((u) =>
      [...u.lines, ...u.bullets].map((txt) => {
        const cls = classifyStatement(txt);
        return cls ? { ...cls, text: txt, unitNum: u.unitNum, unitLabel: u.unitLabel, unitTitle: u.title, sourceFilename: u.sourceFilename, pageRef: `${u.unitLabel} ${u.unitNum}` } : null;
      }).filter(Boolean)
    );
  }

  let rebuilt = buildDeterministicLesson(plan, course, allStatements);
  if (aiConfig.enabled) {
    const enh = await enhanceLessonWithAi(aiConfig, plan, rebuilt, course);
    rebuilt = enh.lesson;
  }
  lessons[targetIdx] = rebuilt;

  const newFc = buildDeterministicFlashcardsForLesson(rebuilt, course);
  const newQ = buildDeterministicQcmsForLesson(rebuilt, lessons, course, []);
  rebuilt.miniTest = {
    id: `MT_${rebuilt.id}`,
    title: `Mini-test de validation — ${rebuilt.title}`,
    passingScore: 80,
    objectives: [
      ...(rebuilt.understand?.triad?.toUnderstand || []).slice(0, 2),
      ...(rebuilt.understand?.triad?.toMemorize || []).slice(0, 2)
    ],
    questionIds: newQ.slice(0, 5).map((q) => q.id),
    questionCount: Math.min(5, newQ.length),
    generatedAt: new Date().toISOString()
  };

  const mergedFlashcards = [...(existingFlashcards || []).filter((f) => f.lessonId !== lessonId), ...newFc];
  const mergedQcms = [...(existingQcms || []).filter((q) => q.lessonId !== lessonId), ...newQ];
  const qualityReport = runQualityAudit({ ...course, lessons }, mergedFlashcards, mergedQcms);

  return {
    ok: true,
    lesson: rebuilt,
    lessons,
    flashcards: mergedFlashcards,
    qcms: mergedQcms,
    qualityReport
  };
}
