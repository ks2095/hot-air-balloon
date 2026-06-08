const CACHE_NAME = 'balloon-game-v4';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './game.js',
    './manifest.json',
    './balloon.png',
    './가?�통.png',
    './무게�?png',
    './버너모양.png',
    './?�풍기좌�?png',
    './?�풍기우�?png',
    './?�벤?�코??png',
    './?�명종시�?png',
    './??��말풍??png',
    './?�기구소�?MP3',
    './미션?�공.MP3',
    './??��.MP3',
    './코인?�리.mp3',
    './?�기구음??.mp3',
    './?�기구음??.mp3',
    './?�기구음??.mp3',
    './?�기구음??.mp3',
    './?�기구음??.MP3',
    './?�기구음??.MP3',
    './?�기구음??.mp3',
    './?�기구음??.mp3',
    './?�기구음??.mp3'
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
