# MedStudy — Guide de Déploiement Production (Supabase + GitHub + Vercel)

## 1. Architecture Production
- **Frontend :** SPA HTML/CSS/JS statique servie directement par le CDN Vercel (aucun build requis).
- **Backend :** Fonction Serverless Node.js (`api/index.js`) sur Vercel (`maxDuration: 30s`).
- **Base de données & Authentification :** Supabase (PostgreSQL avec Row Level Security + Supabase Auth + cookies `HttpOnly; Secure; SameSite=Lax`).
- **Stockage fichiers (PDF / PowerPoint jusqu’à 35 Mo) :** Bucket privé Supabase Storage `medstudy-files` avec upload direct signé (contourne la limite 4,5 Mo de Vercel).

## 2. Étape A — Configurer Supabase (Base + RLS + Données + Stockage)
1. Créez un projet gratuit sur https://supabase.com/dashboard.
2. Dans **SQL Editor → New Query**, exécutez le contenu complet de `supabase/schema.sql`.
3. Dans **SQL Editor → New Query**, exécutez `supabase/seed_data.sql` (migre sans écraser vos **4 modules**, **12 cours publiés**, **7 cours PowerPoint brouillons**, **219 flashcards**, **252 QCM** et métadonnées BM).
4. Dans **Authentication → Users → Add user**, créez votre compte Administrateur propriétaire (cochez *Auto Confirm User*), puis passez son rôle en `admin` via SQL Editor :
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE email = 'VOTRE_EMAIL_ADMIN';
   ```
5. Dans **Storage → medstudy-files**, uploadez les 7 dossiers `PPT_*` présents dans `server_data/uploads/` (ou lancez `npm run migrate:supabase` si Node.js 20+ est installé).
6. Récupérez vos 3 clés dans **Project Settings → API** :
   - `SUPABASE_URL` (*Project URL*)
   - `SUPABASE_ANON_KEY` (*anon public*)
   - `SUPABASE_SERVICE_ROLE_KEY` (*service_role secret* — **serveur uniquement !**)

## 3. Étape B — Pousser le projet sur GitHub
Initialisez Git **uniquement dans le dossier `plateforme-epidemiologie/`** (pour ne pas inclure le PDF BM de 168 Mo ni `server_data/secrets.json`, déjà exclu par `.gitignore`) :
```bash
cd plateforme-epidemiologie
git init
git add .
git commit -m "MedStudy v2: Production Vercel + Supabase + Admin CMS + PowerPoint"
git branch -M main
git remote add origin https://github.com/VOTRE_COMPTE/medstudy.git
git push -u origin main
```

## 4. Étape C — Déployer sur Vercel
1. Rendez-vous sur https://vercel.com/new et importez votre dépôt GitHub `medstudy`.
2. **Framework Preset :** `Other` · **Build Command :** *(laisser vide)* · **Output Directory :** `.` (racine).
3. Ajoutez les **Environment Variables** suivantes (Production + Preview) :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_STORAGE_BUCKET` = `medstudy-files`
4. Cliquez sur **Deploy**. Votre URL HTTPS publique `https://<votre-projet>.vercel.app` est en ligne !
5. Vérifiez `https://<votre-projet>.vercel.app/api/health` → doit renvoyer `{"ok":true,"env":"vercel","dbConnected":true,"coursesCount":19}`.
