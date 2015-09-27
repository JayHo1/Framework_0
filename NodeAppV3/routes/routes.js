
// configuration routes
module.exports = function(app, passport, mongoose) {

	//***=================   HOME PAGE   =================***//
	app.get('/', function(req, res) {
		res.render('index', {
			isAuthenticated: req.isAuthenticated(),
			user: req.user
		});
	});

	//***=================   LOGIN PAGE   =================***//


	app.get('/login', function(req, res) {
		res.render('login', {
			isAuthenticated: req.isAuthenticated(),
			message: req.flash('loginMessage'),
			user: req.user
		});
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


	app.get('/api/me', passport.authenticate('basic', { session: false }), 
		ensureAuthenticated, function(req, res) {
		res.json([
			{ value: 'foo' },
			{ value: 'bar' },
			{ value: 'baz' },
		]);
	});

	//***=================   PROFILE   =================***//

	var nbAccount = require('../config/models/users');

	function account(callback) {
		nbAccount.count(function(err, nb) {
			if (err) throw err;
			callback(nb.toString());
		});
	};

	function user_data(callback) {
		nbAccount.find(function (err, data) {
			if (err) throw err;
			var account_info = [];
			for(i = 0; i < data.length; i++)
				account_info[i] = [data[i].local.email, data[i].info_user.firstname, data[i].info_user.lastname];
			callback(account_info);
		});
	};

	app.get('/admin', ensureAuthenticated, ensureAdminAuthenticated, function(req, res) {
		account(function (response) {
			user_data(function(info) {
				res.render('admin', {
					isAuthenticated: req.isAuthenticated(),
					user: req.user,
					nbUser: response,
					account: info			
				});
			});
		});
	});

	//***=================   PROFILE   =================***//

	app.get('/contact', function(req, res) {
		res.render('contact', {
			isAuthenticated: req.isAuthenticated(),
			user: req.user
		});
	});

    //***=================   LOG OUT   =================***//

    app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
}

function ensureAdminAuthenticated(req, res, next) {
	if (req.isAuthenticated() && req.user.permissions.super_saiyen) {
		return next();
	} else {
		res.sendStatus(403);
	};
};

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.sendStatus(403);
	};
};