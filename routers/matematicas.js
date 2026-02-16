const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const authMiddleware = require("../middlewares/authMiddleware");
const isAdminOrOwner = require("../middlewares/isAdminOrOwner");
const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

// GET ALL
router.get("/", asyncHandler(async (req, res) => {

  const result = await pool.query(
    `SELECT * FROM cursos WHERE categoria='matematicas'`
  );

  res.json(result.rows);

}));

// GET BY ID
router.get("/:id", asyncHandler(async (req, res) => {

  const { id } = req.params;

  const result = await pool.query(
    `SELECT * FROM cursos WHERE id=$1 AND categoria='matematicas'`,
    [id]
  );

  if (result.rowCount === 0) {
    throw new AppError("Curso no encontrado", 404);
  }

  res.json(result.rows[0]);

}));

// POST
router.post("/", authMiddleware, asyncHandler(async (req, res) => {

  const { titulo, vistas, nivel } = req.body;

  const result = await pool.query(
    `INSERT INTO cursos (titulo,categoria,vistas,nivel,created_by)
     VALUES ($1,'matematicas',$2,$3,$4)
     RETURNING *`,
    [titulo, vistas || 0, nivel, req.user.id]
  );

  logger.info({
    event: "MATEMATICAS_CREATED",
    userId: req.user.id,
    cursoId: result.rows[0].id
  });

  res.status(201).json(result.rows[0]);

}));

module.exports = router;
