var express = require('express');
var router = express.Router();

var db = require('./Database');
var psw = require('./Password');

var User = require('./User').User;


router.get('/', function (req, res) {
  res.render('register.ejs', { message : null });
});

/** checks if the user already exists on the database **/
async function CheckForPreExistingUsers(username, email) {
  const DUPLICATEquery = 'SELECT `username` FROM `users` WHERE `username` = ? OR `email` = ?';
  try {
    const results = await db.connect(DUPLICATEquery, [username, email]);
    const rows = await results[0];
    if (rows[0] != undefined) {
      //username or email exists
      return true;
    } else {
      //we're good to go
      return false;
    }
  } catch (err) {
    throw err;
  }
}

/** Calls the addUser routine on the database to add the new user **/
async function AddNewUser(params) {
  const ADDNEWUSERquery = 'CALL addUser(?, ?, ?, ?)';
  try {
    const results = await db.connect(ADDNEWUSERquery, params);
  } catch (err) {
    throw err;
  }
}


router.post('/', async function (req, res) {
  try {
    //check if the username or email already exist in the db
    const isUserExist = await CheckForPreExistingUsers(req.body.username, req.body.email);
    if (isUserExist == true) {
      // TODO: Use WebSockets when possible to indicate the following
      res.render('register.ejs', { message: "A user with that username or email id already exists"});
    } else {
      // NOTE:  This test uses plaintext password comparision, which should be totally 
      //        fine since we're not saving to disk
      if (req.body.password != req.body.password2) {
        // TODO: Use WebSockets when possible to indicate the following
        res.render('register.ejs', { message: "Passwords do not match"});
        return;
      }
      const passwordHash = await psw.hashPassword(req.body.password);

      let user = new User(req.body.username, req.body.email);
      const params = [user.name, user.email, passwordHash, user.join_date];
      const results = await AddNewUser(params);
      res.redirect('/');
    }
  } catch (err) {
    //TODO: Error Handling
    res.render('error.ejs', {
      status: 500,
      message: err,
      error: null,
      stack: null
    });
  }

});

module.exports = router;