const { z } = require('zod');

const addFundsSchema = z.object({
  body: z.object({
    amount: z
      .number({ invalid_type_error: 'Amount must be a number' })
      .positive('Amount must be greater than 0')
      .max(100000, 'Amount exceeds the maximum allowed (100000)'),
  }),
});

module.exports = { addFundsSchema };
