var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
Mongoose.connect('mongodb://localhost/demopost');

var PostSchema = new Schema({
	title: {type: String, required: true},
	body: {type: String},
	created: {type: Date, required: true},
	updated: {type: Date, required: true}
});

module.exports = Mongoose.model('Post', PostSchema);