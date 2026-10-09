/* Lawsonite service worker (generated 2026-10-09, revision r10 for the door-bundle cable, fill-note scope, and the sheet/pack/clear fixes).
   Precache = exactly what index.html references + the overlay scripts the app injects.
   Old caches (incl. the previous Workbox precache) are deleted on activate. */
'use strict';
var VERSION = '2026-10-09-r10-1e5a4b422b';
var CACHE = 'lawsonite-precache-' + VERSION;
var PRECACHE = [
 {
  "url": "/index.html",
  "rev": "2c08af1feb80abc492021d9685943e0c"
 },
 {
  "url": "/favicon.svg",
  "rev": "e951b08a3bc384ec87bcab5ad61031d5"
 },
 {
  "url": "/apple-touch-icon.png",
  "rev": "461b06cf35ca6bab7198979531fe5447"
 },
 {
  "url": "/search-core.js",
  "rev": "afd490ccc7a1d74a3507281a922f8251"
 },
 {
  "url": "/fieldkit.css",
  "rev": "897f597d7c1a5d99f43d2ec1fe625160"
 },
 {
  "url": "/guides.css",
  "rev": "065f69b3428e3053b1ff3b1dc8a9f819"
 },
 {
  "url": "/assets/index-C4Buzm74.js",
  "rev": "239c5c6a2b0643a96c550dac6e8fcb11"
 },
 {
  "url": "/assets/index-d2IG0WUH.css",
  "rev": "8e9e83627391b9b3059c698f30db8ec5"
 },
 {
  "url": "/manifest.webmanifest",
  "rev": "83a35533b95f38fa712a60c016094808"
 },
 {
  "url": "/registerSW.js",
  "rev": "1872c500de691dce40960bb85481de07"
 },
 {
  "url": "/guides-data.js",
  "rev": "3864bdcc11be8b4f730a59be517a0fe0"
 },
 {
  "url": "/guides.js",
  "rev": "275a748dc6e62fbf8ccce97bc7376963"
 },
 {
  "url": "/jobsheet.js",
  "rev": "5181bf4fdd168af602105e92ba4e8ac8"
 },
 {
  "url": "/fieldkit.js",
  "rev": "1e5a4b422bf7e647fbedd85f9f5ffaa7"
 },
 {
  "url": "/qrcode.js",
  "rev": "fc12cb5d9c3bc4676947fd84947560ab"
 },
 {
  "url": "/hardware-data.js",
  "rev": "1fa0a3782fa5eee98a9ada5b968341c2"
 },
 {
  "url": "/pwa-192.png",
  "rev": "e54c1242aa4cff546ac59856f9f36924"
 },
 {
  "url": "/pwa-512.png",
  "rev": "caae254f2884b901a8cabf4d2c622360"
 },
 {
  "url": "/pwa-512-maskable.png",
  "rev": "14769a1b907aaed7f9053be7753c143c"
 },
 {
  "url": "/icons.svg",
  "rev": "3b4fcfcf393eca4d264dca4a4663bc37"
 }
];
var SHELL = '/index.html';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(PRECACHE.map(function (e) {
        return new Request(e.url + '?__lw=' + e.rev, { cache: 'reload' });
      })).then(function () {
        /* store under the clean URL */
        return Promise.all(PRECACHE.map(function (e) {
          var busted = new Request(e.url + '?__lw=' + e.rev);
          return cache.match(busted).then(function (res) {
            return cache.put(e.url, res).then(function () { return cache.delete(busted); });
          });
        }));
      });
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  /* SPA routes (/, /guides/maglock, /checklist/x, /refs ...) -> cached app shell, like Netlify's /* -> /index.html */
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE).then(function (cache) {
        return cache.match(SHELL).then(function (hit) {
          return hit || fetch(req);
        });
      }).catch(function () { return fetch(req); })
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE).then(function (cache) {
      var entry = null;
      var i;
      for (i = 0; i < PRECACHE.length; i++) {
        if (PRECACHE[i].url === url.pathname) { entry = PRECACHE[i]; break; }
      }
      if (entry) {
        return cache.match(entry.url).then(function (hit) {
          if (hit) return hit;
          return fetch(new Request(entry.url + '?__lw=' + entry.rev, { cache: 'reload' })).then(function (res) {
            if (res && res.ok) cache.put(entry.url, res.clone());
            return res;
          });
        });
      }
      return cache.match(req, { ignoreSearch: true }).then(function (hit) {
        return hit || fetch(req);
      });
    })
  );
});
