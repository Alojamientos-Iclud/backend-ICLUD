require("dotenv").config();

const express = require("express");
const cors = require("cors");

const hotelesRouter = require("./src/routes/hoteles");
const checkoutRouter = require("./src/routes/checkout");
const authRouter = require("./src/routes/auth");
const ofertasRouter = require("./src/routes/ofertas");
const favoritosRouter = require("./src/routes/favoritos");
const requireAuth = require("./src/middleware/requireAuth");
const prisma = require("./src/lib/prisma");

const app = express();

// Orígenes permitidos: FRONTEND_URL (puede ser una lista separada por comas),
// el dominio de producción y localhost para desarrollo.
const normalizar = (url) => String(url || "").trim().replace(/\/+$/, "");

const origenesPermitidos = [
    ...String(process.env.FRONTEND_URL || "").split(",").map(normalizar),
    "https://iclud-sitio-web.vercel.app",
    "http://localhost:5173"
].filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        // Sin Origin (curl, health checks, server-to-server): permitir
        if (!origin || origenesPermitidos.includes(normalizar(origin))) {
            return callback(null, true);
        }
        return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.get("/", (req, res) => res.json({ ok: true, servicio: "ICLUD backend" }));
app.get("/api/health", (req, res) => res.json({ ok: true }));

// DIAGNÓSTICO TEMPORAL: solo responde si definís DEBUG_DB=1 en Vercel. Borralo cuando termines.
app.get("/api/health/db", async (req, res) => {
    if (process.env.DEBUG_DB !== "1") return res.status(404).json({ error: "No encontrado" });
    try {
        const tablas = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`;
        let hoteles = null;
        try { hoteles = (await prisma.hotel.count()); } catch { hoteles = "no se pudo contar"; }
        res.json({ endpoint: prisma.__endpoint, tablas: tablas.map(t => t.table_name), hoteles });
    } catch (error) {
        res.status(500).json({ endpoint: prisma.__endpoint, error: error.message });
    }
});


app.use("/api/hoteles", hotelesRouter);
app.use("/api/checkout", requireAuth, checkoutRouter);
app.use("/api/admin", authRouter);
app.use("/api/auth", authRouter);
app.use("/api/ofertas", ofertasRouter);
app.use("/api/favoritos", requireAuth, favoritosRouter);

module.exports = app;
