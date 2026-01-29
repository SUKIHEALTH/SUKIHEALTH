const Notification = require('../models/notificationModel'); // Assuming your model is here

const getUserNotifications = async (req, res) => {
  const { userId } = req.params; // Extract userId from request parameters
  const { limit } = req.body; // Extract limit from request body

  // Validate userId
  if (!userId || isNaN(Number(userId))) {
    return res.status(400).json({ error: 'Invalid or missing userId parameter.' });
  }

  try {
    const query = Notification.find({ userId: Number(userId) }).sort({ createdAt: -1 });

    // Apply limit only if valid and greater than 0
    if (limit && Number(limit) > 0) {
      query.limit(Number(limit));
    }

    const notifications = await query;

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ message: 'No notifications found for this user.' });
    }

    res.status(200).json(notifications); // Send notifications as JSON response
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
};

module.exports = { getUserNotifications };
