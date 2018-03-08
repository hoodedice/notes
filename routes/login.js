var express = require('express');
var router = express.Router();

function checkUserName(username, res) {
  USERNAMEquery = 'SELECT `localid` FROM `usercreds` WHERE `localid` = ?';
  var db = connect();

  db.execute(USERNAMEquery, [username], function (err, rows, fields) {
    if (err) {
      throw err;
    }
    else if (rows.length == 0) {
      console.log("couldn't find the username");
      res.redirect('/login.html');
    }
    else if (rows.length > 1) {
      //there was more than one id with the same username in the db
      //which is impossible, but in case it happens
      console.log("something happened");
      res.redirect('/login.html');
    }
    db.end();
  });

}

/**login.html*/
router.post('/login', function (req, res, next) {

  LOGINquery = 'SELECT `localpwd` FROM `usercreds` WHERE `localid` = ?';

  var db = connect();

  db.execute(LOGINquery, [req.body.userid], function (err, rows, fields) {
    if (!rows.length) res.redirect('/login');
    if (err) throw err;
    else {
      bcrypt.compare(req.body.password, rows[0].localpwd, function (err, result) {
        if (result == true) {
          console.log(req.session);
          userName = req.body.userid;
          req.session.userName = req.body.userid;
          userNamess = userName + "'s";
          luser = userName + "/";
          console.log(req.session);
          console.log("success!");
          res.redirect('/');
        }
        else {
          console.log("wrong password");
          res.redirect('/login');
        }
      });//bcrypt
    }
    db.end();
  });//LOGINquery


});

//TODO rewrite this. Self-explanatory
router.post('/logout', function (req, res) {
  userName = "";
});

module.exports = router;