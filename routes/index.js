/* contains all router post and get methods used by the webapp*/
/* however, each subsequent .html view shall have its own .js file */
/* all requires shall be in this folder */

var express = require('express');
var router = express.Router();

var entities = require('html-entities').AllHtmlEntities;
var bcrypt = require('bcrypt');
var session = require('express-session');

var uuid = require('./DateUUID');

var Note = require("./Note").Note;

const saltRounds = 14;

Entity = new entities();

//TODO temporary variables, remove
var userName = "";
var userNamess = "";
var luser = "";


//Router renders

//simply redirect /index to /
router.get('/index', function (req, res, next) {
  next();
})

router.get('/', function (req, res, next) {
  if (req.session.user != null) {
    res.render('index.ejs', { user: req.session.user.name + "'s"});
  } else {
    res.render('index.ejs', { user: null });
  }
});

router.get('stylesheets/normalize.min.css', function (req, res) {
  res.sendFile('/public/stylesheets/normalize.min.css');
});

router.get('stylesheets/style.css', function (req, res) {
  res.sendFile('/public/stylesheets/style.css');
})



router.get('/pastes/:userName/:uniqURL', function (req, res, next) {
  findquery = 'SELECT * FROM `userpaste` WHERE `uid` = ? AND localid = ?';
  selquery = 'SELECT * FROM `pastes` WHERE uid = ?';

  var db = connect();

  db.execute(findquery, [req.params.uniqURL, userName], function (err, rows, fields) {
    if (!rows.length) res.status(404);
    if (err) {
      throw err;
    }
    if (!rows.length) res.redirect("/");
    else {
      db.execute(selquery, [req.params.uniqURL], function (err, rows, fields) {
        if (err) {
          throw err;
        }
        if (!rows.length) res.redirect("/");
        content = rows[0].content;
        title = rows[0].title;
        desc = rows[0].description;

        res.render('view_note.ejs', { title: title, paste: content, description: desc });
        db.end();
      });
    }
  });
  //TODO Call a function to do some backend stuff before we send it over
  //TODO Rather, we need to push the file below into that function, and THEN modify
  // it within that function itself
});


router.get('/pastes/:uniqURL', function (req, res, next) {
  selquery = 'SELECT * FROM `pastes` WHERE `uid` = ? AND isprivate = 0';

  var db = connect();

  db.execute(selquery, [req.params.uniqURL], function (err, rows, fields) {
    if (err) {
      throw err;
    }
    if (!rows.length) res.redirect("/");
    else {
      content = rows[0].content;
      title = rows[0].title;
      desc = rows[0].description;

      db.end();
    }
    res.render('view_note.ejs', { title: title, paste: content, description: desc });
  });
  //TODO Call a function to do some backend stuff before we send it over
  //TODO Rather, we need to push the file below into that function, and THEN modify
  // it within that function itself
});


router.get('/pastes/raw/:uniqURL', function (req, res) {
  selquery = 'SELECT `content` FROM `pastes` WHERE `uid` = ? AND `isprivate` = 0';
  var txt = 'IT DOESNT WORK';

  var db = connect();

  db.execute(selquery, [req.params.uniqURL], function (err, rows, fields) {
    if (err) {
      throw err;
    }
    txt = rows[0].content;
    res.set('content/text');
    res.send(txt);
  });

  db.end();

});

function newNote() {
  return Object.assign({
    uid: "",
    title: "untitled",
    uploadt: moment().format("YYYY-MM-DD HH:mm:ss"),
    content: "",
    description: "",
    wrapstyle: 1, //not implemented
    indstyle: 1, //not implemented
    indsize: 1, //not implemented
    isprivate: 0,
    tags: "", //not implemented
    folder: "/", //not implemented
    dump: function () {
      return [this.uid, this.title, this.uploadt, this.content, this.description,
      this.wrapstyle, this.indstyle, this.indsize, this.isprivate, this.tags, this.folder];
    }
  });
}



module.exports = router;