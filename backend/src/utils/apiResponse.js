// Standardized success envelope: { success: true, message, data }.
function sendSuccess(res, statusCode, data = null, message = undefined) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

module.exports = { sendSuccess };
