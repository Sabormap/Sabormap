const CACHE_NAME = 'sabormap-v3';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon-192x192.png',
    './icon-512x512.png',
    './icon-192x192-maskable.png',
    './icon-512x512-maskable.png'
];

// Instalar: cachear recursos esenciales
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// Activar: limpiar caches viejas y reclamar clientes
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(k => k !== CACHE_NAME)
                    .map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch: estrategia stale-while-revalidate para mejor experiencia offline
self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;

    const url = new URL(e.request.url);

    // Solo cachear recursos del mismo origen o CDN conocidos
    const isCacheable =
        url.origin === self.location.origin ||
        url.hostname.includes('cdn.') ||
        url.hostname.includes('unpkg.com') ||
        url.hostname.includes('jsdelivr.net') ||
        url.hostname.includes('cloudflare.com') ||
        url.hostname.includes('googleapis.com') ||
        url.hostname.includes('leaflet');

    e.respondWith(
        caches.match(e.request).then(cached => {
            // Si hay cache, lo devolvemos de inmediato y actualizamos en segundo plano
            if (cached) {
                if (isCacheable) {
                    fetch(e.request).then(response => {
                        if (response && response.status === 200) {
                            const clone = response.clone();
                            caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
                        }
                    }).catch(() => {}); // silenciar errores de red en background
                }
                return cached;
            }

            // Si no hay cache, ir a la red
            return fetch(e.request).then(response => {
                if (response.status === 200 && (response.type === 'basic' || response.type === 'cors')) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
                }
                return response;
            }).catch(() => {
                // Fallback offline para navegacion: devolver index.html
                if (e.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
                return new Response('Offline', { status: 503, statusText: 'Sin conexion' });
            });
        })
    );
});
