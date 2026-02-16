const AppError = require("../utils/AppError");

function aiRoleMiddleware(req, res, next) {
  const role = req.user.role;

  const allowedRoles = ["admin"];

  if (!allowedRoles.includes(role)) {
    throw new AppError("No tienes permisos para usar la IA", 403);
  }

  next();
}

module.exports = aiRoleMiddleware;
