import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>🌍 TourismGuide</h3>
          <p>Your visual guide to the most Instagram-worthy locations within 25km radius. Discover, plan, and capture beautiful moments.</p>
          <div className="social-links">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/places">All Places</Link></li>
            <li><Link to="/itinerary">Plan Your Day</Link></li>
            <li><Link to="/categories">Categories</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/category/historical">Historical Sites</Link></li>
            <li><Link to="/category/nature">Nature & Parks</Link></li>
            <li><Link to="/category/religious sites">Religious Sites</Link></li>
            <li><Link to="/category/sightseeing">Sightseeing</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Info</h4>
          <ul className="contact-info">
            <li><FaMapMarkerAlt /> Dambulla, Sri Lanka</li>
            <li><FaPhone /> +94 123 456 789</li>
            <li><FaEnvelope /> info@tourismguide.com</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="stats">
          <div className="stat">
            <span className="stat-number">25+</span>
            <span className="stat-label">Tourist Places</span>
          </div>
          <div className="stat">
            <span className="stat-number">10+</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat">
            <span className="stat-number">50+</span>
            <span className="stat-label">Photo Spots</span>
          </div>
          <div className="stat">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Happy Travelers</span>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; 2024 TourismGuide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;