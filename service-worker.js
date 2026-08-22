// Service Worker – Frankfurt zu Fuß
// Network-First-Strategie: immer die aktuelle Version laden, wenn online.
// Nur wenn kein Netz da ist (z.B. unterwegs im Bankenviertel), wird aus dem Cache bedient.
// (Gleiche Struktur wie madeira-2026/service-worker.js.)

var CACHE_NAME = "frankfurt-walk-v3";

var CORE_ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./images/01-commerzbank-tower.jpg",
  "./images/02-alte-oper.jpg",
  "./images/03-goethe-haus.jpg",
  "./images/04-paulskirche.jpg",
  "./images/05-roemerberg.jpg",
  "./images/06-kaiserdom.jpg",
  "./images/07-eiserner-steg.jpg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) { return key !== CACHE_NAME; })
          .map(function (key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        if (response && response.status === 200) {
          var responseClone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(function () {
        return caches.match(event.request);
      })
  );
});
