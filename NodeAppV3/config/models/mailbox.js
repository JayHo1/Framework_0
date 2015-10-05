
// Configuration Mailbox Schema
var mongoose 		= require('mongoose')

module.exports = function(connect2) {

	var mailboxSchema = mongoose.Schema({

		name: { type: String, default: ''},

		email: { type: String, default: ''},

		phonenumber: { type: String, default: ''},

		message: { type: String, default: ''},

		timeCreated: { type: Date, default: Date.now },

	})

	module.exports = connect2.model('Mailbox', mailboxSchema);
}