/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardSidebar } from "./sidebar/sidebar.jsx";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Footer from "../../footer";
import Header from "../../header.jsx";
import DoctorFooter from "../../common/doctorFooter/index.jsx";
import {
  doctor_14,
  doctor_15,
  doctor_17,
  doctor_thumb_01,
  doctor_thumb_03,
  doctor_thumb_05,
  doctor_thumb_07,
  doctor_thumb_08,
  doctor_thumb_09,
  doctor_thumb_13,
  doctor_thumb_21,
  doctordashboardprofile06,
  doctordashboardprofile07,
  doctordashboardprofile08,
  doctorprofileimg,
  doctorthumb02,
  doctorthumb11,
  patient20,
  patient21,
} from "../../imagepath.jsx";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "react-circular-progressbar/dist/styles.css";
import axios from "../../../../axiosConfig.js";
import BMIGauge from "./BMIGauge .jsx";
import { io } from "socket.io-client";
import baseUrl from "../../../../config/config.js";
import { IMG01 } from "./img.jsx";

const Dashboard = (props) => {
  const TextContent = () => <p>Last Visit 25 Mar 2024</p>;
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [animate, setAnimate] = useState(true);

  const [count, setCount] = useState(1, 2, 3, 4);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [patientInfo, setPatientInfo] = useState();
  const [patientHealthData, setPatientHealthData] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState();
  const [loadingIncoming, setLoadingIncoming] = useState(true);
  const [notifications, setNotifications] = useState([])
  const userId = localStorage.getItem("userData");
  console.log("hello", userId);

  const socketRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(baseUrl);
    }
    const socket = socketRef.current;

    if (userId) {
      socket.emit('joinUserRoom', userId);
      socket.emit('subscribeToNotifications', userId);
    }

    const handleInitialNotifications = (data) => {
      setNotifications(data);
    };

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [...prev, notification]);
    };

    socket.on('initialNotifications', handleInitialNotifications);
    socket.on('newNotification', handleNewNotification);

    return () => {
      socket.off('initialNotifications', handleInitialNotifications);
      socket.off('newNotification', handleNewNotification);
    };
  }, [userId]);


  useEffect(() => {
    if (chartRef.current) {
      const options = {
        series: [
          {
            data: [140, 100, 180, 130, 100, 130],
          },
        ],
        chart: {
          height: 300,
          type: "bar",
          events: {
            click: function (chart, w, e) {
              // Handle click event
            },
          },
        },
        fill: {
          colors: ["#E8F1FF"],
        },
        plotOptions: {
          bar: {
            columnWidth: "45%",
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        xaxis: {
          categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        },
        crosshairs: {
          show: false,
        },
      };

      const chart = new ApexCharts(chartRef.current, options);
      chart.render();

      // Cleanup function
      return () => {
        chart.destroy();
      };
    }
    fetchPastAppointments();
  }, []);

  const [options1, setOptions1] = useState(null); // Initialize options1 as null

  const chartContainerRef = useRef(null);

  useEffect(() => {
    const options = {
      series: [
        { data: [90, 60, 30, 60, 90, 70, 70] },
        { data: [110, 90, 40, 120, 130, 130, 130] },
      ],
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      fill: {
        opacity: 1,
        colors: ["#F1F5F9"],
      },
      states: {
        hover: {
          color: "#00008B",
        },
      },
    };

    setOptions1(options); // Set options1 state

    if (chartContainerRef.current) {
      const chart = new ApexCharts(chartContainerRef.current, options);
      chart.render();
    }

    return () => {
      // Cleanup code if needed
    };
  }, []);

  const specialitysettings = {
    items: 3,
    loop: true,
    margin: 15,
    dots: false,
    nav: true,
    navContainer: ".slide-nav-patient",
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],

    autoplay: false,
    infinite: "true",

    slidestoscroll: 1,
    rtl: "true",
    rows: 1,
    responsive: {
      0: {
        items: 1,
      },
      500: {
        items: 1,
      },
      575: {
        items: 2,
      },
      768: {
        items: 2,
      },
      1000: {
        items: 3,
      },
      1300: {
        items: 5,
      },
    },
  };
  const specialitysettings1 = {
    items: 1,
    loop: true,
    margin: 25,
    dots: false,
    nav: true,
    navContainer: ".slide-nav-1",
    navText: [
      '<i class="fas fa-chevron-left custom-arrow"></i>',
      '<i class="fas fa-chevron-right custom-arrow"></i>',
    ],

    autoplay: false,
    infinite: "true",

    slidestoscroll: 1,
    rtl: "true",
    rows: 1,
    responsive: {
      0: {
        items: 1,
      },
      500: {
        items: 1,
      },
      575: {
        items: 1,
      },
      768: {
        items: 1,
      },
      1000: {
        items: 1,
      },
      1300: {
        items: 1,
      },
    },
  };
  const formatDate = (isoDate, showTime = true) => {
    const date = new Date(isoDate);

    // Format the date to show only day, month, and year
    const options = {
      year: "numeric", // Ensure the year is included
      month: "short", // Abbreviated month (e.g., Jan, Feb)
      day: "2-digit", // Two-digit day (e.g., 22)
    };
    const formattedDate = date.toLocaleDateString("en-GB", options);

    // If showTime is true, append the time, else return the date only
    if (showTime) {
      const timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // AM/PM format
      };

      // Get the formatted time as "11:00 AM"
      const formattedTime = date.toLocaleTimeString("en-GB", timeOptions);

      // Return the combined formatted date and time
      return `${formattedDate} - ${formattedTime}`;
    }

    // Return only the formatted date if showTime is false
    return formattedDate;
  };
  const circleRef = useRef(null);
  // Fetch past appointments
  useEffect(() => {}, []);
  const fetchPastAppointments = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get(
        `/api/patient-dashboard-past-appoinment/${userId}`,
        {}
      );

      // Assuming the API returns an array of past appointments
      setPastAppointments(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch past appointments");
      setLoading(false);
      console.error("Appointment fetch error:", err);
    }
  };
  // Fetch incoming appointments
  const fetchUpcomingAppointments = async () => {
    try {
      const response = await axios.get(
        `/api/patient-dashboard-upcoming-appoinments/${userId}`
      );
      setUpcomingAppointments(response.data);
      setLoadingIncoming(false);
      // console.log('this is upcomingAppointments',upcomingAppointments);
    } catch (err) {
      setError("Failed to fetch incoming appointments");
      setLoadingIncoming(false);
      console.error("Incoming appointments fetch error:", err);
    }
  };
  console.log("this is upcomingAppointments", upcomingAppointments);
  console.log("this is apointment details 2", pastAppointments);
  console.log("this is patient details ", patientInfo);

  useEffect(() => {
    fetchUpcomingAppointments();
    fetchPastAppointments();
    fetchPatientInfo();
  }, []);
  const fetchPatientInfo = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get(
        `/api/patient-profile-information/${userId}`
      );

      // Assuming the API returns an array of past appointments
      const data = response.data;
      setPatientHealthData(data.patient.healthData);
      setPatientInfo(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch past appointments");
      setLoading(false);
      console.error("Appointment fetch error:", err);
    }
  };

  const isWithinTimeWindow = (appointmentDate) => {
    const now = new Date();
    const appDate = new Date(appointmentDate);

    // Calculate time difference in minutes
    const timeDiff = (appDate - now) / (1000 * 60);

    // Return true if appointment is within next 30 minutes
    return timeDiff >= -60 && timeDiff <= 60;
  };

  console.log("this is the healthdata", patientHealthData);

  return (
    <>
      <Header {...props} />
      {/* Breadcrumb */}
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Patient Dashboard</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="#">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Patient Dashboard
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
            {/* Profile Sidebar */}
            <div className="col-lg-4 col-xl-3 theiaStickySidebar mb-lg-4 mb-xl-0 mb-md-4 mb-4">
              <div className="stickybar">
                {/* Profile Sidebar */}
                <DashboardSidebar />
                {/* /Profile Sidebar */}
              </div>
            </div>
            {/* / Profile Sidebar */}
            <div className="col-lg-8 col-xl-9">
              <div className="dashboard-header">
                <h3>Dashboard</h3>
              </div>
              <div className="row">
                <div className="col-xl-8 d-flex">
                  <div className="dashboard-card w-100" style={{ height: "420px"}}>
                    <div className="dashboard-card-head">
                      <div className="header-title">
                        <h5>Health Details</h5>
                      </div>
                      {/* <div className="dropdown header-dropdown">
                        <Link className="" to="#">
                          <img
                            src={patientInfo?.patient?.profileImage}
                            className="avatar dropdown-avatar"
                            alt="Img"
                          />
                          {patientInfo?.patient?.information.firstName}{" "}
                          {patientInfo?.patient?.information.lastName}
                        </Link>
                      </div> */}
                    </div>
                    <div className="dashboard-card-body">
                      <div className="row">
                        <div className="col-sm-7">
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="health-records icon-orange">
                                <span>
                                  <i className="fa-solid fa-heart" />
                                  Heart Rate
                                </span>
                                <h3>
                                  {patientHealthData?.heartRate
                                    ? patientHealthData.heartRate
                                    : "00"}{" "}
                                  bpm
                                </h3>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="health-records icon-amber">
                                <span>
                                  <i className="fa-solid fa-weight-hanging" />
                                  Weight
                                </span>
                                <h3>
                                  {patientHealthData?.weight
                                    ? patientHealthData.weight
                                    : "00"}{" "}
                                  kg
                                </h3>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="health-records icon-dark-blue">
                                <span>
                                  <i className="fa-solid fa-ruler-vertical" />
                                  Height
                                </span>
                                <h3>
                                  {patientHealthData?.height
                                    ? patientHealthData.height
                                    : "00"}{" "}
                                  cm
                                </h3>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="health-records icon-blue">
                                <span>
                                  <i className="fa-solid fa-syringe icon-red" />
                                  Blood Group
                                </span>
                                <h3>
                                  {patientHealthData?.bloodGroup
                                    ? patientHealthData.bloodGroup
                                    : "--"}
                                </h3>
                              </div>
                            </div>
                            <div className="col-lg-9">
                              <div className="health-records icon-purple">
                                <span>
                                  <i className="fa-solid fa-heart-pulse" />
                                  BMI{" "}
                                </span>
                                <h3>
                                  {patientHealthData?.bmi
                                    ? patientHealthData.bmi
                                    : "00"}{" "}
                                  kg/m²
                                </h3>
                                <div className="circle-bar circle-bar3 report-chart">
                                  <div
                                    className="circle-bar3"
                                    ref={circleRef}
                                    data-animate="false"
                                    data-percent={patientHealthData?.bmi || 0}
                                  ></div>
                                </div>
                                {/* <span className="health-percentage">
                                  Your health is 95% Normal
                                </span> */}
                              </div>
                            </div>
                            <div className="col-lg-3">
                              {/* Placeholder for other content */}
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-5">
                          <div className="chart-over-all-report">
                            <h5>Overall Report</h5>
                            <BMIGauge bmi={patientHealthData?.bmi || 22} />{" "}
                            {/* Pass BMI value */}
                            <Link
                              to="/patient/medicaldetails"
                              className="btn btn-dark w-100"
                              style={{backgroundColor: "#298080", color: "white", marginTop: "20px"}}
                            >
                              View Details{" "}
                              <i className="fa-solid fa-chevron-right ms-2" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 d-flex">
                  <div className="favourites-dashboard w-100">
                        <Link to="/patient/search-doctor2" title="Book new appointment">
                    <div className="book-appointment-head">
                      <h3>
                        <span>Book a new</span>Appointment
                      </h3>
                      <span className="add-icon">
                          <i className="fa-solid fa-circle-plus" />
                      </span>
                    </div>
                        </Link>
                    <div className="dashboard-card w-100">
                      <div className="dashboard-card-head">
                        <div className="header-title">
                          <h5>Previous Appointment</h5>
                        </div>

                        <div className="card-view-link">
                          <div className="owl-nav slide-nav2 text-end nav-control" />
                        </div>
                      </div>

                      <div className="dashboard-card-body">
                        <div className="past-appointments-slider">
                          <div className="w-100">
                            <div className="dashboard-card-body">
                              {/* Check if pastAppointments data exists and is not empty */}

                                <div className="appointment-dash-card past-appointment">
                                  {
                                    pastAppointments?.consultantDetails ? 
                                    <div className="appointment-date-info">
                                  <div className="">
                                    <div className="doctor-info-profile d-flex flex-column text-center">
                                      <div>
                                      <Link to="#" className=" rounded-3">
                                        <img className="booking-doc-img" width='120px' height='120px' style={{borderRadius:'10%'}}
                                          src={
                                            pastAppointments?.consultantDetails?.profileImage
                                              ? pastAppointments.consultantDetails.profileImage
                                              : IMG01
                                          }
                                          alt="Img"
                                        />
                                      </Link>
                                      </div>

                                      <br />
                                      <div className="doctor-name-info">
                                        <h5>
                                          <Link to="#">
                                            {
                                              (() => {
                                                const displayName = pastAppointments?.consultantDetails?.information?.displayName || "";
                                                // Check if displayName already starts with "Dr" (case-insensitive, with or without dot/space)
                                                return displayName.match(/^Dr[\.\s]/i)
                                                  ? displayName
                                                  : displayName
                                                    ? `Dr. ${displayName}`
                                                    : "";
                                              })()
                                            }
                                          </Link>
                                        </h5>
                                        {/* <span>Dental Specialist</span> */}
                                      </div>
                                    </div>
                                  </div>
                                    <h4 className="text-center">
                                    </h4>{" "}
                                    {/* Display only the formatted date */}
                                    <ul style={{padding:'0px 18px'}}>
                                      <li>
                                        <span>
                                          <i className="fa-solid fa-clock" />
                                        </span>
                                         {formatDate(pastAppointments.appointmentDate)}
                                      </li>
                                        <li>
                                          <span>
                                            <i className={`fa-solid ${pastAppointments?.consultantDetails?.information?.designation ? "fa-user-md" : "fa-briefcase"}`} />
                                          </span>
                                          {pastAppointments?.consultantDetails?.information?.designation || ""}
                                        </li>
                                    </ul>
                                  </div>
                                  :
                                  <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                    <div>

                                    No data found
                                    </div>
                                  </div>
                                  }

                                </div>
                              {/* ) : (
                                
                              )} */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-5 d-flex">
                  <div className="dashboard-main-col w-100">
                    <div className="dashboard-card w-100">
                      <div className="dashboard-card-head">
                        <div className="header-title">
                          <h5>
                            <span className="card-head-icon">
                              <i className="fa-solid fa-calendar-days" />
                            </span>
                            Upcoming Appointments
                          </h5>
                        </div>
                        <div className="card-view-link">
                          <div className="owl-nav slide-nav-patient text-end nav-control" />
                        </div>
                      </div>
                      <div className="dashboard-card-body">
                        <div className="apponiment-dates">
                          {/* <ul className="appointment-calender-slider">
                            <OwlCarousel {...specialitysettings}>
                              <li>
                                <Link to="#">
                                  <h5>
                                    19 <span>Mon</span>
                                  </h5>
                                </Link>
                              </li>
                              <li>
                                <Link to="#">
                                  <h5>
                                    20 <span>Mon</span>
                                  </h5>
                                </Link>
                              </li>
                              <li>
                                <Link to="#" className="available-date">
                                  <h5>
                                    21 <span>Tue</span>
                                  </h5>
                                </Link>
                              </li>
                              <li>
                                <Link to="#" className="available-date">
                                  <h5>
                                    22 <span>Wed</span>
                                  </h5>
                                </Link>
                              </li>
                              <li>
                                <Link to="#">
                                  <h5>
                                    23 <span>Thu</span>
                                  </h5>
                                </Link>
                              </li>
                              <li>
                                <Link to="#">
                                  <h5>
                                    24 <span>Fri</span>
                                  </h5>
                                </Link>
                              </li>
                              <li>
                                <Link to="#">
                                  <h5>
                                    25 <span>Sat</span>
                                  </h5>
                                </Link>
                              </li>
                            </OwlCarousel>
                          </ul> */}

                          {upcomingAppointments.length === 0 ? (
                            <div style={{minHeight:'404px',textAlign:'center'}} className="no-upcoming-appointments">
                              <p >No data found</p>
                            </div>
                          ) : (
                            upcomingAppointments.map((item, index) => (
                              <div
                                className="appointment-dash-card"
                                key={index}
                              >
                                <div className="doctor-fav-list">
                                  <div className="doctor-info-profile">
                                    <Link to="#" className="table-avatar">
                                      <img
                                        src={
                                          item?.consultantDetails?.profileImage
                                            ? item.consultantDetails.profileImage
                                            : IMG01 
                                        }
                                        alt="Img"
                                      />
                                    </Link>
                                    <div className="doctor-name-info">
                                      <h6>
                                        <Link to="#">
                                          {
                                            item?.consultantDetails?.information
                                              ?.displayName
                                          }
                                        </Link>
                                      </h6>
                                      {/* <span>Dentist</span> */}
                                    </div>
                                  </div>
                                  {/* <Link to="#" className="cal-plus-icon">
                                    <i className="fa-solid fa-hospital" />
                                  </Link> */}
                                </div>
                                <div className="date-time">
                                  <p>
                                    <i className="fa-solid fa-clock" />
                                    {formatDate(item.appointmentDate)}{" "}
                                  </p>
                                </div>
                                <div className="card-btns">
                                  <Link
                                    to={`/patient/patient-chat/${item.consultantId}`}
                                    className="btn btn-gray"
                                  >
                                    <i className="fa-solid fa-comment-dots" />
                                    Chat Now
                                  </Link>
                                  <ul typeof="none" className="w-50">
                                    <div className="d-flex">
                                      <li className="w-100">
                                        {isWithinTimeWindow(item.appointmentDate) && item.status?.toLowerCase() !== 'cancelled'  ? (
                                          <a
                                            href={item?.appointmentLink}
                                            target="_blank"
                                            style={{
                                              padding: "6px 0px",
                                              display: "flex",
                                              flexDirection: "row",
                                              marginTop: "10px",
                                              color: "#1890ff",
                                              textDecoration: "underline",
                                            }}
                                          >
                                            <i className="fa-solid fa-calendar-check me-2" />
                                            Attend
                                          </a>
                                        ) : (
                                          <span
                                          style={{
                                            padding: "6px 0px",
                                            display: "flex",
                                            flexDirection: "row",
                                            marginTop: "10px",
                                            fontWeight: "600",
                                            alignItems: "center",
                                            color:
                                              item.status.toLowerCase() === "confirmed"
                                                ? "#28a745"
                                                : item.status.toLowerCase() === "cancelled"
                                                ? "#dc3545"
                                                : item.status.toLowerCase() === "rescheduled"
                                                ? "#ffc107"
                                                : "#333",
                                          }}
                                        >
                                          <i
                                            className="fa-solid fa-calendar-days me-2"
                                            style={{
                                              color:
                                                item.status.toLowerCase() === "confirmed"
                                                  ? "#28a745"
                                                  : item.status.toLowerCase() === "cancelled"
                                                  ? "#dc3545"
                                                  : item.status.toLowerCase() === "rescheduled"
                                                  ? "#ffc107"
                                                  : "#333",
                                            }}
                                          />
                                          {item.status}
                                        </span>
                                        

                                        )}
                                      </li>

                                    </div>
                                  </ul>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-7 d-flex">
  <div className="dashboard-main-col w-100">
    <div
      className="dashboard-card w-100"
      style={{ height: "495px" }}
    >
      <div className="dashboard-card-head sticky-header">
        <div className="header-title">
          <h5>Notifications</h5>
        </div>
      </div>
      <div
        className="dashboard-card-body"
        style={{ height: "88%", overflowY: "auto" }} // Enable scrolling for the body
      >
        <div className="table-responsive" style={{ overflowX: "unset" }}>
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
                        <h6>No data found</h6>
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
                        <div
                          className="table-noti-message"
                          style={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
                        >
                          <h6 style={{ fontSize: "0.85rem", fontStyle: "italic", marginBottom: "2px", }}>
                            <Link to="#">
                              {notification.message}
                            </Link>
                          </h6>
                          <span
                            style={{
                              fontSize: "0.65rem",
                              display: "block", // Ensure it stays on a new line
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
                <div className="col-xl-12 d-flex"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      <DoctorFooter {...props} />
    </>
  );
};

export default Dashboard;
