const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleWare');
const { activateSubscription, createCheckoutSession, confirmCheckoutSession, handleWebhook } = require('../controllers/paymentController');

router.post('/activate', protect, activateSubscription);
router.post('/create-session', protect, createCheckoutSession);
router.get('/confirm', protect, confirmCheckoutSession);
router.post('/webhook', handleWebhook);

module.exports = router;
