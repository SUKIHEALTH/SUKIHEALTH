const bcrypt = require('bcryptjs'); // For hashing passwords
const User = require('../models/userModel'); // Adjust the path to your Users model

const resetPassword = async (req, res) => {
  try {
    const { email, forget_key, newPassword } = req.body;

    // Step 1: Validate input
    if (!email || !forget_key || !newPassword) {
      return res.status(400).json({ message: 'Email, forget_key, and newPassword are required.' });
    }

    // Step 2: Find user by email
    const user = await User.findOne({ email }).select('passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Step 3: Compare the provided forget_key with the stored passwordHash
    const isMatch = user.passwordHash === forget_key;

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid reset key.' });
    }

    // Step 4: Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Step 5: Update the user's password
    user.passwordHash = hashedPassword;
    await user.save();

    // Step 6: Send a success response
    return res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error in resetPassword API:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { resetPassword };
