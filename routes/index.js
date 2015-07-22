var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Hello world")
});
router.all('/api/*', function(req, res, next) {
  res.send("Api data")
});

module.exports = router;
