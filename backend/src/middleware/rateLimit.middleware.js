const rateLimit = require('express-rate-limit');

// Global rate limiter to protect all endpoints from DDoS/abuse.
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many requests, please try again later',
      statusCode: 429,
    },
  },
});

module.exports = {
  globalLimiter,
};
