const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

FriendSchema.index({ userId: 1, phoneNumber: 1 }, { unique: true });

module.exports = mongoose.model('Friend', FriendSchema);