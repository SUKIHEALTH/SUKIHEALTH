
// src/controllers/paymentController.js
const mollieClient = require('../config/mollieService');
const Appointment = require('../models/appointmentModel');
const Payment = require('../models/paymentModel');
const { updateSlotStatus } = require('./availablesSlotsStatusChangingController');


// Webhook to handle payment updates
const paymentWebhook = async (req, res) => {
  console.log("webhook api called >> body", req.body);

  try {
    const paymentId = req.body.id;
    console.log('paymentId in webhook', paymentId);

    // Fetch payment details from Mollie
    const payment = await mollieClient.payments.get(paymentId);

    // Find existing payment record
    const existingPayment = await Payment.findOne({ paymentId });

    if (!existingPayment) {
      return res.status(404).json({ message: 'Payment not found.' });
    }

    // If payment status is 'paid' but local DB status is 'refund_pending', do nothing and exit
    if (payment.status === "paid" && existingPayment.status === "refund_pending") {
      console.log(`Payment ${paymentId} is 'paid' but marked 'refund_pending' in DB. Skipping further actions.`);
      return res.status(200).json({ message: 'Payment marked refund_pending, no updates made.' });
    }

    // Otherwise, update payment status in database
    const updatedPayment = await Payment.findOneAndUpdate(
      { paymentId },
      { status: payment.status, paymentMethod: payment.method },
      { new: true }
    );

    if (payment.status === "paid") {
      const appointment = await Appointment.findOne({
        appointmentId: updatedPayment.appointmentId,
      });

      if (appointment) {
        console.log("Appointment details:", {
          appointmentId: appointment.appointmentId,
          consultantId: appointment.consultantId,
          appointmentDate: appointment.appointmentDate,
        });

        // Call the updateSlotStatus logic directly
        const consultantId = appointment.consultantId;
        const time = appointment.appointmentDate;
        const status = "Booked";

        const reqMock = { params: { consultantId }, body: { time, status } };
        const resMock = {
          status: (code) => ({
            json: (data) => console.log(`Response: ${code}`, data),
          }),
        };

        const slotUpdateResult = await updateSlotStatus(reqMock, resMock);

        if (slotUpdateResult) {
          console.log("Slot status successfully updated to 'Booked'.");
        } else {
          console.error("Failed to update slot status.");
        }
      } else {
        console.error("Appointment not found for ID:", updatedPayment.appointmentId);
      }
    }

    res.status(200).json({ message: 'Payment updated successfully.' });

  } catch (error) {
    console.error('Error handling payment webhook:', error);
    res.status(500).json({ message: 'Failed to process payment webhook.' });
  }
};

module.exports = { paymentWebhook };


