const User = require('../models/user');
const mongoose = require('mongoose');

exports.addScore = async (req, res) => {
  try {
    const { score } = req.body;
    const userId = req.user.id;

    if (typeof score !== 'number') {
      return res.status(400).json({ message: 'Score must be a number.' });
    }

    if (score < 1 || score > 45) {
      return res.status(400).json({ message: 'Score must be between 1 and 45.' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const activeStatuses = ['monthly', 'yearly'];
    if (!activeStatuses.includes(user.subscriptionStatus)) {
      return res.status(403).json({ message: 'Subscription required to add scores.' });
    }

    const newScore = {
      id: new mongoose.Types.ObjectId().toString(),
      value: score,
      date: new Date()
    };

    if (user.scores.length < 5) {
      user.scores.push(newScore);
    } else {
      user.scores.shift();
      user.scores.push(newScore);
    }

    await user.save();

    res.json({ message: 'Score added.', scores: user.scores });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getScores = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('scores');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ scores: user.scores });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
