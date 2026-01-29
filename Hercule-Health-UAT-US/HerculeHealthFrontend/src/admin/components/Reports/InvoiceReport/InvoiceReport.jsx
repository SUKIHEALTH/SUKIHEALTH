import React, { useEffect, useState } from "react";
import axios from "../../../../axiosConfig";  
import SidebarNav from "../../sidebar";
import Header from "../../header";
import { Table, Button, message } from "antd";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import { itemRender, onShowSizeChange } from "../../paginationfunction";
import { Link } from "react-router-dom";

const InvoiceReport = (props) => {
  const [invoices, setInvoices] = useState([]); // Store invoice data
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const [refresh, setRefresh] = useState(false); // State to trigger re-fetch

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/get-all-payments");
        if (response.data && response.data.payments) {
          setInvoices(response.data.payments);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
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
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      render: (text, record) => (
        <span style={{color: "#000"}} className="text-decoration-none text-primary">
          <span style={{color: "#000"}}>#{record.invoiceNumber}</span>
        </span>
      ),
      sorter: (a, b) => a.invoiceNumber - b.invoiceNumber,
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
      title: "Patient ID",
      dataIndex: "patientId",
      sorter: (a, b) => a.patientId - b.patientId,
    },
    {
      title: "Patient",
      dataIndex: "patientDetails",
      render: (text, record) => (
        <>
          <Link className="avatar mx-2" to="#" >
            <img style={{cursor: "none"}} className="rounded-circle" src={record && record.patientDetails?.profileImage && record.patientDetails?.profileImage  || '/assets/images/doctor-thumb-01.png'} alt={record.patientId} />
          </Link>
          <span style={{color: "#073b87"}} className="text-decoration-none">
            {record.patientDetails.firstname}  {record.patientDetails.lastname}
          </span>
          
        </>
      ),
      sorter: (a, b) => a.consultantId.length - b.consultantId.length,
    },
    {
      title: "Total Amount",
      dataIndex: "amount",
      render: (text, record) => `€ ${record.amount}  `,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Transaction Date",
      dataIndex: "transactionDate",
      render: (text) => {
        const date = formatDate(text);
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
      sorter: (a, b) => new Date(a.transactionDate) - new Date(b.transactionDate),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span className={`badge rounded-pill ${text === "paid" ? "bg-success" : text === "refunded" ? "btn-primary" : text === "expired" ? "bg-danger" : "btn-secondary"}`}>
          {text}
        </span>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
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
            disabled={record.status !== "paid"}
            onClick={() => handleRefund(record.paymentId)}
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
                <h3 className="page-title">Invoice Report</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Invoice Report</li>
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
                        total: invoices.length,
                        showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                      }}
                      style={{ overflowX: "auto" }}
                      columns={columns}
                      dataSource={invoices}
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

export default InvoiceReport;
