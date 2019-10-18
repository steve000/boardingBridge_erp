var express = require('express');
// var app =  express();
// app.use(express.static('public'));
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  // res.writeHead(200, { 'Content-Type': 'text/html' })
  // fs.readFile('/pages/html.html','utf-8',function(err,data) {
  //     if(err){
  //     throw err ;
  //     }
  //     res.end(data);
  // });
});

module.exports = router;
