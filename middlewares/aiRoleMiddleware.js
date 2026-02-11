function aiRoleMiddleware(req, res, next) {
  const role = req.user.role;

  // Roles permitidos para usar IA
  const allowedRoles = ["admin"];

  if (!allowedRoles.includes(role)) {
    return res.status(403).json({
      success: false,
      error: "No tienes permisos para usar la IA"
    });
  }

  next();
}

module.exports = aiRoleMiddleware;
