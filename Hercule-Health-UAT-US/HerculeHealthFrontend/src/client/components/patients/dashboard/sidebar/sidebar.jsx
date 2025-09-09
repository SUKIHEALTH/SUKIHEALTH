import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { doctordashboardprofile06 } from "../../../imagepath";
import axios from "../../../../../axiosConfig";
import { FaSpinner } from "react-icons/fa";
import { Spinner } from "react-bootstrap";
import { IMG01 } from "../img";
export const DashboardSidebar = () => {
  const [patientData, setPatientData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false); // Image loading state

  const pathnames = window.location.pathname;
  const userId = localStorage.getItem("userData");
   const history = useHistory();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    // Remove any other user-related data if needed
    history.push("/");
    window.location.reload(); // Optional: force reload to clear state
  };

  const fetchPatientProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/patient-profile-information/${userId}`);
      const user = response.data.patient;
      console.log("Patient data fetched:", user);

      setPatientData({
        firstName: user.information.firstName,
        lastName: user.information.lastName,
        email: user.information?.email || "",
        profileImage: user.profileImage || "",
      });

      setLoading(false);
    } catch (err) {
      console.error("Error fetching patient data", err);
      setError("Failed to fetch profile data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientProfile();
  }, [userId]);
  
  useEffect(() => {
    fetchPatientProfile();
  }, []);
  return (
    <>
      {/* Profile Sidebar */}
      <div className="profile-sidebar patient-sidebar ">
        <div className="widget-profile pro-widget-content">
        <div className="profile-info-widget">
        <Link to="/patient/profile" className="booking-doc-img">
  {loading ? (
    <div className="spinner-container">
      <Spinner animation="border" role="status" />
    </div>
  ) : (
    <img
      src={imageLoaded && patientData?.profileImage ? patientData.profileImage : IMG01}
      alt="User Profile"
      onLoad={() => {
        console.log("Image Loaded Successfully");
        setImageLoaded(true);
      }}
      onError={(e) => {
        console.error("Error loading profile image", e);
        e.target.src = "/images/default-profile.png"; // Set fallback image
        setImageLoaded(false);
      }}
      style={{ display: "block" }}
    />
  )}
</Link>

      <div className="profile-det-info">
        <h3>{loading ? "Loading..." : `${patientData?.firstName} ${patientData?.lastName}`}</h3>
      </div>
    </div>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="dashboard-widget">
          <nav className="dashboard-menu">
            <ul>
              <li
                className={
                  pathnames.includes("/patient/dashboard") ? "active" : ""
                }
              >
                <Link to="/patient/dashboard">
                  <i className="fa-solid fa-shapes me-2" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li
                className={
                  pathnames.includes("/patient/patient-appointments") ||
                  pathnames.includes(
                    "/patient/patient-cancelled-appointment"
                  ) ||
                  pathnames.includes(
                    "/patient/patient-cancelled-appointment"
                  ) ||
                  pathnames.includes(
                    "/patient/patient-completed-appointment"
                  ) ||
                  pathnames.includes("/patient/upcoming-appointment")
                    ? "active"
                    : ""
                }
              >
                <Link to="/patient/patient-appointments">
                  <i className="fa-solid fa-calendar-days me-2" />
                  <span>My Appointments</span>
                </Link>
              </li>
              <li
                className={
                  pathnames.includes("/patient/medicalrecords") ? "active" : ""
                }
              >
                <Link to="/patient/medicalrecords">
              <i className="fa-solid fa-file-lines me-2" />
                  <span>Add Medical Records</span>
                </Link>
              </li>
              <li
                className={
                  pathnames.includes("/patient/patient-invoice") ? "active" : ""
                }
              >
                <Link to="/patient/patient-invoice">
                <i className="fa-solid fa-money-bill-1 me-2" />
                  <span>Invoices</span>
                </Link>
              </li>
              <li
                className={
                  pathnames.includes(`/patient/patient-chat/`) ? "active" : ""
                }
              >
                <Link to={`/patient/patient-chat/messages`}>
                  <i className="fa-solid fa-comments me-2" />
                  <span>Message</span>
                  {/* <small className="unread-msg">7</small> */}
                </Link>
              </li>
              <li
                className={
                  pathnames.includes("/patient/profile") ? "active" : ""
                }
              >
                <Link to="/patient/profile">
                  <i className="fa-solid fa-user-pen me-2" />
                  <span>Profile Settings</span>
                </Link>
              </li>
              <li
                className={
                  pathnames.includes("/patient/medicaldetails") ? "active" : ""
                }
              >
                <Link to="/patient/medicaldetails">
                  <i className="fa-solid fa-shield-halved me-2" />
                  <span>Health Details</span>
                </Link>
              </li>
              <li
                className={
                  pathnames.includes("/patient/change-password") ? "active" : ""
                }
              >
                <Link to="/patient/change-password">
                  <i className="fa-solid fa-key me-2" />
                  <span>Change Password</span>
                </Link>
              </li>
              <li>
                <Link to="#" onClick={e => {
                    e.preventDefault();
                    handleLogout();
                  }}>
                  <i className="fa-solid fa-calendar-check me-2" />
                  <span>Logout</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      {/* /Profile Sidebar */}
    </>
  );
};

export default DashboardSidebar;
