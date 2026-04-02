const User = require('../models/user');
const DrawResult = require('../models/DrawResult');

const drawFiveNumbers = () => {
  const numbers = new Set();
  while (numbers.size < 5) {
    const value = Math.floor(Math.random() * 45) + 1;
    numbers.add(value);
  }
  return Array.from(numbers).sort((a, b) => a - b);
};

exports.runDraw = async (req, res) => {
  try {
    const drawNumbers = drawFiveNumbers();

    const activeUsers = await User.find({ subscriptionStatus: { $in: ['monthly', 'yearly'] } }).select('name email scores');
    const userMatches = activeUsers.map((user) => {
      const scoreValues = user.scores.map((score) => score.value);
      const matches = scoreValues.filter((value) => drawNumbers.includes(value));

      return {
        userId: user._id,
        name: user.name,
        email: user.email,
        matches: matches.length,
        scoreValues
      };
    });

    const result = await DrawResult.create({ drawNumbers, userMatches });
    res.json({ message: 'Draw completed.', result });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getDrawResults = async (req, res) => {
  try {
    const results = await DrawResult.find().sort({ createdAt: -1 }).limit(10);
    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
