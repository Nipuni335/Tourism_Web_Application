const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Place name is required'],
    trim: true,
    unique: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Sightseeing', 'Restaurants', 'Monuments', 'Religious Sites', 'Nature', 'Historical', 'Archaeological', 'Lake']
  },
  distance: {
    type: Number,
    required: [true, 'Distance is required'],
    min: 0
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  shortDescription: {
    type: String,
    maxLength: 200
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  address: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  bestTimeToVisit: {
    sunrise: String,
    sunset: String,
    general: String
  },
  visitingHours: {
    open: String,
    close: String,
    days: [String]
  },
  entryFee: {
    local: Number,
    foreign: Number,
    currency: { type: String, default: 'LKR' }
  },
  dressCode: {
    required: Boolean,
    description: String
  },
  trending: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

placeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Place', placeSchema);