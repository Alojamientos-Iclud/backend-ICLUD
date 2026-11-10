// Solo para desarrollo local y Docker. En Vercel se usa app.js (exporta la app).
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});

module.exports = app;
