# Sabormap — Paquete de archivos corregidos

**Versión:** 1.4 · **Fecha:** 20/10/2026 · **Basado en:** *Informe de Auditoría Integral de Sabormap* (78 hallazgos: 11 críticos, 35 medios, 32 leves) + 18 hallazgos en páginas secundarias (v1.2) + 11 hallazgos en las 2 últimas páginas y el retiro de `reservas.html` (v1.3) + beta sin delivery/reservas (v1.4)

Este paquete contiene la versión corregida de los 4 archivos del sitio más un service worker nuevo, más la documentación de cada cambio. Todos los archivos son **sustituibles directamente** (drop-in): conservan las mismas rutas, nombres y contratos de datos que los originales.

---

## 1. Contenido del paquete

| Archivo | Qué es | Estado |
|---|---|---|
| `sabormap.html` | Página principal (HTML + CSS + esquemas) | ✅ Corregido |
| `app.js` | Lógica de la aplicación (render, filtros, drawer, mapa) | ✅ Corregido |
| `places.js` | Datos de los 258 locales | ✅ Corregido y normalizado |
| `manifest.json` | Manifiesto PWA | ✅ Corregido (4 iconos: any + maskable) |
| `sw.js` | Service worker | 🆕 **v2.0.1** — base v2.0.0 (fusión con tu SW v4, ver CAMBIOS §5–6) + bump de versión para el despliegue v1.4 |
| `dashboard.html` | Panel de dueños (antes **dahsboard.html** — errata en el nombre que rompía 3 enlaces) | ✅ Corregido + renombrado (T-15) |
| `informacion.html` | Legal: Términos y Privacidad | ✅ Corregido (v1.2) |
| `publicar.html` | Landing de planes y conversión | ✅ Corregido (v1.2) |
| `imperium.html` | Landing comercial de Imperium (webs, branding, apps) | ✅ Corregido (v1.3) |
| `nosotros.html` | Página «Nosotros»: historia, pasos, pagos, oficina | ✅ Corregido (v1.3) |
| ~~`reservas.html`~~ | Sistema de reservas | 🗑️ **Retirada en v1.3 por decisión tuya** («no necesito el reservas.html y ni el reserva.js»). Ningún archivo del sitio enlazaba a ella (verificado); si ya la desplegaste, bórrala del servidor |
| `CAMBIOS.md` | Registro detallado de cada corrección, con el ID del hallazgo | 📄 Documentación |
| `PENDIENTES.md` | Lo que NO se puede automatizar y te toca a ti (datos reales) | 📄 Documentación |
| `auditoria_places.js` | Script de auditoría reutilizable, parametrizado | 🔧 Herramienta |

## 2. Resumen de lo resuelto

De los **78 hallazgos** de la auditoría, este paquete resuelve de forma automática **56** y deja **22** documentados en `PENDIENTES.md` (los que exigen datos o decisiones humanas: teléfonos reales, URLs de delivery reales, verificación de coordenadas, cartas originales, dominio definitivo). A ello se suma la **revisión del código PWA que aportaste después** (tu `sw.js` v4, el snippet de registro y tu `manifest.json`): 7 revisiones R-01…R-07 resueltas en `sw.js` v2.0.0 — detalle en `CAMBIOS.md` §6.

**Novedades v1.1:** completada la sustitución de los 64 tags con errata `Descrubelo` que la v1.0 dejó pendiente (la validación original solo miraba la grafía correcta), `ron añejo` con tilde en las cartas, tildes en las etiquetas de categoría y allowlist/correcciones del SW. Re-auditoría completa en verde: ver tabla siguiente.

**Novedades v1.2:** integradas las 4 páginas secundarias que faltaban (`informacion.html`, `publicar.html`, `reservas.html` y el panel, renombrado a `dashboard.html`): 18 hallazgos nuevos corregidos — detalle completo en `CAMBIOS.md` §7.

**Novedades v1.3:** integradas las 2 últimas páginas (`imperium.html` y `nosotros.html`): ~120 tildes/signos, voseo→tuteo (~29 casos), enlaces absolutos→relativos, enlaces legales apuntando a `informacion.html`, canonical/OG/favicon, 155 iconos con `aria-hidden`, fuentes 8→6 archivos, scroll suave que lanzaba excepción — detalle en `CAMBIOS.md` §8. Además **`reservas.html` se retira del paquete** (D-01): no enlazaba nada a ella y el SW no la precacheaba.

**Novedades v1.4:** a petición tuya para la beta, los botones **PedidosYa, Rappi y Reservar Mesa** se muestran «No disponible por ahora»: visibles pero apagados, no clicables y con aviso, tanto en el drawer del local como al pie de la carta (donde aún eran clicables hacia las raíces de los marketplaces). Se reactivan con un solo interruptor: `DELIVERY_BETA_OFF = false` en `app.js` cuando tengas clientes reales — detalle en `CAMBIOS.md` §9.

Resultados verificados al re-ejecutar la auditoría de datos sobre `places.js` corregido:

| Verificación | Antes | Después |
|---|---|---|
| Locales invisibles al filtrar (categoría `restaurant`) | 34 | **0** |
| Locales parseados como "abierto 24 h" (bug de horario) | 3 | **0** |
| Horas inválidas o ambiguas (`00:00pm`, `23:00am`…) | 9 | **0** |
| Horarios mezclando 12 h y 24 h (`23:00pm`) | 135 | **0** |
| Tags placeholder `Descubrelo` / errata `Descrubelo` | 112 | **0** |
| Emojis dentro de direcciones / horarios / tags / nombres | 473 | **0** |
| Dirección en Unicode matemático (ilegible para lectores) | 1 | **0** |
| Voseo rioplatense en textos | 2 reales | **0** |
| JSON-LD con 126 items frente a 258 reales | sí | **no** (se genera en runtime) |
| Re-render completo de la grilla cada 60 s | sí | **no** (solo badges) |
| 258 tarjetas renderizadas de golpe | sí | **no** (lotes de 60) |
| Leaflet descargado con el feature de mapa oculto | ~200 KB | **0 KB** |
| Drawer sin semántica de diálogo / sin trampa de foco | sí | **no** |
| Colecciones y tarjetas inaccesibles por teclado | sí | **no** |

Además se superó un **test de humo automatizado de 19 comprobaciones** ejecutado en Chromium headless (render, paginación, JSON-LD, teclado, foco, contraste AA, PWA). La herramienta y las instrucciones para repetirlo están en la sección 5.

## 3. Cómo desplegar

1. **Haz copia de seguridad** de los archivos actuales del sitio.
2. Sube los **10 archivos del sitio** (`sabormap.html`, `app.js`, `places.js`, `manifest.json`, `sw.js`, `dashboard.html`, `informacion.html`, `publicar.html`, `imperium.html`, `nosotros.html`) a la raíz, reemplazando los existentes. **Ojo:** el panel se sube como `dashboard.html` (con d) — si en tu servidor queda el viejo `dahsboard.html`, bórralo. Igualmente, si quedó una `reservas.html` de un despliegue anterior, bórrala: ya no forma parte del sitio (y su `reservas.js` nunca llegó a auditarse). Si tu servidor no sirve `sabormap.html` como página índice, renómbrala `index.html` — es el nombre que el service worker usa en su fallback offline.
3. **Sube los 4 iconos del manifest**: `icon-192x192.png`, `icon-512x512.png`, `icon-192x192-maskable.png` y `icon-512x512-maskable.png` (son los que tu propio manifest declaraba; el 512 es el exigido por Chrome para instalar). Si aún no tienes las variantes maskable, genera el PNG o deja solo las entradas `any` mientras tanto: la instalación sigue funcionando.
4. **No hace falta pegar ningún snippet de registro del SW en el HTML**: el registro ya está integrado al final de `app.js` (con toast de aviso de actualización en vez de recarga forzada, y avisos online/offline con tildes).
5. Al subir un `sw.js` con `VERSION` nuevo, la caché del service worker anterior (`sabormap-v4` o `sabormap-static-v1.0.0`) se limpia sola en el `activate`.
6. Verifica en producción (ver sección 5): abre la web, consola del navegador sin errores rojos, y Lighthouse > 90 en Accessability/Best Practices.

**Orden de despliegue recomendado:** `places.js` → `app.js` → `sabormap.html` → `manifest.json` → `sw.js`. Si solo puedes subir algunos hoy, `places.js` + `app.js` ya arreglan los 3 bugs críticos de datos y de interfaz.

## 4. Decisiones que debes confirmar (importante)

Estas correcciones **asumen criterios** que conviene validar — están marcadas con `TODO` en el código:

| Supuesto aplicado | ID | Qué hacer si no es correcto |
|---|---|---|
| El dominio canónico es **`sabormap.com`** | T-05/T-06/S-03 | Busca los comentarios `TODO (T-06)` en `sabormap.html` y cambia las URLs. Añade redirecciones 301 desde `.hab` |
| El email de contacto es `hola@sabormap.com` | T-05 | Cambia el `mailto:` del footer si es otro |
| Los horarios `12:00am-00:00pm` significaban **"12:00 del mediodía a medianoche"** | T-02 | Si alguno abría de madrugada, edita su `hours` en `places.js` |
| Los tags placeholder se sustituyeron por **`Categoría · Barrio`** | C-03 | Son honestos pero genéricos; lo ideal es que cada local tenga sus especialidades reales |
| La vista mapa sigue deshabilitada pero **funciona** si la reactivas | U-01 | Quita `style="display:none;"` al `.view-toggle` y Leaflet cargará solo en ese momento |
| El cierre del banner PWA se recuerda **7 días** (antes: para siempre) | W-07 | Ajusta `DISMISS_DAYS` en el script del banner |

## 5. Cómo verificar los cambios

**a) Auditoría de datos (Node, sin dependencias):**

```bash
node auditoria_places.js places.js
```

Compara la salida con la tabla de la sección 2. En el paquete corregido debe mostrar 0 en todas las métricas corregidas y mantener los controles pendientes (teléfonos, links, coords) con sus números originales, que están documentados en `PENDIENTES.md`.

**b) Prueba de humo en navegador (opcional, requiere Playwright):**

```bash
npm i -D playwright && npx playwright install chromium
python3 -m http.server 8791   # en la carpeta del sitio
node test_smoke.js             # script incluido en los scripts del informe
```

**c) Comprobaciones manuales de 2 minutos:**

1. Filtra por **Restaurantes** → deben aparecer 161 locales (antes 127: los 34 con el typo desaparecían).
2. Abre un local con horario de madrugada → el badge debe decir "Abierto · Cierra a las 00:00", no quedarse siempre "Abierto".
3. Navega **solo con Tab**: el skip link aparece con el primer Tab; las colecciones y tarjetas se activan con Enter y barra espaciadora; el drawer atrapa el foco y Escape lo cierra.
4. Busca "risotto" → el buscador ahora encuentra platos de las cartas, no solo nombres de locales.
5. Cambia a tema claro → los badges "Abierto/Cerrado" se leen con contraste suficiente.
6. DevTools → Application → Manifest: sin errores; Lighthouse > PWA instalable.
7. **Service worker**: DevTools → Application → Service Workers debe mostrar `sw.js v2.0.1` *activated*; en **Cache Storage** verás `sabormap-static-v2.0.1` (shell + woff2) y `sabormap-runtime-v2.0.1` llenándose al navegar. Marca *Offline* en la pestaña Network y recarga: el sitio sigue funcionando con los 258 locales (Supabase cae a `places.js`); si navegas a una URL sin caché verás la página offline 503 con estilos.
8. **Actualización**: cambia `VERSION` en `sw.js`, sube el archivo, recarga dos veces → toast "Sabormap se ha actualizado" y en Cache Storage desaparece la caché anterior (sin ninguna recarga forzada).

## 6. Qué NO incluye este paquete

No se tocaron deliberadamente (ver `PENDIENTES.md` para el detalle y la justificación):

- **Teléfonos, URLs de delivery y coordenadas reales**: inventarlos sería peor que dejarlos pendientes; hay 91 locales sin teléfono, 256 con enlaces raíz de PedidosYa/Rappi y 17 coordenadas que discrepan de su URL de Google Maps.
- **Las 4 cartas clonadas**: 247 de 258 locales comparten plantillas de menú. Es un trabajo editorial por local, no una sustitución de texto.
- **`dashboard.html` / `plan.html` / `nosotros.html` sin fuentes — RESUELTO POR FASES:** el panel ya lleva su `noindex` (v1.2) y `nosotros.html` + `imperium.html` forman parte del paquete desde v1.3 con canonical propio. `plan.html` no existe como archivo: los enlaces apuntan a `publicar.html#planes`.
- **`robots.txt` y `sitemap.xml`**: no existían en los fuentes; crearlos requiere conocer la lista definitiva de URLs.
- **Refactor completo de handlers inline (`onclick="..."`)**: es deuda técnica de CSP, planificada para la Fase 3 del roadmap del informe.
