/* ==========================================================================
   EpiViewsAuth — Écran de Connexion & Inscription Sécurisé MedStudy
   Accès protégé par sessions HttpOnly signées côté serveur (Admin / Étudiant)
   ========================================================================== */
window.EpiViewsAuth = (function () {
  const esc = (s) => window.EpiUI.esc(s);
  const icon = (n, s) => window.EpiIcons.get(n, s);

  function renderAuthScreen(authState) {
    const mode = (authState && authState.mode) || 'login'; // 'login' | 'register'
    const err = authState && authState.error;
    const busy = !!(authState && authState.busy);
    const isLocalHost = /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname || '');

    return `
      <div class="auth-screen">
        <div class="auth-card">
          <div class="auth-brand">
            <div class="brand-mark" style="width:48px;height:48px;border-radius:14px;">${icon('stethoscope', 26)}</div>
            <div>
              <h1 style="margin:0;font-size:22px;color:var(--navy);">MedStudy</h1>
              <div style="font-size:13px;color:var(--text-light);">Plateforme Médicale d’Étude & CMS Propriétaire</div>
            </div>
          </div>

          <div class="auth-tabs">
            <button type="button" class="auth-tab ${mode === 'login' ? 'active' : ''}" data-action="auth-switch-mode" data-mode="login">Connexion</button>
            <button type="button" class="auth-tab ${mode === 'register' ? 'active' : ''}" data-action="auth-switch-mode" data-mode="register">Inscription étudiant</button>
          </div>

          ${err ? `<div class="alert alert-danger" style="margin-bottom:14px;">${icon('alert', 17)}<div>${esc(err)}</div></div>` : ''}

          ${mode === 'login' ? `
            <form id="auth-login-form" data-form="auth-login" class="auth-form">
              <div class="form-field">
                <label for="auth-email">Adresse e-mail</label>
                <input id="auth-email" name="email" type="email" class="input" required autocomplete="username" placeholder="ex. admin@medstudy.local ou etudiant@medstudy.local" value="${esc((authState && authState.email) || '')}">
              </div>
              <div class="form-field">
                <label for="auth-password">Mot de passe</label>
                <input id="auth-password" name="password" type="password" class="input" required autocomplete="current-password" placeholder="••••••••">
              </div>
              <button type="submit" class="btn btn-primary btn-lg" style="width:100%;" ${busy ? 'disabled' : ''}>
                ${busy ? 'Connexion en cours…' : 'Se connecter à MedStudy'}
              </button>
            </form>

            ${isLocalHost ? `
              <div class="auth-hint-box">
                <div style="font-weight:700;color:var(--navy);margin-bottom:6px;display:flex;align-items:center;gap:6px;">
                  ${icon('shield', 15)} Accès local sécurisé (contrôle des rôles côté serveur)
                </div>
                <div style="font-size:12.5px;color:var(--text-muted);line-height:1.55;">
                  • <strong>Administrateur (Propriétaire) :</strong> <code>admin@medstudy.local</code> / <code>AdminMed2026!</code><br>
                  • <strong>Compte Étudiant démo :</strong> <code>etudiant@medstudy.local</code> / <code>Etudiant2026!</code><br>
                  <span style="color:var(--text-light);">Pensez à personnaliser le mot de passe administrateur dans <em>Administration → Sécurité</em>.</span>
                </div>
              </div>
            ` : `
              <div class="auth-hint-box">
                <div style="font-weight:700;color:var(--navy);margin-bottom:4px;display:flex;align-items:center;gap:6px;">
                  ${icon('shield', 15)} Espace Étudiant & Administration sécurisé
                </div>
                <div style="font-size:12.5px;color:var(--text-muted);line-height:1.5;">
                  Nouvel étudiant ? Utilisez l’onglet <strong>Inscription étudiant</strong> pour créer votre compte personnel et sauvegarder automatiquement votre progression et vos révisions.
                </div>
              </div>
            `}
          ` : `
            <form id="auth-register-form" data-form="auth-register" class="auth-form">
              <div class="form-field">
                <label for="reg-name">Nom complet</label>
                <input id="reg-name" name="name" type="text" class="input" required minlength="2" placeholder="Ex. Dr. Sarah Benali (6e année)">
              </div>
              <div class="form-field">
                <label for="reg-email">Adresse e-mail</label>
                <input id="reg-email" name="email" type="email" class="input" required autocomplete="email" placeholder="etudiant@facmed.dz">
              </div>
              <div class="form-field">
                <label for="reg-password">Mot de passe (minimum 6 caractères)</label>
                <input id="reg-password" name="password" type="password" class="input" required minlength="6" autocomplete="new-password" placeholder="Choisissez un mot de passe">
              </div>
              <button type="submit" class="btn btn-primary btn-lg" style="width:100%;" ${busy ? 'disabled' : ''}>
                ${busy ? 'Création du compte…' : 'Créer mon compte étudiant'}
              </button>
            </form>
            <div class="auth-hint-box" style="font-size:12.5px;color:var(--text-muted);">
              L’inscription publique crée exclusivement un compte <strong>Étudiant</strong> (rôle verrouillé côté serveur). Votre progression personnelle démarre à 0 % et est sauvegardée automatiquement.
            </div>
          `}
        </div>
      </div>`;
  }

  return { renderAuthScreen };
})();
