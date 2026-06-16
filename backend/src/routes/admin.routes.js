const express = require('express');
const authenticate = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');
const {
  listUsersSchema,
  userIdParamSchema,
  blockUserSchema,
} = require('../validators/admin.validator');
const { listTransactionsSchema } = require('../validators/transaction.validator');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

// All admin routes require an authenticated admin.
router.use(authenticate, requireRole('admin'));

router.get('/users', validate(listUsersSchema), adminController.listUsers);
router.patch('/users/:id/block', validate(blockUserSchema), adminController.blockUser);
router.delete('/users/:id', validate(userIdParamSchema), adminController.deleteUser);
router.get('/transactions', validate(listTransactionsSchema), adminController.listAllTransactions);
router.get('/analytics', adminController.getAnalytics);

module.exports = router;
