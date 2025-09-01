/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
import React, { useEffect, useRef, useState } from "react";
import DoctorSidebar from "../sidebar";
import Header from "../../header";
import {
  doctordashboardclient01,
  doctordashboardclient02,
  doctordashboardprofile01,
  doctordashboardprofile02,
  doctordashboardprofile04,
  doctordashboardprofile05,
  doctordashboardprofile3,
} from "../../imagepath";
import Chart from "react-apexcharts";
import DoctorFooter from "../../common/doctorFooter";
import { Link } from "react-router-dom";
import axios from "../../../../axiosConfig";
import { io } from "socket.io-client";
import baseUrl from "../../../../config/config";

const DoctorDashboard = (props) => {
  const [ConsultantDetails, setconsultantDetails] = useState();
  const [isVerified, setIsVerified] = useState(null); // null = loading, true = verified, false = not verified
  const [ConsultantInfo, setConsultantInfo] = useState([]);
  const [recentPatientInfo, setRecentPatientInfo] = useState([]);
  const [dashboardCounts, setDashboardCounts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([])

  const id = localStorage.getItem("userData");
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(baseUrl); // Create socket instance only once
    }
    const socket = socketRef.current;

    if (id) {
      socket.emit('joinUserRoom', id);
      socket.emit('subscribeToNotifications', id);
    }

    const handleInitialNotifications = (data) => setNotifications(data);
    const handleNewNotification = (notification) =>
      setNotifications((prev) => [...prev, notification]);

    socket.on('initialNotifications', handleInitialNotifications);
    socket.on('newNotification', handleNewNotification);

    return () => {
      socket.off('initialNotifications', handleInitialNotifications);
      socket.off('newNotification', handleNewNotification);
    };
  }, [id]);

  // Handle click prevention for unverified users
  const handleRestrictedClick = (e) => {
    if (!isVerified) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  // Helper function to get safe link destination
  const getSafeLink = (link) => {
    return isVerified ? link : { pathname: "#" };
  };

  // revenue chart
  const chartRef1 = useRef(null);
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const formattedDate = date.toLocaleString("en-GB", options);
    const [datePart, timePart] = formattedDate.split(",");
    return `${datePart} - ${timePart.trim()}`;
  };

  useEffect(() => {
    if (chartRef1.current) {
      const sCol = {
        chart: {
          height: 220,
          type: "bar",
          stacked: true,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "50%",
            endingShape: "rounded",
            borderRadius: "5",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 1,
        },
        series: [
          {
            name: "High",
            color: "#0E82FD",
            data: [50, 40, 15, 45, 35, 48, 65],
          },
        ],
        xaxis: {
          categories: ["M", "T", "W", "T", "F", "S", "S"],
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$ " + val + "k";
            },
          },
        },
      };
    }
  }, []);

  const fetchConsultantInfo = async () => {
    try {
      const response = await axios.get(
        `/api/consultant-dashboard-upcoming-appointment/${id}`
      );
      setConsultantInfo(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching consultant information");
      setLoading(false);
    }
  };

  const fetchRecentPatientInfo = async () => {
    try {
      const response = await axios.get(
        `/api/consultant-dashboard-recent-patients/${id}`
      );
      setRecentPatientInfo(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching consultant information");
      setLoading(false);
    }
  };

  console.log(
    "this is consultant upcoming",
    ConsultantInfo,
    "this is the recent",
    recentPatientInfo
  );

  //appointment chart
  const chartRef = useRef(null);

  useEffect(() => {
    const sCol = {
      chart: {
        height: 220,
        type: "bar",
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "50%",
          endingShape: "rounded",
          borderRadius: "5",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 1,
      },
      series: [
        {
          name: "High",
          color: "#0E82FD",
          data: [40, 20, 30, 60, 90, 40, 110],
        },
      ],
      xaxis: {
        categories: ["M", "T", "W", "T", "F", "S", "S"],
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + "k";
          },
        },
      },
    };

    // Fetch data only after component mounts
    fetchRecentPatientInfo();
    fetchConsultantInfo();
    fetchDashboard();
    fetchDoctorProfile(); // This will set the verification status
    fetchAppointments();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`/api/consultant-dashboard/${id}`);
      console.log("dashboard", response.data);
      setDashboardCounts(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch appointments");
      setLoading(false);
    }
  };

  const fetchDoctorProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/consultant-profile-information/${id}`
      );
      const verificationStatus = response.data.consultant.ConsultantApprovalRequired;
      console.log("this is doctor verification status", verificationStatus);
      setIsVerified(verificationStatus); // true = verified, false = not verified
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch profile data");
      setIsVerified(false); // Default to not verified on error
      setLoading(false);
    }
  };

  // Fetch upcoming appointments when the component mounts
  const fetchAppointments = async () => {
    try {
      const response = await axios.post(
        `/api/get-all-consultant-appointments/${id}`
      );
      setAppointments(response.data.appointments);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch appointments");
      setLoading(false);
    }
  };

  // Show loading while checking verification status
  if (isVerified === null) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header {...props} />
      <div style={{ position: 'relative' }}>
        {/* Breadcrumb */}
        <div className="breadcrumb-bar-two">
          <div className="container">
            <div className="row align-items-center inner-banner">
              <div className="col-md-12 col-12 text-center">
                <h2 className="breadcrumb-title">Doctor Dashboard</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to={getSafeLink("/")} onClick={handleRestrictedClick}>Home</Link>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      Doctor Dashboard
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
        {/* /Breadcrumb */}

        {/* Verification Warning Banner */}
        {!isVerified && (
          <div className="alert alert-warning text-center mb-0" style={{ 
            backgroundColor: "#fff3cd", 
            borderColor: "#ffeaa7", 
            color: "#856404",
            borderRadius: 0,
            border: "none",
            borderBottom: "3px solid #f39c12"
          }}>
            <i className="fa-solid fa-exclamation-triangle me-2"></i>
            <strong>Account Under Review:</strong> Your account is currently being verified by our admin team. 
            You will have full access to all features once verification is complete.
          </div>
        )}

        {/* Page Content */}
        <div className="content" style={{ pointerEvents: !isVerified ? 'none' : 'auto', opacity: !isVerified ? 0.7 : 1 }}>
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-xl-3 theiaStickySidebar">
                <div className="stickybar">
                  {/* Profile Sidebar */}
                  <DoctorSidebar />
                  {/* /Profile Sidebar */}
                </div>
              </div>
              <div className="col-lg-8 col-xl-9">
                <div className="row">
                  <div className="col-xl-4 d-flex">
                    <div className="dashboard-box-col w-100 pt-4 pt-xl-0 pt-lg-0">
                      <div onClick={handleRestrictedClick} title="Total number of unique patients consulted" style={{ cursor: isVerified ? 'pointer' : 'not-allowed' }}>
                        <div className="dashboard-widget-box">
                          <div className="dashboard-content-info">
                            <h6>Total Patients</h6>
                            <h4>{dashboardCounts.totalPatients}</h4>
                          </div>
                          <div className="dashboard-widget-icon">
                            <span className="dash-icon-box">
                              <i className="fa-solid fa-user-injured" />
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div onClick={handleRestrictedClick} title="Number of patients who had an appointment today" style={{ cursor: isVerified ? 'pointer' : 'not-allowed' }}>
                        <div className="dashboard-widget-box">
                          <div className="dashboard-content-info">
                            <h6>Patients Today</h6>
                            <h4>{dashboardCounts.patientsToday}</h4>
                          </div>
                          <div className="dashboard-widget-icon">
                            <span className="dash-icon-box">
                              <i className="fa-solid fa-user-clock" />
                            </span>
                          </div>
                        </div>
                      </div>

                      <div onClick={handleRestrictedClick} title="Total number of appointments scheduled for today, including completed, upcoming, and canceled." style={{ cursor: isVerified ? 'pointer' : 'not-allowed' }}>
                        <div className="dashboard-widget-box">
                          <div className="dashboard-content-info">
                            <h6>Appointments Today</h6>
                            <h4>{dashboardCounts.appointmentsToday}</h4>
                          </div>
                          <div className="dashboard-widget-icon">
                            <span className="dash-icon-box">
                              <i className="fa-solid fa-calendar-days" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-xl-8 d-flex">
                    <div className="dashboard-card w-100">
                      <div onClick={handleRestrictedClick} title="All appointments that occurred in the past and scheduled for the future." style={{ cursor: isVerified ? 'pointer' : 'not-allowed' }}>
                        <div className="dashboard-card-head">
                          <div className="header-title">
                            <h5>Appointments Overview</h5>
                          </div>
                        </div>
                        <div className="dashboard-card-body">
                          <div className="table-responsive">
                            <table className="table dashboard-table">
                              <tbody>
                                {appointments && appointments.length > 0 ? (
                                  appointments.map((item, index) => (
                                    <tr key={index}>
                                      <td>
                                        <div className="patient-info-profile">
                                          <Link
                                            to={getSafeLink("/doctor/appointments")}
                                            className="table-avatar"
                                            onClick={handleRestrictedClick}
                                          >
                                            <img
                                              style={{objectFit: "cover"}}
                                              src={
                                                item?.patientDetails?.profileImage ? 
                                                item?.patientDetails?.profileImage : 
                                                "/assets/images/doctor-thumb-01.png"
                                              }
                                              alt="Img"
                                            />
                                          </Link>
                                          <div className="patient-name-info">
                                            <span>#{item.appointmentId}</span>
                                            <h5>
                                              <Link 
                                                to={getSafeLink("/doctor/appointments")}
                                                onClick={handleRestrictedClick}
                                              >
                                                {item.patientDetails.information.firstName}{" "}
                                                {item.patientDetails.information.lastName}
                                              </Link>
                                            </h5>
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="appointment-date-created">
                                          <h6>{formatDate(item.appointmentDate)}</h6>
                                          <span
                                            style={{
                                              padding: "5px 10px",
                                              borderRadius: "4px",
                                              fontWeight: "600",
                                              fontSize: "12px",
                                              textTransform: "capitalize",
                                              backgroundColor:
                                                item.status?.toLowerCase() === "cancelled"
                                                  ? "#ff4d4f"
                                                  : item.status?.toLowerCase() === "rescheduled"
                                                  ? "#faad14"
                                                  : item.status?.toLowerCase() === "confirm"
                                                  ? "#52c41a"
                                                  : "#d9d9d9",
                                              color:
                                                item.status?.toLowerCase() === "cancelled" ||
                                                item.status?.toLowerCase() === "rescheduled" ||
                                                item.status?.toLowerCase() === "confirm"
                                                  ? "#fff"
                                                  : "#333",
                                            }}
                                          >
                                            {item.status}
                                          </span>
                                        </div>
                                      </td>
                                      <td></td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="3" className="text-center">
                                      <h6>No appointments</h6>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-7 d-flex">
                    <div className="dashboard-main-col w-100">
                      {ConsultantInfo?.appointmentId ? (
                        <div className="upcoming-appointment-card">
                          <div className="title-card">
                            <h5>Upcoming Appointment</h5>
                          </div>
                          <div className="upcoming-patient-info">
                            <div className="info-details">
                              <span className="img-avatar">
                                <img
                                  src={
                                    ConsultantInfo?.patientDetails?.profileImage ? 
                                    ConsultantInfo?.patientDetails?.profileImage : 
                                    "/assets/images/doctor-thumb-01.png"
                                  }
                                  style={{ objectFit: "cover" }}
                                  alt="Img"
                                />
                              </span>
                              <div className="name-info">
                                <span>#{ConsultantInfo?.appointmentId}</span>
                                <h6>
                                  {ConsultantInfo?.patientDetails?.information?.firstName}{" "}
                                  {ConsultantInfo?.patientDetails?.information?.lastName}
                                </h6>
                              </div>
                            </div>
                            <div className="date-details">
                              <h6>{formatDate(ConsultantInfo?.appointmentDate)}</h6>
                            </div>
                          </div>
                          <div className="appointment-card-footer">
                            <h5>
                              <i className="fa-solid fa-video" />
                              Video Appointment
                            </h5>
                            <div className="btn-appointments">
                              <Link 
                                to={getSafeLink(`/chat-doctor/${ConsultantInfo.patientId}`)} 
                                className="btn"
                                onClick={handleRestrictedClick}
                              >
                                Chat Now
                              </Link>

                              {ConsultantInfo.status?.toLowerCase() !== 'cancelled' ? (
                                <Link
                                  to={isVerified ? {
                                    pathname: `/doctor/doctor-upcoming-appointment/${ConsultantInfo.patientId}`,
                                    state: {
                                      appointmentId: ConsultantInfo.appointmentId,
                                      appointmentDate: formatDate(ConsultantInfo.appointmentDate),
                                      appointmentLink: ConsultantInfo.appointmentLink,
                                      appointmentStatus: ConsultantInfo.status,
                                    },
                                  } : getSafeLink("#")}
                                  className="btn"
                                  onClick={handleRestrictedClick}
                                >
                                  Start Appointment
                                </Link>
                              ) : ( 
                                <span
                                  style={{
                                    color: "#ff4d4f",
                                    fontWeight: "600",
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px 14px",
                                    border: "1px solid #ff4d4f",
                                    borderRadius: "5px",
                                    marginLeft: "10px",
                                  }}
                                >
                                  <i className="fa-solid fa-circle-xmark me-2" />
                                  {ConsultantInfo.status}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="upcoming-appointment-card no-appointment-card d-flex justify-content-center align-items-center"
                          style={{
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "20px",
                            height: "90%",
                            textAlign: "center",
                          }}
                        >
                          <h5>No upcoming appointments</h5>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-xl-5 d-flex">
                    <div className="dashboard-card w-100">
                      <div onClick={handleRestrictedClick} title="Patients who had an appointment in the last days" style={{ cursor: isVerified ? 'pointer' : 'not-allowed' }}>
                        <div className="dashboard-card-head">
                          <div className="header-title">
                            <h5>Recent Patients</h5>
                          </div>
                          <div className="card-view-link">
                            <Link to={getSafeLink("/doctor/my-patients")} onClick={handleRestrictedClick}>View All</Link>
                          </div>
                        </div>
                        <div className="dashboard-card-body">
                          {recentPatientInfo.length > 0 ? (
                            <div className="d-flex recent-patient-grid-boxes">
                              {recentPatientInfo.map((item, index) => (
                                <div
                                  className="recent-patient-grid"
                                  key={item.patientId || index}
                                >
                                  <Link
                                    to={getSafeLink("#")}
                                    className="patient-img"
                                    onClick={handleRestrictedClick}
                                  >
                                    <img
                                      src={
                                        item.patientImage ? 
                                        item.patientImage : 
                                        "/assets/images/doctor-thumb-01.png"
                                      }
                                      alt="Img"
                                    />
                                  </Link>
                                  <h5>
                                    <Link to={getSafeLink("#")} onClick={handleRestrictedClick}>
                                      {item.patientName || "Adrian Marshall"}
                                    </Link>
                                  </h5>
                                  <span>
                                    Patient ID :&nbsp;
                                    {item.patientId || `P${index + 1}`}
                                  </span>
                                  <div className="date-info"></div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="no-patients">
                              <p>No recent patients</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-xl-12 d-flex">
                    <div className="dashboard-card w-100">
                      <div className="dashboard-card-head">
                        <div className="header-title">
                          <h5>Notifications</h5>
                        </div>
                      </div>
                      <div className="dashboard-card-body">
                        <div className="table-responsive">
                          <table className="table dashboard-table">
                            <tbody>
                              {notifications?.length === 0 ? (
                                <tr>
                                  <td colSpan="3" className="text-center">
                                    <div className="table-noti-info">
                                      <div className="table-noti-icon color-gray">
                                        <i className="fa-solid fa-bell-slash" />
                                      </div>
                                      <div className="table-noti-message">
                                        <h6>No Notifications Found</h6>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ) : (
                                notifications.map((notification, index) => (
                                  <tr key={notification._id || index}>
                                    <td>
                                      <div className="table-noti-info">
                                        <div
                                          className={`table-noti-icon ${
                                            notification.type === "Appointment"
                                              ? "color-violet"
                                              : notification.type === "LabResultRequest"
                                              ? "color-red"
                                              : "color-blue"
                                          }`}
                                        >
                                          <i
                                            className={`fa-solid ${
                                              notification.type === "Appointment"
                                                ? "fa-calendar-check"
                                                : notification.type === "LabResultRequest"
                                                ? "fa-flask"
                                                : "fa-bell"
                                            }`}
                                          />
                                        </div>
                                        <div className="table-noti-message">
                                          <h6 style={{ fontSize: "0.85rem", fontStyle: "italic" }}>
                                            <Link to={getSafeLink("#")} onClick={handleRestrictedClick}>
                                              {notification.message}
                                            </Link>
                                          </h6>
                                          <span 
                                            style={{
                                              fontSize: "0.65rem",
                                              display: "block",
                                              marginTop: "0px",
                                            }} 
                                            className="message-time"
                                          >
                                            {new Date(notification.createdAt).toLocaleString()}
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
        <DoctorFooter {...props} />

        {/* Verification Overlay - Only show if not verified */}
        {!isVerified && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              zIndex: 9999,
              pointerEvents: "all",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                textAlign: "center",
                maxWidth: "400px",
                margin: "20px",
              }}
            >
              <div style={{ fontSize: "48px", color: "#f39c12", marginBottom: "20px" }}>
                <i className="fa-solid fa-hourglass-half"></i>
              </div>
              <h4 style={{ color: "#333", marginBottom: "15px" }}>Account Under Review</h4>
              <p style={{ color: "#666", lineHeight: "1.6" }}>
                Your account is currently being verified by our admin team. 
                You will receive full access to all dashboard features once verification is complete.
              </p>
              {/* <p style={{ color: "#999", fontSize: "14px", marginTop: "15px" }}>
                This process typically takes 24-48 hours.
              </p> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;