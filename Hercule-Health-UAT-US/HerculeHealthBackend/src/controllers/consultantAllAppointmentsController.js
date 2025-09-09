const mongoose = require("mongoose");
const Appointment = require("../models/appointmentModel");
const Payment = require("../models/paymentModel"); // Import the payment model

const formatTimeSlot = (date) => {
  const appointmentDate = new Date(date);
  let hours = appointmentDate.getHours();
  const minutes = appointmentDate.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;
  const minutesFormatted = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${minutesFormatted} ${ampm}`;
};

const consultantAllAppointments = async (req, res) => {
  const { consultantId } = req.params;
  const { startDate, endDate, status, pageNumber, pageSize, searchTerm } = req.body;

  try {
    const page = parseInt(pageNumber, 10) || 1;
    const limit = parseInt(pageSize, 10) || 10;
    const skip = (page - 1) * limit;

    const parsedStartDate = startDate ? new Date(startDate) : null;
    const parsedEndDate = endDate ? new Date(endDate) : null;

    if (startDate && !Date.parse(startDate)) {
      return res.status(400).json({ message: "Invalid startDate format." });
    }
    if (endDate && !Date.parse(endDate)) {
      return res.status(400).json({ message: "Invalid endDate format." });
    }

    if (parsedEndDate) {
      parsedEndDate.setUTCHours(23, 59, 59, 999);
    }

    // **Step 1: Get Paid Appointment IDs First**
    const paidAppointments = await Payment.find({
      status: { $in: ["paid", "refunded", "refund_pending"] }, 
    }).select("appointmentId");

    const paidAppointmentIds = new Set(paidAppointments.map((p) => p.appointmentId));

    // **Step 2: Fetch Only Paid Appointments**
    const matchCondition = {
      consultantId: parseInt(consultantId),
      appointmentId: { $in: Array.from(paidAppointmentIds) }, // Only include paid appointments
    };

    if (parsedStartDate && parsedEndDate) {
      matchCondition.appointmentDate = { $gte: parsedStartDate, $lte: parsedEndDate };
    } else if (parsedStartDate) {
      matchCondition.appointmentDate = { $gte: parsedStartDate };
    } else if (parsedEndDate) {
      matchCondition.appointmentDate = { $lte: parsedEndDate };
    }

    if (status) {
      matchCondition.status = status;
    }

    const regex = searchTerm?.trim()
      ? { $regex: searchTerm.trim(), $options: "i" }
      : null;

    // **Step 3: Aggregation Pipeline**
    const allAppointments = await Appointment.aggregate([
      { $match: matchCondition },
      { $sort: { appointmentDate: -1 } },
      {
        $lookup: {
          from: "patients",
          localField: "patientId",
          foreignField: "userId",
          as: "patientDetails",
        },
      },
      { $unwind: { path: "$patientDetails", preserveNullAndEmptyArrays: true } },
      ...(regex
        ? [
            {
              $match: {
                $or: [
                  { "patientDetails.information.firstName": regex },
                  { "patientDetails.information.lastName": regex },
                ],
              },
            },
          ]
        : []),
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
          "patientDetails.information.firstName": 1,
          "patientDetails.information.lastName": 1,
          "patientDetails.information.email": 1,
          "patientDetails.information.phone": 1,
          "patientDetails.profileImage": 1,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    // **Step 4: Get Total Count After Filtering**
    const totalCountPipeline = [
      { $match: matchCondition },
      {
        $lookup: {
          from: "patients",
          localField: "patientId",
          foreignField: "userId",
          as: "patientDetails",
        },
      },
      { $unwind: { path: "$patientDetails", preserveNullAndEmptyArrays: true } },
      ...(regex
        ? [
            {
              $match: {
                $or: [
                  { "patientDetails.information.firstName": regex },
                  { "patientDetails.information.lastName": regex },
                ],
              },
            },
          ]
        : []),
    ];
    const totalCount = (await Appointment.aggregate(totalCountPipeline)).length;
    const totalPages = Math.ceil(totalCount / limit);

    // **Step 5: Format Appointments**
    const formattedAppointments = allAppointments.map((appointment) => ({
      ...appointment,
      timeSlot: formatTimeSlot(appointment.appointmentDate),
    }));

    // **Step 6: Send Response**
    if (!formattedAppointments.length) {
      return res.status(404).json({ message: "No paid appointments found." });
    }

    res.status(200).json({
      appointments: formattedAppointments,
      totalPages,
      currentPage: page,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error.message, error.stack);
    res.status(500).json({
      error: "Failed to fetch all appointments.",
      message: error.message,
    });
  }
};

module.exports = { consultantAllAppointments };
