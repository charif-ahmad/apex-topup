const express = require('express');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { topupSchema } = require('../validators/topup.validator');
const topupController = require('../controllers/topup.controller');

const router = express.Router();

router.post('/', authenticate, validate(topupSchema), topupController.executeTopup);

module.exports = router;
