import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminPlaces.css';

const BACKEND_URL = 'http://localhost:5000';

const AdminPlaces = () => {
  const navigate = useNavigate();

  const emptyForm = {
    name: '',
    category: '',
    distance: '',
    description: '',
    shortDescription: '',
    address: '',
    lat: '',
    lng: '',
    trending: false
  };

  const [places, setPlaces] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const getAdminHeaders = () => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      return adminInfo?.token
        ? { Authorization: `Bearer ${adminInfo.token}` }
        : {};
    } catch (error) {
      return {};
    }
  };

  const fetchPlaces = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/admin/places`, {
        headers: getAdminHeaders()
      });
      setPlaces(res.data);
    } catch (error) {
      console.error('Error fetching admin places:', error);
    }
  };

  const getImageUrl = (place) => {
    if (!place.images || place.images.length === 0) {
      return 'https://via.placeholder.com/120';
    }

    const firstImage = place.images[0];

    if (firstImage?.url) {
      return firstImage.url.startsWith('/')
        ? `${BACKEND_URL}${firstImage.url}`
        : `${BACKEND_URL}/${firstImage.url}`;
    }

    return 'https://via.placeholder.com/120';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setImageFile(null);
    setEditingId(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (place) => {
    setFormData({
      name: place.name || '',
      category: place.category || '',
      distance: place.distance || '',
      description: place.description || '',
      shortDescription: place.shortDescription || '',
      address: place.address || '',
      lat: place.location?.lat || '',
      lng: place.location?.lng || '',
      trending: !!place.trending
    });

    setImageFile(null);
    setEditingId(place._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const uploadImageIfNeeded = async () => {
    if (!imageFile) return null;

    const uploadData = new FormData();
    uploadData.append('image', imageFile);

    const uploadRes = await axios.post(
      `${BACKEND_URL}/api/upload`,
      uploadData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return uploadRes.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uploadedImageUrl = await uploadImageIfNeeded();

      const payload = {
        name: formData.name,
        category: formData.category,
        distance: Number(formData.distance),
        description: formData.description,
        shortDescription: formData.shortDescription,
        location: {
          lat: Number(formData.lat),
          lng: Number(formData.lng)
        },
        address: formData.address,
        trending: formData.trending
      };

      if (uploadedImageUrl) {
        payload.images = [
          {
            url: uploadedImageUrl,
            caption: formData.name,
            isPrimary: true
          }
        ];
      }

      if (editingId) {
        await axios.put(
          `${BACKEND_URL}/api/admin/places/${editingId}`,
          payload,
          { headers: getAdminHeaders() }
        );
        alert('Place updated successfully');
      } else {
        payload.images = uploadedImageUrl
          ? [
              {
                url: uploadedImageUrl,
                caption: formData.name,
                isPrimary: true
              }
            ]
          : [];

        await axios.post(
          `${BACKEND_URL}/api/admin/places`,
          payload,
          { headers: getAdminHeaders() }
        );
        alert('Place added successfully');
      }

      closeForm();
      fetchPlaces();
    } catch (error) {
      console.error('Error saving place:', error);
      alert(error?.response?.data?.message || 'Failed to save place');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this place?');
    if (!confirmed) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/admin/places/${id}`, {
        headers: getAdminHeaders()
      });
      alert('Place deleted successfully');
      fetchPlaces();
    } catch (error) {
      console.error('Error deleting place:', error);
      alert(error?.response?.data?.message || 'Failed to delete place');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    navigate('/');
  };

  return (
    <div className="admin-places-wrapper">
      <div className="admin-places-container">
        <div className="admin-places-header">
          <h1>Admin Panel - Manage Places</h1>

          <div className="admin-header-actions">
            <button
              className="add-place-btn"
              onClick={showForm ? closeForm : openAddForm}
              type="button"
            >
              {showForm ? 'Close Form' : '+ Add New Place'}
            </button>

            <button
              className="logout-btn"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>

        {showForm && (
          <div className="admin-form-card">
            <h2>{editingId ? 'Edit Place' : 'Add New Place'}</h2>

            <form className="admin-place-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Place Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Historical">Historical</option>
                <option value="Nature">Nature</option>
                <option value="Religious Sites">Religious Sites</option>
                <option value="Sightseeing">Sightseeing</option>
                <option value="Restaurants">Restaurants</option>
                <option value="Monuments">Monuments</option>
                <option value="Archaeological">Archaeological</option>
                <option value="Lake">Lake</option>
              </select>

              <input
                type="number"
                name="distance"
                placeholder="Distance (km)"
                value={formData.distance}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="shortDescription"
                placeholder="Short Description"
                value={formData.shortDescription}
                onChange={handleChange}
                required
              />

              <textarea
                name="description"
                placeholder="Full Description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />

              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                step="any"
                name="lat"
                placeholder="Latitude"
                value={formData.lat}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                step="any"
                name="lng"
                placeholder="Longitude"
                value={formData.lng}
                onChange={handleChange}
                required
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  name="trending"
                  checked={formData.trending}
                  onChange={handleChange}
                />
                Trending Place
              </label>

              <button type="submit" className="submit-btn">
                {editingId ? 'Update Place' : 'Save Place'}
              </button>
            </form>
          </div>
        )}

        <div className="places-table-card">
          <div className="places-table-head">
            <span>Image</span>
            <span>Name</span>
            <span>Category</span>
            <span>Distance</span>
            <span>Trending</span>
            <span>Actions</span>
          </div>

          {places.map((place) => (
            <div key={place._id} className="place-row">
              <div className="place-image-cell">
                <img
                  src={getImageUrl(place)}
                  alt={place.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/120';
                  }}
                />
              </div>

              <div>{place.name}</div>
              <div>{place.category}</div>
              <div>{place.distance} km</div>
              <div>{place.trending ? '🔥 Yes' : 'No'}</div>

              <div className="action-buttons">
                <button
                  type="button"
                  className="edit-btn"
                  onClick={() => openEditForm(place)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleDelete(place._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPlaces;