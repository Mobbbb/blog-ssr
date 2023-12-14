const preCacheName = 'blog'
importScripts('https://mobbbb.top/resource/workbox-v4.3.1/workbox-sw.js')
workbox.setConfig({
    debug: false,
    modulePathPrefix: 'https://mobbbb.top/resource/workbox-v4.3.1'
})
// workbox.core.skipWaiting() <- This method is deprecated, and will be removed in Workbox v7. 
// Calling self.skipWaiting() instead.
self.skipWaiting()
// Claim any currently available clients once the service worker becomes active
workbox.core.clientsClaim()

var cacheFirstOptions = {
    requestWillFetch: function(_ref2) {
        var request = _ref2.request
        request = new Request(request.url)
        return request
    },
    cachedResponseWillBeUsed: function(e) {
        if (e.cachedResponse && e.cachedResponse.type === 'opaque') {
            caches.delete(e.cacheName)
            return null
        }
        return e.cachedResponse
    }
}

var chunksCacheName = preCacheName + '-chunks'
function urlHashFilter(url) {
    var requestUrl = new URL(url);
    var name = requestUrl.pathname.split('.');
    if (name.length > 2) {
        var hash = name.splice(-2, 1)[0];
        return [requestUrl.origin + name.join('.'), hash]
    }
    return [requestUrl.origin + name.join('.'), '']
}
function traverseCaches(callbackfunc) {
    caches.keys().then(function(cacheNames) {
        cacheNames.filter(function(cacheName) {
            return cacheName === chunksCacheName
        }).map(function(cacheName) {
            return caches.open(cacheName).then(function(cache) {
                cache.keys().then(function(cachedRequests) {
                    cachedRequests.map(function(cachedRequest) {
                        callbackfunc(cachedRequest, cache)
                    })
                })
            })
        })
    })
}
function handlerUpdateChunks(_ref) {
    var event = _ref.event
    var request = event.request
    return caches.match(request).then(function(cachedRespond) {
        if (!cachedRespond) {
            traverseCaches(function(cachedRequest, cache) {
                var cacheReqUrlHash = urlHashFilter(cachedRequest.url);
                var resUrlHash = urlHashFilter(request.url);
                if (resUrlHash[0] === cacheReqUrlHash[0] && resUrlHash[1] !== cacheReqUrlHash[1]) {
                    cache.delete(cachedRequest) // 删除旧缓存
                }
            })
        }
        return workbox.strategies.cacheFirst({
            cacheName: chunksCacheName,
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200]
                }),
                cacheFirstOptions,
            ]
        }).handle({
            event: event
        }).catch(function(e) {
            console.error(e)
        })
    })
}

// chunks资源缓存——cacheFirst
workbox.routing.registerRoute(
    new RegExp('^https?:\/\/(.*)_nuxt\.(.*)\.(js|css)$'),
    handlerUpdateChunks
)

// 图片缓存策略
workbox.routing.registerRoute(
    new RegExp(eval('/^https?:\\/\\/' + location.host + '(.*).(png|gif|jpg|jpeg|webp)$/')), 
    workbox.strategies.cacheFirst({
        cacheName: preCacheName + '-images',
        plugins: [
            new workbox.expiration.Plugin({
                maxAgeSeconds: 365 * 24 * 60 * 60,
                maxEntries: 300 // 缓存条数(FIFO)
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200] // 可被缓存的状态码
            }), 
            cacheFirstOptions,
        ]
    })
)

// cdn静态资源缓存策略
workbox.routing.registerRoute(
    new RegExp('^https?:\/\/(.*)bootcdn\.(.*)\.(js|css|woff)$'),
    workbox.strategies.cacheFirst({
        cacheName: preCacheName + '-statics',
        plugins: [
            new workbox.expiration.Plugin({
                maxAgeSeconds: 365 * 24 * 60 * 60
            }), 
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            }),
            cacheFirstOptions,
        ]
    })
)

self.addEventListener('error', function(event) {
    console.error('error')
    console.dir(event)
})
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting()
    }
    console.error(event.data)
    console.log(preCacheName)
})
