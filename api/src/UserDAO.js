const dbConnect = require('./DBConnect');
const authorize = require('./authBack');
const userClass = require('./User')

/**
 * Method gets the user with certain details
 * @param {*} username username of the user
 * @param {*} password password of the user
 * @returns 
 */
async function getUserByCredentials(username, password) {
  //Submits a query searching the database for a user with
  //the same username
  return authorize.findUsername(username).then(user => {
    if (user) { // we found our user
      //Validate the password
      let userObject = new userClass(user);
      return userObject.validatePassword(password).then((resolve) => {
        return resolve;
      })
      .catch((reject) => {
        console.log(reject);
        return false;
      });
    }
    // At this point, if there was a user,
    //it would have returned already. Throw
    //an error indicating that there is no
    //user.
    return false;
  });
}

async function createUser(email, username, password, confirmPassword) {
  //Checks that all of the fields are filled
  if (password == '' || username == '' || email == '' || confirmPassword == '') {
    throw new Error("All fields must be filled");
  }
  //Does a query to check if there is a user with a preexisting username
  //If its successfully finds the user, it throws an error because it 
  // cannot have 2 users with the same name.
  console.log("at findUsername");

  var userExists = await authorize.findUsername(username).then((user) => {
    if(user) {
      throw new Error('User already exists');
    }
    return false;
  }).catch( err => {
    console.log(err);
    return true;
  });

  if(userExists) throw new Error('User already exists');
  //Does a query to check if there is an email already associated with a user
  //if it finds anything, it throws an error because thats not supposed to happen.
  console.log("at findEmail");

  userExists = await authorize.findEmail(email).then((user) => {
    if(user) {
      console.log("error at DAO 49");
      throw new Error('User already exists');
      // return true;
    }
    return false;
  }).catch(err=> {
    console.log(err);
    return true;
  });

  if(userExists)throw new Error('User already exists');

  //Checks that the password and the confirmPassword are the same. if not, an error is thrown
  authorize.checkPasswords();

  //Now that all of the checks have been made, we can create the new user
  //Make the score
  const score = 1000;

  //Get the salt
  const salt = authorize.getSalt();

  //Encode the password
  console.log("at hashPassword");
  authorize.hashPassword(password, salt, (err, hashWord) => {
    if(err) {
      console.log("Error at DAO 70");
      throw new Error('Could not create hashed password');
    } else {
      console.log("at query 73");
      dbConnect.query('INSERT INTO user (email, username, userpassword, usersalt, score) VALUES (?, ?, ?, ?, ?)', [email, username, hashWord, salt, score]);

    }
  });
}

//Export the method
module.exports = {
  getUserByCredentials: getUserByCredentials,
  createUser: createUser
};
