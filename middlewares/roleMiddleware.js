const AppError = require("../utils/AppError");

function roleMiddleware(...rolesPermitidos) {
  return (req, res, next) => {

    if (!req.user || !req.user.role) {
      throw new AppError("Información de usuario no disponible", 500);
    }

    if (!rolesPermitidos.includes(req.user.role)) {
      throw new AppError("No tienes permisos para esta acción", 403);
    }

    next();
  };
}

module.exports = roleMiddleware;
