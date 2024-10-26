//Handles encrypted data
const jwt = require('jsonwebtoken');

//Make a session token name
const SESSION_TOKEN_NAME = "blackJackToken";

//Make an API secret value
//TODO: Add this and ask group how we are storing it
const BLACKJACK_SECRET = "";

/**
 * Method verifys the Blackjack session.
 * @param {*} req the request body
 * @param {*} res the result
 * @param {*} next the next token
 * @returns if the user is unauthenticated.
 */
exports.checkSession = (req, res, next) => {
    let token = null;

    //If there is no cookie at the specified index
    if (!req.cookies[SESSION_TOKEN_NAME]) {
        //Get the authorization header
        const authorization_header = req.get('Authorization');
        //Check the authorization header
        if (authorization_header && authorization_header.startsWith("Bearer ")) {
            token = authorization_header.split(" ")[1];
        }
    }
    //If there is a cookie at the specified index
    else {
        token = req.cookies[SESSION_TOKEN_NAME];
    }

    if (!token) {
        res.status(401).json({error: "Unauthenticated"});
        return;
    }

    //By now in the code, there is no shot that we dont have a 
    //token. Now, we can validate the token.

    try {
        const tokenData = jwt.verify(token, BLACKJACK_SECRET);
        req.user= tokenData.user;
        next();
    }
    catch (e) {
        res.status(401).json({error: "Token not authenticated."});
        return;
    }
}

/**
 * Method stops the token session
 * @param {*} req the request body
 * @param {*} res the result
 */
exports.stopSession = (req, res) => {
    //Send an expired cookie
    res.cookie(SESSION_TOKEN_NAME, token, {
        secure: true,
        httpOnly: true,
        maxAge: -1
    });
}

/**
 * This method makes the token for the BlackJack session
 * @param {*} req the request body
 * @param {*} res the result
 * @param {*} user the user data being passed in
 */
exports.startSession = (req, res, user) => {
    let blackJackData = {
        user: user,
        //TODO: Ask team about what a reasonable expiration time
        //be for the token
        exp: 0
    }

    //Make the token and sign it
    const BJtoken = jwt.sign(blackJackData, BLACKJACK_SECRET);

    //Send the token in the skin of a cookie
    res.cookie(SESSION_TOKEN_NAME, BJtoken, {
        httpOnly: true,
        secure: true,
        //TODO: ask team for a reasonable time interval for
        //a cookie
        maxAge: 0
    });

};
