const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const transactionService = require('../services/transaction.service');

const listMyTransactions = asyncHandler(async (req, res) => {
  const { page, limit, type, status, from, to } = req.validatedQuery;
  const result = await transactionService.listTransactions({
    userId: req.user.id,
    page,
    limit,
    type,
    status,
    from,
    to,
  });
  return sendSuccess(res, 200, result);
});

const getMySummary = asyncHandler(async (req, res) => {
  const result = await transactionService.getSummary({ userId: req.user.id });
  return sendSuccess(res, 200, result);
});

module.exports = { listMyTransactions, getMySummary };
