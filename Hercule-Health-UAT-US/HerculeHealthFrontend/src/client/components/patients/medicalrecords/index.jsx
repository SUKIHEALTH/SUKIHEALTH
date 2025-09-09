import React, { useEffect, useRef, useState } from "react";
import DashboardSidebar from "../dashboard/sidebar/sidebar.jsx";
import StickyBox from "react-sticky-box";
import { Link } from "react-router-dom";
import Header from "../../header";
import DoctorFooter from "../../common/doctorFooter/index.jsx";
import axios from "../../../../axiosConfig.js";
import { useAdminSettings } from "../../../../context/AdminSettingsContext.js";

const MedicalRecords = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("")
  const [uploaded, setUploaded] = useState(true);
  const [requests, setRequests] = useState([])
  const [ requestId, setRequestId ] = useState(null)
  const [showModal, setShowModal ] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null);
  const [requestIdMongoDB, setRequestIdMongoDB ] = useState(null)
  const [fileUploaded, setFileUploaded] = useState(false);
  const [activeTab, setActiveTab] = useState("medicalRecords");
  
  // New states for PDF viewing
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState("");
  const [selectedPdfName, setSelectedPdfName] = useState("");
  
  const patientId = localStorage.getItem("userData");
  const fileInputRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file ? file.name : "");
  };

  // Handle form submission to upload file
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsProcessing(true);

    try {
      const response = await axios.post(
        `/api/upload-labresult/${patientId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("File uploaded successfully!");
        setFileUploaded(true)
        setSuccessMessage(response.data.message || "File uploaded successfully!");
        setUploaded(!uploaded);
        setResults(response.data.results || []);
        setSelectedFile(null);
        setFileName("");

        // Close the modal programmatically after successful upload
         if (closeBtnRef.current) closeBtnRef.current.click();
      } else {
        alert("File upload failed. Please try again.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred during file upload. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Fetch lab results
  const fetchLabResults = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`/api/fetch-labresults/${patientId}`);

      if (response.data) {
        setResults(response.data);
        setSuccessMessage("Lab results fetched successfully.");
      } else {
        setErrorMessage("Failed to fetch lab results.");
      }
    } catch (error) {
      console.error("Error fetching lab results:", error);
      setErrorMessage("Error occurred while fetching lab results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatDateTime = (input) => {
    const date = new Date(input);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  // Handle PDF view
  const handleViewPdf = (fileUrl, fileName) => {
    if (fileUrl) {
      setSelectedPdfUrl(fileUrl);
      setSelectedPdfName(fileName);
      setShowPdfModal(true);
    } else {
      alert("PDF file not available");
    }
  };

  // Close PDF modal
  const closePdfModal = () => {
    setShowPdfModal(false);
    setSelectedPdfUrl("");
    setSelectedPdfName("");
  };

  // Download PDF
  const handleDownloadPdf = (fileUrl, fileName) => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName || 'lab-report.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("PDF file not available for download");
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const fetchLabReportRequests = async () => {
    try {
      const response = await axios.get(`/api/patient-requests/${patientId}`);
      console.log("Report Requests:", response.data);

      if (response.data.requests.length > 0) {
        setRequests(response.data.requests);
        console.log("requests",requests)
      } else {
        console.log(response.data.message);
        setRequests([]);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.log("Patient not found:", error.response.data.error);
      } else {
        console.error("An error occurred:", error.message);
      }
    }
  };

  const handleCancel = async (requestedId, _id) => {
    try {
      const response = await axios.post("/api/cancel-lab-result", {
        patientId: Number(patientId),
        requestedId: _id,
      });

      if (response.status === 200) {
        console.log(response.data.message);
        const updatedRequests = requests.map((request) =>
          request._id === _id
            ? { ...request, status: "Cancelled" }
            : request
        );
        setRequests(updatedRequests);
      } else {
        console.error("Error cancelling request:", response.data.error);
        alert("Failed to cancel request: " + response.data.error);
      }
    } catch (error) {
      console.error("Error while cancelling request:", error);
      alert(
        error.response?.data?.error || "An error occurred while cancelling the request."
      );
    }
  };

  const handleApprove = async (requestedId, requestIdMongoDB) => {
    setShowModal(true)
    setRequestId(requestedId)
    setRequestIdMongoDB(requestIdMongoDB)
  };

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleRowSelection = (labResultId) => {
    setSelectedRow((prevSelectedRow) =>
      prevSelectedRow === labResultId ? null : labResultId
    );
  };

  const handleApproveClick = async() => {
    if (selectedRow) {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post('/api/share-lab-result', {
          labResultId: selectedRow,
          sharedId: requestId,
          patientId: Number(patientId),
        });

        if (response.status === 200) {
          setSuccessMessage(response.data.message);
          setShowModal(false)

          const updatedRequests = requests.map((request) =>
            request._id === requestIdMongoDB
              ? { ...request, status: "Approved" }
              : request
          );
          setRequests(updatedRequests);
          setSelectedRow(null); // Reset selection
        }
      } catch (err) {
        console.error("Error during approval:", err);
        setError("Failed to approve the lab result. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please select a row to approve.");
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    fetchLabResults();
  }, [uploaded]);

  useEffect(() => {
    fetchLabReportRequests()
  }, [])

  return (
    <>
      <div className="main-wrapper">
        <Header {...props} />
        <div className="breadcrumb-bar-two">
          <div className="container">
            <div className="row align-items-center inner-banner">
              <div className="col-md-12 col-12 text-center">
                <h2 className="breadcrumb-title">Medical Records</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/patient/dashboard">Home</Link>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      Medical Records
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-xl-3 theiaStickySidebar mb-lg-4 mb-xl-0 mb-md-4 mb-4">
                <StickyBox offsetTop={20} offsetBottom={20}>
                  <DashboardSidebar />
                </StickyBox>
              </div>
              <div className="col-lg-8 col-xl-9">
                <div className="dashboard-header">
                  <h3>Medical Records</h3>
                  <div className="appointment-tabs">
                    <ul className="nav">
                      <li>
                        <Link
                          to="#"
                          className={`nav-link ${activeTab === "medicalRecords" ? "active" : ""
                            }`}
                          onClick={() => setActiveTab("medicalRecords")}
                        >
                          Records Overview
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className={`nav-link ${activeTab === "requests" ? "active" : ""
                            }`}
                          onClick={() => setActiveTab("requests")}
                        >
                          Requests Inbox
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="tab-content pt-0">
                  {activeTab === "medicalRecords" && (
                    <div className="tab-pane fade show active" >
                      <div className="search-header">
                        <div className="search-field" style={{visibility: "hidden"}}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                          />
                          <span className="search-icon">
                            <i className="fa-solid fa-magnifying-glass" />
                          </span>
                        </div>
                        <div>
                          <Link
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#add_medical_records"
                            className="add-record-btn"
                            style={{ padding: "10px 20px", fontSize: "16px", color: "#fff", borderRadius: "4px" }}
                          >
                            Add Record
                          </Link>
                        </div>
                      </div>
                      <div className="custom-table">
                        <div className="table-responsive">
                          <table className="table table-center mb-0">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Date</th>
                                <th>File Size</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {results.map((result, index) => (
                                <tr key={index}>
                                  <td className="text-blue-600">
                                    # {result.labResultId}
                                  </td>
                                  <td>
                                    <Link to="#" className="lab-icon">
                                      <span>
                                        <i className="fa-solid fa-file-pdf" style={{color: '#d63384', marginRight: '8px'}} />
                                      </span>
                                      {result.reportName || 'Lab Report'}
                                    </Link>
                                  </td>
                                  <td>{formatDate(result.createdAt)}</td>
                                  <td>{formatFileSize(result.fileSize)}</td>
                                  <td>
                                    <div className="action-item" style={{display: 'flex', gap: '10px'}}>
                                      <Link 
                                        to={`/patient/medicalrecords/show/${result.labResultId}`} 
                                        title="View Lab Report Data"
                                        style={{color: '#007bff'}}
                                      >
                                        <i className="fa-solid fa-eye" />
                                      </Link>
                                      {result.fileUrl && (
                                        <>
                                          <button 
                                            onClick={() => handleViewPdf(result.fileUrl, result.reportName)}
                                            title="View PDF"
                                            style={{
                                              background: 'none',
                                              border: 'none',
                                              color: '#28a745',
                                              cursor: 'pointer',
                                              fontSize: '16px'
                                            }}
                                          >
                                            <i className="fa-solid fa-file-pdf" />
                                          </button>
                                          <button 
                                            onClick={() => handleDownloadPdf(result.fileUrl, result.reportName)}
                                            title="Download PDF"
                                            style={{
                                              background: 'none',
                                              border: 'none',
                                              color: '#17a2b8',
                                              cursor: 'pointer',
                                              fontSize: '16px'
                                            }}
                                          >
                                            <i className="fa-solid fa-download" />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "requests" && (
                    <div className="tab-pane fade show active">
                      {/* Approve Selection Modal */}
                      <div>
                        <div
                          className={`modal fade ${showModal ? "show" : ""}`}
                          tabIndex="-1"
                          role="dialog"
                          aria-labelledby="approveModalLabel"
                          aria-hidden={!showModal}
                          style={{ 
                            display: showModal ? "block" : "none",
                            backgroundColor: showModal ? "rgba(0,0,0,0.5)" : "transparent"
                          }}
                        >
                          <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title" id="approveModalLabel">
                                  Select Lab Report to Share
                                </h5>
                                <button
                                  type="button"
                                  className="btn-close"
                                  aria-label="Close"
                                  onClick={handleCloseModal}
                                >
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <div className="modal-body">
                                <table className="table table-bordered">
                                  <thead>
                                    <tr>
                                      <th>Select</th>
                                      <th>Lab Result ID</th>
                                      <th>Report Name</th>
                                      <th>Created At</th>
                                      <th>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {results.map((result, index) => (
                                      <tr
                                        key={index}
                                        className={selectedRow === result.labResultId ? "table-primary" : ""}
                                        onClick={() => handleRowSelection(result.labResultId)}
                                        style={{cursor: 'pointer'}}
                                      >
                                        <td>
                                          <input
                                            type="radio"
                                            checked={selectedRow === result.labResultId}
                                            onChange={() => handleRowSelection(result.labResultId)}
                                          />
                                        </td>
                                        <td className="text-blue-600">
                                          # {result.labResultId}
                                        </td>
                                        <td>
                                          <div className="lab-icon">
                                            <span>
                                              <i className="fa-solid fa-file-pdf" style={{color: '#d63384', marginRight: '8px'}} />
                                            </span>
                                            {result.reportName || 'Lab Report'}
                                          </div>
                                        </td>
                                        <td>{formatDate(result.createdAt)}</td>
                                        <td>
                                          <div className="action-item" style={{display: 'flex', gap: '10px'}}>
                                            <Link 
                                              to={`/patient/medicalrecords/show/${result.labResultId}`} 
                                              title="View lab results"
                                              style={{color: '#007bff'}}
                                            >
                                              <i className="fa-solid fa-eye" />
                                            </Link>
                                            {result.fileUrl && (
                                              <button 
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleViewPdf(result.fileUrl, result.reportName);
                                                }}
                                                title="View PDF"
                                                style={{
                                                  background: 'none',
                                                  border: 'none',
                                                  color: '#28a745',
                                                  cursor: 'pointer',
                                                  fontSize: '16px'
                                                }}
                                              >
                                                <i className="fa-solid fa-file-pdf" />
                                              </button>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              <div className="modal-footer">
                                {selectedRow && (
                                  <button 
                                    className="btn btn-primary" 
                                    onClick={handleApproveClick}
                                    disabled={loading}
                                  >
                                    {loading ? "Processing..." : "Share Selected Report"}
                                  </button>
                                )}
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  onClick={handleCloseModal}
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="custom-table">
                        <div className="table-responsive">
                          <table className="table table-center mb-0">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Doctor</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {requests.map((request, index) => (
                                <tr key={index}>
                                  <td># {request.requestedId}</td>
                                  <td>
                                    {request.requestUserDetails.displayName.startsWith("Dr")
                                      ? request.requestUserDetails.displayName.startsWith("Dr.")
                                        ? request.requestUserDetails.displayName
                                        : `Dr. ${request.requestUserDetails.displayName.slice(3).trim()}`
                                      : `Dr. ${request.requestUserDetails.displayName}`}
                                  </td>
                                  <td>{formatDateTime(request.requestedAt)}</td>
                                  <td>
                                    <span
                                      style={{
                                        backgroundColor: request.status === "Approved"
                                          ? "#4caf50"
                                          : request.status === "Cancelled"
                                            ? "#f44336"
                                            : "#ff9800",
                                        color: "#fff",
                                        padding: "5px 10px",
                                        borderRadius: "4px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {request.status}
                                    </span>
                                  </td>
                                  <td>
                                    {request.status === "Requested" && (
                                      <>
                                        <button
                                          onClick={() => handleApprove(request.requestedId, request._id)}
                                          style={{
                                            padding: "5px 10px",
                                            backgroundColor: "#4caf50",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            marginRight: "5px",
                                          }}
                                        >
                                          Approve
                                        </button>
                                        <button
                                          onClick={() => handleCancel(request.requestedId, request._id)}
                                          style={{
                                            padding: "5px 10px",
                                            backgroundColor: "#f44336",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                          }}
                                        >
                                          Cancel
                                        </button>
                                      </>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DoctorFooter {...props} />
      </div>

      {/* PDF Viewer Modal */}
      {showPdfModal && (
        <div 
          className="modal fade show" 
          style={{ 
            display: "block", 
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 1055,
            marginTop: "50px"
          }}
          onClick={closePdfModal}
        >
          <div 
            className="modal-dialog modal-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fa-solid fa-file-pdf" style={{color: '#d63384', marginRight: '8px'}} />
                  {selectedPdfName || 'Lab Report PDF'}
                </h5>
                <div>
                  {/* <button
                    type="button"
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={() => handleDownloadPdf(selectedPdfUrl, selectedPdfName)}
                    title="Download PDF"
                  >
                    <i className="fa-solid fa-download" /> Download
                  </button> */}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closePdfModal}
                    aria-label="Close"
                  >
                  </button>
                </div>
              </div>
              <div className="modal-body p-0" style={{ height: "80vh" }}>
                <iframe
                  src={selectedPdfUrl}
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                  title={selectedPdfName || "Lab Report PDF"}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Medical Records Modal */}
      <div className="modal fade custom-modals" id="add_medical_records">
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add Medical Record</h3>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={closeBtnRef}
                onClick={() => {
                  setFileUploaded(false);
                  setSelectedFile(null);
                  setFileName("");
                }}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-wrap mb-0">
                      <label className="col-form-label">Report (PDF only)</label>
                      <div className="upload-file">
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          style={{display: "none"}} 
                          onChange={handleFileChange}
                          accept=".pdf"
                        />
                        <div 
                          className="btn btn-primary" 
                          onClick={handleButtonClick}
                          style={{
                            padding: "12px 24px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            display: "inline-block"
                          }}
                        >
                          <i className="fa-solid fa-upload" style={{marginRight: '8px'}} />
                          Choose PDF File
                        </div>
                        {fileName && (
                          <div className="mt-3 p-3 border rounded bg-light">
                            <p className="mb-0">
                              <i className="fa-solid fa-file-pdf" style={{color: '#d63384', marginRight: '8px'}} />
                              <strong>Selected File:</strong> {fileName}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <div className="modal-btn text-end">
                  {!fileUploaded && (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isProcessing || !selectedFile}
                    >
                      {isProcessing ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin" style={{marginRight: '8px'}} />
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-save" style={{marginRight: '8px'}} />
                          Save Changes
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show position-fixed" 
             style={{top: '60px', right: '20px', zIndex: 9999}}>
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage("")}></button>
        </div>
      )}
      
      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show position-fixed" 
             style={{top: '20px', right: '20px', zIndex: 9999}}>
          {errorMessage}
          <button type="button" className="btn-close" onClick={() => setErrorMessage("")}></button>
        </div>
      )}
    </>
  );
};

export default MedicalRecords;