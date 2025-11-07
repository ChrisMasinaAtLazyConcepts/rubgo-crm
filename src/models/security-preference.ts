// backend/models/SecurityPreference.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const securityPreferenceSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  userId: {
    type: String,
    ref: 'User',
    required: true
  },
  userType: {
    type: String,
    enum: ['customer', 'therapist'],
    required: true
  },
  // Emergency contact preferences
  emergencyContacts: [{
    name: String,
    relationship: String,
    phone: String,
    email: String,
    isPrimary: Boolean
  }],
  // Security company preferences by geolocation
  securityCompanies: [{
    location: {
      city: String,
      state: String,
      coordinates: {
        lat: Number,
        lng: Number
      },
      radius: {
        type: Number,
        default: 25 // 25km radius
      }
    },
    companyName: String,
    contactNumber: String,
    email: String,
    isActive: Boolean
  }],
  // SAPS integration preferences
  sapsIntegration: {
    autoContact: {
      type: Boolean,
      default: false
    },
    preferredStation: String,
    stationContact: String
  },
  // Notification preferences
  notifications: {
    panicAlerts: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    autoSAPS: {
      type: Boolean,
      default: false
    },
    autoSecurityCompany: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SecurityPreference', securityPreferenceSchema);