import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  useEffect(() => {
    if (token) {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
      setAdmin(adminInfo);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        email,
        password
      });
      
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminInfo', JSON.stringify(response.data));
      setToken(response.data.token);
      setAdmin(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    setToken(null);
    setAdmin(null);
  };

  const isAdmin = () => {
    return !!admin;
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAdmin, token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};