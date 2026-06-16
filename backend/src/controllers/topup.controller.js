const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const topupService = require('../services/topup.service');

const executeTopup = asyncHandler(async (req, res) => {
  const result = await topupService.purchase(req.user.id, req.body.serviceId);
  return sendSuccess(res, 200, result, 'Top-up successful');
});

module.exports = { executeTopup };
