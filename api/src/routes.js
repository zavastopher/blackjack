const express = require('express');
const tokenParse = require('cookie-parser');
const router = express.Router();
const score = require('./score.js');

router.use(express.static('static'));
router.use(express.urlencoded({extended: true}));
router.use(tokenParse());
router.use(express.json());

const userDAO = require('./UserDAO.js');

const {checkSession, stopSession, startSession} = require('./blackJackToken.js');

/**
 * API Method for logging in to the system
 */
router.post('/login', async (req, res) => {
    if (req.body.password && req.body.username) {
        let user = await userDAO.getUserByCredentials(req.body.username, req.body.password);
        if(user) {
            const data = {
                user: user
            }
            startSession(req, res, user);
            res.status(200).json(data);
        } else {
            res.status(400).json({error: "Failed Authentication"});
        }
        
    }
    else {
        res.status(401).json({error: "Not authenticated"});
    }
});

/**
 * Method logs the user out of the application
 */
router.post('/logout', (req, res) => {
    stopSession(req, res);
    res.json({success: true});
});

// Create user vaildates the data and returns a success boolean
router.post('/createAccount', async (req,res) => {
    console.log("Made it to API");
    //Try to create the user
    if (req.body.email && req.body.username && req.body.password && req.body.confirmPassword && req.body.confirmPassword == req.body.password && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
        try {
            await userDAO.createUser(req.body.email, req.body.username, req.body.password, req.body.confirmPassword);
            

            res.status(200).json({message:'Account Created'});

        } catch (err) {
            console.log('/createAccount error was thrown after createUser:')
            console.log(err);
            res.status(400).json({error: err});
        }
    } else {
        res.status(401).json({error: 'Invalid fields'});
    }
});

// Post User Highscore to the database returns false if the user doesn't exist
router.put('/postScore', checkSession,  (req,res) => {
    console.log(req.body);
    score.postuserScore(req.body.username, req.body.highscore).then(
        res.status(200).json({messge: "Highscore pushed successfully"})
    ).catch(err => {
        res.status(400).json({error: "Something went wrong with posting the score"});
    })
});

// getUserHighscore returns the users highscore and throws an error if the user score cannot be found for any reason.
router.get('/getScore', checkSession, (req, res) => {
    score.getUserScore(req.user.username).then(score => {
        console.log(score);
        res.status(200).json({"score": score});
    }).catch(err => {
        res.status(404).json({"error": "Cannot find the score"});
    });
});

//FIXED
router.get('/leaderboard/:username', checkSession, (req, res) => {
    score.getLeaderBoard(req.params.username).then(leaderBoard => {
        res.status(200).json(leaderBoard);
    }).catch(err => {
        res.status(404).json({error: err});
    });
});

/**
 * 
 */
router.get('/getCurrentUser', checkSession, (req, res) => {
    return res.status(200).json(req.user);
});

module.exports = router;
