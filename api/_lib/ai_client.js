/* ==========================================================================
   MedStudy Universal Engine — Client IA & Vision OCR Serveur Uniquement
   Sécurité : les clés API restent exclusivement côté serveur (Vercel Env Vars).
   Supporte Gemini (API REST + Vision), OpenAI (Chat + Vision) et fallback local.
   ========================================================================== */

export function getServerAiConfig(siteMetaConfig = null) {
  const envGemini = (process.env.GEMINI_API_KEY || '').trim();
  const envOpenAi = (process.env.OPENAI_API_KEY || '').trim();
  const envGeneric = (process.env.AI_API_KEY || '').trim();
  const requestedProvider = String(process.env.AI_PROVIDER || siteMetaConfig?.provider || '').trim().toLowerCase();

  if (requestedProvider === 'gemini' && (envGemini || envGeneric)) {
    return {
      enabled: true,
      provider: 'gemini',
      model: process.env.AI_MODEL || 'gemini-2.5-flash',
      apiKey: envGemini || envGeneric
    };
  }
  if (requestedProvider === 'openai' && (envOpenAi || envGeneric)) {
    return {
      enabled: true,
      provider: 'openai',
      model: process.env.AI_MODEL || 'gpt-4o-mini',
      apiKey: envOpenAi || envGeneric
    };
  }
  if (envGemini) {
    return {
      enabled: true,
      provider: 'gemini',
      model: process.env.AI_MODEL || 'gemini-2.5-flash',
      apiKey: envGemini
    };
  }
  if (envOpenAi) {
    return {
      enabled: true,
      provider: 'openai',
      model: process.env.AI_MODEL || 'gpt-4o-mini',
      apiKey: envOpenAi
    };
  }
  return {
    enabled: false,
    provider: 'deterministic_medical',
    model: 'medstudy-structural-v2',
    apiKey: ''
  };
}

function parseJsonSafe(rawText) {
  const str = String(rawText || '').trim();
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch {}
  const fenced = str.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()); } catch {}
  }
  const firstBrace = str.indexOf('{');
  const lastBrace = str.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    try { return JSON.parse(str.slice(firstBrace, lastBrace + 1)); } catch {}
  }
  return null;
}

async function fetchWithRetry(url, init, retries = 1, timeoutMs = 28000) {
  let lastErr = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timer);
      if (res.ok) return res;
      const errTxt = await res.text().catch(() => '');
      lastErr = new Error(`HTTP ${res.status}: ${errTxt.slice(0, 220)}`);
      if (res.status !== 429 && res.status < 500) break;
    } catch (err) {
      clearTimeout(timer);
      lastErr = err;
    }
    if (attempt < retries) {
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }
  }
  throw lastErr || new Error('Erreur réseau API IA');
}

/**
 * Appelle le LLM configuré côté serveur pour produire un JSON strictement structuré
 */
export async function invokeStructuredAi(config, systemPrompt, userPrompt, maxTokens = 4096) {
  if (!config || !config.enabled || !config.apiKey) {
    return { ok: false, fallbackReason: 'Aucune clé API IA configurée côté serveur.' };
  }

  try {
    if (config.provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.model)}:generateContent?key=${encodeURIComponent(config.apiKey)}`;
      const res = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: maxTokens,
            responseMimeType: 'application/json'
          }
        })
      });
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';
      const parsed = parseJsonSafe(text);
      if (!parsed) return { ok: false, fallbackReason: 'Réponse JSON Gemini invalide ou tronquée.' };
      return { ok: true, data: parsed, provider: `gemini:${config.model}` };
    }

    if (config.provider === 'openai') {
      const res = await fetchWithRetry('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model,
          temperature: 0.2,
          max_tokens: maxTokens,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        })
      });
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content || '';
      const parsed = parseJsonSafe(text);
      if (!parsed) return { ok: false, fallbackReason: 'Réponse JSON OpenAI invalide.' };
      return { ok: true, data: parsed, provider: `openai:${config.model}` };
    }

    return { ok: false, fallbackReason: `Fournisseur IA non supporté : ${config.provider}` };
  } catch (err) {
    return { ok: false, fallbackReason: err.message || 'Échec appel API IA.' };
  }
}

/**
 * Analyse visuelle / OCR d'une image de diapositive ou schéma médical via Vision LLM (côté serveur uniquement)
 */
export async function invokeVisionOcr(config, base64Data, mimeType, contextLabel) {
  if (!config || !config.enabled || !config.apiKey || !base64Data) {
    return { ok: false, text: '', reason: 'Vision IA non configurée' };
  }
  const prompt = `Tu es un extracteur OCR médical fidèle. Extrais UNIQUEMENT le texte, les légendes, les valeurs chiffrées, les formules, les étiquettes de schémas ou les tableaux réellement visibles sur cette image (${contextLabel}). N'invente aucune donnée absente. Réponds en JSON : {"extractedText":"...","hasMedicalDiagram":true|false,"uncertainParts":"..."}`;

  try {
    if (config.provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.model)}:generateContent?key=${encodeURIComponent(config.apiKey)}`;
      const res = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [
              { text: prompt },
              { inlineData: { mimeType: mimeType || 'image/png', data: base64Data } }
            ]
          }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1024, responseMimeType: 'application/json' }
        })
      }, 1, 20000);
      const data = await res.json();
      const raw = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';
      const parsed = parseJsonSafe(raw);
      return { ok: true, text: String(parsed?.extractedText || '').trim(), uncertainParts: String(parsed?.uncertainParts || '').trim() };
    }

    if (config.provider === 'openai') {
      const res = await fetchWithRetry('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` },
        body: JSON.stringify({
          model: config.model,
          temperature: 0.1,
          max_tokens: 1024,
          response_format: { type: 'json_object' },
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: `data:${mimeType || 'image/png'};base64,${base64Data}` } }
            ]
          }]
        })
      }, 1, 20000);
      const data = await res.json();
      const raw = data?.choices?.[0]?.message?.content || '';
      const parsed = parseJsonSafe(raw);
      return { ok: true, text: String(parsed?.extractedText || '').trim(), uncertainParts: String(parsed?.uncertainParts || '').trim() };
    }
  } catch (err) {
    return { ok: false, text: '', reason: err.message };
  }
  return { ok: false, text: '', reason: 'Fournisseur Vision non supporté' };
}
