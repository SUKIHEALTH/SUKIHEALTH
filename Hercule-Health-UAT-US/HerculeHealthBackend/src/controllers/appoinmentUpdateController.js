const mongoose = require('mongoose');
const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
const { DateTime } = require('luxon'); // Install with `npm install luxon`

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Update TOKEN_PATH to resolve correctly based on the project structure
const TOKEN_PATH = path.resolve(__dirname, '../config/token.json');

// Authorization function for Google APIs
async function authorize() {
  try {
    const credentials = await fs.readFile(TOKEN_PATH, 'utf-8'); // Ensure the file is read as a string
    const oauth2Client = google.auth.fromJSON(JSON.parse(credentials)); // Parse the credentials
    oauth2Client.scopes = SCOPES; // Set the required scopes
    return oauth2Client;
  } catch (error) {
    console.error('Error reading token.json:', error.message);
    throw new Error('Failed to authorize Google API');
  }
}

// Function to create Google Meet link
async function createMeet(patientEmail, consultantEmail, date, time, timeZone) {
  try {
    const auth = await authorize(); // Authorize using token.json
    const calendar = google.calendar({ version: 'v3', auth });

    // Validate the provided time format
    const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
    const match = time.match(timeRegex);

    if (!match) {
      throw new Error('Invalid time format. Use hh:mm AM/PM.');
    }

    const [_, hours, minutes, period] = match;

    // Convert time to 24-hour format
    let parsedHours = parseInt(hours, 10);
    if (period.toUpperCase() === 'PM' && parsedHours !== 12) {
      parsedHours += 12;
    } else if (period.toUpperCase() === 'AM' && parsedHours === 12) {
      parsedHours = 0;
    }

    // Combine date and time into ISO 8601 format
    const startDateTime = new Date(`${date}T${String(parsedHours).padStart(2, '0')}:${minutes}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000); // Assuming a 30-minute duration

    // Event data including Google Meet
    const event = {
      summary: 'Meeting via Google Meet',
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone,
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone,
      },
      attendees: [
        { email: patientEmail },
        { email: consultantEmail },
      ],
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
      guestsCanInviteOthers: false,
      guestsCanModify: false,
      guestsCanSeeOtherGuests: true,
    };

    // Create event with Google Meet
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });

    // Return the Meet link
    return response.data.conferenceData.entryPoints[0].uri;
  } catch (error) {
    console.error('Error creating Meet:', error.message);
    throw new Error('Failed to create Google Meet');
  }
}

// Controller to create an appointment
const updateAppointment = async (req, res) => {
    
    const {appointmentId} = req.params;
    const { date, time, status, patientEmail, consultantEmail, timeZone } = req.body;
  
    try {
      // Validate required fields
      if (!appointmentId || !status) {
        return res.status(400).json({ message: 'Missing required fields.' });
      }
  
      // Fetch the existing appointment
      const existingAppointment = await mongoose.connection.db
        .collection('appointments')
        .findOne({ appointmentId: parseInt(appointmentId) });
  
      if (!existingAppointment) {
        return res.status(404).json({ message: 'Appointment not found.' });
      }
  
      // Update only the status if other fields are missing
      if (!(patientEmail && consultantEmail && date && time && timeZone)) {
        const result = await mongoose.connection.db
          .collection('appointments')
          .updateOne(
            { appointmentId: parseInt(appointmentId) },
            { $set: { status, updatedAt: new Date() } }
          );
  
        if (result.matchedCount === 0) {
          throw new Error('Failed to update appointment status.');
        }
  
        return res.status(200).json({ message: 'Appointment status updated successfully.', status });
      }
  
      // Proceed to update other fields if all required fields are present
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
  
      const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
      const match = time.match(timeRegex);
  
      if (!match) {
        return res.status(400).json({ message: 'Invalid time format. Use hh:mm AM/PM.' });
      }
  
      const [_, hours, minutes, period] = match;
  
      let parsedHours = parseInt(hours, 10);
      if (period.toUpperCase() === 'PM' && parsedHours !== 12) {
        parsedHours += 12;
      } else if (period.toUpperCase() === 'AM' && parsedHours === 12) {
        parsedHours = 0;
      }
  
      const dateTime = DateTime.fromISO(date, { zone: timeZone })
        .set({ hour: parsedHours, minute: parseInt(minutes, 10), second: 0, millisecond: 0 })
        .toUTC();
  
      if (!dateTime.isValid) {
        return res.status(400).json({ message: 'Invalid date or time provided.' });
      }
  
      if (dateTime < DateTime.now().toUTC()) {
        return res.status(400).json({ message: 'Appointment date and time must be in the future.' });
      }
  
      // Generate a new Google Meet link if date or time or status has changed
      let updatedAppointmentLink = existingAppointment.appointmentLink;
      if (date !== existingAppointment.appointmentDate || time !== existingAppointment.timeSlot || status !== existingAppointment.status) {
        updatedAppointmentLink = await createMeet(patientEmail, consultantEmail, date, time, timeZone);
      }
  
      // Update the appointment with new details
      const updatedFields = {
        appointmentDate: dateTime.toISO(),
        status,
        appointmentLink: updatedAppointmentLink,
        updatedAt: new Date(),
      };
  
      const result = await mongoose.connection.db
        .collection('appointments')
        .updateOne({ appointmentId: parseInt(appointmentId) }, { $set: updatedFields });
  
      if (result.matchedCount === 0) {
        throw new Error('Failed to update appointment.');
      }
  
      const updatedAppointment = await mongoose.connection.db
        .collection('appointments')
        .findOne({ appointmentId: parseInt(appointmentId) });
  
      const timeSlot = DateTime.fromISO(updatedAppointment.appointmentDate, { zone: timeZone }).toFormat('h:mm a');
  
      res.status(200).json({
        message: 'Appointment updated successfully.',
        data: {
          ...updatedAppointment,
          timeSlot,
        },
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      res.status(500).json({ error: 'Failed to update appointment.' });
    }
  };
  
  module.exports = { updateAppointment };
  
