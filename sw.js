// Service worker : fonctionnement hors ligne.
// Stratégie « réseau d'abord » : la dernière version publiée est toujours chargée si une connexion existe.
const CACHE = "autointel-v5";
const FICHIERS = [
  "./", "./index.html", "./manifest.webmanifest", "./css/app.css",
  "./js/app.js", "./js/notation.js", "./js/recherche.js", "./js/stockage.js", "./js/import.js", "./js/valeur.js", "./js/couts.js", "./js/achat.js", "./js/data/moteurs-ext.js", "./js/data/boites-ext.js", "./js/data/modeles-ext.js",
  "./js/data/moteurs.js", "./js/data/boites.js", "./js/data/modeles.js",
  "./icons/icon-192.png", "./icons/apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((cles) => Promise.all(cles.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((rep) => {
        const copie = rep.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copie));
        return rep;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match("./index.html")))
  );
});
