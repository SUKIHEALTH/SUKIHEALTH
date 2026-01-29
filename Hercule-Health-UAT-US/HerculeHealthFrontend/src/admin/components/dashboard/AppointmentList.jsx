import React, { useEffect, useState } from "react";
import { Table } from "antd";
import axios from "../../../axiosConfig";  // Assuming axiosConfig is set up correctly
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import moment from "moment-timezone"; // Import moment with timezone support

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]); // To store appointments data
  const [loading, setLoading] = useState(true); // To show a loading spinner while fetching

  useEffect(() => {
    // Fetch appointments when component mounts
    const fetchAppointments = async () => {
      try {
        // Call your API endpoint to get appointments
        const response = await axios.get('/api/get-all-appointments');
        setAppointments(response.data); // Store fetched data
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false); // Set loading to false after the API call
      }
    };

    fetchAppointments();
  }, []); // Empty dependency array ensures this runs only once

  const columns = [
    {
      title: "Doctor Name",
      dataIndex: "consultantId", // Using consultantId
      render: (text, record) => (
        <>
          <Link className="avatar mx-2" to="/admin/profile">
            <img className="rounded-circle" src={record.consultantImage || ''} alt={record.consultantId} />
          </Link>
          <Link to="/admin/profile" className="text-decoration-none">
            {record.consultantId} {/* Displaying consultantId as placeholder */}
          </Link>
        </>
      ),
      sorter: (a, b) => a.consultantId.length - b.consultantId.length,
    },
    {
      title: "Speciality",
      dataIndex: "speciality", // Assuming speciality exists in the record (can be adjusted)
      sorter: (a, b) => a.speciality.length - b.speciality.length,
    },
    {
      title: "Patient Name",
      dataIndex: "patientId", // Using patientId
      render: (text, record) => (
        <>
          <Link className="avatar mx-2" to="/admin/profile">
            <img className="rounded-circle" src={record.patientImage || ''} alt={record.patientId} />
          </Link>
          <Link to="/admin/profile">{record.patientId}</Link> {/* Displaying patientId as placeholder */}
        </>
      ),
      sorter: (a, b) => a.patientId.length - b.patientId.length,
    },
    {
      title: "Appointment Date and Time",
      render: (record) => {
        const appointmentDate = record.appointmentDate; // Start time from the API response
        
        // If appointmentDate exists, convert it to 'Asia/Kolkata' timezone and format it
        if (appointmentDate) {
          // Calculate the formatted date (including day, month, year) in 'Asia/Kolkata' timezone
          const formattedDate = moment(appointmentDate).tz("Asia/Kolkata").format("MMMM Do YYYY"); // "January 12th, 2025"
    
          // Calculate the start time (already converted to 'Asia/Kolkata' timezone)
          const startTime = moment(appointmentDate).tz("Asia/Kolkata").format("h:mm A");
    
          // Calculate the end time by adding 30 minutes to the start time
          const endTime = moment(appointmentDate).tz("Asia/Kolkata").add(30, 'minutes').format("h:mm A");
    
          // Return the formatted date, start time, and end time
          return (
            <>
              <span className="user-name">{formattedDate}</span> {/* Display the formatted date */}
              <br />
              <span className="d-block">{startTime} - {endTime}</span> {/* Display the start and calculated end time */}
            </>
          );
        } else {
          return <span className="user-name">Time not available</span>; // Fallback if the time is unavailable
        }
      },
      sorter: (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate), // Sort by the appointment date
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <div className="status-toggle">
          <input
            className="check"
            type="checkbox"
            checked={text === 'Scheduled'} // Check if the status is 'Scheduled'
            readOnly
          />
          <label className="checktoggle checkbox-bg">
            checkbox
          </label>
        </div>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: "Appointment Link",
      dataIndex: "appointmentLink",
      render: (text) => <a href={text} target="_blank" rel="noopener noreferrer">Join</a>, // Display the appointment link
    },
  ];

  if (loading) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card card-table">
          <div className="card-header">
            <h4 className="card-title">Appointment List</h4>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <Table
                pagination={{
                  total: appointments.length,
                  showTotal: (total, range) =>
                    `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                  showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                  itemRender: itemRender,
                }}
                style={{ overflowX: "auto" }}
                columns={columns}
                dataSource={appointments}
                rowKey={(record) => record._id} // Ensure to use unique identifiers like _id or id
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentList;
