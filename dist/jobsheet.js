/*
 * Lawsonite — Job Sheet capture (offline-first)
 * Standalone page module. Persists job cards in IndexedDB; prints via the
 * Company Portal letterhead CSS already loaded by index.html.
 * Requires window.__LAWSONITE__ (exposed by the app bundle).
 */
(function () {
  'use strict';

  var L = window.__LAWSONITE__;

  var DB_NAME = 'lawsonite-jobsheets';
  var DB_VERSION = 1;
  var STORE = 'jobsheets';

  /* ---------------- IndexedDB ---------------- */

  function openDb() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          var s = db.createObjectStore(STORE, { keyPath: 'id' });
          s.createIndex('createdAt', 'createdAt');
          s.createIndex('checklistId', 'checklistId');
        }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function tx(db, mode, fn) {
    return new Promise(function (resolve, reject) {
      var t = db.transaction(STORE, mode);
      var out = fn(t.objectStore(STORE));
      t.oncomplete = function () { resolve(out && out.result !== undefined ? out.result : undefined); };
      t.onerror = function () { reject(t.error); };
    });
  }

  function dbPut(db, rec) { return tx(db, 'readwrite', function (s) { return s.put(rec); }); }
  function dbAll(db) {
    return new Promise(function (resolve, reject) {
      var t = db.transaction(STORE, 'readonly');
      var req = t.objectStore(STORE).getAll();
      req.onsuccess = function () { resolve(req.result || []); };
      req.onerror = function () { reject(req.error); };
    });
  }
  function dbGet(db, id) {
    return new Promise(function (resolve, reject) {
      var t = db.transaction(STORE, 'readonly');
      var req = t.objectStore(STORE).get(id);
      req.onsuccess = function () { resolve(req.result || null); };
      req.onerror = function () { reject(req.error); };
    });
  }
  function dbDel(db, id) { return tx(db, 'readwrite', function (s) { return s['delete'](id); }); }

  /* ---------------- helpers ---------------- */

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls && typeof cls === 'string') e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function fmtDateTime(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return iso || '';
    var pad = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
      ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function getParam(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function findChecklist(slug) {
    L = window.__LAWSONITE__ || L;
    var cl = (L && L.checklists) || [];
    for (var i = 0; i < cl.length; i++) if (cl[i].id === slug) return cl[i];
    return null;
  }

  function computeStatuses(cl) {
    // current saved progress for this checklist: {itemId: 'checked'|'na'|undefined}
    var stored = L.progressFor(cl.id);
    return (stored && stored.statuses) || {};
  }

  /* ---------------- item status (also usable standalone) ---------------- */

  var STATUS_LABEL = { checked: 'Done', na: 'N/A', unchecked: '' };

  function buildItems(cl, statuses, editable, onChange) {
    var wrap = el('div', 'js-items');
    cl.sections.forEach(function (sec, si) {
      var secEl = el('section', 'js-section');
      var h = el('h3', 'js-section-title', sec.title);
      secEl.appendChild(h);
      if (sec.summary) secEl.appendChild(el('p', 'js-section-summary', sec.summary));
      (sec.items || []).forEach(function (it, ii) {
        var row = el('div', 'js-item');
        var mark = el('span', 'js-mark js-mark-' + (statuses[it.id] || 'unchecked'));
        mark.textContent = statuses[it.id] === 'checked' ? '✓' : (statuses[it.id] === 'na' ? '—' : '□');
        row.appendChild(mark);
        var body = el('div', 'js-item-body');
        body.appendChild(el('span', 'js-item-text', it.text));
        if (it.tip) body.appendChild(el('span', 'js-item-tip', 'Tip: ' + it.tip));
        row.appendChild(body);
        if (editable) {
          var ctl = el('div', 'js-item-ctl');
          var bDone = el('button', 'btn js-mini' + (statuses[it.id] === 'checked' ? ' js-mini-on' : ''), 'Done');
          var bNa = el('button', 'btn js-mini' + (statuses[it.id] === 'na' ? ' js-mini-on' : ''), 'N/A');
          bDone.type = 'button'; bNa.type = 'button';
          bDone.addEventListener('click', function () {
            statuses[it.id] = statuses[it.id] === 'checked' ? 'unchecked' : 'checked';
            onChange();
            rerender();
          });
          bNa.addEventListener('click', function () {
            statuses[it.id] = statuses[it.id] === 'na' ? 'unchecked' : 'na';
            onChange();
            rerender();
          });
          ctl.appendChild(bDone); ctl.appendChild(bNa);
          row.appendChild(ctl);
        }
        secEl.appendChild(row);
      });
      wrap.appendChild(secEl);
    });
    function rerender() {
      var p = wrap.parentNode;
      if (p) { p.replaceChild(buildItems(cl, statuses, editable, onChange), wrap); }
    }
    return wrap;
  }

  /* ---------------- record creation ---------------- */

  function makeRecord(cl) {
    return {
      id: 'js-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8),
      checklistId: cl.id,
      checklistTitle: cl.title,
      site: '',
      tech: '',
      startedAt: new Date().toISOString(),
      savedAt: null,
      exportedAt: null,
      notes: '',
      statuses: computeStatuses(cl),
      syncState: 'local'
    };
  }

  /* ---------------- router ---------------- */

  var root = null;

  function mount(node) {
    root.innerHTML = '';
    root.appendChild(node);
    window.scrollTo(0, 0);
  }

  function route() {
    var path = location.pathname.replace(/\/+$/, '') || '/';
    var app = document.getElementById('root');
    if (path === '/jobsheets' || path === '/jobsheets/new' || path.indexOf('/jobsheets/') === 0) {
      document.body.classList.add('fk-jobsheets');
      if (!root) {
        root = el('div', 'js-root');
        document.body.appendChild(root);
      }
      root.style.display = '';
      if (path === '/jobsheets') renderList();
      else renderForm();
    } else {
      document.body.classList.remove('fk-jobsheets');
      if (root) root.style.display = 'none';
    }
  }

  /* ---------------- capture form ---------------- */

  function renderForm() {
    var slug = getParam('checklist');
    var cl = slug ? findChecklist(slug) : null;
    if (!cl) {
      var pick = el('div', 'page js-page');
      var card = el('div', 'card js-card-pad');
      card.appendChild(el('h1', null, 'New job sheet'));
      card.appendChild(el('p', 'lede', 'Which checklist is this job running?'));
      var list = el('div', 'js-picklist');
      ((L && L.checklists) || []).forEach(function (c) {
        var a = el('a', 'js-pick-item');
        a.href = '/jobsheets/new?checklist=' + encodeURIComponent(c.id);
        a.appendChild(el('span', 'js-pick-title', c.title));
        var catMap = { cameras: 'Cameras', access: 'Access', fire: 'Fire', network: 'Network', troubleshoot: 'Troubleshoot' };
        var cat = L && L.categoryBySlug ? L.categoryBySlug[c.category] : null;
        a.appendChild(el('span', 'chip', (cat && cat.label) || catMap[c.category] || c.category));
        list.appendChild(a);
      });
      card.appendChild(list);
      var back = el('a', 'btn ghost js-backlink', 'Back to job sheets');
      back.href = '/jobsheets';
      card.appendChild(back);
      pick.appendChild(card);
      mount(pick);
      return;
    }

    var rec = makeRecord(cl);
    var statuses = rec.statuses;
    var page = el('div', 'page js-page');

    // header
    var head = el('header', 'page-header');
    var crumbs = el('nav', 'crumbs no-print');
    var bc = el('a', null, 'Job Sheets'); bc.href = '/jobsheets';
    crumbs.appendChild(bc);
    var sep = el('span', null, '/'); sep.setAttribute('aria-hidden', 'true');
    crumbs.appendChild(sep);
    crumbs.appendChild(el('span', null, 'New job sheet'));
    head.appendChild(crumbs);
    head.appendChild(el('p', 'eyebrow', 'Job sheet — ' + cl.title));
    head.appendChild(el('h1', null, 'Capture this checklist run'));
    head.appendChild(el('p', 'lede', 'Job details, item statuses, and notes are saved on this device — no network needed.'));
    page.appendChild(head);

    // form card
    var formCard = el('div', 'card js-card-pad');
    var grid = el('div', 'js-form-grid');

    function field(labelText, input) {
      var w = el('label', 'js-field');
      w.appendChild(el('span', 'js-label', labelText));
      input.required = labelText.indexOf('*') > -1;
      w.appendChild(input);
      return w;
    }

    var inSite = document.createElement('input');
    inSite.className = 'js-input'; inSite.type = 'text';
    inSite.placeholder = 'Site / account name';
    inSite.autocomplete = 'organization';

    var inTech = document.createElement('input');
    inTech.className = 'js-input'; inTech.type = 'text';
    inTech.placeholder = 'e.g. JT-104';
    inTech.autocomplete = 'off';

    var inDate = document.createElement('input');
    inDate.className = 'js-input'; inDate.type = 'datetime-local';
    var now = new Date();
    var pad = function (n) { return String(n).padStart(2, '0'); };
    inDate.value = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) +
      'T' + pad(now.getHours()) + ':' + pad(now.getMinutes());

    grid.appendChild(field('Site / account *', inSite));
    grid.appendChild(field('Tech (initials or number)', inTech));
    grid.appendChild(field('Date & time (device local)', inDate));
    formCard.appendChild(grid);

    // meta strip
    var meta = el('p', 'js-meta');
    formCard.appendChild(meta);

    // items editor
    var itemsWrap = el('div', 'js-items-wrap');
    formCard.appendChild(itemsWrap);

    // notes
    var notes = document.createElement('textarea');
    notes.className = 'js-input js-notes';
    notes.rows = 4;
    notes.placeholder = 'Findings, parts used, follow-ups…';
    formCard.appendChild(field('Notes', notes));

    // progress meta updater
    function updateMeta() {
      var ids = [];
      cl.sections.forEach(function (s) { (s.items || []).forEach(function (it) { ids.push(it.id); }); });
      var p = L.computeProgress(statuses, ids);
      meta.textContent = p.done + ' of ' + p.total + ' items marked (' + p.checked + ' done, ' + p.na + ' N/A)';
    }

    function rerenderItems() {
      var fresh = buildItems(cl, statuses, true, updateMeta);
      itemsWrap.innerHTML = '';
      itemsWrap.appendChild(fresh);
    }

    updateMeta();
    rerenderItems();

    // actions
    var actions = el('div', 'js-form-actions no-print');
    var bSave = el('button', 'btn', 'Save job sheet');
    bSave.type = 'button';
    var bCancel = el('a', 'btn ghost', 'Cancel');
    bCancel.href = '/jobsheets';
    actions.appendChild(bSave);
    actions.appendChild(bCancel);
    formCard.appendChild(actions);

    var msg = el('p', 'js-msg', '');
    formCard.appendChild(msg);

    bSave.addEventListener('click', function () {
      var site = inSite.value.trim();
      if (!site) { msg.textContent = 'Site / account name is required.'; msg.className = 'js-msg js-msg-err'; inSite.focus(); return; }
      openDb().then(function (db) {
        rec.site = site;
        rec.tech = inTech.value.trim();
        rec.notes = notes.value;
        rec.statuses = statuses;
        rec.startedAt = inDate.value ? new Date(inDate.value).toISOString() : rec.startedAt;
        rec.savedAt = new Date().toISOString();
        rec.syncState = 'local';
        return dbPut(db, rec).then(function () {
          location.href = '/jobsheets';
        });
      }).catch(function (e) {
        console.error(e);
        msg.textContent = 'Could not save: ' + (e && e.message ? e.message : e);
        msg.className = 'js-msg js-msg-err';
      });
    });

    page.appendChild(formCard);
    mount(page);
  }

  /* ---------------- saved list ---------------- */

  function renderList() {
    openDb().then(dbAll).then(function (recs) {
      recs.sort(function (a, b) { return (b.savedAt || '').localeCompare(a.savedAt || ''); });
      var page = el('div', 'page js-page');
      var head = el('header', 'page-header');
      head.appendChild(el('p', 'eyebrow', 'Job records'));
      head.appendChild(el('h1', null, 'Job sheets'));
      head.appendChild(el('p', 'lede', 'Saved on this device. Open, print as a branded PDF, or delete.'));
      page.appendChild(head);

      var toolbar = el('div', 'js-list-toolbar no-print');
      var bNew = el('a', 'btn', 'New job sheet');
      bNew.href = '/jobsheets/new';
      toolbar.appendChild(bNew);
      page.appendChild(toolbar);

      if (!recs.length) {
        var empty = el('div', 'card js-card-pad js-empty');
        empty.appendChild(el('h2', null, 'No job sheets yet'));
        empty.appendChild(el('p', null, 'Run any checklist, then tap “Job sheet” in the toolbar to capture the run as a timestamped job record.'));
        page.appendChild(empty);
        mount(page);
        return;
      }

      var grid = el('div', 'js-list');
      recs.forEach(function (r) {
        var card = el('div', 'card js-jobcard');
        var top = el('div', 'js-jobcard-top');
        var title = el('h2', 'js-jobcard-title', r.site || '(untitled site)');
        top.appendChild(title);
        if (r.syncState === 'local') top.appendChild(el('span', 'chip js-chip-local', 'On device'));
        card.appendChild(top);
        card.appendChild(el('p', 'js-jobcard-meta',
          (r.checklistTitle || r.checklistId) + ' · ' + fmtDateTime(r.startedAt) +
          (r.tech ? ' · Tech ' + r.tech : '')));
        var ids = [];
        var cl = findChecklist(r.checklistId);
        if (cl) cl.sections.forEach(function (s) { (s.items || []).forEach(function (it) { ids.push(it.id); }); });
        var p = L.computeProgress(r.statuses || {}, ids);
        card.appendChild(el('p', 'js-jobcard-progress', p.done + ' / ' + p.total + ' items marked'));
        var acts = el('div', 'js-jobcard-actions no-print');
        var bOpen = el('button', 'btn ghost', 'Open'); bOpen.type = 'button';
        bOpen.addEventListener('click', function () { renderPrint(r.id); });
        var bPrint = el('button', 'btn', 'Print / PDF'); bPrint.type = 'button';
        bPrint.addEventListener('click', function () {
          openDb().then(function (db) {
            return dbGet(db, r.id).then(function (full) {
              var rec = full || r;
              renderPrintView(rec, false);
              rec.exportedAt = new Date().toISOString();
              return dbPut(db, rec).then(function () { window.print(); });
            });
          }).catch(console.error);
        });
        var bDel = el('button', 'btn reset-quiet', 'Delete'); bDel.type = 'button';
        bDel.addEventListener('click', function () {
          if (!window.confirm('Delete job sheet for “' + (r.site || 'untitled site') + '”? This cannot be undone.')) return;
          openDb().then(function (db) { return dbDel(db, r.id); }).then(renderList).catch(console.error);
        });
        acts.appendChild(bOpen); acts.appendChild(bPrint); acts.appendChild(bDel);
        card.appendChild(acts);
        grid.appendChild(card);
      });
      page.appendChild(grid);
      mount(page);
    }).catch(function (e) {
      console.error(e);
      var p = el('div', 'page js-page');
      p.appendChild(el('p', 'js-msg js-msg-err', 'Could not open job sheets: ' + (e && e.message ? e.message : e)));
      mount(p);
    });
  }

  function renderPrint(id) {
    openDb().then(function (db) { return dbGet(db, id); }).then(function (rec) {
      if (rec) renderPrintView(rec, true);
    }).catch(console.error);
  }

  /* ---------------- print view (branded, letterhead) ---------------- */

  function renderPrintView(rec, interactive) {
    var cl = findChecklist(rec.checklistId) || { title: rec.checklistTitle, sections: [] };
    var page = el('div', 'page js-page js-printpage');

    // letterhead mirrors component Lr in the bundle (print-letterhead classes)
    var brand = readBrand();
    var lh = el('div', 'print-letterhead only-print');
    var row = el('div', 'print-letterhead-row');
    if (brand.logoDataUrl) {
      var img = el('img', 'print-letterhead-logo'); img.src = brand.logoDataUrl; img.alt = '';
      row.appendChild(img);
    }
    var txt = el('div', 'print-letterhead-text');
    txt.appendChild(el('p', 'print-letterhead-company', brand.configured ? (brand.companyName || 'Company') : 'Your company'));
    if (brand.phone || brand.email) {
      txt.appendChild(el('p', 'print-letterhead-contact', [brand.phone, brand.email].filter(Boolean).join(' · ')));
    }
    txt.appendChild(el('p', 'print-letterhead-doc', 'Job sheet — ' + cl.title));
    row.appendChild(txt);
    lh.appendChild(row);
    lh.appendChild(el('p', 'print-letterhead-powered', 'Lawsonite · by Tomcat Studios'));
    page.appendChild(lh);

    // title (screen) — letterhead covers print
    var head = el('header', 'page-header');
    var crumbs = el('nav', 'crumbs no-print');
    var bc = el('a', null, 'Job Sheets'); bc.href = '/jobsheets';
    crumbs.appendChild(bc);
    var sep2 = el('span', null, '/'); sep2.setAttribute('aria-hidden', 'true');
    crumbs.appendChild(sep2);
    crumbs.appendChild(el('span', null, rec.site || 'Job sheet'));
    head.appendChild(crumbs);
    head.appendChild(el('h1', null, rec.site || '(untitled site)'));
    head.appendChild(el('p', 'lede', cl.title + ' · ' + fmtDateTime(rec.startedAt)));
    page.appendChild(head);

    // job facts block (prints)
    var facts = el('div', 'card js-card-pad js-facts');
    facts.appendChild(el('h2', 'js-facts-title', 'Job details'));
    var dl = el('dl', 'js-facts-grid');
    function fact(k, v) {
      dl.appendChild(el('dt', null, k));
      dl.appendChild(el('dd', null, v || '—'));
    }
    fact('Site / account', rec.site);
    fact('Tech', rec.tech);
    fact('Date & time', fmtDateTime(rec.startedAt));
    fact('Checklist', cl.title);
    fact('Record saved', fmtDateTime(rec.savedAt));
    fact('Record ID', rec.id);
    facts.appendChild(dl);
    page.appendChild(facts);

    // items
    var ids = [];
    cl.sections.forEach(function (s) { (s.items || []).forEach(function (it) { ids.push(it.id); }); });
    var p = L.computeProgress(rec.statuses || {}, ids);
    var sum = el('p', 'js-sum', p.checked + ' done · ' + p.na + ' N/A · ' + (p.total - p.done) + ' unmarked, of ' + p.total + ' items');
    page.appendChild(sum);
    page.appendChild(buildItems(cl, rec.statuses || {}, false, null));

    // notes
    if (rec.notes && rec.notes.trim()) {
      var nc = el('div', 'card js-card-pad');
      nc.appendChild(el('h2', 'js-facts-title', 'Tech notes'));
      var pre = el('p', 'js-notes-view');
      pre.textContent = rec.notes;
      nc.appendChild(pre);
      page.appendChild(nc);
    }

    // signature block
    var sig = el('div', 'js-signatures');
    sig.appendChild(el('div', 'js-sig', [el('div', 'js-sig-line'), el('div', 'js-sig-label', 'Tech signature / date')]));
    sig.appendChild(el('div', 'js-sig', [el('div', 'js-sig-line'), el('div', 'js-sig-label', 'Customer signature / date')]));
    page.appendChild(sig);

    // footer (screen)
    var f = el('p', 'footer-brand no-print', 'Generated by Lawsonite — Company Portal. Educational / shop aide only — verify with site rules, manufacturer data, and the AHJ.');
    page.appendChild(f);

    // actions
    if (interactive) {
      var acts = el('div', 'js-form-actions no-print');
      var bBack = el('a', 'btn ghost', 'Back to job sheets'); bBack.href = '/jobsheets';
      var bPrint = el('button', 'btn', 'Print / PDF'); bPrint.type = 'button';
      bPrint.addEventListener('click', function () {
        openDb().then(function (db) {
          rec.exportedAt = new Date().toISOString();
          return dbPut(db, rec);
        }).then(function () { window.print(); }).catch(console.error);
      });
      acts.appendChild(bBack);
      acts.appendChild(bPrint);
      page.insertBefore(acts, page.firstChild.nextSibling);
    }

    mount(page);
    window.scrollTo(0, 0);
  }

  function readBrand() {
    try {
      var raw = localStorage.getItem('lawsonite-company-brand-v0');
      if (!raw) return { companyName: '', logoDataUrl: '', phone: '', email: '', configured: false };
      var b = JSON.parse(raw);
      return {
        companyName: String(b.companyName || ''),
        logoDataUrl: String(b.logoDataUrl || ''),
        phone: String(b.phone || ''),
        email: String(b.email || ''),
        configured: !!(b.companyName || b.logoDataUrl || b.phone || b.email)
      };
    } catch (e) { return { companyName: '', logoDataUrl: '', phone: '', email: '', configured: false }; }
  }

  /* ---------------- boot ---------------- */

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
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href) return;
    if (href.charAt(0) === '/' && href.indexOf('/jobsheets') === 0) {
      ev.preventDefault();
      history.pushState({}, '', href);
      route();
    }
  });
  document.addEventListener('click', function (ev) {
    if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    var path = location.pathname.replace(/\/+$/, '') || '/';
    if (path.indexOf('/jobsheets') !== 0) return;
    var a = ev.target && ev.target.closest && ev.target.closest('a');
    if (!a || a.target === '_blank') return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) !== '/') return;
    var dest = href.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
    if (dest.indexOf('/jobsheets') === 0) return;
    ev.preventDefault();
    ev.stopPropagation();
    location.assign(href);
  }, true);

  function boot() {
    if (!document.body) { setTimeout(boot, 30); return; }
    L = window.__LAWSONITE__ || L;
    if (!L) { setTimeout(boot, 50); return; }
    route();
  }
  boot();

  // public API used by the in-app button
  window.__LAWSONITE_JOBSHEET__ = {
    startFromChecklist: function (checklistId) {
      // capture current run, then go to the form with that checklist preselected
      try {
        var rec = findChecklist(checklistId);
        if (!rec) throw new Error('Unknown checklist: ' + checklistId);
        history.pushState({}, '', '/jobsheets/new?checklist=' + encodeURIComponent(checklistId));
        route();
      } catch (e) { console.error(e); }
    }
  };
})();
