/* contains all router post and get methods used by the webapp*/
/* however, each subsequent .html view shall have its own .js file */
/* all requires shall be in this folder */

var express = require('express');
var router = express.Router();

var entities = require('html-entities').AllHtmlEntities;
var mysql = require('mysql2');
var bcrypt = require('bcrypt');
var session = require('express-session');

const saltRounds = 14;

Entity = new entities();

//TODO temporary variables, remove
var userName ="";
var userNamess ="";
var luser="";

/* set up all third party connections */

//set up sql connection
function connect(){
  var db = mysql.createConnection({
    host     : 'localhost',
    user     : '',
    password : '',
    database : 'notes'
  });

  db.connect();
  return db;
}

/* set up express-session, connect to redis */
/*router.use(session({
    userName: "",
    secret: '',
    cookie: { maxAge: 2628000000 },
    genid: function(req){
      return "test";
    },
    store: new (require('express-sessions'))({
        storage: 'redis',
    })
}));

*/

//Router renders
router.get('/index', function(req, res, next){
  res.redirect('/');
})

router.get('/', function(req, res, next) {
  res.render('index.ejs', {user: userNamess});
});

router.get('stylesheets/normalize.min.css', function(req, res){
  res.sendFile('/public/stylesheets/normalize.min.css');
});

router.get('stylesheets/style.css', function(req, res){
  res.sendFile('/public/stylesheets/style.css');
})

router.get('/login', function(req, res, next){
  
  //TODO Call a function to do some backend stuff before we send it over
  //TODO Rather, we need to push the file below into that function, and THEN modify
  // it within that function itself
  res.render('login.ejs');
  console.log("login page is accessible");
});

router.get('/register', function(req, res, next){
  
  //TODO Call a function to do some backend stuff before we send it over
  //TODO Rather, we need to push the file below into that function, and THEN modify
  // it within that function itself
  res.render('register.ejs');
  console.log("register page is accessible");
});

router.post('/', function(req, res, next){
  thisNote = new newNote();
  //bare minimum required content to upload is just the paste
  if (req.body.content != "") {
    //prepare the note -- have to replace empty strings with prefilled vales
    //Generate a unique URL
    var uniqURL = randString({length:32});
    console.log(uniqURL);

    thisNote.uid = uniqURL;
    thisNote.content = Entity.encode(req.body.content);
    if (req.body.title != "") thisNote.title = req.body.title;
    if (req.body.desc != "") thisNote.description = req.body.desc;
    //TODO Async this!
    submitNote(thisNote, function(res){
      //redirect user to their submitted paste
      res.redirect('/pastes/' + luser + uniqURL);
    }, res);
  }
});

router.get('/pastes/:userName/:uniqURL', function(req, res, next){
  findquery = 'SELECT * FROM `userpaste` WHERE `uid` = ? AND localid = ?';
  selquery = 'SELECT * FROM `pastes` WHERE uid = ?';

  var db = connect();

  db.execute(findquery, [req.params.uniqURL, userName], function(err, rows, fields) {
    if (!rows.length) res.status(404);
    if (err) {
      throw err;
    }
    if (!rows.length) res.redirect("/");
    else {
      db.execute(selquery, [req.params.uniqURL], function(err, rows, fields) {
        if (err) {
          throw err;
        }
        if (!rows.length) res.redirect("/");
        content = rows[0].content;
        title = rows[0].title;
        desc = rows[0].description;

        res.render('view_note.ejs', {title: title, paste: content, description: desc});
        db.end();
      });
    }
  });
  //TODO Call a function to do some backend stuff before we send it over
  //TODO Rather, we need to push the file below into that function, and THEN modify
  // it within that function itself
});


router.get('/pastes/:uniqURL', function(req, res, next){
  selquery = 'SELECT * FROM `pastes` WHERE `uid` = ? AND isprivate = 0';

  var db = connect();

  db.execute(selquery, [req.params.uniqURL], function(err, rows, fields) {
    if (err) {
      throw err;
    }
    if (!rows.length) res.redirect("/");
    else { content = rows[0].content;
    title = rows[0].title;
    desc = rows[0].description;

    db.end();
    }
    res.render('view_note.ejs', {title: title, paste: content, description: desc});
  });
  //TODO Call a function to do some backend stuff before we send it over
  //TODO Rather, we need to push the file below into that function, and THEN modify
  // it within that function itself
});


router.get('/pastes/raw/:uniqURL', function(req, res) {
  selquery = 'SELECT `content` FROM `pastes` WHERE `uid` = ? AND `isprivate` = 0';
  var txt = 'IT DOESNT WORK';

  var db = connect();

  db.execute(selquery, [req.params.uniqURL], function(err, rows, fields) {
    if (err) {
      throw err;
    }
    txt = rows[0].content;
    res.set('content/text');
    res.send(txt);
  });

  db.end();

});

function newNote(){
  return Object.assign({
    uid: "",
    title: "untitled",
    uploadt: moment().format("YYYY-MM-DD HH:mm:ss"),
    content: "",
    description: "",
    wrapstyle: 1, //not implemented
    indstyle:1, //not implemented
    indsize:1, //not implemented
    isprivate:0,
    tags: "", //not implemented
    folder:"/", //not implemented
    dump: function(){
      return [this.uid, this.title, this.uploadt, this.content, this.description, this.wrapstyle, this.indstyle, this.indsize, this.isprivate, this.tags, this.folder];
    }
  });
}

/** submitNote 
 * send the new paste to the database
 * Should only be called by callback of router.post('/'...
 * sb is the callback function for this function
 */
function submitNote(note, cb, res){
  INSERTNOTEquery = 'INSERT INTO `pastes` VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  CONNECTUSER = 'INSERT INTO `userpaste` VALUES(?, ?, ?)';

  
  console.log(thisNote.dump());
  if (userName != ""){
      thisNote.isprivate =1;
  }
  var inserts = [thisNote.dump()];

  var db = connect();
  

  db.execute(INSERTNOTEquery, thisNote.dump(), function(err, rows, fields) {
    if (err) throw err;
    else {
      console.log("success");
    }
    if (userName != ""){
      db.execute(CONNECTUSER, [thisNote.uid, userName, 1], function(err, rows, fields){
        if (err) throw err;
        console.log("success with logged in person");
      })
    }
    db.end();
    callback = cb(res);
  });
}

function checkUserName(username, res){
  USERNAMEquery = 'SELECT `localid` FROM `usercreds` WHERE `localid` = ?';
  var db = connect();

  db.execute(USERNAMEquery, [username], function(err, rows, fields) {
    if (err) {
      throw err;
    }
    else if (rows.length == 0){
      console.log("couldn't find the username");
      res.redirect('/login.html');
    }
    else if (rows.length > 1){
      //there was more than one id with the same username in the db
      //which is impossible, but in case it happens
      console.log("something happened");
      res.redirect('/login.html');
    }
    db.end();
  });

}

/**login.html*/

router.post('/login', function(req, res, next){

  LOGINquery = 'SELECT `localpwd` FROM `usercreds` WHERE `localid` = ?';

  var db = connect();
    
  db.execute(LOGINquery, [req.body.userid], function(err, rows, fields) {
    if (!rows.length) res.redirect('/login');
    if (err) throw err;
    else {
      bcrypt.compare(req.body.password, rows[0].localpwd, function(err, result){
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
router.post('/logout', function(req, res){
  userName = "";
});


router.post('/register*', function(req, res, next){
  //check if the username already exists in the db
  USERNAMEquery = 'SELECT `localid` FROM `usercreds` WHERE `localid` = ?';
  EMAILquery = 'SELECT `email` FROM `usercreds` WHERE `email` = ?';

  var db = connect();

  db.execute(USERNAMEquery, [req.body.userid], function(err, rows, fields) {
    if (err) {
      throw err;
    } 
    else if (rows.length == 1){
      console.log("username already exists");
      res.redirect('/register');
    }
    else if (rows.length > 1){
      //there was more than one id with the same username in the db
      //which is impossible, but in case it happens
      console.log("something happened");
      res.redirect('/login');
    }
    else {
    //check if the email already exists in the db
      db.execute(EMAILquery, [req.body.email], function(err, rows, fields) {
        if (err) {
          throw err;
        }
        else if (rows.length == 1){
          console.log("email already exists");
          res.redirect('/register');
        }
        else if (rows.length > 1){
          //there was more than one id with the same email in the db
          //which is impossible, but in case it happens
          console.log("something happened");
          res.redirect('/login');
        }
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
          if (err) throw err;
          console.log(hash);
          // Store hash in your password DB.
          SAVEPASSHASH = 'INSERT INTO usercreds VALUES(?, ?, ?)';
          db.execute(SAVEPASSHASH, [req.body.userid, hash, req.body.email], function(err, rows, fields) {
            if (err) throw err;
            db.end();
            res.redirect('/login');
          });
        });
      });
    }
  });
  //TODO check if the passwords match -- find a way to do it on client side
  
});





module.exports = router;
