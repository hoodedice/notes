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

// function newNote() {
//   return Object.assign({
//     uid: "",
//     title: "untitled",
//     uploadt: moment().format("YYYY-MM-DD HH:mm:ss"),
//     content: "",
//     description: "",
//     wrapstyle: 1, //not implemented
//     indstyle: 1, //not implemented
//     indsize: 1, //not implemented
//     isprivate: 0,
//     tags: "", //not implemented
//     folder: "/", //not implemented
//     dump: function () {
//       return [this.uid, this.title, this.uploadt, this.content, this.description,
//       this.wrapstyle, this.indstyle, this.indsize, this.isprivate, this.tags, this.folder];
//     }
//   });
// }



module.exports = router;