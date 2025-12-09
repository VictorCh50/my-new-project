const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Personal Info
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true
  },
  
  // Security
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  pin: {
    type: String,
    required: [true, '4-digit PIN is required'],
    minlength: 4,
    maxlength: 4,
    select: false
  },
  
  // Banking Info
  accountNumber: {
    type: String,
    unique: true,
    default: function() {
      // Generate 10-digit account number
      return '10' + Math.floor(10000000 + Math.random() * 90000000);
    }
  },
  accountType: {
    type: String,
    enum: ['savings', 'current', 'fixed_deposit'],
    default: 'savings'
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'TZS'
  },
  
  // Security Features
  isActive: {
    type: Boolean,
    default: true
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lastLogin: Date,
  accountLockedUntil: Date,
  
  // KYC Information (simplified)
  idNumber: String,
  dateOfBirth: Date,
  address: String,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Hash PIN before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('pin')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.pin = await bcrypt.hash(this.pin, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check PIN
userSchema.methods.comparePin = async function(candidatePin) {
  return await bcrypt.compare(candidatePin, this.pin);
};

// Method to format account info for response
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.pin;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', userSchema);
