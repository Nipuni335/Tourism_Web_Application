import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import './CategoryPage.css';

const CategoryPage = () => {
  const { category } = useParams();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlacesByCategory();
  }, [category]);

  const fetchPlacesByCategory = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/places/category/${category}`);
      setPlaces(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching places:', error);
      setLoading(false);
    }
  };

  const getCategoryIcon = (cat) => {
    const icons = {
      'sightseeing': '🏛️',
      'nature': '🌿',
      'religious sites': '🕉️',
      'historical': '🏰',
      'monuments': '🗿',
      'archaeological': '🏺',
      'lake': '🌊'
    };
    return icons[cat.toLowerCase()] || '📍';
  };

  if (loading) {
    return <div className="loading">Loading {category} places...</div>;
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <div className="category-icon-large">{getCategoryIcon(category)}</div>
        <h1>{category.charAt(0).toUpperCase() + category.slice(1)} Places</h1>
        <p>Discover the best {category} destinations within 25km radius</p>
      </div>

      {places.length === 0 ? (
        <div className="no-results">
          <h3>No places found in this category</h3>
          <Link to="/places" className="back-link">Browse all places</Link>
        </div>
      ) : (
        <div className="places-grid">
          {places.map(place => (
            <Link to={`/place/${place._id}`} key={place._id} className="place-card">
              <div className="card-image">
                <img src={place.images?.[0]?.url || 'https://via.placeholder.com/400x300'} alt={place.name} />
                {place.trending && <span className="trending-badge">🔥 Trending</span>}
              </div>
              <div className="card-content">
                <h3>{place.name}</h3>
                <p>{place.shortDescription || place.description.substring(0, 100)}...</p>
                <div className="card-meta">
                  <span><FaMapMarkerAlt /> {place.distance} km</span>
                  {place.bestTimeToVisit?.sunset && (
                    <span><FaClock /> Best at {place.bestTimeToVisit.sunset}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;