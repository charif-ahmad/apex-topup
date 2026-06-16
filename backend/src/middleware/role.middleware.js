const ApiError = require('../utils/ApiError');

// Role-based access guard. Must run after the authenticate middleware.
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(ApiError.unauthorized());
  }
  if (!roles.includes(req.user.role)) {
    return next(ApiError.forbidden('Insufficient permissions'));
  }
  return next();
};

module.exports = requireRole;
