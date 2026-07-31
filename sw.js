// Bump this on every deploy alongside index.html's ?v= cache-busting timestamp — it's what
// actually forces stale app-shell files to drop, the query string mainly matters for the very
// first (pre-service-worker) load.
const CACHE_VERSION = 'v20260731140851';
const APP_SHELL_CACHE = 'app-shell-' + CACHE_VERSION;
const FLAG_CACHE = 'flags-v1';

const APP_SHELL_URLS = [
  './',
  './index.html',
  './styles.css',
  './dist/app.bundle.js',
  './data/seed-countries.js',
  './data/world-map.js',
  './manifest.json',
  './icon.svg',
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE)
      .then(function (cache) { return cache.addAll(APP_SHELL_URLS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== APP_SHELL_CACHE && key !== FLAG_CACHE) return caches.delete(key);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Navigation (opening/reloading the page): try the network first for the freshest shell,
  // fall back to the cached one when there's no connection.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(function () {
        return caches.match('./index.html', { ignoreSearch: true });
      })
    );
    return;
  }

  // Flag images: cache-first and kept forever — a country's flag doesn't change, and there
  // are 152 of these, not worth re-fetching every visit.
  if (url.hostname === 'flagcdn.com') {
    event.respondWith(
      caches.open(FLAG_CACHE).then(function (cache) {
        return cache.match(req).then(function (cached) {
          return cached || fetch(req).then(function (res) {
            // Cross-origin <img> requests are fetched no-cors, so the response is opaque —
            // status/ok aren't readable, but it's still cacheable (and worth caching blind:
            // the alternative is silently never caching any of the 152 flags at all).
            if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
            return res;
          });
        });
      })
    );
    return;
  }

  // Live data — exchange rates, city geocoding: always hit the network. The app already has
  // its own offline fallback for both (cached/built-in rates, a geocodeStatus: 'error' state),
  // so there's nothing for the service worker to add here besides staleness risk.
  if (url.hostname === 'open.er-api.com' || url.hostname === 'nominatim.openstreetmap.org') {
    return;
  }

  // Everything else same-origin (the app shell files): cache-first for instant, offline-proof
  // loads, refreshing the cache in the background whenever the network is available.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req, { ignoreSearch: true }).then(function (cached) {
        const network = fetch(req).then(function (res) {
          if (res.ok) {
            caches.open(APP_SHELL_CACHE).then(function (cache) { cache.put(req, res.clone()); });
          }
          return res;
        }).catch(function () { return cached; });
        return cached || network;
      })
    );
  }
});
