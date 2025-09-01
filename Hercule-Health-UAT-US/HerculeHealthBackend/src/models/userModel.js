// models/userModel.js
// const mongoose = require('../db/mongoose');
const mongoose = require('mongoose');
// Define schema for profile picture
const userSchema = new mongoose.Schema({
  userId:{type:Number},
  firstName: { type: String, required: true },
  lastName: { type: String},
  email: { type: String, required: true},
  passwordHash: { type: String, required: true},
  role: { type: String },
  access_type: { type: Number },
  is_loggedIn : { type: String, default: 'N' },
  is_active: { type: String },
  is_delete: { type: String },
  is_verified: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;