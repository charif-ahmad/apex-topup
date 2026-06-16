const prisma = require('../config/prisma');
const { serializeTransaction } = require('../utils/serialize');

// Build a Prisma `where` from filters. userId omitted => all users (admin).
function buildWhere({ userId, type, status, from, to }) {
  const where = {};
  if (userId) where.userId = userId;
  if (type) where.type = type;
  if (status) where.status = status;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = from;
    if (to) where.createdAt.lte = to;
  }
  return where;
}

async function listTransactions({ userId, page, limit, type, status, from, to }) {
  const where = buildWhere({ userId, type, status, from, to });
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: { service: { select: { id: true, name: true, category: true } } },
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    items: items.map(serializeTransaction),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 0,
  };
}

module.exports = { listTransactions };
