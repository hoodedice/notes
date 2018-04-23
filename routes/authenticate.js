var express = require('express');
var router = express.Router();

var db = require('./Database');
var psw = require('./Password');

var User = require('./User').User;

router.get('/', function (req, res, next) {
  res.render('login.ejs');
  //console.log("login page is accessible");
});

async function CheckUsername(username) {
  const USERNAMEquery = 'SELECT * FROM `users` WHERE `username` = ?';
  try {
    const passwordHash = await db.connect(USERNAMEquery, [username]);
    const rows = await passwordHash[0];
    //console.log("rows length: " + rows.length);
    if (rows.length == 0) {
      //console.log("couldn't find the username");
      return null;
    } else if (rows.length > 1) {
      throw new Error("something weird happened: checkUserName(): login.js");
    } else {
      //console.log(rows);
      const user = new User(rows[0].username, rows[0].email, rows[0].id, 
        rows[0].fname, rows[0].lname, rows[0].join_date);
      return await [rows[0].password, user];
    }
  } catch (err) {
    throw err;
  }
}

/**login.html*/
router.post('/login', async function (req, res) {

  try {
    const [hash, saveduser] = await CheckUsername(req.body.username);
    if (hash != null && saveduser != null) {
      //username was found on the database
      const result = await psw.comparePassword(req.body.password, hash);
      if (result != null) {
        //credentials match, log them in
        req.session.user = saveduser;
        for (key in req.session.user) console.log(key + ": " + req.session.user[key]);
        res.redirect('/index');
      } else {
        //password isn't present on the database
        //TODO: indicate to the user that the password they typed in is incorrect
        //console.log("password is incorrect");
        res.redirect('back');
      }
    } else if (hash == null) {
      //username isn't present on the database
      //TODO: indicate to the user that the username they typed in is incorrect
      res.redirect('back');
    } else {
      throw new Error("Something weird happened: Router.Post: Login.js");
    }
  } catch (err) {
    throw err;
  }

});


router.get('/logout', function (req, res) {
  req.session.destroy(err => {
    if (err) throw err;
  });
  res.redirect('/index');
});

module.exports = router;