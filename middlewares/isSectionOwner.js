const pool = require("../config/db");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

async function isSectionOwner(req, res, next) {
  const userId = req.user.id;
  const userRole = req.user.role;

  const rawSectionId = req.params.id || req.body.section_id;
  const sectionId = Number(rawSectionId);

  if (!sectionId || isNaN(sectionId)) {
    throw new AppError("Invalid section ID", 400);
  }

  // 👑 Admin siempre puede
  if (userRole === "admin") {
    logger.info({
      event: "ADMIN_SECTION_ACCESS_GRANTED",
      userId,
      sectionId
    });
    return next();
  }

  const result = await pool.query(
    `
    SELECT c.created_by
    FROM sections s
    JOIN courses c ON c.id = s.course_id
    WHERE s.id = $1
    `,
    [sectionId]
  );

  if (result.rowCount === 0) {
    throw new AppError("Section not found", 404);
  }

  const ownerId = result.rows[0].created_by;

  if (ownerId !== userId) {
    logger.warn({
      event: "UNAUTHORIZED_SECTION_ACCESS",
      userId,
      sectionId
    });

    throw new AppError("Unauthorized", 403);
  }

  logger.info({
    event: "SECTION_OWNER_ACCESS_GRANTED",
    userId,
    sectionId
  });

  next();
}

module.exports = isSectionOwner;