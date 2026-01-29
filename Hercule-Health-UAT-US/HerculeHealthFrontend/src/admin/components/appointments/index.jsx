import React, { useEffect, useState } from "react";
import { Table, Spin, Button, Modal, message } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import axios from "../../../axiosConfig";  // Assuming axiosConfig is set up correctly
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import SidebarNav from "../sidebar";
import { Link } from "react-router-dom";
import moment from "moment-timezone"; // Import moment with timezone support
import Header from "../header";
const userId = localStorage.getItem("userData");

const Appointments = (props) => {
  const [appointments, setAppointments] = useState([]); // To store appointments data
  const [loading, setLoading] = useState(true); // To show a loading spinner while fetching
  const [cancelLoading, setCancelLoading] = useState(null); // To track which appointment is being cancelled

  useEffect(() => {
    // Fetch appointments when component mounts
    fetchAppointments();
  }, []); // Empty dependency array ensures this runs only once

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Call your API endpoint to get appointments
      const response = await axios.post('/api/get-all-appointments');
      if (response.data) {
        setAppointments(response.data); // Store fetched data
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      message.error("Failed to fetch appointments");
    } finally {
      setLoading(false); // Set loading to false after the API call
    }
  };

  // Function to handle appointment cancellation
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
            userType:"admin",
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

  const canCancelAppointment = (appointmentDate) => {
  
    const appointmentTime = new Date(appointmentDate);
    const now = new Date();
  
    // Convert both times to UTC for consistent comparison
    const appointmentUTC = new Date(appointmentTime.toISOString());
    const nowUTC = new Date(now.toISOString());
  
    // If appointment is already in the past — no cancel button
    if (appointmentUTC <= nowUTC) {
      return false;
    }
  
    // Show cancel button if now is between deadlineTime and appointmentTime
    if (nowUTC < appointmentUTC) {
      return true;
    }
  
    return false;
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

  // Define the columns for the table
  const columns = [
    {
      title: "Doctor Name",
      dataIndex: "consultantDetails",
      render: (text, record) => (
        <>
          <Link className="avatar mx-2" to="#">
            <img 
              className="rounded-circle" 
              src={record.consultantDetails?.profileImage || '/assets/images/doctor-thumb-01.png'} 
              alt={record.consultantId} 
              style={{cursor: "none"}}
            />
          </Link> 
          <span className="text-decoration-none"style={{color: "#073b87"}}>
            Dr.{record.consultantDetails?.information?.firstName}  {record.consultantDetails?.information?.lastName}
          </span>
        </>
      ),
      sorter: (a, b) => a.consultantId.length - b.consultantId.length,
    },
    
    {
      title: "Patient Name",
      dataIndex: "patientDetails",
      render: (text, record) => (
        <>
          <Link className="avatar mx-2" to="#">
            <img 
              className="rounded-circle" 
              src={record.patientDetails?.profileImage || '/assets/images/doctor-thumb-01.png'} 
              alt={record.patientId} 
              style={{cursor: "none"}}
            />
          </Link>
          <span style={{color: "#073b87"}}>
            {record.patientDetails?.information?.firstName} {record.patientDetails?.information?.lastName}
          </span>
        </>
      ),
      sorter: (a, b) => a.patientId.length - b.patientId.length,
    },
    {
      title: "Appointment Date and Time",
      render: (record) => {
        const appointmentDate = formatDate(record.appointmentDate);
        if (appointmentDate) {
          // const formattedDate = moment(appointmentDate).tz("Asia/Kolkata").format("MMMM Do YYYY");
          // const startTime = moment(appointmentDate).tz("Asia/Kolkata").format("h:mm A");
          // const endTime = moment(appointmentDate).tz("Asia/Kolkata").add(30, 'minutes').format("h:mm A");
          return (
            <>
              <span className="user-name">{appointmentDate}</span>
              <br />
              {/* <span className="d-block">{startTime} - {endTime}</span> */}
            </>
          );
        } else {
          return <span className="user-name">Time not available</span>;
        }
      },
      sorter: (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span className={`badge ${status === 'cancelled' ? 'badge-danger' : 'badge-success'}`}>
          {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Active'}
        </span>
      ),
      sorter: (a, b) => (a.status || '').localeCompare(b.status || ''),
    },
    {
      title: "Appointment Link",
      dataIndex: "appointmentLink",
      render: (text, record) => {
        if (record.status === 'cancelled') {
          // return <span className="text-muted">Cancelled</span>;
        }
        return <a href={text} target="_blank" rel="noopener noreferrer" style = {{ color: "#298080", cursor:"pointer"}}><strong>Join</strong></a>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="d-flex gap-2">
          {record.status !== 'cancelled' && canCancelAppointment(record.appointmentDate) && (
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
              loading={cancelLoading === record.appointmentId}
              onClick={() => handleCancelAppointment(record.appointmentId)}
            >
              Cancel
            </Button>
          )}
          
        </div>
      ),
    },
  ];

  return (
    <>
      <Header {...props} />
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">Appointments</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Appointments</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <Table
                    loading={loading}
                    pagination={{
                      total: appointments?.appointments?.length || appointments?.length,
                      showTotal: (total, range) =>
                        `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                      showSizeChanger: true,
                      onShowSizeChange: onShowSizeChange,
                      itemRender: itemRender,
                    }}
                    style={{ overflowX: "auto" }}
                    columns={columns}
                    dataSource={appointments.appointments || appointments || []} // Handle both response formats
                    rowKey={(record) => record._id || record.appointmentId} // Ensure to use unique identifiers
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointments;