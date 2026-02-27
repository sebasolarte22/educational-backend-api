const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const aiRole = require("../middlewares/aiRoleMiddleware");
const aiRateLimiter = require("../middlewares/aiRateLimiter");

const { explainCourse } = require("../controllers/ai.controller");

router.post(
  "/explain-course",
  auth,
  aiRole,
  aiRateLimiter,
  explainCourse
);

module.exports = router;