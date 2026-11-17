const express = require("express");
const prisma = require("../lib/prisma");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.patch("/usuarios/:id/estado", requireAuth, async (req, res) => {
    if (req.usuario.estatus !== "admin") {
        return res.status(403).json({ error: "Solo un administrador puede modificar estados de usuario" });
    }

    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) {
        return res.status(400).json({ error: "El id del usuario no es válido" });
    }

    if (typeof req.body.estado !== "boolean") {
        return res.status(400).json({ error: "El estado debe ser true (desbloqueado) o false (bloqueado)" });
    }

    try {
        const usuario = await prisma.usuario.update({
            where: { id },
            data: { estado: req.body.estado },
            select: { id: true, gmail: true, estado: true }
        });

        return res.json({
            mensaje: req.body.estado ? "Usuario desbloqueado correctamente" : "Usuario bloqueado correctamente",
            usuario
        });
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "No se encontró el usuario" });
        }

        console.error(error);
        return res.status(500).json({ error: "Error al modificar el estado del usuario" });
    }
});

module.exports = router;