const express = require("express");
const router = express.Router();

const controller = require("../controllers/enrollment.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/:courseId", auth, controller.enroll);
router.get("/", auth, controller.getMyCourses);

module.exports = router;