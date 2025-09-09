import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import Header from '../../header'
import DoctorFooter from '../../common/doctorFooter'
import DoctorSidebar from '../sidebar'
import SettingsHeader from './settingsHeader'
import { doctordashboardclient01, doctordashboardclient02 } from '../../imagepath'
import axios from "../../../../axiosConfig.js";

const Clinic = (props) => {

  const [isRegistered, setIsRegistered] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [clinicalAddress, setClinicAddres] = useState("");
  const [postcode, setPostcode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userData");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `/api/consultant-profile-information/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = response.data.consultant;
        console.log("data clinic", data);
        setIsRegistered(data.clinicalDetails.isRegistered || false)
        setClinicName(data.clinicalDetails.clinicName || "");
        setClinicAddres(data.clinicalDetails.clinicalAddress || "");
        setPostcode(data.clinicalDetails.postcode || "");
      } catch (error) {
        console.error("Error fetching profile data:", error);
        alert("Error fetching profile data. Please try again.");
      }
    };

    fetchProfileData();
  }, [userId]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple form validation before submission


    try {
      setLoading(true); // Set loading state

      const updateData = {
        clinicalDetails: {
          isRegistered,
          clinicName,
          clinicalAddress,
          postcode
        },
      };

      const response = await axios.put(
        `/api/update-consultant-information/${userId}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json", // Sending JSON data
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Profile updated successfully");
      } else {
        alert("Profile update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div>
      <Header {...props} />
      {/* Breadcrumb */}
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
      {/* /Breadcrumb */}
      {/* Page Content */}
      <div className="content doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              {/* Profile Sidebar */}
              <DoctorSidebar />
              {/* /Profile Sidebar */}
            </div>
            <div className="col-lg-8 col-xl-9">
              {/* Profile Settings */}
              <div className="dashboard-header">
                <h3>Profile Settings</h3>
              </div>
              {/* Settings List */}
              <SettingsHeader />
              {/* /Settings List */}
              <div className="dashboard-header border-0 mb-0">
                <h3>Clinic  details</h3>

              </div>
              <form onSubmit={handleSubmit}>
                <div className="accordions clinic-infos" id="list-accord">
                  {/* Clinic Item */}
                  <div className="user-accordion-item">

                    <div
                      className="accordion-collapse collapse show"
                      id="clinic3"
                      data-bs-parent="#list-accord"
                    >
                      <div className="content-collapse">
                        <div className="add-service-info">
                          <div className="add-info">
                            <div className="row align-items-center">
                              <div className="col-md-12">
                                <div className="form-wrap mb-2">

                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-wrap">
                                    <label className="col-form-label">
                                      Clinic Name
                                    </label>
                                    <input type="text" className="form-control" value={clinicName} onChange={(e) => setClinicName(e.target.value)} />
                                </div>
                              </div>
                              <div className="col-md-6">
                                  
                                  <div className="form-wrap">
                                    <div className="form-check">
                                      <label className="form-check-label">
                                        <input
                                          type="checkbox"
                                          className="form-check-input"
                                          checked={isRegistered}
                                          onChange={(e) => setIsRegistered(e.target.checked)}
                                        />
                                        Registered ?
                                      </label>
                                    </div>
                                  </div>
                              

                              </div>
                              <div className="col-md-6">
                                <div className="form-wrap">
                                  <label className="col-form-label">Registered Clinical Address</label>
                                  <input type="text" className="form-control" value={clinicalAddress} onChange={(e) => setClinicAddres(e.target.value)} />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-wrap">
                                  <label className="col-form-label">Postcode</label>
                                  <input type="text" className="form-control" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
                                </div>
                              </div>


                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-btn text-end">

                  <button type="submit" className="btn" style={{ backgroundColor: "#008080", color: "#fff" }}>
                    Save Changes
                  </button>
                </div>
              </form>
              {/* /Profile Settings */}
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      <DoctorFooter />
    </div>
  )
}

export default Clinic
