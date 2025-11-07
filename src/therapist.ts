// backend/models/TherapistTarget.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const therapistTargetSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  therapistId: {
    type: String,
    ref: 'Therapist',
    required: true
  },
  period: {
    type: String,
    enum: ['weekly', 'monthly'],
    required: true
  },
  targetType: {
    type: String,
    enum: ['sessions', 'revenue', 'rating'],
    required: true
  },
  targetValue: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  currentValue: {
    type: Number,
    default: 0
  },
  completionPercentage: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
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

// Calculate completion percentage
therapistTargetSchema.methods.updateProgress = function(currentValue) {
  this.currentValue = currentValue;
  this.completionPercentage = (currentValue / this.targetValue) * 100;
  this.updatedAt = new Date();
};

module.exports = mongoose.model('TherapistTarget', therapistTargetSchema);