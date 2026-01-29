import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../../assets/images/logo.png";
import camera from "../../../assets/images/icons/camera.svg"; // Optional, in case you want to use a default camera icon

const Registerstepone = () => {
  const [image, setImage] = useState(null);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [popup, setPopup] = useState({ type: "", message: "" });
  
  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setImage(savedImage);
      setIsImageSelected(true);
    }
  }, []);

  const convertToBase64 = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPopup({ type: '', message: '' });

      if (file.size > 100 * 1024) {
        setPopup({ type: 'error', message: 'File size must be below 100 KB' });
        e.target.value = ''; // Reset file input
        return;
      }

      setPopup({ type: 'info', message: 'Uploading...' });

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Image = reader.result;
        setImage(base64Image);
        localStorage.setItem('profileImage', base64Image);
        setIsImageSelected(true);
        setPopup({ type: 'info', message: 'Image uploaded successfully!' });
      };
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
                          <Link to="#" className="active">
                            1
                          </Link>
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
                            {/* Display selected image or fallback to camera icon */}
                            <img
                              src={image || camera} // Default camera icon if no image is selected
                              id="prof-avatar"
                              alt={image ? "Profile Picture" : "Upload Profile Picture"} // Improve accessibility
                              className="img-fluid"
                            />
                          </div>
                          <span>Upload Profile Picture</span>
                          <input
                            type="file"
                            id="profile_image"
                            name="profile_image"
                            onChange={convertToBase64} // Handle file selection
                            accept="image/*" // Ensure only images can be uploaded
                          />
                        </div>
                      </div>

                      {/* Render popup message */}
                      {popup.message && (
                        <div className={`popup-message ${popup.type}`}>
                          <p>{popup.message}</p>
                        </div>
                      )}

                      <div className="mt-5 d-flex flex-column gap-2">
                        <Link
                          to={isImageSelected ? "/register-step-2" : "#"}
                          className={`btn btn-primary w-100 btn-lg login-btn step1_submit ${!isImageSelected ? "disabled" : ""}`}
                          aria-disabled={!isImageSelected}
                          onClick={(e) => !isImageSelected && e.preventDefault()}
                        >
                          Continue
                        </Link>

                        {/* Skip button */}
                        <Link
                          to="/register-step-2"
                          className="btn btn-outline-secondary w-100 btn-lg login-btn"
                        >
                          Skip
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

export default Registerstepone;
