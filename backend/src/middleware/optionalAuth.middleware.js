const { verifyToken } = require('../utils/jwt');
const prisma = require('../config/prisma');

// Populates req.user if a valid Bearer token is present; never rejects.
async function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return next();

  try {
    const payload = verifyToken(header.slice(7).trim());
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (user && !user.isBlocked) {
      req.user = { id: user.id, role: user.role, email: user.email };
    }
  } catch (err) {
    // Ignore invalid tokens for optional auth.
  }
  return next();
}

module.exports = optionalAuth;
