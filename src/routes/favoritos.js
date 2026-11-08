const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL) });
const router = express.Router();

/*
    Favoritos de hoteles del catálogo propio.

    Reutiliza la tabla Favorito (la misma del metabuscador). Para distinguir los
    hoteles de nuestro catálogo, urlOrigen se guarda como "iclud:hotel:<id>" y
    estas rutas solo leen/escriben las filas con ese prefijo.

    Todas las rutas exigen sesión (requireAuth se aplica en server.js).
*/
const PREFIJO = "iclud:hotel:";

/*
    GET /api/favoritos

    Devuelve los hoteles favoritos del usuario logueado (datos actuales del hotel),
    del más recientemente guardado al más antiguo.
*/
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

/*
    POST /api/favoritos   body: { hotelId }

    Marca un hotel como favorito (si ya lo era, no hace nada).
*/
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

/*
    DELETE /api/favoritos/:hotelId

    Quita un hotel de los favoritos del usuario.
*/
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
