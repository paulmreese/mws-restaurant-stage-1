let staticCacheName = 'restaurant-reviews-static-v1';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {

      //create a list of the images, as they are numbered 1-10
      let listOfImages = [];
      for (let i = 1; i <= 10; i++) {
        listOfImages.push('img/' + i + '.jpg');
      }

      return cache.addAll([
        'js/main.js',
        'js/dbhelper.js',
        'css/styles.css',
        listOfImages
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('restaurant-reviews-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
