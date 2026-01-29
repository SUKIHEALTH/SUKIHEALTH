// const Payment = require('../models/paymentModel');
// const Consultant = require('../models/consultantModel');
// const Patient = require('../models/patientModel');
// const Appointment = require('../models/appointmentModel');
// const User = require('../models/userModel'); // <-- Make sure you have this model imported too
// const { sendEmail } = require('../config/emailService');
// const { createGoogleMeet } = require('../config/googleMeet'); 
// const { createTeamsMeet } = require('../config/teamsMeet'); 
// const Notification = require('../models/notificationModel');

// const getBookingDetails = async (req, res) => {
//   try {
//     const { appointmentId } = req.params;
//     const { consultantId, appointmentType, date, time, timeZone } = req.body;

//     // Fetch payment details
//     const paymentDetails = await Payment.findOne({ appointmentId });
//     if (!paymentDetails) {
//       return res.status(404).json({ message: 'Payment details not found.' });
//     }

//     // Fetch consultant details
//     const consultantDetails = await Consultant.findOne(
//       { userId: consultantId },
//       'userId information.displayName information.firstName information.lastName profileImage information.designation information.email'
//     );
//     if (!consultantDetails) {
//       return res.status(404).json({ message: 'Consultant details not found.' });
//     }

//     // Fetch patient details
//     const patientDetails = await Patient.findOne(
//       { userId: paymentDetails.patientId },
//       'userId information.email information.firstName information.lastName information.dateOfBirth'
//     );
//     if (!patientDetails) {
//       return res.status(404).json({ message: 'Patient details not found.' });
//     }

//     // Fetch appointment details
//     const appointmentDetails = await Appointment.findOne(
//       { appointmentId },
//       'appointmentId appointmentDate'
//     );
//     if (!appointmentDetails) {
//       return res.status(404).json({ message: 'Appointment details not found.' });
//     }

//     // ✅ Format appointment date and time to CET timezone
//     const appointmentDateObj = new Date(appointmentDetails.appointmentDate);

//     // Format date in CET
//     const appointmentDate = appointmentDateObj.toLocaleDateString('en-GB', {
//       timeZone: 'Europe/Berlin',
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit'
//     });

//     // Format time in CET with AM/PM
//     const appointmentTime = appointmentDateObj.toLocaleTimeString('en-GB', {
//       timeZone: 'Europe/Berlin',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });

//     // Add time zone label (CET/CEST based on date)
//     const timeZoneName = appointmentDateObj.toLocaleDateString('en-GB', {
//       timeZone: 'Europe/Berlin',
//       timeZoneName: 'short'
//     }).split(' ').pop(); // 'CET' or 'CEST'

//     const appointmentTimeWithZone = `${appointmentTime} ${timeZoneName}`; // e.g. "02:30 PM CET"


//     // If payment is paid, send emails to consultant, patient and admin
//     if (paymentDetails.status === 'paid') {

    
//       let appointmentLink = null;

//       if (appointmentType === 'googleMeet') {
//         appointmentLink = await createGoogleMeet(
//           patientDetails.information.email,
//           consultantDetails.information.email,
//           date,
//           time,
//           timeZone // replace if you have timezone info stored
//         );
//       } else if (appointmentType === 'teamsMeet') {
//         appointmentLink = await createTeamsMeet(
//           patientDetails.information.email,
//           consultantDetails.information.email,
//           date,
//           time,
//           timeZone 
//         );
//       }

//       // Save appointment link to appointment
//       if (appointmentLink) {
//         await Appointment.updateOne(
//           { appointmentId },
//           { $set: { appointmentLink, updatedAt: new Date() } }
//         );
//       }

//       // Send emails (already handled in your existing code here...)

//       // Create notification for patient, consultant, and admin
//       const notificationMessage = `New appointment confirmed. ID: ${appointmentId}, Date: ${appointmentDate}, Time: ${appointmentTimeWithZone}.`;
//       const userIds = [paymentDetails.patientId, consultantId, 1]; // assuming 1 is admin

//       const notification = new Notification({
//         notificationId: Date.now(),
//         userId: userIds,
//         type: 'Appointment',
//         message: notificationMessage,
//         isRead: userIds.map(() => false),
//         relatedId: appointmentDetails._id,
//       });
//       await notification.save();
    


//       // Consultant Email
//       const consultantEmailData = {
//         mail_type: 'consultant_booking_confirmation_mail',
//         name: `${consultantDetails.information.firstName} ${consultantDetails.information.lastName}`,
//         patientName: `${patientDetails.information.firstName} ${patientDetails.information.lastName}`,
//         appointmentId: appointmentDetails.appointmentId,
//         appointmentDate,
//         appointmentSlote: appointmentTimeWithZone,
//         email: consultantDetails.information.email,
//         subject: "New Appointment Booking",
//         verification_key: paymentDetails._id,
//       };
//       await sendEmail(consultantEmailData);

//       // Patient Email
//       const patientEmailData = {
//         mail_type: 'patient_booking_confirmation_mail',
//         name: `${patientDetails.information.firstName} ${patientDetails.information.lastName}`,
//         consultantName: `${consultantDetails.information.firstName} ${consultantDetails.information.lastName}`,
//         appointmentId: appointmentDetails.appointmentId,
//         appointmentDate,
//         appointmentSlote: appointmentTimeWithZone,
//         email: patientDetails.information.email,
//         subject: "Appointment Confirmation",
//         verification_key: paymentDetails._id,
//       };
//       await sendEmail(patientEmailData);

//       // Fetch all Admin users (access_type === 1)
//       const adminUsers = await User.find({ access_type: 1 }, 'firstName lastName email');


//       // Send email to each admin
//       for (const admin of adminUsers) {
//         console.log("admin mail", admin.email);
//         const adminEmailData = {
//           mail_type: 'admin_new_booking_notification_mail',
//           name: `${admin.firstName} ${admin.lastName}`,
//           consultantName: `${consultantDetails.information.firstName} ${consultantDetails.information.lastName}`,
//           patientName: `${patientDetails.information.firstName} ${patientDetails.information.lastName}`,
//           appointmentId: appointmentDetails.appointmentId,
//           appointmentDate,
//           appointmentSlote: appointmentTimeWithZone,
//           email: admin.email,
//           subject: "New Appointment Scheduled",
//           verification_key: paymentDetails._id,
//         };
//         await sendEmail(adminEmailData);
//       }
//     }

//     // Combine and send response
//     const response = {
//       paymentDetails,
//       consultantDetails,
//     };

//     res.status(200).json(response);

//   } catch (error) {
//     console.error('Error fetching booking details:', error);
//     res.status(500).json({ message: 'Failed to fetch details.' });
//   }
// };

// module.exports = { getBookingDetails };

const Payment = require('../models/paymentModel');
const Consultant = require('../models/consultantModel');
const Patient = require('../models/patientModel');
const Appointment = require('../models/appointmentModel');
const User = require('../models/userModel');
const { sendEmail } = require('../config/emailService');
const { createGoogleMeet } = require('../config/googleMeet'); 
const { createTeamsMeet } = require('../config/teamsMeet'); 
const Notification = require('../models/notificationModel');

const getBookingDetails = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { consultantId, appointmentType, date, time, timeZone } = req.body;

    // Fetch payment details
    const paymentDetails = await Payment.findOne({ appointmentId });
    if (!paymentDetails) {
      return res.status(404).json({ message: 'Payment details not found.' });
    }

    // Fetch consultant details
    const consultantDetails = await Consultant.findOne(
      { userId: consultantId },
      'userId information.displayName information.firstName information.lastName profileImage information.designation information.email'
    );
    if (!consultantDetails) {
      return res.status(404).json({ message: 'Consultant details not found.' });
    }

    // Fetch patient details
    const patientDetails = await Patient.findOne(
      { userId: paymentDetails.patientId },
      'userId information.email information.firstName information.lastName information.dateOfBirth'
    );
    if (!patientDetails) {
      return res.status(404).json({ message: 'Patient details not found.' });
    }

    // Fetch appointment details
    const appointmentDetails = await Appointment.findOne(
      { appointmentId },
      'appointmentId appointmentDate'
    );
    if (!appointmentDetails) {
      return res.status(404).json({ message: 'Appointment details not found.' });
    }

    // Format appointment date and time to CET timezone
    const appointmentDateObj = new Date(appointmentDetails.appointmentDate);

    // Format date in CET
    const appointmentDate = appointmentDateObj.toLocaleDateString('en-GB', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    // Format time in CET with AM/PM
    const appointmentTime = appointmentDateObj.toLocaleTimeString('en-GB', {
      timeZone: 'Europe/Berlin',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Add time zone label (CET/CEST based on date)
    const timeZoneName = appointmentDateObj.toLocaleDateString('en-GB', {
      timeZone: 'Europe/Berlin',
      timeZoneName: 'short'
    }).split(' ').pop();

    const appointmentTimeWithZone = `${appointmentTime} ${timeZoneName}`;

    // If payment is paid, process booking completion
    if (paymentDetails.status === 'paid') {
      let appointmentLink = null;

      console.log('🔗 [MEETING LINK] Appointment type:', appointmentType);
      console.log('🔗 [MEETING LINK] Patient email:', patientDetails.information.email);
      console.log('🔗 [MEETING LINK] Consultant email:', consultantDetails.information.email);
      console.log('🔗 [MEETING LINK] Date:', date);
      console.log('🔗 [MEETING LINK] Time:', time);
      console.log('🔗 [MEETING LINK] TimeZone:', timeZone);

      // Create meeting link based on appointment type
      if (appointmentType === 'googleMeet') {
        console.log('🔗 [GOOGLE MEET] Starting Google Meet creation process');
        try {
          console.log('🔗 [GOOGLE MEET] Calling createGoogleMeet function with parameters:');
          console.log('  - Patient Email:', patientDetails.information.email);
          console.log('  - Consultant Email:', consultantDetails.information.email);
          console.log('  - Date:', date);
          console.log('  - Time:', time);
          console.log('  - TimeZone:', timeZone);

          const googleMeetResponse = await createGoogleMeet(
            patientDetails.information.email,
            consultantDetails.information.email,
            date,
            time,
            timeZone
          );
          
          console.log('🔗 [GOOGLE MEET] Raw response received:');
          console.log('  - Type:', typeof googleMeetResponse);
          console.log('  - Value:', googleMeetResponse);
          console.log('  - JSON stringified:', JSON.stringify(googleMeetResponse, null, 2));

          // Check different possible response structures
          console.log('🔗 [GOOGLE MEET] Checking response structure:');
          console.log('  - googleMeetResponse?.joinUrl:', googleMeetResponse?.joinUrl);
          console.log('  - googleMeetResponse?.hangoutLink:', googleMeetResponse?.hangoutLink);
          console.log('  - googleMeetResponse?.htmlLink:', googleMeetResponse?.htmlLink);
          console.log('  - googleMeetResponse?.conferenceData?.entryPoints:', googleMeetResponse?.conferenceData?.entryPoints);
          
          if (googleMeetResponse?.conferenceData?.entryPoints) {
            console.log('🔗 [GOOGLE MEET] Entry points found:', googleMeetResponse.conferenceData.entryPoints);
            const videoEntryPoint = googleMeetResponse.conferenceData.entryPoints.find(ep => ep.entryPointType === 'video');
            console.log('🔗 [GOOGLE MEET] Video entry point:', videoEntryPoint);
          }

          appointmentLink = googleMeetResponse?.joinUrl || 
                           googleMeetResponse?.hangoutLink || 
                           googleMeetResponse?.htmlLink ||
                           googleMeetResponse?.conferenceData?.entryPoints?.find(ep => ep.entryPointType === 'video')?.uri ||
                           googleMeetResponse;

          console.log('🔗 [GOOGLE MEET] Final extracted appointment link:', appointmentLink);
          console.log('🔗 [GOOGLE MEET] Appointment link type:', typeof appointmentLink);
          console.log('✅ [GOOGLE MEET] Google Meet processing completed successfully');
        } catch (error) {
          console.log('❌ [GOOGLE MEET] Error creating Google Meet:');
          console.log('  - Error message:', error.message);
          console.log('  - Error stack:', error.stack);
          console.log('  - Error name:', error.name);
          console.log('  - Full error object:', error);
        }
      } else if (appointmentType === 'teamsMeet') {
        console.log('🔗 [TEAMS MEET] Starting Teams Meet creation process');
        try {
          const teamsMeetResponse = await createTeamsMeet(
            patientDetails.information.email,
            consultantDetails.information.email,
            date,
            time,
            timeZone
          );
          
          console.log('🔗 [TEAMS MEET] Teams response received:', typeof teamsMeetResponse);
          appointmentLink = teamsMeetResponse?.joinUrl || teamsMeetResponse?.joinWebUrl || teamsMeetResponse;
          console.log('✅ [TEAMS MEET] Teams Meet link extracted:', appointmentLink);
        } catch (error) {
          console.log('❌ [TEAMS MEET] Error creating Teams Meet:', error.message);
        }
      } else {
        console.log('⚠️ [MEETING LINK] Unknown or missing appointment type:', appointmentType);
      }

      // Save appointment link to appointment
      console.log('💾 [DATABASE] Preparing to save appointment link:');
      console.log('  - Link value:', appointmentLink);
      console.log('  - Link type:', typeof appointmentLink);
      console.log('  - Is string?:', typeof appointmentLink === 'string');
      console.log('  - Is truthy?:', !!appointmentLink);

      if (appointmentLink && typeof appointmentLink === 'string') {
        console.log('💾 [DATABASE] Conditions met, attempting to save appointment link');
        try {
          const updateResult = await Appointment.updateOne(
            { appointmentId },
            { $set: { appointmentLink, updatedAt: new Date() } }
          );
          console.log('✅ [DATABASE] Appointment link saved successfully');
          console.log('  - Modified count:', updateResult.modifiedCount);
          console.log('  - Matched count:', updateResult.matchedCount);
        } catch (error) {
          console.log('❌ [DATABASE] Error saving appointment link:', error.message);
        }
      } else {
        console.log('⚠️ [DATABASE] Appointment link not saved - failed validation');
        console.log('  - appointmentLink exists:', !!appointmentLink);
        console.log('  - appointmentLink is string:', typeof appointmentLink === 'string');
      }

      // Create notification
      try {
        const notificationMessage = `New appointment confirmed. ID: ${appointmentId}, Date: ${appointmentDate}, Time: ${appointmentTimeWithZone}.`;
        const userIds = [paymentDetails.patientId, consultantId, 1];

        const notification = new Notification({
          notificationId: Date.now(),
          userId: userIds,
          type: 'Appointment',
          message: notificationMessage,
          isRead: userIds.map(() => false),
          relatedId: appointmentDetails._id,
        });
        
        await notification.save();
      } catch (error) {
        // Handle error silently or log to external service
      }

      // Send consultant email
      try {
        const consultantEmailData = {
          mail_type: 'consultant_booking_confirmation_mail',
          name: `${consultantDetails.information.firstName} ${consultantDetails.information.lastName}`,
          patientName: `${patientDetails.information.firstName} ${patientDetails.information.lastName}`,
          appointmentId: appointmentDetails.appointmentId,
          appointmentDate,
          appointmentSlote: appointmentTimeWithZone,
          email: consultantDetails.information.email,
          subject: "New Appointment Booking",
          verification_key: paymentDetails._id,
        };
        
        await sendEmail(consultantEmailData);
      } catch (error) {
        // Handle error silently or log to external service
      }

      // Send patient email
      try {
        const patientEmailData = {
          mail_type: 'patient_booking_confirmation_mail',
          name: `${patientDetails.information.firstName} ${patientDetails.information.lastName}`,
          consultantName: `${consultantDetails.information.firstName} ${consultantDetails.information.lastName}`,
          appointmentId: appointmentDetails.appointmentId,
          appointmentDate,
          appointmentSlote: appointmentTimeWithZone,
          email: patientDetails.information.email,
          subject: "Appointment Confirmation",
          verification_key: paymentDetails._id,
        };
        
        await sendEmail(patientEmailData);
      } catch (error) {
        // Handle error silently or log to external service
      }

      // Fetch and send admin emails
      try {
        const adminUsers = await User.find({ access_type: 1 }, 'firstName lastName email');

        for (const admin of adminUsers) {
          try {
            const adminEmailData = {
              mail_type: 'admin_new_booking_notification_mail',
              name: `${admin.firstName} ${admin.lastName}`,
              consultantName: `${consultantDetails.information.firstName} ${consultantDetails.information.lastName}`,
              patientName: `${patientDetails.information.firstName} ${patientDetails.information.lastName}`,
              appointmentId: appointmentDetails.appointmentId,
              appointmentDate,
              appointmentSlote: appointmentTimeWithZone,
              email: admin.email,
              subject: "New Appointment Scheduled",
              verification_key: paymentDetails._id,
            };
            
            await sendEmail(adminEmailData);
          } catch (error) {
            // Handle individual admin email error silently
          }
        }
      } catch (error) {
        // Handle admin emails fetch error silently
      }
    }

    // Prepare and send response
    const response = {
      paymentDetails,
      consultantDetails,
    };

    res.status(200).json(response);

  } catch (error) {
    console.log('❌ [FATAL ERROR] Error in getBookingDetails:', error);
    res.status(500).json({ message: 'Failed to fetch details.' });
  }
};

module.exports = { getBookingDetails };