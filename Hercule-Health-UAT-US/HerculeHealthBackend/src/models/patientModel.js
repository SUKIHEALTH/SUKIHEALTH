// models/patientsModel.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: { type: Number, ref: 'User', required: true },
  profileImage: { type: String, default: ""},
  information: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date},
    phone: { type: String, required: true},
    email: { type: String, required: true},
    age: { type: Number},
    gender: { type: String },
  },
  address: {
    address: { type: String},
    city: { type: String},
    state: { type: String},
    country: { type: String},
    pincode: { type: String},
  },
  healthData: {
    heartRate:{type:Number},
    height: { type: Number},
    heightUnit: { type: String},
    weight:{ type: Number},
    weightUnit: { type: String},
    bloodGroup: { type: String},
    bmi: {type: Number},
    medicalHistory: { type: [String] },
    allergies: { type: [String]}
  
  },
  requests: [
    {
      requestedId: { 
        type: Number, // Use ObjectId for better consistency
        ref: 'User' // Reference the User model
      },
      requestedAt: { 
        type: Date, 
        default: Date.now // Track when the request was made
      },
      status: { type: String }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
