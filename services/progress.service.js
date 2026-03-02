const lessonProgressRepo = require("../repositories/lessonProgress.rep");
const enrollmentRepo = require("../repositories/enrollment.rep");
const AppError = require("../utils/AppError");

// Marcar lesson como completada y calcular progreso real
async function completeLesson(userId, lessonId, courseId) {
  if (!lessonId || !courseId) {
    throw new AppError("Lesson ID and Course ID are required", 400);
  }

  const enrollment = await enrollmentRepo.findEnrollment(userId, courseId);

  if (!enrollment) {
    throw new AppError("You must enroll first", 403);
  }

  await lessonProgressRepo.markLessonCompleted(userId, lessonId);

  const completedIds =
    await lessonProgressRepo.getCompletedLessonIds(userId, courseId);

  const total =
    await lessonProgressRepo.countTotalLessons(courseId);

  const progress = total === 0
    ? 0
    : Math.round((completedIds.length / total) * 100);

  return {
    completed_lessons: completedIds.length,
    total_lessons: total,
    progress,
    completed_course: progress === 100
  };
}

module.exports = {
  completeLesson
};