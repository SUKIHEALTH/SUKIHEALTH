import React, { useState, useEffect,useRef } from "react";
import Header from "../../header";
import DoctorFooter from "../../common/doctorFooter";
import DoctorSidebar from "../sidebar";
import SettingsHeader from "./settingsHeader";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import axios from "../../../../axiosConfig";

const Awards = (props) => {
  const [awards, setAwards] = useState([]);
  const [expandedAwardId, setExpandedAwardId] = useState(null);
  const userId = localStorage.getItem('userData');
  const awardIdCounter = useRef(1);


  useEffect(() => {
    if (userId) {
      fetchAwardsData(userId);
    } else {
      console.error("User ID not found in localStorage");
      setAwards([]);
    }
  }, [userId]);

  const fetchAwardsData = async (userId) => {
    try {
      const response = await axios.get(`/api/consultant-profile-information/${userId}`);
      const awardsFromDB = (response?.data?.consultant?.awards || []).map((award, index) => ({
        ...award,
        id: index + 1,
      }));
      setAwards(awardsFromDB);
      console.log("award",awards);
      awardIdCounter.current = awardsFromDB.length + 1;
    } catch (error) {
      console.error("Error fetching awards data:", error);
      setAwards([]);
      awardIdCounter.current = 1;
    }
  };

  const addAward = () => {
    const newAward = {
      id: awardIdCounter.current++,
      awardId: null,
      awardName: '',
      year: null,
      description: '',
    };
    setAwards(prev => [...prev, newAward]);
    setExpandedAwardId(newAward.id);
  };
  
  
  

  const deleteAward = (id) => {
    setAwards(prev => prev.filter(award => award.id !== id));
    if (expandedAwardId === id) setExpandedAwardId(null);
    console.log("delete item", id);
  };
  
  

  const handleInputChange = (e, id, field) => {
    const value = e.target.value;
    setAwards(prev =>
      prev.map(award => (award.id === id ? { ...award, [field]: value } : award))
    );
  };

  const handleDateChange = (date, id) => {
    setAwards(prev =>
      prev.map(award => (award.id === id ? { ...award, year: date.getFullYear() } : award))
    );
  };

  const toggleAwardExpansion = (id) => {
    setExpandedAwardId(prev => (prev === id ? null : id));
  };

  const saveChanges = async () => {
    if (!userId) {
      alert("User not found, cannot save.");
      return;
    }
  
    const awardsToSave = awards.map(award => {
      if (!award.awardId) {
        award.awardId = Date.now() + Math.floor(Math.random() * 1000);
      }
      const { id, ...rest } = award;
      return rest;
    });
  
    try {
      // Even if awardsToSave is empty, send it to backend to clear it
      await axios.put(`/api/update-consultant-information/${userId}`, { awards: awardsToSave });
      alert("Awards saved successfully!");
      setExpandedAwardId(null);
      fetchAwardsData(userId);
    } catch (error) {
      console.error("Error saving awards:", error);
      alert("Failed to save awards.");
    }
  };
  
  

  return (
    <div>
      <Header {...props} />
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
                <h3>Awards</h3>
                <Link to="#" className="btn" style={{ backgroundColor: "#008080", color: "#fff" }} onClick={addAward}>
                  Add New Award
                </Link>
              </div>

              <form>
                {awards.length > 0 ? (
                  awards.map((award, index) => (
                    <div className="user-accordion-item" key={award.id}>
                      <a
                        href="#"
                        className="accordion-wrap"
                        onClick={e => {
                          e.preventDefault();
                          toggleAwardExpansion(award.id);
                        }}
                      >
                        Award {index + 1}
                        <span
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteAward(award.id);
                          }}
                          className="delete-experience"
                          style={{ marginLeft: 20, cursor: "pointer", color: "red" }}
                        >
                          Delete
                        </span>
                      </a>

                      <div className={`accordion-collapse collapse ${expandedAwardId === award.id ? 'show' : ''}`}>
                        <div className="content-collapse">
                          <div className="add-service-info">
                            <div className="add-info">
                              <div className="row align-items-center">

                                <div className="col-md-6">
                                  <div className="form-wrap">
                                    <label className="col-form-label">Award Name</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={award.awardName || ''}
                                      onChange={e => handleInputChange(e, award.id, 'awardName')}
                                    />
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <div className="form-wrap">
                                    <label className="col-form-label">Year</label>
                                    <DatePicker
                                      className="form-control datetimepicker"
                                      selected={award.year ? new Date(award.year, 0, 1) : null}
                                      onChange={date => handleDateChange(date, award.id)}
                                      showYearPicker
                                      dateFormat="yyyy"
                                      placeholderText="Select Year"
                                      isClearable
                                    />
                                  </div>
                                </div>

                                <div className="col-md-12">
                                  <div className="form-wrap">
                                    <label className="col-form-label">Description</label>
                                    <textarea
                                      className="form-control"
                                      rows={3}
                                      value={award.description || ''}
                                      onChange={e => handleInputChange(e, award.id, 'description')}
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
                  <p>No awards data available</p>
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

export default Awards;
