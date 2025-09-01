import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logo.png";
import male from "../../assets/images/icons/male.png";
import female from "../../assets/images/icons/female.png";
import { Select } from "antd";
import { Link, useHistory  } from "react-router-dom";

const Patientregistersteptwo = () => {
  // const [selectedTags, setSelectedTags] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [gender, setGender] = useState("");
  const [pregnant, setPregnant] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [dob, setDob] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");  // For error messages
  const history = useHistory(); // For navigation (optional)
  // const [bloodPressure, setBloodPressure] = useState("");

  // Check if any data is saved in localStorage
  useEffect(() => {
    const savedData = JSON.parse(
      localStorage.getItem("registrationStepTwoData")
    );
    if (savedData) {
      setGender(savedData.gender);
      setPregnant(savedData.pregnant);
      setWeight(savedData.weight);
      setHeight(savedData.height);
      setDob(savedData.dateOfBirth);
      // setBloodPressure(savedData.bloodPressure);
      // setSelectedTags(savedData.selectedTags || []);
    }
  }, []);

  // Save data to localStorage whenever any field changes
  useEffect(() => {
    const registrationData = {
      gender,
      pregnant,
      weight,
      height,
      dateOfBirth: dob,
      // bloodPressure,
      // selectedTags,
    };
    localStorage.setItem(
      "registrationStepTwoData",
      JSON.stringify(registrationData)
    );
  }, [gender, pregnant, weight, height, dob]);

  const options = [
    { value: "pollen", label: "Pollen" },
    { value: "dust", label: "Dust Mites" },
    { value: "mold", label: "Mold" },
    { value: "pet_dander", label: "Pet Dander" },
    { value: "peanuts", label: "Peanuts" },
    { value: "tree_nuts", label: "Tree Nuts" },
    { value: "milk", label: "Milk" },
    { value: "eggs", label: "Eggs" },
    { value: "fish", label: "Fish" },
    { value: "shellfish", label: "Shellfish" },
  ];

  const handleDropdownVisibleChange = (open) => {
    setDropdownOpen(open); // Update dropdown open state
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setSelectedTags(value);
    // Automatically close the dropdown after selection
    setDropdownOpen(false);
  };

  // Validate that required fields are filled before allowing the user to continue
  const isFormValid = async (e) => {
    e.preventDefault(); // Prevent default form submit
  
    let errors = [];
  
    if (!gender) errors.push("Gender");
    if (!weight) errors.push("Weight");
    if (!height) errors.push("Height");
    if (!dob) errors.push("Date of birth");
  
    if (errors.length > 0) {
      const message = `${errors.join(", ")} ${errors.length > 1 ? 'fields are' : 'field is'} required.`;
      setErrorMessage(message);
      return; // Stop here if errors found
    }
  
    // If all fields are valid
    setErrorMessage('');
    history.push("/patient/patientregisterstep-5");
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
                          <Link to="#" className="active">
                            2
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="">
                            3
                          </Link>
                        </li>
                      </ul>
                    </div>
                   
                    <form id="personal_details" encType="multipart/form-data" onSubmit={isFormValid}>
                      <div className="text-start mt-2">
                        <h4 className="mt-3">Select Your Gender<span className="text-danger"> *</span></h4>
                      </div>
                      <div className="select-gender-col">
                        <div className="row">
                          <div className="col-6 pe-0">
                            <input
                              type="radio"
                              id="test1"
                              name="gender"
                              checked={gender === "Male"}
                              onChange={() => setGender("Male")}
                            />
                            <label htmlFor="test1">
                              <span className="gender-icon">
                                <img src={male} alt="Male Icon" />
                              </span>
                              <span>Male</span>
                            </label>
                          </div>
                          <div className="col-6 ps-2">
                            <input
                              type="radio"
                              id="test2"
                              name="gender"
                              checked={gender === "Female"}
                              onChange={() => setGender("Female")}
                            />
                            <label htmlFor="test2">
                              <span className="gender-icon">
                                <img src={female} alt="Female Icon" />
                              </span>
                              <span>Female</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="pregnant-col pt-4 ">
                        {gender === "Female" && (
                          <div>
                            <div className="remember-me-col d-flex justify-content-between">
                              <span className="mt-1">Are you Pregnant</span>
                              <label className="custom_check">
                                <input
                                  type="checkbox"
                                  className=""
                                  checked={pregnant}
                                  onChange={() => setPregnant(!pregnant)}
                                  name="pregnant"
                                  id="is_registered"
                                />
                                <span className="checkmark" />
                              </label>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Other Fields */}
                      <div className="form-group mt-3">
                        <label>Your Weight<span className="text-danger"> *</span></label>
                        <input
                          type="number"
                          className="form-control"
                          name="weight"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          placeholder="00 kg"
                          id="weightage"
                        />
                      </div>

                      <div className="form-group">
                        <label>Your Height<span className="text-danger"> *</span></label>
                        <div className="row">
                          <div className="col-7 pe-0">
                            <input
                              type="number"
                              className="form-control"
                              id="height"
                              value={height}
                              onChange={(e) => setHeight(e.target.value)}
                              placeholder="Height"
                            />
                          </div>
                          <div className="col-5 ps-2">
                            <select
                              className="form-select form-control"
                              id="height_unit"
                              name="height_unit"
                            >
                              <option value="cm">cm</option>
                              <option value="ft">ft</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Your Date of Birth<span className="text-danger"> *</span></label>
                        <input
                          type="date"
                          name="dob"
                          className="form-control"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          id="dob_"
                          placeholder="00 years old"
                        />
                      </div>

                      {/* <div className="form-group">
                        <label>Blood Pressure</label>
                        <input
                          className="form-control"
                          id="bp"
                          name="bp"
                          value={bloodPressure}
                          onChange={(e) => setBloodPressure(e.target.value)}
                          placeholder="00 mmhg"
                        />
                      </div> */}

                      {/* <div className="form-group">
                        <label>Allergies</label>
                        <Select
                          mode="tags"
                          style={{ width: "100%", height: "40px" }}
                          placeholder="Allergies"
                          onChange={handleChange}
                          options={options}
                          value={selectedTags}
                          onBlur={() => setDropdownOpen(false)}
                          getPopupContainer={(trigger) => trigger.parentNode}
                          open={dropdownOpen}
                          onDropdownVisibleChange={handleDropdownVisibleChange}
                        />
                      </div> */}
                      {errorMessage && (
                        <div className="alert alert-danger">{errorMessage}</div>
                      )}
                      <div className="mt-5">
                        <button
                        type="submit"
                          to="/patient/patientregisterstep-5"
                          className="btn btn-primary w-100 btn-lg login-btn step3_submit"
                          
                        >
                          Continue
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

export default Patientregistersteptwo;
