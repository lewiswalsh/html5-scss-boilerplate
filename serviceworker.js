
const CACHE_NAME = 'my-site-cache-v1';
const offline_page = '/offline/index.html';
const initial_cache = [
  '/offline/index.html'
  // ...add other stuff here, keep it light!
];

addEventListener('install', (installEvent) => {
  skipWaiting(); // Make sure updates happen immediately
  installEvent.waitUntil(
    caches.open(CACHE_NAME) // Open cache
      .then((cache) => {
        console.log('Cache initialised.');
        return cache.add(initial_cache); // Add stuff to the cache
      })
  );
});

addEventListener('activate', (activateEvent) => {
  clients.claim();
});

addEventListener('fetch', (fetchEvent) => {
  const request = fetchEvent.request;
  if (request.method !== 'GET') { // Don't use this for POST, PUT, DELETE etc.
    return;
  }
  fetchEvent.respondWith(async function () {
    const responseFromFetch = fetch(request);
    fetchEvent.waitUntil(async function () {
      const responseCopy = (await responseFromFetch).clone();
      const myCache = await caches.open(CACHE_NAME);
      await myCache.put(request, responseCopy);
    }());
    if (request.headers.get('Accept').includes('text/html')) {
      try {
        // Live load html from network
        return await responseFromFetch;
      } catch (error) {
        // If error, load html from cache
        const responseFromCache = await caches.match(request);
        // If this fails show offline page.
        return responseFromCache || caches.match(offline_page);
      }
    } else {
      // If not html, load from cache first
      const responseFromCache = await caches.match(request);
      // If this fails, load from network
      return responseFromCache || responseFromFetch;
    }
  }());
});
