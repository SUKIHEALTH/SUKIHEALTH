import React, { useState, useEffect } from "react";
import "../../src/client/assets/css/verifyEmail.css";
import { useHistory } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa"; // Add this for the success icon
import baseUrl from "../config/config";
 
const EmailVerification = () => {
  const [email, setEmail] = useState("");
  const [verificationKey, setVerificationKey] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
 
  const history = useHistory();
 
  // Extract query parameters from the URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const username = searchParams.get("username");
    const key = searchParams.get("key");
 
    if (username && key) {
      setEmail(username);
      setVerificationKey(key);
    } else {
      setStatusMessage("Invalid verification link. Please check your email.");
    }
  }, []);
 
  // Handle verification on button click
  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/email-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, verification_key: verificationKey }),
      });
 
      const data = await response.json();
 
      if (response.ok) {
        setIsVerified(data.is_verified);
        setStatusMessage("Email verification successful!");
 
        if (data.is_verified) {
          setTimeout(() => {
            history.push("/login");
          }, 3000);
        }
      } else if (response.status === 404) {
        setStatusMessage("User not found. Please check your email address.");
      } else if (response.status === 400) {
        setStatusMessage("Invalid verification key. Please try again.");
      } else {
        setStatusMessage(data.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatusMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <div className="email-verification-container">
      <h1>Email Verification</h1>
      {isVerified && (
        <div className="success-icon">
          <FaCheckCircle size={48} color="green" />
        </div>
      )}
      {statusMessage && <p className="status-message">{statusMessage}</p>}
      {!isVerified && (
        <button
          onClick={handleVerify}
          disabled={!email || !verificationKey || isLoading}
          className="btn btn-primary"
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </button>
      )}
    </div>
  );
};
 
export default EmailVerification;