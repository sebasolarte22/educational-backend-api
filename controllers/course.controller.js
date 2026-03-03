const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/AppError");
const courseService = require("../services/course.service");

// ==========================
// GET ALL COURSES
// ==========================
const getAllCourses = asyncHandler(async (req, res) => {
  const { sort, page, limit } = req.query;

  const courses = await courseService.getCourses({
    category: null,
    filters: {},
    sort,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 20
  });

  res.json(courses);
});

// ==========================
// PROGRAMMING
// ==========================
const getProgramming = asyncHandler(async (req, res) => {
  const { language, level, sort, page, limit } = req.query;

  const courses = await courseService.getCourses({
    category: "programming",
    filters: { language, level },
    sort,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10
  });

  res.json(courses);
});

const getProgrammingById = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseById({
    id: req.params.id,
    category: "programming"
  });

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  res.json(course);
});

const createProgramming = asyncHandler(async (req, res) => {
  const course = await courseService.createCourse({
    ...req.body,
    category: "programming",
    created_by: req.user.id
  });

  res.status(201).json(course);
});

const updateProgramming = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourse({
    id: req.params.id,
    category: "programming",
    data: req.body
  });

  res.json(course);
});

const deleteProgramming = asyncHandler(async (req, res) => {
  const course = await courseService.deleteCourse({
    id: req.params.id,
    category: "programming"
  });

  res.json(course);
});

// ==========================
// MATHEMATICS
// ==========================
const getMathematics = asyncHandler(async (req, res) => {
  const { subject, level, sort, page, limit } = req.query;

  const courses = await courseService.getCourses({
    category: "mathematics",
    filters: { subject, level },
    sort,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10
  });

  res.json(courses);
});

const getMathematicsById = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseById({
    id: req.params.id,
    category: "mathematics"
  });

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  res.json(course);
});

const createMathematics = asyncHandler(async (req, res) => {
  const course = await courseService.createCourse({
    ...req.body,
    category: "mathematics",
    created_by: req.user.id
  });

  res.status(201).json(course);
});

const updateMathematics = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourse({
    id: req.params.id,
    category: "mathematics",
    data: req.body
  });

  res.json(course);
});

const deleteMathematics = asyncHandler(async (req, res) => {
  const course = await courseService.deleteCourse({
    id: req.params.id,
    category: "mathematics"
  });

  res.json(course);
});

// ==========================
// FULL STRUCTURE + PROGRESS
// ==========================
const getCourseFull = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseFull(
    req.params.id,
    req.user ? req.user.id : null
  );

  res.json(course);
});

// ==========================
// EXPORTS
// ==========================
module.exports = {
  getAllCourses,
  getProgramming,
  getProgrammingById,
  createProgramming,
  updateProgramming,
  deleteProgramming,
  getMathematics,
  getMathematicsById,
  createMathematics,
  updateMathematics,
  deleteMathematics,
  getCourseFull
};