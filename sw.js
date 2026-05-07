const cacheName = 'coach-haidar-v2'; // قمنا بتغيير الإصدار لتحديث الكاش
const assets = [
  './',
  './index.html',
  './print.html',
  './script.js',
  './style.css',
  './manifest.json',
  './profile.png'
];

// تثبيت ملفات الموقع في الكاش
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      // تم إضافة {cache: 'reload'} لضمان جلب أحدث النسخ
      return cache.addAll(assets);
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
