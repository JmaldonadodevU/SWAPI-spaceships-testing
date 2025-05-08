const CACHE_NAME = 'swapi-ships-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',  
  '/css/indexStyles.css',
  '/js/main.js',
  '/js/app.js',
  '/js/config/api.js',
  '/js/config/images.js',
  '/js/config/ships.js',
  '/js/services/apiService.js',
  '/js/services/authService.js',
  '/js/services/favoriteService.js',
  '/js/services/shipService.js',
  '/js/ui/categoryUI.js',
  '/js/ui/navigation.js',
  '/js/ui/shipCards.js',
  '/js/ui/shipComparison.js',
  '/js/ui/shipDetails.js'
];


const shipImages = [
  '/src/img/A-wing.png',
  '/src/img/B-wing.png',
  '/src/img/Death-Star.png',
  '/src/img/Millennium-Falcon.png',
  '/src/img/Star-Destroyer.png',
  '/src/img/X-wing.png',
  '/src/img/TIE-fighter.png'
];

const resourcesToCache = [...urlsToCache, ...shipImages];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(resourcesToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
self.addEventListener('fetch', event => {
  if (event.request.url.includes('swapi.info/api')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          let responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              if (event.request.mode === 'navigate') {
                return caches.match('/offline.html');
              }
              return new Response('Network error', {
                status: 408,
                headers: new Headers({
                  'Content-Type': 'text/plain'
                })
              });
            });
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request)
            .then(response => {
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              let responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });

              return response;
            });
        })
    );
  }
});

self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: 'src/icons/icon-192x192.png',
      badge: 'src/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});