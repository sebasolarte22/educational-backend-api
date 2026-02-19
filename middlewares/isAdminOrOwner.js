const pool = require("../config/db");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

async function isAdminOrOwner(req, res, next) {
  const userId = req.user.id;
  const userRole = req.user.role;
  const { id } = req.params;

  if (userRole === "admin") {
    logger.info({
      event: "ADMIN_ACCESS_GRANTED",
      userId,
      resourceId: id
    });
    return next();
  }

  if (isNaN(id)) {
    throw new AppError("ID inválido", 400);
  }

  const result = await pool.query(
    `SELECT created_by FROM cursos WHERE id = $1`,
    [id]
  );

  if (result.rowCount === 0) {
    throw new AppError("Curso no encontrado", 404);
  }

  const curso = result.rows[0];

  if (curso.created_by !== userId) {
    logger.warn({
      event: "UNAUTHORIZED_RESOURCE_ACCESS",
      userId,
      resourceId: id
    });

    throw new AppError(
      "No tienes permisos para modificar este recurso",
      403
    );
  }

  logger.info({
    event: "OWNER_ACCESS_GRANTED",
    userId,
    resourceId: id
  });

  next();
}

module.exports = isAdminOrOwner;
