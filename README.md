# token-security

[Token security]() Functionality to protect /api/* uri with login and access-token.

## Copy in your server directory the folder my_modules
## Copy in app.js these lines
```javascript

// the phantom_db.js file simulate the presence of a db but not implement it. So you have to modify this file to get access to user table/collection in your db.
var db = require('./my_modules/token_security/models/phantom_db.js');
var response = require('./my_modules/token_security/models/response.js');
var manage_token = require('./my_modules/token_security/models/manage_token');
// enable cors call
app.all('/*', function(req, res, next) {
  if (req.method == 'OPTIONS') {
		res.status(200).end();
	} else {
		res.header("Access-Control-Allow-Origin", "*")
		next();
	}
});

// this middelwares protect /api/* uri with access-token
app.all('/api/*', [require('./my_modules/token_security/middlewares/validateToken')]);
// this middelwares protect /api/* uri from user not authorized (auth===false in db)
app.all('/api/*', function(req,res,next){db.validateUser(req,res,next)});
// this middelwares check refresh-token to generated a new access-token
app.all('/token/new', [require('./my_modules/token_security/middlewares/validateRefreshToken')]);

app.post("/token/new",function(req,res){
  var objToken = manage_token.genToken(req.headers['x-access-username']);
  res.json(objToken);
});
app.post('/login', function(req,res){db.checkLogin(req,res,response.responseMessage)});

```
### To have access to all /api/* uri the client must do:
### 1 - a post request to /login with 2 field in body: username and password
### 2 - if the login have success the request return a json object with these fields: access_token, expires_access_token, refresh_token, expires_refresh_token, user
### 3 - after success login, to have access to /api/* uri the client must do all request with "x-access-token": access_token and "x-access-username": user.username in the header
### 4 - when access_token expires, the client must do a post request to /token/new with "x-access-token": access_token, "x-refresh-token": refresh_token and "x-access-username": user.username in the header to renew the tokens

### In the file config/secret you can set the passphrase to encode and decode the tokens and the validity of access_token and refresh_token

### This functionality use node-jwt-simple to encode e decode the access-token and refresh-token

# node-jwt-simple

[JWT(JSON Web Token)](http://self-issued.info/docs/draft-jones-json-web-token.html) encode and decode module for node.js.

## Install

    $ npm install jwt-simple

## Usage

```javascript
var jwt = require('jwt-simple');
var payload = { foo: 'bar' };
var secret = 'xxx';

// encode
var token = jwt.encode(payload, secret);

// decode
var decoded = jwt.decode(token, secret);
console.log(decoded); //=> { foo: 'bar' }
```

### Algorithms

By default the algorithm to encode is `HS256`.

The supported algorithms for encoding and decoding are `HS256`, `HS384`, `HS512` and `RS256`.

```javascript
// encode using HS512
jwt.encode(payload, secret, 'HS512')
```
