const cacheName = 'belly-checker-v1';
const staticAssets = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json'
];

self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});

self.addEventListener('fetch', async e => {
  const req = e.request;
  const cachedResponse = await caches.match(req);
  return cachedResponse || fetch(req);
});
