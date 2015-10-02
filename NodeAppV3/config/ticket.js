

var mailbox 			= require('./models/mailbox');

module.exports = function(app) {

	function getMail(callback, function(res, req) { {

		var newMailbox = new mailbox()

		console.log(req.body.name)
		console.log(req.body.email)
		console.log(req.body.phonenumber)
		console.log(req.body.message)
		newMailbox.Name = req.body.name
		newMailbox.Email = req.body.email
		newMailbox.PhoneNumber = req.body.phonenumber
		newMailbox.Message = req.body.message
		newMailbox.save(function(err, done) {
			if (err) throw err;
			console.log(done)
			callback(done)
		});
		})
	}

	app.post('/contact', function(req, res) {
		getMail(function(data) {
			console.log(data);
			res.render('contact', {
				isAuthenticated: req.isAuthenticated(),
				user: req.user
			})
		})
	})
}