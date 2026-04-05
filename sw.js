const CACHE = "examdee-cache-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/UNOFFICIAL-examdee.ai-vietnam.vn-host-files-/examdee.ai-vietnam.vn/assets/index-BUoCWu2I.js",
        "/UNOFFICIAL-examdee.ai-vietnam.vn-host-files-/examdee.ai-vietnam.vn/assets/index-Bcm3ID3h.css",
        "/UNOFFICIAL-examdee.ai-vietnam.vn-host-files-/examdee.ai-vietnam.vn/offline-api/user.json",
        "/UNOFFICIAL-examdee.ai-vietnam.vn-host-files-/examdee.ai-vietnam.vn/offline-api/lessons.json",
        "/UNOFFICIAL-examdee.ai-vietnam.vn-host-files-/examdee.ai-vietnam.vn/offline-api/pronunciation.json",
        "/UNOFFICIAL-examdee.ai-vietnam.vn-host-files-/examdee.ai-vietnam.vn/offline-api/progress.json",
        "/UNOFFICIAL-examdee.ai-vietnam.vn-host-files-/examdee.ai-vietnam.vn/offline-api/live.json",
        "/UNOFFICIAL-examdee.ai-vietnam.vn-host-files-/examdee.ai-vietnam.vn/offline-api/exam.json",
        "/UNOFFICIAL-examdee.ai-vietnam.vn-host-files-/examdee.ai-vietnam.vn/offline-api/common.json"
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
