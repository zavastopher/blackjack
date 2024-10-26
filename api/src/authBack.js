const dbConnect = require('./DBConnect');
const crypto = require('crypto');


function checkPasswords(password, cPassword) {
    if (cPassword !== password) {
        throw new Error("Passwords do not match.");
    }
}

async function findEmail(email) {
    return dbConnect.query('SELECT * FROM blackjack.user WHERE email=?', [email]).then(({ results }) => {
        const user = results[0];
        return user;
    });
}

async function findUsername(username) {
    return dbConnect.query('SELECT * FROM blackjack.user WHERE username=?', [username]).then(({ results }) => {
        const user = results[0];
        return user;
    });
}

function getSalt() {
    const salt = crypto.randomBytes(16).toString('base64');
    return salt;
}

function hashPassword(password, salt, callback) {
    console.log("at encrypt");
    crypto.pbkdf2(password, salt, 100000, 64, 'sha256', (err, derivedKey) => {
        if (err) {
            console.log("error at authBack 34");
            // Handle the error
            callback(err, null);
        } else {
            console.log("at authBack 38");
            const hashWord = derivedKey.toString('hex');
            console.log(hashWord);
            callback(null, hashWord);
        }
    });
}


module.exports = {

    checkPasswords,
    getSalt,
    findEmail,
    findUsername,
    hashPassword
    

};
