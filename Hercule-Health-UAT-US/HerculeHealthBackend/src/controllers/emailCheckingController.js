const dns = require('dns');
const mongoose = require('mongoose');

// Check or define the User model
const userSchema = new mongoose.Schema({ email: String });
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Controller function to validate email
const checkEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  try {
    // Check if the email exists in the user table
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(200).json({ exists: true, message: 'Email already exists.' });
    }

    // Extract the domain from the email
    const domain = email.split('@')[1];

    // Validate the domain with DNS lookup
    dns.resolveMx(domain, (err, addresses) => {
      if (err || addresses.length === 0) {
        return res.status(400).json({ exists: false, message: 'Invalid email domain.' });
      }

      res.status(200).json({ exists: false, message: 'Email is valid and not registered.' });
    });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { checkEmail };
