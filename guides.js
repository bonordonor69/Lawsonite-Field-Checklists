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
  var MAX_PINS = 24;
  function loadPack() {
    try {
      var v = JSON.parse(localStorage.getItem(PACK_KEY) || '{}');
      return { title: v.title || 'Job pack', ids: Array.isArray(v.ids) ? v.ids.slice() : [] };
    } catch (e) {
      return { title: 'Job pack', ids: [] };
    }
  }
  function savePack(pack) {
    try { localStorage.setItem(PACK_KEY, JSON.stringify(pack)); } catch (e) {}
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
    var origin = location.origin && location.origin !== 'null'
      ? location.origin
      : 'https://lawsonite.tomcatstudios.com';
    return origin + packHref(ids, title);
  }
  function packQrUrl(ids, title) {
    var full = packAbs(ids, title);
    if (full.length <= 220) return full;
    return packAbs(ids, '');
  }
  function shopBrand() {
    try {
      var pro = JSON.parse(localStorage.getItem('lawsonite-pro-v0') || '{}');
      var brand = JSON.parse(localStorage.getItem('lawsonite-company-brand-v0') || '{}');
      var shop = pro.plan === 'shop';
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
      var qr = qrBox(opts.qrUrl, opts.qrCap || 'Scan', 96);
      qr.classList.add('gd-qr-head');
      if (opts.qrPrintOnly) qr.classList.add('only-print');
      box.appendChild(qr);
      box.classList.add('gd-letterhead-with-qr');
    }
    return box;
  }
  function qrBox(url, cap, cssPx) {
    var wrap = el('div', 'gd-qr');
    cssPx = cssPx || 252;
    try {
      if (window.LAWSONITE_QR && window.LAWSONITE_QR.mount) {
        wrap.appendChild(window.LAWSONITE_QR.mount(url, cssPx));
      } else if (window.LAWSONITE_QR && window.LAWSONITE_QR.svg) {
        wrap.innerHTML = window.LAWSONITE_QR.svg(url, cssPx);
      } else {
        wrap.appendChild(el('p', 'gd-qr-fallback', url));
      }
    } catch (e) {
      wrap.appendChild(el('p', 'gd-qr-fallback', url));
    }
    wrap.appendChild(el('p', 'gd-qr-cap', cap || 'Scan for this job pack'));
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

  function mount(node) {
    root.innerHTML = '';
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
        var open = el('a', 'gd-chip fk-link', 'Open pack / QR');
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

  var FORMS_KEY = 'lawsonite-jobforms-v1';
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
  function loadForms() {
    try {
      var v = JSON.parse(localStorage.getItem(FORMS_KEY) || '{}');
      return {
        zones: Array.isArray(v.zones) ? v.zones : [],
        doors: Array.isArray(v.doors) ? v.doors : [],
        cameras: Array.isArray(v.cameras) ? v.cameras : []
      };
    } catch (e) {
      return { zones: [], doors: [], cameras: [] };
    }
  }
  function saveForms(f) {
    try { localStorage.setItem(FORMS_KEY, JSON.stringify(f)); } catch (e) {}
  }
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
    var pack = el('a', 'gd-chip fk-link', 'Job pack / QR');
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
      qrCap: pack.ids.length ? 'Job pack' : 'Open sheet',
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

  function renderPack() {
    var sp;
    try { sp = new URLSearchParams(location.search); } catch (e) { sp = new URLSearchParams(); }
    var ids = (sp.get('i') || '').split(',').filter(Boolean);
    var title = sp.get('t') || '';
    var local = loadPack();
    if (!ids.length) ids = local.ids.slice();
    if (!title) title = local.title || 'Job pack';
    if (ids.length && !(sp.get('i'))) {
      try { history.replaceState({}, '', packHref(ids, title)); } catch (e) {}
    }

    var page = el('div', 'page gd-page gd-pack');
    page.appendChild(backLink('/guides/manuals', 'Product cards'));
    var url = packQrUrl(ids, title);
    page.appendChild(printLetterhead(title, {
      qrUrl: url,
      qrCap: 'Job pack',
      qrPrintOnly: true
    }));

    var head = el('header', 'gd-hero');
    head.appendChild(el('p', 'gd-kicker', 'Job pack'));
    var titleInput = document.createElement('input');
    titleInput.className = 'gd-search gd-pack-title no-print';
    titleInput.value = title;
    titleInput.setAttribute('aria-label', 'Job pack name');
    titleInput.placeholder = 'Job name — Building A, 3rd floor…';
    head.appendChild(titleInput);
    head.appendChild(el('h1', 'only-print', title));
    head.appendChild(el('p', 'gd-lede no-print',
      'Pin cards on the manuals page, name the job, print the pack or a panel QR. Free prints get the Lawsonite mark. Pro adds your company logo.'));
    page.appendChild(head);

    var tools = el('div', 'gd-pack-tools no-print');
    var printBtn = el('button', 'gd-chip is-on', 'Print pack');
    printBtn.type = 'button';
    printBtn.addEventListener('click', function () {
      document.body.classList.remove('gd-sticker-print');
      window.print();
    });
    var stickerBtn = el('button', 'gd-chip', 'Print panel QR');
    stickerBtn.type = 'button';
    stickerBtn.addEventListener('click', function () {
      document.body.classList.add('gd-sticker-print');
      window.print();
    });
    window.addEventListener('afterprint', function () {
      document.body.classList.remove('gd-sticker-print');
    });
    var copyBtn = el('button', 'gd-chip', 'Copy link');
    copyBtn.type = 'button';
    copyBtn.addEventListener('click', function () {
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
    ident.appendChild(qrBox(url));
    var identText = el('div', 'gd-pack-ident-text');
    identText.appendChild(el('p', 'gd-pack-url', url));
    identText.appendChild(el('p', 'muted', 'Tape the QR on the can. Anyone who scans it gets this pack.'));
    ident.appendChild(identText);
    page.appendChild(ident);

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
        var fresh = qrBox(nextUrl, headQr ? 'Job pack' : 'Scan for this job pack', headQr ? 96 : 252);
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

    var list = el('div', 'gd-product-list gd-pack-cards');
    if (!ids.length) {
      list.appendChild(el('p', 'gd-empty', 'No cards pinned yet. Open Product cards and tap the star.'));
    } else {
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
        if (id === 'pack' || JOB_SHEETS[id]) route();
      };
      document.head.appendChild(qs);
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
