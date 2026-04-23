const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  duration: {
    type: String,
    default: '1 Day'
  },
  places: [{
    placeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place'
    },
    order: Number,
    suggestedTime: String,
    duration: String
  }],
  totalDistance: Number,
  isTemplate: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    default: 'Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Itinerary', itinerarySchema);