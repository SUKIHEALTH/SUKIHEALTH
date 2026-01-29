import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import IMG01 from "../../../assets/images/patient2.jpg";
import Header from "../../header";
import DoctorFooter from "../../common/doctorFooter/index.jsx";
import StickyBox from "react-sticky-box";
import axios from "../../../../axiosConfig";
import googleMeet from "../../../assets/icons/meet/googlemeet.png";
import teams from "../../../assets/icons/meet/teams.png";
import { useAdminSettings } from "../../../../context/AdminSettingsContext";

const Checkout = (props) => {
  const [consultantInfo, setConsultantInfo] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMeet, setSelectedMeet] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const { id } = useParams();
  const selectedSlot = JSON.parse(localStorage.getItem("selectedSlot")); 
  const appointmentType = localStorage.getItem("selectedMeet");
  const [adminSettings, setAdminSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState(null);
  const history = useHistory();
  // const { settings } = useAdminSettings()
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("/api/get-admin-settings");
        setAdminSettings(response.data.setting);
      } catch (err) {
        setSettingsError("Failed to fetch admin settings");
      } finally {
        setSettingsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const formatDateTime = (slot) => {
    const dateObj = new Date(slot.time);
    const formattedDate = new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: userTimeZone, // Use the user's local time zone
    }).format(dateObj);
    const formattedTime = new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: userTimeZone, // Use the user's local time zone
    }).format(dateObj);
    return {
      formattedDate,
      formattedTime,
      day: slot.day,
    };
  };
  const fetchPatientInfo = async () => {
    try {
      // Replace with the correct patient API endpoint and patient ID
      const patientId = localStorage.getItem("userData");
      const response = await axios.get(
        `/api/patient-profile-information/${patientId}`
      );
      setPatientInfo(response.data);
    } catch (error) {
      console.error("Error fetching patient information:", error);
    }
  };
  console.log("this is patient info", patientInfo, consultantInfo);

  const formattedDateTime = selectedSlot
  ? formatDateTime(selectedSlot)
  : { formattedDate: "", formattedTime: "", day: "" };

  useEffect(() => {
    const fetchConsultantInfo = async () => {
      try {
        const response = await axios.get(
          `/api/consultant-profile-information/${id}`
        );
        setConsultantInfo(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching consultant information");
        setLoading(false);
      }
    };

    fetchConsultantInfo();
    fetchPatientInfo();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const { name, location, consultingFee, bookingFee, videoCallFee } =
    consultantInfo || {};

    const formattedDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
  
      return `${year}-${month}-${day}`;
    };
const handleProceed = async (e) => {
  e.preventDefault();
  setIsProcessing(true); // Disable button

  const patientEmail = patientInfo?.patient?.information?.email;
  const consultantEmail =
    consultantInfo?.consultant?.information?.email ||
    "consultant@example.com";
  const date = formattedDate(formattedDateTime.formattedDate);
  const time = formattedDateTime.formattedTime;
  const timeZone = userTimeZone;

  // Store appointment details in localStorage before API call
  const appointmentDetails = {
    date,
    time,
    timeZone,
    appointmentType: selectedMeet || appointmentType, // Use selected meet or fallback to stored value
    patientEmail,
    consultantEmail,
    consultantId: consultantInfo?.consultant?.userId,
    patientId: patientInfo?.patient?.userId
  };
  
  localStorage.setItem("appointmentDetails", JSON.stringify(appointmentDetails));

  try {
    // Step 1: Create appointment
    const appointmentResponse = await axios.post("/api/create-appoinment", {
      patientId: patientInfo?.patient?.userId,
      consultantId: consultantInfo?.consultant?.userId,
      date,
      time,
      status: "confirmed",
      patientEmail,
      consultantEmail,
      timeZone: userTimeZone,
      appointmentType: selectedMeet || appointmentType,
    });

    console.log("Appointment created:", appointmentResponse);

    if (appointmentResponse.status === 201) {
      const { appointmentId, consultantId, patientId } =
        appointmentResponse.data.data;
      
      // Step 2: Make booking payment call
      const paymentResponse = await axios.post(
        "/api/booking-payment/create",
        {
          amount: totalAmount,
          currency: "EUR",
          appointmentId,
          consultantId,
          patientId,
        }
      );

      console.log("Booking payment response:", paymentResponse);

      if (paymentResponse.status === 200) {
        const paymentUrl = paymentResponse.data.paymentUrl;
        if (paymentUrl) {
          // Redirect the user to the payment URL
          window.location.href = paymentUrl;
        } else {
          setError("Payment URL not found in the response.");
        }
      } else {
        setError("Error processing payment. Please try again.");
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      setError(error.response.data.message);
    } else {
      console.error("Error during booking or payment:", error);
      setError(
        "Error creating the appointment or processing payment. Please try again."
      );
    }
  } finally {
    setIsProcessing(false);
  }
};
  const handleMeetChange = (e) => {
    const selectedMeetValue = e.target.value;
    setSelectedMeet(selectedMeetValue); // Update state with the selected value
    localStorage.setItem("selectedMeet", selectedMeetValue); // Store the selected meet in localStorage
  };

  const handleTermsChange = (e) => {
    setIsTermsAccepted(e.target.checked);
  };

  const appointmentFee = Number(adminSettings?.appointmentFee || 0);
const taxPercentage = Number(adminSettings?.taxPercentage || 0); // e.g. 18 for 18%
const serviceCharge = Number(adminSettings?.serviceCharge || 0);

const taxAmount = (appointmentFee * taxPercentage) / 100;
const totalAmount = appointmentFee + taxAmount + serviceCharge;
  return (
    <div>
      <Header {...props} />
      {/* Breadcrumb */}
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Checkout</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/patient/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Checkout
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-md-7 col-lg-8">
              <div className="card">
                <div className="card-body">
                  <form>
                    {/* Payment Method */}
                    <div className="payment-widget">
                      <h4 className="card-title fw-bold p-4">
                        Select Meeting Type
                      </h4>

                      <div className="d-flex w-100 gap-5">
                        <div className="text-start ">
                          {" "}
                          <label className="payment-radio credit-card-option">
                            <input
                              type="radio"
                              value={"teamsMeet"}
                              name="meet"
                              checked={selectedMeet === "teamsMeet"}
                              onChange={handleMeetChange}
                            />
                            <span className="checkmark" />
                            <img
                              width={"25px"}
                              height={"25px"}
                              src={teams}
                              alt="teams"
                            />
                            Teams
                          </label>
                        </div>
                        <div className="text-end">
                          {" "}
                          <label className="payment-radio credit-card-option">
                            <input
                              type="radio"
                              value={"googleMeet"}
                              name="meet"
                              checked={selectedMeet === "googleMeet"}
                              onChange={handleMeetChange}
                            />
                            <span className="checkmark" />
                            <img
                              src={googleMeet}
                              width={"25px"}
                              height={"25px"}
                              alt="gmeet"
                            />
                            Googlemeet
                          </label>
                        </div>
                      </div>
                      <hr />
                      <div className="terms-accept">
                        <div className="custom-checkbox">
                          <input
                            type="checkbox"
                            id="terms_accept"
                            required
                            checked={isTermsAccepted}
                            onChange={handleTermsChange}
                          />{" "}&nbsp;
                          <label htmlFor="terms_accept">
                            I have read and accept{" "}
                            <Link to="#">Terms &amp; Conditions</Link>
                          </label>
                        </div>
                      </div>

                      <div className="submit-section mt-4">
                        <button
                          style={{ backgroundColor: "#008080", color: "#fff" }}
                          type="submit"
                          onClick={handleProceed}
                          className="btn submit-btn"
                          disabled={!selectedMeet || !isTermsAccepted || isProcessing}
                        >
                          {isProcessing ? "Processing..." : "Confirm and Pay"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-md-5 col-lg-4 theiaStickySidebar">
              <StickyBox offsetTop={20} offsetBottom={20}>
                <div className="card booking-card">
                  <div className="card-header">
                    <h4 className="card-title">Booking Summary</h4>
                  </div>
                  <div className="card-body">
                    <div className="booking-doc-info">
                      <Link
                        to="/patient/doctor-profile"
                        className="booking-doc-img"
                      >
                        <img
                          src={
                            consultantInfo?.consultant?.profileImage || "/assets/images/doctor-thumb-01.png"
                          }
                          alt="Consultant"
                        />
                      </Link>
                      <div className="booking-info">
                        <h4>
                          <Link to="/patient/doctor-profile">
                            {consultantInfo?.consultant?.information
                              ?.displayName || "Dr. Unknown"}
                          </Link>
                        </h4>
                        <div className="clinic-details">
                          <p className="doc-location">
                            <i className="fas fa-map-marker-alt" />{" "}
                            {consultantInfo?.consultant?.information?.city
                              ? `${consultantInfo.consultant.information.city}, `
                              : ""}
                            {consultantInfo?.consultant?.information?.location || ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="booking-summary">
                      <div className="booking-item-wrap">
                        <ul className="booking-date">
                          <li>
                            Date:&nbsp;<span>{formattedDateTime.formattedDate}</span>
                          </li> &nbsp;
                          <li>
                            Time:&nbsp;<span>{formattedDateTime.formattedTime}</span>
                          </li>
                        </ul>
                        <ul className="booking-fee">
                          <li>
                            Consulting Fee:{" "}
                            <span>
                              {settingsLoading
                                ? "Loading..."
                                : settingsError
                                  ? "N/A"
                                  : `€${appointmentFee.toFixed(2)}`}
                            </span>
                          </li>
                          {/* Only show Service Charge if > 0 */}
                          {serviceCharge > 0 && (
                            <li>
                              Service Charge:{" "}
                              <span>
                                {settingsLoading
                                  ? "Loading..."
                                  : settingsError
                                    ? "N/A"
                                    : `€${serviceCharge.toFixed(2)}`}
                              </span>
                            </li>
                          )}
                          {taxAmount > 0 && (
                            <li>
                              Tax ({taxPercentage}%):{" "}
                              <span>
                                {settingsLoading
                                  ? "Loading..."
                                  : settingsError
                                    ? "N/A"
                                    : `€${taxAmount.toFixed(2)}`}
                              </span>
                            </li>
                          )}
                        </ul>
                        <div className="booking-total">
                          <ul className="booking-total-list">
                            <li>
                              Total{" "}
                              <span className="total-cost">
                                €
                                {settingsLoading
                                  ? "Loading..."
                                  : settingsError
                                    ? "00"
                                    : totalAmount.toFixed(2)}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </StickyBox>
            </div>
          </div>
        </div>
      </div>

      <DoctorFooter {...props} />
    </div>
  );
};

export default Checkout;

