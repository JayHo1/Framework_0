
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

    //***=================   UPDATE ADMIN PAGE   =================***//

	app.get('/admin/user/:id', ensureAuthenticated, ensureAdminAuthenticated, function(req, res) {
		nbAccount.findOne({'_id': req.params.id}, function(err, data){
			if (err) {
			    err.status = 404;
			    res.render('404');
			}
			else {
				res.render('admin-edit', {
					isAuthenticated: req.isAuthenticated(),
					user: req.user, 
					user_data: data,
				});
			}
		});
	});

	app.post('/admin/user/:id', ensureAuthenticated, ensureAdminAuthenticated, function (req, res) {
		nbAccount.findOne({_id: req.params.id}, function(err, data_user) {
			if (err) {
			    err.status = 404;
			    res.render('404');
			} 
			// else if (data_user.validPassword(req.body.pw)) {
			// 	if (req.body.npw == req.body.cpw) {
			// 		var newpw = data_user.generateHash(req.body.npw)
			// 		nbAccount.update({ '_id': data_user._id }, { $set: { local: { email: data_user.local.email, password: newpw }}}, function (err) {
			// 			if (err) throw err
			// 			res.redirect('/admin-edit')
			// 			console.log("success")
			// 		})
			// 	}
			// 	else {
			// 		console.log("FALSE")
			// 	}
			// }
			else if (req.body.delete == "true") {
				nbAccount.remove({ '_id': data_user._id }, function (err) {
					if (err) {
						err.status = 404;
			   			res.render('404');
					}
					else
						res.redirect('/admin');
				})
			}
			else if (req.body.power == "ss" || req.body.power == "nin" || req.body.power == "ph") {
				if (req.body.power == "ss") {
					nbAccount.update({_id: data_user.id}, { $set: { permissions: { super_saiyen: "true", ninja: "false", pathetic_human: "false" }} })
				}
				else if (req.body.power == "nin") {
					nbAccount.update({_id: data_user.id}, { $set: { permissions: { super_saiyen: "false", ninja: "true", pathetic_human: "false" }} })
				}
				else {
					nbAccount.update({_id: data_user.id}, { $set: { permissions: { super_saiyen: "false", ninja: "false", pathetic_human: "true" }} })
				}
			}
			else if (req.body.group == "users" || req.body.group == "admin") {
				nbAccount.update({_id: data_user.id}, { $set: {group: req.body.group }})
			}
			else {
				nbAccount.update({_id: req.params.id}, { $set: { info_user: { firstname: req.body.firstname, lastname: req.body.lastname }} })
			} 
		})
	});

	app.post('/admin', ensureAuthenticated, ensureAdminAuthenticated, function(req, res) {
		nbAccount.remove({ '_id': req.body.id }, function (err) {
			if (err) throw err;
			else {
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
			};
		});
	});


	//***=================   UDPATE USER PAGE   =================***//

	app.get('/edit-page', ensureAuthenticated, function(req, res) {
		res.render('edit-page', {
			isAuthenticated: req.isAuthenticated(),
			user: req.user,			
		})
	})

	app.post('/edit-page', ensureAuthenticated, function(req, res) {
		if (req.body.delete == "true") {
			nbAccount.remove({ '_id': req.user._id }, function (err) {
				if (err) throw err;
				req.logout();
				res.redirect('/');
			})
		}

		else if (req.user.validPassword(req.body.pw)){
			if (req.body.npw == req.body.cpw) {
				var newpw = req.user.generateHash(req.body.npw)
				nbAccount.update({ '_id': req.user._id }, { $set: { local: { email: req.user.local.email, password: newpw }}}, function (err) {
					if (err) throw err
					res.redirect('/edit-page')
					console.log("success")
				})
			}
			else {
				console.log("FALSE")
			}
		}
		else
		{
			nbAccount.update({ 'local.email': req.body.email },
			{ $set: { info_user: { firstname: req.body.firstname, lastname: req.body.lastname, birthday: req.body.birthday }} },
			function (err){
				if (err) {
					console.log("update error")
				}
				else {
					console.log("update success")
				}
			})
		}
	})

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