// キャッシュ名にバージョンを埋め込むためのプレースホルダー
const CACHE_NAME = 'my-simple-pwa-cache-2025.11.04.063820';

// キャッシュするファイルのリスト
const urlsToCache = [
  './',
  './index.html',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// installイベント: ファイルをキャッシュする
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// activateイベント: 古いキャッシュを削除する
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// fetchイベント: リクエストに応じてキャッシュから返す
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュにあればそれを返す
        if (response) {
          return response;
        }
        //なければネットワークから取得
        return fetch(event.request);
      })
  );
});