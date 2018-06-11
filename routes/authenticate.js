var express = require('express');
var router = express.Router();

var db = require('./Database');
var psw = require('./Password');

var User = require('./User').User;

router.get('/', function (req, res, next) {
  res.render('login.ejs', { message : null });
});

async function CheckUsername(username) {
  //TODO: make this a stored procedure on the database
  const USERNAMEquery = 'SELECT * FROM `users` WHERE `username` = ?';
  try {
    const UserRow = await db.connect(USERNAMEquery, [username]);
    const rows = await UserRow[0];
    if (rows[0] == undefined || rows[0].length == 0) {
      //username was not found
      return await [null, null];
    } else if (rows[0].length > 1) {
      //technically will never happen in mysql since UNIQUE is properly set on the appropriate columns
      throw new Error("more than one user returned: checkUserName(): login.js");
    } else {
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
      //username was found on the database, we have their password hash
      const result = await psw.comparePassword(req.body.password, hash);
      if (result) {
        //credentials match, log them in
        req.session.user = saveduser;
        for (key in req.session.user) console.log(key + ": " + req.session.user[key]);
        res.redirect('/index');
      } else {
        //incorrect password
        res.render('login.ejs', { message: "Incorrect username or password"});
      }
    } else if (hash == null) {
      //username isn't present on the database
      res.render('login.ejs', { message: "Incorrect username or password"});
    } else {
      throw "Something weird happened: Router.Post: Login.js";
    }
  } catch (err) {
    res.render('error.ejs', {
      status: 500,
      message: err,
      error: null,
      stack: null
    });
  }

});


router.get('/logout', function (req, res) {
  req.session.destroy(err => {
    if (err) throw err;
  });
  res.redirect('/index');
});

module.exports = router;