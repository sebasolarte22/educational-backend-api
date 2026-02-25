const express = require("express");
const router = express.Router();

const controller = require("../controllers/course.controller");
const auth = require("../middlewares/authMiddleware");
const isAdminOrOwner = require("../middlewares/isAdminOrOwner");

// ==========================
// PROGRAMACION
// ==========================
router.get("/programacion", controller.getProgramacion);
router.get("/programacion/:id", controller.getProgramacionById);

router.post("/programacion", auth, controller.createProgramacion);
router.put("/programacion/:id", auth, isAdminOrOwner, controller.updateProgramacion);
router.patch("/programacion/:id", auth, isAdminOrOwner, controller.patchCurso);
router.delete("/programacion/:id", auth, isAdminOrOwner, controller.deleteProgramacion);

// ==========================
// MATEMATICAS
// ==========================
router.get("/matematicas", controller.getMatematicas);
router.get("/matematicas/:id", controller.getMatematicasById);

router.post("/matematicas", auth, controller.createMatematicas);
router.put("/matematicas/:id", auth, isAdminOrOwner, controller.updateMatematicas);
router.patch("/matematicas/:id", auth, isAdminOrOwner, controller.patchCurso);
router.delete("/matematicas/:id", auth, isAdminOrOwner, controller.deleteMatematicas);

module.exports = router;