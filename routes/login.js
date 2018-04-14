var express = require('express');
var router = express.Router();

var db = require('./Database');
var psw = require('./Password');


router.get('/', function (req, res, next) {
  res.render('login.ejs');
  console.log("login page is accessible");
});

/**
 * @function CheckUsername
 * 
 * @param {string} username 
 * @returns {Promise | password }
 */
async function CheckUsername(username) {
  const USERNAMEquery = 'SELECT `password` FROM `users` WHERE `username` = ?';
  try {
    const passwordHash = await db.connect(USERNAMEquery, [username]);
    const rows = await passwordHash[0];
    console.log("rows length: " + rows.length);
    if (rows.length == 0) {
      console.log("couldn't find the username");
      return null;
    } else if (rows.length > 1) {
      throw new Error("something weird happened: checkUserName(): login.js");
    } else {
      console.log(rows);
      return await rows[0].password;
    }
  } catch (err) {
    throw err;
  }
}
/**
 * @function AuthenticateUser
 * 
 * @param {any} username 
 * @param {any} password 
 * @param {any} hash 
 */
async function AuthenticateUser(username, password, hash) {
  
}

/**login.html*/
router.post('/', async function (req, res) {

  try {
    console.log("checkusername: " + req.body.username);
    const hash = await CheckUsername(req.body.username);
    console.log(hash);
    if (hash != null) {
      //username was found on the database
      console.log("password: " + hash);
      const result = await psw.comparePassword(req.body.password, hash);
      console.log(result);
      if (result) {
        //TODO: log them in
        console.log("successful!");
        req.session.user = {
          name: req.body.username
        };
        res.redirect('/index');
      } else {
        //password isn't present on the database
        //TODO: indicate to the user that the password they typed in is incorrect
        console.log("password is incorrect");
        res.redirect('back');
      }
    } else if (hash == null) {
      //username isn't present on the database
      //TODO: indicate to the user that the username they typed in is incorrect
      res.redirect('back');
    } else {
      throw new Error("something weird happened: Router.Post: Login.js");
    }
  } catch (err) {
    throw err;
  }

  // db.execute(LOGINquery, [req.body.userid], function (err, rows, fields) {
  //   if (!rows.length) res.redirect('/login');
  //   if (err) throw err;
  //   else {
  //     bcrypt.compare(req.body.password, rows[0].localpwd, function (err, result) {
  //       if (result == true) {
  //         console.log(req.session);
  //         userName = req.body.userid;
  //         req.session.userName = req.body.userid;
  //         userNamess = userName + "'s";
  //         luser = userName + "/";
  //         console.log(req.session);
  //         console.log("success!");
  //         res.redirect('/');
  //       }
  //       else {
  //         console.log("wrong password");
  //         res.redirect('/login');
  //       }
  //     });//bcrypt
  //   }
  //   db.end();
  // });//LOGINquery


});

//TODO rewrite this. Self-explanatory
router.post('/logout', function (req, res) {
  userName = "";
});

module.exports = router;