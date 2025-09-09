import React from "react";
import { Link } from "react-router-dom";
import DoctorFooter from "../common/doctorFooter";
import refundImg1 from "../../assets/images/doctor-banner.png"; // Use your own images
import refundImg2 from "../../assets/images/doctor-banner.png";
import refundImg3 from "../../assets/images/doctor-banner.png";

const ReturnRefundPolicy = (props) => {
  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 text-center">
              <h2 className="breadcrumb-title">Return and Refund Policy</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/patient/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                  Return and Refund Policy
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}

      <section className="py-5" style={{}}>
        <div className="container" style={{ maxWidth: "1000px" }}>

          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3" style={{ color: "#1b3b88" }}>Return & Refund Policy</h2>
            <p style={{ color: "#333", fontSize: "18px", lineHeight: "1.8" }}>
              At <strong>Hercule Health</strong>, we strive to offer clear and fair policies around cancellations and refunds. While we do not ship physical products ourselves, we do offer paid consultations and partner with laboratories who may handle physical test kits. Below is how we handle returns and refunds in both areas.
            </p>
          </div>

          {/* Consultation Refunds */}
          <div className="p-4 mb-5 rounded-4" style={{ background: "#f0f7ff" }}>
            <h4 className="fw-bold mb-4" style={{ color: "#1b3b88" }}>
              <i className="bi bi-calendar-check-fill me-2" style={{ color: "#267f7f" }}></i>
              Consultation Refunds
            </h4>
            <p style={{ fontSize: "17px", color: "#333" }}>
              You may cancel or reschedule your consultation up to 24 hours before your scheduled appointment for a full refund.
            </p>
            <ul className="list-unstyled" style={{ fontSize: "17px", color: "#333" }}>

              <li className="mb-3">
                <i className="bi bi-check-circle-fill me-2" style={{ color: "#267f7f" }}></i>
                Cancellations within 24 hours may be eligible for a partial refund or credit towards a future appointment.
              </li>
              <li className="mb-3">
                <i className="bi bi-x-circle-fill me-2" style={{ color: "#267f7f" }}></i>
                Missed appointments without notice are non-refundable.
              </li>
              <li>
                <i className="bi bi-arrow-clockwise me-2" style={{ color: "#267f7f" }}></i>
                Refunds will be issued using the original payment method and may take 5–10 business days to appear.
              </li>
            </ul>
          </div>

          {/* Lab Test Kit Returns */}
          <div className="p-4 mb-5 rounded-4" style={{ background: "#f0f7ff" }}>
            <h4 className="fw-bold mb-4" style={{ color: "#1b3b88" }}>
              <i className="bi bi-box-fill me-2" style={{ color: "#267f7f" }}></i>
              Lab Test Kit Returns
            </h4>
            <p style={{ fontSize: "17px", color: "#333" }}>
              Lab testing kits are handled directly by our partner laboratories. Hercule Health does not manage the return, exchange, or refund of physical test kits.
            </p>
            <p style={{ fontSize: "17px", color: "#333" }}>
              If you received a test kit through one of our affiliated labs:      </p>
            <ul className="list-unstyled" style={{ fontSize: "17px", color: "#333" }}>
              <li className="mb-3">
                <i className="bi bi-info-circle-fill me-2" style={{ color: "#267f7f" }}></i>
                You must refer to the lab’s specific return and refund policy.
              </li>
              <li className="mb-3">
                <i className="bi bi-exclamation-triangle-fill me-2" style={{ color: "#267f7f" }}></i>
                Any issues with the kit (missing, damaged, delayed) must be reported to the lab directly.
              </li>
              <li>
                <i className="bi bi-patch-check-fill me-2" style={{ color: "#267f7f" }}></i>
                Refund eligibility for test kits is at the discretion of the lab provider.
              </li>
            </ul>
          </div>

        </div>
      </section>

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
        <i className="bi bi-info-circle-fill text-white fs-3"></i>
      </div>
      <h3 className="fw-bold mb-4" style={{ color: "#1b3b88" }}>Payment Disputes or Concerns</h3>

      {/* Section 1 */}
      <div className="mb-4 pb-4 border-bottom">
        <p className="mb-3" style={{ fontSize: "17px", color: "#333" }}>
          If you believe you were charged in error or have concerns about a transaction, please contact our support team.
        </p>

        {/* Email Button */}
        <a
          href="mailto:team@suki.health"
          className="btn btn-primary"
          style={{
            backgroundColor: "#1b3b88",
            borderColor: "#1b3b88",
            padding: "0.5rem 1.5rem",
            fontSize: "16px",
            borderRadius: "30px",
          }}
        >
          <i className="bi bi-envelope-fill me-2"></i>Email Us
        </a>

        <p className="mt-3" style={{ fontSize: "16px", color: "#555" }}>
          We will review your case and respond within 3 business days.
        </p>
      </div>

      {/* Section 2 */}
      <div>
        <h5 className="fw-bold mb-3" style={{ color: "#267f7f" }}>Thank you for your trust in Hercule Health</h5>
        <p style={{ fontSize: "18px", color: "#333", lineHeight: "1.8" }}>
          Our team is committed to helping you navigate your care with clarity and ease.
        </p>
      </div>

    </div>
  </div>
</section>





      <DoctorFooter {...props} />
    </>
  );
};

export default ReturnRefundPolicy;