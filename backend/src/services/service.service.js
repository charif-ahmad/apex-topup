const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const { serializeService } = require('../utils/serialize');

async function listServices({ includeInactive = false } = {}) {
  const where = includeInactive ? {} : { isActive: true };
  const services = await prisma.service.findMany({
    where,
    orderBy: { id: 'asc' },
  });
  return services.map(serializeService);
}

async function createService(data) {
  const service = await prisma.service.create({ data });
  return serializeService(service);
}

async function updateService(id, data) {
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Service not found');
  const service = await prisma.service.update({ where: { id }, data });
  return serializeService(service);
}

// Hard-delete when unreferenced; otherwise soft-delete (deactivate) to preserve
// transaction history integrity.
async function deleteService(id) {
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Service not found');

  const refCount = await prisma.transaction.count({ where: { serviceId: id } });
  if (refCount > 0) {
    await prisma.service.update({ where: { id }, data: { isActive: false } });
    return { id, softDeleted: true };
  }
  await prisma.service.delete({ where: { id } });
  return { id, softDeleted: false };
}

module.exports = { listServices, createService, updateService, deleteService };
