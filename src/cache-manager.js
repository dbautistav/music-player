const CACHE_VERSION = 'v1';
const CACHE_NAME = `music-player-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/db.js',
  '/cache-manager.js',
  '/sw.js'
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

async function precacheAssets() {
  const cache = await caches.open(CACHE_NAME);
  return cache.addAll(PRECACHE_URLS);
}

async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map((cacheName) => {
      if (cacheName !== CACHE_NAME) {
        return caches.delete(cacheName);
      }
    })
  );
}
