// Service Worker for Pehchaan Kaun? PWA
const CACHE_NAME = 'pehchaan-kaun-v2'
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon-192.png'
]

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    }).catch(() => {
      // Handle network errors gracefully
      return caches.match('/')
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Handle push notifications - only use supported options
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  
  const title = data.title || 'Pehchaan Kaun? 🇮🇳'
  const options = {
    body: data.body || 'New puzzle is live! Can you guess today\'s personality?',
    icon: '/icon-192.png',
    tag: 'pehchaan-kaun-notification',
    requireInteraction: false,
    silent: false
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    clients.openWindow('/')
  )
})
