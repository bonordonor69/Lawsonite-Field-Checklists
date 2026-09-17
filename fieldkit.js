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
    { id: 'nac', label: 'NAC load', hint: 'Strobe current', href: '/refs#nac' }
  ];

  var CALLS = [
    { href: '/checklist/false-alarm-symptom-tree', title: 'Alarm went off', sub: 'No fire / no break-in in sight', icon: 'bell' },
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
    if (gid === 'manuals') {
      var trade = '';
      var q = '';
      try {
        var sp = new URLSearchParams(location.search);
        trade = sp.get('trade') || '';
        q = sp.get('q') || '';
      } catch (e) {}
      var title = 'Product cards';
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

    dash.appendChild(block('Field', 'Guides & manuals'));
    var grow = el('div', 'fk-chip-row');
    [
      { href: '/field', title: 'All tools' },
      { href: '/guides/meter', title: 'Meter' },
      { href: '/guides/pinouts', title: 'Pinouts' },
      { href: '/guides/manuals', title: 'Manuals' },
      { href: '/guides/readings', title: 'Voltages' }
    ].forEach(function (c) {
      var a = el('a', 'fk-text-chip fk-link', c.title);
      a.href = c.href;
      grow.appendChild(a);
    });
    dash.appendChild(grow);

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
    var kindLabel = { list: 'List', calc: 'Calc', guide: 'Guide', call: 'Call', doc: 'Manual' };
    var items = searchIndex(query).filter(function (r) {
      return r.kind !== 'step' && r.kind !== 'tip';
    }).slice(0, 12);
    var box = el('div', 'fk-hits');
    box.appendChild(el('p', 'fk-hits-meta', items.length ? (items.length + ' result' + (items.length === 1 ? '' : 's')) : 'No matches'));
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
    return state.recents.map(function (r) { return r.id; }).join(',') + '|' +
      state.favs.map(function (f) { return f.id; }).join(',');
  }

  function renderLandingDash(host) {
    var dash = el('div', 'fk-dash start-dash');

    dash.appendChild(block('Or pick a trade', 'Product cards'));
    var row = el('div', 'fk-chip-row start-trades');
    [
      { trade: 'fire', label: 'Fire' },
      { trade: 'access', label: 'Access' },
      { trade: 'cameras', label: 'Cameras' },
      { trade: 'intrusion', label: 'Intrusion' },
      { trade: 'power', label: 'Power' }
    ].forEach(function (t) {
      var a = el('a', 'fk-text-chip fk-link', t.label);
      a.href = '/guides/manuals?trade=' + t.trade;
      row.appendChild(a);
    });
    dash.appendChild(row);

    if (state.recents.length) {
      dash.appendChild(block('Recent', null));
      var rl = el('ul', 'fk-list');
      state.recents.forEach(function (r) {
        var li = el('li');
        var a = el('a', 'fk-link', r.title || r.id);
        a.href = r.href || ('/checklist/' + r.id);
        li.appendChild(a);
        if (r.ts) li.appendChild(el('span', 'fk-meta', fmtWhen(r.ts)));
        rl.appendChild(li);
      });
      dash.appendChild(rl);
    }

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

  /* ---------------- checklist page ---------------- */
  function enhanceChecklist() {
    var page = document.querySelector('.checklist-runner');
    if (!page) return;

    var m = location.pathname.match(/^\/checklist\/([a-z0-9-]+)/i);

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
      toolbar.appendChild(filters);
    } else if (toolbar) {
      var starBtn = toolbar.querySelector('.fk-star-list');
      if (starBtn && m) starBtn.textContent = favIndex(m[1]) >= 0 ? '★' : '☆';
    }

    var sections = page.querySelectorAll('.checklist-section');
    if (toolbar && !page.querySelector('.fk-toc') && sections.length > 1) {
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
      toolbar.after(toc);
    }

    page.querySelectorAll('.item-tip').forEach(function (p) {
      if (p.dataset.fk) return;
      p.dataset.fk = '1';
      p.textContent = (p.textContent || '').replace(/^Tip:\s*/i, '');
    });
  }

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

  function searchIndex(q) {
    if (!pal.index) buildIndex();
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
    var items = searchIndex(q || '');
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
      b.innerHTML = '<span class="fk-pal-kind">' + r.kind + '</span><span><strong></strong><span></span></span>';
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

  /* ---------------- enhance cycle ---------------- */
  function enhance() {
    ensureHeaderSearch();
    ensureFieldNav();
    ensureTabbar();
    markTabs();
    if (isLanding()) enhanceLanding();
    if (isLibrary()) enhanceHome();
    enhanceChecklist();
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
