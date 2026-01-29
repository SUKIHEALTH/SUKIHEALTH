import React, { useEffect, useState } from "react";
import DoctorSidebar from "../sidebar";
import Header from "../../header";
import DoctorFooter from "../../common/doctorFooter";
import {
  doctordashboardprofile01,
  doctordashboardprofile02,
  doctordashboardprofile3,
} from "../../imagepath";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "../../../../axiosConfig";

const DoctorUpcomingAppointment = (props) => {
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState(null);

  // Get the location from the router to access the passed state
  const location = useLocation();
  const patientId = useParams();
  const { appointmentLink, appointmentDate, appointmentId, appointmentStatus } = location.state || {};

  useEffect(() => {
    // Fetch patient data from API
    axios
      .get(`/api/patient-profile-information/${patientId.id}`)
      .then((response) => {
        setPatientData(response.data.patient); // Set the patient data to state
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching data");
        setLoading(false);
      });
  }, [patientId.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A"; // Handle missing or invalid date
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age -= 1;
    }
    return age;
  };

  const isWithinTimeWindow = (appointmentDate) => {
    const now = new Date();
    const appDate = new Date(appointmentDate);

    // Check if appointment hasn't passed
    // if (appDate < now) {
    //   return false;
    // }

    // Calculate time difference in minutes
    const timeDiff = (appDate - now) / (1000 * 60);

    // Return true if appointment is within next 30 minutes
    return timeDiff >= -60 && timeDiff <= 60;
  };

  return (
    <div>
      <Header {...props} />
      {/* Breadcrumb */}
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Appointment Detail</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/doctor/doctor-dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Appointment Detail
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}
      {/* Page Content */}
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              {/* Profile Sidebar */}
              <DoctorSidebar />
              {/* /Profile Sidebar */}
            </div>
            <div className="col-lg-8 col-xl-9">
              <div className="dashboard-header">
                <div className="header-back">
                  <Link to="/doctor/appointments" className="back-arrow">
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
                            src={patientData?.profileImage || "/assets/images/doctor-thumb-01.png"}
                            alt="User Image"
                          />
                        </Link>
                        <div className="patient-info">
                          <p>#{appointmentId}</p>
                          <h6>
                            <Link to="#">
                              {patientData?.information?.firstName || "N/A"}{" "}
                              {patientData?.information?.lastName || "N/A"}
                            </Link>
                          </h6>
                          <div className="mail-info-patient">
                            <ul>
                              <li>
                                <i className="fa-solid fa-envelope" />
                                {patientData?.information?.email || "N/A"}
                              </li>
                              <li>
                                <i className="fa-solid fa-phone" />
                                {patientData?.information?.phone || "N/A"}
                              </li>
                              <li>
                                <i className="fa-solid fa-map-marker-alt" />
                                {patientData?.address?.country || "N/A"}
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
                          <i className="fa-solid fa-video text-green" />
                            Online
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li className="appointment-action">
                      {/* <div className="detail-badge-info">
                        <span className="badge bg-grey me-2">New Patient</span>
                        <span className="badge bg-yellow">Upcoming</span>
                      </div> */}
                      {/* <div className="consult-fees">
                        <h6>Consultation Fees : $200</h6>
                      </div> */}
                      <ul>
                        <li>
                          <Link to={`/chat-doctor/${patientId.id}`} title="Chat with patient">
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
                      <span>{appointmentDate}</span>
                    </li>
                    {/* <li>
                      <h6>Clinic Location</h6>
                      <span>Adrian’s Dentistry</span>
                    </li> */}
                    {/* <li>
                      <h6>Location</h6>
                      <span></span>
                    </li> */}
                    <li>
                      <h6>Visit Type</h6>
                      <span>Online</span>
                    </li>
                    <li className="appointment-detail-btn">
                    {isWithinTimeWindow(appointmentDate) ?(
                        <a
                          href={appointmentLink}
                          target="_blank"
                          className="start-link"
                        >
                          <i className="fa-solid fa-calendar-check me-1" />
                          Start now
                        </a>
                    ): (
                      <span
                      style={{
                        padding: "6px 0px",
                        display: "flex",
                        flexDirection: "row",
                        marginTop: "10px",
                        fontWeight: "600",
                        alignItems: "center",
                        color:
                        appointmentStatus.toLowerCase() === "confirmed"
                            ? "#28a745"
                            : appointmentStatus.toLowerCase() === "cancelled"
                            ? "#dc3545"
                            : appointmentStatus.toLowerCase() === "rescheduled"
                            ? "#ffc107"
                            : "#333",
                      }}
                    >
                      <i
                        className="fa-solid fa-calendar-days me-2"
                        style={{
                          color:
                          appointmentStatus.toLowerCase() === "confirmed"
                              ? "#28a745"
                              : appointmentStatus.toLowerCase() === "cancelled"
                              ? "#dc3545"
                              : appointmentStatus.toLowerCase() === "rescheduled"
                              ? "#ffc107"
                              : "#333",
                        }}
                      />
                      {appointmentStatus}
                    </span>
                    

                    )}
                    </li>
                  </ul>
                  <div className="create-appointment-details">
                    <div className="create-details-card">
                      <div className="create-details-card-head">
                        <div className="card-title-text">
                          <h5>Patient Information</h5>
                        </div>
                        <div className="patient-info-box">
                          <div className="row">
                            <div className="col-xl-4 col-md-6">
                              <ul className="info-list">
                                <li>Age / Gender</li>
                                <li>
                                <h6>
        {calculateAge(patientData?.information?.dateOfBirth)} Years old /{" "}
        {patientData?.information?.gender || "N/A"}
      </h6>                                </li>
                              </ul>
                            </div>
                            <div className="col-xl-4 col-md-6">
                              <ul className="info-list">
                                <li>Address</li>
                                <li>
                                  <h6>{patientData?.address?.address || "N/A"}</h6>
                                </li>
                              </ul>
                            </div>
                            <div className="col-xl-4 col-md-6">
                              <ul className="info-list">
                                <li>Blood Group</li>
                                <li>
                                  <h6>{patientData?.healthData?.bloodGroup || "N/A"}</h6>
                                </li>
                              </ul>
                            </div>
                            {/* <div className="col-xl-3 col-md-6">
                              <ul className="info-list">
                                <li>No of Visits</li>
                                <li>
                                  <h6>0</h6>
                                </li>
                              </ul>
                            </div> */}
                          </div>
                        </div>
                      </div>
                      <div className="create-details-card-body">
                        <form>
                          <div className="start-appointment-set">
                            <div className="form-bg-title">
                              <h5>Vitals</h5>
                            </div>
                            <div className="row">
                              {/* Heart Rate */}
                              <div className="col-xl-3 col-md-6">
                                <div className="input-block input-block-new">
                                  <label className="form-label">Heart Rate</label>
                                  <div className="input-text-field">
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={patientData?.healthData?.heartRate || "N/A"}
                                      readOnly
                                    />
                                     <span className="input-group-text">bpm</span> 
                                  </div>
                                </div>
                              </div>
                              {/* Height */}
                              <div className="col-xl-3 col-md-6">
                                <div className="input-block input-block-new">
                                  <label className="form-label">Height</label>
                                  <div className="input-text-field">
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={patientData?.healthData?.height || "N/A"}
                                      readOnly
                                    />
                                    <span className="input-group-text">cm</span>
                                  </div>
                                </div>
                              </div>
                              {/* Weight */}
                              <div className="col-xl-3 col-md-6">
                                <div className="input-block input-block-new">
                                  <label className="form-label">Weight</label>
                                  <div className="input-text-field">
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={patientData?.healthData?.weight || "N/A"}
                                      readOnly
                                    />
                                    <span className="input-group-text">kg</span>
                                  </div>
                                </div>
                              </div>
                              {/* Blood Group */}
                              {/* <div className="col-xl-3 col-md-6">
                                <div className="input-block input-block-new">
                                  <label className="form-label">Blood Group</label>
                                  <div className="input-text-field">
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={patientData?.bloodGroup || "N/A"}
                                      readOnly
                                    />
                                  </div>
                                </div>
                              </div> */}
                              {/* BMI */}
                              <div className="col-xl-3 col-md-6">
                                <div className="input-block input-block-new">
                                  <label className="form-label">BMI</label>
                                  <div className="input-text-field">
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={patientData?.healthData?.bmi || "N/A"}
                                      readOnly
                                    />
                                     <span className="input-group-text">kg/m²</span>
                                  </div>
                                </div>
                              </div>
                              {/* Other fields */}
                              {/* You can add other fields here as needed */}
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Appointment Detail Card */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      <DoctorFooter {...props} />
    </div>
  );
};

export default DoctorUpcomingAppointment;
