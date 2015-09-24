var express = require('express');
var app = express();

/* GET users listing. */
app.get('/', function(req, res) {
	res.render('index');
});

module.exports = app;
