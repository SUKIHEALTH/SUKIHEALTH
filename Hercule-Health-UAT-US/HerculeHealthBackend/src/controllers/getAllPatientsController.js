// const Patient = require('../models/patientModel');
// const User = require('../models/userModel');

// // Controller to fetch all patients with corresponding user data and pagination
// const getAllPatients = async (req, res) => {
//   const { pageNumber = 1, pageSize = 30 } = req.body; // Extract pagination parameters

//   try {
//     // Pagination logic
//     const skip = (pageNumber - 1) * pageSize;

//     // Fetch patients with pagination and user lookup
//     const patients = await Patient.aggregate([
//       { $match: {} }, // No search condition applied
//       {
//         $lookup: {
//           from: 'users', // User collection name
//           localField: 'userId',
//           foreignField: 'userId',
//           as: 'userDetails',
//         },
//       },
//       { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
//       {
//         $project: {
//           patientId: 1,
//           userId: 1,
//           'information.firstName': 1,
//           'information.lastName': 1,
//           'information.age': 1,
//           'information.gender': 1,
//           'userDetails.username': 1,
//           'userDetails.email': 1,
//           'userDetails.role': 1,
//           'userDetails.access_type': 1,
//           'userDetails.is_loggedIn': 1,
//           'userDetails.is_active': 1,
//         },
//       },
//       { $sort: { 'information.firstName': 1 } }, // Sort by first name
//       { $skip: skip }, // Pagination: Skip documents
//       { $limit: parseInt(pageSize) }, // Pagination: Limit documents
//     ]);

//     if (!patients.length) {
//       return res.status(404).json({ message: 'No patients found.' });
//     }

//     // Fetch total count for pagination
//     const totalPatients = await Patient.countDocuments({});

//     return res.status(200).json({
//       message: 'Patients fetched successfully.',
//       data: patients,
//       pagination: {
//         totalPatients,
//         currentPage: parseInt(pageNumber),
//         totalPages: Math.ceil(totalPatients / pageSize),
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching patients:', error);
//     return res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// };

// module.exports = { getAllPatients };

const Patient = require('../models/patientModel');
const User = require('../models/userModel');

// Controller to fetch all patients with corresponding user data and pagination
const getAllPatients = async (req, res) => {
  const { pageNumber = 1, pageSize = 30 } = req.body; // Extract pagination parameters

  try {
    // Pagination logic
    const skip = (pageNumber - 1) * pageSize;

    // Fetch patients with pagination and user lookup
    const patients = await Patient.aggregate([
      { $match: {} }, // No search condition applied
      {
        $lookup: {
          from: 'users', // User collection name
          localField: 'userId',
          foreignField: 'userId',
          as: 'userDetails',
        },
      },
      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          patientId: 1,
          userId: 1,
          profileImage: 1, // Include profileImage field
          'information.firstName': 1,
          'information.lastName': 1,
          'information.age': 1,
          'information.gender': 1,
          'information.phone': 1, // Include phone field
          'information.email': 1, // Include email field
          'userDetails.username': 1,
          'userDetails.email': 1,
          'userDetails.role': 1,
          'userDetails.access_type': 1,
          'userDetails.is_loggedIn': 1,
          'userDetails.is_active': 1,
        },
      },
      { $sort: { 'information.firstName': 1 } }, // Sort by first name
      { $skip: skip }, // Pagination: Skip documents
      { $limit: parseInt(pageSize) }, // Pagination: Limit documents
    ]);

    if (!patients.length) {
      return res.status(404).json({ message: 'No patients found.' });
    }

    // Fetch total count for pagination
    const totalPatients = await Patient.countDocuments({});

    // Aggregate to get patient registrations count by month and year
    const monthlyRegisteredPatients = await Patient.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalCount: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }, // Sort by year and month descending
    ]);

    // Format monthly registered patients data
    const formattedMonthlyData = monthlyRegisteredPatients.map(record => ({
      year: record._id.year,
      month: record._id.month,
      registeredPatients: record.totalCount,
    }));

    // Send response with counts outside pagination
    return res.status(200).json({
      message: 'Patients fetched successfully.',
      data: patients,
      totalPatients, // Total number of patients
      monthlyRegisteredPatients: formattedMonthlyData, // Monthly registered patients counts
      pagination: {
        currentPage: parseInt(pageNumber),
        totalPages: Math.ceil(totalPatients / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { getAllPatients };
