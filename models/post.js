const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	title:{type:String,required:true},
	image:{type:String,required:true,unique:false},
	description:{type:String,required:false},
	tag:{type: mongoose.Types.ObjectId, ref: "tags"},
	user: { type: mongoose.Types.ObjectId, ref: "users" },
	likes: [],
	views: { type: Number},
	comments: [
		{
		    text: {type: String, required: true},
			date: {type: Date, default: Date.now},
			comment_user: { type: mongoose.Types.ObjectId, ref: "users" },
		}
	],
	date:{type: Date, default:Date.now}

})

const Post = mongoose.model("posts",UserSchema)
module.exports = Post;