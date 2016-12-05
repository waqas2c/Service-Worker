define([], function(require, factory) {
    'use strict';
    var limit = 3;
    var lastCarId = null;
    var carsInstance = localforage.createInstance({
        name: 'cars'
    });

    function addCars(newCars) {
        return new Promise(function(resolve, reject) {
            carsInstance.setItems(newCars)
                .then(function() {
                    resolve();
                })

        })
    }

    function getCars() {
        return new Promise(function(resolve, reject) {
            carsInstance.keys().then(function(keys) {
                var index = keys.indexOf(lastCarId);
                if (index === -1) { index = keys.length; }
                if (index === 0) { resolve([]); return; }
                keys = keys.splice(index - limit, limit);
                carsInstance.getItems(keys)
                    .then(function(results) {
                        var returnArray = Object.keys(results).map(
                            function(k) { return results[k] }).reverse();
                        resolve(returnArray)
                        lastCarId = returnArray[returnArray.length - 1].id;
                        return;
                    })

            })
        });
    }

    function getLastItemId() {
        return lastCarId;
    }
    return {
        addCars: addCars,
        getCars: getCars,
        getLastItemId: getLastItemId
    }

});