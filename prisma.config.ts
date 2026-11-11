import "dotenv/config";
import { defineConfig } from "prisma/config";

// Las migraciones usan la conexión DIRECTA (sin "-pooler") del MISMO endpoint que usa
// el backend en runtime (DATABASE_URL), para que migrate y la app nunca apunten a bases distintas.
function urlDirecta(): string {
  const base =
    process.env.DATABASE_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.DATABASE_URL_POOLED;

  // Sin variable (p. ej. `prisma generate` durante el build) no hace falta conectar.
  if (!base) return "postgresql://placeholder:placeholder@localhost:5432/placeholder";

  const u = new URL(base);
  const [endpoint, ...resto] = u.hostname.split(".");
  if (u.hostname.endsWith(".neon.tech") && endpoint.endsWith("-pooler")) {
    u.hostname = [endpoint.replace(/-pooler$/, ""), ...resto].join(".");
  }
  u.searchParams.delete("channel_binding");
  return u.toString();
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: urlDirecta() },
});
