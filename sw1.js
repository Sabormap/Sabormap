/* ═══════════════════════════════════════════════════════════════════
   sw1.js — Service Worker del Dashboard SaborMap
   [v2.0.5 — FIX: dashboard.html/app.js/places.js con estrategia
    network-first para que los cambios (iconos, fixes de menú,
    nuevos campos) se vean de inmediato en Firefox sin tener que
    bump VERSION cada vez.
    Base v1.0.0: soporte offline básico del panel + Background Sync]

   Estrategia:
   · Precache tolerante del shell local (allSettled: un 404 no aborta el
     SW) + CDNs críticos del primer render (Supabase, Fonts, FA6).
   · Navegación: network-first con cadena de fallback y página offline.
   · dashboard.html, app.js, places.js → network-first ★ (FIX: antes
     eran stale-while-revalidate y Firefox servía la versión cacheada
     con el bug de los iconos `fafa-` durante días).
   · Otros recursos propios y CDNs permitidos: stale-while-revalidate;
     se aceptan respuestas opacas (type 'opaque') — sin esto, las fuentes
     woff2 y los tiles del mapa nunca entrarían en caché.
   · API de Supabase: PASSTHROUGH (nunca se cachea → no hay datos stale
     ni respuestas de auth en caché). Esto es crítico para que el
     dashboard refresque perfiles/suscripciones/locales siempre desde
     el servidor cuando haya conexión.
   · Tailwind eliminado del precache y de CDN_HOSTS: ya no se usa en
     el dashboard (conflictuaba con Font Awesome 6).

   Para publicar una versión nueva: sube el valor de VERSION.
   ═══════════════════════════════════════════════════════════════════ */

const VERSION = 'v2.0.5'; // ↑ súbelo en cada despliegue — v2.0.5: network-first para dashboard.html + todos los HTML/JS
const STATIC_CACHE = `sabormap-dashboard-static-${VERSION}`;
const RUNTIME_CACHE = `sabormap-dashboard-runtime-${VERSION}`;

const PRECACHE_URLS = [
    // Shell local
    './',
    './dashboard.html',
    './manifest.json',
    // CDNs críticos del primer render — URLs EXACTAS del HTML
    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4'
];

/* Orígenes de terceros cuyas respuestas SÍ se cachean en runtime (SWR).
   OJO: supabase.co queda FUERA a propósito [R-03]: es la API de datos.
   Tailwind removido: ya no se carga en el dashboard. */
const CDN_HOSTS = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdnjs.cloudflare.com',
    'cdn.jsdelivr.net'
];

/* ---------- INSTALL: precache tolerante + fuentes woff2 best-effort ---------- */
self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(STATIC_CACHE);
        await Promise.allSettled(
            PRECACHE_URLS.map((u) =>
                cache.add(u).catch((err) => console.warn('[SW] Sin precache:', u, err))
            )
        );
        await precacheFontFiles(cache);
        await self.skipWaiting();
    })());
});

/* El CSS de Google Fonts lista los .woff2 en URLs que el navegador pide
   aparte; sin este paso, la primera sesión offline mostraría tipografías
   de sistema [R-07]. Best-effort: si falla, no rompe la instalación. */
async function precacheFontFiles(cache) {
    try {
        const cssUrl = PRECACHE_URLS.find((u) => u.includes('fonts.googleapis.com'));
        const res = await fetch(cssUrl, { cache: 'no-cache' });
        if (!res.ok) return;
        const css = await res.text();
        const files = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g)]
            .map((m) => m[1]);
        await Promise.allSettled(files.map((u) => cache.add(u).catch(() => {})));
        if (files.length) console.log('[SW] woff2 precacheados:', files.length);
    } catch (err) {
        console.warn('[SW] woff2 no precacheados:', err);
    }
}

/* ---------- ACTIVATE: limpieza por VERSION + reclamar clientes ---------- */
self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keep = new Set([STATIC_CACHE, RUNTIME_CACHE]);
        const keys = await caches.keys();
        await Promise.all(
            keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k))
        );
        await self.clients.claim();
    })());
});

/* ---------- FETCH ---------- */
self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);

    // 1) Navegación: network-first con cadena de fallback + página offline
    if (req.mode === 'navigate') {
        event.respondWith(networkFirst(req));
        return;
    }

    // 2) API de datos de Supabase: NUNCA desde caché [R-03].
    //    Sin conexión, el dashboard mostrará datos en memoria (si los hay)
    //    o un toast "Sin conexión" pero no datos stale del servidor.
    if (url.hostname.includes('supabase.co')) return;

    // 3) Recursos propios
    if (url.origin === self.location.origin) {
        // ★ FIX [v2.0.5]: dashboard.html, app.js, places.js siempre frescos cuando hay red.
        //   Antes eran stale-while-revalidate y servían la versión cacheada
        //   con el bug de los iconos `fafa-` y sin el fix del timeout en el save.
        //   Firefox es más conservador que Chrome con el SWR y no refrescaba.
        if (url.pathname.endsWith('/dashboard.html') ||
            url.pathname.endsWith('/app.js') ||
            url.pathname.endsWith('/places.js') ||
            url.pathname.endsWith('/index.html') ||
            url.pathname === '/' || url.pathname === './') {
            event.respondWith(networkFirst(req));
            return;
        }
        event.respondWith(staleWhileRevalidate(req, false));
        return;
    }

    // 4) CDNs permitidos
    if (CDN_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith('.' + h))) {
        event.respondWith(staleWhileRevalidate(req, true)); // acepta opacas
        return;
    }

    // 5) Resto de terceros: passthrough, sin caché
});

/* Navegación: red primero; si falla, caché exacta → precache → offline */
async function networkFirst(req) {
    const cache = await caches.open(RUNTIME_CACHE);
    try {
        const fresh = await fetch(req);
        if (fresh && (fresh.status === 200 || fresh.type === 'opaque')) {
            cache.put(req, fresh.clone()).catch(() => {});
        }
        return fresh;
    } catch (err) {
        const cached = (await cache.match(req)) ||
                       (await caches.match(req)) ||
                       (await caches.match('./dashboard.html')) ||
                       (await caches.match('./'));
        if (cached) return cached;
        return offlinePage();
    }
}

/* Estáticos: respuesta instantánea desde caché + refresco en segundo plano */
async function staleWhileRevalidate(req, acceptOpaque) {
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = (await cache.match(req)) || (await caches.match(req));
    const network = fetch(req)
        .then((res) => {
            const ok = res && (res.status === 200 ||
                               (acceptOpaque && res.type === 'opaque'));
            if (ok) cache.put(req, res.clone()).catch(() => {});
            return res;
        })
        .catch(() => null);
    if (cached) return cached;
    const fresh = await network;
    return fresh || new Response('', { status: 504, statusText: 'Offline' });
}

/* Página offline mínima (UTF-8) para navegaciones sin red y sin caché. */
function offlinePage() {
    return new Response(
        '<!doctype html><html lang="es"><head><meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1">' +
        '<title>Sin conexión — SaborMap Dashboard</title></head>' +
        '<body style="margin:0;height:100vh;display:grid;place-items:center;' +
        'background:#070912;color:#f1f5f9;font-family:system-ui,sans-serif;' +
        'text-align:center;padding:1rem">' +
        '<div style="max-width:400px">' +
        '<div style="font-size:3rem;margin-bottom:16px">📡</div>' +
        '<h1 style="font-size:1.5rem;margin:0 0 .5rem;color:#fbbf24">Sin conexión</h1>' +
        '<p style="opacity:.7;margin:0 0 20px;line-height:1.6">El panel necesita internet la primera vez que se carga. ' +
        'Si estabas editando un formulario, tu progreso se guardó automáticamente como borrador local.</p>' +
        '<button onclick="location.reload()" style="padding:12px 24px;border:none;border-radius:10px;' +
        'background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#fff;font-weight:600;cursor:pointer;' +
        'font-size:0.9rem">Reintentar conexión</button>' +
        '</div></body></html>',
        { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
}

/* ---------- MESSAGE: hook para forzar activación inmediata si se requiere ---------- */
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

/* ═══════════════════════════════════════════════════════════════════
   [F-5.1+] BACKGROUND SYNC — Procesar cola de operaciones offline
   ───────────────────────────────────────────────────────────────────
   Cuando el navegador detecta que hay conexión estable, dispara el
   evento 'sync' con el tag que registramos desde el cliente. El SW
   entonces abre IndexedDB 'sabormap_pending_ops' y procesa cada op.

   IMPORTANTE: el SW no tiene acceso al cliente Supabase (sb) ni al
   token de sesión. Por eso enviamos las operaciones al cliente via
   postMessage y esperamos confirmación. Si el cliente responde 'ok',
   eliminamos la op de la cola; si responde 'fatal', la marcamos como
   'failed'; si no responde, dejamos en 'pending' para el próximo sync.
   ═══════════════════════════════════════════════════════════════════ */
const SYNC_TAG = 'sabormap-sync-queue';
const SYNC_OP_TIMEOUT = 30000; // 30s por operación

self.addEventListener('sync', (event) => {
    if (event.tag === SYNC_TAG) {
        event.waitUntil(processQueueInSW());
    }
});

async function processQueueInSW() {
    const db = await openSWOpsDB();
    if (!db) return;

    const ops = await new Promise((resolve) => {
        const tx = db.transaction('ops', 'readonly');
        const req = tx.objectStore('ops').getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
    });

    const pending = ops.filter(o => o.status === 'pending' || o.status === 'retry');
    if (pending.length === 0) return;

    // Necesitamos al menos un cliente visible para ejecutar las ops
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (clients.length === 0) {
        console.log('[SW] No hay clientes activos para procesar cola de', pending.length, 'ops');
        return;
    }
    const client = clients[0];

    for (const op of pending) {
        try {
            const result = await sendOpToClient(client, op);
            if (result && result.ok) {
                await swDeleteOp(db, op.id);
            } else if (result && result.fatal) {
                await swUpdateOpStatus(db, op.id, 'failed', result.error);
            } else {
                await swUpdateOpStatus(db, op.id, 'retry', (result && result.error) || 'unknown');
            }
        } catch (err) {
            console.warn('[SW] Op', op.id, 'no procesada:', err);
            await swUpdateOpStatus(db, op.id, 'retry', err.message || String(err));
        }
    }

    client.postMessage({ type: 'queue-processed' });
}

function sendOpToClient(client, op) {
    return new Promise((resolve) => {
        const messageId = 'op-' + op.id + '-' + Date.now();
        let settled = false;

        const timeout = setTimeout(() => {
            if (!settled) {
                settled = true;
                resolve({ ok: false, fatal: false, error: 'timeout' });
            }
        }, SYNC_OP_TIMEOUT);

        const handler = (event) => {
            if (!event.data || event.data.type !== 'op-result' || event.data.messageId !== messageId) return;
            if (settled) return;
            settled = true;
            clearTimeout(timeout);
            self.removeEventListener('message', handler);
            resolve(event.data.result);
        };
        self.addEventListener('message', handler);

        client.postMessage({
            type: 'execute-op',
            messageId: messageId,
            op: op
        });
    });
}

function openSWOpsDB() {
    return new Promise((resolve) => {
        const req = indexedDB.open('sabormap_pending_ops', 1);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('ops')) {
                const store = db.createObjectStore('ops', { keyPath: 'id', autoIncrement: true });
                store.createIndex('status', 'status', { unique: false });
                store.createIndex('type', 'type', { unique: false });
            }
        };
        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror = () => resolve(null);
    });
}

function swDeleteOp(db, id) {
    return new Promise((resolve) => {
        const tx = db.transaction('ops', 'readwrite');
        tx.objectStore('ops').delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
    });
}

function swUpdateOpStatus(db, id, status, errorMsg) {
    return new Promise((resolve) => {
        const tx = db.transaction('ops', 'readwrite');
        const store = tx.objectStore('ops');
        const getReq = store.get(id);
        getReq.onsuccess = () => {
            const op = getReq.result;
            if (!op) return resolve();
            op.status = status;
            op.attempts = (op.attempts || 0) + 1;
            op.last_error = errorMsg || op.last_error;
            op.last_attempt_at = new Date().toISOString();
            store.put(op);
        };
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
    });
}
