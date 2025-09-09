import React, { useEffect, useState } from "react";
import Header from "../../header";
import DashboardSidebar from "../dashboard/sidebar/sidebar";
import Footer from "../../footer";
import StickyBox from "react-sticky-box";
import { Link } from "react-router-dom";
import DateRangePicker from "react-bootstrap-daterangepicker";
import axios from "../../../../axiosConfig";
import debounce from "lodash.debounce"; // Import debounce
import { FourSquare } from "react-loading-indicators";
import { useAdminSettings } from "../../../../context/AdminSettingsContext";
import { Button, Modal, message } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import DoctorFooter from "../../common/doctorFooter";

const PatientAppointments = (props) => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cancelLoading, setCancelLoading] = useState(null);
const [cancellationDeadline, setCancellationDeadline] = useState(null);
const [isHover, setIsHover] = useState(false);
  
  // Set initial date range: today to next 30 days
  const today = new Date().toISOString().split('T')[0];
  const next30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(next30Days);
  const [searchTerm, setSearchTerm] = useState(""); // Search filtering
  const patientId = localStorage.getItem("userData");
  const { settings } = useAdminSettings()
  // Function to check if appointment is within 30 minutes window
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


  // Function to get status badge styling
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

  // Debounced search handler
  const debouncedSearch = debounce(async (search) => {
    setSearchTerm(search); // Update searchTerm after delay
  }, 1500); // Delay of 500ms

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(
          `/api/get-all-patient-appointments/${patientId}`,
          {
            pageNumber,
            startDate,
            endDate,
            searchTerm,
            pageSize: 6,
          }
        );
        setAppointments(response.data.appointments);
        setTotalPages(response.data.totalPages);
        if (response.data.appointments.length === 0) {
          setError("No appointments found");
        } else {
          setError(null);
        }
      } catch (err) {
        setError("No Data found");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [pageNumber, startDate, endDate, searchTerm, patientId]);

  useEffect(() => {
    if (settings && settings.patientCancellationDeadline) {
      setCancellationDeadline(settings.patientCancellationDeadline);
    }
  }, [settings]);
  const clearFilter = () => {
    setStartDate("")
    setEndDate("")
    setSearchTerm("")
  }

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
  
    // Split the formatted date into date and time parts
    const parts = formattedDate.split(",");
    const datePart = parts[0]?.trim(); // Safely access the date part
    const timePart = parts[1]?.trim(); // Safely access the time part
  
    // Return the formatted date and time, or fallback if timePart is undefined
    return timePart ? `${datePart} - ${timePart}` : datePart;
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPageNumber(newPage);
    }
  };

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
          const response = await axios.post('/api/delete-appointment/cancel', {
            appointmentId: appointmentId,
            userType: "patient",
            userId: patientId,
          });
          if (response.data) {
            message.success('Appointment cancelled successfully');
            // Refresh the appointments list
            setPageNumber(1); // Optionally reset to first page
            // Re-fetch appointments
            const res = await axios.post(
              `/api/get-all-patient-appointments/${patientId}`,
              {
                pageNumber,
                startDate,
                endDate,
                searchTerm,
                pageSize: 6,
              }
            );
            setAppointments(res.data.appointments);
            setTotalPages(res.data.totalPages);
          }
        } catch (error) {
          message.error(error.response?.data?.message || "Failed to cancel appointment");
        } finally {
          setCancelLoading(null);
        }
      },
    });
  };

  const canCancelAppointment = (appointmentDate) => {
    if (!cancellationDeadline) return false;
    const appointmentTime = new Date(appointmentDate);
    const now = new Date();
    const appointmentUTC = new Date(appointmentTime.toISOString());
    const nowUTC = new Date(now.toISOString());
    if (appointmentUTC <= nowUTC) return false;
    const deadlineTime = new Date(appointmentUTC.getTime() - cancellationDeadline * 60 * 60 * 1000);
    return nowUTC <= deadlineTime && nowUTC < appointmentUTC;
  };

  // ...inside PatientAppointments component...
  const canReschedule = (appointmentDate) => {
    if (!settings.patientReschedulingDeadline) return false;
    const now = new Date();
    const appDate = new Date(appointmentDate);
    const diffHours = (appDate - now) / (1000 * 60 * 60);
    return diffHours > settings.patientReschedulingDeadline;
  };

  return (
    <>
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

      {/* Add custom CSS for status badges */}
      <style jsx>{`
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

      <div className="content doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar mb-lg-4 mb-xl-0 mb-md-4 mb-4">
              <StickyBox offsetTop={20} offsetBottom={20}>
                <DashboardSidebar />
              </StickyBox>
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
                        placeholder="Search Name"
                        onChange={(e) => debouncedSearch(e.target.value)} // Call debounced function
                      />
                      <span className="search-icon">
                        <i className="fa-solid fa-magnifying-glass" />
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="appointment-tab-head">
                <div className="appointment-tabs">
                  <ul
                    className="nav nav-pills inner-tab "
                    id="pills-tab"
                    role="tablist"
                  ></ul>
                </div>
                <div className="d-flex align-items-center">
                  <div className="position-relative daterange-wraper me-2" style={{ width: "300px" }}>
                    <div className="input-groupicon calender-input">
                      <DateRangePicker
                        initialSettings={{ 
                          autoApply: true,
                          startDate: new Date(),
                          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        }}
                        onApply={(e, picker) => {
                          const newStartDate = picker.startDate.format("YYYY-MM-DD");
                          const newEndDate = picker.endDate.format("YYYY-MM-DD");

                          setStartDate(newStartDate);
                          setEndDate(newEndDate);
                          setPageNumber(1); // Reset to the first page when date changes
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
                  ) : error ? (
                    <p>{error}</p>
                  ) : (
                    appointments.map((item, index) => {
                      const statusBadge = getStatusBadge(item.status);
                      return (
                        <div 
                          key={index} 
                          className={`appointment-wrap status-${item.status?.toLowerCase() || 'pending'}`}
                        >
                          <ul>
                            <li>
                              <div className="patinet-information">
                                <Link
                                  to={{
                                    pathname: `/patient/upcoming-appointment/${item.consultantId}`,
                                    state: {
                                      appointmentDate: formatDate(
                                        item.appointmentDate
                                      ),
                                      appointmentId: item.appointmentId,
                                      consultantName:
                                        item?.consultantDetails?.information
                                          ?.displayName ? item?.consultantDetails?.information?.displayName : item?.consultantDetails?.information?.firstName + item?.consultantDetails?.information?.lastName,
                                      appointmentLink: item?.appointmentLink,
                                    },
                                  }}
                                >
                                  <img
                                    src={item?.consultantDetails?.profileImage ? item?.consultantDetails?.profileImage : "/assets/images/doctor-thumb-01.png"}
                                    alt="User Image"
                                  />
                                </Link>
                                <div className="patient-info">
                                  <p>#{item?.appointmentId}</p>
                                  <h6>
                                    <Link
                                      to={{
                                        pathname: `/patient/upcoming-appointment/${item.consultantId}`,
                                        state: {
                                          appointmentDate: formatDate(
                                            item.appointmentDate
                                          ),
                                          appointmentId: item.appointmentId,
                                          consultantName:
                                            item?.consultantDetails?.information
                                              ?.displayName,
                                          appointmentLink: item?.appointmentLink,
                                        },
                                      }}
                                    >
                                      {
                                        item?.consultantDetails?.information?.displayName?.startsWith("Dr")
                                          ? item?.consultantDetails?.information?.displayName.startsWith("Dr.")
                                            ? item?.consultantDetails?.information?.displayName
                                            : `Dr. ${item?.consultantDetails?.information?.displayName.slice(3).trim()}`
                                          : `Dr. ${item?.consultantDetails?.information?.displayName}`
                                      }
                                    </Link>
                                  </h6>
                                  <li>
                                    {/* Status Badge */}
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
                            <li className="appointment-action">
                              <ul>
                                <li>
                                  <Link
                                    to={{
                                      pathname: `/patient/upcoming-appointment/${item.consultantId}`,
                                      state: {
                                        appointmentDate: formatDate(
                                          item.appointmentDate
                                        ),
                                        appointmentId: item.appointmentId,
                                        consultantName:
                                          item?.consultantDetails?.information
                                            ?.displayName,
                                        appointmentLink: item?.appointmentLink,
                                      },
                                    }}
                                    title="View Appointment Details"
                                  >
                                    <i className="fa-solid fa-eye" />
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to={`/patient/patient-chat/${item.consultantId}`}
                                    title="Chat with Doctor"
                                  >
                                    <i className="fa-solid fa-comments" />
                                  </Link>
                                </li>
                                {new Date(item.appointmentDate) > new Date() &&
                                  item.status?.toLowerCase() !== 'cancelled' &&
                                  canReschedule(item.appointmentDate) && (
                                    <li>
                                    <Link
                                      to={{
                                        pathname: `/patient/reschedule-appointment/${item.consultantId}`,
                                        state: {
                                          appointmentDate: formatDate(item.appointmentDate),
                                          appointmentId: item.appointmentId,
                                          consultantName:
                                            item?.consultantDetails?.information?.displayName,
                                          appointmentLink: item?.appointmentLink,
                                        },
                                      }}
                                      title="Reschedule Appointment"
                                    >
                                      <i className="fa-solid fa-calendar-alt" />
                                    </Link>
                                  </li>
                                )}
                              </ul>
                            </li>
                            <li className="appointment-detail-btn">
                              {isWithinTimeWindow(item.appointmentDate) && item.status?.toLowerCase() !== 'cancelled' ? (
                                <a
                                  href={item?.appointmentLink}
                                  target="_blank"
                                  className="start-link"
                                >
                                  <i className="fa-solid fa-calendar-check me-1" />
                                  Attend
                                </a>
                              ) : (
                                <a
                                  target="_blank"
                                  className="start-link"
                                  style={{visibility: "hidden"}}
                                >
                                  <i className="fa-solid fa-calendar-check me-1" />
                                  Attend
                                </a>
                              )}
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
                                  padding: '17px 10px',
                                  borderRadious:'10px',
                                  borderBottom: '2px solid #ff4d4f',
                                  borderTop: isHover ? '1px solid #ff4d4f' : '1px solid #fff',
                                  borderLeft: isHover ? '1px solid #ff4d4f' : '1px solid #fff',
                                  borderRight: isHover ? '1px solid #ff4d4f' : '1px solid #fff',
                                }}
                              >
                                Cancel
                              </Button>
                              )}
                            </li>
                          </ul>
                        </div>
                      );
                    })
                  )}

                  {/* Pagination */}
                  <div className="pagination dashboard-pagination">
                    <ul>
                      <li>
                        <Link
                          to="#"
                          className="page-link"
                          onClick={() => handlePageChange(pageNumber - 1)}
                          disabled={pageNumber === 1}
                        >
                          <i className="fa-solid fa-chevron-left" />
                        </Link>
                      </li>
                      {[...Array(totalPages)].map((_, index) => (
                        <li key={index}>
                          <Link
                            to="#"
                            className={`page-link ${
                              index + 1 === pageNumber ? "active" : ""
                            }`}
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          to="#"
                          className="page-link"
                          onClick={() => handlePageChange(pageNumber + 1)}
                          disabled={pageNumber === totalPages}
                        >
                          <i className="fa-solid fa-chevron-right" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DoctorFooter {...props} />
    </>
  );
};

export default PatientAppointments;