var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session'); //session middleware
var passport = require('passport');
//initialize mongoose schemas
require('./models/models');
var index = require('./routes/index');
//var users = require('./routes/users');
var api = require('./routes/api');
var authenticate = require('./routes/authenticate')(passport);
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test-chirp');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

//Middleware section begin

//the order of the middlewares matters, the middleware will be run one by one with the order before the transaction reaches the route handler below.

app.use(logger('dev'));
app.use(session({
  secret:'asdfasdfasdf', //you have to put sth here, Express will use this to hash the session
  resave: false,
  saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

//Middleware section end

// Initialize Passport
var initPassport = require('./passport-init');
initPassport(passport); 


//Route handler section begin


//app.use('/users', users);
//we assigned express to use the api router at /api all routes in this file will have the prefix ''/api'
app.use('/', index);
app.use('/api', api); //the second argument is supposed to be a router object (see api.js)
app.use('/auth', authenticate);

//Route handler end


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
