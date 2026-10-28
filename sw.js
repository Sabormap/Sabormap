/* ═══════════════════════════════════════════════════════════════════
   sw.js — Service Worker de Sabormap
   [v2.0.6 — FIX DEFINITIVO del bug "256 vs 257 lugares":
    places.js y app.js REMOVIDOS del PRECACHE. Antes, el precache guardaba
    una versión vieja (con 256 lugares) y cuando la red fallaba o era
    lenta (común en Cuba), networkFirst caía al caché y servía la versión
    vieja. Ahora el único caché de places.js es RUNTIME_CACHE, que siempre
    tiene la última versión fetched exitosamente.
    Base v2.0.5: network-first para dashboard.html + todos los HTML]

   Estrategia:
   · Precache tolerante del shell local (allSettled) + CDNs + woff2.
     ★ v2.0.6: places.js y app.js YA NO se precachean. Se cargan con
       network-first y se cachean solo en RUNTIME_CACHE (versión fresca).
   · Navegación: network-first con fallback y página offline.
   · places.js/app.js/dashboard.html/index.html → network-first.
   · Otros recursos propios y CDNs: stale-while-revalidate.
   · API de Supabase y terceros desconocidos: PASSTHROUGH.
   · Leaflet: carga bajo demanda [U-01/P-03].
   Para publicar una versión nueva: sube el valor de VERSION.
   ═══════════════════════════════════════════════════════════════════ */

const VERSION = 'v2.0.6'; // ↑ súbelo en cada despliegue — v2.0.6: places.js/app.js fuera del precache (fix 256 vs 257)
const STATIC_CACHE = `sabormap-static-${VERSION}`;
const RUNTIME_CACHE = `sabormap-runtime-${VERSION}`;

const PRECACHE_URLS = [
    // Shell local (sin places.js ni app.js — se cargan con network-first)
    './',
    './index.html',
    './manifest.json',
    // Iconos — las 4 variantes declaradas en manifest.json
    './icon-192x192.png',
    './icon-512x512.png',
    './icon-192x192-maskable.png',
    './icon-512x512-maskable.png',
    // CDNs críticos del primer render — URLs EXACTAS de sabormap.html [T-10]
    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/swiper@11.1.5/swiper-bundle.min.css',
    'https://cdn.jsdelivr.net/npm/swiper@11.1.5/swiper-bundle.min.js',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4'
];

/* Orígenes de terceros cuyas respuestas SÍ se cachean en runtime (SWR).
   OJO: supabase.co queda FUERA a propósito [R-03]: es la API de datos.
   La comparación es exacta o por subdominio del host listado [R-05]. */
const CDN_HOSTS = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdnjs.cloudflare.com',
    'unpkg.com',             // Leaflet 1.9.4 (cuando cargue bajo demanda)
    'cdn.jsdelivr.net',
    'basemaps.cartocdn.com'  // tiles del mapa (a/b/c/d.basemaps…)
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
        // Borra también 'sabormap-v4' y 'sabormap-static-v1.0.0' (previas)
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

    // 2) API de datos: NUNCA desde caché [R-03]. Sin conexión, app.js cae
    //    por diseño a staticPlaces (los 258 locales de places.js).
    if (url.hostname.includes('supabase.co')) return;

    // 3) Recursos propios (imágenes de locales, etc.)
    if (url.origin === self.location.origin) {
        // ★ FIX [v2.0.4]: places.js/app.js/dashboard.html siempre frescos cuando hay red.
        //   Antes eran stale-while-revalidate y servían la versión cacheada.
        //   Firefox es más conservador que Chrome con el SWR y no refrescaba,
        //   por lo que los fixes de iconos y menú nunca llegaban al usuario.
        if (url.pathname.endsWith('/places.js') ||
            url.pathname.endsWith('/app.js') ||
            url.pathname.endsWith('/dashboard.html') ||
            url.pathname.endsWith('/index.html') ||
            url.pathname === '/' || url.pathname === './') {
            event.respondWith(networkFirst(req));
            return;
        }
        event.respondWith(staleWhileRevalidate(req, false));
        return;
    }

    // 4) CDNs permitidos — incluidos los tiles CARTO del mapa [R-04]
    if (CDN_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith('.' + h))) {
        event.respondWith(staleWhileRevalidate(req, true)); // acepta opacas
        return;
    }

    // 5) Resto de terceros (analytics, etc.): passthrough, sin caché
});

/* Navegación y JS críticos: red primero; si falla, SOLO caché runtime.
   ★ FIX [v2.0.6]: ya NO se busca en caches.match(req) global, porque eso
   incluía STATIC_CACHE (precache viejo) y servía la versión con 256
   lugares. Ahora solo cae a RUNTIME_CACHE, que siempre tiene la última
   versión buena que se fetched de la red. */
async function networkFirst(req) {
    const cache = await caches.open(RUNTIME_CACHE);
    try {
        const fresh = await fetch(req);
        if (fresh && (fresh.status === 200 || fresh.type === 'opaque')) {
            cache.put(req, fresh.clone()).catch(() => {});
        }
        return fresh;
    } catch (err) {
        // ★ FIX: solo buscar en RUNTIME_CACHE (versión fresca), NO en
        //   STATIC_CACHE (que podría tener una versión vieja precacheada).
        //   Para navegación (index.html) sí permitimos fallback al
        //   precache del shell, porque index.html cambia poco.
        const cached = await cache.match(req);
        if (cached) return cached;
        // Solo para navegación (no para JS): fallback al shell precacheado
        if (req.mode === 'navigate') {
            const shell = (await caches.match('./index.html')) ||
                          (await caches.match('./'));
            if (shell) return shell;
        }
        return offlinePage();
    }
}

/* Estáticos: respuesta instantánea desde caché + refresco en segundo plano */
async function staleWhileRevalidate(req, acceptOpaque) {
    const cache = await caches.open(RUNTIME_CACHE);
    // Busca en runtime y también en el precache estático
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

/* Página offline mínima (UTF-8) para navegaciones sin red y sin caché.
   Sustituye al texto plano sin acentos de la versión aportada [R-06]. */
function offlinePage() {
    return new Response(
        '<!doctype html><html lang="es"><head><meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1">' +
        '<title>Sin conexión — Sabormap</title></head>' +
        '<body style="margin:0;height:100vh;display:grid;place-items:center;' +
        'background:#0b0e17;color:#e5e7eb;font-family:system-ui,sans-serif;' +
        'text-align:center;padding:1rem">' +
        '<div><h1 style="font-size:1.5rem;margin:0 0 .5rem">Sin conexi&oacute;n</h1>' +
        '<p style="opacity:.7;margin:0">Sabormap necesita internet la primera vez.<br>' +
        'Vuelve a intentarlo cuando tengas datos m&oacute;viles o WiFi.</p></div>' +
        '</body></html>',
        { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
}
