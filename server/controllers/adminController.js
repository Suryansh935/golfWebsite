const fs = require('fs/promises');
const path = require('path');
const User = require('../models/user');
const DrawResult = require('../models/DrawResult');

const charitiesPath = path.join(__dirname, '../data/charities.json');
const subscriptionFees = { monthly: 9.99, yearly: 89.99 };

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

exports.getAdminUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const userList = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      subscriptionStatus: user.subscriptionStatus,
      scoresEntered: user.scores.length,
      charity: user.charity?.name || 'Not set',
      donationPercentage: user.charity?.donationPercentage || 10,
      joinedAt: user.createdAt,
    }));
    res.json({ users: userList });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAdminAnalytics = async (req, res) => {
  try {
    const users = await User.find();
    const activeUsers = users.filter((user) => user.subscriptionStatus !== 'inactive');
    const monthlySubscribers = users.filter((user) => user.subscriptionStatus === 'monthly').length;
    const yearlySubscribers = users.filter((user) => user.subscriptionStatus === 'yearly').length;
    const activeSubscribers = monthlySubscribers + yearlySubscribers;

    const totalRevenue = users.reduce((sum, user) => {
      if (user.subscriptionStatus === 'monthly') return sum + subscriptionFees.monthly;
      if (user.subscriptionStatus === 'yearly') return sum + subscriptionFees.yearly;
      return sum;
    }, 0);

    const charityContributions = users.reduce((sum, user) => {
      if (!user.charity?.name || user.subscriptionStatus === 'inactive') return sum;
      const fee = user.subscriptionStatus === 'monthly' ? subscriptionFees.monthly : subscriptionFees.yearly;
      return sum + fee * (user.charity.donationPercentage / 100);
    }, 0);

    const drawResults = await DrawResult.find();
    const matchDistribution = { '3': 0, '4': 0, '5': 0 };
    drawResults.forEach((draw) => {
      draw.userMatches.forEach((match) => {
        if ([3, 4, 5].includes(match.matches)) {
          matchDistribution[match.matches] += 1;
        }
      });
    });

    res.json({
      activeSubscribers,
      monthlySubscribers,
      yearlySubscribers,
      totalRevenue: totalRevenue.toFixed(2),
      totalPrizePool: (activeSubscribers * 9.99).toFixed(2),
      charityContributions: charityContributions.toFixed(2),
      matchDistribution,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAdminCharities = async (req, res) => {
  try {
    const file = await fs.readFile(charitiesPath, 'utf-8');
    const charities = JSON.parse(file);
    res.json({ charities });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateCharityStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    const file = await fs.readFile(charitiesPath, 'utf-8');
    const charities = JSON.parse(file);
    const charity = charities.find((item) => item.id === id);
    if (!charity) return res.status(404).json({ message: 'Charity not found.' });

    charity.is_active = Boolean(is_active);
    await fs.writeFile(charitiesPath, JSON.stringify(charities, null, 2));
    res.json({ charity });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addCharity = async (req, res) => {
  try {
    const { name, category, description, website_url } = req.body;
    if (!name || !category || !description || !website_url) {
      return res.status(400).json({ message: 'All charity fields are required.' });
    }

    const file = await fs.readFile(charitiesPath, 'utf-8');
    const charities = JSON.parse(file);
    const id = slugify(name);
    if (charities.some((item) => item.id === id)) {
      return res.status(400).json({ message: 'A charity with that name already exists.' });
    }

    const charity = {
      id,
      name,
      category,
      description,
      website_url,
      is_active: true,
    };
    charities.push(charity);
    await fs.writeFile(charitiesPath, JSON.stringify(charities, null, 2));

    res.status(201).json({ charity });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
