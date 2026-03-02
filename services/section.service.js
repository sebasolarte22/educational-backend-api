const repo = require("../repositories/section.repository");
const AppError = require("../utils/AppError");

async function createSection(data) {
  const { course_id, title, position } = data;

  if (!course_id || !title || position === undefined) {
    throw new AppError("Missing required fields", 400);
  }

  return repo.createSection(data);
}

async function getSections(courseId) {
  if (!courseId) {
    throw new AppError("Course ID required", 400);
  }

  return repo.getSectionsByCourse(courseId);
}

async function deleteSection(id) {
  const section = await repo.deleteSection(id);

  if (!section) {
    throw new AppError("Section not found", 404);
  }

  return section;
}

module.exports = {
  createSection,
  getSections,
  deleteSection
};