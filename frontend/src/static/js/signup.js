import authFront from './authFront.js';

function ValidateEmail(mail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
}

document.getElementById('submit_button').addEventListener('click', async () => {
    document.getElementById("successmessage").style.display = "none";
    document.getElementById("errormessage").style.display = "none";
    try {
        let username = document.getElementById('sign_up_username').value;
        let email = document.getElementById('sign_up_email').value;
        let password = document.getElementById('sign_up_password').value;
        let confirmPassword = document.getElementById('confirm_password').value;
        if(!ValidateEmail(email) || password != confirmPassword) throw new Error('Passwords should not match');
        await authFront.createUser(username, email, password, confirmPassword);
        document.getElementById("successmessage").style.display = "block";
    } catch (e) {
        console.log(e);
        document.getElementById("errormessage").style.display = "block";
    }
});

document.getElementById('home').addEventListener('click', () => {
    document.location = '/';
});

document.getElementById('login_btn').addEventListener('click', () => {
    document.location = '/login';
});