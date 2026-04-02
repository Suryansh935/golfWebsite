const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleWare');
const { getCharities, updateCharity, getCharitySettings } = require('../controllers/charityController');

router.get('/list', getCharities);
router.use(protect);
router.get('/me', getCharitySettings);
router.put('/', updateCharity);

module.exports = router;
