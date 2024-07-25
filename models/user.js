// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const UserSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true, // Convert email to lowercase for case-insensitive matching
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   phoneNumber: {
//     type: String, // Changed to String to handle leading zeros or formatting
//     required: true,
//   },
//   otp: {
//     type: String, // Optional field for storing OTP temporarily
//     default: null
//   },
//   gender: {
//     type: String,
//     required: true,
//   },
//   city: {
//     type: String,
//     required: true,
//   },
//   street: {
//     type: String,
//     required: true,
//   },
//   profileImage: {
//     type: String, // URL or path to the profile image
//     default: null
//   },
//   isAdmin: {
//     type: Boolean,
//     default: false,
//   },
//   role: {
//     type: String,
//     enum: ['admin', 'user'],
//     default: 'user',
//   },
//   lastLogin: {
//     type: Date,
//     default: null,
//   },
//   posts: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'posts',
//   }],
// });

// // Hash password before saving (using bcrypt with a reasonable salt rounds)
// UserSchema.pre('save', async function (next) {
//   if (this.isModified('password')) { // Hash password only if it is modified or new
//     const salt = await bcrypt.genSalt(10); // Adjust salt rounds as needed
//     this.password = await bcrypt.hash(this.password, salt);
//   }
//   next();
// });

// const User = mongoose.model("User", UserSchema);

// module.exports = User;


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: false,
    lowercase: true, // Convert email to lowercase for case-insensitive matching
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String, // Changed to String to handle leading zeros or formatting
    required: true,
  },
  otp: {
    type: String, // Optional field for storing OTP temporarily
    default: null,
  },
  gender: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String, // URL or path to the profile image
    default: null,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  paymentMethods: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMethod',
  }],
});

// Hash password before saving (using bcrypt with a reasonable salt rounds)
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) { // Hash password only if it is modified or new
    const salt = await bcrypt.genSalt(10); // Adjust salt rounds as needed
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
