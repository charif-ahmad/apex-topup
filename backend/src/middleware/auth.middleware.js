const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { verifyToken } = require('../utils/jwt');
const prisma = require('../config/prisma');

// Verifies the Bearer JWT, loads the user, and attaches req.user.
const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Authentication token missing');
  }

  const token = header.slice(7).trim();
  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired token');
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    throw ApiError.unauthorized('User no longer exists');
  }
  if (user.isBlocked) {
    throw ApiError.forbidden('Account is blocked');
  }

  req.user = { id: user.id, role: user.role, email: user.email };
  next();
});

module.exports = authenticate;
