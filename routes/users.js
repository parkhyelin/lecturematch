var express = require('express');
var router = express.Router();
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
/*
router.get('/mypage2', function(req, res, next) {
  res.render('mypage2', { title: 'mypage' });
});
*/
module.exports = router;
