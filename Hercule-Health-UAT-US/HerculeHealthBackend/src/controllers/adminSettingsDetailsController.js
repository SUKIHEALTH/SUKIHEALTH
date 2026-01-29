const Setting = require('../models/settingModel');

// Fetch All Settings
const fetchAllSettings = async (req, res) => {
  try {
    const setting = await Setting.findOne(); // Fetch the single settings document
    if (!setting) {
      return res.status(404).json({
        message: 'Settings not found.',
      });
    }
    res.status(200).json({
      message: 'Settings fetched successfully.',
      setting,
    });
  } catch (error) {
    console.error('Error in fetchAllSettings:', error);
    res.status(500).json({
      error: 'Failed to fetch settings.',
    });
  }
};

module.exports = {
  fetchAllSettings,
};
