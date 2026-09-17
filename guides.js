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
    return [p.title, p.brand, p.use, p.look, (p.gotchas || []).join(' '), (p.tags || []).join(' ')].join(' ');
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

  function mount(node) {
    root.innerHTML = '';
    root.appendChild(node);
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
      user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3"/><path d="M5 19a7 7 0 0 1 14 0"/></svg>'
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
    var q = el('input', 'gd-search');
    q.type = 'search';
    q.placeholder = 'Find a product — Vista 128, HID, Altronix, Neo, 6160…';
    var pre = '';
    try { pre = new URLSearchParams(location.search).get('q') || ''; } catch (e) { pre = ''; }
    q.value = pre;
    wrap.appendChild(q);
    var meta = el('p', 'gd-meta');
    wrap.appendChild(meta);
    var host = el('div', 'gd-product-list');
    wrap.appendChild(host);
    function paint(f) {
      host.textContent = '';
      var list = (sec.items && sec.items.length) ? sec.items : allProducts();
      var shown = 0;
      list.forEach(function (p) {
        if (f && !hayMatch(productHay(p), f)) return;
        shown++;
        var card = el('article', 'gd-product');
        var top = el('div', 'gd-product-top');
        if (p.brand) top.appendChild(el('span', 'gd-tag', p.brand));
        top.appendChild(el('h3', null, p.title));
        card.appendChild(top);
        if (p.use) card.appendChild(el('p', 'gd-product-use', p.use));
        if (p.look || (p.gotchas && p.gotchas.length)) {
          var d = document.createElement('details');
          d.className = 'gd-more';
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
        if (p.href) {
          var a = el('a', 'gd-link');
          a.href = p.href;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          var left = el('span');
          left.appendChild(el('strong', null, p.linkLabel || 'Manufacturer docs'));
          if (p.linkSub) left.appendChild(el('em', null, p.linkSub));
          a.appendChild(left);
          a.appendChild(el('span', 'gd-ext', 'Official'));
          card.appendChild(a);
        }
        host.appendChild(card);
      });
      meta.textContent = shown ? (shown + ' of ' + list.length) : '';
      if (!host.childNodes.length) host.appendChild(el('p', 'gd-empty', 'No product matched. Try 128BPT, Neo, HID, or Altronix.'));
    }
    q.addEventListener('input', function () { paint(q.value); });
    paint(pre);
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
      mount(renderGuide(id));
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
    G = window.__LAWSONITE_GUIDES__ || G;
    if (!G) { setTimeout(boot, 40); return; }
    route();
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
})();
