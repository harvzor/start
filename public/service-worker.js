var cacheName = 'offline-';

self.addEventListener('fetch', function(event) {
    if (
        //event.request.url.startsWith(event.request.referrer) &&
        event.request.method === 'GET'
    ) {
        event.respondWith(
            caches.open(cacheName)
                .then(function(cache) {
                    return cache.match(event.request)
                        .then(function (response) {
                            if (!response) {
                                caches.open(cacheName)
                                    .then(function (cache) {
                                        return cache.add(event.request.url);
                                    });

                                console.log(event.request.url + ' from fetch')

                                return fetch(event.request, { mode: 'no-cors' });
                            }

                            console.log(event.request.url + ' from cache')

                            return response;
                        })
                })
        )
    }
});
