import React, { useEffect, useState } from "react";
import axios from "../../../axiosConfig";  
import SidebarNav from "../sidebar";
import Header from "../header";
import { Table, Button, message } from "antd";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";

const RefundRequests = (props) => {
  const [refundRequests, setRefundRequests] = useState([]); // Store invoice data
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const [refresh, setRefresh] = useState(false); // State to trigger re-fetch

  useEffect(() => {
    const fetchrefundRequests = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/refund-requests");
        if (response.data && response.data.refundRequests) {
          setRefundRequests(response.data.refundRequests);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchrefundRequests();
  }, [refresh]); // Re-fetch when refund action occurs

  const handleRefund = async (paymentId) => {
    try {
      const response = await axios.post("/api/payment-refund", { paymentId });
      message.success("Refund processed successfully");
      setRefresh((prev) => !prev); // Trigger re-fetch after refund
    } catch (error) {
      console.error("Error processing refund:", error.message);
      message.error("Failed to process refund");
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
      title: "Request Id",
      dataIndex: "refundRequestId",
      render: (text, record) => (
        <Link to="#" className="text-decoration-none text-primary" style={{cursor: "text", color: "#000"}}>
         <span style={{color: "#000"}}>{record?.refundRequestId ?? "-"}</span> 
        </Link>
      ),
      sorter: (a, b) => a.refundRequestId - b.refundRequestId,
    },
    {
      title: "Payment ID",
      dataIndex: "paymentId",
    },
    // {
    //   title: "Payment Method",
    //   dataIndex: "paymentMethod",
    //   sorter: (a, b) => a.paymentMethod - b.paymentMethod,
    // },
    {
      title: "Appointment ID",
      dataIndex: "appointmentId",
      sorter: (a, b) => a.appointmentId - b.appointmentId,
    },
    {
      title: "Patient",
      dataIndex: "patientDetails",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Image column */}
          <div style={{ marginRight: "12px" }}>
            <Link className="avatar" to="#">
              <img
                className="rounded-circle"
                src={record && record?.patientDetails?.profileImage && record.patientDetails?.profileImage || '/assets/images/doctor-thumb-01.png'}
                alt={record?.patientId}
                width="50"
                height="50"
              />
            </Link>
          </div>
          
          {/* Details column */}
          <div>
            <div>
              <span><strong>ID:</strong> {record?.patientId}</span>
            </div>
            <div>
              <span  className="text-decoration-none" style={{color: "#073b87"}}>
                {record?.patientDetails?.information?.firstName} {record?.patientDetails?.information?.lastName}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    
    {
      title: "Total Amount",
      dataIndex: "amount",
      render: (text, record) => `€ ${record?.paymentDetails?.amount}  `,
      sorter: (a, b) => a.paymentDetails?.amount - b.paymentDetails?.amount,
    },
    {
      title: "Transaction Date",
      dataIndex: "transactionDate",
      render: (text, record) => {
        const date = formatDate(record?.paymentDetails?.transactionDate);
        // const hours = date.getHours();
        // const minutes = date.getMinutes().toString().padStart(2, "0");
        // const seconds = date.getSeconds().toString().padStart(2, "0");
        // const ampm = hours >= 12 ? "PM" : "AM";
        // const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");

        // return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
        //   .toString()
        //   .padStart(2, "0")}/${date.getFullYear()} ${formattedHours}:${minutes}:${seconds} ${ampm}`;

        return `${date}`;

      },
      sorter: (a, b) => new Date(a.paymentDetails?.transactionDate) - new Date(b.paymentDetails?.transactionDate),
    },
    {
      title: "Refund Request Date",
      dataIndex: "refundRequestDate",
      render: (text, record) => {
        const date = formatDate(record?.refundRequestDate);
        // const hours = date.getHours();
        // const minutes = date.getMinutes().toString().padStart(2, "0");
        // const seconds = date.getSeconds().toString().padStart(2, "0");
        // const ampm = hours >= 12 ? "PM" : "AM";
        // const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");

        // return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
        //   .toString()
        //   .padStart(2, "0")}/${date.getFullYear()} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
        return `${date}`;
      },
      sorter: (a, b) => new Date(a.refundRequestDate) - new Date(b.refundRequestDate),
    },
    {
      title: "Initiated By",
      dataIndex: "refundInitiatedBy",
      render: (text, record) => (
        <>
          <span>{record?.refundInitiatedBy?.userType}</span><br></br>
          <span className="text-decoration-none" style={{color: "#073b87"}}>
            {record?.refundInitiatedByDetails?.firstName}  {record?.refundInitiatedByDetails?.lastName}
          </span>
          
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "refundStatus",
      render: (text) => (
        <span className={`badge rounded-pill ${text === "paid" ? "bg-success" : text === "refunded" ? "btn-primary" : text === "expired" ? "bg-danger" : "btn-secondary"}`}>
          {text}
        </span>
      ),
      sorter: (a, b) => a.refundStatus.localeCompare(b.refundStatus),
    },
    {
      title: "Action",
      className: "text-end",
      dataIndex: "",
      render: (record) => (
        <div className="text-end">
          <Button
            type="primary"
            size="small"
            disabled={record?.paymentDetails?.status !== "paid"}
            onClick={() => handleRefund(record?.paymentId)}
            style={{backgroundColor: "#073b87", color: "white"}}
          >
            Refund
          </Button>
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
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">Refund Requests</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Refund Requests</li>
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
                        total: refundRequests.length,
                        showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                      }}
                      style={{ overflowX: "auto" }}
                      columns={columns}
                      dataSource={refundRequests}
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

export default RefundRequests;
