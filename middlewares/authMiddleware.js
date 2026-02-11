const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  // 1) Leer el header Authorization
  const authHeader = req.headers.authorization;

  // 2) Validar que exista
  if (!authHeader) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  // 3) Formato esperado: "Bearer TOKEN"
  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Formato de token inválido" });
  }

  try {
    // 4) Verificar token
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // 5) Guardar info del usuario en la request
    req.user = payload;

    // 6) Continuar
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado" });
    }
    return res.status(401).json({ error: "Token inválido" });
  }
}

module.exports = authMiddleware;


