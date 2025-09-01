const User = require('../models/userModel'); // Assuming the User schema is in models/User.js
const Consultant = require('../models/consultantModel'); // Assuming the Consultant schema is in models/Consultant.js
const bcrypt = require('bcryptjs'); // For hashing passwords
const mongoose = require('mongoose'); // For transactions
const { sendEmail } = require('../config/emailService');

const createConsultant = async (req, res) => {
  const {
    password,
    role,
    access_type,
    is_active,
    is_delete,
    availabilityText,
    information, // Object containing firstName, lastName, etc.
    specialization,
    certifications,
    availableSlots,
    experience,
    profileImage,
    registrationData,
    address, // This is country
    city,    // Add city from frontend
  } = req.body;
  console.log('====================================');
  console.log(certifications);
  console.log('====================================');
  console.log("address", address);
  try {
    // Ensure `information` contains `age`, `gender`, `city`, and `location`
    information.age = registrationData.age;
    information.gender = registrationData.gender;
    information.designation = registrationData.speciality;
    information.location = address; // Country
    information.city = city; // Set city from frontend

    let clinicalDetails = {};  // initialize as empty object

    clinicalDetails.isRegistered = registrationData.isRegistered;
    clinicalDetails.clinicName = registrationData.clinicName
    clinicalDetails.clinicalAddress = registrationData.address
    clinicalDetails.postcode = registrationData.Postcode

    console.log("clinicalDetails.clinicName", clinicalDetails.clinicName);

    // Step 1: Check if the user already exists
    const userExists = await User.findOne({ 'email': information.email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Step 2: Generate a unique sequential userId
    const highestUser = await User.findOne().sort('-userId').exec();
    const userId = highestUser ? highestUser.userId + 1 : 1;

    // Step 3: Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(information.password, salt);

    // Current date for `createdAt` and `updatedAt`
    const currentDate = new Date();

    // Step 4: Save user fields in the User model
    const [newUser] = await User.create(
      [
        {
          userId, // Auto-incremented ID
          firstName: information.firstName,
          lastName: information.lastName,
          email: information.email,
          gender: registrationData.gender, // Assign gender from registrationData
          age: registrationData.age, // Assign age from registrationData
          passwordHash,
          role,
          access_type: '2',
          is_active,
          is_delete,
          is_verified: false,
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      ],
    );

    // Step 5: Create the Consultant document and link it to the userId
    const newConsultant = await Consultant.create(
      [
        {
          userId, // Use the same userId
          profileImage,
          availabilityText,
          information,
          clinicalDetails,
          certifications,
          availableSlots,
          experience,
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      ],
    );

    // Step 6: Prepare email data
    const emaildata = {
      mail_type: 'consultant_confirmation_mail',
      name: `${information.firstName} ${information.lastName}`,
      email: information.email,
      subject: "Doctor Registration Successful",
      verification_key: passwordHash, // Generate a proper verification key
    };

    // Step 7: Send confirmation email
    await sendEmail(emaildata);

    // Step 8: Respond with the created User and Consultant data
    return res.status(201).json({
      message: 'User and Consultant created successfully',
      user: newUser,
      consultant: newConsultant,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createConsultant };
