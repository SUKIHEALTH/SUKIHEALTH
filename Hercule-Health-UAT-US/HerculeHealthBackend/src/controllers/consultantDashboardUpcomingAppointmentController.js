const Appointment = require('../models/appointmentModel');
const Patient = require('../models/patientModel');
const Payment = require('../models/paymentModel'); // Add payment model

// Controller to fetch the first upcoming/latest paid appointment with patient profile image
const getFirstUpcomingAppointment = async (req, res) => {
    try {
        const { consultantId } = req.params;

        if (!consultantId) {
            return res.status(400).json({ message: 'Consultant ID is required' });
        }

        const parsedConsultantId = isNaN(consultantId) ? consultantId : parseInt(consultantId, 10);
        const currentDateTime = new Date();

        // Get all paid appointment IDs for this consultant
        const paidAppointments = await Payment.find({
            status: "paid"
        }).select("appointmentId");

        const paidAppointmentIds = new Set(paidAppointments.map((p) => p.appointmentId));

        // Aggregate to fetch the first upcoming/latest paid appointment
        const latestAppointment = await Appointment.aggregate([
            {
                $match: {
                    consultantId: parsedConsultantId,
                    appointmentDate: { $gte: currentDateTime },
                    appointmentId: { $in: Array.from(paidAppointmentIds) }, // Only paid
                    status: { $in: ["confirmed", "rescheduled"] },
                },
            },
            {
                $sort: { appointmentDate: 1 },
            },
            {
                $limit: 1,
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patientId',
                    foreignField: 'userId',
                    as: 'patientDetails',
                },
            },
            {
                $unwind: { path: '$patientDetails', preserveNullAndEmptyArrays: true },
            },
            {
                $project: {
                    appointmentId: 1,
                    patientId: 1,
                    consultantId: 1,
                    appointmentDate: 1,
                    appointmentLink: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    'patientDetails.information.firstName': 1,
                    'patientDetails.information.lastName': 1,
                    'patientDetails.profileImage': 1,
                },
            },
        ]);

        if (!latestAppointment || latestAppointment.length === 0) {
            return res.status(404).json({ message: 'No upcoming paid appointment found' });
        }

        // Post-process to convert to 12-hour time format with AM/PM
        const appointment = latestAppointment[0];
        const appointmentDate = new Date(appointment.appointmentDate);
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
        appointment.timeSlote = appointmentDate.toLocaleTimeString('en-US', timeOptions);

        res.status(200).json(appointment);
    } catch (error) {
        console.error('Error fetching latest appointment:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

module.exports = {
    getFirstUpcomingAppointment,
};
