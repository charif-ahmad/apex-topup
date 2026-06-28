const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const paymentService = require('./payment.service');
const { serializeWallet, serializeTransaction } = require('../utils/serialize');

async function getWallet(userId) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw ApiError.notFound('Wallet not found');
  return serializeWallet(wallet);
}

// Initiate Stripe Checkout: creates a pending transaction and returns checkout URL
async function addFunds(userId, amount) {
  // First, create the pending transaction in our database
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      type: 'credit',
      amount,
      status: 'pending',
    },
  });

  try {
    // Create the Stripe checkout session
    const session = await paymentService.createCheckoutSession(userId, amount, transaction.id);

    // Update the transaction with the session ID as reference
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transaction.id },
      data: { reference: session.id },
    });

    return {
      checkoutUrl: session.url,
      transaction: serializeTransaction(updatedTransaction),
    };
  } catch (error) {
    // If Stripe fails, mark transaction as failed
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: 'failed' },
    });
    throw error;
  }
}

// Verify Stripe Checkout Session: checks status with Stripe and updates user wallet/transaction
async function verifySession(userId, sessionId) {
  const session = await paymentService.retrieveCheckoutSession(sessionId);
  const transactionIdStr = session.metadata.transactionId;
  const transactionId = transactionIdStr ? parseInt(transactionIdStr, 10) : null;

  if (!transactionId) {
    throw ApiError.badRequest('Transaction ID not found in session metadata');
  }

  // Retrieve the transaction
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction) {
    throw ApiError.notFound('Transaction not found');
  }

  // Ensure transaction belongs to the requesting user
  if (transaction.userId !== userId) {
    throw ApiError.forbidden('Access denied');
  }

  // If the transaction is already processed, return it
  if (transaction.status !== 'pending') {
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    return {
      transaction: serializeTransaction(transaction),
      balance: wallet ? Number(wallet.balance) : undefined,
    };
  }

  const isPaid = session.payment_status === 'paid';
  const newStatus = isPaid ? 'success' : 'failed';

  const result = await prisma.$transaction(async (tx) => {
    let wallet = null;
    if (isPaid) {
      wallet = await tx.wallet.update({
        where: { userId },
        data: { balance: { increment: transaction.amount } },
      });
    } else {
      wallet = await tx.wallet.findUnique({ where: { userId } });
    }

    const updatedTransaction = await tx.transaction.update({
      where: { id: transactionId },
      data: { status: newStatus },
    });

    return { transaction: updatedTransaction, wallet };
  });

  return {
    transaction: serializeTransaction(result.transaction),
    balance: result.wallet ? Number(result.wallet.balance) : undefined,
  };
}

module.exports = { getWallet, addFunds, verifySession };
