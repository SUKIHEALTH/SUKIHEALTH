import React, { useState, useEffect } from "react";
import DashboardSidebar from "../../dashboard/sidebar/sidebar.jsx";
import StickyBox from "react-sticky-box";
import { Link, useHistory, useParams } from "react-router-dom";
import Header from "../../../header.jsx";
import DoctorFooter from "../../../common/doctorFooter/index.jsx";
import { IoChevronBackSharp } from "react-icons/io5";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../../../src/pharmacyadmin/assets/css/style.css";
import "../../../../assets/css/showDetails.css";
import { Col, Row } from "react-bootstrap";
import GreenArrow from "../../../../../client/assets/icons/result/mark.png";
import blood from "../../../../../client/assets/icons/result/blood.png";
import axios from "../../../../../axiosConfig.js";
import { IoMdArrowRoundBack } from "react-icons/io";

const ShowMore = (props) => {
  const history = useHistory();
  const reportId = useParams(); // Get reportId from URL params
  const [activeTab, setActiveTab] = useState(null);
  const [tabs, setTabs] = useState([]); // Store tabs data
  const [medicalData, setMedicalData] = useState(null); // Store data for the selected tab
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch data for lab results
  const fetchMedicalData = async () => {
    setLoading(true);
    try {
      const response = await axios(
        `/api/fetch-labresult-details/${reportId.id}`
      );
      const data = response.data;

      if (
        !data ||
        !Array.isArray(data.resultData) ||
        data.resultData.length === 0
      ) {
        throw new Error("Invalid or empty data format");
      }

      setTabs(data.resultData); // Set the available tabs from the API
      setActiveTab(Object.keys(data.resultData[0])[0]); // Set the first section as active (e.g., "hematologie")
      setLoading(false);
    } catch (err) {
      setError("Error fetching medical data");
      setLoading(false);
    }
  };

  // Fetch data when the component mounts or when reportId changes
  useEffect(() => {
    fetchMedicalData();
  }, [reportId]);

  // Set the data for the active tab when it changes
  useEffect(() => {
    if (activeTab && tabs.length > 0) {
      const selectedTabData = tabs.find((tab) => tab.hasOwnProperty(activeTab));
      setMedicalData(selectedTabData ? selectedTabData[activeTab] : null); // Update the data based on the active tab
    }
  }, [activeTab, tabs]);

  // Handle tab click to change active tab
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // Handle back button navigation
  const handleBackButton = () => {
    history.push("/patient/medicalrecords"); // Corrected push method
  };

  // Filter data by classification
  const getFilteredData = (classification) => {
    return medicalData
      ? medicalData.filter((item) => item.classification === classification)
      : [];
  };

  return (
    <div className="main-wrapper">
      <Header {...props} />

      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Medical Details</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/patient/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Medical Details
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
            <div className="medical-details d-flex w-100 justify-content-end">
                
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

              {/* Tab Navigation */}
              <div className="parent-tab d-flex gap-3 justify-content-around p-1">
                {loading && <div>Loading tabs...</div>}
                {error && <div>{error}</div>}
                {!loading && !error && tabs.length > 0 ? (
                  tabs
                  .filter((tab) => Object.values(tab)[0]?.length > 0) // Filter out empty arrays
                  .map((tab, index) => {
                    const tabName = Object.keys(tab)[0]; // Get the section name
                    return (
                      <div
                        key={index}
                        className={`tab ${activeTab === tabName ? "active" : ""}`}
                        onClick={() => handleTabClick(tabName)}
                      >
                        {tabName.toUpperCase()} {/* Convert tab name to uppercase */}
                      </div>
                    );
                  })
                ) : (
                  <div>No tabs available</div>
                )}
              </div>

              <br />

              {/* Medical Data */}
              <div className="p-all-main">
                {loading && <div>Loading data...</div>}
                {error && <div>{error}</div>}

                {!loading && !error && medicalData ? (
                  <div className="main-2 d-flex flex-wrap flex-md-nowrap">
                    <div className="box l-box d-flex gap-5 w-100 w-md-50">
                      <div className="mt-5">
                        <img
                          src={blood}
                          width="80px"
                          height="80px"
                          alt="blood"
                        />
                      </div>
                      <div className="mt-5">
                        <h5 className="text-center">{activeTab}</h5>
                        <p className="average text-center">Normal</p>
                        <div className="bar">
                          <div className="b1">Low</div>
                          <div className="b2">Normal</div>
                          <div className="b3">High</div>
                        </div>
                      </div>
                    </div>

                    {/* Displaying Normal results */}
                    <div className="r-box w-100 w-md-50 overflow-auto">
                      <h5>Normal Results</h5>
                      <br />

                      <div style={{ minWidth: '400px' }}>
                        {medicalData
                          .filter((result) => result.classification === 'Normal')
                          .map((result, index) => (
                            <div
                              key={index}
                              className="p-2 "
                            >
                              <div className="d-flex justify-content-between">
                                <p>{result.name}</p>
                                <p>
                                  {result.value} {result.unit}
                                </p>
                                <p>{result.classification}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div>No medical data to display</div>
                )}
              </div>
              <br />
              <div className="p-all-main">
                {loading && <div>Loading data...</div>}
                {error && <div>{error}</div>}

                {!loading && !error && medicalData ? (
                  <div className="main-2 d-flex flex-wrap flex-md-nowrap">
                    {/* Displaying Low Results */}
                    <div className="r-box low-box w-100 w-md-50">
                      <h5>Low Results</h5>
                      <br />
                      {medicalData && medicalData.length > 0 ? (
                        medicalData.filter(
                          (result) => result.classification === "Low"
                        ).length > 0 ? (
                          medicalData
                            .filter((result) => result.classification === "Low") // Filter to show only "Low" classification
                            .map((result, index) => (
                              <Row key={index}>
                                <div className="col-1"></div>
                                <div className="col-10">
                                  <div className="d-flex justify-content-between">
                                    <p>{result.name}</p>
                                    <p>
                                      {result.value} {result.unit}
                                    </p>
                                    <p>{result.classification}</p>
                                  </div>
                                </div>
                                <div className="col-1"></div>
                              </Row>
                            ))
                        ) : (
                          <div>No Low result found</div> // If no Low results are found
                        )
                      ) : (
                        <div>No Low classification data available</div> // If medicalData array is empty
                      )}
                    </div>

                    {/* Displaying High Results */}
                    <div className="r-box low-box w-100 w-md-50">
                      <h5>High Results</h5>
                      <br />
                      {medicalData && medicalData.length > 0 ? (
                        medicalData.filter(
                          (result) => result.classification === "High"
                        ).length > 0 ? (
                          medicalData
                            .filter(
                              (result) => result.classification === "High"
                            ) // Filter to show only "High" classification
                            .map((result, index) => (
                              <Row key={index}>
                                <div className="col-1"></div>
                                <div className="col-10">
                                  <div className="d-flex justify-content-between">
                                    <p>{result.name}</p>
                                    <p>
                                      {result.value} {result.unit}
                                    </p>
                                    <p>{result.classification}</p>
                                  </div>
                                </div>
                                <div className="col-1"></div>
                              </Row>
                            ))
                        ) : (
                          <div>No High result found</div> // If no High results are found
                        )
                      ) : (
                        <div>No High classification data available</div> // If medicalData array is empty
                      )}
                    </div>
                  </div>
                ) : (
                  <div>No medical data to display</div>
                )}
              </div>

              <br />
            </div>
          </div>
        </div>
      </div>

      <DoctorFooter {...props} />
    </div>
  );
};

export default ShowMore;

// import React, { useState } from "react";
// import DashboardSidebar from "../../dashboard/sidebar/sidebar.jsx";
// import StickyBox from "react-sticky-box";
// import { Link, useHistory } from "react-router-dom";
// import Header from "../../../header.jsx";
// import Footer from "../../../footer.jsx";
// import { IoChevronBackSharp } from "react-icons/io5";
// import "react-datepicker/dist/react-datepicker.css"; // Import datepicker styles
// import "../../../../../../src/pharmacyadmin/assets/css/style.css";
// import "../../../../assets/css/showDetails.css";
// import { Col, Row } from "react-bootstrap";
// import GreenArrow from "../../../../../client/assets/icons/result/mark.png";
// import blood from "../../../../../client/assets/icons/result/blood.png";

// const ShowMore = (props) => {
//   const history = useHistory(); // Fixed usage of useHistory

//   // State to track the active tab
//   const [activeTab, setActiveTab] = useState("HEMATOLOGIE");

//   // Handle tab click to change active tab
//   const handleTabClick = (tabName) => {
//     setActiveTab(tabName);
//   };

//   // Handle back button navigation
//   const handleBackButton = () => {
//     history.push("/patient/medicaldetails/show"); // Corrected push method
//   };

//   return (
//     <div className="main-wrapper">
//       <Header {...props} />

//       {/* Breadcrumb Navigation */}
//       <div className="breadcrumb-bar-two">
//         <div className="container">
//           <div className="row align-items-center inner-banner">
//             <div className="col-md-12 col-12 text-center ">
//               <h2 className="breadcrumb-title">Medical Details</h2>
//               <nav aria-label="breadcrumb" className="page-breadcrumb">
//                 <ol className="breadcrumb">
//                   <li className="breadcrumb-item">
//                     <Link to="#">Home</Link>
//                   </li>
//                   <li className="breadcrumb-item" aria-current="page">
//                     Medical Details
//                   </li>
//                 </ol>
//               </nav>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="content">
//         <div className="container">
//           <div className="row">
//             {/* Sidebar */}
//             <div className="col-md-5 col-lg-4 col-xl-3 theiaStickySidebar">
//               <StickyBox offsetTop={20} offsetBottom={20}>
//                 <DashboardSidebar />
//               </StickyBox>
//             </div>

//             {/* Main Content Section */}
//             <div className="col-md-7 col-lg-8 col-xl-9">
//               <div className="parent-tab d-flex gap-3 justify-content-around p-1">
//                 <div
//                   className={`tab ${
//                     activeTab === "HEMATOLOGIE" ? "active" : ""
//                   }`}
//                   onClick={() => handleTabClick("HEMATOLOGIE")}
//                 >
//                   HEMATOLOGIE
//                 </div>
//                 <div
//                   className={`tab ${
//                     activeTab === "GLYKEMIE CONTROLE" ? "active" : ""
//                   }`}
//                   onClick={() => handleTabClick("GLYKEMIE CONTROLE")}
//                 >
//                   GLYKEMIE CONTROLE
//                 </div>
//                 <div
//                   className={`tab ${
//                     activeTab === "KLINISCHE CHEMIE" ? "active" : ""
//                   }`}
//                   onClick={() => handleTabClick("KLINISCHE CHEMIE")}
//                 >
//                   KLINISCHE CHEMIE
//                 </div>
//                 <div
//                   className={`tab ${
//                     activeTab === "PROTEINE-DIAGNOSTIEK" ? "active" : ""
//                   }`}
//                   onClick={() => handleTabClick("PROTEINE-DIAGNOSTIEK")}
//                 >
//                   PROTEINE-DIAGNOSTIEK
//                 </div>
//                 <div
//                   className={`tab ${
//                     activeTab === "TUMOR-MONITORING" ? "active" : ""
//                   }`}
//                   onClick={() => handleTabClick("TUMOR-MONITORING")}
//                 >
//                   TUMOR-MONITORING
//                 </div>
//               </div>
//               <br />
//               <div className="p-all-main">
//                 <div className="main-2 d-flex">
//                   <div className="box l-box d-flex gap-5">
//                     <div className="mt-5">
//                       <img src={blood} width={"80px"} height={"80px"} alt="" />
//                     </div>
//                     <div className="mt-5">
//                       <h5 className="text-center">Hematologie</h5>
//                       <p className="average text-center">Average</p>
//                       <div className="bar"><div className="b1">Normal</div>
//                       <div className="b2">Average</div>
//                       <div className="b3">Good</div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="r-box">
//                     <br />
//                     <Row>
//                       <div className="col-1"></div>
//                       <div className="col-5">
//                         <h5>Bloedbeeld Groot</h5>
//                         <br />
//                         <br />
//                       </div>
//                       <div className="col-6"></div>
//                     </Row>

//                     <Row>
//                       <div className="col-1"></div>
//                       <div className="col-10">
//                         <div className="d-flex justify-content-between">
//                           <p>lymfocyten</p>
//                           <p>20.8%</p>
//                         </div>
//                       </div>
//                       <div className="col-1"></div>
//                     </Row>
//                     <Row>
//                       <div className="col-1"></div>
//                       <div className="col-10">
//                         <div className="d-flex justify-content-between">
//                           <p>monocyten</p>
//                           <p>13.1%</p>
//                         </div>
//                       </div>
//                       <div className="col-1"></div>
//                     </Row>
//                     <Row>
//                       <div className="col-1"></div>
//                       <div className="col-10">
//                         <div className="d-flex justify-content-between">
//                           <p>basofiele granulocytem</p>
//                           <p>0.5%</p>
//                         </div>
//                       </div>
//                       <div className="col-1"></div>
//                     </Row>
//                   </div>
//                   <br />
//                 </div>

//                 <br />
//                 <div className="p-box-2 d-flex gap-4" style={{ width: "100%" }}>
//                   <div className="left-section w-100 d-flex flex-column gap-4">
//                     <div className="left-section-1">
//                       <div className="d-flex gap-2">
//                         <div>
//                           <img
//                             src={GreenArrow}
//                             width={"80px"}
//                             height={"80px"}
//                             alt=""
//                           />
//                         </div>

//                         <div style={{ padding: "12px 23px" }}>
//                           <div>
//                             {" "}
//                             <p>Glykemie Controle</p>
//                           </div>
//                           <div className="light">
//                             {" "}
//                             <span className="fw-light">Good</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="left-section-2">
//                       <div className="d-flex gap-2">
//                         <div>
//                           <img
//                             src={GreenArrow}
//                             width={"80px"}
//                             height={"80px"}
//                             alt=""
//                           />
//                         </div>

//                         <div style={{ padding: "12px 23px" }}>
//                           <div>
//                             {" "}
//                             <p>Proteine-Diagnostiek</p>
//                           </div>
//                           <div className="light">
//                             {" "}
//                             <span className="fw-light">Good</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="right-section w-100">
//                     <Row>
//                       <div className="col-1"></div>
//                       <div className="col-5">
//                         <h5>Klinische Chemie</h5>
//                         <br />
//                         <br />
//                       </div>
//                       <div className="col-6"></div>
//                     </Row>

//                     <Row>
//                       <div className="col-1"></div>
//                       <div className="col-10">
//                         <div className="d-flex justify-content-between">
//                           <p>lymfocyten</p>
//                           <p>20.8%</p>
//                         </div>
//                       </div>
//                       <div className="col-1"></div>
//                     </Row>
//                     <Row>
//                       <div className="col-1"></div>
//                       <div className="col-10">
//                         <div className="d-flex justify-content-between">
//                           <p>monocyten</p>
//                           <p>13.1%</p>
//                         </div>
//                       </div>
//                       <div className="col-1"></div>
//                     </Row>
//                     <Row>
//                       <div className="col-1"></div>
//                       <div className="col-10">
//                         <div className="d-flex justify-content-between">
//                           <p>basofiele granulocytem</p>
//                           <p>0.5%</p>
//                         </div>
//                       </div>
//                       <div className="col-1"></div>
//                     </Row>
//                   </div>
//                 </div>
//                 <div className="back-btn text-end">
//                 <button
//                     onClick={handleBackButton}
//                     style={{ border: "none", backgroundColor: "transparent" }}
//                   >
//                     <IoChevronBackSharp />
//                     Back
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <Footer {...props} />
//     </div>
//   );
// };

// export default ShowMore;
