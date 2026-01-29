const Setting = require('../models/settingModel');

// Create or Update Settings
const createOrUpdateSetting = async (req, res) => {
  try {
    // Check if a settings document exists
    let setting = await Setting.findOne();

    if (setting) {
      // Update the existing settings
      setting = await Setting.findOneAndUpdate(
        {},
        { $set: req.body }, // Update fields based on the request body
        { new: true, runValidators: true } // Return the updated document
      );

      // Manually trigger save to invoke post-save hook
      await setting.save(); // This will trigger the post-save hook and cleanup

      return res.status(200).json({
        message: 'Settings updated successfully.',
        setting,
      });
    } else {
      // Create a new settings document
      const newSetting = new Setting(req.body);
      await newSetting.save(); // This will trigger the post-save hook

      return res.status(201).json({
        message: 'Settings created successfully.',
        setting: newSetting,
      });
    }
  } catch (error) {
    console.error('Error in createOrUpdateSetting:', error);
    res.status(500).json({
      error: 'Failed to create or update settings.',
    });
  }
};

module.exports = {
  createOrUpdateSetting,
};
