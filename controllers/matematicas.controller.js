const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

// ==========================
// GET TODOS
// ==========================
exports.getMatematicas = asyncHandler(async (req, res) => {

  const { materia, nivel, ordenar, page, limit } = req.query;

  const pageNum = page ? parseInt(page) : 1;
  const limitNum = limit ? parseInt(limit) : 5;

  if (pageNum < 1) throw new AppError("page inválido", 400);
  if (limitNum < 1 || limitNum > 50) throw new AppError("limit fuera de rango", 400);

  let query = `SELECT * FROM cursos WHERE categoria='matematicas'`;
  const params = [];
  let i = 1;

  if (materia) {
    query += ` AND LOWER(materia)=LOWER($${i++})`;
    params.push(materia);
  }

  if (nivel) {
    query += ` AND LOWER(nivel)=LOWER($${i++})`;
    params.push(nivel);
  }

  query += ordenar === "vistas"
    ? " ORDER BY vistas DESC"
    : " ORDER BY id ASC";

  const offset = (pageNum - 1) * limitNum;

  query += ` LIMIT $${i++} OFFSET $${i++}`;
  params.push(limitNum, offset);

  const result = await pool.query(query, params);

  res.json(result.rows);
});


// ==========================
// GET BY ID
// ==========================
exports.getMatematicasById = asyncHandler(async (req, res) => {

  const { id } = req.params;

  if (isNaN(id)) throw new AppError("ID inválido", 400);

  const result = await pool.query(
    `SELECT * FROM cursos WHERE id=$1 AND categoria='matematicas'`,
    [id]
  );

  if (result.rowCount === 0) {
    throw new AppError("Curso no encontrado", 404);
  }

  res.json(result.rows[0]);
});


// ==========================
// POST
// ==========================
exports.createMatematicas = asyncHandler(async (req, res) => {

  const { titulo, materia, vistas, nivel } = req.body;

  if (!titulo || !materia || !nivel) {
    throw new AppError("Campos obligatorios faltantes", 400);
  }

  const result = await pool.query(
    `INSERT INTO cursos (titulo, categoria, materia, vistas, nivel, created_by)
    VALUES ($1,'matematicas',$2,$3,$4,$5)
    RETURNING *`,
    [titulo.trim(), materia.trim(), vistas || 0, nivel.trim(), req.user.id]
  );

  logger.info({
    event: "MATEMATICAS_CREATED",
    userId: req.user.id,
    cursoId: result.rows[0].id
  });

  res.status(201).json(result.rows[0]);
});


// ==========================
// PUT
// ==========================
exports.updateMatematicas = asyncHandler(async (req, res) => {

  const { id } = req.params;
  const { titulo, materia, vistas, nivel } = req.body;

  if (!titulo || !materia || !nivel) {
    throw new AppError("Todos los campos son obligatorios", 400);
  }

  const result = await pool.query(
    `UPDATE cursos
    SET titulo=$1,materia=$2,vistas=$3,nivel=$4
    WHERE id=$5 AND categoria='matematicas'
    RETURNING *`,
    [titulo.trim(), materia.trim(), vistas || 0, nivel.trim(), id]
  );

  if (result.rowCount === 0) {
    throw new AppError("Curso no encontrado", 404);
  }

  logger.info({
    event: "MATEMATICAS_UPDATED",
    userId: req.user.id,
    cursoId: id
  });

  res.json(result.rows[0]);
});


// ==========================
// DELETE
// ==========================
exports.deleteMatematicas = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const result = await pool.query(
    `DELETE FROM cursos
    WHERE id=$1 AND categoria='matematicas'
    RETURNING *`,
    [id]
  );

  if (result.rowCount === 0) {
    throw new AppError("Curso no encontrado", 404);
  }

  logger.info({
    event: "MATEMATICAS_DELETED",
    userId: req.user.id,
    cursoId: id
  });

  res.json(result.rows[0]);
});
