const express = require("express");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL) });
const router = express.Router();

/*
    POST /api/admin/login (pongan eso cada vez que hagan un endpoint con esta API)

    Verifica credenciales y rol de administrador en un solo paso.
    No genera sesión ni token: como admin.html es la única pantalla protegida
    por ahora, autenticación y autorización ocurren juntas acá.
*/
router.post("/login", async (req, res) => {

    try {

        const { gmail, password } = req.body;

        if (!gmail || !password) {
            return res.status(400).json({ error: "Faltan credenciales" });
        }

        const usuario = await prisma.usuario.findFirst({
            where: { gmail }
        });

        if (!usuario) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        if (usuario.estatus !== "admin") {
            return res.status(403).json({ error: "No tenés permisos para acceder" });
        }

        res.json({ mensaje: "Acceso concedido" });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error al verificar credenciales"
        });

    }
});

module.exports = router;