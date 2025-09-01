import React, { useEffect, useState } from "react";
import Header from "../../header";
import Footer from "../../footer";
import { Link, useLocation, useParams } from "react-router-dom";
import StickyBox from "react-sticky-box";
import DashboardSidebar from "../dashboard/sidebar/sidebar";
import { doctor_15, doctor_thumb_02, doctorprofileimg } from "../../imagepath";
import axios from "../../../../axiosConfig";
const UpComingAppointment = (props) => {
  const [consultantInfo, setConsultantInfo] = useState(null); // Storing consultant data here
  const [doctorLoading, setDoctorLoading] = useState(false); // Loading state for doctor info
  const [doctorError, setDoctorError] = useState(null); // Error state for doctor info

  const { state } = useLocation(); // Retrieve state passed from the previous link
  const userId = useParams(); // Extracting userId from URL params
  const fetchDoctorProfile = async () => {
    setDoctorLoading(true); // Set loading to true
    try {
      console.log("Fetching consultant info for User ID:", userId.id); // Log the userId
      const response = await axios.get(
        `/api/consultant-profile-information/${userId.id}`
      );
      console.log("API Response:", response.data); // Log the API response
  
      const consultant = response.data.consultant;
  
      // Set consultant information
      setConsultantInfo(consultant);
      console.log("Consultant Info (after setting state):", consultant);
  
      setDoctorLoading(false); // Set loading to false when data is fetched
    } catch (err) {
      console.error("API Error:", err); // Log the error
      setDoctorError("Failed to fetch doctor data");
      setDoctorLoading(false); // Set loading to false if an error occurs
    }
  };
  const { appointmentDate, appointmentId, consultantName, appointmentLink } =
    state || {};

  useEffect(() => {
    fetchDoctorProfile(); // Call the fetch function when the component mounts
  }, [userId]); // Re-run the effect if the `id` from the URL changes
  console.log("this is ourdoctorDetails", consultantInfo);

  return (
    <div className="main-wrapper">
      <Header {...props} />
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Patient Appointments</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/patient/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Patient Appointments 
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
            <div className="col-lg-4 col-xl-3 theiaStickySidebar mb-lg-4 mb-xl-0 mb-md-4 mb-4">
              <StickyBox offsetTop={20} offsetBottom={20}>
                <DashboardSidebar />
              </StickyBox>
            </div>

            <div className="col-lg-8 col-xl-9">
              <div className="dashboard-header">
                <div className="header-back">
                  <Link
                    to="/patient/patient-appointments"
                    className="back-arrow"
                  >
                    <i className="fa-solid fa-arrow-left" />
                  </Link>
                  <h3>Appointment Details</h3>
                </div>
              </div>
              <div className="appointment-details-wrap">
                {/* Appointment Detail Card */}
                <div className="appointment-wrap appointment-detail-card">
                  <ul>
                    <li>
                      <div className="patinet-information">
                        <Link to="#">
                          <img
                            src={consultantInfo?.profileImage ? consultantInfo?.profileImage : "/assets/images/doctor-thumb-01.png"}
                            alt="User Image"
                          />
                        </Link>
                        <div className="patient-info">
                          <p>#{consultantInfo?.userId}</p>
                          <h6>
                            <Link to="#">
                              {consultantInfo?.information?.displayName?.startsWith("Dr")
                                ? consultantInfo?.information?.displayName?.startsWith("Dr.")
                                  ? consultantInfo?.information?.displayName
                                  : `Dr. ${consultantInfo?.information?.displayName.slice(3).trim()}`
                                : `Dr. ${consultantInfo?.information?.displayName}`}
                            </Link>
                          </h6>
                          <div className="mail-info-patient">
                            <ul>
                             
                              <li>
                                <i className="fa-solid fa-envelope" />
                                {consultantInfo?.information?.email?.toLowerCase()}
                              </li>
                              <li>
                                <i className="fa-solid fa-phone" />
                                &nbsp;{consultantInfo?.information?.phone}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="appointment-info">
                      <div className="person-info">
                        <p>Type of Appointment</p>
                        <ul className="d-flex apponitment-types">
                          <li>
                            <i className="fa-solid fa-hospital text-green" />
                            Online
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li className="appointment-action">
                      {/* <div className="detail-badge-info">
                        <span className="badge bg-yellow">Upcoming</span>
                      </div> */}
                      {/* <div className="consult-fees">
                        <h6>Consultation Fees : $10</h6>
                      </div> */}
                      <ul>
                        <li>
                          <Link to={`/patient/patient-chat/${consultantInfo?.userId}`} title="Chat with Doctor">
                            <i className="fa-solid fa-comments" />
                          </Link>
                        </li>
                        {/* <li>
                          <Link to="#">
                            <i className="fa-solid fa-xmark" />
                          </Link>
                        </li> */}
                      </ul>
                    </li>
                  </ul>
                  <ul className="detail-card-bottom-info">
                    <li>
                      <h6>Appointment Date &amp; Time</h6>
                      <span>{appointmentDate || "Not Available"}</span>
                    </li>
                    {/* <li>
                      <h6>Clinic Location</h6>
                      <span>Adrian’s Dentistry</span>
                    </li> */}
                    {/* <li>
                      <h6>Location</h6>
                      <span>Newyork, United States</span>
                    </li> */}
                    <li>
                      <h6>Visit Type</h6>
                      <span>Online</span>
                    </li>
                    <li className="appointment-detail-btn">
                      <a
                        href={appointmentLink}
                        target="_blank"
                        className="start-link"
                        title="Join the Appointment Session"
                      >
                        <i className="fa-solid fa-calendar-check me-1" />
                        Attend
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer {...props} />
    </div>
  );
};

export default UpComingAppointment;
