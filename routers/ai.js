const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const aiRoleMiddleware = require("../middlewares/aiRoleMiddleware");
const aiRateLimiter = require("../middlewares/aiRateLimiter");
const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/AppError");

const aiService = require("../services/aiService");

router.post(
  "/explicar-curso",
  authMiddleware,
  aiRoleMiddleware,
  aiRateLimiter,
  asyncHandler(async (req, res) => {

    const { titulo, categoria, nivel } = req.body;

    if (!titulo || !categoria || !nivel) {
      throw new AppError("Campos obligatorios faltantes", 400);
    }

    const result = await aiService.explicarCurso(
      { titulo, categoria, nivel },
      req.user.id
    );

    res.json({
      success: true,
      data: result
    });

  })
);

module.exports = router;
