import React from "react";
import { Link } from "react-router-dom";
import newsImg from "../../assets/images/doctor-banner.png"; // Use your own image path
import Header from "../header";
import DoctorFooter from "../common/doctorFooter";

const InTheNews = (props) => {
  return (
    <div>
      <Header {...props} />
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">News</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/patient/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    News
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh", marginTop: "50px", marginBottom: "50px" }}
      >
        <div
          className="w-100"
          style={{
            maxWidth: "900px",
            borderLeft: "6px solid rgb(27, 59, 136)",
            background: "#fdfdfd",
            borderRadius: "14px",
            padding: "50px 40px",
            textAlign: "left",
          }}
        >
          <h3
            className="d-flex align-items-center gap-2"
            style={{
              color: "rgb(27, 59, 136)",
              fontWeight: "700",
              fontSize: "1.85rem",
              marginBottom: "20px",
            }}
          >
            <i className="bi bi-newspaper"></i>
            Welcome to Hercule Health – In the News page.
          </h3>

          <p
            style={{
              fontSize: "1.15rem",
              color: "#333",
              marginBottom: "16px",
              lineHeight: "1.75",
            }}
          >
            Here, we’ll keep you updated on the latest headlines, media mentions, expert interviews, and exciting milestones that matter to our clients, healthcare partners, and future investors.
          </p>

          <p
            style={{
              fontSize: "1.15rem",
              color: "#333",
              marginBottom: "16px",
              lineHeight: "1.75",
            }}
          >
            From breakthrough innovations in preventive diagnostics to new partnerships and platform updates, this is your go-to source for all things Hercule Health.
          </p>

          <div
            style={{
              background: "rgb(230, 239, 255)",
              padding: "20px",
              borderRadius: "10px",
              marginTop: "30px",
            }}
          >
            <p
              style={{
                color: "rgb(27, 59, 136)",
                fontSize: "1.2rem",
                fontWeight: "600",
                marginBottom: "0",
              }}
            >
              Stay tuned. We’re just getting started — and you won’t want to miss what’s next.
            </p>
          </div>
        </div>

      </div>


      <DoctorFooter {...props} />
    </div>

  );
};

export default InTheNews;