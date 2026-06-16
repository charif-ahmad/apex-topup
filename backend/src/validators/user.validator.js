const { z } = require('zod');

const updateProfileSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
      email: z.string().trim().toLowerCase().email('Invalid email').optional(),
      password: z.string().min(8, 'Password must be at least 8 characters').optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    }),
});

module.exports = { updateProfileSchema };
