Archivo 2: sw.js:

// Service Worker para PWA - Versión Estable
const CACHE_NAME = 'cafe-aroma-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './logo.png',
  './logo-192.png',
  './logo-512.png',
  './manifest.json',
  './offline.html'
];

const offlineFallbackPage = './offline.html';

// Instalación
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptación de solicitudes (Estrategia: Cache First, Network Fallback)
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(offlineFallbackPage))
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});