import authFront from './authFront.js'

authFront.checkSessionStatus();

let user = await authFront.getCurrentUser();

document.getElementById('headerinfo').innerHTML = document.getElementById('headerinfo').innerHTML + `<h1 class="subtitle is-2">Welcome ${user.username}</h1>`;

document.getElementById('gameplay_button').addEventListener('click', () => {
    document.location = '/game';
});

document.getElementById('logout').addEventListener('click', async () => {
    await authFront.logOut();
    document.location = '/';
});

document.getElementById('leaderboard_btn').addEventListener('click', () => {
    document.location = '/leaderboard';
});

document.getElementById('options_btn').addEventListener('click', () => {
    document.location = '/options';
});