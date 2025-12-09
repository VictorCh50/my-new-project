require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const rateLimit = require('express-rate-limit');

// Initialize express
const app = express();

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => logger.info('MongoDB connected successfully'))
.catch(err => logger.error('MongoDB connection error:', err));

// Simple route for testing
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Tembo Bank API is running',
    timestamp: new Date().toISOString()
  });
});

// Import routes (we'll create these next)
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const transactionRoutes = require('./routes/transaction');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/transactions', transactionRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

module.exports = app;
