import api from "./APIClient.js"
import  worker from "../SWMethods.js"

try {
    await api.getCurrentUser();
    document.location = '/menu'
} catch (e) {

}

document.getElementById('play').addEventListener('click', () => {
    document.location ='/practice';
});

document.getElementById('login_button').addEventListener('click', () => {
    document.location = '/login';
});

document.getElementById('sign_up_button').addEventListener('click', () => {
    document.location = '/signup';
});

document.getElementById('options').addEventListener('click', () => {
    document.location = '/options';
})

/** SERVICE WORKER CODE */

// Register the Service Worker
worker.registerSW();