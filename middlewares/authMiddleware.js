const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token no proporcionado", 401);
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    throw new AppError("Formato de token inválido", 401);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = payload;

    logger.info({
      event: "AUTH_SUCCESS",
      userId: payload.id
    });

    next();
  } catch (err) {
    logger.warn({
      event: "AUTH_TOKEN_ERROR",
      message: err.message
    });

    throw new AppError("Token inválido o expirado", 401);
  }
}

module.exports = authMiddleware;
