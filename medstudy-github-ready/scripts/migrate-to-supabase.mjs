/* ==========================================================================
   MedStudy — Script de Migration Complète vers Supabase (DB + Storage + Admin)
   Migre sans écraser : 4 modules, 12 cours publiés, 7 cours PowerPoint brouillons,
   219 flashcards, 252 QCM, métadonnées BM et tous les fichiers .pptx uploadés.
   Usage : node scripts/migrate-to-supabase.mjs (avec variables .env.local chargées)
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { courseToDbRow, flashcardToDbRow, qcmToDbRow, createEmptyProgress } from '../api/_lib/supabase.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Charger .env.local s'il existe
const envPath = path.join(rootDir, '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'medstudy-files';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('ERREUR : définissez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local avant de lancer la migration.');
  process.exit(1);
}

const dbPath = path.join(rootDir, 'server_data', 'db.json');
if (!fs.existsSync(dbPath)) {
  console.error(`ERREUR : ${dbPath} introuvable.`);
  process.exit(1);
}

const localDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  console.log('=== 1. Migration des modules médicaux ===');
  const modRows = (localDb.modules || []).map((m) => ({
    id: m.id,
    code: m.code,
    subject: m.subject || 'Épidémiologie',
    title: m.title,
    description: m.description || '',
    accent: m.accent || '#1d4ed8',
    course_ids: m.courseIds || [],
    created_at: m.createdAt || new Date().toISOString(),
    updated_at: m.updatedAt || new Date().toISOString()
  }));
  const { error: modErr } = await supabase.from('modules').upsert(modRows, { onConflict: 'id', ignoreDuplicates: true });
  if (modErr) throw modErr;
  console.log(`OK : ${modRows.length} modules vérifiés/migrés.`);

  console.log('=== 2. Upload des fichiers PDF/PowerPoint vers Supabase Storage ===');
  let uploadedFiles = 0;
  for (const c of (localDb.courses || [])) {
    const atts = Array.isArray(c.attachments) ? c.attachments : [];
    for (const att of atts) {
      const localFile = path.join(rootDir, 'server_data', 'uploads', c.id, att.storedName);
      if (!fs.existsSync(localFile)) continue;
      const storagePath = `${c.id}/${att.storedName}`;
      const buf = fs.readFileSync(localFile);
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(storagePath, buf, {
        contentType: att.mimeType || 'application/octet-stream',
        upsert: true
      });
      if (upErr) {
        console.warn(`  ⚠️ Upload échoué pour ${storagePath} : ${upErr.message}`);
      } else {
        att.storagePath = storagePath;
        uploadedFiles++;
        console.log(`  ✓ Uploadé : ${storagePath} (${(buf.length / 1024).toFixed(1)} Ko)`);
      }
    }
  }
  console.log(`OK : ${uploadedFiles} fichier(s) transféré(s) dans le bucket privé « ${BUCKET} ».`);

  console.log('=== 3. Migration des cours (12 publiés + 7 PowerPoint brouillons, sans écrasement) ===');
  const courseRows = (localDb.courses || []).map((c) => ({
    ...courseToDbRow(c),
    created_at: c.createdAt || new Date().toISOString()
  }));
  const { error: cErr } = await supabase.from('courses').upsert(courseRows, { onConflict: 'id', ignoreDuplicates: true });
  if (cErr) throw cErr;
  console.log(`OK : ${courseRows.length} cours vérifiés/migrés.`);

  console.log('=== 4. Migration des flashcards & QCM ===');
  const fcRows = (localDb.flashcards || []).map((f) => flashcardToDbRow(f));
  for (let i = 0; i < fcRows.length; i += 100) {
    const { error } = await supabase.from('flashcards').upsert(fcRows.slice(i, i + 100), { onConflict: 'id', ignoreDuplicates: true });
    if (error) throw error;
  }
  const qRows = (localDb.qcms || []).map((q) => qcmToDbRow(q));
  for (let i = 0; i < qRows.length; i += 100) {
    const { error } = await supabase.from('qcms').upsert(qRows.slice(i, i + 100), { onConflict: 'id', ignoreDuplicates: true });
    if (error) throw error;
  }
  console.log(`OK : ${fcRows.length} flashcards & ${qRows.length} QCM migrés.`);

  console.log('=== 5. Migration des métadonnées BM ===');
  const metaRows = [
    { key: 'bmAudit', value: localDb.bmAudit || {} },
    { key: 'bmErrors', value: localDb.bmErrors || [] },
    { key: 'outOfCourseBM', value: localDb.outOfCourseBM || [] }
  ];
  const { error: mErr } = await supabase.from('site_meta').upsert(metaRows, { onConflict: 'key' });
  if (mErr) throw mErr;
  console.log('OK : Métadonnées BM synchronisées.');

  if (process.env.ADMIN_SEED_EMAIL && process.env.ADMIN_SEED_PASSWORD) {
    console.log('=== 6. Initialisation du compte Administrateur propriétaire ===');
    const email = process.env.ADMIN_SEED_EMAIL.trim().toLowerCase();
    const name = process.env.ADMIN_SEED_NAME || 'Propriétaire MedStudy (Admin)';
    const { data: listData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
    let adminUser = (listData?.users || []).find((u) => (u.email || '').toLowerCase() === email);
    if (!adminUser) {
      const { data: created, error } = await supabase.auth.admin.createUser({
        email,
        password: process.env.ADMIN_SEED_PASSWORD,
        email_confirm: true,
        user_metadata: { name }
      });
      if (error) throw error;
      adminUser = created.user;
    }
    const now = new Date().toISOString();
    await supabase.from('profiles').upsert({
      id: adminUser.id, email, name, role: 'admin', created_at: now
    }, { onConflict: 'id' });
    await supabase.from('student_progress').upsert({
      user_id: adminUser.id, progress: createEmptyProgress(adminUser.id, name), updated_at: now
    }, { onConflict: 'user_id', ignoreDuplicates: true });
    console.log(`OK : Administrateur configuré (${email}).`);
  }

  console.log('🎉 MIGRATION SUPABASE TERMINÉE AVEC SUCCÈS !');
}

main().catch((err) => {
  console.error('Échec migration :', err);
  process.exit(1);
});
