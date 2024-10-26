//This is the section that handles the Service Worker registration
//and all other service worker related shenanigans


export default {
    updateSW: (SW) => {
        //Makes div pop-up for updating the service worker
        const update_popup = document.createElement('div');
        update_popup.id = "updateSW";
        update_popup.innerHTML = "<p>Service Worker Update</p>"
        //Button for updating the service worker
        const update_button = document.createElement('button');
        update_button.innerHTML = "Update Now";
        update_popup.appendChild(update_button);
        //Button for not updating the service worker
        const cancel_button = document.createElement('button');
        cancel_button.innerHTML = "Cancel";
        update_popup.appendChild(cancel_button);

        //Now that everything has been added to the update div
        //display, we can add some functionality to the popup

        update_button.addEventListener('click', e => {
            worker.postMessage({ action: 'skipWaiting' });
        });

        cancel_button.addEventListener('click', e => {
            document.body.removeChild(update_popup);
        });

        document.body.appendChild(update_popup);
    },

    registerSW: () => {
        //If the page does not support service workers, do not
        //try to register one
        if (!navigator.serviceWorker) {
            return;
        }

        navigator.serviceWorker.register('/serviceWorker.js').then(registration => {

            //If this is null, that means the SW is not activated or is
            //activating. If this is the case, we just want to do nothing
            //and return
            if (!navigator.serviceWorker.controller) {
                console.log("This SW is not activated/activating");
                return;
            }

            if (registration.installing) {
                console.log('Service worker installing');
            } else if (registration.waiting) {
                console.log('Service worker installed, but waiting');
                updateSW(registration.waiting);
            } else if (registration.active) {
                console.log('Service worker active');
            }

            registration.addEventListener('updatefound', () => {
                console.log("New Service worker installed.");
                updateSW(registration.installing);
            })
        }).catch(err => {
            console.error("Could not register ServiceWorker. Produced " + err);
        });

        navigator.serviceWorker.addEventListener('message', event => {
            console.log('Message recieved: ' + event.data);
        });
    }
}