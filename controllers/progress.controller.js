const asyncHandler = require("../middlewares/asyncHandler");
const progressService = require("../services/progress.service");

const completeLesson = asyncHandler(async (req, res) => {
  const { lessonId, courseId } = req.body;

  const result = await progressService.completeLesson(
    req.user.id,
    lessonId,
    courseId
  );

  res.json(result);
});

module.exports = {
  completeLesson
};