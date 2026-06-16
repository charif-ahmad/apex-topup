const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const paymentService = require('./payment.service');
const { serializeWallet, serializeTransaction } = require('../utils/serialize');

async function getWallet(userId) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw ApiError.notFound('Wallet not found');
  return serializeWallet(wallet);
}

// Add funds via the simulated payment gateway (credit flow, randomized).
// Always logs a transaction (success or failed). Balance only changes on success.
async function addFunds(userId, amount) {
  const payment = paymentService.processPayment(amount);

  const result = await prisma.$transaction(async (tx) => {
    if (payment.status === 'failed') {
      const transaction = await tx.transaction.create({
        data: {
          userId,
          type: 'credit',
          amount,
          status: 'failed',
          reference: payment.reference,
        },
      });
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      return { transaction, wallet };
    }

    const wallet = await tx.wallet.update({
      where: { userId },
      data: { balance: { increment: amount } },
    });
    const transaction = await tx.transaction.create({
      data: {
        userId,
        type: 'credit',
        amount,
        status: 'success',
        reference: payment.reference,
      },
    });
    return { transaction, wallet };
  });

  return {
    paymentStatus: payment.status,
    transaction: serializeTransaction(result.transaction),
    balance: result.wallet ? Number(result.wallet.balance) : undefined,
  };
}

module.exports = { getWallet, addFunds };
