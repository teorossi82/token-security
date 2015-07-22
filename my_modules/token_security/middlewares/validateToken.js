var jwt = require('jwt-simple');
module.exports = function(req, res, next) {
    // When performing a cross domain request, you will recieve
    // a preflighted request first. This is to check if our the app
    // is safe. 
    // We skip the token outh for [OPTIONS] requests.
    //if(req.method == 'OPTIONS') next();
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];
    if (token || key) {
        try {
            var decoded = jwt.decode(token, require('./../config/secret.js').access_token());
            if (decoded.exp <= Date.now()) {
                res.status(400);
                res.json({
                    "status": 400,
                    "code":101,
                    "message": "Token scaduto"
                });
                return;
            }
            next();
        } catch (err) {
            res.status(500);
            res.json({
                "status": 500,
                "message": "Errore nel controllo del token",
                "code":100,
                "error": err
            });
        }
    } else {
        res.status(401);
        res.json({
            "status": 401,
            "code":100,
            "message": "Token non valido"
        });
        return;
    }
};