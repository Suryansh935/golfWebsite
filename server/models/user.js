const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  
  // PRD Specific Fields
  subscriptionStatus: { 
    type: String, 
    enum: ['inactive', 'monthly', 'yearly'], 
    default: 'inactive' 
  },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  scores: [{ 
    id: String,
    value: Number, 
    date: { type: Date, default: Date.now } 
  }],
  charity: {
    name: { type: String, default: "" },
    donationPercentage: { type: Number, default: 10 }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);