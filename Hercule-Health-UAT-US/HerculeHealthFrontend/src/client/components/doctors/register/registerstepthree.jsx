import React, { useEffect, useState } from "react";
import Logo from "../../../assets/images/logo.png";
import baseUrl from "../../../../config/config";
import { Link, useHistory } from "react-router-dom";

const Registerstepthree = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [Country] = useState([
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
  ]);;
  const [place, setPlace] = useState({ country: "", city: "" });

  const history = useHistory();

  // Load saved data from localStorage on component mount
  useEffect(() => {
    document.body.classList.add("account-page");

    // Load saved data from localStorage if available
    const savedData = JSON.parse(localStorage.getItem("formData"));
    if (savedData) {
      setPlace(savedData); // Prepopulate the form with saved data
    }

    return () => document.body.classList.remove("account-page");
  }, []);

  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlace((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the form has valid data
   

    let errors = [];
  
    if (!place.country ) errors.push("Country");
    if (!place.city) errors.push("City");
  
    if (errors.length > 0) {
      const message = `${errors.join(", ")} ${errors.length > 1 ? 'fields are' : 'field is'} required.`;
      setErrorMessage(message);
      return; // Stop here if errors found
    }

    setIsLoading(true); // Show loading spinner while making the request

    // Save form data to localStorage under "formData"
    const profileImage = localStorage.getItem("profileImage");
    const registrationData = JSON.parse(localStorage.getItem("formData")) || {};
    const information = JSON.parse(localStorage.getItem("registrationData"));

    const requestData = {
      profileImage,
      information,
      address: place.country, // Country
      city: place.city,       // City
      registrationData,
    };

    // Store merged data in localStorage
    console.log("Form Data: ", requestData);

    try {
      const response = await fetch(`${baseUrl}/api/consultant-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Response from API:", data);
        setSuccessMessage("Registration completed successfully!");

        // Show success message and redirect with a slight delay
        setTimeout(() => {
          localStorage.removeItem("formData");
          localStorage.removeItem("registrationData");
          localStorage.removeItem("profileImage");
          history.push("/login"); // Adjust the redirect path as necessary
        }, 1000);
      } else {
        const errorData = await response.json();
        console.error("Error from API:", errorData);
        setErrorMessage(errorData.message || "There was an error processing your request.");
      }
    } catch (error) {
      console.error("Error while making API request:", error);
      setErrorMessage("There was an error while submitting the form.");
    } finally {
      setIsLoading(false); // Hide loading indicator after the request
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
                          <Link to="#" className="active-done">
                            2
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="active">
                            3
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <h3 className="my-4">Your Location</h3>
                      <div className="form-group">
                        <label>Country<span className="text-danger"> *</span></label>
                        <select
                          className="form-select form-control"
                          id="country"
                          name="country"
                          value={place.country}
                          onChange={handleChange}
                        >
                          <option value="">Select Your Country</option>
                          {Country.map((country) => (
                            <option key={country.value} value={country.value}>
                              {country.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>City<span className="text-danger"> *</span></label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={place.city}
                          onChange={handleChange}
                          placeholder="Enter your city"
                        />
                      </div>

                      {errorMessage && (
                        <div className="alert alert-danger mt-3">{errorMessage}</div>
                      )}

                      {successMessage && (
                        <div className="alert alert-success mt-3">{successMessage}</div>
                      )}

                      <div className="mt-5">
                        <button
                          type="submit"
                          className="btn btn-primary w-100 btn-lg login-btn step5_submit"
                          disabled={isLoading} // Disable the button while loading
                        >
                          {isLoading ? "Saving..." : "Save"}
                        </button>
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

export default Registerstepthree;
