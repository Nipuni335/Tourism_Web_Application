import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminPanel from '../components/AdminPanel';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin()) {
    window.location.href = '/';
    return null;
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-container">
        <AdminPanel />
      </div>
    </div>
  );
};

export default AdminDashboard;