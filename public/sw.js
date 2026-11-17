// Service Worker for TotK Map Tile Caching
// Provides instant 0ms tile loading from browser Cache Storage and eliminates black loading boxes

const TILE_CACHE_NAME = 'totk-tiles-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== TILE_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Intercept all map tile requests from objmap-totk.zeldamods.org
  if (url.includes('objmap-totk.zeldamods.org/game_files/map/')) {
    event.respondWith(
      caches.open(TILE_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(event.request, {
            mode: 'cors',
            credentials: 'omit',
          });

          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          // If network fails and not in cache, return 1x1 transparent GIF
          return new Response(
            new Uint8Array([
              0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00,
              0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x21,
              0xf9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2c, 0x00, 0x00,
              0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44,
              0x01, 0x00, 0x3b,
            ]),
            { headers: { 'Content-Type': 'image/gif' } }
          );
        }
      })
    );
  }
});
