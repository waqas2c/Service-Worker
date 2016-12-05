'use strict';
var carDealsCacheName = 'carDealsCacheV1';
var carDetailsPageCacheName = 'carDealsCachePagesV1';
var carDealsImageCacheName = 'carDealsCacheImagesV1';
var carDealsCacheFiles = [
    './',
    'js/app.js',
    'js/carService.js',
    'js/clientStorage.js',
    'js/swRegister.js',
    'js/template.js',
    'resources/es6-promise/dist/es6-promise.js',
    'resources/fetch/fetch.js',
    'resources/localForage/dist/localforage.js',
    'resources/localForage/dist/localforage-setItems.js',
    '/resources/localForage/dist/localforage-getItems.js',
    'resources/systemjs/system.js',
    'resources/systemjs/system-polyfills.js',
    'resources/material-design-lite/material.red-indigo.min.css',
    'resources/material-design-lite/material.min.js',
    'resources/material-design-lite/material.min.js.map'

];

var path = '/pluralsight/courses/progressive-web-apps/service/';
var latestPath = path + 'latest-deals.php';
var imagePath = path + 'car-image.php';
var carPath = path + 'car.php';

self.addEventListener('install', function(event) {
    console.log('Service Worker:Install', event);
    self.skipWaiting();
    event.waitUntil(caches.open(carDealsCacheName)
        .then(function(cache) {
            return cache.addAll(carDealsCacheFiles);
        }));
})
self.addEventListener('activate', function(event) {
    console.log('Service Worker:Activate', event)
    self.clients.claim();
    event.waitUntil(
        caches.keys()
        .then(function(keys) {
            var deletePromises = [];
            for (var i = 0; i < keys.length; i++) {
                if (keys[i] !== carDealsCacheName &&
                    keys[i] !== carDetailsPageCacheName &&
                    keys[i] !== carDealsImageCacheName) {
                    deletePromises.push(caches.delete(keys[i]))
                }
            }
            return Promise.all(deletePromises);
        })
    );
})
self.addEventListener('fetch', function(e) {
    var requestUrl = new URL(e.request.url);
    var requestPath = requestUrl.pathname;
    var fileName = requestPath.substring(requestPath.lastIndexOf('/') + 1)
    if (fileName === 'sw.js' || requestPath === latestPath) {
        e.respondWith(fetch(e.request));
    } else if (requestPath === imagePath) {
        e.respondWith(networkFirstStrategy(e.request))
    } else {
        e.respondWith(cacheFirstStrategy(e.request))
    }
})

function cacheFirstStrategy(request) {
    return caches.match(request).then(function(cacheResponse) {
        return cacheResponse || fetchRequestAndCache(request);
    })
}

function networkFirstStrategy(request) {
    return fetchRequestAndCache(request).catch(function(response) {
        return caches.match(request);
    })
}

function fetchRequestAndCache(request) {
    return fetch(request).then(function(networkResponse) {
        caches.open(getCacheName(request)).then(function(cache) {
            cache.put(request, networkResponse);
        });
        return networkResponse.clone();
    })
}

function getCacheName(request) {
    var requestUrl = new URL(request.url);
    var filePath = requestUrl.pathname;
    if (filePath === imagePath) {
        return carDealsImageCacheName;
    } else if (filePath === carPath) {
        return carDetailsPageCacheName;
    } else {
        return carDealsCacheName;
    }
}