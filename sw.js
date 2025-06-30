// -離線時：
// 使用者仍能看到完整的 PWA 介面
// 所有基本功能都能正常運作
// 不需要網路連線

// -線上時：
// 檔案會從網路載入最新版本
// 同時更新快取內容
// 為下次離線使用做準備

// -為什麼重要：
// 使用者體驗：離線時仍能使用應用程式
// 可靠性：不依賴網路連線
// 效能：快取的檔案載入更快
// PWA 核心功能：這是 PWA 的重要特性之一


const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/pwa.github.io/',
  '/pwa.github.io/index.html',
  '/pwa.github.io/manifest.json',
  '/pwa.github.io/icons/icon-192x192.png',
  '/pwa.github.io/icons/icon-512x512.png',
  '/pwa.github.io/sw.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Add files one by one to handle missing files gracefully
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(err => {
              console.warn('Failed to cache:', url, err);
              return null;
            })
          )
        );
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
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