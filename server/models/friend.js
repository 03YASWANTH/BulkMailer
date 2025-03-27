const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  upiId: { type: String },
//   isRegistered: { type: Boolean, default: false }, // If friend is also an AltPay user
//   trustScore: { type: Number, default: 0 }, // Could be used for prioritization
  paymentHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Compound index to ensure a user can't add the same friend twice
FriendSchema.index({ userId: 1, phoneNumber: 1 }, { unique: true });

module.exports = mongoose.model('Friend', FriendSchema);