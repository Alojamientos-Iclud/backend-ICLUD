const express = require("express");
const prisma = require("../lib/prisma");
const router = express.Router();

const PREFIJO = "iclud:hotel:";

router.get("/", async (req, res) => {
    try {
        const favoritos = await prisma.favorito.findMany({
            where: { idUsuario: req.usuario.id, urlOrigen: { startsWith: PREFIJO } },
            orderBy: { fechaGuardado: "desc" }
        });

        const ids = favoritos
            .map(f => Number(f.urlOrigen.slice(PREFIJO.length)))
            .filter(Number.isInteger);

        const hoteles = await prisma.hotel.findMany({ where: { id: { in: ids } } });
        const porId = new Map(hoteles.map(h => [h.id, h]));

        res.json(ids.map(id => porId.get(id)).filter(Boolean));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener favoritos" });
    }
});

router.post("/", async (req, res) => {
    try {
        const hotelId = Number(req.body.hotelId);
        if (!Number.isInteger(hotelId)) {
            return res.status(400).json({ error: "hotelId inválido" });
        }

        const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
        if (!hotel) {
            return res.status(404).json({ error: "El hotel no existe" });
        }

        const urlOrigen = PREFIJO + hotel.id;
        const datos = {
            nombreAlojamiento: hotel.nombre,
            precio: hotel.precio,
            imagenUrl: hotel.imagen_h
        };

        await prisma.favorito.upsert({
            where: { idUsuario_urlOrigen: { idUsuario: req.usuario.id, urlOrigen } },
            update: datos,
            create: { idUsuario: req.usuario.id, urlOrigen, ...datos }
        });

        res.status(201).json({ mensaje: "Agregado a favoritos" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al agregar favorito" });
    }
});

router.delete("/:hotelId", async (req, res) => {
    try {
        const hotelId = Number(req.params.hotelId);
        if (!Number.isInteger(hotelId)) {
            return res.status(400).json({ error: "hotelId inválido" });
        }

        await prisma.favorito.deleteMany({
            where: { idUsuario: req.usuario.id, urlOrigen: PREFIJO + hotelId }
        });

        res.json({ mensaje: "Quitado de favoritos" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al quitar favorito" });
    }
});

module.exports = router;
