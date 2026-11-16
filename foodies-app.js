/* ═══════════════════════════════════════════════════════════════════
   foodies-app.js — Lógica compartida por cuenta.html y mi-sabormap.html
   ───────────────────────────────────────────────────────────────────
   Maneja DOS clientes Supabase:
     · sbFoodies  → proyecto NUEVO (comensales: auth, foodies, favorites, reviews)
     · sbPlaces   → proyecto actual (cfmqwnfimpfuivqmsxju) para fetch de places

   Uso:
     · cuenta.html: usa solo sbFoodies para auth.
     · mi-sabormap.html: usa ambos (sbFoodies para favoritos/reseñas/perfil,
       sbPlaces para resolver el detalle de un place favorito).
   ═══════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════
   ⚠️  CONFIGURACIÓN — REEMPLAZAR con los valores de TU proyecto nuevo
   ═══════════════════════════════════════════════════════════════════ */
const FOODIES_SUPABASE_URL = 'https://twzxrjvdwvwyzitfqcfn.supabase.co';
const FOODIES_SUPABASE_KEY = 'sb_publishable_AHu_5c3rx8M0Ge03Y6DzuQ_KLnwJ2cP';

/* Estas son las credenciales del proyecto ACTUAL (places, collections).
   NO tocar — son las mismas que ya usa app.js y dashboard.html. */
const PLACES_SUPABASE_URL = 'https://cfmqwnfimpfuivqmsxju.supabase.co';
const PLACES_SUPABASE_KEY = 'sb_publishable_xnipCyojiLP0RsDJKc_KpA_WWi7mj3j';

/* ───────────────────────────────────────────────────────────────────
   Inicialización de clientes Supabase
   ─────────────────────────────────────────────────────────────────── */
let sbFoodies = null;
let sbPlaces = null;

(function initSupabaseClients() {
    if (!window.supabase || !window.supabase.createClient) {
        console.error('[foodies-app] Supabase JS SDK no está cargado');
        return;
    }
    try {
        sbFoodies = window.supabase.createClient(FOODIES_SUPABASE_URL, FOODIES_SUPABASE_KEY, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: false,
                flowType: 'pkce'
            }
        });
    } catch (e) {
        console.error('[foodies-app] Error inicializando sbFoodies:', e);
    }
    try {
        sbPlaces = window.supabase.createClient(PLACES_SUPABASE_URL, PLACES_SUPABASE_KEY);
    } catch (e) {
        console.warn('[foodies-app] Error inicializando sbPlaces (no crítico para cuenta.html):', e);
    }
})();

/* ───────────────────────────────────────────────────────────────────
   Estado global
   ─────────────────────────────────────────────────────────────────── */
let currentFoodie = null;     // auth.users del proyecto foodies
let foodieProfile = null;     // fila de public.foodies
/* [FIX favoritos] Coordinación entre initFoodieAuth(required=true) y
   onAuthStateChange: si getSession() devuelve null en el primer instante
   (token refrescándose / lectura de storage lenta), initFoodieAuth no
   redirige de golpe a login; espera un margen breve. onAuthStateChange
   cancela ese margen si llega INITIAL_SESSION/TOKEN_REFRESHED con sesión. */
let foodieAuthResolve = null;     // resolver del Promise de initFoodieAuth en gracia
let foodieAuthGraceTimer = null;  // setTimeout del margen de detección tardía

/* ───────────────────────────────────────────────────────────────────
   Utilidades
   ─────────────────────────────────────────────────────────────────── */
function $(id) { return document.getElementById(id); }

function escapeHtml(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
window.escapeHtml = escapeHtml;

function showToast(msg, isError) {
    const t = $('appToast');
    if (!t) { alert(msg); return; }
    t.className = 'toast show' + (isError ? ' toast-error' : '');
    t.innerHTML = '<i class="fas fa-' + (isError ? 'exclamation-circle' : 'check-circle') + '"></i> ' + escapeHtml(msg);
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.remove('show'), 3500);
}
window.showToast = showToast;

function getInitials(name) {
    return (name || '?').trim().split(/\s+/).map(w => w[0]).join('').substring(0, 2).toUpperCase();
}

function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('es-CU', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ───────────────────────────────────────────────────────────────────
   AUTH — Sesión y perfil
   ─────────────────────────────────────────────────────────────────── */
async function initFoodieAuth(required) {
    if (!sbFoodies) {
        if (required) window.location.href = 'cuenta.html';
        return false;
    }
    try {
        const { data: { session } } = await sbFoodies.auth.getSession();
        if (session && session.user) {
            currentFoodie = session.user;
            await loadFoodieProfile();
            return true;
        }
        // [FIX favoritos] getSession() devolvió null. En supabase-js@2.49.4 puede
        //   ser un instante transitorio (token refrescándose / storage lento):
        //   onAuthStateChange disparará INITIAL_SESSION/TOKEN_REFRESHED con la
        //   sesión real en cuanto esté lista. ¿Pero ya la trajo el callback
        //   (ganó la carrera)?
        if (currentFoodie) {
            await loadFoodieProfile();
            return true;
        }
        if (!required) return false;
        // [FIX favoritos] required=true y sesión aún no detectada: NO redirigir
        //   de golpe a login (mandaría a un usuario logueado a login). Dar un
        //   margen breve; onAuthStateChange lo resuelve a true si llega la
        //   sesión, o expira y redirige a login si sigue sin sesión.
        if (foodieAuthResolve) return foodieAuthResolve; // ya esperando
        return await new Promise(resolve => {
            foodieAuthResolve = resolve;
            foodieAuthGraceTimer = setTimeout(() => {
                foodieAuthResolve = null;
                foodieAuthGraceTimer = null;
                window.location.href = 'cuenta.html';
                resolve(false);
            }, 1500);
        });
    } catch (e) {
        console.error('[foodies-app] initFoodieAuth error:', e);
        if (required) window.location.href = 'cuenta.html';
        return false;
    }
}

async function loadFoodieProfile() {
    if (!sbFoodies || !currentFoodie) return null;
    const { data, error } = await sbFoodies
        .from('foodies')
        .select('*')
        .eq('id', currentFoodie.id)
        .maybeSingle();
    if (error) {
        console.warn('[foodies-app] loadFoodieProfile:', error);
        return null;
    }
    if (data) {
        foodieProfile = data;
        return foodieProfile;
    }
    // ★ [junior-expert fix] Auto-recuperación de cuentas huérfanas:
    // Si el trigger AFTER INSERT en auth.users falló (p.ej. por CHECK
    // constraint de display_name, o si el trigger no existía cuando se
    // creó el auth.users), el perfil foodies no existe. Lo INSERTAMOS
    // aquí mismo — la política foodies_self_all permite INSERT propio.
    // Tomamos display_name del user_metadata (lo que puso en el signup)
    // o del email como fallback.
    const fallbackName = (currentFoodie.user_metadata && currentFoodie.user_metadata.display_name)
        || (currentFoodie.email ? currentFoodie.email.split('@')[0] : 'Comensal');
    const insertData = {
        id: currentFoodie.id,
        display_name: fallbackName.substring(0, 40), // truncar por seguridad (CHECK 2..40)
        bio: null,
        avatar_url: null,
        is_public: true,
        email_notifications: true,
        email_marketing: false
    };
    // [FIX favoritos] upsert idempotente (onConflict: id = PK). Antes era
    //   .insert() plano: si el trigger o otra pestaña creaba el perfil en la
    //   ventana de race, el INSERT chocaba con la PK → error → caía al
    //   fallback en memoria (perfil no persistido). Con upsert, si ya existe,
    //   no errora y devolvemos la fila real.
    const { data: inserted, error: insErr } = await sbFoodies
        .from('foodies')
        .upsert(insertData, { onConflict: 'id' })
        .select('*')
        .maybeSingle();
    if (insErr) {
        console.warn('[foodies-app] loadFoodieProfile: no se pudo crear perfil huérfano:', insErr);
        // Fallback final: usar objeto en memoria (no se persistirá pero la UI no truena)
        foodieProfile = {
            id: currentFoodie.id,
            display_name: fallbackName.substring(0, 40),
            bio: '',
            avatar_url: null,
            is_public: true,
            email_notifications: true,
            email_marketing: false
        };
        return foodieProfile;
    }
    console.info('[foodies-app] loadFoodieProfile: perfil huérfano creado para', currentFoodie.id);
    foodieProfile = inserted;
    return foodieProfile;
}

async function handleFoodieLogout() {
    if (!sbFoodies) return;
    try { await sbFoodies.auth.signOut(); } catch (e) {}
    window.location.href = 'cuenta.html';
}
window.handleFoodieLogout = handleFoodieLogout;

/* ───────────────────────────────────────────────────────────────────
   AUTH — Login / Signup / Recuperar (usado por cuenta.html)
   ─────────────────────────────────────────────────────────────────── */

/* authReturnTarget — [FIX favoritos] devuelve adónde ir tras un login
   exitoso (o cuando ya hay sesión al cargar cuenta.html). Si la URL actual
   trae ?return=home (lo que pone la home al redirigir desde el corazón a un
   usuario sin sesión), volvemos a index.html para que applyPendingFavorite()
   consuma el favorito pendiente. Si no, al panel. */
function authReturnTarget() {
    try {
        const r = new URLSearchParams(window.location.search).get('return');
        if (r === 'home') return 'index.html';
    } catch (e) {}
    return 'mi-sabormap.html';
}
window.authReturnTarget = authReturnTarget;

window.handleFoodieLogin = async function(e) {
    e.preventDefault();
    const btn = $('loginBtn');
    btn.classList.add('loading');
    try {
        const { data, error } = await sbFoodies.auth.signInWithPassword({
            email: $('loginEmail').value.trim(),
            password: $('loginPassword').value
        });
        if (error) throw error;
        // Login OK → al panel, o de vuelta a la home si veníamos de un favorito pendiente
        window.location.href = authReturnTarget();
    } catch (err) {
        showAuthMsg('loginMessage', 'error', traducirErrorAuth(err.message || 'Error al iniciar sesión'));
    } finally { btn.classList.remove('loading'); }
};

window.handleFoodieSignup = async function(e) {
    e.preventDefault();
    const btn = $('signupBtn');
    btn.classList.add('loading');

    const displayName = $('signupDisplayName').value.trim();
    const email = $('signupEmail').value.trim();
    const password = $('signupPassword').value;
    const confirm = $('signupConfirm').value;

    if (displayName.length < 2) {
        showAuthMsg('signupMessage', 'error', 'El apodo debe tener al menos 2 caracteres');
        btn.classList.remove('loading'); return;
    }
    if (displayName.length > 40) {
        showAuthMsg('signupMessage', 'error', 'El apodo no puede exceder 40 caracteres');
        btn.classList.remove('loading'); return;
    }
    if (password !== confirm) {
        showAuthMsg('signupMessage', 'error', 'Las contraseñas no coinciden');
        btn.classList.remove('loading'); return;
    }
    if (password.length < 8) {
        showAuthMsg('signupMessage', 'error', 'La contraseña debe tener al menos 8 caracteres');
        btn.classList.remove('loading'); return;
    }
    // ★ [junior-expert fix] Lista de contraseñas triviales (mismo patrón
    //   que dashboard.html para owners). No bloqueamos 'password12' como
    //   trivials tampoco, solo las MÁS comunes para no frustrar el signup.
    const trivial = ['1234567890', 'password12', 'qwerty123', '1111111111', '0000000000', 'abcdefghij', '12345678'];
    if (trivial.includes(password.toLowerCase())) {
        showAuthMsg('signupMessage', 'error', 'Contraseña demasiado común. Elige una más segura');
        btn.classList.remove('loading'); return;
    }

    try {
        const { data, error } = await sbFoodies.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    display_name: displayName,
                    signup_source: 'consumer'
                }
            }
        });
        if (error) throw error;

        if (data.session) {
            // Signup sin confirmación de email → sesión iniciada
            showAuthMsg('signupMessage', 'success', '¡Cuenta creada! Redirigiendo...');
            setTimeout(() => { window.location.href = authReturnTarget(); }, 1000);
        } else {
            // Confirmación de email requerida
            showAuthMsg('signupMessage', 'success', 'Cuenta creada. Revisa tu email para confirmarla y luego inicia sesión.');
            setTimeout(() => { window.showView('login'); }, 2500);
        }
    } catch (err) {
        showAuthMsg('signupMessage', 'error', traducirErrorAuth(err.message || 'Error al crear cuenta'));
    } finally { btn.classList.remove('loading'); }
};

window.handleFoodieForgot = async function(e) {
    e.preventDefault();
    const btn = $('forgotBtn');
    btn.classList.add('loading');
    try {
        // [v2.0.28/S-02] redirectTo explícito a cuenta.html: el email de
        //   recuperación vuelve aquí con ?code=<pkce>. Sin esto, Supabase usa
        //   la Site URL del dashboard (la raíz) y el flujo se rompe.
        const redirectTo = window.location.origin + '/cuenta.html';
        const { error } = await sbFoodies.auth.resetPasswordForEmail(
            $('forgotEmail').value.trim(), { redirectTo });
        if (error) throw error;
        showAuthMsg('forgotMessage', 'success', 'Si el email existe, enviamos un link de recuperación.');
    } catch (err) {
        showAuthMsg('forgotMessage', 'error', traducirErrorAuth(err.message || 'Error al enviar email'));
    } finally { btn.classList.remove('loading'); }
};

/* [v2.0.28/S-02] PKCE — nueva contraseña tras clic en el enlace del email.
   onAuthStateChange(PASSWORD_RECOVERY) muestra resetView; el usuario entra la
   nueva contraseña y updateUser({password}) la persiste. */
window.handleFoodieResetPassword = async function(e) {
    e.preventDefault();
    const btn = $('resetBtn');
    const pw = $('resetPassword') && $('resetPassword').value;
    const pw2 = $('resetPassword2') && $('resetPassword2').value;
    if (!pw || pw.length < 8) {
        showAuthMsg('resetMessage', 'error', 'La contraseña debe tener al menos 8 caracteres.');
        return;
    }
    if (pw !== pw2) {
        showAuthMsg('resetMessage', 'error', 'Las contraseñas no coinciden.');
        return;
    }
    btn.classList.add('loading');
    try {
        const { error } = await sbFoodies.auth.updateUser({ password: pw });
        if (error) throw error;
        showAuthMsg('resetMessage', 'success', 'Contraseña actualizada. Te llevamos al inicio de sesión.');
        // Cerrar la sesión de recovery y volver al login tras un margen.
        setTimeout(async () => {
            try { await sbFoodies.auth.signOut(); } catch (e) {}
            try { window.showView('login'); } catch (e) {}
        }, 1600);
    } catch (err) {
        showAuthMsg('resetMessage', 'error', traducirErrorAuth(err.message || 'Error al actualizar la contraseña'));
    } finally { btn.classList.remove('loading'); }
};

/* [v2.0.28/S-02] Limpia la URL de params sensibles de auth (?code=, ?error=,
   ?error_description=, ?type=, etc.) conservando ?view= y ?return=. Así el
   code de PKCE no queda expuesto en la barra ni en el historial. */
function cleanAuthUrl() {
    try {
        const params = new URLSearchParams(window.location.search);
        const clean = new URLSearchParams();
        const view = params.get('view');
        const ret = params.get('return');
        if (view) clean.set('view', view);
        if (ret) clean.set('return', ret);
        const q = clean.toString();
        history.replaceState({}, document.title,
            window.location.pathname + (q ? '?' + q : '') + window.location.hash);
    } catch (e) { /* history puede estar restringida; no es crítico */ }
}

/* [v2.0.28/S-02] Intercambia el ?code= PKCE que trae el redirect del email de
   reset. Devuelve true cuando era un flujo de recuperación (el form de nueva
   contraseña ya está visible) para que el llamador NO redirija al panel. */
async function handlePkceRedirect() {
    if (!sbFoodies) return false;
    let params;
    try { params = new URLSearchParams(window.location.search); }
    catch (e) { return false; }
    const code = params.get('code');
    const errParam = params.get('error');
    if (errParam) {
        // Supabase devolvió un error en el redirect (link expirado/inválido).
        if (typeof showAuthMsg === 'function') {
            showAuthMsg('loginMessage', 'error',
                'El enlace no es válido o ha expirado. Pide uno nuevo.');
        }
        cleanAuthUrl();
        return false;
    }
    if (!code) return false; // flujo normal, nada que intercambiar
    try {
        // exchangeCodeForSession lee el code de la URL y dispara
        // onAuthStateChange(PASSWORD_RECOVERY), que muestra resetView.
        const { error } = await sbFoodies.auth.exchangeCodeForSession(window.location.href);
        cleanAuthUrl();
        if (error) {
            if (typeof showAuthMsg === 'function') {
                showAuthMsg('loginMessage', 'error',
                    'El enlace ya se usó o expiró. Pide uno nuevo.');
            }
            return false;
        }
        return true;
    } catch (e) {
        console.warn('[foodies-app] PKCE exchange:', e);
        cleanAuthUrl();
        return false;
    }
}
window.handlePkceRedirect = handlePkceRedirect;

function traducirErrorAuth(msg) {
    const m = String(msg || '');
    if (m.includes('Invalid login credentials')) return 'Email o contraseña incorrectos.';
    if (m.includes('User already registered')) return 'Este email ya está registrado. Intenta iniciar sesión.';
    if (m.includes('Password should be at least')) return 'La contraseña debe tener al menos 8 caracteres.';
    if (m.includes('Email rate limit')) return 'Demasiados intentos. Espera unos minutos.';
    if (m.includes('Email not confirmed')) return 'Debes confirmar tu email antes de iniciar sesión.';
    return m;
}

function showAuthMsg(id, type, text) {
    const el = $(id);
    if (!el) return;
    el.className = 'auth-message show ' + type;
    el.querySelector('span').textContent = text;
}

window.showView = function(view) {
    ['loginView', 'signupView', 'forgotView', 'resetView'].forEach(v => { const e = $(v); if (e) e.style.display = 'none'; });
    ['loginMessage', 'signupMessage', 'forgotMessage', 'resetMessage'].forEach(id => {
        const e = $(id); if (e) e.classList.remove('show', 'error', 'success');
    });
    const target = $(view + 'View');
    if (target) {
        target.style.display = 'block';
        target.style.animation = 'none';
        target.offsetHeight;
        target.style.animation = 'authSlideIn 0.4s cubic-bezier(0.22,1,0.36,1)';
    }
};

window.togglePw = function(inputId, btn) {
    const input = $(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
};

window.checkPwStrength = function(val) {
    const bars = [$('pwBar1'), $('pwBar2'), $('pwBar3'), $('pwBar4')];
    const txt = $('pwStrengthText');
    if (!bars[0]) return;
    let score = 0;
    if (val.length >= 8) score++;
    if (val.length >= 12) score++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
    if (/[0-9!@#$%^&*]/.test(val)) score++;
    const levels = ['', 'weak', 'medium', 'medium', 'strong'];
    const labels = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
    const colors = ['', '#ef4444', '#f59e0b', '#f59e0b', '#22c55e'];
    bars.forEach((b, i) => { b.className = 'pw-strength-bar' + (i < score ? ' ' + levels[score] : ''); });
    txt.textContent = val.length > 0 ? (labels[score] || '') : '';
    txt.style.color = colors[score] || '#78716c';
};

/* ───────────────────────────────────────────────────────────────────
   FAVORITOS — para el panel "mi-sabormap.html"
   ─────────────────────────────────────────────────────────────────── */
async function loadFoodieFavorites() {
    if (!sbFoodies || !currentFoodie) return [];
    const { data, error } = await sbFoodies
        .from('favorites')
        .select('*')
        .eq('foodie_id', currentFoodie.id)
        .order('created_at', { ascending: false });
    if (error) {
        console.warn('[foodies-app] loadFoodieFavorites:', error);
        return [];
    }
    return data || [];
}
window.loadFoodieFavorites = loadFoodieFavorites;

async function removeFavorite(placeId) {
    if (!sbFoodies || !currentFoodie) return false;
    const { error } = await sbFoodies
        .from('favorites')
        .delete()
        .eq('foodie_id', currentFoodie.id)
        .eq('place_id', String(placeId));
    if (error) { showToast('No se pudo quitar el favorito', true); return false; }
    return true;
}
window.removeFavorite = removeFavorite;

/* ───────────────────────────────────────────────────────────────────
   RESEÑAS — para el panel "mi-sabormap.html"
   ─────────────────────────────────────────────────────────────────── */
async function loadFoodieReviews() {
    if (!sbFoodies || !currentFoodie) return [];
    const { data, error } = await sbFoodies
        .from('reviews')
        .select('*')
        .eq('foodie_id', currentFoodie.id)
        .order('created_at', { ascending: false });
    if (error) {
        console.warn('[foodies-app] loadFoodieReviews:', error);
        return [];
    }
    return data || [];
}
window.loadFoodieReviews = loadFoodieReviews;

async function deleteReview(reviewId) {
    if (!sbFoodies || !currentFoodie) return false;
    if (!confirm('¿Seguro que quieres borrar esta reseña? No se puede deshacer.')) return false;
    const { error } = await sbFoodies
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('foodie_id', currentFoodie.id);
    if (error) { showToast('No se pudo borrar: ' + error.message, true); return false; }
    showToast('Reseña borrada');
    return true;
}
window.deleteReview = deleteReview;

async function updateReview(reviewId, fields) {
    if (!sbFoodies || !currentFoodie) return false;
    const { error } = await sbFoodies
        .from('reviews')
        .update(fields)
        .eq('id', reviewId)
        .eq('foodie_id', currentFoodie.id);
    if (error) { showToast('No se pudo guardar: ' + error.message, true); return false; }
    showToast('Reseña actualizada');
    return true;
}
window.updateReview = updateReview;

/* ───────────────────────────────────────────────────────────────────
   PERFIL — guardar cambios
   ─────────────────────────────────────────────────────────────────── */
async function saveFoodieProfile(fields) {
    if (!sbFoodies || !currentFoodie) return false;
    const { error } = await sbFoodies
        .from('foodies')
        .update(fields)
        .eq('id', currentFoodie.id);
    if (error) { showToast('No se pudo guardar el perfil: ' + error.message, true); return false; }
    foodieProfile = { ...foodieProfile, ...fields };
    showToast('Perfil guardado');
    return true;
}
window.saveFoodieProfile = saveFoodieProfile;

/* ───────────────────────────────────────────────────────────────────
   MIS LISTAS — collections + list_items  (panel mi-sabormap.html)
   ─────────────────────────────────────────────────────────────────── */
async function loadFoodieCollections() {
    if (!sbFoodies || !currentFoodie) return [];
    const { data, error } = await sbFoodies
        .from('collections')
        .select('*, list_items(*)')
        .eq('foodie_id', currentFoodie.id)
        .order('created_at', { ascending: false });
    if (error) {
        // Tabla no creada aún (SQL no ejecutado) → [] sin romper el panel
        console.warn('[foodies-app] loadFoodieCollections:', error.message);
        return [];
    }
    (data || []).forEach(c => {
        if (Array.isArray(c.list_items)) {
            c.list_items.sort((a, b) => new Date(b.added_at) - new Date(a.added_at));
        } else {
            c.list_items = [];
        }
    });
    return data || [];
}
window.loadFoodieCollections = loadFoodieCollections;

async function createCollection(name) {
    if (!sbFoodies || !currentFoodie) return null;
    const clean = (name || '').trim();
    if (!clean) { showToast('Escribe un nombre para la lista', true); return null; }
    if (clean.length > 60) { showToast('Máximo 60 caracteres', true); return null; }
    const { data, error } = await sbFoodies
        .from('collections')
        .insert({ foodie_id: currentFoodie.id, name: clean })
        .select().single();
    if (error) { showToast('No se pudo crear la lista: ' + error.message, true); return null; }
    showToast('Lista creada');
    return data;
}
window.createCollection = createCollection;

async function renameCollection(id, name) {
    if (!sbFoodies || !currentFoodie) return false;
    const clean = (name || '').trim();
    if (!clean) return false;
    const { error } = await sbFoodies
        .from('collections')
        .update({ name: clean })
        .eq('id', id).eq('foodie_id', currentFoodie.id);
    if (error) { showToast('No se pudo renombrar: ' + error.message, true); return false; }
    showToast('Lista renombrada');
    return true;
}
window.renameCollection = renameCollection;

async function deleteCollection(id) {
    if (!sbFoodies || !currentFoodie) return false;
    if (!confirm('¿Borrar esta lista y todos sus lugares? No se puede deshacer.')) return false;
    const { error } = await sbFoodies
        .from('collections')
        .delete()
        .eq('id', id).eq('foodie_id', currentFoodie.id);
    if (error) { showToast('No se pudo borrar la lista', true); return false; }
    showToast('Lista borrada');
    return true;
}
window.deleteCollection = deleteCollection;

async function addPlaceToCollection(collectionId, placeId, placeSource, placeName) {
    if (!sbFoodies || !currentFoodie) return false;
    const { error } = await sbFoodies
        .from('list_items')
        .upsert({
            collection_id: collectionId,
            foodie_id: currentFoodie.id,
            place_id: String(placeId),
            place_source: placeSource || 'static',
            place_name_snapshot: placeName || null
        }, { onConflict: 'collection_id,place_id,place_source' });
    if (error) {
        // [FIX v2.0.27] Distinguir duplicado real (23505) de otros errores.
        // Antes: m.includes('unique') matcheaba también el error "no unique or
        // exclusion constraint matching the ON CONFLICT" (constraint mal configurada)
        // → mostraba "Ya está en esta lista" + return true → el lugar NO se añadió
        // pero la UI decía que sí. Falso éxito silencioso.
        if (error.code === '23505') { showToast('Ya está en esta lista'); return true; }
        showToast('No se pudo añadir: ' + error.message, true); return false;
    }
    showToast('Añadido a la lista');
    return true;
}
window.addPlaceToCollection = addPlaceToCollection;

async function removePlaceFromCollection(itemId) {
    if (!sbFoodies || !currentFoodie) return false;
    const { error } = await sbFoodies
        .from('list_items')
        .delete()
        .eq('id', itemId).eq('foodie_id', currentFoodie.id);
    if (error) { showToast('No se pudo quitar el lugar', true); return false; }
    return true;
}
window.removePlaceFromCollection = removePlaceFromCollection;

/* ───────────────────────────────────────────────────────────────────
   PLACES — resolver detalle de un place por ID + source
   ───────────────────────────────────────────────────────────────────
   Para mostrar un favorito/reseña en el panel necesitamos nombre,
   categoría, barrio, imagen. Si es estático (places.js) lo sacamos
   de ahí; si es de Supabase, lo fetcheamos del proyecto principal. */
async function fetchPlaceById(placeId, placeSource) {
    // 1) Intentar staticPlaces si está cargado (places.js incluido)
    if (window.staticPlaces && Array.isArray(window.staticPlaces)) {
        const sp = window.staticPlaces.find(p => String(p.id) === String(placeId));
        if (sp) return sp;
    }
    // 2) Si el source es 'supabase' o desconocido, fetch del proyecto principal
    if (sbPlaces && (placeSource === 'supabase' || !placeSource)) {
        try {
            const { data, error } = await sbPlaces
                .from('places')
                .select('id, name, category, neighborhood, address, images, status')
                .eq('id', placeId)
                .maybeSingle();
            if (!error && data && data.status === 'published') {
                return {
                    id: data.id,
                    name: data.name,
                    category: data.category,
                    neighborhood: data.neighborhood,
                    address: data.address,
                    images: Array.isArray(data.images) ? data.images : [],
                    _fromDb: true
                };
            }
        } catch (e) {
            console.warn('[foodies-app] fetchPlaceById Supabase:', e);
        }
    }
    // 3) No encontrado → devolver un objeto mínimo con el snapshot
    return null;
}
window.fetchPlaceById = fetchPlaceById;

/* ───────────────────────────────────────────────────────────────────
   ON AUTH STATE CHANGE — cerrar sesión si el token se invalida
   ─────────────────────────────────────────────────────────────────── */
if (sbFoodies) {
    sbFoodies.auth.onAuthStateChange((event, session) => {
        const user = session && session.user;
        // [v2.0.28/S-02] PKCE recovery: el usuario viene del email de reset
        //   (?code= intercambiado por handlePkceRedirect). Mostrar el form de
        //   nueva contraseña en cuenta.html; en otra página, derivar a cuenta.
        //   Debe ir ANTES del bloque de redirección al panel, o mandaría al
        //   usuario a mi-sabormap en vez de dejarlo cambiar su contraseña.
        if (event === 'PASSWORD_RECOVERY') {
            currentFoodie = user || currentFoodie;
            if (window.location.pathname.endsWith('cuenta.html')) {
                if (typeof window.showView === 'function') {
                    try { window.showView('reset'); } catch (e) {}
                }
                return;
            }
            window.location.href = 'cuenta.html?view=reset';
            return;
        }
        // [FIX favoritos] Manejar TODO evento con sesión válida, no solo
        //   SIGNED_OUT. En supabase-js@2.49.4 el callback dispara INITIAL_SESSION
        //   al suscribirse y TOKEN_REFRESHED al refrescar el token (no SIGNED_IN).
        //   Si los ignorábamos, una sesión detectada tarde (getSession() null en
        //   el primer instante) nunca se activaba → mi-sabormap redirigía a login
        //   a un usuario logueado.
        if (user && event !== 'SIGNED_OUT') {
            const idChanged = !currentFoodie || currentFoodie.id !== user.id;
            currentFoodie = user;
            // [FIX favoritos] Si estamos en cuenta.html (login) y llegó sesión
            //   (INITIAL_SESSION/TOKEN_REFRESHED), el usuario ya está logueado:
            //   ir al panel, o a la home si ?return=home (favorito pendiente).
            if (window.location.pathname.endsWith('cuenta.html')) {
                window.location.href = authReturnTarget();
                return;
            }
            // Si initFoodieAuth(required=true) está esperando el margen de
            // detección tardía (mi-sabormap), resolverlo: cargar perfil y
            // devolver true para que la página renderice.
            if (foodieAuthResolve) {
                clearTimeout(foodieAuthGraceTimer);
                foodieAuthGraceTimer = null;
                const resolve = foodieAuthResolve;
                foodieAuthResolve = null;
                loadFoodieProfile()
                    .then(() => resolve(true))
                    .catch(() => resolve(true)); // resolver igual; la UI usa currentFoodie
                return;
            }
            if (idChanged) {
                loadFoodieProfile().catch(e => console.warn('[foodies-app] onAuth profile:', e));
            }
        } else if (event === 'SIGNED_OUT') {
            currentFoodie = null;
            foodieProfile = null;
            if (foodieAuthResolve) {
                clearTimeout(foodieAuthGraceTimer);
                foodieAuthResolve = null;
                foodieAuthGraceTimer = null;
            }
            // Si estamos en mi-sabormap.html, ir a cuenta.html
            if (window.location.pathname.endsWith('mi-sabormap.html')) {
                window.location.href = 'cuenta.html';
            }
        }
    });
}

/* ═══════════════════════════════════════════════════════════════════
   [v1.1 dashboard] ESTADÍSTICAS, ACTIVIDAD, CONFIGURACIÓN AVANZADA
   ───────────────────────────────────────────────────────────────────
   Funciones usadas por las 3 secciones nuevas de mi-sabormap.html.
   ═══════════════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────────────────
   ESTADÍSTICAS — cálculos para los gráficos del dashboard
   ─────────────────────────────────────────────────────────────────── */

/* loadFoodieStats — devuelve un objeto con todas las métricas para los
   gráficos SVG del dashboard. Hace 1 query (reviews + favorites + reports
   del usuario) y deriva todo localmente para no multiplicar RTTs. */
async function loadFoodieStats() {
    if (!sbFoodies || !currentFoodie) return null;
    try {
        // Traer todo en paralelo (3 queries, mismo RTT vía Promise.all)
        const [favRes, revRes, repRes] = await Promise.all([
            sbFoodies.from('favorites')
                .select('id, place_id, place_name_snapshot, created_at')
                .eq('foodie_id', currentFoodie.id)
                .order('created_at', { ascending: false }),
            sbFoodies.from('reviews')
                .select('id, place_id, place_name_snapshot, rating, status, created_at')
                .eq('foodie_id', currentFoodie.id)
                .order('created_at', { ascending: false }),
            sbFoodies.from('review_reports')
                .select('id, status, created_at')
                .eq('reporter_id', currentFoodie.id)
        ]);
        const favorites = favRes.data || [];
        const reviews   = revRes.data || [];
        const reports   = repRes.data || [];

        // ── 1. Distribución de ratings (1-5) ──────────────────
        const ratingDist = [0, 0, 0, 0, 0]; // index 0 = 1★, ..., index 4 = 5★
        let avgRating = 0;
        reviews.forEach(r => {
            if (r.rating >= 1 && r.rating <= 5) ratingDist[r.rating - 1]++;
        });
        if (reviews.length > 0) {
            avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
        }

        // ── 2. Barrios más visitados (top 5) ───────────────────
        // Para cada favorito, contamos por neighborhood — pero el barrio está
        // en staticPlaces o en la tabla places del proyecto actual.
        // Lo resolvemos fetchPlaceById para los top 50 favoritos (más que suficiente).
        const barrioCount = {};
        // [v2.0.28/U-04] N+1 eliminado: antes eran hasta 50 await fetchPlaceById
        //   en serie (50 microtask hops + 50 llamadas de red si fallaba el cache).
        //   Ahora disparamos los 50 en paralelo con Promise.all y contamos tras
        //   resolver. fetchPlaceById es idempotente y cachea en staticPlaces /
        //   localStorage, así que la mayoría resuelve sin red.
        const topFavs = favorites.slice(0, 50);
        const places = await Promise.all(
            topFavs.map(fav => fetchPlaceById(fav.place_id, fav.place_source))
        );
        for (let i = 0; i < topFavs.length; i++) {
            const place = places[i];
            const b = place && place.neighborhood ? place.neighborhood : 'Otros';
            barrioCount[b] = (barrioCount[b] || 0) + 1;
        }
        const topBarrios = Object.entries(barrioCount)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // ── 3. Actividad mensual (últimos 6 meses) ─────────────
        const now = new Date();
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                key: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'),
                label: d.toLocaleDateString('es-CU', { month: 'short' }),
                favoritos: 0,
                resenas: 0
            });
        }
        const monthKey = (dateStr) => {
            const d = new Date(dateStr);
            return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
        };
        favorites.forEach(f => {
            const k = monthKey(f.created_at);
            const m = months.find(x => x.key === k);
            if (m) m.favoritos++;
        });
        reviews.forEach(r => {
            const k = monthKey(r.created_at);
            const m = months.find(x => x.key === k);
            if (m) m.resenas++;
        });

        // ── 4. Totales ────────────────────────────────────────
        const total = {
            favoritos: favorites.length,
            resenas: reviews.length,
            resenas_publicadas: reviews.filter(r => r.status === 'published').length,
            resenas_pendientes: reviews.filter(r => r.status === 'pending').length,
            resenas_eliminadas: reviews.filter(r => r.status === 'removed').length,
            resenas_marcadas: reviews.filter(r => r.status === 'flagged').length,
            reportes: reports.length,
            reportes_abiertos: reports.filter(r => r.status === 'open').length,
            reportes_resueltos: reports.filter(r => r.status === 'resolved' || r.status === 'dismissed').length,
        };

        return {
            ratingDist, avgRating, topBarrios, months, total,
            // Datos crudos por si el panel los necesita
            _favorites: favorites,
            _reviews: reviews,
            _reports: reports
        };
    } catch (e) {
        console.error('[foodies-app] loadFoodieStats:', e);
        return null;
    }
}
window.loadFoodieStats = loadFoodieStats;

/* ───────────────────────────────────────────────────────────────────
   ACTIVIDAD — timeline derivado de favoritos + reseñas + reportes
   ─────────────────────────────────────────────────────────────────── */

/* loadFoodieActivity — devuelve un array de eventos ordenados del más
   reciente al más viejo. Cada evento tiene:
     { type: 'favorite'|'review'|'report'|'profile', ts, ...payload }
   Derivamos de los datos que ya trae loadFoodieStats (si están en cache)
   o hacemos una query fresca. */
async function loadFoodieActivity(limit) {
    limit = limit || 30;
    const stats = await loadFoodieStats();
    if (!stats) return [];
    const events = [];
    // Favoritos
    stats._favorites.forEach(f => {
        events.push({
            type: 'favorite',
            ts: f.created_at,
            place_id: f.place_id,
            place_name: f.place_name_snapshot || 'un local',
            action: 'added'
        });
    });
    // Reseñas (con su estado para mostrar contexto)
    stats._reviews.forEach(r => {
        events.push({
            type: 'review',
            ts: r.created_at,
            place_id: r.place_id,
            place_name: r.place_name_snapshot || 'un local',
            rating: r.rating,
            status: r.status
        });
    });
    // Reportes
    stats._reports.forEach(rp => {
        events.push({
            type: 'report',
            ts: rp.created_at,
            status: rp.status
        });
    });
    // Perfil: usamos updated_at como proxy de "editaste tu perfil"
    if (foodieProfile && foodieProfile.updated_at && foodieProfile.created_at) {
        const created = new Date(foodieProfile.created_at).getTime();
        const updated = new Date(foodieProfile.updated_at).getTime();
        if (updated > created + 60000) { // 1 min de margen para no duplicar el signup
            events.push({
                type: 'profile',
                ts: foodieProfile.updated_at,
                action: 'updated'
            });
        }
        // El signup cuenta como evento también
        events.push({
            type: 'profile',
            ts: foodieProfile.created_at,
            action: 'signup'
        });
    }
    // Ordenar descendente por fecha y limitar
    events.sort((a, b) => new Date(b.ts) - new Date(a.ts));
    return events.slice(0, limit);
}
window.loadFoodieActivity = loadFoodieActivity;

/* ───────────────────────────────────────────────────────────────────
   CONFIGURACIÓN AVANZADA — cambiar contraseña, verificar email, exportar
   ─────────────────────────────────────────────────────────────────── */

/* changeFoodiePassword — actualiza la contraseña via Supabase Auth.
   Cierra todas las demás sesiones excepto la actual. */
async function changeFoodiePassword(newPw, confirmPw) {
    if (!sbFoodies) return { ok: false, error: 'Cliente Supabase no disponible' };
    if (!newPw || newPw.length < 8) return { ok: false, error: 'La contraseña debe tener al menos 8 caracteres' };
    if (newPw !== confirmPw) return { ok: false, error: 'Las contraseñas no coinciden' };
    try {
        const { error } = await sbFoodies.auth.updateUser({ password: newPw });
        if (error) throw error;
        return { ok: true };
    } catch (e) {
        return { ok: false, error: e.message || 'No se pudo cambiar la contraseña' };
    }
}
window.changeFoodiePassword = changeFoodiePassword;

/* resendEmailVerification — reenvía el email de confirmación de email.
   Solo tiene sentido si el usuario aún no verificó su email. */
async function resendEmailVerification() {
    if (!sbFoodies || !currentFoodie) return { ok: false, error: 'Sin sesión' };
    if (currentFoodie.email_confirmed_at) return { ok: true, already: true };
    try {
        const { error } = await sbFoodies.auth.resend({
            type: 'signup',
            email: currentFoodie.email,
            options: { emailRedirectTo: window.location.origin + '/cuenta.html' }
        });
        if (error) throw error;
        return { ok: true };
    } catch (e) {
        return { ok: false, error: e.message || 'No se pudo reenviar el email' };
    }
}
window.resendEmailVerification = resendEmailVerification;

/* isEmailVerified — true si el usuario ya confirmó su email */
function isEmailVerified() {
    return !!(currentFoodie && currentFoodie.email_confirmed_at);
}
window.isEmailVerified = isEmailVerified;

/* exportFoodieData — genera un JSON con todos los datos del comensal y
   dispara la descarga. Cumple con el principio GDPR de portabilidad. */
async function exportFoodieData() {
    if (!sbFoodies || !currentFoodie) return { ok: false, error: 'Sin sesión' };
    try {
        const stats = await loadFoodieStats();
        // [FIX v2.0.27] Exportar también collections + place_photos (datos que el
        // comensal creó en v2.0.26). Antes la exportación GDPR estaba incompleta.
        const [collections, photos] = await Promise.all([loadFoodieCollections(), loadFoodiePhotos()]);
        const profile = { ...foodieProfile };
        // Quitar campos internos/ sensibles del snapshot exportado
        delete profile.id;
        const exportObj = {
            exported_at: new Date().toISOString(),
            schema_version: '1.2',
            account: {
                email: currentFoodie.email,
                email_verified: isEmailVerified(),
                created_at: currentFoodie.created_at,
                last_sign_in_at: currentFoodie.last_sign_in_at
            },
            profile: profile,
            favorites: stats._favorites.map(f => ({
                place_id: f.place_id,
                place_name: f.place_name_snapshot,
                place_source: f.place_source,
                added_at: f.created_at
            })),
            reviews: stats._reviews.map(r => ({
                place_id: r.place_id,
                place_name: r.place_name_snapshot,
                rating: r.rating,
                body: r.body,
                status: r.status,
                created_at: r.created_at,
                updated_at: r.updated_at
            })),
            reports: stats._reports.map(rp => ({
                review_id: rp.review_id,
                reason: rp.reason,
                status: rp.status,
                created_at: rp.created_at
            })),
            collections: collections.map(c => ({
                name: c.name,
                created_at: c.created_at,
                items: (c.list_items || []).map(it => ({
                    place_id: it.place_id,
                    place_name: it.place_name_snapshot,
                    place_source: it.place_source,
                    added_at: it.added_at
                }))
            })),
            photos: photos.map(ph => ({
                place_id: ph.place_id,
                place_name: ph.place_name_snapshot,
                url: ph.url,
                caption: ph.caption,
                status: ph.status,
                created_at: ph.created_at
            }))
        };
        const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dateStr = new Date().toISOString().slice(0, 10);
        a.download = 'sabormap-mis-datos-' + dateStr + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        return { ok: true };
    } catch (e) {
        return { ok: false, error: e.message || 'No se pudo exportar' };
    }
}
window.exportFoodieData = exportFoodieData;

/* updateFoodiePreferences — guarda los toggles de privacidad y notificaciones.
   Recibe un objeto con cualquier combinación de: email_notifications, email_marketing, is_public. */
async function updateFoodiePreferences(fields) {
    if (!sbFoodies || !currentFoodie) return { ok: false, error: 'Sin sesión' };
    const allowed = ['email_notifications', 'email_marketing', 'is_public'];
    const clean = {};
    allowed.forEach(k => { if (k in fields) clean[k] = !!fields[k]; });
    if (Object.keys(clean).length === 0) return { ok: false, error: 'Nada que actualizar' };
    try {
        const { error } = await sbFoodies
            .from('foodies')
            .update(clean)
            .eq('id', currentFoodie.id);
        if (error) throw error;
        // Actualizar cache local
        foodieProfile = { ...foodieProfile, ...clean };
        return { ok: true };
    } catch (e) {
        return { ok: false, error: e.message || 'No se pudo guardar' };
    }
}
window.updateFoodiePreferences = updateFoodiePreferences;

/* ═══════════════════════════════════════════════════════════════════
   [v1.2 avatars] SUBIDA DE FOTO DE PERFIL A SUPABASE STORAGE
   ───────────────────────────────────────────────────────────────────
   Función: uploadFoodieAvatar(file)
     · Valida tipo (image/jpeg, image/png, image/webp) y tamaño (max 5 MB)
     · Redimensiona client-side a 400×400 (cuadrado, centrado, cover) para
       no subir imágenes enormes (importante en Cuba, redes lentas)
     · Convierte todo a JPEG (calidad 0.85) para URLs más ligeras
     · Sube a `avatars/{uid}/avatar.jpg` con upsert:true
     · Actualiza `foodies.avatar_url` con la URL pública
     · Devuelve { ok:true, url } o { ok:false, error }

   Función: removeFoodieAvatar()
     · Borra el archivo del bucket (si existe)
     · Pone `avatar_url` a NULL en `foodies`

   Función: resizeImageFile(file, maxW, maxH) — helper
     · Usa canvas + createObjectURL para redimensionar
     · Devuelve un File JPEG listo para subir
   ═══════════════════════════════════════════════════════════════════ */

const AVATAR_MAX_BYTES = 5 * 1024 * 1024; // 5 MB antes del resize
const AVATAR_ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const AVATAR_RESIZE_SIZE = 400;            // 400x400 cuadrado
const AVATAR_QUALITY = 0.85;               // calidad JPEG final

async function uploadFoodieAvatar(file) {
    if (!sbFoodies || !currentFoodie) return { ok: false, error: 'Sin sesión' };
    if (!file) return { ok: false, error: 'No se recibió archivo' };

    // Validar tipo
    if (!AVATAR_ALLOWED_TYPES.includes(file.type)) {
        return { ok: false, error: 'Formato no soportado. Usa JPG, PNG o WebP.' };
    }
    // Validar tamaño
    if (file.size > AVATAR_MAX_BYTES) {
        return { ok: false, error: 'La foto supera los 5 MB. Elige una más pequeña.' };
    }

    try {
        // 1) Redimensionar client-side
        const resizedFile = await resizeImageFile(file, AVATAR_RESIZE_SIZE, AVATAR_RESIZE_SIZE);
        if (!resizedFile) {
            return { ok: false, error: 'No se pudo procesar la imagen. Intenta con otra.' };
        }

        // 2) Path del archivo: `{uid}/avatar.jpg`
        //    Usar siempre .jpg porque convertimos a JPEG en el resize.
        //    El upsert:true sobrescribe si ya existe una foto previa.
        const path = currentFoodie.id + '/avatar.jpg';

        // 3) Subir al bucket 'avatars'
        const { data: upData, error: upErr } = await sbFoodies.storage
            .from('avatars')
            .upload(path, resizedFile, {
                contentType: 'image/jpeg',
                cacheControl: '3600',
                upsert: true
            });
        if (upErr) throw upErr;

        // 4) Obtener la URL pública
        const { data: urlData } = sbFoodies.storage
            .from('avatars')
            .getPublicUrl(path);
        if (!urlData || !urlData.publicUrl) {
            throw new Error('No se pudo obtener la URL pública de la foto');
        }

        // Añadir cache-buster para forzar refresh del navegador
        // (si reemplazas la foto, el navegador podría mostrar la vieja)
        const finalUrl = urlData.publicUrl + '?t=' + Date.now();

        // 5) Actualizar foodies.avatar_url
        const { error: updErr } = await sbFoodies
            .from('foodies')
            .update({ avatar_url: finalUrl })
            .eq('id', currentFoodie.id);
        if (updErr) throw updErr;

        // 6) Actualizar cache local
        if (foodieProfile) foodieProfile.avatar_url = finalUrl; // [FIX v2.0.27] guard: foodieProfile puede ser null si loadFoodieProfile falló en red

        return { ok: true, url: finalUrl };
    } catch (e) {
        console.error('[foodies-app] uploadFoodieAvatar:', e);
        // Mensaje amigable para errores comunes
        const msg = (e.message || '').toLowerCase();
        if (msg.includes('policy') || msg.includes('permission') || msg.includes('rls')) {
            return { ok: false, error: 'El bucket "avatars" no está configurado. Pide al admin que ejecute el SQL de Storage.' };
        }
        if (msg.includes('bucket not found') || msg.includes('not found')) {
            return { ok: false, error: 'El bucket "avatars" no existe. Créalo en Supabase → Storage.' };
        }
        return { ok: false, error: e.message || 'No se pudo subir la foto' };
    }
}
window.uploadFoodieAvatar = uploadFoodieAvatar;

async function removeFoodieAvatar() {
    if (!sbFoodies || !currentFoodie) return { ok: false, error: 'Sin sesión' };
    try {
        const path = currentFoodie.id + '/avatar.jpg';
        // Borrar el archivo del bucket (si no existe, no da error)
        const { error: delErr } = await sbFoodies.storage
            .from('avatars')
            .remove([path]);
        // Si el archivo no existía, Storage devuelve error pero lo ignoramos
        // (la idea es que avatar_url quede null igual)
        if (delErr && !String(delErr.message || '').toLowerCase().includes('not found')) {
            console.warn('[foodies-app] removeFoodieAvatar: storage.remove:', delErr);
        }

        // Poner avatar_url en null
        const { error: updErr } = await sbFoodies
            .from('foodies')
            .update({ avatar_url: null })
            .eq('id', currentFoodie.id);
        if (updErr) throw updErr;

        if (foodieProfile) foodieProfile.avatar_url = null; // [FIX v2.0.27] guard
        return { ok: true };
    } catch (e) {
        console.error('[foodies-app] removeFoodieAvatar:', e);
        return { ok: false, error: e.message || 'No se pudo quitar la foto' };
    }
}
window.removeFoodieAvatar = removeFoodieAvatar;

/* resizeImageFile(file, maxW, maxH) — helper
   Redimensiona una imagen a un canvas cuadrado (cover) y devuelve un File JPEG.
   Pasos:
     · Carga la imagen en un <img> vía ObjectURL
     · Calcula el crop cuadrado centrado (cover, no stretch)
     · Dibuja al canvas con drawImage(img, sx, sy, sSize, sSize, 0, 0, maxW, maxH)
     · Convierte el canvas a Blob JPEG con calidad 0.85
     · Envuelve el Blob en un File con nombre `avatar.jpg` */
function resizeImageFile(file, maxW, maxH) {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            return reject(new Error('No es una imagen'));
        }
        const img = new Image();
        const objUrl = URL.createObjectURL(file);
        img.onload = function() {
            URL.revokeObjectURL(objUrl);
            try {
                // Calcular el crop cuadrado centrado (cover)
                const srcSize = Math.min(img.width, img.height);
                const sx = (img.width - srcSize) / 2;
                const sy = (img.height - srcSize) / 2;

                const canvas = document.createElement('canvas');
                canvas.width = maxW;
                canvas.height = maxH;
                const ctx = canvas.getContext('2d');
                // Fondo blanco por si la imagen tiene transparencia (PNG)
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, maxW, maxH);
                // Dibujar el crop cuadrado escalado al canvas
                ctx.drawImage(img, sx, sy, srcSize, srcSize, 0, 0, maxW, maxH);

                canvas.toBlob(function(blob) {
                    if (!blob) {
                        return reject(new Error('No se pudo generar el blob'));
                    }
                    // Envolver en un File
                    const out = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
                    resolve(out);
                }, 'image/jpeg', AVATAR_QUALITY);
            } catch (e) {
                reject(e);
            }
        };
        img.onerror = function() {
            URL.revokeObjectURL(objUrl);
            reject(new Error('No se pudo cargar la imagen'));
        };
        img.src = objUrl;
    });
}
window.resizeImageFile = resizeImageFile;

/* ───────────────────────────────────────────────────────────────────
   MIS FOTOS — place_photos  (Storage bucket "place-photos")
   ─────────────────────────────────────────────────────────────────── */
const PHOTO_ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const PHOTO_MAX_BYTES = 5 * 1024 * 1024;      // 5 MB
const PHOTO_MAX_W = 1280;                      // redimensiona a máx 1280px (mantiene ratio)

// Redimensiona manteniendo el ratio de aspecto (fit, no cover).
// Reutiliza AVATAR_QUALITY para la calidad JPEG final.
function resizePlacePhotoFile(file, maxW) {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) return reject(new Error('No es una imagen'));
        const img = new Image();
        const objUrl = URL.createObjectURL(file);
        img.onload = function () {
            URL.revokeObjectURL(objUrl);
            try {
                let w = img.naturalWidth || img.width;
                let h = img.naturalHeight || img.height;
                if (w > maxW) { h = Math.max(1, Math.round(h * maxW / w)); w = maxW; }
                const canvas = document.createElement('canvas');
                canvas.width = w; canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, w, h);
                ctx.drawImage(img, 0, 0, w, h);
                canvas.toBlob(function (blob) {
                    if (!blob) return reject(new Error('No se pudo generar el blob'));
                    resolve(new File([blob], 'photo.jpg', { type: 'image/jpeg' }));
                }, 'image/jpeg', AVATAR_QUALITY);
            } catch (e) { reject(e); }
        };
        img.onerror = function () { URL.revokeObjectURL(objUrl); reject(new Error('No se pudo cargar la imagen')); };
        img.src = objUrl;
    });
}
window.resizePlacePhotoFile = resizePlacePhotoFile;

async function uploadPlacePhoto(file, placeId, placeSource, placeName, caption) {
    if (!sbFoodies || !currentFoodie) return { ok: false, error: 'Sin sesión' };
    if (!file) return { ok: false, error: 'No se recibió archivo' };
    if (!PHOTO_ALLOWED_TYPES.includes(file.type))
        return { ok: false, error: 'Formato no soportado. Usa JPG, PNG o WebP.' };
    if (file.size > PHOTO_MAX_BYTES)
        return { ok: false, error: 'La foto supera los 5 MB. Elige una más pequeña.' };
    let uploadedPath = null; // [FIX v2.0.27] para limpiar de Storage si el INSERT DB falla tras subir
    try {
        const resized = await resizePlacePhotoFile(file, PHOTO_MAX_W);
        if (!resized) return { ok: false, error: 'No se pudo procesar la imagen.' };
        // Carpeta por uid + nombre único
        const path = currentFoodie.id + '/' + Date.now() + '-' +
                     Math.random().toString(36).slice(2, 8) + '.jpg';
        const { error: upErr } = await sbFoodies.storage
            .from('place-photos')
            .upload(path, resized, { contentType: 'image/jpeg', cacheControl: '3600', upsert: false });
        if (upErr) throw upErr;
        uploadedPath = path; // [FIX v2.0.27] subida OK; si el insert falla, se limpia en el catch
        const { data: urlData } = sbFoodies.storage
            .from('place-photos')
            .getPublicUrl(path);
        if (!urlData || !urlData.publicUrl) throw new Error('No se pudo obtener la URL pública');
        const finalUrl = urlData.publicUrl + '?t=' + Date.now();
        const { data: row, error: insErr } = await sbFoodies
            .from('place_photos')
            .insert({
                foodie_id: currentFoodie.id,
                place_id: String(placeId),
                place_source: placeSource || 'static',
                place_name_snapshot: placeName || null,
                url: finalUrl,
                caption: (caption || '').trim() || null,
                status: 'pending'
            })
            .select().single();
        if (insErr) throw insErr;
        return { ok: true, photo: row };
    } catch (e) {
        // [FIX v2.0.27] Si el archivo ya subió a Storage pero falló el INSERT DB,
        // borrar el archivo huérfano (antes quedaba vivo para siempre en el bucket).
        if (uploadedPath) {
            try { await sbFoodies.storage.from('place-photos').remove([uploadedPath]); }
            catch (e2) { console.warn('[foodies-app] uploadPlacePhoto: cleanup storage huérfano:', e2); }
        }
        console.error('[foodies-app] uploadPlacePhoto:', e);
        const msg = (e.message || '').toLowerCase();
        if (msg.includes('policy') || msg.includes('permission') || msg.includes('rls'))
            return { ok: false, error: 'El bucket "place-photos" no tiene RLS configurado. Ejecuta el SQL.' };
        if (msg.includes('bucket not found') || msg.includes('not found'))
            return { ok: false, error: 'El bucket "place-photos" no existe. Créalo en Supabase → Storage.' };
        return { ok: false, error: e.message || 'No se pudo subir la foto' };
    }
}
window.uploadPlacePhoto = uploadPlacePhoto;

async function loadFoodiePhotos() {
    if (!sbFoodies || !currentFoodie) return [];
    const { data, error } = await sbFoodies
        .from('place_photos')
        .select('*')
        .eq('foodie_id', currentFoodie.id)
        .order('created_at', { ascending: false });
    if (error) { console.warn('[foodies-app] loadFoodiePhotos:', error.message); return []; }
    return data || [];
}
window.loadFoodiePhotos = loadFoodiePhotos;

// [FIX v2.0.27] Extrae el path del objeto dentro de un bucket a partir de su URL pública.
// URL pública: https://{host}/storage/v1/object/public/{bucket}/{path}?t=...
function _extractStoragePath(url, bucket) {
    try {
        const u = new URL(url);
        const prefix = '/storage/v1/object/public/' + bucket + '/';
        const idx = u.pathname.indexOf(prefix);
        if (idx === -1) return null;
        return decodeURIComponent(u.pathname.slice(idx + prefix.length));
    } catch (e) { return null; }
}

async function deletePlacePhoto(photoId) {
    if (!sbFoodies || !currentFoodie) return false;
    // [FIX v2.0.27] Borrar TAMBIÉN el archivo de Storage, no solo la fila DB.
    // Antes: la URL pública seguía resolviendo → la foto "borrada" seguía
    // accesible públicamente → fuga de privacidad.
    try {
        const { data: row } = await sbFoodies
            .from('place_photos')
            .select('url')
            .eq('id', photoId)
            .eq('foodie_id', currentFoodie.id)
            .maybeSingle();
        if (row && row.url) {
            const path = _extractStoragePath(row.url, 'place-photos');
            if (path) {
                try { await sbFoodies.storage.from('place-photos').remove([path]); }
                catch (e) { console.warn('[foodies-app] deletePlacePhoto: storage.remove (no bloquea el delete DB):', e); }
            }
        }
    } catch (e) { console.warn('[foodies-app] deletePlacePhoto: pre-fetch url (no bloquea):', e); }
    const { error } = await sbFoodies
        .from('place_photos')
        .delete()
        .eq('id', photoId).eq('foodie_id', currentFoodie.id);
    if (error) { showToast('No se pudo borrar la foto', true); return false; }
    return true;
}
window.deletePlacePhoto = deletePlacePhoto;
