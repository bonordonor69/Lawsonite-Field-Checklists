/* Lawsonite field kit — pocket-brain UX on top of the core app.
   Offline, localStorage only. Replaces the leftover favorites/pro overlay. */
(function () {
  'use strict';

  var FAV_KEY = 'lawsonite-favorites-v1';
  var RECENT_KEY = 'lawsonite-recents-v1';
  var SEEN_KEY = 'lawsonite-fk-seen-v1';
  var PROGRESS_KEY = 'lawsonite-checklist-progress-v0';
  var MAX_RECENTS = 8;
  var MAX_FAVS = 24;

  var CALCS = [
    { id: 'ohm', label: 'Ohm’s law', hint: 'V = I × R', href: '/refs#ohm' },
    { id: 'vd', label: 'Voltage drop', hint: '12 / 24 V run', href: '/refs#vd' },
    { id: 'wire', label: 'Wire size', hint: 'AWG from load', href: '/refs#wire' },
    { id: 'fill', label: 'Conduit fill', hint: 'How many cables', href: '/refs#fill' },
    { id: 'poe', label: 'PoE budget', hint: 'Switch headroom', href: '/refs#poe' },
    { id: 'battery', label: 'Battery AH', hint: 'Standby time', href: '/refs#battery' },
    { id: 'eol', label: 'EOL helper', hint: 'Supervision', href: '/refs#eol' },
    { id: 'nac', label: 'NAC load', hint: 'Strobe current', href: '/refs#nac' },
    { id: 'lock', label: 'Lock power', hint: 'Hold vs inrush', href: '/refs#lock' },
    { id: 'rs485', label: 'RS-485', hint: 'Bus length', href: '/refs#rs485' },
    { id: 'watts', label: 'Watts / VA', hint: 'V × I × PF', href: '/refs#watts' },
    { id: 'poeday', label: 'Day / night PoE', hint: 'IR budget', href: '/refs#poeday' },
    { id: 'retain', label: 'NVR retention', hint: 'Cameras × bitrate × days', href: '/refs#retain' },
    { id: 'loopft', label: 'Wire feet', hint: 'Ohms on a pair', href: '/refs#loopft' },
    { id: 'gfvolt', label: 'Ground fault', hint: 'About half to ground', href: '/refs#gfvolt' }
  ];

  var CALLS = [
    { href: '/checklist/poe-night-ir-reboot-isolation', title: 'Camera dies at night', sub: 'PoE, IR, under-load reboot', icon: 'cam' },
    { href: '/checklist/strobe-ts', title: 'Strobe dead / no sync', sub: 'NAC / notification appliances', icon: 'strobe' },
    { href: '/guides/reader-dead', title: 'Reader dead / no beep', sub: 'Power, Wiegand, OSDP', icon: 'access' }
  ];

  var ICONS = {
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5"/><path d="M9 17a3 3 0 0 0 6 0"/></svg>',
    cam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="7" width="13" height="10" rx="2"/><path d="M16 10l5-2v8l-5-2"/></svg>',
    strobe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18h6M10 18v3h4v-3"/><path d="M7 10a5 5 0 0 1 10 0v8H7v-8z"/><path d="M12 2v2M5 5l1.5 1.5M19 5l-1.5 1.5"/></svg>',
    door: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="6" y="3" width="12" height="18" rx="1"/><path d="M15 12h.01"/></svg>',
    zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 11.5L12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5z"/></svg>',
    calc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0"/></svg>',
    calls: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>',
    jobs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><rect x="4" y="7" width="16" height="13" rx="2"/></svg>',
    shop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10l2-6h12l2 6"/><path d="M4 10h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9z"/><path d="M9 14h6"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    cameras: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="13" height="10" rx="2"/><path d="M16 10l5-2v8l-5-2"/></svg>',
    access: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    fire: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3s5 5 5 9a5 5 0 1 1-10 0c0-2 2-4 3-6 0 2 2 2 2 4"/></svg>',
    network: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 8h8v8H8z"/><path d="M12 3v5M12 16v5M3 12h5M16 12h5"/></svg>',
    troubleshoot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14.7 6.3a4.5 4.5 0 0 0-6.7 5.8L4 16.1 7.9 20l4-4a4.5 4.5 0 0 0 5.8-6.7l-3-3z"/><path d="M13.5 6.5l4 4"/></svg>'
  };

  function icon(name) { return ICONS[name] || ICONS.zap; }

  function readJSON(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v == null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
  }
  function writeJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  var state = {
    favs: readJSON(FAV_KEY, []),
    recents: readJSON(RECENT_KEY, [])
  };

  function persist() {
    writeJSON(FAV_KEY, state.favs);
    writeJSON(RECENT_KEY, state.recents);
  }

  function allChecklists() {
    var L = window.__LAWSONITE__;
    if (L && L.checklists) return L.checklists;
    return [];
  }
  function checklist(id) {
    var L = allChecklists();
    for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i];
    return null;
  }
  var CAT_LABEL = {
    cameras: 'Cameras',
    access: 'Access',
    fire: 'Fire',
    network: 'Network',
    troubleshoot: 'Troubleshoot'
  };
  function catLabel(c) {
    if (!c) return '';
    return CAT_LABEL[c.category] || (c.category || '').replace(/^./, function (ch) { return ch.toUpperCase(); });
  }
  function titleFor(id, fallback) {
    var c = checklist(id);
    return (c && c.title) || fallback || id;
  }
  function favIndex(id) {
    for (var i = 0; i < state.favs.length; i++) if (state.favs[i].id === id) return i;
    return -1;
  }
  function toggleFav(id) {
    var i = favIndex(id);
    if (i >= 0) state.favs.splice(i, 1);
    else {
      state.favs.unshift({ id: id, title: titleFor(id), ts: Date.now() });
      if (state.favs.length > MAX_FAVS) state.favs.length = MAX_FAVS;
    }
    persist();
    syncStars();
    renderDash(true);
    enhanceChecklist();
  }
  function recordVisit(id, extra) {
    if (!id) return;
    extra = extra || {};
    var href = extra.href || '/checklist/' + id;
    var title = extra.title || titleFor(id);
    state.recents = state.recents.filter(function (r) { return r.id !== id && r.href !== href; });
    state.recents.unshift({ id: id, title: title, href: href, ts: Date.now() });
    state.recents = state.recents.slice(0, MAX_RECENTS);
    persist();
  }

  function maybeRecordVisit() {
    var p = pathOf();
    var key = p + location.search;
    if (key === maybeRecordVisit._last) return;
    maybeRecordVisit._last = key;
    if (p.indexOf('/checklist/') === 0) {
      var cid = p.split('/')[2];
      if (cid) recordVisit(cid, { href: p, title: titleFor(cid) });
      return;
    }
    if (p.indexOf('/guides/') !== 0) return;
    var gid = p.split('/')[2];
    if (!gid) return;
    if (gid === 'hardware') {
      recordVisit('hardware', { href: p + location.search, title: 'Cable hardware picker' });
      return;
    }
    if (gid === 'zones' || gid === 'doors' || gid === 'cameras') {
      var sheetTitle = { zones: 'Zone list', doors: 'Door programming', cameras: 'Camera directory' }[gid];
      recordVisit('sheet:' + gid, { href: p, title: sheetTitle });
      return;
    }
    if (gid === 'pack') {
      var ptitle = 'Job pack';
      try {
        var psp = new URLSearchParams(location.search);
        ptitle = psp.get('t') || ptitle;
      } catch (e) {}
      recordVisit('pack', { href: p + location.search, title: ptitle });
      return;
    }
    if (gid === 'trade') {
      var tk = '';
      try { tk = new URLSearchParams(location.search).get('t') || ''; } catch (e) {}
      recordVisit('trade:' + tk, { href: p + location.search, title: (tk.charAt(0).toUpperCase() + tk.slice(1)) + ' guides & checklists' });
      return;
    }
    if (gid === 'manuals') {
      var trade = '';
      var q = '';
      var card = '';
      try {
        var sp = new URLSearchParams(location.search);
        trade = sp.get('trade') || '';
        q = sp.get('q') || '';
        card = sp.get('card') || '';
      } catch (e) {}
      var title = 'Product cards';
      if (card) {
        var cp = productByShortFk(card);
        recordVisit('manuals:card:' + card, { href: p + location.search, title: cp ? cp.title : 'Product card' });
        return;
      }
      if (q) title = q;
      else if (trade) title = trade.charAt(0).toUpperCase() + trade.slice(1) + ' products';
      recordVisit('manuals:' + (q || trade || 'all'), { href: p + location.search, title: title });
      return;
    }
    var g = window.__LAWSONITE_GUIDES__ && window.__LAWSONITE_GUIDES__.pages && window.__LAWSONITE_GUIDES__.pages[gid];
    recordVisit('guide:' + gid, { href: p, title: (g && g.title) || gid });
  }

  function pathOf() {
    return location.pathname.replace(/\/+$/, '') || '/';
  }
  /* same id as guides.js shortId() so a product row can deep-link one card */
  function productByShortFk(id) {
    var G = window.__LAWSONITE_GUIDES__;
    var list = (G && G.products) || [];
    if (!list.length && G && G.pages && G.pages.manuals) {
      (G.pages.manuals.sections || []).forEach(function (s) { if (s.type === 'products') list = s.items || []; });
    }
    for (var i = 0; i < list.length; i++) {
      var s = String((list[i].brand || '') + ' ' + (list[i].title || '')).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48);
      var h = 5381;
      for (var k = 0; k < s.length; k++) h = ((h << 5) + h + s.charCodeAt(k)) >>> 0;
      if (h.toString(36) === id) return list[i];
    }
    return null;
  }
  function isLanding() {
    var p = pathOf();
    return p === '/' || p === '';
  }
  function isLibrary() {
    return pathOf() === '/library';
  }
  function isHome() {
    return isLibrary();
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

  function go(href, ev) {
    if (ev) { ev.preventDefault(); ev.stopPropagation(); }
    closePalette();
    if (!href) return;
    if (href.charAt(0) !== '/') {
      location.href = href;
      return;
    }
    var parts = href.split('#');
    var path = parts[0] || pathOf();
    var hash = parts[1];
    if (path === pathOf() && hash != null) {
      location.hash = hash;
      var target = document.getElementById(hash);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    function shellOf(p) {
      p = String(p || '').split('?')[0].replace(/\/+$/, '') || '/';
      if (p.indexOf('/jobsheets') === 0) return 'jobs';
      if (p === '/field' || p.indexOf('/guides') === 0) return 'field';
      return 'app';
    }
    var dest = (path.split('?')[0] || '/').replace(/\/+$/, '') || '/';
    if (shellOf(pathOf()) !== shellOf(dest)) {
      location.assign(href);
      return;
    }
    history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo(0, 0);
    setTimeout(function () {
      enhance();
      var want = (href.split('#')[0] || '/').replace(/\/+$/, '') || '/';
      var pageOk = true;
      if (want.indexOf('/checklist/') === 0 && !document.querySelector('.checklist-runner')) pageOk = false;
      if (want === '/refs' && !document.querySelector('.refs-page')) pageOk = false;
      if (want === '/' && !document.querySelector('.start-page')) pageOk = false;
      if (want === '/library' && !document.querySelector('.home-page')) pageOk = false;
      if (want.indexOf('/category/') === 0 && !document.querySelector('.page-header')) pageOk = false;
      if (want === '/field' || want.indexOf('/guides') === 0) {
        var g = document.querySelector('.gd-root');
        pageOk = !!(g && g.style.display !== 'none' && g.childNodes.length);
      }
      if (!pageOk) location.assign(href);
    }, 80);
  }

  /* ---------------- progress / continue ---------------- */
  function inProgress() {
    var L = window.__LAWSONITE__;
    if (!L) return [];
    var raw;
    try { raw = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); }
    catch (e) { return []; }
    var out = [];
    Object.keys(raw).forEach(function (id) {
      var rec = raw[id];
      var cl = checklist(id);
      if (!cl || !rec || !rec.statuses) return;
      var ids = [];
      (cl.sections || []).forEach(function (s) {
        (s.items || []).forEach(function (it) { ids.push(it.id); });
      });
      var p = L.computeProgress(rec.statuses, ids);
      if (p && p.done > 0 && p.pct < 100) {
        out.push({ cl: cl, p: p, updatedAt: rec.updatedAt || '' });
      }
    });
    out.sort(function (a, b) { return (b.updatedAt || '').localeCompare(a.updatedAt || ''); });
    return out.slice(0, 4);
  }

  function fmtWhen(ts) {
    var d = new Date(ts);
    var today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  /* ---------------- dashboard ---------------- */
  function renderDash(force) {
    if (!isHome()) return;
    var page = document.querySelector('.home-page');
    if (!page) return;
    var hero = page.querySelector('.hero-panel');
    var host = document.getElementById('fav-root');
    if (!host && hero && hero.parentNode) {
      host = el('div', 'fav-root no-print');
      host.id = 'fav-root';
      hero.after(host);
    }
    if (!host) return;
    if (hero && hero.nextSibling !== host) hero.after(host);
    var qel = document.getElementById('library-search');
    var query = (qel && qel.value ? qel.value : '').trim();
    if (query) {
      if (!force && host.dataset.q === query && host.querySelector('.fk-hits')) return;
      host.dataset.q = query;
      host.textContent = '';
      renderHomeHits(host, query);
      return;
    }
    if (!force && host.querySelector('.fk-dash') && !host.querySelector('.fk-hits')) return;
    host.dataset.q = '';
    host.textContent = '';
    var dash = el('div', 'fk-dash');

    var progress = inProgress();
    if (progress.length) {
      dash.appendChild(block('Continue', progress.length + ' open'));
      var ul = el('ul', 'fk-list');
      progress.forEach(function (row) {
        var li = el('li');
        var a = el('a', 'fk-link', row.cl.title);
        a.href = '/checklist/' + row.cl.id;
        li.appendChild(a);
        var bar = el('span', 'fk-progress');
        var i = el('i');
        i.style.width = row.p.pct + '%';
        bar.appendChild(i);
        li.appendChild(bar);
        ul.appendChild(li);
      });
      dash.appendChild(ul);
    }

    dash.appendChild(block('Guides & manuals', 'Meters, pinouts, paper'));
    var grow = el('div', 'fk-chip-row');
    [
      { href: '/guides', title: 'All guides' },
      { href: '/guides/meter', title: 'Meter' },
      { href: '/guides/pinouts', title: 'Pinouts' },
      { href: '/guides/manuals', title: 'Manuals' },
      { href: '/guides/hardware', title: 'Hardware' },
      { href: '/guides/zones', title: 'Zone list' },
      { href: '/guides/doors', title: 'Doors' },
      { href: '/guides/cameras', title: 'Cam directory' },
      { href: '/guides/readings', title: 'Voltages' }
    ].forEach(function (c) {
      var a = el('a', 'fk-text-chip fk-link', c.title);
      a.href = c.href;
      grow.appendChild(a);
    });
    dash.appendChild(grow);

    appendJobSwitcher(dash);

    dash.appendChild(block('Grab a number', 'One-thumb estimators'));
    var row = el('div', 'fk-calc-row');
    CALCS.forEach(function (c) {
      var a = el('a', 'fk-calc-chip fk-link');
      a.href = c.href;
      a.appendChild(el('strong', null, c.label));
      a.appendChild(el('em', null, c.hint));
      row.appendChild(a);
    });
    dash.appendChild(row);

    if (state.favs.length) {
      dash.appendChild(block('Starred', state.favs.length + ' saved'));
      var fl = el('ul', 'fk-list');
      state.favs.forEach(function (f) {
        var c = checklist(f.id);
        var li = el('li');
        var a = el('a', 'fk-link', (c && c.title) || f.title || f.id);
        a.href = '/checklist/' + f.id;
        li.appendChild(a);
        li.appendChild(el('span', 'fk-meta', c ? catLabel(c) : ''));
        fl.appendChild(li);
      });
      dash.appendChild(fl);
    }

    if (state.recents.length) {
      dash.appendChild(block('Recent', null));
      var rl = el('ul', 'fk-list');
      state.recents.forEach(function (r) {
        var li = el('li');
        var a = el('a', 'fk-link', r.title || r.id);
        a.href = r.href || ('/checklist/' + r.id);
        li.appendChild(a);
        li.appendChild(el('span', 'fk-meta', fmtWhen(r.ts)));
        rl.appendChild(li);
      });
      dash.appendChild(rl);
    }

    host.appendChild(dash);
  }

  function renderHomeHits(host, query) {
    buildIndex();
    var kindLabel = { list: 'Checklist', calc: 'Calc', guide: 'Guide', call: 'Guide', doc: 'Manual' };
    var all = searchIndex(query, true);
    var items = all.filter(function (r) {
      return r.kind !== 'step' && r.kind !== 'tip';
    }).slice(0, 12);
    var box = el('div', 'fk-hits');
    box.appendChild(el('p', 'fk-hits-meta', items.length ? ((all.partial ? 'Closest matches · ' : '') + items.length + ' result' + (items.length === 1 ? '' : 's')) : 'No matches'));
    if (!items.length) {
      var empty = el('p', 'fk-empty', 'Nothing for that. Try a model (Vista 128), a symptom, or a calc.');
      box.appendChild(empty);
      host.appendChild(box);
      return;
    }
    var list = el('div', 'fk-hit-list');
    items.forEach(function (r) {
      var a = el('a', 'fk-hit fk-link');
      a.href = r.href;
      var t = el('div');
      t.appendChild(el('strong', null, r.title));
      if (r.sub) t.appendChild(el('span', null, r.sub));
      a.appendChild(t);
      a.appendChild(el('em', 'fk-hit-kind', kindLabel[r.kind] || r.kind));
      list.appendChild(a);
    });
    box.appendChild(list);
    host.appendChild(box);
  }

  function block(title, sub) {
    var s = el('div', 'fk-block-head');
    s.appendChild(el('h2', null, title));
    if (sub) s.appendChild(el('span', 'muted', sub));
    var wrap = el('div', 'fk-block');
    wrap.appendChild(s);
    return wrap;
  }

  function enhanceHome() {
    var page = document.querySelector('.home-page');
    if (!page) return;
    var q = document.getElementById('library-search');
    var searching = !!(q && q.value && q.value.trim());
    page.classList.toggle('fk-searching', searching);
    if (!searching) page.classList.remove('fk-show-all');

    page.querySelectorAll(':scope > .section').forEach(function (sec) {
      var h2 = sec.querySelector('.section-head h2, h2');
      if (!h2) return;
      var t = (h2.textContent || '').trim();
      if (t === 'All checklists' || t === 'Search results') sec.classList.add('fk-all-lists');
      if (t === 'Trades' || t === 'Browse categories') sec.classList.add('fk-trades');
    });

    page.querySelectorAll('.category-card').forEach(function (card) {
      if (card.querySelector('.fk-cat-ico')) return;
      var h3 = card.querySelector('h3');
      if (!h3) return;
      var key = (h3.textContent || '').trim().toLowerCase();
      var name = { cameras: 'cameras', access: 'access', fire: 'fire', network: 'network', troubleshoot: 'troubleshoot' }[key];
      if (!name) return;
      var ico = html('div', 'fk-cat-ico', icon(name));
      ico.setAttribute('aria-hidden', 'true');
      var top = card.querySelector('.category-card-top');
      (top || card).insertBefore(ico, (top || card).firstChild);
    });

    renderDash();
  }

  function landingDashSig() {
    var pack = '';
    var job = '';
    try { pack = localStorage.getItem('lawsonite-jobpack-v1') || ''; } catch (e) {}
    try { job = localStorage.getItem('lawsonite-jobs-v1') || ''; } catch (e) {}
    return state.recents.map(function (r) { return r.id; }).join(',') + '|' +
      state.favs.map(function (f) { return f.id; }).join(',') + '|' + pack + '|' + job;
  }
  function appendJobSwitcher(dash) {
    var api = window.__LAWSONITE_JOBS__;
    var row = el('div', 'fk-chip-row fk-job-row');
    var cur = null;
    if (api && api.current) cur = api.current();
    else {
      var js0 = readJSON('lawsonite-jobs-v1', null);
      if (js0 && js0.jobs && js0.jobs.length) cur = js0.jobs.filter(function (j) { return j.id === js0.current; })[0] || js0.jobs[0];
    }
    var jobCard = el('div', 'fk-home-card');
    if (cur && !genericJobName(cur.name)) {
      var n = cur.pack && cur.pack.ids ? cur.pack.ids.length : 0;
      jobCard.appendChild(block('This job', cur.name + (n ? ' · ' + n + ' pins' : '')));
    } else {
      jobCard.appendChild(block('This job', 'Name this site'));
    }
    var js = el('a', 'fk-text-chip fk-link', 'Job sheets');
    js.href = '/jobsheets';
    js.title = 'Saved job sheets, plus switch or start a site';
    row.appendChild(js);
    var pa = el('a', 'fk-text-chip fk-link', 'Pinned cards');
    pa.href = '/guides/pack';
    pa.title = 'Product cards starred for this site';
    row.appendChild(pa);
    jobCard.appendChild(row);
    dash.appendChild(jobCard);
  }
  function genericJobName(n) {
    n = String(n || '').trim();
    return !n || /^job( \d+)?$/i.test(n) || n === 'Job pack';
  }
  function homeCard(title, sub, row) {
    var card = el('div', 'fk-home-card');
    card.appendChild(block(title, sub));
    if (row) card.appendChild(row);
    return card;
  }

  function renderLandingDash(host) {
    var dash = el('div', 'fk-dash start-dash');

    if (state.recents.length) {
      var recentCard = el('div', 'fk-home-card');
      recentCard.appendChild(block('Recent', null));
      var rl0 = el('ul', 'fk-list');
      state.recents.forEach(function (r) {
        var li = el('li');
        var a = el('a', 'fk-link', r.title || r.id);
        a.href = r.href || ('/checklist/' + r.id);
        li.appendChild(a);
        if (r.ts) li.appendChild(el('span', 'fk-meta', fmtWhen(r.ts)));
        rl0.appendChild(li);
      });
      recentCard.appendChild(rl0);
      dash.appendChild(recentCard);
    }

    var row = el('div', 'fk-chip-row start-trades');
    [
      { trade: 'fire', label: 'Fire' },
      { trade: 'access', label: 'Access' },
      { trade: 'cameras', label: 'Cameras' },
      { trade: 'intrusion', label: 'Intrusion' },
      { trade: 'power', label: 'Power' }
    ].forEach(function (t) {
      var a = el('a', 'fk-text-chip fk-link', t.label);
      a.href = '/guides/trade?t=' + t.trade;
      row.appendChild(a);
    });
    dash.appendChild(homeCard('Or pick a trade', 'Trouble guides and checklists', row));

    var hwrow = el('div', 'fk-chip-row');
    var hwa = el('a', 'fk-text-chip fk-link', 'Cable hardware');
    hwa.href = '/guides/hardware';
    hwrow.appendChild(hwa);
    var hwm = el('a', 'fk-text-chip fk-link', 'Boxes / pipe');
    hwm.href = '/guides/hardware?tab=mount';
    hwrow.appendChild(hwm);
    dash.appendChild(homeCard('Rough-in', 'Hardware on the steel', hwrow));

    var paper = el('div', 'fk-chip-row');
    [
      { href: '/guides/zones', label: 'Zone list' },
      { href: '/guides/doors', label: 'Door sheet' },
      { href: '/guides/cameras', label: 'Cam directory' }
    ].forEach(function (t) {
      var a = el('a', 'fk-text-chip fk-link', t.label);
      a.href = t.href;
      paper.appendChild(a);
    });
    dash.appendChild(homeCard('Job paper', 'Printable leave-behinds', paper));

    appendJobSwitcher(dash);

    if (state.favs.length) {
      dash.appendChild(block('Starred', state.favs.length + ' saved'));
      var fl = el('ul', 'fk-list');
      state.favs.forEach(function (f) {
        var c = checklist(f.id);
        var li = el('li');
        var a = el('a', 'fk-link', (c && c.title) || f.title || f.id);
        a.href = f.href || ('/checklist/' + f.id);
        li.appendChild(a);
        li.appendChild(el('span', 'fk-meta', c ? catLabel(c) : ''));
        fl.appendChild(li);
      });
      dash.appendChild(fl);
    }

    host.appendChild(dash);
  }

  function enhanceLanding() {
    var page = document.querySelector('.start-page');
    if (!page) return;
    var q = document.getElementById('start-search');
    var host = document.getElementById('start-root');
    if (!host) return;
    if (q && q.placeholder !== 'Symptom, model, or calc') q.placeholder = 'Symptom, model, or calc';
    var hint = page.querySelector('.start-hint');
    if (hint) hint.textContent = 'A symptom, a model, or a calc';
    var query = (q && q.value ? q.value : '').trim();
    page.classList.toggle('is-searching', !!query);
    page.classList.toggle('has-dash', !query);
    if (!query) {
      var sig = landingDashSig();
      if (host.dataset.q === '' && host.dataset.sig === sig && host.querySelector('.fk-dash')) return;
      host.dataset.q = '';
      host.dataset.sig = sig;
      host.textContent = '';
      renderLandingDash(host);
      return;
    }
    if (host.dataset.q === query && host.querySelector('.fk-hits')) return;
    host.dataset.q = query;
    host.dataset.sig = '';
    host.textContent = '';
    renderHomeHits(host, query);
  }

  function shopBrand() {
    try {
      var pro = JSON.parse(localStorage.getItem('lawsonite-pro-v0') || '{}');
      var brand = JSON.parse(localStorage.getItem('lawsonite-company-brand-v0') || '{}');
      var shop = pro.plan === 'shop' && !!(String(brand.companyName || '').trim() || brand.logoDataUrl);
      return { shop: shop, brand: brand || {} };
    } catch (e) {
      return { shop: false, brand: {} };
    }
  }
  function ensurePrintLetterhead(page, title) {
    if (!page || page.querySelector('.print-letterhead, .gd-letterhead')) return;
    var shop = shopBrand();
    var box = el('div', 'print-letterhead only-print');
    var row = el('div', 'print-letterhead-row');
    if (shop.shop && shop.brand.logoDataUrl) {
      var img = document.createElement('img');
      img.className = 'print-letterhead-logo';
      img.src = shop.brand.logoDataUrl;
      img.alt = '';
      row.appendChild(img);
    } else {
      var mark = el('div', 'print-letterhead-logo fk-print-lmark');
      mark.setAttribute('aria-hidden', 'true');
      mark.textContent = 'L';
      row.appendChild(mark);
    }
    var text = el('div', 'print-letterhead-text');
    text.appendChild(el('p', 'print-letterhead-company',
      shop.shop && shop.brand.companyName
        ? String(shop.brand.companyName).trim()
        : 'Lawsonite Field Checklists'));
    if (shop.shop) {
      var contact = [shop.brand.phone, shop.brand.email].filter(function (x) {
        return x && String(x).trim();
      }).join(' · ');
      if (contact) text.appendChild(el('p', 'print-letterhead-contact', contact));
    }
    if (title) text.appendChild(el('p', 'print-letterhead-doc', title));
    row.appendChild(text);
    box.appendChild(row);
    box.appendChild(el('p', 'print-letterhead-powered',
      shop.shop
        ? 'Powered by Lawsonite · by Tomcat Studios'
        : 'Field leave-behind · Lawsonite by Tomcat Studios'));
    page.insertBefore(box, page.firstChild);
  }

  /* ---------------- checklist page ---------------- */
  function enhanceChecklist() {
    var page = document.querySelector('.checklist-runner');
    if (!page) return;

    var m = location.pathname.match(/^\/checklist\/([a-z0-9-]+)/i);

    var h1 = page.querySelector('h1');
    ensurePrintLetterhead(page, (h1 && h1.textContent) || 'Checklist');
    var lh = page.querySelector('.print-letterhead-row');
    if (lh && !lh.querySelector('.print-letterhead-logo, .fk-print-lmark')) {
      var mark = el('div', 'print-letterhead-logo fk-print-lmark');
      mark.setAttribute('aria-hidden', 'true');
      mark.textContent = 'L';
      lh.insertBefore(mark, lh.firstChild);
    }

    var toolbar = page.querySelector('.runner-toolbar');
    if (toolbar && !toolbar.querySelector('.fk-filters')) {
      var filters = el('div', 'fk-filters no-print');
      function mk(label, key) {
        var b = el('button', null, label);
        b.type = 'button';
        if (document.body.classList.contains(key)) b.classList.add('is-on');
        b.addEventListener('click', function () {
          document.body.classList.toggle(key);
          b.classList.toggle('is-on', document.body.classList.contains(key));
        });
        return b;
      }
      filters.appendChild(mk('Open items', 'fk-filter-open'));
      filters.appendChild(mk('Tips only', 'fk-filter-tips'));
      if (m) {
        var star = el('button', 'fk-star-list', favIndex(m[1]) >= 0 ? '★' : '☆');
        star.type = 'button';
        star.setAttribute('aria-label', 'Star this checklist');
        star.addEventListener('click', function () { toggleFav(m[1]); });
        filters.appendChild(star);
      }
      var extras = page.querySelector('.runner-extras');
      (extras || toolbar).appendChild(filters);
    } else if (toolbar) {
      var starBtn = page.querySelector('.fk-star-list');
      if (starBtn && m) starBtn.textContent = favIndex(m[1]) >= 0 ? '★' : '☆';
    }

    var sections = page.querySelectorAll('.checklist-section');
    if (toolbar && !page.querySelector('.fk-toc') && sections.length > 1) {
      var tocAnchor = page.querySelector('.runner-extras') || toolbar;
      var toc = el('nav', 'fk-toc no-print');
      toc.setAttribute('aria-label', 'Jump to section');
      sections.forEach(function (sec, idx) {
        var h = sec.querySelector('h2');
        if (!h) return;
        if (!sec.id) sec.id = 'fk-sec-' + idx;
        var a = el('a', null, h.textContent.replace(/^Branch [A-Z]\s+[—-]\s+/, '').replace(/^Start\s+[—-]\s+/, ''));
        a.href = '#' + sec.id;
        toc.appendChild(a);
      });
      if (tocAnchor !== toolbar) tocAnchor.appendChild(toc); /* section chips share the scroll-away row */
      else tocAnchor.after(toc);
    }

    /* Phone: related Quick Refs chips ride in the same scroll-away row (originals stay for desktop). */
    var xrow = page.querySelector('.runner-extras');
    var rel = page.querySelector('.related-calcs');
    if (xrow && rel && !xrow.querySelector('.fk-calc-clone')) {
      var firstToc = xrow.querySelector('.fk-toc');
      rel.querySelectorAll('a.related-calc-chip').forEach(function (a) {
        var c = el('a', 'related-calc-chip fk-link fk-calc-clone', a.textContent);
        c.href = a.getAttribute('href');
        c.title = 'Quick Ref: ' + a.textContent;
        if (firstToc) xrow.insertBefore(c, firstToc);
        else xrow.appendChild(c);
      });
      xrow.classList.add('fk-has-calcs');
    }

    var dec = page.querySelector('details.fk-decides');
    var dchip = xrow && xrow.querySelector('.fk-decides-chip');
    if (dchip && (!dec || dchip._dec !== dec)) { dchip.remove(); dchip = null; }
    if (xrow && dec && !dchip) {
      dchip = el('button', 'btn ghost fk-decides-chip', 'Decides the call');
      dchip.type = 'button';
      dchip._dec = dec;
      var syncChip = function () {
        dchip.setAttribute('aria-expanded', dec.open ? 'true' : 'false');
        dchip.classList.toggle('is-on', dec.open);
      };
      dchip.addEventListener('click', function () {
        dec.open = !dec.open;
        syncChip();
      });
      dec.addEventListener('toggle', syncChip);
      syncChip();
      var jsb = xrow.querySelector('.runner-jobsheet');
      if (jsb && jsb.nextSibling) xrow.insertBefore(dchip, jsb.nextSibling);
      else xrow.appendChild(dchip);
    }

    labelCategoryDone(page);
    shapeChecklistRows(page);
    clampDecides(page.querySelector('details.fk-decides'));
    ensureDecidesScrim();

    page.querySelectorAll('.page-header .lede, .page-header .inline-disclaimer').forEach(function (p) {
      if (p.dataset.fkClamp) return;
      if (!(window.matchMedia && window.matchMedia('(max-width: 640px)').matches)) return;
      p.dataset.fkClamp = '1';
      p.classList.add('fk-clamp');
      var more = el('button', 'fk-more', 'More');
      more.type = 'button';
      function flip() {
        var open = !p.classList.contains('is-open');
        p.classList.toggle('is-open', open);
        p.setAttribute('aria-expanded', open ? 'true' : 'false');
        more.textContent = open ? 'Less' : 'More';
        more.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
      more.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        flip();
      });
      p.addEventListener('click', flip);
      if (p.nextSibling) p.parentNode.insertBefore(more, p.nextSibling);
      else p.parentNode.appendChild(more);
    });

  }

  function labelCategoryDone(page) {
    var a = page.querySelector('a.runner-done');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var m = href.match(/\/category\/([a-z0-9-]+)/i);
    var names = { fire: 'Fire', access: 'Access', cameras: 'Cameras', network: 'Network', troubleshoot: 'Troubleshoot' };
    var name = m ? (names[m[1]] || m[1]) : '';
    a.textContent = name ? (name + ' list') : 'Back to list';
    a.setAttribute('title', 'Leaves this checklist. Does not mark a step.');
  }

  function ensureDecidesScrim() {
    if (document.querySelector('.fk-decides-scrim')) return;
    var s = el('div', 'fk-decides-scrim');
    s.addEventListener('click', function () {
      document.querySelectorAll('details.fk-decides[open]').forEach(function (d) { d.open = false; });
    });
    document.body.appendChild(s);
  }

  /* print: open the 'decides the call' strip (collapsed on phones) */
  window.addEventListener('beforeprint', function () {
    document.querySelectorAll('details.fk-decides').forEach(function (d) { d.open = true; });
  });

  function syncStars() {
    var stars = document.querySelectorAll('button.card-star[data-fav]');
    for (var i = 0; i < stars.length; i++) {
      var b = stars[i];
      var faved = favIndex(b.getAttribute('data-fav')) >= 0;
      b.setAttribute('aria-pressed', faved ? 'true' : 'false');
      b.textContent = faved ? '\u2605' : '\u2606';
      b.classList.toggle('is-fav', faved);
    }
    var listStar = document.querySelector('.fk-star-list');
    var m = location.pathname.match(/^\/checklist\/([a-z0-9-]+)/i);
    if (listStar && m) listStar.textContent = favIndex(m[1]) >= 0 ? '★' : '☆';
  }

  /* ---------------- header search + tab bar ---------------- */
  function ensureFieldNav() {
    /* Field tab retired — content lives on Library and Quick Refs. */
  }

  function ensureHeaderSearch() {
    var header = document.querySelector('.app-header');
    if (!header || header.querySelector('.fk-search-btn')) return;
    var btn = html('button', 'fk-search-btn no-print', icon('search'));
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Search Lawsonite');
    btn.addEventListener('click', openPalette);
    var nav = header.querySelector('.main-nav');
    var wrap = el('div', 'fk-header-tools no-print');
    wrap.appendChild(btn);
    if (nav) nav.before(wrap);
    else header.appendChild(wrap);
  }

  function ensureTabbar() {
    if (document.querySelector('.fk-tabbar')) {
      markTabs();
      return;
    }
    var nav = el('nav', 'fk-tabbar no-print');
    nav.setAttribute('aria-label', 'Field navigation');
    var tabs = [
      { href: '/', label: 'Home', icon: 'home', match: function (p) { return p === '/'; } },
      { href: '/library', label: 'Library', icon: 'grid', match: function (p) { return p === '/library' || p.indexOf('/category/') === 0 || p.indexOf('/checklist/') === 0 || p.indexOf('/guides/') === 0; } },
      { href: '/refs', label: 'Refs', icon: 'calc', match: function (p) { return p === '/refs'; } },
      { href: '/portal', label: 'Company', icon: 'shop', match: function (p) { return p.indexOf('/portal') === 0; } }
    ];
    tabs.forEach(function (t) {
      var a = el('a', 'fk-link');
      a.href = t.href;
      a.dataset.match = '1';
      a.innerHTML = icon(t.icon) + '<span>' + t.label + '</span>';
      a.setAttribute('aria-label', t.label);
      a._fkMatch = t.match;
      nav.appendChild(a);
    });
    document.body.appendChild(nav);
    markTabs();
  }

  function markTabs() {
    var p = pathOf();
    document.querySelectorAll('.fk-tabbar a').forEach(function (a) {
      var on = typeof a._fkMatch === 'function' ? a._fkMatch(p) : a.getAttribute('href') === p;
      a.classList.toggle('is-on', !!on);
    });
    var field = document.querySelector('.main-nav a[href="/field"]');
    if (field) field.classList.toggle('active', p === '/field' || p.indexOf('/guides') === 0);
  }

  /* ---------------- command palette ---------------- */
  var pal = { open: false, items: [], active: 0, index: null };

  function buildIndex() {
    var rows = [];
    allChecklists().forEach(function (c) {
      var cat = catLabel(c);
      rows.push({
        kind: 'list',
        title: c.title,
        sub: cat + (c.summary ? ' · ' + c.summary : ''),
        href: '/checklist/' + c.id,
        hay: (c.title + ' ' + (c.summary || '') + ' ' + (c.tags || []).join(' ') + ' ' + cat).toLowerCase()
      });
      (c.sections || []).forEach(function (sec) {
        (sec.items || []).forEach(function (it) {
          rows.push({
            kind: it.tip ? 'tip' : 'step',
            title: it.text,
            sub: c.title + ' · ' + (sec.title || ''),
            href: '/checklist/' + c.id,
            hay: (it.text + ' ' + (it.tip || '') + ' ' + c.title + ' ' + (sec.title || '')).toLowerCase()
          });
        });
      });
    });
    CALCS.forEach(function (c) {
      rows.push({
        kind: 'calc',
        title: c.label,
        sub: c.hint,
        href: c.href,
        hay: (c.label + ' ' + c.hint + ' ' + c.id).toLowerCase()
      });
    });
    if (window.__LAWSONITE_GUIDES_API__ && window.__LAWSONITE_GUIDES_API__.searchRows) {
      window.__LAWSONITE_GUIDES_API__.searchRows().forEach(function (r) { rows.push(r); });
    }
    pal.index = rows;
  }

  function score(hay, tokens) {
    var s = 0;
    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i];
      var at = hay.indexOf(t);
      if (at < 0) return 0;
      s += t.length * 2;
      if (at === 0) s += 8;
    }
    return s;
  }

  function searchIndex(q, cardsOnly) {
    if (!pal.index) buildIndex();
    var core = window.__LAWSONITE_SEARCH__;
    if (core && String(q || '').trim()) {
      var pool = cardsOnly ? pal.index.filter(function (r) { return r.kind !== 'step' && r.kind !== 'tip'; }) : pal.index;
      /* Forgiving search (2026-10-07): stopwords/apostrophes ignored, synonyms, partial matches ranked by
         how many terms hit, whole words first, trouble guides + checklists above product cards. */
      var ranked = core.rank(pool, q);
      var seenR = {};
      var outR = [];
      for (var ri = 0; ri < ranked.length && outR.length < 40; ri++) {
        var rr = ranked[ri];
        var kr = rr.kind + rr.href + rr.title;
        if (seenR[kr]) continue;
        seenR[kr] = 1;
        outR.push(rr);
      }
      outR.partial = ranked.partial;
      /* Title hits first. A manual whose title misses the words waits behind the checklist or guide. */
      var ts = core.terms(q);
      var digitQ = /\d/.test(q);
      function tier(r) {
        var blob = core.norm((r.title || '') + ' ' + (r.sub || ''));
        var s = core.scoreText(blob, core.norm(r.title || ''), ts);
        if (s.inTitle > 0 && r.kind === 'doc' && digitQ) return 0;
        if (s.inTitle > 0 && r.kind !== 'doc') return 0;
        if (r.kind !== 'doc' && s.matched > 0) return 1;
        if (s.inTitle > 0) return 2;
        return 3;
      }
      outR.forEach(function (r, i) { r._ord = i; });
      outR.sort(function (a, b) { return tier(a) - tier(b) || (a._ord - b._ord); });
      return outR;
    }
    var tokens = q.toLowerCase().split(/[^a-z0-9+/]+/).filter(function (t) { return t.length > 0; });
    if (!tokens.length) {
      return pal.index.filter(function (r) { return r.kind === 'list' || r.kind === 'calc' || r.kind === 'guide' || r.kind === 'call'; }).slice(0, 14);
    }
    var hits = [];
    pal.index.forEach(function (r) {
      var sc = score(r.hay, tokens);
      if (sc) {
        if (r.kind === 'list') sc += 12;
        if (r.kind === 'calc') sc += 8;
        if (r.kind === 'guide' || r.kind === 'call') sc += 11;
        if (r.kind === 'doc') {
          sc += 10;
          var tl = (r.title || '').toLowerCase();
          if (tokens.every(function (t) { return tl.indexOf(t) >= 0; })) sc += 18;
        }
        if (r.kind === 'tip') sc += 3;
        hits.push({ r: r, sc: sc });
      }
    });
    hits.sort(function (a, b) { return b.sc - a.sc; });
    var seen = {};
    var out = [];
    for (var i = 0; i < hits.length && out.length < 18; i++) {
      var r = hits[i].r;
      var k = r.kind + r.href + r.title;
      if (seen[k]) continue;
      seen[k] = 1;
      out.push(r);
    }
    return out;
  }

  function ensurePalette() {
    if (document.querySelector('.fk-pal-scrim')) return;
    var scrim = el('div', 'fk-pal-scrim no-print');
    scrim.innerHTML =
      '<div class="fk-pal" role="dialog" aria-modal="true" aria-label="Search Lawsonite">' +
        '<input class="fk-pal-input" type="search" placeholder="Symptom, device, calc, tip…" autocomplete="off" enterkeyhint="search">' +
        '<div class="fk-pal-list"></div>' +
        '<p class="fk-pal-hint">Tip · search works offline. Esc to close.</p>' +
      '</div>';
    scrim.addEventListener('click', function (e) {
      if (e.target === scrim) closePalette();
    });
    var input = scrim.querySelector('.fk-pal-input');
    input.addEventListener('input', function () { renderPalette(input.value); });
    input.addEventListener('keydown', onPalKey);
    document.body.appendChild(scrim);
  }

  function renderPalette(q) {
    var list = document.querySelector('.fk-pal-list');
    if (!list) return;
    var items = searchIndex(q || '').slice(0, 18);
    pal.items = items;
    pal.active = 0;
    if (!items.length) {
      list.innerHTML = '<p class="fk-pal-empty">Nothing matched. Try “PoE”, “strobe”, “EOL”, or “maglock”.</p>';
      return;
    }
    list.textContent = '';
    var lastKind = '';
    var kindLabel = { list: 'Checklists', calc: 'Calculators', tip: 'Field tips', step: 'Steps', guide: 'Guides', call: 'Troubleshooting', doc: 'Manuals' };
    items.forEach(function (r, idx) {
      if (r.kind !== lastKind) {
        list.appendChild(el('div', 'fk-pal-group', kindLabel[r.kind] || r.kind));
        lastKind = r.kind;
      }
      var b = el('button', 'fk-pal-item' + (idx === 0 ? ' is-active' : ''));
      b.type = 'button';
      b.dataset.idx = String(idx);
      var shortKind = { list: 'Checklist', calc: 'Calc', tip: 'Tip', step: 'Step', guide: 'Guide', call: 'Guide', doc: 'Manual' };
      b.innerHTML = '<span class="fk-pal-kind">' + (shortKind[r.kind] || r.kind) + '</span><span><strong></strong><span></span></span>';
      b.querySelector('strong').textContent = r.title;
      b.querySelector('span span').textContent = r.sub;
      b.addEventListener('click', function () { go(r.href); });
      list.appendChild(b);
    });
  }

  function onPalKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); closePalette(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); pal.active = Math.min(pal.active + 1, pal.items.length - 1); paintActive(); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); pal.active = Math.max(pal.active - 1, 0); paintActive(); return; }
    if (e.key === 'Enter') {
      e.preventDefault();
      var item = pal.items[pal.active];
      if (item) go(item.href);
    }
  }

  function paintActive() {
    var nodes = document.querySelectorAll('.fk-pal-item');
    nodes.forEach(function (n, i) {
      n.classList.toggle('is-active', i === pal.active);
      if (i === pal.active) n.scrollIntoView({ block: 'nearest' });
    });
  }

  function openPalette() {
    ensurePalette();
    buildIndex();
    var scrim = document.querySelector('.fk-pal-scrim');
    scrim.classList.add('is-open');
    pal.open = true;
    var input = scrim.querySelector('.fk-pal-input');
    input.value = '';
    renderPalette('');
    setTimeout(function () { input.focus(); }, 20);
  }
  function closePalette() {
    pal.open = false;
    var scrim = document.querySelector('.fk-pal-scrim');
    if (scrim) scrim.classList.remove('is-open');
  }

  /* Sticky checklist bar sits right under the real header height (header wraps on phones). */
  var lastHeaderH = -1;
  function syncHeaderHeight() {
    var hd = document.querySelector('.app-header');
    var h = hd ? Math.round(hd.getBoundingClientRect().height) : 0;
    if (h > 0 && h !== lastHeaderH) {
      lastHeaderH = h;
      document.documentElement.style.setProperty('--lw-header-h', h + 'px');
    }
  }
  window.addEventListener('resize', function () { syncHeaderHeight(); syncJumpOffset(); });

  /* ---------------- field pass: rows, calcs, dead route ---------------- */
  var OHM_KFT = { 10: 1, 12: 1.59, 14: 2.53, 16: 4.02, 18: 6.39, 20: 10.15, 22: 16.14, 24: 25.67 };
  var NAC_MA = {
    horn: 75,
    'strobe-15': 60,
    'strobe-75': 140,
    'strobe-110': 180,
    'horn-strobe-75': 200,
    'horn-strobe-110': 250
  };

  function shapeChecklistRows(page) {
    var xrow = page.querySelector('.runner-extras');
    if (!xrow || xrow.querySelector('.fk-row-actions')) return;
    var actions = el('div', 'fk-row-actions');
    var tools = el('div', 'fk-row-tools');
    var sections = el('div', 'fk-row-sections');
    Array.prototype.slice.call(xrow.children).forEach(function (node) {
      var primary = node.classList.contains('runner-jobsheet') ||
        node.classList.contains('fk-decides-chip') ||
        node.classList.contains('reset-quiet');
      if (primary) actions.appendChild(node);
      else if (node.classList.contains('fk-toc')) sections.appendChild(node);
      else tools.appendChild(node);
    });
    xrow.appendChild(actions);
    xrow.appendChild(tools);
    if (sections.childNodes.length) xrow.appendChild(sections);
  }

  function clampDecides(dec) {
    if (!dec || dec.querySelector('.fk-decides-more')) return;
    if (dec.querySelectorAll('li').length <= 3) return;
    var more = el('button', 'fk-decides-more', 'Rest of the call');
    more.type = 'button';
    more.addEventListener('click', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      var open = dec.classList.toggle('is-full');
      more.textContent = open ? 'First three' : 'Rest of the call';
      more.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    dec.appendChild(more);
  }

  function redirectDeadChecklist() {
    if (pathOf() === '/checklist/false-alarm-symptom-tree') {
      location.replace('/checklist/door-forced-held-open-diagnostics');
    }
  }

  function fkNum(n) {
    var v = parseFloat(String(n == null ? '' : n).replace(/,/g, ''));
    return isFinite(v) ? v : null;
  }
  function fkFixed(n, d) {
    if (n == null || !isFinite(n)) return '—';
    return n.toFixed(d);
  }
  function fkLoad(id, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem('lawsonite-calc-fk-' + id) || 'null');
      return v && typeof v === 'object' ? v : fallback;
    } catch (e) { return fallback; }
  }
  function fkSave(id, obj) {
    try { localStorage.setItem('lawsonite-calc-fk-' + id, JSON.stringify(obj)); } catch (e) {}
  }
  function fkRead(card) {
    var out = {};
    card.querySelectorAll('[data-k]').forEach(function (el) {
      out[el.dataset.k] = el.type === 'checkbox' ? el.checked : el.value;
    });
    return out;
  }
  function fkWrite(card, values) {
    Object.keys(values).forEach(function (k) {
      var node = card.querySelector('[data-k="' + k + '"]');
      if (!node) return;
      if (node.type === 'checkbox') node.checked = !!values[k];
      else node.value = values[k];
    });
  }
  function fkResult(card, rows) {
    var stack = card.querySelector('.result-stack');
    if (!stack) {
      stack = el('div', 'result-stack');
      card.appendChild(stack);
    }
    stack.textContent = '';
    rows.forEach(function (r) {
      if (r.badge) {
        stack.appendChild(el('p', 'badge ' + (r.bad ? 'bad' : 'ok'), r.badge));
        return;
      }
      var box = el('div', 'result-box' + (r.warn ? ' warn-result' : ''));
      box.appendChild(el('span', null, r.label));
      box.appendChild(el('strong', null, r.value));
      stack.appendChild(box);
    });
  }

  function fkCard(id, title, note) {
    var sec = el('section', 'calc-card fk-field-calc');
    sec.id = id;
    var head = el('div', 'calc-card-head');
    head.appendChild(el('h2', null, title));
    sec.appendChild(head);
    sec.appendChild(el('p', 'calc-note warn', note));
    return sec;
  }
  function fkGrid(sec) {
    var g = el('div', 'calc-grid');
    sec.appendChild(g);
    return g;
  }
  function fkField(grid, label, key, value, mode) {
    var lab = el('label');
    lab.appendChild(document.createTextNode(label));
    var input = el('input');
    input.setAttribute('inputmode', mode || 'decimal');
    input.dataset.k = key;
    input.value = value;
    lab.appendChild(input);
    grid.appendChild(lab);
  }
  function fkSelect(grid, label, key, value, options) {
    var lab = el('label');
    lab.appendChild(document.createTextNode(label));
    var sel = el('select');
    sel.dataset.k = key;
    options.forEach(function (opt) {
      var o = el('option', null, opt[1]);
      o.value = String(opt[0]);
      sel.appendChild(o);
    });
    sel.value = String(value);
    lab.appendChild(sel);
    grid.appendChild(lab);
  }
  function fkCheck(sec, key, label, on) {
    var lab = el('label', 'check-inline');
    var input = el('input');
    input.type = 'checkbox';
    input.dataset.k = key;
    input.checked = !!on;
    lab.appendChild(input);
    lab.appendChild(document.createTextNode(label));
    sec.appendChild(lab);
  }
  function fkPresets(sec, chips, paint) {
    var row = el('div', 'preset-chips');
    chips.forEach(function (c) {
      var b = el('button', 'preset-chip', c.label);
      b.type = 'button';
      b.addEventListener('click', function () {
        fkWrite(sec, c.values);
        paint();
      });
      row.appendChild(b);
    });
    sec.appendChild(row);
  }
  function fkJump(id, label) {
    document.querySelectorAll('.calc-jump').forEach(function (nav) {
      if (nav.querySelector('a[href="#' + id + '"]')) return;
      var a = el('a', null, label);
      a.href = '#' + id;
      nav.appendChild(a);
    });
  }

  function paintWatts() {
    var card = document.getElementById('watts');
    if (!card) return;
    var v = fkRead(card);
    fkSave('watts', v);
    var volts = fkNum(v.volts), amps = fkNum(v.amps), pf = fkNum(v.pf);
    if (volts == null || amps == null || pf == null || volts < 0 || amps < 0 || pf < 0 || pf > 1) {
      fkResult(card, [{ badge: 'Enter volts, amps, and a power factor from 0 to 1.', bad: true }]);
      return;
    }
    var va = volts * amps;
    var w = va * pf;
    fkResult(card, [
      { label: 'Watts', value: fkFixed(w, 2) + ' W' },
      { label: 'VA', value: fkFixed(va, 2) + ' VA' }
    ]);
  }
  function paintDay() {
    var card = document.getElementById('poeday');
    if (!card) return;
    var v = fkRead(card);
    fkSave('poeday', v);
    var cams = fkNum(v.cams), day = fkNum(v.day), night = fkNum(v.night), hours = fkNum(v.hours), budget = fkNum(v.budget);
    if (cams == null || day == null || night == null || hours == null || budget == null ||
        cams < 0 || day < 0 || night < 0 || hours < 0 || hours > 24 || budget < 0) {
      fkResult(card, [{ badge: 'Night hours are 0 to 24. Watts and the switch budget stay at or above 0.', bad: true }]);
      return;
    }
    var avg = day * ((24 - hours) / 24) + night * (hours / 24);
    var bump = v.pse === true || v.pse === 'true';
    var total = avg * cams * (bump ? 1.2 : 1);
    var spare = budget - total;
    fkResult(card, [
      { label: 'Average per camera', value: fkFixed(avg, 2) + ' W' },
      { label: bump ? 'With 20% held back' : 'Cameras together', value: fkFixed(total, 1) + ' W' },
      { label: 'Spare on the switch', value: fkFixed(spare, 1) + ' W', warn: spare < 0 },
      { badge: spare < 0 ? 'Over the switch budget.' : 'Inside the switch budget.', bad: spare < 0 }
    ]);
  }
  function paintRetain() {
    var card = document.getElementById('retain');
    if (!card) return;
    var v = fkRead(card);
    fkSave('retain', v);
    var cams = fkNum(v.cams), mbps = fkNum(v.mbps), days = fkNum(v.days), hours = fkNum(v.hours), over = fkNum(v.over);
    if (cams == null || mbps == null || days == null || hours == null || over == null ||
        cams < 0 || mbps < 0 || days < 0 || hours < 0 || hours > 24 || over < 0) {
      fkResult(card, [{ badge: 'Hours per day are 0 to 24. Spare room is a percent, 0 or more.', bad: true }]);
      return;
    }
    var gb = cams * mbps * 3600 * hours * days / 8 / 1000;
    gb = gb * (1 + over / 100);
    fkResult(card, [
      { label: 'Disk', value: fkFixed(gb, 0) + ' GB' },
      { label: 'Drive label', value: fkFixed(gb / 1000, 2) + ' TB' }
    ]);
  }
  function paintLoop() {
    var card = document.getElementById('loopft');
    if (!card) return;
    var v = fkRead(card);
    fkSave('loopft', v);
    var awg = Number(v.awg);
    var ohms = fkNum(v.ohms), eol = fkNum(v.eol);
    var kft = OHM_KFT[awg];
    if (!kft || ohms == null || eol == null || ohms < 0 || eol < 0) {
      fkResult(card, [{ badge: 'Type the ohms from the meter. When the resistor stays on the pair, type its ohms too. Type 0 when the resistor is off and the far end is twisted.', bad: true }]);
      return;
    }
    var copper = ohms - eol;
    if (copper <= 0) {
      fkResult(card, [{ badge: 'That reading is basically the resistor. Take it off, twist the two wires at the far end, and read the ohms at this end.', bad: true }]);
      return;
    }
    var feet = copper * 1000 / (2 * kft);
    fkResult(card, [
      { label: 'One-way length', value: fkFixed(feet, 0) + ' ft' },
      { label: 'Ohms that were the wire', value: fkFixed(copper, 2) + ' Ω' }
    ]);
  }
  function paintGf() {
    var card = document.getElementById('gfvolt');
    if (!card) return;
    var v = fkRead(card);
    fkSave('gfvolt', v);
    var panel = fkNum(v.panel);
    if (panel == null || panel <= 0) {
      fkResult(card, [{ badge: 'Enter the panel voltage, such as 24 or 12.', bad: true }]);
      return;
    }
    fkResult(card, [
      { label: 'Each wire to ground, no short', value: 'about ' + fkFixed(panel / 2, 1) + ' V' },
      { label: 'Other wire if one is shorted', value: 'toward ' + fkFixed(panel, 0) + ' V' }
    ]);
  }
  function paintNacPtp() {
    var card = document.getElementById('nac');
    if (!card) return;
    var stack = card.querySelector('.fk-ptp');
    if (!stack) {
      stack = el('div', 'result-stack fk-ptp');
      card.appendChild(stack);
    }
    var cls = card.querySelector('select');
    var countEl = null;
    var maEl = null;
    var awgEl = null;
    var feetEl = null;
    card.querySelectorAll('label').forEach(function (lab) {
      var name = (lab.firstChild && lab.firstChild.textContent || '').trim();
      if (name === 'Device count') countEl = lab.querySelector('input');
      if (name === 'mA per device' || name === 'Milliamps each') maEl = lab.querySelector('input');
      if (name === 'AWG' || name === 'Wire size') awgEl = lab.querySelector('select');
      if (name === 'One-way feet') feetEl = lab.querySelector('input');
    });
    var box = card.querySelector('input[type="checkbox"]');
    var id = cls ? cls.value : '';
    var count = countEl ? fkNum(countEl.value) : null;
    var ma = id === 'custom' ? (maEl ? fkNum(maEl.value) : null) : NAC_MA[id];
    stack.textContent = '';
    if (count == null || count <= 0 || ma == null || ma < 0) {
      stack.appendChild(el('p', 'muted small', 'Even spacing shows once the device type and the count are filled in.'));
      return;
    }
    var head = el('p', 'muted small', 'Even spacing: the same devices spread along the one-way feet. The number above still treats every device as if it sits at the far end, which reads high on purpose.');
    stack.appendChild(head);
    if (!box || !box.checked || !awgEl || !feetEl) {
      stack.appendChild(el('p', 'muted small', 'Turn on the voltage-drop check to see the even-spacing number.'));
      return;
    }
    var kft = OHM_KFT[Number(awgEl.value)];
    var feet = fkNum(feetEl.value);
    if (!kft || feet == null || feet < 0) return;
    var each = ma / 1000;
    var drop = (kft / 1000) * feet * each * (count + 1);
    var at = 24 - drop;
    var rows = [
      { label: 'Even-spacing drop', value: fkFixed(drop, 2) + ' V', warn: drop / 24 > 0.1 },
      { label: 'About at the last device', value: at < 0 ? 'below 0 V' : fkFixed(at, 2) + ' V', warn: at < 20.4 }
    ];
    rows.forEach(function (r) {
      var line = el('div', 'result-box' + (r.warn ? ' warn-result' : ''));
      line.appendChild(el('span', null, r.label));
      line.appendChild(el('strong', null, r.value));
      stack.appendChild(line);
    });
  }

  function buildWatts() {
    var saved = fkLoad('watts', { volts: '24', amps: '0.5', pf: '1' });
    var sec = fkCard('watts', 'Watts and VA',
      'Watts are volts times amps times a power factor. VA is volts times amps, with no factor. On DC, a maglock or a strike has a power factor of 1, so the two numbers match. A plug-in supply can draw more VA than watts. Check the device sheet before you size the supply.');
    fkPresets(sec, [
      { label: 'Maglock 0.5 A @ 12 V', values: { volts: '12', amps: '0.5', pf: '1' } },
      { label: 'Strike 0.35 A @ 24 V', values: { volts: '24', amps: '0.35', pf: '1' } },
      { label: 'QEL 1 A @ 24 V', values: { volts: '24', amps: '1', pf: '1' } }
    ], paintWatts);
    var g = fkGrid(sec);
    fkField(g, 'Volts', 'volts', saved.volts || '24');
    fkField(g, 'Amps', 'amps', saved.amps || '0.5');
    fkField(g, 'Power factor (1 for DC)', 'pf', saved.pf || '1');
    return sec;
  }
  function buildDay() {
    var saved = fkLoad('poeday', { cams: '8', day: '6', night: '12', hours: '10', budget: '123', pse: false });
    var sec = fkCard('poeday', 'Day / night camera power',
      'Cameras pull more when the infrared lights come on. Type the day watts, the night watts, and how many hours those lights run. This averages that and lines it up against the switch budget. The watts here are what the camera uses. The switch often holds some extra back. The PoE card lists the class watts.');
    fkPresets(sec, [
      { label: '8 domes, IR at night', values: { cams: '8', day: '6', night: '12', hours: '10', budget: '123' } },
      { label: '16 bullets, 370 W switch', values: { cams: '16', day: '8', night: '15', hours: '12', budget: '370' } }
    ], paintDay);
    var g = fkGrid(sec);
    fkField(g, 'Cameras', 'cams', saved.cams || '8', 'numeric');
    fkField(g, 'Day watts each', 'day', saved.day || '6');
    fkField(g, 'Night watts each (infrared on)', 'night', saved.night || '12');
    fkField(g, 'Hours the infrared is on', 'hours', saved.hours || '10');
    fkField(g, 'Switch budget (watts)', 'budget', saved.budget || '123');
    fkCheck(sec, 'pse', 'Add 20% for what the switch holds back', saved.pse);
    return sec;
  }
  function buildRetain() {
    var saved = fkLoad('retain', { cams: '16', mbps: '4', days: '30', hours: '24', over: '10' });
    var sec = fkCard('retain', 'Disk for these cameras',
      'How much drive for this many cameras, recording the whole time at one speed. Motion-only recording uses less. One camera at 4 Mbps, day and night, is about 40 GB a day before spare room. The TB number matches a drive label.');
    fkPresets(sec, [
      { label: '16 cams · 4 Mbps · 30 days', values: { cams: '16', mbps: '4', days: '30', hours: '24', over: '10' } },
      { label: '32 cams · 2 Mbps · 14 days', values: { cams: '32', mbps: '2', days: '14', hours: '24', over: '10' } },
      { label: '8 cams · 8 Mbps · 24/7 · 30 days', values: { cams: '8', mbps: '8', days: '30', hours: '24', over: '0' } }
    ], paintRetain);
    var g = fkGrid(sec);
    fkField(g, 'Cameras', 'cams', saved.cams || '16', 'numeric');
    fkField(g, 'Speed each (Mbps)', 'mbps', saved.mbps || '4');
    fkField(g, 'Days', 'days', saved.days || '30', 'numeric');
    fkField(g, 'Hours recorded per day', 'hours', saved.hours || '24');
    fkField(g, 'Spare room %', 'over', saved.over || '10');
    return sec;
  }
  function buildLoop() {
    var saved = fkLoad('loopft', { awg: '18', ohms: '10', eol: '0' });
    var sec = fkCard('loopft', 'How far is this wire?',
      'Take the end-of-line resistor off the pair. At the far end, twist the two wires together. At this end, read the ohms. Type that reading and the wire size. This guesses the one-way footage. The copper numbers match the voltage-drop card, at about 68°F. A splice, a cold morning, or steel in the path will move the number. When the resistor stays on the pair, it already joins the two wires. Type its ohms in the last box (2200, 4700, or 10000) and leave the far end as it is. Type 0 when the resistor is off and the far end is twisted.');
    var awgs = [10, 12, 14, 16, 18, 20, 22, 24].map(function (n) {
      return [n, n + ' AWG — ' + OHM_KFT[n] + ' ohms per 1,000 ft'];
    });
    fkPresets(sec, [
      { label: '18 AWG, far end twisted', values: { awg: '18', eol: '0' } },
      { label: '22 AWG fire pair', values: { awg: '22', eol: '0' } },
      { label: 'Resistor was 2.2k', values: { eol: '2200' } },
      { label: 'Resistor was 4.7k', values: { eol: '4700' } },
      { label: 'Resistor was 10k', values: { eol: '10000' } }
    ], paintLoop);
    var g = fkGrid(sec);
    fkSelect(g, 'Wire size', 'awg', saved.awg || '18', awgs);
    fkField(g, 'Ohms on the meter', 'ohms', saved.ohms || '10');
    fkField(g, 'Resistor ohms, if it is still on the pair', 'eol', saved.eol || '0');
    return sec;
  }
  function buildGf() {
    var saved = fkLoad('gfvolt', { panel: '24' });
    var sec = fkCard('gfvolt', 'What a ground fault looks like',
      'On a normal fire circuit, each wire to ground sits at about half the panel voltage. On 24 volts that is about 12 volts. When one wire is shorted to ground, that wire falls toward 0 and the other rises toward the full panel voltage. This is the picture to expect. It is not a test you run on a live alarm, and it is not a reason to jumper a life-safety circuit.');
    fkPresets(sec, [
      { label: '24 V fire / NAC', values: { panel: '24' } },
      { label: '12 V', values: { panel: '12' } }
    ], paintGf);
    var g = fkGrid(sec);
    fkField(g, 'Panel volts', 'panel', saved.panel || '24');
    return sec;
  }

  var PLAIN_NOTE = {
    ohm: 'Volts equal amps times ohms. Pick the one you want to find, then type the other two.',
    vd: 'Copper wire, counted both ways (out and back). The ohms per 1,000 feet are for room temperature, about 68°F. One-way feet is the length of the run, not the round trip. This is a teaching estimate. Check the device sheet before you treat the drop as good.',
    wire: 'Type the amps, the one-way feet, and how much drop you can live with. This picks the smallest copper size from the same table as voltage drop, at about 68°F. Teaching estimate. Check the device sheet.',
    fill: 'A rough check of how full the pipe is. One cable can use about 53 percent of the pipe. Two cables can use about 31 percent. Three or more can use about 40 percent. Sizes are in inches, and the areas are in square inches. This is a teaching estimate. Check the cable sheet and the local rules.',
    poe: 'The switch sets aside watts for each port by class. That reserved number is what the switch holds. The camera can use less than that after the cable eats some. Each class in the list shows both numbers. Switches do not all keep the same spare. Teaching estimate. Check the switch sheet.',
    battery: 'Standby amps times the standby hours, plus alarm amps times the alarm hours, then times a spare factor. 1.25 means 25 percent extra, and that is the teaching default. A lot of panel sheets use 1.2, which is 20 percent extra. Use the factor on that panel\'s own battery sheet. The result rounds up to a common sealed-battery size. This is a teaching estimate, not a code-stamped battery calc.',
    eol: 'Common end-of-line resistors, including the Vista 2,200 ohm, plus pairs for panels that want two resistors. Where the resistor sits, and what the panel expects, changes by panel. Read that panel\'s book for the zone. Teaching estimate.',
    nac: 'Device count times the current for that horn or strobe. The voltage drop treats every device as if it sits at the far end of the one-way feet, which reads high on purpose. These currents are rough teaching numbers. They are not the device listing, not a light-coverage calc, and not a fire-circuit design.',
    lock: 'Holding amps times the number of doors. A motor latch pulls extra for a moment when it moves. Size the power supply for that short hit, not just the holding number printed on the lock. Teaching estimate. Check the lock sheet.',
    rs485: 'A teaching length limit for this speed, on decent twisted pair, in feet. Run the cable as one chain, from device to device. Ground the shield at one end only. Put a 120 ohm resistor at each of the two ends of the wire. This is a teaching estimate, not a standards worksheet.'
  };
  var PLAIN_RESULT = {
    'Voltage drop': 'Volts lost on the wire',
    'Round-trip R': 'Ohms, out and back',
    '% of system': 'Percent of the supply',
    'Approx at device': 'About at the device',
    'Min copper AWG': 'Smallest wire',
    'Rough VD': 'Rough volts lost',
    'Rough VD %': 'Rough percent lost',
    'Approx at last device': 'About at the last device',
    'Holding load': 'Holding amps',
    'Inrush load': 'Startup amps',
    'Spare (holding)': 'Spare while holding',
    'Teaching max': 'Length limit (feet)',
    'Derated for nodes': 'Shorter limit for this many devices',
    'Standby AH': 'Standby amp-hours',
    'Alarm AH': 'Alarm amp-hours',
    'Raw AH': 'Amp-hours before the spare factor',
    'Suggested size': 'Suggested battery',
    'Est. fill': 'About this full',
    'Spare %': 'Spare percent'
  };
  var PLAIN_EXACT = {
    'LV conduit fill': 'Conduit fill',
    'PoE switch budget (PSE)': 'PoE switch budget',
    'Battery AH standby': 'Battery size',
    'EOL / supervision helper': 'End-of-line resistor',
    'NAC / notification load': 'Horn and strobe load',
    'Lock power / inrush': 'Lock power',
    'RS-485 / OSDP length': 'RS-485 wire length',
    'DC voltage drop': 'Voltage drop',
    'Wire size picker': 'Wire size',
    'AWG': 'Wire size',
    'Load (A)': 'Load (amps)',
    'System (V)': 'Supply (volts)',
    'Voltage (V)': 'Volts',
    'Current (A)': 'Amps',
    'Resistance (ohms)': 'Ohms',
    'Target drop (%)': 'Drop you can allow (%)',
    'Supply (V)': 'Supply (volts)',
    'Conduit (approx)': 'Conduit size (inches)',
    'Cable type (approx)': 'Cable type',
    'Switch PoE budget, PSE (W)': 'Switch budget (watts)',
    'Standby (mA)': 'Standby (milliamps)',
    'Alarm (mA)': 'Alarm (milliamps)',
    'Alarm hours (~5 min = 0.0833)': 'Alarm hours (5 minutes is 0.083)',
    'Derating factor (1.25 teaching; many sheets 1.2)': 'Spare factor (1.25 teaching, many sheets use 1.2)',
    'Common EOL / DEOL preset': 'Resistor preset',
    'R1 (ohms)': 'Top resistor (ohms)',
    'R2 (ohms) - lower leg': 'Bottom resistor (ohms)',
    'Device class': 'Horn or strobe',
    'mA per device': 'Milliamps each',
    'Include rough DC voltage-drop note (24 V system)': 'Also estimate the voltage drop on a 24 volt run',
    'Holding (A each)': 'Holding amps, each door',
    'Inrush multiplier': 'Startup multiplier',
    'Supply / ACM (A)': 'Power supply (amps)',
    'Baud': 'Speed (baud)',
    'Nodes on the bus': 'Devices on the wire',
    '120 Ω at both physical ends': '120 ohm resistor at both ends of the wire',
    '5 min alarm': '5 minute alarm',
    '24 h standby': '24 hour standby',
    '4 h standby': '4 hour standby',
    'x1.25 teaching derate': '25 percent spare',
    'x1.2 (20%)': '20 percent spare',
    '8x horn-strobe 75': '8 horn-strobes, 75 candela',
    '4x strobe 110': '4 strobes, 110 candela',
    '12x horn': '12 horns',
    '1 A lock': '1 amp lock',
    '3% drop': '3 percent drop',
    '5% drop': '5 percent drop',
    '10% drop': '10 percent drop',
    '8x af Class 3': '8 devices, PoE class 3',
    '4x at Class 4': '4 devices, PoE class 4',
    '2x bt Class 6': '2 devices, PoE class 6',
    'Class preset': 'PoE class',
    'PSE W each': 'Switch watts each',
    'Within switch budget (PSE)': 'Inside the switch budget.',
    'Over switch budget (PSE) - reduce load': 'Over the switch budget. Lower the load.',
    'wire size picker': 'wire size',
    'Voltage-divider check notes': 'Voltage in the middle',
    'Series vs parallel vs DEOL': 'How the resistor is wired',
    'Series EOL': 'In line at the last device',
    'Parallel EOL': 'Across the contact',
    'DEOL': 'Two resistors',
    'DEOL (double EOL)': 'Two resistors',
    'Vista-style 2.2k ohms series': 'Vista 2,200 ohms, in line',
    '2.2k ohms series EOL': '2,200 ohms, in line',
    '3.3k ohms series EOL': '3,300 ohms, in line',
    '4.7k ohms series EOL': '4,700 ohms, in line',
    '5.6k ohms series EOL': '5,600 ohms, in line',
    '10k ohms parallel EOL': '10,000 ohms, across the contact',
    '4.7k ohms parallel EOL': '4,700 ohms, across the contact',
    'DEOL 2.2k / 2.2k (common)': 'Two resistors, 2,200 and 2,200',
    'DEOL 1k / 1k': 'Two resistors, 1,000 and 1,000',
    'DEOL 3.3k / 6.8k': 'Two resistors, 3,300 and 6,800',
    'DEOL 4.7k / 2.2k': 'Two resistors, 4,700 and 2,200',
    'Horn / sounder (~75 mA)': 'Horn (about 75 milliamps)',
    'Strobe 15 cd (~60 mA)': 'Strobe, 15 candela (about 60 milliamps)',
    'Strobe 75 cd (~140 mA)': 'Strobe, 75 candela (about 140 milliamps)',
    'Strobe 110 cd (~180 mA)': 'Strobe, 110 candela (about 180 milliamps)',
    'Horn-strobe 75 cd (~200 mA)': 'Horn and strobe, 75 candela (about 200 milliamps)',
    'Horn-strobe 110 cd (~250 mA)': 'Horn and strobe, 110 candela (about 250 milliamps)',
    'Custom mA / device': 'Custom milliamps',
    'QEL / motor latch ~1 A hold, 4x inrush': 'Motor latch, about 1 amp holding, 4 times at startup',
    'Maglock light ~0.25 A @ 12 V': 'Light maglock, about 0.25 amp at 12 volts',
    'Maglock 1200 lb class ~0.5 A @ 12 V': '1,200 lb maglock, about 0.5 amp at 12 volts',
    'Strike ~0.35 A @ 24 V': 'Strike, about 0.35 amp at 24 volts',
    'Honeywell Vista-family teaching value. Series EOL at the last device; confirm zone type (EOL / DEOL) in panel programming.': 'A Honeywell Vista teaching value. The resistor sits in line at the last device. Check the panel programming for one resistor or two.',
    'Common burglar zone teaching value. Series EOL usually sits at the last device.': 'A common burglar-zone teaching value. The resistor usually sits in line at the last device.',
    'Seen on some FA / intrusion panels. Confirm exact value in the panel manual.': 'Seen on some fire and burglar panels. Check the exact value in the panel book.',
    'Very common intrusion EOL. Measure loop at panel with zone normal.': 'A very common burglar resistor. Read the ohms at the panel with the zone closed and normal.',
    'Used by some manufacturers - do not swap brands blindly.': 'Used by some brands. Match the panel book before you change the resistor.',
    'Parallel EOL often across N/C contacts so open contact still shows supervision.': 'Often wired across a closed contact, so an open contact still leaves a resistance the panel can see.',
    'Parallel style for some FA initiating circuits - verify listing & panel.': 'Used across the contact on some fire initiating circuits. Check the listing and the panel book.',
    'Double-EOL teaching pair: one resistor for normal supervision, one for alarm window. Panel must be programmed DEOL - values vary by brand.': 'Two resistors: one for the normal reading, one for the alarm window. The panel has to be set for two resistors. The values change by brand.',
    'Matched 1k ohms DEOL teaching pair. Measure loop resistance at the panel with zone normal vs alarm.': 'A matched pair of 1,000 ohm resistors. Read the zone at the panel both normal and in alarm.',
    'Asymmetric DEOL teaching pair (fills R1=3.3k, R2=6.8k for divider notes). Always match the exact pair in the panel / FACP manual.': 'An uneven pair, 3,300 ohms and 6,800 ohms. The boxes below use those for the middle-voltage check. Match the pair in the panel book.',
    'Mixed DEOL teaching pair seen in some intrusion docs. Series vs shunt placement differs - verify topology before cutting resistors.': 'A mixed pair seen in some burglar notes. Which resistor is in line, and which sits across the contact, changes by panel. Check that before you land the resistors.',
    'Typical teaching mid-range horn; use device datasheet.': 'A middle-of-the-road horn for teaching. Use the number on the device sheet.',
    'Low candela strobe order-of-magnitude only.': 'A small strobe. The current is a rough teaching number.',
    'Mid candela teaching value.': 'A mid-size strobe. The current is a rough teaching number.',
    'Higher candela teaching value.': 'A brighter strobe. The current is a rough teaching number.',
    'Combined unit rough estimate.': 'A horn and strobe together. The current is a rough teaching number.',
    'Higher combined teaching value.': 'A brighter horn and strobe. The current is a rough teaching number.',
    'Enter datasheet current.': 'Type the milliamps from the device sheet.',
    'Holding current is what the supply must sustain. Inrush is the first half-second on QEL / motor latches — size the ACM output for that, not the nameplate hold.': 'The power supply has to hold the lock\'s running amps. A motor latch pulls extra for about half a second when it moves. Size the supply for that short hit, not the holding number on the lock.',
    'Daisy-chain only. Stars and T-taps are intermittent ghosts.': 'Run one chain, device to device. A star or a T in the middle will act up.',
    'Shield single-end. 120 Ω termination at the two physical ends — not on every MR52 in the middle.': 'Ground the shield at one end only. Put 120 ohms at the two ends of the wire, not on a reader in the middle.',
    'No termination: expect retries on longer runs. Land 120 Ω at both physical ends of the bus (first and last device), not in the middle.': 'With no end resistors, a long run will retry. Put 120 ohms at the first device and the last device.',
    'Node count is getting busy. Confirm the controller’s device limit, not just the copper.': 'That is a lot of devices. Check how many the controller allows. The wire length is only half of that check.',
    'Over the teaching length. Slow the baud, shorten the run, or add a repeater / second bus.': 'Longer than this teaching limit. Slow the speed, shorten the run, or split the devices onto a second wire.',
    'Within teaching length. ': 'Inside the teaching length. ',
    ' - resistor at the ': ' sits at the ',
    ' device. Closed N/C path shows ~EOL at the panel; open = trouble.': ' device. With the contact closed, the panel reads about the resistor value. An open wire reads as trouble.',
    ' - across contacts so an open device still leaves a supervised resistance on the loop.': ' sits across the contacts, so an open contact still leaves a resistance on the pair.',
    ' - two resistors create distinct normal / alarm / short / open windows. Panel must be set to DEOL; topology varies by brand.': ' gives the panel a different reading for normal, alarm, a short, and an open wire. The panel has to be set for two resistors. The wiring changes by brand.',
    'Always match the exact value and topology in the panel / FACP manual.': 'Match the ohms and the wiring in that panel\'s book.',
    'Selecting a preset fills R1 and R2 for the divider teaching check below.': 'A preset fills the two resistor boxes for the voltage check below.',
    'Over-drop: calculated drop exceeds system voltage - at-device V would be negative. Upsize wire, shorten the run, or reduce load.': 'The lost volts are bigger than the supply, so the device would come out below zero. Use thicker wire, a shorter run, or less load.',
    'Drop is over ~10% of system voltage - verify with manufacturer limits before treating this as acceptable.': 'The lost volts are over about 10 percent of the supply. Check the device sheet before you call it good.',
    'Over-drop on this teaching estimate - at-device voltage would be negative. Do not use these numbers; upsize conductors, shorten the run, or reduce NAC load.': 'On this teaching estimate the lost volts are bigger than 24, so the last device would come out below zero. Use thicker wire, a shorter run, or fewer devices.',
    'Rough VD is over ~10% of 24 V - verify with manufacturer NAC worksheets before treating as acceptable.': 'The rough drop is over about 10 percent of 24 volts. Check the horn and strobe worksheet before you call it good.',
    'End-of-line lump: the whole load is treated as if it sits at the last device, which overstates the drop (conservative). Rough copper DC estimate only - not a substitute for manufacturer NAC voltage-drop worksheets or AHJ-approved design. See also': 'This drop treats the whole load as if it sits at the last device, so the number reads high on purpose. It is a rough copper estimate. Check the manufacturer worksheet and the approved fire design. See also',
    'Need a size? Try the': 'Need a wire size? Use the',
    'Cross-check with': 'Check it again on',
    ' once you pick a gauge.': ' once you pick a size.',
    'No AWG data available.': 'No wire size on this table fits that drop.'
  };

  function fkInSvg(node) {
    var p = node.parentNode;
    while (p && p !== document) {
      if (p.namespaceURI === 'http://www.w3.org/2000/svg') return true;
      p = p.parentNode;
    }
    return false;
  }
  function fkSetText(el, text) {
    if (!el || el.textContent === text) return;
    el.textContent = text;
  }
  function fkRewriteNode(node) {
    var value = node.nodeValue;
    if (!value) return;
    var parent = node.parentNode;
    var inResult = parent && parent.closest && parent.closest('.result-box');
    if (inResult && PLAIN_RESULT[value] != null && value !== PLAIN_RESULT[value]) {
      node.nodeValue = PLAIN_RESULT[value];
      return;
    }
    var exact = PLAIN_EXACT[value];
    if (exact != null) {
      if (value !== exact) node.nodeValue = exact;
      return;
    }
    var next = value;
    next = next.replace(/ohms\/kft/g, 'ohms per 1,000 ft');
    next = next.replace(/~20 deg C/g, 'about 68°F');
    next = next.replace(/\bkft\b/g, '1,000 ft');
    next = next.replace(/\(teach ~/g, '(about ');
    next = next.replace(/^Used ~$/, 'Used about ');
    next = next.replace(/ in\^2 of ~$/, ' sq in of about ');
    next = next.replace(/ sq in of ~$/, ' sq in of about ');
    next = next.replace(/in\^2/g, 'sq in');
    next = next.replace(/\(~([^()]*?) W PSE \/ ([^()]*?) W PD\)/g, '(switch holds $1 W, camera can use about $2 W)');
    next = next.replace(/ - R1 ([\d,]+) \/ R2 ([\d,]+)/g, ' — top $1 ohms, bottom $2 ohms');
    next = next.replace(/^Drop @ (\d+) AWG$/, 'Volts lost at $1 AWG');
    next = next.replace(/^Drop % @ (\d+) AWG$/, 'Percent lost at $1 AWG');
    next = next.replace(/^Next size up \((\d+) AWG\)$/, 'Next thicker wire ($1 AWG)');
    next = next.replace(/^Required \(x([0-9.]+)\)$/, 'Amp-hours with spare factor $1');
    next = next.replace(/^Even (\d+) AWG exceeds ~([^%]+)% drop on this teaching table - shorten the run, reduce load, raise supply V, or verify with manufacturer\.$/, 'Even $1 AWG loses more than about $2 percent on this table. Shorten the run, lower the load, or raise the supply, and check the device sheet.');
    next = next.replace(/^(\d+) AWG is the thickest size in this table and meets the target\.$/, '$1 AWG is the thickest size on this table, and it meets the drop you allowed.');
    next = next.replace(/^Minimum teaching size (\d+) AWG; next size up \(thicker\) is (\d+) AWG\.$/, 'Smallest size on this table is $1 AWG. The next thicker size is $2 AWG.');
    next = next.replace(/^Required exceeds common single (\d+) AH - use parallel packs \/ verify manufacturer\.$/, 'This needs more than one $1 amp-hour battery. Use batteries side by side, and check the panel sheet.');
    next = next.replace(/^Round up to a common (\d+) AH sealed battery \(or parallel packs\).$/, 'Round up to a common $1 amp-hour sealed battery, or use batteries side by side.');
    next = next.replace(/^Holding fits, inrush does not: about (.+) A on unlock vs the (.+) A supply you entered\. That supply will brown out on unlock - use a supply \/ ACM output rated for the inrush, or stagger unlocks\.$/, 'Holding fits. Startup does not: about $1 amps when the lock moves, against the $2 amp supply you typed. That supply will sag. Use a supply rated for the startup hit, or unlock the doors one at a time.');
    next = next.replace(/^Holding load exceeds the supply\. Add a listed power supply or split the doors\.$/, 'The holding amps are over the supply you typed. Add a listed power supply, or split the doors across supplies.');
    next = next.replace(/ - verify properly$/, '. Check the real cable sheet.');
    next = next.replace(/Within teaching length\. /g, 'Inside the teaching length. ');
    if (next !== value) node.nodeValue = next;
  }
  function plainCalcCopy() {
    var page = document.querySelector('.refs-page');
    if (!page) return;
    Object.keys(PLAIN_NOTE).forEach(function (id) {
      var card = document.getElementById(id);
      if (!card) return;
      var notes = card.querySelectorAll('p.calc-note');
      var i;
      for (i = 0; i < notes.length; i++) {
        if (notes[i].closest('.result-stack')) continue;
        fkSetText(notes[i], PLAIN_NOTE[id]);
        break;
      }
    });
    var notes = document.querySelectorAll('#eol p.calc-note');
    if (notes.length > 1 && notes[1].textContent.indexOf('R2') >= 0) {
      fkSetText(notes[1], 'When two resistors share a zone, the voltage in the middle is the supply times the bottom resistor, divided by both resistors added together. That is the picture for an alarm window and a trouble window on the same pair.');
    }
    page.querySelectorAll('#poe .device-row > label').forEach(function (lab) {
      if (lab.firstChild && lab.firstChild.nodeValue === 'Label') lab.firstChild.nodeValue = 'Name';
    });
    page.querySelectorAll('.calc-jump a').forEach(function (a) {
      var pills = { 'VD': 'Drop', 'EOL': 'Resistor', 'NAC': 'Horns' };
      if (pills[a.textContent]) a.textContent = pills[a.textContent];
    });
    page.querySelectorAll('#ohm .seg-btn').forEach(function (b) {
      var now = b.textContent;
      var next = now === 'Solve V' ? 'Find volts' : now === 'Solve I' ? 'Find amps' : now === 'Solve R' ? 'Find ohms' : now;
      if (next !== now) b.textContent = next;
    });
    var walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT, null);
    var node;
    var batch = [];
    while ((node = walker.nextNode())) batch.push(node);
    batch.forEach(function (n) {
      if (fkInSvg(n)) return;
      if (n.parentNode && n.parentNode.closest && n.parentNode.closest('.fk-field-calc')) return;
      fkRewriteNode(n);
    });
  }
  function schedulePlainCalcs() {
    if (window.__FK_PLAIN) return;
    window.__FK_PLAIN = requestAnimationFrame(function () {
      window.__FK_PLAIN = 0;
      plainCalcCopy();
    });
  }

  function polishRefs(page) {
    if (!page) return;
    page.querySelectorAll('p, .calc-note, .info-panel, .soft-upgrade, .calc-sync-label').forEach(function (n) {
      if (n.closest && n.closest('.calc-card')) return;
      var t = n.textContent || '';
      if (t.indexOf('Last-used inputs') >= 0 || t.indexOf('Educational estimate only') >= 0 || t.indexOf('full calc pad') >= 0 || t.indexOf('Optional Pro') >= 0) {
        n.classList.add('fk-quiet-note');
      }
      if (t.indexOf('One-thumb estimators') >= 0 && t.indexOf('Full pad offline') >= 0) {
        n.textContent = 'One-thumb estimators. The number is a teaching approximation. Verify it with the device sheet.';
      }
    });
    var order = ['#ohm', '#vd', '#battery', '#watts', '#loopft', '#gfvolt'];
    page.querySelectorAll('.calc-jump').forEach(function (nav) {
      var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
      var front = [];
      order.forEach(function (hash) {
        links.forEach(function (l) {
          if ((l.getAttribute('href') || '').indexOf(hash) >= 0) front.push(l);
        });
      });
      var i;
      for (i = front.length - 1; i >= 0; i--) nav.insertBefore(front[i], nav.firstChild);
    });
    syncJumpOffset();
    bindCalcJumps();
    plainCalcCopy();
  }

  function syncJumpOffset() {
    var nav = document.querySelector('.refs-page .calc-jump');
    if (!nav) return;
    document.documentElement.style.setProperty('--lw-jump-h', Math.ceil(nav.getBoundingClientRect().height) + 'px');
  }

  function calcJumpGap() {
    var header = document.querySelector('.app-header');
    var nav = document.querySelector('.refs-page .calc-jump');
    return (header ? header.getBoundingClientRect().height : 0) + (nav ? nav.getBoundingClientRect().height : 0) + 10;
  }

  function scrollCalcTarget(target) {
    syncHeaderHeight();
    syncJumpOffset();
    var y = target.getBoundingClientRect().top + window.pageYOffset - calcJumpGap();
    var max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: Math.max(0, Math.min(y, max)), behavior: reduce ? 'auto' : 'smooth' });
  }

  function bindCalcJumps() {
    if (window.__FK_JUMPS) return;
    window.__FK_JUMPS = true;
    document.addEventListener('click', function (ev) {
      var a = ev.target && ev.target.closest && ev.target.closest('.refs-page .calc-jump a');
      if (!a || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      var id = (a.getAttribute('href') || '').split('#').pop();
      var target = id && document.getElementById(id);
      if (!target) return;
      ev.preventDefault();
      ev.stopPropagation();
      if (history.replaceState) history.replaceState(null, '', '#' + id);
      scrollCalcTarget(target);
    }, true);
  }

  function ensureFieldCalcs() {
    var page = document.querySelector('.refs-page');
    if (!page) return;
    if (document.getElementById('watts')) {
      paintNacPtp();
      polishRefs(page);
      return;
    }
    var ohm = document.getElementById('ohm');
    var poe = document.getElementById('poe');
    if (!ohm || !poe) return;
    var watts = buildWatts();
    var day = buildDay();
    var retain = buildRetain();
    var loop = buildLoop();
    var gf = buildGf();
    ohm.after(watts);
    poe.after(day);
    var tail = document.getElementById('rs485') || document.getElementById('nac') || poe;
    tail.after(retain);
    retain.after(loop);
    loop.after(gf);
    fkJump('watts', 'Watts / VA');
    fkJump('poeday', 'Day / night');
    fkJump('retain', 'Disk');
    fkJump('loopft', 'Wire feet');
    fkJump('gfvolt', 'Ground fault');
    paintWatts();
    paintDay();
    paintRetain();
    paintLoop();
    paintGf();
    paintNacPtp();
    polishRefs(page);
  }

  function plainPortal() {
    if (pathOf() !== '/portal') return;
    document.querySelectorAll('p, li').forEach(function (p) {
      var t = p.textContent || '';
      if (t.indexOf('localStorage') >= 0 || t.indexOf('seeds three sample') >= 0) {
        if (p.dataset.fkPlain === 'store') return;
        p.dataset.fkPlain = 'store';
        p.textContent = 'Sample company docs are already here. What you add stays on this phone or this computer.';
      } else if (t.indexOf('Free / Pro switch') >= 0 || t.indexOf('switch in the header') >= 0) {
        if (p.dataset.fkPlain === 'plan') return;
        p.dataset.fkPlain = 'plan';
        p.textContent = 'The toolkit stays free. Pro, chosen on this page, adds your logo, company docs, crew seats, and letterhead.';
      }
    });
  }

  function refreshFieldMath(ev) {
    var t = ev && ev.target;
    if (!t || !t.closest) return;
    if (t.closest('#watts')) paintWatts();
    if (t.closest('#poeday')) paintDay();
    if (t.closest('#retain')) paintRetain();
    if (t.closest('#loopft')) paintLoop();
    if (t.closest('#gfvolt')) paintGf();
    if (t.closest('#nac')) paintNacPtp();
  }

  function fitHomeAboveTab() {
    if (!isLanding()) return;
    if (!(window.matchMedia && window.matchMedia('(max-width: 860px)').matches)) return;
    var row = document.querySelector('.fk-job-row');
    var tab = document.querySelector('.fk-tabbar');
    var page = document.querySelector('.start-page');
    if (!row || !tab || !page) return;
    var need = row.getBoundingClientRect().bottom - (tab.getBoundingClientRect().top - 12);
    if (need <= 0) return;
    page.classList.add('fk-home-tight');
  }

  /* ---------------- enhance cycle ---------------- */
  function enhance() {
    redirectDeadChecklist();
    syncHeaderHeight();
    ensureHeaderSearch();
    ensureFieldNav();
    ensureTabbar();
    markTabs();
    if (isLanding()) enhanceLanding();
    if (isLibrary()) enhanceHome();
    enhanceChecklist();
    var refs = document.querySelector('.refs-page');
    if (refs) ensurePrintLetterhead(refs, 'Field calculators');
    ensureFieldCalcs();
    plainPortal();
    fitHomeAboveTab();
    maybeRecordVisit();
    syncStars();
  }

  var raf = 0;
  function schedule() {
    var page = document.querySelector('.checklist-runner');
    if (page && !page.querySelector('.fk-filters')) enhanceChecklist();
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = 0; enhance(); });
  }

  /* ---------------- events ---------------- */
  document.addEventListener('click', function (ev) {
    if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    var a = ev.target && ev.target.closest && ev.target.closest('a.fk-link, a.fk-tile, a.fk-calc-chip, a.fk-hit, a.gd-tile, a.gd-back, a.fk-text-chip');
    if (a) {
      var href = a.getAttribute('href');
      if (href && href.charAt(0) === '/') go(href, ev);
      return;
    }
    if (ev.target.closest && ev.target.closest('.item-actions, a, button, input, select, textarea, label')) return;
    var row = ev.target.closest && ev.target.closest('.item-row');
    if (!row) return;
    var done = row.querySelector('.item-actions .chip');
    if (done) done.click();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && pal.open) { closePalette(); return; }
    if (e.key === '/' && !pal.open && !isTyping(e.target)) {
      e.preventDefault();
      openPalette();
    }
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      openPalette();
    }
  });

  function isTyping(t) {
    if (!t) return false;
    var tag = (t.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || t.isContentEditable;
  }

  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'library-search') enhanceHome();
    if (e.target && e.target.id === 'start-search') enhanceLanding();
  });

  window.addEventListener('popstate', function () { setTimeout(enhance, 0); });
  var _push = history.pushState;
  history.pushState = function () {
    var r = _push.apply(this, arguments);
    setTimeout(enhance, 0);
    return r;
  };

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', function () {
      var vv = window.visualViewport;
      document.body.classList.toggle('fk-kb', vv && (window.innerHeight - vv.height > 120));
    });
  }

  window.__LAWSONITE_FAV__ = {
    toggle: function (id) { toggleFav(id); },
    isFav: function (id) { return favIndex(id) >= 0; }
  };

  function boot() {
    if (!document.body) { setTimeout(boot, 30); return; }
    if (!window.__FK_FIELD_PASS) {
      window.__FK_FIELD_PASS = true;
      document.addEventListener('input', refreshFieldMath);
      document.addEventListener('change', refreshFieldMath);
      document.addEventListener('input', function (ev) {
        if (ev.target && ev.target.closest && ev.target.closest('.refs-page')) schedulePlainCalcs();
      });
      document.addEventListener('change', function (ev) {
        if (ev.target && ev.target.closest && ev.target.closest('.refs-page')) schedulePlainCalcs();
      });
      document.addEventListener('click', function (ev) {
        if (ev.target && ev.target.closest && ev.target.closest('.refs-page')) schedulePlainCalcs();
      });
      document.addEventListener('click', function (ev) {
        var b = ev.target && ev.target.closest && ev.target.closest('.checklist-runner .reset-quiet');
        if (!b || b.dataset.fkResetOk) return;
        ev.preventDefault();
        ev.stopPropagation();
        if (!window.confirm('Clear every mark on this checklist?')) return;
        b.dataset.fkResetOk = '1';
        b.click();
        delete b.dataset.fkResetOk;
      }, true);
    }
    enhance();
    var root = document.getElementById('root');
    if (root && window.MutationObserver) {
      new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          var t = muts[i].target;
          if (t && t.closest && t.closest('.fk-dash, .fk-tabbar, .fk-pal-scrim, .fav-root, .fk-filters, .fk-toc, .gd-root')) continue;
          schedule();
          return;
        }
      }).observe(root, { childList: true, subtree: true });
    }
    try {
      if (!localStorage.getItem(SEEN_KEY)) {
        localStorage.setItem(SEEN_KEY, '1');
      }
    } catch (e) {}
  }
  boot();
})();
