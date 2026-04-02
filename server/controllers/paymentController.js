const User = require('../models/user');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');

exports.activateSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.subscriptionStatus = 'monthly';
    await user.save();

    res.json({ message: 'Subscription activated.', subscriptionStatus: user.subscriptionStatus });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createCheckoutSession = async (req, res) => {
  try {
    const { priceId, subscriptionType } = req.body;

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ message: 'Stripe is not configured.' });
    }

    if (!['monthly', 'yearly'].includes(subscriptionType)) {
      return res.status(400).json({ message: 'subscriptionType must be monthly or yearly.' });
    }

    const lineItems = priceId
      ? [{ price: priceId, quantity: 1 }]
      : [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Birdie Bounty ${subscriptionType === 'yearly' ? 'Yearly' : 'Monthly'} Membership`,
            },
            unit_amount: subscriptionType === 'yearly' ? 8999 : 999,
            recurring: { interval: subscriptionType === 'yearly' ? 'year' : 'month' },
          },
          quantity: 1,
        }];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: lineItems,
      metadata: { userId: req.user.id, subscriptionType },
      client_reference_id: req.user.id,
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?session=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?session=cancel`
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: 'Stripe error', error: err.message });
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
    if (!session) {
      return res.status(404).json({ message: 'Checkout session not found.' });
    }

    if (session.mode !== 'subscription' || (session.payment_status !== 'paid' && session.status !== 'complete')) {
      return res.status(400).json({ message: 'Checkout session is not completed yet.' });
    }

    const userId = session.metadata?.userId || req.user.id;
    const subscriptionType = session.metadata?.subscriptionType || 'monthly';
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.subscriptionStatus = subscriptionType;
    await user.save();

    res.json({ subscriptionStatus: user.subscriptionStatus });
  } catch (err) {
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
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const subscriptionType = session.metadata?.subscriptionType || 'monthly';

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.subscriptionStatus = subscriptionType;
        await user.save();
      }
    }
  }

  res.json({ received: true });
};
