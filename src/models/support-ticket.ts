// backend/models/SupportTicket.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const supportTicketSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  ticketNumber: {
    type: String,
    unique: true
  },
  createdBy: {
    type: String,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: String,
    ref: 'User'
  },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['billing', 'technical', 'service', 'safety', 'general'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  relatedRequest: {
    type: String,
    ref: 'MassageRequest'
  },
  messages: [{
    sender: {
      type: String,
      ref: 'User'
    },
    content: String,
    isInternal: {
      type: Boolean,
      default: false
    },
    sentAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolution: {
    notes: String,
    resolvedBy: {
      type: String,
      ref: 'User'
    },
    resolvedAt: Date
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

// Generate ticket number
supportTicketSchema.pre('save', function(next) {
  if (!this.ticketNumber) {
    this.ticketNumber = 'TKT-' + Date.now().toString().slice(-6) + Math.random().toString(36).substring(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('SupportTicket', supportTicketSchema);