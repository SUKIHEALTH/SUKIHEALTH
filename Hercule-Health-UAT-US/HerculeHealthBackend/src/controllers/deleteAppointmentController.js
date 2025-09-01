

// const Appointment = require('../models/appointmentModel'); // Import the Appointment model
// const Consultant = require('../models/consultantModel'); // Import the Consultant model
// const Payment = require('../models/paymentModel');
// const RefundRequest = require('../models/refundRequestsModel');
// const Patient = require('../models/patientModel');
// const User = require('../models/userModel');
// const { sendEmail } = require('../config/emailService');
// const Notification = require('../models/notificationModel');
// const { cancelGoogleMeet } = require('../config/googleMeet');
// const { cancelTeamsMeet } = require('../config/teamsMeet');

// // Helper function to determine meeting type from URL
// const determineMeetingType = (appointmentLink) => {
//   try {
//     if (!appointmentLink) return null;
    
//     let url = '';
    
//     // Handle all possible data types
//     if (typeof appointmentLink === 'string') {
//       url = appointmentLink;
//     } else if (typeof appointmentLink === 'object' && appointmentLink !== null) {
//       url = appointmentLink.joinUrl || appointmentLink.url || appointmentLink.link || '';
//     } else {
//       return null;
//     }
    
//     // Ensure url is a string
//     url = String(url || '').toLowerCase();
    
//     if (url.indexOf('meet.google.com') !== -1) {
//       return 'googleMeet';
//     } else if (url.indexOf('teams.microsoft.com') !== -1 || url.indexOf('teams.live.com') !== -1) {
//       return 'teamsMeet';
//     }
    
//     return null;
//   } catch (error) {
//     console.error('Safe determineMeetingType error:', error);
//     return null;
//   }
// };

// // Helper function to cancel meeting link
// const cancelMeetingLink = async (appointmentLink) => {
//   const meetingOperationErrors = [];
  
//   try {
//     if (!appointmentLink) {
//       console.log('No appointment link to cancel');
//       return { success: true, errors: [] };
//     }

//     const meetingType = determineMeetingType(appointmentLink);
    
//     if (!meetingType) {
//       console.log('Could not determine meeting type for cancellation');
//       meetingOperationErrors.push('Could not determine meeting type');
//       return { success: false, errors: meetingOperationErrors };
//     }

//     console.log(`Attempting to cancel ${meetingType} meeting...`);

//     if (meetingType === 'googleMeet' && typeof cancelGoogleMeet === 'function') {
//       try {
//         await cancelGoogleMeet(appointmentLink);
//         console.log('Successfully cancelled Google Meet');
//         return { success: true, errors: [] };
//       } catch (error) {
//         console.warn('Failed to cancel Google Meet:', error);
//         meetingOperationErrors.push(`Failed to cancel Google Meet: ${error.message}`);
//       }
//     } else if (meetingType === 'teamsMeet' && typeof cancelTeamsMeet === 'function') {
//       try {
//         await cancelTeamsMeet(appointmentLink);
//         console.log('Successfully cancelled Teams meeting');
//         return { success: true, errors: [] };
//       } catch (error) {
//         console.warn('Failed to cancel Teams meeting:', error);
//         meetingOperationErrors.push(`Failed to cancel Teams meeting: ${error.message}`);
//       }
//     } else {
//       meetingOperationErrors.push(`No cancel function available for ${meetingType}`);
//     }

//   } catch (error) {
//     console.error('Error in cancelMeetingLink:', error);
//     meetingOperationErrors.push(`Meeting cancellation error: ${error.message}`);
//   }

//   return { success: false, errors: meetingOperationErrors };
// };

// // Helper function to update slot status (extracted from your existing code)
// const updateConsultantSlotStatus = async (consultantId, time, status) => {
//   try {
//     // Find the consultant by userId (Number)
//     const consultant = await Consultant.findOne({ userId: Number(consultantId) });
//     if (!consultant) {
//       console.log(`Consultant not found for ID: ${consultantId}`);
//       return false;
//     }

//     // Find the slot in the availableSlots array by matching the time
//     const slot = consultant.availableSlots.find(
//       (slot) => new Date(slot.time).getTime() === new Date(time).getTime()
//     );

//     if (!slot) {
//       console.log(`Slot not found for time: ${time}`);
//       return false;
//     }

//     // Update the slot's status
//     slot.status = status;

//     // Save the updated consultant document
//     await consultant.save();
    
//     console.log(`Slot status updated successfully for consultant ${consultantId} at ${time} to ${status}`);
//     return true;
//   } catch (error) {
//     console.error('Error updating consultant slot status:', error);
//     return false;
//   }
// };

// // Controller to cancel an appointment
// const cancelAppointment = async (req, res) => {
//   try {
//     const { appointmentId, userId, userType } = req.body;

//     if (!appointmentId) {
//       return res.status(400).json({ message: 'Appointment ID is required.' });
//     }
//     if (!userId || !userType) {
//       return res.status(400).json({ message: 'Refund initiator userId and userType are required.' });
//     }

//     const appointment = await Appointment.findOne({ appointmentId });
//     if (!appointment) {
//       return res.status(404).json({ message: 'Appointment not found.' });
//     }
//     if (appointment.status === 'cancelled') {
//       return res.status(400).json({ message: 'Appointment is already cancelled.' });
//     }

//     // Store appointment link before cancellation for meeting cancellation
//     const appointmentLink = appointment.appointmentLink;
    
//     // Cancel the meeting link if it exists
//     let meetingCancellationResult = { success: true, errors: [] };
//     if (appointmentLink) {
//       console.log('=== CANCELLING MEETING LINK ===');
//       console.log('Appointment link:', appointmentLink);
//       meetingCancellationResult = await cancelMeetingLink(appointmentLink);
      
//       if (meetingCancellationResult.success) {
//         console.log('Meeting cancelled successfully');
//       } else {
//         console.warn('Meeting cancellation failed:', meetingCancellationResult.errors);
//       }
//     }

//     // Cancel appointment in database
//     const updatedAppointment = await Appointment.findOneAndUpdate(
//       { appointmentId },
//       { 
//         status: 'cancelled', 
//         updatedAt: new Date(),
//         // Store meeting cancellation results for reference
//         meetingCancellationErrors: meetingCancellationResult.errors.length > 0 ? meetingCancellationResult.errors : undefined
//       },
//       { new: true }
//     );

//     if (!updatedAppointment) {
//       return res.status(500).json({ message: 'Failed to cancel appointment.' });
//     }

//     // Set slot to available
//     await updateConsultantSlotStatus(
//       appointment.consultantId,
//       appointment.appointmentDate,
//       'Available'
//     );

//     // Fetch payment details
//     const payment = await Payment.findOne({ appointmentId });
//     if (!payment) {
//       return res.status(404).json({ message: 'Payment details not found for this appointment.' });
//     }

//     // Fetch highest refundRequestId and increment
//     const highestRefundRequest = await RefundRequest.findOne().sort('-refundRequestId').exec();
//     const nextId = highestRefundRequest
//       ? parseInt(highestRefundRequest.refundRequestId) + 1
//       : 1;
//     const refundRequestId = nextId;

//     // Create refund request
//     const refundRequest = new RefundRequest({
//       refundRequestId,
//       paymentId: payment.paymentId,
//       appointmentId: appointment.appointmentId,
//       patientId: appointment.patientId,
//       refundStatus: 'initiated',
//       refundInitiatedBy: { userId, userType },
//       refundRequestDate: new Date(),
//       notes: `Refund requested upon appointment cancellation by ${userType}`
//     });

//     await refundRequest.save();

//     // Fetch consultant and patient details
//     const consultantDetails = await Consultant.findOne({ userId: appointment.consultantId },
//       'userId information.firstName information.lastName information.email');
//     const patientDetails = await Patient.findOne({ userId: appointment.patientId },
//       'userId information.firstName information.lastName information.email');

//     // Fetch admin details (access_type: 1)
//     const adminDetails = await User.find({ access_type: 1 });

//     // Fetch cancelling user details
//     const cancellingUser = await User.findOne({ userId });

//     const cancelDate = new Date().toLocaleDateString('en-GB', {
//       timeZone: 'Europe/Berlin',
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit'
//     });
    
//     // ✅ Format appointment date and time to CET timezone
//     const appointmentDateObj = new Date(appointment.appointmentDate);

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

//     // Create notifications for patient, consultant, and admin
//     const notificationMessage = `Appointment cancelled. ID: ${appointment.appointmentId}, Appointment Date: ${appointmentDate}, Appointment Slot: ${appointmentTimeWithZone} by ${userType}.`;
//     const adminIds = adminDetails.map(admin => admin.userId);
//     const userIds = [consultantDetails.userId, patientDetails.userId, ...adminIds];

//     const notification = new Notification({
//       notificationId: Date.now(),
//       userId: userIds,
//       type: 'Appointment Cancelled',
//       message: notificationMessage,
//       isRead: userIds.map(() => false),
//       relatedId: updatedAppointment._id,
//     });

//     await notification.save();

//     // Consultant Email
//     if (consultantDetails) {
//       const consultantEmailData = {
//         mail_type: 'consultant_booking_cancellation_mail',
//         name: `${consultantDetails.information.firstName} ${consultantDetails.information.lastName}`,
//         patientName: `${patientDetails.information.firstName} ${patientDetails.information.lastName}`,
//         appointmentId: appointment.appointmentId,
//         appointmentDate,
//         appointmentSlot: appointmentTimeWithZone,
//         cancelDate,
//         canceledBy: cancellingUser && userType !== 'admin' ? `${cancellingUser.firstName} ${cancellingUser.lastName}` : 'System',
//         canceledUserType: userType,
//         email: consultantDetails.information.email,
//         subject: 'Appointment Cancelled',
//         refundAmount: payment.amount,
//       };
//       await sendEmail(consultantEmailData);
//     }

//     // Patient Email
//     if (patientDetails) {
//       const patientEmailData = {
//         mail_type: 'patient_booking_cancellation_mail',
//         name: `${patientDetails.information.firstName} ${patientDetails.information.lastName}`,
//         appointmentId: appointment.appointmentId,
//         appointmentDate,
//         appointmentSlot: appointmentTimeWithZone,
//         cancelDate,
//         canceledBy: cancellingUser && userType !== 'admin' ? `${cancellingUser.firstName} ${cancellingUser.lastName}` : 'System',
//         canceledUserType: userType,
//         email: patientDetails.information.email,
//         subject: 'Your Appointment Has Been Cancelled',
//         refundAmount: payment.amount,
//       };
//       await sendEmail(patientEmailData);
//     }

//     // Admin Email
//     if (adminDetails) {
//       for (const admin of adminDetails) {
//         const adminEmailData = {
//           mail_type: 'admin_booking_cancellation_notification_mail',
//           appointmentId: appointment.appointmentId,
//           consultantName: `${consultantDetails.information.firstName} ${consultantDetails.information.lastName}`,
//           patientName: `${patientDetails.information.firstName} ${patientDetails.information.lastName}`,
//           appointmentDate,
//           appointmentSlot: appointmentTimeWithZone,
//           cancelDate,
//           canceledBy: cancellingUser ? `${cancellingUser.firstName} ${cancellingUser.lastName}` : 'System',
//           canceledUserType: userType,
//           refundAmount: payment.amount,
//           refundRequestId,
//           refundStatus: 'pending',
//           subject: 'Appointment Cancelled',
//           email: admin.email,
//           name: `${admin.firstName} ${admin.lastName}`,
//         };
//         await sendEmail(adminEmailData);
//       }
//     }

//     // Prepare response with meeting cancellation status
//     const response = {
//       message: 'Appointment cancelled successfully, slot made available, and refund request created.',
//       appointment: updatedAppointment,
//       refundRequest,
//       meetingCancellation: {
//         attempted: !!appointmentLink,
//         success: meetingCancellationResult.success,
//         errors: meetingCancellationResult.errors
//       }
//     };

//     // Add warning if meeting cancellation failed
//     if (appointmentLink && !meetingCancellationResult.success) {
//       response.warnings = {
//         message: 'Appointment cancelled but meeting link cancellation failed',
//         details: meetingCancellationResult.errors
//       };
//     }

//     res.status(200).json(response);

//   } catch (error) {
//     console.error('Error cancelling appointment:', error);
//     res.status(500).json({ message: 'Server error while cancelling appointment.' });
//   }
// };

// // Alternative method: Delete appointment completely
// const deleteAppointment = async (req, res) => {
//   try {
//     const { appointmentId } = req.body;

//     // Validate if appointmentId is provided
//     if (!appointmentId) {
//       return res.status(400).json({ message: 'Appointment ID is required.' });
//     }

//     // Find the appointment before deleting to get consultant and appointment details
//     const appointment = await Appointment.findOne({ appointmentId });

//     if (!appointment) {
//       return res.status(404).json({ message: 'Appointment not found.' });
//     }

//     // Store appointment details before deletion
//     const consultantId = appointment.consultantId;
//     const appointmentDate = appointment.appointmentDate;
//     const appointmentLink = appointment.appointmentLink;

//     // Cancel the meeting link if it exists
//     let meetingCancellationResult = { success: true, errors: [] };
//     if (appointmentLink) {
//       console.log('=== CANCELLING MEETING LINK BEFORE DELETION ===');
//       console.log('Appointment link:', appointmentLink);
//       meetingCancellationResult = await cancelMeetingLink(appointmentLink);
      
//       if (meetingCancellationResult.success) {
//         console.log('Meeting cancelled successfully before deletion');
//       } else {
//         console.warn('Meeting cancellation failed before deletion:', meetingCancellationResult.errors);
//       }
//     }

//     // Delete the appointment
//     const deletedAppointment = await Appointment.findOneAndDelete({ appointmentId });

//     // Update the consultant's slot status from 'booked' to 'available'
//     await updateConsultantSlotStatus(consultantId, appointmentDate, 'Available');

//     // Prepare response
//     const response = {
//       message: 'Appointment deleted successfully and slot made available.',
//       appointmentId: appointmentId,
//       meetingCancellation: {
//         attempted: !!appointmentLink,
//         success: meetingCancellationResult.success,
//         errors: meetingCancellationResult.errors
//       }
//     };

//     // Add warning if meeting cancellation failed
//     if (appointmentLink && !meetingCancellationResult.success) {
//       response.warnings = {
//         message: 'Appointment deleted but meeting link cancellation failed',
//         details: meetingCancellationResult.errors
//       };
//     }

//     res.status(200).json(response);

//   } catch (error) {
//     console.error('Error deleting appointment:', error);
//     res.status(500).json({ message: 'Server error while deleting appointment.' });
//   }
// };

// module.exports = { 
//   cancelAppointment,
//   deleteAppointment,
//   updateConsultantSlotStatus // Export the helper function if needed elsewhere
// };

const Appointment = require('../models/appointmentModel'); // Import the Appointment model
const Consultant = require('../models/consultantModel'); // Import the Consultant model
const Payment = require('../models/paymentModel');
const RefundRequest = require('../models/refundRequestsModel');
const Patient = require('../models/patientModel');
const User = require('../models/userModel');
const { sendEmail } = require('../config/emailService');
const Notification = require('../models/notificationModel');
const { cancelGoogleMeet } = require('../config/googleMeet');
const { cancelTeamsMeet } = require('../config/teamsMeet');

// Helper function to determine meeting type from URL
const determineMeetingType = (appointmentLink) => {
  try {
    if (!appointmentLink) return null;
    
    let url = '';
    
    // Handle all possible data types
    if (typeof appointmentLink === 'string') {
      url = appointmentLink;
    } else if (typeof appointmentLink === 'object' && appointmentLink !== null) {
      url = appointmentLink.joinUrl || appointmentLink.url || appointmentLink.link || '';
    } else {
      return null;
    }
    
    // Ensure url is a string
    url = String(url || '').toLowerCase();
    
    if (url.indexOf('meet.google.com') !== -1) {
      return 'googleMeet';
    } else if (url.indexOf('teams.microsoft.com') !== -1 || url.indexOf('teams.live.com') !== -1) {
      return 'teamsMeet';
    }
    
    return null;
  } catch (error) {
    console.error('Safe determineMeetingType error:', error);
    return null;
  }
};

// Helper function to cancel meeting link
const cancelMeetingLink = async (appointmentLink) => {
  const meetingOperationErrors = [];
  
  try {
    if (!appointmentLink) {
      console.log('No appointment link to cancel');
      return { success: true, errors: [] };
    }

    const meetingType = determineMeetingType(appointmentLink);
    
    if (!meetingType) {
      console.log('Could not determine meeting type for cancellation');
      meetingOperationErrors.push('Could not determine meeting type');
      return { success: false, errors: meetingOperationErrors };
    }

    console.log(`Attempting to cancel ${meetingType} meeting...`);

    if (meetingType === 'googleMeet' && typeof cancelGoogleMeet === 'function') {
      try {
        await cancelGoogleMeet(appointmentLink);
        console.log('Successfully cancelled Google Meet');
        return { success: true, errors: [] };
      } catch (error) {
        console.warn('Failed to cancel Google Meet:', error);
        meetingOperationErrors.push(`Failed to cancel Google Meet: ${error.message}`);
      }
    } else if (meetingType === 'teamsMeet' && typeof cancelTeamsMeet === 'function') {
      try {
        await cancelTeamsMeet(appointmentLink);
        console.log('Successfully cancelled Teams meeting');
        return { success: true, errors: [] };
      } catch (error) {
        console.warn('Failed to cancel Teams meeting:', error);
        meetingOperationErrors.push(`Failed to cancel Teams meeting: ${error.message}`);
      }
    } else {
      meetingOperationErrors.push(`No cancel function available for ${meetingType}`);
    }

  } catch (error) {
    console.error('Error in cancelMeetingLink:', error);
    meetingOperationErrors.push(`Meeting cancellation error: ${error.message}`);
  }

  return { success: false, errors: meetingOperationErrors };
};

// Helper function to update slot status (for patient/admin cancellations)
const updateConsultantSlotStatus = async (consultantId, time, status) => {
  try {
    // Find the consultant by userId (Number)
    const consultant = await Consultant.findOne({ userId: Number(consultantId) });
    if (!consultant) {
      console.log(`Consultant not found for ID: ${consultantId}`);
      return false;
    }

    // Find the slot in the availableSlots array by matching the time
    const slot = consultant.availableSlots.find(
      (slot) => new Date(slot.time).getTime() === new Date(time).getTime()
    );

    if (!slot) {
      console.log(`Slot not found for time: ${time}`);
      return false;
    }

    // Update the slot's status
    slot.status = status;

    // Save the updated consultant document
    await consultant.save();
    
    console.log(`Slot status updated successfully for consultant ${consultantId} at ${time} to ${status}`);
    return true;
  } catch (error) {
    console.error('Error updating consultant slot status:', error);
    return false;
  }
};

// Helper function to delete slot completely (for doctor cancellations)
const deleteConsultantSlot = async (consultantId, time) => {
  try {
    // Find the consultant by userId (Number)
    const consultant = await Consultant.findOne({ userId: Number(consultantId) });
    if (!consultant) {
      console.log(`Consultant not found for ID: ${consultantId}`);
      return false;
    }

    // Find the index of the slot in the availableSlots array by matching the time
    const slotIndex = consultant.availableSlots.findIndex(
      (slot) => new Date(slot.time).getTime() === new Date(time).getTime()
    );

    if (slotIndex === -1) {
      console.log(`Slot not found for time: ${time}`);
      return false;
    }

    // Remove the slot from the array
    consultant.availableSlots.splice(slotIndex, 1);

    // Save the updated consultant document
    await consultant.save();
    
    console.log(`Slot deleted successfully for consultant ${consultantId} at ${time}`);
    return true;
  } catch (error) {
    console.error('Error deleting consultant slot:', error);
    return false;
  }
};

// Controller to cancel an appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId, userId, userType } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ message: 'Appointment ID is required.' });
    }
    if (!userId || !userType) {
      return res.status(400).json({ message: 'Refund initiator userId and userType are required.' });
    }

    const appointment = await Appointment.findOne({ appointmentId });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }
    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Appointment is already cancelled.' });
    }

    // Store appointment link before cancellation for meeting cancellation
    const appointmentLink = appointment.appointmentLink;
    
    // Cancel the meeting link if it exists
    let meetingCancellationResult = { success: true, errors: [] };
    if (appointmentLink) {
      console.log('=== CANCELLING MEETING LINK ===');
      console.log('Appointment link:', appointmentLink);
      meetingCancellationResult = await cancelMeetingLink(appointmentLink);
      
      if (meetingCancellationResult.success) {
        console.log('Meeting cancelled successfully');
      } else {
        console.warn('Meeting cancellation failed:', meetingCancellationResult.errors);
      }
    }

    // Cancel appointment in database
    const updatedAppointment = await Appointment.findOneAndUpdate(
      { appointmentId },
      { 
        status: 'cancelled', 
        updatedAt: new Date(),
        // Store meeting cancellation results for reference
        meetingCancellationErrors: meetingCancellationResult.errors.length > 0 ? meetingCancellationResult.errors : undefined
      },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(500).json({ message: 'Failed to cancel appointment.' });
    }

    // Handle slot based on who cancelled
    let slotHandlingResult = false;
    let slotAction = '';

    if (userType === 'consultant' || userType === 'doctor') {
      // If doctor/consultant cancels, delete the slot completely
      slotHandlingResult = await deleteConsultantSlot(
        appointment.consultantId,
        appointment.appointmentDate
      );
      slotAction = 'deleted';
      console.log('Doctor/Consultant cancelled - slot deleted');
    } else {
      // If patient or admin cancels, make slot available
      slotHandlingResult = await updateConsultantSlotStatus(
        appointment.consultantId,
        appointment.appointmentDate,
        'Available'
      );
      slotAction = 'made available';
      console.log('Patient/Admin cancelled - slot made available');
    }

    // Fetch payment details
    const payment = await Payment.findOne({ appointmentId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment details not found for this appointment.' });
    }

    // Fetch highest refundRequestId and increment
    const highestRefundRequest = await RefundRequest.findOne().sort('-refundRequestId').exec();
    const nextId = highestRefundRequest
      ? parseInt(highestRefundRequest.refundRequestId) + 1
      : 1;
    const refundRequestId = nextId;

    // Create refund request
    const refundRequest = new RefundRequest({
      refundRequestId,
      paymentId: payment.paymentId,
      appointmentId: appointment.appointmentId,
      patientId: appointment.patientId,
      refundStatus: 'initiated',
      refundInitiatedBy: { userId, userType },
      refundRequestDate: new Date(),
      notes: `Refund requested upon appointment cancellation by ${userType}. Slot ${slotAction}.`
    });

    await refundRequest.save();

    // Fetch consultant and patient details
    const consultantDetails = await Consultant.findOne({ userId: appointment.consultantId },
      'userId information.firstName information.lastName information.email');
    const patientDetails = await Patient.findOne({ userId: appointment.patientId },
      'userId information.firstName information.lastName information.email');

    // Fetch admin details (access_type: 1)
    const adminDetails = await User.find({ access_type: 1 });

    // Fetch cancelling user details
    const cancellingUser = await User.findOne({ userId });

    const cancelDate = new Date().toLocaleDateString('en-GB', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    // ✅ Format appointment date and time to CET timezone
    const appointmentDateObj = new Date(appointment.appointmentDate);

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
    }).split(' ').pop(); // 'CET' or 'CEST'

    const appointmentTimeWithZone = `${appointmentTime} ${timeZoneName}`; // e.g. "02:30 PM CET"

    // Create notifications for patient, consultant, and admin
    const notificationMessage = `Appointment cancelled. ID: ${appointment.appointmentId}, Appointment Date: ${appointmentDate}, Appointment Slot: ${appointmentTimeWithZone} by ${userType}. Slot ${slotAction}.`;
    const adminIds = adminDetails.map(admin => admin.userId);
    const userIds = [consultantDetails.userId, patientDetails.userId, ...adminIds];

    const notification = new Notification({
      notificationId: Date.now(),
      userId: userIds,
      type: 'Appointment Cancelled',
      message: notificationMessage,
      isRead: userIds.map(() => false),
      relatedId: updatedAppointment._id,
    });

    await notification.save();

    // Consultant Email
    if (consultantDetails) {
      const consultantEmailData = {
        mail_type: 'consultant_booking_cancellation_mail',
        name: `${consultantDetails.information.firstName} ${consultantDetails.information.lastName}`,
        patientName: `${patientDetails.information.firstName} ${patientDetails.information.lastName}`,
        appointmentId: appointment.appointmentId,
        appointmentDate,
        appointmentSlot: appointmentTimeWithZone,
        cancelDate,
        canceledBy: cancellingUser && userType !== 'admin' ? `${cancellingUser.firstName} ${cancellingUser.lastName}` : 'System',
        canceledUserType: userType,
        email: consultantDetails.information.email,
        subject: 'Appointment Cancelled',
        refundAmount: payment.amount,
      };
      await sendEmail(consultantEmailData);
    }

    // Patient Email
    if (patientDetails) {
      const patientEmailData = {
        mail_type: 'patient_booking_cancellation_mail',
        name: `${patientDetails.information.firstName} ${patientDetails.information.lastName}`,
        appointmentId: appointment.appointmentId,
        appointmentDate,
        appointmentSlot: appointmentTimeWithZone,
        cancelDate,
        canceledBy: cancellingUser && userType !== 'admin' ? `${cancellingUser.firstName} ${cancellingUser.lastName}` : 'System',
        canceledUserType: userType,
        email: patientDetails.information.email,
        subject: 'Your Appointment Has Been Cancelled',
        refundAmount: payment.amount,
      };
      await sendEmail(patientEmailData);
    }

    // Admin Email
    if (adminDetails) {
      for (const admin of adminDetails) {
        const adminEmailData = {
          mail_type: 'admin_booking_cancellation_notification_mail',
          appointmentId: appointment.appointmentId,
          consultantName: `${consultantDetails.information.firstName} ${consultantDetails.information.lastName}`,
          patientName: `${patientDetails.information.firstName} ${patientDetails.information.lastName}`,
          appointmentDate,
          appointmentSlot: appointmentTimeWithZone,
          cancelDate,
          canceledBy: cancellingUser ? `${cancellingUser.firstName} ${cancellingUser.lastName}` : 'System',
          canceledUserType: userType,
          refundAmount: payment.amount,
          refundRequestId,
          refundStatus: 'pending',
          subject: 'Appointment Cancelled',
          email: admin.email,
          name: `${admin.firstName} ${admin.lastName}`,
        };
        await sendEmail(adminEmailData);
      }
    }

    // Prepare response with meeting cancellation status and slot handling info
    const response = {
      message: `Appointment cancelled successfully, slot ${slotAction}, and refund request created.`,
      appointment: updatedAppointment,
      refundRequest,
      slotHandling: {
        action: slotAction,
        success: slotHandlingResult,
        cancelledBy: userType
      },
      meetingCancellation: {
        attempted: !!appointmentLink,
        success: meetingCancellationResult.success,
        errors: meetingCancellationResult.errors
      }
    };

    // Add warning if meeting cancellation failed
    if (appointmentLink && !meetingCancellationResult.success) {
      response.warnings = {
        message: 'Appointment cancelled but meeting link cancellation failed',
        details: meetingCancellationResult.errors
      };
    }

    // Add warning if slot handling failed
    if (!slotHandlingResult) {
      if (!response.warnings) response.warnings = {};
      response.warnings.slotHandling = `Failed to ${slotAction.replace('made ', 'make ')} the slot`;
    }

    res.status(200).json(response);

  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Server error while cancelling appointment.' });
  }
};

// Alternative method: Delete appointment completely
const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // Validate if appointmentId is provided
    if (!appointmentId) {
      return res.status(400).json({ message: 'Appointment ID is required.' });
    }

    // Find the appointment before deleting to get consultant and appointment details
    const appointment = await Appointment.findOne({ appointmentId });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    // Store appointment details before deletion
    const consultantId = appointment.consultantId;
    const appointmentDate = appointment.appointmentDate;
    const appointmentLink = appointment.appointmentLink;

    // Cancel the meeting link if it exists
    let meetingCancellationResult = { success: true, errors: [] };
    if (appointmentLink) {
      console.log('=== CANCELLING MEETING LINK BEFORE DELETION ===');
      console.log('Appointment link:', appointmentLink);
      meetingCancellationResult = await cancelMeetingLink(appointmentLink);
      
      if (meetingCancellationResult.success) {
        console.log('Meeting cancelled successfully before deletion');
      } else {
        console.warn('Meeting cancellation failed before deletion:', meetingCancellationResult.errors);
      }
    }

    // Delete the appointment
    const deletedAppointment = await Appointment.findOneAndDelete({ appointmentId });

    // Update the consultant's slot status from 'booked' to 'available'
    await updateConsultantSlotStatus(consultantId, appointmentDate, 'Available');

    // Prepare response
    const response = {
      message: 'Appointment deleted successfully and slot made available.',
      appointmentId: appointmentId,
      meetingCancellation: {
        attempted: !!appointmentLink,
        success: meetingCancellationResult.success,
        errors: meetingCancellationResult.errors
      }
    };

    // Add warning if meeting cancellation failed
    if (appointmentLink && !meetingCancellationResult.success) {
      response.warnings = {
        message: 'Appointment deleted but meeting link cancellation failed',
        details: meetingCancellationResult.errors
      };
    }

    res.status(200).json(response);

  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Server error while deleting appointment.' });
  }
};

module.exports = { 
  cancelAppointment,
  deleteAppointment,
  updateConsultantSlotStatus, // Export the helper function if needed elsewhere
  deleteConsultantSlot // Export the new helper function
};