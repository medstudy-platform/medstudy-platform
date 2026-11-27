/* ==========================================================================
   MedStudy Universal Engine — Extracteurs Complets PDF, PPTX et PPT (Node.js)
   Phase 3 : Extraction intégrale page par page / diapositive par diapositive
   (Titres, paragraphes, puces, tableaux, graphiques, SmartArt, notes, formules,
    définitions, classifications, exemples cliniques, images & drapeaux OCR)
   ========================================================================== */
import JSZip from 'jszip';

const ADMIN_NOISE_PATTERNS = [
  /^r[eé]publique\s+alg[eé]rienne/i,
  /^minist[eè]re\s+de\s+l['’]?enseignement/i,
  /^minist[eè]re\s+de\s+la\s+sant[eé]/i,
  /^universit[eé]\s+/i,
  /^facult[eé]\s+de\s+m[eé]decine/i,
  /^d[eé]partement\s+de\s+m[eé]decine/i,
  /^merci\s+(pour\s+)?votre\s+attention/i,
  /^fin\s+(du\s+cours|de\s+la\s+pr[eé]sentation)\.?$/i,
  /^(page|diapo|diapositive|slide)\s*\d+(\s*\/\s*\d+)?$/i,
  /^\d+\s*\/\s*\d+$/,
  /^\d{1,3}$/,
  /^ann[eé]e\s+universitaire\s*[:\-]?\s*\d{4}/i,
  /^https?:\/\//i,
  /^www\./i,
  /^doi\s*:/i
];

export function isAdminBoilerplate(line) {
  const t = String(line || '').trim();
  if (!t || t.length < 2) return true;
  return ADMIN_NOISE_PATTERNS.some((re) => re.test(t));
}

export function decodeXmlEntities(str) {
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

export function normalizeTokens(text) {
  const ascii = String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ');
  const stop = new Set([
    'de', 'du', 'des', 'la', 'le', 'les', 'et', 'en', 'au', 'aux', 'un', 'une',
    'sur', 'pour', 'par', 'avec', 'dans', 'cours', 'pptx', 'pdf', 'ppt', 'ppsx',
    'est', 'sont', 'qui', 'que', 'plus', 'tout', 'tous', 'cette', 'ces', 'son', 'ses'
  ]);
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

export function isHeadingCandidate(line) {
  const t = String(line || '').trim();
  if (t.length < 4 || t.length > 115) return false;
  if (isAdminBoilerplate(t)) return false;
  if (/^(CHAPITRE|PARTIE|SECTION|MODULE|UNIT[EÉ]|LE[CÇ]ON|TD\s*\d+|CAS\s+CLINIQUE)\b/i.test(t)) return true;
  if (/^([IVX]{1,4}\s*[\.\-\)]\s+\S|[1-9][0-9]?(\.[1-9][0-9]?)?\s*[\.\-\)]\s+[A-ZÉÈÊÀÂÎÔÙÇ])/.test(t)) return true;
  if (/^(INTRODUCTION|G[EÉ]N[EÉ]RALIT[EÉ]S|OBJECTIFS|D[EÉ]FINITIONS?|CLASSIFICATIONS?|[EÉ]PID[EÉ]MIOLOGIE|[EÉ]TIOLOGIE|FACTEURS?\s+DE\s+RISQUE|PHYSIOPATHOLOGIE|ANATOMOPATHOLOGIE|CLINIQUE|SIGNES?\s+CLINIQUES?|S[EÉ]MIOLOGIE|DIAGNOSTIC|EXAMENS?\s+COMPL[EÉ]MENTAIRES?|FORMES?\s+CLINIQUES?|COMPLICATIONS?|[EÉ]VOLUTION|PRONOSTIC|TRAITEMENT|PRISE\s+EN\s+CHARGE|CONDUITE\s+[AÀ]\s+TENIR|PR[EÉ]VENTION|PROPHYLAXIE|SURVEILLANCE|M[EÉ]CANISME|PHARMACOCIN[EÉ]TIQUE|PHARMACODYNAMIE|INDICATIONS?|CONTRE[\-\s]INDICATIONS?|EFFETS?\s+IND[EÉ]SIRABLES?|M[EÉ]THODES?|R[EÉ]SULTATS?|CONCLUSION|ARTICLE\s+\d+)\b/i.test(t)) {
    return true;
  }
  const lettersOnly = t.replace(/[^a-zA-ZÉÈÊËÀÂÄÎÏÔÖÙÛÜÇéèêëàâäîïôöùûüç]/g, '');
  if (lettersOnly.length >= 6 && t.length <= 78 && !/[a-z]/.test(t) && !t.endsWith('.')) return true;
  return false;
}

function cleanLine(s) {
  return String(s || '').replace(/\u0000/g, '').replace(/\s+/g, ' ').trim();
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
    const line = cleanLine(texts.join(''));
    if (line) {
      const lvlMatch = p.match(/\blvl="(\d+)"/);
      const level = lvlMatch ? Number(lvlMatch[1]) : 0;
      const isBullet = /<a:buChar|<a:buAutoNum/.test(p) || level >= 1 || /^[\-•*▪◦►▸✓➢➤]/.test(line);
      out.push({ text: line, isBullet, level });
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
      const colCount = Math.max(...rows.map((r) => r.length));
      const normRows = rows.map((r) => {
        const copy = r.slice();
        while (copy.length < colCount) copy.push('—');
        return copy;
      });
      tables.push({
        title: `${slideTitle || 'Tableau'} — Tableau ${idx + 1} (Diapositive ${slideNum})`,
        slideNum,
        pageRef: `Diapositive ${slideNum}`,
        isChart: false,
        provenance: 'source_explicit',
        headers: normRows[0],
        rows: normRows.slice(1)
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
    pageRef: `Diapositive ${slideNum}`,
    isChart: true,
    provenance: 'source_explicit',
    headers: ['Catégorie / Axe', ...seriesList.map((s) => s.name)],
    rows
  };
}

function extractSmartArtLines(diagramXml) {
  const out = [];
  const ptMatches = diagramXml.match(/<dgm:pt\b[\s\S]*?<\/dgm:pt>/g) || [];
  for (const pt of ptMatches) {
    const runs = extractXmlTextRuns(pt);
    const joined = runs.map((r) => r.text).join(' — ').trim();
    if (joined && joined.length >= 3 && !out.includes(joined)) {
      out.push(joined);
    }
  }
  return out;
}

function extractImageCaptionsFromSlideXml(slideXml) {
  const captions = [];
  const picMatches = slideXml.match(/<p:pic\b[\s\S]*?<\/p:pic>/g) || [];
  for (const pic of picMatches) {
    const nv = (pic.match(/<p:cNvPr\b[^>]*>/) || [''])[0];
    const descr = (nv.match(/\bdescr="([^"]+)"/) || ['', ''])[1];
    const title = (nv.match(/\btitle="([^"]+)"/) || ['', ''])[1];
    const embedMatch = pic.match(/r:embed="([^"]+)"/);
    const cleanDescr = decodeXmlEntities(descr || title).replace(/\s+/g, ' ').trim();
    const meaningfulCaption = cleanDescr && !/^image\s*\d+|picture\s*\d+|\.(png|jpg|jpeg|emf|wmf)$/i.test(cleanDescr) ? cleanDescr : '';
    captions.push({
      relId: embedMatch ? embedMatch[1] : '',
      caption: meaningfulCaption
    });
  }
  return captions;
}

/**
 * Extraction complète PPTX (OpenXML) :
 * - Tous les shapes (y compris groupés <p:grpSp>)
 * - Tableaux (<a:tbl>), Graphiques (<c:chart>), SmartArt (diagrams/data*.xml)
 * - Notes présentateur, légendes d'images, médias candidats à l'OCR/Vision
 */
export async function extractPptxDocument(buffer, sourceFilename) {
  const zip = await JSZip.loadAsync(buffer);
  const presXml = await zip.file('ppt/presentation.xml')?.async('string');
  const relsXml = await zip.file('ppt/_rels/presentation.xml.rels')?.async('string');
  if (!presXml || !relsXml) {
    return { ok: false, error: `Structure .pptx invalide dans ${sourceFilename}.` };
  }

  let presTitle = '';
  let authorMeta = '';
  const coreXml = await zip.file('docProps/core.xml')?.async('string');
  if (coreXml) {
    const tm = coreXml.match(/<dc:title[^>]*>([\s\S]*?)<\/dc:title>/);
    if (tm) {
      const cand = cleanLine(decodeXmlEntities(tm[1]));
      if (cand.length >= 4 && !/(pptxgenjs|pr[eé]sentation\s*powerpoint|^diapositive|^presentation|^powerpoint|^microsoft|^untitled|^slide\s*\d*$)/i.test(cand)) {
        presTitle = cand;
      }
    }
    const cm = coreXml.match(/<dc:creator[^>]*>([\s\S]*?)<\/dc:creator>/);
    if (cm) authorMeta = cleanLine(decodeXmlEntities(cm[1]));
  }

  const relMap = {};
  const relReg = /<Relationship\b[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"[^>]*\/?>/g;
  let rm;
  while ((rm = relReg.exec(relsXml)) !== null) relMap[rm[1]] = rm[2];

  const slideIds = [];
  const sldReg = /<p:sldId\b[^>]*r:id="([^"]+)"[^>]*\/?>/g;
  let sm;
  while ((sm = sldReg.exec(presXml)) !== null) slideIds.push(sm[1]);

  const units = [];
  const manualReviewItems = [];
  const ocrCandidates = [];
  let tablesExtracted = 0;
  let chartsExtracted = 0;
  let smartArtExtracted = 0;
  let speakerNotesExtracted = 0;
  let imagesFound = 0;

  for (let i = 0; i < slideIds.length; i++) {
    const slideNum = i + 1;
    const target = relMap[slideIds[i]];
    if (!target) continue;
    const slidePath = normalizeZipPath('ppt', target);
    const slideXml = await zip.file(slidePath)?.async('string');
    if (!slideXml) {
      manualReviewItems.push({ unitNum: slideNum, title: `Diapositive ${slideNum}`, reason: `Fichier XML manquant (${slidePath}).` });
      continue;
    }

    let slideTitle = '';
    const lines = [];
    const bullets = [];
    const captions = [];
    const issues = [];

    // Extraire TOUS les <p:sp> (y compris dans les groupes <p:grpSp> imbriqués)
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
          if (r.isBullet) {
            const cleaned = r.text.replace(/^[\-•*▪◦►▸✓➢➤]+\s*/, '').trim();
            if (cleaned) bullets.push(cleaned);
          } else {
            lines.push(r.text);
          }
        }
      }
    }

    if (!slideTitle && lines.length > 0) {
      const firstNonNoiseIdx = lines.findIndex((l) => !isAdminBoilerplate(l));
      if (firstNonNoiseIdx >= 0 && lines[firstNonNoiseIdx].length <= 130) {
        slideTitle = lines.splice(firstNonNoiseIdx, 1)[0];
      } else {
        slideTitle = lines[0].slice(0, 95);
      }
    }

    const tables = extractTablesFromSlideXml(slideXml, slideNum, slideTitle);
    tablesExtracted += tables.length;

    const picMeta = extractImageCaptionsFromSlideXml(slideXml);
    for (const pm of picMeta) {
      if (pm.caption) captions.push(pm.caption);
    }

    const fileName = slidePath.split('/').pop();
    const sRelsXml = await zip.file(`ppt/slides/_rels/${fileName}.rels`)?.async('string');
    let speakerNotes = '';
    const slideImages = [];

    if (sRelsXml) {
      const sRelReg = /<Relationship\b[^>]*Id="([^"]+)"[^>]*Type="([^"]+)"[^>]*Target="([^"]+)"[^>]*\/?>/g;
      let srm;
      while ((srm = sRelReg.exec(sRelsXml)) !== null) {
        const [, rId, rType, rTarget] = srm;
        if (!rTarget || rTarget.startsWith('http')) continue;
        const resolved = normalizeZipPath('ppt/slides', rTarget);

        if (rType.endsWith('/chart') || resolved.startsWith('ppt/charts/')) {
          const chXml = await zip.file(resolved)?.async('string');
          if (chXml) {
            const chTbl = extractChartFromXml(chXml, slideNum);
            if (chTbl) { tables.push(chTbl); chartsExtracted++; }
            else issues.push('Graphique détecté mais séries de données non extractibles — vérification visuelle recommandée.');
          }
        } else if (rType.includes('diagramData') || resolved.startsWith('ppt/diagrams/data')) {
          const dgmXml = await zip.file(resolved)?.async('string');
          if (dgmXml) {
            const dgmLines = extractSmartArtLines(dgmXml);
            if (dgmLines.length) {
              smartArtExtracted++;
              dgmLines.forEach((dl) => bullets.push(dl));
            }
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
          const imgEntry = zip.file(resolved);
          const extMatch = resolved.match(/\.(png|jpe?g|gif|webp)$/i);
          if (imgEntry) {
            imagesFound++;
            const imgMeta = {
              relId: rId,
              mediaPath: resolved,
              mimeType: extMatch ? (extMatch[1].toLowerCase() === 'png' ? 'image/png' : (extMatch[1].toLowerCase() === 'webp' ? 'image/webp' : 'image/jpeg')) : '',
              caption: (picMeta.find((p) => p.relId === rId)?.caption) || ''
            };
            slideImages.push(imgMeta);
          }
        }
      }
    }

    const joinedForCount = `${slideTitle} ${lines.join(' ')} ${bullets.join(' ')} ${speakerNotes} ${captions.join(' ')}`;
    const wordCount = joinedForCount.split(/\s+/).filter((w) => w.length >= 2).length;
    const isVisualSlide = slideImages.length > 0 && wordCount < 28;
    const isEmptySlide = wordCount < 4 && tables.length === 0 && !speakerNotes;

    // Préparer les candidats OCR/Vision (limité en taille pour la persistance des jobs)
    if (isVisualSlide && ocrCandidates.length < 12) {
      for (const im of slideImages.slice(0, 2)) {
        if (!im.mimeType) continue;
        const imgBuf = await zip.file(im.mediaPath)?.async('nodebuffer');
        if (imgBuf && imgBuf.length >= 4000 && imgBuf.length <= 1800000) {
          ocrCandidates.push({
            unitNum: slideNum,
            mediaPath: im.mediaPath,
            mimeType: im.mimeType,
            sizeBytes: imgBuf.length,
            base64: imgBuf.toString('base64')
          });
        }
      }
    }

    if (isVisualSlide) {
      issues.push(`Diapositive contenant ${slideImages.length} image(s)/schéma(s) avec peu de texte (${wordCount} mots) — analyse OCR/visuelle requise.`);
    } else if (isEmptySlide) {
      issues.push('Diapositive vide ou purement graphique — vérification manuelle recommandée.');
    }

    if (issues.length > 0) {
      manualReviewItems.push({ unitNum: slideNum, slideNum, title: slideTitle || `Diapositive ${slideNum}`, reason: issues.join(' ; ') });
    }
    if (slideNum === 1 && !presTitle) {
      presTitle = (slideTitle || sourceFilename.replace(/\.(pptx|ppt)$/i, '')).slice(0, 110);
    }

    units.push({
      unitNum: slideNum,
      unitLabel: 'Diapositive',
      sourceFilename,
      docType: 'pptx',
      title: slideTitle || `Diapositive ${slideNum}`,
      headingDetected: isHeadingCandidate(slideTitle),
      lines,
      bullets,
      tables,
      captions,
      speakerNotes,
      imageCount: slideImages.length,
      ocrText: '',
      wordCount,
      needsOcr: isVisualSlide,
      needsReview: issues.length > 0,
      reviewReason: issues.join(' ; ')
    });
  }

  return {
    ok: true,
    docType: 'pptx',
    unitLabel: 'Diapositive',
    sourceFilename,
    detectedTitle: presTitle || sourceFilename.replace(/\.(pptx|ppt)$/i, ''),
    detectedAuthor: authorMeta,
    totalUnits: units.length,
    units,
    ocrCandidates,
    stats: {
      totalUnits: units.length,
      tablesExtracted,
      chartsExtracted,
      smartArtExtracted,
      speakerNotesExtracted,
      imagesFound,
      lowConfidenceUnits: manualReviewItems.map((m) => m.unitNum)
    },
    manualReviewItems,
    engine: 'MedStudy Universal OpenXML Extractor (PPTX + SmartArt + Charts + Notes)'
  };
}

/**
 * Extraction native des fichiers PowerPoint binaires anciens (.ppt OLE2) en pur Node.js
 * Extrait TextCharsAtom (0x0FA0 UTF-16LE) et TextBytesAtom (0x0FA8 Latin-1)
 */
export async function extractLegacyPptDocument(buffer, sourceFilename) {
  const sigCheck = validateFileMagicBytes(buffer, '.ppt');
  if (!sigCheck.ok) return { ok: false, error: sigCheck.error };

  const blocks = [];
  const seen = new Set();
  let pos = 0;
  const len = buffer.length;

  // Scanner les en-têtes d'enregistrements PowerPoint (8 octets : recVer/Inst u16, recType u16, recLen u32)
  while (pos + 8 <= len) {
    const recType = buffer.readUInt16LE(pos + 2);
    const recLen = buffer.readUInt32LE(pos + 4);
    if ((recType === 0x0FA0 || recType === 0x0FA8) && recLen >= 6 && recLen <= 65536 && pos + 8 + recLen <= len) {
      let rawText = '';
      if (recType === 0x0FA0 && recLen % 2 === 0) {
        rawText = buffer.subarray(pos + 8, pos + 8 + recLen).toString('utf16le');
      } else if (recType === 0x0FA8) {
        rawText = buffer.subarray(pos + 8, pos + 8 + recLen).toString('latin1');
      }
      const cleanedLines = rawText
        .split(/[\r\n\v]+/)
        .map((l) => cleanLine(l.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' ')))
        .filter((l) => l.length >= 3 && /[a-zA-ZÉÈÊÀÂÎÔÙÇéèêàâîôùç0-9]/.test(l));
      if (cleanedLines.length) {
        const key = cleanedLines.join('|').toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          blocks.push(cleanedLines);
        }
      }
      pos += 8 + recLen;
    } else {
      pos += 2;
    }
  }

  if (!blocks.length) {
    return {
      ok: false,
      error: `Impossible d'extraire du texte lisible depuis le fichier binaire .ppt « ${sourceFilename} ». Convertissez-le en .pptx ou PDF si le document est chiffré ou uniquement composé d'images.`
    };
  }

  // Regrouper les blocs de texte en diapositives logiques
  const units = [];
  const manualReviewItems = [];
  const perSlide = Math.max(2, Math.ceil(blocks.length / Math.min(30, Math.max(4, Math.ceil(blocks.length / 3)))));
  for (let i = 0; i < blocks.length; i += perSlide) {
    const grp = blocks.slice(i, i + perSlide).flat();
    const slideNum = units.length + 1;
    const title = grp[0] ? grp[0].slice(0, 105) : `Diapositive ${slideNum}`;
    const rest = grp.slice(1);
    const bullets = [];
    const lines = [];
    for (const r of rest) {
      if (/^[\-•*▪◦►]/.test(r)) bullets.push(r.replace(/^[\-•*▪◦►]+\s*/, '').trim());
      else lines.push(r);
    }
    const wc = grp.join(' ').split(/\s+/).filter((w) => w.length >= 2).length;
    const reason = 'Format binaire .ppt ancien : texte extrait nativement, vérifier visuels, tableaux et ordre des diapositives.';
    manualReviewItems.push({ unitNum: slideNum, slideNum, title, reason });
    units.push({
      unitNum: slideNum,
      unitLabel: 'Diapositive',
      sourceFilename,
      docType: 'ppt',
      title,
      headingDetected: isHeadingCandidate(title),
      lines,
      bullets,
      tables: [],
      captions: [],
      speakerNotes: '',
      imageCount: 0,
      ocrText: '',
      wordCount: wc,
      needsOcr: false,
      needsReview: true,
      reviewReason: reason
    });
  }

  return {
    ok: true,
    docType: 'ppt',
    unitLabel: 'Diapositive',
    sourceFilename,
    detectedTitle: sourceFilename.replace(/\.ppt$/i, '').replace(/[_-]+/g, ' ').trim(),
    detectedAuthor: '',
    totalUnits: units.length,
    units,
    ocrCandidates: [],
    stats: {
      totalUnits: units.length,
      tablesExtracted: 0,
      chartsExtracted: 0,
      smartArtExtracted: 0,
      speakerNotesExtracted: 0,
      imagesFound: 0,
      lowConfidenceUnits: manualReviewItems.map((m) => m.unitNum)
    },
    manualReviewItems,
    engine: 'MedStudy Universal OLE2 Binary Extractor (.ppt)'
  };
}

/**
 * Reconstruit les lignes et détecte les tableaux à partir de la géométrie X/Y PDF.js
 */
function reconstructPdfPageGeometry(items, pageNum) {
  const positioned = [];
  const heights = [];
  for (const it of (items || [])) {
    const str = String(it.str || '');
    if (!str.trim()) continue;
    const tx = Array.isArray(it.transform) ? it.transform : [1, 0, 0, 10, 0, 0];
    const x = Number(tx[4]) || 0;
    const y = Number(tx[5]) || 0;
    const h = Math.abs(Number(it.height) || Number(tx[3]) || 10);
    const w = Math.abs(Number(it.width) || str.length * h * 0.5);
    heights.push(h);
    positioned.push({ str, x, y, h, w });
  }

  if (!positioned.length) {
    return { title: `Page ${pageNum}`, headingLines: [], lines: [], bullets: [], tables: [], medianHeight: 10 };
  }

  heights.sort((a, b) => a - b);
  const medianHeight = heights[Math.floor(heights.length / 2)] || 10;

  // Regrouper par coordonnée Y (tolérance 3.8 pt), du haut vers le bas (Y décroissant en PDF)
  positioned.sort((a, b) => b.y - a.y || a.x - b.x);
  const rows = [];
  for (const item of positioned) {
    const lastRow = rows[rows.length - 1];
    if (lastRow && Math.abs(lastRow.y - item.y) <= Math.max(3.8, medianHeight * 0.42)) {
      lastRow.items.push(item);
      lastRow.maxH = Math.max(lastRow.maxH, item.h);
    } else {
      rows.push({ y: item.y, maxH: item.h, items: [item] });
    }
  }

  const parsedRows = rows.map((row) => {
    row.items.sort((a, b) => a.x - b.x);
    const cells = [];
    let curCell = '';
    let prevEnd = null;
    for (const it of row.items) {
      if (prevEnd !== null) {
        const gap = it.x - prevEnd;
        if (gap > Math.max(24, medianHeight * 2.2)) {
          if (curCell.trim()) cells.push(cleanLine(curCell));
          curCell = it.str;
        } else if (gap > 1.5 && !curCell.endsWith(' ') && !it.str.startsWith(' ')) {
          curCell += ' ' + it.str;
        } else {
          curCell += it.str;
        }
      } else {
        curCell = it.str;
      }
      prevEnd = it.x + it.w;
    }
    if (curCell.trim()) cells.push(cleanLine(curCell));
    const fullText = cleanLine(cells.join(' '));
    const isLargeFont = row.maxH >= medianHeight * 1.18 && fullText.length >= 4 && fullText.length <= 120;
    return { fullText, cells, isLargeFont, maxH: row.maxH };
  }).filter((r) => r.fullText.length >= 2);

  // Détecter les blocs tabulaires (≥ 3 lignes consécutives avec 2–5 colonnes alignées)
  const tables = [];
  const usedAsTable = new Set();
  let runStart = -1;
  for (let i = 0; i <= parsedRows.length; i++) {
    const r = parsedRows[i];
    const isMultiCol = r && r.cells.length >= 2 && r.cells.length <= 5 && r.fullText.length <= 190 && !/^[\-•*▪◦►]/.test(r.fullText);
    if (isMultiCol) {
      if (runStart < 0) runStart = i;
    } else {
      if (runStart >= 0 && i - runStart >= 3) {
        const tblSlice = parsedRows.slice(runStart, i);
        const colCnt = Math.min(5, Math.max(...tblSlice.map((x) => x.cells.length)));
        const norm = tblSlice.map((x) => {
          const c = x.cells.slice(0, colCnt);
          while (c.length < colCnt) c.push('—');
          return c;
        });
        tables.push({
          title: `Tableau extrait — Page ${pageNum}`,
          pageNum,
          pageRef: `Page ${pageNum}`,
          isChart: false,
          provenance: 'source_explicit',
          headers: norm[0],
          rows: norm.slice(1)
        });
        for (let k = runStart; k < i; k++) usedAsTable.add(k);
      }
      runStart = -1;
    }
  }

  let title = '';
  const headingLines = [];
  const lines = [];
  const bullets = [];

  parsedRows.forEach((r, idx) => {
    if (usedAsTable.has(idx)) return;
    const txt = r.fullText;
    if (isAdminBoilerplate(txt)) return;

    const isHead = r.isLargeFont || isHeadingCandidate(txt);
    if (!title && txt.length >= 4 && txt.length <= 120 && !/^[\-•*▪◦►]/.test(txt)) {
      title = txt;
      if (isHead) headingLines.push(txt);
      return;
    }
    if (isHead && txt.length <= 115) {
      headingLines.push(txt);
    }

    if (/^([\-\•\*\▪\◦\►▸✓➢➤]|\d{1,2}\s*[\)\.]|[a-z]\))\s+\S/.test(txt)) {
      const cleaned = txt.replace(/^[\-\•\*\▪\◦\►▸✓➢➤]+\s*/, '').trim();
      if (cleaned.length >= 3) bullets.push(cleaned);
    } else {
      lines.push(txt);
    }
  });

  const mergeWrapped = (arr) => {
    const out = [];
    let buf = '';
    for (const raw of arr) {
      const ln = cleanLine(raw);
      if (!ln) continue;
      const isHead = isHeadingCandidate(ln);
      const isColonLabel = /^[A-ZÉÈÊÀÂÎÔÙÇ][^:]{2,42}\s*:\s*\S/.test(ln);
      if (!buf) { buf = ln; continue; }
      const bufEnds = /[\.\!\?\:\;]\s*$/.test(buf);
      const bufHead = isHeadingCandidate(buf);
      const startsLower = /^[a-zéèêàâîôùç,\)\;]/.test(ln);
      if (!isHead && !isColonLabel && !bufHead && buf.length < 360 && (!bufEnds || startsLower)) {
        if (/[a-zA-ZéèêàâîôùçÉÈÊÀÂÎÔÙÇ]-$/.test(buf) && /^[a-zéèêàâîôùç]/.test(ln)) {
          buf = buf.slice(0, -1) + ln;
        } else {
          buf = `${buf} ${ln}`;
        }
      } else {
        out.push(buf);
        buf = ln;
      }
    }
    if (buf) out.push(buf);
    return out;
  };

  return {
    title: title || `Page ${pageNum}`,
    headingLines,
    lines: mergeWrapped(lines),
    bullets: mergeWrapped(bullets),
    tables,
    medianHeight
  };
}

/**
 * Extraction complète PDF page par page (géométrie + tableaux + puces + titres + drapeaux OCR)
 */
export async function extractPdfDocument(buffer, sourceFilename) {
  const sigCheck = validateFileMagicBytes(buffer, '.pdf');
  if (!sigCheck.ok) return { ok: false, error: sigCheck.error };

  const { default: pdfParse } = await import('pdf-parse/lib/pdf-parse.js');
  const units = [];
  const manualReviewItems = [];
  let tablesExtracted = 0;
  let pageCounter = 0;

  const parsedInfo = await pdfParse(buffer, {
    pagerender: async (pageData) => {
      pageCounter++;
      const textContent = await pageData.getTextContent({
        normalizeWhitespace: false,
        disableCombineTextItems: false
      });
      const geom = reconstructPdfPageGeometry(textContent.items, pageCounter);
      tablesExtracted += geom.tables.length;

      const joined = `${geom.title} ${geom.lines.join(' ')} ${geom.bullets.join(' ')}`;
      const wordCount = joined.split(/\s+/).filter((w) => w.length >= 2).length;
      const isLow = wordCount < 14 && geom.tables.length === 0;
      const reviewReason = isLow
        ? `Page ${pageCounter} à faible densité textuelle (${wordCount} mots — probable scan, schéma ou diapositive image). Vérification ou OCR recommandé.`
        : '';

      if (isLow) {
        manualReviewItems.push({ unitNum: pageCounter, slideNum: pageCounter, title: geom.title, reason: reviewReason });
      }

      units.push({
        unitNum: pageCounter,
        unitLabel: 'Page',
        sourceFilename,
        docType: 'pdf',
        title: geom.title,
        headingDetected: geom.headingLines.length > 0 || isHeadingCandidate(geom.title),
        headingLines: geom.headingLines,
        lines: geom.lines,
        bullets: geom.bullets,
        tables: geom.tables,
        captions: [],
        speakerNotes: '',
        imageCount: isLow ? 1 : 0,
        ocrText: '',
        wordCount,
        needsOcr: isLow,
        needsReview: isLow,
        reviewReason
      });
      return joined;
    }
  });

  if (!units.length) {
    return { ok: false, error: `Impossible d'extraire les pages de « ${sourceFilename} » (PDF protégé ou corrompu).` };
  }

  const infoTitle = cleanLine(parsedInfo?.info?.Title || '');
  const infoAuthor = cleanLine(parsedInfo?.info?.Author || '');
  const safeInfoTitle = (infoTitle.length >= 4 && !/microsoft|powerpoint|untitled|document\d*/i.test(infoTitle)) ? infoTitle : '';

  return {
    ok: true,
    docType: 'pdf',
    unitLabel: 'Page',
    sourceFilename,
    detectedTitle: safeInfoTitle || units[0]?.title || sourceFilename.replace(/\.pdf$/i, ''),
    detectedAuthor: infoAuthor,
    totalUnits: units.length,
    units,
    ocrCandidates: [],
    stats: {
      totalUnits: units.length,
      tablesExtracted,
      chartsExtracted: 0,
      smartArtExtracted: 0,
      speakerNotesExtracted: 0,
      imagesFound: manualReviewItems.length,
      lowConfidenceUnits: manualReviewItems.map((m) => m.unitNum)
    },
    manualReviewItems,
    engine: 'MedStudy Universal PDF Geometry Extractor (pdf-parse + Table/Heading Reconstruction)'
  };
}

/**
 * Point d'entrée universel multi-fichiers (PDF, PPTX, PPT, TXT/MD)
 */
export async function extractCourseFiles(fileEntries) {
  const allUnits = [];
  const allReviewItems = [];
  const allOcrCandidates = [];
  const fileSummaries = [];
  const totals = {
    totalUnits: 0,
    tablesExtracted: 0,
    chartsExtracted: 0,
    smartArtExtracted: 0,
    speakerNotesExtracted: 0,
    imagesFound: 0,
    lowConfidenceUnits: []
  };

  let primaryDocType = 'pdf';
  let primaryUnitLabel = 'Page';
  let detectedTitle = '';
  let detectedAuthor = '';
  const engines = new Set();

  for (const entry of fileEntries) {
    const ext = (String(entry.originalName || '').match(/(\.[a-zA-Z0-9]+)$/) || ['', ''])[1].toLowerCase();
    let res;
    if (ext === '.pptx') {
      res = await extractPptxDocument(entry.buffer, entry.originalName);
      primaryDocType = 'pptx';
      primaryUnitLabel = 'Diapositive';
    } else if (ext === '.ppt') {
      res = await extractLegacyPptDocument(entry.buffer, entry.originalName);
      primaryDocType = 'ppt';
      primaryUnitLabel = 'Diapositive';
    } else if (ext === '.pdf') {
      res = await extractPdfDocument(entry.buffer, entry.originalName);
    } else if (ext === '.txt' || ext === '.md') {
      const txt = entry.buffer.toString('utf8');
      const rawLines = txt.split(/\r?\n/).map(cleanLine).filter(Boolean);
      res = {
        ok: true,
        docType: 'text',
        unitLabel: 'Section',
        sourceFilename: entry.originalName,
        detectedTitle: rawLines[0] || entry.originalName,
        detectedAuthor: '',
        totalUnits: 1,
        units: [{
          unitNum: 1,
          unitLabel: 'Section',
          sourceFilename: entry.originalName,
          docType: 'text',
          title: rawLines[0] || entry.originalName,
          headingDetected: true,
          lines: rawLines.slice(1),
          bullets: [],
          tables: [],
          captions: [],
          speakerNotes: '',
          imageCount: 0,
          ocrText: '',
          wordCount: rawLines.join(' ').split(/\s+/).length,
          needsOcr: false,
          needsReview: false,
          reviewReason: ''
        }],
        ocrCandidates: [],
        stats: { totalUnits: 1, tablesExtracted: 0, chartsExtracted: 0, smartArtExtracted: 0, speakerNotesExtracted: 0, imagesFound: 0, lowConfidenceUnits: [] },
        manualReviewItems: [],
        engine: 'MedStudy Text/Markdown Extractor'
      };
    } else {
      continue;
    }

    if (!res.ok) return res;
    if (!detectedTitle && res.detectedTitle) detectedTitle = res.detectedTitle;
    if (!detectedAuthor && res.detectedAuthor) detectedAuthor = res.detectedAuthor;
    engines.add(res.engine);

    fileSummaries.push({
      fileId: entry.fileId || '',
      originalName: entry.originalName,
      docType: res.docType,
      unitLabel: res.unitLabel,
      totalUnits: res.totalUnits,
      tablesExtracted: res.stats.tablesExtracted,
      chartsExtracted: res.stats.chartsExtracted,
      speakerNotesExtracted: res.stats.speakerNotesExtracted,
      flaggedUnits: res.manualReviewItems.length
    });

    for (const u of res.units) allUnits.push(u);
    for (const m of res.manualReviewItems) allReviewItems.push({ ...m, sourceFilename: entry.originalName });
    for (const oc of (res.ocrCandidates || [])) allOcrCandidates.push({ ...oc, sourceFilename: entry.originalName });

    totals.totalUnits += res.stats.totalUnits;
    totals.tablesExtracted += res.stats.tablesExtracted;
    totals.chartsExtracted += res.stats.chartsExtracted;
    totals.smartArtExtracted += res.stats.smartArtExtracted || 0;
    totals.speakerNotesExtracted += res.stats.speakerNotesExtracted;
    totals.imagesFound += res.stats.imagesFound;
    totals.lowConfidenceUnits.push(...res.stats.lowConfidenceUnits);
  }

  if (!allUnits.length) {
    return { ok: false, error: 'Aucun document PDF ou PowerPoint exploitable trouvé pour ce cours.' };
  }

  return {
    ok: true,
    docType: primaryDocType,
    unitLabel: primaryUnitLabel,
    detectedTitle,
    detectedAuthor,
    fileSummaries,
    units: allUnits,
    ocrCandidates: allOcrCandidates,
    manualReviewItems: allReviewItems,
    stats: totals,
    engine: Array.from(engines).join(' + ')
  };
}
