import React, { useEffect, useState } from "react";
import Header from "../../header";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath";
import Footer from "../../footer";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import axios from "../../../../axiosConfig";
import DoctorFooter from "../../common/doctorFooter";
const DoctorProfileTwo = (props) => {
  const userId = useParams(); // Get userId from the URL parameters
  // const userId=Number(userIdofDoctor)
  const [userProfile, setUserProfile] = useState(null); // Store the fetched profile
  const [loading, setLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(null); // Handle error state

  useEffect(() => {
    const FetchDoctorProfile = async () => {
      try {
        // Fetch data using the userId (converted to number)
        const response = await axios.get(
          `/api/consultant-profile-information/${Number(userId.id)}`
        );
        console.log("response.data.consultant",response.data.consultant);
        setUserProfile(response.data.consultant);
         // Save the fetched profile to state
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        setError("Error fetching doctor profile"); // Handle error if fetch fails
        setLoading(false); // Set loading to false even in case of error
      }
    };

    if (userId) {
      FetchDoctorProfile(); // Fetch profile if userId exists
    }
  }, [userId]); // Dependency array: re-run effect when userId changes
  console.log("this is dr userid", userId.id, "this is the data", userProfile);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  if (error) {
    return <div>{error}</div>; // Show error message if there's an issue fetching data
  }

  const ourlog = {
    loop: true,
    margin: 24,
    dots: false,
    nav: true,
    smartSpeed: 2000,
    navContainer: ".slide-1",
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      500: {
        items: 1,
      },
      768: {
        items: 2,
      },
      1200: {
        items: 6,
      },
      1300: {
        items: 6,
      },
    },
  };

  const ourslot = {
    loop: true,
    margin: 24,
    dots: false,
    nav: true,
    smartSpeed: 2000,
    navContainer: ".slide-2",
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      500: {
        items: 1,
      },
      768: {
        items: 2,
      },
      1200: {
        items: 6,
      },
      1300: {
        items: 7,
      },
    },
  };
  const ouraward = {
    loop: true,
    margin: 24,
    dots: false,
    nav: true,
    smartSpeed: 2000,
    navContainer: ".slide-3",
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      500: {
        items: 1,
      },
      768: {
        items: 2,
      },
      1200: {
        items: 4,
      },
      1300: {
        items: 4,
      },
    },
  };
  const filterFutureSlots = (slots) => {
    const currentDate = new Date();

    // Filter out past slots
    return slots.filter((slot) => new Date(slot.time) > currentDate);
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const filteredSlots = userProfile?.availableSlots
    ? filterFutureSlots(userProfile.availableSlots)
    : [];
  const formatDate = (isoDate) => {
    try {
      if (!isoDate) return { date: "N/A", time: "N/A" };

      const date = new Date(isoDate);
      if (isNaN(date.getTime())) return { date: "N/A", time: "N/A" };

      const formattedDate = date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const formattedTime = date.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return {
        date: formattedDate,
        time: formattedTime,
      };
    } catch (error) {
      console.error("Error formatting date:", error);
      return { date: "N/A", time: "N/A" };
    }
  };
console.log('this is doctordata',userProfile)
  return (
    <>
      <div className="main-wrapper">
        <Header {...props} />
        <div className="breadcrumb-bar-two">
          <div className="container">
            <div className="row align-items-center inner-banner">
              <div className="col-md-12 col-12 text-center">
                <h2 className="breadcrumb-title">Doctor Profile</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/patient/dashboard">Home</Link>
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
        <>
          {/* Page Content */}
          <div className="content">
            <div className="container">
              {/* Doctor Widget */}
              <div className="card doc-profile-card">
                <div className="card-body">
                  <div className="doctor-widget doctor-profile-two">
                    <div className="doc-info-left">
                      <div className="doctor-img">
                        <img
                          src={userProfile.profileImage ? userProfile.profileImage : "/assets/images/doctor-thumb-01.png"}
                          className="img-fluid"
                          alt="User Image"
                        />
                      </div>
                      <div className="doc-info-cont">
                        <span className="badge doc-avail-badge">
                          <i className="fa-solid fa-circle" />
                          Available{" "}
                        </span>
                        <h4 className="doc-name">
                          {userProfile?.information?.displayName}{" "}
                          <ImageWithBasePath
                            src="assets/img/icons/badge-check.svg"
                            alt="Img"
                          />
                        </h4>
                        <p>{userProfile?.information?.designation}</p>
                        <p>
                          Speaks :{" "}
                          {userProfile?.information?.knownLanguages?.join(", ")}
                        </p>
                        <p className="address-detail">
                          {(userProfile?.information?.city || userProfile?.information?.location) && (
                            <>
                              <span className="loc-icon">
                                <i className="feather-map-pin" />
                              </span>
                              {userProfile?.information?.city ? `${userProfile.information.city}` : ""}
                              {userProfile?.information?.city && userProfile?.information?.location ? ", " : ""}
                              {userProfile?.information?.location || ""}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="doc-info-right">
                      <ul className="doctors-activities">
                        <li>
                          <h5 className="accept-text">
                            <span>
                              <i className="feather-check" />
                            </span>
                            Accepting New Patients
                          </h5>
                        </li>
                        <li>
                          <ul className="contact-doctors">
                            <li>
                              <a href={`/patient/patient-chat/${userProfile.userId}`}>
                                <span>
                                  <ImageWithBasePath
                                    src="assets/img/icons/device-message2.svg"
                                    alt="Img"
                                  />
                                </span>
                                Chat
                              </a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="doc-profile-card-bottom">
                    <div className="bottom-book-btn">
                      <div className="clinic-booking">
                        <a className="apt-btn" href={`/patient/booking1/${userProfile.userId}`}>
                          Book Appointment
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Doctor Widget */}
              <div className="doctors-detailed-info">
                <ul className="information-title-list d-flex justify-content-between">
                  <li>
                    <a href="#clinic-details">Clinic Details</a>
                  </li>
                  <li>
                    <a href="#experience">Experience</a>
                  </li>
                  <li>
                    <a href="#availability">Education</a>
                  </li>
                  <li>
                    <a href="#awards">Awards</a>
                  </li>

                </ul>
                <div className="doc-information-main">
                <div className="doc-information-details mt-4" id="clinic-details">
                  <div className="detail-title">
                    <h4>Clinic Details</h4>
                  </div>

                  {userProfile?.clinicalDetails ? (
                    <div className="card p-3 border-0 rounded-3">
                      <div className="d-flex align-items-center mb-2">
                        <span className="badge bg-primary me-2">
                          {userProfile.clinicalDetails.isRegistered ? "Registered Clinic" : "Unregistered Clinic"}
                        </span>
                        <h5 className="mb-0">{userProfile.clinicalDetails.clinicName || "Clinic name not provided"}</h5>
                      </div>

                      <ul className="list-unstyled mb-0">
                        {userProfile.clinicalDetails.clinicalAddress && (
                          <li className="mb-1">
                            <strong>Address:</strong> {userProfile.clinicalDetails.clinicalAddress}
                          </li>
                        )}
                        {userProfile.clinicalDetails.postcode && (
                          <li>
                            <strong>Postcode:</strong> {userProfile.clinicalDetails.postcode}
                          </li>
                        )}
                      </ul>
                    </div>
                  ) : (
                    <p>No clinic details available.</p>
                  )}
                </div>

                  <div className="doc-information-details" id="clicnic-details">
                    <div className="detail-title">
                      <h4>Practice Experience</h4>
                    </div>
                    {Array.isArray(userProfile?.experience) && userProfile.experience.length > 0 ? (
  <div className="row gy-3">
    {userProfile.experience.map((item, index) => (
      <div key={index} className="col-md-6">
        <div className="card shadow-sm border rounded-3 h-100">
          <div className="card-body">
            <h5 className="card-title mb-3">
              <i className="bi bi-hospital me-2 text-primary"></i>
              {item?.hospitalName || "Unnamed Hospital"}
            </h5>

            <ul className="list-unstyled mb-3">
              {item?.yearsOfExperience && (
                <li className="mb-1">
                  <i className="bi bi-clock me-2 text-secondary"></i>
                  {item.yearsOfExperience} {item.yearsOfExperience === 1 ? "year" : "years"} of experience
                </li>
              )}
              {item?.location && (
                <li className="mb-1">
                  <i className="bi bi-geo-alt me-2 text-danger"></i>
                  {item.location}
                </li>
              )}
            </ul>

            {item?.startDate && (
              <p className="text-muted small mb-2">
                <i className="bi bi-calendar-event me-2 text-success"></i>
                {`${new Date(item.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })} - `}
                {item.isCurrentlyWorking
                  ? "Currently working here"
                  : item.endDate
                  ? new Date(item.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
                  : "No end date"}
              </p>
            )}

            {item?.jobDescription && (
              <p className="mb-0">{item.jobDescription}</p>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
) : (
  <p>No practice experience available.</p>
)}



                  </div>

                  <div className="doc-information-details" id="availability">
                    <div className="detail-title slider-nav d-flex justify-content-between align-items-center">
                      <h4>Education</h4>
                      <div className="nav nav-container slide-2" />
                    </div>

                    {Array.isArray(userProfile?.educations) && userProfile.educations.length > 0 ? (
  <div className="row g-3">
    {userProfile.educations.map((item, index) => (
      <div key={index} className="col-12 col-md-6 col-lg-4">
        <div className="border rounded p-3 h-100 shadow-sm">
          <h5 className="mb-3">
            <i className="bi bi-mortarboard-fill text-primary me-2"></i>
            {item?.nameOfInstitution || "Institution Name"}
          </h5>

          {item?.course && (
            <p className="mb-1">
              <i className="bi bi-journal-text me-2 text-secondary"></i>
              <strong>Course:</strong> {item.course}
            </p>
          )}

          {(item?.startDate || item?.endDate) && (
            <p className="mb-1">
              <i className="bi bi-calendar-event me-2 text-secondary"></i>
              <strong>Duration:</strong>{" "}
              {item.startDate 
                ? `${new Date(item.startDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'short' })}`
                : ""}
              {item.endDate 
                ? ` - ${new Date(item.endDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'short' })}`
                : " - Present"}
            </p>
          )}

          {item?.description && (
            <p className="mb-0">
              <strong></strong> {item.description}
            </p>
          )}
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="alert alert-info">No education details provided</div>
)}


                  </div>

                  {/* <div className="doc-information-details" id="availability">
            <div className="detail-title slider-nav d-flex justify-content-between align-items-center">
              <h4>Availability</h4>
              <div className="nav nav-container slide-2" />
            </div>
            <OwlCarousel {...ourslot} className="availability-slots-slider owl-carousel">
              <div className="availability-date">
                <div className="book-date">
                  <h6>Wed Feb 2024</h6>
                  <span>01:00 - 02:00 PM</span>
                </div>
              </div>
              <div className="availability-date">
                <div className="book-date">
                  <h6>Wed Feb 2024</h6>
                  <span>01:00 - 02:00 PM</span>
                </div>
              </div>
              <div className="availability-date">
                <div className="book-date">
                  <h6>Wed Feb 2024</h6>
                  <span>01:00 - 02:00 PM</span>
                </div>
              </div>
              <div className="availability-date">
                <div className="book-date">
                  <h6>Wed Feb 2024</h6>
                  <span>01:00 - 02:00 PM</span>
                </div>
              </div>
              <div className="availability-date">
                <div className="book-date">
                  <h6>Wed Feb 2024</h6>
                  <span>01:00 - 02:00 PM</span>
                </div>
              </div>
              <div className="availability-date">
                <div className="book-date">
                  <h6>Wed Feb 2024</h6>
                  <span>01:00 - 02:00 PM</span>
                </div>
              </div>
              <div className="availability-date">
                <div className="book-date">
                  <h6>Wed Feb 2024</h6>
                  <span>01:00 - 02:00 PM</span>
                </div>
              </div>
              <div className="availability-date">
                <div className="book-date">
                  <h6>Wed Feb 2024</h6>
                  <span>01:00 - 02:00 PM</span>
                </div>
              </div>
            </OwlCarousel>
          </div> */}
            <div className="doc-information-details" id="awards">
              <div className="detail-title slider-nav d-flex justify-content-between align-items-center">
                <h4>Awards</h4>
                <div className="nav nav-container slide-3" />
              </div>

              {Array.isArray(userProfile.awards) && userProfile.awards.length > 0 ? (
  (() => {
    // Deduplicate awards by awardName + year
    const uniqueAwards = Array.from(
      new Map(
        userProfile.awards.map(item => [`${item.awardName}-${item.year}`, item])
      ).values()
    );

    return uniqueAwards.length === 1 ? (
      <div className="award-card">
        <div className="award-card-info">
          <span>
            <ImageWithBasePath src={uniqueAwards[0].icon || "assets/img/icons/bookmark-star.svg"} alt="Img" />
          </span>
          <h5>{uniqueAwards[0].awardName} ({uniqueAwards[0].year})</h5>
          <p>{uniqueAwards[0].description}</p>
        </div>
      </div>
    ) : (
      <div className="row">
      {uniqueAwards.map((award, index) => (
        <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
          <div className="award-card h-100">
            <div className="award-card-info">
              <span>
                <ImageWithBasePath src={award.icon || "assets/img/icons/bookmark-star.svg"} alt="Img" />
              </span>
              <h5>{award.awardName} ({award.year})</h5>
              <p>{award.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
    
    );
  })()
) : (
  <p>No awards available.</p>
)}

              </div></div>

              </div>
            </div>
          </div>
          {/* /Page Content */}
        </>

        <DoctorFooter {...props} />
      </div>
    </>
  );
};

export default DoctorProfileTwo;
