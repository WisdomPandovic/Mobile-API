const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
	name: {type: String, required:true, trim: true, unique: true},
	post: [{ type: mongoose.Schema.Types.ObjectId, ref: 'posts' }],
})

const Tag = mongoose.model("tags",TagSchema)
module.exports = Tag;