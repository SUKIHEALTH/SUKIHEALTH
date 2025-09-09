import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DoctorSidebar from "../sidebar";
import DoctorFooter from "../../common/doctorFooter";
import SettingsHeader from "./settingsHeader";
import DatePicker from "react-datepicker";
import axios from "../../../../axiosConfig";
import Header from "../../header";

const Experience = () => {
  const [experience, setExperience] = useState([]);
  const [error, setError] = useState("");
  const [expandedExperienceId, setExpandedExperienceId] = useState(null);
  const userId = localStorage.getItem('userData');

  useEffect(() => {
    if (userId) {
      fetchExperienceData(userId);
    } else {
      console.error("User ID not found in localStorage");
      setExperience([]);
    }
  }, [userId]);

  const fetchExperienceData = async (userId) => {
    try {
      const response = await axios.get(`/api/consultant-profile-information/${userId}`);
      const fetchedExperiences = response?.data?.consultant?.experience || [];
  
      // Ensure every fetched item has a unique id
      const experiencesWithIds = fetchedExperiences.map(exp => ({
        ...exp,
        id: exp.id || Date.now() + Math.random() // fallback if no id present
      }));
  
      setExperience(experiencesWithIds);
    } catch (error) {
      console.error("Error fetching experience data:", error);
      setExperience([]);
    }
  };
  

  const addExperience = () => {
    const newExperience = {
      id: Date.now(), // Use timestamp for unique ID
      title: '',
      hospitalName: '',
      location: '',
      yearsOfExperience: '',
      jobDescription: '',
      startDate: new Date(),
      endDate: new Date(),
      isCurrentlyWorking: false,
      hospitalLogo: null,
    };
    
    setExperience(prevExperience => [...prevExperience, newExperience]);
    setExpandedExperienceId(newExperience.id); // Automatically expand new experience
  };

  const deleteExperience = (id) => {
    setExperience(prevExperience => prevExperience.filter(exp => exp.id !== id));
    if (expandedExperienceId === id) {
      setExpandedExperienceId(null);
    }
  };

  const handleInputChange = (e, id, field) => {
    setExperience(prevExperience =>
      prevExperience.map(exp =>
        exp.id === id ? { ...exp, [field]: e.target.value } : exp
      )
    );
  };

  const handleDateChange = (date, id, field) => {
    setExperience(prevExperience =>
      prevExperience.map(exp =>
        exp.id === id ? { ...exp, [field]: date } : exp
      )
    );
  };

  const handleCheckboxChange = (e, id) => {
    setExperience(prevExperience =>
      prevExperience.map(exp =>
        exp.id === id ? { ...exp, isCurrentlyWorking: e.target.checked } : exp
      )
    );
  };

  const handleImageChange = (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    if (file.size > 100 * 1024) {
      setError("Image size must be under 100KB.");
      return;
    }
    if (!validTypes.includes(file.type)) {
      setError("Accepted image formats: jpg, png, svg.");
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      setExperience(prevExperience =>
        prevExperience.map(exp =>
          exp.id === id ? { ...exp, hospitalLogo: reader.result } : exp
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (id) => {
    setExperience(prevExperience =>
      prevExperience.map(exp =>
        exp.id === id ? { ...exp, hospitalLogo: null } : exp
      )
    );
  };

  const saveChanges = async () => {
    if (!userId) return;
  
    try {
      const response = await axios.put(
        `/api/update-consultant-information/${userId}`,
        { experience }
      );
      console.log("Experience data updated successfully:", response.data);
  
      // Close all expanded accordions
      setExpandedExperienceId(null);
  
      // Show popup on success
      window.alert("Experience details saved successfully!");
    } catch (error) {
      console.error("Error updating experience data:", error);
    }
  };
  

  const toggleExperienceExpansion = (id) => {
    setExpandedExperienceId(prevId => prevId === id ? null : id);
  };

  return (
    <div>
      <Header />
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Doctor Profile</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/doctor/doctor-dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Doctor Profile
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="content doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              <DoctorSidebar />
            </div>
            <div className="col-lg-8 col-xl-9">
              <div className="dashboard-header">
                <h3>Profile Settings</h3>
              </div>
              <SettingsHeader />
              <div className="dashboard-header border-0 mb-0">
                <h3>Experience</h3>
                <ul>
                  <li>
                    <Link
                      to="#"
                      className="btn"
                      style={{ backgroundColor: "#008080", color: "#fff" }}
                      onClick={addExperience}
                    >
                      Add New Experience
                    </Link>
                  </li>
                </ul>
              </div>
              <form>
                {experience.length > 0 ? (
                  experience.map((exp, index) => (
                    <div className="user-accordion-item" key={exp.id}>
                      <a
                        href="#"
                        className="accordion-wrap"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleExperienceExpansion(exp.id);
                        }}
                      >
                        Experience {index + 1}
                        <span
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteExperience(exp.id);
                          }}
                          className="delete-experience"
                        >
                          Delete
                        </span>

                      </a>
                      <div
                        className={`accordion-collapse collapse ${
                          expandedExperienceId === exp.id ? 'show' : ''
                        }`}
                      >
                        <div className="content-collapse">
                          <div className="add-service-info">
                            <div className="add-info">
                              <div className="row align-items-center">
                                {/* Image Upload Section 
                                <div className="col-md-12">
                                  <div className="form-wrap mb-2">
                                    <div className="change-avatar img-upload">
                                      <div className="profile-img">
                                        {exp.hospitalLogo ? (
                                          <img
                                            src={exp.hospitalLogo}
                                            alt="Hospital Logo"
                                            className="profile-img-preview"
                                            style={{
                                              width: "100%",
                                              height: "auto",
                                              objectFit: "cover"
                                            }}
                                          />
                                        ) : (
                                          <i className="fa-solid fa-file-image" />
                                        )}
                                      </div>
                                      <div className="upload-img">
                                        <h5>Hospital Image</h5>
                                        <div className="imgs-load d-flex align-items-center">
                                          <div className="change-photo">
                                            Upload New
                                            <input
                                              type="file"
                                              className="upload"
                                              onChange={(e) => handleImageChange(e, exp.id)}
                                            />
                                          </div>
                                          {exp.hospitalLogo && (
                                            <Link
                                              to="#"
                                              className="upload-remove"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                removeImage(exp.id);
                                              }}
                                            >
                                              Remove
                                            </Link>
                                          )}
                                        </div>
                                        <p className="form-text">
                                          Your Image should be below 100KB, Accepted formats: Jpg, Png, Svg
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>*/}

                                {/* Form Fields */}
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-wrap">
                                    <label className="col-form-label">Title</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={exp.title || ''}
                                      onChange={(e) => handleInputChange(e, exp.id, 'title')}
                                    />
                                  </div>
                                </div>

                                <div className="col-lg-6 col-md-6">
                                  <div className="form-wrap">
                                    <label className="col-form-label">Hospital</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={exp.hospitalName || ''}
                                      onChange={(e) => handleInputChange(e, exp.id, 'hospitalName')}
                                    />
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <div className="form-wrap">
                                    <label className="col-form-label">Location</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={exp.location || ''}
                                      onChange={(e) => handleInputChange(e, exp.id, 'location')}
                                    />
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <div className="form-wrap">
                                    <label className="col-form-label">Year of Experience</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="in Years"
                                      value={exp.yearsOfExperience || ''}
                                      onChange={(e) => handleInputChange(e, exp.id, 'yearsOfExperience')}
                                    />
                                  </div>
                                </div>

                                <div className="col-lg-12">
                                  <div className="form-wrap">
                                    <label className="col-form-label">Job Description</label>
                                    <textarea
                                      className="form-control"
                                      rows={3}
                                      value={exp.jobDescription || ''}
                                      onChange={(e) => handleInputChange(e, exp.id, 'jobDescription')}
                                    />
                                  </div>
                                </div>

                                <div className="col-lg-4 col-md-6">
                                  <div className="form-wrap">
                                    <label className="col-form-label">Start Date</label>
                                    <div className="form-icon">
                                      <DatePicker
                                        className="form-control datetimepicker"
                                        selected={exp.startDate}
                                        onChange={(date) => handleDateChange(date, exp.id, 'startDate')}
                                        dateFormat="dd/MM/yyyy"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="col-lg-4 col-md-6">
                                  <div className="form-wrap">
                                    <label className="col-form-label">End Date</label>
                                    <div className="form-icon">
                                      <DatePicker
                                        className="form-control datetimepicker"
                                        selected={exp.endDate}
                                        onChange={(date) => handleDateChange(date, exp.id, 'endDate')}
                                        dateFormat="dd/MM/yyyy"
                                        disabled={exp.isCurrentlyWorking}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="col-lg-4 col-md-6">
                                  <div className="form-wrap">
                                    <div className="form-check">
                                      <label className="form-check-label">
                                        <input
                                          type="checkbox"
                                          className="form-check-input"
                                          checked={exp.isCurrentlyWorking || false}
                                          onChange={(e) => handleCheckboxChange(e, exp.id)}
                                        />
                                        I Currently Work Here
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No experience data available</p>
                )}
                <div className="modal-btn text-end">
                  <Link to="#" className="btn" style={{ backgroundColor: "#008080", color: "#fff" }} onClick={saveChanges}>
                    Save Changes
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <DoctorFooter />
    </div>
  );
};

export default Experience;