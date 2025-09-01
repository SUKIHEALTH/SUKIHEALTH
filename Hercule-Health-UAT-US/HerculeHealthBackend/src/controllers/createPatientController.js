const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Patient = require('../models/patientModel');
const { sendEmail } = require('../config/emailService');

// Create a new user and patient
const createPatient = async (req, res) => {
  console.log("called");
  try {
    const {
      password,
      role,
      is_active,
      is_delete,
      profileImage,
      information,
      address,
      healthData,
    } = req.body;

    console.log('Request Body:', req.body);

    // Validate required fields
    if (!information.email || !information.password) {
      throw new Error('Required fields for user creation are missing.');
    }

    // Step 1: Check if the user already exists
    const userExists = await User.findOne({ 'email': information.email });
    console.log('user infor', userExists);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Step 1: Find the highest userId in the User collection
    const highestUser = await User.findOne().sort('-userId').exec();
    const userId = highestUser ? highestUser.userId + 1 : 1; // Start with 1 if no users exist

    // Step 2: Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(information.password, salt);

    // Step 3: Get the current date for createdAt and updatedAt
    const currentDate = new Date();

    // Step 4: Save user fields in the User model
    const newUser = await User.create(
      [
        {
          userId, // Auto-incremented ID
          firstName: information.firstName,
          lastName: information.lastName,
          email: information.email,
          profileImage,
          passwordHash,
          role,
          access_type: "3",
          is_active,
          is_verified: false,
          is_delete,
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      ],
    );

    // Step 5: Save patient fields in the Patient model
    const newPatient = await Patient.create(
      [
        {
          userId, // Use the auto-incremented userId
          profileImage: profileImage || '',
          information:{
            gender:healthData.gender,
            age:healthData.age,
            firstName:information.firstName,
            lastName:information.lastName,
            dateOfBirth: healthData.dateOfBirth,
            phone:information.phone,
            email:information.email,

          },
          address:{
            country:address,
            // state:address.state,
          },
          healthData:{
            height:healthData.height,
            weight:healthData.weight,
            bloodGroup:healthData.bloodGroup,
            allergies:healthData.allergies,
          },
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      ],
    );

    // Step 6: Prepare email data
    const emaildata = {
      mail_type: 'patient_confirmation_mail',
      name: `${information.firstName} ${information.lastName}`,
      email: information.email,
      subject: "Patient Registration Successful",
      verification_key: passwordHash, // Generate a proper verification key
    };

    // Step 7: Send confirmation email
    await sendEmail(emaildata);

    res.status(201).json({
      user: newUser[0], // Return the first created user document
      patient: newPatient[0], // Return the first created patient document
      message: 'User and patient records created successfully.',
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createPatient };
