// models/consultantModel.js
// const mongoose = require('../db/mongoose');
const mongoose = require('mongoose');

const consultantSchema = new mongoose.Schema({
  userId: { type: Number, ref: 'User', required: true },
  profileImage: { type: String, default: "" },
  availabilityText: { type: String },
  information: {
    firstName: { type: String },
    lastName: { type: String },
    displayName: { type: String },
    designation: { type: String, required: false },
    phone: { type: String },
    email: { type: String },
    gender: { type: String },
    age: { type: String },
    location: { type: String, required: false }, // Country (not required)
    city: { type: String, required: false }, // Add city field
    knownLanguages: {
      type: [String], // Array of strings to store languages
      default: [], // Initialize as an empty array
    },
  },
  clinicalDetails: {
    isRegistered: { type: Boolean, default: false },
    clinicName: { type: String },
    clinicalAddress: { type: String },
    postcode: { type: String },
  },
  certifications: [],
  availableSlots: [
    {
      time: { type: Date },
      status: { type: String },
    },
  ],
  experience: [ 
    {
      experienceId: { type: Number, required: false },
      hospitalLogo: { type: String, default: "" },
      title: { type: String, default: ""},
      hospitalName: { type: String, default: ""},
      location: { type: String, default: ""},
      yearsOfExperience: { type: Number,  },
      jobDescription: { type: String,  default: ""},
      startDate: { type: Date,  },
      endDate: { type: Date,  },
      isCurrentlyWorking: { type: Boolean, default: false },
    },
  ],
  educations: [
    {
      educationId: { type: Number },
      institutionLogo: { type: String },
      nameOfInstitution: { type: String },
      course: { type: String},
      description: { type: String},
      startDate: { type: Date},
      endDate: { type: Date },
    },
  ],
  awards: [
    {
      awardId: { type: Number},
      awardName: { type: String},
      year: { type: Number },
      description: { type: String },
    },
  ],
  ConsultantApprovalRequired: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Consultant = mongoose.model('Consultant', consultantSchema);
module.exports = Consultant;

