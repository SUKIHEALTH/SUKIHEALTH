// models/administratorModel.js
// const mongoose = require('../db/mongoose');
const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
  userId: { type: Number, ref: 'User', required: true },
  permissions: { type: [String], required: true },
  roleLevel: { type: String, enum: ['SuperAdmin', 'Support'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Administrator = mongoose.model('Administrator', adminSchema);
module.exports = Administrator;

