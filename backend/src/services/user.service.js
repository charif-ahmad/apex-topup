const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const { publicUser } = require('./auth.service');

async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { wallet: true },
  });
  if (!user) throw ApiError.notFound('User not found');
  return {
    ...publicUser(user),
    balance: user.wallet ? Number(user.wallet.balance) : 0,
  };
}

async function updateProfile(userId, { name, email, password }) {
  const data = {};
  if (name !== undefined) data.name = name;
  if (email !== undefined) data.email = email;
  if (password !== undefined) {
    data.password = await bcrypt.hash(password, env.bcryptSaltRounds);
  }

  if (email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== userId) {
      throw ApiError.conflict('Email is already in use');
    }
  }

  const user = await prisma.user.update({ where: { id: userId }, data });
  return publicUser(user);
}

module.exports = { getProfile, updateProfile };
