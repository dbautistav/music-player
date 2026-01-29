const CACHE_VERSION = 'v1';
const CACHE_NAME = `music-player-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './db.js',
  './sw.js'
];

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll())
      .then((clients) => {
        clients.forEach((client) => client.postMessage('waiting'));
      })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== 'GET') return;

  if (PRECACHE_URLS.includes(url.pathname) || url.pathname === '/') {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  if (url.pathname.includes('catalog.json')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(fetch(event.request));
});
