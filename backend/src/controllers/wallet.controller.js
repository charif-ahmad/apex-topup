const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const walletService = require('../services/wallet.service');

const getWallet = asyncHandler(async (req, res) => {
  const wallet = await walletService.getWallet(req.user.id);
  return sendSuccess(res, 200, { balance: wallet.balance });
});

const addFunds = asyncHandler(async (req, res) => {
  const result = await walletService.addFunds(req.user.id, req.body.amount);
  const message =
    result.paymentStatus === 'success' ? 'Funds added successfully' : 'Payment failed';
  return sendSuccess(res, 200, result, message);
});

module.exports = { getWallet, addFunds };
