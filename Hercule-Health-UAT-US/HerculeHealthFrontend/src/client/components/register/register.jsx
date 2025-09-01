import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import loginBanner from "../../../../public/assets/images/login-banner.png";
// import Header from "../header";
import Home1Header from "../home/home-1/header";
import Footer from "../footer";
import baseUrl from "../../../config/config";
 
const Register = (props) => {
  // State hooks to manage the input fields
  const [firstName, setFirstName] = useState("");
  const[lastName,setLastName]=useState('');
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
 
  const [errorMessage, setErrorMessage] = useState("");  // For error messages
 
  const history = useHistory(); // For navigation (optional)
 
  useEffect(() => {
    document.body.classList.add("account-page");
 
    return () => document.body.classList.remove("account-page");
  }, []);
 
  // Handle changes in the input fields
  const handleFirstNameChange = (e) => setFirstName(e.target.value);
  const handleLastNameChange=(e)=>setLastName(e.target.value)
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
 
  // Validate email format
  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };
 
  // Validate phone number format (for example, simple validation)
  const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };
 
  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
 
    // Validate form fields
    
    let errors = [];
  
    if (!firstName) errors.push("First Name");
    if (!lastName) errors.push("Last Name");
    if (!email) errors.push("Email");
    if (!phone) errors.push("Mobile Number");
    if (!password) errors.push("Password");
  
    if (errors.length > 0) {
      const message = `${errors.join(", ")} ${errors.length > 1 ? 'fields are' : 'field is'} required.`;
      setErrorMessage(message);
      return; // Stop here if errors found
    }
 
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email.");
      return;
    }
 
    if (!validatePhone(phone)) {
      setErrorMessage("Please enter a valid phone number.");
      return;
    }
 
    try {
      // API call to check if the email is valid and not already registered
      const response = await fetch(`${baseUrl}/api/email-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
     
      const result = await response.json();
     
      if (response.ok) {
        // Proceed to next page if email is valid and not already registered
        if (result.exists) {
          setErrorMessage(result.message); // Show error if email exists
        } else {
          // Store the data in localStorage for the next step
          const registrationData = { lastName, firstName, email, phone, password };
          localStorage.setItem("registrationData", JSON.stringify(registrationData));
 
          // Redirect to the next step
          history.push("/patient/patientregisterstep-1");
        }
      } else {
        // Show error message from backend
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage("An error occurred while checking the email.");
    }
  };
 
 
  return (
    <>
      <Home1Header />
 
      <div className="content top-space">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              {/* Register Content */}
              <div className="account-content">
                <div className="row align-items-center justify-content-center">
                  <div className="col-md-7 col-lg-6 login-left">
                    <img
                      src={loginBanner}
                      className="img-fluid"
                      alt="Hercule Health Register"
                    />
                  </div>
                  <div className="col-md-12 col-lg-6 login-right">
                    <div className="login-header">
                      <h3>
                        Patient Register{" "}
                        <Link to="/doctor/doctor-register" style={{ color: "#298080"}}>
                          Are you a Doctor?
                        </Link>
                      </h3>
                    </div>
 
                    {/* Register Form */}
                    <form onSubmit={handleFormSubmit}>
                      <div className="form-group">
                      <label>First Name<span className="text-danger"> *</span></label>
                        <input
                          type="text"
                          className="form-control floating"
                          value={firstName}
                          onChange={handleFirstNameChange}
                        />
                      </div>
                      <div className="form-group">
                      <label>Last Name<span className="text-danger"> *</span></label>
                        <input
                          type="text"
                          className="form-control floating"
                          value={lastName}
                          onChange={handleLastNameChange}
                        />
                      </div>
                      <div className="form-group">
                      <label>Email<span className="text-danger"> *</span></label>
                        <input
                          type="email"
                          className="form-control floating"
                          value={email}
                          onChange={handleEmailChange}
                        />
                      </div>
                      <div className="form-group">
                      <label>Mobile Number<span className="text-danger"> *</span></label>
                        <input
                          type="text"
                          className="form-control floating"
                          value={phone}
                          onChange={handlePhoneChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Create Password<span className="text-danger"> *</span></label>
                        <input
                          type="password"
                          className="form-control floating"
                          value={password}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <div className="text-end">
                        <Link className="forgot-link" to="/login">
                          Already have an account?
                        </Link>
                      </div>
                      
                    {/* Display error message */}
                    {errorMessage && (
                      <div className="alert alert-danger">{errorMessage}</div>
                    )}
 
                      <button
                        type="submit"
                        style={{ backgroundColor: "#073b87 ", color: "#fff"}}
                        className="btn w-100 btn-lg login-btn"
                      >
                        Signup
                      </button>
                      {/* <div className="login-or">
                        <span className="or-line" />
                        <span className="span-or">or</span>
                      </div>
                      <div className="row form-row social-login">
                        <div className="col-6">
                          <Link to="#" className="btn btn-facebook w-100">
                            <i className="fab fa-facebook-f me-1" /> Login
                          </Link>
                        </div>
                        <div className="col-6">
                          <Link to="#" className="btn btn-google w-100">
                            <i className="fab fa-google me-1" /> Login
                          </Link>
                        </div>
                      </div> */}
                    </form>
                    {/* /Register Form */}
                  </div>
                </div>
              </div>
              {/* /Register Content */}
            </div>
          </div>
        </div>
      </div>
 
      <Footer {...props} />
    </>
  );
};
 
export default Register;