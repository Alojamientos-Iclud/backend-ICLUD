const { verificarToken } = require("../services/token");

module.exports = function requireAuth(req, res, next) {
    const [tipo, token] = String(req.headers.authorization || "").split(" ");
    const payload = tipo === "Bearer" && token ? verificarToken(token) : null;

    if (!payload) {
        return res.status(401).json({ error: "Tenés que iniciar sesión para hacer esto" });
    }

    req.usuario = payload;
    next();
};
