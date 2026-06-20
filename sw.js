/* ============================================================
   Sabormap — Service Worker corregido
   Estrategia:
   - Precarga locales + CDNs críticas en install (no atómico)
   - Navegación: network-first con fallback a index.html Y a "/"
   - Estáticos: stale-while-revalidate
   - CDNs cross-origin: cache-first con revalidación
   ============================================================ */

const CACHE_NAME = 'sabormap-v4';

// URLs locales que SIEMPRE deben estar en caché
const LOCAL_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-192x192.png',
    './icon-512x512.png',
    './icon-192x192-maskable.png',
    './icon-512x512-maskable.png'
];

// CDNs críticas para que la app funcione offline
const CDN_ASSETS = [
    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
    'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// Hosts cacheables cross-origin
const CACHEABLE_HOSTS = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdnjs.cloudflare.com',
    'unpkg.com',
    'cdn.jsdelivr.net',
    'cloudflare.com'
];

// ---------- INSTALL: cachear todo, pero SIN fallar si un archivo 404 ----------
self.addEventListener('install', e => {
    e.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        // Importante: usamos addAll tolerante a fallos individuales
        await Promise.allSettled([
            ...LOCAL_ASSETS,
            ...CDN_ASSETS
        ].map(url => cache.add(url).catch(err => console.warn('[SW] No se pudo cachear:', url, err))));
        await self.skipWaiting();
    })());
});

// ---------- ACTIVATE: limpiar caches viejos + reclamar clientes ----------
self.addEventListener('activate', e => {
    e.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(
            keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
        );
        await self.clients.claim();
    })());
});

// ---------- Helper: ¿es cacheable? ----------
function isCacheable(url) {
    return (
        url.origin === self.location.origin ||
        CACHEABLE_HOSTS.some(h => url.hostname.includes(h))
    );
}

// ---------- FETCH ----------
self.addEventListener('fetch', e => {
    const req = e.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);

    // 1) NAVEGACIÓN: network-first con fallback offline a index.html y a "/"
    if (req.mode === 'navigate') {
        e.respondWith((async () => {
            try {
                const net = await fetch(req);
                // Actualizar caché en background
                const cache = await caches.open(CACHE_NAME);
                cache.put(req, net.clone()).catch(() => {});
                return net;
            } catch (err) {
                // Offline: probar la request exacta, luego index.html, luego "/"
                const cache = await caches.open(CACHE_NAME);
                const fallback =
                    (await cache.match(req)) ||
                    (await cache.match('./index.html')) ||
                    (await cache.match('./')) ||
                    (await cache.match('/index.html')) ||
                    (await cache.match('/'));
                if (fallback) return fallback;
                return new Response(
                    '<h1>Sin conexion</h1><p>Sabormap necesita internet la primera vez.</p>',
                    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
                );
            }
        })());
        return;
    }

    // 2) Recursos estáticos: stale-while-revalidate
    if (isCacheable(url)) {
        e.respondWith((async () => {
            const cache = await caches.open(CACHE_NAME);
            const cached = await cache.match(req);
            const network = fetch(req)
                .then(res => {
                    if (res && (res.status === 200 || res.status === 0)) {
                        cache.put(req, res.clone()).catch(() => {});
                    }
                    return res;
                })
                .catch(() => cached); // si la red falla, devolvemos cache (puede ser undefined)
            return cached || network;
        })());
        return;
    }

    // 3) Resto: dejar pasar al navegador
    // (no interceptamos)
});
