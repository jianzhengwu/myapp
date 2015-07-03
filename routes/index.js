var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

//res.render() will look in a views folder for the view, i.e. views/index
  res.render('index', { title: 'Chirp' });
});

module.exports = router;
