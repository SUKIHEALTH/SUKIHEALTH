/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const StatusChart = ({ patientsData, doctorsData }) => {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "line",
      stacked: false,
      height: "100%",
      width: "100%",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    series: [],
    xaxis: {
      categories: [],
    },
    colors: ["#1b5a90", "#ff9d00"],
    stroke: {
      width: 1,
      curve: "smooth",
    },
    markers: {
      size: 3,
    },
    grid: {
      show: true,
      borderColor: "#ebebeb",
      strokeDashArray: 2,
    },
    tooltip: {
      theme: "dark",
    },
  });
console.log('====================================');
console.log('this is ',patientsData);
console.log('====================================');
useEffect(() => {
  if (
    patientsData?.monthlyRegisteredPatients?.length > 0 &&
    doctorsData?.data?.length > 0
  ) {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const currentYear = new Date().getFullYear();

    // Prepare the series for doctors
    const doctorsSeries = {
      name: "Doctors",
      data: months.map((month, index) => {
        const count = doctorsData.data.filter((doc) => {
          const createdDate = new Date(doc.createdAt);
          if (!isNaN(createdDate.getTime())) { // Check for valid date
            const createdMonth = createdDate.getMonth();
            const createdYear = createdDate.getFullYear();
            return createdMonth === index && createdYear === currentYear;
          }
          return false; // If the date is invalid
        }).length || 0;
        return count;
      }),
    };

    // Prepare the series for patients using the monthlyRegisteredPatients data
    const patientsSeries = {
      name: "Patients",
      data: months.map((month, index) => {
        // Find the patient count for the current month
        const patientData = patientsData.monthlyRegisteredPatients.find(
          (monthlyData) => monthlyData.month === index + 1 && monthlyData.year === currentYear
        );
        return patientData ? patientData.registeredPatients : 0; // Default to 0 if no data found
      }),
    };

    // Debugging logs to check the series data
    console.log("Doctors Series Data:", doctorsSeries.data);
    console.log("Patients Series Data:", patientsSeries.data);

    // Update chart options with the series data
    setChartOptions((prevState) => ({
      ...prevState,
      series: [doctorsSeries, patientsSeries],
      xaxis: {
        categories: months,
      },
    }));
  }
}, [patientsData, doctorsData]);



  useEffect(() => {
    const handleResize = () => {
      if (window.ApexCharts && window.ApexCharts.mL) {
        // Automatically handle resizing with ApexCharts
        window.ApexCharts.mL.updateOptions({
          chart: {
            width: "100%",
          },
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [chartOptions]);

  return (
    <div>
      <ReactApexChart
        options={chartOptions}
        series={chartOptions.series}
        type="line"
        height="300"
      />
    </div>
  );
};

export default StatusChart;
