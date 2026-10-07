/* Lawsonite service worker (generated 2026-10-07 by the deploy build, not hand-edited).
   Precache = exactly what index.html references + the overlay scripts the app injects.
   Old caches (incl. the previous Workbox precache) are deleted on activate. */
'use strict';
var VERSION = '2026-10-07-r2-6bb49e4122';
var CACHE = 'lawsonite-precache-' + VERSION;
var PRECACHE = [
 {
  "url": "/index.html",
  "rev": "1fc0cb1a1c049522d26016d59df3e0af"
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
  "rev": "79b7bbdb57464fb2ef88c2814564b68f"
 },
 {
  "url": "/guides.css",
  "rev": "53dda7acf3fde90a221afc554129228b"
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
  "rev": "4293e3697348953f4bd445c2564feeea"
 },
 {
  "url": "/jobsheet.js",
  "rev": "821d716ead2525c2215e2cefde5e4336"
 },
 {
  "url": "/fieldkit.js",
  "rev": "da93eee9f9125455c63bd6cd2b37e9d3"
 },
 {
  "url": "/qrcode.js",
  "rev": "fc12cb5d9c3bc4676947fd84947560ab"
 },
 {
  "url": "/hardware-data.js",
  "rev": "2cd719ef5032d1761747c0b88b4ec73b"
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
      return cache.match(req, { ignoreSearch: true }).then(function (hit) {
        return hit || fetch(req);
      });
    })
  );
});
