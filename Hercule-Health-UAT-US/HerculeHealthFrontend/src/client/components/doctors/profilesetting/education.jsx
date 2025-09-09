import React, { useState, useEffect } from "react";
import Header from "../../header";
import DoctorFooter from "../../common/doctorFooter";
import DoctorSidebar from "../sidebar";
import SettingsHeader from "./settingsHeader";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import axios from "../../../../axiosConfig";

const Education = () => {
  const [educations, setEducations] = useState([]);
  const [expandedEducationId, setExpandedEducationId] = useState(null);
  const userId = localStorage.getItem('userData');

  useEffect(() => {
    if (userId) {
      fetchEducationData(userId);
    } else {
      setEducations([]);
      console.error("User ID not found in localStorage");
    }
  }, [userId]);

  const fetchEducationData = async (userId) => {
    try {
      const response = await axios.get(`/api/consultant-profile-information/${userId}`);
      // Map DB fields to your state, ensure dates are Date objects (or null)
      const educationsFromDB = (response?.data?.consultant?.educations || []).map(edu => ({
        ...edu,
        id: edu.educationId || Date.now() + Math.random(), // unique id for react key and UI
        startDate: edu.startDate ? new Date(edu.startDate) : null,
        endDate: edu.endDate ? new Date(edu.endDate) : null,
      }));
      setEducations(educationsFromDB);
    } catch (error) {
      console.error("Error fetching education data:", error);
      setEducations([]);
    }
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now(), // temp id for UI, no educationId yet
      educationId: null, // no db id yet
      nameOfInstitution: '',
      course: '',
      description: '',
      startDate: null,
      endDate: null,
    };
    setEducations(prev => [...prev, newEducation]);
    setExpandedEducationId(newEducation.id);
  };

  const deleteEducation = (id) => {
    setEducations(prev => prev.filter(edu => edu.id !== id));
    if (expandedEducationId === id) setExpandedEducationId(null);
  };

  const handleInputChange = (e, id, field) => {
    const value = e.target.value;
    setEducations(prev =>
      prev.map(edu => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  const handleDateChange = (date, id, field) => {
    setEducations(prev =>
      prev.map(edu => (edu.id === id ? { ...edu, [field]: date } : edu))
    );
  };

  const toggleEducationExpansion = (id) => {
    setExpandedEducationId(prev => (prev === id ? null : id));
  };

  const saveChanges = async () => {
    if (!userId) {
      alert("User not found, cannot save.");
      return;
    }

    // Prepare data for backend (strip out temp id used for UI)
    const educationsToSave = educations.map(({ id, ...rest }) => ({
      ...rest,
      startDate: rest.startDate ? rest.startDate.toISOString() : null,
      endDate: rest.endDate ? rest.endDate.toISOString() : null,
    }));

    try {
      await axios.put(`/api/update-consultant-information/${userId}`, { educations: educationsToSave });
      alert("Education details saved successfully!");
      setExpandedEducationId(null);
      fetchEducationData(userId);  // Re-fetch fresh data from backend to update UI
    } catch (error) {
      console.error("Error updating education data:", error);
      alert("Failed to save changes.");
    }
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
              <div className="dashboard-header border-0 mb-0 d-flex justify-content-between align-items-center">
                <h3>Education</h3>
                <Link to="#" className="btn" style={{ backgroundColor: "#008080", color: "#fff" }} onClick={addEducation}>
                  Add New Education
                </Link>
              </div>

              <form>
                {educations.length > 0 ? (
                  educations.map((edu, index) => (
                    <div className="user-accordion-item" key={edu.id}>
                      <a
                        href="#"
                        className="accordion-wrap"
                        onClick={e => {
                          e.preventDefault();
                          toggleEducationExpansion(edu.id);
                        }}
                      >
                        Education {index + 1}
                        <span
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteEducation(edu.id);
                          }}
                          className="delete-experience"
                          style={{ marginLeft: 20, cursor: "pointer", color: "red" }}
                        >
                          Delete
                        </span>
                      </a>

                      <div className={`accordion-collapse collapse ${expandedEducationId === edu.id ? 'show' : ''}`}>
                        <div className="content-collapse">
                          <div className="add-service-info">
                            <div className="add-info">
                              <div className="row align-items-center">

                                <div className="col-md-6">
                                  <div className="form-wrap">
                                    <label className="col-form-label">Name of Institution</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={edu.nameOfInstitution || ''}
                                      onChange={e => handleInputChange(e, edu.id, 'nameOfInstitution')}
                                    />
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <div className="form-wrap">
                                    <label className="col-form-label">Course</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={edu.course || ''}
                                      onChange={e => handleInputChange(e, edu.id, 'course')}
                                    />
                                  </div>
                                </div>

                                <div className="col-md-12">
                                  <div className="form-wrap">
                                    <label className="col-form-label">Description</label>
                                    <textarea
                                      className="form-control"
                                      rows={3}
                                      value={edu.description || ''}
                                      onChange={e => handleInputChange(e, edu.id, 'description')}
                                    />
                                  </div>
                                </div>

                                <div className="col-lg-6 col-md-6">
                                  <div className="form-wrap">
                                    <label className="col-form-label">Start Date</label>
                                    <DatePicker
                                      className="form-control datetimepicker"
                                      selected={edu.startDate}
                                      onChange={date => handleDateChange(date, edu.id, 'startDate')}
                                      dateFormat="dd/MM/yyyy"
                                      isClearable
                                      placeholderText="Select start date"
                                    />
                                  </div>
                                </div>

                                <div className="col-lg-6 col-md-6">
                                  <div className="form-wrap">
                                    <label className="col-form-label">End Date</label>
                                    <DatePicker
                                      className="form-control datetimepicker"
                                      selected={edu.endDate}
                                      onChange={date => handleDateChange(date, edu.id, 'endDate')}
                                      dateFormat="dd/MM/yyyy"
                                      isClearable
                                      placeholderText="Select end date"
                                    />
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
                  <p>No education data available</p>
                )}

                <div className="modal-btn text-end mt-3">
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

export default Education;
