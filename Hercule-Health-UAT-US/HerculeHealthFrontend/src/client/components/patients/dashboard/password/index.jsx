import React, { useState, useEffect } from "react";
import axios from "../../../../../axiosConfig.js";  // Import axios
import DashboardSidebar from "../sidebar/sidebar.jsx";
import StickyBox from "react-sticky-box";
import DoctorFooter from "../../../common/doctorFooter/index.jsx";
import { Link } from "react-router-dom";
import Header from "../../../header.jsx";

const Password = (props) => {
  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);

  // Fetch email from profile API and set it as default (muted)
  useEffect(() => {
    const userId = localStorage.getItem("userData");
    if (userId) {
      axios
        .get(`/api/patient-profile-information/${userId}`)
        .then((response) => {
          const email = response.data?.patient?.information?.email || "";
          setFormData((prev) => ({ ...prev, email }));
        })
        .catch(() => {
          setFormData((prev) => ({ ...prev, email: "" }));
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if new password matches confirm password
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      // Make API call to update the password
      const response = await axios.post('/api/change-password', {
        email: formData.email,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      // Handle successful password change
      if (response.status === 200) {
        setSuccess("Password changed successfully.");
        setError(null);

        // Clear form fields after successful submission (except email)
        setFormData((prev) => ({
          ...prev,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);  // Adjust time as needed (3 seconds here)
      }
    } catch (error) {
      // Handle error in the API call
      setError(error.response?.data?.message || "An error occurred while saving your data.");
      setSuccess(null);
    }
  };

  return (
    <div>
      <Header {...props} />
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <h2 className="breadcrumb-title">Change Password</h2>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/patient/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Change Password
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar mb-lg-4 mb-xl-0 mb-md-4 mb-4">
              <StickyBox offsetTop={20} offsetBottom={20}>
                <DashboardSidebar />
              </StickyBox>
            </div>

            <div className="col-lg-8 col-xl-9">
              <div className="dashboard-header">
                <h3 className="pt-3 px-3 d-block">Change Password</h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="card pass-card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-block input-block-new">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            disabled
                            style={{ background: "#f5f5f5", color: "#888" }}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block input-block-new">
                          <label className="form-label">Current Password</label>
                          <input
                            type="password"
                            className="form-control"
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-block input-block-new">
                          <label className="form-label">New Password</label>
                          <div className="pass-group">
                            <input
                              type={showPassword ? "text" : "password"}
                              className="form-control pass-input"
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleChange}
                            />
                            <span
                              className={`feather-eye${showPassword ? "" : "-off"} toggle-password`}
                              onClick={togglePasswordVisibility}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="input-block input-block-new mb-0">
                          <label className="form-label">Confirm Password</label>
                          <div className="pass-group">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              className="form-control pass-input-sub"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                            />
                            <span
                              className={`feather-eye${showConfirmPassword ? "" : "-off"} toggle-password`}
                              onClick={toggleConfirmPassword}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="form-set-button d-flex justify-content-end">
                  {/* <button className="btn btn-light" type="button">
                    Cancel
                  </button> */}
                  <button className="btn" type="submit" style={{ backgroundColor: "#008080", color: "#fff" }}>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <DoctorFooter {...props} />
    </div>
  );
};

export default Password;
