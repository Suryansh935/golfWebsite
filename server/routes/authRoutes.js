const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleWare');
const { register, login, getMe, forgotPassword, resetPassword } = require('../controllers/authControllers');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;