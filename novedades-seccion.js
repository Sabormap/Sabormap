/* ═══════════════════════════════════════════ NOVEDADES — SOLO DISEÑO ═══════════════════════════════════════════ */
/* ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
   NOVEDADES — Botón flotante con submenú desplegable  [v2.3.1 — solo diseño]
   ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   Botón "Novedades" apilado sobre el FAB de la ruleta que despliega un
   popover con 4 secciones (Notificaciones globales, Eventos, Ofertas,
   Empleos). SOLO DISEÑO: sin navegación, sin fetch, sin contadores reales.
   Cada ítem queda cableado a onNovedadesSectionClick(this.dataset.section),
   que por ahora hace console.log + showToast('Próximamente') y cierra.

   Decisiones no obvias:
   · Apilado: el FAB de la ruleta ("¿Dónde comemos?") vive en
     bottom:24px/right:24px con ~42 px de alto, así que este botón reposa
     pegado encima, en bottom:80px (~14 px de separación), SIEMPRE: su
     posición es fija, no se mueve con el scroll. En móvil (≤768px) igual
     (la ruleta pasa a right:20px/bottom:20px).
   · Convivencia con #scrollBtns (botones subir/bajar, fixed en right:24px/
     bottom:90px, visibles con scrollY > 400): a petición del usuario, son
     ESOS botones los que suben — la regla "#scrollBtns { bottom: 140px }"
     de la hoja inyectada los recoloca por encima de este botón (el id gana
     a la clase .scroll-btns de index.html sin !important). Hueco resultante
     sobre el botón de Novedades: 18 px en desktop (80+42=122) y 12 en móvil
     (80+48=128). Si algún día quitas esta sección, borra también ese bloque
     de CSS y los botones volverán a bottom:90px (y volverían a taparlo).
     Coste asumido: con el menú abierto y la página scrolleada, el panel
     tapa los botones de scroll (comportamiento normal de un popover).
   · z-index 9001 (botón) y 9002 (panel): justo por encima de la ruleta
     (9000) y por debajo del overlay modal de la ruleta (100001), del drawer
     y del menú móvil. Así el popover nunca tapa un modal y ningún modal
     deja el popover "huérfano" por debajo.
   · Cierre por click fuera: listener de `pointerdown` en document en FASE
     DE CAPTURA. Así el cierre corre antes que cualquier otro handler de
     click (p. ej. abrir la ruleta: primero se cierra novedades, luego se
     abre la ruleta — nunca quedan dos paneles a la vez).
   · Posición del panel: `bottom` y flecha se calculan en JS contra el rect
     real del botón al abrir (y al redimensionar), no con valores fijos:
     el ancho del botón cambia entre desktop (pill con texto) y móvil (solo
     icono). En viewports bajos el panel se auto-limita (max-height) y se
     vuelve desplazable para no salirse por arriba.
   · prefers-reduced-motion: sin animaciones ni transiciones (CSS) y el
     cierre oculta el panel de inmediato, sin esperar la animación (JS).
   · Es un popover NO modal: no hay trampa de foco; Tab puede salir (y eso
     cierra el menú vía focusout). Solo Esc devuelve el foco al botón.
   ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */

/* Configuración de las 4 secciones. Cuando conectes la lógica real,
   este array es el único sitio que hay que tocar (icono, textos, sección). */
var NOVEDADES_SECTIONS = [
    { section: 'notificaciones', icon: 'fa-bullhorn',     title: 'Notificaciones globales', desc: 'Avisos de toda la comunidad' },
    { section: 'eventos',        icon: 'fa-calendar-days', title: 'Eventos',                 desc: 'Qué pasa esta semana' },
    { section: 'ofertas',        icon: 'fa-tags',          title: 'Ofertas',                 desc: 'Descuentos y promos' },
    { section: 'empleos',        icon: 'fa-briefcase',     title: 'Empleos',                 desc: 'Busca o publica trabajo' }
];

/* Número del badge (HARDCODEADO a propósito: es un gancho visual de diseño).
   Para ocultarlo: setNovedadesBadge(0), o quita la clase .has-badge del botón
   (#novedadesFab), o añádele .no-badge. Para poner un número real:
   setNovedadesBadge(7). */
var NOVEDADES_BADGE_COUNT = 3;

/* Estado interno del popover (abierto/cerrado + refs a los nodos). */
var _nv = { btn: null, panel: null, open: false, closeTimer: 0, resizeRaf: 0 };

/* initNovedades — inyecta estilos y crea botón + panel. Idempotente. */
function initNovedades() {
    injectNovedadesStyles();
    createNovedadesUI();
}

/* ═══════════════════════════════════════════
   ESTILOS (inyectados una sola vez en <head>,
   mismo patrón que injectFoodiesStyles)
   ═══════════════════════════════════════════ */
function injectNovedadesStyles() {
    if (document.getElementById('sabormap-novedades-styles')) return;
    var style = document.createElement('style');
    style.id = 'sabormap-novedades-styles';
    style.textContent = `
        /* ── Botón flotante disparador ───────────────────────────────── */
        .novedades-fab {
            position: fixed;
            /* Fijo, 14 px encima de la ruleta (24 + 42 + 14). No se mueve
               con el scroll: son los botones de subir/bajar los que suben
               (ver el override de #scrollBtns más abajo). */
            bottom: 80px;
            right: 24px;
            z-index: 9001;  /* encima de la ruleta (9000), bajo los modales (100001) */
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 18px;
            border: none;
            border-radius: 999px;
            background: linear-gradient(135deg, var(--accent, #8b5cf6), var(--pink, #ec4899));
            color: #fff;
            font-family: inherit;
            font-size: 0.88rem;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 8px 24px var(--accent-glow, rgba(139,92,246,0.3)), 0 2px 8px rgba(0,0,0,0.25);
            transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease;
        }
        .novedades-fab:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px var(--accent-glow, rgba(139,92,246,0.4)), 0 4px 12px rgba(0,0,0,0.3);
        }
        .novedades-fab:active { transform: translateY(0) scale(0.97); }
        .novedades-fab:focus-visible {
            /* Outline claro (no --accent) porque el fondo ya es un degradado violeta:
               un outline violeta no se vería. */
            outline: 2px solid var(--cream, #f1f5f9);
            outline-offset: 2px;
        }
        .novedades-fab i {
            font-size: 1.05rem;
            transition: transform 0.25s cubic-bezier(0.22,1,0.36,1);
        }
        /* Estado abierto: la campana se inclina (gancho visual de "hay algo") */
        .novedades-fab.open i { transform: rotate(15deg) scale(1.08); }
        .novedades-fab.open {
            box-shadow: 0 10px 30px var(--accent-glow, rgba(139,92,246,0.45)), 0 4px 14px rgba(0,0,0,0.3);
        }

        /* ── Convivencia con los botones de subir/bajar ──────────────────
           A petición del usuario: el botón de Novedades queda fijo, pegado
           encima del FAB de la ruleta, y son los botones de subir/bajar
           (#scrollBtns) los que suben para no chocar con él.
           index.html los coloca con .scroll-btns { bottom: 90px } (ocupan
           90–186 desde abajo); este botón ocupa 80–122 en desktop y 80–128
           en móvil, así que bottom:140px deja 18 px de aire en desktop y 12
           en móvil. El selector de id gana al de clase de index.html sin
           necesidad de !important, y sin esta regla los botones vuelven a
           su 90 px original (volverían a quedar tapados por el botón). */
        #scrollBtns { bottom: 140px; }

        /* Badge rojo (gancho visual, número hardcodeado). Visible solo con
           .has-badge; .no-badge lo fuerza a oculto en cualquier caso. */
        .novedades-badge {
            position: absolute;
            top: -6px;
            right: -6px;
            min-width: 20px;
            height: 20px;
            padding: 0 6px;
            border-radius: 999px;
            background: #ef4444;
            color: #fff;
            font-size: 0.72rem;
            font-weight: 800;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid var(--bg, #0b0e17); /* recorta el degradado y separa el badge */
            box-shadow: 0 2px 8px rgba(0,0,0,0.35);
            pointer-events: none;                  /* decorativo: no roba el clic del botón */
        }
        .novedades-fab:not(.has-badge) .novedades-badge,
        .novedades-fab.no-badge .novedades-badge { display: none; }

        /* ── Panel / popover ──────────────────────────────────────────── */
        .novedades-menu {
            position: fixed;
            right: 24px;
            bottom: 138px;   /* fallback; JS lo ancla al rect real del botón */
            z-index: 9002;
            width: 288px;
            max-width: calc(100vw - 24px);
            display: none;   /* cerrado por defecto: no captura clics ni foco */
            flex-direction: column;
            background: color-mix(in srgb, var(--card, #171d35) 94%, transparent);
            -webkit-backdrop-filter: blur(16px);   /* panel "cristal" sutil, como .fav-btn */
            backdrop-filter: blur(16px);
            border: 1px solid var(--border, #2a2f4a);
            border-radius: 18px;
            box-shadow: 0 24px 64px rgba(0,0,0,0.45);
            font-family: inherit;
            transform-origin: bottom right;        /* el popIn "nace" del botón */
        }
        [data-theme="light"] .novedades-menu {
            box-shadow: 0 24px 60px rgba(15,23,42,0.18), 0 4px 16px rgba(15,23,42,0.08);
        }
        /* Animación de apertura: scale 0.92→1 + translateY + fade (~220 ms) */
        .novedades-menu.open { display: flex; animation: nvPopIn 220ms cubic-bezier(0.22,1,0.36,1) both; }
        /* Cierre inverso (fade + scale 0.96); JS quita .closing al terminar
           y el panel vuelve a display:none. */
        .novedades-menu.closing { display: flex; animation: nvPopOut 170ms ease-in both; }
        @keyframes nvPopIn {
            from { opacity: 0; transform: translateY(10px) scale(0.92); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes nvPopOut {
            from { opacity: 1; transform: translateY(0) scale(1); }
            to   { opacity: 0; transform: translateY(6px) scale(0.96); }
        }

        /* Flecha/notch apuntando al botón. Su posición "right" la fija JS en
           --nv-notch-right para centrarla sobre el botón en cualquier
           breakpoint (el ancho del botón cambia entre pill e icono). */
        .novedades-notch {
            position: absolute;
            bottom: -9px;
            right: var(--nv-notch-right, 70px);
            width: 0;
            height: 0;
            border-left: 9px solid transparent;
            border-right: 9px solid transparent;
            border-top: 9px solid color-mix(in srgb, var(--card, #171d35) 94%, transparent);
            filter: drop-shadow(0 6px 8px rgba(0,0,0,0.12));
            pointer-events: none;
        }

        /* Encabezado: título + subtítulo + botón cerrar */
        .novedades-head {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 10px;
            padding: 16px 16px 12px;
        }
        .novedades-title {
            margin: 0;
            font-size: 1rem;
            font-weight: 800;
            color: var(--cream, #f1f5f9);
            letter-spacing: -0.01em;
        }
        .novedades-subtitle {
            margin: 2px 0 0;
            font-size: 0.75rem;
            color: var(--muted, #94a3b8);
        }
        .novedades-close {
            flex: 0 0 32px;
            width: 32px;
            height: 32px;
            border-radius: 10px;
            border: 1px solid transparent;
            background: transparent;
            color: var(--muted, #94a3b8);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.95rem;
            transition: all 0.2s ease;
        }
        .novedades-close:hover {
            background: var(--card-2, var(--card-hover, #1e254a));
            border-color: var(--border, #2a2f4a);
            color: var(--cream, #f1f5f9);
        }
        .novedades-close:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        /* Lista de secciones. max-height + overflow para pantallas bajas
           (el popover nunca puede salirse por arriba del viewport). */
        .novedades-list {
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding: 4px 8px 6px;
            max-height: max(140px, calc(100vh - 330px));
            overflow-y: auto;
        }

        /* Ítem de sección. El color por categoría entra por --nv-color,
           así el hover (fondo + borde izquierdo) y el círculo del icono
           salen solos para las 4 categorías sin repetir reglas. */
        .novedades-item {
            --nv-color: var(--accent, #8b5cf6);
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            padding: 10px;
            border: none;
            border-left: 3px solid transparent;   /* reserva el espacio: el hover no mueve el texto */
            border-radius: 12px;
            background: transparent;
            color: inherit;
            font-family: inherit;
            text-align: left;
            cursor: pointer;
            transition: background 0.18s ease, transform 0.18s ease, border-color 0.18s ease;
        }
        .novedades-item[data-section="notificaciones"] { --nv-color: var(--accent, #8b5cf6); }
        .novedades-item[data-section="eventos"]        { --nv-color: var(--secondary, #06b6d4); }
        .novedades-item[data-section="ofertas"]        { --nv-color: var(--amber, #f59e0b); }
        .novedades-item[data-section="empleos"]        { --nv-color: var(--green, #22c55e); }

        .novedades-item:hover,
        .novedades-item:focus-visible {
            background: var(--card-2, var(--card-hover, #1e254a));
            border-left-color: var(--nv-color);
            transform: translateX(2px);
        }
        .novedades-item:focus-visible {
            outline: 2px solid var(--accent);
            outline-offset: -2px;   /* inset: el outline acompaña al translateX sin quedar "flotando" */
        }

        /* Círculo del icono con tinte propio por categoría (color-mix se
           adapta solo al tema: en claro las variables ya cambian de tono). */
        .novedades-item-icon {
            flex: 0 0 40px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.95rem;
            color: var(--nv-color);
            background: color-mix(in srgb, var(--nv-color) 15%, transparent);
            border: 1px solid color-mix(in srgb, var(--nv-color) 30%, transparent);
        }
        .novedades-item-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 0;
            flex: 1;
        }
        .novedades-item-title {
            font-size: 0.86rem;
            font-weight: 700;
            color: var(--cream, #f1f5f9);
        }
        .novedades-item-desc {
            font-size: 0.74rem;
            line-height: 1.35;
            color: var(--muted, #94a3b8);
        }
        .novedades-item-chevron {
            flex: 0 0 auto;
            font-size: 0.7rem;
            color: var(--muted, #94a3b8);
            transition: transform 0.18s ease, color 0.18s ease;
        }
        .novedades-item:hover .novedades-item-chevron,
        .novedades-item:focus-visible .novedades-item-chevron {
            transform: translateX(4px);
            color: var(--nv-color);
        }

        /* Pie: separador sutil + enlace "Ver todo el historial" (placeholder) */
        .novedades-foot {
            border-top: 1px solid var(--border, #2a2f4a);
            padding: 6px 8px;
        }
        .novedades-foot-link {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            width: 100%;
            padding: 9px 8px;
            border: none;
            border-radius: 10px;
            background: transparent;
            color: var(--muted, #94a3b8);
            font-family: inherit;
            font-size: 0.78rem;
            font-weight: 600;
            cursor: pointer;
            transition: color 0.18s ease, background 0.18s ease;
        }
        .novedades-foot-link:hover,
        .novedades-foot-link:focus-visible {
            color: var(--accent, #8b5cf6);
            background: var(--card-2, var(--card-hover, #1e254a));
        }
        .novedades-foot-link:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }

        /* ── Móvil (≤768px) ───────────────────────────────────────────── */
        @media (max-width: 768px) {
            .novedades-fab {
                bottom: 80px;   /* fijo, sobre la ruleta (bottom:20px); #scrollBtns sube a 140px */
                right: 20px;
                padding: 14px;  /* + icono ≈ 45 px; min-width/height asegura los 48 px táctiles */
                min-width: 48px;
                min-height: 48px;
                gap: 0;
            }
            .novedades-fab-text { display: none; }   /* solo icono en móvil */
            .novedades-menu {
                left: 12px;     /* casi ancho completo con márgenes de 12 px */
                right: 12px;
                width: auto;
                bottom: 132px;  /* fallback; JS ancla al rect real del botón */
            }
            .novedades-item-icon { flex-basis: 44px; width: 44px; height: 44px; }
        }

        /* ── Accesibilidad: sin animaciones si el usuario lo pide ─────── */
        @media (prefers-reduced-motion: reduce) {
            .novedades-fab,
            .novedades-fab i,
            .novedades-menu,
            .novedades-item,
            .novedades-item-chevron,
            .novedades-close,
            .novedades-foot-link {
                animation: none !important;
                transition: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

/* ═══════════════════════════════════════════
   DOM — botón + panel (creados por JS,
   sin tocar index.html)
   ═══════════════════════════════════════════ */
function createNovedadesUI() {
    if (document.getElementById('novedadesFab')) return;   /* idempotente */

    /* Botón disparador (pill con degradado accent→pink) */
    var btn = document.createElement('button');
    btn.id = 'novedadesFab';
    btn.className = 'novedades-fab has-badge';
    btn.type = 'button';
    btn.title = 'Novedades';
    btn.setAttribute('aria-haspopup', 'menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'novedadesMenu');
    btn.setAttribute('aria-label', 'Abrir novedades');
    btn.innerHTML =
        '<i class="fas fa-bell" aria-hidden="true"></i>' +
        '<span class="novedades-fab-text">Novedades</span>' +
        /* El badge es decorativo (número hardcodeado, sin dato real detrás);
           cuando haya contadores reales, muévelo al aria-label del botón. */
        '<span class="novedades-badge" id="novedadesBadge" aria-hidden="true">' + NOVEDADES_BADGE_COUNT + '</span>';
    btn.addEventListener('click', function () { toggleNovedades(); });

    /* Panel con las 4 secciones. Los ítems son <button> reales con inline
       onclick (mismo idiom del resto de la app, p. ej. openLegalModal). */
    var itemsHtml = NOVEDADES_SECTIONS.map(function (s) {
        return '<button type="button" role="menuitem" class="novedades-item" data-section="' + s.section + '"' +
               ' onclick="onNovedadesSectionClick(this.dataset.section)">' +
               '<span class="novedades-item-icon" aria-hidden="true"><i class="fas ' + s.icon + '"></i></span>' +
               '<span class="novedades-item-text">' +
                   '<span class="novedades-item-title">' + s.title + '</span>' +
                   '<span class="novedades-item-desc">' + s.desc + '</span>' +
               '</span>' +
               '<i class="fas fa-chevron-right novedades-item-chevron" aria-hidden="true"></i>' +
               '</button>';
    }).join('');

    var panel = document.createElement('div');
    panel.id = 'novedadesMenu';
    panel.className = 'novedades-menu';
    panel.setAttribute('role', 'menu');
    panel.setAttribute('aria-label', 'Novedades');
    panel.innerHTML =
        '<div class="novedades-head">' +
            '<div>' +
                '<p class="novedades-title">Novedades</p>' +
                '<p class="novedades-subtitle">Lo último de Sabormap</p>' +
            '</div>' +
            '<button type="button" class="novedades-close" aria-label="Cerrar novedades">' +
                '<i class="fas fa-xmark" aria-hidden="true"></i>' +
            '</button>' +
        '</div>' +
        '<div class="novedades-list">' + itemsHtml + '</div>' +
        '<div class="novedades-foot">' +
            '<button type="button" class="novedades-foot-link" onclick="onNovedadesSectionClick(\'historial\')">' +
                '<i class="fas fa-clock-rotate-left" aria-hidden="true"></i>Ver todo el historial' +
            '</button>' +
        '</div>' +
        '<div class="novedades-notch" aria-hidden="true"></div>';

    /* Botón "×" cierra (los ítems ya cierran desde onNovedadesSectionClick) */
    panel.querySelector('.novedades-close').addEventListener('click', function () { closeNovedades(); });

    /* Popover NO modal: si el foco escapa del panel y del botón (p. ej. Tab
       más allá del último control), cerramos en lugar de dejar el menú
       flotando sin foco. rAF: esperar a que el foco llegue a su destino. */
    panel.addEventListener('focusout', function () {
        requestAnimationFrame(function () {
            if (!_nv.open) return;
            var a = document.activeElement;
            if (a && (a === _nv.btn || _nv.panel.contains(a))) return;
            closeNovedades();
        });
    });

    _nv.btn = btn;
    _nv.panel = panel;
    document.body.appendChild(btn);
    document.body.appendChild(panel);

    /* Re-anclar el panel si la ventana cambia con el menú abierto
       (rAF-coalesced, mismo patrón que handleMobileThemeToggle). El botón
       no escucha scroll: su posición es fija (los botones de subir/bajar
       se recolocan por CSS, ver el override de #scrollBtns). */
    window.addEventListener('resize', function () {
        if (_nv.resizeRaf) cancelAnimationFrame(_nv.resizeRaf);
        _nv.resizeRaf = requestAnimationFrame(function () {
            _nv.resizeRaf = 0;
            if (_nv.open) _positionNovedadesMenu();
        });
    });
}

/* _positionNovedadesMenu — ancla el panel sobre el rect real del botón.
   Se llama al abrir y al redimensionar; el CSS solo lleva valores fallback
   (la posición del botón es fija, no hay nada que perseguir). */
function _positionNovedadesMenu() {
    if (!_nv.btn || !_nv.panel) return;
    var btn = _nv.btn, panel = _nv.panel;
    var r = btn.getBoundingClientRect();
    if (!r || !r.width) return;   /* botón oculto: no mover el panel */

    /* ~10 px de hueco entre botón y panel (la flecha lo cubre visualmente) */
    panel.style.bottom = (window.innerHeight - r.top + 10) + 'px';

    /* Viewports bajos (p. ej. móvil apaisado): si el panel natural no cabe
       entre el top del viewport y el botón, limitarlo y hacerlo
       desplazable. Se limpia antes de medir para leer la altura natural
       (si no, mediríamos la altura ya recortada). Solo se activa overflow
       en ese caso: siempre activo recortaría la flecha, que vive fuera del
       borde del panel. */
    panel.style.maxHeight = '';
    panel.style.overflowY = '';
    var natural = panel.offsetHeight;
    var available = r.top - 24;
    if (available > 0 && natural > available) {
        panel.style.maxHeight = Math.max(200, available) + 'px';
        panel.style.overflowY = 'auto';
    }

    /* Centrar la flecha sobre el botón (su ancho cambia con el breakpoint) */
    var pr = panel.getBoundingClientRect();
    var btnCx = r.left + r.width / 2;
    var notchRight = pr.right - btnCx;
    if (notchRight < 14) notchRight = 14;
    if (notchRight > pr.width - 26) notchRight = pr.width - 26;
    panel.style.setProperty('--nv-notch-right', Math.round(notchRight) + 'px');
}

/* ═══════════════════════════════════════════
   APERTURA / CIERRE (solo UI)
   ═══════════════════════════════════════════ */

/* toggleNovedades(force) — sin argumento alterna; con true/false fuerza. */
function toggleNovedades(force) {
    var want = (typeof force === 'boolean') ? force : !_nv.open;
    if (want) _openNovedades();
    else closeNovedades();
}

function _openNovedades() {
    if (_nv.open) return;
    var btn = _nv.btn, panel = _nv.panel;
    if (!btn || !panel) return;

    /* Cancelar un cierre aún animándose (clic rápido abrir/cerrar/abrir) */
    if (_nv.closeTimer) { clearTimeout(_nv.closeTimer); _nv.closeTimer = 0; }
    panel.classList.remove('closing');

    /* Solo un panel flotante a la vez: cerrar la ruleta si está abierta
       (referencias con typeof porque esta sección debe poder pegarse sola). */
    if (typeof _rouletteState !== 'undefined' && _rouletteState &&
        typeof _closeRoulette === 'function') {
        try { _closeRoulette(); } catch (e) { /* la ruleta se autogestiona */ }
    }

    _nv.open = true;
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Cerrar novedades');
    panel.classList.add('open');
    _positionNovedadesMenu();

    /* Listeners globales solo mientras el menú está abierto */
    document.addEventListener('pointerdown', _nvOnPointerDown, true);
    document.addEventListener('keydown', _nvOnKeyDown, true);

    /* Patrón de menú (WAI-ARIA APG): al abrir, el foco cae en el primer ítem.
       El timeout deja arrancar la animación antes de mover el foco. */
    var items = _nvItems();
    if (items.length) {
        setTimeout(function () {
            if (_nv.open) items[0].focus();
        }, 30);
    }
}

function closeNovedades() {
    if (!_nv.open) return;
    var btn = _nv.btn, panel = _nv.panel;

    _nv.open = false;
    document.removeEventListener('pointerdown', _nvOnPointerDown, true);
    document.removeEventListener('keydown', _nvOnKeyDown, true);
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir novedades');
    panel.classList.remove('open');

    /* Con movimiento reducido: ocultar ya (sin .closing, que usaría animación).
       Si no: popOut y al terminar (170 ms) quitar .closing → display:none. */
    var reduce = window.matchMedia &&
                 window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { panel.classList.remove('closing'); return; }

    panel.classList.add('closing');
    if (_nv.closeTimer) clearTimeout(_nv.closeTimer);
    _nv.closeTimer = setTimeout(function () {
        _nv.closeTimer = 0;
        panel.classList.remove('closing');   /* vuelve a display:none */
    }, 180);
}

/* Cierre por click fuera: pointerdown en document (fase de captura, para
   correr antes que cualquier otro handler) + closest contra botón y panel. */
function _nvOnPointerDown(e) {
    if (!_nv.open) return;
    var t = e.target;
    if (t && t.closest && t.closest('#novedadesFab, #novedadesMenu')) return;
    closeNovedades();
}

/* Teclado mientras el menú está abierto:
   Esc cierra (devolviendo el foco al botón), ↑/↓ recorren los ítems con
   wrap-around, Home/End van al primero/último. Enter/Espacio los activan
   solos porque los ítems son <button> reales. */
function _nvOnKeyDown(e) {
    if (!_nv.open) return;
    if (e.key === 'Escape') {
        e.preventDefault();
        closeNovedades();
        if (_nv.btn) _nv.btn.focus();   /* popover no modal: solo Esc devuelve el foco */
        return;
    }
    var items = _nvItems();
    if (!items.length) return;
    var idx = items.indexOf(document.activeElement);
    switch (e.key) {
        case 'ArrowDown': e.preventDefault(); items[(idx + 1) % items.length].focus(); break;
        case 'ArrowUp':   e.preventDefault(); items[(idx - 1 + items.length) % items.length].focus(); break;
        case 'Home':      e.preventDefault(); items[0].focus(); break;
        case 'End':       e.preventDefault(); items[items.length - 1].focus(); break;
    }
}

function _nvItems() {
    if (!_nv.panel) return [];
    return Array.prototype.slice.call(_nv.panel.querySelectorAll('.novedades-item'));
}

/* ═══════════════════════════════════════════
   PLACEHOLDER — aquí conecta la lógica real
   ═══════════════════════════════════════════ */
function onNovedadesSectionClick(section) {
    /* SOLO DISEÑO: log + toast + cierre. Sustituye el cuerpo por la lógica
       real de cada sección cuando la tengas (navegación, fetch, contadores). */
    console.log('[novedades] Sección clickeada (placeholder):', section);
    closeNovedades();
    if (typeof showToast === 'function') showToast('Próximamente');
}

/* setNovedadesBadge(n) — actualiza u oculta el badge (estado visual puro).
   · setNovedadesBadge(7)  → muestra "7"
   · setNovedadesBadge(0)  → oculta (quita .has-badge y añade .no-badge)   */
function setNovedadesBadge(n) {
    var fab = document.getElementById('novedadesFab');
    var badge = document.getElementById('novedadesBadge');
    if (!fab || !badge) return;
    n = parseInt(n, 10);
    if (!n || n <= 0) {
        fab.classList.remove('has-badge');
        fab.classList.add('no-badge');
        return;
    }
    badge.textContent = n > 99 ? '99+' : String(n);
    fab.classList.add('has-badge');
    fab.classList.remove('no-badge');
}

/* ═══════════════════════════════════════════
   ARRANQUE + API PÚBLICA
   ═══════════════════════════════════════════ */
/* Listener independiente con try/catch (mismo patrón de robustez que la
   ruleta): pegando este bloque al final de app.js NO hace falta tocar nada
   más — ni el DOMContentLoaded principal ni index.html. Si prefieres
   controlarlo tú, borra este listener y llama initNovedades() desde el
   DOMContentLoaded que quieras. */
document.addEventListener('DOMContentLoaded', function () {
    try { initNovedades(); }
    catch (e) { console.warn('[novedades] initNovedades:', e); }
});

/* Entradas públicas (mismo patrón que window.openRoulette). */
window.openNovedades = function () { toggleNovedades(true); };
window.closeNovedades = closeNovedades;
window.toggleNovedades = toggleNovedades;
window.onNovedadesSectionClick = onNovedadesSectionClick;
window.setNovedadesBadge = setNovedadesBadge;
window.initNovedades = initNovedades;

/* ═══════════════════════════════════════════ FIN NOVEDADES ═══════════════════════════════════════════ */
