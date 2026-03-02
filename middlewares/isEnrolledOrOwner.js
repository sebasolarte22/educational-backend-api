const enrollmentRepo = require("../repositories/enrollment.rep");
const pool = require("../config/db");
const AppError = require("../utils/AppError");

async function isEnrolledOrOwner(req, res, next) {
  const userId = req.user.id;
  const userRole = req.user.role;
  const courseId = req.params.id;

  if (!courseId || isNaN(courseId)) {
    throw new AppError("Invalid course ID", 400);
  }

  // Admin siempre puede
  if (userRole === "admin") {
    return next();
  }

  // Verificar si es owner
  const courseResult = await pool.query(
    `SELECT created_by FROM courses WHERE id = $1`,
    [courseId]
  );

  if (courseResult.rowCount === 0) {
    throw new AppError("Course not found", 404);
  }

  const ownerId = courseResult.rows[0].created_by;

  if (ownerId === userId) {
    return next();
  }

  // Verificar enrollment
  const enrollment = await enrollmentRepo.findEnrollment(userId, courseId);

  if (!enrollment) {
    throw new AppError("You must enroll to access this course", 403);
  }

  next();
}

module.exports = isEnrolledOrOwner;