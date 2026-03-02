const repo = require("../repositories/lesson.repository");
const AppError = require("../utils/AppError");

async function createLesson(data) {
  const { section_id, title, position } = data;

  if (!section_id || !title || position === undefined) {
    throw new AppError("Missing required fields", 400);
  }

  return repo.createLesson(data);
}

async function getLessons(sectionId) {
  if (!sectionId) {
    throw new AppError("Section ID required", 400);
  }

  return repo.getLessonsBySection(sectionId);
}

async function getLesson(id) {
  const lesson = await repo.getLessonById(id);

  if (!lesson) {
    throw new AppError("Lesson not found", 404);
  }

  return lesson;
}

async function deleteLesson(id) {
  const lesson = await repo.deleteLesson(id);

  if (!lesson) {
    throw new AppError("Lesson not found", 404);
  }

  return lesson;
}

module.exports = {
  createLesson,
  getLessons,
  getLesson,
  deleteLesson
};