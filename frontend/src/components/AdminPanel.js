import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FaEdit, FaTrash, FaPlus, FaUpload, FaTimes, FaImage } from 'react-icons/fa';
import './AdminPanel.css';

const AdminPanel = () => {
  const [places, setPlaces] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: 'Historical',
    distance: '',
    description: '',
    shortDescription: '',
    location: { lat: '', lng: '' },
    address: '',
    images: [],
    bestTimeToVisit: { sunrise: '', sunset: '', general: '' },
    trending: false
  });

  const { token } = useAuth();

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('http://localhost:5000/api/admin/places', config);
      setPlaces(response.data);
    } catch (error) {
      console.error('Error fetching places:', error);
      setMessage('Failed to load places');
    }
  };

  // Image upload handler
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    setMessage('');

    for (const file of files) {
      const formDataImg = new FormData();
      formDataImg.append('image', file);

      try {
        const response = await axios.post('http://localhost:5000/api/upload', formDataImg, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, { 
            url: response.data.url, 
            caption: file.name, 
            isPrimary: prev.images.length === 0 
          }]
        }));
        setMessage('✅ Image uploaded successfully');
      } catch (error) {
        console.error('Error uploading image:', error);
        setMessage('❌ Failed to upload image');
      }
    }
    setUploading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  // Remove image
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Set primary image
  const setPrimaryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validate required fields
    if (!formData.name || !formData.category || !formData.distance || 
        !formData.description || !formData.address || 
        !formData.location.lat || !formData.location.lng) {
      setMessage('Please fill all required fields');
      setLoading(false);
      return;
    }

    try {
      const config = { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      };
      
      const placeData = {
        name: formData.name,
        category: formData.category,
        distance: parseFloat(formData.distance),
        description: formData.description,
        shortDescription: formData.shortDescription || '',
        location: {
          lat: parseFloat(formData.location.lat),
          lng: parseFloat(formData.location.lng)
        },
        address: formData.address,
        images: formData.images,
        bestTimeToVisit: {
          sunrise: formData.bestTimeToVisit.sunrise || '',
          sunset: formData.bestTimeToVisit.sunset || '',
          general: formData.bestTimeToVisit.general || ''
        },
        trending: formData.trending
      };

      if (editingPlace) {
        await axios.put(`http://localhost:5000/api/admin/places/${editingPlace._id}`, placeData, config);
        setMessage('✅ Place updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/admin/places', placeData, config);
        setMessage('✅ Place created successfully!');
      }
      
      resetForm();
      fetchPlaces();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving place:', error);
      setMessage('❌ Error saving place: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (place) => {
    setEditingPlace(place);
    setFormData({
      name: place.name,
      category: place.category,
      distance: place.distance,
      description: place.description,
      shortDescription: place.shortDescription || '',
      location: place.location,
      address: place.address,
      images: place.images || [],
      bestTimeToVisit: place.bestTimeToVisit || { sunrise: '', sunset: '', general: '' },
      trending: place.trending || false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`http://localhost:5000/api/admin/places/${id}`, config);
        fetchPlaces();
        setMessage('✅ Place deleted successfully');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting place:', error);
        setMessage('❌ Error deleting place');
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingPlace(null);
    setFormData({
      name: '',
      category: 'Historical',
      distance: '',
      description: '',
      shortDescription: '',
      location: { lat: '', lng: '' },
      address: '',
      images: [],
      bestTimeToVisit: { sunrise: '', sunset: '', general: '' },
      trending: false
    });
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Panel - Manage Places</h2>
        <button className="btn-add" onClick={() => setShowForm(true)}>
          <FaPlus /> Add New Place
        </button>
      </div>

      {message && (
        <div className={message.includes('✅') ? 'success-message' : 'error-message'}>
          {message}
        </div>
      )}

      {showForm && (
        <div className="form-modal">
          <div className="form-container">
            <h3>{editingPlace ? 'Edit Place' : 'Add New Place'}</h3>
            <button className="close-form" onClick={resetForm}>×</button>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Place Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="Historical">Historical</option>
                  <option value="Nature">Nature</option>
                  <option value="Religious Sites">Religious Sites</option>
                  <option value="Sightseeing">Sightseeing</option>
                  <option value="Monuments">Monuments</option>
                  <option value="Archaeological">Archaeological</option>
                  <option value="Lake">Lake</option>
                </select>
                <input
                  type="number"
                  placeholder="Distance (km) *"
                  value={formData.distance}
                  onChange={(e) => setFormData({...formData, distance: e.target.value})}
                  required
                />
              </div>

              <textarea
                placeholder="Short Description (max 200 chars)"
                maxLength="200"
                value={formData.shortDescription}
                onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                rows="2"
              />

              <textarea
                placeholder="Full Description *"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                rows="4"
              />

              {/* IMAGE UPLOAD SECTION */}
              <div className="image-upload-section">
                <label className="upload-btn">
                  <FaUpload /> Upload Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                {uploading && <p className="uploading-text">Uploading images...</p>}
                
                <div className="image-preview-grid">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="image-preview-item">
                      <img src={`http://localhost:5000${img.url}`} alt={img.caption} />
                      <div className="image-actions-overlay">
                        <button 
                          type="button" 
                          onClick={() => setPrimaryImage(idx)} 
                          className={img.isPrimary ? 'primary-active' : ''}
                        >
                          {img.isPrimary ? '★ Primary' : '☆ Set Primary'}
                        </button>
                        <button type="button" onClick={() => removeImage(idx)} className="remove-image-btn">
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {formData.images.length === 0 && !uploading && (
                  <p className="no-images-text">No images uploaded. Click "Upload Images" to add photos.</p>
                )}
              </div>

              <div className="form-row">
                <input
                  type="text"
                  placeholder="Address *"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <input
                  type="text"
                  placeholder="Latitude * (e.g., 7.9569)"
                  value={formData.location.lat}
                  onChange={(e) => setFormData({...formData, location: {...formData.location, lat: e.target.value}})}
                  required
                />
                <input
                  type="text"
                  placeholder="Longitude * (e.g., 80.7598)"
                  value={formData.location.lng}
                  onChange={(e) => setFormData({...formData, location: {...formData.location, lng: e.target.value}})}
                  required
                />
              </div>

              <h4>Best Time to Visit</h4>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Sunrise Time (e.g., 6:00 AM)"
                  value={formData.bestTimeToVisit.sunrise}
                  onChange={(e) => setFormData({...formData, bestTimeToVisit: {...formData.bestTimeToVisit, sunrise: e.target.value}})}
                />
                <input
                  type="text"
                  placeholder="Sunset Time (e.g., 6:00 PM)"
                  value={formData.bestTimeToVisit.sunset}
                  onChange={(e) => setFormData({...formData, bestTimeToVisit: {...formData.bestTimeToVisit, sunset: e.target.value}})}
                />
              </div>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.trending}
                  onChange={(e) => setFormData({...formData, trending: e.target.checked})}
                />
                Mark as Trending
              </label>

              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingPlace ? 'Update' : 'Create')}
                </button>
                <button type="button" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="places-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Distance</th>
              <th>Trending</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {places.length === 0 ? (
              <tr>
                <td colSpan="6" style={{textAlign: 'center'}}>No places found. Click "Add New Place" to create one.</td>
              </tr>
            ) : (
              places.map(place => (
                <tr key={place._id}>
                  <td>
                    {place.images && place.images[0] ? (
                      <img 
                        src={`http://localhost:5000${place.images[0].url}`} 
                        alt={place.name} 
                        className="table-image" 
                      />
                    ) : (
                      <div className="no-image"><FaImage /></div>
                    )}
                  </td>
                  <td><strong>{place.name}</strong></td>
                  <td><span className="category-badge">{place.category}</span></td>
                  <td>{place.distance} km</td>
                  <td>{place.trending ? '🔥 Yes' : 'No'}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(place)} className="edit-btn">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(place._id)} className="delete-btn">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;