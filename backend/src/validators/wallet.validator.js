const { z } = require('zod');

const addFundsSchema = z.object({
  body: z.object({
    amount: z
      .number({ invalid_type_error: 'Amount must be a number' })
      .positive('Amount must be greater than 0')
      .max(100000, 'Amount exceeds the maximum allowed (100000)'),
  }),
});

const verifySessionSchema = z.object({
  body: z.object({
    sessionId: z.string({ required_error: 'Session ID is required' }).min(1, 'Session ID cannot be empty'),
  }),
});

module.exports = { addFundsSchema, verifySessionSchema };
