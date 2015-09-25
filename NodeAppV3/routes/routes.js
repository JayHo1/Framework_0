
// configuration routes
module.exports = function(app, passport) {

	//***=================   HOME PAGE   =================***//

	app.get('/', function(req, res) {
		res.render('index', {
			isAuthenticated: req.isAuthenticated(),
			user: req.user
		});
	});

	//***=================   LOGIN PAGE   =================***//

	app.get('/login', function(req, res) {
		res.render('login', { message: req.flash('loginMessage') });
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	 // process the login form
    // app.post('/login', do all our passport stuff here);


	//***=================   SIGN UP PAGE   =================***//

	app.get('/signup', function(req, res) {
		res.render('signup', { message: req.flash('signupMessage') })
	});

	// process the signup form
    // app.post('/signup', do all our passport stuff here);

    app.post('/signup', passport.authenticate('local-signup', {
    	successRedirect: '/profile',
    	failureRedirect: '/signup',
    	failureFlash: true
    }));

    //***=================   PROFILE   =================***//

    app.get('/profile', ensureAuthenticated, function(req, res) {
    	res.render('profile', {
    		user: req.user
    	});
    });


	app.get('/api/me', passport.authenticate('basic', { session: false }), ensureAuthenticated, function(req, res) {
		res.json([
			{ value: 'foo' },
			{ value: 'bar' },
			{ value: 'baz' },
		]);
	});

    //***=================   LOG OUT   =================***//

    app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
}

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.sendStatus(403);
	}
};