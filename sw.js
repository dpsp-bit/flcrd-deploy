const r = "flashcard-srs-cache-v1", c = new URL(self.registration.scope).pathname, n = c.endsWith("/") ? c : `${c}/`;
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(r).then((t) => t.addAll([
      n,
      `${n}index.html`,
      `${n}manifest.webmanifest`,
      `${n}logo.svg`,
      `${n}icons/icon-192x192.png`,
      `${n}icons/icon-512x512.png`
    ]).catch((s) => {
      console.warn("Pre-caching during install failed/skipped items:", s);
    }))
  ), self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", (e) => {
  const { request: t } = e, s = new URL(t.url);
  if (t.method !== "GET" || s.origin !== self.location.origin)
    return;
  const o = t.mode === "navigate";
  e.respondWith(
    fetch(t).then((a) => {
      if (a && a.status === 200) {
        const i = a.clone();
        caches.open(r).then((l) => {
          l.put(t, i);
        });
      }
      return a;
    }).catch((a) => (console.log("Network unavailable, serving from cache:", t.url), caches.match(t).then((i) => i || (o ? caches.match(`${n}index.html`) || caches.match(n) : Response.error()))))
  );
});
self.addEventListener("message", (e) => {
  (e.data === "SKIP_WAITING" || e.data && e.data.type === "SKIP_WAITING") && self.skipWaiting();
});
