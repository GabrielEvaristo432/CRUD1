var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CRUD de Clientes' });
});

router.get('/add', async function(req, res, next) {
  res.render('add');
});


module.exports = router;
