const RefundRequest = require('../models/refundRequestsModel');
const Patient = require('../models/patientModel');
const Payment = require('../models/paymentModel');
const User = require('../models/userModel'); // <--- import your user model

// Fetch all refund requests with patient, payment and user (initiator) details
const fetchAllRefundRequests = async (req, res) => {
  try {
    const refundRequests = await RefundRequest.find().sort({ refundRequestId: -1 });;

    if (!refundRequests || refundRequests.length === 0) {
      return res.status(404).json({
        message: 'No refund requests found.',
      });
    }

    const enrichedRefundRequests = await Promise.all(
      refundRequests.map(async (refund) => {
        const patient = await Patient.findOne(
          { userId: refund.patientId },
          'userId information.firstName information.lastName information.email profileImage'
        );

        const payment = await Payment.findOne({ paymentId: refund.paymentId });

        const refundInitiator = await User.findOne(
          { userId: refund.refundInitiatedBy.userId },
          'userId firstName lastName'
        );

        return {
          ...refund.toObject(),
          patientDetails: patient || null,
          paymentDetails: payment || null,
          refundInitiatedByDetails: refundInitiator || null,
        };
      })
    );

    res.status(200).json({
      message: 'Refund requests fetched successfully.',
      refundRequests: enrichedRefundRequests,
    });
  } catch (error) {
    console.error('Error in fetchAllRefundRequests:', error);
    res.status(500).json({
      error: 'Failed to fetch refund requests.',
    });
  }
};

module.exports = {
  fetchAllRefundRequests,
};
