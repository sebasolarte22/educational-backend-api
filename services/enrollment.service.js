const repo = require("../repositories/enrollment.rep");
const courseService = require("./course.service");
const AppError = require("../utils/AppError");

async function enrollUser(userId, courseId) {
  const course = await courseService.getCourseById({
    id: courseId,
    category: "programming" 
  });

  if (!course) throw new AppError("Course not found", 404);

  const existing = await repo.findEnrollment(userId, courseId);
  if (existing) return existing; 

  const enrollment = await repo.createEnrollment(userId, courseId);

  return enrollment || existing;
}

async function getMyCourses(userId) {
  return repo.getUserEnrollments(userId);
}

module.exports = {
  enrollUser,
  getMyCourses
};