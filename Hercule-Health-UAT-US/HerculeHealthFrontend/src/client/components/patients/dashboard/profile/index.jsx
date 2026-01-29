import React, { useState, useEffect } from "react";
import DashboardSidebar from "../sidebar/sidebar.jsx";
import {IMG01} from "../img.jsx";
import StickyBox from "react-sticky-box";
import { Link, useHistory } from "react-router-dom";
import DoctorFooter from "../../../common/doctorFooter/index.jsx";
import Header from "../../../header.jsx";
import axios from "../../../../../axiosConfig.js";

const Profile = (props) => {
  const [profile, setProfile] = useState({
    information: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
  },
  address: {
    address: "",
    city: "",
    country: "",
    pincode: ""
  },
    profileImage: IMG01, // Fallback image
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userData");
  const history = useHistory();
  const cityOptions = [
    { value: "Amsterdam", label: "Amsterdam" },
    { value: "Eindhoven", label: "Eindhoven" },
    { value: "Den Haag", label: "Den Haag" },
    { value: "Tiel", label: "Tiel" },
    { value: "Rotterdam", label: "Rotterdam" },
  ];
  // Fetch user profile from API
  useEffect(() => {
    // Check if it's a stringified value or just an ID
    console.log("User ID from localStorage:", userId); // Log the value to check what you get

    if (!userId) {
      setError("User ID not found");
      history.push("/login"); // Redirect to login if userId is missing
      return;
    }

    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/patient-profile-information/${userId}`
        );
        const user = response.data.patient;
        setProfile({
          information: {
            firstName: user.information?.firstName || "",
            lastName: user.information?.lastName || "",
            email: user.information?.email || "",
            phoneNumber: user.information?.phone || "",
            dateOfBirth: user.information?.dateOfBirth || "",
            gender: user.information?.gender || "", // Add gender field
          },
          address: {
            address: user.address?.address || "",
            city: user.address?.city || "",
            country: user.address?.country || "",
            pincode: user.address?.pincode || "",
          },
          profileImage: user?.profileImage || "",
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch profile data");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [history]);
  console.log("this is updated dob", profile);

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/svg+xml"];
      if (file.size > 100 * 1024) { // Check if file size is greater than 100KB
        alert("Image size must be under 100KB.");
        return;
      }
      if (!validTypes.includes(file.type)) {
        alert("Accepted image formats: jpg, png, svg.");
        return;
      }
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prevProfile) => ({
          ...prevProfile,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const getAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Handle form input changes for both personal and address fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if the name belongs to the address object
    if (name in profile.address) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        address: {
          ...prevProfile.address,
          [name]: value, // Update the address field
        },
      }));
    }
    // Check if the name belongs to the information object
    else if (name in profile.information) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        information: {
          ...prevProfile.information,
          [name]: value, // Update the information field
        },
      }));
    }
    // Handle other fields like bloodGroup
    else {
      setProfile((prevProfile) => ({
        ...prevProfile,
        [name]: value, // Update fields outside address and information
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    try {
      console.log("profile",profile);
      const response = await axios.put(`/api/update-patient-information/${userId}`, profile);
      console.log("response 11",response);
      if (response.status === 200) {
        alert("Profile updated successfully!");
        //history.push("/patient-dashboard");
      } else {
        setError("Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("An error occurred while updating profile.");
    }
  };
  
  

  // Basic form validation
  const validateForm = () => {
    const { firstName, lastName, email, phoneNumber, gender, dateOfBirth } = profile.information;
    const { country } = profile.address;
  
    let missingFields = [];
  
    if (!firstName) missingFields.push("First Name");
    if (!lastName)  missingFields.push("Last Name");
    if (!email)     missingFields.push("Email");
    if (!phoneNumber) missingFields.push("Phone Number");
    if (!gender)    missingFields.push("Gender");
    if (!country)    missingFields.push("Country");
    if (!dateOfBirth)    missingFields.push("dateOfBirth");
  
    if (missingFields.length > 0) {
      const message = `${missingFields.join(", ")} ${missingFields.length > 1 ? 'fields are' : 'field is'} required.`;
      setError(message);
      return false;
    }
  
    // Format validations
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^[0-9]{10}$/;
  
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
  
    if (!phonePattern.test(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number.");
      return false;
    }
  
    // If all good
    setError('');
    return true;
  };
  

  // Handle image removal
  const handleRemoveImage = () => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      profileImage: IMG01, // Reset to default image
    }));
  };

  // If still loading or error
//   if (loading) {
//     return (
//       <div className="loading">
//         <div className="spinner"></div> {/* Add a spinner for better UX */}
//         Loading...
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="error-message">{error}</div>;
//  }

  return (
    <div>
      <Header />
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Profile Settings</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/patient/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Profile Settings
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
              <form onSubmit={handleSubmit}>
                <div className="setting-card">
                  <div className="change-avatar img-upload">
                    <div className="profile-img">
                      <img
                        src={profile.profileImage}
                        alt="Profile"
                        className="rounded-circle"
                      />
                    </div>
                    <div className="upload-img">
                      <h5>Profile Image</h5>
                      <div className="imgs-load d-flex align-items-center">
                        <div className="change-photo">
                          Upload New
                          <input
                            type="file"
                            className="upload"
                            onChange={handleImageChange}
                          />
                        </div>
                        <Link
                          to="#"
                          onClick={handleRemoveImage}
                          className="upload-remove"
                        >
                          Remove
                        </Link>
                      </div>
                      <p className="form-text">
                        <em>Your image should be below 100KB. Accepted formats: JPG, PNG, SVG.</em>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="setting-title">
                  <h5>Information</h5>
                </div>
                <div className="setting-card">
                  <div className="row">
                    {/* Personal Info Fields */}
                    <div className="col-lg-4 col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">
                          First Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="firstName"
                          value={profile.information.firstName}
                          onChange={handleInputChange}
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
                          name="lastName"
                          value={profile.information.lastName}
                          onChange={handleInputChange}
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
                          name="gender"
                          value={profile.information.gender}
                          onChange={handleInputChange}
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
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          disabled
                          value={profile.information.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="col-lg-4 col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">
                          Phone Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="phoneNumber"
                          value={profile.information.phoneNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">Date of Birth<span className="text-danger">*</span></label>
                        <input
                          type="date"
                          className="form-control"
                          name="dateOfBirth"
                          value={profile.information.dateOfBirth ? profile.information.dateOfBirth.substring(0, 10) : ""} // Convert to date format (YYYY-MM-DD)
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">Age</label>
                        <input
                          type="text"
                          className="form-control"
                          name="age"
                          disabled
                          value={profile.information.dateOfBirth ? getAge(profile.information.dateOfBirth) : '0'} // Convert to date format (YYYY-MM-DD)
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    

                    {/* Address Fields */}
                    <div className="col-lg-4 col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">Address</label>
                        <input
                          type="text"
                          className="form-control"
                          name="address"
                          value={profile.address.address}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                   

                    {/* <div className="col-lg-4 col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">
                          State
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="state"
                          value={profile.address.state}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div> */}
                    <div className="col-lg-4 col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">Country<span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          name="country"
                          value={profile.address.country}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">Postcode</label>
                        <input
                          type="text"
                          className="form-control"
                          name="pincode"
                          value={profile.address.pincode}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                        <div className="alert alert-danger">{error}</div>
                )}

                <div className="form-group" style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button type="submit" className="btn" style={{ backgroundColor: "#008080", color: "#fff" }}>
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

export default Profile;
