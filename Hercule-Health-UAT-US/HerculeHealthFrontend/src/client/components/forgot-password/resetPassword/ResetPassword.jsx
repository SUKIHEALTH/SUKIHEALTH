import React, { useState, useEffect } from "react";
import { useLocation, Link, useHistory } from "react-router-dom";
import Header from "../../header.jsx";
import Footer from "../../footer";
import banner from '../../../assets/images/banner-1.png';
import axios from '../../../../axiosConfig.js'; // Assuming axios instance is correctly configured

const ResetPassword = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPasswordInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resetKey, setResetKey] = useState("");

  // Extract query parameters from URL
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    // Create a URLSearchParams object from the current URL's search parameters
    const queryParams = new URLSearchParams(location.search);

    // Get the 'password_reset_email' and 'key' from the query parameters
    const resetEmail = queryParams.get('password_reset_email');
    const resetKey = queryParams.get('key');
   
    setEmail(resetEmail);
    setResetKey(resetKey);
  }, [location.search]); // Re-run when the URL changes

  console.log('this is the passed data in url ', email, 'thisis ', resetKey);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setMessage(""); // Clear previous messages

    // Send a POST request to the backend to reset the password
    try {
      const response = await axios.post("/api/reset-password", {
        email: email,
        forget_key: resetKey,
        newPassword: password,
      });

      // Handle response from the backend
      if (response.status === 200) {
        setMessage("Password has been reset successfully.");
        setTimeout(() => {
            history.push("/login");  // This redirects to the login page after the message is displayed
          }, 2000);
      } else {
        setMessage(response.data.message || "An error occurred.");
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header {...props} />

      <div className="content top-space">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <div className="account-content">
                <div className="row align-items-center justify-content-center">
                  <div className="col-md-7 col-lg-6 login-left">
                    <img
                      src={banner} // Replace with actual image path
                      className="img-fluid"
                      alt="Login Banner"
                    />
                  </div>
                  <div className="col-md-12 col-lg-6 login-right">
                    <form onSubmit={handleSubmit}>
                      <div className="form-group form-focus">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control floating"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <label className="focus-label">New password</label>
                      </div>

                      <div className="form-group form-focus">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="form-control floating"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPasswordInput(e.target.value)}
                          required
                        />
                        <label className="focus-label">Confirm password</label>
                      </div>

                      {message && <div className="text-muted">{message}</div>}

                      <button
                        type="submit"
                        className="btn btn-primary w-100 btn-lg login-btn"
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending..." : "Reset Password"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer {...props} />
    </div>
  );
};

export default ResetPassword;
