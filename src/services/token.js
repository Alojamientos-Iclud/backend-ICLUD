const crypto = require("crypto");

/*
    Tokens de sesión firmados (HMAC-SHA256), sin dependencias extra.
    Formato: base64url(payload).base64url(firma)

    Definí AUTH_SECRET en el .env (cualquier string largo y aleatorio).
    Si no está definida se deriva de DATABASE_URL, pero es mejor tener una propia.
*/
const DURACION_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

function secreto() {
    return process.env.AUTH_SECRET ||
        crypto.createHash("sha256").update("iclud-auth:" + String(process.env.DATABASE_URL || "")).digest("hex");
}

function firmar(dato) {
    return crypto.createHmac("sha256", secreto()).update(dato).digest("base64url");
}

function firmarToken(usuario) {
    const payload = {
        id: usuario.id,
        gmail: usuario.gmail,
        estatus: usuario.estatus,
        exp: Date.now() + DURACION_MS
    };
    const cuerpo = Buffer.from(JSON.stringify(payload)).toString("base64url");
    return `${cuerpo}.${firmar(cuerpo)}`;
}

function verificarToken(token) {
    try {
        const [cuerpo, firma] = String(token).split(".");
        if (!cuerpo || !firma) return null;

        const esperada = firmar(cuerpo);
        const a = Buffer.from(firma);
        const b = Buffer.from(esperada);
        if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

        const payload = JSON.parse(Buffer.from(cuerpo, "base64url").toString("utf-8"));
        if (!payload.exp || payload.exp < Date.now()) return null;

        return payload;
    } catch {
        return null;
    }
}

module.exports = { firmarToken, verificarToken };
