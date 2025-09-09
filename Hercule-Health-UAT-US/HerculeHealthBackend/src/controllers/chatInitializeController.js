const Chat = require('../models/chatModel');
const Patient = require('../models/patientModel'); // Assuming the Patient model
const Consultant = require('../models/consultantModel'); // Assuming the Consultant model
const Setting = require('../models/settingModel'); // ADD THIS LINE
const { uploadToS3, encryptBuffer } = require('../config/s3Service'); // Import the S3 upload service
const crypto = require("crypto");
const ENCRYPTION_KEY = process.env.CHAT_ENCRYPTION_KEY || "your-32-byte-key-1234567890123456"; // 32 bytes for aes-256
const IV_LENGTH = 16;
// const DAILY_MESSAGE_LIMIT = 10;

const getDailyMessageLimit = async () => {
  try {
    const settings = await Setting.findOne().sort({ createdAt: -1 }); // Get latest settings
    return settings?.messageLimit || 30; // Default to 30 if no settings found
  } catch (error) {
    console.error('Error fetching message limit from settings:', error);
    return 30; // Default fallback
  }
};

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(JSON.stringify(text));
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
  if (typeof text !== "string") return text;
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return JSON.parse(decrypted.toString());
}

const getDailyMessageCount = async (patientId, consultantId) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const chat = await Chat.findOne({
      $or: [
        { patientId, consultantId },
        { patientId: consultantId, consultantId: patientId },
      ],
    });

    if (!chat) return 0;

    const todayMessages = chat.messages.filter(message => {
      const messageDate = new Date(message.timestamp);
      return messageDate >= startOfDay && messageDate < endOfDay;
    });

    return todayMessages.length;
  } catch (error) {
    console.error('Error checking daily message count:', error);
    return 0;
  }
};

const isDailyLimitReached = async (patientId, consultantId) => {
  const count = await getDailyMessageCount(patientId, consultantId);
  const limit = await getDailyMessageLimit(); // GET LIMIT DYNAMICALLY
  return count >= limit;
};

const Notification = require('../models/notificationModel'); // Assuming you have a Notification model
const { default: mongoose } = require('mongoose');

// Map to store userId and socketId for efficient lookup
const userSocketMap = {};

const handleSocketConnection = (io, socket) => {
  console.log('A user connected:', socket.id);

  // Store userId to socket mapping
  socket.on('joinRoom', async ({ userId, roomId }) => {
    console.log(`User ${userId} is attempting to join room ${roomId}`);
    userSocketMap[userId] = socket.id;

    // Join room for chat
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);

    // Notify the user that they have successfully joined the room
    const [id1, id2] = roomId.split('_');
  const patientId = Math.min(id1, id2);
  const consultantId = Math.max(id1, id2);
  const dailyCount = await getDailyMessageCount(patientId, consultantId);
  const messageLimit = await getDailyMessageLimit(); // GET DYNAMIC LIMIT
  const limitReached = dailyCount >= messageLimit;

  socket.emit('roomJoined', { 
    roomId, 
    dailyMessageCount: dailyCount,
    dailyMessageLimit: messageLimit, // USE DYNAMIC LIMIT
    limitReached 
  });
});

  // Notifications: User joins their notification room
  socket.on('joinUserRoom', (userId) => {
    userSocketMap[userId] = socket.id;
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their notification room`);
  });

  // Fetch initial notifications
  socket.on('subscribeToNotifications', async ( userId) => {
    limit = 15;
    try {
      const query = Notification.find({ userId }).sort({ createdAt: -1 });
  
      // Apply limit if provided
      if (limit && Number(limit) > 0) {
        query.limit(Number(limit));
      }
  
      const notifications = await query;
  
      socket.emit('initialNotifications', notifications);
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  });

  // Handle sending a message in chat
  socket.on('sendMessage', async (data) => {
    console.log('Message received:', data);
    try {
      const { senderId, receiverId, message, messageType, file } = data;
      let fileUrl = null;

      if (file) {
        // file may be a Buffer or base64 string from frontend
        let fileBuffer = file;
        if (typeof file === "string" && file.startsWith("data:")) {
          // Convert base64 to Buffer
          const base64Data = file.split(',')[1];
          fileBuffer = Buffer.from(base64Data, 'base64');
        }
        // Encrypt the buffer
        const encryptedBuffer = encryptBuffer(fileBuffer);
        fileUrl = await uploadToS3(encryptedBuffer);
        console.log('File uploaded to S3:', fileUrl);
      }

      const patientId = senderId; // Replace with actual logic to determine patient
      const consultantId = receiverId; // Replace with actual logic to determine consultant
     const messageLimit = await getDailyMessageLimit();
    const dailyCount = await getDailyMessageCount(patientId, consultantId);
    const limitReached = dailyCount >= messageLimit;
   if (limitReached) {
      socket.emit('messageLimitReached', {
        error: 'Daily message limit reached',
        dailyMessageLimit: messageLimit, // USE DYNAMIC LIMIT
        message: `You have reached the daily limit of ${messageLimit} messages. Please try again tomorrow.`
      });
      return;
    }
      const newMessage = {
        senderId,
        message: encrypt(message),
        messageType,
        timestamp: new Date(),
        file: fileUrl || '',
        read: false,
      };

      // Check if a chat already exists
      let chat = await Chat.findOne({
        $or: [
          { patientId, consultantId },
          { patientId: receiverId, consultantId: senderId },
        ],
      });

      if (!chat) {
        // Create a new chat only if it doesn't exist
        chat = new Chat({ chatId: new mongoose.Types.ObjectId().toString(), patientId, consultantId, messages: [newMessage] });
        console.log('New chat created:', chat);
      } else {
        chat.messages.push(newMessage);
        console.log('Message added to existing chat:', chat);
      }

      await chat.save();

      const roomId = `${Math.min(senderId, receiverId)}_${Math.max(senderId, receiverId)}`;
      const updatedDailyCount = await getDailyMessageCount(patientId, consultantId);
      const newLimitReached = updatedDailyCount >= messageLimit;

      // Emit the message only to the room
      const messageToSend = {
        ...newMessage,
        message: decrypt(newMessage.message)
      };
      io.to(roomId).emit('newMessage', messageToSend);
      io.to(roomId).emit('dailyLimitUpdate', {
      dailyMessageCount: updatedDailyCount,
      dailyMessageLimit: messageLimit, // USE DYNAMIC LIMIT
      limitReached: newLimitReached
    });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Mark messages as read
  socket.on('markMessagesAsRead', async ({ userId, chatId }) => {
    try {
      await Chat.updateOne(
        { chatId, 'messages.receiverId': userId },
        { $set: { 'messages.$[elem].read': true } },
        { arrayFilters: [{ 'elem.read': false }] }
      );
      socket.emit('markMessagesAsReadResponse', { success: true });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      socket.emit('markMessagesAsReadResponse', { success: false });
    }
  });

  // Fetch unread messages
  socket.on('fetchUnreadMessages', async ({ userId }) => {
    try {
      const unreadChats = await Chat.find({
        'messages.read': false,
        $or: [{ patientId: userId }, { consultantId: userId }],
      });

      const unreadMessages = unreadChats.flatMap((chat) =>
        chat.messages.filter((message) => !message.read)
      );

      socket.emit('unreadMessages', unreadMessages);
    } catch (error) {
      console.error('Error fetching unread messages:', error);
    }
  });

  // Emit new notifications to specific users
  const sendNotification = (notification) => {
    notification.userId.forEach((userId) => {
      if (userSocketMap[userId]) {
        io.to(userSocketMap[userId]).emit('newNotification', notification);
      }
    });
  };

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    for (const userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }
  });
};

module.exports = { handleSocketConnection };