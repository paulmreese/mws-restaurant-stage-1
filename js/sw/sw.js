let staticCacheName = 'restaurant-reviews-static-v5';

//create a list of the images, adds images (as they are numbered 1-10)
let listOfResources = [];
for (let i = 1; i <= 10; i++) {
  listOfResources.push('/img/' + i + '.jpg');
}
//add main pages to resources for caching
listOfResources.push('/index.html', '/js/main.js', '/js/dbhelper.js',
  '/css/styles.css')

//create cache and store resources when service worker first installs
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(
        listOfResources
      );
    })
  );
});

//when this worker activates, remove old versions of cache
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

//responds with the cached resources first
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
