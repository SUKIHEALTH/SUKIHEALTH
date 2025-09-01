const Payment = require('../models/paymentModel');
const Patient = require('../models/patientModel');

const getPaymentDetailsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { invoiceNumber, pageNumber, pageSize } = req.body;
    console.log("Fetching patient payment details with pagination");

    const query = { patientId };

    if (invoiceNumber) {
      query.$expr = {
        $regexMatch: {
          input: { $toString: "$invoiceNumber" },
          regex: new RegExp(invoiceNumber, "i"),
        },
      };
    }

    const skip = (pageNumber - 1) * pageSize;

    // Fetch payment details
    const payments = await Payment.find(query)
      .sort({ transactionDate: -1 })
      .skip(skip)
      .limit(parseInt(pageSize));

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: 'No payment details found for the given criteria.' });
    }

    // Fetch patient details
    const patient = await Patient.findOne({ userId: patientId }).select("userId information.firstName information.lastName profileImage");
    const patientDetails = patient
      ? {
          profileImage: patient.profileImage,
          patientId: patient.userId,
          firstname: patient.information.firstName,
          lastname: patient.information.lastName,
        }
      : null;

    // Attach patient details to each payment
    const paymentsWithPatients = payments.map((payment) => ({
      ...payment.toObject(),
      patientDetails,
    }));

    // Fetch total count for pagination
    const totalPayments = await Payment.countDocuments(query);

    res.status(200).json({
      payments: paymentsWithPatients,
      pagination: {
        totalPayments,
        currentPage: parseInt(pageNumber),
        totalPages: Math.ceil(totalPayments / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ message: 'Failed to fetch payment details.' });
  }
};

module.exports = {
  getPaymentDetailsByPatientId,
};
