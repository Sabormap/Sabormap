/* Auditoría automatizada de places.js (Sabormap) */
const fs = require('fs');
const vm = require('vm');

const raw = fs.readFileSync(process.argv[2] || '/home/z/my-project/upload/Pasted Content_1792264596746.txt', 'utf8');
const ctx = { console };
vm.createContext(ctx);
vm.runInContext(raw + '\nthis.__places = staticPlaces;', ctx);
const P = ctx.__places;

console.log('════════════════════════════════════════');
console.log(`TOTAL locales: ${P.length}`);
const cats = {};
P.forEach(p => cats[p.category] = (cats[p.category] || 0) + 1);
console.log('Por categoría:', JSON.stringify(cats));
const declared = (raw.match(/Total de locales:\s*(\d+)/) || [])[1];
console.log(`Header del archivo declara ${declared || '(nada)'} → ${+declared === P.length ? 'OK' : 'INCONSISTENTE (real: ' + P.length + ')'}`);

// ── IDs ──
const seen = new Set(); const dupIds = [];
P.forEach(p => { if (seen.has(p.id)) dupIds.push(p.id); seen.add(p.id); });
console.log(`\n[IDs] duplicados: ${dupIds.length ? dupIds.join(',') : 'ninguno'}`);
const numeric = P.filter(p => typeof p.id === 'number').length;
console.log(`[IDs] numéricos: ${numeric}, no numéricos: ${P.length - numeric}`);

// ── Teléfonos ──
const noPhone = P.filter(p => !p.phone || p.phone === '#' || String(p.phone).trim() === '');
console.log(`\n[TELÉFONO] sin teléfono o "#": ${noPhone.length} (${(noPhone.length/P.length*100).toFixed(0)}%)`);

// ── Links placeholder ──
const phDomains = ['pedidosya.com', 'rappi.com', 'opentable.com'];
const isPh = url => phDomains.some(d => {
    try { const u = new URL(url); return u.pathname === '/' || u.pathname === ''; } catch { return false; }
});
const withPh = P.filter(p => p.links && p.links.length && p.links.every(l => isPh(l.url)));
const somePh = P.filter(p => p.links && p.links.length && p.links.some(l => isPh(l.url)));
const mixedReal = somePh.length - withPh.length;
console.log(`\n[LINKS] con SOLO placeholders (raíz dominio): ${withPh.length}`);
console.log(`[LINKS] con ALGÚN placeholder: ${somePh.length} (mixtos: ${mixedReal})`);
const badUrls = P.filter(p => p.links && p.links.some(l => !/^https?:\/\//.test(l.url || '')));
console.log(`[LINKS] con URL malformada: ${badUrls.length}`);

// ── Imágenes ──
const noImgs = P.filter(p => !p.images || !p.images.some(i => i && i.trim()));
const dupImg = P.filter(p => p.images && p.images.filter(i => i && i.trim()).length > new Set(p.images.filter(i => i && i.trim())).size);
const emojiFile = P.filter(p => p.images && p.images.some(i => i && /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(i)));
const spaceFile = P.filter(p => p.images && p.images.some(i => i && i.includes(' ')));
const aposFile = P.filter(p => p.images && p.images.some(i => i && i.includes("'")));
const typoFiles = P.filter(p => p.images && p.images.some(i => i && /Sensacioones|Best Sushi/i.test(i)));
console.log(`\n[IMÁGENES] sin ninguna imagen: ${noImgs.length}`);
console.log(`[IMÁGENES] con imagen duplicada en el array: ${dupImg.length}`);
console.log(`[IMÁGENES] con EMOJI en nombre de archivo: ${emojiFile.length}`);
emojiFile.slice(0, 8).forEach(p => console.log('   ·', p.id, p.images.find(i => i && /[\u{1F300}-\u{1FAFF}]/u.test(i))));
console.log(`[IMÁGENES] con ESPACIOS en nombre de archivo: ${spaceFile.length}`);
console.log(`[IMÁGENES] con apóstrofe en nombre de archivo: ${aposFile.length}`);
aposFile.slice(0, 5).forEach(p => console.log('   ·', p.id, p.images.find(i => i && i.includes("'"))));
console.log(`[IMÁGENES] con nombres con errata evidente: ${typoFiles.length}`);
typoFiles.forEach(p => console.log('   ·', p.id, p.name, '→', p.images[0]));

// ── Horarios ──
const badHour = [];
P.forEach(p => {
    if (!p.hours) return;
    const h = p.hours;
    // hora válida: 1-12 con am/pm, o 13-23 con lo que sea; inválidas: 00:00pm, 22:00am, 24:00, 23:00am(=aceptable pero raro)
    const times = h.match(/\d{1,2}:\d{2}\s*[ap]m/gi) || [];
    times.forEach(t => {
        const mm = t.toLowerCase().match(/^(\d{1,2}):(\d{2})\s*([ap]m)$/);
        if (!mm) return;
        const hh = +mm[1]; const suf = mm[3];
        if (hh === 0 && suf === 'pm') badHour.push({ id: p.id, name: p.name, issue: `"${t.trim()}" (00:00pm no existe)`, h });
        if (hh > 12 && suf === 'am') badHour.push({ id: p.id, name: p.name, issue: `"${t.trim()}" (hora 24h con am)`, h });
        if (hh > 23) badHour.push({ id: p.id, name: p.name, issue: `"${t.trim()}" hora imposible`, h });
    });
    if (/\d{1,2}:\d{2}\s*-\s*\d/.test(h) && !times.length) badHour.push({ id: p.id, name: p.name, issue: 'rango sin am/pm', h });
});
console.log(`\n[HORARIOS] expresiones de hora inválidas/ambiguas: ${badHour.length} apariciones en ${new Set(badHour.map(b => b.id)).size} locales`);
const uniqIssues = {};
badHour.forEach(b => { uniqIssues[b.issue] = (uniqIssues[b.issue] || 0) + 1; });
Object.entries(uniqIssues).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`   · ${v}× ${k}`));
const mixedFmt = P.filter(p => p.hours && /(am|pm).*\d{2}:\d{2}(?![ap])|(?<![ap])\d{2}:\d{2}.*(am|pm)/i.test(p.hours) === true && /\b(1[3-9]|2[0-3]):\d{2}\s*(am|pm)/i.test(p.hours));
console.log(`[HORARIOS] mezcla 12h/24h (p.ej. "23:00pm"): ${P.filter(p => p.hours && /\b(1[3-9]|2[0-3]):\d{2}\s*(am|pm)/i.test(p.hours)).length} locales`);
const noHours = P.filter(p => !p.hours);
console.log(`[HORARIOS] sin horario: ${noHours.length}`);
const midn12 = P.filter(p => p.hours && /12:00am\s*[-–]\s*00:00pm/i.test(p.hours));
console.log(`[HORARIOS] "12:00am-00:00pm" (parsea como abierto 24/7 — bug): ${midn12.length}`);
midn12.slice(0, 20).forEach(p => console.log(`   · id ${p.id} ${p.name}`));

// ── Coordenadas ──
const noCoord = P.filter(p => !p.lat || !p.lng);
const outBounds = P.filter(p => p.lat && (p.lat < 22.94 || p.lat > 23.25 || p.lng > -82.2 || p.lng < -82.6));
console.log(`\n[COORDENADAS] sin lat/lng: ${noCoord.length}`);
noCoord.slice(0, 10).forEach(p => console.log(`   · id ${p.id} ${p.name}`));
console.log(`[COORDENADAS] fuera del área metropolitana de La Habana: ${outBounds.length}`);
outBounds.forEach(p => console.log(`   · id ${p.id} ${p.name} → ${p.lat}, ${p.lng} (${p.neighborhood})`));
const gmapsMismatch = [];
P.forEach(p => {
    if (!p.gmapsUrl) return;
    const m = p.gmapsUrl.match(/query=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (!m) return;
    const d = Math.hypot((+m[1] - p.lat) * 111, (+m[2] - p.lng) * 100);
    if (d > 1) gmapsMismatch.push({ id: p.id, name: p.name, d: d.toFixed(1) });
});
console.log(`[COORDENADAS] lat/lng ≠ URL de Google Maps (>1km): ${gmapsMismatch.length}`);
gmapsMismatch.forEach(g => console.log(`   · id ${g.id} ${g.name} → ${g.d} km de diferencia`));

// ── Contenido duplicado (plantillas) ──
const menuHash = {};
P.forEach(p => {
    if (!p.menu || !p.menu.length) return;
    const key = p.menu.map(s => s.category + '|' + s.items.map(i => i.name).join(',')).join('||');
    (menuHash[key] = menuHash[key] || []).push(p.id);
});
const dupMenus = Object.entries(menuHash).filter(([k, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length);
console.log(`\n[MENÚS] plantillas de menú repetidas: ${dupMenus.length} grupos que cubren ${dupMenus.reduce((s, [, v]) => s + v.length, 0)} locales`);
dupMenus.slice(0, 6).forEach(([k, v]) => console.log(`   · ${v.length} locales (ids ${v.slice(0, 12).join(',')}${v.length > 12 ? '…' : ''}): "${k.split('||')[0].split('|')[0]}"`));

const mustHash = {};
P.forEach(p => { if (p.mustOrder) (mustHash[p.mustOrder] = mustHash[p.mustOrder] || []).push(p.id); });
const dupMust = Object.entries(mustHash).filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length);
console.log(`[MUST-ORDER] textos repetidos en varios locales: ${dupMust.length} textos, cubren ${dupMust.reduce((s, [, v]) => s + v.length, 0)} locales`);
dupMust.slice(0, 4).forEach(([k, v]) => console.log(`   · ${v.length}× "${k.slice(0, 50)}" (ids ${v.slice(0, 10).join(',')}${v.length > 10 ? '…' : ''})`));

const noteHash = {};
P.forEach(p => { if (p.editorNote) (noteHash[p.editorNote] = noteHash[p.editorNote] || []).push(p.id); });
const dupNotes = Object.entries(noteHash).filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length);
console.log(`[EDITOR-NOTE] textos repetidos: ${dupNotes.length} textos, cubren ${dupNotes.reduce((s, [, v]) => s + v.length, 0)} locales`);
dupNotes.slice(0, 4).forEach(([k, v]) => console.log(`   · ${v.length}× "${k.slice(0, 50)}"`));

// ── Tags placeholder ──
const descTag = P.filter(p => p.tags && p.tags.some(t => /descu[bd]relo/i.test(t)));
console.log(`\n[TAGS] con tag "Descubrelo/Descrubelo" (placeholder): ${descTag.length}`);
const descuErrata = P.filter(p => p.tags && p.tags.some(t => /descrubelo/i.test(t)));
console.log(`[TAGS] con errata "Descrubelo": ${descuErrata.length}`);
const tagEmoji = P.filter(p => p.tags && p.tags.some(t => /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u.test(t)));
console.log(`[TAGS] con emojis: ${tagEmoji.length}`);

// ── Emojis en campos de datos ──
const addrEmoji = P.filter(p => p.address && /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u.test(p.address));
const hourEmoji = P.filter(p => p.hours && /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{23F0}]/u.test(p.hours));
console.log(`\n[EMOJIS] en address: ${addrEmoji.length} | en hours: ${hourEmoji.length}`);

// ── Unicode matemático en address (screen reader hostil) ──
const mathAddr = P.filter(p => p.address && /[\u{1D400}-\u{1D7FF}]/u.test(p.address));
console.log(`[EMOJIS] address con Unicode matemático (𝗖𝗮𝗹𝗹𝗲): ${mathAddr.length}`);
mathAddr.forEach(p => console.log(`   · id ${p.id} ${p.name}`));

// ── Ortografía / voseo ──
// v1.3: patrón afinado a las formas voseantes REALES (con tilde y enclíticos):
// el anterior (/descubri|proba|volve|tenes…/) marcaba 7 falsos positivos
// (infinitivos y tuteo correcto: "volver", "probar", "descubrir", "probaste", "comprobar").
const voseo = P.filter(p => /\b(descubrí|probá|encontrás|tenés|volvé|comprá|pagá|visitá|envianos|contanos|escríbinos|escribinos)\b|[Dd]escubrí|[Pp]robá los/i.test([p.description, p.editorNote, p.tags && p.tags.join(' ')].join(' ')));
console.log(`\n[ESTILO] campos con voseo rioplatense ("descubri/proba/volve…"): ${voseo.length}`);
const errores = [];
P.forEach(p => {
    const blob = [p.description, p.editorNote, (p.tags || []).join(' ')].join(' ');
    if (/\bcana\b/i.test(blob)) errores.push({ id: p.id, w: 'cana→caña' });
});
console.log(`[ESTILO] "cana" sin tilde (miel de cana): ${errores.length} locales`);
const descEn = P.filter(p => /best sushi in town/i.test(p.description || ''));
console.log(`[ESTILO] descripciones en inglés: ${descEn.length}`);
descEn.forEach(p => console.log(`   · id ${p.id} ${p.name}`));

// ── Ratings / precios ──
const badRating = P.filter(p => !(p.rating >= 0 && p.rating <= 5));
const badPrice = P.filter(p => !(p.priceLevel >= 1 && p.priceLevel <= 4));
console.log(`\n[VALIDACIÓN] rating fuera de 0-5: ${badRating.length} | priceLevel fuera 1-4: ${badPrice.length}`);
const noDesc = P.filter(p => !p.description);
const noAddr = P.filter(p => !p.address);
console.log(`[VALIDACIÓN] sin descripción: ${noDesc.length} | sin dirección: ${noAddr.length}`);

// ── neighborhoods ──
const barrios = {};
P.forEach(p => barrios[p.neighborhood] = (barrios[p.neighborhood] || 0) + 1);
console.log(`\n[BARRIOS] ${Object.keys(barrios).length} barrios distintos`);
console.log('   ', Object.entries(barrios).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}(${v})`).join(', '));

// ── featured / isOpen ──
console.log(`\n[FLAGS] featured: ${P.filter(p => p.featured).length} | isOpen=true: ${P.filter(p => p.isOpen).length} | isOpen=false: ${P.filter(p => p.isOpen === false).length}`);

// ── gmapsUrl propio vs generado ──
const withGmaps = P.filter(p => p.gmapsUrl).length;
console.log(`[GMAPS] locales con gmapsUrl propio: ${withGmaps} (el resto usa URL generada)`);

// ── Nombres con emoji ──
const nameEmoji = P.filter(p => /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(p.name));
console.log(`[NOMBRES] con emoji en el nombre: ${nameEmoji.length}`);
nameEmoji.slice(0, 10).forEach(p => console.log(`   · id ${p.id} ${p.name}`));
