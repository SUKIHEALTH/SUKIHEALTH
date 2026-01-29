import React from "react";
import { Link } from "react-router-dom";
import DoctorFooter from "../common/doctorFooter";
import shippingImg1 from "../../assets/images/doctor-banner.png"; // Replace with your own images
import shippingImg2 from "../../assets/images/doctor-banner.png";
import shippingImg3 from "../../assets/images/doctor-banner.png";
import Header from "../header";

const ShippingAndDelivery = (props) => {
  return (
    <>
    <Header {...props} />
      {/* Breadcrumb */}
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Shipping and Delivery</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/patient/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                  Shipping and Delivery
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}

      {/* Section 1: Image Left, Content Right */}
      <section className="py-5" style={{ background: "#f7f9fc" }}>
  <div className="container">

    {/* Page Title */}
    <div className="text-center mb-5">
      <div className="d-inline-flex align-items-center justify-content-center mb-3 rounded-circle shadow"
        style={{ width: "70px", height: "70px", backgroundColor: "#1b3b88" }}>
        <i className="bi bi-truck text-white fs-2"></i>
      </div>
      <h2 className="fw-bold" style={{ color: "#1b3b88" }}>Shipping & Delivery</h2>
    </div>

    {/* Intro Text */}
    <div className="p-4 rounded-4 shadow-sm text-center mb-5" style={{ background: "#e7ecf8" }}>
      <p className="lead mb-0" style={{ color: "#333", maxWidth: "800px", margin: "0 auto" }}>
        At Hercule Health, we do not ship any physical products or medical kits directly to clients.
        However, in certain cases, lab testing materials may be shipped to clients by our trusted partner laboratories.
      </p>
    </div>

    {/* Info Cards */}
    <div className="row g-4">
      
      {/* Lab Testing Shipments */}
      <div className="col-md-6">
        <div className="p-4 h-100 rounded-4 shadow-sm" style={{ background: "#f0f4fb" }}>
          <div className="d-flex align-items-center mb-3">
            <i className="bi bi-clipboard-check fs-3 me-3" style={{ color: "#1b3b88" }}></i>
            <h4 className="fw-semibold mb-0" style={{ color: "#1b3b88" }}>Lab Testing Shipments</h4>
          </div>
          <p>If your healthcare provider recommends a lab test that requires a home sample kit, the shipment and handling of that kit will be managed by one of our affiliated laboratories.</p>
          <ul className="list-unstyled mb-0">
            <li className="mb-2">
              <i className="bi bi-chevron-right me-2" style={{ color: "#1b3b88" }}></i>
              You will receive the test kit directly from the partner lab
            </li>
            <li className="mb-2">
              <i className="bi bi-chevron-right me-2" style={{ color: "#1b3b88" }}></i>
              Shipping times, return instructions, and support will be outlined by the lab
            </li>
            <li>
              <i className="bi bi-chevron-right me-2" style={{ color: "#1b3b88" }}></i>
              Any delays, replacements, or follow-ups must be coordinated with the lab according to their policy
            </li>
          </ul>
        </div>
      </div>

      {/* Responsibility and Tracking */}
      <div className="col-md-6">
        <div className="p-4 h-100 rounded-4 shadow-sm" style={{ background: "#f7f9fc" }}>
          <div className="d-flex align-items-center mb-3">
            <i className="bi bi-shield-check fs-3 me-3" style={{ color: "#1b3b88" }}></i>
            <h4 className="fw-semibold mb-0" style={{ color: "#1b3b88" }}>Responsibility & Tracking</h4>
          </div>
          <p>Hercule Health is not responsible for:</p>
          <ul className="list-unstyled mb-0">
            <li className="mb-2">
              <i className="bi bi-chevron-right me-2" style={{ color: "#1b3b88" }}></i>
              Shipping times, lost kits, or delivery issues handled by third-party laboratories
            </li>
            <li className="mb-2">
              <i className="bi bi-chevron-right me-2" style={{ color: "#1b3b88" }}></i>
              Return shipping or customs delays related to international lab test kits
            </li>
            <li>
              <i className="bi bi-chevron-right me-2" style={{ color: "#1b3b88" }}></i>
              Please refer to the individual partner laboratory’s site for delivery inquiries
            </li>
          </ul>
        </div>
      </div>

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
        <i className="bi bi-question-circle-fill text-white fs-3"></i>
      </div>
      <h3 className="fw-bold mb-3" style={{ color: "#1b3b88" }}>Questions?</h3>

      {/* Description */}
      <p className="mb-4" style={{ fontSize: "17px", color: "#333" }}>
        If you are unsure about the status of a shipment or need help contacting the lab, feel free to reach out to us:
      </p>

      {/* Email Button */}
      <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
        <a
          href="mailto:team@suki.health?subject=Shipment or Lab Assistance"
          className="btn"
          style={{
            backgroundColor: "#1b3b88",
            borderColor: "#1b3b88",
            color: "#fff",
            padding: "0.65rem 1.5rem",
            fontSize: "16px",
            borderRadius: "30px",
          }}
        >
          <i className="bi bi-envelope-fill me-2"></i> Email Support
        </a>
      </div>
      <p className="mb-4" style={{ fontSize: "17px", color: "#333" }}>
        We’re happy to help connect you with the right contact.
      </p>
      {/* Divider */}
      <hr style={{ borderTop: "1px dashed #ccc", width: "60%", margin: "2rem auto" }} />

      {/* Footer Text */}
      <p className="fs-5 fw-semibold" style={{ color: "#555" }}>
        Thank you for choosing Hercule Health.
      </p>

    </div>
  </div>
</section>



      {/* /Shipping and Delivery Section */}

      <DoctorFooter {...props} />
    </>
  );
};

export default ShippingAndDelivery;