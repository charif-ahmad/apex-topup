const env = require('../config/env');
const ApiError = require('../utils/ApiError');

let stripe = null;
if (env.stripeSecretKey) {
  stripe = require('stripe')(env.stripeSecretKey);
}

/**
 * Creates a Stripe Checkout Session for wallet top-up.
 * @param {string} userId
 * @param {number} amount
 * @param {number} transactionId
 * @returns {Promise<{ id: string, url: string }>}
 */
async function createCheckoutSession(userId, amount, transactionId) {
  if (!stripe) {
    throw ApiError.internal('Stripe is not configured on the server. Please set STRIPE_SECRET_KEY.');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'myr',
            product_data: {
              name: 'Wallet Top-Up',
              description: `Top-up of MYR ${Number(amount).toFixed(2)} for Apex Wallet`,
            },
            unit_amount: Math.round(amount * 100), // Stripe expects cents/subunits
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${env.frontendUrl}/wallet?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.frontendUrl}/wallet?status=cancelled`,
      client_reference_id: userId,
      metadata: {
        transactionId: String(transactionId),
      },
    });

    return {
      id: session.id,
      url: session.url,
    };
  } catch (error) {
    throw ApiError.internal(`Failed to create Stripe checkout session: ${error.message}`);
  }
}

/**
 * Retrieves a Stripe Checkout Session.
 * @param {string} sessionId
 * @returns {Promise<object>}
 */
async function retrieveCheckoutSession(sessionId) {
  if (!stripe) {
    throw ApiError.internal('Stripe is not configured on the server.');
  }

  try {
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    throw ApiError.notFound(`Stripe session not found: ${error.message}`);
  }
}

module.exports = {
  createCheckoutSession,
  retrieveCheckoutSession,
};
