/* ═══════════════════════════════════════════════════
   TOGGLE DE TEMA — Oscuro / Claro
   ═══════════════════════════════════════════════════ */
function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('sabormap-theme', next);

    // Actualizar meta theme-color dinamicamente
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', next === 'dark' ? '#8b5cf6' : '#7c3aed');
    }

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
window.addEventListener('resize', handleMobileThemeToggle);
document.addEventListener('DOMContentLoaded', handleMobileThemeToggle);

// ★ staticPlaces pasa a ser `let` para poder agregar los locales que vengan de Supabase.
/* staticPlaces se carga ahora desde places.js (ver <script src="places.js"> arriba).
   Antes contenía 203 locales incrustados en este mismo archivo. */
if (typeof staticPlaces === 'undefined') {
    console.error('places.js no se cargó: staticPlaces no está definido.');
    window.staticPlaces = [];
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

/* ═══════════════════════════════════════════
   COLECCIONES
   ═══════════════════════════════════════════ */
// Colecciones dinamicas desde Supabase (fallback estatico si no hay conexion)
let collections = [
    { id:'cena-romantica',      title:'Cena Romantica',     desc:'Candlelight, vino y esa mesa esquinada',     icon:'fa-heart',          color:'#ec4899', bg:'rgba(236,72,153,0.12)', border:'rgba(236,72,153,0.2)', staticIds:[1,2,7], dbIds:[] },
    { id:'mejores-cocteles',    title:'Mejores Cocteles',   desc:'Donde el ron se vuelve arte',                 icon:'fa-martini-glass',  color:'#8b5cf6', bg:'rgba(139,92,246,0.12)', border:'rgba(139,92,246,0.2)', staticIds:[7,8,10], dbIds:[] },
    { id:'familiar',            title:'En Familia',          desc:'Menus para todos y espacio para los peques',  icon:'fa-people-group',   color:'#06b6d4', bg:'rgba(6,182,212,0.12)',  border:'rgba(6,182,212,0.2)', staticIds:[1,4,6], dbIds:[] },
    { id:'mariscos-frescos',    title:'Mariscos Frescos',    desc:'Directo del mar al plato',                    icon:'fa-fish',           color:'#10b981', bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.2)', staticIds:[4,8], dbIds:[] },
    { id:'helados-artesanales', title:'Helados Artesanales', desc:'Bochas que valen la espera',                  icon:'fa-ice-cream',      color:'#f472b6', bg:'rgba(244,114,182,0.12)',border:'rgba(244,114,182,0.2)', staticIds:[3,6,9], dbIds:[] },
    { id:'delivery-noche',      title:'Delivery Nocturno',   desc:'Antojos a las 2am? Resueltos',                icon:'fa-moon',           color:'#f59e0b', bg:'rgba(245,158,11,0.12)', border:'rgba(245,158,11,0.2)', staticIds:[1,5,9], dbIds:[] },
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
    bar: { label:'Bar / Cafeteria', icon:'fa-wine-glass-alt', cssClass:'cat-bar' },
    restaurante: { label:'Restaurante', icon:'fa-utensils', cssClass:'cat-restaurante' },
    heladeria: { label:'Heladeria', icon:'fa-ice-cream', cssClass:'cat-heladeria' }
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

// Mapea un local de la DB al formato que usa esta página (mismas propiedades que staticPlaces).
// Map a DB locale to the format this page uses (same properties as staticPlaces).
function mapDbPlaceToPublic(p) {
    if (!p) return null;
    // price_range ('$', '$$', '$$$', '$$$$') → priceLevel (1-4)
    const priceLevel = ({ '$':1, '$$':2, '$$$':3, '$$$$':4 })[p.price_range] || 2;
    // menu: jsonb ya viene como array de {category, items:[{name,desc,price}]}
    const menu  = Array.isArray(p.menu)  ? p.menu  : [];
    // links: jsonb ya viene como array de {platform, url, icon, cssClass}
    const links = Array.isArray(p.links) ? p.links : [];
    return {
        id:             p.id,                                   // uuid (string)
        name:           p.name || 'Sin nombre',
        category:       p.category || 'restaurante',
        neighborhood:   p.neighborhood || 'Habana Vieja',
        address:        p.address || '',
        rating:         Number(p.rating) || 0,
        priceLevel:     priceLevel,
        tags:           Array.isArray(p.tags) ? p.tags : [],
        description:    p.description || '',
        mustOrder:      '',
        editorNote:     '',
        hours:          p.schedule || '',
        phone:          p.phone || '',
        featured:       !!p.featured,
        isOpen:         true,
        lat:            Number(p.lat) || null,
        lng:            Number(p.lng) || null,
        images:         Array.isArray(p.images) ? p.images : [],
        menu:           menu,
        links:          links,
        is_pro:         !!p.is_pro, // ★ NUEVO: Para ocultar el banner en locales PRO ★
        _fromDb:        true   // flag por si querés diferenciar en el futuro
    };
}

// Trae de Supabase todos los locales con status='published' y los agrega a staticPlaces
// sin pisar los locales estáticos (mantenemos los originales + los de la DB).
async function loadPlacesFromSupabase() {
    if (!sb) { console.warn('Supabase client no inicializado'); return; }
    try {
        const { data, error } = await sb
            .from('places')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: false });

        if (error) { console.warn('Supabase places fetch error:', error); return; }
        if (!Array.isArray(data) || data.length === 0) {
            console.info('No hay locales publicados en Supabase todavía');
            return;
        }

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
        console.info(`Supabase: ${added} locales publicados cargados (total: ${staticPlaces.length})`);

        // Re-poblar el dropdown de barrios y volver a renderizar la grilla
        if (typeof populateBarrios === 'function') populateBarrios();
        if (typeof renderPlaces  === 'function') renderPlaces();
        if (typeof animateStats === 'function') animateStats();
    } catch (err) {
        console.warn('Error cargando locales desde Supabase:', err);
    }
}

/* ═══════════════════════════════════════════
   INICIALIZACIÓN
   ═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    renderCollections();
    renderPlaces();
    populateBarrios();
    setupSearch();
    setupScrollReveal();
    setupScrollBtns();
    animateStats();
    handleMobileThemeToggle();
    // ★ Cargar locales publicados desde Supabase (async, no bloquea el render inicial) ★
    loadPlacesFromSupabase();
    // ★ Cargar colecciones dinamicas desde Supabase ★
    loadCollectionsFromSupabase();
    // Refresca los badges "Abierto/Cerrado" cada 60s sin intervención manual
    setInterval(() => {
        if (currentView === 'grid') renderPlaces();
        if (currentModalPlace) {
            // Si hay un modal abierto, actualiza solo el badge dentro del drawer
            const badges = document.querySelectorAll('.drawer-meta-row .open-badge');
            if (badges.length) {
                const st = getPlaceStatus(currentModalPlace);
                const main = st.open ? 'Abierto' : 'Cerrado';
                const sub = st.label ? `<span class="badge-sub">· ${st.label}</span>` : '';
                badges.forEach(b => {
                    b.className = 'open-badge ' + (st.open ? 'open' : 'closed');
                    b.innerHTML = '<span class="pulse"></span>' + main + sub;
                });
            }
        }
    }, 60000);
});

/* ═══════════════════════════════════════════
   RENDERIZAR COLECCIONES
   ═══════════════════════════════════════════ */
function renderCollections() {
    const container = document.getElementById('collectionsScroll');
    if (!container) return;
    container.innerHTML = collections.map(c => `
        <div class="collection-card" style="--collection-color:${c.color};--collection-bg:${c.bg};--collection-border:${c.border};"
             onclick="toggleCollection('${c.id}')" id="col-${c.id}">
            <div class="collection-icon"><i class="fas ${c.icon}"></i></div>
            <div class="collection-title">${c.title}</div>
            <div class="collection-desc">${c.desc}</div>
            <div class="collection-count"><i class="fas fa-store"></i> ${getCollectionCount(c)} lugares</div>
        </div>
    `).join('');
}

function toggleCollection(id) {
    if (activeCollection === id) { clearCollection(); return; }
    activeCollection = id;
    document.querySelectorAll('.collection-card').forEach(c => c.classList.remove('active'));
    document.getElementById('col-' + id).classList.add('active');
    const col = collections.find(c => c.id === id);
    document.getElementById('activeCollectionBar').classList.add('show');
    document.getElementById('activeCollectionName').textContent = col.title;
    applyFilters();
}

function clearCollection() {
    activeCollection = null;
    document.querySelectorAll('.collection-card').forEach(c => c.classList.remove('active'));
    document.getElementById('activeCollectionBar').classList.remove('show');
    applyFilters();
}

/* ═══════════════════════════════════════════
   RENDERIZAR LUGARES
   ═══════════════════════════════════════════ */
function getFilteredPlaces() {
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
        places = places.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.neighborhood.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.tags.some(t => t.toLowerCase().includes(q))
        );
    }
    return places;
}

function renderPlaces() {
    const places = getFilteredPlaces();
    const grid = document.getElementById('placesGrid');
    const noResults = document.getElementById('noResults');
    document.getElementById('resultCount').textContent = `${places.length} resultado${places.length !== 1 ? 's' : ''}`;

    if (places.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    noResults.style.display = 'none';

    grid.innerHTML = places.map(p => {
        const meta = catMeta[p.category] || catMeta.bar;
        const priceDots = Array.from({length:4}, (_,i) =>
            `<span class="price-dot ${i < p.priceLevel ? 'filled' : 'empty'}"></span>`
        ).join('');

        return `
        <article class="place-card${p.featured ? ' featured' : ''}" data-place-id="${p.id}" onclick="openModal(this.dataset.placeId)" tabindex="0"
                 onkeydown="if(event.key==='Enter')openModal(this.dataset.placeId)" role="button" aria-label="Ver ${p.name}">
            <div class="card-img-wrapper">
                <span class="cat-badge ${meta.cssClass}"><i class="fas ${meta.icon}" style="margin-right:4px;font-size:0.6rem;"></i>${meta.label}</span>
                ${p.images[0] ? `<img class="card-img" src="${p.images[0]}" alt="${p.name}" loading="lazy">` :
                `<div class="card-img" style="background:linear-gradient(135deg, var(--card), var(--card-hover));display:flex;align-items:center;justify-content:center;"><i class="fas ${meta.icon}" style="font-size:2.5rem;color:var(--border);"></i></div>`}
            </div>
            <div style="padding:20px;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px;">
                        <h3 style="font-weight:700;font-size:1.1rem;line-height:1.3;">${p.name}</h3>
                        ${renderOpenBadge(p)}
                    </div>
                    <div style="display:flex;align-items:center;gap:10px;font-size:0.82rem;color:var(--muted);margin-bottom:8px;">
                        <span><i class="fas fa-map-pin" style="margin-right:4px;font-size:0.7rem;"></i>${p.neighborhood}</span>
                        <span style="display:flex;align-items:center;gap:3px;"><i class="fas fa-star rating-star" style="font-size:0.7rem;"></i>${p.rating}</span>
                        <span style="display:flex;align-items:center;gap:2px;">${priceDots}</span>
                    </div>
                    <p style="font-size:0.82rem;color:var(--muted);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${p.description}</p>
                    ${p.mustOrder ? `<div class="must-order-badge"><i class="fas fa-fire"></i>${p.mustOrder}</div>` : ''}
                </div>
        </article>`;
    }).join('');

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
    const barrios = [...new Set(staticPlaces.map(p => p.neighborhood))].sort();
    const sel = document.getElementById('barrioFilter');
    barrios.forEach(b => { const o = document.createElement('option'); o.value = b; o.textContent = b; sel.appendChild(o); });
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
function setView(view) {
    currentView = view;
    document.getElementById('gridViewBtn').classList.toggle('active', view === 'grid');
    document.getElementById('mapViewBtn').classList.toggle('active', view === 'map');
    document.getElementById('gridView').style.display = view === 'grid' ? 'block' : 'none';
    document.getElementById('mapView').classList.toggle('visible', view === 'map');
    if (view === 'map') {
        if (!map) initMap();
        else { setTimeout(() => map.invalidateSize(), 100); renderMapMarkers(getFilteredPlaces()); }
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
        const meta = catMeta[p.category] || catMeta.bar;
        const markerClass = `marker-${p.category}`;
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-pin ${markerClass}"><i class="fas ${meta.icon}"></i></div>`,
            iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30]
        });
        const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
        marker.bindPopup(`
            <div class="map-popup-content">
                <div class="map-popup-title">${p.name}</div>
                <div class="map-popup-info"><i class="fas fa-star" style="color:var(--secondary);font-size:0.7rem;"></i> ${p.rating} &middot; ${p.neighborhood}</div>
                <button class="map-popup-btn" data-place-id="${p.id}" onclick="openModal(this.dataset.placeId)">Ver detalle</button>
            </div>
        `);
        markers.push(marker);
    });
}

/* ═══════════════════════════════════════════
   MODAL — DRAWER LATERAL REDISEÑADO
   ═══════════════════════════════════════════ */
function openModal(id) {
    // Comparación flexible: los IDs estáticos son numéricos, los de DB son uuid strings.
    // dataset siempre devuelve strings, así que comparamos con String(pl.id).
    const p = staticPlaces.find(pl => String(pl.id) === String(id));
    if (!p) return;
    currentModalPlace = p;

    const meta = catMeta[p.category] || catMeta.bar;
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
                ${validImages.map(img => `<div class="swiper-slide"><img src="${img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;"></div>`).join('')}
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
        <h2 class="drawer-place-name">${p.name}</h2>
        <div class="drawer-meta-row">
            <span class="drawer-rating-pill"><i class="fas fa-star"></i> ${p.rating}</span>
            <span class="drawer-meta-item">
                ${renderOpenBadge(p)}
            </span>
            <span class="drawer-meta-item" style="display:flex;align-items:center;gap:3px;">${priceDots}</span>
            <span class="drawer-meta-item"><i class="fas fa-map-pin"></i> ${p.neighborhood}</span>
        </div>
    </div>`;

    if (p.mustOrder) {
        html += `
        <div class="drawer-section" style="animation-delay:0.1s;">
            <div class="drawer-must-order">
                <div class="drawer-must-order-icon"><i class="fas fa-fire"></i></div>
                <div>
                    <div class="drawer-must-order-label">Lo que tenes que pedir</div>
                    <div class="drawer-must-order-text">${p.mustOrder}</div>
                </div>
            </div>
        </div>`;
    }

    if (p.editorNote) {
        html += `
        <div class="drawer-section" style="animation-delay:0.15s;">
            <div class="drawer-editor-note">
                <div class="editor-note-label" style="margin-bottom:6px;"><i class="fas fa-pen-nib" style="font-size:0.6rem;"></i> Nota del editor</div>
                ${p.editorNote}
            </div>
        </div>`;
    }

    if (p.description) {
        html += `
        <div class="drawer-section" style="animation-delay:0.2s;">
            <div class="drawer-section-label">Sobre el lugar</div>
            <p style="font-size:0.9rem;color:var(--muted);line-height:1.7;">${p.description}</p>
        </div>`;
    }

    if (p.tags && p.tags.length) {
        html += `
        <div class="drawer-section" style="animation-delay:0.25s;">
            <div class="drawer-section-label">Especialidades</div>
            <div class="drawer-tags">
                ${p.tags.map(t => `<span class="drawer-tag">${t}</span>`).join('')}
            </div>
        </div>`;
    }

    html += `
    <div class="drawer-section" style="animation-delay:0.3s;">
        <div class="drawer-section-label">Informacion practica</div>
        <div class="drawer-info-card">
            ${p.hours ? `
            <div class="drawer-info-row">
                <div class="drawer-info-icon"><i class="fas fa-clock"></i></div>
                <div>
                    <div class="drawer-info-label">Horario</div>
                    <div class="drawer-info-value">${p.hours}</div>
                </div>
            </div>` : ''}
            ${p.address ? `
            <div class="drawer-info-row">
                <div class="drawer-info-icon"><i class="fas fa-location-dot"></i></div>
                <div>
                    <div class="drawer-info-label">Direccion</div>
                    <div class="drawer-info-value copy-address" onclick="copyText('${p.address.replace(/'/g, "\\'")}');event.stopPropagation();">${p.address} <i class="fas fa-copy" style="font-size:0.7rem;color:var(--muted);margin-left:4px;"></i></div>
                </div>
            </div>` : ''}
            ${p.phone && p.phone !== '#' ? `
            <div class="drawer-info-row">
                <div class="drawer-info-icon"><i class="fas fa-phone"></i></div>
                <div>
                    <div class="drawer-info-label">Telefono</div>
                    <div class="drawer-info-value"><a href="tel:${p.phone}" style="color:var(--secondary);text-decoration:none;">${p.phone}</a></div>
                </div>
            </div>` : ''}
        </div>
    </div>`;

    // Verificar si los links son placeholders (URLs raiz sin path)
    const placeholderDomains = ['pedidosya.com/', 'rappi.com/', 'opentable.com/'];
    const isPlaceholder = p.links && p.links.length > 0 && p.links.every(l =>
        placeholderDomains.some(d => l.url.includes(d))
    );
    if (p.links && p.links.length && !isPlaceholder) {
        html += `
        <div class="drawer-section" style="animation-delay:0.35s;">
            <div class="drawer-section-label">Delivery y reservas</div>
            <div class="drawer-delivery">
                ${p.links.map(l => `
                    <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="delivery-link ${l.cssClass}">
                        <i class="fas ${l.icon}"></i> ${l.platform}
                    </a>
                `).join('')}
            </div>
        </div>`;
    } else if (isPlaceholder) {
        html += `
        <div class="drawer-section" style="animation-delay:0.35s;">
            <div class="drawer-section-label">Delivery y reservas</div>
            <div style="padding:14px 18px;border-radius:12px;background:rgba(139,92,246,0.06);border:1px dashed rgba(139,92,246,0.2);color:var(--muted);font-size:0.85rem;display:flex;align-items:center;gap:8px;">
                <i class="fas fa-clock"></i> Delivery y reservas online proximamente
            </div>
        </div>`;
    }

     if (p.menu && p.menu.length) {
        html += `
        <div class="drawer-section" style="animation-delay:0.4s;">
            <button class="drawer-menu-btn" onclick="openMenuSubModal()">
                <i class="fas fa-book-open"></i> Ver la carta completa
            </button>
        </div>`;
    }

    // ═══════════════════════════════════════════════════
    // EL ANZUELO: Banner "Reclamar este Local" 
    // ═══════════════════════════════════════════════════
    if (!p.is_pro) {
        html += `
        <div class="drawer-section" style="padding: 0; margin-bottom: 24px; animation-delay:0.42s;">
            <div class="drawer-banner-claim" style="background: rgba(139,92,246,0.1); border: 1px dashed var(--accent); padding: 14px; border-radius: 12px; margin: 0 28px; text-align: center;">
                <p style="font-size: 0.85rem; color: var(--cream); margin-bottom: 8px;">¿Eres el dueño de este local?</p>
                <a href="publicar.html" class="btn-fill" style="font-size: 0.8rem; padding: 8px 16px; display:inline-flex; align-items:center; gap:8px; background:var(--accent); color:#fff; text-decoration:none; border-radius:10px; font-weight:700;">
                    <i class="fas fa-check-circle"></i> Reclamar este Local
                </a>
            </div>
        </div>`;
    }

    html += `
    <div class="drawer-section" style="animation-delay:0.45s;margin-bottom:32px;">
        <button class="drawer-share-btn" data-place-id="${p.id}" onclick="sharePlace(this.dataset.placeId)">
            <i class="fas fa-share-nodes"></i> Compartir este lugar
        </button>
    </div>`;

    document.getElementById('modalDrawerScroll').innerHTML = html;

    document.getElementById('modalOverlay').classList.add('open');
    document.getElementById('modalDrawer').classList.add('open');
    document.body.style.overflow = 'hidden';

    if (hasImages && validImages.length > 1) {
        setTimeout(() => {
            swiperInstance = new Swiper('#modalSwiper', {
                loop: true, grabCursor: true,
                pagination: { el: '.swiper-pagination', clickable: true },
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
                autoplay: { delay: 4000, disableOnInteraction: true },
            });
        }, 100);
    }

    document.getElementById('modalDrawerScroll').scrollTop = 0;
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
    document.getElementById('modalDrawer').classList.remove('open');
    document.getElementById('menuSubModal').classList.remove('open');
    document.body.style.overflow = '';
    if (swiperInstance) { swiperInstance.destroy(); swiperInstance = null; }
    currentModalPlace = null;
}

/* ═══════════════════════════════════════════
   SUB-MODAL DE MENÚ (dentro del drawer)
   ═══════════════════════════════════════════ */
function openMenuSubModal() {
    const p = currentModalPlace;
    if (!p || !p.menu) return;
    document.getElementById('menuSubTitle').textContent = `Carta — ${p.name}`;
    // Agregar aviso de carta ejemplo
    const existingNotice = document.getElementById('menuExampleNotice');
    if (existingNotice) existingNotice.remove();
    const notice = document.createElement('div');
    notice.id = 'menuExampleNotice';
    notice.style.cssText = 'padding:12px 16px;margin:8px 16px 0;border-radius:12px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);color:var(--amber);font-size:0.8rem;font-weight:500;display:flex;align-items:center;gap:8px;';
    notice.innerHTML = '<i class="fas fa-info-circle"></i> Carta de ejemplo — la carta real estara disponible proximamente';
    document.getElementById('menuSubBody').parentElement.insertBefore(notice, document.getElementById('menuSubBody'));

    let html = '';
    p.menu.forEach(section => {
        html += `<div class="menu-section">
            <h3 class="menu-section-title">${section.category}</h3>`;
        section.items.forEach(item => {
            html += `<div class="menu-dish">
                <div class="menu-dish-info">
                    <div class="menu-dish-name">${item.name}</div>
                    <div class="menu-dish-desc">${item.desc}</div>
                </div>
                <div class="menu-dish-price">${item.price}</div>
            </div>`;
        });
        html += `</div>`;
    });

    if (p.links && p.links.length) {
        html += `<div class="delivery-section">${p.links.map(l => `
            <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="delivery-link ${l.cssClass}">
                <i class="fas ${l.icon}"></i> ${l.platform}
            </a>
        `).join('')}</div>`;
    }

    document.getElementById('menuSubBody').innerHTML = html;
    document.getElementById('menuSubModal').classList.add('open');
}

function closeMenuSubModal() {
    document.getElementById('menuSubModal').classList.remove('open');
    document.getElementById('menuScrollTopBtn').style.display = 'none';
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
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => showToast('Direccion copiada')).catch(() => showToast('No se pudo copiar'));
}

function sharePlace(id) {
    const p = staticPlaces.find(pl => String(pl.id) === String(id));
    if (!p) return;
    const text = `${p.name} — ${p.neighborhood}, La Habana | Sabormap`;
    if (navigator.share) {
        navigator.share({ title: p.name, text, url: window.location.href }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text + ' ' + window.location.href)
            .then(() => showToast('Enlace copiado')).catch(() => showToast('No se pudo copiar'));
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
    const titles = { terminos: 'Terminos de Uso', privacidad: 'Politica de Privacidad' };
    const bodies = {
        terminos: '<p style="color:var(--muted);line-height:1.8;">Al usar Sabormap aceptas que la informacion de locales, precios y horarios puede variar y es referencial. No nos responsabilizamos por cambios en los comercios listados.</p>',
        privacidad: '<p style="color:var(--muted);line-height:1.8;">Respetamos tu privacidad. No recopilamos datos personales sin tu consentimiento. Las cookies se usan unicamente para mejorar la experiencia de navegacion.</p>'
    };
    currentModalPlace = null;
    const html = `
        <div class="drawer-cat-banner cat-bar" style="padding-top:60px;">
            <div class="drawer-cat-orb" style="width:180px;height:180px;top:-40px;right:-30px;"></div>
            <h2 class="drawer-place-name">${titles[type] || 'Legal'}</h2>
        </div>
        <div class="drawer-section">
            ${bodies[type] || ''}
        </div>
    `;
    document.getElementById('modalDrawerScroll').innerHTML = html;
    document.getElementById('menuSubModal').classList.remove('open');
    document.getElementById('modalOverlay').classList.add('open');
    document.getElementById('modalDrawer').classList.add('open');
    document.body.style.overflow = 'hidden';
}

/* ═══════════════════════════════════════════
   MENÚ MÓVIL
   ═══════════════════════════════════════════ */
function openMobileMenu() { document.getElementById('mobileMenu').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeMobileMenu() { document.getElementById('mobileMenu').classList.remove('open'); document.body.style.overflow = ''; }

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
function animateStats() {
    // Calcular valores reales desde los datos
    const totalLocales = staticPlaces.length;
    const municipios = new Set(staticPlaces.map(p => p.neighborhood));
    const totalMunicipios = municipios.size;

    const statLocales = document.getElementById('statLocales');
    const statMunicipios = document.getElementById('statMunicipios');
    if (statLocales) statLocales.dataset.target = totalLocales;
    if (statMunicipios) statMunicipios.dataset.target = totalMunicipios;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const el = e.target;
                const target = parseInt(el.dataset.target);
                let current = 0;
                const step = Math.max(1, Math.ceil(target / 50));
                const interval = setInterval(() => {
                    current += step;
                    if (current >= target) { current = target; clearInterval(interval); }
                    el.textContent = current;
                }, 30);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
}

/* Cerrar drawer con tecla Escape */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (document.getElementById('menuSubModal').classList.contains('open')) {
            closeMenuSubModal();
        } else if (document.getElementById('modalDrawer').classList.contains('open')) {
            closeModal();
        }
    }
});

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

    // Opcional: avisar al usuario cuando hay nueva versión
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
    });
}

/* ============================================================
   Detectar offline y avisar a la UI
   ============================================================ */
window.addEventListener('online', () => {
    showToast('Conexion restablecida');
});
window.addEventListener('offline', () => {
    showToast('Sin conexion — modo offline activo');
});
