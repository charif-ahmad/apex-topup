const express = require('express');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { addFundsSchema } = require('../validators/wallet.validator');
const walletController = require('../controllers/wallet.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', walletController.getWallet);
router.post('/add', validate(addFundsSchema), walletController.addFunds);

module.exports = router;
