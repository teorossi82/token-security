var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/*############################################################################*/
/*############### INIZIO PARTE DI GESTIONE TOKEN SECURITY ####################*/
/*############################################################################*/
var db = require('./my_modules/token_security/models/phantom_db.js');
var response = require('./my_modules/token_security/models/response.js');
var manage_token = require('./my_modules/token_security/models/manage_token');

app.all('/*', function(req, res, next) {
  if (req.method == 'OPTIONS') {
		res.status(200).end();
	} else {
		res.header("Access-Control-Allow-Origin", "*")
		next();
	}
});

app.all('/api/*', [require('./my_modules/token_security/middlewares/validateToken')]);
app.all('/api/*', function(req,res,next){db.validateUser(req,res,next)});
app.all('/token/*', [require('./my_modules/token_security/middlewares/validateRefreshToken')]);
app.post("/token/new",function(req,res){
  var objToken = manage_token.genToken(req.headers['x-access-username']);
  res.json(objToken);
});
app.post('/login', function(req,res){db.checkLogin(req,res,response.responseMessage)});
/*############################################################################*/
/*############### FINE PARTE DI GESTIONE TOKEN SECURITY ######################*/
/*############################################################################*/

app.use('/', routes);

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
    res.send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});


module.exports = app;
