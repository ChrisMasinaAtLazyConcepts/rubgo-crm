// backend/models/LoyaltyProgram.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const loyaltyProgramSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['points', 'tiers', 'referral'],
    required: true
  },
  rules: {
    pointsPerDollar: Number,
    signupBonus: Number,
    referralBonus: Number,
    freeMassageAfterPoints: Number,
    tierRequirements: [{
      tier: String,
      minPoints: Number,
      benefits: [String]
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LoyaltyProgram', loyaltyProgramSchema);