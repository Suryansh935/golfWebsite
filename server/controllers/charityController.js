const User = require('../models/user');
const charities = require('../data/charities.json');

exports.getCharities = async (req, res) => {
  res.json({ charities });
};

exports.updateCharity = async (req, res) => {
  try {
    const { name, donationPercentage } = req.body;
    const minDonation = 10;

    if (!name || typeof donationPercentage !== 'number') {
      return res.status(400).json({ message: 'Charity name and donation percentage are required.' });
    }

    if (donationPercentage < minDonation) {
      return res.status(400).json({ message: `Donation percentage must be at least ${minDonation}%` });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.charity.name = name;
    user.charity.donationPercentage = donationPercentage;
    await user.save();

    res.json({ message: 'Charity updated.', charity: user.charity });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getCharitySettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('charity');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ charity: user.charity });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
