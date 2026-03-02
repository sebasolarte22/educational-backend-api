const pool = require("../config/db");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

async function isLessonOwner(req, res, next) {
  const userId = req.user.id;
  const userRole = req.user.role;
  const { id } = req.params; // lesson id

  if (userRole === "admin") {
    logger.info({
      event: "ADMIN_ACCESS_GRANTED_LESSON",
      userId,
      resourceId: id
    });
    return next();
  }

  if (isNaN(id)) {
    throw new AppError("Invalid lesson ID", 400);
  }

  const result = await pool.query(
    `
    SELECT c.created_by
    FROM lessons l
    JOIN sections s ON s.id = l.section_id
    JOIN courses c ON c.id = s.course_id
    WHERE l.id = $1
    `,
    [id]
  );

  if (result.rowCount === 0) {
    throw new AppError("Lesson not found", 404);
  }

  const courseOwnerId = result.rows[0].created_by;

  if (courseOwnerId !== userId) {
    logger.warn({
      event: "UNAUTHORIZED_LESSON_ACCESS",
      userId,
      resourceId: id
    });

    throw new AppError(
      "You do not have permission to modify this lesson",
      403
    );
  }

  logger.info({
    event: "LESSON_OWNER_ACCESS_GRANTED",
    userId,
    resourceId: id
  });

  next();
}

module.exports = isLessonOwner;