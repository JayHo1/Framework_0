
//***=================   SETUP   =================***//

var express 		= require('express');
var app 			= express();
var bodyParser 		= require('body-parser');
var cookieParser 	= require('cookie-parser');
var expressSession	= require('express-session');

app.set('view engine', 'ejs');


//***=================   AUTHENTICATION   =================***//

var passport 		= require('passport');
var passportLocal 	= require('passport-local');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({ 
	secret: process.env.SESSION_SECRET || 'secret',
	resave: false,
	saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal.Strategy(function(username, password, done) {
	if (username === password) {
		done(null, { id: username, name: username });
	} else {
		done(null, null);
	};
}));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	done(null, { id: id, name: id });
})

//***=================   ROUTES   =================***//

app.use(express.static(__dirname + '/public'))
app.get('/', function(req, res) {
	res.render('index', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});

});

app.get('/login', function(req, res) {
	res.render('login');
});

app.post('/login', passport.authenticate('local'), function(req, res) {
	res.redirect('/');
});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/login');
});


//***=================   PORT   =================***//

var port = process.env.PORT || 3000

app.listen(port, function () {
	console.log('Server Stating at http://localhost:' + port);
});

//***=================   DEBUG   =================***//
