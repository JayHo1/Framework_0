
// configuration of passport

var localStrategy 	= require('passport-local').Strategy;
var passportHttp 	= require('passport-http');
var User 			= require('./models/users');

module.exports = function(passport, app) {

	passport.serializeUser(function(user, done) {
	done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function (err, user) {
			if (err) throw err;
			done(err, user);
		});
	});


	//***=================   LOCAL UPDATE  =================***//

	// passport.use('admin-update', newlocalStrategy)

	//***=================   LOCAL SIGN UP   =================***//


	passport.use('local-signup', new localStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
		function(req, email, password, done) {
			process.nextTick(function() {
				User.findOne({ 'local.email': email }, function(err, user) {
					if (err)
						return done(err);
					if (user) {
						return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
					} else {

						var newUser = new User();

						newUser.local.email = email;
						newUser.local.password = newUser.generateHash(password);

						newUser.info_user.firstname = req.body.firstname;
						newUser.info_user.lastname = req.body.lastName;
						newUser.info_user.birthday = req.body.bDay;

						newUser.permissions.name = "troll";
						newUser.permissions.super_saiyen = 1;
						newUser.permissions.ninja = 0;
						newUser.permissions.pathetic_human = 1;

						newUser.save(function(err) {
							if (err) throw err;
							return done(null, newUser);
						});
					}
				});
			});
		}
	));

	//***=================   LOCAL LOGIN   =================***//


	passport.use('local-login', new localStrategy({

		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
		function(req, email, password, done) {
			User.findOne({ 'local.email': email }, function(err, user) {

				if (err)
					return done(err);
				if (!user)
					return done(null, false, req.flash('loginMessage', 'No user found.'));
				if (!user.validPassword(password))
					return done(null, false, req.flash('loginMessage', 'Wrong password !.'));
				return done(null, user);
			});
		}
	));

	//***=================   HTTP LOGIN   =================***//

	passport.use(new passportHttp.BasicStrategy(
		function(email, password, done) {
			User.findOne({ 'local.email': email }, function (err, user) {

				if (err)
					return done(err);
				if (!user)
					return done(null, false);
				if (!user.validPassword)
					return done(null, false);
				return done(null, user);
			});
		}
	));










};