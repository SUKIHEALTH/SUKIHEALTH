const User = require('../models/userModel');
const AuditLog = require('../models/auditLogModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the password matches the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.is_verified) {
  return res.status(401).json({ message: 'Please verify your email before logging in' });
}

    // Set is_loggedIn to 'Y'
    user.is_loggedIn = 'Y';
    await user.save();

    // Generate a JWT token with a 10day expiration time
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10d' });

    // Add an entry in the AuditLog
    const auditEntry = new AuditLog({
      auditId: await AuditLog.countDocuments() + 1, // Auto-increment auditId
      userId: user.userId,
      action: 'LOGIN',
      timestamp: new Date(),
    });
    await auditEntry.save();

    // Extract the access_type and userId from the user
    const { access_type, userId, is_verified } = user;

    // Set the JWT token, userId, and access_type in cookies
    res
      .cookie('authToken', token, {
        httpOnly: false,  // Remove this flag if you need to access the cookie in JavaScript
  secure: false,    // Set to true only if you're using HTTPS in production
  sameSite: 'Lax', 

      })
      .cookie('userId', userId, {
        httpOnly: false,
        secure: process.env.SSL_ENABLED === 'false',
        sameSite: 'strict',
      })
      .cookie('accessType', access_type, {
        httpOnly: false,
        secure: process.env.SSL_ENABLED === 'false',
        sameSite: 'strict',
      })
      .cookie('is_verified', is_verified, {
        httpOnly: false,
        secure: process.env.SSL_ENABLED === 'false',
        sameSite: 'strict',
      })
      .status(200)
      .json({ message: 'Login successful', is_verified: is_verified }); // Only return a success message
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

module.exports = { login };
