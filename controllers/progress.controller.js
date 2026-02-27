const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/AppError");
const progressService = require("../services/progress.service");

// LIST ALL PROGRESS
const getMyProgress = asyncHandler(async (req, res) => {
  const data = await progressService.getUserProgress(req.user.id);
  res.json(data);
});

// GET ONE
const getCourseProgress = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;

  const progress = await progressService.getCourseProgress(
    req.user.id,
    courseId
  );

  if (!progress) throw new AppError("Progress not found", 404);

  res.json(progress);
});

// SAVE / UPDATE
const saveProgress = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;

  const progress = await progressService.saveProgress(
    req.user.id,
    courseId,
    req.body
  );

  res.json(progress);
});

// COMPLETE
const completeCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;

  const result = await progressService.markCompleted(
    req.user.id,
    courseId
  );

  res.json(result);
});

module.exports = {
  getMyProgress,
  getCourseProgress,
  saveProgress,
  completeCourse
};