import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../header";
import DoctorFooter from "../../common/doctorFooter";
import FeatherIcon from "feather-icons-react";

const ContactUs = (props) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Your message has been submitted!");
    setFormData({ name: "", email: "", message: "" });
  };
  
  return (
    <>
      <Header {...props} />

      {/* Breadcrumb */}
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Contact Us</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/patient/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Contact Us
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}

      {/* Contact Us Section */}

      <section className="py-5" style={{ background: "#f5f8fc", borderBottom: "2px solid #1b3b88" }}>
        <div className="container">
          <div className="bg-white p-5 rounded-4" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
            <div className="row g-4">

              {/* Heading */}
              <div className="col-12">
                <h6 style={{ color: "rgb(27, 59, 136)", fontWeight: 600 }}>Get in touch</h6>
                <h2 style={{ fontWeight: 700, fontSize: "2.3rem" }}>We’d love to hear from you.</h2>
                <p style={{ fontSize: "1.05rem", color: "#444" }}>
                  Whether you have questions about our services, need support with your account, or want to explore how Hercule Health can help you take charge of your health, we’re here to help.
                </p>
              </div>

              {/* Card 1 */}
              <div className="col-lg-6">
                <div className="p-4 rounded-3 h-100" style={{ background: "#eaf1fc" }}>
                  <div className="text-center mb-3">
                    <div className="rounded-circle d-flex justify-content-center align-items-center mx-auto"
                      style={{ width: "60px", height: "60px", background: "rgb(27, 59, 136)" }}>
                      <i className="bi bi-envelope-fill text-white fs-4"></i>
                    </div>
                  </div>
                  <h5 className="fw-semibold text-center mb-3">General Inquiries</h5>
                  <p className="mb-0 text-center">Email: <a href="mailto:inquireteam@suki.health">inquireteam@suki.health</a></p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="col-lg-6">
                <div className="p-4 rounded-3 h-100" style={{ background: "#eaf1fc" }}>
                  <div className="text-center mb-3">
                    <div className="rounded-circle d-flex justify-content-center align-items-center mx-auto"
                      style={{ width: "60px", height: "60px", background: "rgb(27, 59, 136)" }}>
                      <i className="bi bi-heart-pulse-fill text-white fs-4"></i>
                    </div>
                  </div>
                  <h5 className="fw-semibold text-center mb-3">Medical Consultations</h5>
                  <p className="mb-0 text-center">For questions related to consultations, lab result submissions, or appointments with our healthcare professionals:</p>
                  <p className="mb-0 text-center">Email: <a href="mailto:team@suki.health">team@suki.health</a></p>
                  <p className="mb-0 text-center">Portal Access: <a href="#">Access the Dashboard</a></p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="col-lg-6">
                <div className="p-4 rounded-3 h-100" style={{ background: "#eaf1fc" }}>
                  <div className="text-center mb-3">
                    <div className="rounded-circle d-flex justify-content-center align-items-center mx-auto"
                      style={{ width: "60px", height: "60px", background: "rgb(27, 59, 136)" }}>
                      <i className="bi bi-people-fill text-white fs-4"></i>
                    </div>
                  </div>
                  <h5 className="fw-semibold text-center mb-3">Join the Team</h5>
                  <p className="mb-0 text-center">Interested in working with us? Visit our <a href="/pages/careers">Careers page</a> email your CV to: <a href="mailto:team@suki.health">team@suki.health</a></p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="col-lg-6">
                <div className="p-4 rounded-3 h-100" style={{ background: "#eaf1fc" }}>
                  <div className="text-center mb-3">
                    <div className="rounded-circle d-flex justify-content-center align-items-center mx-auto"
                      style={{ width: "60px", height: "60px", background: "rgb(27, 59, 136)" }}>
                      <i className="bi bi-briefcase-fill text-white fs-4"></i>
                    </div>
                  </div>
                  <h5 className="fw-semibold text-center mb-3">Press & Partnerships</h5>
                  <p className="mb-0 text-center">For media inquiries, interviews, or partnership opportunities:</p>
                  <p className="mb-0 text-center">Email: <a href="mailto:team@suki.health">team@suki.health</a></p>
                </div>
              </div>


              {/* Thank you Text */}
              <div className="col-12">
                <p className="text-center mt-4" style={{ fontSize: "1.1rem", color: "#1b3b88", fontWeight: "500" }}>
                You can also follow us on social media to stay updated with the latest from Hercule Health.
                </p>
                <p className="text-center mt-4" style={{ fontSize: "1.1rem", color: "#1b3b88", fontWeight: "500" }}>
                Thank you for connecting with us!
                </p>
              </div>

              {/* Right: Form */}
              {/* <div className="col-lg-7">
                <div className="p-4 rounded-3" style={{ background: "#f8fafd", border: "1px solid #e0eaf5" }}>
                  <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your Email"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Message</label>
                      <textarea
                        className="form-control"
                        name="message"
                        rows="6"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write your message here..."
                        required
                        style={{ height: "170px" }}
                      ></textarea>
                    </div>
                    <div className="col-12 d-flex justify-content-end">
                      <button
                        type="submit"
                        className="btn btn-primary px-4"
                        style={{ background: "rgb(27, 59, 136)", border: "none" }}
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div> */}


            </div>
          </div>
        </div>
      </section>

      {/* /Contact Us Section */}

      {/* Social Media Links */}
      {/* <section className="contact-social text-center">
        <p>You can also follow us on social media to stay updated with the latest from Hercule Health.</p>
      </section> */}

      <DoctorFooter {...props} />
    </>
  );
};

export default ContactUs;
