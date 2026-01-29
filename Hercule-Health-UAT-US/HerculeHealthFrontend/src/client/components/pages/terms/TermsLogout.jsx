import React from "react";
import { Link } from "react-router-dom";
import Header from "../../header";
import Footer from "../../footer";

const TermsLogout = (props) => {
  return (
    <>
      <Header {...props} />

      {/* Breadcrumb */}
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Terms &amp; Conditions</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Terms &amp; Conditions
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}
      {/* Terms */}
      <section className="terms-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="terms-content">
                <div className="terms-text">
                  <p>
                  Effective Date: 24-March-2025 

Welcome to Hercule Health. These Terms and Conditions ("Terms") govern your use of our website, services, and digital health platform. By accessing or using our services, you agree to be bound by these Terms. Please read them carefully. 
                  </p>
                  <p>
                  1. Use of Services 

Hercule Health provides a platform for patients to submit lab results, receive personalized health insights, and connect with licensed healthcare professionals. Our services are for informational and preventive health purposes only and do not replace in-person medical consultations, diagnoses, or treatments unless explicitly stated. 
                  </p>
                  <p>
                  2. Eligibility 
                  By using our services, you confirm that you are: 

At least 18 years of age or have the legal capacity to enter into binding agreements 

Providing accurate, current, and complete information 

Using the platform for lawful and appropriate purposes 
                  </p>
                </div>
                <div className="terms-text terms-list">
                  <p>
                 3. Doctor Portal and Professional Use 

Licensed healthcare providers who register on our platform agree to: 

Submit truthful and verifiable professional credentials 

Use the portal exclusively for patient consultations and professional communication 

Maintain patient confidentiality in accordance with applicable healthcare privacy laws 
                  </p>
                  <p>
                    <i className="fas fa-circle-check" /> Sed ut perspiciatis
                    unde omnis iste natus error sit voluptatem accusantium
                    doloremque laudantium,
                  </p>
                  <p>
                  4. User Responsibilities                     voluptatem quia voluptas sit aspernatur aut odit aut fugit,
                  Users of the Hercule Health platform agree not to: 

Share false, misleading, or unauthorized health data 

Impersonate another person or provide fraudulent information 

Disrupt or harm the functionality of our digital systems 
                  </p>
                  <p>
                  5. Intellectual Property 

All content, branding, and materials on this website are the property of Hercule Health unless otherwise stated. You may not reproduce, distribute, or create derivative works without our written consent. 
                  </p>
                  <p>
                  6. Disclaimers 

Our services are not a substitute for emergency medical care. Call emergency services immediately if you are experiencing a medical crisis. 

While we strive for accuracy, we do not guarantee that all information provided is error-free, complete, or current. 
                  </p>
                  <p>
                  7. Limitation of Liability 

Hercule Health shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of, or inability to use, our services. 
                  </p>
                </div>
                <div className="terms-text">
                  <p>
                  8. Termination 

We reserve the right to suspend or terminate access to our platform at our discretion, particularly if there is a breach of these Terms.
                  </p>
                  <p>
                  9. Modifications to Terms 

Hercule Health may update these Terms periodically. Continued use of our services after changes constitutes acceptance of the new Terms. 
                  </p>
                  <p>
                  10. Contact Us 

If you have any questions about these Terms, please contact us: 

Email:team@suki.health 

Phone: +31658016050 

 
Address: Oder 20 Unit A63, 2491 DC, ‘s-Gravenhage 

Shape 

Thank you for choosing Hercule Health—where your wellbeing is our mission.
                  </p>
                </div>
              </div>
              {/* <div className="terms-btn">
                <Link to="#" className="btn btn-right-now">
                  Not right now...
                </Link>
                <Link to="#" className="btn btn-primary prime-btn">
                  I agree with terms
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      </section>
      {/* /Terms */}

      <Footer {...props} />
    </>
  );
};

export default TermsLogout;
