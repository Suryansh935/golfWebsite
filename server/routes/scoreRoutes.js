const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleWare');
const { addScore, getScores } = require('../controllers/scoreController');

router.use(protect);
router.post('/', addScore);
router.get('/', getScores);

module.exports = router;
