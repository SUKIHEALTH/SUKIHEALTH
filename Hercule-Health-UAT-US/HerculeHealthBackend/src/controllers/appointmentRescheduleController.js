const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const { createGoogleMeet, cancelGoogleMeet } = require('../config/googleMeet'); 
const { createTeamsMeet, cancelTeamsMeet } = require('../config/teamsMeet'); 
const Notification = require('../models/notificationModel');
const Appointment = require('../models/appointmentModel');
const Consultant = require('../models/consultantModel');
const { sendEmail } = require('../config/emailService');
const User = require('../models/userModel');

// Helper function to determine meeting type from URL
const determineMeetingType = (appointmentLink) => {
  if (!appointmentLink) return null;
  
  if (appointmentLink.includes('meet.google.com')) {
    return 'googleMeet';
  } else if (appointmentLink.includes('teams.microsoft.com') || appointmentLink.includes('teams.live.com')) {
    return 'teamsMeet';
  }
  
  return null; // Unknown meeting type
};

// Controller to reschedule an appointment
const rescheduleAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  const { 
    newDate, 
    newTime, 
    timeZone, 
    patientEmail, 
    consultantEmail, 
    appointmentType 
  } = req.body;

  try {
    // Validate required fields
    if (!appointmentId || !newDate || !newTime || !timeZone) {
      return res.status(400).json({ 
        message: 'Missing required fields: appointmentId, newDate, newTime, timeZone' 
      });
    }

    // Validate timezone
    const isValidTimeZone = (zone) => {
      try {
        return !!DateTime.now().setZone(zone).isValid;
      } catch {
        return false;
      }
    };

    if (!isValidTimeZone(timeZone)) {
      return res.status(400).json({ message: 'Invalid timeZone format.' });
    }

    // Validate time format
    const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
    const match = newTime.match(timeRegex);

    if (!match) {
      return res.status(400).json({ message: 'Invalid time format. Use hh:mm AM/PM.' });
    }

    // Parse time
    const [_, hours, minutes, period] = match;
    let parsedHours = parseInt(hours, 10);
    if (period.toUpperCase() === 'PM' && parsedHours !== 12) {
      parsedHours += 12;
    } else if (period.toUpperCase() === 'AM' && parsedHours === 12) {
      parsedHours = 0;
    }

    // Create new appointment date/time
    const newDateTime = DateTime.fromISO(newDate, { zone: timeZone })
      .set({ hour: parsedHours, minute: parseInt(minutes, 10), second: 0, millisecond: 0 })
      .toJSDate();

    if (newDateTime < new Date()) {
      return res.status(400).json({ 
        message: 'New appointment date and time must be in the future.' 
      });
    }

    // Find the existing appointment
    const existingAppointment = await mongoose.connection.db
      .collection('appointments')
      .findOne({ appointmentId: parseInt(appointmentId) });

    if (!existingAppointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    const consultantId = existingAppointment.consultantId;
    const patientId = existingAppointment.patientId;
    const oldDateTime = existingAppointment.appointmentDate;
    const oldAppointmentLink = existingAppointment.appointmentLink;

    // Check if new time slot is available for the consultant
    // UPDATED: Exclude cancelled appointments from conflict check
    const conflictingAppointment = await Appointment.aggregate([
      {
        $match: {
          consultantId: consultantId,
          appointmentDate: newDateTime,
          appointmentId: { $ne: parseInt(appointmentId) }, // Exclude current appointment
          status: { $ne: 'cancelled' } // ADDED: Exclude cancelled appointments
        },
      },
      {
        $lookup: {
          from: 'payments',
          localField: 'appointmentId',
          foreignField: 'appointmentId',
          as: 'paymentDetails',
        },
      },
      {
        $match: {
          'paymentDetails.status': 'paid',
        },
      },
    ]);

    if (conflictingAppointment.length > 0) {
      return res.status(400).json({
        message: 'The new time slot is already booked. Please select a different time.',
      });
    }

    // Update consultant slot statuses
    await updateConsultantSlotStatuses(consultantId, oldDateTime, newDateTime);

    // Handle old meeting link cancellation and new meeting creation
    let newAppointmentLink = oldAppointmentLink; // Default to keep existing link
    let meetingOperationErrors = [];

    try {
      // Step 1: Cancel old meeting if it exists
      if (oldAppointmentLink) {
        const oldMeetingType = determineMeetingType(oldAppointmentLink);
        
        if (oldMeetingType) {
          try {
            if (oldMeetingType === 'googleMeet' && typeof cancelGoogleMeet === 'function') {
              await cancelGoogleMeet(oldAppointmentLink);
              console.log('Successfully cancelled old Google Meet');
            } else if (oldMeetingType === 'teamsMeet' && typeof cancelTeamsMeet === 'function') {
              await cancelTeamsMeet(oldAppointmentLink);
              console.log('Successfully cancelled old Teams meeting');
            }
          } catch (cancelError) {
            console.warn(`Failed to cancel old ${oldMeetingType} meeting:`, cancelError);
            meetingOperationErrors.push(`Failed to cancel old meeting: ${cancelError.message}`);
          }
        } else {
          console.warn('Could not determine meeting type from old appointment link');
          meetingOperationErrors.push('Could not determine meeting type from old appointment link');
        }
      }

      // Step 2: Create new meeting link
      if (appointmentType && patientEmail && consultantEmail) {
        try {
          if (appointmentType === 'googleMeet') {
            newAppointmentLink = await createGoogleMeet(patientEmail, consultantEmail, newDate, newTime, timeZone);
            console.log('Successfully created new Google Meet link');
          } else if (appointmentType === 'teamsMeet') {
            const teamsResult = await createTeamsMeet(patientEmail, consultantEmail, newDate, newTime, timeZone);
            // Handle both old format (just URL) and new format (object with joinUrl and meetingId)
            if (typeof teamsResult === 'string') {
              newAppointmentLink = teamsResult;
            } else {
              newAppointmentLink = teamsResult.joinUrl;
              // Optionally store the meetingId for future use
              console.log('Teams meeting ID for future reference:', teamsResult.meetingId);
            }
            console.log('Successfully created new Teams meeting link');
          }
        } catch (createError) {
          console.warn('Failed to create new meeting link:', createError);
          meetingOperationErrors.push(`Failed to create new meeting: ${createError.message}`);
          // Keep the old link if new creation fails
          newAppointmentLink = oldAppointmentLink;
        }
      }

    } catch (meetingError) {
      console.warn('Meeting operation error:', meetingError);
      meetingOperationErrors.push(`Meeting operation error: ${meetingError.message}`);
    }

    // Update the appointment
    const updateResult = await mongoose.connection.db
      .collection('appointments')
      .updateOne(
        { appointmentId: parseInt(appointmentId) },
        {
          $set: {
            appointmentDate: newDateTime,
            status: 'rescheduled',
            appointmentLink: newAppointmentLink,
            updatedAt: new Date(),
            rescheduledFrom: oldDateTime, // Keep track of original date
            rescheduledAt: new Date(),
            // Store meeting operation results for debugging
            meetingOperationErrors: meetingOperationErrors.length > 0 ? meetingOperationErrors : undefined
          }
        }
      );

    if (updateResult.matchedCount === 0) {
      throw new Error('Failed to update appointment.');
    }

    // Get the updated appointment
    const updatedAppointment = await mongoose.connection.db
      .collection('appointments')
      .findOne({ appointmentId: parseInt(appointmentId) });

    // Format time for notification
    const timeSlot = DateTime.fromJSDate(updatedAppointment.appointmentDate)
      .setZone(timeZone)
      .toFormat('h:mm a');
    
    const formattedDate = DateTime.fromJSDate(updatedAppointment.appointmentDate)
      .setZone(timeZone)
      .toFormat('yyyy-MM-dd');

    // Fetch patient and consultant details
    const patientDetails = await mongoose.connection.db
      .collection('patients')
      .findOne({ userId: patientId });

    const consultantDetails = await mongoose.connection.db
      .collection('consultants')
      .findOne({ userId: consultantId });

    const adminDetails = await User.find({ access_type: 1 }); 

    // ✅ Format appointment date and time to CET timezone
    const appointmentDateObj = new Date(newDateTime);

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

    // ✅ Format OLD appointment date and time to CET timezone
    const oldappointmentDateObj = new Date(oldDateTime);

    // Format date in CET
    const oldappointmentDate = oldappointmentDateObj.toLocaleDateString('en-GB', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    // Format time in CET with AM/PM
    const oldappointmentTime = oldappointmentDateObj.toLocaleTimeString('en-GB', {
      timeZone: 'Europe/Berlin',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Add time zone label (CET/CEST based on date)
    const oldtimeZoneName = oldappointmentDateObj.toLocaleDateString('en-GB', {
      timeZone: 'Europe/Berlin',
      timeZoneName: 'short'
    }).split(' ').pop(); // 'CET' or 'CEST'

    const oldappointmentTimeWithZone = `${oldappointmentTime} ${oldtimeZoneName}`; // e.g. "02:30 PM CET"

    // Create notifications for patient, consultant, and admin
    const notificationMessage = `Appointment rescheduled. ID: ${updatedAppointment.appointmentId}, New Date: ${appointmentDate}, New Time: ${appointmentTimeWithZone}.`;
    const userIds = [existingAppointment.patientId, consultantId, 1]; // Assuming `1` is the admin ID

    const notification = new Notification({
      notificationId: Date.now(),
      userId: userIds,
      type: 'Appointment Rescheduled',
      message: notificationMessage,
      isRead: userIds.map(() => false),
      relatedId: updatedAppointment._id,
    });

    await notification.save();

    // Send Email to Consultant
    if (consultantDetails) {
      const consultantEmailData = {
        mail_type: 'consultant_appointment_rescheduled_mail',
        name: `${consultantDetails.information.firstName} ${consultantDetails.information.lastName}`,
        patientName: `${patientDetails.information.firstName} ${patientDetails.information.lastName}`,
        appointmentId: updatedAppointment.appointmentId,
        appointmentDate: appointmentDate,
        appointmentSlot: appointmentTimeWithZone,
        oldAppointmentDate: oldappointmentDate,
        oldAppointmentTime: oldappointmentTimeWithZone,
        email: consultantDetails.information.email,
        subject: 'Appointment Rescheduled'
      };
      await sendEmail(consultantEmailData);
    }

    // Send Email to Patient
    if (patientDetails) {
      const patientEmailData = {
        mail_type: 'patient_appointment_rescheduled_mail',
        name: `${patientDetails.information.firstName} ${patientDetails.information.lastName}`,
        consultantName: `${consultantDetails.information.firstName} ${consultantDetails.information.lastName}`,
        appointmentId: updatedAppointment.appointmentId,
        appointmentDate: appointmentDate,
        appointmentSlot: appointmentTimeWithZone,
        oldAppointmentDate: oldappointmentDate,
        oldAppointmentTime: oldappointmentTimeWithZone,
        email: patientDetails.information.email,
        subject: 'Your Appointment Has Been Rescheduled'
      };
      await sendEmail(patientEmailData);
    }

    // Admin Email
    if (adminDetails) {
      for (const admin of adminDetails) {
        const adminEmailData = {
          mail_type: 'admin_appointment_rescheduled_mail',
          consultantName: `${consultantDetails.information.firstName} ${consultantDetails.information.lastName}`,
          patientName: `${patientDetails.information.firstName} ${patientDetails.information.lastName}`,
          appointmentId: updatedAppointment.appointmentId,
          appointmentDate: appointmentDate,
          appointmentSlot: appointmentTimeWithZone,
          oldAppointmentDate: oldappointmentDate,
          oldAppointmentTime: oldappointmentTimeWithZone,
          subject: 'Appointment Rescheduled',
          email: admin.email,
          name: `${admin.firstName} ${admin.lastName}`,
        };
        await sendEmail(adminEmailData);
      }
    }

    // Prepare response
    const response = {
      message: 'Appointment rescheduled successfully.',
      data: {
        ...updatedAppointment,
        timeSlot,
        formattedDate,
      },
    };

    // Add warning if there were meeting operation errors
    if (meetingOperationErrors.length > 0) {
      response.warnings = {
        message: 'Appointment rescheduled but some meeting operations failed',
        details: meetingOperationErrors
      };
    }

    res.status(200).json(response);

  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    res.status(500).json({ error: 'Failed to reschedule appointment.' });
  }
};

// Helper function to update consultant slot statuses
const updateConsultantSlotStatuses = async (consultantId, oldDateTime, newDateTime) => {
  try {
    const consultant = await Consultant.findOne({ userId: Number(consultantId) });
    
    if (!consultant) {
      console.warn(`Consultant with userId ${consultantId} not found`);
      return;
    }

    // Find and update the old slot status to "Available"
    const oldSlot = consultant.availableSlots.find(
      (slot) => new Date(slot.time).getTime() === new Date(oldDateTime).getTime()
    );

    if (oldSlot) {
      oldSlot.status = 'Available';
      console.log(`Updated old slot status to Available for time: ${oldDateTime}`);
    } else {
      console.warn(`Old slot not found for time: ${oldDateTime}`);
    }

    // Find and update the new slot status to "Booked"
    const newSlot = consultant.availableSlots.find(
      (slot) => new Date(slot.time).getTime() === new Date(newDateTime).getTime()
    );

    if (newSlot) {
      newSlot.status = 'Booked';
      console.log(`Updated new slot status to Booked for time: ${newDateTime}`);
    } else {
      console.warn(`New slot not found for time: ${newDateTime}`);
    }

    // Save the updated consultant document
    await consultant.save();
    console.log('Consultant slot statuses updated successfully');

  } catch (error) {
    console.error('Error updating consultant slot statuses:', error);
    throw error;
  }
};

// Individual slot status update function (existing functionality)
const updateSlotStatus = async (req, res) => {
  const consultantId = req.params.consultantId;
  const { time, status } = req.body;

  console.log('Consultant ID:', consultantId);
  console.log('Time:', time);
  console.log('Status:', status);

  // Validate inputs
  if (!consultantId) {
    return res.status(400).json({ message: 'Consultant ID is required' });
  }
  if (!time || !status) {
    return res.status(400).json({ message: 'Time and status are required' });
  }

  try {
    // Find the consultant by userId (Number)
    const consultant = await Consultant.findOne({ userId: Number(consultantId) });
    if (!consultant) {
      return res.status(404).json({ message: 'Consultant not found' });
    }

    // Find the slot in the availableSlots array by matching the time
    const slot = consultant.availableSlots.find(
      (slot) => new Date(slot.time).getTime() === new Date(time).getTime()
    );

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found for the given time' });
    }

    // Update the slot's status
    slot.status = status;

    // Save the updated consultant document
    await consultant.save();

    // Send success response with the updated slot
    res.status(200).json({
      message: 'Slot status updated successfully',
      updatedSlot: slot,
    });
  } catch (error) {
    console.error('Error updating slot status:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { 
  rescheduleAppointment, 
  updateSlotStatus 
};