
// configuration routes
module.exports = function(app, passport, mongoose) {

	var nbAccount = require('../config/models/users');
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

    //***=================   UPDATE PAGE   =================***//

	app.get('/admin/user/:user', ensureAuthenticated, ensureAdminAuthenticated, function(req, res) {
		nbAccount.findOne({'_id': req.params.user}, function(err, data){
			if (err) throw err;
			console.log(data.info_user.lastname);
			res.render('admin-edit.ejs', {
				isAuthenticated: req.isAuthenticated(),
				user: req.user, 
				firstname: data.info_user.firstname,
				lastname: data.info_user.lastname,
			});
		});
	});

	app.post('/admin/user/:user', ensureAuthenticated, ensureAdminAuthenticated, function (req, res) {
		nbAccount.update({_id: req.params.user}, { $set: { info_user: { firstname: req.body.firstname, lastname: req.body.lastname }} },  function (err) {
		 if (err) { 
		    console.log('update error');
		 }
		 else
		 {
		  	console.log('Pseudos modifiés !');
		  	console.log(req);
		  	res.render('profile', {
		  		isAuthenticated: req.isAuthenticated(),
		  		user: req.user,
		  	});
		  }
		});
	});

	//***=================   PROFILE   =================***//

	app.get('/profile', ensureAuthenticated, function(req, res) {
    	res.render('profile', {
    		user: req.user
    	});
    });

	function account(callback) {
		nbAccount.count(function(err, nb) {
			if (err) throw err;
			callback(nb.toString());
		});
	};

	function user_data(callback) {
		nbAccount.find(function (err, data) {
			if (err) throw err;
			console.log(data);
			callback(data);
		});
	};

	app.get('/admin', ensureAuthenticated, ensureAdminAuthenticated, function(req, res) {
		account(function (response) {
			user_data(function(account) {
				res.render('admin', {
					isAuthenticated: req.isAuthenticated(),
					user: req.user,
					nbUser: response,
					account,			
				});
			});
		});
	});

	//***=================   CONTACT PAGE   =================***//

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