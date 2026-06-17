require("dotenv").config();

const express = require("express");
const cors = require("cors");

const hotelesRouter = require("./routes/hoteles");
const checkoutRouter = require("./routes/checkout");

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5500"
}));

app.use(express.json());

app.use("/api/hoteles", hotelesRouter);
app.use("/api/checkout", checkoutRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});