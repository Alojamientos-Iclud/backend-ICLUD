const express = require("express");
const prisma = require("../lib/prisma");
const router = express.Router();

router.get("/", async (req, res) => {
    try {

        const hoteles = await prisma.hotel.findMany({
            orderBy: {
                id: "desc"
            }
        });

        res.json(hoteles);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error al obtener hoteles"
        });

    }
});

router.post("/", async (req, res) => {

    try {

        const {
            nombre,
            localizacion,
            cantidad_habitaciones,
            imagen_h,
            descripcion,
            precio,
            tiene_catering,
            fecha_subido,
            fecha_actualizado,
        } = req.body;

        const hotel = await prisma.hotel.create({
            data: {
                nombre,
                localizacion,
                cantidad_habitaciones: Number(cantidad_habitaciones),
                imagen_h,
                descripcion,
                precio: precio ? Number(precio) : 0.0,
                tiene_catering: tiene_catering ? Boolean(tiene_catering) : false,
                fecha_subido: fecha_subido ? new Date(fecha_subido) : new Date(),
                fecha_actualizado: fecha_actualizado ? new Date(fecha_actualizado) : new Date()
            }
        });

        res.status(201).json(hotel);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error al crear hotel"
        });

    }
});

router.delete("/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        await prisma.hotel.delete({
            where: {
                id
            }
        });

        res.json({
            mensaje: "Hotel eliminado"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error al eliminar hotel"
        });

    }
});

module.exports = router;
