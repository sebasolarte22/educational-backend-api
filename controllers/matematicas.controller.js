const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");
const courseService = require("../services/course.service");

// ==========================
// GET TODOS
// ==========================
exports.getMatematicas = asyncHandler(async (req, res) => {
  const { materia, nivel, ordenar, page, limit } = req.query;

  const pageNum = page ? parseInt(page) : 1;
  const limitNum = limit ? parseInt(limit) : 5;

  if (pageNum < 1) throw new AppError("page inválido", 400);
  if (limitNum < 1 || limitNum > 50) throw new AppError("limit fuera de rango", 400);

  const cursos = await courseService.getCursos({
    categoria: "matematicas",
    filters: { materia, nivel },
    ordenar,
    page: pageNum,
    limit: limitNum
  });

  res.json(cursos);
});


// ==========================
// GET BY ID
// ==========================
exports.getMatematicasById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) throw new AppError("ID inválido", 400);

  const curso = await courseService.getCursoById({
    id,
    categoria: "matematicas"
  });

  if (!curso) throw new AppError("Curso no encontrado", 404);

  res.json(curso);
});


// ==========================
// POST
// ==========================
exports.createMatematicas = asyncHandler(async (req, res) => {
  const { titulo, materia, vistas, nivel } = req.body;

  if (!titulo || !materia || !nivel) {
    throw new AppError("Campos obligatorios faltantes", 400);
  }

  const curso = await courseService.createCurso({
    titulo: titulo.trim(),
    categoria: "matematicas",
    materia: materia.trim(),
    vistas,
    nivel: nivel.trim(),
    created_by: req.user.id
  });

  logger.info({
    event: "MATEMATICAS_CREATED",
    userId: req.user.id,
    cursoId: curso.id
  });

  res.status(201).json(curso);
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

  const curso = await courseService.updateCurso({
    id,
    categoria: "matematicas",
    data: {
      titulo: titulo.trim(),
      materia: materia.trim(),
      vistas,
      nivel: nivel.trim()
    }
  });

  if (!curso) throw new AppError("Curso no encontrado", 404);

  logger.info({
    event: "MATEMATICAS_UPDATED",
    userId: req.user.id,
    cursoId: id
  });

  res.json(curso);
});


// ==========================
// DELETE
// ==========================
exports.deleteMatematicas = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const curso = await courseService.deleteCurso({
    id,
    categoria: "matematicas"
  });

  if (!curso) throw new AppError("Curso no encontrado", 404);

  logger.info({
    event: "MATEMATICAS_DELETED",
    userId: req.user.id,
    cursoId: id
  });

  res.json(curso);
});
