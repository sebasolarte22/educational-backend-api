const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");

// GET todos + filtros
router.get("/", async (req, res) => {
  try {
    const { materia, nivel, ordenar, page, limit } = req.query;

    // VALIDACIONES
    if (limit && isNaN(limit)) {
      return res.status(400).json({ error: "Limit debe ser un numero" });
    }

    if (page && isNaN(page)) {
      return res.status(400).json({ error: "Page debe ser un numero" });
    }

    const limitNum = limit ? parseInt(limit) : 5;
    const pageNum = page ? parseInt(page) : 1;

    if (limitNum < 1 || limitNum > 50) {
      return res.status(400).json({ error: "Limit invalido" });
    }

    if (pageNum < 1) {
      return res.status(400).json({ error: "Page invalido" });
    }

    if (ordenar && !["vistas"].includes(ordenar)) {
      return res.status(400).json({ error: "Vistas invalidas" });
    }

    if (materia && materia.trim() === "") {
      return res.status(400).json({ error: "Materia vacio" });
    }

    if (nivel && nivel.trim() === "") {
      return res.status(400).json({ error: "Nivel vacio" });
    }

    // SQL
    let query = `
      SELECT * FROM cursos
      WHERE categoria='matematicas'
    `;

    const params = [];
    let paramIndex = 1;

    if (materia) {
      query += ` AND LOWER(materia) = LOWER($${paramIndex++})`;
      params.push(materia);
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

    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(limitNum, offset);

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cursos no encontrados" });
  }
});

// GET POR ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // VALIDACION POR ID
    if (isNaN(id) || parseInt(id) < 1) {
      return res.status(400).json({ error: "ID invalido" });
    }

    const result = await pool.query(
      `SELECT * FROM cursos 
      WHERE id=$1 AND categoria='matematicas'`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No se encontro el curso" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el curso" });
  }
});

// POST crear
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { titulo, materia, nivel, vistas } = req.body;

    if (!titulo || !materia || !nivel) {
      return res.status(400).json({
        error: "Titulo, materia y nivel son obligatorias"
      });
    }

    if (
      typeof titulo !== "string" ||
      typeof materia !== "string" ||
      typeof nivel !== "string"
    ) {
      return res.status(400).json({
        error: "Titulo, materia y nivel deben ser caracteres"
      });
    }

    if (
      titulo.trim() === "" ||
      materia.trim() === "" ||
      nivel.trim() === ""
    ) {
      return res.status(400).json({ error: "Campos vacios no permitidos" });
    }

    if (vistas !== undefined && (typeof vistas !== "number" || vistas < 0)) {
      return res.status(400).json({ error: "Vistas invalidas" });
    }

    const result = await pool.query(
      `INSERT INTO cursos (titulo, categoria, materia, vistas, nivel)
       VALUES ($1, 'matematicas', $2, $3, $4)
       RETURNING *`,
      [titulo.trim(), materia.trim(), vistas || 0, nivel.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear el curso" });
  }
});

// PUT
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, materia, vistas, nivel } = req.body;

    if (!titulo || !materia || !nivel) {
      return res.status(400).json({
        error: "Titutlo, materia y nivel son obligatorios"
      });
    }

    if (
      typeof titulo !== "string" ||
      typeof materia !== "string" ||
      typeof nivel !== "string"
    ) {
      return res.status(400).json({
        error: "Titulo, materia y nivel deben ser caracteres"
      });
    }

    if (
      titulo.trim() === "" ||
      materia.trim() === "" ||
      nivel.trim() === ""
    ) {
      return res.status(400).json({
        error: "Titulo, materia y nivel no pueden quedar vacios"
      });
    }

    if (vistas !== undefined && (typeof vistas !== "number" || vistas < 0)) {
      return res.status(400).json({ error: "Vistas invalidas" });
    }

    const result = await pool.query(
      `UPDATE cursos
      SET titulo=$1, materia=$2, vistas=$3, nivel=$4
      WHERE id=$5 AND categoria='matematicas'
      RETURNING *`,
      [titulo.trim(), materia.trim(), vistas || 0, nivel.trim(), id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "curso no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar el curso" });
  }
});

// PATCH
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id) || parseInt(id) < 1) {
      return res.status(400).json({ error: "ID invalido" });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "No hay datos para actualizar" });
    }

    const { titulo, materia, vistas, nivel } = req.body;

    if (
      titulo !== undefined &&
      (typeof titulo !== "string" || titulo.trim() === "")
    ) {
      return res.status(400).json({ error: "Titulo invalido" });
    }

    if (
      materia !== undefined &&
      (typeof materia !== "string" || materia.trim() === "")
    ) {
      return res.status(400).json({ error: "Materia invalida" });
    }

    if (vistas !== undefined && (typeof vistas !== "number" || vistas < 0)) {
      return res.status(400).json({ error: "Vistas invalidas" });
    }

    if (
      nivel !== undefined &&
      (typeof nivel !== "string" || nivel.trim() === "")
    ) {
      return res.status(400).json({ error: "Nivel invalido" });
    }

    const cursoActual = await pool.query(
      `SELECT * FROM cursos 
      WHERE id=$1 AND categoria='matematicas'`,
      [id]
    );

    if (cursoActual.rowCount === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    const curso = cursoActual.rows[0];
    const actualizado = { ...curso, ...req.body };

    const result = await pool.query(
      `UPDATE cursos 
      SET titulo=$1, materia=$2, vistas=$3, nivel=$4
      WHERE id=$5
       RETURNING *`,
      [
        actualizado.titulo,
        actualizado.materia,
        actualizado.vistas,
        actualizado.nivel,
        id
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al modificar el curso" });
  }
});

// DELETE
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id) || parseInt(id) < 1) {
      return res.status(400).json({ error: "ID invalido" });
    }

    const result = await pool.query(
      `DELETE FROM cursos
      WHERE id=$1 AND categoria='matematicas'
       RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar el curso" });
  }
});

module.exports = router;
