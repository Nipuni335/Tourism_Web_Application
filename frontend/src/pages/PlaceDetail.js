import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaClock, FaMapMarkerAlt, FaCamera, FaSun, FaMoon, FaDollarSign, FaUserCheck } from 'react-icons/fa';
import './PlaceDetail.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const PlaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchPlace();
  }, [id]);

  const fetchPlace = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/places/${id}`);
      setPlace(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching place:', error);
      setLoading(false);
    }
  };

  const addToItinerary = () => {
    const itinerary = JSON.parse(localStorage.getItem('itinerary') || '[]');
    if (!itinerary.find(p => p.id === id)) {
      itinerary.push({ id: id, name: place.name, order: itinerary.length + 1 });
      localStorage.setItem('itinerary', JSON.stringify(itinerary));
      alert(`${place.name} added to your itinerary!`);
    } else {
      alert('This place is already in your itinerary');
    }
  };

  if (loading) return <div className="loading">Loading place details...</div>;
  if (!place) return <div className="error">Place not found</div>;

  return (
    <div className="place-detail">
      <div className="detail-container">
        {/* Image Gallery */}
        <div className="gallery-section">
          <div className="main-image">
            <img 
              src={place.images?.[selectedImage]?.url || 'https://via.placeholder.com/800x500'} 
              alt={place.name}
            />
          </div>
          {place.images && place.images.length > 1 && (
            <div className="thumbnail-gallery">
              {place.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`${place.name} ${idx + 1}`}
                  className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Place Information */}
        <div className="info-section">
          <h1>{place.name}</h1>
          <div className="category-tag-large">{place.category}</div>
          
          <div className="quick-info">
            <div className="info-card">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <strong>Distance</strong>
                <p>{place.distance} km from center</p>
              </div>
            </div>
            {place.bestTimeToVisit && (
              <div className="info-card">
                <FaSun className="info-icon" />
                <div>
                  <strong>Best Time to Visit</strong>
                  <p>{place.bestTimeToVisit.general || 'Sunrise/Sunset'}</p>
                </div>
              </div>
            )}
            {place.entryFee && (
              <div className="info-card">
                <FaDollarSign className="info-icon" />
                <div>
                  <strong>Entry Fee</strong>
                  <p>Local: LKR {place.entryFee.local} | Foreign: LKR {place.entryFee.foreign}</p>
                </div>
              </div>
            )}
          </div>

          <div className="description">
            <h3>About this place</h3>
            <p>{place.description}</p>
          </div>

          {place.visitingHours && (
            <div className="visiting-hours">
              <h3><FaClock /> Visiting Hours</h3>
              <p>{place.visitingHours.open} - {place.visitingHours.close}</p>
              <p>Open days: {place.visitingHours.days?.join(', ')}</p>
            </div>
          )}

          {place.dressCode?.required && (
            <div className="dress-code">
              <h3><FaUserCheck /> Dress Code</h3>
              <p>{place.dressCode.description || 'Modest dress required. Cover shoulders and knees.'}</p>
              <div className="dress-icons">
                <span>👕 Long sleeves</span>
                <span>👖 Long pants/skirt</span>
              </div>
            </div>
          )}

          <button className="add-to-itinerary" onClick={addToItinerary}>
            + Add to My Itinerary
          </button>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <h3>Location Map</h3>
          <MapContainer 
            center={[place.location.lat, place.location.lng]} 
            zoom={13} 
            style={{ height: '400px', width: '100%', borderRadius: '15px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[place.location.lat, place.location.lng]}>
              <Popup>{place.name}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Photography Tips */}
        <div className="photography-tips">
          <h3><FaCamera /> Photography Tips</h3>
          <div className="tips-list">
            {place.bestTimeToVisit?.sunrise && (
              <div className="tip-item">
                <FaSun className="tip-icon sunrise" />
                <span>Best lighting: Sunrise around {place.bestTimeToVisit.sunrise}</span>
              </div>
            )}
            {place.bestTimeToVisit?.sunset && (
              <div className="tip-item">
                <FaMoon className="tip-icon sunset" />
                <span>Golden hour: Sunset around {place.bestTimeToVisit.sunset}</span>
              </div>
            )}
            <div className="tip-item">
              <FaCamera className="tip-icon" />
              <span>Recommended gear: Wide-angle lens for landscapes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail;