const CACHE_NAME = 'balloon-game-v1';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './game.js',
    './manifest.json',
    './balloon.png',
    './가스통.png',
    './무게추.png',
    './버너모양.png',
    './선풍기좌측.png',
    './선풍기우측.png',
    './이벤트코인.png',
    './자명종시계.png',
    './폭발말풍선.png',
    './열기구소리.MP3',
    './미션성공.MP3',
    './폭발.MP3',
    './코인소리.mp3',
    './열기구음악1.mp3',
    './열기구음악2.mp3',
    './열기구음악3.mp3',
    './열기구음악4.mp3',
    './열기구음악5.MP3',
    './열기구음악6.MP3',
    './열기구음악7.mp3',
    './열기구음악8.mp3',
    './열기구음악9.mp3'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
