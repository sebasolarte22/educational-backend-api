const repository = require("../repositories/course.repository");
const lessonProgressRepo = require("../repositories/lessonProgress.rep");
const cache = require("../infrastructure/redis/cacheRepository");
const AppError = require("../utils/AppError");

// ==========================
// GET LIST
// ==========================
async function getCourses(params) {
  const { category, filters, sort, page, limit } = params;

  const cacheKey = `courses:${category}:${JSON.stringify(filters)}:${sort}:${page}:${limit}`;
  const cached = await cache.get(cacheKey);

  if (cached) return cached;

  const courses = await repository.getCourses(params);

  await cache.set(cacheKey, courses, 60);

  return courses;
}

// ==========================
// GET BY ID
// ==========================
async function getCourseById({ id, category }) {
  const course = await repository.getCourseById(id, category);
  return course;
}

// ==========================
// CREATE
// ==========================
async function createCourse(data) {
  const course = await repository.createCourse(data);
  await cache.delByPattern(`courses:${data.category}:*`);
  return course;
}

// ==========================
// UPDATE
// ==========================
async function updateCourse(params) {
  const course = await repository.updateCourse(params);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  await cache.del(`course:${params.category}:${params.id}`);
  await cache.delByPattern(`courses:${params.category}:*`);

  return course;
}

// ==========================
// DELETE
// ==========================
async function deleteCourse({ id, category }) {
  const course = await repository.deleteCourse(id, category);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  await cache.del(`course:${category}:${id}`);
  await cache.delByPattern(`courses:${category}:*`);

  return course;
}

// ==========================
// FULL STRUCTURE + PROGRESS
// ==========================
async function getCourseFull(courseId, userId = null) {
  const rows = await repository.getCourseFullStructure(courseId);

  if (rows.length === 0) {
    throw new AppError("Course not found", 404);
  }

  let completedLessonIds = [];
  let progress = 0;
  let completedCourse = false;

  if (userId) {
    completedLessonIds =
      await lessonProgressRepo.getCompletedLessonIds(userId, courseId);

    const totalLessons =
      await lessonProgressRepo.countTotalLessons(courseId);

    progress = totalLessons === 0
      ? 0
      : Math.round((completedLessonIds.length / totalLessons) * 100);

    completedCourse = progress === 100;
  }

  const course = {
    id: rows[0].course_id,
    title: rows[0].course_title,
    category: rows[0].category,
    level: rows[0].level,
    progress,
    completed_course: completedCourse,
    sections: []
  };

  const sectionsMap = {};

  for (const row of rows) {
    if (!row.section_id) continue;

    if (!sectionsMap[row.section_id]) {
      sectionsMap[row.section_id] = {
        id: row.section_id,
        title: row.section_title,
        position: row.section_position,
        lessons: []
      };

      course.sections.push(sectionsMap[row.section_id]);
    }

    if (row.lesson_id) {
      sectionsMap[row.section_id].lessons.push({
        id: row.lesson_id,
        title: row.lesson_title,
        position: row.lesson_position,
        completed: completedLessonIds.includes(row.lesson_id)
      });
    }
  }

  return course;
}

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseFull
};