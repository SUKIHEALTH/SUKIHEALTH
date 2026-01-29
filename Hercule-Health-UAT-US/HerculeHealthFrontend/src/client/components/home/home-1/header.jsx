import React, { useState } from "react";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath";
import logo  from '../../../../client/assets/images/HerculeHealth.png'
import { Link, useHistory  } from "react-router-dom";

const Home1Header = () => {
  const [searchField, setSearchField] = useState(false);

  const toggleSearch = () => {
    setSearchField(!searchField);
  };
  const history = useHistory();

  const directionPath = () => {
    history.push('/patient/search-doctor1')
  }


  return (
    <>
      <header className="header header-custom header-fixed header-one home-head-one">
        <div className="container d-lg-block d-none p-0">
          <nav className="navbar navbar-expand-lg header-nav">
            <div className="navbar-header">
              <Link id="mobile_btn" to="#">
                <span className="bar-icon">
                  <span />
                  <span />
                  <span />
                </span>
              </Link>
              <Link to="/" className="navbar-brand ">
                <img
                  src= {logo}
                  style={{height:'70px',width:"100%"}}
                  className="img-fluid"
                  alt="Logo4"
                />
              </Link>
            </div>
            <ul className="nav header-navbar-rht">
              <li className="register-btn">
                <Link to="/register" className="btn reg-btn" 
                style={{minWidth: "147px", minHeight: "47px",
                  backgroundColor: "#298080",
                  color: "#fff",
                }}>
                  <i className="feather icon-user" />
                  Register
                </Link>
              </li>
              <li className="register-btn">
                <Link to="/login" className="btn"
                style={{minWidth: "147px", minHeight: "47px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#1B3B88",
                  color: "#fff",
                }}>
                  <i className="feather icon-lock" />
                  Login
                </Link>
              </li>
            </ul>
          </nav>

          
        </div>

        {/* Mobile-only header */}
        <div className="w-100 d-lg-none p-0 m-0">
          <nav className="navbar navbar-light bg-white px-3 py-2 border-bottom">
            {/* Mobile Logo */}
            <Link to="/" className="navbar-brand">
              <img
                src={logo}
                alt="Logo"
                style={{ height: "60px", width: "auto" }}
                className="img-fluid"
              />
            </Link>

            {/* Hamburger */}
            <button
              className="navbar-toggler border-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mobileMenu"
              aria-controls="mobileMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
              style={{
                backgroundColor: "#fff",}}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </nav>

          {/* Mobile Dropdown Menu */}
          <div className="collapse bg-white border-bottom shadow-sm" id="mobileMenu">
            <div className="p-3">
              <Link
                to="/register"
                className="btn w-100 mb-2"
                style={{
                  backgroundColor: "#298080",
                  color: "#fff",
                  minHeight: "47px",
                }}
              >
                <i className="feather icon-user me-1" />
                Register
              </Link>
              <Link
                to="/login"
                className="btn w-100"
                style={{
                  backgroundColor: "#1B3B88",
                  color: "#fff",
                  minHeight: "47px",
                }}
              >
                <i className="feather icon-lock me-1" />
                Login
              </Link>
            </div>
          </div>
        </div>

      </header>

    </>
  );
};

export default Home1Header;
