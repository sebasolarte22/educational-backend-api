const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");
const courseService = require("../services/course.service");

// ==========================
// GET TODOS
// ==========================
exports.getProgramacion = asyncHandler(async (req, res) => {
  const { lenguaje, nivel, ordenar, page, limit } = req.query;

  const pageNum = page ? parseInt(page) : 1;
  const limitNum = limit ? parseInt(limit) : 5;

  if (pageNum < 1) throw new AppError("page inválido", 400);
  if (limitNum < 1 || limitNum > 50) throw new AppError("limit fuera de rango", 400);

  const cursos = await courseService.getCursos({
    categoria: "programacion",
    filters: { lenguaje, nivel },
    ordenar,
    page: pageNum,
    limit: limitNum
  });

  res.json(cursos);
});


// ==========================
// GET BY ID
// ==========================
exports.getProgramacionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) throw new AppError("ID inválido", 400);

  const curso = await courseService.getCursoById({
    id,
    categoria: "programacion"
  });

  if (!curso) throw new AppError("Curso no encontrado", 404);

  res.json(curso);
});


// ==========================
// POST
// ==========================
exports.createProgramacion = asyncHandler(async (req, res) => {
  const { titulo, lenguaje, vistas, nivel } = req.body;

  if (!titulo || !lenguaje || !nivel) {
    throw new AppError("Campos obligatorios faltantes", 400);
  }

  const curso = await courseService.createCurso({
    titulo: titulo.trim(),
    categoria: "programacion",
    lenguaje: lenguaje.trim(),
    vistas,
    nivel: nivel.trim(),
    created_by: req.user.id
  });

  logger.info({
    event: "PROGRAMACION_CREATED",
    userId: req.user.id,
    cursoId: curso.id
  });

  res.status(201).json(curso);
});


// ==========================
// PUT
// ==========================
exports.updateProgramacion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { titulo, lenguaje, vistas, nivel } = req.body;

  if (!titulo || !lenguaje || !nivel) {
    throw new AppError("Todos los campos son obligatorios", 400);
  }

  const curso = await courseService.updateCurso({
    id,
    categoria: "programacion",
    data: {
      titulo: titulo.trim(),
      lenguaje: lenguaje.trim(),
      vistas,
      nivel: nivel.trim()
    }
  });

  if (!curso) throw new AppError("Curso no encontrado", 404);

  logger.info({
    event: "PROGRAMACION_UPDATED",
    userId: req.user.id,
    cursoId: id
  });

  res.json(curso);
});


// ==========================
// DELETE
// ==========================
exports.deleteProgramacion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const curso = await courseService.deleteCurso({
    id,
    categoria: "programacion"
  });

  if (!curso) throw new AppError("Curso no encontrado", 404);

  logger.info({
    event: "PROGRAMACION_DELETED",
    userId: req.user.id,
    cursoId: id
  });

  res.json(curso);
});
