const Chat = require('../models/chatModel');
const crypto = require("crypto");
const ENCRYPTION_KEY = process.env.CHAT_ENCRYPTION_KEY || "your-32-byte-key-1234567890123456"; // 32 bytes for aes-256
const IV_LENGTH = 16;

function decrypt(text) {
  if (typeof text !== "string") return text;
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return JSON.parse(decrypted.toString());
}

const getChatsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Aggregation pipeline to fetch chat details along with patient and consultant minimal details
    const chats = await Chat.aggregate([
      {
        $match: { patientId: parseInt(patientId) }, // Match chats by patientId
      },
      {
        $lookup: {
          from: 'patients', // Join with the Patients collection
          localField: 'patientId', // Field in Chat to match
          foreignField: 'userId', // Field in Patient to match
          as: 'patientDetails', // Alias for the joined Patient data
        },
      },
      {
        $lookup: {
          from: 'consultants', // Join with the Consultants collection
          localField: 'consultantId', // Field in Chat to match
          foreignField: 'userId', // Field in Consultant to match
          as: 'consultantDetails', // Alias for the joined Consultant data
        },
      },
      {
        $unwind: { path: '$patientDetails', preserveNullAndEmptyArrays: true }, // Unwind patientDetails array
      },
      {
        $unwind: { path: '$consultantDetails', preserveNullAndEmptyArrays: true }, // Unwind consultantDetails array
      },
      {
        $project: {
          _id: 1, // Include chat ID
          patientId: 1, // Include patientId
          consultantId: 1, // Include consultantId
          messages: 1, // Include all messages
          'patientDetails.information.firstName': 1, // Include patient's first name
          'patientDetails.information.lastName': 1, // Include patient's last name
          'patientDetails.profileImage': 1, // Include patient's profile image
          'consultantDetails.information.firstName': 1, // Include consultant's display name
          'consultantDetails.profileImage': 1, // Include consultant's profile image
        },
      },
      {
        $group: {
          _id: '$_id', // Group by chat ID
          chatDetails: { $first: '$$ROOT' }, // Preserve all chat fields
        },
      },
      {
        $project: {
          chatDetails: 1, 
          patientDetails: {
            'information.firstName': 1,
            'information.lastName': 1,
            profileImage: 1,
          }, 
          consultantDetails: {
            'information.displayName': 1,
            profileImage: 1,
          }, 
        },
      },
    ]);

    if (!chats || chats.length === 0) {
      return res.status(404).json({ message: 'No chats found for this patient.' });
    }

    const decryptedChats = chats.map(chatObj => {
      const chat = chatObj.chatDetails;
      if (Array.isArray(chat.messages)) {
        chat.messages = chat.messages.map(msg => ({
          ...msg,
          message: msg.message ? decrypt(msg.message) : msg.message
        }));
      }
      return { ...chatObj, chatDetails: chat };
    });

    // Send the response with the decrypted chat details
    return res.status(200).json({ chats: decryptedChats });
    // Send the response with the chat details
  } catch (error) {
    console.error('Error fetching chats:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getChatsByPatientId };
