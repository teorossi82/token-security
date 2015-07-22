/**
 * @author Laboratorio delle Idee s.r.l.
 */
exports.errorMessage = function(req,res,status,msg){
	res.status(status)
   	res.jsonp(msg)
}
exports.responseMessage = function(req,res,status,msg){
	res.status(status)
   	res.jsonp(msg)
}
