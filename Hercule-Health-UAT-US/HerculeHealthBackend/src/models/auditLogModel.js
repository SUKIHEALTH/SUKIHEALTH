// models/auditLogModel.js
const mongoose = require('mongoose');
const auditLogSchema = new mongoose.Schema({
  auditId:{ type: Number, unique: true, required: true},
  userId: { type: Number, ref: 'User', required: false },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
module.exports = AuditLog;




