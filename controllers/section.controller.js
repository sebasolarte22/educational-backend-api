const asyncHandler = require("../middlewares/asyncHandler");
const service = require("../services/section.service");

const createSection = asyncHandler(async (req, res) => {
  const section = await service.createSection(req.body);
  res.status(201).json(section);
});

const getSectionsByCourse = asyncHandler(async (req, res) => {
  const sections = await service.getSections(req.params.courseId);
  res.json(sections);
});

const deleteSection = asyncHandler(async (req, res) => {
  const section = await service.deleteSection(req.params.id);
  res.json(section);
});

module.exports = {
  createSection,
  getSectionsByCourse,
  deleteSection
};