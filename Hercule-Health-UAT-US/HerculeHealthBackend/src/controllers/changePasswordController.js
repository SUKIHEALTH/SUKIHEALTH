const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // Import your User model

// Change Password Controller
const changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        // Validate input
        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Find user by email and include password explicitly
        const user = await User.findOne({ email }).select('+passwordHash');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Old password is incorrect.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 12); // Use 12 salt rounds for better security

        // Update the user's password
        user.passwordHash = hashedPassword;
        await user.save();

        console.log('Updated user:', user); // Verify user object
        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = { changePassword };
