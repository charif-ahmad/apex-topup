const app = require('./src/app');
const env = require('./src/config/env');
const prisma = require('./src/config/prisma');

const server = app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`APEX Top-Up API running on http://localhost:${env.port}`);
});

async function shutdown(signal) {
  // eslint-disable-next-line no-console
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(sig)));

module.exports = server;
