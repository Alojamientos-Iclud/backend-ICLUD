require("dotenv").config();

const express = require("express");
const cors = require("cors");

const hotelesRouter = require("./src/routes/hoteles");
const checkoutRouter = require("./src/routes/checkout");
const authRouter = require("./src/routes/auth");
const adminRouter = require("./src/routes/admin");
const ofertasRouter = require("./src/routes/ofertas");
const favoritosRouter = require("./src/routes/favoritos");
const requireAuth = require("./src/middleware/requireAuth");

const app = express();

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

app.use("/api/hoteles", hotelesRouter);
app.use("/api/checkout", requireAuth, checkoutRouter);
app.use("/api/admin", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);
app.use("/api/ofertas", ofertasRouter);
app.use("/api/favoritos", requireAuth, favoritosRouter);

module.exports = app;
