/* ==========================================================================
   MedStudy Production — Client Supabase Serveur, Sessions HttpOnly & Mappers
   Les clés privées restent exclusivement côté serveur (Vercel Env Vars).
   ========================================================================== */
import { createClient } from '@supabase/supabase-js';

const ACCESS_COOKIE = 'medstudy_sb_access';
const REFRESH_COOKIE = 'medstudy_sb_refresh';
export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'medstudy-files';

export function checkEnvConfigured() {
  const missing = [];
  if (!process.env.SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!process.env.SUPABASE_ANON_KEY) missing.push('SUPABASE_ANON_KEY');
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  return { ok: missing.length === 0, missing };
}

export function getSupabaseAdmin() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

export function getSupabaseAnon() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

export function parseCookies(req) {
  const header = req.headers.cookie || '';
  const out = {};
  header.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx > 0) {
      const k = part.slice(0, idx).trim();
      const v = part.slice(idx + 1).trim();
      out[k] = decodeURIComponent(v);
    }
  });
  return out;
}

export function setAuthCookies(res, session) {
  const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
  const sec = isProd ? '; Secure' : '';
  const accessMax = 60 * 60 * 24 * 7; // 7 jours (refresh géré automatiquement)
  const refreshMax = 60 * 60 * 24 * 30; // 30 jours
  const cookies = [
    `${ACCESS_COOKIE}=${encodeURIComponent(session.access_token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${accessMax}${sec}`,
    `${REFRESH_COOKIE}=${encodeURIComponent(session.refresh_token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${refreshMax}${sec}`
  ];
  res.setHeader('Set-Cookie', cookies);
}

export function clearAuthCookies(res) {
  const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
  const sec = isProd ? '; Secure' : '';
  res.setHeader('Set-Cookie', [
    `${ACCESS_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${sec}`,
    `${REFRESH_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${sec}`
  ]);
}

export async function getSessionUser(req, res) {
  const cookies = parseCookies(req);
  const accessToken = cookies[ACCESS_COOKIE];
  const refreshToken = cookies[REFRESH_COOKIE];
  if (!accessToken && !refreshToken) return null;

  const admin = getSupabaseAdmin();
  let authUser = null;

  if (accessToken) {
    const { data, error } = await admin.auth.getUser(accessToken);
    if (!error && data && data.user) {
      authUser = data.user;
    }
  }

  // Rafraîchissement silencieux sécurisé si le JWT d'accès a expiré
  if (!authUser && refreshToken) {
    const anon = getSupabaseAnon();
    const { data, error } = await anon.auth.refreshSession({ refresh_token: refreshToken });
    if (!error && data && data.session && data.user) {
      authUser = data.user;
      setAuthCookies(res, data.session);
    }
  }

  if (!authUser) return null;

  const { data: profile } = await admin
    .from('profiles')
    .select('id, email, name, role, created_at, last_login_at')
    .eq('id', authUser.id)
    .maybeSingle();

  if (!profile) {
    const fallbackName = (authUser.user_metadata && authUser.user_metadata.name) || authUser.email.split('@')[0];
    const inserted = {
      id: authUser.id,
      email: authUser.email.toLowerCase(),
      name: fallbackName,
      role: 'student',
      created_at: new Date().toISOString(),
      last_login_at: new Date().toISOString()
    };
    await admin.from('profiles').upsert(inserted, { onConflict: 'id' });
    return {
      id: inserted.id,
      email: inserted.email,
      name: inserted.name,
      role: 'student',
      createdAt: inserted.created_at,
      lastLoginAt: inserted.last_login_at
    };
  }

  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role === 'admin' ? 'admin' : 'student',
    createdAt: profile.created_at,
    lastLoginAt: profile.last_login_at
  };
}

export function mapModuleRow(m) {
  return {
    id: m.id,
    code: m.code,
    subject: m.subject || 'Médecine',
    title: m.title,
    description: m.description || '',
    accent: m.accent || '#1d4ed8',
    courseIds: Array.isArray(m.course_ids) ? m.course_ids : [],
    createdAt: m.created_at,
    updatedAt: m.updated_at
  };
}

export function mapCourseRow(c) {
  return {
    id: c.id,
    moduleId: c.module_id,
    code: c.code,
    title: c.title,
    shortTitle: c.short_title || c.title,
    professor: c.professor || '',
    sourceFiles: Array.isArray(c.source_files) ? c.source_files : [],
    bmCount: c.bm_count || 0,
    bmSharedNote: c.bm_shared_note || '',
    bmRecentCount: c.bm_recent_count || 0,
    uniqueConcepts: c.unique_concepts || 0,
    priority: c.priority || 'medium',
    priorityScore: c.priority_score ?? 50,
    vigilance2026: !!c.vigilance_2026,
    summary: c.summary || '',
    status: c.status || 'draft',
    version: c.version || 1,
    lessons: Array.isArray(c.lessons) ? c.lessons : [],
    attachments: Array.isArray(c.attachments) ? c.attachments : [],
    aiExtraction: c.ai_extraction || { analyzedAt: null, engine: 'none', totalPages: 0, lowConfidencePages: [], warnings: [], status: 'none' },
    pptImport: c.ppt_import || null,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
    publishedAt: c.published_at || null
  };
}

export function mapFlashcardRow(f) {
  return {
    id: f.id,
    courseId: f.course_id,
    lessonId: f.lesson_id,
    type: f.type || 'definition',
    question: f.question,
    answer: f.answer,
    hint: f.hint || '',
    pageRef: f.page_ref || '',
    slideNum: f.slide_num ?? null,
    slideTitle: f.slide_title || '',
    sourceFile: f.source_file || '',
    sourceType: f.source_type || 'course_generated',
    needsReview: !!f.needs_review
  };
}

export function mapQcmRow(q) {
  return {
    id: q.id,
    courseId: q.course_id,
    lessonId: q.lesson_id,
    topic: q.topic || '',
    sourceType: q.source_type || 'course_generated',
    bmRef: q.bm_ref || '',
    year: q.year || '',
    pageRef: q.page_ref || '',
    slideNum: q.slide_num ?? null,
    slideTitle: q.slide_title || '',
    sourceFile: q.source_file || '',
    multiSelect: !!q.multi_select,
    isHard: !!q.is_hard,
    needsReview: !!q.needs_review,
    stem: q.stem,
    table: q.table_html || '',
    options: Array.isArray(q.options) ? q.options : [],
    correct: Array.isArray(q.correct) ? q.correct : [],
    explanation: q.explanation || '',
    wrongReasons: q.wrong_reasons && typeof q.wrong_reasons === 'object' ? q.wrong_reasons : {},
    bmError: q.bm_error || null,
    bmUnanswered: !!q.bm_unanswered,
    courseRef: q.course_ref || ''
  };
}

export function courseToDbRow(c) {
  return {
    id: c.id,
    module_id: c.moduleId,
    code: c.code || 'C',
    title: c.title,
    short_title: c.shortTitle || c.title.slice(0, 28),
    professor: c.professor || '',
    source_files: Array.isArray(c.sourceFiles) ? c.sourceFiles : [],
    bm_count: Number(c.bmCount) || 0,
    bm_shared_note: c.bmSharedNote || '',
    bm_recent_count: Number(c.bmRecentCount) || 0,
    unique_concepts: Number(c.uniqueConcepts) || 0,
    priority: c.priority || 'medium',
    priority_score: Number(c.priorityScore ?? 50),
    vigilance_2026: !!c.vigilance2026,
    summary: c.summary || '',
    status: c.status || 'draft',
    version: Number(c.version) || 1,
    lessons: Array.isArray(c.lessons) ? c.lessons : [],
    attachments: Array.isArray(c.attachments) ? c.attachments : [],
    ai_extraction: c.aiExtraction || {},
    ppt_import: c.pptImport || null,
    updated_at: new Date().toISOString(),
    published_at: c.publishedAt || null
  };
}

export function flashcardToDbRow(f, courseId) {
  return {
    id: f.id,
    course_id: courseId || f.courseId,
    lesson_id: f.lessonId,
    type: f.type || 'definition',
    question: f.question || '',
    answer: f.answer || '',
    hint: f.hint || '',
    page_ref: f.pageRef || '',
    slide_num: f.slideNum ?? null,
    slide_title: f.slideTitle || '',
    source_file: f.sourceFile || '',
    source_type: f.sourceType || 'course_generated',
    needs_review: !!f.needsReview
  };
}

export function qcmToDbRow(q, courseId) {
  return {
    id: q.id,
    course_id: courseId || q.courseId,
    lesson_id: q.lessonId,
    topic: q.topic || '',
    source_type: q.sourceType || 'course_generated',
    bm_ref: q.bmRef || '',
    year: q.year || '',
    page_ref: q.pageRef || '',
    slide_num: q.slideNum ?? null,
    slide_title: q.slideTitle || '',
    source_file: q.sourceFile || '',
    multi_select: !!q.multiSelect,
    is_hard: !!q.isHard,
    needs_review: !!q.needsReview,
    stem: q.stem || '',
    table_html: q.table || '',
    options: Array.isArray(q.options) ? q.options : [],
    correct: Array.isArray(q.correct) ? q.correct : [],
    explanation: q.explanation || '',
    wrong_reasons: q.wrongReasons || {},
    bm_error: q.bmError || null,
    bm_unanswered: !!q.bmUnanswered,
    course_ref: q.courseRef || ''
  };
}

export function createEmptyProgress(userId, userName) {
  return {
    id: userId,
    name: userName || 'Étudiant Médecine',
    createdAt: new Date().toISOString(),
    dailyGoalMin: 45,
    xp: 0,
    streak: { count: 0, best: 0, lastActiveDate: null },
    lessons: {},
    flashcards: {},
    qcms: {},
    lessonSrs: {},
    dailyLog: {},
    examHistory: [],
    badgesUnlocked: [],
    personalBestQuiz: 0,
    dismissedNotifDate: null
  };
}
