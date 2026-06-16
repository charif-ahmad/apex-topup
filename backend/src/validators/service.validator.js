const { z } = require('zod');

const CATEGORIES = ['mobile', 'internet', 'giftcard'];

const createServiceSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name is required'),
    category: z.enum(CATEGORIES, { message: `Category must be one of: ${CATEGORIES.join(', ')}` }),
    price: z.number().positive('Price must be greater than 0'),
    provider: z.string().trim().min(1, 'Provider is required'),
    isActive: z.boolean().optional(),
  }),
});

const updateServiceSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z
    .object({
      name: z.string().trim().min(2).optional(),
      category: z.enum(CATEGORIES).optional(),
      price: z.number().positive().optional(),
      provider: z.string().trim().min(1).optional(),
      isActive: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    }),
});

const serviceIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

module.exports = { createServiceSchema, updateServiceSchema, serviceIdParamSchema, CATEGORIES };
