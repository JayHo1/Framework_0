
// configuration of database

var mongoose 	= require('mongoose');
var bcrypt 		= require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

    local           : {
        email       : { type: String, default: '' },
        password    : { type: String, default: '' },
    },

    info_user       : {
        firstname   : { type: String, default: ''},
        lastname    : { type: String, default: ''},
        birthday    : { type: Date, default: Date.now}
    },

    groups          : [{ type: String, ref: 'Users'}],
    permissions             : {
        name                : { type: String, default: ''},
        super_saiyen        : Boolean,
        ninja               : Boolean,
        pathetic_human      : Boolean
    },

    timeCreated: { type: Date, default: Date.now },

    // facebook         : {
    //     id           : String,
    //     token        : String,
    //     email        : String,
    //     name         : String
    // },
    // twitter          : {
    //     id           : String,
    //     token        : String,
    //     displayName  : String,
    //     username     : String
    // },
    // google           : {
    //     id           : String,
    //     token        : String,
    //     email        : String,
    //     name         : String
    // }

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);