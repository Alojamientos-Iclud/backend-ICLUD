const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

// Fuente única de verdad: DATABASE_URL.
// En Neon el host con "-pooler" es la conexión por pgbouncer (ideal para serverless).
// Si DATABASE_URL viene sin "-pooler", lo agregamos sobre el MISMO endpoint, así
// el runtime y las migraciones siempre apuntan a la misma base.
function urlRuntime() {
    const base =
        process.env.DATABASE_URL ||
        process.env.DATABASE_URL_UNPOOLED ||
        process.env.DATABASE_URL_POOLED;

    if (!base) {
        console.error("Falta la variable de entorno DATABASE_URL");
        return undefined;
    }

    const u = new URL(base);
    const [endpoint, ...resto] = u.hostname.split(".");

    if (u.hostname.endsWith(".neon.tech") && !endpoint.endsWith("-pooler")) {
        u.hostname = [`${endpoint}-pooler`, ...resto].join(".");
    }

    u.searchParams.delete("channel_binding");
    u.searchParams.set("sslmode", "verify-full"); // mismo comportamiento que 'require' en pg, sin el warning

    return u.toString();
}

const connectionString = urlRuntime();

// Una sola instancia compartida (evita agotar conexiones entre rutas / invocaciones).
const globalForPrisma = globalThis;

const prisma =
    globalForPrisma.__prisma ||
    new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

globalForPrisma.__prisma = prisma;

// Solo para el diagnóstico: endpoint de Neon que se está usando (sin credenciales).
prisma.__endpoint = connectionString ? new URL(connectionString).hostname.split(".")[0] : null;

module.exports = prisma;
