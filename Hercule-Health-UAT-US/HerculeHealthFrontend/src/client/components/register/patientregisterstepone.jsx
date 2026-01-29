import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logo.png";
import camera from "../../assets/images/icons/camera.svg";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Patientregisterstepone = () => {
  const [image, setImage] = useState(null);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [popup, setPopup] = useState(null);

  // Check if there's a saved profile image in localStorage on component mount
  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setImage(savedImage);
      setIsImageSelected(true);
    }
  }, []);

  const convertToBase64 = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024) { // 100KB = 100 * 1024 bytes
        setPopup({ type: 'error', message: 'File size must be below 100 KB' });
        e.target.value = ''; // Reset the file input field
        return;
      }

      setPopup({ type: 'info', message: 'Uploading...' });
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Image = reader.result;
        setImage(base64Image);
        // const imageKey = uuidv4(); // Generate a unique UUID for the image
        // localStorage.setItem(imageKey, base64Image); // Store the image URL with the unique key
        localStorage.setItem("profileImage", base64Image); // Store the base64 image in localStorage
        // localStorage.setItem("profileImageKey", imageKey); // Store the UUID key in localStorage for referencing
        setIsImageSelected(true);
        setPopup({ type: 'info', message: 'Image uploaded successfully!' });
      };
    }
  };

  // Clear the selected image
  const clearImage = () => {
    setImage(null);
    setIsImageSelected(false);
    localStorage.removeItem("profileImage");
    // localStorage.removeItem("profileImageKey");
    setPopup({ type: 'info', message: 'Image cleared.' });
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
                          <Link to="#" className="active">1</Link>
                        </li>
                        <li>
                          <Link to="#">2</Link>
                        </li>
                        <li>
                          <Link to="#">3</Link>
                        </li>
                      </ul>
                    </div>
                    <form id="profile_pic_form" encType="multipart/form-data">
                      <div className="profile-pic-col">
                        <h3>Profile Picture</h3>
                        <div className="profile-pic-upload">
                          <div className="cam-col">
                            {/* Display the uploaded image if available */}
                            <img
                              src={image || camera} // If there's an image, show it; otherwise, show the default camera icon
                              id="prof-avatar"
                              alt="Profile"
                              className="img-fluid"
                            />
                          </div>
                          <span>Upload Profile Picture</span>
                          <input
                            type="file"
                            id="profile_image"
                            name="profile_image"
                            onChange={convertToBase64}
                            accept="image/*"
                          />
                        </div>
                      </div>

                      {/* Popup message for error/info */}
                      {popup && (
                        <div className={`popup-message ${popup.type}`}>
                          {popup.message}
                        </div>
                      )}

                      {/* Clear Image Button */}
                      {isImageSelected && (
                        <button
                          type="button"
                          onClick={clearImage}
                          className="btn btn-secondary mt-3"
                        >
                          Clear Image
                        </button>
                      )}

                      <div className="mt-5">
                        {/* Disable the continue button if no image is selected */}
                        <Link
                          to={isImageSelected ? "/patient/patientregisterstep-2" : "#"}
                          className={`btn btn-primary w-100 btn-lg login-btn step1_submit ${!isImageSelected ? "disabled" : ""}`}
                        >
                          Continue
                        </Link>
                      </div>
                      <div className="mt-3 text-center">
                        <Link
                          to="/patient/patientregisterstep-2"
                          className="btn btn-link text-muted"
                        >
                          Skip for now
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

export default Patientregisterstepone;
