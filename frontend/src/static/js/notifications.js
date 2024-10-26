/********************\
* PUSH NOTIFICATIONS *
\********************/

export function subscribeToPush(name) {
    if (!navigator.serviceWorker) { // Are SWs supported?
      return;
    }
  
    navigator.serviceWorker.ready.then(registration => {
      // Use the PushManager to get the user's subscription to the push service.
      return registration.pushManager.getSubscription()
      .then(subscription => {
        // If a subscription was found, return it.
        if (subscription) {
          return subscription;
        }
  
        // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
        // send notifications that don't have a visible effect for the user).
        // applicationServerKey is the server's public key
        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BJSOOYHFq8BCnFQFacpRZGS6w-B4NnAycFam_psiwcock4jwUBN8Vviu3_xxxjexcpqIA9-_OTe-mymD6uXfuPg'
        });
      });
    }).then(subscription => {
      // Now we have a subscription, let's send it to the server.
      // Send the subscription details to the server using the Fetch API.
      fetch('./subscribe', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          name: name, //This is the name of the current user to identify the subscription
          subscription: subscription //The subscription object for this client
        }),
      });
  
    })
    .catch(error => {
      console.error('Failed to subscribe the user: ', error);
    });
  
  };
  
  
  export function unsubscribeFromPush() {
    if (!navigator.serviceWorker) { // Are SWs supported?
      return;
    }
    navigator.serviceWorker.ready.then(registration => {
      //Get subscription
      registration.pushManager.getSubscription()
      .then(subscription => {
        //If no `push subscription`, then return
        if(!subscription) {
          alert('Unable to unregister push notification.');
          return;
        }
  
        //Unsubscribes user
        subscription.unsubscribe()
          .then(() => {
            console.info('Push notification unsubscribed.');
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error('Failed to unsubscribe push notification.');
      });
    })
  }
  
  // This function is an example of using the Notification API to display a notification from anywhere in our code.
  // This is independent from the push notifications.
  export function showNotification(title, body) {
    const notifTitle = title;
    const notifBody = body;
    const notifImg = `/img/icon-192x192.png`;
    const options = {
      body: notifBody,
      icon: notifImg,
    };
    new Notification(notifTitle, options);
  }
  