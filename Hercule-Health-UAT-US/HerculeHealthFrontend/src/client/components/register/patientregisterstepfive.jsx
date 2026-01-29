import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logo.png";
import { Link, useHistory } from "react-router-dom";
import baseUrl from "../../../config/config"; // Import baseUrl for the API
import { Spin } from "antd"; // Ant Design loading spinner component

const PatientRegisterStepFive = () => {
  const [country, setCountry] = useState([]); // States for country
  const [states, setStates] = useState([]); // States for states
  const [selectedCountry, setSelectedCountry] = useState(""); // Selected city
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState(""); // Error message
  const [successMessage, setSuccessMessage] = useState(""); // Success message

  const history = useHistory(); // To handle redirection after success

  // Fetch country and states dynamically (Replace with actual API calls in production)
  useEffect(() => {
    // You can replace these with API calls to fetch dynamic country and states
    setCountry([
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
    
  }, []);

  const handleCityChange = (e) => setSelectedCountry(e.target.value); // Handle city change
  const handleStateChange = (e) => setSelectedState(e.target.value); // Handle state change

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent form default behavior

    let errors = [];
  
    if (!selectedCountry) errors.push("Country");
  
    if (errors.length > 0) {
      const message = `${errors.join(", ")} ${errors.length > 1 ? 'fields are' : 'field is'} required.`;
      setErrorMessage(message);
      return; // Stop here if errors found
    }

    // Validate that both city and state are selected
    if (selectedCountry) {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      // Retrieve previously stored data from localStorage
      const profileImage = localStorage.getItem("profileImage"); // Retrieve profileImage from localStorage
      const information = JSON.parse(localStorage.getItem("registrationData")); // Retrieve registrationData from localStorage
      const healthData = JSON.parse(localStorage.getItem("registrationStepTwoData")); // Retrieve registrationStepTwoData from localStorage
      const address= selectedCountry
      console.log(`this is image ${profileImage}`);
   
      // Check if all required data exists
      if ( !information || !healthData) {
        setErrorMessage("Required data from previous steps is missing.");
        setIsLoading(false);
        return;
      }

      // Combine the data from localStorage and form data (selected city and state)
      const requestData = {
        profileImage, // Add profileImage from localStorage
        information, // Add registrationData from localStorage
        healthData, // Add registrationStepTwoData from localStorage
          address,
      };
      console.log("this step2",requestData);
      

      try {
        // Make the API call to save patient data
        const response = await fetch(`${baseUrl}/api/patient-register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Response from API:", data);
          setSuccessMessage("Registration completed successfully!");

          // Show success message and redirect with a slight delay
          setTimeout(() => {
            localStorage.removeItem("profileImage");
            localStorage.removeItem("registrationData");
            localStorage.removeItem("registrationStepTwoData");
            history.push("/login"); // Adjust the redirect path as necessary
          }, 1000); // 1 seconds delay
        } else {
          const errorData = await response.json();
          console.error("Error from API:", errorData);
          setErrorMessage(errorData.message || "There was an error processing your request.");
        }
      } catch (error) {
        console.error("Error while making API request:", error);
        setErrorMessage("There was an error while submitting the form.");
      } finally {
        setIsLoading(false); // Hide loading indicator
      }
    } 
  };

  return (
    <>
      <div className="content login-page pt-0">
        <div className="container-fluid">
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
                          <Link to="#" className="active-done">1</Link>
                        </li>
                        <li>
                          <Link to="#" className="active-done">2</Link>
                        </li>
                        <li>
                          <Link to="#" className="active">3</Link>
                        </li>
                      </ul>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleFormSubmit}>
                      {/* <h3 className="my-4">Your Country</h3> */}

                      <div className="form-group">
                        <label>Country<span className="text-danger"> *</span></label>
                        <select
                          className="form-select form-control"
                          value={selectedCountry}
                          onChange={handleCityChange}
                        >
                          <option value="">Select Your Country</option>
                          {country.map((city) => (
                            <option key={city.value} value={city.value}>
                              {city.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* <div className="form-group">
                        <label>Select State</label>
                        <select
                          className="form-select form-control"
                          value={selectedState}
                          onChange={handleStateChange}
                        >
                          <option value="">Select Your State</option>
                          {states.map((state) => (
                            <option key={state.value} value={state.value}>
                              {state.label}
                            </option>
                          ))}
                        </select>
                      </div> */}

                      {/* Submit button with loading state */}
                      
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                      <div className="mt-5">
                        <button
                          type="submit"
                          className="btn btn-primary w-100 btn-lg login-btn"
                          disabled={isLoading} // Disable the button while loading
                        >
                          {isLoading ? (
                            <Spin size="small" /> // Spinner displayed during loading
                          ) : (
                            "Submit"
                          )}
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
        </div>
      </div>
    </>
  );
};

export default PatientRegisterStepFive;
