const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	title: {type: String, required:true,},
	// posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'posts' }],
	post: [{ type: mongoose.Schema.Types.ObjectId, ref: 'posts' }],
})

const Tag = mongoose.model("tags",UserSchema)
module.exports = Tag;