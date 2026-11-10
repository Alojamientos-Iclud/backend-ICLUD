const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

// Las ofertas pendientes viven en la base de datos (en Vercel el disco es de solo lectura).

router.get("/", async (req, res) => {
    try {
        const ofertas = await prisma.ofertaPendiente.findMany({ orderBy: { id: "asc" } });
        res.json(ofertas);
    } catch (error) {
        console.error("Error en GET /api/ofertas:", error);
        res.status(500).json({ error: "Error al obtener ofertas pendientes." });
    }
});

router.post("/", async (req, res) => {
    try {
        const { nombre, localizacion, cantidad_habitaciones, imagen_h, descripcion, precio } = req.body;

        if (!nombre || !localizacion) {
            return res.status(400).json({ error: "Faltan el nombre o la localización." });
        }

        const oferta = await prisma.ofertaPendiente.create({
            data: {
                nombre,
                localizacion,
                cantidad_habitaciones: Number(cantidad_habitaciones) || 0,
                imagen_h: imagen_h || null,
                descripcion: descripcion || "",
                precio: Number(precio) || 0
            }
        });

        res.status(201).json({ mensaje: "Oferta guardada temporalmente", oferta });
    } catch (error) {
        console.error("Error al registrar oferta:", error);
        res.status(500).json({ error: "No se pudo registrar la oferta." });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            return res.status(400).json({ error: "ID inválido." });
        }

        const { count } = await prisma.ofertaPendiente.deleteMany({ where: { id } });
        if (count === 0) {
            return res.status(404).json({ error: "La oferta no existe o ya fue eliminada." });
        }

        res.json({ mensaje: "Oferta eliminada de pendientes." });
    } catch (error) {
        console.error("Error al eliminar oferta:", error);
        res.status(500).json({ error: "Error al eliminar la oferta." });
    }
});

module.exports = router;
