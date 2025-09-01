const mollieClient = require('../config/mollieService');
const Payment = require("../models/paymentModel");
const RefundRequest = require("../models/refundRequestsModel");
const Patient = require('../models/patientModel');
const { sendEmail } = require('../config/emailService');

// Function to check refund status periodically
// Function to check refund status periodically
const pollingConfig = {
  banktransfer: { interval: 30 * 60 * 1000, maxAttempts: 96 }, // 30 min, 48 hours
  directdebit: { interval: 30 * 60 * 1000, maxAttempts: 96 }, // 30 min, 48 hours
  creditcard: { interval: 60 * 60 * 1000, maxAttempts: 336 }, // 1 hour, 14 days
  paypal: { interval: 10 * 60 * 1000, maxAttempts: 144 }, // 10 min, 24 hours
  klarna: { interval: 30 * 60 * 1000, maxAttempts: 240 }, // 30 min, 5 days
  default: { interval: 15 * 60 * 1000, maxAttempts: 48 }, // 15 min, 12 hours (fallback)
};

const checkRefundStatus = async (paymentId) => {
  try {
    const payment = await Payment.findOne({ paymentId });

    if (!payment) {
      console.log(`Payment ${paymentId} not found in DB`);
      return;
    }

    if (payment.status === "refunded") {
      console.log(`Payment ${paymentId} is already refunded.`);
      return;
    }

    const paymentMethod = payment.method?.toLowerCase() || "default";
    const { interval, maxAttempts } = pollingConfig[paymentMethod] || pollingConfig.default;

    let attempts = 0;
    const intervalId = setInterval(async () => {
      try {
        const refunds = await mollieClient.paymentRefunds.list({ paymentId });

        if (refunds.length > 0) {
          const refundStatus = refunds[0].status;
          console.log(`Checking refund status for ${paymentId}: ${refundStatus}`);

          if (refundStatus === "refunded") {
            // 1️⃣ Update payment table
            payment.status = "refunded";
            await payment.save();
            console.log(`Payment ${paymentId} is now refunded.`);

            // 2️⃣ Update RefundRequest table
            const refundRequest = await RefundRequest.findOne({ paymentId });
            if (refundRequest) {
              refundRequest.refundStatus = "refunded";
              refundRequest.refundProcessedDate = new Date();
              await refundRequest.save();
              console.log(`RefundRequest for ${paymentId} marked as refunded.`);
            } else {
              console.log(`No RefundRequest found for paymentId ${paymentId}.`);
            }
            const refundedDateTime = new Date().toLocaleString('en-GB', {
              timeZone: 'Europe/Berlin',
              hour12: true,                 // to get AM/PM
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZoneName: 'short'         // to get timezone abbreviation
            });
            
            // 3️⃣ Fetch patient details
            const patientDetails = await Patient.findOne({userId: payment.patientId});
            if (patientDetails) {
              const patientEmailData = {
                mail_type: 'patient_refund_confirmation_mail',
                name: `${patientDetails.information.firstName} ${patientDetails.information.lastName}`,
                paymentId: payment.paymentId,
                refundAmount: payment.amount,
                refundDate: refundedDateTime,
                email: patientDetails.information.email,
                subject: 'Your Refund Has Been Processed',
              };

              // 4️⃣ Send refund confirmation email
              await sendEmail(patientEmailData);
              console.log(`Refund confirmation email sent to ${patientDetails.information.email}`);
            } else {
              console.log(`No patient found with ID ${payment.patientId}`);
            }

            clearInterval(intervalId);
            return;

          } else if (refundStatus === "pending" && payment.status !== "refund_pending") {
            payment.status = "refund_pending";
            await payment.save();
            console.log(`Refund for ${paymentId} is still pending. Continuing to check...`);
          }

        } else {
          console.log(`No refund record found yet for ${paymentId}. Retrying...`);
        }

        if (++attempts >= maxAttempts) {
          clearInterval(intervalId);
          console.log(`Stopping refund status check for ${paymentId} after timeout.`);
        }

      } catch (err) {
        console.error("Error checking refund status:", err);
        clearInterval(intervalId);
      }
    }, interval);

  } catch (error) {
    console.error("Error in checkRefundStatus:", error);
  }
};


const refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    // Fetch payment from DB
    const payment = await Payment.findOne({ paymentId });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status === "refunded") {
      return res.status(400).json({ message: "Payment is already refunded" });
    }

    // Initiate refund via Mollie API
    const refund = await mollieClient.paymentRefunds.create({
      paymentId: payment.paymentId,
      amount: {
        currency: payment.currency,
        value: payment.amount.toFixed(2), // Ensure proper format
      },
    });

    console.log("Refund initiated:", refund);

    // Set initial status as "pending"
    if (refund.status === "pending") {
      payment.status = "refund_pending";
      await payment.save();

      // Update RefundRequest status too
      const refundRequest = await RefundRequest.findOne({ paymentId });
      if (refundRequest) {
        refundRequest.refundStatus = "refund_pending";
        await refundRequest.save();
        console.log(`RefundRequest for ${paymentId} marked as refund_pending.`);
      } else {
        console.log(`No RefundRequest found for paymentId ${paymentId}.`);
      }

      // Start polling for refund status updates
      checkRefundStatus(paymentId);
    }

    res.status(200).json({
      message: "Refund initiated successfully",
      refundStatus: refund.status,
    });
  } catch (error) {
    console.error("Refund Error:", error);
    res.status(500).json({ message: "Refund failed", error: error.message });
  }
};

module.exports = { refundPayment };
