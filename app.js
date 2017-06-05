var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var index = require('./routes/index');
var users = require('./routes/users');
var mongoose = require('mongoose');
var passport = require('passport');
var app = express();
var practice = require('./routes/practice')(app);
var options = {
  host: 'localhost',
  port: 3306,
  user:'root',
  password:'tbffl20327',
  database: 'instagram'
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
//session
app.use(session({
  secret: '1234SKFJE#$%@#&*SDFFH13fabvkjlr',
  resave: false,
  saveUninitialized:true,
  store: new MySQLStore(options)
}));

app.get('/session',function(req,res){
  res.send('name:'+req.session.name+ "<br>password:"+req.session.password);
});



app.use('/', index);
app.use('/users', users);
app.use('/practice',practice);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
