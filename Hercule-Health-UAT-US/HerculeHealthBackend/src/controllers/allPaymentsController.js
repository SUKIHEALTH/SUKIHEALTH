const Payment = require("../models/paymentModel");
const Patient = require("../models/patientModel");

const getAllPayments = async (req, res) => {
  try {
    // Fetch payment details
    const payments = await Payment.find().sort({ transactionDate: -1 });

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: "No paid payment details found for the given criteria." });
    }

    // Fetch patient details separately using patientId as userId
    const patientIds = payments.map((payment) => payment.patientId);
    const patients = await Patient.find({ userId: { $in: patientIds } }).select("userId information.firstName information.lastName profileImage");
    
    // Create a map of userId to patient details
    const patientMap = {};
    patients.forEach((patient) => {
      patientMap[patient.userId] = {
        profileImage: patient.profileImage,
        patientId: patient.userId,
        firstname: patient.information.firstName,
        lastname: patient.information.lastName,
      };
    });

    // Attach patient details to each payment
    const paymentsWithPatients = payments.map((payment) => ({
      ...payment.toObject(),
      patientDetails: patientMap[payment.patientId] || null,
    }));

    // Calculate total revenue
    const totalRevenueResult = await Payment.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]);
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;

    // Calculate monthly revenue
    const monthlyRevenueResult = await Payment.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: {
            year: { $year: "$transactionDate" },
            month: { $month: "$transactionDate" },
          },
          monthlyRevenue: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    const monthlyRevenue = monthlyRevenueResult.map((record) => ({
      year: record._id.year,
      month: record._id.month,
      revenue: record.monthlyRevenue,
    }));

    // Fetch total count for pagination
    const totalPayments = await Payment.countDocuments();

    res.status(200).json({
      payments: paymentsWithPatients,
      totalRevenue,
      monthlyRevenue,
      pagination: {
        totalPayments,
      },
    });
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ message: "Failed to fetch payment records." });
  }
};

module.exports = {
  getAllPayments,
};
