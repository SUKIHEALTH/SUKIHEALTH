import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // To access cookies
import { useHistory } from 'react-router-dom';

const AuthContext = createContext();


export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessType, setAccessType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory()

  useEffect(() => {
    const token = Cookies.get('authToken'); // Get the auth token from cookies
    const storedAccessType = Cookies.get('accessType');
console.log("token",token)
if (token && storedAccessType) {
  setUser(token);
  setAccessType(storedAccessType);
}

    setIsLoading(false); // Stop loading once the check is done
  }, []);

  const login = () => {
    setUser(true); // This just updates the authenticated state
    console.log("working")
    console.log("hihi",Cookies.get('authToken'))
    const token = Cookies.get('authToken');
    const storedAccessType = Cookies.get('accessType');

    if (token && storedAccessType) {
      setUser(token);
      setAccessType(storedAccessType);
    }
  };

  const logout = () => {
    Cookies.remove('authToken');
    Cookies.remove('accessType');
    setUser(null);
    setAccessType(null);
    history.push('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    accessType,
    login,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
