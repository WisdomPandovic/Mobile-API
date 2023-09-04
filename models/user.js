const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	username:{type:String,required:true,unique:true},
	email:{type:String,required:true,unique:true},
	password:{type:String,required:true},
	phoneNumber:{type:Number,required:true},
	isloggedIn:{type:Boolean,default:false},
	isAdmin:{type:Boolean,default:false},
	role:{type:String,enum:["admin","user"],default:"user"},
        lastLogin: { type: Date }, 
        post: [{ type: mongoose.Schema.Types.ObjectId, ref: 'posts' }],
})

const User = mongoose.model("users",UserSchema)
module.exports = User;

