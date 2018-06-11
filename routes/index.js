var express = require('express');
var router = express.Router();

var entities = require('html-entities').AllHtmlEntities;
var bcrypt = require('bcrypt');
var session = require('express-session');

var Note = require("./Note").Note;

var db = require('./Database');

//simply redirect /index to /
router.get('/index', function (req, res, next) {
  next();
})

router.get('/', async function (req, res) {
  if (req.session.user != null) {
    res.render('index.ejs',
      { user: req.session.user.name + "'s" });
  } else {
    res.render('index.ejs', { user: null, logout_link: null });
  }
});

router.get('stylesheets/normalize.min.css', function (req, res) {
  res.sendFile('/public/stylesheets/normalize.min.css');
});

router.get('stylesheets/style.css', function (req, res) {
  res.sendFile('/public/stylesheets/style.css');
})

module.exports = router;