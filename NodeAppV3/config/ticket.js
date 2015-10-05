
// configuration of mailbox database

var Mailbox 			= require('./models/mailbox');

module.exports = function(app) {

	app.post('/contact', function(req, res) {
		var mail = new Mailbox({

			name: req.body.name,
			email: req.body.email,
			phonenumber: req.body.phonenumber,
			message: req.body.message,

		})
		mail.save(function(err, mail) {
			if (err) console.log('error saving')
			else console.log('message saved !')
		})
	  	req.flash('info', 'Flash is back!')
		res.render('contact', {
				isAuthenticated: req.isAuthenticated(),
				user: req.user,
			})
		})
}