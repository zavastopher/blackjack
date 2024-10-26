const authorize = require('./authBack');
const dbConnect = require('./DBConnect');

async function postuserScore(username, highscore) {
    authorize.findUsername(username).then(user => {
        if (user) {
            dbConnect.query('UPDATE blackjack.user SET score=? WHERE user.username=?', [highscore, username]);
        }
        else {
            throw new Error("User not found");
        }
    });
}

async function getUserScore(username) {
    return authorize.findUsername(username).then(user => {
        if (user) {
            console.log(user);
            console.log(user.score);
            return user.score;
        }
        else {
            throw new Error("User not found.");
        }
    });
}

async function getLeaderBoard(username) {
    return authorize.findUsername(username).then(user => {
        if (user) {
            return dbConnect.query('SELECT * FROM blackjack.user ORDER BY score DESC').then(results => {
                const leaderBoard = results.results
                if (leaderBoard[0]) {
                    return leaderBoard;
                }
                else {
                    console.log("No leaderboard present");
                    throw new Error("No leaderboard present");
                }
            });
        }
        console.log("User not found");
        throw new Error("User not found.");
    });
}
//makes object of functions
module.exports = {
    getLeaderBoard,
    getUserScore,
    postuserScore,
};
