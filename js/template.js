define([], function() {
    'use strict';

    function generateCard(car) {
        var template = document.querySelector('#car-deals').innerHTML;
        var title = car.brand + ' ' + car.model + ' ' + car.year;
        return replacer(template, {
            'title': title,
            'image': car.image,
            'price': car.price,
            'details-id': car.details_id
        });

    }

    function replacer(template, replacerObject) {
        for (var key in replacerObject) {
            template = template.replace('{{' + key + '}}', replacerObject[key]);
        }
        return template;
    }

    function appendCars(cars) {

        var cardHTML = "";
        cars.forEach(function(car) {
            cardHTML += generateCard(car);
        })
        document.querySelector('#first-load').innerHTML = "";
        document.querySelector('.mdl-grid').insertAdjacentHTML('beforeend', cardHTML);
        //Force Redraw Fix for IE
        document.querySelector('.mdl-layout__content').style.display = 'none';
        document.querySelector('.mdl-layout__content').style.display = 'inline-block';
    }
    return {
        appendCars: appendCars
    }
});