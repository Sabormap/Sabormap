/* ═══════════════════════════════════════════════════════════════════
   sw.js — Service Worker de Sabormap (home pública + comensales)
   ═══════════════════════════════════════════════════════════════════
   [v2.0.30 — AUDIT SENIOR FRONTEND (rendimiento + UI/UX + a11y + resiliencia):
    · PERF: getFilteredPlaces memoizado por turno (queueMicrotask invalida al
      siguiente turno) → renderPlaces + renderMapMarkers(×2) ya no recomputan
      el mismo filter 3×. Badge refresh: updateOpenBadgeInPlace() muta
      clase+texto PRESERVANDO .pulse (antes outerHTML reiniciaba la animación
      `pulse` cada 60s) + short-circuit si sin cambios + Map id→place O(n+m)
      vs O(n×m) staticPlaces.find por tarjeta. cardHTML <img> +decoding=async
      +width/height (CLS). handleMobileThemeToggle resize con rAF coalesce.
    · PERF/RES: visibilitychange refresca badges al volver a la pestaña y, tras
      >5min oculta, re-fetch suave de places (recoge cambios de schedule/hours
      que el tick de 60s no detectaba).
    · RES: loadPlacesFromSupabase reintento×3 con backoff (300/900/2700ms); si
      todo falla y no hay locales, toast al usuario. openPlaceFromUrl avisa
      "No encontramos ese local" si ?place= no existe (antes silencioso).
    · A11Y: showToast → toast role=status aria-live=polite (antes SR mudo).
      copyText/sharePlace fallback execCommand('copy') vía <textarea> (HTTP /
      sin permiso). Contador de sección del menú: span sr-only aria-live anuncia
      "Sección X de Y: <nombre>" (antes solo el número). .sr-only util añadida.
    · UI/UX: heartPop one-shot vía clase .heart-pop en onclick (solo al AÑADIR
      favorito) — antes .favorited lo re-disparaba en cada re-render. menuCatNav
      observer determinista por posición (no por batch de entries) → chip activo
      ya no se desincroniza en scroll rápido ni salta secciones cortas. Skeleton
      shimmer (.review-skeleton) reemplaza "Cargando reseñas…" texto plano.
      Design tokens: --green + --pink-glow/--amber-glow/--green-glow definidos
      en ambos temas (MENU_SECTION_PALETTE ya no cae al fallback hardcoded).
    · Diferido (recomendación, no implementado por riesgo/decisión de diseño):
      review-star-input a <fieldset>+<input type=radio> nativo; IndexedDB como
      tier de cache (saveCachedPublishedPlaces hoy solo localStorage);
      srcset/sizes en card-img (requiere variantes en Supabase Storage);
      --accent #8b5cf6 como texto sobre --card oscuro = 3.92:1 (FAIL AA texto
      normal) — es color de marca, evaluar aclararlo a #a78bfa (5.6:1).
   [v2.0.29 — DESHABILITAR "Mis listas" + "Mis fotos" (UI) para enfocar en otras
    funcionalidades que atraerán usuarios; se reactivarán más adelante:
    · [mi-sabormap.html] Quitados del sidebar los botones "Mis listas" y
      "Mis fotos"; eliminados los paneles panel-listas y panel-fotos; quitados
      los cases 'listas'/'fotos' de switchPanel. loadAllData ya no carga
      currentCollections/currentPhotos ni asigna stats.listas/fotos (ahorra
      2 queries/RLS por carga). Las funciones de soporte (renderListas,
      renderFotos, listCardHTML, photoCardHTML, handleCreateList,
      handleRemoveListItem, handleDeletePhoto) quedan dormidas para reactivación.
    · [app.js] Quitada del drawer del local la sección "Tus colecciones" con
      los botones "Añadir a lista" y "Subir foto". openAddToList /
      triggerDrawerPhotoUpload / createCollection / addPlaceToCollection /
      uploadPlacePhoto / loadFoodieCollections quedan dormidos. Ningún onclick
      visible los invoca.
    · [SQL/RLS] Sin cambios: collections/list_items/place_photos y sus policies
      (incluido el EXISTS de ownership de v2.0.28) se mantienen intactas para
      cuando se reactiven las features.
   [v2.0.28 — CIERRE DE 6 PENDIENTES DEL AUDIT (seguridad + perf + a11y):
    · [index.html] CSP añadida (default-src 'self'; + unpkg.com para Leaflet
      JS/CSS inyectados por ensureLeaflet() + *.basemaps.cartocdn.com para los
      tiles CARTO). Cierra la única página sin Content-Security-Policy.
    · [foodies-app.js + cuenta.html] Flujo PKCE de reset de contraseña
      reparado: flowType 'pkce' + detectSessionInUrl:false dejaba el ?code=
      sin intercambiar → reset roto. Nuevos handlePkceRedirect()
      (exchangeCodeForSession) + cleanAuthUrl() (limpia ?code=/?error= de la
      URL y el historial), rama PASSWORD_RECOVERY en onAuthStateChange, vista
      resetView + handleFoodieResetPassword (updateUser password + signOut),
      redirectTo explícito en resetPasswordForEmail.
    · [mi-sabormap.html] Race forEach(async) en renderFavoritos/renderResenas/
      renderFotos cerrado con token de generación (_renderFavGen/
      _renderResenasGen/_renderFotosGen): un re-render o cambio de panel aborta
      las mutaciones stale en vuelo (no sobreescribe tarjetas nuevas con datos
      obsoletos tras un await fetchPlaceById).
    · [foodies-app.js] N+1 en loadFoodieStats eliminado: hasta 50
      fetchPlaceById en serie → Promise.all paralelo (la mayoría resuelve en
      cache staticPlaces/localStorage, sin red).
    · [mi-sabormap.html + app.js] Accesibilidad del modal de reseña: focus
      trap (Tab/Shift+Tab cicla dentro) + restore del foco al botón que abrió;
      estrellas focusables (tabindex+role=button+aria-pressed) con teclado
      (Enter/Espacio selecciona, flechas suben/bajan y mueven el foco).
      Aplicado al editReviewModal y al form inline #reviewStarInput.
    · [sql/lists_photos.sql] RLS ownership transitivo en list_items: INSERT y
      DELETE verifican con EXISTS que collection_id pertenezca al foodie
      (antes solo auth.uid()=foodie_id → se podía apuntar un item a colección
      ajena). Re-ejecutar el SQL en Supabase Dashboard (idempotente).
   [v2.0.27 — BUGFIX AUDIT SENIOR (seguridad + funcionalidad):
    · [app.js] XSS sistemático cerrado: cardHTML, openModal drawer (img/h2/
      neighborhood/mustOrder/editorNote/description/tags/hours/address/phone),
      renderMapMarkers popup, openMenuSubModal (category/name/desc/price/_id),
      renderCollections (c.title/desc/icon/color/bg/border/id), links
      (safeHref anti-javascript: + escape platform/cssClass/icon). Nuevos
      helpers safeHref() + reuso de escAttr/escapeHtmlLight.
    · [app.js] legalReturnPlace: orden invertido (nullear DESPUÉS de copiar) →
      feature U-11 restaurada (el drawer del local ya no desaparece al cerrar
      Términos/Privacidad).
    · [app.js] saveCachedPublishedPlaces: `minimal` hoisted fuera del try → el
      catch (purge+reintento tras QuotaExceededError) ya no lanza ReferenceError.
    · [app.js] openAddToList: race condition + leak de escHandler resueltos
      (token de aborto + handler de Esc único instalado una vez).
    · [app.js] Swiper huérfano: clearTimeout del timer si cierras el drawer
      antes de los 100ms. DOMContentLoaded: null-checks en setAttribute.
      toggleTheme: localStorage try/catch. triggerDrawerPhotoUpload: listener
      'cancel' limpia el input si el usuario aborta el picker.
    · [foodies-app.js] deletePlacePhoto: borra TAMBIÉN el archivo de Storage
      (antes la URL pública seguía resolviendo → fuga de privacidad). Helper
      _extractStoragePath. uploadPlacePhoto: cleanup de archivo huérfano si el
      INSERT DB falla tras subir. addPlaceToCollection: distingue duplicado real
      (error.code 23505) de error de constraint (antes falso éxito silencioso).
      uploadFoodieAvatar/removeFoodieAvatar: null-guard de foodieProfile.
      exportFoodieData: +collections +photos (exportación GDPR completa).
    · [mi-sabormap.html] loadAllData: cada carga aislada en try/catch (un fallo
      no aborta todo el panel). removeFav: id sin comillas → botón "Quitar
      favorito" muerto (UUID → SyntaxError). status: allowlist + escape en
      review-status/photo-status. Enter en input "Nueva lista" crea la lista.
      var(--card-2) indefinida → var(--card). handleDeletePhoto: confirm().
    · [HTML] referrer-policy meta en index/cuenta/mi-sabormap (evita leak de
      ?code= PKCE / params a CDNs). cuenta.html foodies-app.js?v=5 (drift fix).
    · [deploy] places.js copiado a download/ (estaba ausente → staticPlaces
      undefined → app rota).
    · DEFERIDO en v2.0.27, RESUELTO en v2.0.28 (ver bloque superior): CSP en
      index.html, flujo PKCE (exchangeCodeForSession + vista nueva contraseña),
      race forEach(async) en renders (token de generación), accesibilidad
      (focus trap modal reseña, estrellas con teclado), N+1 en loadFoodieStats,
      RLS ownership en list_items (SQL policy EXISTS).
   [v2.0.26 — MIS LISTAS + MIS FOTOS + RECOMENDADOS (3 features del panel):
    · SQL (download/sql/lists_photos.sql): tablas collections + list_items +
      place_photos + bucket Storage "place-photos" + RLS por foodie. Ejecutar
      en Supabase Dashboard → SQL Editor.
    · foodies-app.js?v=5: CRUD collections/list_items (load/create/rename/
      delete/addItem/removeItem) + CRUD place_photos (upload con resize+Storage,
      load, delete) + resizePlacePhotoFile.
    · mi-sabormap.html: sidebar "Mis listas" + "Mis fotos"; paneles panel-listas
      + panel-fotos; renderListas()/renderFotos() + handlers; sección
      "Recomendados para ti" en Inicio (renderRecomendados: top categorías de
      favoritos → places no guardados, deep-link ?place=). CSS listas/fotos.
    · app.js?v=20261117: drawer con "Añadir a lista" (modal JS) + "Subir foto"
      (input file efímero) + funciones loadFoodieCollections/createCollection/
      addPlaceToCollection/uploadPlacePhoto (copia home, misma arquitectura que
      favoritos). CSS inyectado en <head>.
    · Requiere bump de VERSION para re-precachear todo y servir versiones frescas.
   [v2.0.25 — Deep-link ?place=<id> en "Ver en mapa" de Favoritos:
    · [mi-sabormap.html] favCardHTML + hydrate de renderFavoritos: el botón
      "Ver en mapa" ahora apunta a ./?place=${encodeURIComponent(place_id)}
      (antes era href="./" o un hash ./#place-<id> que la home no procesaba →
      el local nunca se abría, el usuario perdía el contexto).
    · [app.js?v=20261116] openPlaceFromUrl(): al cargar la home, lee ?place=,
      busca el local en staticPlaces y abre su drawer con openModal(id). Si
      no está (local de Supabase aún no cargado), awaita placesLoadPromise y
      reintenta. Limpia ?place= con history.replaceState (una recarga tras
      cerrar el modal no lo reabre de golpe).
    · Requiere bump de VERSION para re-precachear index.html + mi-sabormap.html
      y servir app.js?v=20261116 fresco.
   [v2.0.24 — Bump de VERSION para distribuir el FIX del bug prioritario
    "Añadir a favoritos no funciona" (index.html + app.js?v=20261115):
    · [PRIMARIO, CSS — index.html] .drawer-cat-banner::before (overlay
      absoluto inset:0) ahora lleva pointer-events:none. Sin esto se comía
      el clic del corazón del drawer (.drawer-fav-btn era estático, sin
      z-index) → el onclick nunca disparaba → "no hace nada, puramente
      estético, sin error en consola". ::after y .drawer-cat-orb ya lo
      tenían; ::before no.
    · [DEFENSIVO, CSS — app.js] .drawer-fav-btn ahora lleva position:relative;
      z-index:2 para quedar encima de los overlays absolutos del banner.
    · onAuthStateChange ahora maneja INITIAL_SESSION + TOKEN_REFRESHED
      (antes solo SIGNED_IN/SIGNED_OUT) → la sesión se detecta aunque
      getSession() devuelva null en el primer instante.
    · toggleFavorite usa upsert idempotente (ignoreDuplicates) en vez
      de insert plano → no choca con UNIQUE(foodie_id, place_id).
    · applyPendingFavorite consume sabormap_fav_pending tras login.
    · catch loguea code/message y recarga favoritos si quedó stale.
    · Este bump de VERSION cambia los bytes de sw.js → el navegador
      reinstala el SW → skipWaiting + clients.claim → se dispara
      controllerchange en los clientes ya abiertos → toast
      "Sabormap se ha actualizado" (app.js línea 2844; sin auto-reload
      para evitar bucles). Además re-precachea el index.html nuevo (con
      app.js?v=20261115) y evicta los caches v2.0.19 viejos, evitando
      que el fallback offline sirva el app.js con el bug.
    Hereda v2.0.19 (comensales: cuenta.html, mi-sabormap.html,
    foodies-app.js network-first).
   ═══════════════════════════════════════════════════════════════════
   [v2.0.19_OLD — Bump de VERSION para distribuir la v1.2 (comensales):
    · Nuevas páginas: cuenta.html + mi-sabormap.html → añadidas a PRECACHE
      para que carguen offline tras la primera visita.
    · foodies-app.js (lógica de auth/favoritos/reseñas/avatares de
      comensales) → añadido a la lista de network-first junto a
      places.js/app.js, para que SIEMPRE se sirva la versión fresca
      cuando hay red (mismo motivo que app.js: cambios en la lógica
      de auth no pueden servirse stale).
    · app.js bumpeado a v=20251115 (integra sbFoodies + botones
      "Entrar"/"Crear cuenta" en el header + avatar mini en el botón
      "Mi cuenta" si el comensal está logueado).
    · foodies-app.js con cache-buster ?v=3 (incluye uploadFoodieAvatar
      con resize client-side, removeFoodieAvatar, helpers de Storage).
    · cuenta.html y mi-sabormap.html rediseñados con el mismo sistema
      visual que la home (Space Grotesk + Playfair, tema oscuro/violeta,
      bg-blobs, noise overlay, topbar con blur, toggle de tema que
      respete localStorage 'sabormap-theme').
    Hereda v2.0.18 (botón Ubicación con gmaps_url sin lat/lng).
   ═══════════════════════════════════════════════════════════════════
   [v2.0.18_OLD — botón "Ubicación" de la home también aparece con
    gmaps_url (sin lat/lng); gmaps_url entra en cache público.]
   [v2.0.17_OLD — CUP también lleva etiqueta de moneda en la carta.]
   [v2.0.16_OLD — diferenciación de colores por moneda.]
   [v2.0.15_OLD — fix icono WhatsApp + .delivery-whatsapp verde.]
   [v2.0.14_OLD — sincronizar cache público tras op exitosa en cola.]
   [v2.0.13_OLD — fix rendering del badge "Agotado" en la carta.]
   [v2.0.12_OLD — fix animación contador 256 vs 257.]
   [v2.0.6_OLD  — places.js y app.js fuera del PRECACHE (network-first).]
   [v2.0.5_OLD  — network-first para HTML.]

   Estrategia:
   · Precache tolerante del shell local (allSettled) + CDNs + woff2.
     ★ v2.0.6:  places.js y app.js YA NO se precachean. Se cargan con
                network-first y se cachean solo en RUNTIME_CACHE.
     ★ v2.0.19: foodies-app.js también network-first (mismo motivo).
   · Navegación: network-first con fallback y página offline.
   · places.js / app.js / foodies-app.js / cuenta.html /
     mi-sabormap.html / index.html → network-first (siempre frescos).
   · Otros recursos propios y CDNs: stale-while-revalidate.
   · API de Supabase y terceros desconocidos: PASSTHROUGH.
   · Leaflet: carga bajo demanda [U-01/P-03].
   Para publicar una versión nueva: sube el valor de VERSION.
   ═══════════════════════════════════════════════════════════════════ */

const VERSION = 'v2.0.30'; // ↑ súbelo en cada despliegue — v2.0.30: AUDIT SENIOR FRONTEND. PERF: getFilteredPlaces memo (queueMicrotask); badge refresh in-place preserva .pulse + Map O(n+m) + short-circuit; card img +decoding/width/height; resize rAF. RES: visibilitychange refresh badges + re-fetch places tras >5min oculta (hours staleness); loadPlaces retry×3 backoff; openPlaceFromUrl toast not-found. A11Y: toast role=status aria-live; copyText fallback execCommand; menú section announce sr-only; .sr-only util. UI/UX: heartPop one-shot click-gated; menuCatNav observer determinista por posición; skeleton shimmer reseñas; tokens --green+glows definidos. Diferido: star-input radio, IndexedDB cache, srcset, accent-on-dark-card contraste. v2.0.29: deshabilitar UI Mis listas/fotos. v2.0.28: cierre 6 audit (CSP/PKCE/race/N+1/a11y/RLS)
const STATIC_CACHE = `sabormap-static-${VERSION}`;
const RUNTIME_CACHE = `sabormap-runtime-${VERSION}`;

const PRECACHE_URLS = [
    // Shell local (sin places.js ni app.js ni foodies-app.js — se cargan con network-first)
    './',
    './index.html',
    // ★ v2.0.19: nuevas páginas de comensales → precache para que carguen offline
    './cuenta.html',
    './mi-sabormap.html',
    './manifest.json',
    // Iconos — las 4 variantes declaradas en manifest.json
    './icon-192x192.png',
    './icon-512x512.png',
    './icon-192x192-maskable.png',
    './icon-512x512-maskable.png',
    // CDNs críticos del primer render — URLs EXACTAS de index.html [T-10]
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
        // Borra también 'sabormap-v4', 'sabormap-static-v1.0.0' y versiones previas de v2.0.x
        await Promise.all(
            keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k))
        );
        await self.clients.claim();
        // ★ v2.0.13: avisar a los clientes que hay nueva versión para que
        // recarguen y obtengan el app.js + foodies-app.js nuevos.
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        clients.forEach(c => c.postMessage({ type: 'sw-updated', version: VERSION }));
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
    //    Esto incluye TAMBIÉN al proyecto foodies (avatares, reseñas, etc.)
    //    — las APIs de Supabase nunca se cachean, sin importar el host.
    if (url.hostname.includes('supabase.co')) return;

    // 3) Recursos propios (imágenes de locales, avatares, etc.)
    if (url.origin === self.location.origin) {
        // ★ FIX [v2.0.4]: places.js/app.js/dashboard.html siempre frescos cuando hay red.
        //   Antes eran stale-while-revalidate y servían la versión cacheada.
        //   Firefox es más conservador que Chrome con el SWR y no refrescaba,
        //   por lo que los fixes de iconos y menú nunca llegaban al usuario.
        // ★ v2.0.19: añadimos foodies-app.js al mismo grupo (misma razón:
        //   cambios en la lógica de auth/favoritos/reseñas no pueden servirse stale).
        // ★ v2.0.19: añadimos cuenta.html y mi-sabormap.html para que los
        //   cambios de UI (botones, formularios, etc.) siempre lleguen frescos.
        if (url.pathname.endsWith('/places.js') ||
            url.pathname.endsWith('/app.js') ||
            url.pathname.endsWith('/foodies-app.js') ||
            url.pathname.endsWith('/cuenta.html') ||
            url.pathname.endsWith('/mi-sabormap.html') ||
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
        //   Para navegación (index.html, cuenta.html, mi-sabormap.html) sí
        //   permitimos fallback al precache del shell, porque esas páginas
        //   HTML cambian poco respecto al shell base.
        const cached = await cache.match(req);
        if (cached) return cached;
        // Solo para navegación (no para JS): fallback al shell precacheado
        if (req.mode === 'navigate') {
            // Si la navegación es a cuenta.html o mi-sabormap.html, intentar
            // servir la versión precacheada de esas páginas específicas.
            const url = new URL(req.url);
            const pathEnds = url.pathname.endsWith('/cuenta.html') ? './cuenta.html'
                          : url.pathname.endsWith('/mi-sabormap.html') ? './mi-sabormap.html'
                          : null;
            if (pathEnds) {
                const specific = await caches.match(pathEnds);
                if (specific) return specific;
            }
            // Fallback genérico al index.html precacheado
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
