const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const aiRoleMiddleware = require("../middlewares/aiRoleMiddleware");
const aiRateLimiter = require("../middlewares/aiRateLimiter");

const { explicarCurso } = require("../controllers/ai.controller");

router.post(
  "/explicar-curso",
  authMiddleware,
  aiRoleMiddleware,
  aiRateLimiter,
  explicarCurso
);

module.exports = router;
