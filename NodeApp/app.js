
//***================= 	SETUP   =================***//

var express 	= require('express');
var app     	= express();
var bodyParser 	= require('body-parser');
var path		= require('path');

//***=================   PORT   =================***//


var port = process.env.PORT || 8080;


//***=================   DATABASE   =================***//

var mongoose 	= require('mongoose');
mongoose.connect('mongodb://localhost/Jay');


//***================= ROUTES FOR OUR API  =================***//

// var router = require('./routes/index')

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/api/menu', function(req, res) {
	res.setHeader('Content-Type', 'text/html', 200);
	res.write('ADMIN PAGE');
	res.end();
})

app.get('/api/:version', function(req, res) {
	var user_id = req.param('id');
	var token = req.param('token');
	var geo = req.param('geo');

	res.send(req.params.version);
})

//  ----------------------------------------------------  //


// all of our routes will be prefixed with /api
// app.use('/', router);



//***=================   START THE SERVER   =================***//

app.listen(port);

console.log('Synchronization with port ' + port);
