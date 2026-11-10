require("dotenv").config();

const express = require("express");
const cors = require("cors");

const hotelesRouter = require("./src/routes/hoteles");
const checkoutRouter = require("./src/routes/checkout");
const authRouter = require("./src/routes/auth");
const ofertasRouter = require("./src/routes/ofertas");
const favoritosRouter = require("./src/routes/favoritos");
const requireAuth = require("./src/middleware/requireAuth");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true 
}));
app.use(express.json());

app.use("/api/hoteles", hotelesRouter);
app.use("/api/checkout", requireAuth, checkoutRouter);
app.use("/api/admin", authRouter);
app.use("/api/auth", authRouter);
app.use("/api/ofertas", ofertasRouter);
app.use("/api/favoritos", requireAuth, favoritosRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});