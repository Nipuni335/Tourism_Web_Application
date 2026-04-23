import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaMapMarkedAlt, FaSun, FaStar, FaCamera, FaClock, FaChevronRight, FaHeart, FaShare } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [featuredPlaces, setFeaturedPlaces] = useState([]);
  const [trendingPlaces, setTrendingPlaces] = useState([]);
  const [heroImages, setHeroImages] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    fetchData();
    // Auto-rotate hero images
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const fetchData = async () => {
    try {
      const [placesRes, trendingRes] = await Promise.all([
        axios.get('http://localhost:5000/api/places'),
        axios.get('http://localhost:5000/api/places?trending=true')
      ]);
      setFeaturedPlaces(placesRes.data.slice(0, 6));
      setTrendingPlaces(trendingRes.data);
      
      // Extract hero images from places
      const images = placesRes.data
        .filter(place => place.images && place.images.length > 0)
        .slice(0, 5)
        .map(place => ({
          url: place.images[0].url,
          name: place.name,
          caption: place.shortDescription || place.description.substring(0, 100)
        }));
      setHeroImages(images);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Use default images if API fails
      setHeroImages([
        { url: 'https://images.unsplash.com/photo-1532372320572-66c3e2d0a8e8', name: 'Sigiriya Lion Rock', caption: 'Ancient rock fortress' },
        { url: 'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1', name: 'Dambulla Cave Temple', caption: 'UNESCO World Heritage Site' }
      ]);
    }
  };

  const categoriesData = [
    { name: 'Historical', icon: '🏛️', color: '#FF6B6B', description: 'Ancient temples & monuments', image: 'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1' },
    { name: 'Nature', icon: '🌿', color: '#4ECDC4', description: 'Lakes, parks & scenic views', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e' },
    { name: 'Religious Sites', icon: '🕉️', color: '#FFE66D', description: 'Sacred sites & temples', image: 'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1' },
    { name: 'Sightseeing', icon: '📸', color: '#A8E6CF', description: 'Popular tourist spots', image: 'https://images.unsplash.com/photo-1532372320572-66c3e2d0a8e8' },
  ];

  return (
    <div className="home">
      {/* Hero Section with Image Slider */}
      <section className="hero-slider">
        {heroImages.length > 0 && (
          <div className="hero-slide" style={{ backgroundImage: `url(${heroImages[currentHeroIndex]?.url})` }}>
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <div className="hero-badge">Discover Sri Lanka</div>
              <h1 className="hero-title">Explore {heroImages[currentHeroIndex]?.name || 'Paradise'}</h1>
              <p className="hero-subtitle">{heroImages[currentHeroIndex]?.caption || 'Your visual guide to the most Instagram-worthy locations'}</p>
              <div className="hero-buttons">
                <Link to="/places" className="btn-primary">
                  Explore Now <FaChevronRight />
                </Link>
                <Link to="/itinerary" className="btn-secondary">
                  Plan Your Day <FaClock />
                </Link>
              </div>
            </div>
            <div className="hero-dots">
              {heroImages.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`dot ${currentHeroIndex === idx ? 'active' : ''}`}
                  onClick={() => setCurrentHeroIndex(idx)}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">25+</div>
            <div className="stat-label">Tourist Places</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10+</div>
            <div className="stat-label">Categories</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Photo Spots</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Happy Travelers</div>
          </div>
        </div>
      </section>

      {/* Categories Section with Images */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Explore by Category</h2>
          <p>Find the perfect destination based on your interest</p>
        </div>
        <div className="category-grid-modern">
          {categoriesData.map((category, index) => (
            <Link to={`/category/${category.name.toLowerCase()}`} key={index} className="category-card-modern">
              <div className="category-image-wrapper">
                <img src={category.image} alt={category.name} />
                <div className="category-overlay"></div>
                <div className="category-icon">{category.icon}</div>
              </div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Destinations */}
      {trendingPlaces.length > 0 && (
        <section className="trending-section">
          <div className="section-header">
            <div className="header-badge">
              <FaStar className="trending-star" /> Trending Now
            </div>
            <h2>Most Popular Destinations</h2>
            <p>Discover what everyone's talking about this week</p>
          </div>
          <div className="trending-grid">
            {trendingPlaces.slice(0, 4).map(place => (
              <Link to={`/place/${place._id}`} key={place._id} className="trending-card">
                <div className="trending-image">
                  <img src={place.images?.[0]?.url || 'https://via.placeholder.com/400x500'} alt={place.name} />
                  <div className="trending-rank">
                    #{trendingPlaces.findIndex(p => p._id === place._id) + 1}
                  </div>
                  <div className="trending-overlay">
                    <button className="heart-icon"><FaHeart /></button>
                    <button className="share-icon"><FaShare /></button>
                  </div>
                </div>
                <div className="trending-info">
                  <h3>{place.name}</h3>
                  <div className="trending-meta">
                    <span className="category">{place.category}</span>
                    <span className="distance"><FaMapMarkedAlt /> {place.distance}km</span>
                  </div>
                  <p>{place.shortDescription?.substring(0, 80) || place.description.substring(0, 80)}...</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="view-all">
            <Link to="/places" className="view-all-btn">
              View All Destinations <FaChevronRight />
            </Link>
          </div>
        </section>
      )}

      {/* Featured Places Grid */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Destinations</h2>
          <p>Handpicked places for your perfect getaway</p>
        </div>
        <div className="featured-grid">
          {featuredPlaces.map(place => (
            <Link to={`/place/${place._id}`} key={place._id} className="featured-card">
              <div className="featured-image">
                <img src={place.images?.[0]?.url || 'https://via.placeholder.com/400x300'} alt={place.name} />
                {place.trending && <span className="trending-badge">🔥 Trending</span>}
                <div className="image-overlay">
                  <FaCamera className="camera-icon" />
                </div>
              </div>
              <div className="featured-content">
                <h3>{place.name}</h3>
                <span className="category-tag">{place.category}</span>
                <p>{place.shortDescription || place.description.substring(0, 100)}...</p>
                <div className="featured-footer">
                  <span className="distance"><FaMapMarkedAlt /> {place.distance}km away</span>
                  <span className="explore-link">Explore →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Golden Hour Photography Section */}
      <section className="golden-hour-section">
        <div className="golden-hour-container">
          <div className="golden-hour-content">
            <div className="golden-badge">
              <FaSun className="golden-sun" /> Golden Hour
            </div>
            <h2>Capture the Perfect Shot</h2>
            <p>Visit during sunrise (6:00-7:00 AM) or sunset (5:30-6:30 PM) for the best lighting conditions and stunning photographs!</p>
            <div className="photography-tips">
              <div className="tip-card">
                <div className="tip-icon">🌅</div>
                <div className="tip-text">Sunrise at Sigiriya - Magical morning mist</div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🌇</div>
                <div className="tip-text">Sunset at Pidurangala - Panoramic views</div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">📸</div>
                <div className="tip-text">Golden reflections at Kandala Lake</div>
              </div>
            </div>
          </div>
          <div className="golden-hour-image">
            <img src="https://images.unsplash.com/photo-1414016642750-7fdd78dc33d9" alt="Golden Hour Photography" />
          </div>
        </div>
      </section>

      {/* Instagram Gallery Section */}
      <section className="instagram-section">
        <div className="section-header">
          <h2><FaCamera /> Instagram Worthy Spots</h2>
          <p>Most photogenic locations for your social media</p>
        </div>
        <div className="instagram-grid">
          {featuredPlaces.slice(0, 6).map(place => (
            <div key={place._id} className="instagram-item">
              <img src={place.images?.[0]?.url || 'https://via.placeholder.com/300'} alt={place.name} />
              <div className="instagram-overlay">
                <FaCamera />
                <span>{place.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-container">
          <h2>Get Travel Inspiration</h2>
          <p>Subscribe to receive updates about new destinations and photography tips</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;