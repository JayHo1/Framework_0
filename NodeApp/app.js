
//***================= 	SETUP   =================***//
var fs 				= require('fs');
var http 			= require('http');
var https 			= require('https');
var express 		= require('express');
var app     		= express();
var bodyParser 		= require('body-parser');
var path			= require('path');
var logger 			= require('morgan');
var passport 		= require('passport');
var cookieParser 	= require('cookie-parser');
var LocalStrategy 	= require('passport-local').Strategy

//***================= 	HTTPS   =================***//

var sslOptions 	= {

	key: fs.readFileSync('sslcert/server.key'),
	cert: fs.readFileSync('sslcert/server.crt'),
	ca: fs.readFileSync('sslcert/ca.crt'),
	requestCert: true,
	rejectUnauthorized: false

};

//***=================   PORT   =================***//

var httpServer 	= http.createServer(app).listen('8080', function() {
	console.log("Express server listening on localhost port 8080");
});

var secureServer = https.createServer(sslOptions,app).listen('3030', function(){
  console.log("Secure Express server listening on port 3030");
});

//***=================   DATABASE   =================***//

var mongoose 	= require('mongoose');
mongoose.connect('mongodb://localhost/Jay');


//***================= ROUTES FOR OUR API  =================***//

var routes 	= require('./routes/index');
var users 	= require('./routes/users');


// app.get('/', function(req, res) {
// 	res.sendFile(path.join(__dirname + '/views/index.html'));
// });

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//***================= AUTHENTICATION  =================***//

var Account = require('./app/models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


app.use('/', routes);

//  ----------------------------------------------------  //


// all of our routes will be prefixed with /api
// app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

//***=================   START THE SERVER   =================***//

// app.listen(port);

// console.log('Synchronization with port ' + port);
