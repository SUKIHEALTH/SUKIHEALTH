import React, { useState } from "react";
import Logo from "../../../assets/images/logo.png";
import male from "../../../assets/images/icons/male.png";
import female from "../../../assets/images/icons/female.png";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom"; // Import useHistory

const Registersteptwo = () => {
  const [postcodeError, setPostcodeError] = useState(""); // For postcode validation
  const [specialityError, setSpecialityError] = useState("");


  const [formData, setFormData] = useState({
    gender: "Male", // Default to Male
    isRegistered: false,
    speciality: "",
    address: "",
    clinicName: "",
    Postcode: "",
    qualificationCertificate: null,
    photoID: null,
    clinicalEmployment: null,
    age: "",
  });

  // Initialize history object for navigation
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData((prevData) => ({
        ...prevData,
        [name]: file,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if the speciality field is empty
    if (!formData.speciality.trim()) {
      setSpecialityError("Specialization field is required.");
      return; // Prevent form submission
    }
  
    setSpecialityError(""); // Clear error if valid

    // Store form data in localStorage
    localStorage.setItem("formData", JSON.stringify(formData)); // Store form data in localStorage

    // Navigate to the next step (Step 3) using history.push
    history.push("/register-step-3");
  };
  const handlePostcodeChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      Postcode: value,
    }));

    // Regex to validate the postcode format (1111AB or 1111-AB)
    const regex = /^\d{4}-?[A-Za-z]{2}$/;

    if (!regex.test(value)) {
      setPostcodeError("Invalid postcode format. Use 1111AB or 1111-AB.");
    } else {
      setPostcodeError(""); // Clear error if valid
    }
  };

  return (
    <>
      {/* Page Content */}
      <div className="content login-page pt-0">
        <div className="container-fluid">
          {/* Register Content */}
          <div className="account-content">
            <div className="row align-items-center">
              <div className="login-right">
                <div className="inner-right-login">
                  <div className="login-header">
                    <div className="logo-icon">
                      <img src={Logo} alt="Logo" />
                    </div>
                    <div className="step-list">
                      <ul>
                        <li>
                          <Link to="#" className="active-done">
                            1
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="active">
                            2
                          </Link>
                        </li>
                        <li>
                          <Link to="#">3</Link>
                        </li>
                      </ul>
                    </div>
                    
                    <form
                      id="personal_details"
                      encType="multipart/form-data"
                      onSubmit={handleSubmit}
                    >
                      <div className="text-start mt-2">
                        <h4 className="mt-3">Select Your Gender</h4>
                      </div>
                      <div className="select-gender-col">
                        <div className="row">
                          <div className="col-6 pe-0">
                            <input
                              type="radio"
                              id="male"
                              name="gender"
                              value="Male"
                              checked={formData.gender === "Male"}
                              onChange={handleChange}
                            />
                            <label htmlFor="male">
                              <span className="gender-icon">
                                <img src={male} alt="Male" />
                              </span>
                              <span>Male</span>
                            </label>
                          </div>
                          <div className="col-6 ps-2">
                            <input
                              type="radio"
                              id="female"
                              name="gender"
                              value="Female"
                              checked={formData.gender === "Female"}
                              onChange={handleChange}
                            />
                            <label htmlFor="female">
                              <span className="gender-icon">
                                <img src={female} alt="Female" />
                              </span>
                              <span>Female</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="pregnant-col pt-4">
                        <div className="remember-me-col d-flex justify-content-between">
                          <span className="mt-1">Are you Registered?</span>
                          <label className="custom_check">
                            <input
                              type="checkbox"
                              id="is_registered"
                              name="isRegistered"
                              checked={formData.isRegistered}
                              onChange={handleChange}
                            />
                            <span className="checkmark" />
                          </label>
                        </div>
                      </div>

                      <div className="step-process-col mt-4">
                        {/* Form Fields */}
                        <div className="form-group">
                          <label>Specialization<span className="text-danger"> *</span></label>
                          <input
                            type="text"
                            name="speciality"
                            value={formData.speciality}
                            onChange={(e) => {
                              handleChange(e);
                              setSpecialityError(""); // Clear error on input change
                            }}
                            className="form-control"
                          />
                        </div>

                        <div className="form-group">
                        <div className="form-group">
                          <label>Clinic Name</label>
                          <input
                            type="text"
                            name="clinicName"
                            value={formData.clinicName}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                          <label>Registered Clinic Address</label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>

                        <div className="form-group">
                          <label>Postcode</label>
                          <input
                            type="text"
                            name="Postcode"
                            value={formData.Postcode}
                            onChange={handlePostcodeChange}
                            className="form-control"
                          />
                          {postcodeError && (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {postcodeError}
                            </div>
                          )}
                        </div>

                        {/* File Upload Fields */}
                        <div className="form-group">
                          <label>Qualification Certificate</label>
                          <input
                            type="file"
                            name="qualificationCertificate"
                            onChange={handleFileChange}
                            className="form-control"
                          />
                        </div>

                        <div className="form-group">
                          <label>Photo ID</label>
                          <input
                            type="file"
                            name="photoID"
                            onChange={handleFileChange}
                            className="form-control"
                          />
                        </div>

                        <div className="form-group">
                          <label>Clinical Employment</label>
                          <input
                            type="file"
                            name="clinicalEmployment"
                            onChange={handleFileChange}
                            className="form-control"
                          />
                        </div>

                        <div className="form-group">
                          <label>Your Age</label>
                          <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      {specialityError && (
                        <div className="alert alert-danger">{specialityError}</div>
                      )}
                      <div className="mt-5">
                        {/* Using button for form submission */}
                        <Link
                          className="btn btn-primary w-100 btn-lg login-btn step2_submit"
                          onClick={handleSubmit}
                          to={"/register-step-3"}
                        >
                          Continue
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="login-bottom-copyright">
                  <span>© 2025 HerculeHealth. All rights reserved.</span>
                </div>
              </div>
            </div>
          </div>
          {/* /Register Content */}
        </div>
      </div>
      {/* /Page Content */}
    </>
  );
};

export default Registersteptwo;
