const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/progress.controller");

router.post("/complete-lesson", auth, controller.completeLesson);

module.exports = router;