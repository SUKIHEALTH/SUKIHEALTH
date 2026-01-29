
const mongoose = require('mongoose');
const User = require('../models/userModel');
const AuditLog = require('../models/auditLogModel');

const logout = async (req, res) => {
  try {
    // Access the user's ID from the request body
    const userId = Number(req.body.id);
    console.log(userId)

    // Validate that userId exists
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Attempt to cast userId to ObjectId if it's not already
    let objectId;
    try {
      objectId = mongoose.Types.ObjectId(userId);  // Cast userId to ObjectId
      console.log("this is object",objectId)
    } catch (err) {
      console.log("this is error", err)
      return res.status(400).json({ message: 'Invalid User ID format' });
      
    }

    // Search for the user in the database using the userId (now properly casted to ObjectId)
    const user = await User.findOne({ _id: objectId });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's `is_loggedIn` status to 'N'
    user.is_loggedIn = 'N';
    await user.save();

    // Log this action in the AuditLog
    const auditEntry = new AuditLog({
      auditId: await AuditLog.countDocuments() + 1, // Auto-increment auditId
      userId: user._id, // Use the _id for audit log
      action: 'LOGOUT',
      timestamp: new Date(),
    });
    await auditEntry.save();

    // Clear the authentication cookie
    res.clearCookie('authToken', { httpOnly: true, secure: process.env.SSL_ENABLED === 'true' });

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};

module.exports = { logout };
// const User = require('../models/userModel');
// const AuditLog = require('../models/auditLogModel');

// const logout = async (req, res) => {
//   try {
//     // Access the user's ID from the request body
//     const userId = req.body.id;

//     // Validate that userId exists
//     if (!userId) {
//       return res.status(400).json({ message: 'User ID is required' });
//     }

//     // Search for the user in the database using the userId (no ObjectId casting)
//     const user = await User.findOne({ userId: userId });

//     // Check if the user exists
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update the user's `is_loggedIn` status to 'N'
//     user.is_loggedIn = 'N';
//     await user.save();

//     // Log this action in the AuditLog
//     const auditEntry = new AuditLog({
//       auditId: await AuditLog.countDocuments() + 1, // Auto-increment auditId
//       userId: user.userId, // Use the _id for audit log
//       action: 'LOGOUT',
//       timestamp: new Date(),
//     });
//     await auditEntry.save();

//     // Clear the authentication cookie
//     res.clearCookie('authToken', { httpOnly: true, secure: process.env.SSL_ENABLED === 'true' });

//     return res.status(200).json({ message: 'Logout successful' });
//   } catch (error) {
//     console.error('Logout error:', error);
//     res.status(500).json({ message: 'Logout failed', error: error.message });
//   }
// };

// module.exports = { logout };
