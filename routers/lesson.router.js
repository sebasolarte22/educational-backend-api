const express = require("express");
const router = express.Router();

const controller = require("../controllers/lesson.controller");
const auth = require("../middlewares/auth.middleware");
const isSectionOwner = require("../middlewares/isSectionOwner");
const isLessonOwner = require("../middlewares/isLessonOwner");

// Create lesson
router.post("/", auth, isSectionOwner, controller.createLesson);

// Get lessons by section
router.get("/section/:sectionId", controller.getLessonsBySection);

// Get single lesson
router.get("/:id", controller.getLessonById);

// Delete lesson
router.delete("/:id", auth, isLessonOwner, controller.deleteLesson);

module.exports = router;