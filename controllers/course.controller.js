const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");
const courseService = require("../services/course.service");

// ==========================
// PROGRAMACION
// ==========================

// GET

const getProgramacion = asyncHandler(async (req, res) => {
  const { lenguaje, nivel, ordenar, page, limit } = req.query;

  const cursos = await courseService.getCursos({
    categoria: "programacion",
    filters: { lenguaje, nivel },
    ordenar,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 5
  });

  res.json(cursos);
});

// GET BY ID

const getProgramacionById = asyncHandler(async (req, res) => {
  const curso = await courseService.getCursoById({
    id: req.params.id,
    categoria: "programacion"
  });

  if (!curso) throw new AppError("Curso no encontrado", 404);

  res.json(curso);
});

// POST

const createProgramacion = asyncHandler(async (req, res) => {
  const curso = await courseService.createCurso({
    ...req.body,
    categoria: "programacion",
    created_by: req.user.id
  });

  res.status(201).json(curso);
});

// PUT 

const updateProgramacion = asyncHandler(async (req, res) => {
  const curso = await courseService.updateCurso({
    id: req.params.id,
    categoria: "programacion",
    data: req.body
  });

  if (!curso) throw new AppError("Curso no encontrado", 404);

  res.json(curso);
});

// DELETE

const deleteProgramacion = asyncHandler(async (req, res) => {
  const curso = await courseService.deleteCurso({
    id: req.params.id,
    categoria: "programacion"
  });

  if (!curso) throw new AppError("Curso no encontrado", 404);

  res.json(curso);
});

// ==========================
// MATEMATICAS
// ==========================

// GET

const getMatematicas = asyncHandler(async (req, res) => {
  const { materia, nivel, ordenar, page, limit } = req.query;

  const cursos = await courseService.getCursos({
    categoria: "matematicas",
    filters: { materia, nivel },
    ordenar,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 5
  });

  res.json(cursos);
});

// GET BY ID

const getMatematicasById = asyncHandler(async (req, res) => {
  const curso = await courseService.getCursoById({
    id: req.params.id,
    categoria: "matematicas"
  });

  if (!curso) throw new AppError("Curso no encontrado", 404);

  res.json(curso);
});

// POST

const createMatematicas = asyncHandler(async (req, res) => {
  const curso = await courseService.createCurso({
    ...req.body,
    categoria: "matematicas",
    created_by: req.user.id
  });

  res.status(201).json(curso);
});

const updateMatematicas = asyncHandler(async (req, res) => {
  const curso = await courseService.updateCurso({
    id: req.params.id,
    categoria: "matematicas",
    data: req.body
  });

  if (!curso) throw new AppError("Curso no encontrado", 404);

  res.json(curso);
});

// DELETE

const deleteMatematicas = asyncHandler(async (req, res) => {
  const curso = await courseService.deleteCurso({
    id: req.params.id,
    categoria: "matematicas"
  });

  if (!curso) throw new AppError("Curso no encontrado", 404);

  res.json(curso);
});

// PATCH GENÉRICO
const patchCurso = asyncHandler(async (req, res) => {
  const curso = await courseService.updateCurso({
    id: req.params.id,
    categoria: req.body.categoria,
    data: req.body
  });

  if (!curso) throw new AppError("Curso no encontrado", 404);

  res.json(curso);
});

module.exports = {
  getProgramacion,
  getProgramacionById,
  createProgramacion,
  updateProgramacion,
  deleteProgramacion,
  getMatematicas,
  getMatematicasById,
  createMatematicas,
  updateMatematicas,
  deleteMatematicas,
  patchCurso
};