const CACHE_NAME = 'fretboard-manuscripts-v1';

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  const isCacheable = 
    url.origin === self.location.origin || 
    url.hostname.includes('cdn.tailwindcss.com') ||
    url.hostname.includes('cdn.jsdelivr.net') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com');

  if (!isCacheable) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.status === 0)) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch((err) => {
          console.log('[Service Worker] Fetch failed for:', request.url);
          
          if (url.pathname === '/' || url.pathname.endsWith('.html')) {
            return cache.match('/') || cache.match('/index.html');
          }
          
          throw err;
        });

        return cachedResponse || fetchPromise;
      });
    })
  );
});
