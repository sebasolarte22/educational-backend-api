const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/progress.controller");

// LIST ALL USER PROGRESS
router.get("/", auth, controller.getMyProgress);

// GET ONE COURSE
router.get("/:courseId", auth, controller.getCourseProgress);

// SAVE / UPDATE PROGRESS
router.post("/:courseId", auth, controller.saveProgress);

// MARK COMPLETE
router.post("/:courseId/complete", auth, controller.completeCourse);

module.exports = router;