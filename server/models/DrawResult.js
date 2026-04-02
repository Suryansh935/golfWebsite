const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  email: String,
  matches: Number,
  scoreValues: [Number]
});

const drawResultSchema = new mongoose.Schema({
  drawNumbers: [{ type: Number, required: true }],
  userMatches: [matchSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DrawResult', drawResultSchema);
