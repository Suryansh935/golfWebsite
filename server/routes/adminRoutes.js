const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleWare');

const { runDraw, getDrawResults } = require('../controllers/drawController');
const {
  getAdminUsers,
  getAdminAnalytics,
  getAdminCharities,
  updateCharityStatus,
  addCharity,
} = require('../controllers/adminController');

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
};

router.use(protect);
router.use(adminOnly);
router.get('/users', getAdminUsers);
router.get('/analytics', getAdminAnalytics);
router.get('/charities', getAdminCharities);
router.put('/charities/:id', updateCharityStatus);
router.post('/charities', addCharity);
router.post('/draw', runDraw);
router.get('/results', getDrawResults);

module.exports = router;
