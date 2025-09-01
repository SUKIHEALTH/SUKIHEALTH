import React from "react";
import { Link } from "react-router-dom";
import Header from "../header";
import DoctorFooter from "../common/doctorFooter";
import aboutImg1 from "../../assets/images/doctor-banner.png"; // Replace with your own images
import aboutImg2 from "../../assets/images/aboutImg2.png";
import aboutImg3 from "../../assets/images/aboutImg2.png";

const AboutUs = (props) => {
  return (
    <div>
      <Header {...props} />
      {/* Breadcrumb */}
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">About Us</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/patient/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    About Us
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}

      {/* Hero Section */}
      <div className="container my-5">
        <div className="row d-flex align-items-center bg-white p-4 mb-5">
          {/* <div className="col-md-6 mb-4 mb-md-0 d-flex justify-content-center align-items-center">
            <img
              src={aboutImg1}
              alt="About Hercule Health"
              style={{
                maxWidth: "90%",
                maxHeight: "320px",
                borderRadius: "16px",
                objectFit: "cover",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              }}
            />
          </div> */}
          <div className="col-md-6 w-100 text-center text-md-center">
            <h1 className="display-6 fw-bold mb-3" style={{ color: "#008080" }}>
              Welcome to Hercule Health
            </h1>
            <p className="lead mb-3">
              Your trusted partner in personalized longevity and proactive healthcare.
            </p>
            <p>
              We’re here to support individuals in living longer, healthier, and more vital lives. Through proactive diagnostics, integrative medical insights, and human-centered care, we help you take control of your health today — for a better tomorrow.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="container my-5">
          <div className="about-section bg-white rounded-lg p-0 p-lg-4">
            {/* Top: Mission */}
            <div className="row align-items-center mb-5">
              <div className="col-md-6 d-flex justify-content-center align-items-center mb-4 mb-md-0">
                <img
                  src={aboutImg2}
                  alt="Our Mission"
                  style={{
                    maxWidth: "90%",
                    maxHeight: "260px",
                    borderRadius: "16px",
                    objectFit: "cover",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  }}
                />
              </div>
              <div className="col-md-6">
                <h2 className="fw-bold mb-3" style={{ color: "#008080" }}>Our Mission</h2>
                <p className="mb-2">To make longevity happen.</p>
                <ul className="list-unstyled mb-2" style={{ fontSize: "1.08rem" }}>
                  <li>• Provide a secure platform for submitting and interpreting lab results.</li>
                  <li>• Connect patients with qualified doctors specializing in prevention and personalized care.</li>
                  <li>• Translate complex diagnostics into clear, actionable insights.</li>
                  <li>• Empower clients to understand their bodies and make informed decisions.</li>
                  <li>• Support healthcare professionals with a secure portal to consult and share expertise.</li>
                </ul>
              </div>
            </div>
            {/* Bottom: Who We Serve & Vision */}
            <div className="row g-4">
              {/* Who We Serve Box */}
              <div className="col-md-6">
                <div
                  className="rounded-lg shadow-lg p-4 h-100"
                  style={{
                    background: "#E2E8F0", // light blue
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                    borderRadius: "8px"
                  }}
                >
                  <h4 className="fw-bold mb-2" style={{ color: "#008080" }}>Who We Serve</h4>
                  <ul className="list-unstyled mb-2" style={{ fontSize: "1.08rem" }}>
                    <li>• Clients who want to be proactive about their health and avoid chronic conditions.</li>
                    <li>• Doctors who believe in personalized, preventive medicine and want to deliver meaningful, data-driven care.</li>
                  </ul>
                </div>
              </div>
              {/* Our Vision Box */}
              <div className="col-md-6 rounded-lg">
                <div
                  className="rounded-lg shadow-lg p-4 h-100"
                  style={{
                    background: "#E2E8F0", // light blue
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                    borderRadius: "8px"
                  }}
                >
                  <h4 className="fw-bold mb-2" style={{ color: "#008080" }}>Our Vision</h4>
                  <p>
                    A world where understanding your health is simple, and taking action is seamless. Where lab results don’t sit in inboxes, but start important conversations. Where prevention is powerful and aging well is possible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Closing */}
        <div className="text-center mt-5 pt-2">
          <p className="text-lg font-medium">
            Thank you for being part of the <strong>Hercule Health</strong> journey.
          </p>
          <p className="mt-4 font-semibold" style={{ color: "#008080" }}>
            We don’t just watch health trends — we help take the lead.
          </p>
        </div>
      </div>
      <DoctorFooter {...props} />
    </div>
  );
};

export default AboutUs;