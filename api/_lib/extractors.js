/* ==========================================================================
   MedStudy Production — Extracteurs Cloud PDF, PPTX et PPT (Node.js Linux/Vercel)
   100 % agnostique de la matière · Traçabilité page/diapo · Détection chevauchement
   ========================================================================== */
import JSZip from 'jszip';

function decodeXmlEntities(str) {
  return String(str || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function normalizeZipPath(baseDir, relTarget) {
  const clean = String(relTarget || '').replace(/\\/g, '/');
  if (clean.startsWith('/')) return clean.replace(/^\/+/, '');
  const parts = baseDir.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  for (const seg of clean.split('/')) {
    if (seg === '..') parts.pop();
    else if (seg && seg !== '.') parts.push(seg);
  }
  return parts.join('/');
}

function normalizeTokens(text) {
  const ascii = String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ');
  const stop = new Set(['de', 'du', 'des', 'la', 'le', 'les', 'et', 'en', 'au', 'aux', 'un', 'une', 'sur', 'pour', 'par', 'avec', 'dans', 'cours', 'pptx', 'pdf', 'ppt', 'ppsx']);
  return Array.from(new Set(ascii.split(/\s+/).filter((w) => w.length >= 3 && !stop.has(w))));
}

export function validateFileMagicBytes(buffer, ext) {
  if (!buffer || buffer.length < 8) return { ok: false, error: 'Fichier vide ou tronqué.' };
  const e = String(ext || '').toLowerCase();
  if (e === '.pdf') {
    if (buffer[0] !== 0x25 || buffer[1] !== 0x50 || buffer[2] !== 0x44 || buffer[3] !== 0x46 || buffer[4] !== 0x2D) {
      return { ok: false, error: 'Signature binaire PDF invalide (%PDF- manquant).' };
    }
    return { ok: true };
  }
  if (e === '.pptx') {
    if (buffer[0] !== 0x50 || buffer[1] !== 0x4B || buffer[2] !== 0x03 || buffer[3] !== 0x04) {
      return { ok: false, error: 'Signature binaire .pptx invalide (archive OpenXML attendue).' };
    }
    return { ok: true };
  }
  if (e === '.ppt') {
    const sig = [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1];
    for (let i = 0; i < 8; i++) {
      if (buffer[i] !== sig[i]) return { ok: false, error: 'Signature binaire .ppt invalide (OLE2 attendu).' };
    }
    return { ok: true };
  }
  return { ok: true };
}

export function detectCourseOverlap(existingCourses, sourceFilename, presentationTitle) {
  const fnLow = String(sourceFilename || '').toLowerCase().trim();
  const baseLow = fnLow.replace(/\.(pptx|ppt|pdf)$/i, '').replace(/\.ppsx$/i, '').trim();
  const pptTokens = normalizeTokens(`${sourceFilename} ${presentationTitle}`);

  // Passe 1 : correspondance fichier exacte / homologue
  for (const c of existingCourses || []) {
    if (c.pptImport && c.pptImport.originalFilename && c.pptImport.originalFilename.toLowerCase() === fnLow) continue;
    for (const sf of (c.sourceFiles || [])) {
      const sLow = String(sf || '').toLowerCase();
      if (sLow.includes(fnLow) || (baseLow.length >= 6 && sLow.includes(baseLow))) {
        return {
          hasOverlap: true,
          matchedCourseId: c.id,
          matchedCourseCode: c.code,
          matchedCourseTitle: c.title,
          overlapType: sLow.includes(fnLow) ? 'exact_source' : 'pdf_counterpart',
          reason: `Support déjà référencé dans le cours existant ${c.code} (« ${c.title} »). Vous pouvez fusionner ou conserver séparé.`,
          resolution: 'pending'
        };
      }
    }
  }

  // Passe 2 : chevauchement thématique
  for (const c of existingCourses || []) {
    if (c.pptImport && c.pptImport.originalFilename && c.pptImport.originalFilename.toLowerCase() === fnLow) continue;
    const cTokens = normalizeTokens(`${c.title} ${c.shortTitle || ''}`);
    if (pptTokens.length >= 2 && cTokens.length >= 2) {
      const inter = pptTokens.filter((t) => cTokens.includes(t)).length;
      if (inter >= 2 && inter / Math.min(pptTokens.length, cTokens.length) >= 0.5) {
        return {
          hasOverlap: true,
          matchedCourseId: c.id,
          matchedCourseCode: c.code,
          matchedCourseTitle: c.title,
          overlapType: 'topic_overlap',
          reason: `Chevauchement thématique détecté avec ${c.code} (« ${c.title} »).`,
          resolution: 'pending'
        };
      }
    }
  }

  return { hasOverlap: false, matchedCourseId: '', matchedCourseCode: '', matchedCourseTitle: '', overlapType: 'none', reason: '', resolution: 'none' };
}

function extractXmlTextRuns(xmlFragment) {
  const out = [];
  const pMatches = xmlFragment.match(/<a:p\b[\s\S]*?<\/a:p>/g) || [];
  for (const p of pMatches) {
    const texts = [];
    const tRegex = /<a:t[^>]*>([\s\S]*?)<\/a:t>/g;
    let m;
    while ((m = tRegex.exec(p)) !== null) {
      texts.push(decodeXmlEntities(m[1]));
    }
    const line = texts.join('').replace(/\s+/g, ' ').trim();
    if (line) {
      const isBullet = /<a:buChar|<a:buAutoNum|lvl="[1-9]"/.test(p) || /^[\-•*▪◦►]/.test(line);
      out.push({ text: line, isBullet });
    }
  }
  return out;
}

function extractTablesFromSlideXml(slideXml, slideNum, slideTitle) {
  const tables = [];
  const tblMatches = slideXml.match(/<a:tbl\b[\s\S]*?<\/a:tbl>/g) || [];
  tblMatches.forEach((tblXml, idx) => {
    const trMatches = tblXml.match(/<a:tr\b[\s\S]*?<\/a:tr>/g) || [];
    const rows = trMatches.map((tr) => {
      const tcMatches = tr.match(/<a:tc\b[\s\S]*?<\/a:tc>/g) || [];
      return tcMatches.map((tc) => extractXmlTextRuns(tc).map((r) => r.text).join(' / '));
    }).filter((r) => r.some(Boolean));

    if (rows.length >= 2) {
      tables.push({
        title: `${slideTitle || 'Tableau'} — Tableau ${idx + 1} (Diapositive ${slideNum})`,
        slideNum,
        isChart: false,
        headers: rows[0],
        rows: rows.slice(1)
      });
    }
  });
  return tables;
}

function extractChartFromXml(chartXml, slideNum) {
  const titleRuns = (chartXml.match(/<c:title>[\s\S]*?<\/c:title>/) || [''])[0];
  const titleTxt = extractXmlTextRuns(titleRuns).map((r) => r.text).join(' ').trim() || `Graphique (Diapositive ${slideNum})`;
  const serMatches = chartXml.match(/<c:ser>[\s\S]*?<\/c:ser>/g) || [];
  if (!serMatches.length) return null;

  const categories = [];
  const seriesList = [];
  serMatches.forEach((ser, idx) => {
    const nameMatch = ser.match(/<c:tx>[\s\S]*?<c:v>([\s\S]*?)<\/c:v>/);
    const name = nameMatch ? decodeXmlEntities(nameMatch[1]).trim() : `Série ${idx + 1}`;
    if (categories.length === 0) {
      const catBlock = (ser.match(/<c:cat>[\s\S]*?<\/c:cat>/) || [''])[0];
      const vReg = /<c:v>([\s\S]*?)<\/c:v>/g;
      let m;
      while ((m = vReg.exec(catBlock)) !== null) categories.push(decodeXmlEntities(m[1]).trim());
    }
    const valBlock = (ser.match(/<c:val>[\s\S]*?<\/c:val>/) || [''])[0];
    const vals = [];
    const vReg = /<c:v>([\s\S]*?)<\/c:v>/g;
    let m;
    while ((m = vReg.exec(valBlock)) !== null) vals.push(decodeXmlEntities(m[1]).trim());
    seriesList.push({ name, values: vals });
  });

  const rowCount = Math.max(categories.length, seriesList[0]?.values.length || 0);
  if (!rowCount) return null;
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    rows.push([
      categories[i] || `Point ${i + 1}`,
      ...seriesList.map((s) => s.values[i] ?? '—')
    ]);
  }
  return {
    title: `${titleTxt} (Diapositive ${slideNum})`,
    slideNum,
    isChart: true,
    headers: ['Catégorie / Axe', ...seriesList.map((s) => s.name)],
    rows
  };
}

export async function analyzePptxBuffer(buffer, course, sourceFilename, existingCourses) {
  const zip = await JSZip.loadAsync(buffer);
  const presXml = await zip.file('ppt/presentation.xml')?.async('string');
  const relsXml = await zip.file('ppt/_rels/presentation.xml.rels')?.async('string');
  if (!presXml || !relsXml) {
    return { ok: false, error: `Structure .pptx invalide dans ${sourceFilename}.` };
  }

  let presTitle = '';
  const coreXml = await zip.file('docProps/core.xml')?.async('string');
  if (coreXml) {
    const tm = coreXml.match(/<dc:title[^>]*>([\s\S]*?)<\/dc:title>/);
    if (tm) {
      const cand = decodeXmlEntities(tm[1]).replace(/\s+/g, ' ').trim();
      if (cand.length >= 4 && !/(pptxgenjs|pr[eé]sentation\s*powerpoint|^diapositive|^presentation|^powerpoint|^microsoft|^untitled|^slide\s*\d*$)/i.test(cand)) {
        presTitle = cand;
      }
    }
  }

  const relMap = {};
  const relReg = /<Relationship\b[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"[^>]*\/?>/g;
  let rm;
  while ((rm = relReg.exec(relsXml)) !== null) relMap[rm[1]] = rm[2];

  const slideIds = [];
  const sldReg = /<p:sldId\b[^>]*r:id="([^"]+)"[^>]*\/?>/g;
  let sm;
  while ((sm = sldReg.exec(presXml)) !== null) slideIds.push(sm[1]);

  const slides = [];
  const manualReviewSlides = [];
  let tablesExtracted = 0;
  let chartsExtracted = 0;
  let speakerNotesExtracted = 0;

  for (let i = 0; i < slideIds.length; i++) {
    const slideNum = i + 1;
    const target = relMap[slideIds[i]];
    if (!target) continue;
    const slidePath = normalizeZipPath('ppt', target);
    const slideXml = await zip.file(slidePath)?.async('string');
    if (!slideXml) continue;

    let slideTitle = '';
    const lines = [];
    const bullets = [];
    const issues = [];

    const spMatches = slideXml.match(/<p:sp\b[\s\S]*?<\/p:sp>/g) || [];
    for (const sp of spMatches) {
      const phMatch = sp.match(/<p:ph\b[^>]*type="([^"]+)"/);
      const phType = phMatch ? phMatch[1] : '';
      if (['sldNum', 'ftr', 'dt'].includes(phType)) continue;
      const runs = extractXmlTextRuns(sp).filter((r) => !(phType !== 'title' && /^\d{1,3}$/.test(r.text)));
      if (!runs.length) continue;
      if ((phType === 'title' || phType === 'ctrTitle') && !slideTitle) {
        slideTitle = runs.map((r) => r.text).join(' — ');
      } else {
        for (const r of runs) {
          if (r.isBullet) bullets.push(r.text.replace(/^[\-•*▪◦►]+\s*/, '').trim());
          else lines.push(r.text);
        }
      }
    }

    if (!slideTitle && lines.length > 0) {
      slideTitle = lines[0].length <= 130 ? lines.shift() : `${lines[0].slice(0, 95)}…`;
    }
    const tables = extractTablesFromSlideXml(slideXml, slideNum, slideTitle);
    tablesExtracted += tables.length;

    // Relations de la diapositive (charts, notes, media images)
    const fileName = slidePath.split('/').pop();
    const sRelsXml = await zip.file(`ppt/slides/_rels/${fileName}.rels`)?.async('string');
    let speakerNotes = '';
    let hasMedia = false;

    if (sRelsXml) {
      const sRelReg = /<Relationship\b[^>]*Type="([^"]+)"[^>]*Target="([^"]+)"[^>]*\/?>/g;
      let srm;
      while ((srm = sRelReg.exec(sRelsXml)) !== null) {
        const [, rType, rTarget] = srm;
        if (!rTarget || rTarget.startsWith('http')) continue;
        const resolved = normalizeZipPath('ppt/slides', rTarget);

        if (rType.endsWith('/chart') || resolved.startsWith('ppt/charts/')) {
          const chXml = await zip.file(resolved)?.async('string');
          if (chXml) {
            const chTbl = extractChartFromXml(chXml, slideNum);
            if (chTbl) { tables.push(chTbl); chartsExtracted++; }
            else issues.push('Graphique détecté mais séries non lisibles — vérification visuelle recommandée.');
          }
        } else if (rType.endsWith('/notesSlide') || resolved.startsWith('ppt/notesSlides/')) {
          const nXml = await zip.file(resolved)?.async('string');
          if (nXml) {
            const noteParts = [];
            for (const nsp of (nXml.match(/<p:sp\b[\s\S]*?<\/p:sp>/g) || [])) {
              if (/type="sldNum"/.test(nsp)) continue;
              for (const r of extractXmlTextRuns(nsp)) {
                if (r.text.length >= 4 && !/^\d+$/.test(r.text)) noteParts.push(r.text);
              }
            }
            if (noteParts.length) {
              speakerNotes = noteParts.join(' ');
              speakerNotesExtracted++;
            }
          }
        } else if (rType.endsWith('/image') || resolved.startsWith('ppt/media/')) {
          hasMedia = true;
        }
      }
    }

    const wordCount = `${slideTitle} ${lines.join(' ')} ${bullets.join(' ')}`.split(/\s+/).filter((w) => w.length >= 2).length;
    if (wordCount < 10 && hasMedia) {
      issues.push('Diapositive à contenu visuel/image prédominant — vérification manuelle recommandée en mode cloud.');
    } else if (wordCount < 3 && tables.length === 0 && !speakerNotes) {
      issues.push('Diapositive vide ou purement graphique — à vérifier manuellement.');
    }

    if (issues.length > 0) {
      manualReviewSlides.push({ slideNum, title: slideTitle || `Diapositive ${slideNum}`, reason: issues.join(' ; ') });
    }
    if (slideNum === 1 && !presTitle) {
      presTitle = (slideTitle || sourceFilename.replace(/\.(pptx|ppt)$/i, '')).slice(0, 105);
    }

    slides.push({
      slideNum,
      title: slideTitle || `Diapositive ${slideNum}`,
      lines,
      bullets,
      tables,
      speakerNotes,
      needsReview: issues.length > 0,
      reviewReason: issues.join(' ; ')
    });
  }

  const overlap = detectCourseOverlap(existingCourses, sourceFilename, presTitle);
  return buildStructuredFromPagesOrSlides({
    course,
    sourceFilename,
    title: presTitle || sourceFilename.replace(/\.(pptx|ppt)$/i, ''),
    items: slides,
    unitLabel: 'Diapositive',
    isPowerPoint: true,
    tablesExtracted,
    chartsExtracted,
    speakerNotesExtracted,
    manualReviewSlides,
    overlap,
    engine: 'Vercel Cloud OpenXML PPTX Extractor (Node.js)'
  });
}

export async function analyzePdfBuffer(buffer, course, sourceFilename) {
  const { default: pdfParse } = await import('pdf-parse/lib/pdf-parse.js');
  const pages = [];
  const manualReviewSlides = [];
  let pageCounter = 0;

  await pdfParse(buffer, {
    pagerender: async (pageData) => {
      pageCounter++;
      const textContent = await pageData.getTextContent();
      const rawLines = [];
      let cur = '';
      for (const item of textContent.items) {
        cur += item.str + (item.hasEOL ? '\n' : ' ');
      }
      cur.split('\n').forEach((l) => {
        const clean = l.replace(/\s+/g, ' ').trim();
        if (clean.length >= 2) rawLines.push(clean);
      });
      const wc = rawLines.join(' ').split(/\s+/).filter((w) => w.length >= 2).length;
      const isLow = wc < 12;
      if (isLow) {
        manualReviewSlides.push({
          slideNum: pageCounter,
          title: `Page ${pageCounter}`,
          reason: `Peu de texte extractible (${wc} mots — PDF scanné ou schéma). Vérification manuelle recommandée.`
        });
      }
      pages.push({
        slideNum: pageCounter,
        title: rawLines[0] ? rawLines[0].slice(0, 95) : `Page ${pageCounter}`,
        lines: rawLines.slice(1),
        bullets: [],
        tables: [],
        speakerNotes: '',
        needsReview: isLow,
        reviewReason: isLow ? 'Page scannée ou peu de texte' : ''
      });
      return cur;
    }
  });

  if (!pages.length) {
    return { ok: false, error: 'Impossible d’extraire les pages de ce PDF (fichier scanné ou protégé).' };
  }

  return buildStructuredFromPagesOrSlides({
    course,
    sourceFilename,
    title: course.title,
    items: pages,
    unitLabel: 'Page',
    isPowerPoint: false,
    tablesExtracted: 0,
    chartsExtracted: 0,
    speakerNotesExtracted: 0,
    manualReviewSlides,
    overlap: null,
    engine: 'Vercel Cloud PDF Extractor (pdf-parse)'
  });
}

function buildStructuredFromPagesOrSlides({
  course, sourceFilename, title, items, unitLabel, isPowerPoint,
  tablesExtracted, chartsExtracted, speakerNotesExtracted, manualReviewSlides, overlap, engine
}) {
  const n = items.length;
  const targetLessons = n <= 8 ? 2 : (n <= 18 ? 3 : (n <= 28 ? 4 : 6));
  const chunkSize = Math.max(2, Math.ceil(n / targetLessons));

  const lessons = [];
  const flashcards = [];
  const qcms = [];

  for (let start = 0; start < n; start += chunkSize) {
    const group = items.slice(start, start + chunkSize);
    const lIdx = lessons.length + 1;
    const lid = `${course.id}_L${lIdx}`;
    const first = group[0].slideNum;
    const last = group[group.length - 1].slideNum;
    const rangeLbl = first === last ? `${unitLabel} ${first}` : `${unitLabel}s ${first}–${last}`;
    const lessonTitle = (group[0].title && group[0].title.length >= 4) ? group[0].title : `Section ${lIdx} (${rangeLbl})`;

    const sections = [];
    const tables = [];
    const memorize = [];

    for (const s of group) {
      const paras = [...(s.lines || [])];
      if (s.speakerNotes) paras.push(`<em>[Note présentateur — ${unitLabel} ${s.slideNum}] :</em> ${s.speakerNotes}`);
      sections.push({
        heading: `${unitLabel} ${s.slideNum} — ${s.title}`,
        slideNum: s.slideNum,
        slideTitle: s.title,
        paragraphs: paras,
        bullets: s.bullets || []
      });
      (s.tables || []).forEach((t) => tables.push(t));

      const allText = [...(s.lines || []), ...(s.bullets || [])];
      for (const line of allText) {
        if (memorize.length >= 6 || line.length < 18) continue;
        if (/([=≥≤<>]|%|est un|est une|désigne|définition|article\s+\d+|classification)/i.test(line)) {
          memorize.push({
            id: `M_${lid}_${memorize.length + 1}`,
            category: /([=≥≤<>]|%)/.test(line) ? 'Formule / Valeur clé' : 'Définition / Notion clé',
            title: `${s.title} (${unitLabel} ${s.slideNum})`,
            content: line,
            pageRef: `${unitLabel} ${s.slideNum}`,
            slideNum: s.slideNum,
            slideTitle: s.title,
            sourceFile: sourceFilename,
            highlight: memorize.length < 3
          });
        }
      }
    }

    if (memorize.length < 2) {
      for (const s of group) {
        const cand = (s.lines && s.lines[0]) || (s.bullets && s.bullets[0]) || s.title;
        if (cand && cand.length >= 12 && memorize.length < 3) {
          memorize.push({
            id: `M_${lid}_${memorize.length + 1}`,
            category: 'Concept clé',
            title: `${s.title} (${unitLabel} ${s.slideNum})`,
            content: cand,
            pageRef: `${unitLabel} ${s.slideNum}`,
            slideNum: s.slideNum,
            slideTitle: s.title,
            sourceFile: sourceFilename,
            highlight: memorize.length === 0
          });
        }
      }
    }

    const flagged = group.filter((g) => g.needsReview);
    lessons.push({
      id: lid,
      courseId: course.id,
      order: lIdx,
      chapterTitle: lessonTitle,
      title: lessonTitle,
      durationMin: Math.max(8, Math.min(20, group.length * 3)),
      sourceFile: sourceFilename,
      sourceRef: `${sourceFilename} · ${rangeLbl}`,
      slideRange: rangeLbl,
      slideRefs: group.map((g) => ({ slideNum: g.slideNum, title: g.title })),
      pageRefs: group.map((g) => g.slideNum),
      bmCount: 0,
      bmRefs: [],
      priority: course.priority || 'medium',
      priorityScore: 55,
      bmWarning: '',
      revisionVersion: 1,
      majorUpdateNote: '',
      needsReview: true,
      hasManualFlags: flagged.length > 0,
      extractionNote: flagged.length
        ? `Relecture manuelle recommandée (${flagged.map((f) => `${unitLabel} ${f.slideNum}`).join(', ')}).`
        : `Brouillon extrait depuis ${sourceFilename} (${rangeLbl}) — à relire avant publication.`,
      understand: {
        intro: `Contenu extrait automatiquement depuis « ${sourceFilename} » (${rangeLbl}). Relisez et validez avant publication.`,
        sections,
        tables,
        darija: '',
        triad: {
          toUnderstand: group.slice(0, 3).map((g) => `${unitLabel} ${g.slideNum} : ${g.title}`),
          toMemorize: memorize.slice(0, 3).map((m) => `${m.title} (${m.pageRef})`),
          toRecognizeInQcm: [`Terminologie exacte et valeurs clés de ${sourceFilename} (${rangeLbl}).`]
        }
      },
      memorize
    });

    memorize.slice(0, 3).forEach((m, fi) => {
      flashcards.push({
        id: `FC_${lid}_${fi + 1}`,
        courseId: course.id,
        lessonId: lid,
        type: /Formule/.test(m.category) ? 'formula' : 'definition',
        question: `D’après ${m.pageRef} (« ${m.slideTitle} »), que faut-il retenir sur : ${m.title} ?`,
        answer: m.content,
        hint: `Source : ${sourceFilename} · ${m.pageRef}`,
        pageRef: m.pageRef,
        slideNum: m.slideNum,
        slideTitle: m.slideTitle,
        sourceFile: sourceFilename,
        sourceType: 'ai_generated_practice',
        needsReview: true
      });
    });

    memorize.slice(0, 3).forEach((m, qi) => {
      qcms.push({
        id: `Q_${lid}_${qi + 1}`,
        courseId: course.id,
        lessonId: lid,
        topic: `${m.slideTitle} (${m.pageRef})`,
        sourceType: 'ai_generated_practice',
        bmRef: '',
        year: 'Entraînement IA',
        pageRef: m.pageRef,
        slideNum: m.slideNum,
        slideTitle: m.slideTitle,
        sourceFile: sourceFilename,
        multiSelect: false,
        isHard: false,
        needsReview: true,
        stem: `D’après le cours « ${title} » (${m.pageRef}), quelle affirmation est conforme au support ?`,
        options: [
          { key: 'A', text: m.content },
          { key: 'B', text: `Cette notion est exclue de ${m.pageRef} [Distracteur IA à affiner]` },
          { key: 'C', text: `L’inverse exact s’applique systématiquement [Distracteur IA à affiner]` },
          { key: 'D', text: `Aucune proposition n’est mentionnée dans ${m.pageRef}` }
        ],
        correct: ['A'],
        explanation: `Source exacte (${sourceFilename} · ${m.pageRef}) : ${m.content}`,
        wrongReasons: {
          B: `Contredit ${m.pageRef}.`,
          C: `Contredit ${m.pageRef}.`,
          D: `La réponse A reprend le contenu de ${m.pageRef}.`
        },
        courseRef: `${sourceFilename} · ${m.pageRef}`
      });
    });
  }

  const aiExtraction = {
    analyzedAt: new Date().toISOString(),
    engine,
    totalPages: n,
    lowConfidencePages: manualReviewSlides.map((s) => s.slideNum),
    warnings: manualReviewSlides.length ? [`${manualReviewSlides.length} ${unitLabel.toLowerCase()}(s) signalée(s) pour relecture manuelle.`] : [],
    lessonsExtracted: lessons.length,
    flashcardsCreated: flashcards.length,
    qcmsCreated: qcms.length,
    status: 'needs_review'
  };

  const pptImport = isPowerPoint ? {
    isPowerPoint: true,
    originalFilename: sourceFilename,
    presentationTitle: title,
    slidesProcessed: n,
    chaptersCreated: lessons.length,
    lessonsCreated: lessons.length,
    flashcardsGenerated: flashcards.length,
    qcmsGenerated: qcms.length,
    tablesExtracted,
    chartsExtracted,
    speakerNotesExtracted,
    imagesOcrCount: 0,
    manualReviewSlides,
    importStatus: manualReviewSlides.length ? 'needs_review' : 'ready_for_review',
    overlapInfo: overlap,
    importedAt: new Date().toISOString()
  } : null;

  return { ok: true, lessons, flashcards, qcms, aiExtraction, pptImport };
}
