const { z } = require('zod');

const listUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  }),
});

const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user id'),
  }),
});

const blockUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user id'),
  }),
  body: z.object({
    isBlocked: z.boolean().optional(),
  }),
});

module.exports = { listUsersSchema, userIdParamSchema, blockUserSchema };
