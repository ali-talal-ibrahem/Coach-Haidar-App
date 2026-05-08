const cacheName = 'coach-haidar-v1.0.0';
const assets = ['./','./index.html','./print.html','./script.js','./style.css','./manifest.json','./profile.png'];
self.addEventListener('install', e => {
e.waitUntil(
caches.open(cacheName).then(async (cache) => {
for (const asset of assets) {
try {
const response = await fetch(asset);
if (!response.ok) throw new Error(`Status: ${response.statusText}`);
await cache.put(asset, response);
} catch (error) {
console.error(`Error: ${asset} ->`, error);
}
}
})
);
});
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
self.addEventListener('fetch', e => {
e.respondWith(
caches.match(e.request).then(res => {
return res || fetch(e.request).catch(() => {
console.log('Offline & not cached');
});
})
);
});
