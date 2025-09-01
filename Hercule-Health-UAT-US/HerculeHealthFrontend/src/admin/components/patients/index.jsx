import React, { useEffect, useState } from "react";
import { Table } from "antd";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import SidebarNav from "../sidebar";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import axios from "../../../axiosConfig";  // Import axios for API requests
import Header from "../header";

const Patients = (props) => {
  const [data, setData] = useState([]); // State to store patient data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.post("/api/all-patients");
        console.log('patients',response.data.data);
        // Assuming the response structure is like { message: 'Patients fetched successfully', data: patientsData }
        setData(response.data.data);  // Set data to the state
        setLoading(false);  // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setLoading(false); // Set loading to false even on error
      }
    };

    fetchData();  // Call fetchData function on component mount
  }, []);

  // Define columns for the table
  const columns = [
    {
      title: "Patient ID",
      dataIndex: "userId",  // Assuming patient data now contains userId
      sorter: (a, b) => a.userId - b.userId,
    },
    {
      title: "Patient Name",
      dataIndex: "information",  // Use information for first and last name
      render: (text, record) => (
        <>
          <Link className="avatar mx-2" to="#">
            <img style={{cursor: "none"}} className="rounded-circle" src={record.profileImage ? record.profileImage : "/assets/images/doctor-thumb-01.png"} alt="Profile" />
          </Link>
          <span style={{color: "#073b87"}}>{`${record.information.firstName} ${record.information.lastName}`}</span>
        </>
      ),
      sorter: (a, b) => a.information.firstName.length - b.information.firstName.length,
    },
    {
      title: "Age",
      dataIndex: "information",  // Access age from information
      render: (text,record) => <>{record.information.age}</>,
      sorter: (a, b) => a.information.age - b.information.age,
    },
    {
      title: "Address",
      dataIndex: "address",  // Assuming address is directly within patient data
      render: (text) => (
        <>{text ? `${text.address}, ${text.city}, ${text.state}, ${text.country}` : "N/A"}</>
      ),
      sorter: (a, b) => a.address.city.length - b.address.city.length,
    },
    {
      title: "Phone",
      dataIndex: "information",  // Access phone from information
      render: (text,record) => (
        <>{record.information.phone}</>
      ),
      sorter: (a, b) => a.information.phone.length - b.information.phone.length,
    },
    {
      title: "Email",
      dataIndex: "information",  // Access email from information
      render: (text,record) => (
        <>{record.information.email}</>
      ),
      sorter: (a, b) => a.information.email.length - b.information.email.length,
    },
    // {
    //   title: "Last Visit",
    //   dataIndex: "lastVisit",  // Assuming last visit info is available
    //   sorter: (a, b) => a.lastVisit - b.lastVisit,
    // },
    // {
    //   title: "Paid",
    //   dataIndex: "paidStatus",  // Assuming there's a paid status field
    //   sorter: (a, b) => a.paidStatus - b.paidStatus,
    // },
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
                <h3 className="page-title">List of Patients</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">List of Patients</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <Table
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
                      rowKey={(record) => record.userId}  // Use userId as the unique key
                      loading={loading}  // Show loading spinner while data is being fetched
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

export default Patients;
