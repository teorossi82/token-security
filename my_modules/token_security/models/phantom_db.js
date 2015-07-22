var jwt = require('jwt-simple');
var response = require('./response');
var manage_token = require('./manage_token');

var database = {
	utenti:[
		{
			"username":"pippo",
			"password":"1234",
			"auth":1
		},
		{
			"username":"pluto",
			"password":"4321",
			"auth":0
		}
	]
}

exports.checkLogin = function (req, res, next) {
	var clbReturn = {"err":null,"user":[]};
	try{
		for(var i=0;i<database.utenti.length;i++){
			if(database.utenti[i].username===req.body.username){
				clbReturn = {"err":null,"user":[database.utenti[i]]}
				break
			}
		}
	}
	catch(err){
		clbReturn = {"err":{"status": 500,"code":100,"message":"Errore nel database"},"user":null}
	}
	if (clbReturn.err)
		return response.errorMessage(req, res, 500, clbReturn.err);
	if (clbReturn.user.length === 0)
		return response.errorMessage(req, res, 404, "Utente non trovato");
	if (clbReturn.user[0].password != req.body.password)
		return response.errorMessage(req, res, 401, "Password errata");
	if (clbReturn.user[0].auth != true)
		return response.errorMessage(req, res, 409, "Utente non autorizzato");
	var objUserToken = manage_token.genToken(clbReturn.user);
	next(req,res,200,objUserToken);
}

exports.validateUser = function(req, res, next){
	var clbReturn = {"err":null,"user":[]};
	try{
		for(var i=0;i<database.utenti.length;i++){
			if(database.utenti[i].username===req.headers["x-access-username"]){
				clbReturn = {"err":null,"user":[database.utenti[i]]}
				break
			}
		}
	}
	catch(err){
		clbReturn = {"err":{"status": 500,"code":100,"message":"Errore nel database"},"user":null}
	}
	if (clbReturn.err)
		return response.errorMessage(req, res, 500, clbReturn.err);
	if(clbReturn.user.length === 0)
		return response.errorMessage(req, res, 404, {"status": 404,"code":100,"message":"Utente non trovato"});
	if(clbReturn.user[0].auth === 0)
		return response.errorMessage(req, res, 409, {"status": 409,"code":100,"message":"Utente non autorizzato"});
	next();
}