import React from 'react'
import { app_icon_store, google_icon_play, logo, molie_icon, payment_icon_01, payment_icon_02, payment_icon_03, payment_icon_04 } from '../../imagepath'
import { Link } from 'react-router-dom'

const DoctorFooter = () => {
    return (
        <>
            {/* Footer Section */}
            <div className="footer pharmacy-footer">
                <div className="container">
                    <div className="top-footer">
                        <div className="footer-logo">
                            <Link to="/home-1">
                                <img src={logo} alt="logo" />
                            </Link>
                        </div>
                        <div className="Hercule Health-info">
                            <p>
                            Wellness begins with awareness. View your lab results with clarity, and choose personalized care when it feels right. We help you visualise your labs and explore the path to longevity and balance. 
                            </p>
                        </div>
                    </div>
                    <div className="mid-footer">
                        <div className="row d-flex align-items-center justify-content-center" >
                            <div className="col-xl-3 col-lg-3 col-md-4">
                                <div className="footer-links">
                                    <h4>Company</h4>
                                    <ul className="pages-links">
                                        <li>
                                            <Link to="/pages/about-us">About HerculeHealth</Link>
                                        </li>
                                        <li>
                                            <Link to="/pages/customer-speaks">Customers Speak</Link>
                                        </li>
                                        <li>
                                            <Link to="/pages/in-the-news">In the News</Link>
                                        </li>
                                        <li>
                                            <Link to="/pages/careers">Career</Link>
                                        </li>
                                        <li>
                                            <Link to="/pages/contact-us">Contact</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-3 col-md-4">
                                {/* <div className="footer-links">
                                    <h4>Shopping</h4>
                                    <ul className="pages-links">
                                        <li>
                                            <Link to="#">Browse by A-Z</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Browse by Manufacturers</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Health Articles</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Offers / Coupons</Link>
                                        </li>
                                        <li>
                                            <Link to="/pages/faq">FAQs</Link>
                                            <Link to="#">FAQs</Link>
                                        </li>
                                    </ul>
                                </div> */}
                            </div>
                            <div className="col-xl-3 col-lg-3 col-md-4">
                                <div className="footer-links">
                                    <h4>Our Policies</h4>
                                    <ul className="pages-links">
                                        <li>
                                            {/* <Link to="/pages/terms">Terms and Conditions</Link> */}
                                            <Link to="/pages/terms-and-conditions">Terms and Conditions</Link>
                                        </li>
                                        <li>
                                            {/* <Link to="/pages/privacy-policy">Privacy Policy</Link> */}
                                            <Link to="/pages/privacy-policy">Privacy Policy</Link>
                                        </li>
                                        <li>
                                            <Link to="/pages/fees-and-payments">Fees and Payments</Link>
                                        </li>
                                        <li>
                                            <Link to="/pages/shipping-delivery">Shipping and Delivery</Link>
                                        </li>
                                        <li>
                                            <Link to="/pages/return-refund">Return, Refund </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/* <div className="col-xl-3 col-lg-3 col-md-4">
                                <div className="footer-links">
                                    <h4>Our Services</h4>
                                    <ul className="pages-links">
                                        <li>
                                            <Link to="#">Order Medicines</Link>
                                        </li>
                                        
                                        <li>
                                            <Link to="#">Consult a Doctor</Link>
                                        </li>
                                        
                                    </ul>
                                </div>
                            </div> */}
                            {/* <div className="col-xl-4 col-lg-6 col-md-8">
                                <div className="footer-links">
                                    <h4>Subscribe to Newsletter</h4>
                                    <form action="#">
                                        <div className="input-block">
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Enter Email Address"
                                            />
                                            <Link to="submit" className="submit-btn">
                                                Submit
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            </div> */}
                        </div>
                    </div>
                    {/* <div className="mid-foot-two">
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <ul className="payment-methods d-flex align-items-center">
                                    <li>
                                        <Link to="#">
                                            <img src={payment_icon_01} alt="Img" />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#">
                                            <img src={payment_icon_02} alt="Img" />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#">
                                            <img src={payment_icon_03} alt="Img" />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#">
                                            <img src={payment_icon_04} alt="Img" />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-md-6">
                                <ul className="social-icons d-flex align-items-center">
                                    <li>
                                        <Link to="#">
                                            <i className="fa-brands fa-facebook-f" />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#">
                                            <i className="fa-brands fa-twitter" />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#">
                                            <i className="fa-brands fa-linkedin-in" />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#">
                                            <i className="fa-brands fa-instagram" />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#">
                                            <i className="fa-brands fa-dribbble" />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div> */}
                    <div className="mid-foot-two pb-0">
                        <div className="row align-items-center">
                            <div className="col-12 align-items-center">
                            <ul className="col-12 payment-methods d-flex align-items-center justify-content-center">
                                <li>
                                <Link to="#">
                                    {/* Mobile size */}
                                    <img src={molie_icon} alt="Payment Method" className="img-fluid d-block d-md-none" style={{ width: "80px" }} />

                                    {/* Tablet size */}
                                    <img src={molie_icon} alt="Payment Method" className="img-fluid d-none d-md-block d-lg-none" style={{ width: "60px" }} />

                                    {/* Desktop size */}
                                    <img src={molie_icon} alt="Payment Method" className="img-fluid d-none d-lg-block" style={{ width: "80px" }} />
                                </Link>
                                </li>
                            </ul>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="footer-bottom">
                    <div className="copy-right text-center">
                        <p>Copyright © 2025 HerculeHealth. All Rights Reserved</p>
                    </div>
                </div>
            </div>
            {/* /Footer Section */}
        </>

    )
}

export default DoctorFooter
