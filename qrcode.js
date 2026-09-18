/* Compact QR (byte mode, ECC L, versions 2–10). Offline panel stickers. */
(function (root) {
  'use strict';
  var EXP = new Array(512);
  var LOG = new Array(256);
  (function () {
    var x = 1;
    for (var i = 0; i < 255; i++) {
      EXP[i] = x;
      LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  })();
  function mul(a, b) {
    if (!a || !b) return 0;
    return EXP[LOG[a] + LOG[b]];
  }

  var DATA_L = [0, 19, 34, 55, 80, 108, 136, 156, 194, 232, 274];
  var EC_L = [0, 7, 10, 15, 20, 26, 36, 40, 48, 60, 72];
  var BLOCKS_L = [0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2];
  var REM_BITS = [0, 0, 7, 7, 7, 7, 7, 0, 0, 0, 0];
  var ALIGN = {
    2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34],
    7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50]
  };
  var VER_INFO = { 7: 0x07c94, 8: 0x085bc, 9: 0x09a4d, 10: 0x0a4d3 };

  function rsGen(n) {
    var g = [1];
    for (var i = 0; i < n; i++) {
      var next = new Array(g.length + 1);
      var j;
      for (j = 0; j < next.length; j++) next[j] = 0;
      for (j = 0; j < g.length; j++) {
        next[j] ^= mul(g[j], EXP[i]);
        next[j + 1] ^= g[j];
      }
      g = next;
    }
    return g;
  }
  function rsEncode(data, n) {
    var g = rsGen(n);
    var buf = data.slice();
    var i, j;
    for (i = 0; i < n; i++) buf.push(0);
    for (i = 0; i < data.length; i++) {
      var coef = buf[i];
      if (!coef) continue;
      for (j = 0; j < g.length; j++) buf[i + j] ^= mul(g[j], coef);
    }
    return buf.slice(data.length);
  }

  function bitsToBytes(bits) {
    var out = [];
    for (var i = 0; i < bits.length; i += 8) {
      var b = 0;
      for (var j = 0; j < 8; j++) b = (b << 1) | (bits[i + j] || 0);
      out.push(b);
    }
    return out;
  }

  function encode(text, version) {
    var bytes = [];
    for (var i = 0; i < text.length; i++) bytes.push(text.charCodeAt(i) & 255);
    var cap = DATA_L[version];
    var bits = [];
    function push(val, n) {
      for (var i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1);
    }
    push(4, 4);
    push(bytes.length, version >= 10 ? 16 : 8);
    for (i = 0; i < bytes.length; i++) push(bytes[i], 8);
    var maxBits = cap * 8;
    var pad = Math.min(4, maxBits - bits.length);
    for (i = 0; i < pad; i++) bits.push(0);
    while (bits.length % 8) bits.push(0);
    var data = bitsToBytes(bits);
    var padBytes = [0xec, 0x11];
    var p = 0;
    while (data.length < cap) data.push(padBytes[(p++) % 2]);
    data = data.slice(0, cap);
    var nBlocks = BLOCKS_L[version];
    var ecEach = EC_L[version] / nBlocks;
    var dataEach = cap / nBlocks;
    var blocks = [];
    var offset = 0;
    for (i = 0; i < nBlocks; i++) {
      var d = data.slice(offset, offset + dataEach);
      offset += dataEach;
      blocks.push({ d: d, e: rsEncode(d, ecEach) });
    }
    var inter = [];
    for (i = 0; i < dataEach; i++) for (var b = 0; b < nBlocks; b++) inter.push(blocks[b].d[i]);
    for (i = 0; i < ecEach; i++) for (b = 0; b < nBlocks; b++) inter.push(blocks[b].e[i]);
    var outBits = [];
    function pb(val, n) {
      for (var k = n - 1; k >= 0; k--) outBits.push((val >>> k) & 1);
    }
    for (i = 0; i < inter.length; i++) pb(inter[i], 8);
    for (i = 0; i < REM_BITS[version]; i++) outBits.push(0);
    return outBits;
  }

  function sizeOf(v) { return 21 + 4 * (v - 1); }

  function placeFinders(m, s) {
    function finder(r, c) {
      for (var i = -1; i <= 7; i++) for (var j = -1; j <= 7; j++) {
        var rr = r + i, cc = c + j;
        if (rr < 0 || cc < 0 || rr >= s || cc >= s) continue;
        var on = i === -1 || i === 7 || j === -1 || j === 7
          ? false
          : (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4));
        if (i === -1 || i === 7 || j === -1 || j === 7) {
          m[rr][cc] = { r: true, v: false };
        } else {
          m[rr][cc] = { r: true, v: on };
        }
      }
      for (var i = 0; i < 7; i++) for (var j = 0; j < 7; j++) {
        var on = i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4);
        m[r + i][c + j] = { r: true, v: on };
      }
    }
    finder(0, 0);
    finder(0, s - 7);
    finder(s - 7, 0);
  }

  function placeTiming(m, s) {
    for (var i = 8; i < s - 8; i++) {
      if (!m[6][i]) m[6][i] = { r: true, v: i % 2 === 0 };
      if (!m[i][6]) m[i][6] = { r: true, v: i % 2 === 0 };
    }
  }

  function placeAlign(m, v, s) {
    var pos = ALIGN[v];
    if (!pos) return;
    for (var a = 0; a < pos.length; a++) for (var b = 0; b < pos.length; b++) {
      var r = pos[a], c = pos[b];
      if ((r < 8 && c < 8) || (r < 8 && c > s - 9) || (r > s - 9 && c < 8)) continue;
      for (var i = -2; i <= 2; i++) for (var j = -2; j <= 2; j++) {
        var on = Math.max(Math.abs(i), Math.abs(j)) !== 1;
        m[r + i][c + j] = { r: true, v: on };
      }
    }
  }

  function maskBit(mask, i, j) {
    switch (mask) {
      case 0: return (i + j) % 2 === 0;
      case 1: return i % 2 === 0;
      case 2: return j % 3 === 0;
      case 3: return (i + j) % 3 === 0;
      case 4: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
      case 5: return (i * j) % 2 + (i * j) % 3 === 0;
      case 6: return ((i * j) % 2 + (i * j) % 3) % 2 === 0;
      default: return ((i + j) % 2 + (i * j) % 3) % 2 === 0;
    }
  }

  function formatBits(mask) {
    var data = (0x01 << 3) | mask;
    var rem = data << 10;
    for (var i = 14; i >= 10; i--) if (rem >>> i) rem ^= 0x537 << (i - 10);
    var bits = ((data << 10) | rem) ^ 0x5412;
    return bits;
  }

  function placeFormat(m, s, mask) {
    var bits = formatBits(mask);
    for (var i = 0; i < 15; i++) {
      var bit = (bits >> i) & 1;
      if (i < 6) m[i][8] = { r: true, v: !!bit };
      else if (i < 8) m[i + 1][8] = { r: true, v: !!bit };
      else m[s - 15 + i][8] = { r: true, v: !!bit };
      if (i < 8) m[8][s - 1 - i] = { r: true, v: !!bit };
      else if (i < 9) m[8][15 - i] = { r: true, v: !!bit };
      else m[8][14 - i] = { r: true, v: !!bit };
    }
    m[s - 8][8] = { r: true, v: true };
  }

  function placeVersion(m, s, v) {
    var info = VER_INFO[v];
    if (info == null) return;
    for (var i = 0; i < 18; i++) {
      var bit = (info >> i) & 1;
      var r = Math.floor(i / 3);
      var c = i % 3;
      m[r][s - 11 + c] = { r: true, v: !!bit };
      m[s - 11 + c][r] = { r: true, v: !!bit };
    }
  }

  function fillData(m, s, bits) {
    var dir = -1;
    var col = s - 1;
    var idx = 0;
    while (col > 0) {
      if (col === 6) col--;
      for (var i = 0; i < s; i++) {
        var row = dir < 0 ? s - 1 - i : i;
        for (var k = 0; k < 2; k++) {
          var c = col - k;
          if (m[row][c]) continue;
          var bit = bits[idx] || 0;
          m[row][c] = { r: false, v: !!bit, d: true };
          idx++;
        }
      }
      dir = -dir;
      col -= 2;
    }
  }

  function applyMask(m, s, mask) {
    for (var i = 0; i < s; i++) for (var j = 0; j < s; j++) {
      if (m[i][j] && m[i][j].d && maskBit(mask, i, j)) m[i][j].v = !m[i][j].v;
    }
  }

  function penalty(m, s) {
    var score = 0, i, j, run, k;
    function dark(i, j) { return m[i][j] && m[i][j].v; }
    for (i = 0; i < s; i++) {
      run = 1;
      for (j = 1; j < s; j++) {
        if (dark(i, j) === dark(i, j - 1)) run++;
        else { if (run >= 5) score += run - 2; run = 1; }
      }
      if (run >= 5) score += run - 2;
    }
    for (j = 0; j < s; j++) {
      run = 1;
      for (i = 1; i < s; i++) {
        if (dark(i, j) === dark(i - 1, j)) run++;
        else { if (run >= 5) score += run - 2; run = 1; }
      }
      if (run >= 5) score += run - 2;
    }
    for (i = 0; i < s - 1; i++) for (j = 0; j < s - 1; j++) {
      var v = dark(i, j);
      if (v === dark(i, j + 1) && v === dark(i + 1, j) && v === dark(i + 1, j + 1)) score += 3;
    }
    var darkN = 0;
    for (i = 0; i < s; i++) for (j = 0; j < s; j++) if (dark(i, j)) darkN++;
    score += Math.floor(Math.abs(darkN * 100 / (s * s) - 50) / 5) * 10;
    return score;
  }

  function build(text) {
    var needed = text.length + 3;
    var version = 2;
    while (version <= 10 && DATA_L[version] < needed + 2) version++;
    if (version > 10) version = 10;
    var s = sizeOf(version);
    var bits = encode(text.slice(0, DATA_L[version] - 3), version);
    var best = null, bestScore = 1e9, mask;
    for (mask = 0; mask < 8; mask++) {
      var m = [];
      var i, j;
      for (i = 0; i < s; i++) {
        m[i] = [];
        for (j = 0; j < s; j++) m[i][j] = null;
      }
      placeFinders(m, s);
      placeAlign(m, version, s);
      placeTiming(m, s);
      m[8][s - 8] = { r: true, v: true };
      placeFormat(m, s, mask);
      placeVersion(m, s, version);
      fillData(m, s, bits);
      applyMask(m, s, mask);
      placeFormat(m, s, mask);
      var sc = penalty(m, s);
      if (sc < bestScore) { bestScore = sc; best = m; }
    }
    return best;
  }

  function svg(text, px) {
    px = px || 180;
    var m = build(String(text || ''));
    var s = m.length;
    var quiet = 4;
    var n = s + quiet * 2;
    var parts = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + n + ' ' + n + '" width="' + px + '" height="' + px + '" shape-rendering="crispEdges">'];
    parts.push('<rect width="' + n + '" height="' + n + '" fill="#fff"/>');
    for (var i = 0; i < s; i++) for (var j = 0; j < s; j++) {
      if (m[i][j] && m[i][j].v) parts.push('<rect x="' + (j + quiet) + '" y="' + (i + quiet) + '" width="1" height="1" fill="#111"/>');
    }
    parts.push('</svg>');
    return parts.join('');
  }

  root.LAWSONITE_QR = { svg: svg };
})(typeof window !== 'undefined' ? window : globalThis);
