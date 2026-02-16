const rateLimit = require("express-rate-limit");

const aiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Demasiadas solicitudes a la IA. Intenta más tarde."
  }
});

module.exports = aiRateLimiter;
