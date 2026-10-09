const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const FILE_PATH = path.join(process.cwd(), "ofertas_pendientes.json");

function leerOfertas() {
    try {
        if (!fs.existsSync(FILE_PATH)) {
            fs.writeFileSync(FILE_PATH, "[]", "utf-8");
            return [];
        }
        const contenido = fs.readFileSync(FILE_PATH, "utf-8");
        return JSON.parse(contenido || "[]");
    } catch (error) {
        console.error("Error al leer el archivo JSON de ofertas:", error);
        return [];
    }
}

function guardarOfertas(ofertas) {
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(ofertas, null, 2), "utf-8");
    } catch (error) {
        console.error("Error al escribir en ofertas_pendientes.json:", error);
    }
}

// 1. GET /api/ofertas -> Leer pendientes
router.get("/", (req, res) => {
    try {
        const ofertas = leerOfertas();
        res.json(ofertas);
    } catch (error) {
        console.error("Error en GET /api/ofertas:", error);
        res.status(500).json({ error: "Error al obtener ofertas pendientes." });
    }
});

// 2. POST /api/ofertas -> Guardar propuesta temporal
router.post("/", (req, res) => {
    try {
        const { nombre, localizacion, cantidad_habitaciones, imagen_h, descripcion, precio } = req.body;
        const ofertas = leerOfertas();

        const nuevaOferta = {
            id: Date.now(),
            nombre,
            localizacion,
            cantidad_habitaciones: Number(cantidad_habitaciones) || 0,
            imagen_h: imagen_h || null,
            descripcion: descripcion || "",
            precio: Number(precio) || 0,
            fecha_subido: new Date().toISOString()
        };

        ofertas.push(nuevaOferta);
        guardarOfertas(ofertas);

        res.status(201).json({ mensaje: "Oferta guardada temporalmente", oferta: nuevaOferta });
    } catch (error) {
        console.error("Error al registrar oferta:", error);
        res.status(500).json({ error: "No se pudo registrar la oferta." });
    }
});

// 3. DELETE /api/ofertas/:id -> Eliminar oferta (usado al rechazar o tras aprobar)
router.delete("/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        let ofertas = leerOfertas();

        const existe = ofertas.some(o => Number(o.id) === id);
        if (!existe) {
            return res.status(404).json({ error: "La oferta no existe o ya fue eliminada." });
        }

        ofertas = ofertas.filter(o => Number(o.id) !== id);
        guardarOfertas(ofertas);

        res.json({ mensaje: "Oferta eliminada de pendientes." });
    } catch (error) {
        console.error("Error al eliminar oferta:", error);
        res.status(500).json({ error: "Error al eliminar la oferta." });
    }
});

module.exports = router;