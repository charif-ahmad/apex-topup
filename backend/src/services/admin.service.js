const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

async function listUsers({ page = 1, limit = 10, search } = {}) {
  const skip = (page - 1) * limit;
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBlocked: true,
        createdAt: true,
        wallet: { select: { balance: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const items = users.map((u) => ({
    ...u,
    wallet: undefined,
    balance: u.wallet ? Number(u.wallet.balance) : 0,
  }));

  return { items, page, limit, total, totalPages: Math.ceil(total / limit) || 0 };
}

async function setBlocked(userId, isBlocked) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound('User not found');
  if (user.role === 'admin') throw ApiError.forbidden('Cannot block an admin account');

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isBlocked },
    select: { id: true, email: true, isBlocked: true },
  });
  return updated;
}

async function deleteUser(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound('User not found');
  if (user.role === 'admin') throw ApiError.forbidden('Cannot delete an admin account');

  await prisma.user.delete({ where: { id: userId } });
  return { id: userId };
}

async function getAnalytics() {
  const [totalUsers, totalTransactions, revenueAgg] = await Promise.all([
    prisma.user.count(),
    prisma.transaction.count(),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: 'debit', status: 'success' },
    }),
  ]);

  return {
    totalRevenue: revenueAgg._sum.amount ? Number(revenueAgg._sum.amount) : 0,
    totalUsers,
    totalTransactions,
  };
}

module.exports = { listUsers, setBlocked, deleteUser, getAnalytics };
