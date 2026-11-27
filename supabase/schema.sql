-- ==========================================================================
-- MedStudy — Schéma PostgreSQL Production + Sécurité RLS Stricte (Supabase)
-- Conforme aux bonnes pratiques Supabase Postgres (private.is_admin, TO authenticated,
-- initplan (select auth.uid()), politiques non redondantes et Storage privé).
-- ==========================================================================

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated;

-- 1. PROFILS UTILISATEURS & RÔLES (liés à auth.users de Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- Fonction privée (hors schéma public exposé) pour vérifier le rôle admin sans récursion RLS
CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid()) AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated;

-- Trigger automatique : tout nouvel inscrit reçoit STRICTEMENT le rôle 'student'
CREATE OR REPLACE FUNCTION private.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, created_at)
  VALUES (
    NEW.id,
    LOWER(NEW.email),
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''), SPLIT_PART(NEW.email, '@', 1)),
    'student',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION private.handle_new_user();

-- 2. MODULES MÉDICAUX (toutes spécialités, zéro discipline codée en dur)
CREATE TABLE IF NOT EXISTS public.modules (
  id          TEXT PRIMARY KEY,
  code        TEXT NOT NULL,
  subject     TEXT NOT NULL DEFAULT 'Médecine',
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  accent      TEXT NOT NULL DEFAULT '#1d4ed8',
  course_ids  JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. COURS (PDF + PowerPoint + Brouillons / Publiés / Archivés)
CREATE TABLE IF NOT EXISTS public.courses (
  id              TEXT PRIMARY KEY,
  module_id       TEXT NOT NULL REFERENCES public.modules(id) ON DELETE RESTRICT,
  code            TEXT NOT NULL,
  title           TEXT NOT NULL,
  short_title     TEXT NOT NULL DEFAULT '',
  professor       TEXT NOT NULL DEFAULT '',
  source_files    JSONB NOT NULL DEFAULT '[]'::jsonb,
  bm_count        INTEGER NOT NULL DEFAULT 0,
  bm_shared_note  TEXT NOT NULL DEFAULT '',
  bm_recent_count INTEGER NOT NULL DEFAULT 0,
  unique_concepts INTEGER NOT NULL DEFAULT 0,
  priority        TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('very_high', 'high', 'medium', 'low')),
  priority_score  INTEGER NOT NULL DEFAULT 50,
  vigilance_2026  BOOLEAN NOT NULL DEFAULT FALSE,
  summary         TEXT NOT NULL DEFAULT '',
  academic_year   TEXT NOT NULL DEFAULT '',
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  version         INTEGER NOT NULL DEFAULT 1,
  lessons         JSONB NOT NULL DEFAULT '[]'::jsonb,
  attachments     JSONB NOT NULL DEFAULT '[]'::jsonb,
  ai_extraction   JSONB NOT NULL DEFAULT '{}'::jsonb,
  ppt_import      JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_courses_status ON public.courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_module ON public.courses(module_id);

-- 4. FLASHCARDS (Rappel actif + traçabilité page/diapositive)
CREATE TABLE IF NOT EXISTS public.flashcards (
  id           TEXT PRIMARY KEY,
  course_id    TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id    TEXT NOT NULL,
  type         TEXT NOT NULL DEFAULT 'definition',
  question     TEXT NOT NULL,
  answer       TEXT NOT NULL,
  hint         TEXT NOT NULL DEFAULT '',
  page_ref     TEXT NOT NULL DEFAULT '',
  slide_num    INTEGER,
  slide_title  TEXT NOT NULL DEFAULT '',
  source_file  TEXT NOT NULL DEFAULT '',
  source_type  TEXT NOT NULL DEFAULT 'course_generated',
  provenance   TEXT NOT NULL DEFAULT 'source_explicit',
  chapter_title TEXT NOT NULL DEFAULT '',
  needs_review BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flashcards_course ON public.flashcards(course_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_lesson ON public.flashcards(lesson_id);

-- 5. BANQUE QCM (Originaux BM + QCM IA clairement différenciés)
CREATE TABLE IF NOT EXISTS public.qcms (
  id            TEXT PRIMARY KEY,
  course_id     TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id     TEXT NOT NULL,
  topic         TEXT NOT NULL DEFAULT '',
  source_type   TEXT NOT NULL DEFAULT 'course_generated',
  bm_ref        TEXT NOT NULL DEFAULT '',
  year          TEXT NOT NULL DEFAULT '',
  page_ref      TEXT NOT NULL DEFAULT '',
  slide_num     INTEGER,
  slide_title   TEXT NOT NULL DEFAULT '',
  source_file   TEXT NOT NULL DEFAULT '',
  provenance    TEXT NOT NULL DEFAULT 'source_explicit',
  chapter_title TEXT NOT NULL DEFAULT '',
  multi_select  BOOLEAN NOT NULL DEFAULT FALSE,
  is_hard       BOOLEAN NOT NULL DEFAULT FALSE,
  needs_review  BOOLEAN NOT NULL DEFAULT FALSE,
  stem          TEXT NOT NULL,
  table_html    TEXT NOT NULL DEFAULT '',
  options       JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct       JSONB NOT NULL DEFAULT '[]'::jsonb,
  explanation   TEXT NOT NULL DEFAULT '',
  wrong_reasons JSONB NOT NULL DEFAULT '{}'::jsonb,
  bm_error      JSONB,
  bm_unanswered BOOLEAN NOT NULL DEFAULT FALSE,
  course_ref    TEXT NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qcms_course ON public.qcms(course_id);
CREATE INDEX IF NOT EXISTS idx_qcms_lesson ON public.qcms(lesson_id);

-- 6. PROGRESSION PERSONNELLE ÉTUDIANTE (persiste même après dépublication/mise à jour)
CREATE TABLE IF NOT EXISTS public.student_progress (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  progress   JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. MÉTADONNÉES GLOBALES (Audit BM, Erreurs BM, Hors-cours, Config IA non secrète)
CREATE TABLE IF NOT EXISTS public.site_meta (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. SAUVEGARDES HORODATÉES CLOUD (Backups & Restauration Admin)
CREATE TABLE IF NOT EXISTS public.db_backups (
  id         BIGSERIAL PRIMARY KEY,
  filename   TEXT NOT NULL UNIQUE,
  reason     TEXT NOT NULL DEFAULT 'auto',
  size_bytes INTEGER NOT NULL DEFAULT 0,
  snapshot   JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. JOBS DE TRAITEMENT UNIVERSEL DE COURS (Pipeline 11 étapes + logs + reprise)
CREATE TABLE IF NOT EXISTS public.course_import_jobs (
  id                TEXT PRIMARY KEY,
  course_id         TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  created_by        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status            TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
  current_stage     INTEGER NOT NULL DEFAULT 1,
  current_stage_key TEXT NOT NULL DEFAULT 'file_uploaded',
  progress_pct      INTEGER NOT NULL DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
  ai_mode           TEXT NOT NULL DEFAULT 'deterministic',
  stages            JSONB NOT NULL DEFAULT '[]'::jsonb,
  logs              JSONB NOT NULL DEFAULT '[]'::jsonb,
  artifacts         JSONB NOT NULL DEFAULT '{}'::jsonb,
  quality_report    JSONB NOT NULL DEFAULT '{}'::jsonb,
  error_message     TEXT NOT NULL DEFAULT '',
  retry_count       INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_import_jobs_course ON public.course_import_jobs(course_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_import_jobs_status ON public.course_import_jobs(status);
CREATE INDEX IF NOT EXISTS idx_import_jobs_created_by ON public.course_import_jobs(created_by);

-- ==========================================================================
-- ROW LEVEL SECURITY (RLS) — PROTECTION STRICTE AU NIVEAU BASE DE DONNÉES
-- ==========================================================================
ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qcms             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_meta        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.db_backups       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_import_jobs ENABLE ROW LEVEL SECURITY;

-- PROFILES
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id OR private.is_admin());

DROP POLICY IF EXISTS "profiles_update_admin_only" ON public.profiles;
CREATE POLICY "profiles_update_admin_only" ON public.profiles
  FOR UPDATE TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- MODULES (lecture authentifiée ; écriture strictement admin)
DROP POLICY IF EXISTS "modules_select_auth" ON public.modules;
CREATE POLICY "modules_select_auth" ON public.modules
  FOR SELECT TO authenticated
  USING (TRUE);

DROP POLICY IF EXISTS "modules_insert_admin" ON public.modules;
CREATE POLICY "modules_insert_admin" ON public.modules
  FOR INSERT TO authenticated
  WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "modules_update_admin" ON public.modules;
CREATE POLICY "modules_update_admin" ON public.modules
  FOR UPDATE TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "modules_delete_admin" ON public.modules;
CREATE POLICY "modules_delete_admin" ON public.modules
  FOR DELETE TO authenticated
  USING (private.is_admin());

-- COURSES (étudiants : uniquement 'published' ; admins : tout)
DROP POLICY IF EXISTS "courses_select_published_or_admin" ON public.courses;
CREATE POLICY "courses_select_published_or_admin" ON public.courses
  FOR SELECT TO authenticated
  USING (private.is_admin() OR status = 'published');

DROP POLICY IF EXISTS "courses_insert_admin" ON public.courses;
CREATE POLICY "courses_insert_admin" ON public.courses
  FOR INSERT TO authenticated
  WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "courses_update_admin" ON public.courses;
CREATE POLICY "courses_update_admin" ON public.courses
  FOR UPDATE TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "courses_delete_admin" ON public.courses;
CREATE POLICY "courses_delete_admin" ON public.courses
  FOR DELETE TO authenticated
  USING (private.is_admin());

-- FLASHCARDS
DROP POLICY IF EXISTS "flashcards_select_published_or_admin" ON public.flashcards;
CREATE POLICY "flashcards_select_published_or_admin" ON public.flashcards
  FOR SELECT TO authenticated
  USING (
    private.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = flashcards.course_id AND c.status = 'published'
    )
  );

DROP POLICY IF EXISTS "flashcards_insert_admin" ON public.flashcards;
CREATE POLICY "flashcards_insert_admin" ON public.flashcards
  FOR INSERT TO authenticated
  WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "flashcards_update_admin" ON public.flashcards;
CREATE POLICY "flashcards_update_admin" ON public.flashcards
  FOR UPDATE TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "flashcards_delete_admin" ON public.flashcards;
CREATE POLICY "flashcards_delete_admin" ON public.flashcards
  FOR DELETE TO authenticated
  USING (private.is_admin());

-- QCMS
DROP POLICY IF EXISTS "qcms_select_published_or_admin" ON public.qcms;
CREATE POLICY "qcms_select_published_or_admin" ON public.qcms
  FOR SELECT TO authenticated
  USING (
    private.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = qcms.course_id AND c.status = 'published'
    )
  );

DROP POLICY IF EXISTS "qcms_insert_admin" ON public.qcms;
CREATE POLICY "qcms_insert_admin" ON public.qcms
  FOR INSERT TO authenticated
  WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "qcms_update_admin" ON public.qcms;
CREATE POLICY "qcms_update_admin" ON public.qcms
  FOR UPDATE TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "qcms_delete_admin" ON public.qcms;
CREATE POLICY "qcms_delete_admin" ON public.qcms
  FOR DELETE TO authenticated
  USING (private.is_admin());

-- STUDENT PROGRESS (strictement personnel par utilisateur)
DROP POLICY IF EXISTS "progress_select_own" ON public.student_progress;
CREATE POLICY "progress_select_own" ON public.student_progress
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "progress_insert_own" ON public.student_progress;
CREATE POLICY "progress_insert_own" ON public.student_progress
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "progress_update_own" ON public.student_progress;
CREATE POLICY "progress_update_own" ON public.student_progress
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- SITE META
DROP POLICY IF EXISTS "site_meta_select_auth" ON public.site_meta;
CREATE POLICY "site_meta_select_auth" ON public.site_meta
  FOR SELECT TO authenticated
  USING (private.is_admin() OR key IN ('bmAudit', 'bmErrors', 'outOfCourseBM'));

DROP POLICY IF EXISTS "site_meta_insert_admin" ON public.site_meta;
CREATE POLICY "site_meta_insert_admin" ON public.site_meta
  FOR INSERT TO authenticated
  WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "site_meta_update_admin" ON public.site_meta;
CREATE POLICY "site_meta_update_admin" ON public.site_meta
  FOR UPDATE TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- DB BACKUPS (strictement admin)
DROP POLICY IF EXISTS "backups_select_admin" ON public.db_backups;
CREATE POLICY "backups_select_admin" ON public.db_backups
  FOR SELECT TO authenticated
  USING (private.is_admin());

DROP POLICY IF EXISTS "backups_insert_admin" ON public.db_backups;
CREATE POLICY "backups_insert_admin" ON public.db_backups
  FOR INSERT TO authenticated
  WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "backups_delete_admin" ON public.db_backups;
CREATE POLICY "backups_delete_admin" ON public.db_backups
  FOR DELETE TO authenticated
  USING (private.is_admin());

-- COURSE IMPORT JOBS (strictement admin)
DROP POLICY IF EXISTS "import_jobs_select_admin" ON public.course_import_jobs;
CREATE POLICY "import_jobs_select_admin" ON public.course_import_jobs
  FOR SELECT TO authenticated
  USING (private.is_admin());

DROP POLICY IF EXISTS "import_jobs_insert_admin" ON public.course_import_jobs;
CREATE POLICY "import_jobs_insert_admin" ON public.course_import_jobs
  FOR INSERT TO authenticated
  WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "import_jobs_update_admin" ON public.course_import_jobs;
CREATE POLICY "import_jobs_update_admin" ON public.course_import_jobs
  FOR UPDATE TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "import_jobs_delete_admin" ON public.course_import_jobs;
CREATE POLICY "import_jobs_delete_admin" ON public.course_import_jobs
  FOR DELETE TO authenticated
  USING (private.is_admin());

-- ==========================================================================
-- SUPABASE STORAGE — BUCKET PRIVÉ POUR PDF & POWERPOINT (35 Mo max)
-- ==========================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'medstudy-files',
  'medstudy-files',
  FALSE,
  36700160,
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown',
    'image/png',
    'image/jpeg'
  ]
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "medstudy_storage_select_admin" ON storage.objects;
CREATE POLICY "medstudy_storage_select_admin" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'medstudy-files' AND private.is_admin());

DROP POLICY IF EXISTS "medstudy_storage_insert_admin" ON storage.objects;
CREATE POLICY "medstudy_storage_insert_admin" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'medstudy-files' AND private.is_admin());

DROP POLICY IF EXISTS "medstudy_storage_update_admin" ON storage.objects;
CREATE POLICY "medstudy_storage_update_admin" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'medstudy-files' AND private.is_admin())
  WITH CHECK (bucket_id = 'medstudy-files' AND private.is_admin());

DROP POLICY IF EXISTS "medstudy_storage_delete_admin" ON storage.objects;
CREATE POLICY "medstudy_storage_delete_admin" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'medstudy-files' AND private.is_admin());
