
// Configuration Mailbox Schema
var mongoose 		= require('mongoose')

var mailboxSchema = mongoose.Schema({

	Name: { Type: String, default: '' },

	Email: { Type: String, default: ''},

	PhoneNumber: { Type: String, default: ''},

	Message: { Type: String, default: ''},

	timeCreated: { type: Date, default: Date.now },

})

module.exports = mongoose.model('Mailbox', mailboxSchema);