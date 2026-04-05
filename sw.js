const CACHE = "examdee-cache-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/UNOFFICIAL-examdee.ai-vietnam.vn-host-files-/examdee.ai-vietnam.vn/assets/index-BUoCWu2I.js",
        "/UNOFFICIAL-examdee.ai-vietnam.vn-host-files-/examdee.ai-vietnam.vn/assets/index-Bcm3ID3h.css",
        "/offline-api/user.json",
        "/offline-api/lessons.json",
        "/offline-api/pronunciation.json",
        "/offline-api/progress.json",
        "/offline-api/live.json",
        "/offline-api/exam.json",
        "/offline-api/common.json"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
