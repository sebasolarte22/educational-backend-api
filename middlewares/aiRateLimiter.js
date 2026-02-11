const rateLimit = require("express-rate-limit");

const aiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 5, // 5 requests por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Demasiadas solicitudes a la IA. Intenta más tarde."
  }
});

module.exports = aiRateLimiter;
