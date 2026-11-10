const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

// En serverless conviene la conexión "pooled" de Neon (pgbouncer).
const connectionString = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL;

// Una sola instancia compartida (evita agotar conexiones entre rutas / invocaciones).
const globalForPrisma = globalThis;

const prisma =
    globalForPrisma.__prisma ||
    new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

globalForPrisma.__prisma = prisma;

module.exports = prisma;
