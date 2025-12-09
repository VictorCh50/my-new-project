const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Transaction Identifiers
  transactionId: {
    type: String,
    unique: true,
    default: () => `TRX${Date.now()}${Math.floor(Math.random() * 1000)}`
  },
  reference: {
    type: String,
    required: true
  },
  
  // Parties Involved
  fromAccount: {
    type: String,
    required: true,
    ref: 'User'
  },
  toAccount: {
    type: String,
    required: true
  },
  recipientName: String,
  
  // Transaction Details
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  currency: {
    type: String,
    default: 'TZS'
  },
  type: {
    type: String,
    enum: ['transfer', 'deposit', 'withdrawal', 'payment', 'airtime'],
    default: 'transfer'
  },
  category: {
    type: String,
    enum: ['internal', 'interbank', 'mobile_money', 'bill_payment', 'airtime'],
    default: 'internal'
  },
  
  // Status Tracking
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'reversed'],
    default: 'pending'
  },
  statusMessage: String,
  
  // Security & Verification
  requiresApproval: {
    type: Boolean,
    default: false
  },
  verifiedBy: String,
  verificationMethod: {
    type: String,
    enum: ['pin', 'otp', 'biometric', 'none'],
    default: 'pin'
  },
  
  // Metadata
  description: String,
  notes: String,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
}, {
  timestamps: true
});

// Indexes for faster queries
transactionSchema.index({ fromAccount: 1, createdAt: -1 });
transactionSchema.index({ toAccount: 1, createdAt: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ transactionId: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
