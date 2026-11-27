/* ==========================================================================
   MedStudy Production — API Serverless Vercel (Node.js ESM + Supabase)
   Remplace server.ps1 en production cloud avec Auth, PostgreSQL RLS & Storage
   ========================================================================== */
import crypto from 'node:crypto';
import {
  STORAGE_BUCKET,
  checkEnvConfigured,
  getSupabaseAdmin,
  getSupabaseAnon,
  setAuthCookies,
  clearAuthCookies,
  getSessionUser,
  mapModuleRow,
  mapCourseRow,
  mapFlashcardRow,
  mapQcmRow,
  courseToDbRow,
  flashcardToDbRow,
  qcmToDbRow,
  createEmptyProgress,
  mapImportJobRow
} from './_lib/supabase.js';
import {
  validateFileMagicBytes
} from './_lib/extractors.js';
import {
  STAGE_DEFINITIONS,
  createInitialStages,
  executeImportJobStage,
  runQualityAudit,
  regenerateSingleLesson
} from './_lib/processor.js';
import { getServerAiConfig } from './_lib/ai_client.js';

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.end(JSON.stringify(payload));
}

async function readRawBody(req, maxBytes = 4 * 1024 * 1024) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > maxBytes) throw new Error('PAYLOAD_TOO_LARGE');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function readJsonBody(req) {
  // Vercel @vercel/node pré-parse souvent req.body automatiquement
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
    if (typeof req.body === 'string') return req.body.trim() ? JSON.parse(req.body) : {};
    if (Buffer.isBuffer(req.body)) return req.body.length ? JSON.parse(req.body.toString('utf8')) : {};
  }
  const buf = await readRawBody(req, 4 * 1024 * 1024);
  if (!buf.length) return {};
  return JSON.parse(buf.toString('utf8'));
}

function makeId(prefix) {
  return `${prefix}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

async function syncModuleCourseIds(admin) {
  const [{ data: mods }, { data: courses }] = await Promise.all([
    admin.from('modules').select('id'),
    admin.from('courses').select('id, module_id')
  ]);
  for (const m of (mods || [])) {
    const ids = (courses || []).filter((c) => c.module_id === m.id).map((c) => c.id);
    await admin.from('modules').update({ course_ids: ids }).eq('id', m.id);
  }
}

async function createCloudBackup(admin, reason) {
  const [{ data: modules }, { data: courses }, { data: flashcards }, { data: qcms }] = await Promise.all([
    admin.from('modules').select('*'),
    admin.from('courses').select('*'),
    admin.from('flashcards').select('*'),
    admin.from('qcms').select('*')
  ]);
  const snap = { modules: modules || [], courses: courses || [], flashcards: flashcards || [], qcms: qcms || [] };
  const stamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const safeReason = String(reason || 'auto').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 28);
  const filename = `db_${stamp}_${safeReason}.json`;
  const sizeBytes = Buffer.byteLength(JSON.stringify(snap), 'utf8');
  await admin.from('db_backups').insert({ filename, reason: safeReason, size_bytes: sizeBytes, snapshot: snap });

  // Conserver les 25 sauvegardes les plus récentes
  const { data: oldRows } = await admin.from('db_backups').select('id').order('created_at', { ascending: false }).range(25, 200);
  if (oldRows && oldRows.length) {
    await admin.from('db_backups').delete().in('id', oldRows.map((r) => r.id));
  }
  return filename;
}

const MIME_MAP = {
  '.pdf': 'application/pdf',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.txt': 'text/plain',
  '.md': 'text/markdown',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg'
};

export default async function handler(req, res) {
  const envCheck = checkEnvConfigured();
  if (!envCheck.ok) {
    return sendJson(res, 503, {
      error: `Configuration Supabase manquante sur Vercel : ${envCheck.missing.join(', ')}. Ajoutez ces variables dans Vercel -> Settings -> Environment Variables.`
    });
  }

  const urlObj = new URL(req.url, 'http://localhost');
  const rewrittenPath = urlObj.searchParams.get('__path');
  const rawPath = rewrittenPath !== null ? `/api/${rewrittenPath.replace(/^\/+/, '')}` : urlObj.pathname;
  const path = rawPath.replace(/\/+$/, '');
  const method = (req.method || 'GET').toUpperCase();
  const admin = getSupabaseAdmin();

  try {
    // ---------- 1. HEALTH & BOOTSTRAP SEED (idempotent) ----------
    if (method === 'GET' && path === '/api/health') {
      const { count } = await admin.from('courses').select('id', { count: 'exact', head: true });
      return sendJson(res, 200, { ok: true, env: 'vercel', dbConnected: true, coursesCount: count || 0 });
    }

    if (method === 'POST' && path === '/api/bootstrap-seed') {
      const { count } = await admin.from('courses').select('id', { count: 'exact', head: true });
      if ((count || 0) > 0) {
        return sendJson(res, 200, { ok: true, alreadySeeded: true });
      }
      // En production, la migration s'effectue via supabase/seed_data.sql ou scripts/migrate-to-supabase.mjs
      return sendJson(res, 200, { ok: true, seeded: false, note: 'Exécutez supabase/seed_data.sql pour initialiser les 19 cours.' });
    }

    // ---------- 2. AUTHENTIFICATION SUPABASE ----------
    if (method === 'GET' && path === '/api/auth/me') {
      const user = await getSessionUser(req, res);
      const { count } = await admin.from('courses').select('id', { count: 'exact', head: true });
      return sendJson(res, 200, {
        authenticated: !!user,
        seeded: (count || 0) > 0,
        user: user || null
      });
    }

    if (method === 'POST' && path === '/api/auth/login') {
      const body = await readJsonBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      if (!email || !password) {
        return sendJson(res, 400, { error: 'Email et mot de passe requis.' });
      }
      const anon = getSupabaseAnon();
      const { data, error } = await anon.auth.signInWithPassword({ email, password });
      if (error || !data || !data.session || !data.user) {
        return sendJson(res, 401, { error: 'Identifiants incorrects ou compte non confirmé.' });
      }

      setAuthCookies(res, data.session);
      await admin.from('profiles').update({ last_login_at: new Date().toISOString() }).eq('id', data.user.id);
      const { data: prof } = await admin.from('profiles').select('id, email, name, role, created_at, last_login_at').eq('id', data.user.id).maybeSingle();
      const user = prof ? {
        id: prof.id,
        email: prof.email,
        name: prof.name,
        role: prof.role === 'admin' ? 'admin' : 'student',
        createdAt: prof.created_at,
        lastLoginAt: prof.last_login_at
      } : { id: data.user.id, email, name: email.split('@')[0], role: 'student' };

      return sendJson(res, 200, { ok: true, user });
    }

    if (method === 'POST' && path === '/api/auth/register') {
      const body = await readJsonBody(req);
      const name = String(body.name || '').trim();
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      if (name.length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || password.length < 6) {
        return sendJson(res, 400, { error: 'Nom (≥ 2 car.), email valide et mot de passe (≥ 6 car.) requis.' });
      }

      // Créer le compte via Admin API (email immédiatement utilisable) et FORCER role = 'student'
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name }
      });
      if (createErr || !created || !created.user) {
        const msg = /already|exists/i.test(createErr?.message || '') ? 'Un compte existe déjà avec cette adresse email.' : (createErr?.message || 'Erreur lors de la création du compte.');
        return sendJson(res, 409, { error: msg });
      }

      const now = new Date().toISOString();
      // Le trigger SQL private.handle_new_user() crée le profil avec le rôle sécurisé (toujours 'student' sauf 1er admin propriétaire)
      const { data: trigProf } = await admin
        .from('profiles')
        .select('id, email, name, role, created_at, last_login_at')
        .eq('id', created.user.id)
        .maybeSingle();

      const assignedRole = (trigProf && trigProf.role === 'admin') ? 'admin' : 'student';
      if (!trigProf) {
        await admin.from('profiles').insert({
          id: created.user.id, email, name, role: 'student', created_at: now, last_login_at: now
        });
      } else {
        await admin.from('profiles').update({ name, last_login_at: now }).eq('id', created.user.id);
      }

      await admin.from('student_progress').upsert({
        user_id: created.user.id,
        progress: createEmptyProgress(created.user.id, name),
        updated_at: now
      }, { onConflict: 'user_id' });

      const anon = getSupabaseAnon();
      const { data: loginData } = await anon.auth.signInWithPassword({ email, password });
      if (loginData && loginData.session) {
        setAuthCookies(res, loginData.session);
      }
      return sendJson(res, 201, {
        ok: true,
        user: { id: created.user.id, email, name, role: assignedRole, createdAt: now, lastLoginAt: now }
      });
    }

    if (method === 'POST' && path === '/api/auth/logout') {
      clearAuthCookies(res);
      return sendJson(res, 200, { ok: true });
    }

    // ---------- 3. ROUTES AUTHENTIFIÉES (Étudiant + Admin) ----------
    const user = await getSessionUser(req, res);
    if (!user) {
      return sendJson(res, 401, { error: 'Authentification requise. Veuillez vous connecter.' });
    }

    // GET /api/catalog (STRICTEMENT cours status = 'published')
    if (method === 'GET' && path === '/api/catalog') {
      const [{ data: pubCourses }, { data: allMods }, { data: metaRows }] = await Promise.all([
        admin.from('courses').select('*').eq('status', 'published'),
        admin.from('modules').select('*').order('code'),
        admin.from('site_meta').select('key, value').in('key', ['bmAudit', 'bmErrors', 'outOfCourseBM', 'masterExamAnalysis', 'masterFinalStrategy'])
      ]);
      const sortRank = (c) => {
        const mC = String(c.code || c.id || '').match(/^C(\d+)$/i);
        if (mC) return parseInt(mC[1], 10);
        const mP = String(c.code || '').match(/^PPT(\d+)$/i);
        if (mP) return 100 + parseInt(mP[1], 10);
        return 500;
      };
      const courses = (pubCourses || []).map(mapCourseRow).sort((a, b) => sortRank(a) - sortRank(b) || String(a.id).localeCompare(String(b.id)));
      const pubCourseIds = courses.map((c) => c.id);
      const pubModIds = new Set(courses.map((c) => c.moduleId));

      const [{ data: fcRows }, { data: qRows }] = pubCourseIds.length
        ? await Promise.all([
            admin.from('flashcards').select('*').in('course_id', pubCourseIds),
            admin.from('qcms').select('*').in('course_id', pubCourseIds)
          ])
        : [{ data: [] }, { data: [] }];

      const modules = (allMods || [])
        .filter((m) => pubModIds.has(m.id))
        .map((m) => ({
          ...mapModuleRow(m),
          courseIds: courses.filter((c) => c.moduleId === m.id).map((c) => c.id)
        }));

      const metaMap = {};
      (metaRows || []).forEach((r) => { metaMap[r.key] = r.value; });

      return sendJson(res, 200, {
        seeded: courses.length > 0,
        modules,
        courses,
        flashcards: (fcRows || []).map(mapFlashcardRow),
        qcms: (qRows || []).map(mapQcmRow),
        bmAudit: metaMap.bmAudit || {},
        bmErrors: Array.isArray(metaMap.bmErrors) ? metaMap.bmErrors : [],
        outOfCourseBM: Array.isArray(metaMap.outOfCourseBM) ? metaMap.outOfCourseBM : [],
        masterExamAnalysis: metaMap.masterExamAnalysis || null,
        masterFinalStrategy: metaMap.masterFinalStrategy || null
      });
    }

    // GET / PUT /api/progress
    if (method === 'GET' && path === '/api/progress') {
      const { data: row } = await admin.from('student_progress').select('progress').eq('user_id', user.id).maybeSingle();
      if (!row || !row.progress) {
        const fresh = createEmptyProgress(user.id, user.name);
        await admin.from('student_progress').upsert({ user_id: user.id, progress: fresh, updated_at: new Date().toISOString() });
        return sendJson(res, 200, { ok: true, progress: fresh });
      }
      return sendJson(res, 200, { ok: true, progress: row.progress });
    }

    if (method === 'PUT' && path === '/api/progress') {
      const body = await readJsonBody(req);
      if (!body || !body.progress) return sendJson(res, 400, { error: 'Payload de progression manquant.' });
      const prog = { ...body.progress, id: user.id, name: user.name };
      await admin.from('student_progress').upsert({
        user_id: user.id,
        progress: prog,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      return sendJson(res, 200, { ok: true });
    }

    // GET /api/files/:fileId (Protégé : bloque les étudiants en 403 si le cours n'est pas publié !)
    const fileMatch = path.match(/^\/api\/files\/([a-zA-Z0-9_-]+)$/);
    if (method === 'GET' && fileMatch) {
      const fileId = fileMatch[1];
      const { data: allCourses } = await admin.from('courses').select('id, status, attachments');
      let foundCourse = null;
      let foundAtt = null;
      for (const c of (allCourses || [])) {
        const att = (Array.isArray(c.attachments) ? c.attachments : []).find((a) => a.id === fileId);
        if (att) { foundCourse = c; foundAtt = att; break; }
      }
      if (!foundAtt) return sendJson(res, 404, { error: 'Fichier introuvable.' });
      if (user.role !== 'admin' && foundCourse.status !== 'published') {
        return sendJson(res, 403, { error: 'Accès refusé : ce fichier appartient à un cours non publié.' });
      }

      const storagePath = foundAtt.storagePath || `${foundCourse.id}/${foundAtt.storedName}`;
      const { data: signed, error: signErr } = await admin.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(storagePath, 120);
      if (signErr || !signed || !signed.signedUrl) {
        return sendJson(res, 404, { error: 'Fichier introuvable dans le stockage cloud.' });
      }
      res.statusCode = 302;
      res.setHeader('Location', signed.signedUrl);
      res.setHeader('Cache-Control', 'private, no-store');
      res.end();
      return;
    }

    // ---------- 4. ROUTES ADMINISTRATEUR STRICTEMENT PROTÉGÉES (RBAC SERVEUR) ----------
    if (path.startsWith('/api/admin')) {
      if (user.role !== 'admin') {
        return sendJson(res, 403, { error: 'Accès interdit (403) : réservé exclusivement aux administrateurs autorisés.' });
      }

      // GET /api/admin/catalog
      if (method === 'GET' && path === '/api/admin/catalog') {
        const [{ data: mods }, { data: courses }, { data: fcs }, { data: qs }, { data: bks }, { data: users }, { data: metaRows }, { data: jobsRows }] = await Promise.all([
          admin.from('modules').select('*').order('code'),
          admin.from('courses').select('*').order('updated_at', { ascending: false }),
          admin.from('flashcards').select('*'),
          admin.from('qcms').select('*'),
          admin.from('db_backups').select('filename, size_bytes, created_at').order('created_at', { ascending: false }).limit(25),
          admin.from('profiles').select('id, email, name, role, created_at, last_login_at').order('created_at'),
          admin.from('site_meta').select('key, value').in('key', ['aiConfig', 'sourceInventory', 'bmAudit', 'bmErrors', 'outOfCourseBM', 'masterExamAnalysis', 'masterFinalStrategy']),
          admin.from('course_import_jobs').select('id, course_id, created_by, status, current_stage, current_stage_key, progress_pct, ai_mode, stages, logs, quality_report, error_message, retry_count, created_at, updated_at, completed_at').order('created_at', { ascending: false }).limit(50)
        ]);
        const metaMap = {};
        (metaRows || []).forEach((r) => { metaMap[r.key] = r.value; });
        const aiMeta = metaMap.aiConfig || {};
        const srvAi = getServerAiConfig(aiMeta);
        return sendJson(res, 200, {
          modules: (mods || []).map(mapModuleRow),
          courses: (courses || []).map(mapCourseRow),
          flashcards: (fcs || []).map(mapFlashcardRow),
          qcms: (qs || []).map(mapQcmRow),
          backups: (bks || []).map((b) => ({ filename: b.filename, sizeBytes: b.size_bytes, createdAt: b.created_at })),
          users: (users || []).map((u) => ({ id: u.id, email: u.email, name: u.name, role: u.role, createdAt: u.created_at, lastLoginAt: u.last_login_at })),
          importJobs: (jobsRows || []).map((j) => mapImportJobRow(j, false)),
          sourceInventory: Array.isArray(metaMap.sourceInventory) ? metaMap.sourceInventory : [],
          bmAudit: metaMap.bmAudit || {},
          bmErrors: Array.isArray(metaMap.bmErrors) ? metaMap.bmErrors : [],
          outOfCourseBM: Array.isArray(metaMap.outOfCourseBM) ? metaMap.outOfCourseBM : [],
          masterExamAnalysis: metaMap.masterExamAnalysis || null,
          masterFinalStrategy: metaMap.masterFinalStrategy || null,
          aiConfig: {
            provider: srvAi.provider,
            model: srvAi.model,
            configured: srvAi.enabled,
            envControlled: true
          }
        });
      }

      // MODULES CRUD
      if (method === 'POST' && path === '/api/admin/modules') {
        const body = await readJsonBody(req);
        const title = String(body.title || '').trim();
        const subject = String(body.subject || title).trim();
        if (title.length < 2) return sendJson(res, 400, { error: 'Le titre du module médical est requis (≥ 2 caractères).' });
        const { count } = await admin.from('modules').select('id', { count: 'exact', head: true });
        const now = new Date().toISOString();
        const row = {
          id: makeId('M'),
          code: String(body.code || '').trim() || `Module ${(count || 0) + 1}`,
          subject,
          title,
          description: String(body.description || `Cours et révisions de ${subject}.`).trim(),
          accent: /^#[0-9a-fA-F]{6}$/.test(body.accent || '') ? body.accent : '#1d4ed8',
          course_ids: [],
          created_at: now,
          updated_at: now
        };
        const { error } = await admin.from('modules').insert(row);
        if (error) return sendJson(res, 500, { error: error.message });
        return sendJson(res, 201, { ok: true, module: mapModuleRow(row) });
      }

      const modIdMatch = path.match(/^\/api\/admin\/modules\/([a-zA-Z0-9_-]+)$/);
      if (modIdMatch && method === 'PUT') {
        const mid = modIdMatch[1];
        const body = await readJsonBody(req);
        const patch = { updated_at: new Date().toISOString() };
        if (body.title) patch.title = String(body.title).trim();
        if (body.subject) patch.subject = String(body.subject).trim();
        if (body.code) patch.code = String(body.code).trim();
        if (body.description !== undefined) patch.description = String(body.description).trim();
        if (/^#[0-9a-fA-F]{6}$/.test(body.accent || '')) patch.accent = body.accent;
        const { data, error } = await admin.from('modules').update(patch).eq('id', mid).select('*').maybeSingle();
        if (error || !data) return sendJson(res, 404, { error: 'Module introuvable.' });
        return sendJson(res, 200, { ok: true, module: mapModuleRow(data) });
      }

      if (modIdMatch && method === 'DELETE') {
        const mid = modIdMatch[1];
        const { count } = await admin.from('courses').select('id', { count: 'exact', head: true }).eq('module_id', mid);
        if ((count || 0) > 0) {
          return sendJson(res, 409, { error: "Impossible de supprimer un module contenant encore des cours. Déplacez ou supprimez ses cours d'abord." });
        }
        await createCloudBackup(admin, 'delete_module');
        await admin.from('modules').delete().eq('id', mid);
        return sendJson(res, 200, { ok: true });
      }

      // CREATE COURSE (DRAFT)
      if (method === 'POST' && path === '/api/admin/courses') {
        const body = await readJsonBody(req);
        const title = String(body.title || '').trim();
        const moduleId = String(body.moduleId || '').trim();
        if (title.length < 3 || !moduleId) {
          return sendJson(res, 400, { error: 'Module médical et titre du cours (≥ 3 caractères) requis.' });
        }
        const { count } = await admin.from('courses').select('id', { count: 'exact', head: true });
        const now = new Date().toISOString();
        const cid = makeId('CRS');
        const priority = body.priority || 'medium';
        const row = {
          id: cid,
          module_id: moduleId,
          code: String(body.code || '').trim() || `C${(count || 0) + 1}`,
          title,
          short_title: String(body.shortTitle || title.slice(0, 28)).trim(),
          professor: String(body.professor || 'Enseignant — Faculté de Médecine').trim(),
          source_files: [],
          priority,
          priority_score: priority === 'very_high' ? 85 : (priority === 'high' ? 70 : (priority === 'low' ? 30 : 50)),
          vigilance_2026: !!body.vigilance2026,
          summary: String(body.summary || '').trim(),
          academic_year: String(body.academicYear || '').trim(),
          metadata: body.metadata && typeof body.metadata === 'object' ? body.metadata : {},
          status: 'draft',
          version: 1,
          lessons: [],
          attachments: [],
          ai_extraction: { analyzedAt: null, engine: 'none', totalPages: 0, lowConfidencePages: [], warnings: [], status: 'none' },
          created_at: now,
          updated_at: now
        };
        const { error } = await admin.from('courses').insert(row);
        if (error) return sendJson(res, 400, { error: error.message });
        await syncModuleCourseIds(admin);
        return sendJson(res, 201, { ok: true, course: mapCourseRow(row) });
      }

      // DIRECT SIGNED UPLOAD INIT (contourne la limite de 4,5 Mo de Vercel -> jusqu'à 35 Mo !)
      const uploadInitMatch = path.match(/^\/api\/admin\/courses\/([a-zA-Z0-9_-]+)\/upload-init$/);
      if (method === 'POST' && uploadInitMatch) {
        const cid = uploadInitMatch[1];
        const body = await readJsonBody(req);
        const origName = String(body.fileName || '').replace(/.*[\\/]/, '').trim();
        const kind = String(body.kind || 'primary_source');
        const sizeBytes = Number(body.sizeBytes) || 0;
        const ext = (origName.match(/(\.[a-zA-Z0-9]+)$/) || ['', ''])[1].toLowerCase();

        const allowedPrimary = ['.pdf', '.pptx', '.ppt'];
        const allowedSupport = ['.pdf', '.pptx', '.ppt', '.txt', '.md', '.docx', '.png', '.jpg', '.jpeg'];
        if (kind !== 'support_doc' && !allowedPrimary.includes(ext)) {
          return sendJson(res, 400, { error: 'Format principal refusé : seuls .pdf, .pptx et .ppt sont acceptés.' });
        }
        if (!allowedSupport.includes(ext)) {
          return sendJson(res, 400, { error: `Extension non autorisée (${ext}).` });
        }
        if (sizeBytes <= 0 || sizeBytes > 35 * 1024 * 1024) {
          return sendJson(res, 400, { error: 'Taille de fichier invalide (limite : 35 Mo).' });
        }

        const fileId = `file_${crypto.randomBytes(6).toString('hex')}`;
        const storedName = `${fileId}${ext}`;
        const storagePath = `${cid}/${storedName}`;

        const { data, error } = await admin.storage.from(STORAGE_BUCKET).createSignedUploadUrl(storagePath);
        if (error || !data) {
          return sendJson(res, 500, { error: `Erreur Supabase Storage : ${error?.message || 'signed upload impossible'}` });
        }
        return sendJson(res, 200, {
          ok: true,
          fileId,
          storedName,
          storagePath,
          mimeType: MIME_MAP[ext] || 'application/octet-stream',
          signedUrl: data.signedUrl,
          token: data.token
        });
      }

      // DIRECT SIGNED UPLOAD COMPLETE (valide la signature binaire et enregistre en PostgreSQL)
      const uploadCompMatch = path.match(/^\/api\/admin\/courses\/([a-zA-Z0-9_-]+)\/upload-complete$/);
      if (method === 'POST' && uploadCompMatch) {
        const cid = uploadCompMatch[1];
        const body = await readJsonBody(req);
        const { data: cRow } = await admin.from('courses').select('*').eq('id', cid).maybeSingle();
        if (!cRow) return sendJson(res, 404, { error: 'Cours introuvable.' });

        const storagePath = String(body.storagePath || '');
        if (!storagePath.startsWith(`${cid}/`) || storagePath.includes('..')) {
          return sendJson(res, 400, { error: 'Chemin de stockage invalide.' });
        }
        const origName = String(body.originalName || '').replace(/.*[\\/]/, '').trim();
        const ext = (origName.match(/(\.[a-zA-Z0-9]+)$/) || ['', ''])[1].toLowerCase();

        // Vérifier le fichier réellement uploadé dans Supabase Storage
        const { data: blob, error: dlErr } = await admin.storage.from(STORAGE_BUCKET).download(storagePath);
        if (dlErr || !blob) return sendJson(res, 400, { error: 'Fichier introuvable dans Supabase Storage après upload.' });
        const buf = Buffer.from(await blob.arrayBuffer());
        const magic = validateFileMagicBytes(buf, ext);
        if (!magic.ok) {
          await admin.storage.from(STORAGE_BUCKET).remove([storagePath]);
          return sendJson(res, 400, { error: magic.error });
        }

        const normKind = body.kind === 'support_doc' ? 'support_doc' : (ext === '.pptx' || ext === '.ppt' ? 'primary_ppt' : 'primary_pdf');
        const att = {
          id: String(body.fileId),
          courseId: cid,
          originalName: origName,
          storedName: String(body.storedName),
          storagePath,
          kind: normKind,
          sizeBytes: buf.length,
          mimeType: MIME_MAP[ext] || 'application/octet-stream',
          pageCount: null,
          uploadedAt: new Date().toISOString()
        };

        const atts = [...(Array.isArray(cRow.attachments) ? cRow.attachments : []), att];
        const srcs = [...(Array.isArray(cRow.source_files) ? cRow.source_files : [])];
        if (!srcs.includes(origName)) srcs.push(origName);

        const { data: updated } = await admin.from('courses')
          .update({ attachments: atts, source_files: srcs, updated_at: new Date().toISOString() })
          .eq('id', cid)
          .select('*')
          .single();

        return sendJson(res, 201, { ok: true, file: att, course: mapCourseRow(updated) });
      }

      // DELETE FILE
      const delFileMatch = path.match(/^\/api\/admin\/courses\/([a-zA-Z0-9_-]+)\/files\/([a-zA-Z0-9_-]+)$/);
      if (method === 'DELETE' && delFileMatch) {
        const [, cid, fid] = delFileMatch;
        const { data: cRow } = await admin.from('courses').select('*').eq('id', cid).maybeSingle();
        if (!cRow) return sendJson(res, 404, { error: 'Cours introuvable.' });
        const atts = Array.isArray(cRow.attachments) ? cRow.attachments : [];
        const target = atts.find((a) => a.id === fid);
        if (target) {
          await admin.storage.from(STORAGE_BUCKET).remove([target.storagePath || `${cid}/${target.storedName}`]);
        }
        const kept = atts.filter((a) => a.id !== fid);
        const { data: updated } = await admin.from('courses').update({ attachments: kept, updated_at: new Date().toISOString() }).eq('id', cid).select('*').single();
        return sendJson(res, 200, { ok: true, course: mapCourseRow(updated) });
      }

      // ---------- PIPELINE UNIVERSEL 11 ÉTAPES (JOBS PERSISTANTS + REPRISE + CONTRÔLE QUALITÉ) ----------
      const downloadCourseFilesFromStorage = async (fileList) => {
        const out = [];
        for (const f of (fileList || [])) {
          const { data: blob, error: dlErr } = await admin.storage.from(STORAGE_BUCKET).download(f.storagePath);
          if (dlErr || !blob) throw new Error(`Fichier introuvable dans Supabase Storage : ${f.originalName}`);
          out.push({
            fileId: f.fileId,
            originalName: f.originalName,
            kind: f.kind,
            buffer: Buffer.from(await blob.arrayBuffer())
          });
        }
        return out;
      };

      const commitFinalJobPayload = async (cid, courseObj, finalPayload) => {
        const now = new Date().toISOString();
        const patch = {
          lessons: finalPayload.lessons,
          ai_extraction: finalPayload.aiExtraction,
          status: 'draft',
          updated_at: now
        };
        if (finalPayload.pptImport) patch.ppt_import = finalPayload.pptImport;
        if (finalPayload.detectedProfessor && (!courseObj.professor || /Enseignant — Faculté de Médecine/i.test(courseObj.professor))) {
          patch.professor = finalPayload.detectedProfessor;
        }
        if (finalPayload.detectedAcademicYear && !courseObj.academicYear) {
          patch.academic_year = finalPayload.detectedAcademicYear;
        }
        patch.metadata = {
          ...(courseObj.metadata || {}),
          lastQualityReport: finalPayload.qualityReport,
          approved: false
        };
        const { data: updatedCourse } = await admin.from('courses').update(patch).eq('id', cid).select('*').single();

        await admin.from('flashcards').delete().eq('course_id', cid);
        if (finalPayload.flashcards.length) {
          await admin.from('flashcards').insert(finalPayload.flashcards.map((f) => flashcardToDbRow(f, cid)));
        }
        await admin.from('qcms').delete().eq('course_id', cid);
        if (finalPayload.qcms.length) {
          await admin.from('qcms').insert(finalPayload.qcms.map((q) => qcmToDbRow(q, cid)));
        }
        return mapCourseRow(updatedCourse);
      };

      // POST /api/admin/courses/:id/jobs — Créer un job de traitement universel (exécute l'étape 1 immédiatement)
      const createJobMatch = path.match(/^\/api\/admin\/courses\/([a-zA-Z0-9_-]+)\/jobs$/);
      if (method === 'POST' && createJobMatch) {
        const cid = createJobMatch[1];
        const { data: cRow } = await admin.from('courses').select('*').eq('id', cid).maybeSingle();
        if (!cRow) return sendJson(res, 404, { error: 'Cours introuvable.' });
        const course = mapCourseRow(cRow);

        await createCloudBackup(admin, `pre_import_${cid}`);
        const { data: aiRow } = await admin.from('site_meta').select('value').eq('key', 'aiConfig').maybeSingle();
        const aiCfg = getServerAiConfig(aiRow?.value);

        const jobId = makeId('JOB');
        const now = new Date().toISOString();
        const initialJob = {
          id: jobId,
          course_id: cid,
          created_by: user.id,
          status: 'running',
          current_stage: 1,
          current_stage_key: STAGE_DEFINITIONS[0].key,
          progress_pct: 0,
          ai_mode: aiCfg.enabled ? `${aiCfg.provider}:${aiCfg.model}` : 'deterministic_medical',
          stages: createInitialStages(),
          logs: [{ ts: now, stage: 1, key: 'file_uploaded', level: 'info', message: `Job universel ${jobId} démarré pour « ${course.title} ».` }],
          artifacts: {},
          quality_report: {},
          error_message: '',
          retry_count: 0,
          created_at: now,
          updated_at: now
        };
        const { error: insErr } = await admin.from('course_import_jobs').insert(initialJob);
        if (insErr) return sendJson(res, 500, { error: insErr.message });

        const step1 = await executeImportJobStage({
          job: mapImportJobRow(initialJob, true),
          course,
          existingCourses: [],
          downloadFilesFn: downloadCourseFilesFromStorage,
          siteMetaAiConfig: aiRow?.value,
          targetStage: 1
        });

        const { data: savedJob } = await admin.from('course_import_jobs').update({
          status: step1.status,
          current_stage: step1.currentStage,
          current_stage_key: step1.currentStageKey,
          progress_pct: step1.progressPct,
          ai_mode: step1.aiMode,
          stages: step1.stages,
          logs: step1.logs,
          artifacts: step1.artifacts,
          error_message: step1.errorMessage,
          updated_at: new Date().toISOString()
        }).eq('id', jobId).select('*').single();

        if (!step1.ok) {
          return sendJson(res, 400, { ok: false, error: step1.errorMessage, job: mapImportJobRow(savedJob, false) });
        }
        return sendJson(res, 201, { ok: true, job: mapImportJobRow(savedJob, false) });
      }

      // GET /api/admin/courses/:id/jobs — Historique des jobs pour un cours
      if (method === 'GET' && createJobMatch) {
        const cid = createJobMatch[1];
        const { data: rows } = await admin
          .from('course_import_jobs')
          .select('id, course_id, created_by, status, current_stage, current_stage_key, progress_pct, ai_mode, stages, logs, quality_report, error_message, retry_count, created_at, updated_at, completed_at')
          .eq('course_id', cid)
          .order('created_at', { ascending: false })
          .limit(10);
        return sendJson(res, 200, { ok: true, jobs: (rows || []).map((r) => mapImportJobRow(r, false)) });
      }

      // GET /api/admin/jobs/:jobId — État détaillé d'un job
      const jobIdMatch = path.match(/^\/api\/admin\/jobs\/([a-zA-Z0-9_-]+)$/);
      if (method === 'GET' && jobIdMatch) {
        const jid = jobIdMatch[1];
        const { data: jRow } = await admin.from('course_import_jobs').select('id, course_id, created_by, status, current_stage, current_stage_key, progress_pct, ai_mode, stages, logs, quality_report, error_message, retry_count, created_at, updated_at, completed_at').eq('id', jid).maybeSingle();
        if (!jRow) return sendJson(res, 404, { error: 'Job introuvable.' });
        return sendJson(res, 200, { ok: true, job: mapImportJobRow(jRow, false) });
      }

      // POST /api/admin/jobs/:jobId/step — Exécuter l'étape suivante (ou réessayer une étape précise)
      const jobStepMatch = path.match(/^\/api\/admin\/jobs\/([a-zA-Z0-9_-]+)\/step$/);
      if (method === 'POST' && jobStepMatch) {
        const jid = jobStepMatch[1];
        const body = await readJsonBody(req);
        const { data: jRow } = await admin.from('course_import_jobs').select('*').eq('id', jid).maybeSingle();
        if (!jRow) return sendJson(res, 404, { error: 'Job introuvable.' });
        const { data: cRow } = await admin.from('courses').select('*').eq('id', jRow.course_id).maybeSingle();
        if (!cRow) return sendJson(res, 404, { error: 'Cours introuvable.' });

        const jobObj = mapImportJobRow(jRow, true);
        const course = mapCourseRow(cRow);
        const targetStage = body?.retryStage ? Number(body.retryStage) : jobObj.currentStage;
        const isRetry = !!body?.retryStage || jobObj.status === 'failed';

        const [{ data: aiRow }, { data: allRows }] = await Promise.all([
          admin.from('site_meta').select('value').eq('key', 'aiConfig').maybeSingle(),
          targetStage === 4 ? admin.from('courses').select('id, code, title, short_title, source_files, ppt_import') : Promise.resolve({ data: [] })
        ]);

        const stepOut = await executeImportJobStage({
          job: jobObj,
          course,
          existingCourses: (allRows || []).map(mapCourseRow),
          downloadFilesFn: downloadCourseFilesFromStorage,
          siteMetaAiConfig: aiRow?.value,
          targetStage
        });

        let savedCourse = null;
        let finalFlashcards = null;
        let finalQcms = null;
        if (stepOut.completed && stepOut.artifacts?.finalPayload) {
          const fp = stepOut.artifacts.finalPayload;
          savedCourse = await commitFinalJobPayload(course.id, course, fp);
          finalFlashcards = fp.flashcards;
          finalQcms = fp.qcms;
          // Retirer le doublon finalPayload des artifacts persistés pour garder la ligne DB compacte
          delete stepOut.artifacts.finalPayload;
        }

        const now = new Date().toISOString();
        const { data: updatedJobRow } = await admin.from('course_import_jobs').update({
          status: stepOut.status,
          current_stage: stepOut.currentStage,
          current_stage_key: stepOut.currentStageKey,
          progress_pct: stepOut.progressPct,
          ai_mode: stepOut.aiMode,
          stages: stepOut.stages,
          logs: stepOut.logs,
          artifacts: stepOut.artifacts,
          quality_report: stepOut.qualityReport,
          error_message: stepOut.errorMessage,
          retry_count: isRetry ? (jobObj.retryCount + 1) : jobObj.retryCount,
          updated_at: now,
          completed_at: stepOut.completed ? now : null
        }).eq('id', jid).select('*').single();

        return sendJson(res, stepOut.ok ? 200 : 400, {
          ok: stepOut.ok,
          completed: stepOut.completed,
          error: stepOut.ok ? undefined : stepOut.errorMessage,
          job: mapImportJobRow(updatedJobRow, false),
          course: savedCourse,
          flashcards: finalFlashcards,
          qcms: finalQcms
        });
      }

      // POST /api/admin/courses/:id/lessons/:lessonId/regenerate — Régénérer UNE leçon/section
      const regenMatch = path.match(/^\/api\/admin\/courses\/([a-zA-Z0-9_-]+)\/lessons\/([a-zA-Z0-9_.-]+)\/regenerate$/);
      if (method === 'POST' && regenMatch) {
        const [, cid, lid] = regenMatch;
        const [{ data: cRow }, { data: fcs }, { data: qs }, { data: latestJob }, { data: aiRow }] = await Promise.all([
          admin.from('courses').select('*').eq('id', cid).maybeSingle(),
          admin.from('flashcards').select('*').eq('course_id', cid),
          admin.from('qcms').select('*').eq('course_id', cid),
          admin.from('course_import_jobs').select('artifacts').eq('course_id', cid).order('created_at', { ascending: false }).limit(1).maybeSingle(),
          admin.from('site_meta').select('value').eq('key', 'aiConfig').maybeSingle()
        ]);
        if (!cRow) return sendJson(res, 404, { error: 'Cours introuvable.' });

        await createCloudBackup(admin, `pre_regen_${lid}`);
        const course = mapCourseRow(cRow);
        const regRes = await regenerateSingleLesson({
          course,
          lessonId: lid,
          existingFlashcards: (fcs || []).map(mapFlashcardRow),
          existingQcms: (qs || []).map(mapQcmRow),
          latestJobArtifacts: latestJob?.artifacts || {},
          siteMetaAiConfig: aiRow?.value
        });
        if (!regRes.ok) return sendJson(res, 400, { error: regRes.error });

        const now = new Date().toISOString();
        const nextAi = { ...(course.aiExtraction || {}), qualityReport: regRes.qualityReport };
        const { data: upCourse } = await admin.from('courses').update({
          lessons: regRes.lessons,
          ai_extraction: nextAi,
          metadata: { ...(course.metadata || {}), lastQualityReport: regRes.qualityReport },
          updated_at: now
        }).eq('id', cid).select('*').single();

        await admin.from('flashcards').delete().eq('course_id', cid);
        if (regRes.flashcards.length) {
          await admin.from('flashcards').insert(regRes.flashcards.map((f) => flashcardToDbRow(f, cid)));
        }
        await admin.from('qcms').delete().eq('course_id', cid);
        if (regRes.qcms.length) {
          await admin.from('qcms').insert(regRes.qcms.map((q) => qcmToDbRow(q, cid)));
        }

        return sendJson(res, 200, {
          ok: true,
          course: mapCourseRow(upCourse),
          lesson: regRes.lesson,
          flashcards: regRes.flashcards,
          qcms: regRes.qcms,
          qualityReport: regRes.qualityReport
        });
      }

      // POST /api/admin/courses/:id/quality-check — Exécuter l'audit qualité 9 points à la demande
      const qcMatch = path.match(/^\/api\/admin\/courses\/([a-zA-Z0-9_-]+)\/quality-check$/);
      if (method === 'POST' && qcMatch) {
        const cid = qcMatch[1];
        const body = await readJsonBody(req);
        const [{ data: cRow }, { data: fcs }, { data: qs }] = await Promise.all([
          admin.from('courses').select('*').eq('id', cid).maybeSingle(),
          admin.from('flashcards').select('*').eq('course_id', cid),
          admin.from('qcms').select('*').eq('course_id', cid)
        ]);
        if (!cRow) return sendJson(res, 404, { error: 'Cours introuvable.' });
        const targetCourse = body?.course || mapCourseRow(cRow);
        const targetFc = Array.isArray(body?.flashcards) ? body.flashcards : (fcs || []).map(mapFlashcardRow);
        const targetQ = Array.isArray(body?.qcms) ? body.qcms : (qs || []).map(mapQcmRow);
        const qualityReport = runQualityAudit(targetCourse, targetFc, targetQ);

        await admin.from('courses').update({
          ai_extraction: { ...(cRow.ai_extraction || {}), qualityReport },
          metadata: { ...(cRow.metadata || {}), lastQualityReport: qualityReport }
        }).eq('id', cid);

        return sendJson(res, 200, { ok: true, qualityReport });
      }

      // POST /api/admin/courses/:id/approve — Approuver (et publier optionnellement) après contrôle qualité
      const approveMatch = path.match(/^\/api\/admin\/courses\/([a-zA-Z0-9_-]+)\/approve$/);
      if (method === 'POST' && approveMatch) {
        const cid = approveMatch[1];
        const body = await readJsonBody(req);
        const [{ data: cRow }, { data: fcs }, { data: qs }] = await Promise.all([
          admin.from('courses').select('*').eq('id', cid).maybeSingle(),
          admin.from('flashcards').select('*').eq('course_id', cid),
          admin.from('qcms').select('*').eq('course_id', cid)
        ]);
        if (!cRow) return sendJson(res, 404, { error: 'Cours introuvable.' });

        const course = mapCourseRow(cRow);
        const qualityReport = runQualityAudit(course, (fcs || []).map(mapFlashcardRow), (qs || []).map(mapQcmRow));
        if (qualityReport.blockingCount > 0 && !body?.forceOverride) {
          return sendJson(res, 400, {
            error: `Publication bloquée : ${qualityReport.blockingCount} erreur(s) qualité bloquante(s) à corriger avant approbation.`,
            qualityReport
          });
        }

        await createCloudBackup(admin, `approve_${cid}`);
        const now = new Date().toISOString();
        const shouldPublish = body?.publish !== false;
        const cleanLessons = (course.lessons || []).map((l) => ({ ...l, needsReview: false }));
        const nextMeta = {
          ...(course.metadata || {}),
          lastQualityReport: qualityReport,
          approved: true,
          approvedAt: now,
          approvedBy: user.email
        };
        const patch = {
          lessons: cleanLessons,
          status: shouldPublish ? 'published' : course.status,
          published_at: shouldPublish ? (course.publishedAt || now) : course.publishedAt,
          ai_extraction: { ...(course.aiExtraction || {}), qualityReport, status: 'approved' },
          metadata: nextMeta,
          updated_at: now
        };
        if (course.pptImport) {
          patch.ppt_import = { ...course.pptImport, importStatus: 'approved' };
        }
        const { data: upCourse } = await admin.from('courses').update(patch).eq('id', cid).select('*').single();
        await admin.from('flashcards').update({ needs_review: false }).eq('course_id', cid);
        await admin.from('qcms').update({ needs_review: false }).eq('course_id', cid);

        return sendJson(res, 200, { ok: true, course: mapCourseRow(upCourse), qualityReport });
      }

      // ANALYZE COURSE (Compatibilité rétroactive — exécute l'intégralité du pipeline universel 11 étapes)
      const analyzeMatch = path.match(/^\/api\/admin\/courses\/([a-zA-Z0-9_-]+)\/analyze$/);
      if (method === 'POST' && analyzeMatch) {
        const cid = analyzeMatch[1];
        const { data: cRow } = await admin.from('courses').select('*').eq('id', cid).maybeSingle();
        if (!cRow) return sendJson(res, 404, { error: 'Cours introuvable.' });
        const course = mapCourseRow(cRow);

        await createCloudBackup(admin, `pre_analyze_${cid}`);
        const [{ data: aiRow }, { data: allRows }] = await Promise.all([
          admin.from('site_meta').select('value').eq('key', 'aiConfig').maybeSingle(),
          admin.from('courses').select('id, code, title, short_title, source_files, ppt_import')
        ]);

        const jobId = makeId('JOB');
        let jobState = {
          id: jobId,
          courseId: cid,
          status: 'running',
          currentStage: 1,
          stages: createInitialStages(),
          logs: [],
          artifacts: {},
          qualityReport: {}
        };
        const existingMapped = (allRows || []).map(mapCourseRow);
        for (let st = 1; st <= 11; st++) {
          const out = await executeImportJobStage({
            job: jobState,
            course,
            existingCourses: existingMapped,
            downloadFilesFn: downloadCourseFilesFromStorage,
            siteMetaAiConfig: aiRow?.value,
            targetStage: st
          });
          jobState = { ...jobState, ...out };
          if (!out.ok) return sendJson(res, 400, { error: out.errorMessage });
        }

        const fp = jobState.artifacts.finalPayload;
        const savedCourse = await commitFinalJobPayload(cid, course, fp);
        return sendJson(res, 200, {
          ok: true,
          course: savedCourse,
          flashcards: fp.flashcards,
          qcms: fp.qcms,
          aiExtraction: fp.aiExtraction,
          pptImport: fp.pptImport,
          qualityReport: fp.qualityReport
        });
      }

      // UPDATE COURSE (préserve progrès étudiant + flag révision majeure)
      const courseIdMatch = path.match(/^\/api\/admin\/courses\/([a-zA-Z0-9_-]+)$/);
      if (courseIdMatch && method === 'PUT') {
        const cid = courseIdMatch[1];
        const body = await readJsonBody(req);
        const { data: exRow } = await admin.from('courses').select('*').eq('id', cid).maybeSingle();
        if (!exRow) return sendJson(res, 404, { error: 'Cours introuvable.' });

        await createCloudBackup(admin, `update_${cid}`);
        const existing = mapCourseRow(exRow);
        const incoming = body.course || existing;
        const majorIds = new Set(Array.isArray(body.majorLessonIds) ? body.majorLessonIds : []);
        const oldMap = new Map((existing.lessons || []).map((l) => [l.id, l]));

        const newLessons = (incoming.lessons || []).map((nl, idx) => {
          const oldL = oldMap.get(nl.id);
          const prevRev = Number(oldL?.revisionVersion) || 1;
          const isMajor = existing.status === 'published' && oldL && majorIds.has(nl.id);
          return {
            ...nl,
            courseId: cid,
            order: idx + 1,
            revisionVersion: isMajor ? prevRev + 1 : prevRev,
            majorUpdateNote: isMajor
              ? (nl.majorUpdateNote || `Contenu mis à jour le ${new Date().toLocaleDateString('fr-FR')} — révision conseillée (votre progression antérieure a été conservée).`)
              : (nl.majorUpdateNote || '')
          };
        });

        const targetStatus = body.publish === true ? 'published' : (incoming.status || existing.status);
        const now = new Date().toISOString();
        const pptImport = existing.pptImport ? {
          ...existing.pptImport,
          lessonsCreated: newLessons.length,
          chaptersCreated: newLessons.length,
          flashcardsGenerated: Array.isArray(body.flashcards) ? body.flashcards.length : existing.pptImport.flashcardsGenerated,
          qcmsGenerated: Array.isArray(body.qcms) ? body.qcms.length : existing.pptImport.qcmsGenerated,
          importStatus: targetStatus === 'published' ? 'approved' : existing.pptImport.importStatus
        } : null;

        const mergedCourse = {
          ...existing,
          ...incoming,
          id: cid,
          lessons: newLessons,
          attachments: existing.attachments,
          aiExtraction: existing.aiExtraction,
          pptImport,
          status: targetStatus,
          version: existing.status === 'published' ? (existing.version || 1) + 1 : (existing.version || 1),
          publishedAt: targetStatus === 'published' ? (existing.publishedAt || now) : existing.publishedAt
        };

        const { data: savedRow, error: saveErr } = await admin.from('courses').update(courseToDbRow(mergedCourse)).eq('id', cid).select('*').single();
        if (saveErr) return sendJson(res, 500, { error: saveErr.message });

        if (Array.isArray(body.flashcards)) {
          await admin.from('flashcards').delete().eq('course_id', cid);
          if (body.flashcards.length) {
            await admin.from('flashcards').insert(body.flashcards.map((f) => flashcardToDbRow(f, cid)));
          }
        }
        if (Array.isArray(body.qcms)) {
          await admin.from('qcms').delete().eq('course_id', cid);
          if (body.qcms.length) {
            await admin.from('qcms').insert(body.qcms.map((q) => qcmToDbRow(q, cid)));
          }
        }

        await syncModuleCourseIds(admin);
        return sendJson(res, 200, { ok: true, course: mapCourseRow(savedRow) });
      }

      // CHANGE STATUS (Publier / Dépublier / Archiver sans supprimer le progrès étudiant)
      const statusMatch = path.match(/^\/api\/admin\/courses\/([a-zA-Z0-9_-]+)\/status$/);
      if (method === 'POST' && statusMatch) {
        const cid = statusMatch[1];
        const body = await readJsonBody(req);
        const newStatus = String(body.status || '').toLowerCase();
        if (!['draft', 'published', 'archived'].includes(newStatus)) {
          return sendJson(res, 400, { error: 'Statut invalide.' });
        }
        const { data: cRow } = await admin.from('courses').select('*').eq('id', cid).maybeSingle();
        if (!cRow) return sendJson(res, 404, { error: 'Cours introuvable.' });
        if (newStatus === 'published' && (!Array.isArray(cRow.lessons) || cRow.lessons.length === 0)) {
          return sendJson(res, 400, { error: "Impossible de publier un cours sans aucune leçon." });
        }

        await createCloudBackup(admin, `status_${cid}_${newStatus}`);
        const now = new Date().toISOString();
        const patch = { status: newStatus, updated_at: now };
        if (newStatus === 'published') patch.published_at = cRow.published_at || now;
        const { data: updated } = await admin.from('courses').update(patch).eq('id', cid).select('*').single();
        return sendJson(res, 200, { ok: true, course: mapCourseRow(updated) });
      }

      // DUPLICATE COURSE
      const dupMatch = path.match(/^\/api\/admin\/courses\/([a-zA-Z0-9_-]+)\/duplicate$/);
      if (method === 'POST' && dupMatch) {
        const cid = dupMatch[1];
        const { data: origRow } = await admin.from('courses').select('*').eq('id', cid).maybeSingle();
        if (!origRow) return sendJson(res, 404, { error: 'Cours introuvable.' });
        const newCid = makeId('CRS');
        const now = new Date().toISOString();
        const idMap = new Map();
        const newLessons = (origRow.lessons || []).map((l, i) => {
          const newLid = `${newCid}_L${i + 1}`;
          idMap.set(l.id, newLid);
          return { ...l, id: newLid, courseId: newCid };
        });
        const cloneRow = {
          ...origRow,
          id: newCid,
          code: `${origRow.code}-B`,
          title: `${origRow.title} (Copie)`,
          status: 'draft',
          version: 1,
          lessons: newLessons,
          attachments: [],
          created_at: now,
          updated_at: now,
          published_at: null
        };
        await admin.from('courses').insert(cloneRow);
        const [{ data: origFc }, { data: origQ }] = await Promise.all([
          admin.from('flashcards').select('*').eq('course_id', cid),
          admin.from('qcms').select('*').eq('course_id', cid)
        ]);
        if (origFc && origFc.length) {
          await admin.from('flashcards').insert(origFc.map((f) => ({
            ...f, id: makeId('FC'), course_id: newCid, lesson_id: idMap.get(f.lesson_id) || f.lesson_id
          })));
        }
        if (origQ && origQ.length) {
          await admin.from('qcms').insert(origQ.map((q) => ({
            ...q, id: makeId('Q'), course_id: newCid, lesson_id: idMap.get(q.lesson_id) || q.lesson_id
          })));
        }
        await syncModuleCourseIds(admin);
        return sendJson(res, 201, { ok: true, course: mapCourseRow(cloneRow) });
      }

      // RESOLVE OVERLAP (Fusionner ou Garder séparé)
      const ovMatch = path.match(/^\/api\/admin\/courses\/([a-zA-Z0-9_-]+)\/resolve-overlap$/);
      if (method === 'POST' && ovMatch) {
        const cid = ovMatch[1];
        const body = await readJsonBody(req);
        const { data: srcRow } = await admin.from('courses').select('*').eq('id', cid).maybeSingle();
        if (!srcRow || !srcRow.ppt_import) return sendJson(res, 404, { error: 'Cours PowerPoint introuvable.' });

        const ppt = { ...srcRow.ppt_import };
        if (body.action === 'keep_separate') {
          if (ppt.overlapInfo) ppt.overlapInfo = { ...ppt.overlapInfo, resolution: 'keep_separate' };
          const { data: up } = await admin.from('courses').update({ ppt_import: ppt, updated_at: new Date().toISOString() }).eq('id', cid).select('*').single();
          return sendJson(res, 200, { ok: true, course: mapCourseRow(up), resolution: 'keep_separate' });
        }
        if (body.action === 'merge') {
          const targetId = body.targetCourseId || ppt.overlapInfo?.matchedCourseId;
          const { data: tgtRow } = await admin.from('courses').select('*').eq('id', targetId).maybeSingle();
          if (!tgtRow) return sendJson(res, 404, { error: 'Cours cible introuvable.' });

          await createCloudBackup(admin, `pre_merge_${cid}`);
          const tgtLessons = [...(tgtRow.lessons || [])];
          const idMap = new Map();
          for (const l of (srcRow.lessons || [])) {
            const nlId = `${targetId}_PPT_${tgtLessons.length + 1}`;
            idMap.set(l.id, nlId);
            tgtLessons.push({ ...l, id: nlId, courseId: targetId, order: tgtLessons.length + 1 });
          }
          const now = new Date().toISOString();
          await admin.from('courses').update({
            lessons: tgtLessons,
            version: (tgtRow.version || 1) + 1,
            source_files: [...(tgtRow.source_files || []), `${ppt.originalFilename} (${ppt.slidesProcessed} diapos — fusionné)`],
            updated_at: now
          }).eq('id', targetId);

          const [{ data: srcFc }, { data: srcQ }] = await Promise.all([
            admin.from('flashcards').select('*').eq('course_id', cid),
            admin.from('qcms').select('*').eq('course_id', cid)
          ]);
          if (srcFc && srcFc.length) {
            await admin.from('flashcards').insert(srcFc.map((f) => ({
              ...f, id: makeId('FC'), course_id: targetId, lesson_id: idMap.get(f.lesson_id) || f.lesson_id
            })));
          }
          if (srcQ && srcQ.length) {
            await admin.from('qcms').insert(srcQ.map((q) => ({
              ...q, id: makeId('Q'), course_id: targetId, lesson_id: idMap.get(q.lesson_id) || q.lesson_id
            })));
          }
          ppt.importStatus = 'merged';
          if (ppt.overlapInfo) ppt.overlapInfo = { ...ppt.overlapInfo, resolution: 'merged' };
          await admin.from('courses').update({ status: 'archived', ppt_import: ppt, updated_at: now }).eq('id', cid);
          return sendJson(res, 200, { ok: true, mergedInto: targetId });
        }
        return sendJson(res, 400, { error: 'Action invalide.' });
      }

      // DELETE COURSE
      if (courseIdMatch && method === 'DELETE') {
        const cid = courseIdMatch[1];
        const bk = await createCloudBackup(admin, `pre_delete_${cid}`);
        await admin.from('courses').delete().eq('id', cid);
        await syncModuleCourseIds(admin);
        return sendJson(res, 200, { ok: true, backup: bk });
      }

      // WORKSPACE PPT SCAN (Cloud notice : upload via l'interface en production)
      if (method === 'POST' && path === '/api/admin/import-workspace-ppts') {
        return sendJson(res, 200, {
          ok: true,
          totalFound: 0,
          importedCount: 0,
          skippedCount: 0,
          note: 'En production sur Vercel, utilisez « Ajouter un cours » pour téléverser directement vos nouveaux fichiers .pptx / .ppt dans le stockage cloud Supabase.'
        });
      }

      // BACKUPS & RESTORE
      if (method === 'POST' && path === '/api/admin/backups/create') {
        const filename = await createCloudBackup(admin, 'manual_admin');
        const { data: bks } = await admin.from('db_backups').select('filename, size_bytes, created_at').order('created_at', { ascending: false }).limit(25);
        return sendJson(res, 201, {
          ok: true,
          filename,
          backups: (bks || []).map((b) => ({ filename: b.filename, sizeBytes: b.size_bytes, createdAt: b.created_at }))
        });
      }

      if (method === 'POST' && path === '/api/admin/backups/restore') {
        const body = await readJsonBody(req);
        const { data: bk } = await admin.from('db_backups').select('snapshot').eq('filename', String(body.filename || '')).maybeSingle();
        if (!bk || !bk.snapshot) return sendJson(res, 404, { error: 'Sauvegarde introuvable.' });
        await createCloudBackup(admin, 'pre_restore');
        const snap = bk.snapshot;
        if (Array.isArray(snap.modules) && snap.modules.length) await admin.from('modules').upsert(snap.modules);
        if (Array.isArray(snap.courses) && snap.courses.length) await admin.from('courses').upsert(snap.courses);
        if (Array.isArray(snap.flashcards) && snap.flashcards.length) await admin.from('flashcards').upsert(snap.flashcards);
        if (Array.isArray(snap.qcms) && snap.qcms.length) await admin.from('qcms').upsert(snap.qcms);
        return sendJson(res, 200, { ok: true });
      }

      // SECURITY : CHANGE PASSWORD
      if (method === 'POST' && path === '/api/admin/security/password') {
        const body = await readJsonBody(req);
        const cur = String(body.currentPassword || '');
        const nxt = String(body.newPassword || '');
        if (nxt.length < 8) return sendJson(res, 400, { error: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' });
        const anon = getSupabaseAnon();
        const { error: verifyErr } = await anon.auth.signInWithPassword({ email: user.email, password: cur });
        if (verifyErr) return sendJson(res, 401, { error: 'Mot de passe actuel incorrect.' });
        const { error: upErr } = await admin.auth.admin.updateUserById(user.id, { password: nxt });
        if (upErr) return sendJson(res, 500, { error: upErr.message });
        return sendJson(res, 200, { ok: true });
      }

      // SECURITY : AI CONFIG (les clés API privées se configurent uniquement via Vercel Env Vars en production)
      if (method === 'POST' && path === '/api/admin/security/ai-config') {
        const body = await readJsonBody(req);
        const provider = String(body.provider || 'local').trim();
        const srvAi = getServerAiConfig({ provider });
        await admin.from('site_meta').upsert({
          key: 'aiConfig',
          value: { provider, configured: srvAi.enabled, model: srvAi.model },
          updated_at: new Date().toISOString()
        });
        return sendJson(res, 200, { ok: true, aiConfig: { provider: srvAi.provider, model: srvAi.model, configured: srvAi.enabled, envControlled: true } });
      }

      return sendJson(res, 404, { error: `Route admin inconnue : ${method} ${path}` });
    }

    return sendJson(res, 404, { error: `Route API inconnue : ${method} ${path}` });
  } catch (err) {
    console.error('MedStudy API error:', err);
    return sendJson(res, 500, { error: `Erreur serveur : ${err.message}` });
  }
}
