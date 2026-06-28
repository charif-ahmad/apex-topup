const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const walletService = require('../services/wallet.service');

const getWallet = asyncHandler(async (req, res) => {
  const wallet = await walletService.getWallet(req.user.id);
  return sendSuccess(res, 200, { balance: wallet.balance });
});

const addFunds = asyncHandler(async (req, res) => {
  const result = await walletService.addFunds(req.user.id, req.body.amount);
  return sendSuccess(res, 200, result, 'Stripe checkout session created successfully');
});

const verifySession = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  const result = await walletService.verifySession(req.user.id, sessionId);
  const isSuccess = result.transaction.status === 'success';
  const message = isSuccess ? 'Funds added successfully' : 'Payment was not successful';
  return sendSuccess(res, 200, result, message);
});

module.exports = { getWallet, addFunds, verifySession };
