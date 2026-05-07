const cacheName = 'coach-haidar-v3'; // قمنا بتغيير الإصدار لضمان تحديث المتصفح
const assets = [
  './',
  './index.html',
  './print.html',
  './script.js',
  './style.css',
  './manifest.json',
  './profile.png'
];

// تثبيت ملفات الموقع في الكاش مع نظام تشخيصي
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(async (cache) => {
      console.log('⏳ جاري بدء عملية التخزين المؤقت (Caching)...');
      
      // نستخدم حلقة تكرار لتخزين الملفات واحداً تلو الآخر لمعرفة مكان الخلل
      for (const asset of assets) {
        try {
          const response = await fetch(asset);
          if (!response.ok) {
            throw new Error(`فشل التحميل: ${response.statusText}`);
          }
          await cache.put(asset, response);
          console.log(`✅ تم تخزين الملف بنجاح: ${asset}`);
        } catch (error) {
          console.error(`❌ مشكلة في ملف: ${asset} ->`, error);
          // ملاحظة: إذا ظهرت ❌ بجانب ملف، تأكد من وجوده فعلياً في GitHub بنفس الاسم تماماً
        }
      }
      console.log('🏁 انتهت عملية التخزين التشخيصية.');
    })
  );
});

// تفعيل المحرك الجديد فوراً
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName)
            .map(key => caches.delete(key))
      );
    })
  );
});

// جلب الملفات من الكاش في حال عدم وجود إنترنت
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      // إرجاع الملف من الكاش، وإذا لم يوجد نحاول جلبة من الشبكة
      return res || fetch(e.request).catch(() => {
          // إذا فشل كلاهما (أوفلاين والملف ليس بالكاش)
          console.log('📡 أنت أوفلاين والملف غير مخزن مسبقاً.');
      });
    })
  );
});
