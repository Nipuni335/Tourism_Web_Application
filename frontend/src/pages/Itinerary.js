import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaMapMarkerAlt, FaClock, FaSave } from 'react-icons/fa';
import './Itinerary.css';

const Itinerary = () => {
  const [itinerary, setItinerary] = useState([]);
  const [places, setPlaces] = useState([]);
  const [suggestedItineraries, setSuggestedItineraries] = useState([]);

  useEffect(() => {
    loadItinerary();
    fetchPlaces();
    fetchSuggestedItineraries();
  }, []);

  const loadItinerary = () => {
    const saved = JSON.parse(localStorage.getItem('itinerary') || '[]');
    setItinerary(saved);
  };

  const fetchPlaces = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/places');
      setPlaces(response.data);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const fetchSuggestedItineraries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/itineraries');
      setSuggestedItineraries(response.data);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
      // Fallback suggestions
      setSuggestedItineraries([
        { _id: '1', name: 'Cultural Heritage Trail', places: ['Sigiriya Lion Rock', 'Dambulla Cave Temple', 'Pidurangala Rock'] },
        { _id: '2', name: 'Nature & Photography Tour', places: ['Namal Uyana', 'Kaludiya Pokuna', 'Kandala Lake'] },
        { _id: '3', name: 'Sunrise to Sunset', places: ['Pidurangala Rock', 'Sigiriya Lion Rock', 'Kandala Lake'] }
      ]);
    }
  };

  const removeFromItinerary = (id) => {
    const updated = itinerary.filter(item => item.id !== id);
    localStorage.setItem('itinerary', JSON.stringify(updated));
    setItinerary(updated);
  };

  const clearItinerary = () => {
    localStorage.removeItem('itinerary');
    setItinerary([]);
  };

  const getPlaceDetails = (placeId) => {
    return places.find(p => p._id === placeId);
  };

  // Fixed: Changed from useTemplate to handleUseTemplate (not a hook)
  const handleUseTemplate = (template) => {
    const newItinerary = template.places.map((placeName, idx) => {
      const place = places.find(p => p.name === placeName);
      if (place) {
        return { id: place._id, name: place.name, order: idx + 1 };
      }
      return null;
    }).filter(p => p);
    
    localStorage.setItem('itinerary', JSON.stringify(newItinerary));
    setItinerary(newItinerary);
  };

  const savePlan = () => {
    alert('Your itinerary has been saved! You can view it anytime.');
  };

  return (
    <div className="itinerary-page">
      <div className="page-header">
        <h1>Plan Your One-Day Trip</h1>
        <p>Create your personalized itinerary or use our templates</p>
      </div>

      <div className="itinerary-layout">
        {/* Suggested Templates */}
        <div className="suggestions-section">
          <h2>✨ Suggested Itineraries</h2>
          <div className="templates-grid">
            {suggestedItineraries.map((template) => (
              <div key={template._id} className="template-card">
                <h3>{template.name}</h3>
                <ul>
                  {template.places.map((place, i) => (
                    <li key={i}>{place}</li>
                  ))}
                </ul>
                <button onClick={() => handleUseTemplate(template)} className="use-template">
                  Use This Template
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* User's Itinerary */}
        <div className="my-itinerary">
          <div className="itinerary-header">
            <h2>📅 My One-Day Plan</h2>
            {itinerary.length > 0 && (
              <button onClick={clearItinerary} className="clear-btn">
                <FaTrash /> Clear All
              </button>
            )}
          </div>

          {itinerary.length === 0 ? (
            <div className="empty-itinerary">
              <p>Your itinerary is empty. Add places from the <a href="/places">Places page</a> or use a template above!</p>
            </div>
          ) : (
            <div className="itinerary-list">
              {itinerary.sort((a, b) => a.order - b.order).map((item, index) => {
                const place = getPlaceDetails(item.id);
                if (!place) return null;
                
                return (
                  <div key={item.id} className="itinerary-item">
                    <div className="item-order">{index + 1}</div>
                    <div className="item-content">
                      <h3>{place.name}</h3>
                      <div className="item-meta">
                        <span><FaMapMarkerAlt /> {place.distance} km</span>
                        <span><FaClock /> Suggested: {index === 0 ? 'Morning (8:00 AM)' : index === itinerary.length - 1 ? 'Evening (4:00 PM)' : 'Mid-day'}</span>
                      </div>
                    </div>
                    <button onClick={() => removeFromItinerary(item.id)} className="remove-btn">
                      <FaTrash />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {itinerary.length > 0 && (
            <div className="itinerary-summary">
              <h3>Your Day Summary</h3>
              <p>Total places: {itinerary.length}</p>
              <p>Suggested start time: 8:00 AM</p>
              <p>Estimated duration: {itinerary.length * 2} hours</p>
              <button onClick={savePlan} className="save-plan-btn">
                <FaSave /> Save This Plan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Itinerary;