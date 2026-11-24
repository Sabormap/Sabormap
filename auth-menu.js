/* ═══════════════════════════════════════════════════════════════════
   auth-menu.js  —  [v2.1.0] Auth unificado para Sabormap
   ═══════════════════════════════════════════════════════════════════
   Un solo botón (#foodieAuthBtn) que al activarse despliega un popover
   (#authMenu) con dos acciones: "Iniciar sesión" y "Crear cuenta".
   Si el comensal YA tiene sesión, el MISMO botón muestra su avatar /
   iniciales y el popover cambia a: "Mis favoritos", "Mis reseñas",
   "Cerrar sesión".

   ACCESIBILIDAD (WCAG 2.1 AA):
   · role="menu" en el popover, role="menuitem" en cada item.
   · aria-haspopup, aria-expanded, aria-controls en el trigger.
   · Targets ≥ 44×44 px (WCAG 2.5.5).
   · Navegación por teclado: Tab/Shift+Tab, flechas ↑↓, Enter, Space, Esc.
   · Focus al primer item al abrir; retorno al trigger al cerrar.
   · Cierre: click fuera, Esc, scroll, selección de item, cambio de ruta.

   INTEGRACIÓN:
   · No duplica lógica de auth. Reutiliza `currentFoodie` (de foodies-app.js)
     y `handleFoodieLogout()` (window global).
   · updateAuthButton(isLoggedIn) en app.js sigue siendo el orquestador:
     actualiza el contenido del botón Y del popover, y deja este módulo
     encargado solo del comportamiento open/close/teclado.
   · Si JS falla, el <button> del header tiene un <noscript> con <a href>.

   SIN DEPENDENCIAS EXTERNAS. Vanilla JS ES2020+.
   ═══════════════════════════════════════════════════════════════════ */

(function AuthMenuModule() {
    'use strict';

    // ── Referencias al DOM (se cachean al cargar) ──────────────────
    let trigger = null;      // <button#foodieAuthBtn>
    let popover = null;      // <div#authMenu>
    let items = [];          // NodeList de role="menuitem"
    let isOpen = false;
    let lastFocusedItem = null;

    // ── Utilidades ─────────────────────────────────────────────────

    /** Escape ligero para atributos (reutiliza el global si existe). */
    function esc(s) {
        if (typeof window.escAttr === 'function') return window.escAttr(s);
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    /** Devuelve las iniciales (máx 2) a partir de un email o nombre. */
    function initialsFrom(emailOrName) {
        if (!emailOrName) return '?';
        const base = emailOrName.split('@')[0].trim();
        if (!base) return '?';
        // Si tiene espacios o puntos, tomar primeras letras de cada parte
        const parts = base.split(/[\s._-]+/).filter(Boolean);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        // Si es una sola palabra, tomar primeras 2 letras
        return base.substring(0, 2).toUpperCase();
    }

    /** ¿Está el popover abierto? */
    function getIsOpen() { return isOpen; }

    // ── Render del contenido del popover ───────────────────────────
    //    Llamado por updateAuthButton() en app.js cuando cambia el
    //    estado de auth. También exportado para reusar desde fuera.

    /** Renderiza los items del popover según estado de auth.
     *  @param {boolean} loggedIn  — true si hay sesión de comensal
     *  @param {object|null} profile — foodieProfileForHome ({display_name, avatar_url, email...}) */
    function renderPopoverItems(loggedIn, profile) {
        if (!popover) return;
        const email = (profile && profile.email) || (window.currentFoodie && window.currentFoodie.email) || '';
        const html = loggedIn
            ? _itemsLoggedIn(email)
            : _itemsLoggedOut();
        popover.innerHTML = html;
        // Recachear items tras render
        items = Array.prototype.slice.call(popover.querySelectorAll('[role="menuitem"]'));
        // Wire keyboard + click para cada item
        items.forEach(function (item) {
            item.addEventListener('keydown', handleAuthItemKeydown);
            // Click: cerrar el popover. La navegación la hace el <a> natural.
            item.addEventListener('click', function () {
                // Si es un <button> (logout), no navega; si es <a>, navega solo.
                closeAuthMenu({ returnFocus: true });
            });
        });
    }

    function _itemsLoggedOut() {
        return '' +
            '<a href="cuenta.html" class="auth-popover-item" role="menuitem" tabindex="-1">' +
                '<i class="fas fa-right-to-bracket" aria-hidden="true"></i>' +
                '<span>Iniciar sesión</span>' +
            '</a>' +
            '<a href="cuenta.html?view=signup" class="auth-popover-item" role="menuitem" tabindex="-1">' +
                '<i class="fas fa-user-plus" aria-hidden="true"></i>' +
                '<span>Crear cuenta</span>' +
            '</a>';
    }

    function _itemsLoggedIn(email) {
        var emailLine = email ? '<span class="auth-popover-header-email">' + esc(email) + '</span>' : '';
        return '' +
            '<div class="auth-popover-header" role="presentation">' +
                'Conectado como' + emailLine +
            '</div>' +
            '<a href="mi-sabormap.html#favoritos" class="auth-popover-item" role="menuitem" tabindex="-1">' +
                '<i class="fas fa-heart" aria-hidden="true"></i>' +
                '<span>Mis favoritos</span>' +
            '</a>' +
            '<a href="mi-sabormap.html#resenas" class="auth-popover-item" role="menuitem" tabindex="-1">' +
                '<i class="fas fa-star" aria-hidden="true"></i>' +
                '<span>Mis reseñas</span>' +
            '</a>' +
            '<div class="auth-popover-divider" role="presentation"></div>' +
            '<button type="button" class="auth-popover-item" role="menuitem" tabindex="-1" ' +
                'onclick="if(typeof handleFoodieLogout===\'function\'){handleFoodieLogout()}">' +
                '<i class="fas fa-sign-out-alt" aria-hidden="true"></i>' +
                '<span>Cerrar sesión</span>' +
            '</button>';
    }

    // ── Render del BOTÓN trigger (reemplaza updateAuthButton de app.js) ─
    //    app.js ya no necesita modificarse: este módulo sobrescribe
    //    window.updateAuthButton para pintar el botón + popover.

    /** Pinta el contenido del botón #foodieAuthBtn según estado de auth.
     *  Conserva SIEMPRE el chevron (el popover lo necesita). */
    function renderTriggerContent(loggedIn, profile) {
        if (!trigger) return;
        var avatarUrl = profile && profile.avatar_url;
        var displayName = (profile && profile.display_name) ||
                          (window.currentFoodie && window.currentFoodie.email ?
                           window.currentFoodie.email.split('@')[0] : '');

        if (loggedIn) {
            // Caso A: avatar URL → <img> circular
            // Caso B: sin avatar → iniciales del nombre/email
            var avatarHTML;
            if (avatarUrl) {
                avatarHTML = '<span class="auth-avatar">' +
                    '<img src="' + esc(avatarUrl) + '" alt="" ' +
                        'onerror="this.style.display=\'none\';this.parentNode.textContent=\'' +
                        esc(initialsFrom(displayName || window.currentFoodie.email)) + '\'">' +
                '</span>';
            } else {
                avatarHTML = '<span class="auth-avatar" aria-hidden="true">' +
                    esc(initialsFrom(displayName || (window.currentFoodie && window.currentFoodie.email))) +
                '</span>';
            }
            trigger.innerHTML =
                avatarHTML +
                '<span class="auth-trigger-label">Mi cuenta</span>' +
                '<i class="fas fa-chevron-down auth-trigger-chevron" aria-hidden="true"></i>';
            trigger.setAttribute('aria-label', 'Abrir menú de mi cuenta');
            trigger.setAttribute('title', 'Tu cuenta de comensal');
        } else {
            trigger.innerHTML =
                '<i class="fas fa-sign-in-alt auth-trigger-icon" aria-hidden="true" style="font-size:0.82rem;"></i>' +
                '<span class="auth-trigger-label">Entrar</span>' +
                '<i class="fas fa-chevron-down auth-trigger-chevron" aria-hidden="true"></i>';
            trigger.setAttribute('aria-label', 'Iniciar sesión o crear cuenta');
            trigger.setAttribute('title', 'Entra o crea tu cuenta de comensal');
        }
    }

    /** Punto de entrada único que reemplaza a updateAuthButton(isLoggedIn)
     *  en app.js. Pinta botón + popover de forma consistente. */
    function updateAuthUI(isLoggedIn) {
        renderTriggerContent(isLoggedIn, window.foodieProfileForHome || null);
        renderPopoverItems(isLoggedIn, window.foodieProfileForHome || null);
    }

    // ── Apertura / cierre ──────────────────────────────────────────

    /** Abre el popover. Foco al primer item. */
    function openAuthMenu(event) {
        if (event) { event.preventDefault(); event.stopPropagation(); }
        if (!trigger || !popover) return;
        if (isOpen) { closeAuthMenu({ returnFocus: true }); return; }
        isOpen = true;
        trigger.setAttribute('aria-expanded', 'true');
        popover.classList.add('open');
        popover.setAttribute('aria-hidden', 'false');
        if ('inert' in popover) popover.inert = false; else popover.removeAttribute('inert');
        // Foco al primer item (delegado al siguiente tick para que el
        // navegador haya pintado el popover)
        window.requestAnimationFrame(function () {
            if (items.length > 0) {
                items[0].focus();
                lastFocusedItem = items[0];
            }
        });
        // Listeners de cierre global (se registran solo cuando está abierto)
        document.addEventListener('click', handleOutsideClick, true);
        document.addEventListener('keydown', handleEscKey);
        window.addEventListener('scroll', handleScrollClose, { passive: true });
        // Cierre al cambiar de ruta (popstate / hashchange)
        window.addEventListener('hashchange', closeAuthMenu);
        window.addEventListener('popstate', closeAuthMenu);
    }

    /** Cierra el popover. Opcionalmente devuelve el foco al trigger. */
    function closeAuthMenu(opts) {
        opts = opts || {};
        if (!trigger || !popover) return;
        if (!isOpen) return;
        isOpen = false;
        trigger.setAttribute('aria-expanded', 'false');
        popover.classList.remove('open');
        popover.setAttribute('aria-hidden', 'true');
        if ('inert' in popover) popover.inert = true; else popover.setAttribute('inert', '');
        // Quitar listeners globales
        document.removeEventListener('click', handleOutsideClick, true);
        document.removeEventListener('keydown', handleEscKey);
        window.removeEventListener('scroll', handleScrollClose);
        window.removeEventListener('hashchange', closeAuthMenu);
        window.removeEventListener('popstate', closeAuthMenu);
        // Retorno de foco al trigger
        if (opts.returnFocus) {
            window.requestAnimationFrame(function () { trigger.focus(); });
        }
    }

    // ── Handlers de eventos ────────────────────────────────────────

    /** Click fuera del wrap → cerrar. */
    function handleOutsideClick(e) {
        if (!isOpen) return;
        var wrap = document.getElementById('authWrap');
        if (wrap && !wrap.contains(e.target)) {
            closeAuthMenu({ returnFocus: false });
        }
    }

    /** Esc en cualquier contexto → cerrar y devolver foco. */
    function handleEscKey(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            e.preventDefault();
            e.stopPropagation();
            closeAuthMenu({ returnFocus: true });
        }
    }

    /** Scroll → cerrar (solo popover, sin returnFocus para no saltar). */
    function handleScrollClose() {
        if (isOpen) closeAuthMenu({ returnFocus: false });
    }

    /** Teclado en el trigger:
     *  Enter / Space → NO se manejan aquí: el <button> sintetiza click
     *    naturalmente y onclick="openAuthMenu(event)" hace el toggle.
     *    (Si los manejáramos aquí, el click sintetizado cerraría lo que
     *    acabamos de abrir.)
     *  ArrowDown → abrir con foco en el primer item (o mover foco si ya abierto)
     *  ArrowUp   → abrir con foco en el último item (patrón menú WAI-ARIA)
     *  Escape    → cerrar si estaba abierto */
    function handleAuthTriggerKeydown(e) {
        var key = e.key;
        if (key === 'ArrowDown' || key === 'Down') {
            e.preventDefault();
            if (!isOpen) {
                openAuthMenu(e);
            }
            // Mover foco al primer item (tras el rAF de openAuthMenu)
            window.requestAnimationFrame(function () {
                if (items.length > 0) items[0].focus();
            });
        } else if (key === 'ArrowUp' || key === 'Up') {
            e.preventDefault();
            if (!isOpen) {
                openAuthMenu(e);
            }
            window.requestAnimationFrame(function () {
                if (items.length > 0) items[items.length - 1].focus();
            });
        } else if (key === 'Escape' || key === 'Esc') {
            if (isOpen) { e.preventDefault(); closeAuthMenu({ returnFocus: true }); }
        }
        // Enter / Space: NO preventDefault → el <button> sintetiza click → openAuthMenu
    }

    /** Teclado dentro de un item:
     *  Flechas ↑↓ → navegar items (rota)
     *  Tab → cierra (comportamiento natural, no atrapa Tab en popover)
     *  Enter / Space → activa el item (navegación natural del <a>) */
    function handleAuthItemKeydown(e) {
        var key = e.key;
        var idx = items.indexOf(e.currentTarget);
        if (key === 'ArrowDown' || key === 'Down') {
            e.preventDefault();
            var next = items[(idx + 1) % items.length];
            next.focus();
        } else if (key === 'ArrowUp' || key === 'Up') {
            e.preventDefault();
            var prev = items[(idx - 1 + items.length) % items.length];
            prev.focus();
        } else if (key === 'Home') {
            e.preventDefault();
            items[0].focus();
        } else if (key === 'End') {
            e.preventDefault();
            items[items.length - 1].focus();
        } else if (key === 'Tab') {
            // Tab sale del popover: cerrar sin devolver foco (navegación natural)
            closeAuthMenu({ returnFocus: false });
        } else if (key === 'Escape' || key === 'Esc') {
            e.preventDefault();
            closeAuthMenu({ returnFocus: true });
        }
        // Enter / Space → no preventDefault: el <a> navega, el <button> dispara onclick.
    }

    // ── Inicialización ─────────────────────────────────────────────

    function init() {
        trigger = document.getElementById('foodieAuthBtn');
        popover = document.getElementById('authMenu');
        if (!trigger || !popover) {
            // Sin trigger no hay nada que hacer (puede ser otra página)
            return;
        }
        // Render inicial: estado "logged out" por defecto. updateAuthButton()
        // lo sobreescribirá cuando initFoodieSession() determine el estado real.
        renderPopoverItems(false, null);
        // Marcar el popover como inert al inicio (lo está en HTML, pero por
        // si acaso el navegador no soporta el atributo HTML)
        if ('inert' in popover) popover.inert = true; else popover.setAttribute('inert', '');
    }

    // Auto-init cuando el DOM está listo. Como el script se carga con defer,
    // el DOM ya está parseado; pero nos cinturonamos por si acaso.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ── API pública (exponer en window para onclick handlers) ──────
    window.openAuthMenu = openAuthMenu;
    window.closeAuthMenu = closeAuthMenu;
    window.handleAuthTriggerKeydown = handleAuthTriggerKeydown;
    window.handleAuthItemKeydown = handleAuthItemKeydown;
    window.renderAuthPopoverItems = renderPopoverItems;
    window.renderAuthTriggerContent = renderTriggerContent;
    window.isAuthMenuOpen = getIsOpen;

    // ── Override de updateAuthButton de app.js ─────────────────────
    //    Sustituimos por completo la función original: app.js no se
    //    modifica. Conservamos la misma firma (isLoggedIn) para que
    //    initFoodieSession() y onAuthStateChange() sigan funcionando
    //    sin cambios. Llamada diferida por si app.js carga después.
    function installOverride() {
        var _orig = window.updateAuthButton;
        // Wrapper que pinta botón + popover de forma consistente
        window.updateAuthButton = function (isLoggedIn) {
            try { updateAuthUI(isLoggedIn); }
            catch (e) {
                // Si algo falla, caer al comportamiento original
                console.warn('[auth-menu] updateAuthUI falló, usando fallback:', e);
                if (typeof _orig === 'function') _orig.apply(this, arguments);
            }
        };
        // Si el estado ya estaba seteado (app.js llamó antes que nosotros),
        // re-pintar con el estado actual. currentFoodie es la fuente de verdad.
        if (window.currentFoodie) {
            updateAuthUI(true);
        } else {
            updateAuthUI(false);
        }
    }
    // Intentar instalar inmediatamente; si app.js aún no cargó, reintentar
    // en DOMContentLoaded y en window.load.
    installOverride();
    document.addEventListener('DOMContentLoaded', installOverride);
    window.addEventListener('load', installOverride);
})();
