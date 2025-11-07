// backend/models/User.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  userType: {
    type: String,
    enum: ['customer', 'therapist', 'admin', 'support'],
    default: 'customer'
  },
  profileImage: String,
  dateOfBirth: Date,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  // Loyalty Program Fields
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  credits: {
    type: Number,
    default: 0
  },
  freeMassagesAvailable: {
    type: Number,
    default: 0
  },
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: String,
    ref: 'User'
  },
  totalReferrals: {
    type: Number,
    default: 0
  },
  // Security Fields
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  // Status Management
  status: {
    type: String,
    enum: ['active', 'flagged', 'banned', 'suspended'],
    default: 'active'
  },
  flaggedReason: String,
  isVerified: {
    type: Boolean,
    default: false
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

// Generate referral code
userSchema.pre('save', function(next) {
  if (!this.referralCode) {
    this.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);