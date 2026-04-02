const express = require('express');
const router = express.Router();
const { getDrawResults } = require('../controllers/drawController');

router.get('/', getDrawResults);

module.exports = router;
