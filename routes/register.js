var express = require('express');
var router = express.Router();
var date = require('./DateUUID');
var db = require('./Database');
var psw = require('./Password');

router.get('/', function (req, res) {
  res.render('register.ejs');
});


async function CheckForPreExistingUsers(username, email) {
  const DUPLICATEquery = 'SELECT `username`, `email` FROM `users` WHERE `username` = ? OR `email` = ?';
  try {
    const results = await db.connect(DUPLICATEquery, [username, email]);
    const rows = await results[0];
    if (rows.length > 0) {
      // console.log("CheckForPreExisting: " + rows[0].username + " " + rows[0].email);
      // console.log(Object.prototype.toString.call(rows));
      return false;
    } else {
      console.log("we're good to go!");  //return function;
      return true;
    }
  } catch (err) {
    throw err;
  }
}

async function addNewUser(params) {
  const ADDNEWUSERquery = 'CALL addUser(?, ?, ?, ?)';
  try {
    const results = await db.connect(ADDNEWUSERquery, params);
  } catch (err) {
    throw err;
  }
}

router.post('/', async function (req, res) {
  //  var datenow = uuid.getCurrentDateTime();

  var returnstatus = 1;

  //check if the username or email already exist in the db
  try {
    const results = await CheckForPreExistingUsers(req.body.username, req.body.email);
    if (results == false) {
      //TODO: Expand on this - need to properly indicate to client that the username or email they were using already exists
      //TODO: Use AJAX if possible.
      console.log("username or email was found");
      res.redirect('back');
    } else {
      //TODO: _Actually_ insert the new user in the db. Use addNewUser()
      res.redirect('/');
      const passwordHash = await psw.hashPassword(req.body.password);
      console.log(passwordHash);
      const params = [req.body.username, req.body.email, passwordHash, date.getCurrentDateTime()];
      const results = await addNewUser(params);
    }
  } catch (err) {
    throw err;
  }
});


module.exports = router;