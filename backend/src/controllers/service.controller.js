const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const serviceService = require('../services/service.service');

const listServices = asyncHandler(async (req, res) => {
  // Admins may request all services (including inactive) via ?all=true.
  const includeInactive = req.user && req.user.role === 'admin' && req.query.all === 'true';
  const services = await serviceService.listServices({ includeInactive });
  return sendSuccess(res, 200, { services });
});

const createService = asyncHandler(async (req, res) => {
  const service = await serviceService.createService(req.body);
  return sendSuccess(res, 201, service, 'Service created');
});

const updateService = asyncHandler(async (req, res) => {
  const service = await serviceService.updateService(Number(req.params.id), req.body);
  return sendSuccess(res, 200, service, 'Service updated');
});

const deleteService = asyncHandler(async (req, res) => {
  const result = await serviceService.deleteService(Number(req.params.id));
  const message = result.softDeleted
    ? 'Service deactivated (referenced by transactions)'
    : 'Service deleted';
  return sendSuccess(res, 200, result, message);
});

module.exports = { listServices, createService, updateService, deleteService };
