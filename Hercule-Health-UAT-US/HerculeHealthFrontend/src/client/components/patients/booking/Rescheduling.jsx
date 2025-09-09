import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";
import axios from "../../../../axiosConfig";
import Header from "../../header";

const Rescheduling = (props) => {
  const [consultantInfo, setConsultantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const appointmentData = props.location?.state;
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().startOf("day").toDate(),
    endDate: moment().add(6, "days").endOf("day").toDate(),
  });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { id: userId } = useParams();
  const history = useHistory(); // Add this line

  
  // Get user timezone like in checkout component
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  console.log("appointmentData", appointmentData);
  
  useEffect(() => {
    const fetchConsultantInfo = async () => {
      try {
        const response = await axios.get(
          `/api/consultant-profile-information/${userId}`
        );
        setConsultantInfo(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching consultant information");
        setLoading(false);
      }
    };

    fetchConsultantInfo();
  }, [userId]);

  // Add formatDateTime function from checkout component
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
    };
  };

  // Add formattedDate function from checkout component
  const formattedDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatTime = (isoDate) => {
    return moment(isoDate).format("hh:mm A");
  };

  const groupSlotsByDate = (slots, startDate, endDate) => {
    const grouped = {};
  
    // Adjust endDate to include the entire day
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999); // Set time to the end of the day
  
    // Initialize all dates in range with empty arrays
    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0); // Ensure startDate starts at 00:00:00
  
    while (currentDate <= adjustedEndDate) {
      const dateStr = moment(currentDate).format("YYYY-MM-DD"); // Use moment.js to format the date
      grouped[dateStr] = [];
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    // Filter and group both "Available" and "Canceled" slots
    slots.forEach((slot) => {
      if (slot.status && 
          (slot.status.trim().toLowerCase() === "available" || 
           slot.status.trim().toLowerCase() === "canceled" ||
           slot.status.trim().toLowerCase() === "cancelled")) { // Handle both spellings
        const slotDate = moment(slot.time).format("YYYY-MM-DD"); // Use moment.js to format the slot date
        const slotTime = new Date(slot.time);
  
        if (slotTime >= startDate && slotTime <= adjustedEndDate && grouped[slotDate]) {
          grouped[slotDate].push({
            time: slot.time,
            status: slot.status,
            id: slot._id,
          });
        }
      }
    });
  
    // Sort slots within each day
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => new Date(a.time) - new Date(b.time));
    });
  
    return grouped;
  };
  
  const handleDateRangeChange = (start, end) => {
    setSelectedDateRange({
      startDate: start.toDate(),
      endDate: end.toDate(),
    });
  };

const handleSlotSelection = async (slot, date) => {
  try {
    // Prevent selecting past slots
    if (new Date(slot) < new Date()) return;

    // Fetch all appointments for the patient
    const patientId = localStorage.getItem("userData"); // Replace with actual patient ID
    
    // Format dates as required: YYYY-MM-DD (1 month filter)
    const startDate = moment().format("YYYY-MM-DD");
    const endDate = moment().add(1, "month").format("YYYY-MM-DD");
    
    const requestData = {
      pageNumber: 1,
      startDate: startDate,
      endDate: endDate,
      searchTerm: "",
      pageSize: 100, // Adjust as needed
    };

    const response = await axios.post(`/api/get-all-patient-appointments/${patientId}`, requestData);

    const appointments = response.data.appointments;

    // Check if the selected slot is already booked (excluding cancelled appointments)
    const isAlreadyBooked = appointments.some((appointment) => {
      // Skip cancelled appointments - they don't block slot selection
      if (appointment.status && appointment.status.toLowerCase() === "cancelled") {
        return false;
      }

      const appointmentDate = moment(appointment.appointmentDate).format("YYYY-MM-DD");
      const appointmentTime = moment(appointment.appointmentDate).format("HH:mm");
      const selectedDate = moment(date).format("YYYY-MM-DD");
      const selectedTime = moment(slot).format("HH:mm");

      return appointmentDate === selectedDate && appointmentTime === selectedTime;
    });

    if (isAlreadyBooked) {
      setErrorMessage("You have already booked another appointment at this time with a different doctor. Please select a different time slot.");
      return;
    }

    // If not booked, proceed with slot selection
    setErrorMessage(""); // Clear any previous error message
    setSelectedSlot({ time: slot, date });
    localStorage.setItem(
      "selectedSlot",
      JSON.stringify({
        time: slot,
        date: moment(date).format("YYYY-MM-DD"),
      })
    );
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Handle 404 response (no paid appointments found)
      console.log("No paid appointments found. Allowing slot selection.");
      setErrorMessage(""); // Clear any previous error message
      setSelectedSlot({ time: slot, date });
      localStorage.setItem(
        "selectedSlot",
        JSON.stringify({
          time: slot,
          date: moment(date).format("YYYY-MM-DD"),
        })
      );
    } else {
      console.error("Error checking slot availability:", error);
      setErrorMessage("Failed to check slot availability. Please try again.");
    }
  }
};

  // Helper function to format appointment date for display
  const formatAppointmentDate = (dateString) => {
    // Parse the date string "29 May 2025 - 07:00 am"
    const [datePart, timePart] = dateString.split(' - ');
    const formattedDate = moment(datePart, 'DD MMM YYYY').format('dddd, MMMM DD, YYYY');
    return { date: formattedDate, time: timePart };
  };

  // Function to handle rescheduling - Updated to use proper date/time formatting
  const handleReschedule = async () => {
    if (!selectedSlot || !appointmentData) {
      setErrorMessage("Please select a new time slot before rescheduling.");
      return;
    }

    setIsRescheduling(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Format date and time like in checkout component
      const slotDateTime = formatDateTime(selectedSlot);
      const date = formattedDate(slotDateTime.formattedDate);
      const time = slotDateTime.formattedTime;

      // Prepare the request data with proper formatting
      const rescheduleData = {
        patientId: localStorage.getItem("userData"),
        consultantId: consultantInfo?.consultant?.userId,
        newDate: date, // Format: YYYY-MM-DD (like checkout)
        newTime: time, // Format: 10:00 AM (like checkout)
        timeZone: userTimeZone, // Use user's actual timezone
        patientEmail: localStorage.getItem("userEmail") || consultantInfo?.patient?.information?.email,
        consultantEmail: consultantInfo?.consultant?.information?.email,
        appointmentType: localStorage.getItem("selectedMeet") || "teamsMeet"
      };

      console.log("Rescheduling with data:", rescheduleData);

      // Make the API call
      const response = await axios.put(
        `/api/reschedule-appointment/${appointmentData.appointmentId}`,
        rescheduleData
      );

      if (response.status === 200) {
        setSuccessMessage("Appointment rescheduled successfully!");

        setSelectedSlot(null);
        localStorage.removeItem("selectedSlot");
        
        // Optional: Redirect to dashboard after a short delay
       setTimeout(() => {
          history.push("/patient/patient-appointments");
        }, 1500);
      }

    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      
      if (error.response) {
        // Server responded with error
        setErrorMessage(error.response.data.message || "Failed to reschedule appointment. Please try again.");
      } else if (error.request) {
        // Network error
        setErrorMessage("Network error. Please check your connection and try again.");
      } else {
        // Other error
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsRescheduling(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const groupedSlots = groupSlotsByDate(
    consultantInfo?.consultant?.availableSlots || [],
    selectedDateRange.startDate,
    selectedDateRange.endDate
  );

  return (
    <>
      <Header {...props} />

      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <h2 className="breadcrumb-title">Reschedule Appointment</h2>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/patient/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Reschedule
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="container">
          {/* Current Appointment Info Card */}
          {appointmentData && (
            <div className="card mb-4 border-warning">
              <div className="card-header bg-warning bg-opacity-10">
                <div className="d-flex align-items-center">
                  <i className="fas fa-calendar-alt text-warning me-2"></i>
                  <h5 className="mb-0 text-warning">Current Appointment Details</h5>
                </div>
              </div>
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <div className="appointment-details">
                      <div className="row mb-3">
                        <div className="col-sm-4">
                          <span className="fw-bold text-muted">Doctor:</span>
                        </div>
                        <div className="col-sm-8">
                          <span className="text-dark fs-6">{appointmentData.consultantName}</span>
                        </div>
                      </div>
                      
                      <div className="row mb-3">
                        <div className="col-sm-4">
                          <span className="fw-bold text-muted">Date & Time:</span>
                        </div>
                        <div className="col-sm-8">
                          {(() => {
                            const { date, time } = formatAppointmentDate(appointmentData.appointmentDate);
                            return (
                              <div>
                                <div className="text-dark fs-6">{date}</div>
                                <div className="text-primary fw-bold">{time}</div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-sm-4">
                          <span className="fw-bold text-muted">Appointment ID:</span>
                        </div>
                        <div className="col-sm-8">
                          <span className="text-dark fs-6">#{appointmentData.appointmentId}</span>
                        </div>
                      </div>

                      {appointmentData.appointmentLink && (
                        <div className="row">
                          <div className="col-sm-4">
                            <span className="fw-bold text-muted">Meeting Link:</span>
                          </div>
                          <div className="col-sm-8">
                            <a
                              href={appointmentData.appointmentLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm"
                              style={{
                                backgroundColor: "#073b87", // Bootstrap primary
                                color: "#fff",
                                boxShadow: "none",
                                pointerEvents: "auto"
                              }}
                            >
                              <i className="fas fa-video me-1"></i>
                              Join Meeting
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4 text-center">
                    <div className="appointment-status-badge">
                      <div className="badge bg-warning text-dark fs-6 p-3 rounded-pill mb-2">
                        <i className="fas fa-clock me-1"></i>
                        Scheduled
                      </div>
                      <div className="text-muted small">
                        You are rescheduling this appointment
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Consultant Info Card */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="booking-doc-info">
                <Link to="/patient/doctor-profile" className="booking-doc-img">
                  <img
                    src={
                      consultantInfo?.consultant?.profileImage ? consultantInfo?.consultant?.profileImage :
                     "/assets/images/doctor-thumb-01.png"
                    }
                    alt="Consultant"
                  />
                </Link>
                <div className="booking-info">
                  <h4>
                    <Link to={`/patient/doctor-profile/${userId}`}>
                      {consultantInfo?.consultant?.information?.displayName ||
                        "Dr. Doctor"}
                    </Link>
                  </h4>
                  <p className="text-muted mb-0">
                    <i className="fas fa-map-marker-alt"></i> {consultantInfo?.consultant?.information?.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* New Appointment Selection */}
          <div className="card mb-4">
            <div className="card-header bg-primary bg-opacity-10">
              <div className="d-flex align-items-center">
                <i className="fas fa-calendar-plus text-primary me-2"></i>
                <h5 className="mb-0 text-primary">Select New Appointment Time</h5>
              </div>
            </div>
            <div className="card-body">
              {/* Date Range Picker */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <h4 className="mb-1">{moment().format("DD MMM YYYY")}</h4>
                  <p className="text-muted">{moment().format("dddd")}</p>
                </div>
                <div className="d-flex col-md-6 w-100">
                  <div className="">
                    <DateRangePicker
                      initialSettings={{
                        startDate: selectedDateRange.startDate,
                        endDate: selectedDateRange.endDate,
                        ranges: {
                          Today: [moment(), moment()],
                          "Next 7 Days": [moment(), moment().add(6, "days")],
                          "Next 30 Days": [moment(), moment().add(29, "days")],
                        },
                      }}
                      onCallback={handleDateRangeChange}
                    >
                      <input
                        className="form-control"
                        type="text"
                        style={{ width: 280 }}
                      />
                    </DateRangePicker>
                  </div>
                </div>
              </div>

              {/* Available Slots */}
              <div className="row">
                {Object.entries(groupedSlots).map(([date, slots]) => {
                  const momentDate = moment(date);
                  return (
                    <div key={date} className="col">
                      <div className="schedule-column border rounded p-3 h-100">
                        {/* Day Header */}
                        <div className="text-center mb-3 border-bottom pb-2">
                          <h5 className="mb-1">{momentDate.format("ddd")}</h5>
                          <div className="text-muted">
                            {momentDate.format("DD MMM")}
                          </div>
                        </div>

                        {/* Time Slots */}
                        <div className="d-flex flex-column gap-2">
                          {slots.length > 0 ? (
                            slots.map((slot, index) => {
                              const isPast = new Date(slot.time) < new Date();
                              const isCanceled = slot.status && 
                                               (slot.status.trim().toLowerCase() === "canceled" || 
                                                slot.status.trim().toLowerCase() === "cancelled");
                              
                              // Determine button class based on status
                              let buttonClass = "btn w-100";
                              if (selectedSlot?.time === slot.time) {
                                buttonClass += " btn-success";
                              } else if (isCanceled) {
                                buttonClass += " btn-outline-warning"; // Different style for canceled slots
                              } else {
                                buttonClass += " btn-outline-primary"; // Default for available slots
                              }
                              
                              return (
                                <button
                                  key={index}
                                  className={buttonClass}
                                  onClick={() => handleSlotSelection(slot.time, date)}
                                  disabled={isPast}
                                  style={isPast ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                                  title={isCanceled ? "This slot was previously canceled and is now available" : "Available slot"}
                                >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <span>{formatTime(slot.time)}</span>
                                    {isCanceled && (
                                      <small className="text-muted">
                                        <i className="fas fa-undo-alt ms-1" title="Previously canceled"></i>
                                      </small>
                                    )}
                                  </div>
                                </button>
                              );
                            })
                          ) : (
                            <div className="text-center text-muted">
                              No slots available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected Slot Summary */}
          {selectedSlot && (
            <div className="card mb-4 border-success">
              <div className="card-header bg-success bg-opacity-10">
                <div className="d-flex align-items-center">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  <h5 className="mb-0 text-success">New Appointment Selected</h5>
                </div>
              </div>
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <p className="mb-1"><strong>New Date:</strong> {moment(selectedSlot.date).format("dddd, MMMM DD, YYYY")}</p>
                    <p className="mb-0"><strong>New Time:</strong> {formatTime(selectedSlot.time)}</p>
                    <p className="mb-0 text-muted"><strong>Timezone:</strong> {userTimeZone}</p>
                  </div>
                  <div className="col-md-4 text-end">
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setSelectedSlot(null)}
                    >
                      <i className="fas fa-times me-1"></i>
                      Clear Selection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="card mb-4 border-success">
              <div className="card-body">
                <div className="alert alert-success mb-0" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  {successMessage}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="card mb-4 border-danger">
              <div className="card-body">
                <div className="alert alert-danger mb-0" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {errorMessage}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="d-flex justify-content-between mt-4">
            <Link
              to="/patient/dashboard"
              className="btn btn-outline-secondary btn-lg"
            >
              <i className="fas fa-arrow-left me-2"></i>
              Cancel
            </Link>
            
            <button
              onClick={handleReschedule}
              disabled={!selectedSlot || isRescheduling}
              className={`btn btn-primary btn-lg ${(!selectedSlot || isRescheduling) ? "disabled" : ""}`}
            >
              {isRescheduling ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Rescheduling...
                </>
              ) : (
                <>
                  <i className="fas fa-calendar-check me-2"></i>
                  Confirm Reschedule
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Rescheduling;