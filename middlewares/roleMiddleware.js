function roleMiddleware(...rolesPermitidos) {
  return (req, res, next) => {

    // Seguridad extra (authMiddleware debería haber corrido antes)
    if (!req.user || !req.user.role) {
      return res.status(500).json({
        error: "Información de usuario no disponible"
      });
    }

    // Verificar si el rol del usuario está permitido
    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({
        error: "No tienes permisos para esta acción"
      });
    }

    // Todo bien → continuar
    next();
  };
}

module.exports = roleMiddleware;
