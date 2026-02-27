const AppError = require("../utils/AppError");

function roleMiddleware(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      throw new AppError("User info not available", 500);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("You do not have permission for this action", 403);
    }

    next();
  };
}

module.exports = roleMiddleware;
