const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const { serializeTransaction } = require('../utils/serialize');

// Execute a top-up purchase (debit flow, deterministic).
// Atomic & race-safe: the guarded conditional update only decrements when
// balance >= price, so concurrent requests can never drive balance negative.
async function purchase(userId, serviceId) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.isActive) {
    throw ApiError.notFound('Service not found or inactive');
  }

  const amount = service.price;

  try {
    return await prisma.$transaction(async (tx) => {
      const updated = await tx.wallet.updateMany({
        where: { userId, balance: { gte: amount } },
        data: { balance: { decrement: amount } },
      });

      if (updated.count === 0) {
        // Signal insufficient funds; handled below to log a failed debit.
        throw new ApiError(400, 'INSUFFICIENT_FUNDS');
      }

      const transaction = await tx.transaction.create({
        data: {
          userId,
          type: 'debit',
          amount,
          status: 'success',
          serviceId,
        },
      });
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      return {
        transaction: serializeTransaction(transaction),
        balance: Number(wallet.balance),
        service: { id: service.id, name: service.name, price: Number(service.price) },
      };
    });
  } catch (err) {
    if (err instanceof ApiError && err.message === 'INSUFFICIENT_FUNDS') {
      // Persist a failed debit for the audit trail (separate transaction so it
      // survives the rollback of the guarded debit above).
      await prisma.transaction.create({
        data: { userId, type: 'debit', amount, status: 'failed', serviceId },
      });
      throw ApiError.badRequest('Insufficient wallet balance');
    }
    throw err;
  }
}

module.exports = { purchase };
