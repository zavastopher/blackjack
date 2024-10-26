//Import the api functions into this file
import { subscribeToPush, unsubscribeFromPush, showNotification } from './notifications.js';

//JS for the back button in the options menu
//so that it takes you back to the menu

document.getElementById('back_button').addEventListener('click', () => {
    document.location = '/';
});

//JS for saving the options
let notifyButton = null;
let sound = null;

try {
    notifyButton = document.getElementById('notifications');
    sound = document.getElementById('sound');
} catch (e) {
    console.log("Either the notify checkbox or the sound slider do not have the right id or they do not exist.");
}

try {
    if(localStorage.getItem('notification')) {
        notifyButton.checked = true;
    }
    if(localStorage.getItem('sound') != null) {
        sound.value = localStorage.getItem('sound');
    }
} catch (e) {
    console.log("No Settings were previously stored.");
}

document.getElementById('save').addEventListener('click', () => {
    localStorage.setItem('notification', notifyButton.checked);
    if(notifyButton.checked) {
        if (!("Notification" in window)) {
            // Check if the browser supports notifications
            alert("This browser does not support desktop notification");
        } else if(Notification.permission === "default") {
            Notification.requestPermission().then((result) => {
                console.log(result);
                if (result === "granted") {
                    showNotification("Push Notif Test", `This is a test notification. Your Settings have been saved and notifications are enabled.`);
                }
            });
        } else {
            alert("You have already set your notification preferences for this browser, to change them you have to manually change it in the browser notification settings for this page.");
        }
         
     
    } else if(Notification.permission === "granted") {
        alert("To get rid of notifications you will need to manually set the notification preferences to off for Black Jack.")
    }
    localStorage.setItem('sound', sound.value);
    console.log(`Notification: ${localStorage.getItem('notification')} Sound: ${localStorage.getItem('sound')}`);
});



// notifyButton.addEventListener("click", () => {
//     if(notifyButton.checked) {
//         Notification.requestPermission().then((result) => {
//             console.log(result);
//             if (result === "granted") {
//               showNotification("Push Notif Test", "This is a test notification");
//             } else {
//               notifyButton.checked = false;
//             }
//         });
//     } else {
//         Notification.requestPermission().then((result) => {
//             console.log(result);
//             if (result === "granted") {
//               showNotification("Push Notif Test", "This is a test notification");
//             } else {
//               notifyButton.checked = false;
//             }
//         });
//     }
    
//   });

  