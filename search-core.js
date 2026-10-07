/* Lawsonite forgiving search core (2026-10-07).
   One shared brain for every search box: landing "What are we working on?",
   Library, the header palette (fieldkit.js), the product-card filter (guides.js),
   and the React Library list. Offline, no network, no storage.
   - drops filler words and apostrophes ("won't", "doesnt", "on", "but"...)
   - maps tech shorthand both ways (DPS <-> door position switch, FACP <-> fire panel...)
   - scores by how many terms match (partial fallback, not all-or-nothing)
   - whole words beat word-starts beat substrings */
(function () {
  'use strict';

  var STOP = {};
  ('a an the and or but if on in at to of for from by with without into onto over under about as ' +
   'is are was were be been being am it its this that these those there here then than so too very just ' +
   'still also again my our your their his her we i you they me us them what whats which who whom whose ' +
   'when where why how will would should could can cant cannot wont dont doesnt didnt isnt arent wasnt ' +
   'werent hasnt havent hadnt shouldnt wouldnt couldnt does do did doing has have had having ' +
   'get gets got getting keep keeps kept please need needs want trying try tried after before ' +
   'during while until up down out off any some all each every not no nor only own same such like ' +
   'really happen happens happening anymore even ever')
    .split(' ').forEach(function (w) { if (w) STOP[w] = 1; });

  /* Not filler, but too vague to require. Dropped when stronger words exist. */
  var WEAK = {};
  ('panel panels system systems device devices unit units issue issues problem problems working work ' +
   'works broken bad help acting weird intermittent')
    .split(' ').forEach(function (w) { WEAK[w] = 1; });

  /* Concept groups. Any member typed in the query matches any member in the content. */
  var GROUPS = [
    ['door position switch', 'dps', 'door position', 'position switch', 'door contact', 'door contacts', 'door status', 'door switch', 'dsm'],
    ['request to exit', 'rex', 'exit button', 'push to exit', 'pte', 'egress button', 'motion rex'],
    ['facp', 'facu', 'fire panel', 'fire alarm panel', 'fire alarm control panel', 'fire alarm control unit', 'fire alarm', 'fire alarms', 'fa panel'],
    ['maglock', 'maglocks', 'mag lock', 'mag locks', 'magnetic lock', 'magnetic locks', 'electromagnetic lock', 'electromagnetic locks', 'em lock', 'electromagnetic'],
    ['nac', 'nacs', 'notification appliance circuit', 'notification appliance circuits', 'notification circuit', 'notification appliance', 'notification appliances'],
    ['poe', 'poe+', 'poe++', 'power over ethernet', '802 3af', '802 3at', '802 3bt'],
    ['nvr', 'nvrs', 'network video recorder', 'recorder', 'dvr', 'vms'],
    ['comm fail', 'comm failure', 'comm trouble', 'comms fail', 'comms failure', 'comms trouble', 'communication failure',
     'communication trouble', 'communication fail', 'communications failure', 'communicator', 'communicators',
     'failed to test', 'fail to test', 'failed to communicate', 'fail to communicate', 'ftc', 'no comms', 'no comm', 'comms', 'comm path'],
    ['no ip', 'no ip address', 'no address', 'no dhcp', 'dhcp', '169 254', 'apipa', 'link local', 'ip address', 'ip addresses', 'static ip', 'ip'],
    ['ground fault', 'ground faults', 'gf', 'earth fault', 'earth faults', 'ground fault sectional'],
    ['eol', 'eolr', 'end of line', 'end of line resistor', 'eol resistor'],
    ['card reader', 'card readers', 'reader', 'readers', 'prox reader', 'badge reader', 'credential reader', 'card', 'cards', 'badge', 'credential', 'prox'],
    ['beep', 'beeps', 'beeping', 'beeped', 'chirp', 'chirps', 'reads', 'card reads', 'card read', 'badge read', 'green led', 'granted', 'access granted'],
    ['unlock', 'unlocks', 'unlocked', 'unlatch', 'release', 'releases', 'released', 'open', 'opens', 'opened', 'drop', 'drops', 'free egress'],
    ['camera', 'cameras', 'cam', 'cams', 'ipc', 'ip camera', 'ip cameras'],
    ['offline', 'off line', 'no video', 'no picture', 'no image', 'not online', 'video loss'],
    ['strobe', 'strobes', 'horn strobe', 'horn strobes', 'visual appliance'],
    ['power supply', 'power supplies', 'psu', 'psus']
  ];

  function norm(s) {
    return ' ' + String(s == null ? '' : s).toLowerCase()
      .replace(/['\u2019\u2018`]/g, '')
      .replace(/[^a-z0-9+]+/g, ' ')
      .trim() + ' ';
  }
  function words(s) {
    var n = norm(s).trim();
    return n ? n.split(' ') : [];
  }

  var PHRASES = []; /* { w: [words], g: groupIndex } longest first */
  var GROUP_ALTS = GROUPS.map(function (g, gi) {
    var alts = [];
    g.forEach(function (m) {
      var ws = words(m);
      if (!ws.length) return;
      var a = ws.join(' ');
      if (alts.indexOf(a) < 0) alts.push(a);
      PHRASES.push({ w: ws, g: gi });
    });
    return alts;
  });
  PHRASES.sort(function (a, b) { return b.w.length - a.w.length; });

  function stems(w) {
    var out = [];
    if (w.length > 4 && /ies$/.test(w)) out.push(w.slice(0, -3) + 'y');
    else if (w.length > 3 && /[^s]s$/.test(w)) out.push(w.slice(0, -1));
    if (w.length > 5 && /ing$/.test(w)) out.push(w.slice(0, -3));
    if (w.length > 4 && /ed$/.test(w)) out.push(w.slice(0, -2));
    return out;
  }

  /* Query -> terms. Each term: { alts: [...], concept: bool, label } */
  function terms(q) {
    var ws = words(q);
    var out = [];
    var seenG = {};
    var i = 0;
    while (i < ws.length) {
      var hit = null;
      for (var p = 0; p < PHRASES.length; p++) {
        var ph = PHRASES[p];
        if (i + ph.w.length > ws.length) continue;
        var ok = true;
        for (var k = 0; k < ph.w.length; k++) {
          var qw = ws[i + k];
          var pw = ph.w[k];
          if (qw !== pw && !(k === ph.w.length - 1 && qw === pw + 's')) { ok = false; break; }
        }
        if (ok) { hit = ph; break; }
      }
      if (hit) {
        if (!seenG[hit.g]) {
          seenG[hit.g] = 1;
          out.push({ alts: GROUP_ALTS[hit.g], concept: true, label: hit.w.join(' ') });
        }
        i += hit.w.length;
        continue;
      }
      out.push({ alts: [ws[i]].concat(stems(ws[i])), concept: false, label: ws[i], word: ws[i] });
      i++;
    }
    var strong = out.filter(function (t) { return t.concept || (!STOP[t.word] && !WEAK[t.word]); });
    if (strong.length) return strong;
    var noStop = out.filter(function (t) { return t.concept || !STOP[t.word]; });
    return noStop.length ? noStop : out;
  }

  /* 3 whole word/phrase, 2 word-start, 1 substring, 0 none. h must be norm()'d. */
  function altQuality(h, alt, concept) {
    if (h.indexOf(' ' + alt + ' ') >= 0) return 3;
    if (concept) return 0;
    if (alt.length >= 3 && h.indexOf(' ' + alt) >= 0) return 2;
    if (alt.length >= 5 && h.indexOf(alt) >= 0) return 1;
    return 0;
  }
  function termQuality(h, t) {
    var best = 0;
    for (var i = 0; i < t.alts.length && best < 3; i++) {
      var q = altQuality(h, t.alts[i], t.concept);
      if (i > 0 && !t.concept && q > 2) q = 2.5; /* stem match, a hair under exact */
      if (q > best) best = q;
    }
    return best;
  }

  /* Score a normalized hay (+ optional normalized title). */
  function scoreText(nh, nt, ts) {
    var matched = 0, qual = 0, inTitle = 0;
    for (var i = 0; i < ts.length; i++) {
      var q = termQuality(nh, ts[i]);
      if (!q && nt) q = termQuality(nt, ts[i]);
      if (q) {
        matched++;
        qual += q;
        if (nt && termQuality(nt, ts[i]) >= 2) inTitle++;
      }
    }
    return { matched: matched, qual: qual, inTitle: inTitle, all: matched === ts.length && ts.length > 0 };
  }

  function minMatch(n) {
    if (n <= 2) return 1;
    return Math.ceil(n / 2);
  }

  var KIND_BOOST = { call: 46, list: 44, guide: 40, calc: 30, doc: 0, tip: -12, step: -16 };

  /* Rank rows {kind,title,hay}. Returns rows sorted; out.partial = true when nothing matched every term. */
  function rank(rows, q, limit) {
    var ts = terms(q);
    var res = [];
    if (!ts.length) { res.partial = false; return res; }
    var need = minMatch(ts.length);
    var anyAll = false;
    var hasDigitTerm = ts.some(function (t) { return !t.concept && /\d/.test(t.label); });
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (r._lwH === undefined) {
        r._lwH = norm(r.hay || '');
        r._lwT = norm(r.title || '');
      }
      var s = scoreText(r._lwH, r._lwT, ts);
      if (s.matched < need) continue;
      if (s.all) anyAll = true;
      var sc = s.matched * 1000 + s.qual * 6 + s.inTitle * 30 + (s.inTitle === ts.length ? 50 : 0) + (KIND_BOOST[r.kind] || 0);
      if (hasDigitTerm && r.kind === 'doc' && s.inTitle) sc += 90; /* model-number lookups land on the product card */
      else if (r.kind === 'doc') sc -= 600; /* symptom searches: at equal term hits, calls / checklists / guides / calcs rank above product cards; a card that hits more terms (e.g. 'zone list') still wins */
      else if (r.kind === 'tip' || r.kind === 'step') sc -= 1500;
      res.push({ r: r, sc: sc });
    }
    res.sort(function (a, b) { return b.sc - a.sc; });
    var out = res.map(function (x) { return x.r; });
    if (limit) out = out.slice(0, limit);
    out.partial = !anyAll && out.length > 0;
    return out;
  }

  /* Filter semantics (guides.js product filter): every term must appear (substring), stopwords ignored, synonyms OR'd. */
  function matchAll(hay, q) {
    var ts = terms(q);
    if (!ts.length) return true;
    var h = norm(hay);
    for (var i = 0; i < ts.length; i++) {
      var t = ts[i], ok = false;
      for (var k = 0; k < t.alts.length && !ok; k++) {
        var a = t.alts[k];
        ok = t.concept ? h.indexOf(' ' + a + ' ') >= 0 : h.indexOf(a) >= 0;
      }
      if (!ok) return false;
    }
    return true;
  }

  /* React Library list helpers: tokens are "alt|alt|alt" strings. */
  function reactTokens(q) {
    return terms(q).map(function (t) { return (t.concept ? '=' : '') + t.alts.join('|'); });
  }
  function reactFieldScore(fields, tok, base) {
    var concept = tok.charAt(0) === '=';
    if (concept) tok = tok.slice(1);
    var alts = tok.split('|');
    var best = null;
    for (var i = 0; i < alts.length; i++) {
      var a = alts[i];
      var s;
      if (concept) {
        var w = { title: 12, summary: 8, category: 4, tags: 5, body: 1 };
        s = 0;
        for (var f in w) if (fields[f] && norm(fields[f]).indexOf(' ' + a + ' ') >= 0) s += w[f];
        if (!s) s = null;
      } else {
        s = base(fields, a);
      }
      if (s != null && (best == null || s > best)) best = s;
    }
    return best;
  }

  window.__LAWSONITE_SEARCH__ = {
    version: '2026-10-07',
    norm: norm,
    terms: terms,
    scoreText: scoreText,
    rank: rank,
    matchAll: matchAll,
    minMatch: minMatch,
    reactTokens: reactTokens,
    reactFieldScore: reactFieldScore
  };
})();
