const Patient = require('../models/patientModel'); // Patient model
const Consultant = require('../models/consultantModel'); // Consultant model

// Fetch all requests and corresponding consultant details
// const getPatientRequests = async (req, res) => {
//   console.log("api called")
//   const { patientId } = req.params;

//   try {
//     // Find the patient by ID
//     const patient = await Patient.findOne({ userId: patientId });

//     if (!patient) {
//       return res.status(404).json({ error: 'Patient not found.' });
//     }

//     // Extract all requests from the patient
//     const requests = patient.requests;

//     if (!requests || requests.length === 0) {
//       return res.status(404).json({ error: 'No requests found for the patient.' });
//     }

//     // Fetch consultant details for each requestedId
//     const consultantDetails = await Promise.all(
//       requests.map(async (request) => {
//         const consultant = await Consultant.findOne(
//           { userId: request.requestedId },
//           { 'information.displayName': 1, profileImage: 1, 'information.designation': 1, _id: 0 } // Select nested fields
//         );

//         return {
//           ...request.toObject(), // Include the original request details
//           requestUserDetails: consultant
//             ? {
//                 displayName: consultant.information?.displayName || null,
//                 designation: consultant.information?.designation || null,
//                 profileImage: consultant.profileImage || null,
//               }
//             : null, // Add consultant details or null if not found
//         };
//       })
//     );

//     res.status(200).json({
//       message: 'Patient requests with consultant details fetched successfully.',
//       requests: consultantDetails,
//     });
//   } catch (error) {
//     console.error('Error fetching patient requests with consultants:', error);
//     res.status(500).json({ error: 'Failed to fetch patient requests with consultants.' });
//   }
// };

// module.exports = { getPatientRequests };

const getPatientRequests = async (req, res) => {
  console.log("API called");
  const { patientId } = req.params;

  try {
    // Find the patient by ID
    const patient = await Patient.findOne({ userId: patientId });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    // Extract all requests from the patient
    const requests = patient.requests;

    if (!requests || requests.length === 0) {
      return res.status(200).json({
        message: 'No requests found for the patient.',
        requests: [], // Return an empty array to maintain consistent data structure
      });
    }

    // Fetch consultant details for each requestedId
    const consultantDetails = await Promise.all(
      requests.map(async (request) => {
        const consultant = await Consultant.findOne(
          { userId: request.requestedId },
          { 'information.displayName': 1, profileImage: 1, 'information.designation': 1, _id: 0 } // Select nested fields
        );

        return {
          ...request.toObject(), // Include the original request details
          requestUserDetails: consultant
            ? {
                displayName: consultant.information?.displayName || null,
                designation: consultant.information?.designation || null,
                profileImage: consultant.profileImage || null,
              }
            : null, // Add consultant details or null if not found
        };
      })
    );

    res.status(200).json({
      message: 'Patient requests with consultant details fetched successfully.',
      requests: consultantDetails,
    });
  } catch (error) {
    console.error('Error fetching patient requests with consultants:', error);
    res.status(500).json({ error: 'Failed to fetch patient requests with consultants.' });
  }
};

module.exports = { getPatientRequests };
