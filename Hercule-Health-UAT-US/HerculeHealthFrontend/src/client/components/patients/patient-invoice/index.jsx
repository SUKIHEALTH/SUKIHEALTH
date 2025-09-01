import React, { useEffect, useState, useRef } from 'react'
import Header from '../../header'
import { Link } from "react-router-dom";
import { doctor_thumb_01, doctor_thumb_02, doctor_thumb_03, doctor_thumb_05, doctor_thumb_07, doctor_thumb_08, doctor_thumb_09, logo } from '../../imagepath';
import axios from "../../../../axiosConfig";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DoctorFooter from "../../common/doctorFooter/index.jsx";
import DashboardSidebar from '../dashboard/sidebar/sidebar';

const PatientInvoice = (props) => {
  const [paymentDetails, setPaymentDetails] = useState([]);  
  const [selectedPayment, setSelectedPayment] = useState(null); // State for selected payment
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId =  localStorage.getItem("userData")
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const invoiceRef = useRef(null); // Ref for the invoice section
  const [adminSettings, setAdminSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("/api/get-admin-settings");
        setAdminSettings(response.data.setting);
      } catch (err) {
        // Optionally handle error
      } finally {
        setSettingsLoading(false);
      }
    };
    fetchSettings();
  }, []);
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
       const response = await axios.post(`/api/get-patient-payments/${userId}`,
        {
          pageNumber,
          pageSize: 6,
        }

       );
        
       console.log("payment Details of", response.data);
       

        setTotalPages(response.data.pagination.totalPages);
        setPaymentDetails(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [pageNumber]);
  console.log(">><<",paymentDetails)
 
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPageNumber(newPage);
    }
  };

  
  

   // Function to Download PDF
   const handleDownloadPDF = async () => {
    const invoiceElement = invoiceRef.current;
    if (!invoiceElement) return;
    const canvas = await html2canvas(invoiceElement);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save("hercule_health_invoice.pdf");
  };

  let appointmentFee = 0, serviceCharge = 0, taxPercentage = 0, taxAmount = 0, subtotal = 0, totalAmount = 0;
  if (selectedPayment && adminSettings) {
    appointmentFee = Number(adminSettings.appointmentFee || 0);
    serviceCharge = Number(adminSettings.serviceCharge || 0);
    taxPercentage = Number(adminSettings.taxPercentage || 0);
    taxAmount = (appointmentFee * taxPercentage) / 100;
    subtotal = appointmentFee;
    totalAmount = appointmentFee + serviceCharge + taxAmount;
  }

  return (
    <>
    <div className='main-wrapper'>
      <Header {...props} />
      {/* Breadcrumb */}
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Invoices</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/patient/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Invoices
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}
      {/* Page Content */}
      <div className="content doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              {/* Profile Sidebar */}
             <DashboardSidebar/>
              {/* /Profile Sidebar */}
            </div>
            {/* Invoices */}
            <div className="col-lg-8 col-xl-9">
              <div className="dashboard-header">
                <h3>Invoices</h3>
              </div>
              <div className="search-header">
                <div className="search-field" style={{visibility:"hidden"}}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                  />
                  <span className="search-icon">
                    <i className="fa-solid fa-magnifying-glass" />
                  </span>
                </div>
              </div>
              <div className="custom-table">
                <div className="table-responsive">
                <table className="table table-center mb-0">
  <thead>
    <tr>
      <th>Transaction ID</th>
      <th>Payment ID</th>
      <th>Appointment ID</th>
      <th>Transaction Date</th>
      <th>Amount</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {paymentDetails && paymentDetails?.payments?.map((item, index) => (
      <tr key={index}>
        <td>
          <Link
            to="#"
            className="text-blue-600"
            data-bs-toggle="modal"
            data-bs-target="#invoice_view"
          >
            {item.transactionId}
          </Link>
        </td>
        <td>{item.paymentId}</td>
        <td>{item.appointmentId}</td>
        <td>{new Date(item.transactionDate).toLocaleString()}</td>
        <td>€{item.amount},00 </td>
        <td>
          <span
            className={`status-badge ${
              item.status === "paid"
                ? "badge-green"
                : item.status === "refunded"
                ? "badge-blue"
                :item.status === "expired"
                ? "badge-orange"
                :item.status === "failed"
                ? "badge-red"
                : "badge-grey"
            }`}
          >
            {item.status}
          </span>
        </td>
        <td>
          <div className="action-item">
            <Link
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#invoice_view"
              onClick={() => setSelectedPayment(item)}
              title='View Invoice'
            >
              <i className="fa-solid fa-link" />
            </Link>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
                </div>
              </div>
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
              {/* /Pagination */}
            </div>
            {/* /Invoices */}
          </div>
        </div>
      </div>
      {/* /Page Content */}
      
      <DoctorFooter {...props} />

    </div>
     {/*View Invoice */}
  <div className="modal fade custom-modals" id="invoice_view">
  <div
    className="modal-dialog modal-dialog-centered modal-lg"
    role="document"
  >
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title">View Invoice</h3>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        >
          <i className="fa-solid fa-xmark" />
        </button>
      </div>
      <div className="modal-body pb-0">
      {selectedPayment ? (
        <>
          <div className="prescribe-download">
            <h5>
              {new Date(selectedPayment.transactionDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
              </h5>
            <ul>
              <li>
                {/* <Link to="#" className="print-link" onClick={handlePrint}>
                  <i className="fa-solid fa-print" />
                </Link> */}
              </li>
              <li>
                <Link to="#" className="btn btn-primary prime-btn" onClick={handleDownloadPDF}>
                  Download
              </Link>
              </li>
            </ul>
          </div>
          <div className="view-prescribe invoice-content " ref={invoiceRef}>
            <div className="invoice-item">
              <div className="row">
                <div className="col-md-6">
                  <div className="invoice-logo">
                    <img src={logo} alt="logo" />
                  </div>
                </div>
                <div className="col-md-6">
                  <p className="invoice-details">
                    <strong>Invoice No: </strong> #{selectedPayment.invoiceNumber}
                    <br />
                    <strong>Issued: </strong> 
                    {new Date(selectedPayment.transactionDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    <br />
                    <strong>Status: </strong> {selectedPayment.status}
                  </p>
                </div>
              </div>
            </div>
            {/* Invoice Item */}
            <div className="invoice-item">
              <div className="row">
                <div className="col-md-4">
                  <div className="invoice-info">
                    <h6 className="customer-text"> From</h6>
                    <p className="invoice-details invoice-details-two">
                    {selectedPayment.patientDetails.firstname} {selectedPayment.patientDetails.lastname}
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="invoice-info">
                    <h6 className="customer-text"> To</h6>
                    <p className="invoice-details invoice-details-two">
                      Hercule Health
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="invoice-info invoice-info2">
                    <h6 className="customer-text">Payment Method</h6>
                    <p className="invoice-details">
                      {selectedPayment.paymentMethod} 
                      <br />
                    </p><br />
                    <p className='invoice-details'>
                    <strong>Payment Id: </strong> #{selectedPayment.paymentId}
                    </p>
                    <p className='invoice-details'>
                    <strong>Transaction Id: </strong> #{selectedPayment.transactionId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Invoice Item */}
            <div className="invoice-item invoice-table-wrap">
              <div className="row">
                <div className="col-md-12">
                  <h6>Invoice Details</h6>
                  <div className="table-responsive">
                    <table className="invoice-table table table-bordered">
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Appointment fee</td>
                          <td>€ {appointmentFee.toFixed(2)}</td>
                        </tr>
                        {serviceCharge > 0 && (
                          <tr>
                            <td>Service Charge</td>
                            <td>€ {serviceCharge.toFixed(2)}</td>
                          </tr>
                        )}
                        {taxAmount > 0 && (
                          <tr>
                            <td>Tax ({taxPercentage}%)</td>
                            <td>€ {taxAmount.toFixed(2)}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="col-md-5 col-xl-5 ms-auto">
                  <div className="table-responsive">
                    <table className="invoice-table-two table">
                      <tbody>
                        <tr>
                          <th>Subtotal: </th>
                          <td>
                            <span>€ {appointmentFee.toFixed(2)}</span>
                          </td>
                        </tr>
                        {serviceCharge > 0 && (
                          <tr>
                            <th>Service Charge:</th>
                            <td>
                              <span>€ {serviceCharge.toFixed(2)}</span>
                            </td>
                          </tr>
                        )}
                        {taxAmount > 0 && (
                          <tr>
                            <th>Tax ({taxPercentage}%):</th>
                            <td>
                              <span>€ {taxAmount.toFixed(2)}</span>
                            </td>
                          </tr>
                        )}
                        <tr>
                          <th>Total Amount: </th>
                          <td>
                            <span>€ {totalAmount.toFixed(2)}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {/* /Invoice Item */}
            {/* Invoice Information */}
            {/* <div className="other-info mb-0">
              <h4>Other information</h4>
              <p className="text-muted mb-0">
                An account of the present illness, which includes the
                circumstances surrounding the onset of recent health changes and
                the chronology of subsequent events that have led the patient to
                seek medicine
              </p>
            </div> */}
            {/* /Invoice Information */}
          </div>
        </>
        ) : (
          <p>No payment selected</p>
        )}
      </div>
    </div>
  </div>
</div>

{/* /View Invoice */}
</>
  )
}

export default  PatientInvoice