import React from "react";
import Header from "../../header";
import Footer from "../../footer";
import { Link } from "react-router-dom";
import DoctorFooter from "../../common/doctorFooter";

const Policy = (props) => {
  return (
    <>
      <Header {...props} />
      <>
        {/* Breadcrumb */}
        <div className="breadcrumb-bar-two">
          <div className="container">
            <div className="row align-items-center inner-banner">
              <div className="col-md-12 col-12 text-center">
                <h2 className="breadcrumb-title">Privacy Policy</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/patient/dashboard">Home</Link>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      Privacy Policy: Effective Date: 24 March 2025
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
        {/* /Breadcrumb */}
        {/* Privacy Policy */}
        <section className="terms-section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="terms-content pb-0">
                  <div className="terms-text">
                    <p>
                      At Hercule Health, we are committed to protecting your privacy and ensuring that your personal health information is handled with care, confidentiality, and compliance with applicable laws and regulations.
                    </p>
                    <p>
                      1. Information We Collect

                      We collect and store the following types of personal and health information:

                      Contact information (e.g., name, email address, phone number)

                      Submitted lab results and diagnostic reports

                      Health-related data provided through consultations, forms, or our digital platform

                      Professional information for doctors (e.g., name, credentials, practice information, contact details)

                      Doctors are required to create an account in order to access our secure portal, where they may interact with patients and provide feedback on submitted lab results.
                    </p>
                    <p>
                      2. How We Use Your Information

                      We use your information to:

                      Review and interpret submitted lab results

                      Provide patients with clear, personalized health feedback

                      Support proactive and preventive health strategies

                      Facilitate communication between patients and healthcare professionals

                      Improve our services and digital health platform
                    </p>
                    <p>
                      3. Sharing of Information

                      We do not sell or share your personal information with third parties for marketing purposes. We may share your data only in the following situations:

                      With your explicit consent

                      With authorized healthcare professionals involved in your care

                      When legally required to do so (e.g., in response to a court order)
                    </p>
                    <p>
                      4. Data Security

                      We take data security seriously. Hercule Health implements strong administrative, technical, and physical safeguards to:

                      Protect your personal and health data from unauthorized access, alteration, or disclosure

                      Secure doctor and patient portals through encrypted connections

                      Monitor access and maintain logs for accountability

                      All user and doctor information is stored in secure, encrypted systems compliant with industry standards.
                    </p>
                    <p>
                      5. Your Rights

                      You have the right to:

                      Access and review your stored health information

                      Request corrections to your data

                      Withdraw consent at any time

                      Ask for your data to be deleted, subject to legal limitations
                    </p>
                    <p>
                      6. Submitting Lab Results

                      Clients may submit lab results via our secure portal. We process these results and return them with personalized insights that are easy to understand. Our goal is to make complex diagnostics accessible and actionable so you can take control of your health.
                    </p>
                    <p>
                      7. Doctor Accounts and Access

                      Healthcare professionals who join Hercule Health are required to register an account and verify their credentials. These accounts allow access to our portal for the purpose of consulting with patients about their lab results. All access and communication through the portal are securely logged and monitored for quality assurance and privacy.
                    </p>
                    <p>
                      8. Updates to This Policy

                      We may update this Privacy Policy from time to time. We will notify you of any significant changes and post the revised policy on our website.
                    </p>
                    <p>
                      9. Contact Us

                      If you have any questions or concerns regarding this policy or how we handle your information, please contact us at:

                      Email:team@suki.health

                      Phone: +31658016050


                      Address: Oder 20 Unit A63, 2491 DC, ‘s-Gravenhage
                    </p>
                    <p>Thank you for trusting Hercule Health with your health and well-being.</p>

                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /Privacy Policy */}
      </>

      <DoctorFooter {...props} />
    </>
  );
};

export default Policy;
