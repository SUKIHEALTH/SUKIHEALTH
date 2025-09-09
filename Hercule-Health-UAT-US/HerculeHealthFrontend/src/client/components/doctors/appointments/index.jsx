import React, { useEffect, useState } from "react";
import Header from "../../header";
import DoctorSidebar from "../sidebar";
import DoctorFooter from "../../common/doctorFooter";
import { Link } from "react-router-dom";
import axios from "../../../../axiosConfig";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import debounce from "lodash.debounce"; // Import debounce
import { FourSquare } from "react-loading-indicators";
import { Table, Spin, Button, Modal, message } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
const userId = localStorage.getItem("userData");

const Appointments = (props) => {
  const [appointments, setAppointments] = useState([]); // Default to empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [totalCount, setTotalCount] = useState(0); // Total count of appointments
  const [searchTerm, setSearchTerm] = useState(""); // For the search input
  const [cancelLoading, setCancelLoading] = useState(null); // To track which appointment is being cancelled
  const [cancellationDeadline, setCancellationDeadline] = useState(null);
  const [isHover, setIsHover] = useState(false);

  // Set initial date range: today to next 30 days (same as patient appointments)
  const today = moment();
  const next30Days = moment().add(30, 'days');
  const [startDate, setStartDate] = useState(today.format("YYYY-MM-DD")); // Start date for date range
  const [endDate, setEndDate] = useState(next30Days.format("YYYY-MM-DD")); // End date for date range
  const [noAppointmentsMessage, setNoAppointmentsMessage] = useState(""); // Message when no appointments found

  const consultantId = localStorage.getItem("userData");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setAppointments([]); // Clear previous data while loading
      const response = await axios.post(
        `/api/get-all-consultant-appointments/${consultantId}`,
        {
          pageNumber: currentPage,
          pageSize: 6,
          startDate,
          endDate,
          searchTerm,
        }
      );

      if (response.data.appointments.length === 0) {
        setNoAppointmentsMessage("No appointments found for the selected date range.");
      } else {
        setNoAppointmentsMessage(""); // Clear the message if appointments are found
      }

      setAppointments(response.data.appointments); // Update appointments state
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalCount);

      const settings = await axios.get("/api/get-admin-settings");
      setCancellationDeadline(settings.data.setting.doctorCancellationDeadline);
    } catch (err) {
      setError("Failed to fetch appointments");
      setAppointments([]); // Clear appointments in case of an error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchAppointments();
    }, 300); // Add debounce for search

    return () => clearTimeout(debounceTimeout);
  }, [currentPage, consultantId, startDate, endDate, searchTerm]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Updated initial settings to match patient appointments behavior
  const initialSettings = {
    startDate: today,
    endDate: next30Days,
    opens: "left",
    autoApply: true,
  };

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

  const clearFilter = () => {
    setStartDate("")
    setEndDate("")
    setSearchTerm("")
  }

  const handleCancelAppointment = async (appointmentId) => {
    Modal.confirm({
      title: 'Cancel Appointment',
      content: 'Are you sure you want to cancel this appointment? This action cannot be undone.',
      okText: 'Yes, Cancel',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          setCancelLoading(appointmentId);

          // Call the cancel appointment API
          const response = await axios.post('/api/delete-appointment/cancel', {
            appointmentId: appointmentId,
            userType: "doctor",
            userId

          });

          if (response.data) {
            message.success('Appointment cancelled successfully');
            // Refresh the appointments list
            await fetchAppointments();
          }
        } catch (error) {
          console.error("Error cancelling appointment:", error);
          message.error(error.response?.data?.message || "Failed to cancel appointment");
        } finally {
          setCancelLoading(null);
        }
      },
    });
  };

  // Helper to check if cancel button should be visible
  const canCancelAppointment = (appointmentDate) => {
    if (!cancellationDeadline) return false;

    const appointmentTime = new Date(appointmentDate);
    const now = new Date();

    // Convert both times to UTC for consistent comparison
    const appointmentUTC = new Date(appointmentTime.toISOString());
    const nowUTC = new Date(now.toISOString());

    // If appointment is already in the past — no cancel button
    if (appointmentUTC <= nowUTC) {
      return false;
    }

    // Calculate deadline time (appointment time - cancellationDeadline hours)
    const deadlineTime = new Date(appointmentUTC.getTime() - cancellationDeadline * 60 * 60 * 1000);

    // Show cancel button if now is between deadlineTime and appointmentTime
    if (nowUTC <= deadlineTime && nowUTC < appointmentUTC) {
      return true;
    }

    return false;
  };
  const isWithinTimeWindow = (appointmentDate) => {
    const now = new Date();
    const appDate = new Date(appointmentDate);
    const timeDiff = (appDate - now) / (1000 * 60);
    return timeDiff >= -60 && timeDiff <= 60;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: {
        className: "badge-confirmed",
        icon: "fa-solid fa-check-circle",
        text: "Confirmed",
        color: "#28a745"
      },
      rescheduled: {
        className: "badge-rescheduled",
        icon: "fa-solid fa-calendar-alt",
        text: "Rescheduled",
        color: "#ffc107"
      },
      cancelled: {
        className: "badge-cancelled",
        icon: "fa-solid fa-times-circle",
        text: "Cancelled",
        color: "#dc3545"
      },
      completed: {
        className: "badge-completed",
        icon: "fa-solid fa-check-double",
        text: "Completed",
        color: "#17a2b8"
      },
      pending: {
        className: "badge-pending",
        icon: "fa-solid fa-clock",
        text: "Pending",
        color: "#6c757d"
      }
    };

    return statusConfig[status?.toLowerCase()] || statusConfig.pending;
  };

  return (
    <div>
      <Header {...props} />
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Appointments</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/doctor/doctor-dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Appointments
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
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              <DoctorSidebar />
            </div>
            <div className="col-lg-8 col-xl-9">
              <div className="dashboard-header">
                <h3>Appointments</h3>
                <ul className="header-list-btns">
                  <li>
                    <div className="input-block dash-search-input">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <span className="search-icon">
                        <i className="fa-solid fa-magnifying-glass" />
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
              <style jsx> {`
          .appointment-status-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: all 0.2s ease;
          }

          .appointment-status-badge:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          }

          .badge-confirmed {
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
          }

          .badge-rescheduled {
            background: linear-gradient(135deg, #ffc107, #fd7e14);
            color: #212529;
          }

          .badge-cancelled {
            background: linear-gradient(135deg, #dc3545, #e83e8c);
            color: white;
          }

          .badge-completed {
            background: linear-gradient(135deg, #17a2b8, #6f42c1);
            color: white;
          }

          .badge-pending {
            background: linear-gradient(135deg, #6c757d, #495057);
            color: white;
          }

          .appointment-wrap {
            position: relative;
            transition: all 0.3s ease;
            border-left: 3px solid transparent;
          }

          .appointment-wrap:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }

          .appointment-wrap.status-confirmed {
            border-left-color: #28a745;
          }

          .appointment-wrap.status-rescheduled {
            border-left-color: #ffc107;
          }

          .appointment-wrap.status-cancelled {
            border-left-color: #dc3545;
          }

          .appointment-wrap.status-completed {
            border-left-color: #17a2b8;
          }

          .appointment-wrap.status-pending {
            border-left-color: #6c757d;
          }

          .status-indicator-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 6px;
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
    `}</style>

              <div className="filter-head">
                <div className="d-flex align-items-center">
                  <div className="position-relative daterange-wraper me-2" style={{ width: "300px" }}>
                    <div className="input-groupicon calender-input">
                      <DateRangePicker
                        initialSettings={initialSettings}
                        onApply={(e, picker) => {
                          const newStartDate = picker.startDate.format("YYYY-MM-DD");
                          const newEndDate = picker.endDate.format("YYYY-MM-DD");

                          setStartDate(newStartDate);
                          setEndDate(newEndDate);
                          setCurrentPage(1); // Reset to the first page when date changes
                        }}
                      >
                        <input
                          className="form-control date-range bookingrange"
                          type="text"
                          placeholder={startDate && endDate ? `${startDate} - ${endDate}` : "Select Date Range"} // Show placeholder when no date range is selected
                          value={startDate && endDate ? `${startDate} - ${endDate}` : ""} // Display selected date range
                          readOnly // Prevent manual input
                        />
                      </DateRangePicker>
                    </div>
                    <i className="fa-solid fa-calendar-days" />
                  </div>

                  {/* Clear Button (Aligned Properly) */}
                  <div className="clear-btn ms-2 mb-4" onClick={clearFilter}>
                    X
                  </div>
                </div>
              </div>

              <div className="tab-content appointment-tab-content">
                <div
                  className="tab-pane fade show active"
                  id="pills-upcoming"
                  role="tabpanel"
                  aria-labelledby="pills-upcoming-tab"
                >
                  {loading ? (
                    // Show the loading indicator
                    <div className="text-center">
                      <p>
                        <FourSquare
                          color="#99afe1"
                          size="medium"
                          text=""
                          textColor="#c91a1a"
                        />
                      </p>
                    </div>
                  ) : appointments ? (
                    appointments.length > 0 ? (
                      // Render appointments if they exist
                      appointments.map((item, index) => {
                      const statusBadge = getStatusBadge(item.status);
                        const appointmentDate = new Date(item.appointmentDate);
                        const currentDate = new Date();

                        const isSameDay =
                          appointmentDate.toDateString() ===
                          currentDate.toDateString();

                        const timeDifferenceInMinutes =
                          (appointmentDate - currentDate) / (1000 * 60); // Difference in minutes
                        const isWithinTime =
                          timeDifferenceInMinutes <= 60 &&
                          timeDifferenceInMinutes >= -60; // +/- 1 hour window

                        // Determine badge class and text
                        let badgeClass = "";
                        let badgeText = "";
                        switch (item.status) {
                          case "Rescheduled":
                            badgeClass = "badge-rescheduled";
                            badgeText = "Rescheduled";
                            break;
                          case "Confirmed":
                            badgeClass = "badge-confirmed";
                            badgeText = "Confirmed";
                            break;
                          case "Cancelled":
                            badgeClass = "badge-cancelled";
                            badgeText = "Cancelled";
                            break;
                          case "Completed":
                            badgeClass = "badge-completed";
                            badgeText = "Completed";
                            break;
                          default:
                            badgeClass = "badge-pending";
                            badgeText = item.status || "Pending";
                        }
                        return (
                          <div key={index} className="appointment-wrap">
                            <ul>
                              <li>
                                <div className="patinet-information">
                                  <Link
                                    to={{
                                      pathname: `/doctor/doctor-upcoming-appointment/${item.patientId}`,
                                      state: {
                                        appointmentLink:
                                          item.appointmentLink,
                                        appointmentDate: formatDate(
                                          item.appointmentDate
                                        ),
                                        appointmentId: item.appointmentId,
                                        appointmentStatus: item.status,
                                      },
                                    }}
                                  >
                                    <img
                                      src={
                                        item?.patientDetails?.profileImage ? item?.patientDetails?.profileImage : "/assets/images/doctor-thumb-01.png"
                                      }
                                      alt="User Image"
                                    />
                                  </Link>
                                  <div className="patient-info">
                                    <p>#{item.appointmentId}</p>
                                    <h6>
                                      <Link
                                        to={{
                                          pathname: `/doctor/doctor-upcoming-appointment/${item.patientId}`,
                                          state: {
                                            appointmentLink:
                                              item.appointmentLink,
                                            appointmentDate: formatDate(
                                              item.appointmentDate
                                            ),
                                            appointmentId:
                                              item.appointmentId,
                                            appointmentStatus: item.status,
                                          },
                                        }}
                                      >
                                        {
                                          item.patientDetails.information
                                            .firstName
                                        }{" "}
                                        {
                                          item.patientDetails.information
                                            .lastName
                                        }
                                      </Link>
                                    </h6>
                                    <li>
                                    <div className={`appointment-status-badge ${statusBadge.className}`}>
                                    {/* <span 
                                      className="status-indicator-dot" 
                                      style={{ backgroundColor: statusBadge.color }}
                                    ></span> */}
                                    <i className={statusBadge.icon} style={{ fontSize: '10px' }}></i>
                                    <span>{statusBadge.text}</span>
                                  </div>
                                    </li>
                                  </div>
                                </div>
                              </li>
                              <li className="appointment-info">
                                <p>
                                  <i className="fa-solid fa-clock" />
                                  {formatDate(item.appointmentDate)}
                                </p>
                                <ul className="d-flex apponitment-types">
                                  <li>Video Call</li>
                                </ul>
                              </li>
                              <li className="mail-info-patient">
                                <ul>
                                  <li>
                                    <i className="fa-solid fa-envelope" />
                                    {
                                      item?.patientDetails.information
                                        .email
                                    }
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-phone" />
                                    {
                                      item?.patientDetails.information
                                        .phone
                                    }
                                  </li>
                                </ul>
                              </li>
                              <li className="appointment-action">
                                <ul>
                                  <li>
                                    <Link
                                      to={{
                                        pathname: `/doctor/doctor-upcoming-appointment/${item.patientId}`,
                                        state: {
                                          appointmentLink:
                                            item.appointmentLink,
                                          appointmentDate: formatDate(
                                            item.appointmentDate
                                          ),
                                          appointmentId:
                                            item.appointmentId,
                                          appointmentStatus: item.status,
                                        },
                                      }}
                                      title="View Appointment Details"
                                    >
                                      <i className="fa-solid fa-eye" />
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to={`/chat-doctor/${item.patientId}`}
                                      title="Chat with Patient"
                                    >
                                      <i className="fa-solid fa-comments" />
                                    </Link>
                                  </li>
                                </ul>
                              </li>
                              <li className="appointment-start">
                                <ul>
                                  <li>
                                    {isSameDay && isWithinTime && item.status?.toLowerCase() !== 'cancelled' ? (
                                      <a
                                        href={item.appointmentLink}
                                        className="start-link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        Attend Now
                                      </a>
                                    ) :
                                      <a
                                        href={item.appointmentLink}
                                        className="start-link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ visibility: "hidden" }}
                                      >
                                        Attend Now
                                      </a>
                                    }
                                  </li>
                                  <li>
                                    {item.status !== 'cancelled' && canCancelAppointment(item.appointmentDate) && (
                                      <Button
                                        type="primary"
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        loading={cancelLoading === item.appointmentId}
                                        onClick={() => handleCancelAppointment(item.appointmentId)}
                                        onMouseEnter={() => setIsHover(true)}
                                        onMouseLeave={() => setIsHover(false)}
                                        style={{
                                          backgroundColor: '#fff',
                                          color: '#ff4d4f',
                                          padding: '10px 10px',
                                          borderRadious: '10px',
                                          borderBottom: isHover ? '1px solid #ff4d4f' : '1px solid #fff',
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                    )}
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </div>
                        );
                      })
                    ) : (
                      // No appointments found message
                      <div className="no-appointments-message">
                        <p>No appointments found</p>
                      </div>
                    )
                  ) : (
                    // No appointments and not loading
                    <div className="no-appointments-message">
                      <p>No appointments found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination dashboard-pagination">
                  <ul>
                    <li>
                      <Link
                        to="#"
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <i className="fa-solid fa-chevron-left" />
                      </Link>
                    </li>
                    {[...Array(totalPages).keys()].map((page) => (
                      <li key={page + 1}>
                        <Link
                          to="#"
                          className={`page-link ${currentPage === page + 1 ? "active" : ""
                            }`}
                          onClick={() => handlePageChange(page + 1)}
                        >
                          {page + 1}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        to="#"
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <i className="fa-solid fa-chevron-right" />
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <DoctorFooter {...props} />
    </div>
  );
};

export default Appointments;