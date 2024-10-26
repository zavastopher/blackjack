import authFront from './authFront.js'
import api from './APIClient.js'

let places = ['First', 'Second', 'Third', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];

authFront.checkSessionStatus();
let user = await authFront.getCurrentUser();

document.getElementById('back').addEventListener('click', () => {
    document.location = '/menu';
});

let leaderboard = await api.getLeaderBoard(user.username);
let leaderboardContent = '';

for(let i = 0; i < leaderboard.length; i++) {
    // leaderboardContent += `<div class="leaderboardRow"> <section class="place">${places[i]}</section> <section class="name">${leaderboard[i].username}</section> <section class="score">${leaderboard[i].score}</section></div>`;
    leaderboardContent += `<div class="leaderboardRow columns is-gapless">
        <div class="column">
            <section class="place">${places[i]}</section>
        </div>
        <div class="column">
            <section class="name">${leaderboard[i].username}</section>
        </div>
        <div class="column">
            <section class="score">${leaderboard[i].score}</section>
        </div>
    </div>`
}
document.getElementById('leaderboard').innerHTML += leaderboardContent;
