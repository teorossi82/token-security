var jwt = require('jwt-simple');

exports.genToken = function (user) {
    var expires = expiresIn(require('../config/secret').validity_access_token());
    var token = jwt.encode({
        exp: expires
    }, require('../config/secret').access_token());
	
	var expiresRef = expiresIn(require('../config/secret').validity_refresh_token());
    var refToken = jwt.encode({
        ref_exp: expiresRef,
		access_token:token,
    }, require('../config/secret').refresh_token());

    return {
		refresh_token: refToken,
		refresh_token_expires: expiresRef,
        access_token: token,
        access_token_expires: expires,
        user: user
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}