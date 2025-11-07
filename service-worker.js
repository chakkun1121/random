// キャッシュ名にバージョンを埋め込むためのプレースホルダー
const CACHE_PREFIX = "random-";
const CACHE_NAME = CACHE_PREFIX + "2025.11.07.114752";

// キャッシュするファイルのリスト
const urlsToCache = [
  "./",
  "./index.html",
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png",
];

// installイベント: ファイルをキャッシュする
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// activateイベント: 古いキャッシュを削除する
self.addEventListener("activate", event => {
  // ★ 古いキャッシュを削除するロジックを修正
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 自分のプレフィックスを持っていて、かつ現在のキャッシュ名と違うものだけを削除
          if (cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
// fetchイベント: リクエストに応じてキャッシュから返す
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // キャッシュにあればそれを返す
      if (response) {
        return response;
      }
      //なければネットワークから取得
      return fetch(event.request);
    })
  );
});
