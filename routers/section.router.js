const express = require("express");
const router = express.Router();

const controller = require("../controllers/section.controller");
const auth = require("../middlewares/auth.middleware");
const isAdminOrOwner = require("../middlewares/isAdminOrOwner");
const isSectionOwner = require("../middlewares/isSectionOwner");

// Create section
router.post("/", auth, isAdminOrOwner, controller.createSection);

// Get sections by course
router.get("/:courseId", controller.getSectionsByCourse);

// Delete section
router.delete("/:id", auth, isSectionOwner, controller.deleteSection);

module.exports = router;