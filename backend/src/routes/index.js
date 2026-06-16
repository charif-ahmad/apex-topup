const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const walletRoutes = require('./wallet.routes');
const transactionRoutes = require('./transaction.routes');
const serviceRoutes = require('./service.routes');
const topupRoutes = require('./topup.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'ok', data: { uptime: process.uptime() } });
});

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/wallet', walletRoutes);
router.use('/transactions', transactionRoutes);
router.use('/services', serviceRoutes);
router.use('/topup', topupRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
