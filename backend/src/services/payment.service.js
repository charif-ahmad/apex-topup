const { randomUUID } = require('crypto');
const env = require('../config/env');

// Hand-built payment simulation. No external gateway.
// Instant random resolution: rolls success/failed immediately.
function processPayment(amount) {
  const rate = Number.isFinite(env.paymentSuccessRate) ? env.paymentSuccessRate : 0.8;
  const success = Math.random() < rate;
  return {
    status: success ? 'success' : 'failed',
    reference: randomUUID(),
    amount,
  };
}

module.exports = { processPayment };
