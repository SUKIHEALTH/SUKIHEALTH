const User = require('../models/userModel'); // Path to your User model

// Controller function to verify email
const verifyEmail = async (req, res) => {
  try {
    const { email, verification_key } = req.body;

    // 1. Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 2. Check if the provided verification_key matches passwordHash
    if (user.passwordHash !== verification_key) {
      return res.status(400).json({ message: 'Invalid verification key.' });
    }

    // 3. Update the is_verified field to true
    user.is_verified = true;
    await user.save();

    // 4. Respond with a success message
    return res.status(200).json({
      message: 'Email verification successful.',
      email: user.email,
      is_verified: user.is_verified,
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { verifyEmail };
