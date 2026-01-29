import React from "react";
import { Link } from "react-router-dom";
import customerImg from "../../assets/images/doctor-banner.png"; // Use your own image path
import Header from "../header";
import DoctorFooter from "../common/doctorFooter";

const CustomerSpeaks = (props) => {
  return (
    <div>
      <Header {...props} />
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Customer Speaks</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/patient/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                  Customer Speaks
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh", marginTop: "50px", marginBottom: "50px" }}
      >
        <div
          className="row w-100 rounded-4"
          style={{
            padding: "50px 30px",
            maxWidth: 900,
            textAlign: "center",
            backgroundColor: "rgb(241, 245, 255)", // light complementary background
            border: "2px solid rgb(27, 59, 136)",
            borderRadius: "20px",
          }}
        >
          <div className="col-12">
            <div className="mb-4">
              <p
                className="lead mb-3"
                style={{
                  color: "rgb(27, 59, 136)",
                  fontSize: "1.85rem",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                }}
              >
                Where the voices of our clients lead the way.
              </p>
            </div>

            <div>
              <p
                className="mb-3"
                style={{
                  fontSize: "1.15rem",
                  color: "#333",
                  lineHeight: "1.75",
                }}
              >
                At Hercule Health, our mission is to empower individuals through clarity, care, and connection.
                There’s no better way to share our impact than through the experiences of the people we serve.
              </p>
              <p
                className="mb-3"
                style={{
                  fontSize: "1.15rem",
                  color: "#333",
                  lineHeight: "1.75",
                }}
              >
                Here you’ll soon find real stories, honest reviews, and inspiring feedback from clients who’ve taken charge of
                their health with the help of our platform and professionals.
              </p>
              <p
                className="fw-semibold"
                style={{
                  color: "rgb(27, 59, 136)",
                  fontSize: "1.25rem",
                  marginTop: "20px",
                }}
              >
                Stay tuned. The stories coming your way are powerful, personal — and just the beginning.
              </p>
            </div>

            <div className="mt-5">
              <p
                className="mb-2"
                style={{
                  fontSize: "1.1rem",
                  color: "#444",
                }}
              >
                Want to share your experience? We’d love to hear it.
              </p>
              <button
                className="btn mt-2"
                style={{
                  backgroundColor: "rgb(27, 59, 136)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 20px",
                  fontSize: "1rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "background-color 0.3s ease",
                }}
                onClick={() => window.location.href = "mailto:team@suki.health"}
                onMouseOver={(e) => (e.target.style.backgroundColor = "rgb(20, 45, 105)")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "rgb(27, 59, 136)")}
              >
                <i className="bi bi-envelope-fill" style={{ fontSize: "1.15rem" }}></i>
                Email Us
              </button>
            </div>
          </div>
        </div>
      </div>


      <DoctorFooter {...props} />
    </div>

  );
};

export default CustomerSpeaks;