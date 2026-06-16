const { z } = require('zod');

const topupSchema = z.object({
  body: z.object({
    serviceId: z.coerce.number().int().positive('serviceId is required'),
  }),
});

module.exports = { topupSchema };
