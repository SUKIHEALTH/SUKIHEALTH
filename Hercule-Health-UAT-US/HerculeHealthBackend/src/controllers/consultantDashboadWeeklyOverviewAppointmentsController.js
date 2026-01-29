const mongoose = require('mongoose');
const Appointment = require('../models/appointmentModel');

const getWeeklyOverview = async (req, res) => {
  const { consultantId } = req.params;

  try {
    // Get today's date
    const today = new Date();

    // Calculate the difference between today and the previous Monday
    const diffToPreviousMonday = today.getDay() === 0 ? 6 : today.getDay() - 1; // Sunday (0) to Monday (1), ... Saturday (6) to Monday (1)
    const previousMonday = new Date(today);
    previousMonday.setDate(today.getDate() - diffToPreviousMonday); // Set to previous Monday
    
    // Set the end date (Sunday of the previous week)
    const previousSunday = new Date(previousMonday);
    previousSunday.setDate(previousMonday.getDate() + 6); // Sunday is 6 days after Monday
    
    // Get the start date of last week (previous week's Monday)
    const startOfLastWeek = new Date(previousMonday);
    startOfLastWeek.setDate(previousMonday.getDate() - 7); // 7 days before last Monday gives us the previous week's Monday

    // Get the end date of last week (previous week's Sunday)
    const endOfLastWeek = new Date(previousSunday);
    endOfLastWeek.setDate(previousSunday.getDate() - 7); // 7 days before last Sunday gives us the previous week's Sunday

    // Format the date to "MMM dd" format (e.g., Nov 25 - Dec 01)
    const formatDate = (date) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    };

    const weekRange = `${formatDate(startOfLastWeek)} - ${formatDate(endOfLastWeek)}`;

    // Fetch appointments from the previous week's Monday to Sunday
    const appointments = await Appointment.aggregate([
      {
        $match: {
          consultantId: parseInt(consultantId), // Match the consultantId
          appointmentDate: {
            $gte: startOfLastWeek, // From last week's Monday
            $lte: endOfLastWeek, // Until last week's Sunday
          },
        },
      },
      {
        $project: {
          appointmentDate: 1, // Keep appointmentDate
          dayOfWeek: { $dayOfWeek: "$appointmentDate" }, // Get the day of the week (1 = Sunday, 2 = Monday, ..., 7 = Saturday)
        },
      },
      {
        $group: {
          _id: "$appointmentDate", // Group by exact appointment date
          appointmentCount: { $sum: 1 }, // Count the number of appointments for each day
        },
      },
      {
        $sort: { _id: 1 }, // Sort by appointment date (ascending order)
      },
    ]);

    // Define day names corresponding to dayOfWeek (1 = Sunday, 2 = Monday, ..., 7 = Saturday)
    const dayNames = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];

    const dayWiseCount = [];
    const dayStartDate = new Date(startOfLastWeek); // Start date for the week (Monday)

    // Populate day-wise data with date, day, and count
    for (let i = 1; i <= 7; i++) { // Sunday to Saturday (days 1-7)
      const currentDay = dayStartDate;
      const dayName = dayNames[i]; // Monday to Sunday
      const dateString = currentDay.toISOString().split('T')[0]; // Get date in YYYY-MM-DD format
      const appointmentData = appointments.find(app => app._id.toISOString().split('T')[0] === dateString) || { appointmentCount: 0 };

      dayWiseCount.push({
        date: dateString,
        day: dayName,
        count: appointmentData.appointmentCount,
      });

      dayStartDate.setDate(dayStartDate.getDate() + 1); // Move to next day
    }

    // Send the response
    res.status(200).json({
      weekRange,
      dayWiseCount,
    });
  } catch (error) {
    console.error('Error fetching weekly overview:', error);
    res.status(500).json({ error: 'Failed to fetch weekly overview of appointments.' });
  }
};

module.exports = { getWeeklyOverview };
