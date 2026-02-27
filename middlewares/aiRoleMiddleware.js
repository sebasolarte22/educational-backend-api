const AppError = require("../utils/AppError");

function aiRoleMiddleware(req, res, next) {
  const role = req.user?.role;

  const allowedRoles = ["admin"];

  if (!allowedRoles.includes(role)) {
    throw new AppError("You are not allowed to use AI features", 403);
  }

  next();
}

module.exports = aiRoleMiddleware;
