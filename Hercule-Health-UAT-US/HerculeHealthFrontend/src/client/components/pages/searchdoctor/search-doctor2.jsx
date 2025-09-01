import React, { useState, useEffect } from "react";
import Header from "../../header";
import StickyBox from "react-sticky-box";
import DoctorFooter from "../../common/doctorFooter/index.jsx";
import { Link } from "react-router-dom";
import Doctors from "./doctors";  // Child Component

const SearchDoctor2 = (props) => {
  const [searchTerm, setSearchTerm] = useState(""); // For search input
  const [selectedExperience, setSelectedExperience] = useState(""); // For experience filter
  const [selectedLanguage, setSelectedLanguage] = useState(""); // For language filter
  const [selectedGender, setSelectedGender] = useState({ male: false, female: false }); // For gender filter

  // Handler for search term change
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // Handler for gender filter change
  const handleGenderChange = (e) => {
    const { value, checked } = e.target;
    setSelectedGender((prev) => ({
      ...prev,
      [value]: checked,
    }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedExperience("");
    setSelectedLanguage("");
    setSelectedGender({ male: false, female: false });
  };

  return (
    <div className="main-wrapper">
      <Header {...props} />

      {/* Breadcrumb */}
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Search Doctors</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/patient/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Search Doctors
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}

      <div className="doctor-content content">
        <div className="container">
          <div className="row">
            <div className="col-xl-12 col-lg-12 map-view">
              <div className="row">
                <div className="col-lg-3 theiaStickySidebar">
                  <StickyBox offsetTop={20} offsetBottom={20}>
                    <div>
                      <div className="filter-contents">
                        <div className="filter-header">
                          <h4 className="filter-title">Filter</h4>
                        </div>

                        {/* Gender Filter */}
                        <div className="filter-details">
                          <div className="filter-grid">
                            <h4>
                              <Link to="#collapseone" data-bs-toggle="collapse">
                                Gender
                              </Link>
                            </h4>
                            <div id="collapseone" className="collapse show">
                              <div className="filter-collapse">
                                <ul>
                                  <li>
                                    <label className="custom_check d-inline-flex">
                                      <input
                                        type="checkbox"
                                        value="male"
                                        checked={selectedGender.male}
                                        onChange={handleGenderChange}
                                      />
                                      <span className="checkmark" />
                                      Male
                                    </label>
                                  </li>
                                  <li>
                                    <label className="custom_check d-inline-flex">
                                      <input
                                        type="checkbox"
                                        value="female"
                                        checked={selectedGender.female}
                                        onChange={handleGenderChange}
                                      />
                                      <span className="checkmark" />
                                      Female
                                    </label>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Experience Filter */}
                        <div className="filter-details">
                          <div className="filter-grid">
                            <h4>
                              <Link to="#collapsefive" data-bs-toggle="collapse">
                                Experience
                              </Link>
                            </h4>
                            <div id="collapsefive" className="collapse show">
                              <div className="filter-collapse">
                                <ul>
                                  <li>
                                    <label className="custom_check d-inline-flex">
                                      <input
                                        type="checkbox"
                                        name="experience"
                                        checked={selectedExperience === "1-5"}
                                        onChange={() => setSelectedExperience("1-5")}
                                      />
                                      <span className="checkmark" />
                                      1-5 Years
                                    </label>
                                  </li>
                                  <li>
                                    <label className="custom_check d-inline-flex">
                                      <input
                                        type="checkbox"
                                        name="experience"
                                        checked={selectedExperience === "5+"}
                                        onChange={() => setSelectedExperience("5+")}
                                      />
                                      <span className="checkmark" />
                                      5+ Years
                                    </label>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Languages Filter */}
                        <div className="filter-details">
                          <div className="filter-grid">
                            <h4>
                              <Link to="#collapseeight" data-bs-toggle="collapse">
                                Languages
                              </Link>
                            </h4>
                            <div id="collapseeight" className="collapse show">
                              <div className="filter-collapse">
                                <ul>
                                  <li>
                                    <label className="custom_check d-inline-flex">
                                      <input
                                        type="checkbox"
                                        name="language"
                                        checked={selectedLanguage === "English"}
                                        onChange={() => setSelectedLanguage("English")}
                                      />
                                      <span className="checkmark" />
                                      English
                                    </label>
                                  </li>
                                  <li>
                                    <label className="custom_check d-inline-flex">
                                      <input
                                        type="checkbox"
                                        name="language"
                                        checked={selectedLanguage === "French"}
                                        onChange={() => setSelectedLanguage("French")}
                                      />
                                      <span className="checkmark" />
                                      French
                                    </label>
                                  </li>
                                  <li>
                                    <label className="custom_check d-inline-flex">
                                      <input
                                        type="checkbox"
                                        name="language"
                                        checked={selectedLanguage === "Spanish"}
                                        onChange={() => setSelectedLanguage("Spanish")}
                                      />
                                      <span className="checkmark" />
                                      Spanish
                                    </label>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Apply and Reset Buttons */}
                      <div className="filter-btn apply-btn">
                        <div className="row">
                          {/* <div className="col-6">
                            <Link to="#" className="btn btn-primary">
                              Apply
                            </Link>
                          </div> */}
                          <div className="col-6">
                            <Link
                              to="#"
                              className="btn btn-outline-primary"
                              onClick={handleResetFilters}
                            >
                              Reset
                            </Link>
                          </div>
                        </div>
                      </div>
                      {/* /Apply and Reset Buttons */}
                    </div>
                  </StickyBox>
                </div>

                <div className="col-lg-9">
                  <div className="input-block dash-search-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <span className="search-icon">
                      <i className="fa-solid fa-magnifying-glass" />
                    </span>
                  </div>
                  <br />
                  {/* Pass the filters and search term as props to the Doctors component */}
                  <Doctors
                    searchTerm={searchTerm}
                    gender={selectedGender}
                    experience={selectedExperience}
                    languages={selectedLanguage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DoctorFooter {...props} />
    </div>
  );
};

export default SearchDoctor2;

// import React, { useEffect, useState, useCallback } from "react";
// import Header from "../../header";
// import StickyBox from "react-sticky-box";
// import Doctors from "./doctors";
// import Footer from "../../footer";
// import { Link } from "react-router-dom";

// const SearchDoctor2 = (props) => {
//   const [minValue, setMinValue] = useState(10);
//   const [maxValue, setMaxValue] = useState(5000);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [gender, setGender] = useState([]);
//   const [experience, setExperience] = useState([]);
//   const [languages, setLanguages] = useState([]);

//   const [childData, setChildData] = useState(null); // State to receive data from child

//   useEffect(() => {
//     if (document.getElementById("price-range")) {
//       setMinValue(10);
//       setMaxValue(10000);

//       const slider = document.getElementById("price-range");
//       slider.addEventListener("input", handleSliderChange);

//       return () => {
//         slider.removeEventListener("input", handleSliderChange);
//       };
//     }
//   }, []);

//   const handleSliderChange = (event) => {
//     const min = parseInt(event.target.value.split(",")[0]);
//     const max = parseInt(event.target.value.split(",")[1]);

//     setMinValue(min);
//     setMaxValue(max);
//   };

//   // Memoize the onDataChange callback to prevent unnecessary re-renders
//   const handleChildData = useCallback((data) => {
//     setChildData(data);
//     console.log("Data received from child:", data);
//   }, []);

//   // Handle filter changes
//   const handleGenderChange = (e) => {
//     const value = e.target.checked ? e.target.value : null;
//     setGender((prev) =>
//       value ? [...prev, value] : prev.filter((item) => item !== value)
//     );
//   };

//   const handleExperienceChange = (e) => {
//     const value = e.target.checked ? e.target.value : null;
//     setExperience((prev) =>
//       value ? [...prev, value] : prev.filter((item) => item !== value)
//     );
//   };

//   const handleLanguageChange = (e) => {
//     const value = e.target.checked ? e.target.value : null;
//     setLanguages((prev) =>
//       value ? [...prev, value] : prev.filter((item) => item !== value)
//     );
//   };

//   return (
//     <div className="main-wrapper">
//       <Header {...props} />

//       {/* Breadcrumb */}
//       <div className="breadcrumb-bar-two">
//         <div className="container">
//           <div className="row align-items-center inner-banner">
//             <div className="col-md-12 col-12 text-center">
//               <h2 className="breadcrumb-title">Search Doctors</h2>
//               <nav aria-label="breadcrumb" className="page-breadcrumb">
//                 <ol className="breadcrumb">
//                   <li className="breadcrumb-item">
//                     <Link to="#">Home</Link>
//                   </li>
//                   <li className="breadcrumb-item" aria-current="page">
//                     Search Doctors
//                   </li>
//                 </ol>
//               </nav>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* /Breadcrumb */}

//       <div className="doctor-content content">
//         <div className="container">
//           <div className="row">
//             <div className="col-xl-12 col-lg-12 map-view">
//               <div className="row">
//                 <div className="col-lg-3  theiaStickySidebar">
//                   <StickyBox offsetTop={20} offsetBottom={20}>
//                     <div>
//                       <div className="filter-contents">
//                         <div className="filter-header">
//                           <h4 className="filter-title">Filter</h4>
//                         </div>
//                         <div className="filter-details">
//                           {/* Gender Filter */}
//                           <div className="filter-grid">
//                             <h4>
//                               <Link to="#collapseone" data-bs-toggle="collapse">
//                                 Gender
//                               </Link>
//                             </h4>
//                             <div id="collapseone" className="collapse show">
//                               <div className="filter-collapse">
//                                 <ul>
//                                   <li>
//                                     <label className="custom_check d-inline-flex">
//                                       <input
//                                         type="checkbox"
//                                         value="male"
//                                         onChange={handleGenderChange}
//                                       />
//                                       <span className="checkmark" />
//                                       Male
//                                     </label>
//                                   </li>
//                                   <li>
//                                     <label className="custom_check d-inline-flex">
//                                       <input
//                                         type="checkbox"
//                                         value="female"
//                                         onChange={handleGenderChange}
//                                       />
//                                       <span className="checkmark" />
//                                       Female
//                                     </label>
//                                   </li>
//                                 </ul>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Experience Filter */}
//                           <div className="filter-grid">
//                             <h4>
//                               <Link
//                                 to="#collapsefive"
//                                 data-bs-toggle="collapse"
//                               >
//                                 Experience
//                               </Link>
//                             </h4>
//                             <div id="collapsefive" className=" collapse show">
//                               <div className="filter-collapse">
//                                 <ul>
//                                   <li>
//                                     <label className="custom_check d-inline-flex">
//                                       <input
//                                         type="checkbox"
//                                         value="1-5"
//                                         onChange={handleExperienceChange}
//                                       />
//                                       <span className="checkmark" />
//                                       1-5 Years
//                                     </label>
//                                   </li>
//                                   <li>
//                                     <label className="custom_check d-inline-flex">
//                                       <input
//                                         type="checkbox"
//                                         value="5+"
//                                         onChange={handleExperienceChange}
//                                       />
//                                       <span className="checkmark" />
//                                       5+ Years
//                                     </label>
//                                   </li>
//                                 </ul>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Languages Filter */}
//                           <div className="filter-grid">
//                             <h4>
//                               <Link to="#collapseeight" data-bs-toggle="collapse">
//                                 Languages
//                               </Link>
//                             </h4>
//                             <div id="collapseeight" className="collapse show">
//                               <div className="filter-collapse">
//                                 <ul>
//                                   <li>
//                                     <label className="custom_check d-inline-flex">
//                                       <input
//                                         type="checkbox"
//                                         value="English"
//                                         onChange={handleLanguageChange}
//                                       />
//                                       <span className="checkmark" />
//                                       English
//                                     </label>
//                                   </li>
//                                   <li>
//                                     <label className="custom_check d-inline-flex">
//                                       <input
//                                         type="checkbox"
//                                         value="French"
//                                         onChange={handleLanguageChange}
//                                       />
//                                       <span className="checkmark" />
//                                       French
//                                     </label>
//                                   </li>
//                                 </ul>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </StickyBox>
//                 </div>

//                 <div className="col-lg-9">
//                   <div className="input-block dash-search-input">
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Search"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                     <span className="search-icon">
//                       <i className="fa-solid fa-magnifying-glass" />
//                     </span>
//                   </div>
//                   <br />
//                   {/* Pass the callback function and filters to the child */}
//                   <Doctors
//                     onDataChange={handleChildData}
//                     searchTerm={searchTerm}
//                     gender={gender}
//                     experience={experience}
//                     languages={languages}
//                     minValue={minValue}
//                     maxValue={maxValue}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer {...props} />
//     </div>
//   );
// };

// export default SearchDoctor2;
