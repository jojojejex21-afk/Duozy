// Service Worker untuk Duozy PWA
// Tujuan: menyimpan "app shell" di cache supaya app tetap bisa dibuka
// walau koneksi internet sedang lemah/putus (fitur online tetap butuh internet).

var CACHE_NAME = 'duozy-cache-v1';

var APP_SHELL = [
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Saat service worker pertama kali dipasang: simpan app shell ke cache
self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

// Saat service worker aktif: hapus cache versi lama kalau ada
self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(key){ return key !== CACHE_NAME; })
            .map(function(key){ return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

// Strategi: coba dari cache dulu (biar cepat & tahan offline),
// kalau tidak ada baru ambil dari internet.
// Permintaan ke Firebase / API luar dibiarkan lewat langsung (tidak di-cache),
// supaya data login & fitur online selalu yang terbaru.
self.addEventListener('fetch', function(event){
  var url = event.request.url;
  var isSameOrigin = url.indexOf(self.location.origin) === 0;

  if(!isSameOrigin){
    return; // biarkan request ke Firebase/CDN lewat apa adanya
  }

  event.respondWith(
    caches.match(event.request).then(function(cached){
      return cached || fetch(event.request).then(function(response){
        return caches.open(CACHE_NAME).then(function(cache){
          cache.put(event.request, response.clone());
          return response;
        });
      });
    }).catch(function(){
      // Kalau offline total dan tidak ada di cache, fallback ke halaman utama
      return caches.match('./index.html');
    })
  );
});
