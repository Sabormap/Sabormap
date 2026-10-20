# Registro de cambios — Sabormap (paquete corregido v1.4)

Cada entrada referencia el **ID del hallazgo** en el *Informe de Auditoría Integral de Sabormap* (C = crítico, M = medio, B = leve). Los hallazgos que requieren intervención humana están en `PENDIENTES.md`.

---

## 1. `places.js` — datos de locales (258 registros)

### Bugs de datos

| ID | Corrección | Detalle |
|---|---|---|
| **T-01** (C) | `category: "restaurant"` → `"restaurante"` | 34 locales (ids 206–257) eran invisibles al filtrar por "Restaurantes" y salían con badge de "Bar". Ahora: 161 restaurantes, 88 bares, 9 heladerías. Además `app.js` añade un mapeo defensivo (`CATEGORY_ALIAS`) para que un typo futuro no vuelva a romper los filtros |
| **T-02** (C) | `"12:00am-00:00pm"` → `"12:00pm-00:00am"` | Ids 10 (Parranda Grill Bar), 11 (Sensaciones), 13 (El Jardín). El valor original parseaba como *abierto 24 h*. El nuevo significa mediodía→medianoche (franja de 12 h, verificada). El parser de `app.js` además ahora descarta franjas con `open === close` |
| **T-14** (B) | Cabecera reescrita | Declaraba "203 locales"; ahora declara **258** con el desglose por categoría y la lista de normalizaciones aplicadas |
| **C-08** (M) | Descripción corregida (id 172) | "San Lázaro 113" se describía como *"tu lugar favorito del Vedado"* pero su dirección y barrio son Centro Habana → "favorito del Centro Habana" |

### Horarios (C-06)

| ID | Corrección | Detalle |
|---|---|---|
| C-06 (M) | Sufijos 24 h corregidos | 135 locales con mezcla 12 h/24 h (`23:00pm`, `22:00am`, `17:00am`…) normalizados a 12 h correcto (`11:00pm`, `10:00pm`, `5:00pm`) |
| C-06 (M) | `"24 horas"` → franja explícita | 7 locales: `Lun-Dom: 12:00am-11:59pm` (antes el parser no entendía nada y dependía del flag `isOpen`) |
| C-06 (B) | Erratas de días y formato | `LLun-Dom`→`Lun-Dom`, `Ju-Dom`→`Jue-Dom`, `Sab`→`Sáb`, `Mie`→`Mié`, prefijos duplicados (`Lun-Dom Lun-Dom:`), separador ` - ` entre franjas → `, `, dos puntos faltantes (`Vie-Sab 11:00…`), espacios finales |
| C-06 (M) | Caso semántico "menos los martes" | Id 162: `Lun-Dom: 12:00pm-00:00am menos los martes` → `Lun: 12:00pm-00:00am, Mié-Dom: 12:00pm-00:00am` (antes el texto suelto lo ignoraba el parser; ahora cierra los martes de verdad) |

### Contenido

| ID | Corrección | Detalle |
|---|---|---|
| **C-03** (M) | Tags placeholder eliminados | 112 locales con `Descubrelo`/`Descrubelo.` (64 con errata) → tag informativo real `Restaurante · Playa`, `Bar · Vedado`, etc. (categoría + barrio verdaderos). **v1.1:** reejecutando la auditoría se detectó que la pasada v1.0 solo sustituyó la grafía correcta (48) y dejó la tanda con errata `Descrubelo` (64) sin tocar — la métrica de validación original solo miraba la coincidencia exacta. Completado: **0 pendientes**. Documentado en PENDIENTES su sustitución futura por especialidades |
| **C-11** (B) | Emojis fuera de los datos | 186 direcciones, 248 horarios, 35 tags y 6 nombres limpiados (📍🗺️⏰️🍕…). Razón práctica: el botón "copiar dirección" copiaba emojis; los lectores de pantalla los deletrean |
| **A-08** (B) | Unicode matemático → ASCII | Id 174: `𝗖𝗮𝗹𝗹𝗲 𝗖𝘂𝗯𝗮 𝟲𝟬.` → `Calle Cuba 60.` (transliteración del bloque U+1D400–1D7FF) |
| **S-10** (B) | Nombres sin emojis | Ids 27, 39, 56, 62, 228, 243 — contaminaban `<title>` del drawer, JSON-LD y previews en redes. Ahora el JSON-LD hereda nombres limpios |
| **C-07** (M) | Errata de nombre | Id 56: `Restuarante Perla Negra` → `Restaurante Perla Negra`. (Las erratas en *nombres de archivo de imagen* NO se tocaron para no romper las rutas: ver PENDIENTES) |
| **C-09** (B) | Voseo → tuteo | Id 1: *"Si encontras la puerta"* → *"Si encuentras…"*; id 3: *"Volve en verano"* → *"Vuelve en verano"*. Criterio: tuteo neutro cubano. Nota: la auditoría marcaba 9 coincidencias, pero 7 eran falsos positivos del patrón (infinitivos "volver/probar/descubrir" y "has probado", correctos) |
| **C-10** (B) | Tildes restauradas | `caña` (4), `religión` (1), `íntimo` en la nota clonada (119), categorías de menú `Helados clasicos`→`Helados clásicos` y `Cocteles`→`Cócteles` (11 locales). **v1.1:** `ron anejo`→`añejo` (594 ocurrencias en cartas clonadas), etiquetas de `catMeta` en app.js (`Bar / Cafeteria`→Cafetería, `Heladeria`→Heladería) y patrón del auditor `cana` con límite de palabra (marcaba "Mexi**cana**") |
| — | Imágenes saneadas | 1 array con imagen duplicada deduplicado (id 7); 853 cadenas vacías eliminadas de los arrays `images` (el código ya las filtraba en runtime, pero contaminaban el dato) |

**Se dejó intacto a propósito:** `phone` (91 vacíos), `links` (256 con raíz de marketplace), `lat/lng` (17 discrepancias), `menu` (4 plantillas clonadas), `images` (nombres de archivo con espacios/emojis/erratas: renombrarlos exige renombrar los ficheros en el servidor). Todo está listado en `PENDIENTES.md`.

---

## 2. `app.js` — lógica de la aplicación

### Bugs funcionales

| ID | Corrección | Detalle |
|---|---|---|
| **T-03** (C) | `populateBarrios()` sin duplicados | Añadía opciones en cada llamada (al recargar desde Supabase el select duplicaba). Ahora añade solo los que faltan (`Set` de existentes) y **conserva la selección** del usuario |
| **T-01** (C) | Normalización defensiva | `CATEGORY_ALIAS` + `normCat()` se aplica a `staticPlaces` al cargar y a cada local de Supabase (`mapDbPlaceToPublic`). Categoría desconocida → aviso en consola una sola vez + fallback |
| **P-01/U-06** (C/M) | Refresco de 60 s sin re-render | El `setInterval` reconstruía las 258 tarjetas cada minuto (parpadeo, scroll perdido, foco perdido). Ahora actualiza **solo los badges Abierto/Cerrado** con la misma estrategia que ya usaba el drawer |
| **P-09** (B) | Respeto por pestañas ocultas | El refresco se omite si `document.hidden` |
| **T-11** (B) | `toggleTheme` actualiza TODAS las metas | Había dos `<meta name="theme-color">` (una por esquema) y solo se actualizaba la primera → `querySelectorAll` |
| **U-11** (B) | El modal legal ya no destruye el drawer | Guarda el local abierto (`legalReturnPlace`) y lo restaura al cerrar el legal |
| — | Guardia de Swiper | Si el CDN de Swiper no carga, el drawer con imágenes ya no lanza una excepción |

### Accesibilidad

| ID | Corrección | Detalle |
|---|---|---|
| **A-01** (C) | Colecciones por teclado | `role="button"`, `tabindex="0"`, `aria-pressed` sincronizado, Enter y Espacio activan, `aria-label` descriptivo |
| **A-02** (C) | Drawer = diálogo modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` (el `<h2>` del título lleva `id="drawerPlaceName"`), foco inicial en el botón cerrar, **trampa de Tab** dentro del drawer y **devolución del foco** al abrir/cerrar |
| **A-03** (C) | Menú móvil/overlay fuera del árbol a11y | `aria-hidden` + `inert` gestionados en abrir/cerrar + `visibility: hidden` en CSS (estado inicial ya aplicado en DOMContentLoaded) |
| **A-04** (M) | Tarjetas con Espacio | `onkeydown` acepta Enter **y barra espaciadora** (con `preventDefault` para no hacer scroll) |
| **A-09** (B) | "Copiar dirección" es un `<button>` | Antes un `div onclick` inaccesible; además el texto viaja ahora en `data-address` escapado (`escAttr`) en lugar de interpolarse en el atributo `onclick` (vector de inyección) |
| **A-11** (B) | Iconos decorativos silenciados | `aria-hidden="true"` en los `<i>` de plantillas (tarjeta, drawer) — deja de leerse "símbolo, pin de mapa…" antes de cada dato |

### Rendimiento y UX

| ID | Corrección | Detalle |
|---|---|---|
| **P-02/U-10** (M/B) | Grilla paginada | `cardHTML()` extraído + render por lotes de 60 tarjetas con `IntersectionObserver` (sentinel con margen de 600 px). El contador sigue mostrando el total filtrado; fallback sin IO renderiza todo |
| **P-03/U-01** (M/C) | Leaflet bajo demanda | `ensureLeaflet()` inyecta CSS+JS (con SRI) solo al activar la vista mapa; si falla, toast informativo. La vista grilla deja de descargar ~200 KB de un feature oculto |
| **U-04** (M) | Buscador indexa las cartas | Índice por local memoizado (`WeakMap`): nombre + barrio + categoría + tags + descripción + `mustOrder` + **categorías y platos del menú**. Buscar "risotto" pasa de 0 a resultados reales |
| **T-09** (M, parcial) | Se respeta el `gmapsUrl` propio | El botón "Ubicación" del drawer generaba la URL siempre; ahora prefiere el dato del local (22 locales lo tienen) |
| **C-09/C-10** (B) | Textos de UI unificados | *"Lo que tenes que pedir"*→tienes; `Informacion practica`→Información práctica; `Direccion`→Dirección (etiqueta + toast); `Telefono`→Teléfono; *"estara disponible proximamente"*→estará/ próximamente (×2); `Terminos de Uso`→Términos; `Politica de Privacidad`→Política; *"informacion… unicamente… navegacion"*→con tildes; *"Conexion/Sin conexion"*→Conexión; *"Menus para todos"*→Menús |

### PWA

| ID | Corrección | Detalle |
|---|---|---|
| **W-02** (M) | Sin recarga automática | `controllerchange` ya no llama `window.location.reload()` (riesgo de bucle infinito); muestra toast "Sabormap se ha actualizado" |

---

## 3. `sabormap.html` — página principal

### SEO y datos estructurados

| ID | Corrección | Detalle |
|---|---|---|
| **S-01** (C) | JSON-LD regenerado en runtime | Los ~3.480 líneas de ItemList incrustado (126 items, coordenadas divergentes) se sustituyeron por un generador que construye el ItemList desde `staticPlaces`: **numberOfItems 258**, geo real, direcciones limpias, `@type` por categoría (`BarOrPub`/`Restaurant`/`IceCreamShop`). Nunca vuelve a desincronizarse |
| **S-02** (M) | `aggregateRating` eliminado | Eran rich snippets inválidos (sin `ratingCount`; ratings editoriales). Google puede penalizarlos |
| **S-03** (M) | `og:image`/`twitter:image` | De `https://sabormap.hab/…` (dominio probablemente inexistente) a `https://sabormap.com/og-sabormap.png` con TODO de confirmación |
| **S-04** (M) | Tildes en metadatos | Title, description, og:title, og:description, twitter:title: "Gastronomico"→Gastronómico, "heladerias"→heladerías, "gastronomica"→gastronómica |
| **S-06** (M) | Páginas privadas sin promoción | Enlaces a `dashboard.html` (×3) y `plan.html` con `rel="nofollow"` (pendiente su `noindex` propio — ver PENDIENTES) |
| **S-07** (B) | `<meta keywords>` eliminada | Señal obsoleta que solo filtraba la estrategia |
| **S-08** (B) | Encabezados completos | H1 "dónde comer" con tilde; `#directorios` con `<h2 class="sr-only">Directorio de locales</h2>` |
| **T-06** (M) | Dominio unificado | Canonical/og:url ya eran `.com`; los enlaces absolutos restantes quedan en `.com` con comentario `TODO (T-06)`; email de contacto a `hola@sabormap.com` |
| **T-07** (M) | Una sola ruta de publicación | `/publicar` (header) y `publicar.html` (drawer) unificados a **`publicar.html`**, que es el fichero real |

### Errores técnicos

| ID | Corrección | Detalle |
|---|---|---|
| **T-04** (M) | Cierre duplicado eliminado | El documento terminaba en `</body></html>\n\n</body></html>` |
| **T-08** (M) | Supabase deja de bloquear el render | Movido del `<head>` (síncrono) al final del `<body>`, antes de `places.js`/`app.js` para mantener el orden de ejecución |
| **T-10** (B) | CDNs fijados y con SRI | `@supabase/supabase-js@2`→`@2.49.4`, `swiper@11`→`@11.1.5` (JS y CSS), Font Awesome 6.5.0 — todos con `integrity="sha384-…"` calculada y `crossorigin`. Leaflet conserva su SRI original (y ahora carga bajo demanda) |
| **T-12** (B) | Código muerto eliminado | El bloque `if (container.querySelector(…)) return;` vacío del script inline desapareció con el bloque entero |
| **T-13** (B) | MutationObserver eliminado | Observaba todo el `<body>` para re-marcar enlaces de delivery que `app.js` ya no renderiza jamás (los placeholders ni siquiera llegan al DOM). Menos trabajo en cada mutación del drawer |

### Accesibilidad y CSS

| ID | Corrección | Detalle |
|---|---|---|
| **A-05** (M) | Contraste AA en tema claro | `.open-badge.open` → `#047857` (era `#10b981`, 2.3:1); `.open-badge.closed` → `#b91c1c`; `--amber` → `#92400e` en claro |
| **A-10** (B) | Skip link | "Saltar al contenido" → `#directorios`, visible al recibir foco |
| **A-12** (B) | Foco visible global | `:focus-visible { outline: 2px solid var(--accent) }` — el buscador y los selects tenían `outline:none` con una sombra sutil |
| **A-13** (B) | Etiquetas mejoradas | Hamburguesa: `aria-label="Abrir menú"` + `aria-expanded` + `aria-controls` |
| **A-07** (M) | Marquee decorativo | La segunda copia de los 6 términos (solo existe para el bucle infinito) va envuelta en `aria-hidden="true"` con `display:contents` |
| **A-03** (C) | CSS de visibilidad | `.mobile-menu`, `.modal-overlay`, `.modal-drawer` con `visibility:hidden` ↔ `.open` (complementa el `inert` de JS) |
| **A-06** (M) | Banner PWA inerte | `inert` + `aria-hidden` iniciales, gestionados al mostrar/cerrar |
| **P-06** (M, parcial) | Movimiento reducido | `@media (prefers-reduced-motion: reduce)` desactiva blobs, marquee y transiciones (WCAG 2.3.3). La optimización GPU de los blur queda para roadmap |

### Rendimiento

| ID | Corrección | Detalle |
|---|---|---|
| **P-03** (M) | Leaflet fuera del head | `<link leaflet.css>` eliminado; se inyecta al usar el mapa |
| **P-04** (M) | Fuentes de 9 pesos a 6 | Space Grotesk 400;500;600;700 + Playfair 700;900 (se eliminaron SG 300, Playfair 400 y la cursiva, sin uso) |
| **P-07** (B) | Preconnects | `fonts.gstatic.com` (crossorigin), `cdn.jsdelivr.net`, `cdnjs.cloudflare.com` |

### Contenido y UX

| ID | Corrección | Detalle |
|---|---|---|
| **C-09/C-10** (B) | Tuteo y tildes visibles | Hero: "dónde comer"; footer: "Descubre… heladerías"; "Prueba con otro nombre" (antes "Proba"); filtros/footer: "Bares / Cafeterías", "Heladerías", "Información", "Navegación", "Términos"; marquee: "Ron añejo" (×2) |
| **U-03** (M) | Logo clicable | Envuelto en `<a href="./">` con `aria-label` |
| **U-05** (M) | Acciones reales, no `href="#"` | Legal (×4) y WhatsApp flotante convertidos a `<button>` (con reset `linklike`); "Buscar" del menú móvil apunta al ancla real `#directorios` |
| **U-07** (B) | Conversión coherente | "Añade tu Local" del footer → `publicar.html` (misma ruta que el CTA del header); el WhatsApp flotante queda para contacto directo |
| **U-08** (B) | "15 resultados" hardcodeado | → "Cargando catálogo…" (lo sobrescribe `renderPlaces` con el número real) |
| **U-02/W-07** (M/B) | Banner de instalación reescrito | iPadOS 13+ detectado por `maxTouchPoints` (antes se veía como Mac sin instrucciones); clic sin prompt nativo → toast con instrucciones (antes: silencio); el cierre se recuerda 7 días (antes: para siempre); `inert/aria-hidden` gestionados |
| **S-09** (B, parcial) | Iconos | El `apple-touch-icon` se mantiene apuntando al fichero existente (192); crear el de 180×180 exige el PNG nuevo — PENDIENTES |

---

## 4. `manifest.json` — PWA

| ID | Corrección | Detalle |
|---|---|---|
| **W-01** (M) | Identidad estable | `id: "./?source=pwa"` añadido; `start_url: "./?source=pwa"` y `scope: "./"` relativos — la app ya no se duplica si algún día se sirve en una subruta |
| **W-03** (M) | Iconos completos | Declarados 192 y **512** (exigido por Chrome para instalar) **más las 2 variantes maskable dedicadas** que aporta tu propio manifest (`icon-192x192-maskable.png` / `icon-512x512-maskable.png`), todas con rutas relativas coherentes con el `scope`. ⚠️ Los 4 PNG deben existir en la raíz (README §3); si aún no tienes las variantes maskable, duplica las entradas con `purpose: "any"` mientras tanto |
| **W-04** (B) | Shortcuts conservados | Los dos accesos rápidos se mantienen, ahora con URLs relativas (`./#directorios`, `./#colecciones`) coherentes con el `scope` |
| **W-06** (B) | Orientación libre | `portrait-primary` → `any` (tablets/escritorio no quedan forzados) |
| **W-05** (B, documentado) | `theme_color` único | El manifest solo admite un color; se mantiene el violeta del tema oscuro (el tema por defecto). Limitación conocida de la plataforma, no hay media queries en manifests |

## 5. `sw.js` — service worker v2.0.0 (fusión con el código aportado)

| ID | Corrección | Detalle |
|---|---|---|
| **W-02** (M) | Service worker real | Antes `app.js` registraba `./sw.js` que no existía (error 404 silencioso en cada visita). SW con: precache tolerante del shell (`Promise.allSettled`), **network-first** para navegaciones con cadena de fallback y página offline, **stale-while-revalidate** para CDNs/tiles/imágenes, limpieza de cachés por `VERSION`, y `skipWaiting`/`clients.claim` sin recarga forzada |
| **v2.0.0** | Fusión con tu SW aportado | La versión v4 que enviaste aportaba 3 ideas mejores que v1.0.0 del paquete y destapó 2 defectos del mismo; se fusionaron ambas líneas. Detalle de la revisión en la sección 6 |

## 6. Revisión del código PWA aportado (fuera del alcance de los 78 hallazgos)

Al recibir tu `sw.js` (v4), el snippet de registro y el `manifest.json`, se revisaron con los mismos criterios de la auditoría. Resultado de la fusión:

| ID | Origen | Revisión aplicada |
|---|---|---|
| **R-01** | Tu SW v4 ✅ | **Caché solo de hosts permitidos** — adoptada: v1.0.0 hacía SWR a *cualquier* origen cruzado, incluida la API de Supabase (riesgo de servir datos stale y respuestas de auth desde caché). Ahora Supabase pasa de largo y `app.js` cae a `staticPlaces` sin conexión, como ya estaba diseñado |
| **R-02** | Tu SW v4 ✅ | **Aceptar respuestas opacas** (`type 'opaque'`) en la allowlist — adoptada: v1.0.0 solo cacheaba `status 200`, así que las fuentes woff2 y los tiles (peticiones no-cors, `status 0`) jamás entraban en caché y el offline las perdía |
| **R-03** | Tu SW v4 ✅ | **Página offline 503 para navegaciones** — adoptada, ahora en UTF-8 con acentos y estilos del tema |
| **R-04** | Auditoría ⚠️ | **Tu allowlist era demasiado laxa**: `url.hostname.includes(h)` con `'cloudflare.com'` en la lista matcheaba cualquier dominio que lo contenga (p. ej. `notcloudflare.com`). Ahora es igualdad exacta o subdominio del host listado. Se añadieron `fonts.gstatic.com` y `basemaps.cartocdn.com` (los tiles reales del mapa, CARTO) |
| **R-05** | Auditoría ⚠️ | **Tu v4 precacheaba Leaflet (~200 KB)** en `install`, lo que contradice el lazy-load de U-01/P-03 (los usuarios que nunca abren el mapa pagaban la descarga). Ahora Leaflet queda en runtime: se cachea la primera vez que se abre el mapa |
| **R-06** | Auditoría ⚠️ | Tu página offline y los textos `Conexion restablecida` / `Sin conexion` sin acentos: corregidos en el SW y ya presentes en `app.js` (los avisos online/offline con tildes van integrados al final de `app.js`, no hace falta pegar el snippet en el HTML) |
| **R-07** | Nuevo en v2.0.0 | **Precache de los woff2 de Google Fonts**: se lee el CSS de fuentes en install y se cachean los `.woff2` que lista (best-effort). Sin esto, la primera sesión offline mostraba tipografías de sistema en ambas versiones (la tuya tampoco los cacheaba en install) |
| — | Tu snippet de registro | **No se pega en el HTML**: el registro ya vive al final de `app.js` con mejoras sobre tu snippet — sin `controllerchange → reload()` (tu versión recargaba la página también en la primera visita, cuando el SW toma el control por `clients.claim()`); avisa con toast "Sabormap se ha actualizado", y los avisos online/offline llevan guardia implícita porque `showToast` es función del mismo archivo |
| — | Tu manifest | Integrado: nombres/descripciones de tus shortcuts (con tildes restauradas) y `prefer_related_applications: false`; los 4 iconos dedicados (any + maskable) ahora con rutas **relativas** — los absolutos `/icon-…` rompen en subcarpetas |

---

## 7. Páginas secundarias aportadas (v1.2) — informacion · publicar · reservas · panel

Recibidas las 4 páginas que no venían en los fuentes originales, revisadas con los mismos criterios. **18 hallazgos nuevos** (continúan la numeración del informe):

| ID | Página | Corrección |
|---|---|---|
| **T-15** (M) | panel + home | El fichero se llamaba **`dahsboard.html`** (errata) y la home enlazaba `dashboard.html` ×3 → **3 enlaces rotos 404**. Renombrado a `dashboard.html`; además el footer de la home aún enlazaba `plan.html` (no existe) → `publicar.html#planes` sin `nofollow` (es la landing pública) |
| **T-16** (M) | publicar | El smooth-scroll no filtraba `href="#"` → `document.querySelector('#')` lanzaba excepción al clicar enlaces muertos (los legales del footer lo eran). Guardia añadida + enlaces legales ahora apuntan a `informacion.html#terminos/#privacidad` |
| **T-17** (M) | reservas + panel | `@supabase/supabase-js@2` sin fijar y sin SRI (la auditoría ya lo había corregido en la home) → `@2.49.4` + la misma `integrity` |
| **T-18** (M) | home + informacion + publicar | Enlaces absolutos a páginas que sí existen como fichero: `https://sabormap.com/informacion` (×2 en la home) y footer de informacion → **relativos** (funcionan en cualquier dominio/subruta). WhatsApp flotante con `href="#"` → `https://wa.me/5356578961` real (funciona sin JS) |
| **S-12** (M) | las 4 | Sin canonical/OG/description/favicon → añadidos (canonical con `TODO (T-06)`). **El panel ahora lleva `<meta name="robots" content="noindex, nofollow">`** — cierra PENDIENTES 3.3 |
| **S-13** (B) | reservas | Página **huérfana**: 0 enlaces internos la apuntan. Documentado (decisión de diseño: añadir CTA «Reservar» en el drawer del directorio — roadmap) |
| **A-14** (C) | panel | Los 13 enlaces de la sidebar y los switches login/registro eran `<a onclick>` **sin href ni tabindex → inalcanzables por teclado**. `role="button" tabindex="0"` + script delegado de Enter/Espacio |
| **A-15** (M) | reservas | Modal de reserva sin semántica de diálogo → `role="dialog" aria-modal aria-labelledby`, labels asociados con `for`, `aria-live` en el contador, **trampa de foco + Escape + devolución de foco** vía script que observa la clase `.open` (sin tocar `reservas.js`) |
| **A-16** (M) | publicar | El slider antes/después era **solo ratón/táctil** → `role="slider"` + flechas ←/→ con `aria-valuenow` sincronizado |
| **A-17** (M) | informacion + publicar | 131 iconos decorativos (iconify) sin `aria-hidden` (los lectores los anunciaban) + enlaces `_blank` sin `rel="noopener"` + burger del menú móvil sin `aria-expanded`/`aria-label` |
| **A-18** (B) | reservas | Skip link «Saltar al directorio» + `aria-expanded` del burger en publicar + cierre con Escape |
| **C-13** (C) | panel | **50+ textos con voseo y sin tildes/ñ**: «Contraseña», «Iniciar sesión», «Estadísticas», «suscripción», «Galería», «Mínimo», «No tienes cuenta», «hazle seguimiento», «Repite tu contraseña», «Olvidé», «menús», «Administración»… corregidos (tuteo neutro cubano, mismo criterio C-09/C-10) |
| **C-14** (M) | reservas | «Teléfono», «heladerías», «categorías», «Cafetería», «gastronómico», «Número», «Tu mesa está reservada», «teléfono válido» — con tildes (11 correcciones) |
| **C-15** (M) | publicar | Los testimonios 1 y 2 mostraban un **`">` literal en pantalla** (HTML roto). Además la tarjeta Básico decía «Gratis» pero el botón enviaba por WhatsApp «3,500 CUP/mes» → mensaje alineado con la tarjeta + `TODO` para confirmar el precio real. Fecha del texto legal marcada con `TODO` (dice 24/10/2024) |
| **C-16** (B) | panel | El logo del panel era una **«G»** (de otro proyecto) → «S»; título unificado a «Sabormap — Panel de Locales» |
| **C-17** (B) | las 3 | «© 2025» → «© 2026» (informacion/publicar/reservas) |
| **P-11** (M, parcial) | reservas + panel | Fuentes de 9 a 6/5 pesos (sin usos de 300 ni cursivas) + preconnects. **El `cdn.tailwindcss.com` (Play CDN, ~300 KB JS de desarrollo + aviso en consola) se documenta en PENDIENTES**: sustituirlo exige build de Tailwind, no es un parche seguro |
| **P-12** (B) | informacion + publicar | `prefers-reduced-motion` respetado (animaciones de entrada, marquee de WhatsApp, pulso del badge) y `<noscript>` para que `.sr` no deje la landing invisible sin JS |

---

## 8. Últimas páginas aportadas (v1.3) — imperium · nosotros · retiro de reservas

El dueño aportó los 2 últimos ficheros del programa (`imperium.html`, 738 líneas y `nosotros.html`, 983 líneas) y decidió **retirar `reservas.html` y su `reserva.js`** del proyecto. Los IDs nuevos siguen la convención del informe.

| ID | Página | Corrección |
|---|---|---|
| **C-18** (C) | imperium | **~120 tildes y signos «¿?!»** restaurados en textos visibles y en los mensajes que le llegarán por WhatsApp: nav «Diseño», «Básico», «Página(s)», «Pago único» (8 precios y eyebrows), «Imágenes estáticas», «¿Qué incluye?», «Tipografía», «jerarquías y tamaños», «señalética», «Filosofía/Misión/visión», «Representación», «Cotización» (botones + `wspPlan`), «menús físicos», «cócteles», «enseña», «autenticación», «Documentación técnica», las 5 preguntas del FAQ, «¿Por qué el combo?», «Botón Visita su Web», «También… días», «Métodos», «Transfermóvil», «Escríbenos», y los textos `wsp()`/`wspPlan()` («¡Hola Sabormap! … (escribir aquí)… ¿Qué servicio te interesa? / ¿Me ayudan…?»). Bandera 🇨🇺 del footer retirada (en Windows/Chrome se renderiza «CU») |
| **C-19** (C) | nosotros | **Voseo rioplatense → tuteo** (~29 casos, mismo criterio C-09/C-10/C-13): «Escríbenos», «envía», «Cuéntanos», «No necesitas», «Elige tu plan», «puedes combinarlo», «Eliges», «Envíanos los materiales», «Nos envías», «Realiza el pago», «Efectúas», «empieza con Básico», «Escribes… Si tienes», «Sabes exactamente qué pagas», «Si quieres venir», «Paga como te resulte más fácil», «Haces la transferencia», «Puedes pagarnos», «si prefieres… si tienes acceso», «Puedes cancelar», «Pagas una vez», «Visítanos», «vos mismo → tú mismo», «La Víbora» con tilde |
| **C-20** (M) | nosotros | El paso 2 de la guía PWA decía «Abre **sabormap.hab**» → «sabormap.com» con `TODO (T-06)` (el dominio canónico asumido en todo el paquete) |
| **T-19** (B) | ambas | «© 2025» → «© 2026» (patrón C-17). El nav de nosotros mostraba «Sabormap ×» **sin la palabra Imperium** (span perdido al copiar) → restaurado; el separador «x» de imperium unificado a «×» |
| **T-20** (M) | ambas | Enlaces absolutos `https://sabormap.com/...` → **relativos** (`sabormap.html`, `publicar.html`, `nosotros.html`, `imperium.html`) — patrón T-18; el logo de nosotros enlazaba a `#` → a la home (U-03); el teléfono del footer pasa a `wa.me/5356578961` real con `target="_blank" rel="noopener"` (funciona sin JS) — también el botón flotante y el icono social de WhatsApp, conservando el mensaje pre-rellenado vía `onclick` |
| **U-12** (M) | imperium | El handler de scroll suave **lanzaba `SyntaxError` con los `href="#"`** (`document.querySelector('#')`) — mismo patrón que T-16 en publicar — → guard `if (h.length < 2) return;`. Además los iconos sociales `#` del footer apuntan a las URLs reales de Instagram/Facebook (las mismas que ya usa nosotros) |
| **U-13** (M) | nosotros | «Términos y condiciones» y «Privacidad» apuntaban a `javascript:void(0)` con un comentario «hasta que tengas las páginas legales» → ahora apuntan a la página legal real: `informacion.html#terminos` y `informacion.html#privacidad` (cierra esa promesa pendiente) |
| **A-19** (M) | ambas | **155 iconos decorativos (iconify) con `aria-hidden="true"`** (patrón A-17); burger y botón de cierre del menú móvil con `aria-label`; enlaces `_blank` con `rel="noopener"`; toast de imperium con `role="status" aria-live="polite"` |
| **A-20** (B) | ambas | Skip link «Saltar al contenido» → `#contenido` (header del hero), `:focus-visible` visible (patrón A-12) y **Escape cierra el menú móvil** |
| **A-21** (B) | ambas | `prefers-reduced-motion` respetado (animaciones `fadeUp`, pulso del botón de WhatsApp, reveal `.sr`) y `<noscript>` para que las secciones `.sr` no queden invisibles sin JS (patrón P-12) |
| **S-15** (M) | ambas | `<link rel="canonical">` (con `TODO T-06`) + Open Graph (og:type/title/description/url) + favicon + apple-touch-icon + preconnects — patrón S-12; con esto las 6 páginas del sitio llevan SEO de cabecera completo |
| **P-13** (M) | ambas | Google Fonts de **8 a 6 archivos** (el peso 300 y la cursiva de DM Sans no se usaban en ninguna de las 2 páginas; las cursivas visibles son de DM Serif Display) — patrón P-04/P-11 |
| **D-01** (decisión) | paquete | **`reservas.html` retirada del paquete** a petición del dueño («no necesito el reservas.html y ni el reserva.js»). Verificado que **ningún archivo del sitio enlazaba a ella** (solo la documentación la citaba) y que el SW no la precacheaba. `reserva.js` nunca llegó a aportarse. Si ya estaba desplegada: borrarla del servidor; si se reactiva algún día, mandar el JS para auditarlo |

Verificación de la fase: `node --check` OK en los 4 bloques inline de JS; estructura HTML balanceada (div/section/details/script/style); sweep final sin restos de voseo, erratas, `javascript:void(0)`, `sabormap.hab`, `© 2025`, enlaces absolutos ni `Pago unico`.

---

## 9. Beta sin delivery ni reservas (v1.4) — decisión del dueño

El dueño pidió que los botones **PedidosYa**, **Rappi** y **Reservar Mesa** se muestren «No disponible por ahora» durante la beta: hasta no tener clientes reales no hay URLs de delivery ni de reserva que valgan (los 256 links actuales apuntan a la raíz de los marketplaces, ver PENDIENTES 2.1). Los botones se dejan visibles —así el visitante ve lo que viene— pero apagados, no clicables y con aviso.

| ID | Dónde | Cambio |
|---|---|---|
| **B-01** | app.js | **Interruptor global `DELIVERY_BETA_OFF = true`** al inicio del archivo, documentado. Cuando cada local tenga su URL real, basta con ponerlo en `false`: los botones vuelven a funcionar solos con los datos de `places.js` (y los que aún tengan links placeholder muestran «próximamente», como hasta ahora). No hay que tocar nada más |
| **B-02** | app.js — drawer del local | La sección «Delivery y reservas» renderiza cada botón como `<span>` deshabilitado (gris, sin hover, `aria-disabled="true"`, tooltip «No disponible por ahora») más la nota «No disponible por ahora — esta sección se activará próximamente». Ya no se abren enlaces externos aunque el dato traiga una URL |
| **B-03** | app.js — sub-modal de la carta | Los mismos botones al pie de la carta, que antes quedaban **clicables hacia las raíces de PedidosYa/Rappi** (el sub-modal no verificaba placeholder: era el único punto donde el visitante podía salir hacia un marketplace sin local concreto), ahora también en modo no disponible con su nota |
| **B-04** | sabormap.html | CSS `.delivery-link.delivery-off` (apagado en ambos temas, `cursor: not-allowed`, sin elevación en hover) y `.delivery-off-note`; el comentario suelto del HTML se sustituye por una nota que apunta al interruptor en app.js |

**No se toca `dashboard.html`**: la gestión de links de delivery del panel es de uso interno del dueño y se deja operativa para cuando lleguen clientes reales. `places.js` queda intacto (los links placeholder siguen en los datos, esperando su sustitución — PENDIENTES 2.1).

**Despliegue:** como `app.js` cambia, se subió también la `VERSION` del service worker a **v2.0.1** para que el precache se refresque y los visitantes que ya tenían caché reciban la nueva lógica (la cabecera del propio sw.js lo exige en cada publicación).

---

## Cobertura global

| Categoría del informe | Hallazgos | Resueltos aquí | Pendientes (humanos) |
|---|---|---|---|
| Errores técnicos (T) | 14 | 13 | 1 (T-09 coords, parcial) |
| SEO (S) | 11 | 8 | 3 (S-05 URLs individuales, S-09 icono 180, S-11 HTML estático) |
| Accesibilidad (A) | 13 | 13 | 0 |
| Rendimiento (P) | 10 | 7 | 3 (P-05 Font Awesome, P-06 blur GPU, P-10 cabeceras servidor) |
| Contenido (C) | 12 | 6 | 6 (cartas, teléfonos, links, coords, C-07 filenames, C-12 menor) |
| UX/UI (U) | 11 | 9 | 2 (U-09 onclick inline, U-10 densidad configurable) |
| PWA (W) | 7 | 6 | 1 (W-03 verificación visual de iconos maskable) |
| **Total** | **78** | **~56** | **~22** |

A las 78 del informe se añaden las **revisiones R-01…R-07** de la sección 6 (código PWA aportado), los **18 hallazgos T-15…P-12** de la sección 7 (páginas secundarias aportadas en v1.2), los **11 hallazgos + decisión D-01** de la sección 8 (imperium · nosotros · retiro de reservas, v1.3) y los **4 ajustes B-01…B-04** de la sección 9 (beta sin delivery/reservas, v1.4) — todos resueltos en este paquete, salvo los parciales marcados.

Los "pendientes" no son defectos de código: son datos y decisiones que solo el dueño del sitio puede aportar. Cada uno tiene su entrada con instrucciones en `PENDIENTES.md`.
