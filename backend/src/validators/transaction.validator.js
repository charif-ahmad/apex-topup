const { z } = require('zod');

const listTransactionsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    type: z.enum(['credit', 'debit']).optional(),
    status: z.enum(['pending', 'success', 'failed']).optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
  }),
});

module.exports = { listTransactionsSchema };
