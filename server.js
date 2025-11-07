// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import jobs
require('./jobs/weeklyPayouts');
require('./jobs/durationAlerts');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/therapists', require('./routes/therapists'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/loyalty', require('./routes/loyalty'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/support', require('./routes/support'));
app.use('/api/promotions', require('./routes/promotions'));
app.use('/api/security', require('./routes/security'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/massage-crm', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});