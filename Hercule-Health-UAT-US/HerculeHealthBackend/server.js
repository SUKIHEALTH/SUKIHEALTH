const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // To parse cookies
const socketIo = require('socket.io'); // Import socket.io
require('dotenv').config();
require('./src/config/db'); // Database connection
const { authenticateToken } = require('./src/middleware/authenticate');
const { handleSocketConnection } = require('./src/controllers/chatInitializeController'); // Import the WebSocket handler
const { Server } = require('socket.io');
 
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Parse JSON data
const PORT = process.env.PORT || 5001;
 
// Create an HTTP server
const server = http.createServer(app);
 
 
// Initialize socket.io
// const io = socketIo(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL, // Frontend origin
//     methods: ["GET", "POST"],
//     credentials: true, // Allow credentials (cookies)
//   },
// });
 
const io = new Server(server, {
  cors:{
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST"],
    credentials: true,
  }
})
// Middleware
 app.use(bodyParser.json({ limit: '200kb' })); // Set a higher body size limit (200kb)
// app.use(bodyParser.json({ limit: '50mb' }));  // Increase this limit if necessary
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));app.use(cookieParser()); // Enable parsing cookies
app.use(cookieParser());
 
 
app.use(cors({
  origin: process.env.FRONTEND_URL,  // Frontend origin
  credentials: true,  // Allow credentials (cookies)
}));
 
//for chat cleanup
require('./src/config/cron-job');
 
 
// Routes
const createPatientRoute = require('./src/routes/createPatientRoute');
const createConsultantRoute = require('./src/routes/createConsultantRoute');
const loginRoute = require('./src/routes/loginRoute');
const logoutRoute = require('./src/routes/logoutRoute');
const consultantApprovalRoute = require('./src/routes/consultantApprovalRoute');
const getPatientProfileInformationRoute = require('./src/routes/getPatientProfileInformationRoute');
const getAllConsultantRoute = require('./src/routes/getAllConsultantRoute');
const getPatientConsultantInformationRoute = require('./src/routes/getConsultantProfileInformationRoute');
const getAllPatientsRoute = require('./src/routes/getAllPatientsRoute');
const updatePatientInformationRoute = require('./src/routes/updatePatientInformationRoute');
const updateConsultantInformationRoute = require('./src/routes/updateConsultantInformationRoute');
const consultantDashboardDataCountsRoute = require('./src/routes/consultantDashboardDataCountsRoute');
const consultantDashboardLastAppointmentsRoute = require('./src/routes/consultantDashboardLastAppointmentsRoute');
const consultantDashboardUpcomingAppointmentRoute = require('./src/routes/consultantDashboardUpcomingAppointmentRoute');
const consultantDashboardRecentPatientsRoute = require('./src/routes/consultantDashboardRecentPatientsRoute');
const consultantDashboadWeeklyOverviewAppointmentsRoute = require('./src/routes/consultantDashboadWeeklyOverviewAppointmentsRoute');
const getNotificationsRoute = require('./src/routes/getNotificationsRoute');
const patientDashboardUpcomingAppoinmentsRoute = require('./src/routes/patientDashboardUpcomingAppoinmentsRoute');
const patientDashboardPastAppoinmentRoute = require('./src/routes/patientDashboardPastAppoinmentRoute');
const appoinmentCreateRoute = require('./src/routes/appoinmentCreateRoute');
const appoinmentUpdateRoute = require('./src/routes/appoinmentUpdateRoute');
const consultantAllPatientRoute = require('./src/routes/consultantAllPatientRoute');
const consultantAllAppointmentsRoute = require('./src/routes/consultantAllAppointmentsRoute');
const patientAllAppointmentsRoute = require('./src/routes/patientAllAppointmentsRoute');
const emailCheckingRoute = require('./src/routes/emailCheckingRoute');
const emailVerificationRoute = require('./src/routes/emailVerificationRoute');
const fetchFileDataFromS3Route = require('./src/routes/fetchFileDataFromS3Route');
const chatHistoryPatientRoute = require('./src/routes/chatHistoryPatientRoute');
const chatHistoryConsultantRoute = require('./src/routes/chatHistoryConsultantRoute');
const forgetPasswordRoute = require('./src/routes/forgetPasswordRoute');
const resetPasswordRoute = require('./src/routes/resetPasswordRoute');
const changePasswordRoute = require('./src/routes/changePasswordRoute');
const uploadLabResultsRoute = require('./src/routes/uploadLabResultsRoute');
const fetchLabResultsRoute = require('./src/routes/fetchLabResultsRoute');
const fetchLabResultDetailsRoute = require('./src/routes/fetchLabResultDetailsRoute');
const getAllAppoinmentsRoute = require('./src/routes/getAllAppoinmentsRoute');
const paymentBookingRoute = require('./src/routes/paymentBookingRoute');
const paymentsRoute = require('./src/routes/paymentsRoute');
const bookingDetailsRoute = require('./src/routes/bookingDetailsRoute');
const patientPaymentsRoute = require('./src/routes/patientPaymentsRoute');
const allPaymentsRoute = require('./src/routes/allPaymentsRoute');
const getPaymentDetailsRoute = require('./src/routes/getPaymentDetailsRoute');
const labResultRequestRoute = require('./src/routes/labResultRequestRoute');
const labResultCancelRequestRoute = require('./src/routes/labResultCancelRequestRoute');
const labResultShareRoute = require('./src/routes/labResultShareRoute');
const PatientRequestsRoute = require('./src/routes/PatientRequestsRoute');
const patientConsultantsRoute = require('./src/routes/patientConsultantsRoute');
const adminSettingsAddRoute = require('./src/routes/adminSettingsAddRoute');
const adminSettingsDetailsRoute = require('./src/routes/adminSettingsDetailsRoute');
const updateSlotStatus = require('./src/routes/availableTimeStatusChangingRoute');
const rescheduleAppointment = require('./src/routes/appointmentRescheduleRoute'); // Reusing the same route for rescheduling
const getPatientReports = require('./src/routes/getPaitnetReports');
const paymentRefundRoute = require('./src/routes/paymentRefundRoute');
const appoinmentDeleteRoute = require('./src/routes/appointmentDeleteRoute');
const refundRequestsRoute = require('./src/routes/refundRequestsRoute');
const getAllApprovedConsultantRoute = require('./src/routes/getAllApprovedConsultantRoute'); // Reusing the same route for approved consultants
// Route setup
app.use('/api/patient-register', createPatientRoute);
app.use('/api/consultant-register', createConsultantRoute);
app.use('/api/login', loginRoute);
app.use('/api/logout', logoutRoute);
app.use('/api/consultant-approval', authenticateToken, consultantApprovalRoute);
app.use('/api/patient-profile-information', authenticateToken, getPatientProfileInformationRoute);
app.use('/api/all-consultants', authenticateToken, getAllConsultantRoute);
app.use('/api/get-all-approved-consultants', authenticateToken, getAllApprovedConsultantRoute); // Reusing the same route for approved consultants
app.use('/api/consultant-profile-information', authenticateToken, getPatientConsultantInformationRoute);
app.use('/api/all-patients', authenticateToken, getAllPatientsRoute);
app.use('/api/update-patient-information', authenticateToken, updatePatientInformationRoute);
app.use('/api/update-consultant-information', authenticateToken, updateConsultantInformationRoute);
app.use('/api/consultant-dashboard', authenticateToken, consultantDashboardDataCountsRoute);
app.use('/api/consultant-dashboard-last-appointments', authenticateToken, consultantDashboardLastAppointmentsRoute);
app.use('/api/consultant-dashboard-upcoming-appointment', authenticateToken, consultantDashboardUpcomingAppointmentRoute);
app.use('/api/consultant-dashboard-recent-patients', authenticateToken, consultantDashboardRecentPatientsRoute);
app.use('/api/consultant-dashboard-weekly-overview-appointments', authenticateToken, consultantDashboadWeeklyOverviewAppointmentsRoute);
app.use('/api/user-notifications', authenticateToken, getNotificationsRoute);
app.use('/api/patient-dashboard-upcoming-appoinments', authenticateToken, patientDashboardUpcomingAppoinmentsRoute);
app.use('/api/patient-dashboard-past-appoinment', authenticateToken, patientDashboardPastAppoinmentRoute);
app.use('/api/create-appoinment', authenticateToken, appoinmentCreateRoute);
app.use('/api/update-appoinment', authenticateToken, appoinmentUpdateRoute);
app.use('/api/get-all-consultant-patients', authenticateToken, consultantAllPatientRoute);
app.use('/api/get-all-consultant-appointments', authenticateToken, consultantAllAppointmentsRoute);
app.use('/api/get-all-patient-appointments', authenticateToken, patientAllAppointmentsRoute);
app.use('/api/email-check', emailCheckingRoute);
app.use('/api/email-verification', emailVerificationRoute);
app.use('/api/fetchFileData', authenticateToken, fetchFileDataFromS3Route);
app.use('/api/patient-chat-history', authenticateToken, chatHistoryPatientRoute);
app.use('/api/consultant-chat-history', authenticateToken, chatHistoryConsultantRoute);
app.use('/api/forget-password', forgetPasswordRoute);
app.use('/api/reset-password', resetPasswordRoute);
app.use('/api/change-password', authenticateToken, changePasswordRoute);
app.use('/api/upload-labresult', authenticateToken, uploadLabResultsRoute);
app.use('/api/fetch-labresults', authenticateToken, fetchLabResultsRoute);
app.use('/api/fetch-labresult-details', authenticateToken, fetchLabResultDetailsRoute);
app.use('/api/get-all-appointments', authenticateToken, getAllAppoinmentsRoute);
app.use('/api/delete-appointment', authenticateToken, appoinmentDeleteRoute);
app.use('/api/booking-payment', authenticateToken, paymentBookingRoute);
app.use('/api/payment-update', paymentsRoute); // No authentication for webhook
app.use('/api/get-booking-details', authenticateToken, bookingDetailsRoute);
app.use('/api/get-patient-payments', authenticateToken, patientPaymentsRoute);
app.use('/api/get-all-payments', authenticateToken, allPaymentsRoute);
app.use('/api/get-payment-details', authenticateToken, getPaymentDetailsRoute);
app.use('/api/request-lab-result', authenticateToken, labResultRequestRoute);
app.use('/api/cancel-lab-result', authenticateToken, labResultCancelRequestRoute);
app.use('/api/share-lab-result', authenticateToken, labResultShareRoute);
app.use('/api/patient-requests', authenticateToken, PatientRequestsRoute);
app.use('/api/patient-consultants', authenticateToken, patientConsultantsRoute);
app.use('/api/add-admin-settings', authenticateToken, adminSettingsAddRoute);
app.use('/api/get-admin-settings', authenticateToken, adminSettingsDetailsRoute);
app.use('/api/update-available-slot',authenticateToken,updateSlotStatus);
app.use("/api/reschedule-appointment", authenticateToken, rescheduleAppointment); // Reusing the same route for rescheduling
app.use('/api/get-patient-reports', authenticateToken, getPatientReports);
app.use('/api/notifications/user', authenticateToken, getNotificationsRoute);
app.use('/api/payment-refund', authenticateToken, paymentRefundRoute);
app.use('/api/refund-requests', authenticateToken, refundRequestsRoute);
 
 
// WebSocket chat setup using the controller
io.on('connection', (socket) => {
  console.log('A user connected now:', socket.id);
 
  // Handle WebSocket connection logic in the controller
  handleSocketConnection(io,socket);
 
  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});
 
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});
 
// Start server
if (process.env.SSL_ENABLED === 'true') {
  const key = fs.readFileSync(process.env.SSL_KEY_PATH);
  const cert = fs.readFileSync(process.env.SSL_CERT_PATH);
  https.createServer({ key, cert }, app).listen(PORT, () => {
    console.log(`Server running with SSL on port ${PORT}`);
  });
} else {
  server.listen(PORT, () => {
    console.log(`Server running without SSL on port ${PORT}`);
  });
}