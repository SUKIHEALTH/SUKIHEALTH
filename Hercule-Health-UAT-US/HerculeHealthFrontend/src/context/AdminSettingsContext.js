import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../axiosConfig"
// Create the context
const AdminSettingsContext = createContext();

// Hook to access the context
export const useAdminSettings = () => {
  return useContext(AdminSettingsContext);
};

// Provider component
export const AdminSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null); // State for admin settings
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchAdminSettings = async () => {
      try {
        const response = await axios.get("/api/get-admin-settings"); // Replace with your API endpoint
        setSettings(response.data.setting); // Store settings in state
      } catch (err) {
        console.error("Failed to fetch admin settings:", err);
        setError(err);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchAdminSettings();
  }, []); // Empty dependency array ensures this runs only once

  // Context value
  const value = {
    settings,
    isLoading,
    error,
  };

  return (
    <AdminSettingsContext.Provider value={value}>
      {children}
    </AdminSettingsContext.Provider>
  );
};
