import React, { useEffect, useState } from "react";
import { Table } from "antd";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import SidebarNav from "../sidebar";
import {
  doctor_thumb_01,
  doctor_thumb_02,
  doctor_thumb_03,
  doctor_thumb_04,
  doctor_thumb_05,
  doctor_thumb_06,
  doctor_thumb_07,
  doctor_thumb_08,
  doctor_thumb_09,
  doctor_thumb_10,
} from "../imagepath";
import { Link } from "react-router-dom";
import baseUrl from "../../../config/config";
import axios from "../../../axiosConfig"
import Header from "../header";
 
 
const Doctors = (props) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    const fetchDoctorsData = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.post(`/api/all-consultants`);
        setData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctors data:", error);
        setLoading(false);
      }
    };
 
    fetchDoctorsData();
  }, []); // Empty
 
  const handleStatusChange = async (userId, newStatus) => {
    try {
      const response = await axios.put(`/api/consultant-approval/${userId}`, {
        ConsultantApprovalRequired: newStatus,
      });
 
      if (response.status === 200) {
        console.log("Status updated successfully");
 
        // Update the local data state
        setData((prevData) =>
          prevData.map((record) =>
            record.userId === userId
              ? { ...record, ConsultantApprovalRequired: newStatus }
              : record
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
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
 
  const columns = [
    {
      title: "Doctor Name",
      dataIndex: "information",
      render: (info, record) => (
        <>
          <Link className="avatar mx-2" to="#">
            <img
              className="rounded-circle"
              src={record?.profileImage ? record.profileImage : "/assets/images/doctor-thumb-01.png"} // Fallback image
              alt={info?.displayName || "Doctor"}
              style={{cursor: "none"}}
            />
          </Link>
          <span to="#" style={{color: "#073b87"}}>{info?.displayName || `${info?.firstName} ${info?.lastName}`}</span>
        </>
      ),
      sorter: (a, b) => a.information.displayName.localeCompare(b.information.displayName),
    },
    {
      title: "Designation",
      dataIndex: "information",
     render: (info) => info?.designation || "N/A",
    sorter: (a, b) => (a.information.designation || "").localeCompare(b.information.designation || ""),
    },
    {
      title: "Member Since",
      render: (record) => (
        <>
          <span className="user-name">{formatDate(record.createdAt)}</span>
          

          {/* <span>{new Date(record.createdAt).toLocaleTimeString()}</span> */}
        </>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Email",
      dataIndex: "information",
      render: (user) => user.email,
      sorter: (a, b) => a.user.email.localeCompare(b.user.email),
    },
    {
      title: "Account Status",
      dataIndex: "ConsultantApprovalRequired",
      render: (status, record) => (
        <div className="status-toggle">
          <input
            id={`status-toggle-${record.userId}`} // Use a unique ID based on userId
            className="check"
            type="checkbox"
            checked={status} // Controlled component
            onChange={(e) => handleStatusChange(record.userId, e.target.checked)}
          />
          <label
            htmlFor={`status-toggle-${record.userId}`} // Match the ID in the label
            className="checktoggle checkbox-bg"
          >
            checkbox
          </label>
        </div>
      ),
      sorter: (a, b) => a.ConsultantApprovalRequired - b.ConsultantApprovalRequired,
    }
   
  ];
  // console.log(`this is info `,info);
 
 
  return (
    <>
    <Header {...props} />
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">
                  List of Doctors who registered in Hercule Health
                </h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">List of Doctors</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <Table
                      loading={loading}
                      pagination={{
                        total: data.length,
                        showTotal: (total, range) =>
                          `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                      }}
                      style={{ overflowX: "auto" }}
                      columns={columns}
                      dataSource={data}
                      rowKey={(record) => record._id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
 
export default Doctors;