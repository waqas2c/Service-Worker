define([], function() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js', { scope: "" })
            .then(function(swRegistration) {
                var serviceWorker;
                if (swRegistration.installing) {
                    console.log('Resolved at installing', swRegistration);
                    serviceWorker = swRegistration.installing;
                } else if (swRegistration.waiting) {
                    console.log('Resolved at waiting', swRegistration);
                    serviceWorker = swRegistration.waiting;
                } else if (swRegistration.active) {
                    console.log('Resolved at active', swRegistration);
                    serviceWorker = swRegistration.active;
                }
                if (serviceWorker) {
                    serviceWorker.addEventListener('statechanged', function(e) {
                        console.log('SW State Changed', e.target.state);
                    })
                }
                swRegistration.addEventListener('updatefound', function(e) {
                    swRegistration.installing.addEventListener('statechange', function(e) {
                        console.log('New Service Worker State:', e.target.state);
                    })
                    console.log('New service worker found');
                })
                setTimeout(function() {
                    swRegistration.update();
                }, 5000)
            }).catch(function(err) {
                console.log('Service worker registration failed', err);
            })


        navigator.serviceWorker.addEventListener('controllerchange', function(e) { console.log('Controller changed') })
    }

});