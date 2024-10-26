const express = require('express');

const app = express();
//Change because server and app cannot run 
//on the same application
const PORT = 80;

// Designate the static folder as serving static resources
app.use(express.static(__dirname + '/static'));

console.log(__dirname + '/templates/splash_page.html');

app.get('/', (req,  res) => {
    res.sendFile(__dirname + '/templates/splash_page.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/templates/login.html');
});

app.get('/menu', (req, res) => {
    res.sendFile(__dirname + '/templates/menu.html');
});

app.get('/practice', (req, res) => {
    res.sendFile(__dirname + '/templates/practice.html');
});

app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/templates/game.html');
});

app.get('/leaderboard', (req, res) => {
    res.sendFile(__dirname + '/templates/leaderboard.html');
});

app.get('/options', (req, res) => {
    res.sendFile(__dirname + '/templates/options.html');
});

app.get('/signup', (req, res) => {
    console.log("Made it to signup");
    res.sendFile(__dirname + '/templates/signup.html');
});

app.get('/offline', (req, res) => {
    console.log("Made it to offline");
    res.sendFile(__dirname + '/templates/offline.html');
});

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));