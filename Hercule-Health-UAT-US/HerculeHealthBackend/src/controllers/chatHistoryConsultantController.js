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


const getChatsByConsultantId = async (req, res) => {
  try {
    const { consultantId } = req.params;
    const { search } = req.body; // Extract search query from the request body
 
    // Base match condition
    const matchCondition = { consultantId: parseInt(consultantId) };
 
    if (search) {
      // Split the search term into words (assuming space between first name and last name)
      const searchWords = search.split(' ').map(word => word.trim()).filter(word => word);
 
      // Create regex conditions for both firstName and lastName fields
      const regexConditions = searchWords.map(word => ({
        $or: [
          { 'patientDetails.information.firstName': { $regex: word, $options: 'i' } },
          { 'patientDetails.information.lastName': { $regex: word, $options: 'i' } },
        ]
      }));
 
      // Combine the conditions for matching any of the search words
      matchCondition.$or = regexConditions.flat(); // Flatten the array to ensure correct matching
    }
 
     
 
    // Aggregation pipeline to fetch chat details along with patient and consultant minimal details
    const chats = await Chat.aggregate([
      {
        $match: matchCondition, // Match by consultantId and search filter
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
      return res.status(404).json({ message: 'No chats found for this consultant.' });
    }
 
        // Decrypt messages for each chat
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
  } catch (error) {
    console.error('Error fetching chats:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
 
module.exports = { getChatsByConsultantId };