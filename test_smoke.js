/* test_smoke.js — Verificación funcional de los archivos corregidos de Sabormap
 * Ejecuta el sitio corregido en Chromium headless y comprueba 14 hallazgos. */
const { chromium } = require('playwright');
const fs = require('fs');

const BASE = 'http://127.0.0.1:8791/';

(async () => {
    const results = [];
    const check = (id, ok, detail) => {
        results.push({ id, ok, detail });
        console.log(`${ok ? '✓' : '✗ FALLO'}  ${id}  ${detail}`);
    };

    const browser = await chromium.launch();
    const page = await browser.newPage();

    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160)); });
    page.on('pageerror', e => pageErrors.push(String(e).slice(0, 200)));

    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3500); // render inicial + Supabase

    // 1. Sin errores de JS
    check('JS-errors', pageErrors.length === 0, pageErrors.join(' | ') || 'sin pageerror');

    // 2. P-02: paginación — 60 tarjetas iniciales de 258 resultados
    const cards = await page.locator('#placesGrid .place-card').count();
    const countText = (await page.locator('#resultCount').textContent()).trim();
    check('P-02-paginacion', cards === 60 && countText.startsWith('258'), `${cards} tarjetas renderizadas, contador "${countText}"`);

    // 3. T-03: barrios sin duplicados (se llama 2 veces)
    const dupTest = await page.evaluate(() => {
        populateBarrios(); populateBarrios();
        const opts = [...document.querySelectorAll('#barrioFilter option')].map(o => o.value);
        return { total: opts.length, uniq: new Set(opts).size };
    });
    check('T-03-barrios', dupTest.total === dupTest.uniq && dupTest.total >= 13, `${dupTest.total} opciones, ${dupTest.uniq} únicas`);

    // 4. S-01: JSON-LD dinámico con 258 items y sin aggregateRating
    const ld = await page.evaluate(() => {
        const el = document.getElementById('ldjson-catalog');
        if (!el) return null;
        const data = JSON.parse(el.textContent);
        const withRating = data.itemListElement.filter(x => x.item.aggregateRating).length;
        return { n: data.numberOfItems, len: data.itemListElement.length, withRating, sample: data.itemListElement[0].item };
    });
    check('S-01-jsonld', !!ld && ld.n === 258 && ld.len === 258 && ld.withRating === 0,
        ld ? `numberOfItems=${ld.n}, items=${ld.len}, aggregateRating=${ld.withRating}` : 'no generado');
    check('S-02-snippets', !!ld && ld.withRating === 0, 'sin aggregateRating inválido');

    // 5. U-04: búsqueda indexa platos de la carta ("risotto" está en menús)
    await page.fill('#searchInput', 'risotto');
    await page.waitForTimeout(700);
    const risotto = (await page.locator('#resultCount').textContent()).trim();
    await page.fill('#searchInput', '');
    await page.waitForTimeout(700);
    check('U-04-busqueda-cartas', !risotto.startsWith('0'), `buscar "risotto" → ${risotto}`);

    // 6. A-04: tarjeta activable con barra espaciadora
    await page.locator('.place-card').first().focus();
    await page.keyboard.press('Space');
    await page.waitForTimeout(400);
    let drawerOpen = await page.evaluate(() => document.getElementById('modalDrawer').classList.contains('open'));
    check('A-04-espaciadora', drawerOpen, 'Space abre el detalle');

    // 7. A-02: drawer = diálogo con trampa de foco
    const dlg = await page.evaluate(() => {
        const d = document.getElementById('modalDrawer');
        return { role: d.getAttribute('role'), modal: d.getAttribute('aria-modal'), label: d.getAttribute('aria-labelledby') };
    });
    const focusedIsDrawer = await page.evaluate(() => document.getElementById('modalDrawer').contains(document.activeElement));
    check('A-02-dialog', dlg.role === 'dialog' && dlg.modal === 'true' && focusedIsDrawer,
        `role=${dlg.role}, aria-modal=${dlg.modal}, foco dentro=${focusedIsDrawer}`);
    // trampa de Tab: 8 tabulaciones deben mantenerse dentro
    for (let i = 0; i < 8; i++) await page.keyboard.press('Tab');
    const stillInside = await page.evaluate(() => document.getElementById('modalDrawer').contains(document.activeElement));
    check('A-02-trampa', stillInside, 'Tab permanece dentro del drawer');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);

    // 8. A-09: copiar dirección es un <button>
    await page.locator('.place-card').first().click();
    await page.waitForTimeout(400);
    const copyBtn = await page.evaluate(() => {
        const b = document.querySelector('.copy-address');
        return b ? b.tagName : null;
    });
    check('A-09-copiar-btn', copyBtn === 'BUTTON', `elemento=${copyBtn}`);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // 9. A-01: colección enfocable y activable por teclado
    await page.locator('.collection-card').first().focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    const colActive = await page.evaluate(() => document.querySelector('.collection-card.active') !== null);
    const colFiltered = (await page.locator('#resultCount').textContent()).trim();
    check('A-01-colecciones', colActive, `Enter activa la colección (${colFiltered})`);
    await page.evaluate(() => clearCollection());

    // 10. A-03: menú móvil oculto al árbol de accesibilidad cuando está cerrado
    const mm = await page.evaluate(() => {
        const m = document.getElementById('mobileMenu');
        return { hidden: m.getAttribute('aria-hidden'), inert: m.hasAttribute('inert') };
    });
    check('A-03-menu-movil', mm.hidden === 'true' && mm.inert, `aria-hidden=${mm.hidden}, inert=${mm.inert}`);

    // 11. A-06: banner PWA inerte mientras está oculto (tras cerrarlo si ya se mostró)
    const pwa = await page.evaluate(() => {
        const b = document.getElementById('pwaInstallBanner');
        const visible = b.style.opacity === '1';
        if (visible) document.getElementById('pwaBannerCloseBtn').click();
        return { inert: b.hasAttribute('inert'), hidden: b.getAttribute('aria-hidden'), wasVisible: visible };
    });
    check('A-06-banner', pwa.inert && pwa.hidden === 'true', `inert=${pwa.inert}, aria-hidden=${pwa.hidden} (era visible=${pwa.wasVisible})`);

    // 12. A-05: contraste AA en tema claro (badge abierto) — forzamos tema claro
    await page.evaluate(() => {
        localStorage.setItem('sabormap-theme', 'light');
        document.documentElement.setAttribute('data-theme', 'light');
    });
    await page.waitForTimeout(300);
    const badgeColor = await page.evaluate(() => {
        const el = document.querySelector('.place-card .open-badge.open') || document.querySelector('.open-badge.open');
        return el ? getComputedStyle(el).color : null;
    });
    check('A-05-contraste', badgeColor === 'rgb(4, 120, 87)', `color badge claro=${badgeColor} (esperado #047857)`);
    await page.evaluate(() => {
        localStorage.setItem('sabormap-theme', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
    });

    // 13. P-03: Leaflet NO cargado en la vista grilla
    const leafletLoaded = await page.evaluate(() => typeof window.L !== 'undefined');
    check('P-03-leaflet-lazy', !leafletLoaded, `window.L presente=${leafletLoaded}`);

    // 14. U-03/A-10: logo enlaza al inicio + skip link presente
    const misc = await page.evaluate(() => ({
        logo: !!document.querySelector('header a[aria-label*="inicio"]'),
        skip: !!document.querySelector('a.skip-link'),
        marqueeAria: !!document.querySelector('.marquee-track span[aria-hidden="true"]')
    }));
    check('U-03-logo', misc.logo, 'logo con enlace al inicio');
    check('A-10-skiplink', misc.skip, 'skip link presente');
    check('A-07-marquee', misc.marqueeAria, 'copia del marquee oculta a lectores');

    // Errores de consola (informativo; se excluyen 404 de imágenes no incluidas en el sitio de prueba)
    const realErrors = consoleErrors.filter(e => !e.includes('Failed to load resource'));
    check('JS-consola', realErrors.length === 0, realErrors.slice(0, 3).join(' | ') || 'sin errores de JS (404 de imágenes excluidos)');

    fs.writeFileSync('smoke_results.json', JSON.stringify(results, null, 2));
    const fails = results.filter(r => !r.ok).length;
    console.log(`\n════ ${results.length - fails}/${results.length} comprobaciones superadas ════`);
    await browser.close();
    process.exit(fails ? 1 : 0);
})().catch(e => { console.error('ERROR TEST:', e); process.exit(2); });
