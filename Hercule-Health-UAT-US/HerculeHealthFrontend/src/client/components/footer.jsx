/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import logo from "../assets/images/logo.png";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";

const Footer = (props) => {
  //Aos

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
    });
  }, []);

  const exclusionArray = [
    "/pages/doctor-grid",
    "/pages/doctor-list",
    "/pages/video-call",
    "/pages/voice-call",
    "/pages/chat-doctor",
    "/patient/doctor-list",
    "/patient/doctor-grid",
  ];
  if (exclusionArray.indexOf(props.location.pathname) >= 0) {
    return "";
  }

  return (
    <>
      {!props.location.pathname.includes("/index-6") &&
        !props.location.pathname.includes("/index-7") &&
        !props.location.pathname.includes("/index-8") &&
        !props.location.pathname.includes("/index-6") &&
        !props.location.pathname.includes("/index-7") &&
        !props.location.pathname.includes("/index-8") && (
          <footer className="footer footer-one">
          <div className="footer-top">
            <div className="container">
              <div className="row gy-4">
                {/* About Section */}
                <div className="col-lg-5 col-md-6">
                  <div className="footer-widget footer-about">
                    <div className="footer-logo w-50 mb-3">
                      <img src={logo} alt="logo" className="img-fluid" />
                    </div>
                    <div className="footer-about-content">
                      <p>
                        Blending diagnostics, wellness and digital health solutions for optimal longevity.
                      </p>
                    </div>
                  </div>
                </div>
        
                {/* For Patients */}
                <div className="col-lg-2 col-md-6">
                  <div className="footer-widget footer-menu">
                    <h2 className="footer-title">For Patients</h2>
                    <ul>
                      {/* <li>
                        <Link to="/patient/search-doctor2">Search for Doctors</Link>
                      </li> */}
                      <li>
                        <Link to="/login">Login</Link>
                      </li>
                      <li>
                        <Link to="/register">Register</Link>
                      </li>
                    </ul>
                  </div>
                </div>
        
                {/* For Doctors */}
                <div className="col-lg-2 col-md-6">
                  <div className="footer-widget footer-menu">
                    <h2 className="footer-title">For Doctors</h2>
                    <ul>
                      {/* <li>
                        <Link to="#">Appointments</Link>
                      </li> */}
                      <li>
                        <Link to="/doctor/doctor-register">Register</Link>
                      </li>
                      <li>
                        <Link to="/login">Login</Link>
                      </li>
                    </ul>
                  </div>
                </div>
        
                {/* Contact Section */}
                <div className="col-lg-3 col-md-6">
                  <div className="footer-widget footer-contact">
                    <h2 className="footer-title">Contact Us</h2>
                    <div className="footer-contact-info">
                      <div className="footer-address">
                        <p>
                          <i><FeatherIcon icon="map-pin" size={16} /></i> Oder 20 Unit A63, 2491 DC, ‘s-Gravenhage
                        </p>
                      </div>
                      <div className="footer-address">
                        <p>
                          <i><FeatherIcon icon="phone-call" size={16} /></i> +31658016050
                        </p>
                      </div>
                      <div className="footer-address mb-0">
                        <p>
                          <i><FeatherIcon icon="mail" size={16} /></i> team@suki.health
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
        
                {/* Social Icons (Commented Out) */}
                {/*
                <div className="col-lg-3 col-md-6">
                  <div className="footer-widget">
                    <div className="social-icon">
                      <ul>
                        <li>
                          <Link to="#" target="_blank"><i className="fab fa-facebook"></i></Link>
                        </li>
                        <li>
                          <Link to="#" target="_blank"><i className="fab fa-instagram"></i></Link>
                        </li>
                        <li>
                          <Link to="#" target="_blank"><i className="fab fa-twitter"></i></Link>
                        </li>
                        <li>
                          <Link to="#" target="_blank"><i className="fab fa-linkedin-in"></i></Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                */}
              </div>
            </div>
          </div>
        
          <div className="footer-bottom py-3">
            <div className="container">
              <div className="row text-center text-md-start align-items-center">
                <div className="col-md-6 mb-2 mb-md-0">
                  <p className="mb-0">
                    &copy; 2025 <Link to="#">HerculeHealth</Link> All Rights Reserved.
                  </p>
                </div>
                <div className="col-md-6">
                  <ul className="policy-menu d-flex justify-content-center justify-content-md-end gap-3 mb-0 p-0">
                    <li><Link to="/pages/policy">Privacy Policy</Link></li>
                    <li><Link to="/pages/terms">Terms and Conditions</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>
        
        )}
    </>
  );
};

export default Footer;
