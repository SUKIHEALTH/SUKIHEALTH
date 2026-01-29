import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom"; // make sure it's imported
import loginBanner from "../../../../../public/assets/images/login-banner.png";
import { Link, useHistory } from "react-router-dom"; // Import useHistory for routing
// import Header from "../../header";
import Home1Header from "../../home/home-1/header";
import Footer from "../../footer";

const DoctorRegister = (props) => {
  const config = ""; // Placeholder for your config URL
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // For error messages
  const history = useHistory();

  useEffect(() => {
    document.getElementsByTagName("body")[0].className = "account-page";
    return () => (document.getElementsByTagName("body")[0].className = "");
  }, []);

  const handleFirstNameChange = (e) => setFirstName(e.target.value);
  const handleLastNameChange = (e) => setLastName(e.target.value);
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
    const regex = /^[0-9]{10}$/; // Simple validation for 10 digits
    return regex.test(phone);
  };

  // Form submission handler
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent page reload on submit

    // Reset any previous error messages
    setErrorMessage("");

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

    // Store the data in localStorage
    const registrationData = {
      firstName,
      lastName,
      displayName: "Dr. "+firstName+' '+lastName,
      email,
      phone,
      password,
    };
    localStorage.setItem("registrationData", JSON.stringify(registrationData));

    // Redirect to the next step (you can modify the path)
    history.push("/registerstepone");
  };

  return (
    <>
      <Home1Header />
      <div className="content top-space">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <div className="account-content">
                <div className="row align-items-center justify-content-center">
                  <div className="col-md-7 col-lg-6 login-left">
                    <img
                      src={loginBanner}
                      className="img-fluid"
                      alt="Login Banner"
                    />
                  </div>
                  <div className="col-md-12 col-lg-6 login-right">
                    <div className="login-header">
                      <h3 >
                        Doctor Register{" "}
                        <Link to="/register" style={{ color: "#073b87"}}>Not a Doctor?</Link>
                      </h3>
                    </div>


                    {/* Form */}
                    <form onSubmit={handleFormSubmit}>
                      <div className="form-group">
                      <label>First Name<span className="text-danger"> *</span></label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={handleFirstNameChange}
                          className="form-control floating"
                        />
                      </div>
                      <div className="form-group">
                      <label>Last Name<span className="text-danger"> *</span></label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={handleLastNameChange}
                          className="form-control floating"
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
                          value={phone}
                          onChange={handlePhoneChange}
                          className="form-control floating"
                        />
                      </div>
                      <div className="form-group">
                      <label>Create Password<span className="text-danger"> *</span></label>
                        <input
                          type="password"
                          value={password}
                          onChange={handlePasswordChange}
                          className="form-control floating"
                        />
                      </div>
                      <div className="text-end">
                        <Link to="/login" className="forgot-link">
                          Already have an account?
                        </Link>
                      </div>
                       {/* Error Message */}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                      <button
                        type="submit"
                        style={{ backgroundColor: "#298080", color: "#fff"}}
                        className="btn w-100 btn-lg login-btn"
                      >
                        Signup
                      </button>
                      {/* <div className="login-or">
                        <span className="or-line"></span>
                        <span className="span-or">or</span>
                      </div> */}
                      {/* <div className="row form-row social-login">
                        <div className="col-6">
                          <Link to="#0" className="btn btn-facebook w-100">
                            <i className="fab fa-facebook-f me-1"></i> Login
                          </Link>
                        </div>
                        <div className="col-6">
                          <Link to="#0" className="btn btn-google w-100">
                            <i className="fab fa-google me-1"></i> Login
                          </Link>
                        </div>
                      </div> */}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer {...props} />
    </>
  );
};

export default DoctorRegister;
