/* Lawsonite Field Guides — offline crash courses, cheats, manuals, extra TS. */
(function () {
  'use strict';

  var G = window.__LAWSONITE_GUIDES__;
  var root = null;

  function pathOf() {
    return location.pathname.replace(/\/+$/, '') || '/';
  }
  function isGuidesPath(p) {
    p = p || pathOf();
    return p === '/field' || p === '/guides' || p.indexOf('/guides/') === 0;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function html(tag, cls, inner) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (inner != null) n.innerHTML = inner;
    return n;
  }
  function pageOf(id) {
    return G && G.pages && G.pages[id] ? G.pages[id] : null;
  }
  function tokensOf(s) {
    return String(s || '').toLowerCase().split(/[^a-z0-9+/]+/).filter(function (t) { return t.length > 0; });
  }
  function hayMatch(hay, q) {
    var tokens = tokensOf(q);
    if (!tokens.length) return true;
    hay = String(hay || '').toLowerCase();
    for (var i = 0; i < tokens.length; i++) if (hay.indexOf(tokens[i]) < 0) return false;
    return true;
  }
  function productHay(p) {
    if (!p) return '';
    var d = window.__LAWSONITE_DEFAULTS_FOR__ ? window.__LAWSONITE_DEFAULTS_FOR__(p) : null;
    var def = d
      ? [d.user, d.pass, d.ip, d.extra, 'default login', 'factory default']
      : [];
    return [p.title, p.brand, p.use, p.look, (p.gotchas || []).join(' '), (p.tags || []).join(' ')].concat(def).join(' ');
  }
  var TRADES = [
    { key: 'all', label: 'All' },
    { key: 'fire', label: 'Fire' },
    { key: 'access', label: 'Access' },
    { key: 'cameras', label: 'Cameras' },
    { key: 'intrusion', label: 'Intrusion' },
    { key: 'power', label: 'Power' }
  ];
  function productTrade(p) {
    var hay = [p.brand, p.title, (p.tags || []).join(' '), p.use].join(' ').toLowerCase();
    if (/\b(facp|commercial fire|nac booster|strobe|smoke|suppression|vesda|litespeed|flashscan|truealarm|notifier|fire-lite|firelite|simplex|silent knight|edward|est3|est4|potter|kidde|fenwal|siemens|cerberus|hochiki|fike|gentex|wheelock|system sensor|gamewell|mircom|fcps|stopper|nbg|pull station)\b/.test(hay)) return 'fire';
    if (/\b(commercial camera|nvr|vms|ptz|thermal|megapix|flexidome|autodome|spectrum|xprotect|videoedge|command \+ cameras)\b/.test(hay)) return 'cameras';
    if (/\bcamera\b/.test(hay) && !/\b(doorbell|intercom)\b/.test(hay)) return 'cameras';
    if (/\b(altronix|lifesafety|lock power|acm8|acm4|fpo|maximal|trove|802\.3af|802\.3at|unifi switch poe)\b/.test(hay)) return 'power';
    if (/\b(commercial access|maglock|strike|osdp|wiegand|mercury|exit device|wireless lock|cloud access|lenel|salto|dsx|kantech|brivo|gallagher|paxton|doorking|istar|win-pak|netaxs|pro-watch)\b/.test(hay)) return 'access';
    if (/\b(hid |hes |securitron|von duprin|schlage|lcn |detex|camden|liftmaster|rutherford|command access|farpointe|identiv|amag|feenics|cdvi|isonas|iei |essex|bea )\b/.test(hay)) return 'access';
    if (/\b(intercom|aiphone|2n )\b/.test(hay)) return 'access';
    if (/\b(vista|intrusion|dsc|neo|communicator|alarmnet|qolsys|2gig|galaxy|paradox|ltem|proa7|interlogix|napco|radion|telguard|alula|elk m1|m1 gold|rj31x|rj38x|seizure)\b/.test(hay)) return 'intrusion';
    if (/\b(dmp |bosch)\b/.test(hay) && /\b(b-series|d9412|b8512|b5512|gv4|radion|solution)\b/.test(hay)) return 'intrusion';
    if (/\b(poe)\b/.test(hay)) return 'power';
    if (/\b(dmp|bosch|napco|honeywell|resideo)\b/.test(hay)) return 'intrusion';
    return 'other';
  }
  function allProducts() {
    if (G && G.products && G.products.length) return G.products;
    var p = pageOf('manuals');
    var out = [];
    ((p && p.sections) || []).forEach(function (s) {
      if (s.type === 'products') out = s.items || [];
    });
    return out;
  }

  function productSlug(p) {
    return String((p.brand || '') + ' ' + (p.title || ''))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48);
  }
  function shortId(p) {
    var s = productSlug(p);
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }
  function productByShort(id) {
    var list = allProducts();
    for (var i = 0; i < list.length; i++) if (shortId(list[i]) === id) return list[i];
    return null;
  }

  var PACK_KEY = 'lawsonite-jobpack-v1';
  var BOM_KEY = 'lawsonite-bom-v1';
  var FORMS_KEY = 'lawsonite-jobforms-v1';
  var JOBS_KEY = 'lawsonite-jobs-v1';
  var MAX_PINS = 24;
  var MAX_JOBS = 24;
  function jobId() {
    return Date.now().toString(36) + Math.floor(Math.random() * 1e5).toString(36);
  }
  function readJSON(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key) || 'null');
      return v == null ? fallback : v;
    } catch (e) { return fallback; }
  }
  function writeJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
  function blankJob(name) {
    var n = String(name || '').trim() || 'Job';
    return {
      id: jobId(),
      name: n,
      pack: { title: n, ids: [] },
      forms: { zones: [], doors: [], cameras: [] },
      bom: { items: [] }
    };
  }
  function currentJobFrom(s) {
    var i;
    for (i = 0; i < s.jobs.length; i++) if (s.jobs[i].id === s.current) return s.jobs[i];
    return s.jobs[0];
  }
  function loadJobsState() {
    var s = readJSON(JOBS_KEY, null);
    if (s && Array.isArray(s.jobs) && s.jobs.length) {
      if (!s.jobs.some(function (j) { return j.id === s.current; })) s.current = s.jobs[0].id;
      return s;
    }
    var pack = readJSON(PACK_KEY, {}) || {};
    var forms = readJSON(FORMS_KEY, {}) || {};
    var bom = readJSON(BOM_KEY, {}) || {};
    var name = (pack.title && pack.title !== 'Job pack') ? pack.title : (bom.job || 'Job');
    var job = blankJob(name);
    job.pack = { title: pack.title || name, ids: Array.isArray(pack.ids) ? pack.ids.slice() : [] };
    job.forms = {
      zones: Array.isArray(forms.zones) ? forms.zones : [],
      doors: Array.isArray(forms.doors) ? forms.doors : [],
      cameras: Array.isArray(forms.cameras) ? forms.cameras : []
    };
    job.bom = { items: Array.isArray(bom.items) ? bom.items : [] };
    s = { current: job.id, jobs: [job] };
    writeJSON(JOBS_KEY, s);
    return s;
  }
  function saveJobsState(s) {
    writeJSON(JOBS_KEY, s);
    var j = currentJobFrom(s);
    if (!j) return;
    writeJSON(PACK_KEY, j.pack || { title: 'Job pack', ids: [] });
    writeJSON(FORMS_KEY, j.forms || { zones: [], doors: [], cameras: [] });
    writeJSON(BOM_KEY, { job: j.name || '', items: (j.bom && j.bom.items) || [] });
  }
  function currentJob() { return currentJobFrom(loadJobsState()); }
  function patchCurrentJob(fn) {
    var s = loadJobsState();
    fn(currentJobFrom(s));
    saveJobsState(s);
  }
  function afterJobChange() {
    var path = pathOf();
    if (path === '/guides/pack') {
      var p = loadPack();
      try { history.replaceState({}, '', packHref(p.ids, p.title)); } catch (e) {}
    }
    route();
  }
  function switchJob(id) {
    var s = loadJobsState();
    if (!s.jobs.some(function (j) { return j.id === id; })) return;
    s.current = id;
    saveJobsState(s);
    afterJobChange();
  }
  function createJob(name) {
    var s = loadJobsState();
    if (s.jobs.length >= MAX_JOBS) return currentJob();
    var job = blankJob(name || ('Job ' + (s.jobs.length + 1)));
    s.jobs.unshift(job);
    s.current = job.id;
    saveJobsState(s);
    afterJobChange();
    return job;
  }
  function deleteJob(id) {
    var s = loadJobsState();
    if (s.jobs.length < 2) return;
    s.jobs = s.jobs.filter(function (j) { return j.id !== id; });
    if (s.current === id) s.current = s.jobs[0].id;
    saveJobsState(s);
    afterJobChange();
  }
  function loadPack() {
    var p = currentJob().pack || {};
    return { title: p.title || 'Job pack', ids: Array.isArray(p.ids) ? p.ids.slice() : [] };
  }
  function savePack(pack) {
    patchCurrentJob(function (j) {
      j.pack = { title: pack.title || 'Job pack', ids: (pack.ids || []).slice() };
      if (pack.title && pack.title !== 'Job pack') j.name = pack.title;
    });
  }
  function loadBom() {
    var j = currentJob();
    return { job: j.name || '', items: Array.isArray(j.bom && j.bom.items) ? j.bom.items.slice() : [] };
  }
  function saveBom(bom) {
    patchCurrentJob(function (j) {
      j.bom = { items: Array.isArray(bom.items) ? bom.items : [] };
      if (bom.job && String(bom.job).trim()) j.name = String(bom.job).trim();
    });
  }
  function loadForms() {
    var f = currentJob().forms || {};
    return {
      zones: Array.isArray(f.zones) ? f.zones : [],
      doors: Array.isArray(f.doors) ? f.doors : [],
      cameras: Array.isArray(f.cameras) ? f.cameras : []
    };
  }
  function saveForms(f) {
    patchCurrentJob(function (j) {
      j.forms = {
        zones: Array.isArray(f.zones) ? f.zones : [],
        doors: Array.isArray(f.doors) ? f.doors : [],
        cameras: Array.isArray(f.cameras) ? f.cameras : []
      };
    });
  }
  function addBomItem(item, qty) {
    qty = parseInt(qty, 10);
    if (!(qty > 0)) qty = 1;
    var bom = loadBom();
    var i;
    for (i = 0; i < bom.items.length; i++) {
      if (bom.items[i].mpn === item.mpn && bom.items[i].name === item.name) {
        bom.items[i].qty += qty;
        saveBom(bom);
        return bom;
      }
    }
    bom.items.push({
      mpn: item.mpn || '',
      name: item.name || '',
      desc: item.desc || '',
      qty: qty
    });
    saveBom(bom);
    return bom;
  }
  function bomText() {
    var bom = loadBom();
    var pack = loadPack();
    var job = bom.job || (pack.title && pack.title !== 'Job pack' ? pack.title : 'Job');
    var lines = [
      'Lawsonite hardware pack list',
      job,
      new Date().toLocaleString(),
      '',
      'QTY\tMPN\tITEM',
      '---\t---\t----'
    ];
    var i, it;
    for (i = 0; i < bom.items.length; i++) {
      it = bom.items[i];
      lines.push(it.qty + '\t' + (it.mpn || '—') + '\t' + it.name + (it.desc ? ' — ' + it.desc : ''));
    }
    if (!bom.items.length) lines.push('(empty)');
    lines.push('');
    lines.push('Educational field aide. Confirm nVent CADDY catalog, AHJ, TIA, and NEC before you order.');
    lines.push('Lawsonite by Tomcat Studios — lawsonite.tomcatstudios.com/guides/hardware');
    return lines.join('\n');
  }
  function isPinned(id) {
    return loadPack().ids.indexOf(id) >= 0;
  }
  function togglePin(id) {
    var pack = loadPack();
    var i = pack.ids.indexOf(id);
    if (i >= 0) pack.ids.splice(i, 1);
    else {
      pack.ids.unshift(id);
      if (pack.ids.length > MAX_PINS) pack.ids.length = MAX_PINS;
    }
    savePack(pack);
    return pack;
  }
  function packHref(ids, title) {
    var q = 'i=' + (ids || []).join(',');
    if (title && title !== 'Job pack') q += '&t=' + encodeURIComponent(title);
    return '/guides/pack?' + q;
  }
  function packAbs(ids, title) {
    var origin = location.origin && location.origin !== 'null' && location.protocol !== 'data:'
      ? location.origin
      : 'https://lawsonite.tomcatstudios.com';
    if (String(origin).indexOf('data:') === 0) origin = 'https://lawsonite.tomcatstudios.com';
    var href = packHref(ids, title);
    if (href.indexOf('data:') === 0) href = '/guides/pack';
    return origin + href;
  }
  function packQrUrl(ids, title) {
    var full = packAbs(ids, title);
    if (full.indexOf('data:') === 0 || full.indexOf('http') !== 0) {
      full = packAbs(ids, '');
    }
    if (full.length <= 220) return full;
    return packAbs(ids, '');
  }
  function shopBrand() {
    try {
      var pro = JSON.parse(localStorage.getItem('lawsonite-pro-v0') || '{}');
      var brand = JSON.parse(localStorage.getItem('lawsonite-company-brand-v0') || '{}');
      var shop = pro.plan === 'pro' || pro.plan === 'shop';
      var configured = !!(String(brand.companyName || '').trim() || brand.logoDataUrl);
      return { shop: shop && configured, brand: brand || {} };
    } catch (e) {
      return { shop: false, brand: {} };
    }
  }
  function lawsoniteMark() {
    var mark = el('div', 'gd-lmark');
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = 'L';
    return mark;
  }
  function printLetterhead(docTitle, opts) {
    opts = opts || {};
    var shop = shopBrand();
    var box = el('div', 'gd-letterhead');
    var row = el('div', 'gd-letterhead-row');
    if (shop.shop && shop.brand.logoDataUrl) {
      var img = document.createElement('img');
      img.className = 'gd-letterhead-logo';
      img.src = shop.brand.logoDataUrl;
      img.alt = '';
      row.appendChild(img);
    } else {
      row.appendChild(lawsoniteMark());
    }
    var text = el('div', 'gd-letterhead-text');
    text.appendChild(el('p', 'gd-letterhead-company',
      shop.shop && shop.brand.companyName
        ? String(shop.brand.companyName).trim()
        : 'Lawsonite Field Checklists'));
    if (shop.shop) {
      var contact = [shop.brand.phone, shop.brand.email].filter(function (x) { return x && String(x).trim(); }).join(' · ');
      if (contact) text.appendChild(el('p', 'gd-letterhead-sub', contact));
      text.appendChild(el('p', 'gd-letterhead-sub', 'Powered by Lawsonite · Tomcat Studios'));
    } else {
      text.appendChild(el('p', 'gd-letterhead-sub', 'by Tomcat Studios'));
    }
    if (docTitle) text.appendChild(el('p', 'gd-letterhead-doc', docTitle));
    if (opts.jobName) text.appendChild(el('p', 'gd-letterhead-job', opts.jobName));
    row.appendChild(text);
    box.appendChild(row);
    if (opts.qrUrl) {
      var qr = qrBox(opts.qrUrl, opts.qrCap || 'Scan to open this pack', 200);
      qr.classList.add('gd-qr-head');
      if (opts.qrPrintOnly) qr.classList.add('only-print');
      box.appendChild(qr);
      box.classList.add('gd-letterhead-with-qr');
    }
    return box;
  }
  function paintQrInto(wrap, url, cssPx) {
    wrap.querySelectorAll('canvas, svg, .gd-qr-fallback, .gd-qr-waiting').forEach(function (n) {
      n.remove();
    });
    try {
      if (window.LAWSONITE_QR && window.LAWSONITE_QR.mount) {
        wrap.insertBefore(window.LAWSONITE_QR.mount(url, cssPx), wrap.firstChild);
        return true;
      }
      if (window.LAWSONITE_QR && window.LAWSONITE_QR.svg) {
        var holder = document.createElement('div');
        holder.innerHTML = window.LAWSONITE_QR.svg(url, cssPx);
        var node = holder.firstChild;
        if (node) wrap.insertBefore(node, wrap.firstChild);
        return !!node;
      }
    } catch (e) {}
    return false;
  }
  function qrBox(url, cap, cssPx) {
    var wrap = el('div', 'gd-qr');
    cssPx = cssPx || 280;
    if (cssPx < 180) cssPx = 180;
    var waiting = el('p', 'gd-qr-waiting muted', 'Preparing QR…');
    wrap.appendChild(waiting);
    wrap.appendChild(el('p', 'gd-qr-cap', cap || 'Scan to open this pack'));
    var tries = 0;
    var maxTries = 25;
    function attempt() {
      if (paintQrInto(wrap, url, cssPx)) {
        var w = wrap.querySelector('.gd-qr-waiting');
        if (w) w.remove();
        return;
      }
      tries += 1;
      if (tries < maxTries) {
        setTimeout(attempt, 80);
        return;
      }
      var w2 = wrap.querySelector('.gd-qr-waiting');
      if (w2) w2.remove();
      if (!wrap.querySelector('.gd-qr-fallback')) {
        wrap.insertBefore(el('p', 'gd-qr-fallback', url), wrap.firstChild);
      }
    }
    attempt();
    return wrap;
  }
  function productCard(p, opts) {
    opts = opts || {};
    var id = shortId(p);
    var card = el('article', 'gd-product');
    var top = el('div', 'gd-product-top');
    var tags = el('div', 'gd-product-tags');
    if (p.brand) tags.appendChild(el('span', 'gd-tag', p.brand));
    var trade = productTrade(p);
    var tradeLabel = (TRADES.concat([{ key: 'other', label: 'Other' }]).filter(function (t) { return t.key === trade; })[0] || {}).label;
    if (tradeLabel) tags.appendChild(el('span', 'gd-tag gd-tag-trade', tradeLabel));
    if (opts.pin !== false) {
      var pinned = isPinned(id);
      var pin = el('button', 'gd-pin' + (pinned ? ' is-on' : ''), pinned ? '★' : '☆');
      pin.type = 'button';
      pin.title = pinned ? 'Unpin from job pack' : 'Pin to job pack';
      pin.setAttribute('aria-label', pin.title);
      pin.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        togglePin(id);
        var on = isPinned(id);
        pin.classList.toggle('is-on', on);
        pin.textContent = on ? '★' : '☆';
        pin.title = on ? 'Unpin from job pack' : 'Pin to job pack';
        pin.setAttribute('aria-label', pin.title);
        if (opts.onPin) opts.onPin();
      });
      tags.appendChild(pin);
    }
    top.appendChild(tags);
    top.appendChild(el('h3', null, p.title));
    card.appendChild(top);
    if (p.use) card.appendChild(el('p', 'gd-product-use', p.use));
    if (p.look || (p.gotchas && p.gotchas.length)) {
      var d = document.createElement('details');
      d.className = 'gd-more';
      if (opts.open) d.open = true;
      d.appendChild(el('summary', null, 'Field notes'));
      if (p.look) {
        var look = el('p');
        look.appendChild(el('strong', null, 'Label: '));
        look.appendChild(document.createTextNode(p.look));
        d.appendChild(look);
      }
      if (p.gotchas && p.gotchas.length) {
        var ul = el('ul', 'gd-steps');
        p.gotchas.forEach(function (g) { ul.appendChild(el('li', null, g)); });
        d.appendChild(ul);
      }
      card.appendChild(d);
    }
    var fac = window.__LAWSONITE_DEFAULTS_FOR__ ? window.__LAWSONITE_DEFAULTS_FOR__(p) : (p.defaults || null);
    if (fac) {
      var fd = document.createElement('details');
      fd.className = 'gd-more gd-defaults';
      if (opts.open) fd.open = true;
      fd.appendChild(el('summary', null, 'Factory defaults'));
      var dl = el('dl', 'gd-kv gd-defaults-kv');
      [['User / installer', fac.user], ['Password / master', fac.pass], ['Default IP', fac.ip]].forEach(function (pair) {
        if (!pair[1]) return;
        var row = el('div');
        row.appendChild(el('dt', null, pair[0]));
        row.appendChild(el('dd', null, pair[1]));
        dl.appendChild(row);
      });
      fd.appendChild(dl);
      if (fac.extra) fd.appendChild(el('p', 'gd-defaults-extra', fac.extra));
      fd.appendChild(el('p', 'gd-mini', 'Change these. Official sheet wins. Not a backdoor list — if they still work, the last tech left the job open.'));
      card.appendChild(fd);
    }
    if (p.href) {
      var a = el('a', 'gd-link');
      a.href = p.href;
      var external = /^https?:/i.test(p.href);
      if (external) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      var left = el('span');
      left.appendChild(el('strong', null, p.linkLabel || (external ? 'Manufacturer docs' : 'Open')));
      if (p.linkSub) left.appendChild(el('em', null, p.linkSub));
      a.appendChild(left);
      a.appendChild(el('span', 'gd-ext', external ? 'Official' : 'Open'));
      card.appendChild(a);
    }
    return card;
  }

  var TIP_URL =
    'https://www.paypal.com/donate/?business=tlawson1988%40gmail.com&currency_code=USD&item_name=Energy%20drink%20for%20Lawsonite';
  var TOMCAT_URL = 'https://tomcatstudios.com/';
  var TIP_PHRASES = [
    'Buy me a Monster',
    'Buy me a can of chew',
    'Buy me a burger',
    'Buy me a roll of tape',
    'Buy me some gas',
    'Buy me some dolphins',
    'Buy me some zip-ties',
    'Buy me a coffee',
    'Buy me a breakfast burrito',
    'Buy me some jerky',
    'Buy me a Gatorade',
    'Buy me some sunflower seeds',
    'Buy me a slice of pizza',
    'Buy me a Diet Pepsi',
    'Buy me a bacon egg n cheese biscuit',
    'Buy me some ibuprofen',
    'Buy me a 5-hour Energy',
    'Buy me a case of water'
  ];
  function pickTip(except) {
    var pool = except ? TIP_PHRASES.filter(function (p) { return p !== except; }) : TIP_PHRASES;
    return pool[Math.floor(Math.random() * pool.length)] || TIP_PHRASES[0];
  }
  function studioFoot() {
    var foot = el('footer', 'gd-studio-foot');
    var brand = el('p', 'gd-studio-brand');
    var tom = el('a', null, 'by Tomcat Studios');
    tom.href = TOMCAT_URL;
    tom.target = '_blank';
    tom.rel = 'noopener noreferrer';
    brand.appendChild(document.createTextNode('Lawsonite · '));
    brand.appendChild(tom);
    var tip = el('a', 'gd-tip-jar');
    tip.href = TIP_URL;
    tip.target = '_blank';
    tip.rel = 'noopener noreferrer';
    tip.textContent = pickTip();
    if (root._tipTimer) window.clearInterval(root._tipTimer);
    root._tipTimer = window.setInterval(function () {
      tip.textContent = pickTip(tip.textContent);
    }, 8000);
    foot.appendChild(brand);
    foot.appendChild(tip);
    return foot;
  }

  function jobBar() {
    var s = loadJobsState();
    var bar = el('div', 'gd-jobbar no-print');
    bar.appendChild(el('span', 'gd-jobbar-lab', 'Job'));
    var sel = document.createElement('select');
    sel.className = 'gd-jobbar-sel';
    sel.setAttribute('aria-label', 'Current job');
    s.jobs.forEach(function (j) {
      var o = document.createElement('option');
      o.value = j.id;
      var pins = j.pack && j.pack.ids ? j.pack.ids.length : 0;
      o.textContent = (j.name || 'Job') + (pins ? ' · ' + pins + ' pins' : '');
      sel.appendChild(o);
    });
    sel.value = s.current;
    sel.addEventListener('change', function () { switchJob(sel.value); });
    bar.appendChild(sel);
    var add = el('button', 'gd-chip', '+ Job');
    add.type = 'button';
    add.title = 'Start a new job — pins, sheets, and pack list stay on the old one';
    add.addEventListener('click', function () {
      var name = window.prompt('Name this job', '');
      if (name === null) return;
      createJob(name.trim() || ('Job ' + (loadJobsState().jobs.length + 1)));
    });
    bar.appendChild(add);
    if (s.jobs.length > 1) {
      var del = el('button', 'gd-chip', 'Delete');
      del.type = 'button';
      del.addEventListener('click', function () {
        var j = currentJob();
        if (window.confirm('Delete “' + (j.name || 'Job') + '”? Pins, zone/door/camera sheets, and the hardware list for this job go with it.')) {
          deleteJob(j.id);
        }
      });
      bar.appendChild(del);
    }
    return bar;
  }
  function mount(node) {
    root.innerHTML = '';
    root.appendChild(jobBar());
    root.appendChild(node);
    root.appendChild(studioFoot());
    window.scrollTo(0, 0);
  }

  function backLink(href, label) {
    var a = el('a', 'gd-back fk-link', '← ' + (label || 'Field'));
    a.href = href || '/field';
    return a;
  }

  function related(list) {
    if (!list || !list.length) return null;
    var row = el('nav', 'gd-related');
    row.setAttribute('aria-label', 'Related');
    list.forEach(function (r) {
      var a = el('a', 'fk-link', r.label);
      a.href = r.href;
      row.appendChild(a);
    });
    return row;
  }

  function toolRow(item) {
    var a = el('a', 'gd-row fk-link');
    a.href = item.href;
    a.appendChild(html('div', 'gd-tile-ico', icon(item.icon || 'zap')));
    var t = el('div', 'gd-row-text');
    t.appendChild(el('strong', null, item.title));
    if (item.sub) t.appendChild(el('span', null, item.sub));
    a.appendChild(t);
    if (item.kind) a.appendChild(el('em', 'gd-kind', item.kind));
    return a;
  }

  function pageHay(p) {
    return p.title + ' ' + (p.lede || '') + ' ' + (p.hub || '') + ' ' + (p.tags || []).join(' ') + ' ' + (p.eyebrow || '');
  }

  function renderHub() {
    var page = el('div', 'page gd-page');
    var head = el('header', 'gd-hero');
    head.appendChild(el('h1', null, 'Field'));
    head.appendChild(el('p', 'gd-lede', 'Symptom, device, or brand — one search.'));
    page.appendChild(head);

    var bar = el('div', 'gd-toolbar');
    var q = el('input', 'gd-search');
    q.type = 'search';
    q.placeholder = 'Vista 128, maglock, PoE, EOL…';
    q.setAttribute('aria-label', 'Search field tools');
    q.setAttribute('enterkeyhint', 'search');
    bar.appendChild(q);

    var chipRow = el('div', 'gd-chips gd-filters');
    var filterKey = 'all';
    var filters = [
      { key: 'all', label: 'All' },
      { key: 'learn', label: 'Learn' },
      { key: 'cheat', label: 'Cheats' },
      { key: 'ts', label: 'Calls' },
      { key: 'docs', label: 'Docs' }
    ];
    var chipBtns = [];
    filters.forEach(function (f) {
      var b = el('button', 'gd-chip' + (f.key === 'all' ? ' is-on' : ''), f.label);
      b.type = 'button';
      b.addEventListener('click', function () {
        filterKey = f.key;
        chipBtns.forEach(function (x) { x.classList.toggle('is-on', x === b); });
        paint();
      });
      chipBtns.push(b);
      chipRow.appendChild(b);
    });
    bar.appendChild(chipRow);
    page.appendChild(bar);

    var meta = el('p', 'gd-meta');
    page.appendChild(meta);
    var groupsHost = el('div', 'gd-groups');
    page.appendChild(groupsHost);

    function paint() {
      groupsHost.textContent = '';
      var f = (q.value || '').trim();
      var n = 0;

      if (f) {
        var hits = [];
        (G.groups || []).forEach(function (g) {
          if (filterKey !== 'all' && g.key !== filterKey) return;
          (g.ids || []).forEach(function (id) {
            var p = pageOf(id);
            if (!p) return;
            var ok = hayMatch(pageHay(p), f);
            if (id === 'manuals' && allProducts().some(function (pr) { return hayMatch(productHay(pr), f); })) ok = true;
            if (!ok) return;
            hits.push({
              href: (id === 'manuals') ? ('/guides/manuals?q=' + encodeURIComponent(f)) : ('/guides/' + id),
              title: p.title,
              sub: p.hub || p.lede || '',
              icon: p.icon || g.icon,
              kind: g.title
            });
          });
        });
        allProducts().forEach(function (pr) {
          if (filterKey !== 'all' && filterKey !== 'docs') return;
          if (!hayMatch(productHay(pr), f)) return;
          hits.push({
            href: '/guides/manuals?q=' + encodeURIComponent(pr.title.split('/')[0].trim()),
            title: pr.title,
            sub: pr.brand || 'Official docs',
            icon: 'book',
            kind: 'Manual'
          });
        });
        PAPER_IDS.forEach(function (id) {
          if (filterKey !== 'all' && filterKey !== 'docs') return;
          var spec = JOB_SHEETS[id];
          if (!hayMatch(spec.title + ' ' + spec.sub + ' ' + spec.lede + ' printable', f)) return;
          hits.push({
            href: '/guides/' + id,
            title: spec.title,
            sub: spec.sub,
            icon: spec.icon,
            kind: 'Paper'
          });
        });
        [
          { href: '/guides/hardware', title: 'Cable hardware picker', sub: 'CADDY-class spec card', icon: 'clip', hay: 'cable hardware caddy j-hook beam clamp sammys cat6a fiber' },
          { href: '/guides/hardware?tab=mount', title: 'Device mounting picker', sub: 'Boxes, pipe, liquid-tite', icon: 'lock', hay: 'box emt liquid-tite fs fd tapcon camera mount pendant pole' },
          { href: '/guides/hardware?tab=cheats', title: 'Hardware cheat sheet', sub: 'Support vs substrate', icon: 'wire', hay: 'cheat sheet flange batwing bridle fs box lfmc' },
          { href: '/guides/hardware?tab=bom', title: 'Hardware pack list', sub: 'BOM for ADI / Anixter', icon: 'book', hay: 'bom pack list order hardware' }
        ].forEach(function (h) {
          if (filterKey !== 'all' && filterKey !== 'cheat') return;
          if (!hayMatch(h.hay + ' ' + h.title, f)) return;
          hits.push({ href: h.href, title: h.title, sub: h.sub, icon: h.icon, kind: 'Tool' });
        });
        var seen = {};
        hits = hits.filter(function (h) {
          if (seen[h.href + h.title]) return false;
          seen[h.href + h.title] = 1;
          return true;
        });
        n = hits.length;
        meta.textContent = n ? (n + ' match' + (n === 1 ? '' : 'es')) : 'No matches';
        if (!hits.length) {
          groupsHost.appendChild(el('p', 'gd-empty', 'Nothing for that. Try a model, a symptom, or a brand.'));
          return;
        }
        var list = el('div', 'gd-list');
        hits.forEach(function (h) { list.appendChild(toolRow(h)); });
        groupsHost.appendChild(list);
        return;
      }

      var pack = loadPack();
      if (pack.ids.length && (filterKey === 'all' || filterKey === 'docs')) {
        n += 1;
        var packSec = el('section', 'gd-section');
        var ph = el('div', 'gd-section-head');
        ph.appendChild(el('h2', null, 'This job'));
        ph.appendChild(el('span', null, String(pack.ids.length)));
        packSec.appendChild(ph);
        var pl = el('div', 'gd-list');
        pl.appendChild(toolRow({
          href: packHref(pack.ids, pack.title),
          title: pack.title || 'Job pack',
          sub: pack.ids.length + ' pinned cards · panel QR',
          icon: 'book',
          kind: 'Pack'
        }));
        packSec.appendChild(pl);
        groupsHost.appendChild(packSec);
      }

      if (filterKey === 'all' || filterKey === 'cheat') {
        n += 3;
        var hwSec = el('section', 'gd-section');
        var hwh = el('div', 'gd-section-head');
        hwh.appendChild(el('h2', null, 'Rough-in'));
        hwh.appendChild(el('span', null, '3'));
        hwSec.appendChild(hwh);
        var hwl = el('div', 'gd-list');
        hwl.appendChild(toolRow({
          href: '/guides/hardware',
          title: 'Cable hardware picker',
          sub: 'Path, beam, flange, fill → CADDY-class spec',
          icon: 'clip',
          kind: 'Tool'
        }));
        hwl.appendChild(toolRow({
          href: '/guides/hardware?tab=mount',
          title: 'Device mounting picker',
          sub: 'Boxes, EMT, liquid-tite, Tapcons',
          icon: 'lock',
          kind: 'Tool'
        }));
        hwl.appendChild(toolRow({
          href: '/guides/hardware?tab=cheats',
          title: 'Hardware cheat sheet',
          sub: 'J-hook, hammer-on, batwing, FS box, LFMC',
          icon: 'wire',
          kind: 'Cheat'
        }));
        hwSec.appendChild(hwl);
        groupsHost.appendChild(hwSec);
      }

      if (filterKey === 'all' || filterKey === 'docs') {
        n += PAPER_IDS.length;
        var paperSec = el('section', 'gd-section');
        var ph2 = el('div', 'gd-section-head');
        ph2.appendChild(el('h2', null, 'Leave-behinds'));
        ph2.appendChild(el('span', null, String(PAPER_IDS.length)));
        paperSec.appendChild(ph2);
        var paperList = el('div', 'gd-list');
        PAPER_IDS.forEach(function (id) {
          var spec = JOB_SHEETS[id];
          paperList.appendChild(toolRow({
            href: '/guides/' + id,
            title: spec.title,
            sub: spec.sub,
            icon: spec.icon,
            kind: 'Paper'
          }));
        });
        paperSec.appendChild(paperList);
        groupsHost.appendChild(paperSec);
      }

      (G.groups || []).forEach(function (g) {
        if (filterKey !== 'all' && g.key !== filterKey) return;
        var ids = (g.ids || []).filter(function (id) { return !!pageOf(id); });
        if (!ids.length) return;
        n += ids.length;
        var block = el('section', 'gd-section');
        var h = el('div', 'gd-section-head');
        h.appendChild(el('h2', null, g.title));
        h.appendChild(el('span', null, String(ids.length)));
        block.appendChild(h);
        var list = el('div', 'gd-list');
        ids.forEach(function (id) {
          var p = pageOf(id);
          list.appendChild(toolRow({
            href: '/guides/' + id,
            title: p.title,
            sub: p.hub || '',
            icon: p.icon || g.icon
          }));
        });
        block.appendChild(list);
        groupsHost.appendChild(block);
      });
      meta.textContent = n ? (n + ' tools') : '';
    }
    q.addEventListener('input', paint);
    paint();
    return page;
  }

  function icon(name) {
    var I = {
      zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>',
      meter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M9 12h.01M12 12h.01M15 12h.01M9 16h6"/></svg>',
      cam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="13" height="10" rx="2"/><path d="M16 10l5-2v8l-5-2"/></svg>',
      door: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="3" width="12" height="18" rx="1"/><path d="M15 12h.01"/></svg>',
      lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
      book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z"/><path d="M6 3v16"/></svg>',
      net: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="8" width="8" height="8"/><path d="M12 3v5M12 16v5M3 12h5M16 12h5"/></svg>',
      fire: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3s5 5 5 9a5 5 0 1 1-10 0c0-2 2-4 3-6 0 2 2 2 2 4"/></svg>',
      wire: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 12h6M14 12h6M10 8v8M14 8v8"/></svg>',
      bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5"/><path d="M9 17a3 3 0 0 0 6 0"/></svg>',
      user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3"/><path d="M5 19a7 7 0 0 1 14 0"/></svg>',
      clip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 8h10M6 12h12M8 16h8"/><path d="M4 7l2-3h12l2 3v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z"/></svg>'
    };
    return I[name] || I.zap;
  }

  function renderSection(sec) {
    if (!sec || !sec.type) return el('div');
    if (sec.type === 'h2') {
      var h = el('div', 'gd-card');
      h.appendChild(el('h2', null, sec.text));
      if (sec.body) h.appendChild(el('p', null, sec.body));
      return h;
    }
    if (sec.type === 'p') {
      var c = el('div', 'gd-card');
      (sec.paras || [sec.text]).forEach(function (t) { c.appendChild(el('p', null, t)); });
      return c;
    }
    if (sec.type === 'warn' || sec.type === 'tip' || sec.type === 'note') {
      var box = el('div', 'gd-' + sec.type);
      var lab = { warn: 'Watch it', tip: 'Field tip', note: 'Note' }[sec.type];
      box.appendChild(el('strong', null, sec.label || lab));
      box.appendChild(document.createTextNode(sec.text));
      return box;
    }
    if (sec.type === 'steps') {
      var sc = el('div', 'gd-card');
      if (sec.title) sc.appendChild(el('h2', null, sec.title));
      var ol = el('ol', 'gd-steps');
      (sec.items || []).forEach(function (it) {
        var li = el('li');
        if (typeof it === 'string') li.textContent = it;
        else {
          li.appendChild(document.createTextNode(it.text));
          if (it.tip) li.appendChild(el('span', 'gd-mini', it.tip));
        }
        ol.appendChild(li);
      });
      sc.appendChild(ol);
      return sc;
    }
    if (sec.type === 'checks') {
      var cc = el('div', 'gd-card');
      if (sec.title) cc.appendChild(el('h2', null, sec.title));
      var ul = el('ul', 'gd-check');
      (sec.items || []).forEach(function (t) {
        var li = el('li');
        li.appendChild(el('span', 'gd-box'));
        li.appendChild(el('span', null, t));
        ul.appendChild(li);
      });
      cc.appendChild(ul);
      return cc;
    }
    if (sec.type === 'table') {
      var tc = el('div', 'gd-card');
      if (sec.title) tc.appendChild(el('h2', null, sec.title));
      if (sec.body) tc.appendChild(el('p', null, sec.body));
      var wrap = el('div', 'gd-table-wrap');
      var table = el('table', 'gd-table');
      var thead = document.createElement('thead');
      var trh = document.createElement('tr');
      (sec.headers || []).forEach(function (h) { trh.appendChild(el('th', null, h)); });
      thead.appendChild(trh);
      table.appendChild(thead);
      var tb = document.createElement('tbody');
      (sec.rows || []).forEach(function (r) {
        var tr = document.createElement('tr');
        r.forEach(function (cell) { tr.appendChild(el('td', null, cell)); });
        tb.appendChild(tr);
      });
      table.appendChild(tb);
      wrap.appendChild(table);
      tc.appendChild(wrap);
      if (sec.foot) tc.appendChild(el('p', 'gd-foot', sec.foot));
      return tc;
    }
    if (sec.type === 'svg') {
      var fig = el('figure', 'gd-svg');
      fig.innerHTML = sec.svg || '';
      if (sec.caption) fig.appendChild(el('figcaption', null, sec.caption));
      return fig;
    }
    if (sec.type === 'tiles') {
      var tg = el('div', 'gd-grid gd-grid-2');
      (sec.items || []).forEach(function (it) {
        var a = el('a', 'gd-tile fk-link');
        a.href = it.href;
        a.appendChild(html('div', 'gd-tile-ico', icon(it.icon || 'zap')));
        var t = el('div');
        t.appendChild(el('strong', null, it.title));
        if (it.sub) t.appendChild(el('span', null, it.sub));
        a.appendChild(t);
        tg.appendChild(a);
      });
      return tg;
    }
    if (sec.type === 'links') {
      var lc = el('div', 'gd-card');
      if (sec.title) lc.appendChild(el('h2', null, sec.title));
      if (sec.body) lc.appendChild(el('p', null, sec.body));
      var list = el('div', 'gd-links');
      (sec.items || []).forEach(function (it) {
        var a = el('a', 'gd-link');
        a.href = it.href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        var left = el('span');
        left.appendChild(el('strong', null, it.label));
        if (it.sub) left.appendChild(el('em', null, it.sub));
        a.appendChild(left);
        a.appendChild(el('span', 'gd-ext', 'Official'));
        list.appendChild(a);
      });
      lc.appendChild(list);
      return lc;
    }
    if (sec.type === 'faq') {
      var fc = el('div', 'gd-card gd-faq');
      if (sec.title) fc.appendChild(el('h2', null, sec.title));
      (sec.items || []).forEach(function (it) {
        var d = document.createElement('details');
        d.appendChild(el('summary', null, it.q));
        d.appendChild(el('p', null, it.a));
        fc.appendChild(d);
      });
      return fc;
    }
    if (sec.type === 'products') {
      return renderProducts(sec);
    }
    if (sec.type === 'widget') {
      if (sec.name === 'meter') return meterWidget(sec);
      if (sec.name === 'resistor') return resistorWidget();
    }
    return el('div');
  }

  function renderProducts(sec) {
    var wrap = el('div', 'gd-page');
    var bar = el('div', 'gd-toolbar');
    var q = el('input', 'gd-search');
    q.type = 'search';
    q.placeholder = 'Find a product — Verkada, Bosch, Vista 128, Salto, DSX…';
    q.setAttribute('aria-label', 'Search product cards');
    q.setAttribute('enterkeyhint', 'search');
    var pre = '';
    var tradeKey = 'all';
    try {
      var sp = new URLSearchParams(location.search);
      pre = sp.get('q') || '';
      tradeKey = sp.get('trade') || 'all';
    } catch (e) { pre = ''; }
    if (!TRADES.some(function (t) { return t.key === tradeKey; }) && tradeKey !== 'other') tradeKey = 'all';
    q.value = pre;
    bar.appendChild(q);

    var chipRow = el('div', 'gd-chips gd-filters');
    chipRow.setAttribute('role', 'tablist');
    chipRow.setAttribute('aria-label', 'Trade');
    var chipBtns = [];
    var allItems = (sec.items && sec.items.length) ? sec.items : allProducts();
    var hasOther = allItems.some(function (p) { return productTrade(p) === 'other'; });
    var trades = TRADES.slice();
    if (hasOther) trades.push({ key: 'other', label: 'Other' });
    trades.forEach(function (t) {
      var b = el('button', 'gd-chip' + (t.key === tradeKey ? ' is-on' : ''), t.label);
      b.type = 'button';
      b.setAttribute('aria-pressed', t.key === tradeKey ? 'true' : 'false');
      b.addEventListener('click', function () {
        tradeKey = t.key;
        chipBtns.forEach(function (x) {
          var on = x === b;
          x.classList.toggle('is-on', on);
          x.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        syncQuery();
        paint();
      });
      chipBtns.push(b);
      chipRow.appendChild(b);
    });
    bar.appendChild(chipRow);
    wrap.appendChild(bar);

    var packBar = el('div', 'gd-pack-bar no-print');
    wrap.appendChild(packBar);
    var meta = el('p', 'gd-meta');
    wrap.appendChild(meta);
    var host = el('div', 'gd-product-list');
    wrap.appendChild(host);

    function paintPackBar() {
      packBar.textContent = '';
      var pack = loadPack();
      var n = pack.ids.length;
      packBar.appendChild(el('span', null, n ? (n + ' pinned for this job') : 'Pin cards for this job'));
      if (n) {
        var open = el('a', 'gd-chip fk-link', 'Share pack (QR)');
        open.href = packHref(pack.ids, pack.title);
        packBar.appendChild(open);
      }
    }

    function syncQuery() {
      var params = [];
      if (tradeKey && tradeKey !== 'all') params.push('trade=' + encodeURIComponent(tradeKey));
      var f = (q.value || '').trim();
      if (f) params.push('q=' + encodeURIComponent(f));
      var next = '/guides/manuals' + (params.length ? ('?' + params.join('&')) : '');
      if ((location.pathname + location.search) !== next) {
        try { history.replaceState({}, '', next); } catch (e) {}
      }
    }

    function paint() {
      host.textContent = '';
      var f = (q.value || '').trim();
      var shown = 0;
      allItems.forEach(function (p) {
        var trade = productTrade(p);
        if (tradeKey !== 'all' && trade !== tradeKey) return;
        if (f && !hayMatch(productHay(p), f)) return;
        shown++;
        host.appendChild(productCard(p, { onPin: function () { paintPackBar(); } }));
      });
      var tradeName = tradeKey === 'all' ? '' : (' · ' + (tradeKey.charAt(0).toUpperCase() + tradeKey.slice(1)));
      if (shown) meta.textContent = shown + ' of ' + allItems.length + tradeName;
      else meta.textContent = '';
      if (!host.childNodes.length) {
        host.appendChild(el('p', 'gd-empty', f
          ? 'No product matched. Try Verkada, Vista 128, Salto, or a trade chip.'
          : 'Nothing in that trade yet. Pick All or search a model.'));
      }
      paintPackBar();
    }
    q.addEventListener('input', paint);
    paint();
    paintPackBar();
    return wrap;
  }

  function meterWidget(sec) {
    var box = el('div', 'gd-card');
    box.appendChild(el('h2', null, sec.title || 'What are you measuring?'));
    box.appendChild(el('p', 'gd-lede', 'Pick the thing in front of you. Typical numbers only — the label wins.'));
    var chips = el('div', 'gd-chips');
    var out = el('div', 'gd-measure');
    out.hidden = true;
    (sec.targets || []).forEach(function (t, idx) {
      var b = el('button', 'gd-chip', t.label);
      b.type = 'button';
      b.addEventListener('click', function () {
        chips.querySelectorAll('.gd-chip').forEach(function (c) { c.classList.remove('is-on'); });
        b.classList.add('is-on');
        out.hidden = false;
        out.textContent = '';
        out.appendChild(el('h3', null, t.label));
        var dl = el('dl', 'gd-kv');
        [['Range', t.range], ['Where', t.where], ['Expect', t.expect], ['If not', t.ifnot]].forEach(function (pair) {
          if (!pair[1]) return;
          var row = el('div');
          row.appendChild(el('dt', null, pair[0]));
          row.appendChild(el('dd', null, pair[1]));
          dl.appendChild(row);
        });
        out.appendChild(dl);
      });
      chips.appendChild(b);
      if (idx === 0) setTimeout(function () { b.click(); }, 0);
    });
    box.appendChild(chips);
    box.appendChild(out);
    return box;
  }

  var RES_COLORS = [
    { n: 'Black', v: 0, m: 1, hex: '#1a1a1a' },
    { n: 'Brown', v: 1, m: 10, hex: '#7a3f16' },
    { n: 'Red', v: 2, m: 100, hex: '#c0392b' },
    { n: 'Orange', v: 3, m: 1000, hex: '#e67e22' },
    { n: 'Yellow', v: 4, m: 10000, hex: '#f1c40f' },
    { n: 'Green', v: 5, m: 100000, hex: '#27ae60' },
    { n: 'Blue', v: 6, m: 1000000, hex: '#2980b9' },
    { n: 'Violet', v: 7, m: 10000000, hex: '#8e44ad' },
    { n: 'Gray', v: 8, m: 100000000, hex: '#7f8c8d' },
    { n: 'White', v: 9, m: 1000000000, hex: '#ecf0f1' }
  ];
  var RES_TOL = [
    { n: 'Brown 1%', hex: '#7a3f16' },
    { n: 'Red 2%', hex: '#c0392b' },
    { n: 'Gold 5%', hex: '#d4af37' },
    { n: 'Silver 10%', hex: '#c0c0c0' }
  ];

  function resistorWidget() {
    var box = el('div', 'gd-card');
    box.appendChild(el('h2', null, '4-band resistor'));
    box.appendChild(el('p', null, 'Spin the bands. Common EOLs live in the 1k–4.7k neighborhood — match what the panel is programmed for.'));
    var body = html('div', 'gd-res-body', '<i></i><i></i><i></i><i></i>');
    var bands = body.querySelectorAll('i');
    var out = el('p', 'gd-res-out', '—');
    var sels = el('div', 'gd-selects');
    function sel(label, opts, valKey) {
      var lab = el('label', null, label);
      var s = document.createElement('select');
      opts.forEach(function (o, i) {
        var op = document.createElement('option');
        op.value = String(i);
        op.textContent = o.n;
        s.appendChild(op);
      });
      lab.appendChild(s);
      sels.appendChild(lab);
      return s;
    }
    var s1 = sel('1st digit', RES_COLORS);
    var s2 = sel('2nd digit', RES_COLORS);
    s2.value = '2';
    var s3 = sel('Multiplier', RES_COLORS);
    s3.value = '2';
    var s4 = sel('Tolerance', RES_TOL);
    s4.value = '2';
    function fmt(n) {
      if (n >= 1e6) return (n / 1e6) + ' MΩ';
      if (n >= 1e3) return (n / 1e3) + ' kΩ';
      return n + ' Ω';
    }
    function paint() {
      var d1 = RES_COLORS[+s1.value];
      var d2 = RES_COLORS[+s2.value];
      var m = RES_COLORS[+s3.value];
      var t = RES_TOL[+s4.value];
      bands[0].style.background = d1.hex;
      bands[1].style.background = d2.hex;
      bands[2].style.background = m.hex;
      bands[3].style.background = t.hex;
      var ohms = (d1.v * 10 + d2.v) * m.m;
      out.textContent = fmt(ohms) + '  ·  ' + t.n;
    }
    [s1, s2, s3, s4].forEach(function (s) { s.addEventListener('change', paint); });
    paint();
    box.appendChild(body);
    box.appendChild(out);
    box.appendChild(sels);
    return box;
  }

  var JOB_SHEETS = {
    zones: {
      title: 'Zone list',
      sub: 'Fire / intrusion zones',
      icon: 'bell',
      lede: 'Fill on the phone, print for the can. Ghost text is examples — it does not print.',
      cols: [
        { key: 'n', label: '#' },
        { key: 'type', label: 'Type' },
        { key: 'loc', label: 'Location' },
        { key: 'device', label: 'Device' },
        { key: 'notes', label: 'Notes' }
      ],
      rows: 16,
      examples: [
        { type: 'Smoke', loc: 'Hall west', device: 'SD-123', notes: 'NAC 1' },
        { type: 'Heat', loc: 'Mech closet', device: 'HD-4', notes: 'Rate-of-rise' },
        { type: 'Pull', loc: 'Stair 2', device: 'NBG-12LX', notes: 'Dual-action' },
        { type: 'Motion', loc: 'Lobby', device: 'PIR-DT', notes: 'Pet immune' },
        { type: 'Door', loc: 'Overhead', device: '9514', notes: '24hr' },
        { type: 'Glass', loc: 'Storefront', device: 'FG-1625', notes: 'Break' },
        { type: 'Duct', loc: 'AHU-1', device: 'DH100LP', notes: 'Supply' },
        { type: 'Waterflow', loc: 'Riser A', device: 'VSR-F', notes: 'Fire' },
        { type: 'Tamper', loc: 'PIV', device: 'OS&Y', notes: 'Supervisory' },
        { type: 'Keyswitch', loc: 'IT closet', device: 'Shunt', notes: '24hr' }
      ]
    },
    doors: {
      title: 'Door programming',
      sub: 'Reader, lock, REX, contact',
      icon: 'door',
      lede: 'One row per opening. Ghost text is examples — it does not print.',
      cols: [
        { key: 'name', label: 'Door' },
        { key: 'reader', label: 'Reader' },
        { key: 'lock', label: 'Lock' },
        { key: 'rex', label: 'REX / contact' },
        { key: 'notes', label: 'Access / notes' }
      ],
      rows: 12,
      examples: [
        { name: 'Stair 2', reader: 'Signo 40 / OSDP 2', lock: 'HES 9600', rex: 'PIR · DSM', notes: 'Fail secure' },
        { name: 'Main lobby', reader: 'iCLASS SE / addr 3', lock: 'Mag M380', rex: 'Push to exit', notes: 'Unlock 7–6' },
        { name: 'Server room', reader: 'Pivot 45', lock: 'Strike 5000C', rex: 'No REX · 24hr', notes: 'Two-man rule' },
        { name: 'Loading dock', reader: 'MiniProx', lock: 'EL panic', rex: 'Crash bar · contact', notes: 'REX only out' },
        { name: 'HR suite', reader: 'Salto XS4', lock: 'Wireless mortise', rex: 'Privacy', notes: 'Office hours' },
        { name: 'Roof hatch', reader: 'Mullion', lock: 'Mag + BLS', rex: 'Delayed egress', notes: 'NFPA 101' },
        { name: 'Stair 1 discharge', reader: 'Wall reader', lock: 'Rim 98/99', rex: 'Bar · latch bolt', notes: 'Fail safe fire' },
        { name: 'Pharmacy', reader: 'Keypad + fob', lock: 'Storeroom', rex: 'REX PIR', notes: 'Audit trail' }
      ]
    },
    cameras: {
      title: 'Camera directory',
      sub: 'Name, channel, switch port',
      icon: 'cam',
      lede: 'Channel map for the NVR and the switch. Ghost text is examples — it does not print.',
      cols: [
        { key: 'n', label: '#' },
        { key: 'name', label: 'Name' },
        { key: 'ch', label: 'Ch / IP' },
        { key: 'loc', label: 'Location' },
        { key: 'sw', label: 'Switch · port' }
      ],
      rows: 16,
      examples: [
        { name: 'Lobby PTZ', ch: '12 / 10.20.4.41', loc: 'SE corner', sw: 'IDF-2 PoE 7' },
        { name: 'Parking N', ch: '4 / .18', loc: 'Pole 3', sw: 'IDF-1 PoE 11' },
        { name: 'Hall 2W', ch: '9 / ch9', loc: 'Facing stair', sw: 'Closet A · 3' },
        { name: 'Dock', ch: '15 / .55', loc: 'Overhead', sw: 'Cam SW PoE 2' },
        { name: 'Reception', ch: '1 / .10', loc: 'Over desk', sw: 'Core SW 24' },
        { name: 'Stair roof', ch: '22 / .72', loc: 'Looking down', sw: 'IDF-3 PoE 5' },
        { name: 'Cash office', ch: '8 / .33', loc: 'Inside door', sw: 'IDF-2 PoE 14' },
        { name: 'Rear alley', ch: '3 / .19', loc: 'NW wall', sw: 'IDF-1 PoE 8' }
      ]
    }
  };
  var PAPER_IDS = ['zones', 'doors', 'cameras'];
  function padSheetRows(kind, list) {
    var spec = JOB_SHEETS[kind];
    var rows = (list || []).map(function (r) { return r && typeof r === 'object' ? r : {}; });
    while (rows.length < spec.rows) {
      var row = {};
      spec.cols.forEach(function (c) { row[c.key] = ''; });
      if (Object.prototype.hasOwnProperty.call(row, 'n')) row.n = String(rows.length + 1);
      rows.push(row);
    }
    return rows;
  }
  function paperLinks(except) {
    var nav = el('div', 'gd-pack-tools no-print');
    PAPER_IDS.forEach(function (id) {
      if (id === except) return;
      var a = el('a', 'gd-chip fk-link', JOB_SHEETS[id].title);
      a.href = '/guides/' + id;
      nav.appendChild(a);
    });
    var pack = el('a', 'gd-chip fk-link', 'Share pack (QR)');
    pack.href = '/guides/pack';
    nav.appendChild(pack);
    return nav;
  }
  function renderJobSheet(kind) {
    var spec = JOB_SHEETS[kind];
    var forms = loadForms();
    var rows = padSheetRows(kind, forms[kind]);
    var pack = loadPack();
    var page = el('div', 'page gd-page gd-sheet-page');
    page.appendChild(backLink('/field', 'Field'));
    var origin = location.origin && location.origin !== 'null'
      ? location.origin
      : 'https://lawsonite.tomcatstudios.com';
    var qUrl = pack.ids.length ? packQrUrl(pack.ids, pack.title) : (origin + '/guides/' + kind);
    var jobName = pack.title && pack.title !== 'Job pack' ? pack.title : '';
    page.appendChild(printLetterhead(spec.title, {
      qrUrl: qUrl,
      qrCap: pack.ids.length ? 'Scan to open this pack' : 'Open sheet',
      jobName: jobName
    }));
    var head = el('header', 'gd-hero no-print');
    head.appendChild(el('p', 'gd-kicker', 'Leave-behind'));
    head.appendChild(el('h1', null, spec.title));
    head.appendChild(el('p', 'gd-lede', spec.lede));
    page.appendChild(head);

    var jobInput = document.createElement('input');
    jobInput.className = 'gd-search no-print';
    jobInput.value = jobName;
    jobInput.placeholder = 'Job name — prints on the sheet';
    jobInput.setAttribute('aria-label', 'Job name');
    jobInput.addEventListener('change', function () {
      var next = jobInput.value.trim() || 'Job pack';
      pack = loadPack();
      pack.title = next;
      savePack(pack);
      var jobEl = page.querySelector('.gd-letterhead-job');
      if (next === 'Job pack') {
        if (jobEl) jobEl.textContent = '';
      } else if (jobEl) {
        jobEl.textContent = next;
      } else {
        var host = page.querySelector('.gd-letterhead-text');
        if (host) host.appendChild(el('p', 'gd-letterhead-job', next));
      }
    });
    page.appendChild(jobInput);

    var tools = el('div', 'gd-pack-tools no-print');
    var printBtn = el('button', 'gd-chip is-on', 'Print sheet');
    printBtn.type = 'button';
    printBtn.addEventListener('click', function () {
      document.body.classList.remove('gd-sticker-print');
      window.print();
    });
    var addBtn = el('button', 'gd-chip', 'Add rows');
    addBtn.type = 'button';
    var clearBtn = el('button', 'gd-chip', 'Clear sheet');
    clearBtn.type = 'button';
    tools.appendChild(printBtn);
    tools.appendChild(addBtn);
    tools.appendChild(clearBtn);
    page.appendChild(tools);
    page.appendChild(paperLinks(kind));

    var wrap = el('div', 'gd-sheet-wrap');
    var table = el('table', 'gd-sheet');
    var thead = document.createElement('thead');
    var trh = document.createElement('tr');
    spec.cols.forEach(function (c) { trh.appendChild(el('th', null, c.label)); });
    thead.appendChild(trh);
    table.appendChild(thead);
    var tbody = document.createElement('tbody');
    table.appendChild(tbody);
    wrap.appendChild(table);
    page.appendChild(wrap);

    function persist() {
      var all = loadForms();
      all[kind] = rows;
      saveForms(all);
    }
    function paintRows() {
      tbody.textContent = '';
      rows.forEach(function (row, idx) {
        var tr = document.createElement('tr');
        spec.cols.forEach(function (c) {
          var td = document.createElement('td');
          var inp = document.createElement('input');
          inp.value = row[c.key] != null ? String(row[c.key]) : '';
          var ex = (spec.examples && spec.examples[idx % spec.examples.length]) || {};
          inp.placeholder = c.key === 'n' ? '' : (ex[c.key] || c.ph || '');
          inp.setAttribute('aria-label', c.label + ' ' + (idx + 1));
          inp.addEventListener('input', function () {
            rows[idx][c.key] = inp.value;
            persist();
          });
          td.appendChild(inp);
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }
    addBtn.addEventListener('click', function () {
      var i;
      for (i = 0; i < 8; i++) {
        var row = {};
        spec.cols.forEach(function (c) { row[c.key] = ''; });
        if (Object.prototype.hasOwnProperty.call(row, 'n')) row.n = String(rows.length + 1);
        rows.push(row);
      }
      persist();
      paintRows();
    });
    clearBtn.addEventListener('click', function () {
      rows = padSheetRows(kind, []);
      persist();
      paintRows();
    });
    paintRows();
    page.appendChild(el('p', 'gd-foot',
      'Field notes only — not as-built drawings or programming. Confirm the panel, the lock, and the official sheet.'));
    var sign = el('div', 'gd-pack-sign only-print');
    sign.appendChild(el('p', null, 'Installed by ________________    Date ______________    Tech ______________'));
    page.appendChild(sign);
    return page;
  }

  function hwTab() {
    try { return (new URLSearchParams(location.search)).get('tab') || 'picker'; }
    catch (e) { return 'picker'; }
  }
  function renderHardware() {
    var H = window.__LAWSONITE_HARDWARE__;
    var page = el('div', 'page gd-page gd-hw-page');
    page.appendChild(backLink('/field', 'Field'));
    var pack = loadPack();
    var origin = location.origin && location.origin !== 'null'
      ? location.origin
      : 'https://lawsonite.tomcatstudios.com';
    page.appendChild(printLetterhead('Cable hardware', {
      qrUrl: origin + '/guides/hardware',
      qrCap: 'Hardware picker',
      jobName: pack.title && pack.title !== 'Job pack' ? pack.title : ''
    }));
    var head = el('header', 'gd-hero no-print');
    head.appendChild(el('p', 'gd-kicker', 'Rough-in'));
    head.appendChild(el('h1', null, 'Cable hardware picker'));
    head.appendChild(el('p', 'gd-lede',
      'Path, substrate, flange, fill — then a field spec card with CADDY-class parts, the fastener, and the inspection warnings. Add counts to a pack list for ADI / Anixter.'));
    page.appendChild(head);

    var tab = hwTab();
    var tabs = el('div', 'gd-pack-tools no-print');
    [['picker', 'Cable'], ['mount', 'Boxes / pipe'], ['cheats', 'Cheat sheet'], ['bom', 'Pack list']].forEach(function (t) {
      var a = el('a', 'gd-chip fk-link' + (tab === t[0] ? ' is-on' : ''), t[1]);
      a.href = t[0] === 'picker' ? '/guides/hardware' : '/guides/hardware?tab=' + t[0];
      tabs.appendChild(a);
    });
    page.appendChild(tabs);

    if (!H || !H.resolve) {
      page.appendChild(el('p', 'gd-empty', 'Loading hardware dictionary…'));
      return page;
    }
    if (tab === 'cheats') {
      page.appendChild(renderHardwareCheats(H));
      return page;
    }
    if (tab === 'bom') {
      page.appendChild(renderBomList());
      return page;
    }
    if (tab === 'mount') {
      head.querySelector('h1').textContent = 'Device mounting picker';
      head.querySelector('.gd-lede').textContent =
        'Device, wall, raceway, box — then the FS / 4″ sq / liquid-tite / Tapcon spec. Same pack list as cable hardware.';
      page.appendChild(renderMountPicker(H));
      return page;
    }
    page.appendChild(renderHardwarePicker(H));
    return page;
  }
  function renderHardwareCheats(H) {
    var wrap = el('div', 'gd-sheet-wrap');
    var table = el('table', 'gd-sheet gd-cheat-table');
    var thead = document.createElement('thead');
    var trh = document.createElement('tr');
    ['Hardware type', 'Substrate / attachment', 'Best used for', 'Cable / load limits'].forEach(function (h) {
      trh.appendChild(el('th', null, h));
    });
    thead.appendChild(trh);
    table.appendChild(thead);
    var tb = document.createElement('tbody');
    (H.cheat || []).forEach(function (row) {
      var tr = document.createElement('tr');
      row.forEach(function (cell) { tr.appendChild(el('td', null, cell)); });
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    wrap.appendChild(table);
    var box = el('div');
    var printBtn = el('button', 'gd-chip is-on no-print', 'Print cheat sheet');
    printBtn.type = 'button';
    printBtn.addEventListener('click', function () { window.print(); });
    box.appendChild(printBtn);
    box.appendChild(wrap);
    if (H.mountCheat && H.mountCheat.length) {
      box.appendChild(el('h2', null, 'Boxes, pipe, liquid-tite'));
      var wrap2 = el('div', 'gd-sheet-wrap');
      var table2 = el('table', 'gd-sheet gd-cheat-table');
      var thead2 = document.createElement('thead');
      var trh2 = document.createElement('tr');
      ['Hardware type', 'Substrate / attachment', 'Best used for', 'Cable / load limits'].forEach(function (h) {
        trh2.appendChild(el('th', null, h));
      });
      thead2.appendChild(trh2);
      table2.appendChild(thead2);
      var tb2 = document.createElement('tbody');
      H.mountCheat.forEach(function (row) {
        var tr = document.createElement('tr');
        row.forEach(function (cell) { tr.appendChild(el('td', null, cell)); });
        tb2.appendChild(tr);
      });
      table2.appendChild(tb2);
      wrap2.appendChild(table2);
      box.appendChild(wrap2);
    }
    box.appendChild(el('p', 'gd-foot',
      'Trade equivalents. Confirm the nVent CADDY catalog, the box/raceway listing, and the AHJ. Educational only.'));
    return box;
  }
  function renderBomList() {
    var box = el('div', 'gd-bom');
    var bom = loadBom();
    var pack = loadPack();
    var jobInput = document.createElement('input');
    jobInput.className = 'gd-search no-print';
    jobInput.value = bom.job || (pack.title && pack.title !== 'Job pack' ? pack.title : '');
    jobInput.placeholder = 'Job name on the export';
    jobInput.addEventListener('change', function () {
      var b = loadBom();
      b.job = jobInput.value.trim();
      saveBom(b);
    });
    box.appendChild(jobInput);
    var list = el('div', 'gd-bom-list');
    function paint() {
      bom = loadBom();
      list.textContent = '';
      if (!bom.items.length) {
        list.appendChild(el('p', 'gd-empty', 'Nothing on the pack list yet. Run the picker and tap Add to pack list.'));
        return;
      }
      bom.items.forEach(function (it, idx) {
        var row = el('div', 'gd-bom-row');
        var qty = document.createElement('input');
        qty.type = 'number';
        qty.min = '1';
        qty.className = 'gd-bom-qty';
        qty.value = String(it.qty);
        qty.addEventListener('change', function () {
          var b = loadBom();
          b.items[idx].qty = Math.max(1, parseInt(qty.value, 10) || 1);
          saveBom(b);
        });
        row.appendChild(qty);
        var text = el('div', 'gd-bom-text');
        text.appendChild(el('strong', null, it.name));
        text.appendChild(el('span', null, (it.mpn ? it.mpn + ' · ' : '') + (it.desc || '')));
        row.appendChild(text);
        var rm = el('button', 'gd-chip', 'Remove');
        rm.type = 'button';
        rm.addEventListener('click', function () {
          var b = loadBom();
          b.items.splice(idx, 1);
          saveBom(b);
          paint();
        });
        row.appendChild(rm);
        list.appendChild(row);
      });
    }
    paint();
    box.appendChild(list);
    var tools = el('div', 'gd-pack-tools no-print');
    function currentText() {
      var b = loadBom();
      if (jobInput.value.trim()) {
        b.job = jobInput.value.trim();
        saveBom(b);
      }
      return bomText();
    }
    var copyBtn = el('button', 'gd-chip is-on', 'Copy list');
    copyBtn.type = 'button';
    copyBtn.addEventListener('click', function () {
      var t = currentText();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(function () { copyBtn.textContent = 'Copied'; });
      } else window.prompt('Copy pack list', t);
    });
    var dlBtn = el('button', 'gd-chip', 'Download .txt');
    dlBtn.type = 'button';
    dlBtn.addEventListener('click', function () {
      var t = currentText();
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([t], { type: 'text/plain' }));
      a.download = 'lawsonite-pack-list.txt';
      a.click();
    });
    var mailBtn = el('a', 'gd-chip fk-link', 'Email list');
    mailBtn.addEventListener('click', function (ev) {
      var t = currentText();
      mailBtn.href = 'mailto:?subject=' + encodeURIComponent('Hardware pack list') +
        '&body=' + encodeURIComponent(t);
      if (!t) ev.preventDefault();
    });
    var clearBtn = el('button', 'gd-chip', 'Clear list');
    clearBtn.type = 'button';
    clearBtn.addEventListener('click', function () {
      saveBom({ job: jobInput.value.trim(), items: [] });
      paint();
    });
    tools.appendChild(copyBtn);
    tools.appendChild(dlBtn);
    tools.appendChild(mailBtn);
    tools.appendChild(clearBtn);
    box.appendChild(tools);
    var pre = el('pre', 'gd-bom-preview only-print');
    pre.textContent = bomText();
    box.appendChild(pre);
    return box;
  }
  function renderHardwarePicker(H) {
    var wrap = el('div', 'gd-hw-picker');
    var sel = { cable: '', substrate: '', flange: '', size: '' };
    var host = el('div');
    wrap.appendChild(host);

    function chipRow(label, list, key, force) {
      var sub = findHw(H.substrates, sel.substrate);
      if (key === 'flange' && !(sub && sub.flange) && !force) return;
      var box = el('div', 'gd-hw-step no-print');
      box.appendChild(el('p', 'gd-kicker', label));
      var row = el('div', 'gd-chips');
      list.forEach(function (item) {
        var b = el('button', 'gd-chip' + (sel[key] === item.key ? ' is-on' : ''), item.label);
        b.type = 'button';
        b.addEventListener('click', function () {
          sel[key] = item.key;
          if (key === 'substrate' && !(item.flange)) sel.flange = '';
          paint();
        });
        row.appendChild(b);
      });
      box.appendChild(row);
      host.appendChild(box);
    }
    function findHw(list, key) {
      var i;
      for (i = 0; i < list.length; i++) if (list[i].key === key) return list[i];
      return null;
    }
    function addLine(spec, item, extra, qty) {
      if (!item) return;
      addBomItem({
        mpn: item.mpn || '',
        name: item.name || extra || '',
        desc: item.desc || extra || ''
      }, qty);
    }
    function paint() {
      host.textContent = '';
      chipRow('1 · Cable / pathway', H.cables, 'cable');
      chipRow('2 · Substrate / mounting surface', H.substrates, 'substrate');
      chipRow('3 · Flange / surface thickness', H.flanges, 'flange');
      chipRow('4 · Pathway size / fill', H.sizes, 'size');
      var spec = H.resolve(sel);
      if (!spec) {
        host.appendChild(el('p', 'gd-empty',
          sel.substrate && findHw(H.substrates, sel.substrate).flange && !sel.flange
            ? 'Pick the flange thickness — hammer-on clips are sized to the beam.'
            : 'Walk the four steps. The spec card fills in as you go.'));
        return;
      }
      var card = el('article', 'gd-spec');
      card.appendChild(el('p', 'gd-kicker', 'Field spec card'));
      var path = [spec.cable.label, spec.substrate.label];
      if (spec.flange) path.push(spec.flange.label);
      path.push(spec.size.label);
      card.appendChild(el('h2', null, path.join(' · ')));

      function block(title, item, extra) {
        var b = el('div', 'gd-spec-block');
        b.appendChild(el('h3', null, title));
        if (item && item.name) {
          b.appendChild(el('p', 'gd-spec-name', item.name));
          if (item.mpn) b.appendChild(el('p', 'gd-spec-mpn', item.mpn));
          if (item.desc) b.appendChild(el('p', null, item.desc));
        } else if (extra) {
          b.appendChild(el('p', null, extra));
        }
        card.appendChild(b);
      }
      block('Primary support hardware', spec.primary);
      block('Cable support (J-hook / tray)', spec.hook);
      var fast = el('div', 'gd-spec-block');
      fast.appendChild(el('h3', null, 'Required fastener'));
      fast.appendChild(el('p', null, spec.fastener));
      card.appendChild(fast);
      if (spec.alts && spec.alts.length) {
        var alt = el('div', 'gd-spec-block');
        alt.appendChild(el('h3', null, 'Acceptable substitutes'));
        spec.alts.forEach(function (a) {
          alt.appendChild(el('p', null, (a.mpn ? a.mpn + ' — ' : '') + a.name + (a.desc ? '. ' + a.desc : '')));
        });
        card.appendChild(alt);
      }
      var warn = el('div', 'gd-spec-warn');
      warn.appendChild(el('h3', null, 'Code & compliance'));
      var ul = el('ul', 'gd-steps');
      spec.warnings.forEach(function (w) { ul.appendChild(el('li', null, w)); });
      warn.appendChild(ul);
      card.appendChild(warn);

      var addRow = el('div', 'gd-spec-add no-print');
      var qty = document.createElement('input');
      qty.type = 'number';
      qty.min = '1';
      qty.value = '1';
      qty.className = 'gd-bom-qty';
      qty.setAttribute('aria-label', 'Quantity');
      var addBtn = el('button', 'gd-chip is-on', 'Add to pack list');
      addBtn.type = 'button';
      addBtn.addEventListener('click', function () {
        var n = qty.value;
        addLine(spec, spec.primary, '', n);
        if (spec.hook && (!spec.primary || spec.hook.mpn !== spec.primary.mpn)) {
          addLine(spec, spec.hook, '', n);
        }
        addBomItem({ mpn: 'FASTENER', name: spec.fastener, desc: path.join(' · ') }, n);
        addBtn.textContent = 'Added';
        setTimeout(function () { addBtn.textContent = 'Add to pack list'; }, 1200);
      });
      addRow.appendChild(el('span', null, 'Qty'));
      addRow.appendChild(qty);
      addRow.appendChild(addBtn);
      var printBtn = el('button', 'gd-chip', 'Print card');
      printBtn.type = 'button';
      printBtn.addEventListener('click', function () { window.print(); });
      addRow.appendChild(printBtn);
      var toBom = el('a', 'gd-chip fk-link', 'Open pack list');
      toBom.href = '/guides/hardware?tab=bom';
      addRow.appendChild(toBom);
      card.appendChild(addRow);
      host.appendChild(card);
    }
    paint();
    return wrap;
  }
  function renderMountPicker(H) {
    var wrap = el('div', 'gd-hw-picker');
    var sel = { device: '', wall: '', raceway: '', box: '' };
    var host = el('div');
    wrap.appendChild(host);
    function findHw(list, key) {
      var i;
      for (i = 0; i < list.length; i++) if (list[i].key === key) return list[i];
      return null;
    }
    function chipRow(label, list, key) {
      var box = el('div', 'gd-hw-step no-print');
      box.appendChild(el('p', 'gd-kicker', label));
      var row = el('div', 'gd-chips');
      list.forEach(function (item) {
        var b = el('button', 'gd-chip' + (sel[key] === item.key ? ' is-on' : ''), item.label);
        b.type = 'button';
        b.addEventListener('click', function () {
          sel[key] = item.key;
          paint();
        });
        row.appendChild(b);
      });
      box.appendChild(row);
      host.appendChild(box);
    }
    function paint() {
      host.textContent = '';
      chipRow('1 · What are you mounting?', H.devices, 'device');
      chipRow('2 · Wall / structure', H.walls, 'wall');
      chipRow('3 · Raceway / environment', H.raceways, 'raceway');
      chipRow('4 · Box / mount style', H.boxes, 'box');
      var spec = H.resolveMount && H.resolveMount(sel);
      if (!spec) {
        host.appendChild(el('p', 'gd-empty', 'Walk the four steps. Box, pipe, and fasteners fill in as you go.'));
        return;
      }
      var card = el('article', 'gd-spec');
      card.appendChild(el('p', 'gd-kicker', 'Field spec card'));
      var path = [spec.device.label, spec.wall.label, spec.raceway.label, spec.box.label];
      card.appendChild(el('h2', null, path.join(' · ')));
      function block(title, item, extra) {
        var b = el('div', 'gd-spec-block');
        b.appendChild(el('h3', null, title));
        if (item && item.name) {
          b.appendChild(el('p', 'gd-spec-name', item.name));
          if (item.mpn) b.appendChild(el('p', 'gd-spec-mpn', item.mpn));
          if (item.desc) b.appendChild(el('p', null, item.desc));
        } else if (extra) {
          b.appendChild(el('p', null, extra));
        }
        card.appendChild(b);
      }
      block('Box / mount', spec.primary);
      block('Raceway / fittings', spec.hook);
      var fast = el('div', 'gd-spec-block');
      fast.appendChild(el('h3', null, 'Required fastener'));
      fast.appendChild(el('p', null, spec.fastener));
      card.appendChild(fast);
      if (spec.alts && spec.alts.length) {
        var alt = el('div', 'gd-spec-block');
        alt.appendChild(el('h3', null, 'Acceptable substitutes'));
        spec.alts.forEach(function (a) {
          alt.appendChild(el('p', null, (a.mpn ? a.mpn + ' — ' : '') + a.name + (a.desc ? '. ' + a.desc : '')));
        });
        card.appendChild(alt);
      }
      var warn = el('div', 'gd-spec-warn');
      warn.appendChild(el('h3', null, 'Code & compliance'));
      var ul = el('ul', 'gd-steps');
      spec.warnings.forEach(function (w) { ul.appendChild(el('li', null, w)); });
      warn.appendChild(ul);
      card.appendChild(warn);
      var addRow = el('div', 'gd-spec-add no-print');
      var qty = document.createElement('input');
      qty.type = 'number';
      qty.min = '1';
      qty.value = '1';
      qty.className = 'gd-bom-qty';
      qty.setAttribute('aria-label', 'Quantity');
      var addBtn = el('button', 'gd-chip is-on', 'Add to pack list');
      addBtn.type = 'button';
      addBtn.addEventListener('click', function () {
        var n = qty.value;
        if (spec.primary) addBomItem({ mpn: spec.primary.mpn, name: spec.primary.name, desc: spec.primary.desc }, n);
        if (spec.hook && spec.hook.mpn && spec.hook.mpn !== 'NONE' && spec.hook.mpn !== (spec.primary && spec.primary.mpn)) {
          addBomItem({ mpn: spec.hook.mpn, name: spec.hook.name, desc: spec.hook.desc }, n);
        }
        if (spec.fastenerPart) addBomItem({ mpn: spec.fastenerPart.mpn, name: spec.fastenerPart.name, desc: spec.fastener }, n);
        else addBomItem({ mpn: 'FASTENER', name: spec.fastener, desc: path.join(' · ') }, n);
        addBtn.textContent = 'Added';
        setTimeout(function () { addBtn.textContent = 'Add to pack list'; }, 1200);
      });
      addRow.appendChild(el('span', null, 'Qty'));
      addRow.appendChild(qty);
      addRow.appendChild(addBtn);
      var printBtn = el('button', 'gd-chip', 'Print card');
      printBtn.type = 'button';
      printBtn.addEventListener('click', function () { window.print(); });
      addRow.appendChild(printBtn);
      var toBom = el('a', 'gd-chip fk-link', 'Open pack list');
      toBom.href = '/guides/hardware?tab=bom';
      addRow.appendChild(toBom);
      card.appendChild(addRow);
      host.appendChild(card);
    }
    paint();
    return wrap;
  }

  function renderPack() {
    var sp;
    try { sp = new URLSearchParams(location.search); } catch (e) { sp = new URLSearchParams(); }
    var rawIds = (sp.get('i') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var title = sp.get('t') || '';
    var local = loadPack();
    if (!rawIds.length) rawIds = local.ids.slice();
    if (!title) title = local.title || 'Job pack';
    var knownIds = [];
    var missingIds = [];
    rawIds.forEach(function (id) {
      if (productByShort(id)) knownIds.push(id);
      else missingIds.push(id);
    });
    var ids = knownIds.slice();
    var packOk = ids.length > 0;
    if (ids.length && !(sp.get('i'))) {
      try { history.replaceState({}, '', packHref(ids, title)); } catch (e) {}
    }

    var page = el('div', 'page gd-page gd-pack');
    page.appendChild(backLink('/guides/manuals', 'Product cards'));
    var url = packOk ? packQrUrl(ids, title) : '';
    if (packOk) {
      page.appendChild(printLetterhead(title, {
        qrUrl: url,
        qrCap: 'Scan to open this pack',
        qrPrintOnly: true
      }));
    } else {
      page.appendChild(printLetterhead(title, {}));
    }

    var head = el('header', 'gd-hero');
    head.appendChild(el('p', 'gd-kicker', packOk ? 'Job pack' : 'Pack not found'));
    var titleInput = document.createElement('input');
    titleInput.className = 'gd-search gd-pack-title no-print';
    titleInput.value = title;
    titleInput.setAttribute('aria-label', 'Job pack name');
    titleInput.placeholder = 'Job name — Building A, 3rd floor…';
    head.appendChild(titleInput);
    head.appendChild(el('h1', 'only-print', title));
    head.appendChild(el('p', 'gd-lede no-print',
      packOk
        ? 'Pin cards on the manuals page, name the job, print the pack or a QR for the panel. Free prints get the Lawsonite mark. Pro adds your company logo.'
        : 'This link has no matching product cards. Open Product cards, pin what you need, then share a fresh pack link.'));
    page.appendChild(head);

    var tools = el('div', 'gd-pack-tools no-print');
    var printBtn = el('button', 'gd-chip is-on', 'Print pack');
    printBtn.type = 'button';
    printBtn.disabled = !packOk;
    printBtn.addEventListener('click', function () {
      if (!packOk) return;
      document.body.classList.remove('gd-sticker-print');
      window.print();
    });
    var stickerBtn = el('button', 'gd-chip', 'Print QR for this job pack');
    stickerBtn.type = 'button';
    stickerBtn.disabled = !packOk;
    stickerBtn.addEventListener('click', function () {
      if (!packOk) return;
      document.body.classList.add('gd-sticker-print');
      window.print();
    });
    window.addEventListener('afterprint', function () {
      document.body.classList.remove('gd-sticker-print');
    });
    var copyBtn = el('button', 'gd-chip', 'Copy link');
    copyBtn.type = 'button';
    copyBtn.disabled = !packOk;
    copyBtn.addEventListener('click', function () {
      if (!packOk) return;
      var u = packAbs(ids, titleInput.value || title);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(u).then(function () { copyBtn.textContent = 'Copied'; });
      } else {
        window.prompt('Copy pack link', u);
      }
    });
    tools.appendChild(printBtn);
    tools.appendChild(stickerBtn);
    tools.appendChild(copyBtn);
    PAPER_IDS.forEach(function (id) {
      var a = el('a', 'gd-chip fk-link', JOB_SHEETS[id].title);
      a.href = '/guides/' + id;
      tools.appendChild(a);
    });
    if (ids.length) {
      var clear = el('button', 'gd-chip', 'Clear pins');
      clear.type = 'button';
      clear.addEventListener('click', function () {
        savePack({ title: titleInput.value || 'Job pack', ids: [] });
        location.assign('/guides/manuals');
      });
      tools.appendChild(clear);
    }
    page.appendChild(tools);

    var ident = el('div', 'gd-pack-ident');
    if (packOk) {
      ident.appendChild(qrBox(url));
      var identText = el('div', 'gd-pack-ident-text');
      identText.appendChild(el('p', 'gd-pack-url', url));
      identText.appendChild(el('p', 'muted', 'Tape the QR on the can. Anyone who scans it gets this pack.'));
      ident.appendChild(identText);
    } else {
      ident.classList.add('gd-pack-ident-empty');
      ident.appendChild(el('p', 'gd-empty', missingIds.length
        ? ('Pack not found — no matching cards for: ' + missingIds.join(', ') + '.')
        : 'No cards in this pack.'));
      var go = el('a', 'gd-chip fk-link', 'Open Product cards');
      go.href = '/guides/manuals';
      ident.appendChild(go);
    }
    page.appendChild(ident);

    if (packOk) {
      titleInput.addEventListener('change', function () {
        var next = titleInput.value.trim() || 'Job pack';
        var pack = loadPack();
        pack.title = next;
        if (!pack.ids.length) pack.ids = ids.slice();
        savePack(pack);
        title = next;
        try { history.replaceState({}, '', packHref(ids, next)); } catch (e) {}
        var abs = packAbs(ids, next);
        var nextUrl = packQrUrl(ids, next);
        page.querySelectorAll('.gd-qr').forEach(function (qr) {
          var headQr = qr.classList.contains('gd-qr-head');
          var fresh = qrBox(nextUrl, 'Scan to open this pack', headQr ? 200 : 280);
          if (headQr) {
            fresh.classList.add('gd-qr-head');
            if (qr.classList.contains('only-print')) fresh.classList.add('only-print');
          }
          qr.replaceWith(fresh);
        });
        var urlEl = ident.querySelector('.gd-pack-url');
        if (urlEl) urlEl.textContent = abs;
        var docEl = page.querySelector('.gd-letterhead-doc');
        if (docEl) docEl.textContent = next;
        var h1 = page.querySelector('.gd-hero h1');
        if (h1) h1.textContent = next;
      });
    }

    var list = el('div', 'gd-product-list gd-pack-cards');
    if (!rawIds.length) {
      list.appendChild(el('p', 'gd-empty', 'No cards pinned yet. Open Product cards and tap the star.'));
    } else if (!packOk) {
      list.appendChild(el('p', 'gd-empty', 'No cards — this pack link does not match any product cards. Do not tape a QR from an empty pack.'));
    } else {
      if (missingIds.length) {
        list.appendChild(el('p', 'gd-empty', 'Skipped unknown pins: ' + missingIds.join(', ') + '.'));
      }
      ids.forEach(function (id) {
        var p = productByShort(id);
        if (!p) return;
        list.appendChild(productCard(p, {
          open: true,
          onPin: function () { location.assign(packHref(loadPack().ids, titleInput.value || title)); }
        }));
      });
    }
    page.appendChild(list);
    page.appendChild(el('p', 'gd-foot',
      'Educational job aide only — not code, manufacturer instructions, or AHJ approval. Confirm the device label, the panel programming, and the official sheet.'));
    var sign = el('div', 'gd-pack-sign only-print');
    sign.appendChild(el('p', null, 'Installed by ________________    Date ______________    Tech ______________'));
    page.appendChild(sign);
    return page;
  }

  function renderGuide(id) {
    var p = pageOf(id);
    if (!p) {
      var miss = el('div', 'page gd-page');
      miss.appendChild(backLink('/field', 'Field'));
      miss.appendChild(el('h1', null, 'Guide not found'));
      return miss;
    }
    var page = el('div', 'page gd-page');
    page.appendChild(backLink('/field', 'Field'));
    var lh = printLetterhead(p.title);
    lh.classList.add('only-print');
    page.appendChild(lh);
    var head = el('header', 'gd-hero');
    head.appendChild(el('p', 'gd-kicker', p.eyebrow || 'Field'));
    head.appendChild(el('h1', null, p.title));
    if (p.lede) head.appendChild(el('p', 'gd-lede', p.lede));
    page.appendChild(head);
    (p.sections || []).forEach(function (sec) {
      page.appendChild(renderSection(sec));
    });
    var rel = related(p.related);
    if (rel) page.appendChild(rel);
    var disc = el('p', 'gd-foot',
      'Educational job aide only — not code, manufacturer instructions, or AHJ approval. Confirm the device label, the panel programming, and the official sheet before you cut, land, or walk away.');
    page.appendChild(disc);
    return page;
  }

  function route() {
    var path = pathOf();
    if (!isGuidesPath(path)) {
      document.body.classList.remove('fk-guides');
      if (root) root.style.display = 'none';
      return;
    }
    if (!G || !G.pages) return;
    document.body.classList.add('fk-guides');
    if (!root) {
      root = el('div', 'gd-root');
      document.body.appendChild(root);
    }
    root.style.display = '';
    if (path === '/field' || path === '/guides') mount(renderHub());
    else {
      var id = path.split('/').pop();
      if (id === 'pack') mount(renderPack());
      else if (id === 'hardware') mount(renderHardware());
      else if (JOB_SHEETS[id]) mount(renderJobSheet(id));
      else mount(renderGuide(id));
    }
  }

  window.addEventListener('popstate', route);

  ['pushState', 'replaceState'].forEach(function (m) {
    var orig = history[m];
    if (typeof orig !== 'function') return;
    history[m] = function () {
      var r = orig.apply(this, arguments);
      setTimeout(route, 0);
      return r;
    };
  });

  /* React NavLinks (Home / Calcs / Shop) use pushState without popstate.
     Capture-phase so we leave the Field overlay with a real navigation. */
  document.addEventListener('click', function (ev) {
    if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    if (!isGuidesPath()) return;
    var a = ev.target && ev.target.closest && ev.target.closest('a');
    if (!a || a.target === '_blank') return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) !== '/') return;
    var dest = href.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
    if (isGuidesPath(dest)) return;
    ev.preventDefault();
    ev.stopPropagation();
    location.assign(href);
  }, true);

  function boot() {
    if (!document.body) { setTimeout(boot, 30); return; }
    function start() {
      G = window.__LAWSONITE_GUIDES__ || G;
      if (!G) { setTimeout(start, 40); return; }
      route();
    }
    if (!window.LAWSONITE_QR) {
      var qs = document.createElement('script');
      qs.src = '/qrcode.js';
      qs.onload = function () {
        var id = pathOf().split('/').pop();
        if (id === 'pack' || JOB_SHEETS[id] || id === 'hardware') route();
      };
      document.head.appendChild(qs);
    }
    if (!window.__LAWSONITE_HARDWARE__) {
      var hs = document.createElement('script');
      hs.src = '/hardware-data.js';
      hs.onload = function () {
        if (pathOf().split('/').pop() === 'hardware') route();
      };
      document.head.appendChild(hs);
    }
    start();
  }
  boot();

  window.__LAWSONITE_GUIDES_API__ = {
    searchRows: function () {
      G = window.__LAWSONITE_GUIDES__ || G;
      if (!G || !G.pages) return [];
      var rows = Object.keys(G.pages).map(function (id) {
        var p = G.pages[id];
        return {
          kind: p.kind === 'ts' ? 'call' : (p.kind === 'manual' ? 'doc' : 'guide'),
          title: p.title,
          sub: p.hub || p.lede || '',
          href: '/guides/' + id,
          hay: (p.title + ' ' + (p.lede || '') + ' ' + (p.hub || '') + ' ' + (p.tags || []).join(' ') + ' ' + (p.eyebrow || '')).toLowerCase()
        };
      });
      var pack = loadPack();
      if (pack.ids.length) {
        rows.unshift({
          kind: 'doc',
          title: pack.title || 'Job pack',
          sub: pack.ids.length + ' pinned cards · QR',
          href: packHref(pack.ids, pack.title),
          hay: ('job pack pinned cards qr panel sticker this job ' + (pack.title || '')).toLowerCase()
        });
      }
      PAPER_IDS.forEach(function (id) {
        var spec = JOB_SHEETS[id];
        rows.unshift({
          kind: 'doc',
          title: spec.title,
          sub: spec.sub,
          href: '/guides/' + id,
          hay: (spec.title + ' ' + spec.sub + ' ' + spec.lede + ' printable leave-behind job paper').toLowerCase()
        });
      });
      rows.unshift({
        kind: 'guide',
        title: 'Cable hardware picker',
        sub: 'J-hooks, CADDY clips, fasteners, pack list',
        href: '/guides/hardware',
        hay: 'cable hardware picker caddy j-hook beam clamp batwing bridle ring sammys tapcon cat6a fiber fplp pack list bom anixter adi'
      });
      rows.unshift({
        kind: 'guide',
        title: 'Device mounting picker',
        sub: 'Boxes, EMT, liquid-tite, FS, Tapcons',
        href: '/guides/hardware?tab=mount',
        hay: 'device mounting box 4 square fs fd liquid-tite lfmc emt pvc pendant pole camera reader strobe tapcon'
      });
      rows.unshift({
        kind: 'guide',
        title: 'Hardware cheat sheet',
        sub: 'Support types vs substrate vs load',
        href: '/guides/hardware?tab=cheats',
        hay: 'hardware cheat sheet flange clip j-hook t-grid drop wire bridle ring'
      });
      rows.unshift({
        kind: 'doc',
        title: 'Hardware pack list',
        sub: 'BOM export for ADI / Anixter',
        href: '/guides/hardware?tab=bom',
        hay: 'bom pack list bill of materials adi anixter order hardware'
      });
      allProducts().forEach(function (pr) {
        var q = encodeURIComponent((pr.title || '').split('/')[0].trim());
        rows.push({
          kind: 'doc',
          title: pr.title,
          sub: pr.brand || 'Official docs',
          href: '/guides/manuals?q=' + q,
          hay: productHay(pr).toLowerCase()
        });
      });
      return rows;
    }
  };
  window.__LAWSONITE_JOBS__ = {
    state: loadJobsState,
    current: currentJob,
    switchTo: switchJob,
    create: createJob,
    remove: deleteJob
  };
})();
