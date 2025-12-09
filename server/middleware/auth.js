const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findOne({ 
      _id: decoded.userId,
      isActive: true 
    }).select('-password -pin');
    
    if (!user) {
      throw new Error();
    }
    
    // Check if account is locked
    if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked. Please try again later or contact support.'
      });
    }
    
    // Attach user to request
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Please authenticate'
    });
  }
};

// Role-based middleware
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

module.exports = { auth, requireRole };
