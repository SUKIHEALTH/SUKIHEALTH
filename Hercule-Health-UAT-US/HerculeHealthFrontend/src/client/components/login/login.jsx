import React, { useEffect, useState } from "react";
import loginBanner from "../../../../public/assets/images/login-banner.png";
import { Link, useHistory } from "react-router-dom";
//import Header from "../header";
import Home1Header from "../home/home-1/header";
import Footer from "../footer";
import axios from "../../../axiosConfig";
import { useAuth } from "../../../context/AuthContext"; // Import useAuth to update authentication state
import  Cookie  from "js-cookie";

const LoginContainer = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth(); // Get the login function from context
  const history = useHistory(); // For redirection after login

  useEffect(() => {
    document.body.classList.add("account-page");

    // Clean up function to remove the class when the component unmounts
    return () => document.body.classList.remove("account-page");
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password) {
      setError("Both fields are required!");
      return;
    }

    // Clear previous errors
    setError("");

    try {
      const response = await axios.post(
        `/api/login`,
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API response:", response.data); // Log the entire response to check the structure

      const data = response.data; // Assuming response contains 'message' and 'user'
      console.log(data)

      // Ensure we get the access_type value correctly and it's a number
      const access_type = Cookie.get("accessType") // Convert to a number if necessary
      const userId = Cookie.get("userId")
      console.log("Access Type:", access_type); // Check the value of access_type

      // Check if login was successful
      if (response.status === 200 || response.statusText === "OK") {
        // Mark the user as logged in
        localStorage.setItem("userData", userId)
        login();

        // Redirect based on access_type
        let redirectUrl = ""; // Variable to hold the redirect URL
        switch (Number(access_type)) {
          case 1:
            redirectUrl = "/admin";
            break;
          case 2:
            redirectUrl = "/doctor/doctor-dashboard";
            break;
          case 3:
            redirectUrl = "/patient/dashboard"; // assuming access_type 3 redirects to the patient dashboard
            break;
          default:
            setError("Invalid access type.");
            return;
        }

        // Redirect the user to the correct dashboard
        history.push(redirectUrl);

        // Use history.replace() to prevent the user from going back to the login page
        history.replace(redirectUrl);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        // Extract the message from the API response
        const apiMessage = error.response.data?.message || "Login failed due to authorization error.";
    
        // Set the error message in UI
        setError(apiMessage);
      } else {
        // Generic fallback error
        setError("An error occurred. Please try again later.");
      }
    }
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
                      alt="Hercule Health Login"
                    />
                  </div>
                  <div className="col-md-12 col-lg-6 login-right">
                    <div className="login-header">
                      <h3>
                        Login <span>Hercule Health</span>
                      </h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                      {/* Email Input */}
                      <div className="form-group form-focus">
                        <input
                          type="email"
                          className="form-control floating"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <label className="focus-label">Email</label>
                      </div>

                      {/* Password Input */}
                      <div className="form-group form-focus">
                        <input
                          type="password"
                          className="form-control floating"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <label className="focus-label">Password</label>
                      </div>

                      {/* Error Message */}
                      {error && <div className="alert alert-danger">{error}</div>}

                      <div className="text-end">
                        <Link className="forgot-link" to="/pages/forgot-password">
                          Forgot Password?
                        </Link>
                      </div>

                      <button type="submit" style={{backgroundColor: "#073b87", color: "white"}} className="btn btn-primary w-100 btn-lg login-btn">
                        Login
                      </button>

                      {/* <div className="login-or">
                        <span className="or-line" />
                        <span className="span-or">or</span>
                      </div> */}

                      {/* <div className="row form-row social-login">
                        <div className="col-6">
                          <Link to="/home-1" className="btn btn-facebook w-100">
                            <i className="fab fa-facebook-f me-1" /> Login
                          </Link>
                        </div>
                        <div className="col-6">
                          <Link to="/home-1" className="btn btn-google w-100">
                            <i className="fab fa-google me-1" /> Login
                          </Link>
                        </div>
                      </div> */}

                      <div className="text-center dont-have">
                        Don’t have an account? <Link to="/register">Register</Link>
                      </div>
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

export default LoginContainer;
