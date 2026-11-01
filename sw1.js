/* ═══════════════════════════════════════════════════════════════════
   sw1.js — Service Worker del Dashboard SaborMap
   [v2.0.18 — timeout 15s + siempre encolar en local tras fallo +
    pre-refresh del token + .select() para detectar RLS silent denial +
    polyfill Web Locks + logout optimista. Hereda todos los fixes
    v2.0.6 → v2.0.17.]

   Estrategia:
   · Precache tolerante del shell local (allSettled) + CDNs críticos.
   · Navegación: network-first con cadena de fallback y página offline.
   · dashboard.html → network-first (siempre fresco cuando hay red).
   · Otros recursos propios y CDNs: stale-while-revalidate.
   · API de Supabase: PASSTHROUGH (nunca se cachea).

   Para publicar una versión nueva: sube el valor de VERSION.
   ═══════════════════════════════════════════════════════════════════ */

const VERSION = 'v2.0.18';
const STATIC_CACHE = `sabormap-dashboard-static-${VERSION}`;
const RUNTIME_CACHE = `sabormap-dashboard-runtime-${VERSION}`;

const PRECACHE_URLS = [
    './',
    './dashboard.html',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4'
];

const CDN_HOSTS = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdnjs.cloudflare.com',
    'cdn.jsdelivr.net'
];

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

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keep = new Set([STATIC_CACHE, RUNTIME_CACHE]);
        const keys = await caches.keys();
        await Promise.all(
            keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k))
        );
        await self.clients.claim();
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        clients.forEach(c => c.postMessage({ type: 'sw-updated', version: VERSION }));
    })());
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);

    if (req.mode === 'navigate') {
        event.respondWith(networkFirst(req));
        return;
    }

    if (url.hostname.includes('supabase.co')) return;

    if (url.origin === self.location.origin) {
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

    if (CDN_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith('.' + h))) {
        event.respondWith(staleWhileRevalidate(req, true));
        return;
    }
});

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
        '<p style="opacity:.7;margin:0 0 20px;line-height:1.6">El panel necesita internet la primera vez que se carga.</p>' +
        '<button onclick="location.reload()" style="padding:12px 24px;border:none;border-radius:10px;' +
        'background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#fff;font-weight:600;cursor:pointer;' +
        'font-size:0.9rem">Reintentar conexión</button>' +
        '</div></body></html>',
        { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
}

self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

/* BACKGROUND SYNC */
const SYNC_TAG = 'sabormap-sync-queue';
const SYNC_OP_TIMEOUT = 30000;

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
