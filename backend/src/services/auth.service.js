const bcrypt = require('bcrypt');
const { Prisma } = require('@prisma/client');
const prisma = require('../config/prisma');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const { signToken } = require('../utils/jwt');

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

async function register({ name, email, password }) {
  const hashed = await bcrypt.hash(password, env.bcryptSaltRounds);

  let user;
  try {
    // Create user + wallet atomically.
    user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        wallet: { create: { balance: 0 } },
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw ApiError.conflict('Email is already registered');
    }
    throw err;
  }

  const token = signToken({ sub: user.id, role: user.role });
  return { user: publicUser(user), token };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw ApiError.unauthorized('Invalid credentials');
  }
  if (user.isBlocked) {
    throw ApiError.forbidden('Account is blocked');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const token = signToken({ sub: user.id, role: user.role });
  return { user: publicUser(user), token };
}

module.exports = { register, login, publicUser };
