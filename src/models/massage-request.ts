// backend/models/MassageRequest.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const massageRequestSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  customerId: {
    type: String,
    ref: 'User',
    required: true
  },
  therapistId: {
    type: String,
    ref: 'Therapist'
  },
  serviceType: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  scheduledTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: [
      'pending', 
      'preparation',
      'accepted', 
      'in-progress', 
      'completed', 
      'cancelled',
      'no-show'
    ],
    default: 'pending'
  },
  // Enhanced pricing with RubGo service fee
  basePrice: {
    type: Number,
    required: true
  },
  travelFee: {
    type: Number,
    default: 50 // R50 travel fee
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  loyaltyPointsUsed: {
    type: Number,
    default: 0
  },
  // RubGo service fee - 12%
  rubgoServiceFee: {
    type: Number,
    default: 0
  },
  therapistEarnings: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true
  },
  specialRequests: String,
  therapistLocation: {
    lat: Number,
    lng: Number
  },
  customerLocation: {
    lat: Number,
    lng: Number
  },
  preparationTime: Date,
  startTime: Date,
  endTime: Date,
  durationAlerts: [{
    type: {
      type: String,
      enum: ['15_min_warning', '5_min_warning', 'time_up', 'overtime']
    },
    sentAt: Date,
    acknowledged: Boolean
  }],
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit-card', 'debit-card', 'paypal', 'bank-transfer'],
    required: true
  },
  rating: {
    score: Number,
    review: String,
    createdAt: Date
  },
  // Enhanced panic button with SAPS integration
  panicButtonUsed: {
    by: {
      type: String,
      enum: ['customer', 'therapist']
    },
    activatedAt: Date,
    location: {
      lat: Number,
      lng: Number
    },
    emergencyContacts: [{
      name: String,
      phone: String,
      notified: Boolean
    }],
    securityCompany: {
      name: String,
      contact: String,
      notified: Boolean
    },
    sapsNotified: {
      type: Boolean,
      default: false
    },
    sapsReference: String,
    resolved: {
      type: Boolean,
      default: false
    },
    resolutionNotes: String,
    resolvedBy: {
      type: String,
      ref: 'User'
    },
    resolvedAt: Date
  },
  selfieChecks: [{
    takenBy: {
      type: String,
      enum: ['therapist', 'customer']
    },
    imageUrl: String,
    verified: Boolean,
    verifiedBy: {
      type: String,
      ref: 'User'
    },
    timestamp: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate totals with RubGo service fee
massageRequestSchema.pre('save', function(next) {
  const subtotal = this.basePrice + this.travelFee - this.discountAmount;
  this.rubgoServiceFee = subtotal * 0.12; // 12% service fee
  this.therapistEarnings = subtotal - this.rubgoServiceFee;
  this.totalPrice = subtotal;
  next();
});

module.exports = mongoose.model('MassageRequest', massageRequestSchema);