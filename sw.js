const cacheName = 'coach-haidar-v1';
const assets = [
  '/',
  '/index.html',
  '/print.html',
  '/script.js',
  '/style.css',
  '/profile.png'
];

// تثبيت ملفات الموقع في الكاش
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(assets);
    })
  );
});

// جلب الملفات من الكاش في حال عدم وجود إنترنت
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
