var cacheName = 'offline';

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
                                fetch(event.request.url, { mode: 'no-cors' })
                                    .then(function(response) {
                                        if (!response.ok) {
                                            console.log(event.request.url, response);

                                            throw new TypeError('Bad response status of');
                                        }

                                        return cache.put(event.request.url, response);
                                    })
                                    .catch(function(e) {
                                        console.error(e);
                                    });

                                /*
                                caches.open(cacheName)
                                    .then(function (cache) {
                                        return cache.add(event.request.url);
                                    })
                                    .catch(function(e) {
                                        console.error(e);
                                    });
                                */

                                console.log(event.request.url + ' from fetch')

                                // This is bad as the request has already been made above (thus a double request occurs).
                                return fetch(event.request, { mode: 'no-cors' });
                            }

                            console.log(event.request.url + ' from cache')

                            return response;
                        })
                })
        )
    }
});
