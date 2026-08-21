require("dotenv").config();

const express = require("express");
const cors = require("cors");

const hotelesRouter = require("./src/routes/hoteles");
const checkoutRouter = require("./src/routes/checkout");
const authRouter = require("./src/routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/hoteles", hotelesRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/admin", authRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});