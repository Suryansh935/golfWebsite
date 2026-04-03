const User = require('../models/user');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');

// Helper to safely get userId as string (prevents ObjectId/buffer errors)
const getUserId = (req) => {
  if (!req.user) return null;
  return req.user._id?.toString() || 
         req.user.id?.toString() || 
         req.user.userId?.toString() || 
         null;
};

exports.activateSubscription = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Token is not valid or user not authenticated' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.subscriptionStatus = 'monthly';
    await user.save();

    res.json({ 
      message: 'Subscription activated.', 
      subscriptionStatus: user.subscriptionStatus 
    });
  } catch (err) {
    console.error('Activate subscription error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createCheckoutSession = async (req, res) => {
  try {
    const { priceId, subscriptionType } = req.body;

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ message: 'Stripe is not configured.' });
    }

    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ 
        message: 'Token is not valid or user not authenticated. Please log in again.' 
      });
    }

    if (!['monthly', 'yearly'].includes(subscriptionType)) {
      return res.status(400).json({ 
        message: 'subscriptionType must be monthly or yearly.' 
      });
    }

    const currency = 'gbp'; // Matches your £ pricing
    const unitAmount = subscriptionType === 'yearly' ? 8999 : 999;

    const lineItems = priceId
      ? [{ price: priceId, quantity: 1 }]
      : [{
          price_data: {
            currency,
            product_data: {
              name: `Birdie Bounty ${subscriptionType === 'yearly' ? 'Yearly' : 'Monthly'} Membership`,
            },
            unit_amount: unitAmount,
            recurring: { 
              interval: subscriptionType === 'yearly' ? 'year' : 'month' 
            },
          },
          quantity: 1,
        }];

    // Create session with reasonable timeout handling
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: lineItems,
      metadata: { 
        userId, 
        subscriptionType 
      },
      client_reference_id: userId,
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?session=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?session=cancel`,
      // Optional: helps with abandoned checkouts
      expires_at: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe createCheckoutSession error:', {
      message: err.message,
      type: err.type,
      code: err.code,
    });

    // Friendly error for auth issues
    if (err.message?.includes('token') || err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token is not valid. Please log in again.' });
    }

    res.status(500).json({ 
      message: 'Stripe error', 
      error: err.message 
    });
  }
};

exports.confirmCheckoutSession = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) {
      return res.status(400).json({ message: 'session_id is required.' });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ message: 'Stripe is not configured.' });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.mode !== 'subscription' || 
        (session.payment_status !== 'paid' && session.status !== 'complete')) {
      return res.status(400).json({ message: 'Checkout session is not completed yet.' });
    }

    const userId = session.metadata?.userId || getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Token is not valid or unable to identify user.' });
    }

    const subscriptionType = session.metadata?.subscriptionType || 'monthly';

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.subscriptionStatus = subscriptionType;
    await user.save();

    res.json({ 
      message: 'Subscription confirmed successfully.',
      subscriptionStatus: user.subscriptionStatus 
    });
  } catch (err) {
    console.error('Confirm checkout error:', err);
    res.status(500).json({ message: 'Stripe error', error: err.message });
  }
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(500).json({ message: 'Stripe webhook secret not configured.' });
  }

  let event;
  try {
    const payload = req.rawBody || req.body;
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const subscriptionType = session.metadata?.subscriptionType || 'monthly';

    if (userId) {
      try {
        const user = await User.findById(userId);
        if (user) {
          user.subscriptionStatus = subscriptionType;
          await user.save();
          console.log(`✅ Subscription updated via webhook for user ${userId}`);
        }
      } catch (dbErr) {
        console.error('Webhook DB update failed:', dbErr);
      }
    }
  }

  res.json({ received: true });
};