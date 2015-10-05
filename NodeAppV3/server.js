
//***=================   SETUP   =================***//


var fs 				= require('fs');
var path 			= require('path');
var https			= require('https');
var express 		= require('express');
var bodyParser 		= require('body-parser');
var cookieParser 	= require('cookie-parser');
var morgan       	= require('morgan');
var io				= require('socket.io');
var nodemailer 		= require('nodemailer');

var app 			= express();

app.set('view engine', 'ejs');


//***=================   DATABASE  =================***//


var mongoose 		= require('mongoose');
var flash   		= require('connect-flash');

//configuration//
var connect1 		= mongoose.createConnection('mongodb://localhost/user_data');
var connect2		= mongoose.createConnection('mongodb://localhost/mailbox');

require('./config/models/users')(connect1);
require('./config/models/mailbox')(connect2);

//***=================   SERVER HTTPS  =================***//

var sslOptions = {
	key: fs.readFileSync('./ssl/server.key'),
	cert: fs.readFileSync('./ssl/server.crt'),
	ca: fs.readFileSync('./ssl/ca.crt'),
	requestCert: true,
	rejectUnauthorized: false,
	passphrase: "password"
}

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


require('./routes/routes')(app, passport, nodemailer);
require('./config/passport')(passport);
require('./config/ticket')(app);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname + '/public')))
app.use('/admin/user', express.static(path.join(__dirname + '/public')))


//***=================   PORT   =================***//

var port = process.env.PORT || 3000

https.createServer(sslOptions, app).listen(port, function () {
	console.log('https://127.0.0.1:' + port + '/');
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
