var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');

var redis = require('redis');
var session = require('express-session');
var store = require('connect-redis')(session);

var index = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/register');
//var user = require('./routes/User');
var submitNote = require('./routes/submitNote');
var viewNote = require('./routes/viewNote');

var app = express();

if (app.get('env') === 'production') {
  var sess = {
    store: new store({
      host: 'localhost',
      port: 6379,
      db: 3,
      ttl: 12 * 60 * 60, //12 hours
    }),
    maxAge: 12 * 60 * 60 * 1000, //12 hours
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    logErrors: true
  }
}

if (app.get('env') === 'development') {
  var sess = {
    store: new store({
      host: 'localhost',
      port: 6379,
      db: 3,
      ttl: 60, //1 minute
    }),
    maxAge: 60 * 1000, //1 minute
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    logErrors: true
  }
}

app.use(session(sess));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(partials());
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());

app.use(express.static(__dirname + "/stylesheets/"));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/index', index);
app.use('/', viewNote);
app.use('/', index);
app.use('/register', register);
app.use('/login', login);
//app.use('/users', users);
app.use('/submitNote', submitNote);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  });
}

// production error handler
// no stacktraces leaked to user
/*app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
*/

module.exports = app;
