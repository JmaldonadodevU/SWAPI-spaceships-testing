const CACHE_NAME = 'swapi-ships-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',  // Asegúrate que esté incluido
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

// Imágenes de las naves (puedes añadir las que uses frecuentemente)
const shipImages = [
  '/src/img/A-wing.png',
  '/src/img/B-wing.png',
  '/src/img/Death-Star.png',
  '/src/img/Millennium-Falcon.png',
  '/src/img/Star-Destroyer.png',
  '/src/img/X-wing.png',
  '/src/img/TIE-fighter.png'
];

// Combinar todos los recursos a cachear
const resourcesToCache = [...urlsToCache, ...shipImages];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(resourcesToCache);
      })
  );
});

// Activación del Service Worker
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
  // Para solicitudes a la API de SWAPI, usamos network-first
  if (event.request.url.includes('swapi.info/api')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Si la solicitud es exitosa, clonar y almacenar en caché
          let responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          // Si falla la red, intentar desde caché
          return caches.match(event.request)
            .then(cachedResponse => {
              // Si tenemos una respuesta en caché, la devolvemos
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // Si no tenemos caché para un recurso de la API, redirigir a offline.html
              // pero solo si la solicitud es para un documento HTML
              if (event.request.mode === 'navigate') {
                return caches.match('/offline.html');
              }
              
              // Si no es una navegación, simplemente fallar
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
    // Para otros recursos (CSS, JS, HTML), usamos cache-first
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request)
            .then(response => {
              // Si la solicitud es exitosa y es un recurso válido para caché
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

// Manejar mensajes push
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

// Manejar clics en notificaciones
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});