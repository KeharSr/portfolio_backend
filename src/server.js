const app = require('./app');
const prisma = require('./config/prisma');
const { port } = require('./config/env');

const server = app.listen(port, () => {
  console.log(`Portfolio API running on http://localhost:${port}/api`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
