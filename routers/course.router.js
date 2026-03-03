const express = require("express");
const router = express.Router();

const controller = require("../controllers/course.controller");
const auth = require("../middlewares/auth.middleware");
const isAdminOrOwner = require("../middlewares/isAdminOrOwner");
const isEnrolledOrOwner = require("../middlewares/isEnrolledOrOwner");

// 🔥 IMPORTANTE
router.get("/", controller.getAllCourses);

router.get("/:id/full", auth, isEnrolledOrOwner, controller.getCourseFull);

// PROGRAMMING
router.get("/programming", controller.getProgramming);
router.get("/programming/:id", controller.getProgrammingById);
router.post("/programming", auth, controller.createProgramming);
router.put("/programming/:id", auth, isAdminOrOwner, controller.updateProgramming);
router.delete("/programming/:id", auth, isAdminOrOwner, controller.deleteProgramming);

// MATHEMATICS
router.get("/mathematics", controller.getMathematics);
router.get("/mathematics/:id", controller.getMathematicsById);
router.post("/mathematics", auth, controller.createMathematics);
router.put("/mathematics/:id", auth, isAdminOrOwner, controller.updateMathematics);
router.delete("/mathematics/:id", auth, isAdminOrOwner, controller.deleteMathematics);

module.exports = router;