import auth from './authFront.js';

document.getElementById("sign_up_btn").addEventListener('click', () => {
    document.location='/signup';
});

document.getElementById("submit_button").addEventListener('click', async () => {
    try { //  Login call would go here
        await auth.logIn(document.getElementById('username').value, document.getElementById('password').value);
        window.location.href='/menu';
    } catch (e) {
        console.log(e);
        document.getElementById("errormessage").style.display = "block";
    }
});

document.getElementById("home").addEventListener('click', () => {
    document.location ='/';
});


