import React, { useState, useEffect } from "react";
import axios from "../../../../axiosConfig.js"; // Import axios for API requests
import DoctorSidebar from "../sidebar/index";
import Header from "../../header";
import DoctorFooter from "../../common/doctorFooter/index.jsx";
import Select from "react-select";
import { Link } from "react-router-dom";
import SettingsHeader from "./settingsHeader.jsx";

const ProfileSetting = (props) => {
  const [knownLanguages, setKnownLanguages] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [designation, setDesignation] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [email, setEmail] = useState("");
  const [membershipInfos, setMembershipInfos] = useState([{ title: "", about: "" }]);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userData");
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [Country, setCountry] = useState([
    { value: "Austria", label: "Austria" },
    { value: "Belgium", label: "Belgium" },
    { value: "Czech Republic", label: "Czech Republic" },
    { value: "Denmark", label: "Denmark" },
    { value: "Estonia", label: "Estonia" },
    { value: "Finland", label: "Finland" },
    { value: "France", label: "France" },
    { value: "Germany", label: "Germany" },
    { value: "Greece", label: "Greece" },
    { value: "Hungary", label: "Hungary" },
    { value: "Iceland", label: "Iceland" },
    { value: "Italy", label: "Italy" },
    { value: "Latvia", label: "Latvia" },
    { value: "Liechtenstein", label: "Liechtenstein" },
    { value: "Lithuania", label: "Lithuania" },
    { value: "Luxembourg", label: "Luxembourg" },
    { value: "Malta", label: "Malta" },
    { value: "Netherlands", label: "Netherlands" },
    { value: "Norway", label: "Norway" },
    { value: "Poland", label: "Poland" },
    { value: "Portugal", label: "Portugal" },
    { value: "Slovakia", label: "Slovakia" },
    { value: "Slovenia", label: "Slovenia" },
    { value: "Spain", label: "Spain" },
    { value: "Sweden", label: "Sweden" },
    { value: "Switzerland", label: "Switzerland" }
  ]);

  // Predefined language options
  const languageOptions = [
    { value: "Arabic", label: "Arabic" },
    { value: "Dutch", label: "Dutch" },
    { value: "English", label: "English" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Hindi", label: "Hindi" },
    { value: "Italian", label: "Italian" },
    { value: "Mandarin", label: "Mandarin" },
    { value: "Portuguese", label: "Portuguese" },
    { value: "Russian", label: "Russian" },
    { value: "Spanish", label: "Spanish" },
  ];
  const [location, setLocation] = useState(""); // Country
  const [city, setCity] = useState("");        // City
  const [errorMessage, setErrorMessage] = useState("");


  // Fetch existing profile data on component mount
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
        setFirstName(data.information.firstName || "");
        setLastName(data.information.lastName || "");
        setDisplayName(data.information.displayName || "");
        setGender(data.information.gender || "");
        setAge(data.information.age || "");
        setDesignation(data.information.designation || "");
        setPhoneNumbers(data.information.phone || "");
        setEmail(data.information.email || "");
        setLocation(data.information.location || "");
        setCity(data.information.city || "");
        setKnownLanguages(data.information.knownLanguages || []);
        setMembershipInfos(data.membershipInfos || [{ title: "", about: "" }]);
        setProfileImage(data.profileImage || null);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        alert("Error fetching profile data. Please try again.");
      }
    };

    fetchProfileData();
  }, [userId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    // Simple form validation before submission

    // Validate form fields

    let errors = [];

    if (!firstName) errors.push("First Name");
    if (!lastName) errors.push("Last Name");
    if (!designation) errors.push("Specialization");
    if (!gender) errors.push("Gender");
    if (!email) errors.push("Email");
    if (!phoneNumbers) errors.push("Mobile Number");
    if (!location) errors.push("Country");
    if (!city) errors.push("City");

    if (errors.length > 0) {
      const message = `${errors.join(", ")} ${errors.length > 1 ? 'fields are' : 'field is'} required.`;
      setErrorMessage(message);
      return; // Stop here if errors found
    }

    try {
      setLoading(true); // Set loading state

      const updateData = {
        information: {
          firstName,
          lastName,
          phoneNumbers,
          email,
          knownLanguages,
          displayName,
          designation,
          gender,
          age,
          location, // Country
          city,     // City
        },

        membershipInfos,
        profileImage, // Profile image should be passed as URL or base64-encoded image
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/svg+xml"];
      if (file.size > 100 * 1024) {
        // Check if file size is greater than 100KB
        setError("Image size must be under 100KB.");
        return;
      }
      if (!validTypes.includes(file.type)) {
        setError("Accepted image formats: jpg, png, svg.");
        return;
      }

      setError(""); // Clear previous error if validation passes

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Store base64 image data in state
        setProfileImagePreview(reader.result); // Preview the image
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle adding new membership information
  const addMembershipInfo = () => {
    setMembershipInfos([...membershipInfos, { title: "", about: "" }]);
  };

  // Handle deleting membership information
  const deleteMembershipInfo = (index) => {
    const updatedMembershipInfos = membershipInfos.filter((_, i) => i !== index);
    setMembershipInfos(updatedMembershipInfos);
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
              <div className="setting-title">
                <h5>Profile</h5>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="setting-card">
                  <div className="change-avatar img-upload">
                    <div className="profile-img">
                      {profileImagePreview ? (
                        <img className="profile-image" src={profileImagePreview} alt="Profile Preview" />
                      ) : (
                        <img className="profile-image" src={profileImage || "/assets/images/doctor-thumb-01.png"} alt="Default Profile" />
                      )}
                    </div>
                    <div className="upload-img">
                      <h5>Profile Image</h5>
                      <div className="imgs-load d-flex align-items-center">
                        <div className="change-photo">
                          <span style={{ color: "#008080", cursor:"pointer" }}>Upload New</span>
                          <input
                            type="file"
                            className="upload"
                            onChange={handleImageChange}
                          />
                        </div>
                        {profileImage && (
                          <Link
                            to="#"
                            className="upload-remove"
                            onClick={() => { setProfileImage(null); setProfileImagePreview(null); }}
                          >
                            Remove
                          </Link>
                        )}
                      </div>
                      <p className="form-text" style={{ fontStyle: "italic" }}>
                        Your image should be below 100KB. Accepted formats: JPG, PNG, SVG.
                      </p>
                    </div>
                  </div>
                  {error && <p className="error-message">{error}</p>}
                </div>

                <div className="form-1">
                  <div className="setting-title">
                    <h5>Information</h5>
                  </div>
                  <div className="setting-card">
                    <div className="row">
                      <div className="col-lg-4 col-md-6">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            First Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Last Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Display Name <span className="text-danger"></span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Gender <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-control"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Age <span className="text-danger"></span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="form-wrap">
                          <label className="col-form-label">Country <span className="text-danger">*</span></label>
                          <select
                            className="form-select form-control"
                            id="country"
                            name="country"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                          >
                            <option value="">Select Your Country</option>
                            {Country.map((city) => (
                              <option key={city.value} value={city.value}>
                                {city.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="form-wrap">
                          <label className="col-form-label">City <span className="text-danger">*</span></label>
                          <input
                            type="text"
                            className="form-control"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Enter your city"
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Specialization <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Mobile Number <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={phoneNumbers}
                            onChange={(e) => setPhoneNumbers(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Email<span className="text-danger">*</span>
                          </label>
                          <input
                            disabled
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Known Languages{" "}
                            <span className="text-danger"></span>
                          </label>
                          <Select
                            options={languageOptions} // Using predefined language options
                            onChange={(selectedOptions) =>
                              setKnownLanguages(
                                selectedOptions.map((opt) => opt.value)
                              )
                            }
                            isMulti
                            value={knownLanguages.map((lang) => ({
                              value: lang,
                              label: lang,
                            }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}
                <div className="modal-btn text-end">
                  <button
                    type="submit"
                    className="btn"
                    style={{ backgroundColor: "#008080", color: "#fff" }}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
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

export default ProfileSetting;
