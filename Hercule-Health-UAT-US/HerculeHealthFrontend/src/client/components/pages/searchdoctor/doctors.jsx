import React, { useEffect, useState, useRef } from "react";
import axios from "../../../../axiosConfig"; // Assuming axiosConfig is configured for API calls
import { FiClock, FiDollarSign, FiInfo } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FourSquare } from "react-loading-indicators";
import { useAdminSettings } from "../../../../context/AdminSettingsContext";

const Doctors = ({
  onDataChange,
  searchTerm,
  gender,
  experience,
  languages,
  minValue,
  maxValue,
}) => {
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(7);
  const [loading, setLoading] = useState(true);
  const [isFirstRenderComplete, setIsFirstRenderComplete] = useState(false); // New state
  const [error, setError] = useState(null);
  const [adminSettings, setAdminSettings] = useState(null);
const [settingsLoading, setSettingsLoading] = useState(true);
const [settingsError, setSettingsError] = useState(null);
  const debounceTimeout = useRef(null); // Use ref to store the timeout ID

  // const { settings, isLoading: settingsLoading, error: settingsError } = useAdminSettings();
useEffect(() => {
  const fetchSettings = async () => {
    try {
      const response = await axios.get("/api/get-admin-settings");
      setAdminSettings(response.data.setting);
    } catch (err) {
      setSettingsError("Failed to fetch admin settings");
    } finally {
      setSettingsLoading(false);
    }
  };
  fetchSettings();
}, []);

  // Function to fetch doctors based on filters
  useEffect(() => {
    const getDoctors = async () => {
      setLoading(true); // Set loading state to true while fetching data
      setError(null); // Reset any previous error state

      const filters = {
        searchTerm,
        gender,
        experience,
        languages,
        priceRange: { minValue, maxValue },
        pageNumber: currentPage,
        pageSize,
      };

      try {
        // Make the API call to fetch doctors with the provided filters
        const response = await axios.post("api/get-all-approved-consultants", filters);
        const fetchedDoctors = response.data.data;
        setDoctors(fetchedDoctors);
        setTotalPages(response.data.totalPages);

        // Send data to parent using the callback function if provided
        if (onDataChange) {
          onDataChange(fetchedDoctors);
        }
      } catch (err) {
        setError("No doctors available matching the criteria..");
        // setError("Error fetching doctors.");
      } finally {
        setLoading(false); // Set loading state to false after the data is fetched
        setIsFirstRenderComplete(true); // Mark the first render as complete
      }
    };

    // Debounce the API call by clearing the previous timeout and setting a new one
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      getDoctors();
    }, 1500); // Debounce delay in milliseconds

    // Cleanup timeout on component unmount or when dependencies change
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [
    searchTerm,
    currentPage,
    gender,
    experience,
    languages,
    minValue,
    maxValue,
    pageSize,
    onDataChange,
  ]);

  // Function to handle page change for pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
const appointmentFee = Number(adminSettings?.appointmentFee || 0);
const taxPercentage = Number(adminSettings?.taxPercentage || 0);
const serviceCharge = Number(adminSettings?.serviceCharge || 0);

const taxAmount = (appointmentFee * taxPercentage) / 100;
const totalAmount = appointmentFee + taxAmount + serviceCharge;
  return (
    <div>
      {settingsLoading && <div>Loading settings...</div>}
      {settingsError && <div>Failed to load settings.</div>}
{!settingsLoading && !settingsError && (
  <>
      {loading && (
        <div className="text-center">
          <p>
            <FourSquare
              color="#99afe1"
              size="medium"
              text=""
              textColor="#c91a1a"
            />
          </p>
        </div>
      )}{" "}
      {/* Show loading indicator while data is being fetched */}
      {error && <p>{error}</p>}{" "}
      {/* Display error message if there's an issue with the API call */}
      {/* If no doctors are found and no error is present */}
      {!loading && isFirstRenderComplete && doctors.length === 0 && (
        <p>No doctors available matching the criteria.</p>
      )}
      {/* If doctors are found */}
      {!loading && !error && doctors.length > 0 && (
        <div>
          {doctors.map((item, index) => (
            <div className="card doctor-card" key={index}>
              <div className="card-body">
                <div className="doctor-widget-one">
                  <div className="doc-info-left">
                    <div className="doctor-img">
                      <Link to={`/patient/doctor-profile/${item.userId}`}>
                        <img
                          src={
                            item.profileImage || "/assets/images/doctor-thumb-01.png"
                          }
                          className="img-fluid"
                          alt=""
                        />
                      </Link>
                    </div>
                    <div className="doc-info-cont">
                      <h4 className="doc-name">
                        <Link to={`/patient/doctor-profile/${item.userId}`}>
                          {item.information.displayName} 
                        </Link>
                      </h4>
                      <p className="doc-speciality">
                        {item?.information?.designation? "Specialization: " +item?.information?.designation :""}
                      </p>
                      
                      <div className="clinic-details">
                        <p className="doc-location">
                          {(item?.information?.city || item?.information?.location) && (
                            <>
                              <i className="fas fa-map-marker-alt" />
                              {item?.information?.city ? `${item.information.city}` : ""}
                              {item?.information?.city && item?.information?.location ? ", " : ""}
                              {item?.information?.location || ""}
                            </>
                          )}
                        </p>
                        <p className="doc-location">
                          Known Languages:{" "}
                          {item.information.knownLanguages.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="doc-info-right">
                    <div className="clini-infos">
                      <ul>
                        {/* <li>
                          <span className="available-date available-today">
                            Available
                          </span>
                        </li> */}
                        <li>
                        Consulting Fee:&nbsp;<span>€</span>{settingsLoading
            ? "Loading..."
            : settingsError
            ? "N/A"
            : totalAmount.toFixed(2)}
                        </li>
                      </ul>
                    </div>
                    <div className="clinic-booking book-appoint">
                      <Link
                        className="btn btn-primary"
                        to={`/patient/booking1/${item.userId}`}
                      >
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Pagination */}
      {!loading && !error && doctors.length > 0 && (
        <div className="row">
          <div className="col-sm-12">
            <div className="pagination dashboard-pagination">
              <ul>
                {/* Previous Button */}
                <li>
                  <Link
                    to="#"
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <i className="fa-solid fa-chevron-left" />
                  </Link>
                </li>

                {/* Page Number Buttons */}
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index}>
                    <Link
                      to="#"
                      className={`page-link ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Link>
                  </li>
                ))}

                {/* Next Button */}
                <li>
                  <Link
                    to="#"
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <i className="fa-solid fa-chevron-right" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

    </>
)}
    </div>
  );
};

export default Doctors;
