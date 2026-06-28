const express = require('express');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { addFundsSchema, verifySessionSchema } = require('../validators/wallet.validator');
const walletController = require('../controllers/wallet.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', walletController.getWallet);
router.post('/add', validate(addFundsSchema), walletController.addFunds);
router.post('/verify-session', validate(verifySessionSchema), walletController.verifySession);

module.exports = router;
