const pool = require("../config/db");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

async function isAdminOrOwner(req, res, next) {
  const userId = req.user.id;
  const userRole = req.user.role;

  // Puede venir de params (:id) o del body (course_id)
  const rawCourseId = req.params.id || req.body.course_id;
  const courseId = Number(rawCourseId);

  // 🔒 Validación fuerte
  if (!courseId || isNaN(courseId)) {
    throw new AppError("Invalid course ID", 400);
  }

  // 👑 ADMIN siempre puede
  if (userRole === "admin") {
    logger.info({
      event: "ADMIN_ACCESS_GRANTED",
      userId,
      courseId
    });
    return next();
  }

  // 🔎 Buscar curso
  const result = await pool.query(
    `SELECT created_by FROM courses WHERE id = $1`,
    [courseId]
  );

  if (result.rowCount === 0) {
    throw new AppError("Course not found", 404);
  }

  const course = result.rows[0];

  // 🔒 Validar ownership
  if (course.created_by !== userId) {
    logger.warn({
      event: "UNAUTHORIZED_RESOURCE_ACCESS",
      userId,
      courseId
    });

    throw new AppError(
      "You do not have permission to modify this resource",
      403
    );
  }

  logger.info({
    event: "OWNER_ACCESS_GRANTED",
    userId,
    courseId
  });

  next();
}

module.exports = isAdminOrOwner;