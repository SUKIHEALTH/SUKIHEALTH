const User = require('../models/userModel'); // Adjust the path to your Users model
const { sendEmail } = require('../config/emailService');

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Step 1: Validate input
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    // Step 2: Check if email exists in the Users table
    const user = await User.findOne({ email }).select('passwordHash firstName lastName');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Step 3: Extract user details
    const { passwordHash, firstName, lastName } = user;

    // Step 4: Prepare email data
    const emaildata = {
      mail_type: 'forgetPassword_mail',
      name: `${firstName} ${lastName}`,
      email: email,
      subject: 'Forget Password',
      forget_key: passwordHash, // Send the password hash as the reset key
    };

    // Step 5: Send email
    await sendEmail(emaildata);

    // Step 6: Respond to the client
    return res.status(200).json({ message: 'Password reset email sent successfully.' });
  } catch (error) {
    console.error('Error in forgetPassword API:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { forgetPassword };
