import React, { useEffect, useState } from "react";
import DashboardSidebar from "../../dashboard/sidebar/sidebar.jsx";
import StickyBox from "react-sticky-box";
import { Link, useHistory, useParams } from "react-router-dom";
import Header from "../../../header.jsx";
import DoctorFooter from "../../../common/doctorFooter/index.jsx";
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker styles
import "../../../../../../src/pharmacyadmin/assets/css/style.css";
import "../../../../assets/css/showDetails.css";
import { Col, Row } from "react-bootstrap";
import arrow from "../../../../../client/assets/icons/result/arrow.png";
import greenArrow from "../../../../../client/assets/icons/result/arrows.png";
import mark from "../../../../../client/assets/icons/result/mark.png";
import attention from "../../../../../client/assets/icons/result/attention.png";
import blood from "../../../../../client/assets/icons/result/blood.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLessThan } from "@fortawesome/free-solid-svg-icons";
import axios from "../../../../../axiosConfig.js";
import { IoMdArrowRoundBack } from "react-icons/io";
const ShowDetails = (props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTags, setSelectedTags] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [labReports, setLabReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null); // New state to hold selected report
  const [selectedTitle, setSelectedTitle] = useState(""); // Title of the selected report
  const history = useHistory(); // Fixed usage of useHistory
  const reportId = useParams();

  useEffect(() => {
    const fetchLabResults = async () => {
      try {
        setLoading(true); // Set loading to true while fetching data
        const response = await axios.get(
          `/api/fetch-labresult-details/${reportId.id}`
        ); // Make the API call
        setLabReports(response.data.resultData); // Set the lab reports in state

        // Automatically select the first report and set the title
        if (response.data.resultData && response.data.resultData.length > 0) {
          const firstReport = response.data.resultData[0];
          const reportKey = Object.keys(firstReport)[0];
          const selectedReportData = firstReport[reportKey];
          setSelectedReport(selectedReportData);
          setSelectedTitle(
            reportKey.charAt(0).toUpperCase() + reportKey.slice(1)
          ); // Capitalize first letter
        }
      } catch (error) {
        console.error("Error fetching lab results:", error); // Handle errors
      } finally {
        setLoading(false); // Set loading to false after the fetch is complete
      }
    };

    fetchLabResults(); // Call the function to fetch data
  }, [reportId.id]);

  // Handle back button navigation
  const handleBackButton = () => {
    history.push("/patient/medicalrecords"); // Corrected push method
  };
  const handleMoreDetailsButton = () => {
    history.push(`/patient/medicalrecords/more/${reportId.id}`); // Corrected push method
  };
  const handleReportClick = (report) => {
    // Extract the first key of the report object (e.g., 'hematologie', 'klinische chemie')
    const reportKey = Object.keys(report)[0];
    const selectedReportData = report[reportKey]; // Get the array of details for the selected report
    setSelectedReport(selectedReportData); // Update the selected report with the extracted data
    setSelectedTitle(reportKey.charAt(0).toUpperCase() + reportKey.slice(1)); // Update the selected title
  };

  // Function to determine the class based on the classification
  const getResultClassName = (classification) => {
    if (classification === "Low") {
      return "low-result"; // Low result class
    } else if (classification === "High") {
      return "low-result"; // High result class
    } else {
      return "normal-result"; // Normal result class
    }
  };

  // Function to determine the class for the circle element
  const getCircleClassName = (classification) => {
    if (classification === "Low") {
      return "circle low-circle"; // Low result circle class
    } else if (classification === "High") {
      return "circle low-circle"; // High result circle class
    } else {
      return "circle normal-circle"; // Normal result circle class
    }
  };

  // Function to determine the class for the overall result (disable 'high' or 'low' when normal)
  const getOverallClassName = (classification) => {
    if (classification === "Low") {
      return "b-result low-result"; // Apply low result class
    } else if (classification === "High") {
      return "b-result low-result"; // Apply high result class
    } else {
      return "b-result normal-result"; // Apply normal result class
    }
  };

  return (
    <div className="main-wrapper">
      <Header {...props} />

      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Medical Report</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/patient/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Medical Report
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-4 col-xl-3 theiaStickySidebar mb-lg-4 mb-xl-0 mb-md-4 mb-4">
              <StickyBox offsetTop={20} offsetBottom={20}>
                <DashboardSidebar />
              </StickyBox>
            </div>

            {/* Main Content Section */}
            <div className="col-lg-8 col-xl-9">
              <div className="medical-details main-head d-flex w-100 justify-content-between">
                <div className="text-start">
                  <h3>Medical Report</h3>
                </div>
                <div className="text-end gap-2">
                  <button
                    onClick={handleBackButton}
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      color: "black",
                    }}
                  >
                    <IoMdArrowRoundBack />
                    Back
                  </button>
                </div>
              </div>

              <div>
                <Row className="picture-and-result row">
                  <div className="col-12 col-md-6 picture-section mt-4 mt-md-5">
                    <div className="p-picture">
                      <div className="picture">
                        <img
                          src={blood}
                          height={"80px"}
                          width={"80px"}
                          alt="blood"
                        />
                        {/* Display selected report title */}
                        <p>{selectedTitle}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 result-side mt-4 mt-md-5">
                    <div className="p-child d-flex justify-content-center justify-content-md-end">
                      <div className="p-result">
                        {selectedReport && selectedReport.length > 0 ? (
                          selectedReport?.map((report, index) => (
                            <div
                              className={`section ${getResultClassName(
                                report.classification
                              )}`}
                              key={index}
                            >
                              <div
                                className={getCircleClassName(
                                  report.classification
                                )}
                              ></div>{" "}
                              {/* Apply dynamic circle class */}
                              <div className="values d-flex">
                                <div className="text-start w-100 title">
                                  <p>
                                    <span className="no-wrap w-100">
                                      <strong>{report.name}</strong>
                                    </span>
                                    <br />
                                    <span className="fw-bold fs-5">
                                      {report.value}
                                    </span>{" "}
                                    {report.unit}
                                  </p>
                                </div>

                                <div className="text-end w-100 text">
                                  {report.additionalInfo ? (
                                    <p
                                      className={getResultClassName(
                                        report.classification
                                      )} // Apply classification class
                                      style={report.additionalInfo.style}
                                    >
                                      <FontAwesomeIcon
                                        icon={faLessThan}
                                        style={report.additionalInfo.icon.style}
                                      />
                                      {report.additionalInfo.text}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>Select a report to view details.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Row>

                {/* Result Bottom Section */}
                <Row className="mt-5" style={{ padding: "19px 0px" }}>
                  <div className="result-bottom d-flex flex-wrap">
                    {labReports.length &&
                      labReports?.map((result, index) => {
                        // Check if the result has value
                        const resultKey = Object.keys(result)[0];
                        const resultData = result[resultKey];

                        // Only render if there's a value in the result
                        if (resultData && resultData.length > 0) {
                          // Determine the classification of the result
                          const classification = result.classification;

                          // Set the class for the b-result based on classification
                          let resultClassName = "b-result"; // Default class
                          if (classification === "High") {
                            resultClassName = "b-result high-result"; // Apply high-result class if classification is High
                          } else if (classification === "Low") {
                            resultClassName = "b-result low-result"; // Apply low-result class if classification is Low
                          } else {
                            resultClassName = "b-result normal-result"; // Apply normal-result class for all other cases
                          }

                          return (
                            <div
                              onClick={() => handleReportClick(result)} // Set the selected report on click
                              className={resultClassName}
                              key={index}
                            >
                              <div className="icon">
                                <div className="icons">
                                  <img src={result.iconUrl} alt={result.icon} />
                                </div>
                              </div>

                              {/* Render the heading based on the result's title */}
                              <div>
                                {resultKey.charAt(0).toUpperCase() + resultKey.slice(1)}
                              </div>
                            </div>
                          );
                        }

                        // If there's no value in the result, return null
                        return null;
                      })}
                  </div>
                </Row>


                <Row>
                  <div className="w-100">
                    <div className="text-end">
                      <button onClick={handleMoreDetailsButton} style={{ border: 'none', backgroundColor: 'transparent', color: 'black' }}>MoreDetails</button>
                    </div>

                  </div>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <DoctorFooter {...props} />
    </div>
  );
};

export default ShowDetails;
