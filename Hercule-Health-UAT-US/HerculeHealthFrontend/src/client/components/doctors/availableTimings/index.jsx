import React, { useEffect, useState } from "react";
import Header from "../../header";
import DoctorSidebar from "../sidebar";
import DoctorFooter from "../../common/doctorFooter";
import { Link } from "react-router-dom";
import "../../../assets/css/availableTiming.css";
import axios from "../../../../axiosConfig";
import moment from "moment";

const AvailableTimings = (props) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Get current day of the week and use it as the default selected day
  const getCurrentDay = () => {
    const dayIndex = moment().day();
    // Convert from moment's day index (0=Sunday, 1=Monday) to our days array (0=Monday)
    // If today is Sunday (dayIndex=0), we get the last element (index 6) from our array
    return days[dayIndex === 0 ? 6 : dayIndex - 1];
  };

  const [selectedDay, setSelectedDay] = useState(getCurrentDay());
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = current week, 1 = next week
  const [existingSlots, setExistingSlots] = useState([]); // Existing slots fetched from DB
  const [selectedTimes, setSelectedTimes] = useState({}); // New slots selected by user
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const userId = localStorage.getItem("userData");

  // Fetch available slots for the doctor from the backend
  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/consultant-profile-information/${userId}`
      );
      setExistingSlots(response.data.consultant.availableSlots || []); // Fill slots for each day
    } catch (error) {
      console.error("Error fetching slots:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const generateDefaultTimeSlots = () => {
  const slots = [];
  const startTime = moment().set({ hour: 3, minute: 0, second: 0 }); // Start at 3:00 AM
  const endTime = moment().set({ hour: 20, minute: 30, second: 0 }); // End at 9:00 PM

  while (startTime <= endTime) {
    slots.push(startTime.format("HH:mm")); // Store in 24-hour format
    startTime.add(30, "minutes"); // Increment by 30 minutes
  }
  return slots;
};
  // Convert selected time slot to ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sss+00:00)
  const convertToISOFormat = (time) => {
    // Calculate the target date based on selectedDay and selectedWeek
    const targetDate = getTargetDate(selectedDay, selectedWeek);

    // Set the time portion to the selected time
    targetDate.set({
      hour: moment(time, "HH:mm").hour(),
      minute: moment(time, "HH:mm").minute(),
      second: 0,
      millisecond: 0,
    });

    return targetDate.toISOString();
  };

  // Get the target date based on selected day and week
  const getTargetDate = (day, weekOffset) => {
    // Start with current date
    const currentDate = moment();

    // Find the selected day's date in the target week
    let targetDate = moment().day(days.indexOf(day) + 1); // Convert day name to day index (1-7)

    // If the day has already passed this week and we're viewing current week,
    // or if we explicitly want next week's date, add 1 week
    if ((targetDate.isBefore(currentDate, 'day') && weekOffset === 0) || weekOffset === 1) {
      targetDate.add(1, 'weeks');
    }

    return targetDate;
  };

  // Save to localStorage (updated to store slots per day)
  const saveToLocalStorage = (updatedSlots) => {
    localStorage.setItem("availableSlots", JSON.stringify(updatedSlots));
  };

  // Handle the selection of a time slot for the selected day
  const handleSlotSelection = (slotTime) => {
    // Create a composite key for the day and week
    const dayWeekKey = `${selectedDay}-week${selectedWeek}`;

    // Get the ISO date for the selected day and week
    const targetDate = getTargetDate(selectedDay, selectedWeek);
    const formattedTargetDate = targetDate.format("YYYY-MM-DD");

    // Check if this slot is already booked - if so, don't allow selection
    const isBooked = existingSlots.some(slot => {
      const slotMoment = moment(slot.time);
      return (
        slotMoment.format("HH:mm") === slotTime &&
        slotMoment.format("YYYY-MM-DD") === formattedTargetDate &&
        slot.status === "Booked"
      );
    });

    if (isBooked) {
      return; // Don't allow selection of booked slots
    }

    // Check if the time is in the past for today
    const isPastTime =
      targetDate.format("YYYY-MM-DD") === moment().format("YYYY-MM-DD") &&
      moment(slotTime, "HH:mm").isBefore(moment());

    if (isPastTime) {
      return; // Don't allow selection of past time slots
    }

    const isAlreadySelected = selectedTimes[dayWeekKey]?.includes(slotTime);
    const updatedTimes = isAlreadySelected
      ? {
        ...selectedTimes,
        [dayWeekKey]: selectedTimes[dayWeekKey].filter(
          (time) => time !== slotTime
        ),
      } // Remove if already selected
      : {
        ...selectedTimes,
        [dayWeekKey]: [...(selectedTimes[dayWeekKey] || []), slotTime], // Add if not selected
      };

    setSelectedTimes(updatedTimes);
    saveToLocalStorage(updatedTimes); // Save updated slots to localStorage
  };

  // Handle form submission to save selected time slots for the day
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a composite key for the selected day and week
    const dayWeekKey = `${selectedDay}-week${selectedWeek}`;

    if (
      !selectedTimes[dayWeekKey] ||
      selectedTimes[dayWeekKey].length === 0
    ) {
      alert("Please select at least one time slot");
      return;
    }

    try {
      setLoading(true);

      // Convert selected times to ISO format for the selected day and week
      const isoSelectedTimes = selectedTimes[dayWeekKey].map(convertToISOFormat);

      // Combine existing slots with the newly selected ones (no duplicates)
      const combinedSlots = [
        ...existingSlots.filter(
          (existingSlot) =>
            !isoSelectedTimes.includes(existingSlot.time) // Only include unique times
        ),
        ...isoSelectedTimes.map((isoTime) => ({
          time: isoTime,
          status: "Available", // Set status as 'Available'
        })),
      ];

      // Save the updated slots to the backend
      const response = await axios.put(
        `/api/update-consultant-information/${userId}`,
        {
          availableSlots: combinedSlots,
        }
      );

      if (response.data.message === "User and Consultant records updated successfully.") {
        setExistingSlots(combinedSlots); // Update the existing slots with combined slots
        setSelectedTimes({ ...selectedTimes, [dayWeekKey]: [] }); // Reset selected times
        setShowModal(false); // Hide the modal
      }
    } catch (error) {
      console.error("Error saving slots:", error);
      alert("Failed to save selected slots");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the day selection
  const handleDaySelection = (day) => {
    const currentDate = moment();
    const selectedDayDate = moment().day(days.indexOf(day) + 1); // Convert day name to day index (1-7)

    // If the selected day has already passed this week, automatically switch to next week view
    if (selectedDayDate.isBefore(currentDate, 'day')) {
      setSelectedWeek(1); // Set to next week
    } else {
      setSelectedWeek(0); // Stay on current week
    }

    setSelectedDay(day);
  };

  // Function to toggle between current week and next week
  const toggleWeekView = () => {
    setSelectedWeek(selectedWeek === 0 ? 1 : 0);
  };

  // Render available days in the tab
  const renderAvailableDays = () => {
    return days.map((day) => {
      return (
        <li key={day}>
          <Link
            to="#"
            className={day === selectedDay ? "active" : ""}
            data-bs-toggle="tab"
            onClick={() => handleDaySelection(day)}
          >
            {day}
          </Link>
        </li>
      );
    });
  };

  // Render available slots for the selected day and selected week
  const renderDayContent = (day, weekOffset) => {
    const defaultSlots = generateDefaultTimeSlots();
    const currentTime = moment();

    // Get the date for the selected day in the selected week
    const targetDate = getTargetDate(day, weekOffset);
    const formattedTargetDate = targetDate.format("YYYY-MM-DD");
    const isToday = formattedTargetDate === moment().format("YYYY-MM-DD");

    // Create a composite key for the day and week
    const dayWeekKey = `${day}-week${weekOffset}`;

    // Format date for display
    const displayDate = targetDate.format("MMM DD, YYYY");

    return (
      <div className="slot-box">
        <div className="slot-header">
          <h5>{day} - {displayDate}</h5>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={toggleWeekView}
          >
            Show {weekOffset === 0 ? "Next" : "Current"} Week
          </button>
        </div>
        <div className="slot-body">
          <ul className="time-slots">
            {defaultSlots.map((slotTime, index) => {
              // Check if this time slot is already in the existing slots for this specific date
              const existingSlot = existingSlots.find(slot => {
                const slotMoment = moment(slot.time);
                return (
                  slotMoment.format("HH:mm") === slotTime &&
                  slotMoment.format("YYYY-MM-DD") === formattedTargetDate
                );
              });

              // Check if the slot is booked
              const isBooked = existingSlot && existingSlot.status === "Booked";

              // Check if the slot is already in the database as Available
              const isAvailable = existingSlot && existingSlot.status === "Available";

              // Check if the slot is newly selected by user
              const isNewlySelected = selectedTimes[dayWeekKey]?.includes(slotTime);

              // Check if the slot time is in the past (for today only)
              const isPastTime = isToday && moment(slotTime, "HH:mm").isBefore(currentTime);

              // Determine the CSS class based on the slot status
              let slotClass = "";
              let statusText = "";
              let statusIcon = "fa-regular fa-clock";

              if (isBooked) {
                slotClass = "slot-booked";
                statusText = "Booked";
                statusIcon = "fa-solid fa-lock";
              } else if (isPastTime) {
                slotClass = "slot-past";
                statusText = "Past";
                statusIcon = "fa-solid fa-clock-rotate-left";
              } else if (isAvailable) {
                slotClass = "slot-available";
                statusText = "Selected";
                statusIcon = "fa-solid fa-check";
              } else if (isNewlySelected) {
                slotClass = "slot-selected";
                statusText = "New Selection";
                statusIcon = "fa-solid fa-plus";
              }

              return (
                <li
                  key={index}
                  className={`slot-item ${slotClass}`}
                  onClick={() => !isBooked && !isPastTime && handleSlotSelection(slotTime)}
                  style={{ cursor: (isBooked || isPastTime) ? "not-allowed" : "pointer" }}
                >
                  <div className="slot-time-info">
                    <i className={statusIcon} />
                    <span className="slot-time">{slotTime}</span>
                  </div>
                  <div className="slot-status">
                    <span className="slot-status-text">{statusText}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="main-wrapper">
        <Header {...props} />
        <div className="breadcrumb-bar-two">
          <div className="container">
            <div className="row align-items-center inner-banner">
              <div className="col-md-12 col-12 text-center">
                <h2 className="breadcrumb-title">Available Timings</h2>
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
                <div className="card custom-card">
                  <div className="card-body">
                    <div className="card-header">
                      <h3>Select Available Slots</h3>

                      <div className="week-indicator">
                        <span className="badge bg-primary">
                          {selectedWeek === 0 ? "Current Week" : "Next Week"}
                        </span>
                      </div>
                    </div>
                    <div className="available-tab">
                      <label className="form-label">Select Available Days</label>
                      <p className="timezone-info text-primary">
                        All the time slots shown are in your local time zone.
                      </p>
                      <ul className="nav">
                        {renderAvailableDays()}
                      </ul>
                    </div>
                    <div className="tab-content pt-0">
                      <div className="tab-pane active show">
                        {renderDayContent(selectedDay, selectedWeek)}
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
<button
                      className="btn"
                      onClick={() => setShowModal(true)}
                      style={{ backgroundColor: "#008080", color: "#fff"}}
                    >
                      Save Selected Slots
                    </button>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DoctorFooter />
      </div>

      {showModal && (
        <div className="react-modal-overlay">
          <div className="react-modal">
            <div className="modal-header">
              <h5 className="modal-title">Add Slot</h5>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label>Selected Times</label>
                      {/* Display the day and date for clarity */}
                      <p>
                        <strong>{selectedDay} - {getTargetDate(selectedDay, selectedWeek).format("MMM DD, YYYY")}</strong>
                      </p>
                      <ul>
                        {selectedTimes[`${selectedDay}-week${selectedWeek}`]?.map((time, idx) => (
                          <li key={idx}>{time}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Slots"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Add CSS styles */}
      <style jsx>{`
        .react-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .react-modal {
          background: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #ddd;
          padding-bottom: 15px;
          margin-bottom: 15px;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          padding: 0 8px;
        }

        .modal-footer {
          margin-top: 20px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          border-top: 1px solid #ddd;
          padding-top: 15px;
        }

        /* Slot styles */
        .time-slots {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 10px;
          padding: 0;
          list-style: none;
        }

        .slot-item {
          border-radius: 6px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          border: 1px solid #ddd;
          height: 75px;
        }

        .slot-time-info {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 4px;
        }

        .slot-time {
          font-weight: 500;
          font-size: 14px;
        }

        .slot-status {
          margin-top: 3px;
          width: 100px
        }

        .slot-status-text {
          font-size: 12px;
          font-weight: 600;
          border-radius: 12px;
          padding: 2px 8px;
        }

        /* Specific slot state styles */
        .slot-booked {
          background-color: #fff2f2;
          border-color: #ffcccc;
          pointer-events: auto;
          position: relative;
        }
        
        .slot-booked .slot-status-text {
          background-color: #ffdddd;
          color: #e53935;
        }
        
        .slot-booked .fa-lock {
          color: #e53935;
        }

        .slot-available {
          background-color: #f0f8ff;
          border-color: #b3e0ff;
        }
        
        .slot-available .slot-status-text {
          background-color: #d4edff;
          color: #0277bd;
        }
        
        .slot-available .fa-check {
          color: #0277bd;
        }

        .slot-selected {
          background-color: #f1f8e9;
          border-color: #c5e1a5;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .slot-selected .slot-status-text {
          background-color: #dcedc8;
          color: #43a047;
        }
        
        .slot-selected .fa-plus {
          color: #43a047;
        }

        .slot-past {
          background-color: #f5f5f5;
          border-color: #e0e0e0;
          opacity: 0.7;
          pointer-events: auto;
        }
        
        .slot-past .slot-status-text {
          background-color: #eeeeee;
          color: #9e9e9e;
        }
        
        .slot-past .fa-clock-rotate-left {
          color: #9e9e9e;
        }

        .slot-item:hover:not(.slot-booked):not(.slot-past) {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .slot-header {
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
          margin-bottom: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .slot-header h5 {
          color: #333;
          font-weight: 600;
          margin: 0;
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .week-indicator {
          display: flex;
          align-items: center;
        }

        .timezone-info {
    font-size: 0.85rem; /* Adjust the size */
    font-style: italic; /* Make it italic */
    color: #6c757d; /* Optional: Add a subtle gray color */
  }
      `}</style>
    </>
  );
};

export default AvailableTimings;