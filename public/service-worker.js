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
                        .then(async function(response) {
                            if (response) {
                                console.log(event.request.url + ' from cache');

                                return response;
                            }

                            console.log(event.request.url + ' from fetch');

                            let fetchResponse = await fetch(event.request.url);

                            if (fetchResponse.ok) {
                                cache.put(event.request.url, fetchResponse.clone());
                            } else {
                                console.warn('Error caching ' + event.request.url + ' perhaps because it\'s an external resource which has not explicitly said that this site may fetch from it');
                            }

                            return fetchResponse;
                        })
                })
        )
    }
});
