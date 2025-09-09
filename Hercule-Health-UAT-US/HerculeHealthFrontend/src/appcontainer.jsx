/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import config from "config";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
// import Header from "./client/components/header.jsx";
// import Footer from "./client/components/footer.jsx";
// import TopHeader from "./client/components/topheader.jsx";
import LoginContainer from "./client/components/login/login.jsx";
import Register from "./client/components/register/register.jsx";
import ForgotPassword from "./client/components/forgot-password";

//blog
import BlogList from "./client/components/blog/bloglist";
import BlogGrid from "./client/components/blog/bloggrid";
import BlogDetails from "./client/components/blog/blogdetails";
//pages
import VideoCall from "./client/components/pages/videocall";
import VoiceCall from "./client/components/pages/voicecall";
import SearchDoctor from "./client/components/pages/searchdoctor/search-doctor1";
import Components from "./client/components/pages/component";
import Calendar from "./client/components/pages/calender";
import Invoice from "./client/components/pages/invoices/invoices";
import InvoiceView from "./client/components/pages/invoices/view";
import DoctorGrid from "./client/components/patients/doctorgrid";
import DoctorList from "./client/components/patients/doctorlist";
import DoctorProfile from "./client/components/patients/doctorprofile";
import DoctorChat from "./client/components/doctors/chat";
import PatientChat from "./client/components/patients/chat";
import MyPatient from "./client/components/doctors/mypatient";
import Booking from "./client/components/patients/booking/booking1";
import Rescheduling from "./client/components/patients/booking/Rescheduling.jsx";
import Booking2 from "./client/components/patients/booking/booking2";

import Checkout from "./client/components/patients/checkout";
import BookingSuccess from "./client/components/patients/booking-success";
import Dashboard from "./client/components/patients/dashboard/index.jsx";
import PatientDependent from "./client/components/patients/dependent";
import PatientAccounts from "./client/components/patients/accounts";
import Orders from "./client/components/patients/orders";
import MedicalRecords from "./client/components/patients/medicalrecords";
import MedicalDetails from "./client/components/patients/medicaldetails";
import Favourties from "./client/components/patients/dashboard/favourties";
import Profile from "./client/components/patients/dashboard/profile";
import Password from "./client/components/patients/dashboard/password";
import DoctorDashboard from "./client/components/doctors/dashboard";
import SocialMedia from "./client/components/doctors/socialmedia";
import ScheduleTiming from "./client/components/doctors/scheduletimings";
import DoctorPassword from "./client/components/doctors/password";
import Appointments from "./client/components/doctors/appointments";
import PatientProfile from "./client/components/doctors/patientprofile";
import AddPescription from "./client/components/doctors/addpescription";
import AddBilling from "./client/components/doctors/addbilling";
import ProfileSetting from "./client/components/doctors/profilesetting";
import Review from "./client/components/doctors/reviews";
import DoctorRegister from "./client/components/doctors/register";
import Registerstepone from "./client/components/doctors/register/registerstepone";
import Registersteptwo from "./client/components/doctors/register/registersteptwo";
import Registerstepthree from "./client/components/doctors/register/registerstepthree";
import Terms from "./client/components/pages/terms";
import Policy from "./client/components/pages/policy";
import Aboutus from "./client/components/pages/aboutus/aboutus";
import Contactus from "./client/components/pages/contactus/contactus";
import Patientregisterstepone from "./client/components/register/patientregisterstepone";
import Patientregistersteptwo from "./client/components/register/patientregistersteptwo";
// import Patientregisterstepthree from "./client/components/register/patientregisterstepthree";
// import Patientregisterstepfour from "./client/components/register/patientregisterstepfour";
import Patientregisterstepfive from "./client/components/register/patientregisterstepfive";
//pharmacy
import Pharmacy from "./client/components/Pharmacy/pharmacy";
import pharmacydetail from "./client/components/Pharmacy/pharmactdetail";
import PharmacySearch from "./client/components/Pharmacy/pharmacysearch";
import Cart from "./client/components/Pharmacy/cart";
import Product from "./client/components/Pharmacy/product";
import ProductDescription from "./client/components/Pharmacy/productdescription";
import ProductCheckout from "./client/components/Pharmacy/productcheckout";
import PayoutSuccess from "./client/components/Pharmacy/payoutsuccess";
import AppUniversal from "./admin/app-universal";
import PharmacyadminApp from "./pharmacyadmin/app-universal";
import BlankPage from "./client/components/pages/starter page/index.jsx";
import Pharmacyregister from "./client/components/Pharmacy/pharmacyregister";
import Pharmacyregisterstepone from "./client/components/Pharmacy/pharmacyregisterstepone";
import Pharmacyregistersteptwo from "./client/components/Pharmacy/pharmacyregistersteptwo";
import Pharmacyregisterstepthree from "./client/components/Pharmacy/pharmacyregisterstepthree";
import Doctorblog from "./client/components/blog/doctorblog/doctorblog";
import Doctoraddblog from "./client/components/blog/doctorblog/doctoraddblog";
import Doctorpendingblog from "./client/components/blog/doctorblog/doctorpendingblog";
import Doctoreditblog from "./client/components/blog/doctorblog/doctoreditblog";
import EditPrescription from "./client/components/doctors/patientprofile/edit-prescription";
import EditBilling from "./client/components/doctors/editbilling/index";
import MapList from "./client/components/patients/map-list/index";
import OnboardingEmail from "./client/components/pages/doctoronboarding/onboardingemail";
import OnboardingPersonalize from "./client/components/pages/doctoronboarding/onboardingpersonalize";
import OnboardingIdentity from "./client/components/pages/doctoronboarding/onboardingidentity";
import OnboardingPayments from "./client/components/pages/doctoronboarding/onboardingpayments";
// import onboardingpersonalize from "./client/components/pages/doctoronboarding/onboardingpayments";
import OnboardingPreferences from "./client/components/pages/doctoronboarding/onboardingpreferences";
import Onboardingverification from "./client/components/pages/doctoronboarding/onboardingverification";
import PatientOnboardingEmail from "./client/components/pages/patientonboarding/Email";
import PatientOnboardingPersonalize from "./client/components/pages/patientonboarding/Personalize";
import PatientOnboardingDetails from "./client/components/pages/patientonboarding/Details";
import PatientFamilyDetails from "./client/components/pages/patientonboarding/FamilyDetails";
import DependantDetails from "./client/components/pages/patientonboarding/DependantDetails";
import OtherDetails from "./client/components/pages/patientonboarding/OtherDetails";
import OnboardingEmailOtp from "./client/components/pages/doctoronboarding/onboardingemail-otp";
import Onboardingphone from "./client/components/pages/doctoronboarding/onboardingphone";
import Onboardingphoneotp from "./client/components/pages/doctoronboarding/onboardingphoneotp";
import Onboardingpassword from "./client/components/pages/doctoronboarding/onboardingpassword";
import PatientEmailOtp from "./client/components/pages/patientonboarding/PatientEmailOtp";
import PatientPhone from "./client/components/pages/patientonboarding/Patientphone";
import patientphoneotp from "./client/components/pages/patientonboarding/patientphoneotp";
import patientpassword from "./client/components/pages/patientonboarding/patientpassword";
import PhoneOtp from "./client/components/pages/patientonboarding/phoneotp";
import Producthealthcare from "./client/components/pages/producthealthcare/index";
import Comingsoon from "./client/components/pages/coming soon/index.jsx";
import Maintenance from "./client/components/pages/maintanence/index.jsx";
import PricingPlan from "./client/components/pages/pricing plan/index.jsx";
import Error404 from "./client/components/pages/error/Error404.jsx";
import Error500 from "./client/components/pages/error/Error500.jsx";
import LoginEmail from "./client/components/pages/authentication/login-email.jsx";
import LoginPhone from "./client/components/pages/authentication/login-phone.jsx";
import LoginEmailOtp from "./client/components/pages/authentication/login-email-otp.jsx";
import LoginPhoneOtp from "./client/components/pages/authentication/login-phone-otp.jsx";
import ForgotPassword2 from "./client/components/pages/authentication/forgot-password2.jsx";
import PatientSignup from "./client/components/pages/authentication/patient-signup.jsx";
import Signup from "./client/components/pages/authentication/signup.jsx";
import SuccessSignup from "./client/components/pages/authentication/success-signup.jsx";
import DoctorSignup from "./client/components/pages/authentication/doctor-signup.jsx";
import Faq from "./client/components/pages/faq/index.jsx";
import EmailOtp from "./client/components/pages/authentication/email-otp.jsx";
import MobileOtp from "./client/components/pages/authentication/phone-otp.jsx";
import AvailableTiming from "./client/components/doctors/availabletiming/index.jsx";
import Accounts from "./client/components/doctors/account/index.jsx";
import SearchDoctor2 from "./client/components/pages/searchdoctor/search-doctor2.jsx";
import DoctorAppointmentsGrid from "./client/components/doctors/appointments/doctorAppointmentsGrid.jsx";
import DoctorAppoinmentStart from "./client/components/doctors/appointments/doctorAppoinmentStart.jsx";
import DoctorCancelledAppointment from "./client/components/doctors/appointments/doctorCancelledAppointment.jsx";
import DoctorRequest from "./client/components/doctors/doctorRequest/index.jsx";
import DoctorUpcomingAppointment from "./client/components/doctors/appointments/doctorUpcomingAppointment.jsx";
import AvailableTimings from "./client/components/doctors/availableTimings/index.jsx";
import Experience from "./client/components/doctors/profilesetting/experience.jsx";
import DoctorSpecialities from "./client/components/doctors/specialities/index.jsx";
import DoctorPayment from "./client/components/doctors/doctorPayment/index.jsx";
import Education from "./client/components/doctors/profilesetting/education.jsx";
import Awards from "./client/components/doctors/profilesetting/award.jsx";
import InsuranceSettings from "./client/components/doctors/profilesetting/insurance.jsx";
import Clinic from "./client/components/doctors/profilesetting/clinic.jsx";
import BusinessSettings from "./client/components/doctors/profilesetting/business.jsx";
import DoctorCancelledAppointment2 from "./client/components/doctors/appointments/doctorCancelledAppointment2.jsx";
import DoctorAppoinmentDetails from "./client/components/doctors/appointments/doctorAppoinmentDetails.jsx";
import CompletedAppointment from "./client/components/doctors/appointments/completedAppointment.jsx";
import PatientInvoice from "./client/components/patients/patient-invoice/index.jsx";
import PatientAppointments from "./client/components/patients/appointments/index.jsx";
import CompletedAppoinments from "./client/components/patients/appointments/completedAppoinments.jsx";
import CancelledAppoinments from "./client/components/patients/appointments/cancelledAppoinments.jsx";
import UpComingAppointment from "./client/components/patients/appointments/upcomingAppointment.jsx";
import AppointmentGrid from "./client/components/patients/appointments/appointmentGrid.jsx";
import Home1 from "./client/components/home/home-1/index.jsx";
import { base_path } from "./environment.jsx";
import Home3 from "./client/components/home/home-3/index.jsx";
import Home5 from "./client/components/home/home-5/index.jsx";
import Home6 from "./client/components/home/home-6/index.jsx";
import Home7 from "./client/components/home/home-7/index.jsx";
import Home8 from "./client/components/home/home-8/index.jsx";
import Home9 from "./client/components/home/home-9/index.jsx";
import Home2 from "./client/components/home/home-2/index.jsx";
import Home10 from "./client/components/home/home-10/index.jsx";
import Home11 from "./client/components/home/home-11/index.jsx";
import Home12 from "./client/components/home/home-12/index.jsx";
import Home13 from "./client/components/home/home-13/index.jsx";
import Home14 from "./client/components/home/home-14/index.jsx";
import AdminApprovel from "./client/components/pages/approvePage/notapprovePage.jsx";
import DoctorProfileTwo from "./client/components/patients/doctorprofile2/index.jsx";
import { AuthProvider } from "./context/AuthContext.js";
import ProtectedRoute from "./routes/ProtectedRoute.js";
import ShowDetails from "./client/components/patients/medicaldetails/showdetails/ShowDetails.jsx";
import ShowMore from "./client/components/patients/medicaldetails/showdetails/ShowMore.jsx";
import EmailVerification from "./client/verifyEmail.jsx";
import ResetPassword from "./client/components/forgot-password/resetPassword/ResetPassword.jsx";
import DashboardAdmin from "./admin/components/dashboard/index.jsx";
import AdminAppointments from "./admin/components/appointments/index.jsx";
import RefundRequests from "./admin/components/refundrequests/index.jsx";
import Doctors from "./admin/components/doctors/index.jsx";
import Patients from "./admin/components/patients/index.jsx";
import Settings from "./admin/components/settings/index.jsx";
import Invoices from "./admin/components/Reports/InvoiceReport/InvoiceReport.jsx";
import { AdminSettingsProvider } from "./context/AdminSettingsContext.js";
import AboutUs from "./client/components/pages/AboutUs.jsx";
import CustomerSpeaks from "./client/components/pages/CustomerSpeaks.jsx";
import Careers from "./client/components/pages/Careers.jsx";
import FeesAndPayments from "./client/components/pages/FeesAndPayments.jsx";
import ShippingAndDelivery from "./client/components/pages/ShippingAndDelivery.jsx";
import ReturnRefundPolicy from "./client/components/pages/RetrunRefund.jsx";
import InTheNews from "./client/components/pages/InTheNews.jsx";
import TermsLogout from "./client/components/pages/terms/TermsLogout.jsx";
import PolicyLogout from "./client/components/pages/policy/PolicyLogout.jsx";
const AppContainer = function (props) {
  if (props) {
    const url = props.location.pathname.split("/")[1];

    useEffect(() => {
      const handleMouseMove = (event) => {
        const cursorInner = document.querySelector(".cursor-inner");
        const cursorOuter = document.querySelector(".cursor-outer");

        if (cursorOuter) {
          cursorOuter.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
        }

        if (cursorInner) {
          cursorInner.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
        }
      };

      const handleMouseEnter = () => {
        const cursorInner = document.querySelector(".cursor-inner");
        const cursorOuter = document.querySelector(".cursor-outer");

        if (cursorInner) {
          cursorInner.classList.add("s");
        }

        if (cursorOuter) {
          cursorOuter.classList.add("s");
        }
      };

      const handleMouseLeave = (event) => {
        const cursorInner = document.querySelector(".cursor-inner");
        const cursorOuter = document.querySelector(".cursor-outer");

        if (
          event.target.tagName !== "A" ||
          !event.target.closest(".cursor-pointer")
        ) {
          if (cursorInner) {
            cursorInner.classList.remove("cursor-hover");
          }

          if (cursorOuter) {
            cursorOuter.classList.remove("cursor-hover");
          }
        }
      };

      document.body.addEventListener("mousemove", handleMouseMove);
      document.body.addEventListener("mouseenter", handleMouseEnter);
      document.body.addEventListener("mouseleave", handleMouseLeave);

      const cursorInner = document.querySelector(".cursor-inner");
      const cursorOuter = document.querySelector(".cursor-outer");

      if (cursorInner) {
        cursorInner.style.visibility = "visible";
      }

      if (cursorOuter) {
        cursorOuter.style.visibility = "visible";
      }

      return () => {
        document.body.removeEventListener("mousemove", handleMouseMove);
        document.body.removeEventListener("mouseenter", handleMouseEnter);
        document.body.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, []);

    return (
      <AuthProvider>
        <AdminSettingsProvider>
        <Router basename={base_path}>
          {" "}
          {url === "admin2" ? (
            <div>
              <Switch>
                <ProtectedRoute path="/admin" component={AppUniversal} />
              </Switch>
            </div>
          ) : url === "pharmacyadmin" ? (
            <div>
              <Switch>
                <Route path="/pharmacyadmin" component={PharmacyadminApp} />
              </Switch>
            </div>
          ) : (
            <div>
              <Switch>
              <ProtectedRoute
                  path="/admin"
                  exact
                  component={DashboardAdmin}
                  allowedAccessTypes={[1]}
                />
                 <ProtectedRoute
                  path="/admin/appointment-list"
                  exact
                  component={AdminAppointments}
                  allowedAccessTypes={[1]}
                />
                <ProtectedRoute
                  path="/admin/refund-requests"
                  exact
                  component={RefundRequests}
                  allowedAccessTypes={[1]}
                />
                 <ProtectedRoute
                  path="/admin/doctor-list"
                  exact
                  component={Doctors}
                  allowedAccessTypes={[1]}
                />
                 <ProtectedRoute
                  path="/admin/patient-list"
                  exact
                  component={Patients}
                  allowedAccessTypes={[1]}
                />
                <ProtectedRoute
                path="/admin/admin-invoices"
                exact
                component={Invoices}
                allowedAccessTypes={[1]}
                />
                <ProtectedRoute
                  path="/admin/settings"
                  exact
                  component={Settings}
                  allowedAccessTypes={[1]}
                />
                <ProtectedRoute
                  path="/patient/doctor-grid"
                  exact
                  component={DoctorGrid}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/doctor-list"
                  exact
                  component={DoctorList}
                  allowedAccessTypes={[3]}
                />
                {/* <ProtectedRoute
                  path="/pages/video-call"
                  exact
                  component={VideoCall}
                />
                <ProtectedRoute
                  path="/pages/voice-call"
                  exact
                  component={VoiceCall}
                /> */}
                <ProtectedRoute
                  path="/chat-doctor/:id"
                  exact
                  component={DoctorChat}
                  allowedAccessTypes={[2]}
                />
                <Route path="/login" exact component={LoginContainer} />
                <Route path="/register" exact component={Register} />
                <Route
                  path="/pages/forgot-password"
                  exact
                  component={ForgotPassword}
                />
                <Route
                  path="/reset_password"
                  exact
                  component={ResetPassword}
                />
                <Route
                  path="/pages/forgot-password2"
                  exact
                  component={ForgotPassword2}
                />
                <Route path="/pages/login-email" exact component={LoginEmail} />
                <Route path="/pages/login-phone" exact component={LoginPhone} />
                <Route
                  path="/pages/email-otp"
                  exact
                  component={LoginEmailOtp}
                />
                <Route
                  path="/pages/phone-otp"
                  exact
                  component={LoginPhoneOtp}
                />
                <Route path="/pages/eotp" exact component={EmailOtp} />
                <Route path="/pages/motp" exact component={MobileOtp} />

                <Route
                  path="/pages/patient-signup"
                  exact
                  component={PatientSignup}
                />
                <Route
                  path="/pages/doctor-signup"
                  exact
                  component={DoctorSignup}
                />
                <Route path="/success-signup" exact component={SuccessSignup} />
                <Route path="/signup" exact component={Signup} />

                {/* blog */}
                {/* <ProtectedRoute
                  path="/blog/blog-list"
                  exact
                  component={BlogList}
                />
                <ProtectedRoute
                  path="/blog/blog-grid"
                  exact
                  component={BlogGrid}
                />
                <ProtectedRoute
                  path="/blog/blog-details"
                  exact
                  component={BlogDetails}
                /> */}
                {/* <ProtectedRoute
                  path="/doctor-blog"
                  exact
                  component={Doctorblog}
                />
                <ProtectedRoute
                  path="/blog/doctor-add-blog"
                  exact
                  component={Doctoraddblog}
                />
                <ProtectedRoute
                  path="/blog/doctor-pending-blog"
                  exact
                  component={Doctorpendingblog}
                /> */}
                {/* <ProtectedRoute
                  path="/blog/doctor-edit-blog"
                  exact
                  component={Doctoreditblog}
                /> */}
                {/* pages */}

                <ProtectedRoute
                  path="/patient/search-doctor1"
                  exact
                  component={SearchDoctor}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/search-doctor2"
                  exact
                  component={SearchDoctor2}
                  allowedAccessTypes={[3]}
                />
                <Route path="/pages/component" exact component={Components} />
                <Route path="/pages/blank-page" exact component={BlankPage} />
                <Route path="/pages/calendar" exact component={Calendar} />
                <Route path="/pages/invoice" exact component={Invoice} />
                <Route path="/doctor/invoices" exact component={Invoice} />
                <Route
                  path="/pages/invoice-view"
                  exact
                  component={InvoiceView}
                />
                {/* <Route path="/pages/aboutus" exact component={Aboutus} />
                <Route path="/pages/contactus" exact component={Contactus} />
                <Route path="/pages/comingsoon" exact component={Comingsoon} /> */}
                <Route
                  path="/pages/maintenance"
                  exact
                  component={Maintenance}
                />
                {/* <Route
                  path="/pages/pricing-plan"
                  exact
                  component={PricingPlan}
                /> */}
                <Route path="/pages/error-404" exact component={Error404} />
                <Route path="/pages/error-500" exact component={Error500} />
                {/* <Route path="/pages/faq" exact component={Faq} /> */}
                <Route
                  path="/patient/patientregisterstep-1"
                  exact
                  component={Patientregisterstepone}
                />
                <Route
                  path="/patient/patientregisterstep-2"
                  exact
                  component={Patientregistersteptwo}
                />
                <Route
                  path="/patient/patientregisterstep-5"
                  exac
                  component={Patientregisterstepfive}
                />
                <Route
                  path="/patient/doctor-profile2"
                  exact
                  component={DoctorProfile}
                  allowedAccessTypes={[3]}
                />
                <Route
                  path="/patient/doctor-profile/:id"
                  exact
                  component={DoctorProfileTwo}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/medicalrecords/show/:id"
                  exact
                  component={ShowDetails}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/doctor/medicalrecords/show"
                  exact
                  component={ShowDetails}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/medicalrecords/more/:id"
                  exact
                  component={ShowMore}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/doctor/my-patients"
                  exact
                  component={MyPatient}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/patient/booking1/:id"
                  exact
                  component={Booking}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/reschedule-appointment/:id"
                  exact
                  component={Rescheduling}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/booking2"
                  exact
                  component={Booking2}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/patient-chat/:id"
                  exact
                  component={PatientChat}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/checkout/:id"
                  exact
                  component={Checkout}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/booking-success"
                  exact
                  component={BookingSuccess}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/dashboard"
                  exact
                  component={Dashboard}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/dependent"
                  exact
                  component={PatientDependent}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/accounts"
                  exact
                  component={PatientAccounts}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/orders"
                  exact
                  component={Orders}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/medicalrecords"
                  exact
                  component={MedicalRecords}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/medicaldetails"
                  exact
                  component={MedicalDetails}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/favourites"
                  exact
                  component={Favourties}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/profile"
                  exact
                  component={Profile}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/change-password"
                  exact
                  component={Password}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/doctor/doctor-dashboard"
                  exact
                  component={DoctorDashboard}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/doctor-payment"
                  exact
                  component={DoctorPayment}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/doctor-request"
                  exact
                  component={DoctorRequest}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/doctor-specialities"
                  exact
                  component={DoctorSpecialities}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/social-media"
                  exact
                  component={SocialMedia}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/schedule-timing"
                  exact
                  component={ScheduleTiming}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/available-timing"
                  exact
                  component={AvailableTiming}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/available-timings"
                  exact
                  component={AvailableTimings}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/account"
                  exact
                  component={Accounts}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/doctor-change-password"
                  exact
                  component={DoctorPassword}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/appointments"
                  exact
                  component={Appointments}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/doctor-appointments-grid"
                  exact
                  component={DoctorAppointmentsGrid}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/doctor-appointment-start/:id"
                  exact
                  component={DoctorAppoinmentStart}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/doctor-cancelled-appointment"
                  exact
                  component={DoctorCancelledAppointment}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/doctor-upcoming-appointment/:id"
                  exact
                  component={DoctorUpcomingAppointment}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/approval"
                  exact
                  component={AdminApprovel}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/patient-profile"
                  exact
                  component={PatientProfile}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/add-prescription"
                  exact
                  component={AddPescription}
                />
                <ProtectedRoute
                  path="/add-billing"
                  exact
                  component={AddBilling}
                />
                <ProtectedRoute
                  path="/doctor/profile-setting"
                  exact
                  component={ProfileSetting}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/doctor-experience"
                  exact
                  component={Experience}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/review"
                  exact
                  component={Review}
                  allowedAccessTypes={[2]}
                />
                <Route
                  path="/doctor/doctor-register"
                  exact
                  component={DoctorRegister}
                />
                <Route
                  path="/registerstepone"
                  exact
                  component={Registerstepone}
                />
                <Route
                  path="/register-step-2"
                  exact
                  component={Registersteptwo}
                />
                <Route
                  path="/register-step-3"
                  exact
                  component={Registerstepthree}
                />
                <Route path="/pages/terms" exact component={TermsLogout} />
                <ProtectedRoute path="/pages/terms-and-conditions" exact component={Terms} allowedAccessTypes={[2,3]}/>

                <ProtectedRoute 
                path="/pages/customer-speaks" 
                exact 
                component={CustomerSpeaks} 
                allowedAccessTypes={[2,3]}
                />
                <ProtectedRoute path="/pages/in-the-news" exact component={InTheNews} allowedAccessTypes={[2,3]}/>

                <ProtectedRoute 
                 path="/pages/careers" 
                 exact 
                 component={Careers} 
                 allowedAccessTypes={[2, 3]}
                 />
                <ProtectedRoute path="/pages/contact-us" exact component={Contactus} allowedAccessTypes={[2, 3]}/>
                <ProtectedRoute path="/pages/fees-and-payments" exact component={FeesAndPayments} allowedAccessTypes={[2, 3]}/>
                <ProtectedRoute path="/pages/shipping-delivery" exact component={ShippingAndDelivery} allowedAccessTypes={[2, 3]}/>
                <ProtectedRoute path="/pages/return-refund" exact component={ReturnRefundPolicy} allowedAccessTypes={[2, 3]}/>

                <ProtectedRoute
                  path="/pages/privacy-policy"
                  exact
                  component={Policy}
                  allowedAccessTypes={[2, 3]}
                />
                <Route
                  path="/pages/policy"
                  exact
                  component={PolicyLogout}
                />
                <ProtectedRoute
                  path="/pages/about-us"
                  exact
                  component={AboutUs}
                  allowedAccessTypes={[2, 3]}
                />

                {/* Pharmacy */}
                {/* <ProtectedRoute
                  path="/Pharmacy/Pharmacy-index"
                  exact
                  component={Pharmacy}
                />
                <ProtectedRoute
                  path="/Pharmacy/Pharmacy-details"
                  exact
                  component={pharmacydetail}
                />
                <ProtectedRoute
                  path="/Pharmacy/pharmacy-search"
                  exact
                  component={PharmacySearch}
                /> */}
                {/* <ProtectedRoute
                  path="/Pharmacy/product-all"
                  exact
                  component={Product}
                />
                <ProtectedRoute
                  path="/Pharmacy/product-description"
                  exact
                  component={ProductDescription}
                /> */}
                {/* <ProtectedRoute path="/Pharmacy/cart" exact component={Cart} />
                <ProtectedRoute
                  path="/Pharmacy/product-checkout"
                  exact
                  component={ProductCheckout}
                />
                <ProtectedRoute
                  path="/Pharmacy/payment-success"
                  exact
                  component={PayoutSuccess}
                /> */}
                {/* <ProtectedRoute
                  path="/Pharmacy/pharmacy-register"
                  exact
                  component={Pharmacyregister}
                />
                <ProtectedRoute
                  path="/Pharmacy/pharmacy-registerstep-1"
                  exact
                  component={Pharmacyregisterstepone}
                />
                <ProtectedRoute
                  path="/Pharmacy/pharmacy-registerstep-2"
                  exact
                  component={Pharmacyregistersteptwo}
                /> */}
                {/* <ProtectedRoute
                  path="/Pharmacy/pharmacy-registerstep-3"
                  exact
                  component={Pharmacyregisterstepthree}
                /> */}
                <ProtectedRoute
                  path="/editprescription"
                  exact
                  component={EditPrescription}
                />
                <ProtectedRoute
                  path="/editbilling"
                  exact
                  component={EditBilling}
                />
                <ProtectedRoute
                  path="/patient/map-list"
                  exact
                  component={MapList}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/pages/onboarding-email"
                  exact
                  component={OnboardingEmail}
                />
                <ProtectedRoute
                  path="/pages/onboarding-identity"
                  exact
                  component={OnboardingIdentity}
                />
                <ProtectedRoute
                  path="/pages/onboarding-payments"
                  exact
                  component={OnboardingPayments}
                />
                <ProtectedRoute
                  path="/pages/onboarding-personalize"
                  exact
                  component={OnboardingPersonalize}
                />
                <ProtectedRoute
                  path="/pages/onboarding-preferences"
                  exact
                  component={OnboardingPreferences}
                />
                <ProtectedRoute
                  path="/pages/onboarding-verification"
                  exact
                  component={Onboardingverification}
                />
                <ProtectedRoute
                  path="/pages/patient-email"
                  exact
                  component={PatientOnboardingEmail}
                />
                <ProtectedRoute
                  path="/pages/patient-personalize"
                  exact
                  component={PatientOnboardingPersonalize}
                />
                <ProtectedRoute
                  path="/pages/patient-details"
                  exact
                  component={PatientOnboardingDetails}
                />
                <ProtectedRoute
                  path="/pages/patient-family-details"
                  exact
                  component={PatientFamilyDetails}
                />
                <ProtectedRoute
                  path="/pages/patient-dependant-details"
                  exact
                  component={DependantDetails}
                />
                <ProtectedRoute
                  path="/pages/patient-other-details"
                  exact
                  component={OtherDetails}
                />
                <ProtectedRoute
                  path="/pages/onboarding-email-otp"
                  exact
                  component={OnboardingEmailOtp}
                />
                <ProtectedRoute
                  path="/pages/onboarding-phone"
                  exact
                  component={Onboardingphone}
                />
                <ProtectedRoute
                  path="/pages/onboarding-phone-otp"
                  exact
                  component={Onboardingphoneotp}
                />
                <ProtectedRoute
                  path="/pages/onboarding-password"
                  exact
                  component={Onboardingpassword}
                />
                <ProtectedRoute
                  path="/pages/patient-email-otp"
                  exact
                  component={PatientEmailOtp}
                />
                <ProtectedRoute
                  path="/pages/patient-phone"
                  exact
                  component={PatientPhone}
                />
                <ProtectedRoute
                  path="/pages/patient-phone-otp"
                  exact
                  component={patientphoneotp}
                />
                <ProtectedRoute
                  path="/pages/patient-password"
                  exact
                  component={patientpassword}
                />
                <ProtectedRoute
                  path="/pages/product-healthcare"
                  exact
                  component={Producthealthcare}
                />
                <ProtectedRoute
                  path="/pages/patient-phone-otp"
                  exact
                  component={PhoneOtp}
                />

                {/* <Route path="/consultation" exact component={Consultation} /> */}
                {/* <Route path="/payment" exact component={Payment} /> */}
                {/* <Route path="/bookingsuccess" exact component={Bookingsuccess} /> */}
                {/* <Route path="/patientdetails" exact component={Patientdetails} /> */}
                {/* <Route path="/loginemail" exact component={Loginemail} /> */}
                <ProtectedRoute
                  path="/doctor/education"
                  exact
                  component={Education}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/doctor-awards-settings"
                  exact
                  component={Awards}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/doctor-insurance-settings"
                  exact
                  component={InsuranceSettings}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/doctor-clinics-settings"
                  exact
                  component={Clinic}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/doctor-business-settings"
                  exact
                  component={BusinessSettings}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/doctor-cancelled-appointment-2"
                  exact
                  component={DoctorCancelledAppointment2}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/doctor-appointment-details"
                  exact
                  component={DoctorAppoinmentDetails}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/doctor/doctor-completed-appointment"
                  exact
                  component={CompletedAppointment}
                  allowedAccessTypes={[2]}
                />
                <ProtectedRoute
                  path="/patient/patient-invoice"
                  exact
                  component={PatientInvoice}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/patient-appointments"
                  exact
                  component={PatientAppointments}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/patient-completed-appointment"
                  exact
                  component={CompletedAppoinments}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/patient-cancelled-appointment"
                  exact
                  component={CancelledAppoinments}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/upcoming-appointment/:id"
                  exact
                  component={UpComingAppointment}
                  allowedAccessTypes={[3]}
                />
                <ProtectedRoute
                  path="/patient/appoinment-grid"
                  exact
                  component={AppointmentGrid}
                  allowedAccessTypes={[3]}
                />
                {/* <Route path='/patient/bookapointment' exact component={''}/> */}

                {/* Home routes */}
                {/* <Route path="/" exact component={LoginContainer} /> */}
                <Route
                  path="/email-verification"
                  exact
                  component={EmailVerification}
                />
                <Route path="/" exact component={Home1} />
                <ProtectedRoute path="/home-2" exact component={Home2} />
                <ProtectedRoute path="/home-3" exact component={Home3} />
                <ProtectedRoute path="/home-5" exact component={Home5} />
                <ProtectedRoute path="/home-6" exact component={Home6} />
                <ProtectedRoute path="/home-7" exact component={Home7} />
                <ProtectedRoute path="/home-8" exact component={Home8} />
                <ProtectedRoute path="/home-9" exact component={Home9} />
                <ProtectedRoute path="/home-10" exact component={Home10} />
                <ProtectedRoute path="/home-11" exact component={Home11} />
                <ProtectedRoute path="/home-12" exact component={Home12} />
                <ProtectedRoute path="/home-13" exact component={Home13} />
                <ProtectedRoute path="/home-14" exact component={Home14} />
              </Switch>
            </div>
          )}
        </Router>
        </AdminSettingsProvider>
      </AuthProvider>
    );
  }
  return null;
};

export default AppContainer;
