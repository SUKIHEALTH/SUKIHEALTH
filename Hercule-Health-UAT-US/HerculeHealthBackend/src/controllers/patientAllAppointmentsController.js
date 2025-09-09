const mongoose = require("mongoose");
const Appointment = require("../models/appointmentModel");
const Payment = require("../models/paymentModel"); // Import the payment model

// Helper function to format appointment time
const formatTimeSlot = (date) => {
  const appointmentDate = new Date(date);
  let hours = appointmentDate.getHours();
  const minutes = appointmentDate.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12
  const minutesFormatted = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${minutesFormatted} ${ampm}`;
};

const patientAllAppointments = async (req, res) => {
  const { patientId } = req.params;
  const { startDate, endDate, status, pageNumber, pageSize, searchTerm } = req.body;

  try {
    // Convert dates
    const parsedStartDate = startDate ? new Date(startDate) : null;
    const parsedEndDate = endDate ? new Date(endDate) : null;
    if (parsedEndDate) parsedEndDate.setUTCHours(23, 59, 59, 999);

    // Step 1: Find all paid appointment IDs first
    const paidAppointments = await Payment.find({
      patientId: parseInt(patientId),
      status: { $in: ["paid", "refunded", "refund_pending"] }, 
    }).select("appointmentId");

    // Extract paid appointment IDs
    const paidAppointmentIds = new Set(paidAppointments.map((p) => p.appointmentId));

    // Step 2: Find only appointments that are paid
    const matchCondition = {
      appointmentId: { $in: Array.from(paidAppointmentIds) }, // Only fetch paid appointments
    };
    if (parsedStartDate || parsedEndDate) {
      matchCondition.appointmentDate = {
        ...(parsedStartDate && { $gte: parsedStartDate }),
        ...(parsedEndDate && { $lte: parsedEndDate }),
      };
    }
    if (status) {
      matchCondition.status = status;
    }

    // Step 3: Build aggregation pipeline
    let pipeline = [
      { $match: matchCondition }, // Filter only paid appointments
      { $sort: { appointmentDate: -1 } },
      {
        $lookup: {
          from: "consultants",
          localField: "consultantId",
          foreignField: "userId",
          as: "consultantDetails",
        },
      },
      { $unwind: { path: "$consultantDetails", preserveNullAndEmptyArrays: true } },
    ];

    // Step 4: Apply search filtering
    if (searchTerm?.trim()) {
      const regex = { $regex: searchTerm.trim(), $options: "i" };
      pipeline.push({
        $match: {
          $or: [
            { "consultantDetails.information.firstName": regex },
            { "consultantDetails.information.lastName": regex },
          ],
        },
      });
    }

    // Step 5: Project required fields
    pipeline.push({
      $project: {
        appointmentId: 1,
        patientId: 1,
        consultantId: 1,
        appointmentDate: 1,
        appointmentLink: 1,
        status: 1,
        "consultantDetails.information.displayName": 1,
        "consultantDetails.information.firstName": 1,
        "consultantDetails.information.lastName": 1,
        "consultantDetails.information.email": 1,
        "consultantDetails.information.phone": 1,
        "consultantDetails.profileImage": 1,
      },
    });

    // Step 6: Apply pagination AFTER filtering by payment
    const skip = (pageNumber - 1) * pageSize;
    const totalAppointments = await Appointment.aggregate([...pipeline, { $count: "total" }]);
    const totalCount = totalAppointments.length ? totalAppointments[0].total : 0;
    pipeline.push({ $skip: skip }, { $limit: parseInt(pageSize) });

    // Step 7: Execute pipeline
    const allAppointments = await Appointment.aggregate(pipeline);

    // Step 8: Format appointments with time slot
    const formattedAppointments = allAppointments.map((appointment) => ({
      ...appointment,
      timeSlot: formatTimeSlot(appointment.appointmentDate),
    }));

    // Step 9: Return response
    if (!formattedAppointments.length) {
      return res.status(404).json({ message: "No paid appointments found." });
    }

    res.status(200).json({
      appointments: formattedAppointments,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: pageNumber,
      totalCount: totalCount,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments." });
  }
};

module.exports = { patientAllAppointments };


