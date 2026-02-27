const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/AppError");
const aiService = require("../services/ai.service");

exports.explainCourse = asyncHandler(async (req, res) => {
  const { title, category, level } = req.body;

  if (!title || !category || !level) {
    throw new AppError("Missing required fields", 400);
  }

  const result = await aiService.explainCourse(
    { title, category, level },
    req.user.id
  );

  res.json({
    success: true,
    data: result
  });
});