import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaCamera, FaUserShield } from 'react-icons/fa';
import AdminLogin from './AdminLogin';
import './Navbar.css';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const navigate = useNavigate();

  const getAdminInfo = () => {
    try {
      const data = localStorage.getItem('adminInfo');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  };

  const adminInfo = getAdminInfo();
  const isAdmin = !!adminInfo;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/places?search=${searchTerm}`);
      setSearchTerm('');
    }
  };

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <FaCamera className="logo-icon" />
            <span>
              Tourism<span className="highlight">Guide</span>
            </span>
          </Link>

          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/places" className="nav-link">All Places</Link>
            <Link to="/itinerary" className="nav-link">Plan Your Day</Link>
            {isAdmin && (
              <Link to="/admin" className="nav-link admin-link">
                Admin Panel
              </Link>
            )}
          </div>

          <div className="nav-right">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search places..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <FaSearch />
              </button>
            </form>

            <button onClick={handleAdminClick} className="admin-btn" type="button">
              <FaUserShield />
              {isAdmin ? 'Admin' : 'Login'}
            </button>

            {isAdmin && (
              <button onClick={handleLogout} className="logout-btn" type="button">
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {showAdminLogin && (
        <AdminLogin onClose={() => setShowAdminLogin(false)} />
      )}
    </>
  );
};

export default Navbar;