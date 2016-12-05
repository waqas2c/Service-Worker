define(['./template.js', './clientStorage.js'], function(template, clientStore) {
    'use strict';
    var apiUlr = 'https://bstavroulakis.com/pluralsight/courses/progressive-web-apps/service/';
    var latestDealsUrl = apiUlr + 'latest-deals.php';
    var carDetailsUrl = apiUlr + 'car.php?carId=';

    function loadMoreRequest() {
        fetchPromise().then(function(status) {
            document.getElementById('connection-status').innerHTML = status;
            loadMore();
        })
    }

    function fetchPromise() {
        return new Promise(function(resolve, reject) {

            fetch(latestDealsUrl + '?carId=' + clientStore.getLastItemId())
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    clientStore.addCars(data.cars).then(function() {
                        data.cars.forEach(preCacheDetailsPage);
                        resolve('The Connection is Ok. Showing Online results');
                    });

                }).catch(function() {
                    resolve('The connection is not working. Showing offline results');
                });;
            setTimeout(function() {
                resolve('The connection is hanging.Showing offline results');
            }, 3000)



        });
    }

    function preCacheDetailsPage(car) {
        if ('serviceWorker' in navigator) {
            var detailsUrl = carDetailsUrl + car.value.details_id;
            window.caches.open('carDealsCachePagesV1')
                .then(function(cache) {
                    cache.match(detailsUrl).then(function(response) {
                        if (!response) {
                            cache.add(new Request(detailsUrl));
                        }
                    })
                })
        }
    }

    function loadMore() {
        clientStore.getCars().then(function(cars) {
            template.appendCars(cars);
        })

    }

    function loadCarPage(carId) {
        fetch(carDetailsUrl + carId)
            .then(function(response) {
                return response.text();
            })
            .then(function(carDetails) {
                document.body.insertAdjacentHTML('beforeend', carDetails);
            })
            .catch(function(err) {
                alert('Opps operation failed', err);
            });
    }
    return {
        loadMoreRequest: loadMoreRequest,
        loadCarPage: loadCarPage
    }
});