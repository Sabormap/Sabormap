/* ═══════════════════════════════════════════════════════════════════
   app.js — Sabormap  [VERSIÓN CORREGIDA]
   Correcciones aplicadas (ver CAMBIOS.md):
   T-01  normalización defensiva de categorías
   T-03  populateBarrios sin duplicados, conserva selección
   T-11  toggleTheme actualiza todas las meta theme-color
   W-02  sin recarga automática al actualizar el service worker
   A-01  colecciones accesibles por teclado (role=button + aria-pressed)
   A-02  drawer como diálogo modal con trampa de foco
   A-03  menú móvil y drawer fuera del árbol a11y al cerrarse
   A-04  tarjetas activables con Enter y barra espaciadora
   A-09  "copiar dirección" como <button> real, sin inyección
   A-11  iconos decorativos con aria-hidden
   P-01/U-06  refresco de 60 s solo de badges (sin re-render)
   P-02/U-10  grilla paginada (60 tarjetas por lote)
   P-03/U-01  Leaflet se carga bajo demanda
   P-09  el refresco se omite con la pestaña oculta
   U-04  búsqueda indexa platos, cartas y descripciones
   U-11  el modal legal ya no destruye el detalle del local
   C-09/C-10  tuteo y tildes unificados en los textos de UI
   ═══════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════
   [B-01] INTERRUPTOR DE BETA — Delivery y reservas fuera de servicio
   ───────────────────────────────────────────────────────────────────
   El dueño mantiene los botones PedidosYa, Rappi y Reservar Mesa
   visibles pero en modo "No disponible por ahora" durante la beta,
   hasta tener clientes reales con URLs propias (PENDIENTES 2.1).

   → Cuando cada local tenga su URL real de delivery/reserva,
     cambia esta constante a false y los botones vuelven a funcionar
     solos con los datos de places.js (o muestran "próximamente"
     si el local aún tiene links placeholder).
   ═══════════════════════════════════════════════════════════════════ */
const DELIVERY_BETA_OFF = true;

/* ═══════════════════════════════════════════════════════════════════
   [v2.0.12 → v2.0.13] LISTA BLANCA DE LOCALES CON DELIVERY HABILITADO
   ───────────────────────────────────────────────────────────────────
   Aunque DELIVERY_BETA_OFF esté en true, los locales marcados como
   "delivery habilitado" mostrarán sus botones de delivery/reserva
   ACTIVOS (como enlaces reales <a href="...">), siempre y cuando
   tengan links válidos (no placeholders) en su campo `links`.

   [v2.0.13] Ahora la fuente de verdad es la COLUMNA `delivery_enabled`
   de la tabla `places` en Supabase. El admin la toggle desde el
   dashboard (panel "Todos los Locales"). Esto reemplaza la lista
   hardcoded anterior (DELIVERY_ENABLED_PLACE_IDS).

   Mantenemos DELIVERY_ENABLED_PLACE_IDS como FALLBACK para los locales
   estáticos de places.js (que no tienen columna en Supabase) y por si
   la columna no existe aún en algún entorno. Si un local tiene
   `deliveryEnabled === true` (vino de Supabase con ese flag) O está
   en el Set hardcoded, se considera habilitado.
   ═══════════════════════════════════════════════════════════════════ */
const DELIVERY_ENABLED_PLACE_IDS = new Set([
    // Vacío por defecto: la gestión se hace desde el dashboard.
    // Agrega aquí IDs estáticos de places.js si quieres habilitar
    // delivery para locales que NO están en Supabase. Los locales
    // de Supabase se gestionan con la columna delivery_enabled.
]);

/* Helper: ¿este local tiene delivery habilitado individualmente?
   Dos fuentes, con OR:
     · p.deliveryEnabled === true (vino de Supabase con delivery_enabled=true)
     · String(p.id) está en DELIVERY_ENABLED_PLACE_IDS (lista estática) */
function isDeliveryEnabledFor(p) {
    if (!p || !p.id) return false;
    if (p.deliveryEnabled === true) return true;
    return DELIVERY_ENABLED_PLACE_IDS.has(String(p.id));
}

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    try { localStorage.setItem('sabormap-theme', next); } catch (e) { console.warn('[theme] No se pudo guardar la preferencia:', e); }

    // [T-11] Actualizar TODAS las meta theme-color (hay una por esquema de color)
    document.querySelectorAll('meta[name="theme-color"]').forEach(m => {
        m.setAttribute('content', next === 'dark' ? '#8b5cf6' : '#7c3aed');
    });

    // Si el mapa existe, cambiar tiles
    if (map && typeof mapTileLayer !== 'undefined') {
        updateMapTiles(next);
    }
}

/* ═══════════════════════════════════════════════════
   WHATSAPP — abre wa.me con menu de planes prellenado
   Mismo menu que plan.html para consistencia.
   ═══════════════════════════════════════════════════ */
const WHATSAPP_NUMBER = '5356578961';

function wspMenu() {
    const msg =
        '¡Hola Sabormap! 👋\n\n' +
        'Quisiera contratar un plan para mi local. ¿Me ayudan a elegir?\n\n' +
        '*Mi negocio es:* (bar / restaurante / heladería / cafetería / otro)\n' +
        '*Nombre del local:* \n' +
        '*Zona de La Habana:* \n' +
        '*Presupuesto aproximado:* (hasta $10/mes · $50-$150 · $150+ USD)\n\n' +
        '*Plan Sabormap (mapa):*\n' +
        '1️⃣ Básico — Gratis CUP\n' +
        '2️⃣ Pro — 6700 CUP/mes (~$10 USD) ⭐\n' +
        '3️⃣ Destacado — 10000 CUP/mes (~$15 USD)\n\n' +
        '*Plan Imperium (web propia):*\n' +
        '4️⃣ Básico — $80 USD (pago único)\n' +
        '5️⃣ Intermedio — $150 USD (pago único) ⭐\n' +
        '6️⃣ Premium — $250 USD (pago único)\n\n' +
        '*Combo:*\n' +
        '7️⃣ Presencia Total — $175 USD 🚀\n\n' +
        'Completa tus datos arriba y escribe el número del plan que te interesa 👇';
    const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
    window.open(url, '_blank');
}

// Variables para el mapa con soporte de tema
let mapTileLayer = null;

function updateMapTiles(theme) {
    if (!map) return;
    if (mapTileLayer) map.removeLayer(mapTileLayer);
    const tileVariant = theme === 'dark' ? 'dark_all' : 'light_all';
    mapTileLayer = L.tileLayer(`https://{s}.basemaps.cartocdn.com/${tileVariant}/{z}/{x}/{y}{r}.png`, {
        attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19
    }).addTo(map);
}

// Mostrar toggle movil en pantallas chicas
function handleMobileThemeToggle() {
    const mobileToggle = document.getElementById('mobileThemeToggle');
    if (mobileToggle) {
        mobileToggle.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
    }
}
// [v2.0.30/P-UUX] resize sin debounce disparaba decenas de getElementById+style
//   por segundo durante el arrastre. rAF coalesce: a lo sumo 1 ejecución/frame.
let _mttRaf = 0;
window.addEventListener('resize', () => {
    if (_mttRaf) cancelAnimationFrame(_mttRaf);
    _mttRaf = requestAnimationFrame(() => { _mttRaf = 0; handleMobileThemeToggle(); });
});
document.addEventListener('DOMContentLoaded', handleMobileThemeToggle);

// ★ staticPlaces pasa a ser `let` para poder agregar los locales que vengan de Supabase.
/* staticPlaces se carga ahora desde places.js (ver <script src="places.js"> arriba).
   Antes contenía 203 locales incrustados en este mismo archivo. */
if (typeof staticPlaces === 'undefined') {
    console.error('places.js no se cargó: staticPlaces no está definido.');
    window.staticPlaces = [];
}

/* [T-01] Normalización defensiva de categorías: si un typo vuelve a colarse
   (p. ej. "restaurant"), los filtros no se rompen y queda aviso en consola. */
const CATEGORY_ALIAS = { restaurant: 'restaurante' };
function normCat(c) { return CATEGORY_ALIAS[c] || c; }
const _warnedCats = new Set();
function catMetaFor(p) {
    if (!catMeta[p.category] && !_warnedCats.has(p.category)) {
        _warnedCats.add(p.category);
        console.warn('[Sabormap] Categoría desconocida, usando fallback:', p.category, '(id', p.id + ')');
    }
    return catMeta[p.category] || catMeta.bar;
}
if (typeof staticPlaces !== 'undefined') {
    staticPlaces.forEach(p => { p.category = normCat(p.category); });
}



const DAY_MAP = {
    'lun':1, 'lunes':1,
    'mar':2, 'martes':2,
    'mie':3, 'mié':3, 'miercoles':3, 'miércoles':3,
    'jue':4, 'jueves':4,
    'vie':5, 'viernes':5,
    'sab':6, 'sáb':6, 'sabado':6, 'sábado':6,
    'dom':0, 'domingo':0
};

// Convierte "12:00pm", "08:00am", "22:00pm", "00:00am" → minutos desde 00:00
function parseTimeToMinutes(raw) {
    if (!raw) return null;
    const m = String(raw).trim().toLowerCase().match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/);
    if (!m) return null;
    let h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    const suffix = m[3];
    if (h === 0) return 0;                  // 00:00 → medianoche
    if (h > 12) return h * 60 + min;        // 13–23, ignorar am/pm
    if (suffix === 'pm') return (h === 12 ? 12 : h + 12) * 60 + min;
    // am o sin sufijo
    return (h === 12 ? 0 : h) * 60 + min;
}

// Devuelve lista de días (0=Dom … 6=Sáb) a partir de "Lun-Dom", "Dom-Jue", "Vie"
function parseDayRange(raw) {
    if (!raw) return null;
    const cleaned = raw.trim().toLowerCase();
    if (DAY_MAP[cleaned] !== undefined) return [DAY_MAP[cleaned]];
    const parts = cleaned.split(/[-–]/).map(s => s.trim());
    if (parts.length !== 2) return null;
    const start = DAY_MAP[parts[0]];
    const end = DAY_MAP[parts[1]];
    if (start === undefined || end === undefined) return null;
    const days = [];
    if (start === end) days.push(start);
    else if (start < end) { for (let d = start; d <= end; d++) days.push(d); }
    else { for (let d = start; d <= 6; d++) days.push(d); for (let d = 0; d <= end; d++) days.push(d); }
    return days;
}

// Parsea el string completo de `hours` → [{ days:[0..6], open, close }]
function parseHours(hoursStr) {
    if (!hoursStr) return [];
    const cleaned = String(hoursStr)
        .replace(/⏰️|⏰|🕐|🕒|⏰/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    if (!cleaned) return [];
    // Detecta TODOS los rangos horarios del string (no solo el primero),
    // para soportar formatos con varias franjas separadas por coma o por
    // otro rango de días, p.ej. "Lun-Jue: 10:00am-23:00pm Vie-Dom: 10:00am-00:00am"
    const timeRegex = /(\d{1,2}:\d{2}\s*[ap]m)\s*[-–]\s*(\d{1,2}:\d{2}\s*[ap]m)/gi;
    const timeMatches = [...cleaned.matchAll(timeRegex)];
    if (!timeMatches.length) return [];
    const result = [];
    for (let i = 0; i < timeMatches.length; i++) {
        const tm = timeMatches[i];
        const open = parseTimeToMinutes(tm[1]);
        const close = parseTimeToMinutes(tm[2]);
        if (open === null || close === null) continue;
        // Toma el texto entre el rango horario anterior y el actual → rango de días
        const prevEnd = i > 0 ? timeMatches[i-1].index + timeMatches[i-1][0].length : 0;
        const between = cleaned.substring(prevEnd, tm.index).trim().replace(/[:：]\s*$/, '').trim();
        let days;
        if (!between) {
            days = [0,1,2,3,4,5,6];
        } else {
            const tokens = between.split(/\s+/);
            const lastToken = tokens[tokens.length - 1];
            const dayRange = parseDayRange(lastToken);
            days = dayRange || [0,1,2,3,4,5,6];
        }
        result.push({ days, open, close });
    }
    return result;
}

// Devuelve true si el local está abierto AHORA según su campo `hours`
function isPlaceOpenNow(p, now) {
    const t = now instanceof Date ? now : new Date();
    const schedule = parseHours(p.hours);
    if (!schedule.length) return !!p.isOpen; // fallback al valor manual si no hay horas
    const day = t.getDay();                  // 0=Dom … 6=Sáb
    const minutes = t.getHours() * 60 + t.getMinutes();
    // 1) ¿Hoy tiene franja activa?
    for (const slot of schedule) {
        if (!slot.days.includes(day)) continue;
        if (slot.close <= slot.open) {       // franja que cruza medianoche
            if (minutes >= slot.open || minutes < slot.close) return true;
        } else {
            if (minutes >= slot.open && minutes < slot.close) return true;
        }
    }
    // 2) ¿Pertenece al cierre tardío del día anterior? (ej. abierto hasta la 1am)
    const prevDay = (day + 6) % 7;
    for (const slot of schedule) {
        if (!slot.days.includes(prevDay)) continue;
        if (slot.close <= slot.open && minutes < slot.close) return true;
    }
    return false;
}

// Formatea minutos (0..1439) como "HH:MM" en formato 24h o 12h según preferencia
function formatMinutes(totalMin) {
    let m = ((totalMin % 1440) + 1440) % 1440;
    const h24 = Math.floor(m / 60);
    const mm = String(m % 60).padStart(2, '0');
    return `${String(h24).padStart(2, '0')}:${mm}`;
}

/* Devuelve { open:bool, label:"Cierra a las HH:MM" | "Abre a las HH:MM" | "" }
   - Si está abierto → calcula a qué hora cierra (hoy o cruzando medianoche)
   - Si está cerrado  → calcula a qué hora abre (hoy, o el próximo día con horario) */
function getPlaceStatus(p, now) {
    const t = now instanceof Date ? now : new Date();
    const schedule = parseHours(p.hours);
    if (!schedule.length) {
        return { open: !!p.isOpen, label: '' };
    }
    const day = t.getDay();
    const minutes = t.getHours() * 60 + t.getMinutes();

    // ¿Está abierto ahora? → buscar el cierre
    for (const slot of schedule) {
        if (!slot.days.includes(day)) continue;
        const open = slot.open;
        const close = slot.close;
        const inSlot = (close <= open)
            ? (minutes >= open || minutes < close)
            : (minutes >= open && minutes < close);
        if (inSlot) {
            // Si close <= open el cierre cae en la madrugada del día siguiente
            return { open: true, label: 'Cierra a las ' + formatMinutes(close) };
        }
    }
    // ¿Está en el cierre tardío del día anterior?
    const prevDay = (day + 6) % 7;
    for (const slot of schedule) {
        if (!slot.days.includes(prevDay)) continue;
        if (slot.close <= slot.open && minutes < slot.close) {
            return { open: true, label: 'Cierra a las ' + formatMinutes(slot.close) };
        }
    }

    // Está cerrado → buscar próxima apertura
    // Itera hasta 8 días hacia adelante para no colgarse en locales sin horario
    const DAY_NAMES = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    for (let offset = 0; offset < 8; offset++) {
        const checkDay = (day + offset) % 7;
        for (const slot of schedule) {
            if (!slot.days.includes(checkDay)) continue;
            // Si offset === 0, solo considerar aperturas futuras (mayor a `minutes`)
            if (offset === 0 && slot.open <= minutes) continue;
            let prefix;
            if (offset === 0) prefix = 'Abre hoy a las ';
            else if (offset === 1) prefix = 'Abre mañana a las ';
            else prefix = 'Abre el ' + DAY_NAMES[checkDay] + ' a las ';
            return { open: false, label: prefix + formatMinutes(slot.open) };
        }
    }
    return { open: false, label: '' };
}

// Helper para render del badge con estado + hora
function renderOpenBadge(p) {
    const st = getPlaceStatus(p);
    const cls = st.open ? 'open' : 'closed';
    const main = st.open ? 'Abierto' : 'Cerrado';
    const sub = st.label ? `<span class="badge-sub">· ${st.label}</span>` : '';
    return `<span class="open-badge ${cls}"><span class="pulse"></span>${main}${sub}</span>`;
}
// [v2.0.30/P-RND] Actualización in-place del badge: NO recrea el nodo .pulse
//   (antes badge.outerHTML = renderOpenBadge(p) reiniciaba la animación `pulse`
//   cada 60s y destrozaba el nodo). Aquí mutamos clase + texto preservando
//   .pulse, con short-circuit si el estado no cambió (la mayoría de los ticks
//   no mutan nada → cero escrituras al DOM).
function updateOpenBadgeInPlace(badge, p) {
    if (!badge) return;
    const st = getPlaceStatus(p);
    const cls = st.open ? 'open' : 'closed';
    const wantSub = st.label ? '· ' + st.label : '';
    const subEl = badge.querySelector('.badge-sub');
    const curSub = subEl ? subEl.textContent : '';
    if (badge.classList.contains(cls) && wantSub === curSub) return; // sin cambios
    if (!badge.classList.contains(cls)) {
        badge.classList.remove('open', 'closed');
        badge.classList.add(cls);
    }
    const pulse = badge.querySelector('.pulse');
    Array.from(badge.childNodes).forEach(n => { if (n !== pulse) n.remove(); });
    badge.appendChild(document.createTextNode(st.open ? 'Abierto' : 'Cerrado'));
    if (st.label) {
        const sub = document.createElement('span');
        sub.className = 'badge-sub';
        sub.textContent = '· ' + st.label;
        badge.appendChild(sub);
    }
    if (!pulse) { // badge legacy sin .pulse: lo creamos al frente
        const pl = document.createElement('span');
        pl.className = 'pulse';
        badge.insertBefore(pl, badge.firstChild);
    }
}
// [v2.0.30/P-RND] Cuerpo del refresco de badges extraído a función para
//   reutilizarlo desde el intervalo de 60s Y desde visibilitychange. Usa un
//   Map id→place (O(n+m)) en vez de staticPlaces.find por tarjeta (O(n×m)).
function refreshOpenBadgesNow() {
    if (document.hidden) return;
    if (currentView === 'grid') {
        const byId = new Map();
        for (const pl of staticPlaces) byId.set(String(pl.id), pl);
        document.querySelectorAll('.place-card').forEach(card => {
            const p = byId.get(card.dataset.placeId);
            if (!p) return;
            updateOpenBadgeInPlace(card.querySelector('.open-badge'), p);
        });
    }
    if (currentModalPlace) {
        document.querySelectorAll('.drawer-meta-row .open-badge')
            .forEach(b => updateOpenBadgeInPlace(b, currentModalPlace));
    }
}

/* ═══════════════════════════════════════════
   ESTADO GLOBAL
   ═══════════════════════════════════════════ */
let currentFilter = 'todos';
let currentBarrio = 'todos';
let openNowOnly = false;
let searchQuery = '';
let activeCollection = null;
let currentView = 'grid';
let map = null;
let markers = [];
let swiperInstance = null;
let currentModalPlace = null;
let legalReturnPlace = null; // [U-11] lugar a restaurar tras cerrar el modal legal

/* ═══════════════════════════════════════════
   COLECCIONES
   ═══════════════════════════════════════════ */
// Colecciones dinamicas desde Supabase (fallback estatico si no hay conexion)
let collections = [
    { id:'cena-romantica',      title:'Cena Romantica',     desc:'Candlelight, vino y esa mesa esquinada',     icon:'fa-heart',          color:'#ec4899', bg:'rgba(236,72,153,0.12)', border:'rgba(236,72,153,0.2)', staticIds:[1,2,7], dbIds:[] },
    { id:'mejores-cocteles',    title:'Mejores Cocteles',   desc:'Donde el ron se vuelve arte',                 icon:'fa-martini-glass',  color:'#8b5cf6', bg:'rgba(139,92,246,0.12)', border:'rgba(139,92,246,0.2)', staticIds:[7,8,10], dbIds:[] },
    { id:'familiar',            title:'En Familia',          desc:'Menús para todos y espacio para los peques',  icon:'fa-people-group',   color:'#06b6d4', bg:'rgba(6,182,212,0.12)',  border:'rgba(6,182,212,0.2)', staticIds:[1,4,6], dbIds:[] },
    { id:'mariscos-frescos',    title:'Mariscos Frescos',    desc:'Directo del mar al plato',                    icon:'fa-fish',           color:'#10b981', bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.2)', staticIds:[4,8], dbIds:[] },
    { id:'helados-artesanales', title:'Helados Artesanales', desc:'Bochas que valen la espera',                  icon:'fa-ice-cream',      color:'#f472b6', bg:'rgba(244,114,182,0.12)',border:'rgba(244,114,182,0.2)', staticIds:[3,6,9], dbIds:[] },
    { id:'delivery-noche',      title:'Delivery Nocturno',   desc:'Antojos a las 2am, resueltos',                icon:'fa-moon',           color:'#f59e0b', bg:'rgba(245,158,11,0.12)', border:'rgba(245,158,11,0.2)', staticIds:[1,5,9], dbIds:[] },
];

// Cargar colecciones desde Supabase (reemplaza las de fallback si hay datos)
async function loadCollectionsFromSupabase() {
    if (!sb) { console.warn('Supabase no disponible, usando colecciones estaticas'); return; }
    try {
        const { data: cols, error: colErr } = await sb
            .from('collections')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        if (colErr) { console.warn('Error cargando colecciones:', colErr); return; }
        if (!cols || cols.length === 0) { console.info('No hay colecciones en Supabase, usando fallback'); return; }

        const { data: rels, error: relErr } = await sb
            .from('collection_places')
            .select('collection_id, place_id, static_place_id');
        if (relErr) { console.warn('Error cargando relaciones:', relErr); return; }

        const relsByCol = {};
        (rels || []).forEach(r => {
            if (!relsByCol[r.collection_id]) relsByCol[r.collection_id] = { staticIds: [], dbIds: [] };
            if (r.static_place_id != null) relsByCol[r.collection_id].staticIds.push(r.static_place_id);
            if (r.place_id) relsByCol[r.collection_id].dbIds.push(r.place_id);
        });

        collections = cols.map(c => ({
            id:        c.id,
            title:     c.title,
            desc:      c.description,
            icon:      c.icon,
            color:     c.color,
            bg:        c.bg,
            border:    c.border,
            staticIds: (relsByCol[c.id] || {}).staticIds || [],
            dbIds:     (relsByCol[c.id] || {}).dbIds || [],
        }));

        console.info('Colecciones cargadas desde Supabase: ' + collections.length);
        renderCollections();
    } catch (err) {
        console.warn('Error inesperado cargando colecciones:', err);
    }
}

function placeBelongsToCollection(place, col) {
    if (col.staticIds && col.staticIds.includes(Number(place.id))) return true;
    if (col.dbIds && col.dbIds.includes(place.id)) return true;
    if (col.dbIds && col.dbIds.some(id => String(id) === String(place.id))) return true;
    return false;
}

function getCollectionCount(col) {
    return (col.staticIds ? col.staticIds.length : 0) + (col.dbIds ? col.dbIds.length : 0);
}

/* ═══════════════════════════════════════════
   MAPEO DE CATEGORÍAS
   ═══════════════════════════════════════════ */
const catMeta = {
    bar: { label:'Bar / Cafetería', icon:'fa-wine-glass-alt', cssClass:'cat-bar' },
    restaurante: { label:'Restaurante', icon:'fa-utensils', cssClass:'cat-restaurante' },
    heladeria: { label:'Heladería', icon:'fa-ice-cream', cssClass:'cat-heladeria' }
};

/* ═══════════════════════════════════════════
   SUPABASE — Cargar locales publicados desde la base de datos
   ═══════════════════════════════════════════ */
// ★ Mismas credenciales que usa el dashboard ★
const SUPABASE_URL = 'https://cfmqwnfimpfuivqmsxju.supabase.co';
const SUPABASE_KEY = 'sb_publishable_xnipCyojiLP0RsDJKc_KpA_WWi7mj3j';
let sb = null;
try {
    if (window.supabase && window.supabase.createClient) {
        sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
} catch (e) {
    console.warn('Supabase no disponible, usando solo staticPlaces:', e);
}

/* ═══════════════════════════════════════════════════════════════════
   [v2.0.19] FOODIES — Proyecto Supabase SEPARADO para comensales
   ───────────────────────────────────────────────────────────────────
   La home pública ahora maneja DOS clientes Supabase:
     · sb        → proyecto actual (cfmqwnfimpfuivqmsxju): places, collections
     · sbFoodies → proyecto NUEVO (comensales): auth, favorites, reviews

   ⚠️  REEMPLAZAR estas dos constantes con los valores de TU proyecto nuevo
       (los mismos que ponés en foodies-app.js de cuenta.html y mi-sabormap.html).
   ═══════════════════════════════════════════════════════════════════ */
const FOODIES_SUPABASE_URL = 'https://twzxrjvdwvwyzitfqcfn.supabase.co';
const FOODIES_SUPABASE_KEY = 'sb_publishable_AHu_5c3rx8M0Ge03Y6DzuQ_KLnwJ2cP';
let sbFoodies = null;
try {
    if (window.supabase && window.supabase.createClient) {
        sbFoodies = window.supabase.createClient(FOODIES_SUPABASE_URL, FOODIES_SUPABASE_KEY, {
            auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, flowType: 'pkce' }
        });
    }
} catch (e) {
    console.warn('Supabase Foodies no disponible (favoritos y reseñas desactivados):', e);
}
let currentFoodie = null;            // auth.users del proyecto foodies (null si no logueado)
let foodieFavorites = new Set();      // Set de place_id strings ( Strings ) favoritos del usuario
let foodieReviewsCache = new Map();   // place_id → reviews[] (cache de reseñas por local)

/* ═══════════════════════════════════════════════════════════════════
   [v2.0.19] CSS inline para favoritos y reseñas (inyectado una vez)
   ───────────────────────────────────────────────────────────────────
   En lugar de tocar index.html, inyectamos un <style> con las reglas
   nuevas (.fav-btn, .drawer-reviews, .review-form-inline, etc.).
   Respeta el tema activo (data-theme="light"/"dark") vía variables CSS
   que ya existen en index.html.
   ═══════════════════════════════════════════════════════════════════ */
(function injectFoodiesStyles() {
    const style = document.createElement('style');
    style.id = 'sabormap-foodies-styles';
    style.textContent = `
        /* Botón corazón en tarjetas de la home */
        .fav-btn {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            border: none;
            background: rgba(11, 14, 23, 0.65);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            z-index: 3;
            transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
            padding: 0;
        }
        [data-theme="light"] .fav-btn { background: rgba(255, 255, 255, 0.85); color: var(--muted); }
        .fav-btn:hover { transform: scale(1.12); background: rgba(11, 14, 23, 0.85); }
        [data-theme="light"] .fav-btn:hover { background: rgba(255, 255, 255, 0.95); color: var(--accent); }
        .fav-btn.favorited {
            color: #f43f5e;
            background: rgba(255, 255, 255, 0.95);
        }
        [data-theme="light"] .fav-btn.favorited { color: #e11d48; background: rgba(255, 255, 255, 0.98); }
        /* [v2.0.30/UUX] heartPop atado a .favorited se re-disparaba en cada
           re-render de la tarjeta (filtro, paginación, carga de Supabase). Ahora
           es one-shot vía clase .heart-pop, añadida en el onclick solo al AÑADIR
           favorito (no al quitar). toggleFavorite actualiza el botón in-place
           (no re-renderiza la grilla) → la animación se ve completa. */
        .fav-btn.heart-pop i { animation: heartPop 0.35s ease; }
        @keyframes heartPop {
            0%   { transform: scale(1); }
            45%  { transform: scale(1.35); }
            100% { transform: scale(1); }
        }
        .fav-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Botón corazón en el drawer */
        .drawer-fav-btn {
            position: relative; /* [FIX favoritos] quedar encima de los overlays absolutos del banner (::before/::after) para recibir el clic. Antes era estático y ::before se lo comía. */
            z-index: 2;
            width: 40px;
            height: 40px;
            border-radius: 12px;
            border: 1px solid var(--border);
            background: var(--card);
            color: var(--muted);
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 1.05rem;
            transition: all 0.25s;
            padding: 0;
        }
        .drawer-fav-btn:hover { border-color: #f43f5e; color: #f43f5e; }
        .drawer-fav-btn.favorited { background: rgba(244, 63, 94, 0.1); border-color: #f43f5e; color: #f43f5e; }
        .drawer-fav-btn.favorited i { animation: heartPop 0.35s ease; }

        /* Sección de reseñas dentro del drawer */
        .drawer-reviews { padding: 0; margin-bottom: 24px; }
        .drawer-reviews-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 14px;
        }
        .drawer-reviews-title {
            font-size: 1rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .drawer-reviews-title i { color: var(--amber); }
        .drawer-reviews-count {
            font-size: 0.78rem;
            color: var(--muted);
            background: var(--card);
            padding: 3px 10px;
            border-radius: 100px;
            border: 1px solid var(--border);
        }
        .drawer-review-card {
            padding: 14px 16px;
            border: 1px solid var(--border);
            border-radius: 12px;
            margin-bottom: 10px;
            background: var(--card);
        }
        .drawer-review-head {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
        }
        .drawer-review-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: linear-gradient(135deg, #f43f5e, #f97316);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.78rem;
            flex-shrink: 0;
        }
        .drawer-review-author { font-size: 0.86rem; font-weight: 600; }
        .drawer-review-date { font-size: 0.72rem; color: var(--muted); }
        .drawer-review-stars { color: var(--amber); font-size: 0.82rem; letter-spacing: 2px; margin-bottom: 6px; }
        .drawer-review-body {
            font-size: 0.86rem;
            line-height: 1.55;
            color: var(--cream);
            white-space: pre-wrap;
            word-break: break-word;
        }
        .drawer-review-actions {
            display: flex;
            justify-content: flex-end;
            margin-top: 8px;
        }
        .drawer-review-report {
            background: none;
            border: none;
            color: var(--muted);
            font-size: 0.72rem;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 6px;
            transition: color 0.2s;
        }
        .drawer-review-report:hover { color: var(--accent); }

        /* Formulario inline de reseña */
        .review-form-inline {
            margin-top: 16px;
            padding: 16px;
            border: 1px solid var(--border);
            border-radius: 14px;
            background: var(--card);
            display: none;
        }
        .review-form-inline.open { display: block; animation: panelIn 0.3s ease; }
        .review-form-title { font-size: 0.92rem; font-weight: 700; margin-bottom: 12px; }
        .review-star-input { display: flex; gap: 6px; margin-bottom: 12px; }
        .review-star-input i {
            font-size: 1.5rem;
            color: var(--border);
            cursor: pointer;
            transition: color 0.15s;
        }
        .review-star-input i.active { color: var(--amber); }
        .review-star-input i:hover { color: var(--amber); }
        .review-textarea {
            width: 100%;
            background: var(--card-2);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 10px 12px;
            color: var(--cream);
            font-family: inherit;
            font-size: 0.86rem;
            resize: vertical;
            min-height: 90px;
            outline: none;
            transition: border 0.2s;
        }
        .review-textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.1); }
        .review-form-actions {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
            margin-top: 10px;
        }
        .review-btn {
            padding: 9px 16px;
            border-radius: 10px;
            border: 1px solid var(--border);
            background: var(--card);
            color: var(--cream);
            font-family: inherit;
            font-size: 0.84rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        .review-btn:hover { border-color: var(--accent); color: var(--accent); }
        .review-btn-primary {
            background: linear-gradient(135deg, #f43f5e, #f97316);
            color: #fff;
            border: none;
        }
        .review-btn-primary:hover { color: #fff; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(244, 63, 94, 0.25); }

        .review-login-cta {
            text-align: center;
            padding: 16px;
            border: 1px dashed var(--border);
            border-radius: 12px;
            color: var(--muted);
            font-size: 0.84rem;
        }
        .review-login-cta a { color: var(--accent); font-weight: 600; text-decoration: none; }
        .review-login-cta a:hover { text-decoration: underline; }

        .drawer-write-review-btn {
            width: 100%;
            padding: 11px 16px;
            border-radius: 12px;
            border: 1px solid var(--border);
            background: var(--card);
            color: var(--cream);
            font-family: inherit;
            font-size: 0.88rem;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s;
        }
        .drawer-write-review-btn:hover { border-color: var(--accent); color: var(--accent); }
        .drawer-write-review-btn i { color: var(--amber); }
    `;
    document.head.appendChild(style);
})();

// Mapea un local de la DB al formato que usa esta página (mismas propiedades que staticPlaces).
function mapDbPlaceToPublic(p) {
    if (!p) return null;
    // price_range ('$', '$$', '$$$', '$$$$') → priceLevel (1-4)
    const priceLevel = ({ '$':1, '$$':2, '$$$':3, '$$$$':4 })[p.price_range] || 2;
    // ★ FIX: tolerar menu/links como string JSON.
    // Supabase a veces devuelve columnas jsonb como string (según cómo se inserten
    // desde el dashboard o según el driver). Sin este parseo defensivo, la carta
    // del gelato creado desde dashboard.html llegaba como [] y nunca se mostraba
    // el botón "Ver la carta completa".
    let menu = p.menu;
    if (typeof menu === 'string') {
        try {
            menu = JSON.parse(menu);
            console.info('[Sabormap] menu parseado desde string para:', p.name);
        } catch (e) {
            console.warn('[Sabormap] menu inválido en', p.name, ':', e);
            menu = [];
        }
    }
    /* ★ FIX [sold_out-sync v2.0.14] Normalizar sold_out a booleano estricto en
       cada item del menu. openMenuSubModal compara con `=== true`, asi que
       si por algun path de serializacion (cache viejo, RLS, migracion manual)
       llega como string "true", el badge no se renderiza. Es defensivo:
       en condiciones normales Supabase preserva el tipo JSON, pero cuesta 4
       lineas y elimina toda una clase de bugs silentes. */
    if (Array.isArray(menu)) {
        menu = menu.map(sec => ({
            ...sec,
            items: (sec.items || []).map(it => ({
                ...it,
                sold_out: it.sold_out === true || it.sold_out === 'true'
            }))
        }));
    }
    let links = p.links;
    if (typeof links === 'string') {
        try {
            links = JSON.parse(links);
        } catch (e) {
            console.warn('[Sabormap] links inválido en', p.name, ':', e);
            links = [];
        }
    }
    let tags = p.tags;
    if (typeof tags === 'string') {
        try { tags = JSON.parse(tags); } catch (e) { tags = []; }
    }
    let images = p.images;
    if (typeof images === 'string') {
        try { images = JSON.parse(images); } catch (e) { images = []; }
    }
    return {
        id:             p.id,                                   // uuid (string)
        name:           p.name || 'Sin nombre',
        category:       normCat(p.category) || 'restaurante',
        neighborhood:   p.neighborhood || 'Habana Vieja',
        address:        p.address || '',
        rating:         Number(p.rating) || 0,
        priceLevel:     priceLevel,
        tags:           Array.isArray(tags) ? tags : [],
        description:    p.description || '',
        // ★ FIX [v2.0.4]: columnas snake_case en DB → camelCase en frontend.
        //   Antes leía p.mustOrder / p.editorNote (que siempre eran undefined),
        //   por eso el gelato creado desde dashboard.html no mostraba el badge
        //   "Lo que tienes que pedir" ni la nota del editor en la home.
        mustOrder:      p.must_order || p.mustOrder || '',
        editorNote:     p.editor_note || p.editorNote || '',
        gmapsUrl:       p.gmaps_url || p.gmapsUrl || '',   // por si se agrega la columna después
        hours:          p.schedule || p.hours || '',
        phone:          p.phone || '',
        featured:       !!p.featured,
        isOpen:         (typeof p.is_open === 'boolean') ? p.is_open : true,
        lat:            Number(p.lat) || null,
        lng:            Number(p.lng) || null,
        images:         Array.isArray(images) ? images : [],
        menu:           Array.isArray(menu) ? menu : [],
        links:          Array.isArray(links) ? links : [],
        is_pro:         !!p.is_pro, // ★ NUEVO: Para ocultar el banner en locales PRO ★
        // [v2.0.13] delivery_enabled: si true, los botones de delivery/reserva
        //   se muestran activos en la home aunque DELIVERY_BETA_OFF = true.
        //   Lo gestiona el admin desde el dashboard (panel de locales).
        deliveryEnabled: !!p.delivery_enabled,
        _fromDb:        true   // flag por si querés diferenciar en el futuro
    };
}

// Trae de Supabase todos los locales con status='published' y los agrega a staticPlaces
// sin pisar los locales estáticos (mantenemos los originales + los de la DB).
/* ═══════════════════════════════════════════════════════════════════
   [v2.0.21] CACHE LOCAL DE LOCALES PUBLICADOS — offline-first
   ───────────────────────────────────────────────────────────────────
   PROBLEMA: el local creado desde el dashboard y publicado en Supabase
   solo se veía cuando había conexión. Offline, la home solo mostraba
   los 256 staticPlaces y perdía el local 257 (el de Supabase).

   SOLUCIÓN: capas de carga, en este orden:
     1) staticPlaces (places.js)                       — siempre disponible
     2) Cache local (localStorage) de locales publicados — siempre disponible,
        incluso offline. Lo llena loadPlacesFromSupabase() cuando hay red.
     3) Supabase (refresh en vivo)                     — solo con conexión,
        actualiza el cache local para la próxima sesión offline.

   El cache se comparte con el dashboard vía la misma key de localStorage
   ('sabormap_published_places_cache'). Cuando el dashboard publica,
   edita o elimina un local, actualiza este cache directamente → así
   la home lo ve instantáneamente sin esperar al refresh desde Supabase.

   TTL: 7 días. Si el cache es más viejo, aún se usa como fallback
   (offline es offline), pero se marca como "stale" en logs.
   ═══════════════════════════════════════════════════════════════════ */
const PUBLISHED_PLACES_CACHE_KEY = 'sabormap_published_places_cache';
const PUBLISHED_PLACES_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

/* Lee el cache de locales publicados desde localStorage.
   Devuelve [] si no hay cache o está corrupto.
   No elimina el cache aunque esté expirado: offline es offline. */
function loadCachedPublishedPlaces() {
    try {
        const raw = localStorage.getItem(PUBLISHED_PLACES_CACHE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.places)) return [];
        const age = Date.now() - (parsed.savedAt || 0);
        if (age > PUBLISHED_PLACES_CACHE_TTL_MS) {
            console.info('[Cache] Cache de locales publicados expirado hace ' +
                Math.round(age / 86400000) + ' días — usándolo como fallback offline');
        }
        return parsed.places;
    } catch (e) {
        console.warn('[Cache] Error leyendo cache de locales:', e);
        return [];
    }
}

/* Guarda los locales publicados en localStorage.
   Recibe los registros CRUDOS tal como los devuelve Supabase (snake_case).
   El dashboard también llama esta función cuando publica/edita un local. */
function saveCachedPublishedPlaces(dbPlaces) {
    if (!Array.isArray(dbPlaces)) return;
    // Minimalizar: solo campos necesarios para renderizar + metadata.
    // [FIX v2.0.27] `minimal` se declara FUERA del try: si setItem lanza
    // QuotaExceededError, el catch hace purge+reintento reusando `minimal`.
    // Antes estaba dentro del try → inaccesible en el catch (scope léxico)
    // → ReferenceError → el reintento tras purge quedaba roto para siempre.
    const minimal = dbPlaces.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        neighborhood: p.neighborhood,
        address: p.address,
        phone: p.phone,
        description: p.description,
        price_range: p.price_range,
        schedule: p.schedule,
        must_order: p.must_order,
        editor_note: p.editor_note,
        tags: p.tags,
        images: p.images,
        menu: p.menu,
        links: p.links,
        lat: p.lat,
        lng: p.lng,
        plus_code: p.plus_code,
        // ★ [v2.0.18] gmaps_url: opcional, puede no existir la columna en
        //   Supabase todavía. Lo guardamos en el cache para que la home
        //   lo vea offline; si llega como undefined, || '' lo deja en ''.
        gmaps_url: p.gmaps_url || '',
        delivery_enabled: p.delivery_enabled,
        status: p.status
    }));
    try {
        const payload = {
            savedAt: Date.now(),
            version: 1,
            places: minimal
        };
        localStorage.setItem(PUBLISHED_PLACES_CACHE_KEY, JSON.stringify(payload));
        console.info('[Cache] Guardados', minimal.length, 'locales publicados en localStorage');
    } catch (e) {
        // localStorage lleno: intentar limpiar caches viejos y reintentar
        if (e && (e.name === 'QuotaExceededError' || e.code === 22)) {
            console.warn('[Cache] localStorage lleno, purgando otros caches...');
            // No tocamos sabormap_draft_place_* ni sabormap-theme (del usuario)
            // Solo borramos el cache de published places viejo (si existe)
            try { localStorage.removeItem(PUBLISHED_PLACES_CACHE_KEY); } catch (e2) {}
            try {
                localStorage.setItem(PUBLISHED_PLACES_CACHE_KEY, JSON.stringify({
                    savedAt: Date.now(),
                    version: 1,
                    places: minimal
                }));
                console.info('[Cache] Guardados', minimal.length, 'locales tras purge');
                return;
            } catch (e2) {
                console.warn('[Cache] No se pudo guardar ni tras purge:', e2);
            }
        } else {
            console.warn('[Cache] No se pudo guardar cache de locales:', e);
        }
    }
}

/* Carga el cache local de locales publicados y los agrega a staticPlaces
   (sin pisar los estáticos). Devuelve cuántos agregó.
   Se llama al inicio de DOMContentLoaded para que el render inicial
   incluya los locales publicados incluso si estamos offline. */
function loadCachedPlacesIntoStatic() {
    const cached = loadCachedPublishedPlaces();
    if (!cached.length) return 0;

    const existingIds = new Set(staticPlaces.map(p => String(p.id)));
    let added = 0;
    cached.forEach(p => {
        if (existingIds.has(String(p.id))) return;
        const mapped = mapDbPlaceToPublic(p);
        if (!mapped) return;
        staticPlaces.push(mapped);
        existingIds.add(String(mapped.id));
        added++;
    });
    if (added > 0) {
        console.info(`[Cache] ${added} locales publicados cargados desde cache local (total: ${staticPlaces.length})`);
    }
    return added;
}

/* Función pública: el dashboard la llama vía localStorage para invalidar
   el cache cuando se publica/edita/elimina un local. Aquí solo escuchamos
   cambios en la key y refrescamos staticPlaces.
   También escuchamos el evento 'storage' que se dispara en otras pestañas
   del mismo origen → así si el dashboard publica en una pestaña, la home
   abierta en otra pestaña se refresca sola. */
window.addEventListener('storage', (e) => {
    if (e.key !== PUBLISHED_PLACES_CACHE_KEY) return;
    console.info('[Cache] Cambio detectado en cache de locales publicados, refrescando...');
    refreshStaticPlacesFromCache();
});

/* Reemplaza los locales de cache (los que tienen _fromDb=true) por la
   versión más reciente del cache, sin tocar los staticPlaces originales. */
function refreshStaticPlacesFromCache() {
    // Quitar los locales que vinieron del cache/Supabase (marcados con _fromDb)
    const before = staticPlaces.length;
    staticPlaces = staticPlaces.filter(p => !p._fromDb);
    const removed = before - staticPlaces.length;

    // Volver a cargar el cache
    const added = loadCachedPlacesIntoStatic();

    if (removed > 0 || added > 0) {
        if (typeof populateBarrios === 'function') populateBarrios();
        if (typeof renderPlaces === 'function') renderPlaces();
        if (typeof updateStatNumbers === 'function') updateStatNumbers();
        console.info(`[Cache] Refresco: -${removed} +${added} locales`);
    }
}

/* Exportar al window para que el dashboard pueda invalidar via postMessage
   si está en otro scope (raro pero posible). */
window.sabormapInvalidatePublishedCache = function() {
    refreshStaticPlacesFromCache();
};

// [v2.0.30/RES] Reintento con backoff exponencial (300ms, 900ms, 2.7s): la red
//   intermitente y los resets de conexión de Supabase fallaban en el primer
//   intento y dejaban placesLoadPromise resuelto a undefined para siempre. Ahora
//   se reintenta hasta 3 veces y, solo si TODO falla Y no hay locales estáticos,
//   se avisa al usuario. Devuelve true (éxito/empty-válido) / false (falló).
async function loadPlacesFromSupabase() {
    if (!sb) { console.warn('Supabase client no inicializado'); return false; }
    const MAX_ATTEMPTS = 3;
    let lastErr = null;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            const { data, error } = await sb
                .from('places')
                .select('*')
                .eq('status', 'published')
                .order('created_at', { ascending: false });

            if (error) throw error; // reintentable (PostgREST transitorio)

            if (!Array.isArray(data) || data.length === 0) {
                console.info('No hay locales publicados en Supabase todavía');
                // Cache vacío: sobrescribe cualquier cache con locales ya borrados.
                saveCachedPublishedPlaces([]);
                return true;
            }

            // ★ [v2.0.21] Guardar en localStorage para que la próxima sesión
            //   offline tenga estos locales disponibles sin conexión.
            saveCachedPublishedPlaces(data);

            // IDs que ya existen (los estáticos tienen id numérico 1..N, los de DB son uuid strings)
            const existingIds = new Set(staticPlaces.map(p => String(p.id)));
            let added = 0;
            data.forEach(p => {
                const mapped = mapDbPlaceToPublic(p);
                if (!mapped) return;
                if (existingIds.has(String(mapped.id))) return;   // evita duplicados
                staticPlaces.push(mapped);
                existingIds.add(String(mapped.id));
                added++;
            });
            console.info(`Supabase: ${added} locales publicados cargados (intento ${attempt}, total: ${staticPlaces.length})`);

            // Re-poblar el dropdown de barrios y volver a renderizar la grilla
            if (typeof populateBarrios === 'function') populateBarrios();
            if (typeof renderPlaces  === 'function') renderPlaces();
            // ★ FIX [v2.0.7]: NO volver a llamar animateStats() aquí. Antes, esta
            //   llamada recreaba el IntersectionObserver y re-animaba el contador
            //   desde 0 hasta el nuevo total, provocando el salto visible
            //   "256 → 257" cuando llegaba el local de Supabase. Ahora usamos
            //   updateStatNumbers() que solo ajusta el valor final sin animar.
            if (added > 0 && typeof updateStatNumbers === 'function') {
                updateStatNumbers();
            }
            return true;
        } catch (err) {
            lastErr = err;
            console.warn(`[places] intento ${attempt}/${MAX_ATTEMPTS} falló:`, err);
            if (attempt < MAX_ATTEMPTS) {
                await new Promise(r => setTimeout(r, 300 * Math.pow(3, attempt - 1))); // 300, 900, (2700)
            }
        }
    }
    // Todos los intentos fallaron: NO tocamos el cache (seguimos con el último
    // válido) ni los locales estáticos. Avisamos al usuario solo si no hay NADA.
    console.warn('Error cargando locales desde Supabase tras reintentos:', lastErr);
    if (staticPlaces.length === 0) showToast('No se pudieron cargar los locales. Revisa tu conexión.');
    return false;
}

/* ★ FIX [v2.0.12]: actualiza los contadores de stats SIN re-animar.
   Se llama cuando loadPlacesFromSupabase() agrega locales nuevos,
   para que el contador pase de 256 a 257 de forma suave (o sin moverse
   si ya estaba en su valor final).
   ★ FIX [v2.0.12bis — BUG REAL 256 vs 257]: antes, si Supabase
   respondía a MITAD de la animación del contador, updateStatNumbers
   ponía textContent=257 pero el setInterval de la animación seguía
   corriendo con su target capturado (256) y sobreescribía textContent
   de vuelta a 256. Resultado: el contador se quedaba en 256 aunque
   staticPlaces tuviera 257. Ahora cancelamos cualquier intervalo
   activo antes de snappear al nuevo valor. */
const _activeStatIntervals = new Set();
function _clearAllStatIntervals() {
    _activeStatIntervals.forEach(id => clearInterval(id));
    _activeStatIntervals.clear();
}
function updateStatNumbers() {
    const totalLocales = staticPlaces.length;
    const municipios = new Set(staticPlaces.map(p => p.neighborhood));
    const totalMunicipios = municipios.size;

    // ★ FIX: cancelar cualquier animación en curso para que no
    // sobreescriba el textContent que vamos a setear aquí.
    _clearAllStatIntervals();

    const statLocales = document.getElementById('statLocales');
    const statMunicipios = document.getElementById('statMunicipios');
    if (statLocales) {
        statLocales.dataset.target = totalLocales;
        // Solo actualizar textContent si la animación ya terminó o si el
        // nuevo valor es mayor (evita retroceder el contador en carrera).
        const current = parseInt(statLocales.textContent, 10) || 0;
        if (current <= totalLocales) statLocales.textContent = totalLocales;
    }
    if (statMunicipios) {
        statMunicipios.dataset.target = totalMunicipios;
        const current = parseInt(statMunicipios.textContent, 10) || 0;
        if (current <= totalMunicipios) statMunicipios.textContent = totalMunicipios;
    }
}

/* ═══════════════════════════════════════════
   INICIALIZACIÓN
   ═══════════════════════════════════════════ */
/* ───────────────────────────────────────────────────────────────────
   Deep-link ?place=<id> — abre la ficha del local al cargar la home.
   Lo usa mi-sabormap.html (botón "Ver en mapa" en Favoritos): al volver
   a la home con ?place=<id>, se abre automáticamente el drawer del local.
   Funciona con locales estáticos (disponibles en el primer render) y con
   locales de Supabase (se awaita placesLoadPromise si no se hallan de inmediato).
   ─────────────────────────────────────────────────────────────────── */
let placesLoadPromise = null; // captura la carga inicial de Supabase para poder awaitarla

function cleanPlaceParam() {
    try {
        const u = new URL(window.location.href);
        u.searchParams.delete('place');
        history.replaceState(null, '', u.pathname + u.search + u.hash);
    } catch (e) { /* ignore */ }
}

async function openPlaceFromUrl() {
    let rawId = null;
    try { rawId = new URLSearchParams(window.location.search).get('place'); }
    catch (e) { return; }
    if (!rawId) return;
    const placeId = String(rawId).trim();
    if (!placeId) return;

    const findPlace = () => staticPlaces.find(pl => String(pl.id) === placeId);

    // 1) Intento inmediato: local estático o ya en cache local.
    if (findPlace()) { openModal(placeId); cleanPlaceParam(); return; }

    // 2) No hallado: podría ser un local de Supabase aún no cargado.
    //    Esperar a que loadPlacesFromSupabase() termine y reintentar.
    if (placesLoadPromise) {
        try { await placesLoadPromise; } catch (e) { /* ya logueado dentro */ }
    }
    if (findPlace()) {
        openModal(placeId);
    } else {
        // [v2.0.30/RES] Antes fallaba en silencio: ?place=<id-borrado-o-inexistente>
        //   limpiaba la URL y no pasaba nada. Ahora se avisa al usuario.
        showToast('No encontramos ese local');
    }
    // Limpiar ?place= tanto si se abrió como si no (una recarga no reabre el modal).
    cleanPlaceParam();
}

document.addEventListener('DOMContentLoaded', () => {
    renderCollections();
    renderPlaces();
    populateBarrios();
    // [A-03] Estado inicial: overlay y drawer fuera del árbol de accesibilidad
    const _mo = document.getElementById('modalOverlay');
    if (_mo) _mo.setAttribute('aria-hidden', 'true');
    const _md = document.getElementById('modalDrawer');
    if (_md) { _md.setAttribute('aria-hidden', 'true'); _md.setAttribute('inert', ''); }
    closeMobileMenu();
    setupSearch();
    setupScrollReveal();
    setupScrollBtns();
    animateStats();
    handleMobileThemeToggle();
    // ★ [v2.0.21] CACHE-FIRST: cargar locales publicados desde localStorage
    //   ANTES de intentar Supabase. Así el render inicial ya incluye el
    //   local 257 (creado desde el dashboard) incluso si estamos offline.
    //   Esto sincroniza el contador: offline y online ven los mismos locales.
    loadCachedPlacesIntoStatic();
    // Después de cargar el cache, re-renderizar la grilla con lo que tengamos
    // (puede ser solo staticPlaces, o staticPlaces + cache local).
    if (typeof renderPlaces === 'function') renderPlaces();
    if (typeof populateBarrios === 'function') populateBarrios();
    if (typeof updateStatNumbers === 'function') updateStatNumbers();
    // ★ Cargar locales publicados desde Supabase (async, no bloquea el render
    //   inicial que ya tiene el cache local). Cuando termina, actualiza el
    //   cache y refresca la grilla si hay cambios.
    placesLoadPromise = loadPlacesFromSupabase();
    // ★ Cargar colecciones dinamicas desde Supabase ★
    loadCollectionsFromSupabase();
    // [v2.0.19] Cargar sesión del comensal (proyecto foodies) y sus favoritos
    initFoodieSession();
    // [Deep-link] ?place=<id> → abrir la ficha del local al cargar (botón
    //   "Ver en mapa" de Favoritos en mi-sabormap.html). Fire-and-forget:
    //   si el local no está aún (Supabase), awaita placesLoadPromise dentro.
    openPlaceFromUrl();
    /* [P-01/U-06] Refresca SOLO los badges "Abierto/Cerrado" cada 60 s, sin
       reconstruir la grilla. [v2.0.30/P-RND] updateOpenBadgeInPlace preserva el
       nodo .pulse (antes outerHTML reiniciaba la animación cada minuto) y hace
       short-circuit si el estado no cambió. Índice por id (Map) → O(n+m) en vez
       de O(n×m). [P-09] Se omite si la pestaña está oculta. */
    setInterval(refreshOpenBadgesNow, 60000);
    /* [v2.0.30/RES] Al volver a la pestaña: refresca badges al instante (un
       local pudo abrir/cerrar mientras estuvo oculta) y, si llevaba >5 min
       oculta, re-fetch suave de places para recoger cambios de schedule/hours
       (el tick de 60s solo rederiva el badge del schedule cacheado → stale). */
    let _lastVisibleTS = Date.now();
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { _lastVisibleTS = Date.now(); return; }
        refreshOpenBadgesNow();
        if (Date.now() - _lastVisibleTS > 5 * 60 * 1000) loadPlacesFromSupabase();
    });
});

/* ═══════════════════════════════════════════
   RENDERIZAR COLECCIONES
   ═══════════════════════════════════════════ */
function renderCollections() {
    const container = document.getElementById('collectionsScroll');
    if (!container) return;
    container.innerHTML = collections.map(c => {
        const _id = escAttr(c.id), _title = escapeHtmlLight(c.title), _desc = escapeHtmlLight(c.desc);
        const _icon = escAttr(c.icon), _color = escAttr(c.color), _bg = escAttr(c.bg), _border = escAttr(c.border);
        return `
        <div class="collection-card" style="--collection-color:${_color};--collection-bg:${_bg};--collection-border:${_border};"
             role="button" tabindex="0" aria-pressed="false"
             aria-label="Colección ${_title}. ${_desc}. ${getCollectionCount(c)} lugares"
             data-cid="${_id}"
             onclick="toggleCollection(this.dataset.cid)"
             onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleCollection(this.dataset.cid)}"
             id="col-${_id}">
            <div class="collection-icon"><i class="fas ${_icon}" aria-hidden="true"></i></div>
            <div class="collection-title">${_title}</div>
            <div class="collection-desc">${_desc}</div>
            <div class="collection-count"><i class="fas fa-store" aria-hidden="true"></i> ${getCollectionCount(c)} lugares</div>
        </div>`;
    }).join('');
}

function toggleCollection(id) {
    if (activeCollection === id) { clearCollection(); return; }
    activeCollection = id;
    document.querySelectorAll('.collection-card').forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
    });
    const card = document.getElementById('col-' + id);
    card.classList.add('active');
    card.setAttribute('aria-pressed', 'true');
    const col = collections.find(c => c.id === id);
    document.getElementById('activeCollectionBar').classList.add('show');
    document.getElementById('activeCollectionName').textContent = col.title;
    applyFilters();
}

function clearCollection() {
    activeCollection = null;
    document.querySelectorAll('.collection-card').forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
    });
    document.getElementById('activeCollectionBar').classList.remove('show');
    applyFilters();
}

/* ═══════════════════════════════════════════
   RENDERIZAR LUGARES
   ═══════════════════════════════════════════ */
// [v2.0.30/P-MEMO] Memo por turno del event loop: renderPlaces + renderMapMarkers
//   (×2) llamaban a getFilteredPlaces hasta 3 veces por acción de usuario, cada
//   una re-filtrando staticPlaces (spread + chain de .filter + buildSearchBlob
//   por lugar). Ahora el resultado se cachea con clave de filtros y se invalida
//   en el próximo microtask (queueMicrotask) → nunca stale entre turnos, pero
//   elimina la recomputación redundante dentro del mismo turno.
let _filteredCache = { key: null, result: null, scheduled: false };
function getFilteredPlaces() {
    const key = `${staticPlaces.length}|${currentFilter}|${currentBarrio}|${openNowOnly}|${searchQuery}|${activeCollection || ''}`;
    if (_filteredCache.key === key) return _filteredCache.result;
    let places = [...staticPlaces];
    if (activeCollection) {
        const col = collections.find(c => c.id === activeCollection);
        if (col) {
            places = places.filter(p => placeBelongsToCollection(p, col));
        }
    }
    if (currentFilter !== 'todos') places = places.filter(p => p.category === currentFilter);
    if (currentBarrio !== 'todos') places = places.filter(p => p.neighborhood === currentBarrio);
    if (openNowOnly) places = places.filter(p => isPlaceOpenNow(p));
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        // [U-04] La búsqueda cubre también platos, cartas, mustOrder y descripción
        places = places.filter(p => buildSearchBlob(p).includes(q));
    }
    _filteredCache.key = key;
    _filteredCache.result = places;
    if (!_filteredCache.scheduled) {
        _filteredCache.scheduled = true;
        queueMicrotask(() => { _filteredCache.key = null; _filteredCache.result = null; _filteredCache.scheduled = false; });
    }
    return places;
}

/* [U-04] Índice de búsqueda por local (memoizado con WeakMap: sin fugas ni
   recálculos en cada tecleo). Indexa nombre, barrio, categoría, tags,
   descripción, mustOrder y todos los platos de la carta. */
const searchIndex = new WeakMap();
function buildSearchBlob(p) {
    if (searchIndex.has(p)) return searchIndex.get(p);
    const parts = [p.name, p.neighborhood, p.category, (p.tags || []).join(' '),
                   p.description || '', p.mustOrder || ''];
    if (Array.isArray(p.menu)) {
        p.menu.forEach(sec => {
            parts.push(sec.category || '');
            (sec.items || []).forEach(it => { parts.push(it.name || ''); parts.push(it.desc || ''); });
        });
    }
    const blob = parts.join(' ').toLowerCase();
    searchIndex.set(p, blob);
    return blob;
}

/* [P-02/U-10] Paginación incremental: se pintan 60 tarjetas y el resto se
   añade por lotes con un IntersectionObserver (el "contador" de resultados
   sigue mostrando el total filtrado). Evita construir 258 nodos de golpe. */
const PAGE_SIZE = 60;
let renderedCount = 0;
let gridSentinelObserver = null;

function cardHTML(p) {
    { // cuerpo de la antigua función .map(p => { … })
        const meta = catMetaFor(p);
        const priceDots = Array.from({length:4}, (_,i) =>
            `<span class="price-dot ${i < p.priceLevel ? 'filled' : 'empty'}"></span>`
        ).join('');

        // [v2.0.19] Botón corazón: se rellena si el comensal logueado tiene este place en favoritos.
        const pid = String(p.id);
        const isFav = foodieFavorites.has(pid);
        const favBtnHTML = `<button class="fav-btn ${isFav ? 'favorited' : ''}" data-place-id="${escAttr(pid)}" onclick="event.stopPropagation();if(!this.classList.contains('favorited')){this.classList.add('heart-pop');setTimeout(()=>this.classList.remove('heart-pop'),360);}toggleFavorite('${escAttr(pid)}')" aria-label="${isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}" aria-pressed="${isFav ? 'true' : 'false'}"><i class="${isFav ? 'fas' : 'far'} fa-heart"></i></button>`;

        return `
        <article class="place-card${p.featured ? ' featured' : ''}" data-place-id="${escAttr(p.id)}" onclick="openModal(this.dataset.placeId)" tabindex="0"
                 onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openModal(this.dataset.placeId)}" role="button" aria-label="Ver ${escAttr(p.name)}">
            <div class="card-img-wrapper">
                <span class="cat-badge ${meta.cssClass}"><i class="fas ${meta.icon}" style="margin-right:4px;font-size:0.6rem;"></i>${meta.label}</span>
                ${favBtnHTML}
                ${p.images[0] ? `<img class="card-img" src="${escAttr(p.images[0])}" alt="${escAttr(p.name)}" width="400" height="300" loading="lazy" decoding="async">` :
                `<div class="card-img" style="background:linear-gradient(135deg, var(--card), var(--card-hover));display:flex;align-items:center;justify-content:center;"><i class="fas ${meta.icon}" style="font-size:2.5rem;color:var(--border);"></i></div>`}
            </div>
            <div style="padding:20px;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px;">
                        <h3 style="font-weight:700;font-size:1.1rem;line-height:1.3;">${escapeHtmlLight(p.name)}</h3>
                        ${renderOpenBadge(p)}
                    </div>
                    <div style="display:flex;align-items:center;gap:10px;font-size:0.82rem;color:var(--muted);margin-bottom:8px;">
                        <span><i class="fas fa-map-pin" style="margin-right:4px;font-size:0.7rem;"></i>${escapeHtmlLight(p.neighborhood)}</span>
                        <span style="display:flex;align-items:center;gap:3px;"><i class="fas fa-star rating-star" style="font-size:0.7rem;"></i>${p.rating}</span>
                        <span style="display:flex;align-items:center;gap:2px;">${priceDots}</span>
                    </div>
                    <p style="font-size:0.82rem;color:var(--muted);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${escapeHtmlLight(p.description)}</p>
                    ${p.mustOrder ? `<div class="must-order-badge"><i class="fas fa-fire"></i>${escapeHtmlLight(p.mustOrder)}</div>` : ''}
                </div>
        </article>`;
    }
}

function renderPlaces() {
    const places = getFilteredPlaces();
    const grid = document.getElementById('placesGrid');
    const noResults = document.getElementById('noResults');
    document.getElementById('resultCount').textContent = `${places.length} resultado${places.length !== 1 ? 's' : ''}`;

    renderedCount = 0;
    grid.innerHTML = '';
    if (gridSentinelObserver) { gridSentinelObserver.disconnect(); gridSentinelObserver = null; }

    if (places.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    noResults.style.display = 'none';

    const sentinel = document.createElement('div');
    sentinel.id = 'gridSentinel';
    sentinel.setAttribute('aria-hidden', 'true');
    grid.appendChild(sentinel);

    const appendPage = () => {
        const chunk = places.slice(renderedCount, renderedCount + PAGE_SIZE);
        const frag = document.createElement('div');
        frag.innerHTML = chunk.map(cardHTML).join('');
        Array.from(frag.children).forEach(el => grid.insertBefore(el, sentinel));
        renderedCount += chunk.length;
        if (renderedCount >= places.length) sentinel.style.display = 'none';
    };
    appendPage();

    if (places.length > renderedCount && 'IntersectionObserver' in window) {
        gridSentinelObserver = new IntersectionObserver((entries) => {
            if (entries.some(e => e.isIntersecting)) appendPage();
        }, { rootMargin: '600px' });
        gridSentinelObserver.observe(sentinel);
    } else {
        while (renderedCount < places.length) appendPage();
    }

    if (currentView === 'map') renderMapMarkers(places);
}

/* ═══════════════════════════════════════════
   FILTROS
   ═══════════════════════════════════════════ */
function setFilter(filter, btn) {
    currentFilter = filter;
    document.querySelectorAll('#filterContainer .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
}
function toggleOpenNow() {
    openNowOnly = !openNowOnly;
    document.getElementById('openNowBtn').classList.toggle('active', openNowOnly);
    applyFilters();
}
function applyFilters() { renderPlaces(); }
function navigateToFilter(cat) {
    const btn = document.querySelector(`#filterContainer .filter-btn[data-filter="${cat}"]`);
    if (btn) setFilter(cat, btn);
}

function populateBarrios() {
    // [T-03] Añade solo los barrios que faltan: recargar desde Supabase ya no
    // duplica las opciones, y se conserva la selección vigente del usuario.
    const sel = document.getElementById('barrioFilter');
    if (!sel) return;
    const prev = sel.value;
    const existing = new Set(Array.from(sel.options).map(o => o.value));
    const barrios = [...new Set(staticPlaces.map(p => p.neighborhood))].sort();
    barrios.forEach(b => {
        if (existing.has(b)) return;
        const o = document.createElement('option');
        o.value = b; o.textContent = b;
        sel.appendChild(o);
    });
    if (prev && Array.from(sel.options).some(o => o.value === prev)) sel.value = prev;
}

function setupSearch() {
    const input = document.getElementById('searchInput');
    let debounce;
    input.addEventListener('input', () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => { searchQuery = input.value.trim(); applyFilters(); }, 250);
    });
}

/* ═══════════════════════════════════════════
   VISTA MAPA
   ═══════════════════════════════════════════ */

/* [P-03/U-01] Leaflet se carga bajo demanda: solo cuando alguien activa la
   vista mapa por primera vez. La vista grilla ya no descarga ~200 KB de
   JS+CSS de un feature que hoy está deshabilitado. */
let _leafletPromise = null;
function ensureLeaflet() {
    if (window.L) return Promise.resolve();
    if (_leafletPromise) return _leafletPromise;
    _leafletPromise = new Promise((resolve, reject) => {
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        css.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        css.crossOrigin = '';
        document.head.appendChild(css);
        const js = document.createElement('script');
        js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        js.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        js.crossOrigin = '';
        js.onload = () => resolve();
        js.onerror = () => reject(new Error('Leaflet no disponible'));
        document.head.appendChild(js);
    }).catch(err => { _leafletPromise = null; throw err; });
    return _leafletPromise;
}

function setView(view) {
    currentView = view;
    document.getElementById('gridViewBtn').classList.toggle('active', view === 'grid');
    document.getElementById('mapViewBtn').classList.toggle('active', view === 'map');
    document.getElementById('gridView').style.display = view === 'grid' ? 'block' : 'none';
    document.getElementById('mapView').classList.toggle('visible', view === 'map');
    if (view === 'map') {
        ensureLeaflet()
            .then(() => {
                if (!map) initMap();
                else { setTimeout(() => map.invalidateSize(), 100); renderMapMarkers(getFilteredPlaces()); }
            })
            .catch(() => showToast('El mapa no está disponible ahora'));
    }
}

function initMap() {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const tileVariant = theme === 'dark' ? 'dark_all' : 'light_all';
    map = L.map('mapView').setView([23.136, -82.360], 13);
    mapTileLayer = L.tileLayer(`https://{s}.basemaps.cartocdn.com/${tileVariant}/{z}/{x}/{y}{r}.png`, {
        attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19
    }).addTo(map);
    setTimeout(() => map.invalidateSize(), 200);
    renderMapMarkers(getFilteredPlaces());
}

function renderMapMarkers(places) {
    if (!map) return;
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    places.forEach(p => {
        if (!p.lat || !p.lng) return;
        const meta = catMetaFor(p);
        const markerClass = `marker-${p.category}`;
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-pin ${markerClass}"><i class="fas ${meta.icon}"></i></div>`,
            iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30]
        });
        const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
        marker.bindPopup(`
            <div class="map-popup-content">
                <div class="map-popup-title">${escapeHtmlLight(p.name)}</div>
                <div class="map-popup-info"><i class="fas fa-star" style="color:var(--secondary);font-size:0.7rem;"></i> ${p.rating} &middot; ${escapeHtmlLight(p.neighborhood)}</div>
                <button class="map-popup-btn" data-place-id="${escAttr(p.id)}" onclick="openModal(this.dataset.placeId)">Ver detalle</button>
            </div>
        `);
        markers.push(marker);
    });
}

/* ═══════════════════════════════════════════
   MODAL — DRAWER LATERAL REDISEÑADO
   ═══════════════════════════════════════════ */
/* [A-02] El drawer se comporta como un diálogo modal real: role=dialog,
   aria-modal, foco inicial en cerrar, trampa de Tab y devolución del foco
   al elemento que lo abrió. [A-03] aria-hidden/inert cuando está cerrado. */
let lastFocusedElement = null;

function openDrawerUI() {
    const overlay = document.getElementById('modalOverlay');
    const drawer = document.getElementById('modalDrawer');
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-labelledby', 'drawerPlaceName');
    drawer.removeAttribute('aria-hidden');
    drawer.removeAttribute('inert');
    overlay.removeAttribute('aria-hidden');
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
    lastFocusedElement = document.activeElement;
    setTimeout(() => { const c = drawer.querySelector('.drawer-close-btn'); if (c) c.focus(); }, 80);
}

function closeDrawerUI() {
    const overlay = document.getElementById('modalOverlay');
    const drawer = document.getElementById('modalDrawer');
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    document.getElementById('menuSubModal').classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('inert', '');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedElement && document.contains(lastFocusedElement)) lastFocusedElement.focus();
    lastFocusedElement = null;
}

// Trampa de foco dentro del drawer mientras está abierto
document.addEventListener('keydown', (e) => {
    const drawer = document.getElementById('modalDrawer');
    if (e.key !== 'Tab' || !drawer.classList.contains('open')) return;
    const focusables = drawer.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

/* ★ FIX [v2.0.15] Helper para elegir el prefijo correcto de Font Awesome
   segun si el icono es brand (fab) o solid (fas).
   `fa-whatsapp`, `fa-facebook`, `fa-instagram`, etc. son BRAND icons
   que en FA6 requieren el prefijo `fab` (Font Awesome Brands).
   Si se usa `fas fa-whatsapp`, el navegador busca el glyph en la font
   Solid y no lo encuentra -> icono roto (cuadrado vacio). */
const BRAND_ICONS = new Set([
    'fa-whatsapp', 'fa-facebook', 'fa-facebook-f', 'fa-facebook-messenger',
    'fa-instagram', 'fa-twitter', 'fa-x-twitter', 'fa-youtube',
    'fa-tiktok', 'fa-snapchat', 'fa-telegram', 'fa-linkedin',
    'fa-pinterest', 'fa-github', 'fa-google', 'fa-apple',
    'fa-android', 'fa-windows', 'fa-amazon', 'fa-spotify',
    'fa-uber', 'fa-rappi', 'fa-pedidosya'
]);
function iconPrefix(icon) {
    if (!icon) return 'fas';
    const name = String(icon).trim().toLowerCase();
    // Tambien aceptar variantes fa-brands-* o brands/*
    if (BRAND_ICONS.has(name)) return 'fab';
    return 'fas';
}
window.iconPrefix = iconPrefix;

function openModal(id) {
    // Comparación flexible: los IDs estáticos son numéricos, los de DB son uuid strings.
    // dataset siempre devuelve strings, así que comparamos con String(pl.id).
    const p = staticPlaces.find(pl => String(pl.id) === String(id));
    if (!p) return;
    currentModalPlace = p;

    const meta = catMetaFor(p);
    const priceDots = Array.from({length:4}, (_,i) =>
        `<span class="price-dot ${i < p.priceLevel ? 'filled' : 'empty'}"></span>`
    ).join('');

    const hasImages = p.images.some(img => img && img.trim() !== '');
    const validImages = p.images.filter(img => img && img.trim() !== '');

    let html = '';

    if (hasImages) {
        html += `
        <div class="swiper" id="modalSwiper" style="aspect-ratio:16/10;">
            <div class="swiper-wrapper">
                ${validImages.map(img => `<div class="swiper-slide"><img src="${escAttr(img)}" alt="${escAttr(p.name)}" style="width:100%;height:100%;object-fit:cover;"></div>`).join('')}
            </div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-pagination"></div>
        </div>`;
    }

    html += `
    <div class="drawer-cat-banner ${meta.cssClass}" style="${!hasImages ? 'padding-top:60px;' : ''}">
        <div class="drawer-cat-orb" style="width:180px;height:180px;top:-40px;right:-30px;"></div>
        <div class="drawer-cat-orb" style="width:120px;height:120px;bottom:-20px;left:20px;animation-delay:-4s;"></div>
        <div class="drawer-cat-chip ${meta.cssClass}">
            <i class="fas ${meta.icon}"></i> ${meta.label}
        </div>
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
            <h2 class="drawer-place-name" id="drawerPlaceName" style="flex:1;min-width:0;">${escapeHtmlLight(p.name)}</h2>
            <button class="drawer-fav-btn ${foodieFavorites.has(String(p.id)) ? 'favorited' : ''}" id="drawerFavBtn" data-place-id="${escAttr(String(p.id))}" onclick="toggleFavorite('${escAttr(String(p.id))}', true)" aria-label="${foodieFavorites.has(String(p.id)) ? 'Quitar de favoritos' : 'Guardar en favoritos'}" aria-pressed="${foodieFavorites.has(String(p.id)) ? 'true' : 'false'}">
                <i class="${foodieFavorites.has(String(p.id)) ? 'fas' : 'far'} fa-heart"></i>
            </button>
        </div>
        <div class="drawer-meta-row">
            <span class="drawer-rating-pill"><i class="fas fa-star" aria-hidden="true"></i> ${p.rating}</span>
            <span class="drawer-meta-item">
                ${renderOpenBadge(p)}
            </span>
            <span class="drawer-meta-item" style="display:flex;align-items:center;gap:3px;">${priceDots}</span>
            <span class="drawer-meta-item"><i class="fas fa-map-pin" aria-hidden="true"></i> ${escapeHtmlLight(p.neighborhood)}</span>
        </div>
    </div>`;

    if (p.mustOrder) {
        html += `
        <div class="drawer-section" style="animation-delay:0.1s;">
            <div class="drawer-must-order">
                <div class="drawer-must-order-icon"><i class="fas fa-fire" aria-hidden="true"></i></div>
                <div>
                    <div class="drawer-must-order-label">Lo que tienes que pedir</div>
                    <div class="drawer-must-order-text">${escapeHtmlLight(p.mustOrder)}</div>
                </div>
            </div>
        </div>`;
    }

    if (p.editorNote) {
        html += `
        <div class="drawer-section" style="animation-delay:0.15s;">
            <div class="drawer-editor-note">
                <div class="editor-note-label" style="margin-bottom:6px;"><i class="fas fa-pen-nib" aria-hidden="true" style="font-size:0.6rem;"></i> Nota del editor</div>
                ${escapeHtmlLight(p.editorNote)}
            </div>
        </div>`;
    }

    if (p.description) {
        html += `
        <div class="drawer-section" style="animation-delay:0.2s;">
            <div class="drawer-section-label">Sobre el lugar</div>
            <p style="font-size:0.9rem;color:var(--muted);line-height:1.7;">${escapeHtmlLight(p.description)}</p>
        </div>`;
    }

    if (p.tags && p.tags.length) {
        html += `
        <div class="drawer-section" style="animation-delay:0.25s;">
            <div class="drawer-section-label">Especialidades</div>
            <div class="drawer-tags">
                ${p.tags.map(t => `<span class="drawer-tag">${escapeHtmlLight(t)}</span>`).join('')}
            </div>
        </div>`;
    }

    html += `
    <div class="drawer-section" style="animation-delay:0.3s;">
        <div class="drawer-section-label">Información práctica</div>
        <div class="drawer-info-card">
            ${p.hours ? `
            <div class="drawer-info-row">
                <div class="drawer-info-icon"><i class="fas fa-clock" aria-hidden="true"></i></div>
                <div>
                    <div class="drawer-info-label">Horario</div>
                    <div class="drawer-info-value">${escapeHtmlLight(p.hours)}</div>
                </div>
            </div>` : ''}
            ${p.address ? `
            <div class="drawer-info-row">
                <div class="drawer-info-icon"><i class="fas fa-location-dot" aria-hidden="true"></i></div>
                <div>
                    <div class="drawer-info-label">Dirección</div>
                    <button type="button" class="drawer-info-value copy-address" data-address="${escAttr(p.address)}" onclick="copyText(this.dataset.address);event.stopPropagation();" aria-label="Copiar dirección">${escapeHtmlLight(p.address)} <i class="fas fa-copy" aria-hidden="true" style="font-size:0.7rem;color:var(--muted);margin-left:4px;"></i></button>
                </div>
            </div>` : ''}
            ${p.phone && p.phone !== '#' ? `
            <div class="drawer-info-row">
                <div class="drawer-info-icon"><i class="fas fa-phone" aria-hidden="true"></i></div>
                <div>
                    <div class="drawer-info-label">Teléfono</div>
                    <div class="drawer-info-value"><a href="tel:${escAttr(p.phone)}" style="color:var(--secondary);text-decoration:none;">${escapeHtmlLight(p.phone)}</a></div>
                </div>
            </div>` : ''}
        </div>
    </div>`;

    // ═══════════════════════════════════════════════════════════════════
    // [v2.0.19] SECCIÓN DE RESEÑAS — sprint 1+2
    // Aparece después de "Información práctica" y antes de "Ubicación".
    // Muestra:
    //   · Botón "Escribir reseña" (inline form, requiere login de comensal)
    //   · Lista de reseñas publicadas (de cualquier comensal) con rating, autor, fecha
    //   · Botón "Reportar" en cada reseña (requiere login)
    // ═══════════════════════════════════════════════════════════════════
    const placeId = String(p.id);
    const placeSource = p._fromDb ? 'supabase' : 'static';
    // [v2.0.29] "Añadir a lista" + "Subir foto" deshabilitados en el drawer (se
    //   desarrollarán más adelante). openAddToList / triggerDrawerPhotoUpload /
    //   createCollection / addPlaceToCollection / uploadPlacePhoto quedan dormidos
    //   en app.js para reactivación futura.
    html += `
    <div class="drawer-section drawer-reviews" id="drawerReviewsSection" style="animation-delay:0.31s;">
        <div class="drawer-reviews-head">
            <div class="drawer-reviews-title"><i class="fas fa-star" aria-hidden="true"></i> Reseñas de la comunidad</div>
            <span class="drawer-reviews-count" id="drawerReviewsCount">—</span>
        </div>
        <div id="drawerReviewsList">
            <!-- [v2.0.30/UUX] Skeleton shimmer en vez de texto plano "Cargando
                 reseñas…". El span sr-only mantiene el anuncio para lectores. -->
            <span class="sr-only" role="status" aria-live="polite">Cargando reseñas</span>
            <div class="review-skeleton" aria-hidden="true"></div>
            <div class="review-skeleton" aria-hidden="true"></div>
        </div>
        <button class="drawer-write-review-btn" id="drawerWriteReviewBtn" onclick="openReviewFormInline('${escAttr(placeId)}', '${placeSource}', '${escAttr(p.name)}')" style="margin-top:14px">
            <i class="fas fa-pen-to-square"></i> Escribir reseña
        </button>
        <div class="review-form-inline" id="reviewFormInline" data-place-id="${escAttr(placeId)}" data-place-source="${placeSource}" data-place-name="${escAttr(p.name)}">
            <div class="review-form-title">Tu reseña</div>
            <div class="review-star-input" id="reviewStarInput" role="group" aria-label="Puntuación de la reseña">
                <i class="far fa-star" data-value="1" tabindex="0" role="button" aria-label="1 estrella" aria-pressed="false"></i>
                <i class="far fa-star" data-value="2" tabindex="0" role="button" aria-label="2 estrellas" aria-pressed="false"></i>
                <i class="far fa-star" data-value="3" tabindex="0" role="button" aria-label="3 estrellas" aria-pressed="false"></i>
                <i class="far fa-star" data-value="4" tabindex="0" role="button" aria-label="4 estrellas" aria-pressed="false"></i>
                <i class="far fa-star" data-value="5" tabindex="0" role="button" aria-label="5 estrellas" aria-pressed="false"></i>
            </div>
            <textarea class="review-textarea" id="reviewBodyInput" maxlength="2000" placeholder="Cuenta tu experiencia: qué pediste, cómo fue el servicio, qué destacarías…"></textarea>
            <div class="review-form-actions">
                <button class="review-btn" onclick="closeReviewFormInline()">Cancelar</button>
                <button class="review-btn review-btn-primary" onclick="submitReviewInline()"><i class="fas fa-paper-plane" style="margin-right:4px"></i>Publicar</button>
            </div>
        </div>
    </div>`;


    // ═══════════════════════════════════════════
    // BOTÓN UBICACIÓN — Google Maps
    // ═══════════════════════════════════════════
    // ★ [v2.0.18] Ampliamos la condición: el botón "Ubicación" ahora aparece
    //   también cuando el local NO tiene lat/lng pero SÍ tiene gmapsUrl
    //   (p.ej. un local de Supabase al que el dueño le pegó la URL completa
    //   de Google Maps sin calcular coordenadas). Antes, sin lat/lng el
    //   botón nunca se mostraba y el usuario no llegaba al mapa.
    //   Orden de prioridad para construir la URL final:
    //     1) p.gmapsUrl propio del local (respeta el que cargó el dueño)
    //     2) https://www.google.com/maps?q=<lat>,<lng> si hay coords
    //     3) https://www.google.com/maps?q=<name>,<address> como fallback
    //   No rompe nada: si lat/lng están presentes el comportamiento es
    //   idéntico al anterior.
    if (p.lat && p.lng || p.gmapsUrl) {
        // [T-09] Se respeta el gmapsUrl propio del local si existe; si no, se genera
        const gmapsUrl = p.gmapsUrl
            || (p.lat && p.lng
                ? ('https://www.google.com/maps?q=' + encodeURIComponent(p.lat + ',' + p.lng))
                : ('https://www.google.com/maps?q=' + encodeURIComponent(p.name + ', ' + p.address)));
        html += `
        <div class="drawer-section" style="animation-delay:0.32s;">
            <a href="${gmapsUrl}" target="_blank" rel="noopener noreferrer" class="drawer-ubicacion-btn">
                <i class="fas fa-map-location-dot" aria-hidden="true"></i> Ubicación
                <i class="fas fa-external-link-alt" style="font-size:0.7rem;margin-left:auto;opacity:0.6;"></i>
            </a>
        </div>`;
    }

    // Verificar si los links son placeholders (URLs raiz sin path)
    const placeholderDomains = ['pedidosya.com/', 'rappi.com/', 'opentable.com/'];
    const isPlaceholder = p.links && p.links.length > 0 && p.links.every(l =>
        placeholderDomains.some(d => l.url.includes(d))
    );
    // [v2.0.12] ¿Este local tiene delivery habilitado individualmente?
    // Si está en la lista blanca Y sus links no son placeholders, se muestran
    // los botones activos (como enlaces reales), sin importar DELIVERY_BETA_OFF.
    const deliveryEnabled = isDeliveryEnabledFor(p) && p.links && p.links.length && !isPlaceholder;

    // [B-01] Beta: los botones (PedidosYa, Rappi, Reservar Mesa) se muestran
    // deshabilitados con el aviso "No disponible por ahora" (ver DELIVERY_BETA_OFF).
    // [v2.0.12] Excepción: si el local está en DELIVERY_ENABLED_PLACE_IDS,
    // se muestran activos aunque el beta siga apagado.
    if (deliveryEnabled) {
        html += `
        <div class="drawer-section" style="animation-delay:0.35s;">
            <div class="drawer-section-label">Delivery y reservas</div>
            <div class="drawer-delivery">
                ${p.links.map(l => `
                    <a href="${safeHref(l.url)}" target="_blank" rel="noopener noreferrer" class="delivery-link ${escAttr(l.cssClass)}">
                        <i class="${iconPrefix(l.icon)} ${escAttr(l.icon)}"></i> ${escapeHtmlLight(l.platform)}
                    </a>
                `).join('')}
            </div>
        </div>`;
    } else if (DELIVERY_BETA_OFF && p.links && p.links.length) {
        html += `
        <div class="drawer-section" style="animation-delay:0.35s;">
            <div class="drawer-section-label">Delivery y reservas</div>
            <div class="drawer-delivery">
                ${p.links.map(l => `
                    <span class="delivery-link delivery-off ${escAttr(l.cssClass)}" aria-disabled="true" title="No disponible por ahora">
                        <i class="${iconPrefix(l.icon)} ${escAttr(l.icon)}" aria-hidden="true"></i> ${escapeHtmlLight(l.platform)}
                    </span>
                `).join('')}
            </div>
            <div class="delivery-off-note">
                <i class="fas fa-clock" aria-hidden="true"></i> No disponible por ahora — esta sección se activará próximamente.
            </div>
        </div>`;
    } else if (p.links && p.links.length && !isPlaceholder) {
        html += `
        <div class="drawer-section" style="animation-delay:0.35s;">
            <div class="drawer-section-label">Delivery y reservas</div>
            <div class="drawer-delivery">
                ${p.links.map(l => `
                    <a href="${safeHref(l.url)}" target="_blank" rel="noopener noreferrer" class="delivery-link ${escAttr(l.cssClass)}">
                        <i class="${iconPrefix(l.icon)} ${escAttr(l.icon)}"></i> ${escapeHtmlLight(l.platform)}
                    </a>
                `).join('')}
            </div>
        </div>`;
    } else if (isPlaceholder) {
        html += `
        <div class="drawer-section" style="animation-delay:0.35s;">
            <div class="drawer-section-label">Delivery y reservas</div>
            <div style="padding:14px 18px;border-radius:12px;background:rgba(139,92,246,0.06);border:1px dashed rgba(139,92,246,0.2);color:var(--muted);font-size:0.85rem;display:flex;align-items:center;gap:8px;">
                <i class="fas fa-clock"></i> Delivery y reservas online próximamente
            </div>
        </div>`;
    }

     if (p.menu && p.menu.length) {
        html += `
        <div class="drawer-section" style="animation-delay:0.4s;">
            <button class="drawer-menu-btn" onclick="openMenuSubModal()">
                <i class="fas fa-book-open" aria-hidden="true"></i> Ver la carta completa
            </button>
        </div>`;
    }

    // ═══════════════════════════════════════════════════
    // EL ANZUELO: Banner "Reclamar este Local"
    // Se OCULTA si:
    //   · is_pro === true  → local ya tiene plan PRO (gestionado y pago)
    //   · _fromDb === true → local ya viene de Supabase, ya tiene un dueño gestionándolo
    // ═══════════════════════════════════════════════════
    if (!p.is_pro && !p._fromDb) {
        html += `
        <div class="drawer-section" style="padding: 0; margin-bottom: 24px; animation-delay:0.42s;">
            <div class="drawer-banner-claim" style="background: rgba(139,92,246,0.1); border: 1px dashed var(--accent); padding: 14px; border-radius: 12px; margin: 0 28px; text-align: center;">
                <p style="font-size: 0.85rem; color: var(--cream); margin-bottom: 8px;">¿Eres el dueño de este local?</p>
                <a href="publicar.html" class="btn-fill" style="font-size: 0.8rem; padding: 8px 16px; display:inline-flex; align-items:center; gap:8px; background:var(--accent); color:#fff; text-decoration:none; border-radius:10px; font-weight:700;">
                    <i class="fas fa-check-circle" aria-hidden="true"></i> Reclamar este Local
                </a>
            </div>
        </div>`;
    }

    html += `
    <div class="drawer-section" style="animation-delay:0.45s;margin-bottom:32px;">
        <button class="drawer-share-btn" data-place-id="${p.id}" onclick="sharePlace(this.dataset.placeId)">
            <i class="fas fa-share-nodes" aria-hidden="true"></i> Compartir este lugar
        </button>
    </div>`;

    document.getElementById('modalDrawerScroll').innerHTML = html;

    openDrawerUI();

    // [v2.0.19] Cargar reseñas del place desde el proyecto foodies (async, no bloquea el drawer)
    if (sbFoodies) {
        renderReviewsInDrawer(String(p.id));
    } else {
        // Sin cliente foodies → mostrar mensaje suave (no romper la experiencia)
        const list = document.getElementById('drawerReviewsList');
        if (list) list.innerHTML = '<p style="color:var(--muted);font-size:0.85rem;text-align:center;padding:14px 0">Las reseñas estarán disponibles pronto.</p>';
        const count = document.getElementById('drawerReviewsCount');
        if (count) count.textContent = '0';
        const writeBtn = document.getElementById('drawerWriteReviewBtn');
        if (writeBtn) writeBtn.style.display = 'none';
    }

    if (hasImages && validImages.length > 1 && typeof Swiper !== 'undefined') {
        const _mdEl = document.getElementById('modalDrawer');
        const t = setTimeout(() => {
            swiperInstance = new Swiper('#modalSwiper', {
                loop: true, grabCursor: true,
                pagination: { el: '.swiper-pagination', clickable: true },
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
                autoplay: { delay: 4000, disableOnInteraction: true },
            });
        }, 100);
        if (_mdEl) _mdEl._swiperTimer = t; // [FIX v2.0.27] limpiar en closeModal si cierra antes de 100ms → evita Swiper huérfano
    }

    document.getElementById('modalDrawerScroll').scrollTop = 0;
}

function closeModal() {
    closeDrawerUI();
    const _mdEl = document.getElementById('modalDrawer');
    if (_mdEl && _mdEl._swiperTimer) { clearTimeout(_mdEl._swiperTimer); _mdEl._swiperTimer = null; } // [FIX v2.0.27] Swiper huérfano si cierras antes de los 100ms
    if (swiperInstance) { swiperInstance.destroy(); swiperInstance = null; }
    currentModalPlace = null;
    // [U-11] Si el modal legal pisó el detalle de un local, se restaura el drawer
    if (legalReturnPlace) {
        const rp = legalReturnPlace;
        legalReturnPlace = null;
        openModal(String(rp.id));
    }
}

// [A-09] Escapado de atributos HTML para valores de datos
function escAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
                    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// [FIX v2.0.27] Sanitiza URLs para atributos href: solo permite http(s):, tel:, mailto:.
// Evita javascript: y data: inyectados por un dueño de local malicioso en p.links[].url.
function safeHref(u) {
    const s = String(u == null ? '' : u).trim();
    if (/^(https?:|tel:|mailto:)/i.test(s)) return escAttr(s);
    return '#';
}

/* ═══════════════════════════════════════════
   SUB-MODAL DE MENÚ (dentro del drawer)
   ═══════════════════════════════════════════ */
/* [v2.0.10] Devuelve el color y glow CSS asociados a cada categoría de local.
   Se usa para que el botón "Siguiente categoría" tome el color del local actual
   y armonice con el banner del drawer (que ya usa estos mismos colores).
   · bar         → violeta (accent)
   · restaurante → cyan (secondary)
   · heladeria   → rosa (pink) */
function getCatColorVars(category) {
    switch (category) {
        case 'restaurante':
            return { color: 'var(--secondary)', glow: 'var(--secondary-glow, rgba(6,182,212,0.3))' };
        case 'heladeria':
            return { color: 'var(--pink)', glow: 'var(--pink-glow, rgba(236,72,153,0.3))' };
        case 'bar':
        default:
            return { color: 'var(--accent)', glow: 'var(--accent-glow)' };
    }
}

/* ★ [v2.0.11] Paleta cíclica de colores por ÍNDICE de sección de la carta.
   Cada sección de la carta recibe un color distinto (no por tipo de local,
   sino por posición: sección 0 → violeta, sección 1 → cian, sección 2 →
   rosa, sección 3 → ámbar, etc.). Así:
     · Los chips de la barra de navegación se distinguen visualmente.
     · El botón "Siguiente: X" toma el color de la categoría DESTINO,
       coincidiendo con el chip al que va a saltar.
     · El botón "Volver al inicio" toma el color de la PRIMERA sección.
   La paleta usa las CSS variables del tema activo, con fallbacks por si
   alguna no está definida. */
const MENU_SECTION_PALETTE = [
    { color: 'var(--accent, #8b5cf6)',     glow: 'var(--accent-glow, rgba(139,92,246,0.3))'     }, // violeta
    { color: 'var(--secondary, #06b6d4)',  glow: 'var(--secondary-glow, rgba(6,182,212,0.3))'   }, // cian
    { color: 'var(--pink, #ec4899)',       glow: 'var(--pink-glow, rgba(236,72,153,0.3))'      }, // rosa
    { color: 'var(--amber, #f59e0b)',      glow: 'var(--amber-glow, rgba(245,158,11,0.3))'     }, // ámbar
    { color: 'var(--green, #22c55e)',      glow: 'var(--green-glow, rgba(34,197,94,0.3))'      }, // verde
];
function getSectionColorVars(sectionIndex) {
    const idx = ((sectionIndex % MENU_SECTION_PALETTE.length) + MENU_SECTION_PALETTE.length) % MENU_SECTION_PALETTE.length;
    return MENU_SECTION_PALETTE[idx];
}

function openMenuSubModal() {
    const p = currentModalPlace;
    if (!p || !p.menu) return;
    /* ★ v2.0.24: Inyectar estilos para platos "Agotados" una sola vez.
       Se inyectan en <head> para que persistan entre aperturas del modal. */
    if (!document.getElementById('sabormap-menu-soldout-styles')) {
        const style = document.createElement('style');
        style.id = 'sabormap-menu-soldout-styles';
        style.textContent = `
            .menu-dish.menu-dish-sold-out {
                opacity: 0.55;
                position: relative;
            }
            .menu-dish.menu-dish-sold-out .menu-dish-name {
                text-decoration: line-through;
                text-decoration-color: rgba(239,68,68,0.6);
                text-decoration-thickness: 2px;
                opacity: 0.75;
            }
            .menu-dish.menu-dish-sold-out .menu-dish-price {
                text-decoration: line-through;
                text-decoration-color: rgba(239,68,68,0.6);
                opacity: 0.65;
            }
            .menu-dish.menu-dish-sold-out .menu-dish-desc {
                opacity: 0.55;
            }
            .menu-soldout-badge {
                display: inline-block;
                margin-left: 10px;
                padding: 2px 9px;
                background: rgba(239,68,68,0.15);
                color: #ef4444;
                border: 1px solid rgba(239,68,68,0.35);
                border-radius: 5px;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.06em;
                text-decoration: none !important;
                vertical-align: middle;
                line-height: 1.5;
                white-space: nowrap;
            }
            /* ★ v2.0.16: Diferenciacion visual de precios por moneda.
               CUP  → cyan (var(--secondary)) — estilo actual sin cambios.
               USD  → amber (var(--amber))    — etiqueta "USD" al lado del precio.
               MLC  → pink  (var(--pink))     — etiqueta "MLC".
               EUR  → pink  (var(--pink))     — etiqueta "EUR".
               La etiqueta es un span pequeño, mayusculas, peso menor,
               alineado junto al precio sin romper el layout flex existente.
               Usa variables CSS existentes → compatible con tema claro/oscuro. */
            .menu-dish-price-cup { color: var(--secondary); }
            .menu-dish-price-usd { color: var(--amber); }
            .menu-dish-price-mlc { color: var(--pink); }
            .menu-dish-price-eur { color: var(--pink); }
            .menu-price-currency {
                font-size: 0.6rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                opacity: 0.85;
                white-space: nowrap;
                text-decoration: inherit;
            }
        `;
        document.head.appendChild(style);
    }
    document.getElementById('menuSubTitle').textContent = `Carta — ${p.name}`;
    // ★ FIX [v2.0.6]: removido el aviso "Carta de ejemplo — la carta real
    //   estará disponible próximamente" porque ya no aplica:
    //   · Los lugares creados desde el dashboard tienen su carta real (la
    //     ingresa el dueño desde el formulario).
    //   · Los lugares estáticos con menu≠[] también tienen su carta real.
    //   · Los lugares sin carta (menu=[]) ni siquiera muestran el botón
    //     "Ver la carta completa" (ver openModal → if (p.menu && p.menu.length)).
    //   Por lo tanto, cualquier local que llegue a esta función tiene una
    //   carta propia y real — no necesita el aviso de "ejemplo".
    const existingNotice = document.getElementById('menuExampleNotice');
    if (existingNotice) existingNotice.remove();

    // ★ [v2.0.8] Generar IDs estables para cada sección (para anclas de navegación).
    //   Se usa un slug simple del nombre de la categoría + índice para evitar
    //   colisiones si dos categorías se llaman igual.
    const sections = p.menu.map((section, i) => {
        const slug = String(section.category || 'seccion')
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar tildes
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        return {
            ...section,
            _id: `menu-sec-${i}-${slug}`,
            _index: i
        };
    });

    let html = '';
    sections.forEach((section, i) => {
        const isLast = i === sections.length - 1;
        const nextSection = !isLast ? sections[i + 1] : null;
        // [v2.0.11] Inyectar el color de esta sección en el contenedor,
        // para que el título (.menu-section-title) y el botón "siguiente"
        // puedan referenciarlo vía var(--section-color).
        const secColor = getSectionColorVars(i);
        html += `<div class="menu-section" id="${escAttr(section._id)}"
                    style="--section-color: ${secColor.color}; --section-glow: ${secColor.glow};}">
            <h3 class="menu-section-title">${escapeHtmlLight(section.category)}</h3>`;
        section.items.forEach(item => {
            /* ★ v2.0.24: Si el plato está marcado como agotado en el
               dashboard, se muestra tachado con badge "Agotado". */
            const soldOut = item.sold_out === true;
            const dishClass = soldOut ? 'menu-dish menu-dish-sold-out' : 'menu-dish';
            const soldOutBadge = soldOut ? '<span class="menu-soldout-badge">Agotado</span>' : '';
            /* ★ v2.0.16: Precio con etiqueta de moneda y color diferenciado.
               CUP  → número + "CUP" (cyan).
               USD  → número + "USD" (amber).
               MLC  → número + "MLC" (pink).
               EUR  → número + "EUR" (pink).
               Cualquier otra moneda → número + etiqueta (color cyan por
               defecto del .menu-dish-price base).
               ★ v2.0.17: CUP también lleva etiqueta (antes se mostraba solo
               el número). Ahora todas las monedas muestran su sufijo, así
               el usuario ve claramente "$350 CUP" vs "$10 USD" y no hay
               ambigüedad entre monedas. */
            const currency = String(item.currency || 'CUP').toUpperCase();
            const priceCurrencyClass = 'menu-dish-price-' + currency.toLowerCase();
            const priceLabel = '<span class="menu-price-currency">' + currency + '</span>';
            html += `<div class="${dishClass}">
                <div class="menu-dish-info">
                    <div class="menu-dish-name">${escapeHtmlLight(item.name)}${soldOutBadge}</div>
                    <div class="menu-dish-desc">${escapeHtmlLight(item.desc)}</div>
                </div>
                <div class="menu-dish-price ${priceCurrencyClass}">${escapeHtmlLight(item.price)}${priceLabel}</div>
            </div>`;
        });
        // [v2.0.9/2.0.10/2.0.11] Botón "Siguiente categoría →" al final de cada sección.
        //   v2.0.11: ahora toma el color de la sección DESTINO (paleta cíclica por índice),
        //   no del local. Así el botón coincide con el chip de la barra al que va a saltar.
        //   En la última sección, un botón "Volver al inicio ↑" con color de la primera sección.
        if (nextSection) {
            const nextColorVars = getSectionColorVars(i + 1);
            html += `<button type="button"
                        class="menu-next-cat-btn"
                        style="--next-color: ${nextColorVars.color}; --next-glow: ${nextColorVars.glow};"
                        onclick="scrollToMenuCategory('${nextSection._id}', ${i + 1})"
                        aria-label="Ir a la siguiente categoría: ${escAttr(nextSection.category)}">
                    Siguiente: ${nextSection.category}
                    <i class="fas fa-arrow-down" aria-hidden="true"></i>
                </button>`;
        } else if (sections.length >= 2) {
            // "Volver al inicio" toma el color de la primera sección (donde va a saltar)
            const firstColorVars = getSectionColorVars(0);
            html += `<button type="button"
                        class="menu-next-cat-btn"
                        style="--next-color: ${firstColorVars.color}; --next-glow: ${firstColorVars.glow};"
                        onclick="scrollMenuToTop()"
                        aria-label="Volver al inicio de la carta">
                    Volver al inicio
                    <i class="fas fa-arrow-up" aria-hidden="true"></i>
                </button>`;
        }
        html += `</div>`;
    });

    if (p.links && p.links.length) {
        // [v2.0.12] Si el local está en la lista blanca y sus links no son
        // placeholders, mostrar los botones ACTIVOS en la carta también.
        // Si no, mantener el modo "No disponible por ahora" del beta.
        const placeholderDomainsMenu = ['pedidosya.com/', 'rappi.com/', 'opentable.com/'];
        const isPlaceholderMenu = p.links.every(l =>
            placeholderDomainsMenu.some(d => l.url.includes(d))
        );
        const deliveryEnabledMenu = isDeliveryEnabledFor(p) && !isPlaceholderMenu;

        if (deliveryEnabledMenu) {
            // Botones activos: enlaces reales <a href>
            html += `<div class="delivery-section">${p.links.map(l => `
                <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="delivery-link ${l.cssClass}">
                    <i class="${iconPrefix(l.icon)} ${l.icon}" aria-hidden="true"></i> ${l.platform}
                </a>
            `).join('')}</div>`;
        } else {
            // [B-01] Beta: botones deshabilitados con aviso
            html += `<div class="delivery-section">${p.links.map(l => `
                <span class="delivery-link delivery-off ${l.cssClass}" aria-disabled="true" title="No disponible por ahora">
                    <i class="${iconPrefix(l.icon)} ${l.icon}" aria-hidden="true"></i> ${l.platform}
                </span>
            `).join('')}</div>
            <div class="delivery-off-note">
                <i class="fas fa-clock" aria-hidden="true"></i> Delivery y reservas no disponibles por ahora.
            </div>`;
        }
    }

    document.getElementById('menuSubBody').innerHTML = html;

    // ★ [v2.0.8/2.0.9/2.0.11] Poblar la barra de navegación de categorías + contador.
    //   v2.0.11: cada chip recibe --chip-color de la paleta cíclica por índice,
    //   para que visualmente coincida con su botón "Siguiente: X" correspondiente.
    //   Solo se muestra si hay 2+ categorías (con 1 no tiene sentido).
    const nav = document.getElementById('menuCatNav');
    if (nav && sections.length >= 2) {
        const chipsHtml = sections.map((s, i) => {
            const cv = getSectionColorVars(i);
            return `
            <button type="button"
                    class="menu-cat-chip${i === 0 ? ' active' : ''}"
                    style="--chip-color: ${cv.color}; --chip-glow: ${cv.glow};"
                    data-target="${s._id}"
                    data-index="${i}"
                    onclick="scrollToMenuCategory('${s._id}', ${i})"
                    aria-label="Ir a la categoría ${escAttr(s.category)}">
                ${s.category}
            </button>`;
        }).join('');
        // [v2.0.9] Contador "X / Y" discreto al final de la barra.
        nav.innerHTML = chipsHtml +
            `<span class="menu-cat-counter">
                <span class="num" id="menuCatCurrent">1</span> / ${sections.length}
                <span class="sr-only" id="menuCatAnnounce" aria-live="polite" role="status"></span>
            </span>`;
        nav.classList.remove('hidden');
        // Guardar el total para el updateCounter
        nav.dataset.total = sections.length;
        // Activar el observador que resalta el chip de la sección visible
        setupMenuCatNavObserver();
    } else if (nav) {
        nav.innerHTML = '';
        nav.classList.add('hidden');
    }

    document.getElementById('menuSubModal').classList.add('open');

    // [v2.0.10] Animación de entrada del botón "Siguiente categoría":
    // disparamos la animación fade-up cuando el botón entra en el viewport
    // del menu-body (no al abrir el modal, sino al hacer scroll hacia él).
    setupNextCatBtnObserver();
}

/* [v2.0.10] IntersectionObserver que añade .visible a cada .menu-next-cat-btn
   cuando entra en viewport, disparando la animación fadeUp definida en CSS.
   Se desconecta al cerrar el sub-modal. */
let _nextCatBtnObserver = null;
function setupNextCatBtnObserver() {
    if (_nextCatBtnObserver) { _nextCatBtnObserver.disconnect(); _nextCatBtnObserver = null; }
    const btns = document.querySelectorAll('#menuSubBody .menu-next-cat-btn');
    if (!btns.length) return;
    // Si el navegador no soporta IntersectionObserver, mostrar todos de una.
    if (!('IntersectionObserver' in window)) {
        btns.forEach(b => b.classList.add('visible'));
        return;
    }
    _nextCatBtnObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                _nextCatBtnObserver.unobserve(e.target);
            }
        });
    }, {
        root: document.getElementById('menuSubBody'),
        rootMargin: '0px 0px -40px 0px', // dispara un poco antes de que entre del todo
        threshold: 0.1
    });
    btns.forEach(b => _nextCatBtnObserver.observe(b));
}

/* ★ [v2.0.8] Salta a una categoría de la carta al hacer click en su chip.
   Usa scrollIntoView con behavior:'smooth' y respeta el scroll-margin-top
   definido en CSS para que el título no quede tapado por la barra pegajosa. */
function scrollToMenuCategory(sectionId, index) {
    const target = document.getElementById(sectionId);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Activar el chip clicado inmediatamente (el observer lo confirmará)
    setActiveMenuChip(index);
    // Llevar también el chip clicado al centro de la barra si está fuera de vista
    const chip = document.querySelector(`.menu-cat-chip[data-index="${index}"]`);
    if (chip && chip.scrollIntoView) {
        chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}
window.scrollToMenuCategory = scrollToMenuCategory;

function setActiveMenuChip(index) {
    document.querySelectorAll('.menu-cat-chip').forEach(c => {
        c.classList.toggle('active', parseInt(c.dataset.index, 10) === index);
    });
    // [v2.0.9] Actualizar también el contador "X / Y"
    const counter = document.getElementById('menuCatCurrent');
    if (counter) counter.textContent = index + 1;
    // [v2.0.30/A11Y] Anuncio accesible con NOMBRE de la sección, no solo un
    //   número suelto ("3"). El span sr-only con aria-live lee "Sección 3 de 5:
    //   Entradas". El chip activo ya contiene el nombre visible.
    const announce = document.getElementById('menuCatAnnounce');
    const chip = document.querySelector('.menu-cat-chip[data-index="' + index + '"]');
    // data-total lo pone setupMenuCatNavObserver en #menuCatNav (nav), no en el
    // contador; subir hasta el nav para leerlo.
    const navEl = counter ? counter.closest('#menuCatNav') : null;
    const total = navEl ? navEl.dataset.total : '';
    if (announce && chip) {
        announce.textContent = `Sección ${index + 1}${total ? ' de ' + total : ''}: ${chip.textContent.trim()}`;
    }
}

/* ★ [v2.0.8] IntersectionObserver que resalta el chip de la categoría
   actualmente visible mientras el usuario hace scroll por la carta. */
let _menuCatObserver = null;
function setupMenuCatNavObserver() {
    // Limpiar observer anterior si existía
    if (_menuCatObserver) { _menuCatObserver.disconnect(); _menuCatObserver = null; }
    const sections = document.querySelectorAll('#menuSubBody .menu-section');
    if (!sections.length) return;
    _menuCatObserver = new IntersectionObserver(() => {
        // [v2.0.30/UUX] Cálculo determinista de la sección activa por posición,
        //   no por el batch de entries. Antes, un scroll rápido dejaba batches
        //   sin ninguna entry isIntersecting (rootMargin -60% abajo) → return
        //   temprano → chip desincronizado; y secciones cortas podían saltarse
        //   sin activar su chip. Ahora recorremos TODAS las secciones y elegimos
        //   la última cuyo top esté en/por encima de la banda pegajosa (110px).
        const root = document.getElementById('menuSubBody');
        if (!root) return;
        const rootTop = root.getBoundingClientRect().top;
        const band = 111;
        let activeIdx = -1;
        sections.forEach((s, i) => {
            if (s.getBoundingClientRect().top - rootTop <= band) activeIdx = i;
        });
        if (activeIdx >= 0) setActiveMenuChip(activeIdx);
    }, {
        root: document.getElementById('menuSubBody'),
        rootMargin: '-110px 0px -60% 0px', // dispara el callback al entrar en la banda
        threshold: 0
    });
    sections.forEach(s => _menuCatObserver.observe(s));
}

function closeMenuSubModal() {
    document.getElementById('menuSubModal').classList.remove('open');
    document.getElementById('menuScrollTopBtn').style.display = 'none';
    // ★ [v2.0.8] Limpiar observer y chips al cerrar
    if (_menuCatObserver) { _menuCatObserver.disconnect(); _menuCatObserver = null; }
    // [v2.0.10] Limpiar observer de animación de botones "siguiente"
    if (_nextCatBtnObserver) { _nextCatBtnObserver.disconnect(); _nextCatBtnObserver = null; }
    const nav = document.getElementById('menuCatNav');
    if (nav) { nav.innerHTML = ''; nav.classList.add('hidden'); }
}

// Scroll del menú: mostrar/ocultar botón "ir arriba"
document.addEventListener('DOMContentLoaded', () => {
    const menuBody = document.getElementById('menuSubBody');
    const scrollBtn = document.getElementById('menuScrollTopBtn');
    if (menuBody && scrollBtn) {
        menuBody.addEventListener('scroll', () => {
            scrollBtn.style.display = menuBody.scrollTop > 200 ? 'flex' : 'none';
        });
    }
});

function scrollMenuToTop() {
    const menuBody = document.getElementById('menuSubBody');
    if (menuBody) menuBody.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ═══════════════════════════════════════════
   UTILIDADES
   ═══════════════════════════════════════════ */
// [v2.0.30/A11Y-RES] navigator.clipboard requiere contexto seguro (HTTPS) y
//   permiso; en HTTP / navegadores antiguos / sin permiso lanzaba o rechazaba
//   sin alternativa. Fallback a execCommand('copy') vía <textarea> oculta.
function _fallbackCopy(text) {
    try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed'; ta.style.top = '0'; ta.style.left = '0'; ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        return ok;
    } catch (e) { return false; }
}
function _copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text).then(() => true).catch(() => _fallbackCopy(text));
    }
    return Promise.resolve(_fallbackCopy(text));
}
function copyText(text) {
    _copyToClipboard(text).then(ok => showToast(ok ? 'Dirección copiada' : 'No se pudo copiar'));
}

function sharePlace(id) {
    const p = staticPlaces.find(pl => String(pl.id) === String(id));
    if (!p) return;
    const text = `${p.name} — ${p.neighborhood}, La Habana | Sabormap`;
    if (navigator.share) {
        navigator.share({ title: p.name, text, url: window.location.href }).catch(() => {});
    } else {
        _copyToClipboard(text + ' ' + window.location.href)
            .then(ok => showToast(ok ? 'Enlace copiado' : 'No se pudo copiar'));
    }
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

/* ═══════════════════════════════════════════
   MODAL LEGAL
   ═══════════════════════════════════════════ */
function openLegalModal(type) {
    const titles = { terminos: 'Términos de Uso', privacidad: 'Política de Privacidad' };
    const bodies = {
        terminos: '<p style="color:var(--muted);line-height:1.8;">Al usar Sabormap aceptas que la información de locales, precios y horarios puede variar y es referencial. No nos responsabilizamos por cambios en los comercios listados.</p>',
        privacidad: '<p style="color:var(--muted);line-height:1.8;">Respetamos tu privacidad. No recopilamos datos personales sin tu consentimiento. Las cookies se usan únicamente para mejorar la experiencia de navegación.</p>'
    };
    legalReturnPlace = currentModalPlace; // [U-11] recordar si había un local abierto (¡ANTES de nullear!)
    currentModalPlace = null;
    const html = `
        <div class="drawer-cat-banner cat-bar" style="padding-top:60px;">
            <div class="drawer-cat-orb" style="width:180px;height:180px;top:-40px;right:-30px;"></div>
            <h2 class="drawer-place-name" id="drawerPlaceName">${titles[type] || 'Legal'}</h2>
        </div>
        <div class="drawer-section">
            ${bodies[type] || ''}
        </div>
    `;
    document.getElementById('modalDrawerScroll').innerHTML = html;
    document.getElementById('menuSubModal').classList.remove('open');
    openDrawerUI();
}

/* ═══════════════════════════════════════════
   MENÚ MÓVIL
   ═══════════════════════════════════════════ */
function openMobileMenu() {
    const m = document.getElementById('mobileMenu');
    m.classList.add('open');
    m.removeAttribute('aria-hidden');   // [A-03]
    m.removeAttribute('inert');
    document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
    const m = document.getElementById('mobileMenu');
    m.classList.remove('open');
    m.setAttribute('aria-hidden', 'true');   // [A-03] invisible para lectores y para Tab
    m.setAttribute('inert', '');
    document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════ */
function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════
   BOTONES DE SCROLL
   ═══════════════════════════════════════════ */
function setupScrollBtns() {
    const topBtn = document.getElementById('scrollTopBtn');
    const bottomBtn = document.getElementById('scrollBottomBtn');
    window.addEventListener('scroll', () => {
        const show = window.scrollY > 400;
        topBtn.classList.toggle('visible', show);
        bottomBtn.classList.toggle('visible', show);
    });
}
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToBottom() { document.getElementById('siteFooter').scrollIntoView({ behavior: 'smooth' }); }

/* ═══════════════════════════════════════════
   ANIMAR ESTADÍSTICAS
   ═══════════════════════════════════════════ */
/* ★ FIX [v2.0.7]: _statsAnimated guarda si ya se configuró el observer
   de animación. Así, aunque animateStats() se llame dos veces (p. ej.
   desde DOMContentLoaded y desde loadPlacesFromSupabase), el contador
   NO se re-anima desde 0 — solo se actualiza el data-target y el
   textContent al nuevo total. Esto elimina el salto "256 → 257".
   ★ FIX [v2.0.12bis]: cada setInterval se registra en
   _activeStatIntervals para que updateStatNumbers pueda cancelarlos
   si llega una actualización de Supabase a mitad de animación. */
let _statsAnimated = false;
function animateStats() {
    // Calcular valores reales desde los datos
    const totalLocales = staticPlaces.length;
    const municipios = new Set(staticPlaces.map(p => p.neighborhood));
    const totalMunicipios = municipios.size;

    const statLocales = document.getElementById('statLocales');
    const statMunicipios = document.getElementById('statMunicipios');
    if (statLocales) statLocales.dataset.target = totalLocales;
    if (statMunicipios) statMunicipios.dataset.target = totalMunicipios;

    // Si ya animamos antes, solo ajustar el valor final sin re-animar
    if (_statsAnimated) {
        if (statLocales) statLocales.textContent = totalLocales;
        if (statMunicipios) statMunicipios.textContent = totalMunicipios;
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const el = e.target;
                // ★ FIX [v2.0.12bis]: releer dataset.target EN CADA TICK
                //   del intervalo, no solo al inicio. Así, si
                //   updateStatNumbers actualiza dataset.target a 257
                //   mientras la animación va por 200, el siguiente tick
                //   ve el nuevo target y cuenta hasta 257 en lugar de
                //   quedarse en 256.
                let current = parseInt(el.textContent, 10) || 0;
                const tick = () => {
                    const target = parseInt(el.dataset.target, 10) || 0;
                    if (target <= 0) { current = 0; el.textContent = '0'; return; }
                    const step = Math.max(1, Math.ceil(target / 50));
                    current += step;
                    if (current >= target) {
                        current = target;
                        el.textContent = current;
                        clearInterval(intervalId);
                        _activeStatIntervals.delete(intervalId);
                        return;
                    }
                    el.textContent = current;
                };
                const intervalId = setInterval(tick, 30);
                _activeStatIntervals.add(intervalId);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
    _statsAnimated = true;
}

/* Cerrar drawer con tecla Escape */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (document.getElementById('menuSubModal').classList.contains('open')) {
            closeMenuSubModal();
        } else if (document.getElementById('modalDrawer').classList.contains('open')) {
            closeModal();
        } else if (document.getElementById('mobileMenu').classList.contains('open')) {
            closeMobileMenu();
        }
    }
});

/* ═══════════════════════════════════════════════════════════════════
   [v2.0.19] FOODIES — Sesión del comensal, favoritos y reseñas
   ───────────────────────────────────────────────────────────────────
   Estas funciones se conectan al PROYECTO SUPABASE SEPARADO (sbFoodies).
   No tocan para nada el `sb` (proyecto principal de places/collections).
   ═══════════════════════════════════════════════════════════════════ */

/* Helper de escape para atributos HTML */
function _escFoodieAttr(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* Helper de escape para contenido HTML (anti-XSS en reseñas) */
function _escFoodieHtml(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

let foodieFavoritesLoaded = false; // true tras una carga exitosa; detecta cargas fallidas y evita recargas redundantes

/* initFoodieSession — al cargar la home, verifica si hay sesión de comensal
   activa. Si la hay, carga sus favoritos + perfil y actualiza el botón "Entrar"/"Mi cuenta".
   ★ [FIX favoritos] Maneja INITIAL_SESSION y TOKEN_REFRESHED (no solo SIGNED_IN):
     en supabase-js v2.49.4 el callback dispara INITIAL_SESSION al suscribirse y
     TOKEN_REFRESHED cuando el token persistido estaba expirado y se renueva. Si
     getSession() devolvió null en el primer instante (carga lenta / token a
     refrescar) y luego llega uno de estos eventos con la sesión real, hay que
     activarla aquí; si no, currentFoodie queda null, los corazones nunca se
     rellenan y el click redirige a login aunque el usuario esté logueado. */
async function initFoodieSession() {
    if (!sbFoodies) {
        console.info('[foodies] sbFoodies no configurado — favoritos y reseñas desactivados.');
        updateAuthButton(false);
        return;
    }
    try {
        const { data: { session } } = await sbFoodies.auth.getSession();
        if (session && session.user) {
            currentFoodie = session.user;
            // Cargar favoritos Y perfil (para mostrar avatar en el botón de la home)
            await Promise.all([
                loadFoodieFavorites(),
                loadFoodieProfileForHome()
            ]);
            updateAuthButton(true);
            // Re-renderizar la grilla para que los corazones aparezcan rellenos
            if (typeof renderPlaces === 'function' && currentView === 'grid') {
                renderPlaces();
            }
            // [FIX favoritos] Consumir intención pendiente (favorito marcado antes
            //   de iniciar sesión). Antes se seteaba sabormap_fav_pending pero
            //   nunca se leía, así que la intención se perdía tras el login.
            applyPendingFavorite();
        } else {
            updateAuthButton(false);
        }
        // Escuchar cambios de sesión (login desde otra pestaña, logout, refresh, etc.)
        sbFoodies.auth.onAuthStateChange((event, session) => {
            const user = session && session.user;
            if (user) {
                const idChanged = !currentFoodie || currentFoodie.id !== user.id;
                currentFoodie = user;
                // (Re)cargar favoritos/perfil solo si cambió la identidad o si la
                // carga anterior falló (foodieFavoritesLoaded === false). Así no
                // recargamos en cada TOKEN_REFRESHED del mismo usuario, pero sí
                // recuperamos la sesión si getSession() había devuelto null.
                if (idChanged || !foodieFavoritesLoaded) {
                    Promise.all([
                        loadFoodieFavorites(),
                        loadFoodieProfileForHome()
                    ]).then(() => {
                        updateAuthButton(true);
                        if (typeof renderPlaces === 'function' && currentView === 'grid') renderPlaces();
                        applyPendingFavorite();
                    }).catch(e => console.warn('[foodies] onAuthStateChange reload:', e));
                } else {
                    updateAuthButton(true);
                }
            } else if (event === 'SIGNED_OUT') {
                currentFoodie = null;
                foodieFavorites = new Set();
                foodieFavoritesLoaded = false;
                foodieProfileForHome = null;
                currentFoodieDisplayName = ''; // [v2.1.1] reset del nombre del navbar
                updateAuthButton(false);
                if (typeof renderPlaces === 'function' && currentView === 'grid') renderPlaces();
            }
        });
    } catch (e) {
        console.warn('[foodies] initFoodieSession:', e);
        updateAuthButton(false);
    }
}

/* [v2.1.1] visibilitychange — cuando el usuario vuelve a la pestaña (tras
   editar su perfil en mi-sabormap.html en otra pestaña, o tras volver
   del navegador a la home), refresca el nombre del navbar. Es ligero:
   solo recarga el perfil si hay sesión y si el nombre cambió en otro
   lado. Evita flashes: usa currentFoodie como fuente de verdad inmediata
   y el display_name como refinamiento. */
let _foodieProfileRefreshPending = false;
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible') return;
    if (!currentFoodie || !sbFoodies) return;
    if (_foodieProfileRefreshPending) return; // ya hay una recarga en curso
    _foodieProfileRefreshPending = true;
    // Re-render inmediato con el nombre ya en caché (sin flash)
    renderFoodieIdentity();
    // Recargar el perfil en background por si cambió en otra pestaña
    loadFoodieProfileForHome().catch(function (e) {
        console.warn('[foodies] visibilitychange reload:', e);
    }).finally(function () {
        _foodieProfileRefreshPending = false;
    });
});

/* applyPendingFavorite — [FIX favoritos] consume la intención de favorito
   guardada en sessionStorage('sabormap_fav_pending') cuando un usuario sin
   sesión clickeó el corazón y fue redirigido a login. Se llama tras detectar
   una sesión válida (initFoodieSession + onAuthStateChange). Solo añade (nunca
   quita): si el place ya está en favoritos, simplemente limpia el flag. */
async function applyPendingFavorite() {
    if (!currentFoodie || !sbFoodies) return;
    let pid = null;
    try { pid = sessionStorage.getItem('sabormap_fav_pending'); } catch (e) { return; }
    if (!pid) return;
    try { sessionStorage.removeItem('sabormap_fav_pending'); } catch (e) {}
    pid = String(pid);
    if (foodieFavorites.has(pid)) return; // ya está favorito, nada que hacer
    try {
        await toggleFavorite(pid);
    } catch (e) {
        console.warn('[foodies] applyPendingFavorite:', e);
    }
}

/* foodieProfileForHome — cache mínimo del perfil del comensal para
   mostrar el avatar en el botón de la home sin tener
   que llamar a loadFoodieProfile (que está en foodies-app.js y no
   está disponible aquí). Solo nos interesa avatar_url y display_name. */
let foodieProfileForHome = null;

/* [v2.1.1] currentFoodieDisplayName — nombre/apodo resuelto del comensal
   logueado, para mostrarlo en el navbar en lugar del placeholder
   "Mi cuenta". Se setea en loadFoodieProfileForHome() con un fallback
   en cascada si falta el dato. */
let currentFoodieDisplayName = '';

/* [v2.1.1] resolveFoodieDisplayName — devuelve el nombre/apodo a mostrar
   en el navbar, con fallback en cascada:
     a) foodieProfileForHome.display_name  (tabla `foodies`)
     b) currentFoodie.user_metadata.display_name  (auth metadata al signup)
     c) currentFoodie.user_metadata.full_name     (compatibilidad futura)
     d) parte local del email (antes del @)
     e) 'Comensal'  (último recurso, nunca null)
   No lanza excepciones; siempre devuelve un string no vacío si hay sesión. */
function resolveFoodieDisplayName() {
    if (!currentFoodie) return '';
    // a) display_name de la tabla foodies
    if (foodieProfileForHome && foodieProfileForHome.display_name) {
        return String(foodieProfileForHome.display_name).trim();
    }
    // b) user_metadata.display_name (lo que puso en el formulario de signup)
    const meta = currentFoodie.user_metadata || {};
    if (meta.display_name && String(meta.display_name).trim()) {
        return String(meta.display_name).trim();
    }
    // c) user_metadata.full_name (compatibilidad con dashboard/owners)
    if (meta.full_name && String(meta.full_name).trim()) {
        return String(meta.full_name).trim();
    }
    // d) parte local del email
    if (currentFoodie.email) {
        const local = String(currentFoodie.email).split('@')[0];
        if (local && local.trim()) return local.trim();
    }
    // e) último recurso
    return 'Comensal';
}

/* [v2.1.1] renderFoodieIdentity — actualiza el botón #foodieAuthBtn del
   navbar con el nombre/apodo del comensal logueado. Reutiliza
   updateAuthButton() para la estructura y refina el texto. Es
   idempotente: se puede llamar cuantas veces sea necesario.
   Escape: usa _escFoodieAttr() para el atributo y escapeHtmlLight()
   para el contenido texto, evitando XSS. */
function renderFoodieIdentity() {
    if (!currentFoodie) {
        updateAuthButton(false);
        return;
    }
    // Resolver el nombre y guardarlo en la variable global
    currentFoodieDisplayName = resolveFoodieDisplayName();
    // Llamar a updateAuthButton(true) que ahora usa currentFoodieDisplayName
    updateAuthButton(true);
}

async function loadFoodieProfileForHome() {
    if (!sbFoodies || !currentFoodie) return;
    try {
        const { data, error } = await sbFoodies
            .from('foodies')
            .select('display_name, avatar_url')
            .eq('id', currentFoodie.id)
            .maybeSingle();
        if (error) {
            console.warn('[foodies] loadFoodieProfileForHome:', error);
            return;
        }
        foodieProfileForHome = data || { display_name: null, avatar_url: null };
        // [v2.1.1] Resolver y cachear el display name para el navbar
        currentFoodieDisplayName = resolveFoodieDisplayName();
        // Re-render del navbar con el nombre ya resuelto
        renderFoodieIdentity();
    } catch (e) {
        console.warn('[foodies] loadFoodieProfileForHome:', e);
    }
}

/* loadFoodieFavorites — trae los favoritos del comensal y los guarda en
   el Set `foodieFavorites` (de place_id como string). */
async function loadFoodieFavorites() {
    if (!sbFoodies || !currentFoodie) return;
    try {
        const { data, error } = await sbFoodies
            .from('favorites')
            .select('place_id')
            .eq('foodie_id', currentFoodie.id);
        if (error) throw error;
        foodieFavorites = new Set((data || []).map(f => String(f.place_id)));
        foodieFavoritesLoaded = true; // [FIX favoritos] marca carga OK; si esto queda false, onAuthStateChange reintentará
    } catch (e) {
        // [FIX favoritos] dejar foodieFavoritesLoaded=false para que el próximo
        //   evento de auth (INITIAL_SESSION/TOKEN_REFRESHED) reintente la carga
        //   en vez de quedarse con un Set vacío que causaría violaciones UNIQUE
        //   al re-favoritar (bug "no se pudo actualizar el favorito").
        foodieFavoritesLoaded = false;
        console.warn('[foodies] loadFoodieFavorites:', e);
    }
}

/* ───────────────────────────────────────────────────────────────────
   MIS LISTAS + MIS FOTOS — funciones para el drawer de la home.
   La home NO carga foodies-app.js (solo app.js), así que estas funciones
   duplican la lógica del panel usando el mismo sbFoodies + currentFoodie.
   ─────────────────────────────────────────────────────────────────── */
async function loadFoodieCollections() {
    if (!sbFoodies || !currentFoodie) return [];
    const { data, error } = await sbFoodies
        .from('collections')
        .select('*, list_items(*)')
        .eq('foodie_id', currentFoodie.id)
        .order('created_at', { ascending: false });
    if (error) { console.warn('[foodies] loadFoodieCollections:', error.message); return []; }
    (data || []).forEach(c => {
        if (Array.isArray(c.list_items)) c.list_items.sort((a, b) => new Date(b.added_at) - new Date(a.added_at));
        else c.list_items = [];
    });
    return data || [];
}
window.loadFoodieCollections = loadFoodieCollections;

async function createCollection(name) {
    if (!sbFoodies || !currentFoodie) return null;
    const clean = (name || '').trim();
    if (!clean) { showToast('Escribe un nombre para la lista'); return null; }
    if (clean.length > 60) { showToast('Máximo 60 caracteres'); return null; }
    const { data, error } = await sbFoodies
        .from('collections')
        .insert({ foodie_id: currentFoodie.id, name: clean })
        .select().single();
    if (error) { showToast('No se pudo crear la lista: ' + error.message); return null; }
    return data;
}
window.createCollection = createCollection;

async function addPlaceToCollection(collectionId, placeId, placeSource, placeName) {
    if (!sbFoodies || !currentFoodie) return false;
    const { error } = await sbFoodies
        .from('list_items')
        .upsert({
            collection_id: collectionId,
            foodie_id: currentFoodie.id,
            place_id: String(placeId),
            place_source: placeSource || 'static',
            place_name_snapshot: placeName || null
        }, { onConflict: 'collection_id,place_id,place_source' });
    if (error) {
        const m = (error.message || '').toLowerCase();
        if (m.includes('duplicate') || m.includes('unique')) { showToast('Ya está en esta lista'); return true; }
        showToast('No se pudo añadir: ' + error.message); return false;
    }
    return true;
}
window.addPlaceToCollection = addPlaceToCollection;

// Redimensiona manteniendo ratio (fit). Reutiliza AVATAR_QUALITY si está
// definido (foodies-app.js lo define; en la home no, hence el fallback 0.85).
function _resizePlacePhotoFile(file, maxW) {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) return reject(new Error('No es una imagen'));
        const img = new Image();
        const objUrl = URL.createObjectURL(file);
        const q = (typeof AVATAR_QUALITY !== 'undefined') ? AVATAR_QUALITY : 0.85;
        img.onload = function () {
            URL.revokeObjectURL(objUrl);
            try {
                let w = img.naturalWidth || img.width;
                let h = img.naturalHeight || img.height;
                if (w > maxW) { h = Math.max(1, Math.round(h * maxW / w)); w = maxW; }
                const canvas = document.createElement('canvas');
                canvas.width = w; canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, w, h);
                ctx.drawImage(img, 0, 0, w, h);
                canvas.toBlob(function (blob) {
                    if (!blob) return reject(new Error('No se pudo generar el blob'));
                    resolve(new File([blob], 'photo.jpg', { type: 'image/jpeg' }));
                }, 'image/jpeg', q);
            } catch (e) { reject(e); }
        };
        img.onerror = function () { URL.revokeObjectURL(objUrl); reject(new Error('No se pudo cargar la imagen')); };
        img.src = objUrl;
    });
}

async function uploadPlacePhoto(file, placeId, placeSource, placeName, caption) {
    if (!sbFoodies || !currentFoodie) return { ok: false, error: 'Sin sesión' };
    if (!file) return { ok: false, error: 'No se recibió archivo' };
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) return { ok: false, error: 'Formato no soportado. Usa JPG, PNG o WebP.' };
    if (file.size > 5 * 1024 * 1024) return { ok: false, error: 'La foto supera los 5 MB.' };
    try {
        const resized = await _resizePlacePhotoFile(file, 1280);
        if (!resized) return { ok: false, error: 'No se pudo procesar la imagen.' };
        const path = currentFoodie.id + '/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.jpg';
        const { error: upErr } = await sbFoodies.storage
            .from('place-photos').upload(path, resized, { contentType: 'image/jpeg', cacheControl: '3600', upsert: false });
        if (upErr) throw upErr;
        const { data: urlData } = sbFoodies.storage.from('place-photos').getPublicUrl(path);
        if (!urlData || !urlData.publicUrl) throw new Error('No se pudo obtener la URL pública');
        const finalUrl = urlData.publicUrl + '?t=' + Date.now();
        const { data: row, error: insErr } = await sbFoodies
            .from('place_photos')
            .insert({ foodie_id: currentFoodie.id, place_id: String(placeId), place_source: placeSource || 'static', place_name_snapshot: placeName || null, url: finalUrl, caption: (caption || '').trim() || null, status: 'pending' })
            .select().single();
        if (insErr) throw insErr;
        return { ok: true, photo: row };
    } catch (e) {
        console.error('[foodies] uploadPlacePhoto:', e);
        const msg = (e.message || '').toLowerCase();
        if (msg.includes('policy') || msg.includes('permission') || msg.includes('rls'))
            return { ok: false, error: 'El bucket "place-photos" no tiene RLS configurado. Ejecuta el SQL.' };
        if (msg.includes('bucket not found') || msg.includes('not found'))
            return { ok: false, error: 'El bucket "place-photos" no existe. Créalo en Supabase → Storage.' };
        return { ok: false, error: e.message || 'No se pudo subir la foto' };
    }
}
window.uploadPlacePhoto = uploadPlacePhoto;

/* updateAuthButton — cambia el botón #foodieAuthBtn del header según
   si hay sesión o no. Muestra avatar mini si hay foto, icono si no.
   [v2.1.1] Cuando hay sesión, muestra el nombre/apodo del comensal
   (currentFoodieDisplayName) en lugar del placeholder "Mi cuenta".
   El nombre se trunca con CSS (text-overflow: ellipsis) para no romper
   el layout del navbar. Si currentFoodieDisplayName está vacío (perfil
   aún cargando), cae a "Mi cuenta" como placeholder temporal.
   El botón debe existir en index.html (ver README). */
function updateAuthButton(isLoggedIn) {
    const btn = document.getElementById('foodieAuthBtn');
    if (!btn) return; // Si la home no incluye el botón, no hacer nada
    if (isLoggedIn) {
        const avatarUrl = foodieProfileForHome && foodieProfileForHome.avatar_url;
        // [v2.1.1] Resolver el nombre a mostrar con placeholder temporal
        const rawName = currentFoodieDisplayName || resolveFoodieDisplayName() || 'Mi cuenta';
        const safeName = escapeHtmlLight(rawName);
        const isNameReady = rawName && rawName !== 'Mi cuenta' && rawName !== 'Comensal';
        const label = isNameReady ? 'Hola, ' + safeName : safeName;
        const ariaLabel = isNameReady
            ? 'Sesión de ' + safeName + ' — Ir a Mi SaborMap'
            : 'Ir a Mi SaborMap';
        // Span con truncamiento CSS para nombres largos (max 140px ≈ 20 chars)
        const nameSpanStyle = 'max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:inline-block;vertical-align:middle';
        if (avatarUrl) {
            // Botón con avatar mini circular + nombre
            btn.innerHTML =
                '<img src="' + _escFoodieAttr(avatarUrl) + '" alt="" ' +
                'style="width:22px;height:22px;border-radius:50%;object-fit:cover;border:1px solid rgba(255,255,255,0.2);margin-right:6px" ' +
                'onerror="this.style.display=\'none\';this.parentNode.querySelector(\'i\').style.display=\'\'"> ' +
                '<i class="fas fa-user-circle" style="font-size:0.85rem;margin-right:4px;display:none"></i>' +
                '<span id="navUserName" style="' + nameSpanStyle + '">' + label + '</span>';
        } else {
            btn.innerHTML = '<i class="fas fa-user-circle" style="font-size:0.85rem;margin-right:4px"></i>' +
                '<span id="navUserName" style="' + nameSpanStyle + '">' + label + '</span>';
        }
        btn.setAttribute('href', 'mi-sabormap.html');
        btn.setAttribute('aria-label', ariaLabel);
        btn.setAttribute('title', isNameReady ? 'Hola, ' + rawName : 'Mi cuenta');
    } else {
        // [v2.1.1] Sin sesión: comportamiento original
        currentFoodieDisplayName = '';
        btn.innerHTML = '<i class="fas fa-sign-in-alt" style="font-size:0.82rem;margin-right:4px"></i> <span>Entrar</span>';
        btn.setAttribute('href', 'cuenta.html');
        btn.setAttribute('aria-label', 'Iniciar sesión como comensal');
        btn.setAttribute('title', 'Entra a tu cuenta de comensal');
    }
}

/* toggleFavorite — añade o quita un place de los favoritos del comensal.
   - Si no hay sesión, redirige a cuenta.html (con retorno a la home).
   - Actualiza el Set foodieFavorites y el UI de TODOS los botones corazón
     que correspondan a este place (cards + drawer).
   - `fromDrawer` (bool) indica si el click vino del botón del drawer; en
     ese caso no hay que refrescar la grilla. */
async function toggleFavorite(placeId, fromDrawer) {
    if (!sbFoodies) {
        showToast('Función no disponible por el momento');
        return;
    }
    if (!currentFoodie) {
        showToast('Inicia sesión para guardar favoritos');
        // Guardar intención: tras login, volver a la home
        try { sessionStorage.setItem('sabormap_fav_pending', String(placeId)); } catch (e) {}
        setTimeout(() => { window.location.href = 'cuenta.html?return=home'; }, 1000);
        return;
    }
    const pid = String(placeId);
    const place = staticPlaces.find(p => String(p.id) === pid);
    const placeName = place ? place.name : '';
    const placeSource = place && place._fromDb ? 'supabase' : 'static';

    try {
        if (foodieFavorites.has(pid)) {
            const { error } = await sbFoodies
                .from('favorites')
                .delete()
                .eq('foodie_id', currentFoodie.id)
                .eq('place_id', pid);
            if (error) throw error;
            foodieFavorites.delete(pid);
            showToast('Quitado de favoritos');
        } else {
            // [FIX favoritos] upsert idempotente con ignoreDuplicates. Antes era
            //   .insert() plano: si el Set estaba stale (carga fallida, o favorito
            //   creado desde otra pestaña/dispositivo), el INSERT chocaba con el
            //   UNIQUE(foodie_id, place_id) → error "No se pudo actualizar el
            //   favorito". Ahora, si la fila ya existe, no se inserta ni se
            //   errora; simplemente marcamos como favorito en el Set y la UI.
            const { error } = await sbFoodies
                .from('favorites')
                .upsert(
                    {
                        foodie_id: currentFoodie.id,
                        place_id: pid,
                        place_name_snapshot: placeName,
                        place_source: placeSource
                    },
                    { onConflict: 'foodie_id,place_id', ignoreDuplicates: true }
                );
            if (error) throw error;
            foodieFavorites.add(pid);
            showToast('Añadido a favoritos ❤');
        }
        // Actualizar UI: cards + drawer
        document.querySelectorAll('.fav-btn[data-place-id="' + _escFoodieAttr(pid) + '"]').forEach(btn => {
            const isFav = foodieFavorites.has(pid);
            btn.classList.toggle('favorited', isFav);
            btn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
            btn.setAttribute('aria-label', isFav ? 'Quitar de favoritos' : 'Guardar en favoritos');
            const icon = btn.querySelector('i');
            if (icon) icon.className = (isFav ? 'fas' : 'far') + ' fa-heart';
        });
        const drawerBtn = document.getElementById('drawerFavBtn');
        if (drawerBtn && drawerBtn.dataset.placeId === pid) {
            const isFav = foodieFavorites.has(pid);
            drawerBtn.classList.toggle('favorited', isFav);
            drawerBtn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
            drawerBtn.setAttribute('aria-label', isFav ? 'Quitar de favoritos' : 'Guardar en favoritos');
            const icon = drawerBtn.querySelector('i');
            if (icon) icon.className = (isFav ? 'fas' : 'far') + ' fa-heart';
        }
    } catch (e) {
        // [FIX favoritos] extraer code/message del error de Supabase/PostgREST
        //   para que el fallo deje huella diagnosticable (antes solo se logueaba
        //   el objeto y el toast era genérico → sensación de "falla silenciosa").
        const code = e && e.code;
        const msg = e && e.message;
        console.error('[foodies] toggleFavorite failed:', {
            code, message: msg, pid,
            foodieId: currentFoodie && currentFoodie.id,
            wasFav: foodieFavorites.has(pid),
            error: e
        });
        showToast('No se pudo actualizar el favorito' + (code ? ` (${code})` : ''), true);
        // [FIX favoritos] Si falló un alta/baja pero el Set quedó inconsistente
        //   con la DB (p.ej. la fila ya existía por otro camino), recargar para
        //   sincronizar y reflejar el estado real en corazones y drawer.
        if (currentFoodie) {
            loadFoodieFavorites().then(() => {
                document.querySelectorAll('.fav-btn[data-place-id="' + _escFoodieAttr(pid) + '"]').forEach(btn => {
                    const isFav = foodieFavorites.has(pid);
                    btn.classList.toggle('favorited', isFav);
                    btn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
                    btn.setAttribute('aria-label', isFav ? 'Quitar de favoritos' : 'Guardar en favoritos');
                    const icon = btn.querySelector('i');
                    if (icon) icon.className = (isFav ? 'fas' : 'far') + ' fa-heart';
                });
                const drawerBtn = document.getElementById('drawerFavBtn');
                if (drawerBtn && drawerBtn.dataset.placeId === pid) {
                    const isFav = foodieFavorites.has(pid);
                    drawerBtn.classList.toggle('favorited', isFav);
                    drawerBtn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
                    drawerBtn.setAttribute('aria-label', isFav ? 'Quitar de favoritos' : 'Guardar en favoritos');
                    const icon = drawerBtn.querySelector('i');
                    if (icon) icon.className = (isFav ? 'fas' : 'far') + ' fa-heart';
                }
            }).catch(() => {});
        }
    }
}
window.toggleFavorite = toggleFavorite;

/* ───────────────────────────────────────────────────────────────────
   Drawer — "Añadir a lista" + "Subir foto"  (Mis listas / Mis fotos)
   El modal se construye en JS (sin tocar el HTML de index.html) y su
   CSS se inyecta una sola vez en <head>.
   ─────────────────────────────────────────────────────────────────── */
(function injectComensalDrawerCSS() {
    if (document.getElementById('comensal-drawer-css')) return;
    const css = `
    .drawer-comensal-actions { margin-bottom: 24px; }
    .drawer-action-row { display:flex; gap:10px; flex-wrap:wrap; }
    .drawer-action-btn {
        flex:1; min-width:150px; display:inline-flex; align-items:center; justify-content:center; gap:8px;
        padding:11px 14px; border-radius:12px; border:1px solid var(--border);
        background:var(--card); color:var(--cream); font-size:0.85rem; font-weight:600; cursor:pointer;
        transition:all .2s;
    }
    .drawer-action-btn:hover { border-color:var(--accent); color:var(--accent); background:var(--accent-soft, rgba(139,92,246,0.08)); }
    .atl-overlay {
        position:fixed; inset:0; z-index:100000; background:rgba(5,7,15,0.7);
        display:flex; align-items:center; justify-content:center; padding:20px;
        animation: atlFadeIn .2s ease;
    }
    .atl-modal {
        width:100%; max-width:440px; max-height:85vh; overflow:auto; background:#111628;
        border:1px solid #2a2f4a; border-radius:18px; padding:24px;
        box-shadow:0 20px 60px rgba(0,0,0,0.5);
    }
    .atl-title { font-size:1.2rem; font-weight:700; color:#f1f5f9; margin:0 0 4px; }
    .atl-sub { font-size:0.82rem; color:#94a3b8; margin:0 0 16px; }
    .atl-create-row { display:flex; gap:8px; margin-bottom:16px; }
    .atl-create-input {
        flex:1; padding:10px 12px; border-radius:10px; border:1px solid #2a2f4a;
        background:#171d35; color:#f1f5f9; font-size:0.88rem;
    }
    .atl-create-input:focus { outline:none; border-color:#8b5cf6; }
    .atl-list { display:flex; flex-direction:column; gap:8px; }
    .atl-item {
        display:flex; align-items:center; justify-content:space-between; gap:10px;
        padding:12px 14px; border-radius:11px; border:1px solid #2a2f4a;
        background:#171d35; cursor:pointer; transition:all .15s;
    }
    .atl-item:hover { border-color:#8b5cf6; background:rgba(139,92,246,0.08); }
    .atl-item-name { font-size:0.92rem; font-weight:600; color:#f1f5f9; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .atl-item-count { font-size:0.74rem; color:#94a3b8; flex-shrink:0; }
    .atl-close { margin-top:18px; width:100%; padding:11px; border-radius:11px; border:1px solid #2a2f4a; background:transparent; color:#94a3b8; cursor:pointer; font-size:0.88rem; }
    @keyframes atlFadeIn { from { opacity:0 } to { opacity:1 } }
    `;
    const style = document.createElement('style');
    style.id = 'comensal-drawer-css';
    style.textContent = css;
    document.head.appendChild(style);
})();

let _addToListContext = null; // { placeId, placeSource, placeName }
let _atlToken = 0;            // [FIX v2.0.27] abort token: descarta renders de aperturas anteriores
let _atlEscInstalled = false; // [FIX v2.0.27] el handler de Esc se instala una sola vez

function escapeHtmlLight(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

async function openAddToList(placeId, placeSource, placeName) {
    if (!sbFoodies) { showToast('Función no disponible por el momento'); return; }
    if (!currentFoodie) {
        showToast('Inicia sesión para usar tus listas');
        try { sessionStorage.setItem('sabormap_atl_pending', JSON.stringify({ placeId: String(placeId), placeSource: placeSource, placeName: placeName })); } catch (e) {}
        setTimeout(() => { window.location.href = 'cuenta.html?return=home'; }, 1000);
        return;
    }
    const token = ++_atlToken; // [FIX v2.0.27] invalida aperturas anteriores
    _addToListContext = { placeId: String(placeId), placeSource: placeSource || 'static', placeName: placeName || '' };
    _installAtlEscOnce();
    _renderAddToListModal([], true);
    const cols = await loadFoodieCollections();
    if (token !== _atlToken) return; // otra apertura la canceló: no pintar datos stale
    _renderAddToListModal(cols, false);
}
window.openAddToList = openAddToList;

// [FIX v2.0.27] Handler de Esc único para el modal "Añadir a lista".
// Se instala una sola vez y comprueba si el overlay existe antes de actuar.
function _installAtlEscOnce() {
    if (_atlEscInstalled) return;
    _atlEscInstalled = true;
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('atlOverlay')) _closeAddToList();
    });
}

function _renderAddToListModal(cols, loading) {
    const old = document.getElementById('atlOverlay');
    if (old) old.remove();
    const ctx = _addToListContext || { placeId: '', placeSource: 'static', placeName: '' };
    const overlay = document.createElement('div');
    overlay.id = 'atlOverlay';
    overlay.className = 'atl-overlay';
    overlay.innerHTML = `
        <div class="atl-modal" role="dialog" aria-modal="true" aria-label="Añadir a lista">
            <h3 class="atl-title">Añadir a una lista</h3>
            <p class="atl-sub">${ctx.placeName ? escapeHtmlLight(ctx.placeName) : 'Este local'}</p>
            <div class="atl-create-row">
                <input type="text" id="atlNewName" class="atl-create-input" placeholder="Crear lista nueva…" maxlength="60">
                <button class="btn btn-primary" id="atlCreateBtn">Crear</button>
            </div>
            <div class="atl-list" id="atlList">
                ${loading ? '<p style="color:#94a3b8;font-size:0.85rem;text-align:center;padding:12px">Cargando tus listas…</p>' :
                  cols.length === 0 ? '<p style="color:#94a3b8;font-size:0.85rem;text-align:center;padding:12px">Aún no tienes listas. Crea una arriba.</p>' :
                  cols.map(c => `
                    <div class="atl-item" data-cid="${c.id}">
                        <span class="atl-item-name">${escapeHtmlLight(c.name)}</span>
                        <span class="atl-item-count">${(c.list_items || []).length} lug.</span>
                    </div>`).join('')}
            </div>
            <button class="atl-close" id="atlClose">Cerrar</button>
        </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) _closeAddToList(); });
    document.getElementById('atlClose').addEventListener('click', _closeAddToList);
    document.getElementById('atlCreateBtn').addEventListener('click', _handleAtlCreate);
    overlay.querySelectorAll('.atl-item').forEach(el => {
        el.addEventListener('click', () => _handleAtlPick(el.dataset.cid, el.querySelector('.atl-item-name').textContent));
    });
    const inp = document.getElementById('atlNewName');
    if (inp) {
        inp.focus();
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') _handleAtlCreate(); });
    }
    // [FIX v2.0.27] El handler de Esc se instala una sola vez vía _installAtlEscOnce
    // (antes se registraba por cada render → 2 listeners/apertura que no se quitaban
    // al cerrar con botón/overlay → leak + race entre aperturas).
}

async function _handleAtlCreate() {
    const inp = document.getElementById('atlNewName');
    if (!inp) return;
    const name = inp.value.trim();
    if (!name) { showToast('Escribe un nombre para la lista'); inp.focus(); return; }
    const created = await createCollection(name);
    if (created) {
        if (_addToListContext) {
            const ok = await addPlaceToCollection(created.id, _addToListContext.placeId, _addToListContext.placeSource, _addToListContext.placeName);
            showToast(ok ? 'Lista creada y local añadido' : 'Lista creada');
        } else {
            showToast('Lista creada');
        }
        _closeAddToList();
    }
}

async function _handleAtlPick(cid, cname) {
    if (!_addToListContext) return;
    const ok = await addPlaceToCollection(cid, _addToListContext.placeId, _addToListContext.placeSource, _addToListContext.placeName);
    if (ok) showToast('Añadido a "' + cname + '"');
    _closeAddToList();
}

function _closeAddToList() {
    const o = document.getElementById('atlOverlay');
    if (o) o.remove();
    _addToListContext = null;
}

// Subir foto: crea un <input type=file> efímero y dispara la subida
function triggerDrawerPhotoUpload(placeId, placeSource, placeName) {
    if (!sbFoodies) { showToast('Función no disponible por el momento'); return; }
    if (!currentFoodie) {
        showToast('Inicia sesión para subir fotos');
        setTimeout(() => { window.location.href = 'cuenta.html?return=home'; }, 1000);
        return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.style.display = 'none';
    input.addEventListener('change', () => {
        const file = input.files && input.files[0];
        if (file) handleDrawerPhotoUpload(file, String(placeId), placeSource || 'static', placeName || '');
        input.remove();
    });
    input.addEventListener('cancel', () => input.remove()); // [FIX v2.0.27] limpia el input si el usuario cancela el picker
    document.body.appendChild(input);
    input.click();
}
window.triggerDrawerPhotoUpload = triggerDrawerPhotoUpload;

async function handleDrawerPhotoUpload(file, placeId, placeSource, placeName) {
    showToast('Subiendo foto…');
    const result = await uploadPlacePhoto(file, placeId, placeSource, placeName, '');
    if (result.ok) {
        showToast('Foto subida. Se publicará tras moderación.');
    } else {
        showToast(result.error || 'No se pudo subir la foto');
    }
}
window.handleDrawerPhotoUpload = handleDrawerPhotoUpload;

/* renderReviewsInDrawer — fetchea las reseñas publicadas de un place
   y las pinta en el contenedor #drawerReviewsList del drawer.
   También actualiza el contador #drawerReviewsCount. */
/* [v2.1.2] _initialsFromName — devuelve las iniciales (máx 2) de un
   nombre/apodo. Se usa para el avatar del autor de la reseña cuando no
   hay foto. Versión local (getInitials está en foodies-app.js, no
   disponible en la home). */
function _initialsFromName(name) {
    if (!name) return '?';
    return String(name).trim().split(/\s+/)
        .map(function (w) { return w[0] || ''; })
        .join('')
        .substring(0, 2)
        .toUpperCase();
}

/* [v2.1.2] _fetchReviewAuthorNames — bulk-fetch de display_name e
   is_public para los autores de las reseñas visibles en el drawer.
   Devuelve un objeto { foodie_id: { display_name, is_public } }.
   No lanza excepciones; en caso de error devuelve objeto vacío y el
   caller cae a "Comensal" (nunca "Comensal de SaborMap"). */
async function _fetchReviewAuthorNames(reviews) {
    const authorMap = {};
    if (!sbFoodies || !reviews || reviews.length === 0) return authorMap;
    // Recolectar foodie_ids únicos (excluir null/undefined)
    const seen = {};
    const foodieIds = [];
    for (let i = 0; i < reviews.length; i++) {
        const fid = reviews[i].foodie_id;
        if (fid && !seen[fid]) { seen[fid] = true; foodieIds.push(fid); }
    }
    if (foodieIds.length === 0) return authorMap;
    try {
        const { data, error } = await sbFoodies
            .from('foodies')
            .select('id, display_name, is_public')
            .in('id', foodieIds);
        if (error) {
            console.warn('[foodies] _fetchReviewAuthorNames:', error);
            return authorMap;
        }
        (data || []).forEach(function (a) { authorMap[a.id] = a; });
    } catch (e) {
        console.warn('[foodies] _fetchReviewAuthorNames:', e);
    }
    return authorMap;
}

async function renderReviewsInDrawer(placeId) {
    const list = document.getElementById('drawerReviewsList');
    const countEl = document.getElementById('drawerReviewsCount');
    if (!list || !sbFoodies) return;
    const pid = String(placeId);
    // Cache por sesión de drawer: { reviews, authorMap }
    if (foodieReviewsCache.has(pid)) {
        const cached = foodieReviewsCache.get(pid);
        _paintReviewsInDrawer(cached.reviews || cached, list, countEl, cached.authorMap);
        return;
    }
    try {
        const { data, error } = await sbFoodies
            .from('reviews')
            .select('id, foodie_id, rating, body, status, created_at')
            .eq('place_id', pid)
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(50);
        if (error) throw error;
        const reviews = data || [];
        // [v2.1.2] Bulk-fetch de los display_name de los autores
        const authorMap = await _fetchReviewAuthorNames(reviews);
        foodieReviewsCache.set(pid, { reviews: reviews, authorMap: authorMap });
        _paintReviewsInDrawer(reviews, list, countEl, authorMap);
    } catch (e) {
        console.warn('[foodies] renderReviewsInDrawer:', e);
        list.innerHTML = '<p style="color:var(--muted);font-size:0.85rem;text-align:center;padding:14px 0">No se pudieron cargar las reseñas. Revisa tu conexión.</p>';
        if (countEl) countEl.textContent = '—';
    }
}

function _paintReviewsInDrawer(reviews, listEl, countEl, authorMap) {
    if (countEl) countEl.textContent = String(reviews.length);
    if (reviews.length === 0) {
        listEl.innerHTML = '<p style="color:var(--muted);font-size:0.85rem;text-align:center;padding:14px 0">Aún no hay reseñas. ¡Sé el primero en compartir tu experiencia!</p>';
        return;
    }
    authorMap = authorMap || {};
    listEl.innerHTML = reviews.map(r => {
        const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        const date = new Date(r.created_at).toLocaleDateString('es-CU', { day: '2-digit', month: 'short', year: 'numeric' });
        // [v2.1.2] Resolver el label del autor con el nombre real:
        //   - Reseña propia → "Tu reseña"
        //   - Autor con perfil público + display_name → nombre real
        //   - Autor sin perfil público o sin display_name → "Comensal"
        //   NUNCA "Comensal de SaborMap" (eliminado v2.1.2).
        const isOwnReview = currentFoodie && currentFoodie.id === r.foodie_id;
        const author = authorMap[r.foodie_id];
        let authorLabel, authorInitials;
        if (isOwnReview) {
            authorLabel = '<strong>Tu reseña</strong>';
            authorInitials = '★';
        } else if (author && author.display_name && author.is_public !== false) {
            const safeName = escapeHtmlLight(author.display_name);
            authorLabel = '<strong>' + safeName + '</strong>';
            authorInitials = escapeHtmlLight(_initialsFromName(author.display_name));
        } else {
            authorLabel = 'Comensal';
            authorInitials = '★';
        }
        const reportBtn = (currentFoodie && currentFoodie.id !== r.foodie_id)
            ? `<button class="drawer-review-report" onclick="reportReview('${_escFoodieAttr(r.id)}')">Reportar</button>`
            : '';
        return `
            <div class="drawer-review-card">
                <div class="drawer-review-head">
                    <div class="drawer-review-avatar">${authorInitials}</div>
                    <div>
                        <div class="drawer-review-author">${authorLabel}</div>
                        <div class="drawer-review-date">${date}</div>
                    </div>
                </div>
                <div class="drawer-review-stars">${stars}</div>
                ${r.body ? `<div class="drawer-review-body">${_escFoodieHtml(r.body)}</div>` : ''}
                <div class="drawer-review-actions">${reportBtn}</div>
            </div>
        `;
    }).join('');
}

/* openReviewFormInline — abre el formulario inline de reseña en el drawer.
   Si no hay sesión, redirige a cuenta.html. */
function openReviewFormInline(placeId, placeSource, placeName) {
    if (!sbFoodies) { showToast('Función no disponible', true); return; }
    if (!currentFoodie) {
        showToast('Inicia sesión para escribir una reseña');
        try { sessionStorage.setItem('sabormap_review_pending', JSON.stringify({ placeId, placeSource, placeName })); } catch (e) {}
        setTimeout(() => { window.location.href = 'cuenta.html?return=home'; }, 1000);
        return;
    }
    const form = document.getElementById('reviewFormInline');
    if (!form) return;
    form.classList.add('open');
    // Reset
    document.getElementById('reviewBodyInput').value = '';
    _setReviewStars(0); // [v2.0.28/A-05] clases + aria-pressed
    _reviewFormRating = 0;
    // Scroll al formulario
    setTimeout(() => form.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
}
window.openReviewFormInline = openReviewFormInline;

function closeReviewFormInline() {
    const form = document.getElementById('reviewFormInline');
    if (form) form.classList.remove('open');
}
window.closeReviewFormInline = closeReviewFormInline;

let _reviewFormRating = 0;
// [v2.0.28/A-05] helper: refresca clases + aria-pressed de las estrellas inline.
function _setReviewStars(rating) {
    document.querySelectorAll('#reviewStarInput i').forEach(s => {
        const v = parseInt(s.dataset.value, 10);
        const active = v <= rating;
        s.className = active ? 'fas fa-star active' : 'far fa-star';
        s.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
}
// Star input: click + hover
document.addEventListener('click', (e) => {
    const star = e.target.closest('#reviewStarInput i');
    if (!star) return;
    _reviewFormRating = parseInt(star.dataset.value, 10);
    _setReviewStars(_reviewFormRating);
});
// [v2.0.28/A-05] teclado: Enter/Espacio selecciona; flechas suben/bajan y
//   mueven el foco. Delegado en document como click/hover (las estrellas se
//   recrean al abrir el drawer de cada place).
document.addEventListener('keydown', (e) => {
    const star = e.target.closest && e.target.closest('#reviewStarInput i');
    if (!star) return;
    const v = parseInt(star.dataset.value, 10);
    let next = v;
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        next = v;
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        next = Math.min(5, v + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        next = Math.max(1, v - 1);
    } else {
        return;
    }
    _reviewFormRating = next;
    _setReviewStars(_reviewFormRating);
    const tgt = document.querySelector(`#reviewStarInput i[data-value="${next}"]`);
    if (tgt) { try { tgt.focus(); } catch (e2) {} }
});
document.addEventListener('mousemove', (e) => {
    const star = e.target.closest('#reviewStarInput i');
    if (!star) return;
    const v = parseInt(star.dataset.value, 10);
    document.querySelectorAll('#reviewStarInput i').forEach(s => {
        const sv = parseInt(s.dataset.value, 10);
        s.className = sv <= v ? 'fas fa-star' : 'far fa-star';
    });
});
// ★ FIX [v2.0.19-audit]: mouseleave NO burbujea en el DOM, así que un listener
//   en `document` nunca se dispara cuando el mouse sale del #reviewStarInput.
//   Cambiamos a `mouseout` (que SÍ burbujea) y verificamos que el mouse
//   realmente está saliendo del contenedor del star-input (no solo moviéndose
//   entre estrellas hijas). Esto hace que el reset de estrellas funcione.
document.addEventListener('mouseout', (e) => {
    const starInput = document.getElementById('reviewStarInput');
    if (!starInput) return;
    // Solo resetear si el mouse sale del star-input (no si se mueve entre estrellas)
    if (starInput.contains(e.target) && !starInput.contains(e.relatedTarget)) {
        _setReviewStars(_reviewFormRating); // [v2.0.28/A-05] clases + aria-pressed
    }
});

/* submitReviewInline — publica la reseña del comensal para el place
   actualmente abierto en el drawer. */
async function submitReviewInline() {
    if (!sbFoodies || !currentFoodie) {
        showToast('Inicia sesión para escribir una reseña', true);
        return;
    }
    const form = document.getElementById('reviewFormInline');
    if (!form) return;
    const placeId = form.dataset.placeId;
    const placeSource = form.dataset.placeSource;
    const placeName = form.dataset.placeName;
    const body = (document.getElementById('reviewBodyInput').value || '').trim();
    if (_reviewFormRating < 1) { showToast('Selecciona una puntuación (1-5 estrellas)', true); return; }
    if (body.length > 2000) { showToast('La reseña no puede exceder 2000 caracteres', true); return; }
    if (body.length > 0 && body.length < 10) { showToast('La reseña debe tener al menos 10 caracteres (o déjala vacía)', true); return; }

    try {
        const { data, error } = await sbFoodies
            .from('reviews')
            .insert({
                foodie_id: currentFoodie.id,
                place_id: placeId,
                place_name_snapshot: placeName,
                place_source: placeSource,
                rating: _reviewFormRating,
                body: body || null,
                status: 'published',
                photos: []
            })
            .select('id, foodie_id, rating, body, status, created_at');
        if (error) throw error;
        // Invalidar cache y re-renderizar
        foodieReviewsCache.delete(placeId);
        await renderReviewsInDrawer(placeId);
        closeReviewFormInline();
        showToast('¡Reseña publicada! Gracias por compartir tu experiencia.');
    } catch (e) {
        console.error('[foodies] submitReviewInline:', e);
        const msg = (e.message || '').includes('maximum of 5')
            ? 'Has publicado el máximo de 5 reseñas en las últimas 24 horas. Intenta más tarde.'
            : 'No se pudo publicar la reseña: ' + (e.message || 'error desconocido');
        showToast(msg, true);
    }
}
window.submitReviewInline = submitReviewInline;

/* reportReview — abre un prompt para reportar una reseña abusiva.
   El reporte se inserta en review_reports; el admin lo ve via service_role. */
async function reportReview(reviewId) {
    if (!sbFoodies || !currentFoodie) {
        showToast('Inicia sesión para reportar una reseña', true);
        return;
    }
    const reason = prompt('¿Por qué reportas esta reseña? (mín. 5 caracteres)\n\nEj: lenguaje ofensivo, spam, contenido falso, datos personales de terceros.');
    if (!reason) return;
    if (reason.trim().length < 5) { showToast('El motivo debe tener al menos 5 caracteres', true); return; }
    try {
        const { error } = await sbFoodies
            .from('review_reports')
            .insert({
                review_id: reviewId,
                reporter_id: currentFoodie.id,
                reason: reason.trim().substring(0, 500),
                status: 'open'
            });
        if (error) throw error;
        showToast('Reporte enviado. Nuestro equipo lo revisará en menos de 48 horas.');
    } catch (e) {
        console.error('[foodies] reportReview:', e);
        showToast('No se pudo enviar el reporte: ' + (e.message || ''), true);
    }
}
window.reportReview = reportReview;

/* ═══════════════════════════════════════════
   SERVICE WORKER + OFFLINE
   ═══════════════════════════════════════════ */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js', { scope: './' })
            .then(reg => {
                console.log('[SW] Registrado con scope:', reg.scope);
            })
            .catch(err => {
                console.error('[SW] Error al registrar:', err);
            });
    });

    // [W-02] Sin recarga automática (riesgo de bucle): se avisa al usuario
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        showToast('Sabormap se ha actualizado');
    });
}

/* ============================================================
   Detectar offline y avisar a la UI
   ============================================================ */
window.addEventListener('online', () => {
    showToast('Conexión restablecida');
    // ★ [v2.0.21] Recargar locales desde Supabase: refresca el cache local
    //   y actualiza la grilla si hay cambios (locales nuevos, edits, etc.).
    loadPlacesFromSupabase();
    // También refrescar colecciones por si cambiaron desde el dashboard
    if (typeof loadCollectionsFromSupabase === 'function') {
        loadCollectionsFromSupabase();
    }
});
window.addEventListener('offline', () => {
    showToast('Sin conexión — modo offline activo');
    // ★ [v2.0.21] Asegurar que el cache local esté cargado en staticPlaces.
    //   Si la página se cargó offline y el cache aún no se había inyectado
    //   (raro pero posible), lo cargamos ahora.
    if (typeof loadCachedPlacesIntoStatic === 'function') {
        const added = loadCachedPlacesIntoStatic();
        if (added > 0) {
            if (typeof renderPlaces === 'function') renderPlaces();
            if (typeof populateBarrios === 'function') populateBarrios();
            if (typeof updateStatNumbers === 'function') updateStatNumbers();
        }
    }
});

/* ═══════════════════════════════════════════════════════════════
   RULETA "¿Dónde comemos hoy?"  [v2.2.0]
   Ruleta animada (canvas) que selecciona un local al azar de entre
   los disponibles (filtrados o todos) y abre su ficha con openModal().
   Sin dependencias externas; respeta tema claro/oscuro, accesibilidad
   (focus trap, Esc, aria-live) y prefers-reduced-motion.
   ═══════════════════════════════════════════════════════════════ */

/* Estado interno (null cuando no hay modal abierto). */
var _rouletteState = null;

/* Paleta de colores para las porciones. Se usan valores hex directos
   porque las variables CSS no se resuelven dentro de canvas fillStyle.
   La paleta sigue el mismo orden cromático que MENU_SECTION_PALETTE. */
var _ROULETTE_COLORS = [
    '#8b5cf6', // violeta (--accent)
    '#06b6d4', // cian (--secondary)
    '#ec4899', // rosa (--pink)
    '#f59e0b', // ámbar (--amber)
    '#22c55e', // verde (--green)
    '#a855f7', // púrpura
    '#3b82f6', // azul
];

/* Máximo de porciones visibles (más de 12 no se lee). */
var _ROULETTE_MAX_SLICES = 12;

/* initRoulette — inyecta estilos y crea el FAB flotante. Idempotente. */
function initRoulette() {
    _injectRouletteStyles();
    _createRouletteFab();
}

/* Inyectar estilos una sola vez (mismo patrón que injectFoodiesStyles). */
function _injectRouletteStyles() {
    if (document.getElementById('sabormap-roulette-styles')) return;
    var style = document.createElement('style');
    style.id = 'sabormap-roulette-styles';
    style.textContent = `
        /* Botón flotante disparador */
        .roulette-fab {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9000;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            border: none;
            border-radius: 999px;
            background: linear-gradient(135deg, var(--accent, #8b5cf6), var(--secondary, #06b6d4));
            color: #fff;
            font-family: inherit;
            font-size: 0.88rem;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 8px 24px var(--accent-glow, rgba(139,92,246,0.3)), 0 2px 8px rgba(0,0,0,0.25);
            transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease;
        }
        .roulette-fab:hover {
            transform: translateY(-2px) scale(1.03);
            box-shadow: 0 12px 32px var(--accent-glow, rgba(139,92,246,0.4));
        }
        .roulette-fab:active { transform: scale(0.97); }
        .roulette-fab i { font-size: 1.05rem; }

        /* En móvil: solo icono, más compacto (no tapar otros elementos) */
        @media (max-width: 640px) {
            .roulette-fab {
                bottom: 20px;
                right: 20px;
                padding: 14px;
                gap: 0;
            }
            .roulette-fab span { display: none; }
        }

        /* Overlay del modal */
        .roulette-overlay {
            position: fixed;
            inset: 0;
            z-index: 100001;
            background: rgba(5, 7, 15, 0.78);
            -webkit-backdrop-filter: blur(6px);
            backdrop-filter: blur(6px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .roulette-overlay.open { opacity: 1; }

        [data-theme="light"] .roulette-overlay {
            background: rgba(0, 0, 0, 0.55);
        }

        /* Panel centrado */
        .roulette-panel {
            background: var(--card, #0f1320);
            border: 1px solid var(--border, #272d3f);
            border-radius: 20px;
            padding: 24px 22px;
            max-width: 380px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            text-align: center;
            transform: scale(0.88);
            transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .roulette-overlay.open .roulette-panel { transform: scale(1); }

        .roulette-title {
            font-size: 1.25rem;
            font-weight: 800;
            color: var(--cream, #f1f5f9);
            margin: 0 0 2px;
            letter-spacing: -0.01em;
        }
        .roulette-subtitle {
            font-size: 0.78rem;
            color: var(--muted, #94a3b8);
            margin: 0 0 14px;
        }

        /* Contenedor del canvas + aguja */
        .roulette-canvas-wrap {
            position: relative;
            width: 320px;
            max-width: 100%;
            aspect-ratio: 1;
            margin: 0 auto 12px;
        }
        .roulette-canvas {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            box-shadow: 0 0 0 4px var(--border, #272d3f), 0 8px 24px rgba(0,0,0,0.35);
        }
        /* Aguja/puntero fijo arriba (triángulo que apunta hacia abajo) */
        .roulette-pointer {
            position: absolute;
            top: -4px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 11px solid transparent;
            border-right: 11px solid transparent;
            border-top: 22px solid var(--accent, #8b5cf6);
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
            z-index: 2;
        }

        /* Panel de resultado (aria-live polite) */
        .roulette-result {
            min-height: 26px;
            margin-bottom: 14px;
            font-size: 0.92rem;
            font-weight: 700;
            color: var(--cream, #f1f5f9);
            line-height: 1.3;
            word-break: break-word;
        }
        .roulette-result.empty { color: transparent; }

        /* Botones */
        .roulette-actions {
            display: flex;
            gap: 10px;
            justify-content: center;
        }
        .roulette-btn {
            padding: 11px 22px;
            border: none;
            border-radius: 12px;
            font-family: inherit;
            font-size: 0.88rem;
            font-weight: 700;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .roulette-btn-primary {
            background: linear-gradient(135deg, var(--accent, #8b5cf6), var(--secondary, #06b6d4));
            color: #fff;
            box-shadow: 0 4px 14px var(--accent-glow, rgba(139,92,246,0.3));
        }
        .roulette-btn-primary:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px var(--accent-glow, rgba(139,92,246,0.45));
        }
        .roulette-btn-primary:disabled {
            opacity: 0.55;
            cursor: not-allowed;
        }
        .roulette-btn-secondary {
            background: var(--surface, #1a1f2e);
            color: var(--cream, #f1f5f9);
            border: 1px solid var(--border, #272d3f);
        }
        .roulette-btn-secondary:hover {
            border-color: var(--accent, #8b5cf6);
        }

        /* Responsive: panel más pequeño en pantallas muy bajas */
        @media (max-height: 640px) {
            .roulette-panel { padding: 16px; }
            .roulette-canvas-wrap { width: 240px; }
            .roulette-title { font-size: 1.05rem; }
        }
    `;
    document.head.appendChild(style);
}

/* Crear el botón flotante (FAB) una sola vez. */
function _createRouletteFab() {
    if (document.getElementById('rouletteFab')) return;
    var btn = document.createElement('button');
    btn.id = 'rouletteFab';
    btn.className = 'roulette-fab';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Abrir ruleta de locales');
    btn.title = '¿Dónde comemos hoy?';
    btn.innerHTML = '<i class="fas fa-dice" aria-hidden="true"></i><span>¿Dónde comemos?</span>';
    btn.addEventListener('click', openRoulette);
    document.body.appendChild(btn);
}

/* openRoulette — entrada pública (expuesta como window.openRoulette).
   Selecciona candidatos y abre el modal. */
function openRoulette() {
    /* Si ya está abierto, cerrar (toggle) */
    if (_rouletteState) { _closeRoulette(); return; }

    /* Selección de candidatos:
       - Si hay filtros activos y el resultado es un subconjunto (< total),
         usar los filtrados (la ruleta respeta el contexto del usuario).
       - Si no, usar staticPlaces (todos los locales). */
    var filtered = (typeof getFilteredPlaces === 'function') ? getFilteredPlaces() : [];
    var total = (typeof staticPlaces !== 'undefined') ? staticPlaces.length : 0;
    var candidates;
    if (filtered && filtered.length >= 2 && filtered.length < total) {
        candidates = filtered;
    } else {
        candidates = (typeof staticPlaces !== 'undefined') ? staticPlaces : [];
    }
    /* Excluir locales sin id (openModal no podría abrirlos) */
    candidates = candidates.filter(function (p) {
        return p && p.id != null && p.id !== '';
    });
    if (candidates.length < 2) {
        showToast('No hay suficientes locales para la ruleta');
        return;
    }
    _openRouletteModal(candidates);
}
window.openRoulette = openRoulette;

/* Abrir el modal con los candidatos dados. */
function _openRouletteModal(candidates) {
    /* --- Elegir ganador uniformemente entre TODOS los candidatos ---
       (no solo entre los 12 dibujados: el sorteo es justo sobre el total). */
    var winnerIdx = Math.floor(Math.random() * candidates.length);
    var winner = candidates[winnerIdx];

    /* --- Construir porciones visibles (máx 12) --- */
    var slices;
    if (candidates.length <= _ROULETTE_MAX_SLICES) {
        slices = candidates.slice();
    } else {
        /* Elegir 12 al azar (Fisher-Yates parcial) */
        var pool = candidates.slice();
        for (var i = pool.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
        }
        slices = pool.slice(0, _ROULETTE_MAX_SLICES);
        /* Si el ganador no está entre los 12 dibujados, sustituir una
           porción al azar por él ANTES de girar (sin corrección visual
           rara: el usuario ve el nombre del ganador en la ruleta desde
           el principio). */
        var inSlices = slices.some(function (s) { return String(s.id) === String(winner.id); });
        if (!inSlices) {
            var replaceIdx = Math.floor(Math.random() * _ROULETTE_MAX_SLICES);
            slices[replaceIdx] = winner;
        }
    }
    /* Índice de la porción ganadora dentro del array dibujado */
    var winSliceIdx = slices.findIndex(function (s) {
        return String(s.id) === String(winner.id);
    });

    /* --- Construir DOM --- */
    var overlay = document.createElement('div');
    overlay.className = 'roulette-overlay';
    overlay.id = 'rouletteOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'rouletteTitle');

    overlay.innerHTML = '\
        <div class="roulette-panel" role="document">\
            <h2 class="roulette-title" id="rouletteTitle">¿Dónde comemos hoy?</h2>\
            <p class="roulette-subtitle">' + candidates.length + ' locales participantes</p>\
            <div class="roulette-canvas-wrap">\
                <div class="roulette-pointer" aria-hidden="true"></div>\
                <canvas class="roulette-canvas" id="rouletteCanvas" aria-hidden="true"></canvas>\
            </div>\
            <div class="roulette-result empty" id="rouletteResult" aria-live="polite" role="status">&nbsp;</div>\
            <div class="roulette-actions">\
                <button type="button" class="roulette-btn roulette-btn-primary" id="rouletteSpinBtn" aria-busy="false">\
                    <i class="fas fa-rotate-right" aria-hidden="true"></i> Girar\
                </button>\
                <button type="button" class="roulette-btn roulette-btn-secondary" id="rouletteCloseBtn">Cerrar</button>\
            </div>\
        </div>';
    document.body.appendChild(overlay);

    /* --- Configurar canvas con DPR para nitidez en retina --- */
    var canvas = document.getElementById('rouletteCanvas');
    var displaySize = 320;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    var spinBtn = document.getElementById('rouletteSpinBtn');
    var closeBtn = document.getElementById('rouletteCloseBtn');
    var resultEl = document.getElementById('rouletteResult');

    /* --- Estado --- */
    _rouletteState = {
        overlay: overlay,
        canvas: canvas,
        ctx: ctx,
        spinBtn: spinBtn,
        closeBtn: closeBtn,
        resultEl: resultEl,
        slices: slices,
        winner: winner,
        winSliceIdx: winSliceIdx,
        candidates: candidates,
        displaySize: displaySize,
        currentRot: 0,
        rafId: null,
        resultTimer: null,
        spinning: false,
        closed: false,
        triggerEl: document.getElementById('rouletteFab'),
        escHandler: null,
        focusTrapHandler: null,
    };

    /* Dibujar ruleta inicial (sin rotación, sin resaltado) */
    _drawWheel(ctx, slices, 0, -1, displaySize);

    /* Forzar reflow + abrir con fade */
    void overlay.offsetWidth;
    overlay.classList.add('open');

    /* Foco inicial en "Girar" (accesibilidad) */
    setTimeout(function () { if (_rouletteState) spinBtn.focus(); }, 60);

    /* --- Listeners --- */
    spinBtn.addEventListener('click', _spinRoulette);
    closeBtn.addEventListener('click', function () { _closeRoulette(); });

    /* Click en overlay (fuera del panel) cierra */
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) _closeRoulette();
    });

    /* Esc cierra (captura para preceder a otros handlers) */
    _rouletteState.escHandler = function (e) {
        if (e.key === 'Escape' && _rouletteState && !_rouletteState.closed) {
            e.preventDefault();
            e.stopPropagation();
            _closeRoulette();
        }
    };
    document.addEventListener('keydown', _rouletteState.escHandler, true);

    /* Trampa de foco (Tab / Shift+Tab) */
    _rouletteState.focusTrapHandler = function (e) {
        if (!_rouletteState || _rouletteState.closed) return;
        if (e.key !== 'Tab') return;
        var focusables = [spinBtn, closeBtn];
        var active = document.activeElement;
        var idx = focusables.indexOf(active);
        if (idx === -1) { e.preventDefault(); spinBtn.focus(); return; }
        if (e.shiftKey && idx === 0) {
            e.preventDefault();
            focusables[focusables.length - 1].focus();
        } else if (!e.shiftKey && idx === focusables.length - 1) {
            e.preventDefault();
            focusables[0].focus();
        }
    };
    document.addEventListener('keydown', _rouletteState.focusTrapHandler);
}

/* _spinRoulette — arranca la animación del giro.
   El ángulo final se calcula a priori para que la aguja (fija arriba)
   caiga exactamente en el centro de la porción ganadora. */
function _spinRoulette() {
    var s = _rouletteState;
    if (!s || s.spinning || s.closed) return;

    s.spinning = true;
    s.spinBtn.disabled = true;
    s.spinBtn.setAttribute('aria-busy', 'true');
    s.spinBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Girando…';
    s.resultEl.textContent = '';
    s.resultEl.classList.add('empty');

    var numSlices = s.slices.length;
    var sliceAngle = (2 * Math.PI) / numSlices;
    var w = s.winSliceIdx;

    /* === Cálculo del ángulo final ===
       Las porciones se dibujan desde -π/2 (arriba, 12 en punto). El
       centro de la porción w está en: -π/2 + w*sliceAngle + sliceAngle/2.
       La aguja está fija en -π/2 (arriba). Tras rotar 'finalRot'
       (sentido horario), queremos que el centro de w coincida con la
       aguja:
         (-π/2 + w*sliceAngle + sliceAngle/2) + finalRot ≡ -π/2 (mod 2π)
         → finalRot ≡ -(w*sliceAngle + sliceAngle/2) (mod 2π)
       Además queremos mínimo 'numTurns' vueltas completas y que el
       giro sea siempre hacia adelante (delta > 0). */
    var TWO_PI = 2 * Math.PI;
    var targetMod = -((w * sliceAngle) + (sliceAngle / 2)); /* posición deseada mod 2π */
    targetMod = ((targetMod % TWO_PI) + TWO_PI) % TWO_PI;   /* normalizar a [0, 2π) */
    var startRot = s.currentRot;
    var startMod = ((startRot % TWO_PI) + TWO_PI) % TWO_PI;
    var deltaOne = targetMod - startMod;
    if (deltaOne <= 0) deltaOne += TWO_PI; /* asegurar avance positivo dentro de una vuelta */
    var numTurns = 5 + Math.floor(Math.random() * 3); /* 5–7 vueltas completas */
    var delta = deltaOne + TWO_PI * numTurns;
    var finalRot = startRot + delta;

    var duration = 4500; /* ~4.5 s */
    var startTime = performance.now();

    /* prefers-reduced-motion: resultado inmediato, sin animación */
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        s.currentRot = finalRot;
        _drawWheel(s.ctx, s.slices, finalRot, w, s.displaySize);
        _onSpinEnd(s);
        return;
    }

    function frame(now) {
        if (!s || s.closed) return; /* cerrado a mitad del giro → parar */
        var elapsed = now - startTime;
        var t = Math.min(elapsed / duration, 1);
        /* easeOutCubic: desaceleración suave al final */
        var eased = 1 - Math.pow(1 - t, 3);
        s.currentRot = startRot + delta * eased;
        _drawWheel(s.ctx, s.slices, s.currentRot, -1, s.displaySize);
        if (t < 1) {
            s.rafId = requestAnimationFrame(frame);
        } else {
            s.currentRot = finalRot;
            _drawWheel(s.ctx, s.slices, finalRot, w, s.displaySize);
            _onSpinEnd(s);
        }
    }
    s.rafId = requestAnimationFrame(frame);
}

/* _onSpinEnd — al terminar el giro: anunciar resultado, resaltar
   porción ganadora y programar la apertura de la ficha. */
function _onSpinEnd(s) {
    if (!s || s.closed) return;
    s.spinning = false;
    s.spinBtn.disabled = false;
    s.spinBtn.setAttribute('aria-busy', 'false');
    s.spinBtn.innerHTML = '<i class="fas fa-rotate-right" aria-hidden="true"></i> Girar de nuevo';
    /* Anunciar resultado (aria-live="polite" lo lee el lector de pantalla) */
    var name = _truncRouletteName(s.winner.name || 'Este local', 40);
    s.resultEl.textContent = '¡Te toca! ' + name;
    s.resultEl.classList.remove('empty');
    /* Redibujar con la porción ganadora resaltada */
    _drawWheel(s.ctx, s.slices, s.currentRot, s.winSliceIdx, s.displaySize);
    /* Tras 1.2 s, cerrar el modal y abrir la ficha del local ganador */
    s.resultTimer = setTimeout(function () {
        if (!s || s.closed) return;
        var wid = String(s.winner.id);
        _closeRoulette();
        if (typeof openModal === 'function') {
            openModal(wid);
        }
    }, 1200);
}

/* _drawWheel — dibuja la ruleta en el canvas.
   rotation: ángulo acumulado (rad, sentido horario).
   highlightIdx: índice de la porción a resaltar (-1 = ninguna).
   size: tamaño lógico del canvas (px, antes de DPR). */
function _drawWheel(ctx, slices, rotation, highlightIdx, size) {
    var cx = size / 2;
    var cy = size / 2;
    var radius = cx - 2;
    var numSlices = slices.length;
    var sliceAngle = (2 * Math.PI) / numSlices;
    /* Las porciones empiezan desde arriba (-π/2) */
    var startOffset = -Math.PI / 2;

    ctx.clearRect(0, 0, size, size);

    /* Porciones */
    for (var i = 0; i < numSlices; i++) {
        var a0 = startOffset + i * sliceAngle + rotation;
        var a1 = a0 + sliceAngle;
        var color = _ROULETTE_COLORS[i % _ROULETTE_COLORS.length];

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, a0, a1);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        /* Resaltar porción ganadora (overlay blanco translúcido) */
        if (highlightIdx === i) {
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, a0, a1);
            ctx.closePath();
            ctx.fillStyle = 'rgba(255,255,255,0.35)';
            ctx.fill();
        }

        /* Borde de la porción */
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    /* Borde exterior */
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    /* Texto radial (nombres truncados) */
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.font = 'bold 11px "Noto Sans SC", system-ui, -apple-system, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';

    for (var j = 0; j < numSlices; j++) {
        var angle = startOffset + j * sliceAngle + sliceAngle / 2;
        ctx.save();
        ctx.rotate(angle);
        /* El eje x local apunta al centro de la porción j.
           Texto alineado a la derecha (hacia el borde), legible desde
           el centro hacia afuera. */
        ctx.textAlign = 'right';
        ctx.fillText(_truncRouletteName(slices[j].name, 14), radius - 6, 0);
        ctx.restore();
    }
    ctx.restore();

    /* Centro decorativo (eje de la ruleta) */
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f1320';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();

    /* Pequeño círculo interior (acento del color ganador) */
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, 2 * Math.PI);
    ctx.fillStyle = _ROULETTE_COLORS[highlightIdx >= 0 ? highlightIdx % _ROULETTE_COLORS.length : 0];
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.globalAlpha = 1;
}

/* _closeRoulette — limpia todo (cancela animación, listeners, DOM).
   Devuelve el foco al botón disparador. No abre ningún local
   (si se cierra a mitad del giro, el resultado se descarta). */
function _closeRoulette() {
    var s = _rouletteState;
    if (!s) return;
    s.closed = true; /* marcar antes para que callbacks pendientes no actúen */

    /* Cancelar animación */
    if (s.rafId) {
        cancelAnimationFrame(s.rafId);
        s.rafId = null;
    }
    /* Cancelar timer de resultado */
    if (s.resultTimer) {
        clearTimeout(s.resultTimer);
        s.resultTimer = null;
    }
    /* Limpiar listeners */
    if (s.escHandler) document.removeEventListener('keydown', s.escHandler, true);
    if (s.focusTrapHandler) document.removeEventListener('keydown', s.focusTrapHandler);

    /* Cerrar overlay con fade */
    s.overlay.classList.remove('open');
    var ov = s.overlay;
    setTimeout(function () {
        if (ov.parentNode) ov.parentNode.removeChild(ov);
    }, 300);

    /* Devolver foco al botón disparador */
    if (s.triggerEl) {
        try { s.triggerEl.focus(); } catch (e) {}
    }

    _rouletteState = null;
}

/* _truncRouletteName — trunca un nombre a 'max' caracteres con "…". */
function _truncRouletteName(name, max) {
    if (!name) return '';
    name = String(name);
    if (name.length <= max) return name;
    return name.substring(0, max - 1) + '…';
}

/* Listener independiente: la ruleta se inicializa aunque el DOMContentLoaded
   principal falle antes de llegar a ella (robustez). try/catch para no
   romper nada si algo falla. */
document.addEventListener('DOMContentLoaded', function () {
    try { initRoulette(); }
    catch (e) { console.warn('[roulette] initRoulette:', e); }
});

/* ═══════════════════════════════════════════════════════════════
   FIN SECCIÓN RULETA
   ═══════════════════════════════════════════════════════════════ */
