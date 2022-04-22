var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
	'name': String,
	'description': String,
	'postedBy': {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	'date': Date,
	'tags': String
});

module.exports = mongoose.model('question', questionSchema);