import React from "react";
import { Link } from "react-router-dom";
import careersImg1 from "../../assets/images/doctor-banner.png"; // Replace with your own images
import careersImg2 from "../../assets/images/doctor-banner2.png";
import careersImg3 from "../../assets/images/doctor-banner.png";
import Header from "../header";
import DoctorFooter from "../common/doctorFooter";

const Careers = (props) => {
  return (
    <div>
      <Header {...props} />
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Careers</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/patient/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Careers
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div
        className="container d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "80vh", marginTop: "50px", marginBottom: "50px" }}
      >
        {/* Section 1: Image Left, Content Right */}
        <div
          className="row justify-content-center text-center w-100 mb-md-0 mb-5"
          style={{ background: "#f3f6fa", maxWidth: 1100, minHeight: 400, borderRadius: "0.5rem" }}
        >
          <div className="col-12 p-5 d-flex flex-column justify-content-center align-items-center">
            <h2 className="fw-bold mb-4" style={{ color: "#008080", fontSize: "2rem" }}>
              Careers at Hercule Health
            </h2>
            <p className="lead" style={{ color: "#444", maxWidth: 800, fontSize: "1.25rem" }}>
              Join us in building the future of proactive, personalized healthcare.
            </p>
            <p style={{ color: "#555", fontSize: "1.1rem", maxWidth: 850, marginTop: "20px" }}>
              At Hercule Health, we believe that prevention, diagnostics, and longevity are more than trends – they are the future of healthcare. Our mission is to empower individuals with insights and innovation, putting their health first. We are always looking for exceptional talent to join our growing team.
            </p>
          </div>
        </div>

        {/* Section 2: Content Left, Image Right */}
        <div
          className="row align-items-center bg-gray-100 rounded-3 w-100 flex-row-reverse"
          style={{
            minHeight: "380px",
            padding: "0",
            maxWidth: 1100,
            overflow: "hidden",
          }}
        >
          <div
            className="col-md-5 d-flex justify-content-center align-items-center"
            style={{
              background: "#f3f6fa",
              minHeight: "380px",
              padding: "20px",
            }}
          >
            <img
              src={careersImg2}
              alt="Who We're Looking For"
              style={{
                maxWidth: "95%",
                maxHeight: "260px",
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />
          </div>

          <div
            className="col-md-7 pt-5 pb-4 pl-0 pr-0 pr-lg-3 d-flex flex-column justify-content-center"
            style={{ background: "#ffffff" }}
          >
            <h5 className="fw-bold mb-4" style={{ color: "#008080", fontSize: "1.4rem" }}>
              Who We're Looking For
            </h5>
            <ul style={{ fontSize: "1.05rem", color: "#444", paddingLeft: "0", listStyle: "none" }}>
              {[
                "Medical doctors passionate about prevention and functional medicine",
                "Diagnostic specialists interested in lab interpretation and health optimization",
                "Healthcare professionals experienced in patient-centered care",
                "Licensed professionals seeking flexible, hybrid work models",
              ].map((item, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "14px",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: "#008080",
                      fontSize: "1.2rem",
                      marginRight: "10px",
                      lineHeight: "1",
                    }}
                  >
                    ●
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h5 className="fw-bold" style={{ color: "#008080", fontSize: "1.4rem" }}>
              Why Join Hercule Health?
            </h5>
            <ul style={{ fontSize: "1.05rem", color: "#444", paddingLeft: "0", listStyle: "none" }}>
              {[
                "Work remotely or in-person with a supportive, forward-thinking team",
                "Focus on meaningful, long-term patient relationships",
                "Access a secure, streamlined platform for consultations and diagnostics",
                "Be part of a movement redefining what healthcare can be",
              ].map((item, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "14px",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: "#008080",
                      fontSize: "1.2rem",
                      marginRight: "10px",
                      lineHeight: "1",
                    }}
                  >
                    ●
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <section className="py-5" style={{ background: "linear-gradient(135deg, #1b3b88, #267f7f)" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <div className="bg-white rounded-4 p-5 text-center">

            {/* Icon and Heading */}
            <div
              className="d-inline-flex justify-content-center align-items-center mb-3"
              style={{
                width: "60px",
                height: "60px",
                background: "#267f7f",
                borderRadius: "50%",
              }}
            >
              <i className="bi bi-people-fill text-white fs-3"></i>
            </div>
            <h3 className="fw-bold mb-4" style={{ color: "#1b3b88" }}>Let’s Build the Future of Health</h3>

            {/* Content */}
            <p className="mb-3" style={{ fontSize: "17px", color: "#333" }}>
              If you're ready to be part of a mission-driven team that's making longevity happen, send us your CV and a short motivation letter.
            </p>

            {/* Email Button */}
            <a
              href="mailto:herucle@suki.health?subject=Join Hercule today."
              className="btn btn-primary mb-3"
              style={{
                backgroundColor: "#1b3b88",
                borderColor: "#1b3b88",
                padding: "0.6rem 1.5rem",
                fontSize: "16px",
                borderRadius: "30px",
              }}
            >
              <i className="bi bi-envelope-fill me-2"></i> Send Application
            </a>

            {/* Additional Details */}
            <p className="mb-1" style={{ fontSize: "16px", color: "#555" }}>
              <strong>Subject line:</strong> Join Hercule today.
            </p>
            <p style={{ fontSize: "16px", color: "#555" }}>
              We review applications on a rolling basis and look forward to connecting with health professionals who want to make a real impact.
            </p>

          </div>
        </div>
      </section>

      <DoctorFooter {...props} />
    </div>

  );
};

export default Careers;