import React, { useState, useEffect } from "react";
import DashboardSidebar from "../dashboard/sidebar/sidebar.jsx";
import { Modal } from "react-bootstrap";
import StickyBox from "react-sticky-box";
import { Link } from "react-router-dom";
import Header from "../../header";
import DoctorFooter from "../../common/doctorFooter/index.jsx";
import { doctordashboardprofile06 } from "../../imagepath.jsx";
import DatePicker from "react-datepicker";
import { Select } from "antd";
import axios from "../../../../axiosConfig.js";
import "../../../../../src/pharmacyadmin/assets/css/style.css";

const MedicalDetails = (props) => {
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTags, setSelectedTags] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // State for medical details with default values
  const [height, setHeight] = useState(); // Added height state
  const [bloodGroup, setBloodGroup] = useState(""); // Added bloodGroup state
  const [bmi, setBmi] = useState(); // Default BMI value
  const [heartRate, setHeartRate] = useState(); // Default Heart Rate value
  const [weight, setWeight] = useState(); // Default Weight value
  const [endDate, setEndDate] = useState(new Date()); // Default End Date value
  const [userID, setUserID] = useState();
  const [loading, setLoading] = useState(true); // Track loading state for fetching data
  const [patientData, setPatientData] = useState({});

  const userId = localStorage.getItem("userData");

  // Fetch medical details from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/patient-profile-information/${userId}`
        );
        const data = await response.data;

        // Update the state with fetched data
        setPatientData(data?.patient);
        setUserID(data.patient.userId);
        setBmi(data.patient.healthData.bmi);
        setHeartRate(data.patient.healthData.heartRate);
        setWeight(data.patient.healthData.weight);
        setHeight(data.patient.healthData.height); // Assuming the API returns height
        setBloodGroup(data.patient.healthData.bloodGroup); // Assuming the API returns blood group
        setEndDate(new Date(data.endDate)); // Assuming the API returns a date string
        setLoading(false);
      } catch (error) {
        console.error("Error fetching medical details:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Automatic BMI calculation whenever height or weight changes
  useEffect(() => {
    if (height && weight) {
      const heightInMeters = height / 100; // Convert cm to meters
      const calculatedBMI = weight / (heightInMeters * heightInMeters);
      setBmi(calculatedBMI.toFixed(2)); // Round BMI to two decimal places
    }
  }, [height, weight]); // Recalculate BMI whenever height or weight changes

  const handleDropdownVisibleChange = (open) => {
    setDropdownOpen(open);
  };

  const handleChange = (value) => {
    setSelectedTags(value);
    setDropdownOpen(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setEndDate(date);
  };

  const handleUpdate = async () => {
    console.log("Updating...");
    try {
      const updatedData = {
        bmi,
        heartRate,
        weight,
        height,
        bloodGroup,
      };

      const response = await axios.put(
        `/api/update-patient-information/${userId}`,
        { healthData: updatedData }
      );
      console.log("Medical details updated successfully:", response.data);

      // Optionally, display a success message to the user
      alert("Medical details updated successfully!");
    } catch (error) {
      console.error("Error updating medical details:", error);
      alert("Failed to update medical details");
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator while fetching
  }

  return (
    <>
      <div className="main-wrapper">
        <Header {...props} />
        <div className="breadcrumb-bar-two">
          <div className="container">
            <div className="row align-items-center inner-banner">
              <div className="col-md-12 col-12 text-center">
                <h2 className="breadcrumb-title">Health Details</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/patient/dashboard">Home</Link>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      Health Details
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
                  <h3>Health Details</h3>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="search-header">
                      <div className="search-field">
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
                  </div>
                  <div className="col-sm-6"></div>
                  <div className="col-md-12">
                    <div className="custom-table">
                      <div className="table-responsive">
                        <table className="table table-center mb-0">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Patient Name</th>
                              <th>BMI</th>
                              <th>Heart Rate</th>
                              <th>Blood Group</th>
                              <th>Height</th>
                              <th>Weight</th>
                              {/* <th>Added on</th> */}
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <Link
                                  className="text-blue-600"
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#med-detail"
                                >
                                  #{patientData.userId}
                                </Link>
                              </td>
                              <td>
                                <h2 className="table-avatar">
                                  <Link
                                    to="/doctor/patient-profile"
                                    className="avatar avatar-sm me-2"
                                  >
                                    <img
                                      className="avatar-img rounded-3"
                                      src={patientData.profileImage ? patientData.profileImage : "/assets/images/doctor-thumb-01.png"}
                                      alt="User Image"
                                    />
                                  </Link>
                                  <Link to="/patient/doctor-profile">
                                    {patientData.information.firstName}
                                    {patientData.information.lastName}
                                  </Link>
                                </h2>
                              </td>
                              <td>{bmi}</td>
                              <td>{heartRate}</td>
                              <td>{bloodGroup}</td>
                              <td>{height}</td>
                              <td>{weight}</td>
                              {/* <td>22 Mar 2024</td> */}
                              <td>
                                <div className="action-item">
                                  <Link
                                    to="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#edit-med-record"
                                    title="Edit Medical Record"
                                  >
                                    <i className="fa-solid fa-pen-to-square" />
                                  </Link>
                                  {/* <Link to="#">
                                    <i className="fa-solid fa-trash-can" />
                                  </Link> */}
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DoctorFooter {...props} />
      </div>

      {/* Edit Medical Detail */}
      <div className="modal fade custom-modals" id="edit-med-record">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Health Details</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <form>
              <div className="modal-body">
                <div className="timing-modal">
                  <div className="row">
                    {/* Height Field */}
                    <div className="col-md-6">
                      <div className="input-block input-block-new">
                        <label className="form-label">Height</label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="Enter Height"
                          />
                          <span className="input-group-text">cm</span>
                        </div>
                      </div>
                    </div>

                    {/* Heart Rate Field */}
                    <div className="col-md-6">
                      <div className="input-block input-block-new">
                        <label className="form-label">Heart Rate</label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            value={heartRate}
                            onChange={(e) => setHeartRate(e.target.value)}
                            placeholder="Enter Heart Rate"
                          />
                          <span className="input-group-text">bpm</span>
                        </div>
                      </div>
                    </div>

                    {/* Weight Field */}
                    <div className="col-md-6">
                      <div className="input-block input-block-new">
                        <label className="form-label">Weight</label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="Enter Weight"
                          />
                          <span className="input-group-text">kg</span>
                        </div>
                      </div>
                    </div>

                    {/* Blood Group Field */}
                    <div className="col-md-6">
                      <div className="input-block input-block-new">
                        <label className="form-label">Blood Group</label>
                        <select
                          className="form-control"
                          value={bloodGroup}
                          onChange={(e) => setBloodGroup(e.target.value)}
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A+">A positive (A+)</option>
                          <option value="A-">A negative (A-)</option>
                          <option value="B+">B positive (B+)</option>
                          <option value="B-">B negative (B-)</option>
                          <option value="AB+">AB positive (AB+)</option>
                          <option value="AB-">AB negative (AB-)</option>
                          <option value="O+">O positive (O+)</option>
                          <option value="O-">O negative (O-)</option>
                        </select>
                      </div>
                    </div>

                    {/* BMI Field */}
                    <div className="col-md-6">
                      <div className="input-block input-block-new">
                        <label className="form-label">BMI</label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            value={bmi}
                            readOnly // Make BMI read-only since it is calculated automatically
                            placeholder="BMI"
                          />
                          <span className="input-group-text">kg/m²</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <div className="modal-btn text-end">
                  {/* <a
                    href="#"
                    className="btn btn-gray"
                    data-bs-toggle="modal"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </a> */}
                  <button
                    type="button"
                    className="btn"
                    style={{ backgroundColor: "#008080", color: "#fff" }}
                    onClick={handleUpdate}
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default MedicalDetails;


// import React, { useState, useEffect } from "react";
// import DashboardSidebar from "../dashboard/sidebar/sidebar.jsx";
// import { Modal } from "react-bootstrap";
// import StickyBox from "react-sticky-box";
// import { Link } from "react-router-dom";
// import Header from "../../header";
// import Footer from "../../footer";
// import { doctordashboardprofile06 } from "../../imagepath.jsx";
// import DatePicker from "react-datepicker";
// import { Select } from "antd";
// import axios from "../../../../axiosConfig.js";
// import "../../../../../src/pharmacyadmin/assets/css/style.css";
// import BMIGauge from "../dashboard/BMIGauge .jsx";

// const MedicalDetails = (props) => {
//   const [show, setShow] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   // State for medical details with default values
//   const [height, setHeight] = useState(); // Added height state
//   const [bloodGroup, setBloodGroup] = useState(""); // Added bloodGroup state
//   const [bmi, setBmi] = useState(); // Default BMI value
//   const [heartRate, setHeartRate] = useState(); // Default Heart Rate value
//   const [weight, setWeight] = useState(); // Default Weight value
//   const [endDate, setEndDate] = useState(new Date()); // Default End Date value
//   const [userID, setUserID] = useState();
//   const [loading, setLoading] = useState(true); // Track loading state for fetching data
//   const [patientData, setPatientData] = useState({});

//   const userId = localStorage.getItem("userData");

//   // Fetch medical details from API on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           `/api/patient-profile-information/${userId}`
//         );
//         const data = await response.data;

//         // Update the state with fetched data
//         setPatientData(data?.patient);
//         setUserID(data.patient.userId);
//         setBmi(data.patient.healthData.bmi);
//         setHeartRate(data.patient.healthData.heartRate);
//         setWeight(data.patient.healthData.weight);
//         setHeight(data.patient.healthData.height); // Assuming the API returns height
//         setBloodGroup(data.patient.healthData.bloodGroup); // Assuming the API returns blood group
//         setEndDate(new Date(data.endDate)); // Assuming the API returns a date string
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching medical details:", error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Automatic BMI calculation whenever height or weight changes
//   useEffect(() => {
//     if (height && weight) {
//       const heightInMeters = parseFloat(height) / 100; // Ensure height is converted to a number
//       const weightInKg = parseFloat(weight); // Ensure weight is converted to a number

//       if (heightInMeters > 0 && weightInKg > 0) {
//         const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
//         setBmi(calculatedBMI.toFixed(2)); // Round BMI to two decimal places
//       } else {
//         setBmi(0); // Default BMI in case of invalid height or weight
//       }
//     } else {
//       setBmi(0); // Default BMI if height or weight is not provided
//     }
//   }, [height, weight]);

//   const handleDropdownVisibleChange = (open) => {
//     setDropdownOpen(open);
//   };

//   const handleChange = (value) => {
//     setSelectedTags(value);
//     setDropdownOpen(false);
//   };

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     setEndDate(date);
//   };

//   const handleUpdate = async () => {
//     console.log("Updating...");
    
//     // Recalculate BMI based on the latest height and weight
//     let calculatedBMI = 0;
//     if (height && weight) {
//       const heightInMeters = parseFloat(height) / 100;
//       const weightInKg = parseFloat(weight);
      
//       if (heightInMeters > 0 && weightInKg > 0) {
//         calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
//       }
//     }
    
//     try {
//       const updatedData = {
//         bmi: calculatedBMI.toFixed(2), // Ensure BMI is recalculated before sending
//         heartRate,
//         weight,
//         height,
//         bloodGroup,
//       };
  
//       const response = await axios.put(
//         `/api/update-patient-information/${userId}`,
//         { healthData: updatedData }
//       );
//       console.log("Medical details updated successfully:", response.data);
  
//       // Optionally, display a success message to the user
//       alert("Medical details updated successfully!");
//     } catch (error) {
//       console.error("Error updating medical details:", error);
//       alert("Failed to update medical details");
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>; // Display a loading indicator while fetching
//   }

//   return (
//     <>
//       <div className="main-wrapper">
//         <Header {...props} />
//         <div className="breadcrumb-bar-two">
//           <div className="container">
//             <div className="row align-items-center inner-banner">
//               <div className="col-md-12 col-12 text-center">
//                 <h2 className="breadcrumb-title">Medical Details</h2>
//                 <nav aria-label="breadcrumb" className="page-breadcrumb">
//                   <ol className="breadcrumb">
//                     <li className="breadcrumb-item">
//                       <Link to="#">Home</Link>
//                     </li>
//                     <li className="breadcrumb-item" aria-current="page">
//                       Medical Details
//                     </li>
//                   </ol>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="content">
//           <div className="container">
//             <div className="row">
//               <div className="col-md-5 col-lg-4 col-xl-3 theiaStickySidebar">
//                 <StickyBox offsetTop={20} offsetBottom={20}>
//                   <DashboardSidebar />
//                 </StickyBox>
//               </div>
//               <div className="col-lg-8 col-xl-9">
//                 <div className="dashboard-header">
//                   <h3>Medical Details</h3>
//                 </div>
//                 <div className="row">
//                   <div className="col-sm-6">
//                     <div className="search-header">
//                       <div className="search-field">
//                         <input
//                           type="text"
//                           className="form-control"
//                           placeholder="Search"
//                         />
//                         <span className="search-icon">
//                           <i className="fa-solid fa-magnifying-glass" />
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-sm-6"></div>
//                   <div className="col-md-12">
//                     <div className="custom-table">
//                       <div className="table-responsive">
//                         <table className="table table-center mb-0">
//                           <thead>
//                             <tr>
//                               <th>ID</th>
//                               <th>Patient Name</th>
//                               <th>BMI</th>
//                               <th>Heart Rate</th>
//                               <th>Blood Group</th>
//                               <th>Height</th>
//                               <th>Weight</th>
//                               <th>Added on</th>
//                               <th>Action</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             <tr>
//                               <td>
//                                 <Link
//                                   className="text-blue-600"
//                                   to="#"
//                                   data-bs-toggle="modal"
//                                   data-bs-target="#med-detail"
//                                 >
//                                   #{patientData.userId}
//                                 </Link>
//                               </td>
//                               <td>
//                                 <h2 className="table-avatar">
//                                   <Link
//                                     to="/doctor/patient-profile"
//                                     className="avatar avatar-sm me-2"
//                                   >
//                                     <img
//                                       className="avatar-img rounded-3"
//                                       src={patientData.profileImage}
//                                       alt="User Image"
//                                     />
//                                   </Link>
//                                   <Link to="/patient/doctor-profile">
//                                     {patientData.information.firstName}
//                                     {patientData.information.lastName}
//                                   </Link>
//                                 </h2>
//                               </td>
//                               <td>{bmi}</td>
//                               <td>{heartRate}</td>
//                               <td>{bloodGroup}</td>
//                               <td>{height}</td>
//                               <td>{weight}</td>
//                               <td>22 Mar 2024</td>
//                               <td>
//                                 <div className="action-item">
//                                   <Link
//                                     to="#"
//                                     data-bs-toggle="modal"
//                                     data-bs-target="#edit-med-record"
//                                   >
//                                     <i className="fa-solid fa-pen-to-square" />
//                                   </Link>
//                                 </div>
//                               </td>
//                             </tr>
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <Footer {...props} />
//       </div>

//       {/* Edit Medical Detail */}
//       <div className="modal fade custom-modals" id="edit-med-record">
//         <div className="modal-dialog modal-dialog-centered modal-md">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title">Edit Medical Details</h5>
//               <button
//                 type="button"
//                 className="btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               >
//                 <i className="fa-solid fa-xmark" />
//               </button>
//             </div>
//             <form>
//               <div className="modal-body">
//                 <div className="timing-modal">
//                   <div className="row">
//                     {/* Height Field */}
//                     <div className="col-md-6">
//                       <div className="input-block input-block-new">
//                         <label className="form-label">Height</label>
//                         <div className="input-group">
//                           <input
//                             type="number"
//                             className="form-control"
//                             value={height}
//                             onChange={(e) =>
//                               setHeight(Math.max(0, e.target.value))
//                             } // Prevent negative values
//                             placeholder="Enter Height"
//                           />
//                           <span className="input-group-text">cm</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Heart Rate Field */}
//                     <div className="col-md-6">
//                       <div className="input-block input-block-new">
//                         <label className="form-label">Heart Rate</label>
//                         <div className="input-group">
//                           <input
//                             type="number"
//                             className="form-control"
//                             value={heartRate}
//                             onChange={(e) => setHeartRate(e.target.value)}
//                             placeholder="Enter Heart Rate"
//                           />
//                           <span className="input-group-text">bpm</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Weight Field */}
//                     <div className="col-md-6">
//                       <div className="input-block input-block-new">
//                         <label className="form-label">Weight</label>
//                         <div className="input-group">
//                           <input
//                             type="number"
//                             className="form-control"
//                             value={weight}
//                             onChange={(e) =>
//                               setWeight(Math.max(0, e.target.value))
//                             } // Prevent negative values
//                             placeholder="Enter Weight"
//                           />
//                           <span className="input-group-text">kg</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Blood Group Field */}
//                     <div className="col-md-6">
//                       <div className="input-block input-block-new">
//                         <label className="form-label">Blood Group</label>
//                         <select
//                           className="form-control"
//                           value={bloodGroup}
//                           onChange={(e) => setBloodGroup(e.target.value)}
//                         >
//                           <option value="">Select Blood Group</option>
//                           <option value="A+">A positive (A+)</option>
//                           <option value="A-">A negative (A-)</option>
//                           <option value="B+">B positive (B+)</option>
//                           <option value="B-">B negative (B-)</option>
//                           <option value="O+">O positive (O+)</option>
//                           <option value="O-">O negative (O-)</option>
//                           <option value="AB+">AB positive (AB+)</option>
//                           <option value="AB-">AB negative (AB-)</option>
//                         </select>
//                       </div>
//                     </div>

//                     {/* BMI Gauge */}
//                     <div className="col-md-12">
//                       <div className="text-center">
//                         {/* <BMIGauge bmi={bmi} /> */}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-primary"
//                   onClick={handleUpdate}
//                 >
//                   Save Changes
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   data-bs-dismiss="modal"
//                 >
//                   Close
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default MedicalDetails;
