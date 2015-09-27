
//***=================   SETUP   =================***//


var fs 				= require('fs');
var https			= require('https');
var express 		= require('express');
var bodyParser 		= require('body-parser');
var cookieParser 	= require('cookie-parser');
var morgan       	= require('morgan');

var app 			= express();

app.set('view engine', 'ejs');


//***=================   DATABASE  =================***//


var mongoose 		= require('mongoose');
var flash   		= require('connect-flash');
var configDB 		= require('./config/database.js');

//configuration//
mongoose.connect(configDB.url); 


//***=================   SERVER HTTPS  =================***//

// var serverHttps		= https.createServer({ 
// 	cert: fs.readFileSync(__dirname + '/ssl/server.crt'),
// 	key: fs.readFileSync(__dirname + '/ssl/server.key'),
// }, app);

//***=================   AUTHENTICATION   =================***//


var passport 		= require('passport');
var passportLocal 	= require('passport-local');
var passportHttp 	= require('passport-http');
var expressSession	= require('express-session');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({ 
	secret: process.env.SESSION_SECRET || 'secret',
	resave: false,
	saveUninitialized: false,
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


//***=================   ROUTES   =================***//


require('./routes/routes')(app, passport, mongoose);
require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'))


//***=================   PORT   =================***//

var port = process.env.PORT || 3000

app.listen(port, function () {
	console.log('http://127.0.0.1:' + port + '/');
});

//***=================   DEBUG   =================***//

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.render('404');
});


// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });
