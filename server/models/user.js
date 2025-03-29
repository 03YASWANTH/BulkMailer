const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  profilePicture: { type: String },
  isVerified: { type: Boolean, default: false },
  phoneNumber: { 
    type: String, 
    sparse: true  // ✅ Fix: Allows multiple `null` values
  },
  refreshToken:
  {
    type:String,
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
