var jwt = require('jwt-simple');
module.exports = function(req, res, next) {
    // When performing a cross domain request, you will recieve
    // a preflighted request first. This is to check if our the app
    // is safe. 
    // We skip the token outh for [OPTIONS] requests.
    //if(req.method == 'OPTIONS') next();
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    var refresh_token = (req.body && req.body.refresh_token) || (req.query && req.query.refresh_token) || req.headers['x-refresh-token'];
    if (token && refresh_token) {
        try {
            var decoded = jwt.decode(refresh_token, require('./../config/secret.js').refresh_token());
            if (decoded.ref_exp <= Date.now()) {
                res.status(400);
                res.json({
                    "status": 400,
                    "code":102,
                    "message": "Refresh Token scaduto"
                });
                return;
            }
            if(decoded.access_token!=token){
                res.status(400);
                res.json({
                    "status": 400,
                    "code":100,
                    "message": "Refresh Token non valido"
                });
                return;
            }
            next();
        } catch (err) {
            res.status(500);
            res.json({
                "status": 500,
                "message": "Errore nel controllo del refresh token",
                "code":100,
                "error": err
            });
        }
    } else {
        res.status(401);
        res.json({
            "status": 401,
            "code":100,
            "message": "Access Token o Refresh Token non validi"
        });
        return;
    }
};