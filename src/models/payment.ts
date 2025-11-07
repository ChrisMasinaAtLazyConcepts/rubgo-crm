// backend/models/Payment.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const paymentSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  therapistId: {
    type: String,
    ref: 'Therapist',
    required: true
  },
  requestId: {
    type: String,
    ref: 'MassageRequest',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  therapistEarnings: {
    type: Number,
    required: true
  },
  platformFee: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['credit-card', 'debit-card', 'paypal', 'bank-transfer'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  processedDate: Date,
  payoutDate: Date,
  transactionId: String,
  notes: String
});

module.exports = mongoose.model('Payment', paymentSchema);