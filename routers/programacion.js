const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const isAdminOrOwner = require("../middlewares/isAdminOrOwner");


// GET TODOS + FILTROS
// ==========================
router.get("/", async (req, res) => {
  try {
    const { lenguaje, nivel, ordenar, page, limit } = req.query;

    // ==========================
    // VALIDACIONES
    // ==========================
    if (page && isNaN(page)) {
      return res.status(400).json({ error: "page debe ser un número" });
    }

    if (limit && isNaN(limit)) {
      return res.status(400).json({ error: "limit debe ser un número" });
    }

    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 5;

    if (pageNum < 1) {
      return res.status(400).json({ error: "page debe ser mayor o igual a 1" });
    }

    if (limitNum < 1 || limitNum > 50) {
      return res.status(400).json({ error: "limit fuera de rango" });
    }

    if (ordenar && !["vistas"].includes(ordenar)) {
      return res.status(400).json({ error: "ordenar inválido" });
    }

    if (lenguaje && lenguaje.trim() === "") {
      return res.status(400).json({ error: "lenguaje vacío" });
    }

    if (nivel && nivel.trim() === "") {
      return res.status(400).json({ error: "nivel vacío" });
    }

    // ==========================
    // SQL
    // ==========================
    let query = `
      SELECT * FROM cursos
      WHERE categoria = 'programacion'
    `;

    const params = [];
    let paramIndex = 1;

    if (lenguaje) {
      query += ` AND LOWER(lenguaje) = LOWER($${paramIndex++})`;
      params.push(lenguaje);
    }

    if (nivel) {
      query += ` AND LOWER(nivel) = LOWER($${paramIndex++})`;
      params.push(nivel);
    }

    if (ordenar === "vistas") {
      query += ` ORDER BY vistas DESC`;
    } else {
      query += ` ORDER BY id ASC`;
    }

    const offset = (pageNum - 1) * limitNum;

    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limitNum, offset);

    const result = await pool.query(query, params);
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener cursos" });
  }
});


// GET POR ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id) || parseInt(id) < 1) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const result = await pool.query(
      `SELECT * FROM cursos
      WHERE id = $1 AND categoria = 'programacion'`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el curso" });
  }
});


// ==========================
// POST - CREAR CURSO
// ==========================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { titulo, lenguaje, vistas, nivel } = req.body;

    // validaciones 
    if (!titulo || !lenguaje || !nivel) {
      return res.status(400).json({
        error: "titulo, lenguaje y nivel son obligatorios"
      });
    }

    if (
      typeof titulo !== "string" ||
      typeof lenguaje !== "string" ||
      typeof nivel !== "string"
    ) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    if (titulo.trim() === "" || lenguaje.trim() === "" || nivel.trim() === "") {
      return res.status(400).json({ error: "Campos vacíos no permitidos" });
    }

    if (vistas !== undefined && (typeof vistas !== "number" || vistas < 0)) {
      return res.status(400).json({ error: "vistas inválidas" });
    }

    const result = await pool.query(
      `INSERT INTO cursos (titulo, categoria, lenguaje, vistas, nivel, created_by)
      VALUES ($1, 'programacion', $2, $3, $4, $5)
      RETURNING *`,
      [titulo.trim(), lenguaje.trim(), vistas || 0, nivel.trim(), req.user.id]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear curso" });
  }
});


// ==========================
// PUT - REEMPLAZO COMPLETO
// ==========================
router.put("/:id", authMiddleware, isAdminOrOwner, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, lenguaje, vistas, nivel } = req.body;

    if (isNaN(id) || parseInt(id) < 1) {
      return res.status(400).json({ error: "ID inválido" });
    }

    if (!titulo || !lenguaje || !nivel) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios en PUT"
      });
    }

    if (
      typeof titulo !== "string" ||
      typeof lenguaje !== "string" ||
      typeof nivel !== "string"
    ) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    if (
      titulo.trim() === "" ||
      lenguaje.trim() === "" ||
      nivel.trim() === ""
    ) {
      return res.status(400).json({ error: "Campos vacíos no permitidos" });
    }

    if (vistas !== undefined && (typeof vistas !== "number" || vistas < 0)) {
      return res.status(400).json({ error: "vistas inválidas" });
    }

    const result = await pool.query(
      `UPDATE cursos
      SET titulo=$1, lenguaje=$2, vistas=$3, nivel=$4
      WHERE id=$5 AND categoria='programacion'
      RETURNING *`,
      [titulo.trim(), lenguaje.trim(), vistas || 0, nivel.trim(), id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: "Error al actualizar curso" });
  }
});


// ==========================
// PATCH - ACTUALIZACIÓN PARCIAL
// ==========================
router.patch("/:id", authMiddleware, isAdminOrOwner, async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id) || parseInt(id) < 1) {
      return res.status(400).json({ error: "ID inválido" });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "No hay datos para actualizar"
      });
    }

    const { titulo, lenguaje, vistas, nivel } = req.body;

    if (titulo !== undefined && 
      (typeof titulo !== "string" || titulo.trim() === "")) {
      return res.status(400).json({ error: "titulo inválido" });
    }

    if (lenguaje !== undefined && 
      (typeof lenguaje !== "string" || lenguaje.trim() === "")) {
      return res.status(400).json({ error: "lenguaje inválido" });
    }

    if (nivel !== undefined && 
      (typeof nivel !== "string" || nivel.trim() === "")) {
      return res.status(400).json({ error: "nivel inválido" });
    }

    if (vistas !== undefined && 
      (typeof vistas !== "number" || vistas < 0)) {
      return res.status(400).json({ error: "vistas inválidas" });
    }

    const cursoActual = await pool.query(
      `SELECT * FROM cursos WHERE id=$1 AND categoria='programacion'`,
      [id]
    );

    if (cursoActual.rowCount === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    const curso = cursoActual.rows[0];
    const actualizado = { ...curso, ...req.body };

    const result = await pool.query(
      `UPDATE cursos
      SET titulo=$1, lenguaje=$2, vistas=$3, nivel=$4
      WHERE id=$5
       RETURNING *`,
      [
        actualizado.titulo,
        actualizado.lenguaje,
        actualizado.vistas,
        actualizado.nivel,
        id
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: "Error al modificar curso" });
  }
});


// ==========================
// DELETE
// ==========================
router.delete("/:id", authMiddleware, isAdminOrOwner, async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id) || parseInt(id) < 1) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const result = await pool.query(
      `DELETE FROM cursos
      WHERE id=$1 AND categoria='programacion'
       RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: "Error al eliminar curso" });
  }
});

module.exports = router;
