

// import React, { useEffect, useState } from "react";
// import { Link, useHistory } from "react-router-dom";
// import Header from "../../header";
// import DoctorFooter from "../../common/doctorFooter/index.jsx";
// import axios from "../../../../axiosConfig";

// const BookingSuccess = (props) => {
//   const [consultantInfo, setConsultantInfo] = useState(null);
//   const [paymentDetails, setPaymentDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [bookingDetails, setBookingDetails] = useState(null);
//   const [pollingError, setPollingError] = useState(null);
//   const history = useHistory();

//   const fetchBookingDetails = async (appointmentId, consultantId) => {
//     const parsedConsultantId = Number(consultantId);
//     try {
//       const response = await axios.post(`/api/get-booking-details/${appointmentId}`, {
//         consultantId: parsedConsultantId,
//       });
//       console.log("Booking Details Response:(first one) have payment details and consultantdetails", response.data);
//       setBookingDetails(response.data);
//       setPaymentDetails(response.data.paymentDetails);
//       setConsultantInfo(response.data.consultantDetails);
//     } catch (err) {
//       console.error("Error fetching booking details:", err);
//       setError("Error fetching booking details.");
//     }
//   };

//   const pollPaymentStatus = async (appointmentId, consultantId) => {
//   let attempts = 0;
//   const maxAttempts = 10;

//   const poll = async () => {
//     try {
//       const response = await axios.post(`/api/get-booking-details/${appointmentId}`, {
//         consultantId: Number(consultantId),
//       });

//       const paymentStatus = response.data.paymentDetails?.status;
//       console.log("polling second one repeated calling", response.data);

//       // Stop polling if payment is confirmed (paid) or failed/other final states
//       if (paymentStatus === "paid" || (paymentStatus !== "open" && paymentStatus !== "pending")) {
//         setPaymentDetails(response.data.paymentDetails);
//         setConsultantInfo(response.data.consultantDetails);
//         setLoading(false);
//         return; // Stop polling - payment is in final state
//       }

//       // Continue polling only if status is "open" or "pending"
//       if (paymentStatus === "open" || paymentStatus === "pending") {
//         attempts++;
//         if (attempts >= maxAttempts) {
//           setPollingError("Payment is taking longer than expected. Please check back later.");
//           setLoading(false);
//           return; // Stop polling after max attempts
//         }

//         // Continue polling
//         setTimeout(poll, 3000);
//       } else {
//         // Handle any other unexpected status
//         setPaymentDetails(response.data.paymentDetails);
//         setConsultantInfo(response.data.consultantDetails);
//         setLoading(false);
//       }
//     } catch (err) {
//       console.error("Error polling payment status:", err);
//       setPollingError("Error checking payment status.");
//       setLoading(false);
//     }
//   };

//   poll();
// };

//   useEffect(() => {
//     const queryParams = new URLSearchParams(window.location.search);
//     const appointmentId = queryParams.get("appointmentId");
//     const consultantId = queryParams.get("consultantId");

//     if (appointmentId && consultantId) {
//       fetchBookingDetails(appointmentId, consultantId).then(() => {
//         pollPaymentStatus(appointmentId, consultantId);
//       });
//     } else {
//       setError("Invalid booking details in URL.");
//       setLoading(false);
//     }
//   }, []);

//   const goToDashboard = () => {
//     history.push("/patient/dashboard");
//   };

//   return (
//     <>
//       <Header {...props} />
//       <div className="breadcrumb-bar-two">
//         <div className="container">
//           <div className="row align-items-center inner-banner">
//             <div className="col-md-12 col-12 text-center">
//               <h2 className="breadcrumb-title">Booking Details</h2>
//               <nav aria-label="breadcrumb" className="page-breadcrumb">
//                 <ol className="breadcrumb">
//                   <li className="breadcrumb-item">
//                     <Link to="/patient/dashboard">Home</Link>
//                   </li>
//                   <li className="breadcrumb-item" aria-current="page">
//                     Booking
//                   </li>
//                 </ol>
//               </nav>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="content success-page-cont">
//         <div className="w-100">
//           <div className="row justify-content-center">
//             <div className="col-lg-8">
//               {loading ? (
//                 <div className="text-center py-5">
//                   <div className="spinner-border text-primary" role="status">
//                     <span className="sr-only">Loading...</span>
//                   </div>
//                   <p className="mt-3">Payment is being processed. Please wait...</p>
//                 </div>
//               ) : pollingError ? (
//                 <div className="d-flex flex-column align-items-center">
//                   <div className="text-danger text-center">{pollingError}</div>
//                   <button className="btn btn-primary mt-3" onClick={goToDashboard}>
//                     Back To Home
//                   </button>
//                 </div>
//               ) : error ? (
//                 <div className="text-danger text-center">{error}</div>
//               ) : (
//                 <div className="card success-card">
//                   <div className="card-body">
//                     <div className="success-cont text-center">
//                       <i className="fas fa-check-circle fa-3x text-success"></i>
//                       <h3 className="mt-3">Booking and Payment Details</h3>
//                     </div>

//                     <div className="table-responsive mt-5">
//                       <h5>Payment Details</h5>
//                       <table className="table table-bordered">
//                         <tbody>
//                           <tr>
//                             <th>Transaction ID</th>
//                             <td>{paymentDetails?.transactionId}</td>
//                           </tr>
//                           <tr>
//                             <th>Invoice Number</th>
//                             <td>{paymentDetails?.invoiceNumber}</td>
//                           </tr>
//                           <tr>
//                             <th>Payment ID</th>
//                             <td>{paymentDetails?.paymentId}</td>
//                           </tr>
//                           <tr>
//                             <th>Amount</th>
//                             <td>
//                               {paymentDetails?.amount} {paymentDetails?.currency}
//                             </td>
//                           </tr>
//                           <tr>
//                             <th>Status</th>
//                             <td>
//                               <span
//                                 className={`badge ${paymentDetails?.status === "open"
//                                     ? "bg-warning text-dark"
//                                     : "bg-success"
//                                   }`}
//                               >
//                                 {paymentDetails?.status}
//                               </span>
//                             </td>
//                           </tr>
//                           <tr>
//                             <th>Transaction Date</th>
//                             <td>
//                               {new Date(paymentDetails?.transactionDate).toLocaleString()}
//                             </td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </div>

//                     {/* <div className="table-responsive mt-4">
//                       <h5>Consultant Details</h5>
//                       <table className="table table-bordered">
//                         <tbody>
//                           <tr>
//                             <th>Consultant ID</th>
//                             <td>{consultantInfo?._id}</td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </div> */}

//                     <div className="text-center mt-4">
//                       <Link to="/patient/dashboard" className="btn btn-primary px-4">
//                         Back to Home
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <DoctorFooter {...props} />
//     </>
//   );
// };

// export default BookingSuccess;

import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Header from "../../header";
import DoctorFooter from "../../common/doctorFooter/index.jsx";
import axios from "../../../../axiosConfig";

const BookingSuccess = (props) => {
  const [consultantInfo, setConsultantInfo] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [pollingError, setPollingError] = useState(null);
  const history = useHistory();

  const fetchBookingDetails = async (appointmentId, consultantId) => {
    const parsedConsultantId = Number(consultantId);
     const storedAppointmentDetails = localStorage.getItem("appointmentDetails");
     let appointmentDetails = null;

     if (storedAppointmentDetails) {
    appointmentDetails = JSON.parse(storedAppointmentDetails);
  }
     
    try {
       const requestBody = {
      consultantId: parsedConsultantId,
    };
    
    // Add appointment details to the request if available
    if (appointmentDetails) {
      requestBody.date = appointmentDetails.date;
      requestBody.time = appointmentDetails.time;
      requestBody.timeZone = appointmentDetails.timeZone;
      requestBody.appointmentType = appointmentDetails.appointmentType;
      requestBody.patientEmail = appointmentDetails.patientEmail;
      requestBody.consultantEmail = appointmentDetails.consultantEmail;
    }
    
    const response = await axios.post(`/api/get-booking-details/${appointmentId}`, requestBody);
    
    console.log("Booking Details Response:(first one) have payment details and consultantdetails", response.data);
      
      setBookingDetails(response.data);
      setPaymentDetails(response.data.paymentDetails);
      setConsultantInfo(response.data.consultantDetails);
      
      const paymentStatus = response.data.paymentDetails?.status;
      
      // Check if payment is already in final state
      if (paymentStatus === "paid" || (paymentStatus !== "open" && paymentStatus !== "pending")) {
        setLoading(false); // No need to poll, payment is already finalized
        return false; // Return false to indicate no polling needed
      }
      
      return true; // Return true to indicate polling is needed
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setError("Error fetching booking details.");
      setLoading(false);
      return false;
    }
  };

  const pollPaymentStatus = async (appointmentId, consultantId) => {
    let attempts = 0;
    const maxAttempts = 10;

     const storedAppointmentDetails = localStorage.getItem("appointmentDetails");
  let appointmentDetails = null;
  
  if (storedAppointmentDetails) {
    appointmentDetails = JSON.parse(storedAppointmentDetails);
  }

  const poll = async () => {
    try {
      const requestBody = {
        consultantId: Number(consultantId),
      };
      
      // Add appointment details to the request if available
      if (appointmentDetails) {
        requestBody.date = appointmentDetails.date;
        requestBody.time = appointmentDetails.time;
        requestBody.timeZone = appointmentDetails.timeZone;
        requestBody.appointmentType = appointmentDetails.appointmentType;
        requestBody.patientEmail = appointmentDetails.patientEmail;
        requestBody.consultantEmail = appointmentDetails.consultantEmail;
      }
      
      const response = await axios.post(`/api/get-booking-details/${appointmentId}`, requestBody);

        const paymentStatus = response.data.paymentDetails?.status;
        console.log("polling second one repeated calling", response.data);

        // Stop polling if payment is confirmed (paid) or failed/other final states
        if (paymentStatus === "paid" || (paymentStatus !== "open" && paymentStatus !== "pending")) {
          setPaymentDetails(response.data.paymentDetails);
          setConsultantInfo(response.data.consultantDetails);
          setLoading(false);
          return; // Stop polling - payment is in final state
        }

        // Continue polling only if status is "open" or "pending"
        if (paymentStatus === "open" || paymentStatus === "pending") {
          attempts++;
          if (attempts >= maxAttempts) {
            setPollingError("Payment is taking longer than expected. Please check back later.");
            setLoading(false);
            return; // Stop polling after max attempts
          }

          // Continue polling
          setTimeout(poll, 3000);
        } else {
          // Handle any other unexpected status
          setPaymentDetails(response.data.paymentDetails);
          setConsultantInfo(response.data.consultantDetails);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error polling payment status:", err);
        setPollingError("Error checking payment status.");
        setLoading(false);
      }
    };

    poll();
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const appointmentId = queryParams.get("appointmentId");
    const consultantId = queryParams.get("consultantId");

    if (appointmentId && consultantId) {
      fetchBookingDetails(appointmentId, consultantId).then((needsPolling) => {
        // Only start polling if the first call indicates polling is needed
        if (needsPolling) {
          pollPaymentStatus(appointmentId, consultantId);
        }
      });
    } else {
      setError("Invalid booking details in URL.");
      setLoading(false);
    }
  }, []);

  const goToDashboard = () => {
    history.push("/patient/dashboard");
  };

  return (
    <>
      <Header {...props} />
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Booking Details</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/patient/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Booking
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="content success-page-cont">
        <div className="w-100">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p className="mt-3">Payment is being processed. Please wait...</p>
                </div>
              ) : pollingError ? (
                <div className="d-flex flex-column align-items-center">
                  <div className="text-danger text-center">{pollingError}</div>
                  <button className="btn btn-primary mt-3" onClick={goToDashboard}>
                    Back To Home
                  </button>
                </div>
              ) : error ? (
                <div className="text-danger text-center">{error}</div>
              ) : (
                <div className="card success-card">
                  <div className="card-body">
                    <div className="success-cont text-center">
                      <i className="fas fa-check-circle fa-3x text-success"></i>
                      <h3 className="mt-3">Booking and Payment Details</h3>
                    </div>

                    <div className="table-responsive mt-5">
                      <h5>Payment Details</h5>
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <th>Transaction ID</th>
                            <td>{paymentDetails?.transactionId}</td>
                          </tr>
                          <tr>
                            <th>Invoice Number</th>
                            <td>{paymentDetails?.invoiceNumber}</td>
                          </tr>
                          <tr>
                            <th>Payment ID</th>
                            <td>{paymentDetails?.paymentId}</td>
                          </tr>
                          <tr>
                            <th>Amount</th>
                            <td>
                              {paymentDetails?.amount} {paymentDetails?.currency}
                            </td>
                          </tr>
                          <tr>
                            <th>Status</th>
                            <td>
                              <span
                                className={`badge ${paymentDetails?.status === "open"
                                    ? "bg-warning text-dark"
                                    : paymentDetails?.status === "paid"
                                    ? "bg-success"
                                    : "bg-danger"
                                  }`}
                              >
                                {paymentDetails?.status}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <th>Transaction Date</th>
                            <td>
                              {new Date(paymentDetails?.transactionDate).toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="text-center mt-4">
                      <Link to="/patient/dashboard" className="btn btn-primary px-4">
                        Back to Home
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <DoctorFooter {...props} />
    </>
  );
};

export default BookingSuccess;
