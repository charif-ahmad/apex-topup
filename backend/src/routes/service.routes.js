const express = require('express');
const authenticate = require('../middleware/auth.middleware');
const optionalAuth = require('../middleware/optionalAuth.middleware');
const requireRole = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');
const {
  createServiceSchema,
  updateServiceSchema,
  serviceIdParamSchema,
} = require('../validators/service.validator');
const serviceController = require('../controllers/service.controller');

const router = express.Router();

// Public listing (optionalAuth so admins can pass ?all=true).
router.get('/', optionalAuth, serviceController.listServices);

// Admin-only management.
router.post('/', authenticate, requireRole('admin'), validate(createServiceSchema), serviceController.createService);
router.put('/:id', authenticate, requireRole('admin'), validate(updateServiceSchema), serviceController.updateService);
router.delete('/:id', authenticate, requireRole('admin'), validate(serviceIdParamSchema), serviceController.deleteService);

module.exports = router;
