const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Patient = require('../models/patientModel');

const updatePatient = async (req, res) => {
  
  try {
    const userId = req.params.id;
    const {
      password,
      role,
      access_type,
      is_active,
      is_delete,
      profileImage,
      information = {}, // Defaults to empty object
      address = {},     // Defaults to empty object
      healthData = {},  // Defaults to empty object
    } = req.body;

    if (!userId) {
      throw new Error('User ID is required for updating records.');
    }

    // Step 1: Find the existing user and patient
    const existingUser = await User.findOne({ userId });
    const existingPatient = await Patient.findOne({ userId });

    if (!existingUser || !existingPatient) {
      throw new Error('User or patient record not found.');
    }

    // Step 2: Update user fields
    if (information.email && information.email !== existingUser.email) {
      const emailExists = await User.findOne({ email: information.email });
      if (emailExists) {
        throw new Error('The provided email is already in use.');
      }
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      existingUser.passwordHash = passwordHash;
    }

    existingUser.firstName = information.firstName || existingUser.firstName;
    existingUser.lastName = information.lastName || existingUser.lastName;
    existingUser.email = information.email || existingUser.email;
    existingUser.role = role || existingUser.role;
    existingUser.access_type = access_type || existingUser.access_type;
    existingUser.is_active = is_active !== undefined ? is_active : existingUser.is_active;
    existingUser.is_delete = is_delete !== undefined ? is_delete : existingUser.is_delete;
    existingUser.updatedAt = new Date();

    await existingUser.save({  });

    // Step 3: Update patient fields with partial merge
    existingPatient.profileImage = profileImage || existingPatient.profileImage;


    // Specifically update the `dateOfBirth` field
    if (information.dateOfBirth) {
      existingPatient.information.dateOfBirth = new Date(information.dateOfBirth);
    console.log("thisi is dob",information.dateOfBirth);
    
    }
    

    // Merge new values with existing ones for `information`
    existingPatient.information = { ...existingPatient.information, ...information };

    // Merge new values with existing ones for `address`
    existingPatient.address = { ...existingPatient.address, ...address };

    // Merge new values with existing ones for `healthData`
    existingPatient.healthData = { ...existingPatient.healthData, ...healthData };

    existingPatient.updatedAt = new Date();

    await existingPatient.save({  });
    console.log('this is the ',healthData);
    res.status(200).json({
      user: existingUser,
      patient: existingPatient,
      message: 'User and patient records updated successfully.',
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(400).json({ error: error.message });
  }
};



module.exports = { updatePatient };
