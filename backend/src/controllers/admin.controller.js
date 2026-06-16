const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const adminService = require('../services/admin.service');
const transactionService = require('../services/transaction.service');

const listUsers = asyncHandler(async (req, res) => {
  const { page, limit } = req.validatedQuery;
  const result = await adminService.listUsers({ page, limit });
  return sendSuccess(res, 200, result);
});

const blockUser = asyncHandler(async (req, res) => {
  const isBlocked = req.body.isBlocked !== undefined ? Boolean(req.body.isBlocked) : true;
  const user = await adminService.setBlocked(req.params.id, isBlocked);
  return sendSuccess(res, 200, user, isBlocked ? 'User blocked' : 'User unblocked');
});

const deleteUser = asyncHandler(async (req, res) => {
  const result = await adminService.deleteUser(req.params.id);
  return sendSuccess(res, 200, result, 'User deleted');
});

const listAllTransactions = asyncHandler(async (req, res) => {
  const { page, limit, type, status, from, to } = req.validatedQuery;
  const result = await transactionService.listTransactions({ page, limit, type, status, from, to });
  return sendSuccess(res, 200, result);
});

const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await adminService.getAnalytics();
  return sendSuccess(res, 200, analytics);
});

module.exports = { listUsers, blockUser, deleteUser, listAllTransactions, getAnalytics };
