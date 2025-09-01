import React, { useState, useEffect } from "react";
import loginBanner from "../../assets/images/login-banner.png";
import { Link, useHistory } from "react-router-dom";
import Home1Header from "../home/home-1/header";
import Footer from "../footer";
import axios from '../../../axiosConfig';
import banner from '../../../client/assets/images/feedback-six.png';

const ForgotPassword = (props) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear message when user starts typing
    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setMessageType("");
    console.log('this is mail', email);

    try {
      const response = await axios.post('/api/forget-password', { email });

      if (response.status === 200) {
        setMessage("Password reset email sent successfully! Check your inbox.");
        setMessageType("success");
        
        // Redirect to login page after showing the message
        setTimeout(() => {
          history.push("/login");
        }, 3000); // Increased to 3 seconds for better UX
      } else {
        setMessage(response.data.message || "Something went wrong. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      // Handle HTTP error responses (like 404, 400, etc.)
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else if (error.response) {
        setMessage("Something went wrong. Please try again.");
      } else {
        setMessage("Error connecting to the server. Please try again.");
      }
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.body.classList.add("account-page");

    return () => document.body.classList.remove("account-page");
  }, []);

  return (
    <>
      <Home1Header />
      <>
        <div className="content top-space">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-8 offset-md-2">
                <div className="account-content">
                  <div className="row align-items-center justify-content-center">
                    <div className="col-md-7 col-lg-6 login-left">
                      <img
                        src={banner}
                        className="img-fluid"
                        alt="Login Banner"
                      />
                    </div>
                    <div className="col-md-12 col-lg-6 login-right">
                      <div className="login-header">
                        <h3>Forgot Password?</h3>
                        <p className="small text-muted">
                          Enter your email address and we'll send you a link to reset your password
                        </p>
                      </div>
                      
                      <form onSubmit={handleSubmit}>
                        <div className="form-group form-focus">
                          <label>Email Address</label>
                          <input
                            type="email"
                            className="form-control floating"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter your email address"
                            required
                            disabled={isLoading}
                          />
                        </div>

                        {/* Enhanced Message Display */}
                        {message && (
                          <div 
                            className={`alert ${
                              messageType === "success" 
                                ? "alert-success" 
                                : "alert-danger"
                            } d-flex align-items-center`}
                            role="alert"
                            style={{
                              padding: "12px 16px",
                              marginTop: "40px",
                              borderRadius: "8px",
                              fontSize: "14px",
                              border: messageType === "success" 
                                ? "1px solid #d4edda" 
                                : "1px solid #f5c6cb"
                            }}
                          >
                            <i 
                              className={`fas ${
                                messageType === "success" 
                                  ? "fa-check-circle" 
                                  : "fa-exclamation-triangle"
                              } me-2`}
                              style={{ fontSize: "16px", paddingTop: "10px" }}
                            ></i>
                            <span>{message}</span>
                          </div>
                        )}

                        <div className="text-end mb-3">
                          <Link 
                            className="forgot-link" 
                            to="/login"
                            style={{ 
                              color: "#298080",
                              textDecoration: "none",
                              fontSize: "14px"
                            }}
                          >
                            <i className="fas fa-arrow-left me-1"></i>
                            Back to Login
                          </Link>
                        </div>

                        <button
                          type="submit"
                          className="btn btn-primary w-100 btn-lg login-btn"
                          disabled={isLoading || !email.trim()}
                          style={{ 
                            backgroundColor: isLoading ? "#6c757d" : "#298080", 
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "12px",
                            fontSize: "16px",
                            fontWeight: "500",
                            transition: "all 0.3s ease"
                          }}
                        >
                          {isLoading ? (
                            <>
                              <span 
                                className="spinner-border spinner-border-sm me-2" 
                                role="status" 
                                aria-hidden="true"
                              ></span>
                              Sending Reset Link...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-paper-plane me-2"></i>
                              Send Reset Link
                            </>
                          )}
                        </button>

                        {/* Additional Help Section */}
                        <div className="text-center mt-4">
                          <p className="small text-muted">
                            Need help? <Link to="/contact" style={{ color: "#298080" }}>Contact Support</Link>
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div 
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              zIndex: 9999,
              pointerEvents: "none"
            }}
          />
        )}
      </>
      <Footer {...props} />
    </>
  );
};

export default ForgotPassword;