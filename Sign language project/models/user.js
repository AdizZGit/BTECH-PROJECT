var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	
	unique_id: Number,
	email: String,
	firstname: String,
	lastname: String,
	password: String,
	mobileno: Number,
	passwordConf: String
}),
User = mongoose.model('User', userSchema);

module.exports = User;