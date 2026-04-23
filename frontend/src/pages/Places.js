import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaFilter } from 'react-icons/fa';
import './Places.css';

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchPlaces();
    fetchCategories();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      handleSearch(search);
    }
  }, [location.search]);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/places');
      setPlaces(response.data);
      setFilteredPlaces(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching places:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === '') {
      setFilteredPlaces(places);
    } else {
      setFilteredPlaces(places.filter(place => place.category === category));
    }
  };

  const handleSearch = (searchTerm) => {
    const filtered = places.filter(place => 
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlaces(filtered);
  };

  if (loading) {
    return <div className="loading">Loading amazing places...</div>;
  }

  return (
    <div className="places-page">
      <div className="page-header">
        <h1>Discover Tourist Places</h1>
        <p>Explore the most beautiful destinations within 25km radius</p>
      </div>

      <div className="filter-section">
        <div className="filter-header">
          <FaFilter className="filter-icon" />
          <span>Filter by Category</span>
        </div>
        <div className="category-filters">
          <button 
            className={`filter-btn ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('')}
          >
            All
          </button>
          {['Sightseeing', 'Restaurants', 'Monuments', 'Religious Sites', 'Nature', 'Historical', 'Archaeological', 'Lake'].map(category => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="places-container">
        {filteredPlaces.length === 0 ? (
          <div className="no-results">
            <h3>No places found</h3>
            <p>Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="places-grid">
            {filteredPlaces.map(place => (
              <Link to={`/place/${place._id}`} key={place._id} className="place-card-large">
                <div className="card-image">
                  <img src={place.images?.[0]?.url || 'https://via.placeholder.com/400x300'} alt={place.name} />
                  {place.trending && <span className="trending-badge">🔥 Trending</span>}
                </div>
                <div className="card-details">
                  <h3>{place.name}</h3>
                  <span className="category-badge">{place.category}</span>
                  <p>{place.shortDescription || place.description.substring(0, 120)}...</p>
                  <div className="place-info">
                    <span><FaMapMarkerAlt /> {place.distance} km from center</span>
                    {place.bestTimeToVisit?.sunset && (
                      <span><FaClock /> Best at {place.bestTimeToVisit.sunset}</span>
                    )}
                  </div>
                  <div className="learn-more">Learn More →</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Places;