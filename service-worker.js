const cacheName = 'belly-checker-v4';
const staticAssets = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './favicon.ico'
];

// Google Fonts are cross-origin; cached at runtime so the app is fully offline after first load
const FONT_HOSTS = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(staticAssets))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== cacheName).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;

      return fetch(e.request).then(response => {
        const isFont = FONT_HOSTS.some(host => e.request.url.startsWith(host));
        // Stylesheet requests to fonts.googleapis.com are no-cors, so accept opaque responses too
        if (isFont && (response.ok || response.type === 'opaque')) {
          const copy = response.clone();
          caches.open(cacheName).then(cache => cache.put(e.request, copy));
        }
        return response;
      });
    })
  );
});
