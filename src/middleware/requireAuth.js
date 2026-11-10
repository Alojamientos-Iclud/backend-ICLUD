const { verificarToken } = require("../services/token");

/*
    Exige un token válido en el header  Authorization: Bearer <token>.
    Si es válido deja los datos del usuario en req.usuario ({ id, gmail, estatus }).
*/
module.exports = function requireAuth(req, res, next) {
    const [tipo, token] = String(req.headers.authorization || "").split(" ");
    const payload = tipo === "Bearer" && token ? verificarToken(token) : null;

    if (!payload) {
        return res.status(401).json({ error: "Tenés que iniciar sesión para hacer esto" });
    }

    req.usuario = payload;
    next();
};
