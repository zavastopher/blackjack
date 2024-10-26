//Implement crypto stuff
const crypto = require('crypto');
const { resolveMx } = require('dns');

module.exports = class {
    userid = null;
    email = null;
    username = null;
    #userpassword = null;
    #usersalt = null;
    score = null;

    constructor(data) {
        this.userid = data.userid;
        this.email = data.email;
        this.username = data.username;
        this.#userpassword = data.userpassword;
        this.#usersalt = data.usersalt;
        this.score = data.score;
    }

    /**
     * This method validates the password of a user
     * @param {*} password the password being validated
     * @returns 
     */
    validatePassword(password) {
        return new Promise((resolve, reject) => {
            //Salt the user password
            crypto.pbkdf2(password, this.#usersalt, 100000, 64, 'sha256', (err, derivedKey) => {
                //If an error occurs
                if (err) {
                    //Reject with error message
                    reject("Error: " + err); 
                }

                //Translate the key to hex and save it
                const passKey = derivedKey.toString('hex');
                //if the hashed password matches the passKey
                if (this.#userpassword != passKey) {
                    reject("Invalid password or username.");
                }
                else {
                    resolve(this);
                }
            });
        });
    }

    /**
     * This method translates the User into a valid JSON.
     * @returns the JSON of the User object. 
     */
    toJSON() {
        return {
            userid: this.userid,
            email: this.email,
            username: this.username,
            score: this.score
        }
    }
};