import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DoctorFooter from "../common/doctorFooter";
import Header from "../header";
import axios from "../../../axiosConfig"; // Adjust the path based on your project structure
import { FourSquare } from "react-loading-indicators"; // Add this if you have it, or use a simple loading state

const FeesAndPayments = (props) => {
  const [adminSettings, setAdminSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState(null);

  // Fetch admin settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("/api/get-admin-settings");
        setAdminSettings(response.data.setting);
      } catch (err) {
        console.error("Error fetching admin settings:", err);
        setSettingsError("Failed to fetch pricing information");
      } finally {
        setSettingsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Calculate total amounts including tax and service charges
  const calculateTotalAmount = (baseAmount) => {
    if (!adminSettings) return baseAmount;
    
    const taxPercentage = Number(adminSettings.taxPercentage || 0);
    const serviceCharge = Number(adminSettings.serviceCharge || 0);
    
    const taxAmount = (baseAmount * taxPercentage) / 100;
    return baseAmount + taxAmount + serviceCharge;
  };

  // Get consultation fees with fallback to default values
  const getConsultationFees = () => {
    if (!adminSettings) {
      return {
        standard: 55,
        extended: 0,
        followup: 0
      };
    }
    
    return {
      standard: adminSettings.standardConsultationFee || 0,
      extended: adminSettings.extendedConsultationFee || 0,
      followup: adminSettings.followupConsultationFee || 0
    };
  };

  const consultationFees = getConsultationFees();

  return (
    <>
      <Header {...props} />
      
      {/* Breadcrumb */}
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Fees and Payments</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/patient/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Fees and Payments
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}

      {/* Loading State */}
      {settingsLoading && (
        <section className="py-5" style={{ background: "#f7fafd" }}>
          <div className="container text-center">
            <FourSquare
              color="#99afe1"
              size="medium"
              text="Loading pricing information..."
              textColor="#c91a1a"
            />
          </div>
        </section>
      )}

      {/* Error State */}
      {settingsError && (
        <section className="py-5" style={{ background: "#f7fafd" }}>
          <div className="container text-center">
            <div className="alert alert-warning" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {settingsError}. Please try again later or contact support.
            </div>
          </div>
        </section>
      )}

      {/* Main Content - Only show when not loading and no error */}
      {!settingsLoading && !settingsError && (
        <>
          {/* Fees and Payments Section */}
          <section className="py-5" style={{ background: "#f7fafd" }}>
            <div className="container">
              {/* Description */}
              <div className="mb-4 text-center" style={{ maxWidth: "850px", margin: "0 auto" }}>
                <p style={{ fontSize: "1.05rem", color: "#333" }}>
                  At <strong>Hercule Health</strong>, we believe in transparency and simplicity when it comes to pricing.
                  Our fees are based on the consultations you book with our healthcare professionals.
                  This allows you to receive expert advice, personalized interpretations of your lab results, and proactive health guidance — without hidden costs.
                </p>
              </div>

              <div className="row g-4 justify-content-center">
                {/* Consultation Fees */}
                <div className="col-md-6 col-lg-4 d-flex">
                  <div className="border rounded-4 shadow-sm bg-white p-4 text-center w-100 d-flex flex-column justify-content-between" style={{ minHeight: "450px" }}>
                    <div>
                      <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{ width: "60px", height: "60px", backgroundColor: "#008080" }}>
                        <i className="bi bi-cash-coin text-white fs-4"></i>
                      </div>
                      <h5 className="fw-semibold mb-3" style={{ color: "#008080" }}>Consultation Fees</h5>
                      <p className="text-start mb-3">
                        Our licensed doctors and specialists offer private consultations focused on longevity, prevention, and personalized care.
                      </p>
                      <ul className="list-group list-group-flush text-start mb-3">
                        <li className="list-group-item border-0 ps-0">
                          Standard Consultation 30 minutes – €{consultationFees.standard}
                          {adminSettings?.taxPercentage > 0 || adminSettings?.serviceCharge > 0 ? (
                            <small className="text-muted d-block">
                              Total: €{calculateTotalAmount(consultationFees.standard).toFixed(2)}
                              {adminSettings.taxPercentage > 0 && ` (incl. ${adminSettings.taxPercentage}% tax)`}
                              {adminSettings.serviceCharge > 0 && ` + €${adminSettings.serviceCharge} service charge`}
                            </small>
                          ) : null}
                        </li>
                        <li className="list-group-item border-0 ps-0">
                          Extended Consultation 60 minutes – €{consultationFees.extended}
                        </li>
                        <li className="list-group-item border-0 ps-0">
                          Follow-up Consultation 20 minutes – €{consultationFees.followup}
                        </li>
                      </ul>
                      <p className="text-start mb-0">These consultations can be conducted securely online or, where available, in person.</p>
                    </div>
                  </div>
                </div>

                {/* What's Included */}
                <div className="col-md-6 col-lg-4 d-flex">
                  <div className="border rounded-4 shadow-sm bg-white p-4 text-center w-100 d-flex flex-column justify-content-between" style={{ minHeight: "450px" }}>
                    <div>
                      <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{ width: "60px", height: "60px", backgroundColor: "#008080" }}>
                        <i className="bi bi-clipboard-check text-white fs-4"></i>
                      </div>
                      <h5 className="fw-semibold mb-3" style={{ color: "#008080" }}>What's Included</h5>
                      <ul className="list-group list-group-flush text-start mb-0">
                        <li className="list-group-item border-0 ps-0">● Review and interpretation of submitted lab results</li>
                        <li className="list-group-item border-0 ps-0">● Personalized preventive health recommendations</li>
                        <li className="list-group-item border-0 ps-0">● Time to discuss your symptoms, goals, and concerns</li>
                        <li className="list-group-item border-0 ps-0">● Summary report sent after the consultation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Lab Testing Fees */}
                <div className="col-md-6 col-lg-4 d-flex">
                  <div className="border rounded-4 shadow-sm bg-white p-4 text-center w-100 d-flex flex-column justify-content-between" style={{ minHeight: "450px" }}>
                    <div>
                      <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{ width: "60px", height: "60px", backgroundColor: "#008080" }}>
                        <i className="bi bi-droplet-half text-white fs-4"></i>
                      </div>
                      <h5 className="fw-semibold mb-3" style={{ color: "#008080" }}>Lab Testing Fees</h5>
                      <p className="text-start mb-3">
                        Lab testing is not included in the consultation fees. If you need additional lab tests:
                      </p>
                      <ul className="list-group list-group-flush text-start mb-3">
                        <li className="list-group-item border-0 ps-0">● You may arrange them with our partnered labs directly</li>
                        <li className="list-group-item border-0 ps-0">● Or submit your existing results from another provider for review</li>
                      </ul>
                      <p className="text-start mb-0">Our team will guide you through the process and help identify which tests are relevant based on your consultation.</p>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="col-md-6 col-lg-4 d-flex">
                  <div className="border rounded-4 shadow-sm bg-white p-4 text-center w-100 d-flex flex-column justify-content-between" style={{ minHeight: "450px" }}>
                    <div>
                      <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{ width: "60px", height: "60px", backgroundColor: "#008080" }}>
                        <i className="bi bi-credit-card text-white fs-4"></i>
                      </div>
                      <h5 className="fw-semibold mb-3" style={{ color: "#008080" }}>Payment Methods</h5>
                      <p className="text-start mt-3 mb-0">We accept the following payment methods:</p>
                      <ul className="list-group list-group-flush text-start mb-0">
                        <li className="list-group-item border-0 ps-0">● Credit & debit cards</li>
                        <li className="list-group-item border-0 ps-0">● Secure online payment via our platform</li>
                        <li className="list-group-item border-0 ps-0">● Bank transfer (for approved cases)</li>
                      </ul>
                      <p className="text-start mt-3 mb-0">All payments must be completed prior to your consultation to confirm your appointment.</p>
                    </div>
                  </div>
                </div>

                {/* Refunds and Cancellations */}
                <div className="col-md-6 col-lg-4 d-flex">
                  <div className="border rounded-4 shadow-sm bg-white p-4 text-center w-100 d-flex flex-column justify-content-between" style={{ minHeight: "450px" }}>
                    <div>
                      <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{ width: "60px", height: "60px", backgroundColor: "#008080" }}>
                        <i className="bi bi-arrow-counterclockwise text-white fs-4"></i>
                      </div>
                      <h5 className="fw-semibold mb-3" style={{ color: "#008080" }}>Refunds and Cancellations</h5>
                      <p className="text-start mb-0">
                        You may reschedule or cancel your consultation up to {adminSettings?.patientCancellationDeadline || 24} hours in advance for a full refund. 
                        Cancellations made within {adminSettings?.patientCancellationDeadline || 24} hours of the scheduled time may be subject to a partial or non-refundable fee.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Help Section */}
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
                  <i className="bi bi-info-circle text-white fs-3"></i>
                </div>
                <h3 className="fw-bold mb-4" style={{ color: "#1b3b88" }}>Need Help?</h3>

                {/* Description */}
                <p className="mb-4" style={{ fontSize: "17px", color: "#333" }}>
                  If you have questions about fees or payment options, please reach out to our team at:
                </p>

                {/* Buttons Row */}
                <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
                  {/* Email Button */}
                  <a
                    href="mailto:team@suki.health?subject=Payment or Support Inquiry"
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
                    <i className="bi bi-envelope-fill me-2"></i> Email Us
                  </a>

                  {/* Phone Button */}
                  <a
                    href="tel:+31658016050"
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
                    <i className="bi bi-telephone-fill me-2"></i> +31 658 016 050
                  </a>
                </div>

                {/* Footer Text */}
                <p style={{ fontSize: "16px", color: "#555" }}>
                  Thank you for choosing <strong>Hercule Health</strong> — where clarity and care go hand in hand.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      <DoctorFooter {...props} />
    </>
  );
};

export default FeesAndPayments;