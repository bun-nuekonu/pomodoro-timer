import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

function offlineAppPlugin(): Plugin {
  return {
    name: 'offline-app-shell',
    apply: 'build',
    generateBundle(_options, bundle) {
      const generatedFiles = Object.keys(bundle).filter((fileName) => !fileName.endsWith('.map'))
      const precacheUrls = [
        '/',
        '/index.html',
        '/manifest.webmanifest',
        '/icons/tempo.svg',
        '/icons/tempo-192.png',
        '/icons/tempo-512.png',
        '/icons/apple-touch-icon.png',
        ...generatedFiles.map((fileName) => `/${fileName}`),
      ]

      const serviceWorker = `
const CACHE_NAME = 'tempo-app-shell-v1'
const PRECACHE_URLS = ${JSON.stringify([...new Set(precacheUrls)])}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('tempo-app-shell-') && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        fetch(request)
          .then((response) => {
            if (response.ok) {
              const copy = response.clone()
              void cache.put('/index.html', copy)
            }
            return response
          })
          .catch(async () => (await cache.match('/index.html')) || (await cache.match('/'))),
      ),
    )
    return
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => cache.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone()
          void cache.put(request, copy)
        }
        return response
      })
    })),
  )
})
`

      this.emitFile({ type: 'asset', fileName: 'sw.js', source: serviceWorker })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), offlineAppPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
