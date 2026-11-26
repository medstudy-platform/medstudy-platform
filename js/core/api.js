/* ==========================================================================
   EpiAPI — Client HTTP sécurisé MedStudy (Sessions HttpOnly + CMS Admin)
   Gère l'authentification, le catalogue dynamique, la progression synchronisée
   et toutes les opérations administrateur protégées côté serveur.
   ========================================================================== */
window.EpiAPI = (function () {
  const isHttp = window.location.protocol === 'http:' || window.location.protocol === 'https:';

  async function request(method, path, body, extraHeaders) {
    const opts = {
      method,
      credentials: 'same-origin',
      headers: Object.assign({}, extraHeaders || {})
    };
    if (body !== undefined && body !== null) {
      if (body instanceof ArrayBuffer || body instanceof Uint8Array || body instanceof Blob) {
        opts.body = body;
      } else {
        opts.headers['Content-Type'] = 'application/json; charset=utf-8';
        opts.body = JSON.stringify(body);
      }
    }

    const res = await fetch(path, opts);
    let data = null;
    try {
      data = await res.json();
    } catch (e) {
      data = null;
    }

    if (!res.ok) {
      const err = new Error((data && data.error) ? data.error : `Erreur serveur (${res.status})`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  return {
    isHttp,
    // Bootstrap & Auth
    bootstrapSeed: (seedPayload) => request('POST', '/api/bootstrap-seed', seedPayload),
    me: () => request('GET', '/api/auth/me'),
    login: (email, password) => request('POST', '/api/auth/login', { email, password }),
    register: (name, email, password) => request('POST', '/api/auth/register', { name, email, password }),
    logout: () => request('POST', '/api/auth/logout', {}),

    // Étudiant & Catalogue publié
    getCatalog: () => request('GET', '/api/catalog'),
    getProgress: () => request('GET', '/api/progress'),
    saveProgress: (progress) => request('PUT', '/api/progress', { progress }),
    fileUrl: (fileId) => `/api/files/${encodeURIComponent(fileId)}`,

    // Admin CMS (strictement vérifié côté serveur : 401/403 si non-admin)
    getAdminCatalog: () => request('GET', '/api/admin/catalog'),
    createModule: (payload) => request('POST', '/api/admin/modules', payload),
    updateModule: (id, payload) => request('PUT', `/api/admin/modules/${encodeURIComponent(id)}`, payload),
    deleteModule: (id) => request('DELETE', `/api/admin/modules/${encodeURIComponent(id)}`),

    createCourse: (payload) => request('POST', '/api/admin/courses', payload),
    updateCourse: (id, payload) => request('PUT', `/api/admin/courses/${encodeURIComponent(id)}`, payload),
    setCourseStatus: (id, status) => request('POST', `/api/admin/courses/${encodeURIComponent(id)}/status`, { status }),
    duplicateCourse: (id) => request('POST', `/api/admin/courses/${encodeURIComponent(id)}/duplicate`, {}),
    deleteCourse: (id) => request('DELETE', `/api/admin/courses/${encodeURIComponent(id)}`),

    uploadCourseFile: async (courseId, file, kind) => {
      // 1. Essayer l'upload direct signé Supabase Storage (supporte jusqu'à 35 Mo sur Vercel)
      try {
        const init = await request('POST', `/api/admin/courses/${encodeURIComponent(courseId)}/upload-init`, {
          fileName: file.name,
          kind: kind || 'primary_source',
          sizeBytes: file.size
        });
        if (init && init.signedUrl) {
          const putRes = await fetch(init.signedUrl, {
            method: 'PUT',
            headers: { 'Content-Type': init.mimeType || file.type || 'application/octet-stream' },
            body: file
          });
          if (!putRes.ok) {
            throw new Error(`Échec du transfert vers le stockage cloud (${putRes.status}).`);
          }
          return request('POST', `/api/admin/courses/${encodeURIComponent(courseId)}/upload-complete`, {
            fileId: init.fileId,
            storedName: init.storedName,
            storagePath: init.storagePath,
            originalName: file.name,
            kind: kind || 'primary_source',
            sizeBytes: file.size
          });
        }
      } catch (err) {
        // Fallback transparent vers /upload local (server.ps1) uniquement si /upload-init renvoie 404
        if (err && err.status !== 404) throw err;
      }

      const buf = await file.arrayBuffer();
      return request(
        'POST',
        `/api/admin/courses/${encodeURIComponent(courseId)}/upload`,
        buf,
        {
          'Content-Type': 'application/octet-stream',
          'X-File-Name': encodeURIComponent(file.name),
          'X-File-Kind': kind || 'primary_pdf'
        }
      );
    },
    deleteCourseFile: (courseId, fileId) =>
      request('DELETE', `/api/admin/courses/${encodeURIComponent(courseId)}/files/${encodeURIComponent(fileId)}`),
    analyzeCourse: (courseId) =>
      request('POST', `/api/admin/courses/${encodeURIComponent(courseId)}/analyze`, {}),
    importWorkspacePpts: () =>
      request('POST', '/api/admin/import-workspace-ppts', {}),
    resolveOverlap: (courseId, action, targetCourseId) =>
      request('POST', `/api/admin/courses/${encodeURIComponent(courseId)}/resolve-overlap`, { action, targetCourseId: targetCourseId || '' }),

    createBackup: () => request('POST', '/api/admin/backups/create', {}),
    restoreBackup: (filename) => request('POST', '/api/admin/backups/restore', { filename }),
    changeAdminPassword: (currentPassword, newPassword) =>
      request('POST', '/api/admin/security/password', { currentPassword, newPassword }),
    saveAiConfig: (provider, apiKey, clearKey) =>
      request('POST', '/api/admin/security/ai-config', { provider, apiKey, clearKey: !!clearKey })
  };
})();
