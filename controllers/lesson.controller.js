const asyncHandler = require("../middlewares/asyncHandler");
const service = require("../services/lesson.service");

const createLesson = asyncHandler(async (req, res) => {
  const lesson = await service.createLesson(req.body);
  res.status(201).json(lesson);
});

const getLessonsBySection = asyncHandler(async (req, res) => {
  const lessons = await service.getLessons(req.params.sectionId);
  res.json(lessons);
});

const getLessonById = asyncHandler(async (req, res) => {
  const lesson = await service.getLesson(req.params.id);
  res.json(lesson);
});

const deleteLesson = asyncHandler(async (req, res) => {
  const lesson = await service.deleteLesson(req.params.id);
  res.json(lesson);
});

module.exports = {
  createLesson,
  getLessonsBySection,
  getLessonById,
  deleteLesson
};