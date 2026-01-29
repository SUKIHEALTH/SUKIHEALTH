const Appointment = require('../models/appointmentModel'); // Import the Appointment model

// Controller to fetch all appointments with pagination
const fetchAllAppointments = async (req, res) => {
  try {
    // Extract pageNumber and pageSize from the request body, set defaults if not provided
    const { pageNumber = 1, pageSize = 10 } = req.body; // Default to page 1 and 10 items per page
    const skip = (pageNumber - 1) * pageSize;

    // Use aggregation to fetch appointments along with patient and consultant details
    const appointments = await Appointment.aggregate([
      {
        $sort: { appointmentDate: -1 }, // Sort by appointment date in descending order
      },
      {
        $lookup: {
          from: 'patients', // Join with the patients collection
          localField: 'patientId', // Match the patientId field in the appointments collection
          foreignField: 'userId', // Match the userId field in the patients collection
          as: 'patientDetails', // Field to store joined patient data
        },
      },
      {
        $unwind: {
          path: '$patientDetails', // Flatten the patientDetails array
          preserveNullAndEmptyArrays: true, // Allow missing patient details
        },
      },
      {
        $lookup: {
          from: 'consultants', // Join with the consultants collection
          localField: 'consultantId', // Match the consultantId field in the appointments collection
          foreignField: 'userId', // Match the userId field in the consultants collection
          as: 'consultantDetails', // Field to store joined consultant data
        },
      },
      {
        $unwind: {
          path: '$consultantDetails', // Flatten the consultantDetails array
          preserveNullAndEmptyArrays: true, // Allow missing consultant details
        },
      },
      {
        $project: {
          _id: 1,
          appointmentId: 1,
          patientId: 1,
          consultantId: 1,
          appointmentDate: 1,
          appointmentLink: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          'patientDetails.information.firstName': 1, // Include patient's first name
          'patientDetails.information.lastName': 1, // Include patient's last name
          'patientDetails.profileImage': 1, // Include patient's profile image
          'consultantDetails.information.firstName': 1, // Include consultant's first name
          'consultantDetails.information.lastName': 1, // Include consultant's last name
          'consultantDetails.information.displayName': 1,
          'consultantDetails.profileImage': 1, // Include consultant's profile image
        },
      },
      {
        $skip: skip, // Skip documents for pagination
      },
      {
        $limit: pageSize, // Limit the number of documents for pagination
      },
    ]);

    // Get the total count of appointments for pagination metadata
    const totalCount = await Appointment.countDocuments();

    // If no appointments are found
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found.' });
    }

    // Send the fetched appointments along with pagination metadata
    res.status(200).json({
      appointments,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: pageNumber,
      totalCount,
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error while fetching appointments.' });
  }
};

module.exports = { fetchAllAppointments };
