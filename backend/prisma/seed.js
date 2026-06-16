require('dotenv').config();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

const services = [
  { name: 'Orange 10 Mobile Recharge', category: 'mobile', price: 10.0, provider: 'Orange' },
  { name: 'Vodafone 25 Mobile Recharge', category: 'mobile', price: 25.0, provider: 'Vodafone' },
  { name: 'Etisalat 50 Mobile Recharge', category: 'mobile', price: 50.0, provider: 'Etisalat' },
  { name: 'Fiber 100GB Internet Pack', category: 'internet', price: 30.0, provider: 'WE' },
  { name: 'Fiber 500GB Internet Pack', category: 'internet', price: 75.0, provider: 'WE' },
  { name: 'Steam Gift Card $20', category: 'giftcard', price: 20.0, provider: 'Steam' },
  { name: 'PlayStation Gift Card $50', category: 'giftcard', price: 50.0, provider: 'Sony' },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@apex.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const adminName = process.env.ADMIN_NAME || 'Apex Admin';

  const hashed = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: adminName,
      email: adminEmail,
      password: hashed,
      role: 'admin',
      wallet: { create: { balance: 0 } },
    },
    include: { wallet: true },
  });
  console.log(`Admin ready: ${admin.email} (id=${admin.id})`);

  for (const svc of services) {
    const existing = await prisma.service.findFirst({ where: { name: svc.name } });
    if (existing) {
      await prisma.service.update({ where: { id: existing.id }, data: svc });
    } else {
      await prisma.service.create({ data: svc });
    }
  }
  console.log(`Seeded ${services.length} services.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
