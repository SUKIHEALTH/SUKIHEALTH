import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../../header";
import DoctorFooter from "../../common/doctorFooter";
import DoctorSidebar from "../sidebar";
import axios from "../../../../axiosConfig";
import { initialSettings } from "../../common/filter";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import Modal from "react-bootstrap/Modal";
import ShowReports from "./ShowReports";
import { PlusCircle } from "lucide-react";

const MyPatient = (props) => {
  const [myPatients, setMyPatients] = useState([]); // Default to empty array
  const [filteredPatients, setFilteredPatients] = useState([]); // Default to empty array
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [labResults, setLabResults] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);
  const [limit] = useState(9); // Number of patients per page
  const consultantId = localStorage.getItem("userData");
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showReportDeatials, setShowReportDetails] = useState(false);
  const [resultDetails, setResultDetails] = useState([]);

  // New states for PDF viewing
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState("");
  const [selectedPdfName, setSelectedPdfName] = useState("");

  // Fetch patients data
  const fetchMyPatients = useCallback(
    async (page = 1, query = "") => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(
          `/api/get-all-consultant-patients/${consultantId}?page=${page}&limit=${limit}&search=${query}`
        );
        setMyPatients(response.data || []); // Fallback to empty array if undefined
        setFilteredPatients(response.data || []); // Fallback to empty array if undefined
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
        setTotalPatients(response.data.totalPatients);
      } catch (err) {
        setError("Failed to fetch patient data. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [consultantId, limit]
  );
  console.log("this is patient data", myPatients);

  useEffect(() => {
    fetchMyPatients(currentPage);
  }, [fetchMyPatients, currentPage]);

  // Handle search input change with debounce
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    debounceSearch(query); // Call debounced search
  };

  // Debounce search function (using useCallback)
  const debounceSearch = useCallback(
    (query) => {
      const timer = setTimeout(() => {
        fetchMyPatients(1, query); // Refetch when search query changes
      }, 500); // 500ms delay before making the API call

      return () => clearTimeout(timer);
    },
    [fetchMyPatients]
  );

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Format ISO date strings
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "Invalid Date";

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-GB", options);
  };

  const getAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleRequestLabResult = async (patientId) => {
    try {
      // Make an API call to request lab result
      const response = await axios.post(`/api/request-lab-result`, {
        patientId,
        requestedId: consultantId,
      });

      // Assuming the response is already JSON (axios parses JSON responses)
      const data = response.data;

      // Set the data to display in the modal
      setModalData(data);

      // Show the modal
      setShowModal(true);
    } catch (error) {
      console.error("Error requesting lab result:", error);

      // Optionally, display an error message to the user
      setModalData({
        error: "Failed to request lab result. Please try again.",
      });
      setShowModal(true);
    }
  };

  const fetchLabResults = async (patientId) => {
    try {
      const response = await axios.post("/api/get-patient-reports", {
        patientId,
        doctorId: Number(consultantId),
      });

      setLabResults(response.data.labResults);
      console.log("this is lab results", response.data);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching lab results:", error);
    } finally {
      setLoading(false);
    }
  };

  const showReportsFn = (details) => {
    setShowReportDetails(true);
    setResultDetails(details);
  };

  const closeShowReportDetailsFn = () => {
    setShowReportDetails(false);
  };

  // Handle PDF view
  const handleViewPdf = (fileUrl, fileName) => {
    if (fileUrl) {
      // Add timestamp to prevent caching issues
      const urlWithTimestamp = `${fileUrl}?t=${Date.now()}`;
      setSelectedPdfUrl(urlWithTimestamp);
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

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div>
      <Header {...props} />
      {/* Breadcrumb */}
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">My Patients</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/doctor/doctor-dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    My Patients
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="content doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              <DoctorSidebar />
            </div>
            {showReportDeatials ? (
              <ShowReports
                results={resultDetails}
                close={closeShowReportDetailsFn}
              />
            ) : (
              <div className="col-lg-8 col-xl-9">
                <div className="dashboard-header">
                  <h3>My Patients</h3>
                  <div className="header-list-btns">
                    <div className="input-block dash-search-input">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name"
                        value={searchQuery}
                        onChange={handleSearch}
                      />
                      <span className="search-icon">
                        <i className="fa-solid fa-magnifying-glass" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lab Results Section */}
                {showResults && (
                  <div className="tab-content appointment-tab-content grid-patient">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="mb-0">Lab Results</h4>
                      <button
                        onClick={() => setShowResults(false)}
                        className="btn btn-light btn-sm"
                        aria-label="Close"
                      >
                        <i className="fa fa-times" aria-hidden="true"></i>
                      </button>
                    </div>

                    {loading ? (
                      <div className="text-center my-5">
                        <div className="spinner-border" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="text-center my-5 text-danger">
                        {error}
                      </div>
                    ) : labResults.length === 0 ? (
                      <div className="text-center my-5">
                        No Shared Lab Reports
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Report Name</th>
                              <th>File Size</th>
                              <th>Created At</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {labResults.map((result, index) => (
                              <tr key={result._id}>
                                <td>{index + 1}</td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <i className="fa-solid fa-file-pdf text-danger me-2" />
                                    {result.reportName || result.originalFileName}
                                  </div>
                                </td>
                                <td>{formatFileSize(result.fileSize)}</td>
                                <td>{formatDate(result.createdAt)}</td>
                                <td>
                                  <span className="badge bg-success">Shared</span>
                                </td>
                                <td>
                                  <div className="action-item d-flex gap-2">
                                    {/* View Data Button */}
                                    <button
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() => showReportsFn(result.resultData)}
                                      title="View Lab Data"
                                    >
                                      <i className="fa-solid fa-eye" /> Data
                                    </button>
                                    
                                    {/* View PDF Button */}
                                    {result.fileUrl && (
                                      <button
                                        className="btn btn-sm btn-outline-success"
                                        onClick={() => handleViewPdf(result.fileUrl, result.reportName)}
                                        title="View PDF"
                                      >
                                        <i className="fa-solid fa-file-pdf" /> PDF
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Patient List */}
                <div className="tab-content appointment-tab-content grid-patient">
                  {loading ? (
                    <div className="text-center my-5">
                      <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="text-center my-5">No data found.</div>
                  ) : filteredPatients && filteredPatients.length === 0 ? (
                    <div className="text-center my-5">No patients found.</div>
                  ) : (
                    <div className="row">
                      {filteredPatients.map((item, index) => (
                        <div
                          key={index}
                          className="col-xl-4 col-lg-6 col-md-6 d-flex"
                        >
                          <div className="appointment-wrap appointment-grid-wrap">
                            <ul>
                              <li>
                                <div className="appointment-grid-head">
                                  <div className="patinet-information">
                                    <Link to="#">
                                      <img
                                        src={
                                          item.patientImage ? item.patientImage : "/assets/images/doctor-thumb-01.png"
                                        }
                                        alt="Patient"
                                      />
                                    </Link>
                                    <div className="patient-info">
                                      <p>#{item.patientId}</p>
                                      <h6>
                                        <Link to="#">{item.patientName}</Link>
                                      </h6>
                                      <div className="d-flex w-100 text-center">
                                          <div
                                            className="w-50 p-2"
                                            onClick={() => handleRequestLabResult(item.patientId)}
                                            title="Request Lab Report" // Tooltip for requesting lab report
                                          >
                                            <HiOutlineDocumentPlus size={24} className="cursor-pointer" />
                                          </div>
                                          <div className="w-50">
                                            <button
                                              style={{
                                                backgroundColor: "transparent",
                                                color: "black",
                                              }}
                                              onClick={() => fetchLabResults(item.patientId)}
                                              title="Show Lab Report" // Tooltip for showing lab report
                                            >
                                              <i className="fa-solid fa-eye" />
                                            </button>
                                          </div>
                                        </div>
                                      <ul>
                                      <li>Age: {item.patientDOB ? getAge(item.patientDOB) : 'N/A'}</li>
                                        <li>{item.patientGender}</li>
                                        <li>{item.patientBloodGroup}</li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </li>
                              <li className="appointment-info">
                                <p>
                                  <i className="fa-solid fa-clock" />
                                  {formatDate(
                                    item.latestAppointment.appointmentDate
                                  )}
                                </p>
                                <p className="mb-0">
                                  <i className="fa-solid fa-location-dot" />
                                  {item.patientAddress || "No address provided"}
                                </p>
                              </li>
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Request Lab Result Modal */}
                  <Modal
                    className="mt-5"
                    show={showModal}
                    onHide={() => setShowModal(false)}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Lab Result Request</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {modalData ? (
                        <div>
                          <p>
                            <strong>Status:</strong> {modalData.message}
                          </p>
                        </div>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </Modal.Body>
                    <Modal.Footer>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                    </Modal.Footer>
                  </Modal>
                </div>

                {/* Pagination Controls */}
                <div className="pagination dashboard-pagination">
                  <ul>
                    {/* Previous Page Button */}
                    <li>
                      <Link
                        to="#"
                        className="page-link"
                        onClick={() =>
                          setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)
                        }
                      >
                        <i className="fa-solid fa-chevron-left" />
                      </Link>
                    </li>

                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, index) => (
                      <li key={index}>
                        <Link
                          to="#"
                          className={`page-link ${
                            currentPage === index + 1 ? "active" : ""
                          }`}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </Link>
                      </li>
                    ))}

                    {/* Next Page Button */}
                    <li>
                      <Link
                        to="#"
                        className="page-link"
                        onClick={() =>
                          setCurrentPage(
                            currentPage < totalPages
                              ? currentPage + 1
                              : totalPages
                          )
                        }
                      >
                        <i className="fa-solid fa-chevron-right" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {showPdfModal && (
        <div 
          className="modal fade show" 
          style={{ 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.8)",
            zIndex: 1055,
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%"
          }}
          onClick={closePdfModal}
        >
          <div 
            className="modal-dialog"
            style={{
              margin: "auto",
              maxWidth: "95%",
              width: "95%",
              maxHeight: "95%"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content" style={{ height: "95vh", marginTop: "50px" }}>
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fa-solid fa-file-pdf text-danger me-2" />
                  {selectedPdfName || 'Lab Report PDF'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closePdfModal}
                  aria-label="Close"
                >
                </button>
              </div>
              <div className="modal-body p-0" style={{ height: "calc(95vh - 60px)" }}>
                {selectedPdfUrl ? (
                  <iframe
                    src={selectedPdfUrl}
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                    title={selectedPdfName || "Lab Report PDF"}
                    onError={() => {
                      console.error("Error loading PDF");
                      alert("Error loading PDF. Please try again.");
                    }}
                  />
                ) : (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <div className="text-center">
                      <i className="fa-solid fa-file-pdf fa-3x text-muted mb-3"></i>
                      <p>Loading PDF...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <DoctorFooter />
    </div>
  );
};

export default MyPatient;