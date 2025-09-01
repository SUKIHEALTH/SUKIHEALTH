import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";
import axios from "../../../../axiosConfig";
import Header from "../../header";
import DoctorFooter from "../../common/doctorFooter/index.jsx";

const Booking = (props) => {
  const [consultantInfo, setConsultantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().startOf("day").toDate(),
    endDate: moment().add(6, "days").endOf("day").toDate(),
  });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const { id: userId } = useParams();

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
  
    // Filter and group only "Available" slots
    slots.forEach((slot) => {
      if (slot.status && slot.status.trim().toLowerCase() === "available") {
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
  
      // Check if the selected slot is already booked
      const isAlreadyBooked = appointments.some((appointment) => {
        const appointmentDate = moment(appointment.appointmentDate).format("YYYY-MM-DD");
        const appointmentTime = moment(appointment.appointmentDate).format("HH:mm");
        const selectedDate = moment(date).format("YYYY-MM-DD");
        const selectedTime = moment(slot).format("HH:mm");

        return (
          appointmentDate === selectedDate &&
          appointmentTime === selectedTime &&
          appointment.status.toLowerCase() !== "cancelled"
        );
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
                <h2 className="breadcrumb-title">Booking</h2>

                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/patient/dashboard">Home</Link>
                  </li>

                  <li className="breadcrumb-item active" aria-current="page">
                    Booking
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="container">
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

          {/* Column Layout for Days and Slots */}
          <div className="card">
            <div className="card-body">
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
                              return (
                                <button
                                  key={index}
                                  className={`btn ${
                                    selectedSlot?.time === slot.time
                                      ? "btn-secondary"
                                      : "btn-outline-secondary"
                                  } w-100`}
                                  onClick={() => handleSlotSelection(slot.time, date)}
                                  disabled={isPast}
                                  style={isPast ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                                >
                                  {formatTime(slot.time)}
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

          {/* Proceed Button */}
          <div className="text-end mt-4">
            <Link
              to={`/patient/checkout/${userId}`}
              className={`btn btn-lg ${!selectedSlot ? "disabled" : ""}`}
              style={{ backgroundColor: "#008080", color: "#fff" }}
              onClick={(e) => {
                if (!selectedSlot) e.preventDefault();
              }}
            >
              Proceed to Pay
            </Link>
          </div>
        </div>
        <div className="text-center mt-3">
  {errorMessage && (
    <div className="alert alert-danger" role="alert">
      {errorMessage}
    </div>
  )}
</div>
      </div>
      
      <DoctorFooter {...props} />
    </>
  );
};

export default Booking;
