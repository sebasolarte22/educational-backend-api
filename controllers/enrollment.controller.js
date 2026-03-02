const asyncHandler = require("../middlewares/asyncHandler");
const service = require("../services/enrollment.service");

const enroll = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;

  const enrollment = await service.enrollUser(
    req.user.id,
    courseId
  );

  res.status(201).json(enrollment);
});

const getMyCourses = asyncHandler(async (req, res) => {
  const data = await service.getMyCourses(req.user.id);
  res.json(data);
});

module.exports = {
  enroll,
  getMyCourses
};