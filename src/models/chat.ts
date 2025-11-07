// backend/models/Chat.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const chatSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  participants: [{
    userId: {
      type: String,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['customer', 'therapist', 'admin', 'support']
    }
  }],
  requestId: {
    type: String,
    ref: 'MassageRequest'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastMessage: {
    content: String,
    sentAt: Date,
    sentBy: {
      type: String,
      ref: 'User'
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

const messageSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  chatId: {
    type: String,
    ref: 'Chat',
    required: true
  },
  senderId: {
    type: String,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'location', 'system'],
    default: 'text'
  },
  readBy: [{
    userId: String,
    readAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = {
  Chat: mongoose.model('Chat', chatSchema),
  Message: mongoose.model('Message', messageSchema)
};