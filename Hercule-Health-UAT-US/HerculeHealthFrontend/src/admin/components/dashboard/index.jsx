import React, { useEffect, useState } from "react";
import SidebarNav from "../sidebar";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import DoctorListDesboard from "./DoctorList";
import PatientsListDesboard from "./PatientsList";
import AppointmentList from "./AppointmentList";
import LineChart from "./LineChart";
import StatusCharts from "./StatusCharts"; // Import StatusCharts
import axios from "../../../axiosConfig";
import Header from "../header";

const Dashboard = (props) => {
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);
  const [doctorsData, setDoctorsData] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [monthlyRegisteredPatients, setMonthlyRegisteredPatients] = useState(0);
  const [monthlyRegisteredConsultants, setMonthlyRegisteredConsultants] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetching data from the API
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const [doctorsResponse, patientsResponse, appointmentsResponse, revenueResponse] = await Promise.all([
          axios.post("/api/all-consultants"),
          axios.post("/api/all-patients"),
          axios.post(`/api/get-all-appointments`),
          axios.post(`/api/get-all-payments`),
        ]);

        // Set consultants data
        setDoctorsCount(doctorsResponse.data.totalConsultantsCount || 0);
        setDoctorsData(doctorsResponse.data);

        // Set patients data
        setPatientsCount(patientsResponse.data.totalPatients || 0);
        setPatientsData(patientsResponse.data);
        setMonthlyRegisteredPatients(patientsResponse.data.monthlyRegisteredPatients || 0);

        // Set appointments count
        setAppointmentsCount(appointmentsResponse.data?.totalCount || 0);

        // Set revenue data
        if (revenueResponse.data?.monthlyRevenue) {
          const formattedRevenue = revenueResponse.data.monthlyRevenue.map((record) => ({
            month: `${record.year}-${String(record.month).padStart(2, "0")}`,
            revenue: record.revenue,
          }));
          setRevenueData(formattedRevenue);
        } else {
          setRevenueData([]);
        }

        // Set monthly registered consultants
        setMonthlyRegisteredConsultants(doctorsResponse.data.monthlyRegisteredCount || 0);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, []); // Empty dependency array to only run once after the initial render

  const totalRevenue = revenueData.reduce((sum, r) => sum + r.revenue, 0);

  return (
    <>
      <Header {...props} />
      <div className="main-wrapper">
        <SidebarNav />

        <div className="page-wrapper">
          {/* The content will be visible immediately, but the loading spinner will cover it */}
          <div className={`content container-fluid pb-0 ${loading ? 'loading' : ''}`}>
            {/* Loading spinner */}
            {loading && (
              <div className="loading-overlay">
                <div className="spinner">Loading...</div> {/* Simple spinner */}
              </div>
            )}

            {/* Page header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <h3 className="page-title">Welcome Admin!</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item active">Dashboard</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Widgets Section */}
            <div className="row">
              {/* Doctors Widget */}
              <div className="col-xl-3 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon text-primary border-primary">
                        <i className="fe fe-users" />
                      </span>
                      <div className="dash-count">
                        <h3>{doctorsCount}</h3>
                      </div>
                    </div>
                    <div className="dash-widget-info">
                      <h6 className="text-muted">Consultants</h6>
                      <div className="progress progress-sm">
                        <div className="progress-bar bg-primary w-50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patients Widget */}
              <div className="col-xl-3 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon text-success">
                        <i className="fe fe-credit-card" />
                      </span>
                      <div className="dash-count">
                        <h3>{patientsCount}</h3>
                      </div>
                    </div>
                    <div className="dash-widget-info">
                      <h6 className="text-muted">Patients</h6>
                      <div className="progress progress-sm">
                        <div className="progress-bar bg-success w-50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointments Widget */}
              <div className="col-xl-3 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon text-danger border-danger">
                        <i className="fe fe-money" />
                      </span>
                      <div className="dash-count">
                        <h3>{appointmentsCount}</h3>
                      </div>
                    </div>
                    <div className="dash-widget-info">
                      <h6 className="text-muted">Appointments</h6>
                      <div className="progress progress-sm">
                        <div className="progress-bar bg-danger w-50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Widget */}
              <div className="col-xl-3 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon text-warning border-warning">
                        <i className="fe fe-folder" />
                      </span>
                      <div className="dash-count">
                        <h3>€{totalRevenue}</h3>
                      </div>
                    </div>
                    <div className="dash-widget-info">
                      <h6 className="text-muted">Revenue</h6>
                      <div className="progress progress-sm">
                        <div className="progress-bar bg-warning w-50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="row">
              {/* Revenue Chart */}
              <div className="col-md-12 col-lg-6">
                <div className="card card-chart">
                  <div className="card-header">
                    <h4 className="card-title">Revenue</h4>
                  </div>
                  <div className="card-body">
                    <LineChart chartData={revenueData} />
                  </div>
                </div>
              </div>

              {/* Status Chart */}
              <div className="col-md-12 col-lg-6">
                <div className="card card-chart">
                  <div className="card-header">
                    <h4 className="card-title">Status</h4>
                  </div>
                  <div className="card-body">
                    <StatusCharts 
                      patientsData={patientsData} 
                      doctorsData={doctorsData} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

