const mongoose = require('mongoose');
const Setting = require('./settingModel'); // Import the Setting model

const chatSchema = new mongoose.Schema({
  chatId: { type: String, unique: true, required: true },
  patientId: { type: Number, ref: 'Patient', required: true },
  consultantId: { type: Number, ref: 'Consultant', required: true },
  messages: [
    {
      senderId: { type: Number, required: true },
      message: { type: String },
      messageType: { type: String, enum: ['text', 'voice', 'media'], required: true },
      file: { type: String },
      timestamp: { type: Date, default: Date.now },
      delivered: { type: Boolean, default: false }, // New field to track delivery status
      read: { type: Boolean, default: false },     // New field to track read status
    }
  ],
  lastCleanup: { type: Date }, // New field to store the last cleanup timestamp
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Static method to clean up expired messages
chatSchema.statics.cleanExpiredMessages = async function () {
  try {
    // Fetch current settings
    const settings = await Setting.findOne();
    if (!settings || !settings.chatHistoryExpirePeriod) {
      console.log('No chatHistoryExpirePeriod found in settings. Skipping cleanup.');
      return;
    }

    const { value, valueType } = settings.chatHistoryExpirePeriod;

    // Calculate expiration date based on current date and settings
    const expirationDate = new Date();
    switch (valueType) {
      case 'day':
        expirationDate.setDate(expirationDate.getDate() - value); // Subtract days
        break;
      case 'week':
        expirationDate.setDate(expirationDate.getDate() - value * 7); // Subtract weeks
        break;
      case 'month':
        expirationDate.setMonth(expirationDate.getMonth() - value); // Subtract months
        break;
      default:
        throw new Error('Invalid time unit in chatHistoryExpirePeriod');
    }

    console.log(`Calculated expiration date: ${expirationDate.toISOString()}`);

    // Remove expired messages based on timestamp comparison
    const result = await this.updateMany(
      {},
      {
        $pull: {
          messages: {
            timestamp: { $lt: expirationDate }  // Messages older than the expiration date
          }
        }
      }
    );

    console.log(`Expired messages cleanup completed. Updated ${result.modifiedCount} chats.`);

    // Optionally, update the last cleanup timestamp in the database
    await this.updateMany({}, { $set: { lastCleanup: new Date() } });

  } catch (error) {
    console.error('Error during chat messages cleanup:', error);
  }
};

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;

