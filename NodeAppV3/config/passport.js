
// configuration of passport

var localStrategy 	= require('passport-local').Strategy;
var passportHttp 	= require('passport-http');
var User 			= require('../routes/users');

module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
	done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function (err, user) {
			if (err) throw err;
			done(err, user);
		});
	});

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