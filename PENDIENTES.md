# Trabajo pendiente — lo que la automatización no puede resolver

Este paquete corrige todo lo que era **código y forma de los datos**. Lo que queda abierto son **datos reales que solo tú (o cada dueño de local) podéis aportar**, más 3 decisiones de arquitectura para el roadmap. Cada sección indica hallazgo, esfuerzo estimado y la herramienta incluida para hacerlo más rápido.

**Archivos de apoyo incluidos** (CSV, abribles en Excel/Sheets):

| Archivo | Filas | Uso |
|---|---|---|
| `pendientes-coordenadas.csv` | 17 | Locales cuya posición no coincide con su URL de Google Maps |
| `pendientes-telefonos.csv` | 91 | Locales sin teléfono útil |
| `pendientes-links.csv` | 522 | Enlaces que apuntan a la raíz de un marketplace |
| `pendientes-imagenes.csv` | 231 | Nombres de archivo de imagen problemáticos |

---

## 1. Datos por verificar (prioridad alta)

### 1.1 Las 17 coordenadas discrepan de su Google Maps — T-09 (M)

Para estos locales, el pin del mapa y el botón "Ubicación" llevan a sitios distintos (hasta 20,6 km). **No se corrigió automáticamente porque no hay forma de saber cuál de los dos es el correcto** — corregirlo mal sería peor que dejarlo señalado.

Cómo cerrarlo (30–60 min con el CSV delante): abre `pendientes-coordenadas.csv`, para cada local haz clic en el `gmapsUrl` (botón derecho → copiar coordenadas), comprueba cuál de las dos posiciones es el local real y:
- si la correcta es la de la URL → sustituye `lat`/`lng` en `places.js` por las de la URL;
- si la correcta es la de los datos → regenera el `gmapsUrl` con esas coordenadas.

| id | Local | Distancia |
|---|---|---|
| 170 | Bar K5 | **20,6 km** |
| 94 | Pizzeria LA RAMPA | 11,5 km |
| 169 | Bom Apettite | 7,8 km |
| 154 | Vista Habana | 5,5 km |
| 191 | Juanky's Pan | 5,5 km |
| 52 | ENPLAZA23 | 3,6 km |
| 197 | K-Delicia CAFÉ COREANO | 2,4 km |
| 19 | Birra \| Casa de la Cerveza | 2,6 km |
| 108 | Mimosa | 2,2 km |
| 195 | Beirut | 2,0 km |
| resto (7) | ver CSV | 1,1–1,7 km |

### 1.2 Los 256 locales con enlaces raíz de marketplace — C-05 (M)

El 99 % de los enlaces "Delivery y reservas" apuntan a `https://www.pedidosya.com/` o `https://www.rappi.com/` **sin local concreto** (522 enlaces en el CSV). Desde la **v1.4 (decisión tuya para la beta)** los botones PedidosYa / Rappi / Reservar Mesa se muestran deshabilitados con el aviso «No disponible por ahora» — el visitante ya no puede salir hacia un marketplace sin local. La función queda lista para cuando cada local aporte su URL real (perfil de PedidosYa, WhatsApp del local, etc.): sustituyes las URLs en los datos y pones `DELIVERY_BETA_OFF = false` en `app.js`; los botones con URL real se activan solos y los que sigan con placeholder vuelven a mostrar «próximamente».

Plan razonable: pedir la URL real como parte del formulario de "Reclamar este Local" (dashboard), y priorizar a los locales PRO.

### 1.3 Los 91 locales sin teléfono — C-04 (M)

`pendientes-telefonos.csv` trae los 91 con su dirección. Son el 35 % del catálogo; para un directorio cuya conversión principal es "llamar o reservar", completar los teléfonos es la tarea de contenido con mayor retorno. Alternativa si no se consiguen: dejar el campo vacío (la UI ya oculta la fila) — nunca inventar.

### 1.4 Barrio contradictorio — C-08 (M, cerrado parcialmente)

El caso detectado (id 172 "San Lázaro 113", descrito como "del Vedado" con dirección de Centro Habana) **ya se corrigió** en el texto. Queda pendiente una pasada visual por los 258 para detectar contradicciones similares barrio/dirección que un script no puede juzgar.

---

## 2. Contenido por redactar (prioridad media)

### 2.1 Las 4 cartas clonadas — C-01 (C) y los textos clonados — C-02 (C)

247 de 258 locales comparten una de 4 plantillas de menú; el 96 % del catálogo muestra literalmente la misma carta. El ejemplo más visible: **"Risotto de camarones y coco" como plato estrella en 118 locales**, incluidas pizzerías y heladerías. También comparten la misma "Nota del editor" 119 locales.

Esto no se toca automáticamente porque crear una carta inventada por local sería **fabricar información falsa sobre negocios reales**. Es trabajo editorial:

1. Los 9 locales PRO/destacados primero (`featured: true` + `is_pro`), que son los que generan ingresos.
2. Pedir foto/cartapestaña de la carta vía WhatsApp al reclamar el local.
3. Mientras tanto, opción intermedia barata: para pizzerías/heladerías con la plantilla de "Entradas" absurda, **vaciar** `mustOrder` y `menu` (la UI ya sabe mostrar "carta próximamente") — mejor una carta ausente que una mentira. Si decides hacer esto, es un cambio de 30 líneas en `places.js` filtrando por categoría.

### 2.2 Tags genéricos por especialidades reales — C-03 (M, cerrado parcialmente)

Los 112 tags placeholder se sustituyeron por `Categoría · Barrio` (verdad, pero genérica). Cuando cada local aporte sus especialidades, sustituye el array `tags` en `places.js`. Aparecen en el buscador y en el drawer, así que cada tag real mejora también la búsqueda.

### 2.3 Nombres de archivo de imagen — C-07 (M)

Renombrar ficheros exige tocar el servidor, no solo el dato. `pendientes-imagenes.csv` lista los 231 casos:

- **3 con emoji** en el nombre (ids 12, 39, 180): rompen en algunos CDN/encoders.
- **3 con apóstrofe** (ids 80, 116, 174): se escapan bien hoy, pero son fuente clásica de bugs.
- **2 con errata visible** (id 11 `Sensacioones`, id 20 `Best Sushi in Town.jpg`).
- **222 con espacios**: funcionan (el navegador los codifica), pero recomendar guiones para URLs limpias.

Procedimiento: renombra el fichero físicamente (ej. `Sensaciones Restaurante-Grill.jpg` → `sensaciones-restaurante-grill.jpg`) y actualiza la ruta en `places.js` en el mismo commit.

---

## 3. Decisiones de despliegue (prioridad media)

### 3.1 Dominio definitivo — T-06 (M) · bloquea: S-03, T-05, W-01

El paquete asume **`sabormap.com`** como canónico. Para cerrarlo: confirma el dominio real, busca los comentarios `TODO (T-06)` en `sabormap.html` (og:image, enlaces absolutos) y configura redirecciones 301 del resto hacia el canónico. Si el definitivo fuera otro, el email de contacto (`hola@sabormap.com`) y las imágenes OG también deben moverse.

### 3.2 Iconos PWA — W-03 (M) y S-09 (B)

El manifest corregido declara **4 PNG** (los mismos que tu manifest aportado): `icon-192x192.png`, `icon-512x512.png` (imprescindible para instalar), `icon-192x192-maskable.png` e `icon-512x512-maskable.png`. Verifica que los 4 existen en la raíz; valida en [maskable.app](https://maskable.app/editor) que el logo queda dentro de la zona segura de las variantes maskable (las esquinas se recortan), y crea además `icon-180x180.png` para el `apple-touch-icon` ideal de iOS. 15 minutos con cualquier herramienta (p. ej. pnpm dlx pwa-asset-generator). Si una variante maskable no existe todavía, quita su entrada del manifest o duplícala con `purpose: "any"` mientras tanto.

### 3.3 `dashboard.html` sin indexar — S-06 (M) · ✅ CERRADO en v1.2

El panel (que llegó después y se entregó renombrado desde `dahsboard.html`) ya lleva en su `<head>`:

```html
<meta name="robots" content="noindex, nofollow">
```

Más un `rel="nofollow"` en los enlaces desde la home. Nada pendiente aquí.

### 3.3bis Páginas secundarias — estado tras v1.3

- ✅ **`nosotros.html`** e **`imperium.html`**: aportadas y corregidas en v1.3 (11 hallazgos — detalle en CAMBIOS §8).
- 🗑️ **`reservas.html` RETIRADA (v1.3, decisión tuya)**: dijiste que no la necesitas; ningún archivo del sitio enlazaba a ella (verificado) y el service worker no la precacheaba. Si ya la desplegaste antes, bórrala del servidor. Si algún día reactivas la función de reservas, mándame también su **`reservas.js`** (nunca fue aportado: render de tarjetas, apertura del modal, envío del formulario y `toggleTheme` siguen sin auditar).
- **`cdn.tailwindcss.com` en publicar/dashboard/informacion/imperium/nosotros (P-11)**: es el Play CDN de desarrollo — ~300 KB de JS, aviso en consola («should not be used in production») y bloqueo de render. No se tocó porque sustituirlo exige compilar el CSS de Tailwind (`npx tailwindcss build`). Roadmap recomendado: pasar las 5 páginas a CSS compilado (~2 h con una config mínima).
- **Precio del plan Básico (C-15)**: la tarjeta dice «Gratis» y la tabla «Gratis», pero el botón original enviaba «3,500 CUP/mes». Se alineó el botón con la tarjeta; confirma el precio real.
- **Fecha del texto legal (C-15)**: dice «Última actualización: 24 de octubre de 2024» — actualízala si ha cambiado algo.

### 3.4 `robots.txt` y `sitemap.xml` — no existían en los fuentes

Con el JSON-LD ya dinámico, un sitemap con la home (y las páginas públicas: `informacion.html`, `publicar.html`, `imperium.html`, `nosotros.html`) más un `robots.txt` que excluya `/dashboard.html` completa la base SEO. Ejemplo mínimo:

```
User-agent: *
Allow: /
Disallow: /dashboard.html
Sitemap: https://sabormap.com/sitemap.xml
```

### 3.5 Cabeceras de caché del servidor — P-10 (B)

Verifica (DevTools → Network) que `places.js`, `app.js` y las imágenes sirven `Cache-Control` razonable (`max-age=3600` para JS, `max-age=31536000, immutable` para imágenes). El service worker nuevo amortigua mucho esto, pero la primera visita se beneficia.

---

## 4. Roadmap (Fase 3 del informe — decisión de arquitectura)

Estos 4 no se arreglaron a propósito porque son refactors con decisión de diseño detrás:

| ID | Tema | Por qué quedó |
|---|---|---|
| **S-05** (M) | URLs individuales por local (`/local/<id>`) | Requiere rutas de servidor o SSG; es la mejora SEO más potente del roadmap (cada local = una landing indexable) |
| **S-11** (B) | El catálogo depende de JS | Se mitiga con el JSON-LD dinámico; la solución completa es generar el HTML estático de la primera pantalla (misma pieza que S-05) |
| **P-05** (M) | Font Awesome completo (~100 KB) para ~25 iconos | Sustituir por SVG inline es un cambio transversal de markup; hacerlo a medias deja iconos rotos |
| **U-09** (B) | Handlers `onclick` inline | Bloquean una CSP estricta; migrar a `addEventListener` es mecánico pero toca todo el HTML. Se puede combinar con la migración de S-05 |

---

## Resumen de esfuerzo estimado

| Bloque | Tarea | Tiempo |
|---|---|---|
| 1.1 | Verificar 17 coordenadas | 30–60 min |
| 1.2 | Recoger URLs de delivery reales | continuo (vía reclamo de local) |
| 1.3 | Completar 91 teléfonos | 2–4 h con el CSV |
| 2.1 | Cartas de los 9 destacados | 1–2 semanas editoriales |
| 2.3 | Renombrar 8 imágenes críticas (emoji/apóstrofe/errata) | 20 min |
| 3.1 | Confirmar dominio + 301 | 30 min |
| 3.2 | Iconos PWA 512/180 + maskable | 15 min |
| 3.3–3.4 | noindex + robots + sitemap | 20 min |

Con 1.1, 3.1–3.4 y los iconos, el sitio queda alineado con todas las correcciones críticas del informe.
