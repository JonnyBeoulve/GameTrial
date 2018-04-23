var express = require('express');
var router = express.Router();

/*=======================================================================
// When visiting the default page, index is loaded.
=======================================================================*/
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
