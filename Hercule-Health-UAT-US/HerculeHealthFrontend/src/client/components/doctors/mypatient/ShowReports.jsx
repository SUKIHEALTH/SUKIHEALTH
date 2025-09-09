import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../pharmacyadmin/assets/css/style.css";
import { Col, Row, Container } from "react-bootstrap";
import blood from "../../../assets/icons/result/blood.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLessThan } from "@fortawesome/free-solid-svg-icons";
import { IoMdArrowRoundBack } from "react-icons/io";

const ShowReports = (props) => {
    const [labReports, setLabReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [selectedTitle, setSelectedTitle] = useState("");
    const history = useHistory();

    useEffect(() => {
        const fetchLabResults = async () => {
            try {
                setLoading(true);
                setLabReports(props.results);

                // Automatically select the first report and set the title
                if (props.results && props?.results?.length > 0) {
                    const firstReport = props.results[0];
                    const reportKey = Object.keys(firstReport)[0];
                    const selectedReportData = firstReport[reportKey];
                    setSelectedReport(selectedReportData);
                    setSelectedTitle(
                        reportKey.charAt(0).toUpperCase() + reportKey.slice(1)
                    );
                }
            } catch (error) {
                console.error("Error fetching lab results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLabResults();
    }, [props.results]);

    const handleReportClick = (report) => {
        const reportKey = Object.keys(report)[0];
        const selectedReportData = report[reportKey];
        setSelectedReport(selectedReportData);
        setSelectedTitle(reportKey.charAt(0).toUpperCase() + reportKey.slice(1));
    };

    // Function to determine the class based on the classification
    const getResultClassName = (classification) => {
        if (classification === "Low") {
            return "low-result";
        } else if (classification === "High") {
            return "low-result";
        } else {
            return "normal-result";
        }
    };

    // Function to determine the class for the circle element
    const getCircleClassName = (classification) => {
        if (classification === "Low") {
            return "circle low-circle";
        } else if (classification === "High") {
            return "circle low-circle";
        } else {
            return "circle normal-circle";
        }
    };

    // Function to determine the class for the overall result
    const getOverallClassName = (classification) => {
        if (classification === "Low") {
            return "b-result low-result";
        } else if (classification === "High") {
            return "b-result low-result";
        } else {
            return "b-result normal-result";
        }
    };

    const closeFn = () => {
        props.close()
    }

    return (
        <div className="col-lg-8 col-xl-9">
            <div className="medical-details main-head d-flex w-100 justify-content-between">
                <div className="d-flex justify-content-between align-items-center">
                    <h3 className="mb-0 text-end flex-grow-1">Medical Reports</h3>
                </div>
                <button
                    onClick={() => closeFn()}
                    className="btn btn-light btn-sm"
                    aria-label="Close"
                >
                    <i className="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>

            <div>
                {/* Use Bootstrap responsive classes but maintain the original desktop layout */}
                <Row className="picture-and-result">
                    {/* Mobile & Tablet: Stack vertically, Desktop: Side by side as original */}
                    <div className="col-12 col-md-6 picture-section mt-4 mt-md-5">
                        <div className="p-picture">
                            <div className="picture text-center text-md-start">
                                <img
                                    src={blood}
                                    height={"80px"}
                                    width={"80px"}
                                    alt="blood"
                                    className="img-fluid"
                                />
                                <p>{selectedTitle}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-12 col-md-6 result-side mt-4 mt-md-5">
                        <div className="p-child d-flex justify-content-center justify-content-md-end">
                            <div className="p-result">
                                {selectedReport && selectedReport?.length > 0 ? (
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
                                            ></div>
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
                                                            )}
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

                {/* Result Bottom Section - Keep original desktop layout but make responsive */}
                <Row className="mt-5" style={{ padding: "19px 0px" }}>
                    <div className="col-12">
                        <div className="result-bottom d-flex flex-wrap">
                            {labReports?.length > 0 &&
                                labReports.map((result, index) => {
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
                                            resultClassName = "b-result high-result";
                                        } else if (classification === "Low") {
                                            resultClassName = "b-result low-result";
                                        } else {
                                            resultClassName = "b-result normal-result";
                                        }

                                        return (
                                            <div
                                                onClick={() => handleReportClick(result)}
                                                className={resultClassName}
                                                key={index}
                                            >
                                                <div className="icon">
                                                    <div className="icons">
                                                        <img src={result.iconUrl} alt={result.icon} />
                                                    </div>
                                                </div>

                                                <div>
                                                    {resultKey.charAt(0).toUpperCase() + resultKey.slice(1)}
                                                </div>
                                            </div>
                                        );
                                    }

                                    return null;
                                })}
                        </div>
                    </div>
                </Row>
                
                <Row>
                    <div className="w-100">
                        <div className="text-end">
                            <button style={{ border: 'none', backgroundColor: 'transparent', color: 'black' }}>
                                
                            </button>
                        </div>
                    </div>
                </Row>
            </div>
        </div>
    );
};

export default ShowReports;