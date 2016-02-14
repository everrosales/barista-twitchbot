var express = require('express');
var router = express.Router();

var getDateStr = function() {
  var date = new Date();
  var dateStr = date.toLocaleString("en-us",
      { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return dateStr;
};

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('here');
  var dateStr = getDateStr();
  res.render('index', { date: dateStr });
  res.end();
});

module.exports = router;
