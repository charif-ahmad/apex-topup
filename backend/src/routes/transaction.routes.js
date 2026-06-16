const express = require('express');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { listTransactionsSchema } = require('../validators/transaction.validator');
const transactionController = require('../controllers/transaction.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', validate(listTransactionsSchema), transactionController.listMyTransactions);

module.exports = router;
